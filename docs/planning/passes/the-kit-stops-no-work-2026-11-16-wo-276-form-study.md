# WO-276 as a form: what "one order in parts" was, what it cost, and how to define it

Record of the [2026-11-16 planning pass](the-kit-stops-no-work-2026-11-16.md): a research worker's
study of WO-276's record, kept as the worker returned it, except that quotation marks were taken
off the passages that name the operator beside a quoted phrase, which the
document gate reads as quoting the operator. It is that
worker's reading of the committed record at `38c333ab2`, not the pass's
judgment; the pass's document says which of its figures the pass checked
and what it decided from them. A statement it marks unverified or as an
estimate is that.

Research for the 2026-11-16 planning pass. Read-only. Every claim cites a
file and line, a decision id (`D0NN` = `WO-276-D0NN` in
`docs/evidence/WO-276/decisions.md`), or a control ordinal
(`docs/control/orders/WO-276.jsonl`, line = ordinal). Line numbers for
standing documents are at `HEAD` `38c333ab2`: the working tree's
`docs/product/07-execution-guide.md` is being edited by the parent session,
so its lines differ.

Labels used below: **[record]** stated by the record; **[computed]** my
arithmetic over recorded times or counts; **[inference]** my reading, with
its basis; **[estimate]** a comparison built from medians; **unknown**
with the source I tried.

## Boundary of what was read

Read: the order's header, frame (lines 1–388), Part R's design and the
execution-plan preface (1464–1530), the closing steps Z1–Z3 (2955–3008),
criteria 1–7 and 126–133, the Preflight, Evidence gate, Known issues frame,
Non-goals and Operator-review assumptions (3741–4065, 4800–4931); every
decision heading (202 records, D001–D202) and the decision text of D001,
D003, D011, D013, D023, D025, D027–D029, D031, D036, D040, D041, D043,
D045, D046, D049, D050, D057, D063, D064, D066, D071, D073, D077, D080,
D083–D085, D098, D099, D107, D113–D122, D124, D130, D134, D136,
D139–D143, D145, D147, D150, D151, D153, D154, D163, D164, D187, D188,
D198; the misread field of all 28 corrections; the handoff's preamble, its
Parts table (290–318), its self-review lines and its Actor and usage
section (2020–2200, 2640–2808); `meta.json`; the critic record's classes
and counts (`critic/criticisms.md` 1–270); the header, cost line and
blocking-finding titles of VER-001 to VER-007, FINAL-001 and FINAL-002, and
FINAL-002's sections to "Follow-ups"; all 42 control events of WO-276
(type, time, metric, ceiling, verdict, finding counts, actor); the
`DispatchBoundAccepted` and `PlanExecutionAmended` rows; the two planning
passes' cited sections; `docs/planning/cost-table.json`;
`docs/planning/sequence.md` 25–75; product 07 and `docs/KIT.md` passages on
parts; the headers of WO-261 to WO-275; the umbrella and `--part` code in
`scripts/lib/dependencies.mjs`, `scripts/work-orders.mjs`,
`scripts/resume.mjs`, `scripts/worktree.mjs`,
`scripts/lib/review-worker.mjs` and
`packages/skeleton/src/loadouts/contributor.ts`; the local
`refs/dotln/checkpoint/WO-276/*` committer times.

Not read: Parts A–Q's design and step text in full (only their headings and
per-part bullets), the 133 criteria beyond those named, the per-part
evidence directories, the verifier/final-review evidence files, the critic
README and charter, `docs/evidence/WO-276/authority/`, any test, and
nothing under `docs/control/local/` or `docs/intake/`. `docs/control/resume.jsonl`
holds no WO-276 event (checked: 0 matches); the release close is evidenced
by the tag and the merge commit, not a control event.

---

## 1. The form as built

### 1.1 The order file's layout

`docs/work-orders/WO-276-the-queue-lands-as-one-order.md`: 4,931 lines,
310,169 bytes. The median order WO-200 to WO-299 is 380 lines (81 files;
**[computed]**), so WO-276 is about 13 times the median.

The file keeps the ordinary order sections and puts a per-part subsection
inside each, headed `*Part X — title (the record WO-NNN).*`. A part's text
is therefore spread over seven sections:

