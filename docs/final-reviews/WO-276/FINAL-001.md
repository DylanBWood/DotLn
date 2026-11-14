# WO-276 — FINAL-001

**Verdict:** fail. Three acceptance criteria are unmet (25, 28 and 98) and six behaviors `main` had are broken on inputs an author's ordinary work produces, each reproduced by this review with a probe kept beside the order's evidence. The 127 other judgeable criteria are met and the three recorded contradictions (51, 121 and 123) are confirmed. No source file and no standing document was edited, no complete run was started, and nothing is committed or published: the repair follows under its own dispatch.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.323","model":"claude-fable-5-2","effort":"max","source":"claude-session-readback"}

**Process cost:** entry 104596 tokens; handoff 137611055 tokens; source claude-transcript-message-usage

Both readings are dispatch-scoped and count every request's tokens, cached input included: the entry reading was taken at 22:36:44 UTC on 2026-11-13 and the handoff reading at 00:37:48 UTC on 2026-11-14, before the document gate and the result. Of the handoff total, 135,745,235 tokens are cached input and 504,672 are output; reasoning tokens and dollar cost are unknown (the counter is unavailable). Twenty workers were launched, the whole of what this dispatch may use: sixteen that each read one batch of the change and, after them, four that read what those sixteen declared unread. Each was the instance table's `default` on Claude as `npm run worker -- show default` printed it (the generated `dotln-worker` definition, which holds claude-opus-5-5 at xhigh: requested values, with no readback of a worker's effective model or effort). None was re-tasked. The host's completion notices give them 6,554,785 tokens in all ([worker-census.json](../../evidence/WO-276/final-review-001/worker-census.json)); whether the session's own total holds any of that was not read. The dispatch stood at 2 h 1 min of its 8 h 0 min at the handoff reading, with no complete run of the three it may start. The model and effort are the session's own: effort `max` read from `CLAUDE_EFFORT`, which is the selected effort and not the effective one, where the order recommends xhigh for the reviewer; the harness version is the one the session's hook observed. Compared with the equivalent outcomes: reusing the complete row at the judged identity saved a complete run, 0 h 57 min the last time; the sixteen readings ran side by side and the longest took 0 h 28 min, and the four of the second reading ran side by side and the longest took 0 h 29 min, where the change (44,462 added and 16,472 removed lines in 394 tracked files, and 43 untracked paths) does not fit one reader's context; and failing costs a fix dispatch, a verification and a second final review, against a pass that would have published the nine defects. The second reading and the rehearsed update lengthened this review and found one more blocking finding, three more readers under criterion 25 and the update's missing step, which the next review or the first instance to update would otherwise have met.

## What was judged, and what stood before any finding

Dispatch: `resume: final review`, recorded by the session's hook through [VER-005](../../verifications/WO-276/VER-005.md), which allocated this report; the session did not repeat it. Subject: the uncommitted WO-276 working tree over `0097fcac608bcaa24c51c8b6d6020fc2382ea141`, which is `main`, `origin/main` and the branch's base alike, at code identity `46946378783201d5255fc2480a215269e2822907a48e9a12232c16badc925323`. `npm run worktree -- integrate WO-276` took in nothing.

Read by the reviewer: the whole [order](../../work-orders/WO-276-the-queue-lands-as-one-order.md); [VER-001](../../verifications/WO-276/VER-001.md) to [VER-005](../../verifications/WO-276/VER-005.md); the publication contract and the execution guide's section on verification and review; the [handoff](../../evidence/WO-276/handoff.md)'s parts, its list for the release's notes and its actor section; every decision heading and decisions D057, D073, D077 and D139 to D153 whole; [planning receipt 068](../../planning/refutations/2026-11-10-planning-da117019a9ace148-068.md); and the passages each finding below stands on. The diff as a whole was read in sixteen batches by the workers, each with its part's design, steps, criteria, known issues and non-goals, a common standard for a finding and no conclusion of the reviewer's. A worker's claim was taken as a lead: every finding the verdict rests on was run again by the reviewer, against the base's code where it is a regression. Each of the sixteen reports ends with what its reader did not read, and those lists were then read: four more workers took the planning and document readers that moved, the lifecycle, publish and release commands whole, the hook runtime's reader of a command line with the launchpad and the harness libraries, and every test, fixture and expected output the change removed, loosened or rewrote. The reviewer read the remaining sources itself and took this release's kit into an instance of the previous release's by the kit guide's own steps, which no suite and no evidence of the order does ([WO-276-D164](../../evidence/WO-276/decisions.md#wo-276-d164--the-second-reading-the-files-the-first-sixteen-readers-left-unread-and-an-update-from-the-previous-releases-kit-add-one-blocking-finding-three-readers-under-criterion-25-and-nineteen-follow-ups)).

The complete review row recorded at 21:53:35 UTC stands at the judged identity: 48 suites, 125 fresh tasks, none displaced, 0 h 57 min ([gates.json](../../evidence/WO-276/final-review-001/gates.json)). The five Preflight suites it does not hold are document suites, which the document gate runs. So no complete run was owed, and none was started.

Every blocking claim of the verification sequence reproduces as repaired ([reproductions.json](../../evidence/WO-276/final-review-001/reproductions.json)): thirteen of the verifiers' retained probes pass in their repaired form, the two that were written to assert a defect now fail on that assertion, and the eight reader comparisons that VER-002 and VER-003 named run and name every difference.

| Report | Verdict | Blocking findings | Here |
| --- | --- | --- | --- |
| [VER-001](../../verifications/WO-276/VER-001.md) | fail | the comment check skipped two file extensions and read a regular expression as a comment | repaired |
| [VER-002](../../verifications/WO-276/VER-002.md) | fail | eleven: the screen's file selection, a deleted target record, the checkpoint's ignored files, a header cut inside a code span, three readers without comparisons, an archived close, an unread host election, a path in the host report, an execution record's labels, the day's lower bound, a withdrawn target order | repaired |
| [VER-003](../../verifications/WO-276/VER-003.md) | fail | a directory that became a file, four more readers without comparisons, a source named by its suffix alone | repaired |
| [VER-004](../../verifications/WO-276/VER-004.md) | fail | the cleanup selected a live command line | repaired |
| [VER-005](../../verifications/WO-276/VER-005.md) | pass | none | this review disagrees on criteria 25, 28 and 98 |


Read-only checks at the judged tree all pass ([checks.json](../../evidence/WO-276/final-review-001/checks.json)): the four structural checks, `node scripts/harness.mjs check`, the feedback evidence check, the document check, the publication check, the index check, the planning check, the format check and the whitespace check.

## Blocking findings

Each was present in the subject the verifications judged and inside their instructed scope, so each is classed an escape; none arose from integration, which took in nothing, or from release preparation, which this review did not run. [WO-276-D154](../../evidence/WO-276/decisions.md#wo-276-d154--final-001-fails-on-nine-findings-the-review-reproduced-three-criteria-unmet-and-six-behaviors-of-main-broken-and-the-repair-is-the-fix-dispatchs-and-not-the-reviewers) records the verdict, the repair rules and why the review repairs nothing itself.

### F1 — The close reads an unmerged branch as merged (criterion 98)

The close's rebase rule looks, for each of the branch's commits, for a base commit that is that commit's change exactly, and takes the first one it finds. Nothing asks the base commits to be different ones. A branch that makes a change, reverts it and makes it again holds two commits with one change; where the base holds only the earlier commits replayed, the first replayed commit answers for both. The probe builds that history: four branch commits, three of them replayed onto a base that also gained an unrelated commit. The branch's tip holds the change, the base's does not, and the answer is merged, by rebase, with three base commits matched ([rebase-reuse.json](../../evidence/WO-276/final-review-001/rebase-reuse.json), [probe](../../evidence/WO-276/final-review-001/rebase-reuse.mjs)). The close then removes the worktree and deletes the branch. Main refused this, since the branch is no ancestor of the base. The input is ordinary Git: a repair that reverts an approach and restores it, and a team that rebase-merges an earlier head of the pull request. Repair rule: each branch commit takes a base commit that no earlier commit took, later in the base than the last one matched; where none is left the close refuses and names `--merged-as`. A case holds the probe's shape.

### F2 — The terms screen can run for hours on a file of numbers (regression)

Where a run of digits opens a line as a numbered item's marker does, the search for a listed entry goes on both with the number and without it, and a candidate is cut off by its length alone, never by whether any entry begins that way. A decimal at a line's start counts as such a marker. On a column of them every line doubles the work until the longest entry's length is reached, so the cost grows with that length: one hundred lines take 2 ms at the base, 1.0 s now with one entry of 19 letters and digits (the kit's own example host) and 6.9 s with one of 23 ([terms-numbered-lines-cost.json](../../evidence/WO-276/final-review-001/terms-numbered-lines-cost.json), [probe](../../evidence/WO-276/final-review-001/terms-numbered-lines-cost.mjs)). That is about 1.6 times for each further letter, which puts an entry the length of a URL at hours for the same hundred lines; the design names a URL as an entry a list holds. Every screen calls this search: the document gate's terms task over each line a branch adds, both publishes and the export. A data, log or evidence file with a decimal a line, or a numbered list of short items, is what meets it; this branch's own 819 files do not, with the nine entries of this checkout's list. Repair rule: a candidate is extended only while it is the beginning of some entry. A case bounds a thousand number-led lines under an entry of forty letters.

### F3 — A dollar figure in two header fields loses the field between them (regression)

The carried parser reads what stands between two dollar signs as inline math, across lines. An order's header is one paragraph of labelled lines, so with a dollar figure in one field and another in a later one, every label between them is inside the math span and opens no field. The probe gives the Cost a dollar figure and the Release classification another: the current reader finds no Release classification, on which release preparation refuses, and reads the Cost on over the lost label, where the base's reader reads both ([dollar-fields.json](../../evidence/WO-276/final-review-001/dollar-fields.json), [probe](../../evidence/WO-276/final-review-001/dollar-fields.mjs)). With a figure in one field alone both readers agree, which is why no committed order differs and every header comparison is equal. Any label can be the one lost: the repository, the workstream, the dependencies, the review ladder. Dollar figures are what a Cost line holds, and this order's own Part J and Part P add dollar estimates and a daily figure in dollars. The order's known issues cover readings that differ where the parser reads CommonMark; inline math is not CommonMark. Repair rule: the field reader takes the parser's extension spans, inline math among them, as text, so a label that opens a line inside one opens a field. A case holds a header with a dollar figure in two fields.

### F4 — The refused mission check names no launcher (criterion 28)

A resident started through the package's own entry holds no reader of mission documents. Its refusal of a mission check is built with a reason that names `scripts/resident.mjs`, and the episode then records the failure's code alone. The probe runs such a resident over the mission fixture with a process double in the worker's place: the hold's reason reads that the check returned no judgment, with the code, and the event log, the runtime status and the status and audit commands name no launcher ([unread-refusal.json](../../evidence/WO-276/final-review-001/unread-refusal.json), [probe](../../evidence/WO-276/final-review-001/unread-refusal.mjs)). The case that holds the criterion asserts the reason at the point where it is built, before it is dropped. The console's rendering of the same resident does name the launcher, on its work-orders line, which is the criterion's other clause. Repair rule: what the resident records of the refused check names the launcher, as a bounded detail of the observed failure or in the hold's reason, and a case runs a resident with the adapter that holds no reader and reads the recorded hold or status. The check must stay a held check with no judgment: refusing the dispatch as an unavailable actor would let work run with no mission check.

### F5 — A presence command fails while the launcher's resident reads its cards (regression)

The store publishes its runtime status inside its append lock, and the publication reads the work-order cards. A resident started through the launcher reads them from a card source that runs the index command whenever a file the cards derive from has changed: 5.8 s in this repository. A helper that wants the lock tries two hundred times, ten milliseconds apart, and gives up. The probe starts a resident each way over a fresh store and runs the presence command 1.5 s later: under the launcher it exits 1 after 4.3 s, saying the worker host refused, and under the package's own entry it succeeds in 0.2 s ([presence-during-card-refresh.json](../../evidence/WO-276/final-review-001/presence-during-card-refresh.json), [probe](../../evidence/WO-276/final-review-001/presence-during-card-refresh.mjs)). The base read one page inside the same lock. The window opens at each start and again after any change to an order, a control log or the configuration, and it grows with the number of orders; the heartbeat the hooks send meets it as the operator's presence lines do. Repair rule: the cards are read before the lock is taken, or the last good text is published while they are read. A case holds a helper's transaction completing while the owner's card source is slow.

### F6 — The live walkthrough lost its work orders (regression)

`packages/console/fixtures/live-walkthrough.mjs` builds its resident host with the path of the index page, the option this order replaced with a card source. The file is not type-checked, so the host ignores it, and the walkthrough the console's README describes shows its work orders as unavailable with the instruction to start the resident through the launcher, where the base listed them ([walkthrough-option.json](../../evidence/WO-276/final-review-001/walkthrough-option.json), [probe](../../evidence/WO-276/final-review-001/walkthrough-option.mjs)). The impact is one screen of a walkthrough; it is a caller left on a contract this order changed. Repair rule: the walkthrough hands over the card source, and the host refuses an option it does not know, or a case loads the walkthrough's own construction.

### F7 — Six moved readers have no comparison (criterion 25)

Part B's rule is that each reader that moves is run beside the one it replaces over every committed input, and criterion 25 asks for that comparison for each. VER-002 and VER-003 each failed the order on readers left out. Six more are. Three were found in the first reading: the Front page field's reader, which read a line by its opening and now reads the work-order reader's field; the reading of an integration note in a decisions file, in release preparation and at integration, which tested for a comment's text and now reads the parser's comments; and the masks of the generated blocks in the root instruction file and the front page, which were patterns and are now the shared marker-block reader. Three were found in the second: the publication check's reader of the links a page makes into the product documents and its reader of the section under a voice's heading, which were a pattern and a search for the heading's text and are now the shared link and section readers; and the dependency migration's removal of the standalone dependencies block, which was a pattern and is now the marker-block reader. Neither `scripts/lib/front-page-scope.mjs` nor `scripts/lib/worktree-integration.mjs` has a row in the comparison map, the rows of the other three files name other readers, and the driver calls none of the six ([comparison-coverage-gaps.json](../../evidence/WO-276/final-review-001/comparison-coverage-gaps.json), [probe](../../evidence/WO-276/final-review-001/comparison-coverage-gaps.mjs)). The inventory's screen has no form for a marker comment, which is how three of them were missed. Workers ran the base's readers beside the worktree's: over 1,464 order revisions, 229 decisions revisions, 33 revisions of the root instruction file and 218 of the front page for the first three, and over the publication pages and the 224 orders that hold a dependencies block for the others. Every reading is equal but for a trailing blank line in a voice's section, so no behavior is in question and the repair is the evidence: the six comparisons, their rows, and the marker-comment form in the inventory.

### F8 — Verification runs the instance's code before it has checked the runtime (regression)

Kit verification walks the manifest's files in order. For a generated harness surface whose bytes differ it now asks the instance's own harness check, a child process that loads the carried compiled runtime; for a compiled runtime file that differs it refuses. Surfaces sort before packages, so where both differ the instance's code runs first. The probe gives a synthetic kit root one of each and a stand-in harness script that records that it ran: the base refuses on the runtime file and the stand-in has not run; the candidate gives the same refusal after the stand-in has run ([verify-order.json](../../evidence/WO-276/final-review-001/verify-order.json), [probe](../../evidence/WO-276/final-review-001/verify-order.mjs)). The function's own comment says that carried compiled code is verified before it is run. A differing surface is the ordinary state of an instance that uses the settings fragment or the workers section this order adds; a differing runtime file is corruption or a hand edit. Repair rule: every compiled runtime file is compared before any check of the instance's is run, with a case that holds that order.

### F52 — The criteria reader loses every criterion after a line that opens with a tag (regression)

An order's acceptance criteria are one numbered list, and the lifecycle reads the list's items. Where a wrapped line of a criterion opens with a word in angle brackets that is the name of an HTML block element (`<option>`, `<title>`, `<summary>`, `<details>`), the carried parser reads a raw HTML block that runs to the next blank line, as CommonMark does: the list ends there, and every criterion after it is text inside the block. The reader returns the items it is given and says nothing of the rest. The probe's first input is no fixture. It is this order as the planning pass filed it, where a wrapped line of criterion 78 opens with such a placeholder: the base's reader returns 133 criteria and the candidate's 78, and the candidate's own planning-subject reader, which reads on through the block so that a filed receipt still matches, returns 133 for the same text ([criteria-html-block.json](../../evidence/WO-276/final-review-001/criteria-html-block.json), [probe](../../evidence/WO-276/final-review-001/criteria-html-block.mjs)). [WO-276-D011](../../evidence/WO-276/decisions.md#wo-276-d011--criterion-78s-lines-are-re-wrapped-so-the-criteria-list-is-one-list-the-operators-report) records the re-wrap the executor made after the operator reported how the order rendered, and with it both readers return 133. In a five-criterion order of the same shape the last two criteria claim the document gate and the review gate, and with the shortened list the closeout selection takes no claim from them. What else follows a shortened list: the handoff refuses the executor's lines for the missing criteria as not declared by the order, which is loud and names the wrong cause; a waiver or a defect record for one of them is refused; and the index's criteria screen passes over them. A placeholder in angle brackets is how the planner writes a command's argument, and a line wraps where it wraps. D011 chose the parser's reading over a reader that reads raw text again, and that stands; what is missing is the refusal. The order's known issues name six readings the parser changes, each with its comparison. This is none of them, and since the re-wrap no committed order holds the input, so no comparison shows it. Repair rule: wherever anything but the numbered list and blank lines stands between the criteria label and the next label or heading, the reader refuses, naming the line and the remedy (a code span, a backslash before the bracket, or a re-wrap), and never returns a shorter list; the planning check meets the same refusal when an order is filed. A case holds this order's filed lines.

## The three recorded contradictions

Each is confirmed with this review's own evidence on its criterion line below, and two workers who were given no conclusion reached the same reading clause by clause. In each the part that can hold does: the rule table's check and its document case pass; the attribution verdict is made under the names the base judged; and the cache reads nothing for a settled file and records a full read's hash. None is judgeable as written, so none is a finding.

## Follow-ups

Sixty-two findings break no criterion and no behavior `main` had on an input a writer of the kit is shown to produce, or are what the order's own design orders, and are boarded with the action each needs: forty-three by subsystem from the first reading and nineteen from the second. Those that stand in the order's declared surfaces are the repair's to take within its bound; the rest are planning's.

- [WO-276-D155](../../evidence/WO-276/decisions.md#wo-276-d155--follow-ups-on-the-terms-and-verbatim-screens-a-quoted-sentence-inside-a-code-span-passes-a-list-written-before-this-release-can-change-meaning-and-the-guides-never-refuses-sentence-leaves-out-a-target): the terms and verbatim screens (F9 to F11). The first is the one to read: a sentence of the operator's copied whole into one inline code span passes the verbatim screen ([verbatim-code-span.json](../../evidence/WO-276/final-review-001/verbatim-code-span.json)), because the design makes a code span one word. The criterion holds as written and the order ordered it; it weakens the one mechanical hold on the rule that the operator's words stay in ignored intake.
- [WO-276-D156](../../evidence/WO-276/decisions.md#wo-276-d156--follow-ups-on-the-hooks-and-the-days-figure-a-list-matcher-the-host-reads-as-a-search-a-workers-monitor-task-the-fixed-tick-and-a-codex-session-that-is-shown-no-figure): the hooks and the day's figure (F12 to F15).
- [WO-276-D157](../../evidence/WO-276/decisions.md#wo-276-d157--follow-ups-on-the-runner-and-the-host-task-shard-forms-that-run-in-every-shard-two-inherited-variables-that-empty-a-shard-the-file-events-refusals-one-remedy-and-an-advisory-that-names-cores-suites-in-a-kit-root): the runner and the host task (F16 to F19). The file-events daemon's refusal, added in the repair of VER-003, reaches an instance's gate with one remedy that needs an administrator.
- [WO-276-D158](../../evidence/WO-276/decisions.md#wo-276-d158--follow-ups-on-the-readers-and-their-evidence-two-exemptions-by-path-the-document-checks-parse-ceiling-a-case-that-cannot-fail-and-a-mission-contract-that-reads-longer-for-59-orders): the readers and their evidence (F20 to F28).
- [WO-276-D159](../../evidence/WO-276/decisions.md#wo-276-d159--follow-ups-on-a-targets-close-a-named-merge-commit-that-touches-none-of-the-reviewed-paths-a-squash-the-base-reverted-and-a-read-of-the-bases-patches-at-every-status): a target's close (F29 to F31).
- [WO-276-D160](../../evidence/WO-276/decisions.md#wo-276-d160--follow-ups-on-updates-and-a-new-instance-a-grafted-clone-refused-for-the-wrong-cause-and-a-marker-form-the-step-does-not-describe): updates and a new instance (F32 and F33).
- [WO-276-D161](../../evidence/WO-276/decisions.md#wo-276-d161--follow-ups-on-the-cleanup-of-codexs-background-server-and-on-the-usage-classes-a-wrapper-run-that-is-not-yet-counted-as-live-and-a-class-sum-that-covers-some-rows): the cleanup of Codex's background server and the usage classes (F34 and F35). The cleanup was read against its recorded rule alone: it signals only the three recognized roles under one orphaned daemon.
- [WO-276-D162](../../evidence/WO-276/decisions.md#wo-276-d162--follow-ups-on-the-planning-routes-and-the-role-text-a-release-note-contract-an-instance-can-no-longer-switch-on-a-site-the-guide-leaves-out-a-register-read-the-planner-is-not-told-of-and-a-rule-table-that-later-orders-must-rewrite): the planning routes and the role text (F36 to F41).
- [WO-276-D163](../../evidence/WO-276/decisions.md#wo-276-d163--follow-ups-in-standing-documents-sentences-the-kit-guides-update-section-is-said-to-carry-and-does-not-a-seeds-check-that-names-three-files-of-four-dated-accounts-a-stale-synopsis-and-four-passages-that-still-call-the-teammate-ready-rung-10): the standing documents (F42 to F51). Every documentation criterion is met and every changed passage not named there is a replacement that states the current rule. Product 07 gained two dated accounts and the sequence one stale clause, which return to repair with the order; this review edited no document, since the repair owns the candidate.
- [WO-276-D164](../../evidence/WO-276/decisions.md#wo-276-d164--the-second-reading-the-files-the-first-sixteen-readers-left-unread-and-an-update-from-the-previous-releases-kit-add-one-blocking-finding-three-readers-under-criterion-25-and-nineteen-follow-ups): the second reading (F53 to F71): the planning readers, the lifecycle commands, the hook runtime's reader of a command line, and the tests and fixtures the change removed or loosened. Two are for the first instance that updates. The kit guide's update steps leave an instance's features page stale, so its first document gate fails naming `npm run sync` and passes after it ([upgrade-rehearsal.json](../../evidence/WO-276/final-review-001/upgrade-rehearsal.json), [the rehearsal](../../evidence/WO-276/final-review-001/upgrade-rehearsal.mjs)). And a planning receipt filed before this release is refused after it where an order holds a paragraph that opens with bold words and is no label, after its criteria or its non-goals ([receipt-subject-drift.json](../../evidence/WO-276/final-review-001/receipt-subject-drift.json), [probe](../../evidence/WO-276/final-review-001/receipt-subject-drift.mjs)). That reading is one the design names as expected, no committed order holds the shape and all 68 of this repository's receipts validate, so it is boarded with its repair rule and does not block; an instance whose receipt is refused makes it blocking.


Carried from the verification sequence and not counted again: VER-002's seven follow-ups (WO-276-D130, WO-276-D131), the repair reviews' (WO-276-D128, WO-276-D138) and the intermittent discovery timeout (WO-276-D151). One worker met VER-002's finding that the failures report counts two of this order's rounds as paired, which WO-276-D131 carries.

## The planning receipt's known issues

Receipt 068 named thirteen known issues, each with the observation that reopens it. Four of those observations were met in this order and are stated here for the next pass. The terms screen's status line reports no refuse entry on this checkout's own list, which holds nine entries, all unmarked: from this release none of them stops a gate, a publish or an export until its owner moves it under `refuse:`. The first verification failed on criteria of one part alone, Part B. The executor's installed root grew, from 37,939 to 42,964 bytes by a worker's measure, while the release close's fell from 22,014 to 18,744. And this repository's emitted matchers take the list form, since it elects a host whose reading of a matcher is unobserved, so a tool name the table does not hold no longer starts the narrowed hooks here (WO-276-D105). The four steps added for the instance's asks, which the receipt found without a documentation criterion, are each stated in the kit guide or product 07.

## For the release's notes

No notes are written by a failing review. The twenty readings and the rehearsed update gathered what an upgrading instance must be told beyond the handoff's own list, and it is kept here for the review that writes them.

- Before taking the release: move each entry that must never appear under `refuse:`; reread any entry that holds a number sign after a space, which now opens a comment, or opens with `context:`, which is now a marker. A context entry still holds a target's publication for the reviewer's confirmation and still refuses the planning publication into a target.
- After the update: where the roadmap carries the release-history block, `npm run release -- list --markdown --write` writes the tag record with the table's boundary and renders the index; otherwise `npm run work-orders -- index`. Both records are committed with the pages. Running the index first leaves the roadmap's check failing until the release command runs. The generated pages carry no data comments; a reader of them takes `npm run work-orders -- index --json`.
- On the update's branch, before it is published, as the rehearsed update showed: `npm run sync`, and commit what it regenerates. This release changes two rows of the features page, and an instance that follows the guide's steps alone meets a first document gate that fails naming the sync. Then `npm run plan -- check`: a receipt refused there as not matching its committed sources is F54, for which this review found no route but to revert the update's merge and report it in `FOR-CORE.md`.
- From the second reading: a malformed Review ladder line refuses; an order that shows its header's form in a fenced block inside a list item or a quotation is refused as a duplicate; the standing file is deleted at its phase's end; a publication prints a `CONTEXT` line for each context-mode match; the gate refusal and the launch count read pnpm, yarn, Corepack and `node --run` spellings and npm's aliases; a hook input whose `background_tasks` is no array is refused; `dotln.models.json` is read on every load of the configuration and `roots.*` may not lie under `extensions/`; an update asks the instance's own harness check as a child process; follow-up candidates whose source the parser reads differently change identity and are disposed again; preflight advisories print in the planning check; a Markdown discovery profile is refused; and `scripts/check-role-oracle.mjs`, the role-oracle task and the self-host modes of `scripts/console-fixtures.mjs` are gone, with a target's bundle at six hook files where it had seven.
- A resident is started with `node scripts/resident.mjs`; a script or service that starts the package's own entry for a bound store must change. A store pinned before the release on one of 59 older orders reports a changed contract clause until it is bound again. The resident's and the console's library contracts changed with `@dotln/skeleton` 0.91.0 and `@dotln/console` 0.6.0, and `@dotln/compiler` is 0.44.0.
- Hosts: a host that only a discovery record showed is off; elect it under `features` and run `node scripts/harness.mjs emit`, or the next emit removes its surfaces. A seeded first order that has not run keeps its old text: its authority, checklist, deliverable and second and third criteria are those of `scripts/kit/first-order.template.md` now. `node scripts/doctor.mjs` reports a host before any install and exits 1 where a row is unmet.
- Seeds and kit files: `.gitattributes` (a clone whose line endings Git had converted runs `git add --renormalize .` once), `FOR-CORE.md`, `docs/OPERATOR.md`, `THIRD_PARTY_NOTICES` and the carried parser with its license and notices, about 650 KB. The seeded repository-profile and workstreams pages changed; an instance keeps its own and finds the new text in the kit guide and the two templates.
- Updates: the publish judges the update's own merge and takes `--from` and `--take`; it refuses a revision no fetched ref names, a merge that joins more than two lines, a second starter revision on one branch, a clone too shallow to hold the merge base and histories that share no commit. An instance that took v0.121.0 or v0.122.0 by merge compares its first order's text and its budgets file with the commit before that update's merge. The plan and the preview gain the `re-emitted:` row and the preview the floor lines and the files both sides changed.
- Workers and models: the two per-model worker definitions leave at the next emit; workers are names bound to models in the `workers` section and `dotln.models.json`, both judged when the configuration loads; ten names are reserved; the words after a dispatch phrase select nothing; `npm run worker -- list` and `-- show` say what a name runs; `npm run meta -- --usage` reports tokens by class and day.
- Hooks and bounds: the presence hooks leave and the heartbeat runs inside the hooks that already run; a worker's stop is refused once while a task it started is live; `accept-overrun` takes `subagentCap`; a Claude Code completion attests the version its hook observed; the bound counts worked time; `spend.daily` is optional and any other shape of `spend` refuses the budgets' load.
- Gates: on macOS a gate shows the file-events daemon's size and refuses above 1 GiB, with `sudo killall fseventsd` as its remedy, or a restart of the machine where there are no administrator rights; a gate started inside a running gate is admitted at warning memory pressure; a kit root's host check is sized to the tasks its gate carries; the document check refuses an instance source under `scripts/` or `packages/*/src/` that reads Markdown or JSON by pattern, and judges every Markdown file beside a registered profile as an area note; `extensions/` is outside both.
- Lifecycle: `npm run resume -- checkpoint`; a withdrawal of an order that was never activated, which a kit older than this release refuses to read; the status output's first key is `schemaVersion`; Release classification, Target release notes, Front page and Workstream are read from an order's leading header alone, so a declaration below the Objective is no longer read; a pull-request body with a hand-numbered item wrapped after prose is refused; in a kit root no order switches the release-note contract on.
- Targets: `repositories.<id>.records`; `contributions.authors`; a close that accepts a squash or a rebase and takes `--merged-as`, and deletes the local branch after such a match.
- Core's own: the kit ends the background server a Codex session leaves, at a worker's return and at a lifecycle dispatch from another host; this release is v1.0.0 and the roadmap's Teammate-ready rung is v2.0.0, with its anchors renamed.


## Limits

A met line below stands on the complete row at the judged identity, the verification sequence and one worker's reading of the cases it names, with the reviewer's own run where the line says so; it is not a second execution of every fixture. No host but this one was exercised. One instance's gates were run: an instance of the previous release's kit, made in scratch, before and after it took the update, as the rehearsal beside this review's evidence records. The instance on the operator's work machine was not read, and what its documents and its planning receipts hold is unknown. The workers ran single cases and probes under the bounded wrapper and started no gate; cases that build an export or run a nested gate were read and not run. Three workers disclosed that a search of theirs printed path lines or file names from the ignored local lane, and used nothing from them. The second reading left unread, by its readers' own account, the added-only cases of the three largest suites (about 9,800 added lines, of which the hunks that remove lines and the cases that replace them were read), the shell tokenizer beyond what 270 spellings of a command exercised, and the order's criteria ranges outside each batch. Browser and desktop checks do not apply to this change.

Terms context review: 0 listed context lines read. The branch screen found no refuse line and no context line over the changed files, before and after this review's own records; the list was read by no worker and is printed nowhere.

<!-- dotln-findings:start -->
```json
[
  {
    "id": "F1",
    "route": "blocking",
    "class": "escape",
    "summary": "The target close's rebase rule lets one base commit answer for two branch commits, so a branch whose last change the base never received is read as merged and deleted.",
    "basis": {
      "criterion": "98"
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/rebase-reuse.mjs"
  },
  {
    "id": "F2",
    "route": "blocking",
    "class": "escape",
    "summary": "The local-terms screen's cost on lines that open with a number grows about 1.6 times with each letter of the list's longest entry: seconds for a host name, hours for a URL.",
    "basis": {
      "regression": "Main screened a column of number-led lines in milliseconds whatever entry the list held."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/terms-numbered-lines-cost.mjs"
  },
  {
    "id": "F3",
    "route": "blocking",
    "class": "escape",
    "summary": "With a dollar figure in each of two header fields of an order, the field label between them is read as inline math and the field is lost.",
    "basis": {
      "regression": "Main read every field of an order's header where two of them held a dollar figure."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/dollar-fields.mjs"
  },
  {
    "id": "F4",
    "route": "blocking",
    "class": "escape",
    "summary": "A resident started through the package's own entry refuses a mission check without naming scripts/resident.mjs in anything it records or prints.",
    "basis": {
      "criterion": "28"
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/unread-refusal.mjs"
  },
  {
    "id": "F5",
    "route": "blocking",
    "class": "escape",
    "summary": "A resident started through the launcher runs the index command inside its store's append lock, and a presence command against the store in that window fails.",
    "basis": {
      "regression": "Main's presence command succeeded against the store of a running resident."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/presence-during-card-refresh.mjs"
  },
  {
    "id": "F6",
    "route": "blocking",
    "class": "escape",
    "summary": "The console's live walkthrough still passes the option this order replaced, so its live screen reports the work orders unavailable.",
    "basis": {
      "regression": "Main's live walkthrough listed the open work orders."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/walkthrough-option.mjs"
  },
  {
    "id": "F7",
    "route": "blocking",
    "class": "escape",
    "summary": "Six readers that moved onto the shared Markdown readers have no recorded comparison, and no row of the comparison map names one.",
    "basis": {
      "criterion": "25"
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/comparison-coverage-gaps.mjs"
  },
  {
    "id": "F8",
    "route": "blocking",
    "class": "escape",
    "summary": "Kit verification runs the instance's own harness check before it has compared the carried compiled runtime with the manifest.",
    "basis": {
      "regression": "Main's kit verification refused a changed compiled runtime file without running any of the instance's code."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/verify-order.mjs"
  },
  {
    "id": "F52",
    "route": "blocking",
    "class": "escape",
    "summary": "The lifecycle's criteria reader returns no criterion after a wrapped line that opens with a placeholder spelled as an HTML block element's name: 78 of this order's 133 as it was filed.",
    "basis": {
      "regression": "Main's criteria reader returned all 133 criteria of this order as the planning pass filed it."
    },
    "reproduction": "docs/evidence/WO-276/final-review-001/criteria-html-block.mjs"
  },
  {
    "id": "F9",
    "route": "follow-up",
    "class": "escape",
    "summary": "The verbatim screen passes a capture's sentence copied whole inside one inline code span, as the design's code-span rule orders; boarded in WO-276-D155."
  },
  {
    "id": "F10",
    "route": "follow-up",
    "class": "escape",
    "summary": "A list entry written before this release can change meaning without notice: a number sign after a space opens a comment and a line opening with context and a colon is a marker; WO-276-D155."
  },
  {
    "id": "F11",
    "route": "follow-up",
    "class": "escape",
    "summary": "The kit guide and the seeded instruction file say a context entry never refuses, and a target's publication and the planning publication into a target still hold on one; WO-276-D155."
  },
  {
    "id": "F12",
    "route": "follow-up",
    "class": "escape",
    "summary": "The writer hook's list matcher holds a dot, so Claude Code reads it as a search and the hook starts for the to-do tool; the suite's helper cannot see it; WO-276-D156."
  },
  {
    "id": "F13",
    "route": "follow-up",
    "class": "escape",
    "summary": "A worker's own Monitor task is never counted as its own at its stop; WO-276-D156."
  },
  {
    "id": "F14",
    "route": "follow-up",
    "class": "escape",
    "summary": "The authorship cache's tick is a fixed two seconds, so a file written just before a snapshot is always read again; WO-276-D156."
  },
  {
    "id": "F15",
    "route": "follow-up",
    "class": "escape",
    "summary": "A Codex session is never shown the day's figure and the kit guide does not say so; WO-276-D156."
  },
  {
    "id": "F16",
    "route": "follow-up",
    "class": "escape",
    "summary": "The shard helper registers a case with no title string, and the registration function's member forms, in every shard; WO-276-D157."
  },
  {
    "id": "F17",
    "route": "follow-up",
    "class": "escape",
    "summary": "An inherited shard or title variable reaches suites and bounded probes, where a shard file registers no case and passes; WO-276-D157."
  },
  {
    "id": "F18",
    "route": "follow-up",
    "class": "escape",
    "summary": "The file-events daemon's refusal names one remedy that needs an administrator, its limit is a constant, the host report holds no row for it and it applies in an instance's gate; WO-276-D157."
  },
  {
    "id": "F19",
    "route": "follow-up",
    "class": "escape",
    "summary": "In a kit root the preflight advisory names core-only suites; WO-276-D157."
  },
  {
    "id": "F20",
    "route": "follow-up",
    "class": "escape",
    "summary": "The vendor directory's attributes and the format ignore list exempt by path, so an unproven file there skips the whitespace and format checks; WO-276-D158."
  },
  {
    "id": "F21",
    "route": "follow-up",
    "class": "escape",
    "summary": "The document check's parse ceiling of 1 GiB leaves a peak of 2.17 GB against the bounded wrapper's 3.2 GB; WO-276-D158."
  },
  {
    "id": "F22",
    "route": "follow-up",
    "class": "escape",
    "summary": "The index parses the lead and then the whole order for 191 of 269 orders, and a comment says it reads no bodies; WO-276-D158."
  },
  {
    "id": "F23",
    "route": "follow-up",
    "class": "escape",
    "summary": "Criterion 20's Check names the work-orders suite, and the bare-copy case is in the launchpad export's file; WO-276-D158."
  },
  {
    "id": "F24",
    "route": "follow-up",
    "class": "escape",
    "summary": "The case that holds that importing the source reader loads no TypeScript cannot fail on a static import; WO-276-D158."
  },
  {
    "id": "F25",
    "route": "follow-up",
    "class": "escape",
    "summary": "Two advisory classifiers in the hook runtime still strip quotes with patterns of their own, as at the base; WO-276-D158."
  },
  {
    "id": "F26",
    "route": "follow-up",
    "class": "escape",
    "summary": "The mission contract reads differently from the base for 59 of 268 orders, so a store pinned earlier on one reports a changed clause; WO-276-D158."
  },
  {
    "id": "F27",
    "route": "follow-up",
    "class": "escape",
    "summary": "The resident's card cache does not watch whether a decisions file exists; WO-276-D158."
  },
  {
    "id": "F28",
    "route": "follow-up",
    "class": "escape",
    "summary": "The document check's case for the roadmap's missing record asserts the path and not the command named; WO-276-D158."
  },
  {
    "id": "F29",
    "route": "follow-up",
    "class": "escape",
    "summary": "A merge commit named with --merged-as is admitted where its own change touches none of the reviewed paths; WO-276-D159."
  },
  {
    "id": "F30",
    "route": "follow-up",
    "class": "escape",
    "summary": "A squash the base later reverted is accepted, and after a squash or rebase match the close deletes a branch whose commits are not in the base's history; WO-276-D159."
  },
  {
    "id": "F31",
    "route": "follow-up",
    "class": "escape",
    "summary": "Status and the drive read every base patch since the fork at each call while a closed target order awaits its merge; WO-276-D159."
  },
  {
    "id": "F32",
    "route": "follow-up",
    "class": "escape",
    "summary": "A merge base hidden by a grafts file is refused with the wrong cause; WO-276-D160."
  },
  {
    "id": "F33",
    "route": "follow-up",
    "class": "escape",
    "summary": "Step G3's marker form, a start and an end comment, was built as one comment above each block, and only a decision says so; WO-276-D160."
  },
  {
    "id": "F34",
    "route": "follow-up",
    "class": "escape",
    "summary": "The cleanup of Codex's background server does not count a wrapper run of the command line as live until its native child exists; WO-276-D161."
  },
  {
    "id": "F35",
    "route": "follow-up",
    "class": "escape",
    "summary": "A usage class is summed over the rows that reported it with nothing marking the rows that did not; WO-276-D161."
  },
  {
    "id": "F36",
    "route": "follow-up",
    "class": "escape",
    "summary": "In a kit root no order switches the release-note contract on, so an instance that relied on it loses it at the upgrade, unsaid; WO-276-D162."
  },
  {
    "id": "F37",
    "route": "follow-up",
    "class": "escape",
    "summary": "The kit guide's list of sites that compared an order's number omits the ledger exemption; WO-276-D162."
  },
  {
    "id": "F38",
    "route": "follow-up",
    "class": "escape",
    "summary": "After an order's file is removed the follow-up register's read refuses, and nothing tells the planner to read its revision first; WO-276-D162."
  },
  {
    "id": "F39",
    "route": "follow-up",
    "class": "escape",
    "summary": "The rule-by-role table lives in this order's evidence directory, so a later edit of a shared rule must rewrite this order's record; WO-276-D162."
  },
  {
    "id": "F40",
    "route": "follow-up",
    "class": "escape",
    "summary": "The release close's root holds no operator-controls rule, as at the base; WO-276-D162."
  },
  {
    "id": "F41",
    "route": "follow-up",
    "class": "escape",
    "summary": "The rule-record case counts whole lines, and the table's document case passes in core where the table is absent; WO-276-D162."
  },
  {
    "id": "F42",
    "route": "follow-up",
    "class": "escape",
    "summary": "The kit guide's update section lacks six sentences the order says it carries; WO-276-D163."
  },
  {
    "id": "F43",
    "route": "follow-up",
    "class": "escape",
    "summary": "The seeded first order writes four files and its terms check names three, as the kit guide does; WO-276-D163."
  },
  {
    "id": "F44",
    "route": "follow-up",
    "class": "escape",
    "summary": "The kit guide's list of instance files omits the attributes seed; WO-276-D163."
  },
  {
    "id": "F45",
    "route": "follow-up",
    "class": "escape",
    "summary": "Product 07 gained two dated accounts beside the scheduling rule and the sequence a clause that is no longer true; WO-276-D163."
  },
  {
    "id": "F46",
    "route": "follow-up",
    "class": "escape",
    "summary": "The legal page is classed standing while its entries are dated and its status line calls it a record; WO-276-D163."
  },
  {
    "id": "F47",
    "route": "follow-up",
    "class": "escape",
    "summary": "Product 07's synopsis of the review helper shows the removed model options and no effort flag, and one sentence names a Codex worker definition that is no longer emitted; WO-276-D163."
  },
  {
    "id": "F48",
    "route": "follow-up",
    "class": "escape",
    "summary": "Product 07 and product 08 each still say review-mode private terms; WO-276-D163."
  },
  {
    "id": "F49",
    "route": "follow-up",
    "class": "escape",
    "summary": "Four standing passages still call the Teammate-ready rung 1.0; WO-276-D163."
  },
  {
    "id": "F50",
    "route": "follow-up",
    "class": "escape",
    "summary": "This repository's note on the Copilot election cites the wrong decision; WO-276-D163."
  },
  {
    "id": "F51",
    "route": "follow-up",
    "class": "escape",
    "summary": "Smaller wording in the kit guide, the skeleton's README and the security page; WO-276-D163."
  },
  {
    "id": "F53",
    "route": "follow-up",
    "class": "escape",
    "summary": "The kit guide's update steps leave an instance's features page stale, so the first document gate after the update fails naming the sync; WO-276-D164."
  },
  {
    "id": "F54",
    "route": "follow-up",
    "class": "escape",
    "summary": "A planning receipt filed before this release is refused after it where an order holds a bold paragraph that is no label after its criteria or its non-goals, and no route files it again; WO-276-D164."
  },
  {
    "id": "F55",
    "route": "follow-up",
    "class": "escape",
    "summary": "The plan-first marker reader refuses a marker whose transformation text holds a comment's closing characters, which the base read; WO-276-D164."
  },
  {
    "id": "F56",
    "route": "follow-up",
    "class": "escape",
    "summary": "A level-one heading inside an idea-ledger section leaves the entries after it unchecked; WO-276-D164."
  },
  {
    "id": "F57",
    "route": "follow-up",
    "class": "escape",
    "summary": "The sibling registry's check reports a hand-wrapped Manifest hash item on two lines, which the classifier of generated artifacts does not match; WO-276-D164."
  },
  {
    "id": "F58",
    "route": "follow-up",
    "class": "escape",
    "summary": "An execution plan now ends at a standalone bold label, so fewer advisory paths are read, and the comparison does not name the class; WO-276-D164."
  },
  {
    "id": "F59",
    "route": "follow-up",
    "class": "escape",
    "summary": "An order that shows the header's form in a fenced block inside a list item or a quotation is refused for a duplicate Model line, where the base admitted it; WO-276-D164."
  },
  {
    "id": "F60",
    "route": "follow-up",
    "class": "escape",
    "summary": "A launchpad close given a named merge commit is refused and its recorded retry repeats the name (read from the source); WO-276-D164."
  },
  {
    "id": "F61",
    "route": "follow-up",
    "class": "escape",
    "summary": "The release list's write names the roadmap as written when only the tag record changed; WO-276-D164."
  },
  {
    "id": "F62",
    "route": "follow-up",
    "class": "escape",
    "summary": "Integration seeds the tag record from the branch's side, so its table boundary can disagree with a roadmap taken from main (read from the source); WO-276-D164."
  },
  {
    "id": "F63",
    "route": "follow-up",
    "class": "escape",
    "summary": "The hook's gate reading returns at the first reading that is the bounded wrapper, so one line no writer produces, which the base refused as a gate, is admitted; WO-276-D164."
  },
  {
    "id": "F64",
    "route": "follow-up",
    "class": "escape",
    "summary": "The hook's dispatch-bound trigger no longer knows the bounded wrapper started without its scripts path; the wrapper's own check still refuses past the bound; WO-276-D164."
  },
  {
    "id": "F65",
    "route": "follow-up",
    "class": "escape",
    "summary": "The operator-words advisory no longer reads text inside a tilde fence or after an unclosed fence; WO-276-D164."
  },
  {
    "id": "F66",
    "route": "follow-up",
    "class": "escape",
    "summary": "A lifecycle worker's writer is released only after its parent's state is read, so a throw there skips the release (read from the source); WO-276-D164."
  },
  {
    "id": "F67",
    "route": "follow-up",
    "class": "escape",
    "summary": "Step I3's sentence that the npm argument reader is unchanged was overtaken by a later decision without a known issue; WO-276-D164."
  },
  {
    "id": "F68",
    "route": "follow-up",
    "class": "escape",
    "summary": "The cold-start ceiling route lost its only executable check when the role-baseline chain was removed; WO-276-D164."
  },
  {
    "id": "F69",
    "route": "follow-up",
    "class": "escape",
    "summary": "The overlay case of WO-076 asserts manifest ids alone and cannot fail on a root that keeps an unequipped support's text; WO-276-D164."
  },
  {
    "id": "F70",
    "route": "follow-up",
    "class": "escape",
    "summary": "The card command the resident's launcher runs has no time bound, and the FIFO case lost its index arm (read from the source); WO-276-D164."
  },
  {
    "id": "F71",
    "route": "follow-up",
    "class": "escape",
    "summary": "The console's new index-record fixture input has no recorded provenance; WO-276-D164."
  }
]
```
<!-- dotln-findings:end -->


## Criterion judgments

Each line judges the criterion as the order writes it; the label in parentheses is the part's own.

**Criterion 1:** met. (A1) The terms-task cases of `scripts/test-runner.test.mjs` passed when run alone for the worker that read Part A, the relay of `CONTEXT` lines by a passing terms task among them; the status line here gives the entries in each class.

**Criterion 2:** met. (A2) The list case of `scripts/test-plan-refutation.mjs` (the two sections, a list written before them) passed when run alone.

**Criterion 3:** met. (A3) The same case; a worker's probe of invented entries found each of 23 joining separators joining and each of 25 others not, and an address and a host and port each matching their own spelling. F2 is the cost of the same search and not its answers.

**Criterion 4:** met. (A4) Each of the eight commands lists a context-mode match by file and line and proceeds, and refuses a refuse-mode match before its write or push by file, line and mode: the cases for the harness check, the entropy receipt, the plan publish and the follow-up batch passed when run alone; the export's, the update publish's and the order publish's were judged by reading their cases, which the complete row ran.

**Criterion 5:** met. (A5) The target-publish case in which a context-mode term in the composed body waits for `--confirm-terms` passed when run alone.

**Criterion 6:** met. (A6) The installed executor, verifier and reviewer roots carry the terms sentence with its count and the planner roots carry it for the planning publish; every lifecycle root carries the `evidence --wait` and the correction sentences; the worker definition carries the hand-back sentence; the two skill directories are byte-identical and `node scripts/harness.mjs check` passes.

**Criterion 7:** met. (A7) No installed executor root holds a review round for a repair after a failed run or a fifty-line figure; each holds the unreviewed count, `--keep-going` and the ladder a part at a time with `--since`.

**Criterion 8:** met. (A8) The two worker-stop cases of `scripts/test-harness.mjs` passed when run alone. This review's own session showed the behavior: a worker that handed back with a shell probe of its own running was held once and reported when the probe had ended.

**Criterion 9:** met. (A9) The case that the question dialog is admitted to every dispatched role, and that the refusal table holds no row for it, passed when run alone; the table holds nine entries, as at the base.

**Criterion 10:** met. (A10) The accepted-cap case passed when run alone: the twenty-first worker admitted and the forty-first refused, forty printed as the cap, another order's dispatch on the budgets file's value, and none refused under `unlimited`.

**Criterion 11:** met. (A11) The cases beside the effort readback in `scripts/test-off-ramps.mjs` were read and the whole script passed on a scratch root for another worker; a probe showed that only a version the hook observed for the session refuses a differing `--harness-version`. This session's briefing printed its observed version.

**Criterion 12:** met. (A12) The host-guard case that reads the title the spawned guard reports passed when run alone.

**Criterion 13:** met. (A13) The verbatim case passed when run alone. F9 is what the design's own code-span rule lets through, which the criterion does not state.

**Criterion 14:** met. (A14) This review's own checks: no `*role-baseline*.json` under `packages/skeleton/fixtures/`, no `scripts/check-role-oracle.mjs`, no `role-oracle` task in the generated artifacts, the runner, the structural checks or sync, and the case in which a skill root edited by hand makes the harness check fail naming that root passed.

**Criterion 15:** met. (A15) The kit guide and product 07 state the two classes, the stage's reading, the repair after a failed run, the ladder of an order in parts, the hand-back, the cap's acceptance, the checkpoint and the verbatim screen's words in the sections step A17 names; each but §First steps links this order's decisions and §First steps links §Document quality; the update section says what an unmarked entry does. The document check passes. F10, F11 and F48 are wording beside them.

**Criterion 16:** met. (A16) The example case of `scripts/test-runner.test.mjs` passed when run alone, and the guide's four blocks equal the kit's example list and its three fixture files byte for byte by two workers' probes. The example file is staged with an older comment line in the index, so the commit must take the working tree's bytes.

**Criterion 17:** met. (A17) A worker's probe on a scratch root: the checkpoint's commit holds the tracked and the untracked change, the index's bytes are unchanged, no control event is appended and the status reads as before.

**Criterion 18:** met. (B1) `node scripts/docs-check.mjs` passes here. The screen reads 432 sources and finds nothing; with its four exception lists emptied it raises 54 findings, each covered by a named row with its reason; the four screen cases passed when run alone.

**Criterion 19:** met. (B2) No file under `packages/` imports Prettier and no package source parses a generated page; neither index page holds a data comment; the index check passes here with both records present; a missing record fails naming the command that writes it; the check path takes target facts from the observations record alone; `index --json` prints the cards the pages show; no record of the cards is committed.

**Criterion 20:** met. (B3) A worker's copy of the scripts and packages with no `node_modules` and no built output loads every entry point; the launchpad export's case covers the four commands, was read, and ran in the complete row. F23 is the Check's wording.

**Criterion 21:** met. (B4) The header case of `scripts/test-configuration-root.mjs` passed in this review's own run; the base's header reading against the current one over all 269 orders differs for one, which the comparison names; a probe of the ten parser cases step B3 names passes. F3 is a header form no case holds.

**Criterion 22:** met. (B5) The three carried files hash equal to the installed Prettier 3.9.6 package's and to the recorded hashes; the generated check passes here; the sync and terms-task cases passed; the legal page names the copy.

**Criterion 23:** met. (B6) Only `packages/skeleton/src/source-reading.mjs` imports TypeScript under the two roots; a load hook saw no TypeScript module after importing it and 27 after its first read; reading 60 sources' literals, imports and comments started no process and three syntax trees started one; the case passed. F24 is the case's own load check.

**Criterion 24:** met. (B7) On the final tree the three files hold no shell lexer but the one module's, and a worker's comparison of the base's classifier with the current one, over 225 commands and twelve functions, found no refusal and no effect answer changed. The comparison at Part B's checkpoint is the record's (WO-276-D038, WO-276-D042).

**Criterion 25:** unmet. (B8) F7: six readers moved onto the shared readers with no comparison, and no row of the comparison map names one of them: the Front page field's reader, the two readings of an integration note, the masks of the generated blocks, the publication check's readers of product links and of a voice's section, and the dependency migration's removal of the standalone dependencies block ([comparison-coverage-gaps.json](../../evidence/WO-276/final-review-001/comparison-coverage-gaps.json)). The inventory and every other comparison are present, and the eight comparisons the verifiers named run and name every difference.

**Criterion 26:** met. (B9) `node scripts/feedback-evidence.mjs --check` passes here: the live audit of edition 007 judged the current source.

**Criterion 27:** met. (B10) Product 07, the kit guide and the legal page state the rule, the screen, the two records and the carried parser in the sections step B12 names, each linking this order's decisions; the document check passes.

**Criterion 28:** unmet. (B11) F4: a resident started through the package's own entry refuses a mission check, and nothing it records or prints of that refusal names `scripts/resident.mjs` ([unread-refusal.json](../../evidence/WO-276/final-review-001/unread-refusal.json)). The other clauses hold: that resident reports its work orders unavailable, one started through the launcher runs the check and reads a card again after its order's file changes, and a Markdown discovery profile is refused.

**Criterion 29:** met. (C1) The review-worker case (every kind's round-one brief and the recheck brief state what blocks; a refused criteria report is kept under a name that marks it refused, with its path in the refusal) passed when run alone.

**Criterion 30:** met. (C2) Every installed executor root carries the judgment rule and none carries the clause it replaced; the harness check passes.

**Criterion 31:** met. (C3) Every installed executor root states the fix dispatch's one combined review over the change since the tree its failed report judged, and none says a fix runs three reviewers.

**Criterion 32:** met. (C4) Every installed executor root states the three sizes and that a paired round's reviewers are blind to one another. The index's ladder case was read, since a filtered run of that file stops in its shared setup, and the index check passes here on this order's own `paired` line.

**Criterion 33:** met. (C5) The `roundFindings` case of `scripts/test-docs-check.mjs` passed when run alone.

**Criterion 34:** met. (C6) The failures-report case passed when run alone. That the report counts two of this order's own rounds as paired is VER-002's follow-up, carried by WO-276-D131.

**Criterion 35:** met. (C7) Product 07 §Verification review and attack and the kit guide's ladder paragraph state the round-one rule, the fix dispatch's one review, the header line and the paired record, linking WO-276-D039; the section step F6 made holds the split round's reports.

**Criterion 36:** met. (C9) The split-round case passed when run alone.

**Criterion 37:** met. (D1) The ordering case passed when run alone; a worker's probe placed a heavy row that failed last ahead of the convoy and a changed heavy row behind it.

**Criterion 38:** met. (D2) The row declares three shards and the shard cases passed when run alone; with no shard named a case runs by its name, as three did in this review.

**Criterion 39:** met. (D3) At Part D's checkpoint the evidence lists 431 titles declared and 431 run, equal, and a worker's recomputation agrees; on the final tree 456 titles split 157, 149 and 150. The suite's pass is the complete row's.

**Criterion 40:** met. (D4) The close file is declared first and the ordering assertion passed; the suite's pass is the complete row's.

**Criterion 41:** met. (D5) Both rows are fresh and passing with nothing reused, their trees differ in Part D's files with evidence and documents, and in the after row no heavy task starts inside the convoy, by a worker's recomputation from the row.

**Criterion 42:** met. (D6) `worktree-integration` had no light peer in either row and no longer declares `overlap`; `harness-fixtures` and `process-debt` each show peers in a row and keep it (WO-276-D050).

**Criterion 43:** met. (D7) The conditions case passed when run alone.

**Criterion 44:** met. (D8) Product 07 §Preflight before the full gate states the exclusive rows' shared priority, the three shards and the close file first, each linking WO-276-D047.

**Criterion 45:** met. (E1) Neither registry exists and no file under `scripts/` or `packages/` names one; the duplicate-title case passed when run alone; the suite's pass is the complete row's.

**Criterion 46:** met. (E2) `scripts/test-target-publish.mjs` holds no per-case time bound; the suite's pass is the complete row's.

**Criterion 47:** met. (E3) The board's case passed when run alone: the fixtures check exits 0 with edition 007 selected while the self-host case reads a fixed copy of edition 002, whose three copies hash equal to their sources.

**Criterion 48:** met. (E4) The base's four statement cases iterate 95 wordings, equal to `wordings.json`, and each of the 82 rows is in the built table, by a worker's extraction from the base commit; the suite's pass is the complete row's.

**Criterion 49:** met. (E5) Product 07 states that case titles are checked for duplicates and against no registry, linking WO-276-D053.

**Criterion 50:** met. (F1) The rule-record case passed in this review's own run and in a worker's.

**Criterion 51:** unmet, defective (contradiction) by 10. (F2) The criterion has the rule records equal the table by the case of criterion F1, which criterion 50 places in the product skeleton suite, and it places the table under this order's evidence directory. A product case may not read there. This review's probe ran one read of the table under the observer the product gate installs, with the order's record roots as the gate names them, and the observer recorded it as an excluded read, where a read of a package file recorded nothing ([criterion-51.json](../../evidence/WO-276/final-review-001/criterion-51.json)); the runner fails a suite on such a row. Tagging the case for the document gate would take it out of the suite criterion 50 names. What can hold does: the table's own check passes (33 rules, 6 roles, 21 cells that leave a role out), and the rule-record case and the document case that compares the records with the table both passed in this review's run.

**Criterion 52:** met. (F3) As criterion 14: this review's own checks and the hand-edited-root case.

**Criterion 53:** met. (F4) No installed root names `npm run plan -- review`, and a probe of the launch reader gives no use for that command.

**Criterion 54:** met. (F5) The installed planner roots name no skill for the refutation and send the pass to `npm run plan -- refute`, whose printed steps name the receipt command (the case passed); the refuter roots keep the procedure.

**Criterion 55:** met. (F6) The section the verifier's and the reviewer's roots name holds no `--kind` flag; §Review helper and round reports is a second-level section linked once from it; the planner roots name the ideation section only for an `ideation:` entry.

**Criterion 56:** met. (F7) A worker's call of the measuring function gives each role its installed bytes and the bytes of its fixed reads, the planner's second number (72,816 bytes) including §Operator-opened planning pass and the sequence; the meter's case passed.

**Criterion 57:** met. (G1) The seeds case passed when run alone: both seeds name Claude Code alone, permit no invocation of a harness and say another host is inspected only where the configuration elects it. VER-002's follow-up on the seed's own second criterion stands (WO-276-D130).

**Criterion 58:** met. (G2) On the final tree the host cases passed when run alone, this repository elects the one host its discovery record alone had shown, and the harness check passes with no host's surface lost. The comparison at Part G's checkpoint is the record's (WO-276-D057).

**Criterion 59:** met. (G3) The operator page holds the guide's ten marked blocks byte for byte in the cycle's order and names v1.0.0; `launchpad commands` prints the committed page, in a copy with nothing installed as well; the seeds and sync cases passed.

**Criterion 60:** met. (G4) The fresh export's file equals its template, the starter refresh adds it and leaves an instance's own, and the document check judges an entry's block; the three cases passed when run alone.

**Criterion 61:** met. (G5) The installed reviewer root carries the `FOR-CORE.md` sentence and the planner root its own, each for a root that holds the file. This root holds none, so this review appended nothing.

**Criterion 62:** met. (G6) The kit guide's four sections and product 07's item state the hosts, the page and the file, each linking WO-276-D057, §First steps through §Releases in this instance.

**Criterion 63:** met. (H1) The export-fixture case passed when run alone: nine rows before any install, and `--json` the same rows.

**Criterion 64:** met. (H2) The three injected-fact cases passed when run alone.

**Criterion 65:** met. (H3) The cases inject the four facts and find none in either output; `node scripts/doctor.mjs` and its `--json` form on this host hold no host name, user name, URL or absolute path.

**Criterion 66:** met. (H4) The case passed when run alone; repeated with core's own budgets, core is still refused and the kit root passes.

**Criterion 67:** met. (H5) The preview subtest passed inside its parent case.

**Criterion 68:** met. (H6) The failing-compiler case passed when run alone.

**Criterion 69:** met. (H7) The export case and the starter-refresh case passed when run alone.

**Criterion 70:** met. (H8) §First steps names the command, the compiler, the forge tool, the merge policy and the three host statements; §Taking upstream updates names the preview's floor lines and links WO-276-D060.

**Criterion 71:** met. (H9) In the export case the stand-ins record one version query, Claude's, and Codex's as well only with that host elected.

**Criterion 72:** met. (I1) The two update cases passed when run alone, the one in which `main` is merged in after the update's merge and the one in which the merge base cannot be read among them.

**Criterion 73:** met. (I2) In the same case the preview lists the two paths and none of the others.

**Criterion 74:** met. (I3) A probe of the launch reader gives one use for each of the four spellings, and the cases passed.

**Criterion 75:** met. (I4) §Taking upstream updates states the merge rule, the refusal, `--take`, the preview's section and that a closed order's text is restored, linking WO-276-D065; §Opting in to instance actions names the route.

**Criterion 76:** met. (I6) The subtest passed: `re-emitted:` only where the instance's own harness check passes, a hand edit refused as before, and a preview that meets no such surface runs with nothing installed.

**Criterion 77:** met. (J1) The harness case and the update-fixture case passed when run alone; a search of the emitted roots finds a model id only in the five agent definitions' front matter and no model's name in any role's text.

**Criterion 78:** met. (J2) The review-worker, refuter and drive cases passed when run alone; `npm run worker -- list` and `-- show default` agree with the installed worker definition, and this review launched its twenty workers as `show default` printed.

**Criterion 79:** met. (J3) The configuration-root parent case passed, 18 of 18; each refusal names its file and key.

**Criterion 80:** met. (J4) With the failing fixture double the failure names where the instance wrote the model.

**Criterion 81:** met. (J5) As written. The classes are derived in the new usage reading and not in the file step J5 names, which WO-276-D069 records; for a Claude row and a Codex row with the same counters the four sum to that host's total, and a class no row reported is null.

**Criterion 82:** met. (J6) The report's case passed when run alone; the report was not run on this checkout's own ledger.

**Criterion 83:** met. (J7) §Kit files and instance files and the example configuration state the section, the models file, the two commands and the report, linking WO-276-D077 and WO-276-D069.

**Criterion 84:** met. (K1) The export case passed: no manifest path lies under the root and a list that names one is refused.

**Criterion 85:** met. (K2) By reading: the export case runs gates inside a nested export, which a review worker may not start, and the complete row ran it.

**Criterion 86:** met. (K3) The three harness cases, the target-worktree case and the update-fixture case passed when run alone; the case the known issues ask for holds that a fragment's rule and hook for a refused call leave the refusal firing.

**Criterion 87:** met. (K4) The configuration case passed.

**Criterion 88:** met. (K5) `npm run resume -- status --json` here prints `schemaVersion` first, and each element of the all-orders form carries it.

**Criterion 89:** met. (K6) The closeout-selection cases passed when run alone.

**Criterion 90:** met. (K7) The kit guide's section states the guarantee, the fragment, the configuration section, the listed outputs and the placement rules, linking WO-276-D074; product 07 states the release rule.

**Criterion 91:** met. (L1) The export case passed: the seeded page states the index, the note convention with its two fields, the observation-order sentence and the agent-skills section.

**Criterion 92:** met. (L2) The document-check case passed when run alone.

**Criterion 93:** met. (L3) The briefing case passed when run alone: all three briefings print the profile, both notes with their paths and commits, and the workstream document.

**Criterion 94:** met. (L4) The same case: two commits since for one note and none for the other, and `unknown` for a commit the clone does not hold, with the briefing complete.

**Criterion 95:** met. (L5) The rule record names the executor, the verifier and the reviewer, whose installed roots carry the sentence; the rule-record case passed.

**Criterion 96:** met. (L6) The kit guide states the convention, the briefing's lines and the recipe, product 12's sentence agrees with the briefing, and each links WO-276-D086.

**Criterion 97:** met. (M1) The close case passed when run alone for a squash, a rebase and a merge commit, printing the base commits matched.

**Criterion 98:** unmet. (M2) F1: with a base that does not hold the change the close proceeds, where one base commit answers for two of the branch's ([rebase-reuse.json](../../evidence/WO-276/final-review-001/rebase-reuse.json)). The named case passes: the refusal that names `--merged-as`, a named commit in the base and one outside it.

**Criterion 99:** met. (M3) The authors case passed when run alone.

**Criterion 100:** met. (M4) The kit guide states the team conventions, the two repositories' merge methods and the author list, linking WO-276-D087 and WO-276-D090.

**Criterion 101:** met. (M6) The drive's route cases passed when run alone; the status embeds the same route.

**Criterion 102:** met. (N1) The registration case passed.

**Criterion 103:** met. (N2) The publish case passed when run alone: no records step, the action refused naming the key, the target published at the reviewed commit with none of the record paths, and the instance's branch holding the records.

**Criterion 104:** met. (N3) The same file's second case, its first fixture.

**Criterion 105:** met. (N4) Its second fixture: the order publish prints that the records are in the target at that commit.

**Criterion 106:** met. (N5) The plan-first case passed.

**Criterion 107:** met. (N6) The card case passed in a worker's direct run of the suite's script on a scratch root.

**Criterion 108:** met. (N7) The installed reviewer roots state the records step by the registration's key; plan-first is not elected here, so no installed root carries that sentence, and the emitted-root case passed.

**Criterion 109:** met. (N8) §First steps states the key, its two values and what a team's instance sets, reaching WO-276-D090 through the team section.

**Criterion 110:** met. (O1) The export copies the template byte for byte, and the export case's assertions hold on it.

**Criterion 111:** met. (O2) A kit-root probe with a layout passes the index and its check, and a stray member is refused in the base's words; the planning check's half was read in its case.

**Criterion 112:** met. (O3) The planner's roots alone hold the sentence; the case passed.

**Criterion 113:** met. (O4) §Planning in this instance states the rolling way and where the layout lives, linking WO-276-D093.

**Criterion 114:** met. (P1) The three cases passed when run alone, and over 4,000 generated journals the worked time never exceeded the elapsed time.

**Criterion 115:** met. (P2) The prompt-facts cases passed when run alone; the ledger is read only where a figure is declared.

**Criterion 116:** met. (P3) The budgets case passed.

**Criterion 117:** met. (P4) The executor's roots alone carry the stopping rule (the case passed), and the whole off-ramps script, with the standing file's briefing and removal, passed on a scratch root.

**Criterion 118:** met. (P5) The kit guide and product 07 state the figure, the line a session is shown, the standing and the bound's reading, linking WO-276-D098 and WO-276-D102.

**Criterion 119:** met. (P7) The case passed when run alone.

**Criterion 120:** met. (Q1) The emitted settings register the two hooks for no table name of a kind they do not judge, no presence hook is registered for any event and no presence hook file remains; the harness check passes; the target's settings hold the same by its cases. This repository elects Copilot, so its shared settings take the list form (WO-276-D105). F12 is beside it.

**Criterion 121:** unmet, defective (contradiction) by 11. (Q2) One clause asks that the attribution refusal fire for a shell command under each tool name that maps to its kind. Five names map to the shell kind, and the unit reads a command under two of them, by the same test in `packages/skeleton/src/harness-host.ts` at the base and now, which this review read at both trees. The clause therefore asks for a verdict under three names where the base gave none, and Part Q's design and non-goals admit no refusal added or changed. The case that holds the unit's verdict under the two names, and none under the other three or under a name the table does not hold, passed in this review's run. The criterion's other clauses hold: no refusal case changed across the part, the heartbeat's cases pass for the four events, and every call keeps its start and end rows.

**Criterion 122:** met. (Q3) The planning-branch case passed when run alone.

**Criterion 123:** unmet, defective (contradiction) by 12. (Q4) The criterion says that two snapshots with no file changed between them read no file's bytes the second time. The order's known issue for the same step orders a file whose times fall within the tick of the cache's own write to be read again, and the code does so: an entry's hash is kept unread only where the file's state is the entry's and its times lie more than two seconds before the entry was made (`harnessOutputs`, read by this review). An unchanged file written just before the first snapshot is therefore read at the second, as the known issue orders and against the criterion's words. The case passed in this review's run: settled files read nothing, a changed file is read alone, a file written within the tick is read again, and every hash is the one a full read records.

**Criterion 124:** met. (Q5) Both files hold the same fifty calls with a row for each hook (400 processes before and 210 after), and WO-276-D106 states both readings.

**Criterion 125:** met. (Q6) §Hooks states which hooks run for which tools and that the heartbeat has no hook of its own, linking WO-276-D105 and WO-276-D106; a count over the emitted settings agrees.

**Criterion 126:** met. (R1) Five cases passed when run alone, and in core's own root `npm run plan -- check`, which re-renders all 68 receipts byte for byte, passes here.

**Criterion 127:** met. (R2) A probe in a core-like root and in a kit root withdraws a launchpad order and a target order: one first event each, the index check passing with the order listed as withdrawn, and an identifier with no file refused as before.

**Criterion 128:** met. (R3) The case passed.

**Criterion 129:** met. (R4) The three cases passed.

**Criterion 130:** met. (R5) The advisory case passed; `npm run plan -- check` here prints twenty advisories and exits 0.

**Criterion 131:** met. (R6) The re-task rule's record names every role but the release close, and their installed roots carry it; the planner's roots carry the capture rule and the sentence on the advisory.

**Criterion 132:** met. (R7) The kit guide and product 07 state the routes, the advisory, the known issue's disposition and the capture rule, linking WO-276-D109 and WO-276-D112.

**Criterion 133:** met. (Z1) The complete review row recorded at 21:53:35 UTC on 2026-11-13 passes at the code identity judged (48 suites, 125 fresh tasks, 0 h 57 min) and discharges the plain selection; the document gate is run after this report's last edit and the result reads its row. The gates pass; the review fails on inputs no case of theirs holds.

## Handoff

The next phrase is `resume: fix`. The fix answers this report under the order's fix rule: the nine findings and the class each names, one combined review over its change, and a complete run on the repaired candidate, which a verification then reads. The workers' twenty reports, their briefs and their probes are in the ignored local lane under `docs/control/local/reviews/WO-276/final-review-001/`, for a repair session on this machine. Whether the outcome matched the aim of [WO-276-D154](../../evidence/WO-276/decisions.md#wo-276-d154--final-001-fails-on-nine-findings-the-review-reproduced-three-criteria-unmet-and-six-behaviors-of-main-broken-and-the-repair-is-the-fix-dispatchs-and-not-the-reviewers): it did. The review was dispatched to accept or refuse the candidate on evidence, it refuses it on nine findings it ran itself, and it changed nothing it judged.
