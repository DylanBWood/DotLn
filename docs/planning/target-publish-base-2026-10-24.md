# The fork's publish blocker: WO-230 filed first, and the fork's seven items answered (2026-10-24, second pass)

## 1. Subject, authority and provenance

The operator opened `planning: quick planning pass +` on 2026-10-24 at
about 17:37Z in Claude Code (Fable 5.1, effort xhigh, host-selected), as one
message holding three things: the request block the operator's instance (the
fork, checked out on this machine as `DotLn-Instance`, origin
`dylanwoodconsulting/DotLn-Enterprise-Starter`) wrote for core in its
planning pass of 2026-10-24 on taking starter v0.94.0 (its §11, seven
items); a quoted paragraph headed "blocker:", which is the recommendation
sentence of the fork's decision WO-013-D008 (route (a): a kit fix that
either admits a base advance or builds the Change table from the draft
commit's parent); and the operator's own line directing that the unblock
order be moved to next in the sequence. One mid-turn message at about
17:45Z asked two questions (why the fork's order sits on the initial commit;
why core never met the defect), answered in §5. All of it is captured
verbatim in ignored intake
(`docs/intake/notes/planning-target-publish-base-2026-10-24.md`, SHA-256
`99666faaed554acceaac9a21f0aa1bc3e50c3a6b7f320b7bf514954cb4856923`), a
sibling record, never a source to mine.

