# Standard planning pass, 2026-10-11

## 1. Subject, authority and provenance

The operator opened a bare `planning:` dispatch on 2026-10-11 UTC. The
ignored compaction-safety capture has SHA-256
`e1e146ec35fc721c3c494a63e9434b7f073a8028da92d28cc2d92117c4d00ddb`. This
document is planner synthesis of public repository evidence; the clean-room
screen found no suspect material in the sources used.

Entry was clean `main` at `5328814f`, with WO-189 closed (v0.74.1), no
active order and no event since receipt 042 was filed at 00:42Z. The pass
runs on `planning/2026-10-11-standard-pass`, created by `plan start`. Only
the parent writes this planning checkout; the fan-out plan is one
background `dotln-worker` (the planning refuter) against the cap of 20,
with no descendants. The pass prepares documents and local commits;
implementation, activation and publication keep their separate dispatches.

Aim, as read: a standard pass over the register's existing rows, thirteen
minutes after the entropy pass that filed receipt 042. The traps that would
change what this pass does: filing an order for a low finding whose
condition has not occurred (naive interventionism; the record decides, §5);
amending a judged order after the receipt (the 2026-10-02 pass's error;
every amendment precedes the refutation here); and reading "disposes every
row it reads" as a second queue drain of the deferred rows (it is not; the
deferred rows are read for fired triggers, §3). The NoOp at entry would
have left receipt 042's twelve known issues on catalog rows for a later
pass, fifty-two register rows untriaged or open with their decisions
unread, and two queued orders citing a critical-path row that disagrees
with their own text.

## 2. Entry observations

`plan start` and `plan failures` counted nothing in the window since
receipt 042 (`2026-10-11-planning-e3afc2052c1d4de4-042`, opening
2026-10-11T00:42:05Z): 0 failed verifications, 0 failed final reviews, 0
repairs, 0 orders made ready, 0 corrections, 0 off-ramps, 0 amendments.
The record totals stand at 132 failed verifications, 16 failed final
reviews, 151 repairs, 164 orders made ready, 177 corrections, 6 off-ramps
and 48 amendments. The last eleven measured final reviews over ten orders
recorded 14 escapes. Local records: 0 release closes and 0 host denials in
the window; 3 interventions (2 unclassified, all this session's own
dispatch rows); 0 long phases; 0 repeated gate runs; the eight recent
closes split four delivery and four machinery. The 2026-10-10 pass's §2.1
and §2.2 remain the current reading of the eleven closes since the reset;
no close has happened since.

## 3. Reopening observations

`plan conditions` at 00:55Z (37.2 s) and `--slow` at 00:57Z (301.4 s):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 3.653 s, then 3.546 s | 8 s | no |
| Release table lag | 0 tags | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 46,994 and 1,554,628 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 27,123,775 bytes (unchanged since 2026-10-10) | 10 MB | yes |
| collectSources | 0.956 s, 0.928 s | 3 s | no |
| Uncached release listing | 4.567 s, 4.487 s | 10 s | no |
| status --all --json | 5,401,366 bytes | 32 MB | no |
| Work-order index | 2.316 s, 2.262 s | 10 s | no |
| Document gate and docs-check (`--slow`) | unknown: the probe exited 1 (ETIMEDOUT) after one gate and its listing wall budget was exhausted; from the one fresh row below: 129.4 s and 22.0 s | 30 s / 15 s | from the row: yes |
| Plain gate, thirty-day median | 294.876 s | 360 s | no |
| gate-task vertical / harness-fixtures / skeleton | 840.5 / 284.9 / 275.8 s | 1,142.4 / 396.1 / 435.9 s | no |
| gate-task worktree | 226.729 s against an 88.786 s median | 133.178 s | yes |
| gate-task worktree-integration | 195.379 s against 130.355 s | 195.532 s | no, by 0.15 s |
| coldStartBytes.executor | 28,112 | 24,576 (WO-150-D003) | yes; the ceiling is 29,246 |

