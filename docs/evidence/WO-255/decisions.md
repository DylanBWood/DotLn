# WO-255 decisions

## WO-255-D001 — The dispatch, the actor and three citations read against the source

```json
{
  "id": "WO-255-D001",
  "date": "2026-11-05",
  "dispatch": "resume: next (the harness-recorded executor dispatch of WO-255)",
  "decision": "Execute WO-255 as written, reading three of its citations where the source puts them: TRANSPORT_DEFAULTS is in scripts/lib/worker-launch.mjs (49 to 61, the Codex model at 56), not packages/skeleton/src/worker-transport.ts; the review ladder's text is product 07 §Verification review and attack (3228 to 3341), not §Discipline, which carries only the preflight pointer to it; and the kit guide has no §Reviews heading, its review paragraph being in §What runs here, and what does not (583 to 613). The write-backs go to those passages. Because the transport defaults are not in worker-transport.ts, no step edits that judged feedback source, which keeps the order's 'no feedback-judged source changes' true. Before the material choices: the traps that would change the work were reading the order's file citations as authority over the source (handled: each cited symbol was located by grep before an edit), editing a judged feedback source by following the citation (handled: none is edited, checked against FEEDBACK_SOURCE_PATHS), and quoting the operator's ignored capture in a committed surface (handled: the capture's items are named by number only). The NoOp, leaving the helper as it was, would keep the same-day second pass without reviews, the zero-findings recheck and the untraced consistency report the order exists to remove.",
  "evidence": [
    "grep -rn TRANSPORT_DEFAULTS over scripts and packages: defined only at scripts/lib/worker-launch.mjs:49; packages/skeleton/src/worker-transport.ts declares OBSERVED_CLI_VERSIONS and canonicalWorkerArgs and no defaults table.",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS lists worker-transport.ts, change-review-protocol.ts and plan-refutation-protocol.ts; none of harness-host.ts, contributor.ts, packages/compiler/src/harness.ts, gate-evidence.mjs, plan-direct.mjs or plan-receipts.mjs is in it.",
    "grep -n '^## \\|^### ' docs/product/07-execution-guide.md: the ladder paragraph sits under ## Verification review and attack (3090); ## Discipline starts at 3389. grep -n '^## \\|^### ' docs/KIT.md: no Reviews heading.",
    "The nomination capture docs/intake/planning-dispatch-2026-11-03-recurring-failures.md (ignored, in the main checkout) hashes to the order's SHA-256 4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83; its items 15 to 17 and the fork's items 5 and 9 are the ones this order answers.",
    "Actor: Claude Code 2.1.318 (claude --version), model claude-opus-5-5 (Opus 5.5, the session's selection), CLAUDE_EFFORT=max read in the session's shell; the order recommends xhigh for the executor, and the attestation records the selected max with source claude-session-readback."
  ],
  "rejected": [
    {
      "option": "Edit packages/skeleton/src/worker-transport.ts as step 6 names",
      "reason": "The table the step means is not there; editing that judged source would owe a live feedback episode for no behavior change."
    },
    {
      "option": "Write the ladder's new rule under §Discipline",
      "reason": "The ladder is stated once, in §Verification review and attack; a second statement under §Discipline would split one rule across two sections."
    }
  ],
  "reopenWhen": "A later reading finds a cited symbol this order should have changed where the order pointed and the source did not."
}
```

## WO-255-D002 — The planning lane is the branch, and a --since round 1 starts a ladder of its own

```json
{
  "id": "WO-255-D002",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 1, criterion 1",
  "decision": "A planning subject's lane is planning-<branch slug>: the branch without its planning/ prefix, any run of characters outside letters, digits, dot, underscore and hyphen made one hyphen, leading dots and hyphens and trailing hyphens dropped, refused when nothing is left; a branch whose name the slug had to change keeps the first eight hex digits of its name's SHA-256, so two branches never share a lane (round 1's criteria F4: planning/a/b and planning/a-b). A round 1 other than the combined round named with --since <tree> starts a ladder of its own under since-<the first twelve hex digits of that base's tree>/ inside the subject's lane, in an order's lane as in a planning one; its record names the base (since, sinceSource `named with --since`) and the ladder (ladder.base, the full tree id, and ladder.lane). A recheck or combined round whose latest earlier report belongs to such a ladder writes into the same sub-lane, and a recheck's base is that ladder's base. The combined round is round 3 when neither --round nor an earlier report says otherwise, so `--kind combined --since <tree>` stays the last round of the ladder it ends (round 1's design F4). A fresh --since round 1 is admitted over any base, as criterion 1 states; when the tree it reviews is the one its lane's newest report reviewed, the helper and the record print an advisory naming the re-roll (D016, item 1). The record command takes the same lane and the same rules, and the overwrite refusal names the --since route.",
  "evidence": [
    "scripts/lib/review-worker.mjs planningLane, reviewsLane and roundPlan.",
    "scripts/test-review-worker.mjs 'two planning passes on one date each run their own round 1 in a lane named by the branch, and a --since round 1 starts a ladder of its own': two branches of one date dry-run and run their round 1 into planning-2030-01-02-first and planning-2030-01-02-second; the first lane refuses a plain round 1 and admits --since <tree> into since-<12 hex>/, whose record names the base; its recheck lands round-2 in the same ladder against the same base; record --since lands round-1-design there too. Passed under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs (19 of 19).",
    "scripts/test-review-worker.mjs 'two planning branches whose names slug alike keep their own lanes' (planning-a-b and planning-a-b-<8 hex>) and 'a combined round named by --since alone is the ladder's last round, and a fresh round 1 over the tree its lane last reviewed is named a re-roll' (round-3-combined.md in WO-901/, then the advisory naming it)."
  ],
  "rejected": [
    {
      "option": "A lane per hour or per UTC date",
      "reason": "A pass is a branch, not a time (the order's design); the date lane is what refused the 2026-11-03 fork's second pass and moved the lane at midnight."
    },
    {
      "option": "Write a --since round 1 beside the existing report under a suffixed name",
      "reason": "Every ladder keeps the round-<N>-<kind> names the verifier, the recheck and the close read; a suffix would make a second name scheme for the same round."
    },
    {
      "option": "Use the sub-lane only when the subject's lane already holds a round 1",
      "reason": "Where a report lands would then depend on what the lane held; a base named with --since always names its ladder, so the path follows from the command."
    },
    {
      "option": "Refuse a fresh --since round 1 unless its base is newer than the lane's last reviewed tree (Receipt 063's reading)",
      "reason": "Criterion 1 admits a fresh round 1 with --since <tree> on a lane holding a round 1 report, with no condition on the tree, so a refusal would fail the criterion's own command; the advisory makes a re-roll visible, and the executor root's rule (no reviewer after round 3) keeps the execution ladder's end."
    }
  ],
  "reopenWhen": "A reader of the reviews lane (the verifier, release close's retention) misses a since-<tree>/ ladder, or two planning branches slug to one lane."
}
```

## WO-255-D003 — A recheck reviews the whole change again

```json
{
  "id": "WO-255-D003",
  "date": "2026-11-05",
  "dispatch": "resume: next; steps 2 and 7, criteria 2 and 7",
  "decision": "A recheck (round 2 or later, any kind but combined) first confirms or refutes the fixes of the listed earlier findings on the current tree, then reviews the whole current change against the base again under its brief: its base is the merge base with main (a registered target's activation base, or its ladder's --since base), its stat is the whole change, and its brief also names the tree the earlier round reviewed with the git diff that shows what the fixes changed. The admission rule is unchanged, so the ladder keeps WO-250's end: round 1, one recheck, one combined round, then the executor's judgment. The combined round's instruction and base are WO-250's, word for word. The executor root's round-2 sentence and product 07's ladder say the same. Before figures for the old rule's round-2 rechecks, from the retained reports of the last three closed orders (docs/control/local/retained/<order>/reviews in the main checkout): WO-250 criteria 2 findings in 0 h 5 min (313,964 ms), design 0 in 0 h 5 min (293,599 ms), consistency 0 in 0 h 4 min (254,954 ms); WO-253 criteria 0 in 0 h 8 min (495,575 ms), design 1 in 0 h 8 min (460,329 ms), consistency 0 in 0 h 8 min (489,539 ms); WO-254 criteria 4 in 0 h 5 min (314,003 ms), design 2 in 0 h 5 min (291,783 ms), consistency 1 in 0 h 5 min (292,839 ms). This order's own rechecks under the new rule are recorded with its ladder; the next two orders' rechecks are the after figures.",
  "evidence": [
    "scripts/lib/review-worker.mjs ladderRule (the recheck branch only) and roundPlan (base and priorTree).",
    "scripts/test-review-worker.mjs 'a recheck reads its prior report, and the combined last round carries the three briefs and the prior findings': the round-2 record's since is round 1's base, priorReviewedTree is round 1's tree, the brief carries the new sentence and the git diff between the two trees, and its stat names README.md, src/added.mjs and src/module.mjs; the combined round's brief carries WO-250's sentence exactly and its since is round 1's tree.",
    "packages/skeleton/src/loadouts/contributor.ts executor procedure: 'Round 2, the recheck: each reviewer whose findings were fixed confirms those fixes, then reviews the whole current change against the base again'."
  ],
  "rejected": [
    {
      "option": "A recheck over the repair's diff only",
      "reason": "That reading is where the zero-findings rechecks came from while the complete run then failed (the operator's item 17 of 2026-11-03; the before figures above)."
    },
    {
      "option": "A complete gate run before round 1 so the reviewers read its result",
      "reason": "Product 07 §Preflight before the full gate is the operator's standing rule on when the complete gate is paid, and the operator asked the reviewers to find what the run finds, not for another run (the order's design; its non-goal)."
    }
  ],
  "followup": "Record the round-2 recheck findings counts and durations of the next two orders executed after WO-255 against WO-255-D003's before figures (WO-250, WO-253 and WO-254), and whether each order's first complete run then failed on a defect its rechecks could have read; propose a narrower or wider recheck only on that evidence.",
  "reopenWhen": "The operator wants the recheck narrower, or the next two orders' rechecks cost more than a round's reading again without finding what their complete runs found."
}
```

## WO-255-D004 — A consistency report carries its Traced consumers table, or it is not recorded

```json
{
  "id": "WO-255-D004",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 3, criterion 3",
  "decision": "A consistency report must carry a Markdown table under a heading that starts with `Traced consumers`, with columns whose headers name the changed contract, the consumer, the command and the result, at least one row, a command and a result in every row, and a generated pages row and a fixture manifests row (matched in the contract column). A cell still holding the brief's <placeholder>, a dash, a question mark or a word for nothing done (n/a, none, not run, not checked, tbd, todo, skipped) counts as empty, except that none stands as a result, such as a search that found nothing (round 1's criteria F3). The helper applies the check to the worker's returned report before anything is written: a refused return writes nothing to the lane, journals a WorkerLaunched row with outcome refused-report and the reason, prints the reason and the number of findings the worker returned, and exits nonzero, so the round is run again. npm run worker -- record applies the same check to the claimed result's report field or the prose around it, and records the body that passed as the report (round 1's design F3). The reviewer brief says so, and the canonical brief's Report section shows the table with its two required rows. Only the consistency kind is checked; the combined round carries the consistency brief over a delta and is not refused for a missing table.",
  "evidence": [
    "scripts/lib/review-worker.mjs tracedConsumersRefusal, tableUnder, reportRefusal, reportRules and both routes' refusal paths.",
    "scripts/test-review-worker.mjs 'a consistency report is recorded only with its Traced consumers table, on the helper route and the record route': the helper refuses a canned return without the table (nothing written, refused-report journaled) and records one with it; record refuses no table, no fixture manifests row, a template row, an empty table and a missing result column, each naming the table, and records the whole one.",
    "packages/skeleton/src/loadouts/contributor.ts reviewerBriefs.consistency now ends with the table rule; the executor root carries it verbatim.",
    "scripts/test-review-worker.mjs 'a Traced consumers cell of a dash or a word for nothing done says nothing, while none is a result' and 'record reads the tree a structured report's field names, ignores a tree line quoted later, and records the body whose table passed'."
  ],
  "rejected": [
    {
      "option": "Trust the brief",
      "reason": "The brief already asked for producer/consumer pairs; the record did not require them, so a report that traced nothing was recorded as a review (the order's design)."
    },
    {
      "option": "Keep a refused report's text in the lane or a scratch root",
      "reason": "A refused report is not a review; a second, unrecorded artifact beside the reports would be read as one. The refusal line counts the findings it returned, so the executor knows to run the round again."
    },
    {
      "option": "Validate the table in packages/skeleton/src/change-review-protocol.ts",
      "reason": "That file is a judged feedback source, so an edit owes a live feedback episode; the rule belongs to the helper, which both routes share."
    }
  ],
  "reopenWhen": "A recorded consistency report's table names commands its worker never ran, or the combined round needs the table too."
}
```

## WO-255-D005 — worker record binds the host, model, effort and tree the worker ran on

```json
{
  "id": "WO-255-D005",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 3, criterion 3; WO-241-D004 (FUP-1398fcdb63df23d2) taken",
  "decision": "npm run worker -- record accepts --host claude|codex, --model and --effort for what actually ran, and --tree <object> for the tree the worker reviewed. A --model naming one of the four options, by word or model id, carries its host (a contradicting --host is refused) and, without --effort, its effort; any other model id is recorded as given, with effort unknown unless --effort names it; both values then have source recorder-attested, and the record's option names the option or is null. Without the flags the record keeps the host's default with source generated-definition (Claude) or host-default (Codex). The transport is agent-tool for a Claude worker and codex-spawn-agent for a Codex one. The reviewed tree is --tree's, resolved to a tree and refused when the object is not in the repository; without --tree it is the working tree when the record is written, and a return whose opening line, or the opening line of its findings object's report field, names another tree with `Reviewed tree: <id>` is refused, naming the flag to bind it; a tree line quoted further down names nothing (round 1's criteria F1 and design F12). The canonical brief asks every worker to open its report with that line, so a report given the helper's brief (its --dry-run prints the brief) names the tree it judged, and the executor root's record command names --tree. reviewedTreeSource says which applied.",
  "evidence": [
    "scripts/lib/review-worker.mjs recordAgentReview and namedTree; renderReport's host line names the source and the option.",
    "scripts/test-review-worker.mjs: record with --host codex --model gpt-6-astra --effort max writes host codex, transport codex-spawn-agent, model and effort recorder-attested and option astra; --host claude --model astra is refused; 'record binds the tree a report reviewed': the unchanged tree records as named in the report, after an edit the same report is refused without --tree and bound with it, and an unknown 40-hex object is refused.",
    "scripts/test-review-worker.mjs 'record reads the tree a structured report's field names, ignores a tree line quoted later, and records the body whose table passed': a findings object alone whose report opens with the tree line is refused after an edit, and a prose report quoting the line further down binds the working tree."
  ],
  "rejected": [
    {
      "option": "Keep the recording-time snapshot as the reviewed tree",
      "reason": "WO-241-D004 recorded two returns whose tree was a snapshot taken after repair edits began; the record named a tree nobody reviewed."
    },
    {
      "option": "Require --tree on every record",
      "reason": "A report recorded on the tree it judged needs no flag, and criterion 3 records one without it."
    },
    {
      "option": "Have the dry run leave a marker naming the tree",
      "reason": "A dry run writes nothing, which the existing fixture and product 07 both state; the report's own line names the tree without a new write."
    },
    {
      "option": "Require the opening line or --tree on every record (round 1's criteria F2)",
      "reason": "Criterion 3 records a consistency report on its table alone, with no --tree and no condition on a tree line; a report shaped as the criterion describes, a table and no opening tree line, would be refused, so the rule would fail the criterion's own command. Round 2's criteria recheck read the criterion as compatible with the rule; the disagreement is recorded rather than resolved by a refusal the criterion does not name. A record bound to the working tree at record time says so in reviewedTreeSource, and the executor root's record command names --tree."
    }
  ],
  "reopenWhen": "A recorded report names a model nobody ran or a tree nobody reviewed, or Agent workers given the canonical brief routinely omit the Reviewed tree line."
}
```

## WO-255-D006 — A prose report holding a JSON example stays prose

```json
{
  "id": "WO-255-D006",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 3, criterion 3; WO-250-D015 (FUP-60ea250ef102cc46) taken",
  "decision": "The record command takes a returned text as a claimed change-review result only when the whole text is a JSON object carrying the result's own schemaVersion or findings key, or, failing that, when the last balanced JSON object found in it carries one. A JSON example such as {\"value\":2}, fenced or inline, claims nothing, so the text is kept as the worker's prose report. A claimed object is still bound by validateChangeReviewResult, so a malformed one is refused as before.",
  "evidence": [
    "scripts/lib/review-worker.mjs claimedResult: a string-aware brace scan that moves to the next opening brace when a candidate does not parse.",
    "scripts/test-review-worker.mjs 'record keeps a prose report holding a JSON example as prose, binds a claimed result after an example and refuses a malformed claimed one'; the existing Agent-route fixture keeps its plain prose, its result among prose and its malformed schemaVersion 2 cases."
  ],
  "rejected": [
    {
      "option": "Parse the slice from the first opening brace to the last closing brace",
      "reason": "That is the defect WO-250's VER-001 reproduced: a prose report with one example was refused as a malformed result."
    }
  ],
  "reopenWhen": "A JSON example that itself carries a findings key is taken as a worker's claimed result."
}
```

