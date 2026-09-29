# WO-117 decisions

## WO-117-D001

```json
{
  "id": "WO-117-D001",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Compose a passive local status/audit view and send explicit live commands through the existing loopback client; harden the one bound index source without creating a new order truth.",
  "evidence": [
    "packages/console/src/runtime-status.ts already renders actors, episodes, presence and work orders and polls every 250 ms.",
    "packages/skeleton/src/audit.ts exports the same render used by dotln audit; console receipts themselves change the event log.",
    "WO-114-D013 and FUP-4656197433cb8b3d identify unguarded launchpad resolution and blocking special-file reads.",
    "Product 04 measures 59,711 bytes at this base against a 60,856-byte ceiling: 1,145 bytes headroom; this order adds at most 400 bytes."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "One console supplies gate U supervision and enables WO-118 while keeping resident authority and evidence intact.",
    "traps": {
      "policyResistance": "Use the same status and audit projections and command client, no competing lifecycle fold.",
      "tragedyOfTheCommons": "Passive refresh writes no receipts; two read-only agents share the bounded review, with no descendants.",
      "driftToLowPerformance": "Bad index sources must visibly degrade while the resident continues; test exact causes and recovery.",
      "escalation": "No new dependency, command ID, service or gate.",
      "successToTheSuccessful": "Compared direct rendering with automatic audit commands; reuse wins on observable event behavior, not prior investment alone.",
      "shiftingTheBurden": "Coded source failures replace generic startup failure and hanging reads.",
      "ruleBeating": "Fixture evidence is separate from the operator-witnessed run, which remains unmet until observed.",
      "seekingTheWrongGoal": "Judge combined live supervision and byte parity, not receipt volume."
    },
    "naiveInterventionism": "Preserve terminal results and existing versioned views; add only an optional allowlisted unavailable reason, nonblocking regular-file reads, and lifetime-owned temporary cleanup. Reversible local edits; existing clients and helper writers are affected consumers.",
    "noOp": "Leaves supervision split across commands and known startup hangs; the explicit order and regressions justify the bounded change."
  },
  "rejected": [
    {
      "option": "Automatically invoke dotln.audit for each event change",
      "reason": "Audit invocation creates events itself and can trigger a feedback loop and unbounded receipts."
    },
    {
      "option": "Build a new web host or shell parser",
      "reason": "Outside this order and unnecessary for literal command arguments."
    },
    {
      "option": "Keep a previously valid index binding when launchpad resolution fails",
      "reason": "Would display another launchpad's stale source as current."
    }
  ],
  "reopenWhen": "Measured live rendering cost or a missing terminal command requires a separately scoped host or contract change."
}
```

## WO-117-D002

```json
{
  "id": "WO-117-D002",
  "kind": "experiment",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Keep the existing 250 ms refresh method; decline a separate performance trial.",
  "question": "Would replacing the existing 250 ms watcher with a new event-driven refresh materially improve this combined host?",
  "alternatives": [
    "Reuse bounded polling and changed-frame deduplication",
    "Design and benchmark a different event-driven refresh"
  ],
  "observation": "The existing watcher has recovery and missed-notification tests; no bottleneck has been observed in the selected combined view.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "No observed refresh bottleneck justifies a separate performance trial; the functional fixtures remain required.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["None: experiment declined before execution"],
    "source": "No experiment executed; preparation is part of ordinary source reading, not a measured trial."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["None: experiment declined before execution"],
    "summary": "No measured savings or improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "packages/console/test/runtime-status.test.ts covers missed notifications and recovery"
  ],
  "rejected": [
    {
      "option": "Run a standalone refresh benchmark now",
      "reason": "No observed performance defect; required functional fixtures decide correctness."
    }
  ],
  "reopenWhen": "The combined view visibly stalls or consumes excessive resources in a measured resident session."
}
```

## WO-117-D003

```json
{
  "id": "WO-117-D003",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Bound the passive audit preview to eight L0 receipts and eight L1 causal entries; :audit serves the full WO-116 render. Add optional coded unavailable reasons and register their runtime contract in evidence inputs. Prepare application v0.56.0 with console 0.4.0 and skeleton 0.45.1.",
  "evidence": [
    "Read-only review measured the existing WO-009 fixture's full audit at about 2,224 lines; repeating it on each tick would obscure live status and typed input.",
    "The preview uses projectAuditEvents without adding a domain fold; exact full audit and other command bytes still flow through invokeConsoleCommand.",
    "20 focused tests passed, including byte parity, passive refresh, FIFO startup, stale binding replacement, temporary cleanup, schema agreement and signal abort.",
    "Product 04 grew by 224 bytes to 59,935, below its 60,856-byte ceiling and the order's 400-byte addition bound.",
    "ResidentStore's new runtime import of the coded reason vocabulary requires runtime-status-contract.ts in the common evidence inventory; this is the same deterministic remint obligation as resident-store.ts."
  ],
  "rejected": [
    {
      "option": "Refresh the complete raw audit every tick",
      "reason": "The measured fixture is thousands of lines; a labeled bounded preview preserves useful supervision and explicit access to full bytes."
    },
    {
      "option": "Let the live host implement command effects",
      "reason": "Existing client parity retains resident admission and terminal parser authority."
    },
    {
      "option": "Require the operator to assemble resident configuration",
      "reason": "The executable walkthrough helper can prepare a real bounded read-only actor and print concrete commands within the order."
    }
  ],
  "reopenWhen": "The operator's witnessed session demonstrates insufficient audit context or refresh usability; no fixture pass substitutes for that observation."
}
```

