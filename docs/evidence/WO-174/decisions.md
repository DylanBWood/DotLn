# WO-174 decisions

## WO-174-D001

```json
{
  "id": "WO-174-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Use the preferred document-tag route, a preload on the existing product package runs, and one direct machinery-source coverage check. Keep gateCodeIdentity, reuse eligibility and changedMachinery selection unchanged. Prepare the classified local patch release before measuring the document baseline: its initial run failed at release preflight because activation retained the version placeholder.",
  "evidence": [
    "docs/work-orders/WO-174-gate-rows-cover-what-suites-read.md design and criteria 1–9",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity: tracked entries, excluded trees/root Markdown and generated/documentation attributes",
    "scripts/test-runner.mjs: only skeleton and console currently split document cases; harness-fixtures omits scripts/harness.mjs",
    "REVIEW-004 ER4-001 and ER4-002; both filed packets",
    "Baseline npm test -- --review --again: 29 passed, zero failed, 402242 ms at 2026-09-30T16:39:48.820Z",
    "Initial npm run test:docs: 13409 ms, release-surfaces failed on the unassigned WO-174 heading; eight dependent checks did not execute"
  ],
  "rationale": "Mission and critical path: dependable gate evidence reduces a false-green verification risk to the source-to-deliverable loop. Rule beating and drift: a guard observes actual reads and negative fixtures prove the failure; a direct closure check prevents the proven missing selection. Policy resistance and escalation: preserve the report-independent identity and declared-source rule rather than paying another gate after every report. Commons: record real before/after times and the preload overhead; direct coverage bounds selection. Shifting the burden: new document-reading cases and direct imports fail mechanically instead of needing operator rediscovery. Success to the successful: compare the key expansion, always-fresh gate and all-machinery routes despite the existing reuse investment. Seeking the wrong goal: correctness on consumed bytes, not suite count, is the outcome. Naive Interventionism: retain test assertions, no runtime or event schema change, use an isolated preload and one fixture check; measure the added work. NoOp leaves the two reproduced false-green paths reachable.",
  "rejected": [
    {
      "option": "Hash every excluded tree",
      "reason": "Report/control writes would invalidate each passing row; the order declines that cost."
    },
    {
      "option": "Always --again at review",
      "reason": "Runs the entire gate without repairing the document-gate omission."
    },
    {
      "option": "Transitive closure",
      "reason": "Outside the declared bounded set and can select the longest suites on most script edits."
    },
    {
      "option": "Run every machinery suite at each review",
      "reason": "Restores the cost WO-132 removed."
    }
  ],
  "reopenWhen": "A guarded product case still reads an excluded tracked input without failure, direct coverage misses a literal first-party dependency, or measured overhead defeats the bounded route."
}
```

## WO-174-D002

```json
{
  "question": "Can the preload name async and nested Node test cases without rerunning package suites?",
  "alternatives": [
    "Async-resource context captured by a preload",
    "A test registration wrapper requiring imports to change"
  ],
  "observation": "Node v26.9.0 Test async resources retained names across awaited timers and a nested case; the fixture passed both cases and the fs observer printed their individual names.",
  "budget": {
    "wallSeconds": 180
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 121.38571557617188,
    "tokens": null,
    "commands": [
      "node: inspect Node 26 Test async-resource implementation",
      "node --import <session-scratch>/case-probe.mjs --test <session-scratch>/case-probe.test.mjs",
      "node: write the scratch economy receipt"
    ],
    "source": "Wall time from the scratch probe file creation through this receipt; preparation was one immediately preceding native-source inspection."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --import <session-scratch>/case-probe.mjs --test <session-scratch>/case-probe.test.mjs"
    ],
    "summary": "Avoids a second product-suite run for the read guard; package overhead still to be measured."
  },
  "outcome": "inconclusive",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reopenWhen": "A supported Node release no longer supplies named Test async resources, or the observer fixture fails case attribution.",
  "id": "WO-174-D002",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Use the observed case attribution for implementation. This probe establishes feasibility, not an economy improvement; the overhead and recurring saving remain unmeasured.",
  "evidence": [
    "Session-scratch case-probe.mjs and case-probe.test.mjs, Node v26.9.0, both cases passed and the observer named each read."
  ],
  "rationale": "Avoids test-import rewrites and a second run solely for observation; no recurring wall-time saving is claimed until overhead is measured.",
  "rejected": [
    {
      "option": "Rewrite all test registrations",
      "reason": "The measured named resource already identifies awaited and nested cases; wrapping imports would widen the test diff."
    }
  ]
}
```

## WO-174-D003

