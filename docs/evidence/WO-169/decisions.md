# WO-169 decisions

## WO-169-D001

```json
{
  "id": "WO-169-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the order's plain scripts/ prefix on the configuration-root suite; decline a matcher exclusion for the test files, shell files and fixtures the suite does not scan.",
  "question": "Does declaring scripts/ whole cost enough per review gate to justify a narrower matcher that skips the paths the suite never scans?",
  "alternatives": [
    "Declare the scripts/ prefix as the order designs; the runner's prefix match already supports a directory entry.",
    "Declare the prefix and teach changedMachinery an exclusion for test files, shell files and fixtures."
  ],
  "observation": "Three runs of node --test scripts/test-configuration-root.mjs on the unmodified suite, 2026-09-27T02:53:07Z to 02:53:16Z: 2,693 ms, 2,771 ms and 2,870 ms, each exit 0 with 13 of 13 tests passing. Pre-registered threshold: adopt the exclusion only if the median is 10 s or more. The median is 2.8 s.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 9,
    "tokens": null,
    "commands": ["node --test scripts/test-configuration-root.mjs (three times)"],
    "source": "Shell timestamps around the three runs. Stating the question before them and recording the result here were not timed separately. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["npm test -- --review"],
    "summary": "No saving claimed. The kept method adds about 2.8 s to the review gate of an order that changes any path under scripts/, which is the cost the order's Cost line states (2.3 s on the operator's host); inside this order's review gate the suite took 4.61 s beside three other tasks."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-25", "experimentsSinceAdoption": null },
  "evidence": [
    "docs/work-orders/WO-169-followups-reach-their-seam.md Cost line and Design item 5",
    "scripts/test-runner.mjs changedMachinery: file.startsWith(source)",
    "docs/evidence/WO-159/decisions.md: the latest experiment record whose outcome is adopted, dated 2026-09-25; the count of experiments since is not recorded by any one source, so it stays null"
  ],
  "rejected": [
    {
      "option": "A matcher exclusion for unscanned paths",
      "reason": "It saves under three seconds on the orders that change only a test or shell file, and it adds a second rule to a table whose entries are plain prefixes."
    }
  ],
  "reopenWhen": "The configuration-root suite alone takes 10 s or more on the operator's host, or a second suite needs a directory entry with exclusions."
}
```

## WO-169-D002 — The match is textual and aligned on path components

```json
{
  "id": "WO-169-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "followups --touching lists a pending row when its source title or summary, its decision's whole followup or reopenWhen (read from the decision record, because the register clips a summary at 700 characters), or its latest disposition names a term. A path is named where its base name stands as a whole name and the path written around it equals the path's own trailing components. A given argument may itself be a tail, so a longer written path that ends in it names it; a changed file is a whole path, so a longer written path is another file. An order is named by its identifier not followed by a digit. Rows keep the feed's shape and page bound and add the first four terms that matched, with a count when there are more, so one row cannot outgrow the page; the page states that the match is textual; a cursor is bound to the register revision and to the terms it was cut for. With no term the paths are the differences from the merge base with main (local and origin read together, so a stale local main does not widen the change): committed and uncommitted, deleted, both names of a renamed file whatever diff.renames is set to, and untracked files, because an order's work is uncommitted until final review. The order is the active one, or the one --work-order names.",
  "evidence": [
    "scripts/lib/planning-followups.mjs namesPath, namesOrder, changedAgainstMain, touchingFollowups",
    "scripts/test-process-debt.mjs: WO-169 followups --touching names the pending rows a path, an order or this change touches; WO-169 the change is read from the merge base with main: committed, renamed, deleted and untracked files, never main's own; WO-169 followups --touching pages within the byte budget and its continuation keeps the terms",
    "docs/evidence/WO-169/touching-replay.json: at the register the 2026-09-27 pass measured (main 4c34b332, 155 pending), each order's landing diff returns 13 to 33 rows",
    "Same replay before the whole-path rule: 16 to 35 rows per order, and README.md was the most frequent term (36 matches over nine orders) because rows naming docs/work-orders/README.md matched the root file",
    "Review, 2026-09-27: the ordinary feed paged by the implementation at 3d58955d and by this one over the live register gave 17 identical pending pages and 83 identical pages with --all; matching all 3,562 tracked paths against 131 pending rows took 436 ms; 113 changed files of one base name exceeded the page before the matched list was bounded"
  ],
  "rationale": "Mission and critical path: a deferred row reaches the order that opens its seam without a planner reading every row, which removes a recurring operator rescue (shifting the burden). Rule beating and seeking the wrong goal: the fixtures assert which rows are and are not returned, including a settled row, another file of the same base name, a longer identifier and a file main changed after the branch point, so a match that returns everything cannot pass. Commons and drift: the replay measured what an executor would be shown, and the count is recorded instead of assumed small. Policy resistance and escalation: no gate, schema or role text is added; the feed's own page bound holds. Success to the successful: the first implementation split text into tokens and was replaced when it could not carry a name with a space. Naive Interventionism: the ordinary feed's pages are byte-identical, the collector is untouched and the match reads and never writes. NoOp leaves the four seams the pass counted opening unseen.",
  "rejected": [
    {
      "option": "A plain substring match on the path and its base name",
      "reason": "meta.mjs matches inside scripts/meta.mjs and test-meta.mjs, and every row that names any README.md or decisions.md matches every order."
    },
    {
      "option": "A structured path field on every disposition",
      "reason": "The order declines it: a register schema change and a migration of 653 entries."
    },
    {
      "option": "Leave generated projections out of the no-argument terms",
      "reason": "The order's design reads the files changed; the replay shows each generated projection costs about one row per order, which is recorded for the planner instead of decided here."
    },
    {
      "option": "Leave an order's own new follow-ups out of its match",
      "reason": "They name the order, and the final review disposes them like any other listed row; the cost is that an order that records a follow-up never has a silent advisory."
    }
  ],
  "followup": "Planner: after three orders complete with the register advisory, read the counts their ImplementationReady and RepairCompleted events recorded beside the rows their final reviews disposed, and decide whether the paths worktree integrate treats as generated projections leave the no-argument terms of followups --touching. The replay measured 13 to 33 rows per order at 155 pending rows, about one of them per generated projection. Known limits of the match, none met by a tracked path or a register row today: a path whose directory holds a character outside letters, digits and _ @ . - is matched by its base name only; a path written as a relative link with .. components is not matched; a candidate that names its seam after the 700th character of its section is not matched, because the register keeps no more of it.",
  "reopenWhen": "An order closes with a touching row undisposed, a row that names its seam by path is not returned for a change to that path, or executors record that they stopped reading the advisory's rows."
}
```

