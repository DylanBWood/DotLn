# Entropy Reducer planning pass — REVIEW-006 (2026-10-10)

## 1. Subject, authority and provenance

The operator opened `planning: entropy reducer` on 2026-10-10 UTC. The
ignored compaction-safety capture has SHA-256
`af15db6c04e4529cad3c3532a21f5a46060c650159a637899d4ece48e8438726`. This
document is planner synthesis of public repository evidence; no raw source
wording is filed as a draft, and the clean-room screen found no suspect
material in the sources used.

Entry was clean `main` at `9c18aa54`, with WO-189 closed (v0.74.1) and no
active execution obligation. `entropy subject` found no filed review both
refuted and undisposed, so the pass dispatched the pinned reviewer against
that commit. Only the parent writes this planning checkout. The pass
prepares documents and local commits; implementation and publication keep
their separate dispatches. The fan-out plan was three workers against the
cap of 20: the external reviewer, the blinded entropy refuter and one
background planning refuter, with no descendants.

## 2. Entry observations and the record since the machinery reset

`plan start` and `plan failures` counted, since the 2026-10-07 receipt
(`2026-10-07-planning-c351cfc3b65e74e5-041`, window opening
2026-10-07T07:33Z): 14 failed verifications, 1 failed final review, 15
repairs, 11 orders made ready, 7 failed first verifications, 8
corrections, 2 off-ramps (both `CriterionWaived`, WO-197 criteria 1 and
2), 0 amendments. Twelve measured final reviews recorded 14 escapes, 12 of
them WO-188's and 2 WO-199's. Local records: 10 release closes, all dry
runs; 0 host denials; 12 interventions, all directions, 11 at release
close; 19 long phases; 12 product-gate rows at an already green identity
(5 of them WO-196's); 34 failed gate rows (WO-188 13, WO-075 7). The eight
recent closes split four delivery and four machinery.

### 2.1 Hours per order since the reset

From the control segments (activation to the last passing final review):

| Order | Activated | Hours | Verifications | Repairs |
| --- | --- | --- | --- | --- |
| WO-196 | 2026-10-07 | 8.4 | 2 | 1 |
| WO-197 | 2026-10-07 | 6.8 | 2 | 1 |
| WO-199 | 2026-10-08 | 20.0 | 3 | 2 |
| WO-188 | 2026-10-08 | 18.5 | 4 | 3 |
| WO-074 | 2026-10-09 | 2.9 | 1 | 0 |
| WO-075 | 2026-10-09 | 10.5 | 2 | 1 |
| WO-190 | 2026-10-09 | 9.1 | 1 | 0 |
| WO-073 | 2026-10-09 | 2.3 | 1 | 0 |
| WO-198 | 2026-10-09 | 7.2 | 5 | 4 |
| WO-077 | 2026-10-10 | 9.8 | 1 | 0 |
| WO-189 | 2026-10-10 | 21.1 | 4 | 3 |

The median is 9.1 hours against the 17 to 48 hours the 2026-10-07 pass
measured for the seven orders before it. Five orders passed on their first
verification; four needed three to five.

### 2.2 Every failed report, by cause

| Report | What failed | Cause class |
| --- | --- | --- |
| WO-189 VER-001, VER-002, VER-003 | criterion 5 each time: the front page's sentence budget was bypassed by a declared order, by Markdown emphasis and by text the checker's parser does not count; D013 replaced the sentence count with a line count | prose-reading criterion (planning) |
| WO-198 VER-001, VER-002, VER-003 | all five criteria met; one regression against `main` each, found by a fresh probe (a malformed earlier snapshot, a damaged gate-history archive, a ref Git cannot enumerate); each failed closed | regression clause, criteria met |
| WO-199 VER-001 | criteria 1 to 5 met; a signal outside the writer step no longer stopped the host | regression clause, criteria met |
| WO-188 VER-003 | all 27 criteria met; CR-only Markdown changed literal code and failed publication | regression clause, criteria met |
| WO-199 FINAL-001 | criterion 2's exit clause unmet and a regression (a terminal signal during the post-result admission became the writer's result) | criterion and regression |
| WO-188 VER-002 | criterion 24 unmet (an empty rendered destination survived publication) and a regression (literal code inside a mixed-backtick span) | criterion and regression |
| WO-198 VER-004 | criterion 2 unmet: the repaired comparison withheld changed fields | repair-introduced defect |
| WO-188 VER-001 | criteria 1, 24 and 27 unmet (nested scratch survived cleanup, relative link forms bypassed rewriting, the document gate failed) | defects in a large order |
| WO-075 VER-001 | criterion 1 unmet: the export could label compiled local bytes as the commit's runtime (major) | defect |
| WO-196 VER-001 | criterion 8 unmet: the document gate printed no ceiling advisory | defect |
| WO-197 VER-001 | criteria 1 and 2 unmet: no historical case timing exists and the aggregate thresholds were missed; the operator waived both | unmeetable criteria (planning) |

