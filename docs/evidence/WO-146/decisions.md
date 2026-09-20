# WO-146 decisions

## WO-146-D001 — Operator correction: the operator enters bare `copilot`; nothing DotLn needs depends on a launch argument

```json
{
  "id": "WO-146-D001",
  "date": "2026-09-20",
  "dispatch": "Operator correction during planning: bounded Copilot CLI integration, after the pass's first handoff: Claude is entered as `claude` and Codex as `codex`, so Copilot is entered as `copilot` with no extra arguments. Captured verbatim in ignored intake (docs/intake/notes/2026-09-20-copilot-cli-integration-planning-correction.md, SHA-256 f6b8c874c4c29243c256130582fdca269cf8dbf223a043b4c5c0e42d38402e69).",
  "decision": "Amend WO-146 so the supported entry is bare `copilot`. The objective and a new design rule say so; whatever the CLI must know comes from the repository surfaces it already reads, an in-session command or a proposed personal setting. Criterion 1 keeps flags only on scripted probe launches and adds operator-observed rows from a bare interactive session for H1, H5 and H12; criterion 5 and H5 speak of allow-all permissions however the operator turned them on, not of a flag; criterion 9 enters every qualification episode as bare `copilot` and drops the per-episode credit flag; criterion 11 no longer prescribes a launch line that disables the built-in GitHub MCP server and instead names that channel as ungoverned, with any persisted off switch going on the proposed-settings list. The planner's error was to put launch flags into the operator workflow and into criteria 9 and 11. No scope is added; no hold existed and none is discharged.",
  "evidence": [
    "docs/work-orders/WO-146-copilot-cli-harness.md",
    "docs/planning/copilot-cli-integration-2026-09-20.md",
    "docs/planning/refutations/2026-09-20-planning-1a0fb634704921a3-020.md"
  ],
  "rejected": [
    {"option": "NoOp: keep the launch line as a recommendation", "reason": "The operator will not use it, so a workflow and two criteria would describe sessions that never happen, and the qualification would test a configuration the operator does not run."},
    {"option": "A shell alias or wrapper script that adds the flags", "reason": "It hides launch arguments behind a private file, which makes a private setting the source of DotLn behavior and is the same thing the operator declined."},
    {"option": "A second independent refutation for the amended text", "reason": "The amendment removes launch arguments and adds no scope or mechanism; the amendment route binds the approved bytes to receipt 020, and the next planning receipt judges the order again."}
  ],
  "reopenWhen": "The probe shows a DotLn control that cannot work in a bare `copilot` session without a launch argument; that control is then labeled unsupported rather than solved with a flag, and the operator decides."
}
```

## WO-146-D002 - Operator-authorized recovery for the refused freeform patch input

```json
{
  "id": "WO-146-D002",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator response: Authorize the scoped operator override",
  "decision": "Temporarily enter operator override only to normalize recognized freeform patch input in the decoder, carry all patch destinations through existing write guards, add regression coverage, and rebuild/regenerate the hooks. Restore ordinary gates before continuing the probe or profile work. No personal settings are changed. No lifecycle completion is claimed.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts#decodeHarnessRecord",
    "packages/skeleton/src/harness-host.ts#runHarnessHook",
    "packages/skeleton/src/harness-command.ts#patchWriteTargets",
    "scripts/test-harness.mjs",
    "docs/work-orders/WO-146-copilot-cli-harness.md"
  ],
  "rationale": "The first source patch was refused before execution with DOTLN_HARNESS_INPUT_REFUSED: EXPECTED_OBJECT at $.tool_input. This is inside the order's decoder/tool-adapter scope, and blocks the operator's selected GPT model from editing through its exposed tool. Policy resistance is addressed at the adapter rather than by changing permission defaults. Commons and escalation: one bounded recovery, existing suite, no new gate or agent. Drift and rule beating: malformed patches still fail and every patch path, including move endpoints, reaches the existing guards. Success to the successful: preserve object-form Claude input while admitting the observed alternative. Shifting the burden: remove repeated operator recovery after this fix. Wrong goal: restore usable edits, not a permissive decoder. Naive Interventionism: keep the existing hooks and refusals, constrain normalization to recognized patch tools and grammar, and exercise the generated handlers. NoOp would leave the permitted editing tool unusable.",
  "rejected": [
    {"option": "Write the files through a shell command instead", "reason": "That would evade the observed refusal rather than obtain scoped recovery authority."},
    {"option": "Accept arbitrary string tool inputs or disable malformed-input refusal", "reason": "That would weaken the decoder and lose write destinations."},
    {"option": "Install a second hook registration", "reason": "The existing hook already fires; a second registration does not repair its input adapter."}
  ],
  "reopenWhen": "A valid Copilot patch shape remains refused, an invalid patch is accepted, or a named patch destination bypasses an existing refusal."
}
```

Correction, 2026-09-20: the early executor message called this a bare interactive
session without checking its launch. The checked session log establishes CLI
1.0.86, the initial `claude-sonnet-5` at `xhigh`, and a picker change to
`gpt-6-astra` at `xhigh`; it does not establish launch arguments. No scratch
interactive criterion is discharged by that message.

Before-source baselines on the activation tree: `npm test` passed in 305.84 s
(external wall-clock 306.71 s); `npm run test:machinery` passed in 272.63 s
(external wall-clock 273.16 s). Source: this dispatch's executed runners and
`/usr/bin/time -p`; full logs remain in ignored session scratch. The after-change
delta is not measured yet.

The scoped recovery passed the new freeform-patch fixtures, the selected
WO-135/WO-144 guard fixtures and the existing decoder suite. The rebuilt bundle
was emitted and checked; changed hook bytes carry new immutable runtime pins,
not a second registration. Operator-control readback then reported ordinary
workflow mode. This write is the first freeform patch attempted after restoring
the gates.

## WO-146-D003 - Isolate and bound the probe before choosing a profile