## WO-117-D004

```json
{
  "id": "WO-117-D004",
  "date": "2026-09-29",
  "dispatch": "resume: next; operator corrections during walkthrough",
  "decision": "Replace scrolling snapshots in an interactive terminal with a bounded alternate screen, one-second refresh, suppressed idle clock changes, explicit change summaries and plain away/back/diff/audit controls. Pause refresh during input and leave long command results in ordinary scrollback until Enter resumes the view. Correct walkthrough directions to name each terminal, prompt and action.",
  "reopens": {
    "decisionId": "WO-117-D003",
    "observation": "The operator reported an unusable flood of updates, unexplained commands and input separated from status by pages. The earlier compact audit did not make repeated append rendering usable."
  },
  "evidence": [
    "The previous live watch appended the entire frame every 250 ms; resident tick timestamps caused changes even when no useful status changed.",
    "The operator closed both processes after reporting the defect. The correction stays within the live host and walkthrough scope.",
    "Read-only review found embedded line controls in audit fields, wrapped readline restoration and the incorrect instruction that L0/L1 would show ScriptEpisodeObserved. Fields are now escaped before joining structural lines, redraw defers during input, and a labeled raw-event tail shows actual script results.",
    "The first full review gate was intentionally stopped after 170.4 seconds before changing gate inputs; no passing check was recorded."
  ],
  "rejected": [
    {
      "option": "Give more JSON examples while keeping scrolling refresh",
      "reason": "The operator's observed UI failure concerns rendering and discoverability, not only instructions."
    },
    {
      "option": "Pause only the raw audit preview",
      "reason": "Clock changes in the status frame would still flood the terminal."
    }
  ],
  "reopenWhen": "A real terminal probe or the operator retry still loses the prompt, obscures results or fails to identify useful state changes."
}
```

## WO-117-D005

```json
{
  "id": "WO-117-D005",
  "date": "2026-09-29",
  "dispatch": "resume: next; operator completed the corrected walkthrough",
  "decision": "Record the operator-reported walkthrough with its retained command sequence; keep all inspection results paused until Enter, and accept only validated primitive event labels. Finish validation before implementation-ready.",
  "evidence": [
    "The operator reported 'ok i ran through the commands' after receiving the exact retry command and plain away/back/diff/audit/quit instructions. The retained final sequence has successful away/back/diff/audit receipts, one verified completed script and another script stopped on operator return. Human attribution comes from the conversation report, not the receipts alone.",
    "The corrected real-resident PTY probe passed at 24x80. A supplemental fixture probe passed short four-order inspection, CJK clipping, resize to 12x20 and back, and persistent error summary.",
    "Read-only review found short results hidden by immediate screen return, generic null or inherited payload coercion, and terminal column-width issues. Those paths are corrected with focused regression coverage; polling remains one second. D002's declined benchmark is not rerun or claimed as an improvement.",
    "The second review gate was intentionally stopped after 10.1 seconds before these gate-input edits. Neither stopped run is counted as a pass."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The user can supervise a real resident from one readable console; the correction directly restores the work order's witnessed critical path.",
    "traps": {
      "policyResistance": "Command authority and ordinary receipts remain in the shared resident client.",
      "tragedyOfTheCommons": "Reuse the same two read-only reviewers; no new agents, dependencies or services.",
      "driftToLowPerformance": "Retain the failed first attempt and require executable terminal checks, not softer success wording.",
      "escalation": "Bound the correction to live rendering, event validation, instructions and evidence.",
      "successToTheSuccessful": "Operator evidence reversed the first display choice despite its fixture pass.",
      "shiftingTheBurden": "The host now preserves the input and results instead of requiring the user to manage a scrolling flood.",
      "ruleBeating": "Separate operator report, retained command events and automated probes; do not infer detailed attention or a model run.",
      "seekingTheWrongGoal": "Readable state changes and completed walkthrough decide usefulness; polling frequency and receipt volume do not."
    },
    "naiveInterventionism": "Use the existing terminal display-width helper and client; targeted fixes cover observed failures without redesigning terminal audit or resident policy.",
    "noOp": "Would retain demonstrated unusability or hidden short results; targeted correction is necessary."
  },
  "rejected": [
    {
      "option": "Ask the operator to repeat the completed walkthrough again for review-only edge cases",
      "reason": "The reported real run and retained events discharge the witness; deterministic PTY and event regressions cover the remaining defects."
    },
    {
      "option": "Claim every dispatched actor succeeded or the log proves the operator inspected every line",
      "reason": "The second script was cancelled by operator return and the log cannot prove attention."
    }
  ],
  "reopenWhen": "A supported terminal still loses input or results, or a new payload shape escapes the validated display fields."
}
```

