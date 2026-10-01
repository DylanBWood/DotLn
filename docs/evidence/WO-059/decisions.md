# WO-059 decisions

## WO-059-D001

```json
{
  "id": "WO-059-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Implement a strictly typed, standalone browser-evidence workspace with one exported runScenario. It owns a loopback fixture server, a fresh Playwright browser server and context per run, captures the five WO-058 witness kinds before VerificationOpened, retains raw artifacts and tracing, and saves the scenario for replay. No kernel, compiler or skeleton runtime imports or dependency changes. Record only the browser process and its observed descendants with start-time identities; recovery signals only matching recorded identities after the previous owner has exited.",
  "evidence": [
    "WO-059 Design and criteria 1–9; WO-057 and WO-058 are met in canonical status",
    "docs/discovery/browser-runtime-2026-09-30.json: playwright/playwright-core 1.63.0; chromium-headless-shell revision 1243, version 153.0.8010.12; ffmpeg 1011; equal static screenshot hashes; no recorded process after parent SIGKILL; no-server row removes CODEX_CI, CODEX_SESSION_ID, CODEX_THREAD_ID, CODEX_VERSION",
    "Read compiler verification.ts, skeleton verification-witness.test.ts, verification-worktree.ts prepareWorktreeVerification/witnessTest, the root build and runner, license-surfaces and the cited product/ADR/legal sections",
    "Context7 resolved /microsoft/playwright/v1.63.0; official launchServer/process/close documentation confirms process ownership and graceful termination"
  ],
  "alternatives": ["Owned standalone browser server", "Harness connected server", "Headed browser", "Browser loaded by the verification host", "NoOp"],
  "rejected": [
    {"option": "Harness connected server", "reason": "Does not implement the product-owned standalone port and gives recovery no exclusive ownership."},
    {"option": "Headed browser", "reason": "The observed pin and bounded fixture need only headless execution."},
    {"option": "Verification-host import", "reason": "Violates the explicit unchanged host and closed capsule boundary."},
    {"option": "NoOp", "reason": "Leaves the WO-058 witness contract without a producer and blocks its dependent consumers."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Produce reusable browser witnesses instead of recurring operator walks and enable WO-123's dependent evidence use; the first real UI consumers remain later orders.",
    "traps": {
      "policyResistance": "Use the existing host-prepared subject and WO-058 admission rules rather than a second verdict path.",
      "tragedyOfTheCommons": "One worktree writer. The only planned worker is the order-required read-only live feedback verifier, within observed cap 20; no coding subagents.",
      "driftToLowPerformance": "Missing browser fails the suite and returns unavailable evidence, never a partial passing gate.",
      "escalation": "No additional lifecycle gate or account setting.",
      "successToTheSuccessful": "Use the measured standalone runtime for ownership rather than the connected server's existing investment.",
      "shiftingTheBurden": "Saved scenarios, process records and automatic recovery replace manual capture and cleanup.",
      "ruleBeating": "Actual browser fixtures, console-error refusals and process-table observations judge outcomes.",
      "seekingTheWrongGoal": "The interface and admitted witnesses are the result; generated receipts alone do not establish browser behavior."
    },
    "naiveInterventionism": "Preserve pure consumers, capsule schema, license pins and publication controls. Bound the first port to the checked-in synthetic app, fixed interpreter and declared stable replay fields; keep raw timing/origin details in retained artifacts.",
    "noOp": "No product producer exists; dependent browser verification remains unavailable."
  },
  "reopenWhen": "A real consumer needs target selection or a new scenario action; the pinned browser/host changes; replay fields vary; process ownership cannot be observed."
}
```

## WO-059-D002

```json
{
  "id": "WO-059-D002",
  "kind": "experiment",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep a fresh owned browser per scenario; decline a pooling experiment because it adds shared ownership before the required recovery and replay proof exists.",
  "question": "Would sharing one browser across scenarios lower fixture cost without compromising recovery or replay isolation?",
  "alternatives": [
    "Fresh browser per run",
    "Pool browser and allocate fresh contexts"
  ],
  "rejected": [
    {
      "option": "Pool browser and allocate fresh contexts",
      "reason": "Adds a shared lifetime/recovery owner before any measured economy benefit."
    }
  ],
  "observation": "WO-059 requires a killed host's exact started-process set and independent saved-scenario replay. launchServer exposes one owned child and close promises its termination. A pool adds a separate lifetime and recovery owner. No benchmark has established a saving.",
  "evidence": [
    "WO-059 criteria 3–4; official Playwright 1.63.0 BrowserServer.process and close docs"
  ],
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "cost": {
    "wallSeconds": 0.0003889169999999993,
    "tokens": null,
    "commands": [
      "node .runtime/wo059-record-economy.mjs (review owned-process implementation and record the declined experiment; no pooling probe)"
    ],
    "source": "performance.now in the incremental decline/receipt command, including its source read and first receipt write. Shared entry research is not separably attributable; no pooling work or speedup is claimed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "Fresh browser per run; required focused fixtures, evidence refresh and review gate unchanged"
    ],
    "summary": "No measured economy improvement; keep isolation."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reopenWhen": "Repeated fixture measurements show launch cost dominates and a consumer supplies a pool owner with equivalent recovery evidence.",
  "reason": "The required process ownership/recovery and fresh replay proof precede any measured case for pooling. Keep isolation and decline the pooling probe."
}
```

## WO-059-D003