```json
{
  "id": "WO-146-D003",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Add the copilot mode to the existing phase-zero runner. Six scripted model launches compare an untrusted fixture, each registration alone, both together, allow-all and auto. Each has a 30-AI-credit soft cap and a 240-second timeout. One row requests one read-only child with no descendants. Configuration and session state use disposable COPILOT_HOME directories under system temp; native authentication is used without copying credentials. Reserve the observation file before launch, count retained prior launches against twelve, and refuse to overwrite a dated record. Keep operator-only interactive observations and workflow qualification pending, never inferred from the implementing session.",
  "evidence": [
    "scripts/harness-probe.mjs",
    "scripts/lib/copilot-probe.mjs",
    "scripts/fixtures/copilot-probe-hook.mjs",
    "scripts/test-harness-probe.mjs",
    "docs/planning/copilot-cli-integration-2026-09-20.md",
    "copilot help environment and copilot help limits, CLI 1.0.86, 2026-09-20"
  ],
  "rationale": "This serves operator flow, not a critical-path runtime dependency. Policy resistance: observe both registrations before adding one. Commons: seven planned model agents including the one child, against the observed 0/20 budget with unknown unobserved remainder; credit and time bounds are explicit. Drift: require a hook attempt, failed matching tool and absent effect before reporting a denial. Escalation: reuse the existing runner and suite, adding only source selectors rather than a suite or lane. Success to the successful: neither registration is assumed superior. Shifting the burden: automate scripted comparisons and disclose remaining operator observations. Rule beating: no interactive or qualification pass from scripted markers. Wrong goal: a bare workflow the operator can actually use. Naive Interventionism: leave old probe paths and retained records unchanged, keep temporary fixtures reversible, and label missing telemetry. NoOp leaves registration and denial behavior unresolved.",
  "rejected": [
    {"option": "Use the current worktree to probe denials", "reason": "The work order requires scratch effects; real work must be preserved."},
    {"option": "Add a second generated registration before probing", "reason": "Existing hooks demonstrably fire; an extra registration risks duplicate handlers."},
    {"option": "Copy credentials or change personal settings to make a probe run", "reason": "Neither is authorized. Missing authentication is a blocked observation."}
  ],
  "reopenWhen": "Authentication is unavailable in the disposable home, a probe exceeds the bounded branch rules, or the operator supplies different live-testing authority."
}
```

## WO-146-D004 - Correct the probe's misplaced trust state; retain its first six rows

```json
{
  "id": "WO-146-D004",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Preserve P1-P6 and mark their trust selection unestablished. Put trustedFolders in disposable config.json, where the installed CLI stores that runtime state, not in settings.json. Append four bounded trusted comparisons P7-P10 through an explicit one-use correction mode, with the same credit caps and no personal-setting writes. Do not infer Branch C from the first six no-hook rows.",
  "evidence": [
    "docs/discovery/copilot-cli-2026-09-20.json",
    "scripts/lib/copilot-probe.mjs",
    "scripts/test-harness-probe.mjs",
    "CLI 1.0.86 installed help config: trustedFolders; bounded read of only key presence in config.json and settings.json on 2026-09-20",
    "CLI 1.0.86 app.js: repository hook loading consults folderTrustIsTrusted or exact COPILOT_ALLOW_ALL=true"
  ],
  "rationale": "Correction: the executor wrongly treated trust as a preference in settings.json. The checked files put trust in config.json, and all six runs produced zero fixture hooks, so the intended trusted comparison was not established. Four additional model launches plus the one additional read-only child make twelve planned agents across both batches; ten model launches plus the single successful version probe remain below twelve scripted CLI invocations. This corrects the instrument rather than lowering the outcome standard. The D003 goal and eight-lens comparison still apply; the cost of the incorrect first batch is retained rather than hidden.",
  "rejected": [
    {"option": "Call all hooks unavailable and select advisory Branch C now", "reason": "That would promote a misconfigured trust fixture to a claim about the CLI."},
    {"option": "Overwrite the six original rows or repeat the entire batch", "reason": "Preserve observations and use only the four comparisons whose trusted setup was missing; named/default and auto log shapes were already observed."}
  ],
  "reopenWhen": "Correctly placed disposable trust still does not load hooks; inspect the remaining documented trust channel within the remaining bound, and leave unresolved controls untested."
}
```

## WO-146-D005 - Reuse the Claude registration; retain explicit limits

```json
{
  "id": "WO-146-D005",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Select Branch A from corrected P7-P10: the existing Claude-form registration fires, CLAUDE_PROJECT_DIR and COPILOT_PROJECT_DIR match the scratch root, and both JSON refusal and exit-2 refusal stop matching shell effects, including allow-all in P10. Add one contributor profile and deduplicate byte-identical shared outputs; reject conflicting outputs. Keep target-worker derivation at two. Normalize native path fields and freeform patches only in the host decoder, identify hook origin through the observed COPILOT_PROJECT_DIR channel, and use the separately observed shell COPILOT_AGENT_SESSION_ID or a verified explicit id for session readback. Missing tool-call/child identity, read-result ranges, prompt context, stop-message visibility and bare-interactive observations remain explicit limits rather than new infrastructure.",
  "evidence": [
    "docs/discovery/copilot-cli-2026-09-20.json",
    "docs/discovery/copilot-cli-2026-09-20.md#H1",
    "docs/discovery/copilot-cli-2026-09-20.md#H2",
    "docs/discovery/copilot-cli-2026-09-20.md#H3",
    "docs/discovery/copilot-cli-2026-09-20.md#H5",
    "docs/discovery/copilot-cli-2026-09-20.md#H9"
  ],
  "rationale": "The mission is a usable operator-selected third harness, not autonomous workers. Policy resistance: use the registration already firing. Commons and escalation: no further scripted model launches, new suite, gate, plugin or policy copy. Drift: declare event availability separately from delivery and enforcement; an absent marker is not a denial. Success to the successful: preserve Claude/Codex bytes except enumerated shared changes, and keep model identity independent. Shifting the burden: centralize only observed wire adaptation and make missing counters nonblocking. Rule beating: pending operator qualification cannot become implementation-ready. Wrong goal: a bare workflow, not a successful scripted demonstration alone. Naive Interventionism: compare equal generated bytes before sharing them and retain existing fixtures. NoOp leaves the observed path-field gaps and third-harness readback unresolved.",
  "rejected": [
    {"option": "Add the native registration too", "reason": "Both sources fire when installed; Claude-form denial works and the native fixture did not consume Claude-shaped denial JSON."},
    {"option": "Build new child-identity or prompt-delivery machinery", "reason": "The bounded design makes unavailable controls advisory instead of expanding beyond decoder/tool-table adaptation."},
    {"option": "Infer duplicate invocations from a timestamp-only maximum of two", "reason": "Different calls can share a timestamp; P7's Claude-only maximum is one, but the maxima in other rows are ambiguous candidates, not proven duplicates."}
  ],
  "reopenWhen": "Bare interactive observations contradict the scripted branch, a shared-output conflict appears, or a future CLI supplies the missing identities and result ranges."
}
```

Integration checks found two details that constrain D005. The observer and
session handlers differed only in `instructionFile`: Copilot's `AGENTS.md`
symlink is normalized to canonical `CLAUDE.md` inside those shared handlers.
The compiler and installation fixtures then compare their complete bytes,
and the two target-worker definitions compare byte-identical to the saved
pre-profile build.

