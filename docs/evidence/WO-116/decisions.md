# WO-116 decisions

## WO-116-D001 — economy experiment: spawn the terminal entrypoint for each audit case

```json
{
  "id": "WO-116-D001",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "The audit command's fixtures spawn the built terminal entrypoint (node packages/skeleton/dist/src/dotln.js audit ...) for every case, the scope cases included, rather than calling an exported function in-process for the scope cases and spawning only for byte identity and refusals. Each spawn exercises the parser, the newline console.log adds, the refusal stream and the exit code, which are the bytes the console serves.",
  "question": "Does spawning the dotln entrypoint once per terminal-command case (42 spawns of `dotln audit` across the skeleton and console fixtures) cost enough wall-clock per gate run, against in-process calls, to justify testing the scope cases below the CLI?",
  "alternatives": [
    "Spawn node packages/skeleton/dist/src/dotln.js audit for every case: the real parser, stdout newline, stderr refusal and exit code in each case.",
    "Export a pure store-audit function, call it in-process for the scope cases and spawn only for the byte-identity and refusal cases."
  ],
  "observation": "Wall-clock under /usr/bin/time -p on the operator's checkout, 2026-09-28T22:48:18Z to 22:48:19Z, three runs each: dotln status --store <empty scratch store> 0.08, 0.08 and 0.08 s; dotln with no arguments (the same entrypoint and import graph, refused at usage) 0.06, 0.06 and 0.06 s; the skeleton CLI --audit 0.07, 0.07 and 0.07 s. The in-process path would be adopted only if one spawn cost more than 1 s.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 19,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p node packages/skeleton/dist/src/dotln.js status --store <scratch>/empty-store (three runs)",
      "/usr/bin/time -p node packages/skeleton/dist/src/dotln.js (three runs)",
      "/usr/bin/time -p node packages/skeleton/dist/src/cli.js --audit (three runs)"
    ],
    "source": "The shell clock around the nine commands (22:48:18Z to 22:48:19Z) plus the clocked writing of this record (22:58:56Z to 22:59:14Z, 18 s); the reasoning before the first command was not clocked, so 19 s is a lower bound. Tokens belong to the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test packages/skeleton/dist/test/audit-command.test.js",
      "node --test packages/console/dist/test/console-commands.test.js"
    ],
    "summary": "At about 0.06 s per spawn the 42 audit spawns (18 in the skeleton file, 22 in the WO-116 console case, 2 in the WO-115 inventory) add about 2.5 s to a gate run that selects both package suites; no saving is claimed and none is adopted. The first record said a dozen spawns and under one second; the WO-116 review's count corrected it."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-28",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "The nine timed commands above; their outputs stayed in session scratch",
    "packages/skeleton/test/cli.test.ts already spawns the skeleton CLI per case with spawnSync, the precedent the new fixtures follow",
    "docs/evidence/WO-167/decisions.md WO-167-D002 (2026-09-28) is the latest adopted experiment the WO-116 read of the decision records found; no single source orders the experiments since it on that date, so the count stays null"
  ],
  "rejected": [
    {
      "option": "Call an exported store-audit function in-process for the scope cases",
      "reason": "It saves about 2.5 s per gate run and leaves the parser, stdout newline, stderr refusal and exit code untested in those cases, and a pure function exported only for tests widens the skeleton's module surface."
    }
  ],
  "reopenWhen": "One spawn of the dotln entrypoint exceeds 1 s on the operator's host, or the audit fixtures' spawns exceed 6 s per gate run."
}
```

## WO-116-D002 — The terminal command selects envelopes before the unchanged fold

