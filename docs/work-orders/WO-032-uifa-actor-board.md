# WO-032 — UIFA v0: a read-only actor board over episodes, builds, mechanisms, evidence, and work (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It is the first slice of the roadmap's
"Projections & console" rung and adds a new workspace package with a runtime
capability and a versioned view-model contract; no kernel, compiler, or
skeleton contract changes. Assigned at activation under the standing opt-out
default: the first wave-1 order to merge takes the next minor above the
latest published tag, and the second retimes with a dated note at its
integration step (06-roadmap.md §Release boundary).
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
dispatch asking for "a UI to see what's going on with dotln and our vision
around it", rescoped the same day by the phase-two redirect after the
operator's correction that the first draft was "a dashboard of the process,
not a UI for actors". The first draft (a showrunner board over control state
alone) is retained in this order as one panel. Planner-synthesized draft; the
dispatch and the correction are preserved locally as compaction-safety
captures. Opaque identifier, not a priority. The clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** WO-009 merged (the worker store and `dotln status --json`;
satisfied at `v0.10.0`); WO-011 merged (compiled units, maturity
observations, the self-hosted audit store; satisfied at `v0.13.0`); WO-010
merged (acceptance evidence matrices in status JSON; satisfied at `v0.12.0`);
WO-007 merged (audit projections; satisfied at `v0.3.0`); WO-008 merged
(compiled loadouts and the tooltip render; satisfied at `v0.4.0`); WO-030
merged (`status --json` `orders[]`; satisfied at `v0.7.0`); WO-026 merged
(the generated index; satisfied at `v0.5.2`); WO-021 merged (`worktree
constellation`; satisfied at `v0.8.0`); WO-028 merged (`recordedAt` and
`elapsed`; satisfied at `v0.5.1`); WO-031 merged (`resume usage`; satisfied
at `v0.10.1`).
**Recommended placement:** wave 1, lane B, beside WO-039, with which it shares
no primary write surface; the two form the first product wave. When WO-039
merges first, the board renders the Contributor build through the same
compiler render without a change here. A recommendation, not a dependency
token.

**Cites (read these sections):** 04-interfaces.md §Interfaces — the isomorphic
views (UIFA organizes work around the domain's Actors: people, model
sessions, scripts, browser workers, and test runners, with their roles,
current work, state, and evidence), §Terminal first, console equal (a
read-only v0 invokes no command), §Plural UI hosts, one projection contract
(one view model, several hosts; no host grows a second state machine), §RPG /
Path-of-Exile view (the default skin for the operator's own console; item
tooltip anatomy; the build inspector), §Semantic zoom, and §Agent projection
(the sparse twin); 13-uifa-roles.md §The five roles and §Assistance the
platform owes each role (every panel names the role it serves);
02-domain-model.md §Actors and episodes, §Identity and composition,
§Feedback (gem maturity), and §Independent verification v1 (the matrix
projection); 03-architecture.md §Session lifecycle & resilience (the
operator worktree projection); 06-roadmap.md §Application version pending —
Projections & console (prototype zero is a zero-asset page; the framework
decision waits); 01-principles.md Principles 1, 11, and 16; ADR-0002
Amendments (dependency posture: zero runtime dependencies; no framework);
`packages/skeleton/src/worker-status.ts`, `audit.ts`, `verification.ts`,
`loadouts/*.ts`; `packages/compiler/src/render.ts`; `scripts/resume.mjs`
(`status --json`, `usage --json`), `scripts/worktree.mjs`
(`constellation`), `scripts/release.mjs` (`list`), `scripts/work-orders.mjs`;
`docs/evidence/WO-011/feedback.json`, `docs/evidence/WO-011/selfhost-*.jsonl`;
`docs/planning/capability-table.md`; `docs/publication/audience-status-index.md`.

