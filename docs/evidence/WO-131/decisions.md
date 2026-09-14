# WO-131 decisions

## WO-131-D001

```json
{
  "id": "WO-131-D001",
  "date": "2026-09-13",
  "dispatch": "Operator direction to finish the planning branch regardless of the refutation verdict, captured in ignored intake and attributed by the planning override event. This does not activate WO-131.",
  "decision": "Honor an existing attributed override when admitting later planning receipts. Preserve exact receipt/hash/hold addressing, chronology, immutable history and the requirement to answer each new hold separately. Retain the current independent HOLD and record the operator-authorized override. WO-130 remains merged and closed.",
  "evidence": [
    "docs/control/plan-refutations.jsonl",
    "docs/planning/refutations/2026-09-13-planning-dc998fb93c27e337-012.md",
    "scripts/test-plan-refutation.mjs: the prior implementation rejected later planning despite an existing operator override; the regression reproduced it."
  ],
  "rejected": [
    "NoOp leaves planning blocked despite the existing decision.",
    "Rewrite WO-130 or discard the finding: either would misrepresent the operator's scope or the independent judgment."
  ],
  "reopenWhen": "An override admits a different receipt or hold, applies retroactively, or permits an unanswered new hold through the gate."
}
```

The independent review repeated the absolute-path concern against WO-130.
Receipt 011 already has an operator override for that concern. Receipt
admission nevertheless demanded a change to its held criterion before allowing
the WO-131 planning update. A regression reproduced that failure. The bounded
repair makes admission honor the existing attributed override; it preserves
the historical finding, requires the override to predate the new receipt, and
leaves any new hold subject to its own operator decision. The current review's
hold is retained and the operator's instruction supplies its override.

This enables the next gate-reuse order on the route to the resident runtime and
the independently verified external-change loop. NoOp keeps planning blocked
despite the existing decision. Rewriting WO-130 would misrepresent the operator's
scope. Policy resistance, escalation, shifting the burden to the intervenor and
seeking the wrong goal favor removing this repeated bookkeeping obstacle.
Tragedy of the commons requires counting the failed review attempts, repair and
waiting as process cost. Drift to low performance and rule beating are checked
by preserving the verdict, exact override addresses, timing checks and immutable
history. Success to the successful gives the broken admission rule no special
claim to preservation. Naive Interventionism favors this reversible correction
to the existing reader and writer, with regression evidence, over changing the
reviewed work order or introducing another workflow.

Reopen if an override admits a different receipt or hold, applies retroactively,
or permits an unanswered new hold through the gate. No reduction in measured
process cost is claimed by this closeout.

## WO-131-D002

```json
{
  "id": "WO-131-D002",
  "date": "2026-09-13",
  "dispatch": "Operator correction after two failed external CLI refutations: planning sessions must use fresh background workers, as the completed third attempt did. The source instruction is captured in ignored intake.",
  "decision": "Dispatch one fresh background refuter without inherited conversation, supplying the canonical prompt, closed result schema and shared goal card. The parent remains the sole repository writer and files the frozen judgment through the receipt helper. Bare plan refute prints that prompt; --direct remains an alias. External transports require an explicit operator request, with no automatic fallback. Update the shared role source and regenerate both harnesses.",
  "evidence": [
    "docs/planning/refutations/2026-09-13-planning-dc998fb93c27e337-012.md",
    "First external attempt ended at its budget cap without a judgment; the second stopped at usage collection without filing a verdict. The background worker returned a completed independent judgment.",
    "docs/evidence/WO-131/authority/002",
    "scripts/test-plan-refutation.mjs: default dispatch, scoped JSON schema, full-scope compatibility and explicit-transport checks."
  ],
  "rejected": [
    "NoOp retains the failed external-launch route as the default.",
    "Automatic fallback to another paid CLI would repeat the operator's stated complaint.",
    "Give the worker the planner's conversation or let it file directly: this compromises the intended evidence boundary or sole-writer responsibility."
  ],
  "reopenWhen": "Worker availability or recorded outcomes show that the default prevents completed independent review."
}
```

This removes the observed external-launch detour while preserving independent
judgment and receipt validation. NoOp retains the two failed paths as defaults.
The D001 goal and trap comparison applies: commons cost, escalation and burden
shifting favor the worker; policy resistance and rule beating require an isolated
prompt, unchanged judgment and explicit overrides; outcome standards remain
unchanged. Naive Interventionism favors changing the shared role source and
default route while retaining explicitly requested transports. This is not a
claim that workers cost no tokens or that this single observation establishes
a comparative cost reduction. Reopen if worker availability or recorded outcomes
show that the default prevents completed independent review.

The shared skill behavior requires the skeleton component patch 0.15.10.
Authority edition 001 preserves the initial skill projection; edition 002 pins
the matching version and runtime projection. This planning correction creates
no application tag or Release and leaves WO-130's closed lifecycle intact.

## WO-131-D003

```json
{
  "id": "WO-131-D003",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand during execution: remove the pre-submit blocker that prevents starting Claude or Codex or submitting a resume phrase.",
  "decision": "Prompt submission always remains open. Generated bootstrap failures and host runtime, state or dispatch failures return advisory context, never a blocking response. A failed automatic dispatch still performs no lifecycle mutation. Existing command-time authority, writer isolation and evidence checks remain responsible for the attempted effect.",
  "evidence": [
    "packages/compiler/src/harness.ts emitted decision:block when the session adapter could not load.",
    "packages/skeleton/src/harness-host.ts protocolRefusal blocked UserPromptSubmit for illegal phases, unavailable briefings, unreadable state and runtime failures.",
    "The fresh WO-131 worktree had neither node_modules nor built package outputs at entry; npm ci --ignore-scripts --offline and npm run build restored the runtime. This is an observed failure path, not proof of the operator's exact Claude refusal.",
    "scripts/test-process-debt.mjs exercises the generated bootstrap and host responses, including missing runtime, damaged state, malformed input, a pin mismatch, illegal phase, missing briefing, active gate and another writer."
  ],
  "rejected": [
    "Fix only the reported resume phrase: other setup failures would still lock the operator out before a model can help.",
    "Require a healthy runtime or a legal lifecycle phase before accepting a prompt: this preserves the operator's reported failure.",
    "Remove the effect-time guards: the operator corrected prompt admission, and an accepted message does not itself authorize conflicting writes or unverified completion."
  ],
  "reopenWhen": "Any generated startup or prompt hook can reject a message, or an advisory response falsely claims that an automatic dispatch completed."
}
```