| Section | Lines | What it holds for the form |
| --- | --- | --- |
| Header | 1–138 | Model, Effort, Track, `Review ladder: paired`, Release classification, a Cost line that sums the parts (27–75), Nomination provenance (76–96), Depends on, Recommended placement ("first, and alone", 106), Cites naming each umbrella record as a part's background (109–138) |
| Objective, Observed gap | 140–243 | Whole-order objective; the gap includes "The queue is fifteen cycles" with the record's phase medians (223–229) |
| Design: the frame | 245–388 | Twelve frame items before Part A: one order of eighteen parts run in order (247); what binds is this order's text, carried parts word for word, step and criterion labels, "the base" is the tree the part began on (254–269); machinery first (270–276); a part is reviewed once when done (277–298); a later part repairs what it breaks (299–306); a part's gate is its own, the complete run once (307–316); a part kept light (317–334, added by D027/D028); feedback episode after each judged edit (335–349); put down between parts, `standing.md`, one checkpoint and one decision per part (350–363); one release, one `self-review:` line (364–368); smallest evidence (375–381); bounds are the operator's (382–387) |
| Design: per part | 389–1518 | `*Part A — …*` to `*Part R — …*`, each the part's design items |
| Execution plan | 1519–3008 | Preface: what ends a part (1521–1529); per-part steps labelled `(A1)`…`(R7)`, each with a Check line and a last write-back step; `*After Part R.*` Z1–Z3 (2955–3008) |
| Acceptance criteria | 3009–3740 | One ordered list 1–133, each item carrying its part label, e.g. `126. (R1)`; per part A 17, B 11, C 8, D 8, E 5, F 7, G 6, H 9, I 5, J 7, K 7, L 6, M 5, N 8, O 4, P 6, Q 6, R 7, Z 1 **[computed]** |
| Preflight | 3741–3945 | First paragraph = the union of all 36 suites (the lifecycle reads only the first paragraph, 3745–3760 and known issue 4806–4809); then one bullet per part |
| Evidence gate | 3946–4014 | One bullet per part, each a directory `docs/evidence/WO-276/part-x/` |
| Write-back duty | 4015 | "as listed in each part's write-back step" |
| Known issues | 4017–4813 | Frame items (4019–4059, e.g. the first verification "is likely to fail", 4032–4036; "a part boundary is where this order can be put down", 4039–4041), then `*Part A.*`…`*Part R.*` |
| Non-goals | 4814–4913 | Frame (no parallel worktrees; no release, verification or final review for a part, 4814–4815), then one bullet per part |
| Operator-review assumptions | 4915–4931 | Includes "a part is reviewed and checkpointed when it ends and the order is reviewed nowhere as a whole" (4925–4926) |

What one part carries: design items, numbered steps with Check lines and a
final write-back step naming the kit guide and/or product 07 sections it
replaces, labelled criteria, a Preflight bullet, an evidence directory, a
known-issues group and a non-goals bullet. Step counts per part: A 17, B 12,
C 8, D 7, E 5, F 8, G 6, H 7, I 5, J 7, K 6, L 5, M 4, N 7, O 4, P 6, Q 7,
R 7, Z 3 **[computed]** from labels in 1519–3008.

Parts C to Q were carried from the fifteen records by a script, word for
word, with references rewritten; each record's own gate criterion replaced
by the order's one (2026-11-10 pass, lines 393–399). Parts A, B and R were
new text (390–392).

### 1.2 Umbrella records and how the commands treat them

Each of WO-261 to WO-275 (219–405 lines each) opens with:

- `**Umbrella record (2026-11-10):** superseded whole by WO-276, which carries this order's obligations as its Part X …; not activatable.` and says the text below is background, "what binds is WO-276's text" (e.g. WO-261 lines 3–9);
- a typed dependency block `{"workOrderId":"WO-276","relation":"superseded","reason":"… as its Part I.","by":"WO-276"}` (WO-261 lines 10–19).

Code (all pre-existing, WO-190):

- `scripts/lib/dependencies.mjs` 64–89: an umbrella is the exact label in the leading header plus at least one typed `superseded` entry; successors are the entries' `by` values; a label without entries, or entries without the label, is not an umbrella and the order is listed as open work.
- `scripts/work-orders.mjs` 447–471: an umbrella with no lifecycle is phase `superseded`, section **Superseded**; recorded control state wins. Line 1272: the index's Sources and limits sentence.
- `scripts/resume.mjs` 2037–2043: `activate` refuses an umbrella, naming its successors.
- `scripts/worktree.mjs` 1419–1422: worktree start refuses it the same way.

Nothing in code reads which **part** an umbrella maps to: the letter lives
only in prose and in the typed entry's free-text `reason`. Register rows
were re-allocated to WO-276 naming their part by the planning pass (2026-11-10
pass, 425–426).

### 1.3 A part's ladder, checkpoints and write-backs, as run

- **Ladder.** The frame (277–298) and the role text say a part's ladder runs when its steps and write-backs are complete, round one with `--since` the previous part's checkpoint, up to three rounds within a part (`contributor.ts` 324; product 07 3887–3893). The operator changed this on the first day: a part is kept light, one combined review launch, and the full ladder and complete run are paid once at the end (D027, D028; frame 317–334). Then the operator added clock cadences: a whole-change reviewer every 30 minutes and a critic every hour (D040), an attacker of the part in hand every 30 minutes (D063), an attacker over each closed part once (D064), intervals slowed to 45 and 75 minutes (D071), and the whole-change reviewer taken off the gate's critical path (D107). The handoff's Parts table (290–318) shows what each part actually got: A and B one combined launch; C–H none of their own (rolling reviews fell in them); I–R one to six attack passes each.
- **`--part`.** The review helper gained `--part <letter>` (D023) and `--part <letter>-<letter>` (D040); the brief tells a worker to judge the frame and that part's text and that other parts' criteria are not due (`scripts/lib/review-worker.mjs` 85, 115–127, 746–754). D023 states why: the order was 302,776 bytes against the brief's 200,000-byte bound for one document, so a reviewer got a pointer.
- **Checkpoints.** Step A16 added `npm run resume -- checkpoint`, a recovery ref with no control event (D020; product 07 1597–1613). The order made 56 checkpoints to its closing and 102 in all (`refs/dotln/checkpoint/WO-276/1`…`/102`, local refs **[record]**). Each part's begin and end checkpoint is in the handoff's Parts table.
- **Handoff per part.** On the operator's request the handoff gained each part's row and its criteria lines at the part's end, beside the standing file (D013).
- **Write-backs.** 18 write-back steps; 16 edit the kit guide and 15 edit product 07 **[computed]** from the step text.
- **Feedback episodes.** Nine live self-host episodes (`feedback-001` to `feedback-009`; handoff names editions up to 009).