```json
{
  "id": "WO-116-D002",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The terminal command is `dotln audit --store <directory> [--workstream <id> | --episode <id>]` in packages/skeleton/src/dotln.ts. It reads the store's events.jsonl through WorkerStore.read (an absent log reads as empty; a torn or malformed log refuses), keeps the envelopes whose workstreamId, or episodeId, equals the selection, and prints renderAuditProjections over them with console.log: the fold's L0 receipt, causal timeline and governed raw JSON under their headings, then one newline. With no selection the whole log is the input. The selection is the input of one projection run, so the fold names the scope from the selected envelopes as product 09 specifies (ep: only when they share one episode in one workstream, ws: for one workstream, log:mixed otherwise) and the command adds no field, filter or label. The two selections are exclusive. Because adjacency is a property of the input sequence, a selection is judged as the fold judges a log holding only that scope: an allowed command's immediately preceding authority trace, or a refusal's adjacent attempt, can pair in a workstream selection where another workstream's envelope separated them in the whole log, and the association keeps the label the fold gives it; a QueuedPulseNoOp whose evidence lies outside the selection is refused by the fold, naming the event, rather than widened.",
  "evidence": [
    "packages/skeleton/src/dotln.ts: the audit branch, the --workstream option and the usage line",
    "packages/skeleton/test/audit-command.test.ts `WO-116 the terminal audit command prints the skeleton --audit projections byte for byte ...`: a store holding the fixture scenario's log prints the skeleton CLI's --audit section (59,613 bytes) for the whole log, --workstream ws_repo_garden and --episode ep_seiri_1, with L0 RECEIPT/L0, CAUSAL TIMELINE/L1 and GOVERNED RAW JSON/L4 in order and the fold's explicit-event-link and causation evt_14",
    "packages/skeleton/test/audit-command.test.ts `WO-116 each audit scope selects what the fold scopes for it ...`: over the fixture log plus one event in a second episode and one in a second workstream, each selection equals renderAuditProjections over the envelopes it selects, with scopes log:mixed, ws:ws_repo_garden, ws:ws_second, ep:ep_seiri_1 and ep:ep_seiri_2, and ep_seiri_1 selected from the larger log is the skeleton's own --audit render",
    "docs/product/09-audit-resilience-privacy.md §Audit projections and visualizations: one projection run chooses one scope for the whole fidelity chain",
    "packages/skeleton/src/audit.ts deriveAuditRecords: events[index - 1] for the authority trace and the refused attempt, canonicalEventIds for NoOp evidence (read, not edited)"
  ],
  "rationale": "Mission and critical path: the operator's 2026-09-08 direction that the runtime has the UI to audit; gate U's third step, which WO-117 waits for. Policy resistance: the terminal command and the served result call the one render the skeleton's --audit calls, so neither can drift from it. Commons: one read of one log per call, no index, cache or background work. Drift to low performance: the standard is byte identity with the skeleton CLI's own output, and the fixtures compare against that output, not only against the function. Escalation: no new event type, route, authority, format or effect. Success to the successful: a filter over the fold's output, a JSON mode and in-process tests were weighed on their merits (below, D001, D005). Shifting the burden: a UI no longer needs a second reader of the log. Rule beating: the console fixture compares served bytes with a terminal run of the same store and selection and with the skeleton CLI, so a self-comparison cannot pass alone. Seeking the wrong goal: the goal is one source for audit, not a richer audit; new semantics are the order's non-goal (D008). Naive Interventionism: the fold, its scope rule and every existing command keep their behaviour; the consumers are terminal users and console clients; the second-order harm is the adjacency effect above, recorded here; one branch, one option and one identifier are removed to reverse it. NoOp: a UI that audits keeps needing its own reader and WO-117 stays blocked.",
  "rejected": [
    {
      "option": "Fold the whole log, then keep the records and envelopes of the selection",
      "reason": "A filter over the fold's output is the new layer the order excludes: governed raw would need a second event filter, and L0/L1 would carry the whole log's scope label, so the result would match no projection run the fold defines."
    },
    {
      "option": "Accept both selections together as one episode within one workstream",
      "reason": "The order names three scopes; an episode id recorded in two workstreams keeps the fold's own log:mixed label under --episode, and no store observed so far records one."
    },
    {
      "option": "A --json mode or a structured envelope",
      "reason": "The order adds no field; text is the reference render (operator-review assumption 1) and the fold's JSON is already inside the text."
    },
    {
      "option": "Select by payload fields, such as a resident episode's id",
      "reason": "The fold scopes by envelope identifiers only; a payload selector is another filter the order excludes."
    }
  ],
  "reopenWhen": "A store records one episode id in two workstreams and an operator needs one of them alone; a selection's adjacency-derived label is found to mislead against the whole log; or a UI host needs structured output, which needs a terminal format first."
}
```

## WO-116-D003 — Refusals in the terminal's words

```json
{
  "id": "WO-116-D003",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "A store with no events refuses as `audit: store <directory> holds no events` on stderr, exit 1, empty stdout, whether its events.jsonl is absent or empty or its directory is missing; nothing is created. A selection that matches no envelope refuses as `audit: episode <id> is not in store <directory>` or `audit: workstream <id> is not in store <directory>`. <directory> is the --store argument as typed, so the served and terminal refusals, both run from the kit root, are the same bytes. The dotln CLI's refusal allowlist gains `audit:` and `invalid audit `, so the fold's own refusals (a class-required reference missing, an invalid envelope, a causation cycle) print in the fold's words instead of the generic worker-host line; a store read error (a torn log, a symlink, a non-regular file) keeps the generic line, whose message would name file paths. The audit grammar's usage line refuses both selections together, any switch and any option another dotln command declares; the shared option parser refuses an undeclared or repeated option or a positional word first, as `unknown or duplicate option`, and an option without a value as `missing option value`.",
  "evidence": [
    "packages/skeleton/src/dotln.ts: the audit branch and the catch allowlist",
    "packages/skeleton/test/audit-command.test.ts: an empty directory, an empty events.jsonl and a missing directory refuse naming the store; ep_absent and ws_absent refuse naming the selection and the store; a WorkOrderEmitted without workOrderId refuses with `invalid audit source evt_1 WorkOrderEmitted: missing workOrder.workOrderId`; both selections, --json and --work-order refuse at usage; every store's listing is unchanged and the missing directory is not created",
    "packages/console/test/console-commands.test.ts WO-116: the empty store and ep_absent refusals served as the terminal's exact bytes",
    "docs/product/09-audit-resilience-privacy.md §Canonical audit record: a source lacking a class-required reference refuses projection instead of disappearing"
  ],
  "rejected": [
    {
      "option": "Project an empty store as the fold's log:empty scope",
      "reason": "The order requires an empty store to refuse with a message naming it; log:empty stays available to library callers of the fold."
    },
    {
      "option": "Name the resolved absolute path of the store",
      "reason": "It would print a different path than the operator typed for a relative argument; the typed argument already identifies the directory for both kit-root runs."
    },
    {
      "option": "Leave the fold's refusals behind the generic worker-host line",
      "reason": "That line was written for worker-host store failures; for a read-only projection it hides which canonical reference the fold refused."
    }
  ],
  "reopenWhen": "An audit refusal is observed carrying a path or credential the operator did not type, or a UI host needs a machine-readable refusal code."
}
```

