# Criteria that ended unmet: waivers, defect records and what was written

Record of the [2026-11-23 planning pass](the-kit-keeps-working-2026-11-23.md). This is the report of one of its research workers (the `default` worker; the host reported claude-opus-5-5), read-only, at `main` `bc761ad9c` (v1.4.0) on 2026-11-23. It is a worker's reading: what the pass checked itself is said in the pass document, with the file and line. The host refused the worker's own write of this file, so the pass filed the report as returned, with absolute checkout paths replaced by names and its quotations of order text set as code on the lines where the document check would read them as the operator's words.

## Boundary of what was read

- **Event definitions.**
  - `scripts/lib/control.mjs` 25-38: the five `DEFECT_CLASSES` and `RETRACTABLE_RECORDS`.
  - `scripts/lib/control.mjs` 156-218: off-ramp validation; 287-296: `unmetCriteria`.
  - `scripts/resume.mjs` 2231 and 2394: `unmetCriteria` written on `ImplementationReady` (IR) and `RepairCompleted` (RC).
  - `scripts/resume.mjs` 2744 (`CriterionWaived`), 2816 (`CriterionDefectRecorded`), 2878 (`OffRampRetracted`).
  - `scripts/lib/criteria-status.mjs` 1-59.
- **When each record type became possible** (`git log -S` on `resume.mjs`):
  - waiver: `6bcb86dba`, 2026-09-25;
  - unmet at handoff: `06acede33`, 2026-09-28;
  - defect and retraction: `ac0834b20`, 2026-11-02.
- **Control logs.** All of `docs/control/orders/*.jsonl` and `docs/control/resume.jsonl`, parsed and counted by type: 441 VerificationCompleted, 252 FinalReviewCompleted, 5 CriterionWaived, 5 CriterionDefectRecorded, 0 OffRampRetracted, 0 HandoffReopened. Also WO-288's worktree log.
- **Criterion text.** Read with `declaredCriteria` (`scripts/lib/handoff-ledger.mjs` 56-93). The text hashes match all five defect records' `criterionHash`.
- **Advisory.** I ran `criteriaAdvisories` (`scripts/work-orders.mjs` 1413) read-only from a scratch script over each criterion. In the kit it runs only over open orders (1601-1611).

## 1. Every record

Event types: W = waiver; D = defect record; U = criterion listed unmet at a handoff (IR or RC); P = prose waiver from before the event existed. There are no retractions. The phase comes from the event's position in the log; the role from the actor and any report that names it.

