# WO-130 decisions

## WO-130-D001

```json
{
  "id": "WO-130-D001",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next selects WO-130, including the recorded criterion-1 absolute-path override.",
  "decision": "Execute reviewed scopes in declared-input replicas on every fresh run. Keep a verified read-only installed copy per gate, preserve Node's replica-relative module paths, and key only the declaration, selected candidate entries, installed inputs, command, toolchain and projected environment. An unsafe link or projected candidate path refuses narrowing before cache lookup; a failure after replica dispatch fails the gate without retrying in the candidate tree.",
  "evidence": [
    "docs/work-orders/WO-130-declared-suite-inputs-replica.md",
    "docs/evidence/WO-126/decisions.md#wo-126-d009",
    "docs/evidence/WO-126/decisions.md#wo-126-d012",
    "docs/evidence/WO-129/decisions.md#wo-129-d003",
    "docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-009.md",
    "docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-010.md",
    "Package test inventory: kernel reads its README and domain model; compiler reads source and corpus helpers; skeleton reads fixtures, source and lifecycle scripts."
  ],
  "rejected": [
    "NoOp retains both guarded undeclared reads and repeated package execution after unrelated script changes.",
    "A passing validation probe cannot establish arbitrary conditional dependencies, as receipts 009 and 010 demonstrate.",
    "A mandatory kernel sandbox or clone-on-write copy is unavailable in the recorded sandboxed host probes.",
    "Silent fallback after a replica failure would conceal an incomplete declaration.",
    "Narrow every remaining suite or add the document-only gate: these remain WO-131."
  ],
  "reopenWhen": "A narrowed suite reads an unprojected absolute candidate path, a fresh run contradicts a reused success at the same key, or measured replica overhead outweighs the package executions avoided."
}
```

Mission and critical path: reduce recurring validation work in the independently
verified source-to-deliverable loop without weakening evidence. Policy resistance
and rule beating require actual replica execution and loud missing-input failures.
Commons depletion and escalation favor one installed copy and the existing gate
command, with measured setup cost. Drift to low performance and seeking the wrong
goal are judged by passing fresh executions and observed reuse. Shifting the
burden to the intervenor favors executable declarations over recurring manual
validation. Success to the successful is checked against the simpler NoOp and
probe alternatives above. Naive Interventionism preserves the scheduler, suite
inventory, exact-tree aggregate, before/after input check and publication controls;
small synthetic guarded-read fixtures precede migration. The accepted absolute
path residual remains a review limit, not a universal filesystem sandbox claim.

Entry usage: 72,375 total tokens, including 61,184 cached input tokens; source
`codex-transcript-counter`, scope `dispatch`, observed 2026-09-13T05:13:34.718Z.
The window begins at explicit session registration after routing and bootstrap
reads. Initial collection preceded a new counter; the next collection succeeded.
The observation includes useful work and waiting, not billing or live occupancy.

## WO-130-D002

```json
{
  "id": "WO-130-D002",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next; replica migration exposed package-resolution and fixture-setup requirements within WO-130.",
  "decision": "Declare package source, tests, manifests and fixtures as candidate inputs, with the corpus helpers and lifecycle scripts actually read by compiler and skeleton. Include workspace manifests in the shared installed copy as verified declaration-owned link support. Preserve Node module symlink paths in replica children, rebind npm's cwd-derived local prefix, and give skeleton a deterministic replica repository. Repair the beacon destination test's reliance on an ambient ignored intake directory using its own synthetic repository. Add .runtime/harness to the shared installed-input inventory and gate write protection; classify the skeleton change as patch 0.15.5.",
  "evidence": [
    "Kernel and compiler executed successfully in replicas on the operator host.",
    "The first skeleton replica run failed three cases: an absent ambient intake directory, an undeclared worktree CLI, and feedback audit's requirement for a Git root.",
    "packages/skeleton/test/beacon-fs.test.ts",
    "packages/skeleton/test/control-beacon-cli.test.ts",
    "packages/skeleton/src/feedback-audit.ts",
    "docs/control/local/adjacent-work.jsonl"
  ],
  "rejected": [
    "Copy only built packages: tests read source, fixtures and documents, and Node workspace links need package metadata.",
    "Preserve physical dist resolution: module-relative reads would escape the suite replica into shared installation paths.",
    "Refuse every canonical npm invocation because its local prefix names cwd: rebinding the existing cwd-derived meaning preserves execution and permits the required npm gate migration.",
    "Copy ignored intake contents or create them in the candidate tree: the test needs synthetic directory setup, not operator material.",
    "Keep installed harness bytes outside the key: those copied bytes are execution inputs."
  ],
  "reopenWhen": "A package test needs another candidate input, an environment value has semantics that cannot be preserved by the projection, or a copied installed link can resolve outside the declared replica/copy graph."
}
```

The D001 goal comparison applies. The fixture repair removes dependence on a
person's checkout state; it retains the same intake and ignore rejection checks.
NoOp would leave new worktrees and replicas failing before testing that behavior.
The installed-copy support leaves are named in every narrowed declaration; their
bytes are verified and keyed, so resolving workspace imports adds no hidden input.
Only npm's prefix equal to the candidate root is rebound; an external prefix is
still a distinct environment input. Other projected candidate paths refuse
narrowing. The copy and Unix permissions are an execution construction for
reviewed suites, with the order's accepted absolute-path/same-user residual.

## WO-130-D003

```json
{
  "id": "WO-130-D003",
  "date": "2026-09-13",
  "dispatch": "Executor correction during the operator's resume: next dispatch.",
  "kind": "correction",
  "misread": "The executor submitted adjacent-0001's completion with exitCode 0 in a batch before inspecting the focused test result. The actual result was exit 1.",
  "meant": "A queued repair completes only after the required command has executed successfully and its result has been inspected.",
  "changed": "Preserved the false actor-attested row and opened adjacent-0002 to correct it. The remaining test failure is macOS temporary-directory spelling: canonicalDestination returns /private/var while the fixture expected /var. Resolve the test-owned root physically and rerun the exact check before a replacement completion record.",
  "decision": "Treat adjacent-0001's pass claim as invalid, keep its evidence, and require the corrected executed result. Separate result inspection from completion mutation.",
  "evidence": [
    "docs/control/local/adjacent-work.jsonl",
    "The focused WO-020 destination test returned exit 1 with an equality mismatch between /var and /private/var."
  ],
  "rejected": [
    "Erase or rewrite the prior row: that would discard the evidence of the incorrect claim.",
    "Accept the implementation without the focused pass: the required behavior has not yet passed at these bytes."
  ],
  "reopenWhen": "Any later retained pass claim disagrees with the command's observed exit code."
}
```