## WO-169-D003 — The completion advisory reports, never repairs and never refuses

```json
{
  "id": "WO-169-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "implementation-ready and repair-complete print one advisory when the no-term match is not empty: the count, the command and the rule (fix a row inside the Boy Scout bound or record it as left in the order's decisions, never widen the order; the final review disposes each listed row through the feed). It names no row, because advisory text is kept in the control event. The command it prints returns the same count: on a branch that names the completion's order it is the plain form, and elsewhere it carries --work-order with that order. It reads the register through the freshness check and never syncs or locks it: a stale register is reported as unavailable. A repository with no main is judged by its order alone. Every failure inside the block becomes an advisory; nothing is thrown to the completion.",
  "evidence": [
    "scripts/lib/lifecycle-evidence.mjs: the third block under implementation-ready and repair-complete",
    "scripts/refute-plan.mjs: followups --touching --work-order WO-NNN",
    "scripts/test-process-debt.mjs: WO-169 completion advises with the count, the command and the rule when rows touch the change, and never refuses (both actions; silent with no match; one row; two rows; a stale register; no main; tracked files unchanged; a branch that names no order with two orders open)",
    "Review, 2026-09-27: before the flag existed, two open orders on a branch that named neither gave an advisory of 2 rows and a command of 1; the advisory reported while another writer held the register lock and left the register bytes and git status unchanged",
    "scripts/resume.mjs is unchanged: it spreads the returned evidence into the event and prints nothing itself"
  ],
  "rejected": [
    {
      "option": "Sync the register inside the completion so the advisory is always available",
      "reason": "A completion would write a tracked file after its tree identity was recorded (WO-131 D022's reopening condition)."
    },
    {
      "option": "Stay silent on a stale register",
      "reason": "Silence would read as no row touching the change, which is a guess."
    },
    {
      "option": "List the matching identifiers in the advisory",
      "reason": "The text is persisted in the control event on every completion; the command prints the rows."
    },
    {
      "option": "Refuse the completion until the rows are read",
      "reason": "The order declines it: completion never blocks on advisories."
    }
  ],
  "reopenWhen": "A completion is refused or delayed by this block, the advisory's count disagrees with what the command it prints returns for the same tree, or the stale-register form appears on orders that ran npm run meta before handoff."
}
```

## WO-169-D004 — The export is one JSON file and its destination is judged where it lands

```json
{
  "id": "WO-169-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "followups --export <file> [--all] writes one JSON document: the feed's revision, totals and counts, and every selected row with its identity, status, kind, source revision count, source link, title, the decision's whole decision, followup and reopenWhen or the candidate's register summary, and the whole disposition history. Standard output carries the same summary without the rows, the number exported and the physical path. The destination is resolved to its physical path first. Inside the checkout it must lie in the ignored local control lane and be ignored by Git; outside the checkout it must lie in the system temporary directory, which holds DotLn session scratch, and in no other checkout or Git directory. An existing destination must be a regular file that an export wrote; anything else is refused. The file is written beside the destination and renamed into place, so a name that shares its bytes with another file is replaced and never written through.",
  "evidence": [
    "scripts/refute-plan.mjs exportDestination and the --export branch; scripts/lib/planning-followups.mjs exportFollowups",
    "scripts/test-process-debt.mjs: WO-169 followups --export writes every pending row whole to a granted destination and prints only counts",
    "packages/skeleton/src/harness-host.ts outsideWriteResponse is private and keyed on hook input; harnessSessionScratch and claudeHostScratchpad need a session identity that npm run plan does not receive",
    "Live run on 2026-09-27: 129 pending rows, 246,234 bytes, the longest disposition reason 684 characters; a destination under the host scratchpad and one under the planning root were each refused with exit 1; the feed's first page and the register were byte-identical before and after",
    "Review, 2026-09-27, before the last three rules: a hard link in the lane to a tracked file carried the export into that file; a sibling checkout under the temporary directory and its Git directory were destinations; the gate's check record and the local terms list in the lane were replaced without notice"
  ],
  "rejected": [
    {
      "option": "Reimplement the hook's grant judgment in the command",
      "reason": "A second rule that can drift from the harness, and two of its three roots cannot be resolved without session identity."
    },
    {
      "option": "Accept any path under the system temporary directory, including a checkout that lives there",
      "reason": "A fixture checkout lives there, and its tracked planning root would have been a destination."
    },
    {
      "option": "Judge the path as written",
      "reason": "A link inside the lane would carry the write to a place no root covers."
    },
    {
      "option": "Judge the destination again after the write",
      "reason": "The write would already have happened; the remaining window needs a second local process that replaces a parent directory between the judgment and the rename."
    }
  ],
  "followup": "Planner: the export command refuses a Claude Code host scratchpad because it has no session identity, and it takes the system temporary directory from the environment it runs in; decide with the scratch-directory work (WO-168) whether a command may read the session's granted roots from the harness, so that one rule judges a hook's write and a command's write.",
  "reopenWhen": "A planner is refused a destination the role's grants admit and has no granted alternative, or an export lands outside both roots or replaces a file it did not write."
}
```