| Order | Crit. | Criterion text (shortened) | Type | Class | Date (UTC) | Phase / role | Filing pass |
|---|---|---|---|---|---|---|---|
| WO-111 | 2 | "The main checkout hash, a sentinel tree, and every path outside the portfolio are unchanged; no remote effect occurred." | P (D020) | — | 2026-09-25 | repair (`resume: fix`) | 2026-09-08 horizon cut (`6ab27c467`) |
| WO-163 | 4 | "`git diff --stat` on a register sync shows `followups.json` as generated (the attribute row is present and `git check-attr` confirms it)." | W (log line 6) | — | 09-28 02:07 | repairing; repair executor's Codex session (FINAL-001 l.101) | off-ramps-5s-entropy-2026-09-25 |
| WO-173 | 5 | "The three sentences appear in the named briefings … No briefing grows by more than 400 bytes." | W (l.4); U at RC (l.7) | — | 09-28 21:07; 21:50 | verifying (VER-001 Codex); repair executor | failures-across-phases-2026-09-28 |
| WO-185 | 3 | "A runner that receives an interrupt … kills every task group it started …; a fixture task that leaves a detached child alive fails the gate …" | U at IR (l.2) | — | 10-03 03:50 | executor | standard-pass-2026-10-02 |
| WO-192 | 17 | "Operator-authorized review repairs (2026-10-30, WO-192-D089): … both hosts drive live again on the final code." 1,007 chars, added by execution amendment. | U at IR (l.4); W (l.6) | — | 10-31 07:22; 09:26 | executor; verifying (VER-001) | standard-pass-2026-10-02 (the criterion was added mid-order) |
| WO-197 | 1 | "`docs/evidence/WO-197/task-durations.json` lists … every row since 2026-09-07 with per-case durations, and D001 names the case and the commit range …" | U at IR and RC (l.2, 8); W (l.5) | — | 10-07 21:51, 23:48; W 23:33 | executor; needs-fix, verifier-role session (FINAL-001 l.81) | machinery-reset-2026-10-07 |
| WO-197 | 2 | "… `target-publish` … at or below 22.254 s …; `worktree-integration` at or below 156.976 s; `harness-fixtures` at or below 326.779 s …" | U (l.2, 8); W (l.6) | — | same; W 23:34 | same | same |
| WO-221 | 3 | "Codex and Copilot: under `hostRules: "literal"` … `.codex/config.toml` contains no prefix-rule table …" | U at IR (l.2) | — | 10-19 03:19 | executor | fork-observations-2026-10-18 |
| WO-221 | 4 | `` Qualification: … one bounded episode each … under the operator's account …; the order's fallback … is a `blocked` row … `` | U at IR (l.2) | — | 10-19 03:19 | executor | same |
| WO-235 | 10 | "Products 05 and 07 … describe the built mechanism … `npm test -- --review` and `npm run test:docs` pass; …" | U at IR (l.4), superseded by IR `[]` (l.6) 14 minutes later | — | 10-29 14:54 | executor | wo192-fixes-and-example-drift-2026-10-26 |
| WO-238 | 7 | "The twelve filed packets carry `deliveredBy` …; a close of a carrying order writes the release." | U at IR (l.2) | — | 11-03 04:18 | executor | document-contract-and-release-close-2026-10-28 |
| WO-242 | 4 | "The emitted executor root carries the plan-first steps and the target closeout sentence; `harness check` passes; the … cold-start measurement is recorded against its ceiling …" | U at IR (l.2); D (l.4) | contradiction | 11-07 02:58; 03:19 | executor; verifying (VER-001) | node24-features-config-plan-first-no-work-stream-2026-10-30 |
| WO-242 | 8 | "One live plan-first conversation runs … and the verifier reads it as a novice's workflow and records usability limits …" | U at IR (l.2) | — (the executor named it later-phase) | 11-07 02:58 | executor | same |
| WO-276 | 51 | "(F2) `docs/evidence/WO-276/part-f/` holds the rule-by-role table … The rule records equal the table, by the case of criterion F1 …" | U at IR (l.8) + 6 RCs (l.15, 19, 23, 27, 34, 38); D (l.10) | contradiction | 11-13 00:48 to 11-14 16:02; D 11-13 01:09 | executor; verifying (VER-001) | one-order-for-the-whole-queue-2026-11-10 |
| WO-276 | 121 | "(Q2) Every refusal case … passes unchanged …, the attribution refusal fires for a shell command under each tool name that maps to its kind …" | same 7 U; D (l.11) | contradiction | same | same | same |
| WO-276 | 123 | "(Q4) Two authorship snapshots with no file changed between them read no file's bytes the second time; …" | same 7 U; D (l.12) | contradiction | same | same | same |
| WO-287 | 4 | "(A4) In an instance root … each go on with an advisory …; in core's root each is denied as before, and the existing cases for the nine refusals pass unchanged. …" | D (l.6); U at RC (l.9, 13) | contradiction | 11-18 06:34; 12:03, 16:02 | verifying (VER-001); repair executors | the-kit-stops-no-work-2026-11-16 |
| WO-288 (open) | 27 | "(E2) … the planning check's peak memory is at most half its figure at the base, or the decisions record `negative` …; and the check rebuilds no subject of a receipt older than the newest of its pass …" | U at IR (l.4) and RC (l.8, 21, 25, 33) | — | 11-19 22:38 to 11-22 08:34 | executors (Claude and Codex) | the-kit-stops-no-work-2026-11-16 |
| WO-288 | 2 | "(A2) An instance's `kinds` section that names another worker and effort for `critic` changes the launch accordingly; in an instance a malformed row is named in one advisory …" | U at RC (l.21, 25) | — | 11-21 07:05, 20:25 | executors | same |
| WO-288 | 41 | "(F8) The contributor sign-off is the stop `contribution-signoff` …; at advise, which is an instance's, the publish goes on with one advisory …" (Part F, added in execution, D049) | U at RC (l.21, 25) | — | same | executors | added in execution |

Waivers carry no class field (`control.mjs` 195-198). The classes `bookkeeping`, `later-phase`, `absent-input` and `host-behavior` have never been recorded.

## 2. Counts per order in closing order, and rates

**Closing ordinals.** The 18 closed orders with no timestamp (WO-003 to 027 and WO-101) all closed before 2026-09-04, so they take ordinals 1-18.