**The document gate from its one fresh row.** The probe's first gate ran
as `npm run test:docs` at `cef58c51` (32 fresh suites, exit 0) and
recorded 129,411 ms at 00:59:56Z; its slowest tasks were `resume`
98.1 s, `console-docs` 35.2 s, `skeleton-docs` 29.3 s,
`docs-check-fixtures` 24.8 s and `docs-check` 22.0 s. The 2026-10-10
pass's cause (the `resume` suite ending the critical path since WO-186
moved it into the gate) stands, and its NoOp conditions are not reached
(median 180 s; `resume` 120 s). The probe's inability to measure three
such gates inside its wall budget is a new candidate (§6, map).

**Three conditions hold with the same measurements as on 2026-10-10**, and
no order has closed since. The 2026-10-10 pass's re-deferrals stand: the
week's growth is 16.3 MB from four pre-reset orders and 10.8 MB from the
ten since, of which the six that passed verification in at most two
attempts added 3.65 MB, so the sharpened condition is not met; the
`worktree` task's growth is named by WO-198's whole-gate witnesses; the
executor cold start is under its ceiling and the efficiency redesign is
the operator's reserved pass (FUP-f1c7a256bec46737 stays open with the
new reading, §6). None is re-disposed on unchanged evidence; a timestamp
refresh is not new evidence.