## WO-116-D004 — One contract identifier, classified by the terminal's classifier

```json
{
  "id": "WO-116-D004",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "console-commands-v1 gains `dotln.audit`: entry packages/skeleton/dist/src/dotln.js, prefix [\"audit\"], after dotln.status. The terminal parser owns the rest of the grammar and every refusal. The terminal permission classifier judges `node packages/skeleton/dist/src/dotln.js audit ...` as shell.run, as it judges every dotln entrypoint, so a resident bound by resident-bind WO-NNN (the Contributor envelope) serves it and a read-only envelope refuses it with `compiled authority does not permit shell.run`, as it refuses dotln.status. No classifier, loopback or client code changes: they derive from the contract object. The WO-115 fixtures that enumerate the contract name the new identifier: its literal terminal text, a classifier row and a parser refusal in contract order.",
  "evidence": [
    "packages/skeleton/src/console-commands.ts",
    "packages/console/test/console-commands.test.ts: the terminal-text table (`dotln.audit`: `node packages/skeleton/dist/src/dotln.js audit`), the classifier row (`... audit --store /tmp/x`: shell.run), the refusing inventory (`dotln.audit`: [] refuses at the dotln usage, served bytes equal), and the WO-116 receipts (effect shell.run, authorized true under the bound envelope)",
    "packages/skeleton/src/harness-command.ts invocationEffects: node invocations outside the lifecycle scripts fall through to shell.run (read, not edited); the WO-116 read-only sweep's classifier probe classified every audit variant as shell.run",
    "docs/evidence/WO-115/decisions.md WO-115-D001 and WO-115-D006 reopen when a named order adds a terminal command in the listed categories; this order is that order"
  ],
  "rejected": [
    {
      "option": "Classify dotln audit as repo.read",
      "reason": "The classifier is the terminal hook's and judges every terminal session; changing it is outside this order, and harness-command.ts is a registered evidence source."
    },
    {
      "option": "A console-only audit route",
      "reason": "A second implementation beside the terminal's; product 04 requires a named order and a terminal implementation for every identifier."
    }
  ],
  "reopenWhen": "The terminal classifier distinguishes read-only dotln subcommands, or an operator needs the audit served under a read-only envelope."
}
```

## WO-116-D005 — The text host renders the served bytes through invoke