| # | Order | Closed | W | D | U events (entries) | Criteria | How each ended |
|---|---|---|---|---|---|---|---|
| 101 | WO-111 | 09-25 | 1 P | 0 | 0 | 1 | waived |
| 116 | WO-163 | 09-28 | 1 | 0 | 0 | 1 | waived |
| 120 | WO-173 | 09-28 | 1 | 0 | 1 (1) | 1 | waived |
| 148 | WO-185 | 10-04 | 0 | 0 | 1 (1) | 1 | met (VER-003, "for the recorded ownership boundary") |
| 155 | WO-197 | 10-08 | 2 | 0 | 2 (4) | 2 | waived |
| 178 | WO-221 | 10-19 | 0 | 0 | 1 (2) | 2 | c3 met after amendment D028; c4 met under its fallback |
| 198 | WO-235 | 10-30 | 0 | 0 | 1 (1) | 1 | met |
| 200 | WO-192 | 10-31 | 1 | 0 | 1 (1) | 1 | waived |
| 210 | WO-238 | 11-03 | 0 | 0 | 1 (1) | 1 | met (VER-002) |
| 217 | WO-242 | 11-07 | 0 | 1 | 1 (2) | 2 | c4 defective; c8 met |
| 222 | WO-276 | 11-14 | 0 | 3 | 7 (21) | 3 | defective |
| 227 | WO-287 | 11-18 | 0 | 1 | 2 (2) | 1 | defective |
| open | WO-288 | — | 0 | 0 | 5 (9) | 3 | VER-011 judged all three met |

**Period boundaries.** The commits that filed each pass's orders: the 2026-11-01 pass is `f5e5652e0` (2026-11-01T23:51Z); the 2026-11-16 pass is `6f3cc4d8e` (2026-11-16T17:44Z).

| Basis | Before the 11-01 pass | 11-01 to 11-16 | Since 11-16 |
|---|---|---|---|
| By filing pass | 10/210 = 4.8% | 1/15 = 6.7% (WO-276) | 1/2 = 50% (WO-287); 2/3 with WO-288 |
| By close date | 8/203 = 3.9% | 3/22 = 13.6% | 1/2 = 50% |
| Without the WO-111 prose waiver | 9/210 = 4.3% (filing); 7/203 = 3.4% (close) | — | — |
| Per criterion that ended waived or defective (filing basis) | 7/1,567 = 0.45% | 3/258 = 1.16% | 1/37 = 2.70% |

**The rate rose on every basis.** Caveats:

- The record types changed at the boundaries. Counting only orders closed from 2026-09-28, when waivers and unmet-at-handoff records both existed, the first period's rate is 7/88 = 8.0%.
- The later denominators are tiny.
- The median number of criteria per order rose: 6 (filed before 10-01), 8, 9, 10. The per-criterion rate rose as well.
- All 6 waivers fall before the screen. Everything that ended unmet after it is a contradiction (5 of 5).

## 3. The last fifteen closed and WO-288

The last fifteen closed are #213-227: WO-254, 246, 255, 257, 242, 243, 258, 259, 260, 276, 277, 281, 282, 284, 287. Records are held only by WO-242, WO-276 and WO-287.

| Record | Why unmeetable or pointless | Fit |
|---|---|---|
| WO-242 c4 | The criterion requires "the target closeout sentence". The order's Known issues (FUP-d1b15b1b3e4dc761) assign that sentence to WO-243. The 2026-10-30 pass said to strike those words at activation, and they were not struck. Source: the defect's evidence (log line 4) and FINAL-001 line 57. | Contradiction with a non-goal or fence; also a wording that later moved to another order. Every other clause held. |
| WO-242 c8 | The executor left unmet the clause "the verifier reads it as a novice's workflow" (handoff line 23). VER-001 line 332 judged it met. | A judgment only a later phase can make. The criterion was sound; the record was a correct deferral. |
| WO-276 c51 | The criterion places the table comparison in "the case of criterion F1", a product case. Product tasks may not read an active order's evidence (the product read guard). Source: `docs/evidence/WO-276/verifier-001/criterion-contradictions.json`, entry 51. | Restates an implementation detail (where the check runs), which collides with a standing kit rule. |
| WO-276 c121 | Attribution under "each tool name" conflicts with Part Q's unchanged refusals and no new refusal (entry 121). | Contradiction with a part's design or non-goal; the universal clause is the one that fails. |
| WO-276 c123 | "Read no file's bytes the second time" conflicts with Part Q's known issue, which requires a re-read inside the filesystem tick (entry 123). | Contradiction with a known issue; an absolute where the design required an exception. |
| WO-287 c4 | A4's "existing cases … pass unchanged" conflicts with A10, which removes the override sentence that a base case pins by exact equality. Source: VER-003 line 32; FINAL-001 line 33, "every clause but one holds". | Contradiction with another criterion, made by pinning an existing test's text. That text is an implementation detail the executor rightly changed (D006). |
| WO-288 c27 | A memory figure: at most half the base. Medians ran 46.2% to 57.7% across repairs, with trials on both sides of half (D100, D122, D226; VER-009 line 69, VER-010 line 65). Its second clause was read two ways (D100). | A ceiling figure as subject, plus an ambiguous clause. The planner wrote an escape ("or … `negative`"), and D226 used it. |
| WO-288 c2, c41 | An export with an owner package under `packages/` is core by the kit's own test. The criteria say "in an instance" without naming that test. Verifiers split: D136 met, D155 unmet. After repairs, VER-006 and VER-007 judged both met. | Something else: an undefined subject term ("instance"). |