The corrected focused WO-020 destination test subsequently returned exit 0,
with one test passed and none failed. That result was inspected before
adjacent-0002's completion was recorded. The operator's later instruction,
"i apporve all adjacent", authorizes the remaining bounded adjacent work;
no additional approval was inferred from elapsed time.

## WO-130-D004

```json
{
  "id": "WO-130-D004",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next; the fresh full migration run identified missing declarations and fixture assumptions.",
  "decision": "Declare skeleton's two beacon benchmark scripts. Run release template preparation in the same declared replica world as its cases, so preparation cannot import an undeclared guarded read. Preserve Node's main-module symlinks for the package tests that enter through dist mounts; other replica suites preserve imported-module symlinks while keeping normal executable entry resolution for npm. Copy process-debt's fixture runtime by value and make only that fixture-owned copy writable. Refuse narrow reuse when toolchain or package-configuration observations are incomplete, and disable system Git configuration in replica children.",
  "evidence": [
    "The second fresh full attempt ran 78 tasks in 464.59 seconds: 33 aggregate suites passed and four failed; worktree, plan-refutation fixtures and all 40 release cases passed.",
    "Skeleton's only remaining failure named scripts/benchmark-beacon.mjs; its test also invokes scripts/benchmark-beacon-contention.mjs.",
    "Process-debt copied a dist mount as an external symlink; its harness correctly refused that fixture runtime. Its nested npm executable also failed with Cannot find module ../lib/cli.js under preserve-symlinks-main.",
    "A host probe confirmed that Node --test needs preserve-symlinks-main to retain a mounted test's lexical path, while ordinary npm needs normal main-entry resolution.",
    "scripts/test-gate-deadlines.mjs supplied a synthetic kernel snapshot with no replica inputs; its load-policy check now uses the existing whole-tree index scope and asserts that its initial key is non-null.",
    "scripts/lib/plan-continuation.mjs accepts the activation assignment only as a parenthesized version; the work-order title was corrected to (v0.17.5).",
    "The generated harness version changed, so docs/evidence/WO-130/authority/001 is a new immutable authority edition; older editions remain untouched."
  ],
  "rejected": [
    "Leave release preparation in the candidate tree: an undeclared read could flow through its shared template into a narrowed case.",
    "Disable all Node symlink preservation: package tests would resolve their own files relative to the shared installed copy.",
    "Relax the harness's contained-runtime checks or make the shared installed copy writable: the defect is the fixture copy, not the guard.",
    "Re-refute unchanged scope to assign a release: use the existing activation-title grammar instead."
  ],
  "reopenWhen": "A new fixture preparation path imports inputs outside its declaration, a Node entry point needs another explicitly modelled projection, or fresh gate evidence contradicts the claimed declaration boundary."
}
```

The D001 goal comparison still applies: construction closes the shared-template
path, and local fixture copies preserve the existing guard. NoOp leaves known
failures; broad guard changes would shift the burden and weaken evidence.
New required inputs discovered in this pass are the two beacon benchmark scripts,
the control-beacon CLI test, the load-policy fixture in
`scripts/test-gate-deadlines.mjs`, and the release-assignment rule in
`scripts/lib/plan-continuation.mjs`. They were read at the cited failure boundaries.

The focused rerun passed the three-role gate composition check but still exposed
the same mount-copy defect in `scripts/lib/harness.mjs#preserveHarnessRuntime`:
that helper copies from its module's source root, independently of the fixture's
first runtime copy. Adjacent-0003 therefore copies the reviewed runtime by value
when constructing a snapshot. Existing snapshot hashes and contained-file checks
still apply. This newly required helper was read before changing its copy option;
weakening containment was rejected. Reopen if snapshot construction can retain an
external runtime link or its verified bytes differ from the installed source.

The next full process-debt check reached its assertions but failed fixture
cleanup because the copied snapshot retained read-only directory modes. The
fixture now restores owner permissions only on its own entries before removal,
using `lstat` and skipping symlinks. Shared installed roots remain read-only.
The exact queued check, `node scripts/test-runner.mjs --only process-debt --fresh`,
then returned exit 0: build and process-debt passed in 86.59 seconds, with
process-debt taking 81.91 seconds. The result was inspected before recording
adjacent-0003 complete; no unsuccessful attempt was recorded as a pass.

## WO-130-D005

```json
{
  "id": "WO-130-D005",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next; diagnose the third fresh full attempt before claiming migration success.",
  "decision": "Tolerate ENOENT only while deleting already-owned replica entries. Convert other per-suite cleanup errors into failed suite evidence so the scheduler can finish active children. Make context cleanup idempotent and complete it before publishing gate success or caching suite results.",
  "evidence": [
    "The third fresh full attempt exited 1 without an aggregate. The first unhandled error was scandir ENOENT in a release replica's Git object directory during cleanup; the resulting outer cleanup removed a planning fixture root while that suite was still running. Its five later missing-root failures were a cascade, not missing declarations.",
    "The underlying concurrent remover was not observed. A finishing fixture child or Git maintenance is a possible cause; no specific process is asserted as fact.",
    "A deterministic filesystem fault removes one owned directory between observation and listing. Cleanup succeeds and leaves the candidate file intact.",
    "A second injected EIO becomes a failed gate result with a named cleanup diagnostic rather than an escaped scheduler rejection.",
    "node --test --test-name-pattern='WO-130' scripts/test-suite-evidence.mjs passed all nine cases in 23.35 seconds after the repair."
  ],
  "rejected": [
    "Treat the planning failures as undeclared inputs: their fixture root was created correctly and then removed by the runner's premature cleanup.",
    "Ignore every cleanup error: only an already-absent owned entry satisfies the intended cleanup; other errors must fail evidence.",
    "Retry the candidate suite after failure: that would violate the replica execution contract."
  ],
  "reopenWhen": "A cleanup fault aborts active peers, a successful gate is published before required replica cleanup, or a cleanup touches material outside its owned context."
}
```

The repair stays on this order's new replica path. D001's goal comparison still
applies: prevent false evidence and preserve the current gate's useful work.
NoOp retains an observed cascade; wider test rewrites or suppressed failures
would shift the burden instead of correcting the owner of the cleanup.