This directly serves operator flow and restores access to the machinery needed
for the independently verified external-change loop. NoOp keeps recurring
operator rescue and a model that cannot receive the repair request. Policy
resistance and shifting the burden are the live defects; rule beating is
addressed by testing the emitted hook process, including failure before imports.
Seeking the wrong goal and drift to low performance favor an open conversation
over a perfect setup receipt. Commons cost and escalation favor one shared
response rule with no new operator step. Success to the successful supplies no
reason to retain the previous blocking design. Under Naive Interventionism,
successful automatic dispatch and command-time protections remain useful; the
bounded change replaces only the prompt rejection response and is reversible.

## WO-131-D004

```json
{
  "id": "WO-131-D004",
  "date": "2026-09-14",
  "dispatch": "resume: next selecting WO-131 criteria 1-7 and 9-11.",
  "decision": "Give every reusable fixture suite declared candidate paths and an explicit environment. Filter both replica execution and identity through that declaration; temporary and gate diagnostic locations remain runner-owned. Keep real repository evidence and live checks in the candidate tree with named reasons. Replace the runner inventory test's ambient historical Git read with an exact public v0.16.0 package fixture, and run the harness read-only control test against a synthetic repository with the real lifecycle. Add a once-per-gate optional kernel read-denial probe and record its result; availability never changes reuse eligibility.",
  "evidence": [
    "WO-130-D009 and FINAL-001 check 5 record zero cross-role reuse from undeclared per-session variables.",
    "scripts/test-harness.mjs reads its candidate control projection in one fixture; scripts/test-runner.test.mjs reads the immutable v0.16.0 package command chain. These are the two ambient inputs to isolate without removing assertions.",
    "The installed-link copier and release spelling repairs already exist in this branch baseline after the WO-130 recovery; their existing fixtures will be retained and exercised."
  ],
  "rejected": [
    "Keep the shared session environment: every role pays a fresh gate for identity values its fixtures supply themselves.",
    "Declare the whole docs tree for fixture suites: report writes would invalidate the expensive suites again.",
    "Require kernel denial for reuse: nested sandbox unavailability would withdraw the replica benefit."
  ],
  "reopenWhen": "A declared execution needs another input, a retained suite crosses the measured wall-clock band, or an environment omission changes a test's behavior outside its explicit fixture setup."
}
```

This removes repeated gate work on the path to the resident external-change loop.
NoOp preserves the measured 78-fresh cross-role gates. Policy resistance, rule
beating and seeking the wrong goal are checked by matching execution to the key
and measuring actual reuse. Commons cost and drift are judged by the host bands,
not a new mechanism count. Escalation and shifting the burden favor automatic
composition with no new operator step. Success to the successful does not excuse
the current whole-tree scopes. Naive Interventionism preserves every assertion,
the full-gate aggregate, candidate evidence checks and publication controls.

## WO-131-D005

```json
{
  "id": "WO-131-D005",
  "date": "2026-09-14",
  "dispatch": "Operator follow-up during scope expand: reject the circular requirement for built dependencies before Claude can begin.",
  "decision": "Prepare dependencies, build outputs and generated runtime in worktree start before printing the launch handoff. Provide a dependency-free node scripts/bootstrap.mjs entry point for raw or interrupted checkouts. When a generated adapter cannot load, read-only tools and that exact bootstrap command remain available; other tool effects retain their ordinary refusal. Runtime pin checks are DotLn artifact checks, not minimum Claude CLI version checks.",
  "evidence": [
    "scripts/worktree.mjs start only added the checkout and activated the order before printing the launch command. It did not install dependencies or create the ignored runtime snapshot.",
    "Every generated PreToolUse bootstrap catch also returned deny, so changing only the prompt catch would move the dependency loop to the first build tool call.",
    "The host version observation only emits a warning; assertHarnessRuntime independently requires matching DotLn compiler/runtime versions and artifact bytes. No transcript of the operator's exact failed prompt was available in the inspected local project logs."
  ],
  "rejected": [
    "Make the operator install dependencies before launching a model: recurring startup rescue is the defect.",
    "Open prompts but leave bootstrap commands denied: the same loop persists at the first tool.",
    "Allow arbitrary writes while the runtime is absent: a bounded preparation route and read access resolve this startup defect."
  ],
  "reopenWhen": "A fresh worktree needs an operator repair before either model can start, bootstrap still depends on built adapters, or the fallback admits a command outside its exact startup/read set."
}
```

D003's mission and eight-trap comparison applies. The new evidence is the second
half of the dependency loop at first tool use. The intervention moves setup to
the existing worktree creation step and preserves a local repair route; it adds
no operator step. NoOp would keep shifting recovery onto the operator.

## WO-131-D006

```json
{
  "id": "WO-131-D006",
  "date": "2026-09-14",
  "dispatch": "resume: next; executor correction during output comparison.",
  "decision": "Preserve the original D001 and D002 planning decisions byte-for-byte and append the execution decisions as D003-D005. The initial write incorrectly assumed this evidence file was new. Comparing the diff exposed the replacement; the original Git bytes were restored as the exact prefix before continuing.",
  "evidence": [
    "git show HEAD:docs/evidence/WO-131/decisions.md contains the two planning decisions; the working file now retains that complete source and the three newly authored execution decisions."
  ],
  "rejected": [
    "Discard either the planning history or the current execution decisions."
  ],
  "reopenWhen": "A later write changes the inherited decision bytes or reuses an existing decision identity."
}
```

## WO-131-D007

