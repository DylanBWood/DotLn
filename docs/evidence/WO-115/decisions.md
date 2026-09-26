# WO-115 decisions

## WO-115-D001

```json
{
  "id": "WO-115-D001",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Expose only implemented terminal entrypoints through console-commands-v1. Bind each command ID to one fixed executable and argv prefix, authorize its declared effect against the resident's compiled effective envelope, then run the same CLI parser and guards. Serve the surface on 127.0.0.1 with a random connection token held in an owner-only resident store. The text console and browser-capable client use this one route.",
  "evidence": [
    "packages/skeleton/src/cli.ts implements --compiled-diff but has no saved-build selection or equip-preview command",
    "packages/skeleton/src/dotln.ts implements intent and presence away/back; scripts/resume.mjs implements derived-order activation as resume activate",
    "scripts/lib/config.mjs declares portfolios in reviewed configuration; scripts/resident-bind.mjs selects a declared portfolio with --portfolio, so the contract names resident.bind-portfolio and excludes portfolio.declare",
    "scripts/worktree.mjs, scripts/harness.mjs and packages/skeleton/src/dotln.ts execute their CLI parsers at module entry, so dispatching their exact Node entrypoints preserves current terminal code and refusal bytes",
    "packages/skeleton/src/resident-state.ts residentRefusal uses the compiled phase effective envelope and kernel authorize; the console adapter uses the same compiled policy inputs before the CLI runs",
    "The 127.0.0.1 bind rejects non-loopback peers; the token file and resident directory are owner-only, and the server refuses missing tokens and foreign browser origins",
    "docs/planning/work-order-map.md already marks the candidate's contract half allocated to WO-115; the fork-side drag-equip surface remains separate"
  ],
  "rejected": [
    {"option": "Add UI-only saved-build, equip-preview or portfolio-declare verbs", "reason": "No terminal implementation exists at activation; that would introduce another command path beyond the selected order."},
    {"option": "Call CLI modules in process", "reason": "Most parsers execute at import time, so this would require a broad entrypoint refactor before parity could be checked."},
    {"option": "Bind only a public loopback port", "reason": "127.0.0.1 limits the machine but cannot distinguish local operating-system users."},
    {"option": "Do nothing", "reason": "The current board and status view cannot invoke the selected terminal controls, so Gate U's authoring contract remains absent."}
  ],
  "reopenWhen": "A named order adds a terminal verb, a source-backed browser host cannot receive its local token, or an observed terminal/console pair differs in result bytes or underlying effect events."
}
```

Goal and critical path: this is Gate U's command boundary after runtime status. It lets the fork's shell and this repository's text host use one command vocabulary while keeping the terminal's existing parser, lifecycle checks and compiled envelope. Policy resistance and rule beating are checked by exact child invocation and refusal fixtures; commons and escalation costs are limited to one resident socket and one serialized command lane. Drift, success to the successful and the wrong-goal risk are checked by byte comparison and the explicit absence of speculative verbs. Shifting the burden is reduced when a UI can invoke an existing command without an operator translating it manually. Naive Interventionism: retain CLI guards, the resident event log and private store; a command missing terminal support stays absent. A NoOp would leave UI authoring blocked by the terminal-only boundary.

This order predates 2026-09-09. Its inherited lifecycle ledger-entry duty is discharged here and through the generated decisions-index row; no ideation ledger entry is appended.

## WO-115-D002

```json
{
  "id": "WO-115-D002",
  "kind": "experiment",
  "date": "2026-09-25",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "decision": "Keep the terminal entrypoints as the command implementation and use a fixed-argv child invocation for parity; defer extracting common in-process handlers until a concrete performance or behavior result warrants it.",
  "question": "Can the current terminal entrypoints provide console parity without first extracting shared in-process handlers?",
  "alternatives": [
    "Dispatch the exact existing Node CLI entrypoints with a fixed prefix and captured result bytes",
    "Extract shared handler functions from each CLI and make both terminal and console call them"
  ],
  "observation": "The CLI parser inspection shows top-level execution in most entrypoints, and the focused socket fixture passes direct-versus-served byte comparisons for successful reads and every declared parser refusal.",
  "budget": {"wallSeconds": 600},
  "execution": "run",
  "cost": {
    "wallSeconds": 12.282,
    "tokens": null,
    "commands": [
      "rg -n 'process.argv|export const main|export async function main' packages/skeleton/src/cli.ts packages/skeleton/src/dotln.ts scripts/resume.mjs scripts/worktree.mjs scripts/harness.mjs",
      "node --test packages/console/dist/test/console-commands.test.js"
    ],
    "source": "One process-local performance.now() window around the source inspection and focused fixture run on 2026-09-25; both exited 0 and the fixture reported 2 pass, 0 fail. The broader implementation time and session tokens are not isolated by this measurement."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["node --test packages/console/dist/test/console-commands.test.js"],
    "summary": "The existing entrypoints produced matching bytes in the measured fixture. No recurring per-order saving was measured; the child-process runtime cost and broad refactor alternative were not benchmarked."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "evidence": ["packages/console/test/console-commands.test.ts", "The 12.282-second command result in this executor session"],
  "rejected": [
    {"option": "Extract shared handlers now", "reason": "Four inspected entrypoints run at import time; a broad refactor would add risk without an observed parity or latency need."}
  ],
  "reopenWhen": "A measured console invocation cost harms the operator flow or a new terminal handler naturally exposes a stable shared function."
}
```

## WO-115-D003

```json
{
  "id": "WO-115-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Record ConsoleCommandInvoked and ConsoleCommandObserved in the resident's existing private event log with actor console. The invocation carries an argument hash rather than raw prose or options; the outcome carries exact result bytes so replay returns the same result without repeating effects. Serialize socket requests and release the append lock while the terminal child runs.",
  "evidence": [
    "packages/skeleton/src/resident-store.ts validates and syncs each append under its short lock; resident-host.ts releases it while an actor effect runs",
    "packages/skeleton/src/console-loopback.ts applies the same transaction/effect/transaction shape and replayConsoleResults projects the stored result bytes",
    "packages/console/test/console-commands.test.ts checks actor console, private caller refusal, compiled effect refusal, exact terminal result bytes for positive reads and every declared parser refusal, and replayed results"
  ],
  "rejected": [
    {"option": "Re-execute commands during replay", "reason": "Lifecycle and presence commands are effectful and cannot safely replay by running again."},
    {"option": "Log raw invocation arguments", "reason": "Intent prose and paths can be private; a hash is sufficient to bind the invocation without copying them into the log."},
    {"option": "Hold the append lock while a CLI child runs", "reason": "That would block resident ticks and presence updates behind potentially long lifecycle work."}
  ],
  "reopenWhen": "An audit consumer needs a narrower private result retention policy, a fixture finds interleaved command effects despite serialization, or replay finds an incomplete invocation after process failure."
}
```

## WO-115-D004

```json
{
  "id": "WO-115-D004",
  "date": "2026-09-25",
  "dispatch": "resume: next; classified release preparation",
  "decision": "Assign application v0.52.0, the next minor above the observed local v0.51.0 tag. Bump the changed skeleton and console components from 0.43.1 and 0.2.0 to 0.44.0 and 0.3.0, and update the console's skeleton pin and lockfile. Leave compiler 0.19.1 and kernel 0.6.0 fixed.",
  "evidence": [
    "git tag --list v* --sort=-version:refname showed v0.51.0 as the highest local tag on 2026-09-25",
    "The WO-115 heading still held the version-assignment placeholder and README.md's release block named v0.51.0 before this edit",
    "packages/skeleton/src adds an exported command contract and resident loopback; packages/console/src adds a client API and text-host command; neither compiler nor kernel source changed",
    "npm install --package-lock-only --ignore-scripts --offline --no-audit --no-fund updated only the two workspace version records and the console skeleton pin in package-lock.json"
  ],
  "rejected": [
    {"option": "Retain the placeholder", "reason": "Release preparation requires one strict version in the selected order heading and a matching README release block."},
    {"option": "Bump compiler or kernel", "reason": "Neither component's source nor compatibility contract changed."},
    {"option": "Use patch component versions", "reason": "Both changed packages expose new additive APIs and command behavior."}
  ],
  "reopenWhen": "Final review integrates a newer published application tag or component version and retimes the unpublished target under the same minor classification."
}
```

## WO-115-D005 — Judge console commands with the terminal's classifier and decider

```json
{
  "id": "WO-115-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D001",
    "observation": "D001's hand-written effect column differed from the terminal classifier and judged operator commands against the away-phase actor envelope. On a Contributor-bound store every read was refused ('repo.inspect' is not in the Contributor envelope) and, while away, even presence back was refused; the direct kernel authorize call also failed the WO-016 decider rule (gate test 237)."
  },
  "decision": "Remove the effect column from console-commands-v1. For each invocation the resident builds the equivalent terminal command text (consoleTerminalCommand), classifies it with the terminal permission hook's permissionEffect, and decides it with the hooks' harnessAuthorization against the resident configuration's compiled program envelope. The away phase's actor envelope no longer judges operator commands.",
  "evidence": [
    "harness-host.ts permission path: permissionEffect(input, root, tools) then harnessAuthorization(config.envelope, effect, Date.now()); reactor.ts exports harnessAuthorization as the harness adapters' decider owner",
    "scripts/resident-bind.mjs missionConfiguration compiles contributorWithSupports() with contributorOutsideAuthority; its compiled envelope requires 'resolved-worktree' and allows repo.read, repo.write, shell.run, git.local, lifecycle.run and the outside-write grants, matching the envelope embedded in .claude/hooks/permissions.mjs",
    "Classifier probe of the equivalent commands: resume status/times/release-close and bare next repo.read; resume next with arguments, fix, verify, final-review, activate, worktree actions and release close lifecycle.run; harness, skeleton, dotln, console and resident-bind shell.run",
    "Codex's recorded npm test (docs/control/local/harness/checks.json, 2026-09-25T22:47:57.768Z, exit 1, 442 pass / 7 fail) failed 237 'authorize leaked into console-loopback.ts'",
    "packages/console/test/console-commands.test.ts: bound-resident reads and presence back while away are served; the narrow-fixture denial matches harnessAuthorization's own decision; every admitted receipt's effect equals the classifier's"
  ],
  "rejected": [
    {"option": "Relabel the hand-written effect column", "reason": "It would remain a second classification table that can drift from the terminal hook's classifier."},
    {"option": "Move a new authorize call into resident-state.ts", "reason": "resident-state.ts is a judged feedback source; changing it stales the live feedback edition and needs a live model episode, while the existing reactor.ts decider already serves the hooks."},
    {"option": "Keep judging with the phase effective envelope", "reason": "That envelope bounds the resident's own actors; it refused the operator's reads and presence back."}
  ],
  "reopenWhen": "The terminal hook classifier or decider changes its inputs, a bound resident's compiled envelope differs from the emitted hook envelope, or a UI needs an authority decision the terminal hooks do not make."
}
```

