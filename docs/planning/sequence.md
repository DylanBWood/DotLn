# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the index
and refutation subject. It grants no activation authority. For rationale see
[the planning map](work-order-map.md). Closed entries remain until the operator
changes the horizon.

Planning entry returns the pending [follow-up register](followups.json) in
bounded pages. Use `npm run plan -- followups` for its current counts, source
pointers and continuation command; untouched items persist across passes.

Lane pairs (operator direction, 2026-09-16; recut 2026-09-17): from WO-141
onward the queued entries are grouped two per blank-separated pair for two
parallel lanes. Inside a pair the two orders name disjoint primary surfaces
and neither hard-depends on the other; one entry is the delivery order and
the other is by preference an evidence-only or machinery order. The run after
the last pair (WO-066 and WO-057) keeps its serial reading order until R2.
One order at a time passes final review and release close, and the second
lane's final review integrates main by the checklist in product 07
§Independent workflows and integration. The pairs and their evidence are in
[the vision-into-use document](vision-into-use-2026-09-17.md) §4; the
earlier cut is in [the R1 replan document](r1-replan-2026-09-16.md) §7.

Cleanup pass (2026-09-19): WO-142 and WO-084 form the first queued pair, the
pass the operator budgeted. The same day's second pass, from the operator's
answers, adds the pair WO-143 and WO-144 directly after it (the resident's
lock recovery, on the critical path, and outside-project writes as a role or
support grant) and the pair WO-145 and WO-090 after WO-140 and WO-056. WO-138
keeps its slot beside WO-071: its pilot reads public inputs only, so WO-137's
successful live row admits it. WO-085 to WO-089 stay last. The evidence is in
[the cleanup planning document](outstanding-cleanup-2026-09-19.md) §4, §5 and
§10.

Copilot CLI pass (2026-09-20): WO-146 takes its own one-entry slot directly
after WO-140 and WO-056 and before WO-145 and WO-090. It shares a host file
with WO-140 and the loadouts and regenerated bundle with WO-145, and it writes
product 07 and the security document before WO-090 restructures them, so it
pairs with none of them; it may run in the second lane beside WO-056 once
WO-140 has closed. It is operator tooling, not critical path, and no pair is
recut. The evidence is in
[the Copilot CLI planning document](copilot-cli-integration-2026-09-20.md) §7.

Standard pass (2026-09-21): after the WO-069 close, WO-147 and WO-148 form
a new pair directly after WO-138 and WO-071 (the resident's lock under live
contention, which WO-143 boarded for the planner ahead of WO-111, and the
operator-raised binding of a resident to the active order; disjoint surfaces,
no hard edge). WO-149 takes a one-entry slot after them, as WO-146 did: it
may run beside whichever of the pair is still open and must not make WO-120
or WO-063 wait. No existing pair is recut. The evidence is in
[the standard-pass planning document](standard-pass-2026-09-21.md) §5 and §6.

Operator answer (2026-09-21, second pass): WO-150 takes a one-entry slot
directly after WO-138 and WO-071 and before WO-147 and WO-148, from the
operator's acceptance of the Tinkerer three-trial reading (the economy
support on by default). It edits the loadouts and regenerates the bundle,
as WO-149 does, so the two stay sequential; it may run beside whichever of
WO-138 and WO-071 is still open and must not make WO-147 or WO-148 wait.
The evidence is in
[the standard-pass planning document](standard-pass-2026-09-21.md) §12.

<!-- dotln-work-order-sequence:start -->

- WO-132 — Machinery stand-down
- WO-126 — Process debt
- WO-042 — Authority provenance and monotone envelopes
- WO-043 — Typed dependency truth
- WO-125 — Codex effort selection
- WO-128 — Fresh gates pass first time
- WO-129 — Suite evidence keyed by declared inputs
- WO-130 — Suites execute in a replica of declared inputs
- WO-131 — Remaining suites declared under replica execution
- WO-044 — Writing-worker and unattended-launch harness truth
- WO-067 — PresencePolicy compiled
- WO-045 — Event-log and hook-input decoders
- WO-046 — Executable program grammar as a type
- WO-047 — Replay environment projector
- WO-048 — Worker and verification hosts decode on-disk state
- WO-050 — Reactor typed state slices
- WO-133 — Stand-down residue
- WO-068 — Resident host
- WO-049 — Target-worktree harness bundle
- WO-051 — Source-change writer request and transport profile
- WO-121 — Presence signals with origin
- WO-119 — Executable discovery producer
- WO-052 — Source-change host and commit receipt
- WO-122 — Actor catalog: cli-worker and human-handoff

- WO-141 — No guessing, enforced
- WO-136 — Authority enforcement boundary

- WO-135 — Planning-gate corrections
- WO-053 — The first external source change

- WO-139 — Subagent admission cap
- WO-054 — Verification over a real worktree

- WO-137 — Local runner readiness
- WO-055 — Repair continuation

- WO-142 — Outstanding cleanup
- WO-084 — Ledger order and index

- WO-143 — Resident lock recovery
- WO-144 — Outside-project write grant

- WO-140 — Gate sandbox preflight and usage readback
- WO-056 — Live blinded verification and repair

- WO-146 — Copilot CLI harness

- WO-145 — Tinkerer economy experiment
- WO-090 — Shorter cold start

- WO-110 — Local-model transport
- WO-099 — Mission check

- WO-079 — Worktree integrate
- WO-069 — Configuration root

- WO-138 — Local-model role qualification pilot
- WO-071 — Registered target repositories

- WO-150 — Tinkerer economy on by default

- WO-147 — Resident lock contention
- WO-148 — Resident binding

- WO-149 — Codex sessions begin

- WO-120 — Derived work identity
- WO-063 — Outward-artifact lint

- WO-100 — Preauthorized portfolio and work derivation
- WO-064 — Target publish

- WO-111 — The unattended hour
- WO-114 — Runtime status projection

- WO-070 — Beacon portability
- WO-115 — Console parity contract

- WO-060 — SourceBundle contract
- WO-116 — Audit projection served

- WO-065 — Pull-request state observation
- WO-117 — Console live host

- WO-066 — Review-comment resolution loop
- WO-057 — Browser runtime truth

- WO-058 — Visual and network claim types
- WO-059 — Playwright evidence adapter
- WO-061 — StoryContract compile
- WO-124 — Impact surfaces derivation
- WO-062 — GitHub Issue source adapter
- WO-123 — dotln vertical composition
- WO-112 — The loop from core
- WO-074 — Launchpad export kit
- WO-075 — Kit runtime and harness bundle in the export
- WO-072 — Target worktree lifecycle
- WO-073 — Repository class and profile documents
- WO-076 — Instance build overlay
- WO-077 — Launchpad export update
- WO-078 — Sibling registry and export receipts
- WO-118 — The resident-owned loop from a starter instance
- WO-113 — Work-order files are stable contracts
- WO-080 — Workstream document and index grouping
- WO-081 — Board Workstreams section
- WO-082 — Synthetic pilot
- WO-083 — The real run from the operator's launchpad instance
- WO-096 — Migration ledger
- WO-097 — Rule migration batch 1a
- WO-098 — Rule migration batch 1b
- WO-091 — Multi-active link groups
- WO-092 — The sets graph extension
- WO-093 — The 5S mechanics as data
- WO-094 — Set bonuses lowered
- WO-095 — Full-set scenario and set tooltip render
- WO-085 — Spec/receipt boundary and docs-check
- WO-086 — Generated release history
- WO-087 — Roadmap split
- WO-088 — One source for the phrase table
- WO-089 — Capability table fold

<!-- dotln-work-order-sequence:end -->