```json
{
  "id": "WO-131-D007",
  "date": "2026-09-14",
  "dispatch": "Operator scope expansions for unconditional analysis: and operator override:, followed by ideation about immediate working-state recovery.",
  "decision": "Handle operator controls before runtime imports or repository-state checks; suspend DotLn hooks for this session until explicit exit. Supply a dependency-free adapter for Codex and raw checkouts. Preserve the broader general working-state repair as a candidate in the ideation receipt; no fake lifecycle completion or test result.",
  "evidence": [
    "docs/evidence/WO-131/ideation.md",
    "Generated PreToolUse catches and host state admission can deny repair tools after accepting the prompt.",
    "The operator explicitly requires recovery irrespective of repo, worktree, runtime, gate or lock state."
  ],
  "rejected": [
    "NoOp leaves the operator dependent on the broken harness for rescue.",
    "Merely accepting the phrase while denying its repair tools preserves the same failure.",
    "Silently mark failed checks passed or erase evidence: neither represents the observed result or preserves recovery history."
  ],
  "reopenWhen": "Any DotLn hook denies operator-control entry or authorized recovery tools, a mode leaks to a different session, or the general recovery candidate is presented as implemented."
}
```

D003’s mission and eight-trap comparison applies. The new evidence is the
operator’s need to interrupt the machinery itself. Policy resistance and burden
shifting favor an entry independent of that machinery. Rule beating and drift
require truthful override records; seeking the wrong goal rejects a green label
without an observed result. Commons cost and escalation favor a small shared
adapter. Success to the successful does not privilege a broken gate. Naive
Interventionism preserves ordinary checks and evidence outside explicit recovery.

## WO-131-D008

```json
{
  "id": "WO-131-D008",
  "date": "2026-09-14",
  "dispatch": "Operator scope expand: this final emergency gate-cost work order must demonstrate unambiguous speedup and return on the weekend investment before completion.",
  "decision": "Make real host end-to-end comparisons a handoff requirement, including preparation, build, live checks and failed attempts. Show comparable savings per gate and phase episode, work-order totals, and investment/payback with explicit limits; do not substitute reuse counts for elapsed time.",
  "evidence": [
    "WO-131 criteria 4, 7, 10 and 11 already name the 243–419 second document-change class, 41–47 second identical-tree band and 780–805 second fresh full gate.",
    "Operator explicitly strengthened the outcome requirement during this execution."
  ],
  "rejected": [
    "NoOp would allow the final emergency order to finish without proving the promised reduction.",
    "Average unlike rows, omit preparation or failure costs, or claim every historical minute is already repaid."
  ],
  "reopenWhen": "The measured comparable episodes do not show a clear reduction, required rows are missing, or later phase gates rerun unchanged declared suites."
}
```

D004’s goal and eight-trap comparison applies. This scope makes commons cost,
drift to low performance and seeking the wrong goal directly falsifiable through
operator-visible elapsed time. Naive Interventionism requires retaining the
passing coverage while removing repeated work. The measurement is part of the
investment, not a cost to omit from the comparison.

## WO-131-D009

```json
{
  "id": "WO-131-D009",
  "date": "2026-09-14",
  "dispatch": "Operator scope expand: fix the hypothetical WO-130 planning hold that was previously overridden.",
  "decision": "Resolve the exact absolute-candidate-path counterexample with effective kernel read denial for source executions that populate narrowed success records. Probe once per gate, wrap every narrowed child and its descendants, and persist the protection in sealed provenance. If denial is unavailable, run the suite fresh against the complete candidate and do not cache that success. Supersede D004’s optional-denial reuse rule under the new operator scope.",
  "evidence": [
    "docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-011.md: hold-1f48b13575cfc084ddcaca61",
    "docs/planning/refutations/2026-09-13-planning-dc998fb93c27e337-012.md: hold-4d8e27e5c803a66e728dcaa2",
    "The host probe outside the Codex sandbox established candidate read denial and successful sandbox startup on 2026-09-14. Nested sandbox availability remains a separate observation."
  ],
  "rejected": [
    "NoOp leaves the expressly reopened successful-read counterexample.",
    "Static path matching or Node filesystem monkeypatches cannot establish denial for child processes or computed paths.",
    "Retain unprotected narrowed successes and call the hypothetical issue fixed.",
    "Block the operator or refuse the gate when the sandbox cannot start: fresh execution remains available."
  ],
  "reopenWhen": "An undeclared absolute candidate read succeeds under the applied boundary, a reusable replica record lacks protection provenance, or the required host payoff is not achieved."
}
```

This protects dependable gate reuse on the critical path while preserving
operator access. NoOp retains the reopened correctness gap. Policy resistance
and rule beating are tested by the actual successful-read counterexample;
seeking the wrong goal rejects a speedup based on unsupported successes.
Commons cost and drift require the operator-host bands and the payoff report.
Escalation and shifting the burden favor one automatic probe without a new
operator procedure. Success to the successful does not privilege either the
old optional policy or a slower new one. Naive Interventionism keeps every
suite runnable and preserves the prior overrides and immutable review history.

## WO-131-D010

```json
{
  "id": "WO-131-D010",
  "date": "2026-09-14",
  "dispatch": "resume: next; criterion 10 release-close reuse and operator requirement for demonstrated payoff.",
  "decision": "Fingerprint and copy the runtime snapshots referenced by the installed manifest, preserving all older snapshots on disk without making their recovery history a suite input. If manifest selection is absent or unreadable, retain the complete runtime root conservatively. Prove active-byte invalidation and reuse with differing obsolete histories.",
  "evidence": [
    "gateInstalledInputRoots includes all of .runtime/harness; suite observation hashes those bytes and the replica copies them.",
    "The active worktree has four retained snapshots and main has ten. These are observed local counts, not a claim that their active runtime bytes already match."
  ],
  "rejected": [
    "NoOp forces full-suite reruns after otherwise matching handoffs and copies obsolete installed bytes.",
    "Delete old snapshots to make keys match: recovery history must be preserved.",
    "Ignore runtime bytes entirely: tests and hooks depend on the active installed runtime."
  ],
  "reopenWhen": "A suite legitimately needs an unselected historical runtime, current runtime changes do not invalidate reuse, or an unreadable manifest grants narrowing."
}
```