```json
{
  "id": "WO-174-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.57.1, the next patch above the observed release baseline v0.57.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.57.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-174-gate-rows-cover-what-suites-read.md"
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

## WO-174-D004

```json
{
  "id": "WO-174-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Correct the experiment schema and interpretation before release preparation: cost.commands and effect.commands hold command strings, not counts, and a feasibility probe alone is not an adopted economy improvement. D002 now records inconclusive with unknown regression and recurring saving. Assign v0.57.1 through release prepare --local (D003) and use the resulting complete document baseline.",
  "evidence": [
    "scripts/lib/meta.mjs experiment validation; WO-145 D002 example",
    "release prepare initially refused the numeric command fields and wrote no target; the premature second document run was stopped through harness evidence --stop and recorded no gate row",
    "release prepare --local assigned v0.57.1 above local v0.57.0",
    "Complete baseline npm run test:docs: 23 passed, zero failed, 16144 ms at 2026-09-30T16:45:47.884Z"
  ],
  "rationale": "The wrong numeric command fields caused an executable schema rejection; the same-day correction restores the established format. No saving or regression conclusion follows from a case-attribution probe alone.",
  "rejected": [
    {
      "option": "Call the prototype an adopted economy improvement",
      "reason": "No comparison of equivalent recurring costs has been measured."
    }
  ],
  "reopenWhen": "A paired overhead measurement supports a recurring saving or the attribution fixture changes."
}
```

## WO-174-D005

```json
{
  "id": "WO-174-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Apply the read guard to all four product package tasks, taking the same tracked paths and generated/documentation attributes as gateCodeIdentity. Move every observed excluded-input case into the document gate: kernel 2, compiler 0, skeleton 22, console 19 existing cases (the console’s five manifest-enumerated cases sit under one new tagged parent). Load the console manifest and historical receipt tools only inside tagged cases, so merely loading the product files reads no excluded inputs. Keep every assertion. Kernel gains kernel-docs; compiler gets the skip pattern but no docs task because its observed run read no excluded path. Skeleton-docs retains the outside-sandbox cause of the native cases it now runs.",
  "evidence": [
    "Observed guarded package inventory: kernel 284 excluded observations, compiler zero, console 3917, skeleton 683; four original tasks passed their tests but the three reading excluded inputs failed the guard",
    "packages/kernel/test/store-history.test.ts reads current docs streams; console board uses generated fixture files and current evidence; skeleton historical receipt imports occurred at module setup",
    "scripts/lib/product-read-guard.mjs: sync and promise readFile/open/readdir plus callback forms, async Test context, inherited NODE_OPTIONS, persistent per-task observations",
    "scripts/test-runner.test.mjs: named async and nested Node-child reads; docs, root Markdown, .agents, .claude and generated attribute; the child test passes but the outer task fails",
    "Runner development file: 46/46 passed after initializing its Git-less split fixture and carrying skeleton-docs’ actual outside-only cause"
  ],
  "rationale": "Rule beating: the runner judges the complete observation log, so catching a read error or a child result cannot make the task green. Policy resistance: documents and generated fixtures stay outside the product reuse key; no identity-input exception or registered source edit is needed. Commons and escalation: observe the existing run and move its cases, no second guard-only run. Shifting the burden and drift: the discovered setup reads get bounded lazy loading rather than an observer exemption. Seeking the wrong goal: preserve the case assertions while putting their consumed bytes under the correct gate. Success to the successful: identity expansion was admitted per path but would require registered-source remints and more key coupling; evidence favors tags here. Naive Interventionism: existing data-driven console cases still enumerate the same manifest and check the same outputs; the parent defers enumeration until the document gate. NoOp would leave setup-time and generated-input reads behind the unchanged key.",
  "rejected": [
    {
      "option": "Ignore module-setup or generated-input reads",
      "reason": "A product file can fail during setup on bytes the key excludes, and generated fixture changes also leave that key unchanged."
    },
    {
      "option": "Change gate-evidence.mjs to admit historical receipt tools as inputs",
      "reason": "Tags and lazy imports suffice; an edit would owe the authority, feedback and harness editions re-mints."
    }
  ],
  "reopenWhen": "The fixture loses async/child case attribution, a guarded package task observes an excluded read, a compiler case starts reading documentation, or doc-gate overhead changes the preferred routing."
}
```

## WO-174-D006

```json
{
  "id": "WO-174-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Check each machinery task entry, direct runtime first-party imports and literal first-party script paths against declared sources. Normalize built .js/.mjs package paths to their source. Conservative script literals include copied scripts that can later be spawned through variables; comments, strings containing quoted example code, interpolated paths and transitive imports are outside the check. Repair 73 previously missing direct inputs, and declare the new guard/check modules plus the import scanner under runner-fixtures. Reasoned shared exclusions are git.mjs, paths.mjs, helpers.mjs and config.mjs; all other reported inputs are declared.",
  "evidence": [
    "scripts/lib/machinery-coverage.mjs and its explicit scope message",
    "Unrepaired inventory: 73 findings including harness-fixtures -> scripts/harness.mjs, process-debt -> scripts/harness.mjs/resume.mjs/release.mjs/refute-plan.mjs, meta -> scripts/lib/plan-subject.mjs",
    "New positive/negative coverage fixtures fail an undeclared entry, direct import and literal spawned script by suite/path; blank exclusions fail; transitive/computed/comment paths stay outside",
    "Configuration-root owns every scripts/ edit; product worktree/checkpoint/release fixtures consume git/paths/helpers transport",
    "Three single-file selection observations: harness.mjs now adds harness-fixtures and process-debt; meta.mjs and worker-transport.ts selections stay the same"
  ],
  "rationale": "Mission and rule beating: the demonstrated evidence-wait mutant must reach the suite that judges it. Commons and escalation: direct closure and four narrow shared exclusions bound cost without returning to all-machinery review. Policy resistance: declarations remain the selector, and the check validates them rather than substituting dynamic import selection. Drift and shifting the burden: adding a literal dependency now fails the fixture instead of relying on a later order to notice. Success to the successful and seeking the wrong goal: measured selection cost will judge the added declarations, not a preference for more checks. Naive Interventionism: preserve runtime and selection semantics; conservative literals can over-select, so their costs and exact limits are disclosed. NoOp keeps the reproduced omitted-suite false green.",
  "rejected": [
    {
      "option": "Exclude scripts/harness.mjs from harness-fixtures",
      "reason": "Would restore the proven evidence-wait gap."
    },
    {
      "option": "Follow transitive imports",
      "reason": "Outside criterion 4 and widens the longest suites beyond the bounded direct closure."
    }
  ],
  "reopenWhen": "A newly uncovered literal first-party dependency appears, a conservative literal causes measured excessive selection, or the scanner’s lexical rules drift."
}
```

## WO-174-D007

```json
{
  "id": "WO-174-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Correct the new guard's log directory to use docPath(root, control, local/harness/runner/product-reads), preserving launchpad root configuration. The first full review run passed all four guarded product packages and the new runner fixtures, but configuration-root correctly rejected the literal docs/control path. Repeat the gate after this bounded implementation correction. Preserve the failed row and timing probes.",
  "evidence": [
    "npm test -- --review --again at 2026-09-30T17:17:20.437Z: 31 passed, configuration-root failed, 421268 ms; each guarded package had zero excluded reads",
    "scripts/test-configuration-root.mjs: no control-plane script keeps a literal document root; scripts/lib/config.mjs docPath is its established resolver",
    "A direct full node --test invocation passed the path check but lacked runner fixture context for two lifecycle tests; the suite is therefore judged through executeSuite and the final runner gate",
    "Scratch machinery timing: the clean base clone retained the work/WO-174 branch name, so test-codex-session's status command selected an absent order; its process-debt row failed 1 of 118 tests. Detaching only that scratch HEAD at the same base commit corrects selection; its source and failed logs remain intact"
  ],
  "rationale": "The literal path was this implementation's error, not an inherited configuration defect. The fix uses the existing root resolver without changing tests or adding an exception. The scratch failure is an invocation error: branch selection is meaningful control context, and a clean committed copy lacks the uncommitted activation. No source repair follows from that probe.",
  "rejected": [
    {
      "option": "Exempt the guard from configuration-root",
      "reason": "A moved launchpad must route its ignored observation logs correctly too."
    },
    {
      "option": "Count failed timing probes as successful validation",
      "reason": "They remain failed observations; corrected commands and the complete gate provide validation."
    }
  ],
  "reopenWhen": "A configured control root places guard logs at the wrong destination, or the complete gate reports another bounded implementation failure."
}
```

## WO-174-D008

```json
{
  "id": "WO-174-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep the specified Node fs and inherited-options boundary and disclose the non-Node command inventory in non-node-commands.md. One original package run observed tsc, git, sh, mkfifo, cmp, sandbox-exec, xattr, zsh, ps and the synthetic claude shim, plus codex-login and script-episode.js which are Node shebang entry points. The excluded-tree consumption is Git's document path inventory, control/profile history and committed document blobs in the original document-reading cases; those cases now run under the document gate. Shell and sandbox targets operate on synthetic temporary repositories; native tsc receives virtual source through callbacks; the other named native targets are temporary FIFOs, beacon files, xattrs or process metadata. These are conclusions from observed argv/cwd and the named consumers, not an OS filesystem trace.",
  "evidence": [
    "One observed four-package read inventory: session-scratch package-reads.json and non-node-observations.json; non-node-commands.md preserves the sanitized summary and consumer references",
    "One post-tag guarded product run at 2026-09-30T17:17:20.437Z: all four packages pass with zero Node excluded reads; its root Git arguments name source grep and revision/tree metadata, no excluded document path",
    "packages/kernel/test/store-history.test.ts; packages/console/src/collect.ts editionStream and scripts/lib/git.mjs readGitObjects committed-object reads",
    "packages/compiler/test/purity.test.ts and packages/skeleton/src/feedback-source-comments.ts virtual parser inputs",
    "packages/skeleton/src/script-episode.ts, discovery-sandbox.ts and harness-host.ts; beacon-fs, runtime-status, senses and verification test consumers"
  ],
  "rationale": "The order explicitly leaves non-Node reads outside the guard. Naming their observed inputs keeps that limit reviewable instead of extending a JavaScript observer into an unproved native tracer. NoOp on the inventory would conceal the boundary; broad native tracing would widen this order and require another host-specific mechanism. The document tags remove the observed current excluded-input dependence while preserving assertions.",
  "rejected": [
    {
      "option": "Claim every child filesystem read is observed",
      "reason": "Node children can clear inherited options and non-Node processes are outside the specified set; argv is not a filesystem syscall trace."
    }
  ],
  "reopenWhen": "A product task begins consuming a current excluded tracked input through a non-Node child, or a Node child which intentionally clears its options makes that input affect the task's verdict."
}
```

## WO-174-D009

```json
{
  "id": "WO-174-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep the ER4-001 and ER4-002 allocations live during execution and file close-register.md with their exact FUP identifiers, source revisions and canonical at-close disposition. Product 07 Discipline grows by 333 bytes, within the order's 400-byte bound, and the software-engineer TOC source lock follows that authorized guide edit. No evidence edition source, dependency or component runtime changed, so the local application patch target v0.57.1 needs no component bump or deterministic re-mint.",
  "evidence": [
    "followups --show FUP-c494a909ca1c6017 and FUP-4f482b75a1071ab9: each source revision 1, allocated to WO-174",
    "Guide source bytes 156718 at HEAD, current 157051: net addition 333; both additions are inside the cited Discipline bullets",
    "publication:check passes after refreshing only the software-engineer TOC source lock",
    "npm run plan -- check passes, recognizing WO-174's local v0.57.1 heading as release-assignment bookkeeping",
    "Same-day source citation correction: D008's draft named nonexistent packages/console/src/providers/control.ts; rg --files and collect.ts inspection locate editionStream in packages/console/src/collect.ts, and D008 now cites that checked path",
    "The first scratch timing continuation skipped the current-copy build after the earlier assertion aborted the loop. Missing-dist preflights are preserved, excluded from successful durations, and the current copy is built explicitly before repeating its measurements"
  ],
  "rationale": "A live allocation is not a closed repair; an executor cannot truthfully settle a finding before independent judgment and close. The bounded close instruction makes the future write-back concrete without manufacturing that state. Rule beating and seeking the wrong goal favor demonstrated negative controls over a prematurely settled register. Commons and Naive Interventionism favor 333 guide bytes, one source-lock refresh and no untouched component churn. NoOp on the close instruction risks losing the required retarget at the phase boundary.",
  "rejected": [
    {
      "option": "Settle both rows during execution",
      "reason": "The work order says at close, and its independent verdicts remain separate dispatches."
    },
    {
      "option": "Refresh unrelated publication editions or bump unchanged components",
      "reason": "The checked diff changes tests and runner support only; the existing source lock identifies the one affected public edition."
    }
  ],
  "reopenWhen": "Independent judgment finds either repair incomplete, an affected registered source changes before integration, or close cannot apply the disposition against current source revisions."
}
```

## WO-174-D010

```json
{
  "id": "WO-174-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Carry a missing guard manifest/log into a child's chosen environment whenever its NODE_OPTIONS retain this preload. Preserve an explicitly supplied observation context, and leave children that remove the preload outside the specified set. Add the reduced-environment child to the existing negative fixture. Stop the in-progress review gate through evidence --stop before this correction, then rerun it fresh; the stopped run records no row.",
  "evidence": [
    "Scratch partial-child-env fixture: a child with only the inherited NODE_OPTIONS read tracked docs/input.md, but the original guard returned task exit 0 with zero observations",
    "Corrected runner WO-174 fixtures pass, including named async/nested/default-env and reduced-env child reads, all six fs forms and direct machinery closure",
    "harness evidence --stop at 2026-09-30T17:48:05.831Z stopped this session's gate and reported no check recorded"
  ],
  "rationale": "Mission and rule beating: an inherited preload without its data cannot support a true product row; the concrete negative control closes that path. Drift and shifting the burden: one existing fixture pins both child environment forms. Policy resistance and escalation: preserve the child's other chosen variables and the explicit Node-options boundary, without a new native tracer or gate. Commons: observe the existing run, repeating the measured console comparison after the final correction. Success to the successful and seeking the wrong goal: the passed earlier suites do not justify retaining a proven hole. Naive Interventionism: copy only missing observation fields when this observer is retained; leave explicit nested contexts intact. NoOp leaves the reproduced false pass.",
  "rejected": [
    {
      "option": "Treat any reduced child environment as outside the guard",
      "reason": "This child retained the preload; criterion 1 includes Node children that inherit its options."
    },
    {
      "option": "Force the preload into children that intentionally remove options",
      "reason": "Outside the order's stated observation set and could change native fixture semantics."
    }
  ],
  "reopenWhen": "A child retaining the observer can still lose its required context, or an explicit nested context is overwritten."
}
```

## WO-174-D011

```json
{
  "id": "WO-174-D011",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Retain the repaired direct declarations despite their observed cost. costs.md records the three isolated before/after selections and every suite duration: harness.mjs adds harness-fixtures and process-debt, raising the selected-duration sum from 3.536 to 506.071 seconds (502.535 added). Exclusions harness-fixtures -> scripts/harness.mjs and process-debt -> scripts/harness.mjs would remove the added work; neither is applied. The former restores the proven wait-code gap, and the latter excludes a literal script input exercised for output-read, usage and lifecycle behavior. meta.mjs and worker-transport.ts selections are unchanged. Final console preload overhead is 0.249 seconds (15.619 without, 15.868 with). Product review is 402.242 seconds before and 396.299 after; document gate is 16.144 before and 36.323 after. Forty-three existing cases move: kernel 2, compiler 0, skeleton 22, console 19; one new console parent contains five of those cases.",
  "correction": "The initial D011 draft put 36.319 seconds in its prose without reading the exact row. The checked canonical row is durationMs 36323, recorded at 2026-09-30T18:01:02.328Z; the prose is corrected to 36.323, matching costs.md.",
  "evidence": [
    "costs.md: exact before/after selections, measured suite durations, scope/cutoff and retained failed timing probes; sums are not whole-review wall time and current measurements overlapped validation",
    "guard-drill.md, document-drill.md and harness-drill.md: negative old-source controls and unchanged-identity/document-red/product-green and selected wait-mutant drills",
    "Final npm test -- --review --again: 32 suites pass, 76 fresh tasks, zero excluded reads in all four packages; recorded 2026-09-30T17:58:19.775Z at code identity 4ff5f77fa1c42b18352e26743144f63ebb142385907dfd967945de389764b8bc",
    "Final standalone document gate: 24 suites pass, including kernel-docs, skeleton-docs and console-docs; exact cutoff and duration in costs.md",
    "publication:check, plan -- check, scoped source formatting and git diff --check pass; package/dependency/runtime/identity/reuse diffs are empty"
  ],
  "rationale": "Mission outcome: the two reproduced false-green paths now fail under the correct judge, while product tasks read no observed excluded inputs. Rule beating and drift are addressed by negative fixtures and direct declarations. Policy resistance is bounded by preserving the identity and selector. Commons and escalation worsen for harness edits by the named expensive suites; that cost is disclosed and accepted here because the order explicitly judges it as a decision, not a failing criterion. Shifting the burden improves because new direct dependencies and excluded reads fail mechanically. Success to the successful and seeking the wrong goal: retained passing evidence and suite counts do not outweigh a concrete negative control. Naive Interventionism: no runtime/schema/dependency change, no transitive/native tracing expansion, four reasoned shared exclusions retained. NoOp and the two proposed harness exclusions keep the observed regression route. The single feasibility experiment remains inconclusive: measured guard overhead does not establish a recurring net saving.",
  "rejected": [
    {
      "option": "Exclude the two harness consumers to keep the old review cost",
      "reason": "That removes required direct coverage and, for harness-fixtures, the exact demonstrated failure detector."
    },
    {
      "option": "Attribute every timing difference to the code change",
      "reason": "Host load, fixture waits and moved cases vary; only the selection changes and paired guard observation are established."
    }
  ],
  "reopenWhen": "The selected direct harness behavior can be covered by a cheaper executable suite without losing the negative control, or recurring measurements show the guard/document routing's cost defeats its critical-path reliability benefit."
}
```

## WO-174-D012

```json
{
  "id": "WO-174-D012",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Reopen the existing ER4-005 performance finding FUP-fb8cbeabbddef397: the final standalone document gate exceeds its recorded 30-second trigger. Route this decision's follow-up to that existing row as a duplicate, preserving one pending investigation. Keep WO-174's passing document routing; do not infer that the earlier proposed history parse cache fixes the newly observed cost.",
  "correction": "The initial followups --apply request was placed in granted system scratch, but that command requires a regular file contained in the project (scripts/refute-plan.mjs lines 201-204). It refused before applying anything. The same request is regenerated against the current register revision in ignored docs/control/local before canonical application.",
  "evidence": [
    "Canonical npm run test:docs row recorded 2026-09-30T18:01:02.328Z: 24 suites pass in 36323 ms; costs.md records the prior passing gate at 16144 ms and 43 re-tagged cases",
    "FUP-fb8cbeabbddef397 source revision 1, latest deferred disposition at 2026-09-30T14:20:20.623Z: reopen when npm run test:docs exceeds 30 seconds, docs-check exceeds 15 seconds, or plan check exceeds 8 seconds on the operator's host",
    "The final document row includes console-docs at 25439 ms and skeleton-docs at 13990 ms; these task durations overlap and are not additive gate wall time",
    "No diagnosis here establishes history parsing as the cause of this increase, and no concrete adjacent implementation fix is queued"
  ],
  "rationale": "Mission: keep the demonstrated failure detectors and make their recurring cost visible. Rule beating, drift and seeking the wrong goal reject hiding moved cases merely to meet an old timing threshold. Policy resistance and shifting the burden favor one existing, evidence-backed investigation. Commons and escalation favor no speculative cache or extra implementation in this order. Success to the successful does not let green tests override an observed reopening condition. Naive Interventionism favors measurement before choosing a fix. NoOp on the register would leave a crossed trigger recorded as deferred; NoOp on implementation is appropriate until the cause and a bounded fix are established.",
  "rejected": [
    {
      "option": "Leave the existing finding deferred",
      "reason": "Its explicit document-gate threshold is crossed by the recorded passing run."
    },
    {
      "option": "Implement the previously proposed parse cache during this order",
      "reason": "The measured increase follows changed case routing; a cache's effect on this cost is unestablished and requires diagnosis."
    }
  ],
  "followup": "Reassess recurring document-gate cost under the reopened ER4-005 finding FUP-fb8cbeabbddef397, using the WO-174 cost record to distinguish moved suite work from history parsing before selecting a repair. Route this decision's minted follow-up to that existing identifier.",
  "reopenWhen": "The existing finding is lost or closed without judging the observed threshold crossing, or new measurements identify a concrete bounded improvement."
}
```

## WO-174-D013

```json
{
  "id": "WO-174-D013",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Board, not fail: product suites outside the four guarded package tasks read tracked inputs that gateCodeIdentity excludes. Criterion 1 and the order's design scope the guard and the [document] tag to the product package suites, and the tag applies only to node:test cases, so the subject meets criterion 1 as written. The remainder matters at close: close-register.md proposes settling ER4-001 with the reopening condition that a product case consumes an excluded tracked input after WO-174 closes, and this verification has already observed product suites doing so.",
  "evidence": [
    "VER-001 wide probe in a session-scratch copy of the committed implementation: the same guard, record-only, applied to every non-build product row; one product run on 2026-09-30 between 19:02Z and 19:08Z",
    "Excluded tracked reads observed by suite: license-surfaces docs/LEGAL.md; github-body, outward-lint and target-publish docs/control/outward-vocabulary.json; local-runner-double 41 files under docs/evidence/WO-138/episodes/; resident-bind 110 paths under docs/control/orders/; resume docs/control/resume.jsonl, docs/evidence/WO-030/legacy-fold.json and legacy-times.json; artifact-corpus corpus/manifests/WO-101.json",
    "LEGAL.md drill in the implementation copy: one pin character changed, gate code identity unchanged at 4ff5f77f…, node scripts/license-surfaces.mjs exit 1; npm run test:docs is also red at its release-surfaces preflight, so this one input is covered by the document gate",
    "Whether the document gate covers the other inputs was not established"
  ],
  "rationale": "Mission: a reused product row should stand for the bytes its suites read, which is ER4-001's claim. Rule beating and seeking the wrong goal: settling ER4-001 over an observed remainder would record the class closed while its instances stand. Policy resistance and escalation: guarding every product row would fail seven suites now and needs a per-suite remedy, since the tag does not apply to script suites; that is a planning choice, not a verifier's repair. Shifting the burden: the inventory and a reproducible probe spare the next pass the rediscovery. Commons: no gate cost is added here. Success to the successful: the passing package guard does not show the class is closed. Naive Interventionism favours recording over a runner change inside a verification. NoOp would lose the remainder at the close disposition.",
  "rejected": [
    {
      "option": "Fail criterion 1",
      "reason": "Criterion 1's [document] tag and the design's guard name the product package suites; the four package tasks read no excluded input at the subject."
    },
    {
      "option": "Extend the guard in this verification",
      "reason": "A verifier never edits implementation to settle its own verdict, and the remedy per script suite is undecided."
    }
  ],
  "followup": "Planner: decide how product script suites that read excluded tracked inputs keep a reused npm test row true: license-surfaces (docs/LEGAL.md, also caught by release-surfaces in test:docs), github-body, outward-lint and target-publish (docs/control/outward-vocabulary.json), local-runner-double (docs/evidence/WO-138/episodes/), resident-bind (docs/control/orders/), resume (docs/control/resume.jsonl, docs/evidence/WO-030/legacy-*.json) and artifact-corpus (corpus/manifests/WO-101.json). Choose per suite among moving the reading check into the document gate, declaring the input in the identity where reports and control writes never change it, or guarding all product rows with an admitted-input list. At WO-174's close, settle ER4-001 only for the product package suites and keep this remainder pending. Priority: medium.",
  "reopenWhen": "A planning pass or a later order disposes the remainder, or a reused npm test row is shown to have passed over a changed input named here."
}
```

## WO-174-D014

```json
{
  "id": "WO-174-D014",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Board a gate gap that VER-001 F1 exposed. The worktree-integration fixture clones the source's committed HEAD and overlays only scripts/lib, scripts/worktree.mjs, scripts/resume.mjs, scripts/release.mjs and packages/beacons (scripts/test-worktree-integration.mjs, WO-115 D015). The console-fixture regeneration it runs (scripts/lib/worktree-integration.mjs, node scripts/console-fixtures.mjs --write whenever packages/console changed) therefore judges the committed packages/console and scripts/console-fixtures.mjs, not the order's working bytes. The final review records its pass before committing (dotln-reviewer procedure), so a break in those files passes every pre-publication npm test and first fails after the commit. F1 is routed to repair; this decision records the gate gap that let it pass.",
  "evidence": [
    "At this subject npm test -- --review passed fresh at code identity 4ff5f77f… (recorded 2026-09-30T18:51:05.757Z), with worktree-integration passing in 271.76 s, while node scripts/console-fixtures.mjs --check exits 1 in the worktree",
    "Session-scratch copy with the implementation committed: node scripts/test-runner.mjs --only worktree-integration --again exits 1, 11 cases failing on the same SyntaxError; with a one-line consumer fix committed on top, it passes in 219.91 s",
    "scripts/test-worktree-integration.mjs: the fixture's main is the source's committed revision plus the named working-tree overlays"
  ],
  "rationale": "Mission: a gate row must stand for the bytes the published subject carries; here it stood for the base's console files. Rule beating: an executor cannot see such a break in its own gate. Shifting the burden: without a record, main's next gate finds it. Policy resistance and escalation: building the fixture wholly from the working tree changes a recorded design (WO-115 D015) and is a planning choice. Commons: widening the overlay to the regenerators' inputs costs little per run. Success to the successful and seeking the wrong goal: a green fresh row is not evidence for files the fixture never takes from the working tree. Naive Interventionism favours recording over editing the fixture during verification. NoOp leaves the next such break to reach a PR.",
  "rejected": [
    {
      "option": "Treat F1 as the whole defect",
      "reason": "Repairing F1 removes this instance; the fixture would still judge committed console files for the next order."
    }
  ],
  "followup": "Planner: make worktree-integration judge the working bytes of every file its regenerators execute. Extend the fixture's working-tree overlay to packages/console and scripts/console-fixtures.mjs (or build the fixture from the working tree), and add a case in which an uncommitted export removal in packages/console/test/fixtures.ts fails the suite before commit. Priority: medium.",
  "reopenWhen": "A pre-publication npm test passes while a regenerator that worktree integrate runs fails on the order's working bytes, or the fixture's overlay rule changes."
}
```

## WO-174-D015 — Preserve lazy fixture loading at every tracked consumer

```json
{
  "id": "WO-174-D015",
  "date": "2026-09-30",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 by switching the console fixture generator to readFixtureManifest at invocation time. Pass that explicit manifest to loadFixture so --record-current-selfhost validates its newly pinned draft before replacing the recorded manifest, and every generated case uses the same snapshot. Add document-tagged regressions that execute the generator against current built exports and reject an invalid in-memory draft without changing the recorded manifest. Keep package imports free of manifest reads. Validate worktree-integration on a committed disposable copy; leave the fixture-overlay design recorded by D014 to its existing follow-up. Retain the order's one economy experiment D002 without starting another.",
  "correction": "D005 removed the manifest export to avoid a module-setup read but missed scripts/console-fixtures.mjs, its remaining tracked importer. A fresh build followed by node scripts/console-fixtures.mjs --check reproduces the missing-export SyntaxError on 2026-09-30. The intended correction preserves lazy loading while updating the consumer and preserving its pre-write validation semantics.",
  "evidence": [
    "docs/verifications/WO-174/VER-001.md F1: missing export, committed-copy integration failure and required repair rule",
    "Fresh npm run build passes; node scripts/console-fixtures.mjs --check exits 1 with the missing manifest export",
    "rg over scripts and packages/console finds only board.test.ts and scripts/console-fixtures.mjs importing the helper; the board already uses readFixtureManifest",
    "scripts/console-fixtures.mjs --record-current-selfhost mutates its manifest pins and calls loadFixture before writing; the new lazy loadFixture currently rereads disk instead of that draft",
    "scripts/test-worktree-integration.mjs clones committed HEAD and overlays a limited set; VER-001 D014 boards that design gap as FUP-dc1335f4d10f6a75",
    "WO-174-D002 is the existing single experiment, inconclusive, with measured preparation/run cost; no second trial is authorized by the repair",
    "The initial new draft regression rejected the changed pin correctly but expected a bare AssertionError message; Node appends its value diff. The test now checks the error class, named input prefix and expected draft pin, retaining the actual refusal.",
    "repair.md records both new document cases passing, both scratch negative controls failing, and all generator modes passing on the repaired committed copy; --write leaves fixture bytes unchanged.",
    "Committed-copy worktree-integration passes in 296.47 s (297.15 s including build), observed 2026-09-30T19:58:34.121Z; npm test -- --review --again passes 37 suites / 81 fresh tasks in canonical 396516 ms at identity 617f10c1852188fe21ac2085485e9442dc43be9a78fc72becab38b09d9db2cf1, recorded 2026-09-30T20:00:31.034Z. All four latest package guard logs have zero excluded reads.",
    "npm run test:docs passes 24 suites / 24 fresh tasks in canonical 35268 ms, recorded 2026-09-30T20:06:11.760Z, including the new generator and draft regressions. Publication, planning, source formatting and whitespace checks pass; runtime and dependency manifest diffs are empty."
  ],
  "rationale": "Mission and critical path: preserve executable gate evidence and the integration regenerator that publishes console fixtures. Rule beating and drift: check the actual tracked consumer and committed subject, with a new invalid-draft negative case rather than trusting the uncommitted green row. Shifting the burden: document regressions catch the renamed-export class before publication. Policy resistance: retain lazy imports and validate the draft the recorder actually writes. Commons and escalation: reuse existing console document tests and one required committed-copy integration run; no new gate, dependency or fixture-overlay redesign. Success to the successful: prior passing rows do not outweigh the reproduced consumer failure. Seeking the wrong goal: correct regeneration and pre-write validation, not just import success. Naive Interventionism: one optional test-helper argument and one explicit generator snapshot preserve existing default loads and assertions. NoOp leaves F1 reachable; restoring an eager export would reopen the excluded-input defect.",
  "rejected": [
    {
      "option": "Restore the module-level manifest export",
      "reason": "It reintroduces the excluded module-setup read that D005 deliberately removed."
    },
    {
      "option": "Only rename the generator import and reread the manifest in loadFixture",
      "reason": "The recorder would validate the old on-disk pins rather than its newly pinned in-memory draft."
    },
    {
      "option": "Redesign the worktree-integration overlay during F1 repair",
      "reason": "D014 records that design choice separately; a committed disposable subject establishes F1 without expanding the fixture architecture."
    }
  ],
  "reopenWhen": "A tracked consumer of a renamed fixture export fails to load, draft validation reads different pins from those written, a guarded product task reads the manifest during module setup, or the committed-copy integration fails."
}
```

## WO-174-D016 — Qualify the at-close input-coverage claim

```json
{
  "id": "WO-174-D016",
  "date": "2026-09-30",
  "dispatch": "resume: fix",
  "decision": "Correct close-register.md to settle ER4-001 only for the guarded product package suites, naming the observed script-suite remainder FUP-b28b870422a74166. Preserve the existing pending fixture-overlay input FUP-dc1335f4d10f6a75 and ER4-002 allocation until close. Do not edit filed VER-001 or dispose either planning remainder as repaired.",
  "evidence": [
    "VER-001 and WO-174-D013 inventory product script-suite excluded reads; FUP-b28b870422a74166 exists at source revision 1 with no closed disposition",
    "WO-174-D014 and FUP-dc1335f4d10f6a75 record the separate integration fixture design; F1 is its instance",
    "The current ER4-001 and ER4-002 source revisions are 1 and both are allocated to WO-174"
  ],
  "rationale": "Mission and rule beating require the close claim to match the demonstrated scope. Drift and seeking the wrong goal reject calling the full class closed over a known remainder. Shifting the burden preserves both concrete planning inputs. Policy resistance, escalation and commons favor correcting one owned handoff document with existing identifiers rather than widening the guard or duplicating follow-ups. Success to the successful gives the failed verifier evidence priority over the old close wording. Naive Interventionism limits this to disposition guidance; NoOp leaves an inaccurate at-close instruction.",
  "rejected": [
    {
      "option": "Settle ER4-001 without qualifying its scope",
      "reason": "D013 already disproves coverage of all product suites."
    },
    {
      "option": "Expand the guard to script suites during F1 repair",
      "reason": "Their per-suite treatment is undecided and the existing follow-up preserves that separate planning choice."
    }
  ],
  "reopenWhen": "Final judgment changes the demonstrated repair scope, either remainder is disposed independently, or close finds a different current source revision."
}
```

## WO-174-D017

```json
{
  "id": "WO-174-D017",
  "date": "2026-09-30",
  "dispatch": "resume: fix; release prepare",
  "decision": "Retime unpublished application target v0.57.1 to v0.58.1, the next patch above the observed release baseline v0.58.0, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.",
  "evidence": [
    "release baseline v0.58.0 (local tags)",
    "superseded target v0.57.1",
    "new target v0.58.1"
  ],
  "rejected": [
    {
      "option": "A dated roadmap or README paragraph",
      "reason": "A version collision is recorded once, as this decision (WO-086); product documents and the README carry only the version claim."
    }
  ],
  "reopenWhen": "A collision changes scope, acceptance, component versions or a published tag, or needs a hand step beyond this record."
}
```

## WO-174-D018

<!-- integration refs/dotln/checkpoint/WO-174/10 -->

```json
{
  "id": "WO-174-D018",
  "date": "2026-09-30",
  "dispatch": "resume: final review; worktree integrate WO-174",
  "decision": "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
  "evidence": [
    "refs/dotln/checkpoint/WO-174/10",
    "base dd141ad16dbd60e39ffb5afab21df57689cf4b79",
    "upstream e4426d2807773a39b459e39aae76bfbe625f3b87",
    "release preparation: WO-174 target v0.58.1 remains current. Files changed: docs/evidence/WO-174/meta.json, docs/final-reviews/WO-174/PR.md. Meter snapshot: docs/evidence/WO-174/meta.json, 4080 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-09-30. Original base: `dd141ad16dbd60e39ffb5afab21df57689cf4b79`.
Fetched main: `e4426d2807773a39b459e39aae76bfbe625f3b87`. Checkpoint: `refs/dotln/checkpoint/WO-174/10`.
Named stash retained: `a6893036bb893ae0917cb799def6bde58c6741ce` (WO-174 integrate 2026-09-30).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-174 target v0.58.1 remains current. Files changed: docs/evidence/WO-174/meta.json, docs/final-reviews/WO-174/PR.md. Meter snapshot: docs/evidence/WO-174/meta.json, 4080 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final review. VER-001 and VER-002 keep their recorded subjects over base `dd141ad1`. The integration fast-forwarded the uncommitted branch to fetched main `e4426d28` (WO-058, v0.58.0) and re-applied the named stash, with no authored conflict. Main changed no file under `scripts/`, and it changed no file this order edits. At the integrated tree, `git diff refs/dotln/checkpoint/WO-174/7` is empty for the runner, its fixture test, the read guard, the closure check, `scripts/harness.mjs`, `scripts/test-harness.mjs`, the console fixture generator, the kernel and console tests and `packages/skeleton/src/gate-evidence.mjs`. Criteria 2, 4, 5 and 6 are therefore carried forward from VER-001's reproductions, as VER-002 carried them. Criterion 3 is also carried forward, with one changed input: main edited product 02's verification section. The drill's mechanism is unchanged: the identity source, the kernel tag and the `kernel-docs` row. It was not re-run on the integrated bytes. On the integrated tree, the review's fresh product gate re-establishes criteria 1 and 9. It passed 32 suites with zero excluded reads in each guarded package, including main's new compiler and skeleton `verification-witness` tests. Product 07 still grows by 333 bytes over main's copy (criterion 8). The console fixture regeneration changed no byte. Application target v0.58.1 stays current above main's v0.58.0. No component version, dependency or evidence edition changes in this order's diff. Final review owns the independent acceptance judgment, recorded in [FINAL-001](../../final-reviews/WO-174/FINAL-001.md).
Authored conflicts observed: none.
Affected checks run by the final review on the integrated tree: `npm test -- --review` passed, recorded 2026-09-30T21:01:01.166Z (32 suites, 76 fresh tasks, 380,850 ms, identity `5ce3d229…`, tree `ff2abca2…`). `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local` each exit 0.

## WO-174-D019 — The catalog row's repeated-row carry-in is not discharged

```json
{
  "id": "WO-174-D019",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Board, not fail: the carry-in the second 2026-09-30 pass put on WO-174's catalog row is not discharged. It asked the executor to explain, in criterion 6's selection table, the twelve of forty npm test rows since WO-173 closed that ran fresh at a code identity already green. costs.md, D001-D018, the handoff and repair.md hold no such explanation, and neither verification judged it. The carry-in is catalog guidance the pass weighed without editing the judged order, and this review finds the order's nine criteria met, so it does not fail the review. Its consumer is the work-order map's candidate 4 (the structural cut of the product gate), held until WO-174 explains the repeats and WO-179 removes the verifier's procedural rerun. That hold's first premise is now unmet. One source of repeats is visible in this order's own record: WO-174 recorded seven npm test rows in this worktree, one failing. Two ran fresh at an identity already green, and both are verifier reruns with --again: VER-001 at 4ff5f77f and VER-002 at 617f10c1. That is the verifier's procedural rerun WO-179 targets. It does not explain the other orders' rows.",
  "evidence": [
    "docs/planning/work-order-map.md, WO-174 catalog row: Carry-in (2026-09-30 pass)",
    "docs/planning/standard-pass-2026-09-30.md theme 1 and docs/planning/work-order-map.md candidate 4",
    "grep of docs/evidence/WO-174 and docs/verifications/WO-174 for the carry-in's terms finds no explanation",
    "docs/control/local/harness/checks.json, WO-174 npm test rows: 16:39:48Z 73acb752 pass; 17:17:20Z 3f3e5f82 fail; 17:58:19Z 4ff5f77f pass; 18:51:05Z 4ff5f77f pass, fresh again (VER-001); 20:00:31Z 617f10c1 pass; 20:42:36Z 617f10c1 pass, fresh again (VER-002); 21:01:01Z 5ce3d229 pass (this review, integrated tree)"
  ],
  "rationale": "Mission: the hold on the gate's structural cut waits on an explanation that does not exist, so a planning pass could lift or keep the hold on a false premise. Rule beating and seeking the wrong goal: green criteria do not show that the carry-in was answered. Policy resistance and escalation: failing the review would send an analysis task through repair and a fresh verification for guidance outside the judged text. WO-178, which counts repeated runs, is the planned owner. Shifting the burden: the register keeps the question instead of the operator. Commons: no gate is spent. Success to the successful: the passing verifications did not judge the catalog row. Naive Interventionism: the reviewer records the observed instance and does not write the executor's analysis. NoOp would lose the unmet premise at close.",
  "rejected": [
    {
      "option": "Fail the final review and route the explanation to repair",
      "reason": "The order's criteria are met, the carry-in is catalog guidance outside the judged text, and repair plus fresh verification costs more than the question is worth before WO-178 counts the rows."
    },
    {
      "option": "Write the full explanation in this review",
      "reason": "It needs the gate history of eleven orders; the reviewer records what this order's own rows show and leaves the count to WO-178."
    }
  ],
  "followup": "Planner: WO-174 closed without the carry-in explanation of the twelve of forty npm test rows since WO-173 closed that ran fresh at a code identity already green. Candidate 4 in the work-order map (the gate's structural cut) is held until WO-174 explains the repeats; that premise is unmet. Give the explanation to WO-178, which counts repeated runs, and start from WO-174-D019's own instance: both verifications reran the full product gate with --again at identities the executor had already recorded green. Priority: low.",
  "reopenWhen": "WO-178 or a planning pass explains the repeated fresh rows, or the hold on candidate 4 is lifted or kept without that explanation."
}
```

## WO-174-D020 — A guard fault turns the package task red

```json
{
  "id": "WO-174-D020",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Record the choice the planning pass asked the executor to record and that no WO-174 decision states. The pass (entropy-review-004 §11, weighing receipt 035) directed that a guard that did not load fails its own fixture and leaves the suite's verdict alone. The implementation instead fails closed. If the preload or its manifest cannot load, Node exits before any case runs, so the package task is red. If the observation log cannot be read at the end, the runner sets exit code 1 with 'Product read observation unavailable' and failure kind 'launch' (scripts/test-runner.mjs executeSuite). The guard fixture in runner-fixtures uses the same preload, so it also fails. This review keeps the fail-closed behavior: a row whose reads were not observed would claim more than it proves, which is the defect the order removes. The disagreement with the pass's direction is preserved for the planner. No guard fault has turned a gate red in this order's recorded rows.",
  "evidence": [
    "docs/planning/entropy-review-004-2026-09-30.md §11, WO-174 item 'What happens when the guard itself fails'",
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md, WO-174 known issue on criterion:2",
    "scripts/test-runner.mjs executeSuite: the productReadObservations catch sets failure, and exitCode is 1 when failure is set",
    "scripts/lib/product-read-guard.mjs: the preload reads DOTLN_PRODUCT_READ_MANIFEST at import, before any case runs",
    "Review probe, 2026-09-30: NODE_OPTIONS --import of a missing preload exits 1 with ERR_MODULE_NOT_FOUND. The guard loaded with a missing manifest exits 1 with ENOENT. Neither reaches the case's code",
    "grep of docs/evidence/WO-174/decisions.md for a guard-fault choice finds none before this record"
  ],
  "rationale": "Mission and rule beating: an unobserved package run passing green is the false assurance the order exists to remove, so failing closed serves the objective. Policy resistance: this reverses a planning direction without the planner, so it is recorded and routed rather than silently kept. Drift and seeking the wrong goal: a red task on a guard fault is visible and its output names the cause. Escalation and shifting the burden: a guard fault would stop every product gate until repaired, which lands on the next actor; receipt 036's reopening condition names exactly that observation. Commons: no added run. Success to the successful: the executor's unrecorded choice is not accepted merely because it exists; it is judged against the order's objective. Naive Interventionism: changing it now would edit the runner after verification. NoOp would leave the pass's direction and the code disagreeing with no record.",
  "rejected": [
    {
      "option": "Change the runner so a guard fault leaves the suite's verdict alone",
      "reason": "A reviewer does not write behavioral code and certify it, and the change would let a package row pass with its reads unobserved."
    },
    {
      "option": "Fail the review on the unrecorded choice",
      "reason": "The order's criteria do not specify guard-fault behavior, and the implemented behavior serves its objective; recording the choice discharges the pass's request."
    }
  ],
  "followup": "Planner: confirm or reverse WO-174-D020. The planning pass directed that a guard that fails to load fails its own fixture and leaves the product suite's verdict alone; WO-174 fails the package task closed instead (an unloadable preload or unreadable observation log makes the task red). Decide which behavior the product gate keeps; receipt 036's reopening observation is a product gate turned red by a guard fault rather than an excluded read. Priority: low.",
  "reopenWhen": "A product gate run is turned red by a guard fault rather than an excluded read, or the planner reverses this choice."
}
```

## WO-174-D021 — The adopted 120 s cost figure is crossed

```json
{
  "id": "WO-174-D021",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Route the crossed cost reopening to the planner. The planning pass adopted receipt 035's 120 s reopening figure for WO-174's cost (entropy-review-004 §11), and receipt 036 names the same figure. D011 records that a change to scripts/harness.mjs now selects harness-fixtures and process-debt under --review, raising the selected suites' summed duration from 3.536 s to 506.071 s (+502.535 s). D011 keeps both declarations, as criterion 6 allows, and routes nothing. The document gate rose 20.179 s (16.144 to 36.323 s), below the figure, and D012 routes it to FUP-fb8cbeabbddef397. This review keeps D011's choice: removing harness-fixtures' declaration restores REVIEW-004's proven gap.",
  "evidence": [
    "docs/evidence/WO-174/costs.md, three single-file selections",
    "WO-174-D011 and WO-174-D012",
    "docs/planning/entropy-review-004-2026-09-30.md §11 ('the refuter's 120 s reopening figure is adopted')",
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md, WO-174 known issue on criterion:7"
  ],
  "rationale": "Mission: the harness selection buys the negative control that caught REVIEW-004's mutant, so the cost is kept. Commons and escalation: about 500 s lands on every review that edits scripts/harness.mjs, which crosses the figure the planner said would reopen the question. Drift: recording the crossing keeps the time standard from going unread. Shifting the burden: a register row reaches the planner without the operator carrying it. Policy resistance, success to the successful, seeking the wrong goal and rule beating do not change this routing decision. Naive Interventionism: no declaration is changed after verification. NoOp leaves a triggered reopening only in a decision the planner is not asked to read.",
  "rejected": [
    {
      "option": "Exclude scripts/harness.mjs from harness-fixtures or process-debt now",
      "reason": "D011: the first restores the proven evidence-wait gap; the second drops a direct input process-debt executes."
    }
  ],
  "followup": "Planner: receipt 035's adopted 120 s cost figure for WO-174 is crossed. Under --review, a change to scripts/harness.mjs now selects harness-fixtures and process-debt, and the selected suites' summed time rose from 3.536 s to 506.071 s (WO-174 costs.md, D011). Weigh a cheaper suite that keeps the evidence-wait negative control, or accept the cost with a new figure. Priority: low.",
  "reopenWhen": "A cheaper executable suite keeps the evidence-wait negative control, or the planner accepts the cost with a new figure."
}
```

## WO-174-D022 — Guard logs accumulate without a retention rule

```json
{
  "id": "WO-174-D022",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Board a low-severity defect met in review. Every guarded product run writes a manifest and an observation log per package task, under the ignored docs/control/local/harness/runner/product-reads/, with a random name. Nothing prunes or rotates them: no other reader exists besides the gate's checks.json entries, which name each log path (productReadLog). On 2026-09-30 one run wrote about 4.6 MB: four manifests of about 204 KB each, a skeleton log of about 3.45 MB and a console log of about 0.34 MB. The directory held about 42 MB (32 task logs and their manifests) after this order's runs in this worktree. Growth is bounded by a worktree's life when release close removes it, but a long-lived checkout that runs the gate keeps growing. It is not fixed here: a retention rule changes the runner after verification and must keep or rewrite the checks.json references.",
  "evidence": [
    "scripts/lib/product-read-guard.mjs productReadEnvironment: mkdirSync, then writes a <name>-<uuid>.json manifest and a .jsonl log per task",
    "grep of scripts for product-reads finds only the writer; scripts/lib/harness-prune.mjs does not name it",
    "docs/control/local/harness/checks.json records productReadLog paths",
    "ls -la docs/control/local/harness/runner/product-reads/ on 2026-09-30"
  ],
  "rationale": "Commons: local disk and backups pay for logs nobody reads again. Drift: an unbounded ignored store becomes the normal state unless recorded. Rule beating and seeking the wrong goal are not engaged, because the logs are evidence of the guard's run, not of its verdict. Policy resistance: a retention rule must not orphan checks.json references. Escalation and shifting the burden: a small rule now avoids an operator clean-up later. Success to the successful: the passing guard does not excuse the storage cost. Naive Interventionism: the reviewer does not change the runner after verification. NoOp costs about 4.6 MB per guarded run.",
  "rejected": [
    {
      "option": "Delete old logs in this review",
      "reason": "They are ignored local evidence that checks.json names; a rule, not a one-off deletion, is the repair."
    }
  ],
  "followup": "Give the product read guard's logs a retention rule. docs/control/local/harness/runner/product-reads/ gains about 4.6 MB (four manifests and four logs) per guarded product run, and nothing prunes it. Keep the latest run's logs for each package task, or those that checks.json rows still name, and remove the rest without leaving dangling productReadLog references. Priority: low.",
  "reopenWhen": "A retention rule lands for the guard's logs, or a checkout's product-reads directory is observed above 1 GB."
}
```

## WO-174-D023 — The untracked-source gap's reopening observation occurred

```json
{
  "id": "WO-174-D023",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Reopen WO-173-D018 (FUP-7629e03c6573f5cb). The row was deferred with the reopening condition 'a gate row whose identity missed a new source file', and this order recorded four passing rows of that kind. scripts/lib/product-read-guard.mjs and scripts/lib/machinery-coverage.mjs stayed untracked until this review staged them. The passing rows at 4ff5f77f (executor, VER-001) and 617f10c1 (executor repair, VER-002) therefore keyed neither file, although both files are runner inputs every one of those runs executed. No wrong reuse followed: each row ran fresh with --again, under the interim rule and the verifier's procedure. This review staged both files and paid one more fresh gate at 5ce3d229 so that the publication-bound row keys them. WO-058's final review recorded the same shape for its three new test files. The reopening changes nothing in WO-174's subject.",
  "evidence": [
    "docs/control/local/harness/checks.json, WO-174 npm test rows (see WO-174-D019)",
    "docs/evidence/WO-174/handoff.md: new source files remain untracked until final review",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity keys tracked paths (git ls-files)",
    "docs/final-reviews/WO-058/FINAL-001.md, Gate identity",
    "FUP-7629e03c6573f5cb latest disposition, deferred 2026-09-30T14:01:27.309Z"
  ],
  "rationale": "Mission and rule beating: a row whose identity omits a runner input can be reused after that input changes. The interim --again rule held here, but at the price of repeated full gates, which WO-174-D019 counts among its repeated fresh rows. Drift: the deferral's premise, that no such row is recorded, no longer holds. Shifting the burden: the planner, not the next reviewer, should decide the repair. Policy resistance, escalation and commons: reopening adds no gate and changes no code. Success to the successful: the passing rows do not show the gap closed. Seeking the wrong goal: register accuracy serves the next planning pass. Naive Interventionism: the reviewer reopens the row and does not open the reuse lookup, which the order's non-goals exclude. NoOp leaves a met reopening condition recorded as deferred.",
  "rejected": [
    {
      "option": "Leave the row deferred",
      "reason": "Its written reopening condition is met by rows this order recorded."
    },
    {
      "option": "Open the reuse lookup to key untracked sources in this review",
      "reason": "The order's non-goals exclude the untracked-source gap, and a reviewer does not write behavioral code."
    }
  ],
  "reopens": {
    "decisionId": "WO-173-D018",
    "observation": "WO-174's passing npm test rows at identities 4ff5f77f and 617f10c1 (2026-09-30, executor and both verifications) were recorded while scripts/lib/product-read-guard.mjs and scripts/lib/machinery-coverage.mjs were untracked, so gateCodeIdentity keyed neither runner input. Each ran fresh with --again; WO-174's final review staged both and ran one more fresh gate. WO-058's final review recorded the same shape. The deferral's reopening condition, a gate row whose identity missed a new source file, is met."
  },
  "reopenWhen": "The planner closes the untracked-source gap or re-defers it with a new condition."
}
```
