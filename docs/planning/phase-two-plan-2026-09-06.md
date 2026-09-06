# Phase two — the 2026-09-06 planning pass

**Planning result:** 2026-09-06, the planning pass after the `v0.13.1` close,
opened by the operator as the largest planning session to date, on the clean
`main` checkout between work orders with Beware of Naive Interventionism and
Do Nothing equipped. It answers four operator questions — a whole-repository
sweep with a six-month projection, two product fronts at once (the enterprise
workflow and a console), whether progress still tracks the vision and the
founding corpus, and whether concurrent work orders are safe — and files five
planner-synthesized drafts: [WO-032](../work-orders/WO-032-showrunner-board.md),
[WO-033](../work-orders/WO-033-relocatable-control-plane.md),
[WO-034](../work-orders/WO-034-cross-repository-workstream-pilot.md),
[WO-035](../work-orders/WO-035-documentation-structure-reset.md),
[WO-036](../work-orders/WO-036-evidence-runner.md), and, as the wave-3
candidate that keeps the differentiated product's path visible,
[WO-037](../work-orders/WO-037-five-s-equipment-set.md). It grants no
activation authority and changes no immutable evidence. The
[marked sequence](work-order-map.md#recommendation-and-rationale) is the
editable recommendation; this plan explains it. The verbatim dispatch is
preserved locally in `docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`
(SHA-256 `e8ccc4e788ca0ce66612a12cdd8919d7f4dee5e9303b799460e18dc1c087b287`).

Two read-only sweeps were delegated to fresh sessions during the pass, one
over code and one over documentation structure. Their measurements are
reproduced below where they inform a decision; nothing they proposed was
adopted without a named consumer and a reversal condition.

## Where the repository stands

Twenty-seven work orders are control-closed and twenty-six annotated releases
are published, `v0.2.0` through `v0.13.1`, in seven days. The horizon the
2026-09-05 pass marked (WO-020 → WO-030 → WO-021 ∥ WO-029 → WO-009 ∥ WO-031 →
WO-022 ∥ WO-010 → WO-011) is complete; every order in it ran serially, so the
paired waves it proposed were never measured. Six drafts remain open on the
adjacent evidence/corpus track (WO-102, WO-103, WO-105, WO-107, WO-109) and as
the floating approval-burden option (WO-014).

What the code proves today, in the repository's own terms:

| Thesis                                         | Built                                                                                                                                                                        | Not built                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Deterministic core, nondeterministic edge      | Pure kernel (events, reactors, cadence, outbox, authority guard, replay); one skeleton reactor driving live and replay; audit projections; artifact identity pinned at equip | SQLite persistence; general effect adapters                                                                |
| Compiled feedback instead of prose             | Composition compiler v1 (Seiri, three equal views, tooltip with declared cost); the ten-unit feedback compiler with regression fixtures and a bounded self-hosted audit      | Multi-active lowering; saved builds; the pattern shelf beyond Seiri and the Entropy Reducer; set bonuses   |
| Disposable workers with external memory        | Two real CLI transports for read-only fixture inspection with leases, heartbeats, recovery, and `dotln status`                                                               | Source-writing workers; scheduler ownership beyond the inspection host; worker identity attestation        |
| Independent verification                       | Blinded verifier episodes over a synthetic repository with claim-typed evidence, focused repair, and staleness                                                               | Live-model verification witnessed; code review episodes; post-PR loops                                     |
| Work operating system (Horizon 1)              | The repository's own loop: resume phrases, worktrees, checkpoints, per-order control segments, generated index, release close, Beacons, actor usage                          | A user-facing workstream; multi-repository coordination; the launchpad; the source-to-deliverable vertical |
| Executable pattern workshop (Horizon 2)        | One compiled active with five supports and a text tooltip                                                                                                                    | Drag-equip authoring; the build inspector; the shelf                                                       |
| Isomorphic views and the console               | A one-line glyph scene; the compiled diff; three editable views hashing equal                                                                                                | Any console; the sparse twin as a page; replay scrubbing                                                   |
| Simulation laboratory (Horizon 3) and προτείνω | Deterministic replay, the precondition                                                                                                                                       | Everything else, by design, post-1.0                                                                       |

## Vision alignment review

The operator's concern that "we have integrated the smallest fraction" of the
ledger and intake is right in one place and wrong in another, and the
distinction decides where effort goes next.

- **Intake → ledger is essentially complete for the founding corpus.** Every
  chat, both notes files, and all forty-six images have ledger entries; the
  header's claim holds. WO-109 remains the right vehicle for a deliberate
  shape-first re-mining, and it is deliberately unactivated: nothing in the
  founding corpus is missing from the ledger at the entry level.
- **Ledger → blueprint is broad.** 364 entries are `adopted` (in the
  blueprint), 283 `preserved`, 60 `transformed`, 16 `raw`. Only 8% of
  `preserved` entries carry a forward pointer, which is a navigation problem
  (WO-035 adds a generated ledger index), not evidence of lost ideas.
- **Blueprint → code is narrow, and that is the real gap.** Of nine
  capability rows in the pinned table, none is above level 2 and most are at
  level 1. Of the twenty-seven closed orders, roughly twenty are control-
  plane, evidence, or projection machinery (WO-004 through WO-007, WO-012
  through WO-031 apart from the runtime rungs, WO-101, WO-108) and six are
  runtime rungs (WO-002, WO-003, WO-008, WO-009, WO-010, WO-011). That is the
  "driving the car while building it" strategy working as intended, and it is
  also the roadmap's own warning coming due: "six rungs of invisible
  infrastructure is a project-death risk". Since `v0.4.0` the visible payoffs
  have been CLI receipts.
- **The smallest useful loop the vision demands does not yet exist for a
  user.** "Declare intent, see what the system understood, observe authorized
  progress, receive timely feedback, and inspect evidence" is experienced
  today only by the operator through the repository process, never through a
  product surface, and never across a second repository.
- **Two drift signals are recorded, not corrected.** The Beacon line took
  three releases (`v0.6.0`, `v0.8.0`, `v0.11.0`) while its own usefulness
  checkpoint — the operator comparison in
  [`beacon-usefulness-checkpoint.md`](beacon-usefulness-checkpoint.md) — has
  not been run. The prose-to-mechanism ratio remains the open tension the
  2026-09-02 entropy review named; the documentation grew 8,065 → 57,475
  lines in seven days while runtime source grew 484 → 19,248.

**Disposition.** The operator's two product asks coincide with the accepted
build order's next rung: ADR-0002's sequence ends "... feedback compiler →
projections → pattern workshop", and the next unfilled roadmap rung is
"Projections & console". The pass therefore turns the horizon toward the
visible loop — a console the showrunner and product lead can look at, and a
launchpad through which one workstream drives a second repository — and
files the sweep's structural corrections beside them. Horizon 2 (the pattern
workshop and the drag-equip authoring surface) is the natural wave after this
one; it needs the console shell this horizon produces. προτείνω is unchanged
as the post-1.0 destination.

