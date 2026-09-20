# WO-144 decisions

## WO-144-D010 — Pass final review after an in-review test repair; board the unrun suite and two width edges

```json
{
  "id": "WO-144-D010",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Record FINAL-002 as pass. FINAL-001 F1 and F2 are repaired and were reproduced live from a moved working directory through the shell and the write tool. The final-review gate's first run failed one suite: process-debt, 'WO-131 prompt submission stays open while dispatches retain the ordinary command's gate and writer checks', which compares a resumed session's briefing with the recording session's. D004 prints each session's own scratch path in that context, after the recording-only beacon warning the test stripped only when it was last. The per-session path is the decided behavior (D001, D004), so the expectation was stale, not the product. Repair it inside this review as a test-only edit: briefingOf now asserts that each session's context names the scratch path keyed by its own session id, strips the warning wherever it sits, and compares the briefings with that key set aside. No product or generated file changed. Rerun the full gate and pass on its green row. Board the process gap and two extractor width edges met while probing.",
  "evidence": [
    "docs/final-reviews/WO-144/FINAL-002.md R1, live probes and Observations",
    "npm test -- --review, first run, 2026-09-20T00:52:43Z: 29 passed, 1 failed, 484.20 s, 74 fresh tasks; process-debt 76 tests, 75 pass, 1 fail at scripts/test-process-debt.mjs:5749",
    "The failing test alone before the edit fails identically; the two contexts differ only in the recording-only warning line and in the session key of the scratch line, 42d86fbd… for repair-session and f6767855… for resumed-repair, each the SHA-256 of its session id",
    "packages/skeleton/src/harness-host.ts: the role-dispatch branch appends 'DotLn session scratch: <harnessSessionScratch(session_id)>' to additionalContext",
    "scripts/test-runner.mjs: process-debt declares packages/skeleton/src/harness-host.ts among its sources and is selected only under --review; every recorded npm test run before this review (implementation, both repairs, VER-001, VER-002) reports 21 suites, and VER-003 ran named suites",
    "The failing test alone after the edit: 1 passed, 0 failed; prettier --check and git diff --check clean",
    "npm test -- --review, second run, recorded 2026-09-20T01:03:53.732Z: 30 passed, 0 failed, 485.80 s, exit 0, code identity 6dda30a3bc99afbcbd4271753aca9e53e4faf005a7a32799348bef163018de91",
    "Built shellRedirectTargets, 2026-09-19: 'printf x > /outside/a && npm run y 2>$PWD/z' -> null; 'npm run y 2>/outside/a; npm run z > $HOME/b' -> null; 'node -e \"x => 1\" > /outside/a' -> null; 'npm run y 2>/outside/a' -> ['/outside/a']",
    "docs/evidence/WO-143/decisions.md WO-143-D006: a reviewer's test-only edit inside final review, with the same rejected alternative"
  ],
  "rejected": [
    { "option": "Fail FINAL-002 and route R1 to repair", "reason": "The cause is unambiguous and deterministic, the edit cannot change product behavior, and a third repair, a fourth verification and a third final review would re-judge product code that does not change. The reviewer role admits a low-risk edit in a shared check, and the full gate rerun is the check on it. The cost of this route is one more gate run and an edit with no independent verifier, which the report and the PR state." },
    { "option": "Strip the scratch line from both briefings, or drop the comparison", "reason": "Either makes the gate green by asserting less. The comparison is the test's purpose, and the per-session path is what WO-144 added to this context, so it is asserted rather than hidden." },
    { "option": "Change the product: print the scratch line before the warning, or omit it for a resumed session", "reason": "A product change made for a test's convenience. A resumed session needs its own path as much as the recording one, and the order of two context lines carries no contract." },
    { "option": "Pass on the repair's plain npm test row", "reason": "The order assigns npm test to final review, the row is keyed to code identity, and --review is what adds the machinery suites whose declared sources the order changed. A known red suite cannot be published under a green row that never selected it." },
    { "option": "NoOp on the width edges", "reason": "They narrow what 'a literal redirect is judged on any program' means in practice and no document states them; a report sentence alone is what WO-142 row B17 forbids." }
  ],
  "followup": "Planner: (1) Executor and verifier procedure runs npm test without --review, which omits the machinery suites whose declared sources an order changed; here process-debt declares harness-host.ts and its deterministic failure passed one implementation, two repairs and three verifications before the final-review gate met it. Decide whether resume: next, fix and verify name npm test -- --review, or the runner's selection for changed sources, so that final review is never the first run of a suite. (2) With the opaque-effects order, continuing D009: the redirect accessor answers for the whole command, so one expansion-spelled redirect un-names the literal redirects beside it ('printf x > /outside/a && npm run y 2>$PWD/z' names nothing), and a quoted program argument containing < or > ('node -e \"x => 1\" > /outside/a') does the same. Both admit under host permissions inside the known-destination width; decide whether the accessor names what it can per invocation, and state the rule in the width documents either way.",
  "reopenWhen": "The repaired WO-131 test passes while a session is told another session's scratch path, a final-review gate again meets a deterministic failure in a suite no earlier run selected, or a literal outside redirect beside an opaque one reaches the operator's folders."
}
```