### 1.4 What "one verification" and "one final review" read

- VER-001: the whole candidate, one worker for a shell comparison, the rest by the verifier; it consumed the executor's complete row (VER-001 lines 1–9, 67–75; D124).
- VER-002: the operator asked for thoroughness and all 20 workers: 17 launches and 3 continuations (D130; VER-002 lines 1–13).
- VER-003 to VER-007: the repair's diff plus retained evidence; 0–2 workers (report headers).
- FINAL-001: the whole order, VER-001 to VER-005, the handoff's parts, every decision heading; the diff in **sixteen batches**, one worker each "with its part's design, steps, criteria, known issues and non-goals", then four workers for what those sixteen declared unread; 20 of 20 worker uses (FINAL-001 lines 7–24; D154; D164: 123 of the change's 372 code and configuration files were named by none of the sixteen reports).
- FINAL-002: the repair since FINAL-001 (71 paths) with six workers; it relied on FINAL-001's twenty workers for the rest (FINAL-002 lines 7–30).

### 1.5 Where the rules about parts live today

| Rule | Where it is written today |
| --- | --- |
| A part's ladder; `--since` previous checkpoint; three rounds within a part; a part's own complete run is evidence | product 07 3887–3893; `contributor.ts` 324 (executor root) |
| `--part <letter>` / range | product 07 3992, 4012–4018; `docs/KIT.md` 2006; `review-worker.mjs` |
| A checkpoint at each part's end, named by the standing file | product 07 1613, 4616–4618 |
| The standing file (any unfinished order) | product 07 4345–4356 (from Part P, D098) |
| Order size: one subsystem one order; WO-276 named as the operator's exception; reopen conditions | `sequence.md` 35–47 |
| Paired rounds expected from WO-276's parts | `sequence.md` 61–69 |
| Umbrella records | index Sources and limits (`work-orders.mjs` 1272); WO-190 code |
| A part kept light; full ladder once at the end; one review launch | **only WO-276's amended frame** (317–334; D027, D028) |
| "The base" per part; labels; criteria judged at a part's checkpoint; one release; one `self-review:` line; Preflight union paragraph; per-part evidence dirs; feedback episode per judged edit | **only WO-276's frame and known issues** |

Conflict a planner meets today **[record]**: product 07 3887–3893 and the
executor root say a part runs its own ladder of up to three rounds; WO-276's
practice (D027/D028) was one light launch per part and the full ladder at
the end. No standing document reconciles the two.

### 1.6 What a planner must copy by hand today

No document or check defines these; the 2026-11-10 pass checked several by
"a script in session scratch" (pass lines 629–637):

1. The frame's items (WO-276 245–388), including the light-part rule.
2. The labelling: `(X<n>)` on steps and criteria, one criteria list numbered 1..N with the label beside each, "criterion X3 is the one carrying that label" (254–264).
3. The per-part subsection heading in Design, Execution plan, Known issues and the per-part bullets in Preflight, Evidence gate and Non-goals.
4. The Preflight first paragraph as the union of every part's suites, because the lifecycle stops at the first blank line (4806–4809). The plan check's `preflight advisory` (Part R, criterion 130) now names suites an order's files select and its field omits; nothing checks that a part's bullet and the union agree.
5. The umbrella text and its prose pointer "as its Part X"; the code only needs the label and typed entry.
6. Register rows re-allocated to the parent, each naming its part.
7. The handoff's "one line per criterion with the part's label" (4037–4038).
8. Which criteria are judged at a part's checkpoint rather than the final tree (266–269, 303–306).

---

## 2. What it cost and delivered

### 2.1 Calendar and phases [record; durations computed from control events]

| Measure | Value | Source |
| --- | --- | --- |
| Activation | 2026-11-10T16:43:10Z | ordinal 1 |
| Implementation-ready | 2026-11-13T00:48:53Z, 56 h 06 min after activation (includes a 3 h 40 min pause, D099) | ordinal 8 |
| FINAL-002 pass | 2026-11-14T19:07:59Z | ordinal 42 |
| Merge / tag v1.0.0 | `ed66a822c` 19:28:33Z; tag `e0dcf0967` 19:29:46Z | `git log`, `git tag` |
| Activation to tag | **98 h 47 min** (4 days 2 h 47 min) | [computed] |
| Implementation-ready to final pass | 42 h 19 min (43% of the calendar) | [computed] |
| Sum of phase spans | 84 h 28 min: implementation 56 h 06; six repairs 22 h 02 (1 h 29, 3 h 19, 5 h 35, 1 h 58, 8 h 06, 1 h 35); seven verifications 2 h 55; two final reviews 3 h 24 | [computed] |
| Time between phases (waiting for the next dispatch) | 13 h 57 min; largest gaps 6 h 16 (after repair of VER-002) and 4 h 29 (after repair of FINAL-001) | [computed] |
| Meter `elapsedMs` | 299,453,449 ms (83 h 11 min); definition not checked, differs from my phase sum by about 1 h | `meta.json` |
| Starter refresh receipt for v1.0.0 | committed 2026-11-15 (`9648dac82`) | `git log` |

