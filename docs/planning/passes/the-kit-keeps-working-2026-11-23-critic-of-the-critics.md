# The critic of the critics, 2026-11-23

Record of the [2026-11-23 planning pass](the-kit-keeps-working-2026-11-23.md). This is the report of one of its research workers (the `default` worker; the host reported claude-opus-5-5), read-only, at `main` `bc761ad9c` (v1.4.0) on 2026-11-23. It is a worker's reading: what the pass checked itself is said in the pass document, with the file and line. The host refused the worker's own write of this file, so the pass filed the report as returned, with absolute checkout paths replaced by names and its quotations of kit text set as code on the lines where the document check would read them as the operator's words. Its brief is [the one the 2026-11-16 pass kept](the-kit-stops-no-work-2026-11-16-critic-of-the-critic-brief.md), with its fields filled: the pass of 2026-11-16 as the last pass, every criticisms and decisions file written to since, WO-288's records in its worktree among them, and WO-288's Part A as the open order that builds the critic.

## Summary

- **The loop still does not close.**
  - Since the 2026-11-16 pass there have been **310 critic points**: the pass's own critic 4, WO-284 17, WO-287 63 and WO-288 226. The operator received **52 whole reports in 7 days**.
  - The operator raised the same complaint three times: item 1 of the 2026-11-16 dispatch, WO-287-D045 (11-18) and WO-288-D123 (11-20).
- **Every loop change the pass assigned is in WO-288 Part A, which is not merged.**
  - WO-288 failed 11 verifications (11-20 to 11-23) and the operator paused it (`WO-288 worktree: docs/evidence/WO-288/standing.md:5`).
  - WO-284 and WO-287 ran on the kept launcher, whose subject is the executor alone.
- **What held and what failed.**
  - Changes held where they were a command default, or a sentence in the step itself pinned by a case. Three examples: WO-284's closeout "satisfied" form and `--reason` (no complete run after documents alone since); WO-288's sentence putting readers before suites; the kit-made screened transcript copy.
  - Changes failed where they were "from here" sentences in decisions, scripts left in session scratch, or role sentences that a hook, command or order form contradicted at the moment of choice.
- **WO-288 Part A, as written and as built, moves accepted points into the register; it does not close the loop.**
  - It minted 184 rows, raising the untriaged count from 25 on main to 249 (`scripts/lib/planning-followups.mjs:334-358`).
  - Nothing checks whether a remedy held, and nothing puts the remedy in front of the next session.
  - Classes are counted as literal strings (`scripts/lib/critic-points.mjs:96`).
  - The critic re-raised one judged incident 7 more times after accepting that defect. 29 of WO-288's 31 declined points are repeats, and 29 of its 33 launches returned exactly the charter's maximum of seven points.

## Boundary

**Read whole:**
- the 2026-11-16 critic-of-the-critic report;
- the WO-284 and WO-282 criticisms files;
- WO-284 D001-D002, D009-D011, D016, D018, D023-D041;
- WO-287 D002-D004, D012-D013, D017, D020, D024, D026-D030, D035, D039, D042-D053, the archived standing block, D068-D071, D077-D083, D090-D093;
- all 226 WO-288 `criticPoints`, parsed by a script and read in full;
- WO-288 D002, D004, D012, D016, D049, D056, D066, D073, D078, D091, D123, D168, D187, D199, D203, D221, D251, D260, plus `standing.md` and `part-a/critic-classes.md`;
- the kit charters `scripts/kit/critic.md` and `critic-review.md`, and WO-276's `charter.md`.

**Read in part:**
- the 2026-11-16 pass document, lines 1-140 and 290-1213;
- the WO-288 order: Design, Part A, criteria 14/23/25/34, Preflight to end;
- WO-279, lines 195-439;
- the headers of WO-288 VER-001 to VER-011 and of WO-287 FINAL-001;
- code at the cited lines;
- both registers, by a script.

**Not read:**
- transcripts, `docs/control/local/`, `docs/intake/`, this pass's own document;
- WO-281 and WO-282 decisions: no commits since 11-16, and WO-282's 8 points predate the pass and were counted by it, so they are excluded here;
- the bodies of the other verification and final-review reports.

**Caveat on classes:** I placed the WO-284 and WO-287 points in classes myself. WO-288's points are counted under the first class tag its executor recorded.

## Table: failure kinds