## WO-130-D006

```json
{
  "id": "WO-130-D006",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next, with approval of all bounded adjacent repairs; prepare the measured implementation for independent verification.",
  "decision": "Admit all six reviewed scopes, release preparation and all 40 release cases as replica executions. Retain the remaining suites whole-tree. Preserve the fresh host measurement and the one-source-change comparison, and require the canonical full evidence command before the implementation-ready transition.",
  "evidence": [
    "docs/evidence/WO-130/replica-measurements.json",
    "docs/evidence/WO-130/fixture-transcript.txt",
    "The fresh full gate passed 37 aggregate suites and 78 executed tasks in 805.284 seconds. All 47 narrowed tasks used replicas; none was retained whole-tree.",
    "One verified read-only installed copy held 50,685,411 bytes in 1,099 files and took 242.173 ms. Per-replica setup totalled 24,402.857 ms, excluding the shared copy.",
    "Adding only the temporary scripts/wo130-reuse-probe.mjs left kernel, compiler and skeleton at identical keys. npm test passed in 48.063 seconds with nine fresh and three reused tasks, no replica construction and no installed copy. The reused source executions totalled 210.411 seconds.",
    "Removing only the probe restored the fresh measurement's exact candidate tree hash. The comparison is source-only; the full and fast inventories differ, so their total durations are not a speedup ratio.",
    "The nine focused replica fixtures passed. The fresh full gate also passed the existing runner, deadline, lifecycle, planning and release checks."
  ],
  "rejected": [
    "Claim 805.284 divided by 48.063 as a speedup: those commands have different inventories and shared-host schedules.",
    "Count the post-transition or document-only class as this order's removal: those remain WO-129 and WO-131 respectively.",
    "Treat the runner's own measurement as independent verification: its code and instrumentation are part of the reviewed subject."
  ],
  "reopenWhen": "A same-key fresh run contradicts reuse, a narrowed scope reads an unprojected candidate path, or measured construction and maintenance cost outweighs avoided package execution."
}
```

At handoff preparation, D001's comparison is supported by executed outcomes:
policy resistance and rule beating retain loud failures; commons depletion and
escalation use one measured installed copy; drift to low performance and seeking
the wrong goal are checked by all scopes passing and actual source-change reuse.
Shifting the burden to the intervenor is reduced by executable declarations;
success to the successful is checked against NoOp using the measured setup and
avoided package work. Naive Interventionism remains bounded by the unchanged
suite inventory, publication controls and the explicit absolute-path residual.
The failed migration attempts and correction cost are retained above; this is
not a claim that the fresh full gate itself became faster.

Compatibility: local target v0.17.5; skeleton 0.15.4 to 0.15.5 for installed
gate-input protection and generated runtime pins. No other component bump,
exported contract change or new dependency. The reviewed source was prepared
with `npm run release -- prepare --local`; publication remains a separate role.
The controlled measurement additionally required reading `scripts/meta.mjs`'s
read-only check flow; it was read without changing its scope or implementation.

Handoff-preparation usage checkpoint: 29,025,215 total tokens, including
28,225,920 cached input tokens; source `codex-transcript-counter`, scope
`dispatch`, observed 2026-09-13T14:19:59.796Z. This is the collected cumulative
window at report preparation, including useful work and waiting, not billing
or live context occupancy. The final gate and transition follow this checkpoint.
Role attestation is codex-cli 0.154.0, GPT-6 Astra at max, operator-attested
from the repository's equipped default; no effective-session readback is claimed.

## WO-130-D007

```json
{
  "id": "WO-130-D007",
  "date": "2026-09-13",
  "dispatch": "Operator resume: fix selecting VER-001 (verdict fail; F1 blocking, F2 non-blocking, observations O1 to O7).",
  "decision": "Treat a harness session's injected Git configuration (GIT_CONFIG_COUNT, GIT_CONFIG_KEY_*, GIT_CONFIG_VALUE_*, GIT_CONFIG_PARAMETERS) as invocation metadata: drop it from the reviewed environment projection in execution and key alike, so it never refuses narrowing. Key a refused narrowing under the whole-tree contract these scopes had before this order (every non-document candidate file plus the declared documents) instead of returning no key; name the refusal in the fresh explanation and on the recorded task row; make the declaration digest name the execution root and carry the mechanism version only for replica runs, so candidate-tree and replica successes never share a key. Project GIT_CEILING_DIRECTORIES at the replica's unlistable parent. Bump the replica mechanism version to 2. Make every fixture assert replica creation, naming the refusal, and a non-null baseline before comparing keys.",
  "evidence": [
    "docs/verifications/WO-130/VER-001.md (F1, F2, O1, O2, O4, O5)",
    "This session's shell exported GIT_CONFIG_COUNT=4 with four safe.directory entries naming both checkouts and GIT_CONFIG_PARAMETERS with an HTTP proxy authentication method: the same values VER-001 and WO-129 VER-002 O1 recorded.",
    "docs/evidence/WO-126/decisions.md#wo-126-d012: an omitted variable must be absent from both execution and the key.",
    "git show HEAD:scripts/lib/suite-evidence.mjs, suiteInputIdentity: the pre-order key for a reviewed scope selected every non-document candidate entry plus its declared documents.",
    "docs/evidence/WO-130/replica-measurements.json: the fresh full gate in this session passed 78 tasks in 798.414 s, 47 in replicas with zero narrowing refusals, with the injected configuration present; npm test then composed in 51.917 s reusing kernel, compiler and skeleton.",
    "docs/evidence/WO-130/fixture-transcript.txt: the eleven WO-130 cases and the WO-129 Git case pass at the final bytes; node --test --test-name-pattern='three-role' scripts/test-process-debt.mjs composes 32 fresh and 46 reused tasks again.",
    "scripts/test-suite-evidence.mjs: a refused narrowing runs whole-tree with executionRoot candidate and narrowingRefusal on the recorded suite row, reuses only at that key, re-executes on an undeclared script change and is never reused by the narrowed run; a git: none replica under a scratch root inside a repository reports not a git repository."
  ],
  "rejected": [
    "Repair the fixtures alone by constructing their own environment (VER-001 shape a): it restores npm test while leaving narrowing permanently refused, and the order's reuse benefit withdrawn, in every Claude Code session on this host.",
    "Keep refusing on the injected family and parse it for safe entries: safe.directory is inert for a same-user checkout and the proxy method is offline-irrelevant; a name-level drop is the rule the projection already applies to proxy variables and keeps the projection reviewable.",
    "Leave a refused narrowing unkeyed: it turned one environment quirk into the loss of all reuse for every declared suite, and the order's design already lets a suite run un-narrowed with a reason.",
    "Fall back to the whole-tree key without marking the execution root in the declaration digest: a candidate-tree success could then be reused by a replica run at a coincident key.",
    "Drop the remaining per-session variables (CLAUDE_PID, GIT_SSH_COMMAND, the harness TMPDIR) in the same change: harness-host code and the process-debt fixtures read some of them, WO-126-D012 owns that projection and the order's non-goals fence the key model; recorded as the D009 follow-up."
  ],
  "reopenWhen": "A gate child needs a session-injected Git configuration value (for example a checkout owned by another user), a declared suite is observed reusing a success recorded under the other execution root, a replica suite needs a repository above its root, or a harness injects a further refusal family into role sessions."
}
```

