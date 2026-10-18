# WO-216 decisions

## WO-216-D001

```json
{
  "id": "WO-216-D001",
  "date": "2026-10-17",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.84.0, the next minor above the observed release baseline v0.83.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.83.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-216-no-gate-fails-late-on-bookkeeping.md"
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

## WO-216-D002 — Preserve historical role snapshots for the new handoff policy

```json
{
  "id": "WO-216-D002",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Mint wo216-role-baseline.json for both economy-support settings, link wo215-role-baseline.json by its exact SHA-256 and retain its upstream chain. Replace executor and verifier gate instructions with structural and Preflight rows; final review starts and awaits one fresh complete review after integration. The order authorizes this role-oracle change; sync deliberately cannot mint it.",
  "evidence": [
    "WO-216 steps 13–15 and criterion 12; WO-215-D010 establishes the separate-oracle route.",
    "contributor.ts supplies the three role procedures; the compiler limits each procedure line to 2000 characters, so the evidence duties remain two complete lines."
  ],
  "rejected": [
    {
      "option": "Rewrite the old snapshot",
      "reason": "Historical instructions must remain byte-exact."
    },
    {
      "option": "Allow sync to bless current role bytes",
      "reason": "It would replace the independent reference without the authorizing decision."
    }
  ],
  "reopenWhen": "A subsequent authorized role edit changes the generated instructions; preserve this snapshot and mint the next linked oracle."
}
```

## WO-216-D003 — Classify the changed runtime without publishing it

```json
{
  "id": "WO-216-D003",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Keep the application minor target assigned by D001; bump @dotln/skeleton from 0.59.1 to 0.60.0 and the harness host contract from 0.35.2 to 0.36.0 for the new role handoff behavior and stop diagnostics. Update the console workspace pin and lockfile, retaining private packages and publication refusal.",
  "evidence": [
    "WO-216 release classification; packages/skeleton/src/loadouts/contributor.ts and harness-host.ts are the changed package sources."
  ],
  "rejected": [
    {
      "option": "Bump every workspace",
      "reason": "Unchanged components have no compatibility change."
    },
    {
      "option": "Leave the changed component at its released version",
      "reason": "Release checks require a changed component version and the new role behavior deserves a minor classification."
    }
  ],
  "reopenWhen": "A compatibility change requires a different release classification before review."
}
```

## WO-216-D004 — Judge bookkeeping before starting selected suites

```json
{
  "id": "WO-216-D004",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Run format, configuration-root, registrations, declarations, generated and host in that order for every selection. Keep each generated child check and deadline in the shared inventory. Check compiled-runtime freshness before generated consumers load it; sync rebuilds stale source/output receipts. NoOp would leave stale compiled role checks able to bless the wrong source. The gate never regenerates its subject.",
  "evidence": [
    "WO-216 design, steps 2–4 and criteria 1–4.",
    "The base timings and root failure rows are recorded in README.",
    "The real declarations probe found two missing configured-control fixture inputs, license-surfaces.mjs and siblings.mjs; both the declaration and copy loop now include them."
  ],
  "rejected": [
    {
      "option": "Only sort existing rows",
      "reason": "Copied fixture closures and host pressure would remain uncovered."
    },
    {
      "option": "Build or regenerate inside the structural check",
      "reason": "A check must not rewrite what it judges."
    },
    {
      "option": "Read generated checks from an unqualified old build",
      "reason": "The check would judge different code from the current source."
    }
  ],
  "reopenWhen": "A structural check fails to name stale input before a suite starts, or the five-close measurements fail the reversal in D011."
}
```

## WO-216-D005 — Stop launching work at the first failure

```json
{
  "id": "WO-216-D005",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Default scheduling stops admitting tasks after the first failure, lets already running tasks finish and records failedFirst and unrunSuites. --keep-going restores scheduling of independent tasks; a failed prerequisite still cannot be bypassed. Host pressure refuses measured warning or critical values and records unknown values as unknown.",
  "evidence": [
    "WO-216 design and criteria 4–5.",
    "Runner fixtures exercise an in-flight slow task, a failing peer, an unstarted dependent and --keep-going."
  ],
  "rejected": [
    {
      "option": "Fail fast only for structural work",
      "reason": "A late product failure wastes the remaining gate time too."
    },
    {
      "option": "Kill every running task on a peer failure",
      "reason": "It discards completed work and needlessly complicates cleanup."
    },
    {
      "option": "Change the pressure-sensitive watchdog fixture",
      "reason": "The order keeps its real host dependence; admission catches measured pressure first."
    }
  ],
  "reopenWhen": "A failure starts a new task, a running task is lost, or measured pressure enters a suite despite the refusal."
}
```

## WO-216-D006 — Consume focused rows at handoff and a fresh review row after dispatch

```json
{
  "id": "WO-216-D006",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Read every --only token in the Preflight field including wrapped lines. Executor, repair and verification consume structural, focused and document rows at the current code identity, carrying every evidenceRef; a complete passing row remains valid. Final review with a met npm test claim requires gateSelection review, reusedSuites 0 and a row recorded after its own FinalReviewRequested event. Target gates retain their existing route.",
  "evidence": [
    "WO-216 criteria 10–11 and steps 11–12.",
    "The resume fixture passes missing, failed and wrong-identity focused rows through all three handoffs and refuses stale, plain and reused final review rows."
  ],
  "rejected": [
    {
      "option": "Carry rows across a source edit",
      "reason": "The order rejects cross-identity reuse and input binding."
    },
    {
      "option": "Preflight and then a complete gate at every role",
      "reason": "That preserves the repeated full-gate cost this order removes."
    }
  ],
  "reopenWhen": "A handoff accepts a missing, failed or different-identity row, or final review accepts an earlier or composed complete run."
}
```

## WO-216-D007 — Split launchpad by case groups with separate clocks

```json
{
  "id": "WO-216-D007",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Split export and verification, update and refresh, and seeds and staging into three files sharing the fixture setup. Each launchpad:file row reserves two of four host slots and owns its 900-second deadline. Preserve the exact 29 base case names, with the document case still selected separately.",
  "evidence": [
    "WO-216 step 10 and criterion 9.",
    "The case-set and scheduler fixture passed: 29 equal names and peak two concurrent file tasks."
  ],
  "rejected": [
    {
      "option": "Increase the suite deadline",
      "reason": "It would preserve a single accumulating clock."
    },
    {
      "option": "Split unrelated suites",
      "reason": "The order bounds the cut to launchpad."
    }
  ],
  "reopenWhen": "A file exceeds its own bound or the complete case set changes unintentionally."
}
```

## WO-216-D008 — Regenerate deterministically while preserving manual authority

```json
{
  "id": "WO-216-D008",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Use one ordered check/write/check inventory for npm run sync. Format first, rebuild stale compiled runtime, refresh indexes and release surfaces, emit the harness, select checked new evidence revisions, carry feedback only when its judged sources allow it, repin console selfhost references and update printed publication locks. Refuse role oracles and baseline fingerprints with their route. The existing harness-evidence command has no writer or edition selector: it checks the generated harness and immutable historical live observations, which are retained.",
  "evidence": [
    "WO-216 design and steps 7 and 17.",
    "Inspection of scripts/harness-evidence.mjs finds a check-only historical bundle, unlike the four versioned evidence tools.",
    "Feedback carry checks judged source identity before writing an immutable new edition."
  ],
  "rejected": [
    {
      "option": "Overwrite an old evidence edition",
      "reason": "It erases historical observations."
    },
    {
      "option": "Mint an oracle or new live feedback judgment automatically",
      "reason": "Those need the separate authorizing decision or episode."
    },
    {
      "option": "Invent a fifth harness evidence --write mode",
      "reason": "No such edition contract exists; the existing live evidence must stay intact."
    }
  ],
  "reopenWhen": "The harness evidence tool gains an authorized edition contract, a carry needs a live episode, or a second sync changes a current artifact."
}
```

## WO-216-D009 — Retain interrupted work without supplying a pass

```json
{
  "id": "WO-216-D009",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "On request, SIGINT, SIGTERM or SIGHUP, synchronously retain one stopped row containing only tasks completed before the stop. Record nothing before any task completes; stopped rows answer no claim. Apply the bounded D055 timestamp repair: order an impossible future finish at recordedAt and refuse its pass.",
  "evidence": [
    "WO-216 criteria 7–8; WO-213-D055 temporal-ordering defect.",
    "The bounded stop fixture passed all four stop routes both before and after a completed task; the future-finish fixture rejects the impossible pass."
  ],
  "rejected": [
    {
      "option": "Drop every stopped run",
      "reason": "It loses timing and completed-task observations."
    },
    {
      "option": "Reuse stopped results",
      "reason": "An interrupted run never completed its claim."
    },
    {
      "option": "Trust a future finishedAt",
      "reason": "It can outrank later failure evidence indefinitely."
    }
  ],
  "reopenWhen": "An interrupted or impossible execution supplies a pass, or cancellation loses a completed task."
}
```

## WO-216-D010 — Keep the named withdrawals bounded and remove eager kit classification

```json
{
  "id": "WO-216-D010",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Keep the D042 fixture change withdrawn: the new host precondition supplies the ordered remedy. Leave D064 shell-scanner work dormant while the shell entry has no comment and declarations finish normally. Resolve the reached runner part of WO-213-D074 F2 by constructing the build row at command selection rather than module import; malformed kit input remains a relative command refusal. The other F2 integration/release predicates are outside this selected runner repair.",
  "evidence": [
    "WO-216 known issues and step 4 explicitly select the reached runner part of F2.",
    "The real declarations probe completed in 263 ms after the missing-copy repair.",
    "The runner inventory previously evaluated buildSuite(root) while importing the module."
  ],
  "rejected": [
    {
      "option": "Restore the withdrawn scanner and pressure-mock changes",
      "reason": "The order explicitly keeps those withdrawals and names their reopening observations."
    },
    {
      "option": "Expand to every adjacent integration and release predicate",
      "reason": "The selected bounded repair is the runner import-time decision."
    }
  ],
  "reopenWhen": "A shell machinery entry gains a comment, declarations stalls, pressure still reaches the fixture despite admission, or the remaining integration/release malformed-kit route is encountered."
}
```

## WO-216-D011 — Judge cost after five closes with the recorded instrument

```json
{
  "id": "WO-216-D011",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Read main’s readGateChecks rows for the five closes after WO-216: complete runs per closed order against 11, structural-class failures in runs longer than two minutes per closed order against 1.3, and gate task minutes per closed order against 545. Reopen the design if any statistic is not below its baseline. Handoff timings in README measure this execution only and do not claim a five-close outcome.",
  "evidence": [
    "WO-216 Cost line and FUP-182984d482ca59ca.",
    "README preserves the base failure timeline, three check timings and handoff observations."
  ],
  "rejected": [
    {
      "option": "Claim savings from isolated check timings",
      "reason": "Those timings do not observe completed orders."
    },
    {
      "option": "Bind acceptance to a duration target",
      "reason": "The order expressly records durations without a timing threshold."
    }
  ],
  "reopenWhen": "Any named statistic is not below its baseline over the five closes, or the instrument cannot distinguish complete, focused and stopped runs."
}
```

## WO-216-D012 — Spell the existing Preflight obligations explicitly

```json
{
  "id": "WO-216-D012",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Under the operator’s resume: next authorization to implement WO-216, expand this order’s existing Preflight shorthand to explicit npm test -- --only tokens for the same thirteen named suites. Step 11 requires that field’s explicit tokens to define the completion obligation. readPreflightSuites intentionally reads those tokens, not prose inference or examples elsewhere. The suite obligations, all fifteen criteria and scope are unchanged. Bind this necessary execution normalization through plan amend-order; it grants no scope expansion or planning verdict.",
  "evidence": [
    "WO-216 step 11 specifies every --only token of the Preflight field; the original field named twelve of its thirteen suites in shorthand.",
    "The parser fixture covers wrapped commands, duplicate names and an unrelated field.",
    "The document gate at 2026-10-17T21:01:26.535Z passed the structural phase and refused plan-refutation-current with existing work-order bytes changed. Product 07’s execution-amendment route binds the current order and this individual decision while preserving the judged receipt and its holds."
  ],
  "rejected": [
    {
      "option": "Infer suite names from free prose",
      "reason": "It would make the required selection depend on ambiguous wording."
    },
    {
      "option": "Run only the one originally explicit token",
      "reason": "It would omit the other suites the order already required."
    }
  ],
  "reopenWhen": "The work-order format adopts a different explicit machine-readable Preflight declaration."
}
```

## WO-216-D013 — Correct the feedback cost premise against the judged source list

```json
{
  "id": "WO-216-D013",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Run one fresh feedback self-host using codex-cli-exec, gpt-6.1-sol at max, after the last host-resources edit, then record a new immutable feedback edition and repin console references. Product 07 Operator-opened planning pass authorizes an owed live episode in the executor session without another operator authorization. The order’s no-model-run premise missed its required host-resources edit. This corrects that premise, not the acceptance criteria. Count the one live verifier and two required review workers within the session cap of 20.",
  "evidence": [
    "Step 3 requires exporting pressureSample from scripts/lib/host-resources.mjs. packages/skeleton/src/feedback-audit.ts explicitly lists that file in FEEDBACK_SOURCE_PATHS.",
    "The first sync refused feedback carry with StaleFeedbackEdition after the pressureSample addition. The contributor and harness-host edits alone would not have owed a live episode.",
    "Product 07 explicitly requires one live self-host after a judged source edit and accepts its cost.",
    "The bounded live episode completed at 2026-10-17T20:41:17.214Z, exit 0, in 67,161 ms: phase complete, 10 fixtures and 1,192 fewer instruction bytes. feedback-evidence --write, --record-selfhost and --check for WO-216 revision 001 passed; the check confirmed ten passing regressions and ten removal failures. The selected manifest now points to that checked edition; older live evidence is retained."
  ],
  "rejected": [
    {
      "option": "Carry the old judgment despite changed source",
      "reason": "The carry check correctly refuses a different judged subject."
    },
    {
      "option": "Move the requested export elsewhere just to avoid the audit",
      "reason": "That would evade the declared dependency and the order’s named implementation seam."
    }
  ],
  "reopenWhen": "The judged sources change again before handoff, requiring another current-subject episode."
}
```

## WO-216-D014 — Correct the Preflight rewrite and cover cancelled host-lane waits

```json
{
  "id": "WO-216-D014",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Restore the unmodified design and all fifteen acceptance criteria from the base after detecting that my first Preflight replacement matched an inline mention. Keep only the explicit Preflight-field expansion from D012 and the assigned release label. Also treat a pending host-lane acquisition cancelled by fail-fast as an unstarted row, retaining the completed failure rather than throwing out the run.",
  "evidence": [
    "A reviewed git diff exposed the overbroad replacement before handoff; the corrected diff changes only the heading and Preflight field.",
    "executeTask previously caught an aborted host-lane wait only for stopRequested, although failedFirst also aborts the launch controller. The new fixture starts a failing peer and a waiting task, then confirms only the completed failure executed.",
    "The bounded targeted runner probe passed all three cases on 2026-10-17T20:39:58.046Z, including the cancelled host-lane wait."
  ],
  "rejected": [
    {
      "option": "Leave a changed or missing criterion as a prose correction",
      "reason": "The order is the acceptance authority; its original criteria must remain exact."
    },
    {
      "option": "Let a fail-fast acquisition abort reject the whole scheduler",
      "reason": "It would discard the completed rows needed for evidence."
    }
  ],
  "reopenWhen": "The field rewrite changes another section or a cancellation loses a completed result."
}
```

## WO-216-D015 — Close the independent review findings with executable cases

```json
{
  "id": "WO-216-D015",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Address all five worker findings (four distinct issues): make the narrow copied-file declarations drive actual copies; require each directory-covered entry and import to exist unless explicitly supplied as a double; retain execution exceptions from already-running tasks after fail-fast; and add an isolated repository integration case over the real generated-artifact inventory, real regeneration/refusal routes and runner stale/remedy recording. Share the existing edition-copy helper with evidence-sources rather than maintaining another clone procedure. Carry the new control-beacon JSON declaration as a kit test-support file because the compiled test reads it.",
  "evidence": [
    "The criteria adversary reported 3 findings; the design improver reported 2, including the duplicate copy-list issue. Their reports and limits are in self-review.md.",
    "The bounded runner probe passed the shared-copy missing-import repair, missing directory-covered entry/dependency, cancelled lane wait and already-running peer exception cases.",
    "The first real-inventory integration run reached and rejected a fixture mutation that did not actually change the oracle; the mutation now changes its actual historicalSha256 field. The fixture asserts each stale edit is real before claiming coverage.",
    "The compiled control-beacon test reads packages/skeleton/test/control-beacon-cli.fixture-inputs.json, while the kit carries compiled tests without the TypeScript test tree; TEST_SUPPORT_FILES now explicitly carries that JSON.",
    "The real-inventory case exposed two implementation gaps: inherited NODE_TEST_CONTEXT silently skipped the nested oracle test, and the release-history writer left the generated README claim stale. Artifact children now clear that test-worker marker. release sync-surfaces reuses the preparation planner to regenerate only the existing assigned claim and release history; it cannot assign or retime a version, and retains the planner’s containment and authored-prose refusals.",
    "The bounded full test-sync probe passed all four cases at 2026-10-17T20:56:14.409Z in 168,141 ms; the real-inventory integration case took 157,176 ms. It checked each real stale edit, the runner’s stale/remedy row, safe regeneration, all three actual manual refusal routes and byte-for-byte second-run stability."
  ],
  "rejected": [
    {
      "option": "Check a manifest independently of its copy list",
      "reason": "An updated declaration could bless a file that the executing fixture never receives."
    },
    {
      "option": "Use only injected sentinel checks for regeneration evidence",
      "reason": "Those cannot detect incorrect real commands or publication and edition effects."
    },
    {
      "option": "Treat every exception after fail-fast as an unstarted task",
      "reason": "A task that already began must retain its executed failure and diagnostic."
    }
  ],
  "reopenWhen": "A required input is admitted without being copied, a running failure is lost, or the real second sync changes bytes."
}
```

## WO-216-D016 — Keep the relocated launchpad helper classified as fixture code

```json
{
  "id": "WO-216-D016",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Keep the shared launchpad fixture helper’s deliberately fixed synthetic document paths outside the production configuration-root scan, just as its former test entry was excluded. Name only that moved helper, retaining the scan for all production scripts, and use the existing TOOL_ROOT constant instead of deriving a second repository root.",
  "evidence": [
    "The first document run stopped in configuration-root before any selected suite ran, naming the moved helper’s synthetic paths and root derivation.",
    "The second document run passed configuration-root and the full structural phase; its only executed failure was the separate planning-byte binding corrected in D012.",
    "The real working tree’s second sync at 2026-10-17T20:57:29.560Z reported all seventeen rows current with action none, in 23,615 ms."
  ],
  "rejected": [
    {
      "option": "Convert fixed synthetic fixture paths into production configuration consumers",
      "reason": "Those paths are intentional test inputs, preserved by the launchpad split; the error was the scanner’s test-code classification."
    },
    {
      "option": "Exclude every shared library helper",
      "reason": "Production helpers must retain the same configuration-root guard."
    }
  ],
  "reopenWhen": "Production code imports this fixture helper or the exclusion admits a production document-path consumer."
}
```

## WO-216-D017 — Preserve the legacy tests under the new runner contracts

```json
{
  "id": "WO-216-D017",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Update seven legacy runner and role assertions without changing production behavior: dependency-timeline and two-failure comparison fixtures explicitly request keep-going; the exclusive-lane fixture counts expanded file tasks; signal cleanup fixtures retain the completed build in a stopped row and still require task termination, a non-passing result and no ordinary completed gate; the carried-pass refusal test matches its preserved diagnostic facts alongside the new handoff guidance; the usage/role fixture checks structural and Preflight consumption plus a fresh review run, its wait command and refusal of partial review evidence.",
  "evidence": [
    "The first complete runner-fixtures selection passed 189 of 195 checks. The six failures named assumptions changed by this order; all newly added fail-fast, stop, declaration and launchpad cases passed.",
    "The bounded six-case compatibility probe passed at 2026-10-17T21:09:57.191Z in 4,302 ms; the full runner-fixtures selection then passed at 2026-10-17T21:13:58.914Z.",
    "The process-debt selection passed 136 of 137 checks and exposed the old complete-gate role-text expectation. Its focused usage/role case passes with the new assertions, retaining the existing usage-command and permission-boundary checks.",
    "The deadline implementation and both gate-evidence implementations remain unchanged; only the deadline test’s scheduling mode changes."
  ],
  "rejected": [
    {
      "option": "Restore continue-after-failure or discard stopped results to satisfy old assertions",
      "reason": "That would undo required behavior instead of maintaining the tests’ original evidence and cleanup duties."
    },
    {
      "option": "Remove the legacy cases",
      "reason": "They still establish independent timeline, process cleanup, aggregation and unavailable-main guarantees."
    }
  ],
  "reopenWhen": "An updated case no longer establishes its original timeline, cleanup or evidence guarantee."
}
```

## WO-216-D018 — Run structural checks against the exported kit's declared contents

```json
{
  "id": "WO-216-D018",
  "date": "2026-10-17",
  "dispatch": "resume: next",
  "decision": "Keep structural admission in exported instances. A declared package source also covers its corresponding compiled output, so a kit without TypeScript sources uses the same machinery declaration. Exclude the host-guard fixture declaration alongside its already excluded test, whose cadence corpus the kit does not ship. Keep checking every declaration actually carried; missing required files remain failures. Update the exported-instance case and client README to the six-task structural sequence, generated aliases and separate structural evidence row, preserving all 29 launchpad case names.",
  "evidence": [
    "The bounded exported-instance probe stopped at declarations on 2026-10-17T21:26:50.385Z, before kit verification: compiled files no longer mapped to absent TypeScript sources, and the copied host-guard declaration named seven unshipped corpus inputs.",
    "The next probe passed the instance's plain, document and review runs, plus the deliberate invalid-document refusal. It then exposed a legacy README comparison against the internal required-suite set order. The comparison now uses the runner's printed selection order; it retains the recorded requiredSuites unchanged.",
    "The declaration fixture now checks a missing compiled import, then its admission by the exact corresponding source declaration. All unshipped suite refusals remain explicit.",
    "The third exported-instance probe reached the altered compiled-test case and stopped in generated harness validation before kit-verify, reporting snapshot drift rather than the actual modified path. The kit's generated runtime child now runs the existing manifest verifier too, retaining the exact damaged path in the early refusal. Sync names the verified-export/update route instead of pretending it can rebuild absent sources.",
    "The bounded exported-instance case passed at 2026-10-17T21:33:29.368Z in 90,496 ms, including plain/document/review checks, invalid coordination records, unavailable selections, the edited-kit advisory and the exact modified compiled-file refusal.",
    "The first full launchpad selection exposed one further exact-list expectation: the lifecycle activation case omitted the newly required control-beacon fixture declaration from its expected kit files. The list now names that shipped JSON explicitly. The update file finished successfully in 248.99 seconds; fail-fast kept the not-yet-started seeds file unrun after the export-file failure.",
    "After that correction, the bounded activation case passed at 2026-10-17T21:39:39.147Z in 6,739 ms. The full launchpad selection passed at 2026-10-17T21:44:54.762Z: export 164,231 ms, update 247,940 ms and seeds 4,863 ms. The separate launchpad-docs selection also passed, retaining coverage of the document-tagged case."
  ],
  "rejected": [
    {
      "option": "Skip declarations or the structural phase for kits",
      "reason": "That would abandon the required early checks for a supported runner mode."
    },
    {
      "option": "Silently ignore absent entries or copy core-only corpus into every kit",
      "reason": "The first hides real omissions; the second expands the kit's established shipping boundary without a consumer need."
    }
  ],
  "reopenWhen": "A carried fixture loses a required input or a kit's printed selection and documented execution sequence disagree."
}
```

## WO-216-D019 — Verification: fail; criterion 15 is unmet because two suites outside the Preflight field fail at the subject

```json
{
  "id": "WO-216-D019",
  "date": "2026-10-18",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001. At code identity bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219, criteria 1 to 14 are met and criterion 15 is unmet. F1 (blocking, criterion 15): the skeleton suite fails on 'WO-179 and WO-195 emitted roles carry their assigned corrections across support settings' in packages/skeleton/test/executor-supports.test.ts, whose verifier branch still expects the sentence this order retired, 'Consume the executor's recorded passing npm test row when its code identity matches the subject'; 510 of 511 compiled skeleton tests pass. F2 (blocking, criterion 15): the harness-fixtures suite fails on 'WO-125 F3 runner refuses generated-hook writes throughout the gate and releases on exit' in scripts/test-harness.mjs. Its nested runGate(['--only', 'format']) inside the fixture repository now runs the six structural tasks; configuration-root cannot find scripts/test-configuration-root.mjs there, the four later tasks never start, the nested gate exits 1, and the case asserts 0 at line 3525; 171 of 172 cases pass. Both suites pass in main's latest complete review rows, both test files are in this order's diff, and neither suite is in the order's Preflight field, so the handoff rows never ran them. F3 to F5 are boarded follow-ups. F3: the Preflight fields of WO-217, WO-218, WO-219 and WO-220 name their suites in prose, each as `npm test -- --only <suite>`, which readPreflightSuites resolves to no suite, so implementation-ready for such an order records a met npm test -- --review claim on the structural and document rows alone. F4: the role-oracle generated check is node --test with a --test-name-pattern, and Node 26.9.0 exits 0 when the pattern matches no test, so a renamed or removed oracle case silently disables the staleness check. F5: the handoff rule consumed only the Preflight suites, so two suites whose test files this order changed failed unnoticed at handoff; the planning receipt's criterion 10 reopen condition is met in substance at the first order under the rule.",
  "evidence": [
    "F1: node --test over packages/skeleton/dist/test at the subject, under harness bounded: 511 tests, 510 pass, 1 fail. The assertion at source line 219 of packages/skeleton/test/executor-supports.test.ts expects /Consume the executor's recorded passing `npm test` row when its code identity matches the subject/ against the generated .claude/skills/dotln-verifier/SKILL.md for claude-code-2.1.263 with economy=true. npm test -- --only skeleton at the subject recorded FAIL skeleton 245.38 s in the row of 2026-10-18T00:18:07.900Z.",
    "F2: node --test scripts/test-harness.mjs at the subject under harness bounded: 172 tests, 171 pass, 1 fail. The failing case's captured gate output reads PASS format 8.20 s; FAIL configuration-root 0.05 s, Could not find 'scripts/test-configuration-root.mjs'; SKIP registrations, declarations, generated and host, Required configuration-root structural preflight failed; suite:format: 1 passed; 6 failed; 8.33 s; 2 fresh tasks; then 1 !== 0 at scripts/test-harness.mjs:3525. The sibling evidence and entry modes of the same case pass, as does WO-045 generated hooks reject malformed input before ordinary host effects. npm test -- --only harness-fixtures at the subject recorded FAIL harness-fixtures 296.31 s in the row of 2026-10-18T00:23:36.607Z.",
    "Main: readGateChecks over the registered main checkout shows its latest complete review rows (2026-10-17T14:06:48.986Z at identity b4079082...) with skeleton exit 0 in 306 s and harness-fixtures exit 0 in 369 s, so both failures are introduced by this subject.",
    "Coverage: the ImplementationReady event consumed one structural row, thirteen --only rows and one document row at bd4ef0fe...; skeleton and harness-fixtures are not among the thirteen Preflight suites. The changed test files packages/skeleton/test/executor-supports.test.ts, packages/skeleton/test/control-beacon-cli.test.ts and scripts/test-harness.mjs are owned by those two suites. The other suites owning changed test files pass at the subject: target-worktree 459.63 s, derived-orders 7.32 s, siblings-fixtures 11.16 s.",
    "F3: readPreflightSuites over the four queued orders returns an empty list for each (WO-217 line 154, WO-218 line 155, WO-219 line 163, WO-220 line 143); over WO-192 and WO-080 it returns 12 and 10 suites. A session-scratch fixture mirroring scripts/test-verifier-gate-claims.mjs, with an order whose Preflight field has WO-217's shape and with only a structural row and a document row recorded, refused implementation-ready while no row existed ('Handoff rows missing or failed: structural') and recorded ImplementationReady with productGate.evidenceRefs naming only those two rows once they did. The planning document's Rule beating trap paragraph foresaw that an order naming none would hand off on the structural phase alone and left the gap to the next pass's reading of the Preflight lines it files; the same pass filed these four fields.",
    "F4: a one-test scratch file run as node --test --test-name-pattern with a pattern matching no test reported tests 1, pass 1, fail 0 and exit 0 under Node v26.9.0; with the matching pattern its failing assertion exits 1. generatedArtifacts names the role-oracle check as node --test --test-name-pattern='optional economy support preserves historical snapshots' scripts/test-process-debt.mjs; that case exists today at line 6470, so criterion 3 holds at the subject.",
    "F5: planning receipt 2026-10-17-planning-69fa20e1554282a6-046 reopens its criterion 10 known issue when a final-review fresh complete row fails on a suite outside the order's Preflight line for a product defect; F1 and F2 are that failure, observed by verification probes before final review.",
    "Reproduced without finding, at the subject: the fourteen new runner-fixtures cases pass when run directly in 12.1 s; every --list selection (plain, --review, --only, --machinery, --document) leads with the six structural tasks once in STRUCTURAL_TASKS order and the document selection lists no generated alias; node scripts/structural-checks.mjs declarations, host and generated pass on the real tree with all sixteen generated checks current; npm run sync on the real tree reports seventeen rows current with action none and leaves the working tree's status digest and code identity unchanged; the launchpad case names at the base and after the split are the same 29 (24, 3 and 2 per file), each file row has its own 900 s deadline and two load slots; wo216-role-baseline.json's historicalSha256 equals the SHA-256 of wo215-role-baseline.json and both support settings are pinned; the executor, verifier and reviewer skills are byte-identical in both roots; npm run format:check, npm run meta -- --check, npm run harness -- check and git diff --check pass; gate-deadlines.mjs and both gate-evidence.mjs files are unchanged; the only dependency change is the @dotln/skeleton pin 0.59.1 to 0.60.0."
  ],
  "rejected": [
    {
      "option": "Pass VER-001 because criterion 15 says verification is judged on the handoff rows, which pass",
      "reason": "The criterion's substance is npm test -- --review green. Two suites the review selection runs fail at the subject, both pass at main, and both test files are in this order's diff. Product 07 §Verification review and attack makes a change that breaks behavior main had, shown by a probe, blocking."
    },
    {
      "option": "Route F3 as blocking",
      "reason": "Criterion 10 is implemented as step 11 specifies, every --only token of the field. The degenerate case lives in four other orders' text, outside this order's criteria and surfaces, and the planning pass recorded the gap; a defect outside both is boarded with its reproduction."
    },
    {
      "option": "Run the complete npm test -- --review at verification",
      "reason": "The order moves the complete gate to final review. The five --only rows for the suites owning changed test files establish the same facts in less time and leave the fresh complete run to the review."
    },
    {
      "option": "Spawn a worker to reproduce a claim",
      "reason": "Every probe ran in this session under harness bounded or as a focused gate."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D017",
    "observation": "D017 says the legacy runner and role assertions were updated without changing production behavior. Two legacy cases outside the Preflight suites were not updated: the skeleton emitted-roles case still expects the retired verifier sentence, and the harness WO-125 F3 runner case's nested focused gate now carries the structural phase into a fixture repository that lacks its inputs."
  },
  "followup": "WO-216 resume: fix. (F1) In packages/skeleton/test/executor-supports.test.ts, the verifier branch of 'WO-179 and WO-195 emitted roles carry their assigned corrections across support settings' expects the current sentence, 'Consume the executor's structural, Preflight suite and document rows when their code identity matches the subject', for both support settings; historical role oracles stay byte-exact. Check: npm test -- --only skeleton. (F2) In scripts/test-harness.mjs, the WO-125 F3 runner case's nested gate completes with exit 0 while the structural phase stays enabled in the runner: either declare and copy the structural inputs the nested --only format gate needs through scripts/test-harness.fixture-inputs.json, or give runGate an explicit table as scripts/test-sync.mjs does; keep the case's guarantee that generated hooks refuse writes throughout the held gate and release on exit. Check: npm test -- --only harness-fixtures. Then the Preflight suites, npm run test:docs and the handoff. (F3, boarded) Before WO-217 activates, its Preflight field and those of WO-218, WO-219 and WO-220 spell each suite as npm test -- --only <suite>, as D012 did for this order through plan amend-order; or requireGateClaims refuses a met npm test claim when the field yields no suite, naming the field. (F4, boarded) The role-oracle check in scripts/lib/generated-artifacts.mjs fails when no test ran, for example by requiring at least one pass in the TAP summary, or by calling a dedicated oracle comparison. (F5, boarded, for the planning pass) A handoff consumes --only rows for the Preflight suites only, while suites whose command file or declared source the diff touches can fail unnoticed until final review; the next pass decides whether changed-suite rows join the handoff gate, as changedMachinery already computes for machinery suites.",
  "reopenWhen": "A repair changes either fixture, the Preflight reader or the handoff claim rule; npm test -- --review at the repaired identity fails on a suite outside the order's Preflight field; or a queued order activates with a Preflight field that readPreflightSuites resolves to no suite."
}
```

## WO-216-D020 — Repair the role assertion and preserve gate-lock coverage

```json
{
  "id": "WO-216-D020",
  "date": "2026-10-18",
  "dispatch": "resume: fix; VER-001 F1 and F2",
  "decision": "Repair the two failing compatibility tests without reverting the structural phase or the focused handoff instructions. The emitted verifier test requires structural, Preflight and document rows across both economy settings and every harness profile, rejects the retired complete-row instruction, and requires focused probes. The gate-lock fixture supplies its own six structural tasks, a build and a held product task through the existing runGate table seam; all original write refusals and release assertions remain, and the product hold exercises the same hook protections after the structural phase.",
  "evidence": [
    "Before repair, the bounded emitted-roles case failed its retired-sentence assertion in 119 ms at 2026-10-18T01:48:43.788Z; after npm run build, the same case passed in 133 ms at 2026-10-18T01:50:45.648Z, covering both support settings and all contributor profiles.",
    "Before repair, the bounded runner gate-lock case failed in 8263 ms at 2026-10-18T01:48:56.274Z because configuration-root was absent from the minimal fixture. After the explicit table and product-phase hold, it passed in 20980 ms at 2026-10-18T01:49:54.396Z. Its recorded structural row contains all six tasks executed with exit zero.",
    "scripts/test-sync.mjs already uses runGate options.table for an isolated structural contract; scripts/test-runner.mjs leaves production STRUCTURAL_TASKS and default suite selection enabled. No historical oracle is edited.",
    "VER-001 correctly found that the previous handoff did not exercise skeleton or harness-fixtures. Their complete focused suites join the required checks in this repair; the final-review complete gate remains a separate dispatch."
  ],
  "rejected": [
    {
      "option": "Restore the retired verifier instructions or omit structural admission from the production runner",
      "reason": "That would undo the behavior WO-216 requires and weaken the tests to hide the finding."
    },
    {
      "option": "Make this gate-lock fixture copy the entire generated-artifact corpus",
      "reason": "It tests gate lifetime and write protection, not artifact freshness. The existing explicit task-table seam keeps that subject isolated and adds a product-phase observation; real structural checks remain exercised by runner-fixtures and sync-fixtures."
    }
  ],
  "alignment": "The traps are treating a passing targeted probe as the final handoff and reducing lock coverage while changing fixture setup. Run both complete affected suites plus every declared Preflight suite at the final code identity, preserve the original refusal assertions, and exercise a product hold. NoOp retains both reproduced blockers.",
  "reopens": {
    "decisionId": "WO-216-D017",
    "observation": "Two compatibility tests outside the declared Preflight set were not updated by the original implementation; the current repair closes both reported failures and adds product-phase lock and retired-wording coverage."
  },
  "reopenWhen": "Either complete affected suite fails, a generated verifier again requires the retired complete-row handoff, or a gate input can be changed during either held phase."
}
```

## WO-216-D021 — Retain the queued-order and handoff-policy planning obligations

```json
{
  "id": "WO-216-D021",
  "date": "2026-10-18",
  "dispatch": "resume: fix; VER-001 follow-up dispositions",
  "decision": "Keep VER-001 F3 and F5 as planning work. F3 needs amendments to the four queued orders or an explicitly chosen stricter claim contract; F5 changes the standing handoff policy. Neither is necessary to repair this order's two blockers, and this repair does not silently rewrite judged work orders or broaden the declared handoff contract. F4 is taken as the bounded generated-artifact repair in adjacent-0001.",
  "evidence": [
    "VER-001 and WO-216-D019 reproduce the empty Preflight parse in WO-217 through WO-220 and record the planning receipt's reopening condition for changed suites outside Preflight.",
    "WO-216 step 11 defines the current parser as every --only token in the Preflight field; product 07 requires those tokens in filed orders. This repair will run skeleton and harness-fixtures in addition to every declared suite, but changing the global rule needs a planning decision.",
    "The generated role-oracle command and its missing-test weakness are within WO-216's declared structural surface, so F4 can be repaired without changing workflow policy."
  ],
  "rejected": [
    {
      "option": "Rewrite WO-217 through WO-220 or reject every empty Preflight field during this repair",
      "reason": "The former changes other judged orders without a captured scope expansion; the latter changes the contract criterion 10 explicitly defines."
    },
    {
      "option": "Require every changed suite at all future handoffs now",
      "reason": "That revises the planning choice this order implements; the reopening evidence belongs to the next planning decision."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D019",
    "observation": "F1 and F2 are repaired and under validation; the bounded F4 repair is scheduled. F3 and F5 remain explicit planning obligations with the reproductions in VER-001."
  },
  "followup": "Planning before WO-217 activates: resolve VER-001 F3 by authorizing explicit --only suite tokens in the Preflight fields of WO-217, WO-218, WO-219 and WO-220, or choose and test a stricter empty-field claim rule. Resolve F5 by deciding whether suites owning changed tests or declared sources must join handoff evidence; use the first-order skeleton and harness-fixtures failures as the reopening evidence. Paths: those four work orders, scripts/lib/handoff-ledger.mjs, scripts/test-runner.mjs and product 07 Preflight guidance. Checks: parser fixtures, lifecycle claim fixtures and the affected focused suites.",
  "reopenWhen": "A planning pass addresses these two policy gaps, or one of the four queued orders is about to activate without explicit suite tokens."
}
```

## WO-216-D022 — Require execution of the role oracle

```json
{
  "id": "WO-216-D022",
  "date": "2026-10-18",
  "dispatch": "resume: fix; adjacent-0001; VER-001 F4",
  "decision": "The generated role-oracle artifact check runs its existing comparison through Node TestsStream and requires exactly one top-level passing test with the oracle's exact name, no skip or TODO marker, no suite wrapper and no failure. Keep the existing oracle implementation and historical snapshots unchanged. The shared generated inventory and sync command use this same checked command; sync still refuses to mint an oracle.",
  "evidence": [
    "Current official Node documentation fetched through Context7 (/nodejs/node, doc/api/test.md) says name-filtered tests not executed are omitted and reporter text is not a supported programmatic contract; TestsStream provides structured execution events. Source: https://github.com/nodejs/node/blob/main/doc/api/test.md.",
    "The bounded regression at 2026-10-18T01:52:30.526Z passes eight real child-process scenarios in 638 ms: passing oracle accepted; renamed, removed, skipped, TODO, failing, duplicate and empty-suite cases refused. It invokes the command from the real generated artifact inventory through checkArtifact.",
    "The actual historical oracle passed through the new command at 2026-10-18T01:52:18.563Z in 420 ms. No oracle or current generated role bytes were changed.",
    "The bounded structural declarations probe passed at 2026-10-18T01:52:30.910Z in 279 ms. The new checker and literal fixture input are declared in the affected machinery inventories."
  ],
  "rejected": [
    {
      "option": "Keep checking only process exit zero",
      "reason": "The reproduced missing-case class can return zero without checking any oracle."
    },
    {
      "option": "Parse TAP summary pass counts",
      "reason": "A passing file wrapper can still represent no matched test, and the current Node documentation explicitly says reporter text is not a stable programmatic contract."
    },
    {
      "option": "Duplicate the snapshot comparison in a second implementation",
      "reason": "Structured events can prove execution of the existing comparison without maintaining two oracle implementations."
    }
  ],
  "alignment": "The trap is replacing one empty-success check with another summary counter. Require the named test's actual non-skipped execution event, reject empty suites and duplicate matches, and preserve the comparison itself. NoOp keeps the reported fail-open freshness check.",
  "reopenWhen": "The oracle is renamed or reorganized, Node changes its structured event API, or a passing artifact check can be produced without executing the snapshot assertions."
}
```

## WO-216-D023 — Preserve lock coverage within its measured test budget

```json
{
  "id": "WO-216-D023",
  "date": "2026-10-18",
  "dispatch": "resume: fix; separate repair review and bounded comparison",
  "decision": "Keep the original full gate-lock mutation matrix in the structural hold and check the product hold with representative Write and exec_command attempts through each of the three generated hooks. Preserve all original structural-hold assertions, the recorded six-task structural row and release-on-exit assertion. Retain the original timing limit. This corrects my initial choice to repeat the whole matrix in the newly added phase.",
  "evidence": [
    "The repeated-matrix arm passed the bounded runner gate-lock probe at 2026-10-18T01:49:54.396Z, but its case duration was 20818.367833 ms against the unchanged 2 * 10600 ms assertion: only 381.632167 ms of margin. Reading the final assertion during the separate repair review exposed that risk; it was not an observed test failure.",
    "The focused-product arm passed the same bounded runner gate-lock probe at 2026-10-18T02:09:00.599Z: case 13024.494542 ms, whole probe 13176 ms. Both arms preserve the original matrix and observe a denied write during the product hold and admission after exit; the repeated arm repeats every variant, while the chosen arm covers both direct-write and shell-write routes through every generated hook. These are single observations, not a statistical timing guarantee.",
    "Before changing the test, the canonical evidence --stop command stopped the active process-debt selection at 2026-10-18T02:08:32.477Z. It recorded only the seven completed structural/build tasks in a stopped row after 88329 ms. The selected suite was interrupted, not failed on an assertion. No passing claim uses that row.",
    "All earlier passing document and focused rows are at the superseded a2d23a294c5e5d64f003afc62a1cabb2d7dce91d9269859b38b844c670f25764 identity. The final handoff reruns every required selection after the source correction, with the two reported failing suites checked before the declared Preflight sequence."
  ],
  "rejected": [
    {
      "option": "Retain the repeated matrix because its probe passed",
      "reason": "The measured case nearly exhausted the existing timing assertion, leaving a concrete reliability risk before the complete suite ran."
    },
    {
      "option": "Raise the timing limit to accommodate duplicated work",
      "reason": "The second phase needs to establish persistence of the same active-run guard, not duplicate every path spelling already covered in that held run."
    },
    {
      "option": "Keep the earlier passing rows after changing source",
      "reason": "The work order requires all handoff evidence at the current code identity."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D020",
    "observation": "The initial product-phase coverage repeated the expensive original matrix. The chosen correction keeps that matrix once and adds six generated-hook calls in the product hold."
  },
  "reopenWhen": "The focused product hold stops exercising all three generated adapters or either write route, or the preserved timing assertion fails under the complete harness-fixtures selection."
}
```

## WO-216-D024 — Verification: pass VER-002; VER-001's F1, F2 and F4 are repaired and reproduced; F3 and F5 stay boarded

```json
{
  "id": "WO-216-D024",
  "date": "2026-10-18",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002: criteria 1 to 15 are met at code identity f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d, the identity the RepairCompleted event records. VER-001's F1 (the emitted-roles case expecting the retired verifier sentence), F2 (the WO-125 F3 runner case's nested gate carrying the structural phase into a fixture without its inputs) and F4 (the role-oracle check passing when no test ran) are repaired and reproduced; F3 and F5 stay boarded under D021 (FUP-17266e5072d4a25a) as planning obligations before WO-217 activates, outside this order's criteria and surfaces. The repair introduces no new defect. Four observations break no criterion and are recorded here, not boarded: a compiled test change re-keyed the harness runtime snapshot, re-emitted the nine hooks and re-minted authority edition 003 (inference: preserveHarnessRuntime keys the snapshot by the runtime package inventory, which includes compiled tests); the repair paid the structural phase nineteen times, about 9.8 minutes; the oracle case's name is spelled in the test, the checker and the sync fixture, so a rename needs three edits and D022's reopening condition covers it; the gate-lock case ran 12.46 s alone, 13.70 s in the executor's suite and 14.49 s in mine against the unchanged 21.2 s limit.",
  "evidence": [
    "F1: node --test over packages/skeleton/dist/test/executor-supports.test.js with the case's name under harness bounded: 1 test, 1 pass, 32 ms. The generated verifier skill in both roots carries 'Consume the executor's structural, Preflight suite and document rows when their code identity matches the subject' once, the retired sentence zero times and 'probe with `npm test -- --only <suite>`' once; the three skills are byte-identical across .claude and .agents. The skeleton row at f09d6ade passed at 2026-10-18T02:18:08.215Z in 273.121 s.",
    "F2: the runner-mode case of scripts/test-harness.mjs under harness bounded: 1 test, 1 pass, 12.46 s. npm test -- --only harness-fixtures at f09d6ade recorded a passing row at 2026-10-18T03:31:33.260Z in 344.926 s with the case at 14.494 s; the executor's row of 02:23:42.457Z passed in 332.379 s with the case at 13.704 s. The explicit runGate table supplies a build, the six structural tasks and a held product task; the product hold checks every generated hook refuses Write and exec_command with an active-gate reason; the structural row is asserted with the six names executed at exit 0.",
    "F4: node scripts/check-role-oracle.mjs on the real tree passes in 0.38 s naming the one executed case; node scripts/structural-checks.mjs generated reports all sixteen artifacts current with role-oracle at 0.36 s. Twelve scratch variations through checkArtifact with the real inventory's role-oracle row: the exact case passing admits; nested in a describe, a runtime t.skip(), a leading or trailing word in the name, a syntax error, an async rejection, the name as a subtest and process.exit(0) refuse; the case beside an unrelated failing or passing test admits; an async pass admits. The new sync-fixtures case passes directly (1 test, 0.57 s) and inside npm test -- --only sync-fixtures at f09d6ade, recorded at 2026-10-18T03:25:39.818Z in 218.679 s.",
    "Idempotence: after the passing generated check, npm run sync on the real tree reported seventeen rows current with action none; the status digest (777f044d39479e88) and the code identity were unchanged.",
    "Rows: the RepairCompleted event of 2026-10-18T02:53:34.973Z carries fifteen evidence references at f09d6ade equal to the README's repair rows table; each duration equals the gate index, including the structural row's 31.270 s (7.189, 5.416, 0.716, 0.272, 17.503, 0.066), the sixteen generated child durations and the launchpad file durations 168.413, 5.159 and 251.210 s. No product document, dependency, gate-deadlines.mjs or gate-evidence.mjs file changes between checkpoints 3 and 7; package.json adds only the sync script and the lockfile only the @dotln/skeleton pin 0.59.1 to 0.60.0; git diff --check is clean; VER-001's SHA-256 equals its VerificationCompleted reportHash.",
    "Observations: the hooks diff between checkpoints 3 and 7 changes only .runtime/harness/15140d4c0ca5cb36 to 252919e2128654e9; scripts/lib/harness.mjs preserveHarnessRuntime selects the snapshot from runtimePackageInventory; docs/evidence/current.json moves authority from 002 to 003. Nineteen structural rows at f09d6ade before this verification, 29.3 to 35.7 s each. The oracle name appears in scripts/test-process-debt.mjs line 6470, scripts/check-role-oracle.mjs and scripts/test-sync.mjs."
  ],
  "rejected": [
    {
      "option": "Rerun the complete npm test -- --review at verification",
      "reason": "Criteria 10 and 11 place the one fresh complete row at final review. The suites owning every repaired file have passing rows at the identity, and my two focused gates and direct reproductions establish the repaired paths independently."
    },
    {
      "option": "Fail on the planning receipt's reopening conditions observed in the repair",
      "reason": "A verdict is bound to the criteria. Criterion 4 asks the host task to refuse at warning and criterion 9 asks for two file rows at a time; both happened as specified. D025 routes the conditions to planning."
    },
    {
      "option": "Board the four observations as follow-ups",
      "reason": "None is a defect against a criterion or a behavior main had; the register already carries the structural-phase cost under the planning receipt's criterion 13 known issue and D022 covers an oracle rename."
    },
    {
      "option": "Spawn a worker to reproduce a claim",
      "reason": "Every probe ran in this session under harness bounded or as a focused gate."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D019",
    "observation": "The F1, F2 and F4 parts of D019's follow-up are discharged at f09d6ade and reproduced by VER-002; F3 and F5 remain under D021 with their reproductions in VER-001."
  },
  "reopenWhen": "The final review's fresh complete review row fails at this identity, or a later change edits the repaired fixtures, scripts/check-role-oracle.mjs or the Preflight claim rule."
}
```

## WO-216-D025 — Verification: planning receipt 046's criterion:4 and criterion:9 reopening conditions for WO-216 have occurred

```json
{
  "id": "WO-216-D025",
  "date": "2026-10-18",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Record that two reopening conditions of planning receipt 2026-10-17-planning-69fa20e1554282a6-046's known issues for WO-216 occurred during the repair, independently of the criteria. Criterion 9's condition, a launchpad:file row failing while another launchpad:file row runs: at 2026-10-18T02:40:44.095Z the launchpad selection at f09d6ade recorded exit 1 with failedFirst launchpad:file:test-launchpad-export.mjs after 80.1 s, while launchpad:file:test-launchpad-update.mjs ran to a pass at 244.1 s and the seeds file was never started. Criterion 4's condition, a refusal at warning on a selection that then passes unchanged, in substance: the export file's nested kit gate failed its host task with 'Host memory: warning; pressure=2' and skipped kit-verify, and the same selection at the same identity passed at 02:46:16.859Z with all three files. The refusal was the kit's own host task inside the exported instance, not the top-level host row, which passed at 0.06 s. Route: planning, not blocking. The order behaved as criteria 4 and 9 specify; the conditions belong to the receipt's judgment of that design.",
  "evidence": [
    "Gate index rows at f09d6ade: suite:launchpad 2026-10-18T02:40:44.095Z, exit 1, failedFirst launchpad:file:test-launchpad-export.mjs, unrunSuites [launchpad:file:test-launchpad-seeds.mjs], nested export 80132 ms exit 1, update 244129 ms exit 0; suite:launchpad 2026-10-18T02:46:16.859Z, exit 0, nested 168413, 5159 and 251210 ms.",
    "docs/control/local/harness/check-output/04daa1c62ad908a9ee25f6e66d20f179c867fca1c9a7567ef7cf70d24f9c0098.log lines 87 to 91: FAIL host 0.07 s; [host] Host memory: warning; pressure=2; swapBytes=75298242560; physicalBytes=51539607552; SKIP kit-verify; Required host structural preflight failed.",
    "docs/evidence/WO-216/README.md §Repair handoff observations records the failure, a bounded host check at normal pressure 1 at 2026-10-18T02:41:11.314Z and the rerun with unchanged source and limits.",
    "The verify briefing's planning receipt 046 known issues for criterion:4 and criterion:9 and their Reopen when text."
  ],
  "rejected": [
    {
      "option": "Fail VER-002 on it",
      "reason": "No criterion is broken: the host refusal at warning and the two-at-a-time file lanes are the order's specified behavior."
    },
    {
      "option": "Leave it in the README only",
      "reason": "A reopening condition the record shows as occurred is recorded as a decision with a named follow-up for the planning pass, as WO-200-D006 did."
    }
  ],
  "followup": "Next planning pass: reopen receipt 046's criterion:4 and criterion:9 known issues for WO-216 as their conditions require. Decide whether two launchpad file lanes may run nested kit gates at once under the host guard (scripts/test-runner.mjs, the launchpad rows of expandSuiteTasks and their loadSlots), and whether the host task's refusal at warning rather than critical stays (scripts/structural-checks.mjs checkHost; product 07 §Preflight before the full gate), with the 02:40:44 and 02:46:16 rows as the evidence.",
  "reopenWhen": "A planning pass disposes the reopened findings, or a launchpad:file row fails again under host pressure while a sibling file row runs."
}
```

## WO-216-D026 — Final review: integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-216/10 -->

```json
{
  "id": "WO-216-D026",
  "date": "2026-10-18",
  "dispatch": "resume: final review; worktree integrate WO-216",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all b6131cae48dd0da93e802a19b8a2293d4c1d5fba, and the branch carries no commit of its own. The helper took the intake backup from a fresh npm run backup:intake of the three ignored intake files into the session scratch, checkpointed the work (refs/dotln/checkpoint/WO-216/10), retained its named stash 82978f1318de84214542dd0be62c0fd6d79308d8, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. Every acceptance claim is carried forward unchanged: VER-002's fifteen criterion judgments at code identity f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d; the fifteen handoff rows the RepairCompleted event cites at that identity (the structural row, the thirteen Preflight rows and the document row) with the supplemental skeleton and harness-fixtures rows; VER-001's F1, F2 and F4 as repaired (D020, D022, D023); F3 and F5 as boarded for planning (D021); VER-002's FU1 as recorded for planning (D025); the executor's self-review (adversary 3/3/0 and improver 2/2/0 at implementation, D015; one separate repair pass, found 1, fixed 1, D023). gateCodeIdentity returned the same identity before and after integration. Against the integration checkpoint, the only tracked change is the decisions-index row this stub added, and of the sixty untracked files only this record, the meter snapshot and the PR stub differ, all three regenerated. Release preparation keeps application v0.84.0 under the order's minor classification: local tags end at v0.83.0, and check-surfaces --local reports the release block v0.84.0 with @dotln/skeleton the only component whose source changed (0.59.1 to 0.60.0, the console pin and lockfile following; harness host 0.35.2 to 0.36.0) and no bump required for the other five; no dependency is added. Authority edition WO-216/003 and feedback edition WO-216/001 stay selected and every generated check is current, so integration owes no re-mint and no live episode. The fresh complete review row this review must record (criterion 11) is the product gate; it is recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-216/10",
    "base b6131cae48dd0da93e802a19b8a2293d4c1d5fba",
    "upstream b6131cae48dd0da93e802a19b8a2293d4c1d5fba",
    "git log main..HEAD empty; git rev-parse origin/main main HEAD all b6131cae48dd0da93e802a19b8a2293d4c1d5fba after the helper's fetch",
    "release preparation: WO-216 target v0.84.0 remains current. Files changed: docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md. Meter snapshot: docs/evidence/WO-216/meta.json, 4139 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-18T03:54:56Z to 03:57Z, each exit 0: npm run publication:check (255/255 product headings indexed; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.84.0 against latest local tag v0.83.0; skeleton src changed, observed 0.60.0 against 0.59.1; the other five components unchanged; github-body-profile passes on PR.md), node scripts/structural-checks.mjs generated (all sixteen artifacts CURRENT) and node scripts/structural-checks.mjs declarations (no missing declaration). npm test -- --review --again is this review's product gate, recorded in FINAL-001.",
    "gateCodeIdentity before and after integration: f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d; git diff --stat refs/dotln/checkpoint/WO-216/10 lists docs/lineage/decisions-index.md (+1) as the only tracked change; a byte comparison of the sixty untracked files against the checkpoint tree finds only docs/evidence/WO-216/decisions.md, docs/evidence/WO-216/meta.json and docs/final-reviews/WO-216/PR.md changed",
    "VER-001 and VER-002 SHA-256 equal the reportHash their VerificationCompleted events recorded (sha256:5c342324… and sha256:67b4228d…)"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-18. Original base: `b6131cae48dd0da93e802a19b8a2293d4c1d5fba`.
Fetched main: `b6131cae48dd0da93e802a19b8a2293d4c1d5fba`. Checkpoint: `refs/dotln/checkpoint/WO-216/10`.
Named stash retained: `82978f1318de84214542dd0be62c0fd6d79308d8` (WO-216 integrate 2026-10-18).
Intake backup: `DotLn-wo216-intake-20261018T034518Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-216 target v0.84.0 remains current. Files changed: docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md. Meter snapshot: docs/evidence/WO-216/meta.json, 4139 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's fifteen criterion judgments and the executor's fifteen handoff rows at code identity `f09d6ade…`, which the integrated tree keeps, with the supplemental skeleton and harness-fixtures rows; VER-001's F1, F2 and F4 as repaired (D020, D022, D023) and F3 and F5 as boarded (D021); VER-002's FU1 as recorded (D025); the executor's self-review and repair passes (3/3/0 and 2/2/0; found 1, fixed 1). No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the review gate pass on the integrated tree (evidence above); the fresh review gate is in FINAL-001.

## WO-216-D027 — Final review: fail FINAL-001; the await misreports, criterion 11 refuses a standing fresh row and the index keeps passing output

```json
{
  "id": "WO-216-D027",
  "date": "2026-10-18",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001. At the integrated subject, code identity f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d (integration took in nothing, D026), criteria 1 to 10 and 12 to 15 are met and criterion 11 is unmet. Three findings block. F1 (blocking; breaks a behavior main had, shown by a probe): every runner invocation records the gate row and then a structural companion row built from it with the same recordedAt and tree hash, the runner records no gate outcome, and node scripts/harness.mjs evidence --wait takes the last row at the tree as the run's verdict, so a failed gate whose structural tasks passed reads as passed with exit 0; the order's own reviewer step and every role's await rule direct this wait. F2 (blocking; criterion 11 unmet, shown by a probe): requireFinalReviewGate judges only the newest standing covering row, so a passing composed npm test -- --review recorded after the fresh run makes final-review-result pass refuse although a passing complete review row with reusedSuites 0, recorded after FinalReviewRequested, still stands. F3 (blocking; breaks a behavior main had, shown by measurement): the generated task's sixteen child checks are kept as nested cases with their full output inside taskTimeline, and the structural and stopped rows' timelines are not stripped, so gate rows retain passing output the gate index excludes by rule; single-suite rows grew from a mean 8,589 B on main to 334,630 B, and this worktree's index holds 48.3 MB in 141 rows. The fresh complete review row this review ran passed every suite (41 suites, 100 fresh tasks, reusedSuites 0, exit 0), so no suite outside the Preflight field fails at this identity. Seventeen follow-ups are boarded: F4 handoff document claims stand on any passing document row at the code identity, which excludes documents (criteria 10 and 15 prescribe it); F5 a failing structural task in a later document gate displaces product and review rows with the wrong remedy; F6 the launchpad lanes dropped the exclusive reservation and priority without a same-source comparison; F7 runner-fixtures reads undeclared launchpad files; F8 five hand-kept copy sites lack declarations; F9 stopped rows displace nothing and three stopped assertions were removed; F10 the stopped row is written before tasks are aborted; F11 registrations loads the compiled kernel before the build and freshness check; F12 harness evidence still says no check recorded; F13 the sync fixture likely needs an open wo-NNN branch; F14 sync treats a timed-out check as stale; F15 freshReason always-fresh-preflight no longer occurs in production; F16 the build receipt digests the tree after publishing; F17 the resume fixtures cover criteria 10 and 11 partially; F18 five product 07 passages state the replaced rule and the Standard artifacts clause limits the handoff gate to machinery orders; F19 the playbook still directs a composed final-review run; F20 the README's base table omits two reused checks.",
  "evidence": [
    "F1 probe, under node scripts/harness.mjs bounded at 2026-10-18T04:13:40Z: two disposable Git repositories in the session scratch; the real recordGateChecks records a failed npm test row (exit 1, suite-a failed) followed by a passing structural row with the same recordedAt, as scripts/test-runner.mjs does; the real node scripts/harness.mjs evidence --wait --timeout 0 exits 0 and prints the structural row. With main's single-row recording of the same failure it exits 1 and prints the npm test row. Over this order's own rows, readGateChecks(root, treeHash).at(-1) is the passing structural row for the failed runs recorded at 2026-10-17T21:01:26.460Z (document gate), 21:08:47.944Z (runner-fixtures), 21:23:50.034Z (process-debt) and 21:39:15.411Z (launchpad). Only scripts/harness.mjs calls recordGateOutcome; HEAD:scripts/test-runner.mjs records [check] alone. Live: the wait that awaited this review's gate printed the checkId structural row, which passed as the gate did.",
    "F2 probe, under harness bounded at 04:16:18Z: the real requireFinalReviewGate against a disposable repository with a stub --review --list runner; a fresh passing review row (reusedSuites 0, gateSelection review) recorded after since records it as the product gate; the same row followed by a passing composed review row (reusedSuites 1) refuses with 'Final review requires npm test -- --review --again after this review's FinalReviewRequested event: no fresh passing complete review row at the current code identity'. The code takes coveringGateCheck(...).row, which is candidates.findLast(covers), and a composed row's reused results are not executions, so it neither displaces the fresh row nor yields to it.",
    "F3 measurement, read-only over the ignored gate indexes: this worktree's docs/control/local/harness/checks.json is 48.3 MB for 141 rows (single-suite rows a mean 334,630 B, structural 341,459 B, document 344,327 B); main's is 17.7 MB for 256 rows (single-suite rows 8,589 B). The latest structural row before the review gate is 345,221 B, and its taskTimeline entry for generated holds cases[meta].output of 296,830 B, the passing meta --check output; this review's own review row is 572,024 B. HEAD:scripts/test-runner.mjs maps taskTimeline through ({ output, ...row }) => row; the subject strips only the top-level output of the gate row's entries and sets taskTimeline: structuralRows and taskTimeline: [...completedRows] unstripped; retainDiagnostic in packages/skeleton/src/gate-evidence.mjs recurses into cases only.",
    "Worker reports: three read-only dotln-worker reviewers (A runner, B claims and sync, C split, roles and write-backs) reported 26 items; this reviewer checked each against the named lines, folded five duplicates or overlaps (A1 with B2, A3 with B1 and C1, A9 with C6, A8 with B4) and kept C8 as an observation. F6, F7, F8, F9, F11 and F15 were confirmed by reading the named lines (priority 200 for exclusive rows, 73 runner-fixtures sources with no launchpad path, the five copy sites, the task-level stopped variant, the @dotln/kernel import, the onlyFreshFormat condition); F10, F13 and F16 remain inferences with their probes named in FINAL-001.",
    "Receipt 046: of its ten known issues for WO-216, criterion 4 and criterion 9 occurred during the repair (D025); criterion 13's condition is 6.3% of the 545-minute baseline on this order's 68 structural rows before this review (median 29.9 s) and 13.5% on the receipt's pre-WO-216 count of about 147 rows per order; the README base table reconciles run for run with main's gate index; criterion 10's condition did not occur, because this review's fresh complete row passed all 41 suites, the order's first fresh complete run; criterion 1's gateStepCount condition occurred in substance, because npm run meta reads this review's row as WO-216's gateStepCount 100 (delta -3 against 103) with no note that the unit changed (six structural tasks lead every selection and launchpad counts as three file tasks), while the review selection's machinery suites also differ per order; the others have not occurred.",
    "Review gate: npm test -- --review --again, started in the background at 2026-10-18T04:22:52Z after integration, npm run sync and the document gate, recorded 2026-10-18T05:02:23.850Z at f09d6ade..., exit 0, gateSelection review, executionMode forced-fresh, freshReason requested, freshSuites 100, reusedSuites 0, 41 required suites, 2,369,456 ms, identityUnchanged and buildOutputUnchanged true; its structural companion took 31,767 ms (format 6.4 s, configuration-root 7.5 s, registrations 0.7 s, declarations 0.3 s, generated 16.7 s, host 0.1 s); the launchpad files took 157.1 s (export), 226.1 s (update) and 4.7 s (seeds); the slowest task was target-worktree at 525.5 s; skeleton (275.1 s) and harness-fixtures (319.3 s) pass.",
    "Document gate: npm run test:docs recorded 2026-10-18T04:22:22.679Z at f09d6ade..., 27 passed, 141,748 ms, 27 fresh tasks, after D026 and npm run sync; git diff --check clean; gate-deadlines.mjs and both gate-evidence.mjs files unchanged against HEAD; the lockfile changes only the @dotln/skeleton pin."
  ],
  "rejected": [
    {
      "option": "Pass, boarding F1 to F3 as follow-ups because the result transitions still refuse a failed or missing row",
      "reason": "Product 07 §Verification review and attack makes an unmet criterion blocking, and a change that breaks behavior main had, shown by a probe, blocking. F2 leaves criterion 11's acceptance condition unmet; F1 and F3 are regressions of evidence-command and gate-index behavior main had, each shown by execution or measurement. The refusals that remain prevent a false pass but not the misdirected role or the growing index."
    },
    {
      "option": "Repair F1 to F3 in this review",
      "reason": "Each is a source change that moves the code identity and would be judged by its own author; the repair route keeps independent verification, as WO-213's FINAL-001 and FINAL-002 returned in-surface blocking defects to repair."
    },
    {
      "option": "Skip the fresh complete run because the verdict fails",
      "reason": "It is the only run over the whole review selection at this identity; it tells the repair now whether any suite outside the Preflight field fails (receipt 046's criterion 10 condition) instead of at the next final review."
    },
    {
      "option": "Route F4 as blocking because main ran the document gate inline at completion",
      "reason": "Criteria 10 and 15 prescribe the document row at the current code identity; restoring the inline run or binding the row to the tree changes the order's contract and belongs to planning."
    },
    {
      "option": "Spawn a refuter over the worker items",
      "reason": "Every item was checked by this reviewer against the named lines and each blocking finding was reproduced by an executed probe or a measurement; a refuter would add tokens without changing a route."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D024",
    "observation": "VER-002 judged criteria 1 to 15 met and the repair free of new defects at f09d6ade. In that same subject this review reproduces criterion 11's refusal of a standing fresh review row (F2) and two regressions of behavior main had: F1, the await's verdict, which concerns D004's structural rows; and F3, passing output in the gate index, which concerns D004's retained child checks."
  },
  "followup": "WO-216 resume: fix. (F1) Make node scripts/harness.mjs evidence --wait report the awaited gate's own row: record the structural companion before the gate row, exclude structural rows from the wait's choice, or record the runner's outcome; fixture: a failed gate with a passing structural row makes the wait exit 1 and print the gate row, and a passing gate exits 0. Check: npm test -- --only harness-fixtures and runner-fixtures. (F2) requireFinalReviewGate records the newest standing covering row with gateSelection review, reusedSuites 0 and recordedAt after the latest FinalReviewRequested, searching the candidates rather than judging only the newest covering row; fixtures: fresh then composed records the fresh row; fresh then a failed fresh run refuses. Check: npm test -- --only resume. (F3) Strip passing output at every depth of cases and taskTimeline before any gate, structural or stopped row is recorded, keeping failed output as an addressed log; fixture: no recorded row holds a passing output field at any depth. Check: npm test -- --only runner-fixtures. Within the Boy Scout bound in the declared surfaces: F5 (name npm run sync and a passing structural run when a structural failure displaces a row), F7 (declare the launchpad files and launchpad-cases.json under runner-fixtures), F8 (declare the five copy sites), F9 (restore the task-level stopped variant), F11 (run registrations after the build or the freshness check), F12 (harness evidence names the stopped row), F14 (a timed-out check is a refusal, not stale), F15 (freshReason for a composition whose only fresh tasks are structural), F17 (the missing transition and row-state cases), F18 (the five product 07 passages and the Standard artifacts clause) and F20 (the base timings or product 07's sentence). For planning: F4 (bind the handoff document row to the tree or restore the inline document gate, with the role step order), F6 (a same-source comparison for the launchpad reservation and priority, with D025), F10 (abort before the stopped-row write, or bound it), F13 (run the sync fixture from a checkout with no open order), F16 (digest the compiled sources) and F19 (the playbook's gate paragraphs, outside the surfaces). Then the Preflight suites, harness-fixtures and skeleton, npm run test:docs and the handoff; the next final review runs one fresh npm test -- --review --again.",
  "reopenWhen": "A repair changes the structural row's recording, the evidence --wait verdict, requireFinalReviewGate or the gate rows' diagnostic retention; the next final review's fresh complete row fails; or a planning pass disposes F4, F6, F10, F13, F16 or F19."
}
```

## WO-216-D028 — Operator scope expansion: fix the kit gaps a v0.83.0 launchpad met during its registration order

```json
{
  "id": "WO-216-D028",
  "date": "2026-10-18",
  "dispatch": "resume: fix; operator scope expand (2026-10-18): fix issues from the fork, with a pasted report of three kit gaps a v0.83.0 launchpad met during its registration order and one recipe note",
  "decision": "Fold the four fork items into this repair under the operator's scope expansion, each bounded to the named surface. (1) scripts/test-authority-grants.mjs asserts an empty committed grant registry only in core; in an exported instance (isKitRoot) every committed grant must be operator- or registered-repository-granted, and a synthetic kit case covers both roots. (2) recordRepositoryClone accepts an id that the main checkout or the running checkout (declaredIn, the clone action's toolRoot) declares in its configuration or siblings declaration, so a registration order records its clone before its merge while the record stays in the main checkout's ignored clone map and worktree start still reads the merged registration from main. (3) worktree start carries the main checkout's ignored local-terms list into the new order worktree (self and target starts) when one is registered there and the worktree lacks one, printing the carry; without one it prints the registration step. (4) The kit README's first steps 4 and 7, product 07 §Where the control plane finds its documents and §Operator resume phrases, and the playbook state these rules; the README tells an instance order's Preflight to name only suites the instance runs, never a core-only row such as outward-lint, because the publication commands apply the instance vocabulary and local-terms list themselves. The new Preflight suites (authority-grants, target-worktree, launchpad-planning) join the order's Preflight field under the dated amendment this decision authorizes; criteria 1 to 15 are unchanged.",
  "evidence": [
    "The operator's typed scope expand: prefix in this session with the pasted report; the executor procedure defines the prefix as adding scope and a receipt, and WO-044-D001 is the precedent for folding operator-directed repairs with a dated order amendment.",
    "scripts/test-authority-grants.mjs line 327 at the base asserted the committed registry equals [] in any checkout; scripts/launchpad.mjs KIT_FILES carries the whole scripts tree and the runner's authority-grants row declares no core-only input, so the suite runs in an instance; the kit README step 4 directs the registration order to commit an operator grant there.",
    "scripts/lib/target-worktrees.mjs recordRepositoryClone (lines 248 to 257 at the base) validated the id against loadConfig(launchpad) and the siblings declaration of the main checkout only, while scripts/worktree.mjs always passes mainWorktree(toolRoot); activation (resume activate) already reads the running checkout's configuration, so the clone record was the one main-bound check.",
    "scripts/worktree.mjs completeSelfStart and startTargetWorktree carried sibling receipts and ran bootstrap but copied no ignored file; scripts/lib/terms.mjs reads docs/control/local/terms.txt and reports unavailable when absent; the kit README step 7 told the session to copy the list by hand.",
    "scripts/kit/first-order.template.md names no Preflight line and no exported template names outward-lint; the kit README's core-only table lists outward-lint; scripts/lib/target-publish.mjs applies checkOutwardArtifact to the published body.",
    "Probes under node scripts/harness.mjs bounded at 2026-10-18T12:47Z to 12:50Z: the authority-grants cases (WO-042 AC5/6 and the new instance case) pass; the two new target-worktree cases pass (the carried list is byte-equal and ignored; a clone recorded from the order checkout lands in the main checkout's map and an undeclared id still refuses; a main checkout without a list prints the registration step)."
  ],
  "rejected": [
    {
      "option": "Open a separate order for the fork items",
      "reason": "The operator directed the fold; the README directs the exact sequence that fails, and every later instance would meet the same three gaps meanwhile."
    },
    {
      "option": "Defer the clone id check to worktree start",
      "reason": "Start reads the merged configuration from main, which is correct; the gap is only the pre-merge record, which the running checkout's declaration settles."
    },
    {
      "option": "Document the clone record as a post-merge step only",
      "reason": "The registration order needs the mapping for its own target start after the merge, and the record is an ignored local file that no merge carries; recording it when the order declares the id is the shorter path."
    },
    {
      "option": "Mark the authority-grants suite core-only for launchpads",
      "reason": "Its other four cases check the instance's compiled envelope and registry provenance, which an instance needs; only the empty-registry assertion is core's."
    }
  ],
  "reopenWhen": "An exported instance reports another suite failing on the registration order, worktree start for a target order needs a clone recorded only in an order checkout, or a carried local-terms list refuses an instance text the operator did not list."
}
```

## WO-216-D029 — Repair F1: the wait reports the awaited run's own row, never its structural companion

```json
{
  "id": "WO-216-D029",
  "date": "2026-10-18",
  "dispatch": "resume: fix; FINAL-001 F1",
  "decision": "node scripts/harness.mjs evidence --wait chooses the latest row at the tree whose checkId is not structural; a tree whose only rows are companions has no run row and reads as no-row (exit 2). The runner's recording order is unchanged. Rule the repaired code holds: the wait reports the awaited run's own row and verdict; a companion row never stands in for it.",
  "evidence": [
    "scripts/harness.mjs took readGateChecks(root, treeHash).at(-1); scripts/test-runner.mjs records [check, structuralCheck] with the same recordedAt, so the companion was last; every other consumer of readGateChecks filters by checkId (scripts/resume.mjs correct, scripts/lib/gate-reuse.mjs, packages/skeleton/src/gate-evidence.mjs findGateCheck), so the wait was the one misled reader.",
    "scripts/test-harness.mjs, case WO-166 evidence wait: a failed npm test row with a passing structural companion exits 1 printing npm test; a passing pair exits 0 printing npm test; the case the report did not quote: a failed npm run test:docs row with a passing companion exits 1 printing the document row, and a tree holding only a companion prints {run: null} with exit 2. Bounded probe 2026-10-18T12:46Z: the case passes; without the fix the first assertion reads the companion (exit 0) as FINAL-001's probe showed."
  ],
  "rejected": [
    {
      "option": "Record the companion before the gate row",
      "reason": "It relies on sort stability over equal timestamps and leaves the rule implicit for the next reader of the index."
    },
    {
      "option": "Record a gate outcome from the runner",
      "reason": "The wait would still print the companion as the row; the outcome file duplicates what the row already says."
    }
  ],
  "reopenWhen": "A selection records its own row under checkId structural, or a consumer other than the wait is found reading the last row at a tree without a checkId filter."
}
```

## WO-216-D030 — Repair F2: the newest standing fresh review row after the dispatch supplies the final-review claim

```json
{
  "id": "WO-216-D030",
  "date": "2026-10-18",
  "dispatch": "resume: fix; FINAL-001 F2 (criterion 11)",
  "decision": "requireFinalReviewGate searches coveringGateCheck's standing candidates for the newest row with gateSelection review, reusedSuites 0, recordedAt after the latest FinalReviewRequested and requiredSuites covering the review selection, instead of judging only the newest covering row. Rule the repaired code holds: a later composed review row reuses results, so it neither displaces the fresh row nor supplies the claim; a later failed fresh run displaces the fresh row through the shared lookup and leaves no candidate. The refusal names displaced tasks and, when a structural task is among them, the remedy npm run sync then a passing structural phase (F5).",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs took coveringGateCheck(...).row, which is candidates.findLast(covers); FINAL-001's probe showed a fresh row followed by a composed row refusing.",
    "scripts/test-verifier-gate-claims.mjs (the resume suite): a fresh row followed by a failed fresh run refuses; an older fresh row, a newer fresh row and then a composed row (reused results citing the newer row) record the newer fresh row's evidenceRef as evidence.productGate. The case the report did not quote: the newest of two standing fresh rows is chosen, not the first. Bounded probe 2026-10-18T12:47Z: the script passes; without the fix the composed row is the newest covering candidate and the pass refuses."
  ],
  "rejected": [
    {
      "option": "Exclude composed rows from coveringGateCheck's candidates",
      "reason": "Composed rows legitimately cover handoff claims elsewhere; the final-review rule is the one that demands a fresh row."
    }
  ],
  "reopenWhen": "A composed review row is recorded with reusedSuites 0, or the review selection changes between the fresh run and the result so that no fresh row covers it."
}
```

## WO-216-D031 — Repair F3: a recorded row keeps no passing output at any depth

```json
{
  "id": "WO-216-D031",
  "date": "2026-10-18",
  "dispatch": "resume: fix; FINAL-001 F3",
  "decision": "The runner exports failedOutputOnly and withoutOutput and applies them before every record: a task's cases keep output only for a failed or unexecuted check, recursively, which the gate index then stores as an addressed log; every taskTimeline (gate, structural companion and stopped rows) carries no output at any depth; a structural task's parsed child cases are stripped when adopted. Both gate-evidence.mjs files are unchanged. With it, freshReason always-fresh-preflight now covers a composition whose only fresh tasks are structural or the preflight format run (F15). Rule the repaired code holds: no recorded row holds a passing output field at any depth of cases or taskTimeline; failed output stays an addressed log.",
  "evidence": [
    "FINAL-001's measurement: single-suite rows a mean 334,630 B against 8,589 B on main, the passing meta --check output of 296,830 B inside the structural row's generated timeline entry; scripts/test-runner.mjs stripped only the top-level output of the gate row's timeline entries and nothing of the companion and stopped rows; retainDiagnostic recurses into cases, not taskTimeline.",
    "scripts/test-runner.test.mjs, new case: a structural generated task reports a passing child with output and a failed child with output, alpha prints passing noise and beta fails with output; after the run no entry of any recorded row's taskTimeline holds output or outputRef at any depth, no entry of cases holds output, passing cases hold no outputRef, the failed child's and beta's outputRef files hold their output, and the companion keeps the child names as metadata. The case the report did not quote: the stopped row (request, SIGINT, SIGTERM, SIGHUP) holds no output after its completed build task printed. Bounded probe 2026-10-18T12:46Z: the three cases pass; without the fix the gate row's generated timeline entry keeps the passing child's output."
  ],
  "rejected": [
    {
      "option": "Strip in recordGateChecks",
      "reason": "Criterion 15 keeps both gate-evidence.mjs files unchanged, and the index's rule already addresses failed case output; the runner owns what it records."
    },
    {
      "option": "Drop the generated task's child cases from the rows",
      "reason": "Their names, exit codes and durations are the measurement criterion 13 and the README report."
    }
  ],
  "reopenWhen": "A row records a passing output at any depth, or a failed child output is no longer readable from its outputRef."
}
```

## WO-216-D032 — Bounded follow-ups taken in this repair, and the two left with a follow-up

```json
{
  "id": "WO-216-D032",
  "date": "2026-10-18",
  "dispatch": "resume: fix; FINAL-001 follow-ups within the Boy Scout bound",
  "decision": "Taken: F5 (preflightRows reports displaced tasks and the completion and final-review refusals name npm run sync then a passing structural phase when a structural task was displaced), F7 (runner-fixtures declares the three launchpad files and scripts/fixtures/launchpad-cases.json), F9 (a task result marked stopped inside an unstopped row is never carried; the case is restored), F12 (the harness host's stop message names the stopped row the nested runner recorded, when one exists), F14 (npm run sync reports a timed-out check as unknown and refused without running its writer), F15 (always-fresh-preflight for a composition whose only fresh tasks are structural), F17 in part (the failed-fresh and composed-after-fresh cases), F18 (the five product 07 passages and the Standard artifacts clause), F20 (product 07's sentence and a README note on the two untimed checks). Left with a follow-up: F8 (five hand-kept copy sites without a copied-fixture declaration) and F11 (registrations loads the compiled kernel before the build and the freshness check, while criterion 1 pins the structural order). F4, F6, F10, F13, F16 and F19 stay with planning under D027.",
  "evidence": [
    "FINAL-001 §Findings and D027's repair rule name each item and its surface; each taken item changed only the named surface and its fixture.",
    "F8 needs a declaration shape for a test that copies sources by hand at five sites across three suites, a step 2 contract the next repair or a planning pass should size; F11 would reorder STRUCTURAL_TASKS, which criterion 1 fixes, or teach registrations a sync remedy when the compiled kernel is stale.",
    "Bounded probes 2026-10-18T12:46Z to 12:50Z: the sync timeout case, the runner cases and the wait case pass; the full Preflight suites run at handoff."
  ],
  "rejected": [
    {
      "option": "Take F8 and F11 here",
      "reason": "F8 touches three suites outside this repair's findings and F11 changes an order the criteria pin; both exceed the bounded repair."
    }
  ],
  "followup": "Declare the five hand-kept copy sites (scripts/test-configuration-root.mjs twice, scripts/test-concurrent-control.mjs, scripts/test-harness.mjs twice) as copied-fixture closures so declarations checks them (F8), and let registrations name npm run sync when the compiled kernel is stale or missing instead of a generic remedy, without reordering the six structural tasks criterion 1 fixes (F11).",
  "reopenWhen": "A declarations run misses a hand-copied source, or registrations fails on a stale compiled kernel under the generic remedy."
}
```

## WO-216-D033 — Final review: integration took in nothing; every acceptance claim carried forward to FINAL-002

<!-- integration refs/dotln/checkpoint/WO-216/17 -->

```json
{
  "id": "WO-216-D033",
  "date": "2026-10-18",
  "dispatch": "resume: final review; worktree integrate WO-216",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all b6131cae48dd0da93e802a19b8a2293d4c1d5fba, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-216/17, bc90dd90cbc09e4623583f6f5bd851b0b330f9e2), retained its named stash 3c1d32a0f50b05abe1211a04c899cedecf7a9c74, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: the three ignored intake files are zero-byte placeholders dated 2026-10-17T16:15, the stash excludes ignored files and the no-op merge touched none of them; they are present unchanged after integration. Every acceptance claim is carried forward unchanged to FINAL-002: VER-003's fifteen criterion judgments at code identity 0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8, the identity its VerificationCompleted event records with the structural row and document row of 2026-10-18T14:02:17.505Z and the sixteen Preflight rows; the second repair's RepairCompleted event (2026-10-18T13:46:59.977Z) with its eighteen references at that identity and the supplemental harness-fixtures and skeleton rows; FINAL-001's F1, F2 and F3 as repaired (D029, D030, D031) and reproduced by VER-003, its F5, F7, F9, F12, F14, F15, F17 in part, F18 and F20 as taken (D032), F8 and F11 as deferred onto FUP-9de14a69403e2b32 and F4, F6, F10, F13, F16 and F19 as planning obligations (D027); VER-001's F1, F2 and F4 as repaired (D020, D022, D023) and F3 and F5 as boarded (D021); VER-002's FU1 as recorded (D025); the operator scope expansion D028 as bound in the planning log by the PlanExecutionAmended events of 2026-10-18T12:53:44.757Z and 12:59:15.788Z against receipt 046; the executor's self-review at implementation (adversary 3/3/0 and improver 2/2/0, D015), the first repair's separate pass (found 1, fixed 1, D023) and the second repair's separate pass (found 2, fixed 2). Before integration the tree differed from the dispatch checkpoint 16 only in docs/control/current.md, docs/control/orders/WO-216.jsonl and docs/work-orders/README.md, none code, so VER-003's identity is the pre-integration identity; gateCodeIdentity returned 0859ff09… after integration. Against checkpoint 17 the tree differs in four files, docs/evidence/WO-216/decisions.md (this record), docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md and docs/lineage/decisions-index.md, each regenerated or this stub. Release preparation keeps application v0.84.0 under the order's minor classification: local tags end at v0.83.0, and check-surfaces --local reports the release block v0.84.0 with @dotln/skeleton the only component whose source changed (0.59.1 to 0.60.0, the console pin and lockfile following; harness host 0.35.2 to 0.36.0) and no bump required for the other five; no dependency is added. Authority edition WO-216/004 and feedback edition WO-216/001 stay selected and every generated check is current after integration, so integration owes no re-mint and no live episode. The fresh complete review row criterion 11 requires is this review's product gate; it is recorded in FINAL-002.",
  "evidence": [
    "refs/dotln/checkpoint/WO-216/17 (bc90dd90cbc09e4623583f6f5bd851b0b330f9e2); docs/control/local/integration.json: before b6131cae48dd0da93e802a19b8a2293d4c1d5fba, upstream b6131cae48dd0da93e802a19b8a2293d4c1d5fba, resolved [], authored [], complete true",
    "git log main..HEAD empty; git merge-base HEAD main b6131cae48dd0da93e802a19b8a2293d4c1d5fba; the helper printed Bases b6131cae -> b6131cae and Authored conflicts: none",
    "release preparation: WO-216 target v0.84.0 remains current. Files changed: docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md. Meter snapshot: docs/evidence/WO-216/meta.json, 4617 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-18T14:06:48Z to 14:06:50Z, each exit 0: npm run publication:check (255/255 product headings indexed; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.84.0 against latest local tag v0.83.0; skeleton src changed, observed 0.60.0 against 0.59.1; the other five components unchanged; workspace pins exact; license surfaces pass). After integration, bounded node scripts/structural-checks.mjs host (normal, pressure 1), declarations (no missing declaration, 0.250 s) and generated (all sixteen artifacts CURRENT, 15.286 s), each exit 0. npm test -- --review --again is this review's product gate, recorded in FINAL-002.",
    "gateCodeIdentity after integration: 0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8, equal to VER-003's VerificationCompleted productGate.codeIdentity; git diff --stat refs/dotln/checkpoint/WO-216/16 against the pre-integration tree lists docs/control/current.md, docs/control/orders/WO-216.jsonl and docs/work-orders/README.md only; git diff --stat refs/dotln/checkpoint/WO-216/17 against the integrated tree lists docs/evidence/WO-216/decisions.md, docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md and docs/lineage/decisions-index.md only",
    "VER-001, VER-002, VER-003 and FINAL-001 SHA-256 equal the reportHash their completion events recorded (sha256:5c342324…, sha256:67b4228d…, sha256:ee18e08e…, sha256:050f50a9…)",
    "docs/intake holds three zero-byte files dated 2026-10-17T16:15:06 after integration; the helper's stash (git stash with untracked, not ignored, files) never held them"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    },
    {
      "option": "Take an intake backup after the fact",
      "reason": "A backup records the state before a risk; the merge took nothing and the three placeholder files are present unchanged, so a later archive would attest nothing the receipt and the file dates do not."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-18. Original base: `b6131cae48dd0da93e802a19b8a2293d4c1d5fba`.
Fetched main: `b6131cae48dd0da93e802a19b8a2293d4c1d5fba`. Checkpoint: `refs/dotln/checkpoint/WO-216/17`.
Named stash retained: `3c1d32a0f50b05abe1211a04c899cedecf7a9c74` (WO-216 integrate 2026-10-18).
Intake backup: none named; the three ignored intake files are zero-byte placeholders present unchanged after the no-op merge.
Resolved projections: none.
Release preparation: WO-216 target v0.84.0 remains current. Files changed: docs/evidence/WO-216/meta.json, docs/final-reviews/WO-216/PR.md. Meter snapshot: docs/evidence/WO-216/meta.json, 4617 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-003's fifteen criterion judgments and the second repair's eighteen handoff rows at code identity `0859ff09…`, which the integrated tree keeps, with the supplemental harness-fixtures and skeleton rows; FINAL-001's F1 to F3 as repaired (D029 to D031), its bounded follow-ups as taken or deferred (D032) and its planning items (D027); VER-001's F1, F2 and F4 as repaired (D020, D022, D023) and F3 and F5 as boarded (D021); VER-002's FU1 as recorded (D025); D028's expansion as bound in the planning log; the executor's self-review and both repair passes (3/3/0 and 2/2/0; found 1, fixed 1; found 2, fixed 2). No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the review gate pass on the integrated tree, with the host, declarations and generated structural checks (evidence above); the fresh review gate is in FINAL-002.

## WO-216-D034 — Final review: pass FINAL-002 at the integrated subject; one operator packet and ten follow-ups, two corrected in this review

```json
{
  "id": "WO-216-D034",
  "date": "2026-10-18",
  "dispatch": "resume: final review; FINAL-002",
  "kind": "finding",
  "decision": "Pass FINAL-002. At the integrated subject, code identity 0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8 (integration took in nothing, D033), criteria 1 to 15 are met: criteria 1 to 14 on the executed fixtures, the eighteen rows VER-003 consumed at this identity and this review's bounded reproductions, and criterion 15 on the fresh complete review row recorded at 2026-10-18T15:08:12.533Z (gateSelection review, executionMode forced-fresh, 41 suites, 100 fresh tasks, reusedSuites 0, exit 0, 2,211.5 s, identity and build output unchanged), recorded after this review's FinalReviewRequested event of 14:03:49.789Z, with the document gate of 14:31:03.727Z at the same identity, git diff --check clean, no new dependency and gate-deadlines.mjs and both gate-evidence.mjs files unchanged. No finding blocks. F1 is an operator packet: worktree finish, which release close runs, reads every row of this worktree's ignored gate index and records it into main's live index, which keeps the newest 256 rows; the 154 rows recorded before the F3 repair hold 50,395,779 bytes, 48,378,963 of them passing output inside taskTimeline, against main's live index of 17,724,800 bytes, so the close would carry FINAL-001's F3 harm into main for about 200 later rows. The choice is the operator's: strip passing taskTimeline output from those rows in this worktree's ignored index before the close (a write to the success record, under operator override), have worktree finish apply withoutOutput to copied rows (a code change outside this order's surfaces, verified in its own order), or accept the growth. F2 to F11 are follow-ups: F2 FINAL-001 F17's remaining transition and row-state cases have no owner; F3 npm run sync runs an evidence writer on any non-zero check that is not a timeout and leaves an orphan edition directory when the re-check fails, so each retry mints the next revision; F4 D028's local-terms carry on the self-start route and the clone record's siblings-declaration route have no in-repo case; F5 the harness host's stop message names any older stopped row at the tree, including one recorded before the nested run started; F6 scripts/release.mjs and scripts/lib/release-preparation.mjs are not declared under sync-fixtures; F7 in a kit the first suites' recorded predecessor is format rather than kit-verify; F8 after a fail-fast stop the document gate's base comparison builds for tasks that never ran; F9 the playbook's verification paragraph still says the product gate is not a prerequisite to verification-result (with F19, outside the surfaces); F10 product 07's final-review paragraph still said the executor and verifier run product tests when useful to their evidence, and F11 the playbook stated only the clone-id rule of D028 item 4, both corrected in this review as document sentences within the declared surfaces with npm run publication:check and the document gate passing after them. Worker A's argument that an order whose Preflight field yields no --only token makes a met npm test claim stand on the structural row alone, which main refused, is VER-001's F3: criteria 10 and 15 prescribe the Preflight rows, so the replacement is the order's design, and the empty-field case stays the planning obligation D021 boards before WO-217 activates (FUP-17266e5072d4a25a), re-affirmed by the worker's probe over WO-217's field.",
  "evidence": [
    "Review gate: npm test -- --review --again started in the background at 2026-10-18T14:31:19Z after integration, D033, the two document corrections, npm run sync, npm run format and the document gate; recorded 2026-10-18T15:08:12.533Z at 0859ff09…, exit 0, gateSelection review, executionMode forced-fresh, freshReason requested, freshSuites 100, reusedSuites 0, 41 required suites, 2,211,544 ms, identityUnchanged and buildOutputUnchanged true, unrunSuites [], stale [], failedFirst null, row size 257,426 bytes (FINAL-001's row: 572,024); its structural companion took 27,684 ms (format 6.6 s, configuration-root 5.1 s, registrations 0.6 s, declarations 0.2 s, generated 15.0 s, host 0.1 s); the launchpad files took 152.9 s (export), 225.5 s (update) and 4.3 s (seeds); skeleton 252.0 s and harness-fixtures 276.4 s pass; the slowest task was target-worktree at 502.3 s. node scripts/harness.mjs evidence --wait --timeout 3600 awaited it and printed the npm test row, not the structural companion (F1 live).",
    "Document gate: npm run test:docs recorded 2026-10-18T14:31:03.727Z at 0859ff09…, 27 passed, 136,780 ms, 27 fresh tasks, structural 28,525 ms, after D033, the two document corrections, npm run sync and npm run format; git diff --check clean; gate-deadlines.mjs and both gate-evidence.mjs files unchanged against HEAD; the lockfile changes only the @dotln/skeleton pin.",
    "Reproductions under node scripts/harness.mjs bounded, one process at a time, 14:11Z to 14:14Z, each exit 0: the WO-166 wait case (1 of 1), nine runner cases (selection, declarations, host, fail-fast, record, output stripping, chronology, stop routes, launchpad lanes; 9 of 9), the resume script through scripts/test-resume.sh (78.1 s, resume tests passed), the WO-042 AC5/6 and instance grant cases (2 of 2), the two local-terms cases (2 of 2); the host, declarations and generated structural checks after integration (normal pressure 1; no finding in 0.250 s; sixteen current in 15.286 s).",
    "F3 measurement, read-only over the ignored gate index before the gates: 46 rows at 0859ff09… average 22,595 bytes (largest 78,091), 2,269 case and timeline nodes with no output field and no passing node with an outputRef; the 54 rows at f09d6ade… average 351,453 bytes. F1 measurement: 154 rows at other identities total 50,395,779 bytes, 48,378,963 inside taskTimeline; docs/control/local/harness/checks.json 54,176,097 bytes for 200 rows; main's 17,724,800 bytes; scripts/worktree.mjs finish reads readGateChecks(subject) and calls recordGateChecks(mainPath, checks); gateCacheRows is 256 and retainDiagnostic touches cases only.",
    "Worker reports: two read-only dotln-worker reviewers (A runner, lookup, claims, wait and stop; B sync, structural checks, launchpad split, kit items, role text and write-backs) reported thirteen items; this reviewer checked each at the named lines: A1 is VER-001 F3 (readPreflightSuites over WO-217 returns [] and preflightRows then needs only the structural row); A2 is F1; A3 and B5 are F5 (honourStop searches every stopped row at the tree and runs before the nested spawn at harness-host.ts 3073); A4 is F7 (test-runner.mjs lane.previous names format when verifiedKit); A5 is F8 (document-failures.mjs needed includes unexecuted rows); A6 is an observation (the companion copies failureComparisons); B1 is F2 (D032 names F17 in part and its follow-up names only F8 and F11); B2 is F3 (sync.mjs remint returns the failed check without removing the new revision directory, and any non-zero before check that is not a timeout runs the writer); B3 is F4 (both new cases use a **Repository:** target order); B4 is F9, F10 and F11 (playbook 348; product 07 2616; no local-terms sentence in the playbook); B6 is F6 (machinerySources declares release.mjs under launchpad-planning, harness-fixtures and process-debt only); B7 is an observation (the WO-186 test title).",
    "Corrections in this review: docs/product/07-execution-guide.md, the sentence 'Executor and verifier run product tests when useful to their evidence' in the final-review paragraph rewritten to the handoff rule; docs/PLAYBOOK.md, the Implement paragraph gains the local-terms carry on both routes and the instance Preflight rule; npm run publication:check reported the software-engineer edition's lock stale, npm run sync rewrote it and regenerated the decisions index, and the check then passed (255/255; both editions CURRENT).",
    "Receipt 046: of its ten known issues for WO-216, criterion 4 and criterion 9 occurred during the first repair (D025); criterion 13's condition is not met at 96 structural rows before this review's gates (median 29.8 s, 46.7 minutes, 8.6% of 545) or at about 105 single rows per order (9.6%); criterion 10's condition did not occur, because this review's fresh complete row passed all 41 suites; the gateStepCount unit note stays with D027; the others have not occurred.",
    "Usage: entry 96,021 tokens at 14:03:59.209Z after 2 steps; handoff 13,006,199 tokens at 15:08:55.475Z after 96 steps and 87 commands (12,462,124 cached input, 439,193 cache-write, 1,098 uncached input, 103,784 output), 2 subagents observed against cap 20 (18 remaining); the workers report 281,603 and 288,670 subagent tokens over 102 and 119 tool uses."
  ],
  "rejected": [
    {
      "option": "Block on F1 because the close carries the index growth into main",
      "reason": "No criterion breaks and main's worktree finish behavior is unchanged; the rows are this worktree's ignored diagnostic record, and the choice among a scrub of the success record, a code change outside the order and acceptance is the operator's, which product 07 §Verification review and attack routes as an operator packet."
    },
    {
      "option": "Route worker A's empty-Preflight item as blocking because main refused the claim",
      "reason": "Criteria 10 and 15 prescribe the Preflight rows, FINAL-001 judged the analogous F4 a follow-up on the same ground, and VER-001 F3 already boards the empty-field case for planning before WO-217 activates; a second route for the same defect would double the row without changing its owner."
    },
    {
      "option": "Repair F2 to F8 in this review",
      "reason": "Each is a source or fixture change that moves the code identity and would be judged by its own author; the next order editing the surface fixes boarded follow-ups within the Boy Scout bound."
    },
    {
      "option": "Leave F10 and F11 as follow-ups instead of correcting them",
      "reason": "Both are document sentences within the declared surfaces (product 07 by step 18; the playbook by D028), the corrections keep code identity, and WO-215's final review corrected such sentences under the same authority."
    },
    {
      "option": "Spawn a refuter over the worker items",
      "reason": "Every item was checked by this reviewer against the named lines and measured or reproduced where a number or a behavior was claimed."
    }
  ],
  "reopens": {
    "decisionId": "WO-216-D024",
    "observation": "D024's reopening condition occurred when the second repair edited the repaired fixtures and the Preflight claim rule; VER-003 re-verified every criterion at 0859ff09…, and this review's fresh complete row passes there, so the pass stands at the new identity."
  },
  "followup": "Next order editing these surfaces, or the planning pass: (F2) add the transition and row-state cases FINAL-001 F17 listed to scripts/test-verifier-gate-claims.mjs: missing and other-identity refusals on repair-complete and verification-result, a failed and a stopped review row, a row between two FinalReviewRequested events, a report with no npm test claim, a target order and a document changed after the consumed row. (F3) In scripts/sync.mjs run a writer only when the check reports stale rather than on any non-zero exit, and when a mint's re-check fails remove the new revision directory or report it as an orphan with its path. (F4) Add in-repo cases for completeSelfStart's local-terms carry and for recordRepositoryClone's siblings-declaration route in scripts/test-target-worktree.mjs or scripts/test-worktree.mjs. (F5) In packages/skeleton/src/harness-host.ts bound honourStop's stopped-row search to rows recorded after the check started. (F6) Declare scripts/release.mjs and scripts/lib/release-preparation.mjs under sync-fixtures in scripts/test-runner.mjs. (F7) Set the first suites' predecessor to kit-verify when a kit verifies after the structural phase. (F8) In scripts/lib/document-failures.mjs exclude unexecuted tasks from the base-build decision. (F9) With FINAL-001 F19, rewrite docs/PLAYBOOK.md's verification paragraph to the Preflight rule. Operator (F1): before release close of WO-216, decide whether to strip passing taskTimeline output from the 154 pre-repair rows in this worktree's ignored gate index under operator override, to have worktree finish apply withoutOutput to copied rows in a separate order, or to accept about 50 MB landing in main's live index until 200 later rows move it to check-history.",
  "reopenWhen": "The fresh complete review row is displaced at this identity before the branch is published; release close copies the pre-repair rows without the operator's decision on F1; or a planning pass disposes F1 to F9."
}
```
