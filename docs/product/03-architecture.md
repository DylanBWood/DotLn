# Architecture

## Layer diagram

```
┌────────────────────────────────────────────────────────────────┐
│ Source corpus                                                  │
│ incidents · prompts · notes · books · exemplars · transcripts  │
│ (policy-controlled; verbatim preserved locally; see §Corpus)   │
└──────────────────────────────┬─────────────────────────────────┘
                               │ classify / normalize / preserve provenance
┌──────────────────────────────▼─────────────────────────────────┐
│ Pattern & feedback compiler ("Forge")                          │
│ FeedbackUnits · PatternDefinitions · support facets · loadouts │
└──────────────────────────────┬─────────────────────────────────┘
                               │ normalized IR (LoadoutGraph + Programs)
┌──────────────────────────────▼─────────────────────────────────┐
│ Pure control kernel                                            │
│ reactors · statecharts · function tables · cadence · policy    │
│ (state, event, env) → state' + intents + continuation + trace  │
└──────────────────────────────┬─────────────────────────────────┘
                               │ authorized commands (outbox, commandId)
┌──────────────────────────────▼─────────────────────────────────┐
│ Effect adapters                                                │
│ model executors (claude / codex / fake) · human · shell · git  │
│ browser/Playwright · test runners · source adapters (tickets)  │
└──────────────────────────────┬─────────────────────────────────┘
                               │ typed result events (EventEnvelope)
┌──────────────────────────────▼─────────────────────────────────┐
│ Event store & evidence graph ("Chronicle")                     │
│ episodes · artifacts · provenance · evaluations · lineage      │
└──────────────────────────────┬─────────────────────────────────┘
                               │ projections (pure)
┌──────────────────────────────▼─────────────────────────────────┐
│ Isomorphic & projective interfaces                             │
│ RPG/links · pattern cards · statecharts · tables · timelines   │
│ terminal CLI · web console — both invoke the same commands     │
└────────────────────────────────────────────────────────────────┘
```

Naming: plain names (kernel, compiler, event store) are canonical in code and
docs. The flavor names — Forge (compiler), Compendium (pattern library), Chronicle
(events/lineage), Atlas (repos/workstreams), Simulacrum (simulation lab) — are
an available *skin*, consistent with the transmog philosophy (swappable presentation over identical mechanics; defined in 04-interfaces). Never let a
flavor name be the only name.

**Decomposition rule:** many bounded machines — one per task, episode,
workstream, maintenance cycle — communicating through events. Never one
statechart containing every actor, timer, and tab.

**The host:** a minimal local control-plane process owns the kernel loop, the
store, the outbox, lease expiry, cadence firing, and worker spawning — it is
what stays alive across model-session death, rate limits, crashes, and network
loss. No interactive session is ever the thing keeping work alive.

## The agentic communication core

This is the center of gravity of the personal build (operator directive). It is
redux/rxjs applied to agents, and it must satisfy the analog completeness test:

- The **traffic cop** (main interactive session, when one exists) is an
  *airlock*: it captures intent, emits typed **actions**, dispatches, receives
  result envelopes, and requests human judgment. It never explores repos,
  reads files at length, or holds history. Three-tier context firewall: worker
  contexts may be huge → the store keeps structured durable results → the main
  thread gets ids, status, conclusions.
- **Effects** (feedback agents) subscribe to the event stream by their own
  triggers, run *off-thread*, and may dispatch their own actions. Most are
  deterministic mechanisms; an LLM is invoked only where judgment is
  irreducible ("agentize the feedback" ≠ resident LLM agents).
- A **reducer/mediator** aggregates effect output (forkJoin-style or by
  timeout) and hands the traffic cop a compact script — so the traffic cop can
  stay feedback-agnostic, loading at most rule names + summaries.
- **Blackboard option**: agents need not converse directly; they can modify a
  shared environment whose current state determines which actions are legal
  (stigmergy). Statechart-gated affordances make illegal actions *absent*, not
  forbidden-by-prose — a page (or CLI) simply doesn't render a disabled Claim
  button. The browser is one strong rendering of this shared world; the shared
  world itself is the event store.