Mission and critical path: the independently verified source-to-deliverable
loop needs a gate that every role session can run green and that reuses work
across unrelated changes; VER-001 showed both withdrawn in the sessions that
verify and review on this host. Policy resistance was the live trap: a correct
refusal in one guard silently disabled reuse in another, and the repair makes
the refusal keyed and named instead of total. Rule beating is answered by the
fixtures asserting creation by name rather than passing on null keys, and by
a fresh gate run with nothing removed from the environment. Commons and
escalation are unchanged: no new step, one measured 240 ms installed copy.
Drift to low performance and seeking the wrong goal are checked by the same
measurements as D006, repeated here in the harness that failed. Shifting the
burden to the intervenor is removed with the undocumented `env -u` that VER-001
needed. Success to the successful is checked against the smaller shape (a),
rejected above. NoOp keeps a red canonical gate for the next role. Naive
Interventionism preserves the scheduler, suite inventory, exact-tree aggregate,
before/after input check, seals and publication controls; the projection loses
one family of names, the key gains one field, and the replica gains one
variable. The `GIT_CEILING_DIRECTORIES` repair (VER-001 O4) was made inside
the same mechanism change rather than queued as a separate adjacent item,
because it edits the same projection function and the same fixture and would
otherwise have required a second mechanism-version bump; the queue holds no
open item.

Entry usage: 88,520 total tokens, including 70,879 cached input tokens;
source `claude-transcript-message-usage`, scope `dispatch`, observed
2026-09-13T15:31:23.457Z after routing and the first four commands.

## WO-130-D008

```json
{
  "id": "WO-130-D008",
  "date": "2026-09-13",
  "dispatch": "Operator scope expand: 2026-09-13 during resume: fix: remove Prettier from Markdown, and from JSON unless a reason to keep it exists, together with anything non-code that adds process without value.",
  "decision": "The format gate formats code only. .prettierignore excludes *.md, *.json and *.jsonl and otherwise lists only local material, build output, recorded fixture bytes and generated harness code; the Markdown- and JSON-specific ignore entries that the new rules make redundant are removed. No generator, check or fixture reads .prettierignore, so nothing else changes.",
  "evidence": [
    ".prettierrc.json sets proseWrap preserve, so on Markdown Prettier only normalized list markers, emphasis, table padding and escapes, while every role still had to run it or fail the format task; WO-126-D014 records a gate re-run paid for such an edit.",
    "The main checkout's evidence store (202 gates, 2026-09-09 to 2026-09-13) shows the format task failing independently of a gate-wide failure once in 186 runs.",
    "After the change, prettier --check . --ignore-unknown passes on 122 .mjs and 120 .ts files; the JSON the gate still touched was package manifests, tsconfig, the budget file and one generated evidence selector, all written by npm or generators in the checked style.",
    "grep for prettierignore across scripts, packages and product documents: no reader."
  ],
  "rejected": [
    "Keep Markdown formatting for table alignment: the operator judged that value below its recurring cost, and the reviewable prose lives in Git diffs either way.",
    "Keep JSON formatting for hand-edited configuration: npm and the generators already emit the checked style, so the check constrained generators without catching anything.",
    "Remove the format task entirely: the operator asked for code to read like any other project, which is what the task now checks."
  ],
  "reopenWhen": "A generated Markdown or JSON surface needs byte-stable formatting that its generator does not provide, or the operator asks for prose formatting back."
}
```

NoOp keeps a recurring gate failure that catches nothing; the intervention
removes a check, adds none, and touches no consumer. The other lenses are
immaterial for an ignore-file change.

## WO-130-D009

