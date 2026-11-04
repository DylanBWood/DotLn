# WO-254 decisions

## WO-254-D001

```json
{
  "id": "WO-254-D001",
  "date": "2026-11-04",
  "dispatch": "planning: standard planning pass + (the 2026-11-03 pass, after its pull request #272 merged); the operator's correction on reading the merged order",
  "decision": "Rewrite the order's Nomination provenance paragraph as a synthesis of the operator's mid-turn messages, naming what each message directed and quoting none of them, so the committed order carries no verbatim operator words; the verbatim capture stays only in ignored intake. No other sentence of the order changes.",
  "evidence": [
    "The clean-room floor in CLAUDE.md: docs/intake/ is ignored, single-copy source material; ordinary raw ideation is synthesized and rewritten, and exact wording is admitted only for an operator-authored public draft explicitly marked ready to file.",
    "The operator's direction of 2026-11-04 on reading the merged #272: the verbatim mid-turn messages in the order's Nomination provenance must not be committed in a public document; the operator asked for every such place to be listed and fixed.",
    "git grep over the tracked documents on 2026-11-04 found the quotes in this order (lines 113 to 117), in the map's candidates of 2026-11-03 (item 4) and in the register row minted from that item; the map and register texts are rewritten in the same change.",
    "The ignored capture docs/intake/planning-dispatch-2026-11-03-recurring-failures.md (SHA-256 4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83) keeps the verbatim words; the committed order now points at it and quotes nothing."
  ],
  "rejected": [
    {
      "option": "A second refutation of the changed order",
      "reason": "The change is a bounded, operator-authorized rewrite of one provenance paragraph that adds no scope and alters no criterion, design or step; product 07's execution-amendment route binds the approved bytes to the existing receipt without a new judgment."
    },
    {
      "option": "Leaving the paragraph and rewriting main's history",
      "reason": "A history rewrite of main is the operator's decision and does not remove the words from the merged pull request's record on the forge; the committed text must change regardless."
    }
  ],
  "reopenWhen": "A committed surface anywhere in the repository is found to quote an operator message that was not a public draft marked ready to file.",
  "kind": "correction",
  "misread": "The clean-room floor was read as applying to employer material and private identifiers only, so the operator's own mid-turn words were pasted into the order's provenance as evidence.",
  "meant": "Every operator word outside a public draft marked ready to file is intake: ignored, single-copy, synthesized before it is committed.",
  "changed": "The Nomination provenance paragraph of this order, the map's candidate 4 of 2026-11-03 and the register row's retained text are syntheses; the pass document records the correction."
}
```

## WO-254-D002

```json
{
  "id": "WO-254-D002",
  "date": "2026-11-04",
  "dispatch": "operator override: from 2026-11-04T02:13:34.355Z to 2026-11-04T02:14:13.899Z, during the clean-room correction after the 2026-11-03 pass",
  "decision": "Under the operator's override, rewrite as syntheses the operator quotes held in three hash-bound decision records (WO-181-D008's authorization and constraint fields, WO-233-D001's and WO-235-D001's dispatch fields) and re-bind each by appending the kit's own PlanExecutionAmended event with the rewritten decision's hash, since plan amend-order refuses a closed order outside the judged horizon; the earlier events stay as history and the check validates the latest. Record the override here because no order was selected in the session.",
  "evidence": [
    "The operator's direction of 2026-11-04, repeated across several messages: no operator words are to remain quoted anywhere in the public repository, hash-bound records included.",
    "npm run plan -- amend-order WO-233 WO-233-D001 and WO-235 WO-235-D001 on 2026-11-04: 'execution amendment requires an order in the current judged horizon and an authorization reason'.",
    "scripts/lib/plan-receipts.mjs: validateAmendment checks the decision binding only for an event no later event re-bound ({ decision: !rebound }), so a later PlanExecutionAmended for the same receipt, order and decision supersedes the earlier binding.",
    "The override's advisory at exit: OperatorOverrideRecorded was not appended because a live evidence gate (the resume suite this session ran) refused control writes; this decision is the record the advisory asks for.",
    "Bypassed requirements: the hook's live-gate write refusal for the three decision edits made while the resume suite ran (docs/evidence is not that suite's input), and the records-immutability convention for three closed orders' decisions, on the clean-room floor's authority."
  ],
  "rejected": [
    { "option": "Leave the three quoted phrases in place until a kit change admits re-binding a closed order", "reason": "The operator's direction is that the words leave the repository now; the floor outranks the convention." },
    { "option": "Rewrite the control log's earlier events", "reason": "The control log is append-only; a later event re-binds without touching history." }
  ],
  "reopenWhen": "plan check or test:docs refuses a re-bound decision, or a kit release makes amend-order admit a closed order's clean-room correction so this route is retired.",
  "kind": "override-record"
}
```

## WO-254-D003

