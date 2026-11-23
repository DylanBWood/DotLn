# What tells a session to stop, ask, wait or hand over a command

Record of the [2026-11-23 planning pass](the-kit-keeps-working-2026-11-23.md). This is the report of one of its research workers (the `default` worker; the host reported claude-opus-5-5), read-only, at `main` `bc761ad9c` (v1.4.0) on 2026-11-23. It is a worker's reading: what the pass checked itself is said in the pass document, with the file and line. The host refused the worker's own write of this file, so the pass filed the report as returned, with absolute checkout paths replaced by names.

## 0. Boundary of this read

Read in full or in the cited regions:
- `packages/skeleton/src/loadouts/contributor.ts` (all), `feedback.ts`, `executor-supports.ts`, `process-cost.ts`, `goal-alignment.ts`, `prompt-support.ts`
- `packages/skeleton/src/stops.mjs` (all), `packages/compiler/src/operator-control.mjs` (all), `packages/skeleton/src/correction-observation.mjs`
- `packages/compiler/src/harness.ts` 1-330, 1180-1300, 1836-1940, 2030-2100
- `packages/skeleton/src/harness-host.ts` only: 430-520, 743-748, 1340-1590, 1620-1840, 4500-4540, 5880-6130, 6800-7200, 7250-7490, 7583-8030, 8380-8510
- `observed-facts.ts` 253-342 and 760-1000
- `scripts/lib/dispatch-bound.mjs` 330-530; `scripts/lib/harness.mjs` 120-520, 570-590, 1215-1232; `executor-readiness.mjs` 1-90; `scripts/resume.mjs` 1630-1730; `scripts/operator-control.mjs`; `drive-session.mjs` 95-130; `drive-prompts.mjs` 1-205; `drive-route.mjs` and `drive-account.mjs` by grep; `test-runner.mjs` 2643-2722 and 3890-3925; `subagent-budget.ts` 436-470; `time-limits.mjs` 529-531
- installed `.claude/skills/*/SKILL.md` (executor in full, the others by grep), `.claude/settings.json`, `CLAUDE.md`, `scripts/kit/CLAUDE.template.md`, `dotln.config.example.json`, `budgets.template.json`
- product 07 lines 1230-1340 and 4790-4807; WO-287 decisions D088
- `git diff` and `git log -S` across tags v1.1.0–v1.4.0

Not read: `docs/control/local/`, `docs/intake/`, the instance, about 80% of `harness-host.ts`, most of `resume.mjs`, the drive modules, the gate runner, the Codex continuation adapter, `docs/KIT.md`, and Claude Code host documentation.

## 1. Sources and the instance's copy

The emit (`scripts/lib/harness.mjs:570-580` → `harnessInstallation` 264-520) builds the skills and the generated block of CLAUDE.md from:
- **`contributor.ts`**: role procedures 317-533, `roleSteps` 1124-1158, `planFirstSteps` 1119-1123, and shared rules (`correctionRules` 167-256, `insertedRules` 821-914, `sharedRules` 917-934)
- **`feedback.ts`**: the ten units. A skill prints each unit's desired-behavior text (`harness.ts:1636`). The current version-2 texts are at 186-263.
- **`executor-supports.ts`**: executor only (`contributor.ts:1211-1218`). Defaults at 81-90: operator-check-in and communication-intent are on.
- **`document-quality.ts:3`**: the `quality pass:` text
- **`harness.ts:1903`**: the refusals paragraph of CLAUDE.md
- **hooks**: every hook file is written by `harness.ts:1279`. It embeds `operator-control.mjs` and then calls `runHarnessHook` in `harness-host.ts`.