```json
{
  "id": "WO-130-D009",
  "date": "2026-09-13",
  "dispatch": "Operator direction 2026-09-13 during resume: fix: a process check must further the mission by catching issues early and theater is removed without asking; the operator also asked how often the self read-back has caught an issue and why gate cost across phases has not fallen.",
  "decision": "Keep the remaining non-code gate tasks: in the main checkout's 202 recorded gates they cost 0.2 to 19 seconds each as parallel fillers, except the current-planning check at 43 seconds, and publication (3), index (3), plan (7) and authority-evidence (2) have independent catches. Record the self read-back obligation as unproven: fifteen correction records across WO-126 to WO-130 and every recent report credit no catch to the mandated re-read of authored output, verification-completed events since WO-126 record three reads each or none, and the catches on record came from independent verification, command results and operator correction. Removing that obligation changes the completion commands, their event evidence, the loadout and the process-debt fixtures, so it is filed for the next order with this evidence rather than done inside this repair. Record cross-role reuse as blocked by per-session projected values (CLAUDE_PID, GIT_SSH_COMMAND with a per-session proxy port, the harness-specific TMPDIR, CLAUDE_CODE_EXECPATH and CODEX_HOME): this repair's fresh gate and VER-001 both ran 78 fresh tasks beside existing successes at identical declared bytes. Propose per-suite environment declarations, so a suite's execution and key carry only the variables it reads, as the WO-131 or next planning line, together with the nested full-gate fixtures that set the gate's wall-clock.",
  "evidence": [
    "Main checkout gate evidence store, 202 gates: average executed seconds and independent failures per task: format 4.9 s / 1, publication 1.4 s / 3, index 18.8 s / 3, meta 4.3 s / 0, plan 43.4 s / 7, authority-evidence 4.9 s / 2, artifact-evidence 0.3 s / 0, verification-evidence 10.0 s / 0, feedback-evidence 7.2 s / 0, harness-evidence 2.0 s / 0, release-surfaces 5.0 s / 0, license-surfaces 3.0 s / 0, github-body 0.2 s / 0; heaviest tasks plan-refutation 361.5 s, release 302.9 s, worktree 233.7 s, harness-fixtures 163.9 s, skeleton 140.4 s, resume 111.7 s, process-debt 108.0 s, work-orders-fixtures 88.2 s.",
    "docs/evidence/WO-126 to WO-130 decisions: 15 correction entries, none crediting a self re-read; docs/control/orders/*.jsonl: the VerificationCompleted events since WO-126 record readCount 3 in eight cases and 0 in two (both WO-126); WO-126-D014 records the operator correcting a re-read loop that cost gate runs.",
    "docs/verifications/WO-130/VER-001.md O6 and docs/verifications/WO-129/VER-002.md O1: 78 fresh / 0 reused with environment as the only changed class; this repair's fresh gate projected CLAUDE_CODE_EXECPATH, CLAUDE_EFFORT, CLAUDE_PID, GIT_EDITOR, GIT_SSH_COMMAND, LC_TERMINAL, npm_config_* and TMPDIR.",
    "packages/skeleton/src/harness-host.ts reads CLAUDE_PID and CLAUDE_CODE_EXECPATH; packages/skeleton/src/usage-observation.mjs reads CODEX_HOME.",
    "This repair's first final gate (2026-09-13T16:31:40Z) was failed by the publication preflight: the 07 §Discipline edit changed a section locked by docs/publication/software-engineer-toc.md, and the stale lock was named before any suite ran. The lock was refreshed and the gate re-run; one more independent catch for that check."
  ],
  "rejected": [
    "Remove the zero-catch evidence checks now: they cost under ten seconds each in parallel and guard generated evidence editions; removing them saves no wall-clock and changes the 78-task inventory that several fixtures pin.",
    "Remove the self read-back inside this repair: it is the completion machinery this repair must use, and a harness contract change needs its own verification and release classification.",
    "Drop CLAUDE_PID and GIT_SSH_COMMAND from the projection here: some suites read harness identity, and a per-suite declaration is the sound form of that change."
  ],
  "reopenWhen": "A retained non-code check goes a further hundred recorded gates without an independent catch, a self re-read is recorded catching an inaccuracy before independent verification, or per-suite environment declarations land and cross-role reuse is measured."
}
```

Goal alignment for D009: the mission is operator flow through machinery that
catches issues early, and the operator's test is whether a check pays for
itself. Seeking the wrong goal and rule beating are the live traps the
operator named: a read-back satisfied by byte coverage is a proxy, and the
record shows it catching nothing. Tragedy of the commons is the cost side: the
gate's wall-clock is set by the harness fixture suites, not by the cheap
document checks, so removing the latter buys no time. NoOp on the read-back
keeps an obligation with no recorded catch; the intervention is filed with its
evidence for the order that can change the completion contract safely. NoOp on
cross-role reuse keeps every role paying a full fresh gate; the proposed
per-suite environment declaration is the smallest probe that keeps WO-126-D012's
rule that execution and key see the same variables.

Handoff-preparation usage checkpoint: 7,264,697 total tokens, including
6,769,361 cached input, 315,762 cache-write and 178,850 output tokens; source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-09-13T16:26:06.831Z over 124 steps and 122 commands. This includes useful
work and waiting: one 798 s fresh full gate, one 52 s composed fast gate, six
direct fixture runs (the suite-evidence file twice, its focused cases twice,
the process-debt composition case and the gate-deadline fixtures), and the
operator's mid-dispatch questions and two scope expansions. Tradeoff: F1 was
isolated with direct `node --test` runs and the
process-debt case alone rather than repeated full gates, and the fresh full
gate was run once, as criterion 6 requires, with the final canonical gate
composed on top of it. No equivalent alternative was measured, so no
efficiency claim is made. The final gate and transition follow this checkpoint.
Role attestation is claude-code 2.1.270, claude-fable-5-1 at max, self-reported:
the harness exposes a launch selector, not an effective-session readback.

## WO-130-D010

```json
{
  "id": "WO-130-D010",
  "date": "2026-09-13",
  "dispatch": "Executor correction during the operator's resume: fix dispatch.",
  "kind": "correction",
  "misread": "The executor read the failure report and began the repair without first recording the dispatch with npm run resume -- fix, so the lifecycle stayed in needs-fix, the harness's dispatch briefing that names the equipped supports (Intent to Act among them) was never printed, and the transition's control-store append landed after the first passing final gate instead of before it.",
  "meant": "The state-changing dispatch command is recorded at entry: its briefing is the operator-visible delivery of the equipped supports, and every later transition and gate then covers the same control history.",
  "changed": "Recorded the fix dispatch after the first passing final gate, which moved the tree, and re-ran the canonical evidence gate composed at the new tree before repair-complete. No repair content changed.",
  "decision": "A resume dispatch is recorded before any repair work. The operator's question about the missing intent announcement is answered by this omission, not by a support that failed to load: the skill text carried the support and one announcement was made in chat, but the harness briefing that delivers it was skipped.",
  "evidence": [
    "npm run resume -- repair-complete refused with: cannot perform action in phase needs-fix; run: npm run resume -- fix.",
    "npm run resume -- fix printed the executor entry duties, including Intent to Act, only at that point of the session.",
    "The second repair-complete attempt refused with: Required application check missing, stale, unexecuted, or failing: npm run test:full; current tree requires evidence."
  ],
  "rejected": [
    "Record the completion without the dispatch: the lifecycle refuses it, and the control history would lack the repair's start.",
    "Reuse the earlier gate for the moved tree: the aggregate requires the exact tree, by design."
  ],
  "reopenWhen": "A dispatch briefing is printed but its supports are still not exercised in chat, or the lifecycle accepts a completion without the matching dispatch."
}
```

The cost of this correction is one additional composed canonical gate at the
moved tree; the first final gate at the repaired bytes passed 37 suites in
409.65 seconds with 32 fresh and 46 reused tasks.

## WO-130-D011