## WO-169-D005 — A batch is an array of ordinary requests under the one revision

```json
{
  "id": "WO-169-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "followups --apply takes the same file argument: a JSON object is one request, handled exactly as before; a JSON array is a batch whose elements have the single request's exact shape and each carry the one expectedRevision the planner read, which must be the register's revision when the lock is taken. Requests apply in order under one lock, each validated against the state the earlier ones produce and screened against the local terms list by its own text, and the register is written once after the last. A refusal names the request's index and states that nothing was written. Both forms accept an optional clock so a fixture can compare bytes; the command never passes one.",
  "evidence": [
    "scripts/lib/planning-followups.mjs dispose, disposeFollowup, disposeFollowups",
    "scripts/test-process-debt.mjs: WO-169 followups --apply takes a batch under one revision, all or none: three requests whose second closes a duplicate cycle when applied alone and applies after the first; the same register bytes as three single applies under the same clock; the command's array and object forms; a local-terms refusal and seven other refusals, each naming its index and leaving the register bytes and the lock as they were",
    "scripts/test-process-debt.mjs: follow-up dispositions refuse stale updates, absent allocation targets and duplicate cycles still passes unchanged",
    "Review, 2026-09-27: the implementation at 3d58955d and this one, side by side under a frozen clock, returned identical values and register bytes for six valid single requests and identical messages for sixteen refusals; 500 requests on a synthetic 700-entry register applied in 8.3 s"
  ],
  "rejected": [
    {
      "option": "An object holding one expectedRevision and a list of requests",
      "reason": "The order names an array of requests, and an element of the single shape can be reviewed, reused or applied alone."
    },
    {
      "option": "Loop over the single apply",
      "reason": "It writes after each request, so it cannot be all or none, and every request after the first would fail on the revision."
    },
    {
      "option": "Freeze the process clock in the fixture",
      "reason": "No fixture in scripts/ uses mock timers; an injected clock changes no behaviour of the command. Two real runs stamp different instants, so register bytes can only be compared under one clock."
    }
  ],
  "reopenWhen": "A planning pass still chains revisions by script, or a refused batch leaves a changed register or a held lock."
}
```

## WO-169-D006 — Generation waits for authored conflicts; the record holds the release message as one line

```json
{
  "id": "WO-169-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "worktree integrate runs its generators only when the stage is applied and neither an unmerged path nor an untracked stash collision remains; while one remains it prints the authored conflicts and one pending line saying that generation awaits their resolution and --continue. The affected checks and the instruction to complete the draft decision describe the generated tree, so a pass that held generation leaves them to the pass that runs it and says so; a pass that generated and left a failed step keeps its checks and names the step to repair, not a conflict. The decision stub writes the release message as one line closed by one full stop: sentences are joined, the indented file list is folded into its Files changed sentence with commas, a sentence gives up its own full stop and a listed path keeps its bytes. WO-138 D011 attributed the doubled full stop to an untrimmed trailing newline; the string was already trimmed, the message ends with its own full stop and holds line breaks inside, so the stub normalizes the message instead. The nine filed records are not edited. Product 07's sentence that only a reviewed branch's conflict delays stash application now says that an authored conflict delays generation too.",
  "evidence": [
    "scripts/lib/worktree-integration.mjs: the unresolved gate before regenerate; releaseLine; decisionStub; the printed guidance",
    "scripts/release.mjs prepare: the three-part message ending 'Tag observation: local snapshot only.'; unchanged by this order",
    "scripts/test-worktree-integration.mjs: both real-Git cases assert no Regenerated line, the pending line, no checks list, no retime and no stub on the first pass, then the stub's one-line release entry and the named conflict after --continue; WO-169 a first invocation with no authored conflict generates at once; WO-169 a pass whose generator fails keeps its checks and names the pending step, not a conflict; WO-169 the integration record holds each release message as one line with one full stop",
    "docs/evidence/WO-169/fixtures.txt: node --test scripts/test-worktree-integration.mjs on 2026-09-27, 12 of 12 pass",
    "Review, 2026-09-27, probes in throwaway clones: a register conflict the union refuses, a conflict on the order's own decisions record, an untracked stash collision alone, and a reviewed merge conflict followed by a stash-apply conflict each held generation until staged and generated on the next --continue; an incomplete pass had printed 'npm test' where the completing pass printed 'npm test -- --review'",
    "git blame: the trim and the stub's full stop both date from the helper's first commit 0f0736b4",
    "docs/product/07-execution-guide.md Independent workflows and integration"
  ],
  "rejected": [
    {
      "option": "Label the first pass provisional and keep generating",
      "reason": "The generators would still write over a tree that holds conflict markers, and the order's design defers them."
    },
    {
      "option": "Change the message in scripts/release.mjs",
      "reason": "The order does not edit that file, its text is pinned by the release suite, and the integration fixture runs the committed script."
    },
    {
      "option": "Rewrite the nine records",
      "reason": "Filed decision records are history; release history is WO-086's."
    }
  ],
  "followup": "Two defects of worktree integrate that predate this order, met in review and left: the decision stub is written once per checkpoint, so a stub written on a pass whose release preparation failed keeps 'Release preparation: pending.' after a later pass prepares the release; and a stash apply that fails with no unmerged path and no untracked collision leaves the receipt at stage applying, where every --continue refuses while a fresh run tells the operator to use --continue. Refresh the stub's release entry while it reads pending, and give the applying stage a recovery the command names. Priority: low; neither was met by a real integration.",
  "reopenWhen": "An integration prints a Regenerated line while a conflict remains, a --continue with every conflict staged does not regenerate, or a stub's release entry spans lines."
}
```

