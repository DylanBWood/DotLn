# The critical path to an always-on runtime that changes external source — the 2026-09-08 planning pass, revised the same day

**Planning result:** 2026-09-08, the planning pass after the WO-039 close,
opened by the operator with an external source-level audit appended to the
dispatch and a fixed brief: verify every material claim of that audit against
the current tree, then produce a dependency-correct, evidence-driven path from
the current code to DotLn's first real external source-changing worker and on
to an independently verified source-to-deliverable vertical. The pass ran on
the clean `main` checkout at `33e2c25` (the merged WO-039 source, `v0.15.0`
unpublished) on the planning branch the operator checked out for it, with
Beware of Naive Interventionism and Do Nothing equipped.

Its first result filed two orders and eight unfiled briefs and deferred five
existing orders whole. The operator corrected it the same day, in five
messages preserved verbatim in the local-only
`docs/intake/notes/2026-09-08-critical-path-planning-correction.md` (SHA-256
`4b3a9b276ba0e3e83c0492fe7148ac394a3d07a2242361e4e193207d7d9fee23`; the
dispatch's own capture is the sibling file whose hash the ledger records):
the orders were too large and the audit's atomicity rule had not been acted
on; the predecessor's crons (a mission check and an "operator away" curve
doing 5S work) had no counterpart, and the successor is an offline
application that dispatches several actor kinds on richer policies; the
starter is the delivery vehicle that DotLn creates and progressively updates,
the operator's forks plan their own target work, and no target-application
work order belongs in this repository; the always-on runtime is the critical
path; and the work-order file must stay a stable contract while the runtime
carries the UI to author, inspect, audit and see live agent and work-order
status. The revised result is this document: 73 bounded orders filed as
[WO-044](../work-orders/WO-044-writing-worker-harness-truth.md) through
[WO-125](../work-orders/WO-125-codex-effort-selection.md) (numbers 101 to 109
belong to the adjacent corpus track and are skipped), beside
[WO-042](../work-orders/WO-042-authority-provenance.md) and
[WO-043](../work-orders/WO-043-typed-dependency-truth.md); the five epics
WO-033, WO-034, WO-035, WO-037 and WO-040 superseded whole by their children
and kept as umbrella records; the marked sequence replaced; the
[dependency graph](critical-path-2026-09-08.json) regenerated. The
claim-by-claim verification of the audit is the sibling
[source-verification report](source-verification-2026-09-08.md), with its
same-day addenda. Before the refuter ran, the operator supplied an external
review of the revised plan; §The external review records its findings,
their verification and the seven orders and eighteen corrections it
produced, and §Adapter effort selection records one further operator
request. The pass grants no activation authority.

**Refutation status.** The pass did not run `npm run plan -- refute`: the
refuter dispatches a model transport that the dispatch reserves to the
operator's budget decision and that the sandboxed session cannot launch. The
six manual receipts and the mechanized live receipt were read and their
validated rules applied by hand (§Quality gates applied). The subject now
holds seventy-six orders, so the refuter's episode is larger than any before
it; the operator runs, from a terminal outside the sandbox after the subject
is committed:

```sh
npm run plan -- refute --slug critical-path-2026-09-08
```

A hold is answered by a changed criterion and a fresh receipt, or by an
attributed operator override event, never by the planner. The earlier note
about a hold on a deliberately unfiled loop order no longer applies: that
order is filed as WO-112.

## What the operator corrected, and what changed

| Correction (verbatim in the capture)                                                                                                                                                                                                                  | What this revision does                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The orders are too large; the audit's split rule (one boundary, seam, outcome, rollback unit; mandatory split above one of eight items) was not acted on                                                                                              | Every later gate is filed as bounded orders instead of briefs; every existing epic is cut into children under the eight-item rule (§The cut) and superseded whole; each new order names one seam and one falsifiable outcome, and its rollback unit is its own merge.                                                                                                                                                                      |
| The predecessor's crons: a mission check and an "operator away" curve that starts small, widens, and does 5S work; how do actors get dispatched and find work?                                                                                        | Gate R: WO-067 compiles the presence curve, WO-068 is the resident process with three actor kinds, WO-099 is the mission check with a hold, WO-100 derives bounded work from a preauthorized portfolio, WO-110 adds the local model, WO-111 proves an unattended hour. WO-044 gains the unattended-launch rows the resident's launcher is designed from.                                                                                   |
| A harness left open 24/7 with crons; the successor is an offline app with more than a cron, using agents, the two CLIs, local models, humans and scripts                                                                                              | The resident (WO-068) is that process: offline, cadence-driven, policy-gated, with an actor catalog (`cli-worker`, `script`, `human-handoff`, then `local-model`); the harness's own scheduler is at most a launcher, decided by WO-044's rows, never the runtime.                                                                                                                                                                         |
| DotLn creates the starter and updates it progressively; the operator's forks plan the Angular and the work-related orders; why are Angular orders in DotLn?                                                                                           | The two Angular orders drafted mid-pass were withdrawn before commit. The starter spine (WO-069 to WO-079) is no longer deferred and floats beside the runtime spine; the core loop proof runs against a scratch target (WO-112); the fork's Angular run is recorded only as a sibling receipt (WO-083); the plan's earlier contradiction about the Angular repository's first change is dissolved, because the fork decides it.           |
| The vision's first sentence names a runtime; the runtime is the critical path                                                                                                                                                                         | Gate R starts immediately after WO-042 in its own lane; the first unattended proof (WO-099) needs no source change and can precede the first external change; the second replan point takes both receipts.                                                                                                                                                                                                                                 |
| The work-order file must stop becoming the execution log (contract; events; evidence; verification; final review); the runtime has the UI to author, inspect, audit, and see live agent and work-order status, with temporal structures that dispatch | WO-113 makes the five-surface separation a check and migrates the open orders' dated notes; Gate U files the runtime status projection (WO-114), the console parity contract over a loopback surface (WO-115), the served audit projection (WO-116) and the live console host (WO-117); the temporal structures are WO-067's cadences evaluated by WO-068. The Angular shell and drag-equip authoring stay fork-side over these contracts. |

Where the product record already held these ideas (the vision's first
sentence, ADR-0007, product 03 §Operator-presence policy, product 04 §Plural
UI hosts, product 09's audit projections, the map's PresencePolicy and
console-parity candidates), the first result had treated them as deferred
candidates under the dispatch's scope rules; the operator's corrections
override those rules for the runtime, its UI contracts and the starter, and
this document says so wherever it applies.

## The external review, and what changed