Counter correction: the first new readback reported 3,008 tokens with a
05:12:16.922Z cutoff. Inspection found only four `model.model_call_success`
events, for utility-model calls, despite much later tool activity. These
counters do not establish the main conversation's total. Their scope is now
`observed-requests-only`, explicitly partial; a complete shutdown envelope
takes precedence when present. The reader then incorrectly left AI credits unknown because it ignored usage
checkpoints. WO-146-D011 below corrects that omission; request token counters
still do not establish a session token total.

## WO-146-D006 - Integrate the operator's merged parallel order without losing active work

```json
{
  "id": "WO-146-D006",
  "date": "2026-09-20",
  "dispatch": "Operator: i merged in a parallel work order; you'll need to update main and integrate changes",
  "decision": "Fetch main and tags; main was already clean and current at 67b4b188. Preserve the active work in the uniquely named stash WO-146 integration before main 67b4b188 20260920T062236Z, and back up ignored intake separately with the canonical backup helper. Fast-forward wo-146 from 37a729ca to 67b4b188, apply the stash by its message-selected object, and regenerate the conflicted harness artifacts and projections. Keep the stash and intake archive. No branch commit, new lifecycle event, review failure or repair dispatch is created. The existing minor classification remains unchanged.",
  "evidence": [
    "37a729ca5871cdc1b477fcd606e67b4d65b5ed9b",
    "67b4b188bb0cdf5afc61bdda94a8cee5fa476c60",
    "docs/product/07-execution-guide.md#Independent workflows and integration",
    "packages/skeleton/src/verification-protocol.ts",
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/test/live-verification-receipt.test.ts",
    "packages/skeleton/test/verification-worktree.test.ts",
    "packages/skeleton/test/verification.test.ts"
  ],
  "rationale": "The new inputs are WO-056's finding-contract schema/prompt agreement, the files-only Codex verifier launch switch, recorded live receipts, publication write-backs and skeleton 0.29.2 metadata. They do not overlap the hand-authored WO-146 changes. The critical path is preserving implementation while incorporating the requested base, not restarting its workflow. Policy resistance and rule beating: use the standing preservation and regeneration route, not a forced reset or a new verification verdict. Commons and escalation: no additional model session or live probe. Drift: compare the saved bytes and run affected checks on the integrated tree. Success to the successful: neither sibling's reviewed work displaces the other's source. Shifting the burden: perform integration here rather than ask the operator to reconcile it. Wrong goal: usable combined work, not merely a clean Git status. Naive Interventionism: only generated conflicts were resolved; NoOp would leave the requested upstream changes absent.",
  "rejected": [
    {"option": "Commit unfinished WO-146 work before merging", "reason": "The order is active and branch commits belong to final review; a retained named stash provides preservation without publication."},
    {"option": "Discard generated conflict sides or the stash without regeneration", "reason": "The source changes must drive the new immutable runtime pins, and recovery material must remain available."},
    {"option": "Reclassify the sibling's version bump as an acceptance defect", "reason": "It is reviewed upstream release metadata. Worker compatibility now compares against the integrated base, carrying its 0.29.2 runtime version forward."}
  ],
  "reopenWhen": "An affected executable check exposes a real interaction, an original source byte is missing, or further upstream changes alter the integration assumptions."
}
```

The integration preserved all 26 non-generated changed paths byte-for-byte.
All 16 conflicts were generated hooks/manifest or generated control/index
surfaces. The ordinary active-phase `next` projection refresh left the
WO-146 control segment byte-identical; it appended no event. The combined
source built, `harness check` accepted 31 generated surfaces, publication
projections remained current, and both staged and unstaged whitespace checks
were clean. The original before-change timing baseline remains the activation
tree; the final delta must name this intervening WO-056 integration rather than
attribute its cost to Copilot alone.

## WO-146-D007 - Prepare operator-only fixtures, without substituting scripted qualification

```json
{
  "id": "WO-146-D007",
  "date": "2026-09-20",
  "dispatch": "resume: next, continued after operator-requested integration",
  "decision": "Extend the existing copilot probe mode with preparation and collection commands. Reserve two bare-interactive probe episodes and up to four qualification episodes plus two retries. The helper never launches Copilot. Qualification copies the emitted bundle, the real lifecycle helpers and a synthetic WO-999 order into an isolated temporary Git repository; it reserves each attempt before the operator launches, plants an import-time defect only after a passing implementation, verifies the explicitly identified session against the scratch root, and retains reduced observations. Fresh verifier identity, actual phase transitions, the planted finding, fixture test outcome and writer release are checked; cross-session memory is not mechanically excluded. Missing operator observations remain pending, not a passing qualification.",
  "evidence": [
    "scripts/lib/copilot-probe.mjs",
    "scripts/lib/copilot-qualification.mjs",
    "scripts/test-harness-probe.mjs",
    "docs/evidence/WO-146/operator-qualification.md",
    "docs/discovery/copilot-cli-2026-09-20.json"
  ],
  "rationale": "The mission and critical path require the operator's actual bare entry rather than a launch wrapper. The explicit agent plan already reserved ten scripted parents and two read-only children; two interactive sessions plus four qualification sessions and at most two retries bring that plan to the cap of twenty. Hook accounting still reports zero observed admissions with an unknown remainder, not a fresh budget. No additional delegated agents or scripted model launches are planned. Policy resistance and rule beating: use the same compiled roles and real lifecycle, with an adverse verification outcome rather than assumed compliance. Commons and escalation: fixed attempt reservations, existing probe runner and existing suite, no live gate. Drift: phase, session-root and fixture checks accompany operator attestations. Success to the successful: model selection remains the operator's and is separate from harness identity. Shifting the burden: the helper prepares and reduces evidence; the operator supplies only observations that cannot be automated faithfully. Wrong goal: qualifying an actual workflow, not a synthetic test labeled live. Naive Interventionism: isolated, reversible fixture effects and no personal-setting writes. NoOp would leave the required operator evidence uncollectable.",
  "rejected": [
    {"option": "Treat the deterministic four-transition fixture as live qualification", "reason": "It proves preparation and collection logic only; it runs no model and supplies synthetic session records."},
    {"option": "Launch Copilot with flags or an environment wrapper for the operator", "reason": "The required workflow is bare copilot with the operator's actual in-session choices."},
    {"option": "Infer trust, permission mode, approval prompts or successful process exit from a requested fixture configuration", "reason": "These remain separately attested or unknown; a session shutdown event is not an observed process exit code."}
  ],
  "reopenWhen": "An operator episode exposes a fixture or integration defect, an identity cannot be verified, the bounded attempts are exhausted, or changed runtime behavior invalidates the recorded subject."
}
```

## WO-146-D008 - Preserve the shared duties and make the measured verifier budget explicit