## WO-169-D007 — The configuration-root suite declares scripts/

```json
{
  "id": "WO-169-D007",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "The configuration-root suite's declared sources become the one directory entry scripts/, which contains the former eight. Any changed path under scripts/ now selects the suite under --review. The existing selection fixture for a changed release shell file now expects configuration-root beside runner-fixtures. worktree integrate shares the selection, so it prints npm test -- --review whenever a script changed since the recorded base.",
  "evidence": [
    "scripts/test-runner.mjs machinerySources; changedMachinery matches by prefix and already carries directory entries",
    "scripts/test-runner.test.mjs: WO-169 a changed script outside the former eight sources selects the configuration-root suite, through runGate with --review --list, which is what npm test -- --review --list runs; release shell changes select their inventory guard during review",
    "node scripts/test-runner.mjs --review --list on this tree lists 34 suites, configuration-root among them",
    "docs/evidence/WO-085/decisions.md WO-085-D014",
    "WO-169-D001: the suite's measured cost"
  ],
  "rejected": [
    {
      "option": "Select changed machinery suites in plain npm test",
      "reason": "The order declines it: it changes the duration and meaning of the gate every role runs."
    },
    {
      "option": "List every scanned script by name",
      "reason": "The list would go stale with the next new script, which is the failure the row exists to remove."
    },
    {
      "option": "Read untracked files in changedMachinery inside this order",
      "reason": "It changes which suites every order's review gate selects, for every machinery suite; the order changes one row of the table."
    }
  ],
  "followup": "Planner: changedMachinery reads git diff, which omits untracked files, so a script an order adds selects no machinery suite until it is staged; the executor's and verifier's review gates run before that, and only the reviewer's procedure stages new source first. Decide whether changedMachinery reads untracked files as followups --touching does. Observed in review on 2026-09-27: an untracked scripts/new-script.mjs holding a literal document root selected nothing; after git add it selected configuration-root.",
  "reopenWhen": "A tracked script the suite scans changes without selecting it, or the suite's cost per review gate becomes material (WO-169-D001)."
}
```

## WO-169-D008 — An unset ceiling reads unset in the drift rows

```json
{
  "id": "WO-169-D008",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "renderMeta's drift rows print a null cold-start ceiling as 'ceiling unset', as the budget rows and the legend do; a set ceiling still prints through the number formatter. The JSON and every verdict are unchanged. The render fixture sets the refuter's ceiling to null itself instead of inheriting it from the live budgets file. The order cites renderMetaTable for these rows; they are rendered by renderMeta, which embeds that table.",
  "evidence": [
    "scripts/lib/meta.mjs renderMeta drift rows",
    "scripts/test-process-debt.mjs: WO-155 cold-start trends share edition and acceptance evidence across the CLI and meter asserts both refuter rows, the budget row and the absence of 'ceiling unavailable'",
    "With the old expression restored the same test fails and prints '.claude/skills/refuter: 59 bytes; ceiling unavailable; ...; unset'; with the new one it passes",
    "docs/evidence/WO-155/decisions.md WO-155-D006"
  ],
  "rejected": [
    {
      "option": "Change the display helper to print unset for null",
      "reason": "Every unavailable observation in the meter would then read unset."
    }
  ],
  "reopenWhen": "Another meter or CLI row renders an unset limit as unavailable, or a consumer parses the rendered drift row."
}
```

## WO-169-D009 — The replay receipt 032 asked for

```json
{
  "id": "WO-169-D009",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Replayed followups --touching against the eight rows and the nine orders the 2026-09-27 pass counted, on a scratch clone at the main that pass measured (4c34b332, where each row's latest disposition was still its deferral), giving each order its landing diff on main's first-parent history as whole paths and its identifier. The reactor.ts row is returned for WO-099, WO-151, WO-154 and WO-070; the four meter and closeout rows for WO-155 and WO-158; both resident-state.ts rows for WO-100; the WO-115 row for WO-115. For WO-160 one of the four meter rows is returned, through scripts/release.mjs, and three are missed: they name release preparation in prose and scripts/lib/meta.mjs, and WO-160 edited release-preparation.mjs and not meta.mjs. That is the stated limit of a textual match. On the live register four of the eight rows are closed (two settled, two allocated), so a pending-only run there returns at most the other four. No later order has this comparison; the final review of this order compares the rows its advisory named with the dispositions it recorded.",
  "evidence": [
    "docs/evidence/WO-169/touching-replay.json",
    "docs/planning/work-order-map.md WO-169 catalog row: receipt 032 known issues",
    "docs/planning/onesie-twosie-followup-drain-2026-09-27.md section 4",
    "Landing commits read from main's first-parent history by the control segment each changed: WO-099 bca52bf2, WO-151 4bf626f4, WO-154 a403671d, WO-070 f73b7e18, WO-155 a8d58149, WO-158 852861d3, WO-160 64f9326f, WO-100 ad5bb1d7, WO-115 d3768d2d"
  ],
  "rejected": [
    {
      "option": "Replay on the live register",
      "reason": "The pass that counted the rows disposed four of them; a pending-only match cannot return a closed row."
    },
    {
      "option": "Add prose synonyms for file names to the match",
      "reason": "A vocabulary the match would have to keep in step with the source; the order accepts a missed row as today's behaviour."
    }
  ],
  "reopenWhen": "A row that names its seam by path or order is missed for an order that changed that path or carries that identifier."
}
```