```json
{
  "id": "WO-059-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.59.0, the next minor above the observed release baseline v0.58.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.58.1 (local tags)",
    "minor classification declared in docs/work-orders/WO-059-playwright-evidence-adapter.md"
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
## WO-059-D004

```json
{
  "id": "WO-059-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Release the new adapter as 0.1.0 and the evidence component-label normalization as a compatible skeleton patch 0.47.1; preserve all other component source versions and exact workspace pins. Pin only playwright 1.63.0 directly in the adapter. Add browser-evidence to evidenceSourceContent's known components so release labels remain bookkeeping while external registry pins remain judged source. Stage the new package before the product gate so its source is part of the tracked code identity; make no branch commit.",
  "evidence": [
    "package-lock.json additions: node_modules/@dotln/browser-evidence workspace link; packages/browser-evidence 0.1.0 with playwright 1.63.0; node_modules/playwright 1.63.0 with its sole playwright-core 1.63.0 registry dependency; node_modules/playwright-core 1.63.0. No optional/transitive additions beyond that tree.",
    "The only other lock changes are skeleton 0.47.0 -> 0.47.1 and the console's exact skeleton pin; kernel, compiler and skeleton dependency names/pins otherwise unchanged; root manifest unchanged",
    "Focused component projection test: browser release changes normalize; playwright pin changes still change manifest and lock evidence",
    "release check-surfaces --local passes: application v0.59.0 above v0.58.1; skeleton changed and bumped, adapter's first version 0.1.0; new untracked sources are explicitly advisory until staged",
    "scripts/test-runner.mjs expand admits *.test.js only: register the concrete browser scenario.test.mjs file rather than widen the runner's glob interpreter",
    "license-surfaces: all workspace guards and three hashes pass, including the adapter's publish dry-run refusal; runtime-inventory.json records installed browser/notice hashes",
    "Product 03 at entry: 173569 UTF-8 bytes against 176132 ceiling, 2563 bytes headroom; the Ports addition stays below WO-059's 400-byte bound. Publication locks were refreshed by check-publication --print-locks and publication:check passes."
  ],
  "alternatives": ["Normalize the sixth workspace and patch skeleton", "Leave the new workspace release label in behavioral evidence", "Add a dependency to a pure consumer", "Edit NOTICE", "NoOp"],
  "rejected": [
    {"option": "Leave the new workspace release label", "reason": "Would make ordinary component retiming stale behavior evidence, unlike the five existing components."},
    {"option": "Consumer dependency", "reason": "The package supplies structural plain data; the compiler/host fixture admits the outputs without any runtime import."},
    {"option": "Edit NOTICE", "reason": "The pinned text names no dependency; inventory belongs in LEGAL until actual built/bundled distribution."},
    {"option": "NoOp", "reason": "Does not discharge release, dependency inventory or current evidence obligations."}
  ],
  "reopenWhen": "The external dependency or workspace dependency shape changes, a new package becomes a browser consumer, the byte ceiling cannot fit an authorized write-back, or built/bundled artifacts are distributed."
}
```

## WO-059-D005

```json
{
  "id": "WO-059-D005",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "misread": "The first integration fixture supplied an empty baseline to VerificationOpened. The nested missing-browser suite inherited NODE_TEST_CONTEXT and exited zero without being an independent runner. The initial declined-experiment receipt omitted fields required by the repository's durable decision schema, so release preparation refused before assignment.",
  "meant": "An observed baseline, an independently executed missing-browser runner, and a schema-valid receipt must establish the required claims.",
  "changed": "Execute the baseline before candidate capture, strip the two test-runner context variables in the nested gate fixture, and fill the required declined-experiment and correction fields. Leave all existing gates and admission rules intact.",
  "decision": "Correct those fixture and record inputs without weakening the reactor, runner, release gate or missing-browser requirement.",
  "evidence": [
    "First focused run: 4 failures, all from reactor baseline witness coverage; requestFor now supplies an independently executed synthetic-base run before the candidate capture",
    "Second focused run: nested missing-browser runner status 0; standalone node --test with the same empty browser cache status 1 and install command",
    "Context7 /nodejs/node official test-runner source/test example says strip NODE_TEST_CONTEXT and NODE_TEST_WORKER_ID for an independent child runner; both are now removed for that fixture only",
    "scripts/lib/meta.mjs checkExperiment requires a declined reason, rejected choices and nonempty command/source observations. The decline receipt now carries them; measured incremental source-read/recording cost is recorded, shared entry research remains unallocated",
    "A later command incorrectly assumed every evidence writer takes edition/revision flags. artifact-identity-evidence.mjs and verification-evidence.mjs read only current.json and refused those arguments with no files written. Read their actual mode/selection code, select WO-059 revision 001 in current.json, and rerun with --write alone. Authority and feedback writers accept the flags and had already recorded their new immutable editions.",
    "Current focused suite: 11 passed, zero failed, 12028.8385 ms; fixtures.json has ten passing behavioral rows. Parent SIGKILL leaves no recorded host/browser pid after recovery; unrelated sentinel remains alive. Runtime source uses fresh process identity checks and rejects disconnected ownership records."
  ],
  "alternatives": ["Correct the test setup and receipt", "Relax baseline coverage", "Accept skipped browser proof", "NoOp"],
  "rejected": [
    {"option": "Relax baseline coverage", "reason": "The existing contract was correctly refusing an invalid fixture."},
    {"option": "Accept skipped browser proof", "reason": "Would claim a missing-browser gate failure the nested runner did not execute."},
    {"option": "NoOp", "reason": "Leaves required evidence or release assignment invalid."}
  ],
  "reopenWhen": "A Node runtime changes nested-runner behavior, a criterion needs a different baseline scenario, or the durable decision schema changes."
}
```

## WO-059-D006

```json
{
  "id": "WO-059-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Select immutable WO-059 revision 001 authority, artifact-identity, verification and feedback editions; refresh the installed harness deterministically. Run one read-only live feedback self-host verifier after the final lock/source edit on Codex gpt-6.1-sol at max, then record the witnessed episode and repin the console.",
  "evidence": [
    "WO-059 Cost and criterion 8; package-lock.json, root tsconfig.json and evidence-editions.mjs are registered sources; scripts/test-runner.mjs also belongs to runner/registration evidence",
    "harness emit: 31 generated surfaces; authority --write: 34 comparisons; feedback --write: ten passing regressions and ten removal failures, 1192 fewer matched instruction bytes",
    "Artifact/verification writers select current.json; all four selections now name WO-059 revision 001, preserving historical WO-058 bytes",
    "Current session readback: codex-cli 0.159.2, gpt-6.1-sol, effort max, codex-session-readback; planned worker is the order-required live read-only verifier; observed remaining cap 20 and explicit planned fan-out one with no coding subagents",
    "All lockfile, package/source, runner and release edits precede the live launch. Browser fixtures currently pass 11/11; source and test output reviewed before launch."
  ],
  "alternatives": ["One current-source live episode", "Carry the prior live edition", "Run a fake verifier", "NoOp"],
  "rejected": [
    {"option": "Carry prior live edition", "reason": "External lock dependency and root build-reference changes alter judged source; a carry does not establish current behavior."},
    {"option": "Fake verifier", "reason": "Meets deterministic fixtures only, not the explicit live self-host criterion."},
    {"option": "NoOp", "reason": "Leaves the selected source editions stale."}
  ],
  "reopenWhen": "Another judged-source or lock change occurs, the live episode fails, or its configuration does not match the order."
}
```

## WO-059-D007

```json
{
  "id": "WO-059-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Record the completed live feedback episode into feedback-001 and repin the console self-host case. Preserve an observed console error as outcome fail even when another capture is unavailable, so every returned payload remains admissible under WO-058's rule. Run the required review and document gates on the settled tracked source.",
  "evidence": [
    ".runtime/wo059-feedback-001/verifier/events.jsonl: one WorkerAttemptStarted, codex-cli-exec 0.159.2, gpt-6.1-sol, effort max; host-launch selection, effective model/effort unknown; completed CommandResult with AC-causal-fixtures and AC-context both pass",
    "feedback-evidence --record-selfhost: projected 86856 of 2286710 bytes, retaining package-lock.json/skeleton manifest/compiler identity pins; current-source --check passes with ten positive regressions and ten removal failures",
    "console-fixtures --record-current-selfhost records JSON, terminal and HTML from WO-059 feedback-001",
    "Code review found the console-error plus capture-overflow combination would initially label a console error unavailable. Compiler verification.ts requires fail for any console error; set adverse console outcome first and add a seven-navigation error-page case",
    "FEEDBACK_SOURCE_PATHS readback: no packages/browser-evidence source entries, lockfile is judged. The only post-live runtime correction is in the new adapter and its test, leaving the live audit's 51-source subject unchanged; feedback --check confirms it",
    "Current focused suite: 12 passed, zero failed, 13140.307333 ms; fixtures.json has eleven passing behavioral rows. The combined unavailable/error case decodes and refuses a pass; no captured evidence in it passes",
    "Current deterministic checks pass: harness 31 surfaces, authority 34 comparisons, four artifact files with frozen oracle unchanged, four verification files with defect/repair/staleness/replay",
    "Product 03 measured against HEAD: +279 bytes, current 173848, ceiling 176132, remaining headroom 2284; both publication locks current; git diff --check clean"
  ],
  "configuration": {
    "harness": "codex-cli",
    "harnessVersion": "0.159.2",
    "model": "gpt-6.1-sol",
    "effort": "max",
    "source": "host-launch",
    "effectiveModel": "unknown",
    "effectiveEffort": "unknown",
    "store": ".runtime/wo059-feedback-001",
    "edition": "docs/evidence/WO-059/feedback-001",
    "attempts": 1,
    "scope": "Read-only feedback audit, not independent WO-059 verification; Codex dollar cap is a declaration, not an observed enforced cap"
  },
  "alternatives": ["Preserve the adverse console witness and current audit", "Downgrade an observed error to unavailable", "Rerun the unchanged live subject", "NoOp"],
  "rejected": [
    {"option": "Downgrade error", "reason": "Produces a payload the closed WO-058 contract correctly refuses."},
    {"option": "Rerun unchanged live subject", "reason": "Costs another episode without changing the judged source or resolving a remaining claim."},
    {"option": "NoOp", "reason": "Leaves the mixed adverse/unavailable output invalid or the witnessed current edition unrecorded."}
  ],
  "goalAlignment": "The port now produces usable admitted evidence rather than operator narrative. Rule beating and low-performance drift are checked by missing-browser, console, mixed-outcome and process fixtures. Commons and escalation favor one live subject audit and the two required final gates. Existing consumers and authority remain unchanged; fresh ownership and saved scenarios remove recurring intervention. Other trap comparisons remain D001's: no changed authority or consumer. NoOp would leave invalid mixed evidence; Naive Interventionism limits this correction to the producer and a public synthetic case.",
  "reopenWhen": "Any judged source/pin changes again, the final gates fail, or a consumer needs evidence outside the declared fixture and replay fields."
}
```

## WO-059-D008

```json
{
  "id": "WO-059-D008",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "misread": "The new browser suite's outside-confinement declaration was added without updating the runner's exact environmental inventory fixture. The first review gate failed that fixture.",
  "meant": "Keep the exact inventory test and add the newly observed browser/loopback cause rather than weakening the outside-only check.",
  "changed": "Add browser-evidence at its actual suite position in the expected inventory and document the loopback network denial cause. Stop the already failed gate through harness evidence --stop before editing source; rerun the focused inventory fixture and the complete required review gate.",
  "decision": "Complete the suite registration's integration check within the order's existing scope, preserve the failed/stopped run, and retain the unchanged current-source feedback audit.",
  "evidence": [
    "First npm test -- --review: runner-fixtures test 47, WO-140 exact outside-only inventory, was its one failing case; 56 of its 57 cases passed. Other in-flight suites were stopped before source changes, not judged failures of their implementation.",
    "Canonical gate-stop response: active [], no check recorded; elapsed stopped gate 366.4 seconds. No passing gate is claimed from it.",
    "WO-057's native profile and boundary control deny loopback network; this suite opens a product-owned fixture HTTP server and browser-server connection, unlike pure contract fixtures.",
    "evidenceSources readback: scripts/test-runner.test.mjs and scripts/test-runner.mjs are absent from the authority/artifact/verification/feedback/harness edition source lists; FEEDBACK_SOURCE_PATHS also excludes both. No new lock or judged-source edit; no extra live audit is needed."
  ],
  "alternatives": ["Extend the exact fixture for the new environmental cause", "Remove the test", "Attempt the loopback suite inside native network denial", "NoOp"],
  "rejected": [
    {"option": "Remove test", "reason": "Would weaken the existing classification guarantee to hide an introduced registration omission."},
    {"option": "Run inside network denial", "reason": "Does not test the product-owned local app/browser transport."},
    {"option": "NoOp", "reason": "Leaves the order's required review gate red."}
  ],
  "reopenWhen": "A browser runner becomes executable under an observed confinement profile with the required loopback/process access, or another outside-only suite is introduced."
}
```

## WO-059-D009

```json
{
  "id": "WO-059-D009",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "misread": "The capability write-back was inserted before the historical evidence boundary under an executor-observation heading. The first document gate refused it as an existing capability source change. The initial chat description incorrectly called this an edited row; the checked diff shows a newly inserted section, with historical rows unchanged.",
  "meant": "Preserve the whole historical prefix and append the dated evidence.browser observation in the admitted execution-update format.",
  "changed": "Move only the new section to the end under WO-059 dated addition (2026-09-30), preserving its observation and the earlier table bytes. Record this correction, refresh the decisions index and run the planning checks and document gate again.",
  "decision": "Repair the authorized capability-table write-back rather than create a new planning judgment or relax its current-subject check.",
  "evidence": [
    "First npm run test:docs: 22 suites passed, two failed (plan and plan-refutation-current), 39.40 seconds; both refusals name existing capability source changed. No passing document gate is claimed from that run.",
    "scripts/lib/plan-continuation.mjs reassessments requires the prior table as an exact prefix and appended headings WO-NNN dated addition or reassessment with a valid date, reviewed order and nonempty capability observation.",
    "scripts/test-plan-refutation.mjs WO-135 dated additions are execution updates checks both accepted headings and unchanged refusal behavior; prior WO-117 dated addition supplies the local format.",
    "git diff of capability-table.md shows only the new evidence.browser section; no existing row was rewritten. Adapter source, lockfile and live-feedback subject remain unchanged."
  ],
  "alternatives": ["Append the authorized dated observation", "Rejudge the planning subject", "Weaken the historical-prefix check", "NoOp"],
  "rejected": [
    {"option": "Rejudge planning subject", "reason": "The check already admits bounded execution additions, so another planning/refutation episode adds no needed evidence."},
    {"option": "Weaken prefix check", "reason": "Would conceal an incorrectly placed write-back and weaken preservation of historical assessments."},
    {"option": "NoOp", "reason": "Leaves criterion 7's write-back inadmissible and criterion 9's document gate red."}
  ],
  "reopenWhen": "The dated addition still fails an actual check, the existing assessment must change, or new evidence broadens the capability scope."
}
```

## WO-059-D010

```json
{
  "id": "WO-059-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Hand off the complete bounded adapter with all nine criteria met on executed evidence. Keep independent verification, final review and publication as separate dispatches. Preserve both failed/stopped gate records and their corrections rather than infer passes from them.",
  "evidence": [
    "Final focused browser run: 12 tests passed, zero failed, 13140.307333 ms; fixtures.json retains eleven passing behavioral transcripts. The full review browser suite also passed in 14354 ms.",
    "npm test -- --review: 38 suites passed, zero failed, 396723 ms, 82 fresh tasks; executed host row recorded 2026-09-30T23:20:54.669Z with codeIdentity 11230c1fe5b285e1b8ca62197179bc76ee0e00b9204380c57292ef3563269f56, matching the current tracked source including the staged new package.",
    "Repaired npm run test:docs: 24 suites passed, zero failed, 36523 ms; plan and plan-refutation-current admit the appended dated evidence.browser addition. Completion checks the final document surface inline.",
    "D008 records the first 366.4-second stopped review and inventory-fixture repair. D009 records the first 39.40-second document run and capability-section placement correction. Neither is a passing gate.",
    "Current edition checks pass after one completed live self-host verifier; no post-live lock/judged-source change. Root actor readback remains codex-cli 0.159.2 gpt-6.1-sol max; the CLI worker's selected values are host-launch observations, not effective readback.",
    "Product 03 adds 279 bytes and remains 2284 bytes below its ceiling; publication locks current; local release v0.59.0 and unchanged publication guards pass. Adjacent queue revision 0 has no items. Current authored output and rendered screenshot reviewed; final usage source/scope/cutoff observed in ignored receipts and the response."
  ],
  "alternatives": ["Hand off the admitted synthetic producer", "Add a real target or verification-host dependency now", "Repeat the unchanged live audit or passing review", "NoOp"],
  "rejected": [
    {"option": "Real target or host dependency", "reason": "Exceeds the order's explicit synthetic fixture and unchanged closed consumer boundary; actual UI consumers are later orders."},
    {"option": "Repeat unchanged audit/review", "reason": "Equivalent recorded subject and current-source checks already pass; further repetition supplies no missing criterion and adds work/waiting."},
    {"option": "NoOp", "reason": "Would leave a proved implementation unrecorded and its dependent evidence use unable to advance."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A caller can now produce and replay real browser observations for the existing WO-058 contract, replacing manual synthetic-app walks and enabling WO-123's dependent slice. Real UI value remains behind the later consumer orders.",
    "traps": {
      "policyResistance": "The existing closed admission rules judge the captured witnesses; console errors and unavailable captures cannot pass.",
      "tragedyOfTheCommons": "One coding writer and one required read-only live CLI verifier; no coding fan-out. Private process ownership and unrelated-process controls preserve the shared host.",
      "driftToLowPerformance": "The absent pinned browser makes the package suite fail; all five captures and normal cleanup execute in the passing gate.",
      "escalation": "No new lifecycle gate, account setting or publication action; only the required review/document checks and their necessary corrections.",
      "successToTheSuccessful": "Standalone observed ownership, not reuse of a connected harness browser, decides the runtime boundary; no unmeasured pooling saving is claimed.",
      "shiftingTheBurden": "Saved scenarios, captured artifacts, automatic cleanup and identity-checked recovery replace recurring manual reproduction.",
      "ruleBeating": "Actual compiler/reactor admission, refusal controls and process-table observations determine outcomes; failed gate attempts are retained.",
      "seekingTheWrongGoal": "The reusable port and passing behavioral evidence are the outcome; editions and release text support it rather than stand in for it."
    },
    "naiveInterventionism": "Limit claims to the synthetic fixture, observed browser/host and declared replay fields; keep kernel/compiler/verification-host runtime boundaries and pinned legal text intact.",
    "noOp": "Would preserve the absence of a browser producer or leave its completed handoff outstanding."
  },
  "outcome": "The bounded producer is implemented and every required criterion has current executed evidence; external verification and real-target use are not claimed. Fresh browser isolation is kept without a measured economy adoption.",
  "reopenWhen": "Independent verification finds a criterion defect, a registered source/pin changes, or a later consumer requires a real target, new action, broader replay field or different process/host behavior."
}
```

## WO-059-D011

```json
{
  "id": "WO-059-D011",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: fix",
  "misread": "The original missing-browser fixture treated naming the install command as sufficient even though the suite selects a different cache from the bare command. The original criterion 6 handoff overclaimed an actionable remedy.",
  "meant": "The printed command must install into the browser cache the failing process selected; default-environment callers must retain Playwright's default-cache instruction.",
  "changed": "Preserve the suite's isolated .runtime/playwright default and make the adapter's command carry its effective explicit cache selection, resolving relative paths and shell-quoting the value. Add a fresh-worktree regression with no supplied browser-path variable, compare its printed command and README command through the pinned CLI's dry-run, retain default-caller coverage, and exercise a custom cache containing shell characters.",
  "decision": "Repair F1 within the existing standalone package and its documentation/tests. Preserve the original immutable verification and implementation evidence, and file new repair observations before replacing the current handoff.",
  "evidence": [
    "VER-001 F1: the suite sets PLAYWRIGHT_BROWSERS_PATH to <repo>/.runtime/playwright, while the bare install command selects the platform default; following that command leaves the suite failing",
    "Read src/index.ts, scenario.test.mjs and package README: the command is currently a constant; the missing-browser case supplies a path and checks command text without its destination",
    "Context7 /microsoft/playwright/v1.63.0 browser-cache documentation; installed pinned coreBundle.js confirms explicit/npx config selection, 0 for hermetic installation, and relative resolution against INIT_CWD or cwd",
    "evidenceSources(process.cwd()) contains none of the three repair paths in authority, artifact-identity, verification, feedback or harness; FEEDBACK_SOURCE_PATHS likewise excludes them. No lockfile change is planned, so the existing current-source live episode can be retained if its check passes",
    "Existing experiment D002 declined browser pooling; repair reuses that decision and starts no second experiment. Adjacent queue revision 0 is empty. Codex dispatch readback is 0.159.3, gpt-6.1-sol, max; one writer, zero subagents"
  ],
  "alternatives": [
    "Print the effective cache in the remedy and preserve isolated suite installation",
    "Remove the suite override and use the shared user cache",
    "Prefix only the suite's assertion text",
    "NoOp"
  ],
  "rejected": [
    {"option": "Shared user cache", "reason": "Would move the already documented per-worktree installation and shared-host writes; matching the command fixes the defect without changing ownership."},
    {"option": "Suite-only assertion", "reason": "Leaves explicitly configured runScenario callers with the same wrong destination and duplicates remedy logic."},
    {"option": "NoOp", "reason": "Preserves criterion 6's failed setup loop and recurring operator intervention."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Make the selected browser producer usable in a fresh worktree without an operator correcting its setup instructions, enabling WO-123's dependent evidence slice.",
    "traps": {
      "policyResistance": "The remedy preserves the cache selected by existing suite and caller policy.",
      "tragedyOfTheCommons": "One writer, no subagents, no new download or shared cache requirement; retain an unchanged judged-source live episode only after its current-source check.",
      "driftToLowPerformance": "Missing browser still fails the suite and produces unavailable evidence; require the remedy's observed destination rather than its text alone.",
      "escalation": "No new gate or setup layer; use the pinned CLI's dry-run and the two existing required gates.",
      "successToTheSuccessful": "Compare both cache strategies on ownership and actual destinations rather than retain the prior constant because it already passed assertions.",
      "shiftingTheBurden": "The printed command carries the correct cache instead of requiring users to diagnose environment selection.",
      "ruleBeating": "The fresh-copy fixture removes the path variable before launching the actual suite and executes the printed command as shell code with --dry-run.",
      "seekingTheWrongGoal": "Judge setup recovery and unchanged witness production, not merely a command-string match."
    },
    "naiveInterventionism": "Keep browser ownership, dependencies, consumers and publication controls; change only remedy construction and its executable coverage. Shell quoting and default-caller checks bound second-order harm.",
    "noOp": "The recorded verification remains failed and every fresh worktree receives a remedy for the wrong location."
  },
  "reopenWhen": "The pinned runtime's cache resolution changes, the printed command's observed destination differs from launch, or the repaired product/document/current-source checks fail."
}
```

## WO-059-D012

```json
{
  "id": "WO-059-D012",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: fix",
  "misread": "The fresh-worktree regression assumed the lexical temporary directory was the suite module's root. The first focused run used a repository-local output directory and did not expose macOS's /var to /private/var alias.",
  "meant": "Compare the install destination against the actual canonical root Node uses for the copied suite, including the product gate's default OS temporary directory.",
  "changed": "Canonicalize the newly created fixture root before constructing its copied suite, launch cwd, expected cache and public transcript placeholders. Keep the unset browser-path environment and CLI destination assertion.",
  "decision": "Correct the fixture's path identity without changing the working runtime remedy or relaxing its destination comparison.",
  "evidence": [
    "First repair review: 36 suites passed, 2 failed, 418.61 seconds, 82 fresh tasks; no passing review claimed",
    "browser-evidence failed only fresh-worktree-install-remedy: the retained child reason names /private/var/.../fresh worktree/.runtime/playwright, while the expected path used /var/...; realpathSync confirms these are the same created directory",
    "runner-fixtures independently failed its code-identity fixture's rmSync with ENOTEMPTY; retained .git metadata and adjacent-0001 preserve that separate diagnosis",
    "Original 14-test focused run and its repair-001-fixtures.json are preserved as pre-correction observations, not evidence for the final test identity"
  ],
  "alternatives": ["Canonicalize the fixture root", "Always force repository-local test output", "Remove the destination assertion", "NoOp"],
  "rejected": [
    {"option": "Force local output", "reason": "Would hide the default temporary-directory case the product gate actually runs."},
    {"option": "Remove assertion", "reason": "Would weaken the executable F1 remediation proof."},
    {"option": "NoOp", "reason": "Leaves the required review red on an incorrect comparison."}
  ],
  "goalAlignment": "D011's mission and eight trap comparisons remain current. Rule beating requires the gate's actual default temp environment; shifting the burden and low-performance drift favor fixing the comparison over restricting how tests run. Naive Interventionism bounds the change to the new fixture; NoOp retains a false failure.",
  "reopenWhen": "The copied suite's root or CLI destination differs after canonicalization, or another default-environment gate exposes an untested setup dependency."
}
```

## WO-059-D013

```json
{
  "id": "WO-059-D013",
  "date": "2026-09-30",
  "dispatch": "resume: fix; adjacent-0001",
  "decision": "Apply the existing fixture-local maintenance.auto=false precedent to the code-identity fixture after init. Retain its commits, cross-process/revision assertions and strict cleanup. The adjacent queue records this one bounded repair in scripts/test-runner.test.mjs and requires the focused test plus the full review gate.",
  "evidence": [
    "First repair review runner-fixtures case 46: ENOTEMPTY at finally rmSync after both commits; all its code-identity assertions preceded cleanup",
    "Preserved failed scratch repository contains only .git/info/refs and .git/objects/info/packs, showing metadata remained after recursive deletion",
    "The same test file's confinementFixture and WO-157 teardown probe document Git 2.55 detached automatic maintenance recreating Git metadata and already disable maintenance locally; that is the inferred writer in this failure, whose producer was not traced",
    "Context7 /nodejs/node fs.rmSync docs confirm bounded retries can cover ENOTEMPTY but retain a possible concurrent writer; preventing the known irrelevant producer is the established local option",
    "No worktree or account Git setting changes: the configuration is written only inside the test's newly initialized temporary repository",
    "Adjacent queue revision 2 records the actual intent announcement against adjacent-0001 revision 1; no coding subagents or additional economy experiment"
  ],
  "alternatives": ["Prevent fixture-only automatic maintenance", "Retry recursive deletion", "Ignore cleanup errors", "Retry the gate without a fix", "NoOp"],
  "rejected": [
    {"option": "Retry deletion", "reason": "Retains the irrelevant detached writer; the existing fixture precedent removes that producer directly."},
    {"option": "Ignore errors", "reason": "Would hide leaked fixture state and weaken the strict cleanup assertion."},
    {"option": "Retry gate unchanged", "reason": "A lucky cleanup would leave the diagnosed race in later gate sessions."},
    {"option": "NoOp", "reason": "Leaves the selected required review failed on an encountered bounded defect."}
  ],
  "goalAlignment": "D011's mission and critical-path contribution remain current. Policy resistance and shifting the burden favor a fixture that owns its lifetime; commons and escalation favor one local configuration over repeated failed gates; low-performance drift and rule beating preserve all code-identity and cleanup checks. Success to the successful is judged against retries by the already reproduced maintenance fixture, and seeking the wrong goal keeps production Git/code-identity behavior untouched. Naive Interventionism limits the change to an isolated fixture; NoOp retains the teardown race.",
  "reopenWhen": "The focused or full gate still reports a cleanup race, a trace contradicts the maintenance inference, or the fixture gains an actual maintenance behavior to test."
}
```

## WO-059-D014

```json
{
  "id": "WO-059-D014",
  "date": "2026-09-30",
  "dispatch": "resume: fix",
  "decision": "Hand off the repaired cache-aware setup remedy and completed adjacent fixture repair with current evidence for all nine criteria. Retain VER-001, the original implementation observations and the first failed repair review. Record repair-complete with the actual current-session attestation; independent verification remains a separate dispatch.",
  "evidence": [
    "repair-002-fixtures.json: thirteen passing behavioral transcripts from the fourteen-test browser suite in the second full review, captured 2026-10-01T00:25:57.371Z. The actual copied suite with no supplied browser-path variable fails for its empty default cache; its printed command and the README command select identical CLI dry-run destinations. The custom quoted-cache and default-caller controls also pass.",
    "repair-002-gate-records.json: npm test -- --review passed 38 suites, zero failed, 408760 ms and 82 fresh tasks at codeIdentity a40d6c240ee962c5fff303e6f9cc69a5774bb9e8e437f2f6c051eaf2cb97d515, recorded 2026-10-01T00:26:38.057Z. The document gate passed 24 suites, zero failed, 36370 ms, recorded 2026-10-01T00:30:00.147Z; completion checks final document bytes inline.",
    "The same record preserves the first failed repair review at its own identity: 36 passed, two failed, 418607 ms. D012 fixes the temporary-root alias comparison; D013 prevents fixture-local automatic maintenance. Neither failed gate nor repair-001-fixtures.json is claimed as current passing product evidence.",
    "Focused code-identity cleanup test: one passed, zero failed, 616.853125 ms; 635 Git TRACE2 events with zero maintenance child launches. The failed run's producer was not traced, so its maintenance diagnosis remains an inference. Adjacent queue revision 5 marks adjacent-0001 completed with both required checks and no queued/running item.",
    "Current process-table observation at 2026-10-01T00:34:58.331Z contains zero chrome-headless-shell commands. The kill fixture preserves its recorded host/browser set, empty after-set and live unrelated sentinel; native browser cleanup already exited the children and recovery signalled none.",
    "None of the four repair paths is a registered edition or feedback source; no repair lock/pin change. The current-source edition/harness/feedback checks passed in both required gates, so retain immutable WO-059 revision 001 editions and D006/D007's one completed live feedback episode. Its effective model/effort remain unknown.",
    "Publication check and git diff --check pass. The already prepared local application release remains v0.59.0, adapter 0.1.0 and skeleton 0.47.1. The current root is codex-cli 0.159.3, gpt-6.1-sol, max, codex-session-readback. One writable agent, no repair subagents and no second economy experiment."
  ],
  "alternatives": ["Record the complete bounded repair", "Repeat the unchanged live audit or successful product gate", "Broaden setup into another installation layer", "NoOp"],
  "rejected": [
    {"option": "Repeat unchanged checks", "reason": "Current-source and executed product evidence already hold; repetition adds work and waiting without an unresolved claim."},
    {"option": "Another installation layer", "reason": "The pinned runtime and existing suite already own cache selection; carrying that selection in the command resolves F1 without another owner."},
    {"option": "NoOp", "reason": "Leaves the authorized repair completion outstanding despite the corrected and checked behavior."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Fresh-worktree setup now points to the cache the producer uses, removing recurring diagnosis from the dependent browser-evidence path. Synthetic production, replay and safe cleanup remain the bounded outcome.",
    "traps": {
      "policyResistance": "Preserve explicit/default cache policy and the existing closed witness admission rules.",
      "tragedyOfTheCommons": "One writer, no repair fan-out or downloads, fixture-local Git configuration and observed browser cleanup bound shared-host effects.",
      "driftToLowPerformance": "The missing browser still fails the real suite; CLI destinations and all witness fixtures execute in the passing review.",
      "escalation": "D012/D013 repair encountered gate defects within their bounds; stop after the required gates and final document check.",
      "successToTheSuccessful": "Observed cache destinations replace the prior string-only assurance; D002's declined pooling decision remains without an invented saving.",
      "shiftingTheBurden": "The remedy carries its own cache and the temporary Git fixture owns its teardown; users need no manual environment or cleanup diagnosis.",
      "ruleBeating": "Retain unavailable/adverse evidence, strict cleanup assertions, the first failed gate and the lexical-root correction; record only current executed passes.",
      "seekingTheWrongGoal": "Usable setup and unchanged behavioral witnesses decide the outcome; generated editions and release bookkeeping support those observations."
    },
    "naiveInterventionism": "No new consumer, runtime dependency, publication action or shared configuration. Bound claims to the pinned dry-run destination proof and the observed synthetic/POSIX behavior.",
    "noOp": "Retains an unfinished lifecycle repair and blocks the separate verifier from judging the corrected subject."
  },
  "outcome": "F1's setup destination is corrected and covered by the actual default suite, with all nine executor criteria supported by current evidence. The adjacent item is complete. No new browser download, independent verification, real-target proof or economy saving is claimed.",
  "reopenWhen": "Independent verification finds a criterion defect, cache selection or a registered source/pin changes, or the fixture-local cleanup assumption is contradicted."
}
```

## WO-059-D015

<!-- integration refs/dotln/checkpoint/WO-059/10 -->

```json
{
  "id": "WO-059-D015",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-059",
  "decision": "Integrate fetched main 2210dd87 (WO-175, v0.58.2) into the uncommitted WO-059 subject based on 60eeecdc, preserving checkpoint 10 and the named stash. Resolve docs/evidence/current.json to WO-059's selection and the console fixture manifest to WO-059's pin, keeping both capture sentences. Retime skeleton 0.47.1 to 0.47.2 under D004's compatible-patch classification, because v0.58.2 already published 0.47.1 with WO-175's protocol change; re-pin the console's exact skeleton dependency and the lockfile's two workspace entries. Keep application v0.59.0. Carry the authority, artifact-identity and verification editions WO-059/001, which pass on the integrated tree; the feedback edition is re-minted by D016.",
  "evidence": [
    "refs/dotln/checkpoint/WO-059/10",
    "base 60eeecdccc3f3717da492a7416435d2227639bc5",
    "upstream 2210dd87c5b017edcf144980e5657b1349e6a53b",
    "release preparation: WO-059 target v0.59.0 remains current. Files changed: docs/evidence/WO-059/meta.json, docs/final-reviews/WO-059/PR.md. Meter snapshot: docs/evidence/WO-059/meta.json, 4107 bytes. Tag observation: local snapshot only.",
    "Authored conflicts: current.json (main selected WO-175/001 for all four editions, WO-059 selected WO-059/001) and packages/console/fixtures/manifest.json (both re-pinned the self-host case); main's manifest change is confined to the conflicted hunks, so WO-059's side plus WO-175's capture sentence loses no main byte",
    "package-lock.json, packages/skeleton/package.json and packages/console/package.json merged without conflict because both sides made the identical 0.47.0 -> 0.47.1 edit; git show v0.58.2:packages/skeleton/package.json reads 0.47.1 and v0.58.2 is an ancestor of 2210dd87",
    "npm run release -- check-surfaces --local after the retime: skeleton src changed, observed 0.47.2, previous v0.58.2 0.47.1, PASS; console -> skeleton workspace pin 0.47.2 PASS; browser-evidence first-version baseline 0.1.0 PASS; release block v0.59.0 above latest local tag v0.58.2 PASS",
    "git diff 2210dd87 -- package-lock.json after the retime: only the node_modules/@dotln/browser-evidence link, packages/browser-evidence 0.1.0, playwright 1.63.0, playwright-core 1.63.0 and the two skeleton 0.47.2 entries",
    "Edition checks on the integrated tree with WO-059/001 selected: authority-evidence --check (34 bundle comparisons), artifact-identity-evidence --check and verification-evidence --check exit 0; feedback-evidence --check exits 1, stale on packages/skeleton/src/entropy-review-protocol.ts; with --edition WO-175 --revision 001 it is stale on .feedback-source/package-lock.json",
    "git diff refs/dotln/checkpoint/WO-059/7 (VER-002's subject) is empty for packages/browser-evidence, evidence-editions.mjs, tsconfig.json, LEGAL.md, product 03, README.md and scripts/test-runner.test.mjs; scripts/test-runner.mjs differs only by main's two planning-conditions.mjs machinery-source lines"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep skeleton 0.47.1 because the merge was clean",
      "reason": "v0.58.2 published 0.47.1 without WO-059's evidence-editions.mjs change, so one version would name two sources; a collision is retimed under the recorded classification (product 07 §Independent workflows and integration)."
    },
    {
      "option": "Select main's WO-175 editions",
      "reason": "Its feedback audit predates WO-059's playwright registry entries, which the feedback projection judges; the three deterministic WO-059/001 editions already pass on the integrated tree."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-01. Original base: `60eeecdccc3f3717da492a7416435d2227639bc5`.
Fetched main: `2210dd87c5b017edcf144980e5657b1349e6a53b`. Checkpoint: `refs/dotln/checkpoint/WO-059/10`.
Named stash retained: `27b28dd0e881f03a51bc855134c55cefb242c580` (WO-059 integrate 2026-10-01).
Resolved projections: README.md, docs/control/current.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md, packages/console/fixtures/expected/selfhost.html, packages/console/fixtures/expected/selfhost.json, packages/console/fixtures/expected/selfhost.txt.
Release preparation: WO-059 target v0.59.0 remains current. Files changed: docs/evidence/WO-059/meta.json, docs/final-reviews/WO-059/PR.md. Meter snapshot: docs/evidence/WO-059/meta.json, 4107 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's criteria 1–7 and 9 rest on package source, fixtures, tests and write-backs that are byte-identical to its checkpoint 7 subject; main changed no compiler, verification-protocol or browser-evidence file, and the browser-evidence suite passed again in the integrated gate. Criterion 8 is re-established on the integrated tree by D016 (feedback revision 002 from a fresh live episode) and by the three deterministic editions passing as they are. Criterion 9's gates were re-run on the integrated tree and are recorded in FINAL-001. Earlier reports keep their original subjects.
Authored conflicts observed: docs/evidence/current.json, packages/console/fixtures/manifest.json.
Affected checks executed on the integrated tree: npm test -- --review (38 passed, 0 failed, 401.22 s, 82 fresh, code identity 5224924043eb843bb9213f25b50fb242a9e8413ff7549d52d9f205d77733a61e), npm run publication:check, node scripts/harness.mjs check and npm run release -- check-surfaces --local; each exit 0.

## WO-059-D016

```json
{
  "id": "WO-059-D016",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Re-mint the feedback edition inside this review as WO-059 revision 002 from one live self-host episode on Claude Code claude-opus-5-5 at xhigh, select it in docs/evidence/current.json and re-pin the console's self-host case. Keep authority, artifact-identity and verification at WO-059/001, which pass on the integrated tree. Route nothing to repair: no code changed after VER-002, and the new report differs from revision 001 only in its audited subject hash.",
  "evidence": [
    "Before any write: feedback-evidence --check on the integrated tree failed for both candidates. WO-059/001 is stale on packages/skeleton/src/entropy-review-protocol.ts (main's WO-175); WO-175/001 is stale on .feedback-source/package-lock.json (WO-059's playwright entries). Neither live audit judged the combined source.",
    "Why it is stale, shown before the live run: feedback-evidence --write --edition WO-059 --revision 002 (2.47 s) produced a feedback.json whose contractVersion, policyHash, fixtures, context, maturityMethod and maturity equal revision 001 byte for byte; only subject moved (sha256:b2d15624... to sha256:e91fe603...). Behavior is unchanged, and the identity-only difference cannot be carried because the live log binds the subject.",
    "Executed 2026-10-01T01:08:27Z: DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit --store .runtime/feedback-audit-wo059-r002 --transport claude-cli-print --model claude-opus-5-5 --effort xhigh; exit 0 in 39.41 s including the build; phase complete, 10 fixtures, 1192 saved instruction bytes.",
    "Verifier stream: one WorkerAttemptStarted (claude-cli-print, harnessVersion 2.1.286, model claude-opus-5-5, effort xhigh, selectionSource host-launch, effectiveModel and effectiveEffort unknown, limits 600000 ms and USD 5.00); WorkerCompleted with AC-causal-fixtures and AC-context both pass. The store exposes no token or dollar counter, so the episode's cost is unknown.",
    "feedback-evidence --record-selfhost .runtime/feedback-audit-wo059-r002 --edition WO-059 --revision 002: 68730 of 2272463 verifier bytes committed by reference, pins snapshot of package-lock.json, packages/skeleton/package.json and packages/compiler/src/artifact-identity.ts. feedback-evidence --check: Live feedback audit docs/evidence/WO-059/feedback-002 judged the current source.",
    "console-fixtures --record-current-selfhost recorded JSON, terminal and HTML for the selfhost case; console-fixtures --check matches refutations and missing. The manifest's capture keeps the WO-175 and WO-059/feedback-001 sentences and appends feedback-002.",
    "Precedent: docs/evidence/WO-147/decisions.md#wo-147-d010 and the WO-047 and WO-135 final reviews re-minted stale editions on the integrated tree once each staleness was shown to be identity-only. Criterion 8 names Claude Code claude-opus-5-5 at xhigh as an admitted configuration.",
    "Re-mint wall time, for WO-175-D012's follow-up: deterministic editions 0 s (carried, checks only), feedback --write 2.47 s, live audit 39.41 s; recording and the console re-pin were not timed."
  ],
  "alternatives": ["Re-mint feedback in this review with a live episode", "Fail the review so an executor re-mints under resume: fix", "Carry an older live audit", "NoOp"],
  "rejected": [
    {"option": "Fail the review into repair", "reason": "Three dispatches and another product gate for a regenerated evidence record over unchanged code; product 07 keeps integration bookkeeping out of repair and failed FINAL records."},
    {"option": "Carry an older live audit", "reason": "--carry refuses a changed judged source, and both older audits judged a different subject; bypassing that check would let a source change inherit an audit it never had."},
    {"option": "NoOp", "reason": "Leaves the feedback-evidence suite red on the integrated tree, so no passing gate could key the published state."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The merged tree must carry evidence that judged its own feedback inputs before WO-059 can merge and WO-123 build on it; a re-mint here keeps that on one dispatch.",
    "traps": {
      "policyResistance": "Uses the existing stale-edition check and record command; no check is relaxed.",
      "tragedyOfTheCommons": "One live episode under its fixed 600 s and USD 5 caps; no subagent spent on it.",
      "driftToLowPerformance": "Staleness was diagnosed field by field before the episode, not assumed identity-only.",
      "escalation": "No new gate or lifecycle step; the existing product gate keys the result.",
      "successToTheSuccessful": "Neither branch's newer audit is preferred by recency; each was checked and both refused.",
      "shiftingTheBurden": "The review owns its integration evidence instead of returning it to the executor.",
      "ruleBeating": "The episode judged the current subject; its two criteria were read from the verifier stream, not the exit code.",
      "seekingTheWrongGoal": "The goal is a current-source audit, not a green check; a carry would have been the wrong goal."
    },
    "naiveInterventionism": "Only evidence, selection and console pins change; no source, gate or check is edited.",
    "noOp": "A red feedback-evidence suite blocks publication."
  },
  "reopenWhen": "A later integration changes a judged feedback source again, the re-minted edition's check fails, or an independent reader finds the live episode's subject differs from the committed tree."
}
```

## WO-059-D017 — final review finding: recovery can SIGKILL a process the adapter did not start

```json
{
  "id": "WO-059-D017",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 on criterion 3 and return the finding to repair. recover() in packages/browser-evidence/src/processes.ts checks root ownership only when the record lists processes. A record with browserPid N and processes [] passes validation; observeOwned then has no recorded root identity, walks from N over the current process table, adopts whatever process now holds pid N with its descendants, and the kill loop SIGKILLs them because their just-observed identities match. runScenario writes exactly that record when its first observation after launchServer misses the browser (index.ts sets browserPid, then recordNow saves whatever observeOwned found), and it stays on disk with closed false if the host is killed before the finally block. Criterion 3 requires that a process the adapter did not start is outside the set.",
  "evidence": [
    "Reviewer reproduction with the worktree's built packages/browser-evidence/dist/src/processes.js: the host spawned /bin/sleep 300 (parent = the host, not the recorded owner), wrote {schemaVersion 1, owner: an identity matching no process, browserPid: <sleep pid>, processes: [], closed: false} and called recover(). It returned signalled [<sleep pid>], the sleep exited with SIGKILL, and the record was rewritten with the sleep as its only process and closed true.",
    "A read-only review subagent found the defect from checkpoint 9 and reproduced it the same way; this review confirmed it independently and did not rely on that run.",
    "processes.ts:105-117: the ownership condition `record.processes.length && (!root || root.parentPid !== record.owner.pid || owned.size !== record.processes.length)` is skipped for an empty list; processes.ts:35-50 observeOwned seeds `known` from browserPid whenever no root identity is recorded.",
    "index.ts:341-348: browserPid is assigned from browserServer.process().pid before any identity is observed, and the first recordNow() persists the record whatever observeOwned found; the 250 ms ticks keep seeding from browserPid until a root is recorded.",
    "No committed fixture reaches the kill path: fixtures.json, repair-001-fixtures.json and repair-002-fixtures.json all record recoverySignalledPids []. VER-001's reaper-probe recorded a real root and child, so it never presented an empty list. The trigger needs the browser to exit before its first observation, a host kill before close, and pid reuse before recovery: narrow, but the effect is SIGKILL of an arbitrary process.",
    "Final product gate on the integrated tree passed (38 suites, 0 failed) because no case reaches this state; the finding is a reproduced violation of the criterion's invariant, not a red gate."
  ],
  "alternatives": [
    "Fail with the reproduced finding and route it through repair and fresh verification",
    "Pass and board the defect as a follow-up",
    "Write the guard during review and certify it"
  ],
  "rejected": [
    {"option": "Pass and board it", "reason": "Criterion 3 states the invariant that recovery never acts on a process the adapter did not start, and the README promises recovery 'signals only matching identities in its browser set'. A reproduced path to SIGKILL an unrelated process contradicts both; the low probability does not bound the harm."},
    {"option": "Write the guard during review", "reason": "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it."}
  ],
  "followup": "WO-059 resume: fix — make recover() refuse, or signal nothing from, a record that sets browserPid without a recorded root identity, and stop observeOwned from adopting the current holder of browserPid when no root identity was recorded (during the run as well as in recovery). Add a regression that writes the empty-process record over a live unrelated child and asserts it stays alive and unsignalled, plus a case that reaches the kill path with a recorded surviving process, so recoverySignalledPids is non-empty at least once. D018's minor items may be fixed in the same repair within its bound. Run the browser-evidence suite and npm test -- --review before requesting a fresh verification; processes.ts and index.ts are not registered edition or feedback sources, so no re-mint is expected unless the lockfile changes.",
  "goalAlignment": {
    "missionAndCriticalPath": "Browser evidence must be safe to run on an operator's host before WO-123 depends on it; killing an unrelated process is the failure the start-time identities exist to prevent.",
    "traps": {
      "policyResistance": "Uses the existing repair and verification route; no new gate.",
      "tragedyOfTheCommons": "The host process table is shared; recovery must not take from it what it did not start.",
      "driftToLowPerformance": "Two passing verifications and a green gate do not lower the bar for a reproduced safety violation.",
      "escalation": "One bounded finding with a one-guard remedy, not a redesign of recovery.",
      "successToTheSuccessful": "The green fixtures are not credited with a path they never exercised.",
      "shiftingTheBurden": "The fix belongs in the adapter, not in a caller's discipline about when to call recover.",
      "ruleBeating": "The fixture's empty after-set passed because Chromium exited by itself; the kill path was never judged.",
      "seekingTheWrongGoal": "The goal is a recovery that cannot harm a bystander, not a passing SIGKILL fixture."
    },
    "naiveInterventionism": "The remedy is a guard and two regressions in the package; the witness, replay and admission code stays as verified.",
    "noOp": "Publishing would ship a recovery that can SIGKILL an arbitrary process after pid reuse."
  },
  "reopenWhen": "A repaired subject refuses or ignores the empty-process record, a regression shows the bystander alive, the kill path is exercised at least once, and a fresh verification judges criterion 3 on that subject."
}
```

## WO-059-D018 — final review: minor adapter defects recorded for the repair or a follow-up

```json
{
  "id": "WO-059-D018",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Record five minor defects met in review and not fixed here. None alone fails a criterion as the fixtures define it. D017's repair may fix any of them within its bound; any left must be named in that repair's decisions.",
  "evidence": [
    "Owner identity drifts with environment: processTable runs ps with LC_ALL=C but inherits TZ, and lstart prints local time. Checked here: TZ=UTC and TZ=America/New_York print 'Thu Oct  1 01:20:14 2026' and 'Wed Sep 30 21:20:14 2026' for the same pid. Recovery under a different TZ matches nothing, signals nothing and still marks the record closed. The subagent also observed comm following process.title, so a live owner that renames itself is treated as exited.",
    "A failed console.assert is not a console error: index.ts:399-407 maps every console type outside debug/log/info/warn/error/warning to log; Playwright 1.63's ConsoleMessage.type() includes 'assert' (node_modules/playwright-core/types/types.d.ts:20660). A page whose only console problem is a failed assertion yields a passing console witness. Whether Chromium presents it at error level was not checked here.",
    "The console witness shares its entries array with the live listener (index.ts:538-542); a message arriving during tracing.stop or context.close would change the returned entries after contentHash and console.json were written. No fixture emits one.",
    "Test gaps (subagent, confirmed by reading test/scenario.test.mjs): the SIGKILL case never asserts a non-empty recoveredPids, and its unrelated sentinel is never in a recorded tree, so it cannot test the never-signal property; the post-run sample cannot tell self-exit from recovery.",
    "Every launchServer failure, including a timeout or a sandbox denial, is reported as a missing browser with the install command (index.ts:333-339). The result stays unavailable with no pass; only the remedy text can be wrong."
  ],
  "alternatives": ["Record them for the repair or a follow-up", "Fail on each", "Leave them only in the report"],
  "rejected": [
    {"option": "Fail on each", "reason": "Each is outside what criteria 2, 3 and 6 judge through their fixtures, or is a test-coverage gap; D017 already returns the order to repair."},
    {"option": "Leave them only in the report", "reason": "A defect met and not fixed needs a structured follow-up so the register carries it."}
  ],
  "followup": "WO-059 resume: fix, within D017's bound where cheap, otherwise planner, low priority: run ps with TZ=UTC and identify the owner by something process.title cannot change; map Playwright's 'assert' console type to error; snapshot console entries at capture time; make the SIGKILL fixture reach the kill path and place its sentinel where a faulty recovery could reach it; give non-missing launch failures their own reason.",
  "goalAlignment": "Mission: evidence a verifier can trust and a recovery that cannot misfire. Rule beating and drift to low performance argue for recording the coverage gaps rather than counting green cases. Escalation and Naive Interventionism keep these out of the failure itself. NoOp would leave them with no owner.",
  "reopenWhen": "The repair fixes or names each item, or a consumer meets one of them in use."
}
```

## WO-059-D019 — final review finding: Receipt 036's known issue has no recorded disposition

```json
{
  "id": "WO-059-D019",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Record that the executor left Receipt 036's criterion-6 known issue without a disposition, and route the record to D017's repair. The behavior the receipt asks for holds: a missing browser yields distinct unavailable witnesses and a failing suite, never a silent pass or a skip. What is missing is the recorded disposition the catalog row asks the executor for, and the weighing of one consequence the repair made concrete: the suite's cache is the ignored per-worktree .runtime/playwright, so every new worktree's npm test fails in browser-evidence until that worktree runs the printed install command.",
  "evidence": [
    "docs/planning/work-order-map.md, WO-059's row: 'Receipt 036 known issue (2026-09-30): ... the executor records the missing-browser outcome as a distinct unavailable verdict or a documented skip, never a silent pass, and reopens the design if a gate fails only there.'",
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md, WO-059 finding criterion:6, known-issue; reopenWhen: an order's npm test -- --review fails only in the browser-evidence suite because the browser is missing, or a Codex or resident-launched verification cannot run the gate for that reason.",
    "grep of docs/evidence/WO-059/decisions.md and handoff.md finds no mention of Receipt 036 or its known issue; D011 chose the per-worktree cache over the shared user cache.",
    "scripts/test-runner.mjs registers browser-evidence as a fast product package suite with needs OUTSIDE_CONFINEMENT, so plain npm test runs it on every order and a confined resident verification cannot.",
    "Operator-review assumption 2 in the order accepts that a gate session installs the pinned browser before npm test and refuses a partial check; the reopening condition had not occurred in this order's gates, all of which ran with the browser installed."
  ],
  "alternatives": ["Route the disposition to the repair", "Write the disposition in this review", "Leave it to the planner"],
  "rejected": [
    {"option": "Write it in this review", "reason": "The duty is the executor's on the catalog row, and the repair is already due; a reviewer-authored disposition would also judge itself."},
    {"option": "Leave it to the planner", "reason": "The row assigns it to this order's executor, and the repair is the next dispatch that can record it at no extra lifecycle cost."}
  ],
  "followup": "WO-059 resume: fix — record Receipt 036's known issue in the order's decisions: the chosen missing-browser behavior (unavailable witnesses and a failing suite, no skip), the per-worktree cache's cost to every later order's first gate in a new worktree, and whether that is accepted under operator-review assumption 2 or answered by a shared cache or a worktree setup step; keep the receipt's reopening condition.",
  "goalAlignment": "Mission: later orders must not trip over the adapter's install step unknowingly. Shifting the burden is the trap the receipt names: the install becomes every gate session's step. Rule beating: green gates on this worktree say nothing about a fresh one. Naive Interventionism keeps this to a record, not a redesign; NoOp leaves the receipt's duty undischarged.",
  "reopenWhen": "The repair's decisions record the disposition, or an order's gate fails only in browser-evidence for a missing browser."
}
```

## WO-059-D020

```json
{
  "id": "WO-059-D020",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "misread": "FINAL-001's Goal-aligned judgment says 'The SIGKILL fixture passed in five runs'. No source supports a count of five; the fixture ran in the executor's focused runs and gates, both verifications' standalone runs and gates, and this review's gate.",
  "meant": "The SIGKILL fixture passed in every recorded run, and the three committed transcripts (fixtures.json, repair-001-fixtures.json, repair-002-fixtures.json) each record recoverySignalledPids [].",
  "changed": "This record states the correction. FINAL-001 stays as filed, because its bytes are bound by the recorded FinalReviewCompleted event; the verdict and D017's evidence do not depend on the count.",
  "decision": "Correct the unsupported count in the record rather than edit a filed report.",
  "evidence": [
    "docs/evidence/WO-059/fixtures.json, repair-001-fixtures.json and repair-002-fixtures.json: host-sigkill-recovery rows with recoverySignalledPids []",
    "VER-001 and VER-002 criterion 3 judgments and this review's gate row each include a passing host-sigkill-recovery case"
  ],
  "alternatives": ["Record the correction", "Edit the filed report", "Leave it uncorrected"],
  "rejected": [
    {"option": "Edit the filed report", "reason": "A filed report's bytes are bound by its control event; reports are never edited."},
    {"option": "Leave it uncorrected", "reason": "An invented count must be corrected the same day."}
  ],
  "reopenWhen": "Another unsupported figure is found in FINAL-001."
}
```

## WO-059-D021 — repair the recorded-root ownership invariant

```json
{
  "id": "WO-059-D021",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 F1",
  "decision": "Capture the launched browser's root identity once, with the launching owner as its observed parent. Observe descendants only from that recorded, still-matching root. Refuse recovery when browserPid has no recorded root, and retain the closed recorded-tree validation before signals. Add a bystander regression and a real surviving root/child recovery that must signal both processes.",
  "evidence": [
    "FINAL-001 F1 and D017 reproduce adoption and SIGKILL of an unrelated PID from processes: [].",
    "processes.ts observeOwned seeds an unrecorded browserPid; recover guards the root check with processes.length.",
    "index.ts currently calls observeOwned as its first root observation and again on 250 ms ticks.",
    "The existing host-sigkill-recovery transcripts show recoverySignalledPids [], so they do not establish the signal path."
  ],
  "alternatives": ["Require a captured root at launch and recovery", "Guard recovery alone", "Signal nothing in every recovery", "NoOp"],
  "rejected": [
    {"option": "Guard recovery alone", "reason": "The interval could still adopt a reused unrecorded PID during the run; the finding names both paths."},
    {"option": "Signal nothing in every recovery", "reason": "Leaves a recorded surviving browser tree behind and fails the recovery obligation."},
    {"option": "NoOp", "reason": "Retains a reproduced path to killing a bystander on the operator's shared host."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Make gate F's witness producer safe for WO-123's source-to-deliverable continuation before independent verification.",
    "traps": {
      "policyResistance": "Use the existing repair route and ownership schema; no guard is weakened.",
      "tragedyOfTheCommons": "Only the recorded owned tree may consume host process slots or receive signals.",
      "driftToLowPerformance": "Require an unsignalled bystander and a non-empty successful recovery, beyond a green self-exiting-browser fixture.",
      "escalation": "Bound changes to the adapter and its fixtures, with the existing two required gates.",
      "successToTheSuccessful": "Retain fresh browser ownership for its isolation, not for the old green evidence.",
      "shiftingTheBurden": "Put ownership checks in the adapter rather than requiring callers to inspect PID reuse.",
      "ruleBeating": "The new surviving-process fixture must exercise SIGKILL, not infer recovery from native self-exit.",
      "seekingTheWrongGoal": "Judge safe recovery and admitted witnesses rather than check counts."
    },
    "naiveInterventionism": "Preserve the existing browser/context/server lifetime and witness contract; the smallest useful probe is a real local owned process tree plus a reachable bystander PID.",
    "noOp": "Leaves criterion 3 unmet and blocks WO-123."
  },
  "reopenWhen": "A new fixture or independent verification shows any adoption without a recorded root, any bystander signal, or an owned surviving process after successful recovery."
}
```

## WO-059-D022 — close D018's bounded defects in adjacent-0002

```json
{
  "id": "WO-059-D022",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 D018; adjacent-0002",
  "decision": "Fix the four remaining bounded D018 defects in the adapter: ps uses TZ=UTC; a live owner's PID and start time suffice even after its command changes; failed console.assert maps to error; console witness entries are copied at capture time; only the pinned missing-executable launch error receives install advice. D021's passing bystander and surviving-tree regressions close the fifth item, the test gap.",
  "evidence": [
    "D018's source diagnosis and checked timezone observation; processTable currently inherits TZ, and recover matches the owner's mutable command.",
    "Context7 /microsoft/playwright/v1.63.0 ConsoleMessage.type documentation retrieved on 2026-10-01 lists assert separately from error: https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/api/class-consolemessage.md.",
    "index.ts console-capture entries alias the live listener array after the hash and console.json are written.",
    "Pinned playwright-core lib/coreBundle.js throws Executable doesn't exist at <path> for its missing runtime executable; index.ts currently discards every launch exception.",
    ".runtime/wo059-repair003-primary.log: both D021 regressions pass; the surviving owned root and child reach the signal path.",
    ".runtime/wo059-repair003-browser.log: all 19 browser suite cases pass in 17.36 s, including real title change and UTC/New York environment comparison, failed console.assert, an injected late real-browser console event and two non-missing launch-failure doubles."
  ],
  "alternatives": ["Fix the bounded defects together", "Defer the four defects", "Use mutable command identity for the owner", "Detach listeners instead of snapshotting", "Recommend install for every launch error"],
  "rejected": [
    {"option": "Defer the four defects", "reason": "Each has a small local fix in the selected package with shared checks; no new dependency or consumer contract is needed."},
    {"option": "Use mutable command identity for the owner", "reason": "A running owner can rename itself, so this can falsely admit recovery."},
    {"option": "Detach listeners instead of snapshotting", "reason": "Trace retention and close still run; copying the bounded data fixes hash drift without changing listener lifetime."},
    {"option": "Recommend install for every launch error", "reason": "Installing does not remedy a timeout or sandbox denial. Keep unavailable evidence with a generic launch-failure reason and do not publish raw host diagnostics."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Make gate F's recovered ownership and hashed evidence dependable for WO-123.",
    "applicableTraps": "Tragedy of the commons protects a living host from recovery; rule beating requires real rename/timezone, console.assert and late-message regressions; drift to low performance retains adverse/unavailable outcomes; shifting the burden gives callers accurate diagnostics.",
    "remainingTraps": "Policy resistance, escalation, success to the successful and seeking the wrong goal are bounded by reusing the selected adapter, contract and checks, with no new gate or privileged consumer.",
    "naiveInterventionism": "Owner liveness alone ignores the mutable command; browser kill identities retain their command check. Console copies are at most 100 entries and preserve current payload shapes.",
    "noOp": "Leaves recorded small defects in the producer even though their local repair is within authority."
  },
  "reopenWhen": "A consumer or independent verification observes identity drift, a failed assertion supporting a pass, post-capture hash drift or misleading install advice."
}
```

## WO-059-D023 — Receipt 036 missing-browser disposition

```json
{
  "id": "WO-059-D023",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 D019",
  "decision": "Accept the current missing-browser behavior under WO-059 operator-review assumption 2: unavailable witnesses, no passing evidence and a failing package suite that prints the cache-scoped install command. Retain the per-worktree cache and the README's explicit setup step. Record Receipt 036's recurring setup cost and its reopening condition; do not silently skip browser checks or redesign the gate in this repair.",
  "evidence": [
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md WO-059 criterion:6 known-issue and the work-order-map row assign this disposition to the executor.",
    "WO-059 criterion 6 requires a failing suite when the browser is absent; assumption 2 accepts installing the pinned browser before the gate.",
    "scenario.test.mjs selects .runtime/playwright by default; fresh-worktree-install-remedy launches the copied suite without an override and proves the README command selects that cache.",
    "The suite is a fast product package suite with OUTSIDE_CONFINEMENT in scripts/test-runner.mjs; a confined resident gate is not established by this worktree's successful run."
  ],
  "alternatives": ["Keep explicit per-worktree setup", "Share a user browser cache", "Automatically install at worktree setup or gate entry", "Make missing browser a passing skip/advisory now"],
  "rejected": [
    {"option": "Share a user browser cache", "reason": "Adds a shared external mutable runtime and lifecycle policy beyond this repair; existing cache-scoped setup has executed evidence."},
    {"option": "Automatically install at worktree setup or gate entry", "reason": "Would add implicit network/download effects to unrelated worktree or test commands without offline/confinement evidence."},
    {"option": "Make missing browser a passing skip/advisory now", "reason": "Contradicts criterion 6 and would normalize an unexecuted browser check as a green product gate."}
  ],
  "cost": "A fresh worktree without an explicit available cache needs the documented browser installation before its first browser suite or product gate. Downloads consume network, disk and time; measured per-worktree cost and token cost are unknown. The deliberate negative fixtures establish the condition, not a failure of a later order's full gate.",
  "goalAlignment": "Mission: expose the environment obligation to later consumers of gate F. Shifting the burden and escalation favor visible setup over hidden downloads or local skips; rule beating and drift to low performance retain an honest unavailable result and failing suite. Policy resistance retains the declared criterion; tragedy of the commons records cache/download cost; success to the successful weighs the shared-cache alternative; seeking the wrong goal keeps missing evidence distinct from acceptance. Naive Interventionism keeps the smallest documented step; NoOp would leave Receipt 036 undisposed.",
  "reopenWhen": "An order's npm test -- --review fails only in the browser-evidence suite because the browser is missing, or a Codex or resident-launched verification cannot run the gate for that reason. Reopen the design to separate an unavailable-browser advisory from the product gate through an authorized planning change."
}
```

## WO-059-D024 — isolate the fresh-worktree fixture's npm root

```json
{
  "id": "WO-059-D024",
  "date": "2026-10-01",
  "dispatch": "resume: fix; adjacent-0002 revision 2",
  "decision": "Give the copied fresh-worktree fixture its own private root manifest so its install-command probes cannot inherit an enclosing workspace. Extend the current adjacent-0002 within scenario.test.mjs and the existing two checks; preserve every cache and missing-browser assertion and the product read guard.",
  "evidence": [
    "The first repair-003 full review at code identity 60a6da4f62af3e1e01de731397e3ab654016374ab43419ab8a9bc3b9f9bc16ce passed 37 suites and failed browser-evidence in 402.229 s. All 19 behavioral assertions passed, but the read guard observed two packages readdir calls from npm processes in the fresh-worktree cache test.",
    "The executor selected DOTLN_BROWSER_EVIDENCE_DIR inside this repository's ignored .runtime for that gate. The fixture copies its suite, symlinks runtime packages and node_modules, but supplies no root package.json. Its npx dry-run probes therefore have an enclosing workspace. The two excluded-read PIDs are descendants, not the test's own readdirSync(captures).",
    ".runtime/wo059-repair003-guard-before.log reproduces the same two packages reads with only the fresh-worktree case selected under the unchanged product read guard. The first fixture-local manifest attempt did not remove them; D025 corrects the premature after-probe claim."
  ],
  "alternatives": ["Give the fixture an independent npm root", "Force all fixture output into OS temporary storage", "Tag or exempt the test from the guard", "Relax the guard's directory rule"],
  "rejected": [
    {"option": "Force all fixture output into OS temporary storage", "reason": "Would hide a fixture-context dependency instead of making the existing caller-selected output root reliable."},
    {"option": "Tag or exempt the test from the guard", "reason": "The observed reads are fixture setup leaking into the parent workspace; fix the context without moving the browser behavior out of the product gate."},
    {"option": "Relax the guard's directory rule", "reason": "The rule correctly caught an undeclared parent-workspace read and is outside this package's repair scope."}
  ],
  "goalAlignment": "Mission: obtain a passing gate on the actual repair subject. Rule beating rejects moving or exempting the failed case; policy resistance keeps the guard intact; shifting the burden removes a required output-location workaround; drift to low performance retains all assertions. Tragedy of the commons records one failed 402 s gate and one required rerun. Escalation, success to the successful and seeking the wrong goal are bounded by a fixture-local manifest rather than guard redesign. Naive Interventionism preserves the install probes and checks the smallest context correction; NoOp leaves criterion 9 unmet.",
  "reopenWhen": "The guarded fresh-worktree fixture observes another excluded read, or a saved capture root changes its cache selection."
}
```

## WO-059-D025 — correct the premature fixture-isolation claim

```json
{
  "id": "WO-059-D025",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: fix; adjacent-0002 revision 2",
  "misread": "D024 was updated to claim the guarded after-probe had zero excluded reads before the tool result was read.",
  "meant": "wo059-repair003-guard-after.log and its command exit 1 show the same two packages readdir observations even with the fixture-local manifest. The test assertions pass, but isolation is not established.",
  "changed": "Remove the unsupported success claim from D024, retain both probe logs and trace the subprocess call stacks before selecting the next fix. No passing full gate or completed repair has been claimed.",
  "decision": "Continue diagnosis from executed evidence; no guard exemption or criterion change.",
  "evidence": [".runtime/wo059-repair003-guard-after.log: two excluded reads; exit 1"],
  "alternatives": ["Correct and trace the read", "Carry the false success claim"],
  "rejected": [{"option": "Carry the false success claim", "reason": "The checked probe contradicts it."}],
  "reopenWhen": "The traced producer and an executed guarded comparison establish the actual fixture correction."
}
```

## WO-059-D026 — keep the fresh-worktree copy outside its parent workspace

```json
{
  "id": "WO-059-D026",
  "date": "2026-10-01",
  "dispatch": "resume: fix; adjacent-0002 revision 3",
  "decision": "Replace the ineffective manifest attempt with a physically separate OS-temporary fresh-worktree copy. Keep caller-selected capture storage for the ordinary scenarios. The install probe still executes the exact printed and README commands without CLI overrides or a read-guard exemption.",
  "evidence": [
    ".runtime/wo059-repair003-readdir-stack.jsonl attributes both reads to npm exec -- playwright install chromium --only-shell --dry-run. Their cwd is the nested copied fixture; the stack is graceful-fs/glob workspace traversal.",
    "Installed npm @npmcli/config/lib/index.js loadLocalPrefix keeps walking above a local package.json or node_modules to find a containing workspace. Only CLI prefix, CLI workspaces=false or global mode stop that traversal. This explains why a fixture-local manifest alone did not fix D024's read.",
    "A real independently selected worktree is outside its parent's checkout. The fixture currently nests that simulated worktree in the caller-selected capture root; moving just the copied worktree to os.tmpdir preserves the production install-command and cache-selection test.",
    ".runtime/wo059-repair003-guard-final.log: the corrected fresh-worktree test passes in 1.308 s with zero excluded reads under the original product read observer and with an in-repository capture root. The checked command exits 0.",
    "Context7 /npm/cli current workspaces and npm-exec documentation retrieved on 2026-10-01 describes implicit workspace context; the installed loadLocalPrefix source and traced comparison establish this host's exact traversal."
  ],
  "alternatives": ["Separate only the copied worktree from the checkout", "Add CLI prefix or workspaces=false to the install probe", "Force every capture into temporary storage", "Keep the manifest attempt"],
  "rejected": [
    {"option": "Add CLI prefix or workspaces=false to the install probe", "reason": "Would judge an altered install command instead of the exact remedy and README command."},
    {"option": "Force every capture into temporary storage", "reason": "The caller-selected capture root remains valid for normal scenarios; only the separately modeled fresh worktree needs separation."},
    {"option": "Keep the manifest attempt", "reason": "The executed guarded comparison shows it does not stop npm's parent-workspace scan."}
  ],
  "goalAlignment": "Mission: close the fixture-context defect and establish the repair's gate. Policy resistance and rule beating retain the exact install probes and observer; shifting the burden removes the output-root workaround. Drift to low performance retains all missing-browser and cache assertions. Tragedy of the commons confines one temporary copy and records the failed probes; escalation, success to the successful and seeking the wrong goal keep the correction in this test rather than alter npm or the runner. Naive Interventionism separates only the simulated worktree; NoOp leaves the guarded suite red.",
  "reopenWhen": "The corrected guarded fixture observes any excluded read or selects a cache different from its copied suite's default."
}
```

## WO-059-D027 — repair outcomes and independent handoff

```json
{
  "id": "WO-059-D027",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001; adjacent-0002 completed at queue revision 18",
  "decision": "Hand the repaired recorded-root invariant and all D018 fixes to fresh independent verification. Retain the integrated main subject and release assignments from D015/D016. D023 disposes Receipt 036 without changing criterion 6. Preserve every filed report and earlier evidence subject; update the mutable handoff and the existing capability row to identify this repair's pending verification.",
  "evidence": [
    "repair-003-fixtures.json from the passing review: bare-pid-bystander adopts no PID, refuses empty and missing-root records and leaves the bystander alive; surviving-owned-tree-recovery signals its recorded Node root and child after owner SIGKILL, then observes an empty after-set and an available fresh scenario.",
    "The surviving-tree fixture also observes identical UTC start-time strings under UTC and America/New_York and refuses recovery while the renamed owner remains alive. Console-assert refuses both criterion passes; console-capture-boundary observes the late message without changing the saved entries/hash. Timeout and sandbox-denial doubles remain unavailable without install advice or raw diagnostics.",
    "The corrected standalone browser suite passes 19 tests in 17.668 s. The final npm test -- --review passes 38 suites, zero failed, 400.457 s and 82 fresh tasks at code identity 7f384f7b66cf718e238ac7c87a38028ee29d8924dcb77e1e18e29f4f5d4cba30, recorded 2026-10-01T02:05:28.255Z. repair-003-gate-records.json retains the selected executed row and the failed predecessor.",
    "The earlier 402.229 s review failed on two guarded npm directory reads despite 19 passing browser assertions. D025 corrects the premature manifest-isolation claim; D026's separate fresh-worktree copy passes the unchanged observer with zero excluded reads. The final full review passes that same guarded suite.",
    "At 2026-10-01T02:09:19.413Z, processTable observes no commands containing chrome-headless-shell, wo059-renamed-owner or process-owner.mjs. This is a scoped host observation, not a universal process-cleanup claim.",
    "No repair lockfile or registered edition-source change: authority/artifact-identity/verification WO-059/001 and feedback WO-059/002 remain current in the passing edition checks. D016's live Claude Code 2.1.286 claude-opus-5-5 xhigh self-host episode and console repin carry forward; no additional live episode is needed.",
    "npm run test:docs passes 24 suites, zero failed, 35.900 s at 2026-10-01T02:13:47.184Z with the repair handoff and evidence in place. Canonical follow-up disposition allocates FUP-96928fa2501223a5 to WO-059 and settles D018/D019 rows. Plan check and publication:check pass; final document bytes are rechecked inline at repair-complete.",
    "Local release remains v0.59.0, browser-evidence 0.1.0 and skeleton 0.47.2. Product 03's original adapter addition is 279 UTF-8 bytes, within the 400-byte bound. D002's one declined economy experiment is retained; no second experiment, fan-out or measured saving is claimed."
  ],
  "routes": [
    {"id": "FUP-96928fa2501223a5", "disposition": "allocated to WO-059", "reason": "D017's implementation and regressions now pass; the major finding's fresh independent verification obligation remains with this order."},
    {"id": "FUP-4ec1bd58fe0d1fba", "disposition": "settled", "reason": "All five D018 producer/test defects are repaired within completed adjacent-0002, with focused and full-gate evidence; this does not claim independent verification."},
    {"id": "FUP-a8f5dd98ad1eb0b9", "disposition": "settled", "reason": "D023 records the selected missing-browser behavior, accepted per-worktree setup cost and Receipt 036's exact reopening condition."}
  ],
  "otherTouchingRows": [
    {"ids": ["FUP-7629e03c6573f5cb", "FUP-fb8cbeabbddef397", "FUP-e821aa2ced3aa111"], "reason": "Keep existing routes: new adapter sources were staged before the fresh gate, and this repair does not open reuse lookup, recurring gate history cost or remaining node() progress consumers."},
    {"ids": ["FUP-adf6621e7f958dd8", "FUP-e34029d1192ce82e", "FUP-b28b870422a74166"], "reason": "Keep the FINAL-001 dispositions: authority-copy policy, planner guard-fault disposition and LEGAL gate reuse are outside the repaired producer; the current review executes fresh and retains legal/license checks."},
    {"ids": ["FUP-439252e49f6381fc", "FUP-b7a66e7a4fa7ad20", "FUP-fd05316b6030ef73"], "reason": "No product gate-wording, collision-recorder or standing writer-text seam is opened; preparation uses existing helpers."},
    {"ids": ["FUP-50cda1c03ecd8ea8", "FUP-acfe4bfda716d8fb", "FUP-e55e258d37cb3f20"], "reason": "Generated meta/control projections do not open byte-proof retention, usage attribution or follow-up matching functions; retain their existing reopening conditions."}
  ],
  "alternatives": ["Complete bounded repair and request separate verification", "Treat the executor gate as independent verification", "Broaden this repair to shared browser-cache or gate redesign"],
  "rejected": [
    {"option": "Treat the executor gate as independent verification", "reason": "The roles judge separate recorded subjects; a producer does not certify its own repair."},
    {"option": "Broaden to cache or gate redesign", "reason": "D023 accepts the current declared behavior and names the condition for an authorized planning change; no evidence here reopens that choice."}
  ],
  "goalAlignment": "The outcome closes gate F's reproduced bystander-kill path before WO-123 consumes its evidence. Rule beating and seeking the wrong goal require a nonempty signal path plus a live bystander, not only a green self-exiting Chromium fixture. Tragedy of the commons protects the shared host and records the failed 402 s gate plus required 400 s rerun; shifting the burden puts identity and immutable capture enforcement in the producer. Policy resistance keeps the observer, criteria and role separation; drift to low performance preserves adverse/unavailable outcomes. Escalation and success to the successful favor the bounded fixes over new gates or shared infrastructure. Naive Interventionism separates only the simulated fresh worktree; NoOp would retain the reproduced defect or leave repair-complete outstanding.",
  "limits": "Observed POSIX host and pinned synthetic application only. The positive surviving tree is a Node surrogate and the real Chromium kill fixture self-exits. Trusted process records and observed identities remain the recovery boundary; no real-target or cross-platform cleanup guarantee. Final document checks and the repair transition follow the completed authored-output review.",
  "reopenWhen": "Independent verification contradicts the root, console, replay or launch assertions, or D023's preserved missing-browser reopening condition is observed."
}
```