D004’s mission and eight-trap comparison applies. The observed history-dependent
input shifts repeated gate cost onto each phase and release close. Naive
Interventionism narrows only the selected runtime input and preserves every
recovery copy. Rule beating is checked by active-byte invalidation and a
conservative fallback; actual host measurements judge the saved work.

## WO-131-D011

```json
{
  "id": "WO-131-D011",
  "date": "2026-09-14",
  "dispatch": "resume: next release preparation under the work order’s patch classification and authorized operator-control scope.",
  "decision": "Bump compiler 0.9.1 to 0.9.2 and skeleton 0.15.10 to 0.15.11, including the workspace dependency and runtime pins. These patches correct local harness admission and gate input behavior; domain events and exported runtime schemas remain unchanged. Select new immutable evidence editions for the changed compiler identity and feedback source.",
  "evidence": [
    "Compiler lowering emits the corrected prompt and dependency-free operator-control entry.",
    "Skeleton host, shared role instructions and installed-input observation changed.",
    "Kernel and console source behavior are unchanged; console retains all tests through separate runner tasks."
  ],
  "rejected": [
    "Change source without component bumps, leaving the installed runtime identity stale.",
    "Bump untouched components or rewrite a prior immutable evidence edition."
  ],
  "reopenWhen": "Compatibility checks expose an actual schema/API change or a component collision is observed during authorized integration."
}
```

The D003/D004 goal and trap comparisons apply. Versioning preserves observable
compatibility and current evidence without creating another operator procedure.

Authority revision 003 preceded final source formatting. Revision 004 records
the resulting pinned runtime and wrapper bytes; 003 and the inherited planning
editions remain immutable. Release preparation initially found the planning
heading’s unassigned-version placeholder and the prior README claim. Assigning
v0.17.6 and matching its prepared-source claim allowed the local preparation
helper to pass against the observed v0.17.5 tag. No tag or Release was created.


## WO-131-D012

```json
{
  "id": "WO-131-D012",
  "date": "2026-09-14",
  "dispatch": "resume: next; criteria 8 and 10 require executable release-close handoff and composition evidence.",
  "decision": "Reject an ineligible main/detached checkout before reserving a writer. Drive the generated hooks with the actual lifecycle-printed handoff and preview. Exercise the real release helper after a reviewed fixture branch merges with a main-only document, retaining all 62 declared successes across the changed session.",
  "evidence": [
    "The printed-handoff regression admitted the correct commands but showed that a refused --force spelling left a writer lock. The host now observes checkout eligibility before attempting reservation, and the regression passes without a lock or lifecycle mutation.",
    "The real cached_evidence release case passes with 17 fresh and 62 reused tasks after merge, installed-input/evidence handoff and worktree removal. Fixture suite bodies and publication transport are synthetic; this is correctness evidence, not a host speed measurement.",
    "The fixture initially retained a main-only synthetic dist file; making its synthetic build publish the same complete output inventory fixed the resulting legitimate runtime-key mismatch. No production cache input was weakened.",
    "CLAUDE.md exposes both operator prefixes at initial entry, in addition to every generated role skill."
  ],
  "rejected": [
    "NoOp leaves a denied main command holding an unnecessary writer lock.",
    "Test a hand-written command without checking the actual lifecycle output.",
    "Ignore installed runtime differences to force reuse in the release fixture."
  ],
  "reopenWhen": "A rejected main dispatch acquires a lock, printed admission drifts, or actual release close cannot reuse matching declared successes."
}
```

The D003/D004 mission and eight-trap comparisons apply. This removes a real
side effect and checks the complete handoff without adding an operator step.
Naive Interventionism favors the eligibility observation before acquisition;
NoOp leaves an unnecessary lock. Authority revision 005 pins the final host
correction; earlier editions remain intact. Measured host time remains the
completion standard under D008.


Final preflight found the duplicated entry/role recovery prose exceeded the
existing Codex verifier and release-close cold-start budgets. The shared entry
and role wording were shortened without changing commands, recovery authority,
clean-room requirements or budgets. Authority revision 006 records that final
instruction projection; earlier observations remain preserved. This directly
reduces required entry context under D008 instead of accepting a higher limit.


## WO-131-D013

```json
{
  "id": "WO-131-D013",
  "date": "2026-09-14",
  "dispatch": "resume: next; actual replica execution and the operator's measured-payoff completion requirement",
  "decision": "Repair fixture assumptions exposed by the first complete host run. Restore write permission only on fixture-owned copied runtime files before fixture cleanup; never follow installed links. Declare the resume suite's frozen legacy control inputs. Pin the context comparison's two original activation files as a checked fixture instead of requiring unavailable Git history. Require the WO-032 name prefix when splitting console tests, and pin the console to the already-recorded current feedback edition after the compiler patch. Keep all behavioral assertions and historical evidence.",
  "evidence": [
    "The first host run failed cleanup with EACCES in copied runtime directories, legacy comparison with ENOENT, and the context comparison with an unavailable historical Git object.",
    "A negative-only Node name filter selected the file-level parent and therefore its current-source descendant. The executable split regression now proves disjoint complete selection.",
    "All 17 original console fixture assertions pass against WO-131 feedback-001. The separate current-source collector also passed. The designated console recorder refreshed only the selfhost case and its pinned paths; previous source editions are unchanged.",
    "The role regression now requires operator controls first and the read-only entry before subject reads. All three support-composition tests pass; the saved semantic-hash assertion is unchanged.",
    "The context baseline was captured directly from the existing HARNESS_CONTEXT_BASE revision, with per-file SHA-256 checks; it does not derive expected instructions from the current implementation."
  ],
  "rejected": [
    "NoOp leaves required suites unable to execute in the declared replica.",
    "Make the shared installed runtime writable, reveal candidate Git history, or broaden console fixtures to every current document.",
    "Remove original assertions or treat the failed full run as a successful timing sample."
  ],
  "reopenWhen": "A declared suite still reads missing inputs, fixture cleanup changes a shared installation, or the original behavior checks fail under the effective kernel denial."
}
```

The D003/D004 mission and eight-trap comparisons apply: expose each actual
failure, preserve the original evidence and assertions, and judge the repair
by complete passing execution. This contains commons costs and shifting the
burden; no recurring operator repair is added. NoOp fails the order, while
Naive Interventionism argues for bounded fixture changes instead of weakening
the read boundary.