Goal and critical path: this keeps Gate U's command boundary to one authority path, the one the terminal already enforces. Policy resistance and rule beating are addressed because the console cannot declare a milder effect than the classifier derives from the typed text. Drift and a second table are removed rather than tested for. Escalation, the tragedy of the commons and shifting the burden are unchanged: one loopback per resident and one serialized lane. Success to the successful and seeking the wrong goal were checked against the order's objective, not the earlier fixture. Naive Interventionism was avoided by reusing the existing classifier and decider without editing judged sources. NoOp would ship a surface that refuses every read on a real bound store.

## WO-115-D006 — Contract membership: add the release-close helper, run harness directly, refuse streaming

```json
{
  "id": "WO-115-D006",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D001",
    "observation": "D001 omitted the release-close phrase's publish helper, routed harness commands through the npm wrapper that rebuilds packages/*/dist under a running resident, gave no exclusion rule, and admitted console status --watch, which never completes and wedged the serial lane and shutdown."
  },
  "decision": "Add release.close (node scripts/release.mjs close), because product 07's resume: release close phrase runs that exact helper. Serve harness.emit and harness.check through node scripts/harness.mjs, the documented direct form, without the rebuild npm run harness adds. Refuse options that stream until interrupted (console status --watch) with a recorded refusal, because a console result is one complete exit code and byte pair. Record the category rule and the excluded terminal commands in product 04.",
  "evidence": [
    "docs/product/07-execution-guide.md: resume: release close runs node <main>/scripts/release.mjs close WO-NNN --publish as printed by resume release-close",
    "scripts/harness-entry.mjs runs npm run build before scripts/harness.mjs for every action except evidence --stop",
    "packages/console/src/runtime-status.ts: --watch installs a watcher and never returns",
    "Inventory fixture: all 23 commands refuse through their own parsers with byte-identical direct and served results"
  ],
  "rejected": [
    {"option": "Exclude release close", "reason": "It is one of the resume: phrases the objective names; the hook classifies it lifecycle.run and the compiled envelope decides it as for a terminal."},
    {"option": "Keep npm run harness", "reason": "Rebuilding the dist a running resident executes from is a hazard, and a launchpad without the npm script failed before reaching harness.mjs."},
    {"option": "Serve --watch and rely on a deadline", "reason": "A streamed result has no complete byte pair to return or replay, and a deadline would also kill long legitimate lifecycle commands."}
  ],
  "reopenWhen": "A streaming transport is designed for the console, a named order adds a terminal command in the listed categories, or harness.mjs needs a build step the running resident has not already made."
}
```

## WO-115-D007 — Local transport, terminal refusal shape and lifecycle

```json
{
  "id": "WO-115-D007",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D001",
    "observation": "The owner-only store check refused ordinary 0755 stores (gate tests 223, 224, 232, 235), a descriptor left by SIGKILL refused every later start (gate test 222), caller refusals were HTTP JSON rather than a terminal refusal, names failing a regex were unrecorded 400s, and children inherited the launching agent session's identity."
  },
  "decision": "Keep the 127.0.0.1 bearer-token boundary, but hold the descriptor and result bytes in an owner-only <store>/console directory instead of requiring the whole store to be owner-only. Replace a leftover descriptor at start, because the lifetime lock proves its owner exited. Give every console-originated refusal the lifecycle CLIs' shape (exit 1, empty stdout, 'error: <reason>'), including transport refusals under their HTTP status. Record any decoded command name, verbatim only within [A-Za-z0-9._-]{1,64}, otherwise by digest. Cap bodies at 1 MiB. Interrupt a command's process group when its caller disconnects or the resident stops, and record the result. Strip CLAUDE*, CODEX_THREAD_ID, COPILOT_AGENT_SESSION_ID and resident-episode variables from children. Terminal-originated refusals stay byte-identical, including the skeleton CLI's uncaught usage error, which is WO-142's tested behavior.",
  "evidence": [
    "resident-host.ts run() acquires the store's lifetime lock in start() before ConsoleLoopback.start()",
    "scripts/resume.mjs, worktree.mjs, release.mjs and resident-bind.mjs refuse with 'error: <message>' and exit 1",
    "scripts/resume.mjs and the harness runtime read CODEX_THREAD_ID, COPILOT_AGENT_SESSION_ID and CLAUDE_PID; CLAUDE_PID owns writer reservations",
    "packages/skeleton/test/cli.test.ts 'WO-142 unknown skeleton arguments refuse before running the scenario'",
    "Focused skeleton suites (resident, runtime-status, scenario, presence, presence-signals, cli, resident-actors): 78 of 78 pass on this subject",
    "packages/console/test/console-commands.test.ts: 0755 store, stale descriptor restart, caller/origin/JSON/oversize refusals in terminal shape, recorded unknown names, an interrupted FIFO reader recorded with exit 143 and the lane freed, and shutdown during an in-flight command"
  ],
  "rejected": [
    {"option": "Refuse CORS entirely", "reason": "The declared browser shell is a client; the bearer token held in a 0600 descriptor remains the barrier and a non-local Origin is refused."},
    {"option": "Mimic each CLI's catch path for console refusals", "reason": "The dotln and console catch paths replace unknown reasons with a generic line and would hide the refusal reason; one recorded shape is inspectable."},
    {"option": "Add a per-command deadline", "reason": "Lifecycle commands have no fixed duration; disconnect and shutdown interruption bound them without killing legitimate work."}
  ],
  "reopenWhen": "A browser host needs a narrower origin rule, another host-session variable changes lifecycle attribution, or a platform without process groups runs the resident."
}
```

## WO-115-D008 — Console receipts carry digests; the judged resident fold is unchanged

```json
{
  "id": "WO-115-D008",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D003",
    "observation": "D003 registered console events in resident-state.ts, which staled the WO-159/WO-161 live feedback edition (gate test 113) and would require a live model episode. It also stored full base64 result bytes in the resident log that every resident transaction replays, and replay silently dropped an invocation without a result."
  },
  "decision": "Leave resident-state.ts byte-identical to main. The resident fold already carries unregistered event types, so ConsoleCommandInvoked and ConsoleCommandObserved are appended with actor console and validated by replayConsoleResults. ConsoleCommandObserved records the exit code and the SHA-256 and length of stdout and stderr; the bytes are content-addressed under <store>/console/results with mode 0600. Replay verifies every digest, rejects an orphan or duplicate result, and names invocations without a result.",
  "evidence": [
    "An unregistered event type with actor console appended and folded without error in a temporary resident store",
    "node scripts/feedback-evidence.mjs --check: 'Carried live feedback audit docs/evidence/WO-159/feedback-001, named by docs/evidence/WO-161/feedback-001; component release labels moved since.'",
    "resident-store.ts ResidentTransaction reads and replays the whole log on every transaction",
    "Fixture: replay equals the served results, including refusals and interrupted commands; a truncated log names the missing result"
  ],
  "rejected": [
    {"option": "Record a new live feedback edition", "reason": "The console needs no fold behavior, and the live episode would add a model run without changing judged behavior."},
    {"option": "Cap result bytes in the log", "reason": "A truncated result cannot be replayed exactly."}
  ],
  "reopenWhen": "The resident fold starts rejecting unregistered types, a consumer needs console receipts in the runtime status projection, or retention of result bytes needs a deletion policy."
}
```

## WO-115-D009 — Takeover correction of the fixtures and evidence claims

```json
{
  "id": "WO-115-D009",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D002",
    "observation": "D002 called the inventory's results 'every declared parser refusal'. The four resume lifecycle entries refused only because WO-115 was active; in other phases the same '--invalid' calls append real transitions or rewrite current.md in the repository under test, and the harness cases rebuilt dist four times per run."
  },
  "decision": "Replace the fixtures. The inventory uses phase-independent refusals ('--work-order BAD' for resume, 'BAD' for release and worktree, direct harness.mjs) and asserts byte parity, an unchanged launchpad control digest and unchanged resident domain events for both runs. Success-path parity with bytes and events covers resume status and times, the compiled diff, dotln status, console status, presence away and presence back. Lifecycle, intent, bind and emit success paths are not run against the repository; their parity rests on the identical entrypoint, arguments, working directory and environment, and on the refusal inventory. D002's experiment is retained as recorded; no second experiment was started.",
  "evidence": [
    "scripts/resume.mjs selectionArgs throws on '--work-order BAD' before readControl; release close, worktree and resident-bind validate their identifiers before any effect",
    "Direct run of all 23 refusal invocations: each exit 1 with the control digest unchanged",
    "The operator directed Claude to take over the session after the Codex provider became unavailable; Codex's D001-D004 and its tree were preserved and repaired in place"
  ],
  "rejected": [
    {"option": "Run success paths of lifecycle commands in a disposable launchpad", "reason": "Byte parity would depend on path-bearing output and restored repository state; the added fixture cost does not change which implementation runs."}
  ],
  "reopenWhen": "A console invocation diverges from its terminal run in a lifecycle success path, or a parser starts performing effects before rejecting these arguments."
}
```