An instance is a "kit root": it holds `KIT-MANIFEST.json` and no package sources (`runtime-inputs.mjs:84-90`). Its emit passes `instance` and `rootStopLevels` (`scripts/lib/harness.mjs:578-579`, 143-152). Four things differ from core:
1. **Stop levels (v1.4.0).** Rows of class `work` refuse everywhere. Rows of class `record`, `host` and `bound` refuse in core and advise in an instance (`stops.mjs:875-876`).
2. **The clean-room line in CLAUDE.md** (`contributor.ts:1529-1531`). This is the only use of the instance flag in role text.
3. **The author layer (v1.4.0).**
   - All ten feedback units belong to it, because each declares scope `personal-profile` (`contributor.ts:940-943`).
   - So do these shared rules: own-decisions, operator-aim, operator-words, question-pathways, claims-evidence, request-authority, blocked-turn, runnable-commands, stop-monitors, safeguard-refusals, browser-verification, artifact-shape, expected-data, durations, publication-check.
   - An overlay with `unequip: ["author"]` removes them all (1002-1018, 1037-1061, 1536).
   - The executor supports are separate switches, so this does not remove them (`scripts/lib/harness.mjs:316-319`).
4. **Starter defaults.**
   - `dotln.config.example.json`: `"build": {}` (no overlay), plan-first off, and since v1.4.0 `"stops": {"planning-branch": "advise"}`.
   - `budgets.template.json`: `spend.daily` null; executor `completeRuns` 3, wall clock `local-median`. It is seeded once at export (`launchpad.mjs:1293-1295`).

Inference: with the starter defaults, an instance's skills are byte-identical to core's for each release.

## 2. Census

**(a)** directs ending the turn, asking, waiting, or handing the operator a command. **(b)** permits it. **(c)** tells the session to decide and continue. "SKILL:n" means core's executor skill unless another role is named.

### 2.1 Role text