## WO-169-D010 — Review before the gate, and what it changed

```json
{
  "id": "WO-169-D010",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Before the recorded gate, four read-only reviewers probed the uncommitted change in throwaway repositories under the system temporary directory, one lens each: the match and the advisory, the export and the batch, the integrate helper, and the order's criteria and documents. They reported one major, seven minor and nineteen notes, no blocking finding, and every acceptance criterion they could judge as met. One refuter then tried each finding again, some on the code as first read and some on the repaired code: it refuted none, and it found one defect the repairs had introduced, an integration pass that generated and failed one step being told to resolve a conflict it did not have. Fixed in this order: the own-diff run was not yet recorded (WO-169-D011); product 07 said the export writes every row; a renamed file's old path was missing from the change; the advisory's count and its command disagreed on a branch that names no order; one row matched by many files exceeded the page; a name Git reports could be refused as a term; a batch refused by the local terms screen named no index; a hard link carried an export into another file; another checkout under the temporary directory was a destination; an export replaced lane records it did not write; the batch fixture claimed a dependency it did not have; the export fixture compared pages before its lane export and asserted a short followup; the no-term fixture could not tell the merge base from HEAD; the suite no longer exercised generation on a first invocation; an incomplete integration printed checks and a reviewer instruction for a tree that did not exist yet; the release line kept a carriage return and dropped a listed path's trailing full stop; product 07's integration section named only stash application as delayed; and the defect the refuter found. Each fix to a script has a fixture. Left with a named follow-up: generated projections in the no-term terms and the match's limits (WO-169-D002), the session's granted roots (WO-169-D004), the two older defects of the integrate helper (WO-169-D006), untracked scripts in the review selection (WO-169-D007). Left without one: the remaining window between judging a destination and renaming onto it, which needs a second local process; and the cost of the match on a single unbroken token of tens of thousands of characters, which no register field or decision record holds.",
  "evidence": [
    "Session observation (node scripts/harness.mjs usage, 2026-09-27T03:55:00Z): subagent count 9 of the cap of 20, exact-observed: four scouts before implementation, four reviewers and one refuter after it; none wrote to the checkout",
    "The refuter's statement of its limit: the subject moved while it was reviewed, so the reviewers' line numbers describe an earlier tree, and no reviewer has read the repairs themselves; verification is their first independent reading",
    "scripts/test-process-debt.mjs, scripts/test-worktree-integration.mjs and scripts/test-runner.test.mjs: the fixtures named in WO-169-D002 to WO-169-D008",
    "npm test -- --review before the review's fixes: 34 passed, 0 failed, 393.98 s, 78 fresh tasks, recorded 2026-09-27T03:27:45.066Z; the gate recorded for handoff is the run after the last source edit"
  ],
  "rejected": [
    {
      "option": "Hand the change to verification with the reviewers' minor findings as known issues",
      "reason": "Each had a bounded fix inside a file this order already edits, and two of them let an export replace a file it did not write."
    },
    {
      "option": "Fix the two older defects of the integrate helper here",
      "reason": "Neither is in the order's design; each changes a recovery path the order does not name."
    }
  ],
  "reopenWhen": "Verification meets a defect in one of the fixed behaviours, or a finding recorded as left is met by a real planning pass, completion or integration."
}
```

## WO-169-D011 — The rows this order's own change touches