## WO-117-D006

```json
{
  "id": "WO-117-D006",
  "date": "2026-09-29",
  "dispatch": "resume: next handoff",
  "decision": "Keep the corrected implementation and hand it to independent verification after the required document check. Settle the reopened display follow-up; preserve unrelated planning rows.",
  "evidence": [
    "The final focused selection passed 22 tests and the current-build supplemental PTY probe passed. The full npm test -- --review gate passed 38 suites, 82 fresh tasks, zero failures in 588.897 seconds; cutoff 2026-09-29T15:57:07.980Z. Gate evidence is tied to the current code identity, not the two intentionally stopped earlier runs.",
    "D001's mission and eight-trap comparisons hold for resident authority and source hardening. D004/D005 replaced the failed UI choice based on operator evidence. The resulting outcome is a completed operator-reported walkthrough plus executable terminal evidence; no performance saving or model-worker claim is made.",
    "The first document gate failed console-docs because the new capability row used an unsupported two-column header. The existing parseCapabilities implementation names the admitted formats; the row now uses the existing three-column Capability and scope / Current assessment / Evidence and remaining gate format. No parser or code identity changed. The corrected document gate passed 23 suites, zero failures, in 13.74 seconds.",
    "FUP-d05888ed8f31fda2 (D003 reopened by D004) is settled by the corrected screen, plain controls, current tests and operator retry. FUP-4656197433cb8b3d is settled by the index-source hardening.",
    "The touching-row query was read in both pages. FUP-0045 and FUP-0086 remain planning candidates: this order has not landed and makes no authoring-journey claim. FUP-0073 concerns intent closure and the stranger test, untouched here.",
    "FUP-4f8cd7989607ad3f remains deferred: resident-host.ts only forwards the index-source error; no NoOp identity/replay behavior changed, and the feedback edition carries unchanged judged behavior. FUP-56b599e15f97e666 remains deferred: resident-state.ts and verifier hold wording are unchanged.",
    "FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb and FUP-fd05316b6030ef73 are textual matches on generated metadata or broad document names; this order changes no byte-proof writer, usage attribution or writer-policy wording. FUP-5e2f4ce16f9e8be1's repository-wide evidence cleanup remains a separate planning judgment; historical editions are preserved. These rows are left as recorded, not silently settled."
  ],
  "rejected": [
    {
      "option": "Broaden the live-console order into authoring, replay-identity, usage attribution or evidence pruning",
      "reason": "The touching query is a pointer rather than new authority; the implementation did not open those behavioral seams."
    },
    {
      "option": "Count stopped runs or the automated preparation as the required pass/witness",
      "reason": "Only the final fresh gate and separately attributed operator report support those claims."
    }
  ],
  "reopenWhen": "Independent verification finds a failing criterion, or a preserved follow-up's actual reopening condition is established."
}
```

## WO-117-D007