```json
{
  "id": "WO-146-D008",
  "date": "2026-09-20",
  "dispatch": "resume: next; standing operator direction of 2026-09-17",
  "decision": "Keep the shared Copilot boundary, selected-metadata distinction and explicit-adapter instructions. The installed instruction plus verifier skill measures 21,055 bytes in both roots, 575 above its 20,480 ceiling. Apply product 07's one normal route: set the verifier ceiling to the measured bytes plus one 4,096-byte step, 25,151, with a dated acceptance. Do not trim another rule or add a gate. Clarify the existing harness-no-readback cause to mean missing complete session counters, since observed utility requests are not a session total.",
  "evidence": [
    "docs/control/budgets.json",
    "docs/product/07-execution-guide.md#Discipline",
    "scripts/lib/process-budget.mjs#measureColdStarts",
    "scripts/lib/receipt-cost.mjs",
    "packages/skeleton/src/loadouts/contributor.ts",
    "packages/compiler/src/harness.ts"
  ],
  "rationale": "The mission contribution is honest, usable third-harness operation without losing existing duties. Policy resistance: one shared source, not competing skill text. Commons: publish the exact byte increase and bounded margin. Drift: do not leave a known breach advisory across orders. Escalation: one metric adjustment, no new suite or gate. Success to the successful: identical bodies in both roots rather than a favored harness exception. Shifting the burden: use the standing authorized budget route instead of repeated operator approval. Rule beating: no prose trimming around the threshold or invented complete counters. Wrong goal: complete role procedure rather than the smallest prompt. Naive Interventionism: only the breached ceiling changes. NoOp would violate the standing handling rule.",
  "rejected": [
    {"option": "Cut existing duties to fit 20,480 bytes", "reason": "The standing instruction explicitly prohibits trimming around a breach."},
    {"option": "Raise every role ceiling or impose a new token limit", "reason": "Only the verifier breaches; token and dollar ceilings remain unset."}
  ],
  "reopenWhen": "The final generated bodies change these measurements, another reviewed rule exceeds a ceiling, or a complete Copilot session counter becomes available during an active session."
}
```

Measured against integrated main `67b4b188`, identically in both skill roots:
executor 23,148 bytes (+974), verifier 21,055 (+974), reviewer 22,273 (+974),
release-close 13,969 (+529), planner 15,035 (+529), refuter 15,692 (+529).
The instruction is 6,114 bytes (+326). These are source bytes, not estimated
tokens or task-document context. Capability levels are not promoted by adding
this bounded profile; operator workflow qualification is still pending.

Corrected 2026-09-20 by WO-146-D015 (FINAL-001): these figures were current
when this paragraph was written, and D008's own `reopenWhen` has since fired.
As the order now stands each role body is seven bytes longer and the shared
instruction one byte shorter, a net six bytes per role: executor 23,154,
verifier 21,061, reviewer 22,279, release-close 13,967, planner 15,033,
refuter 15,690, instruction 6,113. The accepted 25,151-byte verifier ceiling is
unaffected and every measured role reads `within`, with 4,090 bytes of verifier
headroom. The dated acceptance in `docs/control/budgets.json` quotes the same
superseded 21,055 measurement and is left as the record of what justified the
ceiling when it was set.

The adapter also keeps the observed absolute `COPILOT_PROJECT_DIR` channel
when a callback's cwd moves away from the root, so native `path` fields still
reach the existing outside-write guard. The new generated-handler regression
covers that case. It changes no root-entry behavior exercised by the prepared
operator fixture; the four older guards retain their existing cwd limit.

## WO-146-D009 - Allow only the worker profiles' release-version metadata to follow the required component bump

```json
{
  "id": "WO-146-D009",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator authorization to allow only runtime.skeletonVersion to change in criterion 4",
  "decision": "Amend criterion 4 to permit only the two target-worker profiles' runtime.skeletonVersion metadata to follow the skeleton release. Keep exactly two workers and require byte equality for every other field. Stage application v0.34.0 above the fetched v0.33.2 baseline, compiler 0.17.0 for the additive third harness id and skeleton 0.30.0 for its contributor adapter and readback. Keep kernel and console behavior and versions unchanged; synchronize internal package pins. No tag, release or branch commit is authorized here.",
  "evidence": [
    "docs/work-orders/WO-146-copilot-cli-harness.md#Acceptance criteria (all required)",
    "packages/skeleton/src/loadouts/contributor.ts#targetWorkerProfiles",
    "packages/skeleton/src/version.ts",
    "packages/compiler/src/artifact-identity.ts",
    "scripts/lib/release-preparation.mjs",
    "docs/product/07-execution-guide.md#Independent workflows and integration"
  ],
  "rationale": "The original literal byte-equality clause conflicted with the required changed-component bump: both workers embed the shared skeleton version. The operator resolved only that conflict, not worker behavior or scope. Mission and critical path: keep release provenance truthful without introducing Copilot workers. Policy resistance: reconcile the conflicting requirements explicitly. Commons and escalation: no extra live session, suite or gate. Drift and rule beating: compare all remaining bytes, not a behavioral proxy. Success to the successful: the same metadata rule applies to both existing workers. Shifting the burden: retain an executable comparison. Wrong goal: compatibility rather than an artificially frozen version label. Naive Interventionism: change the single unavoidable metadata field. NoOp would leave release preparation and literal acceptance mutually unsatisfiable.",
  "rejected": [
    {"option": "Freeze the worker version at 0.29.2 while shipping skeleton 0.30.0", "reason": "That would make the emitted runtime metadata false."},
    {"option": "Treat all worker-profile changes as incidental to release preparation", "reason": "The operator authorized only runtime.skeletonVersion; all other bytes remain constrained."}
  ],
  "reopenWhen": "Any other target-worker field differs, a third worker appears, or a later integration consumes the staged release or component version."
}
```

Additional bounded corrections: the Copilot profile now cites H1 for callback
availability, separately from H6/H7's unobserved message delivery. Explicit
session-id usage also verifies the named Copilot log when the shell has no
Copilot session variable. Regression fixtures cover that path, the planning
actor allowlist with both model families, and an out-of-line CLI version's
nonblocking warning. The prepared operator snapshot predates these changes
and the release metadata; it is not represented as a byte-identical final
runtime.

## WO-146-D010 - Integrate WO-145 and validate the combined deterministic deliverable

