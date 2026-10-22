# WO-226 decisions

## WO-226-D001

```json
{
  "id": "WO-226-D001",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Record synthetic baseline observations before changing implementation and use the existing harness fixtures for the order's missing test path.",
  "evidence": [
    "README.md records both bounded probes and their scope, failures and successful observations.",
    "rg --files packages/skeleton finds no harness-host.test.ts; scripts/test-harness.mjs owns the registered-target and operator-message cases."
  ],
  "rejected": [{"option": "Treat the work order's observations as a substitute for checking this checkout", "reason": "The evidence rule requires an observed base and the cited test path has moved."}],
  "reopenWhen": "A current test or source path contradicts these observations."
}
```

## WO-226-D002

```json
{
  "id": "WO-226-D002",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Select the existing carried-runtime restore in emitted release-close recovery, retaining its writer lock, active-gate refusal and child deadlines; keep the core build branch.",
  "evidence": ["The baseline export's build failed on missing tsconfig.json while the carried restore passed in 501.788 ms.", "packages/compiler/src/harness.ts contains the existing guarded preparation loop."],
  "rejected": [{"option": "No change or a Git/SessionStart hook", "reason": "No change repeats the reproduced failure; new hooks exceed the order's explicit boundaries. The sub-10-second fixture observation reopens the planning candidate for later evaluation, not implementation in this order."}],
  "reopenWhen": "A verified carried runtime cannot be restored inside the existing recovery bound."
}
```

## WO-226-D003

```json
{
  "id": "WO-226-D003",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Keep refreshHarnessRuntime synchronous by invoking the existing restore CLI; exports never invoke the caller's build. Harness entry restores before loading the command; export refusals name bootstrap.",
  "evidence": ["The three existing refresh consumers and process-debt fixtures use a synchronous contract.", "release-kit-runtime.mjs already exposes the verified async restore through a CLI."],
  "rejected": [{"option": "Make every refresh consumer asynchronous or duplicate the snapshot restoration", "reason": "Neither is needed to use the established restore; the child preserves the current synchronous caller contract and one restoration implementation."}],
  "reopenWhen": "Measured child overhead becomes material or the synchronous consumer contract changes."
}
```

## WO-226-D004