```json
{
  "id": "WO-117-D007",
  "date": "2026-09-29",
  "dispatch": "resume: verify",
  "decision": "Pass VER-001. Criteria 1 to 5 are met at code identity a4e5e0d8. Criterion 1 is read as follows: the live mode renders WO-116's audit view on demand through its audit control (byte parity tested), beside a bounded passive preview. On a resident store, the preview's L0 and L1 lines and the full L0 and L1 projections are empty, because WO-116 derives no records from resident event types. Criterion 2 is met by the operator-reported run on a live.ts earlier than the final one. The verifier's own PTY probe of the final build against a real resident reproduces the same sequence. Several defects fall outside the declared criteria, and several records have defects. Each is boarded, non-blocking, with its reproduction (VER-001 B1-B5, T1, R1-R6). B1 also meets the reopening condition of the follow-up this order settled (D008).",
  "evidence": [
    "Verifier gate: npm test -- --again --review, 38 passed, 0 failed, 592.66 s, recorded 2026-09-29T16:56:29Z; npm run test:docs, 23 passed, 13.80 s; focused live and runtime-status tests, 22 of 22; npm run publication:check current; git diff --check clean",
    "Verifier scratch reproduction with a continuously running dotln resident (no --once): a missing DOTLN_LAUNCHPAD, a malformed dotln.config.json and a FIFO index each stay alive after 2.5 s and publish workOrders.reason launchpad-unavailable, configuration-invalid and index-not-regular, which console status prints; malformed index content gives index-invalid and a missing index gives index-unreadable; a stale .runtime-status-*.tmp is removed and an unrelated keep.tmp is kept; SIGTERM exits 0; no scratch path reaches the status file",
    "Verifier PTY probe (24x80, Python pty) of the final build against a real ResidentHost with a sandboxed script actor, 10 s cadence and 250 ms tick: alternate screen, no idle repaint in 2.5 s, away, Actor started, Script completed (verified), back, diff paused until Enter with no repaint, audit paused and containing ScriptEpisodeObserved, quit exit 0 and the normal screen restored; exactly four ConsoleCommandInvoked commands, each observed with exit 0; no frame taller than 24 rows",
    "B1: a FIFO at <launchpad>/dotln.config.json blocks dotln resident --once until SIGKILL at 5 s, with no events and no status file (scripts/lib/config.mjs:641-643, an unguarded readFileSync that predates this order); product 04:420-421 and the console README's index-source paragraph claim that configuration failures degrade and that a FIFO cannot block startup",
    "B2: measured renderLiveView per refresh over a store with N added ClockSampled events: 10,000 (1.7 MiB) 35/20/19 ms; 86,400 (14.4 MiB, one day at the default 1 s tick) 186/174/194 ms; 259,200 (43.2 MiB) 611/540/535 ms; each refresh re-reads, decodes and audit-projects the whole log synchronously every 1,000 ms (live.ts:40-56, 105-119, 180), and D002's evidence names only the status-file watcher",
    "B3: watchLiveView over one verified ScriptEpisodeObserved event; after an outage of events.jsonl and a restore of the same bytes, the recovery change notice is ['Script completed (verified)'] although nothing was appended (live.ts:152-162, 178)",
    "B4: after SIGKILL of a running dotln resident, watchLiveView emits no frame in 3 s and the view still shows the last presence line, with no stale or unreachable indication (live.ts:40-56, 87-104 never read observedAt or the loopback descriptor)",
    "Resident audit: the full dotln.audit of the verifier's probe store has 0 L0 receipts and 0 L1 entries (audit.ts:562-829 derive records only from kernel event types that the resident never appends)",
    "Witness timing: in the retained ignored store, the operator-paced sequence runs 15:37:34-15:38:19Z; live.ts was last written 15:44:36Z; no checkpoint retains the witnessed live.ts; the operator's compiled diff was 2,589 bytes, about 85 lines on a 24-row terminal, so D005's short-result defect would not have hidden it (inference from D004's long-result pause)",
    "One read-only review workflow of four agents (three criterion reviewers and one batched refuter); results are used where the verifier reproduced them or named as theirs in docs/verifications/WO-117/VER-001.md"
  ],
  "rationale": "Mission and critical path: WO-117 closes gate U and WO-118 builds on the live host, so defects that bear on long unattended supervision (B2, B4) and on the settled hardening row (B1) are recorded before that reliance. Rule beating and seeking the wrong goal: the fixture suite is green, but the passive audit preview is empty on every resident store and the terminal paths have no committed test, so the report names the reading it applies instead of counting labels. Policy resistance: B1's blocking read belongs to the shared configuration loader that every tool uses, so a resident-only guard would diverge from it; the follow-up names both. Commons: one extra full gate, scratch-only reproductions, four agents out of a cap of 20 with no descendants. Escalation and success to the successful: no new gate or dependency is proposed. Shifting the burden: B4 would otherwise leave the operator to find a dead resident through a failed command. Drift to low performance: B2 is measured rather than asserted, and the decline in D002 is shown to cover a different reader. Naive Interventionism: the verifier edits no implementation or executor record. NoOp: leaving the defects only as report sentences would lose them at close.",
  "rejected": [
    {
      "option": "Fail criterion 1 because the passive L0/L1 preview is structurally empty on a resident store",
      "reason": "The criterion names WO-116's audit view. The full render through the audit control is byte-equal to console invoke and shows the same empty L0 and L1 that WO-116 produces for any resident store, with the episode visible in L4. The emptiness belongs to WO-116's projection, not to the live client."
    },
    {
      "option": "Fail criterion 2 because the operator ran a pre-final live.ts",
      "reason": "The criterion asks for the operator's session against the real resident with the named steps. The retained events corroborate each step at human pace, and the final build reproduces the same sequence under the verifier's probe. The missing disclosure is a record defect (R2)."
    },
    {
      "option": "Fail criterion 3 on B1",
      "reason": "Criterion 3 names a missing launchpad, a malformed configuration and a FIFO index. A FIFO at the configuration path is a special file, not malformed content, and its blocking read is in the configuration loader, which this order does not change; it is recorded through D008."
    },
    {
      "option": "Fail criterion 4 on the capability row's missing level or on product 04's dropped malformed-index sentence",
      "reason": "The write-backs landed in place within the byte bound, and the row assesses console.live. The table's level vocabulary, the stale 'verification pending' phrase and the dropped guarantee are document repairs within the final review's Boy Scout bound (R5, R6)."
    },
    {
      "option": "Repair any item in the verifier session",
      "reason": "An independent verifier records the defect and preserves the judged subject."
    }
  ],
  "followup": "Planning, before WO-118 relies on the live host for unattended supervision (document items may instead be taken by the WO-117 final review within its Boy Scout bound). B2: bound the passive refresh by the displayed window (tail or offset read, incremental decode) or record a measured bound with a reopening condition that names the event-log reader. B3: only a successful decode may replace the change baseline, with a regression on the post-recovery change notice. B4: show resident reachability or status freshness (descriptor presence or observedAt age) without writes or commands. B5: orders shows workOrders.reason; client-side failures report the allowlisted refusal reason instead of one generic line. T1: commit a terminal-mode regression (pseudo-TTY or injected rows, columns and isTTY) for the alternate screen, pause-until-Enter, deferred redraw and clipping; assert CLI frames; assert every alias; run the idle and close checks past one 1,000 ms interval; give the FIFO CLI regressions killSignal SIGKILL; derive the schema-enum parity from WORK_ORDER_SOURCE_REASONS. R1: record the fixture transcripts the evidence gate names. R2: say in witness.md that the operator ran the pre-D005 live.ts, and correct script_<ordinal> to script_<16 hex>. R3: give terminal-probe.json a time and code identity per block, or narrow handoff's 'then passed on that build' and D005's 'focused regression coverage' to what the record shows. R4: add a correction that supersedes D002's 250 ms refresh, D003's eight-and-eight preview bound and 224/59,935 bytes figure, and D003's claim that registration was required, and state that a resident store yields no L0/L1 preview content (console README and capability row). R5: restore product 04's statement that malformed index content leaves orders unavailable (index-invalid), and narrow or extend the configuration claim per B1. R6: give the capability row a level, target and E0 efficiency, and replace 'independent verification pending'. Also record the runtime-status-v1 forward-compatibility effect of the optional reason.",
  "reopenWhen": "A repair changes the live host's refresh, change notices, liveness display or terminal tests, or WO-118 activates on the live host before this follow-up is disposed."
}
```