- **Bootstrap transport**: shared files in the repo are an acceptable first
  bus (that's how model harnesses fan out internally) but never canonical
  state — the append-only log is (lost-update and ordering hazards otherwise).

## Composition system

The LoadoutGraph (see domain model) is compiled per episode:

1. Resolve identity + role + applied patterns + environment → active tension
   (PolarAxes) and phenotype.
2. Type-check links: tags vs supportedTags, capability requirements (a
   Screenshot-Verification support without a browser renders SUPPORT INACTIVE
   with the exact missing capability and concrete corrections — never "hope
   the model figures it out").
3. Apply deterministic composition precedence on conflicts (visible, 9 levels):
   safety invariants > hard permissions > statechart guards > work-order
   obligations > resource budgets > policy scores/tensions > cadence > voice >
   visual skin. Conflicting hard supports reject the composition with an
   explanation. Commutativity is checked; non-commuting pairs must be explicit
   pipelines or rejected (Principle 13).
4. Emit: WorkOrder + permissions + hooks + schemas + cadences + verification
   plan + the (small) prompt fragment residue. Per-support cost is declared:
   mechanism type, prompt tokens (usually 0), runtime cost, extra episodes.

## Session lifecycle & resilience

- Statechart-first: `rate_limited`, `environment_blocked`, `operator_paused`,
  `interrupted` are lifecycle states, not failures. 429 → persist continuation
  → backoff cadence (jittered; never wake all waiters at once) → resume in a
  fresh session from the persisted WorkOrder.
- Outbox protocol: kernel decides → event + trace + continuation + command
  persist → adapter receives persisted command → result correlates by
  commandId → duplicates ignored deterministically → missing result leaves a
  recoverable pending command → restart replays to identical state.
- Leases + heartbeats for long workers; a vanished worker can never destroy a
  workstream.
- **Failure-injection matrix (canonical here; roadmap and work orders cite
  it).** Expected outcomes are part of the spec:
  | # | Injection | Expected outcome | Required by |
  |---|---|---|---|
  | 1 | Crash after command persist, before dispatch | Restart finds the pending command via replay and re-dispatches; no duplicate effects (adapter dedups by commandId) | v0.1.0 |
  | 2 | Crash after effect, before result persist | Command remains pending; recovery re-queries or re-dispatches idempotently; never double-applies | v0.4.0 |
  | 3 | Duplicate result event | Second delivery ignored deterministically (commandId); state unchanged; trace records the dedup | v0.1.0 |
  | 4 | Result after authority expiry | Event is persisted (it happened); reactor decides quarantine/NoOp with trace naming the expired envelope; payload causes no state mutation | v0.4.0 |
  | 5 | Operator-return racing a queued cadence pulse | The already-queued pulse is processed, but its guard re-evaluates presence and decides NoOp-with-trace; future pulses cancel | v0.1.0 |
  | 6 | Interruption mid-episode (network loss, kill) | Lease expires; continuation + work order recoverable; a fresh episode resumes or a recovery episode inspects | v0.4.0 |
  Without these, "offline-capable" is a slogan.

**Perception cost hierarchy** (distinct from Principle 6's evidence-strength
ordering — this ranks *reading* cost, that ranks *proof* strength): episodes
read the world via the cheapest exact representation first — structured state →
semantic DOM/accessibility tree → network/event data → screenshot → OCR.
Screenshots and OCR are perceptual tools for visual claims and pixel-trapped
text, never the default channel for state you own in structured form.

## Ports (what keeps work-flavored verticals pluggable)

- `SourceAdapter`: tracked-work artifact → immutable **SourceBundle**
  (rich-text semantics preserved as data — strikethrough, color, revision
  history, images with OCR-as-aid-never-truth; per-artifact convention
  inference; secrets stay in the adapter, never in prompts/logs/repo). A
  **StoryContract** is the typed interpretation compiled from a SourceBundle
  (purpose, current/desired behavior, acceptance criteria, examples,
  constraints, non-goals, assumptions, open questions, pinned source
  revision); an **ImpactMap** is the structured change-surface map a read-only
  cartographer episode produces (entry points, state ownership, shared
  consumers, existing tests, similar prior implementations) — never a prose
  repo summary. A **source revision guard** watches the artifact's revision:
  a material mid-cycle change invalidates exactly the downstream
  contract/plan/evidence derived from the changed portion. Enterprise ticket
  trackers are one future adapter; GitHub Issues is the nearer personal one.
- **Repo registration**: a one-time read-only archaeologist episode produces a
  typed **RepoProfile** — commands (install/build/test/lint/format), local-app
  startup, branching/PR policy, environment authority, demonstrated
  architecture patterns. All later commands come from the profile. The
  **repo-native rule**: convention authority resides in the target codebase's
  demonstrated architecture, never in the model's training-set fashion.
- `WorkOrderTransport`: see domain model. The fake deterministic executor is a
  first-class adapter and ships first.
- `VerificationAdapter`: claim-typed evidence (visual claim → rendered-image
  check; network claim → trace; state claim → DOM/store read), recorded into
  the workstream's AcceptanceEvidenceMatrix. **Baseline first (Live Witness)**:
  before any change, an episode runs the current base branch and reproduces the
  defect (or walks adjacent behavior for a new story), preserving baseline
  evidence; honest non-reproduction is recorded as an environment limitation,
  never faked. Defects and stories run dual workflows (reproduce → root-cause →
  failing regression evidence → repair, vs. understand → define observable
  behavior → tests/mocks → implement). Evidence is typed: mocked-client proof
  (labeled synthetic fixtures, AC-mapped) never counts as live-integration
  proof. Verifier episodes are **blinded** from the implementer's narrative;
  the implementer never certifies its own work. Verification ("does it work?")
  and review ("is this the right implementation to maintain and ship?") are
  **separate independent episodes** — the reviewer reports findings, may not
  silently rewrite the branch, and its minor suggestions never auto-expand
  scope.
- `DeliveryAdapter`: PR/patch/report generation *from artifacts, not
  narrative* — the deliverable body is generated from the StoryContract, the
  actual diff, the completed AcceptanceEvidenceMatrix, and evidence refs.
  "Deliverable-ready" is an explicit conjunction checklist (current source
  revision, explicit contract, no unresolved material ambiguity, reproduced
  baseline, repo-native implementation, no unexplained scope, tests/build/
  lint, live behavior walked, visual claims visually inspected, every AC
  evidenced, independent verification and review, final diff read, grounded
  body, monitored loop) — no single passing signal is ever "done". Post-
  submission loop ownership: CI failures deterministically classified before
  any repair dispatch, review comments triaged by type, upstream source drift
  watched (revision guard) until a human-controlled terminal state. Projection
  boundary enforced: no internal vocabulary in external artifacts.

## Operator-presence policy

Presence changes the resource mix, never safety — safety is a lexicographic
precondition (ObjectiveContract ordering), and the lists below rank attention
among already-safe actions. Present: foreground intent > support > bounded
maintenance > exploration. Absent: safety > finish
bounded work > entropy reduction (the 5S organism) > proposals > research >
NoOp when expected value goes negative. Each candidate action has its own
U(a,t) = Benefit − Risk − Disruption − OpportunityCost; the sow/reap ratio
(~1/3 research, bounded execution windows, Double Dutch entry/exit) paces the
cycle. Unattended work is reversible, evidenced, and independently verified.

## Corpus policy

`docs/intake/` (gitignored) holds raw material; committed docs are synthesized.
Structure for growth: `corpus/sanitized/` (git-eligible), `corpus/fixtures/`
(minimized regression cases), `corpus/manifests/` (hashes, provenance,
retention), local-only raw layer. Transcript-handling policies are explicit
and inspectable per episode: verbatim-local / encrypted / scrubbed / summary /
expiring / excluded-from-learning. Verbatim-with-scrubbing is the default —
sources regenerate summaries, never the reverse.

## Learning loop

Every episode records: loadout version, work-order version, model + runtime
config, inputs, tool events, artifacts, git state, evidence, duration,
resource use, retry behavior, human rework, outcome class. The system learns
at the *controller* level: which topology per task class, which patterns
activate usefully, when to stop researching, how much verification is
warranted, which feedback units are dead/redundant/conflicting/overfit.
Identity updates are versioned proposals gated by replay/sandbox evaluation.
Two flywheel modes: retrospective grading, and the predict-then-score variant
(register hypotheses, watch which come true, at what timescale). Surfacing is
exception-driven: once a rule is reliable, conforming events stop deserving
operator attention; watchers surface the exceptions.