Mission and critical path: the operator merges one order at a time, and a red
gate stops the lane. Rule beating was the live trap: a reviewer who edits a
failing test to reach green has to show the edit keeps the test's purpose, so
the comparison still runs and a new assertion pins the per-session path the
order added. Drift to low performance and seeking the wrong goal: a green plain
`npm test` had stood in for the gate the order names through three
verifications; the follow-up asks the planner to close that rather than this
review to normalize it. Shifting the burden: passing on the earlier row would
have left the next order that touches `harness-host.ts` to meet the red suite.
Fixes that fail and policy resistance: no product path changed, and the gate
reran the four older refusals' fixtures. Escalation: no new hook, gate, key or
receipt. Commons: one reviewer, zero subagents, one added gate run against a
full repair cycle. Success to the successful: the verdict rests on this
session's probes and gate, not on the earlier passes. Naive Interventionism:
the smallest edit that restores the test's intent, checked alone before the
full run; the width edges are recorded, not patched, because changing what the
accessor names is a product decision with the live-gate reading beside it.
NoOp, failing on R1, is rejected above with its reason.

## WO-144-D009 — Judge a literal redirect on any program; state what stays unjudged

```json
{
  "id": "WO-144-D009",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair FINAL-001 F2 in code and in words. Add shellRedirectTargets beside shellWriteTargets: it names literal output redirects on any program, because the shell opens them, and names a relative one only while no earlier program outside the bounded vocabulary could have moved the shell. Only the outside-write guard consults it, when shellWriteTargets returns null; a named redirect is judged and the program's own effects are still journaled unobserved. shellWriteTargets keeps its contract that null means opaque, so the live-gate and planning-branch refusals read commands exactly as before. Product 03, product 07 Discipline, the security document, the README block and the generated boundary text now say which redirects are judged and that the incident's original $PWD spelling is still admitted under host permissions. VER-002 O5's doubled conjunction is removed from the three lists.",
  "evidence": [
    "docs/final-reviews/WO-144/FINAL-001.md F2",
    "Built accessors 2026-09-19: 'npm run meta 2>../.x' -> shellWriteTargets null, shellRedirectTargets ['../.x']; 'npm run meta 2>$PWD/../.x' -> null and null; 'cd docs && npm run meta 2>../.x' -> null and null; 'cd docs && npm run meta 2>/absolute/.x' -> null and ['/absolute/.x']",
    "scripts/test-harness.mjs 'WO-144 FINAL-001 F2': generated permission, writer and write-observer hooks deny the literal incident command and absolute redirects on npm, node and git; admit the $PWD spelling, a relative redirect after cd, an in-project redirect, a null discard and a granted redirect; journal granted then unobserved rows; the planning-branch refusal still admits 'npm run meta > fixture.ts' and still refuses 'printf x > fixture.ts'",
    "Live Claude Code session 2026-09-20T00:03:19Z, role executor: 'node -e 0 2>/private/tmp/wo144-fix-redirect-probe.txt' refused before execution (session journal row 695); the file was not created",
    "node scripts/harness-context.mjs after regeneration: reviewer 20,434 of 20,480 bytes; every ceiling within",
    "packages/skeleton/src/harness-host.ts activeGateWriteRefusal reads shellWritePaths, which is unchanged"
  ],
  "rejected": [
    { "option": "Words only: keep the extractor and state that the incident's command is not judged", "reason": "The shell opens the redirect whatever the program is, so the destination is known in the order's own sense. Leaving the incident's literal command admitted while the operator keeps the sandbox relaxed spends the order's purpose to save a bounded accessor." },
    { "option": "Return redirect-only targets from shellWriteTargets", "reason": "The live-gate refusal treats null as 'cannot prove the gate inputs untouched'. A non-null answer for 'npm run x > /tmp/y' would admit an opaque program during a live gate. Criterion 4 binds the four refusals unchanged." },
    { "option": "Resolve $PWD and other expansions", "reason": "A command can change PWD before the redirect opens, and the stand-down declined a shell classifier. The spelling stays opaque and the documents now say so." },
    { "option": "Judge every relative redirect regardless of earlier programs", "reason": "'cd packages/x && npm test > ../../out.log' would be resolved against the wrong directory and refused although it is an in-project write. A refused legitimate write is the order's other reopening observation." },
    { "option": "NoOp", "reason": "Criterion 5 stays unmet and the PR and release text would inherit the overstatement." }
  ],
  "followup": "Planner: the order's own cost line ('removes the recorded incident class') and criterion 2's label ('the recorded incident's shape') remain broader than what ships, because the incident's $PWD spelling is opaque. This repair did not edit the judged order; the documents carry the true width. Decide with the opaque-effects order whether expansion-spelled redirects get an adapter, and raise or restructure the reviewer cold-start ceiling before the next boundary-text addition: 46 bytes remain.",
  "reopenWhen": "A literal redirect on any program reaches an ungranted outside destination, a legitimate in-project or granted redirect is refused, or the live-gate or planning-branch refusal changes its reading of a command."
}
```