## WO-131-D014

```json
{
  "id": "WO-131-D014",
  "date": "2026-09-14",
  "dispatch": "The operator expands scope to require unambiguous elapsed-time payoff before WO-131 completes; the announced adjacent-0006 scheduling repair follows the first failed host measurement.",
  "decision": "Restore the existing isolated scheduling class for harness-fixtures and process-debt. Keep the task inventory, all test assertions, the global cap for other tasks and the measured deadline mechanism. Remeasure fresh and composed host invocations; accept no speed claim from flags or cache counts alone.",
  "evidence": [
    "WO-128 VER-001 F2 measured identical source and all 78 tasks: 462.3 seconds with these two suites isolated versus 666.5 seconds shared. Neither correctness repair depends on shared scheduling.",
    "The first WO-131 host attempt took 887.134 seconds including npm, with 79 fresh tasks and five failed aggregate suites. It is retained as failure/investment cost, not a passing performance sample.",
    "That attempt also included bounded diagnostic reproductions while it ran. The next performance run will run without other test processes launched by this executor.",
    "The original WO-131 scheduling non-goal is reopened by the later explicit completion criterion; WO-128's original verdict and accepted measurements remain unchanged."
  ],
  "rejected": [
    "NoOp preserves a scheduling choice already measured slower and leaves the current completion band unmet.",
    "Delete checks, increase deadlines, average failed and passing runs, or call a synthetic fixture a host speed result.",
    "Add a new general scheduler when the measured alternative already exists."
  ],
  "reopenWhen": "The full current host run fails, misses the required elapsed band, or a comparable current-source observation reverses the scheduling benefit."
}
```

This contributes directly to the operator’s critical path by reducing repeated
gate waiting. Across the eight traps: retain correctness boundaries against
policy resistance and rule beating; keep full elapsed time visible against
drift and seeking the wrong goal; count failed attempts against commons costs;
avoid another emergency order against escalation and shifting the burden; and
choose measured outcomes over allegiance to the prior configuration against
success to the successful. Naive Interventionism favors two existing flags over
a new scheduling system. NoOp leaves the observed cost in every fresh run.

The same failed run found stale planning cost evidence after the explicitly
expanded acceptance criteria. Regenerate the existing cost projection before
the next gate; retain its recorded prior observations and judge the current
planning receipt through the ordinary current-subject check.


## WO-131-D015

```json
{
  "id": "WO-131-D015",
  "date": "2026-09-14",
  "dispatch": "Authorized execution scope expansions; canonical current-plan check refused a changed reviewed planning subject.",
  "kind": "correction",
  "decision": "Preserve the independently reviewed planning subject and carry all authorized execution amendments in the canonical appended Execution record.",
  "misread": "Editing the reviewed acceptance block and regenerating its planning cost table would remain an ordinary execution continuation.",
  "meant": "The continuation contract preserves the reviewed plan, accepts its release assignment and accepts an appended Execution record. Operator execution amendments stay explicit and mandatory without impersonating a new independent planning judgment.",
  "changed": "Move all four additional criteria, their precedence and the effective patch classification into the existing execution-record format. Preserve the newly generated cost observation separately and retain the original receipt-bound planning table. The independent verifier and reviewer still owe every added criterion. Record the supplied older optimization analysis as inspiration, not measured evidence or automatic scope.",
  "evidence": [
    "scripts/lib/plan-continuation.mjs: executionAppendix and releaseAssignment",
    "docs/work-orders/WO-131-remaining-suites-under-replica.md: mandatory operator execution amendments 12–15",
    "docs/evidence/WO-131/expanded-planning-cost-observation.json"
  ],
  "rejected": [
    "Drop the operator requirements to recover a green plan check.",
    "Change the receipt validator or claim an executor-authored replacement as independent review.",
    "Create a branch commit before final review to manufacture another planning cycle."
  ],
  "reopenWhen": "The canonical continuation check rejects the preserved plan, or an amendment truly changes the future planning horizon instead of this active execution scope."
}
```

D003/D004’s mission and eight-trap comparisons apply. This preserves judgment
and scope while removing an unnecessary restart. NoOp leaves an invalid
receipt comparison; Naive Interventionism favors the already-defined
continuation path over changing its validator. The prior cost observation is
preserved as evidence instead of silently discarded.


The completed isolated diagnostic ran all 23 harness cases: 21 passed and two
exposed the current guide dependencies and a deliberate runtime-damage setup.
The replica declaration now includes product 07 and 08, the exact documents
the context comparison reads. Follow-up executions pass both corrected cases.
The missing-runtime assertion now explicitly requires prompts and diagnostic
reads to remain available while an ordinary Edit still refuses; this is the
operator-directed behavior change, not a removed check. The first resume
diagnostic mistakenly launched its Node child without the shell-owned temp
root; the actual `bash scripts/test-resume.sh` entry passed (37.007 s), and all
17 console fixtures passed in a protected replica (2.047 s). Full fresh
execution remains the acceptance evidence for their combined current bytes.

Output review also found worktree publication’s post-merge printed handoff
still named the subject’s removable helper. It now names main’s helper, matching
the lifecycle handoff and generated admission. Its existing shell assertion
requires that surviving path and rejects the old one. This is criterion 8’s
printed-command consistency, with no remote publication performed.

## WO-131-D016

```json
{
  "id": "WO-131-D016",
  "date": "2026-09-14",
  "dispatch": "The operator asked why execution became idle after a conversation-only question.",
  "kind": "correction",
  "decision": "Answer conversational steering briefly and continue the authorized work unless the operator explicitly pauses or stops it.",
  "misread": "The conversation-only prefix ended ongoing execution after the explanatory answer.",
  "meant": "The existing executor instruction explicitly says conversation-only answers without pausing work. The original resume-next objective and its scope amendments remain active.",
  "changed": "Resume the existing measurement and remaining output review. Preserve the in-flight fresh gate; do not restart it or dispatch another lifecycle action.",
  "evidence": [
    ".agents/skills/dotln-executor/SKILL.md: conversation-only answers without pausing work",
    "Operator follow-up during WO-131 execution on 2026-09-14"
  ],
  "rejected": [
    "Require another resume command after an ordinary question.",
    "Change an already-correct instruction to explain an execution mistake."
  ],
  "reopenWhen": "The operator explicitly pauses, stops, or replaces the active task."
}
```