Counts are given as pass / WO-284 / WO-287 / WO-288. In "What changed": (a) answered only in the session; (b) standing text changed; (c) a mechanism changed; (d) nothing changed.

| Kind | Count | What changed | Came back? |
|---|---|---|---|
| **K12** – more coverage or proof claimed than the check gave | 0/4/13/25 = **42** | (a). WO-287-D045/D049 checked handoff citations with a session-scratch script that never reached the kit. (b) in WO-288, `contributor.ts:369` | **Yes.** It is WO-288's largest accepted class: 32 points carry the tag, L1P1 to L33P1 |
| **K3** – costly or ill-timed runs | 0/2/5/30 = **37** | (c) WO-284 on main: closeout "satisfied" form and forced run needs `--reason` (D009-D011). (b) product 07:2536 | **The documents-only subtype: no** — WO-287 and WO-288 decisions show no documents-only complete run, and WO-284-D041 consumed the standing row. **Other forms: yes** — WO-284 C4.2; WO-287-D030.4, D071.3; WO-288 L9P1, L10P3, L16P7 |
| **X1** – the operator not answered first | 0/2/1/31 = **34** (WO-288: 17 accepted, 14 declined as repeats) | (b) WO-288 only, `contributor.ts:117`. The prompt hook in both trees still says "answers it one of two ways, with the evidence" (`packages/compiler/src/harness.ts:181-183`) | **Yes, after the change:** WO-288-D044, D047, D057, D075 (a message sent mid-turn was never captured), D078 |
| **K4** – fact or status claimed before checking, including status read from a trailing echo | 2/3/7/14 = **26** | (a). (b) WO-288 `contributor.ts:304` | **Yes:** WO-284 three times in one night (D016 → D018 → D023); WO-287-D020, D068; WO-288-D203 (11-22), where the operator was told a failed document gate had passed |
| **K10** – figure or setting misstated | 1/2/10/8 = **21** | (c) WO-288's launch prints requested and reported settings apart | **The critic's own settings held. Others came back:** WO-287-D024.3, D068.6, D077.5; WO-288 L30P7 |
| **K14** – finding declined or deferred unchecked | 0/1/3/17 = **21** | (b) WO-288 `contributor.ts:119` | **Yes:** L15P7 to L33P6. WO-288 deferred its own critic's defect "for a planning pass" (L13P3) |
| **K1** – stale record, or a correction not carried to every place | 0/1/5/14 = **20** | (c) WO-288's standing-age advisory compares file time only | **Yes,** mostly as the correction-not-carried subtype: WO-287-D020.1, D071.4; WO-288 L9P5, L10P6, L12P5, L29P6 |
| **K11** – heuristic patched one case at a time | 0/0/1/15 = **16**, plus the WO-288 verification loop | (d): "nothing; read again when one occurs", and no reader ever did | **Yes, costliest.** Of 11 verifications, criterion 23 failed in 10, criterion 34 in 8 and criterion 25 in 6; 9 reports hit the review recorder. VER-004:7 names the cause |
| **K15** – fixed written before the check, or on a check that misses the input | 0/0/1/15 = **16** | (b), (c) WO-288 `to-fix` and `contributor.ts:369` | **Yes, reshaped** as "closed on a case that never drives the input": L16P2, L17P2, L18P1, L29P1, L31P1, L33P1 |
| **K6** – consumers missed | 0/0/0/14 = **14** | (d): "the gate is the cheap catch" | **Yes, and not cheap:** WO-284 had 2 of 3 implementation complete runs fail (D024, D025); WO-287 had 6 of 10 fail (D043, D046, D067, D070, D072, D092) |
| **K7** – timed comparison with several variables | 0/0/2/11 = **13** | (d) | **Yes:** WO-288 Parts C and E |
| **K5** – gate or round started with work pending | 0/1/1/8 = **10** | (d) | **Yes:** L16P4, then repeated in L18P3, L19P4, L20P5 |
| **K8** – critic clock and worker accounting | 0/0/4/5 = **9** | (c) WO-288 only: `worker -- due` | **On main:** WO-284-D035, WO-287-D093.2, D053. **In WO-288 after the change:** L16P7, L17P4, L19P7, L29P5 (18 min waiting for a critic) |
| **K9** – settled what was the operator's | 0/0/3/1 = **4**, plus WO-287-D048 | (a) | **Yes:** WO-287-D035 → D047 → D048 (operator correction) → D050 |
| **K16** – handed the operator the session's choice, then stopped and waited | 1 critic point, plus WO-287-D090 (critical), WO-288-D168 (43 min), and instance reports (D049, D056) | (b) WO-288 Part F only. Main still tells sessions to end the turn (`contributor.ts:912`, `observed-facts.ts:341`) | **Yes, D168, after the new rule was already in that worktree's root** |
| **X2** – earlier choice or pending row taken as the rule | 0/0/0/5 (tag used differently in WO-288) | (b) on main, `contributor.ts:1133,1153` | **Not found** in its original form |
| **N1** – identifiers sent to the outside-model critic | 0/0/3/0 | First two fixes were in-session scripts. The third leak came from the kept launcher's default of reading the original transcripts (WO-287-D068). (c) WO-288's kit copy | **Not seen after the kit change** |
| **N2** – edits made under a live reader or outside the round's rule | 0/0/2/2 | (a) | **Yes** |
| **N3** – the critic re-raising judged incidents | 3 points, plus 29 repeat declines | (d): the charter is unchanged | **Yes,** 7 more times |
| **N4** – decision dispatch field missing its control prefix | 6+ in decisions: WO-284-D031, D039; WO-287-D058; WO-288-D009, D010, D237, D247 | (d). The role says `naming the operator dispatch` (`contributor.ts:295`); the check requires a prefix (`docs-check.mjs:389-398`). FUP-fab6c96ffe7d5f46 is untriaged | **Yes** |
| **N5** – final review turned into a repair cycle | WO-287-D091 (operator correction), D093.1 | (d): reviewer step 4 "Otherwise finish substantive fixes" is unchanged (`contributor.ts:1152` on main / 1162 in WO-288). FUP-67b1b6cf60bba81f is untriaged | **Unknown;** no final review has run since |