Three of the fifteen are a planning defect of the kind the 2026-10-07 pass
screened for: WO-189's criterion 5 counted sentences of Markdown prose, a
deterministic reading of free-form text, and that pass amended WO-189
without catching it. Product 07's screen now says that counting sentences
is such a reading (§5). Five failed with every criterion met on the
regression clause the 2026-10-07 pass added to the verdict rule; the loop
was fast (one to two hours a round) and every finding failed closed, so no
rule change is made and the pattern is a candidate with a reopening count
(§5). WO-197's two unmeetable criteria went through the waiver off-ramp as
designed.

The eight corrections: five in WO-198 (the review-reuse rule, three
comparison-rule readings, a misreport of progress lines as passes), one in
WO-112 (a record written during a review gate, recorded at the operator's
direction) and two in WO-196 (the formatter's scope, four changed build
assertions). None is a lost gate to formatting or a record write after
WO-196, which is the reset's first reversal condition.

## 3. Reopening observations

`plan conditions` measured at entry (23:40Z) and again at 00:04Z with
`--slow`, with the reviewer running during the first:

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 3.789 s (the second listing could not run it: the register was stale between `dispose` and `meta`) | 8 s | no |
| Release table lag | 18 tags (refreshed in this pass; 156 rows) | 3 tags | yes, consumed |
| Latest two closed orders, distinct evidence blob bytes | 46,994 and 1,554,628 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 27,123,775 bytes | 10 MB | yes |
| collectSources | 0.988 s, 0.817 s | 3 s | no |
| Uncached release listing | 4.660 s, 3.279 s | 10 s | no |
| status --all --json | 5,401,366 bytes | 32 MB | no |
| Work-order index | 2.311 s, 1.761 s | 10 s | no |
| Document gate and docs-check (`--slow`) | unknown: both probes exited 1 because the register was stale at that moment; read from recorded rows below | 30 s / 15 s | from rows: yes |
| Plain gate, thirty-day median | 294.876 s | 360 s | no |
| gate-task vertical / harness-fixtures / skeleton | 840.5 / 284.9 / 275.8 s | 1,142.4 / 396.1 / 435.9 s | no |
| gate-task worktree | 226.729 s against an 88.786 s median | 133.178 s | yes |
| gate-task worktree-integration | 195.379 s against 130.355 s | 195.532 s | no, by 0.15 s |
| coldStartBytes.executor | 28,112 | 24,576 (WO-150-D003) | yes; the budget ceiling is 29,246 |

**The document gate from its rows.** 151 fresh passing `npm run test:docs`
rows since 2026-10-07 have a median of 110.9 s (122.4 s over the last 40);
140 rows from 2026-10-01 to 2026-10-04 had 39.0 s. Task medians since the
reset: `resume` 84.4 s, `console-docs` 29.8 s, `skeleton-docs` 24.7 s,
`docs-check` 17.6 s, `resident-bind` 10.7 s, `docs-check-fixtures` 7.3 s,
`format` 6.8 s. The latest row's critical path is format, build,
docs-check, resume (123.9 s). Before 2026-10-05 the top tasks were
`console-docs` 25.9 s, `skeleton-docs` 21.9 s and `docs-check` 11.5 s;
`resume` was not in the gate, which WO-186 moved it into on 2026-10-05
(D036). The 60 s and 20 s conditions of FUP-fb8cbeabbddef397 hold, with
the cause named.