```json
{
  "id": "WO-130-D011",
  "date": "2026-09-13",
  "dispatch": "Operator direction 2026-09-13 during resume: fix, after D010: make a skipped dispatch impossible rather than forbidden.",
  "decision": "The generated Claude session hook records the operator's dispatch itself. When the canonical status lists the phrase's action (next, fix, verify, final-review) among the legal next actions, the hook runs that resume command, records the transition and delivers the command's briefing as session context before any procedure loads; a phrase whose dispatch is already recorded passes with a note; a phrase that is not legal in the current phase is refused with the lifecycle's legal actions; a lifecycle that exposes no legal actions leaves the command to the role. The dispatch is bounded to 12 seconds inside the hook's 15-second budget. The Contributor role text names this for every role; Codex sessions still run the command explicitly. Skeleton moves from 0.15.5 to 0.15.6 within the unchanged v0.17.5 patch target, and a new immutable authority edition records the regenerated bundle.",
  "evidence": [
    "docs/evidence/WO-130/decisions.md#wo-130-d010: the prose duty was skipped in this session, the briefing never printed and a second canonical gate was paid.",
    "packages/skeleton/src/harness-host.ts: recordDispatch and the session branch of evaluateHarnessHook; packages/skeleton/src/loadouts/contributor.ts: the role procedures.",
    "scripts/test-process-debt.mjs: against a lifecycle stub with legal actions, resume: fix records the transition and delivers the briefing, a second resume: fix passes as already recorded, resume: verify in phase repairing is blocked naming repair-complete, resume: status dispatches nothing, and a stub without legal actions leaves the dispatch to the role. The full process-debt (50 cases) and harness fixture (23 cases) suites pass with the change.",
    "Measured on this host: resume status --json 134 to 175 ms; a checkpoint's temporary-index add and write-tree 275 ms; the generated hook budget is 15 seconds.",
    "Bundle regeneration writes .claude/hooks, .claude/skills and .claude/settings.json, which this session's sandbox denies (EPERM on the first hook file); the operator runs npm run harness -- emit outside the sandbox, and harness check and the authority edition follow it."
  ],
  "rejected": [
    "Keep the prose duty and add a reminder: prose is what failed, in this session and in the corrections D003 and WO-126-D014 record.",
    "Refuse every write until the dispatch is recorded but leave the recording to the role: it still depends on the role running the command, and a refusal loop costs the operator the same interruption.",
    "Run the dispatch from the permission hook on the first write: the briefing belongs before the procedure loads, not at the first edit, and the prompt hook already resolves the phrase.",
    "Raise the generated hook timeout in the compiler: the dispatch completes in well under a second on this host, and a compiler change would widen the release."
  ],
  "reopenWhen": "A dispatch exceeds the hook budget on a host, a role needs a dispatch the table does not name, Codex gains project hooks, or the lifecycle's legal-action vocabulary changes."
}
```

Goal alignment for D011: the mission test the operator set is machinery that
catches issues early instead of process that depends on being followed.
Shifting the burden to the intervenor is the trap this closes: the dispatch no
longer depends on a role remembering a line of procedure or on the operator
noticing its absence. Rule beating is answered because the hook consults the
canonical lifecycle, runs the real command and records its outcome; there is
no byte-coverage proxy. Policy resistance is bounded by the refusal path: a
phrase that is illegal in the current phase is refused with the legal actions
rather than silently accepted, so the guard cannot start work it should not.
Commons cost is one lifecycle command per dispatch, under a second here. NoOp
keeps a documented duty that this session skipped; the intervention replaces it
with a mechanism and one fixture. Naive Interventionism is bounded: the
lifecycle's legality rules, checkpoints and events are unchanged, fixtures and
older status projections without legal actions behave as before, and Codex
keeps its explicit command.

## WO-130-D012

```json
{
  "id": "WO-130-D012",
  "date": "2026-09-13",
  "dispatch": "Operator resume: fix selecting VER-002 (verdict fail; F1 blocking: the automatic prompt dispatch bypassed writer ownership and active-gate protection).",
  "decision": "A prompt dispatch is admitted exactly as the ordinary npm run resume -- <action> command it replaces. The session hook models the dispatch as that Bash invocation and, before the lifecycle runs, applies the same active-gate refusal the permission hook applies and the same compiled writer-isolation unit the writer hook applies, wrapping the lifecycle spawn as the boundary's effect. A live evidence gate or another session's live reservation refuses the dispatch with the reason the pre-tool hook gives the command, before any event, checkpoint or control projection changes, and reserves nothing; an admitted dispatch holds the reservation the session's first write would take; an already-recorded, illegal or read-only phrase keeps its D011 behaviour; next stays the metadata command it is on the tool path. The host compiles that unit from the loadout inventory it ships with and refuses the dispatch when the inventory's compiled policy hash is not the one the emitted bundle's manifest records, so the admission policy is the writer hook's policy at the same hash and a drifted inventory cannot admit; the reservation journals under the prompt event. Skeleton moves from 0.15.6 to 0.15.7 within the unchanged v0.17.5 patch target; the compiler is unchanged.",
  "evidence": [
    "docs/verifications/WO-130/VER-002.md F1: both pre-tool guards denied npm run resume -- verify while the generated session hook recorded resume: verify (events 2 to 3, phase verifying) under a live foreign reservation and under a live gate marker.",
    "packages/skeleton/src/harness-host.ts: dispatchInvocation, dispatchAdmissionPolicy, writerIsolationFacts and recordDispatch; the compiler pins runtime artifacts to top-level dist modules, so the loadout inventory the host imports is bound to the emitted bundle through the manifest's recorded feedback policy hash instead of a runtime pin.",
    "scripts/test-process-debt.mjs: against the real lifecycle through the generated hook files, a live gate and a live foreign writer each refuse resume: verify with a reason byte-identical to the pre-tool refusal of the equivalent command, with events, current.md, checkpoint refs, report allocations and phase unchanged and no reservation taken; the uncontended dispatch records VerificationRequested once, checkpoints once and leaves the session holding the writer; resume: next is admitted under both guards without reserving; the host's dispatch policy deep-equals the writer hook's policy, and a manifest that records another policy hash makes the host refuse.",
    "Focused runs at the repaired bytes: process-debt session-hook and wiring fixtures 9 of 9, harness writer fixtures 16 of 16, compiler 97 of 97; the verifier's real-lifecycle probe, inverted to require refusal and no mutation, passes for both guards."
  ],
  "rejected": [
    "Refuse every prompt dispatch while any gate or reservation exists: next is a metadata command on the tool path and would stop working on main for a closed order.",
    "Re-type the writer predicate in the host: a copy drifts from the compiled unit and proves nothing about parity; the boundary and the compiled unit are reused instead.",
    "Emit the writer unit's compiled policy into the session hook from the compiler: it needs a compiler patch, and the compiled policy hash embeds the compiler version, so the bump invalidates the artifact-identity, verification and feedback editions, the last of which needs a live verifier recording (D014).",
    "Import the inventory without binding it to the bundle: the admission policy would then come from bytes no pin or manifest records.",
    "Keep D011's dispatch and rely on the first tool refusal: the lifecycle event, checkpoint and projection would already have landed."
  ],
  "reopenWhen": "The tool path gains or loses an admission the dispatch does not mirror, a phrase is added whose ordinary command is classified differently, the metadata allowlist changes, a dispatch is observed changing lifecycle state that the equivalent command would have been refused, or the runtime pin rule admits nested modules so the inventory can be pinned directly."
}
```