| # | Text (shortened) | Source | Roles | Condition | Mark |
|---|---|---|---|---|---|
| R1 | "When only the operator can clear what blocks this session, say so once: state the block and the one line that clears it in a single message, then end your turn, because the host holds a `!` command the operator types until the turn ends." | contributor.ts:118-119, 225 (author); SKILL:51 | every role incl. router | a block only the operator can clear | (a) |
| R2 | "Request needed authority here through the host permission flow; give the operator a command to run in your place only when the order or role names that fallback." | :219-224; SKILL:50 | all | needing authority | (c), narrow (b) |
| R3 | "Operator commands must be copy-paste runnable…; questions plainly state what they decide and why." | :232-237; SKILL:53 | all | — | (b) |
| R4 | "…asks the operator nothing… do not ask the operator to arbitrate implementation or change criteria… record the safe default… without demanding a response." | :187-192; SKILL:45 | all | always | (c) |
| R5 | "…state its aim in one line and act on the evidence-backed reading; record any consequential assumption…" | :193-198; SKILL:46 | all | each operator message | (c) |
| R6 | "An operator message that ends in a question mark is a smell, never a stop or a rule: … keep working; a message that also asks for an action, pausing, stopping or waiting included, is a request…, so do it." | :116-117; SKILL:48 | all | question | (c); (a) only when the operator asks to pause or wait |
| R7 | anti-oscillation: "…when the boundary is genuinely unclear, ask one focused question instead of guessing…; and pause to ask before any file action that goes beyond the literal correction." | feedback.ts:179-184; SKILL:98 | all | after a correction | (a) |
| R8 | fail-conservative-correction: "On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis…" | feedback.ts:86-95; SKILL:102 | all | "typed" is not defined in role text | (a)-leaning |
| R9 | "…where they fit no entry or several, ask." | contributor.ts:163-164; SKILL:42 | all but release-close | choosing a worker | (a) conditional |
| R10 | Operator Check-In: "…offer a reasonable opportunity for steering through available asynchronous input or a turn boundary… Do not… wait indefinitely for approval." | executor-supports.ts:36-40; SKILL:62 | executor, on by default | before each queued item | (b) |
| R11 | Intent to Act: "On entry, tell the operator in chat 'I intend to'… Proceed… after current work and a reasonable steering opportunity unless the operator vetoes…; this is not a routine permission request." | executor-supports.ts:65-69; SKILL:63 | executor, on by default | on entry and before each action | (b) |
| R12 | Follow-up Queue: "a scope change requires a fresh announcement" | executor-supports.ts:30-34; SKILL:61 | executor | — | (b), via R11 |
| R13 | "When a prompt's facts say the day's figure is reached, or you stop with the order unfinished, finish the step in hand, write `docs/evidence/WO-NNN/standing.md` and end the turn" | contributor.ts:908-913; SKILL:40 | executor | figure reached | (a); otherwise (b) |
| R14 | "Infer authorization to proceed from the operator's ordinary language… continue here… Without authorization… start no further complete gate, bounded probe or worker past an exhausted bound." | :866-870; SKILL:33 | all | bound exhausted | (c), then (a) |
| R15 | "`analysis:` pauses for diagnosis/direction; `operator override:` suspends DotLn gates…" | :110-111; SKILL:23 | all but release-close | operator types the prefix | (b) |
| R16 | "`conversation only:` answers without pausing work. … only explicit pause/stop interrupts." | :813-814; SKILL:27 | all | — | (c) |
| R17 | quality pass: "…proceed; ask only when the target or intended reader is materially ambiguous… Continue the original task afterward." | document-quality.ts:3 | all | `quality pass:` | (c) |
| R18 | evidence wait: "…then do bounded listed work or stay quiet; never poll or narrate the wait." | contributor.ts:112-113; SKILL:41 | all | gate running | (b) |
| R19 | prune: "…run `prune --apply` yourself…; hand the operator the printed command only after a recorded host denial…" | :226-231; SKILL:52 | all but refuter | — | (c), narrow (b) |
| R20 | "After two consecutive provider safeguard refusals, stop retrying… resume in a fresh session." | :250-255; SKILL:56 | all | — | (a) conditional |
| R21 | "For status/times, report the read-only command and stop"; "If closed… give the exact printed worktree-start handoff." | :1126, :355; SKILL:8, 77 | executor | — | (a) by design |
| R22 | "Never leave the writer reserved at handoff or ask the operator to release it." | :370 | executor | — | (c) |
| R23 | Verifier: "…without asking the operator to authorize it… the operator route with its recorded safe default, not an authorization request" | :384; verifier SKILL:69 | verifier | — | (c) |
| R24 | Reviewer: operator packet with a safe default (:415); "On failure, stop with findings" and "Return the helper's exact post-merge release-close handoff" (:425-426) | reviewer SKILL:75, 86-87 | reviewer | — | (c); (a) by design |
| R25 | Release close: "Retry a host denial… once… before handing the operator the printed command for !" (:266); starter refresh "ask one focused question when its checkout is unrecorded or dirty" (:1092) | — | release-close | — | (b); (a) conditional |
| R26 | Planner and refuter: starter update only on the operator's words (:467); external refutation CLI only on explicit request (:472); "If background workers are unavailable, report that limitation…" (:315) | — | planner, refuter | — | (a) conditional |
| R27 | Router: "If the host denies the request, stop" (:334); "Stop for awaiting-merge, … analysis…"; since v1.4.0 "give the operator the account's lines… an `analysis:` session… reads further" (:337) | — | router | — | (a) by design |
| R28 | Plan-first (when elected): "print all three paths and stop the turn… Wait for the operator's ordinary approval" | :1119-1123 | executor | elected | (a) |
| R29 | Decision Receipts: "not… a new approval step"; Adjacent Repair: "neither… omission… is by itself a reason to defer" | executor-supports.ts:10-28 | executor | — | (c) |

### 2.2 CLAUDE.md

- Template line 16: "Stop and flag suspect material". (a) conditional.
- Lines 46-50: "Always admit `analysis:` (pause for diagnosis or direction)…". (b)
- Lines 52-54 (v1.4.0): "A stop's level is the owner's to change…". (b)
- Harness block (`harness.ts:1903`): "…refuses a complete gate, bounded probe or worker launch past the dispatch bound, naming analysis: and the operator's accept-overrun route… an exported instance advises on those that guard the kit's own records, a host property or a bound… a session changes one only when its owner asks for it in that session; operator override: is the operator's last resort and no stop's route." (b) toward the owner.
- "Other tool and completion judgments are advisory and host permissions decide." (c)

### 2.3 Prompt hook (`additionalContext`, plus `systemMessage` notices)