Mission and critical path: the operator keeps the native sandbox relaxed in
reliance on this refusal; the incident that prompted the order was a redirect
on `npm`. Seeking the wrong goal and drift to low performance: fixtures that
carried destinations only on `printf`, `touch` and `rm` measured the
vocabulary, not the incident, so the new fixture uses `npm`, `node` and `git`.
Fixes that fail and policy resistance: a separate accessor leaves the live-gate
and planning readings byte-for-byte as they were, and a fixture pins both. Rule
beating: the residual (`$PWD`, attached quoted operands, groups, relative
redirects after an unrecognized program) is written down rather than implied
away. Escalation: no new hook, key, classifier or receipt; one accessor over
the existing tokenizer. Shifting the burden: the guard refuses the known
mistake instead of asking the operator to notice it. Commons: no subagents; the
shared role text grew 154 bytes per cold start (20,280 to 20,434 for the
reviewer) and the reviewer ceiling now has 46 bytes left, which is boarded.
Success to the successful: the accessor is kept because it names a destination
the shell itself opens, not because it was cheap. Naive Interventionism: the
consumers are the five generated pre-tool hooks; the smallest probe was the
built accessor over the incident's spellings, then generated-hook fixtures,
then one live call. NoOp is rejected above. Outcome at handoff: the literal
incident command is refused in fixtures and in a live session; the `$PWD`
spelling is admitted and said to be.

## WO-144-D008 — Judge outside writes from any working directory; keep hook rows in the hook's own project

```json
{
  "id": "WO-144-D008",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair FINAL-001 F1 by enforcing, not by documenting the precondition. runHarnessHook takes its root from the session's working directory only while that directory is this hook's own verified worktree root. Otherwise it finds the project from the installed runtime's location (installedHarnessRoot, verified as a Git top level that contains the pinned snapshot), makes only the outside-write judgment, and resolves relative destinations against the session's directory, where the shell opens them. A refusal is returned; any other outcome rethrows the original cause, so the four root-bound refusals keep their stand-down and its advisory exactly as before. Every judgment made away from the root carries workingDirectory: moved, and because the root is now known the existing finally block journals each hook's stand-down advisory row. Completes adjacent-0003 in the same lines: a hook whose input directory was another repository's root created its journal and advisory marker inside that repository. Completes adjacent-0004, the same defect in the generated fallback used when the pinned runtime cannot be loaded: its root now comes from the hook file's own location, never from the session's directory.",
  "evidence": [
    "docs/final-reviews/WO-144/FINAL-001.md F1; docs/evidence/WO-144/decisions.md D007",
    "Executor probe 2026-09-19 before the change: the generated permission hook, given cwd at a scratch repository's root, created docs/control/local/harness/<key>.jsonl and an .advisory marker inside that repository",
    "packages/skeleton/src/harness-host.ts runHarnessHook, evaluateHarnessHook, outsideWriteResponse, knownWriteDestinations, installedHarnessRoot",
    "scripts/test-harness.mjs 'WO-144 FINAL-001 F1': from a project subdirectory, a directory outside any repository and another repository's root, all three pre-tool hooks deny an absolute redirect, a write-tool path, a removal and the incident's literal command; admit a granted redirect, an in-project write and an opaque command; relative destinations resolve against the session directory; the other repository gains no file; rows carry workingDirectory moved and both stand-down causes are journaled",
    "Live Claude Code session 2026-09-20T00:03:13Z, role executor, after one persisted 'cd docs': 'printf probe > /private/tmp/wo144-fix-cwd-probe.txt' refused before execution (session journal row 689, workingDirectory moved); the file was not created; six stand-down advisory rows recorded while moved",
    "node --test scripts/test-harness.mjs: 108 passed, 0 failed, including the four earlier refusals' suites unchanged",
    "Executor probe 2026-09-19 of adjacent-0004 before its change: a generated permission hook with no loadable runtime, given cwd elsewhere, wrote its .jsonl row and .advisory marker under that directory and nothing in its own project; packages/compiler/src/harness.ts fallback read root from input.cwd",
    "The extended F1 fixture failed on the earlier build with 'docs' created in the other repository, and passes after the change; the suite is again 108 passed, 0 failed"
  ],
  "rejected": [
    { "option": "Keep the root precondition and state it wherever the width is stated", "reason": "A persisted cd is reached by accident, which is the case the order exists for, and the operator relaxed the sandbox in reliance on the refusal. The hook input already carries the facts needed to judge." },
    { "option": "Judge only when the working directory is inside the project", "reason": "After 'cd /tmp' a relative or absolute outside destination is exactly as known. The installed location yields the root without consulting the working directory, so both cases cost the same." },
    { "option": "Also run the writer, live-gate, planning-branch and subagent refusals away from the root", "reason": "Criterion 4 binds them unchanged and D007 boards that decision with the planner. They share state and Git facts whose behavior from another directory has not been examined." },
    { "option": "Relax harnessRoot itself to accept a descendant directory", "reason": "scripts/harness.mjs, the commit-message hook and the target hook share it; widening it changes writer reservation and target binding, which this repair must not touch." },
    { "option": "NoOp", "reason": "The order's objective stays false in a real session and its reopening observation stands." }
  ],
  "followup": "Planner (continues D007): decide whether the four root-bound refusals judge away from the worktree root. Their stand-down is now journaled by every hook, so an inventory can count how often sessions move. Not probed here: whether a subagent's calls inherit the role, and a write-tool call from a moved directory in a live session (covered by fixture only).",
  "reopenWhen": "A known ungranted outside destination is admitted from any working directory, a generated hook writes a journal row or marker outside its own project, or one of the four root-bound refusals changes behavior at the worktree root."
}
```

