# The critic of conduct: does anything it finds change the kit?

Record of the [2026-11-16 planning pass](the-kit-stops-no-work-2026-11-16.md): a research worker's
report on what became of the critics' findings, kept as the worker returned it, except that quotation marks were taken
off the passages that name the operator beside a quoted phrase, which the
document gate reads as quoting the operator. It is
that worker's reading of the tree at `38c333ab2`, not the pass's judgment;
the pass's document says which of its statements the pass checked and what
it decided from them. A statement it marks unverified is unverified.

Read-only review of the loop around the critic of conduct, 2026-11-16, on branch `planning/2026-11-16-the-kit-stops-no-work` at `38c333ab2`. No repository or Git writes were made. No test-runner gate was run.

## Verdict

The loop stops at the order that heard the criticism.

- A criticism is answered once, inside the order that heard it. It is written up as a rule in that order's decisions file and in its standing file, and the standing file is deleted when the phase completes.
- No role text names the critic or its record. Nothing requires an accepted point to change role text, a command's default or a check. Nothing checks whether a change took effect.
- The one planning pass that worked through the record (2026-11-14) gave 13 of its 16 classes no change ("nothing", or "nothing new", because a rule already existed). Its condition for reopening them only takes effect after WO-279 lands, so it has never been triggered. Of those 13 classes, 10 have recurred since, in WO-277, WO-281, WO-282 and the pass itself.
- The recurrences that cost the operator most were not mainly failures of unwritten rules. Each happened while a written rule already existed, because:
  - a command printed the opposite of the rule at the moment the choice was made;
  - the order template contradicted the role text;
  - a record schema forced the wrong tense;
  - the critic's own launcher printed requested settings as if they were the ones that ran;
  - the fix landed in a section of product 07 that no role is directed to read.
- WO-279, as written, makes the critic easier to launch. It does not close the loop.

## Boundary of what was read

**Read whole:**
- `docs/evidence/WO-276/critic/criticisms.md`, `README.md` and `charter.md`
- `docs/evidence/WO-282/criticisms.md`
- WO-282 decisions D001 and D015 to D024
- WO-279's order
- the executor and reviewer `SKILL.md` files

**Read in part:**
- the critic launcher: its output lines
- WO-277 decisions: D002, D009, D010, D018, D019, D027 to D030, and the `misread` field of each correction
- WO-281 decisions: D002 to D007, D016 to D019, D023, D024 and D027 to D029
- WO-245-D005
- WO-276 decisions: D045, D062, D111 and D112 (excerpts), and D143's follow-up; a heading list and grep for the rest
- the 2026-11-14 pass: §The critics' record, the two critic sections, §operator messages and the reversal list
- product 07: §Discipline lines 4365 to 4385, the order-template bullet at lines 2295 to 2330, and each role's Read directives
- code: `scripts/lib/closeout-scope.mjs`, `scripts/test-runner.mjs` (argument parsing and reuse), `scripts/lib/round-findings.mjs` (vocabulary), `scripts/lib/review-worker.mjs:875`
- `docs/planning/followups.json` rows named below
- `docs/planning/cost-table.json` trap series
- the three final-review findings blocks

**Searched by grep only:** the 2026-11-09 pass. It holds no critic content (the WO-276 critics came later).