```json
{
  "id": "WO-146-D010",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator: main was also updated with a new work order, so integrate these changes please",
  "decision": "Preserve the current staged and unstaged work and ignored intake, fast-forward wo-146 from 67b4b188 to fetched main 19e706ad, reapply the named retained stash, and reconcile generated outputs and additive source changes. Retain the minor release classification and retime unpublished versions if upstream consumed them. Continue deterministic validation; launch no new Copilot probes or sessions and record no implementation-ready transition while interactive acceptance is missing.",
  "evidence": [
    "docs/product/07-execution-guide.md#Independent workflows and integration",
    "docs/evidence/WO-145/implementation.md",
    "packages/skeleton/src/loadouts/executor-supports.ts",
    "scripts/lib/meta.mjs",
    "scripts/test-process-debt.mjs"
  ],
  "rationale": "The contribution is operator flow and recoverable incorporation of reviewed upstream work; this adds no runtime critical-path scope. Policy resistance: combine the existing sources before regeneration. Commons and escalation: no agents, live sessions or new gates. Drift: retain acceptance and run the affected checks. Success to the successful: preserve both orders rather than select one side wholesale. Shifting the burden: handle the requested integration here. Rule beating: retain the uncollected live criteria as incomplete. Wrong goal: validate the combined behavior, not merely a clean merge. Naive Interventionism: preserve stash, ignored intake and byte fingerprints, and resolve only actual overlaps. NoOp would omit the explicitly requested upstream work.",
  "rejected": [
    {
      "option": "Commit unfinished WO-146 before integration",
      "reason": "Branch commits wait for final review; a retained named stash preserves the work."
    },
    {
      "option": "Restart live qualification or infer a pass from synthetic fixtures",
      "reason": "The operator paused new probes and sessions; required live observations are still absent."
    }
  ],
  "reopenWhen": "A source conflict or failing check reveals a behavioral interaction, another worker-profile field changes, or further upstream work consumes the staged versions.",
  "outcome": "Completed on 2026-09-20: integration preserved, both bare probe observations and all four workflow episodes collected, live feedback audit passed, full product and machinery passes and subsequent focused status-prose checks recorded in implementation.md. No remaining implementation follow-up from this decision."
}
```

Integration outcome: `wo-146` now contains fetched main `19e706ad` (WO-145),
with the named `WO-146 integration before main 19e706ad 20260920T0744Z` stash
retained and ignored intake separately archived in session scratch. Twenty
conflicts were generated surfaces or additive README/roadmap/publication
prose. WO-145 source and tests remain present, including its disabled-by-default
economy support; the process-debt suite merged both orders' fixtures. WO-146's
control segment and remaining hand-authored source were preserved. The new
upstream application v0.34.0 / skeleton 0.30.0 consumed the staged targets:
prepare retimed application to v0.35.0 under the same minor classification,
and skeleton is 0.31.0; compiler stays staged at 0.17.0. Both worker profiles
compare equal to a saved build of integrated main after removing only
`runtime.skeletonVersion` (0.30.0 -> 0.31.0).

Correction, 2026-09-20: this continuation treated the historical pause in the
operator's handoff as a new restriction. The operator clarified that it was
prior-session history, not a post-handoff instruction. Ordinary resume authority
continues within the existing episode and launch bounds. The operator explicitly
reported no episodes run yet. No live qualification is inferred.

## WO-146-D011 - Account for observed Copilot AI credits separately from token completeness

```json
{
  "id": "WO-146-D011",
  "date": "2026-09-20",
  "dispatch": "resume: next; validation of the inherited credit-accounting correction",
  "decision": "Keep the checkpoint/shutdown credit projection and reconcile the qualification renderer, security table and product 07 with it. Read the prior parent session through its known scratch-derived session key and exact worktree match; retain only numerical totals, scopes and cutoffs. Do not infer tokens or dollars from AI credits, and do not repeat model work for accounting.",
  "evidence": [
    "packages/skeleton/src/usage-observation.mjs#usageObservation",
    "scripts/test-process-debt.mjs: WO-146 Copilot counters deduplicate requests and do not turn checkpoints into token usage",
    "scripts/lib/copilot-qualification.mjs",
    "Copilot CLI 1.0.86 installed app.js: responseLimitsNanoAiuToAiCredits and credit-limit conversion constant wCe=1e9",
    "Prior WO-146 parent session.shutdown at 2026-09-20T07:42:10.301Z, verified against this worktree"
  ],
  "rationale": "The earlier reader omitted real checkpoint credits while correctly declining to present utility-call tokens as complete. Correctness and operator flow require fixing that separate omission. Policy resistance: reuse the shared reader. Commons: account for completed spend without more model calls. Drift and rule beating: preserve independent counter scopes and timestamps rather than fabricate completeness. Escalation and shifting the burden: no new gate or repeated manual conversion. Success to the successful: accept the supplied counter independently of token availability. Wrong goal: measured spend rather than a successful-looking usage line. Naive Interventionism: additive fields, no changes to existing token arithmetic. NoOp would retain a demonstrated accounting omission.",
  "rejected": [
    {
      "option": "Keep credits unknown whenever complete token counters are absent",
      "reason": "The checkpoint counter independently supplies credits."
    },
    {
      "option": "Convert credit spend into dollars or dispatch-only tokens",
      "reason": "Neither quantity follows from the observed cumulative counter."
    }
  ],
  "reopenWhen": "The CLI changes the credit unit or counter schema, or a fixture shows incorrect cutoff selection or credit-only collection.",
  "outcome": "Completed on 2026-09-20: integration preserved, both bare probe observations and all four workflow episodes collected, live feedback audit passed, full product and machinery passes and subsequent focused status-prose checks recorded in implementation.md. No remaining implementation follow-up from this decision."
}
```

The parent shutdown records **7,128.82367 AI credits** and **28,450,845
tokens**, both session-cumulative at `2026-09-20T07:42:10.301Z`. The earlier
4,971.48-credit checkpoint was a prior cutoff, not the final parent total.
These are the prior Copilot session, not this Codex continuation and not a
claim about all ten scripted probe sessions. Dollars remain unknown.

Additional validation correction, 2026-09-20: valid credits combined with
incomplete shutdown token fields escaped `collectSessionUsage`'s token
validation, then threw in `recordUsageObservation`. A direct reproduction
established the failure; the new existing-suite regression covers credit-only,
empty-token and partially populated shutdown records through collection and
recording. Collection now retains the independently sourced credits while
returning unavailable token fields with `session-token-counters-unavailable`.
The first after-change product run was explicitly stopped after 231.3 s
(external 231.70 s); no passing check was recorded and no gate input was
changed while it ran. Final validation must run on the corrected reader.

The integrated compiler/profile also makes the selected authority, artifact, verification and
feedback editions stale. Generate fresh WO-146 editions and preserve all
historical editions; a changed feedback dependency requires its existing live
read-only audit verifier. This is product evidence, not WO-146's independent
verification or Copilot qualification. The source and tests are the existing
evidence tools; no check, policy or source list is weakened.

Evidence-selection correction, 2026-09-20: the executor selected the new
feedback edition before its required live audit streams existed. The resulting
product run failed two suites (console and skeleton) on missing selected
selfhost records, with 19 suites passing in 250.22 s (external 250.60 s).
Restore the last complete WO-145 feedback selection while WO-146's freshly
generated feedback report awaits its live audit. This preserves the complete
historical source; it does not claim that its stale feedback check passes on
the changed usage reader. Select the new edition only after its complete
streams are recorded and checked. No passing product result is claimed.