Before the refuter ran, the operator supplied a read-only review of the
revised branch at `f7dd92c` by a second model, preserved verbatim in the
ignored capture `docs/intake/notes/2026-09-08-codex-planning-review.md`
(SHA-256 `410c47d5a2901f8c632ddf96bd96350f27a79e86d94f612e4295e64ddc9d52ca`).
Its verdict was "revise before acceptance": the orders named the runtime,
the dispatch, the starter, the UI and the loop, but their executable
obligations did not require those pieces to work together. Every material
claim was verified against the tree before it was applied; all ten findings
and the delivery gap held.

| Finding (verified)                                                                                                                                            | Where it was true                                                                                                                                | What changed                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. The product proof did not require the resident or the starter to run the loop; the fork's run used handoff sessions                                        | WO-112's closure held no resident or UI node; WO-083 excluded runtime transports as executors                                                    | WO-118 is the product exit: one intent and standing grants carry the loop through a starter instance's resident, surviving an actor death and a resident restart, visible in the console; WO-083 now depends on it and uses the fork's resident as executor; WO-124 derives surfaces so no human touch is needed for ordinary progression.                      |
| 2. A failed proof run could close the order that unlocks the next gate                                                                                        | Assumption 2 of WO-053 and WO-112; WO-043's `hard` met by any close                                                                              | Every proof order (WO-053, WO-056, WO-099, WO-111, WO-112, WO-118, WO-083) now states that a failed run records its receipt and does not close; WO-043's `hard` and `satisfied-by-close` require a passing final-review verdict; WO-112's parity gate passes only when every representative item is observed-met, with escalation proven in a control scenario. |
| 3. Autonomous work discovery had no executable producer                                                                                                       | The Entropy Reducer's boundary is `operator-mediated-manual` and its program holds `Program.All`, which the stepper refuses                      | WO-119 is an executable producer over a target's real imperfections; WO-100 and WO-111 depend on it instead of on fixture candidates.                                                                                                                                                                                                                           |
| 4. Presence detection could mistake a worker's hook traffic for the operator's return, and cancellation was too broad                                         | WO-068's heartbeat on every governed tool call; `cancel-on-return` unscoped                                                                      | WO-121 carries signal origin (human, actor, task) and proves worker calls never imply return; WO-067 scopes cancellation to discretionary phases and lets a requested foreground task continue.                                                                                                                                                                 |
| 5. Runtime-derived work had no durable identity or path into the document control plane; the parity contract promised commands no order owned                 | `resume activate` needs a `WO-NNN` authority file; the compiled WorkOrder is a different contract; the CLI has no intent or saved-build command  | WO-120 materializes derived and UI-filed orders as durable records under the same identity and lifecycle, and adds `intent`; WO-100, WO-114 and WO-115 depend on it; WO-115 lists only implemented commands.                                                                                                                                                    |
| 6. The writer order named the wrong writable-surface type and omitted the request boundary                                                                    | `writableSurfaces: readonly []` is the Beacon perception profile's; the inspection validator requires `repo.inspect` and prohibited `repo.write` | WO-051 now adds a separate writer request with its own validator, prompt and result, a `SourceChangeProfile` type, and the transport dispatch discriminant, with the inspection refusals re-proven; its live smoke moved to WO-053.                                                                                                                             |
| 7. Grants gained authority from text in the submitted graph                                                                                                   | WO-042 treated provenance as reviewed text with no admission boundary                                                                            | WO-042 admits a grant only when a host-owned registry holds a matching entry, with an adversarial fixture and `AUTHORITY GRANT UNADMITTED`.                                                                                                                                                                                                                     |
| 8. The pull-request loop could pass on a mock's flipped bit without verifying repairs or dispositioning the thread                                            | WO-066 mapped comments to pushes; WO-065 was operator-invoked only                                                                               | WO-066 triages with evidence, verifies each repaired head before a push, applies an authorized external disposition, re-observes the resolved state, and tests a delayed comment, an incorrect suggestion and an interruption; WO-065's ordinary invoker is the resident's cadence and it depends on the screen.                                                |
| 9. Intake rules decided semantic relations by position and invalidated by span change only                                                                    | WO-061's next-entry answer rule; span-only `revise`                                                                                              | Structural facts stay structural; answer and supersession relations are inferred with evidence or left open; a superseding decision retires an unedited requirement; fixtures for interleaved and unanswered questions, reversals and quoted planning.                                                                                                          |
| 10. Sizing and dependency claims were stronger than the checks: a working-day split rule, three orders still combining substantial items, three missing edges | WO-051, WO-068 and WO-112 each held two items; WO-065 used WO-060's screen, WO-061 required a WO-054 capsule, WO-068's header omitted WO-044     | The split rule is four hours; WO-068 keeps the lifecycle and the `script` actor while WO-121 and WO-122 take presence and the other kinds; WO-123 takes the composition from WO-112; the missing edges are added or the criterion changed; WO-083's edge to the product exit is hard.                                                                           |
| The update path never left an instance runnable after an update                                                                                               | WO-077 printed instructions only                                                                                                                 | WO-077 gains an opted-in `--apply` for kit-declared mechanical actions and a fixture proving a running resident survives the update.                                                                                                                                                                                                                            |

The review's own executable checks matched this pass's: the graph acyclic
with no dangling endpoint, the index check passing, the plan gate refusing for
the missing receipt. What it could not do, and did not claim, is judge the
plan against the vision; that remains the refuter's receipt.

## Adapter effort selection (operator request)

While preparing to run the refuter on Codex, the operator relayed a finding
that the Codex transport refuses every effort but `unknown`
(`worker-transport.ts:218`) and ignores user configuration, so a Codex
refuter cannot be launched at `max` although the model supports it. The
claim is verified; WO-125 observes the override flag per level, then makes
the adapter accept the declared levels and forward the flag, with `unknown`
still requesting nothing. It has no open blocker and goes first if the
operator wants the Codex refuter at `max` before the horizon starts; the
Claude transport accepts `max` today.

## Verdict

The audit's central sentence is right and the repository already knew it: the
2026-09-06 pass counted roughly twenty machinery orders against six runtime
rungs and said the smallest useful loop exists for no user. What the audit did
not know is that WO-039 has merged since its snapshot; the
[source verification](source-verification-2026-09-08.md) records every
consequence. In one paragraph:

DotLn today can compile a build, lower it into the hooks and skills this
repository's own sessions run under, refuse a session that steps outside its
worktree, dispatch a read-only inspection worker to two real CLI harnesses,
recover it after a kill, run a blinded verifier over a synthetic repository
with process doubles, and render a board of its control state at rest. It
cannot edit a file in another repository, and nothing in it runs while the
operator is away: no process evaluates a cadence, no policy says what an
absent operator's actor may do, no adapter observes a pull request, no
browser evidence exists, no tracked-work intake exists, and the console is
read-only. The operator's predecessor does the whole loop today, unattended,
because its rules ride along as prose in a harness left open. The gap between
the two is the product, and the path below is the shortest route across it
that keeps the compiled-rule bet intact: the runtime first as a process with
a policy, the source-changing primitive beside it, the starter carrying both
to the forks, and the loop proven from core against a scratch target before
any fork runs it against a real one.

## The destination in the operator's terms

Three descriptions from the operator's own messages, generalized under the
Clean Room floor, are the exit checklist:

- **Parity with the predecessor's loop.** Link one or two stories from an
  enterprise tracker; the system performs the full intake and understanding
  of the requirements, creates the branch, makes the changes, writes proper
  conventional commits, writes a good pull-request title and body, and
  resolves every automated review comment without the operator babysitting a
  harness. Measured item by item by WO-112 in core and by the fork's own run.
- **The always-on offline application.** A local process stays resident;
  cadences and policies decide when to look for work; a mission check asks
  whether the work is still on goal; an "operator away" curve makes small
  reversible changes first and widens as each verifies, doing 5S work; the
  actors are agents, the two CLI harnesses, local models, humans and
  scripts. Gate R with Gate U's window into it.
- **The vehicle.** DotLn creates the enterprise starter and updates it
  progressively when its orders enhance the starter; the operator's laptop
  fork plans the Angular application's orders and the work fork plans work
  orders; no target-application order lives here. Gate S, with the fork's
  run recorded as a sibling receipt.

## How the new system does what the predecessor does

| Predecessor behavior                                                     | DotLn mechanism                                                                                                                                                                                                                                              | Order                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| A harness left open 24/7                                                 | A resident process per launchpad that folds the log, samples a recorded clock, and launches harness sessions only as actor episodes; the harness's scheduler is at most a launcher, decided by observed rows                                                 | WO-068                             |
| A cron that asks "are we sure we understand the goal and on mission?"    | A cadence-driven read-only verifier episode over the active contract, the diff, recent decisions and the vision theses; `drift` appends a correction and holds unattended dispatch until a human or a verified repair clears it                              | WO-099                             |
| A cron for "operator away" whose changes start small and widen, doing 5S | A compiled presence policy: phases with change-size ceilings and envelope narrowings, advance on verified success, reset on failure or at the peak, cancel on return; the Gardener's candidates derived into bounded orders inside a preauthorized portfolio | WO-067, WO-100, WO-111             |
| Different tasks from different crons                                     | Several cadences in one policy, each firing an actor episode of a declared kind under the phase's envelope                                                                                                                                                   | WO-067, WO-068                     |
| Agents, the two CLIs, local models, humans and scripts as actors         | The actor catalog: `cli-worker` over the two transports, `script` with a declared effect class, `human-handoff` as a decision packet, `local-model` over the probed endpoint; an unavailable kind is a NoOp, never a fallback                                | WO-068, WO-110, WO-051             |
| Finding and creating its own work                                        | Only inside a preauthorized portfolio (mechanics, surfaces, ceilings, budget): a candidate becomes one bounded order with `host-policy` provenance; anything else becomes a suggestion or a human handoff; planning passes stay human-dispatched             | WO-100                             |
| Completing the work                                                      | The source-change primitive in a governed worktree with a commit receipt, verification with host-run tests, bounded repair, publish under a grant, the pull-request loop                                                                                     | WO-052 to WO-056, WO-064 to WO-066 |
| Seeing what is happening                                                 | The runtime status projection, the parity commands over loopback, the served audit projection, the live console; the fork's Angular shell over the same contracts                                                                                            | WO-114 to WO-117                   |
| One hundred and forty rules                                              | The migration ledger and batches, lowered into hooks and skills the sessions run under; deferred behind the first external change with a waivable dated deferral                                                                                             | WO-096 to WO-098                   |

## The critical path

| Gate     | Orders                                                                                                                                                                                  | Blocking prerequisites (typed graph)                                                                                                                                             | Why it sits here                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| A        | WO-042 authority provenance and monotone envelopes                                                                                                                                      | none open                                                                                                                                                                        | Unattended authority, a target bundle and a fork's overlay all need an envelope no support can widen.                                                |
| B        | WO-043 typed dependency truth ∥ WO-036 evidence runner ∥ WO-113 stable contracts; WO-120 derived work identity; WO-125 Codex effort selection                                           | WO-113: WO-043; WO-120: WO-043, WO-069                                                                                                                                           | Planning and evidence hygiene, the identity seam runtime-derived work enters the control plane through, and the adapter fix the Codex refuter needs. |
| C2       | WO-044 writing-worker and unattended-launch harness truth                                                                                                                               | none open                                                                                                                                                                        | Principle 15: the target bundle, the transport profile and the resident's launcher are designed from observed rows. R1 follows its record.           |
| C1       | WO-045 to WO-048 codecs                                                                                                                                                                 | none open                                                                                                                                                                        | Float; mandatory before the loop touches anything the operator keeps (WO-112).                                                                       |
| R        | WO-067 presence policy → WO-068 resident → WO-121 presence origin, WO-119 discovery, WO-122 actors → WO-099 mission check; WO-100 portfolio; WO-110 local model; WO-111 unattended hour | WO-067: WO-042; WO-068: WO-067, WO-050, WO-044; WO-100: WO-119, WO-120, WO-052, WO-054; WO-111: WO-100, WO-119, WO-099, WO-053, WO-054                                           | The runtime the vision's first sentence names; the first unattended proof (WO-099) needs no source change.                                           |
| D        | WO-049 target bundle → WO-050 slices, WO-051 profile → WO-052 host → WO-053 first change                                                                                                | WO-049: WO-042, WO-044; WO-052: WO-049, WO-050, WO-051                                                                                                                           | The source-changing primitive and the first external change; R2 follows WO-053 and WO-111.                                                           |
| U        | WO-114 status projection → WO-115 parity contract → WO-116 audit → WO-117 live console                                                                                                  | WO-114: WO-068; WO-117: WO-099                                                                                                                                                   | The runtime's window: author, inspect, audit, live status; the fork's shell consumes the same contracts.                                             |
| S        | WO-069, WO-070 → WO-074 → WO-075 → WO-076, WO-077, WO-078; WO-071 → WO-072, WO-073; WO-079                                                                                              | WO-075: WO-074, WO-049, WO-042; WO-072: WO-071, WO-049                                                                                                                           | The vehicle; not deferred; the first export carries whatever runtime exists at its commit, and updates carry the rest.                               |
| E        | WO-054 → WO-055 → WO-056                                                                                                                                                                | WO-054: WO-052                                                                                                                                                                   | Verification and repair lifted onto a real worktree, then live.                                                                                      |
| F        | WO-057 → WO-058 → WO-059                                                                                                                                                                | WO-059: WO-057, WO-058                                                                                                                                                           | Visual and network claims; floats until the loop proof needs it.                                                                                     |
| G        | WO-060 → WO-061, WO-062 → WO-124 surfaces                                                                                                                                               | WO-061, WO-062: WO-060; WO-124: WO-061, WO-054                                                                                                                                   | Intake from a tracked-work artifact and the surfaces derived from it; the tracker adapter stays outside core.                                        |
| H        | WO-063 → WO-064 → WO-065 → WO-066                                                                                                                                                       | WO-064: WO-052, WO-063, WO-042; WO-066: WO-065, WO-055                                                                                                                           | Publish under a grant and the post-PR loop.                                                                                                          |
| V        | WO-123 composition → WO-112 the loop from core → WO-118 the resident-owned loop from a starter instance                                                                                 | WO-123: the primitives; WO-112: WO-123, WO-053, WO-056, WO-045 to WO-048; WO-118: WO-112, WO-111, WO-100, WO-120, WO-121, WO-122, WO-124, WO-075, WO-076, WO-114, WO-117, WO-066 | The parity proof against a scratch target, then the product exit through the resident from a starter; R3 follows.                                    |
| P        | WO-080 → WO-081, WO-082 → WO-083 the fork's run                                                                                                                                         | WO-080: WO-071; WO-083: WO-118, WO-082, WO-073                                                                                                                                   | Workstreams and the operator-witnessed run from the fork's resident, recorded here as a receipt.                                                     |
| deferred | WO-084 to WO-090 docs reset; WO-091 to WO-095 workshop; WO-096 to WO-098 migration                                                                                                      | a dated `planning-deferral` on WO-053, waivable by the operator                                                                                                                  | Not the product bottleneck; each child floats after the first external change or a dated waiver.                                                     |