**Not read:**
- session transcripts and the ignored reviews lane (the critics' own words)
- `docs/control/local/` and `docs/intake/`
- the untracked pass `docs/planning/passes/the-kit-stops-no-work-2026-11-16.md`
- most WO-276 decisions in full

**Inherited limitation.** Every WO-276 row is the executor's paraphrase, and most rows were read by a research worker and not checked one by one (criticisms.md:37-42). This review inherits that limitation.

## 1. Inventory: what kinds of failure the critics found

### Scope and method

- **Counted:** the accepted (or partly accepted) conduct points in both files.
  - WO-276: 139 points (criticisms.md:199).
  - WO-282: 8 points (`docs/evidence/WO-282/criticisms.md`).
  - Total: 147.
- **Excluded:**
  - WO-276's 9 implementation points;
  - its 4 points with no verdict stated (criticisms.md:264-267);
  - two WO-276 critics (38 and 39) that were stopped before they reported.
- **Grouping:** the record's 16 classes are kept so that the 2026-11-14 pass's dispositions can be traced. Each is renamed in plain words. Placing WO-282's points in the classes is my reading.

### Table: the 16 kinds

| # | Failure kind (plain words) | Count | Belongs to it |
|---|---|---|---|
| K1 | Left the record of the work stale, out of order or self-contradicting (standing file, handoff, checkpoint, a repair not recorded before its run) | 22 | WO-276 critics 2 (D045), 4 (D048), 7 (D052), 10 (D062), 11 and 12 (D067), 14 (D070), 15 and 16 (D072), 17 (D074), 18 (D076), 19 (D077), 20 (D080), 23 (D085), 24 (D087), 26 (D091), 31 (D106), 33 twice (standing file), 34 (D112), 37 (D144); WO-282 critic 2 C2 (D019) |
| K2 | Made an hours forecast that does not add up | 16 | Critics 1 (D043), 2 (D045), 3 (D046), 4 (D048), 5 (D049), 7 (D052), 8 (D054), 9 (D058), 11 and 12 (D067), 13 (D068), 17 (D075), 19 (D077), 20 (D080), 21 (D082), 23 (D085) |
| K3 | Ran a costly check nobody owed, or chose or timed checks poorly | 15 | Critics 1 (D043), 2 (D045), 3 (D046), 5 (D049), 9 (D058), 10 (D062), 12 (D067), 14 (D070), 21 (D082), 23 (D085), 27 (D093), 28 (D097), 36 twice (D141), 43 (D186) |
| K4 | Claimed a result, cause or fact before checking it (including a status read from a pipe or log) | 17 | Critics 12 (D067), 17 (D074), 18 (D076), 23 (D085), 26 (D091), 28 (D097), 29 twice (D100), 30 (D103), 31 (D106), 35 twice (D118), 37 (D144), 40 (D179), 41 (D182), 43 twice (D186) |
| K5 | Started a review round or gate with known work unfinished | 9 | Critics 13 (D068), 15 (D072), 22 twice (D084), 24 (D087), 30 (D103), 33 (standing file), 40 (D179); WO-282 critic 2 C3 (D019) |
| K6 | Checked a change against too few of its consumers | 8 | Critics 1 (D043), 3 (D046), 6 (D051), 8 (D054), 11 (D067), 17 (D074), 24 (D087), 41 (D182) |
| K7 | Ran a timed comparison that differed by more than one thing | 7 | Critics 1 (D043), 2 (D045), 3 (D046), 4 (D048), 5 (D049), 8 (D054), 9 (D058/D057) |
| K8 | Handled worker launches, the clock and the budget loosely | 8 | Critics 11 (D067), 15 (D072), 19 (D077), 22 (D084), 25 (D089), 27 (D093), 30 (D103), 34 (D112) |
| K9 | Settled what was the operator's (read a requirement down, called a defect scope) | 6 | Critics 2 (D045), 16 (D072), 18 twice (D076), 20 (D080), 21 (D082) |
| K10 | Wrote a figure, time, setting or order that does not match what was observed | 8 | Critics 1 (D043), 27 (D093), 30 (D103), 31 (D106), 32 (D108), 35 (D118), 41 (D182); WO-282 critic 2 C4 (D019) |
| K11 | Patched a heuristic one counterexample at a time | 5 | Critics 11 (D067/D066), 20 (D080), 21 (D082), 26 (D091), 28 (D097) |
| K12 | Claimed coverage beyond what the check shows (proxy evidence, a summary that drops part of its source) | 9 | Critics 6 (D051), 12 (D067/D066), 21 (D082), 29 (D100), 36 (D141), 40 (D179), 42 (D184); WO-282 critic 1 C1 and C3 (D015) |
| K13 | Gave a worker premises it should not rely on | 6 | Critics 10 (D062), 30 (D103), 31 (D106), 32 (D108), 36 (D141), 41 (D182) |
| K14 | Declined or deferred a finding for a reason never checked | 6 | Critics 7 (D052), 14 (D070), 25 (D089), 27 (D093); WO-282 critic 1 C2 (D015), critic 2 C1 (D019) |
| K15 | Wrote work up as done before the work or its gate | 3 | Critics 26 (D091), 32 (D108); WO-282 critic 1 C4 (D015) |
| K16 | Handed the operator what was the session's to settle | 2 | Critics 36 (D141), 37 (D144) |
| | **Total** | **147** | |

### Two kinds not in the files

These come from the operator's corrections and later critics' decisions. They are not counted above, but they matter for section 3:

- **X1. Did not answer the operator, or answered in a line the host did not keep.** It appears four times:
  - the 2026-11-14 pass, second-session critic point 1 (pass:505-512): replies went 34 and 16 minutes unseen;
  - WO-277-D010;
  - WO-281-D006;
  - WO-282-D024, error 2: the operator's objection went about five minutes without an answer.
- **X2. Took a pending follow-up row or an earlier session's choice as the rule.** It appears in WO-282-D024, error 1.

## 2. Trace: what happened to each kind

Categories used below: (a) answered in the session only; (b) standing text changed; (c) a mechanism changed; (d) nothing changed.

### Every kind: answered in the session only

Every WO-276 point was answered in a decision of the order. Its "What changed" cell is mostly "Rule": a rule recorded in the decision and carried in the order's standing file (README.md:79-81, rule 5). The standing file does not survive the order:

- The executor root says completion "removes it, so it is never committed" (`.claude/skills/dotln-executor/SKILL.md:40`).
- `docs/evidence/WO-276/standing.md` is not in the tree. It exists only in checkpoint commits (`git log -- docs/evidence/WO-276/standing.md`: `be530500a`, `174c72ac2`, ...).

Every WO-282 point was likewise answered only in D015 and D019, with no follow-up. The WO-277 and WO-281 critics were answered in D009, D030, D007, D017 and D024. No later criticism was appended to `criticisms.md`, and WO-277-D030 explicitly declined to append one.

### Standing text and mechanisms

None of the following names the critic or its record: `.claude/skills/*/SKILL.md`, `packages/skeleton/src/loadouts/contributor.ts` (the source of the emitted roots), `CLAUDE.md`, `docs/product/*`, `docs/KIT.md`, `scripts/` and `packages/` (searched by grep). The critic-driven changes that did reach committed text or code are few, and none is a rule of conduct:

- **K13: a mechanism.** D062 added one sentence to the review helper's brief, telling the worker to read a file "as that tree holds it" (`scripts/lib/review-worker.mjs:875`).
- **K14, K4 and K3: product content corrected, not conduct.**
  - D093 added a sentence to product 07 (around line 956).
  - D144 corrected the gate refusal's text and product 07 (line 5586).
  - D046's index-refresh sentence is at product 07 line 816.
- **K9: the order's own deliverable.** D045 added a sentence to the release-close root for criterion A6.
- **K1: role text, but not from a critic.** The standing-file rule entered the executor root in WO-276 (`1763a2e28`, SKILL.md:40). It says when to write the file, not that the file must match the completed results.
- **K3: a rule that predates the critics and comes from the operator.** "A focused run reproduces one failure and never precedes it" has been in role text since `993e8096f` (2026-10-19). The final-review reuse rule has been there since `5336d0551` (2026-10-21). The rule "a complete gate never runs after documents alone" was written into product 07 §Discipline at lines 4377-4381 by WO-282-D024 (`1b02cb683`), on the operator's correction rather than a critic's. The role-text sentence was left open as FUP-915d215fcc824d1a.

### The planning pass's disposition of each class

The 2026-11-14 pass gave each class one of the following (pass:361-378):

- **Classes 1, 8 and 13:** "a check", meaning WO-279's advisory, cadence or kit-rendered brief. None of these is built.
- **The other 13 classes:** "nothing" or "nothing new".

The pass's condition for reopening is: "Reverse when the next order's critics or reviews find the class again after the line WO-279's critic draws" (pass:644-646). WO-279 is not started, so this has never been triggered.

The pass did the opposite of the warning in its own source: WO-276-D111's follow-up says "a rule alone is the weakest of the three" because classes recurred after rules existed.

## 3. Recurrence after a change

### Table: what changed and whether it recurred

| Kind | What changed | Recurred after? |
|---|---|---|
| K1 | (a) rules in a deleted standing file; (b) when-to-write rule in executor root; (c) WO-279 advisory planned only | Partly. No later order kept a standing file in the decisions read. Records lagged again in WO-282 critic 2 C2 and WO-277-D030 point 1 |
| K2 | (a); (d) pass:364 | Not observed. No later forecasts; independent critics never look for this (criticisms.md:172-178) |
| K3 | (a) in-session rules D043, D058, D141, D186; existing role text; (d) pass:365; after WO-282, product 07 §Discipline | **Yes.** WO-277-D018 (a complete run with `--again` after a repair that changed documents alone, 0 h 47 min); WO-281-D019 (16 focused runs one after another, 74 min, operator correction); WO-281-D024 point 2; WO-282-D024 (0 h 51 min complete run after one bullet changed; the operator called it critical) |
| K4 | (a) D103, D106, D182; existing role text "Claims of cause … name their supporting command and output" (since 2026-10-21); (d) pass:366, "the critic … watches" | **Yes.** Pass second-session critic points 2 and 4 (a failed gate reported as passed); WO-277-D009 point 2 (exit status lost in a pipe, the rule of WO-276 critic 31); WO-277-D030 point 2 ("exited 0", then exit 1: critic 41's rule) and point 3; WO-277-D013 (verifier); WO-281-D017 point 1; WO-281-D023; WO-282-D018 and C2-1 |
| K5 | (a) D103, D179; existing executor step 6; (d) pass:367 | **Yes.** WO-277-D009 point 2 (gate started without sync); WO-281-D007 (suites started on a stale decisions index); WO-282 C2-3 |
| K6 | (a); existing traced-consumers table; (d) pass:368 | **Yes, but cheaply caught by the gate.** WO-282-D017 and D020: complete runs 1 and 3 failed in 1 min and 22 s |
| K7 | (d) pass:369 | No occasion observed |
| K8 | (c) planned in WO-279 only | The hand-kept clock continued: WO-277-D002 (timer), WO-281-D002 (timer), WO-282-D001 (critic-timer.py). Not criticized again |
| K9 | (a); (d) pass:371 | **Yes.** WO-277-D009 point 1: a test case added against the order's non-goal on the session's own reading |
| K10 | (a) D103, D118, D182; (d) pass:372, "worker launch records the host's reported model" | **Yes.** WO-277-D009 point 3 (times); WO-281-D016 and D017 points 2 and 4 (counts, and settings recorded as what ran, the third time after D118 and D182); WO-282 C2-4 |
| K11 | (d) pass:373 | No occasion observed |
| K12 | (a); (d) pass:374 | **Yes.** WO-281-D007 point 3 ("nothing lost" on an inventory that reads no prose); WO-281-D028; WO-282 C1-1 and C1-3 |
| K13 | (c) D062 helper brief; D101 fixed charter; WO-279 brief planned | **Yes.** WO-281-D017 point 3: a reader was told to hash and copy under a live gate |
| K14 | (b) one product 07 content sentence (D093); (d) pass:376 | **Yes.** WO-282 C1-2 and C2-1; WO-282-D024 error 3 |
| K15 | (a) D091, D108; (d) pass:377 | **Yes.** WO-277-D030 point 1; WO-281-D024 point 1 (the same night WO-281-D017 promised to stop); WO-282 C1-4 |
| K16 | (a); (d) pass:378, "role text says to settle" | **Yes.** The pass's first session waited 2 h 13 min at a size limit (pass:67-75); WO-282-D024 error 3 |
| X1 | (a) WO-277-D010 in-session rule; FUP-0cfd840f500b9874 pending, never disposed | **Yes.** WO-281-D006 (the next day); WO-282-D024 error 2 |
| X2 | Role text "a previous instance is evidence … never the pattern" (since `29151045a`, 2026-10-30) | **Yes.** WO-282-D024 error 1 |

Of the 13 classes the pass marked "nothing", 10 recurred: K3, K4, K5, K6, K9, K10, K12, K14, K15 and K16. Three were not observed: K2, K7 and K11.

### Recurrences after a change: what the change was and why it failed

#### K3a: a complete run after a change to documents alone (WO-277-D018, then WO-282-D024)

**What existed.** The reviewer root stated the reuse rule four times before WO-282 (SKILL.md:12, 76, 78, 82), plus a fifth rule that a previous instance is never the pattern (SKILL.md:27).

**Why it failed:**

1. **The command printed the opposite at the moment of choosing.**
   - The closeout selection is printed by the briefing (`executor-readiness.mjs:19`) and by `worktree integrate` ("Owed by this order (its closeout selection; not run)", `closeout-scope.mjs:515`).
   - For a launchpad order whose criteria name `npm test`, it lists `npm test -- --review` as owed. By design it "supplies no passing row" (`closeout-scope.mjs:13`, `487-505`).
   - So the role text says "reuse when a row exists", while the tool output says "owed".
   - WO-282-D016's evidence records the briefing listing exactly `npm test -- --review` and `npm run test:docs`.
2. **The default was right, and the session overrode it.**
   - `npm test -- --review` reuses passing tasks at the same identity unless `--again` or `--fresh` is given (`scripts/test-runner.mjs:2725`, `2861-2868`). WO-277-D018's reused run took 1 min.
   - The reviewer typed `--again`. No role sentence names when `--again` is wrong.
3. **The role text is silent on authored documents.** It says "report/control/generated-document changes do not" change the identity (reviewer SKILL.md:82). It says nothing of authored documents like the kit guide.
4. **Two open register rows proposed the opposite.** WO-245-D005 and WO-277-D018 each asked for product suites to run again after a document change. The reviewer read them as the rule (WO-282-D024's misread field).
5. **The fix landed in a section no role reads.**
   - It went into product 07 §Discipline (line 4177 onward; the rule is at 4377-4381).
   - No role's Read directive names §Discipline. The reviewer and verifier read §Verification review and attack (reviewer SKILL.md:71; verifier SKILL.md:68), and the executor reads §Independent workflows and integration.
   - WO-282-D024's claim "Product 07, which every role reads" is unsupported by those directives. Whether sessions read §Discipline anyway is unknown: the read census is in the ignored lane, which I did not read.
   - The role text was deferred as compiled source, and FUP-915d215fcc824d1a is still open.

#### K3b: focused suites run one after another (WO-281-D019)

**What existed.** The executor root has said "a focused run reproduces one failure and never precedes it" since 2026-10-19 (SKILL.md:15).

**Why it failed:**

- **The order template says the opposite.** Product 07's template tells the planner to spell "each single-suite check as `npm test -- --only <suite>`" and calls those suites "the order's handoff gate" (product 07:2300-2304). WO-281's executor ran them "as step 2 to step 5's checks and the Preflight line name them" (D019).
- **WO-276 had already named this contradiction.** Critic 9 (D058) said the suite rule was stated two ways.
- **The fix was a rule inside the order.** WO-281-D019 says "From here no suite is run alone…".
- **The next order repeats the shape.** WO-279's text names `npm test -- --only` 31 times in per-step "Check:" lines and a 14-suite Preflight line.
- **The critic pointed the wrong way.** WO-281 critic 1 treated running the suites as a batch as an unrecorded departure from the order's per-section checks (D007 point 2). Critic 2, reading a session most of the way through 74 minutes of runs one after another, raised nothing about their cost (D017). Only critic 3, after the operator's correction, did (D024 point 2).

#### K15: writing a planned fix as done (WO-281-D024 point 1, then WO-282 C1-4)

**What existed.** The rule of WO-281-D017, written the same night.

**Why it failed.** The executor root requires "first record each distinct finding in that decision's `roundFindings` array, then fix the union", and the disposition must be `fixed` or `recorded` (SKILL.md:88; `ROUND_DISPOSITIONS = ["fixed", "recorded"]`, `scripts/lib/round-findings.mjs:20`). The schema forces "fixed" to be written before the fix exists.

**The cause was named and kept.** WO-281-D024 saw this and declined to change it ("the array admits fixed or recorded … the text beside it carries the tense"). WO-282 repeated it the next day.

#### K10: requested model and effort recorded as what ran (D118, then D182, then WO-281-D016 and D017)

**What existed.** The rules of WO-276-D118 and D182.

**Why it failed.**
- The critic launcher's last line prints `critic N: <model> at <effort>; …` with no "requested" label (`docs/evidence/WO-276/critic/launch.mjs:209-210`), and that line was copied into records.
- The pass's disposition (pass:372) relied on the kit's worker launch reading back the host's model, but the critic launcher bypasses the kit's worker launch.

#### K4: status read from a pipe or log (D106 and D182, then WO-277-D005, D009 and D030 point 2, then the pass's critic point 4)

**What existed.** Rules held only in WO-276's decisions and standing file.

**Why it failed.** No role text says that a status comes from the checked command's own exit line, never from a chain's. The general sentence (SKILL.md:49) was there and did not prevent it.

#### X1: the operator not answered (WO-277-D010, then WO-281-D006, then WO-282-D024 error 2)

**What existed.** WO-277's rule (keep lines between tool calls short) was in-session only. Its register row FUP-0cfd840f500b9874 has no disposition.

**Why it failed (inference).** The role sentence says to answer "in your next message one of two ways, with the evidence" (executor SKILL.md:48; reviewer :45). The phrase "with the evidence" invites gathering first. In WO-282-D024 the reviewer "checked texts and wrote records for about five minutes before it answered".

#### X2: a pending row or earlier session's choice taken as the rule (WO-282-D024 error 1)

**What existed.** The sentence "a previous instance is evidence of what happened, never the pattern" (SKILL.md:27).

**Why it failed.** The sentence is scoped to "every artifact's shape", not to checks or commands. Two open rows and WO-277-D018's reasoned `--again` all pointed the same wrong way.

## 4. How the loop is built

### Where a criticism goes today

1. The report goes into the ignored reviews lane (README.md:30-34).
2. It is given to the operator whole (README.md:67-69).
3. Each point is answered in that order's decisions file.
4. Any change in how the session works goes into the order's decisions and its standing file (README.md:79-81). Completion deletes the standing file (executor SKILL.md:40).
5. Only WO-276's points and WO-282's are in a criticisms file, and they are in two separate ones. The 27 points of WO-277, WO-281 and the 2026-11-14 pass live only in decisions or the pass document.
6. A point reaches planning only if its decision carries a `followup`, which mints a register row. Conduct answers almost never do. The exceptions are WO-276-D111, D113 and D115, and WO-277-D030, whose row FUP-5e8a7883add5361b (add WO-277's points where WO-279 keeps the list) has no disposition.

### Who is required to read it

- **The executor of the same order.** It is bound only by a README, which is a record. No role text, briefing or hook names the critic.
- **Nobody else.** No later order's role, and no planner role, is directed to read `criticisms.md` or earlier critics' decisions. The 2026-11-14 pass read the record because the operator asked what had become of it (pass:349-355).

### What requires a change to standing text or a mechanism

Nothing does. The one decision that asked for a change per class (WO-276-D111) was answered "nothing new" for 13 of the 16 classes.

### What would show a change worked

Nothing is measured:

- Later points carry no class tag.
- No count of recurrence per class exists.
- The reopening condition depends on WO-279.
- The critic is not given earlier orders' findings: its charter points it only at this worktree's transcripts (charter.md:10), so it cannot say "third time".
- The only series that tracks outcomes is the cost table's `operatorCorrections` per order (3, 3, 3, 8, 57, ending at WO-276). It is not split by class.

### Whether WO-279 closes the loop

As written, it does not.

**What WO-279 does:**
- makes the critic launchable by name, on Claude, with Opus at xhigh by default;
- journals, counts and screens each launch;
- adds one class-1 advisory that compares file times;
- computes a cadence that is off by default and ends "at the dispatch's first passing complete run" (WO-279:189-194);
- records the 16 classes' dispositions in its own decisions file (WO-279:284-287), which is another record;
- counts launches, not findings (WO-279:206-209).

**What WO-279 does not do:**
- tag a point by class;
- route an accepted point to role text or a default;
- measure recurrence;
- include the 35 later critic points (it cites only WO-276's file);
- cover verification or final review, where WO-282-D024 happened;
- require the launch to print requested and host-reported settings apart (its criteria do not name this).

**WO-279 also carries two of the recurring causes itself:**
- 31 per-step `npm test -- --only` checks;
- the charter's subject, "the AI agent … that is executing" (charter.md:1).

## 5. What the operator caught that the critic would not have, or did not

1. **WO-282-D024 (all three errors).** These happened in the final review, 14:20 to 15:40. The critic's clock ended at the passing complete run at 08:46:10 (WO-282-D021 `criticCadence.endedAt`), and its charter's subject is the executor alone. A critic with this charter and cadence could not have seen them.
   - **What it would need:** a subject of "the sessions working on @ORDER@ in any phase", and a clock that does not end before a later phase starts a gate.
2. **WO-281-D019 (74 min of focused runs, one after another).** The critics did run during this. Critic 1 held the executor to the order's step list (D007 point 2). Critic 2 said nothing about the cost (D017). Critic 3 spoke only after the operator had (D024 point 2).
   - **Why:** the charter's tests include "fails to do something they asked for" (charter.md:12) and give no cost standard. So the critic judges against the order's letter, which contradicts the role text.
   - **What it would need:** one sentence telling the critic to judge gate time against the cheapest route the role text admits (reuse of a passing row, or one complete run with `--keep-going`), not against the order's step list.
3. **WO-277-D018 (the `--again` complete run after a documents-only repair).** No critic ran in the repair. WO-277's critic 2 later read the repair's transcript and made five points (D030), none about this run.
   - **Why:** no text then said the run was wrong, and the critic has no record of the operator's standing preferences.
   - **What it would need:** the open critical register rows as a named source, and the cost sentence above.
4. **The start of every critic since WO-276.** Each launch began with the operator's request: the pass (item 11), WO-277-D002, WO-277-D029, WO-281-D002 and WO-282-D001. WO-279's on-request default keeps that by design.
5. **X1, the operator not answered.** The charter's What to judge (charter.md:12) names how a session handles the operator's message but nothing about how long the operator waits. The 2026-11-14 pass's critic found 34-minute and 16-minute gaps only when the operator directed it at the second session.
   - **What it would need:** one clause, an operator message not answered in the session's next message, measured by the transcript's times.
6. **Not operator-caught, but invisible to the critic.** The verifier's truncated reads and guessed paths recurred within one session (WO-277-D020, then D022) and in the next order (WO-281-D028). The critic never runs in verification.

## 6. Recommendations

Ordered by the operator time each would have saved. None adds a refusal or a hard stop.

### 1. K3a: complete run after documents alone (about 0 h 51 min in WO-282 and 0 h 47 min in WO-277, plus four operator messages)

- **Change:** make the closeout selection read the gate index. When a passing complete review row stands at the current code identity, print `npm test -- --review: satisfied by the passing row recorded <time> at this code identity; not run again` and list only `npm run test:docs` as owed. Separately, have `--again` and `--fresh` print that row and its time as their first line. This is a line of output, not a refusal.
- **Where:**
  - `scripts/lib/closeout-scope.mjs`, in `closeoutCommands` and `because`, which the briefing and `worktree integrate` print;
  - `scripts/test-runner.mjs`, the `again` branch around line 2725;
  - the open FUP-915d215fcc824d1a role sentence, written into reviewer step 5 and executor step 8 themselves, not as a separate rule.
- **Observation that it worked:** after a documents-only edit, no complete row is started in a final review whose identity already holds a passing complete row (gate ledger), and the briefing's printed selection lists only `npm run test:docs`.

### 2. K3b: focused suites run one after another (74 min in WO-281, and set to recur in WO-279)

- **Change:** remove a step. Drop per-step `Check: npm test -- --only <suite>` from the order template. A step's check becomes a single bounded case, or none; the one complete run with `--keep-going` is the gate.
- **Where:**
  - product 07 §Operator-opened planning pass, the template bullet (lines 2300-2304), and the planner root that carries it;
  - WO-279's execution plan steps 1 to 8 and its Preflight line, amended before dispatch.
- **Observation that it worked:** WO-279's gate rows hold no `--only` suite run before its first complete run, except to reproduce a failure that run named.

### 3. X1: the operator not answered (5 minutes in WO-282, 16 and 34 minutes in the 2026-11-14 pass)

- **Change:** remove a precondition. Reword the shared sentence to "answer it in your next message with what you know now, then gather evidence", replacing "one of two ways, with the evidence".
- **Where:** the shared rule in `packages/skeleton/src/loadouts/contributor.ts` emitted as executor SKILL.md:48 and reviewer :45. Also dispose FUP-0cfd840f500b9874.
- **Observation that it worked:** the operator sends no follow-up asking whether they are being ignored. In the session hook's prompt observations, the assistant's first text after an operator message comes before its next tool call.

### 4. The critic's blind spots: K3 and X1 in later phases, and judging by the order's letter

- **Change:** two sentences in the charter.
  - The subject becomes "the sessions working on @ORDER@ in any phase".
  - Add to What to judge: gate and run time against the cheapest route the role text admits, not against the order's step list; and an operator message not answered in the session's next message.
  - Where a cadence is on, it ends at the order's final-review result, not the first passing complete run.
- **Where:** `docs/evidence/WO-276/critic/charter.md:1` and `:12`, as WO-279 moves it to a kit path, and WO-279's Design line on when the clock ends (WO-279:193-194).
- **Observation that it worked:** a critic launched on request during a verify or final-review dispatch returns points about that role, and a later critic flags a run of focused suites one after another before the operator does.

### 5. Closing the loop for every kind

- **Change:** one sentence in the charter and one in the role text that answers critics.
  - **Charter:** "for each criticism name the class of `criticisms.md` it repeats, or new, and the sentence in the role text, order or command output the session had in front of it that forbade or caused it (file:line), or none found."
  - **Role:** "an accepted point that names such a sentence gets a decision `followup` naming it." `plan -- followups --sync` then mints the row.
  - The next pass re-disposes any class marked "nothing" that has a new row. This replaces the 2026-11-14 pass's reversal condition, which can never take effect before WO-279.
- **Where:** charter.md's criticisms format (lines 18-20); WO-279 step 9's role text in `contributor.ts`; the planner's §Retained planning follow-ups reading.
- **Observation that it worked:** the next pass counts recurrences per class from register rows without reading prose. The cost table's `operatorCorrections` for orders after WO-279 falls below WO-260's 8.

### 6. K15: planned fixes written as done

- **Change (default):** admit `to-fix` in the round-findings vocabulary. Change the role sentence to "write `fixed` only after the check that shows it". Completion keeps refusing nothing. A `to-fix` left at handoff is an advisory.
- **Where:** `scripts/lib/round-findings.mjs:20`, and the executor sentence in `contributor.ts` emitted as SKILL.md:88.
- **Observation that it worked:** no later critic or verifier point of the form "a planned fix recorded as made".

### 7. K10: requested settings recorded as what ran

- **Change (default output):** the launch's last line prints `requested <model> at <effort>; host reported <model|unknown>, effort <selected|unknown>`.
- **Where:** WO-279 criterion 1 and its `launchKind` output. Until then, the kept `launch.mjs:209-210`, as a scratch copy, since the kept file is a record.
- **Observation that it worked:** no later point in which settings were recorded as what ran.

## Unverified or unknown

- Whether WO-282's reviewer read the closeout selection's "owed" line before typing `--again`. That is in the transcripts, which were not read. The integrate helper prints that line after "took in nothing" (`scripts/test-worktree-integration.mjs:2950`).
- Whether any session reads product 07 §Discipline without a directive. That is unknown: the read census is in the ignored lane.
- The cause of lines missing from the transcript (X1). It is unknown, as recorded in WO-277-D030's reopening of D010.
- WO-276 rows other than critics 3, 19, 26, 30 and 33 were not checked against their decisions, by the record's own statement.
- The class placement of WO-282's eight points, and the recurrence mapping of later points, are my reading of paraphrased decisions.