## WO-117-D008

```json
{
  "id": "WO-117-D008",
  "date": "2026-09-29",
  "dispatch": "resume: verify",
  "decision": "Record that the reopening condition of FUP-4656197433cb8b3d, 'A bad source blocks resident work', occurred on the day this order settled it. A FIFO in place of the launchpad configuration blocks dotln resident before the host starts. Reopen WO-114-D013's row for planning or the WO-117 final review. Do not route WO-117 to repair: the configuration loader's blocking read predates this order, and criterion 3 does not name a special file at the configuration path.",
  "reopens": {
    "decisionId": "WO-114-D013",
    "observation": "VER-001 B1: with DOTLN_LAUNCHPAD naming a directory whose dotln.config.json is a FIFO, dotln resident --store <store> --policy <policy> --once was still blocked at the 5 s spawnSync timeout and was killed by SIGKILL; no events.jsonl and no runtime-status-v1.json were written. scripts/lib/config.mjs:641-643 reads the configuration with a blocking readFileSync after a stat that accepts a FIFO, and packages/skeleton/src/dotln.ts:139-148 guards only thrown errors. The index-side O_NONBLOCK and fstat guard that WO-117 added does not cover this source."
  },
  "evidence": [
    "Verifier scratch reproduction on 2026-09-29 at code identity a4e5e0d8 (docs/verifications/WO-117/VER-001.md B1)",
    "docs/planning/followups.json FUP-4656197433cb8b3d settled disposition, reopenWhen 'A bad source blocks resident work or a helper loses the selected source cause.'",
    "docs/product/04-interfaces.md:420-421 and the packages/console/README.md index-source paragraph, which state that configuration failures degrade and that a FIFO cannot block startup"
  ],
  "rejected": [
    {
      "option": "Leave the row settled and record B1 only under D007",
      "reason": "The settled row's own reopening condition occurred. A new row alone would hide that the settlement no longer holds."
    }
  ],
  "reopenWhen": "A repair opens every configuration source the resident CLI reads without blocking and checks it as a regular file, or narrows the product 04 and console README claims to what holds."
}
```

## WO-117-D009

