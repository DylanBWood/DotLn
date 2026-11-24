# WO-288: why eleven verifications have not converged

Record of the [2026-11-23 planning pass](the-kit-keeps-working-2026-11-23.md). This is the report of one of its research workers (the instance's `default` worker; the host reported claude-opus-5-5), which read WO-288's record in that order's worktree on 2026-11-23, read-only, while its eleventh repair was in progress. It is a worker's reading: what the pass checked itself is said in the pass document, with the file and line. The host refused the worker's own write of this file, so the pass filed the report as returned, with the checkout's absolute path replaced by its name.

Paths are inside the WO-288 worktree unless absolute. "Order" means `docs/work-orders/WO-288-cores-own-tooling-lands-as-one-order.md`, "decisions" means `docs/evidence/WO-288/decisions.md`, "log" means `docs/control/orders/WO-288.jsonl` (cited by line), and `VER-NNN` means `docs/verifications/WO-288/VER-NNN.md`. **Inference** labels my reading. **Unknown** marks what I could not establish.

## What I read

- **Whole:** the order, VER-001 to VER-011, the log (52 events) and `docs/control/current.md`.
- **Decisions read whole:** D001–003, D016–017, D049–050, D065–077 (D074 in part), D085, D096, D099–100, D135–137, D155–159, D168, D172–175, D183–184, D189, D205, D218, D226, D233–239 and D249–263.
- **Machine passes over all 263 decisions:** sentences citing the operator, every `criticPoints` entry, every `kind: correction`, and searches for waive, defect, override and unmet.
- **Probe sections:** ver-003 F1/F7, ver-004 F1, ver-006 F2/F3, ver-007 F3, ver-008 F1, ver-009 F3, ver-010 F4/F5 and ver-011 F1/F3/F4.
- **handoff.md:** only its section map and its usage and cost paragraphs.
- **Not read:** the absorbed records WO-278, WO-279 and WO-280, product 07, the census, code, `standing.md`, part-* directories, feedback editions, the other probe sections, and anything under `docs/control/local/` or `docs/intake/`.
- I made no writes and ran no test or gate.

## 0. Two facts the brief does not state

1. **Six parts, not five.** The order has six parts (A to F) and 41 criteria. `git diff main -- <order>` shows the version on `main` with five parts and criteria 1 to 33. Part F (criteria 34 to 41, plan step 7) was added on 2026-11-19 on the operator's direction (D049, decisions:2647–2677; D050, decisions:2680–2711). No text of criteria 1 to 33 has changed.
2. **The current repair is unfinished and uncommitted.**
   - The log ends with `RepairRequested` for VER-011 at 2026-11-23T15:03:57Z, checkpoint 114 (log:52). There is no `RepairCompleted` after it.
   - `current.md:7` gives the phase as `repairing`; `current.md:20` gives the next action as `repair-complete`.
   - D253 to D263 are this repair's decisions, uncommitted. HEAD equals `main` at `bc761ad9c`.

## 1. Per-verification table

How to read the table:
- **Elapsed** times come from the log: Requested to Completed for verification, RepairRequested to RepairCompleted for repair. For VER-004 and VER-011 the reports confirm that the dispatch began at the requested time (VER-004:128, VER-011:128); I did not check the others.
- **Host, model and effort** are as attested in each report. The log's actor fields agree.
- **Verifier tokens** are each report's "Process cost … handoff" figure, cached input included.
- **Repair tokens** come from `handoff.md`.
- **No record gives a dollar figure.**

| VER | Requested → completed (UTC) | Verifier, as attested | Verdict, criteria met | Blocking findings (follow-ups) | Failed criteria (part) and regressions | Verification elapsed, tokens | Following repair: elapsed, actor, tokens |
|---|---|---|---|---|---|---|---|
| 001 | 11-20 01:03→01:29 | Codex 0.170.0 gpt-6.2-astra max | fail 27/41 | 16 (0) | 3 A3, 4 A4, 7 A7, 14 B2, 23 D1, 25 D3, 26 E1, 27 E2, 28 E3, 29 E4, 31 Z1, 34 F1, 36 F3, 38 F5; regressions F15 (wrapper), F16 (admission) | 0h26, 18,363,767 | 5h36, Claude opus-5-5 max, 492,556,783 (handoff.md:865) |
| 002 | 11-20 07:22→07:51 | Codex 0.171.0 astra max | fail 33/41 | 13 (5) | 3, 7, 23×4, 25, 27, 29, 31, 34×2; regression F3 (recorder) | 0h29, 22,290,640 | 9h38, Codex astra max, 92,104,235 (handoff.md:356) |
| 003 | 11-20 17:42→18:44 | Claude Code 2.1.329 claude-fable-5-2 xhigh | fail 39/41 | 7 (9) | 25×2, 23×3; regressions F5 (recorder), F7 (stored actor) | 1h02, 43,304,765 | 11h43, Codex astra max, **unknown** (handoff.md:334) |
| 004 | 11-21 07:07→08:03 | Claude 2.1.330 fable xhigh | fail 39/41 | 3 (9) | 25, 23; regression F1 (recorder) | 0h55, 36,655,115 | 3h42, Claude fable xhigh, 99,251,047 (handoff.md:861) |
| 005 | 11-21 22:00→22:29 | Codex astra max | fail 36/41 | 5 (2) | 2 A2, 14, 25, 27, 41 F8 | 0h29, 18,616,566 | 3h36, Claude opus max, **unknown** (handoff.md:857, D164) |
| 006 | 11-22 03:47→04:20 | Codex astra max | fail 32/41 | 9 (2) | 2, 6 A6, 7, 14, 17 B5, 23, 25, 27, 34 | 0h33, 17,127,873 | 2h59, Codex gpt-6.2-sol xhigh, 102,922,269 (handoff.md:241) |
| 007 | 11-22 08:55→10:32 | Claude 2.1.330 claude-opus-5-5 max | fail 37/41 | 4 (43) | 14, 27, 34, 23 | 1h37, 65,756,254 | 3h17, Claude opus max, 155,100,603 (handoff.md:198) |
| 008 | 11-22 19:35→20:04 | Codex astra max | fail 38/41 | 4 (3) | 14, 23, 34; regression F4 (benchmark) | 0h29, 17,030,131 | 1h55, Codex astra max, 38,472,815 (handoff.md:149) |
| 009 | 11-22 23:30→11-23 00:31 | Claude 2.1.330 fable xhigh | fail 39/41 | 3 (49) | 34, 23; regression F3 (nested repository read) | 1h01, 54,978,514 (+3,620,565 reader tokens, inclusion unknown, VER-009:178) | 2h59, Claude fable xhigh, 115,625,532 (handoff.md:125) |
| 010 | 11-23 05:23→05:57 | Codex astra max | fail 39/41 | 5 (5) | 23×3, 34; regression F4 (slow planning reader) | 0h34, 23,984,714 | 2h41, Codex astra max, 53,443,974 (handoff.md:49) |
| 011 | 11-23 09:21→10:07 | Codex astra max | fail 39/41 | 7 (3) | 23×4, 34; regressions F3 (recorder), F4 (gate index) | 0h46, 17,671,976 | in progress |

**Totals:**
- 76 blocking findings and 130 follow-ups.
- Implementation 22 h 7 min; verification 8 h 22 min; ten repairs 48 h 6 min.
- Verdict to next repair request: 23 h 28 min. Handoff to next verification request: 8 h 29 min.
- 110 h 33 min from activation to the last event.
- About 335.8 M verifier tokens and about 2,197 M executor tokens where recorded, the implementation alone 1,047,520,146 (handoff.md:870).

**Effort and host:**
- The order sets the verifier's effort at `xhigh` (order:20). The Codex verifications attest `max`, and `current.md:14` records the drift.
- The host alternates. Codex verified VER-001, 002, 005, 006, 008, 010 and 011; Claude verified VER-003, 004, 007 and 009.

## 2. Classification of every blocking finding

**Conventions:**
- A regression that the original implementation introduced is (b). One that a repair introduced is (c).
- **b-univ** means the finding is sound only under D218's universal reading of criterion 23 (decisions:9662): every site must apply the owner's figure and name its key on a miss. The other reading limits the criterion to the four named cases (order:554–562).
- The Design states the property for every site (order:289–295), so I judge the universal reading supported.
- **Inference:** the criterion's stated method, four cases, cannot establish a universal property, so the verdict depends on how far the verifier samples. None of the brief's five defect classes fits this.

| Finding | Criterion | Class | Evidence |
|---|---|---|---|
| V1 F1 | 3 | e | Turns on an unavailable list, not a refuse-class entry. The verifier grounded it in the absorbed design (VER-001:13; unread by me). The executor accepted it (D071, decisions:4139). |
| V1 F2 | 4 | b | VER-001:15 |
| V1 F3 | 7 | b | The meter threw (VER-001:21). |
| V1 F4 | 14 | b | Hits the criterion's own clause (VER-001:35). |
| V1 F5 | 23 | b | Evidence wait (VER-001:53). |
| V1 F6 | 25 | b | VER-001:57 |
| V1 F7 | 26 | a, later-phase | The head is a moving subject until final review (order:571–575, VER-001:59). Met from VER-002 on. |
| V1 F8 | 27 | b | VER-001:61 |
| V1 F9 | 28 | b | The executor's contradiction (D072) was withdrawn (D076, decisions:4574). |
| V1 F10, F11, F12, F13, F14 | 29, 31, 34, 36, 38 | b | VER-001:65–83 |
| V1 F15, F16 | regressions | b | Introduced by the original implementation (VER-001:118–119). |
| V2 F1 | 3 | e | First appearance of the source-bearing export reading (VER-002:13). |
| V2 F2 | 7 | b | |
| V2 F3 | regression | c | Introduced by the VER-001 F4 repair (VER-002:106). |
| V2 F4–F7 | 23 | b-univ | VER-002:53 |
| V2 F8 | 25 | b | Census row A47 is in the Design (order:284–288). |
| V2 F9–F13 | 27, 29, 31, 34, 34 | b | |
| V3 F1 | 25 | c | The VER-002 F4 repair made the supervisor honour enforce-off: "At the base the timer was always armed" (ver-003-probes.md:21). Its repair rule also goes beyond the criterion's text (order:566–570). |
| V3 F2 | 25 | b | |
| V3 F3, F4, F6 | 23 | b-univ | "the classes of VER-002 F8, F7 and F5 at sites those repairs did not reach"; F6 is a wait "the census did not list" (VER-003:128). |
| V3 F5 | regression | c | Recorder |
| V3 F7 | regression | b | Introducing change not named, so possibly (c) (ver-003-probes.md:97–110). |
| V4 F1 | regression | c | 192 of 250 generated forms (ver-004-probes.md:28–39) |
| V4 F2 | 25 | b | Two of the sites were already named in VER-003's probes (VER-004:57). |
| V4 F3 | 23 | b-univ | |
| V5 F1, F5 | 2, 41 | e | Owner package under `packages/`. Reopens D136, which held the base's instance test (decisions:7116) (D155, decisions:7749). The executor had marked both unmet at handoff (log:21, 25). |
| V5 F2 | 14 | c | Valid prose recorded at checkpoint 77 is refused after the VER-004 repair (D156, decisions:7783). |
| V5 F3 | 25 | b | |
| V5 F4 | 27 | e | The word-for-word reading reopens D137/D100 (decisions:7146, 7853). The executor had proposed it (decisions:6770). |
| V6 F1 | 2 | b | A valid row could not be launched. |
| V6 F2 | 6 | e | A target gate read as a complete run; D172 states the reading (decisions:8255). |
| V6 F3 | 7 | b | "No reader throws" |
| V6 F4 | 14 | c | |
| V6 F5 | 17 | e | The owner-package reading extended to criterion 17 (decisions:8264). |
| V6 F6 | 23 | b-univ | |
| V6 F7 | 25 | b | |
| V6 F8 | 27 | b | Under VER-005's reading |
| V6 F9 | 34 | b | |
| V7 F1 | 14 | c | |
| V7 F2 | 27 | b | |
| V7 F3 | 34 | c | The VER-006 repair's origin read (D174, decisions:8310); main kept awaiting-merge (ver-007-probes.md:49). |
| V7 F4 | 23 | b-univ | |
| V8 F1 | 14 | c | |
| V8 F2 | 23 | b-univ | The row was created in the VER-007 repair (D196). |
| V8 F3 | 34 | c | |
| V8 F4 | regression | c | From the D195 repair |
| V9 F1 | 34 | c | Failed origin read again |
| V9 F2 | 23 | b-univ | D218 refused to board it (decisions:9662). |
| V9 F3 | regression | c | "entered between checkpoints 46 and 61" (ver-009-probes.md:62) |
| V10 F1, F2, F5 | 23 | b-univ | The VER-002 F6 class (late results accepted) at new sites |
| V10 F3 | 34 | b | |
| V10 F4 | regression | c | A default reader left after a rename (ver-010-probes.md:46–50); introducing repair undated |
| V11 F1, F5, F6, F7 | 23 | b-univ | F5 and F6 fall within the literal text too. |
| V11 F2 | 34 | b | Partly beyond F1's text: the draft's ready mark |
| V11 F3 | regression | c | |
| V11 F4 | regression | c | The tolerant reader for criterion 7 became the decisions' reader (D256 misread, decisions:10648). |

**Tally:**
- (a) 1.
- (b) 52, of which 20 are b-univ.
- (c) 16.
- (d) 0.
- (e) 7.

Verification process slips are recorded and kept out of the findings: D189, D235, D237 and D252.

## 3. Convergence

- **Exact reproductions never recur.** Each report says the prior ones pass: VER-002:5, 003:5, 004:5, 007:3, 008:119, 009:3, 010:3 and 011:3.
- **Classes recur:**
  - Recorder: 9 of 11 rounds, alternating between too strict and too lenient.
  - Criterion 23: 10 of 11 rounds, met only at VER-005. Its sub-classes:
    - no key named: V1, 2, 3, 8, 9, 10, 11;
    - late result accepted: V2 F6, V10 F1/F2, V11 F7;
    - enforce-off still ends work: V2 F4, V3 F4, V11 F6;
    - lock waits: V3, V4.
  - Criterion 34: 8 rounds. Failed origin read: V7, V8, V9. New remote states: V6, V10, V11.
  - Criterion 27: 5 rounds, settled after the witness work (D175, D193).
  - Criterion 25: 6 rounds, settled after the fail-closed scan (D148).
  - Owner-package export: 4 findings. Gate-record reader: 5.
- **Counts per round:**
  - Blocking findings: 16, 13, 7, 3, 5, 9, 4, 4, 3, 5, 7. The last seven average 5.3, and the last three rise.
  - Unmet criteria: 14, 8, 2, 2, 5, 9, 4, 3, 2, 2, 2.
  - Criterion 23 findings: 1, 4, 3, 1, 0, 1, 1, 1, 1, 3, 4.
- **Distinct criteria ever failed: 18 of 41**: 2, 3, 4, 6, 7, 14, 17, 23, 25, 26, 27, 28, 29, 31, 34, 36, 38, 41.
  - A 5 of 12; B 2 of 6; C 0 of 4; D 2 of 3; E 4 of 5; Z 1 of 2; F 4 of 8.
- **At VER-011:** 23 (D) and 34 (F) fail, plus the B recorder and the shared gate reader.
- **Inference (small sample, confounded):** Codex rounds average 8.4 blocking findings and Claude rounds 4.25. Codex twice reopened a Claude verifier's judgment.

## 4. Size

- **Criteria:** 41 in all: A 12, B 6, C 4, D 3, E 5, Z 2, criterion 33 (1), F 8.
- **Plan:** 8 steps (order:369–422). Steps 2 to 4 each run an absorbed order's whole plan.
- **Part D:** estimated at 139 limits over up to 327 sites (order:68–71). The table now holds 287 rows (VER-008:61), against 262 at VER-002. The inventory scans 660 shipped files.
- **Worktree:**
  - `git status --short | wc -l` gives 402.
  - With all untracked files listed, 736 paths: 330 modified and 406 untracked, 382 of them under `docs/evidence`.
  - `git diff --stat main | tail -1` gives "330 files changed, 46729 insertions(+), 4688 deletions(-)".
  - VER-011 counted 726 changed paths.
- **Record:**
  - 263 decisions, 48 of them corrections.
  - 114 checkpoint refs.
  - 27 feedback editions.
  - 33 critic launches with 226 points, 195 accepted.
  - The advisory count of pending follow-up rows that touch the change grew from 174 (log:4) to 290 (log:49).

## 5. Records: waivers, defects, unmet-at-handoff, bounds and operator interventions

**Waivers, criterion defects and overrides: none.**
- `current.md` lists none, and the decisions hold none.
- A defect record was proposed and rejected at decisions:5890 (D100), 7161 (D137), 8626 (D183) and 8665 (D184). D136 rejected it for criteria 2 and 41.
- The executor's own contradiction record (D072, 2026-11-20) was self-corrected in D076.
- decisions:1957 says an exception is the operator's to grant or a later phase's to record.

**Unmet at handoff (log `unmetCriteria`):**

| Log line | Date and time | Unmet criteria |
|---|---|---|
| 4 | 11-19 22:38 | 27 |
| 8 | 11-20 07:08 | 27 |
| 21 | 11-21 07:05 | 2, 27, 41 (D127, D129) |
| 25 | 11-21 20:25 | 2, 27, 41 |
| 33 | 11-22 08:34 | 27 |

**Bound acceptances:**

| Log line | Date and time | Phase | Bound | Capture |
|---|---|---|---|---|
| 2 | 11-19 00:36 | active | subagentCap 64 | a38a5b… |
| 3 | 11-19 00:36 | active | wall clock unlimited | a38a5b… |
| 12 | 11-20 16:13 | VER-002 repair | 10 h (D096) | 7b907c… |
| 17 | 11-21 02:23 | VER-003 repair | 10 h | 1d1b66… |
| 18 | 11-21 06:43 | VER-003 repair | wall clock unlimited | 91f700… |
| 19 | 11-21 06:43 | VER-003 repair | completeRuns unlimited | 91f700… |
| 20 | 11-21 06:44 | VER-003 repair | subagentCap 25 | 91f700… |

**Operator interventions:**

| Date | Decisions | What it concerned |
|---|---|---|
| 11-16 | D001 | Part E added after the judgment; gateShare raised from 0.5 to 0.6 |
| 11-19 | D002, D003, D016, D017 | Worker selections, changed again on resume |
| 11-19 | D049, D050, D051–D056 | Part F, the sign-off stop and six register rows |
| 11-19 | D060, D065, D066 | Role-text change declined by the host classifier; the operator's choice is still open |
| 11-20 | D073 | A full paired ladder before the repair's complete run |
| 11-20 | D127 | A direction to change the executor's conduct |
| 11-22 | D167 | Finish the repair |
| 11-22 | D168 | Objection to a turn ended with work owed |
| 11-22 | D175 | Choice of the receipt-witness repair delegated |

## 6. What stands between VER-011 and a pass

| Finding | Repair decision | Fix |
|---|---|---|
| F1 | D253 | Crash only on a delivered kill |
| F2 | D254 | A draft at the reviewed SHA counts as the push; the publish marks it ready |
| F3 | D255 | Names read as JSON reads them |
| F4 | D256 | Strict reader for decisions |
| F5 | D257 | 48 fixture waits converted, scan extended |
| F6 | D258 | No deadline when the limit is off |
| F7 | D259, D261 | Samples judged on arrival |

- Each decision cites a case that fails at checkpoint 114 and passes after the repair. All seven are reachable by repair, but none is verified.
- Criterion 33 needs a fresh complete run each round (46 to 80 min by the log) and the document gate.
- **Inference:** a pass also needs VER-012 to find no new criterion 23 site, criterion 34 state or regression. The record has no mechanism that bounds this:
  - D218 holds every site to the property.
  - D257 adds new surface.
  - VER-004's attempt to bound the classes (VER-004:124) was not carried forward.
- **Routes other than repair:** a waiver (off-ramp, `current.md:21`), an amendment under rule 10 (order:248–255), or a defect recorded by a later phase (decisions:1957). None has been used, and no one has proposed one for criterion 23.

## 7. My reading (inference), ranked

**1. Open-ended criteria, read universally and checked by sampling.** Criteria 23 and 34 (earlier 25) are universal properties over open sets of sites or states. Each verification samples further and nothing stops it. This lies in the criteria plus the verifier's standard.
- Criterion 23 fails at new sites every round (list in section 3).
- The verifiers' own diagnosis: D099 (decisions:5862) and D135 (decisions:7084), "each verification finds the next form". D218 still refuses to bound the criterion (decisions:9662).
- VER-008:123 and VER-009:170 say a handoff-only judgment would have passed all 41 criteria.
- Criterion 25, once made fail-closed (D148), passed in every round from VER-007 on. Criterion 23 has no such check.
- Criterion 34 is binary, with no arm for an unknown publication state (order:603–608), and its state space keeps widening.
- The census missed sites (VER-003:128).
- **Would contradict:** VER-012 finding no new criterion 23 site after D257, or the findings being sites already claimed as covered. They are mostly new sites, though the late-result class repeats.

**2. Repair-introduced regressions in shared readers, caught by base comparison.** This lies in the executor's work under design constraints.
- 16 of the 76 findings are (c).
- The recorder failed in 9 rounds. Criterion 14 demands leniency (order:511–512); the base was strict; the non-goals exclude the output contract (order:709–711). The probe inputs became boundary-straddling (ver-008-probes.md:19–23).
- The drive's origin read (D174) produced three failed-read rounds.
- The criterion 7 reader spread to decision callers (D256).
- `runGit` broke a removal that main completed (ver-009-probes.md:62).
- **Would contradict:** regressions in code no repair touched. The probes place them in repaired code.

**3. Size and form amplify every round.** This lies in the order's form.
- 41 criteria across six parts, about 730 paths, and Part F added mid-run. Criterion 34, one of the two still failing, is Part F's.
- 39 met criteria are re-read each round.
- Each repair has a fixed cost: a complete run of about 1 h, Part E re-measurement, a critic every 75 min, feedback re-mints and a combined review.
- 48 h of repair against 8.4 h of verification.
- The record's own growth fed into criterion 27's memory clause (D226: "226 decisions", decisions:9865).
- This amplifies rather than causes.

**A secondary factor:** verifier host and reading drift. D155 reopened D136 and D158 reopened D137, no report adopts its predecessor's bound, and no off-ramp has been used.

**Plainly:** the eleven rounds come mainly from the criteria and the verifier's standard together. Repair regressions in a large, coupled change add to this, and the order's size amplifies it. The executor repaired every reproduction it was given.
