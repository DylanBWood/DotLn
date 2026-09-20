# WO-140 decisions

## WO-140-D008 — Repair the stored-stream test that a long live verifier episode pushed past the engine's string limit

```json
{
  "id": "WO-140-D008",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "The first npm test -- --review failed one suite, skeleton, in 'WO-047 complete Decision bytes match across stored skeleton streams', subtest 'feedback verifier', with RangeError: Invalid string length. The test replays the current feedback edition's stored verifier stream, which this order had to re-record because it changes four pinned feedback sources. The live claude-cli-print verifier ran 324 s and the stream holds 320 WorkerHeartbeat events against 34 in WO-144's; every replayed decision carries the 1.7 MB pinned capsule, so the decisions array serializes to 1,126,723,411 bytes, past the engine's single-string limit. The helper compared JSON.stringify of the whole array and the diagnostic measured it the same way. Both now work one decision at a time: equal length and equal serialization of every element, and the byte count summed as brackets, commas and elements. The assertion and the printed number are unchanged in meaning. The immutable edition is kept; the gate was rerun.",
  "evidence": [
    "Gate log, 2026-09-20T03:35:42Z: npm test: 28 passed; 1 failed; 504.95 s; 73 fresh tasks; skeleton 374 tests, 372 pass, 2 fail (the subtest and its parent)",
    "docs/evidence/WO-140/feedback/selfhost-verification.jsonl: 330 events, 1,824,138 bytes, 320 WorkerHeartbeat; docs/evidence/WO-144/feedback: 44 events, 34 WorkerHeartbeat; the two large events (VerificationOpened 1.1 MB, CommandPersisted 0.58 MB) are the same size in both",
    "After the repair the subtest passes and prints '330 complete decisions; 1126723411 identical serialized bytes'; the five other stored streams print the byte counts they printed before",
    "Equivalence, executed: on packages/skeleton/fixtures/wo029-legacy-scenario.jsonl the whole-array byte length and the per-decision sum are both 280,279",
    "packages/skeleton/test/scenario.test.ts is not among evidenceSources.feedback, and all five evidence checks pass after the edit"
  ],
  "rejected": [
    { "option": "Record a feedback revision 001 from a shorter live run", "reason": "A third live episode to fit a test helper, with a duration nobody controls; the next slow verifier would fail the same way. About 315 events is the threshold." },
    { "option": "Drop heartbeats from the recorded stream", "reason": "The edition is immutable evidence of what the live host emitted." },
    { "option": "Skip the feedback verifier subtest or cap it", "reason": "That asserts less. The per-decision comparison asserts the same bytes." },
    { "option": "Change how the reactor carries the capsule in every decision", "reason": "A product change far outside this order, made for a test's convenience." }
  ],
  "followup": "Planner: replayed decisions for a verification workstream each carry the full pinned capsule, so a stored live stream costs about 1.7 MB per event to replay and compare; 330 events is 1.1 GB of serialization in one skeleton subtest (8 s here). Decide whether heartbeats should be coalesced when a live episode is recorded as evidence, or whether decision projections should reference the capsule instead of embedding it.",
  "reopenWhen": "A stored stream again fails or dominates the skeleton suite's time, or another consumer of the feedback edition serializes the whole decisions array."
}
```

Mission and critical path: the gate has to be green on this order's own evidence, and the evidence was honest; the instrument was what broke. Rule beating is the trap to name: a test edited to reach green must keep its claim, so the equivalence was executed, not asserted, and the printed byte count is the same number. Shifting the burden: leaving it would hand the next order whose verifier runs slowly the same red suite. Fixes that fail: re-recording until a run happens to be short would pass once and fail again. Drift, escalation, commons, policy resistance, seeking the wrong goal and success to the successful: no assertion removed, no edition replaced, no extra live episode. Naive Interventionism: eleven lines in one test helper. NoOp leaves the gate red.

## WO-140-D007 — Judge the cost line at the result transition, and repair what one adversarial pass reproduced