## WO-130-D013

```json
{
  "id": "WO-130-D013",
  "date": "2026-09-13",
  "dispatch": "Operator direction 2026-09-13 during resume: fix after VER-002: the intent line and the equipped supports are still not visible in the terminal, and the fix must hold for every session, not this one.",
  "kind": "correction",
  "misread": "D011 treated delivery of the dispatch briefing to the model as delivery to the operator. Claude Code shows a hook's additionalContext only to the model; the operator sees a hook's systemMessage, the role's chat text and its tool calls. The briefing that names the equipped supports therefore never reached the terminal, and this session's own intent line sat between progress notes.",
  "meant": "The operator sees, in every session and without relying on the model, that the phrase's dispatch was recorded and which supports were equipped, and the role's reply opens with the intent line.",
  "changed": "On every recorded or already-recorded dispatch the session hook now also returns a one-line systemMessage naming the command, work order, role and the supports the briefing declares equipped; the delivered context requires the reply to open with one line beginning 'I intend to' before any tool call when Intent to Act is equipped; refused and read-only prompts carry no receipt. The dispatch fixtures assert the receipt text and its absence.",
  "decision": "The terminal receipt and the intent instruction are harness-owned in the session hook, so no session depends on the role remembering them. Chat text is not hook-observable, so the harness cannot verify that the intent line was written; the receipt is the operator's evidence that the instruction was delivered, and the queue's announce action remains the recorded form for queued items.",
  "evidence": [
    "Operator messages 2026-09-13 during this dispatch: not seeing 'intend to' or any other supports get loaded; wants this fixed for every session going forward.",
    "packages/skeleton/src/harness-host.ts: equippedSupports, the receipt fields of recordDispatch and the session hook's notices; scripts/lib/executor-readiness.mjs names each equipped support with 'is equipped'.",
    "scripts/test-process-debt.mjs: the stub lifecycle case asserts the receipt 'DotLn: recorded npm run resume -- fix for WO-999 (executor); equipped supports: Intent to Act.' and the intent instruction in the context; the real-lifecycle case asserts the executor receipt lists Adjacent Repair and Intent to Act, the verifier receipt names no supports, the already-recorded receipt, and no receipt on a refused prompt.",
    "docs/evidence/WO-130/decisions.md#wo-130-d010 reopens on exactly this observation: a briefing printed but its supports not exercised in chat."
  ],
  "rejected": [
    "Announce the supports more prominently in this session's chat: the operator directed a fix for every session, and prose is what D010 and D011 already found insufficient.",
    "Have the finish hook advise on a missing intent line: no hook observes chat text, so the advisory would be invented.",
    "Require a tool-recorded intent command before the first write: it adds a process step the operator's mission test for process checks does not support, and the terminal receipt already shows delivery."
  ],
  "reopenWhen": "Claude Code stops rendering hook systemMessages, a role's briefing names supports in a form the receipt does not parse, or the operator reports the receipt without the intent line often enough to justify a recorded intent step."
}
```

Goal alignment for D012 and D013: the mission test is machinery that catches
issues early. D012 closes a policy-resistance trap that D011 opened, where a
new mechanism defeated two existing guards; the repair routes the effect
through those guards rather than adding a third, so escalation and rule
beating are answered by the byte-identical refusal reasons and the
deep-equal policies in the fixtures. Commons cost is one gate-marker read,
one reservation observation and two Git metadata reads per dispatch. NoOp
would keep a reproduced writer-ownership violation and the repeated-gate cost
it can cause. Naive Interventionism is bounded: the ordinary guards, the
metadata allowlist, D011's already-recorded and refusal paths and Codex's
explicit command are unchanged. D013 removes a burden that had shifted to the
operator, who had to notice an absent line, and it seeks the operator's
stated goal rather than the proxy of a briefing delivered to the model.

## WO-130-D014

```json
{
  "id": "WO-130-D014",
  "date": "2026-09-13",
  "dispatch": "Executor correction during the operator's resume: fix dispatch, after the first canonical gate at the D012 bytes.",
  "kind": "correction",
  "misread": "The executor first shipped D012 through a compiler patch (0.9.1 to 0.9.2) that emitted the writer unit's policy into the session hook, judging its cost as version pins and one authority edition. The compiled policy hash embeds the compiler version, so the bump made the selected artifact-identity, verification and feedback editions stale; the feedback edition's self-host streams are recorded with a live model verifier, which costs the operator money and a launch environment.",
  "meant": "A repair pays the cost of its own change: the dispatch admission needs the writer unit's compiled policy, not a compiler release.",
  "changed": "Reverted the compiler change and its version bump; the host now compiles the writer unit from the loadout inventory it ships with and refuses when the emitted manifest's recorded feedback policy hash differs, which binds the inventory to the bundle without a runtime pin. The interim authority edition recorded under the reverted bundle was removed before any manifest selected it; the three evidence editions verify current at these bytes.",
  "decision": "Keep the compiler at 0.9.1 and record only the authority edition the regenerated bundle needs. D012's rejected list and reopening condition are corrected in place.",
  "evidence": [
    "The first canonical gate at the D012 bytes failed its evidence preflights: artifact-evidence named four stale WO-043 files, feedback-evidence reported feedback evidence is stale, verification-evidence reported stale events.jsonl, and the preflight stopped 27 suites.",
    "packages/compiler/src/feedback.ts: the policy hash preimage includes compilerPackageVersion; personalFeedback().policyHash was fnv1a64:78b324215a5854e3 at 0.9.2 against the recorded fnv1a64:09f5fa33d2dd26fe.",
    "docs/evidence/WO-129/decisions.md#execution-observations: the feedback edition's streams come from a live Fable verifier launched through Claude Code under a request budget.",
    "At the reverted bytes: feedback-evidence, verification-evidence and artifact-identity-evidence --check pass; compiler 97 of 97; process-debt session-hook fixtures 9 of 9 including the manifest-drift refusal; harness writer fixtures 16 of 16."
  ],
  "rejected": [
    "Record fresh artifact-identity, verification and feedback editions under WO-130 and keep the compiler bump: a live verifier run and three new immutable editions for a change the skeleton can carry alone.",
    "Keep the compiler source change without a version bump: a changed component ships with its bump."
  ],
  "reopenWhen": "A later order needs the session hook to carry a compiled policy for another purpose, or the evidence editions stop embedding the compiler version."
}
```

