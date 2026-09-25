# WO-158 decisions — Lifecycle off-ramps

Dispatch: `resume: next` on 2026-09-25, recorded by the Claude session hook
(`npm run resume -- next`). Claude Code 2.1.282 executor, model
`claude-opus-5-5`, effort `xhigh` (the session exports `CLAUDE_EFFORT=xhigh`,
observed with `printenv`; the operator selected `ultracode` for this session).
Authority: `docs/work-orders/WO-158-lifecycle-off-ramps.md`. Operator
check-in: no operator message arrived between dispatch and handoff
(actor-attested; no inbox readback exists).

## WO-158-D001

```json
{
  "id": "WO-158-D001",
  "kind": "experiment",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Adopt focused runs for iteration on the hook fixtures this order adds, with the full suite kept as the check before handoff: the full run caught a regression the focused runs did not.",
  "question": "The order adds tests to scripts/test-harness.mjs, whose harness-fixtures suite is recorded at about 176–180 s in review rows. Can iteration on the order's own cases use `node --test --test-name-pattern 'WO-158'` instead of the full suite, keeping one full run before handoff, without letting a regression through?",
  "alternatives": [
    "Run the full harness-fixtures suite (`node scripts/test-runner.mjs --only harness-fixtures`) on every iteration",
    "Iterate with `node --test --test-reporter=tap --test-name-pattern 'WO-158' scripts/test-harness.mjs` and run the full suite once the code settles"
  ],
  "observation": "Focused: 11.65 s real for the three WO-158 cases (2 failing, both fixed within the same loop). Full: 151.05 s real, which failed three WO-125 F3 cases the focused run could not see: the new read-only list admitted `node scripts/harness.mjs writer --show` from a nested working directory, where a same-named script is not the reviewed one. After the fix, a focused run over 'WO-125 F3|WO-158' passed 7 of 7.",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 163,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p node --test --test-reporter=tap --test-name-pattern='WO-158' scripts/test-harness.mjs",
      "/usr/bin/time -p node scripts/test-runner.mjs --only harness-fixtures"
    ],
    "source": "Shell `time -p` real seconds of the two measured runs (11.65 + 151.05); both runs were also required work. Token attribution per command is unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": 279,
    "tokensPerOrder": null,
    "commands": [
      "node --test --test-name-pattern '<order cases>' scripts/test-harness.mjs",
      "node scripts/test-runner.mjs --only harness-fixtures"
    ],
    "summary": "Two iterations ran focused instead of full: 2 × (151.05 − 11.65) s ≈ 279 s saved in this order. The full run stays mandatory: it found the nested-helper admission that no focused pattern named."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-24",
    "experimentsSinceAdoption": 3
  },
  "evidence": [
    "docs/evidence/WO-155/decisions.md WO-155-D002 (adopted, 2026-09-24) is the latest adopted experiment; WO-156-D002, WO-114-D002 and WO-111-D002 followed it, all declined",
    "Recorded review-row durations for harness-fixtures: 175,776–179,754 ms (main checkout checks.json, read by the mapping agent)"
  ],
  "rejected": [
    {
      "option": "Focused runs only, no full run before handoff",
      "reason": "The full run found the WO-125 F3 regression that the focused runs missed."
    }
  ],
  "reopenWhen": "A full harness-fixtures run before handoff finds a failure in a case the order's focused pattern covered, or the suite's full time falls below about 30 s."
}
```

## WO-158-D002

```json
{
  "id": "WO-158-D002",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 design and criterion 1",
  "decision": "Four typed events folded by scripts/lib/control.mjs: CriterionWaived, WorkOrderWithdrawn, RecordCorrected and OperatorOverrideRecorded, each appended through the existing appendTransition path so it carries the actor attestation and its own recovery checkpoint. The fold validates each event's shape (actor, reason, capture and digest, disposition, correctable field names, subject ordinal before the correction, override lists) and throws with the line number on a malformed one; legality stays in the resume route, as for the nine existing events. New fold fields default to undefined, so every recorded history folds to its recorded shape. The routes are listed beside the lifecycle's next actions as `legalOffRamps` in status --json and current.md, not inside `legalNextActions`.",
  "evidence": [
    "scripts/lib/control.mjs before this order: nine event types, no guards (the order's citation lines 57–160)",
    "scripts/test-control-segments.mjs deep-equals foldSegments(legacy) with docs/evidence/WO-030/legacy-fold.json; the resume suite passes with the new fields undefined",
    "An event appended without checkpoint fields sets checkpointUnavailable (control.mjs); the routes use appendTransition, and scripts/test-off-ramps.mjs asserts a checkpoint on OperatorOverrideRecorded",
    "The session hook's phrase dispatch, the console board and scripts/test-resume.sh consume legalNextActions as lifecycle progression"
  ],
  "rejected": [
    {
      "option": "Phase guards in the fold for the new events",
      "reason": "The fold has no guards for any event; a hand-appended event is judged by the same storage-integrity rules, and the routes refuse illegal phases before any append."
    },
    {
      "option": "Add the four routes to legalNextActions",
      "reason": "Every phase's action list and its consumers (phrase dispatch, console board, twelve test expectations) would change meaning; off-ramps are side routes, not progression."
    },
    {
      "option": "One generic Exception event",
      "reason": "Declined by the order: the four differ in legality and projection."
    }
  ],
  "reopenWhen": "A consumer needs a route listed among the next actions, or a hand-appended off-ramp event in an illegal phase is observed."
}
```

## WO-158-D003

```json
{
  "id": "WO-158-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 2 and receipt 028 known issue on criterion 2",
  "decision": "The executor refusal for `waive` reads the harness session journals (docs/control/local/harness/<sha256(id)>.json) of every non-empty session variable the command carries (CODEX_THREAD_ID, COPILOT_AGENT_SESSION_ID, CLAUDE_CODE_SESSION_ID, CLAUDE_SESSION_ID), and the journal of a live writer reservation's holder, which is keyed by the hook's own session id and cannot be renamed by the command's environment. Any of them recording role executor for this order refuses the waiver; a journal with no recorded order (a session opened by `resume: status`) does not. Every waiver and withdrawal records `recordingSession: { role, capture }`, where capture is `created-during-session`, `created-before-session` or `unobserved` from the capture file's birth time against the session's start. The capture is an observation of timing, not of authorship. `waive` also refuses a criterion id the order's numbered acceptance criteria do not declare.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts statePath: the session journal is keyed by sha256(session_id) and records role, workOrder and startedAt",
    "harnessOutputs lists untracked files with --exclude-standard, so authoredPaths never names an ignored intake capture",
    "scripts/test-off-ramps.mjs: an executor journal refuses the waiver under CLAUDE_CODE_SESSION_ID, with CODEX_THREAD_ID renamed, with CLAUDE_CODE_SESSION_ID blanked beside CLAUDE_SESSION_ID, and under COPILOT_AGENT_SESSION_ID; a live writer reservation held by the executor refuses it with no session variable; a status-only journal is not an executor; a verifier journal records role verifier and capture created-during-session; criterion 9 of a two-criterion order is refused",
    "Adversarial review (D020) findings 0, 11, 16 and 23"
  ],
  "rejected": [
    {
      "option": "A --role flag on waive",
      "reason": "A self-declared role is rule beating: the recording session would assert its own eligibility."
    },
    {
      "option": "Refuse a capture written by the recording session",
      "reason": "The ordinary path is the session that hears the operator's words capturing them, as plan override does; refusing it would push waivers back into prose."
    }
  ],
  "reopenWhen": "A CriterionWaived event whose recordingSession is a non-operator role with capture created-during-session is shown to carry words the operator did not give (receipt 028's reopen condition), or an executor session records a waiver of its own order."
}
```

## WO-158-D004

```json
{
  "id": "WO-158-D004",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 design (operator acts) and criterion 2",
  "decision": "`waive` and `withdraw` take `--capture <path> --capture-hash sha256:<digest>`, the exact flag pair and checks of `plan override --capture`: a path under the configured intake root without `..`, a contained regular file with non-blank bytes whose SHA-256 equals the stated digest, ignored by Git and untracked. The event stores both the path and the digest. `override-record` accepts the same pair optionally, because the hook supplies it only when it retained the operator's words. The shared checks live in scripts/lib/off-ramps.mjs; plan-receipts.mjs keeps its own copy with its committed-reader check.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs overridePlanHold: digest, intake path, hash match, check-ignore, untracked",
    "The order's dispatch syntax shows only --capture; its Cost line requires 'an ignored-intake capture path and SHA-256 in the plan override --capture shape'",
    "scripts/test-off-ramps.mjs: a malformed digest, a mismatched digest and a tracked file outside intake are each refused and append nothing"
  ],
  "rejected": [
    {
      "option": "Compute the digest inside resume from --capture alone",
      "reason": "The stated digest binds the event to the bytes the recorder read, as the plan override shape does; a computed one binds whatever the file holds at append time."
    },
    {
      "option": "Refactor plan-receipts.mjs onto the shared helper now",
      "reason": "Its check also consults the committed subject reader and its fixtures pin message text; the refactor buys no behavior in this order."
    }
  ],
  "reopenWhen": "The two capture checks diverge in a way a fixture observes, or a third caller needs them."
}
```

## WO-158-D005

