# Roadmap — semver ladder

Versions with exit criteria; pivots are gated on evidence at each rung. Ideas
recorded in the ledger never block a rung and never sneak into one — the
deferral list is part of each milestone's definition. Two pacing rules:
**point of view before efficiency** (explore until a perspective exists, then
optimize), and **every rung ships a visible payoff** — this is a solo project
run on momentum; six rungs of invisible infrastructure is a project-death
risk, so each version ends with something the operator can see, touch, or
play with. The environment for this
ladder is the **personal machine** (macOS, personal Claude Code plan, Codex CLI
as second executor, personal GitHub); managed-environment constraints (enterprise
gateways, centrally managed settings) are out of scope until such a
deployment exists.

## v0.0.0 — Clean-room bootstrap  *(mostly complete)*

Repo, intake pipeline, blueprint docs, idea ledger, decision records, first
work orders. Exit: initial commit on `main`; `docs/` is the complete shared
memory a cold model session needs. No application code. `.claude/` grows
iteratively with use (one config-log line per change); decision records only
for safety-boundary config (permissions, hooks).

## v0.0.1 — Environment truth (bounded)  → WO-001

A 30–60 minute bounded inspection, not the comprehensive audit (that variant
stays preserved in the ledger for wrapped/managed environments). Record with
epistemic labels: node/package-manager/TS toolchain; git + worktree behavior;
Claude Code surface actually present (print mode, structured output, agents,
workflows, background, worktrees, hooks, session persistence); Codex CLI
surface; Playwright availability; SQLite; localhost serving. Exit:
`docs/discovery/environment.md` + machine-readable summary; a named choice of
worker-transport adapters to build first, from evidence.

## v0.1.0 — Pure kernel  → WO-002

TypeScript, **zero runtime dependencies, no I/O**. Events + EventEnvelope
(including the Comparison event type), immutable state, reactors `(state,
event, env) → Decision`, continuations, cadence with virtual time, explicit
RNG state, decision traces, append-only JSONL store + replay. Scope is what
the walking skeleton consumes — *types* for the full Program and Cadence
grammars, *evaluation semantics* only for the subset WO-002 names; the rest
arrives on contact at later rungs (the domain model holds the target shape).
Exit criteria: rows 1, 3, 5 of the canonical failure-injection matrix
(03-architecture) pass; same event log ⇒ same controller transitions,
provably. Visible payoff: `replay` pretty-prints a decision trace you can
actually read. Deferred: remaining grammar/matrix rows, every UI, every real
adapter, the pattern compiler.

## v0.2.0 — Walking skeleton (fake executor)  → WO-003

The Repo Gardener + Seiri vertical against a deterministic fake executor:
create inspection task → operator Present/Away → virtual 20-minute pulse →
kernel emits bounded WorkOrder → fake worker returns evidence-backed deletion
*candidates* (no deletion authority) → separate fake verifier accepts/rejects
→ Operator Returned cancels pulses → replay reproduces the identical final
state. CLI projection + human-readable event timeline are the first views.
Exit: the 13-step demo runs end-to-end twice — live and from replay — with
identical traces, **and the run renders as an emoji-glyph scene** (the
operator's own visual-prototype-zero: 🐛 gardener plus glyph states from the
visual grammar, printed to terminal or a static HTML page — zero assets, a
pure projection of the log). Deferred: real model calls, interactive web UI.

## v0.3.0 — Composition compiler v1

LoadoutGraph + support facets + link type-checking + deterministic precedence
+ compiled-diff preview (CLI). The Seiri link group compiles to heterogeneous
mechanisms with per-support declared cost. Exit: an incompatible link fails at
compile time with the SUPPORT INACTIVE diagnosis; equipping/unequipping
changes the running program and the semantic hash proves view equivalence
across at least {code DSL, function table, statechart JSON}. Visible payoff:
the compiled-diff preview renders as an **RPG item tooltip** (GRANTS /
RESTRICTIONS / OBLIGATION / PASSIVE / PULSE / INTERRUPT), not only CLI text.

## v0.4.0 — Real disposable worker