**Objective:** Give the five UIFA roles their first shared screen, organized
around actors rather than around the process: one read-only board, rendered
in the terminal and as a zero-asset static page over a versioned JSON view
model, that shows every actor the repository knows about with its build, its
episode state, its authority, which compiled mechanisms fired for it, and the
evidence behind each claim, with the work-order state machine as one panel
among five.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- The interfaces doc defines UIFA as work organized around actors. No surface
  shows an actor. `dotln status` lists episodes as text lines; the audit
  projections, compiled tooltips, maturity observations, matrices, control
  status, constellation, index, and capability table each print from a
  separate command with no shared view model.
- The first draft of this order projected control state only (orders,
  phases, worktrees, releases, evidence links). That serves the showrunner
  and nobody else; it contains no identity, no loadout, no mechanism, and no
  "which unit fired".
- Nothing renders a build as a whole: the tooltip render prints one item's
  grants and costs; no surface lists an actor's equipped units with their
  rung, boundary, and observed activations.
- Product 04 sanctions a zero-asset terminal or static-HTML page as
  prototype zero and defers the framework decision to representative
  evidence; the consumer that will render this view model in Angular is
  WO-034's first target change, so the contract has to exist first.

**Design (scope discipline):**

- **One view model, versioned.** `packages/console` (zero runtime
  dependencies, no framework) exports `projectBoard(sources) → BoardView`
  with `viewModelVersion: "uifa-board-v1"`. Sources are the documented
  machine interfaces only: the worker store's status projection, the audit
  projections, the acceptance evidence matrices, compiled loadouts through
  `compileLoadout` and `compileFeedbackUnits` with `renderTooltip`, the
  maturity observations file, `status --json`, `usage --json`, the
  constellation, `release list`, the generated index, the publication index,
  and the capability table. Text sources are parsed from their pinned
  formats and fixtures record every input; a missing source renders as
  `unavailable`, never as an empty success. The JSON form is the contract
  WO-034's Angular shell consumes.
- **Five panels, each naming its roles.** _Actors_ (primary): one row per
  actor the sources know: identity and role, loadout semantic hash, transport
  and model and effort where an episode exists, episode phase, lease and
  heartbeat, the authority envelope's allowed and denied summary, and links
  to its evidence; people appear as actors too, from the control log's
  recorded roles, with no attention or presence inference. _Builds_ (engineer):
  every shipped loadout's item tooltips and the three view hashes, rendered
  through the compiler's render so a new loadout appears without a console
  change. _Mechanisms_ (tester and engineer): every compiled unit with its
  rung, host boundary, enforcement, and the maturity fold's eligible,
  activations, prevented, false activations, and overrides, plus the last
  observed activation with its episode. _Work_ (showrunner): the control
  state's orders, phases, blockers, elapsed, next legal action, worktrees,
  releases, and evidence links; this panel is the first draft's whole scope.
  _Blueprint_ (product lead): capability rows with levels, publication
  statuses, the roadmap's pending rungs, and the latest plan-refutation
  receipt's per-order verdicts with its hold status (from
  `docs/planning/refutations/`, rendered `unavailable` until one exists),
  which is the cell that answers the product lead's question, "is this
  still the thing we mean?", with evidence rather than with a status
  label. Every panel states which of the five roles it serves and which
  question of theirs it answers.
- **Two renders.** `npm run console -- board [--json | --html <path>]`: the
  terminal render and a single self-contained HTML file with inline styles
  and no script, no network, no assets, holding no state and invoking no
  command. Selection is a link between panels (an actor to its build to its
  mechanisms to its evidence), the semantic-zoom shape at its shallowest.
- **Evidence-backed only.** Every cell traces to a source record; a claim a
  source cannot support renders as `unknown`. Beacon liveness is not promoted
  by worker claims and worker claims are not promoted by Beacons, following
  the existing rule.