Implementation by part, from checkpoint ref times mapped through the
handoff's Parts table **[computed]**: A 4 h 06; B 2 h 45; C 0 h 52; D
6 h 52; E 0 h 55; F 0 h 55; G 0 h 16; H 0 h 51; I 3 h 07; J 3 h 49; K
1 h 49; J's rebuilt half 2 h 27; mid-order ladder, complete runs and first
pause 5 h 18; L 0 h 46; M 1 h 29; N 2 h 37; O 2 h 10; P 2 h 04 (after the
second pause); Q 2 h 19; R 2 h 21; closing Z1–Z3 about 3 h 35.

### 2.2 Sessions and dispatches

- Lifecycle dispatches: 1 activation; 3 implementation sessions (two operator-requested pauses: D083 at 00:16 on 2026-11-12, found it too slow; a pausing point at 10:23 the same day, D096/D098); 7 verifications; 6 repairs; 2 final reviews; 1 release close = **19** **[record/computed]**.
- Meter: executor 9 dispatches, verifier 15 dispatches over 7 attempts, reviewer 2 (`meta.json` usageByRole). Why 15 verifier dispatches for 7 reports: unknown (not read further).
- Tokens: 5,116,045,092 for the order at 19:02Z on 2026-11-14 (cached input dominant; cost unknown) (`meta.json`).

### 2.3 Complete review runs

The Cost line planned three (lines 33–35). The record numbers **24**, plus
one unnumbered start stopped after 18 seconds (handoff 2779–2781; D145).

| # | When | Result | Cause in a few words | Source |
| --- | --- | --- | --- | --- |
| 1 | 11-11 ~00:59 | stopped at 15 min | three launchpad tasks failed on one shared fixture | D045 |
| 2 | 01:40–02:38 | failed 3 suites | two pre-baseline repairs broke other consumers; a fixture list lacked a file Part B added | D046 |
| 3 | to 03:20 | **pass** (Part D control, 54 min) | | D050, handoff 315 |
| 4 | 05:11–05:59 | failed 1 | host-guard race in the runner, outside Part D | D049 |
| 5 | 06:17–06:59 | **pass** (Part D after, 42 min) | | D050 |
| 6 | 11-12 00:01–00:11 | stopped | operator paused the session as too slow; 2 leftovers of Part J's rebuild | D083 |
| 7 | 00:28–01:17 | failed 4 | Part J rebuild leftovers; stale rule table; a timing baseline; an unreproduced build | D084 |
| 8 | 01:58–02:48 | failed 1 | a case read the order's evidence under the product read guard | D084 |
| 9 | 22:33–23:23 | failed 3 | expectations Parts M and Q left stale in suites they did not run | D120 |
| 10 | 23:30–00:26 | **pass** (closing) | | D121 |
| 11 | 11-13 02:05–02:55 | **pass** (repair of VER-001) | | handoff 298 |
| 12 | 06:31, 25 s | failed (preflight) | a repair's comment quoted a document root | D134 |
| 13 | 06:32–07:14 | **pass** | | D134 |
| 14 | 15:29–16:07 | failed 2 (7 unstarted, no `--keep-going`) | host memory pressure (file-events daemon 11–16 GB); a reader cache for the wrong directory | D139 |
| 15 | 16:28–17:16 | stopped | operator's direction: machine memory | D141 |
| 16 | 8 min | stopped by executor | an edit to a file the run was judging | D143 |
| 17 | 18:43–19:28 | **pass** | | D145 |
| 18 | to 20:53 | failed 1, then stopped | five-second discovery timeout, not reproduced | D150 |
| 19 | 20:56–21:53 | **pass** | | D151 |
| 20 | 11-14 05:54–06:04 | failed 1 (36 skipped) | a seed case pinned the old three-file terms command | D187 |
| 21 | 06:06–07:00 | failed | an integration fixture's clone of the order as filed | D187 |
| 22 | to ~07:55 | **pass**; then the document gate failed | a lineage case asked for a span the parse no longer forms | D187, D188 |
| 23 | 08:12–08:58 | **pass** | | D188 |
| 24 | 15:13–15:57 | **pass** (repair of VER-006) | | handoff 294 |

Totals **[computed]**: 10 passed, 10 ended on a failure (2, 4, 7, 8, 9,
12, 14, 18, 20, 21), 4 stopped before a result (1, 6, 15, 16), plus the
18-second start. Known durations of failed or stopped runs sum to about
7 h 20 min (runs 16 and 18 partly unknown). All gate time for the order:
14 h 01 min (`gateMs` 50,479,687, `meta.json`). Document-gate failures
besides: D122 (a decision renamed in place broke a planning binding), D188.
Before any of these, Part A's Preflight was run as a serial battery of
single-suite gates, 71 minutes, which the operator corrected (D025).

### 2.4 Verifications, repairs and final reviews

