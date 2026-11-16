# WO-281 decisions

## WO-281-D001

```json
{
  "id": "WO-281-D001",
  "date": "2026-11-15",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v1.1.0, the next minor above the observed release baseline v1.0.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v1.0.1 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-281-the-kit-guide-is-easy-to-follow.md"
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

## WO-281-D002 — The operator's direction: one meta critic on GPT-6 Astra, forty-five minutes on, launched on a copy of the transcript that holds no account address

```json
{
  "id": "WO-281-D002",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's message of 20:06 UTC on 2026-11-15, as the dispatch began",
  "decision": "The operator asked, in paraphrase, for a meta critic on GPT-6 Astra to be started three quarters of an hour later. The critic is the one docs/evidence/WO-276/critic/ holds (its fixed charter, its launcher and its README), which the kit has no command for until WO-279; the worker table binds astra to gpt-6-astra at max on the Codex provider, the launcher's default. The launch is made at the time the operator chose, 20:51:40 UTC, which a background timer set at 20:07 UTC ends on; no gate is started that would still be live then, because the session's hook admits only reads while a gate runs and the launch would wait for its end. The README's fourth rule then runs the clock: a further launch every 75 minutes from the last one while the order is being executed, nothing waiting for a critic, a launch that falls due under a live gate going out when the gate ends, and the clock ending when the passing complete run is in. Each report is given to the operator whole before it is answered, and each point is then judged in a decision of this file. The two checks the README asks a later order to repeat are made on what the critic reads, as WO-277-D002 and WO-277-D029 made them. The account's address: the host writes it into the session's context, so the launch points the critic, with the launcher's --transcripts option, at a copy of this worktree's transcript directory made at the launch in session scratch, in which each occurrence of an address the host stored for the account, and of the checkout's Git user address, is replaced by one fixed placeholder, each file keeps its modification time and no other byte differs. The private list: every row of the copy is read on its own through the list's reader, printing counts only. The sandbox: a command under Codex's read-only sandbox reads the copy and is refused a write beside it. A trial of all three at 20:39 UTC is the evidence below; the copy is made again at the launch, so that it holds the rows written since. The launcher is counted by no hook, so each launch is one worker use counted by hand.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo281-start-a-meta-critic-in-45-minutes-2026-11-15.txt, SHA-256 e05250a68b6e5847d28a03b84e73bd7238e31ceceffbbb67f7808d36c73201fc; the host's prompt facts that came with it are stamped 20:06:39 UTC",
    "docs/evidence/WO-276/critic/README.md (the rules that made it useful, and what it needs), charter.md and launch.mjs; WO-277-D002 and WO-277-D029 (the two checks, the copy and the count by hand)",
    "npm run worker -- list at 20:06:57 UTC: astra is gpt-6-astra at max on the Codex provider; npm run worker -- show astra prints no session launch for a Claude session and names the kit's command as the route; codex --version: codex-cli 0.169.0",
    "Session scratch, critic/prepare-transcripts.mjs under the bounded wrapper, recorded 20:39:12 UTC: the original 1 file, 3,623,089 bytes and 1,467 rows; 2 distinct addresses (one the host stored for the account, and the Git user address, which is another and is in no row); 3 occurrences replaced in 2 rows of 1 file; the copy 1 file and 3,623,101 bytes with no row holding either address and no other address-shaped string; the private list present with 9 entries, none in the refuse class and 9 in the context class; refuseRows 0 and contextRows 0",
    "codex sandbox -- /bin/sh -c 'wc -c < <the copy's transcript>; touch <the copy>/.write-probe' at 20:39 UTC: the size printed, 3,623,101 bytes; the write refused with Operation not permitted; no file created",
    "node docs/evidence/WO-276/critic/launch.mjs WO-281 1 --since 2026-11-15 --transcripts <the copy> --print, read at 20:39 UTC: the charter names this order, this checkout, the copy's directory, an interval of 75 minutes since 2026-11-15 and launch number 1"
  ],
  "rejected": [
    {
      "option": "Launch at once",
      "reason": "The operator named the time, and WO-276-D166 records why a critic launched as a dispatch begins has no conduct to read."
    },
    {
      "option": "One launch and no clock after it",
      "reason": "The message asks for one critic at a stated time and says nothing of later ones; the README's fourth rule, which is the executor's, keeps the clock running in every dispatch that works on an order. The operator's word ends it."
    },
    {
      "option": "Send the transcript as it is",
      "reason": "It holds the account's address in rows the host wrote, and no word of the operator's asks for that to go to the other provider; replacing it changes nothing the critic judges."
    },
    {
      "option": "Run the long suites up to the launch",
      "reason": "A launchpad run took 11 minutes at 20:23 UTC and admits only reads while it runs; one started after 20:40 UTC would have held the launch past the operator's time."
    }
  ],
  "reopenWhen": "The operator says to send the transcript as it is, to hold the critic, to stop the clock or to change its interval; or WO-279 lands, and the kit's own launch and screen replace this copied route."
}
```

## WO-281-D003 — The operator's direction: two more reviewers in round one, both on GPT-6 Astra, one for the documents as instructions and one for machine-made filler

```json
{
  "id": "WO-281-D003",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's messages of 20:09 and 20:10 UTC on 2026-11-15",
  "decision": "The operator asked, in paraphrase, for two reviewers beside the ladder's ordinary ones, each on GPT-6 Astra: one to judge the rewritten documents as instructions a person follows (their quality for a reader, how usable they are and how easy to follow), and one to find text that reads as machine-made filler. The order's ladder is paired, so round one is six workers on one tree, launched together before any fix and none given another's report: the three reviewers, the combined worker and these two. The two special reviewers judge the rewritten guide and the seeded map, which are what a person reads; their findings are recorded one by one with the others' in the round's decision and judged by the same rule, a finding that fails the order's objective (a passage its reader cannot follow) being a criterion-class finding of this order. Each is rechecked in round two where its findings were fixed. The review helper's kinds are the four canonical briefs and take no brief of the caller's, so each special reviewer is launched as the meta critic is: a Codex worker, read-only, given the worker's standing rules and a brief that names the documents, the standard the operator gave and the form of the report, and nothing of the executor's account of its work. Both briefs are kept under this order's evidence.",
  "evidence": [
    "The operator's messages, captured unedited in the ignored intake lane as notes/wo281-add-an-astra-usability-reviewer-2026-11-15.txt, SHA-256 e781ea6aba341fabe3d46b7f3b02dbdd4d3783fc9725c33cbc223029d773b871, and notes/wo281-add-an-astra-filler-reviewer-2026-11-15.txt, SHA-256 292eb06cce4d37eb24cab3646ccaadb674738f0ea4faa281338ba5854be3a084; the host's prompt facts that came with them are stamped 20:09:40 and 20:10:25 UTC",
    "The order's Review ladder line (paired) and its Operator-review assumptions (the standard the operator gave on 2026-11-15: easy to follow and well formatted; long where it must be; brief where it can be)",
    "npm run worker -- review's usage in docs/KIT.md §What runs here: --kind criteria|design|consistency|combined, with no option that takes a brief; docs/evidence/WO-276/critic/launch.mjs, the launch this copies"
  ],
  "rejected": [
    {
      "option": "Fold the two briefs into the combined worker",
      "reason": "The operator asked for reviewers of their own, on a named model; a combined worker on the default model answers neither."
    },
    {
      "option": "Launch them early, on the sections already rewritten",
      "reason": "The ladder's rule is that reviews run after the implementation and its write-backs are complete and never as early scouts; the operator asked for them beside the ordinary reviewers."
    }
  ],
  "reopenWhen": "The operator names another model, another brief or another round for either reviewer; or WO-278 or WO-279 lands a kit launch that takes a caller's brief."
}
```

## WO-281-D004 — The operator's direction: this dispatch's worker cap is 30

```json
{
  "id": "WO-281-D004",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's message of 20:11 UTC on 2026-11-15",
  "decision": "The operator asked, in paraphrase, for the cap on workers to be raised to 30. It is recorded for this dispatch with npm run resume -- accept-overrun subagentCap --ceiling 30 and read from that acceptance; docs/control/budgets.json keeps its 20. The plan against it: round one six uses (D003), round two up to six rechecks, a last combined round at most one, the reader's record one (step 6), and the meta critic's launches on its clock (D002), each launch by a kit launcher counted by hand beside the hook's count.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo281-raise-the-agent-cap-to-30-2026-11-15.txt, SHA-256 a97d92ad2ff3e12f87b81fb5af80ef4f2f8c48e2a37a1daad20770e7eaae496b; the host's prompt facts that came with it are stamped 20:11:12 UTC",
    "npm run resume -- accept-overrun subagentCap --ceiling 30 with that capture, at 20:12 UTC: Recorded DispatchBoundAccepted for WO-281 phase active: subagentCap=30 at ordinal 2. No phase or verdict changed.",
    "node scripts/harness.mjs usage <session> at 20:12:40 UTC: workers: launched 0 (claude 0, codex 0), re-tasked 0, cap 30, remaining 30"
  ],
  "rejected": [
    {
      "option": "Edit docs/control/budgets.json",
      "reason": "The role's rule: a cap the operator states for one dispatch is recorded as an acceptance, and another order's dispatch still reads the file's value."
    }
  ],
  "reopenWhen": "The operator states another cap, or the count of uses nears 30 with rounds still owed."
}
```

## WO-281-D005 — The map this order rewrites is the docs/README.md every instance carries, whose text the export renders

```json
{
  "id": "WO-281-D005",
  "date": "2026-11-15",
  "dispatch": "resume: next; reading step 3 of the execution plan",
  "decision": "Two files answer to docs/README.md. Core's own is its documentation map, 367 lines, which no instance carries. An instance's is a seed the export renders from scripts/launchpad.mjs: a short page that links the kit guide and the README of each root the export seeds. The order's Design scopes the rewrite to the kit guide and the map, which every instance carries and a person opens; its step 3 has a starter refresh replace a starter's unedited docs/README.md with the current map, so the rewritten map reaches every starter; and the register row it was allocated (WO-258-D014) is about that seeded map. So the map rewritten here is the seed: its text in scripts/launchpad.mjs, and the refresh rule in scripts/lib/starter-refresh.mjs. Core's own docs/README.md is not rewritten by this order; the advisory of step 4 lists its long paragraphs with every other standing document's, for the wave the order's Known issues lay out. The executor told the operator this reading in the session, in a message written between 20:13 and 20:18 UTC, and goes on under it.",
  "evidence": [
    "The order: Design, last bullet (scope); Execution plan step 3; criterion 2 (a refresh replaces a starter's unedited docs/README.md with the current map and keeps one an owner changed)",
    "scripts/launchpad.mjs: the seed added at defaultDocRelative(\"docs\", \"README.md\"), a heading, one paragraph and a list of the seeded roots",
    "docs/planning/followups.json, FUP-7de23c426e329c34: allocated to WO-281 because its step 3 makes a starter refresh replace a starter's unedited docs/README.md, so the rewrite reaches every starter",
    "docs/README.md at the base: core's map, with a Config log and no path by which an export copies it"
  ],
  "rejected": [
    {
      "option": "Rewrite core's own docs/README.md as well",
      "reason": "No instance carries it, no criterion names it, and the order's non-goals and Known issues leave core's other documents to the next wave."
    },
    {
      "option": "Rewrite core's docs/README.md instead of the seed",
      "reason": "Step 3's refresh rule and criterion 2 would then carry a map no starter receives."
    }
  ],
  "reopenWhen": "The operator says the order meant core's own docs/README.md, alone or as well."
}
```

## WO-281-D006 — Correction: D005 says the operator was told the reading of the map, and the host's transcript holds no such message; the notices the transcript lacks are sent again in lines it keeps

```json
{
  "id": "WO-281-D006",
  "kind": "correction",
  "date": "2026-11-15",
  "dispatch": "resume: next; the first meta critic's report, 21:05 UTC on 2026-11-15",
  "misread": "The executor took a line it had written between two tool calls for a message the operator had. D005 records that the reading of the map was told to the operator between 20:13 and 20:18 UTC. The host's transcript of this session holds no assistant text between 20:06:39 and 20:28:49 UTC, and the sentence is in no row of it. Read at 21:06 UTC, the transcript held 18 assistant texts, each of them a line of under about 200 characters; every longer line the executor wrote between tool calls is absent, which is what WO-277-D010 observed of its own session.",
  "meant": "A notice counts as given when the transcript holds it. Whether the operator's screen showed the lines the transcript lacks, the executor cannot tell, so they are treated as not said.",
  "changed": "Not held, and so sent again at 21:08 UTC in five lines the transcript holds (rows 2977 to 3019, read back at 21:08:30 UTC): that the critic's report is in, with its path; that longer notes had not been kept; the reading of the map (D005); the six reviewers of round one and the cap of 30 (D003, D004); and that the critic reads a copy of the transcript with the account's address replaced, on a 75-minute clock the operator's word stops (D002). D005's decision stands on the order's text and its register row; its sentence about the notice is wrong as written and is corrected here, the record being dated and not rewritten. From here a line written between tool calls is kept under about 180 characters, a decision that relies on a notice names the transcript row that holds it, and anything longer (a critic's report whole, a round's findings) goes in the turn's closing message, with a short line naming its file when it arrives.",
  "decision": "D005's account of its notice is corrected, the notices are sent again, and the executor's lines between tool calls are held to what the host keeps.",
  "evidence": [
    "docs/control/local/reviews/WO-281/critic-1.md, criticism 1 and First change (launch 1, gpt-6-astra at max, 20:51:41 to 21:05:27 UTC)",
    "Session scratch, critic/find-message.mjs over this session's transcript at 21:06 UTC: the phrases of four of the executor's longer lines (its reading of the second message, the cap, the reading of the map, the notice that the critic was running) are in no row; the assistant texts held are at rows 44, 1107, 1218, 1289, 1508, 1568, 1601, 1677, 1735, 1946, 2030, 2209, 2273, 2490, 2610, 2751 and 2906",
    "The same script at 21:08:30 UTC: rows 2977, 2986, 3001, 3010 and 3019 hold the five lines sent again, stamped 21:08:06 to 21:08:25 UTC",
    "WO-277-D010 (the same loss in that order's session, and the inference that the host keeps a line written between tool calls only when it is short)"
  ],
  "rejected": [
    {
      "option": "End the turn so that a closing message carries the notices",
      "reason": "The order's work would then wait for a reply, and the README's fourth rule has nothing wait for a critic; short lines the transcript holds reach the operator without stopping."
    },
    {
      "option": "Leave D005 as written, since the reading itself is sound",
      "reason": "It records a notice as given that the record cannot show, which is the class the critic names."
    }
  ],
  "reopenWhen": "The host is shown to display the longer lines to the operator, or the operator says how they want to be told."
}
```

## WO-281-D007 — The first meta critic's three points, each checked and accepted: a notice recorded without its message, step 2's checks batched without saying so, and a progress line that claimed more than the inventory shows

```json
{
  "id": "WO-281-D007",
  "date": "2026-11-15",
  "dispatch": "resume: next; the first meta critic's report, 21:05 UTC on 2026-11-15",
  "decision": "Launch 1 ran 14 minutes on gpt-6-astra at max, by the launcher's own line, and returned three criticisms, three things to keep and one first change. Its path was given to the operator at 21:08:06 UTC in a line the transcript holds (row 2977), before this answer; the report goes whole into the turn's closing message. Each point was checked against its source. First, accepted: D005 recorded a notice the transcript does not hold; D006 corrects it and sends the notices again. Second, accepted: step 2 of the execution plan asks for the inventory's difference and five named checks after each section, and the executor ran the inventory after each splice and the suites by batch, without recording the departure when it chose it. What was run, and what each run covers, is set out in the evidence below. The first splice after the pasted paragraph carried the guide's opening and six sections at once, so the inventory at 20:34:58 UTC read seven sections together; the later splices each carried one section or two. The suites: launchpad and registrations passed over the pasted paragraph alone; launchpad-planning and sync-fixtures, started at 20:51:59 UTC over the whole first draft, stopped at the structural check because the decisions index was stale (the executor had added four decisions and not run npm run meta), and the run was stopped at 20:55:53 UTC; two bounded probes of the cases that read the guide then found four pinned sentences and one phrase the rewrite had wrapped across two lines, which D008 records. The reason for the batch is cost: a launchpad run takes 11 minutes and the session's hook admits only reads while a gate runs, so four suites after each of fifteen sections would have held the guide closed to writing for most of a day. The four suites and the operator-commands check are owed over the guide as it stands after steps 3 to 5, in one run that also covers those steps' own checks; each later change to the guide is followed by the inventory and the pinned-sentence check at once and by the suites before the review ladder. Third, accepted: at 20:45:56 UTC the executor told the operator that fourteen sections were in the guide with nothing lost, on an inventory that reads headings, code spans, lines of fenced blocks and link targets and nothing of the prose between them. A progress line from here says that no inventoried item is missing. What the prose is held to: a list, from the same script, of the words of the base's prose that the candidate nowhere holds, each read and accounted for by the executor (step 7's record); the reader's ten tasks answered from both texts (step 6); and the review ladder. The three things to keep are kept: reading before rewriting, drafting outside the repository while a gate runs, and checking what the critic reads before each launch. The second launch is due at 22:06 UTC, 75 minutes after the first.",
  "evidence": [
    "docs/control/local/reviews/WO-281/critic-1.md (3,454 bytes); the launcher's line: critic 1: gpt-6-astra at max; 14 min; started 20:51:41 UTC, ended 21:05:27 UTC; the copy it read, made at 20:51:41 UTC: 1 file, 4,784,766 bytes, 2,119 rows, 3 occurrences of the account's address replaced in 2 rows, no row holding an address, the private list present with 9 context entries and no row matched in either class",
    "The inventory after each splice (node docs/evidence/WO-281/inventory.mjs, absent 0 at each): 20:18 UTC the pasted paragraph, as its own subsection; 20:34:58 the opening, First steps, Plan-first mode, Features, Planning in this instance, Releases in this instance and Working as a team on one instance; 20:36:04 What runs here; 20:37:58 Attestations and Kit files and instance files; 20:41:16 Extending this instance; 20:43:56 Taking upstream updates; 20:44:44 Opting in to instance actions; 20:45:22 Document quality and License; 20:47:33 Owned cleanup and retention; node scripts/lib/operator-commands.mjs --check current at 20:18, 20:34, 20:36, 20:43 and 20:47 UTC",
    "Gate rows: suite:registrations 8 passed at 20:23:27 UTC (two earlier runs stopped at the format check on the new script and at the release surfaces before release prepare); suite:launchpad 9 passed, 653 s, at 20:34:30 UTC, over the guide with the pasted paragraph rewritten and no other section; suite:launchpad-planning and suite:sync-fixtures 4 passed, 5 failed at 20:53:01 and 20:54:02 UTC with Decisions index is stale; run npm run meta; node scripts/harness.mjs evidence --stop at 20:55:53 UTC stopped the launchpad run that followed",
    "Bounded probes: scripts/test-launchpad-export.mjs, 16 cases that read the guide or the export, 20:57 to 21:01 UTC, 15 passed and 1 failed on the phrase until this instance records its own discovery, wrapped across two lines; scripts/test-launchpad-planning.mjs, the case that takes a release by the guide's procedure, failed at 21:02 UTC on a pinned sentence and passed at 21:05 to 21:06 UTC, 44 s, after D008's changes",
    "The transcript, row 1677, 20:45:56 UTC: the executor's line that fourteen of fifteen sections were in the guide with nothing lost"
  ],
  "rejected": [
    {
      "option": "Run the four suites after each section from here, as the plan is written",
      "reason": "Every section is already rewritten, so the plan's point, a broken reader found near the section that broke it, is now served by the cases' own messages, which name the sentence they miss; the remaining changes to the guide are small and each is followed by the inventory and the pinned-sentence check."
    },
    {
      "option": "Decline the third point, since the inventory is the order's own criterion",
      "reason": "Criterion 1 is the inventory, and the objective is wider: no fact of the guide is lost. The line claimed the objective on the criterion's evidence."
    }
  ],
  "reopenWhen": "A suite fails over the whole rewrite in a way its message does not trace to a passage; or the list of the base's words the candidate lacks shows a fact the rewrite dropped."
}
```

## WO-281-D008 — Expected data: the sentences two suites pin in the guide, four kept by the guide's wording and three updated to the rewritten text

```json
{
  "id": "WO-281-D008",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 2, the cases that read the guide",
  "decision": "Two suites read sentences of the kit guide. scripts/test-launchpad-export.mjs matches four phrases and a pattern in the guide's bytes, without joining lines; scripts/test-launchpad-planning.mjs reads twelve sentences with white space joined and takes the preview's commands from the first fenced shell block after one of them. The rewrite keeps every fact those sentences state. Where a pinned sentence reads as well as the rewritten one, the guide keeps it: the phrase until this instance records its own discovery is set on one line again, and the recovery's second step says the session deletes that file before the stash. Where the rewritten text is the better one for a reader, the suite's expected sentence is changed to it, and the cause is this order's rewrite: (1) the recovery's closing steps are a numbered list, so the case no longer asks for one run-on sentence and asks instead that the first 200 characters after The operator then opens a session in wo-001 hold the bootstrap and the registering of the terms list; (2) the sentence on the lineage index in step 7 of the setup links Taking upstream updates where the base wrote the section's name after a section sign, and is two sentences; (3) the same fact under Kit files names step 1 of the setup, since the step is in another section, and ends its sentence before Bootstrap never writes it. No case was removed and none was weakened to pass: each still fails if the fact leaves the guide. The pinned sentences are kept in session scratch as a script that reads the working guide, run after each later change to it.",
  "evidence": [
    "Bounded probe of scripts/test-launchpad-export.mjs, 20:57 to 21:01 UTC: 15 of 16 cases passed, among them the list of the fifteen second-level headings, the table of core-only suites and the three selection lines; 1 failed on /until this instance records its own discovery/, which the rewrite had wrapped; after the rewrap the pattern matches (session scratch, kit/pins.mjs)",
    "Bounded probe of scripts/test-launchpad-planning.mjs, the case an instance exported at v0.81.0 takes this release by the kit guide's procedure: failed at 21:02 UTC on the sentence that opens the recovery's last paragraph; kit/pins.mjs then showed four of the twelve sentences absent; after the changes the case passed at 21:06 UTC in 44 s",
    "scripts/test-launchpad-planning.mjs: the three changed expectations, each beside the comment that says what it protects; docs/KIT.md §Recover a first order activated on main, §The setup, step by step (step 7) and §Generated and seeded pages"
  ],
  "rejected": [
    {
      "option": "Restore all four sentences in the guide as the base wrote them",
      "reason": "Two of them are the forms the order asks to change: a procedure written as one sentence, and a section named in running text where a link serves the reader."
    },
    {
      "option": "Drop the sentence checks, since the inventory covers the guide",
      "reason": "The inventory reads headings, code, block lines and links; these cases hold facts of the prose, which nothing else in the suites holds."
    }
  ],
  "reopenWhen": "A later write-back rewraps or rewords one of the pinned sentences, in which case the case's message names it; or the suites take a reader of the guide's facts that needs no sentence."
}
```

## WO-281-D009 — Step 2 as built: the guide keeps its fifteen sections and their anchors, each rewritten as subsections with steps, lists and tables, one passage moved, the dated accounts dropped and two sentences corrected

```json
{
  "id": "WO-281-D009",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 2 of the execution plan",
  "decision": "Every section of docs/KIT.md is rewritten in the order's shape. What stays: the title, the fifteen second-level headings in their order and with their anchors (the export suite pins the list; five anchors are linked from other documents and the generated commands page), the one third-level heading the base had (Hooks), every marked command block byte for byte with its marker, and every code span, block line and link target of the base. What changes in form: each section opens by saying what it is for; a section of five or more subsections lists them; a procedure is numbered steps; rules and options are lists or tables; a command a session runs is a block, set aside from the operator's page by its marker; the decisions behind a passage are linked on one Decisions line at the end of its subsection, each with a label that says what was decided. The base held 196 paragraphs, 63 of them over 120 words and the longest 1,452; the candidate holds 1,147, none over 120 and the longest 111, under 89 third-level and 62 fourth-level headings, with 32 tables where the base had one and 25 numbered lists where it had one. It is longer: 4,244 lines and 32,637 words against 2,765 and 27,726. The 4,900 words are headings, the lists of subsections, table heads, the opening sentence of each section and the labels of decision links; no passage was shortened for its own sake, and the order holds length to be a smell and no fault where a text is easy to follow. Moves, each for a reader who would not look where the base had it: (1) the reference to the build overlay, from the guide's opening, where it stood before a reader had been told what to do, to Features, beside the other things an instance sets and emits; (2) within First steps, the long matter of steps 4 and 5 into subsections the steps name (The local-terms list, The configuration file, Register another repository, Publish a target order's change), the seven numbered steps keeping their numbers; (3) within Taking upstream updates, an instance's own procedure first and core's update of the starter last, with what an instance older than v1.0.0 does gathered into one subsection; (4) within Owned cleanup and retention, the sentence on an orphan with no observed end beside the other rules of how a prune judges. First steps links no record: it is a reader entry point, which the document check holds to standing pages, so its subsections name the section that cites a decision, as the base did. Dated accounts dropped, each a history the decisions and releases hold: that an overlay naming the Tinkerer support was accepted with an advisory through v0.118.0 and refused from v0.119.0 (the guide says it refuses); which orders admitted the three publish helpers; the dates of two operator directions, whose records stay linked; as before, now and from v1.0.0 on in five sentences that state what is so. Corrected, each a sentence the base had wrong or incomplete: License said the export bundles no third-party file, where Kit files names the three it carries (Prettier's Markdown plugin, its license and its notices), and now says so; and where the guide said a context entry never refuses, it names the two publications into a target that hold one, the target order's, which waits for the reviewer's confirmation, and the planning pass's, which refuses with no confirmation (WO-276-D155, item 3; the register row allocated to this order). The inventory lists nothing of the base absent from the candidate, so this decision names no removal. Beside it the same script lists the words of the base's prose that the candidate nowhere holds: twenty, each read and accounted for below.",
  "inventoryRemovals": [],
  "evidence": [
    "node docs/evidence/WO-281/inventory.mjs at 21:28 UTC: base 5edc7798b 2,765 lines, candidate 4,244 lines; absent 0; new 232 (the added headings and their links, the blocks set from running text, the new subsection on long paragraphs); base prose words not held 20; docs/evidence/WO-281/inventory-difference.md",
    "The twenty words, each with what became of it: spanning (a match that spans rows); 5 (the step's number, replaced by a link to The configuration file); enter (the session enters the phrase); wo-242-d026, wo-257, wo-246 (an order's number used as a link's text or in a dated account; the link targets are kept); migration, 118, 119 (the dropped account of the overlay's migration); withdraws (a withdrawal); handed (a pass that works an initiative); 2026-11-09 and 2026-11-07 (the dates of two operator directions); flag (no --format); denies (the host may deny a step); except (with one exception); classed (the class is set where the refusal is raised); finished (the next prune finishes it); interpret and yourself (the session interprets the context and runs the command itself)",
    "Structure, counted from the parser's tree at 21:28 UTC: base 1 first-level, 15 second-level and 1 third-level heading, 1 table, 11 lists of which 1 numbered, 24 fenced blocks, 196 paragraphs, 27,726 words; candidate 1, 15, 89 and 62 fourth-level headings, 32 tables, 195 lists of which 25 numbered, 33 fenced blocks, 1,147 paragraphs, 32,637 words",
    "node scripts/lib/operator-commands.mjs --check: docs/OPERATOR.md is current, its only change the version line release preparation wrote",
    "scripts/lib/vendor/ (prettier-markdown.mjs, prettier-LICENSE, prettier-THIRD-PARTY-NOTICES.md) and THIRD_PARTY_NOTICES at the root, for the License sentence; scripts/lib/target-planning.mjs, whose target publication calls the artifact lint with no confirmation, and scripts/lib/target-publish.mjs, whose lint refuses a review item until the body's digest is confirmed, for the two routes",
    "node scripts/docs-check.mjs at 21:24 UTC: FAIL docs/KIT.md: entry point kit-first-steps names the record docs/evidence/WO-276/decisions.md, on the one decision link the rewrite had put under First steps; the link is under Planning in this instance now"
  ],
  "rejected": [
    {
      "option": "New second-level sections, such as one for work on another repository",
      "reason": "It would gather what First steps, Planning and Releases each hold on a target, and it changes the section each marked block of the commands page names and the list the export suite pins. The order has the next orders write into this guide; a subsection under the section that already holds each passage keeps their anchors, and the table at the guide's head sends a reader to it."
    },
    {
      "option": "Keep the overlay reference where it was",
      "reason": "The observed gap names the guide's opening as an inventory; a schema's reference before First steps is the same fault."
    },
    {
      "option": "Trim the guide to the base's length",
      "reason": "The order's Design: never shorten for its own sake. What can be said in fewer words without a loss is for the review ladder and the two reviewers the operator added to find."
    }
  ],
  "goalAlignment": {
    "traps": {
      "structureForItsOwnSake": "Headings and tables can make a page look ordered and read no better. Each table here holds things of one kind in rows a reader compares, each numbered list is a sequence someone carries out, and the reader's ten tasks (step 6) test whether an answer is found faster.",
      "lostInTheMove": "A fact moved between sections can be dropped on the way. The inventory reads the whole file, not a section, so a moved item is still found, and the list of the base's words covers the prose."
    },
    "noOp": "The guide as the base had it, with the pasted paragraph alone rewritten: the operator's finding was the whole guide."
  },
  "reopenWhen": "The operator reads the rewrite and asks for another shape; a reviewer or the reader's record shows a passage that is harder to follow than the base's; or a later order renames a section, as WO-282 plans for the update section."
}
```

## WO-281-D010 — Step 4: the document check lists the long paragraphs a branch writes in standing documents, at a figure of 120 words, and prints the whole list on request

```json
{
  "id": "WO-281-D010",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 4 of the execution plan",
  "decision": "scripts/docs-check.mjs reads each standing document a branch changes and lists, by file and line as an ADVISORY line the document gate relays from a passing run, every paragraph the branch adds or changes that runs past a figure of words. It refuses nothing and keeps no total. A paragraph is the parser's (running text, in a list item or a quotation too; a table, a fenced block and a heading are none), and its words are counted as written. The figure is documents.paragraphWords in docs/control/budgets.json: core's file sets 120, the kit's figure where a file or the key is absent is 120, null turns the list off, and a value the budgets loader refuses falls back to the kit's figure with a note, since this check fails nothing over length. In an instance the kit's own documents are left out, as the verbatim screen leaves out the kit's text: an update replaces them and the instance cannot rewrite them. node scripts/docs-check.mjs --long-paragraphs prints the same reading of every standing document, whole, for the wave the order's Known issues lay out. Why the gate lists what the branch writes and not every standing document: the order has the list be a smell for the stage at hand to read, and what a stage can read and rewrite is what its branch wrote. Measured at 21:00 UTC, core's 363 standing documents held 1,553 paragraphs over 120 words in 318 files, 255 of those files orders, which nobody rewrites once they close; printed in every document gate, that list would be some three hundred lines a stage could act on none of, beside the lines it must read. The whole list is one command away and is the before and after of this order's evidence. The figure is the executor's first setting, as the order's assumptions say, and the operator may change it: at 120 the base's guide had 63 such paragraphs and the rewritten one has none, its longest 111 words; at 100 the rewritten guide has one. The kit's budgets template is left as it is: it is a template seed, so a change to it would have the next starter refresh rewrite, or refuse, every starter's budgets file for a key whose absence already means 120. The features table gains no row: it lists some of the budgets file's keys and not all (the day's figure has none), and the guide and product 07 name this one where a reader of the document check looks.",
  "evidence": [
    "scripts/docs-check.mjs: paragraphFigure, paragraphsOver, longParagraphs and standingLongParagraphs, the status line and the ADVISORY lines of the default run, and --long-paragraphs; scripts/lib/process-budget.mjs: PARAGRAPH_WORDS and paragraphWordsKey, which readBudgets calls; scripts/test-runner.mjs, which relays a passing task's lines that open with ADVISORY",
    "scripts/test-docs-check.mjs, the case named for criterion 4, probed under the bounded wrapper at 21:25 UTC, 1 passed in 1.1 s: a 130-word paragraph and a 125-word list item the branch adds are listed by file and line; a 130-word paragraph the branch left alone, a 400-word paragraph of a record, 300 words in a fenced block and 300 in a table cell are not; exit 0 and no FAIL; a figure of 200 lists nothing, null turns the list off, a malformed value notes the fallback; --long-paragraphs lists all three long paragraphs of the page",
    "Measured over the working tree at 21:00 UTC (session scratch, from documentReport and the parser): standing documents 363, paragraphs 17,933, over 80 words 3,557, over 100 2,313, over 120 1,553, over 150 1,010, over 200 616, over 300 350; files with a paragraph over 150 words 296, of which docs/work-orders 255 of 275 files; docs/KIT.md at the base 196 paragraphs, 63 over 120, 50 over 150, the longest 1,452; the candidate 1,137 at that hour, none over 120, the longest 111",
    "node scripts/docs-check.mjs at 21:24 UTC on the candidate: long paragraphs: over 120 words (documents.paragraphWords in docs/control/budgets.json); none among the paragraphs this branch adds or changes in standing documents; node scripts/docs-check.mjs --long-paragraphs: 307 documents listed",
    "scripts/lib/starter-seeds.mjs: docs/control/budgets.json is a template seed, rewritten where proven and refused where customized once its template changes"
  ],
  "rejected": [
    {
      "option": "List every standing document's long paragraphs in every document gate",
      "reason": "Some three hundred lines in core at each run, most of them closed orders, for a stage that can rewrite none of them; a list nobody can act on is read by nobody, and this one is meant to be read."
    },
    {
      "option": "List every long paragraph of a document the branch touches",
      "reason": "A one-sentence write-back to product 07 would list its 140 long paragraphs, which belong to the next wave; the paragraph a write-back changes is the passage the rule has its writer read as a whole."
    },
    {
      "option": "A refusal by length, or a total to drive down",
      "reason": "The order rejects both: the standard is whether a reader can follow, and WO-238-D005 retired ceilings for documents."
    },
    {
      "option": "A figure of 150 or 200 words",
      "reason": "At 150 a paragraph of a dozen lines passes unlisted. The list costs a stage one reading of each paragraph it names, so the lower figure is the cheaper mistake."
    }
  ],
  "reopenWhen": "The operator sets another figure, or asks for the whole list in every gate; an instance reports the list naming a document it cannot rewrite; or the next wave's rewrite of the product documents leaves the whole list short enough to print."
}
```

## WO-281-D011 — Step 5: the final reviewer returns a changed standing passage its reader cannot follow, in the rule every role carries and in product 07

```json
{
  "id": "WO-281-D011",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 5 of the execution plan",
  "decision": "The shared rule on document kinds (the record document-kinds in packages/skeleton/src/loadouts/contributor.ts, which every role's root holds whole) ends with the final reviewer's reading of each changed standing document. That sentence now names three outcomes where it named two: a replacement passes, a dated account added under a standing heading returns to repair, and so does a changed passage its reader cannot follow, which the review names. Product 07's paragraph on documentation freshness says the same, set as a short paragraph of its own with the rule it holds a write-back to, and item 7 of the planning pass's list gains a short paragraph on the document check's list. No other wording of the write-back rule or of quality pass changes: the order's Design holds that the rules already asked for this and nothing held a write-back to them. The role text has no separate step of the reviewer's on standing documents; the shared rule's last sentence is the reviewer's reading, and the rule table of WO-276's Part F records that the reviewer keeps the rule because it names that reading. node scripts/harness.mjs emit and npm run sync rebuilt the runtime and wrote the roots, the hooks' pins, the harness manifest and the authority evidence edition, and node scripts/harness.mjs check passes. Both passages of product 07 are long paragraphs. The additions are set as paragraphs of their own beside them, so that this order adds no sentence to a paragraph nobody can follow and the list of D010 names none of them; product 07's own rewrite is the next wave.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts, the record document-kinds; docs/evidence/WO-276/part-f/rule-table.md, the rows of document-kinds",
    "docs/product/07-execution-guide.md §Documentation freshness and ownership and §Operator-opened planning pass, item 7",
    "node scripts/harness.mjs emit, then npm run sync at 21:27 UTC: runtime, harness, meta, authority-evidence and publication regenerated; node scripts/harness.mjs check: 37 generated surfaces; the sentence is in .claude/skills/dotln-reviewer/SKILL.md, .claude/skills/dotln-executor/SKILL.md and .agents/skills/dotln-reviewer/SKILL.md, once each"
  ],
  "rejected": [
    {
      "option": "A new rule, or new wording for the write-back and quality pass rules",
      "reason": "The order rejects it: the existing rules ask for this and were not applied, and WO-276's record of criticisms finds a rule alone the weakest remedy."
    },
    {
      "option": "A sentence in the reviewer's own procedure as well",
      "reason": "The reviewer's root already holds the shared rule whole; a second sentence would say it twice, which the rule-by-role work of WO-276 removed."
    }
  ],
  "reopenWhen": "A final review passes a changed standing passage that a later reader cannot follow, or returns one for its length alone."
}
```

## WO-281-D012 — Step 3: the documentation map is a kit template rewritten as a table of the roots, and a starter refresh brings a copy an older export wrote to it and keeps one its owner changed

```json
{
  "id": "WO-281-D012",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 3 of the execution plan",
  "decision": "The map every instance carries (docs/README.md, D005) is rewritten the way the guide is: it says what the page is, points a person to the commands page and a role to the guide, and lists the roots in a table, each with what it holds, where the base had one paragraph and a list of bare paths. Its text is now a kit template, scripts/kit/docs-map.template.md, which the export writes as the seed; the export refuses a template that links no README of a root it seeds, so the page and the seeded roots stay in step. The refresh rule (scripts/lib/starter-seeds.mjs, which scripts/lib/starter-refresh.mjs calls): the map follows the front page's rule and not a template seed's. A starter whose map still holds an export's bytes is brought to the current map and named under seeds published; one its owner changed, or that is no regular file, is kept with the reason under seeds kept and stops no refresh; one that is missing is added with the other absent seeds, as before. An export's bytes are proven two ways. From this release on the map is written from a template the starter carries, so it is proven as the template seeds are, against the template of the export that wrote it. Before this release the export rendered the map in code and no kit file held its text, so the five texts it ever wrote are recognised by their SHA-256, a closed list in the module. The five were computed from scripts/launchpad.mjs as it stood at each of its 28 commits on main up to the base, and the first equals, byte for byte, the copy core's starter holds today, which is the copy WO-258-D014 found the refresh could not reach. The case beside the root README's puts that first text into the fixture's starter, sees the preview name the change and the refresh publish the current map, then sees an owner's edit kept with its reason through a preview and a refresh. The guide says so in three places: under the seeds a pass reads, under generated and seeded pages and under what an update replaces.",
  "evidence": [
    "scripts/kit/docs-map.template.md; scripts/launchpad.mjs (the seed from the template, the guard on the seeded roots' links, the template in KIT_TEMPLATE_FILES); scripts/lib/starter-seeds.mjs (DOCS_MAP_SEED, DOCS_MAP_TEMPLATE, LEGACY_DOCS_MAPS, the map among the seeds a refresh plans and among those it keeps when customized)",
    "docs/evidence/WO-281/map-renderings.mjs and its record map-renderings.md: 5 renderings over 28 commits, none unread; the starter's own copy, read from the recorded sibling checkout at 21:29 UTC, has the SHA-256 of the first",
    "scripts/test-launchpad-update.mjs, the case starter refresh publishes one verified commit and preserves every refusal boundary, with the map's case after the front page's: probed under the bounded wrapper at 21:16 to 21:20 UTC, 1 passed in 195 s",
    "scripts/test-launchpad-export.mjs: the map links docs/KIT.md and the README of every root the kit seeds, every link resolves, and the lineage line says its README is the index the export seeds; the probe of 20:57 UTC ran before the template and the full suite is owed over it",
    "docs/planning/followups.json, FUP-7de23c426e329c34 (WO-258-D014), allocated to this order"
  ],
  "rejected": [
    {
      "option": "Keep rendering the map in code and add each new text's hash to the list",
      "reason": "Every later change to the map would owe a line to that list, and a forgotten line would leave every starter's map behind in silence. A template is proven by the starter's own history, as the other seeds are, and the list closes at five."
    },
    {
      "option": "Make the map a template seed like the others",
      "reason": "A template seed its owner changed refuses the whole refresh once its template changes, and a missing one is no longer added. The map is a page a person edits; the front page's rule keeps an edited copy and says why."
    },
    {
      "option": "Recognise an older map by its text's shape",
      "reason": "A reader of prose by pattern would take an owner's lightly edited map for the kit's; bytes either equal an export's or do not."
    }
  ],
  "reopenWhen": "A starter or a fork reports a map an export wrote that the refresh kept as customized, which would be a sixth text this list lacks; or the map gains a part rendered from an instance's own configuration, which a fixed template cannot hold."
}
```

## WO-281-D013 — The skeleton component is 0.92.0: its role text gained a sentence

```json
{
  "id": "WO-281-D013",
  "date": "2026-11-15",
  "dispatch": "resume: next; release preparation after step 5",
  "decision": "Step 5 changes packages/skeleton/src/loadouts/contributor.ts, so @dotln/skeleton goes from 0.91.0 to 0.92.0, a minor, as each earlier release that changed its source bumped it. The console pins the skeleton exactly, so its dependency and the lockfile's two entries name 0.92.0; the console's own version stays, its source being unchanged. Compatibility: the change is one sentence in a rule every role's root holds, which an instance receives by the re-emit its update branch already runs; no schema, command or record changes. No other component's source changed. Release preparation leaves component versions to the executor and its surfaces check found the missing bump at 21:33 UTC.",
  "evidence": [
    "npm run sync at 21:33 UTC, the release-surfaces row: FAIL component-version @dotln/skeleton: src changed; observed 0.91.0; previous v1.0.1 0.91.0; expected a different version",
    "npm run release -- check-surfaces --local at 21:35 UTC: PASS component-version @dotln/skeleton: src changed; observed 0.92.0; previous v1.0.1 0.91.0; PASS component-version @dotln/console: src unchanged; observed 0.6.0",
    "packages/skeleton/package.json, packages/console/package.json and package-lock.json; the three earlier bumps of the skeleton, each a minor with the console's pin and no change of the console's own version where its source was unchanged (git log -- packages/skeleton/package.json)"
  ],
  "rejected": [
    {
      "option": "A patch, 0.91.1",
      "reason": "The component's record has no patch bump for a change of role text; a rule's wording is what the roots are made of, and the record's own practice is a minor."
    }
  ],
  "reopenWhen": "Main takes 0.92.0 for another change before this order merges, in which case the bump is retimed at integration with its impact unchanged."
}
```

## WO-281-D014 — Step 6: the reader answered nine of the ten tasks more easily from the rewritten guide and one about as easily, and its report changed seven things in the guide

```json
{
  "id": "WO-281-D014",
  "date": "2026-11-15",
  "dispatch": "resume: next; step 6 of the execution plan",
  "decision": "One fresh worker of the instance's default worker for Claude answered the ten tasks of docs/evidence/WO-281/tasks.md from the guide at the base and from the candidate, told nothing else of the order, reading the base first for odd-numbered tasks and the candidate first for even. Both answer sets, with the sections used, are in docs/evidence/WO-281/reader-record.md beside the revisions read. Its comparison: the candidate was the easier text for nine tasks and about even for one, running an order, where both texts kept the steps in the comments above the marked blocks and neither's entry points named the task. The facts of the two texts were the same but for three the candidate adds or corrects: the planning publication into a target refuses a context entry, the license names the three bundled files, and the map's refresh rule. The reader found the candidate's table of tasks and each section's list of subsections led to the right passage at the first try for nine of ten. What the executor took from it, each made in the guide before the review ladder: a subsection Run and close an order, with every step in visible text and named in the table and the section's list; the commands that keep an instance's bytes at an update's merge, in visible text; the first pass's steps through costs, refutation, checks and publish; the close's publish sentence moved to the steps of a close; a sentence on what the comments above marked blocks are; a link from a review launch's model option to where a model is set; and stop for hold in the sentence on the two publications into a target. The marker comments themselves are unchanged: they are the commands page's text, which WO-277 wrote and this rewrite keeps, and the page is still current. Gaps the reader found in both texts are left: the base does not state them, and this order adds no fact about the kit's behavior to the guide. They go to the handoff for a planning pass. Limits: one reader, who read both texts, so the second read of each task had an advantage, which the alternating order spreads and does not remove; it gave places read and no times; and it could not compute the candidate's hash while this session's suites ran, so the hash is the executor's reading before and after.",
  "evidence": [
    "docs/evidence/WO-281/reader-record.md: the report whole (34,716 bytes, SHA-256 9fc49e923afde4d3b20b567746664bfdb9f04c3a26e0205ee3b2678050b7d6f7 as extracted from the worker's hand-back), under the executor's account of what was read",
    "The worker: Agent subagent_type dotln-worker, launched 21:37:37 UTC, returned 21:47:28 UTC, 58 tool calls; its transcript names claude-opus-5-5; the effort is the generated definition's and was not read back",
    "Text A: docs/KIT.md at 5edc7798b, 2,765 lines. Text B: the working tree's docs/KIT.md, 4,247 lines, SHA-256 0ebb0b6a6a8022603d45c4fd578eed1df095c3a511b1298dbd0e566061ae38b3, read by the inventory at 21:33 UTC and by shasum at 21:59 UTC, with no write admitted between",
    "After the changes, at 22:02 UTC: node docs/evidence/WO-281/inventory.mjs, absent 0; node scripts/lib/operator-commands.mjs --check, current; no duplicate anchor, no unresolved link, no paragraph over 120 words"
  ],
  "rejected": [
    {
      "option": "Two readers, one for each text",
      "reason": "The order asks for one fresh worker over both texts; two readers differ from each other as well as the texts do. The alternating order is what one reader allows."
    },
    {
      "option": "Rewrite the marker comments so their step numbers match the guide's",
      "reason": "They are the text of docs/OPERATOR.md, where those numbers are the page's own; changing them changes the person's page, which is WO-277's and outside this rewrite."
    },
    {
      "option": "State the facts the reader could not find",
      "reason": "A remedy for each class of a stopped close, the retry command's text and how a term's case is matched are behaviors nobody has written into the guide; stating them here would need each checked against the code and is a planning pass's to file."
    }
  ],
  "followup": "Planning, priority low: the kit guide states, each checked against the code, (1) what to do for each class of a stopped release close and the retry command as the close prints it, (2) whether an entry of the local-terms list is matched without regard to case, (3) an example of a repository's registration under repositories in dotln.config.json, (4) what the body file of an update's pull request holds, and (5) that .claude/settings.instance.json is an instance file. Each is a gap a fresh reader met in the guide before and after WO-281's rewrite (docs/evidence/WO-281/reader-record.md).",
  "reopenWhen": "The operator reads the two answer sets and finds a task the rewrite made harder; or a reviewer of the ladder finds a passage the reader passed that a person cannot follow."
}
```

## WO-281-D015 — Expected data: the refresh of the v0.81.0 fixture's starter now rewrites its map

```json
{
  "id": "WO-281-D015",
  "date": "2026-11-15",
  "dispatch": "resume: next; the focused suites over steps 3 to 5",
  "decision": "scripts/test-launchpad-planning.mjs holds a starter exported at v0.81.0 and refreshes it at this release; it pins the list of seeds the refresh rewrites. That starter's docs/README.md is the map its own export wrote, one of the five texts D012's list recognises, so the refresh now brings it to the current map and the list gains docs/README.md. The expected list is changed to say so, and the case also reads the refreshed starter's map against the template. The cause is step 3, which exists to make exactly this refresh. It is a second, independent sight of the rule on an older export's real bytes: the fixture was written long before this order and holds a different text from the one core's starter holds.",
  "evidence": [
    "npm test -- --only launchpad-planning at 21:43 to 21:49 UTC: 8 passed, 1 failed, the case an instance exported at v0.81.0 takes this release by the kit guide's procedure, on rewrittenSeeds: the actual list held docs/README.md between docs/control/budgets.json and docs/repositories/README.md and the expected list did not",
    "scripts/test-launchpad-planning.mjs, the expected list and the assertion after it; scripts/fixtures/legacy-v0.81.0/, the fixture's starter"
  ],
  "rejected": [
    {
      "option": "Leave the fixture's map out of the rule",
      "reason": "It is an older export's own output, the case the rule is for; excluding it to keep a list unchanged would test the old behavior."
    }
  ],
  "reopenWhen": "The fixture's starter is replaced by one whose map an owner changed."
}
```

## WO-281-D016 — Correction: three records stated more than their evidence held: how the reader read, how many order files the list's figure covers, and what the critic ran on

```json
{
  "id": "WO-281-D016",
  "kind": "correction",
  "date": "2026-11-15",
  "dispatch": "resume: next; the second meta critic's report, 22:22 UTC on 2026-11-15",
  "misread": "Three statements took an instruction, a figure or a setting for an observation. (1) D014 says the reader read the base first for odd-numbered tasks and the candidate first for even; that is what its brief asked. (2) D010 says core's standing documents held 1,553 paragraphs over 120 words in 318 files, 255 of those files orders; the 255 was counted at 150 words, in another measurement. (3) D007 says the first critic ran on gpt-6-astra at max, by the launcher's own line; the launcher prints the model and effort it was configured with, and nothing read back what the host ran.",
  "meant": "(1) The reader's transcript shows it read both texts in long runs before it wrote: the base's lines 1 to 595, the candidate, the base's 750 to 1210, the candidate again, then the base's 1210 to 2765. Its own note says it kept the order when locating and writing each answer and that knowing one text helped it read the other. So no task was read from one text alone first, and the alternation spread nothing; what the record holds is a reader's comparison of two texts it had both read, with the sections it found each answer in. (2) Counted at one figure each over the candidate's 347 standing Markdown documents at 22:24 UTC: over 120 words, 1,543 paragraphs in 307 files, of which 264 of the 275 order files hold 1,028; over 150 words, 1,000 paragraphs in 285 files, of which 255 order files hold 678. (3) The critics were launched with --model gpt-6-astra and a reasoning effort of max, the worker table's values; the model the host served was not read back, and is recorded as requested.",
  "changed": "docs/evidence/WO-281/reader-record.md, which is unfiled, says in its first section what the trace shows and how many of the reader's calls the harness refused. D010's choice stands on the corrected count, which is larger where it matters: at the list's own figure two thirds of the paragraphs are in order files. D007's and D014's judgments stand. From here a launch by the kit's launcher is recorded as the settings requested; the two reviewers' launcher of D003 keeps the head of the host's own output beside each report, so that what the host names can be read.",
  "decision": "The three statements are corrected to what their sources show.",
  "evidence": [
    "docs/control/local/reviews/WO-281/critic-2.md, criticisms 1, 2 and 4",
    "Session scratch, critic/reader-trace.mjs over the reader's transcript at 22:24 UTC: 65 tool calls in order with their times, 16 results holding a harness refusal; the reads of the base and of the candidate interleave in runs of several hundred lines from 21:38:43 to 21:39:43 UTC",
    "node over documentReport and the document check's paragraphsOver at 22:24:28 UTC: figure 120: files 347, flagged 307, paragraphs 1,543, orders 275, flagged 264, paragraphs 1,028; figure 150: flagged 285, paragraphs 1,000, orders flagged 255, paragraphs 678",
    "docs/evidence/WO-276/critic/launch.mjs: its closing line prints worker.model.id and worker.effort, the values npm run worker -- show gave it"
  ],
  "rejected": [
    {
      "option": "Run the reader again with each task read from one text alone",
      "reason": "A reader who has seen neither text for a task needs a fresh worker for each text and task, twenty launches, which the order does not ask; the record is for the operator's own reading of the two answer sets, and it now says what kind of comparison it is."
    }
  ],
  "reopenWhen": "The operator asks for a comparison with readers who each see one text; or a launcher that reads back the host's model lands (WO-278, WO-279)."
}
```

## WO-281-D017 — The second meta critic's four points, each checked and accepted: a method recorded as performed, two counts that did not match their sources, a reader set a task the running gates refused, and settings recorded as what ran

```json
{
  "id": "WO-281-D017",
  "date": "2026-11-15",
  "dispatch": "resume: next; the second meta critic's report, 22:22 UTC on 2026-11-15",
  "decision": "Launch 2 went out at 22:06:42 UTC, 75 minutes after the first, and returned at 22:22:16 UTC with four criticisms, three things to keep and one first change. Its path was given to the operator at 22:23 UTC in a short line, before this answer, and the report goes whole into the turn's closing message. Each point was checked against its source and each is accepted. First, D014 recorded the reading order its brief asked for as the order the reader read in; the reader's transcript shows otherwise, and D016 corrects it. Second, two counts. At 21:59:37 UTC the executor wrote that seven suites were in and five passed; the log it had just read held six finished suites, four passed and two failed, the seventh having started eight seconds earlier and been stopped. And D010 joined a count of files made at 120 words to a count of order files made at 150; D016 gives both at one figure. Third, the executor started the suites at 21:36 UTC and a minute later told the reader to save a copy of the base and to hash the candidate, knowing from its own refused calls that a worktree under a gate admits only reads; the reader lost sixteen calls and two minutes of waiting to it and returned without the hash. A worker launched beside a gate is from here given a task that reads only, with any copy or hash it needs made before the gate starts. Fourth, D007 recorded the launcher's configured model and effort as what ran; D016 corrects it to the settings requested. The first change is taken as a rule of work: the last step before a progress line or a decision is a reading of the source it rests on, and the line says what that source shows and no more. Kept: checking a criticism against its source before answering; the reader's return preserved whole with its limits; the screen and the sandbox check before each critic. The third launch is due at 23:21 UTC.",
  "evidence": [
    "docs/control/local/reviews/WO-281/critic-2.md (3,110 bytes); the launcher's line: critic 2: gpt-6-astra at max; 16 min, which names the settings it was given; started 22:06:42 UTC, ended 22:22:16 UTC; the copy it read: 4 files, 12,020,462 bytes, 5,776 rows, 3 occurrences of the account's address replaced in 2 rows of 1 file, no row holding an address, two other address-shaped strings, both under a reserved example domain, the private list present with 9 context entries and no row matched; the sandbox read the copy's transcript and was refused a write beside it",
    "Session scratch, suites-3.log, read at 21:59 UTC: docs-check-fixtures 9 passed; sync-fixtures 8 passed, 1 failed; registrations 8 passed; launchpad-planning 8 passed, 1 failed; harness-fixtures 9 passed; plan-refutation 9 passed; launchpad started 21:59:31 UTC and was stopped",
    "The reader's transcript (critic/reader-trace.mjs): its first call at 21:37:40 UTC hashes the candidate and is refused; hashing is tried six more times to 21:43:12 UTC; three waits on the gate, from 21:38:00, 21:41:35 and 21:42:05 UTC",
    "WO-281-D016"
  ],
  "rejected": [
    {
      "option": "Decline the third point, since the reader's answers did not need the hash",
      "reason": "The brief asked for the hash and a saved copy and the executor knew neither could be made under the gate; the reader spent a quarter of its calls finding that out."
    }
  ],
  "reopenWhen": "A later critic finds a progress line or a decision that again states more than its source shows."
}
```

## WO-281-D018 — Adjacent repair and two more expected-data changes: the roadmap's release table gains the row of v1.0.1, and two cases stop depending on where the guide and a fixture set their blocks

```json
{
  "id": "WO-281-D018",
  "date": "2026-11-15",
  "dispatch": "resume: next; the focused suites over the whole change",
  "decision": "Three things the focused suites named, each closed. (1) An adjacent repair, queued and completed as adjacent-0001. The release close of the order before this one published v1.0.1 and nothing rendered the roadmap's release history through its tag, so the record of observed tags held v1.0.1 while its table field still named v1.0.0. The sync suite's case that damages that record and regenerates it then got a null table, since the committed table was no longer the rendering of every recorded tag. Its inputs are main's own; that it fails on main is an inference from those inputs and was not run there. npm run release -- list --markdown --write, the block's own command, rendered the row and set the field, as commit 3604b35b8 did for v1.0.0, and the case passes. (2) scripts/test-sync.mjs built a longer fenced block by replacing the guide's run-order block where it stood at the left margin; the rewrite sets that block inside a numbered step, so the replacement found nothing. The case now adds its block at the guide's end, which tests the same rule, a longer fence kept on the page, and depends on no layout of the guide. (3) scripts/test-launchpad-seeds.mjs builds a core of its own with the template seeds a refresh plans; the map is planned beside them now (D012), so the case's list gains the map's template. No case was removed.",
  "evidence": [
    "npm test -- --only sync-fixtures: 21:41:57 UTC, 8 passed, 1 failed, the real inventory case, docs/control/release-history.json differing in its table field alone; 22:15:37 UTC, 8 passed, 1 failed, the operator commands case at its longer-fence step; 22:35:42 UTC, 9 passed, 500 s",
    "npm run release -- list --markdown --write at 22:01 UTC: Wrote docs/product/06-roadmap.md: release history of 215 local annotated release tags; the row of v1.0.1 added and the record's table field v1.0.1",
    "npm test -- --only launchpad at 22:35 to 22:46 UTC: 8 passed, 1 failed, historical starter floors retain provenance through navigation migration, with seed template unavailable: scripts/kit/docs-map.template.md; the case alone under the bounded wrapper at 22:49 UTC after the change: 1 passed",
    "npm run adjacent -- list: adjacent-0001 completed at revision 5; its intent was written to the operator at 22:01:01 UTC (transcript row 4999)"
  ],
  "rejected": [
    {
      "option": "Leave the roadmap's row to main",
      "reason": "The complete run this order owes includes the sync suite, which fails without it; the repair is one generated row made by its own command."
    },
    {
      "option": "Have the refresh plan nothing for the map where a core carries no map template",
      "reason": "No core that the refresh runs from lacks it: the export reads the template and fails without it. The only writer of such a core was the case's own fixture, so the fixture changes and the code gains no branch."
    }
  ],
  "reopenWhen": "Main gains the v1.0.1 row by another commit before this order integrates, in which case the integration takes main's identical row."
}
```

## WO-281-D019 — The operator's word on the time: the focused suites, run one at a time, had taken longer than a complete run; the rest go into the one complete run

```json
{
  "id": "WO-281-D019",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's message of 22:48 UTC on 2026-11-15",
  "decision": "The operator asked, in strong terms, what was happening, and said that the work had by then taken longer than a full run would. The executor had run the order's focused suites one at a time, as step 2 to step 5's checks and the Preflight line name them, each run starting with its own structural checks of about 70 seconds, and had stopped the sequence three times to make a fix and run the fixed suite again. By the gate rows that was sixteen finished suite runs and 74 minutes of gate time between 20:19 and 22:46 UTC, in which every write to the worktree was refused; they found four failures (the stale decisions index, the release record's table, two cases tied to a block's place, and a fixture's seed list), each fixed. A complete run schedules the same suites side by side and, started with --keep-going, names every failing suite in one pass; its failed rows say what a focused run says. That is the cheaper way to the same result, and the executor did not weigh it when the first focused run took eleven minutes. From here no suite is run alone except to reproduce a failure the complete run names. The four suites of the Preflight line not yet run alone (runner-fixtures, harness-evidence, authority-evidence, feedback-evidence) are left to the complete run, which covers them. The order of what remains: the review ladder's first round, six workers at once; its fixes and rechecks; one complete run; the handoff.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo281-this-is-taking-longer-than-a-full-run-2026-11-15.txt, SHA-256 61bdd07cd8a5e561472be86c2f71d60f1aadca988aba71d3542c416812606b1a; the host's prompt facts that came with it are stamped 22:48:09 UTC",
    "The gate rows in those prompt facts: suite durations of 13, 65, 70, 653, 60, 60, 132, 208, 72, 387, 352, 238, 509, 449, 500 and 667 seconds, 4,435 seconds together, with three more runs stopped as they began",
    "The executor's three lines in answer, written between tool calls at 22:48 to 22:49 UTC"
  ],
  "rejected": [
    {
      "option": "Finish the four remaining focused suites first",
      "reason": "They would take some twenty minutes more, serially, and the complete run runs them anyway."
    },
    {
      "option": "Skip or shorten the review ladder to save time",
      "reason": "The ladder is the order's own, and the operator added two reviewers to it; its six workers run at once, and the time the operator named was spent on serial gates."
    }
  ],
  "reopenWhen": "The operator says to stop, to drop a round or a reviewer, or to hand off as it stands."
}
```

## WO-281-D020 — Round one of the review ladder: the four standard reviewers' thirty-two findings, three of them blocking, each with who found it, its class and what becomes of it

```json
{
  "id": "WO-281-D020",
  "date": "2026-11-15",
  "dispatch": "resume: next",
  "decision": "Round one ran six reviewers at once over one tree (dcc789cf37e12934c5c2348668f7188442ae8db2, base 5edc7798b), from 22:52 to 23:08 UTC; no file of the worktree changed between the launch and the last report. This decision records the four standard reviewers' findings before any is fixed; WO-281-D021 records the two reviewers the operator added. Blocking, all to be fixed: F01, the rule-by-role table of WO-276 part F pins each rule's size, the rule this order lengthened is 1,392 bytes against the table's 1,316, the table's command was not run, and the document gate's case over it fails; F02, criterion 3 names a case under the harness suite, and no case in that suite reads the rule or product 07's sentence, so a write-back that dropped the clause would pass; F03, reading the figure inside the budgets loader made a mistyped figure refuse every lifecycle command that reads the budgets, where the order adds no refusal. Lesser and improvements to be fixed: F04, D010 and D011 say the list names no paragraph this branch writes, and the check lists two of product 07 (193 and 668 words) whose lines step 5 touched; F05, the gate relays only lines that begin ADVISORY, so the list's status line never reaches the gate's output; F06 to F08, no case for kit documents left out in an instance, for a long paragraph a branch edits in place, or for the budgets loader over the key; F10 and F21, the export's guard keeps its own list of root READMEs and no case exercises its refusal; F11, no case removes a starter's map and expects it added; F12, the text the reader's second answer set was read from is named only by a hash and cannot be opened; F14, the two inventory files of core's map hold the base's bytes; F16, F25, the document check reads the kit manifest two ways, gives one name two shapes and writes its status line twice; F17, F28, a constant declared among imports and a 200-character window in two tests; F18, D009 counts twenty words not held where the reading now lists nineteen; F22, F31, the map's descriptions restate the roots' conventions with nothing naming the second copy, and a comment still says the roots are named in code; F23, a misspelled key under documents is ignored without a word; F24, core's map states the figure's current value, which drifts when the operator changes it; F27, the inventory script's default base moves with main; F32, the worktree carries the starter's v1.0.1 refresh receipt and its register rows, which the worktree's start brought in (they were there at this session's first status, 20:06 UTC) and which this order neither wrote nor changes; main records such a receipt in its own commit, and the integration at final review takes main's identical bytes. Recorded and not fixed: F09, the route by which a map written from an older template is proven through the starter's history has no case until a release changes the template, and shares the template seeds' code; F13, core's own docs/README.md is not rewritten, by D005's reading of the order's map as the seeded one, which the operator has not confirmed and which the closing message of this turn puts to the operator again; F15 and F20, the complete run and the handoff's items are owed and are the next steps; F19, the guide grew from 2,765 to 4,290 lines, for the operator's reading at final review; F26, the long-paragraph list reads the working tree where a caller passes committed changes, as the document check's other screens do, and no caller does; F29, two pinned guide sentences hold link syntax; F30, the two added reviewers' launcher is the second copy of the critic's.",
  "roundFindings": [
    { "id": "F01", "finders": ["combined"], "class": "criterion", "disposition": "fixed" },
    { "id": "F02", "finders": ["criteria", "consistency", "combined"], "class": "criterion", "disposition": "fixed" },
    { "id": "F03", "finders": ["criteria", "design", "combined"], "class": "criterion", "disposition": "fixed" },
    { "id": "F04", "finders": ["criteria", "consistency", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F05", "finders": ["criteria", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F06", "finders": ["criteria", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F07", "finders": ["combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F08", "finders": ["criteria", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F09", "finders": ["criteria", "combined"], "class": "improvement", "disposition": "recorded" },
    { "id": "F10", "finders": ["criteria"], "class": "improvement", "disposition": "fixed" },
    { "id": "F11", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F12", "finders": ["criteria", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F13", "finders": ["combined"], "class": "lesser", "disposition": "recorded" },
    { "id": "F14", "finders": ["criteria", "consistency", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F15", "finders": ["criteria", "combined"], "class": "none", "disposition": "recorded" },
    { "id": "F16", "finders": ["design", "combined"], "class": "improvement", "disposition": "fixed" },
    { "id": "F17", "finders": ["design", "combined"], "class": "improvement", "disposition": "fixed" },
    { "id": "F18", "finders": ["combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "F19", "finders": ["combined"], "class": "none", "disposition": "recorded" },
    { "id": "F20", "finders": ["combined"], "class": "none", "disposition": "recorded" },
    { "id": "F21", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F22", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F23", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F24", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F25", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F26", "finders": ["design"], "class": "improvement", "disposition": "recorded" },
    { "id": "F27", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F28", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F29", "finders": ["design"], "class": "improvement", "disposition": "recorded" },
    { "id": "F30", "finders": ["design"], "class": "improvement", "disposition": "recorded" },
    { "id": "F31", "finders": ["design"], "class": "improvement", "disposition": "fixed" },
    { "id": "F32", "finders": ["consistency"], "class": "lesser", "disposition": "fixed" }
  ],
  "evidence": [
    "The four reports in the ignored reviews lane, recorded with npm run worker -- record at 23:09 UTC against the reviewed tree, each with its brief's digest: round-1-criteria.md (SHA-256 49d17b5bb12526f9835a1166871dd5afd7f1f383c774c0937e197e5442403ba6), round-1-design.md (6af8eb9fc76260d89f81185a508bbaef5b8368dbc0ad6ad90105e0fe6e06c7ce), round-1-consistency.md (dd819d444d04c2bb986d6d2fde1a4ba154aa5182992fb106d51aa236eb18310c), round-1-combined.md (9eeb2e2a2a3e7e224198cc248d03625e1222f6e14d74c0a43e31b665e7020a24)",
    "Each ran as the generated dotln-worker definition; each worker's own transcript names the model claude-opus-5-5, and the effort, xhigh, is the definition's and was not read back",
    "git status --short counted 61 changed paths before the launch and after the last report, and the combined and consistency reviewers each state that the checkout matched the reviewed tree before their probes",
    "F32: this session's first git status, at 20:06:43 UTC (before its first edit), lists the receipt docs/evidence/siblings/DotLn-Enterprise-Starter/2026-11-15T19-53-15-217Z.json as untracked and the two register files as modified; the main checkout holds no such receipt"
  ],
  "rejected": [
    {
      "option": "Keep the figure's check in the budgets loader, as the prune's budget is checked there, and say so in the document check's note",
      "reason": "Three reviewers found it; the order adds no refusal, the guide invites the operator to change the figure, and a list that refuses nothing should not be able to stop a dispatch. The document check alone reads the key and falls back with a note."
    },
    {
      "option": "One table of seed policies in place of the map's four clauses in the refresh (the design reviewer's larger remedy for F11)",
      "reason": "It rewrites the refresh's seed rules for every seed, beyond this order's step 3; the case for a missing map guards the hazard the reviewer named, and the table is left to planning."
    },
    {
      "option": "Leave the two long paragraphs of product 07 as they stand and record a reading (F04)",
      "reason": "This order's own rule has the final reviewer judge a changed passage, and a paragraph of 668 words is the kind the rule returns; the paragraphs are split at their sentences with no word changed."
    }
  ],
  "followup": "Planning, priority low: (1) a case for a starter's map written from an older template and proven through the starter's history, once a release changes the map's template; (2) one table of seed policies in the starter refresh, from which the kept-when-customized set, the absent-seed additions and the map's proof derive; (3) the long-paragraph list and the document check's other screens read committed text where a caller passes committed changes; (4) the cases that pin sentences of the kit guide pin the fact and not its link syntax; (5) the review helper takes a brief of the caller's, so that an order's added reviewer needs no copy of the critic's launcher.",
  "reopenWhen": "A recheck of round two finds one of the fixes wrong or missing, or the complete run fails over one of them."
}
```

## WO-281-D021 — Round one's two added reviewers on GPT-6 Astra: thirteen findings on the pages as instructions and eleven on filler, each checked against the base guide, twenty-three to be fixed and one left to planning

```json
{
  "id": "WO-281-D021",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's two messages that WO-281-D003 records",
  "decision": "The two reviewers of WO-281-D003 read the rewritten guide and the map's template in the same round and on the same tree as the ladder's four. Their findings are outside the four kinds the round's findings array admits, so they are recorded here, each with what becomes of it. The reviewer of the pages as instructions marked four as blocking a reader and nine as improvements. U1, fixed: the update procedure came before the preparation an instance older than v1.0.0 owes, which the base guide set first; the procedure now opens by sending that reader there. U2, fixed: an export is told to begin at step 1 and step 6 needs its setup commit on origin/main, yet no step gave an export its private origin; the base had the same gap, and step 6 now says so. U3, fixed: the visible steps of a registration named the vocabulary, the grant and the clone and left the repository's entry and its profile to the generated page's comment; step 1 now names all four. U4, fixed: the rewrite set the review launch's form, with its alternatives joined by bars, in a shell block a reader would paste as a pipeline; it is now a text block with one runnable example. U5, fixed: publishing a target order opens with its numbered steps. U6, fixed: the first pass commits its subject before it records costs. U7, fixed: the default worker's row says it runs every driven phase but verification. U8, fixed: the emit that follows an edit of either file is under a heading of its own, linked from both. U9, fixed in part: the update's second block runs from the merge to the publish while the steps pause after the merge; the block is one of three the generated commands page counts by its comment, so it is not split, and a visible sentence above it states the pause. U10, fixed: a stopped close is told what to do next. U11, fixed: installing a hook is numbered steps. U12, recorded for planning: a table that leads from a gate's refusal to its cause. U13, fixed with A4: the lineage row of the map says what the root holds, and its upkeep moves below the table. The reviewer of filler marked one as blocking and ten as improvements, with three patterns. A1, fixed: three rows of the plan-first commands omitted the program. A2, A7 and A3, fixed: a one-row table, a two-item procedure and a list that repeats the rules above it return to sentences. A5, A8 to A11, fixed: sentences that announce the page's own construction or repeat a heading are removed or reworded. A6 and the first pattern, fixed: the twenty section openings of the form that tells the reader to read are reworded to state what the section covers, since the order asks that a section say first what it is for and the reviewer's point is the announcement. The second and third patterns, fixed at the places named.",
  "evidence": [
    "The two reports in the ignored reviews lane: round-1-usability.md (SHA-256 ec52cb6fac06b0771bbabd898e0d909368ad39fcf732a208cf98d4dd2dfcb87f) and round-1-filler.md (41016ae34a58a0d4079c5df49deb9f9486fcaaf81c196c2ca531740e43221d85), written by docs/evidence/WO-281/reviewers/launch.mjs at 23:02 and 23:08 UTC",
    "Each report's host header, kept beside it as round-1-<kind>.host.txt, names the model gpt-6-astra, a read-only sandbox and reasoning effort max",
    "U1: the base guide (5edc7798b:docs/KIT.md line 2110) sets the sorting of the local-terms list before the instance's procedure (line 2156 on); the candidate set it at line 3438, after the procedure at 3146",
    "U2: git show 5edc7798b:docs/KIT.md names the private origin and its push only in the clone recipe (lines 171 and 172) and requires the setup commit on origin/main at line 503; scripts/launchpad.mjs line 1462 makes an export with git init and adds no remote",
    "U3: the comment above the registration's command block, rendered at docs/OPERATOR.md line 100, names the four parts of a registration",
    "U4: the base held the form as a code span in running text (line 1224); the candidate set it in a shell block (line 1959)"
  ],
  "rejected": [
    {
      "option": "Split the update's second command block after the merge, as the reviewer of instructions proposed",
      "reason": "The first block's comment tells the operator what the first, second and third blocks do and to stop after the merge line; a fourth block would make that text wrong, and the comment's bytes are the generated page's."
    },
    {
      "option": "Delete the section openings outright, as the reviewer of filler proposed for some",
      "reason": "The order's design gives each section a sentence or two on what it is for and who needs it; the opening stays and loses the instruction to read."
    }
  ],
  "followup": "Planning, priority low: the kit guide gains a table under its gates that leads from a gate's refusal (host requirements, stale generated pages, a private term's match, an unavailable suite, an exhausted phase bound) to its explanation and the next action, each row checked against the code.",
  "reopenWhen": "A recheck by either reviewer finds a fix that does not answer its finding, or the operator's reading at final review finds the pages still read as machine-made."
}
```

## WO-281-D022 — Round one's fixes as built: the rule table regenerated, a case for criterion 3, no refusal over the figure, the cases the reviewers found missing, and the guide and the map changed where a reader was stopped or the text read as filler

```json
{
  "id": "WO-281-D022",
  "date": "2026-11-15",
  "dispatch": "resume: next",
  "decision": "The findings WO-281-D020 and WO-281-D021 mark as fixed are fixed as follows. Code and cases: F01, the rule-by-role table of WO-276 part F is regenerated by its own command, an expected-data update whose cause is this order's longer rule (one line changes, the rule's size from 1,316 to 1,392 bytes). F02, a case in the harness tests names the clause, finds the rule once in the reviewer's root as emit installs it for each host, and finds the same clause in product 07. F03, F08 and F23, the budgets loader no longer reads the figure, the document check is its one reader and names a value it cannot use or a section that holds some other key, and a case shows the loader accepting five such sections. F05, the gate relays the check's one line on the list, so a document gate shows the figure, where it came from and whether the list is empty or off; the relay's existing case covers it. F06 and F07, the criterion-4 case gains a long paragraph edited in place, which is listed, and an instance's kit document, which neither list names. F10, F21, F22 and F31, the export's guard takes its roots from the declared seed list through one function with a case of its own, and two comments are corrected. F11, the existing case over absent seeds removes the map and expects it added. F16 and F25, the document check reads the kit manifest through one helper, builds the list's result without changing the figure's, under a name of its own, and writes its status line in one place. F17 and F28, the constant follows the imports and the planning case reads the sentence's paragraph and its list in place of 200 characters. F27, the inventory's default base is the commit its recorded base reading holds. Documents: F04, the two paragraphs of product 07 that step 5 touched are split at their sentences into three and eleven paragraphs, each under the figure, with no word changed and one colon made a full stop; the list then names nothing this branch writes. F14, the inventory of core's map is run again over the page as it stands. F24, core's map says the figure is 120 when unset. F32 is answered by its record in WO-281-D020. F12 is answered after round two, by a second reading of the candidate at a tree the handoff names. The guide and the map: the twenty-three findings WO-281-D021 marks as fixed are applied as it describes; three code spans of the base are renamed in answer to A1 and are listed here as the inventory's removals.",
  "inventoryRemovals": [
    { "kind": "code span", "value": "diff WO-NNN", "reason": "Renamed to the whole command, node scripts/plan-first.mjs diff WO-NNN: as a row of a table of commands the short form read as a command of its own (round one, the filler reviewer's first finding)." },
    { "kind": "code span", "value": "apply WO-NNN", "reason": "Renamed to the whole command, node scripts/plan-first.mjs apply WO-NNN, for the same reason." },
    { "kind": "code span", "value": "draft WO-NNN --new", "reason": "Renamed to the whole command, node scripts/plan-first.mjs draft WO-NNN --new, for the same reason." }
  ],
  "evidence": [
    "node docs/evidence/WO-276/part-f/rule-table.mjs, then --check: 33 rules, 6 roles, 21 cells that leave a role out; git diff of rule-table.md shows the one size changed",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'WO-281' scripts/test-harness.mjs: 2 passed (the criterion-3 case and the budgets loader's)",
    "node scripts/harness.mjs bounded -- node --test over scripts/test-docs-check.mjs for the criterion-4 case and the relay case: each passed",
    "node scripts/harness.mjs bounded -- node --test over scripts/test-launchpad-seeds.mjs for the map's links, the absent seeds and the dependency-free load: 3 passed",
    "node scripts/docs-check.mjs after the split: long paragraphs: over 120 words (documents.paragraphWords in docs/control/budgets.json); none among the paragraphs this branch adds or changes in standing documents; PASS, 0 failures",
    "node docs/evidence/WO-281/inventory.mjs at 23:28 UTC: candidate 4,354 lines; absent 3, the three spans named above; node docs/evidence/WO-281/inventory.mjs --file docs/README.md: candidate 375 lines, absent 0",
    "Session scratch kit/check-guide.mjs: no duplicate anchor, no unresolved in-document link, longest paragraph 111 words; kit/pins.mjs: the twenty pinned sentences hold; node scripts/lib/operator-commands.mjs --check: docs/OPERATOR.md is current",
    "docs/evidence/WO-281/long-paragraphs-candidate.txt, written again by node scripts/docs-check.mjs --long-paragraphs: 308 lines, no row for docs/KIT.md"
  ],
  "rejected": [
    {
      "option": "Prefix the list's status line with ADVISORY so the gate's existing rule relays it",
      "reason": "An advisory is something a stage must read; a line saying the list is empty is not one. The relay names the line's own prefix."
    },
    {
      "option": "Refuse a key the documents section does not define, as the day's spend refuses one",
      "reason": "That is the refusal F03 removes, by another door; the check says what it found and uses the kit's figure."
    },
    {
      "option": "Rebuild the text the reader first read from the reader's transcript",
      "reason": "Tried: the transcript's reads cover 3,661 of that text's 4,246 lines, and the host's edit history holds no copy with the recorded hash. The second reading replaces it."
    }
  ],
  "reopenWhen": "A recheck of round two finds a fix wrong, or the complete run fails over one."
}
```

## WO-281-D023 — Correction: two decisions said the long-paragraph list named nothing this branch wrote, after step 5 had changed two long paragraphs of product 07; and the count of base words not held has changed twice

```json
{
  "id": "WO-281-D023",
  "kind": "correction",
  "date": "2026-11-15",
  "dispatch": "resume: next; round one's criteria, consistency and combined reviewers",
  "misread": "WO-281-D010's evidence, read at 21:24 UTC, says the check lists none among the paragraphs this branch adds or changes, and WO-281-D011 says the list names none of the long passages beside its additions. The first was true when read and was not read again after step 5; the second was not checked at all. Step 5 took one sentence out of a paragraph of some 900 words in product 07 and so changed a line of each paragraph it left, 193 and 668 words long, and the check listed both from then on. WO-281-D009 counts twenty words of the base's prose that the guide nowhere holds; by the reviewed tree the count was nineteen.",
  "meant": "The list named two paragraphs this branch changed, from step 5 until round one's fix. A decision's statement about a check is the check's output at the tree the statement is about, read after the last edit that could change it.",
  "changed": "WO-281-D022 splits the two paragraphs, and the check now lists nothing this branch writes. The words not held are twenty again at the fixed tree: the nineteen of WO-281-D009 without finished, which an edit made for the reader brought back, and paced, from an opening sentence removed under the heading that says the same.",
  "decision": "The two statements are corrected to what the check printed at the reviewed tree, and the count to the reading at the fixed tree.",
  "evidence": [
    "Round one's reports (criteria R1, consistency F1, combined R1): node scripts/docs-check.mjs on the reviewed tree printed ADVISORY docs/product/07-execution-guide.md:3513: a paragraph of 193 words and :3541: a paragraph of 668 words",
    "docs/evidence/WO-281/inventory-difference.md at 23:28 UTC, its list of the base's words the candidate nowhere holds: twenty, paced among them and finished absent"
  ],
  "rejected": [
    {
      "option": "Edit WO-281-D010 and WO-281-D011 in place",
      "reason": "A decision is a dated record; the correction is its own."
    }
  ],
  "reopenWhen": "A later edit of this order changes a line of another long paragraph of a standing document."
}
```

## WO-281-D024 — The third meta critic's three points, each checked and accepted: a planned fix recorded as made, the cost of the serial suites weighed too late, and a reader's text changed before a copy of it was kept

```json
{
  "id": "WO-281-D024",
  "date": "2026-11-15",
  "dispatch": "resume: next; the third meta critic's report, 23:30 UTC on 2026-11-15",
  "decision": "The critic launched at 23:21 UTC under WO-281-D002 read the session's transcript to 23:21:37 UTC and made three criticisms. Each was checked against the records and is accepted. (1) WO-281-D020 and WO-281-D021 were written at 23:13 UTC, before any fix, as the ladder asks; D020's text says its findings are to be fixed, but its findings array gives them the disposition fixed, the only value the array admits beside recorded, and D021's text describes the guide's changes as made, some in the present tense, when none had been. The first guide edit was at about 23:22 UTC. The critic is right that this states an intention as an observation, the fault WO-281-D017 undertook to stop. What was built is in WO-281-D022, written after the edits and after the checks it cites; each statement of D021 was read again against the guide after the edits, and each now holds. From here a record written before a fix says what will be done, and the record of what was done is written after the check that shows it. (2) The serial focused suites were weighed one queue at a time and never as a whole against a complete run; WO-281-D019 records the sixteen runs and their 74 minutes. Accepted as put: before a queue of gate runs is started, its whole time, setup and reruns included, is compared with the complete run that is owed anyway. Since the change of course every check has been a single bounded case of seconds to a few minutes. (3) The text the reader first answered from was changed at 22:01 UTC with no copy kept; two reviewers of round one found the same (WO-281-D020, F12), and a rebuild from the reader's transcript fell 585 lines short. Accepted: the candidate is read a second time once round two's fixes are in, by a fresh reader, and before that launch the text's bytes are copied to session scratch and written to the repository's object store, and the record names its blob and its SHA-256; no edit of the guide follows that reading unless the record says so.",
  "evidence": [
    "docs/control/local/reviews/WO-281/critic-3.md in the ignored reviews lane, SHA-256 cbed67cdba24f43c500ff6ed9f5a498f5d5518c05c42749ef7613ac9b2acea37; the launcher's closing line names gpt-6-astra at max, as requested, and nine minutes",
    "The decisions' own text: WO-281-D020 and WO-281-D021 above, and WO-281-D022, whose evidence lists the checks run after the edits",
    "Session scratch r1/probes.log, 23:31 to 23:36 UTC, after the fixes: the export's guide cases 5 passed, the v0.81.0 instance case 1 passed in 43 seconds, the starter refresh case 1 passed in 198 seconds",
    "Session scratch textb.mjs over the reader's transcript at 23:11 UTC: 12 reads of the guide, to line 4,246, 585 lines not read"
  ],
  "rejected": [
    {
      "option": "Rewrite WO-281-D021 so that it reads as a plan",
      "reason": "A decision is a dated record; this one says what was wrong with it and where the record of the work is."
    },
    {
      "option": "Leave the findings array's dispositions empty until a fix is checked",
      "reason": "The array admits fixed or recorded and nothing else, and the ladder asks for the record before the fix; the text beside it carries the tense."
    }
  ],
  "reopenWhen": "A later record of this order states as done something its evidence does not show; or the fourth critic, due 75 minutes after the third's launch unless the complete run has passed, finds the second reading's text was not kept."
}
```

## WO-281-D025 — Round two of the review ladder: every blocking finding of round one confirmed fixed, seven new findings none of which blocks, the two added reviewers' rechecks, and no third round

```json
{
  "id": "WO-281-D025",
  "date": "2026-11-15",
  "dispatch": "resume: next",
  "decision": "Round two ran the same six reviewers as rechecks over one tree (64738131e550787f56ce8a6600786667be61cea4), from 23:41 to 23:57 UTC, each given its own report of round one; nothing in the worktree changed while they read. The four standard reviewers confirm on the tree, each by its own probes, that the three blocking findings of round one are fixed (the rule table, the case for criterion 3, no refusal over the figure) and that the lesser ones WO-281-D020 marks fixed are answered; they leave open what that decision records (the reader's second text, which follows this decision; the case for a map proven through a starter's history; core's own map, by WO-281-D005's reading; the handoff's items). None found a new blocking finding. Their seven new findings are in the array below. Fixed, all in documents or evidence and none in code: G03, the list of long paragraphs after the rewrite was written before product 07's last edit and is written again; G04, the guide and product 07 linked only WO-281-D010 for what a figure the check cannot use does, and now link WO-281-D022 beside it; G05, the guide said a misspelled key is named, which holds for a key inside the documents section and not for a misspelled section, and now says what the check names; G06, WO-281-D022's evidence says two cases passed over the harness tests' file, and the second, the budgets loader's, is in scripts/test-dispatch-bound.mjs, which that file imports, so one run ran both. Recorded and not fixed, since a new finding of round two is fixed only where it breaks a criterion or a behavior main had: G01, the gate relays the list's status line by its prefix for any task, where its two other task-specific relays name their task; G02, the figure's reader stays in the budgets module, whose loader no longer calls it, and the module's text says so; G07, the map's template now opens with its three pointers and no sentence on what the page is, which the filler reviewer asked for and the combined reviewer notes against the order's shape, for the operator's reading. The reviewer of the pages as instructions finds eleven of its thirteen findings answered, the update's command block (U9) answered in part and the gate-refusal table (U12) open, as WO-281-D021 records both. Its new findings: three that stop a reader, all fixed in the guide (plan-first now says before its steps what the repository's records value does to the three documents, as the base guide did; the update procedure says before step 1 that it needs a commit shared with the starter and what an instance without one does; the form of the command that records a worker's report is a text block with one runnable example); two that repeat U9 and U12, left as recorded; and two lesser ones, both fixed (where to go on after previewing a named release; the commit and push before the first order are every instance's, the remote an export's). The filler reviewer finds eight of eleven answered and three in part, with no new finding that stops a reader. Fixed: the summary sentence of the team section and the opening of Long paragraphs are cut to the one sentence that states a rule; four section openings lose their forecast of the section's contents where a sentence of fact already opens the section; three subsections lose a sentence that repeated their heading; the build overlay's refusals are named directly; the extension section opens with what the kit does. Kept: the map's line on what an older export does for its lineage index, a fact the earlier map held; and the openings of Owned cleanup and Document quality, which say what the section is for, as the order's design asks, where no rule opens it. No third round is owed: round two's fixes changed the guide, product 07 and one evidence file, and no code.",
  "roundFindings": [
    { "id": "G01", "finders": ["design"], "class": "improvement", "disposition": "recorded" },
    { "id": "G02", "finders": ["design", "combined"], "class": "improvement", "disposition": "recorded" },
    { "id": "G03", "finders": ["consistency", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "G04", "finders": ["consistency"], "class": "lesser", "disposition": "fixed" },
    { "id": "G05", "finders": ["criteria"], "class": "lesser", "disposition": "fixed" },
    { "id": "G06", "finders": ["combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "G07", "finders": ["combined"], "class": "improvement", "disposition": "recorded" }
  ],
  "evidence": [
    "The four standard reports in the ignored reviews lane, recorded with npm run worker -- record --round 2 against the reviewed tree at 00:01 UTC on 2026-11-16: round-2-criteria.md (SHA-256 2045a194ee0f3c335b131287b14b253cf15b99f29b861ed2c5b20e9e5143d91b), round-2-design.md (3d7a27a42f992425f2a850803b991cb571278b63fc18862304b312ff24b90f29), round-2-consistency.md (08f19ee89705ee22bf548279f6c1ddcf75294ecc3af7ce840cb70db1ab95bb77), round-2-combined.md (ebb53a14a2d2e01b526df76af698a68294197b068f6161a5d644ff29de4eb759); each worker was the round-one worker continued, and its transcript names claude-opus-5-5",
    "The two added reviewers' reports: round-2-usability.md (b1d14bf6fd6df44a47a9d4cfdd56d03f45b718663ca05a76711d8b525456b4c1) and round-2-filler.md (fdf74942f6e43b0ea836f59b6b6d63a3174d7664b7fc2926239a131c37b3a583); each host header names gpt-6-astra at reasoning effort max",
    "scripts/launchpad.mjs, changedOnBothSides and its two callers, read at 23:54 UTC for the update's note: with no commit shared, the preview says so and refuses nothing, the publish refuses, and the refusal tells the operator to compare the instance's own files by hand and to open the pull request without it",
    "After the fixes, at 00:00 UTC: node docs/evidence/WO-281/inventory.mjs: candidate 4,365 lines, absent 3, each named in WO-281-D022; session scratch kit/check-guide.mjs: no duplicate anchor, no unresolved in-document link, longest paragraph 111 words; kit/pins.mjs: the twenty pinned sentences hold; node scripts/lib/operator-commands.mjs --check: current; node scripts/docs-check.mjs: no long paragraph this branch writes, PASS, 0 failures; node scripts/harness.mjs check: 37 generated surfaces",
    "docs/evidence/WO-281/long-paragraphs-candidate.txt, written again by node scripts/docs-check.mjs --long-paragraphs after the last edit of product 07"
  ],
  "rejected": [
    {
      "option": "Split the update's second command block after the merge, which the reviewer of instructions asks for a second time",
      "reason": "The order keeps command blocks unchanged, and the generated commands page's text for that step counts its blocks and already tells the operator to stop after the merge line; the guide now says the same above the block. Left for the operator's reading."
    },
    {
      "option": "Scope the gate's relay to the document task and move the figure's reader beside its one caller (G01, G02)",
      "reason": "Both are code, neither breaks a criterion or a behavior main had, and a code change after round two owes a third round; they are in the handoff for the next order that touches either file."
    },
    {
      "option": "Remove every opening that says what a section is for, as the filler reviewer's pattern asks",
      "reason": "The order's design gives each section a sentence or two on what it is for; where a sentence of fact does that, the forecast is gone, and where none does, the opening stays."
    }
  ],
  "reopenWhen": "The complete run fails over a fix of either round, or the operator's reading at final review asks for the command block split or the remaining openings removed."
}
```

## WO-281-D026 — The second reading of the candidate: one fresh reader, the final text alone, its bytes kept, and what it could not find left to planning

```json
{
  "id": "WO-281-D026",
  "date": "2026-11-15",
  "dispatch": "resume: next",
  "decision": "A second fresh reader answered the order's ten tasks from the final candidate alone, after both rounds of review, and its report is recorded whole in the reader's record under The second reading. This answers round one's F12 and the third critic's third point: the text is named by its SHA-256 and its Git blob, both read before the launch and again by the reader, its bytes were written to the object store and copied to session scratch first, and the guide is not edited after the reading, so the tree the complete run reads holds the text the answers came from. The reader answered all ten tasks and found each from the table at the guide's head and the sections' lists, reading one to five places a task. It is one cold reading and no comparison: the base's answers stay the first reader's. What it did not find or found hard changes nothing in the guide now, since an edit would again change the text read, and none of it fails a criterion; it is left to planning in the follow-up below. Two of its points repeat findings already recorded: the update's second command block runs past the pause its steps require (the reviewer of instructions, twice, in WO-281-D021 and WO-281-D025), and what to look for and what to do on a failure are in the comments that become the commands page and not in the guide's visible text, as the first reader found.",
  "evidence": [
    "docs/evidence/WO-281/reader-record.md, The second reading: the report as returned, 445 lines, SHA-256 of the returned text 4f96fa7338f95e1a65433c9047029769d50ce4a214bec4b953fcb6500fd946a7",
    "shasum -a 256 docs/KIT.md and git hash-object -w docs/KIT.md at 00:02:33 UTC on 2026-11-16: 2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7 and 5e61a637f6f3b776711959d2d0326e17c12ff37c, 4,365 lines; the reader's report opens with the same three values, and shasum read the same hash after it returned",
    "The reader's transcript, read by session scratch r1/reads.mjs and critic/reader-trace.mjs: launched 00:02:39 UTC, returned 00:06:53 UTC, 27 tool calls, none refused; nineteen reads of the guide in the tasks' order after its first 150 lines and one listing of its headings; its transcript names claude-opus-5-5",
    "Session scratch r1/reader2.brief.md, the reader's whole brief"
  ],
  "rejected": [
    {
      "option": "Fix what the second reader found before the complete run",
      "reason": "Each fix changes the text the answers were given from, which is the fault this reading answers; the points are a planning pass's, with the code read for each."
    },
    {
      "option": "Give the second reader the base as well",
      "reason": "A reader who has seen both texts compares them, as the first did; what was missing was a cold reading of the final text."
    }
  ],
  "followup": "Planning, priority low: the kit guide, each point checked against the code, (1) says for each command whether a person types it or a session runs it, in the setup's last two steps, the update, a registration, a target publish and a close that names a merged commit; (2) carries in visible text, or by a link to the commands page's step, what to look for after a step and what to do when it fails, which today is only in the comments that become that page; (3) says what a set-up instance shows when it has worked, and to skip the repository's creation where one exists; (4) says where a stopped close's blocker and receipt are kept, how the commit for a squashed and edited merge is found, and how its option reaches the close phrase; (5) shows a registered repository's entry, its gate and a grant; (6) says which worker a review runs and how to change reviews alone, and that a worker's name may close any dispatch line; (7) says where a release's Read before upgrading is and what an update publish's title and body hold; (8) explains receipt, lane and fold where it first uses them.",
  "reopenWhen": "The guide is edited before this order's branch is committed, in which case the record says so and names what changed; or the operator asks for a comparison by readers who each see one text."
}
```

## WO-281-D027 — Independent verification: preserve the subject, consume its complete row and board safe evidence replay

```json
{
  "id": "WO-281-D027",
  "date": "2026-11-15",
  "dispatch": "resume: verify",
  "decision": "The verifier judges all six original criteria met at code identity 63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796. The implementation is left unchanged. Independent probes reproduce the inventory, its negative control, all five historical map renderings, a refresh from an older template-backed map, owner customization retention, paragraph boundary cases and the installed reviewer rule. The complete review row at that identity covers the product claims and the declared Preflight, so no additional complete product run is warranted; a document gate over the verifier's authored records is the final completion condition. The map is the one every instance carries, as the order's refresh criterion and D005 establish. A branch-only advisory plus an explicit whole-standing-document command answers the current writing duty; its scope is disclosed rather than treated as a whole-repository gate. Reader answers support improved navigation but do not establish a controlled comparison. The final cold reading is bound to the exact guide now present, including its retained checkpoint. No new unmet criterion or reproduced regression was found. Existing usability and maintenance follow-ups in D020, D021 and D026 remain open.",
  "evidence": [
    "docs/verifications/WO-281/VER-001.md: independent criterion judgments and limits",
    "docs/evidence/WO-281/verification-probes.mjs and verification-results.json: five successful independent probes, including an intentional inventory failure in a scratch copy",
    "docs/evidence/WO-281/verification.md: focused commands, consumed product row, document-gate handoff and review disposition",
    "requireGateClaims accepted the current complete review row without advisories at 2026-11-16T02:09:54Z; the whole paragraph-list command reproduced all 308 lines of the candidate record",
    "inventory.mjs writes its candidate and difference records on each run; map-renderings.mjs writes its output record. The verifier ran copies in session scratch, leaving the executor's records intact."
  ],
  "rejected": [
    {
      "option": "Treat inventory coverage and a zero long-paragraph count as sufficient evidence of readability",
      "reason": "Neither judges whether a reader can follow the instructions. The verifier read the whole guide, the instance map, both rounds of execution reviews and the reader answers, then checked the implicated code and cases."
    },
    {
      "option": "Rerun the complete product gate or edit implementation during verification",
      "reason": "The current complete review row covers the claims, and independent focused probes found no blocking defect. Another complete run repeats equivalent evidence; an implementation edit would exceed this role. NoOp is to preserve the subject and its passing row while completing independent evidence and the required document gate."
    }
  ],
  "followup": "Planning, priority low: add a read-only check or caller-selected output directory to the WO-281 inventory and historical-map reproduction commands so a verifier can replay them without replacing their filed evidence. Retain pinned source revisions and demonstrate that replay leaves existing records byte-identical. This is an evidence-maintenance improvement, not an unmet criterion or a regression in an existing product behavior.",
  "reopenWhen": "The code identity or final guide changes, a supported probe exposes an unmet criterion or regression, or the evidence reproduction commands are reused after their records are filed."
}
```

## WO-281-D028 — Verification process correction: bound output and distinguish an empty child from an executed probe

```json
{
  "id": "WO-281-D028",
  "date": "2026-11-15",
  "dispatch": "resume: verify",
  "kind": "correction",
  "misread": "Several audit batches requested more text than their output allowance and were truncated. One early format invocation exposed only its initial output, losing its host completion handle. A later bounded node invocation received no stdin script and exited successfully without running its assertions.",
  "meant": "Only delivered source ranges and observed completed assertions support the verdict. A wrapper's zero exit alone does not prove that the intended probe ran.",
  "changed": "The verifier re-read criterion-relevant ranges in smaller chunks and used generator checks for oversized generated surfaces. It captured the complete successful format check, retained host completion handles thereafter, and wrote the close probes to a scratch script before running them. That run printed both the reproduced paragraph-list assertion and the current product-gate acceptance. The empty invocation supplies no verification evidence.",
  "decision": "Keep these process mistakes separate from subject findings; they were corrected before the report and provide no reason to change the implementation or repeat its complete product run.",
  "evidence": [
    "Session tool results identify truncated output and the first unretained format handle; the later format:check completion reports all matched files formatted",
    "The empty bounded invocation at 2026-11-16T02:09:31Z printed no assertion output",
    "The scratch-file invocation completed at 2026-11-16T02:09:54Z with wholeParagraphListReproduced true, 308 lines and requireGateClaims productGate exitCode 0 with no advisories"
  ],
  "rejected": [
    {
      "option": "Count the empty invocation or undisplayed text as successful verification",
      "reason": "That would claim evidence the session did not observe."
    }
  ],
  "reopenWhen": "A later verdict-relevant command lacks a completion receipt or its necessary output is truncated; obtain that evidence before relying on it."
}
```

## WO-281-D029 — Final review: the verified subject passes and is left byte for byte, the reviewer's own comparison of the guide's prose with its base, and one follow-up on sentences that keep the base's dense wording

```json
{
  "id": "WO-281-D029",
  "date": "2026-11-15",
  "dispatch": "resume: final review",
  "decision": "All six criteria are met and the review passes. Integration took in nothing: origin's main is the branch's base. The code identity is the one the executor's complete review run and the verifier judged, so that run's passing row is reused and no second complete run is started; the document gate runs once, after this review's records. The reviewer changed no byte of the subject: no source, no test, no sentence of the guide, the map or product 07. Read for the judgment: the order; the whole diff of source and tests; the rewritten guide whole, all 4,365 lines; the map's template beside the text the export rendered before; the two changed passages of product 07 word by word against the base; core's map; the decisions before this one; the verification and its evidence; the handoff; and the second reader's report. Each changed standing document's diff is judged as the rule this order extends asks. The guide is a replacement in place. Its running text holds no dated account: the sentences that name a version, such as what an instance older than v1.0.0 does, say what is so for a reader on that version and were the base's. It holds no passage its reader cannot follow. Product 07 gains three short paragraphs that state what is so, and two of its paragraphs are split at their sentences with one colon made a full stop and no other word changed. Core's map gains one paragraph on the list. The map's template holds every fact of the text the export rendered in code, as a table. Beside the order's inventory, the reviewer checked by a script of its own that no fact left the guide. The script reads no file of the order's inventory and writes none. It finds the same three code spans absent and nothing else of the four kinds. It also compares the prose, which the inventory does not: of the 1,017 sentences of the base's prose, the content words of 924 stand together in one run of at most eight adjacent blocks of the candidate, 87 more hold at least four fifths of theirs in such a run, and six hold less. The six were each read against the candidate: one is the dated account of the build overlay's migration, which WO-281-D009 names as dropped, and five are restated (the features' defaults as a column of their table, an order paced across days as a heading, two sentences on the kit's rows against this instance's files as one, and what turning a feature or a host off removes in two places). The 87 were read by the words their best run lacks, which are words of form (below, above, as before, the flag, and decision where it was a link's whole label), step numbers that became links, and the order numbers and dates of the dated accounts WO-281-D009 names. The paragraph the operator pasted was read sentence by sentence against its rewrite, and every fact of it is there. One sentence the rewrite adds before the update's first step, on an instance that shares no commit with the starter, was checked against the refusal the code prints and says the same. One finding, a follow-up: five sentences of the guide keep the base's wording and need a second reading (the count of hook processes a call starts, which reads at first as though a read started a shell command; what the gate's static reading of Git forms leaves out; a session whose count falls, in the usage report; which commit is the update's own merge; and which readings of the process table a prune makes). Each can be followed with the table or the sentence beside it, so none returns to repair. None was changed here, since an edit would change the text that the complete run's suites and the second reader read. The five things the handoff leaves to the operator's reading stand as it records them, each with the default that ships: core's own map is not rewritten (WO-281-D005); the document gate prints the figure's line and the paragraphs a branch writes, and the whole list on request (WO-281-D010); the update's second command block is not split, and a sentence above it states the pause (WO-281-D025); two sections keep an opening that says what they cover, and the map's template opens with its three pointers (WO-281-D025); and the guide is longer, 4,365 lines for 2,765, with no paragraph over 120 words where the base had 63. A sixth is the order's own: the figure of 120 words is the executor's first setting, which the order's assumptions leave to the operator to change. The branch is committed as four changes: the starter's v1.0.1 refresh receipt and the roadmap's v1.0.1 row, each its own commit as the order before this one carried its predecessor's; the order's change; and the records.",
  "evidence": [
    "npm run worktree -- integrate WO-281, at entry: Integration took in nothing: the worktree is not behind main; git fetch origin main read 5edc7798b9eccaa880467d41a28b6a43f4b54226, the branch's base and HEAD",
    "The gate index, read at entry through the completion's own lookup: code identity 63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796, and at it the standing passing row of npm test recorded 2026-11-16T01:06:46.448Z, 45 suites, 0 h 56 min",
    "docs/evidence/WO-281/final-001/guide-facts.mjs and its output guide-facts.json: the base 2,765 lines; the candidate 4,365 lines, SHA-256 2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7, which is the text of the second reading, and Git blob 5e61a637f6f3b776711959d2d0326e17c12ff37c, which is what checkpoints 3 and 6 hold; 17 of 17 headings, 89 of 89 block lines, 70 of 70 link targets and 792 of 795 code spans held, the three absent being those WO-281-D022 names; fifteen second-level headings in the base's text and order; 86 distinct links to the guide's own headings, none unresolved, and no duplicate anchor; 1,017 sentences, 924 whole, six below four fifths",
    "git diff --word-diff of docs/product/07-execution-guide.md against the base: the added paragraphs, the full stop after repair made a comma before the added clause, and bytes: the made bytes. The; nothing else",
    "Single cases under the bounded wrapper at the reviewed tree, 1 passed each: the criterion-3 case of scripts/test-harness.mjs, the criterion-4 case of scripts/test-docs-check.mjs, the budgets loader's case of scripts/test-dispatch-bound.mjs, the map's link case of scripts/test-launchpad-seeds.mjs and, for criterion 2's refresh rule, the case starter refresh publishes one verified commit and preserves every refusal boundary of scripts/test-launchpad-update.mjs (0 h 3 min)",
    "node scripts/lib/operator-commands.mjs --check: docs/OPERATOR.md is current; node scripts/harness.mjs check: 37 generated surfaces; node scripts/docs-check.mjs: no long paragraph among those this branch adds or changes, PASS, 0 failures; npm run format:check, npm run publication:check, npm run release -- check-surfaces --local and git diff --check each passed; npm run release -- prepare, reading origin's tags: v1.1.0 remains current",
    "scripts/launchpad.mjs, changedOnBothSides: the refusal for a whole clone that shares no commit with the starter tells the operator to compare the instance's own files with the commit before the merge by hand and to open the pull request without the command",
    "The base guide's own sentence on hook processes (5edc7798b:docs/KIT.md, lines 1504 and 1505), unchanged in the candidate at lines 2376 and 2377 under the table that gives the counts: three hooks for a read or a search, five for a shell command, an edit or a write"
  ],
  "rejected": [
    {
      "option": "Reword the five sentences in this review",
      "reason": "The guide's bytes are what the complete run's four suites that read the guide, the verifier and the second reader judged, and WO-281-D026 binds the reading to those bytes. A rewording corrects no wrong fact, a reviewer who writes it certifies its own text, and the suites that pin the guide's sentences would be owed again. The next order that writes into the guide takes them with the second reader's points."
    },
    {
      "option": "A second complete run, for evidence of the reviewer's own",
      "reason": "The code identity is unchanged, and the identity, not the dispatch, says what was tested. The run took 0 h 56 min and would repeat the row it stands beside."
    },
    {
      "option": "Launch review workers over the rewrite",
      "reason": "Twelve reviews, three critics, two readers and a verifier have read it. What none of them made was a mechanical comparison of the base's prose with the candidate, which a script gives exactly and a worker would give approximately; the judgment is the reviewer's own reading."
    },
    {
      "option": "Judge criterion 2 or the objective unmet because core's own docs/README.md is not rewritten",
      "reason": "The order scopes the rewrite to the kit guide and the map every instance carries, criterion 2 is about a starter's copy, and the register row allocated to the order names the seeded map. Core's page is carried by no instance. The operator's word reopens WO-281-D005."
    }
  ],
  "followup": "Planning, priority low, for the order that next writes into the kit guide, with the second reader's points (WO-281-D026): reword, each checked against the code it describes, the sentences of docs/KIT.md that keep the base's dense wording: (1) under Hooks, Which hooks run for a call: a read or a search starts three hook processes, and a shell command, an edit or a write starts five; (2) under First steps, How the Node and Git floors are held: what the gate's static reading of the Git forms leaves out; (3) under Kit files and instance files, How it counts a session across days: a session whose count falls; (4) under Taking upstream updates, What the update's publish checks: which commit is the update's own merge; (5) under Owned cleanup and retention, How a prune judges and removes: which readings of the process table a prune makes.",
  "goalAlignment": {
    "traps": {
      "takingTheLaddersWord": "Six reviewers twice, three critics, two readers and a verifier passed this text, and a final review that rests on their number reads nothing itself. The reviewer read the guide whole and compared the base's prose with it by a script of its own before taking any earlier conclusion.",
      "polishingWhatItCertifies": "A reviewer who rewords the guide certifies its own sentences on bytes no suite and no reader has seen. The subject is left as verified and the sentences are boarded.",
      "lengthAsTheStandard": "The guide grew by 1,600 lines, and a figure is easier to judge than a reading. The order's standard is whether a reader can follow the text, so the judgment is of passages."
    },
    "noOp": "Pass the verified subject unchanged, reuse its complete row and write the records. That is what was done; the script and the reading are evidence beside it."
  },
  "reopenWhen": "The operator's reading at the pull request finds a passage that cannot be followed, or asks for core's own map, the command block split or the remaining openings removed; main moves before the merge and an integration changes the code identity; or a later reader shows a fact of the base that the rewrite lost."
}
```
