# WO-277 decisions

## WO-277-D001

```json
{
  "id": "WO-277-D001",
  "date": "2026-11-15",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v1.0.1, the next patch above the observed release baseline v1.0.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v1.0.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-277-the-starters-commands-page-tells-a-person-every-step.md"
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

## WO-277-D002 — The operator's direction: the meta critic runs on its clock on GPT-6 Astra, with its two checks repeated and one account address kept from the other provider

```json
{
  "id": "WO-277-D002",
  "date": "2026-11-15",
  "dispatch": "resume: next; the operator's message of 05:04:38 UTC on 2026-11-15, three minutes into the dispatch",
  "decision": "The operator asked, in paraphrase, for the meta critic's cadence to be started on GPT-6 Astra. The critic is the one docs/evidence/WO-276/critic/ holds: its fixed charter, its launcher and its README, which the kit has no command for until WO-279. The instance's worker table resolves astra to gpt-6-astra at max on the Codex provider (npm run worker -- show astra --provider codex; Codex CLI 0.169.0), which is the launcher's default worker. Starting the cadence starts its clock and launches nothing at once: WO-276-D166 records that reading as the operator's, so that each launch has conduct to read. The first launch is due one 75-minute interval after this dispatch's work began at 05:01:11 UTC, at 06:16 UTC, and a background timer set at 05:09 UTC ends then. Launches follow every 75 minutes from the last one; nothing waits for a critic; a launch that falls due while a gate is live goes out when the gate ends; the clock ends when the passing complete run is in (the README's rule 4, WO-276-D145). Each report is given to the operator whole before the executor answers it, and each point is then judged in a decision of this file. The two checks the README asks a later order to repeat were made before the first launch. Access: a command under the Codex sandbox read this session's transcript's size and was refused a write in the same directory. The private list: every file under this worktree's transcript directory (2 files, 2,423,530 bytes, 3,465 rows at 05:08 UTC) was read through the list's own reader, printing counts only; the list is present with 9 entries, none in the refuse class and 9 in the context class; no row matched in either class. One observation differs from WO-276-D101's, which found the operator's address in no transcript row: this session's transcript holds one mail address in two rows the host wrote itself, its session-context row and the API-request row that renders the same context beside the Git user line. A worker on the other provider that reads those rows would send the address there. The launch therefore points the critic, with the launcher's --transcripts option, at a copy of the transcript directory made at the launch in which that one address is replaced by a fixed placeholder and no other byte differs; the screen and the count of rows that hold an address are repeated on the copy before the launch. The executor wrote the operator a message at 05:09 UTC saying this and naming the two other courses, sending the transcripts as they are or holding the critic. The host's transcript does not hold that message (WO-277-D010), so the first launch was made on the copy without the operator having been told why, and the operator is told in the dispatch's next full message; either word changes it for a later launch. The launcher is counted by no hook, so its uses are counted by hand beside the session's: up to nine review uses (four for the paired round one, up to four rechecks and one combined round) and one or two critic launches, against the default cap of 20.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo277-start-the-astra-meta-critic-cadence-2026-11-15.txt, SHA-256 dcaf8dbe5ad33815ba548611a38dc00d92e82ee70c4a975abc9346cb31a38851",
    "docs/evidence/WO-276/critic/README.md (what it needs, and the rules that made it useful), charter.md and launch.mjs; node docs/evidence/WO-276/critic/launch.mjs WO-277 1 --since 2026-11-15 --print, which renders the charter with this order, this checkout and this worktree's transcript directory",
    "WO-276-D166 (the first launch in a dispatch goes out when the dispatch's own work has run for one interval), WO-276-D165 and WO-276-D101 (the two checks and their method)",
    "npm run worker -- show astra --provider codex: model gpt-6-astra, effort max, provider codex, standing rules printed; codex --version: codex-cli 0.169.0",
    "codex sandbox -- /bin/sh -c 'wc -c <transcript>; touch <transcript directory>/.write-probe' at 05:07 UTC: the size printed (2,245,966 bytes), the write refused with Operation not permitted, no file created",
    "Session scratch, critic/screen-transcripts.mjs over scripts/lib/terms.mjs (localTermFindings), run under the bounded wrapper at 05:08:10 UTC in 0.4 s: list present, 9 entries (0 refuse, 9 context); files 2; bytes 2,423,530; rows 3,465; refuseRows 0; contextRows 0; rows holding a mail address 2",
    "Session scratch, critic/address-rows.mjs, which prints no address: one distinct address; row 18 of the session's transcript, type attachment, subtype session_context, at $.attachment.context.userEmail and in the rendered context block; row 28, type api-request-blob, in the same context block"
  ],
  "rejected": [
    {
      "option": "Launch the first critic at once",
      "reason": "Three minutes into the dispatch the executor had read the order and its citations and changed nothing; WO-276-D166 records the operator's correction of exactly that launch."
    },
    {
      "option": "Send the transcripts as they are",
      "reason": "The operator asked for the critic and its design reads the transcripts, but the record the operator last had (WO-276-D101) says the address is in no row. It is in two now, by the host's own writing, and an account's address goes to another provider only on the operator's word."
    },
    {
      "option": "Hold the critic until the operator answers about the address",
      "reason": "The cadence the operator asked for would then wait on a question the copy answers; replacing one token changes nothing the critic judges."
    },
    {
      "option": "Give the critic an extract of the transcripts",
      "reason": "Choosing what it reads is briefing it by another name (WO-276-D101). The copy holds every file and every row."
    }
  ],
  "goalAlignment": {
    "traps": {
      "briefTheCritic": "A copy the executor prepares could become a selection. It is made by one replacement of one string over every file, and the launch records the counts of the original and of the copy.",
      "missTheClock": "Nothing in the kit keeps the cadence. A background timer ends when a launch is due, and the executor stops it before it records its result."
    },
    "noOp": "No critic: the order would run with its reviewers alone, against the operator's request."
  },
  "reopenWhen": "The operator says to send the transcripts as they are, to hold the critic or to launch one at a time of their choosing; WO-279 lands, and the kit's own launch and screen replace this copied route."
}
```

## WO-277-D003 — What the page says of an absent terms list is what each publish does, and the guide's sentence beside the new block is corrected to it

```json
{
  "id": "WO-277-D003",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 steps 1 and 2",
  "decision": "The order's objective is that the terms list comes before anything publishes, and its observed gap and the 2026-11-14 pass's section give the reason as every publish refusing without a list. Read in the code, three of the four publishes refuse while the list is absent and the fourth does not. The publish of a planning branch and of a kit update share one helper, which fails the title and the body with the words that the local-terms list is absent and where to register it. A target's publish fails each artifact as unavailable for the same cause. An order's own publish, worktree publish, prints that the list is unavailable and that the files its branch changes were not screened, screens the title against a list that is not there, and goes on. The page's first step therefore says what was read: while the list is absent a planning pass's publish refuses, and the files an order's branch changes are not screened. That is a stronger reason for a person on a managed machine than a refusal: nothing stands between an unlisted name and the order's pull request. The guide's own sentence in First steps step 4, a few lines below the new block, said that an absent list refuses publication; it is replaced by the three publishes that refuse and the one that says its files were not screened, so that the step does not contradict the page. No code is changed: whether an order's own publish should refuse as the other three do is a product decision, named below for planning. First steps is a reader entry point, where the document check refuses a link to a record, so the corrected sentence carries no link and this record names the passage.",
  "evidence": [
    "scripts/lib/launchpad-publish.mjs, lintFailures (lines 64 to 85) and its one caller in publishLaunchpadBranch, which serves both the planning and the update door: status unavailable fails with 'the local-terms list is absent; register it at <path>, where an empty list refuses nothing'; scripts/test-plan-refutation.mjs pins that refusal before any push",
    "scripts/lib/target-publish.mjs lines 2035 to 2036: '<kind> unavailable: local-terms list absent' is a failure",
    "scripts/worktree.mjs lines 1647 to 1667 (the branch screen: unavailable prints 'local-terms list: unavailable; the N files <branch> changes were not screened' and throws nothing) and lines 1711 to 1726 (the title screen reads the findings of an absent list as none); scripts/release.mjs holds no refusal for an unavailable list in check-surfaces",
    "docs/KIT.md, First steps step 4, the sentence as it stood at ed66a822c: an absent list is unavailable and refuses publication",
    "docs/evidence/WO-258/handoff.md, criterion 10's account: First steps is the kit-first-steps entry point, where the document check refuses a record"
  ],
  "rejected": [
    {
      "option": "Write on the page that every publish refuses without the list, as the pass's section does",
      "reason": "It is not what an order's publish does, and a person who relied on it would believe a screen ran that did not."
    },
    {
      "option": "Leave the guide's sentence and write only the page's paragraph",
      "reason": "The step would then say two things about the same list a few lines apart; the sentence is in the list item this order edits, and the correction is one sentence with its sources read."
    },
    {
      "option": "Make an order's own publish refuse while the list is absent",
      "reason": "The order changes no code and adds no refusal, and a refusal there would stop an instance's first order, which registers the list itself, on a rule no planning pass has weighed."
    }
  ],
  "followup": "Planning: an order's own publish (worktree publish) goes on when the private terms list is absent, printing that the files its branch changes were not screened, while the publish of a planning branch, of a kit update and of a target's change refuse. Decide whether it should refuse as they do, where WO-001's own registration of the list comes in that order's sequence, and whether the document gate's advisory for an absent list should refuse in an instance. Check: a case that publishes an order's branch with no list. Priority: before an instance on a managed machine publishes an order without a list by oversight; the commands page now puts the list first.",
  "reopenWhen": "An order's publish is changed to refuse without a list, at which point the page's paragraph and the guide's sentence say so; the code read here is found to differ from what a publish does when run."
}
```

## WO-277-D004 — Criteria 1 to 3 are judged in the launchpad suite's own export: one case is added, and no generator, step table or check of the page changes

```json
{
  "id": "WO-277-D004",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 step 4",
  "decision": "Criterion 3 states three facts in the export fixture of npm test -- --only launchpad: the exported front page's first paragraph links docs/OPERATOR.md, the exported guide's first paragraph links OPERATOR.md, and the commands printed in the export hold the terms list's block in step 1. Before this order no case of that suite read any of the three: the suite's existing case holds the exported page to the source's page byte for byte and to the guide's blocks, which says nothing of a first paragraph and would pass with the terms block gone from both. A met criterion that names the suite stands on that suite's passing row, so the row has to assert the facts. One case is added to scripts/test-launchpad-seeds.mjs. In the suite's fresh export it reads the first paragraph of README.md and of docs/KIT.md through the repository's Markdown link reader and requires the two links; it runs node scripts/launchpad.mjs commands in the export and requires seven steps, each opening with a paragraph before its first block, the clone recipe and then the terms block of three lines inside step 1, WO-001 in the paragraph of the first planning pass's step, and the harness manifest's checkout line in the release step; and it requires that the example list the block copies is a file of the export. The order's release line says no code and its non-goals bar any change to the generator, the step table or a check. Read with the Design, whose rejected options are a hand-written page or a typed source because either changes the generator and its checks, the non-goal fences the page's generator and what judges its form; the added case changes neither, reads only what the export holds, and ships in no kit, since the launchpad suite is core's own. The file is a declared source of the launchpad row and of the row that inventories the split launchpad files, and is no registered evidence source, so no edition is staled and the order's Cost line stands as to editions.",
  "evidence": [
    "The order's criterion 3 and its Evidence gate; its Design's first item and its non-goals",
    "scripts/test-launchpad-seeds.mjs as it stood at ed66a822c, the case for WO-275 criteria 3 and 4: page equality with the source, the manifest row, the guide's marked blocks in order, the print before any install",
    "scripts/test-runner.mjs, the launchpad row: kit 'core-only', sources scripts/test-launchpad- and scripts/kit/ and the two documents; scripts/lib/evidence-sources.mjs, which names no launchpad test file; scripts/lib/machinery-sources.mjs line 562",
    "scripts/docs-check.mjs, markdownLinks: the link reader the case uses"
  ],
  "rejected": [
    {
      "option": "Capture a one-off export's output under the order's evidence and add no case",
      "reason": "The criterion names the suite's fixture, which is removed when the suite ends; a capture from another export is a proxy, and nothing would fail when a later edit drops a link or the block."
    },
    {
      "option": "Pin the page's paragraphs word for word",
      "reason": "The words are the operator's to judge at final review and WO-281 weighs the page's form again; the case holds what the criteria name and no sentence."
    },
    {
      "option": "Put the assertions in the sync suite, beside the generator's own case",
      "reason": "That case judges the generator on core's guide; criterion 3 is about what an export carries and prints."
    }
  ],
  "goalAlignment": {
    "traps": {
      "proxyRow": "A passing launchpad row that asserts nothing of criterion 3 would have been offered as its evidence. The case makes the row assert it.",
      "wideningTheOrder": "A new case could grow into a check of the page's form, which the order fences. It reads the three facts of criterion 3 and the two names and the paragraph-before-blocks of criterion 2, and nothing else."
    },
    "noOp": "No case: criterion 3 would rest on the executor's reading of one export, and the verifier would rebuild an export by hand to check it."
  },
  "reopenWhen": "The operator reads the non-goal as barring any new case; WO-281 changes the page's form, at which point the case's reading of a step's paragraph is rewritten with it."
}
```

## WO-277-D005 — Step 3's suite failed twice before it passed: once on the executor's own order of work, once on a failure main has held since the planning commit, which the roadmap table's writer repairs

```json
{
  "id": "WO-277-D005",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 step 3, 05:16 to 05:37 UTC on 2026-11-15",
  "decision": "npm test -- --only sync-fixtures, the check of step 3, ran three times. The first run (05:16 to 05:17 UTC) failed in its structural preflight with five of nine tasks: the decisions index and the work-order index were stale. That was the executor's error twice over. Release preparation had written the order's first decision and its heading's version at 05:12, and the gate was started after npm run format without npm run sync, which the handoff sequence puts between them. And the command piped the gate to tail, so the shell reported the pipe's exit of 0 for a failed gate; the failure was read from the gate's own closing line, 4 passed and 5 failed. From the second run on a gate's output goes to a file in session scratch and the command prints the gate's own exit status. After npm run sync the second run (05:19 to 05:23 UTC) passed the preflight and failed one case of the suite, the real-inventory case of scripts/test-sync.mjs, on docs/control/release-history.json: the record regenerated with table null where the committed record holds v0.122.1. This failure is main's and not this order's. The case removes the record and requires the index's refresh to write the committed bytes again. The refresh keeps the tag the roadmap's table was rendered through only from the record it replaces; with no record it writes the newest tag when the roadmap's block renders every recorded tag, and null otherwise. The planning commit 97ce00838 appended v1.0.0 to the record through the index's refresh, as product 07 says a refresh does, and left the table at v0.122.1, the last row of the roadmap's block. From that commit the case cannot pass. The pass's own Validation section names the document gate and one bounded probe of the process-debt file and no run of the sync suite, so nothing met the case before this order did; whether any other run was made on main since is not known here. On this branch the record and the roadmap were byte-identical to main when the case failed. The repair is the one product 07 names for tags recorded since the table was written: npm run release -- list --markdown --write, which added v1.0.0's row to the generated block of docs/product/06-roadmap.md and recorded the table as rendered through v1.0.0. It went through the follow-up queue as its one item (queued, announced, checked in, started, completed at revision 5). The announcement and the check-in are the executor's own attestations: the host's transcript holds no chat message of the announcement before the writer ran (WO-277-D010). The third run (05:28 to 05:36 UTC) passed, 9 of 9, at the code identity the second run failed at, since neither file is code. The cause stays: the next tag, this order's own v1.0.1 at its release close, puts main in the same state as soon as an index refresh records it, and the next order's first complete run meets the same case. That is named for planning below.",
  "evidence": [
    "The first run's closing lines (the host's task output): 'Decisions index is stale; run npm run meta', 'docs/work-orders/README.md is stale at line 41', 'suite:sync-fixtures: 4 passed; 5 failed', and the shell's exit code 0 for the piped command",
    "Session scratch, gate-sync-fixtures-2.txt: 'not ok 11 - the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable', the assertion's file docs/control/release-history.json and its byte difference (null against \"v0.122.1\"); 'suite:sync-fixtures: 8 passed; 1 failed'; gate exit 1",
    "scripts/test-sync.mjs lines 757 to 786 (the two observation records: a damaged or missing one is stale, the refresh writes it again, and the bytes must equal the committed ones); scripts/lib/release-history.mjs, writeReleaseRecord lines 277 to 317 and tableIsCurrent",
    "git show --format= 97ce00838 -- docs/control/release-history.json: the v1.0.0 entry added, the table line unchanged at v0.122.1; docs/product/06-roadmap.md line 686, the block's last row before the repair, v0.122.1; git diff --stat main for the two files before the repair: empty",
    "docs/planning/passes/v1-0-0-instance-returns-and-followups-2026-11-14.md, Validation: the document gate, a bounded probe of scripts/test-process-debt.mjs, the refutation and the terms screen",
    "docs/product/07-execution-guide.md, Where the control plane finds its documents: the index's refresh appends the tags that arrived since and writes no product document, and npm run release -- list --markdown --write adds their rows (WO-276-D046)",
    "The writer's output at 05:25:08 UTC: 'Wrote docs/product/06-roadmap.md: release history of 214 local annotated release tags'; the diff: one row added for v1.0.0, the record's table v0.122.1 to v1.0.0",
    "The third run's row: host-gate:b9637a59798709643f81f669fed08eb9519477df66d5ce7c2312ced3f4dc64b8:sync-fixtures, recorded 2026-11-15T05:36:53.605Z, exit 0, 9 passed and 0 failed; npm run work-orders -- index --check passing at 05:26:22 UTC (the queue's completion event says 05:27, which is wrong by a minute and cannot be edited)",
    "npm run adjacent -- list: adjacent-0001 completed at queue revision 5"
  ],
  "rejected": [
    {
      "option": "Carry the failing case to the verifier as an inherited failure",
      "reason": "Criterion 4 asks for a passing complete run, the repair is one documented command on two generated surfaces, and an inherited failure carried forward is carried by every order after it."
    },
    {
      "option": "Change the case or the refresh so that a table behind the newest tag survives regeneration",
      "reason": "It is the lasting repair and it is code in a module the index and the release share; this order changes no code, and the choice between a refresh that reads the boundary from the roadmap's block and a case that tolerates the state belongs to a planning pass."
    },
    {
      "option": "Set the record's table by hand",
      "reason": "A generated record changes only through its writer, and the roadmap's block would still lack the row."
    }
  ],
  "followup": "Planning: after every release close, the first index refresh records the new tag while the roadmap's table still ends at the tag before it, and from then the sync suite's real-inventory case fails (it removes docs/control/release-history.json and requires the committed bytes back, and the refresh cannot know the table's boundary without the record). Nothing runs npm run release -- list --markdown --write between a close and the next order's first complete run, and a planning pass's document gate does not run the case. Decide one: the refresh reads the boundary from the roadmap's block (the longest run of recorded tags the block renders) when no record can be read; or the release close or the planning pass's own sync writes the table; or the case restores the boundary it removed. Check: the case passes on a tree whose record names a tag the table lacks. Priority: before the order after WO-277 runs a complete run, since WO-277's own tag recreates the state; until then that order's executor runs the writer as this decision did.",
  "reopenWhen": "The verifier or the final review finds the roadmap's new row or the record wrong; a planning pass decides the lasting repair."
}
```

## WO-277-D006 — The page as built: seven paragraphs, each claim read where the kit makes it true, the terms block as three lines, and the manifest's route in the release step's paragraph

```json
{
  "id": "WO-277-D006",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 steps 1 to 4",
  "decision": "The seven marker sentences of docs/KIT.md are rewritten as one paragraph each, on one line of its comment as the grammar reads it, and the page is regenerated by its own command at the version release preparation assigned, v1.0.1. Each paragraph says what the step does, what to look for and what to do when it fails, in the second person, after the 2026-11-14 pass's section. What each says was read where the kit makes it true and not copied from that section, which differs from the code in one place (WO-277-D003). Step 1: the rows of the host report with a verdict of met, unmet or unknown and a remedy on every row; harness check's closing words for an absent list; the terms check's status line and its FAIL line; the two classes of the list; Claude Code as the one host until the configuration elects another. Step 2: the phrase typed alone; the pull request's URL printed at the publish; the publish's two refusals, for an absent list and for a line, which names a file and a line and never the entry; WO-001 as the one entry of the sequence the export seeds, so it can run first; a pass never takes a starter update. Step 3: the sibling folder's name, the main checkout's name with -woNNN; what each of the three phrases does; a fresh session for each, as the 2026-11-14 section has it and as a drive runs them; resume: fix and then verification and final review again, since a repair is verified independently; resume: status. Step 4: a merge commit because the close needs the order's branch in main's history; what the close leaves; a stopped close typed again, since the close checks a Release that exists and never publishes twice, and the hook passes a phrase already recorded with the same briefing. Step 5: the preview's rows for files both sides changed and for refused kit files; the manifest's route; what a refused publish and a refused finish print. Step 6: the registration order from the operator's stated values; records kept in the instance for a team's repository; the three places that name an unrecorded clone. Step 7: the three fields of an entry; a seeded file with the form of an entry and none; the document gate naming the entry and the field. Three choices of form. The terms block is the three lines criterion 1 names and no fourth: the person must replace the example's entries between the copy and the check, and a comment line saying so would be an error when the block is pasted, because an interactive zsh, the default shell on macOS, where the kit is exercised, does not read a line that begins with a hash as a comment unless its user has turned that on; the paragraph and the guide's sentence after the block say it instead, and the check is harmless when run on the example first. The manifest's route stands in the release step's paragraph, as the execution plan says: a block of its own would be printed in the guide's order, after the block whose second line it interrupts. And the page's fixed opening still calls a step's words its sentence, which is the grammar's name for them: that line is the generator's, which this order does not change. The guide's first paragraph now says whom the guide serves and links the page, with the inventory of the kit as its second paragraph, unchanged; the seed front page's first paragraph names the page and the command first and the guide as the reference behind it. Step 1's check, that the page's own check fails naming the page as stale after the block is added, was observed; the page was by then stale for the version claim as well, since release preparation ran first so that the page would be generated once, at v1.0.1.",
  "evidence": [
    "node scripts/doctor.mjs on this host (the table's Verdict and Remedy columns) and scripts/doctor.mjs (met, unmet, unknown); scripts/harness.mjs line 452 (harness check's line ends with the local-terms list's status); scripts/terms.mjs lines 43 and 84 to 106; npm run terms -- check CLAUDE.md README.md in this worktree: 'local-terms list: present; entries: 0 refuse, 9 context; named files screened: 2; lines found: 0 refuse, 0 context'",
    "scripts/launchpad.mjs line 1247 (the seeded sequence's one entry, WO-001) and docs/KIT.md, Taking upstream updates (the publish prints its pull request's URL as plan publish does); scripts/lib/launchpad-publish.mjs lines 64 to 85",
    "scripts/worktree.mjs lines 1401 to 1402 (the worktree's directory is the main checkout's name with -wo and the order's number); docs/product/07-execution-guide.md, the phrase table's rows for resume: status, fix, verify and final review and its passage on a repair before re-verification; the 2026-11-14 pass's section, item 4",
    "docs/KIT.md, First steps step 7 (release close requires the order's branch in origin/main's history, which a squash or rebase merge rewrites); the release-close role text (the close is done when the tag and Release exist and the worktree, its directory and the branch are gone; a retry re-checks an existing Release and never publishes twice)",
    "docs/KIT.md, Taking upstream updates: the preview's 'both changed:' rows and the refused kit rows, the publish's refusals naming the restoring command, the finish's refusals and its by-hand lines past the bound; the order's observed gap 4 and the 2026-11-14 pass's section, item 7, for the manifest's route",
    "docs/KIT.md, First steps (bootstrap names a target whose clone is not recorded, since the plan check and the document gate refuse until it is) and step 5 (records: instance for a team's repository); Planning in this instance (FOR-CORE.md's entry of three fields, seeded with the form of an entry and no entry, judged by the document gate by entry and field)",
    "zsh -f -i -c 'print -r -- ${options[interactivecomments]}' on this host, zsh 5.9: off",
    "node scripts/lib/operator-commands.mjs --check after the block was added: 'stale docs/OPERATOR.md', exit 1; after the regeneration: 'docs/OPERATOR.md is current', exit 0; scripts/lib/operator-commands.mjs line 209, the page's opening sentence, and kitVersion, which reads the README's release block"
  ],
  "rejected": [
    {
      "option": "Split the terms list's commands into two blocks with the edit between them, as the 2026-11-14 section does",
      "reason": "Criterion 1 names one block holding the three lines, and the execution plan's step 1 writes it so."
    },
    {
      "option": "A marked block for the manifest's route",
      "reason": "The page prints a step's blocks in the guide's order, so the route would follow the block it belongs inside; the plan puts it in the sentence."
    },
    {
      "option": "Reword the page's opening line, which says each step's sentence",
      "reason": "The line is written by the generator, and the order's non-goals bar any change to it; WO-281 weighs the page's form again."
    },
    {
      "option": "Copy the 2026-11-14 section's paragraphs as they stand",
      "reason": "That section was written for one operator on one day and names the starter's address and a dated route; the page ships in every starter, and one of the section's statements, that every publish refuses without the list, is not what the code does."
    }
  ],
  "followup": "Planning: the commands page's release step carries the harness manifest's route (git checkout main -- .claude/harness-manifest.json after a stopped merge) only until WO-282 repairs the emit, and WO-282's non-goals leave the commands page out, so no order owns taking the route out. Give its removal to WO-282 or to the order after it: the sentence in the take-release marker of docs/KIT.md and the regenerated page. Where WO-282 states in the guide which side a stopped merge keeps, the marker should say the same thing once. Check: the page names no route the emit has made unnecessary. Priority: with WO-282.",
  "reopenWhen": "The operator's reading at final review finds a paragraph that does not serve a person setting up on a managed machine; WO-282 repairs the emit, at which point the release step's paragraph drops the manifest's route; WO-281 rewrites the guide and weighs the page's form."
}
```

## WO-277-D007 — Round 1 of the paired ladder: twelve distinct findings from four reviewers, one of them a stale pin that fails criterion 4, each judged before any fix

```json
{
  "id": "WO-277-D007",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 the review ladder, round 1, 06:02 to 06:20 UTC on 2026-11-15",
  "decision": "The order's header declares the paired ladder. Round 1 was four fresh workers of the instance's default worker for Claude, launched together at 06:04:19 UTC as round 1 on one base (b8591a7307703d2cd454e51ac0c0557dc10d48d0) and one reviewed tree (1699f95895eee9f3d83a0a86223e3bbb3d419b1b): criteria, design, consistency and the combined worker, each given the kit's own round 1 brief as its dry run printed it and none given another's report. Each dry run's round, base and tree were read before the launch (WO-276-D118). The host's transcripts of the four name claude-opus-5-5; the effort, xhigh, is the generated definition's and was not read back. Returns: design at 06:11:59 UTC (8 findings, none blocking), criteria at 06:15:25 (4, none blocking), combined at 06:17:18 (6, one blocking) and consistency at 06:18:51 (3, one blocking): 21 findings, 12 distinct. Nothing in the tree changed between the launch and the last record. Each distinct finding is judged here, before any fix. R1-01, criterion, fixed. The front page seed's SHA-256 is pinned in scripts/test-launchpad-export.mjs, in the document case that the kit owns its guide and the front page is a pinned seed, and step 4's edit of the seed left the pin at the base's hash. The writer is the order's own edit. It is a closed failure on a real writer's input that fails criterion 4 at the document gate and at the complete run; the fix is the pin's one line. The combined worker and the consistency reviewer both found it, and the consistency reviewer ran the case and showed the two hashes. The executor's own trace before the round had found the line that hashes the seed and had not read the pinned value under it, and had taken the launchpad row that step 4 names as covering the export's cases; that row skips the document cases, which the launchpad-docs row runs. The miss is the executor's and is of a kind with D005's: a check trusted for more than it runs. From here a consumer found by a search is read to the end of its assertion, and a suite named as a step's check is read in the runner's table for what it leaves out. R1-02, lesser, fixed. The pin's own comment asks the order that changes the seed to name the migration in its decisions and in its release's Read before upgrading, and the order's write-back duty asks for the same line; no decision named either. A decision names the migration and the handoff carries the line for the final review, which writes the notes. R1-03, lesser, fixed. Step 2's route for a publish refused over an absent list said to run step 1's second block and publish again. That block copies the example, whose entries are made up, so the retried publish would pass with none of the person's names screened: an open failure on the route the publish's own refusal sends a person down. The sentence now sends the person to register the list as step 1 says, with their own entries. R1-04, lesser, fixed. The release step's paragraph gave the manifest's route as if the person had stopped where the merge stopped; a block pasted whole runs every line whatever the line before returned, so the add and the commit would conclude a stopped merge. It also read as if the merge kept this instance's bytes of a file both sides changed by itself, where the guide and the preview tell the person to keep them, and its opening did not say who runs the lines. The paragraph now says who, to run the second block a line at a time, what to do after the merge line for each file both sides changed and for the manifest, and to go on from the emit. R1-05, lesser, fixed. The manifest's route is carried until WO-282 repairs the emit, but WO-282's non-goals leave the commands page out and the new case pins the route's words, so nobody owned its removal. D006 gains a follow-up that names the removal of the sentence and of the assertion, and a comment beside the assertion says when it goes. R1-06, lesser, recorded. The seeded first order's item 4 says to create the terms list from the example, while the page now registers it in step 1 and worktree start carries the main checkout's list into the order's worktree. An executor that follows item 4 to the letter could replace the carried list with the example there. The guide's step 7 already says the carried list is the one the session uses, so whether it happens depends on a reading. The seed is not this order's to change: the launchpad's cases pin its item 4 and its refresh into starters has rules of its own. It is named for planning below, and the page's step 3 gains the two lines worktree start prints, for a carried list and for none, so that a person sees which happened. R1-07, improvement, fixed. Step 1 said the list comes before anything publishes, after a first block that pushes the starter's commit; it now says before any session publishes. R1-08, improvement, recorded. The paragraphs quote what commands print and point at blocks and steps by position, and no check ties either to its producer. Three reviewers read each producer and found every quoted word true at this tree. A case that ties the page's words to their producers is a new check of the page's form, which the order fences and WO-281 weighs; D006's evidence names each producer. R1-09, improvement, recorded. A step's paragraph is one long line in a comment the rendered guide does not show, printed before all of the step's blocks, and the page's fixed opening still calls it a sentence: the order's own design and its non-goal, for WO-281. R1-10, improvement, recorded. The marker's paragraph and the visible prose after the new block say the same, and what an absent list does is now said in three places. The visible prose stays because the guide's reader does not see the marker; one statement with pointers is for WO-281's rewrite. R1-11, improvement, fixed. The new case held the number seven and took its steps by position, and looked for the manifest's route anywhere in the release step. It now finds each step through the step table by its id and looks for the route in the step's paragraph, which is where D006 puts it. The evidence recorder's own copy of the terms block stays, since it is a record of one run. R1-12, improvement, recorded. No case runs an order's publish with no list; D003's follow-up already names that check.",
  "evidence": [
    "The four reports in the ignored reviews lane, docs/control/local/reviews/WO-277/since-2eb510c741e5/round-1-criteria.md, round-1-design.md, round-1-consistency.md and round-1-combined.md, each recorded with npm run worker -- record against its dry run's brief digest and the reviewed tree: 'review: design round 1 found 8 (0 blocking)', 'criteria round 1 found 4 (0 blocking)', 'combined round 1 found 6 (1 blocking)', 'consistency round 1 found 3 (1 blocking)'",
    "Session scratch, ladder/dry-criteria-1.json, dry-design-1.json, dry-consistency-1.json and dry-combined-1.json: round 1, the base named with --since, reviewed tree 1699f95895eee9f3d83a0a86223e3bbb3d419b1b, one lane; each worker's prompt file equal by SHA-256 to the dry run's prompt",
    "The session journal's task rows: the four launches dispatched at 06:04:19 UTC; the host's transcript of each worker: model claude-opus-5-5, the hand-back times above",
    "scripts/test-launchpad-export.mjs lines 158 to 163: the comment and the pin, 4b60b964df6168c2d9ddef3b806d051d9f3b0e2be5ea40dfef10760909ab9699; shasum -a 256 scripts/kit/README.client.md at the reviewed tree: 7b2c2d3210e0593b93eb11cba7f49d2f6ed968aabbaf6c680c8b5beffdafad9e; scripts/test-runner.mjs, the launchpad row's skipPattern and the launchpad-docs row's namePattern, both the document marker",
    "scripts/kit/first-order.template.md lines 51 to 58 (item 4); scripts/worktree.mjs lines 583 to 596 (carryLocalTerms and its two printed lines); docs/KIT.md, First steps step 7",
    "docs/work-orders/WO-282-an-update-leaves-nothing-to-repair-by-hand.md, Non-goals: the commands page (WO-277)",
    "docs/KIT.md, Taking upstream updates: a file both sides changed may merge in silence or stop on a conflict, and either way the instance's bytes are the ones the merge keeps; scripts/launchpad.mjs line 3439, the preview's row",
    "node scripts/harness.mjs usage for this session at 06:19 UTC: workers launched 4 (claude 4, codex 0), re-tasked 0, cap 20, remaining 16",
    "The fixes as made, 06:20 to 06:23 UTC, each probed alone under the bounded wrapper: the three document cases of scripts/test-launchpad-export.mjs pass, the pinned-seed case among them, at the pin 7b2c2d32…; the reworked case of scripts/test-launchpad-seeds.mjs passes; node scripts/lib/operator-commands.mjs --check reads the regenerated page as current; the evidence recorder's printed page equals it (SHA-256 d93996384fb1a5a182ebd8f7dfd2a629308d9c2c2ca56b2bc9135f6ed91b6bd2)"
  ],
  "roundFindings": [
    { "id": "R1-01", "finders": ["consistency", "combined"], "class": "criterion", "disposition": "fixed" },
    { "id": "R1-02", "finders": ["consistency", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "R1-03", "finders": ["design", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "R1-04", "finders": ["criteria", "design", "combined"], "class": "lesser", "disposition": "fixed" },
    { "id": "R1-05", "finders": ["design"], "class": "lesser", "disposition": "fixed" },
    { "id": "R1-06", "finders": ["criteria", "design"], "class": "lesser", "disposition": "recorded" },
    { "id": "R1-07", "finders": ["criteria"], "class": "improvement", "disposition": "fixed" },
    { "id": "R1-08", "finders": ["design", "combined"], "class": "improvement", "disposition": "recorded" },
    { "id": "R1-09", "finders": ["design", "consistency"], "class": "improvement", "disposition": "recorded" },
    { "id": "R1-10", "finders": ["design"], "class": "improvement", "disposition": "recorded" },
    { "id": "R1-11", "finders": ["design", "combined"], "class": "improvement", "disposition": "fixed" },
    { "id": "R1-12", "finders": ["criteria"], "class": "improvement", "disposition": "recorded" }
  ],
  "rejected": [
    {
      "option": "Reword the first order's seed in this order so that it keeps a carried list",
      "reason": "The seed's item 4 is pinned by the launchpad's cases and reaches starters through its own refresh rules; changing it is a seed migration of its own, outside an order whose deliverables are the page and the two first paragraphs."
    },
    {
      "option": "Add a case that ties each output the paragraphs quote to the code that prints it",
      "reason": "It would be a new check of the page's words, which the order's non-goals fence and WO-281 weighs; every quoted word was read true in its producer by three reviewers."
    },
    {
      "option": "Use cp -n in the terms block so that a second run cannot replace a person's list",
      "reason": "Criterion 1 names the block's three lines as they are, and the paragraph tells the person to run the last line again, not the block."
    }
  ],
  "followup": "Planning: the seeded first order's item 4 says to create the private terms list from the example, while the commands page registers the list in step 1 and worktree start carries the main checkout's list into the order's worktree; an executor that follows item 4 to the letter replaces the carried list with the example in that worktree, and the order's files are then screened against made-up entries. Reword the item to keep a carried list and to create one only where the worktree holds none, with the seed's cases and its refresh into starters. Check: the first order run in an export whose main checkout holds a list leaves that list's bytes. Priority: with WO-281 or WO-282, before a person on a managed machine runs WO-001 after following the page.",
  "reopenWhen": "A recheck finds a fix wrong or a finding misjudged; the operator reads a recorded finding as one to fix in this order."
}
```

## WO-277-D008 — The front page seed's migration: an unedited front page takes the new one, a front page that is its owner's is kept, and what the release's Read before upgrading says

```json
{
  "id": "WO-277-D008",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 the repair of round 1's findings R1-01 and R1-02",
  "decision": "This order changes the seed front page, scripts/kit/README.client.md: its first paragraph now sends a person to docs/OPERATOR.md and names node scripts/launchpad.mjs commands before the kit guide. The seed is pinned by its SHA-256 in the launchpad's document case, whose comment asks the order that changes it to name the migration; the pin moves from 4b60b964df6168c2d9ddef3b806d051d9f3b0e2be5ea40dfef10760909ab9699 to 7b2c2d3210e0593b93eb11cba7f49d2f6ed968aabbaf6c680c8b5beffdafad9e. The migration, as the refresh's code has it. For the starter: this order's release close refreshes it, and the refresh rewrites a front page that is byte for byte a seed an earlier export wrote, once, to the new one; a front page that was customized, is missing or is not a regular file is kept and named in the refresh's kept seeds with its reason, and is never refused. The starter's front page at cd8ea69, the revision the order names, is the unedited seed (its SHA-256 is the old pin's), so the refresh is expected to rewrite it; the release close's own row is the observation. For an instance: the root README.md is an instance seed outside the kit's manifest, so a kit update never replaces it. An instance takes the starter's change through its update's merge: a front page the instance never changed comes in as Git merges it, and one the instance changed is listed by the preview as changed on both sides and keeps the instance's bytes. docs/OPERATOR.md itself is a kit file and reaches every instance with the update whatever its front page says. What the release's Read before upgrading says, for the final review, which writes the notes: that docs/OPERATOR.md is the place to start, the commands of each step with what to look for and what to do when one fails, printed by node scripts/launchpad.mjs commands; that the starter's front page now names it first, that an instance whose front page is unchanged takes the new one in the update's merge and that an instance whose front page is its own keeps it; and that the page puts the private terms list in its first step, so an instance set up before this release that has no list registers one by that step's second block before its next publish. The handoff carries the same three points under its own heading.",
  "evidence": [
    "scripts/test-launchpad-export.mjs lines 158 to 163: the comment (changing this seed rewrites each unedited starter copy once; name that migration in the changing order's decisions and release's Read before upgrading) and the pin",
    "scripts/lib/starter-seeds.mjs, planStarterSeeds: a README.md equal to a proven prior seed is rewritten; one that is not is kept with 'customized; differs from proven prior exports', 'missing' or 'not a regular seed file'; README.md is never among the refused",
    "git -C ../DotLn-Enterprise-Starter show HEAD:README.md | shasum -a 256 at its head cd8ea69: 4b60b964df6168c2d9ddef3b806d051d9f3b0e2be5ea40dfef10760909ab9699, the base seed's own hash",
    "docs/KIT.md, Taking upstream updates: the root README.md is an instance seed outside the manifest and a kit update never replaces it; the refresh replaces an unedited seed README and keeps a customized, missing or non-regular one, reporting why in keptSeeds; a file only the starter changed flows in as Git merges it, and a file both sides changed keeps the instance's bytes",
    "scripts/launchpad.mjs line 304: docs/OPERATOR.md among the kit's files; the order's write-back duty",
    "The combined worker's and the consistency reviewer's round 1 reports (finding R1-02 of WO-277-D007)"
  ],
  "rejected": [
    {
      "option": "Write the release's notes now",
      "reason": "The notes are the final review's to write, after its own gate; a decision and the handoff carry what they must say."
    },
    {
      "option": "Leave the front page seed as it was and name the page only in the guide",
      "reason": "The order's objective begins at the front page, which named the page nowhere."
    }
  ],
  "reopenWhen": "The release close's refresh keeps the starter's front page instead of rewriting it, at which point the starter's page needs its own change; the final review words the notes otherwise."
}
```

## WO-277-D009 — Round 2 confirms every fix and admits nothing; the first critic's three points are accepted, and the case added under D004 comes out

```json
{
  "id": "WO-277-D009",
  "date": "2026-11-15",
  "dispatch": "resume: next; WO-277 the review ladder, round 2, and the first critic, 06:26 to 06:45 UTC on 2026-11-15",
  "decision": "Round 2. Each of the four round 1 reviewers had a finding fixed, so each was resumed at 06:26:04 UTC with the kit's round 2 brief, rendered by a dry run and read first, on the tree b16e21c516bed75c9af2ae0718a3ff5e2599eb6b against the same base. The helper words the combined worker's round 2 brief as the last round; it names the merge base and that worker's own findings, so it asks the same recheck. Returns: design at 06:28:59 UTC, criteria at 06:29:15, combined at 06:31:23 and consistency at 06:37:25. Every fix held: the pin, the migration's record, step 2's route, the release step's route, the route's follow-up, the wording of step 1 and the reworked case; the recorded findings were read as recorded. Three new findings were returned, none blocking and none admitted, since none breaks a criterion or a behavior main had; by the round's rule they are recorded and not fixed, and the handoff carries them. They are: the release step's route names the files both sides changed and the manifest and says nothing of a merge that stops on any other file, and an instance whose earlier update was squash-merged would restore over the starter's change where the guide says to take the file (design); the route's checkout cannot keep an instance's deletion of a file the preview lists as changed on both sides (criteria); and D008's line for the release notes says an instance with no list registers one by step 1's second block, without saying with its own entries, the gap round 1 fixed on the page (combined). Round 2 called for no fix, so no round 3 is owed and the ladder ends: eight worker uses of the cap of 20. The first critic. Launch 1 ran from 06:16:20 to 06:29:30 UTC on the worker astra, gpt-6-astra at max by the launcher's own line, on the copy of the transcripts D002 describes (15 files, 12,934,037 bytes, one address replaced in three places; the screen of the copy found no row in either class and no address). Its report, three criticisms, three things to keep and one first change, was given to the operator whole at 06:32:01 UTC, before the executor's answer in the same message. Each point is accepted. First: the order's release line says no code and its non-goals bar any change to the generator, the step table or a check. The executor added a case to the launchpad suite at 05:14:50 UTC on its own narrower reading of that non-goal, wrote D004 afterwards and did not put the conflict to the operator. D004's ground was also weaker than it says. The suite's existing cases hold the exported front page equal to the seed, the exported guide to the manifest's hash and the page printed in an export to this checkout's page, so criterion 3's three facts follow from those cases and this checkout's bytes; the added case guarded against a later regression and was not the criterion's evidence. The case is taken out and scripts/test-launchpad-seeds.mjs is at its base bytes again. The one change to a test that remains is the front page seed's pinned hash, an expected value the seed's change requires (D008). Criterion 3 rests on the existing cases of the launchpad and launchpad-docs rows and on docs/evidence/WO-277/export-fixture.json, the record the order's Evidence gate asks for, made with the suite's own fixture. The operator was told at 06:32:01 UTC that the case would come out after the rechecks unless told to keep it; no word came before it was removed at 06:38 UTC. The case's text is kept beside this file as withdrawn-case.txt for the follow-up below. Two dispositions of D007 lapse with the case: R1-11's rework, and the comment R1-05 put beside its assertion; D006's follow-up no longer names an assertion. From here, where a step presses against a non-goal the conflict is put to the operator in a message before the edit, and the decision is written before it. Second: D005 already records the gate started without a sync and its exit status lost in a pipe. The critic adds that an edit of this file at 05:19:52 UTC was refused because the sync suite's gate was live: a gate over machinery or documents admits no record write. Since then a gate starts only after npm run sync, prints its own exit status from a file, and has nothing planned for its run; decisions are written before it. Third: D005's evidence gave the roadmap writer's output as 05:26 and the index check as 05:27; the host's transcript has their results at 05:25:08 and 05:26:22, and both are corrected in D005. A message of 06:05:22 UTC gave the reviewers' launch as 06:07, an estimate written as a time and one that had not yet come; the journal has the four launches at 06:04:19. Every other time in D002, D005 and D007 was read against the host's transcript, the journal's task rows or the gate rows and stands. From here a time in a record or a message is a reading made for it. That reading turned up something the critic had not: messages the executor believed it had sent are not in the transcript (WO-277-D010).",
  "evidence": [
    "The four round 2 reports in the ignored reviews lane, since-2eb510c741e5/round-2-design.md, round-2-criteria.md, round-2-combined.md and round-2-consistency.md, each recorded against its dry run's brief digest and the reviewed tree with the report it rechecked: 'design round 2 found 1 (0 blocking)', 'criteria round 2 found 1 (0 blocking)', 'combined round 2 found 1 (0 blocking)', 'consistency round 2 found 0 (0 blocking)'",
    "Session scratch, ladder/dry-criteria-2.json, dry-design-2.json, dry-consistency-2.json and dry-combined-2.json: round 2, the base named with --since, reviewed tree b16e21c516bed75c9af2ae0718a3ff5e2599eb6b; the combined brief's Round section, which opens as the last round and names the merge base",
    "node scripts/harness.mjs usage for this session at 06:37:54 UTC: workers launched 4 (claude 4, codex 0), re-tasked 4, cap 20, remaining 12",
    "The critic's report in the ignored reviews lane, critic-1.md (3,265 bytes); the launcher's output: 'critic 1: gpt-6-astra at max; 13 min', launcher exit 0; session scratch, critic/copy-transcripts.mjs and its counts, and the screen of the copy at 06:15 UTC: files 15, rows 9,034, refuseRows 0, contextRows 0, rows holding a mail address 0; codex sandbox on the copy: the size printed, the write refused",
    "The host's transcript of this session, read by script for times only: the first edit of scripts/test-launchpad-seeds.mjs at 05:14:50.342 UTC and the first writing of D004 at 05:19:52.627; the roadmap writer's result at 05:25:08.237 and the index check's at 05:26:22.329; the message giving 06:07 at 06:05:22.974; the round 2 sends at 06:26:04.062; the critic's report given at 06:32:01.989",
    "scripts/test-launchpad-export.mjs, the document case lines 113 to 170 (the exported front page equals the kit's seed, the exported guide's hash is the manifest's); scripts/test-launchpad-seeds.mjs at the base, the case for WO-275 criteria 3 and 4 (the page printed in a bare export equals the kit's page, which equals the source's)",
    "git diff --exit-code b8591a7307703d2cd454e51ac0c0557dc10d48d0 -- scripts/test-launchpad-seeds.mjs after the removal: no difference; docs/evidence/WO-277/withdrawn-case.txt, 49 lines",
    "docs/evidence/WO-276/critic/README.md, the rules that made the critic useful (the report whole before the answer; each point answered on its own)"
  ],
  "reopens": {
    "decisionId": "WO-277-D004",
    "observation": "The first critic's first point, 06:29 UTC on 2026-11-15: the added case was a change the order's non-goals bar, made on the executor's own reading and recorded after the edit; and the suite's existing cases already carry criterion 3 by equality."
  },
  "rejected": [
    {
      "option": "Keep the case and ask the operator to rule on the non-goal afterwards",
      "reason": "The boundary is the operator's and was written before the work; staying inside it costs a regression guard that a follow-up can restore, while keeping the case would have put an unasked change through the complete run and made its removal a second run."
    },
    {
      "option": "Fix the three new findings of round 2",
      "reason": "The round's rule records a new finding that breaks no criterion and no behavior main had; a fix would reopen the ladder the rule exists to end. The handoff carries each, and its section for the release's notes words the terms list's line with the person's own entries."
    },
    {
      "option": "Decline the critic's first point because four reviewers raised no objection to the case",
      "reason": "The reviewers judged the change; whether the executor may widen an order on its own reading is a question of conduct, which is the critic's subject, and the reading was not the only one the words bear."
    }
  ],
  "followup": "Planning: the commands page has no regression case of its own. Nothing fails when a later edit drops the terms list's block from step 1, the page's link from the first paragraph of the front page or of the guide, or WO-001 from the first planning pass's step, because the suite's cases hold an export equal to the checkout and not the checkout to those facts. WO-277's executor wrote such a case and took it out, since the order's non-goals bar a change to a check; its text is docs/evidence/WO-277/withdrawn-case.txt. Give the case to the order that next changes the page, WO-281 by placement, or say that the non-goal was not meant to bar it. Check: the case fails on a tree without the block or without either link. Priority: with WO-281.",
  "reopenWhen": "The operator says the case should have stayed, or that it should not be written at all; the verifier or the final review finds a fix that the rechecks confirmed wrong."
}
```

## WO-277-D010 — Correction: messages the executor wrote to the operator between tool calls are not in the host's transcript, the notice of the account's address among them

```json
{
  "id": "WO-277-D010",
  "date": "2026-11-15",
  "kind": "correction",
  "dispatch": "resume: next; WO-277, found at 06:39 UTC on 2026-11-15 while the critic's third point was being checked against the host's transcript",
  "misread": "The executor took every line it wrote to the operator as delivered. It recorded in D002 that the operator had been told at 05:09 UTC that this session's transcript holds the account's mail address, that the critic would read a copy with the address replaced, and that either of two words would change that; and in D005 that the follow-up queue's one item had been announced as an intent in chat before it ran. Neither message is in the host's transcript.",
  "meant": "The operator is told what the executor decides on the operator's behalf, above all where a mail address and another provider are concerned, and an announcement of intent is one the operator can have read. A line the host does not hold cannot be counted as either.",
  "changed": "D002 and D005 now say what the transcript shows. The operator is told in a closing message, where the transcript does hold the executor's words: that the address is in the transcript in two rows the host wrote, that the first critic read a copy with it replaced, the choice for any later launch, and the other things below. From 06:40 UTC a line written between tool calls is kept under 180 characters and anything longer goes in the message that closes a turn; the first short line after the finding, at 06:40:24 UTC, is in the transcript.",
  "decision": "What the transcript holds, read at 06:39 UTC: 23 assistant texts for this session. The ones written between tool calls are all short, 100 to 188 characters, and the long ones are all the closing message of a turn. Every longer line the executor wrote between tool calls is absent. The response of 05:09:15 UTC, in which the executor wrote the address notice, holds two thinking parts and three tool calls and no text. An inference, from those lengths alone: the host keeps a line written between tool calls only when it is short, somewhere under 200 characters; whether the operator's screen showed the longer ones the executor cannot tell, and the record is what it can check. Not held, and so treated as not said, each with the time the executor wrote it: its reading of the operator's request for the critic and how the cadence would run (05:04 to 05:09); the address notice with the two other courses (05:09); the account of the first failed gate (05:17), which a closing message gave at 06:05; the diagnosis of main's failing case and the announcement of the queue's repair before it ran (05:24), which short lines gave after the fact at 05:26 and the closing message at 06:05; the announcements before release preparation, the guide's edits, the step checks and the reviewers' dry runs; the announcement that the first critic would read the copy (06:16); the notices that round 1 was in and judged (06:19 and 06:20) and that round 2 was sent (06:26), which the closing messages of 06:18 and 06:26 cover in part; and the notice that round 2 was complete and the case was coming out (06:38), which the message of 06:32 had said would happen. What the operator did have: a short line at 05:08:58 saying one of the critic's checks needed attention, which did not say what; the closing message of 06:05:22, which named a redacted transcript copy without saying why; and the critic's report with the executor's answers at 06:32:01. The executor's choice at 05:09 stands on its own ground, since replacing the address sends less to the other provider and not more, but it was made without the operator knowing there was a choice.",
  "evidence": [
    "The host's transcript of this session, read by script for times, lengths and opening words only: 23 assistant text parts at 06:39 UTC; the lengths of those written between tool calls (100, 120, 130, 132, 141, 150, 152, 158, 159, 164, 169, 170, 178, 182, 187, 188) and of the closing messages (134, 229, 700, 995, 1,760, 2,021, 5,834)",
    "The same transcript, the rows of 05:08:58 to 05:09:27 UTC: a text of 141 characters and the timer's call; then, at 05:09:15, two thinking parts and three tool calls with no text",
    "Searches of the transcript for phrases of eleven messages the executor wrote between tool calls: none found as assistant text; a line of 144 characters written at 06:40:24 UTC to test this, found",
    "WO-277-D002 and WO-277-D005 as first written, and the follow-up queue's announcement and check-in events (revisions 2 and 3), whose observation source is the executor's own attestation"
  ],
  "rejected": [
    {
      "option": "Treat the lines as shown on the operator's screen and correct nothing",
      "reason": "Nothing the executor can read shows it, the transcript is the record a critic, a verifier and the operator's own later reading have, and a claim of having told someone needs evidence."
    },
    {
      "option": "End a turn for every notice",
      "reason": "A short line is held, and a turn ended while work is owed stops the work; long accounts go in the closing message of a turn that ends for its own reason, such as a gate's run."
    }
  ],
  "followup": "Planning: under Claude Code 2.1.325, the version the session's hook observed, a line an executor writes to the operator between tool calls is in the session's transcript only when it is short (every held one is 188 characters or fewer; every longer one written in WO-277's execution is absent), so an announcement of intent, a notice or an answer written at length in mid-turn leaves no record and may not have been seen. The role text asks for announcements before each action and for reports given whole, and nothing tells a session this limit or checks that a line was held. Establish what the host does with such a line (the kit's own reader of transcripts can count it), say in the role text how long a mid-turn line may be, and consider a check at handoff of the announcements a queue records against the transcript. Priority: before the next order whose operator steers by mid-turn messages.",
  "reopenWhen": "The host is shown to display the longer lines to the operator, at which point the record is corrected again to say they were shown and not kept; the operator says how they want to be told."
}
```

## WO-277-D011

```json
{
  "id": "WO-277-D011",
  "date": "2026-11-15",
  "dispatch": "resume: verify; output screening correction",
  "kind": "correction",
  "misread": "The initial canonical status and several multi-file read batches were treated as small enough to emit whole. Their tool results were truncated.",
  "meant": "Select the active order and verdict-relevant source fields before emission, budget the whole batch, and read all evidence needed for a claim. A truncated read does not establish absence.",
  "changed": "Re-read the selected canonical status, the complete generated page and source diff, the relevant decision fields, cited sections and the eight execution review reports. Subsequent large reads were retained before emitting selected sections. The report relies on those reads and executed probes, not on missing text in truncated output.",
  "decision": "Record the read-output failure and its correction here; retain the implementation and continue the authorized verification.",
  "evidence": [
    "The first status command returned 2639 lines and a truncation warning; the selected status read returned WO-277, ready-to-verify, and verify as its legal action.",
    "The current page, source diff and review reports were reread before the independent probes recorded in verifier-001/checks.json."
  ],
  "rejected": [
    {
      "option": "Treat the truncated result as a complete review",
      "reason": "A missing part could contain contrary evidence."
    }
  ],
  "reopenWhen": "A claim depends on a source section that has not been read, or another emitted batch is truncated."
}
```

## WO-277-D012

```json
{
  "id": "WO-277-D012",
  "date": "2026-11-15",
  "dispatch": "resume: verify; independent judgment and deferred update recovery",
  "decision": "Consume the executor complete review row at the unchanged code identity, and independently exercise the export without installed dependencies, from a directory containing spaces and a nested working directory, plus the terms setup and seed pin. Keep the implementation unchanged. The deleted-file recovery note from criteria round two is reproduced: changedOnBothSides lists a path deleted by the instance and changed by the starter, but the page checkout command fails and leaves the conflict unresolved. It is a follow-up under the verification rule: criterion 2 requires the printed paragraphs and named manifest command and assigns their service to a person to final review; no runtime or pre-existing command was changed. The final reviewer retains that reading and the release-note write-back. The draft verification can be filed only after its document gate passes.",
  "evidence": [
    "verifier-001/gate-rows.json: complete passing review coverage at the current code identity, with no advisory.",
    "verifier-001/export-results.json and checks.json: independent export, terms setup, generator, pinned seed and formatting checks.",
    "verifier-001/deleted-file-results.json: preview input classified as both changed, documented checkout exit 1, conflict retained; git rm resolves while preserving the deletion.",
    "docs/control/local/reviews/WO-277/since-2eb510c741e5/round-2-criteria.md: the same deleted-path note; D009 retained it without a dedicated structured follow-up.",
    "docs/product/07-execution-guide.md, Verification review and attack: a finding outside the criteria that breaks no behavior main had is a follow-up."
  ],
  "rejected": [
    {
      "option": "Repeat the entire product gate",
      "reason": "The canonical claim reader confirms unchanged identity and complete review coverage; targeted probes add independent observations without repeating the recorded 0 h 38 min run."
    },
    {
      "option": "Repair the page while verifying it",
      "reason": "The verifier writes evidence and its report; the implementation is read-only in this phase."
    },
    {
      "option": "Fail on the recovery note alone",
      "reason": "No declared measurable criterion or reproduced regression is unmet; the human reading is assigned to final review."
    },
    {
      "option": "No action on the note",
      "reason": "It is reproducible and needs a named follow-up beyond a review sentence."
    }
  ],
  "followup": "Planning: make the commands page update recovery preserve a deleted instance file as well as an existing one. In docs/KIT.md take-release and the generated docs/OPERATOR.md, branch the recovery by whether main holds the file; keep a deletion with git rm instead of checkout. Coordinate with WO-281 and WO-282 so the page and preview share one rule. Check a supported modify/delete merge whose path changedOnBothSides lists: the instructions resolve it while keeping the instance deletion. Priority: with the next update-guidance change; reproduction is verifier-001/deleted-file-probe.mjs and its result.",
  "reopenWhen": "Final review finds the paragraph unacceptable under criterion 2, an instance encounters this recovery case, or a later update changes the preview or publish rules."
}
```

## WO-277-D013

```json
{
  "id": "WO-277-D013",
  "date": "2026-11-15",
  "dispatch": "resume: verify; current document-gate failure",
  "kind": "correction",
  "misread": "The unfiled report provisionally marked criterion 4 met from the passing product row and the executor document run, before this verification had checked the current document tree.",
  "meant": "The current document tree includes the status capture written after the executor document run. That capture must satisfy the document rules too; a passing code identity alone cannot establish it.",
  "changed": "The current npm run test:docs exits 1 on docs/evidence/WO-277/status.json lines 13 and 14. The report is corrected in place to fail, criterion 4 unmet, with blocking finding F2. The status capture is preserved for the executor to repair; no subject bytes are edited to make verification green.",
  "decision": "File the negative verification after validating the final report documents as far as this role permits. The previous decision condition about filing only after a passing document gate applies to a passing verdict, not to recording a reproduced subject failure. Criteria 1 to 3 retain their independent passing evidence; F1 remains a follow-up.",
  "evidence": [
    "verifier-001/document-gates.json: executed document gate at the subject identity, exit 1; two absolute-home-path failures.",
    "docs/evidence/WO-277/status.json: route.cwd and route.launchpad are absolute home paths at lines 13 and 14; recordedAt is 2026-11-15T07:33:30.130Z, after the executor document row at 07:32:39 UTC.",
    "docs/product/07-execution-guide.md, Verification review and attack: a reproduced unmet criterion blocks; the verifier writes evidence and its report, never the implementation it judges."
  ],
  "rejected": [
    {
      "option": "Normalize the executor capture in this verification",
      "reason": "That changes the subject to turn this verdict green; the verifier is read-only for the implementation."
    },
    {
      "option": "Reuse the earlier document pass as if it covered the later capture",
      "reason": "The current executed gate directly contradicts that claim."
    }
  ],
  "reopenWhen": "The executor supplies a normalized public status capture preserving the lifecycle facts, and the current document gate passes."
}
```

## WO-277-D014 — The repair of VER-001: the status capture names its locations by the kit's placeholder, and every line this order writes is read for a home directory

```json
{
  "id": "WO-277-D014",
  "date": "2026-11-15",
  "dispatch": "resume: fix; the repair of VER-001's blocking finding F2, criterion 4",
  "decision": "The status capture's two location fields, route.cwd and route.launchpad, held this worktree's absolute home path, which the document gate refuses in a record. Both now read <worktree>, the placeholder the kit's own screens write for the worktree root. No other byte of the capture changed: it is still the readback of npm run resume -- status --json recorded after implementation-ready at 07:33:30 UTC, phase ready-to-verify, next action verify, checkpoint 2. The capture as the executor wrote it stays in the local recovery refs refs/dotln/checkpoint/WO-277/3 to 5, which nothing publishes. The rule the repaired evidence holds: no line this order writes names a place on this machine by its home directory, and a location in a record reads <worktree>, <worktree>/<path> or <home>/<path>. The class is wider than the two quoted lines in two ways, and the repair's probe reads both. First, the gate's record rule reads Markdown and .json, .jsonl, .log and .txt files, so a home path in a script beside the evidence, such as the executor's and the verifier's .mjs probes, is not refused. Second, a record written into the order's own evidence directory after the document gate's run is not judged by that run, and that is how this capture escaped: it was written after the 07:32:39 UTC document row, because the order's Evidence gate asks for a capture after implementation-ready. repair-001/home-paths.mjs reads every line this order adds, as many as home-paths.json records for its last run, which follows this order's last edit: with the gate's own rule for the file's type, then with the home-directory pattern whatever the type, then for this account's name standing alone. It also holds the capture equal to the original except for the two fields. Lines the order did not write are not judged. The probe's first run flagged line 1191 of docs/lineage/decisions-index.md, a generated row main already holds (WO-158-D010's host-scratchpad template), which the gate admits. Finally, the closing steps change order: every record of this repair is written before its document gate's run, and nothing is written into this directory after it, so that row judges every record the order commits.",
  "evidence": [
    "VER-001 F2 and verifier-001/document-gates.json: npm run test:docs exits 1 with two failures, docs/evidence/WO-277/status.json lines 13 and 14, absolute home path in a record.",
    "scripts/lib/private-paths.mjs: RECORD_EXTENSIONS and privatePathRule (a record reads the home-directory pattern, Markdown the private-path pattern, any other file none); scripts/test-docs-check.mjs, 'records reject new home-path lines by type, root and counted fingerprint without revealing them', in which a probe.mjs holding a home path in the evidence root is no failure.",
    "scripts/lib/entropy-review.mjs, screenWorkerText: the worktree root is written <worktree>, the temporary root <tmp> and a remaining home directory <home>.",
    "docs/control/orders/WO-277.jsonl: ImplementationReady at 07:33:30.130Z and VerificationRequested at checkpoint 3; the handoff's gate table puts the document row at 07:32:39 UTC.",
    "git show refs/dotln/checkpoint/WO-277/3:docs/evidence/WO-277/status.json hashes to 65f8767eb80f7bac49bb370d102ec20038f07cc8a93247e43bc7ffc4b3db251e, the hash VER-001 names, as do checkpoints 4 and 5; the repaired capture hashes to 2183d393739f8b68e69e66154bbcbaac2e3d65275df9596bd06ac40dd190dc31.",
    "repair-001/home-paths.json, from the probe's last run after this order's last edit: the files and lines this order writes, with no line under the gate's rule, none under the home-directory pattern in any type and none holding the account's name; the original capture's lines 13 and 14 match the pattern and the repaired capture has none; every other field equal."
  ],
  "rejected": [
    {
      "option": "Capture npm run resume -- status --json again after repair-complete",
      "reason": "It would be a write after completion, which the role's last step forbids, and it would again be written after the document gate's run, the escape itself."
    },
    {
      "option": "Replace only the home directory, leaving <home>/ and the folders under it",
      "reason": "The folder names tell a reader nothing they need, and the kit writes the worktree root as <worktree>."
    },
    {
      "option": "Admit the two lines as historical exceptions in the gate's baseline",
      "reason": "That would commit the account's name in a record this order publishes."
    },
    {
      "option": "Remove the capture",
      "reason": "The order's Evidence gate asks for it, and its lifecycle facts are the record of the handoff."
    },
    {
      "option": "Make the completion or the gate read these lines itself",
      "reason": "That is a change to a check, which the order's non-goals bar; the follow-up names it."
    }
  ],
  "followup": "Planning: two ways a home path reaches a committed record without the document gate refusing it. First, completion consumes a document row that stands after later writes inside the order's own evidence directory, so a record written there after the gate is first screened by the next phase's gate, as this order's status capture was by VER-001. Orders ask for exactly such a record: WO-276's and WO-277's Evidence gates name npm run resume -- status --json after implementation-ready, whose route.cwd and route.launchpad hold the worktree's absolute path. Consider having implementation-ready and repair-complete read the order's own evidence directory with the gate's private-path rule (scripts/lib/private-paths.mjs), which runs no gate, and giving the status readback a public form for evidence. Second, the gate's record rule reads no script, so a probe in an evidence directory that holds a home path is committed unscreened (scripts/test-docs-check.mjs keeps a probe.mjs out of the record rule); consider reading the home-directory pattern there too. Check: a record with a home path written after the gate is refused at completion, naming the file and line and never the path; a probe with one fails the gate. Priority: before the next order whose Evidence gate names a status capture.",
  "reopenWhen": "The document gate refuses a line this order writes; a reader needs the capture's original locations, which are only in the local checkpoint refs; or a later check reads what the probe reads, which makes the probe redundant."
}
```

## WO-277-D015 — VER-001's F1 is repaired here: a file this instance deleted is kept deleted with git rm, read against the publish's own judgment

```json
{
  "id": "WO-277-D015",
  "date": "2026-11-15",
  "dispatch": "resume: fix; adjacent repair of VER-001's follow-up finding F1, queue item adjacent-0002",
  "decision": "F1, the release step's recovery that cannot keep a file this instance deleted, is repaired in this repair rather than left to its planning follow-up. The page this order ships is the one a person follows on the work laptop. The order asks each step to say what to do when a command fails, and the checkout's failure on a deleted file is such a failure. The take-release marker sentence in docs/KIT.md now reads: for each both-changed file, run git checkout main -- <path> to keep this instance's bytes; where that checkout says the path did not match any file known to Git, this instance deleted the file, so run git rm <path> to keep it deleted. The one long sentence became three so that each recovery reads on its own. The harness manifest's route and every other clause are unchanged, and the page was regenerated by its own command. The recovery was checked against the publish's own judgment, not only against Git: pathStates in scripts/launchpad.mjs gives an absent path the state null on each side, so a merge commit without the file holds the instance's state, and git rm leaves the publish nothing to refuse. repair-001/deleted-file-recovery.mjs follows the paragraph in a synthetic history with three both-changed files. The instance edited one (the merge stops on it), deleted one (the merge stops on it), and edited the third in a different line from the starter (the merge takes it in silence). The checkout keeps the first and the third; the checkout of the second fails with Git's no-match error, and git rm resolves it. Nothing stays unmerged, and instanceChangesNotKept finds no file the merge failed to keep. The same merge with the deleted file left at the starter's bytes is found not kept, so the judgment tells the two resolutions apart. The verifier's reproduction ran the checkout and git rm by hand. The publish's judgment and the silent merge are the cases it did not quote. What D012's follow-up asks beyond the page, that the preview and the page share one rule, stays with it: the preview still lists a deleted file as both changed, which the page now answers, and whether the preview should name such a file apart is for the update work (WO-282) to weigh.",
  "evidence": [
    "VER-001 F1 and verifier-001/deleted-file-results.json: the page's checkout exits 1 with a pathspec error on a both-changed file the instance deleted, and the conflict stays.",
    "scripts/launchpad.mjs: changedOnBothSides lists such a file with the instance state null; pathStates gives an absent path null; instanceChangesNotKept compares the merge commit's state of each both-changed file with the instance's.",
    "repair-001/deleted-file-recovery.json, recorded 15:15:22 UTC: both changed deleted.md, edited.md and silent.md; the merge stops on deleted.md and edited.md; deleted.md's checkout exits 1 with the no-match error and git rm exits 0; nothing unmerged; publish judgment not kept: none; the counter-case, deleted.md at the starter's bytes: not kept deleted.md.",
    "repair-001/export-fixture.json, recorded 15:15:33 UTC: the export prints the page this checkout holds, 8,973 bytes, SHA-256 874635cc92db6456869a883d2117cd64781499d881a281002a7ca54f3f3c702c, its release paragraph naming both recoveries and the manifest's route; repair-001/export-commands.txt is that page.",
    "node scripts/lib/operator-commands.mjs --check: docs/OPERATOR.md is current; a search of scripts/test-*.mjs finds no case that pins the release paragraph's words.",
    "docs/work-orders/WO-282-an-update-leaves-nothing-to-repair-by-hand.md, Objective: the preview's account of a conflicted merge is that order's."
  ],
  "rejected": [
    {
      "option": "Leave it to FUP-3285bd4a53c4c3e9",
      "reason": "The page reaches the work laptop at this order's release close, and a person who meets the case is left with Git's error and an unresolved merge. The fix is one clause inside the order's own deliverable, with a reproduction in hand."
    },
    {
      "option": "A fenced block of its own for git rm",
      "reason": "The page prints a step's blocks in the guide's order, so a recovery between the merge and the emit would print after the block it interrupts, D006's reason for the manifest's route."
    },
    {
      "option": "Tell the person to ask Git first whether main holds the file",
      "reason": "One more command to type, where the checkout's own error says the same thing at the moment it matters."
    },
    {
      "option": "Have the preview name a deleted file apart",
      "reason": "That is the update's code, a non-goal of this order and WO-282's subject."
    }
  ],
  "reopens": {
    "decisionId": "WO-277-D012",
    "observation": "WO-277's repair changed the release step's paragraph as D012's follow-up asks of the page: a both-changed file that main does not hold is kept deleted with git rm <path>. repair-001/deleted-file-recovery.json shows the modify/delete conflict resolved with the deletion kept and the publish's judgment finding no file not kept. What remains of the follow-up is the preview's side: whether its both-changed rows name a file this instance deleted apart."
  },
  "reopenWhen": "Final review finds the paragraph unacceptable under criterion 2; the preview comes to name a deleted file apart, when the paragraph should follow its words; or Git words its no-match error otherwise."
}
```

## WO-277-D016 — Correction: F1's queue item was recorded after its edit

```json
{
  "id": "WO-277-D016",
  "date": "2026-11-15",
  "dispatch": "resume: fix; the follow-up queue for D015",
  "kind": "correction",
  "misread": "The equipped follow-up queue asks that a diagnosed adjacent fix be queued, announced, checked in and started before its work. F1's fix was announced in chat before the edit, in the repair's plan and as a line that it would be fixed as a bounded adjacent repair, but the edit of docs/KIT.md, the page's regeneration and the first runs of the two probes came before the item was queued.",
  "meant": "Queue the item, announce it with an 'I intend to' line, check in and start it, and only then do the work and run its checks.",
  "changed": "The item was queued afterwards as adjacent-0002, announced in chat and in the queue with an 'I intend to' line, checked in and started, and its three checks were run again after the start, so the completion's results postdate the start. The work itself is unchanged.",
  "decision": "Record the order of events as it happened. The queue's announcement and check-in are actor-attested; the chat lines are the session's own.",
  "evidence": [
    "npm run adjacent -- list: adjacent-0002 queued at revision 6, announced at 7, checked in at 8, started at 9 and completed at 10.",
    "The bounded wrapper's rows: the probes' first runs started at 15:12:19 and 15:12:30 UTC, before the queue; their results were replaced by the reruns recorded at 15:15:22 and 15:15:33 UTC, after the start."
  ],
  "rejected": [
    {
      "option": "Queue it with no note",
      "reason": "The queue's order would read as if the work followed the start."
    }
  ],
  "reopenWhen": "A reader of the queue needs the times of the first edit, which are those of the files and the probes' first results, not the queue's."
}
```

## WO-277-D017 — The repair's one combined review: no blocking finding; D014's stale count is corrected, and a renamed file is recorded with a follow-up

```json
{
  "id": "WO-277-D017",
  "date": "2026-11-15",
  "dispatch": "resume: fix; the repair's one combined review, 15:22 to 15:36 UTC",
  "decision": "A fix dispatch runs one combined review over the repair's change and no other round. One fresh dotln-worker of the worker table's default for Claude was launched at 15:22:43 UTC. Its brief was the helper's combined brief as its dry run printed it: base 848c8f4a37b9, the tree VER-001's completion records; reviewed tree d624754891f8; brief SHA-256 b416194a08e5f678ecc0b45d513db26b73b225d03b6bdbb924d0450705c51fc7. After the brief, the parent added three notes: the report the repair answers, that the repair's probes write beside themselves and are not to be run in the checkout, and the helper's result object as the form of the return. The worker returned after 13 min 54 s with no blocking finding, one should-fix and two notes. It had run its probes in a temporary clone and started no gate. Each finding is judged here. R3-01, should-fix: D014 gave the home-path probe's count of lines as 5,367, the count of a run whose result the next run replaced; home-paths.json then recorded 5,529, and the generated index repeated the stale figure. The writer is this executor's decision text. The failure is open, since a record stated a number its own evidence contradicts, and the fix is a change of words. D014 is unfiled, so it is corrected in place to cite the probe's last run instead of a number, and the index and the follow-up register are regenerated from it. The round's rule records a late new finding instead of fixing it; this one is fixed because it is a wrong statement of fact in an unfiled record, which is corrected where it stands, and the fix touches documentation alone, which owes no further round. R3-02, note: a file this instance renamed and the starter then changed. The executor reproduced it in session scratch before judging it, then recorded it as repair-001/rename-note.mjs and rename-note.json. The preview lists the old path as changed on both sides. The merge finishes on its own and carries the starter's change into the renamed file. The page's checkout of the old path says no match, and the git rm the page then gives says no match too. The publish's judgment finds nothing not kept. The writer is an instance's ordinary rename. For the old path the outcome is the one wanted, so what the page adds is a second unexplained error, not a wrong state. It breaks no acceptance criterion and no behavior main had: main's page gave no recovery for that path at all. It is recorded, not fixed, under the round's rule, with the follow-up below. The reproduction also shows the deeper gap the reviewer names, in the update's code, which is a non-goal of this order: the renamed file holds the starter's change merged with this instance's. R3-03, note: the handoff still described the page as it was before the repair. That is the repair's handoff step, written after the selected runs and citing the repair's evidence; recorded here and answered there.",
  "evidence": [
    "The worker's returned result, recorded in the ignored reviews lane under repair-1 as the combined report of the helper's round 3: reviewed tree d624754891f8c497adddf32641d399d35e496c14; findings R3-01 (should-fix), R3-02 and R3-03 (notes); its Traced consumers table; its scope, 37 files read.",
    "The host's transcript of the worker names claude-opus-5-5 on each of its 209 messages; the effort xhigh is the generated definition's and was not read back. The host's task notice: 13 min 54 s, 187,809 tokens, 78 tool uses.",
    "repair-001/rename-note.json, recorded 15:39:06 UTC: both changed guide.md; merge exit 0; the old path's checkout exit 1 and git rm exit 128, each saying it matched nothing; the old path absent at the merge commit; publish judgment not kept: none; the renamed file holds the starter's change and the instance's, so not the instance's bytes.",
    "repair-001/home-paths.json before the correction: linesRead 5529; D014 as reviewed: 5,367."
  ],
  "rejected": [
    {
      "option": "Add the rename case to the page's paragraph now",
      "reason": "It would be a change to the page after the repair's one review, unreviewed. It would also answer only the second error while the renamed file's merged bytes, the larger gap, stay in the update's code."
    },
    {
      "option": "Tell the person to use git rm --ignore-unmatch",
      "reason": "As the reviewer notes, with an unquoted path holding a space it removes whatever part matches, where plain git rm refuses and removes nothing."
    },
    {
      "option": "Leave D014's count as reviewed and record the finding",
      "reason": "A record would state a number its own evidence contradicts."
    }
  ],
  "followup": "Planning: a file this instance renamed and the starter then changed. The preview and the publish read the files both sides changed with --no-renames (changedOnBothSides in scripts/launchpad.mjs), so the preview lists the old path; the merge carries the starter's change into the renamed file in silence; and the publish's judgment finds nothing not kept, while the renamed file holds the starter's change merged with this instance's. The guide promises that an update keeps this instance's bytes for a file both sides changed, and by content this file is one, yet neither reading sees it. On the commands page, the release step's recovery then meets two no-match errors, the checkout's and git rm's, where nothing is left to do for the old path. Decide whether the preview and the publish follow renames (the update's code, WO-282's subject, or a planning pass), and have the page say what a no-match from git rm means. Reproduction: docs/evidence/WO-277/repair-001/rename-note.mjs and its result. Check: in that history the preview names the renamed file, the publish refuses the merge until the renamed file holds this instance's bytes or is taken, and the page's recovery ends without an unexplained error. Priority: with WO-282.",
  "reopenWhen": "Final review finds the page's recovery unacceptable for a renamed file under criterion 2, or an instance meets the rename case before the follow-up is taken up."
}
```

## WO-277-D018 — The repair's complete run reused the suites that read the page, so it is run again in full

```json
{
  "id": "WO-277-D018",
  "date": "2026-11-15",
  "dispatch": "resume: fix; the repair's complete run",
  "decision": "The repair's complete run, npm test -- --review from 15:42 UTC, passed in 1 min with 7 fresh tasks. The runner reused 110 tasks from the implementation's passing row of 07:26 UTC at the same code identity, among them the launchpad suite's three files, sync-fixtures, launchpad-planning and process-debt. The code identity leaves out every path under docs/, and the repair changed docs/KIT.md and docs/OPERATOR.md and nothing outside docs/, so the identity stayed 274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e and the reuse rule asks no more. But the launchpad suite declares docs/KIT.md and docs/OPERATOR.md among its sources, and the runner's own schedule named it changed since the last gate row. Its export and seed cases, and the sync suite's case for the page, read those files, so a pass carried from a run before the page changed says nothing about the page as it now stands. The complete run is therefore run again with --again, which the runner provides to run the selection instead of reusing a covering row, and with --keep-going, so that one run names every suite that fails. Its row is the one criterion 4 cites. The reuse itself is the harness's, and changing it would be a change to a check, which this order's non-goals bar; the follow-up names it.",
  "evidence": [
    "The run's output, kept in session scratch: the schedule line names launchpad, launchpad-planning, process-debt, registrations and sync-fixtures as changed since the last gate row; REUSE lines carry launchpad's test-launchpad-update.mjs, test-launchpad-export.mjs and test-launchpad-seeds.mjs, sync-fixtures, process-debt and launchpad-planning from the worktree row 2026-11-15T07:26:05.641Z; its summary reads 42 passed, 0 failed, 0 h 1 min, 7 fresh tasks. The gate row: npm test, 71,942 ms, recorded 15:43:45 UTC.",
    "scripts/test-runner.mjs: the launchpad suite's sources list docs/KIT.md and docs/OPERATOR.md; plain and review selections compose the latest passing task executions at the code identity (coveringTaskResults) unless --again or --fresh is given.",
    "packages/skeleton/src/gate-evidence.mjs, gateCodeIdentity: paths under docs/, except docs/control/outward-vocabulary.json, and under .claude/ and .agents/, and Markdown at the root, are outside the identity.",
    "scripts/test-sync.mjs reads the checkout's docs/OPERATOR.md and docs/KIT.md in the case for WO-275 criterion 3; scripts/test-launchpad-seeds.mjs holds the export's page equal to the source's."
  ],
  "rejected": [
    {
      "option": "Cite the reused row for criterion 4",
      "reason": "The harness admits it, but the suites that read the page never ran on the repaired page. Where main does not move, the final review consumes a complete row at the same identity and runs none, so nothing would run them before the release."
    },
    {
      "option": "Run the cases that read the page one at a time under the bounded wrapper",
      "reason": "It would be faster, but a search of the tests for the two paths would choose the cases, where the complete run is the criterion's own and runs whatever reads them."
    }
  ],
  "followup": "Planning: the runner reuses a suite's passing tasks at the same code identity even when the suite declares among its sources documents that changed since that row. The launchpad suite lists docs/KIT.md and docs/OPERATOR.md, and the schedule line names the suite changed since the last gate row, yet it is reused, because the code identity leaves docs/ out. A change to the guide or the page after a complete run is then never run through the export and seed cases before release, since where main does not move the final review consumes a row at the same identity. Consider keying reuse on each suite's declared sources as well as the identity, or running a suite whose declared document sources changed. Check: change docs/OPERATOR.md after a passing complete run; the next complete run runs the launchpad suite. Priority: before the next order that changes the guide or the page after its first complete run.",
  "reopenWhen": "The fresh run fails, or the runner comes to judge declared document sources in its reuse."
}
```

## WO-277-D019 — The fresh complete run failed one suite on its deadline under the host's load; the row is composed again with that file run on its own

```json
{
  "id": "WO-277-D019",
  "date": "2026-11-15",
  "dispatch": "resume: fix; the repair's fresh complete run",
  "decision": "The fresh complete run, npm test -- --review --again --keep-going, ran all 117 tasks from 15:48:54 to 16:35:26 UTC and failed one. target-worktree:file:test-target-worktree-close.mjs timed out at its 15 min deadline while running the case for WO-276 criterion M2, after the cases before it had passed. Every suite that reads the guide or the page passed on the repaired page: the launchpad suite's three files, sync-fixtures, launchpad-planning and process-debt. The timeout is the host's load, not this repair. The close file declares as its sources only scripts/test-target-worktree-* and scripts/lib/target-worktree-fixture.mjs, and it reads neither docs/KIT.md nor docs/OPERATOR.md. The code identity is the one at which it passed in the 07:26 UTC run, where it took 720 s of its 900 s. In this run every task measured beside it was slower: in its group, start 242 to 304 s, release 150 to 199 s and publish 386 to 505 s; elsewhere, sync-fixtures 328 to 428 s and license-fixtures 18 to 87 s. At 720 s, a close file a quarter slower runs past 900 s. Nothing in this order is to repair. The row is composed again with npm test -- --review --keep-going and no --again. The runner carries each task whose latest execution at this identity passed, which for every task but the close file is its fresh execution of 16:35 on the repaired page, and it runs the close file, whose latest execution failed, again. That row is the one criterion 4 cites. The close file's margin is the follow-up.",
  "evidence": [
    "The fresh run's output, kept in session scratch: FAIL target-worktree:file:test-target-worktree-close.mjs 0 h 15 min and the suite timed out after 0 h 15 min, the last case entered being WO-276 criterion M2; its summary, 41 passed, 1 failed, 0 h 47 min, 117 fresh tasks; PASS lines for test-launchpad-export.mjs, test-launchpad-seeds.mjs, test-launchpad-update.mjs, sync-fixtures, launchpad-planning and process-debt.",
    "The local gate ledger's two full rows: 07:26:05 UTC, exit 0, the close file 720 s; 16:35:26 UTC, exit 1, execution mode forced-fresh, identity unchanged, the close file 900 s with failure kind timeout; the other durations above are from the same two rows' task timelines.",
    "scripts/test-runner.mjs: the target-worktree suite's sources, and its note that the close file takes most of the group's deadline. scripts/lib/gate-reuse.mjs, coveringTaskResults: each task's latest executed result at the identity decides whether it is carried, and a later failure is never masked by an older pass. packages/skeleton/src/gate-evidence.mjs, intactGateExecutionRow: a failed row whose identity held is carriable."
  ],
  "rejected": [
    {
      "option": "Run the whole selection fresh again with --again",
      "reason": "It would take about 47 min to rerun 116 tasks whose fresh executions on the repaired bytes passed, and the close file would run among them under the same load."
    },
    {
      "option": "Run the close file alone with --only",
      "reason": "A complete run composes nothing from an --only row; the plain complete run reruns the failed file and composes the row in one step."
    },
    {
      "option": "Raise the close file's deadline or split it",
      "reason": "That is a change to a check, which this order's non-goals bar; the follow-up names it."
    }
  ],
  "followup": "Planning: the target-worktree group's close file, scripts/test-target-worktree-close.mjs, runs near its 15 min deadline in a complete run. In WO-277's runs on 2026-11-15 it took 720 s of 900 s at 07:26 UTC and timed out at 900 s in the fresh run at 16:35 UTC, where every task measured beside it ran 25 to 35 per cent slower (license-fixtures nearly five times) and nothing the file reads had changed. A complete run on a busier host then fails on load alone and costs a rerun. Consider splitting the file, or setting its deadline from its measured duration with a margin, weighed against the reservations set after earlier deadline failures (WO-242-D021, WO-258-D029, WO-222). Check: the close file's share of its deadline in the gate rows' task timelines stays under a stated fraction. Priority: low; before the next order whose complete run must run fresh.",
  "reopenWhen": "The close file fails again when it runs on its own, or fails on an assertion rather than its deadline."
}
```

## WO-277-D020

```json
{
  "id": "WO-277-D020",
  "date": "2026-11-15",
  "dispatch": "resume: verify; VER-002 read and probe corrections",
  "kind": "correction",
  "misread": "The initial status, several repository-read batches and the broad meta summary were emitted with insufficient output budgets and were truncated. The first gate-coverage probe then passed an orders-map entry as the state, although control-store wraps it in a state field; its productGate assertion failed before any gate ran.",
  "meant": "Read each source needed for the verdict completely, select bounded output before emitting it, and pass the state shape the source declares to the canonical claim reader. Neither truncated text nor a failed verifier helper establishes a product defect.",
  "changed": "The selected canonical status, source diff, complete decisions, cited passages and all nine execution and repair review reports were read in bounded excerpts. Full review and decision reads stay in session scratch. The meta generation exited successfully; its broad historical output does not support this verdict, and its current index is checked directly. Later meta output is captured to scratch. The helper now takes entry.state; its successful rerun resolves the complete review row at the current code identity with no advisory. Both helper results are retained in verifier-002/checks.json.",
  "decision": "Preserve these process failures and continue the authorized independent verification without changing the implementation or assigning them as product findings.",
  "evidence": [
    "Canonical selected status: WO-277, verifying, VER-002 allocated, verification-result legal.",
    "scripts/lib/control.mjs foldWorkOrders and scripts/lib/control-store.mjs readControl: an order map value contains state.",
    "verifier-002/checks.json and verifier-002/gate-coverage.json"
  ],
  "rejected": [
    {
      "option": "Treat an incomplete read or a helper assertion as a product judgment",
      "reason": "The first omits evidence and the second used the wrong input shape; the corrected observation is available."
    }
  ],
  "reopenWhen": "A verdict claim depends on unread text or a failed helper, or an emitted batch is truncated again."
}
```

## WO-277-D021

```json
{
  "id": "WO-277-D021",
  "date": "2026-11-15",
  "dispatch": "resume: verify; independent judgment of the repaired WO-277 subject",
  "decision": "Reproduce both VER-001 findings and rederive the page and export claims. The status capture changes only route.cwd and route.launchpad to the worktree placeholder, preserving every other field. In a fresh synthetic modify/delete merge, the page's recovery keeps the deletion, resolves the conflict and agrees with the publish judgment; a second edited file and paths containing spaces are covered. A fresh export from the launchpad suite's own fixture prints the current page from its root and docs directory without node_modules. Consume the executor's complete review row of 16:52:24 UTC at the unchanged code identity: its page-related executions ran fresh after the repair in the 16:35 run, and the later row reran the unrelated close task that had timed out. File a pass only after the current document gate covers this report and its evidence. The operator's reading and release-note write-back remain with final review. No implementation edit, worker or complete product run is needed in verification.",
  "evidence": [
    "verifier-002/repair-results.json: original capture lines 13 and 14 fail the record path rule; current capture has no failure and every other field is equal; deleted and edited instance files preserved, no unresolved paths.",
    "verifier-002/export-results.json: all seven paragraphs, the step-1 terms block, both entry links, WO-001, manifest and deletion recovery strings, source equality and export manifest hashes.",
    "verifier-002/checks.json: generator and implementation formatting pass.",
    "verifier-002/gate-coverage.json: current identity, complete passing review row, declared suites and selected execution times from each repair run.",
    "D017 and repair-001/rename-note.json: the existing renamed-file limitation already has follow-up FUP-ed709688ea483bd1; the update code is unchanged from the base. D018 and D019 retain the gate-reuse and timeout follow-ups."
  ],
  "rejected": [
    {
      "option": "Repeat the complete product run",
      "reason": "Current canonical coverage and actual post-repair executions are present; independent focused probes add the needed observations without repeating the complete selection."
    },
    {
      "option": "Repair or redesign the commands page during verification",
      "reason": "The role judges the supplied implementation. The remaining human reading belongs to final review, and recorded follow-ups fail no measurable criterion or reproduced prior behavior."
    },
    {
      "option": "NoOp: leave the repair without a new verification",
      "reason": "That would leave the operator's verification request and the order's next phase unresolved despite available evidence."
    }
  ],
  "goalAlignment": {
    "traps": {
      "staleEvidence": "Trace actual page-related task execution times and independently export the current page instead of accepting the code identity alone.",
      "scopeExpansion": "Judge the original criteria, reproduce the repaired findings and preserve later-phase reading and existing follow-ups."
    },
    "outcome": "The independent observations support the repaired subject; a passing handoff remains contingent on the final current document gate."
  },
  "reopenWhen": "The current document gate fails, a supported input contradicts a criterion, the subject changes, or final review finds the paragraphs unusable under its assigned reading."
}
```

## WO-277-D022

```json
{
  "id": "WO-277-D022",
  "date": "2026-11-15",
  "dispatch": "resume: verify; VER-002 completion read corrections",
  "kind": "correction",
  "misread": "A later status read repeated D020's output-budget error by emitting the entire historical orders array and was truncated. A subsequent source read guessed completion-evidence.mjs, which does not exist, instead of first resolving the import used by resume.mjs.",
  "meant": "Emit only the selected order's canonical status, and obtain a module's path from the implementation before reading it. Neither failed read establishes anything about the product.",
  "changed": "The status was read again with the historical orders array omitted: WO-277 is verifying, VER-002 is allocated, verification-result is the legal next action and the active actor readback agrees with the report. The resume.mjs import names scripts/lib/lifecycle-evidence.mjs, and the verification-result branch shows its evidence and claim checks before VerificationCompleted. The finished document-gate log records 29 passed, zero failed. After adding this correction and refreshing its index, run the document gate again for the final report tree.",
  "decision": "Keep both failed reads as verifier process corrections, use the corrected observations for completion, and preserve the implementation and existing verdict evidence.",
  "evidence": [
    "The bounded selected status read after the truncated read, and scripts/resume.mjs imports and verification-result branch.",
    "The document gate completed at 2026-11-15T17:16:23.859Z; its scratch log ends with 29 passed, zero failed, 29 fresh tasks."
  ],
  "rejected": [
    {
      "option": "Treat the failed reads as a new product defect or repeat product probes",
      "reason": "They changed no subject and contradict none of the independent observations; the required correction is to the verifier's evidence handling."
    }
  ],
  "reopenWhen": "Completion relies on a truncated observation or a path that the implementation does not name."
}
```

## WO-277-D023

```json
{
  "id": "WO-277-D023",
  "date": "2026-11-15",
  "dispatch": "resume: verify; VER-002 completion actor correction",
  "kind": "correction",
  "misread": "The report actor included accountLabel not-applicable, but the first verification-result command omitted its optional --account-label flag. The report's projected actor and the command's stored actor were therefore unequal.",
  "meant": "The report actor and completion flags must agree exactly, including an optional field when the report states it. A projection default does not add that field to the stored command actor.",
  "changed": "The command was refused before VerificationCompleted; canonical status still reads verifying with verification-result legal. scripts/resume.mjs accepts --account-label and adds accountLabel only when it is supplied, while scripts/lib/control-actor.mjs supplies not-applicable only for projection. Complete with --account-label not-applicable, preserving the report's actual model, effort, harness and source. The final document gate passed 29 checks before this correction; rerun after these record edits.",
  "decision": "Correct the command's omitted flag, retain the passing product evidence and unchanged implementation, and record the failed completion attempt without inventing a transition.",
  "evidence": [
    "verification-result exited 1 with verification report actor header does not match the completion actor; its expected actor omitted accountLabel.",
    "scripts/resume.mjs parseActor allowedFlags and accountLabel assignment; scripts/lib/control-actor.mjs projectActor.",
    "Canonical selected status after the refusal: WO-277, verifying, VER-002, latestVerdict null, verification-result legal."
  ],
  "rejected": [
    {
      "option": "Redispatch verification or change the actor identity",
      "reason": "The allocated report and dispatch remain active; only the optional account-label flag was omitted."
    }
  ],
  "reopenWhen": "The corrected flags still differ from the report or the recorded session readback."
}
```

## WO-277-D024

```json
{
  "id": "WO-277-D024",
  "date": "2026-11-15",
  "dispatch": "resume: verify; VER-002 untracked report whitespace correction",
  "kind": "correction",
  "misread": "The plain git diff --check passed but did not inspect the untracked VER-002 report. The completion's canonical whitespace check includes untracked files and found a new blank line at that report's end.",
  "meant": "A plain diff check does not establish the lifecycle whitespace claim for an untracked report; use checkLifecycleWhitespace from the lifecycle implementation before completion.",
  "changed": "Remove the extra terminal blank line from the unfiled report and use the canonical check, which constructs a temporary index including untracked files. Preserve the filed VER-001 and the implementation. The rejected completion recorded no VerificationCompleted event. Refresh the decisions index and validate the final document tree before retrying the already-corrected actor flags.",
  "decision": "Correct the report's whitespace and the verifier's incomplete preflight check, retaining every criterion judgment and its evidence.",
  "evidence": [
    "The second verification-result command passed actor matching and exited 1 at git diff --check: docs/verifications/WO-277/VER-002.md:171: new blank line at EOF.",
    "scripts/lib/lifecycle-evidence.mjs checkLifecycleWhitespace: untracked paths are included as intent-to-add entries in a temporary index; the real index is never written."
  ],
  "rejected": [
    {
      "option": "Stage the report or weaken the whitespace check",
      "reason": "The existing canonical check covers the intended subject without altering the real index or the implementation."
    }
  ],
  "reopenWhen": "The canonical whitespace check fails on the final report or completion records another unsupported assumption."
}
```

## WO-277-D025 — Final review: the four criteria stand on the tree the verifier judged, the page is not edited here, and the operator's reading is taken at the pull request

```json
{
  "id": "WO-277-D025",
  "date": "2026-11-15",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Integration took in nothing: origin's main was fetched and is the merge base b8591a730, so the reviewed tree is the one VER-002 judged, at the code identity 274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e. VER-001's blocking finding is reproduced as repaired: the status capture's two location fields read the worktree placeholder, and no file of this order's records holds a home-directory path. The four criteria are judged met. Criterion 1 stands on the generator's own check, run here, and on the page's first step as it reads. Criterion 2's measurable half stands on the page that node scripts/launchpad.mjs commands prints in this checkout and in a fresh export, each byte for byte the committed page of 8,973 bytes. Criterion 3 stands on a fresh export built here by the launchpad suite's own fixture, in which the verifier's export assertions pass again. Criterion 4 stands on the complete review row of 16:52:24 UTC at this identity, which the canonical claim reader admits with no advisory, and on the document row this review's own gate records for its final tree. The reuse of that complete row is sound for this page and would not be for an edited one: the suites that read the guide and the page ran fresh on the repaired page in the run that ended 16:35 UTC (D018, D019), and the page, the guide's marked blocks and the seed are the bytes those runs read. This review therefore changes no line of docs/KIT.md, docs/OPERATOR.md or scripts/kit/README.client.md. Each quoted output and each route in the seven paragraphs was read here against its producer: the terms check's status line and its FAIL line, harness check's closing words, the host report's verdicts and its exit, the two lines worktree start prints for a carried and for an absent list, the order's own publish that goes on unscreened (D003), the seeded sequence's one entry, the worktree's folder name, and the guide's account of an update's merge, publish and finish. None was found wrong. Criterion 2 leaves whether each paragraph serves a person to the operator's reading at final review, and the order's assumption is that the operator reads the page against the 2026-11-07 pass's section. That reading is the operator's and is not claimed here. The reviewer's own reading, for the operator to weigh: each of the seven paragraphs says what the step does, what to look for and what to do when it fails, in the second person, and the first step holds the terms list before any session publishes. The paragraphs are long for one block of text, 94 to 220 words with the release step's the longest, and each is printed whole before its step's blocks where the 2026-11-07 section sets a few lines between blocks; that is the order's own design, which WO-281 weighs again. The release step has two histories it gives no route for (D026). The safe default is recorded and no answer is asked for: the review passes on the criterion's measurable half and opens the pull request, where docs/OPERATOR.md is the diff the operator reads before merging by hand. The merge is the operator's acceptance of the reading; a paragraph the operator finds wanting is said before the merge and is D006's reopening condition.",
  "evidence": [
    "npm run worktree -- integrate WO-277, between 17:46 and 17:48 UTC: 'Integration took in nothing: the worktree is not behind main.'; git rev-parse HEAD main origin/main gave b8591a7307703d2cd454e51ac0c0557dc10d48d0 three times",
    "node scripts/harness.mjs bounded -- node scripts/lib/operator-commands.mjs --check, 17:48:33 UTC: 'docs/OPERATOR.md is current', exit 0; docs/OPERATOR.md lines 13 to 30, the clone recipe's block and then the terms block of three lines, before line 32, the first planning pass",
    "node scripts/launchpad.mjs commands piped to cmp against docs/OPERATOR.md: equal; shasum -a 256: the page 874635cc92db6456869a883d2117cd64781499d881a281002a7ca54f3f3c702c, 8,973 bytes, the hash VER-002 and repair-001/export-fixture.json record; the seed 7b2c2d3210e0593b93eb11cba7f49d2f6ed968aabbaf6c680c8b5beffdafad9e, the pin at scripts/test-launchpad-export.mjs line 162",
    "final-001/export-results.json, recorded 17:53:48 UTC: docs/evidence/WO-277/verifier-002/export-probe.mjs run here under the bounded wrapper on a fresh export from scripts/lib/launchpad-fixture.mjs, its output written to session scratch and copied: seven steps, each with a paragraph before its blocks; the terms block after the clone recipe in step 1; WO-001 in step 2's paragraph; the manifest's checkout and git rm in step 5's; the front page's first paragraph linking docs/OPERATOR.md and the guide's linking OPERATOR.md; the exported guide's and page's hashes equal to KIT-MANIFEST.json's",
    "final-001/gate-rows.json, recorded 18:06:31 UTC by final-001/gate-rows.mjs: the code identity; the claim reader's product gate, the npm test row of 2026-11-15T16:52:24.433Z, exit 0, with no advisory; the four npm test rows at the identity (07:26 fresh and passed, 15:43 composed and passed, 16:35 forced fresh and failed, 16:52 composed and passed)",
    "docs/evidence/WO-277/status.json lines 13 and 14 read <worktree>; a search of docs/evidence/WO-277, docs/verifications/WO-277 and docs/control/orders/WO-277.jsonl for a home-directory path lists no file",
    "scripts/terms.mjs lines 43, 46 and 85; scripts/harness.mjs line 452; scripts/doctor.mjs (verdicts met, unmet and unknown, exit 1 where a row is unmet, nothing refused); scripts/worktree.mjs lines 589 and 595 (the two lines for the list), 1401 to 1402 (the folder's name) and 1647 to 1667 (an order's publish prints that its files were not screened and goes on); scripts/lib/launchpad-publish.mjs lines 64 to 85; scripts/launchpad.mjs line 1247; scripts/lib/starter-seeds.mjs, planStarterSeeds (a front page is rewritten when it is a seed an earlier export of the starter's own history wrote, and kept otherwise); docs/KIT.md, First steps, Planning in this instance and Taking upstream updates",
    "The 2026-11-07 pass's section of the operator's commands and the 2026-11-14 pass's section of the same kind, read beside the page; the handoff's count of each paragraph's words"
  ],
  "rejected": [
    {
      "option": "Reword a paragraph at final review",
      "reason": "No paragraph was found wrong. An edit of the page after its reviews would be unreviewed, and it would owe the suites that read the page a fresh run, 47 min by D019's row, for a change no criterion asks for."
    },
    {
      "option": "Hold the review until the operator has read the page",
      "reason": "The criterion's measurable half is met, the order says when the operator reads, and the operator merges by hand: holding would ask the operator to arbitrate what the order has already assigned."
    },
    {
      "option": "Run the complete review run again",
      "reason": "A passing complete row stands at the integrated identity, and the page's suites ran fresh on these bytes. A rerun adds no observation, and its close file timed out under the host's load in one of its three executions today (D019)."
    }
  ],
  "goalAlignment": {
    "traps": {
      "staleRow": "A complete row at an unchanged code identity can stand for documents its suites never read (D018). The page's and the seed's hashes were compared with the captures made after the fresh run, and this review edits neither.",
      "readingClaimed": "The operator's reading could be written as done. The report gives the reviewer's reading as the reviewer's and names where the operator's is taken.",
      "followUpAsBlocker": "Two gaps in the release step could be raised to blocking or left as a sentence. Neither breaks a criterion or a behavior main had; both are reproduced and boarded (D026)."
    },
    "noOp": "No review: the order stays at final review and the page does not reach the starter.",
    "outcome": "The outcome matched: the criteria are judged on evidence made at this tree, no reviewed byte of the page changed, and what the review met and did not fix has a register row."
  },
  "reopenWhen": "The operator's reading finds a paragraph that does not serve a person setting up on a managed machine; main moves before the merge; or the guide, the page or the seed changes on this branch after the run that ended 16:35 UTC."
}
```

## WO-277-D026 — The final review's three findings, each a follow-up: two update histories the release step gives no route for, and a handoff advisory that names the wrong cause

```json
{
  "id": "WO-277-D026",
  "date": "2026-11-15",
  "dispatch": "resume: final review; FINAL-001, findings F1 to F3",
  "decision": "Three findings, each routed to a follow-up: none fails a criterion and none breaks a behavior main had, whose page gave the release step no recovery at all and whose preview already told a person to keep this instance's bytes for a file both sides changed. Round 2's design reviewer named the first two from the guide without running them (D009), the handoff carried them with no register row, and VER-001 read the note and did not reproduce it. final-001/update-recovery-gaps.mjs now reproduces both in synthetic histories. F1: where an earlier update reached main by a squash merge, main holds none of the starter's commits, so a file of the instance's own that the starter changed in that update and changes again is listed as changed on both sides though this instance never edited it. The page says to run git checkout main -- <path> for each such file, which keeps the earlier update's bytes; the publish's judgment then finds every file kept, so nothing refuses and the starter's later change is left out. The guide's answer for that history, the publish's refusal with --take, is reached only by a person who did not restore the file. The page asks for a merge commit in steps 4 and 5, so an instance that follows it does not make this history. F2: a kit file this instance edited and the starter changed is no both-changed file. The page says to read the preview's refused rows and names no command for one. The merge stops on it, the page's recovery leaves it unmerged, and the block's git add -A and git commit then conclude the merge with the conflict's markers in the file. F3: the handoff's self-review line is present, and its reason for the unreviewed lines is 287 characters where the reader admits 200. The reader therefore does not match the line and returns the advisory that the handoff lacks a self-review line, as it did when VER-002's probe read the ledger and as it does at this review. The advisory names the wrong cause and no bound, and the handoff is the executor's dated record, which this review does not rewrite. The page is not edited here for F1 or F2 (D025): the sentences that would answer them belong with the update's own account of a stopped merge, which WO-282 repairs and WO-281 rewrites.",
  "evidence": [
    "final-001/update-recovery-gaps.json, recorded 17:58:01 UTC under the bounded wrapper on Git 2.55.0. The squash history: both changed seed.md; the merge stops on it; the page's checkout exits 0; the publish's judgment (instanceChangesNotKept) names no file; the file holds the starter's first change; the same merge resolved to the starter's bytes is named not kept. The kit file: both changed own.md alone; the merge stops on kit.md and own.md; after the page's recovery kit.md is unmerged; git add -A and git commit exit 0, and the merge commit's kit.md holds the conflict's markers",
    "docs/KIT.md, Taking upstream updates: an earlier update that reached main by a squash merge reads as this instance's and such a file is taken; a locally modified kit path is flagged for review and resolved by hand; the preview's line above its both-changed rows says to keep this instance's bytes when merging",
    "docs/evidence/WO-277/handoff.md, Review, round 2's first finding; VER-001, Findings and earlier-review disposition: the note was read and not reproduced",
    "final-001/gate-rows.json: the ledger's advisory, the self-review line present at 365 characters and its reason at 287; scripts/lib/handoff-ledger.mjs line 36, whose pattern bounds the reason at 200 characters; verifier-002/gate-coverage.json holds the same advisory, and so does the RepairCompleted event of docs/control/orders/WO-277.jsonl"
  ],
  "rejected": [
    {
      "option": "Answer both histories in the release step's paragraph now",
      "reason": "The paragraph is the page's longest at 220 words; the edit would follow the page's reviews unreviewed and owe the page's suites a fresh run; and the squash history's repair is the preview's, which can see that main holds none of the starter's commits."
    },
    {
      "option": "Record the findings in the report alone",
      "reason": "A defect met and not fixed needs a register row, and round 2's note had none."
    },
    {
      "option": "Shorten the handoff's line to fit the bound",
      "reason": "The handoff is the executor's record of its own execution; the advisory's wording is the kit's to mend."
    }
  ],
  "followup": "Planning: three things from WO-277's final review. (1) The commands page's release step, and the preview's line above its both-changed rows, tell a person to keep this instance's bytes for every such file. Where an earlier update reached main by a squash merge, a file only the starter ever changed is listed, the page's git checkout main -- <path> keeps the earlier update's bytes, and the publish finds nothing to refuse, so the starter's later change is left out in silence. Have the preview say when main holds none of the starter's commits (the publish's refusal already words that cause), and have the page and the guide name --take for that history. (2) The page names the preview's refused kit rows and gives no route for a merge that stops on one; a person who goes on from the emit commits the conflict's markers into a kit file. Have the release step say to resolve every file the merge stopped on before the emit, and which side returns a kit file to the kit and which keeps the fork. Both belong with WO-282's account of a stopped merge and WO-281's rewrite of the section. Reproduction: docs/evidence/WO-277/final-001/update-recovery-gaps.mjs and its result. Check: in each history the page's route ends with no unmerged file, no marker in a committed file, and the starter's change either taken or refused by name. (3) scripts/lib/handoff-ledger.mjs advises that a handoff lacks a self-review line when the line is there and its reason is longer than the 200 characters the reader admits. Word the advisory for a line that is present and over a bound, naming the bound, and give the bound in the executor's role text. Check: a handoff whose reason is 201 characters is advised of the bound and not of an absent line. Priority: (1) and (2) with WO-282; (3) low.",
  "reopenWhen": "An instance reports an update that left a starter change out after an earlier squash merge, or a kit file committed with conflict markers; or WO-282 or WO-281 changes the release step's account of a stopped merge."
}
```

## WO-277-D027 — Of the four earlier follow-ups this change matches, three are left as they are and one's condition occurred: a guide-only edit claimed a cached product pass

```json
{
  "id": "WO-277-D027",
  "date": "2026-11-15",
  "dispatch": "resume: final review; FINAL-001, the pending follow-ups this change touches",
  "decision": "npm run plan -- followups --touching lists 16 pending rows for this change. Twelve were minted from this order's own decisions and are the next planning pass's to read. Four are earlier orders'. Three of those only match a path this order changed and are left as they are: FUP-197d2df229999795 (WO-276-D120, a pin held by a suite outside a part's gates, whose condition is a pass that files an order divided into parts, which this order is not), and FUP-2d104bb644bc094c (WO-276-D074) and FUP-5e8613230ee9c07c (WO-276-D156), which match docs/KIT.md by its name alone. The fourth, FUP-912adb42a652b75f (WO-245-D005), was deferred until a guide-only edit would otherwise claim a cached product pass. That happened in this order's repair: it changed docs/KIT.md and docs/OPERATOR.md and nothing outside docs/, and its complete run of 15:43 UTC passed in 1 min by carrying the launchpad suite's three files, sync-fixtures and launchpad-planning from a row recorded before the page changed (D018). The executor did not cite that row and ran the selection again in full, so no criterion of this order stands on it, and the reuse rule itself is unchanged. The observation is recorded here against WO-245-D005, and its row is set open. D018's own row, FUP-3c5993936b048f5d, names the same seam with its reproduction and check, and stays with the planning pass that takes the seam up.",
  "evidence": [
    "npm run plan -- followups --touching on 2026-11-15 at register revision 784c453ba65019f2ba1e9edf8e237c93d526fc6408d4c92657464e4f1f90a284: 294 pending, 16 matched over two pages; the four earlier rows, each deferred, with the paths they matched",
    "npm run plan -- followups --show FUP-912adb42a652b75f: two dispositions of 2026-11-02, both deferred, on the condition that planning scopes documentation-sensitive evidence reuse or a guide-only edit would otherwise claim a cached product pass",
    "D018, and final-001/gate-rows.json: the npm test row of 15:43:45 UTC, composed, 71,942 ms, exit 0, and the forced-fresh row of 16:35:26 UTC that the executor ran instead",
    "docs/product/07-execution-guide.md, Retained planning follow-ups: the final review disposes a listed row whose seam the change opened or whose condition occurred, and leaves a row it only matched as it is"
  ],
  "rejected": [
    {
      "option": "Leave all four as matched",
      "reason": "The fourth's recorded condition occurred, and the rule gives its disposition to the final review."
    },
    {
      "option": "Mark D018's row a duplicate of the earlier one",
      "reason": "This order's own rows are the next planning pass's to allocate; the observation ties the two."
    },
    {
      "option": "Set FUP-197d2df229999795 open because round 1 found a stale pin in the file it names",
      "reason": "Its condition is an order divided into parts, and the pin was found by review before any gate failed (D007)."
    }
  ],
  "reopens": {
    "decisionId": "WO-245-D005",
    "observation": "In WO-277's repair a guide-only edit claimed a cached product pass. With docs/KIT.md and docs/OPERATOR.md changed and nothing outside docs/, npm test -- --review at 15:43 UTC on 2026-11-15 passed in 1 min with 110 of 117 tasks carried from the row of 07:26 UTC at the unchanged code identity, the launchpad suite's three files, sync-fixtures and launchpad-planning among them. WO-277-D018 records it with the fresh run the executor made instead, and FUP-3c5993936b048f5d is that decision's row for the same seam."
  },
  "reopenWhen": "The disposition is found to name the wrong row, or a planning pass scopes documentation-sensitive reuse and settles both rows."
}
```

## WO-277-D028 — The sync refused two checks on their time limits while the host was slow; both pass at ordinary speed, and the document gate is run when the host is

```json
{
  "id": "WO-277-D028",
  "date": "2026-11-15",
  "dispatch": "resume: final review; FINAL-001, finding F4, 18:22 to 18:42 UTC",
  "decision": "After this review's records were written, npm run sync exited 1 with the decisions-index check and the work-order index check each refused as timed out and nothing written for either. Both are bounded at 30 s in the inventory the sync and the gate's structural phase share. Run alone a few minutes later, the decisions-index check took 72 s, 69 s of it the process's own time, and the index check 26 s. A profile of the first shows the shared Markdown parser reading every decisions record and every stamped receipt, and none of this review's files is slow to parse (16 to 85 ms each). The cause was the host and not the tree: a fixed loop that took 1,228 ms in this shell then took 364 ms a few minutes later, in the plain shell and under the bounded wrapper alike, with load averages of 7 to 8 from the operator's own desktop applications and no thermal warning. At ordinary speed the gate's generated-artifacts task then passed with the decisions-index check at 14.7 s and the index check at 5.3 s, the check alone took 15 s in the plain shell and 15 s under the wrapper, and the seventeen gate rows of today that ran the whole inventory held the task to between 32 and 45 s. The two generators were run directly, the index check passed, and the document gate is started only after the fixed loop reads at its ordinary speed. Nothing in the order is to repair. The limit is the gate's to keep or to size, which a planning pass weighs with D019's row: the decisions-index check uses half of its limit at ordinary speed and grows with every order's records and receipts, so a host slowed by a little more than a factor of two fails the structural phase of every gate on load alone.",
  "evidence": [
    "npm run sync, 18:22:41 to 18:26:45 UTC, output kept in session scratch: 'meta | unknown | unknown | refused: check timed out; rerun the check before regenerating' and the same for index; exit 1. scripts/lib/generated-artifacts.mjs: each artifact's check is bounded at 30,000 ms, and the gate's structural phase runs the same inventory",
    "node scripts/meta.mjs --check under the shell's time, ended 18:33 UTC: 69.32 s user, 5.33 s system, 1 min 11 s in all, exit 0; npm run work-orders -- index --check: 26 s, both pages current; npm run meta: 85 s; npm run work-orders -- index: 31 s",
    "A CPU profile of the check, summarized in session scratch: 53.7 s of 71.9 s inside the shared Markdown parser, under the decisions reader, the follow-up collector and the receipts' cost-line check. Timed apart while the host was slow: 479 stamped receipts in 16.9 s and 4,006 decisions in 6.8 s; this review's report, pull-request body and release notes parse in 83, 26 and 16 ms",
    "The fixed loop (400,000 chained SHA-256 digests and 60,000,000 additions) in session scratch: 1,228 and 1,221 ms at 18:36 UTC; 364 ms plain and 364 ms under the bounded wrapper at about 18:39 UTC. Back to back at about 18:41 UTC, with the loop at 361 to 371 ms: npm run meta 17 s, the check 15 s plain and 15 s under the wrapper. uptime: load averages 7.99, 8.11 and 7.72, then 7.30, 7.58 and 7.58; pmset -g therm records no warning; the busiest processes were desktop applications and this session's own",
    "node scripts/harness.mjs bounded -- node scripts/structural-checks.mjs generated, 18:38:05 to 18:38:42 UTC: every artifact current; meta 14,655 ms, index 5,251 ms, siblings 4,561 ms, the rest under 3 s each",
    "The local gate ledger's rows of 2026-11-15: the generated task took between 31.9 and 44.6 s in each of the seventeen runs that ran the whole inventory, and 0.5 s in the one focused run that judged the build phase alone"
  ],
  "rejected": [
    {
      "option": "Start the document gate at once",
      "reason": "Its structural phase runs the same check under the same limit, so a slow host fails the gate on load alone and costs its run."
    },
    {
      "option": "Raise the limit",
      "reason": "That is a change to a check, outside this order and this role."
    },
    {
      "option": "Treat the refused sync as a stale tree and rewrite by hand",
      "reason": "A check that timed out read nothing; each generator was run by its own command and each check then passed."
    }
  ],
  "followup": "Planning: the generated-artifact checks share a fixed 30 s limit each (scripts/lib/generated-artifacts.mjs), in npm run sync and in the structural phase of every gate. On 2026-11-15 the decisions-index check took 14.7 s at ordinary speed and 72 s while the host ran a fixed loop 3.4 times slower, so the sync refused it and the index check as timed out; a gate started then would have failed on load alone. The check parses every decisions record (4,006 decisions in 188 files) and every stamped receipt (479) on each run, so its share of the limit grows with each order. Weigh, with WO-277-D019's row on the close file's margin: a limit sized from the check's measured duration; a check that reads only what changed since the index was written; or a cost-line check that reads a receipt's field without a whole parse. Check: the generated task's slowest artifact stays under a stated share of its limit in the gate rows. Priority: before the decisions-index check passes 20 s at ordinary speed.",
  "reopenWhen": "A gate fails in its structural phase on a timed-out check with the tree current, or the decisions-index check exceeds 20 s on an unloaded host."
}
```

## WO-277-D029 — The operator's direction an hour into the final review: the meta critic on GPT-6 Astra, launched then as launch 2, on a copy of the transcripts that holds no account address

```json
{
  "id": "WO-277-D029",
  "date": "2026-11-15",
  "dispatch": "resume: final review; the operator's message of 18:45 UTC on 2026-11-15, an hour into the dispatch",
  "decision": "The operator asked, in paraphrase, for the meta critic to be started on GPT-6 Astra, an hour into this dispatch and with the review's closing steps in hand. The critic is the one docs/evidence/WO-276/critic/ holds: its fixed charter, its launcher and its README, which the kit has no command for until WO-279. The worker table binds astra to gpt-6-astra at max on the Codex provider, the launcher's default. Two recorded rules bear on when a launch goes out. WO-276-D166 has the first launch of a dispatch go out when the dispatch's own work has run for one interval of 75 minutes, so that the critic has conduct to read, and names as its reopening condition a critic the operator asks for at a time of their choosing. The README's fourth rule ends the clock when the passing run is in, and WO-276-D145 records a critic launched in a closing stretch and stopped on the operator's word, because nothing it said could reach the work. This direction is the operator's own, given at minute 60 with an hour of the review's conduct to read, and the clock's first time, 19:00 UTC, would have fallen after the review was filed. It is read as a launch at the time the operator chose: launch 2 for this order went out at 18:51:42 UTC. So that its report can reach the work, the review's result is not recorded until the report is in, has been given to the operator whole and each point has been answered in a decision of this file, the README's third rule; the role's rule that a session stops what it started before it records its result asks the same. That holds the completion for the length of the critic's run, which is the cost WO-276-D145 names, taken here on the operator's direction. Nothing else waits: a trial of the document gate ran beside the critic and passed. No second launch is planned, since the dispatch ends before another interval. The two checks the README asks a later order to repeat were made on what the critic reads. The account's address: the host writes it into each session's context, and this worktree's transcripts now hold two such addresses, in six rows of three session files, where WO-277-D002 found one; the checkout's Git user address is in no file. A worker on the other provider is not handed an account's address without the operator's word. The launch therefore points the critic, with the launcher's --transcripts option, at a copy of the transcript directory made at 18:50 UTC in session scratch, in which each occurrence of those addresses is replaced by one fixed placeholder, each file keeps its modification time and no other byte differs. A first copy, made a minute earlier, replaced the whole sentence the host stores the address in, which is more than the address; it was discarded and remade before anything read it. The private list: every row of the copy was read on its own through the list's reader, which printed counts only, and no row matched in either class. The sandbox: a command under Codex's read-only sandbox read the newest transcript of the copy and was refused a write beside it. The launcher is counted by no hook, so this is one worker use of the cap of 20, counted by hand, and the review made no other.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo277-final-review-start-the-meta-critic-2026-11-15.txt, SHA-256 61130f34bfaf110e7e02419e87fff1e40f9e56ee66b3a8dd47ab1bad71298d0a; the host's prompt facts that came with it are stamped 18:45:11 UTC",
    "docs/evidence/WO-276/critic/README.md (the rules that made it useful, and what it needs), charter.md and launch.mjs; WO-276-D145, WO-276-D165, WO-276-D166 and WO-277-D002",
    "npm run worker -- list: astra is gpt-6-astra at max on the Codex provider; npm run worker -- show astra --provider codex in this session prints that model and effort and no session launch, the launcher being the route; codex --version: codex-cli 0.169.0",
    "Session scratch, critic/prepare-transcripts.mjs, run under the bounded wrapper and recorded 18:50:47 UTC: the original 28 files, 32,014,121 bytes and 14,002 rows; 9 occurrences replaced in 6 rows of 3 files; the copy 28 files, 32,014,115 bytes and 14,002 rows, with no row holding an account address; four other address-shaped strings remain, each under a reserved example domain; the newest session file is the same in both; the private list present with 9 entries, none in the refuse class and 9 in the context class; refuseRows 0 and contextRows 0",
    "Session scratch, critic/count-addresses.mjs, which prints no address: two host-written values, one address in each, two distinct addresses, one in two session transcripts and one in one; the Git user address is set, is neither and is in no file",
    "codex sandbox -- /bin/sh -c 'wc -c < <the copy's newest transcript>; touch <the copy>/.write-probe' at 18:51 UTC: the size printed, 5,306,229 bytes; the write refused with Operation not permitted; no file created",
    "node docs/evidence/WO-276/critic/launch.mjs WO-277 2 --since 2026-11-15 --transcripts <the copy> --print, read before the launch: the charter as sent, 4,416 bytes, SHA-256 2139ac5e311656387f686fcf7f21d814a37b6bd73e29fe1a6586b7a4cba967dd, naming this order, this checkout, the copy's directory, an interval of 75 minutes since 2026-11-15 and launch number 2",
    "The launch: started 18:51:42 UTC in the background; the process table then held the launcher and one codex exec on gpt-6-astra with a read-only sandbox",
    "npm run test:docs beside it, 18:52:10 to 18:54:58 UTC: 29 passed, 0 failed, with no advisory on a record of this order"
  ],
  "rejected": [
    {
      "option": "Start a clock and launch at 19:00 UTC, one interval after the dispatch began",
      "reason": "The review's closing steps would have ended before then, and the operator's direction would have produced no critic."
    },
    {
      "option": "Launch, and record the result without waiting for the report",
      "reason": "The report would arrive after the records were filed and could change nothing, which is what the operator stopped in WO-276-D145; and a session stops what it started before it records its result."
    },
    {
      "option": "Send the transcripts as they are",
      "reason": "They hold the account's addresses in rows the host wrote, and no word of the operator's asks for those to go to the other provider; replacing them changes nothing the critic judges."
    },
    {
      "option": "Give the critic this session's transcript alone",
      "reason": "Choosing what it reads is briefing it by another name (WO-276-D101). The copy holds every file and every row."
    }
  ],
  "goalAlignment": {
    "traps": {
      "launchOnTheRulesLetter": "WO-276-D166 and WO-276-D145 each corrected a launch made from a rule's letter, one too early and one too late. This one is made on the operator's word at the time they gave it, and held to the purpose both corrections name: the critic has conduct to read, and its report can reach the work.",
      "briefTheCritic": "A copy the reviewer prepares could become a selection, and the first copy replaced more than the address. The copy is every file with one kind of string replaced, and the counts of the original and of the copy are recorded."
    },
    "noOp": "No critic: the review would have been filed as it stood, against the operator's request."
  },
  "reopenWhen": "The operator says to send the transcripts as they are, to hold the critic or to file without waiting for it; or WO-279 lands, and the kit's own launch and screen replace this copied route."
}
```

## WO-277-D030 — The second meta critic's five points, each checked and accepted: four are the executor's conduct and stand as recorded, the missing-messages rule is reopened with its cause unsettled, and four deferred observations gain a destination

```json
{
  "id": "WO-277-D030",
  "date": "2026-11-15",
  "dispatch": "resume: final review; the second meta critic's report, 19:09 to 19:20 UTC on 2026-11-15",
  "decision": "Launch 2 ran 17 min on gpt-6-astra at max, by the launcher's own line, and returned five criticisms, three things to keep and one first change. The report was given to the operator whole at 19:10:55 UTC, in a message the host's transcript holds, before any answer, and is repeated in the turn's closing message with these answers. Four of the five points are about the executor's two sessions and the fifth about a routing this review had already made. Each was checked against its source before it was answered, and each is accepted. First, a closeout that precedes the checks of what it hands off: the control log's ImplementationReady and RepairCompleted events each record that outputs were not read at their current bytes, and D014 records the capture written after its gate. The records need no correction. In this review every authored output is read at its final bytes before the result is recorded, nothing is written into this directory after the document gate, and a gate's result is stated from its own exit status and closing line. Second, a result announced before it was read: the repair's transcript says at 16:35:33 UTC that the fresh run exited 0 and reads exit 1 five seconds later. D019 and the handoff's gate table record the failure correctly, so nothing in the records changes; here a gate's result is said only after its exit status and summary are read, as the trial gate's was. Third, an inference recorded as a host behavior: the repair's transcript holds a 349-character message beside a tool call at 15:37:46 UTC under host 2.1.325, which contradicts the length rule that D010's follow-up and the handoff's fourth opening point state. This session adds to it both ways. Its transcript holds a 4,977-character message written beside a tool call, the critic's report as given, and holds text in only 18 of its 187 responses, 16 of them short, though the host's reminder to say what the session was doing is in 44 rows and the reviewer wrote a line after each, by its own account. Lines of any length are kept and lost, and the cause is not established. What that meant here: the reviewer's reading of the operator's direction, and its notice of the worker plan and of the transcript copy, were written before the launch in messages the transcript does not hold; the transcript holds both in the closing message of 18:59:05 UTC, seven minutes after the launch. The choice made before the operator could answer sends less to the other provider and not more, as in D010. The handoff is the executor's record and stays as written; the observation is recorded against D010, whose row returns to review with the cause open. Fourth, the follow-up queue's controls applied after the work: D016 records it as it happened and nothing in the product turns on it. This review repaired nothing in the order's surfaces and so queued nothing. Fifth, deferred findings left without a destination: the two the critic names are the ones D026 routes. The same check was then made over every finding the handoff lists as recorded. Each defect has a row or was repaired. Three improvements that D007 leaves to WO-281 have no row (R1-08, R1-09 and R1-10), and neither has one thing this review's own reading met: the page says an instance runs Claude Code alone until its configuration elects another host, and does not say how. The follow-up gives all four a destination. The first change the critic names, that the evidence is read before each claim and before the completion, is the order of this review's closing steps. Neither of this order's critics is in docs/evidence/WO-276/critic/criticisms.md, a closed order's record; the follow-up names their points for WO-279.",
  "evidence": [
    "The launcher's line, 'critic 2: gpt-6-astra at max; 17 min', and the host's task notice: dispatched 18:51:43 UTC, completed 19:09:06 UTC; the report, 4,586 bytes, in the ignored reviews lane as critic-2.md",
    "The process table at 19:09 UTC: no process of this launch; one other Codex worker, started about 19:00 UTC by a launcher in another checkout's session scratch, and an app-server nearly two days old, neither of them this session's and both left alone",
    "docs/control/orders/WO-277.jsonl: ImplementationReady (07:33:30 UTC) and RepairCompleted (16:59:27 UTC) each carry the advisory that outputs were not read at their current bytes, with the files it names; RepairCompleted also carries the advisory that the handoff lacks a self-review line",
    "Session scratch, critic/check-points.mjs over the copy the critic read: the repair's message of 16:35:33.396 UTC opens 'The fresh run exited 0', and its next tool result, at 16:35:38.480 UTC, opens 'exit 1' with the failed close file; the repair's response of 15:37:46.737 UTC holds 349 characters of text with the stop reason tool_use under version 2.1.325; text beside a tool call in the three sessions: the implementation 27 responses, none over 200 characters and the longest 188; the repair 55, three over 200 and the longest 349; this session 15 at 18:50 UTC, none over 200",
    "Session scratch, critic/own-messages.mjs and critic/nudges.mjs over this session's live transcript at 19:14 UTC: 187 responses, 18 holding text, 16 of them of 200 characters or fewer; the two longer are the closing message of 18:59:05 UTC (1,993 characters, the end of a turn) and the message of 19:10:55 UTC (4,977 characters, beside a tool call); 44 rows hold the host's reminder",
    "D007's roundFindings R1-08, R1-09 and R1-10, each an improvement and recorded; D009's follow-up, which names the regression case alone; docs/work-orders/WO-281-the-kit-guide-is-easy-to-follow.md, which names none of the three; the 2026-11-14 pass's section of the operator's commands, item 3, and docs/KIT.md, Taking upstream updates: a host is elected under features in dotln.config.json and the emit is run"
  ],
  "rejected": [
    {
      "option": "Answer only the point that names this review",
      "reason": "The critic was asked for on this order and the executor's sessions are the conduct it read; a point left unanswered is a report left unjudged, which WO-276-D145 names as the cost of a critic at a closing."
    },
    {
      "option": "Correct the handoff's fourth opening point",
      "reason": "The handoff is the executor's record of its own execution. The observation against D010 is where the contrary evidence is kept, and the register row returns to review with it."
    },
    {
      "option": "Add both critics' points to WO-276's criticisms file now",
      "reason": "It is a closed order's record outside this order's surfaces, and this order's first critic was not added either; the follow-up carries the points to the order that makes the critic the kit's."
    },
    {
      "option": "Raise the unanswered host election to a finding of the review",
      "reason": "The sentence says what main's page said, in fewer words; it is an improvement the order did not ask for, routed with the three others."
    }
  ],
  "followup": "Planning: (1) four things about the commands page that WO-281 weighs and that no row held. R1-08: the step paragraphs quote what commands print and point at blocks by position, and no check ties a quoted line to its producer. R1-09: a step's paragraph is one long comment line that the rendered guide does not show, printed whole before the step's blocks, and the page's opening still calls it a sentence. R1-10: what an absent terms list does is said in three places in the guide. And from the final review's reading: the page says an instance runs Claude Code alone until its configuration elects another host and does not say how to elect one, the feature key and the emit that the 2026-11-14 pass's section gives in its third item. Allocate each to WO-281 or decline it. (2) WO-277's two critics' accepted points are in D009 and D030 and not in docs/evidence/WO-276/critic/criticisms.md, which WO-279 reads when it makes the critic the kit's. Their classes: a result announced before it was read, twice; a completion made over outputs not read at their current bytes, twice; an inference recorded as a host behavior; a queue's controls applied after the work; a deferred finding left without a destination; a test case added against a non-goal; and times in a record that did not match the host's. Add them where WO-279 keeps the list. Priority: (1) with WO-281; (2) with WO-279.",
  "reopens": {
    "decisionId": "WO-277-D010",
    "observation": "The length rule D010's follow-up states is contradicted, and the cause of the missing messages is not established. Under host 2.1.325 the repair's transcript holds a 349-character message written beside a tool call (15:37:46 UTC on 2026-11-15), and the final review's transcript holds one of 4,977 characters (19:10:55 UTC) while holding text in only 18 of its 187 responses, 16 of them short, though 44 rows hold the host's reminder to say what the session was doing and the reviewer wrote a line after each by its own account. Lines of any length are kept and lost, so a limit on a mid-turn line's length in the role text would not answer it. What stands of the follow-up: establish what the host does with a line written between tool calls, and until then put what the operator must have in a turn's closing message."
  },
  "reopenWhen": "The operator answers a point otherwise; the host is shown to display the lines its transcript lacks; or WO-279 lands and keeps critics' points in a place of the kit's own."
}
```
