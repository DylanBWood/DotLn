# WO-249 decisions

## WO-249-D001

```json
{
  "id": "WO-249-D001",
  "date": "2026-11-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.108.0, the next minor above the observed release baseline v0.107.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.107.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-249-criteria-judge-the-product.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-249-D002 — The role sentences, the oracle that pins them and the planner's accepted bytes

```json
{
  "id": "WO-249-D002",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 6, the role text",
  "decision": "packages/skeleton/src/loadouts/contributor.ts carries the order's role text: the off-ramps sentence every non-router role reads names waive with the words rule, withdraw, retract and reopen-handoff from the operator's captured words, and defect as the verifier's or reviewer's record in the five classes, which the executor never records; the shared routine-questions sentence says an executor records a criterion of the five classes unmet with its class named for the verifier and asks the operator nothing; the verifier gains the funnel sentence (a blocking finding names the criterion it fails and the supported input that reproduces it, or the behavior main had and its probe; a constructed input outside the supported vocabulary is a follow-up; the clean-room floor and authority or credential boundaries still block), the findings block for a fail and the defect route, and its line-form sentence names the defective form; the reviewer's findings-block sentence names the basis and reproduction and the fail rule, and its line-form sentence the defective form, the pass that judges every standing record and the dispute by a blocking basis; the planner gains the five-class screen before filing and the criteria advisory lint. npm run sync regenerated both skill roots, and packages/skeleton/fixtures/wo249-role-baseline.json pins both role trees at both economy settings, linked to wo247-role-baseline.json, whose chains stay byte-exact; scripts/test-runner.mjs declares the new oracle as a process-debt input, and the oracle test asserts each role carries its sentences. The planner root breaches its ceiling, so its acceptance is recorded under the standing route.",
  "evidence": [
    "Installed cold-start bytes (CLAUDE.md plus the role's skill, both roots identical), before at a6665a24 and after npm run sync: executor 38,400 -> 38,964 (accepted ceiling 40,194); verifier 33,233 -> 34,538 (35,221); reviewer 36,003 -> 37,010 (39,600); release-close 23,505 -> 24,069 (26,410); planner 24,313 -> 25,540 against 24,576; refuter 23,127 -> 23,691 (no ceiling); router 15,418 unchanged (16,384), because it carries neither the shared sentences nor the off-ramps sentence.",
    "docs/control/budgets.json: the planner acceptance dated 2026-11-02 sets coldStartBytes.planner to 29,636, the measured 25,540 plus one 4,096-byte step, as the standing route of 2026-09-17 directs and every earlier role acceptance did.",
    "npm run sync first refused role-oracle ('Record the authorizing role-change decision and mint a new linked role oracle'); node scripts/check-role-oracle.mjs passes after the mint, and npm test -- --only process-debt passes with the oracle declared (it failed first on 'every role oracle is a declared input of the suite that walks it').",
    "The oracle was minted with a deterministic script that reads harnessInstallation() at both economy settings and the installed CLAUDE.md block, the measure scripts/test-gate-followups.mjs applies; its startupCost links each role to WO-247's recorded bytes."
  ],
  "rejected": [
    {
      "option": "Putting the executor's class sentence only in the executor's procedure to spare the other roots",
      "reason": "The order names the shared routine-questions sentence (line 85), and the verifier and reviewer read the same rule: the executor names the class and nobody asks the operator."
    },
    {
      "option": "Trimming reviewed role text to keep the planner under 24,576",
      "reason": "Ceilings are planning's alone and no order trims reviewed text to a figure; the standing route records the acceptance."
    }
  ],
  "reopenWhen": "A later role edit mints the next oracle, a root exceeds its accepted ceiling, or a planning pass that evaluates instruction-byte optimization reads these roots."
}
```

## WO-249-D003 — The operator's direction to pause before the final gate run

```json
{
  "id": "WO-249-D003",
  "date": "2026-11-02",
  "dispatch": "resume: next; the operator's mid-turn direction to pause before the final gate run",
  "decision": "Read as: finish the implementation, write-backs, focused preflight probes and the three independent reviews, then stop before starting the complete npm test -- --review run and wait for the operator's word. The executor stops there; the complete run, the handoff's criterion judgments that stand on it, npm run test:docs and implementation-ready follow only after the operator says to continue.",
  "evidence": [
    "The message arrived mid-turn while the executor was reading the cited sources; the executor's procedure names one complete run, npm test -- --review, as the final gate before the handoff, and the focused npm test -- --only runs are preflight probes, not that run.",
    "The executor role text: only an explicit pause, stop or scope prefix changes work; this is an explicit pause with a named point.",
    "The executor paused there and reported; the operator then told it to continue, captured in docs/intake/notes/wo-249-continue-2026-11-02.md (sha256:569c90e7464216e0ce321ff67c459fdf6db81c47d31d68d0f664f99b75cf8f34), and the integration of main (D022) and the complete run followed."
  ],
  "rejected": [
    {
      "option": "Pausing before any gate, focused probes included",
      "reason": "The operator named the final gate run; the preflight probes are the steps the order's Preflight field names before it."
    },
    {
      "option": "Pausing after the complete run, before implementation-ready",
      "reason": "That is after the final gate run, which the direction says to stop before."
    }
  ],
  "reopenWhen": "The operator says the pause meant a different point."
}
```

## WO-249-D004 — Where the three events are known: counted by planning, and two of them stop a drive and count as directions

```json
{
  "id": "WO-249-D004",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4, the events where CriterionWaived is listed",
  "decision": "scripts/lib/plan-failures.mjs counts all three events as off-ramps, with each defect also counted by class. scripts/lib/drive-route.mjs stops a drive at OffRampRetracted and HandoffReopened beside CriterionWaived, and scripts/lib/meta.mjs counts those two as operator directions; CriterionDefectRecorded is in neither list. scripts/lib/control-time.mjs also knows HandoffReopened: a reopened handoff starts its phase again, so the next completion is timed from the reopening.",
  "evidence": [
    "drive-route's list is the operator's recorded directions ('Inspect the operator's recorded direction before another drive phrase'); meta's directionEvents counts 'the operator's directions, counted from what the record publishes'. A retraction and a reopened handoff are the operator's acts through a capture; a defect record is the verifier's or reviewer's judgment.",
    "The order's Non-goals exclude 'an operator confirmation before an order goes on', and its Design rejects the operator's confirmation because 'unattended progress is the point'; a drive that stopped at every defect record would be that confirmation.",
    "scripts/test-drive.mjs: the stop table stops at OffRampRetracted and HandoffReopened, and a verified order with a CriterionDefectRecorded routes to final-review; scripts/test-process-debt.mjs counts the two as directions and the defect as none."
  ],
  "rejected": [
    {
      "option": "Listing CriterionDefectRecorded in both lists, as step 4's wording 'the three events known where CriterionWaived is' reads literally",
      "reason": "It would stop a drive for operator inspection at every defect record, the confirmation the non-goal excludes, and count a role's judgment as an operator direction in the meter."
    }
  ],
  "reopenWhen": "The operator asks that a defect record stop a drive or count as a direction."
}
```

## WO-249-D005 — A defect record: who records it, when, and what it binds

```json
{
  "id": "WO-249-D005",
  "date": "2026-11-02",
  "dispatch": "resume: next; steps 1 and 2, the event and the command",
  "decision": "npm run resume -- defect <criterion> --class <class> --evidence <text> <actor-flags> is legal in verifying and final-review, the phases in which the verifier and the reviewer judge the order. It refuses a class outside the five, a criterion the order does not declare, the order's executor (the waiver's rule) and a second record for the same criterion text. The event carries the criterion id, the SHA-256 of the criterion's text as declaredCriteria reads it (wrapped lines joined), the class, the evidence and the recording session's role. One record judges a criterion: a waived criterion takes no defect record and a recorded one no waiver until retract undoes it, and a record for a criterion's amended text replaces the earlier record in defectiveCriteria. The recording session's observed role is recorded, not required. The operator's retraction stands for the text it judged: a record for text whose record the operator retracted is refused, naming the retraction, until the criterion is amended. waive, defect and retract each refuse the order's executor once the phase admits them and their arguments and actor flags parse, before anything they judge about the record.",
  "evidence": [
    "The Cost: 'recorded by a verifier or reviewer and refused to the order's own executor as waive is (2048 to 2054)'; criterion 1: the executor's command and a class outside the five are refused naming the reason, and a fresh defect for amended text is admitted.",
    "scripts/test-off-ramps.mjs WO-120: the executor, an unknown class and an undeclared criterion are refused; the record carries sha256 of 'The briefing grows by at most 400 bytes.'; after the order file is amended the cited line is refused and a fresh record replaces the earlier one.",
    "A report line cannot cite two records for one criterion: the criterion line form carries one ordinal.",
    "Review round (D017): the criteria adversary's finding 4 re-recorded a retracted defect identical to the original at once, and the WO-124 fixture did the same and closed, so the retraction had no lasting effect.",
    "scripts/test-off-ramps.mjs WO-120 refuses the identical record after the retraction and admits it once criterion 3 is amended; WO-124's repair amends criterion 3 before the verifier records it again; WO-123 refuses a defect while the criterion is waived and admits it after the waiver's retraction."
  ],
  "rejected": [
    {
      "option": "Requiring the recording session's role to be verifier or reviewer",
      "reason": "Codex and Copilot sessions and an operator's terminal may have no observed journal; the phase and the executor refusal carry the rule, as they do for waive."
    },
    {
      "option": "Letting a waiver and a defect record stand for one criterion",
      "reason": "A report judges a criterion on one line with one ordinal; two records would leave the line ambiguous."
    },
    {
      "option": "Admitting the identical record again after a retraction",
      "reason": "The operator's retraction would undo nothing: the next session could record the same judgment of the same text at once."
    },
    {
      "option": "Admitting a fresh record of another class for the retracted text (the adversary's round-2 N7)",
      "reason": "The capture says why the operator retracted, which the command cannot read; a record of another class would sidestep a retraction of the judgment itself, while an amendment or a second retraction keeps the operator's words decisive."
    }
  ],
  "reopenWhen": "A planning pass finds a recorded class that does not fit its definition, or a host gives the recording role a readback the command can check, or an operator asks that a retracted record's text be recordable again without an amendment."
}
```

## WO-249-D006 — How a report line is judged against the record

```json
{
  "id": "WO-249-D006",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3, the defective line and judgeCriterionLines",
  "decision": "scripts/lib/off-ramps.mjs reads `**Criterion <id>:** unmet, defective (<class>) by <ordinal>` beside the waived form. The line is admitted when a standing record of that criterion sits at that ordinal with that class, the criterion's current text hashes to it, no retraction names it and its paragraph holds evidence; each failure is refused by name. A pass of either result command must judge every standing record, on its defective line or a met line, which stands over the record. A plain unmet line over a standing record is refused except in a fail whose blocking finding's basis names the criterion. A line citing a retracted waiver or record is refused naming the retraction. A judgment's paragraph now ends at the next judgment, an unfenced heading or a findings block marker: only an unfenced heading ends it, which repairs WO-247-D015, and the findings block is never read as evidence. Evidence is judged present when the line's remainder or its paragraph holds a letter or digit; whose evidence it is cannot be read mechanically. A report's header fields (`**Actor attestation:**`, `**Actor:**`, `**Process cost:**`, `**Verdict:**`, `**Subject:**`, in bold, in any case, as a list item or a quotation, with the colon inside or outside the emphasis; a plain `Subject:` line stays evidence) are never a judgment's evidence, and the evidence a defective line owes may stand on any line of the report that judges the criterion the same way, so a summary line stands on its detailed line. A pass judges every standing record of a criterion the order still declares; a criterion a planning pass struck is judged by no report, so its standing record needs no line.",
  "evidence": [
    "Criterion 2 names the FINAL pass that omits the line or carries it with an empty paragraph; the same rule binds a verification pass because the defective line is judged against the record wherever it appears (Design: 'checked against the record as the VER line is').",
    "scripts/test-off-ramps.mjs: the empty-paragraph case was first admitted because the default findings block after the line carried letters; ending the paragraph at the block's marker fixed it, and a criterionJudgments case pins it.",
    "Criterion 6: a citation after a fenced example holding a heading stays with the judgment; the existing wrapped-line, blank-line and fenced-example cases pass.",
    "WO-247-D015 (FUP-f8073a2c2a4e0600) boarded the fenced-heading repair to this order's step 3.",
    "Review round (D017): the adversary's finding 7 admitted a defect line followed only by `**Verdict:**` or `**Process cost:**` and refused a summary bullet whose detail line carried the evidence; its finding 6 refused every line for a struck criterion's standing record except a false met. scripts/test-off-ramps.mjs WO-120 now refuses the header-field case and records a pass whose summary line stands on its detail line; WO-123 records a pass that omits the struck criterion 3 while its record stands.",
    "Round 2 (D018): the adversary's N5 admitted `**Verdict**: pass.`, `1. **Verdict:** pass.` and `**Process Cost:**` after an evidence-free line; scripts/test-off-ramps.mjs WO-120 now refuses four such forms. The five names are the header fields filed reports carry (598, 420, 399, 238 and 63 occurrences of the bold forms under docs/verifications and docs/final-reviews on 2026-11-02); `**Gate claims:**` appears in none, so it is not screened.",
    "Round 3 (D019): the adversary's R3-2 found the unemphasized form refusing real evidence, since 'Its subject is a count' is the bookkeeping class's own definition; the screen now requires the bold, and scripts/test-off-ramps.mjs asserts a plain `Subject:` line is evidence while `**Subject:**` is not."
  ],
  "rejected": [
    {
      "option": "Judging that the reviewer's paragraph is its own evidence and not a copy of the verifier's",
      "reason": "That is a natural-language reading the order's Design rejects for captures; the line's presence and a non-empty paragraph are what the command can judge."
    },
    {
      "option": "Requiring the omission check of the final review only",
      "reason": "A verification pass that omits a record it or an earlier verifier made would pass a criterion it never judged."
    },
    {
      "option": "Ending a judgment's evidence at the first blank line (the design review's finding 13)",
      "reason": "Criterion 6 keeps a receipt cited in a following paragraph, after a fenced example, with the judgment above it; the unrelated text the reviews found was the report's header fields, which are now excluded."
    },
    {
      "option": "Refusing a closing prose sentence or a quoted earlier judgment as evidence (the adversary's round-2 N5)",
      "reason": "Prose after a judgment is its evidence until the next judgment or heading (criterion 6), and the line forms admit a quotation as a judgment; whether evidence is the judge's own is the role's duty, which no screen over prose can read."
    }
  ],
  "reopenWhen": "A real report's evidence paragraph is refused or admitted wrongly, or a report form other than a paragraph carries criterion judgments."
}
```

## WO-249-D007 — A fail names what it failed on, in both result commands

```json
{
  "id": "WO-249-D007",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3, the fail refusals",
  "decision": "verification-result fail and final-review-result fail refuse a report whose findings block is absent or unreadable, naming the block's cause, and one with no plain unmet line and no blocking entry ('a fail names an unmet criterion or a blocking finding'). A blocking entry's basis ({\"criterion\": \"<id>\"} or {\"regression\": \"<the behavior main had>\"}) and reproduction (a contained file under the order's evidence directory) are read when the block parses; their problems print one advisory per report and record. This tightens WO-187's final-review rule, under which a failed review with an unreadable block recorded with an advisory. Every fixture that recorded a fail over a report without a block now writes one: scripts/test-off-ramps.mjs (its report helper writes an empty block, findings: null omits it), test-resume.sh, test-verifier-gate-claims.mjs, test-verification-review.mjs, test-harness.mjs, test-target-worktree-start.mjs, test-checkpoint.sh, test-harness-probe.mjs and test-derived-orders.mjs; a fail whose criteria are all met carries one blocking regression finding as its basis. One reader, blockingBasis, serves both the advisory and the dispute rule, so an entry carrying both keys is no basis for either; a basis's criterion is read as a string whether the block gives a string or a number, and a basis naming a criterion the same report judges met advises, as one the order does not declare does. A fail refusal appends the findings block's form and the basis forms; other refusals do not.",
  "evidence": [
    "The Cost and step 3: the two new refusals sit in judgeCriterionLines, which both result commands call through requireCriterionLines; criterion 5's cases: a fail with every line met and no blocking entry, an absent block and an unreadable block are refused; a blocking entry with a regression basis and a present reproduction records without advisory; entries without them advise and record (scripts/test-off-ramps.mjs WO-121 and WO-122).",
    "scripts/test-verification-review.mjs: the block table's rows WO-812, WO-814, WO-816 and WO-819 and FINAL-002's prose-only fail now assert the refusal; FINAL-002's unmeasured fail rests on its unmet line with an empty block, so the later counts keep one unmeasured review; the recorded helper counts the basis advisory beside the count advisory.",
    "The basis advisory is one line per report so that a report's advisories stay countable: test-verification-review's recorded helper counts lines per report path.",
    "Review round (D017): the design review's finding 2 found the dispute rule reading entry.basis directly while the advisory judged a two-key basis as none; the adversary's finding 13 found a numeric criterion reported as undeclared and a basis naming a met criterion admitted silently. scripts/test-off-ramps.mjs WO-122's F3, a numeric basis naming the met criterion 3, advises 'a basis criterion 3 the report judges met'."
  ],
  "rejected": [
    {
      "option": "Refusing a blocking entry that lacks its basis",
      "reason": "WO-187 made the block advisory so a malformed block never blocks recording; only a fail's agreement with its own lines is refused (Design)."
    },
    {
      "option": "Applying the fail rule to verification only",
      "reason": "The Cost places both refusals in the shared judgment function, and a final review that fails also names what it failed on."
    }
  ],
  "reopenWhen": "A real fail is refused although its report names its basis, or the findings block gains a field the basis duplicates."
}
```

## WO-249-D008 — A passing verification without a findings block advises

```json
{
  "id": "WO-249-D008",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3 and criterion 5, 'a pass with the same block prints the advisory as today'",
  "decision": "verification-result pass with an absent or unreadable findings block prints one advisory naming the cause and the block's form and records; final-review-result pass keeps its existing advisory. The advisory rides on the event's evidence.",
  "evidence": [
    "Before this order verification-result read no findings block; only final-review-result printed the block advisory (scripts/resume.mjs at a6665a24). Criterion 5 states the pass behavior for verification-result, so 'as today' is read as the advisory final review prints today.",
    "4 of 397 VER reports under docs/verifications carried a findings block on 2026-11-02; verifiers now need one for a fail, and the role text says so."
  ],
  "rejected": [
    {
      "option": "Printing nothing on a verification pass",
      "reason": "Criterion 5 asks the pass to print the advisory, and a verifier who never sees one learns of the block only at a refused fail."
    }
  ],
  "reopenWhen": "The advisory proves noise on passing verifications, or the operator reads the criterion otherwise."
}
```

## WO-249-D009 — A retraction in closed reads the merge as release close does

```json
{
  "id": "WO-249-D009",
  "date": "2026-11-02",
  "dispatch": "resume: next; steps 1, 2 and 4, the retraction's route back",
  "decision": "npm run resume -- retract <ordinal> is legal in verifying, verified, needs-fix, final-review and closed, the phases the Cost lists. In closed it fetches origin's main through the drive's host lane (fetchMergedBases) and reads routeFacts, the route table release close's merge rule shares: merged is the order's branch an ancestor of origin/main with its passing final review in origin/main's record. Unmerged, the event (pullRequest unmerged) is appended in the order's worktree and folds to needs-fix with failureSourceId retraction-<ordinal> and failureSourcePath the capture, which the repair briefing names; release close refuses while a retraction other than a merged-form one is newer than the latest passing final review (unrepairedRetraction, checked before the phase check so the refusal names the retraction), read from origin/main's record and, while the order's worktree is registered, from that worktree's record, where an unmerged retraction stays when the branch merges without its repair; run from main, the unmerged form's refusal names that worktree. Merged, the event (pullRequest merged) is written from main to main's pending lane, which scripts/lib/pending-overrides.mjs now admits beside override records, so the next worktree start carries it into the record; it changes no phase and its message names planning's follow-up route. A failed fetch, an unreadable route and a released order refuse. For a target order, merged also needs its target branch merged: orderMerged in scripts/lib/drive-route.mjs is the one rule the drive's awaiting-merge stop and the retraction read. A second pending retraction of the same record is refused at record time, because the lane validates a record against the order's whole segment and the lane's earlier records for that order, which also keeps a legacy log's global ordinals naming their events. The worktree's retraction is judged against origin/main's latest passing final review, not the worktree's: a repair that passed in the worktree answers it only once merged. A registry or worktree record the close cannot read refuses naming the worktree. The carry folds each lane record after the lane's earlier records, and carries a record the target already holds as held without folding it again; the lane reader checks each file's name and containment and names a file that fails to parse. A merged-form retraction from main is also refused when a registered worktree's record of the order already holds a retraction of that ordinal, which a worktree start carried there and main shows nowhere until that branch merges. A record any control already holds is never folded twice, on record or carry; the lane is read only for a retraction, so an unrelated malformed lane file never refuses an override record. The close reads a target order's launchpad worktree even when its target worktree is gone. The refusal names the retraction's form: a merged-form one a start carried waits for that branch's merge, and an unmerged-form one the order's worktree recorded before a merge that left it unrepaired is answered by the repair there. Worktree paths are compared by physical identity.",
  "evidence": [
    "The Cost: legal 'while the order's pull request is unmerged (the state the close already reads)'; in closed returning the order to needs-fix; after the merge recording the event and the words, returning nothing to needs-fix and naming the planner's follow-up route; Rejected: a retraction after release close.",
    "scripts/lib/drive-route.mjs routeFacts computes merged and released for a closed order as release close judges them; release.mjs close reads origin/main's control state, so a retraction appended in main's tracked segment would dirty main and block the close, and one appended in the order's worktree after the merge would leave with the worktree; main's pending lane is the existing route for a closed order's record (override-record, WO-219-D050).",
    "scripts/test-off-ramps.mjs WO-124 runs both forms in their own repository with a main checkout, the order's worktree and a bare origin; scripts/test-release.sh release_case_unrepaired_retraction shows the close refusing an order whose merged record holds the retraction after its pass.",
    "Without a main checkout the read refuses ('no main-branch control-plane worktree found'), as the WO-124 case's first refusal shows.",
    "Review round (D017): the adversary's finding 1 showed the close admitting an order whose worktree held an unrepaired retraction after its branch merged without the repair, since the event is appended uncommitted in the worktree and the reviewer pushes only on a pass; its finding 2 and the design review's finding 1 showed two identical pending retractions blocking the whole lane at the carry; finding 11 and design finding 4 found the target side unread.",
    "scripts/test-release.sh release_case_worktree_retraction refuses the close over a retraction held only in the order's registered worktree and names the worktree; scripts/test-off-ramps.mjs WO-124 records nothing when the fetch fails, refuses a duplicate pending retraction from main naming the lane's record, and refuses a released order.",
    "Round 2 (D018): the adversary's N3 closed an order whose worktree held a retraction and a newer, unmerged passing review, publishing main's unrepaired code; scripts/test-release.sh release_case_worktree_retraction now appends that repair cycle to the worktree's record and the close still refuses. Its N4 kept the whole lane back when a start re-carried a retraction the target held; scripts/test-off-ramps.mjs WO-124 carries the record twice into the order's checkout and appends it once. The design review's item 1 found the carry validating each record alone, and its C a malformed lane file raising a bare SyntaxError.",
    "scripts/test-off-ramps.mjs WO-124 runs retract from main while the order's branch has moved past origin's main: the refusal names the order's worktree and main's segment is unchanged.",
    "Round 3 (D019): the adversary's R3-1 recorded a second merged retraction after the first was carried into wo-125 and carried it into wo-126, two branches holding different events for one record; scripts/test-off-ramps.mjs WO-124 carries the record into the order's checkout and refuses the same retraction from main, naming that worktree. Its R3-5 found the read skipped when a target order's target worktree was removed (order-worktrees.mjs sets present only with both); untested here, since the release fixture builds no target order.",
    "Round 4 (D020): the adversary found the refusal telling an operator to wait for a merge that had already happened, when the order's own worktree held the unmerged retraction; scripts/test-off-ramps.mjs WO-124 merges the reviewed branch without its repair and refuses the same retraction from main, naming the repair in that worktree."
  ],
  "rejected": [
    {
      "option": "Recording the merged form in whichever checkout runs it",
      "reason": "In main it dirties the tracked segment and release close refuses; in the order's worktree the record is lost when the close removes it, so planning never counts it."
    },
    {
      "option": "Reading the local origin/main without a fetch",
      "reason": "The operator merges on the forge; a stale local read would return a merged order to needs-fix."
    },
    {
      "option": "Admitting retract in repairing and ready-to-verify too",
      "reason": "The Cost lists the five phases; a waiver recorded in repairing is first read at the next verification, where retract is legal."
    },
    {
      "option": "Reading only origin/main's record at the close",
      "reason": "An unmerged retraction never reaches main through the commands, so the refusal criterion 3 names could not fire."
    }
  ],
  "reopenWhen": "A retraction is needed in repairing or ready-to-verify, a host-lane fetch proves too slow for the command, or an order's worktree is removed before its close while an unmerged retraction stands in it. Also when the worktree that carried a retraction is removed before its branch merges: the record-time check reads only registered worktrees, so a second retraction from main would then be admitted."
}
```

## WO-249-D010 — A reopened handoff returns to its phase without the executor refusal

```json
{
  "id": "WO-249-D010",
  "date": "2026-11-02",
  "dispatch": "resume: next; steps 1 and 2, HandoffReopened",
  "decision": "npm run resume -- reopen-handoff is legal in ready-to-verify only, takes the operator's capture and records the recording session's role; it names the handoff it reopens (the latest ImplementationReady or RepairCompleted) and folds to active or repairing with the unmet criteria cleared; the fold refuses a reopening of any other handoff or phase. The order's executor is not refused: the Cost gives the waiver's actor rule to defect and retract only, and the operator who widened the order may ask the executor's next session to record it.",
  "evidence": [
    "The Cost: 'the waive actor rule (2048 to 2054) for defect and retract, the capture flags for retract and reopen-handoff'; criterion 4: from ready-to-verify the phase the handoff left with no unmet criteria, a fresh ledger at the next completion, and a refusal from any other phase.",
    "scripts/test-off-ramps.mjs WO-120 reopens an ImplementationReady to active and a RepairCompleted to repairing, asserts the next completion's fresh unmet list and that status --json elapsed.implementation is a number after the reopened attempt, and refuses the command in active and verifying."
  ],
  "rejected": [
    {
      "option": "Letting the executor edit the ledger in place",
      "reason": "The ledger is the record of a completion event; a second completion is a second event (Design)."
    }
  ],
  "reopenWhen": "A reopening is recorded without the operator's words, or a phase other than ready-to-verify needs one."
}
```

## WO-249-D011 — What status, the projection and the index show

```json
{
  "id": "WO-249-D011",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 2, the status projection and legalOffRamps",
  "decision": "status --json always carries defectiveCriteria, retractedOffRamps and reopenedHandoffs, empty when unrecorded, as it carries waivedCriteria; the fold keeps them undefined until their events appear, so histories without them fold to their recorded shape. legalOffRamps lists the three new routes after the five existing ones, so the existing phases' lists keep their order and closed adds retract. current.md and the work-order index show each record only when one exists. The test pins in scripts/test-resume.sh (the key list and three exact objects) and test-off-ramps.mjs's legalIn matrix take the new keys and routes.",
  "evidence": [
    "The existing off-ramp projections are always-present arrays in status --json (scripts/resume.mjs projectOrder) and undefined in the fold until their event appears (scripts/lib/control.mjs emptyState, WO-158).",
    "bash scripts/test-resume.sh passes under the bounded wrapper after the pins moved. docs/control/current.md's closed-order line (WO-237) still reads 'correct, override-record' until the next transition regenerates the projection; status warns that it disagrees with the canonical fold, which lists retract (corrected in the review round, D017).",
    "scripts/test-work-orders.mjs's WO-249 check asserts the index card's Defective criteria, Retracted off-ramps and Reopened handoffs lines and that a retracted waiver leaves the card; scripts/test-off-ramps.mjs asserts current.md's Retracted off-ramps line in an open phase and with the pull request unmerged."
  ],
  "rejected": [
    {
      "option": "Showing the new arrays only when non-empty",
      "reason": "It would differ from every other off-ramp projection a status reader already handles."
    }
  ],
  "reopenWhen": "A status consumer needs a reopening's or a retraction's capture path, which the projection leaves out as it does for waivers."
}
```

## WO-249-D012 — The pull-request body names each defective or waived criterion above the process table

```json
{
  "id": "WO-249-D012",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4, release prepare and github-body",
  "decision": "scripts/lib/github-body.mjs writes one line per defective or waived criterion, in record order, between `<!-- dotln-criterion-records:start -->` and `<!-- dotln-criterion-records:end -->` directly above the process-meter block; release prepare passes the order's records, and a body with no records loses a stale block. Blank lines keep the list its own block, because the github-body-profile check read the end marker after the last item as a soft-wrapped continuation; the body-shape check leaves the block out of its prose-before-meter test, since the lines are release preparation's. regeneratedPullRequestBody reads the records from the working tree's control, as its meter reads the working tree's collection, and writes none for an order the record does not know. Each line names where its retraction runs (`npm run resume -- retract <ordinal> --work-order WO-NNN in the order's worktree`). recordedCriteria returns no records only for an order the record does not know; a control read that fails throws. The lines are written, and expected, for a launchpad order in a repository with a process meter; a target order's or an unmetered repository's body names none (criterionRecordsApply in scripts/lib/github-body.mjs holds the rule, which release prepare, the regenerated body, the pass and publication read). final-review-result pass refuses a stored PR.md whose lines differ from the record, while release prepare can still rewrite them, so a record made after preparation never closes the order stale; worktree publish refuses a body changed after the pass and prints the lines release preparation writes. Such an order reaches the operator's hand merge with no checkpoint line for a waived or defective criterion; until FUP-a9efc000150d7e9f is filed, its record is read with npm run resume -- status. A waiver, defect record or retraction made while a launchpad order's stored body exists says the lines are stale and names release prepare. The pass's refusal names the remedy the rule gives: release prepare rewrites the lines where they apply, and they are removed where they do not. processMetered in scripts/lib/github-body.mjs is the one test for a process meter, which release prepare and the rule share.",
  "evidence": [
    "scripts/test-github-body.mjs WO-249 criterion 7: the two lines, idempotent rewrite, removal with no records, shape and profile pass, and a body whose only text is the records block still fails prose-before-meter.",
    "scripts/test-release.sh release_case_criterion_records: release prepare --local over an order with one waived and one defective criterion writes both lines above the process table and check-surfaces --local passes; release_case_meter_shape failed once when the regenerated body read control at the given revision and passed after the working-tree read.",
    "Review round (D017): the adversary's finding 3 found nothing re-rendering or checking the lines after preparation, though defect and retract stay legal in final-review; the design review's finding 11 found recordedCriteria swallowing a failed read, and its follow-up F10 asked the lines to say where retract runs.",
    "scripts/test-github-body.mjs: criterionRecordProblem passes matching lines and names missing, stale and no-longer-held ones; scripts/test-launchpad-planning.mjs: publish refuses a committed body naming a record the control lacks before anything is pushed.",
    "Round 2 (D018): both the adversary (N1, N2) and the design review (A) found the round-1 publish refusal unanswerable. release prepare returns before writing PR.md for a target order (scripts/release.mjs, 'target order records no release; no files changed'), writes the blocks only when docs/control/budgets.json exists, and refuses a closed order (scripts/lib/release-preparation.mjs, 'requires an unpublished, open work order'), so a record made in final-review after preparation left a remedy that refused.",
    "scripts/test-off-ramps.mjs WO-124 meters its fixture: round 1's pass refuses a stored body without the line, naming release prepare, and admits the body with it. scripts/test-github-body.mjs covers the launchpad, target and unmetered rules; scripts/test-release.sh release_case_criterion_records checks the helper admits the body release prepare wrote, read from the fold; scripts/test-launchpad-planning.mjs refuses a target order's body that names a record line.",
    "Round 3 (D019): the design review's items 1 and 2 and the consistency review's R1 to R3 and R5 found the rule restated in four places, the regenerated body writing lines for a target order, this decision contradicting the publish refusal, the target exception missing from the kit guide and product 07's defect row, and a publish tail that told a target order to restore lines. scripts/test-github-body.mjs now judges criterionRecordsApply and the expected lines on a metered and an unmetered root; scripts/test-off-ramps.mjs WO-124 asserts round 2's defect message names the stale lines.",
    "Round 4 (D020): the consistency review's S1 found the pass naming release prepare for a target or unmetered order, where it writes nothing; scripts/test-off-ramps.mjs WO-124 removes the meter before round 2's pass and asserts the removal remedy."
  ],
  "rejected": [
    {
      "option": "Writing the lines as `**Criterion N:**` judgments",
      "reason": "The body is not a report, and the judgment form would read as one."
    },
    {
      "option": "Re-rendering the lines at publish",
      "reason": "Publish sends the committed, reviewed body; rewriting it there would publish bytes no review read."
    }
  ],
  "reopenWhen": "The forge renders the block poorly, or a reviewer's body needs the lines elsewhere. Or when a target order closes with a waived or defective criterion, which the operator merges without the line (FUP-a9efc000150d7e9f).",
  "followup": "A target order's publications name no criterion-record lines, because release prepare writes nothing for a target order, and an instance without docs/control/budgets.json has no process table to put them above; the operator merges such an order without the checkpoint. Write the lines into the records body the reviewer publishes, or the target body, and judge them at the pass as the launchpad body's are."
}
```

## WO-249-D013 — plan failures counts the events and each defect by class

```json
{
  "id": "WO-249-D013",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4 and criterion 7, the counts",
  "decision": "OFF_RAMPS holds the three events; an off-ramp row carries the criterion (also a retraction's subject's), a defect's class, `retracted: true` on a defect record the operator retracted, and a retraction's subject type. The counts carry defectClasses beside offRampEvents, always present and sparse inside, leaving out retracted records, so planning reads only the classes the operator did not reject. The plan start block carries the counts by kind without defectClasses, which stay on the failures page, and keeps its 1,024-byte compact bound.",
  "evidence": [
    "failuresAtStart on the live tree measured 802 bytes on 2026-11-02 before the change.",
    "Review round (D017): the adversary's finding 5 measured 1,092 to 1,100 compact bytes with every off-ramp kind and all five classes, past the bound, where fitStartBlock drops every count; its finding 10 found a retracted record counted by class. The window that refused the 2026-10-31 pass measures 1,015 to 1,024 bytes with all eight kinds recorded up to ten times each and 1,118 or more with the five classes added.",
    "scripts/test-plan-refutation.mjs's WO-249 check asserts the counts and rows, the retracted record's flag and its absence from defectClasses, a start block without defectClasses, and that window fitting with every kind recorded nine times but not with the classes; the failureCounts helper takes defectClasses: {} and the start-block comparisons drop it."
  ],
  "rejected": [
    {
      "option": "Folding the class counts into offRampEvents keys",
      "reason": "offRampEvents counts event types; a class is not one, and a consumer reading event types would misread it."
    },
    {
      "option": "Keeping the class breakdown in the start block",
      "reason": "With every kind and class recorded the block overruns, and the fallback keeps only the command, the window and the item count."
    }
  ],
  "reopenWhen": "The start block overruns with real counts, or planning needs retractions counted by what they retract."
}
```

## WO-249-D014 — The criteria lint, its cost and what it printed on the tree

```json
{
  "id": "WO-249-D014",
  "date": "2026-11-02",
  "dispatch": "resume: next; steps 5 and 9, the lint and the advisories on the tree",
  "decision": "scripts/work-orders.mjs index --check prints `criteria advisory: WO-NNN criterion N: <what matched>` once per criterion of an active or open order that matches a screen: a figure with a unit (a range's second figure and a dollar figure among them), a median, ceiling, budget or cap within twenty characters of a figure, HEAD, git log (options between allowed), a .. or ... revision range (an open or variable one among them), or a later-phase phrase read without emphasis or code marks; a figure inside an identifier (WO-163, v0.107.0, D015) or a date is not a figure. It refuses nothing, and it runs only in --check, after the page checks pass. plan check returns the same lines as criteriaAdvisories, and the test runner relays them from a passing task as it relays ADVISORY lines. On the tree at step 9 it printed three advisories, recorded here and amended in no order: WO-238 criterion 3 ('8 KB'), WO-244 criterion 3 ('git log') and WO-246 criterion 5 ('HEAD', the legitimate end-state assertion the order's known issues name).",
  "evidence": [
    "The screens over all 246 order files take 18 to 28 ms with their reads (three in-process runs on 2026-11-02). Whole-command wall clock of index --check moved with host load between occasions (3.03 to 3.09 s before the lint and 2.94 to 3.01 s after on one, 2.38 to 2.41 s on a later one), so the screens' own time is the measure.",
    "Over every order file the screens match 82 criteria (78 before the review round widened them). Against the five recorded waivers they match the two bookkeeping ones, WO-173 criterion 5 ('400 bytes') and WO-197 criterion 2 (four second figures), and miss the absent-input and host-behavior ones (WO-197 criterion 1, WO-163 criterion 4, WO-192 criterion 17), which need the planner's reading.",
    "Review round (D017): the adversary's finding 8 listed shapes the first screens missed (a range's second figure, figures beside punctuation, git options before log, open and variable ranges, an emphasis-split phrase), all matched now; its finding 9 and the consistency review's A2 found plan check computing no advisories and the runner keeping no passing output.",
    "scripts/test-work-orders.mjs: a fixture order with nineteen criteria, one per shape and the adversary's misses among them, prints nineteen advisories in order; a clean order with identifiers, versions, decision ids and dates prints none; both exit 0, and a closed order is not screened. scripts/test-plan-refutation.mjs asserts plan check's screen reads active and open rows only, and scripts/test-docs-check.mjs that the document gate relays a criteria advisory from a passing task."
  ],
  "rejected": [
    {
      "option": "Refusing a matched criterion",
      "reason": "A regular expression over prose is a screen, not a judgment, and a figure can rightly name a record (Design)."
    },
    {
      "option": "Amending the three orders the lint named",
      "reason": "Step 9 says amend none; a planning pass reads them."
    }
  ],
  "reopenWhen": "A pass finds the advisory noise exceeds its signal and names the pattern, or the screens miss a class a planning pass records."
}
```

## WO-249-D015 — The write-backs and the kit guide's place

```json
{
  "id": "WO-249-D015",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 8, the write-backs",
  "decision": "Product 07 states the order as built: §Operator resume phrases gains rows for defect, retract and reopen-handoff and the waiver row names retract; §Operator recovery controls lists eight routes and their projections, with the waiver's words rule and a paragraph for each new route; §Verification review and attack replaces the until-it-lands text with the defect route and adds the fail rule, the basis and reproduction and the pass advisory; §Operator-opened planning pass names the lint, its screens and its advisory form; §Discipline's routine-questions sentence gains the executor's class rule. The kit guide is scripts/kit/README.client.md, because docs/KIT.md does not exist until WO-245 merges: its planning list names the advisory, and a paragraph after accept-overrun names defect, retract, reopen-handoff, the words rule and the fail's basis. WO-245 merged first: at this order's integration (D022) the kit text moved verbatim into docs/KIT.md, and scripts/kit/README.client.md is the instance README seed.",
  "evidence": [
    "ls docs/KIT.md on 2026-11-02: no such file; WO-245's worktree is open beside this one.",
    "Product 07 measured 317,485 bytes against its 349,018 ceiling before the write-backs (docs/control/doc-ceilings.json)."
  ],
  "rejected": [
    {
      "option": "Writing the kit text into a new docs/KIT.md",
      "reason": "WO-245 creates that file; a second author would collide at integration."
    }
  ],
  "reopenWhen": "The kit guide moves again, or an instance's seed README needs a pointer to these routes."
}
```

## WO-249-D016 — The skeleton release and the editions sync re-minted

```json
{
  "id": "WO-249-D016",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4 of the executor procedure, release prepare",
  "decision": "@dotln/skeleton moves from 0.76.0 to 0.77.0, a minor change for new role guidance, with its console dependency pin and both lockfile entries; no other component's source changed. npm run sync re-minted what the role text and the control fold stale: the harness roots and hooks, the authority editions WO-249/001, WO-249/002 and WO-249/003 (the sync after the review round's fixes, D017, minted 003), the last named by docs/evidence/current.json, and the runtime snapshot; no feedback-judged source changed, so no live feedback episode is owed.",
  "evidence": [
    "npm run sync: 'FAIL component-version @dotln/skeleton: src changed; observed 0.76.0; previous v0.107.0 0.76.0; expected a different version', and every artifact current after the bump.",
    "a636a36d moved the same four pins for the 0.74.0 to 0.75.0 release."
  ],
  "rejected": [
    {
      "option": "A patch bump",
      "reason": "The role text gains three commands and two rules, and the order's classification is minor."
    }
  ],
  "reopenWhen": "Integration finds 0.77.0 consumed upstream, when the bump is retimed as product 07 directs."
}
```

## WO-249-D017 — The review round: three independent reviews and what each finding became

```json
{
  "id": "WO-249-D017",
  "date": "2026-11-02",
  "dispatch": "resume: next; executor procedure step 6, the three independent worker reviews",
  "decision": "Three dotln-worker reviews judged the finished implementation: a criteria adversary (14 findings and 5 untested paths), a design improver (13 ranked improvements and 11 follow-ups) and a consistency review (11 items). Fixed: adversary 1 to 11 and 13 (D005, D006, D007, D009, D012, D013, D014), each with its regression test, and its five untested paths, now tested; design 1 to 9 and 11 to 13 (design 7 in part: one orderSegment helper gives defect, retract, reopen-handoff and correct the order's segment while each keeps its own activation check; design 13 in part, see D006) with follow-ups F3, F10 and F11; consistency A1 to A11 (the skeleton pin, product 07's lint, floor and drive-stop wording, products 04 and 08, the kit guide's fail rule, D011, D016, two comments and the projection-line tests). Documented without a change: design 10, withMeterBlockLast keeping its empty default with a comment that a caller passes the order's records every time. Declined: adversary 12, adversary 14 and design follow-ups F2, F4 to F9. Boarded: design follow-up F1.",
  "evidence": [
    "Agents a6388ad04da87f59c (criteria adversary), aff7d62d33a97c5f7 (design improver) and a46d20347dac32540 (consistency), all dotln-worker, ran no gate; their probes ran under node scripts/harness.mjs bounded -- in session scratch.",
    "Focused reruns after the fixes, each under the bounded wrapper: bash scripts/test-resume.sh, bash scripts/test-work-orders.sh (35 tests), node scripts/test-plan-refutation.mjs --fixtures-only (123 tests), the release cases worktree_retraction, criterion_records and unrepaired_retraction, and the named WO-249, case-inventory, relay, drive and launchpad publish tests.",
    "scripts/test-drive.mjs: a needs-fix order whose failure source is a retraction no longer reads an earlier cycle's failing report, whose operator-route finding stopped every drive (design 3). Inferred from the removed condition, not run: the earlier latest-fail rule would read VER-001's operator finding in this case and fail it.",
    "docs/control/comment-baseline.json loses its one packages/skeleton/src/loadouts/contributor.ts entry: the comment above offRamps no longer leads with an order identifier (design 6), and node scripts/comment-labels.mjs --write, which refuses any finding outside the baseline, shrank it. The same check named a decision number left unqualified in scripts/work-orders.mjs's FIGURE comment, which now says what it means."
  ],
  "rejected": [
    {
      "option": "Phase-checking CriterionDefectRecorded and OffRampRetracted in the fold, and refusing a waiver and a defect standing on one criterion there (adversary 12)",
      "reason": "The fold validates an off-ramp's shape and resume judges its legality, the WO-158 split CriterionWaived already follows; the commands refuse each case, and a hand-appended event is outside their guarantee. F1 is the boarded route that makes the fold the commands' last check."
    },
    {
      "option": "Refusing the reviewer's own defect record in final-review (adversary 14)",
      "reason": "The Cost makes defect legal in final-review; the independent confirmation is the operator's reading of the pull-request body's line before the merge."
    },
    {
      "option": "Design follow-ups F2, F4 to F9: one event-attribute table, one renderer, renaming the pending lane, one parse of the findings block, a ledger-only line form, table-driven judgment branches and fewer exports",
      "reason": "Each is a refactor of behavior this order keeps: the three event lists serve readers with different memberships, the two renderers serve different pages, the lane's name is WO-219's storage contract, the second parse costs a read of one report, and the exports have callers."
    }
  ],
  "followup": "appendTransition in scripts/resume.mjs writes an event before folding it, so when a command's pre-check is looser than the fold the segment takes an event it then cannot read and the command reports the transition at ordinal undefined. Fold the segment with the new line before writing, as carryPendingOverrides does, and let retract and reopen-handoff drop the pre-checks that duplicate the fold.",
  "reopenWhen": "A declined finding recurs in a later review or in a real record, or the boarded follow-up is filed."
}
```

## WO-249-D018 — The reviewers' rechecks: what round 2 found and what each finding became

```json
{
  "id": "WO-249-D018",
  "date": "2026-11-02",
  "dispatch": "resume: next; executor procedure step 6, the three reviewers' rechecks of the fixed code",
  "decision": "The three reviewers re-judged the round-1 fixes and attacked them. Criteria adversary: 10 of its 14 fixes hold, 2 declines accepted, and gaps under 1, 3 and 7 became new findings N1 to N8. Fixed: N1 and N2, the record-line refusal no target order or closed order could answer (D012); N3, an unmerged repair answering a retraction at the close (D009); N4, the re-carry (D009); N5 in part, the header-field forms (D006). Declined: N5's prose and quotation cases (D006), N6, N7 (D005) and N8. Design review: 11 of 13 items hold and 2 hold in part. Fixed: A (D012); B in part, one helper for the pass and publication plus a release-fixture tie to preparation's own state read; C, F and G; item 1's carry gap; the comment wording of item 6; the hand-written type list of item 9. Recorded: D as a known issue (D009's reopening condition), E, H, I, item 4 and item 7. Consistency review: A1 to A11 hold, and its six new items are fixed (product 07's header list, dollar screen and basis advisories, the kit guide's active-or-open, the lane comment, the executor-check wording in D005 and its comment, and a from-main retract test).",
  "evidence": [
    "Reports from a6388ad04da87f59c (criteria adversary), aff7d62d33a97c5f7 (design improver) and a46d20347dac32540 (consistency), round 2, each with no gate run and probes under the bounded wrapper in session scratch.",
    "After the fixes: bash scripts/test-release.sh cases worktree_retraction, unrepaired_retraction and criterion_records; the off-ramps suite through its owned-root runner; node --test scripts/test-github-body.mjs's WO-249 case.",
    "The round-2 focused runs found a regression of the round-1 briefing change, which no earlier preflight ran: scripts/test-target-worktree-start.mjs pinned the verify and final-review briefings' printed launchpad commands as waive, amend-order and the document gate, and the unmet briefing now prints the defect route first, whose `<class>` placeholder the fixture's filler did not know. The pins now list the defect route, and the printed command, its class filled as `printed`, is refused as no defect class and records nothing (scripts/lib/target-worktree-fixture.mjs, scripts/test-target-worktree-start.mjs).",
    "Focused runs after the round-2 fixes, each npm test -- --only <suite> under the bounded wrapper: resume, github-body, worktree, target-publish, launchpad-planning, release (73 cases), harness-fixtures, target-worktree after its repair, checkpoint, derived-orders, harness-probe, plan-refutation and process-debt."
  ],
  "rejected": [
    {
      "option": "Not counting a record an amendment replaced by class (the adversary's N6)",
      "reason": "Each record judged a different text of the criterion, and both texts were written defective; a retraction is excluded because the operator judged the record itself wrong."
    },
    {
      "option": "Narrowing the budget screen away from file names such as budgets.json beside a figure (N8)",
      "reason": "The screen only advises, and D014's reopening condition names noise that outweighs signal."
    },
    {
      "option": "Building REPORT_FIELD from constants (design E), dropping the failRefused flag (H), carrying the retracted record's hash in the projection (I) and one activation helper for retract and correct (item 7)",
      "reason": "Two of the five field names have constants, the flag keeps the shared refusal tail in one place, the projection's exact objects are pinned status contract (D011), and the two activation comparisons agree in effect because retract refuses the activation's own event by type first."
    },
    {
      "option": "A retraction test for a target order (design item 4)",
      "reason": "orderMerged is the one rule the drive's awaiting-merge route and the retraction read, and the drive's target fixtures cover it; a target retraction fixture needs a target clone the off-ramps fixture does not build."
    }
  ],
  "reopenWhen": "A declined round-2 finding recurs in a real record, or round 3 finds a fix of this round wrong."
}
```

## WO-249-D019 — The reviewers' third recheck: what round 3 found and what each finding became

```json
{
  "id": "WO-249-D019",
  "date": "2026-11-02",
  "dispatch": "resume: next; executor procedure step 6, the reviewers' third recheck",
  "decision": "Round 3 judged the round-2 fixes. Criteria adversary: N1 to N5 hold and the N6 to N8 declines stand; new R3-1 (a second merged retraction after a carry) and R3-2 (the unemphasized header form refusing evidence) and R3-5 (a target order's launchpad worktree skipped when its target worktree is gone) are fixed (D009, D006); R3-3 is in D006's declined class and R3-4 is declined. Design review: every round-2 change holds; new items 1 to 8 are fixed (one criterionRecordsApply rule, D012's consequence and reopening condition, the shared-prefix comparison stated in unrepairedRetraction's comment, held rows filtered in both lane callers, the lane read only for a retraction, the dead parse-error branch removed, held rows skipped when appending, and the stale-lines note in the record commands' messages). Consistency review: N1 to N6 hold; R1 to R5 are fixed (D012's publish sentence, the regenerated body under the one rule, the target exception in the kit guide and product 07's defect row, the bold-only header rule, the publish tail).",
  "evidence": [
    "Round-3 reports from a6388ad04da87f59c, aff7d62d33a97c5f7 and a46d20347dac32540, each with no gate run."
  ],
  "rejected": [
    {
      "option": "Admitting `__Verdict:__`, `*Verdict:*` and `**Verdict** - pass.` as header fields too (the adversary's R3-3)",
      "reason": "No filed report writes them; D006 declines screening every form a judge might type, and the role text asks for the judge's own evidence."
    },
    {
      "option": "Judging the publish body against PR.md's lines when the reviewer publishes another body file (R3-4)",
      "reason": "The reviewer publishes PR.md, and a refusal for another file prints the exact lines to write; a second stored-body route would duplicate preparation."
    }
  ],
  "reopenWhen": "A round-3 fix proves wrong in a later review or in a real record."
}
```

## WO-249-D020 — The reviewers' fourth recheck: what round 4 found and what each finding became

```json
{
  "id": "WO-249-D020",
  "date": "2026-11-02",
  "dispatch": "resume: next; executor procedure step 6, the reviewers' fourth recheck",
  "decision": "Round 4 judged only the round-3 changes. Criteria adversary: R3-1, R3-2 and R3-5 hold (R3-5 by reading, untested); its one new low finding, the refusal's cause misnamed for an unrepaired retraction in the order's own worktree, is fixed (D009). Design review: all eight round-3 items hold; fixed are its item 1 (unrepairedRetraction's comment stated the invariant backwards), item 2's wording (the same finding as the adversary's), item 3 (the byte-identical comment), item 4's shared meter test (processMetered), item 5 (physical path identity in both reads) and item 6 (one stored-body path in resume.mjs). Consistency review: R1 to R5 hold; S1 (the pass's remedy for a target or unmetered order), S2 (a core follow-up id in the kit guide instances cannot resolve) and S3 (the lane comment) are fixed.",
  "evidence": [
    "Round-4 reports from a6388ad04da87f59c, aff7d62d33a97c5f7 and a46d20347dac32540, each with no gate run.",
    "After the fixes: the off-ramps suite through its owned-root runner, the release cases criterion_records, worktree_retraction, unrepaired_retraction and meter_shape, and test-github-body.mjs's WO-249 case.",
    "Focused runs after the fixes: github-body, worktree, release and target-worktree passed. One resume run (npm test -- --only resume, 08:30 to 08:56 UTC) was stopped at its 25-minute suite limit inside test-off-ramps.mjs's WO-124 closed-retraction block, which prints only at its end; the same bytes passed the same command in 2 min 19 s at 09:10 UTC and through the direct runner in under a minute. The cause is unknown: each merge read in that block runs ls-remote and fetch in a fresh temporary lane bounded at 60 and 300 seconds, so several reads stalled at their bounds could reach the limit, and earlier focused runs of this session waited on host lanes another checkout held."
  ],
  "rejected": [
    {
      "option": "Moving the worktree scan into resume's merged retract path (design item 2)",
      "reason": "The lane module owns the rule that a record is retracted once; the scan sits beside the duplicate check it extends."
    },
    {
      "option": "Returning an object from criterionRecordRefusal so a caller reads whether the rule applies without asking again (design item 4)",
      "reason": "The refusal stays a string the tests pin, and the second call is one stat of docs/control/budgets.json."
    }
  ],
  "reopenWhen": "A later review finds a round-4 change wrong, or the waive and retract stale-lines notes or publish's applies-case refusal, which no test runs end to end, misbehave. Also when the resume suite stalls in the WO-124 block again, which then becomes a failure to diagnose."
}
```

## WO-249-D021 — The reviewers' fifth recheck: confirmed, with two wording fixes

```json
{
  "id": "WO-249-D021",
  "date": "2026-11-02",
  "dispatch": "resume: next; executor procedure step 6, the reviewers' fifth recheck",
  "decision": "Round 5 confirmed the round-4 changes: the design review found all six holding and nothing new; the consistency review found S1 to S3 and both notes fixed, nothing stale; the criteria adversary found its round-4 fix holding. Two wording points are fixed: a refusal for an unmerged retraction whose repair has already passed in the order's worktree now names only the merge that remains, and the pass refusal for a target or unmetered body no longer says to remove the lines twice.",
  "evidence": [
    "Round-5 reports from aff7d62d33a97c5f7 (reading only), a46d20347dac32540 (read-only checks) and a6388ad04da87f59c (probes cmd7.mjs and cmd8.mjs in session scratch; the cmd7 fixture took 2,551 ms and no resume call over 1.5 s, which leaves the round-4 resume stall unexplained).",
    "scripts/test-off-ramps.mjs WO-124 retracts from main after round 2's repair passed in the order's worktree and before its push, and the refusal names only the merge; the unmetered pass refusal's text is updated. The off-ramps suite passes through its owned-root runner."
  ],
  "rejected": [
    {
      "option": "Keeping the repair advice for an unmerged retraction whose repair already passed",
      "reason": "It sends the operator to repeat a repair, a verification and a final review that have passed; only the merge remains."
    }
  ],
  "reopenWhen": "A later recheck finds either wording wrong, or the resume stall of D020 recurs."
}
```

## WO-249-D022

<!-- integration refs/dotln/checkpoint/WO-249/2 -->

```json
{
  "id": "WO-249-D022",
  "date": "2026-11-02",
  "dispatch": "resume: next; worktree integrate WO-249",
  "decision": "Main moved to 1464dc1a (WO-245 merged, #264) before the complete run, so the executor integrated it with worktree integrate. One authored conflict: WO-245 moved the kit guide from scripts/kit/README.client.md into docs/KIT.md and seeded a short instance README in the old path. The seed takes main's text, and this order's two kit-guide passages (the criteria-advisory sentence in the planning list, and the paragraph naming defect, retract, reopen-handoff, the words rule and the fail rule after the accept-overrun paragraph) move verbatim into docs/KIT.md at the same anchors. Release preparation retimed the unpublished target from v0.108.0, which WO-245 released, to v0.109.0 under the same minor classification; @dotln/skeleton 0.77.0 stands, since main still holds 0.76.0. Carried forward unchanged: every acceptance claim of this order, the three reviews and their dispositions (D017 to D021) and the focused runs; the resolution adds no behavior and moves no claim, so it returns nothing to review. Criterion 10's kit guide is now docs/KIT.md, which states the commands, classes, words rule, fail rule and lint as before.",
  "evidence": [
    "refs/dotln/checkpoint/WO-249/2",
    "base a6665a2449eaa3631e6e7f701b8fdeffc6c9a2f6",
    "upstream 1464dc1a2a74118c3bd9a9cd280feae3dfda451e",
    "release preparation: Retimed WO-249: v0.108.0 → v0.109.0 above the observed release baseline v0.108.0. Files changed: docs/work-orders/WO-249-criteria-judge-the-product.md, README.md, docs/evidence/WO-249/meta.json. Meter snapshot: docs/evidence/WO-249/meta.json, 4458 bytes. Tag observation: local snapshot only.",
    "npm run worktree -- integrate WO-249 printed 'Authored conflicts: none' after the resolution and --continue; npm run sync then reported every artifact current, the role oracle and authority edition WO-249/003 included.",
    "git show 1464dc1a:packages/skeleton/package.json reads 0.76.0; git tag lists v0.108.0 as the newest release."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available."
    },
    {
      "option": "Restarting the three reviewers on the integrated tree",
      "reason": "The integration takes in WO-245's independently reviewed work and moves this order's guide text verbatim; product 07 counts both, and the release retime, as integration bookkeeping that preserves behavior, contracts and acceptance."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-11-02. Original base: `a6665a2449eaa3631e6e7f701b8fdeffc6c9a2f6`.
Fetched main: `1464dc1a2a74118c3bd9a9cd280feae3dfda451e`. Checkpoint: `refs/dotln/checkpoint/WO-249/2`.
Named stash dropped after completed application: `ede723a41d98665ef9e193dcdbfea619e53bb1b5` (WO-249 integrate 2026-11-02).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md.
Release preparation: Retimed WO-249: v0.108.0 → v0.109.0 above the observed release baseline v0.108.0. Files changed: docs/work-orders/WO-249-criteria-judge-the-product.md, README.md, docs/evidence/WO-249/meta.json. Meter snapshot: docs/evidence/WO-249/meta.json, 4458 bytes. Tag observation: local snapshot only.
Carried-forward claims: **reviewer to complete; no acceptance judgment recorded**.
Authored conflicts observed: scripts/kit/README.client.md.
Affected checks are printed by the command; results remain untested until executed.

## WO-249-D023 — Independent verification scope and read correction

```json
{
  "id": "WO-249-D023",
  "date": "2026-11-02",
  "dispatch": "resume: verify",
  "decision": "Verify the selected WO-249 candidate without implementation edits. Judge supported fixture inputs and current source, read the executor's three review streams and dispositions, and consume passing gate rows only at their recorded subject identity. A status-only NoOp would not discharge the requested independent verification. The lifecycle and report parser under verification also allocate and record this verifier's report, so raw events, direct parser probes and gate rows provide separate checks of their claims. No worker is needed for a claim this verifier can reproduce itself.",
  "evidence": [
    "Canonical status selected WO-249 in ready-to-verify; npm run resume -- verify dispatched once and allocated docs/verifications/WO-249/VER-001.md; writer --show reports this Codex session as the sole reserved writer.",
    "Entry usage: 70158 total tokens, source codex-transcript-counter, scope dispatch, cutoff 2026-11-02T14:34:57.373Z. Readback supplies codex-cli 0.166.0, gpt-6.1-sol, effort max, source codex-session-readback. This is the actual host selection despite the verifier's xhigh recommendation; no effective-effort claim or settings change is made. A hard USD cap is unenforced because this transport exposes no dollar-cap control.",
    "Process failure: initial status, several batched source reads, an unfiltered evidence-wait receipt and npm run meta's completion output exceeded the aggregate tool-output budget and were truncated. No omitted bytes are treated as reviewed. Correction: select the current order and verdict-relevant fields before emission, re-read required source ranges separately, and capture large command output in ignored session scratch before selecting it. The initial status was re-read without unrelated orders; required implementation ranges and the three worker streams were read separately, and gate rows were re-read as selected fields. The meta output is not product evidence; its current generated projections are checked separately and its next output is captured before inspection.",
    "Verification review and attack requires supported-input blocking findings, complete implementation review, and reproduction of the executor reviews' consequential claims; synthetic inputs outside the supported vocabulary remain follow-ups. The handoff's complete gate is a claim to validate, not a substitute for independent probes. Existing limits in D019 and D020 stay explicit until probed."
  ],
  "rejected": [
    {
      "option": "Change the implementation to make the verifier's own verdict pass",
      "reason": "The verifier writes its evidence and immutable report, and routes any unmet criterion to repair."
    },
    {
      "option": "Treat a criteria lint match as a defect judgment or repeat every complete gate",
      "reason": "The lint is advisory, and equivalent current-identity product rows are reusable; independent probes supply the additional attack evidence."
    }
  ],
  "reopenWhen": "A probe finds an unmet criterion or reproduced regression, a cited row has a different identity, or a required source remains unreadable. Record the evidence and route it in VER-001 rather than changing criteria or waiving them."
}
```

## WO-249-D024 — Verification outcome, carried limits and integration observation

```json
{
  "id": "WO-249-D024",
  "date": "2026-11-02",
  "dispatch": "resume: verify",
  "decision": "Pass the eleven original criteria after the final document check. Independent probes and the current-identity gate evidence support the product claims; no new blocking defect or new follow-up was found. The outcome matches the requested independent verification. Preserve the existing follow-ups and recorded limits, and leave upstream integration to final review. Make no implementation edit, waiver, criterion-defect event, commit or publication in this phase.",
  "evidence": [
    "docs/evidence/WO-249/verification-001.json records the subject, selected gate fields, checks, eight independent probes and review boundaries. docs/evidence/WO-249/verifier-001-probes.mjs is the portable reproduction; its last bounded run passed all eight probes, including all five defect classes through resume commands, an executor refusal, reopening with a fresh handoff, a retraction, two passing report stages, and planning counts from those actual CLI events.",
    "The complete npm test -- --review row at code identity ee5ba51e09fb2b2962ed80bfed1fa39a196f420ffdf0a98ab09b37e9dfdff58e passes all 44 required suites and 117 tasks with no unrun suite; gateCheckStands still returns true after the verifier's focused resume run. The focused run passed all eight tasks in 0 h 3 min, at the same identity.",
    "Separate bounded release cases worktree_retraction and criterion_records passed: the close refuses both an unrepaired worktree retraction and a locally passing repair not merged into main; release preparation writes both record lines above the process table and preserves the body profile. format:check, harness check (42 generated surfaces), publication:check and work-orders index --check pass; git diff HEAD --check is clean. Package and lockfile changes are version and existing-workspace-pin updates only.",
    "Read all 18 handbacks across the six rounds of the three executor workers named by D017 to D021, together with their dispositions. Reviewed the authored production diff and relevant fixture consumers; generated guidance and snapshots were checked against their sources and current generated-surface checks. No fresh worker was needed.",
    "The focused row observed main and origin/main moving from 1464dc1a to cd4b8058 and the newest shared release tag from v0.108.0 to v0.109.0. Product 07's Independent workflows and integration rule makes this a final-review integration observation, not a failure of the recorded subject. The candidate's code identity remains unchanged; the reviewer owns integration and any version retime under the existing classification.",
    "Process corrections are recorded in D023. The focused wrapper also reported the original-parent unique-identity monitor signal unavailable while other signals remained active; the product run finished successfully, its identity stayed unchanged and no live gate remained at evidence capture. No independently started background monitor remains."
  ],
  "rejected": [
    {
      "option": "Repeat the complete product run without a changed identity",
      "reason": "The complete review row still stands and the fresh focused and independent probes supply the additional verification; a second complete run would repeat the same product checks without addressing an unresolved claim."
    },
    {
      "option": "Treat accepted design limits or a sibling release as a failed criterion",
      "reason": "No supported-input criterion failure or regression was reproduced. Existing FUP-4798f1b5f5a74ed1 and FUP-a9efc000150d7e9f retain their recorded scope and reopening conditions in D017 and D012."
    }
  ],
  "reopenWhen": "The final document check exposes an in-scope failure, a passing row ceases to stand at the subject, a supported real flow contradicts the probes, or final-review integration changes behavior or acceptance. Target-order closed retractions, a removed target worktree at close, live forge merge modes, and the remaining end-to-end message/publication limits stay untested as verification-001.json records."
}
```

## WO-249-D025

<!-- integration refs/dotln/checkpoint/WO-249/8 -->

```json
{
  "id": "WO-249-D025",
  "date": "2026-11-02",
  "dispatch": "resume: final review; worktree integrate WO-249",
  "decision": "Main moved to cd4b8058 (WO-251 merged, #265, released as v0.109.0) after VER-001, so final review integrated it with worktree integrate. The four authored conflicts are one collision: WO-249 and WO-251 each minted a role oracle over WO-247's, and the integrated role trees carry both orders' sentences, so neither oracle pins them. The resolution mints packages/skeleton/fixtures/wo249-integration-role-baseline.json as the two-parent oracle, as WO-192-D098 did at its integration: WO-251's oracle, main's at integration, is its historical parent, WO-249's its branch parent and WO-247's the upstream both were minted over; its three consumers (the process-debt oracle walk, the gate-followups startup-cost chain and the runner's declared inputs) select it and keep both parents declared and reachable. docs/evidence/current.json takes main's WO-251/002 authority edition and npm run sync re-mints the authority edition over the integrated contributor.ts as the next WO-249 revision. @dotln/skeleton is retimed from 0.77.0, which WO-251 consumed on main, to 0.78.0 with the console pin and both lockfile entries, keeping D016's minor classification; release preparation retimed the unpublished target from v0.109.0 to v0.110.0 under the same classification. Measured on the integrated tree, each installed root (CLAUDE.md plus the role skill, both roots identical): executor 39,873 (accepted 40,194); verifier 35,447 against its effective 35,221, a 226-byte breach; reviewer 37,919 (39,600); release-close 24,978 (26,410); planner 26,449 against 24,576; refuter 24,600 (no ceiling); router 16,327 (16,384). Product 07 §Discipline has had one cold-start route since the 2026-10-31 pass, which was in this order's base: a reviewed rule that breaches a ceiling stays whole, its overrun is boarded as a follow-up for optimization with equivalent usefulness, and no acceptance is recorded. D002 recorded a dated planner acceptance (29,636) under the retired 2026-09-17 route, which the order's Known issues named as standing; this review withdraws that entry from docs/control/budgets.json and boards the verifier's and the planner's overruns as this decision's follow-up, beside WO-251's FUP-ac86ee429dee2947 for the planner's first 646 bytes. Carried forward unchanged: every acceptance claim of criteria 1 to 11 with VER-001's probes and the three reviews' dispositions (D017 to D021); the resolution adds no behavior and moves no claim. The integrated code identity differs from the verified ee5ba51e, so the complete review run is owed at the new identity and recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-249/8",
    "base 1464dc1a2a74118c3bd9a9cd280feae3dfda451e",
    "upstream cd4b80589d2fa371611baae4e3814391ffc0e256",
    "release preparation: Retimed WO-249: v0.109.0 → v0.110.0 above the observed release baseline v0.109.0. Files changed: docs/work-orders/WO-249-criteria-judge-the-product.md, README.md, docs/evidence/WO-249/meta.json. Meter snapshot: docs/evidence/WO-249/meta.json, 5230 bytes. Tag observation: local snapshot only.",
    "git show cd4b8058:packages/skeleton/package.json reads 0.77.0 and git tag lists v0.109.0 as the newest release; git diff 1464dc1a cd4b8058 -- packages/skeleton/src/loadouts/contributor.ts adds WO-251's browser-verification sentence to every role, which the integrated file carries beside this order's sentences without a text conflict.",
    "wo249-role-baseline.json and wo251-role-baseline.json both name wo247-role-baseline.json (sha256 9b6fae40…) as historicalBaseline; wo192-integration-role-baseline.json (WO-192-D098) is the precedent for a two-parent oracle at integration.",
    "Measured by the oracle test's own rule (scripts/test-gate-followups.mjs: the source CLAUDE.md with its harness block replaced by the projected block, plus each projected role skill; the installed files equal the projection): executor 39,873; planner 26,449; refuter 24,600; release-close 24,978; reviewer 37,919; router 16,327; verifier 35,447 bytes. npm run meta on the integrated tree: '.claude/skills/verifier: 35,447 bytes; ceiling 29,831; previous 34,142; Δ edition 1,305; last acceptance 2026-10-29: 31,496 bytes, Δ 3,951; breach'.",
    "docs/product/07-execution-guide.md §Discipline, the cold-start ceilings paragraph (commit 30119b4d, 2026-10-31; present at this order's base a6665a24): 'No ceiling is raised, no acceptance is recorded, no needed rule is cut to fit … no further acceptance is recorded: a breach is boarded as this paragraph says'. D002's evidence cites 'the standing route of 2026-09-17', which that paragraph retires.",
    "npm run worktree -- integrate WO-249 --continue printed 'Authored conflicts: none' and the four affected checks; their results on the integrated tree are recorded in FINAL-001."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available."
    },
    {
      "option": "Re-minting either order's oracle over the integrated trees",
      "reason": "Historical role hashes and parent links are immutable evidence; the oracle walk requires every oracle reachable and byte-exact."
    },
    {
      "option": "Keeping D002's planner acceptance, or recording one for the verifier",
      "reason": "Product 07 has one route since 2026-10-31, in force at this order's base: board the overrun, raise no ceiling, record no acceptance, cut no needed rule."
    },
    {
      "option": "Returning the integration to repair and fresh verification",
      "reason": "The resolution changes no behavior, contract, authority or acceptance claim: product 07 names the harness bundle, the oracle and the retimed component and release as integration bookkeeping, and the complete run at the integrated identity is the check it owes."
    }
  ],
  "followup": "Optimize the verifier's and the planner's installed cold starts with equivalent usefulness. On the integrated tree the verifier measures 35,447 bytes against its effective 35,221 (nominal 29,831), a 226-byte breach, and the planner 26,449 against 24,576, a 1,873-byte breach of which WO-251's FUP-ac86ee429dee2947 boards the first 646. Inspect the shared off-ramps, routine-questions and browser-verification sentences in packages/skeleton/src/loadouts/contributor.ts and the installed CLAUDE.md block; preserve the defect, retraction, reopen and words-rule duties and the planner's five-class screen. Validate with scripts/test-process-debt.mjs, scripts/test-gate-followups.mjs and npm run meta; broader role restructuring belongs to a planning allocation.",
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification. Also when an optimization preserving equivalent usefulness is allocated, another reviewed rule changes a role root, or integration changes the preceding oracle."
}
```

Integration date: 2026-11-02. Original base: `1464dc1a2a74118c3bd9a9cd280feae3dfda451e`.
Fetched main: `cd4b80589d2fa371611baae4e3814391ffc0e256`. Checkpoint: `refs/dotln/checkpoint/WO-249/8`.
Named stash dropped after completed application: `1119eb339b1db5a541c8287885d691f234a6391d` (WO-249 integrate 2026-11-02).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/agent-finished.mjs, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/failure-observer.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/HISTORY.md, docs/work-orders/README.md.
Release preparation: Retimed WO-249: v0.109.0 → v0.110.0 above the observed release baseline v0.109.0. Files changed: docs/work-orders/WO-249-criteria-judge-the-product.md, README.md, docs/evidence/WO-249/meta.json. Meter snapshot: docs/evidence/WO-249/meta.json, 5230 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 11 as VER-001 judged them, with the three reviews' dispositions (D017 to D021); the resolution moves no claim, and the integrated subject's complete review row and acceptance judgment are recorded in FINAL-001.
Authored conflicts observed: docs/evidence/current.json, scripts/test-gate-followups.mjs, scripts/test-process-debt.mjs, scripts/test-runner.mjs.
Affected checks: npm test -- --review, npm run publication:check, node scripts/harness.mjs check and npm run release -- check-surfaces --local; their results on the integrated tree are recorded in FINAL-001.

## WO-249-D026 — Final review: the register rows whose conditions this order met, and the rows left as matched

```json
{
  "id": "WO-249-D026",
  "date": "2026-11-02",
  "dispatch": "resume: final review",
  "rows": [
    "FUP-8dd0eb609946b9d1",
    "FUP-957602bc42e32e1d",
    "FUP-e08668268dea62b1",
    "FUP-eed385be08e5bdd9"
  ],
  "decision": "Re-defer the three register rows whose conditions this order and its integration met, with the figures refreshed at the integrated tree, defer this order's own cold-start follow-up for a planning allocation, and leave the other matched rows as they are, with the readings below. FUP-957602bc42e32e1d (WO-217-D053) and FUP-e08668268dea62b1 (WO-219-D009): their condition occurred, because this order's criteria rules (564 bytes in each phase role, 1,007 in the reviewer, 1,227 in the planner and 1,305 in the verifier) over WO-251's browser-verification rule, integrated here, changed every installed role root: the executor reads 39,873 against the nominal 29,246 and within the accepted 40,194; the verifier 35,447 against 29,831 and above the accepted 35,221, a breach of 226 that D025 boards as FUP-8dd0eb609946b9d1; the reviewer 37,919 against 28,884 and within 39,600; release-close 24,978 against 21,266 and within 26,410; the planner 26,449 against 24,576, a breach of 1,873 boarded by the same row beside WO-251's FUP-ac86ee429dee2947 for its first 646; the router 16,327 within 16,384; the refuter 24,600 with no ceiling. No ceiling moved, D002's acceptance was withdrawn and no duty was cut. FUP-eed385be08e5bdd9 (WO-226-D022): its condition occurred, because this order re-mints the role oracle as wo249-role-baseline.json and the integration mints wo249-integration-role-baseline.json, which the chain list in scripts/test-gate-followups.mjs selects; the test keeps its chain walk, its ceiling and acceptance checks and the historical 256-byte inequality, which this review does not decide, because it changes no test beyond the chain list. FUP-8dd0eb609946b9d1 (D025): deferred, the optimization with equivalent usefulness belongs to a planning allocation, as WO-251-D007's planner row is. Left as they are: FUP-770baf2f452c669e (the planner root's entropy selector), because this order added the planner's five-class screen sentence, so by the letter the planner root was edited, but the row's seam is the planner's entropy sentence, which neither the order's scope nor this review edits, and carrying it would be a source change the reviewer would then certify; FUP-34bee344f576ba39 (the escape sum), because this order gives the status projection three off-ramp fields and plan failures the off-ramp kinds and defect classes, not the escape counts the row names; FUP-82e9f0bda503c40c (WO-187-D020), because this order edits scripts/lib/review-findings.mjs without meeting either reopening condition; FUP-ac86ee429dee2947 (WO-251-D007), whose register condition names a planning allocation, with its refreshed figure carried by D025's row; the order's own FUP-4798f1b5f5a74ed1 (D017) and FUP-a9efc000150d7e9f (D012), untriaged for planning; and the remaining rows, which name a path or this order in their text only: the target-lifecycle rows (FUP-048618f9ee2eb349, FUP-2fe2709d9b33c9e7, FUP-378c5638bf515e52, FUP-9a4929e4a041875f, FUP-e4fa2bbf7c3968ec) name target-commit-lint.mjs, target-base.mjs or a second target order, which this order does not touch; the hook rows (FUP-911dc28a35dc4c44, FUP-be6721fbdd4b6285, FUP-dc138fc0fac6a3fc) name harness-host.ts, untouched; the runner and process rows (FUP-17ea51254e5a7256, FUP-dfde4050da06d43b, FUP-7f9a27e6ed6c44b3, FUP-fb8cbeabbddef397, FUP-d0a9719cc2e4ec55, FUP-941fd291e0fd1033) name scripts/test-runner.mjs, product 07 or costs no reading here measured, and WO-192-D091's sequence failure did not recur, since the handoff records six reviewer rounds finished before the complete run; FUP-c4c7ba9f126d2e4a, FUP-977e50f635de762d, FUP-912adb42a652b75f and FUP-f93ef1a6fc68b07e name seams this order does not open; FUP-1116ba845c557862, FUP-8bf500303e6adfce and FUP-4763c82de6324631 are WO-245's and WO-251's own rows, untriaged for planning.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-249 at this review: register revision 491b01c2…, 244 pending rows, 30 matched over four pages; FUP-e08668268dea62b1 is not among them by textual match, and its condition names what this order did, so it is read with its twin.",
    "npm run plan -- followups --apply with the four requests as one batch: every request applied with status deferred; register revision cf3c14bd… after the write.",
    "D025 and packages/skeleton/fixtures/wo249-integration-role-baseline.json startupCost: beforeBytes to bytes per role on the integrated tree, decision WO-249-D025, verifier and planner followup FUP-8dd0eb609946b9d1.",
    "WO-247-D016 and WO-251-D019 re-deferred the same three rows at their reviews; this review follows their reading of the planner-selector row."
  ],
  "rejected": [
    {
      "option": "Carrying the planner's entropy selector or the escape sum inside this review",
      "reason": "Each is a source change the final reviewer would then certify itself, outside the order's criteria and declared surfaces."
    },
    {
      "option": "Leaving the three rows as matched",
      "reason": "Their reopening conditions name exactly what this order and its integration did; a deferral that no longer reads true shifts the burden to the next pass."
    },
    {
      "option": "Disposing the order's own two boarded rows",
      "reason": "They are planning's to triage; the reviewer records them and leaves them untriaged, as WO-251's review did."
    }
  ],
  "reopenWhen": "A planning pass evaluates instruction-byte optimization or allocates the planner's entropy selector; a records merge brings a disagreeing disposition on one of these rows; or a later review finds a left row's seam opened by this order."
}
```