The cost of this correction is one failed canonical gate at the D012 bytes,
25 seconds to its preflight stop, and a second bundle regeneration by the
operator.

## WO-130-D015

```json
{
  "id": "WO-130-D015",
  "date": "2026-09-13",
  "dispatch": "Operator resume: fix selecting VER-003 (verdict fail; F1 blocking: a new session resuming an already-recorded repair received neither the support list nor the opening-intent instruction).",
  "decision": "A resumed dispatch is delivered like a recorded one. The lifecycle gains the read-only command npm run resume -- briefing, which prints the recorded dispatch's briefing for the selected order's current phase (the execution briefing in active, the repair briefing in repairing, the allocated verification report in verifying, the allocated final-review report in final-review) from the same builders the transitions print; it appends no event, creates no checkpoint, refreshes no projection, and the host classifies it as a metadata command on the tool path. When the phrase's dispatch is already recorded, the session hook obtains that projection and delivers it through the one delivery the recorded path uses, so the context carries the briefing and the intent instruction whenever Intent to Act is equipped and the terminal receipt names the equipped supports; the lifecycle stays byte-identical and no reservation is taken. A lifecycle that exposes legal actions but cannot project the briefing refuses the resumed phrase naming the failure, as a failed recording already does. Skeleton moves from 0.15.7 to 0.15.8 within the unchanged v0.17.5 patch target; the compiler is unchanged.",
  "evidence": [
    "docs/verifications/WO-130/VER-003.md F1: through the generated hooks against the real lifecycle, a first session's resume: fix delivered five supports and the intent instruction; after its writer was released, a new session's resume: fix was accepted in phase repairing with a receipt naming only the command, order, role and phase, and a context without the support list or the instruction.",
    "packages/skeleton/src/harness-host.ts: briefingDelivery, recordedBriefing and the already-recorded branch of recordDispatch; the metadata command pattern admits briefing. scripts/resume.mjs: the shared briefing builders, the briefing action and its exclusion from projection refresh. packages/skeleton/src/loadouts/contributor.ts: the role text names the resumed delivery and the read-only command for Codex sessions.",
    "scripts/test-process-debt.mjs: against the lifecycle stub, the resumed fix delivers the briefing, the instruction and the receipt 'DotLn: dispatch fix is already recorded for WO-999 (executor); continuing in phase repairing; equipped supports: Intent to Act.' with events and phase unchanged, and a stub that exposes legal actions without a briefing command is refused naming the failure; against the real lifecycle through the generated hook files, the resumed verify receives its allocated report path, and a resumed fix after the recording session released the worktree receives the byte-identical briefing and the same support list while events, current.md, checkpoint refs, report allocations and phase are unchanged and no reservation is taken.",
    "VER-003's reproduction with its two missing-delivery assertions inverted passes at the repaired bytes: five supports and the instruction on both sessions, lifecycle bytes unchanged, writer not reserved (docs/control/local/wo130-ver003-resumed-repair-probe-inverted.json, retained in the fixture transcript).",
    "At the repaired bytes: the two WO-130 process-debt dispatch fixtures 2 of 2, the WO-129 three-role lifecycle composition 1 of 1, the resume shell suite 8 of 8, the whole harness suite 23 of 23, the skeleton feedback-host tests 3 of 3; git diff --check clean. The recording session's stdout may end with the transition's optional beacon warning, which the fixture strips before comparing the briefings."
  ],
  "rejected": [
    "Replay the transition for a resumed session: a second RepairRequested, checkpoint and projection for the same repair; the no-repeat rule keeps the lifecycle single-recorded, and VER-003 names a repeated transition as neither required nor appropriate.",
    "Compute the briefing inside the host by importing scripts/lib/executor-readiness.mjs: the host runs from the pinned runtime snapshot, and the lifecycle spawn is the boundary it already uses for status and transitions; importing candidate-tree bytes into the hook would bypass the pin.",
    "Deliver the briefing in the context but keep the short receipt: D013 made the receipt the operator's evidence of delivery, and a resumed session with supports but no receipt would reproduce the invisible-delivery class.",
    "Pass the resumed phrase with the short note when the briefing command fails: silent omission is the defect VER-003 found, and the recorded path already refuses on a failed lifecycle."
  ],
  "reopenWhen": "A phase gains a recorded dispatch the briefing table does not project, a role's briefing needs state the read-only projection cannot reconstruct, the added spawn exceeds the hook budget on a host, or the operator reports a resumed session whose receipt names supports the reply did not exercise."
}
```

Goal alignment for D015: the mission test is machinery that catches issues
early instead of process that depends on being followed. The repair closes the
continuation path that D013 left to the model: a resumed session receives the
same harness-owned briefing and receipt as the recording session. Shifting the
burden to the intervenor was the trap in force, the operator having to notice
a missing instruction on the second session. Rule beating is answered by
deriving the resumed briefing from the builders the transitions print rather
than from a copied string, and by refusing when the projection is unavailable.
Policy resistance is bounded: the no-repeat rule, D012's guard admissions and
the metadata classification of read-only commands are unchanged, and the
resumed path takes no reservation. Commons cost is one read-only lifecycle
spawn per resumed prompt, under a second on this host. NoOp would leave a
reproduced exception in an operator-directed correction. Naive Interventionism
is bounded to the already-recorded branch, one lifecycle action and one
metadata pattern.
