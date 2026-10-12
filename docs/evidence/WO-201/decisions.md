# WO-201 decisions

## WO-201-D001 — Verify the carried build and determine exclusions by execution

```json
{
  "id": "WO-201-D001",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Implement the order's detected kit mode in the existing runner: a manifest and no package build configuration select kit-verify in place of the build. Verify every manifest-listed dist file, including compiled tests; other kit changes are advisory. Run every suite in a disposable export before declaring core-only inputs. Preserve the existing tracked-tree code identity and core's format-before-build behavior; a kit verifies before formatting or any other task. Carry the compiled tests recursively with their public fixture data and executable doubles.",
  "evidence": [
    "docs/work-orders/WO-201-export-runs-core-suites.md: design and execution steps 1 through 5",
    "scripts/launchpad.mjs readPriorManifest, readDestination, readRuntime and KIT_FILES; scripts/lib/paths.mjs hasPackageSources; scripts/test-runner.mjs suites and scheduleSuites",
    "Read-only source inventory: packages/kernel/test/fixtures, packages/compiler/fixtures and packages/skeleton/fixtures; compiled resident/worker fixture processes live under dist/test/fixtures and travel recursively. The reactor-host-import.ts fixture belongs to an omitted production-source audit and is not carried."
  ],
  "rejected": [
    {"option": "NoOp", "reason": "The carried scripts still try to compile omitted package sources."},
    {"option": "A separate kit runner, a configuration switch, or skipping every needsBuild row", "reason": "The manifest and package-source predicate already establish the boundary; runtime-dependent suites can use the carried build."},
    {"option": "Carry package TypeScript or emulate core's historical reports", "reason": "Both break the order's platform/instance boundary."},
    {"option": "Reuse a passing kit verification without executing it", "reason": "Each gate must first check the carried files against the current manifest."}
  ],
  "reopenWhen": "A carried suite acquires a new input, a missing input is ordinary portable test data rather than core history/source, or a manifest verification negative control does not refuse."
}
```

Goal alignment: do not turn a bad probe environment into a core-only declaration; confirm the failure's input. Do not hide an export recursion by dropping all tests; declare only rows requiring source/history the kit omits. NoOp leaves the build failure. These traps were named before implementation.

## WO-201-D002 — Carry formatting configuration; correct the initial probe environment

```json
{
  "id": "WO-201-D002",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Carry .prettierignore and .prettierrc.json as manifest-listed verbatim kit files so the format task uses core's existing rules, excluding compiled output and preserving fixture bytes. Correct the exploratory probe's DOTLN_LAUNCHPAD override: it incorrectly redirected subprocesses that deliberately created their own fixture repositories back to the export. Its resume, checkpoint and work-orders-fixtures errors do not establish core-only dependencies and must be rechecked without the override.",
  "evidence": [
    "Initial export probe: format reports 413 files, including generated dist and data, without .prettierignore; github-body fails reading .prettierrc.json. Core's .prettierignore already excludes dist, authored records and pinned fixture bytes.",
    "scripts/lib/config.mjs findLaunchpad checks the environment override first; scripts/test-dependency-resume.mjs, test-checkpoint.sh and test-work-orders.mjs run copied commands against their own fixture repositories without clearing an inherited override. The exploratory script supplied that override; the production fixture does not."
  ],
  "rejected": [
    {"option": "Declare format core-only", "reason": "These two small configuration files are portable kit inputs; excluding the formatter would remove a useful check unnecessarily."},
    {"option": "Format the compiled output or recorded data", "reason": "That would break byte identity and core's existing format policy."},
    {"option": "Exclude rows solely on the contaminated probe's authority-path errors", "reason": "Those errors came from the probe's environment, not from established missing core inputs."}
  ],
  "reopenWhen": "Normal-environment probes reveal an additional required input, or the formatting rules stop being portable."
}
```

## WO-201-D003