```json
{
  "id": "WO-140-D007",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "The operator asked for one subagent to test the change adversarially; it ran read-only against the worktree, in scratch. It reproduced no blocking defect and eleven smaller ones. Repaired here: a probe file the host will not remove is reported as written-unremoved instead of thrown, and detection as a whole never throws; every present marker is probed, so a Codex sandbox that inherits CLAUDECODE no longer fails open; the refusal prints the inside command for the same selection and omits it when nothing would remain; --list honours --inside-sandbox; partialGateCheck reads any non-false partial value or any non-empty-array exclusion shape as partial; stamped report paths outside the two receipt directories are never read. The cost line may be indented or a list item, a fenced example is not the line, a counter is a plain or comma-grouped integer of tokens, a source is not unknown, none, n/a, tbd, not or is, and a cause is the code that directly follows the word, with a second mentioned code refused as ambiguous. Most consequentially, verification-result and final-review-result now judge a stamped report's cost line beside its actor header, before the event is appended.",
  "evidence": [
    "Subagent report, 2026-09-20T03:10Z, 945 s, 83 tool calls, git status hashed identically before and after: Seatbelt profile denying file-write-unlink made detectGateSandbox throw EPERM and left two probe files; with both env markers and only the Git directory denied, detection returned claude-code, not in force; mutants dropping EPERM and EROFS from the denied codes, and dropping the partial flag from partialGateCheck, each left 5 of 5 fixtures green; '- **Process cost:** unknown; cause no-session' was refused as 'found 0'",
    "docs/verifications/WO-144/VER-002.md:279 and docs/final-reviews/WO-144/FINAL-001.md:280 write their cost sentence as a list item, so a bulleted line is the likely honest form",
    "The verifier skill forbids replacing a filed VER; before this change the first judge of a stamped receipt was meta --check, after the receipt was immutable: the deadlock class D004 rejected for sibling worktrees, reached by a different road",
    "scripts/resume.mjs already refuses a result transition whose report lacks one matching machine-readable actor header; the cost line is judged at the same place, and 'unknown; cause <code>' is always available, so no measurement is ever required to hand off",
    "scripts/test-resume.sh: a missing line, a bare unknown and a bulleted unknown with date digits are each refused by verification-result and append no event; a bulleted counters line is admitted; the verify and final-review briefings are asserted to end with the admitted forms",
    "scripts/test-runner.test.mjs, 37 of 37: probe classification per code with an injected open; a removal failure; two markers with the second denied; a throwing probe; a real Seatbelt denial under CLAUDECODE reading EPERM, skipped where sandbox-exec is unavailable or nested; every partial and exclusion shape under the npm test identity; --list --inside-sandbox",
    "scripts/test-process-debt.mjs: the agent's admit and refuse lists, and metaMain(['--check'], root) refusing a stamped bare unknown",
    "Eighteen synthetic receipts in eight fixture files gained an admitted cost line, because their lifecycles allocate stamped receipts"
  ],
  "rejected": [
    { "option": "Leave the document check as the first judge, as the order's text reads", "reason": "A receipt filed with an honest bulleted line would turn npm run test:docs red with no legal repair, since the report may not be replaced." },
    { "option": "Advise at the result transition instead of refusing", "reason": "An advisory prints and the event still appends; the receipt is immutable either way." },
    { "option": "Stop judging a receipt once its result is recorded", "reason": "That inverts the rule: the filed receipt is the record planning reads." },
    { "option": "Record a refusal reached through harness evidence as something other than a failing npm test row", "reason": "harness evidence records any failing gate that way, a failing row is accepted by no consumer, and the row carries no work order, so the meter ignores it." },
    { "option": "Change observed-facts' substring match on gate identities in this order", "reason": "Advisory only, in a declared feedback source outside this order's citations; boarded below." },
    { "option": "Explain the rule at more length in the role text", "reason": "The verifier has 399 bytes of headroom; the transition's refusal prints the forms, which is where an author meets them." }
  ],
  "followup": "Planner: packages/skeleton/src/observed-facts.ts:327 matches a hedged quantity to a gate row with part.includes(gate.checkId); 'npm test -- --inside-sandbox' contains 'npm test', so a hedge about a partial run can resolve to the full gate's duration, or to unmeasured when both rows are in scope. Advisory only. Prefer the longest matching identity.",
  "reopenWhen": "A result transition is refused for a cost line its author could not have written honestly; a receipt reaches the document check without having passed the transition; or a third harness marker or a new denied-write error code is observed."
}
```

