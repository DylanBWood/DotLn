# The three-repository route, 2026-10-11

## 1. Subject, authority and provenance

The operator opened `planning: the three-repository route: core, the
starter, my instance and the Angular target` on 2026-10-11 UTC, a standard
pass with an `ideation:` paragraph, four corrections to the record, eleven
lettered items (a) to (k), a sequence paragraph and one trailing update on
how the Angular ideation in core should reach the instance. The dispatch is
captured verbatim in ignored intake
(`docs/intake/notes/planning-three-repository-route-2026-10-11.md`, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`). The
operator pointed the pass at the conversation-only session that prepared the
dispatch (17:26Z to 18:05Z the same day, fourteen operator messages); its
operator and assistant text is captured in ignored intake
(`docs/intake/chats/2026-10-11-three-repository-route-conversation.md`,
SHA-256 `f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`).
Both captures are sibling records, never sources to mine. This document is
planner synthesis of public repository evidence and of those two captures;
the clean-room screen replaced the one vendor name the conversation holds
with the generic term and found no other suspect material.

Entry was clean `main` at `82b7fdb7`, with WO-078 (v0.74.3) and WO-191
(v0.74.2) closed since receipt 043, no active order and no event since the
WO-078 release close at 19:04Z. The pass runs on
`planning/2026-10-11-three-repository-route`, created by `plan start`. Only
the parent writes this planning checkout; the fan-out plan is one background
`dotln-worker` (the planning refuter) against the cap of 20, with no
descendants. The pass prepares documents and local commits; implementation,
activation and publication keep their separate dispatches.

Aim, as read: file the route the operator laid out, in dependency order,
with every lettered item either done, filed or stopped at the evidence that
contradicts it. The operator asked for questions and three were put, each
with the planner's reading recommended and accepted: the kit's client README
text rides in WO-201 because a planning branch cannot write a kit template;
item (e) is declined for WO-118 with reasons; the three WO-112 boundaries go
after WO-082 as the listing reads. Traps named before the material choices:
filing a kit change as a planning write (the hook refuses it and product 07
routes it to an order); treating "stop at that item" as a reason to skip the
item (the evidence is recorded and the text is carried where it can land);
amending a judged order after this pass's receipt (every amendment precedes
the refutation); and reading correction 1 as an instruction to rewrite the
2026-10-07 record (the error is named and corrected on the live surfaces,
and the receipts keep their bytes). The NoOp at entry would have left WO-083
behind twenty unrelated orders on a reason the record does not support, the
instance without gates or planning, and the operator's five answers from the
conversation unrecorded.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 043
(`2026-10-11-planning-459906ce68143107-043`, 01:47:46Z): 2 failed
verifications (WO-078 VER-001 and VER-002), 0 failed final reviews, 2
repairs, 2 orders made ready, 1 failed first verification, 0 corrections, 0
off-ramps, 0 amendments. The record totals stand at 134 failed
verifications, 16 failed final reviews, 153 repairs, 166 orders made ready,
177 corrections, 6 off-ramps and 48 amendments. The two measured final
reviews of the window (WO-078, WO-191) recorded 0 escapes; the last ten
reviews over ten orders recorded 12. Local records: 2 release closes
(WO-078, WO-191); 0 host denials; 2 local gate failure rows (WO-078); 22
interventions, 19 unclassified, all prompt-hook rows, two of them this
session's own dispatch rows; 2 long phases (WO-191, above twice the phase
median); 1 repeated gate run at a green identity (WO-191); the eight recent
closes split four delivery and four machinery. One shell diagnostic was
counted, this session's own: an unquoted `=` word in a chained read, which
zsh read as a program.

WO-078's two failed verifications are the window's cause to route. VER-001
F1 (the registry's expected versions came from the page it checked) is
repaired by WO-078 D010 (tag observations in their own file) and settled in
§10; VER-002's repair closed the order. Neither names a planning defect; the
rows WO-078 and WO-191 boarded are read and disposed in §10.

The reader profile is unchanged with two unscored releases; no reader run
is due, and none was made.

## 3. Reopening observations

`plan conditions` at 19:18Z (31.5 s):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 2.912 s | 8 s | no |
| Release table lag | 2 tags (v0.74.2, v0.74.3) | 3 tags | no; the table is refreshed in this pass |
| Latest two closed orders, distinct evidence blob bytes | 388,519 and 139,508 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 27,651,802 bytes | 10 MB | yes |
| collectSources | 0.780 s | 3 s | no |
| Uncached release listing | 3.246 s | 10 s | no |
| status --all --json | 5,531,093 bytes | 32 MB | no |
| Work-order index | 1.774 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 294.876 s | 360 s | no |
| gate-task vertical / skeleton / harness-fixtures | 722.5 / 247.5 / 221.9 s | 1,130.8 / 434.8 / 392.1 s | no |
| gate-task worktree-integration | 176.377 s against a 134.324 s median | 201.486 s | no |
| gate-task launchpad | 123.776 s against a 49.691 s median (25 samples) | 74.537 s | yes |
| coldStartBytes.executor | 28,112 | 24,576 (WO-150-D003) | yes; the ceiling is 29,246 |

**Two conditions hold as before.** The week's evidence growth is 27.65 MB,
0.53 MB above the 2026-10-11 standard pass's reading, from the two closes;
the executor cold start is unchanged at 28,112 under its 29,246 ceiling, the
operator's reserved efficiency pass (FUP-f1c7a256bec46737 stays open).
Neither is re-disposed: the readings are the earlier passes' with two closes
added, and the sharpened growth condition is not met.

**One condition fires anew.** The `launchpad` gate task read 123.8 s against
a 49.7 s thirty-day median after WO-078 added the export-receipt and update
cases to `scripts/test-launchpad.mjs`, each of which exports a kit (a source
build and an emit). This pass files three orders that add export fixtures
(WO-201, WO-203, WO-207), so the growth is given a watch, not an order:
WO-201 reuses one export for its three gate runs and records the task's
duration, and the register row (FUP-b531e850b70f6d4e) is allocated to it
(§10). The slow probe was not run: the 2026-10-11 standard pass recorded
that it cannot measure a document gate inside its wall budget (its candidate
2), and this pass's own document gate is recorded in §12 instead.

**Order-lifecycle triggers.** WO-078 and WO-191 closed since receipt 043. No
deferred row's reopening condition opens with either close; the six rows
their closes boarded are untriaged and disposed in §10. The three WO-112
boundary rows name "the pass that places WO-083 within the next pair" as a
trigger; this pass does not do that, and the operator's direction (c) fires
them regardless. FUP-0126, the workstream application candidate, returned to
review because this pass rewrote its source section in product 12; it is
re-recorded at the new revision (§10).

## 4. The corrections to the record

**Correction 1, checked.** The 2026-10-07 capture
(`docs/intake/notes/2026-10-07-machinery-reset-planning.md`, SHA-256
`e181640347ef46d8e1a66bbb3f9e2d9fbd9ed18feb7b9278c082a931cbedfa14`) holds
the dispatch and three mid-turn messages; none mentions the operator's fork, a
machine or an install. The machinery-reset pass wrote into WO-083's execution
plan that "the operator said on 2026-10-07 that DotLn and the starter may not
reach that machine soon", repeated the reason in WO-083's non-goals, the
sequence prose and the WO-083 catalog row, and moved the order from its own
recommended placement (directly after WO-082) to the end of the sequence
behind twenty unrelated orders. The attribution was the planner's, and the
constraint it describes is the work instance's (product 12's constrained
managed host; WO-192 to WO-194). The error is named in WO-083's Known issues
and the map's recommendation paragraph; the reason is struck from WO-083's
step 1 and non-goals, the sequence prose and the row's live notes (the
receipt 042 sentence that quoted it now says the reason was struck); the
receipts keep their bytes. WO-083 returns to its recommended placement after
WO-082, with WO-192 directly before it (item (k)).

**Correction 2, applied.** WO-083's step 2 ("an intent, not a planning-cut
order") and its non-goal excluding hand-opened sessions are withdrawn; the
order now states that the instance's planning pass cuts the bounded Angular
order, that intents are an additional entry point and never required, and
that the run is driven the way core drives orders at the time (the router
when WO-192 has landed, otherwise the resume phrases in hand-opened
sessions), either counting as the route. Product 12 §One workstream across
repositories states machinery parity in the terms the operator used; WO-202
makes it observed inside an export.

**Correction 3, applied.** WO-083 is directly after WO-082 and WO-192; its
measured run is one bounded Angular order, not the repository's first change;
the baseline block is filed by the planning pass that moves WO-083 into the
next pair, the operator supplies the records then, and an unsupplied value
stays unknown. The operator's trailing update (help with the foundational
Angular orders; monitoring between or within orders) is recorded as the
instance's own planning passes' subject: core files no target-application
order, and the candidate in §8 names the three routes for seeding that pass.

**Correction 4, applied.** Product 03 §Platform and instance boundary and
product 12 state that core's control records, orders, evidence and reports
are core's instance files and never enter the kit; the kit's file set
(`KIT_FILES` in `scripts/launchpad.mjs`: the `scripts` and `packages/beacons`
trees, the compiled runtime, the license files and four documents) already
draws that line, so the correction changes the record, not the code.

**Item (e), declined with the operator's agreement.** WO-118's hard edges on
WO-120 and WO-123 prove the intent-admitted, derived order, which is the
product exit on the critical path; nothing carries a planning-cut order
through the resident until WO-192's router, which the operator placed after
WO-118; WO-202 proves the planning commands in a fixture export before
WO-118; and WO-083 proves planning-cut orders driven from the operator's
instance. The decline, its evidence and its reopening condition are in
WO-118's Known issues; receipt 043's known issues on WO-118 (the closed list
of human events; the waiver's reach) are answered in its criterion 1.

## 5. The orders filed

Each order carries the operator's direction as its provenance with the
capture's hash, a dated gap at `82b7fdb7`, an execution plan naming files
and functions, a final criterion naming both gates, and its carry-ins by
register id.

| Order | Item | What it delivers | Placement and dependencies |
| --- | --- | --- | --- |
| WO-201 | (a) | the three gate selections run inside a kit: `kit-verify` (a new `launchpad verify` form) in place of the build, the compiled tests carried, core-only suites declared `kit: "core-only: <reason>"` and listed, the client README rewritten from the fixture's observed lists and carrying the operator's sentences of items (i) and the ideation | alone after the WO-076/WO-200 pair; WO-075, WO-077, WO-078 closed |
| WO-202 | (b) | every planning and release-close command observed on a fixture export at the base, then seeded or made optional: the register, ceilings, budgets and ledger seeds; `publication:check` and the reader check without core's editions and tags; a fixture refutation filed by `plan receipt`; a `fake` entropy review; the README's planning section | alone after WO-201 (hard: the document gate in a kit) |
| WO-203 | (d) preview | `export --update <dir> --preview` prints the plan and instance actions and writes nothing, through the renderer the update uses; `preview --from <ref>` inside an instance shows what a starter merge will change, conflict on and collide with | alone after WO-202, before WO-118 (§6) |
| WO-204 | (c) | source-writer command revocation under partial and persistent cleanup failures (WO-112 D043): independent absence-tolerant removals, a recorded cleanup outcome, a surviving grant that keeps refusing, evidence recorded before cleanup is judged, the fault matrix for both writer accesses | the machinery lane beside WO-080 |
| WO-205 | (c) | writer-resistant Git interpretation (WO-112 D044): the worktree judged against the committed tree before after-tests, index flags refused, the verification worktree's reads under the host's argument set, proven against planted flags, replace refs, commit graphs and hooks | the machinery lane beside WO-082 |
| WO-206 | (c) | source-writer object-store protection (WO-112 D033): a private object store per episode with the shared store as a read-only alternate, writer access without the shared objects directory, a host-owned import after admission, crash recovery and gc/repack concurrency, the retained counterexample run as a case; the comparison D033 asked for recorded | alone before WO-192 and WO-083 |
| WO-207 | (d) rollback | an instance-owned update log and retained copies written by the update; `rollback` from core or inside the instance restores the prior kit state, reverses reversible instance actions and names the rest; refusals after later edits | first of the tail after WO-083 (hard: WO-203) |
| WO-208 | (g) | an `extensions` configuration section (a root outside every kit tree, adapters by kind), a loader recording `ExtensionLoaded`, a `source` selector on vertical issues bound through the SourceAdapter port, effect and projection kinds admitted and listed, a fixture adapter as the first consumer; the enterprise-tracker adapter stays in the work instance | after WO-207 (hard: WO-076) |
| WO-209 | (h) | the kit manifest names its build (the compiled definition modules the emit lowers from); an update takes `both`, `machinery` (build pinned, the pin recorded, emit and check honor it) or `build`; a compiler-contract guard; `build --pin` and `build --take` on the merge path; the overlay composes over the pinned build | after WO-208 (hard: WO-076, WO-203) |

Three design choices the operator left to the planner, with the evidence:

- **(a) carries the compiled tests rather than a kit-only subset.** `RUNTIME_OUTPUT`
  is `dist/src`, so the kit holds none of the compiled tests
  (`nodeTests` rows at lines 734 and 773 of the runner); core's suites in a
  fork means carrying `dist/test`, under the same terms as the compiled
  runtime. Suites that read core-only documents or history are declared and
  listed, never emulated. `kit-verify` judges only the compiled runtime by
  refusal and reports other manifest mismatches in one advisory line, so an
  instance on the true-fork path still gets its gates.
- **(h) is a pinned build, not a definition pack.** The emit lowers the
  loadout from `packages/skeleton/dist/src/loadouts/contributor.js` and
  `feedback.js` (`scripts/lib/harness.mjs` lines 36 and 37); the loadout is
  code, and turning it into data is the rule migration's subject (WO-097,
  WO-098) and product 10's. The pinned build partitions the manifest, keeps
  the two modules at their pinned bytes under `machinery`, and lowers from
  them with the current compiler behind a major-version guard; the hooks'
  runtime stays machinery because it is the engine, not the definitions. The
  definition pack is a candidate (§8). "Both" stays the default, as the
  operator set for the personal instance.
- **(c) is three orders, placed after WO-082.** D043 and D044 are bounded
  repairs on disjoint files and pair as machinery lanes beside WO-080 and
  WO-082; D033 changes the writer's object authority and runs alone before
  WO-192. The operator confirmed the placement over the alternative (all
  three before WO-118, which delays the product exit by three orders); the
  scratch-target risk the 2026-10-11 standard pass accepted for WO-118
  stands, and WO-083's preflight now names the three as closed orders.

Amendments of this pass, beyond WO-083 (§4): WO-118 (item (e) declined;
receipt 043's known issues answered in criterion 1; provenance), WO-192
(item (k): target orders in scope, each phase's worker in the target
worktree under WO-049's bundle launched from the instance, WO-072 a hard
edge, the probe's target-worktree row, the live drive a target order, placed
directly before WO-083). The sibling declaration carries DotLn-Angular's
three purposes and the starter's posture (item (f)), regenerated through
WO-078's generator with its check passing.

## 6. The sequence and the point at which the instance becomes usable

The sequence retires WO-078 and WO-191 and runs the route in dependency
order: WO-072; WO-076 with WO-200; WO-201; WO-202; WO-203; WO-118; WO-080
with WO-204; WO-082 with WO-205; then the tail one at a time: WO-206, WO-192,
WO-083, WO-207, WO-208, WO-209, WO-081, WO-193, WO-194, WO-183, WO-113, the
migration and workshop orders in their former order, WO-089, WO-088, WO-014.
`npm run work-orders -- index --check` passes on the list (no blocking edge
inside a pair; serial order inside the tail).

**The instance becomes usable for the operator's own planning and orders
after WO-203.** The operator's reading was after WO-072, WO-076, (a) and
(b). The pass adds (d)'s preview to that point for one reason: the operator
asked that the preview land before the first update taken into a real
instance, and WO-118's release close is the first core change after the
instance exists. Nothing else was found that must come first: WO-073 (the
class and profile convention) and WO-071 (registration) are closed; WO-072
gives target worktrees; WO-076 the overlay; WO-201 and WO-202 the gates and
the planning pass in a kit. At that point the operator exports, pushes, forks
and opens the instance's first planning pass.

## 7. The kit's client README sentences, drafted here and carried by WO-201

The operator directed two write-backs to `scripts/kit/README.client.md`: the
ideation's (where the instance's orders live; its first planning pass is its
own) and item (i) (editing a kit file is choosing the true-fork path, with
what the update does from then on). Evidence against writing them in this
pass: on a `planning/` branch the hooks refuse repository writes outside
`docs/` and root Markdown (WO-135; the Clean Room floor's refusal list), and
the README is a manifest-listed kit template under `scripts/kit/`, so an
edit changes kit bytes, which product 07 routes to a work order ("a code or
configuration change it identifies becomes a work order"). The operator chose
the route in the pass: WO-201, the first kit-editing order, lands the text as
its criterion 5. The text:

> **Your orders live here.** `docs/work-orders/` holds the orders this
> instance cuts, `docs/evidence/`, `docs/verifications/` and
> `docs/final-reviews/` their records, and `docs/planning/` the passes that
> cut them. The first planning pass is this instance's own: `npm run plan --
> start <slug>` cuts its orders from its own sequence; the pre-drafted WO-001
> is the only order the kit seeds, and no order of core's ever arrives in an
> update.

> **Editing a kit file is choosing the true-fork path.** From then on every
> update lists that file as refused and keeps its prior manifest hash;
> nothing merges core's change into it; `launchpad verify` reports it as
> differing from the manifest while the gates run on your bytes; and the
> update preview shows it as a conflict before each update. To return,
> restore the file to the manifest's bytes before the next update, or keep
> the fork and take nothing more for that file. Instance files are never
> refused: they are yours.

The third README change, §What runs here, is written by WO-201 from the
fixture's observed lists, which this pass cannot draft.

## 8. Decisions and NoOp records

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| Amending WO-118 so the scratch instance cuts its order through its own planning pass (item (e)) | WO-118's hard edges (WO-120, WO-123) prove the derived order; the resident has no route for a planning-cut order until WO-192; WO-202 proves planning in a fixture export and WO-083 proves planning-cut orders from the instance. Evidence: WO-118's Depends on and Objective; WO-192's Objective; the operator's answer in this pass. | The instance's first planning pass; WO-192's close. | The operator asks again, WO-192 lands before WO-118 activates, or the resident gains the route (FUP-7787c6f1867375f8). |
| Writing the client README in this pass | The planning-branch refusal and product 07's route (§7). Evidence: the Clean Room floor's refusal list; the kit's manifest. | At WO-201's close. | The operator overrides for one file, or the README leaves the kit's manifest. |
| An order for seeding the instance's first Angular planning pass from core's ideation | The operator named three routes and leans to a conversation-only prompt, which files nothing; core never files a target-application order. Evidence: the trailing paragraph of the dispatch; the 2026-09-08 correction in the map. | The instance's first planning pass. | The operator asks for a seed there, or a WO-193 request asks core (FUP-82c6c63771a87233). |
| Core-to-starter update automation | Hand-run updates after each release close, recorded by WO-078's receipts (answer 5). Evidence: the conversation capture. | Every planning entry from the receipts. | The operator asks, or three hand-run updates are recorded (FUP-efcc590126413a41). |
| The Contributor loadout as a definition pack (the alternative to WO-209) | The loadout is code lowered by the compiler; data definitions are the rule migration's and product 10's subject. Evidence: `scripts/lib/harness.mjs` lines 36 to 37; product 03 §Package ecosystem. | WO-097 and WO-098's closes. | The definitions compile from data, or a second owner needs a build core does not ship (FUP-d2897b117391bb26). |
| An order for the `launchpad` gate task's growth | One fired row after two export cases; three orders of this pass add export fixtures, and WO-201 carries the watch. Evidence: §3; `scripts/test-launchpad.mjs` lines 1535 and 1726. | Each handoff of WO-201, WO-203 and WO-207. | The task exceeds twice its median after WO-201, or the suite is the gate's critical path (FUP-b531e850b70f6d4e). |
| Re-disposing the two numeric conditions that hold as before | Same readings plus two closes; the sharpened growth condition is not met. Evidence: §3. | Every planning entry. | A measurement changes beyond the closes' additions. |
| Adding WO-192 as a typed edge of WO-083 | The operator's correction 2: the measured run uses whatever core uses at the time, and hand-opened sessions are acceptable; the placement carries the preference. Evidence: WO-083's assumption 3. | WO-192's close. | The operator makes the router the only route for the run. |
| Running the slow conditions probe | It cannot measure a document gate inside its wall budget (the standard pass's candidate 2); this pass's own gate is recorded in §12. Evidence: `docs/planning/standard-pass-2026-10-11.md` §3. | The next pass that needs the measure. | The probe's budget is changed by an order. |

## 9. Document ceilings

Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its non-exempt bytes measured by `node scripts/docs-check.mjs` after this
pass's write-backs, plus one tenth, with this section as the decision.
Product 03 grew by 1,589 bytes and product 12 by 2,299 (the paragraph on the
constrained managed host and the rewritten paragraph of §One workstream
across repositories); product 12 stood 466 bytes over its previous ceiling
before this reset, which the check reported as the advisory planning reads.

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,041 | 30,846 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,450 | 164,395 |
| 03-architecture.md | 181,762 | 199,939 |
| 04-interfaces.md | 60,516 | 66,568 |
| 05-pattern-library.md | 135,436 | 148,980 |
| 06-roadmap.md (non-exempt) | 41,653 | 45,819 |
| 07-execution-guide.md | 186,633 | 205,297 |
| 08-publication-compiler.md | 24,867 | 27,354 |
| 09-audit-resilience-privacy.md | 51,569 | 56,726 |
| 10-ir-compatibility.md | 25,665 | 28,232 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 20,626 | 22,689 |
| 13-uifa-roles.md | 27,015 | 29,717 |

No order carries a byte bound. The roadmap's generated release table was
refreshed with v0.74.2 and v0.74.3 (`npm run release -- list --markdown
--write`), inside its exempt block.

## 10. The register

At entry (revision `6bb4da75…`): 1,037 rows, 238 pending (1 open, 231
deferred, 6 untriaged: three boarded by WO-078's close and three by
WO-191's). `npm run meta` minted the five candidates of the map's route
section (1,042 rows, revision `389af22c…`, 244 pending with 11 untriaged
and FUP-0126 returned to review by the product 12 edit). The touching feed
was run with the surfaces of the nine orders and the three amended orders
(six pages, 38 rows); every row that names a seam an order opens is
allocated to that order and named in its text, and every other listed row
keeps its disposition, whose completion advisory will show it to the
executor whose change touches its path.

One batch of 22 dispositions applied at revision `389af22c…`: 13 allocated,
2 settled, 7 deferred.

| Target | Rows | What the order's text says |
| --- | --- | --- |
| WO-201 | FUP-8fb7ae17dd0fad5b, FUP-e624167a7f6555f6, FUP-b531e850b70f6d4e | the export runs core's suites (the condition occurred by direction); the fixture-data decision; the launchpad task's watch |
| WO-202 | FUP-a058e82c0bbd9b6d, FUP-8b8eb522d1d136c0, FUP-749c959a41178a3b, FUP-a4b2cdfb03ddbd2e | plane/kit root paths run in the fixture export; the reader check's unverifiable row; the projection warning; the malformed reader result, each within the Boy Scout bound |
| WO-203 | FUP-584d6021928bdfdb | WO-078 D009's three update-path items |
| WO-204, WO-205, WO-206 | FUP-6b6274b0176af00d, FUP-7777b9f12644e560, FUP-fadd2376e82a909e | the three boundaries as orders (item (c)) |
| WO-208 | FUP-3e22cf6f99f02005 | the instance-owned source adapter's port, requested by the direction |
| WO-080 to WO-083 | FUP-0126 | re-recorded at source revision 8 |

Settled: FUP-995f9b2aacc209d2 (WO-078 D010's repair record) and
FUP-c6da24aea75994e6 (WO-078 D004's fixed items), each with no outstanding
action. Deferred with new reasons: the five candidates of this pass
(FUP-82c6c63771a87233, FUP-efcc590126413a41, FUP-d2897b117391bb26,
FUP-7787c6f1867375f8 and the launchpad task row allocated above);
FUP-a566ba26ee9f909a (the gate wall-clock comparison the slow probe cannot
make; this pass's gate in §12); FUP-e96221b106cd136a (the fired launchpad
row and WO-201's watch); FUP-3a0ac2cbb53c255e (WO-206 leaves the
semantic-hash items alone). Open: FUP-f1c7a256bec46737, the operator's
reserved efficiency pass, unchanged at 28,112 bytes.

After the batch: 1,042 rows, 229 pending (1 open, 228 deferred, none
untriaged and none awaiting review).

## 11. Goal alignment and cost

The mission contribution is the operator's instance: after five orders the
operator plans and drives Angular work from a fork of the public kit with
the same gates and planning core has, and the real run (WO-083) sits where
its own recommendation put it. Traps named before the material choices.
Shifting the burden: the three source-writer boundaries become orders
rather than a written acceptance the operator signs at activation; the
README text reaches the kit through an order rather than an override. Rule
beating: WO-201's `kit-verify` judges the runtime by refusal and reports the
true-fork state instead of refusing an instance its gates. Seeking the wrong
goal: no byte figure binds an order; the ceilings are planning's; the
instance's first visible Angular slice is left to the instance's pass.
Success to the successful: the route's orders are placed by dependency, not
by size; WO-118 keeps its place as the product exit. Policy resistance:
machinery parity is stated as what an instance runs, with WO-202 to observe
it rather than a rule to obey. Naive Interventionism: nine orders, each
authorized by a lettered direction, and five candidates left with reopening
conditions; no new gate, agent or ritual. Commons and escalation: one worker
of twenty; three product paragraphs; the launchpad task's growth watched,
not patched. Drift: the planner's own 2026-10-07 attribution error is named
and corrected on the live surfaces with the receipts untouched. The outcome
matched the plan: one worker, nine orders, no activation.

Cost of this pass: the usage readback is unknown with cause
(`node scripts/harness.mjs usage <session>` reports "Token measurement
requires an active role and dispatch start"; the prompt hook reported every
counter unavailable, source unavailable); the handoff figure is in the
response and the ignored session receipt. The operator's three questions
were answered in the pass; the conditions probe cost 31.5 s and the touching
feed six pages.

## 12. Validation and independent judgment

The product write-backs passed `npm run publication:check` with both edition
locks refreshed. `node scripts/siblings.mjs index --check` passed on the
regenerated registry. `npm run work-orders -- index --check` passed on the
new sequence. `node scripts/docs-check.mjs` passed with 15 product documents
and zero failures once this document existed (its earlier failures were the
links to it), with one operator-word advisory on this document answered by
the capture digest in §4. The plan check refused until the receipt existed,
as the mechanism requires.

[Receipt 044](refutations/2026-10-11-planning-fb68306765535a9d-044.md)
binds committed subject `c35dcd83` (subject hash `sha256:1a21ba81…`). Its
scope is this pass: the twelve orders whose judged text is new or changed
(WO-201 to WO-209, WO-083, WO-118, WO-192) plus the sequence, with 21
unchanged order verdicts carried by hash. One fresh background
`dotln-worker` received only the canonical prompt (181,732 bytes, in the
system temporary directory outside the repository) and the shared goal card.
Its statement says it read the file whole in fifteen slices with read-only
shell commands plus three auxiliary listings, read no other repository file,
planning document or receipt, made no repository or Git write (one attempt
to write its result into the session scratchpad was refused by the
outside-project write refusal of WO-144 and nothing was written), validated
its result against the schema through standard input, spawned no agent, and
reports its model as the host's system prompt names it (claude-opus-5-5)
and its effective effort as unknown (`CLAUDE_EFFORT=xhigh` in its
environment may be inherited). It returned `aligned-with-findings` for the
plan, `aligned` for WO-204 and `aligned-with-findings` for the other
eleven, twenty-three known issues and no hold. Dispatch to filing took
1,008,918 ms; the worker ran 872,288 ms over 24 tool uses and 200,904
tokens by the host's count. The helper committed the pair as `dcef5dff`
and passed `plan check`: judged, committed and workspace subject hashes
were equal, with no continuation update. Every known issue is carried on
its order's catalog row in the map, as product 07 places a receipt's known
issue for an order the receipt finds frozen; the planner's readings of the
material ones, each for the next amendment of its order:

- **WO-206's commit and ref ordering** is the sharpest: a writer worktree
  attached to a branch would advance a shared ref to a commit that exists
  only in the private store before the import. The order must have the
  writer commit on a detached HEAD, or in a ref namespace inside the
  private store, and the host move the shared ref only after
  `CandidateImported`; the row carries the reopening observation and the
  next amendment states it before activation.
- **WO-205's objective overstates criterion 1.** A sparse checkout carries
  `skip-worktree` on unmodified out-of-cone entries; criterion 1 (a flag
  on a modified, deleted or executable-bit-changed file) is the governing
  rule, and the next amendment aligns the objective and adds the
  sparse-checkout case.
- **WO-083's preflight sentence** names WO-118 and the three boundaries but
  not WO-201 and WO-202, which this pass added as typed hard edges; the
  edges hold the dependency through the plan check and the index, and the
  next amendment adds them to the sentence. Its non-goal that WO-192 to
  WO-194 serve the work instance reads against the objective's router
  route; criterion 1's route statement governs and the next amendment
  rewords the non-goal.
- **WO-201's core-only declaration** can drop any suite with a free-text
  reason; the next amendment requires each declared row to name an input
  absent from the manifest and the fixture to check it. Criterion 5's two
  requirements fall on different README sections (the drafted sentences on
  §Kit files and §Taking upstream updates; the observed lists on §What
  runs here), which the next amendment states so.
- **WO-202's optional inputs** must stay failures in a core checkout; the
  next amendment distinguishes core from a kit by the detection WO-201
  adds.
- **WO-208's unconsumed adapter kinds** should be validated by shape
  without running a module's top-level code until a consumer asks; a
  malformed section refusing every vertical is the configuration's existing
  rule for every section and stays.
- **WO-209's guard** checks the compiler's major version; within a major,
  criterion 4's equality case (the emit from the pin equals the pinned
  revision's bundle) is the compatibility check, and the row carries the
  observation.
- **WO-207** must refuse before writing when the rollback lane is
  unwritable (fail-closed); its place after WO-083 is the operator's
  ("rollback may follow"), and the R3 replan may reorder it.
- **WO-203** sits before WO-118 at the operator's direction (the preview
  before the first real update), not on a gate's chain; recorded.
- **WO-192's router root** gains its budgets entry in step 3; the next
  amendment names the ceiling rule (measured bytes plus one 4 KB step under
  the standing route). Its live evidence stops at final review by design;
  WO-083's run is the first live publication through it.
- **WO-118's declared outward-leak set and outside-write grants** are its
  standing carry-ins (the WO-144 note on its row) and stay there.

The worker made no repository or Git write and spawned no agent. One worker
ran in this pass, as planned. Completion uses `npm run test:docs` over this
branch after the receipt and these map and document updates; its executed
verdict, wall-clock and summed task work are recorded in the sentence that
follows once it has run, and the handoff and the pull request report the
same figures.

New inputs beyond the entry set: the conversation-only capture in full; the
2026-10-07 capture in full; WO-112 D033, D043 and D044, WO-074 D007 and
WO-075 D011 in full; the source decisions of the twenty-two disposed rows;
`scripts/launchpad.mjs` (the kit file set, the update planner, the CLI),
`scripts/test-runner.mjs` (the suites table and the build selection),
`scripts/lib/harness.mjs` (the installation and check), `scripts/lib/config.mjs`
(the section keys), `scripts/lib/vertical-runtime.mjs` (the configuration
reader and the fetch seam), the source-change and verification worktree
symbols the boundary orders name, the sibling declaration and generator, the
kit's client README and templates, the harness manifest's installed list,
and the orders WO-072, WO-076, WO-200, WO-080, WO-081, WO-082, WO-193,
WO-194, WO-071, WO-073 and WO-049 in their headers and placements.