## Why changes did not hold

1. **X1.** The hook text injected at the moment a question arrives contradicts the new role sentence. This was boarded as WO-288-D187 and is untriaged.
2. **K4.** The host's completion notice reports the exit of the trailing echo. The working form, "exit with the probe's own status", lived in session scratch.
3. **K16.** `contributor.ts:119` still offers its own exit: `when only the operator can clear a block … end the turn`. WO-288-D221 says the wait sentence reads as a third exit. On main, the day's-figure hook and role text order the turn to end; WO-288-D049 traced the instance's stops to that text.
4. **K11/K15.** Criteria 23 and 25 claim something for every one of 139 limits at 327 sites, so each verification finds the next site. WO-288 grew from four parts to six (Parts E and F added) without re-applying "cut by what one verification can hold". The off-ramps the kit already has (cutting a part, `waive`, recording a defect) are never named at the moment they apply.
5. **The repair rule did not travel.** WO-287's handoff-claims script did not reach WO-288. WO-288 accepted follow-up D018 L4P4, and Part D ignored it one part later (D040 L10P4, D042 L11P2).

## The loop's structure

On main, a critic is launched by hand on the kept launcher. Its report goes to the ignored lane and whole to the operator. Its points are answered as "from here" sentences in that order's decisions.

- **Who reads it:** no role reads criticisms; no `SKILL.md` names the critic.
- **How a point reaches planning:** only through a decision's `followup` field, and those rows are untriaged, because no pass ran between 11-16 and today.
- **What obliges a change:** only product 07's eighth planning input (`docs/product/07-execution-guide.md:2121-2139`), once per pass.
- **What shows a change worked:** nothing.
  - No field ties a point to the remedy it tests.
  - Classes are counted as literal strings.
  - `plan failures` counts volume, which grows with the cadence.

WO-288 Part A does not close this loop. It mechanizes launch, screen, cadence and recording, and mints a register row per accepted point. It is missing:

- the remedy put in front of the next session at the moment of choice;
- a requirement that a remedy be a named change to a text or a default;
- a check that an earlier remedy held, which is why the critic repeats itself;
- canonical classes;
- a check of the kit's own hook and command text against the role text;
- any measure of effect.

Every remedy still waits a full pass, then an order, then a release.

## What the operator caught that the critic could not

