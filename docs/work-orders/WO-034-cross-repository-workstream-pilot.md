# WO-034 — Cross-repository workstream pilot: one outcome, several target repositories, driven from a launchpad fork (version assigned at activation)

**Model:** any capable model for the implementation and fixtures. The real
run's executor, verifier, and reviewer sessions are dispatched from the
launchpad under its own work orders' declarations; the operator must witness
the real run. State the model and effort actually run for every session that
produces evidence (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds the workstream projection to the
control plane and the board, and records the pilot's evidence; the pilot's
external effects happen in the operator's other repositories. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
dispatch ("use dotln to start creating enterprise starter. then at some point,
i would fork enterprise starter and i would open up claude + codex in that
repo and start planning the work orders that would generate dotln angular ...
it just proves out that the enterprise workflow works") and product 12's
2026-09-06 pilot paragraph. Planner-synthesized draft; the unedited dispatch
is preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition; the pilot uses the
operator's own public repositories and synthetic fixtures only.
**Depends on:** WO-033 merged (configuration root, registered target
repositories, launchpad export, and `worktree sync`).
**Recommended placement:** wave 2, beside WO-035 (disjoint surfaces: this
order edits the index generator and `packages/console`; WO-035 must not).
WO-032 merged first is recommended so the workstream view extends the board;
without it the workstream projection is CLI and index only. A recommendation,
not a dependency token.

**Cites (read these sections):** 12-workstream-application.md in full,
especially §One workstream across repositories, §What exists and what must be
proved (the six demonstrations), and §Open product choices;
03-architecture.md §Platform and instance boundary (the sibling-repository
experiments; the fork is of the starter); 04-interfaces.md §Candidate —
workstream application and §Plural UI hosts (the Angular shell is one host
over the same view models); 02-domain-model.md §Memory and observation
(Workstream); 13-uifa-roles.md §UIFA showrunner; 06-roadmap.md §Candidate —
budget-window work-order ladders (contribution tracks remain unfiled) and
§Application version pending — Source-to-deliverable vertical (this pilot is
its process-level precursor with human and model sessions as executors);
01-principles.md Principles 3, 4, 16, and 17; `docs/LEGAL.md`;
`docs/planning/concurrent-work-orders-plan.md` §Later slices, unfiled;
`scripts/work-orders.mjs` and `packages/console` (after WO-032).

**Objective:** Prove, first with synthetic fixtures and then with one
operator-witnessed real run, that a launchpad can hold one workstream whose
bounded work orders target several repositories; that executor sessions open
in target worktrees from the launchpad's handoff without per-repository
orientation; that evidence and acceptance converge in the launchpad on named
target revisions; and that the first change in the operator's DotLn-Angular
repository was actually driven by that workflow rather than built beside it.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- "Workstream" exists as vocabulary (02, 12) and in the fake skeleton's event
  scope. No control artifact groups work orders into an outcome, and neither
  the index nor `status --json` knows an outcome that spans repositories.
- Product 12 names six demonstrations required before the application is a
  useful replacement (single-repository task, cross-repository task with a
  shared contract, material source-revision change, two colliding workstreams,
  unavailable execution edge, session restart). None has a fixture.
- The operator's proposed route — DotLn helps create the starter, a fork of
  the starter coordinates targets, Angular changes travel only through that
  fork during the trial — is recorded in product 03 and 12 as one candidate
  path with no evidence. After WO-033 the export and target mechanics exist;
  the workstream layer and the witnessed run do not.
- Product 12 requires the pilot to show the workflow drove the target change;
  a starter skeleton and an independently developed application prove
  nothing.

**Design (scope discipline):**

- **Workstream as a document plus projections, no new event type.** A
  launchpad holds `docs/workstreams/WS-NNN-<slug>.md` (root configurable
  through WO-033's config) with the outcome, acceptance contract, member work
  orders (each naming its repository and base), the dependency and
  compatibility plan, and delivery states. A work order may declare
  `**Workstream:** WS-NNN` in its leading metadata. The index generator groups
  orders by workstream and shows, per member, repository, base, phase,
  verdict, and integration state; the board (when WO-032 is present) adds a
  Workstreams section over the same data. Staleness is a projection: a member
  whose declared base is no longer the target's integration base is shown
  stale, following the source-revision guard's shape. No control event,
  transition, or schema changes.
- **Synthetic pilot.** A real-Git fixture builds three target repositories
  (service, client, documentation) and a launchpad exported by WO-033. One
  workstream with three member orders exercises the six demonstrations as
  automated fixtures where a fixture can witness them: a single-repository
  task; a cross-repository task whose client member proceeds against a pinned
  contract fixture while the service member lands first; a material
  source-revision change that marks dependent member claims stale without
  restarting unrelated members; two workstreams colliding on one repository,
  refused by the one-writer-per-worktree rule and surfaced as coordination
  work; an unavailable execution edge (a registered repository path absent)
  shown as blocked with the manual handoff named; and a session restart in a
  target worktree that resumes from `resume: next`.
- **Real run (operator-witnessed).** The operator exports the launchpad into
  `DotLn-Enterprise-Starter`, forks or clones it as their launchpad instance,
  registers `DotLn-Angular` as a target, authors `WS-001` ("console v1
  shell") with a first member order that scaffolds an Angular workspace
  consuming the WO-032 board view model as JSON, and drives that order through
  the lifecycle with executor, verifier, and reviewer sessions opened from the
  launchpad's handoffs. The operator gives `DotLn-Angular` three purposes at
  once: an exemplar of the architecture and fundamentals they want emulated
  in Angular, Nx, and NgRx work; the demonstration that the starter can build
  out another repository; and a console for DotLn. The first member order
  therefore establishes that repository's demonstrated architecture, which
  every later order treats as repo-native authority (Principle 17); the
  stack is the operator's exemplar choice for a consumer and adds no
  dependency to core. Its repository profile in the launchpad is also the
  first exemplar profile of an Angular UI repository class (WO-033's scope
  layering), so a later Angular target inherits the class conventions while
  its own demonstrated architecture still wins where it is established. The
  receipt records which of the three purposes the run evidenced and which
  remain claims. The external forks that follow are the path to the v1.0.0
  criterion: a person who has never read these docs declares one bounded
  intent and receives a verifiable result. The order's pull request on `DotLn-Angular` is opened
  by `worktree publish`, its `VER-NNN` and `FINAL-NNN` live in the launchpad,
  and the receipt here names the public commits and pull-request numbers, the
  elapsed phases, operator interventions, manual handoffs, and what, if
  anything, was done outside the workflow. No private path or credential
  enters the receipt.
- **Priming the fork's sessions.** The real run must show that a fresh
  session in the fork learns the target's purpose from files, not from the
  operator's narration. The fork's operating contract fixes the cold-start
  read order (execution guide → the active order → its workstream document →
  the target's repository profile → only the upstream sections those name).
  `WS-001` states the outcome, why it matters to core, the demonstrations,
  the consumed contract with its version (the board view model at a named
  core tag), and the member sequence; the `DotLn-Angular` repository profile
  states the three purposes, the standards to emulate, the authority profile,
  the commands, and a pinned upstream-references list (`owner/repo@tag
  path#anchor`, one line each on why it matters) into core's console
  paragraphs and the board's JSON contract. Both are written by the first
  `planning:` pass the operator dispatches in the fork, and every member order
  cites them by section. The receipt records whether the executor session
  needed any vision restated by hand; each such restatement is a defect in
  the two files, fixed in the fork before the next order.
- **Baseline comparison.** Per product 12, the receipt compares the real run
  with the operator's current practice of separate sessions per repository on
  context restatement, manual handoffs, unnecessary interruptions, and time to
  a trusted return state. The operator supplies the baseline observation;
  unmeasured values stay `unknown`.
- **Camouflage.** The target repository receives one conventional pull
  request with destination-conventional prose; the launchpad's vocabulary
  stays in the launchpad.
- **Declined alternatives, recorded:** a `WorkstreamOpened` control event and
  lifecycle (no consumer needs legality at the outcome level yet); DotLn
  runtime transports as the executors (general source-writing workers remain
  separate roadmap work); building the Angular console in this repository
  (the pilot needs a real target, and the framework decision needs this
  evidence).

**Deliverables:** the workstream document convention and root; the
`Workstream:` field and index grouping; the board's Workstreams section;
the synthetic pilot fixture covering the six demonstrations; the real-run
receipt under `docs/evidence/WO-034/README.md` with sanitized transcripts;
the write-backs below.

**Acceptance criteria (all required)**

1. The synthetic pilot's six demonstrations each have a passing fixture, and
   the fixture proves that a green member check cannot make a stale or
   failing sibling green, that partial delivery is visible with its next safe
   action, and that an unrelated member continues when one repository is
   blocked.
2. The index and board show every member order's repository id, base, phase,
   verdict, and integration state under its workstream, derived only from
   work-order headers, control segments, and Git containment; no physical
   path appears.
3. The real run's receipt names the launchpad instance repository, the target
   pull request opened by `worktree publish`, the `VER-NNN` and `FINAL-NNN`
   recorded in the launchpad, the elapsed phases from `status`, every
   operator intervention and manual handoff, and the operator's witness line;
   the target pull request contains no launchpad vocabulary.
4. The receipt's baseline comparison lists the four product-12 measures with
   observed values or `unknown`, and a plain statement of which predecessor
   steps the operator would retire on this evidence and which not.
5. Write-backs land: `docs/siblings/README.md` gains the Angular consumer's
   entry (purpose, the board contract version it consumes, the exemplar
   class it seeds, the orders in core that advanced it, its pilot status) and
   the capability table a dated row for `consumer.angular`; 12 (the pilot's
   outcome moves the relevant sections from vision to evidenced status or
   records the failure honestly); 04 §Plural UI hosts (the Angular consumer's
   existence and its first contract); 13 showrunner row; 06 (a pending rung for the launchpad and workstreams named
   with its first slices); the concurrent plan's contribution-track slice
   (still unfiled, with the pilot as its precondition); the planning map;
   ledger entry; publication index rows and both edition locks.
6. The real run's `WS-001` and the `DotLn-Angular` repository profile exist
   in the fork in the shapes above, every member order cites both, and the
   receipt lists each vision restatement the executor needed by hand (zero is
   the target; each one names the file that should have carried it).
7. `npm test` green; no new dependency; `git diff --check` clean.

**Evidence gate:** the fixture transcripts for criteria 1 and 2; the real-run
receipt for criteria 3 and 4; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** DotLn runtime transports executing the target work; console
v1 features beyond the scaffold and its JSON contract; tenant-scoped tracks,
contribution tracks, admission policy, or a lane generator; automatic
workstream planning; publishing packages; a framework ADR (it follows this
evidence in a later pass); any change to lifecycle legality or the event
schema; evidence from any external organization's fork of the starter (their
instances are theirs; this repository records only synthetic fixtures and the
operator's own witnessed run, and the client-facing README learns from that
receipt).

**Operator-review assumptions**

1. The operator performs the GitHub fork or clone of the starter and the
   registration of `DotLn-Angular`, and witnesses the real run.
2. `DotLn-Angular`'s first change is the scaffold that consumes the board's
   JSON; its stack (Angular, Nx, NgRx Signal Store, Transloco) is the
   operator's fluent choice and is evaluated, not assumed, when the console v1
   order is planned.
3. Private paths and the operator's local layout stay out of the receipt.
4. If the real run cannot complete inside the order, the synthetic pilot and
   an honest partial receipt still close the order with the failure recorded;
   the next planning pass decides the follow-on.
