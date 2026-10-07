# WO-196 decisions

## WO-196-D001 — Preserve the existing gate contracts while ordering the handoff

```json
{
  "id": "WO-196-D001",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Implement the filed handoff sequence using the existing scheduler, task-result reuse, harness projection and lifecycle ledger. Run format freshly before build on every full selection; a configured formatter can read bytes excluded from the code identity. Preserve every shared rule after the numbered procedure and remove only the duplicated five-refusals paragraph and explicitly superseded duties.",
  "evidence": [
    "Canonical status: WO-196 active; dependencies WO-187, WO-186, WO-185 and WO-195 met; dispatch reserved this worktree writer.",
    "scripts/test-runner.mjs scheduleSuites builds before the preflight stage; format is document-only; runGateChecks excludes review from task reuse.",
    "Search of scripts/resume.mjs, scripts/release.mjs and scripts/lib/release-preparation.mjs found no executionMode consumers.",
    "WO-112 D049/D057/D058/D063 and WO-187 D051 name the losses and worker placement this order resolves.",
    "Installed CLAUDE.md plus each .agents skill before implementation: {\"executor\": 29777, \"verifier\": 26077, \"reviewer\": 27882}"
  ],
  "rejected": [
    {
      "option": "Reuse format solely by code identity",
      "reason": "A configured formatter can include documents outside the code identity. This repository currently excludes Markdown and JSON in .prettierignore."
    },
    {
      "option": "A new qualify command or blanket spawn refusal",
      "reason": "The filed design keeps the existing three commands and admits read-only workers."
    },
    {
      "option": "Change task history semantics",
      "reason": "WO-186 D035 already makes the latest execution decide; apply it to review unchanged."
    }
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Reduce repeated gate and supervision costs on the path to the independently verified source-to-deliverable loop.",
    "traps": "Policy resistance and rule beating: format runs before any product task, with the current configured formatter inputs. Commons and escalation: reuse existing passing tasks and run exactly two end-of-implementation workers. Shifting the burden and seeking the wrong goal: order the handoff in generated procedures instead of relying on operator rescue. Drift: retain all suites and assertions, changing assertions only where the authorized behavior changes. Success to the successful: retain the existing reusable task model because its latest-execution checks satisfy the contract, not merely because it exists.",
    "naiveInterventionism": "Keep single-suite and machinery selections unchanged; preserve no-write protection and publication controls; check failed preflight and later task failure paths.",
    "noOp": "Leaves the documented lost full gates and duplicated worker reviews in place."
  },
  "reopenWhen": "A composed row passes where a fresh run fails, a shared ref read by a carried task moves, or a harness loads a role without project instructions."
}
```

The two worker reviews will run before the final gate; Codex launch selections are gpt-6.1-sol at max, with no descendants. Root readback is gpt-6-astra at max, Codex CLI 0.160.1. WO-188 item 22 is adopted as directed here: no separate economy experiment is justified by this prescribed implementation. The format freshness choice is required for correctness rather than an optional comparison. D057 is answered by the procedure and spawn advisory, not a new watcher.

## WO-196-D002