## WO-255-D007 — --capture carries the operator's dispatch, and an Items table answers it

```json
{
  "id": "WO-255-D007",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 4, criterion 4; WO-250-D016 (FUP-2bcb656e4fc1e7f6) in part",
  "decision": "--capture <file>, repeatable, belongs to a planning subject's criteria review only. Each capture's bytes close the brief under `## The operator's dispatch`, after a line naming the file, its byte count and SHA-256, exactly as written, so the brief ends with the dispatch; in the worker's prompt the change-review protocol's own budget and output sections follow it, and each capture's label line marks where its text starts (round 1's criteria F7). The brief's Report section tells the worker to answer every item and later message in an `## Items` table (item, location in the subject, disposition: acted on, reviewed or missing) and to quote none of the dispatch's words. Both routes refuse a captured report without that table, with no row, without the three columns or with another disposition. The record keeps captures as {sha256, bytes} and its brief with each capture's bytes replaced by a placeholder; briefSha256 is the digest of the brief the worker received. Any passage the worker quotes from a capture, a run of six or more of one line's consecutive words whatever marks or punctuation surround them, or the three to five words of a whole line of twenty characters or more, each line's item marker (a bullet, a number such as 1. or 6.1, a letter such as a)) left out of its words and the line's length measured with it, so a short item is caught quoted with or without its number (round 3's F1; the repair's round 3 F1), is replaced in every text the record keeps (its report, returned text, finding summaries and recheck notes); words are read through JSON escapes, so a quotation inside a findings object's report field is found as it is in prose, and the printed line counts the passages once, from the returned text when the record keeps one (round 1's criteria F5; round 2's criteria recheck of F5 and design R2-F1). A quotation of fewer than six words of a longer line is not caught. Every record names the reports it answered as answered: [{path, recordSha256}], with the base it reviewed against in since. A capture's top-level numbered items that the table names no row for are printed as an advisory, not refused. The remainder of WO-250-D016 (attributable lifecycle journal keys, retention of reviewed Git trees, a lane derivation shared with release close, tests for object pruning and nested repairs) stays deferred on FUP-2bcb656e4fc1e7f6; the UTC-midnight part no longer applies to the lane, which the branch names (D002).",
  "evidence": [
    "scripts/lib/review-worker.mjs readCaptures, renderReviewBrief's dispatch section and recordedBrief, itemsTable, unansweredItems and roundFields.",
    "scripts/test-review-worker.mjs 'a planning criteria review carries the operator's dispatch to the worker...': the dry-run brief ends with a planted three-item capture under its heading; --capture with --kind design is refused; the helper refuses a return without the table and records one with it, advising that item 3 has no row; the record carries the capture's digest and byte count, the merge base and the dry run's brief digest, and neither record nor report holds the capture's sentinel words; record with --recheck refuses no table and a bad disposition, and records answered with the round-1 record's path and digest.",
    "scripts/test-review-worker.mjs 'a planning criteria review carries the operator's dispatch...': a recorded recheck quoting the capture's third line keeps none of its sentinel words, holds the omission mark and prints that one quoted line was omitted."
  ],
  "rejected": [
    {
      "option": "A fourth reviewer kind",
      "reason": "Whether each point was acted on is already the criteria adversary's question (the order's design and non-goal)."
    },
    {
      "option": "Fence the capture inside the brief",
      "reason": "Criterion 4 asks for a brief that ends with the capture's text under its heading, which a fence would end with its marks; the label line before each capture marks its start in the brief and in the protocol's prompt that follows it."
    },
    {
      "option": "Refuse a table that misses a numbered item",
      "reason": "A capture's numbering is the operator's own and can count sub-items or quoted lists; a refusal would block a sound report, while the advisory names the gap for the executor."
    }
  ],
  "reopenWhen": "The operator asks for another shape than the per-item table, or WO-244's plan review launches a planning criteria review without --capture."
}
```

## WO-255-D008 — A registered target's order is a review subject

```json
{
  "id": "WO-255-D008",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 5, criterion 5",
  "decision": "--target <repository-id> --order WO-NNN binds the launchpad's order to its registered target through boundTargetWorktree in scripts/lib/target-worktrees.mjs, the binding target-review publication's reviewedTargetSubject now shares (round 1's design F2): the order's activation must name that repository and a base commit, the launchpad's config must register the repository, the launchpad's target registry must name one worktree for the order with the same repository, base and branch wo-NNN, and that worktree must be its own Git root on that branch. The diff is the activation base against the target worktree's working tree, written as a Git tree in the target's object store with the host's safe Git options (hooks off, file monitor off), so the target's own hooks and file monitor never run for a review (round 1's design F1); every other target read uses the same options. The worker's working directory is the target worktree and its sandbox and tool list keep it read-only, the brief names the target and the launchpad's order, the use is counted as every helper launch is (by the helper under Codex, by the hook's literal-command count under Claude), and the report is the launchpad's, in docs/control/local/reviews/WO-NNN/. The record names the target's repository, worktree and base. A target's clean filters still run when its tree is written, as for target publication. Known limit: reviewCycle starts a repair lane on a fix dispatch or on a failed launchpad npm test row, so a target order's failed target gate does not start its own repair lane; a fix dispatch does.",
  "evidence": [
    "scripts/lib/review-worker.mjs resolveTarget, resolveSubject and roundPlan; scripts/lib/target-worktrees.mjs targetWorktreeForOrder.",
    "scripts/test-review-worker.mjs 'a registered target's order is reviewed on the target's base and candidate...': the dry run's base is the target's base commit, its reviewed tree is the target's working tree and a tree object there, its stat names the target's two files and not the launchpad's change, the brief names the target and carries the order; under a fixture Codex thread the run counts one use, writes WO-901/round-1-criteria.md with the target named, leaves the target's status unchanged; kitWorkerLaunch counts the command one use; another repository id and a missing --order are refused.",
    "The same fixture now registers the repository in the fixture launchpad's dotln.config.json, refuses the review once the launchpad no longer registers it, and plants a core.fsmonitor script in the target that the dry run never runs."
  ],
  "rejected": [
    {
      "option": "A target-side helper",
      "reason": "WO-250 made one command for every host; a second helper in the target clone would split the brief, the lane and the counting."
    }
  ],
  "followup": "Start a target order's review repair lane on a failed target gate row, as a failed launchpad npm test row does: reviewCycle in scripts/lib/review-worker.mjs counts only checkId npm test, so a target order's ladder after a failed target gate writes into its execution lane; cover it in scripts/test-review-worker.mjs with a failed target:<id> row.",
  "reopenWhen": "A target order's repair ladder is refused by the overwrite rule after a failed target gate."
}
```

## WO-255-D009 — The operator's four worker options and the generated Astra agent

```json
{
  "id": "WO-255-D009",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 6, criterion 6; the operator's direction of 2026-11-03 (ignored capture SHA-256 589662ab8d84e728340b6b22077bf72f4979d1e3a37821a00947b8c12b52326f)",
  "decision": "contributorWorkerOptions in packages/skeleton/src/loadouts/contributor.ts is the one table of the four options: opus (claude-opus-5-5, xhigh), fable (claude-fable-5-1, xhigh), sol (gpt-6.1-sol, max) and astra (gpt-6-astra, max), each with its host and the worker type a receipt records, and contributorWorkerDefaults names opus and sol; contributorWorkerPins and the generated worker definitions derive from it. scripts/lib/worker-launch.mjs reads it for every caller: workerOptionNamed finds an option by word or model id (the review helper, the record command and the refuter's direct launch), resolveWorkerOption resolves a launch (the --model option, else the session's dispatch-line option for that host, D010, else the host default, refusing an option of the other host and anything outside the four by name), and receiptWorkerTypes gives the worker types both receipt validators admit (round 1's design F6). How the option was chosen is recorded as option.selection model-flag, dispatch-word or host-default, apart from model.source command-line, the launch evidence (design F7). npm run worker -- review takes --model; npm run plan -- refute takes it on its direct form, where it prints the launch the parent makes (tool, worker type, model, effort and the receipt's --worker-type) and, from a session on the other host, points at the external transport, and on its transport form, where it resolves against the transport's host and an --effort outside the option is refused; the fake transport takes neither. The compiler emits a worker with host codex as a Codex custom agent, .codex/agents/<name>.toml, from the codex-cli profile only, and Claude workers as before; every opt-in worker carries its optInLabel, Fable's set in the loadout with its definition's bytes unchanged (design F9). dotln-worker-astra is that file, opt-in by its definition's sentence. The generated-surface allowlists (scripts/lib/harness.mjs and packages/skeleton/src/gate-evidence.mjs) admit .codex/agents/dotln-*.toml. TRANSPORT_DEFAULTS stays a literal copy of the two defaults, held equal by the test 'the transports' pins are the role text's worker pins': the entropy review imports it when it loads, before any build, so deriving it from the compiled loadout would make the entropy and plan commands fail in a checkout whose packages are not built (D016, item 4).",
  "evidence": [
    "The host's custom-agent documentation (learn.chatgpt.com/docs/agent-configuration/subagents, read through Context7 on 2026-11-05): project-scoped custom agents are standalone TOML files under .codex/agents/ that must define name, description and developer_instructions; model and model_reasoning_effort set in the file take precedence over the spawn values. codex features list on Codex CLI 0.166.0 reports multi_agent stable and on.",
    "node scripts/harness.mjs emit and check: 43 generated surfaces, .codex/agents/dotln-worker-astra.toml with name, model gpt-6-astra and model_reasoning_effort max; .claude/agents/dotln-worker-fable.md byte-identical.",
    "scripts/test-review-worker.mjs 'each launch runs one of the operator's four options...': dry-run argv for the four options, the two cross-host refusals and the outside-the-four refusal; scripts/test-plan-refutation.mjs 'WO-126 direct command...' prints the Astra launch and refuses --model fixture by name, and 'WO-125 plan CLI accepts Codex GPT-6 Astra/max' still launches --model gpt-6-astra --effort max; packages/compiler/test/harness.test.ts 'a Codex worker is a generated Codex custom agent and never a Claude agent type'; scripts/test-harness.mjs 'WO-255 the generated dotln-worker-astra Codex agent sits beside dotln-worker-fable...' including drift on a changed pin; scripts/test-runner.test.mjs gate-input digest covers the new file."
  ],
  "rejected": [
    {
      "option": "A configuration key for the default option",
      "reason": "The operator's direction names the defaults by harness, not by instance (the order's design)."
    },
    {
      "option": "A free model id on the command line",
      "reason": "Four options are the rule; an id outside them is refused by name (the order's design). The four options' own model ids stay accepted, so WO-125's recorded launch spelling still runs."
    },
    {
      "option": "A Claude agent type named dotln-worker-astra",
      "reason": "A Claude agent type runs a Claude model; a Codex model belongs in Codex's own definition format."
    },
    {
      "option": "Generated TOML in multi-line literal strings",
      "reason": "JSON string syntax is valid TOML basic-string syntax for every value these fields carry, so no instruction text can end its string early; a literal string cannot hold three quotes."
    },
    {
      "option": "Treat .codex/agents files as pure projections in worktree integration",
      "reason": "The generated .claude/agents files are not either; parity keeps one integration rule for agent definitions."
    },
    {
      "option": "Derive TRANSPORT_DEFAULTS from the compiled loadout at import time",
      "reason": "Its importers load it before any build; a top-level import of the compiled loadout would make them fail in a fresh checkout, and the existing pins test already holds the two copies equal."
    }
  ],
  "reopenWhen": "The operator adds, removes or re-pins an option, or a Codex release stops reading project custom agents from .codex/agents."
}
```

## WO-255-D010 — Both prompt hooks journal the dispatch line's worker words

```json
{
  "id": "WO-255-D010",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 6, criterion 6; the operator's question of 2026-11-05 on the executor's stated reasoning",
  "decision": "harnessWorkerWords in packages/compiler/src/harness.ts reads the first content line of a resume: or planning: line and selects only from the words that close it and those that close its dispatch phrase before the first semicolon, where a lifecycle phrase carries its suffix ahead of direction (round 2's criteria F1), walking back while each word is fable, astra, a version (5.1, 6) or a joining and: fable selects {claude: fable} and astra {codex: astra}, a word followed by a full stop still counts, and a model named mid-line as a topic selects nothing (round 1's criteria F6 and design F5; D016, item 3); a line that names neither yields {}, and any other message yields nothing. Claude's session hook and the generated Codex prompt hook (packages/compiler/src/codex-continuation.mjs, which receives the same function embedded) each append a WorkerOptionsSelected row with that selection and their source to the session's journal on every such line, so a later dispatch line that names no option returns the session to the defaults; the Codex hook writes the row before its existing branch for sessions with no dispatched order, and its continuation logic and session record are untouched. resolveWorkerOption reads the latest row for the session its environment names. harnessPromptIntent admits astra beside fable after a lifecycle phrase. Claude's hook adds one context line when the line selects an opt-in, naming the routes that take it: npm run worker -- review --host with that host, and plan refute directly for the session's own host or with --transport for the other (design F13).",
  "evidence": [
    "packages/compiler/src/codex-continuation.mjs UserPromptSubmit: before this order it already appended {event, codexPromptObserved: true} to <key>.jsonl for every prompt of a session with no dispatched order, so the selection row is one more append in that branch.",
    "scripts/test-harness.mjs 'WO-255 a dispatch line's worker words are journaled...': planning: standard pass, astra journals {codex: astra} from claude-prompt-hook and injects the context line; resolveWorkerOption then gives astra (dispatch-word) for Codex and opus for Claude; resume: status fable selects fable for Claude; resume: status returns both to the defaults; an ordinary question journals nothing. scripts/test-codex-continuation.mjs 'WO-255 a Codex dispatch line journals the worker options...': three rows from codex-prompt-hook and none for an ordinary message.",
    "scripts/test-harness.mjs adds: planning: standard pass on why fable reviews were slow selects {}; resume: status; run the reviewers on astra. selects {codex: astra}; planning: standard pass, fable and astra selects both.",
    "scripts/test-harness.mjs adds round 2's cases: resume: status astra; keep the reviews short selects {codex: astra} and planning: refute fable; then publish selects {claude: fable}."
  ],
  "rejected": [
    {
      "option": "Record the selection only in Claude's hook and leave Codex to role text",
      "reason": "The order's rule is that the dispatch word alone selects; without the row a Codex session's helper launch with no --model would run gpt-6.1-sol after the operator named astra."
    },
    {
      "option": "A sidecar file per session for the selection",
      "reason": "D012 measured both arms; the journal row costs a 25 ms scan of the largest journal on this host once per launch and keeps the selection's history with the session's other rows, in the file both hooks already append to."
    }
  ],
  "reopenWhen": "A native Codex run shows the prompt event is not delivered (WO-054's probe registered no prompt hook), in which case a Codex session's launches rely on the role text naming --model.",
  "kind": "correction",
  "misread": "The executor first stated it would leave the Codex prompt hook alone because WO-254 had just reworked it, and record the selection in Claude's prompt hook instead, as if the one change stood in for the other.",
  "meant": "Whether a hook changes follows from what the order's rule needs and what the change costs there; Claude's hook needs the row for criterion 6 on its own, and a Codex session's launches need the same row for the dispatch word to select anything.",
  "changed": "Both hooks journal the selection through one shared parser; the Codex hook gains one guarded append in its prompt branch, covered by its own fixture."
}
```

## WO-255-D011

```json
{
  "id": "WO-255-D011",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 7, criterion 7",
  "decision": "The role text grows by the reviewed duties, and every root over its ceiling is boarded for optimization. Keep the new role sentences whole: the shared launch line every role but the router carries (the Astra opt-in, its receipt type, the helper's --model, --target and --capture forms and the dispatch-line default), the executor's recheck sentence and consistency table rule, and the planner's --capture sentence. Measured as the gate-followups rule measures, the installed instruction plus each skill, with node scripts/harness-context.mjs --check before and after the edit: executor 43,744 to 44,358 bytes (ceiling 29,246; 107 of them the record command's flags round 1's consistency F4 added), verifier 38,373 to 38,638 (29,831), reviewer 40,796 to 41,061 (28,884), release-close 28,373 to 28,638 (21,266), planner 29,643 to 30,142 (24,576), refuter 27,295 to 27,560 (no ceiling), router 17,124 unchanged (16,384). Every breach predates this order, the check is advisory, no ceiling is raised and no acceptance is recorded; the WO-255 role oracle pins the new trees at both economy settings over WO-246's and names this decision's follow-up for every root over its ceiling. The earlier optimization rows FUP-8b1f9bcc240a1483 (WO-246-D009) and FUP-f86af3151b401757 (WO-254-D013) name a role's reviewed rules changing again as their condition, which this order meets; their disposition is the final review's.",
  "evidence": [
    "The two harness-context runs' JSON, kept in the session scratchpad as harness-context-before.json and harness-context-after.json.",
    "npm run plan -- followups --show FUP-8b1f9bcc240a1483 and FUP-f86af3151b401757: both deferred, each reopening when a role's reviewed rules change again."
  ],
  "rejected": [
    {
      "option": "Cut other duty text to hold the roles' size",
      "reason": "Product 07's one route for cold-start ceilings keeps reviewed duties whole and boards the optimization with equivalent usefulness for planning."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-255 added the Astra opt-in, its receipt type and the review helper's --model, --target and --capture forms to the launch line every root but the router carries (265 bytes), the whole-change recheck and the Traced consumers rule and the record command's --host, --model, --effort and --tree to the executor (614 bytes in all) and the --capture sentence to the planner (499 in all), leaving the executor, verifier, reviewer, release-close, planner and router over their ceilings.",
  "reopenWhen": "A planning allocation reduces the roots below their unchanged ceilings with equivalent usefulness, or a role's reviewed rules change again."
}
```

## WO-255-D012 — Where the dispatch word is kept: two arms measured

```json
{
  "id": "WO-255-D012",
  "date": "2026-11-05",
  "dispatch": "resume: next; Tinkerer economy comparison for step 6",
  "decision": "Keep the selection as a WorkerOptionsSelected row in the session journal, read by a scan for the latest row, rather than as a one-object sidecar file. One bounded comparison, twenty runs each over the largest session journal on this host (the main checkout's, 11,135,947 bytes): the scan's median was 25.47 ms and the sidecar read's 0.02 ms. A launch reads it once and then runs for minutes, so the scan's cost does not change the outcome, while the row keeps which dispatch selected what beside the session's other rows, in the file both hooks already append to.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node <session scratchpad>/scan-compare.mjs printed {\"journalBytes\":11135947,\"scanMedianMs\":\"25.47\",\"sidecarMedianMs\":\"0.02\"}."
  ],
  "rejected": [
    {
      "option": "The sidecar file",
      "reason": "Faster by 25 ms per launch, but a second state file per session for two hooks to write and nothing to say which dispatch line chose the option."
    }
  ],
  "reopenWhen": "A session journal grows so large that reading it for a launch takes a noticeable share of the launch, or a reader needs the selection without a session journal."
}
```

## WO-255-D013

```json
{
  "id": "WO-255-D013",
  "date": "2026-11-05",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.118.0, the next minor above the observed release baseline v0.117.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.117.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-255-reviews-find-what-the-complete-run-finds.md"
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

## WO-255-D014 — The changed components take minor bumps

```json
{
  "id": "WO-255-D014",
  "date": "2026-11-05",
  "dispatch": "resume: next; release prepare's component versions",
  "decision": "Bump @dotln/compiler from 0.40.0 to 0.41.0 (its package.json, COMPILER_PACKAGE_VERSION and the lockfile), @dotln/skeleton from 0.84.0 to 0.85.0 with its compiler pin, and HARNESS_HOST_VERSION from 0.44.0 to 0.45.0, because both packages' src changed with new behavior (the compiler's Codex worker emission, shared word reader and Codex hook row; the skeleton's worker options, role text, prompt-hook row and generated-surface rule); @dotln/console keeps 0.5.0, its src unchanged, and only its exact workspace pins move. Kernel, beacons and browser-evidence are unchanged.",
  "evidence": [
    "git diff --name-only against the merge base: packages/compiler/src/harness.ts and codex-continuation.mjs; packages/skeleton/src/loadouts/contributor.ts, harness-host.ts and gate-evidence.mjs; nothing under packages/console/src, packages/kernel/src or the other packages.",
    "scripts/release.mjs componentVersionRules and the workspace-pin rule: a component whose src changed since the latest release carries a different version, and every workspace pin is the exact workspace version. WO-246's c34df6ce1 is the same five-file shape.",
    "COMPILER_PACKAGE_VERSION in packages/compiler/src/artifact-identity.ts is a release label in a judged feedback source; product 07 §Operator-opened planning pass and WO-152-D004 keep a version-only edit from staling the feedback edition, so it owes no live episode."
  ],
  "rejected": [
    {
      "option": "Patch bumps",
      "reason": "The order's release classification is minor: new flags, a new generated definition and a new required report section."
    }
  ],
  "reopenWhen": "Integration with main brings another component release, or a later edit changes a component this decision leaves unbumped."
}
```

## WO-255-D015 — Round 1 of the review ladder: 26 findings, 22 fixed and 4 recorded

```json
{
  "id": "WO-255-D015",
  "date": "2026-11-05",
  "dispatch": "resume: next; the review ladder's round 1",
  "decision": "Round 1 ran over tree deb9ff3009ed029400e023a028d6eeeb0b7fef92 against main's ccfba0df927ccc2e76558af701a1075fc0fa4b36: three fresh dotln-worker reviewers on Claude (claude-opus-5-5 at xhigh, the generated pin; the dispatch line named no opt-in), each given the helper's canonical brief of its kind rendered with --dry-run and recorded with npm run worker -- record. The criteria adversary found 8 (1 blocking) in 0 h 12 min (745,572 ms, 196,433 tokens), the design improver 13 (none blocking) in 0 h 10 min (624,016 ms, 212,149 tokens) and the consistency reviewer 5 (1 blocking) in 0 h 19 min (1,166,965 ms, 283,193 tokens): 26 findings, 25 distinct, since criteria F6 and design F5 are one defect. Fixed (22): criteria F1 (the tree line inside a findings object's report field, D005), F3 (empty cells, D004), F4 (the lane digest, D002), F5 (quoted dispatch lines, D007), F6 with design F5 (the closing words, D010) and F8 (WO-244's carry-in, D017); design F1 (the safe target snapshot, D008), F2 (the shared target binding, D008), F3 (the recorded body, D004), F4 (the combined round's number, D002), F6 (the shared lookup and worker types, D009), F7 (the selection vocabulary, D009), F8 (a computed base's own label in the refusal), F9 (the required opt-in label, D009), F12 (the opening line, D005) and F13 (the hook's context line, D010); consistency F1 (harness-fixtures declares scripts/lib/worker-launch.mjs), F2 (Receipt 063's six known issues, D016), F3 (the security guide's dispatch-line path), F4 (the executor root's record command names --host, --model, --effort and --tree) and F5 (the D007 wording the docs check read as quoted speech). Recorded, not fixed (4): criteria F2 (D005's rejected option), criteria F7 (a note: the protocol's prompt order is a judged feedback source; D007's reasoning is corrected), design F10 (a Copilot session is neither launch host, so the direct launch names none rather than a wrong one) and design F11 (moving HOST_GIT_READ into git.mjs would widen the change into the publishing module for no behavior; the helper imports it where the target binding already does). Every reviewer had findings fixed, so round 2 rechecks all three.",
  "evidence": [
    "docs/control/local/reviews/WO-255/round-1-criteria.md, round-1-design.md and round-1-consistency.md with their records, from the Agent route, each binding the reviewed tree named in its opening line.",
    "The fixes' fixtures: scripts/test-review-worker.mjs (23 cases), scripts/test-harness.mjs WO-255 cases, scripts/test-codex-continuation.mjs WO-255, packages/compiler/test/harness.test.ts and the runner's 'WO-174 every machinery suite covers its direct entry imports', each passing under node scripts/harness.mjs bounded --."
  ],
  "rejected": [
    {
      "option": "Leave the should-fix findings to a follow-up",
      "reason": "Round 1 admits every finding; each fix is inside the order's surfaces and its own fixture judges it."
    }
  ],
  "reopenWhen": "A round-2 recheck finds a round-1 fix does not hold."
}
```

## WO-255-D016 — Receipt 063's six known issues

```json
{
  "id": "WO-255-D016",
  "date": "2026-11-05",
  "dispatch": "resume: next; the catalog row's known issues for the executor (docs/planning/work-order-map.md, WO-255's row; round 1's consistency F2)",
  "decision": "The six known issues Receipt 063 left on WO-255's catalog row, each disposed. 1, --since after the ladder's end: built as an advisory, not a refusal; a fresh --since round 1 over the tree its lane last reviewed is named a re-roll by the helper and the record (D002), since criterion 1 admits a fresh round 1 with --since over any tree and the executor root's rule keeps the execution ladder's end; reopen as the receipt says, a lane showing a --since round 1 with no newer commit. 2, tables checked for presence: accepted as the planner reads it and tightened, since dashes and words for nothing done now count as empty cells (D004); whether a named command ran stays the verifier's reading; reopen as the receipt says, a table naming a command absent from the worker's session record. 3, a model word anywhere on the line: built as the planner reads it, since only the words that close the line select (D010); a cross-host refusal is not built, because criterion 6 requires a planning: line carrying astra in a Claude-hooked session to select it for that session's Codex launches, and each word selects only its own host's launches, so no word is remapped; reopen as the receipt says, a topic mention changing a launch. 4, the four ids in source: carried in contributorWorkerOptions rather than TRANSPORT_DEFAULTS, because the generated worker definitions are compiled from the loadout, which cannot read a script module, and the transports' two default pins stay a literal copy held equal by a test (D009); a configuration key stays a later pass's candidate; reopen when the options change. 5, the recheck's added reading: D003 records the old rule's round-2 figures for WO-250, WO-253 and WO-254, this order's own round 2 is recorded with its ladder, and FUP-dec74be4077f5f25 takes the next two orders; reopen as the receipt says, readAmplification rising at WO-255's close. 6, no critical-path gate named: nothing to build here; --target gives WO-083 (inferred P) a review route through the helper; reopen as the receipt says, its order reviewed by hand.",
  "evidence": [
    "docs/planning/work-order-map.md, WO-255's catalog row: Receipt 063 known issues (2026-11-04), six, with the planner's readings.",
    "Criterion 1 of the order (a fresh round 1 with --since <tree> on a lane holding a round 1 report) and criterion 6 (a planning: line carrying astra selects it for the session's Codex launches in the harness fixture)."
  ],
  "rejected": [
    {
      "option": "Build the planner's readings 1 and 3 in full",
      "reason": "A refusal of --since over an older tree and a refusal of the other host's word would each refuse a command its own criterion admits."
    }
  ],
  "reopenWhen": "Any of the six reopening conditions above occurs."
}
```

## WO-255-D017 — WO-244's plan review takes --capture: the carry-in boarded where WO-244 reads it

```json
{
  "id": "WO-255-D017",
  "date": "2026-11-05",
  "dispatch": "resume: next; the order's known issue on WO-244 (round 1's criteria F8)",
  "decision": "The order's Known issues say WO-244's row names this order's --capture flag, and no WO-244 surface does: not its order, not its queue row, not the register. An executor edits no other order's text, so the duty is boarded as a register row WO-244's executor and planner find with npm run plan -- followups --touching WO-244: when plan review launches a planning subject's criteria review, it passes the operator's dispatch capture with --capture, and its report answers each item in an Items table. Until then the planner's role text names the flag (contributor.ts), as the order's carry-in allows.",
  "evidence": [
    "git grep -n capture over docs/work-orders/WO-244-paired-planning-passes-and-the-synthesis-pass.md and docs/work-orders/README.md's WO-244 row: no mention of --capture or WO-255.",
    "packages/skeleton/src/loadouts/contributor.ts, the planner's procedure: the criteria review of a planning subject carries the operator's dispatch capture with --capture <file>."
  ],
  "rejected": [
    {
      "option": "Amend WO-244's order",
      "reason": "Changing a filed order's text is a planning amendment with its own authorization route; the executor of another order has no such authority."
    }
  ],
  "followup": "When WO-244 builds npm run plan -- review, have it pass the operator's dispatch capture to the planning subject's criteria review with npm run worker -- review --kind criteria --subject planning --capture <file>, so the adversary answers each dispatch item in its Items table; cover it in WO-244's plan review fixture.",
  "reopenWhen": "WO-244 activates, or plan review launches a planning criteria review without --capture."
}
```

## WO-255-D018 — Round 2 of the review ladder: the whole change read again

```json
{
  "id": "WO-255-D018",
  "date": "2026-11-05",
  "dispatch": "resume: next; the review ladder's round 2",
  "decision": "Round 2 re-tasked the three round-1 reviewers with SendMessage, each given the helper's canonical recheck brief (--recheck <its round-1 report> --dry-run) over tree de8ccccb6828933ab87cb964019481bfee03f511, the whole change against ccfba0df927ccc2e76558af701a1075fc0fa4b36 again, with round 1's tree named for the fixes' delta. The criteria recheck took 0 h 5 min (312,902 ms), the design recheck 0 h 6 min (361,359 ms) and the consistency recheck 0 h 8 min (470,512 ms), against the old rule's 0 h 4 min to 0 h 8 min (D003); the hosts' token figures for the resumed agents (252,029, 292,654 and 355,639) count each agent's whole transcript, round 1 included. Of 26 rechecks, 24 held; criteria F2 stays recorded, with D005's reason sharpened, and criteria F5 did not hold, since whole-line matching missed a quotation without its item marker. New findings: 2 admitted under the admission rule, both fixed: criteria F1 (criterion 6: a lifecycle phrase's suffix before a semicolon selected nothing, D010) and design R2-F1 (criterion 4: a quotation inside a findings object's report field survived in returnedText and the count read 0), fixed with criteria F5's not-held recheck by matching runs of the dispatch's words through JSON escapes (D007). Recorded for the handoff, not fixed (4 notes): criteria F2 (a combined round named by --since alone now writes round-3-combined where main wrote round-1-combined), design N2 (such a round after a since-ladder writes into the subject lane, not the ladder), design N3 (the receipt validators reach the four worker types through the launch module) and consistency N1 (the WO-255 oracle's method text does not mention the record-command flags it pins). Round 2's fixes changed code, so round 3 runs: one combined worker over the delta since round 2's tree.",
  "evidence": [
    "docs/control/local/reviews/WO-255/round-2-criteria.md, round-2-design.md and round-2-consistency.md with their records.",
    "scripts/test-review-worker.mjs (the capture case quoting the dispatch in prose without its marker and inside a findings object's report field) and scripts/test-harness.mjs (the semicolon cases), each passing under node scripts/harness.mjs bounded --."
  ],
  "rejected": [
    {
      "option": "Fix the four notes now",
      "reason": "The admission rule records a new finding that breaks no criterion and no behavior main had in the handoff, unfixed, so the ladder ends."
    }
  ],
  "reopenWhen": "Round 3 finds a round-2 fix does not hold, or a note proves to break a criterion."
}
```

## WO-255-D019 — Round 3, the ladder's last, and the executor's judgment of the remaining delta

```json
{
  "id": "WO-255-D019",
  "date": "2026-11-05",
  "dispatch": "resume: next; the review ladder's round 3 and the executor's judgment",
  "decision": "Round 3, the last, ran because round 2's fixes changed code: one fresh dotln-worker on Claude (claude-opus-5-5 at xhigh) carrying the three briefs over the delta from round 2's tree de8ccccb6828933ab87cb964019481bfee03f511 to 5cc53d44864984de61f171ba93735cc1eb5d21ef, given the helper's canonical combined brief with round 2's three reports as --recheck, in 0 h 15 min (888,157 ms, 200,193 tokens). Its four rechecks of round 2's findings held. It found 5: F1 admitted under criterion 4 (a capture item of five or fewer words, quoted without its item number, kept its words, since the number was read as one of the item's words), fixed by leaving each capture line's item marker out before its words are read (D007), with the capture fixture quoting item 1 without its number; and four notes recorded for the handoff, not fixed: N1 (an Items row's number pulled into a cut beside a restated item, which F1's fix removes too), N2 (the pre-semicolon reading selects a model that closes a topic before the semicolon, as the documented rule allows), N3 (two comments and the omittedDispatchLines field still say line where the omission now counts passages) and N4 (a quotation over a hard-wrapped capture line counts as two passages, and a word holding a \\uXXXX escape can survive in returnedText). After round 3 no reviewer runs: the executor judged the remaining delta, the marker rule and its fixture, by the fixture's pass under node scripts/harness.mjs bounded -- (23 of 23 review-worker cases) and by tracing round 3's N1 row, whose cut now covers only the item's words. The ladder spent 7 worker uses of the cap's 20: three round-1 launches, three round-2 re-tasks and one round-3 launch.",
  "evidence": [
    "docs/control/local/reviews/WO-255/round-3-combined.md and its record.",
    "scripts/lib/review-worker.mjs ITEM_MARKER and omitDispatch; scripts/test-review-worker.mjs, the capture case's quotation of item 1 without its number (3 passages omitted)."
  ],
  "rejected": [
    {
      "option": "A fourth review round over the marker fix",
      "reason": "WO-250's ladder ends at round 3; the executor judges the remaining delta, here a five-line rule and its fixture."
    }
  ],
  "reopenWhen": "The complete run or the verifier finds the marker rule omits or keeps a passage it should not."
}
```

## WO-255-D020 — The first complete run failed on a Codex inventory the WO-054 case still listed by hand

```json
{
  "id": "WO-255-D020",
  "date": "2026-11-05",
  "dispatch": "resume: next; the first complete run and its repair",
  "decision": "The first complete run, npm test -- --review, failed in harness-fixtures on 1 case: 'WO-054 Codex installation preserves unowned configuration before any bundle write' (scripts/test-harness.mjs). The case makes every Codex file unowned by dropping the .codex/ entries from the fixture's manifest, then deletes the three Codex files it named, config.toml, hooks.json and hooks/continuation.mjs, before emitting again; the Codex profile now also emits .codex/agents/dotln-worker-astra.toml, which stayed on disk unowned, so the second emit refused it as unowned Codex output. The product rule held, since an unowned file is never replaced; the case's inventory was out of date. The repair reads the Codex files from the manifest the case is about to empty, asserts the four it expects among them, and deletes each, so the case judges every Codex file the bundle owns. The runner then started none of the 34 later entries of its plan, the row's unrunSuites in 16 suites, so they run first in the fresh complete run. The repair's diff, 19 changed lines in scripts/test-harness.mjs (13 inserted, 6 removed), takes the ladder from round 3 under product 07's rule for a repair under fifty changed source lines: one combined worker, reported in the order's repair-1 lane. Its base is round 3's reviewed tree 5cc53d44864984de61f171ba93735cc1eb5d21ef, not the failed run's tree, which the repository does not hold: the gate hashes the candidate tree in process (gateTreeHash in packages/skeleton/src/gate-evidence.mjs) without writing its objects, so --since refuses it. That delta, 43 changed source lines in three scripts (29 inserted, 14 removed), holds the repair and the item-marker rule the executor judged after round 3 (D019), so both are reviewed.",
  "evidence": [
    "The complete run: npm test -- --review, recorded 2026-11-05T17:40:46.420Z after 0 h 13 min (763,393 ms), exit 1, tree 9c63322123056e100d1ec9ace4d93d168e41402c, code identity c01bafd9823e58f25126ea45b8ddb6062e410f54e6e781ec6e58484a72515acc; its summary reads 27 passed and 17 failed of 44 suites: harness-fixtures failed on 1 case, and the other 16 held the 34 entries the runner never started (the row's unrunSuites), so 84 of its 118 tasks ran and 83 passed.",
    "The failing case's error: unowned Codex output refuses replacement: .codex/agents/dotln-worker-astra.toml, thrown by emitHarness in scripts/lib/harness.mjs on the case's second emit.",
    "The repaired case passed alone: node scripts/harness.mjs bounded -- node --test --test-name-pattern 'WO-054 Codex installation preserves unowned configuration' scripts/test-harness.mjs.",
    "Why the ladder did not find it: round 1's consistency reviewer traced the generated-path inventories (the harness allowlist, the gate-input pattern, the export prefix, the integration projections) and this case's list of Codex files is a test fixture's inventory, outside those four; the case's suite ran only its WO-255, WO-187 and WO-146 cases during execution.",
    "git cat-file -t 9c63322123056e100d1ec9ace4d93d168e41402c: could not get object info; git cat-file -t 5cc53d44864984de61f171ba93735cc1eb5d21ef: tree."
  ],
  "rejected": [
    {
      "option": "Keep the case's three-file list and add the fourth by name",
      "reason": "Reading the list from the manifest the case empties keeps it true when the Codex profile emits another file; the named assertion keeps the four this order relies on."
    }
  ],
  "reopenWhen": "The fresh complete run fails in a suite this repair or the order's change touches, or a repair's ladder cannot name its failed run's tree.",
  "followup": "Let a repair's review ladder name the failed complete run's tree as its base: the gate records treeHash but hashes the candidate in process without writing its objects, so npm run worker -- review --since <failed tree> is refused and a repair falls back to an earlier reviewed tree. Keep the run's tree objects once the run has ended (written outside the run, since a gate writes no repository object during it), or let the helper take a gate row's evidence reference as its base; cover a repair ladder whose --since is the failed row's tree in scripts/test-review-worker.mjs."
}
```

## WO-255-D021 — The repair's round 3 and the executor's judgment of the remaining delta

```json
{
  "id": "WO-255-D021",
  "date": "2026-11-05",
  "dispatch": "resume: next; the repair's round 3 and the executor's judgment",
  "decision": "The repair's round 3 ran as one fresh combined dotln-worker on Claude (claude-opus-5-5 at xhigh) over the delta from 5cc53d44864984de61f171ba93735cc1eb5d21ef to fe367560e80ec728c50502583db65d0e8409b25c (D020), in 0 h 17 min (1,002,069 ms, 193,980 tokens), reported in docs/control/local/reviews/WO-255/repair-1/round-3-combined.md. It held the WO-054 repair complete and right in shape, and searched the 34 entries the failed run never started (its row's unrunSuites) for another hand-listed inventory of generated or Codex files, finding none. It found 4: F1 admitted under criterion 4 and fixed, since the item-marker rule had measured the twenty-character threshold on the item without its number, so a short item quoted with its number (12. Fix the lane bug) was kept, a case the rule before it caught; the threshold is measured on the whole line again while the words are still the item's, and the capture fixture quotes such an item with its number (D007). Three notes are recorded for the handoff: N1 (marker forms outside the rule, such as 6.a, A., 1:, **1.** and #1, leave a short item quoted without its label kept), which stands; N2 (D020 understated the repair diff), whose figures are corrected there to 19 changed lines in scripts/test-harness.mjs and 43 in the reviewed delta; and N3 (the docstring's wording), which the threshold fix and the docstring rewritten with it make true again. After the repair's round 3 no reviewer runs: the executor judged the remaining delta, the one-line threshold, its docstring and its fixture (12 lines added and 9 removed in scripts/lib/review-worker.mjs and scripts/test-review-worker.mjs), by the review-worker suite's 23 of 23 cases under node scripts/harness.mjs bounded -- and by tracing the reviewer's second case, 1. Do not stop the run, now caught with or without its number. Worker uses: 8 of the cap's 20.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-1/round-3-combined.md and its record.",
    "git diff --numstat 5cc53d44 fe367560 -- scripts packages: review-worker.mjs 12 and 6, test-harness.mjs 13 and 6, test-review-worker.mjs 4 and 2."
  ],
  "rejected": [
    {
      "option": "Keep both the marked and unmarked forms of each capture line in the sets",
      "reason": "It restores every case the rule before it caught but pulls an Items row's number back into a cut (round 3's N1); measuring the length on the line keeps the number out and catches both quotations."
    }
  ],
  "reopenWhen": "The fresh complete run or the verifier finds the omission keeps a quotation of a capture item it should catch."
}
```

## WO-255-D022 — The outcome against the order's aim: its own ladder missed what its first complete run found

```json
{
  "id": "WO-255-D022",
  "date": "2026-11-05",
  "dispatch": "resume: next; the handoff's goal alignment",
  "decision": "The deliverable matches the order's criteria: the branch-keyed planning lane, the whole-change recheck, the Traced consumers table, the record flags, --capture, --target and the four worker options are built, documented and judged by their fixtures, and the second complete run passed. The order's aim, that reviews find what the complete run finds, held only in part on the order itself: three review rounds passed a change whose first complete run then failed in harness-fixtures, on a test case that listed the Codex files by hand (D020). Round 1's consistency reviewer traced the generated-path inventories, and a test's own list of generated files was a consumer outside them; the repair's round 3 then searched the 34 entries the failed run never started for another such list and found none, and the repaired case reads its list from the manifest. The table's two required rows are generated pages and fixture manifests, so a test's hand-written list of generated output is still no named row; that gap is boarded, not fixed.",
  "evidence": [
    "D020: the failed case 'WO-054 Codex installation preserves unowned configuration before any bundle write' and why the ladder did not find it.",
    "docs/control/local/reviews/WO-255/round-1-consistency.md, its Traced consumers table; docs/control/local/reviews/WO-255/repair-1/round-3-combined.md, its search of the unrun entries.",
    "packages/skeleton/src/loadouts/contributor.ts, the consistency brief's table with its generated pages and fixture manifests rows; scripts/lib/review-worker.mjs, the report check requiring those two rows."
  ],
  "rejected": [
    {
      "option": "Add the row to the consistency brief and the report check now",
      "reason": "It changes the emitted brief and the helper after the passing complete run, so it would need its own review ladder and complete run; the order's criteria name the two rows it has."
    }
  ],
  "reopenWhen": "A later order's complete run fails on a hand-written list of generated files that its consistency review did not trace.",
  "followup": "Add a third required Traced consumers row to the consistency brief and the helper's report check: tests and fixtures that list generated or emitted files by hand, such as WO-255-D020's WO-054 Codex inventory in scripts/test-harness.mjs, each traced with the command that finds them; or have such tests read their lists from the manifest, as the WO-054 repair does."
}
```

## WO-255-D023

```json
{
  "id": "WO-255-D023",
  "date": "2026-11-05",
  "dispatch": "resume: verify",
  "decision": "Independently judge the eight original criteria at the executor handoff code identity. Consume its passing complete review row after recomputing the identity, and reproduce claims with bounded probes rather than paying another complete run. Keep the implementation unchanged. The NoOp of filing a pass from the existing green rows is rejected because fixtures do not establish every supported input. The traps are treating a green suite as exhaustive (counter with independent inputs), promoting a preference to a blocker (require a criterion and supported reproduction), and changing code while judging it (write evidence and the allocated VER only). No worker is needed: every claim can be reproduced locally; zero uses against the cap of twenty. The actual session is Codex CLI 0.166.0, gpt-6-astra at max, from codex-session-readback; xhigh is the order recommendation, not this session readback. The transport exposes no hard USD 5 control, so that optional spend cap is unenforced.",
  "evidence": [
    "docs/evidence/WO-255/verifier-001/gate-evidence.json: recomputed identity matches the intact passing complete review row and structural rows, with no missing required suites.",
    "docs/evidence/WO-255/verifier-001/checks.json and observations.json: named fixtures pass; independent supported inputs fail criteria 1 and 3.",
    "Process correction: initial status, combined document reads, one aggregate diff emission and meta's oversized historical summary exceeded their output budgets and were truncated. No hidden output was treated as evidence: selected status fields were reread, verdict-relevant passages were reread in bounded sections, and full diffs were retained in session scratch for chunked reading. Output volume, not a product failure, caused the truncation. The meta command exited successfully; its generated current-order rows were read separately. A read-output request exceeded the report's byte length and was corrected using its measured byte length. These process errors did not change the product verdict; records cite the exact probes and selected gate fields."
  ],
  "rejected": [
    {
      "option": "Rerun the complete review gate before recording the verifier findings",
      "reason": "The current code identity already has an intact passing row, and the failures are reproduced independently; another unchanged complete run would not resolve them."
    }
  ],
  "reopenWhen": "The code identity changes, a cited observation cannot be reproduced, or the operator expands verification scope."
}
```

## WO-255-D024

```json
{
  "id": "WO-255-D024",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-001 F1, criterion 1",
  "decision": "Fail criterion 1 on a deterministic planning-lane collision. The supported nested branch planning/2030-01-02/recheck and the supported literal branch planning/2030-01-02-recheck-5cd9ca9c both dry-run to planning-2030-01-02-recheck-5cd9ca9c/round-1-criteria.md. The first real fixture launch records; the second is refused as an existing round although it is a distinct branch and pass. This is no hash collision: only names transformed by slugging receive the digest, so a literal name can equal the complete transformed spelling. The existing fixture explicitly supports nested planning/a/b. Preserve the implementation in verification and route repair within review-worker.mjs and its existing tests.",
  "evidence": [
    "docs/evidence/WO-255/verifier-001/probes.mjs; observations.json firstDryReport, secondDryReport, firstBranch, secondBranch and laneCollision.",
    "scripts/lib/review-worker.mjs planningLane and runChangeReview; scripts/test-review-worker.mjs two planning branches whose names slug alike keep their own lanes."
  ],
  "rejected": [
    {
      "option": "Treat this as a hypothetical cryptographic collision or use --since to recover the second pass",
      "reason": "The reproduction needs no hash search and uses valid branch names admitted by the helper. Criterion 1 gives distinct passes their own branch lanes; a new ladder inside the other pass is not that behavior."
    }
  ],
  "followup": "Repair WO-255 VER-001 F1 in scripts/lib/review-worker.mjs: give every supported planning branch a distinct lane namespace, including a transformed name and a literal name equal to its rendered slug plus digest. Preserve existing reports, and add a fixture showing both dry-run paths differ and both first reviews record. Reproduction: docs/evidence/WO-255/verifier-001/probes.mjs.",
  "reopenWhen": "The lane mapping or migration changes; rerun the two-branch reproduction in the repair."
}
```

## WO-255-D025

```json
{
  "id": "WO-255-D025",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-001 F2, criterion 3",
  "decision": "Fail criterion 3 because an ordinary prose consistency report with a complete Traced consumers table and a fenced JSON example is still rejected when the example contains schemaVersion or findings. The two clearly introduced examples are {\"schemaVersion\":1,\"value\":2} and {\"findings\":[],\"total\":0}; both return invalid-result: change review result shape. The plain {\"value\":2} control records. claimedResult treats either field name alone as a claim to be the review result, ignoring the surrounding prose and example fence. This reproduces D006's reopening condition and the same ordinary-prose failure shape as WO-250-D015, now expressly covered by criterion 3. No arbitrary structured result or unsupported CLI flag is needed.",
  "evidence": [
    "docs/evidence/WO-255/verifier-001/probes.mjs; observations.json proseExample, versionedJsonExample and findingsJsonExample.",
    "scripts/lib/review-worker.mjs claimedResult and recordAgentReview; docs/evidence/WO-255/decisions.md WO-255-D006; docs/evidence/WO-250/decisions.md WO-250-D015."
  ],
  "rejected": [
    {
      "option": "Mark the original value-only fixture sufficient or require reviewers to avoid these ordinary JSON keys",
      "reason": "The criterion and standing guide promise prose reports containing JSON examples, not a reservation on example keys. The input explicitly identifies an example and carries the required consistency table."
    }
  ],
  "followup": "Repair WO-255 VER-001 F2 in scripts/lib/review-worker.mjs: distinguish an actual claimed review result from an incidental versioned or findings-bearing JSON example in prose. Preserve both examples and continue rejecting malformed actual review results; add the two prose consistency-report cases beside the existing plain, valid structured and malformed structured controls. Reproduction: docs/evidence/WO-255/verifier-001/probes.mjs.",
  "reopenWhen": "The structured/prose discriminator changes; rerun the positive and negative recorder controls in the repair."
}
```

## WO-255-D026 — A planning lane is the branch's name, escaped, so it decodes back to one branch

```json
{
  "id": "WO-255-D026",
  "date": "2026-11-05",
  "dispatch": "resume: fix; VER-001 F1, criterion 1",
  "decision": "A planning subject's lane is planning- followed by the branch's name after planning/, with each UTF-8 byte of any character other than a letter, digit, dot, underscore or hyphen written as % and two uppercase hexadecimal digits, as a URL escapes it. The rule the repaired helper holds: every lane decodes back to exactly one branch, so two branches never share a lane whatever either is named, and no digest is left to collide. A name of those characters alone keeps its spelling, so every literal lane and the reports already in it stay where they are; plan start's planning/<date>-<slug> names are all literal. A branch whose lane would pass 255 bytes, the most one directory name holds, is refused naming the length before the brief is rendered or a worker starts; before, such a name failed at the report write, after the worker had returned. The digest form planning-<slug>-<8 hex> never shipped: main names a planning lane planning-<date>, and only this order's unmerged code and fixtures wrote the digest form, so nothing migrates, and reading it as an alias would bring the collision back. Boundaries: lanes are distinct as names, so on a case-insensitive file system two branches differing only in letter case would share a directory, as Git's own loose refs do there (on this host Git refuses the second such branch: a branch named planning/2030-01-02-pass already exists); and the branch is read as Git prints it, in UTF-8, so a branch name that is not valid UTF-8 reads as its replacement characters.",
  "reopens": {
    "decisionId": "WO-255-D002",
    "observation": "VER-001 F1: planning/2030-01-02/recheck and planning/2030-01-02-recheck-5cd9ca9c both named planning-2030-01-02-recheck-5cd9ca9c, D002's reopening condition that two planning branches slug to one lane."
  },
  "evidence": [
    "scripts/lib/review-worker.mjs planningLane and MAX_LANE_BYTES.",
    "scripts/test-review-worker.mjs 'every planning branch names a lane of its own that decodes back to it ...': on one fixture date the verification's pair and three names the old slug read as the same hyphen (planning/2030-01-02%2Frecheck, the literal percent spelling of the nested name's own escape; planning/2030-01-02+recheck; planning/2030-01-02-recheck) each dry-run into its own lane and run their round 1 there, each record naming its branch; eleven names, café among them, map to eleven lanes that decode back to their branches; a 255-byte lane is admitted, a 256-byte one refused, and a branch with a 272-byte lane is refused on the dry run and on the launch with no lane written. 24 of 24 under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs.",
    "A session-scratch probe, not retained: the verification's pair dry-runs and records its first review into planning-2030-01-02%2Frecheck and planning-2030-01-02-recheck-5cd9ca9c; the pre-repair planningLane, read from refs/dotln/checkpoint/WO-255/5, names both planning-2030-01-02-recheck-5cd9ca9c, and its lanes for planning/a/b, planning/a+b, planning/a%2Fb and planning/2030-01-02/café do not decode back to their branches.",
    "git branch planning/2030-01-02-Pass then planning/2030-01-02-pass in a scratch repository on this host (files ref backend): fatal: a branch named 'planning/2030-01-02-pass' already exists."
  ],
  "rejected": [
    {
      "option": "Keep the slug and move the digest behind a character no literal name holds (planning-<slug>+<digest>)",
      "reason": "It separates literal from transformed names but leaves two transformed names apart only by a truncated digest, which a search can collide; the escape needs no digest and reads back to its branch."
    },
    {
      "option": "Escape every name, literal ones included, or fold letter case",
      "reason": "Every literal lane, and the reports already in it, would move, which VER-001's repair rule says to preserve."
    },
    {
      "option": "A directory per branch component (planning/<date>/<name>/)",
      "reason": "A lane would then hold another branch's lane inside it beside its own since-<tree>/ ladders, and every literal lane would move."
    },
    {
      "option": "Let the second branch reach the first branch's lane through --since",
      "reason": "VER-001 rejects it: a --since ladder inside another pass's lane is not that pass's own lane."
    }
  ],
  "reopenWhen": "Two planning branches name one lane, or a reader of a planning lane needs its branch and cannot decode it."
}
```

## WO-255-D027 — A claimed result stands where a worker states its own return; a JSON example in code or prose stays prose

```json
{
  "id": "WO-255-D027",
  "date": "2026-11-05",
  "dispatch": "resume: fix; VER-001 F2, criterion 3; WO-250-D015 (FUP-60ea250ef102cc46)",
  "decision": "npm run worker -- record reads a claimed change review result only where a worker states its own return: the whole text; else the last object that carries the result's schemaVersion or findings and no key the result lacks and stands as a block of its own outside fenced code, its opening brace beginning a line indented at most three spaces and its closing brace ending a line; or the whole body of a fenced code block carrying all five of the result's keys, or a fenced block that is all the text holds. The rule the repaired recorder holds: a JSON object fenced as an example, in a code span or inside a sentence is quoted material whatever keys it carries, and a text that claims nothing is recorded as the worker's prose report. A claim is still bound by validateChangeReviewResult, so a malformed claim is refused wherever it is stated. Boundaries: an unfenced object on lines of its own that carries only the result's keys is read as a claim, so a worker quotes such an example in code; a fenced result missing one of the five keys, with other text beside it, is recorded as prose, and the printed line says the record holds no findings object a recheck can name.",
  "reopens": {
    "decisionId": "WO-255-D006",
    "observation": "VER-001 F2: prose consistency reports holding the fenced examples {\"schemaVersion\":1,\"value\":2} and {\"findings\":[],\"total\":0} were refused as malformed results, D006's reopening condition that a JSON example carrying a findings key is taken as the worker's claimed result."
  },
  "evidence": [
    "scripts/lib/review-worker.mjs claimedResult, objectAt and linesOf, and recordAgentReview's docstring.",
    "scripts/test-review-worker.mjs 'record reads a claim only where a worker states its own result ...': the verification's two example reports, a fenced example of the result's own keys alone, a malformed return quoted in code spans, the result's keys inside a sentence and a key no result carries on a line of its own are each recorded as prose with the whole text as the report; a result filling its fence and one printed over lines of its own between prose are bound with findings F1 and F2; a malformed fence carrying the whole shape, a malformed fence that is all the text holds and a malformed block followed by prose are refused. The existing controls hold: plain prose, a fenced {\"value\":2}, a result between prose and its table, an example then a result, the malformed whole text and the malformed block. 24 of 24 under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs.",
    "A session-scratch probe, not retained: the verification's two reports, each recorded in its own fixture, are prose (structured false); the pre-repair claimedResult, read from refs/dotln/checkpoint/WO-255/5, claims both and claims the four unquoted examples above. The verifier's probes.mjs records the first example now and then meets the overwrite rule, because it records three consistency reports into one fixture lane; that is its sequencing, not a refusal of the example.",
    "All eight Agent returns this order's ladder recorded (rounds 1 to 3 and repair-1's round 3) open with the Reviewed tree line, carry prose and close with the findings object unfenced on its own line; the repaired claimedResult reads each as a claim that validates, with the finding count its record holds."
  ],
  "rejected": [
    {
      "option": "Treat any object carrying a key the result never has as an example, and nothing else",
      "reason": "It passes the verification's two examples and still claims {\"schemaVersion\":2,\"findings\":[]} quoted in a code span, the shape a review of this recorder quotes."
    },
    {
      "option": "Read the claim only from the object that ends the text",
      "reason": "The existing control records a result followed by its Traced consumers table, a shape main's recorder took."
    },
    {
      "option": "Treat every fenced object as an example",
      "reason": "Main's recorder bound a result fenced as JSON, so a worker that fences its whole return would lose its findings to a prose record."
    },
    {
      "option": "Judge an object by the words around it, such as example",
      "reason": "A word in prose is no boundary; the code fence and the block are Markdown's own."
    }
  ],
  "reopenWhen": "An Agent worker's return that states its result is recorded as prose, or a prose report's JSON example is refused as a claimed result."
}
```

## WO-255-D028 — The repair's reviewers run on Codex at the operator's Astra option

```json
{
  "id": "WO-255-D028",
  "date": "2026-11-05",
  "dispatch": "resume: fix; the operator's message during the repair: use gpt astra for review agents",
  "decision": "This repair's review ladder runs its workers on Codex at the operator's Astra option, gpt-6-astra at reasoning effort max, through npm run worker -- review --host codex --model astra, the helper route to a Codex reviewer from a Claude session, in place of the role text's default Claude dotln-worker. The ladder is the fix's: round 1 is three reviewers (criteria, design, consistency) over the whole change against the merge base, written under docs/control/local/reviews/WO-255/repair-2/, the second repair cycle (the failed first complete run, then this fix dispatch); round 2 is a fresh Astra worker for each reviewer whose findings were fixed, given its round-1 report with --recheck, since a Codex exec worker cannot be resumed from this session; round 3 runs only when round 2's fixes change code, as one combined Astra worker over the delta. At most seven of the cap's twenty uses, each counted by the hook from the literal helper command. The direction governs this repair's review workers; it writes no pin and changes no default.",
  "evidence": [
    "The operator's message in this session on 2026-11-05.",
    "codex --version: codex-cli 0.166.0; codex login status: Logged in using ChatGPT.",
    "npm run worker -- review --kind criteria --host codex --model astra --dry-run: report docs/control/local/reviews/WO-255/repair-2/round-1-criteria.md, base ccfba0df927ccc2e76558af701a1075fc0fa4b36 (the merge base with main), option astra selected by the model flag.",
    "docs/KIT.md §Reviews and product 07 §Model-specific notes: --model astra with --host codex selects gpt-6-astra at max."
  ],
  "rejected": [
    {
      "option": "Claude dotln-worker reviewers through the Agent tool, the role text's default",
      "reason": "The operator named Astra for the review agents."
    },
    {
      "option": "Read the message as a standing rule for every order's reviewers",
      "reason": "It names this work's review agents, and the order's non-goals exclude a standing pin of any pass's reviewers to one option."
    }
  ],
  "reopenWhen": "The Codex CLI refuses or cannot complete an Astra launch, or the operator names another option."
}
```

## WO-255-D029 — The repair's round 1 on Astra: seven distinct findings, six fixed and one recorded

```json
{
  "id": "WO-255-D029",
  "date": "2026-11-05",
  "dispatch": "resume: fix; round 1 of the repair's review ladder, three Astra workers (D028); the operator's question during the repair: why would i do fable and astra? what would that even do",
  "decision": "Round 1 over tree 5d8da5c4a8d49c21bccd63f1e6ffe4874f81c9bf against ccfba0df returned nine findings, seven distinct: the criteria adversary 4 (2 blocking; 0 h 9 min), the design improver 3 (0 h 10 min) and the consistency reviewer 2 (0 h 14 min). Six are fixed. (1) A fenced block is read as the worker's result only when it ends the return, either as all the text holds or carrying all five of the result's keys; the result's whole shape fenced where the report goes on after it, malformed or valid, is quoted material (criteria F1, design F2 and consistency F2, one defect: D027's fenced clause read any five-key fence as a claim, so a schemaVersion 2 example was refused and a valid one replaced the report with its own). (2) The omission of the operator's dispatch covers every string the record keeps from the worker's return: each finding's file and basis and each path read, beside the summary, recheck note, report and returned text; identifiers and closed words (severity, outcome) stay (criteria F2). (3) A Traced consumers row names the consumer it traced (criteria F3). (4) An Items row names its item, and a row acted on or reviewed names its location in the subject; a missing item needs none (criteria F4). (5) The omission keeps the words the brief's own report rules gave the worker, such as the Items table's header, even where a capture repeats them, and both routes judge the body that is written as well as the one returned, so a report the omission would break is refused saying so (design F3). (6) The planner's capture sentence and product 07 name --host codex|claude, which the helper requires (consistency F1; the role change is D030). Recorded, not fixed: design F1, that harnessWorkerWords reads a closing run of worker words with joining words, versions and punctuation in any letter case, while harnessPromptIntent admits at most two space-separated words (fable, fable 5.1, astra) before the line's end or a semicolon, so a line such as resume: next fable and astra selects workers and records no dispatch. The operator asked why anyone would name both options and what that would do: each opt-in changes only its own host's launches (fable this session's Claude-hosted reviewers, astra its Codex-hosted ones), so naming both matters only in a session that launches reviewers on both hosts, which is not how the operator works, and the forms the operator types, resume: next astra or resume: fix fable; with direction after the semicolon, dispatch and select alike. Unifying the two parsers would change the compiler and the eleven generated hooks that embed the intent parser for spellings nobody uses.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-2/round-1-criteria.md, round-1-design.md and round-1-consistency.md: each a codex-cli-exec 0.166.0 launch of gpt-6-astra at max named with --model, each checkout unchanged across its episode; the consistency report carries its Traced consumers table.",
    "scripts/lib/review-worker.mjs claimedResult (the fence that ends the text), omitDispatch (every retained string, the report rules' own words excepted), recordedReportRefusal (the body written), tracedConsumersRefusal (the consumer column) and itemsTable (the item and its location).",
    "scripts/test-review-worker.mjs, 25 of 25 under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs: the whole-shape example fenced before more of the report, malformed and valid, and a valid result fenced before a closing line stay prose; a consumer cell left empty or holding <path> is refused on both routes; an Items row with no location (empty, a dash, the brief's placeholder) or no item is refused on both routes, and a missing row with a dash stays admitted; a finding's basis, file and a path read that quote the dispatch keep none of its words in the JSON record or the Markdown report on both routes; a capture repeating the Items header leaves the recorded table whole on both routes, and a row quoting the dispatch across its cells is refused on both routes, naming the omission.",
    "A session-scratch mutation run, not retained: restoring each of the six earlier behaviors in turn fails the test written for it (pass 0, fail 1 each), and the file was restored byte for byte (SHA-256 compared).",
    "packages/compiler/src/harness.ts harnessPromptIntent and harnessWorkerWords (design F1's trace)."
  ],
  "rejected": [
    {
      "option": "Return the intent and the worker options from one parser (design F1's remedy)",
      "reason": "It changes the compiler's intent parser and the eleven generated hooks that embed it to admit spellings, both options at once among them, that the operator does not type; the single forms already agree."
    },
    {
      "option": "An explicit marker for an Agent worker's result (design F2's wider remedy)",
      "reason": "Every Agent worker would have to write it and every brief say so; the eight returns this order recorded carry their object unfenced on lines of its own, which the block rule reads, and the fence that ends the return keeps main's fenced result."
    },
    {
      "option": "Refuse every report whose table cells quote the dispatch",
      "reason": "A worker naming an item's location in the operator's words would be refused for doing what the brief asks; the omission keeps the cell filled, and only a quotation the omission would break the table on is refused."
    }
  ],
  "reopenWhen": "A dispatch line that names an opt-in records no dispatch, or a report this rule governs is refused or recorded against it."
}
```

## WO-255-D030

```json
{
  "id": "WO-255-D030",
  "date": "2026-11-05",
  "dispatch": "resume: fix; round 1's consistency F1",
  "decision": "The planner's capture sentence names the host the helper requires: A criteria review of the planning subject through `npm run worker -- review --kind criteria --host codex|claude --subject planning` carries the operator's dispatch capture with `--capture <file>`, and its report answers each item in an `## Items` table; product 07 §Paired passes and the synthesis pass names the same command. The four planner role files change at both economy settings and no other root, so wo255-repair-role-baseline.json pins the role trees over wo255-role-baseline.json, which stays byte-exact with every oracle before it, as WO-252's repair pinned its router sentence over its order's oracle. The planner's cold start grows 20 bytes, 30,142 to 30,162, over its 24,576 ceiling; the executor (44,358 against 40,194), verifier (38,638 against 35,221), reviewer (41,061 against 39,600), release-close (28,638 against 26,410) and router (17,124 against 16,384) are unchanged and stay over theirs, and the refuter has no ceiling. Each rule stays whole under product 07's one cold-start route: no ceiling raised and no acceptance recorded.",
  "evidence": [
    "scripts/lib/review-worker.mjs parseReviewArgs refuses a review without --host before it reads a capture (round 1's consistency F1).",
    "npm run sync: the role-oracle step refused to regenerate, naming the planner roots' changed digests and asking for a new linked role oracle with earlier snapshots byte-exact; authority evidence and the publication edition regenerated.",
    "A session-scratch reading of harnessInstallation() at both economy settings, not retained: only .claude/skills/dotln-planner/SKILL.md and .agents/skills/dotln-planner/SKILL.md change, on and off; the startup bytes, the shared instruction plus each root, are 44,358, 30,162, 27,560, 28,638, 41,061, 17,124 and 38,638 for the executor, planner, refuter, release-close, reviewer, router and verifier.",
    "docs/control/budgets.json limits and acceptances give the ceilings named above."
  ],
  "rejected": [
    {
      "option": "Re-pin wo255-role-baseline.json in place",
      "reason": "VER-001 judged the change against that oracle; the role-oracle step asks for a new linked oracle and keeps earlier snapshots byte-exact."
    },
    {
      "option": "Record consistency F1 and leave the sentence",
      "reason": "The helper refuses the sentence's command for its missing --host, so the installed guidance cannot be run as written."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-255's repair named --host codex|claude in the planner's capture sentence (20 bytes), leaving the planner at 30,162 bytes against its 24,576 ceiling and the executor (44,358 against 40,194), verifier (38,638 against 35,221), reviewer (41,061 against 39,600), release-close (28,638 against 26,410) and router (17,124 against 16,384) over theirs unchanged.",
  "reopenWhen": "The review helper's required flags change, or the planner's capture sentence no longer runs as written."
}
```

## WO-255-D031 — The repair's round 2 on Astra: four admitted findings fixed, the claim read by what an object is

```json
{
  "id": "WO-255-D031",
  "date": "2026-11-05",
  "dispatch": "resume: fix; round 2 of the repair's review ladder, three fresh Astra workers given their round-1 reports (D028)",
  "decision": "Round 2 over tree f851e812579a078a2ced8178d36bb203830c20f8 against ccfba0df rechecked round 1 and read the whole change again: the criteria adversary 3 new findings (2 blocking; 0 h 10 min), the design improver 1 (0 h 8 min) and the consistency reviewer none (0 h 10 min). Of round 1's fixes, criteria F2, F3 and F4, design F3 and consistency F1 and F2 held; criteria F1 and design F2, the fence rule, did not, and design F1 stays recorded (D029). Each new finding breaks an acceptance criterion or a behavior main had, so each is admitted and fixed. (1) Design F1 and criteria F1, one defect: the rule that a fenced result must end the return lost a valid fenced result followed by a closing sentence, which main's recorder bound, and still claimed the result's whole shape fenced at a report's end as a labelled negative-control example, which criterion 3 keeps as prose. Fence position cannot tell the two apart, so the record command now reads what an object is as well as where it stands: an object that is this round's valid change review result is the worker's claim wherever it stands, fenced, printed over lines of its own or inside a sentence; an object that is not is a claim, and refused, only as the whole text, as a fenced block that is all the text holds, or as an unfenced block of its own carrying the result's keys and no other; any other object carrying the result's keys is quoted material, and a prose record that quotes any prints an advisory counting them, since a malformed return fenced among the worker's prose reads as one of them. This replaces D027's fenced clause and D029's item (1). (2) Criteria F2: the generated Codex prompt hook returned before journaling a dispatch line's worker selection when the checkout held no docs/control/local/harness lane, so a fresh checkout's first planning: standard pass, astra launched Sol; the hook now makes the lane for a line that carries a selection, one level at a time inside the checkout and never through a link, and an ordinary message still makes nothing. (3) Criteria F3: the Traced consumers and Items validators read each required column from a header cell of its own, refusing a cell that names two columns or a column two cells name, so a Command result header cannot stand for both and leave the real Command cells unread. Boundaries: the result's whole shape quoted as a valid example reads as the worker's result, as main read any lone object, and the report kept is the body that meets the report rules; a malformed return fenced among prose is recorded as prose, with the advisory.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-2/round-2-criteria.md, round-2-design.md and round-2-consistency.md: codex-cli-exec 0.166.0 launches of gpt-6-astra at max, checkouts unchanged; the consistency report carries its Traced consumers table.",
    "scripts/lib/review-worker.mjs readReturn, fencedBlocks and headerColumns, and recordAgentReview's validity test and advisory; packages/compiler/src/codex-continuation.mjs lane({ create }) and the prompt branch's order.",
    "scripts/test-review-worker.mjs, 25 of 25 under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs: nine examples (the verification's two, the result's keys fenced, in code spans and in a sentence, a foreign key on its own line, the whole malformed shape fenced mid-report, at a report's end after a negative-control introduction and after one line) record as prose with the advisory's count; a valid result fenced before a closing sentence, printed over its own lines, inside a sentence and in the closing fence is bound with F1 and F2; the valid whole shape quoted as an example is bound and the report kept is the worker's prose; a malformed fence that is all the text and a malformed block before prose are refused; a Command result header and an Item location header are refused on both routes.",
    "scripts/test-codex-continuation.mjs 'WO-255 a checkout's first Codex dispatch line makes its journal lane ...', 14 of 14 under node scripts/harness.mjs bounded -- node --test scripts/test-codex-continuation.mjs: with no local lane an ordinary message makes none, planning: standard pass, astra makes it and journals {codex: astra}, and a local lane that is a link to another directory gets nothing written there.",
    "A session-scratch mutation run, not retained: restoring each earlier behavior (the shared column in either table, the position-only claim, the hook's lane without creation) fails the test written for it (pass 0, fail 1 each), each file restored byte for byte (SHA-256 compared)."
  ],
  "rejected": [
    {
      "option": "An explicit marker or recording format for an Agent worker's result (design F1's remedy)",
      "reason": "Every Agent worker and brief would have to carry it, and main bound unmarked results; reading validity keeps main's results and the eight returns this order recorded while letting a malformed example stay prose."
    },
    {
      "option": "Keep the fence-position rule and refuse terminal examples",
      "reason": "It breaks main's fenced result with prose after it and refuses a labelled example criterion 3 keeps, the two cases round 2 named."
    },
    {
      "option": "Refuse a prose record that quotes any object carrying the result's keys",
      "reason": "It refuses the example-bearing reports criterion 3 records; the advisory makes a lost malformed return visible instead."
    },
    {
      "option": "Make the Codex journal lane for every prompt",
      "reason": "Only a dispatch line has a selection to keep; an ordinary message in a checkout with no journal needs no lane."
    }
  ],
  "reopenWhen": "A worker's valid return is recorded as prose, a labelled malformed example is refused, a first Codex dispatch line's selection is not journaled, or a report table's required cell goes unread."
}
```

## WO-255-D032 — The repair's round 3 on Astra and the end of its ladder: a quoted result stays an example

```json
{
  "id": "WO-255-D032",
  "date": "2026-11-05",
  "dispatch": "resume: fix; round 3 of the repair's review ladder, one combined Astra worker over the delta since round 2's tree (D028)",
  "decision": "Round 3 over the delta f851e812579a078a2ced8178d36bb203830c20f8 to ac775bd8a0e4ff55ea8cf1ee92bb6beb243190db (0 h 11 min) held round 2's criteria F2 (the Codex lane) and F3 (the header columns) and found one admitted defect (blocking; criterion 3): reading an object as the worker's result because it validates, wherever it stands, adopted a valid example quoted mid-report, its sample findings recorded as the review's own while the report said it found nothing else; round 2's criteria F1 and design F1 rechecks pointed at the same remainder. Fixed: the record command reads a worker's return only where a report quotes nothing, as the whole text, a fenced block that is all the text holds, an unfenced object on lines of its own carrying the result's keys and no other, or the round's valid result filling the fenced block that ends the reply; every other object carrying the result's keys, valid or not, in a sentence, a code span or a fence the report goes on after, is a quoted example, counted in an advisory that names where a return goes. This replaces D031's item (1). The rounds asked for two things no rule over a text's shape can give at once: a valid result fenced with more prose after it bound as the return (round 2, from main's recorder) and a valid example fenced with more prose after it kept as prose (round 3, criterion 3); the two texts differ only in their words. Criterion 3, the order's contract, keeps the example, and main's lone-object extraction was the mechanism of VER-001 F2, so two shapes main bound as results are recorded as prose with the advisory: a valid result fenced before more prose and a valid result inside a sentence. Recorded, not fixed. The returns this order recorded, prose then the object unfenced on its own lines at the end, and the shape of a preface then the result in a closing fence stay claims. No reviewer runs after round 3: the executor judged the remaining delta, readReturn's claim condition, the advisory's words, the record route's comment, the claim fixture and the documents, by the review-worker suite, a mutation run and the rule read against VER-001's controls and the eight recorded returns.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-2/round-3-combined.md: a codex-cli-exec 0.166.0 launch of gpt-6-astra at max named with --model, checkout unchanged, carrying all three briefs and its Traced consumers table.",
    "scripts/lib/review-worker.mjs readReturn (the closing fence's validity test only) and recordAgentReview's advisory.",
    "scripts/test-review-worker.mjs 'record reads as the worker's return the whole text, a fence that is all the text, an object on lines of its own outside a fence or a valid result in the fence that ends the reply ...', 25 of 25 under node scripts/harness.mjs bounded -- node scripts/test-review-worker.mjs: thirteen texts record as prose with the advisory's count, among them the valid whole shape quoted with no findings and with two, the malformed shape at a report's end, a valid result fenced before more prose and one inside a sentence; a result printed over its own lines between prose and a valid result in the closing fence are bound with F1 and F2; a malformed fence that is all the text and a malformed block before prose are refused.",
    "A session-scratch mutation run, not retained: restoring round 2's validity-anywhere claim fails that test (pass 0, fail 1), the file restored byte for byte (SHA-256 compared).",
    "A session-scratch reading, not retained, through a deleted copy of the helper exporting readReturn: the eight returns this order's earlier ladders recorded are each claimed, valid, with the finding count their record holds and nothing counted as quoted."
  ],
  "rejected": [
    {
      "option": "Keep reading a valid object as the result wherever it stands",
      "reason": "It records a quoted example's findings as the review's own, which criterion 3 and VER-001 F2 forbid."
    },
    {
      "option": "Tell a quoted result from a returned one by the words around it, such as example or my review",
      "reason": "Words are no boundary a recorder can hold to; the round's reviewers each built a counterexample from the words."
    },
    {
      "option": "Require an explicit marker or a separate result file for every Agent return",
      "reason": "Every Agent worker and brief would have to carry it, and the returns this order recorded, unmarked, would stop being read; the shapes kept here read them."
    }
  ],
  "reopenWhen": "A worker's return stated in one of the four shapes is recorded as prose, a quoted example's findings are recorded as the review's own, or a return in another shape is lost where the advisory went unread."
}
```

## WO-255-D033 — A home path in the verifier's retained gate record is written as the worktree placeholder

```json
{
  "id": "WO-255-D033",
  "date": "2026-11-05",
  "dispatch": "resume: fix; the repair's document gate",
  "decision": "The repair's first npm run test:docs failed docs-check on one line of the verifier's retained gate record, docs/evidence/WO-255/verifier-001/document-gate.json line 130: the absolute home path of this worktree's .runtime/build-t2l1IT in a record, which docs-check refuses for any line it holds no fingerprint of. The verifier wrote the record after its own document gate ran, so that gate never read it. The line now names the directory by the placeholder the check asks for, <worktree>/.runtime/build-t2l1IT; nothing else in the record or in VER-001 changes, and no digest pins the record's bytes. The document gate runs again on the corrected tree.",
  "evidence": [
    "The document gate recorded 2026-11-05T21:59:29.588Z: exit 1, docs-check its first failure and 16 suites unrun behind it; docs-check's output: FAIL docs/evidence/WO-255/verifier-001/document-gate.json:130: absolute home path in a record; write a repository-relative path or a placeholder such as <home>/ or <worktree>/, with 1 failure in all.",
    "scripts/docs-check.mjs homePathFindings: a line holding a private path passes only by its fingerprint in docs/control/doc-baseline.json; a new or edited one fails.",
    "docs/evidence/WO-255/verifier-001/handoff-read.json names document-gate.json and pins the report's SHA-256, not this record's; no other committed file names it."
  ],
  "rejected": [
    {
      "option": "Add the line's fingerprint to docs/control/doc-baseline.json",
      "reason": "The baseline keeps private-path lines that predate the rule; a new one is what the rule refuses, and this path names the operator's account."
    },
    {
      "option": "Leave the record as written",
      "reason": "Completion consumes a passing document row for the candidate tree, and the record would publish the home path when the order merges."
    }
  ],
  "reopenWhen": "A gate record retained after its gate again holds a private path, which would make the retention, not each later reader, the place to write paths relative."
}
```

## WO-255-D034 — Re-verification tests the repaired behavior and keeps the subject intact

```json
{
  "id": "WO-255-D034",
  "date": "2026-11-05",
  "dispatch": "resume: verify; re-verification after repair-complete, allocated VER-002",
  "decision": "Judge the original eight criteria, reproduce VER-001's repaired cases and vary the parser contexts the repair fixtures hold constant. Consume the intact complete review row at current code identity a4a5b761e437bc1dd2468f81eacbfba0a478b925f88e797c3457c35eab71baa0 instead of paying the unchanged complete run again. The NoOp of accepting the green suite is rejected: its terminal-example control is malformed, and its inline-code controls put the JSON on the same line as the delimiters. The traps are treating fixture coverage as exhaustive (use independent text contexts), treating an implementation's documented restriction as an amended criterion (judge the original order), and changing the implementation under judgment (write only the allocated report, evidence and required generated projections). The current actor is Codex CLI 0.166.0, gpt-6-astra at max, from session readback; the order's xhigh recommendation is not the actual selection. No worker is needed or launched, zero uses of twenty; the optional USD 5 cap is unenforced because the transport exposes no hard dollar-cap control.",
  "evidence": [
    "docs/evidence/WO-255/verifier-002/observations.json: 30 checks, 26 positive controls hold and four failed expectations reproduce three defects.",
    "docs/evidence/WO-255/verifier-002/gate-evidence.json: current code identity, intact passing complete review row, 44 required suites, none missing.",
    "docs/evidence/WO-255/verifier-002/process.md: truncated-read corrections, the old probe sequencing failure and its isolated replacement, and correction of the guessed lifecycle paths."
  ],
  "rejected": [
    {
      "option": "Run another complete product gate before judging the reproduced failures",
      "reason": "The implementation identity already has a passing complete row; the independent parser inputs establish failures that the suite does not cover."
    }
  ],
  "reopenWhen": "The code identity changes, a reproduction fails to reproduce, or the operator changes verification scope."
}
```

## WO-255-D035 — A terminal example still supplies findings that the prose review did not make

```json
{
  "id": "WO-255-D035",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-002 F1, criterion 3",
  "decision": "Fail criterion 3. A prose consistency review with its complete Traced consumers table says it found no issues and ends with an explicitly introduced example of a valid review record carrying sample finding F1. recordAgentReview accepts it as structured and adopts sample F1. The same example in the middle of the report stays prose. readReturn's closing-fence rule uses terminal position and schema validity as the claim boundary; neither distinguishes this supported prose example from a returned result. This reproduces D032's reopening condition that a quoted example's findings become the review's own. The exact VER-001 examples now pass; their repair does not discharge the broader preservation requirement.",
  "evidence": [
    "docs/evidence/WO-255/verifier-002/probes.mjs and observations.json: valid example at end versus valid example in middle.",
    "scripts/lib/review-worker.mjs readReturn closing condition and recordAgentReview; scripts/test-review-worker.mjs example-at-the-end uses schemaVersion 2, while example-with-findings has trailing prose.",
    "docs/evidence/WO-255/decisions.md WO-255-D032; docs/control/local/reviews/WO-255/repair-2/round-3-combined.md F1."
  ],
  "rejected": [
    {
      "option": "Treat the documented terminal-fence rule as permission to adopt example findings",
      "reason": "The original criterion promises to preserve prose holding JSON examples and grants no exception for their position; an implementation decision is not an operator waiver."
    }
  ],
  "followup": "Repair WO-255 VER-002 F1 in scripts/lib/review-worker.mjs and its tests: a prose report's explicitly quoted valid terminal example must remain prose with no adopted sample findings. Add nonempty terminal and nonterminal examples beside valid and malformed actual-return controls. Use an unambiguous structured/prose input distinction rather than terminal position or schema validity alone. Reproduction: docs/evidence/WO-255/verifier-002/probes.mjs.",
  "reopenWhen": "The return/prose discriminator changes; rerun terminal and nonterminal examples with nonempty findings."
}
```

## WO-255-D036 — Multiline code-span examples are read as result blocks and refused

```json
{
  "id": "WO-255-D036",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-002 F2, criterion 3",
  "decision": "Fail criterion 3 on a second supported example context. A prose consistency report introduces a JSON example in a code span whose opening and closing backticks are on separate lines, and carries the required Traced consumers table. The example {\"schemaVersion\":1,\"findings\":[]} is refused with invalid-result: change review result shape. Both one-backtick and two-backtick delimiters reproduce it; the same-line code-span control records unchanged. readReturn excludes fenced blocks when testing a standalone JSON line but tracks no enclosing multiline code span, so it treats the example as a claimed malformed result. The order does not restrict example line wrapping, and the repair's own D027 says a code-span example remains quoted.",
  "evidence": [
    "docs/evidence/WO-255/verifier-002/probes.mjs and observations.json: single-line code span, multiline code span and multiline double-backtick code span.",
    "scripts/lib/review-worker.mjs fencedBlocks and readReturn block condition; docs/evidence/WO-255/decisions.md WO-255-D027."
  ],
  "rejected": [
    {
      "option": "Require prose authors to place every code-span example on one line",
      "reason": "Neither criterion 3 nor the documented report vocabulary imposes that requirement; it narrows the promised example preservation to the fixture spelling."
    }
  ],
  "followup": "Repair WO-255 VER-002 F2 in scripts/lib/review-worker.mjs and its tests: recognize examples inside code spans across line boundaries before considering a JSON line an unfenced result block. Preserve one- and two-backtick multiline examples while keeping actual malformed standalone returns refused. Reproduction: docs/evidence/WO-255/verifier-002/probes.mjs.",
  "reopenWhen": "Code context or claim parsing changes; rerun multiline and same-line examples plus genuine block controls."
}
```

## WO-255-D037 — A genuine fenced result with trailing prose regresses from the activation base

```json
{
  "id": "WO-255-D037",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-002 F3, reproduced regression",
  "decision": "Block the reproduced regression separately from the two criterion-3 failures. The activation-base recorder accepts a genuine valid consistency result in a JSON fence followed by That is all., retaining its actual finding F1 and the Traced consumers table in its report field. The current recorder treats the same text as prose and refuses it for lacking a table, because the actual table is encoded inside the report field. The base-to-current comparison executes both recorders against isolated synthetic repositories. The base source is unchanged apart from resolving relative imports at its original location, sharing current helper modules and the unchanged result validator. D032 records that genuine fenced results followed by prose lose their structured meaning, but there is no operator waiver or off-ramp authorizing this regression. This is the compatibility defect earlier repair reviews already named.",
  "evidence": [
    "docs/evidence/WO-255/verifier-002/probes.mjs and observations.json: base genuine result with trailing prose and current genuine result with trailing prose.",
    "scripts/lib/review-worker.mjs at activation base ccfba0df927ccc2e76558af701a1075fc0fa4b36 recordAgentReview extracts and validates the result among prose; current readReturn only claims the closing fence.",
    "docs/control/local/reviews/WO-255/repair-2/round-2-design.md F1; docs/evidence/WO-255/decisions.md WO-255-D032; canonical status has no waiver or defect record."
  ],
  "rejected": [
    {
      "option": "Accept loss of the earlier supported return as the necessary price of preserving examples",
      "reason": "The earlier behavior is executable and the current rule still adopts terminal examples. A documented trade does not waive the regression; an explicit input distinction can separate intent."
    }
  ],
  "followup": "Repair WO-255 VER-002 F3 in scripts/lib/review-worker.mjs and its tests: preserve genuine structured results with trailing prose, including their findings and report-field table, while keeping quoted examples as prose. Retain the activation-base/current comparison and make the caller's structured-versus-prose intent unambiguous. Reproduction: docs/evidence/WO-255/verifier-002/probes.mjs.",
  "reopenWhen": "The recording format or legacy-return handling changes; rerun both base-compatible genuine returns and example controls."
}
```

## WO-255-D038 — The recorder declares whether mixed text is prose or a JSON result

```json
{
  "id": "WO-255-D038",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair requested after VER-002 F1, F2 and F3",
  "decision": "Replace positional intent inference with the recorder's explicit --format prose|json. Prose preserves the entire report and adopts no example findings, even when an example is a valid nonempty result at the end. JSON selects exactly one result object and validates it, retaining genuine fenced or unfenced returns with trailing prose and their report-field tables. A missing, multiple or malformed result is refused before a report is written. The record names inputFormat. With no flag, whole JSON and whole fenced JSON retain their existing validation; prose without a possible embedded result remains prose, including matched one- or multiple-backtick spans across line boundaries. Mixed text with a possible result outside a code span now requires the explicit format, with an actionable refusal. This deliberately changes ambiguous no-flag calls: their same bytes remain supported with the format that states their intent. No sample findings are silently adopted and no genuine findings are silently dropped. The helper's provider route already has a structured protocol and is unchanged. The instructions live in RECORD_USAGE, the kit guide and product 07; the role's existing optional command example still applies to whole JSON and ordinary prose and needs no generated-root change.",
  "evidence": [
    "VER-002 and D035-D037 ask for an explicit structured/prose input distinction. Its terminal-example and genuine-result inputs can both be valid fenced results surrounded by ordinary prose; no syntax or schema predicate can establish which is intended.",
    "scripts/lib/review-worker.mjs readReturn previously selected a valid result in a terminal fence and excluded only fenced blocks when considering standalone JSON lines. recordAgentReview applied the same selection before table validation, causing all three reported failures.",
    "scripts/test-review-worker.mjs retains the previous example contexts with declared prose, adds nonempty terminal examples both with and without a report-field table and an unfenced terminal example, tests genuine trailing and inline results with declared JSON, and checks no-flag ambiguity refuses before creating a reviews lane. Multiline span cases include one and two backticks, an inner run of another length and CRLF. Invalid, multiple and syntactically broken returns remain negative controls.",
    "The first bounded review-worker run passed 25 of 26 tests and exposed one capture-redaction fixture using mixed structured text without a format; that caller now declares JSON. No production caller of recordAgentReview exists outside the command dispatcher; the other calls are its fixture consumers, located with rg.",
    "The repair changes scripts/lib/review-worker.mjs, its tests, docs/KIT.md and product 07's recorder passage. The pre-existing branch changes and immutable verification reports remain preserved. New inputs are VER-002's independent cases and the additional framing, multiplicity and malformed-syntax controls above. The original probe's no-flag expectations remain historical failure evidence; updated-format checks must say what invocation they exercise."
  ],
  "rejected": [
    {
      "option": "NoOp or another rule based on fence position, schema validity or English example introductions",
      "reason": "The existing repairs alternated between adopting examples and losing genuine returns. F1 and F3 require opposite interpretations of the same syntactic shape. Guessing intent would preserve that failure class."
    },
    {
      "option": "Keep implicit extraction for ambiguous no-flag calls and rely on callers to opt into prose",
      "reason": "An omitted flag would still silently record sample findings as the review's own. Requiring the choice before writing prevents that error."
    },
    {
      "option": "Default every mixed input to prose",
      "reason": "That would silently discard real findings and retain the compatibility failure D037 names. The same genuine result is supported explicitly instead."
    }
  ],
  "reopenWhen": "A declared prose report adopts an example or is changed by JSON parsing, a declared genuine JSON return loses its findings or report table, or an undeclared mixed input is silently classified. Reassess the compatibility interface if a caller cannot supply the format."
}
```

## WO-255-D039 — Repair validation and the unchanged release assignment

```json
{
  "id": "WO-255-D039",
  "date": "2026-11-05",
  "dispatch": "resume: fix; bounded evidence before the repair's independent reviews",
  "decision": "Carry D038 through the full review-worker fixtures and the verifier's independent input corpus before starting the review ladder. The review-worker suite passes 26 of 26 tests. repair-003/probes.mjs reuses VER-002's exact input bytes and expected findings, declares formats on seven mixed calls, and keeps the activation-base recorder, whole JSON and code-span no-flag controls unchanged; all 30 checks pass in repair-003/observations.json. It is not a claim that the historical no-flag mixed calls still succeed. The first adapter run failed before fixtures because a data-URL module cannot resolve an absolute-path import as a file URL; the adapter now makes the three original absolute imports explicit file URLs, and the next run passes. Preserve the original verification and its observations. Allocate D035-D037's follow-ups to this repair. The source change is machinery in scripts/lib/review-worker.mjs; no package source, dependency or installed role text changes in this repair, so D014's component versions and the existing minor application target v0.118.0 stand. release prepare --local confirms the target is current. Main and the worktree merge base are both the activation base ccfba0df, so integration is not due at this point.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test scripts/test-review-worker.mjs: 26 passed, 0 failed, after the first run's 25 passes and one mixed capture-fixture refusal was corrected by declaring JSON.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-255/repair-003/probes.mjs: 30 checks, 0 failures. The adapter records its seven inputModes, preserves the base/current genuine-result comparison and changes no immutable probe bytes.",
    "npm run release -- prepare --local: WO-255 target v0.118.0 remains current. Package manifests retain compiler 0.41.0, skeleton 0.85.0 and console 0.5.0 with existing dependency pins and publication refusals.",
    "git rev-parse main and git merge-base main HEAD both resolve to ccfba0df927ccc2e76558af701a1075fc0fa4b36. No source or report from another worktree is changed. A Git diff against a checkpoint omits current untracked files; review snapshots use workingTree through the canonical helper so those files are included.",
    "The follow-up request allocates FUP-caec4c27b1b8d84c, FUP-89d75a1c3a0d0e5c and FUP-c249afff3b1a6f1d to WO-255 against the current register revision. The adjacent-work queue contains no separate diagnosed item."
  ],
  "rejected": [
    {
      "option": "Reuse the earlier passing complete row for the repaired parser",
      "reason": "The parser source changes code identity. This repair owes its own reviews and complete run."
    },
    {
      "option": "Rewrite the verifier's old probe to make its no-flag expectations pass",
      "reason": "The filed verification is immutable evidence. The adapter makes the new caller intent visible while retaining the old inputs and outcomes."
    }
  ],
  "reopenWhen": "Review changes the parsing contract, another source changes, a gate fails, or main moves before the complete handoff run."
}
```

## WO-255-D040 — Markdown context determines spans and report sections

```json
{
  "id": "WO-255-D040",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair 3 round-1 criteria F1 and F2",
  "decision": "Fix both blocking findings before round 2. The rule is that only a Markdown inline-code node exempts a possible JSON result from auto-mode ambiguity refusal, and only an actual root report heading followed by a pipe table supplies a required section. Reuse parseMarkdown and markdownNodes from scripts/lib/markdown-links.mjs, backed by the already-pinned Prettier parser, for block and inline context. This closes cross-paragraph, heading, list and blockquote misclassification without another partial Markdown grammar or a new dependency. Root fenced-return recognition also uses the parsed code nodes; explicit prose and JSON retain D038's distinction. Required-section checking applies to both recorder and provider routes. The traps are stopping at the two quoted inputs, interpreting example text as report evidence, and adding an undeclared fixture dependency; varied block controls and the existing shared parser address each. NoOp would retain two reproduced failures, so is rejected.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-3/round-1-criteria.md: F1 reproduces silent loss of real F1 between backticks in separate paragraphs and inside a blockquote fence; F2 records example-only Traced consumers and Items tables. The reviewer compared the two F1 inputs with the activation-base recorder, which retained the finding.",
    "scripts/lib/review-worker.mjs tableUnder, fencedBlocks and codeSpans now consume the shared Markdown AST. A bounded source-shape probe confirmed table nodes and source offsets from the pinned parser; scripts/lib/plan-continuation.mjs and document-kinds.mjs already use this parser for context-sensitive source reading.",
    "scripts/test-review-worker.mjs adds cross-paragraph, blockquote-fence, list-fence, heading, setext and separate-list-item controls: auto requires a format while explicit JSON retains the real findings. It retains valid same-line and multiline one-/two-backtick examples. Both routes reject example-only required tables in backtick, tilde, nested-marker, list, blockquote, HTML-comment, preformatted and indented-code contexts, and record the same text followed by an actual report table.",
    "Before the setext, separate-list-item and blockquote-table additions, the three focused tests passed under node scripts/harness.mjs bounded -- node --test --test-name-pattern 'record separates prose|record recognizes multiline|required report tables' scripts/test-review-worker.mjs. Final fixture and gate outcomes are recorded below and in the handoff.",
    "scripts/test-runner.mjs already declares scripts/lib/markdown-links.mjs for plan-refutation. The launchpad fixture copies the scripts tree and links existing third-party packages, including Prettier; no manifest, lockfile or generated role changes are needed for this repair."
  ],
  "rejected": [
    {
      "option": "Extend the hand-written scanner with each newly found block delimiter",
      "reason": "The first draft reproduced the reported boundaries but duplicated Markdown context rules. The repository already has the parser that owns those boundaries, with existing dependency and export coverage."
    },
    {
      "option": "Read every matched backtick pair as code or every heading-looking line as a report section",
      "reason": "Round 1 demonstrated that both shortcuts discard actual findings or admit reports that supplied only examples."
    }
  ],
  "reopenWhen": "The pinned Markdown parser changes, a genuine result is silently hidden by a non-code span, or an example-only table satisfies either required report section."
}
```

## WO-255-D041 — Keep the two design notes as a bounded follow-up

```json
{
  "id": "WO-255-D041",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair 3 round-1 design F1 and F2",
  "decision": "Record both nonblocking maintenance suggestions and keep this repair focused on the reproduced format and section defects. A pure decoder returning explicit prose/structured variants would separate decoding from filesystem orchestration; a compiled capture matcher would avoid rebuilding protocol exemptions and capture indexes for each candidate and retained field. Neither review identifies incorrect behavior or measures a performance defect. D040 reuses an existing parser but does not claim to deliver these two suggested interface changes. The consistency review has no findings.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-3/round-1-design.md F1: readReturn returns an undefined sentinel or value/offsets, leaving structured state and prose reconstruction in recordAgentReview.",
    "The same report F2: omitDispatch rebuilds protocol exemptions and capture indexes for candidate bodies and final retained fields; no timing measurement was made.",
    "docs/control/local/reviews/WO-255/repair-3/round-1-consistency.md: zero findings with the required Traced consumers table and declared unsearched boundaries."
  ],
  "rejected": [
    {
      "option": "Refactor decoder and capture matching interfaces during this repair",
      "reason": "The blocking findings concern Markdown context. Expanding both interfaces adds change without evidence that it is needed to restore the required behavior."
    }
  ],
  "followup": "Evaluate a pure prose/structured decoder interface and a capture matcher compiled once per capture set in scripts/lib/review-worker.mjs; preserve current format, refusal, capture omission and retained-body behavior. Begin when the decoder or omission path next needs substantial maintenance, or measurement shows repeated matcher construction matters; use the existing route fixtures plus direct pure-function checks if extracted.",
  "reopenWhen": "A further format change makes orchestration obscure decoding correctness, or measured capture-matching cost warrants the separate interface."
}
```

## WO-255-D042 — Every embedded possible result requires declared intent

```json
{
  "id": "WO-255-D042",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair 3 round-2 criteria F1",
  "decision": "Admit and fix the recheck's reproduced regression. Remove the code-span exemption entirely: auto mode refuses every embedded possible result and names --format prose and --format json, regardless of Markdown context. Whole JSON and a whole root fence retain their structured interpretation; text without a possible result remains prose. Explicit prose preserves examples, including multiline spans, and explicit JSON preserves real findings in those same spans. This supersedes D038's and D040's auto-mode span exception. The same bytes can be a valid example or an actual result, even in a correctly parsed code span, so declaring prose because of that context repeats the original intent error. The AST remains responsible for actual report sections and whole root fences; no custom span scanner remains. The NoOp and a shape/validity exception for selected span objects are rejected because neither gives the caller's intent. The compatibility cost is now uniform: all mixed result-shaped text requires the format. No claim is made that these original no-flag calls still succeed.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-3/round-2-criteria.md, tree afc22527b8d7b4ec8041c514bd449098d5d91615: both round-1 fixes held in seven independent expectations; a new named bounded test compared same-line and multiline genuine span returns at base and current, retaining F1 at base and with current explicit JSON but losing it in current auto mode.",
    "scripts/lib/review-worker.mjs removes codeSpans and the claim-suppression branch. scripts/test-review-worker.mjs adds real same-line, multiline and double-backtick result controls with auto refusal, explicit JSON finding retention and explicit prose preservation. Abbreviated example-span controls now declare prose and also assert auto refusal.",
    "docs/evidence/WO-255/repair-003/probes-final.mjs adapts VER-002's unchanged input bytes and expected findings with ten explicit calls, adding its three span examples to the earlier seven declarations. probes.mjs and observations.json remain historical evidence of D038; the activation-base and whole-result controls retain their original no-flag calls.",
    "Before this round-2 change, the entire 27-test review-worker suite and the 30 adapted verifier checks passed. They did not cover genuine span returns. This repair's final bounded outcomes and complete run are recorded in the handoff.",
    "Operational corrections: a publication check run before sync finished found a stale software-engineer source lock; after sync completed, the check passed for all 256 headings and both editions. The first D041 disposition request omitted required targets and was refused before writing; scripts/lib/planning-followups.mjs's exact request shape was read, targets:[] was added, and FUP-e4417f76298b1d02 was successfully deferred. An unquoted optional-file glob matched nothing under zsh; the read was replaced with rg --files, with no repository mutation."
  ],
  "rejected": [
    {
      "option": "Treat a correctly parsed code span as proof that the object is an example",
      "reason": "The recheck supplies base-supported genuine results in exactly that context. Correct syntax recognition cannot decide intent."
    },
    {
      "option": "Exempt abbreviated or schema-invalid span objects but require a format for valid full results",
      "reason": "That reintroduces a shape/validity heuristic and complicates the rule. An explicit format supports both real returns and examples without adopting or discarding their findings."
    }
  ],
  "reopenWhen": "A parseable embedded possible result is silently adopted or discarded without a format, or either declared route changes the intended findings or report body."
}
```

## WO-255-D043 — The repair's ladder ends with independent confirmation

```json
{
  "id": "WO-255-D043",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair 3 review ladder completed before the complete run",
  "decision": "Close this repair's three-round ladder and proceed to its own complete run. Round 1 found two blocking criteria defects and two design notes; D040 fixed the defects and D041 deferred the notes. The criteria recheck held both fixes and found one further genuine-span regression; D042 fixed it. Round 3's fresh combined reviewer over afc22527b8d7b4ec8041c514bd449098d5d91615 to 399ad78dbd5b6612d9d99b7163881b21cd7de083 held that fix and reported no new finding. No code changed after round 3. Four fresh launches and one re-task ran at the default Codex Sol/max option; one coordinating message is conservatively charged as an additional use, six of twenty. Native spawn accounting exposes zero counted uses and an unknown remainder, so the explicit count is retained. Per-review durations and token counters are unavailable in the recorded Agent results and are not inferred from later completion observations. The complete gate and final document gate still judge this repair before completion; earlier passing code identities are historical evidence only.",
  "evidence": [
    "docs/control/local/reviews/WO-255/repair-3/round-1-criteria.md, round-1-design.md, round-1-consistency.md, round-2-criteria.md and round-3-combined.md; each record binds the reviewed tree and recorder-attested model/effort, without claiming effective host readback.",
    "The executor's full bounded review-worker suite passes all 27 tests after D042. repair-003/probes-final.mjs passes all 30 unchanged verifier expectations with ten declared input formats; observations-final.json retains the outcomes.",
    "The combined reviewer independently ran three changed named repository tests, a genuine-span intent matrix and the final verifier adapter replay; all passed. It verified the ten delta surfaces against the recorded tree, the original corpus and earlier evidence unchanged, and the declared fixture/export closure. Its initial span probe expected a trimmed structured report field; source and the existing fixture showed exact field-byte preservation, so only that temporary assertion was corrected.",
    "The combined Traced consumers table names generated pages, fixture manifests, tests and their commands. Publication checks cover all 256 headings, 45 software-engineer and 29 everyday-user source sections; harness check covers 43 surfaces; metadata and diff whitespace checks pass.",
    "Before the complete run, local main and the worktree merge base still name ccfba0df927ccc2e76558af701a1075fc0fa4b36; no integration is due. The release assignment remains v0.118.0. The pre-run material inventory finds no nested repository requiring removal."
  ],
  "rejected": [
    {
      "option": "Run another reviewer or reuse the old passing complete row",
      "reason": "The ladder has ended, and this repair changed code identity. Its own complete run, then the document gate and repair-complete event, are the remaining obligations."
    }
  ],
  "reopenWhen": "The complete run fails, main moves at a named integration point, or independent re-verification establishes another unmet criterion."
}
```

## WO-255-D044 — The repaired code passes its complete run

```json
{
  "id": "WO-255-D044",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair 3 complete validation and handoff preparation",
  "decision": "Consume this repair's passing complete review run, then run the final document gate and record repair-complete. No further review or code change follows the passing run. All three newly admitted review findings are fixed; the two design notes remain deferred under D041. The explicit format cost remains intentional and documented: every mixed possible result requires the caller's prose/JSON choice. The observed outcome matches the repair's aim on the declared routes, without treating a green suite as exhaustive proof; independent re-verification remains the next phase.",
  "evidence": [
    "repair-003/complete-gate.json retains the bounded summary of npm test -- --review: exit 0, 44 of 44 suites, 118 fresh tasks, no reused tasks or unrun suites; started 2026-11-05T23:14:37.902Z and recorded 2026-11-06T00:01:19.355Z, 0 h 47 min (2801453 ms). Code identity 39bd5b475ad3c259f473ca94796fb86df2ddddac8620f501dbf4a26b8c006c97 and build outputs stayed unchanged. A post-run gateCodeIdentity read matches it.",
    "The gate's shared-ref observations match at start and end. Cleanup removed 2316 temporary roots, retained one under its owning protocol, and reported zero blockers. The run reported one unavailable monitor signal, original-parent unique identity, while the other signals stayed active; that advisory is retained as a limit, not a failed suite.",
    "Both the complete process and node scripts/harness.mjs evidence --wait exited 0. No repository file was written and no agent started while the complete gate ran. The final document gate is recorded in the handoff before the completion event consumes it.",
    "Process corrections: an interim commentary called runner checks in progress before their start entry; the log was checked and the statement corrected to queued. The first draft of the bounded gate summary copied the cleanup arrays rather than their counts; those arrays also held temporary and home paths. The derivative was narrowed to counts before document validation, with the canonical gate row and ignored source receipt untouched. The retained summary is 6710 bytes and contains neither home nor temporary-directory paths."
  ],
  "rejected": [
    {
      "option": "Repeat the complete gate after handoff-only edits",
      "reason": "The passing row binds the current code identity. The final document gate binds authored records, and completion consumes both without running another product gate."
    }
  ],
  "reopenWhen": "The document gate fails, the code identity changes, or re-verification establishes another failure against the original order."
}
```

## WO-255-D045 — The third verification re-derives criteria 3 and 4 against explicit formats and passes

```json
{
  "id": "WO-255-D045",
  "date": "2026-11-05",
  "dispatch": "resume: verify; re-verification after repair-complete, allocated VER-003",
  "decision": "Pass the order. Repair 3 changed only the recorder's input classification (readReturn, fencedBlocks), the required-table reader (tableUnder, now the shared Markdown parser) and their tests and guidance, so criteria 3 and 4 are re-derived with independent inputs and the untouched criteria 1, 2, 5, 6 and 7 carry VER-002's evidence plus the current suites. VER-002's three findings are resolved by their own repair rules: F1 and F2 asked for an unambiguous representation of prose or structured intent, and F3 asked to retain genuine structured returns with trailing prose while separating examples through an explicit input distinction. --format prose keeps every example and adopts no findings; --format json keeps the genuine result's findings and report table; an undeclared embedded result is refused before any lane is written. The no-flag refusal of a mixed genuine return, which main accepted, is judged the criterion's forced cost and not a blocking regression: the same bytes are a prose example under criterion 3, so any rule that accepts one without a flag silently misreads the other, and the refusal names its remedy. Main also lost such results silently when closing prose held a brace. The complete review row at code identity 39bd5b47 is consumed rather than paid again. The traps are crediting the repair's 30-check adapter, which the executor wrote, as independent evidence (new inputs vary fence markers, containers, CRLF, heading level, the dispatcher route, capture and the helper route); treating the documentation's wider claim as an amended criterion (it is boarded as D046); and editing the subject (only the allocated report, evidence and generated projections are written). The NoOp of accepting the green suite and adapter alone is rejected because two earlier passes had green suites and failed verification. Actor: Claude Code, claude-opus-5-5, CLAUDE_EFFORT xhigh from session readback; no worker launched, zero uses of twenty.",
  "evidence": [
    "docs/evidence/WO-255/verifier-003/probes.mjs and observations.json: 31 checks, 31 hold, including auto refusal before lane creation, explicit prose preservation of terminal and container examples, explicit JSON retention of VER-002 F3's input, AST-only required tables on the record, capture and helper routes, and actor and --tree binding beside --format.",
    "docs/evidence/WO-255/verifier-003/checks.json: review-worker suite 27 of 27, WO-255 harness and continuation cases 4 of 4, WO-126 direct refutation 1 of 1, format, harness check, publication check and dependency, suppression and whitespace audit all pass.",
    "docs/evidence/WO-255/verifier-003/gate-evidence.json: npm test review selection at 39bd5b475ad3c259f473ca94796fb86df2ddddac8620f501dbf4a26b8c006c97, intact, passing, 44 suites, none missing.",
    "docs/control/local/reviews/WO-255/repair-3/: five records, each structured with inputFormat json, reviewed trees named with --tree; round 3's combined review held D042 with zero findings and a Traced consumers table."
  ],
  "rejected": [
    {
      "option": "Fail criterion 3 because a mixed genuine return without --format is now refused",
      "reason": "VER-002's repair rules asked for an explicit input distinction, and criterion 3's preserved prose example and main's accepted genuine return are the same bytes. A loud refusal with its remedy loses neither the example nor the findings."
    },
    {
      "option": "Run another complete product gate",
      "reason": "The code identity has a passing, intact complete review row with no missing suite. This verification wrote no implementation."
    }
  ],
  "reopenWhen": "The code identity changes, a probe in verifier-003 stops holding, or a supported caller cannot supply --format."
}
```

## WO-255-D046 — The JSON format's closing-prose claim is wider than the parser

```json
{
  "id": "WO-255-D046",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-003 F1, follow-up",
  "decision": "Board a follow-up; it blocks nothing. Product 07 says --format json accepts genuine results with a preface or closing prose, and the kit guide says the same for a fenced result followed by closing prose. readReturn under --format json refuses the whole record when any brace outside the selected result does not begin a parseable JSON object. A genuine fenced result followed by 'Templates such as {name} were unchanged.' is refused with '--format json: invalid JSON object; put the result alone in the input file'. The refusal is loud and its remedy works, so no finding is lost. The activation-base recorder read the same input as prose and lost the finding, so this breaks no behavior main had. Criterion 3 does not cover --format json, so no criterion is unmet. The defect is the mismatch between the declared surfaces and the parser.",
  "evidence": [
    "docs/evidence/WO-255/verifier-003/observations.json: 'json: closing prose holding a non-JSON brace is refused or keeps F1, never silent prose' (refused) and 'base: a genuine result with closing prose holding a non-JSON brace lost F1 or was refused at main' (recorded as prose, no findings).",
    "scripts/lib/review-worker.mjs readReturn: under format json, objectAt returning null refuses instead of moving to the next brace.",
    "docs/product/07-execution-guide.md, the recorder paragraph beginning 'The recorder declares the intent of mixed text'; docs/KIT.md, the record-command passage."
  ],
  "rejected": [
    {
      "option": "Route as blocking",
      "reason": "It meets no criterion's text, reproduces no regression from main and loses no finding silently."
    }
  ],
  "followup": "In scripts/lib/review-worker.mjs readReturn, under --format json skip a brace that does not open a parseable JSON object, as auto mode does. Keep the refusals for an invalid result shape and for any count other than exactly one (a result with broken syntax then counts zero). If that is not done, state in product 07 and docs/KIT.md that any other brace in the preface or closing prose refuses the record. Reproduction: the two named cases in docs/evidence/WO-255/verifier-003/probes.mjs; keep the exactly-one and malformed-result refusals.",
  "reopenWhen": "A caller's genuine result with ordinary closing prose cannot be recorded with --format json, or the documentation's claim changes."
}
```

## WO-255-D047 — Final review: the judgment, the one documentation correction and no source change

```json
{
  "id": "WO-255-D047",
  "date": "2026-11-05",
  "dispatch": "resume: final review; the judgment of WO-255 through VER-003, allocated FINAL-001",
  "decision": "Pass WO-255 at code identity 39bd5b475ad3c259f473ca94796fb86df2ddddac8620f501dbf4a26b8c006c97, the identity of the complete review row recorded 2026-11-06T00:01:19.355Z and of VER-003's subject, recomputed here before and after this review's edits. Main and the worktree's merge base both stand at the activation base ccfba0df927ccc2e76558af701a1075fc0fa4b36, and npm run worktree -- integrate WO-255 fetched origin and took in nothing. Every criterion holds on evidence run again in this session under the bounded wrapper, outside any gate: the review-worker suite (27 of 27), the four WO-255 harness and continuation cases, the WO-126 direct refutation case, VER-003's 31 probes (exit 0), harness check (43 generated surfaces), the publication check (256 of 256 headings, both editions current), the format check and git diff --check. VER-003's F1 is listed once with its original class and the follow-up route and is fixed here on its documentation side: product 07's recorder paragraph and the kit guide's record passage now say that a brace in the preface or closing prose that opens no JSON object refuses a --format json record, the limit readReturn holds, with the remedy of putting the result alone. The parser change D046 names first stays in the register as FUP-c53447a63c6b1031, deferred: a source edit in final review moves the code identity, owes a 0 h 47 min complete run and its own review ladder, and would reach the merge without independent verification; and a skip of non-JSON braces must still refuse a malformed result instead of adopting a valid object nested inside it (the suite's broken-outer control), a design the follow-up leaves to the order that takes it. No source changed in this review. Before the material choices, the traps that would have changed the work: accepting the verifier's pass without running its claims here (each was run again), fixing the parser in review (rejected above), quoting the operator's capture in a committed record (its items are named by number only), and shaping the report from an earlier instance (its shape comes from the result transition's rules and the reader's task). The NoOp, recording the pass on VER-003 alone, was rejected because the reviewer owns the identity check, the integration, the acceptance judgment, the one documentation defect, the register rows and the release surfaces.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-255/verifier-002/gate-audit.mjs: identity 39bd5b475ad3c259f473ca94796fb86df2ddddac8620f501dbf4a26b8c006c97; the npm test review row of 2026-11-06T00:01:19.355Z intact, passing and standing with 44 required suites and none missing.",
    "git rev-parse main and git merge-base main HEAD: both ccfba0df927ccc2e76558af701a1075fc0fa4b36; npm run worktree -- integrate WO-255 printed that the worktree is not behind main.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-review-worker.mjs: 27 passed, 0 failed; the WO-255 harness and continuation cases 4 of 4; the WO-126 direct command case 1 of 1; node docs/evidence/WO-255/verifier-003/probes.mjs exit 0; node scripts/harness.mjs check: 43 generated surfaces; npm run publication:check: 256 of 256 headings, 45 and 29 linked sections current; npm run format:check and git diff --check clean.",
    "docs/product/07-execution-guide.md, the recorder paragraph beginning 'The recorder declares the intent of mixed text', and docs/KIT.md, the record-command passage: each now states the brace limit beside the closing-prose claim; scripts/lib/review-worker.mjs readReturn is unchanged.",
    "scripts/test-review-worker.mjs, the broken-outer control under --format json: a malformed outer object holding a valid result is refused as an invalid JSON object, which a brace-skipping rule would have to keep refusing."
  ],
  "rejected": [
    {
      "option": "Change readReturn in this review so that --format json skips a brace that opens no JSON object",
      "reason": "A source edit moves the code identity, owes a fresh complete run and a review ladder, and reaches the merge with no independent verification; the suite's broken-outer control also shows the skip needs a design that still refuses a malformed result rather than adopting a valid object nested in it."
    },
    {
      "option": "Leave the documents' wider claim as written and the register row untriaged",
      "reason": "Criterion 7 asks the standing documents to state the recorder as built, and the verifier's repair rule names the documentation statement as the other acceptable route."
    }
  ],
  "reopenWhen": "A planning pass allocates FUP-c53447a63c6b1031, or a caller's genuine --format json result with ordinary closing prose cannot be recorded and the remedy of putting the result alone is refused by its route."
}
```

## WO-255-D048 — Final review: the matched follow-up rows whose conditions this order met

```json
{
  "id": "WO-255-D048",
  "date": "2026-11-05",
  "dispatch": "resume: final review; npm run plan -- followups --touching --work-order WO-255 (39 pending rows name a file this change touches or the order)",
  "decision": "Dispose the rows this order delivered or whose reopening condition its change met, in one --apply batch against register revision dd459fd03d49d7360eb4cc4d55baff1407e85d1e45c3390c3d9736b444b9542f (273cb50745643ccf15afe47aab406bfc36083d02ec79501bb3f56cefa9c5abc2 after the write), and leave the rows it only matched as they are. Settled: FUP-1398fcdb63df23d2 (WO-241-D004, allocated to this order and delivered by step 3: record takes --host, --model, --effort and --tree, D005), FUP-60ea250ef102cc46 (WO-250-D015, allocated to this order and delivered by step 3 through --format prose, D038, D040 and D042), FUP-7e0f8f889e96cd27 (D002's reopening, two branches naming one lane, taken by D026) and FUP-07d9932f484bbc4b (D006's reopening, an example's findings key read as a claim, taken by D027, D031, D032, D038, D040 and D042). Deferred: FUP-c53447a63c6b1031 (D046; this review states the brace limit in product 07 and the kit guide, D047, and the parser change stays for a planning allocation). Deferred again with the met condition named: FUP-89b7b9f657765e83, FUP-8dd0eb609946b9d1, FUP-916e24773df0b734 and FUP-957602bc42e32e1d, the cold-start rows, because this order's reviewed rules changed the measured overrun (D011 and D030: the executor 44,358 bytes against 40,194, the verifier 38,638 against 35,221, the reviewer 41,061 against 39,600, release-close 28,638 against 26,410, the planner 30,162 against 24,576 and the router 17,124 against 16,384; no ceiling moved, and npm run meta names the cold start a drift-to-low-performance reopen candidate), and FUP-eed385be08e5bdd9 (WO-226-D022), because this order re-mints the role oracle twice and edits scripts/test-gate-followups.mjs. The 31 other pending rows are left as they are: the order's own deferred rows (FUP-06090c778cc07685, FUP-1fa649b8d330505b, FUP-261c99c30cd0bd6d, FUP-2bcb656e4fc1e7f6, FUP-76dda631b58017b1, FUP-7b9896d099301d15, FUP-dec74be4077f5f25, FUP-df9d4f666035fecc and FUP-e4417f76298b1d02), whose conditions have not occurred; rows whose condition names a surface this order did not edit (FUP-770baf2f452c669e, the planner root's entropy sentence; FUP-848fd8e2ac941bc3, harnessPromptLine and the first-line rule, where this order adds harnessWorkerWords beside them; FUP-589642d0e0c714c8, FUP-911dc28a35dc4c44, FUP-be6721fbdd4b6285 and FUP-dc138fc0fac6a3fc, the hook's release-close admission, target resolution, outside-write path and refusal text, where this order adds the prompt hook's selection row; FUP-c4c7ba9f126d2e4a, plan-continuation's amendment guards; FUP-23aca17371cf7b86, the gate-row store's reader, where this order changes the generated-surface digest pattern only); rows whose condition is an event that did not occur (FUP-2ce66cf6a0602982, FUP-6dfaa29e3f0ba4fd, FUP-941fd291e0fd1033, FUP-d0a9719cc2e4ec55, FUP-17ea51254e5a7256, FUP-b1397fa85cbeba51, FUP-fb8cbeabbddef397, FUP-ea936acad1506e18, FUP-fc889fc98e33c547, FUP-ac86ee429dee2947, whose condition is a planning allocation, FUP-dfde4050da06d43b, whose sequence did not recur because each of this order's complete runs started after its ladder had ended, and FUP-912adb42a652b75f, whose guide edits here are judged by a fresh document gate while the complete row's identity keys code); and the two untriaged rows of other orders (FUP-78158140c6ac12aa and FUP-b946c5a767a65862), which the next planning pass triages.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-255 at register revision dd459fd03d49d7360eb4cc4d55baff1407e85d1e45c3390c3d9736b444b9542f: 267 pending rows, 39 matched over five pages, read in full.",
    "npm run plan -- followups --apply docs/control/local/followup-request.json: ten requests applied, four settled and six deferred, revision 273cb50745643ccf15afe47aab406bfc36083d02ec79501bb3f56cefa9c5abc2.",
    "docs/evidence/WO-255/handoff.md, Follow-ups: FUP-1398fcdb63df23d2 and FUP-60ea250ef102cc46 delivered and allocated for the final review to dispose; D026 reopens D002 and D027 reopens D006, the rows the register minted for those reopenings.",
    "WO-255-D011 and WO-255-D030: the cold-start figures named above; npm run meta on this tree: coldStartBytes 44,358 (Δ 614), REOPEN drift-to-low-performance."
  ],
  "rejected": [
    {
      "option": "Re-defer every matched row with this order named",
      "reason": "A row whose condition did not occur keeps its disposition; a textual match is a pointer for judgment, never a verdict."
    },
    {
      "option": "Triage the two untriaged rows of other orders here",
      "reason": "Triage is the planning pass's; the final review disposes only what this order delivered or whose condition its change met."
    }
  ],
  "reopenWhen": "A settled row's reopening condition occurs, or a later pass reads one of the 31 left rows' conditions as met by this order."
}
```