## WO-115-D010 — Second independent review: fail-closed classification, a transport that outlasts client timeouts, and stronger fixtures

```json
{
  "id": "WO-115-D010",
  "date": "2026-09-26",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "reopens": {
    "decisionId": "WO-115-D007",
    "observation": "A second independent review of the repair confirmed: classifier exceptions (argument prose naming git push, npm publish, gh pr create or ssh) became undocumented refusals where the hook only advises; Node's fetch abandons a response without headers after 300 s and would have interrupted long lifecycle commands; console receipt transactions advanced the tick's change baseline and could hide a served presence change; SIGKILL escalation followed the direct child only; admission continued until a running tick finished; the envelope-denial fixture used an expired envelope; resume reads required local checkpoint refs and a stable live journal."
  },
  "decision": "Keep refusing what the classifier cannot classify, because the console has no host-permission layer to defer to, and document it with the hook's own 'command classification:' wording. Answer caller, route and request checks on arrival; for an admitted command flush 200 headers at once and write a space every 30 s until the JSON result. Console receipts use a transaction that leaves the host's change baseline alone. Kill the command's group two seconds after interruption unless the result has settled, and release its pipes five seconds after its own process exits. The first stop request, including SIGHUP for dotln resident, ends admission at once. Result blobs clean up their temporary file and fsync their directory before the receipt; replay names a missing blob's command. Fixtures: a current fixture envelope admits repo.read and refuses lifecycle.run and shell.run with 'effect not allowed'; resume reads compare the served bytes with adjacent terminal runs and do not require local checkpoint refs; interruption and shutdown wait on flushed headers rather than fixed delays; every ID has its literal terminal text; a Host-header refusal, a classification refusal and the change-baseline behavior have fixtures.",
  "evidence": [
    "harness-host.ts: a classifier exception and a compiled-authority denial both become protocolAdvisory ('...; host permissions decide.') in the Claude permission hook",
    "A Node fetch against a server that never sends headers rejected with UND_ERR_HEADERS_TIMEOUT after 301 s (review probe); ServerResponse.writeHead queues headers until the first write, which made the first fixture run wait for the 30 s keep-alive byte until flushHeaders was added",
    "resident-store.ts transaction set observedBytes on every transaction; resident-host.ts tick polls changed() to preempt an episode",
    "A FIFO-blocked console status child exits within 2 ms of SIGTERM to its process group",
    "node scripts/harness.mjs check exits 1 in this worktree with 'harness drift: pinned snapshot missing or changed', the local installed-snapshot state; its success bytes vary by checkout, so the fixture keeps its parser refusal only",
    "packages/console/test/console-commands.test.ts: 5 of 5 pass in 14.9 s"
  ],
  "rejected": [
    {"option": "Serve unclassifiable text as the terminal would", "reason": "The terminal's outcome for it is an advisory and a host-permission decision; the console has no host decision to defer to, so admitting it would be the one place a UI could do more than a hooked terminal."},
    {"option": "Cap command output", "reason": "The review found no contract command with harmful output size, and a cap would break exact replay (D008)."},
    {"option": "A per-command deadline", "reason": "Still rejected (D007): keep-alive bytes satisfy client idle timeouts without killing long legitimate lifecycle work."}
  ],
  "reopenWhen": "The operator wants classifier-refused prose served, a client needs a streamed body, a contract command's output grows large, or a platform without process groups runs the resident."
}
```

## WO-115-D011 — Re-emit the harness bundle and select authority evidence WO-115/001

```json
{
  "id": "WO-115-D011",
  "date": "2026-09-26",
  "dispatch": "resume: next; operator takeover after the Codex session stopped",
  "decision": "Re-emit the harness bundle with npm run harness -- emit, because packages/skeleton/dist/src/resident-store.js is a pinned runtime file of the emitted hooks and the console's observe option changed it. Record authority evidence as WO-115 revision 001 and select it in docs/evidence/current.json, because the selected WO-160 revision 002 bundle-diff.json pins the previous bundle digests.",
  "evidence": [
    "npm run test:docs before the emit: 'harness drift: .claude/hooks/commit-msg.mjs'; an emit into a temporary directory differed only in the runtime snapshot key and the pinned hash of packages/skeleton/dist/src/resident-store.js",
    "npm run harness -- emit: 31 generated surfaces; the 13 changed hooks and .claude/harness-manifest.json differ only in snapshot keys and pinned hashes",
    "docs/evidence/WO-115/authority/001/authority.json is byte-identical to docs/evidence/WO-160/authority/002/authority.json; bundle-diff.json differs only in bundle digests and its edition label",
    "node scripts/authority-evidence.mjs --check verifies the selected edition; npm run test:docs: 21 passed, 0 failed"
  ],
  "rejected": [
    {"option": "Keep the resident-store.js change out of the pinned runtime", "reason": "The change-baseline fix belongs in the store every resident host uses; the pinned bundle records runtime bytes, not behavior."},
    {"option": "Overwrite WO-160 revision 002", "reason": "Evidence editions are immutable; a new edition preserves the prior record."}
  ],
  "reopenWhen": "Final review integrates a newer authority edition from main, or a later bundle change stales WO-115 revision 001."
}
```

## WO-115-D012 — Verification finds queued requests lost before admission

```json
{
  "id": "WO-115-D012",
  "date": "2026-09-26",
  "dispatch": "resume: verify",
  "reopens": {
    "decisionId": "WO-115-D010",
    "observation": "The headers and keepalive added for a running command do not cover a decoded request waiting in the serial lane. A native Node v26.9.0 fetch for resume.times behind a FIFO-blocked console.status failed after 301246 ms with UND_ERR_HEADERS_TIMEOUT. After orderly shutdown, the log and replay contained only console.status; the queued invocation had no receipt. The same resume.times entrypoint completed directly with exit 0 in 757 ms."
  },
  "decision": "Fail independent verification for VER-001 F1. Preserve the implementation for repair: queued requests must retain an observable outcome and must not disappear because the transport waits for the preceding command before sending headers. No implementation change or acceptance waiver is made by the verifier.",
  "evidence": [
    "docs/verifications/WO-115/VER-001.md#f1--queued-commands-time-out-and-disappear-from-replay",
    "packages/skeleton/src/console-loopback.ts:375-383 queues after decode; 458-461 drops a gone caller before admit; 475-479 starts headers and keepalive only after admission",
    "Independent real-socket probe with the production ResidentHost, missionConfiguration, native fetch and a system-temporary FIFO; after shutdown replay returned only console.status exit 143 and incomplete []",
    "Both read-only xhigh reviewers independently identified the same queue and receipt gap; the root verifier reproduced it"
  ],
  "rejected": [
    {"option": "Pass on the existing single-command fixtures", "reason": "They pass while an authenticated, decoded queued invocation is lost, contradicting criterion 3 and the documented receipt guarantee."},
    {"option": "Repair the implementation during verification", "reason": "Independent verification records the judged subject and routes substantive defects to a separate repair dispatch."},
    {"option": "Add a blanket command deadline", "reason": "Long lifecycle commands are intentionally supported; the observed failure is the waiting request's transport and receipt handling."}
  ],
  "followup": "WO-115 repair, VER-001 F1: preserve queued request liveness and an invocation/result or explicit cancellation receipt; add a two-request regression behind a blocked command and independently reverify criteria 1 and 3.",
  "reopenWhen": "A repaired two-request fixture proves the waiting command returns its terminal result or a recorded refusal, and a caller leaving while queued remains visible in replay."
}
```

Goal-alignment judgment: this protects Gate U's terminal-to-console contract and
operator flow. Policy resistance and rule beating matter because a passing
single-request fixture masks a lost command; drift and seeking the wrong goal
are avoided by judging the receipt promise rather than the test count. The
commons and escalation costs are bounded to two read-only reviewers,
one full gate and one real timeout probe. Success to the successful does not
justify keeping the current queue boundary; shifting the burden to the operator
would make retries and forensic reconstruction routine. Naive Interventionism
favors a bounded repair preserving serialization, existing terminal handlers
and authority. NoOp leaves accepted request loss unobservable.

## WO-115-D013 — Repair VER-001 F1: open every decoded request's response before the lane and keep its receipts

```json
{
  "id": "WO-115-D013",
  "date": "2026-09-26",
  "dispatch": "resume: fix against VER-001 F1",
  "reopens": {
    "decisionId": "WO-115-D012",
    "observation": "The two-request fixture proves a request waiting behind a FIFO-blocked console.status is answered at once and returns dotln.status's terminal bytes when the lane frees, and a caller that leaves while queued keeps its invocation and a recorded refusal in replay. On the unrepaired lane the same fixture fails after 10 s with 'a queued request got no response while the lane was busy'."
  },
  "decision": "Open the response for every decoded request before it enters the serial lane: flush 200 headers and write the keep-alive space every 30 s while the request waits and while its command runs, and stop dropping a queued request whose caller left or whose resident is stopping before admission. Every decoded request now records ConsoleCommandInvoked and ConsoleCommandObserved; a caller that left while queued gets the recorded refusal 'the caller left before the command started', and a request still waiting at shutdown 'the resident is stopping'. A lane failure after the headers is answered as a terminal-shaped refusal naming the command. The fixtures wait for a blocked command's invocation receipt before interrupting it, because the in-process resident appends the receipt and spawns the child in one event-loop turn and a 200 no longer implies admission. D002's experiment stands; no second economy experiment was started.",
  "evidence": [
    "docs/verifications/WO-115/VER-001.md#f1--queued-commands-time-out-and-disappear-from-replay",
    "packages/skeleton/src/console-loopback.ts: accept flushes the headers and runs the keep-alive around the whole lane wait; run always admits and records, refusing instead of executing when the caller is gone or the resident is closing; packages/skeleton/src/resident-store.ts transaction appends synchronously with no await after the append; packages/skeleton/src/resident-host.ts closes the console before the store",
    "packages/console/test/console-commands.test.ts: the bound fixture's two-request block and its shutdown block with a waiting request; node --test packages/console/dist/test/console-commands.test.js: 5 passed, 0 failed in 15.95 s",
    "Negative check on the unrepaired lane (headers inside run, a gone caller dropped before admit), built into the same dist and run once: the bound fixture failed with 'a queued request got no response while the lane was busy' after 17.66 s; the repaired source was then restored byte-identically and rebuilt",
    "A FIFO write-end probe was tried first as the started signal and rejected: opening the write end let console.status finish with 'input could not be projected' instead of blocking",
    "docs/product/04-interfaces.md §Console parity contract v1 and packages/console/README.md now state the queued-request behaviour and both refusals"
  ],
  "rejected": [
    {"option": "Refuse a request while another command runs", "reason": "A busy refusal fails a valid command where the terminal succeeds, so a UI could do less than the terminal; VER-001 asked for a live response or an explicit terminal-shaped refusal, and the live response keeps parity."},
    {"option": "Run a queued command whose caller already left", "reason": "Ctrl-C before a command starts runs nothing; the recorded refusal is the observable outcome criterion 3 needs, and it spends no effect on a result nobody receives."},
    {"option": "Keep dropping requests still queued at shutdown without a receipt", "reason": "Product 04 promises receipts for each decoded request, and the resident host closes its console before its store, so the refusal receipt is safe to append."},
    {"option": "A per-request or per-command deadline", "reason": "Still rejected (D007, D010): the verifier excluded a blanket lifecycle deadline, and a keep-alive while queued removes the client timeout without one."}
  ],
  "reopenWhen": "A client needs its queue position or a streamed body, a contract command holds the lane longer than a keep-alive can justify, or the resident host stops closing its console before its store."
}
```