**WO-288 failures that are not records** (from the `**Criterion N:** unmet` lines of VER-001 to VER-011):

- Criterion 23 failed in 9 of 11 and criterion 34 in 8; criterion 25 in 6; criteria 14 and 27 in 5 each.
- Criterion 23 is universal over an open set ("a row for each time limit the kit ships … a miss names its key and the file"). Each verifier found new paths: VER-009, VER-011 line 3.
- Criterion 34 was added in execution (Part F). Each verifier found a new publication state.
- Calling these too broad to verify is my inference. Neither was waived or recorded defective.

## 4. Screens and advisory at filing

Short names for the screens in product 07 2469-2558:

- **S3** (2026-10-13): a fence is written into every criterion it narrows, and no step contradicts a criterion.
- **S4**: a live run names its surfaces.
- **S5** (2026-10-19): a criterion names the behavior a host's configuration form must give; the form itself is the executor's.
- **S13a to S13e** (2026-11-01): the five classes, bookkeeping, later-phase, absent-input, host-behavior and contradiction.

| Record | Screen that names it, read as written | Advisory |
|---|---|---|
| WO-242 c4 (filed 10-30, activated 11-06) | S3 catches it; it was in force and not applied. S13e also applies but came later. | none ("ceiling" appears with no figure) |
| WO-242 c8 | S13b is borderline: its examples are the final review and release close. No defect existed. | none |
| WO-276 c51 | None. S13e reads criteria against each other and non-goals, not kit rules. S5's principle fits but is limited to host forms. | none |
| WO-276 c121, c123 | S3 and S13e. Both were in force and did not catch them among 133 criteria. | none |
| WO-287 c4 | S13e names the class, but the conflict shows only by reading the base `scripts/test-harness.mjs` Q3 assertion (inference). | none |
| WO-288 c27 | S13a catches it as written; the planner half-applied it with the escape. | **none**: `FIGURE` needs digits (`work-orders.mjs` 1375), and "figure" and "half" are not in `SCREENED_WORDS` (1376) |
| WO-288 c2, c41 | none | none |

Earlier records:

| Record | Fit | Screen that names it | Advisory |
|---|---|---|---|
| WO-111 c2 | Host side effect (D020) | S13d, S4 (both later) | none |
| WO-163 c4 | Git's `--stat` output, and a contradiction with a planning known issue (VER-001 lines 23-36) | S3 (later); S13d if Git counts as a host | none |
| WO-173 c5 | Bookkeeping | S13a | "400 bytes" |
| WO-185 c3 | macOS lacks descendant tracking (D006) | S13d | none |
| WO-192 c17 | Host behavior plus a compound, added by amendment | S13d, S4; amendments are not screened | none |
| WO-197 c1 | Absent input | S13c | none |
| WO-197 c2 | Bookkeeping | S13a | four figures in "s" |
| WO-221 c3 | A host form the host lacks; amended (D028) | S5 (next pass) | none |
| WO-221 c4 | Fallback named; the executor overlooked it | satisfied | none |
| WO-235 c10 | Executor skipped a gate (D020 to D021); the criterion was sound | none | none |
| WO-238 c7 | Executor misread it; repairable (VER-001 line 105) | none needed | none |

**Tally for the 11 criteria that ended waived or defective.**

