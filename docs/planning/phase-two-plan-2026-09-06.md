# Phase two — the 2026-09-06 planning pass

**Planning result:** 2026-09-06, the planning pass after the `v0.13.1` close,
opened by the operator as the largest planning session to date, on the clean
`main` checkout between work orders with Beware of Naive Interventionism and
Do Nothing equipped. It answers four operator questions — a whole-repository
sweep with a six-month projection, two product fronts at once (the enterprise
workflow and a console), whether progress still tracks the vision and the
founding corpus, and whether concurrent work orders are safe — and files five
planner-synthesized drafts: [WO-032](../work-orders/WO-032-uifa-actor-board.md),
[WO-033](../work-orders/WO-033-compiled-starter-export.md),
[WO-034](../work-orders/WO-034-cross-repository-workstream-pilot.md),
[WO-035](../work-orders/WO-035-documentation-structure-reset.md),
[WO-036](../work-orders/WO-036-evidence-runner.md), and, as the wave-3
candidate that keeps the differentiated product's path visible,
[WO-037](../work-orders/WO-037-five-s-equipment-set.md); the same-day
redirect rescoped the first three and filed
[WO-039](../work-orders/WO-039-harness-lowering.md),
[WO-040](../work-orders/WO-040-rule-migration-batch-one.md), and
[WO-041](../work-orders/WO-041-plan-refutation-mechanism.md). It grants no
activation authority and changes no immutable evidence. The
[marked sequence](work-order-map.md#recommendation-and-rationale) is the
editable recommendation; this plan explains it. The verbatim dispatch is
preserved locally in `docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`
(SHA-256 `e8ccc4e788ca0ce66612a12cdd8919d7f4dee5e9303b799460e18dc1c087b287`).

**Revised the same day.** The operator read the first version and corrected
its direction; the correction and the redirected horizon are in
[§The redirect](#the-redirect--second-pass-of-2026-09-06) below, and the
sections it supersedes are marked in place. The first version is retained in
Git history at commit `1611860` and `dcf4b2d`; the ledger's redirect section
records what was superseded and why, append-only. The sweep findings, the
six-month projection, the concurrency procedure, and most of the NoOp
register stand unchanged.

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

**Disposition (superseded by the redirect below; retained as record).**
The first version read the accepted build order's next rung, "projections &
console", and turned the horizon toward a board over control state and a
process-kit export. The operator's correction showed why that was wrong even
though every sentence above is right: the review named the blueprint-to-code
gap and then filed more of the machinery that had produced it, because the
review was written by the planner about its own plan and no blinded refuter
read it. The redirect below keeps every measurement in this section and
changes what is done about them.

## The redirect — second pass of 2026-09-06

The operator's correction, in one sentence: the work-order state machine is
the smallest part of the vision, and the whole idea is that the predecessor's
roughly 140 hand-crafted rules become skills or hooks or the platform itself,
a user interface for actors. The first version of this plan built none of
that. Its five new orders were a board over control state, an export of the
control-plane scripts, a workstream pilot whose first Angular change rendered
that board's JSON, a documentation reset, and a test runner; the one order
that touched the differentiated product was placed last as a candidate.

**How it drifted, by mechanism.** Three substitutions, each locally
reasonable, compounded.

- "Launchpad" was read as the control-plane scripts. In the founding corpus
  the launchpad is the whole compiled system: rules lowered to mechanisms,
  the kernel, the loadouts, the actor view. Once the word meant the scripts,
  "use DotLn to create the starter" collapsed into "copy the scripts", which
  was also the only thing that could ship before the first external fork.
- "Console v0" was read as the roadmap's showrunner status view. The
  interfaces doc defines the target interface as work organized around
  actors with their roles, loadouts, state, and evidence. A board of orders
  and phases has no actor in it.
- "Feedback compiler v1 shipped" was read as the rule thesis being on track.
  Ten shapes are compiled and they are hard only inside the audit demo host;
  no session the operator opens is governed by them. The sessions run on
  `CLAUDE.md`, an 804-line guide, and the playbook, which is rung 9 of the
  repository's own mechanism hierarchy, and the remaining shapes were on no
  rung of the roadmap. The predecessor's startup-context failure was being
  re-created in a different shape, and the six-month projection below said
  so without drawing the conclusion.

The plan's own vision-alignment review was written by the planner about its
own plan; the two delegated sweeps checked code and documentation structure,
not direction; "equipped Beware of Naive Interventionism and Do Nothing"
meant the session had read those sections. The operator had to be the
refuter, which is the supervision the mission exists to remove.

**What the redirect changes.** Five moves, each an order.

1. **A saved build must govern the sessions that run** (WO-039). A pure
   compiler target lowers a loadout, its units, and its envelope into what a
   harness enforces: settings permissions and hooks at rung 2, on-demand role
   skills at rung 7, and a marked instruction block at rung 8 holding only
   the residue with a byte count. This repository defines its own session
   build, the Contributor, emits its configuration from the compiler, commits
   it, and refuses drift in the evidence gate. Core eats its product, not
   only its process.
2. **The starter ships an actor** (WO-033, rescoped). The export carries the
   Contributor build as an enforceable bundle plus the pinned runtime build
   the bundle needs; a fork runs its sessions on a compiled actor from its
   first commit and composes its own overlay (registered repositories,
   classes, extra units) over the kit's build. A target worktree gets the
   bundle in ignored local state, so the target never sees a DotLn file in a
   commit. Kit updates reach forks as an upstream merge plus a re-emit: the
   operator's chain, progress in core makes the starter better which makes
   every fork and target better, made mechanical.
3. **The rule migration has a rung** (WO-040). A generated migration ledger
   classifies every shape the operator has named; batch one compiles at
   least twelve through the harness target into the Contributor build and
   reports the number the vision cares about: shapes governing live sessions
   by mechanism versus prose. Later batches are cut from its template.
4. **Console v0 is UIFA v0** (WO-032, rescoped). A read-only actor board over
   the documented machine interfaces with five panels, Actors, Builds,
   Mechanisms, Work, and Blueprint, each naming the role it serves. The first
   version's showrunner board is the Work panel in full. Its versioned JSON
   view model is what the Angular shell renders in the pilot (WO-034,
   rescoped), so the pilot proves that a compiled actor drove the target
   change, and the fork's hook logs report which units fired there.
5. **Plans get a blinded refuter as a mechanism** (WO-041). A compiled
   read-only episode over the marked sequence and the vision returns, for
   every order, whether it advances a thesis, is machinery, or drifts, and a
   hold blocks the planning pull request until answered. Not a resume phrase
   the operator must remember; a check in `npm test`.

The documentation reset, the evidence runner, the license order, and the 5S
set keep their scope; the 5S set moves from a candidate to wave 4 beside the
migration's second batch. The first receipt of the refuter mechanism is the
manual blinded run recorded in
[`refutations/2026-09-06-phase-two-redirect.md`](refutations/2026-09-06-phase-two-redirect.md);
WO-041 mechanizes that shape.

**Where the operator stands in the five roles after this horizon.** The
showrunner keeps the screen (the Work panel), the engineer composes the
Contributor build and sees it lowered into the harness (WO-039, WO-040) and
compiles the first shelf entry (WO-037), the tester has the plan refuter and
the batch fixtures (WO-041, WO-040), devops exports a starter that carries a
build (WO-033), and the product lead reads the Blueprint panel. A fork's
users get the same five surfaces because the fork runs the same build.

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

## The enterprise workflow decision (redirected)

The operator proposed: use DotLn to create `DotLn-Enterprise-Starter`, fork
the starter, open Claude and Codex in the fork, and plan the work orders that
produce `DotLn-Angular`, so that a launchpad holds several workstreams across
repositories and the operator does not keep a session open in each. Both
repositories were empty at the time of this pass. The first version of this
plan adopted the topology and exported the process kit; the redirect keeps
the topology and changes what the export contains.

- **What "use DotLn" means now.** DotLn's runtime workers are read-only
  fixture inspectors and JSON-policy repairers; they cannot write a starter.
  What DotLn can export, once WO-039 lands, is a **build**: the Contributor
  loadout lowered into settings permissions, hooks, role skills, and a marked
  instruction block, plus the pinned runtime build those hooks import, plus
  the control plane and its operating documents. "Use DotLn to create the
  starter" means `launchpad export` emits that build into the starter and
  the starter's own first orders run under it. The first version's
  process-kit export is the same command with no actor in it; it is
  declined.
- **Topology.** DotLn core stays the platform and remains self-hosted (it is
  its own launchpad and, after WO-039, runs on its own compiled build). The
  starter is a template of a launchpad instance, exported from core with
  pinned provenance, never a fork of core. The operator's fork or clone of
  the starter is their launchpad instance; it registers target repositories,
  composes its own build overlay over the kit's Contributor build, and holds
  their work orders, control segments, verification, and final-review
  evidence. Target repositories, `DotLn-Angular` first, receive only
  conventional branches and pull requests under the workplace-camouflage
  rule; a target worktree carries the emitted bundle in ignored local state
  that leaves with the worktree. Executor, verifier, and reviewer sessions
  open in a target worktree from the launchpad's handoff, under that bundle,
  and resume from the launchpad's control state.
- **Console v0 here, console v1 there.** Console v0 is the actor board
  (WO-032): a read-only projection over the machine interfaces that already
  exist, with Actors, Builds, Mechanisms, Work, and Blueprint panels, no
  framework, no second state machine, and a versioned JSON view model. The
  Angular shell becomes console v1 in `DotLn-Angular`, built as the pilot
  workstream's first target change (WO-034), rendering that view model.
  That makes the pilot real twice over: the workflow must drive an actual
  target change, and the change must be an actor view, not a phase table.
  The framework decision follows that evidence.
- **Licensing.** Unchanged from the first version: exporting the kit into
  the operator's own public repositories is not the distribution gate in
  `docs/LEGAL.md`; offering the starter to anyone else is, and the operator
  resolved it inside the first pass. The runtime build travels under the
  same terms with the NOTICE.

**External organizations fork the starter (operator clarification during
the first pass).** The starter is intended as the base several external
organizations fork to begin their own workflows; the operator's fork is the
first test and the first external fork is expected within about a week. The
consequences recorded in the first version stand, with one addition:

- The license gate was on the critical path with a date, and the operator
  resolved it: Apache-2.0 for code, CC BY 4.0 for documentation, a DCO for
  inbound contributions, names reserved, workspaces private until a
  publication decision. The license files landed in this planning pull
  request; WO-038 lands the package metadata, the publication-refusal check,
  and `CONTRIBUTING.md`, and it runs in lane 0.
- The starter separates kit, instance, and the instance's build overlay.
  Kit files (scripts, suites, `package.json`, the operating contract's
  marked block and floor, guide and playbook copies, templates, README, the
  harness bundle, the runtime build, the license files) are listed in a
  manifest with hashes; instance files (the real `dotln.config.json`,
  orders, control segments, evidence, workstreams, refutations, the
  instance's product overlay, and `build/overlay.json`) never are. That
  separation is what lets a fork take upstream updates without touching its
  own work, and the overlay is what makes the fork's `.claude/` its own
  build rather than core's.
- Updates are mechanical, explicit, and never automatic: core → starter by
  `launchpad export --update` (manifest-driven; refuses to overwrite a kit
  file the instance modified; never touches an instance or overlay file;
  prints the re-emit instruction), landed in the starter as a reviewed
  change; starter → forks by each fork's ordinary upstream merge followed by
  a re-emit, landed as a reviewed pull request in that fork. A compiled unit
  added in core reaches every fork's sessions by that path.
- Each fork's first order is bounded environment truth for its own host,
  harness, and gateway, extended with the harness smoke, so the fork
  observes its own profile before it trusts its build.
- The operator's own work-time fork is an instance like any other: its
  content never flows back to core. Core tracks the starter and the Angular
  consumer as siblings with export receipts; it does not track forks unless
  a fork's experience changes core, the starter, or the consumer.

**Critical path for the fork.** WO-038, then WO-039 phase 1 and its
self-host, then WO-033. If capacity is short, run those three alone and let
the rest float. WO-039 is the order the timeline binds now, not WO-033; its
phase structure exists so that the minimum (the ten units lowered, the
Contributor build, `harness check`) can ship before the skills and the Codex
profile.

## Wave plan

Each lane is one worktree and one writer. Pairs share no primary write
surface; the conflicts a pair produces by construction (README release
block, `package.json`, the ledger head, the map's recommendation section,
edition locks, generated projections, and now the generated harness
configuration) are handled by the sync procedure below, not by scoping.

```text
lane 0   WO-038 (license posture lands)     ∥  WO-041 (plan refutation mechanism)
wave 1   WO-039 (harness lowering)          ∥  WO-032 (UIFA v0 actor board)
float    WO-036 (evidence runner)
wave 2   WO-033 (compiled starter export)   ∥  WO-040 (rule migration, batch one)
wave 3   WO-034 (cross-repository pilot)    ∥  WO-035 (documentation reset)
wave 4   WO-037 (5S equipment set)          ∥  migration batch two (cut from WO-040's template)
```

Serial fallback, fork-binding path first: WO-038 → WO-039 → WO-033 →
WO-041 → WO-032 → WO-040 → WO-036 → WO-034 → WO-035 → WO-037.

Why this order and not the first version's:

- **Lane 0 is two small orders that gate the outside.** WO-038 must land
  before the first external fork; WO-041 must land before the next planning
  pass. They share no surface and are the first measured paired wave, which
  makes the first measurement cheap.
- **Wave 1 is the product.** WO-039 turns the compiled units into the
  configuration the operator's sessions actually run under and makes core
  run on its own build; WO-032 gives the five roles their first shared
  screen. They are disjoint (compiler and skeleton loadouts and `scripts/`
  versus `packages/console`). WO-039 is on the fork's critical path and
  starts first.
- **Wave 2 is the export and the migration.** WO-033 needs WO-039's bundle
  and WO-038's license metadata; WO-040 needs WO-039's target. They are
  disjoint (`scripts/` and the export versus the compiler's feedback module
  and the skeleton's loadouts). WO-033 is the fork's last binding order.
- **Wave 3 is the pilot and the reset.** WO-034 needs WO-033 and WO-032;
  WO-035 needs WO-033's configuration root. They are disjoint by
  construction (WO-035 must not edit the index generator or the console).
- **Wave 4 is the shelf and the second batch.** WO-037 needs WO-032 to
  render the set; batch two is cut from WO-040's template once batch one's
  measurement exists. WO-036 floats into any quiet window, ideally before
  wave 2 registers new suites.

Version assignment stays serial: the first order in a wave to merge takes
the next version above the latest published tag; the second retimes at its
sync step with a dated note. The order that merges second in each wave
records the wave receipt here (elapsed per phase from `status`, operator
interventions, integration repair, time away), per the concurrent plan's
trial section.

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

Added by the redirect:

- **Exporting the process kit without a build.** NoOp, and the first
  version's central error. A fork would run on prose. Reverse never; a
  starter without an actor is not a DotLn instance.
- **Hand-writing hooks and skills for the ten units.** NoOp. A second
  behavior system the compiler cannot see is the exact failure the vision
  names; hooks are compiler output (WO-039). Reverse never.
- **A rung-9 prose unit for a shape that resists lowering.** NoOp. Such a
  shape is a `reference` or a finding in the migration ledger, not a unit.
  Reverse if the mechanism hierarchy gains a rung between 7 and 9 with
  evidence.
- **A numeric alignment score for plans.** NoOp. A verdict naming a thesis
  and a capability row is inspectable; a number is not (WO-041). Reverse if
  a consumer needs to rank plans rather than gate them.
- **Publishing `@dotln/*` packages so the starter's hooks can import them.**
  NoOp, still. The pinned runtime build in the export is reviewable compiled
  output under the decided license; publication waits for its own decision
  and a package consumer.
- **Migrating every remaining shape in one order.** NoOp; the founding
  north star's own anti-goal. Batches of about twelve, cut from a template.

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