- **Dispatch phrase** (`harness-host.ts:7305-7310`): "DotLn resolved role X. Load the dotln-X skill…" plus the briefing. (c)
- **Executor entry duties in the briefing** (`executor-readiness.mjs:58-82`):
  - "Intent to Act is equipped: tell the operator 'I intend to' and the concrete initial action before implementation; announce each next queued action before starting it." (b)
  - "Operator Check-In is equipped: at a safe boundary, process available steering…" (b)
  - "Adjacent Repair… do not wait for the operator to name this support." (c)
- **Plan-first briefing** (`resume.mjs:1658-1667`): "Plan-first is awaiting the operator… Print the three paths and stop this turn." (a)
- **Illegal dispatch** (`harness-host.ts:5930-5937`): "…Inspect canonical status and continue within the operator's authority…" (c)
- **Question context** (`harness.ts:181-182`; `harness-host.ts:7441-7449`): "Operator question: read it as a smell… Keep working either way…". (c). Omitted when question-pathways is unequipped.
- **Every prompt**: observed facts (`observed-facts.ts:253-281`). Neutral.
- **Daily figure** (`observed-facts.ts:310-342`; `harness-host.ts:442-475`, 7427-7430): "…The daily figure is reached: finish the step in hand, write the standing and end the turn. This is advisory and refuses nothing." (a), on every prompt in every role, when `spend.daily` is set and reached.
- **Hedge advisory** (`observed-facts.ts:829`): "State the observed value or unknown in the next message. This advisory holds no turn." Neutral.
- **analysis mode** (`operator-control.mjs:29-47`): "Pause the current routine. Explain the observed state and accept operator direction. Preserve pending work; do not resume it automatically…". (a), on every prompt.
- **Notices**:
  - "dispatch standing unavailable… Use analysis: to diagnose." (`harness-host.ts:746`). (b)
  - "run npm run discover -- harness" (7418). (b)
- **After an observed CLI dispatch** (PostToolUse, 1422): "Load the dotln-X skill and continue the recorded dispatch without repeating it." (c)

### 2.4 Pre-tool refusals and advisories

- **Refusal**: a deny decision with the reason (`harness-host.ts:5921-5929`). The reason ends with `stopRefusal` (`stops.mjs:1001-1006`): "This is stop X, which protects Y. Its level is this root's owner's to set: `"stops": {"X": "advise"}` in dotln.config.json, then node scripts/harness.mjs emit; a session changes it only when its owner asks." Read with R1, this is (a). In an instance only work stops refuse: writer-reservation, outside-write, gh-repository, and the host deny rules for ssh and npm publish.
- **Advisory**: see §3.
- **Runtime unavailable** (`harness.ts:1255`): "DotLn advisory: <cause>: built adapter unavailable; run node scripts/bootstrap.mjs…". Shown once per session per cause. While it holds, nothing is dispatched. (b)
- **analysis or override active**: every hook prints the control message and skips the runtime (`harness.ts:1279`). It is not de-duplicated.

### 2.5 PermissionDenied hook

`harness-host.ts:7185-7189`: "DotLn advisory: host permission denied the call. The operator can run it with the ! prefix, or use /permissions → Recently denied to retry. No retry is requested by this hook." The router variant says to stop. Read with R1, this is (a)/(b).

### 2.6 Stop hook and SubagentStop

- **finish.mjs, analysis or override active**: prints the control message and nothing else (`harness.ts:1279`). No writer release and no usage measurement.
- **finish.mjs, normal path** (`harness-host.ts:7583-7679`): returns only a status message, never a block. The message holds:
  - the subagent summary
  - the observed facts
  - "DotLn advisory: pending <units>; these observations do not block lifecycle completion."
  - background dispatches still running, or a prune line
  - "dispatch standing: …; within|exceeded|unset"

  It always lets the turn end (`observed-facts.ts:862`: "Stop never returns a blocking decision"; re-entry handled at `harness-host.ts:5903-5910`).