Mission and critical path: the receipt is the planning record, so the rule has to be met while the receipt can still change. Fixes that fail was the live trap and the agent found it: my first design guarded siblings against an immutable receipt and then created the same trap for the order's own verifier. Rule beating: the tightened patterns refuse a mention that only looks like a record, and admit the bulleted form authors already use. Shifting the burden: the refusal prints the two forms at the moment of writing instead of leaving a later gate to explain. Escalation and commons: no gate, hook or field was added; one subagent, read-only, against a cap of twenty. Seeking the wrong goal: surviving mutants were treated as missing fixtures, not as noise, including the one code a real sandbox returns. Drift, policy resistance and success to the successful: nothing was waived to reach green. Naive Interventionism: the substring match in observed-facts is boarded, not patched, because it is outside the cited sources and only advisory. NoOp on the completion check is rejected above.

## WO-140-D006 — Set each session's own usage line aside in the briefing comparison, and gate with the review selection

```json
{
  "id": "WO-140-D006",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "The briefing now prints 'DotLn session: <id>. Usage readback: node scripts/harness.mjs usage <id>' for every role dispatch, and a resumed Codex session receives the same line from the session report. The line is per session, so the process-debt comparison of a recording session's briefing with a resumed session's now asserts that each session is given its own line and then sets it aside, the same shape WO-144 gave the per-session scratch path. The executor gate for this order is npm test -- --review, because the order changes packages/skeleton/src/harness-host.ts and the machinery suites that declare it run only under that selection.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts managedUsageCommand admits exactly 'node scripts/harness.mjs usage <id>', plain for a safe id and shell-quoted otherwise; usageReadbackCommand prints those same two forms",
    "scripts/test-process-debt.mjs 'WO-131 prompt submission stays open ...' compares two sessions' briefings byte for byte after normalizing the scratch key; read before the change, it would fail on any per-session line",
    "docs/evidence/WO-144/decisions.md WO-144-D010 followup: a deterministic process-debt failure passed one implementation, two repairs and three verifications because npm test without --review never selected the suite",
    "After the edit: the WO-131 comparison and both WO-140 process-debt cases pass"
  ],
  "rejected": [
    { "option": "Strip the usage line from the comparison without asserting it", "reason": "That makes the comparison assert less. The per-session line is what this order adds, so it is asserted for each session before it is set aside." },
    { "option": "Print the line only in resume.mjs", "reason": "In Claude Code resume.mjs runs as the hook's child and never sees the host session id; the hook owns that id and already prints the per-session scratch path beside it." },
    { "option": "Gate with plain npm test", "reason": "It omits process-debt, harness-fixtures and runner-fixtures, the three suites whose declared sources this order changes." }
  ],
  "reopenWhen": "A briefing consumer needs the recording session's id rather than its own, or a harness delivers a session id the usage command cannot read back."
}
```

Mission and critical path: the usage command existed and the session could not find its subject; one printed line removes that search. Seeking the wrong goal and rule beating: a green comparison that hid the new line would have met the test and missed its purpose, so the line is asserted first. Drift to low performance: the WO-144 follow-up named this exact failure shape, and the review selection is the cheapest instrument that sees it. Shifting the burden, escalation, commons, success to the successful, policy resistance and fixes that fail: no new hook, gate or recurring step; one line of context per dispatch. Naive Interventionism: the line is printed, never required. NoOp leaves every receipt hunting for an id.

## WO-140-D005 — Raise the reviewer cold-start ceiling by one 4 KB step; leave the verifier's unchanged