```json
{
  "id": "WO-169-D011",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Ran followups --touching with no term on this order's own change before handoff and judged each of the 14 rows it returned against the advisory's rule. One row's member that belongs to this order is fixed by item 6; nothing else is fixed, because no other row names work inside the Boy Scout bound of the files this order opens; every row is left for the final review to dispose through the feed, with the executor's proposal beside it. Four of the fourteen are rows this order's own decisions minted. The six rows the order's provenance names are allocated to WO-169, so they are closed and not listed; they are retargeted at close.",
  "evidence": [
    "npm run plan -- followups --touching and its continuation, 2026-09-27, on the file set handed off, register revision 5cca313125e362384985f8f648730efedd00cd3a87b6a2de97532953bc622e54: 26 changed paths and WO-169, 133 pending rows, 14 matched. An earlier run at revision 6d93a5e9, before the last evidence file existed, read 25 paths and returned the same 14 rows",
    "FUP-0111 (open; matched WO-169), planner startup context: left. Items 2 and 3 deliver the register half its latest disposition names; orientation to the product stays open. Proposed: open, with the landing recorded.",
    "FUP-04ec9fa011f39d93 (deferred; matched WO-169), WO-144 D010: left. Item 5 delivers the declared-sources half of part 1 and WO-169-D007 records what remains of it; part 2, the redirect accessor, is outside this order's files. Proposed: deferred, unchanged condition.",
    "FUP-56b599e15f97e666 (deferred; matched docs/product/07-execution-guide.md), WO-099 D027: left, a false match by a document's name. This order does not change resident-state.ts. Proposed: deferred, unchanged condition.",
    "FUP-71fc2efc208f597a (deferred; matched docs/evidence/WO-169/decisions.md and docs/lineage/decisions-index.md), WO-085 D004: left, a false match by the record's file name. This order's decisions quote no operator chat. Proposed: deferred, unchanged condition.",
    "FUP-74362527b75d12f5 (deferred; matched WO-169), the register has no flow counter: left. The export now carries every disposition with its date, so a pass can count arrivals and disposals from one file; adding a counter would widen the order. Proposed: deferred, unchanged condition, with the export named as the source a counter would read.",
    "FUP-acfe4bfda716d8fb (deferred; matched docs/control/current.md), WO-158 D008: left, a false match by a generated projection. This order changes one label of the meter's render, not usage or meta attribution. Proposed: deferred, unchanged condition.",
    "FUP-e821aa2ced3aa111 (deferred; matched scripts/test-runner.mjs), WO-142 D017: left. This order opens the runner for one row of its source table; selecting TAP for the remaining Node suites changes what every gate prints, which is outside the Boy Scout bound, and its other members name consumers this order does not open. Proposed: deferred, unchanged condition.",
    "FUP-f12a1f894923b2b2 (deferred; matched WO-169), three items in reactor.ts: left. Its disposition names WO-169 as the mechanism that will show it to an order that opens reactor.ts; this order does not. Proposed: deferred, unchanged condition.",
    "FUP-f1c7a256bec46737 (deferred; matched docs/product/07-execution-guide.md), WO-054 D006: left, a false match by a document's name. No role text or ceiling changed. Proposed: deferred, unchanged condition.",
    "FUP-fa028783f3f6b17f (deferred; matched scripts/lib/meta.mjs and WO-169), meter and closeout residue: its unset-label member is fixed by item 6 (WO-169-D008; the allocated row is FUP-e5a6ca7dbe6270ea); the member that remains, the ownership of an executor-time PR draft, is left. Proposed: deferred, unchanged condition.",
    "FUP-5a03cc13047c1dc4, FUP-58a4c432faa720e6, FUP-406744f5e9966250 and FUP-b1163d128e371b7f (untriaged; each matched WO-169, the last also scripts/test-runner.mjs and scripts/test-runner.test.mjs): the follow-ups of WO-169-D002, D004, D006 and D007. Left for the final review or the next planning pass to dispose.",
    "Rows named in the order's provenance, allocated to WO-169 and therefore not pending: FUP-c3f5fff27ea981b8, FUP-e5a6ca7dbe6270ea, FUP-ca485137e32985fb, FUP-99f720bad9200a33, FUP-28ded9eb997633f2, FUP-d7c0c433892e120f"
  ],
  "rejected": [
    {
      "option": "Dispose the rows through the feed from the executor's session",
      "reason": "The order's design gives that to the final review; the executor records what it did with each row."
    },
    {
      "option": "Take WO-142 D017's TAP selection because the runner is open",
      "reason": "It changes the output of suites this order's checks do not cover; the advisory's rule is never to widen the order."
    }
  ],
  "reopenWhen": "The final review's run on the same tree returns a row this record does not list, or disposes a row against the executor's note with evidence the executor did not read."
}
```

## WO-169-D012 — Board a large touching query's page limit

```json
{
  "id": "WO-169-D012",
  "date": "2026-09-27",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record a low-severity limit of followups --touching: a valid explicit query with 500 distinct order identifiers fails the 8 KB page bound instead of returning a page or naming an input-size limit. The fixture cases in criterion 1 and this order's own 26-path, one-order query succeed. Keep the verification subject unchanged and pass the specified criterion while naming this limit in VER-001.",
  "evidence": [
    "Read-only verifier reproduction on the current register: touchingFollowups(process.cwd(), { orders: WO-000 through WO-399 }) returned 114 matches, one row, a 4,747-byte page and a continuation; WO-000 through WO-499 threw Planning follow-ups: one follow-up exceeds the planning page budget.",
    "scripts/lib/planning-followups.mjs: touchingFollowups includes every order in page.touching.orders, repeats explicit arguments in the continuation and then calls bounded(page, next); the failure is page overhead, not one oversized follow-up.",
    "npm run plan -- followups --touching on WO-169's own change returned 14 matches across 26 paths and WO-169 at revision 5cca313125e362384985f8f648730efedd00cd3a87b6a2de97532953bc622e54; scripts/test-process-debt.mjs covers the acceptance fixture and page continuation."
  ],
  "rationale": "The immediate goal is to judge the selected order's real seams and preserve a usable feed. The ordinary query and required fixture work; a large caller can split explicit terms today. Rule beating forbids calling the 500-term failure a successful page, while NoOp would leave an inaccurate error unnamed. A verifier code edit would replace the subject it is judging; the planner can bound a later correction against the shared page budget and operator attention.",
  "rejected": [
    {
      "option": "Fail the fixture-specific criterion on this limit",
      "reason": "No acceptance fixture or current own-diff query reaches it, and the command's ordinary bounded pages and continuation pass the current review gate."
    },
    {
      "option": "Change the paging implementation during verification",
      "reason": "The verifier must judge the staged implementation independently, not edit it to turn its own verdict green."
    }
  ],
  "followup": "Planner: decide a bounded representation or explicit input-size refusal for followups --touching when its query terms alone outgrow the 8 KB page and continuation. Reproduce 500 distinct WO-NNN arguments, include the no-argument changed-file form, and keep smaller query pages and the cursor's revision binding intact. Priority: low; explicit callers can split terms into smaller requests.",
  "reopenWhen": "A normal no-argument order diff reaches this limit, or a planning pass needs one large explicit query to avoid losing a disposition."
}
```

## WO-169-D013 — Reopen the resident matrix deadline observation