WorkOrderTransport adapters chosen by v0.0.1 evidence — expected: claude
CLI print-mode with the canonical launch shape (fresh bounded invocation,
project+local settings only, **ambient/auto memory disabled** — no
harness-owned memory loads into a fresh episode; external memory is
deliberate — isolated worktree, explicit model + effort, no session
persistence, JSON schema output) and a codex equivalent. Worktree
lifecycle is deterministic (create, verify cwd, clean up). Exit: one real
episode replaces the fake executor in the v0.2.0 demo and returns a compact
result envelope; the main session's transcript grows by only the envelope; a
killed worker leaves a recoverable pending command (matrix rows 2, 4, 6 pass
here); **`dotln status` exists** — a live in-flight projection of the store
(running episodes, leases/heartbeats, pending commands, recent events) so
real workers never run blind. **No silent model substitution** — unavailable
model ⇒ queue or fail closed.

## v0.5.0 — Independent verification

Blinded verifier episodes; claim-typed evidence mapping; typed
VerificationFinding → focused repair continuation in a fresh episode;
substantive repair marks affected evidence stale. Exit: a deliberately-planted
defect is caught by the verifier, repaired via continuation, re-verified — and
the implementer episode never certifies itself.

## v0.6.0 — Feedback compiler v1 (ten units)

Ten representative FeedbackUnits authored from the corpus (this repo's ledger,
not any external rule stack): anti-oscillation; correctness-over-sycophancy;
the fail-conservative correction reactor (semantic events, not profanity
triggers); verify-app-before-done; no-attribution (settings + commit-msg hook
as defense in depth, with a precise predicate); concurrent-work-requires-
worktrees; no-lint/type-disables-as-fixes; read-your-own-output; no-partial-
completion; bounded boy-scout cleanup. Each: mechanism per the hierarchy +
regression fixture + maturity stats. Exit: measured startup-context reduction
vs. prose equivalents; each unit's fixture fails when the mechanism is
removed; **and the first self-hosted step** — one DotLn work order for this
repo itself is compiled, dispatched, executed, and verified by DotLn
(ADR-0001's strangler experiment gets its vehicle).

## v0.7.0 — Projections & console

Web console (UI framework decided *here* by ADR with v0.0.1 evidence; default
recommendation: Angular, the operator's fluency — the kernel doesn't care).
Synchronized views: RPG loadout + statechart + function table + event timeline
+ raw IR, semantic-hash equality across editable views; glyph system with the
visual grammar; replay scrubber; the first full transmog skin beyond glyphs
(Native Emoji) — the friendly skin serves the teammate goal and does not wait
for v1.0. Terminal remains a complete control surface.
Exit: the v0.2.0 demo watched entirely from the console, then re-watched via
replay; every animated element opens its mechanics inspector.

## v0.8.0 — Pattern workshop v1

5S equipment set with compiled set bonuses; Marquet ladder as the
operator-agent protocol (autonomy rung computed, not set); mitigated-speech
voice selector; drag-and-drop equip with exact compiled diff preview. Exit:
dragging Seiri onto Repo Gardener in the console produces the same semantic
hash as authoring the equivalent link group in code.

## v0.9.0 — Source-to-deliverable vertical

Prove the ports with a personal-flavor vertical: GitHub Issue → SourceBundle →
StoryContract → RepoProfile + ImpactMap → **Live Witness baseline** (reproduce
before changing; preserve baseline evidence) → implementation episode →
blinded behavior verification **and** independent code review (two separate
episodes) → evidence-grounded PR on a personal repo (the deliverable-ready
conjunction checklist, 03 §DeliveryAdapter) → post-PR loop (CI
classification, comment triage, source revision guard). The enterprise-tracker adapter remains a future optional plug-in — the
promise generalizes to "any tracked-work artifact + registered repo + named
authority profile → independently verified deliverable." Exit: one real issue
travels the pipeline with operator interruptions only at material decisions.

## v1.0.0 — Teammate-ready

A person who has never read these docs declares one bounded intent and
receives a verifiable result, without learning the taxonomy and without a
giant transcript. Exit: witnessed run by a non-author.

## Post-1.0 horizons

Simulation laboratory — paired counterfactuals, first-divergence search,
agent swaps, all-clone towns, reflection-question design, time-dilation,
recognition-beyond-identifiers, accuracy-vs-rationale decoupling,
biographical seeding, bounded-inconsistency generation, length-scale
attention aggregation (the full catalog lives in the ledger's chat-005
entries; this list is not exhaustive); the full pattern shelf (Compendium
skin); remaining transmog skins; physical-card importer; hypothesis flywheel.
All gated on the same kernel; none may distort Horizon 1.