The machinery attempt stopped at the stale feedback preflight: eight checks
passed, feedback-evidence failed and seven dependent suites did not execute
(2.99 s runner; 3.35 s external). This is not a passing or equivalent timing
comparison with the 272.63 s activation baseline. The affected harness-probe,
harness-fixtures and process-debt files are therefore run directly for local
regression evidence while fresh audit authorization is pending; these runs do
not substitute for a later complete machinery gate.

## WO-146-D012 - Reconcile the integrated economy fixture with authorized Copilot role prose

```json
{
  "id": "WO-146-D012",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator-authorized integration of updated main",
  "decision": "Preserve WO-145's v0.33.2 role snapshot and verify it against those immutable release files; add a separately named WO-146 snapshot for the authorized shared Copilot clauses. Continue exact hashes for all twelve current default/off roles and keep the explicit-off equality and executor-only equipped-text checks. Do not update or erase the historical baseline.",
  "evidence": [
    "scripts/test-process-debt.mjs: WO-145 optional economy support",
    "packages/skeleton/fixtures/wo145-role-baseline.json",
    "packages/skeleton/fixtures/wo146-role-baseline.json",
    "docs/evidence/WO-146/compatibility.md",
    "docs/work-orders/WO-146-copilot-cli-harness.md#Acceptance criteria (all required)"
  ],
  "rationale": "A targeted run demonstrated that the integrated test compared current authorized Copilot prose against pre-Copilot release bytes. This is a test-subject integration conflict, not a change to economy behavior. The mission contribution is dependable combined behavior and useful operator flow. Policy resistance: judge each snapshot against its subject. Commons and escalation: existing suite, one small fixture, no new gate or model. Drift and rule beating: retain exact assertions for both historical and current bytes. Success to the successful: preserve both orders. Shifting the burden: resolve the requested integration here. Wrong goal: support isolation rather than permanently freezing unrelated prose. Naive Interventionism: only the snapshot selection and its oracle are adapted; NoOp leaves an expected authorized change falsely failing.",
  "rejected": [
    {
      "option": "Overwrite WO-145's fixture with new hashes",
      "reason": "That would erase the historical release oracle."
    },
    {
      "option": "Remove the role hash assertion or skip the test",
      "reason": "Current bytes and support isolation should remain constrained."
    }
  ],
  "reopenWhen": "A generated role changes outside the authorized clauses, default/off diverges, or equipping economy changes another role's instruction text."
}
```

The historical-hash mismatch was reproduced before the change; the revised
fixture passes with both snapshot checks and the original equipment assertions.

The full harness fixture run exposed a second inherited implementation defect:
its new shared recovery sentence named `operator-control.mjs` without `scripts/`.
The existing WO-132 whole-procedure context test interpreted that literal as a
required read and failed with ENOENT. Correct the generation source to
`scripts/operator-control.mjs`, regenerate both roots, and update the current
WO-146 role snapshot. The focused context and economy fixtures both pass after
the correction. Each executor/verifier/reviewer cold-start total increases by
eight bytes: 23,156 / 21,063 / 22,281 respectively; all remain within their
existing ceilings. A new authority revision 001 preserves the earlier generated
edition and records the corrected skill bytes. No parser, guard or threshold
was loosened.

Corrected 2026-09-20 by WO-146-D014 (VER-001 L1): those three totals were
current when this paragraph was written and are two bytes high per role as the
order now stands, because the later status-clause correction recorded in the
D012 continuation below shortened each role body by two bytes. The measured
totals are 23,154 / 21,061 / 22,279.

The selected historical WO-145 feedback streams cannot replay under compiler
0.17.0: focused checks report compiled-policy/persisted-compilation drift. This
confirms that selecting a complete older record is only preservation, not a
passing substitute for the pending new live audit.

Continuation authorization, 2026-09-20: the operator approved "Run the bounded
validation session." Run exactly one existing read-only feedback verifier with
Codex gpt-6-astra / xhigh, an isolated snapshot and the existing transport limit;
no descendants or automatic retry. This is product feedback evidence, not a
WO-146 verification dispatch. Current root observation is zero observed agents,
cap 20, with unobserved coverage unknown. Preserve earlier launch accounting:
allocate this audit from one of the two unused contingency launches, leaving
at most one qualification retry in the combined plan. After a complete audit,
record and select its streams before rerunning both full gates. NoOp retains
demonstrably stale evidence; a synthetic substitute would not meet the existing
live evidence contract. The operator's interactive Copilot work is unchanged.

The authorized audit completed on its first launch in 43.83 s external wall
time. Both acceptance rows were verified; recording and checking the immutable
WO-146 streams passed (ten present passes, ten removal assertion failures,
1,192 fewer matched instruction bytes). Only after those checks was the current
feedback selection changed to WO-146. No additional verifier was launched.

The next product run passed 20 suites and failed the console suite in 254.64 s
(255.20 s external). Its fixture manifest still pinned the preserved WO-145
selfhost streams, which no longer replay under the current compiler. Use the
existing `console-fixtures.mjs --record-current-selfhost` workflow to pin the
already-verified WO-146 streams and regenerate only the selfhost JSON, terminal
and HTML expectations. Historical evidence is unchanged; console source and
assertions are unchanged. All 21 board tests and the complete fixture check
pass after this refresh. This was a missed dependent evidence refresh, not a
reason for another live audit. Full gates will now judge the completed inputs.


Bare observations and accounting correction, 2026-09-20: the operator declined
folder trust with Esc and returned to the terminal (I1, blocked trust-required).
I2 is a worktree-verified bare trusted session with operator-attested allow-all
and no approval prompts; prior permission changes, including /yolo, mean this
is not a default-settings claim. The recorded Claude JSON/exit-2 denials and
native exit-2 refusal have matching failed tools and absent effects; native
JSON denial did not prevent its effect. The log records a model-picker change
from claude-sonnet-5 / xhigh to gpt-5.6-sol / medium. Prompt/Stop markers were
not delivered in assistant output; instruction and skill acknowledgments do
not prove once-only loading. The two interactive rows are now collected.

Live collection exposed two stale helper projections: its renderer always said
interactive observations were pending, and its credit field was hardcoded
null. Reuse the shared reader for a single worktree-matched log only (ambiguous
multi-log input remains unknown), retain credit scope/source/cutoff, and derive
pending text from collected state. Existing probe tests now cover both. I2's
same shutdown supplies 26.69096 session-cumulative credits at
2026-09-20T14:05:17.447Z; the record retains an explicit correction from null,
with the original collected snapshot in ignored scratch. No session was rerun.