```json
{
  "id": "WO-158-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criteria 1 and 3, operator-review assumption 2",
  "decision": "`withdraw` is legal from every phase except closed and withdrawn, and from `none` only for an order the log already knows (an allocated derived order never activated). `withdrawn` is settled like `closed` wherever a consumer asks 'is this order in flight': openOrders, meta's selected and active sets and budget rows, the test runner's gate attribution, resident binding, and the session hook's expected completion event and Stop completion/evidence obligations (reading your own output still applies). The index lists a withdrawn order in its Closed section with a `- Withdrawal:` line, and in the proposed order unchecked as `withdrawn: <disposition>`, because a check means a passing final review. A typed hard, satisfied-by-close or planning-deferral dependency on it is `unmet` with `detail: withdrawn` and its disposition; a satisfied-by-release edge keeps its release remedy, because a release, not the order's close, meets it. The sequence topology check skips a withdrawn edge as it would a closed one while activation still refuses it. current.md shows a withdrawn order in its own wo-NNN branch; on main it leaves the projection like any settled order. Its legal actions are `activate` alone, printed as the in-place `npm run resume -- activate <id> <path>`, and it has no legal off-ramps.",
  "evidence": [
    "Mapping inventory of every `phase === \"closed\"` comparison (control-store, dependencies, work-orders, meta, test-runner, worktree-integration, worktree finish, release, resident-bind, harness-host)",
    "scripts/test-work-orders.mjs WO-158 case: Closed section, unchecked withdrawn: superseded, 'hard (unmet: withdrawn)', topology refusal for an active prerequisite and admission for a withdrawn one",
    "scripts/test-off-ramps.mjs: activation of a dependent is refused naming the withdrawal; readDependencies reports unmet/withdrawn/failed; every refusal in withdrawn prints the in-place activate command",
    "scripts/test-derived-orders.mjs WO-158 case: an allocated draft in phase none lists withdraw as its one off-ramp and is withdrawn (abandoned) into the Closed section",
    "Adversarial review (D020) findings 5, 6 and 7"
  ],
  "rejected": [
    {
      "option": "Count a withdrawn order as closed in closedDependencySet",
      "reason": "A withdrawal claims no success; a closure with a passing final review is what hard and satisfied-by-close edges require."
    },
    {
      "option": "Treat a withdrawn planning-deferral target as met",
      "reason": "The deferral waited for that order to land, which will not happen as filed; the dependent is re-planned with a dated note."
    }
  ],
  "followup": "Next order that touches worktree lifecycle (WO-160 is the nearest): give a withdrawn order a publication and teardown route; worktree finish and publish require a closed order today, so a withdrawn order's segment reaches main only by an operator merge.",
  "reopenWhen": "A withdrawn order's worktree cannot be published or removed when the operator asks, or a consumer treats a withdrawn order as in flight."
}
```

## WO-158-D006

```json
{
  "id": "WO-158-D006",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 3",
  "decision": "Do not project a control beacon for a withdrawn order: the v2 codebook encodes exactly eight phases in its file-size code, so the previous beacon remains and ages to stale after BEACON_STALE_AFTER_MS (20 minutes). resume skips the projection for phase withdrawn instead of printing the projection-unavailable warning.",
  "evidence": [
    "packages/skeleton/src/control-codebook.mjs: phases active..closed, phaseRadix 8, MAX_V2_CODE and MAX_GROUP_CODE derived from them",
    "The codebook, beacon-v3-codebook and control-beacon.ts are registered in every evidence edition's commonSources"
  ],
  "rejected": [
    {
      "option": "Encode withdrawn as an unused closed/fail code point",
      "reason": "Readers would decode a closed order."
    },
    {
      "option": "Extend the codebook with a ninth phase in this order",
      "reason": "A versioned beacon change re-derives every constant and every consumer's decoder, outside this order's named sources."
    }
  ],
  "followup": "Next beacon codebook revision: add a withdrawn phase (or an explicit settled state) so a withdrawn order's beacon is current rather than stale.",
  "reopenWhen": "A constellation reader is misled by a withdrawn order's stale beacon, or the codebook is revised for another reason."
}
```

## WO-158-D007

```json
{
  "id": "WO-158-D007",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 design ('activate from withdrawn requires a changed order revision with a dated note') and criterion 3",
  "decision": "WorkOrderWithdrawn records the authority's SHA-256 as orderHash and the SHA-256 of each `**Reactivation (YYYY-MM-DD):** <why>` line it already holds. `activate` from withdrawn refuses an unchanged authority, and refuses a changed one unless some reactivation line absent from the withdrawn revision is dated on or after the withdrawal's recordedAt date; every note is read, not only the first. Activation resets every off-ramp projection, so a reactivated order leaves withdrawn in status, current.md and the index.",
  "evidence": [
    "WorkOrderActivated records no authority hash, so the withdrawal must carry the comparison value",
    "scripts/test-off-ramps.mjs: unchanged, changed without note, and a note dated 2000-01-01 are each refused; a current-dated note activates, and status shows phase active with no withdrawal or waivers (receipt 028's criterion 3 reopen condition); a second withdrawal refuses the first cycle's note plus a blank line and admits a second new note appended below it",
    "Adversarial review (D020) finding 1"
  ],
  "rejected": [
    {
      "option": "Accept any ISO date anywhere in the changed authority",
      "reason": "A date already in the filed order would satisfy it without saying why the order returns."
    }
  ],
  "reopenWhen": "A reactivation needs a note form this one cannot express, or a reactivated order still reads withdrawn in any projection."
}
```

## WO-158-D008

```json
{
  "id": "WO-158-D008",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 4 and FUP-eba6a79fc106bd28",
  "decision": "`correct <ordinal|report-path>` corrects model, effort, source, harnessVersion, reportPath, checkpointRef or checkpointSha of an event in the order's current activation. A report path resolves against each event's effective (corrected) path, to the latest such event with an actor, else the latest. `verdict` is refused by name with its routes (a later VER-NNN, a failing final review), and any other field is refused as not correctable; the command writes no report. Each field must exist on the subject and change; the event records `previous` from the effective value (chaining earlier corrections). A report path moves only on a recorded result (VerificationCompleted or FinalReviewCompleted), only to a normalized, contained path whose file is the subject's own `<report id>.md`, so a verdict never rests on another report and a pending allocation's cost and criterion judgments stay on its allocated path. A checkpoint ref must be the order's and resolve to the stated commit. A correction never records `claude-session-readback`: only the session that appended the event read its CLAUDE_EFFORT, so setting that source is refused, and an effort correction on a readback event must also set a non-readback source. The `ultra` spellings are refused in favor of the recorded level. The fold applies attestation corrections to the attested completion they name, recomputes effort drift, marks the actor `correctedBy: [ordinals]`, and moves a corrected report path into the latest or failure-source path it names. The completion refusal for an effort that disagrees with a readable CLAUDE_EFFORT already exists (WO-157 item 11, parseActor) and is kept; with no readable CLAUDE_EFFORT (Codex, Copilot, a shell) nothing is refused for its absence.",
  "evidence": [
    "scripts/resume.mjs parseActor: 'this Claude Code session exports CLAUDE_EFFORT=<value>; attest --effort <value> --source claude-session-readback rather than ...'",
    "scripts/test-off-ramps.mjs: verdict and body refused; report SHA-256 unchanged after a model/effort correction; latestAttestation corrected with correctedBy; effort drift high -> xhigh after the readback and VER-002 corrections; a checkpoint correction to a mismatched commit refused and to the activation checkpoint admitted; final-review-result with CLAUDE_EFFORT=xhigh and --effort high refused with the readback value",
    "Receipt 028 known issue on criterion 4: the refusal's behavior without a readback was unspecified",
    "scripts/test-off-ramps.mjs: a rebinding to VER-001.md and a correction of the pending VerificationRequested are refused; a readback effort correction is refused alone and admitted with source operator-attested; effort=ultra is refused",
    "Adversarial review (D020) findings 2, 21, 27 and 28"
  ],
  "rejected": [
    {
      "option": "Correct events of an earlier activation",
      "reason": "Their projections are gone after reactivation; a correction there would have no reader."
    },
    {
      "option": "Apply corrections in `resume usage`, meta and the console",
      "reason": "Those read raw event actors for cost attribution; changing them is a separate projection decision (follow-up)."
    }
  ],
  "followup": "Next order that touches usage or meta attribution: decide whether `resume usage`, meta and the console board apply RecordCorrected values; today only status, current.md and the index do.",
  "reopenWhen": "A completion records an effort that disagrees with a readable CLAUDE_EFFORT (FUP-eba6a79fc106bd28's condition), or a reader of usage or meta is misled by an uncorrected actor."
}
```

## WO-158-D009

```json
{
  "id": "WO-158-D009",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 2 (report convention)",
  "decision": "A report judges a criterion once, on one line outside code fences, as a paragraph, a bullet or numbered item, or a quotation: `**Criterion <id>:** met`, `**Criterion <id>:** unmet`, or `**Criterion <id>:** unmet, waived by <ordinal>`. Fences follow CommonMark (a fence closes only on its own character, at least as long). `verification-result` and `final-review-result` refuse a pass over an unwaived unmet line, any line naming a waiver ordinal that is not this criterion's CriterionWaived event in the current activation, a met line that claims a waiver, an unmet line that omits the waiver the log holds, and conflicting lines for one criterion. A fail with an unmet line is admitted. Indented text is judged like any other line, the conservative direction. Reports without criterion lines are not judged, so every filed report keeps its meaning.",
  "evidence": [
    "No existing code parses criterion verdicts (grep of scripts and packages); the verdict comes from the completion's argv",
    "scripts/test-off-ramps.mjs: VER-001 with `**Criterion 2:** unmet` refuses pass and records fail; after the waiver VER-002 refuses the plain unmet line and passes with `unmet, waived by <ordinal>`; the judge refuses numbered, quoted and after-a-long-fence unmet lines and conflicting lines, and ignores lines inside a tilde fence holding backticks",
    "Adversarial review (D020) finding 3"
  ],
  "rejected": [
    {
      "option": "Require a line for every acceptance criterion in every new report",
      "reason": "That changes what a verification judges, a non-goal; the order asks for the waived form."
    }
  ],
  "reopenWhen": "A pass is recorded over an unmet criterion written in another form, or a verifier needs a criterion id this line cannot express."
}
```

## WO-158-D010

```json
{
  "id": "WO-158-D010",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator-directed boy-scout item FUP-9ac70adcd20de223 on WO-158's catalog row",
  "decision": "Grant the scratchpad Claude Code prints for the session as a new closed outside-write kind, `host-scratchpad`: /tmp/claude-<uid>/<project key>/<session id>/scratchpad, where the project key is the transcript path segment before `<session id>.jsonl` (or the session's subagent directory) and both segments must be single safe names. Only a Claude Code session derives it; without a transcript path nothing is granted. The contributor grant gains the effect and every role the grant row.",
  "evidence": [
    "This session: TMPDIR is /var/folders/.../T while the host printed /private/tmp/claude-501/-Users-dylanwood-Projects-DotLn-wo158/<session>/scratchpad, and ~/.claude/projects/-Users-dylanwood-Projects-DotLn-wo158/<session>.jsonl names the same project key",
    "docs/planning/work-order-map.md candidate 3 and FUP-9ac70adcd20de223: 'the grant admits that one directory and not /private/tmp'",
    "scripts/test-harness.mjs WO-158 scratchpad case: the session's scratchpad (main and subagent transcripts) is granted; another session, another project, the parent directory, /tmp, a missing transcript, a traversal segment and a Copilot session are refused"
  ],
  "rejected": [
    {
      "option": "Derive the project key from the working directory",
      "reason": "Claude Code's sanitizing rule for characters other than '/' is unobserved; the transcript directory is the host's own name for it."
    },
    {
      "option": "Grant /tmp/claude-<uid>",
      "reason": "It would admit every session's and project's scratchpad."
    }
  ],
  "reopenWhen": "A refusal for the host-printed scratchpad recurs after WO-158 closes (FUP-9ac70adcd20de223), or Claude Code is observed placing it outside /tmp/claude-<uid>."
}
```

## WO-158-D011

```json
{
  "id": "WO-158-D011",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 6 and receipt 028 known issue on criterion 6",
  "decision": "A live gate admits the fixed read-only list through `liveGateReads` in harness-command.ts, judged for every stage of every pipeline and command list: cat, head, tail, wc, ls, grep, `sed -n` with a script whose every command prints, `git diff|log|show|status|stash list` without an output or external-program option, and, at the worktree root only, `node scripts/harness.mjs writer --show` and `npm run resume --silent -- status`. A stage with a redirect operand, heredoc, environment prefix or wrapper, parameter expansion or unquoted glob character is not on the list; descriptor duplication passes. The tokenizer now records per word whether an unquoted, unescaped `*?[]{}~` appeared, so a fully quoted grep pattern is admitted and `\"N\"[0-9]` is not. A Git read carrying a `%G` signature placeholder is not on the list, and a Git read is admitted only while `git config --get-regexp` finds no fsmonitor, diff.external, diff command or textconv driver, clean/smudge/process filter, log.showSignature, gpg.program or gpg.<format>.program. The refusal text names the list. Writes and unlisted programs keep today's refusal.",
  "evidence": [
    "WO-142-D012: plain Git reads refreshed the index, ran fsmonitor, a clean filter and gpg.program in an isolated Git 2.55.0 probe",
    "scripts/test-harness.mjs WO-158 live-gate case, all three pre-tool hooks: 21 listed reads admitted; twelve refused (sed w script, redirect onto a gate input, piped tee, --output, git stash, git -c, piped sort, rg, unquoted glob, ls redirect, two %G placeholders), each naming the list; seven configured programs refuse a Git read",
    "The full harness-fixtures run found the nested-directory helper admission (D001), fixed by admitting helpers only at the root",
    "Adversarial review (D020) finding 9: `git log --format=%GG` ran a configured gpg.program in a temp repository; the list now refuses %G and the configuration check reads gpg.* program keys (test-harness: two %G reads refused; gpg.program and gpg.ssh.program refuse Git reads); git 2.55 was observed rejecting abbreviated --output and --ext-diff spellings"
  ],
  "rejected": [
    {
      "option": "Widen readCommand, the activation read vocabulary",
      "reason": "It also feeds the outside-write and planning-branch guards and the WO-142 B3 fixtures."
    },
    {
      "option": "Admit plain Git reads whatever the configuration",
      "reason": "D012 observed configured programs running; the configuration check closes those while leaving the index stat refresh as the recorded residual of FUP-9e2be6bfac0708fe."
    }
  ],
  "reopenWhen": "A pipeline containing an unlisted or writing program is admitted during a live npm test (receipt 028's condition), or a gate input is observed changed by an admitted read."
}
```

## WO-158-D012

```json
{
  "id": "WO-158-D012",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 5 and receipt 028 known issue on criterion 5",
  "decision": "The embedded operator control keeps the operator's own prompts while an override is open (the entry prompt and each later prompt, 64 KiB, in its session-local 0600 state outside the repository; an analysis pause carries them) and, at an explicit off that closes an override, returns `overrideExit` with the entry and exit times, the words and the exact advisory command. The generated hook then imports the pinned runtime instead of printing the exit alone; recordOperatorOverride checks the pins, requires an open selected order whose legalOffRamps include override-record, is judged by the same live-gate and writer-isolation boundaries as a tool call, writes the words as docs/intake/operator-override/<date>-<session>-<time>.md (named only if Git ignores it), and runs `resume override-record --bypassed dotln-hook-enforcement --effects unobserved` with the capture and the hook's own actor observation (CLAUDE_EFFORT as claude-session-readback when readable, else the hook input's effort as hook-input, else unknown/unobserved; model unknown). Anything that stops it, including a runtime that cannot load, prints the exit message with the advisory command. With no open order (closed, withdrawn or none selected) no route can append it, and the advisory directs the override and what it changed to the order's decisions; OperatorOverrideRecorded stays illegal in closed, where an append would dirty a merged segment, and in withdrawn, which is terminal. scripts/operator-control.mjs (Codex) prints the same advisory. `analysis: off` records nothing.",
  "evidence": [
    "Before this order the exit overwrote the state without reading it and returned before any runtime import, so no event could be appended",
    "scripts/test-harness.mjs WO-158 override case: a real resume in the fixture appends OperatorOverrideRecorded at ordinal 2 with both prompts in a capture whose digest matches, actor claude-code/high/claude-session-readback; analysis off appends nothing; a missing runtime prints the command and appends nothing",
    "scripts/test-process-debt.mjs WO-131 operator-control cases pass unchanged",
    "Adversarial review (D020) finding 4"
  ],
  "rejected": [
    {
      "option": "Record the override as a precondition of leaving it",
      "reason": "Declined by the order: recovery never blocks (WO-131)."
    },
    {
      "option": "Infer effects from git status or the transcript",
      "reason": "Hooks are suspended during an override, so nothing attributes a change to it; `unobserved` is the truthful value and the role records the effects in decisions."
    }
  ],
  "followup": "Next order that touches operator control: a session that ends without `operator override: off` still appends nothing; surface an open override at the next session start for the same worktree.",
  "reopenWhen": "An OperatorOverrideRecorded event lacks the operator's words while the state retained them, or a session journal shows an override with no matching record after a clean off."
}
```

## WO-158-D013

```json
{
  "id": "WO-158-D013",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 7",
  "decision": "Every generated role (both harnesses, including release-close) gains one shared off-ramp sentence after the session commands; the verifier and reviewer sentences gain the criterion-line form; the outside-write line names host-scratchpad. Product 07 §Operator recovery controls gains 'Implemented in WO-158', the resume-phrase table four rows, and the live-gate vocabulary the read-only list; docs/verifications/README.md, AI-HARNESS-SECURITY.md, sequence.md and product 03 follow. Cold-start bytes after emit (CLAUDE.md plus skill): executor 25,819 of 29,246; verifier 22,698 of 25,151; reviewer 23,780 of 24,576; release-close 14,649 of 16,384; planner 16,797 of 24,576; refuter 16,372 (no ceiling). No ceiling is breached, so no acceptance row is recorded. The byte-exact role oracle moves to packages/skeleton/fixtures/wo158-role-baseline.json, chained to wo157-role-baseline.json by its SHA-256, as WO-157-D022 did.",
  "evidence": [
    "node scripts/harness-context.mjs --check: every role 'within', refuter 'unset'",
    "npm run harness -- check: 31 generated surfaces",
    "scripts/test-process-debt.mjs 'WO-145 optional economy support preserves historical snapshots through WO-158': pass"
  ],
  "rejected": [
    {
      "option": "Per-role variants of the off-ramp sentence",
      "reason": "The reviewer had 1,505 bytes of headroom; one shared sentence plus two short clauses fits all roles (receipt 028 known issue on criterion 7)."
    }
  ],
  "reopenWhen": "coldStartBytes.reviewer exceeds 24,576 (receipt 028's condition), or a role acts on an off-ramp its sentence does not name."
}
```

## WO-158-D014

```json
{
  "id": "WO-158-D014",
  "date": "2026-09-25",
  "dispatch": "resume: next; release classification (minor, standing opt-out default)",
  "decision": "Assign application v0.48.0, the next minor above the local v0.47.1 tag, in the heading, the README claim and the roadmap's Release boundary. Compiler 0.18.0 -> 0.19.0 (grant kind, hook template, operator control) with COMPILER_PACKAGE_VERSION; skeleton 0.40.0 -> 0.41.0 (classifier, host, loadout); console keeps 0.2.0 with its pins moved; kernel is unchanged. HARNESS_HOST_VERSION stays 0.34.0: it has not tracked the skeleton version since 0.34.0 (skeleton advanced to 0.40.0 without it). The lockfile moved only the workspace versions; `npm install --package-lock-only --ignore-scripts` also ran npm's default audit request against the public registry, which sends package names and versions and nothing private.",
  "evidence": [
    "git tag: v0.47.1 is the newest local tag; npm run release -- check-surfaces --local passes; npm run release -- prepare --local: 'WO-158 target v0.48.0 remains current'",
    "git log -G'HARNESS_HOST_VERSION' packages/skeleton/src/version.ts: last change 0.33.1 -> 0.34.0 in 7bd4e78e"
  ],
  "rejected": [
    {
      "option": "Bump console",
      "reason": "Its source is unchanged; check-surfaces requires only the pins."
    }
  ],
  "reopenWhen": "A sibling order publishes v0.48.0 first (final review retimes under the existing classification), or check-surfaces requires another component."
}
```

## WO-158-D015

```json
{
  "id": "WO-158-D015",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 criterion 8",
  "decision": "Mint every stale edition once, after the last registered-source edit, as WO-158 revision 001 selected in docs/evidence/current.json: authority, artifact identity and verification by --write then --check, and feedback by carrying the live audit of docs/evidence/WO-114/feedback-001 (no live episode). The order's Cost line names only the harness and authority editions, but the compiler release 0.19.0 (D014) moves the artifact-identity compiler version and the feedback policy hash, and the verification edition was stale on its check. The console's self-host fixtures were re-pinned with evidence:console --record-current-selfhost. A first set of 001 editions, never committed or judged, was removed and re-minted after Prettier reformatted registered sources that the format suite required.",
  "evidence": [
    "Before the mint: authority-evidence --check 'stale WO-114 revision 002 evidence: authority.json'; evidence:artifact --check stale WO-154/001; evidence:verification --check 'stale verification evidence: events.jsonl'; feedback-evidence --check 'a compiler release moved the policy hash ... carry its live audit ... (no live episode)'",
    "After the mint: authority-evidence --check verified; evidence:artifact --check verified 4 files in docs/evidence/WO-158/artifact-identity/001; evidence:verification --check verified 4 files; feedback-evidence --carry 'only component release labels moved; no live episode' and --check verified ten passing regressions; evidence:console --check selfhost, control, refutations and missing match; harness-evidence 31 current generated surfaces",
    "None of the order's edited files is in FEEDBACK_SOURCE_PATHS (packages/skeleton/src/feedback-audit.ts), so no live feedback episode is owed (WO-154 D001)",
    "npm run test:docs after the mint: 21 passed, 0 failed"
  ],
  "rejected": [
    {
      "option": "Re-mint only the harness and authority editions, as the Cost line names",
      "reason": "The other three editions fail their checks after the compiler release; leaving them stale fails test:docs."
    },
    {
      "option": "Run a live feedback self-host episode",
      "reason": "The judged behavior is unchanged and the carry route exists for a pins-only move."
    }
  ],
  "reopenWhen": "A registered source changes on this branch after this mint, or final review's integration finds a sibling edition selected in current.json."
}
```

## WO-158-D016

```json
{
  "id": "WO-158-D016",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: next; adjacent repair met in the process-debt suite",
  "decision": "The process-debt fixture teardown's permission walk skips an entry that vanishes while it walks, as the removal after it already tolerates Git's background maintenance.",
  "misread": "The teardown comment covered gc residue during removal only; the permission walk before it also races the maintenance lock.",
  "meant": "A fixture's teardown result is decided by its assertions, not by whether a maintenance lock disappears mid-walk.",
  "changed": "writableOwnedTree in scripts/test-process-debt.mjs returns on ENOENT.",
  "evidence": [
    "First process-debt run: 'WO-146 credit-only and incomplete-token logs remain recordable' failed in its after hook with ENOENT lstat .git/objects/maintenance.lock; the same case passed on the next run with no change"
  ],
  "rejected": [
    {
      "option": "Record it as a flake and rerun",
      "reason": "A bounded fix in the same function the existing comment already hardens is cheaper than every later order meeting it."
    }
  ],
  "reopenWhen": "A process-debt teardown fails on another vanishing Git file."
}
```

## WO-158-D017

```json
{
  "id": "WO-158-D017",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: next; adjacent repair met at release assignment",
  "decision": "The planning continuation admits a release label appended with one space to a title filed with no placeholder and no label, exactly as it admits a label replacing `(version assigned at activation)`; any other title change still needs a receipt.",
  "misread": "The continuation assumed every order is filed with the placeholder; the 2026-09-25 pass filed WO-158 to WO-165 without it.",
  "meant": "Assigning the classified release at activation is an admitted execution update for every filed order.",
  "changed": "releaseAssignment in scripts/lib/plan-continuation.mjs, and executionAmendmentSource given the filed source normalizes such a label back to the filed title, so amend-order still sees a label-only change as no amendment (review finding 8); placeholder-filed orders and every recorded amendment row normalize as before. A WO-158 case in scripts/test-plan-refutation.mjs admits `(v1.2.3)`, refuses a missing space, a non-strict version, two labels and a renamed title, and checks the amendment normalization.",
  "evidence": [
    "npm run plan -- check after the heading edit: 'planning pass needs a receipt matching the current subject: existing work-order bytes changed'",
    "git show of the filing commits: WO-111, WO-114, WO-155, WO-156 and WO-157 were filed with the placeholder; WO-158 to WO-165 at 1f888509 without it",
    "After the change: npm run plan -- check exits 0 with a release-assignment update v0.48.0; plan-refutation suite passes"
  ],
  "rejected": [
    {
      "option": "Amend the order through amend-order",
      "reason": "That route binds an operator scope expansion; using it for a routine release label would be rule beating."
    },
    {
      "option": "Leave the heading without a version",
      "reason": "release prepare requires exactly one strict version in the heading, and preparing the release is an executor duty."
    }
  ],
  "reopenWhen": "A title change other than one appended strict label passes the planning check, or an order filed without the placeholder cannot take its label."
}
```

## WO-158-D018

```json
{
  "id": "WO-158-D018",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-158 write-back duty",
  "decision": "At close the register rows this order discharges are disposed through the register's own route, `npm run plan -- followups --apply <request.json>`: FUP-e468ee64ac00c70a (WO-111-D019's terminal route; WO-160 still owes the amendment-row withdrawal), FUP-eba6a79fc106bd28 (the readback refusal and the correction route) and FUP-9ac70adcd20de223 (the scratchpad grant). The order's phrase 'retargeted through the adjacent queue' does not match the code: the queue's `retarget` action relinks only a deferred local queue item to a register id and never changes a register row, and this worktree has no queue items. Whether to waive WO-111's criterion 2 or withdraw WO-111 stays the operator's call; no retroactive event is appended (a non-goal).",
  "evidence": [
    "scripts/lib/adjacent-queue.mjs retarget: requires item.status deferred and sets disposition.target",
    "scripts/lib/planning-followups.mjs disposeFollowup and refute-plan.mjs followups --apply",
    "npm run adjacent -- list: no items in this worktree"
  ],
  "rejected": [
    {
      "option": "Dispose the rows now, before verification",
      "reason": "The rows are discharged by a closed order; before close the reopen conditions of the allocations still govern."
    }
  ],
  "reopenWhen": "The reviewer at close finds a different route named for register dispositions."
}
```

## WO-158-D019

```json
{
  "id": "WO-158-D019",
  "date": "2026-09-25",
  "dispatch": "resume: next; Goal Alignment",
  "decision": "Mission and path: the order moves recurring rescue out of prose into typed events and projections, the platform lens's 'typed event, a projection' form; it enables no lettered critical-path gate (receipt 028: throughput and record-truth machinery). Traps: policy resistance — the waiver and the verification judge interact by design and do not undo each other; escalation — four routes replace eighteen hand events and are braked by the executor refusal and the capture; tragedy of the commons — about 640 bytes per cold start, within every ceiling; drift to low performance — no ceiling raised; shifting the burden — the operator acts still carry the operator's words, and the correction and override routes remove hand edits; rule beating — a self-authored capture is observable (D003), and the planning relaxation admits only one strict label (D017); seeking the wrong goal and success to the successful — immaterial: the routes reuse existing shapes and displace nothing. Naive Interventionism: the fold, status and index keep their recorded shapes for histories without off-ramps (legacy-fold comparison green); the live-gate list only adds admissions. NoOp: the catalog's improvisation continues, WO-111 keeps receipts that read 'no operator exception recorded', and read-only refusals keep costing verification turns.",
  "evidence": [
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md §3 and §4",
    "docs/planning/refutations/2026-09-25-planning-cb4e4076b7ec0078-028.json WO-158 record (aligned-with-findings, six known issues)"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "The order is authorized and the catalog's cost recurs in every later order."
    }
  ],
  "reopenWhen": "Off-ramp records per order grow without a matching fall in hand corrections, or machineryShare worsens across the next five metered orders."
}
```

## WO-158-D020

```json
{
  "id": "WO-158-D020",
  "date": "2026-09-25",
  "dispatch": "resume: next; executor self-review before handoff",
  "decision": "Run one adversarial review of the complete change before handoff: four read-only finders (control plane; hook, classifier and grant security; acceptance-criteria and documentation truth; empirical probes of every route in temp fixtures under the system temp directory) and one batched verifier told to refute each finding. Of 31 candidate findings the verifier confirmed 18, which merge to 15 distinct defects; all 15 are fixed in this order with a regression case each, and D003, D005, D007, D008, D009, D011, D012 and D017 state the corrected behavior. Refuted: the reporting of historic `**Criterion N: met.**` forms (outside D009's convention by design), a capture-check gap for withdraw (the shared helper and the fold already refuse it), and duplicates.",
  "evidence": [
    "Confirmed and fixed: executor detection ignored COPILOT_AGENT_SESSION_ID (0), a renamed or blanked variable (11) and misread status-only journals (23); report-path rebinding and pending-allocation corrections (2); criterion-line forms, fences and conflicts (3); override advisory with no route in closed (4); withdraw in none (5); the withdrawn phase's unrunnable worktree-start command (6); the release edge remedy (7); the amendment normalizer (8); %G signature placeholders and gpg.* keys (9); undeclared criterion ids (16); phase coverage and ls in the fixtures (17, 19); readback-keeping effort corrections (21); ultra spellings (27); stale report-path subject lookup and non-normalized captures (28)",
    "After the fixes: resume, work-orders-fixtures, derived-orders, plan-refutation, codex-continuation, compiler and authority-grants pass; harness-fixtures 217.59 s and process-debt 86.69 s pass in full",
    "Review transcript: session workflow wf_1503f97b-0d7 (four finders, one verifier); subagent count 10 of the session's 20"
  ],
  "rejected": [
    {
      "option": "Hand off with the confirmed findings as verifier work",
      "reason": "Each was reproduced with a concrete failure and a bounded fix inside this order's authority; the verifier's time is better spent judging the corrected subject."
    },
    {
      "option": "Make override-record legal in closed",
      "reason": "A closed order's segment is merged; appending after the reviewed commit or on main dirties it. The advisory now names the decisions record instead."
    }
  ],
  "reopenWhen": "Independent verification reproduces any of the fifteen defects, or finds one of the same classes the review missed."
}
```

## WO-158-D021

```json
{
  "id": "WO-158-D021",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Fail the current subject and route four reproduced defects through WO-158 repair. A verifier does not change the implementation it judges. The defects reopen D007 (reactivation), D008 (report-path correction), D011 (live-gate Git reads) and D012 (override capture). The full product gate's one WO-143 timeout is recorded separately: a prior 27-suite pass has the same code identity, and that unchanged case passed alone in 161.67 s; the timeout does not explain or excuse the four defects.",
  "evidence": [
    "A disposable WO-099 lifecycle fixture admitted activation with **Reactivation (9999-99-99):** after withdrawal; scripts/resume.mjs matches the digit shape and compares date strings without calendar validation.",
    "A disposable lifecycle fixture passed VER-001, then correct --set reportPath pointed the passed verdict at a different existing sub/VER-001.md lacking actor and cost lines and declaring criterion 1 unmet; status retained latestVerdict pass. The original and alternate SHA-256 values differed, and neither report's bytes changed.",
    "A disposable generated-hook fixture recorded two override exits in one second at ordinals 2 and 3. Both used one ignored capture path; the second write replaced the first words, so the first event's captureHash no longer matched the file.",
    "A disposable live-gate hook fixture admitted git log -1 with core.pager configured; in a PTY Git ran the configured pager and wrote a harmless marker in system temp. The live-gate configured-program check omits pager settings.",
    "docs/control/local/harness/checks.json has a 27-case green npm test row at 2026-09-25T05:33:23.922Z and the verifier's red row at 05:49:27.867Z, both codeIdentity e070e7f260745b57503be53fa25c60e81dbecc891dc7694ff3ff111bd493977e. The red row's only failing suite timed out the unchanged WO-143 case after 240 s; an isolated rerun passed it in 161.67 s."
  ],
  "alternatives": [
    "Treat the passing route fixtures and earlier green gate as sufficient for all nine criteria",
    "Edit the implementation during verification and attest the changed bytes in this report",
    "File a failed verification with bounded reproductions and route repair to a fresh verification"
  ],
  "rejected": [
    {
      "option": "Treat the passing route fixtures and earlier green gate as sufficient for all nine criteria",
      "reason": "The four disposable probes exercised behaviors those fixtures missed. A green gate does not establish the absent guards."
    },
    {
      "option": "Edit the implementation during verification and attest the changed bytes in this report",
      "reason": "Independent verification must judge its recorded subject; repair changes that subject and requires a new report."
    }
  ],
  "followup": "WO-158 resume: fix — reject impossible reactivation dates; bind a corrected report path to the same validated report content and verdict; mint non-colliding exclusive override captures; refuse Git reads that may invoke a pager during a live gate. Add one regression for each probe, rerun affected suites and the product/document gates, then request a fresh VER.",
  "reopenWhen": "A repair supplies bounded regression evidence and a new verification can judge all nine criteria on its recorded subject."
}
```

## WO-158-D022

```json
{
  "id": "WO-158-D022",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F1 (criterion 3)",
  "decision": "A reactivation note's date must be a calendar date: `reactivationNotes` in scripts/resume.mjs marks each note valid only when `YYYY-MM-DD` round-trips through a UTC Date, and `requireReactivation` refuses a changed authority whose new note carries a non-calendar date, naming the date, before the on-or-after-withdrawal comparison. A note the withdrawn revision already held is still excluded by digest, whatever its date. A valid calendar date later than today stays admitted with its reason; the order asks for a note dated on or after the withdrawal, not for a bound on the future.",
  "evidence": [
    "VER-001 F1: `**Reactivation (9999-99-99):**` activated a withdrawn WO-099 fixture; the parser matched the digit shape and compared strings",
    "scripts/test-off-ramps.mjs: after the too-early note, `9999-99-99` and `2026-02-30` are each refused with `dates a new note <date>, which is not a calendar date`; the current-dated note then activates as before, and the second withdrawal cycle passes unchanged",
    "node scripts/test-runner.mjs --only resume: 2 passed, 0 failed (26.18 s) after the change"
  ],
  "rejected": [
    {
      "option": "Drop non-calendar notes silently and report `no new note`",
      "reason": "The operator would see a refusal that does not say what is wrong with the note they wrote."
    },
    {
      "option": "Refuse a note dated after today",
      "reason": "Local calendar dates ahead of UTC would be refused for operators east of UTC; the order's condition is on-or-after the withdrawal. Recorded as the reopening condition instead."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D007",
    "observation": "Its reactivation form admitted a date that is not a date (VER-001 F1); the form is unchanged and the parser now validates the calendar."
  },
  "goalAlignment": "Mission: a terminal phase is left only by a truthful, dated reason. Rule beating: a digit shape is not a date; the fixture now names two impossible dates. Fixes that fail: the guard is a pure check before any append. Shifting the burden: the refusal names the note, so the operator corrects the authority rather than asking. NoOp leaves an impossible date as a valid reactivation.",
  "reopenWhen": "A reactivation dated after the day it is recorded is judged misleading, or a reactivation needs a note form this parser cannot express."
}
```

## WO-158-D023

```json
{
  "id": "WO-158-D023",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F2 (criterion 4)",
  "decision": "A recorded result names the bytes it judged: `verification-result` and `final-review-result` record `reportHash` (the `sha256:` digest of the report at its allocated path) on VerificationCompleted and FinalReviewCompleted. `correct --set reportPath=` binds to those bytes: the candidate file's digest must equal the subject's recorded `reportHash`, or, for a result recorded before digests, the digest of the report at its current effective path; when neither exists the correction is refused because the judged bytes cannot be established. The RecordCorrected event records the digest it checked as `subject.reportHash`. A different report at the same id is refused with both digests; it takes its own judgment through a later report. The fold is unchanged: it projects the corrected path as before, and `correctedBy` lists every correction of an event, path relocations included.",
  "evidence": [
    "VER-001 F2: a passing VER-001 was rebound to a distinct sub/VER-001.md lacking actor and cost lines and declaring criterion 1 unmet, while status kept latestVerdict pass",
    "scripts/test-off-ramps.mjs: the VER-002 completion event records `reportHash` equal to the report's SHA-256; a sub/VER-002.md with other bytes is refused `holds different bytes from the report ordinal N judged (sha256:..., ordinal N's recorded report digest); a verdict never rests on another report, and a different report takes its own judgment`, and status keeps the allocated path and the pass; a byte-identical copy at the sub path is admitted, the correction's subject.reportHash equals the judged digest, status projects the relocated path with the pass, and a chained correction moves it back; the later attestation correction lists `correctedBy` as the two relocations plus itself, and current.md renders `corrected by ordinal a, b, c`",
    "scripts/lib/control.mjs offRampEvent validates RecordCorrected fields against CORRECTABLE_FIELDS and the subject ordinal only, so the added subject digest needs no fold change; the fold ignores unknown completion fields",
    "node scripts/test-runner.mjs --only resume: 2 passed, 0 failed"
  ],
  "rejected": [
    {
      "option": "Re-run the completion validations (actor header, cost line, criterion lines) on the new file instead of a digest",
      "reason": "They would admit a different report that happens to validate; the expectation is the same bytes, and a digest proves that."
    },
    {
      "option": "Require the old path's file to still exist",
      "reason": "A relocation is the case where the old path is gone; the recorded digest covers it. The current-path fallback serves only results recorded before digests."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D008",
    "observation": "Its claim that a verdict never rests on another report held only for the report id, not the bytes (VER-001 F2). Its usage and meta follow-up is unchanged: those readers still take raw event actors."
  },
  "goalAlignment": "Mission: a projected verdict points at the bytes that earned it. Rule beating: a same-named file is not the same report; the fixture refuses one. Policy resistance: the correction and the completion now agree on the digest rather than on a basename. Fixes that fail: nothing rewrites a report; the guard refuses before the append. NoOp leaves a pass projected onto unjudged bytes.",
  "reopenWhen": "A result recorded before digests must relocate after its current path is gone, or a reader of `reportHash` needs it on the projection rather than the event."
}
```

## WO-158-D024

```json
{
  "id": "WO-158-D024",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F3 (criterion 5)",
  "decision": "The session hook creates each operator-override capture exclusively: `writeCapture` in packages/skeleton/src/harness-host.ts opens `<date>-<session>-<HHMMSS>.md` with the `wx` flag and, on EEXIST, takes `-2.md`, `-3.md` and so on up to 1000, so a second exit in the same second names its own file and the first event's captureHash keeps matching the first words. The stem, the bytes, the ignored-only naming and the resume invocation are unchanged.",
  "evidence": [
    "VER-001 F3: two override exits within one second wrote one path twice; the first OperatorOverrideRecorded event's captureHash no longer matched the file",
    "scripts/test-harness.mjs `WO-158 VER-001 F3`: a `--import` preload pins every hook process of the case to one instant from DOTLN_FIXTURE_FROZEN_MS and unsets NODE_OPTIONS for the lifecycle it spawns; two override/off cycles append ordinals 2 and 3 whose reasons name the same exit instant, whose captures differ by the `-2.md` suffix, and whose captureHash each equals the SHA-256 of its own file, which holds its own words and not the other cycle's",
    "node --test --test-name-pattern 'WO-158' scripts/test-harness.mjs: 4 passed, 0 failed, including the existing override case unchanged"
  ],
  "rejected": [
    {
      "option": "Add milliseconds to the capture name",
      "reason": "Narrows the window without closing it; exclusive creation closes it and the suffix is the route out."
    },
    {
      "option": "Append the second exit's words to the first capture",
      "reason": "The first event's stored digest would stop matching; each record must keep naming the bytes it hashed."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D012",
    "observation": "Its reopening condition held: an OperatorOverrideRecorded event lacked the words its captureHash named after a same-second second exit (VER-001 F3)."
  },
  "goalAlignment": "Mission: the operator's captured words stay bound to the event that cites them. Tragedy of the commons: one path per second was a shared name; exclusive creation gives each record its own. Fixes that fail: a failed exclusive write raises and the exit still prints the advisory. NoOp keeps overwrite semantics and a hash that can stop matching.",
  "reopenWhen": "An OperatorOverrideRecorded event's captureHash disagrees with the file it names, or a session needs more than 1000 same-second captures."
}
```

## WO-158-D025

```json
{
  "id": "WO-158-D025",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F4 (criterion 6)",
  "decision": "A Git read is on the live-gate list only when it carries `--no-pager` or `-P` (`--no-optional-locks` alone is not enough): `liveGateGit` in packages/skeleton/src/harness-command.ts refuses a paged read, because a paged read runs the configured or default pager, an unlisted program, whenever its output is a terminal, and `--no-pager` also sets GIT_PAGER=cat for the log a stash list delegates. LIVE_GATE_READ_LIST, the harness-host refusal text, product 07 §Operator recovery controls and docs/AI-HARNESS-SECURITY.md spell the entry `git --no-pager diff|log|show|status|stash list`. The configured-program check is unchanged. One residual met while re-pointing the fixture is recorded, not changed: `git --no-pager status` under a configured core.fsmonitor is admitted during a live gate by the WO-142 activation read vocabulary (`readCommand`, repo.read at the root), which harness-host judges after the list; that is the boarded metadata exception WO-142-D012 recorded as FUP-9e2be6bfac0708fe, unchanged by this order, and the fsmonitor fixture row now uses `git --no-pager diff --stat`, which refreshes the index and is outside that vocabulary.",
  "evidence": [
    "VER-001 F4: with core.pager configured and GIT_PAGER unset, an admitted `git log -1` ran the pager in a PTY and wrote a marker in system temp",
    "scripts/test-harness.mjs live-gate case: ten Git reads carrying --no-pager or -P are admitted by all three pre-tool hooks (status, status --short, diff, diff --stat, log, -P log, --no-optional-locks --no-pager show, stash list, log piped to head, diff with 2>&1 piped to head); seven bare forms (log -1, status, diff --stat, show --stat HEAD, stash list, --no-optional-locks log -1, log piped to head) are refused with the list text, which now reads `git --no-pager diff|log|show|status|stash list ... a Git read carries --no-pager`; the seven configured-program rows refuse the flagged reads; core.fsmonitor=false admits `git --no-pager status`",
    "With the fsmonitor row on `git --no-pager status`, the permissions hook admitted it: activeGateWriteRefusal in harness-host.ts admits `permissionEffect === \"repo.read\"` at the root after the list, and readCommand in harness-command.ts admits `git --no-pager status` with -s, -b, -z, --short, --branch, --porcelain and the untracked or ignored options (the test's own note: `git status --short` stays a boarded metadata exception, WO-142 N7)",
    "node --test --test-name-pattern 'WO-158' scripts/test-harness.mjs: 4 passed, 0 failed; npm run harness -- check: 31 generated surfaces after emit",
    "Probe on git 2.55.0 with GIT_PAGER=less exported: `git --no-pager -c alias.envck='!sh -c \"echo GIT_PAGER=$GIT_PAGER\"' envck` printed GIT_PAGER=cat and the same alias without --no-pager printed GIT_PAGER=less, so the flag reaches the log a stash list delegates"
  ],
  "rejected": [
    {
      "option": "Add core.pager and pager.<cmd> to the configured-program check and read GIT_PAGER from the hook's environment",
      "reason": "The default pager is `less` when nothing is configured, and the hook cannot observe the tool's terminal or its environment; only the command text proves the pager is off."
    },
    {
      "option": "Admit bare Git reads because the hosts run tools with piped output",
      "reason": "Unprovable from the hook's position; the verifier reproduced the pager in a PTY."
    },
    {
      "option": "Refuse `git --no-pager status` under fsmonitor by judging the list before the activation vocabulary",
      "reason": "That is the WO-142 metadata exception with its own register row (FUP-9e2be6bfac0708fe); changing it also changes the outside-write and planning-branch guards D011 declined to touch."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D011",
    "observation": "Its reopening condition held: an admitted `git log` ran an unlisted program during a live gate (VER-001 F4). The list entry now requires --no-pager."
  },
  "goalAlignment": "Mission: a live gate's inputs are touched by nothing a read admits. Rule beating: the flag is required in the command text, not inferred from the host. Success to the successful: the fixture's earlier green admissions were not evidence that a pager cannot run. Shifting the burden: sessions type --no-pager, as the activation vocabulary already required. NoOp leaves a pager path open in a PTY.",
  "reopenWhen": "A Git read carrying --no-pager is observed running a program the configured-program check does not name, or FUP-9e2be6bfac0708fe is implemented and the fsmonitor row can return to a status."
}
```

## WO-158-D026

<!-- integration refs/dotln/checkpoint/WO-158/10 -->

```json
{
  "id": "WO-158-D026",
  "date": "2026-09-25",
  "dispatch": "worktree integrate WO-158",
  "decision": "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
  "evidence": [
    "refs/dotln/checkpoint/WO-158/10",
    "base 1f88850975c5aa7c2e8169c7267017d06d34a302",
    "upstream 0c727915a0582120cbe12d41f48ada53ddd7e5ce"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-25. Original base: `1f88850975c5aa7c2e8169c7267017d06d34a302`.
Fetched main: `0c727915a0582120cbe12d41f48ada53ddd7e5ce`. Checkpoint: `refs/dotln/checkpoint/WO-158/10`.
Named stash retained: `caf830d5bcf7569d05af801e866c41ef287399cf` (WO-158 integrate 2026-09-25).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-158 target v0.49.0 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims (reviewer, `resume: final review`, 2026-09-25): `main` gained WO-159 (`v0.48.0`, tagged; skeleton `0.41.0`; the Codex episode launcher; the WO-159 authority, verification and feedback editions). Outside `docs/` and the generated surfaces, the staged tree differs from VER-002's subject (`refs/dotln/checkpoint/WO-158/8`) exactly by `main`'s WO-159 diff, file for file, plus the three version files retimed below; WO-159's edits to the files both orders touched (`scripts/test-harness.mjs`, one WO-142 prune case; `scripts/test-runner.mjs`, two machinery-source rows; product 03, one status paragraph) are additive and disjoint from WO-158's lines. No WO-158 source line changed, so VER-002's evidence for criteria 1 to 9 carries forward to the integrated tree, subject to the final review's own findings ([FINAL-001](../../final-reviews/WO-158/FINAL-001.md)). The two authored conflicts were resolved by keeping both sides: `docs/product/06-roadmap.md` keeps WO-159's activation note and WO-158's two notes and gains a dated integration note; `docs/evidence/current.json` is re-pointed as below.
Component-version collision: `npm run release -- check-surfaces --local` printed `FAIL component-version @dotln/skeleton: src changed; observed 0.41.0; previous v0.48.0 0.41.0; expected a different version`. `v0.48.0` publishes skeleton `0.41.0`, the label D014 staged, so the skeleton bump is retimed to `0.42.0` under D014's declared additive minor impact in `packages/skeleton/package.json`, the console's exact pin and both lockfile entries; `release prepare` never alters component versions (WO-121-D005 precedent). Compiler `0.19.0` is free (`main` holds `0.18.0`); kernel and console are unchanged; `HARNESS_HOST_VERSION` stays `0.34.0` (D014). The application target `v0.49.0` set by the repair's `release prepare --local` is unchanged. After the retime `check-surfaces --local` reports no FAIL, `npm run build` and `harness emit` change no generated surface, and `npm ls --workspaces` resolves skeleton `0.42.0`.
Evidence editions on the integrated tree, D015's reopening condition met: artifact identity `WO-158/001` and verification `WO-158/001` verify unchanged. Authority was stale (`stale WO-158 revision 002 evidence: bundle-diff.json`, the hooks re-emitted over both orders' sources) and is re-minted deterministically as `WO-158/authority/003`. Feedback was stale (`judged behavior changed since docs/evidence/WO-114/feedback-001` in five WO-159 files); none of WO-158's files is a feedback source, so WO-159's live audit `docs/evidence/WO-159/feedback-001` is carried into `WO-158/feedback-002` (`only component release labels moved; no live episode`). `docs/evidence/current.json` selects authority `WO-158/003`, artifact identity `WO-158/001`, verification `WO-158/001` and feedback `WO-158/002`; all four checks pass. The console fixture manifest keeps its authored selection (`WO-158/feedback-001`, carrying WO-114's live audit) because the helper never repoints it and `evidence:console --check` matches all four cases.
Affected checks, executed on the integrated tree before the verdict: `npm run release -- check-surfaces --local` 0 FAIL after the retime; `npm run publication:check` PASS, both editions CURRENT; `node scripts/harness.mjs check` 31 surfaces; `node scripts/harness-context.mjs --check` every role with a ceiling within it at VER-002's byte counts; `git diff --cached --check main` clean. `npm test -- --review` was not run: the review failed on a reproduced acceptance defect ([D027](#wo-158-d027)) and the repair will change a registered source, so the gate belongs to the next final review. It is untested here, not passed.
Authored conflicts observed: docs/evidence/current.json, docs/product/06-roadmap.md.

## WO-158-D027

```json
{
  "id": "WO-158-D027",
  "date": "2026-09-25",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Fail FINAL-001 on criterion 6 and return one bounded finding to repair. `liveGateGit` in packages/skeleton/src/harness-command.ts advances its prefix index only inside `unpaged ||= args[index++] !== \"--no-optional-locks\"`; once `unpaged` is true the right side is not evaluated, so a prefix token after `--no-pager` or `-P` never advances and the loop never ends. While a gate is live every shell command reaches `liveGateReads`, so a Git stage spelled `git --no-pager --no-optional-locks ...` (the WO-142 prefix product 07 documents), `git -P --no-pager ...` or `git --no-pager --no-pager ...` hangs every generated pre-tool hook until the host's 15 s hook timeout. The listed read is not admitted, and nothing else in the command is judged: a write chained after such a stage is not refused where a hook timeout is fail-open, which the Copilot hook reference documents (docs/AI-HARNESS-SECURITY.md). The reviewer does not write the fix.",
  "evidence": [
    "Reproduced by this reviewer against packages/skeleton/dist/src/harness-command.js built from the staged sources: liveGateReads returns {git: true} in 1 ms for `git --no-optional-locks --no-pager status` and `git --no-pager log -1`; `git --no-pager --no-optional-locks status`, `git -P --no-pager log`, `git --no-pager --no-pager log` and `git --no-pager --no-optional-locks -c core.fsmonitor=false status --short` each ran until a 5 s alarm killed them (exit 142)",
    "Read-only review agent, scratch gate fixture: with a live npm test gate the generated permissions and concurrent-work-requires-worktrees hooks were killed at 20 s (ETIMEDOUT) on `git -P --no-pager log; echo x > fixture.ts` and on `git --no-pager --no-optional-locks status`; .claude/settings.json registers each pre-tool hook with timeout 15",
    "packages/skeleton/src/harness-host.ts activeGateWriteRefusal calls liveGateReads for every shell command while activeGateRuns(root) is non-empty, before shellWritePaths judges any write target",
    "refs/dotln/checkpoint/WO-158/2 and /4 have no `unpaged` variable; /6 (RepairCompleted) introduces the loop at line 660 with the F4 repair (D025)",
    "scripts/test-harness.mjs WO-158 live-gate case admits `git --no-optional-locks --no-pager show ...`, the one prefix order the loop survives, and has no case with --no-pager or -P followed by another prefix token",
    "docs/product/07-execution-guide.md line 2235: 'The admitted prefix `git --no-pager --no-optional-locks -c core.fsmonitor=false`'",
    "Claude Code's outcome on a pre-tool hook timeout was not observed in this review; the fail-open outcome is the documented Copilot behaviour"
  ],
  "alternatives": [
    "Pass and board the loop as a follow-up",
    "Write the one-line fix during review and certify it",
    "Fail with the reproduced finding and route it through repair and fresh verification"
  ],
  "rejected": [
    {
      "option": "Pass and board the loop as a follow-up",
      "reason": "It sits on criterion 6's admitted path: a read on the published list hangs every hook, and on a fail-open host a chained write to a gate input goes unjudged, which is what the criterion and the WO-139 live-gate refusal exclude."
    },
    {
      "option": "Write the one-line fix during review and certify it",
      "reason": "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it; harness-command.ts is a registered edition source and the change needs fresh independent verification."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D025",
    "observation": "The F4 repair's prefix loop in liveGateGit does not advance past a second prefix token, so the no-pager requirement D025 added hangs the live-gate hooks for `git --no-pager --no-optional-locks ...` and `git -P --no-pager ...` (FINAL-001 F1)."
  },
  "followup": "WO-158 resume: fix — make liveGateGit advance past every prefix token in any order (for example `if (args[index++] !== \"--no-optional-locks\") unpaged = true;`), with a regression that judges `git --no-pager --no-optional-locks status`, `git --no-pager --no-optional-locks -c core.fsmonitor=false status --short`, `git -P --no-pager log` and `git --no-pager --no-pager log` under a time bound and through the three pre-tool hooks with a live gate, including one stage chained to a write of a gate input; re-mint the editions the change makes stale, rerun the affected suites, then request a fresh VER.",
  "goalAlignment": "Mission: a live gate admits reads and still judges every write. Rule beating: the fixtures passed because they spelled the prefixes in the one order the loop survives. Fixes that fail: the F4 repair closed the pager path and opened a hang on the same line. Shifting the burden: the documented WO-142 prefix is exactly what sessions type. NoOp would publish a live-gate hook that a documented read spelling stalls.",
  "reopenWhen": "The repair's regression passes every prefix order through the three pre-tool hooks with a live gate and a fresh verification judges criterion 6 on that subject."
}
```

## WO-158-D028

```json
{
  "id": "WO-158-D028",
  "date": "2026-09-25",
  "dispatch": "resume: final review; FINAL-001 observations on the hook and grant seam",
  "decision": "Board the observations the read-only review of the hook and grant seam met besides D027. None fails an acceptance criterion, and this review requires none of them for acceptance. (a) Medium: the outside-write guard resolves each granted root with prospectiveRealpath when it judges, so a granted root replaced by a symlink (`rm -rf <root> && ln -s <target> <root>`, or `ln -sfn`) carries the grant to the target; WO-144's session-scratch has this class, and WO-158's host-scratchpad root (D010) resolves the same way. (b) Low: the configured-program check names no repository hook, so `git --no-pager diff` and `git --no-pager status` can run a `post-index-change` hook planted before the gate through core.hooksPath; a `format.pretty` or `pretty.<alias>` holding %G is not screened. (c) Low: when the decoder refuses the hook input (a missing cwd, an effort level outside its enumeration), the override exit returns the protocol refusal before the overrideExit branch, so neither the exit message nor the advisory command prints, although the mode is already normal and recovery is not blocked. (d) Low: an exception from the record call after a successful override-record append reaches the outer catch, which prints that the event was not appended. (e) Low, conservative: the list refuses `git --no-pager diff HEAD~1`, `git --no-pager show stash@{0}`, `grep -n '<title>' f` and a quoted `%H <%ae>` format, because its expansion and redirect checks see non-expanding or quoted characters; this is the pre-order refusal. (f) Negligible: the helper forms compare `args.join(\" \")`, so `node 'scripts/harness.mjs writer' --show` classifies as listed; it needs a planted gate input.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts about line 2826: every grant kind returns `{ ...grant, physical: prospectiveRealpath(path) }`, including the host-scratchpad case; the read-only review agent executed the symlink swap end to end on session-scratch in a scratch fixture (a Write landed in an ungranted directory) and executed the two host-scratchpad judgments",
    "Read-only review agent, scratch repository on Git 2.55.0: `post-index-change` ran for both reads after a stat-only change; the gate fixture admitted `git --no-pager diff` with core.hooksPath set; the pretty-format path was read, not executed",
    "Read-only review agent: `operator override:` then `operator override: off` with no cwd printed only `DOTLN_HARNESS_INPUT_REFUSED: MISSING_FIELD at $.cwd` (harness-host.ts about line 3817); items (d) and (f) are code-path readings",
    "Read-only review agent: the four over-refused reads returned null from liveGateReads"
  ],
  "rejected": [
    {
      "option": "Fold these into the D027 repair as required items",
      "reason": "None is on an acceptance criterion's path; requiring them would widen a bounded repair beyond the finding that failed the review."
    }
  ],
  "followup": "Next order that touches harness-host outside-write grants or the live-gate list: (a) require a granted root to be a real directory owned by the session user, not a symlink, for session-scratch and host-scratchpad alike; (b) add repository hooks and %G in pretty formats to the configured-program check; (c) print the override exit and its advisory before a protocol refusal; (d) never report a recorded override event as not appended; (e) decide whether revision syntax (`~`, `@{}`) and quoted `<`/`>` join the list without admitting expansion or redirection.",
  "reopenWhen": "A write lands outside every granted root through a swapped root, a gate input changes under an admitted read, or an override exit prints nothing."
}
```

## WO-158-D029

```json
{
  "id": "WO-158-D029",
  "date": "2026-09-25",
  "dispatch": "resume: final review; FINAL-001 observations on the control-plane seam",
  "decision": "Board the control-plane observations the read-only review met. None fails an acceptance criterion as written. (a) Medium: under Codex, which has no hook-made writer reservation, the executor refusal for `waive` rests on the command's session variables, so `env -u CODEX_THREAD_ID npm run resume -- waive ...` records the waiver with `recordingSession.role: unobserved`. Under Claude Code the live writer reservation, keyed by the hook's session id, still refuses it. The executor-refusal claim holds for every session DotLn observes, and Codex carries enforcement as role text by design; the `unobserved` role is visible to the next verifier. (b) Medium, already D005's follow-up FUP-3a0c4ea52f8d6d08: a withdrawal lives only in the order's worktree segment, because `worktree publish` runs `check-surfaces --committed`, which requires phase closed. Main, planning branches and other worktrees therefore never see `withdrawn` until an operator merge, and `worktree start` after the branch is deleted activates from none without the reactivation rule. (c) Low, WO-157 code unchanged here: the CLAUDE_EFFORT disagreement refusal applies only to `--harness claude-code`, so `--harness claude --effort high` under CLAUDE_EFFORT=xhigh records high with an advisory. (d) Low: current.md and text status show a withdrawn order only on its own wo-NNN branch; on another branch status --json shows withdrawn while current.md omits it. (e) Low: criterion lines in other forms are not judged (`**Criterion 2**: unmet`, a task-list item `- [ ] **Criterion 2:** unmet`), inside D009's stated convention; reportHash is read after the lifecycle-evidence await, a single-session window.",
  "evidence": [
    "Read-only review agent, scratch lifecycle fixture with an executor journal and no reservation: CODEX_THREAD_ID=executor-session refused; with the variable removed `Recorded CriterionWaived ... at ordinal 23`, recordingSession {\"role\":\"unobserved\"}; scripts/lib/off-ramps.mjs executorOf lines 116-141",
    "scripts/release.mjs checkSurfaces (about lines 610-617) and scripts/worktree.mjs line 470: publish requires a closed phase; D005 records the same gap and its follow-up",
    "Read-only review agent: `implementation-ready --harness claude --effort high --source operator-attested` with CLAUDE_EFFORT=xhigh recorded effort high (scripts/resume.mjs parseActor, WO-157)",
    "Read-only review agent: on branch `other`, `withdraw --work-order WO-099` then status --json showed withdrawn while current.md listed only WO-101 (scripts/resume.mjs render around line 1816)",
    "Read-only review agent: every recorded segment and the legacy log fold to identical projections under main's and the staged control.mjs (103 orders)"
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet for the Codex environment evasion",
      "reason": "The evasion needs a deliberate environment removal that the event records as an unobserved role; Codex duties are role text without automatic enforcement throughout DotLn, and the criterion's refusal holds for every observed executor session."
    }
  ],
  "followup": "Next order that touches the off-ramp routes or actor attestation: (a) bind waive's executor refusal to an observation a Codex command's environment cannot remove, or record why none exists; (c) apply the CLAUDE_EFFORT disagreement refusal to any harness spelling while the readback is readable, or refuse an unregistered harness name; (d) render a withdrawn order in current.md on the branch holding its event; (e) judge the task-list and colon-outside-bold criterion forms and take reportHash before the evidence await. Item (b) stays with FUP-3a0c4ea52f8d6d08, whose scope includes the deleted-branch restart.",
  "reopenWhen": "A waiver of an order is recorded by that order's executor session, a completion records an effort that disagrees with a readable CLAUDE_EFFORT, or a pass is recorded over an unmet criterion in another line form."
}
```

## WO-158-D030

```json
{
  "id": "WO-158-D030",
  "date": "2026-09-25",
  "dispatch": "resume: fix; FINAL-001 F1 (criterion 6)",
  "decision": "Advance the liveGateGit prefix index unconditionally on every recognized prefix, keeping the existing no-pager requirement and read vocabulary. Add a child-process-bounded classifier regression across prefix orders, repetitions and incomplete commands, then exercise the reported reads and chained gate-input writes through all three generated pre-tool hooks under a live gate. Re-mint the affected authority edition and regenerate the harness after the source settles.",
  "evidence": [
    "FINAL-001 F1 and WO-158-D027: four reported prefix forms exceeded a five-second classifier bound; the generated hooks also hung on a read followed by a write",
    "packages/skeleton/src/harness-command.ts liveGateGit: unpaged ||= args[index++] !== --no-optional-locks places its only index advance on a short-circuited right operand",
    "packages/skeleton/src/harness-host.ts activeGateWriteRefusal calls liveGateReads before judging shell write paths; the WO-142 metadata vocabulary separately admits the documented -c core.fsmonitor=false status form",
    "scripts/test-harness.mjs existing WO-158 case covers only --no-optional-locks before --no-pager; its invoke helper already bounds generated-hook child processes at twenty seconds"
  ],
  "alternatives": [
    "Separate prefix consumption from recording that a pager-disabling flag was seen",
    "Replace the Git classifier with a new parser",
    "NoOp or remove admitted multi-prefix reads"
  ],
  "rejected": [
    {
      "option": "Replace the Git classifier with a new parser",
      "reason": "The checked failure is a short-circuited index increment. A parser replacement changes substantially more behavior without evidence that it is needed."
    },
    {
      "option": "NoOp or remove admitted multi-prefix reads",
      "reason": "NoOp leaves a demonstrated hang; shrinking the vocabulary breaks the documented read path instead of restoring it."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D027",
    "observation": "The operator dispatched the required repair; the source confirms the reported loop and the missing prefix-order coverage."
  },
  "goalAlignment": "Mission and critical path: restore dependable inspection and write refusal while a gate runs; this is risk reduction in execution machinery, not a new lettered product milestone. Policy resistance / fixes that fail: preserve the pager and configured-program guards while repairing termination. Rule beating: require bounded execution through the real generated hooks and a denied chained write, not only a classifier return. Drift to low performance: keep criterion 6 unchanged. Shifting the burden: documented reads should work without operator rescue. Seeking the wrong goal: acceptance is prompt read admission and write refusal, not merely green tests. Tragedy of the commons and escalation: reuse D001's focused-then-full strategy with no agents or new process. Success to the successful: compare the small repair with a parser replacement on observed need rather than investment. Naive Interventionism: change only prefix consumption and preserve existing consumers and vocabulary; regressions cover refusal as well as admission. NoOp retains the reproduced hang.",
  "reopenWhen": "A recognized Git prefix sequence again fails to terminate, or a chained gate-input write is admitted by a generated pre-tool hook."
}
```

Repair economy: D001 was read before implementation and remains this order's
single experiment. This repair uses its adopted focused-then-full sequence;
no second experiment or agent is introduced. Entry usage was 49,399 total
tokens, source `codex-transcript-counter`, scope `dispatch`, observed cutoff
2026-09-25T15:27:53.079Z; monetary cost is unknown. The active session readback
is Codex CLI 0.157.0, `gpt-6-astra`, `xhigh`.