Goal-alignment judgment: this repair restores Gate U's command/result
boundary, so a UI can queue operator work without losing it. Policy
resistance and rule beating: the fixture judges the receipt promise and the
returned bytes, not a test count, and it was shown to fail on the unrepaired
lane. Drift to low performance and seeking the wrong goal: parity stays the
target; a busy refusal would have made the console weaker than the terminal.
Tragedy of the commons and escalation: the change is one transport ordering
plus a receipt path, with no new deadline, agent or gate. Success to the
successful: the serial lane and the terminal handlers are unchanged. Shifting
the burden: the operator no longer retries or reconstructs a lost command.
Naive Interventionism favoured this bounded repair over the transport
redesign the verifier did not prescribe. NoOp would have left accepted
requests unobservable after a client timeout.

## WO-115-D014 — Reverification resolves F1 and retains the full gate failure

```json
{
  "id": "WO-115-D014",
  "date": "2026-09-26",
  "dispatch": "resume: verify",
  "decision": "Mark VER-001 F1 resolved by the repaired fixture and an independent 60-second socket probe, but fail VER-002 solely on unwaived criterion 5: fresh npm test still fails in its mixed-revision worktree-integration fixture. Record the test-instrument follow-up without changing console implementation, acceptance text, main or earlier reports.",
  "evidence": [
    "docs/verifications/WO-115/VER-002.md: all 23 parser/refusal pairs pass; queued headers arrived in 1 ms, whitespace at 30003 and 60003 ms, the eventual result matched terminal bytes, and replay contained both commands with incomplete []",
    "npm test: 26 suites passed, one failed, 71 fresh tasks, 318534 ms, exit 1 at 2026-09-26T03:20:06.092Z; console passed in 22706 ms; skeleton passed in 315630 ms",
    "docs/control/local/harness/check-output/afc93d035d849acfd52e35e6a5bd557c5dd9f774af0dc6637afd57501bea8a15.log:66 records missing packages/skeleton/src/control-beacon-fs.mjs",
    "scripts/test-worktree-integration.mjs clones moving main then overlays subject scripts and built packages; git cat-file confirms the imported path exists in subject HEAD but not main after WO-070",
    "The order requires npm test green; the repair handoff records criterion 5 not green; canonical status records no waiver"
  ],
  "rejected": [
    {"option": "Pass because the repair and 26 suites pass", "reason": "The original criterion requires the complete npm test to pass; no waiver exists."},
    {"option": "Repeat the isolated nine-test diagnostic and call it the gate", "reason": "That does not establish the full criterion; the cause is already source-confirmed and reproduced."},
    {"option": "Change the fixture or integrate main during verification", "reason": "The verifier preserves the subject; repair owns test changes and final review owns normal sibling integration."},
    {"option": "Reopen the queue repair or require crash-durable enqueue", "reason": "Normal disconnect and orderly shutdown pass. Headers precede admission; crash-durable queue admission is not an established guarantee."}
  ],
  "followup": "WO-115 gate follow-up G1: restore coherent source inputs for the worktree-integration test instrument and obtain fresh complete npm test evidence plus independent verification; preserve failed rows and resolved F1. Normal sibling integration remains a final-review action; any waiver requires separate operator authorization through canonical waive.",
  "reopenWhen": "A complete gate at the judged source succeeds, or the operator explicitly authorizes and records a canonical waiver of criterion 5."
}
```

Goal alignment: Gate U's command boundary now retains ordinary queued outcomes.
Policy resistance and shifting the burden matter because dependence on moving
main can make a correct order need repeated operator rescue. Commons and
escalation favor one full run and a named follow-up over unchanged diagnostics.
Drift and rule beating forbid calling a failed full run green. Success to the
successful does not privilege the existing fixture over coherent inputs;
seeking the wrong goal is avoided by judging actual behavior and the original
criterion. Naive Interventionism preserves handlers, the repaired queue and
normal integration ownership while isolating the test-instrument defect.
NoOp would leave the unmet criterion only in prose and invite another unchanged
verification cycle; the follow-up makes the missing evidence explicit.

## WO-115-D015 — Repair VER-002 G1: base the integration fixture on the source's own committed revision

```json
{
  "id": "WO-115-D015",
  "date": "2026-09-26",
  "dispatch": "resume: fix against VER-002 G1",
  "reopens": {
    "decisionId": "WO-115-D014",
    "observation": "With the fixture's main set to the source's committed HEAD, node --test scripts/test-worktree-integration.mjs passes 9 of 9 in 83.58 s, and again inside the full npm test at the repaired subject; the unchanged fixture in the same session failed 7 of 9 in 21.24 s with the empty-stdout assertions VER-002 recorded."
  },
  "decision": "Repair the worktree-integration test instrument, not the branch: after the bare clone, point the fixture origin's refs/heads/main at the source's own committed HEAD, so the working-tree overlays (the five entry points, scripts/lib and the built package dists) and the committed package leaves they import (packages/*/src/*.mjs) come from one revision. The fixture's main was only a base for its own fixture commits; no case depends on a file only real main carries, and the 9-of-9 run shows the committed HEAD supplies every base file the cases read. No console source, acceptance text, main, tag or earlier report changes. D002's experiment stands; no second economy experiment was started.",
  "evidence": [
    "docs/verifications/WO-115/VER-002.md#g1--full-gate-mixes-revisions-in-its-integration-fixture",
    "scripts/test-worktree-integration.mjs fixture(): clone --bare of the source, then clone --branch main; the overlay copies the working tree's scripts/lib, whose beacons.mjs, beacon-observe.mjs, meta.mjs, gate-evidence.mjs, copilot-*.mjs and target-publish.mjs import committed packages/skeleton/src and packages/compiler/src .mjs leaves",
    "git log HEAD..main: four commits ahead (fde11f3c … f73b7e18, WO-070), which moved the Beacon leaves to packages/beacons; git merge-base HEAD main equals HEAD af401170, so this branch has no commits of its own",
    "Same session, before the edit: 2 passed, 7 failed in 21.24 s; tests 1, 2 and 8 assert on empty stdout because worktree.mjs fails to import packages/skeleton/src/control-beacon-fs.mjs, as in VER-002's canonical log line 66",
    "After the edit: 9 passed, 0 failed in 83.58 s (docs/evidence/WO-115/worktree-integration.txt); prettier reformatted only the added call, and HEAD's copy of the file was prettier-clean",
    "npm test at the repaired subject: 27 passed, 0 failed, 71 fresh tasks, 321.67 s, exit 0, 2026-09-26T03:37:49.801Z, code identity 0e22ed0f73bcbb8355fac73b9b1a85ddd55b76dec056b781911c8b8fe9290d1a; worktree-integration passed in 111.20 s and console in 23.35 s",
    "Precedent: WO-064 D007 and WO-069's adjacent repair widened this fixture's overlay for the same class of split inside an order's own paths",
    "docs/product/07-execution-guide.md §Independent workflows and integration: the integrating final-review session owns routine integration; verification judges its recorded subject"
  ],
  "rejected": [
    {"option": "Run worktree integrate during repair, which the helper admits in repairing", "reason": "Product 07 gives routine integration to the final-review session and D014 kept it there; integrating now would move the verified subject onto WO-070's base, and every other unintegrated sibling would still fail this suite whenever main moves a leaf its scripts import."},
    {"option": "Port main's WO-070 overlay of packages/beacons", "reason": "This subject has no packages/beacons, and copying the moved skeleton leaves one by one is a list that decays with every later move, the hazard WO-064 D007 recorded."},
    {"option": "Overlay every packages/*/src directory from the working tree", "reason": "Wider than the observed split; the committed HEAD already carries this subject's leaves, and no WO-115 change touches a packages/*/src .mjs file."},
    {"option": "Ask for a waiver of criterion 5", "reason": "The defect is fixable within this repair's authority, and a waiver is the operator's, never this order's executor's."}
  ],
  "reopenWhen": "A subject changes an uncommitted packages/*/src .mjs leaf that scripts/lib imports, so the working-tree overlay and the committed HEAD split again; or a fixture case needs real main's content rather than a base for its own commits."
}
```