- **SubagentStop** (6069-6110): blocks a worker whose own tasks are still running, with "DOTLN_WORKER_TASKS_RUNNING… stop it… then hand back". Only in core; an instance advises.
- **Codex**: the compaction adapter blocks one premature stop so the session continues. (c)

### 2.7 Command output

- **Dispatch-bound text** (`dispatch-bound.mjs:343-344`, 448-449, 497-530): "Use analysis: to diagnose. The operator can authorize proceeding in ordinary language… the agent records… and continues… No special phrase, session exit or manual operator command is required." (c) in its own words; read with R14 it becomes (a).
- **Gate ADVISORY lines** (`test-runner.mjs:2652-2667`, 3585). An advised task fails nothing. (c)
- **Time-limit miss** (`time-limits.mjs:529-531`). Neutral.
- **Standing line in the briefing** (`resume.mjs:1635-1640`). Neutral.
- **Drive** "Await operator direction; use analysis: off…" (`drive-route.mjs:61`), and the v1.4.0 account's "Next: … open an analysis: session…" (`drive-account.mjs:235`). (a) by design.
- **Driven phase launch** "If the host denies the request, stop without retrying" (`drive-prompts.mjs:121-122`, 143). (a) conditional.

## 3. Advisories

- **How it is built**: `stopAdvisory` (`stops.mjs:1011-1018`) appends ". Stop <id> advises in this root and the work goes on; it protects <…>. `"stops": {"<id>": "refuse"}` in dotln.config.json makes it refuse and "off" silences it". `protocolAdvisory` (`harness-host.ts:5911-5913`) wraps that as "DotLn advisory: …; host permissions decide."
- **Channel**: a message to the user only. `answerStop` (5954-5969) and `withAdvisedStops` (5987-6001) attach no permission decision and no context for the model. WO-287-D088(3): "An advisory reaches the session as the hook's message to its user, and no context is attached for the calling agent".
- **The call proceeds** under the host's ordinary permissions.
- **Shown once per session per distinct text** (8457-8509), and never after a tool call (`harness.ts:27`).

Three advisories as the code builds them:
1. **live-gate**: "DotLn advisory: write may change gate inputs during active gate npm test -- --review (run <id>, pid <pid>). Stop that gate from this session with node scripts/harness.mjs evidence --stop (…) or the harness's own task-stop tool, or wait for it to finish. Read-only commands stay admitted while it runs: … Stop live-gate advises in this root and the work goes on; it protects the bytes a running gate is judging. "stops": { "live-gate": "refuse" } … ; host permissions decide."
2. **dispatch-bound**: "DotLn advisory: wall clock=<h m>, bound=<h m>. dispatch standing: …; exceeded. Use analysis: to diagnose. The operator can authorize proceeding in ordinary language in this conversation… the agent records… and continues in the same session. No special phrase, session exit or manual operator command is required. Stop dispatch-bound advises in this root and the work goes on; …"
3. **worker-cap**: "DotLn advisory: count <n>, cap 20; … subagentCap… would be exceeded. … batch the remaining work into fewer uses. The operator can state a larger cap for this dispatch in ordinary language; record it with npm run resume -- accept-overrun subagentCap … Stop worker-cap advises in this root and the work goes on; …"

My reading of whether a careful model would stop and ask:
- The bodies keep refusal wording: "would be exceeded", "or wait for it to finish", "The operator can authorize".
- R14 says not to start further work past the bound without the operator's authorization.
- Read together, the conservative resolution is to ask.
- "Stop <id> advises…" opens with the word "Stop". It parses as a noun but can be misread as an imperative. This is a guess about reading.
- Whether the model receives a hook's user message at all is unknown. The kit's own record says it was not established.

## 4. Operator-control states