```json
{
  "id": "WO-254-D003",
  "date": "2026-11-04",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.116.0, the next minor above the observed release baseline v0.115.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.115.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-254-the-hooks-get-out-of-the-operators-way.md"
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

## WO-254-D004 — The operator's directions during this execution, and how each changed it

```json
{
  "id": "WO-254-D004",
  "date": "2026-11-04",
  "dispatch": "resume: next (2026-11-04, Claude Code, executor claude-opus-5-5 with CLAUDE_EFFORT max) and the operator's mid-turn messages",
  "decision": "Act on five operator directions given during the dispatch, each read as stated and none as a rule beyond this order: (1) an observation that WO-253's Codex verifier also kept its writer, read as evidence for step 3 and answered with the records below (D007, D014); (2) fix every related and adjacent defect met here rather than defer it, read as standing direction for this execution, so each adjacent defect diagnosed was queued and fixed (D014 to D016) and none was deferred; (3) run the review ladder's workers on the Codex host, read as a choice of host for the kit helper (npm run worker -- review --host codex), recorded at the ladder (D023); (4) live Codex or Claude sessions may be spawned to test hooks and rules, writer reservations included, read as the authorization the live feedback self-host episode and a native hook probe use (D022); (5) a caution, through a quoted passage and another session's account, that fixing on the next green check hides facts already in plain text, read as a request to slow down and reread this order's duties before any gate, which found the feedback re-mint and live episode, the harness snapshot sync and the drive's dead-writer refusal before any gate ran. Two of the order's own check names are read by the suites they meant: the order's 'npm test -- --only harness' runs only scripts/harness.mjs check, so the fixture cases its steps name are run by --only harness-fixtures, and 'the resume fixture' of criterion 3 is the Codex lifecycle fixture that drives scripts/resume.mjs (scripts/test-harness.mjs, WO-139 test), because the resume suite's fixture repositories carry no built harness runtime for a Codex reservation.",
  "evidence": [
    "scripts/test-runner.mjs: --only selects the row whose name equals its argument (runGate, `single`); the row named harness is node('harness', 'scripts/harness.mjs', { args: ['check'] }) and the row named harness-fixtures runs scripts/test-harness.mjs and scripts/test-drive.mjs.",
    "scripts/test-resume.sh copies scripts/resume.mjs and scripts/lib into its fixture repository and no packages/*/dist; resume.mjs reserveCodexDispatch throws 'Codex writer reservation unavailable; harness runtime is not built' without packages/skeleton/dist/src/harness-host.js.",
    "WO-253's retained records (main's docs/control/local/retained/WO-253/harness): the Codex session 227c0ab1 released its verify reservation at 09:59:11Z with VerificationCompleted at 09:59:09Z, reserved again at 10:28:47Z for a fix dispatch (RepairRequested 10:28:49Z) and was force-released by the operator at 10:43:52Z with its host alive.",
    "scripts/lib/evidence-sources.mjs and docs/evidence/WO-147/decisions.md#wo-147-d010: a change to a registered evidence source owes the editions' re-mint and one live feedback self-host episode."
  ],
  "rejected": [
    {
      "option": "Defer the WO-253 hold as a planning follow-up",
      "reason": "The operator directed that no related or adjacent defect be deferred; the hold is fixed by the turn-end release (D007)."
    },
    {
      "option": "Run the order's --only harness for its fixture cases",
      "reason": "It runs harness check, which exercises none of the fixture cases the steps name; harness-fixtures runs them, and the complete run runs both."
    }
  ],
  "reopenWhen": "The operator narrows or withdraws any of these directions, or a suite's name comes to select the fixture cases the order named."
}
```

## WO-254-D005 — A zombie is dead: the process table's state column decides

```json
{
  "id": "WO-254-D005",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 1",
  "decision": "Judge a process whose table row's state column opens with Z dead wherever writer liveness is judged. packages/skeleton/src/writer-teardown.mjs, the writer's build-free module that harness-host.ts and the script libraries already import and every runtime inventory already ships, holds the judgment (zombieProcessState) and a one-process table read (processTableState, ps -o stat= -p); harness-host.ts reads the state column with its table (ps -axo pid=,ppid=,stat=,lstart=,comm=, command column last) and harnessProcessAlive returns false for a zombie row; scripts/lib/off-ramps.mjs processAlive keeps signal zero and adds the same state read. A zombie owner's reservation is therefore stale: writer --show reads alive false, the next guarded call reclaims it with its record, and writer --release retires it without --force. scripts/lib/host-resources.mjs needs no change: both of its censuses already leave zombies out, so its processAlive(owner, table) already judges one dead.",
  "evidence": [
    "A throwaway zombie on this host (sh -c 'sleep 0 & echo $!; exec sleep 6'): ps -o pid=,ppid=,stat=,lstart=,comm= printed '8918 8916 Z Wed Nov  4 10:48:55 2026 <defunct>'; process.kill(pid, 0) succeeds for it, so signal zero alone calls it alive.",
    "scripts/lib/host-footprint.c line 112 skips pbi_status 5 (SZOMB), and scripts/lib/host-resources.mjs portableSnapshot drops a /proc state Z row, so neither census holds a zombie; the order's 'ps read at 466' is sampleFileEventDaemon's fseventsd RSS read, not a liveness read.",
    "scripts/test-harness.mjs 'WO-254 a zombie holder is dead ...': a live child holder refuses, then the same child killed and left unreaped reads Z, harnessProcessAlive false, writer --show alive false and writer --release released alive false forced false."
  ],
  "rejected": [
    {
      "option": "A liveness heartbeat",
      "reason": "The order's design: a holder that writes nothing has no heartbeat to miss; the table already says it."
    },
    {
      "option": "A new shared module for the judgment",
      "reason": "Every fixture closure, runtime inventory and launchpad export list would need it registered; writer-teardown.mjs is already in each and is the writer's own module."
    }
  ],
  "reopenWhen": "A platform's ps reports a zombie without a leading Z in stat=, or a census starts listing zombies."
}
```

## WO-254-D006 — The refusal's own remedy runs where the refusal is read, by exact argv

```json
{
  "id": "WO-254-D006",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 2",
  "decision": "Admit from the refused session the two writer commands the refusal names, judged by their exact argv through the existing shell-word classifier: node, this checkout's scripts/harness.mjs, then writer --show (any session, as before) or writer --release (only when the observed holder is another session whose owner the table proves exited or a zombie, so the command retires that stale reservation and logs operator-released alive false forced false, instead of this session reclaiming it first). A pipe, redirect, second command or --force is a different command and is judged as one; --force against a live holder stays the operator's. The session form of the refusal names what this session may run, each as that exact command with nothing beside it, and the operator's release names the operator form.",
  "evidence": [
    "The 2026-11-03 refused calls in that planning session's transcript: 'node scripts/harness.mjs writer --show 2>&1 | head -40' and 'node scripts/harness.mjs writer --release --force 2>&1 | head -20'; metadataCommand admitted only the exact 'node scripts/harness.mjs writer --show', so the session's own pipe made the view a writing call.",
    "Before this change a stale holder made writer --release from a governed session fail twice over: the guard reclaimed the reservation for the session, then releaseHarnessWriterByOperator met that session's live owner and refused.",
    "scripts/test-harness.mjs 'WO-254 a zombie holder is dead ...' and 'WO-039 foreign writer reservations ...' (both green): the view and the stale release run from the refused session, --release, --release --force and the piped view are refused under a live holder, and git status is refused with the message naming what is admitted."
  ],
  "rejected": [
    {
      "option": "Admit any harness subcommand under a foreign writer",
      "reason": "The order's design: the one-writer rule; --show and --release are the recovery, nothing else is."
    },
    {
      "option": "Admit the piped spelling",
      "reason": "Exact argv is the order's admission; the refusal now says to run the command alone."
    }
  ],
  "reopenWhen": "A session needs another command to recover a stale reservation, or a host spells the command another way."
}
```

## WO-254-D007 — A stopped dispatch lets go: the release close's command and a stopped Codex turn

```json
{
  "id": "WO-254-D007",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 3, with the operator's WO-253 observation (D004) and the direction to fix it here",
  "decision": "Release a Codex session's writer at two stops. (1) The release close is its role's whole command: a publishing attempt (release close --publish, not a preview) that ends before its completion releases this session's own reservation and journals dispatchStopped with the step and blocker class; a run that stops before its attempt begins does the same with step entry; the close record carries writerStop and its summary says so; a retry of the same command reserves the writer again before it acts (reserveCodexRoleCommand), so a foreign holder that took main meanwhile refuses it. (2) A Codex turn that stops without asking for a continuation releases this session's own reservation through the generated hook (releaseStoppedDispatch, journaled as dispatchStopped command turn), and the next prompt of a session whose dispatch is still outstanding reserves it again; a foreign holder there is named in the prompt's context and nothing is refused. Only a session whose prompt hook has been observed releases at a turn's stop, so a host that delivers no prompt event keeps today's hold until completion. A live, working dispatch is unchanged: a turn in progress and a preview keep the writer. The resume suite's and release suite's expectations that a stopped close keeps the writer are replaced by the requirement: three cases of scripts/test-release.sh (the surface-refused, dirty-derived and starter-refused closes) now assert the release, its stand-in runtime gains the stop release and the re-reservation, and the material listing re-seeds the marker it lists.",
  "evidence": [
    "WO-241's close (2026-11-03): reserved at 22:41:38Z, stopped on a prune blocker by 22:43Z, held until the operator's forced release at 23:17Z; WO-253's Codex session: reserved 10:28:47Z for a fix dispatch it did not complete, forced at 10:43:52Z with its host alive (D004).",
    "scripts/release.mjs before this change: 'A release-close dispatch keeps the writer through publication. Only a successful, non-preview close is its completion and releases that actor.'",
    "Claude's finish hook (harness-host.ts, kind finish) releases the writer at every Stop and its next guarded call reserves it again; Codex tool calls are unhooked, so its prompt hook is the earliest point to reserve again.",
    "The WO-054 native probe observed SessionStart, PreCompact, PostCompact, SessionStart(compact), Stop and SessionEnd and no prompt event, so release at a stop waits for an observed prompt hook.",
    "scripts/test-harness.mjs WO-139 (a preview keeps the writer; a stop before and inside the attempt releases it and journals the stop), scripts/test-codex-continuation.mjs 'WO-254 a stopped Codex turn ...' over the real runtime, and scripts/test-release.sh (release tests passed, 0 h 7 min) are green."
  ],
  "rejected": [
    {
      "option": "Release on idle time",
      "reason": "The order's design: WO-237's retained reservations are not idle-timed; a stop is an event, not a duration."
    },
    {
      "option": "Release at a stop and let a retry run without a reservation",
      "reason": "Codex is unhooked, so the retried command would write main with no writer held; the command reserves again first."
    },
    {
      "option": "Mark a stopped Codex reservation reclaimable instead of releasing it",
      "reason": "It needs a second reservation state the guard, the view and the race protocol would all judge; a release and a re-reservation reuse the two operations Claude's hooks already make."
    }
  ],
  "reopenWhen": "A native Codex probe shows prompt hooks undelivered while Stop is delivered, a Codex session writes after a stop with another session holding the worktree, or a retried close needs the writer it released."
}
```

## WO-254-D008 — A denied activation leaves nothing behind

```json
{
  "id": "WO-254-D008",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 4",
  "decision": "Before worktree start creates anything, probe that the host admits writes where the worktree will stand (an exclusive directory made and removed at its path); a sandbox or permission refusal stops the start with nothing created. After creation, a step the host denies (EPERM, EACCES, 'operation not permitted' or 'permission denied' in the error or the child's output) is undone by the same command: the records the start carried out of main (pending sibling receipts and pending post-close override records, snapshotted before creation) are written back, the worktree is made writable where a denied step left it read-only, removed with git worktree remove --force and pruned, its branch deleted, and the denial recorded in main's ignored docs/control/local/worktree-start-denials.jsonl with what was removed and restored. Any other failure keeps the preserve-and-retry recovery the bound retry program prints, and a registered target's start keeps its recorded pending-start protocol.",
  "evidence": [
    "docs/planning/work-order-map.md §7 of 2026-11-03: ../DotLn-wo242 held three generated sibling-observation files from a denied activation, which carrySiblingReceipts writes before resume activate runs.",
    "scripts/siblings.mjs carryPendingReceipts and scripts/lib/pending-overrides.mjs carryPendingOverrides both remove main's copy after writing the worktree's, so removing the worktree without restoring them would lose them.",
    "scripts/test-worktree.sh (worktree tests passed, 0 h 2 min): the fixture's git takes write permission from the new worktree's order-control directory right after the add, the activation's write fails with EACCES, and no worktree, registration or branch remains, the carried receipt is back in main and the denial row names what was done."
  ],
  "rejected": [
    {
      "option": "Remove the worktree on every failure",
      "reason": "The bound retry program preserves work for a failure the operator corrects in place, which a test pins (test-target-worktree-start.mjs 'created and preserved'); the order names a denial."
    },
    {
      "option": "Carry the records after activation instead of restoring them",
      "reason": "It reorders an established start sequence the carry fixtures pin; restoring what a denied start carried keeps the sequence and loses nothing."
    }
  ],
  "reopenWhen": "A host denies a step with an error naming neither code nor phrase, or a denied start leaves a file behind."
}
```

## WO-254-D009 — A question is a smell with two pathways, classed by form and never by meaning

```json
{
  "id": "WO-254-D009",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 5",
  "decision": "Class an operator message in one compiler function, operatorMessageClass, that the Claude hook imports and the generated Codex hook embeds: a recognized prefix on the first content line decides it as before; otherwise a message whose trimmed text ends in a question mark is question, and any other is unclassified. An interrogative opening alone makes no question, and analysis: keeps its existing question class. For an unprefixed question the Claude prompt hook adds OPERATOR_QUESTION_CONTEXT, the order's sentence naming the two pathways, that neither stops the work, the exception that a message asking for an action (pausing, stopping or waiting among them) is a request, and that it records no rule. Every emitted role root carries the same two pathways and 'A question is not a waiver', for hosts whose prompts are unhooked.",
  "evidence": [
    "The order's criterion 4 forms: why is the close slow? and is this done? are questions; How many roots are there, Do not run the final gate until I approve. and fix the test are not; Can you pause before the final gate? and Can you add the missing regression test? are questions whose context names the exception.",
    "scripts/test-harness.mjs 'WO-254 an unprefixed message ending in a question mark ...' and 'WO-254 every emitted role root carries ...', both green; the journal rows keep no message text.",
    "Product 07 §Discipline already states the two pathways (the 2026-11-03 pass); this order adds the hook's class and context to it."
  ],
  "rejected": [
    {
      "option": "A semantic classifier",
      "reason": "The order's non-goal and WO-178's rule that the prefix table is control language, never a reading of prose."
    },
    {
      "option": "Class by the first content line only",
      "reason": "The order classes a message that ends in a question mark; a closing request after a question line is an instruction, not a question."
    }
  ],
  "reopenWhen": "The operator's messages show a question form this rule misses or an instruction it calls a question."
}
```

## WO-254-D010 — A rule is written once, in the open: the Rules recorded block

```json
{
  "id": "WO-254-D010",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 6",
  "decision": "Give every pass document a Rules recorded section after Write-backs, holding one JSON array between dotln-rules-recorded markers of {rule, document, section, message: {sessionKey, recordedAt}, captureDigest} with an optional class label; plan start writes it empty. plan check (checkPlanGate, so every caller) reads the current planning branch's pass document and, for each rule, the OperatorMessageObserved row the message names in that session's journal, and refuses a rule whose row is missing, a host's task notification, a question, labelled with a class the journal does not give it, or whose capture digest is not the message's; a pass document without the block records no rule. The instance operator record's template says that a standing rule enters it, or any standing document, only from the operator's direction with its journal reference and capture digest.",
  "evidence": [
    "The section sits after the red-tag block because test-plan-refutation.mjs reads the skeleton's first JSON fence as the red-tag block.",
    "scripts/test-plan-refutation.mjs 'WO-254 plan check refuses a standing rule ...' (green): a question row labelled direction, a missing row and a wrong digest are refused naming the rule, a direction row with its digest passes, and plan start writes the empty block.",
    "scripts/test-launchpad-export.mjs 'WO-254 criterion 5 ...' reads the exported instance's AI-HARNESS-SECURITY.md for the sentence."
  ],
  "rejected": [
    {
      "option": "Refuse rules from mid-turn messages",
      "reason": "The order's design: the operator's mid-turn words of 2026-10-30 were direction; what failed was recording a remark without saying so."
    },
    {
      "option": "Judge merged passes' rules on main",
      "reason": "The session journals are ignored and local to the checkout the pass ran in; the pass is judged on its planning branch, where its journal is."
    }
  ],
  "reopenWhen": "A planning pass runs where its session journal is not, or the operator wants merged passes' rules re-judged."
}
```

## WO-254-D011 — The operator's standing instructions ride the Codex compaction record

```json
{
  "id": "WO-254-D011",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 7",
  "decision": "The generated Codex hook's prompt event journals each operator message of a dispatched session as OperatorMessageObserved (source codex-prompt-hook) with its form class, digest and bytes, and keeps the message's text, cut at 64 KiB as an override capture is, in the session's own lane file <key>.codex-messages.jsonl beside the journal rather than in it, because WO-178 keeps the journal's rows to constrained metadata. The PostCompact record names the session, the saved task and the compaction's time; the compact SessionStart context restores, after the task sentence, every operator message since the dispatch (the dispatch's bound start), verbatim and oldest first within 64 KiB; and the first Stop after each compaction journals compactionProbe naming the first assistant reply (digest, bytes, a 240-byte excerpt) against the saved task, before any continuation the stop requests. The existing test that conversation text does not control recovery now checks that no continuation record or receipt appears, since the capture now writes the lane.",
  "evidence": [
    "Before this change the Codex prompt event returned at once ('Ordinary conversation belongs to the model'), and OperatorMessageObserved rows for Codex came only from recordCodexDispatch's synthesized dispatch phrase (e63df0b3's journal: 21 bytes, source codex-dispatch-phrase).",
    "scripts/test-codex-continuation.mjs (10 of 10 pass): 'pause before the final gate' and 'could you pause before the final gate?' are captured as unclassified and question with their text, restored verbatim after the task sentence, and the probe names the first reply once."
  ],
  "rejected": [
    {
      "option": "A Codex pause protocol",
      "reason": "The order's non-goal and WO-054's adapter design: the instruction is restored, not interpreted."
    },
    {
      "option": "Keep the text in the session journal itself",
      "reason": "Every journal reader would then read prose WO-178 keeps out; a sibling lane file is still the session's ignored record."
    }
  ],
  "reopenWhen": "A native Codex probe shows the prompt event undelivered or the restored context dropped, or 64 KiB proves too small for a session's instructions."
}
```

## WO-254-D012 — An advisory that fires on every call is a journal row: the three shell classifications

```json
{
  "id": "WO-254-D012",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 8",
  "decision": "Journal the three host-decided shell classification advisories (shell control syntax, dynamic substitution and working-directory override, now named by constants in harness-command.ts) with advisory, delegated true and shown false, and give the agent no systemMessage for them; every advisory that names a refusal or another classification is shown as before. A plain command list such as a; b raises no classification advisory at all, so it is journaled as an ordinary call. scripts/test-process-debt.mjs's visible-advisory list loses the substitution advisory, which is now asserted in the journal with shown false.",
  "evidence": [
    "Fourteen days of this checkout's journals before this order: 513 working-directory, 434 control-syntax and 336 substitution advisories, each ending 'host permissions decide' (the 2026-11-03 pass §Readings).",
    "The built classifier on 2026-11-04: 'cd /tmp && ls' throws the working-directory classification, 'echo $(date)' the substitution, 'a; b' classes as shell.run, 'for x in 1; do echo $x; done' the control syntax, and 'git push origin main' remote.unapproved.",
    "scripts/test-harness.mjs 'WO-254 the three host-decided shell advisories ...' and test-process-debt.mjs 'installed permission hook distinguishes classification advisories ...' are green; the remote.unapproved advisory is still shown."
  ],
  "rejected": [
    {
      "option": "Remove the classification",
      "reason": "The order's non-goal: the registered-target admission and the refusals read it."
    }
  ],
  "reopenWhen": "One of the three forms is found to hide a refusal the agent needed to see."
}
```

## WO-254-D013

```json
{
  "id": "WO-254-D013",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 9",
  "decision": "Add to every role root the one common sentence that a session blocked on what only the operator can clear states the block and the one line that clears it in a single message and ends its turn, beside D009's two pathways, and correct two sentences this order made false: the Codex writer sentence of every root (D007, D005) and the router's dead-writer sentence (D016). Every root grows by 1,040 bytes and the router's by 782: executor 42,398 to 43,438, verifier 37,027 to 38,067, reviewer 39,450 to 40,490, release-close 27,027 to 28,067, planner 28,078 to 29,118, refuter 25,949 to 26,989 and router 16,036 to 16,818 (installed CLAUDE.md plus the skill, both roots identical). Under product 07 §Discipline's one cold-start route each reviewed rule stays whole and each root over its ceiling is boarded for optimization with equivalent usefulness: no ceiling is raised and no acceptance is recorded. The reviewer (effective 39,600) and the router (16,384) newly exceed theirs; executor, verifier, release-close and planner exceeded theirs already. The WO-254 role oracle pins the new trees at both economy settings over WO-253's, and names this decision's follow-up for every root over its ceiling.",
  "evidence": [
    "node scripts/harness-context.mjs --check on the synced tree, 2026-11-04: the bytes above, previousBytes from WO-253's oracle, verdict breach for every role but the refuter, which has no ceiling.",
    "docs/control/budgets.json limits.coldStartBytes and its acceptances: executor 40,194, verifier 35,221, reviewer 39,600 and release-close 26,410 accepted before the route retired; planner 24,576 and router 16,384 nominal.",
    "The host's interactive-mode page (read 2026-11-03 by the filing pass): queued shell commands wait for the turn's end, so a session that keeps its turn holds the operator's ! command."
  ],
  "rejected": [
    {
      "option": "Shorten other sentences to fit the ceilings",
      "reason": "Product 07 §Discipline: no needed rule is cut to fit; the optimization is boarded with equivalent usefulness."
    },
    {
      "option": "Raise the ceilings or record acceptances",
      "reason": "The 2026-09-17 route is retired (product 07 §Discipline, WO-192-D095)."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-254 added the question's two pathways and the blocked-turn sentence to every root (1,040 bytes, 782 for the router), and the executor, verifier, reviewer, release-close, planner and router roots exceed their cold-start ceilings in docs/control/budgets.json.",
  "reopenWhen": "A planning pass allocates the optimization, or a role's reviewed rules change again."
}
```

## WO-254-D014 — Adjacent: a second Codex dispatch in one session keeps its own completion event

```json
{
  "id": "WO-254-D014",
  "date": "2026-11-04",
  "dispatch": "resume: next; adjacent repair adjacent-0001, from the operator's WO-253 observation (D004)",
  "decision": "At every recorded Codex dispatch set the session's expected completion event from the dispatched action, its starting event count from the order's events after the dispatch and its starting revision, as the Claude prompt path does; a closed or withdrawn order and a release close clear the expected event. Before this change beginHarnessSessionOnce returned early for a session that had begun, so a session that verified and then dispatched a repair kept VerificationCompleted and the verification's start, and the compaction continuation and step 7's messages since the dispatch read the wrong phase.",
  "evidence": [
    "WO-253's retained session record 227c0ab1: role executor, intent resume: fix, expectedEvent VerificationCompleted, startingEventCount 3 after its 10:28Z fix dispatch.",
    "scripts/test-harness.mjs 'WO-254 a second Codex dispatch in one session ...' (green): verify then fix in one session reads RepairCompleted counted from the fix; a release close clears the expected event."
  ],
  "rejected": [
    {
      "option": "Refuse a second dispatch from one Codex session",
      "reason": "It widens a refusal, a non-goal; the transition is legal, and the stale record was the defect."
    }
  ],
  "reopenWhen": "A Codex session's record names a phase other than its latest dispatch's."
}
```

## WO-254-D015 — Correction: the release close already released at an early-return completion; the fixture's stand-in hid the new stop

```json
{
  "id": "WO-254-D015",
  "date": "2026-11-04",
  "dispatch": "resume: next; adjacent-0003, revised",
  "decision": "Withdraw the diagnosis queued as adjacent-0003 and remove the completion branch added for it: the registered-target, no-release and already-published closes run in close(), after the completion release is prepared, and release the writer at completion today; closePrerequisites returns no context only with exit code 1. The defect actually met there is the release fixture's stand-in harness runtime, which lacked the stop release, so its cleanup-blocked case pinned the old retained writer; the item was revised to that and fixed (D007).",
  "evidence": [
    "scripts/release.mjs at the base: closePrerequisites spans 3501 to 3665 and returns undefined only at 3610, after process.exitCode = 1; close() begins at 3666 and holds the target, self-no-release and self-existing-release branches.",
    "The adjacent queue: adjacent-0003 revision 2 (revise action with this correction as its reason), completed with node scripts/harness.mjs bounded -- bash scripts/test-release.sh exit 0."
  ],
  "rejected": [
    {
      "option": "Keep the completion branch as harmless",
      "reason": "It is unreachable code that describes a path that does not exist."
    }
  ],
  "reopenWhen": "closePrerequisites gains a return that finishes a close without an exit code.",
  "kind": "correction",
  "misread": "The branches of close() that return early were read as closePrerequisites', so a finished target, no-release or already-published close looked like one that never prepared its writer release.",
  "meant": "Only the main publishing path and close() reach the completion release, and both do; a no-context return from the prerequisites is the surface refusal.",
  "changed": "No completion branch is added to the close attempt; the queue item was revised before it started, and scripts/test-release.sh's stand-in now carries releaseStoppedDispatch and reserveCodexDispatchWriter."
}
```

## WO-254-D016 — Adjacent: a drive treats a dead writer as no conflict and stops asking for operator override:

```json
{
  "id": "WO-254-D016",
  "date": "2026-11-04",
  "dispatch": "resume: next; adjacent repair adjacent-0004, met while correcting the router role text (D013)",
  "decision": "In scripts/lib/drive-session.mjs writerConflict, count only a live or unknown holder as a conflict: a holder the table proves exited, a zombie among them, is reclaimed with a record by the phase worker's own entry (beginCodexPhase reserves through reserveHarnessWriter; a Claude worker's first guarded call does the same). The refusal for a live or unknown holder now names the inspect and release commands instead of telling the operator that a dead Codex owner requires operator override:, and the router role text says the same.",
  "evidence": [
    "drive-session.mjs before this change: 'a dead Codex owner requires the operator's operator override: recovery phrase', returned for any reserved holder.",
    "scripts/test-drive.mjs 'WO-254 a writer whose owner is dead is no conflict ...' and 'writer conflict stops before launch ...' (unknown holder) are green."
  ],
  "rejected": [
    {
      "option": "Let the router release the dead reservation itself",
      "reason": "The router writes nothing and holds no writer; the phase worker's entry already reclaims it with its record."
    }
  ],
  "reopenWhen": "A phase worker's entry fails to reclaim a dead holder."
}
```

## WO-254-D017 — FUP-4763c82de6324631: the hook and the host deny the same names for each listed desktop skill

```json
{
  "id": "WO-254-D017",
  "date": "2026-11-04",
  "dispatch": "resume: next; carry-in FUP-4763c82de6324631 (WO-251-D017)",
  "decision": "Emit Skill(skill:<name>) beside the exact and argument rules for each listed desktop skill, and classify in isDesktopControlTool every name the host documents for a listed skill through one compiler list (desktopControlSkillNames): a skill synced as anthropic-skills:<name> also answers to its short <name> and to the <name>:<name> plugin form Claude Desktop delivers it as. Any alias or display name besides is covered by the host's parameter rule; unrelated skills, near names included, stay unclassified.",
  "evidence": [
    "Claude Code's skills page, §Restrict Claude's skill access, read through Context7 on 2026-11-04: Skill(anthropic-skills:deploy) also blocks the skill when Claude Desktop delivers it as a plugin; the plugin form is deploy:deploy; Skill(skill:deploy) blocks the skill whichever of its names Claude calls it by, including its alias and display name; a synced skill runs as /<name> or /anthropic-skills:<name>.",
    "packages/compiler/test/harness.test.ts 'desktop control host denials ...' and scripts/test-harness.mjs 'desktop control refuses by default ...' are green with the short and plugin forms refused and project:verify, computer-use-notes and anthropic-skills:pdf admitted."
  ],
  "rejected": [
    {
      "option": "Emit Skill(<short name>) deny rules",
      "reason": "A local skill of the same short name would be denied too; the parameter rule covers the synced skill under every name."
    }
  ],
  "reopenWhen": "A session journal records a listed desktop skill admitted under another name, or the host changes its skill-name or permission-rule semantics."
}
```

## WO-254-D018 — FUP-4798f1b5f5a74ed1: the fold is the last check before a transition is written

```json
{
  "id": "WO-254-D018",
  "date": "2026-11-04",
  "dispatch": "resume: next; carry-in FUP-4798f1b5f5a74ed1 (WO-249-D017)",
  "decision": "Fold the order's segment with the new record before writing it, as carryPendingOverrides does: appendTransition folds a provisional record before the checkpoint and the final record before the append (foldWithRecord in scripts/lib/control-store.mjs), so an event the fold refuses is never written and creates no checkpoint. Keep retract's and reopen-handoff's own checks: each names its specific cause (precedes the current activation, a later record replaced it, an ordinal retracted it), which the fold's one message does not, and with the fold last a looser command check can no longer write an unreadable event.",
  "evidence": [
    "No current command check is looser than the fold: reopen-handoff is legal only in ready-to-verify, as its fold requires, and retract's checks match its fold's; the fold-before-write is the structural guarantee the follow-up asked for.",
    "scripts/test-control-segments.mjs 'WO-254 a record the fold refuses throws before any write ...' (green)."
  ],
  "rejected": [
    {
      "option": "Drop retract's and reopen-handoff's duplicate checks",
      "reason": "Their messages tell the operator which condition failed; the follow-up's defect is the write-before-fold order, now removed."
    }
  ],
  "reopenWhen": "A segment takes an event it cannot read."
}
```

## WO-254-D019 — FUP-a0efaae1b9887fde: the spawn cap reads the configured control root's budgets

```json
{
  "id": "WO-254-D019",
  "date": "2026-11-04",
  "dispatch": "resume: next; carry-in FUP-a0efaae1b9887fde (WO-241-D003)",
  "decision": "Resolve the control directory once in temporary-root-records.mjs (configuredControlDirectory: roots.control, else roots.docs with /control, else docs/control) and read the spawn cap's budgets there (readSubagentCap, subagentBudgetsPath), as the process and retention readers do; the refusal, the advisory and the summary name the resolved file. The feature inventory drops its default-root special case and its row text. This is the skeleton's compatibility change, released in its minor bump (D021).",
  "evidence": [
    "WO-241-D003: subagent-budget.ts read the default docs/control/budgets.json while process-budget and temporary-root-records honored the configured control root.",
    "packages/skeleton/test/subagent-budget.test.ts 'WO-254 the spawn cap reads the configured control root's budgets ...' (relocated cap 1 refuses the second launch naming records/control/budgets.json) and scripts/test-harness.mjs 'feature readers consume budgets ...' (the inventory reads 1, then 3, from the relocated file and ignores a default-layout file) are green."
  ],
  "rejected": [
    {
      "option": "Leave the default path and keep documenting it",
      "reason": "An instance that relocates its control root gets a cap from a file it does not edit."
    }
  ],
  "reopenWhen": "Another runtime reader of the control budgets resolves its path another way."
}
```

## WO-254-D020 — FUP-1b5cb21e12253f3e: the drive readers' proofs observe the drive's own limits

```json
{
  "id": "WO-254-D020",
  "date": "2026-11-04",
  "dispatch": "resume: next; carry-in FUP-1b5cb21e12253f3e (WO-241-D015)",
  "decision": "Build the drive record's limits in one exported function, driveLimits(budgets), and have the feature-reader test consume driveLimits for the driven-session ceiling and pass driveLimits' record to attemptTimeLimit for the phase timeout, so removing either read from drive-session.mjs makes its two toggled outputs equal and fails the test.",
  "evidence": [
    "Before this change the test read readBudgets(root).drivenSessionCeiling (process-budget's reader) and built the limits record by hand for the timeout.",
    "scripts/test-harness.mjs 'feature readers consume budgets ...' is green over driveLimits."
  ],
  "rejected": [],
  "reopenWhen": "drive-session.mjs changes how it reads its budgets, or either row's reader proof is next edited."
}
```

## WO-254-D021 — Component versions for this order's changes

```json
{
  "id": "WO-254-D021",
  "date": "2026-11-04",
  "dispatch": "resume: next; release preparation",
  "decision": "Bump @dotln/compiler 0.38.0 to 0.39.0 (operatorMessageClass, OPERATOR_QUESTION_CONTEXT, desktopControlSkillNames and the parameter deny rule exported; the generated Codex hook passes a classifier), COMPILER_PACKAGE_VERSION with it, @dotln/skeleton 0.82.0 to 0.83.0 (writer liveness, admissions, stopped-dispatch release, the question class, quiet advisories, the spawn cap's root and new exports) and HARNESS_HOST_VERSION 0.42.0 to 0.43.0 for the hooks' changed behavior, with the skeleton's and console's dependency pins and the lockfile; kernel, beacons and console keep their versions.",
  "evidence": [
    "WO-253 bumped @dotln/skeleton 0.81.0 to 0.82.0 with the console pin and the lockfile; WO-250 and WO-251 bumped HARNESS_HOST_VERSION for hook behavior.",
    "git diff package-lock.json: five lines, the compiler and skeleton versions and three dependency pins."
  ],
  "rejected": [
    {
      "option": "Patch bumps",
      "reason": "New exports and changed hook behavior are minor changes under the order's classification."
    }
  ],
  "reopenWhen": "Final review integrates a main whose component versions moved."
}
```

## WO-254-D022 — The evidence editions and one live feedback episode

```json
{
  "id": "WO-254-D022",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 10, the feedback re-mint and the live self-host episode",
  "decision": "Take the editions npm run sync re-minted for this order (authority WO-254/003 after the last source and document edits, artifact-identity WO-254/001, verification WO-254/001) and record one live feedback self-host episode as feedback WO-254/002, which docs/evidence/current.json names. The feedback sources this order changes are only the version bumps in package-lock.json, packages/skeleton/package.json and packages/compiler/src/artifact-identity.ts; no hook source is a feedback source, so the order's premise that the hook changes re-mint the feedback edition is wrong, and sync's re-mint, feedback WO-254/001, carried WO-250's live audit. The order's step 10 asks for one live episode, so the executor ran it rather than standing on the carry.",
  "evidence": [
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS: 66 paths, none of them harness-host.ts, harness-command.ts, harness.ts, codex-continuation.mjs, writer-teardown.mjs or planning-document.mjs; git diff --stat over the three changed feedback sources: 8 insertions, 8 deletions, all version strings and pins.",
    "docs/evidence/WO-254/feedback-001/edition.json: liveAudit.edition docs/evidence/WO-250/feedback-001, carried true.",
    "The episode: DOTLN_LIVE_WORKERS=1 node scripts/harness.mjs bounded -- node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo254-r002 --transport claude-cli-print --model claude-opus-5-5 --effort xhigh, 2026-11-04 17:12:39Z to 17:13:13Z, exit 0, ten fixtures; recorded with --record-selfhost into docs/evidence/WO-254/feedback-002 (liveAudit carried false; audit 36,438 bytes; report 17,555 bytes) and its --check green; the next npm run sync reported feedback-evidence current."
  ],
  "rejected": [
    {
      "option": "Stand on the carried WO-250 audit",
      "reason": "The order's step 10 names one live self-host episode, and the carried audit ran against WO-250's pins, not this order's compiler 0.39.0 and skeleton 0.83.0."
    }
  ],
  "reopenWhen": "A later edit in this order touches a FEEDBACK_SOURCE_PATHS entry, or npm run sync reports feedback-evidence stale."
}
```

## WO-254-D023 — The write-backs go where their readers look, and two standing sentences this order made false are replaced

```json
{
  "id": "WO-254-D023",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 10, the product 07, kit guide and package README write-backs",
  "decision": "State the built behavior once per reader. Product 07: §Operator recovery controls (the admitted commands, the zombie, the releases at a stop, the denied start), §Discipline (the question's two pathways, the blocked turn, and the Codex continuity bullet), §Operator-opened planning pass item 7 (the Rules recorded block beside the operator record it guards) and §Model-specific notes (the restored operator messages and the compactionProbe row). The kit guide has no §Hooks heading and scripts/test-launchpad-export.mjs pins its twelve level-two headings, so the hooks write-back is a level-three Hooks subsection closing §What runs here, and what does not; the Rules recorded block is stated in §Planning in this instance, where an instance's planner reads; and the kit guide links no core record, since an instance does not carry core's evidence. Two standing sentences were false once D007 landed and are replaced: the root instruction's boundaries sentence (HARNESS_BOUNDARIES in packages/compiler/src/harness.ts, emitted into CLAUDE.md) said the compaction adapter never changes writer ownership, and product 07's continuity bullet said it does not acquire or release ownership; both now say it moves only this session's own reservation. A third, older sentence is corrected beside them: packages/skeleton/README.md said a reservation is released only after the compiled completion predicates allow Stop, but the finish hook releases it at every Stop and records whether they were met.",
  "evidence": [
    "grep '^## ' docs/KIT.md: First steps through License, twelve headings, no Hooks; scripts/test-launchpad-export.mjs asserts that exact list and reads the suite table between What runs here, and what does not and Attestations.",
    "grep '](' docs/KIT.md before this change: one link, to #owned-cleanup-and-retention.",
    "packages/skeleton/src/harness-host.ts, the finish branch of runHarnessHook: releaseHarnessWriter(root, input) in a finally, then record(... completionReady: unmet.length === 0 ...).",
    "packages/compiler/src/codex-continuation.mjs: releaseStoppedTurn calls releaseStoppedDispatch, and the prompt event calls reserveCodexDispatchWriter while the dispatch is outstanding (D007).",
    "npm run publication:check, node scripts/docs-check.mjs (0 failures; no advisory names product 07, the kit guide, the skeleton README or this order's decisions) and node scripts/harness.mjs check (42 generated surfaces) are green after the edits, the rebuild and npm run sync."
  ],
  "rejected": [
    {
      "option": "A twelfth level-two Hooks section in the kit guide",
      "reason": "It changes the guide's pinned outline for one topic, whose content sits inside what the existing section already covers."
    },
    {
      "option": "Leave the README's Stop sentence because it predates this order",
      "reason": "The passage was being rewritten for the stopped-dispatch release, and a reader of the corrected passage would meet the false sentence beside it."
    }
  ],
  "reopenWhen": "A reader of the kit guide cannot find the hooks' behavior from its outline, or the finish hook stops releasing at every Stop."
}
```

## WO-254-D024 — Correction: the WO-054 native probe registered no prompt hook, so it is no evidence about prompt delivery

```json
{
  "id": "WO-254-D024",
  "date": "2026-11-04",
  "dispatch": "resume: next; step 10, found while writing §Model-specific notes",
  "decision": "Withdraw one evidence reading of D007: the WO-054 native probe's event sequence lacks UserPromptSubmit because that probe registered no prompt hook, not because Codex withheld the event. D007's guard is unchanged and stands on its own reason: a stopped turn releases its reservation only after this session's prompt hook has been observed, because the prompt hook is what reserves it again. Product 07 §Model-specific notes says that no native run has observed the prompt event's delivery and that a session whose prompt hook never fires keeps its reservation until completion.",
  "evidence": [
    "docs/evidence/WO-054/codex-native-probe.json configuredEvents: SessionStart, PreCompact, PostCompact, Stop, SessionEnd.",
    "D007 evidence, as recorded: 'The WO-054 native probe observed SessionStart, PreCompact, PostCompact, SessionStart(compact), Stop and SessionEnd and no prompt event, so release at a stop waits for an observed prompt hook.'"
  ],
  "rejected": [
    {
      "option": "Edit D007's evidence line in place",
      "reason": "A decision is a record; the correction is its own entry, as D015 is."
    }
  ],
  "reopenWhen": "A native run registers the prompt hook and reports whether Codex delivers it.",
  "kind": "correction",
  "misread": "An event sequence from a probe that registered no prompt hook was read as Codex delivering no prompt event.",
  "meant": "Delivery of the prompt event to project hooks has not been observed natively in this repository, either way.",
  "changed": "No code changes; product 07 §Model-specific notes states the delivery as unobserved, and D025 records the native probe this order attempted."
}
```

## WO-254-D025 — The native prompt-delivery probe was denied by the host and did not run

```json
{
  "id": "WO-254-D025",
  "date": "2026-11-04",
  "dispatch": "resume: next; the operator's direction that live Codex or Claude sessions may be spawned to test hooks and writer reservations",
  "decision": "Do not run a native Codex prompt-delivery probe in this execution. The executor built a scratch repository in session scratch with hooks that recorded each event's name and payload keys, never prompt text, and a codex exec 0.166.0 launcher modeled on WO-054's invocation; the host's auto-mode classifier denied writing the launcher, which carried --dangerously-bypass-hook-trust and a sandbox override, and the executor did not work around the denial. No probe ran, the scratch repository was removed, and prompt delivery stays unobserved (D024). No criterion depends on the probe: criterion 3's Codex turn release and criterion 6's capture and restore are fixture criteria.",
  "evidence": [
    "This session journal: HostPermissionDenied for the Bash call writing the launcher at 2026-11-04T17:27:37.258Z (input digest 9dd07eb9, 730 bytes); the host reported the auto-mode classifier as the denier.",
    "The scratch probe's out directory was empty when removed; nothing was launched."
  ],
  "rejected": [
    {
      "option": "Write the launcher with another tool",
      "reason": "That would route around a host permission decision rather than request it."
    },
    {
      "option": "Run the probe without the hook-trust bypass",
      "reason": "Product 07 records that native hook trust is required, and WO-054's probe trusted its scratch hooks through launch arguments; without that the probe would observe no project hook."
    }
  ],
  "reopenWhen": "The operator approves the probe's launcher through the host's permission flow, or a later order's native qualification registers the prompt hook."
}
```

## WO-254-D026 — Review round 1: three Codex reviewers, thirteen findings, ten distinct, all fixed

```json
{
  "id": "WO-254-D026",
  "date": "2026-11-04",
  "dispatch": "resume: next; the review ladder, with the operator's direction to use Codex for the review agents",
  "decision": "Run round 1 as three Codex workers through npm run worker -- review --host codex (gpt-6.1-sol at max, pinned on the command line, no host readback) over tree bd9a929a against the merge base 1823a9cd, and fix every finding rather than record any. Criteria found 5 (4 blocking, 1 should-fix), design 4 (all should-fix) and consistency 4 (3 blocking, 1 should-fix): 13 findings, 10 distinct once the three reports of the close's retry order and the two of the compaction probe are joined. D027 to D032 record the fixes; D033 records one gap the executor found while the reviewers ran.",
  "evidence": [
    "docs/control/local/reviews/WO-254/round-1-criteria.md (C-F1 to C-F5), round-1-design.md (D-F1 to D-F4) and round-1-consistency.md (K-F1 to K-F4), each saying the checkout was unchanged across its episode; durations 0 h 10 min, 0 h 11 min and 0 h 14 min.",
    "node scripts/harness.mjs usage for this session after the launch: workers launched 3 (codex 3), cap 20, remaining 17."
  ],
  "rejected": [
    {
      "option": "Record the should-fix findings for a later order",
      "reason": "The operator's direction of this execution (D004): fix every related and adjacent defect here."
    }
  ],
  "reopenWhen": "Round 2's rechecks find a fix that does not hold."
}
```

## WO-254-D027 — A Codex close retry holds its writer before it moves main (round 1 C-F1, D-F1, K-F2)

```json
{
  "id": "WO-254-D027",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Reserve the Codex session's writer at the start of a publishing close attempt, before its prerequisites fetch and fast-forward main and before the runtime is prepared, so a retry after a stopped attempt meets a foreign holder's refusal with main untouched. The reservation runs the built runtime as it stands in a short child process (reserveCodexRoleCommandBeforeLoad in scripts/lib/executor-handoff.mjs), because the close loads built modules only after preparing the runtime and an earlier in-process import would pin a stale module for the rest of the close; the in-process reservation after the preparation stays, holding the same reservation or taking it where the checkout had no runtime before. A close run outside the main checkout reserves nothing and is refused by its prerequisites as before. The release suite's WO-239 load trace now names each process's main script and judges the close's own process, since the reservation child also loads built code before the build: an expected-data update whose cause is this fix.",
  "evidence": [
    "scripts/release.mjs before this fix: closePrerequisites (updateMain: fetch and merge --ff-only) and prepareRuntimeBeforeLoad ran before reserveCodexRoleCommand; assertReleaseRuntime's message: 'close entry must prepareRuntimeBeforeLoad before loading built modules'.",
    "scripts/test-release.sh, the new case before the unbuilt-runtime case: a foreign holder's marker, main behind origin; the retry fails naming the foreign reservation, and main's HEAD and the stand-in runtime's SHA-256 are unchanged, with no npm call.",
    "node scripts/harness.mjs bounded -- bash scripts/test-release.sh: exit 0, release tests passed, 0 h 6 min, and its WO-239 check reports childBuildBeforeParentImport true for the close process."
  ],
  "rejected": [
    {
      "option": "Reserve in process before the prerequisites",
      "reason": "It loads the built runtime before the close prepares it, which the WO-239 runtime-loading contract refuses."
    },
    {
      "option": "Keep the writer across a stopped close",
      "reason": "Criterion 3 and D007: a stopped dispatch lets go."
    }
  ],
  "reopenWhen": "A close's prerequisites need the writer released, or the runtime's reservation protocol changes across a fast-forward."
}
```

## WO-254-D028 — Every operator message since the dispatch is restored, and a capture never splits a character (round 1 C-F3, K-F4)

```json
{
  "id": "WO-254-D028",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Restore every captured operator message since the dispatch, oldest first, and keep the restored text within 64 KiB by sharing it: in order of size each message keeps at most an equal share of what is left, so the short ones stay verbatim and only the longest are cut, each cut saying how many of its bytes it kept. D011's newest-first window, which could drop both pause instructions behind two long messages, is replaced. The capture's bound cuts before a character that would not fit whole, so a message cut at 64 KiB never grows past it by a replacement character.",
  "evidence": [
    "The order's step 7 and design: the compact SessionStart restores every message since the dispatch, each message's text bounded.",
    "scripts/test-codex-continuation.mjs 'WO-254 every operator message since the dispatch is restored ...': two pause messages and two 40 KiB messages; both pause messages verbatim, the long ones cut to 32,735 and 32,736 bytes, the text exactly 65,536 bytes; a 65,535-byte ASCII run plus a two-byte character is captured as the ASCII run alone. The suite: 12 of 12 pass."
  ],
  "rejected": [
    {
      "option": "No limit on the restored text",
      "reason": "A session's messages could reach megabytes of context at the moment the model resumes its task."
    },
    {
      "option": "Drop the oldest messages first",
      "reason": "The oldest are the standing instructions the restore exists for."
    }
  ],
  "reopenWhen": "A restored context shows a needed instruction cut, or Codex limits hook context below 64 KiB."
}
```

## WO-254-D029 — The compaction probe names the first reply after the compaction, read from the transcript (round 1 C-F4, K-F3)

```json
{
  "id": "WO-254-D029",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Find the first assistant message after the turn's last compaction in the host's transcript (the Stop input's transcript_path): the first response_item whose payload is an assistant message after the last compacted entry, its output_text parts joined. The probe row records that message's digest, byte count and excerpt with its source (transcript), the item's phase and timestamp. When the transcript cannot be read or holds no such message, the stop's last_assistant_message stands in, labelled source stop-last-message, and a stop with neither records nothing and leaves the probe for a later stop. The adapter's header no longer says it reads no transcript.",
  "evidence": [
    "A local Codex rollout of 2026-11-03, read for its entry types, keys and timestamps only, never its text: a compacted entry at 05:52:13Z, the first assistant message after it at 05:52:28Z with phase commentary, and task_complete with its own last message at 06:05:30Z, 0 h 13 min later; assistant content parts are output_text.",
    "docs/evidence/WO-054/codex-native-probe.json: the Stop input carries transcript_path and last_assistant_message.",
    "scripts/test-codex-continuation.mjs: a transcript with a reply before the compaction, then the first reply, a function call and a final reply; the probe names the first (source transcript, phase commentary), and without a transcript it names the stop's message as stop-last-message."
  ],
  "rejected": [
    {
      "option": "Keep the stop's last message",
      "reason": "In a turn with tool work it is the final reply, not the first after the compaction that criterion 6 names."
    }
  ],
  "reopenWhen": "Codex changes its transcript's compacted or message entries, or the probe's source is stop-last-message where a transcript existed."
}
```

## WO-254-D030 — The prompt hook's capture cannot cost the writer, and a repair's messages are in the repair phase (round 1 D-F2, D-F4)

```json
{
  "id": "WO-254-D030",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Give each step of the Codex prompt hook its own failure: the session read, the journal row, the text capture and the reservation, so an unwritable capture lane still lets an outstanding dispatch reserve its writer, and an unreadable session still never withholds the prompt. Name the journal row's phase with one shared resolver, harnessSessionPhase in packages/compiler/src/harness.ts (resume: fix is repair; otherwise the role's phase), which harness-host.ts's observationPhase calls and the generated Codex hook embeds beside the classifier, so the two journal writers cannot drift.",
  "evidence": [
    "harness-host.ts observationPhase before this fix: intent resume: fix maps to repair; the Codex hook mapped executor to implementation always.",
    "scripts/test-codex-continuation.mjs 'WO-254 a repair session's message ...': the capture lane is a directory, the row's phase is repair, and the stub runtime's reservation is called once with the session."
  ],
  "rejected": [
    {
      "option": "Copy the repair rule into the Codex hook",
      "reason": "Two copies of one mapping is the drift the finding names."
    }
  ],
  "reopenWhen": "A third journal writer names a phase, or the lifecycle adds a phase."
}
```

## WO-254-D031 — A denied start undoes itself for a registered target too, sees the bootstrap's denial, and its undo never hides the denial (round 1 C-F2, C-F5, D-F3)

```json
{
  "id": "WO-254-D031",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Three changes to scripts/worktree.mjs. (1) A registered-target start records each worktree and branch it creates; on a host denial it removes those, puts back the records it carried out of main, unregisters a target worktree it registered and records the denial, and a fresh start it fully undid forgets its pending record, while a retry keeps what an earlier attempt made. (2) Both starts run the bootstrap through one helper that passes its standard error through and keeps it, so a permission diagnostic or a spawn the host refuses reaches the denial judgment. (3) The undo attempts each step alone and returns what it could not do; those are named in the refusal and the record beside the original denial, and a worktree is kept when a record it carried could not be put back. The literal host rules a target start writes last are left to their existing remedies (release close and worktree host-rules).",
  "evidence": [
    "scripts/test-target-worktree-start.mjs 'WO-254 a target start the host denies ...': a bootstrap that reports EACCES; neither worktree nor branch remains in main or the clone, no pending start or registry entry remains, the record lists both worktrees removed with no failures, and the same start then succeeds.",
    "scripts/test-worktree.sh: the WO-091 case is unchanged and a WO-092 case whose bootstrap reports EACCES on standard error leaves no worktree or branch; node scripts/harness.mjs bounded -- bash scripts/test-worktree.sh exit 0.",
    "The existing 'preparation retry resumes the recorded pair after bootstrap or harness failure' still passes: a failure that is not a denial keeps the pair for retry."
  ],
  "rejected": [
    {
      "option": "Undo a retry's earlier resources too",
      "reason": "Work done in a preserved pair after an interruption would be lost."
    }
  ],
  "reopenWhen": "A target start is denied while writing its literal host rules, or a denial's undo leaves a resource it named removed."
}
```

## WO-254-D032 — The role oracle's startup pins include the root instruction's 166 bytes (round 1 K-F1)

```json
{
  "id": "WO-254-D032",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 1",
  "decision": "Update the WO-254 role oracle's startup pins for the root instruction sentence D023 replaced, which grew CLAUDE.md by 166 bytes and so every role's cold start by the same: executor 43,604, planner 29,284, refuter 27,155, release-close 28,233, reviewer 40,656, router 16,984 and verifier 38,233, growth 1,206 bytes per root and 948 for the router. D013 stays the growth decision its follow-up names; FUP-f86af3151b401757 still boards every root over its ceiling, and no ceiling is raised and no acceptance recorded. The oracle's role-tree hashes are unchanged, since no skill changed.",
  "evidence": [
    "CLAUDE.md 7,240 bytes; each role's installed skill plus CLAUDE.md under .claude/skills and .agents/skills, measured on the synced tree; scripts/test-gate-followups.mjs compares those totals with the oracle exactly."
  ],
  "rejected": [
    {
      "option": "Shorten the boundaries sentence to the old length",
      "reason": "The old sentence was false (D023); product 07 §Discipline cuts no needed rule to fit."
    }
  ],
  "reopenWhen": "CLAUDE.md or a role root changes again in this order."
}
```

## WO-254-D033 — Criterion 5's passing plan check is proven, not only the rules check

```json
{
  "id": "WO-254-D033",
  "date": "2026-11-04",
  "dispatch": "resume: next; found by the executor while round 1 ran",
  "decision": "Extend the plan-refutation fixture: after the direction rule with a matching digest, commit the pass and write its direct receipt, then require npm run plan -- check to pass and checkPlanGate to return rulesRecorded {document, rules: 1} with one judged pass. Before this, the fixture proved only checkRulesRecorded passing and plan check stopping at its missing receipt, past the rules.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'WO-254 plan check' scripts/test-plan-refutation.mjs: 1 of 1 pass."
  ],
  "rejected": [],
  "reopenWhen": "plan check's receipt requirements change."
}
```

## WO-254-D034 — Correction: two process-debt fixtures planted a process table without the state column D005 added

```json
{
  "id": "WO-254-D034",
  "date": "2026-11-04",
  "dispatch": "resume: next; found running the process-debt suite before review round 2",
  "decision": "Plant the state column in the two process-debt fixtures that stand in for ps: their rows printed pid, ppid, start time and command, the columns before D005, so the parser that now reads pid, ppid, state, start time and command matched no row and version discovery fell back to PATH. The rows now carry a state (S); every assertion is unchanged. This is an expected-data update whose cause is D005's column.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test scripts/test-process-debt.mjs before the fix: 181 pass, 2 fail, 'discovery uses a bounded observed probe and session warns once off the version line' and 'ancestor text mapping resolves an opaque process name once per session', each observing channel PATH where ancestor-executable was expected.",
    "After the fix both pass (2 of 2 under --test-name-pattern); a search of the tests for planted process tables finds only these two, while the zombie fixture of scripts/test-harness.mjs reads the real ps."
  ],
  "rejected": [
    {
      "option": "Let the parser accept a row without a state",
      "reason": "The harness always asks ps for the state; a tolerant parser would accept a row the real command never prints."
    }
  ],
  "reopenWhen": "Another planted process table is found, or the process-table columns change again.",
  "kind": "correction",
  "misread": "D005 was judged by the harness suite's zombie cases; the process-debt suite, whose fixtures emulate ps, was not run after the column was added.",
  "meant": "Every reader of the process table, and every fixture that plants one, uses the columns the harness asks for.",
  "changed": "The two planted rows in scripts/test-process-debt.mjs carry a state column, with a comment naming the columns."
}
```

## WO-254-D035 — Correction: the harness suite found a starting revision read that fails before a first commit, and two tests of the advisory D012 silenced

```json
{
  "id": "WO-254-D035",
  "date": "2026-11-04",
  "dispatch": "resume: next; running the harness suite before review round 2",
  "decision": "Two fixes. (1) D014's Codex dispatch record reads the starting revision with the strict Git helper, which throws 'Git host observation unavailable' in a repository with no commit; it now reads HEAD with --verify --quiet and records no starting revision when there is none, as the session type already allows. (2) WO-132's delegated-advisory test and WO-142 repair B1's one-advisory-across-hook-kinds test asserted that the shell classifications D012 made journal-only are shown: WO-132's helper now expects those three to show no message and journal shown false, and B1 judges its de-duplication on a here-string, whose classification is still shown, keeping the test's intent. Both test changes are expected-data updates whose cause is D012.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test scripts/test-harness.mjs before: 343 tests, 335 pass, 8 fail; four Codex dispatch cases threw 'Git host observation unavailable' from recordCodexDispatch, and the WO-132 and WO-142 B1 cases met an absent systemMessage.",
    "After the fixes those six pass (6 of 6 under --test-name-pattern).",
    "The other two failures, the WO-171 lane cases, retain the fixture root itself with 'writer reservation names this root or session': createFixtureRoot records this worktree as the root's repository and this session holds this worktree's writer (writer --show: actor 5c6e66f4, alive). They fail the same way in an environment without session variables and a fresh TMPDIR, and no prune source changed in this order (git diff --stat over temporary-prune.mjs, harness-prune.mjs and temporary-roots.mjs is empty; temporary-root-records.mjs only extracts its control-directory lookup). The complete gate judges them in the runner's own context."
  ],
  "rejected": [
    {
      "option": "Delete the two older advisory tests",
      "reason": "Their subjects, delegation and de-duplication across hook kinds, still hold for every advisory that is shown."
    }
  ],
  "reopenWhen": "The complete gate fails a WO-171 lane case, or another reader of HEAD in the dispatch path meets a repository without a commit.",
  "kind": "correction",
  "misread": "D014's revision read was judged by the dispatch fixtures run then, all of which had commits, and D012 was judged by its own new test without the suite's older advisory tests.",
  "meant": "A dispatch record is written in any checkout the hook runs in, and every test of a shown advisory names one that is still shown.",
  "changed": "recordCodexDispatch reads HEAD leniently; scripts/test-harness.mjs's WO-132 helper and WO-142 B1 case are updated."
}
```

## WO-254-D036 — Correction: the feature inventory's test pinned the spawn cap's old root

```json
{
  "id": "WO-254-D036",
  "date": "2026-11-04",
  "dispatch": "resume: next; running the launchpad suite before review round 2",
  "decision": "Update the feature inventory case of scripts/test-features.mjs to the behavior D019 made: with roots.control set to records/control and that root's budgets naming subagentCap 5, the cap row's source is records/control/budgets.json and its value 5, and the driven-session ceiling stays 20, four times the cap. The case had pinned the defect FUP-a0efaae1b9887fde names, a cap read from docs/control whatever the configured root, as source default and value 20. This is an expected-data update whose cause is D019.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test scripts/test-launchpad-export.mjs: the exported instance's configuration-root check failed this case (expected 'default', actual 'records/control/budgets.json'); node --test scripts/test-configuration-root.mjs here: 30 pass, 1 fail, the same case.",
    "After the update scripts/test-configuration-root.mjs passes 31 of 31."
  ],
  "rejected": [
    {
      "option": "Keep the inventory reporting the default for a configured root",
      "reason": "The inventory would then name a cap the spawn guard does not apply."
    }
  ],
  "reopenWhen": "The cap's reader or the configured roots change.",
  "kind": "correction",
  "misread": "D019 was judged by the spawn-cap and feature-reader tests; the inventory case in test-features.mjs, run by the configuration-root structural check, was not run.",
  "meant": "Every reader and test of the cap uses the configured control root.",
  "changed": "scripts/test-features.mjs's inventory case expects the configured file and its value."
}
```

## WO-254-D037 — Correction: the harness suite reads the license script its stopped-close case copies, so the suite declares it

```json
{
  "id": "WO-254-D037",
  "date": "2026-11-04",
  "dispatch": "resume: next; running the launchpad suite before review round 2",
  "decision": "Declare scripts/license-surfaces.mjs among the harness-fixtures suite's machinery sources in scripts/test-runner.mjs: the WO-139 stopped-close case this order added copies it beside scripts/release.mjs into its fixture, and the declarations structural check refuses a suite that reads an undeclared source, so every gate's structural phase would have failed.",
  "evidence": [
    "node scripts/structural-checks.mjs declarations before: 'Missing machinerySources declaration: harness-fixtures: scripts/license-surfaces.mjs', also reported by the exported instance in scripts/test-launchpad-export.mjs; after: exit 0, with the generated check (no stale artifact) and node scripts/check-registrations.mjs green.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-launchpad-export.mjs after the fix: 32 of 32 pass."
  ],
  "rejected": [],
  "reopenWhen": "The stopped-close case copies another script.",
  "kind": "correction",
  "misread": "The new case's copied inputs were judged by the case passing, not by the suite's declared sources.",
  "meant": "A suite declares every first-party script its cases read or copy.",
  "changed": "scripts/test-runner.mjs declares the license script for harness-fixtures."
}
```

## WO-254-D038 — Review round 2: three Codex rechecks, seven findings, five distinct, all fixed

```json
{
  "id": "WO-254-D038",
  "date": "2026-11-04",
  "dispatch": "resume: next; the review ladder's round 2",
  "decision": "Run round 2 as each round-1 reviewer's recheck through npm run worker -- review --host codex --round 2 --recheck, over tree ee9724dc since round 1's bd9a929a, and fix every finding. Criteria found 4 (3 blocking, 1 should-fix), design 2 (should-fix) and consistency 1 (blocking): 7 findings, 5 distinct once the three reports of the close retry without a runtime are joined, and design's report added one handoff note on the denied start's message, also fixed. Held from round 1: criteria F4; design F2 and F4; consistency F1, F3 and F4. D039 to D041 record the fixes; since they change code, round 3 is one combined worker over the delta.",
  "evidence": [
    "docs/control/local/reviews/WO-254/round-2-criteria.md, round-2-design.md and round-2-consistency.md, each 0 h 5 min with the checkout unchanged across its episode.",
    "Each worker's focused test could not start inside the Codex sandbox (getconf DARWIN_USER_TEMP_DIR returned an I/O error), so their judgments are by source; the executor ran the suites (D039 to D041)."
  ],
  "rejected": [],
  "reopenWhen": "Round 3 finds a round-2 fix that does not hold."
}
```

## WO-254-D039 — A close retry with no runtime that can reserve judges the reservation files before main moves (round 2 C-F1, D-F1, K-F1)

```json
{
  "id": "WO-254-D039",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 2",
  "decision": "When main has no built runtime, or its runtime cannot load or has no reserveCodexDispatchWriter, the early reservation of a Codex publishing close reads the writer lane itself: no reservation, or only this session's (the actor id is the SHA-256 of the session), lets the close go on to prepare the runtime and reserve with it; any other reservation, or one that cannot be read, refuses before the prerequisites fetch, fast-forward or build, naming the build command and writer --show. The release fixture's stand-in writer marker gains the actor id a real reservation carries, so the existing unbuilt-runtime case still reads as this session's own.",
  "evidence": [
    "scripts/test-release.sh: a new case after the foreign-holder case removes the stand-in runtime and plants a foreign reservation with its actor id; the retry is refused with main's HEAD unchanged, no runtime built and no npm call. The suite's run is in D042."
  ],
  "rejected": [
    {
      "option": "Refuse every close whose runtime is missing",
      "reason": "A close prepares a missing runtime after its fast-forward by design; refusing would break a checkout that simply has not built yet."
    }
  ],
  "reopenWhen": "The reservation's file format changes, or a close needs to move main while another session's reservation stands."
}
```

## WO-254-D040 — A refused activation spawn and a bootstrap's standard output reach the denial judgment; the undo's own log path cannot hide the denial (round 2 C-F2, C-F4, D-F2)

```json
{
  "id": "WO-254-D040",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 2",
  "decision": "Both starts throw one childFailure for a child that failed: the spawn error's code and message first, then the tails of its standard error and standard output, so a host that refuses the activation's spawn (status null, no output) is classed as a denial instead of raising a TypeError. The bootstrap now runs with both streams piped, written through to the operator as they arrive and their last 4,000 characters kept for that message. The undo resolves its log path inside its guarded step, and a worktree kept because its carried record could not be put back is named as kept, with the order to move the record back before removing it, rather than as a removal that failed.",
  "evidence": [
    "scripts/test-target-worktree-start.mjs: three variants of 'WO-254 a target start the host denies ...', a bootstrap reporting EACCES on standard error, the same on standard output, and an activation whose spawnSync the host refuses (a preload returning status null and error EACCES); each leaves no worktree, branch, pending start or registry entry and records the denial; 4 of 4 with the retry case.",
    "scripts/test-worktree.sh's WO-091 and WO-092 cases still pass on the shared helpers (D042)."
  ],
  "rejected": [
    {
      "option": "Buffer the bootstrap's whole output",
      "reason": "A bootstrap that installs and builds runs for minutes; the operator would see nothing until it ended."
    }
  ],
  "reopenWhen": "A start is denied in a step outside these children, or a bootstrap's diagnostic falls outside the kept tails."
}
```

## WO-254-D041 — Every captured message is restored verbatim, with no cut across messages (round 2 C-F3)

```json
{
  "id": "WO-254-D041",
  "date": "2026-11-04",
  "dispatch": "resume: next; round 2",
  "decision": "Restore every operator message since the dispatch whole, oldest first, each bounded once, at 64 KiB when it was captured. D028's shared 64 KiB is withdrawn: with enough messages, or two long ones whose instructions sit in their tails, any shared budget cut a captured instruction, which criterion 6 and the order's design (restore every message) do not allow. The cost is a compact context that grows with what the operator said in the dispatch.",
  "evidence": [
    "scripts/test-codex-continuation.mjs 'WO-254 every operator message since the dispatch is restored verbatim, however many and however long ...': two pause messages, two 40 KiB messages whose instructions end them and 200 short messages are all restored whole, oldest first, with no cut; 12 of 12 pass."
  ],
  "rejected": [
    {
      "option": "Keep a shared budget and cut the longest first",
      "reason": "Round 2's counterexamples: 4,096 messages share 16 bytes each, and instruction tails past half of 64 KiB are cut."
    }
  ],
  "reopenWhen": "Codex refuses or truncates a large hook context, or a session's restore is shown to crowd out its task."
}
```

## WO-254-D042 — The suites that judge round 2's fixes, run before round 3

```json
{
  "id": "WO-254-D042",
  "date": "2026-11-04",
  "dispatch": "resume: next; after round 2's fixes",
  "decision": "Run, each under the bounded wrapper and one at a time, the suites whose subjects round 2's fixes changed, before round 3 and the complete run: all green.",
  "evidence": [
    "node --test scripts/test-codex-continuation.mjs: 12 of 12; node --test --test-name-pattern 'WO-254 a target start|preparation retry resumes' scripts/test-target-worktree-start.mjs: 4 of 4.",
    "bash scripts/test-worktree.sh: worktree tests passed, 0 h 1 min; bash scripts/test-release.sh: release tests passed, with the runtime-free foreign-holder case.",
    "Before round 2 the executor also ran, after the round-1 fixes, scripts/test-harness.mjs (335 of 343, the eight failures resolved by D035 or attributed there to this session's live writer), scripts/test-drive.mjs, scripts/test-process-debt.mjs (after D034), scripts/test-plan-refutation.mjs (140 of 140), scripts/test-target-worktree-start.mjs (31 of 31), scripts/test-launchpad-export.mjs (32 of 32 after D036 and D037), bash scripts/test-resume.sh (with its control-segments cases) and the skeleton (619) and compiler (157) package tests."
  ],
  "rejected": [],
  "reopenWhen": "The complete run fails a suite named here."
}
```

## WO-254-D043 — Review round 3: one combined worker, one finding fixed; both runtime-free writer checks read the runtime's own lane, and the ladder ends

```json
{
  "id": "WO-254-D043",
  "date": "2026-11-04",
  "dispatch": "resume: next; the review ladder's round 3",
  "decision": "Run round 3 as one combined Codex worker over the delta since round 2's tree (ee9724dc to b4c6a68e), since round 2's fixes changed code. It found one blocking defect: with relocated document roots, D039's runtime-free check read the configured control root's lane, while the installed harness reserves in its fixed physical lane (dispatchJournalDirectory, docs/control/local/harness) whatever the roots, so a foreign reservation could be missed and main moved. Both runtime-free readers in scripts/lib/executor-handoff.mjs now resolve that lane through the shared build-free resolver: the close's check and, adjacent, executorWriterRelease's missing-runtime check, which had the same mismatch before this order. After round 3 no reviewer runs: the executor judged this fix with its tests, and the handoff's self-review line counts its lines as unreviewed.",
  "evidence": [
    "docs/control/local/reviews/WO-254/round-3-combined.md: 0 h 9 min, 1 finding (blocking), the checkout unchanged across the episode.",
    "packages/skeleton/src/dispatch-journal.mjs: dispatchJournalDirectory(root) is join(root, 'docs/control/local/harness'); harness-host.ts harnessStateDirectory returns it outside a target context.",
    "scripts/test-harness.mjs 'WO-254 a close with no runtime that can reserve judges the runtime's own writer lane, whatever the configured roots, in both reservation layouts': with roots.control relocated, a foreign reservation in the writer directory or in writer.json refuses, this session's own admits, and a reservation planted in the configured lane decides nothing; with the WO-139 lifecycle case, 2 of 2. The resume and release suites: D044."
  ],
  "rejected": [
    {
      "option": "Resolve the lane from the configured roots in the runtime too",
      "reason": "The physical lane is the installed harness's contract until its loader migrates; changing it is not this order's scope."
    }
  ],
  "reopenWhen": "The harness lane moves with the configured roots."
}
```

## WO-254-D044 — The suites that judge round 3's fix, run before the complete run

```json
{
  "id": "WO-254-D044",
  "date": "2026-11-04",
  "dispatch": "resume: next; after round 3's fix",
  "decision": "Run, under the bounded wrapper and one at a time, the suites that read scripts/lib/executor-handoff.mjs, the resume suite for the completions' release and the release suite for the close, beside the new lane case: all green. The ladder is finished; the complete run follows.",
  "evidence": [
    "bash scripts/test-resume.sh: resume tests passed, 0 h 2 min; bash scripts/test-release.sh: release tests passed.",
    "node --test --test-name-pattern 'WO-254 a close with no runtime that can reserve|WO-139 Codex executor and fix completion' scripts/test-harness.mjs: 2 of 2; node scripts/structural-checks.mjs declarations: exit 0."
  ],
  "rejected": [],
  "reopenWhen": "The complete run fails a suite named here."
}
```

## WO-254-D045 — Operator direction: the next planning pass points the front page's Try it section at the public starter

```json
{
  "id": "WO-254-D045",
  "date": "2026-11-04",
  "dispatch": "resume: next; the operator's mid-turn direction during this execution's first complete run",
  "decision": "Board a follow-up the operator directed the next planning pass to take up, outside this order's scope: the repository front page's Try it section links to the public starter, https://github.com/DylanBWood/DotLn-Enterprise-Starter, and recommends one of two routes to start from it, a public fork of the starter, or a private clone that keeps the starter as its upstream remote, the route the kit guide's First steps gives. This execution does not edit README.md: the front page is not in WO-254's scope, the direction names the planning pass as its home, and the complete run was live when it arrived.",
  "evidence": [
    "README.md §Try it: two commands (npm install, npm run skeleton) that run the skeleton proof in a checkout of core, with no link to the starter.",
    "docs/siblings/README.md §DotLn-Enterprise-Starter: public under core's license files, anyone may fork it, and it holds no orders of its own.",
    "docs/KIT.md §First steps: a private repository starts from the starter by a clone with no tags whose origin is renamed upstream, with remote.upstream.tagOpt --no-tags, for §Taking upstream updates."
  ],
  "rejected": [
    {
      "option": "Edit README.md in this order",
      "reason": "The operator asked for a follow-up for the next planning pass, and the front page is outside WO-254's scope."
    }
  ],
  "followup": "Point the front page's Try it section (README.md) at the public starter, https://github.com/DylanBWood/DotLn-Enterprise-Starter, and recommend one of two routes to start from it: a public fork of the starter, or a private clone that keeps the starter as its upstream remote, as the kit guide's First steps describes. Operator direction of 2026-11-04 for the next planning pass.",
  "reopenWhen": "The next planning pass, which the operator named to take this up."
}
```

## WO-254-D046 — Correction: the first complete run failed on the copied control plane's build-free set, which the zombie judgment's import grew

```json
{
  "id": "WO-254-D046",
  "date": "2026-11-04",
  "dispatch": "resume: next; the first complete run",
  "decision": "Repair the one suite the first complete run failed: WO-070's portable control-plane case pins the exact build-free skeleton modules a copied control plane needs, and D005's import of writer-teardown.mjs into scripts/lib/off-ramps.mjs added one, so the copied plane could not load off-ramps. The pinned list gains writer-teardown.mjs, an expected-data update whose cause is D005; that module imports only Node built-ins and temporary-root-records.mjs, already listed. The run's other 28 failed rows ran nothing: after the first failure the runner cancelled the release suite's remaining cases and never started 27 suites. Before a fresh complete run the executor probes every suite the run did not reach (D047), and the repair's diff goes through the ladder's round 3, as a repair under fifty changed source lines starts there.",
  "evidence": [
    "npm test -- --review, started 2026-11-04T19:36:04Z, recorded 19:48:29Z, code identity 564b2702, tree 147506a4: 16 passed, 29 failed, 0 h 12 min; failedFirst beacon-portability; executed failures beacon-portability and release, the release suite's twelve failed cases all unexecuted; 27 suites unrun. harness-fixtures passed in the run, its WO-171 lane cases included (D035).",
    "The failure: ERR_MODULE_NOT_FOUND for packages/skeleton/src/writer-teardown.mjs imported from scripts/lib/off-ramps.mjs in the copied control plane of scripts/test-beacon-portability.mjs.",
    "After the fix: node scripts/harness.mjs bounded -- node --test scripts/test-beacon-portability.mjs, 2 of 2.",
    "The background task that ran the gate reported exit 0 because of the echo after it; the result was read from the gate's summary line and its recorded row, as WO-253's handoff warns."
  ],
  "rejected": [
    {
      "option": "Copy the whole skeleton source tree into the portable fixture",
      "reason": "The case exists to prove that the control plane needs only its build-free modules; the pinned list is that proof."
    }
  ],
  "reopenWhen": "The control plane imports another build-free skeleton module.",
  "kind": "correction",
  "misread": "D005 judged the new import by the suites that exercise the zombie judgment; the portability case, which pins the control plane's build-free imports, was not among the suites run before the complete run.",
  "meant": "A new import into the control plane's scripts changes the portable set that WO-070 pins.",
  "changed": "scripts/test-beacon-portability.mjs lists writer-teardown.mjs among the build-free modules."
}
```

## WO-254-D047 — The suites the first complete run never reached, probed before a fresh run; three expected-data updates and the operator record's seed migration

```json
{
  "id": "WO-254-D047",
  "date": "2026-11-04",
  "dispatch": "resume: next; after the first complete run",
  "decision": "Probe, one at a time under the bounded wrapper, every suite the failed run never reached, since each further complete-run failure costs a repair round and another run. Three expected-data updates follow, each caused by this order: scripts/fixtures/launchpad-cases.json gains the WO-254 export case and scripts/fixtures/target-worktree-cases.json the target-start denial declaration and its three registered names, the baselines that keep declared cases from disappearing silently; and scripts/test-launchpad-planning.mjs's refreshed-starter case expects AI-HARNESS-SECURITY.md among the rewritten seeds. That last is a seed migration for the final review's Read before upgrading: the operator-record template gained the sentence on standing rules (D010), so a new export carries it, a starter refresh rewrites a starter's unedited copy once and refuses a customized one by path as for any changed template, and an existing fork keeps its own operator record, which an ordinary kit update never rewrites. The Rules recorded check itself reaches a fork with its kit update, whatever its record says. The launchpad suite's WO-226 case also confines npm run build advice to the scripts that give it in the kit-aware form, so D039's refusal now names node scripts/bootstrap.mjs, which release.mjs already gives as the way to prepare a runtime.",
  "evidence": [
    "scripts/test-runner.test.mjs 'launchpad files retain all 37 cases ...' (41 against 40) and 'target-worktree file tasks keep all declared cases ...' (86 against 85); scripts/test-launchpad-planning.mjs 'an instance exported at v0.81.0 takes this release ...': the rewritten seeds' list gains AI-HARNESS-SECURITY.md.",
    "Product 07 §Release: a custom edit of a changed template refuses by path before any push, and ordinary instance kit updates preserve seed ownership.",
    "Each under the bounded wrapper, every one with no failure: launchpad-planning 5, runner-fixtures 189, launchpad (its three files) 55 and the new lane case 1 after the updates; before them target-worktree 119, target-publish 61, workstream-pilot 4, instance-history 1, worktree-integration 49, work-orders-fixtures 35, siblings-fixtures 17, adjacent-queue 8, derived-orders 15, portfolio 3, authority-grants 6, fixture-temp-root (its shell suite), harness-probe 16, sync-fixtures 10, process-debt 183, kernel 104, compiler 157, skeleton 619, console 29, browser-evidence 20 and vertical 226."
  ],
  "rejected": [
    {
      "option": "Put the rules sentence somewhere other than the seed to avoid the migration",
      "reason": "The order's step 6 and criterion 5 name the emitted instance operator-record template."
    }
  ],
  "reopenWhen": "A fork reports that its operator record lacks the sentence and needs it, or a starter's refresh refuses on this seed."
}
```

## WO-254-D048 — The repair's review, the passing complete run and the shell advisories before and after

```json
{
  "id": "WO-254-D048",
  "date": "2026-11-04",
  "dispatch": "resume: next; after the first complete run's repair",
  "decision": "Take the repair through the ladder: a repair under fifty changed source lines starts at round 3, so one combined Codex worker reviewed the delta since round 3's tree b4c6a68e, which also covers round 3's own fix, and found nothing. The fresh complete run then passed at the tree that worker reviewed. The advisories the order asks to measure moved as D012 intended: the three shell classifications stopped reaching the agent's context once the rebuilt hooks took effect, and each stays a journal row.",
  "evidence": [
    "docs/control/local/reviews/WO-254/repair-1/round-3-combined.md: tree e0469b4c against b4c6a68e, 0 h 7 min, no findings, the checkout unchanged. A first launch named the failed run's gate tree hash, which is no Git object, and was refused before any worker started; the hook still counted it, so usage reads workers launched 9, all Codex.",
    "npm test -- --review, recorded 2026-11-04T21:57:59Z: exit 0, code identity 5842e21b, tree e0469b4c, 45 passed, 0 failed, 119 fresh tasks, 0 h 42 min with 0 h 9 min waiting for host lanes; gate cleanup 2,280 roots removed, 0 retained, 0 blockers.",
    "Counts from this session's journal and WO-253's retained journal, one row per hooked call. Before the rebuilt hooks took effect (to 17:01Z): 1,008 calls, shown 14 control syntax, 50 dynamic substitution and 0 working-directory, none journal-only. After, through the passing complete run's end (to 21:58Z): 1,096 calls, none shown, journal-only 9, 41 and 1. For scale, WO-253's first executor session through its three complete runs: 3,598 calls, shown 39, 39 and 3."
  ],
  "rejected": [
    {
      "option": "Count only the calls made while a gate was live",
      "reason": "A session writes nothing and runs almost nothing during a gate, so that window holds too few calls to compare; a span through a gate's end compares like with like."
    }
  ],
  "reopenWhen": "An advisory journaled with shown false is found to have been needed in the agent's context, or the classification list changes."
}
```

## WO-254-D049 — Verification: the stop samples the latest compaction; broader diagnostic history is a follow-up

```json
{
  "id": "WO-254-D049",
  "date": "2026-11-04",
  "dispatch": "resume: verify; the operator's mid-turn observation about the compaction sample",
  "decision": "Judge criterion 6 met on its stated capture, restoration and first-reply fixture, and record the broader diagnostic-history observation as a nonblocking follow-up. An independent source probe and the emitted hook both restore the operator message after two compactions in one turn, then journal only the first reply after the latest compaction at Stop. The earlier sample is not retained. The criterion's stated case passes and main had no such probe, so the observation establishes neither an unmet original criterion nor a regression. The operator remarked that the observed behavior was understandable; that remark is not a waiver, a scope amendment or a standing rule. Keep the implementation unchanged in this read-only phase, consume the passing complete review row at the unchanged code identity, and run the document gate after the verification records are complete.",
  "evidence": [
    "docs/evidence/WO-254/ver-001-evidence.md and ver-001-probes.mjs: source and generated-entry experiments each restored the message at both compact SessionStart events but returned one diagnostic sample, First reply after compaction 2. Their exit 1 records the experimental expectation of two samples, not an acceptance-gate failure.",
    "Criterion 6 requires the two specified operator messages to be captured and restored after a PostCompact and the probe to name the first assistant message after the compaction; the four WO-254 cases in scripts/test-codex-continuation.mjs passed independently. Step 7's broader each-compaction wording and the guide's description suggested stronger diagnostic coverage than that explicit case.",
    "packages/compiler/src/codex-continuation.mjs: PostCompact replaces the saved compaction; firstReplyAfterCompaction starts after the transcript's last compacted entry; probeCompactedTurn runs on Stop. The generated .codex/hooks/continuation.mjs reproduces the same result.",
    "The complete review row recorded at 2026-11-04T21:57:59.290Z stands at code identity 5842e21bfd71c80a4efc4c78aef3d6a6873793d8b4dd906a3d9c271b7145fe3e; the verifier read the identity and row directly before authoring its report."
  ],
  "rejected": [
    {
      "option": "Fail criterion 6 for not retaining a separate sample from every compaction within one turn",
      "reason": "That would promote the experiment's broader expectation into an additional acceptance condition even though the specified fixture passes and no main behavior regressed. The original requirement to restore messages remains judged and met."
    },
    {
      "option": "Change the implementation or its acceptance tests during verification",
      "reason": "The verifier is read-only toward its subject; diagnostic wording or broader history belongs to the recorded follow-up."
    }
  ],
  "followup": "Clarify the compaction-probe documentation in product 07 and the kit guide: a Stop samples the first assistant reply after the latest compaction before that Stop. If separate diagnostic samples for earlier compactions in the same turn are later needed, retain and test them explicitly; reproduce with docs/evidence/WO-254/ver-001-probes.mjs --generated. Instruction restoration already succeeds at both compactions.",
  "reopenWhen": "The stated criterion-6 fixture fails, a captured instruction is lost, or a later requirement explicitly needs a separate diagnostic sample for every compaction before Stop.",
  "kind": "correction",
  "misread": "The verifier treated the execution plan's each-compaction wording as an additional blocking acceptance condition and described its experiment's missing earlier diagnostic sample as a gap before separating it from message restoration.",
  "meant": "The experiment preserved instructions at both compactions and exposed only the diagnostic sampler's latest-compaction scope; the original acceptance criterion's stated case passes.",
  "changed": "The report records the observation once as follow-up F1, with criterion 6 met; the failed experimental expectation and both reproductions are preserved, and no waiver or implementation edit was made."
}
```

## WO-254-D050 — Final review: the probe wording says which compaction a Stop samples

```json
{
  "id": "WO-254-D050",
  "date": "2026-11-04",
  "dispatch": "resume: final review; VER-001's finding F1 (D049)",
  "decision": "Correct the two guide passages that described a compaction-probe sample per compaction. Product 07 §Model-specific notes and the kit guide's §Hooks now say that the first Stop after a compaction journals one compactionProbe row against the task the latest compaction before that stop saved, naming the first assistant message after that compaction, and that an earlier compaction in the same turn has no separate sample, because each PostCompact replaces the saved record. No implementation, test or acceptance criterion changes: criterion 6's fixture restores both operator messages and probes the first reply after the compaction, and retaining a sample per compaction is unrequested. The finding is listed once in FINAL-001 as F1, route follow-up, class escape, and fixed; its register row FUP-fea8efc4a8e84a8f is settled.",
  "evidence": [
    "packages/compiler/src/codex-continuation.mjs: PostCompact saves {version, signature, turnId, sessionKey, task, compactedAt} over the one codex-continuation.json record, and probeCompactedTurn probes once per (turnId, compactedAt) through a wx marker, so a Stop after two compactions in one turn samples the latest.",
    "docs/evidence/WO-254/ver-001-probes.mjs --generated, rerun under the bounded wrapper by this review: the operator message is restored at both compact SessionStart events and one sample, First reply after compaction 2, is journaled; the probe exits 1 on its own two-sample expectation, as VER-001's evidence records.",
    "Before this change product 07 said 'The first Stop after each compaction journals one compactionProbe row ... naming the first assistant message after the compaction' and the kit guide 'The first stop after each compaction journals a compactionProbe row naming the first assistant message after it'; npm run publication:check is green after the edit."
  ],
  "rejected": [
    {
      "option": "Retain and test a sample for every compaction before a Stop",
      "reason": "No criterion or operator direction asks for it; the message restoration criterion 6 names succeeds at both compactions, and a source change after the passing complete run would owe a new complete run for a diagnostic nobody has asked to read."
    },
    {
      "option": "Leave the wording for the next planning pass",
      "reason": "Product 07 and the kit guide are this order's declared write-back surfaces; a wording defect in them is repaired in the order through Adjacent Repair, and the document gate judges the edit."
    }
  ],
  "reopenWhen": "A later requirement needs a separate diagnostic sample for every compaction before a Stop, or a guide again describes a sample per compaction."
}
```

## WO-254-D051 — Final review: the matched follow-up rows whose conditions this order met

```json
{
  "id": "WO-254-D051",
  "date": "2026-11-04",
  "dispatch": "resume: final review; npm run plan -- followups --touching (34 pending rows name a file this change touches or the order)",
  "decision": "Dispose the rows whose reopening condition this order's change met and leave the rows it only matched as they are. Settled: FUP-fea8efc4a8e84a8f, the probe wording (D050), and FUP-fc5b0e563ef22d7e, the sibling worktrees ../DotLn-wo242 and ../DotLn-wo243, which no longer exist on this host and whose cause, a denied activation that leaves its worktree, step 4 fixes. Deferred again with the condition named: FUP-848fd8e2ac941bc3, because recordOperatorMessage now reads its class from the compiler while the first-line rule and harnessPromptLine are unchanged and the pasted-content framing is outside this order's criteria; FUP-770baf2f452c669e, because every role root changed while the planner root's entropy sentence still names no selector, and one sentence after the passing complete run would re-mint the oracle and the code identity; FUP-eed385be08e5bdd9, because the role oracle is re-minted and the chain in scripts/test-gate-followups.mjs grows, with the retained inequality's meaning left to the next order that touches it; and FUP-957602bc42e32e1d, FUP-89b7b9f657765e83, FUP-8dd0eb609946b9d1, FUP-916e24773df0b734 and FUP-e08668268dea62b1, because D013's reviewed rules changed the measured overrun again and the optimization is boarded for every role under FUP-f86af3151b401757. Left as matched: the other 23 rows, among them FUP-ac86ee429dee2947, whose condition is a planning allocation alone, the three WO-236 rows, whose functions (registeredTargetWriteRoot, outsideWriteResponse) this order does not touch, FUP-912adb42a652b75f, whose boundary the document gate judges here as the rules in force say, and the order's own FUP-f86af3151b401757 and FUP-78158140c6ac12aa, which the next planning pass triages.",
  "evidence": [
    "npm run plan -- followups --touching on 2026-11-04 (pending 253, matched 34) and --show for each row named above; the register's revision at the batch is recorded in the batch's expectedRevision and the applied dispositions carry this decision's anchor.",
    "git worktree list in this checkout on 2026-11-04 names only the main checkout and this order's worktree; ../DotLn-wo242 and ../DotLn-wo243 are absent beside them on disk.",
    "git diff over packages/skeleton/src/harness-host.ts names none of registeredTargetNearMiss, releaseCloseAdmission, outsideWriteResponse or registeredTargetWriteRoot.",
    "Product 07 §Planning passes: the final review disposes a listed row whose seam the change opened or whose condition occurred and leaves a row it only matched as it is; WO-204's FINAL-001 recorded the same shape of deferral on FUP-eed385be08e5bdd9 and FUP-957602bc42e32e1d."
  ],
  "rejected": [
    {
      "option": "Take the planner-root selector sentence and the paste-framing admission here",
      "reason": "Both are source changes outside the order's criteria after the passing complete run; each would re-mint generated surfaces and the code identity and owe a fresh complete run for work the order does not name."
    },
    {
      "option": "Mark the older cold-start rows duplicates of FUP-f86af3151b401757",
      "reason": "Consolidating the family is a planning judgment; each row's own reopening condition is recorded as met, which is the final review's duty, and the planning pass decides the consolidation."
    }
  ],
  "reopenWhen": "A planning pass consolidates or allocates the cold-start rows, or an activation finds its worktree path occupied."
}
```