Mission and critical path: a refusal that one ordinary `cd` removes without a
trace does not let the operator keep the sandbox relaxed. Seeking the wrong
goal and drift to low performance: every earlier fixture sent `cwd` equal to
the root; the new one sends a subdirectory, an outside directory and another
repository's root, and the repair was then probed live in this executor's
Claude Code session, the same kind of session FINAL-001 found the defect in.
Policy resistance and fixes that fail: the moved path returns only an
outside-write denial and otherwise rethrows the original cause, so the four
older refusals and their advisory are untouched; the full 108-case suite
passes. Rule beating: the stand-down was reachable by accident, so it is
repaired as a defect, not policed as evasion. Escalation: no new hook or
configuration; the root comes from a location the runtime already computed for
its disagreement check. Shifting the burden: the hook now journals what it did
not judge, so the operator need not discover it. Commons: one writer, no
subagents. Success to the successful: enforcement was chosen over documentation
on the order's objective, not on implementation cost. Naive Interventionism:
consumers are all generated Claude hooks; the reversible unit is one resolver
and one optional parameter; the adjacent defect was probed before it was
queued. Outcome at handoff: the reviewer's probe form (same command shape and
directory, a different file name) is refused live with a journal row; the other
repository stays clean.

Correction, 2026-09-19. What was misread: this decision first claimed, after
the runtime path alone was repaired and tested, that hook rows and markers stay
in the hook's own project. What was checked: reading the compiler source for
the output review showed that every generated hook's fallback, used when the
pinned runtime cannot be loaded, took its root from `input.cwd`; a probe
confirmed it wrote a journal row and a marker under that directory. What
changed: adjacent-0004 derives the fallback's root from the hook file's own
location, the F1 fixture now removes the runtime and invokes from all three
moved directories, the bundle was regenerated, authority evidence advanced to
revision 004 and the product gate was rerun. The claim is now true of both
paths. The first gate row and authority revision 003 describe the earlier code
identity and are superseded, not erased.

## WO-144-D007 — Fail final review on a live admitted outside write; board the shared root-cwd precondition