```json
{
  "id": "WO-140-D005",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Raise limits.coldStartBytes.reviewer from 20,480 to 24,576 in docs/control/budgets.json in this change, with a dated acceptance naming the two rules, and trim nothing. The verifier ceiling stays at 20,480. The operator authorized raising the limit in this dispatch when the breach was reported.",
  "evidence": [
    "node scripts/harness-context.mjs --check after regeneration: reviewer 21,299 bytes in both generated roots against 20,480, verdict breach before the raise; verifier 20,081 against 20,480, within (21,274 and 20,056 before D007 lengthened one sentence by 25 bytes)",
    "git show HEAD:.claude/skills/dotln-reviewer/SKILL.md: 14,646 bytes; installed CLAUDE.md 5,788; before 20,434, after 21,299, delta 865; the verifier moved 19,216 to 20,081 by the same 865 bytes",
    "docs/product/07-execution-guide.md Discipline, the cold-start rule: a reviewed rule that breaches a ceiling raises it in the same change by one 4 KB step with the rule named, never trimmed around",
    "Operator message during resume: next, 2026-09-19: 'i authorize just upping the limit'",
    "docs/control/budgets.json acceptances: WO-054 and WO-139 raised ceilings by the same route"
  ],
  "rejected": [
    { "option": "Shorten the two new rules until the reviewer fits", "reason": "The order and product 07 forbid trimming a reviewed rule to fit; 819 bytes of the two rules would have had to go." },
    { "option": "Cut another reviewer rule", "reason": "The order says never trim another rule to fit." },
    { "option": "Raise the verifier ceiling as well", "reason": "It measures 20,081 against 20,480 and does not breach; an unbreached ceiling is not raised." },
    { "option": "Record a dated acceptance at the old ceiling and leave the breach advisory", "reason": "The 2026-09-17 direction names the raise as the normal route, and the operator authorized it here." }
  ],
  "reopenWhen": "A later reviewed rule brings the reviewer above 24,576 bytes or the verifier above 20,480, or the efficiency pass the operator deferred on 2026-09-18 re-measures the role skills."
}
```

Mission and critical path: the role text is how a cold reviewer learns to run the gate where it can pass; the ceiling exists to notice growth, not to delete rules. Drift to low performance is the named trap: a ceiling that silently rises reads as no ceiling, so the measured bytes, the delta and the rule are recorded beside the raise. Rule beating: shortening the text to pass the meter would have kept the number and lost the instruction. The other traps, Naive Interventionism and NoOp: one number and one acceptance row; NoOp leaves a breach that product 07 says is never left advisory across orders.

## WO-140-D004 — A receipt is new when the transition that allocated it stamped the cost-line duty

```json
{
  "id": "WO-140-D004",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "verify and final-review stamp costLine: 'required' on the VerificationRequested or FinalReviewRequested event they append. The document check reads the control segments, judges only stamped receipts whose report file exists, and requires exactly one physical '**Process cost:**' line that records entry and handoff counters with their source, or exactly one cause code from the closed list hooks-fallback, no-session, harness-no-readback. It runs inside the existing meta --check, which npm run test:docs already runs, so the suite inventory is unchanged; D007 adds the same judgment at the result transition, before the receipt is immutable. The verify and final-review briefings print the two admitted forms, and the verifier and reviewer skills carry the rule.",
  "evidence": [
    "The order's objective (c) and criterion 5: refuse a bare unknown in a new receipt while every existing receipt passes; non-goals: no retroactive edits to existing receipts, no change to the gate's inventory",
    "Existing receipts phrase cost freely (docs/verifications/WO-144/VER-002.md 'Process cost at handoff ...', docs/verifications/WO-143/VER-001.md a '## Goal alignment and process cost' section), so no existing line format could be enforced on them",
    "VER reports are immutable (verifier skill: never replace an older VER), and product 07 Independent workflows has final review integrate main into a sibling order whose receipts were written earlier",
    "packages/skeleton/src/harness-host.ts recordDispatch spawns scripts/resume.mjs <action>, so one stamp site serves Claude Code and Codex",
    "scripts/lib/control-store.mjs folds the stamped events unchanged: scripts/test-resume.sh passes and asserts the stamp on VER-001, VER-002 and FINAL-001 and on no other event",
    "node scripts/meta.mjs --check exits 0 on this repository: no existing event is stamped, so no existing receipt is judged",
    "scripts/test-process-debt.mjs WO-140 receipt case: an unstamped bare unknown passes; a stamped one is refused by name; an allocated, unwritten report is skipped; counters with a source, one cause code, and a partial counter with one cause code are admitted; two codes, or complete counters with a code, are refused"
  ],
  "rejected": [
    { "option": "A baseline list of the receipts that exist today; anything else is new", "reason": "A sibling worktree's VER written before it integrates this rule is not on the list, cannot be edited, and would refuse that order's document gate at final review with no legal repair." },
    { "option": "A cutoff date or a work-order number in the check", "reason": "The same sibling deadlock, and a literal where the order asks for content." },
    { "option": "A new document suite for the check", "reason": "The order fences the gate's inventory; meta already protects process records and already refuses in --check." },
    { "option": "A new receipt field or a structured JSON cost block", "reason": "Declined by the order: no receipt field beyond the cost line." },
    { "option": "Change the shared Process Cost support text", "reason": "It reaches every role and every evidence edition; the order expects only the verifier and reviewer skills to grow." },
    { "option": "NoOp", "reason": "One receipt since 2026-09-13 reports an entry measurement; a bare unknown hides whether the cause is the hooks, the session or the harness." }
  ],
  "reopenWhen": "A fourth cause is observed (add a code in scripts/lib/receipt-cost.mjs, product 07 and the role text together), a stamped receipt legitimately cannot state either form, or executor handoffs are asked to carry the same line."
}
```