## Six-month projection

Growth per published tag, measured from the tagged trees:

| Tag       | Date       | Tracked files | Docs lines | Product lines | Ledger lines | Runtime src lines | Scripts lines | VER + FINAL files | Evidence files |
| --------- | ---------- | ------------: | ---------: | ------------: | -----------: | ----------------: | ------------: | ----------------: | -------------: |
| `v0.2.0`  | 2026-08-31 |            80 |      8,065 |         3,232 |        1,551 |               484 |           613 |                 7 |              0 |
| `v0.4.0`  | 2026-09-04 |           244 |     38,523 |         6,456 |        3,483 |             6,682 |         7,036 |                65 |              0 |
| `v0.7.0`  | 2026-09-05 |           321 |     49,544 |         8,219 |        4,566 |             9,340 |        10,628 |                89 |              5 |
| `v0.10.0` | 2026-09-05 |           390 |     52,632 |         8,559 |        4,624 |            13,315 |        12,232 |               101 |             23 |
| `v0.13.1` | 2026-09-06 |           501 |     57,475 |         9,195 |        4,797 |            19,248 |        12,886 |               121 |             58 |

If the pace merely fell to a fifth of the first week's (about 130 orders by
March 2027), the code sweep's extrapolation is: skeleton source from 40 to
about 170 files, scripts from 43 to about 170, the root test chain from 23 to
about 60 serial steps and from 6–10 minutes to over 40, `reactor.ts` gaining a
state slice and a switch case per host, `release.mjs` gaining a rule per
surface, and every output change regenerating golden evidence under a new
work-order directory. The documentation sweep's extrapolation is a ledger with
two insertion points and hundreds of untagged entries, product documents that
are one-third dated receipts, and a cold start well above 2,000 mandatory
lines. None of that is a crisis today; all of it is cheap to redirect now and
expensive in six months. What breaks first, in order: the serial test chain,
the reactor's cast-per-branch growth, `release.mjs`, golden-evidence churn,
and the cold-start read cost.