- **Where it is stored**: `os.tmpdir()/dotln-operator-control-<uid>/<sha256(session_id)>.json` (`operator-control.mjs:73-106`). Codex keys it by `CODEX_THREAD_ID` (`scripts/operator-control.mjs:16`).
- **Scope**: per session id. The worktree is recorded but does not scope it. Product 07:1304-1306: "scoped to the session… a new session does not inherit it."
- **Entering it**: the trimmed raw prompt matches `^(analysis|operator override):(\s|$)`, case-insensitive (line 18). So "analysis: why did you stop?" enters it.
- **It persists across all later prompts** of that session (168-192).
- **Injected at every prompt** as context, plus a user message: "Pause the current routine. Explain the observed state and accept operator direction. Preserve pending work; do not resume it automatically. No lifecycle dispatch or passing check is claimed. Host tool permissions still apply." Every tool hook and the Stop hook print the same message.
- **While active**:
  - no dispatch: a `resume: next` typed then is not recorded
  - no guards judge anything
  - Stop does not release the writer
- **Clearing it**:
  - Only a whole prompt `analysis: off` or `operator override: off`, matching `^(analysis|operator override):\s*off\s*$` (line 19).
  - Either one also closes an override carried across an analysis pause (149-166).
  - Nothing clears it automatically. How long the temp file survives is unknown.
- **Other sessions**:
  - A new session id is not held.
  - SessionStart in the same worktree shows only a note about an open override timestamp (`harness-host.ts:4503-4538`, 7113-7118).
  - A drive stops when its router session is in analysis (`drive-session.mjs:99-125`; `drive-route.mjs:58-61`).
  - Inference: spawned workers carry the parent's session id (6042, 7139-7147), so their hooks are held with the parent.
  - Unknown: whether `claude --resume` or `--continue` keeps the id.
- **v1.4.0** added a prompt hook for these controls in target worktrees (`harness.ts:2074-2099`).

## 5. Operator-message handling

- **Classes** (`harness.ts:117-158`), read from the first content line:
  - `resume:`, `planning:`, `quality pass:` → direction
  - `ideation:` → ideation
  - `analysis:` → question
  - `operator override:` → override
  - `scope expand:` → scope expansion
  - `conversation only:` → other step
  - otherwise a message ending in `?` → question; anything else → unclassified
- **No correction class and no strong-language detection.** A grep for those words finds only `feedback.ts:90`: "not emotional wording".
- **What each class injects**:
  - question → the question context (§2.3)
  - quality pass → its guidance
  - dispatch phrases → role context and briefing
  - controls → §4
  - everything else → observed facts only
  - All are journaled as `OperatorMessageObserved` (1792-1836).
- **Typed correction** means a raw prompt starting `correction:` (`observed-facts.ts:843-860`). It is counted in the journal and nothing is injected. The freeze mechanism (`harness-host.ts:7900-7956`, narrowing at 7879-7890) is unreachable here:
  - the correction token is null (`contributor.ts:1534`)
  - the unit's mechanism is now prose (`feedback.ts:168-173`, 249-255)
  - the compiler skips prose units (`harness.ts:1286`, 1294-1295)
  - no correction hook file is installed

  The rule therefore reaches a session only as sentence R8. The drive's "typed-correction" stop is a different thing: the lifecycle `RecordCorrected` event (`drive-route.mjs:95`).

## 6. Changes by release

- **v1.2.0 (WO-282)**: only four `scripts/lib` files changed: harness.mjs, git-surface.json, machinery-sources.mjs, planning-followups.mjs. Nothing that ends turns.
- **v1.3.0 (WO-284, e544feaee)**:
  - Executor step 8 and reviewer step 5 add "An edit to documents alone… owes `npm run test:docs` and no complete run…" (c)
  - Time limits come from a table; its miss text is neutral.
- **v1.4.0 (WO-287, 0db856a4f)**:
  1. The table of stops. Record, host and bound stops advise in an instance instead of refusing.
  2. Refusal endings change from "Use operator override: for authorized recovery." to the owner-only level sentence.
  3. The CLAUDE.md block and template gain the level sentences, and the override route is removed from them.
  4. The author layer becomes removable. The question hook is suppressed when question-pathways is removed.
  5. Target worktrees get the operator-control prompt hook.
  6. The router gains the `why` account, the account lines it gives the operator, and the `analysis:` session nudge.
  7. Gate tasks can be recorded as advised.
  8. The starter config adds `planning-branch: advise`.