```json
{
  "id": "WO-144-D007",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Record FINAL-001 as fail and route its two findings to repair under WO-144. F1: every generated hook resolves its root with harnessRoot(input.cwd), which requires the session's working directory to equal the worktree root; after one persisted cd (even into a project subdirectory) the outside-write guard returns only a runtime-unavailable advisory, admits a known ungranted outside destination and journals nothing. F2: the extractor returns null for any command whose program is outside its small vocabulary, so a literal redirect on npm, node or git is unobserved; the recorded incident's own command is admitted in both its original and its literal spelling, and no document says so. Board separately the part WO-144 neither introduced nor is scoped to fix: the same precondition stands down the writer, live-gate, planning-branch and subagent refusals without a journal row.",
  "evidence": [
    "docs/final-reviews/WO-144/FINAL-001.md F1 and F2",
    "Reviewer live probe 2026-09-19: from <root>/docs, printf redirect to /private/tmp/wo144-final-cwd-probe.txt admitted and the file created, with no journal row of any kind; the same form from <root> refused at 22:00:19.720Z (session journal row 490)",
    "Generated permissions hook fed a synthetic PreToolUse input with cwd <root>/docs: 'DotLn advisory: runtime-unavailable ... (Error: Harness requires the verified worktree root) ... host permissions decide'",
    "packages/skeleton/src/harness-host.ts harnessRoot and runHarnessHook: observed is assigned after harnessRoot, so the finally block records nothing when it throws; both predate WO-144",
    "Built shellWriteTargets: 'npm run meta 2>$PWD/../.x' and 'npm run meta 2>../.x' both return null; 'printf x 2>../.x' returns the destination",
    "docs/verifications/WO-054/VER-003.md: the recorded incident was a check command with a stray stderr redirect to $PWD/../.x holding meta's output",
    "Reviewer session journal at the report cutoff: 35 judgment rows, 34 unobserved and 1 refused",
    "scripts/test-harness.mjs WO-144 fixtures: every hook input uses cwd equal to the fixture root and only printf, true, touch and rm carry destinations"
  ],
  "rejected": [
    { "option": "Pass, state the width in the documents and board both findings", "reason": "The order's objective sentence is falsified in a real Claude session and its evidence gate names an outside write admitted without a grant as the reopening observation. VER-001 applied the symmetric clause to fail the order; publishing v0.33.0 with a title the reviewer knows to be false after any cd is outward-facing and harder to take back than a repair cycle." },
    { "option": "Reviewer repairs the hook runner inside final review", "reason": "harnessRoot is a shared precondition of every generated hook and of the writer reservation; changing it is neither adjacent nor low-risk, and the choice between enforcing off-root and stating the width is a product decision for the executor and operator." },
    { "option": "NoOp", "reason": "The operator has relaxed the native sandbox in reliance on this refusal; an unrecorded stand-down leaves that reliance unexamined." }
  ],
  "followup": "Planner: nominate a bounded order for the shared root-cwd precondition. Decide whether the writer, live-gate, planning-branch and subagent refusals should judge when the session's working directory is a descendant of, or outside, the worktree root, and resolve relative destinations against the real session cwd. At minimum every generated hook journals one row naming the stand-down cause when it cannot resolve its root, so a journal inventory can tell 'not judged' from 'no call'. Include a generated-hook fixture whose input cwd is a project subdirectory. WO-144's repair covers only the outside-write judgment, its journal row and the documents' width statement.",
  "reopenWhen": "A generated hook admits, without a journal row, a call that one of the five refusals would have refused from the worktree root."
}
```

Mission and critical path: the order exists so the operator can keep the native
sandbox relaxed without a mistaken path reaching their folders. A refusal that
silently stands down after an ordinary `cd` does not carry that weight, and
the operator cannot see from the journal that it happened. Policy resistance
and fixes that fail: the four earlier refusals share the precondition, so a
repair confined to the fifth must not weaken them; the wider question gets its
own order. Commons: one reviewer, zero subagents, no product gate rerun because
repair changes code identity. Drift to low performance and seeking the wrong
goal: passing fixtures that all send `cwd: root` measured the fixture, not the
session; 34 of 35 judged calls in this review were unobserved, which is the
real-session width the documents should state. Rule beating: the stand-down is
reachable by accident, not only by evasion, so it is a defect rather than a
bypass. Escalation and shifting the burden: no new hook or classifier is asked
for; the repair is asked to judge with the facts the hook input already
carries, or to say plainly that it does not. Success to the successful: the
verdict does not choose between enforcing off-root and stating the width.
Naive Interventionism: the reviewer changed no source and did not exploit the
stand-down to remove its own probe file. NoOp is rejected above.

## WO-144-D006 — Publish complete crash-fixture pause records

```json
{
  "id": "WO-144-D006",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair adjacent-0002 by writing the test fixture pause JSON to a sibling temporary file and renaming it into place. Keep production lock behavior, all crash boundaries and assertions unchanged.",
  "evidence": ["First repair npm test: 20 suites passed, skeleton failed; resident killLockProcess JSON.parse raised Unexpected end of JSON input", "packages/skeleton/test/resident.test.ts killLockProcess checks existsSync then reads JSON", "packages/skeleton/test/fixtures/resident-lock-process.ts writes the visible pause file directly", "Operator response: Continue with the fixture repair"],
  "rejected": [
    {"option": "NoOp or retry until green", "reason": "The observed empty-file window has a concrete test-only cause and would remain intermittent."},
    {"option": "Catch malformed JSON or add a sleep in the parent", "reason": "Atomic publication makes the ready signal truthful without weakening assertions or guessing a delay."},
    {"option": "Change resident lock recovery", "reason": "The failure is in fixture synchronization before SIGKILL, not an observed production lock defect."}
  ],
  "reopenWhen": "A crash-fixture reader observes an incomplete published record or the unchanged boundary matrix fails after atomic publication."
}
```

Mission: dependable evidence for unattended recovery, with less operator
rescue of intermittent tests. Policy resistance, drift and rule beating:
preserve all assertions and real process kills. Commons and escalation:
reuse a native rename; no retry loop or new test protocol. Success to the
successful: choose the existing complete-record publication pattern over
timing workarounds. Shifting the burden and seeking the wrong goal: remove
the race rather than optimize for a green rerun. Naive Interventionism:
the change is confined to three fixture statements; production behavior and
the test's observed filesystem trace are unchanged.