Mission and critical path: process cost is a planning input only when a missing number says why it is missing. Rule beating is the main trap, and the closed list is the guard: a free-text reason would pass any check and say nothing. Fixes that fail and policy resistance: a rule that refuses immutable receipts would have been bypassed or reverted at the first sibling integration, which is why newness is carried by the allocating event. Escalation and commons: no gate, hook or field is added, and the line never refuses completion. Seeking the wrong goal: the line records; it sets no budget. Shifting the burden, drift and success to the successful: the session is handed its id and command rather than asked to search. Naive Interventionism: nothing existing is touched. NoOp is rejected above.

## WO-140-D003 — A partial run has its own identity, and exclusions disqualify a row under any identity

```json
{
  "id": "WO-140-D003",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "--inside-sandbox always removes the suites that need the outside and records the check as 'npm test -- --inside-sandbox' with partial: true and excludedSuites, whether or not a sandbox is in force. findGateCheck and reviewedProductGate, the two functions behind all four product-gate consumers, additionally reject a row that is partial or names exclusions under any checkId. --inside-sandbox with nothing left to run is an error. The runner accepts an injected suite table so a fixture drives the real runGate.",
  "evidence": [
    "scripts/test-runner.mjs before the change: every selection except --only, --document and --machinery recorded under 'npm test', and findGateCheck matched that identity by code identity alone",
    "Consumers, read in source: scripts/lib/lifecycle-evidence.mjs (final-review-result) through findGateCheck; scripts/worktree.mjs publish and scripts/release.mjs close both through reviewedProductGate in scripts/lib/release-records.mjs",
    "scripts/test-runner.test.mjs WO-140 consumer case: at one code identity the partial row, a copy relabelled 'npm test', and a relabelled copy with the partial flag stripped are rejected by the lookup, the lifecycle transition and reviewedProductGate, and the following full run is accepted by all of them",
    "Mutation check, 2026-09-19: removing the partial guard from findGateCheck fails that case on 'the exclusions alone mark a partial result'; disabling the refusal fails the preflight case; both restored and 5 of 5 pass"
  ],
  "rejected": [
    { "option": "Rely on the distinct checkId alone", "reason": "It holds only while every writer labels correctly; the order says no consumer accepts the row, and the exclusions are the fact that disqualifies it." },
    { "option": "Make --inside-sandbox a no-op outside a sandbox and record 'npm test'", "reason": "The same flag would then produce gate evidence or not depending on an environment the row's reader cannot see." },
    { "option": "Stub every product suite in a fixture repository", "reason": "About twenty-five stubs plus the release template, for the same coverage the injected table gives in three rows." },
    { "option": "NoOp", "reason": "A subset run recorded under 'npm test' would be consumed as a complete gate by publication and release close." }
  ],
  "reopenWhen": "A consumer of product-gate evidence appears that reads rows without findGateCheck or reviewedProductGate, or a partial result is proposed as evidence anywhere."
}
```

Mission and critical path: release close consumes one reviewer row without rerunning anything, so that row's meaning is the product's release claim. Rule beating and seeking the wrong goal: a green partial is the cheapest way to a green row, and the guard is on what the row left out rather than on what it is called. Shifting the burden: consumers do not each learn a new identity; two functions refuse for all four. Escalation, commons, drift, policy resistance, success to the successful and fixes that fail: no new gate or step; the full path is byte-for-byte what it was. Naive Interventionism: the table seam is an argument with a default. NoOp is rejected above.

## WO-140-D002 — Recognize the harness by its marker and establish the sandbox by a denied write