```json
{
  "id": "WO-116-D005",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The text host's render of the served audit is its existing `console invoke --store <bound-store> dotln.audit ...`, which writes the served stdout and stderr bytes unchanged and exits with the served code; it shows the three projections under their headings with their fidelity labels. No audit-specific console action, formatter or view model is added. The amended order makes the served result the terminal's bytes and the terminal's text the reference render, so the Cost line's render in the text host is this path, pinned by a fixture and documented in the console README.",
  "evidence": [
    "packages/console/src/cli.ts invoke (unchanged)",
    "packages/console/test/console-commands.test.ts WO-116: the text host's invoke output equals the terminal run and the skeleton --audit section and carries L0 RECEIPT/L0, CAUSAL TIMELINE/L1 and GOVERNED RAW JSON/L4 in order",
    "git show 6ab27c46:docs/work-orders/WO-116-audit-projection-served.md: the 2026-09-08 order added the projection to the resident's read commands and a render to the text host; the 2026-09-28 amendment's objective reads `so the served result is the terminal's bytes; the text host renders them`",
    "packages/console/test/console-commands.test.ts pins @dotln/console/client to exactly invokeConsoleCommand and readConsoleContract with no Node API"
  ],
  "rejected": [
    {
      "option": "A `console audit` action",
      "reason": "A second grammar and parser for one contract command, whose refusals would no longer be the terminal's."
    },
    {
      "option": "A text-host formatter over the parsed projections",
      "reason": "It would drop or add fields relative to the terminal's output, the second source the order exists to avoid."
    }
  ],
  "reopenWhen": "A UI host needs a render the terminal cannot print, or a verifier reads the text-host render as requiring code beyond invoke."
}
```

## WO-116-D006 — The served command serves the terminal's bytes and adds no access rule

```json
{
  "id": "WO-116-D006",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The served command applies no redaction and no access rule: it serves exactly what the terminal prints, governed raw's complete retained envelopes included, to the local user the loopback admits (127.0.0.1 and the owner-only bearer token). Product 09 leaves the projections' access and retention rules undefined and their enforcement deferred; this order takes its declined alternative and records the position in product 09's sentence on the served command.",
  "evidence": [
    "docs/work-orders/WO-116-audit-projection-served.md §Design (declined alternatives) and operator-review assumption 2",
    "docs/product/09-audit-resilience-privacy.md §Audit projections and visualizations: intendedAccess not-defined or restricted, enforcement deferred; the write-back sentence `serves exactly those bytes to the local user and adds no access rule`",
    "packages/console/test/console-commands.test.ts WO-116: served bytes equal the terminal's for every store and selection, and the result envelope holds exactly version, command, exitCode, stdoutBase64 and stderrBase64"
  ],
  "rejected": [
    {
      "option": "A redaction layer in the served command",
      "reason": "Product 09 defines no rule for it to apply, and a served result that differs from the terminal's is a second source."
    }
  ],
  "reopenWhen": "Product 09 defines an access rule for a projection, or the loopback admits a caller other than the local user."
}
```

## WO-116-D007 — The audit fold is unchanged; nothing is re-minted

```json
{
  "id": "WO-116-D007",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "packages/skeleton/src/audit.ts and packages/skeleton/src/artifact-audit.ts are unchanged; the command imports renderAuditProjections. No registered behaviour source changes: the only registered sources touched are packages/skeleton/package.json and package-lock.json, whose release labels the edition checks normalize, so no edition is stale or re-minted.",
  "evidence": [
    "git diff -- packages/skeleton/src/audit.ts packages/skeleton/src/artifact-audit.ts is empty",
    "scripts/lib/evidence-sources.mjs registers artifact-audit.ts and audit.ts, and package-lock.json and packages/skeleton/package.json, whose diffs are the version lines only; dotln.ts and console-commands.ts are not registered",
    "The order's Cost line: re-mints none while the fold is not edited (WO-152 D004 normalizes the skeleton's release label)"
  ],
  "rejected": [
    {
      "option": "Put the store read and the selection in audit.ts",
      "reason": "It would edit a registered source and re-mint editions for code the fold does not need; product 09 keeps the folds free of I/O."
    }
  ],
  "reopenWhen": "A later order edits the fold or a registered source it depends on."
}
```

## WO-116-D008 — Observed limit: a resident store's own events are context to the fold

```json
{
  "id": "WO-116-D008",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Over a resident store the command projects without refusal, but none of the event types a resident host appends (ResidentConfigured, ClockSampled, OperatorPresenceObserved, ScriptEpisodeDispatched, ScriptEpisodeObserved, ScriptEpisodeLost, ScriptEpisodeRefused, CliWorkerObserved, PortfolioOrderActivated, PortfolioOrderObserved, ActorUnavailable, HandoffRequested, HandoffAnswered, MissionDriftObserved, MissionHoldCleared and the console receipts) is a consequential source for the fold, and a resident host appends no DecisionRecorded, which the fold reads only as supporting evidence beside a CommandPersisted or CommandRefused. So L0 and L1 carry no receipts or entries and only L4 governed raw shows what the resident did. The fold's omission and completeness labels are also worded for the fixture: over any store the L0 receipt and the timeline say their recorded-at and other data were `not collected by the fixture`, and governed raw that separately controlled artifacts `are not present in this fixture`. Rewording them edits audit.ts, a registered source, and is new semantics. This order adds no audit semantics, its non-goal; both gaps go to planning as one follow-up.",
  "evidence": [
    "Session-scratch run on 2026-09-28: a resident started once with the WO-067 presence fixture, then dotln presence away and back; dotln audit printed scope ws:resident with receipts [] and entries [] over 6 events",
    "packages/console/test/console-commands.test.ts WO-116: the served audit of the bound resident's own store equals the terminal's projection of the store as the child started (scope ws:resident), its governed raw ending with this invocation's ConsoleCommandInvoked receipt",
    "packages/skeleton/src/audit.ts deriveAuditRecords: the consequential source types are WorkOrderEmitted, CommandPersisted, CommandResult, DeletionAttempted, CommandRefused, EpisodeTerminated, VerificationCompleted, CommandRedispatched, QueuedPulseNoOp and SchedulesCancelled",
    "The append calls in packages/skeleton/src/resident-host.ts, resident-store.ts and console-loopback.ts, with literal types and with the computed ActorUnavailable, ScriptEpisodeRefused, CliWorkerObserved, PortfolioOrderObserved and ScriptEpisodeObserved, name none of those types; the only DecisionRecorded appender is live-reactor-driver.ts, which the fixture scenario uses (the WO-116 review corrected an earlier listing of DecisionRecorded here)",
    "packages/skeleton/src/audit.ts: the omission strings `... recorded-at data not collected by the fixture` (L0 and L1) and `separately controlled artifacts are not present in this fixture` (governed raw) print for every store, as the WO-116 review's probe over a resident-shaped store showed"
  ],
  "rejected": [
    {
      "option": "Add resident action classes to the fold in this order",
      "reason": "New audit semantics are the order's non-goal, and audit.ts is a registered source whose change re-mints editions."
    }
  ],
  "followup": "Planning: nominate audit action classes for the resident's own events (episode dispatch and outcome, handoffs, mission holds, portfolio activation and console invocations), so the L0 receipt and L1 timeline over a resident store summarize what the runtime did rather than leaving it to governed raw, and word the fold's omission and completeness labels for any retained log rather than for the fixture.",
  "reopenWhen": "Planning disposes the follow-up, or a UI's audit of a resident store is judged unusable without L0 and L1 summaries."
}
```

## WO-116-D009 — Release v0.54.0: skeleton 0.45.0, console pin and lockfile

```json
{
  "id": "WO-116-D009",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Application v0.54.0, the next minor above the observed local v0.53.2 tag under the order's minor classification: the order's heading takes it, and the README release block's version line and a WO-116 activation-completion paragraph in product 06 §Release boundary record it. Skeleton 0.44.4 to 0.45.0 is a minor bump for the new command and contract identifier; the console's skeleton pin and the lockfile follow, and npm install --package-lock-only --ignore-scripts --offline --no-audit --no-fund changed only those two version lines. The console's source is unchanged (its tests and README change), so it stays 0.3.1; kernel, compiler and beacons are unchanged. The 04 write-back staled both publication editions and the roadmap paragraph staled the everyday edition; check-publication --print-locks supplied the new locks.",
  "evidence": [
    "git tag --list 'v*' --sort=-v:refname: v0.53.2 newest",
    "node scripts/release.mjs check-surfaces --local: exit 0; `component-version @dotln/skeleton: src changed; observed 0.45.0; previous v0.53.2 0.44.4`; `workspace-pin @dotln/console -> @dotln/skeleton: observed 0.45.0`",
    "node scripts/check-publication.mjs: CURRENT for everyday-ai-user-toc.md and software-engineer-toc.md after the lock refresh",
    "docs/evidence/WO-115/decisions.md WO-115-D004 (a minor skeleton bump for the additive console surface) and docs/evidence/WO-173/decisions.md WO-173-D009 (the console pin following a skeleton bump with the console at 0.3.1)"
  ],
  "rejected": [
    {
      "option": "Bump the console component for its test and README changes",
      "reason": "check-surfaces compares src, which is unchanged; WO-173 left the console at 0.3.1 while its pin followed."
    },
    {
      "option": "A skeleton patch bump",
      "reason": "The order adds a command and an exported contract identifier, an additive interface, as WO-115's minor bump for the same surface did."
    }
  ],
  "reopenWhen": "The release baseline moves before final review and the label must be retimed, or check-surfaces requires a console bump."
}
```

## WO-116-D010 — Write-backs in place

```json
{
  "id": "WO-116-D010",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Each write-back edits the sentence it amends; none adds a dated paragraph. Product 09 §Audit projections and visualizations gains two sentences after the folds' I/O sentence naming the command, its selections and refusals and that the served command serves the same bytes to the local user with no access rule: 343 bytes added, 673 bytes of headroom left under the 51,775-byte ceiling. Product 04 §Console parity contract v1 adds dotln.audit to the dotln row of the command table and replaces `Runtime audit is reserved for WO-116` with the served identifier: 49 bytes added. The console README's parity paragraph names dotln.audit and what invoke prints, and its example block gains the invocation. The skeleton README's --audit paragraph, which describes the fixture demo, is unchanged: the order names its write-backs, and product 09 and the console README document the command.",
  "evidence": [
    "wc -c against git show HEAD: 09 50,759 to 51,102 bytes; 04 59,662 to 59,711 bytes",
    "node scripts/docs-check.mjs: PASS, 15 product documents, 0 failures",
    "docs/control/doc-ceilings.json: 09 ceiling 51,775; 04 ceiling 60,856",
    "docs/product/07-execution-guide.md §Documentation freshness and ownership: a dated paragraph is a receipt and belongs in the order's evidence README"
  ],
  "rejected": [
    {
      "option": "Document the command in the skeleton README as well",
      "reason": "Outside the order's named write-backs; the 09 sentence is the product statement and the console README is the host's."
    }
  ],
  "reopenWhen": "A reader of the skeleton README misses the command, or a later edit moves 09 past its ceiling."
}
```

## WO-116-D011 — Adjacent repair: the dotln usage and command list name handoff

```json
{
  "id": "WO-116-D011",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The dotln CLI's general usage line and its unknown-command message listed every command but `handoff answer`, which 54faed87 added on 2026-09-17 with its own usage line; both now name it, beside the new audit command. The change is two strings in a file this order already edits and changes no parser behaviour; the audit-command fixture now pins both. Recorded as Follow-up Queue item adjacent-0001, queued after the string edit and completed with its checks.",
  "evidence": [
    "git show 54faed87 -- packages/skeleton/src/dotln.ts: adds the handoff branch and its own usage, leaves the general usage and the `expected ...` list unchanged",
    "docs/product/04-interfaces.md §Console parity contract v1 names `handoff` among the terminal commands outside the contract",
    "`node packages/skeleton/dist/src/dotln.js nonsense --store /x` now prints `expected intent, resident, presence, handoff, status, audit, demo, verify-demo or feedback-audit`; before this order git grep found neither string pinned by a test or fixture",
    "packages/skeleton/test/audit-command.test.ts `WO-116 the dotln usage and command list name audit beside every other command, handoff included`",
    "npm run adjacent -- list: adjacent-0001 completed with npm run build --silent and node --test packages/skeleton/dist/test/audit-command.test.js, both exit 0"
  ],
  "rejected": [
    {
      "option": "Leave the omission for another order",
      "reason": "The equipped Adjacent Repair prefers a bounded repair within authority; the fix is two strings in an edited file with no behaviour change."
    }
  ],
  "reopenWhen": "The dotln CLI gains or withdraws a command without its usage and command list following, or handoff answer is withdrawn from the terminal."
}
```

## WO-116-D012 — FUP-0053's reopening condition is met; its disposition stays with planning

```json
{
  "id": "WO-116-D012",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The follow-up register's FUP-0053, the unallocated audit causal-association hardening candidate, was deferred on 2026-09-19 until `WO-116 activation or an observed mis-association`; WO-116's activation meets the first condition. This order does not take the candidate up: it changes the fold (a registered source) and adds audit semantics, both outside this order. It adds one observation for planning, derived from the code rather than seen in a recorded log: the allowed-grant pairing reads the immediately preceding envelope, so in a log whose workstreams interleave, the whole log can leave a command at `authorized-command-persisted` while a workstream selection of that log pairs the same command with its trace as `authority-trace-and-command-persisted` (D002). No store observed in this order interleaves workstreams.",
  "evidence": [
    "docs/planning/followups.json FUP-0053: disposition deferred, reason `partly shipped (the refusal path prefers causation links with a labeled fallback); the allowed-grant trace is still adjacency ...`, reopenWhen `WO-116 activation or an observed mis-association (the pass's suggestion)`",
    "docs/control/orders/WO-116.jsonl: WorkOrderActivated at 2026-09-28T22:36:48.074Z",
    "packages/skeleton/src/audit.ts deriveAuditRecords: isAuthorizedDecisionTrace(events[index - 1], ...) for CommandPersisted (read, not edited)",
    "The fixture scenario's log is one workstream and one episode; the resident stores audited in this order are one workstream with no envelope episodes"
  ],
  "rejected": [
    {
      "option": "Implement the causal-association hardening in this order",
      "reason": "It edits audit.ts, re-mints the editions that register it and changes byte-identical projections; the order's non-goals exclude new audit semantics."
    },
    {
      "option": "Dispose or retarget FUP-0053 from this order",
      "reason": "Its disposition is a planning decision; the executor records the met condition and the new observation for the next planning pass."
    }
  ],
  "reopenWhen": "Planning disposes FUP-0053, or a recorded log shows a selection pairing a trace the whole log does not."
}
```

## WO-116-D013 — Correction: activation, not utilization, while the review ran

```json
{
  "id": "WO-116-D013",
  "date": "2026-09-28",
  "dispatch": "resume: next; the operator's correction during the dispatch, 2026-09-28T23:27Z and 23:29Z by the prompt hook's clock",
  "kind": "correction",
  "decision": "An error of this dispatch, named by the operator: while the read-only review ran in the background, the executor kept its turn alive with repeated short tool calls (status checks of the review journal, rereads, reruns of passing tests) that had no question to answer and no end, because it assumed, without reading, that ending the turn would trip the Stop hook or release the writer and leave the order unrecoverable. That is activation, not utilization: calls spent to stay active rather than time used toward a purpose with an end, at the operator's token cost; the rule-beating and seeking-the-wrong-goal traps. Product 02 already records that Claude's Stop refuses at most once, then records the unmet obligation and lets the turn end, and that a refused Stop does not release the writer.",
  "misread": "The executor read the pending ImplementationReady obligation as a reason never to end a turn before completion, and treated a wait for background work as time to fill with activity.",
  "meant": "A phase is stoppable at any moment. Waiting on background work is not work: the workflow and the gate notify on completion, and ending the turn loses nothing. Waiting time may be used only with a purpose and an end, utilization rather than activation; the operator names the Blackjack +3 operator-away notions as one possible use (WO-116-D015).",
  "changed": "The monitor was stopped and the turn ended at the operator's first message; the dispatch now waits for the review's notification instead of polling; the evidence README names the error; the ideation is captured and synthesized under WO-116-D015.",
  "evidence": [
    "The operator's messages at 23:27Z and 23:29Z by the prompt hook's clock, captured unedited in this worktree's ignored intake docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md",
    "docs/product/02-domain-model.md: `A refused Stop is reported once: when the harness re-enters Stop after a refusal, the hook records the unmet obligation without marking a finish and lets the turn end`, and `releasing on a refused Stop was rejected because a refused Stop does not end the session`",
    "packages/skeleton/src/harness-host.ts stopReentry: the same rule in code",
    "npm run meta: 19 guard refusals and a policy-resistance reopen candidate for WO-116, most from the reviewers' probes during the overlapping gate (README observations)"
  ],
  "rejected": [
    {
      "option": "Keep a monitor or poll until the review finishes",
      "reason": "It spends the operator's tokens on activity with no question to answer; the workflow's own notification resumes the dispatch."
    },
    {
      "option": "Fill the wait with rereads and reruns of passing checks",
      "reason": "Without a question and an end they are activation, not utilization; a check is rerun only when its subject changed."
    }
  ],
  "reopenWhen": "The executor again spends tool calls only to avoid ending a turn, or a Stop is observed refusing more than once."
}
```

## WO-116-D014 — Correction: a capture aimed at the main checkout

```json
{
  "id": "WO-116-D014",
  "date": "2026-09-28",
  "dispatch": "resume: next; the operator's correction at 2026-09-28T23:33Z by the prompt hook's clock, during the ideation breakout",
  "kind": "correction",
  "decision": "An error of this dispatch, named by the operator: during the ideation breakout the executor tried to write the raw capture into the main control-plane checkout's ignored intake, a checkout outside this worktree that this session does not own; the outside-write guard refused it (WO-144) and nothing was written there. The capture for ideation opened around a work order belongs in the worktree's own docs/intake/notes/<work-order>-expanded-ideation-<date>.md, and carrying worktree intake into main is final review's or release close's duty. The executor followed product 07 §Operator-opened ideation mode step 1, which aims the capture at main's intake and calls a worktree copy provisional staging, and WO-173-D006, which wrote to main, instead of the one-writer-per-worktree boundary and the closeout's reconciliation duty. The capture's header repeated the wrong premise; it now names the worktree capture and the closeout reconciliation.",
  "misread": "The executor read product 07's `the intended survivor is the main control-plane checkout's ignored intake` as the executor's own write destination.",
  "meant": "The executor writes only inside its worktree; intake it captures stays in the worktree's ignored intake until final review or release close reconciles it into main.",
  "changed": "No write reached main. The capture stays at docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md in this worktree, its header corrected; the ideation receipt (WO-116-D015) names final review or release close as the reconciliation. `npm run backup:intake` had already written its disposable ZIP beside the worktree, its documented destination, before the correction; it is left in place for the operator.",
  "evidence": [
    "The operator's correction at 23:33Z by the prompt hook's clock: writing to main is not the canonical process; final review or release close deals with it",
    "The harness refusal: `DOTLN_HARNESS_REFUSED: outside-project write to <main checkout>/docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md ... lacks an equipped outside-write grant for role executor (WO-144)`",
    "docs/product/07-execution-guide.md §Operator-opened ideation mode: step 1 aims the capture at main's intake; its closing paragraph names the default capture path docs/intake/notes/<work-order>-expanded-ideation-<date>.md and says `the reviewed closeout helper reconciles worktree-local intake before removal`",
    "docs/evidence/WO-173/decisions.md WO-173-D006: that capture was written in main's ignored intake"
  ],
  "rejected": [
    {
      "option": "Amend product 07 step 1 in this dispatch",
      "reason": "It goes beyond the literal correction, which marks the failure; the wording is routed to planning as this decision's follow-up."
    },
    {
      "option": "Delete the backup ZIP beside the worktree",
      "reason": "A destructive effect on the operator's backup, frozen by the correction; it is disposable and left to the operator."
    }
  ],
  "followup": "Planning: product 07 §Operator-opened ideation mode step 1 aims an executor's ideation capture at the main control-plane checkout's intake and calls a worktree copy provisional staging; the operator's rule is that the executor captures in its worktree and final review or release close reconciles into main. Amend step 1 to that rule.",
  "reopenWhen": "An executor again aims a write outside its worktree, or planning amends product 07 step 1."
}
```

## WO-116-D015 — Ideation breakout receipt: utilization, not activation, while a phase waits

```json
{
  "id": "WO-116-D015",
  "date": "2026-09-28",
  "dispatch": "ideation: (operator messages during resume: next on WO-116 at 2026-09-28T23:27Z and 23:29Z, re-sent under ideation: at 23:30Z by the prompt hook's clock)",
  "decision": "The operator's ideation about waiting inside a phase was captured, screened and synthesized under product 07 §Operator-opened ideation mode, with no change to WO-116's scope. Raw intake batch: this worktree's ignored docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md (SHA-256 b00d1e6376c4e83318c1af0eef46867ed51a950bb649ee793e07fa34f4722b74), the operator's three messages unedited with the context the executor observed; final review or release close reconciles it into main (WO-116-D014). Clean-room treatment: Shape-First synthesis of the operator's own words about this repository's process; nothing employer-derived; no direct-draft filing. Ledger: one section of this date with three entries (two candidate, one raw). Product surfaces: none edited; the durable rule that a phase is stoppable already stands in product 02 (a refused Stop is reported once and then lets the turn end), and utilization versus activation has no product home yet. Planning map: one candidates section with two items, harvested into the follow-up register by npm run meta. Unresolved choices, left to a planning pass: where utilization versus activation lands (the execution guide's goal-aligned decisions, the process meter or the harness), and whether and how a waiting agent uses its wait for bounded work under the Blackjack +3 progressive-absence shape. No executable helper was created. Required review: the verifier and the final reviewer digest this receipt, the ledger section and the map section as part of their subject (product 07 §Ideation breakout receipt and verification).",
  "evidence": [
    "docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md in this worktree, ignored (.gitignore docs/intake/**), SHA-256 b00d1e6376c4e83318c1af0eef46867ed51a950bb649ee793e07fa34f4722b74",
    "docs/lineage/idea-ledger.md §2026-09-28 — Ideation during WO-116 execution; docs/planning/work-order-map.md §Candidates — returns from ideation during WO-116 (recorded 2026-09-28)",
    "docs/product/02-domain-model.md: a refused Stop is reported once and then lets the turn end; a refused Stop does not release the writer",
    "docs/decisions/0007-presence-is-a-policy-input.md item 6 and its 2026-09-24 amendment, README.md's Blackjack +3 paragraph and product 03 §Candidate — progressive absence authority and return readiness: the operator-away shape the third ledger entry borrows",
    "docs/product/09-audit-resilience-privacy.md §Audit projections and visualizations: the cost/resource ledger shows use `without treating activity as value`"
  ],
  "rejected": [
    {
      "option": "Promote utilization versus activation into product 07 now",
      "reason": "Where it lands is a planning choice (the execution guide, the process meter or the harness); the ledger and the map keep it without forcing a product sentence."
    },
    {
      "option": "Capture only",
      "reason": "The operator's message carries the ideation: prefix without a capture-only instruction, which selects the full pipeline."
    }
  ],
  "reopenWhen": "A planning pass disposes the two map candidates, or the operator directs where the distinction lands."
}
```

## WO-116-D016 — The wait used for one question with an end: is this the best way to write this code?

```json
{
  "id": "WO-116-D016",
  "date": "2026-09-28",
  "dispatch": "resume: next; the operator's direction at 2026-09-28T23:39Z by the prompt hook's clock to put one code-quality question to the order's own code while waiting",
  "decision": "While the read-only review ran, the executor used the wait on one question with an end, in the operator's words `is this the best way i can write this code?`, over WO-116's own code: one pass, a verdict per unit, a change only when better. The audit branch in dotln.ts and the contract entry were kept. The alternative for the branch, one scope-and-id pair feeding one filter and one refusal message, trades two plain conditions that mirror the usage line for an indirection, and its double decode matches dotln status. In the skeleton scope test, the last three lines duplicated the `empty` case and were removed with their import. In the WO-116 console case, a count asserted with deepEqual became assert.equal. The pass ran from 23:39:59Z to 23:40:29Z by the shell clock, plus unclocked reading, and ended when every unit had a verdict. It was utilization with a question and an end, not activation. It is the operator-directed trial that the second candidate of the ideation map section names as a reopening condition.",
  "evidence": [
    "packages/skeleton/test/audit-command.test.ts: the removed mkdirSync block and import; packages/console/test/console-commands.test.ts: assert.equal on the replayed dotln.audit count",
    "npx prettier --check on both files passes; after npm run build, node --test packages/skeleton/dist/test/audit-command.test.js passed 3 of 3 and the WO-116 console case 1 of 1",
    "docs/planning/work-order-map.md §Candidates — returns from ideation during WO-116, item 2: reopen when the operator directs a trial"
  ],
  "rejected": [
    {
      "option": "Keep polling the review until it finished",
      "reason": "Activation without a question or an end (WO-116-D013)."
    },
    {
      "option": "Answer the question with another review workflow",
      "reason": "The question was the author's own, and the running review already supplied independent judgment."
    }
  ],
  "reopenWhen": "A planning pass disposes the ideation map's Blackjack +3 wait candidate, or the operator directs another use of a wait."
}
```