## WO-144-D005 — Include current judgment rows in the inventory

```json
{
  "id": "WO-144-D005",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Complete adjacent-0001 for VER-001 O1: summarize outsideWrite rows by closed role, root-kind and status labels alongside the legacy extractor inventory. Preserve old duplicate rows and label the metric as rows, not calls or executed effects.",
  "evidence": ["docs/verifications/WO-144/VER-001.md O1", "docs/evidence/WO-144/inventory.mjs", "Inventory execution at 2026-09-19T21:16:22.401Z: 204 worktree judgment rows; 172 unobserved, 20 refused, 12 granted"],
  "rejected": [
    {"option": "NoOp", "reason": "The reader would continue reporting no available destinations despite the new judgment records."},
    {"option": "Divide historical rows by four or deduplicate by destination", "reason": "Historical records lack stable call identity; neither operation establishes unique calls or successful effects."}
  ],
  "reopenWhen": "The journal adds a stable call identity or observed-effect field that can support a stronger inventory metric."
}
```

This follows D004's goal and trap comparisons: the small reader repair removes
an evidence blind spot without changing admission or exposing private paths.
The queue records the scope announcement, asynchronous steering opportunity,
actor-attested observation and executed check. At the inventory cutoff, the
main checkout has 61 journals and 43,128 rows; this worktree has four journals
and 1,353 rows. There are no malformed rows or retained command/tool-input
fields. The new 204-row metric is separate from historical extracted targets.

Correction, 2026-09-19: the actor's first queue check-in claimed a steering
interval above sixty seconds without measuring it. The recorded announcement
and check-in timestamps show 38,875 ms. A subsequent queue receipt corrects
that false elapsed claim without erasing it. The operator later explicitly
confirmed both the inventory repair and the fixture repair.

## WO-144-D004 — Repair null redirects, scratch discovery and observations

```json
{
  "id": "WO-144-D004",
  "date": "2026-09-19",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1/F2/N1/N2: recognize literal redirects to the null character device as discards; expose the operator-selected DotLn scratch path at dispatch and through the harness CLI; record outside-write judgments only in the permission hook; use the admitted outside-write effect for permission reporting and keep repository suppression comparisons inside the repository.",
  "evidence": ["docs/verifications/WO-144/VER-001.md", "WO-144-D001 operator-selected DotLn scratch", "packages/skeleton/src/harness-command.ts shellWriteTargets", "packages/skeleton/src/harness-host.ts outsideWriteResponse, permissionEffect and harnessFeedbackFacts"],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves reproduced legitimate-work refusals and contradictory observations in all Claude sessions."},
    {"option": "Grant all of /dev, /tmp or infer native scratch", "reason": "Wider roots are unnecessary given the operator-selected scratch convention; stream descriptors can refer to real files, unlike the null device."},
    {"option": "Remove outside checks from all but one hook", "reason": "Keep every existing refusal boundary; only observation ownership changes."}
  ],
  "reopenWhen": "A declared temporary workflow remains undiscoverable, discard handling admits a file mutation, or judgment rows disagree with the effective grant."
}
```

Correction on 2026-09-19: the first implementation treated every redirect as
a file mutation and left the scratch session key unexplained. VER-001 shows
the resulting refusals. The intended behavior is usable authorized temporary
work; this repair supplies discard semantics and concrete scratch discovery.
The prior operator choice remains controlling; native scratch and `/tmp` are
still refused when outside the declared system temporary root.

The first new regression incorrectly expected a standalone `/dev/null/child`
to produce a grant refusal. The checked resolver raises ENOTDIR for that
impossible path, which follows the existing guard-error advisory contract.
The test now retains the original multi-target refusal case and checks the
literal null discard independently; no error behavior was silently widened.
The initial TypeScript build also exposed optional-property/index typing
errors in the refactor; both were corrected before the passing checks.

Mission and critical path: preserve accidental-folder-write prevention while
removing routine operator rescue during authorized work. Policy resistance:
retain grant narrowing and the four other refusals. Commons: one writer and
no inspection agents; remove duplicate journal volume. Drift and rule beating:
test real redirect forms and split temporary roots instead of counting passing
synthetic admissions. Escalation and shifting the burden: supply the path in
the existing dispatch rather than require overrides. Success to the successful:
keep the scratch convention because of the recorded operator decision, not its
implementation cost. Seeking the wrong goal: judge safe usable work, not refusal
counts. Naive Interventionism: no broad device grant or setting change; the
smallest probe is generated-hook admission/refusal against fixture paths.

## WO-144-D001 — Declare role grants and check known physical destinations