```json
{
  "id": "WO-140-D002",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "scripts/lib/gate-sandbox.mjs holds a closed marker list: CLAUDECODE with the probe directory .claude/hooks, and CODEX_SANDBOX with the resolved Git directory. A marker alone never refuses. One exclusive create in each present marker's protected directory decides; EPERM, EACCES or EROFS means in force, anything else, including a missing directory, a refused removal or a probe that throws, fails open, and a created probe file is removed (D007 records the two repairs). The probe runs only when the selection contains a suite that needs the outside, and the recorded check carries the observation in a sandbox field. The refusal precedes the build, the diagnostics directory and every suite.",
  "evidence": [
    "This session, 2026-09-19, Claude Code, attended: CLAUDECODE present; a write under .claude/hooks succeeded and /usr/bin/sandbox-exec -p '(version 1)(allow default)' /usr/bin/true exited 0, so the marker is inherited while no sandbox is in force, the exact case the order's design names. The probe file was removed",
    "code.claude.com/docs/en/sandboxing, Protected paths, read 2026-09-19: inside the working directory the sandbox denies writes to .claude/hooks, .claude/skills, .claude/agents, .claude/commands and the settings files, no allowWrite entry lifts it, and only filesystem.disabled turns it off. The page documents no dedicated in-sandbox variable; it documents that TMPDIR differs between sandboxed and unsandboxed commands",
    "github.com/anthropic-experimental/sandbox-runtime README, read 2026-09-19: no SANDBOX_RUNTIME variable is documented",
    "docs/evidence/WO-044/decisions.md: EPERM for shell writes under .claude/hooks and .claude/skills; docs/final-reviews/WO-121/FINAL-001.md L1: .claude/hooks/** is on the sandbox's write-deny list",
    "github.com/openai/codex AGENTS.md, read 2026-09-19: CODEX_SANDBOX=seatbelt is set on processes spawned under Seatbelt",
    "docs/product/07-execution-guide.md Operator resume phrases: Codex workspace-write protects the resolved Git directory",
    "Inference, labelled: a Codex Seatbelt sandbox refuses the nested sandbox-exec as the Claude one does, because docs/final-reviews/WO-068/FINAL-001.md shows the refusal is sandbox_apply: Operation not permitted from the operating system, not from a harness rule. No in-sandbox Codex gate run is recorded",
    "scripts/test-runner.test.mjs WO-140 cases: refusal names the suite and the exact outside command and leaves no build, suite, check row or gate marker; a writable probe directory does not refuse, records inForce false and leaves no probe file; no marker records no sandbox field; a fixture repository without the protected directory fails open on ENOENT"
  ],
  "rejected": [
    { "option": "Refuse on SANDBOX_RUNTIME or another assumed variable", "reason": "Neither public source documents one and this repository records none; an invented marker is a guess." },
    { "option": "Refuse on the marker alone", "reason": "This session carries the marker with no sandbox in force; it would refuse every attended outside run, which the order forbids." },
    { "option": "Use the nested sandbox-exec itself as the probe", "reason": "The order specifies a denied-write probe, and sandbox-exec exists only on macOS." },
    { "option": "Open an existing hook file for append instead of creating a file", "reason": "A read-only mode on that file would read as a sandbox; the recorded observation is a denied write under the directory." },
    { "option": "Probe on every run and record the field always", "reason": "A selection that needs nothing from the outside should pay nothing, and nested fixture runs against the real root would write beside a live gate." },
    { "option": "Claude Code only, Codex fails open", "reason": "Both the marker and the protected directory are sourced for Codex; the unobserved part is recorded as an inference with its reopening condition." },
    { "option": "NoOp", "reason": "191 to 515 s of gate wall-clock per sandboxed attempt plus its diagnosis, in seven recorded receipts." }
  ],
  "reopenWhen": "A harness changes or documents its marker or protected paths; a gate inside a sandbox is observed to run its outside-only suites to failure instead of refusing; a Codex in-sandbox run contradicts the labelled inference; or filesystem isolation is disabled while Seatbelt still refuses nested profiles, which today fails open."
}
```