**The worktree task from its rows.** Fresh `worktree` task durations sat on
a 122 s plateau through 2026-10-09 (with three excursions of 195 to 224 s
under 89 to 93 concurrent peers), moved to 215 to 237 s at WO-198's fourth
review row (21:18Z on 2026-10-09) and stayed at 207 to 232 s in WO-189's
rows after WO-198 merged. WO-198's own criterion 3 runs a worktree's
document and plain gates twice inside a fixture; the growth is the order's
witnesses, an inference from the row timings that WO-198 D021 corroborates
for `runner-fixtures` (126.5 s against a 21.8 s median).

**Weekly evidence by order.** Against the last commit before 2026-10-05
UTC (`2816c773`), positive tracked growth under `docs/evidence` is
27,123,775 bytes: WO-123 6.12 MB, WO-112 4.82, WO-186 3.92, WO-197 2.47,
WO-199 1.87, WO-189 1.56, WO-198 1.53, WO-187 1.45, WO-188 1.15, WO-196
1.06, WO-074 0.43, WO-075 0.39, WO-190 0.18, WO-073 0.14, WO-077 0.05. The
ten orders closed after WO-196 added 10.8 MB; the six of them that passed
verification in at most two attempts added 3.65 MB, WO-197 the largest.
The 2026-10-07 condition ("a week after WO-196 merges adds more than
10 MB with orders that passed verification in at most two attempts") is
therefore not cleanly met: the week's growth follows four orders with
three to five verifications. The rows are re-deferred under a sharper
condition (§6).

**Order-lifecycle triggers, the REVIEW-005 reevaluation.** Of 177 deferred
rows, eight open their reopening condition with a bare order lifecycle
event and four of those had fired: FUP-0044 and FUP-0091 on WO-112's close
(2026-10-07T05:28Z, before the 2026-10-07 pass started), FUP-b3454d6ce3594ef3
on WO-188's (2026-10-09) and FUP-8111fc3dd4c22331 on WO-189's
(2026-10-10). All four are re-disposed in §6. 56 deferred rows name an
order somewhere in their condition and 26 a closed one; those compound
conditions were read, and none was found fired by this pass's evidence,
with two unknown (FUP-dbced48c3d572461, a Claude auto-mode close denial,
of which the window's local close records show none; FUP-38ced82ed597d07b,
a collision after WO-086 needing a hand step). REVIEW-005's NoOp on the
anchored parser named this reversal condition ("a subsequent pass again
leaves a named fired lifecycle trigger unchanged"); §5 makes the
comparison it asked for.

**WO-088's gap** is absent for a fourth pass: `README.md` and
`docs/README.md` list the same seven phrases in the same order, the
playbook the same seven with `next` last, and product 07 holds no list.

**The harness re-probe row** (FUP-ec75a4295bf36696, reassessed each entropy
pass): sessions run Claude Code 2.1.296 against the manifest's 2.1.263; no
capability/role-text mismatch is observed, no integration contract changed
and no operator direction asks for requalification. Re-deferred unchanged.

## 4. Review and blinded refutation

[REVIEW-006](../instance/entropy-reducer/runs/REVIEW-006.md) ran 704 s
(75 turns, USD 4.380) over 6,194 tracked paths with 0 denied tool calls
and filed two measured minor findings and one packet. Both survived
[REFUTATION-007](../instance/entropy-reducer/runs/REFUTATION-007.md)
(135 s, 20 turns, USD 0.649), which received reproduction commands without
the reviewer's narrative or proposals. Both workers reported the source
repository's tracked status unchanged across their episodes. The planner
re-measured both findings at `9c18aa54` before disposing them.

| Item | Evidence accepted | Decision in this pass |
| --- | --- | --- |
| ER6-001, a red hash-pinned lane | `node --test corpus/harness/wo107-schema.test.mjs`: 13 tests, 11 pass, 2 fail on "known collector revision". The only change to the four hashed collector files since WO-107 (`3e29dd9d`) is `1aea2dea` (WO-188, 2026-10-09), one comment rewritten in `corpus/harness/profile.mjs`; the hash moved from `1d618f2f…`, which 36 of 72 committed records carry, to `8e770e7f…`, which none carries; restoring the comment restores the hash (computed by the planner and by the refuter). No runner row names the lane; the comment scan and the formatter can reach the pinned files. | Accept; file WO-200 (§5.1). |
| ER6-002, the corpus entry-point sentence | 9 of 13 `corpus/harness/*.test.mjs` files are named in neither `corpus/README.md` nor a runner row; product 03 line 2348 said the entry point links each lane's commands; WO-102, WO-103, WO-105 and WO-107 each settled that their commands live in their own manifest or schema file. | Accept; correct the sentence in product 03 in this pass; no order. |
| Packet `pinned-collector-bytes-observed` | Retained in REVIEW-006; filed under `docs/proposals/`. | Accept; WO-200 takes its options (a) and (b) and declines re-collection. |

ER5-001's headroom check: REVIEW-006 used 29.3% of its 2,400 s limit
(REVIEW-005 58.5%, REVIEW-004 92.3%) and REFUTATION-007 7.5% of 1,800 s
(REFUTATION-006 6.4%). No reversal condition is reached; the limits stay.

## 5. Planning decisions and NoOp records

### 5.1 One order from one finding

**[WO-200](../work-orders/WO-200-pinned-collector-bytes-observed.md)** is
filed: the four files `protocolLineage` hashes carry a `dotln-pinned-bytes`
Git attribute that `commentFiles` honors beside `dotln-generated` and that
`.prettierignore` repeats under a test; `wo107-schema` becomes a machinery
runner row selected only when one of its five declared sources changed
against the merge base; the drift is recorded under WO-107 D001's rule
before any byte changes; the comment is restored to its `1aea2dea^` bytes.
The NoOp was weighed: leaving the lane red keeps 36 committed records
without a verifiable provenance and lets the next comment or formatter
rewrite drift them again unseen (WO-105 D012 and WO-107 are the two
instances in nine days). Re-collection was declined (the byte change is a
comment and no record's semantics moved); a third known revision was
declined (it would teach the lane that comment edits move provenance);
excluding all of `corpus/harness/` from the scan was declined (the
generators and tests there are ordinary code). Steady-state cost is about
one second when the five files change and nothing otherwise. The order
pairs with WO-076 after WO-072 because it edits `scripts/test-runner.mjs`,
which WO-078 and WO-072 both edit.

### 5.2 One sentence from the other

Product 03 §Corpus policy now says the entry point links WO-101's lane
commands and WO-108's runbook and that the later lanes record their
commands in their own manifests and schema files, as each order's
operator-review assumption 2 settled. No README edit; `corpus/README.md`
keeps describing the WO-101 layout it documents.

### 5.3 Declined mechanisms and alternatives

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| Anchored prose parser for lifecycle triggers (REVIEW-005's reversal reached) | The comparison REVIEW-005 asked for: the anchored regex found the eight bare openers and the four fired ones in one run, but it is a deterministic reading of free-form prose, which the 2026-10-07 screen forbids as a criterion, and it misses the 48 compound conditions. A typed `reopenOn` field (order, phase) listed by `plan conditions` is the admissible mechanism; it needs a schema change, a listing and a collector edit, and today eight rows would use it. The planner's entry duty is written into product 07 instead, and this pass re-disposed every fired row. Evidence: §3's counts; product 07's screen; the 2026-10-02 and 2026-10-07 passes' misses. | Every planning entry. | A third pass leaves a named fired trigger, or such rows pass ten. |
| A gate-time order for the document gate (FUP-fb8cbeabbddef397 at 110.9 s) | The cause is named (`resume` 84.4 s on the critical path since WO-186 moved it) and the per-order cost is about thirteen minutes at seven gates against a median order of 9.1 hours set by its verification loop; WO-197's gate-time order closed with both aggregate criteria waived; the delivery lane has not moved since 2026-10-01 beyond its first three pairs. Evidence: §2.1, §3's task medians, WO-197's off-ramps. | Each planning entry from recorded rows. | The median passes 180 s, a pass measures gates above a quarter of phase time, or `resume` passes 120 s. |
| Re-basing the thirty-day gate-task medians, or a fixture-cost pass over WO-198's witnesses | The growth is named by the order that made it (WO-198 criterion 3; D021), which is what the condition exists to show; a re-base would hide the next unnamed growth, and the window rolls by itself. Evidence: §3's worktree rows; WO-198 D021. | Each planning entry. | A gate task holds at a row whose order's decisions do not name the growth, or the gates' share passes a quarter of phase time. |
| A rule change for the regression-clause loop | Five of fourteen failed verifications failed with every criterion met on a regression against `main`; each round took one to two hours and each finding was a real fail-closed regression in the declared surface. The reset's own reversal condition (rising escapes over three orders) is not reached: escapes were 12, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0 across the eleven closes. Evidence: §2.2. | Each planning entry from the failures feed. | An order pays more than three verifications whose failures are all regression-clause findings, or the operator names the loop. |
| An executable self-review obligation after a failed verification (WO-187 D041) | The loops since the reset found new regressions or new bypasses, never an earlier report's finding returning, so rerunning earlier reproductions before repair-complete would not have ended them. Evidence: WO-198 VER-002 to VER-004 each confirm the previous repair and find a new defect; WO-189's three bypasses differ. | At the next planning pass. | A failed verification after WO-196 reproduces an earlier report's finding unchanged. |
| Evidence ceiling, pruning or transcript-reference migration | The weekly trigger occurred again (27.1 MB), but 16.3 MB of it is the four pre-reset orders and 10.8 MB the ten orders since, of which the six that passed in at most two attempts added 3.65 MB; the 2026-10-07 condition's conjunction is not met. Pruning stays unauthorized and immutable reports keep their referenced bytes. Evidence: §3's per-order table. | Every planning entry. | A week in which every closed order passed verification in at most two attempts adds more than 10 MB, or two consecutive orders exceed 1 MB of distinct blobs. |
| An order for the export's own test command (FUP-8fb7ae17dd0fad5b) | WO-075 closed with the harness check inside an export and the README says `npm test` fails at the build; what an exported instance's gate needs is first observed when WO-118 runs one. Evidence: WO-074 D007; WO-075 FINAL-001. | WO-118's close. | WO-118's exported instance runs `npm test` and the README does not say what fails, or WO-083's fork needs core's suites in place. |
| Broad harness profile requalification | No observed mismatch on 2.1.296; the dated profile observations and limits remain visible. Evidence: §3. | Next entropy pass. | An observed capability/role-text mismatch, a changed integration contract or operator direction. |
| Timeout listing or larger limits (ER5-001) | 29.3% and 7.5% this pass; the receipts expose duration. | Every entropy pass. | An observed deadline loss or two successive episodes of one kind above 80% of its limit. |

### 5.4 Corrections this pass makes on fired triggers

- **WO-189 D023 (FUP-5de3c35ef3d05142, "a planning pass runs").** WO-095 and
  WO-118 no longer cite the old page's lines or the release block's rule
  comment. The front page's budget is 11 lines with 9 used; WO-095 and
  WO-098 rewrite existing lines in place and add none, WO-118 takes one
  new line and one stays spare. WO-088's step 7 registers its generated
  phrase block in `docs/control/front-page.json`. The Poincaré epigraph
  has a row in the exact-expression review register of
  `docs/lineage/inspirations.md`, recording what is known (the operator's
  attribution and source) and what is not (the edition quoted).
- **WO-190 D006 (FUP-168dc7b8d999574b).** WO-083, WO-096 and WO-098 cite the
  two roadmap headings without their carrier suffixes.
- **WO-190 D003 (FUP-1a12e83d22825ee3).** WO-113 step 5 keeps the undated
  umbrella label and the typed `superseded` entries in the header.
- **WO-190 D008 (FUP-0e82c9b04b051f66).** The four pending rung bodies of
  product 06 name their umbrella carriers as cut into the successors the
  history page lists.
- **The planning screen (§2.2).** Product 07 now names a sentence count as
  a prose reading; this is the correction of this planner's own 2026-10-07
  miss on WO-189.

## 6. Sequence, map, orders and retained follow-ups

Eleven closed entries leave the sequence: WO-196, WO-199, WO-197, WO-074,
WO-188, WO-075, WO-190, WO-073, WO-198, WO-077 and WO-189. WO-078 and
WO-191 remain as the first pair; WO-072 runs alone; WO-200 pairs with
WO-076; the rest keep their 2026-10-07 order. Twenty-six entries remain.
The entry register had 1,018 rows, 249 pending (24 open, 2 needs-review,
46 untriaged, 177 deferred); the retirement query over the eleven closed
orders matched 48 pending rows across six pages. After `npm run meta`
minted the eight rows this pass's documents nominate (ER6-001, ER6-002 and
the six candidates of the map's 2026-10-10 section), one batch of 38
dispositions applied: 3 allocated to WO-200 (ER6-001, FUP-8f0561e50754114f,
FUP-069dff5d52d98e0d), 6 settled (ER6-002 and the four corrections of
§5.4, WO-197's baselines), 1 declined (WO-187 D041), 2 duplicates, and 26
deferred with the conditions of §5.3 and §3, including the four fired
lifecycle triggers and the nine candidates the 2026-10-07 pass recorded
without register dispositions. The register holds 1,026 rows with 245
pending. Rows the retirement query matched that this pass neither settled
nor touched (the 28 untriaged decision rows of the closed orders, among
them WO-188 D001's Tinkerer observation) keep their status for the next
standard pass; this is not a second queue drain, and their matching an
identifier is not a disposition.

The map carries the recommendation paragraph, the candidates section dated
2026-10-10, the REVIEW-006 disposition table and WO-200's catalog row; the
seven amended orders carry their corrections in their own text and
`Known issues and carry-ins`. The generated index records the closed
orders and the current release; the release table holds 156 tags.

## 7. Goal alignment and cost

The mission contribution is the delivery lane: WO-078, WO-072, WO-076 and
WO-118, the resident-owned loop from a starter. NoOp at entry would have
left a red evidence lane unrecorded, four fired triggers in the register
and seven queued orders citing text that no longer exists. Consume before
produce ruled out paying twice for an undisposed review; the two episodes
cost 838.499 s and USD 5.0290774, the cheapest pair so far (the previous
pairs cost USD 9.32, 13.79 and 13.11), with the same two-finding yield as
REVIEW-005.

Traps named before the material choices: filing a gate-time order would
have been shifting the burden onto the lane the operator asked to move
and seeking the wrong goal (seconds, not hours); the record decided
(§2.1). Success to the successful was answered by comparing WO-200 with
its NoOp and with a boy-scout nomination on WO-078 (declined: the
attribute, the scan filter and the drift record are not adjacent to
WO-078's surfaces). Rule beating: the ER5-002 reevaluation was run as a
listing, not inferred from the register's status counts. Naive
Interventionism: no new gate, agent or ritual; one typed attribute, one
conditional row, one duty sentence. Policy resistance: the one lesson this
pass writes into prose (the sentence count) is beside a screen that already
exists, with its example. Commons and escalation: three workers of twenty,
one order of about one second steady-state cost. Drift: the planning screen
is tightened, not loosened. The outcome matched the plan: three workers,
one order, no activation.

## 8. Document ceilings

Every product document's ceiling is set in `docs/control/doc-ceilings.json`
to its non-exempt bytes measured by `node scripts/docs-check.mjs` after
this pass's write-backs, plus one tenth, with this section as the decision:

| Document | Measured | Ceiling |
| --- | --- | --- |
| 00-vision.md | 28,041 | 30,846 |
| 01-principles.md | 9,462 | 10,409 |
| 02-domain-model.md | 149,450 | 164,395 |
| 03-architecture.md | 180,173 | 198,191 |
| 04-interfaces.md | 60,516 | 66,568 |
| 05-pattern-library.md | 135,436 | 148,980 |
| 06-roadmap.md (non-exempt) | 41,653 | 45,819 |
| 07-execution-guide.md | 186,100 | 204,711 |
| 08-publication-compiler.md | 23,118 | 25,430 |
| 09-audit-resilience-privacy.md | 51,569 | 56,726 |
| 10-ir-compatibility.md | 25,665 | 28,232 |
| 11-proteino.md | 2,058 | 2,264 |
| 11-protino.md | 30,626 | 33,689 |
| 12-workstream-application.md | 18,327 | 20,160 |
| 13-uifa-roles.md | 27,015 | 29,717 |

No order carries a byte bound; WO-200's product 03 sentence lands under
the next pass's reset.

## 9. Validation and independent judgment

The product write-backs passed `npm run publication:check` with both
edition locks current. `node scripts/docs-check.mjs` passed with 15 product
documents and zero failures after the write-backs, and `entropy check`
proves the two new filed pairs in the chain. The plan check refused until
the receipt existed, as the mechanism requires.

[Receipt 042](refutations/2026-10-11-planning-e3afc2052c1d4de4-042.md)
binds committed subject `515794ee`. Its scope is this pass: WO-200 and the
five queued orders whose judged text changed (WO-118, WO-096, WO-098,
WO-095, WO-083) plus the sequence, with 20 unchanged order verdicts carried
by hash; WO-088 and WO-113 changed only in their execution plans and
carry-ins, outside the judged fields. One fresh background `dotln-worker`
received only the canonical prompt (the dispatch JSON: the theses, the goal
card, the six orders, the sequence, the cost table, the output
instructions and the closed schema) and read it with read-only shell
commands. It returned `aligned-with-findings`, twelve known issues and no
hold; every order is `aligned-with-findings`. Dispatch to filing took
888.015 s. The helper committed the pair and passed `plan check`: judged,
committed and workspace subject hashes were equal, with no continuation
update. Every known issue is carried on its order's catalog row in the
map, as product 07 places a receipt's known issue for an order the receipt
finds frozen; the planner's readings of the material ones:

- WO-098's generated unit lines (about 190 bytes each per role skill, some
  2,280 bytes across the two batches against 1,134 bytes of executor
  headroom) can pass while the executor's cold start grows past its
  ceiling. The cold-start route keeps a reviewed rule whole and boards the
  overrun; the row's reopening observation is the directed-load total
  after WO-097 or WO-098 against WO-097's base.
- WO-096's and WO-098's governance column has no harness dimension, so a
  hook-lowered unit counts as mechanism where Codex carries it as role
  text; a per-profile split is the improvement, left to the order that
  first renders the ledger.
- WO-118 may close criterion 1 by waiver while WO-083's typed dependency has
  no guard; WO-118's and WO-083's Cost-line byte figures read beside "no
  byte figure binds" as two rules, where product 07 makes a Cost figure the
  planner's estimate and never a bound; WO-118's gap is dated 2026-09-28
  and lists closed orders as open. These are amendments for the next pass
  that touches those orders, not changes to the judged bytes after the
  receipt.
- WO-083 sits last while its typed prerequisites are met earlier; the
  sequence prose records the reason (the operator's fork on the operator's
  own machine), which the judged list does not carry.
- The critical path's gate V row places R3 after WO-118 while WO-118's gap
  places it after WO-083; the next pass that touches the critical-path
  document reconciles them.

The worker made no repository or Git write and spawned no agent. Three
workers ran in this pass, as planned: the external reviewer, the blinded
entropy refuter and this planning refuter. Completion uses
`npm run test:docs` over this branch after the receipt and these map and
document updates; the handoff and the pull request report its executed
verdict. The final usage observation stays in the ignored session receipt
and the handoff, as the process-cost rule requires.

New inputs beyond the entry set: REVIEW-006 and REFUTATION-007 in full;
the gate rows since 2026-10-01; the control segments of the eleven closed
orders; the fifteen failed reports' opening lines; the decisions D001 and
D010 of WO-107, D012 of WO-105, D023 and D026 of WO-189, D003, D006 and
D008 of WO-190, D021 of WO-198, D002 of WO-197, D007 of WO-074, D041 of
WO-187, D036 of WO-186; `profile.mjs`, `comment-labels.mjs`,
`.gitattributes`, `.prettierignore` and the runner's machinery
declarations; the eight collector hashes; the four phrase surfaces; the
roadmap's pending rungs; receipt 042's twelve findings.