Two blocking chains lead to the two first proofs, and both begin at WO-042:

- **Unattended:** WO-042 → WO-067 → WO-068 (which also waits for WO-050 and
  WO-044's rows) → WO-099. Three orders after the floor, the resident fires
  a mission check while the operator is away.
- **External change:** WO-042 → WO-044 → WO-049 → WO-052 (with WO-050 and
  WO-051) → WO-053. Four orders after the floor, a worker commits in a
  repository outside DotLn.

They join at WO-100 and WO-111 (unattended 5S work under the curve); the
loop proof WO-112 follows E, F, G and H through WO-123's composition; and
the product exit, WO-118, requires the runtime, the starter and the UI
contracts together. The starter and UI spines run beside the chains.

## Lanes

Lane rules are the concurrent plan's, unchanged: no shared primary write
surface in one wave; independent progress; the operator voluntarily
serializes final review through release close. Sixteen orders have no
blocking prerequisite today: WO-042, WO-043, WO-044, WO-045 to WO-048,
WO-050, WO-057, WO-058, WO-060, WO-063, WO-069, WO-070, WO-079 and WO-110.

```text
now    WO-042 (compiler)  ∥ WO-043 (scripts, order metadata) ∥ WO-036 (test runner) ∥ WO-044 (probe, discovery) ∥ WO-069, WO-070 (config, beacons)
       ∥ codecs WO-045..048 (kernel, hosts) ∥ WO-050 (reactor slices) ∥ WO-057, WO-058, WO-060, WO-063 (contracts, lint)
then   WO-067 (presence policy)          ∥ WO-049 (target bundle)     ∥ WO-074 (export kit)   ∥ WO-113 (stable contracts)
then   WO-068 (resident)                  ∥ WO-051 (transport profile) ∥ WO-071 (registration) ∥ WO-059, WO-061, WO-062
then   WO-099 (mission check, unattended) ∥ WO-052 (source-change host) ∥ WO-075 (kit runtime) ∥ WO-072, WO-073
then   WO-114 → WO-115 → WO-116 → WO-117  ∥ WO-053 (first external change) → WO-054 → WO-055 → WO-056 ∥ WO-076, WO-077, WO-078
then   WO-100 (portfolio) → WO-111 (unattended hour)   ∥ WO-064 → WO-065 → WO-066   ∥ WO-080 → WO-081, WO-082
then   WO-123 → WO-112 (the loop from core) → WO-118 (the resident-owned loop from a starter instance) → WO-083 (the fork's run, receipt here)
after  the deferred families, each after WO-053 or a dated waiver
```

Version assignment stays serial: the first merger takes the next version
above the latest published tag; the second retimes with `release prepare`.
WO-042 and WO-036 both touch the root `test` entry by one line; several
orders regenerate the committed bundle's pins, which merge as generated
bytes through `harness emit`.

## Dependency graph

The machine-readable graph is [`critical-path-2026-09-08.json`](critical-path-2026-09-08.json):
100 nodes (67 filed orders, WO-036, the five umbrella records, WO-014, four
corpus drafts and twenty-two closed orders they cite) and 162 edges; a script
over it found no dangling edge and no cycle. Relation vocabulary: `hard` and
`planning-deferral` block; `satisfied-by-release` and `satisfied-by-close`
block only while unmet; `reference-only`, `historical-evidence`, `waived` and
`superseded` never block. Supersession of a slice is a node annotation on the
filed order (WO-049 and WO-064 carve their halves out of WO-033); supersession
of a whole umbrella is a node annotation naming its children. WO-043 migrates
these edges into typed blocks in the order files.

## Stop and replan points

1. **R1, mandatory, after WO-044's record.** Two row families decide two
   designs: if a target worktree's own hooks and settings do not apply to a
   print-mode or exec-mode worker, WO-049 becomes a host-side containment
   order; if no harness can be launched by a detached parent without an
   interactive login, WO-068's `cli-worker` kind is unavailable until a
   launch path exists and the resident's first proofs run with `script` and
   `local-model` actors. Nothing after WO-044 in either chain is activated
   before this checkpoint.
2. **R2, mandatory, after WO-053's and WO-111's receipts.** Decide from the
   episodes: the cost and session counts against the audit's measures; the
   first portfolio edit toward the operator's repositories; whether the
   starter's first export should wait for WO-100; whether the deferred
   families are waived.
3. **R3, after WO-112 and the fork's first run (WO-083).** The console
   framework decision, the migration cadence, the second starter export and
   the work fork's first orders are re-cut on the measurements.
4. **Stop rules.** A WO-042 fixture that requires changing a committed
   loadout's semantic hash stops that order for a decision. A source-change
   episode that writes outside its worktree, or a resident dispatch outside
   its portfolio, stops its gate until the containment is structural. A hold
   from the refuter is answered by a changed criterion and a fresh receipt or
   by an operator override event, never by the planner.

## The first proofs

- **WO-099** is the first time DotLn does anything while the operator is
  away: the resident fires a cadence and a live verifier judges a session
  with a planted drift. Read-only; no source change needed.
- **WO-053** is the first time a session, an actor or a pattern changes a
  file in another repository that the operator did not edit by hand.
- **WO-111** is the predecessor's "operator away" behavior made true: 5S
  work derived, executed, verified and stopped on return, under the curve.
- **WO-112** is the parity proof: the loop from a tracked-work artifact to a
  verified pull request with every automated comment resolved, against a
  scratch target.
- **WO-118** is the product exit: one intent filed in a starter instance
  travels the whole loop under that instance's resident, surviving an actor
  death and a resident restart, with only material decisions returned.
- **WO-083** is the operator's own proof, from the fork's resident, against
  the Angular repository, recorded here only as a receipt.

## The cut

The audit's rule: an order normally introduces one capability boundary, one
primary integration seam, one independently falsifiable outcome and one
rollback unit, and must be split when it holds more than one of: a new public
contract, a new external adapter, a new persistence shape, a new compiler
target, a new UI projection, a self-hosting migration, cross-repository
behavior, an independent live proof. Applied to the five epics:

| Umbrella                        | Items it combined                                                                                                                                                                                                                                                                | Children                                                                                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WO-033 compiled starter export  | a configuration contract; a registration contract; a target lifecycle (cross-repository); a class and profile convention; an export command; a runtime build in the export; an overlay contract; an update command; a registry; a sync helper; the camouflage lint; a live smoke | WO-069, WO-070, WO-071, WO-072, WO-073, WO-074, WO-075, WO-076, WO-077, WO-078, WO-079; the emit and publish halves as WO-049 and WO-064; the lint as WO-063; the build-first item as WO-036 |
| WO-034 cross-repository pilot   | a document convention and index projection; a UI projection; six fixtures; an operator-witnessed live run with a baseline attestation                                                                                                                                            | WO-080, WO-081, WO-082, WO-083                                                                                                                                                               |
| WO-035 documentation reset      | seven independent moves each with its own check or measurement                                                                                                                                                                                                                   | WO-084, WO-085, WO-086, WO-087, WO-088, WO-089, WO-090                                                                                                                                       |
| WO-037 5S equipment set         | a lowering change; a graph collection (public contract); five mechanic definitions; five bonus lowerings; a scenario and a render                                                                                                                                                | WO-091, WO-092, WO-093, WO-094, WO-095                                                                                                                                                       |
| WO-040 rule migration batch one | a generated ledger with its check; twelve units with retirements; the measurement and template                                                                                                                                                                                   | WO-096, WO-097, WO-098                                                                                                                                                                       |

Applied to the later gates the first result had left as briefs: the codecs
brief held four boundaries (WO-045 to WO-048); the source-changing worker
brief held a refactor, an adapter, a persistence shape and a live proof
(WO-050 to WO-053); the verification brief held a host profile, a
continuation and a live proof (WO-054 to WO-056); the browser brief held a
discovery, a contract and an adapter (WO-057 to WO-059); the intake brief
held a contract, a compile and an adapter (WO-060 to WO-062); the publish and
vertical briefs held a lint, a remote adapter, an observer, a loop and a live
proof (WO-063 to WO-066, WO-112). Every filed order names its seam in its
placement paragraph and its outcome in its criteria; its rollback unit is its
own merge.

Sizing: the control log's recent implementation spans ran four to twelve
hours per order, which the operator named as the problem. Each order here is
cut to one seam and one outcome; the first three merges of the horizon are
measured with `resume: times` at R1, and an order whose implementation span
exceeds four hours is split again before the next activates. The external
review found three orders still holding two items each; WO-121, WO-122 and
WO-123 take those halves.

## Deferred work

Three families carry a dated `planning-deferral` edge on WO-053 that the
operator can waive with a dated note; nothing else is deferred.

- **Documentation reset, WO-084 to WO-090.** Not the product bottleneck;
  WO-113 covers the one separation the audit named for work-order files.
- **Pattern workshop, WO-091 to WO-095.** The full 5S set widens the
  Gardener's candidates for WO-100; the Entropy Reducer already supplies
  Shine and Standardize, which the first portfolio uses.
- **Rule migration, WO-096 to WO-098.** Rules are lowered into hooks and
  skills that govern sessions; the first real external episode is a better
  classification input than another corpus pass. The operator's statement
  that the predecessor's value is its one hundred and forty rules is
  recorded; if the operator waives this deferral, WO-096 has no open
  blocker.

The umbrella records WO-033, WO-034, WO-035, WO-037 and WO-040 keep their
numbers and text as the record their children cite; each carries a dated
umbrella note that WO-113 migrates into a typed `superseded` block. Floating
and adjacent orders are untouched: WO-014 floats; WO-102, WO-103, WO-105 and
WO-107 keep their track, WO-105 as reference evidence for the codecs.

## Migration map

| Existing order         | Relationship                      | Obligations and where they go                                                                                                                                                                                                                                                                   |
| ---------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WO-036                 | remains active                    | Unchanged; carries the WO-033 build-first item.                                                                                                                                                                                                                                                 |
| WO-033                 | superseded whole; umbrella record | Phase 1 → WO-069; Beacon portability → WO-070; phase 2 → WO-071, WO-072, WO-073, WO-049 (emit), WO-064 (publish), WO-063 (lint); phase 3 → WO-074, WO-075; kit and overlay → WO-076, WO-077; sibling registry → WO-078; phase 4 → WO-079; license files at export → WO-074; boy-scout → WO-036. |
| WO-034                 | superseded whole; umbrella record | Workstream document and index → WO-080; board section → WO-081; six demonstrations → WO-082; real run, baseline block, priming measurement → WO-083; the Angular-first-change premise stands and is the fork's to plan.                                                                         |
| WO-035                 | superseded whole; umbrella record | Ledger → WO-084; spec/receipt boundary → WO-085; release history → WO-086; roadmap split → WO-087; phrase table → WO-088; capability table → WO-089; cold start → WO-090.                                                                                                                       |
| WO-037                 | superseded whole; umbrella record | Multi-active → WO-091; sets → WO-092; mechanics → WO-093; bonuses → WO-094; scenario and render → WO-095.                                                                                                                                                                                       |
| WO-040                 | superseded whole; umbrella record | Ledger and classification → WO-096; batch one → WO-097, WO-098 (six units each); the stale live-activation sentence is corrected in the umbrella note.                                                                                                                                          |
| WO-039                 | satisfied by existing evidence    | The audit's harness-truth, lowering and self-host orders are its record; the residual rows are WO-044.                                                                                                                                                                                          |
| WO-009, WO-010         | satisfied by existing evidence    | Transports, worker store, leases, recovery (WO-051, WO-052 extend); the verification loop (WO-054, WO-055 lift).                                                                                                                                                                                |
| WO-011                 | satisfied by existing evidence    | The ten units govern this repository's sessions; WO-096 to WO-098 continue them.                                                                                                                                                                                                                |
| WO-023                 | satisfied by existing evidence    | The Entropy Reducer's candidates are WO-100's first input.                                                                                                                                                                                                                                      |
| WO-027, WO-007, WO-041 | reference only                    | The local-inference probe (WO-110), the audit fold (WO-116), the judge shape (WO-099).                                                                                                                                                                                                          |
| WO-008, WO-032         | reference only                    | The VER-001 F2 finding is WO-042's origin; the board's expectations regenerate under WO-042 and extend under WO-081 and WO-114.                                                                                                                                                                 |
| WO-014                 | reference only, floating          | Unchanged.                                                                                                                                                                                                                                                                                      |
| WO-102 to WO-107       | reference only, adjacent track    | Unchanged; WO-105 is reference evidence for WO-045 and WO-048.                                                                                                                                                                                                                                  |

The prose "Depends on" paragraphs of closed orders are not edited (never
back-fill history); WO-043 labels their token view.

## Planning-risk register

| Risk                                                        | Evidence today                                                                                                                                      | Mitigation on the path                                                                                                                                                    | Trigger to revisit                                                                           |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Authority widening                                          | Support claims and permission emissions widen the compiled envelope; the lowered hooks enforce it; latent today.                                    | WO-042 first; a presence phase, a portfolio, a registration and an overlay all validate under the floor; grants carry provenance.                                         | Any loadout authored outside this repository.                                                |
| Unattended authority                                        | No policy or process exists; the predecessor's curve is prose in a harness.                                                                         | The curve is data (WO-067) evaluated by a process whose every decision is an event (WO-068); work comes only from a portfolio (WO-100); the mission check holds (WO-099). | A resident dispatch outside its portfolio, which stops the gate.                             |
| Harness assumptions unverified                              | No record of a writing worker in a foreign worktree or of a detached launch without a login.                                                        | WO-044 before WO-049, WO-051 and WO-068; R1 decides both designs.                                                                                                         | R1.                                                                                          |
| Order size                                                  | Recent implementation spans of four to twelve hours; the operator's observation.                                                                    | One seam and one outcome per order; spans measured at R1; a split rule for any order over four hours.                                                                     | The first three merges.                                                                      |
| A failed proof closing the order that unlocks the next gate | The first revision let WO-053 and WO-112 close on a failed run while `hard` was met by any close.                                                   | Every proof order records a failed run without closing; WO-043 requires a passing final-review verdict for `hard` and `satisfied-by-close`.                               | Any proof receipt that is not an observed success.                                           |
| Grant text as authority                                     | The first WO-042 draft admitted a grant on a matching repository and a provenance string.                                                           | A host-owned registry must hold the grant; an adversarial fixture proves a claimed grant rejects.                                                                         | Any loadout authored outside this repository.                                                |
| Presence misread from actor activity                        | The first resident draft's heartbeat fired on every governed tool call.                                                                             | WO-121 carries origin; actor heartbeats feed liveness only; cancellation is scoped to discretionary phases.                                                               | A resident that stops its own work on a worker's first call, which WO-121's fixture forbids. |
| A manual producer behind autonomous discovery               | The Entropy Reducer's review is operator-mediated and uses a program kind the stepper refuses.                                                      | WO-119 produces candidates from a target's real imperfections with the executable subset; WO-100 consumes only it.                                                        | Any portfolio input that is an authored list.                                                |
| Malformed persisted state                                   | Store envelope and hook input are casts; no misdecode demonstrated.                                                                                 | WO-045 to WO-048 float; mandatory before WO-112.                                                                                                                          | A recovery that reads a state the decoder cannot classify.                                   |
| Unsupported executable grammar                              | `stepProgram` throws on deferred kinds; the subset is a constant.                                                                                   | WO-046; the resident's and repair continuations use the executable subset.                                                                                                | A persisted continuation of a deferred kind.                                                 |
| Application-specific replay assumptions                     | `replay` reads reserved keys; documented.                                                                                                           | WO-047's projector; WO-050's slices consume it.                                                                                                                           | A second state shape (WO-050).                                                               |
| Dependency drift                                            | The index misreports closed orders as blocked; activation reads no dependency.                                                                      | WO-043 with the regenerated graph as seed; WO-113 keeps order files as contracts.                                                                                         | Any new order citing a historical id.                                                        |
| Integration-package growth                                  | 46 skeleton files; one decider; three new hosts on this path.                                                                                       | WO-050 splits state into slices before any new host branch; the audit's package split is not adopted before a seam needs it.                                              | R2.                                                                                          |
| A second authority path through a UI                        | The board is read-only today; a UI that can author is a new command surface.                                                                        | WO-115: every UI command is the terminal's implementation under the compiled envelope, bound to the local user's loopback.                                                | Any UI host that needs a command the terminal lacks.                                         |
| Self-hosting masking lack of external value                 | The repository governs, tests, documents and plans itself; the loop exists for no user.                                                             | Two first proofs, both outside this repository's own work (WO-099 judges a session; WO-053 changes a scratch repository); the fork's run is the operator's proof.         | Any pass that files machinery without a demonstrated blocker to a real session.              |
| Target-application work drifting into core                  | Two Angular orders were drafted mid-pass.                                                                                                           | Withdrawn; the rule is written into WO-073, WO-083 and WO-112: target-application profiles and orders are the fork's.                                                     | Any order here that names a target application's content.                                    |
| Unclassified effectful tools bypass the writer guard        | The guard gates Bash, Edit and Write; a listing subagent obtained shell output through a monitoring tool.                                           | Recorded as a map candidate; close before WO-049 emits into a target.                                                                                                     | Before WO-049.                                                                               |
| Permission matchers refuse commands by token                | This pass's own shell commands were refused when their text contained remote-effect tokens or an environment-file token, including read-only greps. | Recorded here and in the ledger as a candidate: the classifier should match commands, not substrings of heredoc or pattern text.                                          | Before WO-068 launches `script` actors whose commands carry arbitrary text.                  |
| Refutation gate cost                                        | The subject holds sixty-eight orders; every pass needs an operator-run episode.                                                                     | The command and the override route are recorded above.                                                                                                                    | A third consecutive hold stops the pass by rule.                                             |
| Clean-room exposure from external material                  | The audit named a tracker and the employer; the operator's messages name their repositories.                                                        | Captures stay ignored; committed text says "enterprise tracker", "the operator's Angular repository", "the work fork".                                                    | Any future dispatch that quotes private material.                                            |

## Lineage-preservation appendix

Ideas from the 2026-09-06 priming note and the repository's long-range
records, with where each stays recorded and what this revision does to it.
Classifications: **invariant retained**, **immediate gate**, **critical-path
destination**, **deferred candidate**, **fork-side**, or **superseded sequence
with obligations preserved**.

| Enduring idea                                                                            | Source                                | This revision                                                                                        | Where it stays recorded       |
| ---------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| A build, not a biography                                                                 | note §1; vision                       | invariant retained; WO-042, WO-049, WO-075 carry the build to sessions, targets and forks            | vision; WO-039                |
| Actors are the unit, people are actors                                                   | note §1; product 13; WO-032           | critical-path destination: the actor catalog (WO-068) includes `human-handoff`                       | product 13; WO-068            |
| The shelf compiles                                                                       | note §1; vision                       | deferred candidate: WO-091 to WO-095 after WO-053 or a waiver                                        | WO-037 umbrella; children     |
| Evidence precedes done; the implementer never verifies                                   | note §1; Principle 6                  | invariant retained; WO-054 to WO-056, WO-099                                                         | principles; WO-010            |
| Three horizons; Horizon 3 never distorts Horizon 1                                       | note §1; vision                       | invariant retained; the path is Horizon 1 until WO-112                                               | vision                        |
| The operator's chain (core → starter → fork → target → back)                             | note §2; ledger 2026-09-06            | immediate gate: Gate S floats beside the runtime; WO-077 makes the chain mechanical                  | ledger; product 03            |
| The refuter's eleven rules                                                               | note §3; receipts                     | invariant retained; applied by hand (§Quality gates applied)                                         | refutations                   |
| The 2026-09-06 wave plan and fork-binding path                                           | note §4; phase-two plan               | superseded sequence with obligations preserved; the starter is no longer deferred                    | phase-two plan; this document |
| Console parity contract v1                                                               | note §5; map candidate                | immediate gate: WO-115 (the contract half); drag-equip authoring is fork-side over it                | WO-115; map                   |
| Presence policy compiled (the resident Gardener)                                         | note §5; ADR-0007; roadmap            | immediate gate: WO-067, WO-068, WO-100, WO-111                                                       | ADR-0007; Gate R              |
| Intent declaration and the stranger test                                                 | note §5; receipt 006                  | deferred candidate; WO-115 exposes "file an intent as a draft" as a command; the stranger stays v1.0 | map candidates; roadmap       |
| Migration batches two onward                                                             | note §5; WO-040                       | deferred candidate after WO-098                                                                      | map candidates                |
| Source-writing worker v1                                                                 | note §5; roadmap                      | critical-path destination: WO-051 to WO-053                                                          | Gate D                        |
| Drag-equip authoring; the Angular shell; UIFA v1                                         | note §5; WO-034                       | fork-side over WO-114 and WO-115; recorded here only as WO-083's receipt                             | WO-034 umbrella; WO-083       |
| Isomorphic views beyond three codecs; semantic zoom                                      | note §5; product 04                   | deferred candidate                                                                                   | product 04                    |
| Replay scrubber and first divergence                                                     | note §5; roadmap                      | deferred candidate; WO-116 serves the audit projections a scrubber would read                        | roadmap                       |
| Browser verification adapter                                                             | note §5; product 03                   | critical-path destination: WO-057 to WO-059                                                          | Gate F                        |
| Source-to-deliverable vertical with the post-PR loop                                     | note §5; roadmap; ADR-0002 Decision 2 | critical-path destination: WO-060 to WO-066, WO-112                                                  | Gates G, H, V                 |
| Skill pack export; bring your own agent                                                  | note §5; product 03; WO-033           | immediate gate: WO-074, WO-075                                                                       | Gate S                        |
| Phase four: v1.0.0 stranger test, real forks, owner-sovereign profile, cohorts, editions | note §5; roadmap; ADR-0006            | deferred candidate; the work fork is the first real fork after WO-083                                | roadmap; ADR-0006             |
| Phase five: counterfactual runs, προτείνω, the founding catalog, Embodied Explorer       | note §5; product 11                   | deferred candidate                                                                                   | product 11                    |
| "The most valuable order makes an existing claim true in a real session"                 | note §6                               | invariant retained; the two first proofs are chosen by it                                            | this document                 |
| The do-not-relitigate list                                                               | note §6; ADRs; Resolutions            | honored; the browser dependency is a note under ADR-0002's own amendment path                        | decisions                     |
| A correction is a typed event                                                            | note §6; product 02                   | invariant retained; the operator's corrections were captured and each produced a named change        | the captures; this table      |
| Override attributable, not refusable                                                     | receipt 006; WO-041                   | invariant retained; bounds grant and portfolio provenance                                            | WO-041; WO-042; WO-100        |

## Declined candidates — the NoOp register

Each entry follows the `NoOpIntent` shape: reason, evidence, reversal
condition. Two entries of the first result are reversed by the operator's
direction and say so.

- **Filing numbered orders for every later gate.** Reversed the same day by
  the operator (anti-oscillation: an explicit supersession, quoted in the
  capture); every gate is filed.
- **Activating WO-033 first, or deferring the starter behind the proof.**
  Superseded: the starter is the vehicle and its children float; neither
  "first" nor "deferred" applies. Reverse never; the operator decided.
- **Deciding WO-034's Angular-first-change premise now.** Dissolved: no
  Angular order lives here; the fork plans the shell.
- **A scheduler beyond compiled cadences and a presence policy.** NoOp. The
  resident evaluates cadences the build declares; a general scheduler is a
  new authority path. Reverse when a policy cannot express a needed rhythm.
- **The harness's own cron as the runtime.** NoOp. The product runs offline
  and harness-agnostic; a harness schedule is at most a launcher, decided by
  WO-044's rows. Reverse never.
- **A web UI in core.** NoOp. The text console is the reference host; the
  operator's Angular shell is the second host over the same contracts.
  Reverse if the fork's shell cannot be built on the contracts.
- **Authenticated presence or signed grants.** NoOp. Presence signals and
  grant provenance are reviewed text under the same limit WO-029 recorded.
  Reverse at an external principal.
- **A dependency registry or scheduler for planning.** NoOp. The authority
  file stays the source; the index projects (WO-043).
- **Running the refuter inside this pass.** NoOp. The sandbox refuses the
  transports and the dispatch reserves the budget decision.
- **Closing the unclassified-tool bypass, or the token-matching refusal, in
  this pass.** NoOp. Hook behavior is implementation; both are map
  candidates.
- **Product-doc write-backs beyond the one procedure sentence.** NoOp. Each
  order owns its write-backs; the product record already carries the
  runtime, presence and UI ideas.
- **Editing closed orders' "Depends on" paragraphs.** NoOp. History is not
  back-filled.
- **Adopting the audit's package split.** NoOp. WO-050's slices are the
  first seam; a package split follows a second host with a consumer.
- **Implementing `Program.All` for discovery.** NoOp. WO-119 expresses
  discovery in the executable subset; the deferred kinds wait for a consumer
  that needs concurrency inside one program. Reverse when one appears.
- **Renumbering the children to avoid the corpus range.** NoOp. Numbers are
  opaque identities; the mainline skips 101 to 109 and continues at 110.

## Quality gates applied

- **Acyclic.** The regenerated graph has no cycle and no dangling edge (the
  script's output is in the session result and summarized in the ledger).
- **Only unmet hard dependencies and dated planning deferrals block.**
  Sixteen filed orders block on nothing today; every other blocking set
  names filed orders; WO-043 makes the machine say so.
- **Independently testable criteria.** Every criterion names a fixture, a
  hash, a rendered output, a refusal, a recorded row or a receipt a fresh
  session can reproduce; live rows are labeled operator-run.
- **One capability per order.** Each order's design names one seam and its
  non-goals name the neighbors that hold the rest; the eight-item rule is
  applied in §The cut.
- **Visible and effective authority cannot diverge.** After WO-042 every
  envelope a phase, portfolio, registration, overlay or UI command uses is a
  projection of one effective envelope; WO-115 forbids a second command
  authority.
- **External source modification precedes cross-repository coordination,
  broad rule migration and target-application work.** WO-080 onward follow
  WO-071 and the loop proof; the migration is deferred; no Angular order is
  here. The starter and UI spines are exceptions the operator directed and
  this document records as such.
- **Contradiction scan.** WO-034's premise: dissolved. WO-033's fork-binding
  assumption: now the S spine. WO-040's stale sentence: corrected in its
  umbrella note. The phase-two plan's wave plan: superseded in sequence with
  a dated note. The dispatch's scope exclusions (actor board, UI, starter):
  overridden by the operator's later messages, recorded in §What the
  operator corrected. No settled decision is reopened.
- **Facts and recommendations kept apart.** The source-verification report
  holds the facts; the orders are recommendations and say so.
- **The refuter's eleven rules.** Direction: hash and bundle criteria are
  equalities; rejection criteria name the diagnostic; live criteria name the
  observed field. Denominators: none classified by the executor. Baselines:
  the four semantic hashes, the activation base's bundle, the recorded
  traces. Mechanism labels: retired prose is mapped to units only in WO-097
  and WO-098. Cold start: WO-073 and WO-090 measure it. Starter loadout
  prescription: WO-076 lets a fork replace it. Terms: no list committed;
  the screen runs over the new prose. A person on the board: WO-068's
  `human-handoff` is an actor kind, not a board claim. Drift can cite §What
  DotLn is not: every gate names its thesis surface. A hold is answered by
  the operator. Deferrals name recorded candidates. Role service: showrunner
  (WO-114, WO-117), engineer (WO-052, WO-100), tester (WO-054, WO-099),
  devops (WO-068, WO-075), product lead (WO-061, WO-112).

## Reversal conditions for the plan

- If R1 shows no detached launch path for either harness, Gate R's first
  proofs run with `script` and `local-model` actors and WO-051's profile
  waits; the resident is not blocked.
- If R1 shows target-worktree hooks cannot govern a print-mode worker,
  WO-049 becomes a host-side containment order and WO-053 keeps its external
  checks.
- If WO-042's floor breaks a committed loadout's hash, the order stops for a
  decision rather than moving a hash.
- If the operator waives a family's deferral with a dated note, its first
  child has no open blocker.
- If a third consecutive refutation hold stops this pass, the next pass
  carries every hold forward or names the changed criterion.

## Evidence of this pass

The first result's evidence (revision `d1da629`, subject hash
`sha256:22ee38d076a022c679b643341dfccfdbd10230f10a4f3b57361370e2ddc347fa`)
stands in the ledger section. The revised pass's checks ran on the committed revision `6ab27c4`
(subject revision `6ab27c4`, subject hash `sha256:a5576cbcf1c449fefd3d8905849d5f59a669c699bc0392b7c636870c765e571a`):

- `npm run work-orders -- index` regenerated and `index --check` passed over
  every order file; `npm run plan -- subject` built the 68-order subject
  with 350 acceptance criteria and no parse failure; the 65 new
  order files run from 52 to 143 lines with a median of 79.
- The graph generator found 100 nodes, 162 edges, no dangling edge and no
  cycle; sixteen filed orders have an empty blocking set.
- The work-order shell suite and the plan-refutation suite's fixtures
  passed; the plan-refutation suite then refused at its repository gate with
  `planning pass planning-4a8993a79ee8cd05 needs a receipt`, by design; the
  full chain's other steps were passed by the first result's run and no
  runtime source, test, package or build configuration changed since.
- The formatter check passed over every changed formatted file; the
  local-terms screen ran over all seventy-six changed committed files with
  the operator's list present and exit 0; the publication checks passed
  (no product heading changed); `git diff --check` is clean.
- Three of the pass's own shell commands were refused by the compiled
  permission hook (recorded in the risk register and the ledger); no write
  was attempted around it.

The review revision's checks ran on the committed revision `f167553`
(subject hash
`sha256:75d94cdb2736f18b3ad49bfed67603e91670ab1b79054ce891359b8e292cb231`):

- `index --check` passed; `npm run plan -- subject` built the 76-order
  subject with 393 acceptance criteria and no parse failure; the 73 new
  order files run from 52 to 143 lines with a median of 83.
- The graph generator found 109 nodes, 200 edges, no dangling edge and no
  cycle; sixteen filed orders have an empty blocking set; the product exit
  WO-118 blocks on twelve filed orders, none of them a proof that may close
  on failure.
- The work-order shell suite and the plan-refutation fixtures passed; the
  gate refused for the missing receipt, by design. The formatter, the
  local-terms screen (list present), the publication checks and
  `git diff --check` passed over every changed file.