| Report | Verdict | Blocking | What failed / note | Source |
| --- | --- | --- | --- | --- |
| VER-001 | fail | 2 | comment check (moved by Part B) skipped `.jsx`/`.tsx`; a regex read as a comment. Records contradictions in criteria 51, 121, 123 (ordinals 10–12) | VER-001 1–13; D124 |
| VER-002 | fail | 11 (+7 follow-ups) | criteria 17 (A17), 18 (B1), 21 (B4), 25 (B8), 64, 65 (H2, H3), 101 (M6), 103 (N2), 115 (P2), 127 (R2), and one regression (execution-record fields); 20 workers on the operator's request | VER-002 1–13; D130 |
| VER-003 | fail | 3 | 17 (a regression the VER-002 repair made), 18, 25 | D136 |
| VER-004 | fail | 1 | the Codex background cleanup, added during the VER-003 repair (D143), selected a live CLI | D147 |
| VER-005 | pass | 0 | | D153 |
| FINAL-001 | fail | 9 (+62 follow-ups) | criteria 25, 28, 98 unmet; six regressions (terms search cost, header field after a dollar figure, mission check launcher, cards read under a lock, walkthrough option, verification ran instance code first) and F52: the criteria reader returned 78 of this order's 133 criteria. `findingCounts` escape 71 | FINAL-001 1–70; ordinal 31; D154, D164 |
| VER-006 | fail | 1 | F52's class still open (a skipped criterion number) | VER-006 1–14 |
| VER-007 | pass | 0 | | VER-007 |
| FINAL-002 | pass | 0 | 18 findings: 17 follow-ups, 1 operator decision (the block-opener class in about 30 moved readers). Escape 18 | FINAL-002 1–60; ordinal 42; D198, D199 |

Repairs **[record]**: six, at ordinals 14, 18, 22, 26, 32, 37: VER-001
(comment check), VER-002 (ten in code plus the reader-comparison audit,
D131, D132), VER-003 (snapshot, screen, comparisons; and added the Codex
cleanup, D137, D143), VER-004 (cleanup roles, D148), FINAL-001 (nine
findings, a full three-round ladder of Opus workers on the operator's
direction, D165–D188), VER-006 (criteria reader, D192–D194).

Escapes **[record]**: 89 over the two final reviews (71 + 18) (ordinals
31, 42; 2026-11-14 pass line 247). Classes: FINAL-001's nine blocking are
3 unmet criteria + 6 regressions against main; FINAL-002's 18 are
follow-ups, one routed to the operator.

**[inference]** Of the 27 blocking findings in the six failed reports,
about 15 sit in readers Part B moved (VER-001 2/2; VER-002 F1, F5, F6, F10;
VER-003 two of three; FINAL-001 F3–F7 and F52; VER-006 1/1), by the finding
titles and the criterion-to-part map in §1.1. The one class FINAL-002 put
to the operator is also Part B's.

### 2.5 Operator corrections, directions, acceptances