Goal-alignment judgment: this restores the gate's ability to judge an
unintegrated order, which Gate U's verified loop needs, without touching the
console repair D014 found resolved. Policy resistance and shifting the burden
were the concerns: a fixture tied to moving `main` fails any unintegrated
sibling each time `main` moves a leaf its scripts import, and it made the
operator or final review rescue a correct order. Rule beating is avoided
because the suite runs every case unchanged, and the same session saw it fail
first. Drift to low performance and seeking the wrong goal: criterion 5 stays
the complete `npm test`, not a subset. Commons and escalation: one git call in one
test file, with no new gate, agent or process. Success to the successful: no case
depended on the moving-`main` base. Naive Interventionism kept
the integration helper, its cases and final review's ownership of integration.
NoOp would have left criterion 5 unmet until an integration or a waiver.

## WO-115-D016

<!-- integration refs/dotln/checkpoint/WO-115/14 -->

```json
{
  "id": "WO-115-D016",
  "date": "2026-09-26",
  "dispatch": "worktree integrate WO-115",
  "decision": "Integrate fetched main f73b7e18 into the uncommitted WO-115 subject based on af401170, preserving checkpoint 14 and the named stash. Keep both roadmap entries, WO-070 Beacon workspace/imports and feedback edition, and WO-115 skeleton 0.44.0 / console 0.3.0 versions with the matching lockfile. Application v0.52.0 remains the next minor above integrated v0.51.1. Re-emit the harness and record authority revision WO-115/002 without overwriting either earlier edition. No console behavior, contract, criterion or prior report is changed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-115/14",
    "base af401170e0c9f197e9f6a1cd2cf1ea26d4d5c2e4",
    "upstream f73b7e184b38de9cab97b4e86c718b6006f6b19d",
    "docs/verifications/WO-115/VER-001.md through VER-003.md: F1 queue loss and G1 mixed-revision test instrument resolved before final review",
    "Integrated manifest and lockfile diffs retain upstream @dotln/beacons 0.1.0, add no WO-115 dependency, and retain the original minor component bumps",
    "node scripts/harness.mjs check passes after local workspace links are refreshed; feedback check retains the WO-070 live audit with unchanged judged behavior",
    "Authority revision 002 is generated after integration because revision 001 bundle digests are stale; earlier evidence bytes are retained"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the new base or manifest conflicts as a console defect",
      "reason": "Product 07 assigns behavior-preserving integration bookkeeping to final review; verified source and acceptance claims remain unchanged."
    },
    {
      "option": "Overwrite authority revision 001",
      "reason": "Its original source must remain inspectable; revision 002 binds the integrated bundle."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-26. Original base: `af401170e0c9f197e9f6a1cd2cf1ea26d4d5c2e4`.
Fetched main: `f73b7e184b38de9cab97b4e86c718b6006f6b19d`. Checkpoint: `refs/dotln/checkpoint/WO-115/14`.
Named stash retained: `d820b3080a64a46e26160431fdbb6d0357c0064e` (WO-115 integrate 2026-09-26).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-115 target v0.52.0 remains current.
Files changed:
  docs/final-reviews/WO-115/PR.md
Tag observation: local snapshot only.
Carried-forward claims: VER-003 criteria 1–4 remain supported by the same console sources, fixtures and write-backs; criterion 5 will be judged by the fresh integrated final product gate. Earlier reports retain their original subjects. No behavioral conflict resolution was required.
Authored conflicts observed: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks: the final product gate with review selection, publication, harness and local release surfaces; final results belong in FINAL-001. Authority revision 002 supersedes revision 001 for this integrated source; feedback keeps upstream WO-070/001. The initial build failed while package manifests still contained conflict markers; after resolution, the next continuation required installing the newly integrated local Beacon workspace link. Both are resolved and the integration helper completed.

Goal alignment: Gate U needs a dependable command boundary that the next UI host can consume. Policy resistance and shifting the burden favor completing routine integration here, without operator reconstruction. Commons and escalation are bounded by two batched read-only reviews, no descendants and one final review gate after integration. Drift and rule beating retain the original criteria and resolved regressions. Success to the successful does not privilege an older evidence edition over current source; seeking the wrong goal judges terminal bytes, authority and replay instead of activity counts. Naive Interventionism preserves the shared terminal handlers, existing release classification and immutable reports. NoOp would leave an unintegrated branch and stale bundle evidence; reopen if integrated checks reveal a behavioral or acceptance defect.

## WO-115-D017 — Preserve the unchanged watcher timeout and obtain fresh product evidence

```json
{
  "id": "WO-115-D017",
  "date": "2026-09-26",
  "dispatch": "resume: final review",
  "decision": "Preserve the failed expanded gate and record the unchanged WO-114 atomic-replacement watcher timeout as a separate, nonblocking reliability follow-up for this console-command order. Run one fresh complete product selection on identical code before any passing verdict. Carry the passing expanded machinery suites from the first run, without converting that failed overall run into a pass.",
  "evidence": [
    "npm test -- --review: 35 of 36 suites passed, 80 fresh tasks, 664821 ms, exit 1 at 2026-09-26T04:06:20.583Z; code identity 356a17786393d4a5e8bdfd3bc68a637b8553e10c244eb0f527c3b3e1f323f72d",
    "docs/control/local/harness/check-output/e403695bfd399d5492c007df0aa4fa61678d49a3c89c0e1bfeb1b11711252f46.log: WO-114 text host refreshes after atomic replacement fails with status watch timed out; all WO-115 tests pass",
    "packages/console/test/runtime-status.test.ts:194-219 directly calls unchanged watchRuntimeStatus on a private temporary directory and races an unchanged 2000 ms timer; it imports no new WO-115 transport source",
    "Immediate isolated node --test --test-name-pattern test rerun passes the case in 10.070 ms, with total process duration 2042.473 ms; no source edit or timeout adjustment",
    "The independent transport reviewer confirms no diff in runtime-status.ts, its test, or runtime-status-contract.ts against integrated HEAD; the last watcher/test source change is WO-114; root cause is unestablished",
    "console.status --watch is explicitly excluded from console-commands-v1; this observation is outside the selected complete-result command contract"
  ],
  "rejected": [
    {
      "option": "Call the first gate green because the selected feature passed",
      "reason": "The full run exited 1 and criterion 5 requires a passing complete npm test."
    },
    {
      "option": "Blame load or extend the watcher timeout",
      "reason": "One failure and one focused pass establish differing observations, not their cause; a reviewer cannot implement and certify a behavioral repair."
    },
    {
      "option": "Repeat the expanded machinery selection unchanged",
      "reason": "Every machinery suite passed on this exact code. A fresh complete product run rechecks the failed application suite and original product gate without repeating unrelated successful machinery checks."
    }
  ],
  "followup": "WO-114 watcher reliability follow-up: reproduce the atomic-replacement watch timeout observed during WO-115 final review, distinguish missed filesystem notification from scheduling or test instrumentation, and strengthen the behavior or regression only from that evidence. Preserve the failed expanded gate and the focused passing run.",
  "reopenWhen": "The fresh complete product retry fails, an ordinary status watcher misses a replacement, or repeated evidence identifies a deterministic cause; a selected-contract defect routes through repair and independent verification."
}
```

Goal alignment: the operator needs reliable evidence for the command boundary and an inspectable record of unrelated reliability observations. Policy resistance and shifting the burden favor a named follow-up over another undocumented retry. Commons and escalation bound the response to one focused check and one complete product retry; the already-passing machinery results remain available. Drift and rule beating prohibit calling the failed run green. Success to the successful does not excuse the existing watcher; seeking the wrong goal retains the original acceptance criteria. Naive Interventionism avoids an unsupported timeout change. NoOp would leave criterion 5 unmet and the watcher observation only in a transcript.

## WO-115-D018 — Final review fails the integrated product gate

```json
{
  "id": "WO-115-D018",
  "date": "2026-09-26",
  "dispatch": "resume: final review",
  "reopens": {
    "decisionId": "WO-115-D017",
    "observation": "The fresh complete product retry also exits 1 at identical code identity: 27 of 28 suites pass, 72 fresh tasks, 418999 ms, 2026-09-26T04:14:11.764Z. Console and integration pass, but the WO-143 resident acquisition/restart matrix reaches its unchanged 240000 ms test deadline."
  },
  "decision": "Fail FINAL-001 on original criterion 5. Preserve both failed integrated gate rows, the passing WO-115 cases, the integrated tree, recovery checkpoint/stash and all earlier reports. Route the bounded gate-reliability diagnosis through repair and fresh independent verification; do not publish or change implementation in final review. The prior queue-loss and mixed-revision fixture findings stay resolved.",
  "evidence": [
    "Expanded npm test -- --review: 35 of 36 suites pass, 80 fresh tasks, 664821 ms; only console watcher test fails; skeleton and worktree-integration pass",
    "Fresh npm test retry: 27 of 28 suites pass, 72 fresh tasks, 418999 ms, code identity 356a17786393d4a5e8bdfd3bc68a637b8553e10c244eb0f527c3b3e1f323f72d; console passes in 25146 ms and worktree-integration in 248761 ms",
    "docs/control/local/harness/check-output/e893ad876f411b4bc88466be3d1559c978cae5912c42acbd2436c0ef794b80d8.log: test 224 WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers fails with testTimeoutFailure, test timed out after 240000ms, duration 241525.447167 ms",
    "packages/skeleton/test/resident.test.ts:775-860 declares the 240000 ms matrix deadline and exercises once/loop, lifetime/append, fresh/reclaim SIGKILL boundaries. It is unchanged, but its resident host/store dependencies are touched by WO-115; a runtime impact is not ruled out",
    "The retry log completes six matrix categories before timeout; subsequent thirty-round recovery test passes. Neither observation proves a timing root cause",
    "No source, timeout, criterion or prior report changed between the two gate runs; there is no waiver"
  ],
  "rejected": [
    {
      "option": "Pass using the older VER-003 gate or combine passing suites across failed runs into a synthetic green gate",
      "reason": "VER-003 judges its old base, and criterion 5 requires an actual complete passing npm test on the integrated subject."
    },
    {
      "option": "Run repeated full retries until one happens to pass",
      "reason": "Two complete runs produced different deadline failures; another unchanged retry would not explain the reliability evidence."
    },
    {
      "option": "Increase deadlines or repair runtime behavior during final review",
      "reason": "Cause is unestablished; product 07 assigns behavioral repair and fresh independent verification to their own dispatches."
    }
  ],
  "followup": "WO-115 final-review F1 repair: diagnose the recorded WO-114 atomic-replacement watcher timeout and WO-143 acquisition/restart matrix deadline on the integrated subject, separate actual notification/recovery behavior from test instrumentation or resource effects, make only evidence-backed bounded repairs without weakening assertions or acceptance, then obtain a fresh complete passing product gate and independent verification. Preserve the first passing machinery results and both failed full rows.",
  "reopenWhen": "A bounded repair with current complete passing product evidence is independently verified, or the operator separately authorizes a canonical waiver; no waiver is inferred."
}
```

Goal judgment: Gate U needs a dependable command boundary and trustworthy release evidence. Policy resistance and shifting the burden reject repeated undocumented retries. Commons and escalation stop after two complete runs and one focused diagnostic. Drift and rule beating keep criterion 5 intact; success to the successful cannot privilege the earlier passing base; seeking the wrong goal rejects publication as a substitute for a passing integrated product gate. Naive Interventionism preserves the implementation and evidence while directing diagnosis to the failed obligations. NoOp would leave an unsupported passing review or a failure with no repair target.

## WO-115-D019 — One shared repair for the integrated gate failures

```json
{
  "id": "WO-115-D019",
  "date": "2026-09-26",
  "dispatch": "resume: fix; operator scope expand",
  "decision": "The operator expanded this repair to cover the status watcher failure seen in parallel work orders as well as the resident matrix deadline. Make the shared watcher change once in WO-115, keep the test-only console setup reduction whose focused matrix preserved all 344 boundaries, and address the suite overlap separately. Preserve original criterion 5 and require one fresh complete passing npm test on the integrated subject. Sibling worktrees receive the reviewed source through their ordinary main integration after independent verification and final review; do not duplicate the patch in each worktree.",
  "evidence": [
    "Operator scope expansion in this resume: fix session requested a single shared correction for failures occurring in parallel work orders, specifically the WO-114 atomic-replacement status watch timeout",
    "docs/evidence/WO-115/repair-diagnostics.md: WO-115 and WO-085 each record the same 2,000 ms watcher timeout; main, WO-085, WO-115 and WO-165 have identical watcher source and test bytes",
    "docs/control/local/harness/checks.json: both failed WO-115 full gates ran skeleton and console alongside worktree integration and other suites; WO-085's failed console row had the same overlap",
    "The WO-143 matrix passed all eight 38-or-48-boundary categories in 180,247 ms on unchanged source and 174,288 ms with the test-only loopback stub; neither focused pass discharges the complete product gate",
    "Node.js fs.watch documentation lists notification caveats: https://nodejs.org/download/release/v26.5.1/docs/api/fs.html#caveats"
  ],
  "rejected": [
    {"option": "Copy a watcher patch into each active worktree", "reason": "The same source is shared; duplicate edits would diverge and undermine one reviewed fix."},
    {"option": "Treat the six-second fixture improvement as a complete repair", "reason": "One focused timing difference does not explain the 240-second gate timeout or the independent watcher failures."},
    {"option": "Increase existing deadlines or combine passing suites from failed gates", "reason": "That would weaken the original complete-gate acceptance evidence."},
    {"option": "Do nothing", "reason": "The selected integrated subject has two failed complete gates and the same watcher failure recurred in WO-085."}
  ],
  "reopenWhen": "A fresh complete gate fails, an independent verifier finds changed command behavior, or a sibling integration shows a distinct source-level failure rather than this shared watcher case."
}
```

Same-day correction: I initially read the six-second focused reduction as too
small to retain and removed the test-only stub. The measurement meant only that
the stub could not by itself explain the full gate's roughly 60-second excess;
it did not show the stub had no value. The operator challenged that inference.
I restored the stub, retained its all-boundary passing result, and separated
the larger scheduler and watcher diagnoses. These timing observations do not
identify a measured CPU or filesystem-notification root cause.

Goal alignment: Gate U needs the same command boundary to survive ordinary
integration checks without repeated operator rescue. Policy resistance and
shifting the burden favor one reviewed upstream change. Commons and escalation
favor one shared gate correction over per-worktree copies; the scheduler cost
must still be measured. Drift and rule beating keep all assertions and the
complete-gate criterion, and seeking the wrong goal rejects a green subset as
a release result. Success to the successful does not exempt the existing
watcher from evidence because it predates WO-115. Naive Interventionism limits
the fixture change to a test child, tests the watch fallback under suppressed
notifications, and leaves the terminal command authority path intact. NoOp
would preserve two failed full gates and a recurring cross-order watch failure.

## WO-115-D020 — Complete the bounded repair with a fresh integrated gate

```json
{
  "id": "WO-115-D020",
  "date": "2026-09-26",
  "dispatch": "resume: fix; operator scope expand",
  "decision": "Keep all three bounded changes: the test-only console setup reduction, the shared status watch fallback, and exclusive skeleton scheduling. The original deadlines and assertions remain. Record the fresh complete passing product gate on the integrated source, then hand the subject to independent verification; keep the combined FUP-db0a2c8b8a05d4ae open until that judgment. Do not claim that the historical timing cause or a whole-gate speedup was proven.",
  "evidence": [
    "docs/evidence/WO-115/repair-diagnostics.md: focused WO-143 matrix passes all 344 boundaries before and after the test-only stub, in 180247 and 174288 ms; the six-second observation is retained, not presented as causal proof",
    "node --test packages/console/dist/test/runtime-status.test.js: 7 passed, 0 failed; the silent-notification atomic replacement was observed in 251.701 ms",
    "node --test scripts/test-runner.test.mjs: 41 passed, 0 failed; the scheduler fixture asserts skeleton runs with four reserved slots and no active peer",
    "npm test: 28 suites passed, 0 failed, 72 fresh tasks, 444801 ms, exit 0 at 2026-09-26T04:46:43.785Z, code identity 5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd; skeleton ran alone for 295465 ms and console passed in 20582 ms",
    "docs/work-orders/WO-115-console-parity-contract.md criterion 5 still requires a complete green npm test, clean diff and no new dependency; the prior failed gate rows remain in canonical checks"
  ],
  "rejected": [
    {"option": "Remove the test-only six-second reduction", "reason": "Its complete focused matrix passed; one timing sample limits the claim, not the value of retaining a bounded improvement."},
    {"option": "Claim the isolated skeleton run made the whole gate faster", "reason": "The repaired 444801 ms gate was 25802 ms longer than the preceding failed 418999 ms retry; reliability and total elapsed time are distinct outcomes."},
    {"option": "Close the combined follow-up before independent verification", "reason": "FUP-db0a2c8b8a05d4ae explicitly requires independent verification of the repair."}
  ],
  "reopenWhen": "Independent verification rejects the repair, a repeated integrated gate fails, the watcher misses an atomic replacement despite the fallback, or a sibling integration shows a distinct defect."
}
```

Goal judgment: the complete gate now passes on the repaired source while the
original command parity and acceptance remain intact. Policy resistance and
shifting the burden favor a single shared watcher change in this order, and
commons and escalation are limited to one passing complete gate after focused
diagnosis. Drift, rule beating and seeking the wrong goal are checked by the
unchanged deadlines and all-suite result; success to the successful did not
exempt the older watcher. Naive Interventionism limited the crash-child stub
to a test fixture and exercised the fallback under silent notifications. NoOp
would have left criterion 5 failed. The cost is about 26 seconds more total
gate time than the failed retry; the original timeout cause remains unknown.

## WO-115-D021 — Reverification finds an unmeasured gate scheduling change and a poll that outlives close

```json
{
  "id": "WO-115-D021",
  "date": "2026-09-26",
  "dispatch": "resume: verify",
  "reopens": {
    "decisionId": "WO-115-D020",
    "observation": "VER-004 reproduces the passing gate at code identity 5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd, but the exclusive skeleton declaration has no same-source before/after row and product 07 still names only harness and process-debt fixtures as exclusive. After a watcher error, the new 250 ms status poll is not cleared by close()."
  },
  "decision": "Fail VER-004 on F1: the repair's gate scheduling change lacks the same-source before/after comparison that product 07 and WO-132 criterion 4 require of any later scheduling change, and it leaves product 07's scheduling paragraph stale. Record F2 (low): the status poll survives close() after an FSWatcher error and keeps delivering callbacks. Criteria 1-5 are met on current evidence. The console contract, queue repair, integration fixture, crash-child stub and silent-notification fallback are not reopened.",
  "evidence": [
    "npm test: 28 suites passed, 0 failed, 72 fresh tasks, 437100 ms, exit 0 at 2026-09-26T13:35:49.075Z, code identity 5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd; skeleton ran isolated on four lanes for 292150 ms with no peer at start; console passed in 20084 ms beside worktree, worktree-integration and work-orders-fixtures",
    "docs/control/local/harness/checks.json: npm test rows at 356a17786393d4a5e8bdfd3bc68a637b8553e10c244eb0f527c3b3e1f323f72d (exit 1, shared skeleton) and 5444501048f6ea4a2dc1df1c4dff94df8022b5bb9cbd7ff89febbf47236227dd (exit 0 twice, exclusive skeleton) have different sources; no row compares shared and exclusive skeleton on one source",
    "docs/product/07-execution-guide.md:2499-2503 names harness and process-debt fixtures as exclusive and requires a same-source comparison for future scheduling changes; docs/work-orders/WO-132-machinery-stand-down.md:236-240 requires a same-source before/after row for any later scheduling change; no product document changed between checkpoints 16 and 18",
    "scripts/test-runner.mjs:487-489 declares skeleton exclusive; exclusive rows take priority 200 instead of skeleton's 80 (test-runner.mjs:1075-1079) and run isolated with load factor 2 instead of up to 8 for load-derived deadlines (test-runner.mjs:885-893, packages/skeleton/src/gate-deadlines.mjs:9-23); scripts/test-runner.test.mjs:540 now asserts that skeleton and console never overlap",
    "D019 states that the scheduler cost must still be measured; D020 compares the 444801 ms pass with a failed 418999 ms retry on different source",
    "packages/console/src/runtime-status.ts:111-113 clears the poll only on the watcher's close event; Node v26.9.0 FSWatcher closes its handle on an error status without emitting close, and close() returns early once the handle is null (printed from the runtime's own FSWatcher source)",
    "Scratch probe on the built module driving the real FSWatcher error path: 0 close events after close() and a changed callback delivered after close(); an independent read-only refuter reproduced 3 callbacks after close() and 0 on the pre-repair source; statusCli never calls close() and exits after an error in both versions",
    "node --test packages/console/dist/test/runtime-status.test.js: 7 passed, 0 failed, including the silent-notification case in 252.239 ms"
  ],
  "rejected": [
    {"option": "Pass and leave the scheduling comparison to a later order", "reason": "The rule exists to stop an unmeasured scheduling change reaching main; passing would land it on every order's gate before the required evidence exists."},
    {"option": "Mark criterion 5 unmet", "reason": "The complete gate is green, the diff check is clean and no dependency was added; F1 is a defect in the subject's compliance with a standing product rule, not a failed gate."},
    {"option": "Run the same-source comparison or edit product 07 during verification", "reason": "The verifier preserves the subject; choosing and documenting the scheduling configuration belongs to repair."},
    {"option": "Reopen the crash-child stub or the silent-notification fallback", "reason": "The stub leaves the traced acquisition window unchanged and stale descriptors keep a console-suite test; the fallback passes its regression and the documented watch behavior."}
  ],
  "followup": "WO-115 VER-004 repair: (F1) record a same-source before/after npm test comparison of skeleton shared versus exclusive scheduling on otherwise identical source, keep the configuration the evidence supports, and update product 07's gate-scheduling paragraph with the suite, its measured rows, and the priority and load-factor side effects; (F2) clear the status poll when the watcher errors or closes so no callback follows close(), with a regression on the FSWatcher error path. Preserve the passing console contract, the fixture stub, the watch fallback, unchanged deadlines and all earlier reports.",
  "reopenWhen": "A repair supplies the same-source rows and the product 07 write-back and stops the post-close poll, and an independent verification passes; or the operator records a canonical waiver or explicit scope decision."
}
```

Goal alignment: Gate U needs the command boundary to land with trustworthy,
shared gate evidence. The tragedy of the commons applies directly because the
scheduling change affects every order's gate. Drift to low performance applies
because a slower isolated skeleton could become the baseline without the
measurement the rule demands. Policy resistance and escalation are bounded by
one fresh gate, one focused suite, two scratch probes and one batched
read-only refuter, and by a repair target limited to two named defects. Rule
beating is checked because the green gate was not treated as a substitute for
the scheduling evidence. Success to the successful does not excuse the
exclusive flag because it produced one pass. Seeking the wrong goal and
shifting the burden weigh against another unmeasured cycle, so the follow-up
names the exact rows and write-back. Naive Interventionism keeps the working
watch fallback and fixture stub and asks only for evidence and a small
lifetime fix. NoOp would merge an unmeasured scheduling change and a callback
leak into main, where siblings inherit both.

## WO-115-D022 — Repair VER-004 with a controlled scheduling comparison and watcher cleanup

```json
{
  "id": "WO-115-D022",
  "date": "2026-09-26",
  "dispatch": "resume: fix",
  "decision": "Repair the watcher error lifetime first, then run complete shared and exclusive skeleton product gates with otherwise identical sources. Preserve the comparison inputs and canonical result rows, select the measured configuration, and update product 07 with its priority and deadline-load effects. Retain D002 as this order's only economy experiment; this comparison discharges VER-004 F1 rather than starting another economy experiment.",
  "evidence": [
    "docs/verifications/WO-115/VER-004.md F1 requires same-source scheduling rows and the product 07 write-back; F2 reproduces polling after an FSWatcher error and close",
    "packages/console/src/runtime-status.ts clears its 250 ms interval only on close; its existing silent-notification regression exercises fallback but not error cleanup",
    "scripts/test-runner.mjs gives exclusive skeleton priority 200, four reserved lanes and load factor 2; shared skeleton uses priority 80, one lane and load factor 8 on this four-lane gate",
    "docs/evidence/WO-115/decisions.md D002 already records the order's economy experiment"
  ],
  "rejected": [
    {"option": "Keep the previous different-source timing comparison", "reason": "It confounds the watcher, fixture and scheduler changes and does not discharge the standing comparison rule."},
    {"option": "Increase deadlines or remove assertions", "reason": "Both would weaken the behavior that the gate must establish."},
    {"option": "Remove the polling fallback", "reason": "Its missing-notification regression passes and VER-004 explicitly retains that behavior."},
    {"option": "Do nothing", "reason": "It preserves both the unmeasured scheduling policy and callbacks after the watcher lifetime ends."}
  ],
  "reopenWhen": "The controlled gates or watcher regression fail, independent verification identifies a remaining defect, or repeated same-source evidence reverses the scheduling tradeoff."
}
```

Goal and critical path: repair the shared checks and watcher needed to land Gate
U's command boundary. Policy resistance and shifting the burden favor a single
upstream correction; commons and drift require measured gate cost. Escalation
is bounded to two comparison gates and focused regressions. Success to the
successful gives shared scheduling a fresh comparison; rule beating and
seeking the wrong goal retain the complete gate and every deadline and
assertion. Naive Interventionism keeps the working notification fallback,
tests cleanup, and changes only the scheduling declaration between comparison
runs. NoOp leaves both filed findings unresolved. The comparison's two
sequential gates are a required repair cost, not a claimed economy saving.

## WO-115-D023 — Restore measured shared scheduling and end the poll on watcher errors

```json
{
  "id": "WO-115-D023",
  "date": "2026-09-26",
  "dispatch": "resume: fix",
  "reopens": {
    "decisionId": "WO-115-D020",
    "observation": "The controlled comparison required by VER-004 passed both variants, but shared scheduling completed in 312441 ms versus 430952 ms exclusive. Isolation was not necessary for this repaired source to pass."
  },
  "decision": "Restore shared skeleton scheduling and retain the watcher fallback and crash-child stub. Require the scheduler fixture to observe shared overlap, priority 80, one reserved lane and load factor 8. Clear the status poll immediately on watcher error as well as on close. Product 07 records the measured tradeoff. Run a final complete product gate after the scheduler fixture adjustment; independent verification still owns closure of FUP-e495acc8ebaebf05 and FUP-db0a2c8b8a05d4ae.",
  "evidence": [
    "docs/evidence/WO-115/scheduling-comparison.json: two complete npm test rows, 28 suites and 72 fresh tasks each, both exit 0; shared recorded at 2026-09-26T13:58:11.009Z and exclusive at 2026-09-26T14:05:46.756Z",
    "Snapshots of 3473 repository paths differ only at scripts/test-runner.mjs; changing skeleton exclusive false to true accounts for that difference, and no snapshotted repository input changed during either gate",
    "Shared skeleton took 309511 ms and exclusive skeleton 286508 ms, but exclusive increased total gate duration by 118511 ms; both console suites and resident acquisition matrices passed with unchanged deadlines",
    "The new status error regression failed before the fix with an extra observedAt 50 callback after close, then all eight runtime-status tests passed in 1511.963 ms; its watcher double intentionally emits no close event on error",
    "Node v26.9.0 internal/fs/watchers source observed in this session closes and nulls the handle before emitting error, deliberately omitting close; subsequent close returns early. The official FSWatcher documentation says an errored watcher is no longer usable: https://nodejs.org/api/fs.html#event-error",
    "node --test scripts/test-runner.test.mjs: 41 passed, 0 failed, 14123.792 ms on the final shared-scheduling assertions"
  ],
  "rejected": [
    {"option": "Retain exclusive skeleton scheduling", "reason": "It costs 118.511 seconds in this controlled pair, while shared passes with the same repaired watcher, crash-child fixture and assertions."},
    {"option": "Infer universal reliability or the cause of earlier failures from one pair", "reason": "The host's ambient work is uncontrolled and only one ordered pair was measured."},
    {"option": "Clear the poll only on close", "reason": "The reproduced native error path emits no close event and the existing regression then fails."}
  ],
  "reopenWhen": "A fresh complete shared gate repeats the resident deadline or watcher failure, a supported Node runtime violates the cleanup regression, or repeated same-source measurements favor another scheduler configuration."
}
```

Goal judgment: the shared configuration preserves Gate U's passing command
boundary and avoids the measured serial delay. Commons and drift favor the
faster complete outcome; success to the successful did not privilege the
previously retained isolated setting. Policy resistance and shifting the burden
favor one upstream repair with a durable comparison. Escalation is bounded to
the required pair and one final gate after the scheduler test changes; rule
beating and seeking the wrong goal keep all assertions and original deadlines.
Naive Interventionism keeps the notification fallback and fixture reduction,
and removes an isolation declaration the comparison does not support. NoOp
would retain its measured cost and the reproduced callback leak. The historical
timeout cause and three-consecutive-run WO-132 target remain unproven.

Same-day transcription correction: the draft product paragraph briefly stated
286.512 seconds for isolated skeleton; the canonical task row says 286508 ms.
The paragraph was corrected to 286.508 seconds before handoff.

Handoff outcome: the final shared-scheduling source passed all 28 product
suites and 72 fresh tasks in 311.970 seconds at 2026-09-26T14:14:46.764Z
(code identity `bce54ec869793926a7d7db37d759d0e838daebe965ad1729a85982ea7b5b7949`).
No snapshotted repository input changed during the gate. The three complete runs total
1,055.363 seconds. This supplies the promised complete result and measured
cost; the cause of historical timeouts remains unestablished. Re-verification
retains its separate judgment and follow-up closure.

## WO-115-D024 — Reverification passes the measured shared scheduling and watcher error cleanup

```json
{
  "id": "WO-115-D024",
  "date": "2026-09-26",
  "dispatch": "resume: verify",
  "decision": "Pass VER-005. VER-004 F1 is resolved: the controlled pair's two code identities reproduce from current sources with only skeleton's isolation declaration changed, the retained configuration is main's shared scheduler, and product 07 records the measured rows and the priority, lane and load-factor effects. VER-004 F2 is resolved: on Node's native FSWatcher error path, close() is followed by no callback. A fresh complete shared product gate passed at the handoff code identity. Criteria 1-5 are met. The verifier changes no implementation, product document or earlier report. Register disposition of FUP-db0a2c8b8a05d4ae, FUP-e495acc8ebaebf05 and FUP-2ed6d5d710c207da is left to final review, which settled this order's earlier rows through the canonical API.",
  "evidence": [
    "npm test: 28 suites passed, 0 failed, 72 fresh tasks, 312934 ms, exit 0, recorded 2026-09-26T14:58:39.491Z, code identity bce54ec869793926a7d7db37d759d0e838daebe965ad1729a85982ea7b5b7949 (the executor's final-gate identity); skeleton shared on one lane at load factor 8 for 310035 ms, including the WO-143 acquisition matrix (ok 224); console 21968 ms beside skeleton, worktree-integration and work-orders-fixtures",
    "In-memory recomputation of gateCodeIdentity over 529 selected paths: current sources give bce54ec8...; current sources with checkpoint 20's scheduler test and its runner with exclusive false give bcf5d037... (the shared comparison row); the same with exclusive true gives 9eba426a... (the exclusive row). The shared runner bytes hash to the comparison's a8dee07a... and checkpoint 20's runner to 2dd260ce...",
    "docs/control/local/harness/checks.json holds both comparison rows with exit 0 and durations 312441 and 430952 ms; test-runner.mjs records exit 0 only when code identity is unchanged at the gate's end",
    "git diff HEAD -- scripts/test-runner.mjs is empty; scripts/test-runner.test.mjs only adds assertions (skeleton not exclusive, priority 80, one reserved lane, load factor 8, exclusive suites start with no active peer); node --test scripts/test-runner.test.mjs passed 41 of 41",
    "Scratch probe driving FSWatcher _handle.onchange(-5) on the built module: handle null, 0 close events, then 0 changed and 0 unavailable callbacks after close() and an atomic replace and unlink; the same probe on a pre-fix control copy without the error-path clearInterval delivered 1 changed and 1 unavailable callback after close()",
    "node --test packages/console/dist/test/runtime-status.test.js: 8 of 8 passed, including the new error-path regression and the silent-notification recovery",
    "docs/product/07-execution-guide.md:2499-2513 figures match the comparison JSON, and the lane, priority and load-factor statements match scripts/test-runner.mjs:882-891 and 1068-1076; npm run publication:check passes",
    "No suppression directive was added; manifests and lockfile differ from HEAD only by the WO-115 internal version bumps; git diff --check and git diff --cached --check are clean"
  ],
  "rejected": [
    {"option": "Fail again for want of repeated same-source samples", "reason": "Product 07 asks for a same-source comparison, which the reproduced pair supplies; the text states its single-pair limits and claims neither causation nor universal reliability."},
    {"option": "Treat the executor's 3,473-path snapshot as independently reproduced", "reason": "Only the 529 code-identity paths were recomputed; the full snapshot maps stay in the executor's ignored scratch."},
    {"option": "Settle the follow-up register rows in verification", "reason": "Final review settled this order's earlier rows through the canonical API and still integrates and judges the whole subject."},
    {"option": "Do nothing", "reason": "The allocated verification must judge the repaired subject before final review can run."}
  ],
  "reopenWhen": "A complete shared gate on this code identity repeats the resident-matrix or watcher deadline, final review finds a defect in the repaired or integrated subject, or repeated same-source measurements favor another skeleton scheduling configuration."
}
```

Goal alignment: Gate U needs the console command boundary to land with shared
gate evidence that every order can trust. Commons and drift to low
performance favor the retained shared configuration: it is main's existing
scheduler and measured 118.5 seconds faster in the pair. Success to the
successful does not favor it by default, because the exclusive alternative
received its own complete run. Rule beating is checked independently: the
comparison identities were recomputed, and the error-path probe runs Node's
native handle rather than the test double. Policy resistance and shifting the
burden favor one upstream watcher fix over per-worktree patches. Escalation is
bounded to one fresh gate, two focused suites and two scratch probes, with no
subagent. Seeking the wrong goal is checked by judging the original five
criteria, not the repair receipts. Naive Interventionism keeps the fallback,
the fixture stub, the deadlines and the assertions. NoOp would leave a repaired
and verified subject waiting without judgment. The historical timeout cause
and WO-132's three-run target remain unestablished.

Same-day correction to the filed VER-005 prose, which stays unedited:
- **Scratch scripts.** Its handoff says both scratch scripts ran "on the
  current build and on a pre-fix control". Only the error-path probe had a
  pre-fix control. The identity script recomputed the current identity and
  the two comparison variants, as its F1 section and this decision's evidence
  state.
- **O3.** In O3, "it ran at a different identity" refers to the first shared
  run (`bcf5d037…`), not to the exclusive run. The two later shared runs share
  `bce54ec8…`.

Neither correction changes a finding, criterion or verdict.

## WO-115-D025 — Final review passes the integrated subject and settles the repair rows

```json
{
  "id": "WO-115-D025",
  "date": "2026-09-26",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-002 on the integrated WO-115 subject at code identity bce54ec869793926a7d7db37d759d0e838daebe965ad1729a85982ea7b5b7949: the five original criteria are met on this review's own gate, checks and real-binary probe, and VER-001 F1, VER-002 G1, FINAL-001 F1 and VER-004 F1 and F2 stay resolved. Settle FUP-db0a2c8b8a05d4ae, FUP-2ed6d5d710c207da and FUP-e495acc8ebaebf05 through the canonical follow-up API, each with its evidence and a reopening condition. Move D022 to its chronological place in this file and add one sentence on the status watcher's read fallback to the console README; neither changes a decision, a behavior or a criterion. Commit the reviewed state, push wo-115 and open its pull request; merge nothing and publish no release, tag or package.",
  "evidence": [
    "docs/final-reviews/WO-115/FINAL-002.md: criteria 1-5 met; npm test -- --review passed at identity bce54ec8...; every deterministic check passed; the console, runtime-status and scheduler suites passed directly",
    "Real-binary probe in session scratch: dotln resident bound to the Contributor mission with a script actor served 23 commands to the text host, matched skeleton.compiled-diff, resume.times and resume.status byte for byte against adjacent direct runs, refused worktree.start BAD with the terminal's bytes and portfolio.declare as unknown, exited 0 on SIGHUP, removed its descriptor and replayed five results with none incomplete",
    "docs/verifications/WO-115/VER-005.md: pass; O4 names the three rows whose repair and reopening conditions its evidence meets and leaves their disposition to final review",
    "git fetch origin: origin/main, main and HEAD are f73b7e18; FINAL-001's integration (D016) stands and no upstream change followed it; npm run release -- prepare reports v0.52.0 current",
    "docs/planning/refutations/2026-09-25-planning-c93346fb3a92bb7f-030.md: WO-115 aligned-with-findings; its criterion 3 known issue (replay must reconstruct, not re-execute) is met because replayConsoleResults reads receipts and content-addressed bytes and spawns nothing"
  ],
  "rejected": [
    {"option": "Fail for the unexecuted lifecycle success paths (D009)", "reason": "Executing lifecycle successes would write real transitions into this repository; parity for those commands rests on the identical entrypoint, argv, cwd and environment, the refusal pairs, and the reads and presence effects that are executed, which five verifications and this review judged sufficient."},
    {"option": "Leave the three register rows open for the planner", "reason": "Their repair and reopening conditions are met by independent verification and this review; leaving them open would make the register misstate the order's state, and FINAL-001 settled this order's earlier rows the same way."},
    {"option": "Rewrap product 07's orphan line", "reason": "No rendered change; it would touch a locked publication section for cosmetics."},
    {"option": "Do nothing", "reason": "It leaves a five-times-verified subject in a branch and keeps the shared watcher fix out of the sibling worktrees that met the same failure."}
  ],
  "reopenWhen": "A complete gate on this code identity repeats the WO-143 acquisition-matrix or WO-114 watcher deadline failure, a served terminal command diverges from its direct run in bytes or effects, or a client can reach a command the terminal hooks would refuse."
}
```

Goal alignment: Gate U's command boundary lands with shared gate evidence every order can trust. Rule beating was checked by reading the whole source and by driving the real resident binary, not only the in-process fixtures; seeking the wrong goal by judging bytes, receipts and the reused classifier and decider rather than suite names. Policy resistance and shifting the burden favor landing the shared watcher fix and the fixture base once, upstream. Commons and escalation are bounded to one review gate, three focused suites, one probe and no agents. Drift and success to the successful are answered by the measured shared scheduler and by D002's reopenable experiment. Naive Interventionism leaves the resident fold, the terminal parsers and the compiled envelope untouched. NoOp would withhold a subject that three harnesses and five models agree on.

Same-day correction: after the review gate at code identity `bce54ec8…`
and before the result transition, this review added the one-sentence README
note on the watcher's read fallback. Package READMEs are inside the code
identity set (`gateCodeIdentity` excludes only `docs/`, `.claude/`, `.agents/`,
root Markdown and generated paths), so the identity moved to `dbb52211…`
and the transition recorded the advisory that no passing gate existed at it.
The filed FINAL-002 cites the first row and stays unedited. A second
`npm test -- --review` at `dbb52211…` passed (37 suites, 0 failed,
524.35 s, 81 fresh tasks, exit 0, recorded 2026-09-26T15:38:31.791Z, tree
`9d829d53…`) and binds the published bytes; the PR body and the release
notes cite both rows. What was misread: a README sentence as a report-class
change. What was meant: every edit under `packages/` needs a gate before the
result transition. What changed: the second gate row and this note.