**Order-lifecycle triggers.** No order changed phase since the 2026-10-10
pass re-disposed the four fired bare openers, so none fired by a lifecycle
event. Two deferred rows name this pass's own action as their trigger and
fired when WO-118 was amended (§4): FUP-faae1df8f1022634 (WO-123 D040,
"WO-118 is next planned, amended or activated") and FUP-82750a69c54c2ced
(WO-123 D044, "WO-118 is planned or activated"). Both are read and
allocated to WO-118, whose Known issues carry their duties (§6).
FUP-165f9860f8f32a67 (WO-117 D007, "the pass that places WO-118 in a head
pair") did not fire: WO-118 stays sixth and alone.

**WO-088's gap** is not re-measured this pass; the 2026-10-10 reading
(absent for a fourth pass) stands and the order keeps its place for the
operator to withdraw.

## 4. Receipt 042's known issues consumed

Receipt 042 found the six orders it judged frozen and left its twelve
known issues on their catalog rows for "the next pass that touches those
orders". This pass touches them, before its own refutation, so the
amended text is what the fresh refuter judges.

| Order | Known issue (receipt 042) | Amendment |
| --- | --- | --- |
| WO-118 | criterion 1 may close by waiver and WO-083's typed edge has no guard | criterion 1: a waiver names the evidence standing in for the run, and WO-083's dependency is satisfied only by this criterion recorded observed; WO-083's Depends on, typed edge reason and criterion 1 say the same |
| WO-118 | the Cost line's 250 and 150 bytes beside the gap's "no byte figure binds" | the Cost line calls them the planner's estimates, never bounds; criterion 6's closing sentence says the ceilings are planning's and no role trims text to a number |
| WO-118 | the Objective defines one control scenario while criterion 1 names two | the Objective names both (the ambiguous intent and its `NeedsHuman` answer; the planted incorrect suggestion) and criterion 1 lists them with the one `dotln presence away` setup event |
| WO-118 | the gap, dated 2026-09-28, lists WO-074, WO-075, WO-077, WO-112, WO-116 and WO-117 as open | the gap is restated at `5328814f`: the export and its updates exist, the loop is proven from core (`vertical.source-to-pr` level 1), the audit view and live console are closed, and no run from a starter exists |
| WO-118 and WO-083 | the critical path's gate V row places R3 after WO-118 while the orders place it after WO-083 | the gate V row now says R3 follows WO-083's run, as §Stop and replan points item 3 already said |
| WO-083 | the Cost line's 200 bytes beside criterion 4's "no byte figure binds" | the Cost line calls them estimates, never bounds |
| WO-083 | last in the sequence with no supplied reason | the non-goals carry the reason (the operator's fork on the operator's own machine; operator direction, 2026-10-07) |
| WO-096 | one governance column, no harness dimension | criterion 1: counts per profile, a hook-lowered unit counting as `mechanism` only where its hooks fire; the Design says the render gives the counts per profile |
| WO-096 | whether an `unavailable` local-terms check fails a gate | criterion 2: `unavailable` is reported in the gate's output and the receipt and never fails a gate on that alone; the executor's run with the list present is the screening evidence |
| WO-098 | about 2,280 generated bytes against 1,134 bytes of executor headroom; criterion 3 lets a ceiling be raised while criterion 4 does not require the load to fall (the fourth receipt to find it: 033, 036, 041, 042) | criterion 4: no role's directed-load total may be higher than at WO-097's base; criterion 3: an exceeded ceiling is boarded, never raised or accepted, and a unit's line is emitted only into the role skills whose loadout equips it; the Design's declined alternative is recorded as adopted in this form |
| WO-098 | no per-profile split of the mechanism count | criterion 4 counts per profile |
| WO-095 | the re-mint cascade may cost more than the render | criterion 5 records the cascade's elapsed wall-clock apart from the render work |
| WO-200 | the drift tests might compare the two lists with each other | step 7 and criterion 2: `protocolLineage`'s own input list is the single anchor the attribute set, the ignore group and the row's declared sources are each compared against |

The WO-098 decision reverses a declined alternative of 2026-09-28 (every
role's directed load strictly lower). The evidence for the reversal is the
four receipts that found the reported-only total let the order pass while
the always-on text grew, and the per-loadout emit, which bounds the
generated lines the 2026-09-28 declination feared no order could bound.
The alternative weighed and declined: a recorded planning decision before
any raise, which leaves the order passing while the text grows and moves
the judgment to a pass with less evidence than the executor has.

Two more rows are carried into WO-118 by the trigger its amendment fired
(§3), and WO-083's criterion 1 gains an activation preflight: WO-118's
criterion 1 recorded observed, and the three WO-112 source-writer
boundaries (FUP-6b6274b0176af00d, FUP-7777b9f12644e560,
FUP-fadd2376e82a909e) disposed by a planning pass before the run touches
the operator's repository. These are on the first order whose target the
operator keeps; on WO-118's scratch target the risk is accepted.

## 5. Decisions and NoOp records

No order is filed: no numeric condition fired beyond those the 2026-10-10
pass disposed on the same measurements, no lifecycle trigger fired by a
phase change, and the operator gave no direction beyond the dispatch.
Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| An order for the three WO-112 source-writer boundaries (cleanup revocation, Git interpretation, shared-object protection) | Each is a real, source-reviewed defect with a named fix (WO-112 D033, D043, D044) and no observed failure; WO-118 runs the writer on a scratch target and WO-083, the first run on a repository the operator keeps, is last in the sequence behind the workshop and migration orders. The decision is placed where it is due: WO-083's activation preflight requires each disposed by an order or a written acceptance. Evidence: the three rows; WO-083's criterion 1. | The pass that places WO-083 within the next pair. | A host unlink failure, an index-flag counterexample or a preservation claim occurs first, or the operator moves WO-083 up. |
| An order for the twenty-six low machinery rows deferred in §6 | Each breaks no criterion and no behavior `main` had, and none has recurred; the completion advisory lists a row to the executor whose change touches its path, and four queued orders take nine of them as carry-ins. Evidence: the rows' decisions; `followups --touching` (34 textual matches for the six amended orders). | Every planning entry from the register. | A row's named reopening observation occurs, or the same low defect is boarded by a third order. |
| A gate-time order (document gate 129.4 s, `resume` 98.1 s) | One fresh row, the 2026-10-10 cause unchanged; the per-order cost is minutes against hours set by the verification loop; WO-197's gate-time order closed with both aggregate criteria waived. Evidence: §3. | Each planning entry from recorded rows. | The median passes 180 s, gates pass a quarter of phase time, or `resume` passes 120 s. |
| Re-disposing the three holding numeric conditions | Same measurements as 2026-10-10 and no order closed since; a disposition on unchanged evidence is a timestamp refresh. Evidence: §3. | Every planning entry. | A measurement changes or an order closes. |
| A typed `reopenOn` field for lifecycle triggers (the 2026-10-10 candidate) | This pass found no fired lifecycle trigger left by the pass before, and the two that fired did so on its own action; the count stays at eight bare openers. Evidence: §3. | Every planning entry. | A third pass leaves a named fired trigger, or such rows pass ten. |
| The personal delegation profile of product 05 (FUP-e62d0d2771185a38) | Operator direction is its trigger and none has been given; every executor completion and verification already spawns a fresh adversary. Evidence: the row; product 07 §Verification review and attack. | On operator direction. | The operator directs it, or a root task records fewer than three contributions while the mode is claimed on. |
| An Ultracode attestation rule (FUP-16a4af39c710459b) | Needs the operator's word on how a Claude Code role records the mode; this session's readback gives effort xhigh and no mode. Evidence: the row; the session readback. | On operator direction or a host change. | Either host changes its reporting, or the operator directs the record. |
| Keying `docs/control/budgets.json` and the tag-manifest template into the product-gate identity now | A code change (`gate-evidence.mjs`) outside a planning pass; the legal and license files the suites copy are already read fresh by the document gate's `license-surfaces` and `release-surfaces` rows. Recorded as a candidate and a route for the next order that edits the identity or the release suite. Evidence: `gateCodeIdentity`'s selection (only the vocabulary file admitted from `docs/`); the fresh gate row's required suites. | The next order that edits `gate-evidence.mjs` or the release suite. | A reused `npm test` row is shown to have passed over a changed copy. |

## 6. The register

At entry (revision `9291303c…`): 1,026 rows, 245 pending (2 needs-review,
19 open, 31 untriaged, 193 deferred). `npm run meta` minted the two
candidates of the map's 2026-10-11 section (1,028 rows, 247 pending).
One batch of 56 dispositions applied at revision `9b5a5626…`: 9 allocated,
6 settled, 39 deferred, 1 duplicate, 1 kept open; one correcting
disposition followed for FUP-c24585c3b7bebf38, whose first reason this
pass wrote was wrong (docs-check does import `runGit`; it is used three
times, so the removal D014 asked for is moot). Every non-deferred row was
read with its source decision; the deferred rows were read for fired
triggers only, as §3 records.

| Target | Rows | What the order's carry-ins say |
| --- | --- | --- |
| WO-118 | FUP-faae1df8f1022634, FUP-82750a69c54c2ced | the admitted intent must carry each issue's `baselineAssessment`; WO-123 D044's five items are read at the base |
| WO-192 | FUP-82e9f0bda503c40c, FUP-ea936acad1506e18 | the worker pin, name and patterns; the runtime pin list against the import closure |
| WO-078 | FUP-eaad73517ca2a395, FUP-06de60fa5d19fe5a | the three `launchpad --update` defects; the publish check's author identity from instance data |
| WO-076 | FUP-44639ec9a751d8d1 | the Start here directives emitted from the bundle |
| WO-072 | FUP-bd3e66761dc301ed | the umbrella pre-check before `worktree add` |
| WO-080 to WO-083 | FUP-0126 | re-recorded at source revision 7 |

Every allocation is within the Boy Scout bound or a recorded reason to
leave the item, and the order's text names the row (the 2026-10-07 lesson
of FUP-3f9d788f4d8c89ac, returned to open because WO-196's text never
named it). Settled: FUP-c24585c3b7bebf38 (the import is used),
FUP-0a7c93eed06727ce (product 07 is under its planning ceiling and the
hard ceiling it kept an advisory for is gone), and four decision records of
closed orders with no outstanding action (WO-184 D013, D032, D034; WO-188
D026). Duplicate: FUP-032190d84be0c2f0 of FUP-cde72b7860c03c18, the same
off-ramps assertion. Open: FUP-f1c7a256bec46737, the operator's reserved
efficiency pass, with the 2026-10-11 cold-start reading. Deferred: the two
candidates of this pass; the two excluded-input rows with the route of §5;
the three WO-112 boundaries with WO-083's preflight; and the remaining low
machinery rows, each with its named reopening observation and, where one
exists, the queued order whose completion advisory will list it.

After the batch: 1,028 rows, 231 pending (1 open, 230 deferred, none
untriaged and none awaiting review).

## 7. Write-backs

- **Product 07 §Verification review and attack.** One sentence after the
  routes: the verifier routes a blocking finding with its repair rule on its
  own authority, and `operator` is never a request to authorize a repair
  inside the order's criteria and declared surfaces (WO-187 D042). The
  verifier-root sentence is compiled role text and waits for the
  rule-migration batch or the next order that edits the loadout
  (FUP-e835d826e9af5417).
- **Product 07 §Discipline.** Beside the bounded wrapper: a probe's
  repository copy leaves out `.control-beacons` and guards per-file size,
  because a Beacon group file is sparse and a recursive copy writes its
  logical size in full (WO-187 D053; item 6 of FUP-1315c82ef74fb832).
- **The critical path's gate V row** says R3 follows WO-083's run.
- **The software-engineer edition's source lock** was refreshed to the
  checked hash after the product 07 edits; `npm run publication:check`
  passes with both editions current.
- **The map** carries the amendment notes on the six catalog rows, the
  recommendation paragraph and the candidates section dated 2026-10-11;
  **the ledger** carries this pass's section; **the sequence is
  unchanged** (no closed entry to retire; the lane pairs stand).

## 8. Goal alignment and cost

The mission contribution is the delivery lane's next orders reading true:
WO-118's executor starts from the current record, and the product exit's
dependency is an observed run on a scratch target before the operator's
repository is touched. Traps named before the material choices. Shifting
the burden: WO-083's preflight puts the three boundary decisions on
planning, not on the operator at activation; WO-118's waiver clause names
what evidence stands in. Rule beating: WO-098's reported-only total is
closed as a pass condition, and WO-200's lists anchor to the hash's own
input. Seeking the wrong goal: no byte figure binds an order; the ceilings
are planning's. Success to the successful: allocations go to the order
that already edits the surface, never to the biggest order. Policy
resistance: the per-profile governance counts stop a mechanism count from
rising on a profile where the behavior is text. Naive Interventionism: no
new gate, agent or ritual; one order filed by the pass before, none by
this one. Commons and escalation: one worker of twenty; two product 07
sentences. Drift: WO-098's standard is tightened, the 2026-09-28
declination reversed on four receipts' evidence, not loosened. The outcome
matched the plan: one worker, no order, no activation.

Cost of this pass: the usage readback at entry was 86,746 total tokens
(cached input 67,679; source `claude-transcript-message-usage`, scope
dispatch); the handoff figure is in the response and the ignored session
receipt. The slow conditions probe cost 301 s and measured nothing new;
the one document gate it ran is the fresh row §3 reads.

## 9. Document ceilings

Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its non-exempt bytes measured by `node scripts/docs-check.mjs` after
this pass's write-backs, plus one tenth, with this section as the decision.
Only product 07 changed (two sentences, 521 bytes):

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,041 | 30,846 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,450 | 164,395 |
| 03-architecture.md | 180,173 | 198,191 |
| 04-interfaces.md | 60,516 | 66,568 |
| 05-pattern-library.md | 135,436 | 148,980 |
| 06-roadmap.md (non-exempt) | 41,653 | 45,819 |
| 07-execution-guide.md | 186,621 | 205,284 |
| 08-publication-compiler.md | 23,118 | 25,430 |
| 09-audit-resilience-privacy.md | 51,569 | 56,726 |
| 10-ir-compatibility.md | 25,665 | 28,232 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 18,327 | 20,160 |
| 13-uifa-roles.md | 27,015 | 29,717 |

No order carries a byte bound.

## 10. Validation and independent judgment

Pending at the time of writing: the refutation receipt and the document
gate are recorded here once filed.
