# WO-250 decisions

## WO-250-D001

```json
{
  "id": "WO-250-D001",
  "date": "2026-11-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.111.0, the next minor above the observed release baseline v0.110.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.110.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-250-reviews-converge-and-every-worker-counts.md"
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

## WO-250-D002 — The change review is a transport request the existing CLI transports launch

```json
{
  "id": "WO-250-D002",
  "date": "2026-11-02",
  "dispatch": "resume: next; steps 1 and 2, the shared launch and the helper",
  "decision": "The kit's change review is a new request kind, change-review, in packages/skeleton/src/change-review-protocol.ts: a closed request (the reviewed checkout, a capture outside it, the kind, round, subject and earlier finding ids, the canonical brief and a four-tool profile) and a closed result (findings with id, severity blocking, should-fix or note, summary, file, line and basis {criterion} or {regression} or null; rechecks of earlier findings, held or not-held; the files read; the worker's own report). verification-protocol.ts dispatches it beside the other kinds and worker-transport.ts builds its two argv forms: Claude print with Read, Grep, Glob and Bash, the file tools confined by --restricted, only the listed read commands pre-approved and every other call denied by --permission-prompts none, the project's instructions and hooks off by --safe-mode; Codex under --sandbox read-only with shell_tool, unified_exec and code_mode_host kept on, as the entropy form keeps them, and the core environment variables so its shell finds git and node. The launch itself moves out of scripts/lib/entropy-review.mjs into scripts/lib/worker-launch.mjs (the pinned transport defaults, the transport selection with a caller-supplied fixture double, the usage record, the receipt check, the elapsed clock and the CLI's version, and Claude's wire readback), which the entropy review and scripts/lib/review-worker.mjs both import. The helper renders the brief from the generated dotln-worker definition, the executor's reviewer briefs and admission rule (exported from contributor.ts so the role text and the helper read one string), the order text or the planning branch's changed documents, and the diff stat between the base and the working tree written as a Git tree through a temporary index (scripts/lib/checkpoint.mjs workingTree, which the checkpoint now shares); it writes round-<N>-<kind>.md and .json to docs/control/local/reviews/<WO-NNN or planning-date>/, prints the one line, appends a WorkerLaunched row to the session journal and, under CODEX_THREAD_ID, admits the launch through the subagent counter before any process starts. It compares the checkout's contents on either side of the episode and names any change. A rechecked report's findings are named <kind>.<round>.<id> so several reports stay distinct in one brief. Because worker-transport.ts, verification-protocol.ts and feedback-audit.ts are files the live feedback audit judges, this order owes one live feedback episode, which product 07 authorizes in the executor's session; the operator, asked nothing, said during this dispatch that every Claude or Codex run costs money anyway and questioned the hesitation over that episode's cost.",
  "evidence": [
    "The order's Cost names the transport selection of scripts/lib/entropy-review.mjs (1181 to 1183) and codexExecArgv as the launch route; the classes accept only the request kinds validateTransportRequest dispatches, so the helper's request is a kind of its own.",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS lists worker-transport.ts, verification-protocol.ts and every request protocol they import; scripts/feedback-evidence.mjs refuses a subject that omits an imported -protocol.ts file, so change-review-protocol.ts joins the list, and scripts/lib/evidence-sources.mjs registers it beside the other request protocols.",
    "npm run sync after the edit: 'feedback-evidence | stale | stale | refused: Feedback carry refused. Changed judged sources require the authorized live feedback episode and a new edition.' WO-247-D002 is the precedent: an edit to worker-transport.ts against a Cost line that said none, with the owed episode run in the executor's session (product 07 §Discipline: 'A live feedback episode an order owes runs in the executor's session ... with no operator authorization and its cost accepted').",
    "The name collision that renamed the kind: verification-protocol.ts already exports ReviewWorkerResult for the evidence review worker, so the kit's kind is change-review.",
    "Dry runs on this worktree: node scripts/worker.mjs review --kind criteria --host codex --dry-run prints a Codex argv with --sandbox read-only and no --disable for code_mode_host, shell_tool or unified_exec; --host claude prints --tools Read,Grep,Glob,Bash and an --allowedTools list of Read, Grep, Glob and thirteen Bash(<read command>:*) rules ending with the bounded probe (fourteen before the design review removed rg, WO-250-D011).",
    "scripts/test-review-worker.mjs, run by the plan-refutation suite beside the entropy fixtures: six cases pass under the bounded wrapper; node scripts/test-entropy-review.mjs passes its 33 cases unchanged on the shared launch.",
    "codex exec --help on CLI 0.166.0 lists --sandbox read-only, --ephemeral, --ignore-user-config, --strict-config, --output-schema and --json; claude --help on 2.1.316 lists --safe-mode, --restricted, --permission-prompts, --tools and --allowedTools."
  ],
  "rejected": [
    {
      "option": "Build the argv in scripts/lib/review-worker.mjs and run the CLI through runWorkerProcess, leaving the judged transport files untouched",
      "reason": "It copies the disabled-feature list the transport owns and a second launch path beside the one the Cost names, to avoid a two-minute episode whose cost the operator accepts."
    },
    {
      "option": "Reuse the entropy-review request kind for a change review",
      "reason": "Its subject is a frozen copy, its sandbox is workspace-write and its result is the entropy reviewer's contract, not the closed findings shape a verifier reads."
    },
    {
      "option": "inherit=\"none\" for the Codex shell environment, as the entropy form has it",
      "reason": "The source-writer form sets PATH itself because an empty environment cannot find node or git; a reviewer runs git diff, so the core set (HOME, PATH, USER, TMPDIR and the like) is kept and nothing else of the caller's environment."
    }
  ],
  "reopenWhen": "A helper-launched Codex worker reads nothing (the order's known issue), a host changes a flag these forms name, or the live feedback episode finds a regression in the judged sources."
}
```

## WO-250-D003 — Every use counts: launches by host, re-tasks and kit launches

```json
{
  "id": "WO-250-D003",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3, the counter",
  "decision": "The subagent counter counts uses and compares them with subagentCap. A launch is a direct spawn, an observed child or a kit-launched worker; a re-task is an Agent call resuming a known agent (admitted uncounted before) or a SendMessage, classed as a new tool effect, retask, in harness-command.ts and admitted beside the spawn admission; a kit launch is the literal helper command in a Bash call, npm run worker -- review or node scripts/worker.mjs review without --dry-run counting one and npm run plan -- review or node scripts/refute-plan.mjs review counting three, on the host --host names (unattributed when it names none). The counter keeps two optional rows, retasks and kits, so a counter written before this change reads with its counts; each row is keyed by the tool call, so a repeated hook charges once, and a driven spawner's own uses count against its cap. subagentUsage reports launched, launchedByHost and retasked; harness usage prints 'workers: launched N (claude A, codex B), re-tasked M, cap C, remaining R' beside the countKind; the Stop summary keeps its 'Subagents: N/cap' prefix and adds the breakdown; the cap refusal says every launch, re-task and kit launch counts. Under Codex the helper admits its own launch through the same function before any process starts (D002). Every SendMessage counts, whether or not its recipient is an agent this counter saw, because the recipient may be named rather than identified and a cap one path escapes is no cap.",
  "evidence": [
    "packages/skeleton/src/subagent-budget.ts before this change: the resumed-agent branch admitted a known agent without a row, and harnessToolEffects had no SendMessage entry, so permissionEffect classed it unclassified and no counter saw it.",
    "packages/skeleton/test/subagent-budget.test.ts: 14 cases pass, including the resumed agent counted as one re-task and refused at the cap, a message, kit launches by host and a plan review's three, the twenty-first use refused and a pre-change counter read unchanged; the WO-142 B5 case's resumed-agent pin is replaced because this order reverses the behavior it pinned.",
    "scripts/test-harness.mjs 'WO-250 every use counts': through the generated permissions hook a message, a resumed agent and a helper launch count one each, a plan review three and a dry run none; node scripts/harness.mjs usage prints 'workers: launched 9 (claude 2, codex 4, unattributed 3), re-tasked 2, cap 20, remaining 9'; the twenty-first use is refused for a kit launch, a message and a spawn alike.",
    "Measured per judged call on this host (a 20,000-call microbenchmark of the built functions): the kit-launch match adds 1.8 µs to every shell call; a kit launch or re-task adds one counter transaction, 0.96 ms averaged over 2,000 transactions on a growing counter, the transaction a spawn already pays; other tools add nothing. Before this change none of these ran."
  ],
  "rejected": [
    {
      "option": "Count kit launches apart from the cap",
      "reason": "The operator's item 6.b: a cap that one path escapes is a suggestion (the order's Design)."
    },
    {
      "option": "Charge a kit command only after every other hook admits it",
      "reason": "The permission hook judges before the others and a host runs them independently; charging at the spawn admission point, as a spawn is charged, over-counts only a command another hook then refuses, which is conservative."
    }
  ],
  "followup": "Count the other kit commands that launch a worker by their literal words: npm run plan -- refute --transport claude-cli-print|codex-cli-exec and npm run entropy -- review|refute --transport claude-cli-print|codex-cli-exec each launch one worker the cap does not see. Add their rows to kitWorkerLaunch in packages/skeleton/src/harness-host.ts, have scripts/refute-plan.mjs and scripts/lib/entropy-review.mjs admit their own launch under CODEX_THREAD_ID as scripts/lib/review-worker.mjs does, and add the cases to scripts/test-harness.mjs and scripts/test-plan-refutation.mjs.",
  "reopenWhen": "An order is refused at the cap while using no more distinct agents than a comparable earlier order (the order's known issue), or a session exceeds the cap on a path this order does not count."
}
```

## WO-250-D004 — A review worker's gate is refused by the agent type the host names on its call

```json
{
  "id": "WO-250-D004",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4, the worker gate refusal",
  "decision": "The permission hook refuses, with DOTLN_WORKER_GATE_REFUSED naming the bounded single-test form, a shell command from an agent whose hook input names agent_type dotln-worker or dotln-worker-fable when any of its invocations starts a test-runner gate: npm's test command under any spelling or arguments (test, t, tst), the test, test:full, test:docs and test:machinery scripts, scripts/test-runner.mjs or scripts/target-gate.mjs run directly, or any of these inside the bounded wrapper; a single test under the wrapper is admitted. A lifecycle phase agent (dotln-executor and the other phase definitions) and the session itself are judged as before, and the target-worktree hook applies the same refusal. The recognizer, gateInvocation, lives in packages/skeleton/src/test-selection.mjs beside the hook's other test-command readers. The refusal keys on the agent_type the host puts on each of the child's tool calls rather than on a record written at the spawn admission, which the order's text describes: the spawn's tool_use_id is joined to the child's agent_id only at the Agent call's PostToolUse, after a foreground child has finished, so a spawn-time record cannot name the child while it runs, whereas the host's own field is on every call and is what the hook already reads to select a lifecycle role. The generated refusals sentence gains the row, so it counts eight against the seven at activation; its clause is the short 'refuses a review worker's test-runner gate', because every role root carries that sentence and the router's root had 57 bytes under its 16,384 ceiling, which the gate-followups test holds without a follow-up route (D007).",
  "evidence": [
    "docs/evidence/WO-192/host-probe.json rows.childIdentity: observed, 'agent_id and agent_type on a child's tool call'; packages/skeleton/src/harness-host.ts lifecycleWorker selects a phase role from the same field.",
    "packages/skeleton/src/subagent-budget.ts linkSubagentResult runs at PostToolUse of the Agent call; before it the counter holds the spawn's invocation and, separately, the child's agent_id.",
    "scripts/test-harness.mjs 'WO-250 a review or refutation worker's gate is refused': npm test, npm test -- --only resume, node scripts/test-runner.mjs --review, node scripts/target-gate.mjs, npm run test:docs, npm run test:full and a gate inside the bounded wrapper are refused from both worker types; the bounded single test is admitted; the session and a dotln-executor agent are allowed the same commands; the journal records workerGateRefused.",
    "Measured on this host: the gate match returns at the agent check for every call that is not a review worker's, and costs 1.5 µs per shell call from a review worker.",
    "CLAUDE.md after npm run sync: 'DotLn has 8 refusals (WO-135, WO-139, WO-144, WO-234, WO-251, WO-250)'; git show HEAD:CLAUDE.md, the activation tree: 'DotLn has 7 refusals (WO-135, WO-139, WO-144, WO-234, WO-251)'."
  ],
  "rejected": [
    {
      "option": "Leave the rule to the worker definition and briefs alone",
      "reason": "WO-247-D012's operator direction: every session, not one brief."
    },
    {
      "option": "Record the spawn's subagent_type at the admission and refuse by that record",
      "reason": "The record cannot name a running foreground child (above); the host's agent_type is the same fact, observed on the call itself."
    },
    {
      "option": "Spell every gate form in the generated refusal clause",
      "reason": "It costs the router's root its ceiling; the role text and product 07 carry the forms, and the refusal names the probe to use instead."
    }
  ],
  "reopenWhen": "A host stops naming agent_type on a child's calls, a review worker reaches a gate through a form this list misses, or a helper-launched Claude review session's journal shows a gate command (the order's known issue)."
}
```

## WO-250-D005 — An order's reviews lane is kept beside its journals at close

```json
{
  "id": "WO-250-D005",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 5, retention",
  "decision": "Before release close removes a worktree, retainWorktreeJournals moves the order's reviews lane, docs/control/local/reviews/WO-NNN/ under the worktree's configured control root, a repair's rounds included under repair-<n>/, into the order's retained lane under reviews/, beside the session journals, with the same merge, link and tracked-file rules; the closed-journal class admits a reviews directory, so the prune judges it by the lane's window. A planning lane, planning-<date>/, has no order and no close, and stays in its checkout. The verifier reads the lane in the worktree before the close; the executor writes an Agent worker's returned text there under the round and kind name (the role text), so every round is readable whatever the launch route.",
  "evidence": [
    "WO-237-D014: the verifier could not read the three original reports because the executor's scratch directory no longer existed.",
    "bash scripts/test-release.sh --case success under the bounded wrapper, 2026-11-02: exit 0; 'journal lane after close: ./.dotln-owner.json ./ddd….json ./ddd….jsonl ./reviews/round-1-criteria.json ./reviews/round-1-criteria.md ./sources.jsonl ./suite-success/fixture'; the record's journal row counts the moved reports with the journals."
  ],
  "rejected": [
    {
      "option": "Commit the reports as evidence",
      "reason": "The order's Design: the reports are the executor's working record; the consolidated account and the handoff line are the committed one."
    }
  ],
  "reopenWhen": "A verification finds a round's report missing from the lane (the order's known issue), or a close leaves a reviews lane behind."
}
```

## WO-250-D006 — The self-review line records the rounds and the unreviewed lines

```json
{
  "id": "WO-250-D006",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 6, the handoff line",
  "decision": "The handoff's self-review line may end with '; rounds R', optionally followed by a parenthesized note such as a skipped round, and '; unreviewed M lines (<reason>)', the reason required unless M is 0; prose after a space still follows as before, but a ';' after the counts must open one of these fields, so a malformed trailing field such as '; rounds x; garbage' now prints the missing-line advisory, where the earlier pattern, with no end anchor, accepted it. The line stays advisory; the advisory names the new fields.",
  "evidence": [
    "scripts/test-verification-review.mjs, run by the resume suite: the form table gains the order's example line (passes), the line without the fields (passes, as before), '; rounds x; garbage' and three other malformed tails (advised); every earlier row keeps its outcome, including trailing prose after a dash or a period.",
    "Every self-review line in docs/evidence/WO-2*/handoff.md ends after its counts or continues with a space, a period or a dash, so none changes outcome."
  ],
  "rejected": [
    {
      "option": "Anchor the line at its end",
      "reason": "Committed handoffs continue the line with prose after the counts; an end anchor would advise on all of them."
    }
  ],
  "reopenWhen": "A handoff needs another field on the line, or a verifier cannot tell the rounds from the line."
}
```

## WO-250-D007

```json
{
  "id": "WO-250-D007",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 7, the role text",
  "decision": "The executor's review paragraphs become the ladder: round 1, three fresh dotln-worker reviewers over the whole diff against the merge base with nonoverlapping briefs; round 2, each reviewer whose findings were fixed rechecks those fixes on the current diff and nothing else, resumed where the host keeps it or as a fresh worker given its prior report, under the admission rule (a new finding is admitted only when it breaks an acceptance criterion or a behavior main had, and any other is recorded in the handoff, not fixed); round 3, only when round 2's fixes changed code again, one combined worker over the delta since round 2's reviewed tree under the same rule; then no reviewer, and the executor judges the remaining delta. A round is skipped, and the line says so, when the fixes before it touch only comments, documentation, formatting, test names or regenerated files; a repair takes the ladder over its own diff and starts at round 3 under fifty changed source lines; each round's report lives in the order's reviews lane. The sentence restarting all three reviewers after any change goes, from the paragraph, the review step and the complete-run step. The shared launch sentence names the helper as the route to a review worker on the other host and the counting rule; the fan-out sentence counts every use and keeps reuse for rechecks; the verifier reads every round's report from the lane. packages/skeleton/fixtures/wo250-role-baseline.json pins every role at both economy settings over the WO-249 integration oracle, which stays byte-exact, and records each root's startup bytes. Measured by the gate-followups test's own rule (the source CLAUDE.md with its harness block replaced by the projected block, plus each projected skill): executor 41,685 bytes (from 39,873), verifier 36,409 (35,447), planner 27,362 (26,449), reviewer 38,832 (37,919), release-close 25,891 (24,978), refuter 25,513 (24,600) and router 16,379 (16,327). The executor, verifier and planner breach their effective ceilings (40,194, 35,221 and 24,576); under product 07's one route the reviewed rules stay whole and the overruns are boarded below, with no ceiling raised and no acceptance recorded. The router's growth is the refusal sentence alone, so its clause is short and the subagents row keeps its wording, which leaves the router 5 bytes under its 16,384 ceiling.",
  "evidence": [
    "docs/product/07-execution-guide.md §Discipline, the cold-start ceilings paragraph: 'a reviewed rule that breaches a ceiling stays whole, and its measured overrun is boarded as a follow-up ... No ceiling is raised, no acceptance is recorded, no needed rule is cut to fit'.",
    "docs/control/budgets.json: the latest acceptances give executor 40,194, verifier 35,221, reviewer 39,600 and release-close 26,410; planner 24,576 and router 16,384 have none; refuter is unset. scripts/test-gate-followups.mjs holds the router at or under its ceiling with no follow-up route.",
    "The first measurement of this change, before the clause was shortened, put the router at 16,596 bytes: the CLAUDE.md block had grown 269 bytes with a full-length refusal clause and a reworded subagents row; with the short clause it grows 52 bytes.",
    "The order's Cost: 'the executor root grows by the ladder and shrinks by the restart sentences, measured against its ceiling under the standing route'."
  ],
  "rejected": [
    {
      "option": "Raise the breached ceilings or record acceptances",
      "reason": "Retired since 2026-10-05 (product 07 §Discipline); WO-249-D025 rejected the same."
    },
    {
      "option": "Cut the ladder's rules to fit the executor's ceiling",
      "reason": "Product 07: no needed rule is cut to fit; the ladder is the order's deliverable."
    }
  ],
  "followup": "Optimize the executor's, the verifier's and the planner's installed cold starts with equivalent usefulness. With the review ladder, the counting rule and the change review helper's route the executor measures 41,685 bytes against its effective 40,194 (nominal 29,246), the verifier 36,409 against 35,221 (nominal 29,831) and the planner 27,362 against 24,576, of which WO-251's FUP-ac86ee429dee2947 and WO-249's FUP-8dd0eb609946b9d1 board the overrun up to 26,449. Inspect the executor's ladder paragraph, the shared launch sentence's helper and counting clauses and the fan-out sentence in packages/skeleton/src/loadouts/contributor.ts; preserve the ladder, the admission, skip and fifty-line rules, the counting rule and the helper route. Validate with scripts/test-process-debt.mjs, scripts/test-gate-followups.mjs and npm run meta.",
  "reopenWhen": "An optimization preserving equivalent usefulness is allocated, another reviewed rule changes a role root, or integration changes the preceding oracle."
}
```

## WO-250-D008 — Component versions move with their sources

```json
{
  "id": "WO-250-D008",
  "date": "2026-11-02",
  "dispatch": "resume: next; release preparation",
  "decision": "@dotln/compiler moves from 0.36.0 to 0.37.0 (minor: a refusal row and the retask tool effect in the harness profile type), with COMPILER_PACKAGE_VERSION beside it; @dotln/skeleton from 0.78.0 to 0.79.0 (minor: the change-review request kind and the counter's uses and their reports); HARNESS_HOST_VERSION from 0.41.0 to 0.42.0 (the hook's new refusal and counting); the skeleton and console pins and package-lock.json follow. Kernel, console, beacons and browser-evidence sources are unchanged and keep their versions. Codex's recorded version observation, OBSERVED_CLI_VERSIONS.codex in worker-transport.ts, moves from 0.154.0 to 0.166.0, the CLI this order's helper forms were built and launched against; Claude's stays at 2.1.270, since nothing in this order depends on a later Claude release.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.111.0 (D001); product 07 §Independent workflows: release prepare 'never ... alters component versions ... A missing component bump against the verified branch baseline remains an executor defect.'",
    "scripts/release.mjs component-version check: a component whose src changed since the latest release tag must name a different version than that tag's manifest.",
    "codex --version on this host: codex-cli 0.166.0; claude --version: 2.1.316.",
    "WO-247-D013 and f16ba686 (WO-251) are the precedents for moving COMPILER_PACKAGE_VERSION and HARNESS_HOST_VERSION with their packages."
  ],
  "rejected": [
    {
      "option": "Patch bumps",
      "reason": "Both packages gain behavior and exports; minor matches the order's release classification."
    }
  ],
  "reopenWhen": "Integration finds main took one of these versions, which the integration records as a retime."
}
```

## WO-250-D009 — A worker keeps itself within a stated budget, and its transcript is never its limit

```json
{
  "id": "WO-250-D009",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 10, the first live launch through the helper",
  "decision": "The first Codex launch of this order's criteria review ran six minutes and returned nothing: the process runner stops a worker whose stdout passes 1,000,000 bytes, and Codex's --json stream on stdout echoes every command the worker ran, so a reviewer that reads files passes that bound whatever its deliverable. For a change review the transcript is no longer a limit: the runner reads stdout through a pipe and keeps only its last 8,000,000 bytes, starting at a line boundary, which still holds the usage counters and the turn's end, and never stops the worker for its length; the Codex form writes its final message to its own file with --output-last-message, and the decoder reads the deliverable from that file before the stream. The brief tells the worker its budget, about 30 minutes and 120 tool calls, to watch and stay within, returning the findings it has and naming what it did not reach as it nears either, because a worker stopped at a hard limit returns nothing; the hard limits (60 minutes; USD 20 for the Claude print form) sit well above that budget. An output-limit failure now names the stream it came from. Every other launch keeps its file capture and its 1,000,000-byte bound.",
  "operatorAuthorization": "Paraphrase: during this dispatch the operator said that a worker reaching its limit must wrap up and return a deliverable even when that runs past the limit, since a worker that passes it and returns nothing has wasted its whole run; that the worker should watch its own limit and decide before reaching it; and that capturing the final message apart from the transcript was the right fix.",
  "evidence": [
    "The first launch's printed line: 'review: criteria round 1: the worker returned no report (output-limit); 0 h 6 min; nothing written to docs/control/local/reviews/WO-250'; the journal holds its no-report row and the counter its use.",
    "packages/skeleton/src/worker-transport.ts runWorkerProcess before this change: stdout written to a capture file and the worker stopped once the file passed 1,000,000 bytes; codex exec --help on 0.166.0: '--json Print events to stdout as JSONL' and '-o, --output-last-message <FILE> Specifies file where the last message from the agent should be written'.",
    "scripts/test-review-worker.mjs: a child that writes two megabytes of event lines under a 64 KiB tail resolves with whole lines ending in its turn.completed event, and the Codex transport with a fixture runner reads the findings from last-message.txt when the kept stream holds no agent message; the launch carries stdoutTailBytes 8,000,000 and --output-last-message in the capture lane.",
    "The Claude print form's first live launch, the design review, returned its report in 0 h 7 min (USD 3.08, 50 turns, 36 files read): its stdout is one result object, which the 1,000,000-byte bound never reached."
  ],
  "rejected": [
    {
      "option": "Raise the stdout bound for change reviews and keep killing past it",
      "reason": "Any bound on the transcript still discards a finished review that read a little more; the deliverable has its own channel, so the transcript need bound only memory."
    },
    {
      "option": "Drop --json and read stdout as the final message",
      "reason": "The usage counters a launch records come from the --json stream's turn.completed event."
    }
  ],
  "reopenWhen": "A change review still returns no report at a limit other than its hard deadline, or a worker overruns its stated budget routinely enough that the budget or the hard limit needs to move."
}
```

## WO-250-D010 — The change review's budget and limits become instance configuration later

```json
{
  "id": "WO-250-D010",
  "date": "2026-11-02",
  "dispatch": "resume: next; an operator note during the review ladder",
  "decision": "The change review's budget and limits stay constants in packages/skeleton/src/change-review-protocol.ts for this order (CHANGE_REVIEW_LIMITS: a budget of 30 minutes and 120 tool calls the worker keeps itself within, the 60-minute hard timeout, the USD 20 cap of the Claude print form and the 8,000,000-byte transcript tail), and a follow-up records that they become instance configuration in dotln.config.json in a later configuration pass, with these values as the defaults. This order neither adds the setting nor binds the pass that will; WO-241, the queued features file, is one candidate.",
  "operatorAuthorization": "Paraphrase: during this dispatch the operator asked for a follow-up so it is not forgotten that values such as the 30 minutes and 120 tool calls belong in the DotLn configuration at some point, not necessarily in WO-241, since several configuration passes are expected.",
  "evidence": [
    "packages/skeleton/src/change-review-protocol.ts CHANGE_REVIEW_LIMITS holds every value; scripts/lib/review-worker.mjs and packages/skeleton/src/worker-transport.ts read them.",
    "docs/work-orders/WO-241-the-features-file.md is queued: dotln.config.json gains a features section an operator reads and edits by feature name."
  ],
  "rejected": [
    {
      "option": "Add the configuration keys in this order",
      "reason": "The operator placed it in a later configuration pass, and no acceptance criterion of this order names it."
    }
  ],
  "followup": "Make the change review's budget and limits instance configuration: read budgetMinutes (30), budgetToolCalls (120), the hard timeout (60 minutes), the Claude print form's dollar cap (USD 20) and the transcript tail (8,000,000 bytes) from dotln.config.json at launch, with today's constants in packages/skeleton/src/change-review-protocol.ts as the defaults, the brief stating the configured budget, and the config validation refusing a value outside its range. Consider the same for the other worker shapes' limits when that pass comes. Validate with scripts/test-review-worker.mjs and the configuration tests.",
  "reopenWhen": "A configuration pass takes up worker limits (WO-241 or a later one), or an operator needs a different budget for one instance."
}
```

## WO-250-D011 — This order's own reviews under the ladder, the first observation of the rule

```json
{
  "id": "WO-250-D011",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 10, this order's reviews by the ladder",
  "decision": "The reviews ran as the ladder: three rounds, then the executor's judgment. Round 1 put one reviewer of each kind over the whole diff against the merge base 91a730ac: the criteria adversary through the helper on Codex, the design improver through the helper on Claude print, and the consistency reviewer as a dotln-worker Agent, whose returned text was recorded in the lane. It found 28 findings (5 blocking): 20 were fixed in full, 3 in part with the rest recorded, and 5 were recorded unfixed. Round 2 rechecked the fixes: the design and criteria reviewers as fresh helper workers given their round-1 reports, and the consistency reviewer as a SendMessage re-task of the same agent. It admitted 2 new findings, both fixed; one was blocking. The not-held rechecks were fixes that had not fully held, and they were completed: the repair cycle, the Node-option match and the prose record. Round 3, one combined worker on Codex over the delta since round 2's reviewed tree, found 1 blocking finding: a test-name pattern naming a gate script read as the script. The executor fixed it without a further reviewer, as the ladder directs, and in the same remaining delta repaired an adjacent defect found while reading the helper's token count: the entropy review's cost line. In all, 31 findings (7 blocking): 23 fixed in full and 8 with a recorded remainder (3 partly fixed, 5 unfixed), which the handoff's self-review line counts as recorded. The ladder took 8 uses: 7 launches (one of them the Codex attempt the output bound stopped, D009) and 1 re-task, against a cap of 20.",
  "evidence": [
    "Round 1, criteria: helper on Codex, codex-cli-exec 0.166.0, gpt-6.1-sol at max. The first attempt (17:17:34Z) ran 0 h 6 min (376,684 ms); its WorkerLaunched row records outcome no-report, failure output-limit (D009). The retry (17:33:02Z) took 0 h 23 min (1,400,394 ms) and read 54 files. It found 6 findings, 3 blocking: Node options before the gate script, a kit launch inside the bounded wrapper, and the kit guide's missing ladder. All six were fixed, the other three being planning documents found against the branch base, the record command, and the content witness. Report: docs/control/local/reviews/WO-250/round-1-criteria.md.",
    "Round 1, design: helper on Claude print, claude-cli-print 2.1.316, claude-opus-5-5 at xhigh, host readback claude-opus-5-5. It took 0 h 7 min, cost USD 3.08 over 50 turns and read 36 files. It found 13 findings, none blocking.",
    "Round 1, design, fixed: F1, the repair lane and the overwrite refusal; F2, the round text built from what is present, with the round refusals; F3, one pin source tested against the role text; F5, the Codex counter initialized before admission; F6, one workerUse shared by both permission paths and the advisory; F12, rg dropped and the guarantee stated as detection. Partly fixed: F10 (one finding formatter, readback through readWire, and the unused import removed) and F11 (points 1, 2 and 4).",
    "Round 1, design, recorded and not fixed: F4, the journal key under a lifecycle Agent subagent (the helper has no agent identity, and only the fixtures read WorkerLaunched rows); F7, the plan review's flags, which WO-244 defines; F8, the worker types and gate scripts as literal lists; F9, the lane path built in two places, the closed-journal predicate's double duty and the planning lane keyed by UTC date; F10's remaining two (workersLine beside subagentSummary, and the counter's repeated validation); F11 point 3 (reviewed trees are unreferenced objects gc may prune after its expiry) and the function split; F13, the parallel dispatch chains, which predate this order. None breaks a criterion or a behavior main had.",
    "Round 1, consistency: Agent dotln-worker. It took 0 h 24 min (1,445,135 ms), 385,723 tokens and 192 tool uses, and read 77 files. It found 9 findings, 2 blocking, both pins the complete run would have failed: executor-supports.test.ts and the SendMessage delegation example in test-harness.mjs. F1 to F8 were fixed, along with F9 parts a, b, d and e. F9 part c is recorded: about 20 skeleton test sites build Codex argv at 0.154.0 and print a stderr advisory that no test asserts.",
    "The round-1 criteria report records the checkout as changed and names five files: docs/AI-HARNESS-SECURITY.md, docs/PLAYBOOK.md, packages/skeleton/test/executor-supports.test.ts, scripts/lib/drive-diagnostics.mjs and scripts/test-drive.mjs. The witness compares contents and cannot say who wrote them; the session transcript shows they are the executor's consistency fixes, edited from 17:45:01Z to 17:47:17Z, after the consistency report returned at 17:42:12Z and while the criteria worker ran until 17:56:23Z. The worker's findings stand on its reviewed tree c940cf89, written at launch.",
    "Usage after round 1: workers: launched 4 (claude 2, codex 2), re-tasked 0, cap 20, remaining 16.",
    "Round 2, design recheck: helper on Claude print. It took 0 h 5 min (293,599 ms), cost USD 1.82 over 29 turns and used 2,170,920 tokens, cache reads included. No new findings. F2, F3, F5, F6 and F12 held. F1 did not hold: an in-execution repair after a failed complete run records no fix dispatch. reviewCycle now also counts failed complete runs since activation, and the record command applies the same round rules. F4, F7, F8, F9 and F13 were reported not held because they were recorded, not fixed, as above.",
    "Round 2, criteria recheck: helper on Codex. It took 0 h 5 min (313,964 ms), used 1,280,634 tokens and read 26 files. F2, F3, F4 and F6 held. It admitted 2 new findings. F1, blocking criterion 3: --redirect-warnings with a separate value hid the runner; the gate and kit matchers now find the script by its path. F2: a prose Agent report could not be recorded; the record command now keeps prose with no findings. Both were fixed.",
    "Round 2, consistency recheck: a SendMessage re-task of the same agent. It took 0 h 4 min (254,954 ms) and 22 tool uses; the host reported 414,311 tokens for the agent, cumulative as reported. All nine held and no new findings were admitted. Recorded with npm run worker -- record.",
    "Usage after round 2's launches: workers: launched 6 (claude 3, codex 3), re-tasked 1, cap 20, remaining 13. The re-task is the first live count of a SendMessage.",
    "Round 3, combined: helper on Codex over the delta since ca09e76b, the tree all three round-2 reports reviewed. It took 0 h 11 min (655,687 ms), used 2,018,330 tokens and read 66 files. Both round-2 findings held. It found 1 blocking finding: `--test-name-pattern scripts/test-runner.mjs` made a bounded single test read as a gate. The executor's fix passes over a path given as the value of a Node option whose value Node never runs, while a path given to a module loader still counts. The case is in test-harness.mjs.",
    "Usage at the ladder's end (harness usage, observed 18:37:20Z): workers: launched 7 (claude 3, codex 4), re-tasked 1, cap 20, remaining 12.",
    "Unreviewed after round 3: 96 changed source lines (git diff --numstat from round 3's tree b3657c77 to the working tree ae402db6). Of these, packages/skeleton/src/test-selection.mjs (42) and scripts/test-harness.mjs (4) are the round-3 fix and its tests, and scripts/lib/entropy-review.mjs (5) and scripts/test-entropy-review.mjs (45) are the adjacent repair and its test. The executor judged all of them. The rest of the delta is the feedback edition and its pointer (D012), the follow-up register and these records.",
    "Criterion 1's real launches: the Claude print form returned the round-1 design report citing 36 files it read; the Codex form returned the round-1 criteria report citing 54. The design review's removal of rg is why D002 counts thirteen Bash rules.",
    "Adjacent defect found while reading the helper's token count: scripts/lib/entropy-review.mjs costFrom, which writes both the review and the refutation receipt's cost, read usage?.totals?.totalTokens, but a usage observation carries its counters under usage (packages/skeleton/src/usage-observation.mjs). The committed receipts REVIEW-003 to REVIEW-007 and REFUTATION-002 to REFUTATION-008 each read 'tokens unknown; cause harness-no-readback' while naming source claude-result-envelope. The helper misread the same field until 17:59:44Z: its two round-1 launched reports record tokens null, and the three launched after the correction record counts. Both are corrected. costFrom now reads usage.usage. A new test-entropy-review.mjs case decodes a Claude result envelope as the transport does and checks three things: the line states its count, the wire's cost still wins, and the cause code stays when no counter is present. It passed alone under the bounded wrapper. The filed receipts keep their bytes as immutable records."
  ],
  "rejected": [
    {
      "option": "A fourth round after the combined worker's finding",
      "reason": "The ladder's end: after round 3 no reviewer runs in this execution, and the executor judges the remaining delta."
    },
    {
      "option": "Fixing the recorded design findings in this order",
      "reason": "They stand on neither an acceptance criterion nor a behavior main had."
    },
    {
      "option": "Boarding the entropy cost defect as a follow-up, as this record's first text did (FUP-afd02097847e2751)",
      "reason": "The role prefers a bounded adjacent repair. The fix is two lines in a file this order already changes. After round 3 the executor judges the remaining delta, and the receipts already filed keep their bytes."
    }
  ],
  "reopenWhen": "A verification finds a round's report missing from the lane or a recorded finding that breaks a criterion, or an order's reviews need more than three rounds to converge, or a launched entropy receipt again states tokens unknown beside a named usage source."
}
```

## WO-250-D012 — The owed live feedback episode

```json
{
  "id": "WO-250-D012",
  "date": "2026-11-02",
  "dispatch": "resume: next; the live feedback episode D002 owes",
  "decision": "The episode ran after the review ladder settled the judged sources: DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit on claude-cli-print at claude-opus-5-5 and xhigh, under the bounded wrapper, from 18:31:17 to 18:31:56 UTC. Phase complete, ten fixtures, 1,192 saved instruction bytes. feedback-evidence --write and --record-selfhost filed docs/evidence/WO-250/feedback-001; docs/evidence/current.json names it by hand, since sync carries an edition and cannot select a live one; --check reports that its live audit judged the current source, with ten passing regressions and ten removal failures.",
  "evidence": [
    "The first attempt at 18:30:09 UTC stopped within three seconds, before any launch, with 'worker host refused': the verifier refuses a store whose path is not its own real path, and the session scratch's /var/folders path resolves to /private/var/folders. The same call from a script printed 'feedback verifier mount alias'; the second attempt named the store by its physical path.",
    "Recorded the audited selfhost and the independent verifier stream by reference (77,181 of 3,029,796 bytes), with a pins snapshot of package-lock.json, packages/skeleton/package.json and packages/compiler/src/artifact-identity.ts."
  ],
  "rejected": [
    {
      "option": "Run the episode before the reviews",
      "reason": "A review fix to a judged source would have owed a second episode; the rounds did change worker-transport.ts and change-review-protocol.ts."
    }
  ],
  "reopenWhen": "A repair edits a judged source again, which owes another episode the same way (product 07 §Discipline)."
}
```

## WO-250-D013 — The first complete run failed on a pinned worker-profile hash, and its repair took the ladder from round 3

```json
{
  "id": "WO-250-D013",
  "date": "2026-11-02",
  "dispatch": "resume: next; the first complete run and its repair",
  "decision": "The first complete run failed in harness-fixtures on 1 of 431 cases. The repair keeps the case's pinned hash at main's value and asserts the new entry separately. 'WO-146 three contributors share unique outputs while workers remain explicitly two' hashes both target worker profiles with later additions removed and asserted on their own. D003's SendMessage: \"retask\" entry in harnessToolEffects enters both profiles' tool maps, and that moved the hash. The case now asserts that profile.tools.SendMessage is \"retask\" and removes it before hashing, the way it already treats SubagentHandback and the desktop tools. The repair's diff, 5 changed lines in scripts/test-harness.mjs, took the ladder from round 3 under product 07's rule for a repair under fifty changed source lines: one combined worker on Codex over the diff from the failed run's tree, reported in the order's repair-1 lane.",
  "evidence": [
    "The complete run: npm test -- --review, started 18:48:28Z and recorded 18:59:26Z after 0 h 11 min (658,029 ms), exit 1, tree f3004adb7192cc0be0a7956c2d9542c86a5beaaf, code identity 9ae1d67d27bb01ffeb3428a5d5a13199df2cad0f5585faa6f7a42f14c4c0cba9, 84 fresh suites. Its structural row passed at 18:59:05Z. harness-fixtures ran 431 cases; 430 passed and 1 failed at scripts/test-harness.mjs:3609, expected 9f41bb7cb0176f0b8e73bd9fe760ef628259e69b4ebdbb28fa0a621bd4dba6fb, actual 49eae8011c0739291b54e35e4c2498679d868a5b8a0b4bc0b64a6c322338e105. The runner then started none of the 36 later product tasks.",
    "Cause, measured with a scratch script over packages/skeleton/dist/src/loadouts/contributor.js: hashing the built target worker profiles as the case does gives 49eae801; also removing SendMessage from each profile's tools gives 9f41bb7c, main's pinned value. Both profiles, claude-code and codex-cli, carry SendMessage: \"retask\".",
    "Why it reached the complete run: the case never names SendMessage, so round 1's consistency review traced SendMessage's consumers to the delegation example (its F2) and not to this hash. During execution only named WO-250 cases of scripts/test-harness.mjs ran, under the bounded wrapper. Product 07 §Discipline states that a focused pass serves to reproduce one failure, not to precede the complete run, and the runner scheduled this changed suite first, so the failure surfaced 0 h 8 min into the run.",
    "The repaired case passed alone under the bounded wrapper. The repair's base is the failed run's tree f3004adb, rebuilt as the repaired working tree fc42fe5c with the case's pre-repair bytes; the failed row's treeHash names the same tree. The two differ only in scripts/test-harness.mjs: 4 lines added and 1 removed.",
    "Repair round 3: helper on Codex, codex-cli-exec 0.166.0, gpt-6.1-sol at max, over the diff from f3004adb to the repaired tree fc42fe5c. It took 0 h 3 min (152,186 ms), used 510,031 tokens, read 42 files and left the checkout unchanged. It found 0 findings: the separate assertion matches the shared harnessToolEffects map both worker profiles inherit, and the pinned hash is unchanged. Its own bounded probe could not start under the read-only sandbox (getconf DARWIN_USER_TEMP_DIR returned an input/output error), as its report says; the executor ran the case. Report: docs/control/local/reviews/WO-250/repair-1/round-3-combined.md. Usage after it (harness usage, observed 19:06:00Z): workers: launched 8 (claude 3, codex 5), re-tasked 1, cap 20, remaining 11; dispatch standing 2 h 53 min of 8 h 0 min, complete runs 1 of 20."
  ],
  "rejected": [
    {
      "option": "Re-pin the hash to 49eae801",
      "reason": "It would bind the whole profile to this order's bytes at once and lose the evidence that nothing else in the profiles moved; the case already asserts later additions on their own."
    },
    {
      "option": "Restart all three reviewers on the repair",
      "reason": "That is the rule this order replaces; under the ladder, a repair whose diff is under fifty changed source lines starts at round 3."
    },
    {
      "option": "Skip the repair's round 3",
      "reason": "The skip rule admits only comments, documentation, formatting, test names or regenerated files, and the repair adds an assertion."
    }
  ],
  "reopenWhen": "A later complete run fails on another pin over the profiles' tool maps, or a review finds that the separate assertion hides a change the hash should have caught."
}
```

## WO-250-D014 — The second complete run failed on the shared-digest rule, and its repair took the ladder from round 3

```json
{
  "id": "WO-250-D014",
  "date": "2026-11-02",
  "dispatch": "resume: next; the second complete run and its repair",
  "decision": "The second complete run failed in process-debt on 1 of 181 cases. That case enforces the repository rule that no script defines its own bare-hex sha256, and it found two files that do: the change review helper (scripts/lib/review-worker.mjs) and its fixtures (scripts/test-review-worker.mjs). Both now import sha256Hex from scripts/lib/helpers.mjs under the name they used, a spelling the rule admits, so every call site and every digest is unchanged. The repair's diff, 12 changed lines, took the ladder from round 3: one combined worker on Codex over the diff from the failed run's tree, reported in the order's repair-2 lane.",
  "evidence": [
    "The complete run: npm test -- --review, started 19:07:37Z and recorded 19:20:38Z after 0 h 13 min (780,944 ms), exit 1, tree 7b0d658e61d0d07dab3827920aba2361e4134121, code identity 370cec7c7429351c273733f6f4df5d149623028bfdd1c07ff93f1d1d4fc8c87a, 85 fresh suites. harness-fixtures, repaired by D013, passed, and the structural row passed at 19:19:58Z. process-debt ran 181 cases: 180 passed, and 'no script defines a bare-hex sha256 or spawns Git outside the library' (scripts/test-helper-reuse.mjs:295) failed naming the two files. The runner then started none of the 35 later tasks.",
    "The rebuilt pre-repair tree hashes to 7b0d658e, the failed row's treeHash. It is the repaired working tree 79ea9077 with both files' earlier bytes. The repair differs from it only in scripts/lib/review-worker.mjs (2 lines added, 2 removed) and scripts/test-review-worker.mjs (5 added, 3 removed).",
    "Probes after the repair, each under the bounded wrapper: the rule's case passed alone, and scripts/test-review-worker.mjs passed 12 of 12. Two more cover suites neither complete run had reached and ran while the repair's reviewer worked: scripts/test-evidence-sources.mjs passed 6 of 6, and node scripts/test-plan-refutation.mjs --fixtures-only, the plan-refutation suite's own command, passed 136 of 136 in 0 h 1 min.",
    "Repair round 3: helper on Codex, codex-cli-exec 0.166.0, gpt-6.1-sol at max, from 7b0d658e to 79ea9077. It took 0 h 3 min (209,096 ms), used 802,327 tokens, read 56 files and left the checkout unchanged. It found 0 findings. The shared helper computes the same digest as both removed functions, so journal names, session keys and brief hashes keep their representation, and the rule admits the import spelling. The worker's own bounded probe could not start under the read-only sandbox (getconf DARWIN_USER_TEMP_DIR returned an input/output error), so the executor ran the cases above. Report: docs/control/local/reviews/WO-250/repair-2/round-3-combined.md. Usage after it (harness usage, observed 19:29:17Z): workers: launched 9 (claude 3, codex 6), re-tasked 1, cap 20, remaining 10; dispatch standing 3 h 16 min of 8 h 0 min, complete runs 2 of 20.",
    "Why it reached the complete run: no reviewer named the rule, and the helper-reuse case never ran during execution."
  ],
  "rejected": [
    {
      "option": "Add review-worker.mjs and its test to the rule's allowed list",
      "reason": "The list admits only reasoned exceptions, such as the prefixed sha256: export. These files need none, because the shared helper is the same digest."
    },
    {
      "option": "Rename the local digest so the rule does not match it",
      "reason": "That would keep the duplicate the rule exists to remove."
    },
    {
      "option": "Restart all three reviewers, or skip the round",
      "reason": "The repair is under fifty changed source lines, so it starts at round 3. It changes imports, which the skip rule does not cover."
    }
  ],
  "reopenWhen": "A later complete run fails on a repository rule over this order's new scripts, or a review finds that the import changed a digest."
}
```

## WO-250-D015

```json
{
  "id": "WO-250-D015",
  "date": "2026-11-02",
  "dispatch": "resume: verify; VER-001 independent report-recorder probe",
  "decision": "Record a nonblocking correctness finding in the new Agent report recorder. A prose report containing a fenced JSON example such as {\"value\":2} is treated as a structured change-review return, then rejected with invalid-result: change review result shape. Preserve the implementation during read-only verification and route the repair to a follow-up: the original acceptance criteria do not require the additional record subcommand, and main had no record subcommand to regress.",
  "evidence": [
    "docs/evidence/WO-250/verifier-001/probes.mjs, observe Agent prose recording with an embedded JSON example; the returned text and observed refusal are in independent-observations.json under agentProse.",
    "scripts/lib/review-worker.mjs recordAgentReview extracts everything between the first opening brace and the last closing brace, marks any successfully parsed JSON as structured, and sends it to validateChangeReviewResult. The prose fallback handles a parse failure only.",
    "docs/KIT.md documents worker record as recording an Agent worker's returned text; the existing helper fixture proves plain prose works, whereas this independent example shows an ordinary JSON example changes the route."
  ],
  "rejected": [
    {
      "option": "Fail criterion 1 or repair the implementation in verification",
      "reason": "Criterion 1 judges review launches, their briefs, reports, accounting and argv. It does not judge this extra recorder input, and the verifier never edits the implementation it judges."
    }
  ],
  "followup": "Preserve Agent prose reports that contain JSON examples in scripts/lib/review-worker.mjs recordAgentReview. Distinguish a claimed change-review result from incidental valid JSON in prose before invoking validateChangeReviewResult; continue rejecting malformed claimed result records. Cover a fenced {\"value\":2} example, plain prose, a valid schema object and a malformed claimed schema object in scripts/test-review-worker.mjs. Reproduction: docs/evidence/WO-250/verifier-001/probes.mjs, observe Agent prose recording with an embedded JSON example.",
  "reopenWhen": "The recorder's structured/prose discriminator is changed, or this input becomes a declared acceptance requirement."
}
```

## WO-250-D016

```json
{
  "id": "WO-250-D016",
  "date": "2026-11-02",
  "dispatch": "resume: verify; prior-review dispositions",
  "decision": "Carry the recorded design remainder from D011 without treating a preference as an unmet criterion. Rechecks and source inspection confirm the repair-cycle lane, fresh Codex counter, shared workerUse, content witness, current fixtures and Node data-option correction now hold. The retained provenance and metadata concerns below remain follow-ups; this verification adds their structured follow-up rather than leaving concrete defects only in a report or narrative disposition.",
  "evidence": [
    "Every execution and repair report is readable in docs/control/local/reviews/WO-250, including round 1, round 2, combined round 3 and both repairs' combined round 3. D011-D014 describe their dispositions.",
    "Round-1 design F4 and F11 point 3, their round-2 rechecks and current source: journalLaunch files only by dispatch session; the lifecycle hook also has an agent-specific key; reviewed Git tree objects have no retaining ref. These were recorded in D011, not claimed fixed.",
    "Round-1 design F7-F10 and F13 retain duplicate inventories, lane derivation and protocol dispatch paths. Source review confirms these maintenance concerns, while the independent fixtures and consumed complete row show no unmet original criterion. FUP-2ce66cf6a0602982, FUP-2c6f5a9f24ed56e1 and FUP-6dfaa29e3f0ba4fd already board the counting paths, cold-start costs and configurable limits."
  ],
  "rejected": [
    {
      "option": "Reopen implementation to consolidate every module and inventory",
      "reason": "No original criterion or reproduced main regression requires that redesign; the verifier is read-only and the ladder explicitly leaves other new findings for a follow-up."
    }
  ],
  "followup": "Resolve the concrete review-provenance remainder of WO-250-D011 design F4, F9 and F11: share the journal append/key contract with the lifecycle hook so a helper launched inside a phase worker records in the attributable lane; retain reviewed Git tree identities for as long as saved reports can be rechecked; and share reviews-lane derivation between the helper and close, with a stable planning-subject identity across UTC midnight. Check attribution, a saved recheck after Git object pruning, nested repair retention and a planning recheck crossing UTC midnight. Preserve the current criteria and retain the duplicate-inventory and dispatch-chain suggestions as design options until a concrete consumer requires them.",
  "reopenWhen": "A saved report loses its attributable journal or reviewed tree, a planning recheck crosses UTC midnight, or an allocated simplification can preserve the same public contract."
}
```

## WO-250-D017

```json
{
  "id": "WO-250-D017",
  "date": "2026-11-02",
  "dispatch": "resume: verify; independent verification and process corrections",
  "decision": "Judge the selected WO-250 subject against all nine original criteria without changing implementation, invoking more reviewers, integrating main or re-running its standing complete gate. The complete review row at code identity 46b342fee5ad221d1e9f6e4919f730c445eac30938ca71488864a9a4371738a3 stands; five product Preflight suites are explicit complete-row tasks and harness is a generated structural artifact, also checked directly. Finish the allocated report, refresh its decision projections, then run the document gate once at the final authored bytes and record the verdict. No-op would leave the authorized verification unfinished. The intended outcome is an independently supported verdict with the implementation preserved.",
  "evidence": [
    "verifier-001/evidence-identity.json and static-audit.json select the complete and structural rows without their nested stdout. The complete row was recorded at 2026-11-02T20:09:44.567Z, covers 47 required tasks, has exitCode 0 and stands at the current code identity. Current authored records change the document tree, so the older document row is not the final row consumed at handoff.",
    "verifier-001/verifier-format.txt: npm run format:check passed. review-worker-tests.txt: 12 of 12 helper fixtures passed. harness-wo250-tests.txt: three WO-250 generated-hook fixtures passed. harness-check.txt: 42 generated surfaces current. publication-check.txt: publication bootstrap checks pass.",
    "Independent probes vary fresh versus existing session counters, a zero cap, repeated tool identities, a three-use batch at nineteen, two reviewers reusing F1, a gate-script path used only as test-pattern data, a nested repair lane and an already-retained lane. Fake transports launch no model and the verifier spawns no agent.",
    "Process correction: several initial status, diff and combined report reads exceeded their output budgets, and two rg invocations used unquoted nonexistent globs or an assumed path. No missing or truncated text was treated as evidence. Canonical status was reread with the unrelated orders array omitted; source was reread by symbols and bounded sections; every review round was read from its finding/recheck fields and its dispositions; the map was located at docs/planning/work-order-map.md. Subsequent evidence reads select verdict-relevant fields and keep full logs out of the emitted batch.",
    "Process correction: an initial draft of this decision called harness a document-selection task without checking that classification. The checked scripts/test-runner.mjs marks it generated, excludes generated suites from ordinary selections, and structural-checks.mjs invokes generated-artifacts.mjs, whose harness artifact runs scripts/harness.mjs check. The complete row's generated structural task and the verifier's direct check supply the claim. The draft was corrected before filing; no verdict rested on the erroneous classification. Process correction: the first independent retention fixture manually created an unowned destination lane and failed with Unmarked temporary directory retained. That was a verifier setup error. The corrected fixture creates the earlier lane through retainWorktreeJournals itself, then adds current and repair reports; the focused rerun passed, preserving the earlier report and making the next retry a no-op. Preserve both the failed setup log and its passing correction in verifier-001.",
    "Actor readback from the verify briefing is Codex CLI 0.166.0, gpt-6.1-sol, selected effort max, source codex-session-readback. The order recommends xhigh; preserve the actual readback and do not change operator settings or claim effective effort. This transport exposes no root-session hard dollar-cap control, so the optional USD 5 verifier cap is unenforced."
  ],
  "rejected": [
    {
      "option": "Run another complete gate despite unchanged code identity",
      "reason": "The standing complete row is current; independent focused probes test the consequential claims without repeating that gate's work and waiting."
    },
    {
      "option": "Treat helper CLI sandbox limits or the pre-creation counting guarantee as new failures",
      "reason": "Those limits are declared in the order and its planning receipt; supported criteria are judged by their actual confinement and observable accounting rules."
    }
  ],
  "reopenWhen": "A criterion probe fails, the code identity changes, the final document gate fails, or an earlier report supplies contrary supported-input evidence."
}
```

## WO-250-D018

```json
{
  "id": "WO-250-D018",
  "date": "2026-11-02",
  "dispatch": "resume: verify; review-use estimate checked against the skip rule",
  "decision": "Board a nonblocking documentation clarification: product 07 says one ladder spends at least seven uses, but the stated skip rules allow a clean round one to finish with three. This wording repeats the order's known-issue estimate. The implemented one-use accounting, the guide's ladder, command and refusal rules, and all original acceptance checks still hold; do not turn the inaccurate secondary estimate into a new acceptance requirement or edit product text during read-only verification.",
  "evidence": [
    "docs/product/07-execution-guide.md, Verification review and attack: One ladder spends at least seven uses, followed by three round-one workers, up to three rechecks and one combined worker. The same section and contributor.ts run a recheck only for fixed findings and a combined round only after round-two fixes change code.",
    "docs/evidence/WO-250/verifier-001/probes.mjs, three clean round-one reviews use three admissions: the fake transport returns zero findings for criteria, design and consistency; the session counter reads three. short-ladder.txt records its passing focused run. Skipping both later rounds is the inference from those zero findings and the written skip conditions.",
    "The lower estimate is not a failure of criterion 2's observed counting or criterion 7's specified ladder, command, counting and refusal; each of those is independently exercised. The original known issue itself says at least seven, so the numerical clarification belongs in a follow-up."
  ],
  "rejected": [
    {
      "option": "Change the implementation or fail the original criteria on this secondary estimate",
      "reason": "The measured use count agrees with the implemented and documented admission and skip rules. The defect is the lower-bound wording."
    }
  ],
  "followup": "Correct the seven-use estimate in docs/product/07-execution-guide.md and its originating WO-250 known issue through the authorized documentation route: all three initial reviews, all three rechecks and one combined review total seven uses, optional rounds can reduce that total, and retries add uses. Preserve the skip and admission rules. Reproduce the three-use clean case with docs/evidence/WO-250/verifier-001/probes.mjs, three clean round-one reviews use three admissions.",
  "reopenWhen": "The guide's use estimate is revised, or a later planning pass calibrates review costs from completed cycles."
}
```

## WO-250-D019 — Final review: the judgment, the one correction and the recorder defect left boarded

```json
{
  "id": "WO-250-D019",
  "date": "2026-11-02",
  "dispatch": "resume: final review",
  "decision": "Pass WO-250 on the verified candidate. Integration took in nothing: main stands at 91a730ac, the activation base and the merge base, so no conflict, retime or re-mint arose and every verified claim carries forward on its original evidence. The code identity recomputed on the working tree with the gate's own gateCodeIdentity is 46b342fee5ad221d1e9f6e4919f730c445eac30938ca71488864a9a4371738a3, the identity of the executor's passing complete review row (recorded 2026-11-02T20:09:44.567Z, 47 required suites, exit 0), so that row is reused and no complete run is started; this review changes no source. One correction is made in product 07 §Verification review and attack, VER-001's second finding (D018): the sentence that said one ladder spends at least seven uses now says a full ladder spends seven, a skipped round spends fewer so three clean round-one reviews end the ladder at three uses, and a worker that returns no report costs its use and a retry. The order's known-issue line keeps its wording as the planner's estimate at filing, which a pass re-reads; a judged order's text is not edited in review. VER-001's first finding (D015), the Agent report recorder reading a prose report with a fenced JSON example as a claimed result and refusing it, stays boarded as FUP-60ea250ef102cc46 with its reproduction: it is outside the nine criteria, main had no recorder to regress, and a behavioral fix written by the reviewer would change the code identity, owe a complete run of about 0 h 39 min and reach the merge without independent verification; the next order or repair in the declared surfaces takes it within the Boy Scout bound. The release surfaces are written from their contracts: FINAL-001, the stored pull-request body with the meter block release preparation supplies, and the five-section release notes. The completion actor is Claude Code 2.1.316, model claude-fable-5-1 as the session states it, effort xhigh read from CLAUDE_EFFORT, above the declared reviewer minimum of high.",
  "evidence": [
    "npm run worktree -- integrate WO-250 printed 'Integration took in nothing: the worktree is not behind main.'; git rev-parse main and git merge-base main HEAD both print 91a730ac706a1933ebe9fb2c826455d8adffb4dc, and origin/main stands at the same commit.",
    "A session-scratch script importing gateCodeIdentity, gateTreeHash and readGateChecks from packages/skeleton/src/gate-evidence.mjs printed the identity 46b342fe… and the rows at it: the complete review row of 2026-11-02T20:09:44.567Z at tree 4f55c98a (47 suites, exit 0, 2,354,362 ms) and the document rows of 20:48:35Z and 21:04:34Z at earlier candidate trees.",
    "Under node scripts/harness.mjs bounded --, one process at a time: the three WO-250 cases of scripts/test-harness.mjs (3 of 3), scripts/test-review-worker.mjs (12 of 12), packages/skeleton/dist/test/subagent-budget.test.js (15 of 15), the ordered-handoff case of executor-supports (1 of 1), bash scripts/test-release.sh --case success (exit 0; the journal lane after close lists ./reviews/round-1-criteria.json and .md beside the journals), node scripts/check-role-oracle.mjs (passed) and the bounded role wording case of scripts/test-gate-followups.mjs (1 of 1); outside the wrapper git diff --check printed nothing and node scripts/structural-checks.mjs generated --build-phase-only reported runtime and harness CURRENT.",
    "docs/evidence/WO-250/verifier-001/probes.mjs 'three clean round-one reviews use three admissions' and short-ladder.txt record the three-use case; docs/product/07-execution-guide.md line 3043 read 'One ladder spends at least seven uses' before this correction; the order's known issue at line 508 carries the same estimate.",
    "D015's follow-up and its reproduction (probes.mjs, observe Agent prose recording with an embedded JSON example) stand in the register as FUP-60ea250ef102cc46; scripts/lib/review-worker.mjs recordAgentReview reads the slice from the first opening brace to the last closing brace and treats any parse as a claimed result.",
    "claude --version prints 2.1.316; CLAUDE_EFFORT reads xhigh; the order declares executor xhigh, verifier xhigh and reviewer high; the executor's completion actor is claude-opus-5-5 at max and the verifier's gpt-6.1-sol at max, each with session readback."
  ],
  "rejected": [
    {
      "option": "Fix the Agent report recorder in this review",
      "reason": "A source change moves the code identity and owes a complete run; the defect breaks no criterion and no behavior main had, its structured follow-up names the discriminator and the cases, and a reviewer-written behavioral fix would reach the merge with no independent verification."
    },
    {
      "option": "Edit the order's known-issue estimate",
      "reason": "The order is the judged text; its known issues are the planner's estimates at filing, which the pass re-reads, and the guide is the standing document a reader consults."
    },
    {
      "option": "Start a fresh complete run at the unchanged identity",
      "reason": "The identity, not the dispatch time, says what was tested; the row stands and the focused probes above reproduce the criteria's cases."
    },
    {
      "option": "Fail on the two verifier findings",
      "reason": "Both are follow-ups by rule: neither names an unmet criterion or a reproduced regression, and product 07 lists a finding fixed in a passing review once with the follow-up route."
    }
  ],
  "reopenWhen": "A completed ladder's recorded uses contradict the corrected estimate, a session is refused at the cap with re-tasks making up most of its counted uses, or a verifier cannot read a recorded Agent report because of the boarded recorder defect."
}
```

## WO-250-D020 — Final review: the register rows whose conditions this order met, and the rows left as matched

```json
{
  "id": "WO-250-D020",
  "date": "2026-11-02",
  "dispatch": "resume: final review",
  "decision": "Re-defer the five register rows whose conditions this order met, settle the row D019's correction discharges, and leave the other matched rows as they are with the readings below. FUP-957602bc42e32e1d (WO-217-D053), FUP-e08668268dea62b1 (WO-219-D009), FUP-eed385be08e5bdd9 (WO-226-D022) and FUP-8dd0eb609946b9d1 (WO-249-D025): their conditions occurred, because the ladder, the counting rule and the helper route changed every installed role root and re-minted the oracle as wo250-role-baseline.json, which the chain list in scripts/test-gate-followups.mjs selects; measured by that test's rule the executor reads 41,685 bytes against its effective 40,194, the verifier 36,409 against 35,221, the planner 27,362 against 24,576, the reviewer 38,832 within 39,600, release-close 25,891 within 26,410, the refuter 25,513 with no ceiling and the router 16,379 within 16,384; D007 boards the three overruns as FUP-2c6f5a9f24ed56e1 under product 07's one route, no ceiling moved and no acceptance was recorded. FUP-005a8af5234cb3f3 (the skeleton protocol validator kit): its condition occurred in substance, because this order paid a live feedback episode (D012), edited verification-protocol.ts and added change-review-protocol.ts, a sixth protocol file carrying its own object, exact, check, invalid and nonEmpty helpers; consolidating the group is a shared-module change across feedback-judged sources that owes its own episode, so it stays with planning. FUP-9d3a966d2dedca36 (D018): settled, because D019 corrected the guide's estimate; the order's known-issue line stays as the planner's filed estimate. Left as they are: FUP-67a3ccb3b295200e, whose 2026-11-01 disposition already names what this order counts and whose condition (a session exceeding the cap on an uncounted path) has not occurred; FUP-770baf2f452c669e, because this order edits the shared launch and fan-out sentences every role carries, not the planner's entropy sentence that is the row's seam; FUP-912adb42a652b75f, because the product 07 correction is judged by a fresh document gate and claims no cached product pass; FUP-dfde4050da06d43b, because the sequence failure did not recur: the ladder ended at 18:37Z before the first complete run started at 18:48Z, and each repair's round 3 finished before the next run; FUP-bfab19adc5e5eac1, because the one lost launch (D009) was an output bound, not a deadline, and the change review's new 60-minute limit sits above its 30-minute budget; the hook rows FUP-911dc28a35dc4c44, FUP-be6721fbdd4b6285 and FUP-dc138fc0fac6a3fc and FUP-589642d0e0c714c8, because this order's harness-host.ts edits are the worker gate, the kit and re-task admissions and the target hook's use plumbing, not the target resolution, the outside-write path or the release-close admission; FUP-13db0bc45db31d8d and FUP-53a2c609d6815549, because the entropy-review.mjs edits move the launch and correct costFrom, not the target subject resolution or targetLensBriefs; this order's own rows FUP-2c6f5a9f24ed56e1, FUP-2ce66cf6a0602982, FUP-6dfaa29e3f0ba4fd, FUP-2bcb656e4fc1e7f6 and FUP-60ea250ef102cc46, which planning triages; and the remaining rows, which name a path or this order in their text only.",
  "evidence": [
    "npm run plan -- followups --touching at register revision 5dcfc9b4… read 250 pending rows and 35 matched over five pages, paged with --cursor from a session-scratch script.",
    "D007's measurements and wo250-role-baseline.json: executor 41,685, verifier 36,409, planner 27,362, reviewer 38,832, release-close 25,891, refuter 25,513, router 16,379; node scripts/check-role-oracle.mjs and the bounded role wording case pass under the bounded wrapper in this review.",
    "packages/skeleton/src/change-review-protocol.ts defines refuse, check, invalid, object, exact and nonEmpty beside the five files FUP-005a8af5234cb3f3 names; D012 records the live feedback episode.",
    "D011: the ladder's usage line was observed at 18:37:20Z and the first complete run started at 18:48:28Z (D013); the repairs' round 3 ended at 19:05:38Z and 19:28:16Z before the runs that followed (D013, D014).",
    "npm run plan -- followups --apply with the six requests as one batch at register revision 5dcfc9b4…: every request applied, five deferred and one settled; the register revision after the write is 1316fba3d59aa1f72f10573ea202d97ceaaecc6b29c117eab7a4710613bc6396."
  ],
  "rejected": [
    {
      "option": "Dispose every matched row on its textual match",
      "reason": "A match is a pointer for judgment; the rows left name seams this order does not open, and a disposition on a match alone would misstate what happened."
    },
    {
      "option": "Allocate the protocol validator kit to this order or a repair",
      "reason": "The consolidation crosses feedback-judged sources and owes a live episode of its own; it is planning's allocation, not a review's adjacent repair."
    }
  ],
  "reopenWhen": "A planning pass evaluates instruction-byte optimization or the protocol validator kit, a records merge brings a disagreeing disposition on one of these rows, or a later review finds a left row's seam opened by this order."
}
```