## Code sweep — findings and dispositions

Shape: kernel (1,277 source lines, purity enforced by test, zero imports of
Node built-ins), compiler (4,223 lines, imports neither kernel nor skeleton),
skeleton (13,748 lines across 33 `.ts` and 7 `.mjs` files, the sole
integrator), scripts (12,984 lines: four commands, nine library modules, eight
bash suites, seven Node test scripts). Direction is kernel ‖ compiler ←
skeleton ← scripts. Zero TODOs, zero `any`; 69 `as unknown as` casts in
source, 34 of them in `reactor.ts`. Time enters only through `env.now`;
`process.env` appears only in hosts and demos.

| Finding                                                                                                                                                                                 | Disposition                                                                                                                                         | Reversal condition                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test` rebuilds `dist/` at step 15 after `test-worktree.sh` (step 9) has exercised `release.mjs`, which loads the skeleton build; that suite runs against stale output              | **Act:** one-line reorder as WO-033's boy-scout item; the structural build-first rule in WO-036                                                     | none needed                                                                                                                           |
| The chain is 23 serial `&&` steps, 6–10 minutes, no per-case reporting; skeleton tests 62 s wall, work-orders shell suite 36 s                                                          | **Act:** WO-036 (runner, concurrency, summary, `node:test` conversion of the Node scripts)                                                          | none needed                                                                                                                           |
| Control-plane scripts import seven skeleton `.mjs` leaves from source and the same library from `dist/` elsewhere (two module identities); an exported launchpad could not emit Beacons | **Act:** WO-033 §Beacon portability (one module identity; the export emits Beacons without the skeleton)                                            | none needed                                                                                                                           |
| Repository root derived from `import.meta.url` in eleven scripts in four styles; `docs/...` roots as literals (29/18/13/6/5/4/3/3 occurrences)                                          | **Act:** WO-033 phase 1 (one configuration root)                                                                                                    | none needed                                                                                                                           |
| `reactor.ts` (2,268 lines): six concerns with existing markers, a 20-case switch, a 154-line `CommandResult` branch, 34 casts re-typing one `JsonValue` state bag                       | **NoOp now.** WO-010 deliberately kept one decider; the mutation campaign and trace oracles pin it; no order in this horizon adds a host branch     | The next order that adds a host branch (source-writing workers, protino) carries the split into typed state slices as its first phase |
| `release.mjs` (1,763 lines, 72 functions, eight concerns)                                                                                                                               | **NoOp now.** WO-033 may extract the pieces its target-order close path needs into `scripts/release/`; a full split waits for the next surface rule | The next release-surface rule after WO-033                                                                                            |
| FNV-1a-64 implemented in kernel and compiler because the compiler depends on nothing                                                                                                    | **NoOp** (already watched since 2026-09-04; both pinned by tests)                                                                                   | A hash-scheme change, or the compiler gaining a kernel dependency for another reason                                                  |
| Git runner copied in eight places, `sha256` inline in eleven, JSONL splitting in twenty files; markdown and TAP parsing in four                                                         | **Partial:** the scripts-side root and JSONL consolidation ride in WO-033 phase 1; the skeleton-side copies wait                                    | A fourth skeleton copy, or a defect fixed in one copy and not another                                                                 |
| `entropy-reducer.ts` (2,133 lines, declarative), `audit.ts` (clean seam at line 838), `compile.ts` (stable, low churn)                                                                  | **NoOp**                                                                                                                                            | A second compiled loadout beyond `feedback.ts`; a second audit consumer                                                               |
| Golden evidence regenerated under the latest order's directory on every compiler version                                                                                                | **Act (docs side):** WO-035's stable receipt homes; the generator paths follow WO-033's roots                                                       | none needed                                                                                                                           |
| Bash suites use bare `assert` with no case names                                                                                                                                        | **NoOp** beyond the runner; convert one suite per order that touches it                                                                             | A suite that fails twice without a nameable case                                                                                      |

## Documentation sweep — findings and dispositions

Link health is clean: 993 relative links and 422 anchors across 225 Markdown
files, zero broken. The sixteen links to `11-proteino.md` are the audience
index's deprecated rows; the stub stays because immutable reports and WO-109
cite the old path in prose.

| Finding                                                                                                                                                                                                                     | Disposition                                                                                                                               | Reversal condition                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| The ledger declares newest-first insertion but 7 of 103 sections were appended below §Resolutions on 2026-09-05/06 while others were prepended the same days; the four newest sections switched to a bold-lead status style | **Act:** WO-035 (one rule, relocation with a migration note, generated index, `--check`)                                                  | none needed                                                           |
| Dated implementation receipts inside specifications: 06 (7 paragraphs + 10 parentheticals), 03 (9 dated lines, 3 migration receipts), 02 (1), the capability table (7 addenda), the map's recommendation section (7)        | **Act:** WO-035 (receipts move to the owning order's evidence README; a check refuses new ones)                                           | none needed                                                           |
| Version-bearing banners nothing checks: 03 says the source prepares `v0.11.0`, 04 says `v0.2.0`; only the README block is checked                                                                                           | **Act:** WO-035 (banners become pointers)                                                                                                 | none needed                                                           |
| Release history by hand in three roadmap layers, 10, and the map; sixteen of twenty-six tags have no roadmap rung; the retiming table still names WO-009 at `v0.5.0`                                                        | **Act:** WO-035 (one generated tag→order table; the roadmap keeps rungs; retiming records preserved as receipt)                           | none needed                                                           |
| Resume phrases in four copies; the README's copy omits `resume: times`                                                                                                                                                      | **Act now:** the README copy is corrected in this pass; WO-035 generates the table from `resume.mjs`                                      | none needed                                                           |
| Cold start: `CLAUDE.md` + guide + order ≈ 996 lines before any citation; WO-011's minimum ≈ 1,340 and realistic ≈ 3,900; the guide is 804 lines, seven times a typical order                                                | **Act:** WO-035 (guide under 450 lines with every rule relocated, not dropped)                                                            | none needed                                                           |
| The capability table shows transports and verification at level 0 after WO-009/WO-010 shipped, with the reassessment only in addenda, and no WO-010 row                                                                     | **Act:** WO-035 (fold addenda into rows; the end-of-order check keeps promotion authority)                                                | none needed                                                           |
| Work-order files grow into logs (WO-006 658 lines, WO-016 661, WO-020 688 with ten to twelve receipt sections each)                                                                                                         | **NoOp.** Work orders are stable addresses and their receipts are review subjects; the evidence README is the newer home for new receipts | A verifier reports that a receipt-grown order obscured its acceptance |
| Per-session ledger files instead of one file                                                                                                                                                                                | **NoOp.** Every order and `CLAUDE.md` cite the single address; the generated index is the cheaper fix                                     | The index proves insufficient for a reader                            |
| Retire the `11-proteino.md` stub and its deprecated index rows                                                                                                                                                              | **NoOp.** Immutable prose citations resolve through it                                                                                    | A generated deprecated-path mechanism replaces the rows               |

## The enterprise workflow decision

The operator proposed: use DotLn to create `DotLn-Enterprise-Starter`, fork
the starter, open Claude and Codex in the fork, and plan the work orders that
produce `DotLn-Angular`, so that a launchpad holds several workstreams across
repositories and the operator does not keep a session open in each. Both
repositories are empty as of this pass. The plan adopts the topology with two
clarifications.

- **What "use DotLn" means today.** DotLn's runtime workers are read-only
  fixture inspectors and JSON-policy repairers; they cannot write a starter.
  What DotLn offers today, and what the operator uses daily, is the
  _process kit_: the control plane, its resume phrases, worktrees,
  checkpoints, independent verification, final review, and release close,
  plus the operating documents. "Use DotLn to create the starter" therefore
  means exporting that kit as a launchpad skeleton (WO-033 phase 3) and
  driving the starter's own first work orders through it. That export is
  also the physical platform/instance split ADR-0006 deferred until "a
  representative implementation shape" existed: the starter is that shape.
- **Topology.** DotLn core stays the platform and remains self-hosted (it is
  its own launchpad). The starter is a template of a launchpad instance,
  exported from core with pinned provenance, never a fork of core. The
  operator's fork or clone of the starter is their launchpad instance; it
  registers target repositories and holds their work orders, control
  segments, verification, and final-review evidence. Target repositories,
  `DotLn-Angular` first, receive only conventional branches and pull requests
  under the workplace-camouflage rule; their DotLn state never lives in their
  trees. Executor, verifier, and reviewer sessions open in a target worktree
  from the launchpad's handoff and resume from the launchpad's control state.
- **Console v0 here, console v1 there.** The roadmap sanctions a zero-asset
  terminal or static-HTML page as prototype zero and defers the framework
  decision to representative evidence. So the first console (WO-032) is a
  read-only showrunner board inside core, a pure projection over the machine
  interfaces that already exist, with no framework and no second state
  machine. The Angular shell becomes console v1 in `DotLn-Angular`, built as
  the pilot workstream's first target change (WO-034), consuming the board's
  view model as JSON. That makes the pilot real — it must drive an actual
  target change — and produces the evidence the framework decision needs.
- **Licensing.** Exporting the kit into the operator's own public
  repositories is not the distribution gate in `docs/LEGAL.md`; offering the
  starter to anyone else is, and the operator clarified that external
  organizations will fork it within about a week. The gate was therefore
  decided inside the pass (below) rather than deferred.

**External organizations fork the starter (operator clarification during
the pass).** The starter is intended as the base several external
organizations fork to begin their own workflows; the operator's fork is the
first test and the first external fork is expected within about a week. The
topology above does not change, but five consequences do:

- The `docs/LEGAL.md` gate was on the critical path with a date, and the
  operator resolved it inside the pass: Apache-2.0 for code, CC BY 4.0 for
  documentation, a DCO for inbound contributions, names reserved, workspaces
  private until a publication decision. The license files land in this
  planning pull request; WO-038 lands the package metadata, the
  publication-refusal check, and `CONTRIBUTING.md`, and it runs in the first
  free lane before the first external fork. WO-033's export copies the
  license files as kit files by default.
- The starter must separate kit from instance. Kit files (scripts, suites,
  `package.json`, the operating contract, guide and playbook copies,
  templates, README) are listed in a manifest with hashes; instance files
  (the real `dotln.config.json`, orders, control segments, evidence,
  workstreams, the instance's product overlay) never are. That separation is
  what lets a fork take upstream updates without touching its own work.
- Updates are mechanical, explicit, and never automatic: core → starter by
  `launchpad export --update` (manifest-driven; refuses to overwrite a kit
  file the instance modified; never touches an instance file), landed in the
  starter as a reviewed change; starter → forks by each fork's ordinary
  upstream merge, landed as a reviewed pull request in that fork.
- Fork immediately after the starter's first exported commit. There is no
  later "ready" shape to wait for: the starter only ever holds the kit and
  templates, and the fork is where a launchpad's real content accumulates.
  A GitHub fork keeps the upstream relation visible; a repository created
  from the starter as a template works the same way with a manually added
  `upstream` remote.
- Each fork's first work order is bounded environment truth for its own
  host, harness, and gateway (WO-001's shape, pre-drafted by the export).
  The roadmap's personal-machine assumption stops holding for external
  forks; their managed hosts, gateways, and approval surfaces make WO-014's
  approval-burden contract and the ledger's preserved managed-host capability
  audit relevant again. Nothing from an external fork enters this
  repository; their instances are theirs.

**The starter and the Angular repository are first-class siblings of core
(operator direction during the pass).** Their status, capabilities, and
progress are tracked here: WO-033 creates a sibling registry
(`docs/siblings/README.md`) with one entry per sibling, export and update
receipts under `docs/evidence/siblings/` that make the starter's kit version
evidence rather than memory, and a capability-table row per sibling; WO-034
adds the Angular consumer's entry and row; WO-032's board renders the
registry. A first imperfect starter is expected: kit improvements reach every
fork through the manifest-driven update and an ordinary upstream merge, and
an update that needs something from an instance prints an instance-actions
note rather than applying it. Fork status is not tracked in core unless a
fork's experience changes core, the starter, or the Angular consumer; then
the lesson enters as a ledger entry or a work order.

**How a session in the fork learns what the Angular repository is for
(operator question during the pass).** The same rule that governs core
governs the fork one level out: the docs are the shared memory, so a fresh
session is primed by files it is told to read, never by the operator
restating the vision. Three files carry it. The fork's operating contract
(the kit's `CLAUDE.md`, exported by WO-033) fixes the cold-start read order:
the fork's execution guide, then the active order, then the order's
workstream document, then the target's repository profile, then only the
upstream sections those two name. The workstream document
(`docs/workstreams/WS-001-console-v1-shell.md`, the founding "first screen")
states the outcome, why it matters to core, the six demonstrations it must
witness, the contract it consumes with its version (the WO-032 board view
model, `boardVersion: 1`, at a named core tag), and the member-order
sequence. The repository profile (`docs/repositories/dotln-angular.md`)
states the three purposes, the standards to emulate, the authority profile,
the commands, and a pinned upstream-references list: `owner/repo@tag
path#anchor` entries into core's product docs (the console paragraphs in 04,
the showrunner role in 13, the console rung in 06, the board's JSON contract
in WO-032) with one line each on why the section matters. Those two files are
written once by the first `planning:` pass the operator dispatches in the
fork, which reads core through the pinned references and synthesizes, and
every later order cites them by section like any order here. The link back
to core is therefore a pin, not a live dependency: the fork's `resume:
status` reports when the referenced core tag has moved, and the kit update
refreshes the kit, never the profile, which the fork's owner re-pins by a
reviewed edit. The reverse link is core's sibling registry, which records the
Angular repository's status and the contract version it consumes. The
operator's per-session job shrinks to the phrase they already use here:
`resume: next`.

The operator's own fork has two lives. As the pilot it drives `DotLn-Angular`,
which the operator gives three purposes: an exemplar of the Angular, Nx, and
NgRx architecture and fundamentals they want emulated, the demonstration that
the starter can build out another repository, and a console for DotLn.
Beyond the pilot the operator intends to use a fork at work against work
repositories. That fork is an instance like any client's: its orders,
evidence, and target material stay in it, nothing flows back to core except
kit updates in the other direction, and the clean-room boundary in
`CLAUDE.md` is unchanged. Target repositories, whoever owns them, receive
only conventional branches and pull requests.

Given the date, WO-033 is the order the external timeline binds. If capacity
is short, run it alone first (the plan's first reversal condition) rather
than pairing it with WO-032.

**What the founding corpus adds.** A targeted lookup of the founding notes
and north-star document during this pass (synthesized here; nothing copied)
recovered three shapes the ledger had flattened, now lowered into the
drafts. First, the original impetus for a launchpad was that rules written
for one repository did not carry to the next, and the operator wanted them
layered by scope: launchpad-wide, a class of repositories such as Angular
UI, and one repository. WO-033's configuration therefore layers launchpad →
repository class → repository profile, with a named authority profile per
repository replacing the hand-overridden "never push or PR" rule. Second,
the founding corpus's first browser screen was one workstream page (contract,
current state, active build, open decisions, running episodes, changed files,
acceptance matrix, evidence, pull-request status, event timeline); WO-032's
order detail renders that list from the sources that exist and labels the
rest unavailable, and it works offline, which the founding notes demanded of
any launchpad dashboard. Third, the preserved constrained-environment
capability audit is the right first order for an external fork on a managed
host, so WO-033's exported first order extends WO-001's shape with its
questions. The coworker promise in the north star, one bounded intent from a
person who never learned the taxonomy, is the v1.0.0 exit criterion; the
external forks are its first honest test.

## Wave plan

Lane rules are the hand rules in
[`concurrent-work-orders-plan.md`](concurrent-work-orders-plan.md#lane-rules-the-showrunner-can-apply-by-hand);
this horizon is their first real trial.

```text
lane 0   WO-038 (license posture lands)   — first free lane; smallest order in the set; before WO-033's export ships
wave 1   WO-032 (showrunner board)        ∥  WO-033 (relocatable control plane, export, sync)
float    WO-036 (evidence runner)         — any free lane, ideally before wave 2
wave 2   WO-035 (documentation reset)     ∥  WO-034 (cross-repository workstream pilot)
wave 3   WO-037 (5S equipment set)        — candidate once WO-032 has merged; pairs with any wave-2 order
```

Serial fallback, if the operator returns to one lane: WO-038 → WO-032 →
WO-033 → WO-035 → WO-034, with WO-036 wherever a quiet window appears. The adjacent
track is unchanged: WO-107 first when an evidence window opens, WO-108's
survivors informing later hardening; WO-014 floats and becomes more likely
once target-repository sessions report approval friction.

Primary write surfaces, to hold rule 2 (no shared surface in one wave):

| Order  | Primary surfaces                                                                                                                    | Shared with its wave partner                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| WO-032 | `packages/console/**`; product 04, 13; capability table row                                                                         | `package.json` (one line), README release block (serial by version), ledger head, map, locks |
| WO-033 | `scripts/**`; the Beacon module move; product 03, 07, 12, 10; playbook; ADR-0006 amendment; LEGAL note                              | same list                                                                                    |
| WO-034 | `scripts/work-orders.mjs`; `packages/console`; `docs/workstreams`; product 12, 04, 13; evidence WO-034                              | `package.json`, README block, ledger head, map, locks                                        |
| WO-035 | ledger structure, `docs/lineage/`, product 02/03/06/10/14, capability table, guide, `scripts/lineage.mjs`, `scripts/docs-check.mjs` | same list; must not touch `work-orders.mjs` or `packages/console`                            |
| WO-036 | `package.json` `test`, `scripts/test-runner.mjs`, `scripts/test-*.mjs`                                                              | `package.json` with everyone                                                                 |
| WO-037 | `packages/compiler`, skeleton loadouts, scenario, reactor; product 02, 04, 05, 06, 10; capability table row                         | README block, ledger head, map, locks; must not edit `packages/console`                      |
| WO-038 | root and workspace `package.json` license and private fields; `check-surfaces` in `release.mjs`; `CONTRIBUTING.md`; README, LEGAL   | `package.json` with everyone (serial), README block, ledger head, map, locks                 |

Conflicts that a paired wave produces by construction, all textual or
regenerable: the README release block and the second order's version (retime
with a dated note), `package.json`, the ledger head (both prepend below the
header), the map's recommendation section (WO-035 stabilizes it), product
status banners (WO-035 removes them), the publication edition locks whenever
both lanes touch an indexed heading (regenerate with `--print-locks`), and
the two generated projections (`current.md`, the index — regenerate, never
hand-merge). Version assignment is serial: the first order to merge takes the
next version of its class above the latest published tag; the second retimes
at its sync step.

Capacity: two implementation lanes; one verifier session at a time; do not
start a third implementation while two orders wait for verification. An empty
lane is a legal outcome.

## Concurrency: what is safe, what is untested, and the procedure

**Structurally safe.** WO-030 gave each order its own append-only control
segment, scoped legality to the named order, made the index and release
readers prove append-only history per segment, and proved with a real-Git
fixture that two orders progress independently, merge serially, close one
while the other stays open, and attribute releases correctly even with a
third branch created before the first merge. Checkpoint refs are per order.
`main` is a single serialized integration point through pull requests.

**Operationally untested.** No paired wave has run; every order after WO-030
was executed serially. The costs the concurrent plan asks to measure
(elapsed per phase, operator interventions, integration repair, time away)
have no observation. Wave 1 is the first, and the order that merges second
records the receipt in this document.

**The procedure for the remaining lane after a sibling merges** (manual
until WO-033 ships `worktree sync`, which automates exactly these steps):

1. In the remaining worktree, confirm the sibling's pull request is merged
   and `origin/main` contains it (`git fetch origin` and
   `git branch -r --contains`).
2. Preserve everything: `git stash push --include-untracked -m 'WO-NNN sync <date>'`
   and record the message; never `pop`, never `drop`; re-find it by message,
   not position (the stash stack is shared across worktrees). Back up ignored
   intake separately if any exists in the worktree.
3. Update the base. A branch with no commits (the normal pre-final-review
   state) fast-forwards: `git merge --ff-only origin/main`. A branch with
   reviewed commits awaiting merge takes a merge from `origin/main`; never a
   rebase, which rewrites reviewed history.
4. Re-apply: `git stash apply`. Resolve conflicts by class: generated
   projections are regenerated (`npm run resume -- next --work-order WO-NNN`
   for `current.md`, `npm run work-orders -- index`, `node scripts/check-publication.mjs --print-locks`
   pasted into both edition lock lines); authored conflicts are resolved by
   the executor; control segments never conflict unless both orders wrote the
   same segment, which the fold refuses.
5. Retime if the order's release target no longer sits above the latest
   published tag: edit the H1 and README block with a dated note per
   06-roadmap.md §Release boundary.
6. Rerun the order's evidence. If the integrated base changed the subject
   substantively, return through `resume: fix` and a fresh numbered
   verification before final review; a passing report on the old base cannot
   certify the combined subject.
7. Record the sync (stash message, base commit before and after, conflicts by
   class, retime if any) in the order's evidence README.

## Declined candidates — the NoOp register

Each entry follows the `NoOpIntent` shape: reason, evidence, and the
condition that would make action useful.

- **A console framework decision (Angular, Nx, Babylon.js) or an ADR for it
  now.** NoOp. The roadmap defers it to representative evidence; WO-034
  produces that evidence; the next pass writes the ADR. Reverse if the
  operator wants the Angular shell before the pilot.
- **Building the Angular console inside core.** NoOp. It would pull a UI
  toolchain into the evidence gate and pre-empt the framework decision; the
  pilot needs a real target repository anyway.
- **Publishing `@dotln/*` packages for the starter.** NoOp. The license is
  decided but publication is a separate gate, and no consumer needs the
  runtime packages; the launchpad is the process kit. Reverse at the first
  package consumer, with WO-038's publication guard lifted deliberately.
- **A `WorkstreamOpened` control event and outcome-level legality.** NoOp.
  The pilot's workstream is a document plus projections; no consumer needs
  legality at the outcome level. Reverse when a second launchpad or a
  contribution track needs an outcome-level transition.
- **A lane generator, admission policy, tenant tracks, contribution tracks.**
  NoOp, unchanged from 2026-09-05; the filing conditions stand and the first
  measured wave is now scheduled.
- **The reactor split, the release helper split, skeleton-side duplication,
  bash-suite rewrites.** NoOp with the reversal conditions in the code table.
- **Activating the pattern workshop inside the first two waves.** NoOp. Its
  compiler-side slice is filed as WO-037 so the horizon shows the
  differentiated product's path, recommended as wave 3 once the board has
  merged; the drag-equip surface is console v1 work in the consumer
  repository. Reverse if the operator wants the shelf before the launchpad.
- **Activating WO-109 (re-mining) now.** NoOp. The founding corpus is
  represented at the entry level; the image harness preflight is still
  unrecorded. Reverse when an image-capable harness is observed and the
  operator wants a new draw.
- **Retiming WO-014 or the corpus drafts.** NoOp; they float with their
  existing preflights.
- **Running the Beacon usefulness comparison inside this pass.** NoOp; it is
  an operator trial, not a planning artifact. The board (WO-032) puts the
  constellation and the status surfaces on one screen, which is the cheapest
  way to make that comparison possible. Reverse: the operator runs the
  comparison after WO-032 and records the receipt.
- **Editing product status banners or capability rows in this pass.** NoOp;
  fixing them by hand repeats the growth pattern WO-035 removes. The one
  exception taken is the README's missing `resume: times` phrase, a factual
  omission on the checked front door.

## Open product decisions for the next pass

- The console framework and repository boundary, decided by ADR with WO-034's
  evidence.
- Pattern workshop v1 as the wave after this horizon: the drag-equip surface,
  the 5S equipment set with compiled set bonuses, and the build inspector.
- Whether the launchpad should own a per-repository release policy, once a
  target has a second reviewed change.
- Package publication (the license is decided; distribution is not), the
  `THIRD_PARTY_NOTICES` inventory at the first bundled artifact, and the
  name-confusion check before brand investment. The employment-agreement
  question about using a fork at work is the operator's own check, recorded
  in `docs/LEGAL.md`.
- Whether general source-writing workers precede or follow the workshop; the
  reactor split is the first phase of whichever order adds them.
- The Beacon usefulness receipt, once the operator has used the board.

## Reversal conditions for the plan

- If the operator prefers the enterprise path over the console, run WO-033
  alone first, then WO-034 ∥ WO-032; nothing else moves.
- If the first paired wave costs more in integration repair than it saves,
  the serial fallback order above applies and WO-033's `worktree sync` still
  lands as a single-lane convenience.
- If WO-033 proves too large in execution, split phases 3 and 4 into a
  follow-on order before activation, recorded in the map; the pilot (WO-034)
  then depends on that follow-on.