Qualification episode 1 passed collection: ready-to-verify, fixture exit 0,
fresh Copilot identity and writer released. The operator observed manual
permissions and approval prompts, with claude-sonnet-5 / xhigh selected. The
shutdown supplies complete accounting; the agent's reported ~165-token latest
readback was not the session total. Episode 2 is reserved, with the defect
planted by the existing helper; it has not yet been collected.


Qualification episode 2 passed its expected-failure collection: a fresh verifier
filed VER-001 against the planted import-time defect, recorded needs-fix and
released its writer. The operator initially observed manual approval mode and
approval prompts, then enabled allow-all mid-session. The qualification record
retains the ordered permission timeline; its single-mode field is unknown
because no one mode describes the whole run. Episode 3 (fixer) is reserved.

Final deterministic outcomes so far: product 21/21 passed in 254.22 s (254.64 s
external), then the isolated probe reporting correction passed its two affected
tests; full machinery including that correction passed 16/16 in 299.71 s
(300.10 s external). Relative to activation: product -51.62 s runner / -52.07 s
external; machinery +27.08 s runner / +26.94 s external. The comparison includes
both upstream integrations, evidence refresh and differing host load; it does
not isolate Copilot's performance impact. No application source changed after
the product pass. The two remaining operator workflow episodes still prevent
implementation-ready.


Qualification episode 3 passed collection: repair-complete returned the fixture
to ready-to-verify, all assertions passed and the writer was released. The
operator reported choosing persistent folder trust and priming the session with
/yolo. Approval-prompt observations remain unknown for this episode. The final
fresh-verifier attempt is reserved.

D012 continuation: the compiled boundary still hardcoded "bare-interactive
qualification remains pending." Replace only that status clause with "WO-146
evidence records interactive qualification." The dated evidence owns changing
qualification status; generated duties remain stable as observations arrive.
This fixes a known stale instruction within criterion 4. Policy resistance,
drift and rule beating favor one truthful status source; commons, escalation,
success-to-the-successful and shifting-the-burden favor no new status machinery;
wrong-goal and Naive Interventionism favor the smallest prose correction. NoOp
would leave a false pending claim after the final episode. Preserve prior
snapshots and evidence editions, refresh generated hashes and run the affected
existing checks. Reopen if the replacement changes behavior or read obligations.
The exact-source feedback contract may require a new live edition; no further
model launch is authorized by this prose correction alone.


Final qualification outcome, 2026-09-20: all four reserved workflow episodes
completed with their expected outcomes, fresh identities and released writers.
The final verifier recorded pass/verified; after exit, its reservation was
absent despite its earlier conversational statement about a live ancestor.
The operator reported no trust prompt after choosing persistent folder trust
in the preceding session, and /yolo enabled for the final session. No agent
changed personal settings. Approval-prompt counts for episodes 3 and 4 remain
unknown, as the work order permits. All four selected and attested actors were
Copilot CLI 1.0.86 / claude-sonnet-5 / xhigh. Cross-session memory isolation,
final review, release close and resident/outward workflows remain unqualified.

The status-clause correction builds and emits successfully; 12 compiler/support
and 13 focused harness/process-debt/context tests pass afterward. Authority
revision 002 records the updated generated text; artifact, verification and
live feedback evidence checks still pass unchanged, so no further model audit
is needed. Both skill roots match and normalized worker fingerprints pass.
The qualification snapshot predates only this neutral status-prose correction;
its role procedure, adapters and hook behavior are unchanged. Final cold starts
are 23,154 / 21,061 / 22,279 / 13,967 / 15,033 / 15,690 bytes for executor,
verifier, reviewer, release-close, planner and refuter respectively; shared
instruction is 6,113 bytes. Existing ceilings are met.

The mission result is the requested third operator harness with the same
compiled procedures and observed limits. Source sharing and the bounded live
workflow support that result. Extra failed full-gate attempts and the missed
console capture refresh were avoidable cost; their timings remain in the
implementation report. The finished source adds no suite, lane, dependency or
resident transport. The four workflow sessions total 196.35181 AI credits and
5,299,696 tokens (including cached input), across 1,088.345 seconds of recorded
session wall time; waiting between sessions is not included. These are sums
of the four distinct verified shutdown observations, not the parent session
or scripted probes. D010/D011's pending implementation follow-ups are closed;
WO-146 independent verification remains its own next dispatch.


Operator cost observation, 2026-09-20: the operator reports the Copilot monthly
meter at **8,000 / 20,000 AI credits used (40%)**, and states WO-146 is the only
work for which Copilot has been used. The operator switched to Codex partway
through resume: next after having Copilot prepare a handoff. Treat the 8,000
as an operator-attested account-level reading attributable to this order under
that stated exclusive workload, not a mechanically reconciled exact session
sum. It includes the earlier Copilot implementation work, not just the four
qualification episodes. Do not add the separately recorded session totals to
it; those observations overlap. Codex usage is separate, and no dollar value
or credit-to-token conversion is inferred. This materially raises the observed
cost of the integration: the implementation consumed 40% of the reported
monthly allowance before independent WO-146 verification. Preserve it for
comparison before another similar integration or model/budget decision; no new
optimization scope or model run is opened by this observation.

## WO-146-D013 - Repair VER-001 N1 by formatting the two files with the pinned Prettier, and report the grouped docs gate

```json
{
  "id": "WO-146-D013",
  "date": "2026-09-20",
  "dispatch": "resume: fix; VER-001 N1",
  "decision": "Run the repository's pinned Prettier over scripts/lib/copilot-probe.mjs and scripts/test-harness-probe.mjs so the format task passes, and record npm run test:docs itself in this order's check set instead of the individual checks it groups.",
  "evidence": [
    "docs/verifications/WO-146/VER-001.md#N1 - the docs gate is red on this order's own files",
    "npx prettier --check on both files: exit 1 before, exit 0 after; prettier 3.9.6 is the package.json pin",
    "npm run test:docs: 13 passed / 6 failed before, 19 passed / 0 failed after",
    "node scripts/test-runner.mjs --machinery --only harness-probe: 2 passed / 0 failed after the rewrite",
    "git diff of the rewrite: four hunks, line-wrapping and trailing commas only"
  ],
  "rationale": "The mission contribution is a truthful evidence claim and an executable one: the red format task suppressed five declared preflight dependants, so plan, plan-refutation-current, console-docs, skeleton-docs and lineage-fixtures never ran on this order's tree. Naive Interventionism is bounded by touching no semantics: the formatter's output is the only change, and the harness-probe suite that executes both files passes afterwards, so behavior is unchanged rather than asserted unchanged. NoOp leaves a standing repository gate red on files this order introduces while the order's own evidence presents its check set as discharged. Drift and rule beating: the fix is the pinned formatter's own output, not a widened ignore list, so the next run of the same gate reproduces it. Commons and escalation: no new gate, suite, dependency or lane; the grouped command already exists. Shifting the burden: the executor, not the reviewer, runs the grouped gate. Policy resistance and wrong goal: the defect was reporting component checks as if they were the gate, so the correction is to the reported check set, not to the gate's contents. Success to the successful: the other probe modes, records and profiles are untouched.",
  "rejected": [
    {
      "option": "Record the red gate as a known limit and leave it for final review",
      "reason": "A standing gate red on this order's own new files is unfinished work, and five checks behind the preflight would stay unexecuted."
    },
    {
      "option": "Hand-wrap the four hunks to preserve the authored line breaks",
      "reason": "The pinned formatter is the oracle; hand-wrapping risks a second disagreement and has no reader benefit."
    },
    {
      "option": "Add the two files to a Prettier ignore list",
      "reason": "That makes the gate green by removing its subject, and would let real style drift into new harness code."
    }
  ],
  "reopenWhen": "npm run test:docs reports a failing format task on this order's files again, or a formatter version change makes the pinned style disagree with the committed bytes."
}
```