- Journal counts: **57 operator corrections** (implementation 22, verification 14, repair 19, final review 2) and **3 directions** (`meta.json`; cost table trap `shifting-the-burden-to-the-intervenor`). The four orders before it had 3, 3, 3 and 8 corrections (WO-243, WO-258, WO-259, WO-260).
- Recorded correction decisions: 28 (executor 10, verifiers 11, repairs 7) **[computed]** from `kind: correction`.
- Plan amendments to the order during execution: 9 `PlanExecutionAmended` rows (`docs/control/plan-refutations.jsonl`): criteria formatting (D011), the dialog refusal struck (D012), the light part (D027), the full ladder at the end (D028), the release renamed v1.0.0 (D073), Part J's worker models three times (D077, D078, D080 era), and one re-binding of D080 (D122).
- Decisions whose dispatch names an operator message: 35; D083, D118, D119 and D198 also record operator words. Grouped **[inference from the dispatch and decision text]**:
  - Pace of a part and gates (D025, D027, D028, D029): at least eight messages in the first four hours.
  - Reviewers, critics and cadence (D004, D040, D063, D064, D071, D077's mid-order ladder, D100, D101, D107, D110, D111, D113, D115, D165, D166): 15 decisions.
  - Bounds and caps (D003, D040, D041, D063, D099, D165).
  - Scope or design changed mid-order (D011, D012, D013, D031 the port of WO-275's worktree, D036 defects beside the work fixed in the order, D073 the release named v1.0.0, D077 Part J's worker half rebuilt after it closed).
  - Host processes and resources (D119 a Codex server left running, D140–D143 the file-events daemon, D151 the discovery timeout deferred).
  - Pauses (D083 and the 10:23 pausing point).
- Bound and cap acceptances: **7** (ordinals 2–7, 33): wall clock 24 → 48 → 72 → 96 h; cap 100, then 220 (the operator's figure was 200, D041), then 50 in the FINAL-001 repair. The verifier's and reviewer's dispatches used their default cap of 20 (VER-002, FINAL-001 used all 20).

### 2.6 Review rounds, findings per part, critics

- Execution self-review: found 348; fixed 309; recorded 39; **104 rounds** (2 combined launches, 53 rolling whole-change reviews, 8 attack reviews of closed parts, 6+5+2+1+2+2+3+2+2+4 attack passes on Parts I–R, the mid-order ladder's 3 rounds, the closing round of 4); **no paired round** (handoff 2172; D118).
- Repairs' reviews: found 6, 6, 7, 0, 21, 7 (handoff 2022–2153).
- Per part (handoff 292–318): A 3 found; B 6; C–H none of their own (rolling reviews in their windows found 3–7 on earlier parts); I 37 on the part + 54 on Parts A–H from eight attackers (42 repaired); J 26 + 11 on the rebuilt half; K 16; L 7; M 15; N 11; O 0 on the part but 18 on Part E's title rule; P 11; Q 11; R 14.
- Critics: **43 launched**, 41 reported, 152 points, 146 accepted, 2 in part, 4 not stated; 143 conduct, 9 implementation; critics 1–29 briefed by the executor, 30–43 under a fixed charter (`critic/criticisms.md` 1–20, 218–268; D101, D113).
- Worker uses **[computed sum of per-report counts]**: implementation 172 (handoff 2731); repairs about 29; verifications 23; final reviews 26; about 250 in all.

### 2.7 Against fifteen separate orders [estimate]

No committed document states medians from `npm run plan -- failures`
(searched the planning documents for "median"); "plan failures medians":
**unknown**. The order's own Observed gap gives the record's medians:
implementation 1 h 39, repair 0 h 49, verification 0 h 18, final review
0 h 27, complete run 47–52 min (lines 223–229). The cost table gives 5 of
the last 8 first verifications failed. Release close median: unknown.
Calendar median activation-to-release: unknown (not stated).

| | WO-276 | 15 orders (estimate) |
| --- | --- | --- |
| Activations / release closes | 1 / 1 | 15 / 15 |
| Verifications | 7 | 15 + about 9 re-verifications at 5/8 = about 24 |
| Final reviews | 2 | at least 15 |
| Repairs | 6 | about 9 (15 × 5/8) |
| Lifecycle dispatches the operator starts | 19 | about 79 (15 × 4 + 9 × 2) |
| Complete runs | 24 numbered | at least 24 (each execution and each repair starts one, product 07 4359–4362) |
| Phase time | 84 h 28 | 46 h 28 at the all-order medians; 105 h 43 using the 2026-11-10 pass's Claude Opus 5.5 max median implementation of 5 h 36 (pass line 347) |
| Gate time | 14 h 01 | about 20 h (24 × 50 min) |

Reading **[inference]**: the form saved operator dispatches and release
cycles (about a quarter of the dispatches) but not machine or phase time;
84 h of phase time sits inside the estimate's range. A measured comparator
for one queued order exists: WO-275 alone ran 8 h 52 min and five complete
runs without reaching its handoff (lines 67–72).

---

## 3. What it did well (seven)

1. **One cycle for the instance and the operator.** One activation, one release (v1.0.0), one release close and one starter refresh for fifteen queued orders plus repairs (ordinals 1, 42; tag; `9648dac82`); 19 lifecycle dispatches against about 79 **[estimate]**. The merge's title records the aim met: an instance takes all of it in one update (`ed66a822c`).
2. **The umbrella route absorbed fifteen filed orders with no code change and kept their texts.** Label plus typed entry; the index lists them under Superseded; activation and worktree start refuse them (§1.2 code). The pass declined deleting them because each file is its part's background (2026-11-10 pass NoOp 10, lines 491–493); the 2026-11-14 pass found them "superseded by it and settled" (line 264).
3. **Infrastructure first paid back inside the order.** Part D's convoy cut the complete run from 54 to 42 minutes, 22.7% (D050); every later run (19 of 24) ran on it, and `sequence.md` 44–45 records 42.0 min after Part D. Part A's rule that a failed run judges its own repair and the next run keeps going (frame 438–446) was used inside the order: run 7 named four failing suites at once (D084), run 9 three (D120), none took a review round.
4. **Light parts moved fast once adopted.** After D027, Parts E, F, G and H closed in about 3 hours together (checkpoints 16 → 21, 08:05–11:02Z on 2026-11-11), Part C in 52 minutes **[computed]**; Part G needed no suite of its own because its code came with Part B's port (D057; handoff 312).
5. **Reading across parts found cross-part defects that a part's own checks missed.** Eight attackers over closed Parts A–H returned 54 findings, 42 repaired with cases (D066); rolling reviews found ten findings on Parts A–D after Part D (D051) and others in closed parts (D080, D092). FINAL-001's method, one reader per part then readers for what those left unread (D164), found everything that remained at once: FINAL-002 passed with no blocking finding.
6. **Put down and resumed cleanly twice.** Both operator-requested pauses resumed from the standing file on a byte-identical checkpoint: checkpoint 35 (D084) and checkpoint 45, no path differed and none was untracked (D098). 102 recovery refs; no lost work is recorded.
7. **A per-part handoff gave verification judged lines to start from.** Rows and criteria lines written at each part's end (D013; handoff 290–318) let every verifier carry forward 130 met judgments; the three contradictions found at the first verification (51, 121, 123) stood to the end without rework (ordinals 10–12; VER-005 to VER-007 headers).

## 4. What it did badly (ten, by operator time lost)

Ordering is my judgment from the hours and interventions each item cost
in the record.

1. **One verification and one final review could not hold the whole change, and repairs made new defects.** 42 h 19 min from implementation-ready to the final pass; 5 failed verifications and 1 failed final review; 6 repairs (22 h 02) and 13 h 57 waiting between phases **[computed]**. VER-001 (one worker) found 2; VER-002 (20 workers, on the operator's request) found 11 more blocking (D130); FINAL-001 (20 workers) found 9 more blocking and 62 follow-ups after the fourth repair, with 123 of 372 files unread by its first sixteen readers (D164); the operator asked the review to find everything in one pass (D164). Repairs introduced the next failure: VER-003's regression came from the VER-002 repair (D136); VER-004's from cleanup code the VER-003 repair added (D143, D147); VER-006 from a class the FINAL-001 repair left open. Cause stated before activation: receipt 068 known issue (5), "one verification judges 133 criteria and a failure in any part holds every part" (map line 1099).
2. **Nothing shipped until everything shipped.** The terms fix that stopped WO-275 and the instance (Part A) reached the instance only with the v1.0.0 tag, 98 h 47 min after activation; the pass told the instance to keep its workarounds "until the release" (2026-11-10 pass, answers 1, 6). Part B's failures held every part. Today one order publishes once (`release close WO-NNN`, `scripts/release.mjs` 4453; the starter refresh lands core's tag), and the 2026-11-14 pass split WO-277 out so the page "ships alone and first" for that reason (lines 528–532).
3. **The operator had to steer the execution's pace, reviews and critics.** 57 journal corrections against 3–8 for the four orders before (cost table); 35 decisions answer operator messages; 9 plan amendments; two pauses. The frame as filed asked for a full gate and ladder per part (277–316); the operator replaced it within four hours (D025–D029). The review machinery was designed on the fly: clock cadences (D040, D063, D064), slowed (D071), unblocked from gates (D107), the critic's brief corrected twice (D100, D101), a mid-order ladder (D080–D082), a closing ladder stopped on a misreading (D118). The `sequence.md` reviews rule expected paired rounds from the parts; the order recorded none (D118).
4. **Part B should have been its own order.** It was not one of the fifteen; it was the reader consolidation added on the operator's condition if it is sound (2026-11-10 pass message 12). About 15 of 27 blocking findings and the one class put to the operator sit in readers it moved **[inference, §2.4]**; its own reader read this order's criteria list short (78 of 133; D011 fixed the rendering, F52 the reader). It also brought in WO-275's worktree (D031) although the known issues said nothing would be taken from that tree (4019–4025).
5. **Complete runs failed or were stopped fourteen times.** 24 numbered runs against 3 planned; 10 passed (§2.3); about 7 h 20 min of failed or stopped runs **[computed]**. Causes the record names: parts staling other parts' pinned expectations in suites they did not run (D120, D084, D187), repairs breaking a second consumer (D046), the host (D049, D139, D141, D150), and the operator stopping runs (D083, D141).
6. **Bounds and forecasts were renegotiated repeatedly.** Seven acceptances (24 → 48 → 72 → 96 h; cap 100, 220, 50); the cap was recorded at 220 on the executor's arithmetic against the operator's 200 (D041). The hours forecast drew 16 accepted critic points, the second-largest class (`criticisms.md` class 2).
7. **The record of where the work stood went stale.** The largest critic class: 21 accepted points of a standing file, handoff or checkpoint stale or self-contradicting (`criticisms.md` class 1); e.g. a superseded sequence left beside the current one (D085 point 4), a fixture placed in the wrong file by the handover (D084), a decision edited in place that broke a planning binding (D122). D001 named the trap in advance (context compaction across eighteen parts). How many compactions occurred: unknown (not recorded in the files read).
8. **Parts interfered.** Later parts staled earlier parts' tests: Parts M and Q left three suites' expectations stale, found only in run 9 (D120); Part J's rebuild after it closed (D077, three amendments) left leftovers in fixtures other suites copy (D084). Part E's title rule took findings from later parts' attackers (18 during Part O; D094–D097) until its extension was "ended for this order" (D097). Comparison criteria could be judged only at a part's checkpoint, since later parts changed the same bytes (frame 266–269).
9. **The order's size was a cost of its own.** 310,169 bytes, 13 times the median order; over the review brief's 200,000-byte bound, so workers got a pointer until `--part` was added (D023); the criteria list rendered broken after 78 (D011); `decisions.md` is 1.29 MB and the handoff 238 KB, which FINAL-001 had to read. The next pass's cost table hit its 64 KB limit because WO-276 made the five-order window about 67 KB, which stopped that pass (2026-11-14 pass lines 480–488).
10. **Write-backs converged on two documents.** 16 of 18 parts' write-back steps edit the kit guide and 15 edit product 07 **[computed]**. FINAL-001 boarded ten findings in standing documents: the guide's update section lacks six sentences the release notes carry, dated accounts in product 07 and the sequence, four passages still naming the rung 1.0 (D163); citations needed repair at closing (D114). The next pass found the kit guide unusable for a person and filed WO-281 (2026-11-14 pass 398–419); whether WO-276's write-backs caused that: not established.

---

## 5. The form defined (fifteen rules)

Each rule says what the order's text, or an existing command's default,
should do. None adds a refusal or a stop. Tags point to §3 (G) and §4 (B).

1. **When it fits (B2, B4, B8; G1).** The order's Design states, for every part, that it is one queued order whose fixed cycle dominates its work, that no other part consumes a contract it changes, and that no instance waits on it alone. A part failing any of the three is filed as its own order ahead of the batch. `sequence.md`'s order-size rule names this form as the planner's option for 5–8 queued orders with disjoint surfaces, in place of on the operator's direction alone.
2. **How many and how big (B9, B1; G4).** Five to eight parts, each the size of a median order (the fifteen carried records were 219–405 lines). The whole order stays under the review helper's 200,000-byte brief bound, so every worker gets the order whole.
3. **Ship in waves (B2; G1).** Within one order nothing ships before its final review: today's commands publish one tag per order (`release close WO-NNN`) and the starter refreshes from core's tag. A batch that needs anything out early is filed as two or three orders in this form, each with its own release, activated one after another. A release of a part from its checkpoint would need code: a final review over a checkpoint range, a release close for it, a starter refresh from it.
4. **Shared contracts go first and alone (B4, B8; G3).** Infrastructure parts that later parts pass through come first, as WO-276 did, but in the first wave with its own verification. Consumer parts are written after that wave's release.
5. **A part is light by default (B3; G4).** The frame says from filing: a part ends on its step cases, the one to three suites that judge it most directly, the structural phase and the two document screens; one combined review launch; the full ladder and the complete run once at the order's end (D027, D028). Product 07 3887–3893 and the executor root's parts sentence say an order in parts may declare this, replacing the per-part ladder of up to three rounds as the default for parted orders.
6. **Cross-part reading at part boundaries, not on a clock (G5; B3, B6).** At each part's end, one whole-change reader over the parts done (`--part A-<letter>`, which exists) and one attacker of the closed part, once. No clock cadence; a critic only where the operator asks (WO-279's route).
7. **A part's end searches its consumers (B5, B8).** A part's last step searches every test and fixture for each wording, pin or list the part changed, names the suites holding them in the part's decision, and runs them (D025 change 3; D120). Filing reads every `preflight advisory` of `npm run plan -- check`.
8. **Verification and final review read by part (B1; G5).** The order's Known issues ask both to read one part per worker with `--part <letter>` over the diff since the part's starting checkpoint, then send readers over whatever those declare unread (FINAL-001's method, D164). With 5–8 parts this fits the default cap of 20. Criteria that compare against a part's base are judged at that part's checkpoint (frame 266–269, kept).
9. **A handoff row per part (G7).** At each part's end the handoff gains its row and its criteria lines with the commands that showed them (D013, kept).
10. **The standing file states position, not plans (B7; G6).** It holds the parts done with checkpoint ref and commit, the part and step in hand, the next action, what is undecided, and the gate row or event it was written after. No forecast and no sequence; those live in decisions. It is rewritten at each part's end and before any pause or complete run (product 07 4345–4356 holds the file; WO-279's advisory reads its age).
11. **Bounds set once (B6).** The Cost line gives one wall-clock bound and one cap for the whole order, from parts × the record's per-order median plus the closing; the dispatch records them once with `accept-overrun`. The executor reports parts done and left, not an hours forecast.
12. **Write-backs own their sections; the closing reads them whole (B10).** Each part edits only the standing sections its steps name. Step Z1 reads every changed standing section whole for dated accounts, stale cross-references and names a later part changed, before the closing ladder (D163's ten findings were of this kind).
13. **A part can be cut without rewriting others (B4, B8; G2).** Each part carries its own design, labelled steps, labelled criteria, Preflight bullet, evidence directory, known issues and non-goals, plus a "Uses Part X's …" line where it depends on another part; no criterion names another part's step. Cutting a part is an `amend-order` that removes its subsections, criteria and suites, and a planning edit that removes the umbrella label and typed entry from its record, which the index then lists as open (`dependencies.mjs` 64–69). **[inference]** No command does the second half today; it is a document edit.
14. **One written layout instead of hand copies (B9).** Product 07's planning section (or the planner's root) states the layout of §1.1 once: frame, per-part subsections, one labelled criteria list, the Preflight union paragraph, per-part evidence directories, criteria judged at checkpoints. A document change, no new check.
15. **Run the existing checks on the filed order (B9).** Before publish: `npm run work-orders -- index --check` and `npm run plan -- check`; the work-order reader now refuses a criteria list read shorter than written (D175), which would have caught the wrapped `<option>` line (D011).

## 6. What the next such order should do differently (no code change)

1. Five to eight parts, each a median-size record; whole file under 200,000 bytes.
2. Leave out any part that rewrites a shared reader, the gate or the role text; file it alone and first.
3. If anything must reach an instance before the rest, file two orders in this form, not one.
4. Write the light-part rule and the closing ladder into the frame at filing (D027/D028 wording), and say it replaces the per-part three-round ladder for this order.
5. Put the Preflight union in the first paragraph and read every `preflight advisory`.
6. Give each part a last step that searches tests and fixtures for every wording, pin and list it changed and runs the suites that hold them.
7. Reviews: one combined review per part; one whole-change reader with `--part A-<letter>` at each part boundary; one attacker per closed part, once; no clock cadence; no critic unless the operator asks.
8. In Known issues, ask the verifier and the final reviewer to read one part per worker with `--part`, then read what those declare unread; name the criteria judged at a part's checkpoint.
9. Limit the standing file to parts done with checkpoints, the part in hand, the next action, what is undecided and what it was written after; no forecast.
10. Ask the operator for one bound and one cap at dispatch, sized from the parts; record both once.
11. Have each part's write-back name only its own sections; make step Z1 read every changed standing section whole.
12. Point each umbrella record at its part in prose and in the typed entry's reason, as WO-276 did; list in Design which parts could be cut and how.
13. After filing, run `npm run work-orders -- index --check` and `npm run plan -- check`, and confirm the criteria count read equals the list's last number.

## Unverified or unknown

- Medians from `npm run plan -- failures`: unknown (no committed document states them).
- Calendar median from activation to release per order, and the release-close median: unknown.
- How many context compactions the sessions met: unknown.
- `meta.json`'s `elapsedMs` definition: not read; it differs from my phase sum by about 1 h.
- The 15-verifier-dispatch count's cause: not read.
- The Part B attribution of about 15 blocking findings is my classification from finding titles and criterion labels.
- Per-part durations come from local checkpoint ref committer times mapped through the handoff's Parts table.
- The total of about 250 worker uses is a sum of per-report counts; several reports say the hook's counter undercounts.
- Whether WO-276's write-backs made the kit guide unreadable: not established.