```json
{
  "id": "WO-144-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Add outside-write declarations to harness target roles and equipped support adapters, lower their per-role union with sources, and reuse the existing known-destination extractor and physical resolver at the generated pre-tool boundary. Default all six contributor roles to the host system temporary root and a DotLn-managed session scratch directory beneath it. Grant no home or main-intake root by default.",
  "evidence": ["docs/work-orders/WO-144-outside-project-write-grant.md", "docs/planning/outstanding-cleanup-2026-09-19.md section 10", "packages/skeleton/src/harness-command.ts shellWriteTargets", "packages/skeleton/src/harness-host.ts record and planningWriteRefusal", "Retained main/worktree hook journal inventory at dispatch entry", "Operator answer during this dispatch: use a DotLn-managed temporary scratch directory", "Read-only design review of grant provenance and existing refusal ordering"],
  "rejected": [
    {"option": "NoOp or native sandbox dependence", "reason": "Retains the recorded stray-redirect incident and the operator's recurring supervision burden."},
    {"option": "Ambient roots, personal settings, or a new shell classifier", "reason": "Grants must come from equipped roles/supports; opaque effects and personal settings are outside this order."},
    {"option": "Infer historical destinations or native scratch paths", "reason": "The retained journals omit command bytes and destinations; no native scratch convention exists in the inspected host interface."},
    {"option": "Grant main intake from an assumed role history", "reason": "The inventory cannot establish which roles wrote it; leave this grant explicitly available but unequipped."}
  ],
  "reopenWhen": "A legitimate known outside write is refused, an ungranted known destination is admitted, or destination-bearing historical evidence establishes a needed default."
}
```

Mission: prevent accidental effects in the operator's folders while keeping
authorized local work usable. This bounds one risk on the unattended delivery
path; it does not establish operating-system confinement. The interface is
declared harness data, consumed by this project's generated hooks and exposed
in its manifest; no private setting supplies the guarantee.

Policy resistance/fixes that fail: preserve the writer, live-gate, planning and
subagent refusals even when grant evaluation fails. Commons: one writer, up to
two read-only agents, no descendants; unknown usage remains unknown. Drift and
rule beating: execute admission/refusal fixtures against generated hooks and
physical destinations, including symlinks and removal. Escalation: reuse the
existing boundary, extractor, journal and once-per-cause advisory. Success to
the successful: retain only the existing mechanisms that fit the declared
scope. Shifting the burden: refuse the known mistake before execution with
the existing recovery control. Seeking the wrong goal: protecting destinations
and preserving legitimate scratch work matter, not refusal counts.

Naive Interventionism: the affected consumers are all contributor roles and
their generated hooks. Roots are scoped to the active role; undeclared roles
gain nothing. Opaque commands remain delegated. Grant failures admit with an
advisory without disabling other refusals. The change is reversible through
the generated source; no account settings or new dependency are involved.

### Retained-journal inventory

At entry, the current main checkout retained 61 top-level hook journals with
43,128 rows; this worktree retained one with two rows. All 43,130 rows parsed.
The scan examined command/tool-input fields and passed every available shell
command to the existing `shellWriteTargets`: **zero command fields, zero
reconstructable destinations**. `record` intentionally omits raw inputs; this
is missing historical evidence, not proof that no outside writes occurred.
No raw journal or private path is copied into this report.

| Recorded role | Role-bearing rows | Extractable outside destinations by root kind |
| --- | ---: | --- |
| executor | 1 | unknown (inputs omitted) |
| planner | 5,215 | unknown (inputs omitted) |
| refuter | 4 | unknown (inputs omitted) |
| release-close | 304 | unknown (inputs omitted) |
| verifier / reviewer | 0 | unknown (no role-bearing retained rows) |

Rows without a role are not invented role observations. Every root kind
(system temporary, session scratch, main intake, operator absolute) has zero
extractable targets and unknown historical counts. Historical paths themselves
are unavailable, so no actual destination can honestly be named as ungranted.
The order's cited planning scratch use and the operator's answer support the
temporary/scratch defaults; the inventory neither confirms nor contradicts
them. Main intake, sibling projects, Documents/Desktop and other home roots
remain ungranted by default. The new scratch convention is
`<system-temp>/dotln/<session-key>/scratch`; it is not native scratch discovery.

Reproducible read-only scan: `node docs/evidence/WO-144/inventory.mjs`.
At 2026-09-19T19:51:34.914Z it read the same 61 main journals/43,128 rows,
plus two worktree journals/four rows after writer registration. All parsed;
all command and tool-destination fields were absent. Root/role target counts
therefore remain unavailable. The two added rows are local writer observations.

## WO-144-D002 — Bind declarations to the existing authority model