- **Installed skill diff v1.1.0→v1.4.0**: four lines in total across executor, reviewer and router.
- **Present before v1.1.0** (`git log -S`):
  - R1 and R6: 08fa4d28d, 2026-11-04
  - R13 and the daily line: 1763a2e28, 2026-11-14, v1.0.0
  - R10 and R11: 8298cd0ca, 2026-09-09
  - R7: c8983cce6, 2026-09-10
  - the PermissionDenied advisory: 09fe5d880, 2026-10-01

## 7. Contradictions

| # | Ask, stop or wait | Decide and continue |
|---|---|---|
| C1 | R7, `feedback.ts:182` | R5 `contributor.ts:197`; R4 `:191` |
| C2 | R10 `executor-supports.ts:39`; R11 `:68` | R16 `contributor.ts:814`; R4; R11's own "not a routine permission request"; R10's own "do not… wait indefinitely" |
| C3 | R14 `contributor.ts:869`, and the dispatch-bound body `dispatch-bound.mjs:344` | the advisory ending `stops.mjs:1017` ("the work goes on"); CLAUDE.md `harness.ts:1903` |
| C4 | CLAUDE.md "refuses … past the dispatch bound" | the same paragraph: "an exported instance advises…" |
| C5 | the refusal ending `stops.mjs:1005`, with R1 | R2 `contributor.ts:222` |
| C6 | PermissionDenied `harness-host.ts:7188`, with R1's `!` | R2; R19 |
| C7 | R9 `contributor.ts:164` | R4 `:191` |
| C8 | live-gate body "or wait for it to finish" `harness-host.ts:6120` | its own ending "the work goes on" |
| C9 | analysis context `operator-control.mjs:31` | R6 and R16 in the same session (resolved by R15) |
| C10 | R8, with "typed" undefined | R5; R29 |

## 8. My reading: likeliest causes, ranked

1. **Intent to Act and Operator Check-In** (R10, R11), on by default and delivered twice: in the skill and in the briefing's "Executor entry duties". "Tell the operator 'I intend to'…" and proceed only "after… a reasonable steering opportunity" such as "a turn boundary". That yields one statement, then the turn ends. Executor only; present since 2026-09.
   - Confirm: executor turns ending right after "I intend to"; then unequip `communication-intent` and `operator-check-in` and compare.
2. **R1 plus the v1.4.0 refusal ending plus the PermissionDenied `!` advisory.**
   - Confirm: in the instance journals, a refusal or `HostPermissionDenied` row just before turns that end with a command for the operator.
3. **A daily figure set in the instance's `docs/control/budgets.json`**. Once reached, every prompt in every role says "end the turn". The starter seeds null.
   - Confirm: a "Day's use (…)" line in prompt context, or `standing.md` files appearing.
4. **A session left in `analysis:`**. The kit's own text routes operators there.
   - Confirm: "DotLn: operator-control analysis" printed on every call, or a temp state file with `mode: "analysis"`.
5. **The correction loop (R7, R8)**.
   - Confirm: question-ending turns right after correcting messages.
6. **The author layer removed in v1.4.0**. That removes R4, R5, R6 and the question hook, while R10, R11, R13 and R14 stay.
   - Confirm: `build.overlay` unequips `author`; the manifest's `unequipped` list.
7. **Dispatch bound exceeded (C3)**.
   - Confirm: the Stop line reads "dispatch standing: …; exceeded".
8. **Plan-first elected, or hooks without their built runtime.**
   - Confirm: `features.plan-first.on` is true, or the terminal shows "built adapter unavailable".

**Across v1.2.0–v1.4.0**: the role text barely changed, and every sentence that ends turns predates v1.1.0. The release-linked changes are all in v1.4.0, and all in the hook channel and configuration. From this repository they do not clearly worsen a default instance unless the model sees advisories (unknown) or the instance's configuration changed.

**Cannot be known from this repository:**
- whether the model sees a hook's user message
- the instance's config, overlay, stops, budgets and permission mode
- the host and model versions per release
- whether resumed sessions keep their id
- whether the instance's hooks ran without their runtime after updates
- the instance's transcripts and journals