The pass is a document-only planning dispatch. `npm run plan -- start
target-publish-base` opened `planning/2026-10-24-target-publish-base` from
clean `main` at `5173e80a` (pull request #240, WO-080's merge). It files
one order, WO-230, on the operator's direction, places it first, retires
two closed orders, answers the fork's items, disposes every register row it
read, activates nothing, publishes nothing in any target and never merges.
Its refutation is the pass's independent verification (§12).

Fan-out plan, stated before the first spawn: one refuter as
`dotln-worker` (claude-opus-5-5, xhigh; the dispatch names no Fable
worker), no research workers, no descendants; the 20-admission cap leaves
19. The fork's record was read by the parent on this machine, read-only:
the fork checkout at `36b2ae5` (its pull request #25, WO-007's review),
its WO-013 worktree (`docs/evidence/WO-013/decisions.md` D008 and D009,
`docs/final-reviews/WO-013/FINAL-001.md`), and DotLn-Angular at `main`
`2ab4f28`. This session is the one writer here, on core's planning branch;
nothing in the fork or the target was written. Clean-room screen: the fork
is the operator's own project; this pass copies nothing from its text
beyond order ids, commit ids, counts and generic terms.

Usage at entry (`harness usage`, 17:37:41Z, source
claude-transcript-message-usage, scope dispatch): inputTokens 4,
cachedInputTokens 72,538, cacheWriteInputTokens 21,218, outputTokens 656,
totalTokens 94,416; reasoning tokens and cost unknown (counter-unavailable).

**The branch the fork asked about has merged.** `f33cad53` (the operator's
answers on the mining run) and `acd1c94f` (the cost table refresh) are both
reachable from `origin/main` (`git branch -a --contains`); the planning
pull request was #238.

## 2. Entry observations

`plan start` since receipt 053 (05:01Z on 2026-10-24): 0 failed
verifications, 0 failed final reviews, 0 repairs, 2 orders made ready, 6
corrections, 2 execution amendments (WO-080-D014, WO-220-D030), 0 off-ramps,
0 overridden holds; final-review escapes 25 over 11 reviews on 10 orders, 0
unclassed; 2 local release closes; 0 host denials; 4 interventions (1
unclassified); 1 long phase; 1 repeated gate run; the eight recent closes'
tracks delivery 4, machinery 4; coverage local, Codex dispatch-only,
incomplete. The reader-score figures printed (two profiles: 10 releases,
40 of 40 questions found, median position 0.703; 9 releases at profile
`7f94a73b…`, median 0.285); the report's remainder was not captured by
this pass's read, so whether it named a changed profile with three unscored
releases is unknown; no reader run was made and the operator asked for
none.

Canonical status at entry: WO-080 closed on 2026-10-24 (v0.96.0, tag
present), WO-220 closed the same day (v0.95.0, tag present); legal next
actions release-close, next, activate; process health 5 budget breaches,
WO-080 69,318,756 tokens; first verification failed in 4 of the last 8
closed orders (WO-217 fail, WO-226 pass, WO-227 fail, WO-225 pass, WO-229
fail, WO-219 fail, WO-220 pass, WO-080 pass), below the five-of-eight
baseline.

The register at entry: 1,304 rows, 183 pending (1 needs-review, 5
untriaged, 177 deferred). GitHub issues, the external idea intake (product
07 §Operator-opened planning pass item 6): `gh issue list --state open` on
`DylanBWood/DotLn` returns none.

## 3. Reopening observations

`plan conditions` at 17:38Z (48.9 s; load 2.6 on 16 CPUs; no lane
holders):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 5.93 s | 8 s | no |
| Release table lag | 2 tags | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 728,285 (WO-220) and 121,624 (WO-080) | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 11,501,834 bytes | 10 MB | yes |
| collectSources | 0.88 s | 3 s | no |
| Uncached release listing | 4.31 s | 10 s | no |
| status --all --json | 7,157,981 bytes | 32 MB | no |
| Work-order index | 2.25 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 322.1 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes (unchanged) |
| gate-task target-worktree:file:test-target-worktree-close.mjs | 465.6 s against 431.5 s | 647.3 s | no |
| gate-task vertical:file:test-vertical-judgment.mjs | 448.4 s against 463.4 s | 695.0 s | no |
| coldStartBytes.executor | 29,484 | 24,576 (WO-150-D003) | reopened; the operator's reserved pass |

Two hold, three unknown; 2,726 decision conditions and 1,299 register rows
not evaluated. **The evidence week** grew to 11,501,834 bytes with WO-220
and WO-080 closing today; the two-consecutive-orders condition does not
hold (728,285 then 121,624). The stance recorded on FUP-8a4e201d861208ad
and FUP-be1103fbfdd14653 this morning stands unchanged (no ceiling; pruning
not authorized); the rows were re-disposed by the first pass of this day
and this pass re-reads them without adding a revision for the same reading.
**The target-worktree gate-task hold** is the same 611.3 s sample the
2026-10-21 pass and this morning's pass read; no fresh task has run since;
carried unexplained on FUP-e96221b106cd136a, as before. The launchpad
gate-task row did not print in this listing. **The cold start** is the
operator's reserved pass (FUP-f1c7a256bec46737), unchanged. **The
order-size rule** is not reopened: four of eight, below the baseline.

## 4. The fork's seven items, decided

Each item is read against the record it names (product 07 §Operator-opened
planning pass item 5). An item is evidence the operator carried, never
operator direction; the operator's own direction is §5.

1. **The plan-check advisories and the lint's scope** (blocking: no; the
   rename is the fork's own, and the advisory noise is WO-230's). Two
   answers. First, the advisory (`targetOrderPathAdvisories`,
   `scripts/lib/plan-receipts.mjs` 1617 to 1690) is meant for paths a
   publish's Change table will meet, which are target-side paths; it reads
   every backticked path in an open target order's Execution plan and
   cannot tell the kit's own record paths from them, so the eight advisories
   on `docs/evidence/WO-NNN/…` and `docs/final-reviews/WO-NNN/RELEASE-NOTES.md`
   are noise: those files are written in the launchpad and reach the target
   only as moved records at close, which the lint exempts from the
   identifier rule by design (`scripts/lib/target-publish.mjs` 1921 to
   1923; product 07 §Workflow closeout and releases). The fork keeps the
   kit's paths; WO-230 criterion 6 makes the advisory skip them. Second, the
   outward lint reads the branch, the commit messages, the title and the
   body, and the body's generated Change table lists every changed path
   (`composeTargetBody`, `scripts/lib/github-body.mjs` 1125 to 1175), so a
   new file named `segments/WO-221.json` is refused at its first publish
   (`identifier.launchpad`, repaired, never confirmed, WO-227); a path the
   base tree already holds is the target's own vocabulary and exempt, so
   after a first commit under another name a later rename back would be
   judged again as new. The advisory and the lint share one matcher
   (`matchLaunchpadIdentifiers`, `scripts/lib/outward-lint.mjs` 631 to
   636), so the three files the fork's `plan check` named
   (`segments/WO-221.json`, `segments/WO-226.json`,
   `wo-221-derived-v0.json`) will be read the same way by the lint: rename
   them before their first publish. Candidate C7 is answered; no core change
   on the file names.
2. **Confirmations at v0.94.0**: recorded. WO-219-D061 confirmed in the
   field; `update --finish` (WO-226) at its second use.
3. **`plan conditions --slow` prints no rows in an instance** (blocking:
   no): expected. In a kit, `planningConditions` keeps only the rows whose
   every source id is among the instance's own decisions and register rows,
   and the gate-history block runs only when the instance's records carry
   `FUP-e96221b106cd136a` (`scripts/lib/planning-conditions.mjs` 497 to
   534 and 553 to 557, introduced by WO-219 at `b5812c0f` over WO-202's
   `cbd0b4b6`), so an instance whose records carry none of core's ids
   prints an empty table. The gate summary's wall and lane-wait figures and
   the recorded gate row (WO-229) are the instance's readings. An
   instance-side condition table is deferred (§6, FUP-b728f11a70c619db).
4. **The console token, closed on both sides**: recorded. The kit's board
   schema `packages/console/uifa-board-v1.schema.json` has SHA-256
   `7d20e785c718b4b601f45a9c351461955666ea16d49f17ae6d8fde0676629cd3` at
   `main` `5173e80a` (v0.96.0 staged) and at the v0.94.0 tag, so the fork's
   pin holds through its next update.
5. **The six DotLn-Angular orders**: recorded. Read on this machine, the
   fork's WO-008 and WO-013 to WO-018 all declare `dotln-angular @
   bc9133e9…`, the stand-in base; WO-230 therefore covers every one of them
   at publish without a change on the fork's side (§5).
6. **WO-221 and WO-226 re-derived**: core's committed segments at `main`
   read 16 rows (`docs/control/orders/WO-221.jsonl`) and 6 rows
   (`WO-226.jsonl`), the counts the fork reports; the gaps were not
   re-derived here.
7. **Acknowledged**: WO-224 is now second, behind WO-230.

## 5. The blocker, the operator's two questions, and WO-230

**What happened.** The fork's WO-013 is verified (VER-001 pass) and cannot
publish. Its draft publish refused before any push: `target publish
refused: outward lint: pr-body refused: identifier.launchpad`, 26 findings
on 17 Change-table rows, every one a `docs/dotln/` record of the fork's
WO-004 to WO-007 (its D008). The kit composes the Change table and the
base-tree exemption from the order's activation base
(`publishTargetDraft`, `scripts/lib/target-publish.mjs` 1111 to 1125;
`publishTargetWorktree` 1352 to 1395 for the final form). WO-013's
activation base is `bc9133e9`, DotLn-Angular's initial commit, an empty
tree; the draft commit's parent is `2ab4f28` (WO-007's merge, a two-parent
commit on `main`); `git diff --name-only` lists 515 files from the base
and 83 from the parent. The 17 moved records are in neither the base tree
(`existed`) nor the draft's kit paths (`kit`), so the lint's two
exemptions (1915 to 1923) do not reach them, and an identifier is repaired,
never confirmed (WO-227). No role can rebind an activated order's base:
`state.baseCommit` is set only by `WorkOrderActivated`,
`CORRECTABLE_FIELDS` exclude it (`scripts/lib/control.mjs` 25), and the
registry entry must equal it (`scripts/lib/target-worktrees.mjs` 427). The
fork's final review therefore failed truthfully on that one finding and
sent WO-013 to fix (its D009), the operator choosing a core fix taken
through a kit update (route (a)) over withdrawing the order and activating
a successor on `2ab4f28` (route (b)).

**Why the initial commit** (the operator's first question). The fork's own
planning pass of 2026-10-24 wrote it, as a stand-in: its decisions D5 to D10
give each new order "the predecessor's merge commit" as its base, set "by
the pass that follows it". WO-013's predecessor is WO-007; when the fork cut
WO-013 at 01:41 (local) that day, WO-007 had not merged (it merged at
12:23 as `2ab4f28`), and no fork pass ran between the merge and WO-013's
activation, so the stand-in became the activation base. `main` at the time
the orders were cut, `90fa6e8`, would have failed the same way: the table
would then carry all of WO-007's change, its moved records included. The
only correct base did not exist when the order was cut.

**Why core never met it** (the second question). Zero of core's order
files carry a `**Repository:**` line. A core order's base is `main` at the
moment `worktree start` branches, so it is never behind `main` at
activation. Only a registered target order pins a base in its text at
planning time, and the kit's publish diffs from that pinned base instead of
from the branch the pull request will merge into. The fixture already
holds the shape without meeting it: `target-worktree-fixture.mjs` commits
`later.txt` ("not in declared base") on the target's `main` after the
declared base (114 to 127), and no case fast-forwards the order worktree
onto it before publishing.

**WO-230** ([the order](../work-orders/WO-230-target-publish-against-the-base-branch.md))
takes the second half of the fork's route (a) and not the first. The
session publish, draft and final, fetches the target's base branch through
the lane, reads the merge base of the subject and that branch, and when the
activation base is an ancestor of it computes the Change table, the
base-tree exemption and the no-change check from the merge base; the
body's closing sentence names the described base and "activated at base
<activation>, which <described> descends from"; nothing rebinds the
activation base, and when the two are equal every byte is today's. The
merge base is chosen over the draft commit's parent because the parent
equals the merge base in the fork's case but names the previous published
commit when a branch carries one, while the forge's pull request diff is
always from the merge base. A base advance event is declined (§6,
FUP-a3e7ffa08d382a07): the activation base is the subject of
`BaselineWitnessed`, the verification and the registry entry, and the body
renders the baseline sentence at it. The order also makes the plan gate's
path advisory skip an order's own record paths (item 1). Delivery track,
patch, nine steps, about 22,000 bytes.

**Blocking, by the operator's own choice**: WO-013's fix dispatch waits for
the core release that carries WO-230 and the fork's starter update; WO-008
and WO-014 to WO-018 share the base and are covered by the same release.
Interim route in core: none. WO-013 stays verified and unpublished under
its own safe default (its D008); the fork's route (b) remains the fork's
alternative if core's release is slow, and the operator rejected it today.

## 6. The register

Eleven rows disposed in one batch (`docs/control/local/apply-2026-10-24-target-publish-base.json`,
ignored), from revision `25851c22…` after `npm run meta` minted the five
candidates of the map's new section, to revision `220ba0a2…`:

| Row | Source | Disposition |
| --- | --- | --- |
| FUP-0126 | product 12's end-user workflow candidate; needs-review after WO-080's write-back (source revision 21) | deferred: WO-080 delivered the convention, index, board section and pilot; the remaining demonstrations are WO-083's (WO-080-D016); reopen on WO-083's activation or amendment or a change to the section's demonstrations |
| FUP-7f35e50c5d698168 | WO-080-D013, the 1,135.28 s fresh plain gate | deferred: one observation above six minutes; the thirty-day median reads 322.1 s against 360 s; no change allocated; reopen when the median crosses or two more fresh gates exceed six minutes |
| FUP-ed4da61921a5c255 | WO-080-D017, receipt 053's second trigger (the pilot row 56.8 to 57.0 s above the slowest structural task) | deferred with the row above: the declined cost recorded; reopen with the median, a pilot or runner change, or WO-083 |
| FUP-2811605b8e865d2d | WO-080-D015, a self member's checkout-dependent cells | deferred to the next order editing `readTargetFacts` |
| FUP-ec2be6f5cb63ae35 | WO-080-D016, the pilot's shared state | deferred to WO-083 |
| FUP-1330ac1551dff7d1 | WO-220-D032, retained-schema recognition by source text | deferred to the next order editing the probe |
| FUP-a3e7ffa08d382a07 | map candidate 1: a base advance event | declined (§5) |
| FUP-b728f11a70c619db | map candidate 2: an instance-side condition table | deferred (item 3) |
| FUP-0654a636ac6dfd12 | map candidate 3: a `worktree start` advisory on a stale declared base | deferred: the index's stale mark is the signal |
| FUP-f12aae31bceb9b69 | map candidate 4: the episode form's described base | deferred as WO-230's Known issue |
| FUP-2e83abf61d62cc55 | map candidate 5: a planning-time rule for a target order's base | declined for core |

Counts after the apply: 1309 rows (749 settled, 182 allocated,
129 declined, 63 duplicate, 186 deferred), 186 pending, 0
untriaged, 0 needing review, 0 open. Every row the pass read is
disposed; the two week-evidence rows and the gate-task row keep this
morning's reading (§3).

## 7. NoOps and context-delta checks

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition; the second
column is the context-delta check.

| NoOp | Prior decision and context delta | Reason and evidence | Reevaluation | usefulWhen |
| --- | --- | --- | --- | --- |
| A base advance event or a correctable `baseCommit` | prior: no role rebinds a base (the fork's D008 reads the same code); delta: the fork asks for either half of route (a) | the activation base is the baseline's and the verification's subject; WO-230's merge base fixes the table without rewriting what the base means | WO-230's close | an order needs its base itself rebound with a baseline re-walked |
| A second order this pass (a `worktree start` advisory on a stale base) | prior: the operator placed one order; delta: WO-080 shipped the stale mark | the signal exists; one order is what was directed | an instance activates a second order on a stale base after WO-230 | the operator's word |
| Reordering anything but WO-230 | prior: the 2026-10-24 first pass's serial order; delta: the operator placed WO-230 only | anti-oscillation: one category pointed at, one change made | the next pass | the operator's word |
| Re-disposing the two week-evidence rows and the gate-task row | prior: this morning's re-disposal; delta: none in the reading (the same sample; the same stance) | a revision for the same reading adds bytes and no information | the next pass with a fresh sample | a fresh target-worktree task sample or a ceiling authorized |
| A research-worker fan-out | prior: the fan-out rule; delta: none | the fork's record is on this machine and the parent read it directly; 0 of 20 spent | each pass | a record the parent cannot read |
| `plan conditions --slow` | prior: this morning's NoOp; delta: none | the same contended samples; WO-229's attribution awaits the next complete run | the next pass | three passes with contended samples |
| Reopening the order-size rule | prior: the 2026-10-13 pass §12; delta: four of eight | below the baseline | each pass | more than five of eight |
| Answering the fork's item 1 with a lint change | prior: WO-227's identifier refusal and the operator's correction; delta: three target-side file names carry an id | the rule is right: a new path carrying an identifier is refused; the files are the fork's to rename; the advisory noise is WO-230's | WO-230's close | the operator asks for identifiers admitted in a target's new paths |
| Withdrawing the fork's WO-013 for a successor (its route (b)) | prior: the fork's D008 named it; delta: the operator chose (a) during the fork's review | not core's decision; the fork's safe default holds | the operator's word | core's release is slow and the operator says so |
| A reader score this pass | prior: the rule (changed profile with three unscored releases, or the operator asks); delta: the entry report's remainder was not captured | neither trigger was read; the operator asked for none | the next `plan start` | the report names the trigger |

## 8. The sequence

Retired, closed since the first 2026-10-24 revision: WO-220 (v0.95.0) and
WO-080 (v0.96.0). WO-230 is first on the operator's direction; the serial
order is now WO-230, WO-224, WO-204, WO-192, WO-083, WO-207, WO-193, WO-183,
WO-088, WO-091, WO-096 and WO-014, as before relative to one another, with
WO-228 apart in the predecessor track (WS-002). The sequence document gains
one dated paragraph and one entry and reads 13,627 bytes against the
accepted 8,192 overrun (12,154 at this morning's entry); the generated block
was re-minted by `npm run meta`.

## 9. Write-backs and document ceilings

No product sentence changes this pass: product 07's two sentences on the
described base are WO-230's write-back duty (its criterion 7), so the
product says what the kit does when the kit does it. The map gains one
Catalog row and one candidates section (five items, each disposed in §6).
The order file reads 22,058 bytes. The register and the generated index
(`docs/work-orders/README.md`, `HISTORY.md`) were refreshed by `npm run
meta`; `npm run work-orders -- index --check` reports both pages current
and resolves WO-230's Preflight tokens.

## 10. Goal alignment and process cost

Traps named before the material choice, and what was done about each:
**anti-oscillation**: the operator pointed at one category (the unblock
order, next); this pass files that order and changes no other relative
position. **Seeking the wrong goal**: a base advance event would have made
the fork's table right by changing what the recorded base means; declined
for the merge base, which changes only what the table describes.
**Shifting the burden to the intervenor**: the fork's seven items and the
two questions are answered here from the code and the records, not handed
back as questions. **Naive interventionism**: no lint rule, no file rename
in a target, no new lifecycle event; the smallest change that makes the
publish describe what the forge shows. **The NoOp**: WO-013 stays verified
and unpublished; the fork's route (b) costs a new order id and a fresh
verification, and the operator rejected it; the cost of this pass's route
is one core release and one starter update, which the operator accepted in
the fork's review. The outcome matched: one order filed where directed,
first in the queue, every item answered with its reopening condition.

Process cost: one refuter spawned, no research workers, 1 of 20 admissions
used; usage at entry in §1; usage at handoff and the dispatch-to-file
wall-clock are recorded in §12 and in the response. One scratch write went
astray during the pass: a five-line list of register ids written under the
home directory, outside the granted roots, and removed in the next command;
nothing read it and no project content was in it.

## 11. The answer block for the fork's next pass

```text
planning: core's answers of 2026-10-24 (second pass) to the fork's block of 2026-10-24 and to WO-013's blocker

Your branch question: f33cad53 and acd1c94f are on core's main (pull request #238). Confirmed.

The blocker (WO-013-D008 route (a)): filed as WO-230, first in core's queue on the operator's direction (docs/planning/target-publish-base-2026-10-24.md §5). Blocking: WO-013's fix waits for the release that carries WO-230 and your starter update; WO-008 and WO-014 to WO-018 declare the same base bc9133e9 and are covered by the same release. What it does: the session publish (draft and final) fetches the base branch, reads the merge base of the subject and that branch, and when the activation base is an ancestor of it computes the Change table, the base-tree exemption and the no-change check from the merge base; the body names both commits ("activated at base bc9133e9…, which 2ab4f28… descends from"); the activation base stays the base of every record and event, and no event is added. The merge base is chosen over the draft commit's parent because the forge's pull request diff is always from the merge base. A base advance event is declined (the baseline was walked at the activation base). When the release lands: take the update, dispatch resume: fix on WO-013 (your D009 route), integrate, and the draft publish composes 83 rows from 2ab4f28. Until then nothing in core is yours to do; WO-013's safe default stands.

1. The advisory is meant for target-side paths; keep the kit's evidence paths as they are (moved records keep their identifiers by design and the lint exempts them). The eight advisories on docs/evidence and docs/final-reviews paths are noise, fixed in WO-230. The lint reads the branch, the commit messages, the title and the body, and the body's Change table lists every changed path, so a new target file named segments/WO-221.json, segments/WO-226.json or wo-221-derived-v0.json is refused at its first publish (the advisory and the lint share one matcher). Rename those three before their first publish. C7 is answered; no core change on file names.
2. Recorded.
3. Expected: in a kit the condition table keeps only rows whose every source id is in your own records, so it prints empty until you have such rows; the gate summary and the recorded gate row are your readings. An instance-side table is deferred (reopen when you need a threshold on your own gate timing).
4. Recorded; the board schema's digest is unchanged at v0.96.0 (7d20e785…).
5. Recorded. All seven orders share the stand-in base; WO-230 covers them. Your next pass can set a new order's base to the predecessor's actual merge commit when it exists; after WO-230 either way publishes right.
6. Core's segments read 16 and 6 rows; agreed.
7. Recorded. WO-224 is second, behind WO-230.
```

## 12. Validation and independent judgment

Filled after the refutation receipt is filed and the document gate runs
(see the commit that follows the receipt).