```json
{
  "id": "WO-144-D002",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Require each declared root to match an exact outside.write effect in a host-registry-admitted WO-042 grant, its applied trace, and the effective envelope. Emit the existing envelope and grants with the role-scoped root union; include the matched authorityGrantId. The existing skeleton authority decider judges expiry, evidence and denial, including saved correction narrowing.",
  "evidence": ["docs/planning/work-order-map.md WO-144 catalog row", "docs/planning/refutations/2026-09-19-planning-e9db81d6fa2f7356-019.json WO-144 criterion 3 known issue", "packages/compiler/src/authority.ts", "packages/compiler/src/types.ts AuthorityGrant", "packages/skeleton/src/reactor.ts harnessAuthorization", "packages/compiler/test/harness.test.ts", "scripts/test-harness.mjs WO-144 fixtures"],
  "rejected": [
    {"option": "Treat a source string on a support as sufficient authority", "reason": "It would bypass the existing independently admitted registry and create a second authority path."},
    {"option": "Change the kernel or authority schema", "reason": "Exact effects already express the root identity and project its provenance through GRANTS; the harness adapter supplies physical-path interpretation."}
  ],
  "reopenWhen": "A manifest root lacks the corresponding compiled GRANTS effect/provenance, a support widens without admission, or an expired/denied root authorizes a known write."
}
```

Correction, 2026-09-19: the first implementation treated declaration source
and support equipment as sufficient provenance. The map's carried receipt 019
finding and WO-042's registry contract show that was incomplete. Root effects
now pass through the existing grant registry and envelope. The original saved
Contributor graph stays intact; the active contributor program explicitly
requests the two operator-authorized policy effects. The registry is a separate
fixed policy input, never derived from a submitted support's requested roots.
The rejected alternatives and all-eight-trap rationale in D001 still apply;
this correction removes the parallel authority path.

Independent inspection also found two intermediate regressions, repaired before
handoff: eager resolution could lose a known denial when a later destination
raised ENOTDIR, and outside denial could mask stale runtime pins. Resolution
now yields one destination at a time and validates runtime pins first. Fixtures
exercise both counterexamples. No historical artifact was rewritten.

A final independent pass found that the typed-correction adapter's destructive
effect list omitted the newly declared outside writes. Although runtime admission
already respected a narrowed saved envelope, a real correction token did not
remove these effects. The adapter now merges current and previously saved
outside-write effects into that destructive set before applying the existing
correction policy. Generated-hook tests cover both fresh and reused records.
The correction policy itself is unchanged. The saved-graph round-trip test now
tests active grants explicitly while retaining the old graph's historical hash.
The companion authority-inspection fixture also now expects the two explicit
grant provenance labels and rejects projecting default root declarations onto
its unrelated synthetic grant. Its original one-grant projection still runs
with no outside-root declarations; runtime checks were not relaxed.

Receipt 019's remaining carry-ins are accounted for: the guarantee is known
destinations only; the map names the operator-root requirement for external
workflows; unreadable config, unavailable roots, path resolution failures and
opaque extraction delegate with observations, while known refusals and the
other four boundaries retain their behavior. Missing ancestors resolve
prospectively; symlink loops/permission errors remain resolution failures.

## WO-144-D003 — Stage the minor release and refresh source-pinned evidence

```json
{
  "id": "WO-144-D003",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Stage application v0.33.0, compiler 0.16.0 and skeleton 0.29.0. Refresh the four selected immutable evidence editions and run the required read-only live feedback verifier against its pinned capsule. Keep final review and publication separate.",
  "evidence": ["scripts/lib/release-preparation.mjs", "scripts/lib/evidence-sources.mjs", "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS", "docs/evidence/current.json", "Local release preparation: v0.33.0 remains current above v0.32.1"],
  "rejected": [
    {"option": "Reuse stale source-pinned evidence", "reason": "The existing check commands rejected the old authority, artifact, verification and feedback editions against the changed sources."},
    {"option": "Bump kernel or console behavior versions", "reason": "Neither behavior changed; only console dependency pins follow the changed components."}
  ],
  "reopenWhen": "Integration consumes the staged versions, current-source evidence fails, or independent verification finds an incompatible change."
}
```

Fan-out: one reused read-only inspection agent and one read-only feedback
verifier episode, no descendants, within the announced two-agent plan and cap
20. Token/cost totals remain unknown when the session counter is unavailable.
The feedback audit is the existing source-pin obligation, not independent
verification of this entire work order.

The final correction fix changed generated runtime pins after the first
authority edition was recorded. Authority revision 001 preserves that first
edition and records the final bundle; the other three editions still pass their
current-source checks. Local release preparation also generated the process
meter in `docs/final-reviews/WO-144/PR.md`; that is a draft, not a final review,
commit, or publication.

The document check then exposed a stale console selfhost fixture: it still
pinned the previous feedback edition, so its maturity policy hash no longer
matched the compiling version and its tester cell became unavailable. The
existing `console-fixtures.mjs --record-current-selfhost` command repinned the
current feedback/audit/verifier and regenerated only the selfhost views. All
other fixture cases remained byte-identical. This is evidence refresh for the
changed compiler, not a console behavior change or a weakened expectation.