```json
{
  "id": "WO-117-D009",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Integrate current main through worktree integrate, review the resulting subject and correct the adjacent publication and evidence inaccuracies identified in VER-001 R1-R6. Preserve the immutable verifier report and original decisions; behavioral findings B1-B5 and test work T1 remain named follow-ups, not reviewer implementation changes.",
  "evidence": [
    "Canonical status selected WO-117 in verified with VER-001 pass; final-review allocated FINAL-001 and reserved this worktree's sole writer.",
    "VER-001 independently passed criteria 1-5 at a4e5e0d8 and identified reproducible behavioral limitations plus bounded document corrections.",
    "Product 07 Independent workflows and integration assigns routine upstream incorporation to final review and forbids a reviewer from writing a behavioral fix and certifying it."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Give gate U and WO-118 a reviewed combined console with accurate evidence and visible limits, retaining the resident's existing command authority.",
    "traps": {
      "policyResistance": "Preserve the verifier's judged subject and use the canonical integration and publication commands.",
      "tragedyOfTheCommons": "One writer, no subagents, focused evidence capture and one final review gate.",
      "driftToLowPerformance": "Keep the measured refresh and liveness limitations visible rather than silently lowering the promised standard.",
      "escalation": "No new gate, dependency or behavioral redesign; corrections stay within named outputs.",
      "successToTheSuccessful": "Judge the combined client against the order and executable evidence, not its prior passing verdict alone.",
      "shiftingTheBurden": "Complete integration and publication bookkeeping here; preserve actionable behavioral follow-ups for planning.",
      "ruleBeating": "Distinguish the operator's earlier build from final-build automated evidence and capture actual fixture transcripts.",
      "seekingTheWrongGoal": "Review usable resident supervision and truthful compatibility claims, not receipt volume."
    },
    "naiveInterventionism": "Retain original reports and recovery refs; limit edits to factual documentation and record corrections. Existing consumers, terminal behavior and command contracts remain the subjects of checks.",
    "noOp": "A silent pass would publish overbroad configuration guarantees and misleading witness timing. Bounded corrections and explicit retained follow-ups improve the handoff without self-certifying new behavior."
  },
  "rejected": [
    {
      "option": "Implement the verifier's behavioral follow-ups in final review",
      "reason": "Requires repair and fresh independent verification; outside reviewer authority."
    },
    {
      "option": "Leave known publication inaccuracies for planning",
      "reason": "These adjacent, low-risk corrections fit the named paths and existing document/publication checks."
    }
  ],
  "reopenWhen": "Integration changes acceptance behavior, a required check fails, or review finds an actual unmet criterion."
}
```

## WO-117-D010

<!-- integration refs/dotln/checkpoint/WO-117/6 -->