This applies D003/D004’s mission and system-trap comparison: avoid shifting
workflow recovery onto the operator and judge progress by the authorized
outcome. NoOp leaves another unnecessary interruption; Naive Interventionism
favors following the existing instruction over adding another control.

## WO-131-D017

```json
{
  "id": "WO-131-D017",
  "date": "2026-09-14",
  "dispatch": "The operator required increased throughput, lower operating expense and lower inventory, then corrected the execution focus: the primary payoff is reuse of passing runs and the work order must finish.",
  "decision": "Keep the complete 79-task gate and its assertions. Reduce the cold planning cost by batching immutable committed-object reads and retaining bounded content-addressed tree and blob results within the process. Continue resolving the requested revision for every subject observation and reading workspace subjects from current files. After the harness fixture finishes, schedule the reduced planning fixture in the one lane left by the three-lane process-debt fixture. Use the resulting full fresh successes as certificates for later exact-tree compositions; do not continue cold-run experimentation after this bounded change.",
  "evidence": [
    "A Git trace observed 2,423 completed Git subprocesses before the old planning fixture was interrupted after 16 repositories: 1,236 cat-file, 415 ls-tree and 432 rev-parse processes.",
    "The accepted reader completed all 27 planning cases in 46.25 seconds directly. Its isolated canonical gate completed the fixture task in 77.81 seconds versus the 230.92-second retained baseline, a 66.3 percent reduction.",
    "The first complete current-source fresh gate passed all 37 suites and 79 tasks in 820.885 seconds. Aggregate task work was 1,349.504 seconds versus 1,836.983 seconds in the comparable pre-reader profile, a 26.5 percent reduction, but elapsed time remained 15.885 seconds above the operator's 805-second ceiling.",
    "The immediate ordinary full gate passed all 37 suites in 38.357 seconds by executing 10 tasks and reusing 69. Relative to the 820.885-second fresh run, this saved 782.528 seconds and reduced elapsed time by 95.3 percent.",
    "The focused runner and deadline check passes 30 tests and proves the inventory remains 79 tasks, planning reserves one shared lane after harness-fixtures, and runner-fixtures remains isolated."
  ],
  "rejected": [
    "NoOp leaves thousands of repeated immutable Git object reads and the measured fresh ceiling miss.",
    "Delete, combine or weaken tests to reduce elapsed time; the measured change preserves every case and task.",
    "Fixture cloning, copy-on-write copies, immediate deletion, a reset pool, alternate object storage and fast-import construction: measured probes did not reduce the end-to-end planning constraint.",
    "Continue optimizing the cold gate before proving and filing ordinary reuse; that delays the larger throughput return already demonstrated."
  ],
  "reopenWhen": "A revision or workspace change is missed, cache bounds cause incorrect content, planning and process-debt overlap violates a deadline, task inventory changes, or an ordinary later-phase gate cannot reuse the matching successes."
}
```

This decision attacks the observed constraint while preserving the proof
inventory. It reduces repeated process launches, lets already-paid work flow to
the next phase and measures both elapsed time and aggregate task work. The
bounded caches and fresh revision resolution contain drift and rule beating;
the unchanged cases and task count contain policy resistance. Recording failed
attempts addresses commons cost. NoOp retains both the cold waste and phase
wait; Naive Interventionism favors the small reader and scheduling changes over
another test framework or fixture rewrite.

## WO-131-D018

```json
{
  "id": "WO-131-D018",
  "date": "2026-09-14",
  "dispatch": "The operator made observable speedup and return on the emergency work a completion requirement and emphasized reuse as the primary purpose.",
  "decision": "Accept the bounded planning/process-debt overlap and the content-addressed composition result. Stop performance changes in WO-131. Use the accepted 801.849-second all-fresh row as the behavior certificate source and retain the 57.403-second document-transition and 57.413-second changed-session rows as the representative later-phase evidence. Report the cold result, repeated-gate result, lifecycle total, physical execution inventory, gross measurement investment and limits separately.",
  "evidence": [
    "The accepted fresh gate passed 37 of 37 suites and executed all 79 tasks in 801.849 seconds, within the 805-second ceiling. Planning overlapped process-debt and disappeared from the reported critical path.",
    "The document-only evidence and generated-index transition passed 37 of 37 suites in 57.403 seconds with 17 fresh and 62 reused tasks. Every expensive fixture reused the accepted fresh execution.",
    "The same tree under distinct CLAUDE_PID, GIT_SSH_COMMAND and TMPDIR values passed in 57.413 seconds with the same 17 fresh and 62 reused tasks.",
    "Against WO-130's 409.653-second composed median, the mean later-phase gate saves 352.245 seconds, an 86.0 percent reduction and 7.14x speedup.",
    "One accepted fresh gate plus the two measured compositions totals 916.665 seconds versus the 1,616.424-second median-based WO-130 comparison: 699.759 seconds saved per successful lifecycle, a 43.3 percent reduction and 1.76x throughput.",
    "The physical execution inventory falls from 142 tasks in the median-based WO-130 lifecycle comparison to 113 despite one additional scheduled task. Gross recorded WO-131 gate and measurement investment through these rows is 6,625.898 seconds; measured lifecycle savings recover it after 9.47 comparable successful work orders."
  ],
  "rejected": [
    "Claim the cold gate itself is materially faster than WO-130: it is 0.6 percent above the WO-130 fresh median and carries one additional task.",
    "Use only the 38.357-second identical-tree retry as cross-phase proof; the document and changed-session gates were executed independently.",
    "Continue optimizing after the full acceptance band and reuse payoff are both demonstrated; further experimentation would increase investment and delay handoff.",
    "Hide failed, aborted or preflight-refused runs from the investment total."
  ],
  "reopenWhen": "A comparable later-phase gate exceeds the recorded composed band because a declared success failed to carry, a fresh gate exceeds its accepted ceiling under comparable host conditions, or independent verification finds an unsafe omitted input."
}
```