```json
{
  "id": "WO-201-D003",
  "date": "2026-10-12",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.77.0, the next minor above the observed release baseline v0.76.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.76.1 (local tags)",
    "minor classification declared in docs/work-orders/WO-201-export-runs-core-suites.md"
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

## WO-201-D004 — Keep the role-qualification oracle with its core report

```json
{
  "id": "WO-201-D004",
  "date": "2026-10-12",
  "dispatch": "resume: next; FUP-e624167a7f6555f6",
  "decision": "Exclude scripts/fixtures/wo138-local-role-qualification.json from the kit and declare its local-runner-double row core-only. The oracle is public, but the suite actually reads the core verification report from which it was derived; carrying the oracle alone cannot make the row portable. Retain ordinary package fixture data and executable doubles, and the compiler tests' two imported corpus helper modules, with their existing public bytes. Do not carry production TypeScript or historical evidence to satisfy source audits.",
  "evidence": [
    "scripts/probes/local-model-role-qualification.mjs t1Input reads fixture().t1.source, docs/verifications/WO-052/VER-001.md; local-model-role-qualification.test.mjs invokes it directly for the six labeled criteria and through taskInputs",
    "Initial export execution of local-runner-double exits 1; the selected core report is not a kit input. WO-074 D011 identifies this exact derived fixture and allocates the choice to the order running kit suites.",
    "packages/compiler/test/artifact-identity.test.ts and source-bundle.test.ts import corpus/harness/id-corpus-lib.mjs, whose sole relative import is wo101-support.mjs. These helper modules contain portable test code, unlike the source/document assertions in the complete package rows."
  ],
  "rejected": [
    {"option": "Admit the oracle and copy its source report", "reason": "That would copy core's instance history to satisfy the suite, contrary to the order's non-goal."},
    {"option": "Exclude all scripts/fixtures or all package fixtures", "reason": "Portable behavioral fixtures are kit inputs; exclusions need the specific missing core input."}
  ],
  "reopens": {"decisionId": "WO-074-D011", "observation": "WO-201 executes the suite in an export and selects explicit fixture exclusion rather than admitting a derived core-report oracle."},
  "reopenWhen": "The role-qualification row is refactored to use self-contained synthetic inputs rather than the core verifier report."
}
```

## WO-201-D005 — Preserve the README's intent without claiming pending behavior

```json
{
  "id": "WO-201-D005",
  "date": "2026-10-12",
  "dispatch": "resume: next; criterion 5",
  "decision": "Land the planning document's instance-ownership and true-fork sentences, qualified where the draft describes future or broader behavior: planning inside a fresh kit is pending WO-202; update preview is pending WO-203; verify refuses compiled-file drift and only warns for other kit files; explicitly opted-in instance actions keep their own checks. Keep the local edits/update explanation in place and document the suite lists from execution.",
  "evidence": [
    "docs/planning/three-repository-route-2026-10-11.md section 7 drafted text; WO-201 non-goals reserve planning commands and update preview to WO-202 and WO-203",
    "WO-201 design and criterion 4 require dist mismatches to refuse; scripts/launchpad.mjs planUpdate retains prior hashes for refused local edits and planInstanceActions validates opted-in instance actions"
  ],
  "rejected": [
    {"option": "Copy the future-tense capability claims as currently available", "reason": "Would contradict the command surface and this order's own exclusions."},
    {"option": "Implement planning or preview here", "reason": "Those are separate authorized work orders, not this order's scope."}
  ],
  "reopenWhen": "WO-202 or WO-203 ships, or the runtime verification/update contract changes."
}
```

## WO-201-D006 — Carry portable corpus inputs and generate the instance's own projections

```json
{
  "id": "WO-201-D006",
  "date": "2026-10-12",
  "dispatch": "resume: next; observed suite inventory",
  "decision": "Add the identity corpus entry test, its manifest and two synthetic vector files, and the three mutation self-test modules to the explicit kit file set. Their first export executions failed at absent entry files; source inspection establishes portable inputs, so rerun them with those inputs instead of declaring them core-only. Activate the seeded WO-001 and run meta in the gate fixture, following the README's first steps, to generate the work-order and decision indexes from this instance's own records. Never copy core's indexes or history to satisfy those checks.",
  "evidence": [
    "corpus/harness/wo101-id-corpus.test.mjs reads corpus/manifests/WO-101.json and corpus/fixtures/ids/{stable-hash,command-id}-vectors.jsonl through wo101-support.mjs; its runtime import is the carried kernel dist",
    "corpus/mutation/wo108-selftest.test.mjs imports enumerate.mjs and mutate.mjs and constructs its own synthetic package sources; mutate.mjs imports the already-carried build-free gate-deadlines module",
    "scripts/lib/meta.mjs writeDecisionsIndex requires the instance's generated decisions index even when there are zero decisions; absent budgets are optional and empty followups need no file",
    "The clean second batch's planning/refutation, runner and edition failures name omitted source files, original planning inputs or historical Git objects; planning inside an instance remains the separate WO-202 scope"
  ],
  "rejected": [
    {"option": "Exclude every corpus row because its entry script was omitted", "reason": "An omitted portable fixture is a kit-input gap, not proof of a core-history dependency."},
    {"option": "Copy core's generated decision index or current evidence file", "reason": "These are instance-owned records and would misrepresent the new instance's history."},
    {"option": "Seed empty planning records just to make pending planning checks pass", "reason": "Instance planning enablement belongs to WO-202; the gate reports those uncarried inputs rather than emulating a planning history here."}
  ],
  "reopenWhen": "A suite's observed required inputs change, or WO-202 enables the instance's own planning checks."
}
```

## WO-201-D007 — Preserve verifier diagnostics and select mode from the target repository

```json
{
  "id": "WO-201-D007",
  "date": "2026-10-12",
  "dispatch": "resume: next; interim read-only review",
  "decision": "Forward kit-verify's kit diagnostics on a successful gate, and derive the default build row from runGate's repository argument. Keep the module's exported suite table detected from its own root, while preserving the existing explicit-repository gate API.",
  "evidence": [
    "Read-only worker review found that the runner only forwarded successful ADVISORY/NEWER lines and would hide verifyKit's kit-edit notice",
    "runGate accepts a repository argument but the initial build row used only the module root; the mode could disagree with filtering in an imported call",
    "scripts/test-runner.test.mjs now checks a core-imported list against a kit repository; scripts/test-launchpad.mjs checks an edited script's advisory through a passing gate"
  ],
  "rejected": [
    {"option": "Rely on the verifier's direct CLI output only", "reason": "The gate is the normal entry point and must deliver the promised advisory."},
    {"option": "Remove the explicit-repository API", "reason": "Existing callers and fixtures use it; selecting the row from that argument is a smaller compatible fix."}
  ],
  "reopenWhen": "Gate output or repository-selection semantics change."
}
```

## WO-201-D008 — Keep historical publication samples with their recorded judgments

```json
{
  "id": "WO-201-D008",
  "date": "2026-10-12",
  "dispatch": "resume: next; observed suite inventory",
  "decision": "Declare reader-fixtures core-only with its historical publication examples and their recorded comparison. Retain registrations after adding launchpad.mjs to the document-gate fixture stub registry. Declare github-body core-only after its clean rerun reaches the missing outward-vocabulary control record; adding the formatter configuration fixed only its earlier prerequisite.",
  "evidence": [
    "Clean export execution: reader-fixtures has two failures copying docs/publication/examples; its README explicitly identifies v0.73.1 historical samples and inconsistencies in published verification accounts; comparison.json holds an independent reviewer judgment bound to those core release examples",
    "Clean export execution: registrations names an unstubbed document suite, kit-verify running scripts/launchpad.mjs; scripts/lib/document-gate-stubs.mjs owns this registry",
    "Clean export execution: github-body's twenty synchronous cases pass, then its asynchronous parser-backed formatter check fails reading docs/control/outward-vocabulary.json"
  ],
  "rejected": [
    {"option": "Carry core's scored publication examples as if they were synthetic fixture data", "reason": "They preserve real core publication history and reviewer judgments, unlike the synthetic corpus vectors. The order leaves such history in core."},
    {"option": "Exclude registrations", "reason": "Its failure is missing support for the new verifier command, not a core-only input."},
    {"option": "Call github-body portable because its synchronous cases passed", "reason": "The complete row fails on a core control record; partial case success is not suite success."}
  ],
  "reopenWhen": "Publication tests use self-contained synthetic examples, or the instance independently provisions those editorial inputs."
}
```

## WO-201-D009 — Preserve suite rows and make the observed exclusions explicit

```json
{
  "id": "WO-201-D009",
  "date": "2026-10-12",
  "dispatch": "resume: next; every-suite export probes",
  "decision": "Retain the existing suite boundaries. Of 72 rows, 46 declare their specific uncarried inputs and 26 remain carried, including kit-verify in place of build. Whole package rows stay core-only because they combine runtime cases with source audits or recorded product evidence; the compiled tests still travel byte-identically, without inventing kit-specific name filters. Keep checkpoint, work-orders-fixtures, configuration-root and codex-continuation after their clean reruns pass. Exclude resume only after the clean run reaches WO-030's actual legacy lifecycle/timing observations.",
  "evidence": [
    "docs/evidence/WO-201/suite-inventory.json records one actual export execution of every declared row, with the corrected second batch taking precedence for affected rows",
    "The first bounded inventory completed 56 rows before its outer 900126 ms timeout; the reported surviving pids no longer existed when checked. The clean second batch completed 24 rows in 416251 ms with exit 0 at the wrapper (individual missing-input failures retained)",
    "Clean second batch: checkpoint 8951 ms, work-orders-fixtures 24439 ms, configuration-root 6161 ms and codex-continuation 7296 ms all exit 0; resume exits 1 after 84220 ms naming docs/evidence/WO-030/legacy-fold.json and legacy-times.json",
    "Package rows read kernel source and README, compiler source-bundle source, skeleton source-audit targets, or core document/evidence records; console and browser-evidence packages are not shipped"
  ],
  "rejected": [
    {"option": "Mark all needsBuild rows core-only", "reason": "Many script suites operate successfully on the carried runtime."},
    {"option": "Invent per-case kit filters inside the existing package rows", "reason": "The order specifies row declarations for suites with unavailable inputs; an alternate subset would obscure the shared inventory."},
    {"option": "Treat the initial contaminated failures as exclusions", "reason": "Four affected rows passed in the corrected environment."}
  ],
  "reopenWhen": "A suite is split upstream, acquires or loses required inputs, or an instance provisions its own currently unseeded planning/editorial surfaces."
}
```

## WO-201-D010 — Record actual gate durations and exported bytes

```json
{
  "id": "WO-201-D010",
  "date": "2026-10-12",
  "dispatch": "resume: next; measured export gates and byte growth",
  "decision": "Accept the measured kit file-set growth to carry byte-identical tests and portable inputs. The revised export has 863 manifest-listed files and 15969109 listed-file bytes, compared with 605 files and 9793574 bytes exported by the pre-order HEAD implementation: +6175535 bytes. The newly admitted files contribute 6150768 bytes; excluding the WO-138 oracle removes 3947, for +6146821 bytes from file-set changes alone. The balance is changes to existing kit files, including the README and command code. One export serves all three selections; the instance is activated and its own decision index generated before the gates.",
  "evidence": [
    "docs/evidence/WO-201/gate-in-kit.json preserves the baseline source commit, measurement date, current export totals and three passing gate rows",
    "The baseline and revised measurements both sum manifest-listed file bytes, excluding the manifest itself, instance seeds, installs and ignored snapshots; both use the fixture remote and v9.9.9-fixture tag",
    "The final focused three-selection case takes 91884 ms, with npm test 55497 ms wall / exit 0, npm run test:docs 16918 ms wall / exit 0, npm test -- --review 12458 ms wall / exit 0. The encompassing focused run takes 97868 ms and passes three tests, including byte-identical runtime/test rebuild and direct verify controls.",
    "The review selection composes passing product tasks at the same ordinary code identity and executes every remaining carried machinery row; kit-verify is always fresh. The three-selection union covers all 26 carried rows."
  ],
  "rejected": [
    {
      "option": "Remove the synthetic ID vectors or compiled test outputs to reduce bytes",
      "reason": "Would break the portable corpus row or the explicit compiled-test deliverable."
    },
    {
      "option": "Export separately for each selection",
      "reason": "The order requires one shared export; the retained task evidence demonstrates normal passing-row composition."
    },
    {
      "option": "Call the three wall durations all fresh suite execution",
      "reason": "The review row truthfully records reused tasks, as the existing runner does in core."
    }
  ],
  "reopenWhen": "A portable input can be reduced without losing coverage or the gate/task growth exceeds its recorded benefit."
}
```

## WO-201-D011 — Retain the three selections and record the full task's cost

```json
{
  "id": "WO-201-D011",
  "date": "2026-10-12",
  "dispatch": "resume: next; handoff timing watch",
  "decision": "Retain all three required export gate selections and record the launchpad task at 409254 ms in the passing full review gate. This exceeds twice the order's recorded 49691 ms median (99382 ms threshold). The added three-selection case accounts for 233320 ms of this run; the existing export-update case accounts for 94391 ms. Keep the existing cold-gate follow-up FUP-e96221b106cd136a, and the order's FUP-b531e850b70f6d4e watch, visible for final review and subsequent planning rather than cutting acceptance coverage to recover the old time.",
  "evidence": [
    "docs/evidence/WO-201/core-gates.json: npm test -- --review exits 0 at 2026-10-12T06:00:25.103Z, 32 required suites and 84 fresh tasks, total 1434599 ms; launchpad exits 0 in 409254 ms",
    "The launchpad task records one reserved host lane and three concurrent peers at its start. Its new case takes 233320.024333 ms under this gate versus 91884 ms in the focused bounded run. This establishes the added case's contribution; it does not isolate all scheduling and existing-case cost differences.",
    "The source change adds the three gates and enlarges the exported kit from 9793574 to 15969109 manifest-listed bytes. Existing export/update cases also copy and verify that larger kit. The recorded slowest existing case takes 94390.787084 ms; no controlled measurement attributes all of its cost to this change.",
    "The full review gate's vertical task, not launchpad, finishes last; the task-growth watch nevertheless holds on the stated median comparison."
  ],
  "rejected": [
    {"option": "Drop a gate selection or reuse three separately prepared exports", "reason": "Would violate the order's explicit coverage and one-export requirements."},
    {"option": "Claim the whole difference from the old median is this order's isolated regression", "reason": "The recorded median predates other export cases and is not a controlled before/after run at this host load."},
    {"option": "Redesign cold-gate scheduling in this order", "reason": "The named watch requires measured cause and preserved coverage; scheduler structural cuts remain in the existing planning follow-up."}
  ],
  "reopenWhen": "Final review or the next cold-gate planning pass evaluates FUP-e96221b106cd136a using this above-threshold handoff observation."
}
```

## WO-201-D012 — Judge the matching follow-ups without widening the order

```json
{
  "id": "WO-201-D012",
  "date": "2026-10-12",
  "dispatch": "resume: next; handoff follow-up readback",
  "decision": "Read all 21 pending textual matches from plan followups --touching. D004 decides FUP-e624167a7f6555f6; D011 records the fired task-growth watch FUP-e96221b106cd136a. Leave the other 19 existing rows in their register for their named seams or observations; no new defect was established by this readback. Final review owns the dispositions of the allocated or reopened rows.",
  "evidence": [
    "npm run plan -- followups --touching and its two printed cursors: register revision ef7d22508bc0055163ddb4e161e1db3fa39901f423eed0e50a25d3ed8b40505e, 21 matches, all three pages read",
    "FUP-06de60fa5d19fe5a, FUP-0c10689747f83675, FUP-369525016cc270e1 and FUP-b28b870422a74166 concern operator identity or gate identity/control inputs. This order changes neither their configuration consumers nor gateCodeIdentity; the fresh document gate covers the legal write-back.",
    "FUP-5094b24d6d68d2e4, FUP-d0a9719cc2e4ec55, FUP-de6162b279f66709, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a and FUP-f5f10101e717d59b concern existing case reporting, descendant ownership, lifecycle lane admission, other reporter consumers, guard termination or harness evidence. The kit selection and verifier ordering changes do not modify those named consumers. FUP-642d7a4beaed2272's format-preflight failure did not recur: runner-fixtures passes in the full gate.",
    "FUP-441469088613e52a, FUP-4b70089b028849f0, FUP-9b0632b0ec72d168, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-cc27c2c1a82fed2c, FUP-fb8cbeabbddef397 and FUP-fd05316b6030ef73 match broader product, generated, export or runner paths; their named absence experiment, planning trigger handling, phrase convergence, attribution, authority evidence, release-close findings, document-gate median or standing writer text is not changed here."
  ],
  "rejected": [
    {"option": "Treat every textual path match as a newly reproduced defect", "reason": "The feed explicitly supplies pointers for judgment, not verdicts, and the order has a bounded deliverable."},
    {"option": "Silently ignore the above-threshold launchpad observation", "reason": "The order expressly owns that watch; D011 records its measured contributors and existing planning route."}
  ],
  "reopenWhen": "A named follow-up's actual condition is observed, or an authorized order opens its specific consumer."
}
```

## WO-201-D013 — Verification: fail on an unfounded core-only declaration; criteria 2 and 5 are unmet

```json
{
  "id": "WO-201-D013",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on F1. Criteria 1, 3, 4, 6 and 7 are met at code identity 24c91fedcdc1add00076f814bc1536ebd2c9ad352d9498749095709d3c50cfa3; criteria 2 and 5 are unmet. F1 (blocking): publication-fixtures is declared kit: \"core-only: core publication audience index and outlines\", but scripts/test-publication.sh builds its own fixture repository and writes its own audience index, outline and edition files. Every input it reads is a carried scripts/ file, and the row passes in a clean export. The order's objective runs every suite whose inputs the kit carries, and its design admits a declaration only for a row that fails for want of a core-only input, decided by execution. The README therefore gives that row an unobserved reason. F2 (follow-up): in a kit, npm test -- --only <declared row> exits 0 and records a passing suite:<row> gate row whose only executed task is kit-verify.",
  "evidence": [
    "F1, clean export of the subject: a committed source copy of the worktree, exported (863 kit files, 23 seeds, no package source), committed, installed offline, WO-001 activated and meta run, with DOTLN_LAUNCHPAD, CLAUDE_EFFORT, CODEX_THREAD_ID and COPILOT_AGENT_SESSION_ID cleared. The kit's own runGate with the table's kit declarations removed runs --only publication-fixtures: kit-verify 0.13 s and publication-fixtures 1.06 s pass, exit 0 (2026-10-12, under harness bounded).",
    "F1, source: scripts/test-publication.sh lines 1-60 create $test_root/repo, copy scripts/check-publication.mjs and scripts/lib, and run scripts/test-beacon-fixture.mjs; lines 80-136 write docs/publication/audience-status-index.md, base-outline.md and both edition files into that fixture repository. It reads no core document.",
    "F1, origin: docs/evidence/WO-201/suite-inventory.json records publication-fixtures exit 1 from the initial batch only. D002 names that batch's DOTLN_LAUNCHPAD override as contaminating suites that build their own fixture repositories, and only some affected rows were rerun.",
    "F1, boundary: the same clean export reruns 42 of the 46 declared rows. The other 41 fail on their declared inputs. The remaining four (resume, plan-refutation, runner-fixtures, process-debt) rest on the executor's clean second batch, which ran without the override, and were not rerun here. Examples of the declared inputs: outward-vocabulary.json (195 vertical cases), docs/LEGAL.md, docs/releases/tag-manifest.template.json, tsconfig.json, packages/*/src sources and README, packages/console, docs/lineage/idea-ledger.md, docs/AI-HARNESS-SECURITY.md, docs/evidence/current.json, docs/control/reader-profiles.json, docs/publication/examples and the excluded WO-138 fixture. release-surfaces still fails on docs/LEGAL.md pins and the release block once the seed heading carries a version. skeleton and harness-fixtures fail on source-audit and Entropy Reducer history cases.",
    "F1 is the WO-201 planning receipt's criterion:2 reopening condition: a row declared core-only although every input it reads is carried in KIT-MANIFEST.json.",
    "F2, same export: npm test -- --only publication-fixtures exits 0 and the last gate row is checkId suite:publication-fixtures, exitCode 0, requiredSuites [kit-verify]. Only meta.mjs's legacy step count reads suite: rows, so no lifecycle gate consumes it.",
    "Planning observation, not a finding: D011's launchpad task at 409254 ms exceeds twice the 123776 ms pre-order reading, the planning receipt's criterion:1 reopening condition. D011 records the measured contributors and keeps all three selections, which discharges the order's own carry-in."
  ],
  "rejected": [
    {"option": "Judge criterion 2 met because the printed set equals the declared set", "reason": "That reading admits any declaration. The objective and design admit only rows that need a core-only input, decided by execution, and the clean execution shows this row needs none."},
    {"option": "Route F1 as a follow-up", "reason": "It leaves a carried product suite out of every instance gate and writes a false reason into the kit README, contrary to criteria 2 and 5, inside the declared surfaces."},
    {"option": "Require the every-row inventory inside the gate fixture", "reason": "The repair rule binds declarations to clean execution evidence; adding roughly 15 minutes of inventory to the launchpad task would worsen the recorded task-growth watch."},
    {"option": "Fail on F2", "reason": "It breaks no criterion and no behavior main had; main could not run any selection in a kit."}
  ],
  "reopens": {"decisionId": "WO-201-D009", "observation": "One of D009's 46 declarations, publication-fixtures, is not supported by a clean execution: the row passes in the kit. Of the other 45, 41 fail on their declared inputs in this verification's clean export, and four rest on the executor's clean second batch."},
  "followup": "WO-201 resume: fix. (F1) Declare no row core-only unless a clean export execution of that row fails for want of its named input. Remove the publication-fixtures declaration so the row runs in the kit's npm test and review selections. Rerun it in a clean export and correct suite-inventory.json. Bring the client README lists and table, the capability-table reassessment, gate-in-kit.json and the handoff and decision figures (26 carried / 46 declared) to the corrected inventory. Keep the three-selection fixture's assertions that printed exclusions equal declarations, the observed union covers every undeclared row and the README lists equal the observed selections. Check: npm test -- --only launchpad, npm test -- --review and npm run test:docs. (F2, boarded) In a kit, --only <declared row> either refuses naming the declaration or records no passing row named for a suite that did not run.",
  "reopenWhen": "A repair changes any kit declaration or the kit selection; a clean export rerun shows another declared row passing in a kit; or a kit --only selection records a suite row whose suite did not execute."
}
```

## WO-201-D014 — Correct the exclusion using clean execution evidence

```json
{
  "id": "WO-201-D014",
  "date": "2026-10-12",
  "dispatch": "resume: fix; VER-001 F1",
  "kind": "correction",
  "misread": "The initial inventory treated publication-fixtures as needing core publication documents even after the DOTLN_LAUNCHPAD contamination was identified. D009 and the original handoff then overclaimed that all affected exclusions had been cleanly rechecked.",
  "meant": "A core-only declaration needs a clean export failure on its named uncarried input. A suite that constructs its own fixture documents must run when its actual inputs travel in the kit.",
  "changed": "Remove the publication-fixtures declaration, restore it to the README product and review lists, independently assert portable rows in the export fixture, and correct the inventory and handoff to 27 carried rows and 45 exclusions.",
  "decision": "Remove the publication-fixtures exclusion and its README reason; include it in the product and review lists. The current 72-row inventory has 27 carried rows and 45 excluded rows. Retain clean verification evidence for 41 exclusions and the clean second batch for the remaining four. Add explicit export assertions for publication-fixtures and beacon-portability, independently of the exclusion table, while preserving exact selection, README and exclusion comparisons. The original D009 counts and D010 measurements describe the pre-repair subject; the refreshed gate-in-kit.json and repair measurement decision govern this handoff.",
  "evidence": [
    "docs/verifications/WO-201/VER-001.md F1: clean execution disproves publication-fixtures; 41 other clean executions fail on their declared inputs, with the stated execution limits; resume, plan-refutation, runner-fixtures and process-debt retain the executor clean-second-batch evidence.",
    "scripts/test-publication.sh creates its fixture repository, audience index, outlines and edition files using carried scripts; scripts/test-beacon-portability.mjs uses carried inputs and creates its own fixture records.",
    "Bounded three-selection export fixture, 2026-10-12T06:46:58.087Z to 06:48:35.880Z: exit 0, 27 carried / 45 excluded, publication-fixtures executes fresh in 1258 ms in npm test and is reused in review at the same code identity."
  ],
  "rejected": [
    {
      "option": "NoOp or merely change the README reason",
      "reason": "Would continue omitting an executable product suite and leave criteria 2 and 5 unmet."
    },
    {
      "option": "Infer portability only from suite names or matching declarations to printed lists",
      "reason": "That circular check admitted this defect; actual clean execution and independent carried-suite assertions establish the behavior."
    },
    {
      "option": "Repeat every excluded suite inside each export gate fixture",
      "reason": "The clean evidence already covers every remaining declaration; repeating that exploratory inventory would add substantial gate cost without addressing a changed input."
    }
  ],
  "reopenWhen": "A suite declaration or its required inputs change, a clean export runs an excluded row successfully, or a carried fixture fails after environment overrides are cleared."
}
```

## WO-201-D015 — Refuse an unavailable explicit suite request before recording evidence

```json
{
  "id": "WO-201-D015",
  "date": "2026-10-12",
  "dispatch": "resume: fix; VER-001 F2; adjacent-0001",
  "decision": "In kit mode, an explicit --only request for a core-only suite throws with its name and declaration before any task or gate result is created. Apply the same refusal to --list. General selections still list and skip declared rows; core selection is unchanged. Record the behavior in the kit README and the existing product 03 kit paragraph, with refreshed publication locks.",
  "evidence": [
    "docs/verifications/WO-201/VER-001.md F2 and scripts/test-runner.mjs: filtering removed the requested row, inserted kit-verify and retained the requested suite checkId.",
    "The primary export fixture reached a passing boundary; an optional asynchronous scope check received no steering before the adjacent queue was reread and started at revision 4. Queue observations are actor-attested.",
    "The operator subsequently replied Include both findings (Recommended), confirming the F1 and F2 repair scope.",
    "Bounded runner tests at 2026-10-12T06:50:45Z: two tests pass, including explicit requests for kernel, publication and runner-fixtures with and without --list; no gate checks or active gate markers remain.",
    "scripts/test-launchpad.mjs also exercises the real exported npm CLI for publication and runner-fixtures and asserts unchanged gate history; the final export and core gates judge those cases."
  ],
  "rejected": [
    {
      "option": "NoOp or defer a fix to the same small selection branch",
      "reason": "Would retain a known passing result for a suite that never ran; the existing runner and export checks bound the repair."
    },
    {
      "option": "Exit successfully but suppress the suite row",
      "reason": "Would still tell a caller requesting one suite that the request succeeded when it did not execute."
    },
    {
      "option": "Run the declared unavailable suite anyway",
      "reason": "Would discard the declared missing-input boundary instead of explaining it."
    }
  ],
  "reopenWhen": "A kit explicit selection records evidence for a suite that did not execute, or the declaration/selection contract changes."
}
```

## WO-201-D016 — Refresh export measurements without dropping coverage

```json
{
  "id": "WO-201-D016",
  "date": "2026-10-12",
  "dispatch": "resume: fix; refreshed export evidence and local release preparation",
  "decision": "Record the repaired export at 863 manifest-listed files and 15971669 listed-file bytes, +6178095 bytes over D010's unchanged pre-order baseline. Net file-set growth remains 6146821 bytes; the repair changes existing kit files. Keep the three gate selections in one export and retain the application target v0.77.0; no component or dependency manifest changed.",
  "evidence": [
    "scripts/test-launchpad.mjs; bounded focused repair fixture, 2026-10-12T06:54:36.137Z to 2026-10-12T06:55:56.493Z; three tests passed",
    "The three-selection case takes 74490 ms. npm test: exit 0, 42362 ms wall, 15 required suites; npm run test:docs: exit 0, 14565 ms wall, 11 required suites; npm test -- --review: exit 0, 10501 ms wall, 22 required suites.",
    "publication-fixtures executes fresh in 958 ms in the product selection; review reuses that pass at the same kit code identity. The union covers all 27 carried rows and every list prints 45 exclusions. publication and runner-fixtures explicit requests each exit 1 and append no gate result.",
    "The focused run also passes byte-identical dist/src and dist/test rebuild comparisons and direct verification controls for compiled drift and advisory-only script edits.",
    "The first combined focused run passed the rebuild and direct verification tests but its negative-selection wrapper failed to register the held launcher (monitor-unavailable, Cannot register exited process). scripts/test-runner.mjs holds that launcher until registration; the requested command did not run. An unchanged rerun passes all three tests. The host census failure cause is unknown; no selection assertion was weakened and no monitor code changed.",
    "npm run release -- prepare --local: WO-201 target v0.77.0 remains current; observation is local tags only. npm run publication:check: 254 of 254 headings indexed and both source locks current."
  ],
  "rejected": [
    {
      "option": "Reuse D010 byte and timing figures as current",
      "reason": "The repair changes manifest-listed runner, fixture and README bytes; the new export measurement is the current subject."
    },
    {
      "option": "Drop the negative control or the bounded wrapper after the monitor startup failure",
      "reason": "The failed command never started; the unchanged rerun exercises the intended assertion successfully."
    },
    {
      "option": "Bump a component for a scripts-only repair",
      "reason": "No component source changed; the order already prepares the classified application release."
    }
  ],
  "reopenWhen": "The kit file set or bytes change again, the monitor failure recurs on a reproducible input, or final review evaluates the retained launchpad task-growth watch."
}
```

## WO-201-D017 — Record the repaired subject and complete review evidence

```json
{
  "id": "WO-201-D017",
  "date": "2026-10-12",
  "dispatch": "resume: fix; final repair handoff",
  "decision": "Record both VER-001 findings repaired, with all seven acceptance criteria met by the current executable evidence. Preserve the three-selection export and its task-growth watch; the full launchpad task remains above twice both the historical median and the pre-order reading. Independent verification and final review retain their separate judgments and follow-up dispositions.",
  "evidence": [
    "docs/evidence/WO-201/core-gates.json: npm run test:docs passes 35 suites in 113629 ms; npm test -- --review passes 32 suites / 84 fresh tasks in 1206139 ms at code identity 77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d.",
    "The passing review gate records launchpad at 328008 ms, including the three-selection export at 191260 ms and the existing export-update case at 74466 ms. At task start its peers were skeleton, target-publish, target-worktree, with one reserved host lane. The focused export case took 74490 ms; different concurrency prevents attributing all timing differences to this repair.",
    "D014 corrects the unfounded publication-fixtures exclusion and the current 27 / 45 inventory. D015 repairs the false passing --only result, with additional unavailable product, document and machinery cases and real exported CLI refusals. D016 records fresh runtime, byte and gate evidence.",
    "The existing FUP-b531e850b70f6d4e and FUP-e96221b106cd136a watches remain for final review/planning; the 99382 ms median-based threshold and 247552 ms pre-order-reading threshold are both exceeded. No selection or assertion was removed to reduce the measured time.",
    "Executor separate criteria and design review found no additional issue. This repair spawned no agents; the implementation workers' reports remain historical. All probes and gate commands finished, both log monitors were stopped, and the pre-gate material inventory found zero nested repositories."
  ],
  "rejected": [
    {
      "option": "Claim a performance improvement from the earlier full-gate duration",
      "reason": "The observations used different concurrent workloads; they establish coverage and measured cost, not an isolated speedup."
    },
    {
      "option": "Skip remaining unchanged suites after the targeted repair tests pass",
      "reason": "Criterion 7 requires the complete review selection at the repaired code identity."
    }
  ],
  "reopenWhen": "Independent verification finds another unsupported exclusion or phantom suite pass, or final review changes the subject or evaluates the retained cost watches."
}
```

## WO-201-D018

<!-- integration refs/dotln/checkpoint/WO-201/10 -->

```json
{
  "id": "WO-201-D018",
  "date": "2026-10-12",
  "dispatch": "resume: final review; worktree integrate WO-201",
  "decision": "Integration took in nothing: the base and the fetched main are both 69f830ba2495d94b663c623c318291bb44351570, origin/main names the same commit, origin lists no wo-201 branch, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-201/10), retained its named stash 66618bf3dd1336e91ef527643aade9267d07c6d4, took the intake backup from a fresh npm run backup:intake of the three ignored intake files into the session scratch, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main; harness check passes with 34 surfaces), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. Every acceptance claim is carried forward unchanged: VER-002's seven criterion judgments at code identity 77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d, the executor's passing npm test -- --review row at that identity (2026-10-12T07:20:34.115Z, 32 suites, 84 fresh tasks, exit 0), VER-001's two findings as repaired by D014 and D015 and reproduced by VER-002, and the executor's zero-finding repair self-review. gateCodeIdentity returns the same identity after integration. Release preparation keeps application v0.77.0 under the order's minor classification: local tags and origin both end at v0.76.1, which names the base commit, and neither lists v0.77.0; check-surfaces --local reports no component bump required for any of the six workspaces, and package.json, package-lock.json and packages/*/package.json are not in the diff, so no component version or dependency collides. No evidence edition is registered to this order (scripts, kit templates and documents changed; packages/* did not), so integration owes no re-mint. The printed affected checks all pass on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-201/10",
    "base 69f830ba2495d94b663c623c318291bb44351570",
    "upstream 69f830ba2495d94b663c623c318291bb44351570",
    "git ls-remote origin main wo-201 at 08:31Z: refs/heads/main 69f830ba; no wo-201 ref; git log main..HEAD empty",
    "release preparation: WO-201 target v0.77.0 remains current. Files changed: docs/evidence/WO-201/meta.json, docs/final-reviews/WO-201/PR.md. Meter snapshot: docs/evidence/WO-201/meta.json, 4045 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-12T08:32:57Z to 08:33:06Z, each exit 0: npm run publication:check (254/254 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.77.0 against latest local tag v0.76.1; six components src unchanged, no bump required), git diff --check, npm run format:check, node scripts/lineage.mjs index --check, node scripts/check-publication.mjs --print-locks. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity after integration: 77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d; git diff --stat main -- .claude .agents .codex is empty"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-12. Original base: `69f830ba2495d94b663c623c318291bb44351570`.
Fetched main: `69f830ba2495d94b663c623c318291bb44351570`. Checkpoint: `refs/dotln/checkpoint/WO-201/10`.
Named stash retained: `66618bf3dd1336e91ef527643aade9267d07c6d4` (WO-201 integrate 2026-10-12).
Intake backup: `DotLn-wo201-intake-20261012T083220Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-201 target v0.77.0 remains current. Files changed: docs/evidence/WO-201/meta.json, docs/final-reviews/WO-201/PR.md. Meter snapshot: docs/evidence/WO-201/meta.json, 4045 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's seven criterion judgments and the executor's passing review row at code identity `77dc3935…`, which the integrated tree keeps; VER-001's F1 and F2 as repaired (D014, D015) and reproduced by VER-002; the executor's repair self-review (found 0). No acceptance claim changed, because no judged byte changed.
Authored conflicts observed: none.
Affected checks: run under the bounded wrapper on the integrated tree, all exit 0 (evidence above); the review gate is in FINAL-001's executed checks.

## WO-201-D019 — Final review: pass FINAL-001 at the integrated subject; the task-growth watch returned to planning; the allocated rows disposed

```json
{
  "id": "WO-201-D019",
  "date": "2026-10-12",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass FINAL-001. All seven criteria are met at code identity 77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d, the identity VER-002 passed and the integrated tree keeps. The verification sequence is VER-001 (fail: F1, an unfounded publication-fixtures core-only declaration, blocking; F2, a kit --only request on a declared row recording a passing suite row, follow-up), the repair (D014 removed the declaration and corrected the inventory to 27 carried and 45 declared; D015 refuses the request before any record, taken into the repair as adjacent work with the operator's confirmation) and VER-002 (pass, both repairs reproduced in a clean export, no new finding). This review reread the whole diff and the write-backs, confirmed both verification report hashes against their control events, and ran the fixture's two WO-201 cases and the extended WO-075 rebuild case itself under the bounded wrapper at the integrated tree (3 of 3 pass, 72.3 s): inside a fresh source-free export npm test, npm run test:docs and npm test -- --review exit 0 with kit-verify first (40.2 s, 12.0 s and 9.6 s wall; the review composing 13 passing tasks at the kit's unchanged identity), the printed not-carried set equals the table's 45 declarations and the carried union is exactly the 27 undeclared rows, the two unavailable --only requests exit 1 and append no gate row, an edited script passes one advisory line through the gate, a one-byte change to packages/kernel/dist/test/ac1-purity.test.js refuses the gate by path with kit-verify the only executed case, and the kit lists 863 files at 15971669 bytes, the figures D016 records. The core runner at this worktree lists build and prints no kit line. This review found no new defect; the findings block is empty. Register: FUP-8fb7ae17dd0fad5b (WO-074 D007) and FUP-e624167a7f6555f6 (WO-074 D011), both allocated here, are settled by what the change did; FUP-8ea5ac7538fe92d8 (D013's repair rule) and FUP-0cff4c27b1874d9d (D009, reopened by D013) are settled on D014, D015 and VER-002; FUP-b531e850b70f6d4e (the order's launchpad task watch) and FUP-e96221b106cd136a (cold-gate structural cuts) are returned to open, because their reopening condition occurred at this order's handoff: the launchpad task read 409254 ms in the implementation-ready review gate and 328008 ms in the repair's passing review gate, above twice the 49691 ms thirty-day median (99382 ms) and twice the pre-order 123776 ms reading (247552 ms); D011 and D017 record the contributors (the three-selection case 191260 ms and the existing update case 74466 ms under three concurrent peers; the focused case alone 67.6 s to 74.5 s) and all three selections are retained as the order requires. Planning receipt 044's criterion-1 known issue has therefore occurred and is planning's through those two rows; its criterion-2 condition occurred at VER-001's subject (F1) and not at this one, and VER-002's observation stands that the fixture independently binds only two portable rows, so a future false declaration rests on the clean-execution rule D014 records rather than on the gate; its criterion-5 condition did not occur, because the section 7 sentences name no suite. One bounded document correction by this review, within the order's declared capability-table surface and outside any behavior: the WO-201 reassessment row's clause that independent re-verification and final review remain pending is replaced by the sequence's outcome; publication:check passes after it. No code byte was edited.",
  "evidence": [
    "docs/verifications/WO-201/VER-001.md (sha256 c5b9ac30…, equal to its VerificationCompleted reportHash) and VER-002.md (sha256 c4b8e5ca…, equal to its reportHash); docs/control/orders/WO-201.jsonl",
    "Bounded node --test --test-name-pattern='WO-201|WO-075 criterion 1' scripts/test-launchpad.mjs, 2026-10-12T08:33:19Z to 08:34:32Z, exit 0: 3 tests, 3 pass; WO201_GATE_IN_KIT diagnostic: selections 40235, 12003 and 9581 ms wall, firstTask kit-verify each, review executionMode composed with 9 fresh and 13 reused tasks, notCarried 45, carried 27 (lists equal to docs/evidence/WO-201/gate-in-kit.json), unavailableSelections publication and runner-fixtures exit 1 gateRecorded false, refusal packages/kernel/dist/test/ac1-purity.test.js exit 1, kitFiles 863, kitBytes 15971669, addedFiles 259, addedBytes 6150768, netFileSetGrowthBytes 6146821, durationMs 67594",
    "node scripts/test-runner.mjs --list at this worktree: build present, 0 lines starting kit:; the imported suites table has 72 rows, 45 with kit declarations matching /^core-only: \\S/, 27 without; every declaration's name and reason appears as a row of the README template's table (45 rows); docs/evidence/WO-201/suite-inventory.json: 72 rows, 27 carried, 45 core-only, each core-only row carrying cleanExclusionEvidence",
    "Canonical gate rows at code identity 77dc3935…: npm test (review, fresh, 32 suites, exit 0, 2026-10-12T07:20:34.115Z, 1206139 ms; launchpad 328008 ms with peers skeleton, target-publish and target-worktree) and four npm run test:docs rows (fresh, 35 suites, exit 0)",
    "docs/planning/refutations/2026-10-11-planning-fb68306765535a9d-044.json result.orders[3]: three known issues on criteria 1, 2 and 5 with their reopening conditions; docs/planning/followups.json rows FUP-8fb7ae17dd0fad5b, FUP-e624167a7f6555f6, FUP-b531e850b70f6d4e, FUP-e96221b106cd136a, FUP-8ea5ac7538fe92d8 and FUP-0cff4c27b1874d9d read in full; npm run plan -- followups --touching: 23 textual matches over three pages, all read",
    "D018: integration took in nothing; affected checks pass; gateCodeIdentity unchanged"
  ],
  "rejected": [
    {
      "option": "Rerun the full product gate fresh instead of composing at the unchanged identity",
      "reason": "No judged code byte changed since the executor's passing review row and VER-002; the order names npm test -- --review at final review, and the handoff sequence runs it, where it reuses the passing tasks at that identity. This review paid for its own bounded run of the fixture's WO-201 cases instead."
    },
    {
      "option": "Board VER-002's two-portable-row observation as a follow-up of this order",
      "reason": "It is planning receipt 044's criterion-2 condition, already planning's; D014 records the rule (declare no row core-only without a clean export failure on its named input) and D013 declined the roughly fifteen-minute every-row inventory inside the gate. No criterion is broken and no behavior main had."
    },
    {
      "option": "Settle the two task-growth rows because the order recorded the cause",
      "reason": "The order's carry-in asked for the cause recorded and no selection dropped, which D011 and D017 did; the growth itself, and the bound the receipt asks for across WO-202, WO-203, WO-207, WO-208 and WO-209, is a planning decision. Returning both rows to open makes the fired condition visible to the next pass."
    },
    {
      "option": "Leave the capability table's pending clause for a planning pass",
      "reason": "The clause would be false on main at merge; the correction is a status sentence in a surface the order declared, not a behavioral edit."
    }
  ],
  "reopenWhen": "A clean export runs a declared row or fails at a build task, a kit --only request records a row for a suite that did not run, a planning pass disposes the six register rows named here and finds this record's reading of them wrong, or the capability table's launchpad.starter row is contradicted by an instance's own gate."
}
```