- A screen in force at filing named 4 of them, and none of the 4 was caught: WO-242:4, WO-276:121, WO-276:123, WO-287:4.
- A screen set later names 6 more.
- No screen names WO-276:51.
- The advisory matched 2 of the 11, both before it existed.
- Across all closed orders the advisory would match 61, 19, 2 and 0 criteria for orders filed before 10-01, 10-01 to 11-01, 11-01 to 11-16, and since. Figure-with-unit criteria stopped being written; the defects moved to contradictions, which no pattern reads.

## 5. The last eight orders filed

**The orders:** WO-260, 276, 277, 281, 282, 284, 287 and 288, the last eight filed that ran. Superseded files that never ran are excluded. Text is main's.

**How I counted** (regular expressions over the joined text; I spot-checked the clause split on WO-287's 27 criteria):

- **Command:** a backticked span starting with npm, node, git, gh, npx, codex, claude or copilot, or holding a `--flag`.
- **Path:** a backticked span with a slash or a file extension.
- **Quoted:** a double-quoted span.
- **Shape:** a backticked camelCase, PascalCase or kebab-case identifier, or a brace.
- **Output content:** prints, says, tells, "one line", "one advisory", "names its/the/each/every", message or wording.
- **Compound:** at least 2 segments, splitting on `;`, on a sentence end before a capital, and on `:` before lowercase.
- **Broad:** at least 3 segments when ", and", ", or" and "and" before a determiner are also split.
- **Suite named:** `npm test -- --only`, `--review` or `test:docs`.
- **Universal:** every, each, all, any, or "no X".
- **Pins existing:** unchanged, "as before" or "as today".

| Order | Criteria (filed → main) | Median / max chars | Cmd | Path | Quoted | Shape | Output | Compound | Broad≥3 | Suite | Universal | Pins |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WO-260 | 7 | 303/852 | 7 | 5 | 0 | 1 | 1 | 5 | 4 | 5 | 4 | 0 |
| WO-276 | 133 | 321/868 | 92 | 58 | 0 | 17 | 44 | 84 | 85 | 47 | 62 | 12 |
| WO-277 | 4 | 284/330 | 4 | 3 | 0 | 0 | 2 | 1 | 1 | 2 | 1 | 0 |
| WO-281 | 6 | 177/345 | 5 | 4 | 0 | 1 | 2 | 1 | 1 | 5 | 2 | 0 |
| WO-282 | 5 | 424/552 | 5 | 3 | 2 | 0 | 3 | 4 | 4 | 5 | 1 | 1 |
| WO-284 | 10 → 10 (+27% chars) | 338/601 | 9 | 2 | 1 | 1 | 6 | 7 | 7 | 9 | 4 | 2 |
| WO-287 | 18 → 27 | 287/790 | 26 | 7 | 2 | 1 | 16 | 20 | 23 | 26 | 15 | 12 |
| WO-288 | 27 → 33 (41 in worktree) | 292/811 | 29 | 9 | 1 | 6 | 14 | 15 | 20 | 28 | 14 | 1 |
| **Total** | **225** | — | **79%** | **40%** | **3%** | **12%** | **39%** | **61%** | **64%** | **56%** | **46%** | **12%** |

What the figures show:

- **Size.** WO-276, WO-287 and WO-288, the orders run in parts, hold 193 of the 225. WO-276 has 44,982 characters of criteria.
- **Unreadable as filed.** WO-276's list could not be read by the kit's reader: a raw HTML block at line 3407. See WO-276-D175 and the 11-10 amendment.
- **Growth in execution.** WO-287 gained 9 criteria and WO-288 gained 6, then 8 more. None passed a filing screen.
- **Command forms over time.** Over all 227 closed orders, the share naming an exact command went 32%, 46%, 73%, 95% across the four periods; the share naming a suite went 6%, 16%, 32%, 95%.
- **Gate-pass criterion.** Every one of the eight has a criterion that says only "gates pass".

## 6. First verifications that failed

| Order | Basis | Against a waived or defective criterion? |
|---|---|---|
| WO-260 | Criterion 4: a reader returns 0 where it should return 1; "No waiver or defective-criterion route applies" (VER-001 lines 106-113) | No |
| WO-276 | Regressions F1 (JSX/TSX comments skipped) and F2 (a regex read as a comment); the contradictions were "recorded separately" (lines 3, 15, 25) | No |
| WO-277 | Criterion 4 (the gates pass): the document gate failed on absolute home paths in the executor's `status.json` (lines 83-88) | No |
| WO-284 | Criterion 1: a raised key does not match the row record (line 65) | No |
| WO-287 | F1, a lifecycle regression; F2, criteria 22 and 25; F3, a sound clause of criterion 4: "Repair that observable behavior while retaining the defect record" (line 21) | Partly: F3 was a sound clause of the defective criterion |

## 7. My reading (inference)

**The pattern.** Of the 11 criteria that ended waived or defective, 8 failed on a single clause while the criterion's other clauses held: WO-111:2, 163:4, 173:5, 242:4, 276:51, 276:121, 276:123 and 287:4. WO-192:17 and WO-197:2 failed on several clauses of a compound, and only WO-197:1 failed whole. The failing clause was a detail: a figure, a tool's output form, a test's location, a pinned existing test, a universal, or a wording another order took.

**Change 1. One behavior and its command per criterion; details belong to the executor.**

- **The form.** The template line (`TEMPLATE.md` 25) already says "Observable behavior and executable evidence". Make that one behavior per number. Figures go to the Cost line or decisions (S13a). Test locations, existing test text, tool output forms and absolutes become Design the executor may change by decision, which extends S5 beyond host forms. "Existing cases pass unchanged" becomes "the behaviors those cases assert hold, except where criterion N changes them".
- **It would have prevented:** WO-163:4, 173:5, 197:2, 276:51, 276:121, 287:4, 288:27 (5 handoffs), and 111:2 if its path set were named. That is about 33 of the 47 record entries.
- **It would be shown wrong if:**
  - behavior-only criteria draw defects at the same rate;
  - verifiers cannot judge them without the detail;
  - executors' changed details draw operator corrections like WO-111 D019 or WO-235 D021.

**Change 2. Fences go inside the criterion they narrow, and criteria added in execution are screened.**

- **The form.** S3 already says this. In the record, though, fences sat in Known issues or a part's design: WO-242's FUP entry, WO-276 Part Q, WO-163's planning known issue. The template has no field for them. A fence becomes the criterion's own "except" clause, or the criterion is struck with the dated form the reader honors (`handoff-ledger.mjs` 86-91). WO-242:4's "strike at activation" was missed. Execution amendments that add criteria run the screens and the advisory.
- **It would have prevented:** WO-242:4, 276:121, 276:123 and 163:4 for fences; WO-192:17 for amendments. WO-288:34, failed 8 of 11 times, was added by the same route but is not a record.
- **It would be shown wrong if:** contradictions recur where the fence sits in the criterion, or criteria added in execution fail no more often than filed ones.

**Change 3. Fallback evidence in the text, and figure words in the advisory.**

- **The default.** A criterion that depends on a host or tool, an operator's launch or account, or data absent at the base carries its fallback in its own text, as WO-221:4 did. A dated read names where the data exists. The advisory's `FIGURE` and `SCREENED_WORDS` also read "half", "twice", "percent", "peak" and "at most … of the base". That widens an existing check; it adds no new rule.
- **It would have prevented:** WO-111:2, 185:3, 192:17, 197:1, 163:4, and 288:27 through the advisory.
- **It would be shown wrong if** criteria often end "met under fallback" with nothing observed. WO-221:4 was met "solely under its express fallback" with no host observed (VER-002 line 77, VER-003 line 143), which is pointless in the operator's sense.

**Records none of these would prevent.** These are executor-side records whose criteria ended met:

- WO-235:10, a skipped gate;
- WO-238:7, a misread;
- WO-221:4's handoff record, a fallback overlooked;
- WO-242:8, a correct deferral to the verifier;
- WO-288:2 and 41: naming the kit's instance predicate in the criterion would settle these.

**How far the record supports "nearly every order."** The committed record supports it only for the latest orders: 2 of the 3 run since 11-16. The rest may lie in sessions or in the instance's repository, neither of which I read. The 23 `DispatchBoundAccepted` events on main and the 7 on WO-288 are bound asks, not criterion waivers.

## Files

- `scripts/lib/control.mjs`
- `scripts/resume.mjs`
- `scripts/lib/criteria-status.mjs`
- `scripts/work-orders.mjs`
- `scripts/lib/handoff-ledger.mjs`
- `docs/product/07-execution-guide.md`
- `docs/evidence/WO-276/verifier-001/criterion-contradictions.json`
- `WO-288 worktree: docs/control/orders/WO-288.jsonl`
- `WO-288 worktree: docs/verifications/WO-288/` (VER-001 to VER-011)
- `WO-288 worktree: docs/evidence/WO-288/decisions.md`