Both files are untracked or partly unstaged working-tree sources, as every new
file of this order is; the rewrite is in the working tree the verifier judged.
The four hunks are the `usage` ternary and `renderCopilotProbe`'s two predicates
in `copilot-probe.mjs`, and the credit-source `assert.ok` and the `interactive`
array literal in `scripts/test-harness-probe.mjs`.

## WO-146-D014 - Correction: D012's cold-start figures were superseded two bytes per role by its own continuation

```json
{
  "id": "WO-146-D014",
  "date": "2026-09-20",
  "dispatch": "resume: fix; VER-001 L1, recorded the same day",
  "kind": "correction",
  "decision": "Annotate D012's eight-byte paragraph in place with the measured totals and the reason they moved, and keep the original sentence as the record of what was true when it was written.",
  "misread": "D012's prose stated 23,156 / 21,063 / 22,281 as the executor, verifier and reviewer cold-start totals and was left standing as the order's figures.",
  "meant": "Those totals were correct for the generated edition D012 described; the D012 continuation's later status-clause correction shortened each role body by two bytes, which the final-outcome paragraph already records as 23,154 / 21,061 / 22,279.",
  "changed": "Added a dated correction line under the stale paragraph naming the measured totals and the cause, and recorded this decision. No generated byte, ceiling or fixture changed.",
  "evidence": [
    "docs/verifications/WO-146/VER-001.md#Further limits recorded (L1)",
    "wc -c CLAUDE.md and each .claude/skills/dotln-<role>/SKILL.md: 6,113 + 17,041 / 14,948 / 16,166 = 23,154 / 21,061 / 22,279",
    "docs/evidence/WO-146/decisions.md: the D012 continuation and the final-outcome paragraph",
    "docs/control/budgets.json: the verifier ceiling accepted under WO-146-D008"
  ],
  "rejected": [
    {
      "option": "Rewrite D012's sentence to the current numbers",
      "reason": "It would erase the sequence the record exists to hold, and a silent rewrite is not a correction."
    },
    {
      "option": "Leave it, since the correct totals already appear later in the same file",
      "reason": "A reader of the D012 paragraph would take a superseded figure as the order's, which is the limit the verifier recorded."
    }
  ],
  "reopenWhen": "A role body or the shared instruction changes again, which moves these totals and requires a fresh measurement rather than this one."
}
```

## WO-146-D015 - Correction: D008's cold-start figures and the budget acceptance quote a superseded measurement

```json
{
  "id": "WO-146-D015",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "kind": "correction",
  "decision": "Annotate D008's measurement paragraph in place with the delivered totals and the reason they moved, and leave the dated budgets.json acceptance unedited as the record of what justified the ceiling when it was set.",
  "misread": "D008's paragraph and the reason string of the 2026-09-20 `coldStartBytes.verifier` acceptance both state 21,055 bytes as the verifier cold start, and 23,148 / 22,273 / 13,969 / 15,035 / 15,692 with a 6,114-byte instruction for the other roles. A reader takes those as the order's delivered figures.",
  "meant": "Those totals were correct for the generated edition D008 described. D009's bounded profile corrections and the D012 continuation's status-clause correction together lengthened each role body by seven bytes and shortened the shared instruction by one, so the delivered totals are executor 23,154, verifier 21,061, reviewer 22,279, release-close 13,967, planner 15,033, refuter 15,690 and instruction 6,113.",
  "changed": "Added a dated correction line under D008's stale paragraph naming the delivered totals, the cause and the unaffected ceiling, and recorded this decision. No generated byte, ceiling, acceptance value or fixture changed; `measureColdStarts` reports `within` for every bounded role.",
  "evidence": [
    "scripts/lib/process-budget.mjs measureColdStarts at the reviewed tree: executor 23154, verifier 21061, reviewer 22279, release-close 13967, planner 15033, refuter 15690; verifier ceiling 25151, verdict within",
    "docs/control/budgets.json: the 2026-09-20 coldStartBytes.verifier acceptance reason",
    "docs/evidence/WO-146/decisions.md: the D008 measurement paragraph and its reopenWhen",
    "docs/evidence/WO-146/decisions.md#wo-146-d014: the same correction applied to D012"
  ],
  "rationale": "D008's reopenWhen names exactly this event: the final generated bodies changed the measurement. VER-001 L1 judged the identical staleness in D012 worth a same-day correction rather than a repair episode, and D014 made it; leaving the same drift standing in D008 and unmentioned would apply two standards to one record. Drift to low performance: a superseded figure left as the order's is how a measured budget stops meaning anything. Rule beating: the correction moves no ceiling and trims no duty; the acceptance value is untouched. Escalation and commons: one document paragraph and one decision, no gate, suite or fixture. Naive Interventionism: annotate rather than rewrite, and leave the append-only dated acceptance alone.",
  "rejected": [
    {
      "option": "Rewrite D008's paragraph and the budgets.json acceptance reason to the delivered numbers",
      "reason": "The acceptance is an append-only dated record of what justified the ceiling; a silent rewrite erases the sequence and is not a correction."
    },
    {
      "option": "Leave it as a final-review report sentence, since the ceiling holds",
      "reason": "A defect met and not fixed belongs in this file with its own record, not only in a report the next reader may not open."
    },
    {
      "option": "Raise or re-derive the verifier ceiling from the delivered 21,061",
      "reason": "The accepted 25,151 already admits it with 4,090 bytes of headroom; re-deriving a ceiling that is not breached would spend the operator's standing budget route for nothing."
    }
  ],
  "reopenWhen": "A role body or the shared instruction changes again, which moves these totals and requires a fresh measurement rather than this one, or a measured role reads at or above its ceiling."
}
```