```json
{
  "id": "WO-169-D013",
  "date": "2026-09-27",
  "dispatch": "resume: verify; VER-001",
  "reopens": {
    "decisionId": "WO-159-D020",
    "observation": "The WO-143 resident acquisition matrix again hit its unchanged 240 s deadline in a full product gate, with its timing cause unestablished. A focused run and the next exact review gate passed at the same code identity."
  },
  "decision": "Preserve the red plain product-gate row and the green independent runs. The first npm test exited 1 because the unchanged WO-143 matrix was cancelled at 240 s after seven of eight cells reported; 27 other suites passed. The focused matrix then passed all eight cells in 207 s, and npm test -- --review passed 34 suites at the same code identity. Criterion 8 uses that complete green review gate, not a synthetic combination of partial rows. No timeout, resident behavior or gate source is edited here.",
  "evidence": [
    "docs/control/local/harness/checks.json: 2026-09-27T04:25:03.195Z exit 1, 386,595 ms, 27 of 28 suites passed; 2026-09-27T04:36:13.751Z exit 0, 403,629 ms, 34 of 34 suites passed, 78 fresh tasks; both code identity 0aaf8b4ce119c3702d64dd04a9479d698ade3b33a4ec8bf15eed31bca4e3374c.",
    "docs/control/local/harness/check-output/2762a987400921fa8ac0a7f04b50503ed5deaa6730af456b186d5c188535ddad.log: testTimeoutFailure, ERR_TEST_FAILURE, test timed out after 240000ms, seven matrix cells reported before cancellation; skeleton 453 passed, 0 failed, 1 cancelled.",
    "Focused node --test --test-name-pattern for the WO-143 matrix on packages/skeleton/dist/test/resident.test.js: 1 passed, 0 failed, 206,991 ms, all eight cells reported.",
    "packages/skeleton/test/resident.test.ts:775-860 declares the 240000 ms matrix timeout; this order's diff changes no skeleton source or test. WO-159-D020 previously recorded the same deadline observation and its reopening condition."
  ],
  "rationale": "Passing evidence must be a complete gate on this subject, so the red row stays visible and the exact review retry supplies the green row. The source under verification does not change the resident lock path. Attribution of the timeout to host load would be an inference without a measured cause; the existing WO-159 follow-up is reopened for that diagnosis. NoOp would leave the second deadline hit outside the queue, while changing the timeout here would widen this order and risk normalizing a failing check.",
  "rejected": [
    {
      "option": "Ignore the failed plain gate",
      "reason": "It is a real recorded observation even though the later complete review gate passes."
    },
    {
      "option": "Fail this order solely on the first timeout",
      "reason": "The same code identity has a focused passing reproduction and a complete green gate containing the original product suites plus this order's changed machinery suites."
    }
  ],
  "reopenWhen": "The resident matrix again misses its deadline or evidence ties the failure to changed WO-169 source."
}
```

## WO-169-D014 — Final review: board three minor feed defects and correct one limit claim

```json
{
  "id": "WO-169-D014",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass the order with three minor defects in the feed forms boarded, not repaired, because each lies outside the acceptance criteria and a reviewer does not write a behavioural fix and certify it. (1) followups --touching never matches a path written as a relative link on the full path: namesPath compares the link's .. components with the given path's leading components, so --touching docs/product/03-architecture.md does not return a row that links ../product/03-architecture.md, while --touching 03-architecture.md and --touching product/03-architecture.md do. WO-169-D002 lists this limit as met by no register row today; that claim is wrong, and this record corrects it: at register revision 4921c639 eight pending rows hold eleven relative links. (2) In a repository with neither main nor origin/main the completion advisory counts the order's rows alone yet says 'a file this change touches or WO-NNN' and prints a command that refuses with 'no main to compare with', so WO-169-D003's claim that the printed command returns the same count fails there. (3) followups --export refuses to replace an existing lane record it did not write but creates a missing one, so an export named docs/control/local/terms.txt creates a local terms list that checkLocalTerms then rejects as malformed, refusing every register write until the file is removed. A fourth observation is recorded with them: the check that an outside export destination is not inside another checkout reads git rev-parse's output and ignores its exit status, so a failing git lets the write through. The final review also corrected one product sentence this order wrote: product 07 section Independent workflows and integration said an authored conflict delays generation 'until then', whose nearest antecedent is the stash application; it now says 'until that continuation', as the replaced sentence did.",
  "evidence": [
    "Final review, 2026-09-27, live register revision 4921c639f378e1fb1c0204923a025f18416328ea84ffa91498f01768888d4fa2: npm run plan -- followups --touching docs/product/03-architecture.md matched 0 rows; the same command with 03-architecture.md or product/03-architecture.md matched 1, FUP-441469088613e52a, whose source links ../product/03-architecture.md",
    "Final review, the same revision: followups --export to the DotLn session scratch directory wrote 134 pending rows; 8 of them hold 11 substrings beginning ../",
    "scripts/lib/planning-followups.mjs:688 namesPath; scripts/lib/planning-followups.mjs:645 changedAgainstMain, required by default; scripts/lib/lifecycle-evidence.mjs:86-110 the advisory, which calls it with required false and prints a command that calls it with required true",
    "scripts/refute-plan.mjs:89 returns a missing destination before the existing-file checks; scripts/refute-plan.mjs:77-85 tests the stdout of git rev-parse --is-inside-work-tree --is-inside-git-dir and not its status",
    "A read-only final-review helper, in a throwaway clone of the worktree: with main renamed and no origin/main, requireLifecycleEvidence advised '10 pending follow-up rows name a file this change touches or WO-169' and the command it printed failed with 'no main to compare with; name the paths'; followups --export docs/control/local/terms.txt exited 0 in a clone without that file, and the next register write was refused by the local terms screen",
    "docs/evidence/WO-169/decisions.md WO-169-D002 followup, WO-169-D003 decision and reopenWhen, WO-169-D004 decision",
    "docs/product/07-execution-guide.md Independent workflows and integration; npm run publication:check reported the software-engineer edition stale after the sentence changed and current after its lock was refreshed"
  ],
  "rationale": "The criteria are fixtures and a textual match whose misses the order accepts, and none of the four has been met in use. DotLn's repository always has main; the relative links read in the eight rows are citations rather than seams; and no export has been reported to use a reserved lane name, although the precondition exists: the main checkout's lane holds terms.txt, which an export refuses to replace, while this linked worktree's lane has none, so an export named terms.txt there would create it. Routing them to repair would spend a repair and a fresh verification on edge cases (escalation, drift toward process over outcome); leaving them only in the report would lose them (the rule that a defect met and not fixed gets a named follow-up). Correcting the false claim in a new record keeps D002's filed text and register source revision intact. The product sentence is this order's own write-back, one clause, with no behaviour behind it.",
  "rejected": [
    {
      "option": "Fail the final review and route the three defects to repair",
      "reason": "No acceptance criterion is unmet; each defect is an edge the order's design either accepts (a missed match) or does not name."
    },
    {
      "option": "Edit WO-169-D002 in place",
      "reason": "It would change the register source revision of FUP-5a03cc13047c1dc4 and rewrite a filed claim instead of recording the correction."
    },
    {
      "option": "Fix the three defects in the final review",
      "reason": "A reviewer never writes a behavioural fix and certifies it."
    }
  ],
  "followup": "Next order that edits scripts/lib/planning-followups.mjs or scripts/refute-plan.mjs: (1) make namesPath treat a written path's leading ../ components as a tail, so a relative link is matched for the full path it resolves to, with a fixture for docs/product/03-architecture.md against ../product/03-architecture.md; (2) make the completion advisory in scripts/lib/lifecycle-evidence.mjs and the command it prints agree without main, either by printing the explicit form with the order or by reporting the change as unavailable; (3) refuse an export to a missing name the local control lane reserves (terms.txt, harness/checks.json), or confine exports to one subdirectory of the lane; (4) require git rev-parse to succeed before trusting its answer in exportDestination. Priority: low; none has been met in use, and item 3's precondition exists in a linked worktree whose lane has no terms.txt.",
  "reopenWhen": "A planner or executor misses a row because it links a changed file relatively, an advisory prints a command that refuses, or a register write is refused after an export."
}
```