The outcome increases flow by carrying paid proofs through evidence-only
transitions, reduces repeated physical execution and still exposes the cold
cost. The exact-tree aggregate, current checks and immutable source execution
provenance contain rule beating and drift. The explicit gross investment and
break-even contain commons costs and success to the successful. NoOp misses the
fresh ceiling and preserves six minutes of repeated phase waiting; Naive
Interventionism favors stopping once the bounded, reversible changes meet the
measured acceptance conditions.

## WO-131-D019

```json
{
  "id": "WO-131-D019",
  "date": "2026-09-14",
  "dispatch": "Operator direction during resume: fix after VER-001 F1: remove D009's kernel-denial condition, because reuse must survive in every session and the repository exists to progress DotLn, not to add process.",
  "decision": "Restore criterion 5's rule that the kernel read denial is an addition and never a condition of reuse. A declared suite narrows, executes in its replica, records its success and reuses it whether or not the host can start the sandbox. Availability and application are recorded on every gate and suite row and sealed into the source provenance, but neither forks the key nor gates a record's validity. This supersedes amendment 13's fallback sentence and D009's caching condition; the probe, the wrapper and the provenance seal remain.",
  "evidence": [
    "docs/verifications/WO-131/VER-001.md F1: an independent later-phase gate in a sandboxed role session ran 807.236 s with 79 fresh and 0 reused tasks at a document-only delta; 63 fresh rows named the unavailable denial, and the probe inside every sandboxed Claude or Codex session on this host returns host refused sandbox startup.",
    "docs/verifications/WO-131/VER-001.md F2: the unavailable branch produced no key at all, so a byte-identical rerun re-executed (2 fresh / 0 reused twice).",
    "The operator's two terminal gates immediately before this dispatch, 754.3 s fresh and then 70.3 s with 17 fresh and 62 reused, show the mechanism composes wherever the denial is available; the same tree in a sandboxed session could reuse nothing.",
    "scripts/test-suite-sandbox.mjs proves that an unavailable denial still narrows, records applied false and reuses across a document-only change, that a session with the denial reuses that same record, and that a protected record is reused by a session without the denial; the three-role and release-close fixtures now run their later sessions without the denial."
  ],
  "rejected": [
    "Restate criteria 7, 10 and 11 to carry a kernel-denial precondition (VER-001 route a): it documents the loss instead of removing it, and the sessions that pay the gates are exactly the ones excluded.",
    "Allow lookup of protected records only while still refusing to record unprotected narrowed successes: a sandboxed executor followed by a sandboxed verifier would still pay two fresh gates, which is the operator's ordinary lifecycle.",
    "Fall back to the complete candidate key without the denial, amendment 13's wording (VER-001 F2): recovers only the byte-identical rerun, not the document-only transition the order is measured on.",
    "Keep D009 and accept the narrowed environment scope under amendment 15 (VER-001 route c): the operator declined.",
    "Replace the kernel denial with static path scanning or filesystem monkeypatching: D009 already rejected these as unable to cover child processes or computed paths, and they add process without adding reuse."
  ],
  "reopenWhen": "A suite is found to read an undeclared candidate file by a literal absolute path in a session without the denial, so that a narrowed success reused a stale result; or the denial becomes available inside role sessions, at which point requiring it would cost no reuse and may be reconsidered."
}
```

Throughput is the mission measure: a proof paid once must carry to the next
role, and the sessions that pay the gates are sandboxed. NoOp keeps a 13-minute
fresh gate in every verification and review. Rule beating and seeking the wrong
goal are contained by the unchanged declared-input keys, the exact-tree
aggregate and the sealed provenance that still names whether the denial ran;
drift is contained by measuring the sandboxed session itself. Policy resistance
argued for D009 and lost to the measured outcome: the protection it bought was
unavailable exactly where reuse was needed. Commons cost and escalation favor
removing one condition over another emergency cycle; shifting the burden is
answered by a recorded residual with its reopening condition. Success to the
successful gives the terminal rows no claim over the sandboxed measurement.
Naive Interventionism keeps every probe, wrapper, fixture and record.

## WO-131-D020

```json
{
  "id": "WO-131-D020",
  "date": "2026-09-14",
  "dispatch": "The same repair dispatch; diagnosed while checking whether removing D009's condition alone would let a sandboxed session reuse the operator's terminal records.",
  "decision": "A replica's PATH, in execution and in the key, is the ordered list of existing physical directories from the session PATH, deduplicated, with candidate entries keeping their replica mapping. Entries that do not exist, are not directories, or are symlink or repeated spellings of a directory already listed resolve no executable and are dropped.",
  "evidence": [
    "With the denial forced available, every narrowed key in this session differed from the operator's records of minutes earlier in the environment class. The session PATH carried two dangling fnm multishell directories named by shell process id and a dangling harness plugin directory; the node executable itself is stable at the nvm install.",
    "WO-130 D009 and the changed-session row varied CLAUDE_PID, GIT_SSH_COMMAND and TMPDIR inside one shell; no recorded row ever varied PATH between shells, so this per-shell key component was invisible to every prior measurement.",
    "scripts/test-suite-evidence.mjs proves that a dangling entry, a symlink spelling, a repeated entry and a non-directory leave the key unchanged and the replica PATH canonical, and that a different existing directory ahead of the same tools changes the key."
  ],
  "rejected": [
    "Keep PATH verbatim: no session on this host can reuse another's narrowed successes, whatever the denial policy.",
    "Drop PATH from the key and rely on the toolchain digest of named tools: an unnamed tool could resolve differently between sessions without changing the key.",
    "Rebuild PATH from the directories of the named tools only: sound, but a suite needing an unnamed tool would fail loudly in its replica for a benefit the canonical list already delivers on this host.",
    "Bump the replica mechanism version: the replica bytes are unchanged and a session whose PATH is already canonical keeps its keys."
  ],
  "reopenWhen": "Two sessions with equal canonical PATH lists resolve an executable a suite invokes differently, or a harness injects an existing tool directory that differs between roles so that keys fork again; the fresh explanation's environment class and the recorded inputEnvironmentKeys locate it."
}
```