```json
{
  "id": "WO-196-D002",
  "date": "2026-10-07",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.69.0, the next minor above the observed release baseline v0.68.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.68.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-196-the-handoff-is-one-command.md"
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

## WO-196-D003

```json
{
  "id": "WO-196-D003",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "I said the repository formatter checks Markdown and JSON without reading .prettierignore.",
  "meant": "The checked .prettierignore excludes Markdown, JSON and JSONL; the repository formatter checks code. A configured formatter can cover other files, which the new fixture deliberately demonstrates.",
  "changed": "Corrected D001, the playbook and the scheduler comment; retained fresh preflight execution and a README variation in the configurable fixture.",
  "decision": "Keep fresh format preflight while describing the actual repository scope precisely.",
  "evidence": [
    ".prettierignore lines 1-7",
    "The new format preflight fixture passes for plain/review and rejects an unformatted README at unchanged code identity only in its deliberately broader fixture configuration."
  ],
  "rejected": [
    {
      "option": "Keep the unchecked claim",
      "reason": "It contradicts the current repository configuration."
    }
  ],
  "reopenWhen": "The formatter configuration changes."
}
```

## WO-196-D004

```json
{
  "id": "WO-196-D004",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Prepare v0.69.0 with compiler 0.25.4 (projection correction, no API or schema change), skeleton 0.55.0 and harness host 0.35.0 (new role procedure/advisory); update existing workspace pins only. Select authority/artifact/verification WO-196 revision 002 and feedback-001, carrying WO-112 feedback-009 without a live episode.",
  "evidence": [
    "release prepare --local assigned v0.69.0 above v0.68.0.",
    "An initial authority --write required harness emit first and then a new edition; authority/001 remains preserved as a superseded preparation before the compiler source version constant was updated.",
    "authority-evidence --check, artifact-identity-evidence --check, verification-evidence --check, feedback-evidence --check and harness check all passed after emission.",
    "feedback-evidence --carry reports only component release labels moved; no live episode.",
    "New named inputs: packages/compiler/src/artifact-identity.ts (version constant), packages/skeleton/src/version.ts, existing workspace manifests/lock, docs/evidence/current.json, scripts/console-fixtures.mjs and the console selfhost fixture inputs/outputs. The canonical --record-current-selfhost recorder refreshed only its current case; no console behavior changed.",
    "publication:check passed: 254/254 headings indexed, both linked publications current."
  ],
  "rejected": [
    {
      "option": "Rewrite prior evidence or run a new live episode",
      "reason": "Prior editions are immutable and the existing carry command proves the release-only feedback change."
    },
    {
      "option": "Add or update an external dependency",
      "reason": "The implementation needs none."
    }
  ],
  "reopenWhen": "A registered behavioral source changes, a current-edition check fails, or local release baseline advances."
}
```

## WO-196-D005

```json
{
  "id": "WO-196-D005",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Retain the full shared rules after the numbered procedure, removing only the duplicate boundaries paragraph and explicitly replaced worker/economy/goal sentences. The verifier sequence names format:check for the read-only subject and limits formatter writes to authorized reports.",
  "evidence": [
    "role-measurements.json records both roots; rule-sentences.diff contains the exact changed/removed/added rule-line comparison.",
    "executor: 29777 -> 28128 bytes; 59 baseline rule lines preserved exactly once, no unexpected losses.",
    "verifier: 26077 -> 25380 bytes; 54 baseline rule lines preserved exactly once, no unexpected losses.",
    "reviewer: 27882 -> 26831 bytes; 57 baseline rule lines preserved exactly once, no unexpected losses.",
    "Generated skills contain no five-refusals paragraph; CLAUDE.md retains its one boundary paragraph.",
    "The focused role/equipment/host probe passed 13 tests, including live-gate spawn admitted with one warning and no warning after release."
  ],
  "rejected": [
    {
      "option": "Raise cold-start ceilings",
      "reason": "All three roots fit the existing ceilings."
    },
    {
      "option": "Tell a read-only verifier to format subject code",
      "reason": "The existing rule forbids editing the implementation to turn its own verdict green."
    }
  ],
  "reopenWhen": "A generated role loses a useful rule, crosses its ceiling or disagrees with product 07."
}
```

## WO-196-D006 — Correct the verifier procedure after independent review

```json
{
  "id": "WO-196-D006",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Accept and fix the adversary's criterion-3 finding: the verifier runs format:check on its subject, and any report formatting targets only its allocated path. Preserve both worker reports and select authority/artifact/verification revision 003 after regenerating the corrected roles.",
  "evidence": [
    "adversary.md: found 1, fixed 1, recorded 0; improver.md: found 0, fixed 0, recorded 0. Two fresh read-only workers, no descendants, supplied gpt-6.1-sol/max; effective effort has no independent readback.",
    "The previous step incorrectly assumed that limiting the purpose of npm run format limited its write scope. package.json defines it as prettier --write . --ignore-unknown; the full-repository write could change the judged implementation.",
    "The corrected procedure fixture passed and asserts format:check, no global format write command, and allocated-path report formatting.",
    "The only production readHandoffLedger callers are implementation-ready (self-review default true) and repair-complete (false). The bounded full test-resume.sh probe passed exit 0 in 82,908 ms.",
    "All three new edition 003 writers completed after build and harness emit; earlier editions remain preserved. The canonical console selfhost recorder was rerun for the current authority pointers.",
    "After the worker fix, generated roots: executor 28,132 / 29,246 ceiling; verifier 25,380 / 29,831; reviewer 26,831 / 28,884. No budget changed."
  ],
  "rejected": [
    {
      "option": "Keep a whole-repository formatter write in the verifier's numbered steps",
      "reason": "It contradicts the retained read-only authority and can invalidate the judged identity."
    },
    {
      "option": "Spawn another generic worker pass",
      "reason": "The two required independent reviews are complete; the concrete correction has an executable regression check."
    }
  ],
  "reopenWhen": "The formatting command or verifier report authority changes."
}
```

## WO-196-D007 — Resolve the active handoff without a literal placeholder read

```json
{
  "id": "WO-196-D007",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Name the active order's handoff.md in the executor's numbered step and retain the exact evidence-directory rule below it. Select authority/artifact/verification revision 004 after emission; preserve all earlier preparations.",
  "evidence": [
    "The first test:docs gate failed at harness-context: the new numbered step combined a backticked docs/evidence/WO-NNN/handoff.md with read final outputs, so readDirectives treated the placeholder as a required installed file.",
    "New named inputs: scripts/harness-context.mjs unresolvedInstalledReads and scripts/lib/harness-context.mjs readDirectives. The parser remains unchanged; the role now names its actual task-relative output without advertising a literal required path.",
    "The bounded harness-context --check passed exit 0 in 181 ms after the correction. Harness emit and all three edition 004 writers completed, then the canonical console selfhost recorder refreshed its current case.",
    "role-measurements.json now measures executor 28,128 bytes, verifier 25,380 and reviewer 26,831; all remain below the unchanged ceilings. The shared rule sentences did not change."
  ],
  "rejected": [
    {
      "option": "Create a literal WO-NNN handoff or weaken installed-read checking",
      "reason": "The placeholder is a task-relative output; the active order already supplies its concrete path."
    }
  ],
  "reopenWhen": "A generated procedure introduces an unresolved required read."
}
```

## WO-196-D008

```json
{
  "id": "WO-196-D008",
  "date": "2026-10-07",
  "dispatch": "resume: next; full review gate repair",
  "decision": "Add a separate WO-196 current role snapshot linked to WO-187's exact bytes; advance the existing fixture's pointer and declare its input in process-debt. Keep every historical hash and optional-support assertion.",
  "evidence": [
    "The first review gate passed harness-fixtures in 404.83 seconds, then process-debt failed its current executor hash against the frozen WO-187 baseline at test-process-debt.mjs:6044. The authorized role changes had not been given their own current snapshot.",
    "Canonical evidence --stop ended run 2b1c8080-bc31-4d99-a66d-6f606be6a643 after 565.6 seconds with no check recorded. Other stopped or unstarted suites are not product defects.",
    "New named inputs: packages/skeleton/fixtures/wo187-role-baseline.json and the new wo196-role-baseline.json; WO-187 D011 records the existing historical-preservation route. The new snapshot pins twelve default and twelve opt-out hashes and the exact prior SHA-256 17fa9d571459bf9ee5e90be7c6490776b9da795c62393b78e960d5578d130ac3.",
    "The bounded optional-economy case passed after the correction, retaining historical preservation, both roots, default/explicit-on equality and executor-only opt-out. The separate direct-machinery-input coverage case passed; no assertion or suite was removed.",
    "All three evidence revision 004 checks still pass; the fixture and its test registration do not change those editions' behavioral sources."
  ],
  "rejected": [
    {
      "option": "Rewrite WO-187's frozen hashes or remove the current-output assertion",
      "reason": "That would erase historical evidence or weaken the existing optional-support contract."
    }
  ],
  "reopenWhen": "A historical snapshot changes, opting out removes another duty, or a later authorized role edit needs its own linked snapshot."
}
```

## WO-196-D009 — Restore the existing build-output regression assertions

```json
{
  "id": "WO-196-D009",
  "date": "2026-10-07",
  "dispatch": "resume: next; full review gate repair",
  "kind": "correction",
  "misread": "While adjusting review-reuse expectations, I also changed four existing build-output assertions from build plus beta to beta alone.",
  "meant": "A changed, missing, differently sourced or unattested build output still requires a fresh build under the unchanged WO-186 contract.",
  "changed": "Restored those four original assertions. The test diff now changes old expectations only for the authorized review composition and adds the two new preflight/reuse cases.",
  "decision": "Keep the implementation's existing build-output safety behavior and validate the complete runner suite before the next full review attempt.",
  "evidence": [
    "The second review gate reported only two assertion failures, both in the existing build-output cases: actual executed build and beta, while my edited assertion expected beta. Later assertions in the same case had the same erroneous edit.",
    "Canonical evidence --stop ended run 5c10d9f0-6b54-471c-a884-76faa527e944 after 945.2 seconds with no check recorded; stopped and unstarted suites are not product defects.",
    "npm test -- --only runner-fixtures passed after restoration: 2 tasks, 0 failed, 65.82 seconds; runner-fixtures itself took 64.94 seconds. This includes the entire runner suite, its unchanged build-output regressions, and the new formatting/review-composition cases.",
    "The four assertion edits no longer appear in git diff; no production source change was needed for this correction."
  ],
  "rejected": [
    {
      "option": "Change build-output reuse to match the mistaken assertions",
      "reason": "It would allow tasks to consume untrusted outputs and violate the contract this order preserves."
    }
  ],
  "reopenWhen": "A task is carried beside an output its source build did not attest."
}
```

## WO-196-D010 — Verification: fail on criterion 8; one finding to the repair

```json
{
  "id": "WO-196-D010",
  "date": "2026-10-07",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on criterion 8 alone. With a product document over its ceiling, scripts/docs-check.mjs prints one ADVISORY line and exits 0, and npm run test:docs also exits 0, but npm run test:docs prints no advisory. For a passing task the runner prints only 'PASS <suite> <seconds> s' and prints task output only when the exit code is non-zero (scripts/test-runner.mjs:2297-2311). The gate record keeps output only for failed or unexecuted tasks (packages/skeleton/src/gate-evidence.mjs:876). The advisory is therefore neither printed nor recorded. Criterion 8 requires npm run test:docs to print one advisory naming the bytes over. Criteria 1 to 7 and 9 are met. One further finding sits inside the declared surfaces, contradicts no criterion and goes to the repair's Adjacent Repair. R1: the runner's all-tasks-reused branch can no longer be reached by any plain or review selection over a table that holds the format row. Its edits, and the fixture assertions that exercise it, describe a path production never takes.",
  "evidence": [
    "F1 reproduction in DotLn session scratch (probe-docs-gate.test.mjs, run under harness bounded). A docs root holds docs/product/00-fixture.md, 2 bytes over its doc-ceilings.json entry. Run directly, the real scripts/docs-check.mjs exits 0 and prints one 'ADVISORY docs/product/00-fixture.md: 2 bytes over ceiling; planning resets ceilings' line. runGate(['--document', '--serial']) from the real scripts/test-runner.mjs runs a docs-check row on the same script and exits 0. It prints exactly three lines: 'PROGRESS [docs-check] 0.0 s started', 'PASS docs-check 0.11 s' and 'npm run test:docs: 2 passed; 0 failed; 0.17 s; 2 fresh tasks'. It prints no advisory.",
    "Real corpus at code identity 3318e5928d5d7f97301ba96461870815141d2c92a230021d962d1b359d22027a. node scripts/docs-check.mjs prints its 'NEWER local release tags not in docs/product/06-roadmap.md: v0.66.0, ...' notice through the same notices loop (scripts/docs-check.mjs:531) that prints the ceiling advisory (line 464). npm run test:docs printed only 'PASS docs-check 15.42 s' for that task (29 passed, 0 failed, 107.06 s). The latest recorded npm run test:docs row's docs-check case has no output field.",
    "The executor's criterion 8 evidence runs the docs-check CLI and the docs-check-fixtures unit cases, not the document gate's output: scripts/test-docs-check.mjs 'document CLI admits overage with one advisory ...' spawns scripts/docs-check.mjs directly.",
    "R1 (source reading, then checked against the real gate rows). runGateChecks prepends the format row to every plain and review selection (scripts/test-runner.mjs:1967-1971) and drops it from the carried results (line 1998). So 'reused.size === tasks.length' (line 2024) never holds for those selections, and the branch with 'executionMode: review ? \"composed\" : \"reused\"' (line 2041) and the 'no suite started' message runs only for tables without a format row. The fixture 'npm test composes plain and review task rows ...' (scripts/test-runner.test.mjs:308) uses such a table and asserts reused: true (lines 418 and 423), which production does not reach. The three composed review rows at this identity (09:49:39 by the executor; 14:26:57 and 14:27:05 by this verification) each ran format fresh, carried 87 tasks from the 09:49:10 row, and recorded reused undefined and freshReason 'missing-passing-tasks'.",
    "Criteria 1 to 7 and 9: own probes in session scratch against the real runner and the real format suite row. (1) The repository's real format:check script and .prettierignore, with an unformatted scripts/deep/ugly.mjs: plain, --review, --again and --review --again each exit 1 in 259 to 309 ms with no task executed, the file named and the repair sentence printed; NOTES.md is not named; after npm run format the plain gate runs. (2) A format failure at an unchanged identity displaces no pass: the next --review composes every product task from the plain row. A failure recorded by a forced review row makes the next --review rerun only that task. The executor's four runner fixtures pass. The live-gate spawn case passes. Root bytes reproduce exactly. A line comparison against HEAD finds every baseline rule line once, after Rules:. Two npm run test:docs runs passed. npm test -- --review composed at this identity.",
    "No subject source was edited. In the repository this verification wrote this decision, the regenerated decisions index, VER-001, the regenerated work-order index and, in the ignored gate index, two composed npm test -- --review rows and two npm run test:docs rows."
  ],
  "rejected": [
    {
      "option": "Judge criterion 8 met on the docs-check CLI case",
      "reason": "The criterion names npm run test:docs as what prints the advisory. A reproduction with the real runner, and the real corpus, both show the gate prints nothing for a passing docs-check."
    },
    {
      "option": "Fail on R1",
      "reason": "R1 breaks no criterion and no behavior main had: production composes correctly and the format preflight is deliberately fresh (D001). It is a maintainability and fixture-fidelity defect."
    },
    {
      "option": "Repair during verification",
      "reason": "The verifier does not edit the subject it judges."
    }
  ],
  "followup": "WO-196 resume: fix. (F1) With a product document over its ceiling, npm run test:docs exits 0 and its own output carries exactly one 'ADVISORY <file>: <n> bytes over ceiling; planning resets ceilings' line for that document. A fixture that runs the document gate through scripts/test-runner.mjs, not docs-check alone, asserts the line once and exit 0. Missing or malformed ceiling metadata still fails the gate. Otherwise the operator waives criterion 8 through the waive off-ramp, naming their words. (R1) Remove the all-tasks-reused branch, or make a production selection reach it. Run the plain and review composition fixtures over a table that includes the format row, so their reused, executionMode, gateSelection and freshReason assertions describe production. A composed row whose only fresh task is the always-fresh format preflight should not report freshReason 'missing-passing-tasks'. Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair or an operator waiver settles criterion 8; the repair changes the format preflight or review composition that criteria 1 and 2 judge; or a production plain or review selection is shown to reach the all-tasks-reused branch."
}
```

## WO-196-D011 — Deliver successful check diagnostics through the gate

```json
{
  "id": "WO-196-D011",
  "date": "2026-10-07",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "Forward ADVISORY and NEWER lines from successful tasks through the runner's existing result printer. Keep complete failure output. The repair rule is that successful diagnostic lines reach the gate terminal exactly once; a passing docs-check does not hide an over-ceiling advisory. Exercise the actual document gate with two over-ceiling documents, UTF-8 content, default and relocated roots, and missing and malformed metadata.",
  "evidence": [
    "scripts/test-runner.mjs onResult prints output only for non-zero exit; scripts/docs-check.mjs emits ceiling and operator-word ADVISORY lines and release-history NEWER notices on success.",
    "Before the runner edit, the new document-gate regression failed in both layouts: exit 0, zero advisory occurrences instead of one; bounded probe exited 1 at 2026-10-07T14:43:26.546Z.",
    "After the printer repair, node scripts/harness.mjs bounded -- node --test scripts/test-docs-check.mjs passed all 38 tests in 5895 ms at 2026-10-07T14:45:48.553Z, including two document layouts and a separate NEWER/success/failure-output case.",
    "Bounded rendering comparison on one successful real docs-check output: whole stdout was 24 lines / 2080 bytes; diagnostic-only forwarding was 6 lines / 971 bytes, with identical diagnostic content. Probe exited 0 at 2026-10-07T14:44:04.422Z in 15329 ms. This compares output rendering, not future gate runtime.",
    "VER-001 F1 shows the earlier handoff's criterion-8 claim rested on the direct CLI fixture; its gate-level claim was unsupported. The repair handoff will cite the gate regression and the new passing rows instead."
  ],
  "goalAlignment": {
    "traps": "Rule beating: assert the document gate's terminal output, rather than substituting a direct CLI pass. Commons: retain concise successful output and full failed-task diagnostics. Escalation: use the existing runner printer and run no additional review agents at repair-complete.",
    "noOp": "Leaves criterion 8 unmet and the advisory invisible at the command the operator uses."
  },
  "rejected": [
    {
      "option": "Print every successful task's entire output",
      "reason": "The bounded comparison preserved the same diagnostics with 6 rather than 24 lines. Whole-suite output would add routine tables and TAP output to every gate."
    },
    {
      "option": "Special-case the ceiling text or docs-check task name",
      "reason": "The same printer discards other successful advisories. Forwarding the explicit diagnostic prefixes closes that class without interpreting their prose."
    },
    {
      "option": "Add successful stdout to immutable gate records",
      "reason": "Criterion 8 requires terminal delivery. Changing the record schema or registered gate-evidence source is unnecessary for this bounded repair. Successful diagnostic forwarding is limited to the existing bounded output tail."
    }
  ],
  "reopens": {
    "decisionId": "WO-196-D010",
    "observation": "F1 is reproduced at the gate and repaired at the printer that lost its successful output."
  },
  "reopenWhen": "A successful check uses another explicit diagnostic prefix, or a required advisory falls outside the bounded task output tail."
}
```

## WO-196-D012 — Compose through one scheduler with production preflight fixtures

```json
{
  "id": "WO-196-D012",
  "date": "2026-10-07",
  "dispatch": "resume: fix; VER-001 R1; adjacent-0001",
  "decision": "Remove the all-tasks-reused shortcut and use the existing scheduler and row builder for all compositions. Format remains freshly executed. Record always-fresh-preflight when it is the sole fresh task, missing-passing-tasks when another task lacks a pass, and no-fresh-tasks for synthetic tables without a formatter that reuse everything. Give the plain/review composition fixtures the real format row's flags and an executed fixture command; retain the real-Prettier regression. Preserve source pointers, forced freshness, latest-failure precedence and build-output attestation.",
  "evidence": [
    "The production table contains format; full selections prepend it and remove it from coveringTaskResults, so reused.size === tasks.length never holds. The duplicate builder was exercised only by tables omitting format.",
    "The original composition fixture's format-free table expected a row-level reused flag and a no-suite-started message, unlike the production rows VER-001 observed.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-runner.test.mjs passed all 102 tests in 78868 ms at 2026-10-07T14:50:23.418Z. Existing build-output and latest-execution cases passed unchanged; composition now asserts fresh format, product source pointers, selection, forced freshness and accurate freshReason.",
    "npm run release -- prepare --local kept v0.69.0 and refreshed the existing meter surfaces. Repair changes only scripts/test-runner.mjs and the two fixture files; scripts/lib/evidence-sources.mjs and FEEDBACK_SOURCE_PATHS name none of these paths, so the prepared component versions and existing evidence editions are retained pending their gate checks.",
    "Adjacent queue revision 2 was reread after F1's 38-test passing probe. The chat intent and message-boundary check-in are actor-attested; no new operator steering was present. Queue revisions 3 and 4 recorded the check-in and start of adjacent-0001 revision 1."
  ],
  "goalAlignment": {
    "traps": "Rule beating: composition fixtures include the mandatory fresh preflight rather than passing a production-unreachable shortcut. Drift: preserve the unchanged build-output and latest-execution assertions. Commons: use one existing scheduler and row builder rather than making the shortcut a second preflight implementation.",
    "noOp": "Leaves unreachable code and metadata that describes deliberate format freshness as missing evidence."
  },
  "rejected": [
    {
      "option": "Reuse format or execute it separately to reach the shortcut",
      "reason": "Format may read bytes excluded from the code identity. A second execution path would duplicate its existing failure and scheduling contract."
    },
    {
      "option": "Defer R1 solely because it breaks no criterion",
      "reason": "The diagnosed fix is bounded to the declared runner surfaces and shared checks; Adjacent Repair selects the repair."
    }
  ],
  "reopens": {
    "decisionId": "WO-196-D010",
    "observation": "R1 is handled as the announced adjacent repair, alongside the criterion-8 correction."
  },
  "reopenWhen": "A production composition skips format, masks a newer task failure, loses an executed source pointer or changes the build-output safety contract."
}
```

## WO-196-D013 — Qualify both repairs at the current identity

```json
{
  "id": "WO-196-D013",
  "date": "2026-10-07",
  "dispatch": "resume: fix; repair qualification",
  "decision": "Judge all nine criteria met at the repaired identity. F1 is fixed by successful diagnostic forwarding and gate-level fixtures; R1 is fixed by the single scheduler, production-shaped fixtures and accurate freshness metadata. Complete adjacent-0001 and the repair handoff; preserve VER-001 and the original two worker reports. No worker review is required at repair-complete.",
  "evidence": [
    "Code identity 8017b3c565377a9637c7e213d2e84a61a823102258b0e83355d51f89653ab431. Format ran first. No root repository writes or agent starts occurred during the gates.",
    "npm run test:docs passed 29 checks in 111602 ms at 2026-10-07T14:54:35.239Z; real successful NEWER and ADVISORY diagnostics were visible.",
    "npm test -- --review passed 38 suites and 88 fresh tasks in 1815451 ms at 2026-10-07T15:25:18.063Z. runner-fixtures and release:case:composed_evidence passed.",
    "Unchanged review passed in 6457 ms at 2026-10-07T15:25:55.958Z. The bounded probe asserted composed/review, always-fresh-preflight, identical required suites, format alone fresh, and all 87 reused tasks naming the fresh worktree row. repair-001-gate-summary.json records the passing rows.",
    "git diff --check passed. Queue revision 5 records adjacent-0001 completed with all required checks and no next item.",
    "Authority/artifact-identity/verification revision 004, feedback-001, publication and harness checks passed. Repair paths are absent from their registered behavioral sources; existing editions, component versions and prepared v0.69.0 remain valid.",
    "Codex session readback: CLI 0.160.1, gpt-6.1-sol, max, codex-session-readback; order recommendation xhigh. Both evidence wait commands completed. Temporary fixture repositories were removed by teardown; no retained scratch repository was created."
  ],
  "rejected": [
    {"option":"Carry the earlier review row across changed runner source","reason":"The repair changes code identity; a fresh complete review qualified the current bytes."},
    {"option":"Repeat the review freshly to prove unchanged reuse","reason":"The unchanged invocation and assertions exercise reuse directly in 6457 ms."}
  ],
  "reopens": {"decisionId":"WO-196-D010","observation":"F1 and R1 are fixed and qualified; the earlier criterion-8 claim is replaced by actual gate-level evidence."},
  "reopenWhen": "Independent re-verification reproduces either repaired finding, or a composed row contradicts a fresh run at its identity."
}
```

## WO-196-D014 — Verification: pass; the repaired findings hold and one import is left to a follow-up

```json
{
  "id": "WO-196-D014",
  "date": "2026-10-07",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002. All nine criteria are met at code identity 8017b3c565377a9637c7e213d2e84a61a823102258b0e83355d51f89653ab431. VER-001's F1 and R1 are fixed. F1: a passing document gate now prints a successful task's ADVISORY and NEWER lines. R1: the shortcut no production selection reached is removed, and a composed row whose only fresh task is format records freshReason always-fresh-preflight. One defect is left to a follow-up. The raise-rule removal left runGit unused: scripts/docs-check.mjs line 18 imports it and nothing calls it; main called it three times. It breaks no criterion and no behavior main had, and maintainability alone is a follow-up by product 07 section Verification review and attack, so it does not block.",
  "evidence": [
    "Subject: the uncommitted wo-196 worktree. HEAD and main are both ae782ef9. The checkpoint is refs/dotln/checkpoint/WO-196/7 (dd0eb36f). Against that checkpoint the only tracked differences are docs/control/current.md and docs/work-orders/README.md. gateCodeIdentity of the worktree equals the executor's gate rows. The repair's code diff from checkpoint 3 (VER-001's subject) to checkpoint 7 touches only scripts/test-runner.mjs, scripts/test-runner.test.mjs and scripts/test-docs-check.mjs.",
    "F1. Scratch probe docs-gate-probe.mjs, run under harness bounded. A child process runs runGate(['--document','--serial']) from the real scripts/test-runner.mjs, with the real docs-check row and the real scripts/docs-check.mjs, over a fixture whose 00-a.md is 3 bytes over its ceiling. A second document row prints an indented ADVISORY line, a mid-line ADVISORY line, an 'ADVISORYX' line and an ordinary line. At both the default docs root and a relocated 'records' root, raw stdout carried exactly one line '  [docs-check] ADVISORY <root>/product/00-a.md: 3 bytes over ceiling; planning resets ceilings', and the run exited 0. Nothing came from the noise row or from a document exactly at its ceiling. A missing entry and an entry with a numeric decision each exited 1. A ceiling at twice the landing bytes, with no planning anchor, exited 0: the raise rule is gone.",
    "R1 and criterion 2. Scratch probe reuse-probe.mjs, against the real runner and the real format row's flags, in a fixture with markers under an ignored directory. A plain run, then a second plain run, composes with only format fresh and records always-fresh-preflight. A failing format run leaves plain and --review at exit 1 with only format executed. A --review that needs the changed machinery task records missing-passing-tasks. A --review with nothing else to run records always-fresh-preflight, with the same requiredSuites. After an --only beta failure, the next --review reran beta and failed. After a --review --again failure, the next --review reran alpha. --again recorded forced-fresh and requested. A table without format composed with no task executed and no-fresh-tasks. --only and --machinery ran no format. The executor's eight composition, preflight and build-output runner fixtures passed (tap, 8/8).",
    "Real corpus. npm test -- --review at this identity recorded a composed review row at 2026-10-07T15:46:30.821Z: exit 0 in 7.07 s, freshReason always-fresh-preflight, format the only fresh task, and 87 reused tasks. Each reused task names the executor's fresh worktree row 2026-10-07T15:25:18.063Z (88 fresh tasks, 38 suites, exit 0, including runner-fixtures, harness, release and release:case:composed_evidence). requiredSuites is identical to that row's. scripts/test-resume.sh, the release scripts and scripts/lib/release-records.mjs are unchanged from main.",
    "Criterion 1. Scratch probe format-probe.mjs uses the real format row, the repository's real format:check script, its .prettierignore and Prettier, with an unformatted scripts/deep/ugly.mjs and an unformatted NOTES.md. Plain, --review, --again and --review --again each exited 1 in 586 to 629 ms with no product task executed. Each named ugly.mjs, printed 'Run npm run format, then rerun this command.' and did not name NOTES.md. --only alpha and --machinery passed without format. After npm run format, NOTES.md kept its bytes and the plain and review gates passed.",
    "Criteria 3 to 6, by roles-probe.mjs against git show main. The executor, verifier and reviewer skills open with numbered steps in execution order and then 'Rules:'. The handoff steps run format (format:check for the verifier), npm run test:docs, the product gate with the no-write and no-agent sentence, records, then the result command. The baseline lines missing from each skill are the Origin hash, the five-refusals paragraph, the Goal Alignment line, the executor Tinkerer line, the executor adversary line and the verifier verify-dispatch line, as criteria 3 to 5 allow. The only repeated lines are the two front-matter fences. The .claude and .agents roots are byte-identical. grep -c 'five refusals' prints 0 for all twelve skills and the worker definition, and 1 for CLAUDE.md, which is unchanged at 6,873 bytes. The executor, verifier and reviewer sentences agree with product 07 section Verification review and attack. No skill contains 900. Root bytes: executor 29,777 to 28,128 (ceiling 29,246); verifier 26,077 to 25,380 (29,831); reviewer 27,882 to 26,831 (28,884). docs/control/budgets.json is unchanged.",
    "Criterion 7. The 'spawn during a live gate is admitted with one advisory; no live gate gives none' case passed (tap, 1/1). The self-review cases in scripts/test-verification-review.mjs ran inside the resume row of this verification's document gate, which passed.",
    "Criterion 9 and the gates. npm run format:check: all matched files formatted. git diff --check: clean. npm run test:docs: 29 passed, 0 failed, 111.47 s, recorded 2026-10-07T15:46:06.831Z. The real docs-check task's successful NEWER line and five operator-word ADVISORY lines were printed. PLAYBOOK carries the composed-row statement and the four-step handoff sentence. The lockfile changes only the internal compiler 0.25.4 and skeleton 0.55.0 pins.",
    "Follow-up defect. grep -c '\\brunGit\\b' scripts/docs-check.mjs prints 1, the import on line 18. git show main:scripts/docs-check.mjs has 3. The two removed calls read HEAD's doc-ceilings.json for the raise rule. runGitPathList is still used. The repository has no lint gate that reports an unused import."
  ],
  "rejected": [
    {
      "option": "Fail on the unused runGit import",
      "reason": "It breaks no criterion and no behavior main had. Product 07 section Verification review and attack routes maintainability alone to a follow-up."
    },
    {
      "option": "Rerun npm test -- --review fresh",
      "reason": "The executor's fresh review row at 2026-10-07T15:25:18.063Z is at this code identity and passed every required suite. I consumed it. The one composed run reproduces the repaired R1 on the real corpus."
    },
    {
      "option": "Spawn a worker",
      "reason": "Every claim the verdict rests on was reproduced in this session. No claim needed a worker."
    }
  ],
  "reopens": {
    "decisionId": "WO-196-D010",
    "observation": "F1 and R1 are reproduced as fixed at code identity 8017b3c565377a9637c7e213d2e84a61a823102258b0e83355d51f89653ab431. The document gate prints the ceiling advisory once and exits 0. The production composed review row records always-fresh-preflight, with format its only fresh task."
  },
  "followup": "Remove the unused runGit import from scripts/docs-check.mjs line 18, in the next repair or the next order that edits that file. Keep runGitPathList, which is still used. Check: npm run test:docs passes and grep -c '\\brunGit\\b' scripts/docs-check.mjs prints 0.",
  "reopenWhen": "A composed review row passes at an identity where a fresh --again run of the same selection fails; a product document over its ceiling passes npm run test:docs without its advisory line; or WO-196 reaches final review with the runGit import still unused."
}
```

## WO-196-D015 — Integrate main at ae782ef9 during final review; nothing upstream moved

<!-- integration refs/dotln/checkpoint/WO-196/10 -->

```json
{
  "id": "WO-196-D015",
  "date": "2026-10-07",
  "dispatch": "resume: final review; worktree integrate WO-196",
  "decision": "Integration mechanics are complete in the final-review worktree. Fetched main equals the base, ae782ef9, so the merge moved nothing, no authored conflict arose and no component version collides. The named stash re-applied this order's uncommitted work. The regeneration changed only documents: this record, docs/evidence/WO-196/meta.json, the PR meter and the decisions index. Every source byte equals the dispatch checkpoint 9, so VER-002's evidence carries forward unchanged. D016 records the one source edit this review made after integration.",
  "evidence": [
    "refs/dotln/checkpoint/WO-196/10",
    "base ae782ef9d76f538434d1eff42090b164456dacff",
    "upstream ae782ef9d76f538434d1eff42090b164456dacff",
    "release preparation: WO-196 target v0.69.0 remains current. Files changed: docs/evidence/WO-196/meta.json, docs/final-reviews/WO-196/PR.md. Meter snapshot: docs/evidence/WO-196/meta.json, 4125 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-10-07. Original base: `ae782ef9d76f538434d1eff42090b164456dacff`.
Fetched main: `ae782ef9d76f538434d1eff42090b164456dacff`. Checkpoint: `refs/dotln/checkpoint/WO-196/10`.
Named stash retained: `9a83872adcb0959d11841e1102e12ff3ba2cfec5` (WO-196 integrate 2026-10-07).
Resolved projections: none.
Release preparation: WO-196 target v0.69.0 remains current. Files changed: docs/evidence/WO-196/meta.json, docs/final-reviews/WO-196/PR.md. Meter snapshot: docs/evidence/WO-196/meta.json, 4125 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer. Main did not move, so integration introduced no upstream path. A full-tree comparison through a temporary index against refs/dotln/checkpoint/WO-196/9 (the dispatch checkpoint, whose code bytes VER-002 judged at identity 8017b3c5) and /10 differs only in docs/evidence/WO-196/decisions.md, docs/evidence/WO-196/meta.json, docs/final-reviews/WO-196/PR.md and docs/lineage/decisions-index.md, plus the generated control projections against checkpoint 9. Criteria 1 to 9 carry forward on VER-002's evidence; this review's own gates judge the subject after D016.
Authored conflicts observed: none.
Affected checks were printed by the command (npm test -- --review, npm run publication:check, node scripts/harness.mjs check, npm run release -- check-surfaces --local) and executed by this review, as FINAL-001 records.

## WO-196-D016 — Remove the unused runGit import during final review

```json
{
  "id": "WO-196-D016",
  "date": "2026-10-07",
  "dispatch": "resume: final review; adjacent repair of D014's follow-up",
  "decision": "Remove runGit from the scripts/docs-check.mjs import and keep runGitPathList. D014 named WO-196 reaching final review with the import unused as its reopening condition, and scripts/docs-check.mjs is a declared surface of this order, so the defect is repaired in the order rather than left on the register. The edit changes the code identity, so this review runs a fresh npm test -- --review after it.",
  "evidence": [
    "After the edit, grep -cE '\\brunGit\\b' scripts/docs-check.mjs prints 0; runGitPathList is still used once. Every other import of the file is still referenced (per-identifier count).",
    "node --check scripts/docs-check.mjs passes, and node scripts/harness.mjs bounded -- node scripts/docs-check.mjs exits 0: 15 product documents, 0 failures, and the five operator-word advisories VER-002 also observed on the real corpus.",
    "The operator, during this review: the decision about the unused import must be immediate."
  ],
  "rejected": [
    {
      "option": "Keep the import on the register for a later order",
      "reason": "D014's reopening condition names this final review, and the file is inside the order's declared surfaces. The fix is one line, while the fresh review gate it cost took 1,797.84 s (38 of 38 suites, 88 fresh tasks, exit 0, recorded 2026-10-07T16:33:48.047Z), which this review accepts."
    }
  ],
  "reopens": {
    "decisionId": "WO-196-D014",
    "observation": "WO-196 reached final review with the runGit import still unused; this review removed it."
  },
  "reopenWhen": "npm run test:docs or npm test -- --review fails on scripts/docs-check.mjs at the reviewed identity."
}
```