Mission and critical path: the verifier's first gate attempt should be one that can pass. Fixes that fail is the governing trap: a refusal that misfires on an attended outside run would cost more than the failure it prevents and would be switched off, so the marker is never sufficient and every uncertain reading runs the gate as before. Seeking the wrong goal: the probe establishes the denied write, which is the cause, not the harness's name. Shifting the burden and policy resistance: the refusal prints the command, and the unsandboxed approval stays the operator's. Escalation, commons, drift, rule beating and success to the successful: one create and unlink, under a millisecond, only when needed. Naive Interventionism: outside a sandbox in force the selection, identity and row are unchanged. NoOp is rejected above.

## WO-140-D001 — Declare from the receipts: skeleton only; the hooks denial is the probe, not a suite cause

```json
{
  "id": "WO-140-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Only skeleton declares needs: outside-sandbox. release does not. No suite is declared for the .claude/hooks/** denial, because no receipt shows a suite failing on it; that denial is used as the Claude Code probe path instead. The order's cost paragraph and criterion 3 attribute one of WO-121 VER-001's two in-sandbox suite failures to the hooks denial; the receipt shows otherwise, and this decision records the difference instead of declaring a suite to match the sentence.",
  "evidence": [
    "docs/verifications/WO-121/VER-001.md Executed checks: the two failing suites were skeleton cases 129/130, 'sandbox-exec refused its local probe', environmental, and release:case:runtime_refresh, finding F1, reproduced outside the sandbox as well",
    "docs/final-reviews/WO-121/FINAL-001.md L1: the .claude/hooks/** denial refused git merge, git checkout --theirs and node scripts/harness.mjs emit, which are commands, not suites",
    "In-sandbox gate runs naming skeleton as the environmental failure: WO-049 VER-002, WO-051 VER-001, WO-052 VER-001 (10 skeleton failures), WO-121 VER-001 and VER-002, WO-122 VER-001, WO-134 VER-001, WO-141 VER-001 (10 nested-sandbox cases); docs/final-reviews/WO-068/FINAL-001.md O4 names the cause",
    "docs/verifications/WO-134/VER-001.md L1: release:case:conflict and release:case:success failed once inside on 'unable to create temporary file: Invalid argument'; release passed inside the sandbox in every other receipt above",
    "The order's objective (a): a failure inside the sandbox is never by itself a reason to declare",
    "skeleton-docs runs the same files under the [document] name pattern, which the WO-068 native cases do not match"
  ],
  "rejected": [
    { "option": "Declare a suite for the hooks denial to match criterion 3's wording", "reason": "No receipt names one; a declaration without an observed environmental cause would remove a suite from every in-sandbox run for nothing." },
    { "option": "Declare release for its temporary-root failure", "reason": "It passes inside the sandbox in seven of eight receipts, so it can pass there; one intermittent failure is the case the order's rule excludes." },
    { "option": "Skip the native cases inside the sandbox instead of declaring the suite", "reason": "Declined by the order: outside-only suites are never skipped silently. WO-121's own native case does skip cleanly; aligning the two WO-068 cases is separate work." }
  ],
  "followup": "Planner: WO-140's cost paragraph and criterion 3 say one of WO-121 VER-001's in-sandbox suite failures was the .claude/hooks/** denial; the receipt shows skeleton's nested sandbox-exec, and the hooks denial refused git merge and harness emit in FINAL-001. Correct the sentence at the next planning pass, and decide whether the two WO-068 native cases should skip under a refused probe as WO-121's case does (WO-121 VER-001 O3), which would let skeleton drop the declaration.",
  "reopenWhen": "A receipt names a suite that cannot pass inside a harness sandbox for an environmental cause, including a write under .claude/hooks; release fails inside on temporary roots reproducibly; or the WO-068 native cases learn to skip and skeleton passes inside."
}
```

Mission and critical path: the declaration is what makes the gate refuse, so a wrong one costs every sandboxed session a suite it could have run. Seeking the wrong goal and rule beating: matching the criterion's sentence would have met its words against the evidence the hard rule puts first; the difference is stated and handed to planning. Drift to low performance: an intermittent failure is not promoted to a permanent exclusion. Shifting the burden: the defect in release stays a defect. Escalation, commons, policy resistance, success to the successful and fixes that fail: one declaration, as content. Naive Interventionism: the smallest set the receipts support. NoOp, no declaration, leaves the preflight with nothing to refuse.