1. **Accepted points that changed nothing** (WO-287-D045, WO-288-D123). The charter never asks whether a remedy held.
2. **Final-review spend and the stop-and-wait** (WO-287-D090/D091). There was no clock in the final review, and the charter's cost standard ("the cheapest route the role admitted") approves what reviewer step 4 allows.
3. **The 43-minute idle turn** (WO-288-D168). The charter asks only about unanswered messages, not idle turns with work owed.
4. **The 11-verification loop.** The critic sees one dispatch window and has no order-level view.
5. **Kit text contradicting role text.** A verifier found it (WO-288-D187), not a critic.
6. **What instances meet.** The critic cannot see instances.
7. **A critic launched after the work was done** (WO-287-D053).

**What the charter would need:**
- this order's accepted points, with a held / broke / no-occasion verdict on each;
- new occurrences only;
- at most three new points;
- for each point, whether the session followed a kit text, naming the text;
- the phase's purpose and the model the operator assigned as the cost lens;
- the idle-turn clause;
- an order-level line: verifications returned, criteria repeated, failed complete runs.

## Recommendations

Ordered by operator time saved. None adds a stop.

1. **K11/K15 (the verification loop).**
   - **Change:** the fix dispatch's criteria status shows how many verifications returned each criterion. At two or more, it names the off-ramps that already exist: cut the part (rule 10), `waive`, or a defect record. Add one sentence to the repair step: a criterion returned twice is repaired by the verifier's class rule, run through the public command over generated forms, or its part is proposed for a cut.
   - **Where:** `scripts/lib/criteria-status.mjs` `renderCriteriaStatus`; the repair step in `contributor.ts`.
   - **Shows it worked:** no criterion is returned by a third verification.
2. **The loop.**
   - **Change:** the kit charter's Criticisms section first gives a held / broke / no-occasion verdict for each remedy this order accepted. It re-raises a judged incident only on a new occurrence, gives at most three new points, and names the kit text the session followed.
   - **Where:** `scripts/kit/critic.md`.
   - **Shows it worked:** repeat declines go from 29 to about 0; the operator does not raise the complaint again.
3. **K16 (stop and wait).**
   - **Change:** after `contributor.ts:119` (WO-288), add: "A question you put to the operator is not a block: say what you will do if no answer comes and continue the steps that do not depend on it." Ship Part F's turn text (`contributor.ts:922`, `observed-facts.ts:346`) ahead of WO-288's failing criteria.
   - **Shows it worked:** no idle-turn correction, and no instance relay about stopped turns, in the next two orders.
4. **N5 (final-review repair cycle).**
   - **Change:** reviewer step 4 becomes: "A blocker your own reading reproduces fails the review as step 3 does, unless its fix is one bounded edit with its case."
   - **Where:** `contributor.ts:1152` / `1162`, emitted as `SKILL.md:11`.
   - **Shows it worked:** the next final review's usage is near WO-284's 19M tokens, not WO-287's 243M.
5. **K6 (consumers found only by the complete run).**
   - **Change:** the part checkpoint prints the suites whose declared sources changed (the runner already knows them: WO-284-D010, `machinery-sources.mjs`), replacing rule 2's hand search.
   - **Shows it worked:** no complete run fails on a suite whose declared source the order changed.
6. **X1 (operator not answered first).**
   - **Change:** `OPERATOR_QUESTION_CONTEXT` (`packages/compiler/src/harness.ts:181-183`) says what the role says: answer first with what you know, the evidence follows.
   - **Where:** that constant, plus the cases at `scripts/test-harness.mjs:3287,3308`.
   - **Shows it worked:** no new X1 incident in the next order.
7. **Register flood.**
   - **Change:** mint one register row per order and class, and count a point under each class tag it carries.
   - **Where:** `planning-followups.mjs:334-358`, `critic-points.mjs:91-97`.
   - **Shows it worked:** WO-288's 184 rows become about 18.

**Below the seven:**
- **N4:** state the prefix and 240-character form at `contributor.ts:295`.
- **K4:** make the kit's background form exit with the check's own status.

## Unverified

- **Whether WO-288 sessions read their worktree's emitted roots.** This is inferred from WO-287-D003 and WO-288-D018/D021; the "came back after the change" claims for X1, K4 and K16 rest on it.
- **When WO-288's role text was first emitted.** Inferred, not read from a checkpoint.
- **The exact number of WO-288 complete runs.** Unknown.
- **Whether the final-review repair cycle (N5) recurs.** Unknown; no final review has run since.
- **What instance sessions read.** Unknown; I saw only the operator's relays.
- **Where recommendation 5 would compute the suites.** Inferred from WO-284-D010 and D032; I did not read that code.
