# WO-005 — Capability table v1, v0.2.2

**Model:** any capable model.
**Release classification:** `v0.2.2` patch — a reviewed inventory of existing
evidence, not exported runtime capability. Reclassify before implementation if
scope expands beyond that boundary.
**Depends on:** WO-004 complete for the pinned evidence corpus; no executable
package or runtime prerequisite (this order is doc-only). Levels carry evidence
links and a last-change date, so they update rather than rot as later
verification reports land.

**Cites (read these sections):** 06-roadmap.md §Capability progression
policies (the levels table, activation/utilization/XP separation, the
progression-policy list, and "The first implementation can remain simple");
01-principles.md Principles 9, 11, 15; all admissible discovery, verification,
final-review, release, and hardening evidence present at the pinned base
revision. This includes the WO-003 closure record and the completed WO-004
evidence rather than freezing the table to the two corpora that existed when
this order was first drafted.

**Objective:** Author the reviewed capability table the roadmap names as the
first implementation of capability progression — a Markdown table, not
scheduler IR, not an XP engine (both explicitly deferred until real planning
uses expose a need). Rows: the capabilities the ladder already names (kernel
event loop, cadence, authorization guard, store/replay, continuations,
walking-skeleton vertical, composition compile, transports, verification,
projections, publication bootstrap, audit projections). Columns per the
roadmap: current level | target level | required dimensions | evidence links |
dependencies | last change | next smallest promotable increment | blocking
gate.

**Scope discipline (one step at a time):**
- Levels are claimed only from admissible evidence at the pinned base revision
  (named tests, verification verdicts, discovery rows); everything else is
  `0 — latent` or unknown. XP is evidence, never confidence or effort.
- A composite's level is the minimum of its required dimensions — no
  averaging (the roadmap's anti-hiding rule).
- Efficiency column: `E0 — unknown` everywhere no trustworthy baseline exists.
  Any higher claim requires a linked baseline at the pinned revision; do not
  fabricate one.
- Record the selected progression policy for the current horizon (one of the
  roadmap's listed policies) with a one-paragraph rationale; the ladder's
  visible-payoff pacing rule stays binding regardless of policy.

**Deliverables:** `docs/planning/capability-table.md` (new directory), plus a
map line in `docs/README.md`.

**Acceptance criteria (all required)**
1. Every row carries evidence links or an explicit latent/unknown label.
2. No composite level exceeds the minimum of its required dimensions.
3. Every non-latent row names its blocking gate — the unsatisfied condition
   for the next level.
4. Observation window and scope are stated for any counts used.
5. The chosen progression policy is recorded with its rationale.

**Evidence gate:** a spot-check mapping at least three rows' claimed levels to
their cited evidence (links resolve to files/tests that exist at the cited
revision), captured in the result.

**Write-back duty:** the roadmap's v0.2.2 entry already points here; the
`docs/README.md` map line lands in the same change; ledger duty applies if authoring transforms any
progression idea.

**Non-goals:** an XP engine; scheduler IR; activation-event capture;
efficiency baselines or measurement; dashboards; automating table
maintenance.