```json
{
  "id": "WO-117-D010",
  "date": "2026-09-29",
  "dispatch": "resume: final review; worktree integrate WO-117",
  "decision": "Integrate fetched main through the canonical helper, retaining both bases and recovery material. Main equals the original base, so no authored conflict, merge or acceptance change occurred. Carry all five original implementation claims and VER-001 evidence forward; retain component versions and v0.56.0. Final review judges the bounded document corrections and records the affected checks in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-117/6",
    "base 3a68c517668555ae201feb8f1d51ee86c9e9ada0",
    "upstream 3a68c517668555ae201feb8f1d51ee86c9e9ada0"
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

Integration date: 2026-09-29. Original base: `3a68c517668555ae201feb8f1d51ee86c9e9ada0`.
Fetched main: `3a68c517668555ae201feb8f1d51ee86c9e9ada0`. Checkpoint: `refs/dotln/checkpoint/WO-117/6`.
Named stash retained: `bbbcf39785f12469a2d8efc40562a28547c2f5d3` (WO-117 integrate 2026-09-29).
Resolved projections: none.
Release preparation: WO-117 target v0.56.0 remains current. Files changed: docs/evidence/WO-117/meta.json, docs/final-reviews/WO-117/PR.md. Meter snapshot: docs/evidence/WO-117/meta.json, 3653 bytes. Tag observation: local snapshot only.
Carried-forward claims: all five criteria retain their original implementation subject and VER-001 evidence because fetched main equals the original base and no authored resolution occurred. Console 0.4.0 and skeleton 0.45.1 remain valid against that base; v0.56.0 needs no retiming. The four selected deterministic evidence editions remain selected, with unchanged feedback behavior carried and original editions preserved. Final checks and the publication judgment are recorded in FINAL-001, not attributed to the integration helper.
Authored conflicts observed: none.
Affected checks: final npm test -- --review passed 38 suites; publication, harness, release-surface and planning checks passed. Current document checks passed 23 suites. FINAL-001 binds the execution rows and their cutoffs.

## WO-117-D011

```json
{
  "id": "WO-117-D011",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Correct VER-001 R1-R6 in the bounded evidence and publication surfaces. Preserve D001-D008 and VER-001 as historical source; this correction supersedes their stale presentation, measurement and provenance claims. Retain B1-B5 and T1 under FUP-4656197433cb8b3d and FUP-165f9860f8f32a67 for planning rather than writing behavioral changes in final review.",
  "evidence": [
    "R1: final review records the focused fixture execution in docs/evidence/WO-117/fixtures.txt and links it from the handoff; the transcript names its actual source identity and result.",
    "R2/R3: VER-001 observed operator commands at 15:37:34-15:38:19 UTC and live.ts's last write at 15:44:36 UTC. No checkpoint retains the witnessed build. The main executor probe matches the earlier automated sequence; supplemental exact timing and source identity are unrecorded. Neither is invented. The witness, probe metadata and handoff disclose this, while VER-001's final-build PTY evidence remains separate.",
    "The witness shape script_<ordinal> was wrong: residentEpisodeId calls kernel commandId and replaces cmd_ with script_; kernel stableHash returns 16 hexadecimal characters. The corrected public shape is script_<16 hex>.",
    "R4: live.ts uses its own 1,000 ms polling interval, not D002's existing 250 ms status watcher. D003's preview is one L0 receipt, one L1 entry and three recent non-clock events, not eight and eight. Before review edits product 04 measured 59,927 bytes (+216), not 59,935 (+224); after the accurate configuration and preview corrections it measures 60,042 (+331), within the 400-byte addition and 60,856 ceiling.",
    "R4: the evidence inventory offers either registration or documented exclusion. D003 overstated registration as required; registration was the executor's conservative choice for the ResidentStore runtime dependency. This order retains that choice and its deterministic remint cost, not an assertion that exclusion was impossible.",
    "R4/R6: resident event logs yield no L0/L1 audit records; the three recent raw event labels and full audit L4 still expose script results. The console README and capability row say so. console.live is demonstrable level 1, target 2, efficiency E0 unknown, with VER-001 passed and dependable terminal/liveness work remaining.",
    "R5/B1: loadConfig still calls blocking readFileSync on dotln.config.json. Product 04 and the console README now promise malformed regular-file configuration degradation and FIFO safety only for index/binding reads; malformed index data's unavailable guarantee is restored.",
    "The new runtime-status-v1 decoder accepts old views, but the old strict shape rejects the optional reason in new unavailable views. The console README, roadmap and release notes disclose the consumer update. Existing colon aliases are accepted, not historical released aliases; local inspection and an aborted request retain the prior exit status.",
    "D005's focused regression coverage applied to payload coercion; terminal pause and clipping have automated probe evidence, not committed terminal tests. T1 remains open. The premature carry-in settlement cited a gate and handoff that existed only later; those claims are historical, and D008 already reopens it."
  ],
  "rationale": "D009's mission, eight system-trap comparisons, Naive Interventionism and NoOp still hold: accurate public limits and build attribution improve the handoff while preserving reviewer independence. A live session with the named steps satisfies criterion 2 without claiming the final build was human-witnessed; VER-001 separately reproduced the final presentation. The passive audit uses the same WO-116 projections and an explicit full audit command, so empty resident L0/L1 content is disclosed rather than synthesized. Missing passive crash detection and history-scaled work matter to unattended supervision, but the order declares no freshness or performance threshold. B1 is a special configuration file outside its three named hardening cases; it remains a defect, not a guarantee.",
  "rejected": [
    {
      "option": "Publish unchanged witness timing, broad FIFO guarantees or the original capability assessment",
      "reason": "Checked source and VER-001 contradict those statements; reversible adjacent documentation corrections are authorized."
    },
    {
      "option": "Restage implementation or terminal tests to settle B1-B5/T1",
      "reason": "Would need repair and independent verification. Preserve the executable subject and explicitly dispose the named planning follow-ups instead."
    }
  ],
  "reopenWhen": "A later host relies on freshness or bounded refresh cost, a strict consumer fails after upgrade, the disclosed witness provenance is contradicted, or an executable required criterion fails."
}
```

## WO-117-D012

```json
{
  "id": "WO-117-D012",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Dispose the follow-ups whose conditions occurred, preserve unrelated deferred rows, and prepare the reviewed WO branch for publication only after the final gate and document checks pass. The implementation remains the verifier's subject; documentation and record corrections do not certify a behavioral repair.",
  "evidence": [
    "Both touching-query pages were read: eleven pending rows matched, plus the earlier settled display follow-up retained in the register. FUP-4656197433cb8b3d is now open at source revision 2 for configuration-path FIFO blocking, after D008 reopened its settlement. FUP-165f9860f8f32a67 is open: R1-R6 are corrected here; B2-B5 and T1 remain for planning before WO-118 relies on unattended supervision.",
    "FUP-4f8cd7989607ad3f's resident-host plus feedback-edition condition occurred. It is explicitly deferred with a narrowed reopening: this diff only forwards an index-source cause and the deterministic feedback edition carries unchanged judged behavior; resident-state and NoOp deduplication do not change.",
    "FUP-0045 and FUP-0086 remain deferred because this branch is not yet landed and this order implements no authoring journey. FUP-0073's WO-083 closure condition has not occurred. FUP-56b599e15f97e666's resident-state/incomplete-capsule condition is not opened by the new contract inventory entry.",
    "FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb and FUP-fd05316b6030ef73 only match generated metadata or broad document paths: the byte-proof writer, usage attribution and standing writer wording are unchanged. Their dispositions stay as recorded.",
    "FUP-5e2f4ce16f9e8be1's cleanup thresholds are not reached by this subject: WO-117 evidence measured 370,327 bytes at the 2026-09-29 review cutoff. Newly tracked evidence files since the 2026-09-25 boundary over base 76d28aff totaled 6,711,845 bytes, plus current untracked WO-117 evidence 370,327, totaling 7,082,172 bytes; no 1 MB order or 10 MB weekly trigger is established. Preserve historical editions and leave the cleanup row deferred.",
    "The reviewer fixture transcript passes 22/22 at a4e5e0d8 in 15.117 seconds. Product 04 totals 60,042 bytes (+331) within its 60,856 ceiling and this order's 400-byte addition. Publication, harness, local release-surface and planning checks pass after the corrections."
  ],
  "rationale": "D009's mission and eight-trap comparisons remain applicable. Use the canonical register to keep defects actionable without expanding a reviewed console order into replay identity, evidence pruning or writer policy. NoOp would retain stale settlement status; documenting the current remaining work removes that ambiguity. The review's final product gate may reuse a covering executed pass at the unchanged code identity under WO-173; such reuse is labeled, not counted as a new execution.",
  "rejected": [
    {
      "option": "Settle the behavior/test row because its documentation subset was corrected",
      "reason": "B2-B5 and T1 remain established limitations; partial completion of that future work is not settlement."
    },
    {
      "option": "Repeat a covering full gate solely to create a new row",
      "reason": "WO-173 explicitly reuses complete passing evidence at the same code identity; rerun when source changes or a required suite is not covered."
    }
  ],
  "reopenWhen": "The final gate cannot cover this code identity, an actual criterion defect appears, or one of the retained follow-up conditions occurs."
}
```

## WO-117-D013

```json
{
  "id": "WO-117-D013",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Preserve the inherited sequence-size advisory and nominate its reconciliation to planning. It does not change this order's implementation, criteria or publication authority.",
  "evidence": [
    "The meter reports sequenceBytes 13,965 against configured 8,192. docs/planning/sequence.md is byte-identical to HEAD at 13,965 bytes and WO-117 does not edit it.",
    "docs/control/budgets.json retains a 2026-09-22 acceptance at 12,369 bytes alongside the configured 8,192 ceiling; the current sequence exceeds both. All role cold-start sizes are within their configured ceilings."
  ],
  "rationale": "Keep the observed process limit visible without extending console final review into the queue's structure or policy. This is an existing advisory rather than a product-gate failure. Commons, escalation and seeking the wrong goal favor one planning nomination; the other D009 lenses have no changed behavioral seam. Naive Interventionism preserves the queue and existing budget records. NoOp alone would lose the measured reopening input.",
  "followup": "Planner at the next queue review: reconcile docs/planning/sequence.md at 13,965 bytes with docs/control/budgets.json sequenceBytes 8,192 and its recorded 12,369-byte acceptance, using the standing horizon/budget policy. Preserve the queue and reviewed rules; do not trim solely to hide the measured breach.",
  "rejected": [
    {
      "option": "Rewrite the sequence or budget during console final review",
      "reason": "Neither is part of the selected order; preserve the measured planning input and its existing policy."
    }
  ],
  "reopenWhen": "The next planning pass changes the sequence or its horizon, or an operator relies on the stale configured/accepted ceiling."
}
```

## WO-117-D014

```json
{
  "id": "WO-117-D014",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "decision": "Use the fresh passing review gate at the staged source identity, retain the verifier's original identity and checkpoint, and complete the bounded documentation corrections before publication. Staging changes the evidence key, not the implementation bytes.",
  "evidence": [
    "gateCodeIdentity uses git ls-files. Before final-review staging it returned a4e5e0d8; after live.ts and live.test.ts were staged it returned 6b7f545b. The walkthrough fixture is classified generated. All package source and test bytes plus evidence-sources.mjs and the lockfile remain equal to the verifier checkpoint refs/dotln/checkpoint/WO-117/4; the new live files and helper also hash equal to their checkpoint blobs.",
    "npm test -- --review ran once after staging: 38 suites passed, 0 failed, 82 fresh tasks, duration 581,262 ms. The executed passing row recorded at 2026-09-29T17:52:23.902Z binds code identity 6b7f545b9cece0be95128dcca0b1fced128cc3258f5267d12d0ccb579654b0de and reviewed tree d8c3fb131f493ec5789d605ba78ff0bca730b2c7.",
    "The final fixture transcript was re-recorded after staging to bind its named source identity: 22 passed, zero failed, 14.919 seconds. The earlier 15.117-second transcript remains in ignored control/local recovery material; no product source changed or second full gate ran.",
    "The current document gate passed 23 suites, zero failed, in 13.509 seconds at 2026-09-29T17:55:15.868Z. Authoritative origin release preparation still selects v0.56.0; the PR meter and order snapshot are refreshed.",
    "The release-note parser refused an angle-bracket STORE placeholder as raw HTML. It now uses the literal STORE, and the five-section parser passes. A new sequence-advisory decision initially lacked the required rejected choices; that record was completed and meta passes. Neither correction changes the code identity."
  ],
  "rationale": "D009-D012's mission and trap comparisons hold at the completed implementation outcome. A fresh gate was required because the tracked-source key gained the new live source and test, so D012's possible reuse did not apply. Preserve both provenance scopes rather than making an old verdict or row claim the newly staged key. The only changes since verification are explicit document/record corrections and staging; no behavioral fix is self-certified.",
  "rejected": [
    {
      "option": "Carry the pre-staging key into publication or claim the fresh gate was reused",
      "reason": "The actual runner executed a new complete row at 6b7f545b; publication must bind that row."
    }
  ],
  "reopenWhen": "A subsequent source edit changes code identity or an intended source file remains unstaged before publication."
}
```