```json
{
  "id": "WO-226-D004",
  "date": "2026-10-22",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.90.0, the next minor above the observed release baseline v0.89.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.89.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-226-kit-runtime-after-an-update.md"
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

## WO-226-D005

```json
{
  "id": "WO-226-D005",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Use the real launchpad export fixture for the changed-pin fast-forward, recovery build control, carried restore, harness entry and finish; retain the existing core recovery case.",
  "evidence": [
    "scripts/test-launchpad-export.mjs reuses the manifest-verified export and local Git origin; scripts/test-harness.mjs retains the core stale-main case.",
    "The baseline report separates its direct missing-snapshot setup from the added full fast-forward fixture."
  ],
  "rejected": [
    {
      "option": "Duplicate a fake kit manifest in harness-fixtures",
      "reason": "The export suite already owns the real carried-runtime closure; a fake restore alone would not establish kit verification."
    }
  ],
  "reopenWhen": "The complete gate shows missing coverage of the emitted recovery contract."
}
```

## WO-226-D006

```json
{
  "id": "WO-226-D006",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Finish an update by fetching origin main into the existing temporary Git lane, judging ancestry against the checkout there, importing the accepted objects and advancing origin/main and main before bootstrap.",
  "evidence": [
    "The order requires non-fast-forward refusal before any checkout write. An ordinary fetch writes objects and references before merge can refuse.",
    "scripts/lib/github-repository.mjs already owns a temporary fetch-and-bundle lane; its new optional beforeImport callback runs before unbundle.",
    "scripts/test-launchpad-update.mjs compares working files, Git metadata and ignored runtime bytes across every refusal."
  ],
  "rejected": [
    {
      "option": "Fetch directly into the checkout before merge --ff-only",
      "reason": "That cannot satisfy the stated refusal-before-write requirement. NoOp keeps the operator responsible for multiple hand steps."
    }
  ],
  "reopenWhen": "An origin transport relies on checkout-local configuration that the existing host-owned lane intentionally does not consume; revisit transport preservation without weakening refusal atomicity."
}
```

## WO-226-D007

```json
{
  "id": "WO-226-D007",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "End the client update route with update --finish, explain explicit --tags precedence, and name the literal host-rules fallback while classifier behavior is unqualified.",
  "evidence": [
    "scripts/kit/README.client.md is manifest-listed starter content.",
    "The order explicitly requires these three reader-facing write-backs."
  ],
  "rejected": [
    {
      "option": "Leave a manual checkout/fetch/pull/bootstrap sequence as the route",
      "reason": "It retains the coordination burden this order removes."
    }
  ],
  "reopenWhen": "The update command or the live host qualification changes the supported route."
}
```

## WO-226-D008

```json
{
  "id": "WO-226-D008",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Project configured roots and only the selected registration’s baseBranch, authorityProfile and release from main’s committed config and each checkout; name the differing field and preserve byte equality for grants.",
  "evidence": [
    "The baseline gate-only edit withheld admission.",
    "The admission reads the registry from committed roots and binds the selected registration before profile, grant, clone, source-closure and phase checks.",
    "Added fixture cases mutate each publication field and grants in main and the order checkout."
  ],
  "rejected": [
    {
      "option": "Whole-file equality or accepting working-copy grants",
      "reason": "The first reproduces the gate-edit failure; the second would enlarge authority."
    }
  ],
  "reopenWhen": "A publication effect begins depending on another registration field."
}
```

## WO-226-D009

```json
{
  "id": "WO-226-D009",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Diagnose only recognizable node publish/release-close helpers hidden by pipes, redirects or prefixes, journal near-miss with syntax, print an advisory and emit no permission decision.",
  "evidence": [
    "plainShellWords stays the admission parser; its bounded word-read is used only for diagnosis.",
    "Existing canonical release-close material quoting remains admitted; raw git, gh and npm are outside the near-miss classifier."
  ],
  "rejected": [
    {
      "option": "Parse through shell operators to grant admission",
      "reason": "The order preserves the plain-helper admission boundary."
    }
  ],
  "reopenWhen": "A supported plain helper is misclassified or an unrecognized spelling needs an explicit diagnostic."
}
```

## WO-226-D010

```json
{
  "id": "WO-226-D010",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Share a first-content-line reader between prompt metadata and actual role dispatch, skipping blanks and one opening fence; retain the original zero-based prefixLine and never search later content.",
  "evidence": [
    "recordOperatorMessage previously classified raw trimStart while role selection separately used harnessPromptIntent.",
    "The new compiler and emitted-hook cases distinguish leading dispatch, later quoted dispatch, multiple fences and Fable selection suffixes."
  ],
  "rejected": [
    {
      "option": "Change only the observation row or search the entire paste",
      "reason": "Changing only the row leaves the role unknown; searching all lines can dispatch quoted logs."
    }
  ],
  "reopenWhen": "A documented host framing requires a narrowly specified additional unwrapping rule."
}
```

## WO-226-D011

```json
{
  "id": "WO-226-D011",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Add the opt-in Fable worker beside the unchanged default, keep the singular worker input compatible, and record the parent-attested workerType in new direct receipts and responses. Mint a new role oracle linked to the unchanged prior chain.",
  "evidence": [
    "WO-226 step 11 authorizes the second definition and shared role text, and criterion 7 requires drift checks for both.",
    "The emitter is packages/compiler/src/harness.ts; scripts/lib/harness.mjs already admits dotln-worker-fable.md through its agent-path rule.",
    "The new oracle links wo217-role-baseline.json and retains the upstream wo185 chain; existing receipt bytes without workerType keep their rendering."
  ],
  "rejected": [
    {
      "option": "Replace the default pin, infer effective model from the definition, or rewrite historical oracle/receipt bytes",
      "reason": "The operator requested an opt-in only and existing evidence must remain historical."
    }
  ],
  "reopenWhen": "The operator changes the default pin, or host readback supplies effective settings."
}
```

## WO-226-D012

```json
{
  "id": "WO-226-D012",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Stage compiler 0.30.0 and skeleton 0.65.0 as additive minor changes, and console 0.4.5 for dependency-pin alignment; update the compiler constant and workspace lock entries without adding dependencies.",
  "evidence": [
    "The prior manifests were compiler 0.29.0, skeleton 0.64.0 and console 0.4.4.",
    "The compiler adds plural worker declarations and first-line prompt reading; skeleton adds admission behavior and the opt-in worker.",
    "release prepare --local assigned application v0.90.0 above v0.89.0. Its first attempt caught a duplicate imported isKitRoot name; the import now uses isKitWorktree and the rerun succeeded."
  ],
  "rejected": [
    {
      "option": "Bump untouched workspaces or publish packages",
      "reason": "Only changed components require labels; all packages remain private and publication guards remain intact."
    }
  ],
  "reopenWhen": "Integration brings a version collision or compatibility evidence changes the classification."
}
```

## WO-226-D013

```json
{
  "id": "WO-226-D013",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Regenerate current registered evidence through sync, carry feedback from WO-217 revision 002, and update the console self-host pin; preserve historical episodes.",
  "evidence": [
    "docs/evidence/current.json selected WO-217 for all kinds at entry, with feedback revision 002.",
    "scripts/lib/evidence-sources.mjs registers the compiler harness in commonSources and Contributor specifically in authority, feedback and harness sources. The earlier wording incorrectly grouped both as common sources; the registered lists distinguish them.",
    "Sync accepted the feedback carry after checking its judged subject. No new live episode was required; the current selection is recorded in current.json and the handoff."
  ],
  "rejected": [
    {
      "option": "Relabel an old live run as current or hand-edit fingerprints",
      "reason": "Neither establishes current-source evidence."
    }
  ],
  "reopenWhen": "Sync reports changed judged feedback sources or another required live observation."
}
```

## WO-226-D014

```json
{
  "id": "WO-226-D014",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Write the first-line rule, worker opt-in, publication projection and runtime finish route into the cited product sections and retain the host classifier as unqualified.",
  "evidence": [
    "Product 07 and product 03 contain the operator-facing boundaries selected by the work order.",
    "The WO-221 known-issues paragraph is the explicitly authorized mutable qualification write-back; no filed verification report is edited.",
    "publication:check retained 255/255 heading coverage and reported only the two stale source locks after these edits."
  ],
  "rejected": [
    {
      "option": "Claim fixture checks qualify the live host classifier",
      "reason": "The order explicitly excludes host qualification and no live episode ran."
    }
  ],
  "reopenWhen": "An admitted live publish observes both the hook and classifier verdict."
}
```

## WO-226-D015

```json
{
  "id": "WO-226-D015",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Replace the remaining shipped build advisories in artifact-identity-evidence, beacon-observe and the local role probe with bootstrap, and audit current emitted hooks and scripts while retaining historical fixture text.",
  "evidence": [
    "A scoped rg search over scripts and the compiler found these three additional current messages.",
    "Criterion 2 covers every export-facing build advisory; bootstrap is also valid in core. The historical legacy-v0.81.0 fixture remains unchanged."
  ],
  "rejected": [
    {
      "option": "Limit the wording repair to the three examples in the order",
      "reason": "That would leave other shipped messages recommending a build without sources."
    }
  ],
  "reopenWhen": "A new shipped command introduces another unconditional build recommendation."
}
```

## WO-226-D016

```json
{
  "id": "WO-226-D016",
  "date": "2026-10-22",
  "dispatch": "resume: next; independent self-review",
  "decision": "Resolve checkout-relative origin paths before entering the fetch lane, and admit an explicit codex-spawn-agent receipt type so Codex workers do not acquire a Claude launch attestation.",
  "evidence": [
    "The criteria worker identified the raw origin argument in finishUpdate; the temporary lane resolves a relative path from its own directory. The update fixture now exercises a second fast-forward from ../finish-update.git.",
    "The design worker identified that the supported Codex spawn_agent route could record only Claude worker names. Receipt validation, CLI help, the shared role text and the product guide now name codex-spawn-agent, with a third receipt fixture.",
    "self-review.md records both fresh read-only workers and their two findings. The full gate is the executable check of the repaired subject."
  ],
  "rejected": [
    {"option": "Keep absolute-only origin coverage", "reason": "The command promises a normal configured origin, which includes checkout-relative local paths."},
    {"option": "Change the worker pin or remove the order's default dotln-worker receipt type", "reason": "The order preserves the default; an explicit Codex type fixes provenance without changing model selection."}
  ],
  "reopenWhen": "A supported remote spelling changes meaning in the fetch lane, or a supported worker launcher still cannot be recorded truthfully."
}
```

## WO-226-D017

```json
{
  "id": "WO-226-D017",
  "date": "2026-10-22",
  "dispatch": "resume: next; complete-gate repair",
  "decision": "Keep kit detection lazy in the source-only control-plane helper, loading the shared runtime-input predicate only when a kit marker exists; preserve the standalone Beacon control plane without a skeleton package.",
  "evidence": [
    "Complete run 1 stopped at declarations: the new process-debt fixture needed scripts/lib/release-kit-runtime.mjs in machinerySources. That source and the new role oracle are now declared.",
    "Complete run 2 recorded beacon-portability failing because resume.mjs eagerly imported packages/skeleton/src/runtime-inputs.mjs in a fixture deliberately containing no skeleton source.",
    "The existing kit predicate immediately returns false without KIT-MANIFEST.json. The control-plane wrapper makes that same initial check, then loads the existing predicate for all marked roots, preserving its validation and source-declaration checks.",
    "The same run found the generated harness count still pinned to 34; the added worker makes 35, and the unchanged inventory assertion now expects that count.",
    "Source review during complete run 3 found the runner fixture's separate launchpad count still pinned to 34 after two cases were added. The owned gate was stopped through evidence --stop, supplying no pass; its count and label now expect the 36-case inventory."
  ],
  "rejected": [
    {"option": "Copy skeleton source into the portability fixture", "reason": "That would erase the standalone control-plane guarantee being tested."},
    {"option": "Duplicate the complete kit/source detection algorithm or make synchronous refresh callers async", "reason": "The marker guard plus lazy shared predicate preserves both contracts without another implementation."}
  ],
  "reopenWhen": "An unmarked portable control plane needs a skeleton import, or kit detection changes its marker contract."
}
```

## WO-226-D018

```json
{
  "id": "WO-226-D018",
  "date": "2026-10-22",
  "dispatch": "resume: next; complete-gate repair",
  "decision": "Preserve the authorized Fable and truthful worker-type guidance, keep all byte ceilings unchanged, record its measured 310-byte shared-role addition separately from the earlier wording-efficiency baseline, and board equivalent-usefulness optimization through the reopened decision.",
  "evidence": [
    "Complete run 4 passed beacon-portability and harness-fixtures, then process-debt failed its historical 256-byte working-headroom assertion at executor 29,132 bytes.",
    "The bounded measure-roles probe used measureColdStarts(root, HEAD): every role in both installed roots grew 310 bytes. Executor is 29,132 against 29,246 (114 headroom); reviewer is 28,913 against 28,884 (29 over). role-costs.json records all measured profiles.",
    "Product 07 Discipline now says reviewed duties stay whole, ceilings are not raised, and overruns are boarded for equivalent-usefulness optimization; its text explicitly retires the older 4 KB raise route still described historically in budgets.json.",
    "New required inputs: scripts/test-gate-followups.mjs and its referenced wo217-role-efficiency-baseline.json and WO-217-D053. The old guard predates this authorized shared rule. The current role oracle records exact profile bytes and unchanged ceilings, while the regression retains the earlier efficiency comparison using the separately measured addition."
  ],
  "rejected": [
    {"option": "Raise the ceiling or trim a needed duty to satisfy the old headroom assertion", "reason": "Both conflict with the current operator-directed product policy."},
    {"option": "Delete the byte regression or silently accept arbitrary future growth", "reason": "The revised guard binds the exact reviewed measurements and preserves the original comparison; unrecorded growth still fails."},
    {"option": "No change to the historical test", "reason": "It would refuse the work order's required guidance because of an operating-cost goal that current policy handles by a follow-up."}
  ],
  "reopens": {
    "decisionId": "WO-217-D053",
    "observation": "The required worker opt-in and receipt provenance guidance in packages/skeleton/src/loadouts/contributor.ts adds 310 UTF-8 bytes per installed role. Executor headroom fell from 424 to 114 and reviewer from 281 to -29, triggering the decision's below-256 reopening condition. Optimize repeated guidance with equivalent duties and usefulness; retain all pins, opt-in boundaries and truthful receipt instructions, and measure both roots with the role oracle and process-debt check."
  },
  "reopenWhen": "The instruction changes again or an equivalent-usefulness optimization recovers the measured headroom."
}
```

## WO-226-D019

```json
{
  "id": "WO-226-D019",
  "date": "2026-10-22",
  "dispatch": "resume: next; complete-gate repair",
  "decision": "Include the generated Fable worker in an export's installed-input digest, retaining the exact default and Fable filenames and every containment and byte-binding check.",
  "evidence": [
    "Complete run 5 passed process-debt and harness-fixtures, then launchpad-planning failed both fresh-export and historical-update flows with Instance harness input is not a generated surface. The run exited 1 after 1,120,708 ms; the target-worktree and launchpad aggregate rows were incomplete after scheduling stopped.",
    "New required inputs: packages/skeleton/src/gate-evidence.mjs and scripts/test-launchpad-planning.mjs. The digest validates the installed manifest through a separate path allowlist that admitted only agents/dotln-worker.md. The generated Fable entry therefore made the export's document gate and lifecycle evidence unavailable; the planning suite reproduces both affected export flows.",
    "The existing instance-runtime digest test in scripts/test-runner.test.mjs now includes both worker definitions in its changed-byte, missing-file and symlink controls and rejects an unrecognized worker filename.",
    "gate-evidence.mjs is a registered common source. The completed sync regenerated the runtime, harness and authority edition WO-226/003; artifact-identity, verification and feedback remained current at WO-226/001. The earlier expectation that this edit would re-mint every kind was incorrect; the checked regeneration result is authoritative. The file is absent from feedback-audit.ts FEEDBACK_SOURCE_PATHS, and no live feedback episode was required."
  ],
  "rejected": [
    {"option": "Exclude the new worker from the digest", "reason": "A gate would stop binding one installed worker's bytes, weakening the existing evidence contract."},
    {"option": "Admit every agent filename", "reason": "Only the two generated worker types are required; an exact addition preserves the current selection boundary."},
    {"option": "Leave the failed export flows unchanged", "reason": "The required new worker must remain usable through the instance's ordinary document and lifecycle gates."}
  ],
  "reopenWhen": "Another generated worker is deliberately added or the installed-surface contract changes."
}
```

## WO-226-D020

```json
{
  "id": "WO-226-D020",
  "date": "2026-10-22",
  "dispatch": "resume: next; complete-gate repair",
  "decision": "Reserve the export fixture's Codex writer through its ordinary release-close dispatch before removing the runtime for the refusal probe.",
  "evidence": [
    "Complete run 6 executed every required suite: 40 passed and launchpad failed after 1,767,279 ms. Its sole failing case was the new export recovery fixture, whose release-close refusal reached the local origin check instead of the expected missing-runtime advisory. The update-finish, planning, receipt, harness and digest suites passed.",
    "New required input scripts/lib/executor-handoff.mjs returns a no-op when both the runtime and a writer reservation are absent. The recovered Claude prompt recorded the dispatch but did not itself acquire the Codex writer that this specific refusal requires.",
    "The initial diagnosis incorrectly put remote validation before the runtime check. A focused trial with a synthetic invalid-host URL reached the network preflight, proving that changing the URL did not establish the missing reservation. That trial was removed; the local origin is preserved. Reading executorWriterRelease and release.mjs established the actual ordering and prerequisite.",
    "The corrected fixture runs scripts/resume.mjs release-close with its synthetic CODEX_THREAD_ID while the runtime exists and asserts the reservation, then removes the runtime. The bounded reproduction of that failed case passes through all remaining restore, finish and advisory assertions."
  ],
  "rejected": [
    {"option": "Change release-close's production validation order", "reason": "The observed failure was a missing fixture prerequisite; production correctly permits a missing writer runtime when no reservation needs release."},
    {"option": "Fake a writer file or bypass a remote check", "reason": "The canonical dispatch creates a real reservation, and the expected refusal precedes network use once that prerequisite holds."},
    {"option": "Keep only a source-text assertion for the advisory", "reason": "The executable fixture must reach the actual export refusal and continue through the restore paths."}
  ],
  "reopenWhen": "The canonical reservation or release-close missing-runtime contract changes."
}
```

## WO-226-D021

```json
{
  "id": "WO-226-D021",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up for the near-miss advisory of a hidden release-close helper. A piped, redirected or prefixed spelling of the release-close helper now receives 'Registered-target admission not judged: shell syntax (<syntax>) hides the helper; run the plain spelling; host permissions decide.' At the base, releaseCloseAdmission answered the same pipe or redirect with its 'shell operator or redirect' class and both expected spellings, <helper> --publish and <helper> --dry-run, for the dispatched order. The near-miss branch runs before releaseCloseAdmission in the permission handler, so that spelling hint is no longer printed for this helper. Criterion 5 holds: the near-miss row and advisory are journaled and no decision is emitted, as step 8 prescribes, and the WO-178 case was rewritten to accept the new text.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts evaluateExistingHarnessHook: registeredTargetNearMiss is evaluated and returned before releaseCloseAdmission; releaseCloseAdmission still carries the 'shell operator or redirect' class that no longer reaches a pipe or redirect.",
    "scripts/test-harness.mjs WO-178 case: the rows '--publish > close.log' and '--publish | cat' now expect 'shell syntax (redirect)' and 'shell syntax (pipe)', and for those rows the advisory is asserted to include 'run the plain spelling' instead of the two spellings asserted for every other mismatch.",
    "The harness-fixtures suite row passed at 2026-10-22T10:30:01Z with the rewritten case; docs/evidence/WO-226/verification-001/README.md."
  ],
  "rejected": [
    {"option": "Route the change as blocking", "reason": "Criterion 5 names this helper and step 8 names this text; the base behavior is replaced by the order's own design, so no criterion breaks and no unordered behavior is lost."},
    {"option": "Repair the advisory in this verification", "reason": "A verifier never edits the implementation it judges; the defect is boarded with its reproduction."}
  ],
  "followup": "The next order that edits registeredTargetNearMiss or releaseCloseAdmission in packages/skeleton/src/harness-host.ts. When the hidden helper is the release-close helper of a recorded dispatch, let the near-miss advisory name the two admitted spellings, <helper> --publish and <helper> --dry-run, as the base's class advisory did, keeping kind near-miss, the syntax and no decision; restore the WO-178 case's spelling assertions for its pipe and redirect rows.",
  "reopenWhen": "A session told to run the plain spelling of a release close runs another spelling, or a repair restores the hint with its case."
}
```

## WO-226-D022

```json
{
  "id": "WO-226-D022",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up for the role-wording regression's headroom assertion. scripts/test-gate-followups.mjs now asserts measured.ceiling - measured.beforeBytes >= 256 for the executor and reviewer, where beforeBytes is the pre-order measurement pinned in packages/skeleton/fixtures/wo226-role-baseline.json. That inequality cannot change while the oracle stands, so no test compares the installed bytes with a ceiling any more; the installed bytes are held only by the exact pin (executor 29,132; reviewer 28,913 against a 28,884 ceiling), and the reviewer breach is visible only as advisory lines of npm run meta -- --check. No criterion breaks: product 07 directs that a reviewed rule stays whole and its measured overrun is boarded, which D018 and FUP-957602bc42e32e1d do, and the planning receipt's reopening condition for the reviewer root has occurred and is recorded there.",
  "evidence": [
    "git diff scripts/test-gate-followups.mjs: the assertion budgets.limits.coldStartBytes[role] - bytes >= 256 became measured.ceiling - measured.beforeBytes >= 256; the installed bytes are asserted equal to measured.bytes and the ceiling equal to measured.ceiling.",
    "wc -c: CLAUDE.md 6,872 plus .claude/skills/dotln-reviewer/SKILL.md 22,041 is 28,913; npm run meta -- --check exits 0 and prints 'current/coldStartBytes.reviewer: 28,913; ceiling 28884; breach'.",
    "docs/product/07-execution-guide.md at the base, the Cost paragraph of the planning section: a reviewed rule that breaches a ceiling stays whole and its overrun is boarded for optimization with equivalent usefulness; the 4 KB raise route is retired."
  ],
  "rejected": [
    {"option": "Route the oracle change as blocking", "reason": "Criteria 7 and 8 hold, the overrun is boarded as product 07 directs, and the exact pin refuses unrecorded growth."},
    {"option": "Leave the observation as report prose", "reason": "A defect met and not fixed is boarded with a named follow-up."}
  ],
  "followup": "The next order that touches scripts/test-gate-followups.mjs or re-mints the role oracle, which the FUP-957602bc42e32e1d optimization will. Replace the historical inequality with an assertion on the oracle's recorded headroom: ceiling minus installed bytes equals the profile's recorded headroomBytes, so a boarded overrun is asserted as the negative number it is and any unrecorded growth or unboarded breach fails; keep the exact byte pin and the decision and follow-up link.",
  "reopenWhen": "A role grows past its pin without the oracle changing, or a ceiling breach appears in meta --check with no decision boarding it."
}
```

## WO-226-D023

```json
{
  "id": "WO-226-D023",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-001 judges criterion 6 on the framing the order pins, one leading three-backtick fence and blank lines, and records that the host's actual paste framing is unqualified. The 2026-10-21 dispatch is in the main checkout's session journal whose file name begins 8fe3a6e1: a 21,641-byte prompt at 23:09:46Z and a 21,679-byte retry at 23:10:14Z recorded prefix null and role unknown, and the bare 9-byte planning: at 23:42:36Z recorded the prefix. The journal keeps a digest and byte count, not the text, so whether that paste began with a fence, a <pasted_content> tag or something else cannot be read back. The compiled harnessPromptLine leaves a prompt beginning <pasted_content id=\"1\">, a four-backtick fence or a tilde fence unclassified. A search of the published hooks reference on 2026-10-22 found the prompt field documented and no paste framing.",
  "evidence": [
    "docs/evidence/WO-226/verification-001/README.md: the journal rows and the prompt-line.mjs table.",
    "packages/compiler/src/harness.ts harnessPromptLine admits blank lines and one line matching /^\\s*```[^`]*$/u and nothing else.",
    "docs/evidence/WO-226/README.md: the executor's baseline constructed the fence case from the order's description, not from the recorded prompt."
  ],
  "rejected": [
    {"option": "Treat the unqualified framing as a blocking finding", "reason": "Criterion 6 pins the fence and blank lines, the fixture and the compiled function meet it, and no observed prompt shows another framing."},
    {"option": "Widen the rule to pasted-content tags in this verification", "reason": "A verifier edits no implementation, and widening on an unobserved framing would admit a tag the host may never send."}
  ],
  "followup": "The next planning pass that revisits the first-line rule or the next live pasted dispatch: read the prompt's first bytes in a live episode under this release; if the host delivers a <pasted_content> opening tag or other framing before the dispatch line, admit that one framing line as the fence is admitted, with a case; otherwise record the fence as the qualified framing.",
  "reopenWhen": "A live pasted dispatch under this release records prefix null and role unknown while the operator's first line began with a prefix, or a host page documents framing in the UserPromptSubmit prompt field."
}
```

## WO-226-D024

<!-- integration refs/dotln/checkpoint/WO-226/6 -->

```json
{
  "id": "WO-226-D024",
  "date": "2026-10-22",
  "dispatch": "resume: final review; worktree integrate WO-226",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 55699291a324265da49667dc90d5809d50f1fbfc and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-226/6, preservation commit e18306809830256961cb4876a93680ea266679cf), retained its named stash 1f2b0bf0820e95fbdba2f8f69b985a4364ac8905, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (the meter snapshot docs/evidence/WO-226/meta.json; the PR meter block follows once PR.md exists), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: docs/intake holds three tracked .gitkeep files and git ls-files --others --ignored --exclude-standard lists nothing there. Every acceptance claim carries forward unchanged: the code identity after integration is 3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241, the identity the executor handed off and VER-001 judged, so the passing complete review row at that identity (npm test with review selection, 2026-10-22T04:47:12.952Z, 106 fresh tasks over 41 required suites, exit 0, 1,581.147 s) stands for the integrated tree and no second complete run is owed. The three other printed affected checks pass on the integrated tree. The component-version bumps collide with nothing: main's compiler, skeleton and console at 55699291 are 0.29.0, 0.64.0 and 0.4.4 and the subject stages 0.30.0, 0.65.0 and 0.4.5; the integration fetched origin's tags, v0.89.0 is on origin at 926b82344d10cf6406828b3e6a0a56e236fe1d9f and no v0.90.* tag exists locally or on origin, so v0.90.0 stays the target. The evidence inputs are unchanged by integration: docs/evidence/current.json selects WO-226 authority/003, artifact-identity/001, verification/001 and feedback/001, as at the verified subject. The sibling registry's new row and receipt for the starter's v0.89.0 export (2026-10-21T23:07:47.199Z, core commit 926b8234) are release-close bookkeeping: the receipt is in no commit of main and appears in every checkpoint of this order from activation on, which is the carried-receipt route the registry describes (worktree start carries a pending starter-refresh receipt); it lands with this order's records and is not a finding.",
  "evidence": [
    "refs/dotln/checkpoint/WO-226/6",
    "base 55699291a324265da49667dc90d5809d50f1fbfc",
    "upstream 55699291a324265da49667dc90d5809d50f1fbfc",
    "release preparation: WO-226 target v0.90.0 remains current. Files changed: docs/evidence/WO-226/meta.json. Meter snapshot: docs/evidence/WO-226/meta.json, 4098 bytes. Tag observation: local snapshot only.",
    "git ls-files docs/intake: three .gitkeep files; git ls-files --others --ignored --exclude-standard docs/intake: nothing.",
    "docs/evidence/WO-226/verification-001/gate-rows.mjs under the bounded wrapper at 11:18Z and 11:23Z: currentCodeIdentity 3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241 before and after integration; one npm test row with review selection at that identity, exit 0.",
    "At the integrated tree, 11:23Z to 11:25Z, each exit 0: npm run publication:check (255 of 255 headings; both editions current), node scripts/harness.mjs check (35 generated surfaces), npm run release -- check-surfaces --local, npm run meta -- --check (two boarded reviewer-root breaches as advisories), git diff --check, npm run format:check, node scripts/authority-evidence.mjs --check (38 bundle comparisons), node scripts/harness-evidence.mjs --check (35 current surfaces, 55 checked), node scripts/feedback-evidence.mjs --check (the carried WO-217 audit).",
    "git ls-remote --tags origin 'v0.89*' 'v0.90*': v0.89.0 (annotated e7066227, commit 926b8234) and no v0.90.* tag; git tag -l 'v0.9*' lists no v0.90.* tag locally.",
    "git log --all -- docs/evidence/siblings/DotLn-Enterprise-Starter/2026-10-21T23-07-47-199Z.json: the five WO-226 checkpoints from activation to final-review and nothing else; the main checkout holds three receipts, the last dated 2026-10-21T01:46:55.650Z."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Run a second complete review at the integrated tree",
      "reason": "The code identity is unchanged by the integration and by this review, which edits no source, so the executor's passing complete row is the row the result consumes; a second 1,581 s run would judge the same bytes."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-22. Original base: `55699291a324265da49667dc90d5809d50f1fbfc`.
Fetched main: `55699291a324265da49667dc90d5809d50f1fbfc`. Checkpoint: `refs/dotln/checkpoint/WO-226/6`.
Named stash retained: `1f2b0bf0820e95fbdba2f8f69b985a4364ac8905` (WO-226 integrate 2026-10-22).
Resolved projections: none.
Release preparation: WO-226 target v0.90.0 remains current. Files changed: docs/evidence/WO-226/meta.json. Meter snapshot: docs/evidence/WO-226/meta.json, 4098 bytes. Tag observation: local snapshot only.
Carried-forward claims: every acceptance claim of VER-001 carries forward unchanged with its original evidence, because the code identity after integration is the identity VER-001 judged; FINAL-001 reruns the order's new and changed cases at the integrated tree and records the printed affected checks passing there.
Authored conflicts observed: none.
Affected checks: run at the integrated tree on 2026-10-22 between 11:23Z and 11:25Z, each exit 0: `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local`; `npm test -- --review` is consumed as the passing complete row at the unchanged identity.

## WO-226-D025

```json
{
  "id": "WO-226-D025",
  "date": "2026-10-22",
  "dispatch": "resume: final review; row disposition",
  "rows": ["FUP-c95ee836d6dcea16"],
  "decision": "Re-dispose the SessionStart preparation candidate FUP-c95ee836d6dcea16 from deferred to open: its reopening condition has occurred. The executor's baseline measured node scripts/lib/release-kit-runtime.mjs in the fixture export at 501.788 ms (docs/evidence/WO-226/README.md), under the 10 s the candidate named, and D002 recorded that the measurement reopens the planning candidate, not this order's scope. The candidate returns to planning with the measurement; a SessionStart preparation stays a non-goal of WO-226, and no hook or preparation enters this diff.",
  "evidence": [
    "docs/evidence/WO-226/README.md: the carried restore verified 981 kit files and restored the snapshot in 501.788 ms in the fixture export; a single fixture measurement, not a host-wide latency claim.",
    "npm run plan -- followups --show FUP-c95ee836d6dcea16 at 11:33Z: deferred by the 2026-10-21 pass; reopenWhen names WO-226's evidence README measuring the restore under 10 s in the fixture export.",
    "docs/verifications/WO-226/VER-001.md, the carry-ins: the condition judged as occurred, with the row's disposition left to the final review.",
    "npm run plan -- followups --apply with status open at register revision 995def257c0911971fbca44d5c2852a45e894b3ea97a4050034df2dfda449b2e."
  ],
  "rejected": [
    {
      "option": "Leave the row deferred because this order's non-goal excludes the candidate",
      "reason": "The non-goal fences this order alone; the register re-disposes a deferred row whose condition occurred by whoever observes it, and the row's reopening condition names exactly this measurement."
    },
    {
      "option": "Implement the SessionStart preparation here",
      "reason": "It is a named non-goal, a reviewer writes no behavioral change, and the 15 s hook timeout against a live export is unmeasured."
    }
  ],
  "reopenWhen": "The next planning pass decides the candidate, or a live export measures the restore above 10 s."
}
```