- **Declined alternatives, recorded:** any framework, bundler, or CSS
  toolchain in core (the roadmap defers the decision to WO-034's evidence);
  command invocation from the board (waits for a parity contract with the
  terminal); a `WorkstreamOpened` event or any new event type (WO-034 adds
  workstreams as a document plus projection); presence or attention
  inference for human rows.

**Deliverables:** `packages/console` with `projectBoard`, the
`uifa-board-v1` schema, the terminal and HTML renders, and its fixtures; the
`console` command; the write-backs below.

**Acceptance criteria (all required)**

1. `projectBoard` is pure over its recorded sources; fixtures pin the
   `uifa-board-v1` JSON for the WO-009 demonstration store, the WO-011
   self-hosted audit store, the control log, and the committed refutation
   receipts under `docs/planning/refutations/` (the 2026-09-06 receipts
   exist and are the fixture source), and both renders are pinned for each
   fixture; a missing source renders `unavailable`, and the fixture that
   carries the receipts renders the product lead's verdict cell populated,
   never `unavailable`.
2. The Actors panel shows, for the WO-011 self-hosted run, the executor and
   the verifier as separate actors with different loadout hashes, episode
   phases, and authority summaries, and links each to the matrix and receipt
   that evidence it; and it shows at least one person as an actor from the
   control log's recorded roles (the operator's activation, review, and
   release-close events under the WO-031 actor attribution), pinned as a
   fixture row with its role, its last recorded action, and its evidence
   links, with no attention or presence inference. A board with no human
   row in the pinned control-log fixture fails this criterion.
3. The Builds panel renders every loadout exported by the skeleton through
   the compiler render with hashes equal to the compiled-diff receipt; adding
   a loadout to the skeleton's exports adds a card with no console change,
   proven by a fixture loadout.
4. The Mechanisms panel lists all ten units with rung, boundary, enforcement,
   and the maturity fold's five counts from the observations file, and marks
   a unit with zero observations as unobserved rather than zero-rate.
5. The Work panel reproduces the first draft's scope: orders with phase,
   blockers, elapsed, and next legal action from `status --json`; worktrees
   from the constellation; releases from `release list`; evidence links from
   the index; and the Blueprint panel reproduces capability rows and
   publication statuses. Role service is proven, not self-labeled: for each
   of the five roles, the question 13 §The five roles records for that role
   is answered by a named cell or link of the board over the fixture
   stores, the mapping from question to cell is pinned as a fixture, and
   the independent verifier reviews that mapping against 13 §The five roles
   rather than accepting the implementer's labels; the product lead's
   question maps to the Blueprint panel's refutation-verdict cell, not to
   a status label; a panel's role label with no pinned answering cell fails
   this criterion.
6. The HTML render is one file with no script, no external reference, and no
   state, verified by a fixture that scans it; the terminal render fits the
   documented width.
7. Write-backs land: 04 §Plural UI hosts (console v0 shipped as the actor
   board; the `uifa-board-v1` contract) and §Agent projection; 13 (each
   role's "today" cell); 06 §Projections & console (first slice shipped);
   README "What runs today"; a dated capability-table row for
   `projection.uifa-board`; publication index rows and both edition locks;
   ledger entry.
8. `npm test` green; no new dependency; `git diff --check` clean.

**Evidence gate:** the fixture transcripts for criteria 1 through 6; `npm
test`.

**Write-back duty:** as listed in criterion 7.

**Non-goals:** command invocation and drag-equip authoring, which together
are the recorded wave-5 candidate "Console parity contract and drag-equip
authoring" in the planning map's preserved candidates, to be filed by the
next planning pass once this order and WO-037 have merged; a framework or
the Angular shell (WO-034's first target change);
replay scrubbing; presence inference; Beacon comparison (an operator trial
the Work panel makes possible); JSON forms for the index, constellation, and
`release list` (nominated as a follow-on; this order parses their pinned
text).

**Operator-review assumptions**

1. Zero dependencies and no framework in core; the Angular shell renders
   `uifa-board-v1` in the operator's example consumer.
2. The Work panel is the first draft's showrunner board in full; nothing the
   showrunner was promised is lost.
3. The view-model version is `uifa-board-v1`; a later panel is an additive
   change under 10-ir-compatibility.md's invariants.
