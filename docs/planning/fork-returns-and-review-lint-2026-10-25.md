# The fork's second block of 2026-10-24 and the review-lint request answered; WO-231 and WO-232 filed on the operator's direction that a release must not break the instance (2026-10-25)

## 1. Subject, authority and provenance

The operator opened `planning: observations and requests from the
DotLn-Enterprise-Starter fork …` at 2026-10-24T23:52Z in Claude Code
(Fable 5.1, effort xhigh, host-selected), as one message holding two pasted
blocks: the request block the operator's instance (the fork, checked out on
this machine as `DotLn-Instance`, origin
`dylanwoodconsulting/DotLn-Enterprise-Starter`) wrote for core in its second
planning pass of 2026-10-24 on taking starter v0.96.1 (its §11, six items,
answering core's second answer block of 2026-10-24), and a request from the
same operator's DotLn-Angular work: the WO-013 FINAL-002 refusal of
`final-review-result pass` by the review-time commit lint. One mid-turn
message at 2026-10-25T00:04Z is operator direction: it is becoming routine
for starter updates to break and block every downstream consumer, and that
is unacceptable. All of it is captured verbatim in ignored intake
(`docs/intake/notes/planning-fork-returns-and-review-lint-2026-10-25.md`,
SHA-256
`40b671e9178bdef0bbdf809e2c442fbdccf1d8d09471290a5ce9675464bf22be`), a
sibling record, never a source to mine.

The pass is a document-only planning dispatch. `npm run plan -- start
fork-returns-and-review-lint` opened
`planning/2026-10-25-fork-returns-and-review-lint` from clean `main` at
`0027d9c1` (pull request #243, WO-224's merge); the branch carries the UTC
date of its creation, and the pass is dated with it. It files two orders,
WO-231 for the fork's blocker and WO-232 for the operator's direction,
places them first, retires two closed orders, answers every item of both
blocks, disposes every register row it read, regenerates the roadmap's
release table, adds one planning screen to product 07, activates nothing,
publishes nothing in any target and never merges. Its refutation is the
pass's independent verification (§14).

Fan-out plan, stated before the first spawn: one refuter as `dotln-worker`
(claude-opus-5-5, xhigh; the dispatch names no Fable worker), no research
workers, no descendants; the 20-admission cap leaves 19. The fork's record
was read by the parent on this machine, read-only: `DotLn-Instance` at
`a7a0762` (its second pass of 2026-10-24, §2 and §11, and its four earlier
update passes of 2026-10-19 to 2026-10-24), its WO-013 worktree
(`docs/final-reviews/WO-013/FINAL-002.md`), and the DotLn-Angular worktree
`DotLn-Angular-wo013` on `wo-013` at `99a30be` with `main` at `2ab4f28`.
This session is the one writer here, on core's planning branch; nothing in
the fork or the target was written. Clean-room screen: the fork is the
operator's own project; this pass copies nothing from its text beyond order
ids, commit ids, counts and generic terms.

Usage at entry: `harness usage <session>` answered "Token measurement
requires an active role and dispatch start", and the prompt hook's observed
facts carried every counter as unknown (counter-unavailable); no figure is
invented here. The final reading is in §12 and the response.

**The operator's mid-turn direction** is read as the aim it states: stop
the pattern in which a starter release leaves the fork repairing its own
records or still blocked, and act on it in this pass rather than file the
two items alone. §6 reads it against the fork's record and files WO-232.

## 2. Entry observations

`plan failures` since receipt 054 (2026-10-24T18:20Z): 0 failed
verifications, 0 failed final reviews, 0 repairs, 2 orders made ready
(WO-230, WO-224), 6 corrections (WO-220's post-close decisions of
2026-10-24), 0 execution amendments, 0 withdrawn amendments, 0 off-ramps, 0
overridden holds; final-review escapes 0 over the 2 reviews in the window
(WO-224, WO-230), 1 over the recent 11 reviews on 10 orders; 6 failed local
gate rows (WO-224 four, WO-230 two), 2 shell diagnostics (this session's
two unquoted patterns, counted against no order), 2 local release closes
(WO-224, WO-230; 2 dry runs), 0 host denials, 4 interventions (2
direction, 2 unclassified; 2 unattributed), 0 long phases, 0 repeated gate
runs; the eight recent closes' tracks: delivery 6, machinery 2. First
verification failed in 3 of the last 8 closed orders (`npm run meta`:
WO-227, WO-229, WO-219 failed; WO-225, WO-220, WO-080, WO-230, WO-224
passed), below the five-of-eight baseline, so the order-size rule is not
reopened. Reader scores: profile `sha256:7f94a73b…` unchanged with 18
unscored releases, `readerDue: false`; no reader run.

**Two closes since the last pass.** WO-230 closed on 2026-10-24 as v0.96.1
(pull request #242) and WO-224 the same day as v0.97.0 (pull request #243);
both have `FinalReviewCompleted` with 0 findings in their segments and sit
in the generated history page; the queue's active section reads none. The
fork took v0.96.1 in its second pass of 2026-10-24 (its pull request #26);
v0.97.0 is a release the fork has not taken.

**The register at entry:** 188 pending rows at revision `c719cc53…`, all
deferred but three: FUP-0126 returned to review by WO-224's product 12
write-back (source revision 22), and WO-224's two boarded follow-ups
untriaged (D017, D018). `followups --touching` over WO-224, WO-230,
`target-commit-lint.mjs`, `work-order-workstream.mjs`, `work-orders.mjs`,
`plan-receipts.mjs`, `plan-continuation.mjs`, `target-worktrees.mjs` and
`resume.mjs` listed eight rows (§8).

**GitHub issues** (product 07 §Operator-opened planning pass item 6): `gh
issue list --state open` returned no open issue on this repository.

**The index before the first commit.** `npm run meta` regenerates the
work-order index, and it ran here while `HEAD` equalled `main`, so the one
`self` member, WO-228, reads base `0027d9c1`, integration `current`, stale
`no`. The pass regenerates nothing after its first commit for the reason
the fork's item 2 names (§4, item 2; §10).

## 3. Reopening observations

`plan conditions` at 2026-10-24T23:59Z (47.3 s; load 4.8 on 16 CPUs; no
lane holders):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 5.82 s | 8 s | no |
| Release table lag | 4 tags | 3 tags | yes; the table is regenerated this pass |
| Latest two closed orders, distinct evidence blob bytes | 81,469 (WO-230) and 74,742 (WO-224) | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 11,658,601 bytes | 10 MB | yes |
| collectSources | 0.86 s | 3 s | no |
| Uncached release listing | 4.21 s | 10 s | no |
| status --all --json | 7,304,611 bytes | 32 MB | no |
| Work-order index | 2.20 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 328.6 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes (unchanged) |
| gate-task target-worktree:file:test-target-worktree-close.mjs | 471.8 s against 434.1 s | 651.2 s | no |
| gate-task vertical:file:test-vertical-judgment.mjs | 449.8 s against 459.1 s | 688.7 s | no |
| coldStartBytes.executor | 29,484 | 24,576 (WO-150-D003) | reopened; the operator's reserved pass |

Three hold, three unknown; 2,755 decision conditions and 1,306 register
rows not evaluated. **The release table** lagged four tags (v0.95.0,
v0.96.0, v0.96.1, v0.97.0); `npm run release -- list --markdown --write`
regenerated the roadmap's registered block from 183 local annotated tags,
as the 2026-10-19, 2026-10-20 and 2026-10-24 passes did. **The evidence
week** grew to 11,658,601 bytes with WO-230 and WO-224 closing; the
two-consecutive-orders condition does not hold (81,469 then 74,742); the
stance on FUP-8a4e201d861208ad and FUP-be1103fbfdd14653 (no ceiling;
pruning not authorized) stands, re-read without a new revision. **The
target-worktree gate-task hold** is the same 611.3 s sample the last three
passes read; no fresh task has run since; carried unexplained on
FUP-e96221b106cd136a. **The cold start** is the operator's reserved pass
(FUP-f1c7a256bec46737), unchanged.

## 4. The fork's six items, decided

Each item is read against the record it names (product 07 §Operator-opened
planning pass item 5). An item is evidence the operator carried, never
operator direction; the operator's own direction is §6.

1. **The Workstream field on a closed, amended order** (blocking: no; the
   fork's update merged green on the withdrawals). Both of the fork's
   questions are answered yes, and both go to WO-232. First, the leading
   `**Workstream:** WS-NNN` field is admitted in the amendment binding:
   `executionAmendmentSource` (`scripts/lib/plan-continuation.mjs` 291 to
   311) normalizes only the release label today, so any other byte of a
   bound order fails `requireMatchedAmendments` (`plan-receipts.mjs` 1414
   to 1447), and the release-classification admission (761 to 785) is the
   precedent for one exact non-criterion change; WO-232 criterion 3 adds
   the field as the second. Second, the workstream check admits a closed
   member without the field with one advisory, and still refuses an open
   one (criterion 4): for a closed order the document is the authority for
   membership and the field changes nothing a gate can act on. The fork's
   route was the only one: `amend-order` requires an order in the current
   judged horizon (1466 to 1470), the judged orders are the sequenced
   entries (`plan-subject.mjs` 361), and a closed order leaves the sequence
   at the next pass, so re-binding was refused by design and the gate's own
   message offered withdrawal (1445). The withdrawals stand as the fork's
   record; the operator's authorizations in WO-011-D004 and WO-012-D004
   remain readable; nothing is asked of the fork, now or after WO-232.
2. **A self member's cells on a branch** (confirmed; blocking: no). The
   observation is `readTargetFacts` reading a `self` member's base as the
   running checkout's `HEAD` (`scripts/work-orders.mjs` 559 to 560) against
   `refs/heads/main`: one commit past `main`, `HEAD` is not `main`'s
   ancestor and the member reads `diverged`, stale `yes`. The intended
   repair is the first of the fork's two readings: the index reads the
   launchpad's `main` for a self member (the rule WO-080-D015 recorded,
   FUP-2811605b8e865d2d, allocated to WO-232 criterion 5 with the branch
   case and its paired control). The lifecycle's refresh on `main` is
   today's mitigation, not the repair: it overwrites the mark only at the
   next close, and a planning or update branch that regenerates after its
   first commit carries the mark into `main` at merge (declined as the
   repair in the map, §10 item 5). Until WO-232 ships, a pass regenerates
   its index before its first commit, while `HEAD` equals `main`, and not
   after; this pass does exactly that (§2).
3. **Confirmations at v0.96.1**: recorded. The board schema
   `packages/console/uifa-board-v1.schema.json` has SHA-256
   `7d20e785c718b4b6…` at the v0.96.1 and v0.97.0 tags (read here), so the
   fork's pin holds through its next update as well; WO-230-D002's
   advisory filter is confirmed in the field (three advisories, all target
   fixture names); `update --finish` at its third use.
4. **The three fixture renames**: recorded; the lint's reading matches
   WO-230's known issue. No ask.
5. **WO-013 and WO-224**: recorded that the fix dispatch is the first field
   use of WO-230's merge-base publish. The fork's next block will carry
   what the publish composed; this pass already knows what followed it:
   `final-review-result pass` was refused by the review-time lint, which
   WO-230 did not move (§5, WO-231; blocking: yes). WO-224 landed on
   2026-10-24 as v0.97.0: `npm run entropy -- review --workstream WS-001`
   reviews the workstream's next distinct repository and `--repository <id>
   [<commit>]` one registered target, with the same frozen copy, pinned
   reviewer, blinded refutation and receipts, and `subject` takes the same
   selectors; its Read before upgrading asks the fork to read, not to edit
   (the clone mapping is read from the running checkout, then the primary
   checkout, then the main worktree; a target subject is the clone's
   fetched base-branch tip or a named commit; two known issues, D017 and
   D018, are deferred in §8). The fork takes v0.97.0 with the release that
   carries WO-231, in one update.
6. **DotLn-Angular**: recorded; no ask.

## 5. The DotLn-Angular fork's request: WO-231

The request is verified on this machine, read-only, in
`DotLn-Angular-wo013` (`wo-013` at `99a30be`): `git rev-list
bc9133e9..99a30be` lists 17 commits, 16 of them reachable from the target's
`main` (`2ab4f28`); two merged subjects measure 78 (`90fa6e8`) and 90
(`2e983e8`) characters; the merge base of `99a30be` and `main` is
`2ab4f28`, one commit below the subject, whose own subject measures 61. In
core at `0027d9c1`, `lintReviewedTargetCommits`
(`scripts/lib/target-commit-lint.mjs` 30 to 36) lints
`subject.baseCommit..subject.commit`, `reviewedTargetSubject`
(`target-worktrees.mjs` 492) binds that base to `state.baseCommit`, and
`resume.mjs` calls the lint at `final-review-result pass` (1768 to 1772)
before any event is appended. WO-230 (v0.96.1) moved the publish's three
reads and its lint of the published commits (`target-publish.mjs` 1469 to
1479) to the described base and left this reader on the activation base.
The refused commits are the target's own merged history; nothing in the
order, the launchpad or the fork can change them, and the fork's FINAL-002
rightly refused to weaken the lint, raise the limit or propose override.

**WO-231** is filed and placed first: the lint lints `<described
base>..<subject>`, where the described base is the merge base of the
subject and the clone's fetched base-branch ref when the activation base is
that merge base's ancestor, and the activation base otherwise; the choice
leaves `describedTargetBase` for one small module both the publish and the
lint call; a refusal names the range and the activation base; an absent ref
keeps today's range and says so; nothing recorded changes. Its paired
control is the fork's shape in the start fixture: a long merged subject on
the target's `main`, the order branch fast-forwarded onto it, one
conforming commit. The fork's request asked for "the target's fetched
main"; the order reads the ref the clone already holds and does not fetch
at review, because a review is a judgment and the publish fetches and lints
the same commits again (declined as a fetch in §10, item 2). **Blocking:
yes.** WO-013 waits for the release that carries WO-231 and the fork's
starter update; its FINAL-002 stands as a truthful fail and its next review
reuses pull request #6; nothing in the fork is core's to change.

## 6. The operator's direction: the pattern in the record, and WO-232

The direction is read against the fork's own passes, on this machine:

| Starter taken | Date | What the fork met | Fixed by |
| --- | --- | --- | --- |
| v0.85.0 | 2026-10-19 | no repair; the preview declared no instance action | — |
| v0.87.0 | 2026-10-20 | the document check failed on `docs/evidence/WO-004/decisions.md: document is not a readable regular file`: the release's `readDecisions` returned decisions `target-records` had moved into DotLn-Angular while the check read the launchpad path; a `CLAUDE.md` conflict; the update stayed a draft (#14) | v0.88.0 (WO-223) |
| v0.88.0 | 2026-10-21 | the v0.87.0 failure gone; after WO-006's records moved the same day, the document check failed on five lines of its close records and `plan check` on `execution amendment decision must be a contained regular file`; the fork's `main` red | v0.94.0 (WO-219 D061) |
| v0.93.0 | 2026-10-23 | the same two failures; the plan-check and document-gate probes exit 1, their medians unknown | v0.94.0 |
| v0.94.0 | 2026-10-24 | green for the first time since 2026-10-21; six new advisories on the kit's own record paths | v0.96.1 (WO-230 criterion 6) |
| v0.96.1 (with v0.95.0 and v0.96.0) | 2026-10-24 | `npm run sync` refused the index on the Workstream field (predicted by the notes and left to the fork); the field tripped two amendment bindings, withdrawn to merge; WO-013, the order the release was filed to unblock, refused again at final review | WO-232; WO-231 |

Four of six update rounds blocked the update, left a gate red or damaged a
record. The common cause is one: every one of those checks met an
instance's accumulated records for the first time in the fork, after the
release, because core's gate runs them against core's own records and fresh
exports only. The gate's instance cases export a fresh kit
(`scripts/test-launchpad-planning.mjs` 222), replay the README's update
procedure from a v0.81.0 export whose seeds are three files (the case at
1865; `scripts/fixtures/legacy-v0.81.0`) and build workstreams in a fresh
pilot (`scripts/test-workstream-pilot.mjs`); none holds a closed order with
a bound amendment, a workstream document over closed members, a record
moved into a target or a target order at a stand-in base. The operator's
word "routine" is supported by the record, and the release notes' Read
before upgrading has been the only guard: it predicted the v0.96.0 refusal
and asked the fork to make the edit that then broke its plan gate.

**WO-232** is filed on the direction and placed second, before WO-204,
because every later release pays for it otherwise. It commits a fixture
instance with history under `scripts/fixtures/instance-with-history/` (a
Git bundle, a shape manifest and a generator run on demand) carrying the
four shapes above; a core-only product suite updates it to the current kit
on an update branch at every fresh gate and runs the kit's own checks in it
(`sync`, `index --check`, `plan check`, the document check, and `index`
from the branch); a refusal fails core's gate naming the check and the
record. It carries the two admissions the fork's item 1 asks for and the
self member's reading its item 2 asks for, so the suite's paired control is
the base failing on exactly those; and it writes the rule into product 07
where releases are: a kit check added or tightened in a release admits the
records the previous release admitted or the release is held, the suite is
that check, and a Read before upgrading line never asks an instance to edit
a closed record by hand. A kit action that edits an instance's records is
declined (§10, item 1): the kit's three action kinds touch configuration
and roots, and an instance's orders are the operator's record. The shape
list grows by one row for each field refusal an instance reports; that is
the next pass's duty under item 5 of the planning-pass procedure.

## 7. A correction of the 2026-10-24 second pass

That pass, run by this same role, filed WO-230 with an Observed gap that
enumerated the publish's reads of the activation base
(`publishTargetDraft` 1111 to 1125, `publishTargetWorktree` 1352 to 1395)
and did not enumerate every reader of the field. `lintReviewedTargetCommits`
reads `subject.baseCommit` at `final-review-result pass` and was left on
the activation base; receipt 054's five known issues did not raise it
either. The evidence is the fork's FINAL-002 of the same day and the grep
this pass ran (`baseCommit` across `scripts/lib/target-*.mjs`,
`github-body.mjs`, `resume.mjs`: every other reader binds a record or
renders the described base beside the activation base; only the lint
describes a change from the wrong base, WO-231's Observed gap). The
correction is WO-231 and one planning screen written into product 07
§Operator-opened planning pass: an order that changes which commit a
lifecycle step computes from names every reader of that field across
`scripts/` and `packages/` in its Observed gap, each kept or moved with its
reason; and a release's Read before upgrading is screened to ask an
instance to read, never to edit a closed record by hand (§9). A mechanical
form of the screen is declined (§10, item 7).

## 8. The register

Read before filing (`followups --touching` with the two closed orders and
the files the two orders name; the pending export):

| Row | Reading | Disposition |
| --- | --- | --- |
| FUP-2811605b8e865d2d (WO-080-D015, the self member's rule) | its home is "the next order that edits `readTargetFacts`"; WO-232 is that order | allocated to WO-232 (criterion 5) |
| FUP-13db0bc45db31d8d (WO-224-D017, the unfetched clone's bare refusal) | correct and early; message only; no instance has met it | deferred to the next order that edits the target subject resolution in `scripts/lib/entropy-review.mjs`; low priority |
| FUP-53a2c609d6815549 (WO-224-D018, a target tracking a top-level `docs` file) | compile-time refusal, no copy left; no such target | deferred to the next order that edits `targetLensBriefs`; low priority |
| FUP-0126 (product 12's candidate, returned to review at source revision 22) | WO-224's write-back added one paragraph on allocating target-named rows; demonstrations and first-screen claims unchanged | deferred again with its reopening condition (WO-083 activates or is amended, or the section's demonstrations or first-screen claims change) |
| FUP-0654a636ac6dfd12, FUP-f12aae31bceb9b69 (WO-230's two deferred rows) | textual matches on WO-230; neither condition occurred | left as they are |
| FUP-048618f9ee2eb349, FUP-00af89947ed9099f, FUP-7f9a27e6ed6c44b3 (resume.mjs, plan-continuation.mjs, work-orders.mjs matches) | textual matches on the files; none names this seam | left as they are |
| FUP-8a4e201d861208ad, FUP-be1103fbfdd14653, FUP-e96221b106cd136a (the holding conditions) | the same readings as the two passes before (§3) | re-read without a new revision |

The seven candidates of §10 were minted by `npm run meta` (195 pending at
revision `a40ad5ba…`) and disposed in one batch
(`followups --apply` from `docs/control/local/followup-request.json`; the
DotLn scratch lane is not a destination the command judges as this
session's); after the batch 187 pending rows at revision `364d0b68…`, all
deferred. The two closed orders' retirement: `followups --touching WO-224
WO-230` listed the four rows above and nothing else.

## 9. Write-backs and document ceilings

One product sentence changes this pass, in product 07 §Operator-opened
planning pass: the screen of §7 ("One more [2026-10-25 pass]: an order that
changes which commit a lifecycle step computes from … names every reader of
that field …; a release's Read before upgrading … asks an instance to read,
never to edit a closed record by hand"). The roadmap's registered release
table is regenerated (06-roadmap.md, exempt). WO-231's and WO-232's product
sentences are their write-back duties (their criteria 5 and 5 to 6), so the
product says what the kit does when the kit does it.

Ceilings are planning's alone (operator direction, 2026-10-07): product 07
measures 258,146 bytes after the edit and its ceiling is set to 283,961;
product 12 measures 27,447 against a 27,463-byte ceiling, 16 bytes of
headroom for WO-232's write-back, and its ceiling is set to 30,192; both
entries cite this section (`docs/control/doc-ceilings.json`). No other
document changed. The map gains two Catalog rows and one candidates section
(seven items, each disposed in §8). The order files read 17,106 (WO-231)
and 26,026 (WO-232) bytes. `npm run work-orders -- index --check` reports
both pages current and resolves both orders' Preflight tokens after one
correction: WO-232's first draft named `work-orders` (the suite is
`work-orders-fixtures`) and `instance-history`, the row it creates, which
the check cannot resolve at the base; the row is named in prose and in step
4 instead.

## 10. NoOps and context-delta checks

Every candidate weighed and not filed is in the map's section "Candidates —
returns from the fork's second block and the review lint (recorded
2026-10-25)" with its evidence and reopening condition, and disposed in the
register (§8): (1) a kit instance action that edits an instance's records;
(2) a fetch of the base branch at final review; (3) admitting every leading
metadata field in the amendment binding; (4) a self member's base from the
control log's activation base; (5) the lifecycle's refresh on `main` as the
repair for a self member's mark; (6) generating the history instance from
the previous release's kit at every gate; (7) a mechanical check that an
order moving a lifecycle field names every reader.

Traps named before the material choices: anchoring on the fork's framing
of item 1 as either/or (both admissions are cheap and answer different
failures; both filed); bundling WO-231 into WO-232 to save a cycle (refused:
the lint is the target lifecycle and a blocker that must ship fast, the
fixture suite is the kit's gate and a larger first verification); filing
WO-232 as a rule in prose with no check (refused: the Read before upgrading
was prose and predicted the v0.96.0 refusal without preventing it); treating
the operator's direction as a reason to widen WO-232 into kit record
migrations (refused: the kit's write authority over an instance's documents
is a product decision the operator has not made; declined with its
reopening condition); and regenerating the index after the first commit
(refused: it would carry WO-228's `diverged` mark into `main`, the fork's
item 2). The NoOp, answering the two blocks and filing nothing, was
weighed: the fork's WO-013 would stay blocked with no route, and the
operator's direction would have no order. The aim of §1 is matched: both
blocks answered, both blockers given an order, the pattern given a check.

## 11. The sequence

WO-230 (v0.96.1) and WO-224 (v0.97.0) leave the list; the generated
history page is their record. WO-231 is first (the fork's blocker), WO-232
second (the operator's direction); nothing else moves relative to its
neighbours. The preamble carries the dated rationale. The sequence file
reads 15,363 bytes.

## 12. Goal alignment and process cost

Critical path: the fork's WO-013 is blocked at final review by a lint core
can fix in one small order; the operator's direction names a pattern four
of six updates show; the pass gives each its order and places them first.
NoOp cost: a blocked fork order with no route and a pattern with no check.
Removal balance: WO-231 removes a wrong base from one reader and adds one
helper; WO-232 adds a suite and a fixture and removes the field's
withdrawal, the closed member's refusal and the self member's false mark.
Failure behavior: both orders fail closed (a refusal names the check and
the record; a missing ref keeps today's range and says so). Process cost:
the session's counters are unavailable at this host (the prompt hook's
observed facts and `harness usage` both say so); the pass spent one refuter
episode (§14), no research worker, and the wall-clock from dispatch
(23:52Z) to the first commit is in the response. The outcome matched the
aim stated in §1.

## 13. The answer block for the forks' next passes

```text
planning: core's answers of 2026-10-25 to the fork's second block of 2026-10-24 and to the DotLn-Angular WO-013 FINAL-002 request

Both blocks are answered by core's third pass of the day (docs/planning/fork-returns-and-review-lint-2026-10-25.md). Two orders are filed, first in core's queue: WO-231 (the final-review lint reads the described base) and WO-232 (a starter release does not break the instance that takes it). The operator's direction during the pass, that it is becoming routine for a starter release to break and block downstream consumers, is read against your record (four of your six updates since 2026-10-19) and is WO-232's reason.

1. Yes to both. The leading **Workstream:** field becomes an admitted non-criterion change in the amendment binding (WO-232 criterion 3), so adding it to a closed amended order costs no withdrawal; and the workstream check admits a closed member without the field with one advisory and still refuses an open one (criterion 4). Your route was the only one: amend-order requires an order in the current judged horizon, which closed orders leave with the sequence, so the gate offered withdrawal by design. Your withdrawals stand as your record; your D004 authorizations stay readable; nothing is asked of you now or after WO-232. Blocking: no.
2. Confirmed, and the repair is the first reading: the index reads the launchpad's main for a self member (WO-080-D015's rule, FUP-2811605b8e865d2d, allocated to WO-232 criterion 5 with a branch case and its paired control). The lifecycle's refresh on main is today's mitigation, not the repair. Until WO-232 ships: regenerate the index before a pass's first commit, while HEAD equals main, and not after; core's pass of 2026-10-25 did exactly that. Blocking: no.
3. Recorded. The board schema's digest is 7d20e785… at v0.96.1 and v0.97.0 (read in core); WO-230-D002 confirmed; update --finish at its third use noted.
4. Recorded. No change.
5. Recorded, and overtaken: your WO-013 FINAL-002 refusal is WO-231, blocking: yes. The lint at final-review-result pass still read the activation base after WO-230 (core's error, recorded in the pass's §7); WO-231 lints only the commits between the subject and its merge base with the clone's fetched base-branch ref, names the range and the activation base, and changes nothing recorded; it does not fetch at review (your worktree integrate fetched; the publish fetches and lints the same commits again). Take the release that carries it and dispatch resume: final review on WO-013 again; FINAL-002 stands as a truthful fail and the review reuses pull request #6. WO-224 landed as v0.97.0 (npm run entropy -- review --workstream WS-001; its Read before upgrading asks you to read, not to edit); you take it in the same update.
6. Recorded.

WO-232, for your reading: core's gate will update a committed fixture instance carrying your record shapes (a closed amended order with a later Workstream field, a workstream over closed self members, records moved into a target, a target order at a stand-in base) to each new kit and run the kit's own checks on it before a release; a check that refuses a record the previous release admitted holds the release. Report any further field refusal in your block; the shape list grows by one row per report.
```

## 14. Validation and independent judgment

Written after the refutation receipt is filed; the response carries the
same facts.