This removes the last per-shell value from the narrowed key without weakening
it: two sessions share a key only when every executable resolves through the
same physical directories in the same order. NoOp leaves cross-session reuse at
zero on this host even after D019. Rule beating and drift are contained by
keeping PATH in the key in its resolution-equivalent form; seeking the wrong
goal is contained by the fixture that proves a different existing directory
still forks the key. Commons cost favors one canonicalization over per-harness
exclusions; Naive Interventionism keeps the mechanism version and every
existing key that was already canonical.

## WO-131-D021

```json
{
  "id": "WO-131-D021",
  "date": "2026-09-14",
  "dispatch": "Operator scope expansion for an engineering review of WO-125 through WO-131, then the operator's direction that the subagent refusal found during it is a defect to fix now rather than defer.",
  "decision": "Admit a same-host subagent spawn (Agent, Task) as a read-only effect: the subagent acts under the session's own authority and every effect it performs passes the same PreToolUse guards, so the spawn reserves no writer and is admitted during a live gate. Refuse a remote subagent by name. Raise intentional classification refusals as HarnessCommandRefused so their own message reaches the operator, and append the failure class and a bounded sanitized message to the host-facts catch-all so an internal failure is never mistaken for policy.",
  "evidence": [
    "A read-only Explore delegation in this session was denied as 'host facts or pinned runtime unavailable'; replaying the same Agent input through the installed permission hook reproduced it. The source throws a plain Error for every spawn-class tool and the catch-all relabels every plain Error.",
    "The same label appeared for concurrent hooks (WO-126 VER-003 F19) and for the stop tool (WO-131 VER-001 O1): three failures, one wrong diagnosis.",
    "scripts/test-process-debt.mjs proves through the emitted hook that a same-host spawn is admitted, a worktree-isolated spawn is admitted, a remote spawn is refused naming itself, an unclassified tool names itself, and a spawn during a live gate is admitted while a write during that gate is still refused.",
    "The emit that installs the changed host into the pinned snapshot wrote the manifest and snapshot and was refused at .claude/hooks by this session's sandbox; the operator installs the hooks from a terminal."
  ],
  "rejected": [
    "Keep refusing every spawn: it costs parallel read-only delegation for no isolation gain, since the subagent's writes are guarded one by one.",
    "Admit remote subagents: they run outside this host's guards and the clean-room floor.",
    "Give spawn its own compiled effect name: it would change the feedback policy and its hash for a distinction the existing read effect already expresses.",
    "Defer to planning: the operator declined; the fix is bounded, fixture-proven and lands with this repair."
  ],
  "reopenWhen": "A subagent's tool call reaches the repository without passing the PreToolUse guards, a spawn is observed writing into a worktree this session does not own, or the harness stops running hooks for subagent tool calls."
}
```

Throughput: a session can again delegate reads in parallel. Rule beating is
contained because nothing the subagent does escapes the guard; policy
resistance argued for the blanket refusal and is answered by the fixture that
still refuses a write during a gate. Drift is contained by naming failures:
the catch-all no longer hides its cause. NoOp keeps three incidents' worth of
misdiagnosis; Naive Interventionism keeps the effect vocabulary, the writer
reservation and the pinned-runtime contract unchanged.

## WO-131-D022

```json
{
  "id": "WO-131-D022",
  "date": "2026-09-14",
  "dispatch": "During resume: final review, the operator directed this session to fix the recurring final-gate/report-edit/final-gate loop solely here, without returning it to another repair session.",
  "decision": "End tracked report authoring before the final gate, with a dated measurement cutoff. Keep the final gate's results in existing ignored gate receipts and completion-time usage in existing ignored usage receipts; report those observations in the response. After a pass, read current outputs, record the lifecycle result, refresh its index once and hand off. Do not edit tracked reports or rerun release preparation/meta merely to copy the cost of their own validation. Preserve exact-tree evidence and current-byte output reads, including invalidation after a substantive report edit.",
  "evidence": [
    "docs/verifications/WO-131/VER-002.md: three completion gates were run after report edits added gate timings and token totals; more than a third of that verification's gate time went to recomposition.",
    "scripts/lib/lifecycle-evidence.mjs already checks the exact current tree, then collects final usage into ignored local evidence before the completion event; no tracked report update is required by that mechanism.",
    "packages/skeleton/src/loadouts/contributor.ts and process-cost.ts now specify the finite handoff sequence; scripts/harness.mjs prints it after a passing final gate.",
    "scripts/test-process-debt.mjs exercises all four completion actions with one executed full gate: current output reads and later usage collection preserve the tree and gate records; an edited report still refuses completion. The existing evidence reuse fixture also checks source invalidation."
  ],
  "rejected": [
    "NoOp or another reminder to run a final gate: leaves the recursive reporting obligation intact and keeps requiring operator intervention.",
    "Exclude Markdown or evidence paths from gateTreeHash: would certify reports and configuration that the gate did not check.",
    "Add a second post-gate validator or repeatedly regenerate the meter: creates another result to report and preserves the same recursion.",
    "Return this bounded correction to repair and another verification session: the operator explicitly directed it to be completed in this final review."
  ],
  "reopenWhen": "A completion path writes tracked measurement output before checking its evidence, a role requires a report to include the exact cost of validating itself, or following this sequence still needs a second full gate without a substantive correction."
}
```

The mission is operator flow toward the independently verified source-to-deliverable loop; recurring validation of the act of reporting blocks that route. Policy resistance and rule beating are addressed by keeping the exact-tree gate while removing only recursive reporting. Commons cost, escalation and shifting the burden favor the existing ignored receipts over more machinery or another operator rescue. Drift to low performance and seeking the wrong goal are answered by an executable one-gate completion path. Success to the successful gives the existing reporting ritual no claim to preservation. Naive Interventionism favors this reversible ordering correction: all tests, evidence, output reads and publication controls remain. NoOp retains the measured waste. This corrects the interpretation that a final report must contain the cost of checking its own final bytes; it needs a dated snapshot and the completion evidence instead.