## WO-169-D015 — The final review ran the document gate five times where two would have done

```json
{
  "id": "WO-169-D015",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-001; operator direction after the result",
  "decision": "Record the final review's repeated npm run test:docs runs beside FINAL-001, because the operator directed that they be recorded with the final review after its pass had been recorded, and the pass event binds FINAL-001's bytes by digest, so the filed report stays unchanged and a second final review cannot be dispatched from the closed phase. The reviewer ran the document gate five times between 14:46 and 14:50 UTC: at 14:46:28 it failed (14 passed, 9 failed, 11.56 s) on angle-bracket placeholders in the release notes, which the body profile treats as raw HTML; at 14:46:48 it failed again (11.50 s) only because the first run's output had been piped through tail and the reviewer reran the gate to read the failure instead of saving the first run's log; at 14:47:44 it passed (23 passed, 31.34 s) after the placeholders were reworded; at 14:48:26 it passed again (31.02 s) after the reviewer edited FINAL-001's own test:docs row to describe the gate; and at 14:49:47 it passed again (31.12 s) after two more wording edits to the PR body and release notes. Two runs would have done: one that saved its log and failed, and one after every edit was final. The three extra runs cost about 74 s of gate time and the operator's attention, and the operator had to interrupt to stop the pattern. FINAL-001's Checks row names the first failure and one passing run and omits the second failure and the two later passing runs; this record completes it. The last run, at 14:49:47, judged the bytes that FINAL-001 and the result recorded, and the one run after this record judges the bytes that are committed.",
  "evidence": [
    "Session gate rows reported by the harness at 2026-09-27T14:50:43Z: npm run test:docs 11,559 ms at 14:46:28.399Z; 11,504 ms at 14:46:48.153Z; 31,343 ms at 14:47:44.011Z; 31,023 ms at 14:48:26.704Z; 31,116 ms at 14:49:47.142Z",
    "docs/final-reviews/WO-169/FINAL-001.md Checks table, the npm run test:docs row",
    "docs/control/orders/WO-169.jsonl FinalReviewCompleted at 2026-09-27T14:50:06.557Z with reportHash sha256:b0556dc9710c7aa9c05c22bcaa9d49b0bffc73fa0849f5c16683a36f89b04aa3",
    "npm run resume -- status after the result: phase closed; legal next actions release-close, next, activate; legal off-ramp correct, which refuses report bytes (scripts/resume.mjs correct; scripts/test-off-ramps.mjs 'report bytes never change')"
  ],
  "rationale": "The failure was ordinary; the waste was procedural. Saving a gate's output instead of truncating it, finishing every record edit before the gate, and not writing a report row whose content depends on the run it describes would each have removed runs. Recording this beside the report keeps the verdict's recorded digest true; editing FINAL-001 would leave the pass event naming bytes that no longer exist, and a report file written without a dispatch would be a fabricated report.",
  "rejected": [
    {
      "option": "Edit FINAL-001 after its pass was recorded",
      "reason": "The pass event binds the report's digest and the correct off-ramp refuses report bytes; the operator was offered this and asked instead for a second final review."
    },
    {
      "option": "Dispatch a FINAL-002",
      "reason": "The pass closed the order; final-review is not a legal action from the closed phase, and writing FINAL-002.md without a dispatch would invent one."
    }
  ],
  "reopenWhen": "A later review runs the document gate more than once after its last failing run without an edit that the earlier passing run could not have judged."
}
```
