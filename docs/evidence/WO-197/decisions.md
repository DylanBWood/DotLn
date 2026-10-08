# WO-197 decisions

## WO-197-D001 — Read the historical rows before choosing repairs

```json
{
  "id": "WO-197-D001",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Preserve all available observations and distinguish historical threshold crossings, added case coverage, and avoidable waiting. Reproduce the recent slow cases before changing code. A missing historical per-case measurement stays unavailable; a code identity is not a commit.",
  "evidence": [
    "task-durations.json contains every available row since 2026-09-07: target-publish 369, worktree-integration 435, harness-fixtures 320, from readGateChecks(main) including its archives. The selected worktree initially has zero rows. Reused and failed rows are retained with their status; growth detection uses fresh passing tasks.",
    "All three first threshold crossings predate per-case recording. WO-186 D009 records at most five slowest cases, not every case. The first per-case row available is 2026-10-05T06:12:03.262Z. The six original task objects for those first fast/slow pairs were also inspected in both taskTimeline and cases: none has per-case data, output, or outputRef. This availability judgment is bounded to the retained gate index and archives; no historical case timing is inferred.",
    "First target-publish crossing: 24.359 s at 2026-09-29T20:29:51.807Z to 26.722 s at 22:57:53.942Z. First integration crossing: 142.538 s at 2026-09-25T05:33:23.922Z to 206.526 s at 05:49:27.867Z, at the same code identity. First harness crossing: 281.657 s at 2026-09-15T17:01:49.122Z to 493.418 s at 19:01:26.135Z, followed by 253.650 s. None proves a particular case regressed.",
    "target-publish: git log main --since=2026-09-29T20:29:51.807Z --until=2026-09-29T22:57:53.942Z --format='%h %s': no commits. This time window is not a source-diff attribution: gate rows can precede their eventual branch commit.",
    "worktree-integration: git log main --since=2026-09-25T05:33:23.922Z --until=2026-09-25T05:49:27.867Z --format='%h %s': no commits. This time window is not a source-diff attribution: gate rows can precede their eventual branch commit.",
    "harness-fixtures: git log main --since=2026-09-15T17:01:49.122Z --until=2026-09-15T19:01:26.135Z --format='%h %s': 7aeccb15 :fire: Run one product gate per work order and let release close only publish #64; e2aea10b Record WO-132 evidence, verifications, decisions, final review and control segment; ed7ca57c Write back the WO-132 lifecycle contract to the product, playbook, security and publication documents; 16ecf2cc Stand down the lifecycle machinery behind one product gate per work order. This time window is not a source-diff attribution: gate rows can precede their eventual branch commit.",
    "The sustained integration step is 131.090 to 257.121 s between 2026-09-29T19:10:50.370Z and 19:19:52.302Z. Commit 1f390755 later files 398 changed test lines for release-collision continuation coverage. No per-case timing exists for that pair.",
    "Recent publication step: 152.623 to 241.795 s between 2026-10-06T03:11:00.671Z and 04:45:58.134Z. The new WO-112 unsupplied automated item case is 47.244 s and the new automated review body case 29.603 s in the slow row; neither appears in the old row. Commit f0d55a1a later files 866 changed test lines and expanded source-writer checks. Later rows also name retryable inline/review-body triage (49.139 s latest) and non-retryable triage (22.024 s).",
    "Recent harness crossing: 388.760 to 393.770 s between 2026-10-06T19:06:32.320Z and 19:59:51.438Z; git log main in that window returns no commits. The same five cases rise: WO-132 live gate 56.134 to 57.334 s; WO-125 entry 26.247 to 27.133 s, runner 18.391 to 18.720 s, evidence 13.816 to 13.883 s; WO-158 read-only list 18.861 to 19.096 s. The harness has no concurrent task at start and reserves all four lanes; that does not establish an idle host."
  ],
  "rationale": "Do not label newly added end-to-end checks as a timer regression or invent first-row case attribution. Preserve the order’s recorded-baseline limits and its explicit route for larger legitimate work.",
  "goalAlignment": {
    "traps": "Wrong goal and rule beating: reducing asserted coverage to satisfy an old suite median would make the tests faster by changing their obligation. Diagnose setup and waiting first. Shifting the burden: retain the complete row listing and exact gaps here so verification need not reconstruct them.",
    "noOp": "Keeping every test unchanged preserves coverage but leaves avoidable fixture costs, if measurements establish any. If the cause is only larger product work, the order explicitly directs retaining it and recording criterion 2 unmet."
  },
  "rejected": [
    {
      "option": "Infer a case or commit from an identity or missing timing",
      "reason": "The historical evidence does not support it."
    },
    {
      "option": "Raise thresholds or alter the scheduler/deadlines",
      "reason": "Explicit non-goals; this would not repair a case’s cause."
    }
  ],
  "reopenWhen": "A retained pre-WO-186 case log becomes available, a controlled profile identifies avoidable case setup or waiting, or planning remeasures baselines for the larger suite."
}
```

## WO-197-D002 — Reject the cache experiment and reopen the test architecture

```json
{
  "id": "WO-197-D002",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Reject the ineffective compile-cache experiment. Withdraw the initial no-change conclusion: caller-level profiles measured costs but did not prove those costs necessary. Reopen the test architecture under the operator’s direction to research alternative proof strategies and preserve assertions while removing repeated setup.",
  "evidence": [
    "measurements.json: target-publish's WO-112 unsupplied automated item case passes three times alone in 48.768, 48.660 and 48.311 s; integration's WO-086 symlink-blocked stub case in 21.033, 20.710 and 19.703 s; harness's WO-132 live-gate refusal matrix in 57.624, 57.923 and 55.770 s. Each run uses the bounded wrapper and records host load.",
    "profiles.json: the publication case creates nine independent review scenarios. Its profile records 77 harness commands taking 15.145 s, 543 Git rev-parse calls taking 5.171 s, nine publication CLI commands taking 4.195 s, 76 forge-double calls taking 3.765 s, and 64 confined test calls taking 3.022 s. This is real scenario execution, including the shared-repository checks introduced with WO-112; neither target-publish nor pull-request-observer contains a fixed polling wait.",
    "The integration profile records three worktree integrate invocations taking 15.782 s, two clones taking 1.408 s, a linked worktree checkout taking 0.966 s, and cleanup taking 1.157 s. The case checks the initial blocked stub, a continuation whose release preparation is blocked, and the final successful continuation with real generators. scripts/lib/worktree-integration.mjs regenerate runs the build and projections each time; bypassing them would change what this recovery case tests. The 398-line WO-086 addition introduced multiple such cases after the earlier suite median.",
    "The harness profile records 439 generated-hook process calls: 207 permissions calls taking 27.192 s, 116 concurrent-work calls taking 16.493 s, and 116 write-observer calls taking 14.956 s. Fixture copying is below 0.2 s. Each matrix assertion still crosses its generated process boundary. The recent crossing rises across the same cases, not one new timer.",
    "Bounded economy comparison, unchanged assertions and code identity: a temporary Node compile-cache preload gives 48.484 s for publication against the uncached median 48.660 s, 20.676 s for integration against 20.710 s, and 54.750 s for harness against 57.624 s (uncached range 55.770 to 57.923 s). One cached arm per case does not establish a repeatable saving outside that host variation; no cache setting or helper is added to the tests.",
    "Node.js official module documentation, retrieved through Context7 on 2026-10-07 (https://github.com/nodejs/node/blob/main/doc/api/module.md), documents content-dependent compilation caching, version separation and reduced precision of V8 coverage with caching. The trial uses disposable per-process temporary directories; all cache directories are removed on exit. Existing confined checks continue to disable compilation caching. No test assertion was removed or relaxed."
  ],
  "rationale": "The original inference that real commands and added coverage required every existing fixture was unsupported. The exported full harness entry and existing event-store review tests provide cheaper ways to prove decision behavior. D004 records the replacement design and its validation obligations. Historical first-crossing case attribution remains unavailable.",
  "goalAlignment": {
    "traps": "Do not confuse a real operation with a necessary operation in every test. Preserve asserted behavior and independently test each boundary that moves out of a matrix. Do not claim the aggregate targets met without both the required fresh task and alone measurements.",
    "noOp": "Considered and rejected after operator correction: unchanged tests would preserve coverage but would leave repeated process startup and unrelated fixture establishment unexamined."
  },
  "rejected": [
    {
      "option": "Assume every matrix input needs a fresh generated process and every continuation needs every generator implementation",
      "reason": "The initial rejection was too broad. A full entry-point matrix plus actual adapter checks can preserve decision assertions; focused continuation tests can retain real Git/release boundaries while separate end-to-end cases test generator implementations."
    },
    {
      "option": "Add compilation-cache configuration to the three test suites",
      "reason": "The bounded comparison gives effectively identical publication/integration times and a small unreplicated harness change; it does not justify another fixture mechanism."
    },
    {
      "option": "Narrow the cloned history or share its object store",
      "reason": "The measured clone share is 1.408 s of a 20.682 s case. It cannot explain the sustained doubling, and adds a shared-store dependency while the dominant real generation work remains."
    }
  ],
  "followup": "Planning remeasures or explicitly retains WO-197 criterion 2's aggregate baselines for the expanded publication, integration and harness suites, using this order's task-durations.json, measurements.json and own fresh gate observations. Record that the first threshold crossings lack historical case timing; no executor can reconstruct it. Keep FUP-e96221b106cd136a's three task conditions and FUP-331423b3559f5cfa unresolved unless final review has evidence to close them. No case coverage, scheduler or deadline reduction is proposed.",
  "reopenWhen": "A bounded profile identifies a specific avoidable wait or a product defect; a repeated controlled cache comparison demonstrates a saving worth its fixture cost; or planning changes the obligation set or its measured baseline."
}
```

## WO-197-D003

```json
{
  "id": "WO-197-D003",
  "date": "2026-10-07",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.69.1, the next patch above the observed release baseline v0.69.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.69.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-197-slow-suites-back-to-their-medians.md"
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

## WO-197-D004 — Repair the test architecture after the operator correction

```json
{
  "id": "WO-197-D004",
  "date": "2026-10-07",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Replace repeated fixture establishment with layered behavioral tests in the three named test files. Keep the full runtime entry for harness matrices, real event-store folding for publication guards, and real Git/release/control logic for integration continuations, with independent process and full-generator coverage.",
  "evidence": [
    "The operator challenged the no-op direction and requested public-repository/library research, alternate test types and active problem solving; subsequently authorized research workers. No acceptance threshold or asserted behavior is waived.",
    "Public primary examples read 2026-10-07: https://github.com/eslint/eslint/blob/main/tests/lib/cli.js calls cli.execute directly; https://github.com/eslint/eslint/blob/main/tests/bin/eslint.js retains executable tests for pipes, exits and signals. https://oclif.io/docs/testing/ describes in-process command/output capture. No external implementation is copied and no library dependency is needed.",
    "Three read-only workers inspected publication, integration and harness boundaries; the executor alone changes the worktree. Earlier two review workers were repurposed for this research; final independent reviews will be fresh.",
    "The first direct evaluateHarnessHook experiment failed on advisory handling, which belongs to runHarnessHook. The replacement imports runHarnessHook and feedbackBoundary from the fixture’s actual pinned runtime and passes the serialized request through the full entry.",
    "The full-entry WO-132 prototype passes in 22.946 s against baseline 57.624 s median. This is one preliminary observation; repeated runs and the full gate remain required.",
    "Keep generated children for process ownership and reclamation, loading failures, operator-control prelude, chunked stdin and hang detection. Keep actual live gate children and tree-hash assertions in the converted WO-125 path matrices. Keep all matrix inputs and expected decisions.",
    "Publication guard fixtures append real opening and observer events, then execute the unchanged review loop and replay. Recorded attempts to prepare repair or touch publication fail the fixture; actual repair/push/disposition cases stay integrated.",
    "Focused integration fixtures retain real worktree/release/work-order commands. Replacement build/harness/meta/publication/console scripts validate their argv and record invocation; per-pass stage vectors detect omitted generation. Two comprehensive cases retain real generators. Meaningful release and work-order filesystem failures stay real."
  ],
  "rationale": "The expensive preconditions and executable adapters are separate obligations from each decision-table cell. Test both explicitly instead of repeating all setup for each cell. Measure the resulting work and run negative controls before judging success.",
  "correction": {
    "misread": "Real command execution and added scenario coverage were treated as evidence that the existing test topology could not be optimized.",
    "meant": "The operator wants measured speed improvements and an early decision point when investigation lacks a credible path; preserved assertions do not require preserving every repeated setup operation.",
    "changed": "Withdraw the no-op conclusion, inspect public testing practice, implement layered fixtures and retain explicit checks for the moved boundaries."
  },
  "rejected": [
    {
      "option": "Introduce a new CLI framework or mock library",
      "reason": "The repository already exports the full entry points and event-store interfaces needed; adding a framework does not remove the dominant repeated setup by itself."
    },
    {
      "option": "Replace every test with a pure mocked verdict",
      "reason": "Would lose real decision logic, persistence and boundary checks. Existing assertions and focused end-to-end cases remain."
    }
  ],
  "reopenWhen": "Differential or fault-injection checks reveal a lost boundary, measured savings do not justify fixture complexity, or the final suite runs identify another dominant repeated precondition."
}
```

## WO-197-D005 — Preserve hash outputs while removing per-byte BigInt work

```json
{
  "id": "WO-197-D005",
  "date": "2026-10-07",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Repair the measured runtime hashing cost with exact two-word FNV-1a64 arithmetic. Keep UTF-8 encoding, the 64-bit scheme, output spelling and semantic identities unchanged. Prepare compiler patch 0.25.5 and refresh only its existing workspace pins; the application stays at v0.69.1.",
  "evidence": [
    "Three generated-hook CPU profiles attribute 18.012-20.362 ms to fnv1a64 per process. The selected case repeatedly validates the pinned runtime; this is actual runtime work, not an inferred timer.",
    "Bounded wo197-hash-compare: 1007 inputs match, including all UTF-16 code units, lone surrogates, Unicode, deterministic varied strings and the actual 183196-byte harness source. Three 30-hash rounds are 145.273/145.251/143.924 ms for BigInt versus 33.905/32.955/32.902 ms for the equivalent word arithmetic.",
    "The recurrence follows the prime 435 + 256*2^32. The largest intermediate is below 2^42, within exact Number integer range. The function remains self-contained because compiler harness.ts embeds its source in generated fallback hooks.",
    "The existing corpus referenceStableHash already uses word arithmetic. The compiler test now adds a separate BigInt oracle and fixed anchors; the existing test label no longer describes its structurally matching reference as independent.",
    "Compiler artifact-identity tests pass after the change, including all 1007 differential values and existing fixed identities.",
    "New named inputs: packages/compiler/src/normalize.ts, compiler/test/artifact-identity.test.ts, corpus/harness/id-corpus-lib.mjs (read only), compiler/src/harness.ts (read only), compiler/src/artifact-identity.ts version constant, the compiler/skeleton/console manifests and existing lock pins. normalize.ts is a registered evidence source but is absent from FEEDBACK_SOURCE_PATHS; deterministic edition regeneration and checked feedback carry are required, with no invented live audit.",
    "Deterministic WO-197 edition 001 regenerated authority, artifact-identity and verification evidence; feedback edition 001 carries the checked current evaluation from WO-196 edition 001 with its original WO-112 revision 009 live audit. The generator reported 33 harness surfaces; authority/artifact/verification writers passed and feedback reported 10 passing checks plus 10 expected removal failures. docs/evidence/current.json selects those four editions. Existing immutable editions remain. Console selfhost projections were regenerated for the selected identities."
  ],
  "rationale": "This removes allocation and arbitrary-precision multiplication for every byte while computing the identical mathematical result. The differential and pinned-identity checks test compatibility independently of the optimized implementation.",
  "goalAlignment": {
    "traps": "Do not change the hash scheme, remove runtime validation, cache mutable source bytes, or call a microbenchmark a whole-suite saving. Preserve old evidence editions; measure the repaired cases and full suites afterward.",
    "noOp": "Retains the measured per-byte allocation cost on every hook validation. The bounded equivalent comparison establishes a concrete lower-cost implementation."
  },
  "rejected": [
    {
      "option": "Skip or cache runtime pin validation",
      "reason": "Could miss changed bytes and weaken the boundary."
    },
    {
      "option": "Switch hash format or add a native hashing dependency",
      "reason": "Would change identities or introduce deployment cost; exact arithmetic needs neither."
    }
  ],
  "reopenWhen": "Any independent hash vector, fallback hook, generated evidence, compatibility or full-suite check fails, or the measured end-to-end gain fails to justify the source and regeneration cost."
}
```

## WO-197-D006 — Explore alternatives across the operator's polar axes

```json
{
  "id": "WO-197-D006",
  "date": "2026-10-07",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Continue the work order with three distinct search routes: improve or reuse the existing approach; challenge whether a substantially different proof strategy serves the same assertions; and phone a friend by examining public repositories testing similar behavior. Compare runtime saved, behavior proved and maintenance cost before selecting a change. This directs this execution, without changing product policy or acceptance criteria.",
  "evidence": [
    "The operator recalled the early polar-axes idea as inertia/don't reinvent the wheel versus why/can we do something drastically different, then clarified that the third option was phone a friend: check public repositories in a similar space or testing similar things for ideas.",
    "The operator explicitly prioritized the work order over rushing its completion and offered patience for a substantially wider set of explored options. Research and read-only workers were already authorized. No deadline, gate, acceptance waiver or publication authority was added.",
    "The current search includes a measured compile-cache rejection, exact FNV arithmetic, full-entry harness decision matrices plus executable boundary checks, event-store guard fixtures, focused generators with fault injection, thin immutable Git seeds, and authentic publication seed reuse. Public testing sources are recorded in D004 and the subsequent experiment records.",
    "The first full harness response differential exposed the one-time advisory marker effect: evaluating the same request twice against one mutable marker directory is not an equivalent-state comparison. Preserve/reset the advisory markers between the two arms; keep the failed experiment in measurements.json. This is a correction to the experiment, not a suppressed assertion.",
    "The focused integration group passed all ten cases in 44.880 s with cold thin-seed preparation included, versus 109.350 s with full-history clones after the hash repair. The seed retains actual code, all product documents, budgets and publication TOCs, then authors only fixture planning/authority inputs. Each case keeps its own bare origin and real Git branches/worktree; the seed's HEAD, refs and clean status are asserted unchanged.",
    "Removing the copied integration implementation's meta-generator invocation made the existing focused case fail its exact stage vector even though the CLI continued to print the regeneration message. The intentionally failing negative-control run is recorded separately from passing measurements."
  ],
  "rationale": "Initial local profiling did not exhaust the available design space. External examples can introduce alternatives; executable equivalence checks and local assertions decide whether they fit. A promising first result is a reason to investigate the remaining dominant work, not a substitute for meeting the order's obligations.",
  "rejected": [
    {
      "option": "Stop exploration at the first measured saving",
      "reason": "The operator explicitly prioritized deeper exploration; publication still has expensive repeated preconditions and the aggregate targets require current-identity evidence."
    },
    {
      "option": "Treat public precedent as proof of local equivalence",
      "reason": "A borrowed testing pattern must preserve this project's authority, recovery, persistence and effect assertions. Public examples supply hypotheses, not waivers."
    }
  ],
  "reopenWhen": "A differential check exposes a lost boundary, a larger residual cost suggests another proof strategy, or measured maintenance/runtime tradeoffs favor a simpler design."
}
```

## WO-197-D007 — Borrow testing structure, then prove the local boundaries

```json
{
  "id": "WO-197-D007",
  "date": "2026-10-07",
  "dispatch": "resume: next; external research and fixture experiments",
  "decision": "Use public testing practice to generate concrete alternatives, then compare them locally. Prototype authentic same-path publication seeds, direct calls to the existing real target-harness functions, a shared raw GraphQL fixture handler, and a scratch-only applied-continuation fixture. Keep actual Git, repair/verification hosts, persistent events and effect receipts; retain representative process boundaries and all existing assertions. Adoption and measured results are recorded after the experiments.",
  "evidence": [
    "semantic-release primary source: https://github.com/semantic-release/semantic-release/blob/master/test/helpers/git-utils.js and https://github.com/semantic-release/semantic-release/blob/master/test/integration.test.js create scenario-defined real Git histories/tags, control plugin work and independently inspect local/remote identities. Changesets https://github.com/changesets/changesets/blob/main/packages/cli/src/commands/publish/__tests__/index.test.ts tests publication orchestration on small file trees and controlled commands, alongside real Git tests at https://github.com/changesets/changesets/blob/main/packages/git/src/index.test.ts.",
    "GitHub CLI primary source: https://github.com/cli/cli/blob/trunk/pkg/cmd/pr/merge/merge_test.go starts with structured PR states and verifies outgoing mutation fields including expectedHeadOid; https://github.com/cli/cli/blob/trunk/git/client_test.go separately exercises Git. These are precedents for separating workflow decisions from adapter checks, not evidence that those projects use this order's immutable seed cache. No external implementation was copied.",
    "Source inspection counted 33 authentic source-change scenario builds after the guard conversion. Distinct operator/no-grant/host-policy authority, readiness, signed-commit, pre-publication/published stage and API/process modes require eight separate immutable seeds, eliminating 25 repeated setups. Seeds originate from actual SourceChangeHost execution and, for review seeds, actual CLI publication. Exact original paths retain identity-bound proofs; full tree bytes, file modes and symlink targets are checked before reuse, and store/Git locks refuse replacement. Metadata and original contracts are freshly cloned per case.",
    "The original selected publication profile attributes 77 harness CLI calls to 15.145 s. SourceChangeWorktree.bundle calls scripts/harness.mjs emit/check/remove, while scripts/lib/harness.mjs already exports those exact operations. The test adapter passes the same target, runtime root and profile and retains their actual Git, ownership, generated-byte and pin checks. The pinned-body publication case and accepted-thread/recovery case keep separate process-mode seeds and real CLI calls; scripts/test-target-harness.mjs also retains target CLI coverage.",
    "The GraphQL fixture's existing raw-response logic is factored once: the generated child and in-process fake transport execute the same handler. The adapter intercepts only gh api graphql for registered review fixtures, reads the actual bare-origin head each time, records original argv and mutates the same remote-state file. Production JSON/GraphQL decoding, screening, observer folding and publication remain real. Other processes and the separate observer CLI cases retain their original boundaries.",
    "Node mock and builtin synchronization APIs were checked through Context7 /nodejs/node/v22_20_0 and official sources https://github.com/nodejs/node/blob/v22.20.0/doc/api/test.md and https://github.com/nodejs/node/blob/v22.20.0/doc/api/module.md. Mocks use the actual parent test context, capture original spawn before synchronizing live exports, and restore/resynchronize after each parent. Current execution uses Node v26.9.0. No dependency is added.",
    "The applied-continuation alternative is a scratch-only experiment derived from the retained real Git path: real clean-tree checkpoint and fast-forward, source-derived phase/identity fields, then actual --continue/release/index operations. It changes the late symlink case's entry boundary and must earn its complexity in a cold-versus-cold comparison before adoption."
  ],
  "rationale": "Reusing authentic preconditions and invoking real operations at their exported boundary can preserve more meaning than replacing complete repair outcomes with mocks. External examples broaden the candidate set; differential, contamination and fault-injection checks decide whether the candidate is valid here.",
  "goalAlignment": {
    "traps": "Do not share mutable state, transplant path-bound receipts into a different root, cache across authority variants, or call synthetic completion an independently verified repair. Retain process coverage where process behavior is the subject. Include cold fixture creation in suite measurements.",
    "noOp": "Would retain repeated setup and process startup already shown to dominate substantial parts of the publication suite. Continued investigation has concrete executable alternatives and operator authorization."
  },
  "rejected": [
    {
      "option": "Fake a completed RepairHost to make every triage table cheap",
      "reason": "pushRepairedHead independently replays real child receipts, ancestry and exact-head verification. A fake completion would not preserve those assertions; use real helpers and authentic setup reuse instead."
    },
    {
      "option": "Add a fixture framework or new mocking dependency",
      "reason": "The current exports, Node test mocks and existing event stores provide the necessary boundaries; a new dependency has no measured advantage here."
    }
  ],
  "reopenWhen": "A retained process case or equivalent-state comparison differs, contamination survives reset, a case needs simultaneous subjects, or the measured savings do not justify the fixture mechanism."
}
```

## WO-197-D008 — Measure reuse, catch contamination, decline receipt duplication

```json
{
  "id": "WO-197-D008",
  "date": "2026-10-07",
  "dispatch": "resume: next; bounded comparisons following D007",
  "decision": "Retain authentic same-path publication seeds, real harness API calls and the shared raw GraphQL transport after passing isolation and behavioral probes. Keep the simpler real integration path with focused generators and thin Git seeds; do not adopt the manually established applied-continuation receipt. Continue investigating the publication suite's residual cost before final validation.",
  "evidence": [
    "target-isolation-owned passes after poisoning a case's file tree, event log, real remote branch and mutable metadata, then restoring the authentic seed. Stale callbacks refuse. Negative controls target-negative-reset and target-negative-metadata fail the respective physical/metadata isolation assertions.",
    "The first target-seed-harness-api run failed: resetting fixture bytes left a retained repair child's harness installation receipt in the real launchpad. Both independent source reviews traced emit's previous-receipt check to the missing restored manifest; CLI and direct API both refuse this stale ownership. This was a defect in the experiment's isolation, not a product refusal to bypass.",
    "releaseScenarioHarness checks for live locks first, then calls real removeTargetHarness only for ordinary immediate fixture child directories carrying a manifest. That real operation authenticates receipt, bundle bytes and Git exclude ownership and releases only the named installation. It runs before replacement, parent cleanup and raw-builder disposal. Shared runtime snapshots and empty registries remain intact.",
    "target-negative-external deliberately skips only that owned removal and reproduces the second repair's missing-manifest failure. With cleanup present, target-seed-harness-api-owned passes the five selected parent cases (including nested retry shapes) in 37.651 s; target-seed-api-gh-owned passes the same selector in 29.683 s. Both include cold seed construction. All real repair, verification, Git, publication and replay assertions remain.",
    "target-whole-seed-owned passes the entire suite in 108.843 s versus entry's 319.076 s. This is a preliminary whole-suite saving of 210.233 s; it does not meet 22.254 s and is not a final-subject gate result. The profile of the repaired unsupplied-item case still records 243 real Git rev-parse calls and many other real Git and confinement operations; no timer explanation is invented.",
    "The cold applied-symlink comparison uses the same scratch file and exact selector: DOTLN_APPLIED_FIXTURE=0 passes in 6.450 s (case 6.166120 s), =1 passes in 5.388 s (case 5.118741 s). All existing symlink case assertions and three seven-stage vectors pass. The alternative saves 1.062 s in this bounded pair, at the cost of roughly 100 added lines coupling the fixture to checkpoint and integration-receipt internals.",
    "The existing integration-whole-thin run passes in 134.086 s, below 156.976 s; harness-whole-hash passes in 289.884 s, below 326.779 s. Repaired case bounds, repeated alone-runs and final-identity whole/gate measurements are still required. Measurements and host loads, including failed controls, are preserved in measurements.json.",
    "The required vertical diagnostic passes all 196 cases in 731.117 s. vertical-timing.md names the slowest three and the inspected clock/work boundaries; modeled backoff already advances a synthetic clock, so no vertical repair is made."
  ],
  "rationale": "The larger reuse changes remove measured repeated work while executable contamination controls test their isolation. The applied-continuation experiment is a real saving, but duplicating receipt construction for a roughly one-second benefit is less maintainable than the already passing integration structure. Declining that arm is a measured tradeoff, not an assumption that no alternatives exist.",
  "rejected": [
    {
      "option": "Ignore or delete stale launchpad ownership receipts to make the seed pass",
      "reason": "Would bypass actual ownership checks and potentially touch other fixtures. The real remove operation validates and releases only the fixture's own installation before its files disappear."
    },
    {
      "option": "Adopt the applied-continuation receipt fixture",
      "reason": "The bounded gain is 1.062 s while adding a second author of checkpoint/receipt structure. Retain the simpler real integrate path, which already measured below the suite target."
    },
    {
      "option": "Report the publication improvement as criterion 2 met",
      "reason": "108.843 s remains above 22.254 s. Both final alone and own-gate measurements are still outstanding."
    }
  ],
  "reopenWhen": "A contamination or process-boundary control fails; final integration load erases its measured margin; or a smaller source-derived applied fixture avoids receipt duplication while providing a material additional saving."
}
```

## WO-197-D009 — Stop fixture work at the state the assertion consumes

```json
{
  "id": "WO-197-D009",
  "date": "2026-10-07",
  "dispatch": "resume: next; publication boundary comparisons",
  "decision": "Stop the VER-001 F1 verification demo immediately after its real driver has validated and durably appended VerificationOpened. Retain the original baseline/subject witnesses and every publication assertion. Decline the broader publication API adapter because its whole-suite comparison does not establish a material saving. Make the authentic-seed contamination and stale-callback check a permanent test.",
  "evidence": [
    "The existing F1 case runs the complete demo and then slices its log at VerificationOpened. Later verification/repair events are deliberately discarded because renamed criteria would otherwise cause replay compilation drift. VerificationDriver.feed validates the event through the real reactor before store.append and invokes onEvent only afterward; runVerificationDemo releases its store in finally.",
    "Three cold bounded arms with the exact F1 selector pass: existing full demo 4.000 s; authentic demo stopped at opening 3.015 s; direct Driver with explicitly unavailable synthetic witnesses 2.778 s. All original refusal, remapped matrix, body, lint and remote-head assertions remain. Each alternative also verifies an exact two-event opening log, released host lock, zero dispatch, null pending and three incomplete rows with no evaluations.",
    "Adopt the existing onEvent boundary, using a private sentinel accepted only by identity and a transport dispatch trap. It removes about one second of unused fixture work. The extra 0.237 s of the direct-input arm does not justify another approximately 40 lines constructing baseline evidence and authority inputs. The preceding pinned-body/process case retains the complete verification demo.",
    "The separate publication API experiment calls the actual publishTargetOrder entry with fresh request and authority registry reads, real Git/stores and per-call environment restoration. Its complete scratch suite passes in 108.157 s versus 108.843 s for the existing publication CLI version. Recorded host loads vary; this roughly 0.6 percent whole-suite difference does not establish a useful gain for another environment/output adapter. The production file keeps its publication CLI calls.",
    "The seed contamination check retained in scripts/test-target-publish.mjs poisons files, event bytes, the actual remote branch and nested mutable metadata; it verifies their authentic restoration, refuses stale callbacks and executes the real observer/review loop afterward. Separate negative controls for missing physical reset, shallow metadata and unreleased external target ownership are recorded in D008 and measurements.json.",
    "All ten repaired integration cases passed three separate cold bounded invocations with their case-local duration assertions and exact generator/release argument checks. Those rows are integration-bound-1 through integration-bound-10. All five repaired harness cases also passed three separate bounded invocations, labeled harness-bound-runner, harness-bound-evidence, harness-bound-entry, harness-bound-matrix and harness-bound-read-list. Final whole-suite and own-gate evidence will be recorded later.",
    "The observer-CLI source and current whole-suite case timings were independently reviewed. Keeping explicit CLI dedup, malformed responses, actor roles, pagination, native argument refusal, maxBuffer and overflow checks leaves 2.663 s of convertible case time before unavoidable observer work. A second shared-response adapter would add approximately 50-70 lines and another environment/mock lifetime boundary; this unexecuted arm is declined on its measured upper bound, not reported as a speed comparison.",
    "Official Node v26.9.0 source https://github.com/nodejs/node/blob/v26.9.0/lib/internal/test_runner/test.js documents through implementation that ordinary after hooks are appended and awaited in increasing index order. Integration bounds are registered after the case callback in finally, so they include prior fixture cleanup; publication uses the same placement."
  ],
  "rationale": "A fixture should perform the work that establishes its consumed state. The authentic opening boundary removes demonstrably discarded work with less new fixture logic than a separate witness builder. A valid API refactor is not automatically a worthwhile speed improvement; keep the measured comparison and avoid its extra adapter when total time is effectively unchanged.",
  "rejected": [
    {
      "option": "Construct a second synthetic verification-opening witness schema in F1",
      "reason": "It passes, but saves only 0.237 s beyond the smaller authentic-opening change while adding another author of verification inputs."
    },
    {
      "option": "Replace publication CLI calls with a local environment/output adapter",
      "reason": "Both complete suites pass, but the 108.843 versus 108.157 s pair does not establish a material whole-suite advantage."
    },
    {
      "option": "Add a second API/GraphQL adapter for the remaining observer-only cases",
      "reason": "Retained process-boundary obligations leave at most 2.663 s of total case time to optimize; a second adapter would add disproportionate mock/environment complexity."
    }
  ],
  "reopenWhen": "Opening-only behavior changes, the private sentinel stops occurring at the durable validated boundary, or a repeated controlled profile establishes substantial publication-CLI startup cost worth another adapter."
}
```

## WO-197-D010 — Keep fresh dispatch proof when borrowing contract-test ideas

```json
{
  "id": "WO-197-D010",
  "date": "2026-10-07",
  "dispatch": "resume: next; residual-cost research",
  "decision": "Retain each inline retry row's actual zero-to-one-to-one writer-dispatch assertion. Decline completed-RepairHost caching at the factory boundary: it could establish a valid repaired result but cannot establish a new dispatch in each row. The authentic precondition cache ends before the behavior under test.",
  "evidence": [
    "The independent worker inspected packages/skeleton/test/repair-fixture.ts: repairTransport.dispatch records its launch only after validating the writer prompt, then executes actual fixture changes and Git add/commit. SourceChangeHost.run recovers a completed result without that dispatch. Copying its historical launch log or incrementing a replacement factory counter would change the assertion's meaning.",
    "Public primary precedents: https://docs.pact.io/getting_started/how_pact_works describes separately checking a consumer's expected interaction and verifying that interaction against the real provider. https://github.com/vcr/vcr/blob/master/lib/vcr/cassette/http_interaction_list.rb initializes used interactions empty and returns a recorded response only when a current request matches its request matchers. These support cached outcomes with current request assertions, not treating a historical provider execution as a current call.",
    "An explicit consumer/provider split remains a credible different coverage contract: exact repair configuration and factory/run requests in each consumer row, plus separate real provider and corrupt-receipt controls. This order's unchanged per-row transport-dispatch assertion is stronger at that boundary; no operator waiver or changed assertion is inferred from permission to research alternative tests.",
    "The repaired selected publication profile attributes 760 ms to 16 confined sandbox calls. A cache below the real transport dispatch could remove only a subset of that measured work while adding provider-request matching and receipt lifecycle machinery; that alternative is not executed and no saving is claimed."
  ],
  "rationale": "The question is what present execution proves. Reusing authentic setup preserves the current episode's dispatch, verification and effect checks; reusing its outcome would require a deliberately different coverage contract. The external precedents make that distinction explicit.",
  "rejected": [
    {
      "option": "Return a completed RepairHost and reuse its saved launch log",
      "reason": "It reports a prior dispatch as if the current row performed one."
    },
    {
      "option": "Replace transport launch counts with matching factory/run request counts",
      "reason": "This could support a separately adopted contract-test design, but changes the existing assertion and therefore is not adopted under criterion 3."
    }
  ],
  "reopenWhen": "The coverage contract is explicitly redesigned to separate consumer and provider proof, or a lower-level cache demonstrates a material saving while each current row still performs and observes its real writer dispatch."
}
```

## WO-197-D011 — Reject a faster Git observation that changes freshness

```json
{
  "id": "WO-197-D011",
  "date": "2026-10-07",
  "dispatch": "resume: next; Git batching experiment and counterexample",
  "decision": "Do not adopt the scratch SourceChangeWorktree.verify batching candidate. Combining root, common-directory and HEAD observations removes two Git startups, but moves HEAD before the independent branch and ownership checks. Keep the existing runtime observation order.",
  "evidence": [
    "Public primary Git sources inspected through the research worker: https://github.com/git/git/blob/master/builtin/rev-parse.c and https://github.com/git/git/blob/master/t/t1500-rev-parse.sh. The candidate uses actual Git with unchanged HOST_GIT flags, branch/common-directory/ancestry checks and no cached observation. Exact known-root prefix and final object-ID framing handle embedded-newline paths and SHA-1/SHA-256; individual trimming refusals are retained.",
    "git-batch-contracts passes nine framing and real-Git tests in 2.488 s: changing HEAD, embedded-newline paths, wrong branch, detached HEAD, symlink identity, a foreign common directory with the same path/branch/HEAD, and unrelated ancestry. Static valid/refused inputs alone did not establish temporal equivalence.",
    "The same selected publication case passes before/after in 11.471/10.919 s, with 26 verify calls in both arms and aggregate verify time 1472.139/1001.317 ms. The same vertical continuation/backoff case passes in 31.759/30.191 s, with 14 calls in both arms and aggregate verify time 3738.194/2493.346 ms. These are bounded paired samples, not a whole-gate or target claim.",
    "An independent review identified that effect() consumes the returned HEAD for its base/no-effect shortcut, diff, receipt matching and post-test equality. A later clean/diff command does not re-read HEAD. Existing writer fencing does not establish equivalence of the newly reordered observations.",
    "git-batch-late-head passes its deterministic counterexample in 0.574 s: each arm starts from exactly the same real refs, performs the actual symbolic-ref query and then moves the actual HEAD once to a valid same-tree descendant. The original returns that new HEAD; the candidate returns the old HEAD while Git reports the new one. The passing probe establishes the candidate's semantic difference, not its acceptability.",
    "The 27 repaired publication parent cases each pass three separate cold bounded invocations, target-bound-1 through target-bound-27. Alongside the ten integration and five harness cases, all 42 measured parent bounds have three passing alone-runs. Publication bounds use each parent's cold measurement rounded up to 0.1 s, doubled, with the timer starting before fixture setup and checked after registered cleanup. measurements.json retains all runs, host loads and failed experimental controls."
  ],
  "rationale": "Reducing subprocess count is useful only when the observations retain their meaning. The counterexample is a concrete reason to reject this candidate despite its measured saving. Batching only root/common-directory still reorders observations around the branch check; no untested variant is substituted as equivalent.",
  "goalAlignment": {
    "traps": "Do not infer temporal equivalence from a collection of static passing cases, or trade fresh authority/identity observations for a faster benchmark. Preserve failed experiments and the counterexample so later work need not repeat this search blindly.",
    "noOp": "Keep the existing Git verifier while retaining the already measured fixture and exact-arithmetic improvements. This leaves the measured Git startup cost; it does not assert that every future Git optimization is impossible."
  },
  "rejected": [
    {
      "option": "Adopt the three-field batch based on static equivalence tests and faster samples",
      "reason": "The deterministic interleaving returns an older HEAD than the existing verifier."
    },
    {
      "option": "Read Git refs directly or add a new Git implementation dependency",
      "reason": "Would introduce another author of Git storage, configuration and ownership semantics; no equivalent bounded implementation or measured benefit was established, and criterion 6 forbids a new dependency."
    }
  ],
  "reopenWhen": "A candidate preserves the required observation/freshness contract under the demonstrated interleaving and other identity substitutions, or a separately justified runtime design supplies an atomic observation boundary."
}
```

## WO-197-D012 — Apply fresh independent review and protect bound registration

```json
{
  "id": "WO-197-D012",
  "date": "2026-10-07",
  "dispatch": "resume: next; fresh independent self-review",
  "decision": "Adopt the design review's optional bound-registry safeguard and clarify integration measurement provenance. A renamed or removed case must leave an unmatched registry entry and fail, including when execution is filtered. Preserve every case body, duration constant and cleanup boundary. Repeat the three suite-alone measurements at the resulting code identity before the document and full review gates.",
  "evidence": [
    "Two fresh read-only workers received only the work order and complete diff, using supplied gpt-6.1-sol/max with no descendants. The criteria adversary found zero substantive defects and requested a measurement-provenance clarification. The design improver found zero confirmed behavior defects and one optional P3: full case-name keys could silently lose their bounds after a rename. Reports are adversary.md and improver.md; both workers also reviewed the two-file repair diff and found no new issue.",
    "Integration's constants are per-case measurements from integration-whole-thin, the whole suite run alone, rounded up to 0.1 s. The later integration-bound cases are independent cold runs against twice those values. Publication's constants instead come from target-cold-1 through target-cold-27. The integration source comment now states this provenance explicitly; no bound is raised.",
    "Both test wrappers remove names from an unmatched-bound set at declaration time, before Node filters execution. A final module assertion requires the set to be empty. This makes a stale entry visible without changing every test declaration's call shape or relying on cleanup hooks to register cases.",
    "Scratch controls with an explicitly nonmatching test name execute registration only. target-registry-matching-selected exits 0 in 0.172 s; target-registry-renamed-selected exits 1 in 0.172 s and names the renamed declaration's unmatched bound. Integration's corresponding matching/renamed controls exit 0/1 in 0.144/0.131 s. Expected refusal is the control's success; failed mutant rows are not product passes.",
    "The initial scratch relocation missed workspace package imports and failed before testing the guard. Resolving the existing packages' import exports repaired the experiment. Its first selector, ^$, unexpectedly ran the actual suites; those matching arms pass in 111.287 s for publication and 134.009 s for integration, and each renamed arm fails with the exact unmatched-bound assertion. The later literal nonmatching selector proves filtering independently. All completed rows remain in measurements.json.",
    "Before this final registration safeguard, the three original suite files pass alone at code identity 55a36e405f37cf9084d2e51b0380c0a59a6035feafd2b2fd65c85725eb151184: publication 96.859 s, integration 123.491 s, harness 280.082 s. These labels end in alone-final but are superseded as final-subject evidence by the post-review runs; they are retained as observed measurements, not relabeled.",
    "The package-lock comparison adds or removes no package entry; only the compiler package version and its existing console/skeleton pins differ. inventoryMaterial returns an empty repository inventory. Scratch experiment modules are ordinary files; real Git fixtures own and remove their temporary repositories. No scratch repository remains inside the worktree for a material declaration.",
    "The three research workers and two fresh review workers total five explicit admissions, below the configured cap of 20. Harness usage reports zero automatically observed admissions and an unknown uncounted remainder under Codex; the explicit session count is not replaced by that incomplete observation."
  ],
  "rationale": "A performance assertion is useful only while it remains attached to the intended case. The small registration check preserves this obligation through a routine rename, and the negative controls prove that it refuses without depending on executing the case body.",
  "rejected": [
    {
      "option": "Leave name drift as a convention for future reviewers to notice",
      "reason": "A stale map entry currently looks harmless while silently dropping its bound; a declaration-time assertion detects it automatically."
    },
    {
      "option": "Move all duration constants into new per-test call signatures",
      "reason": "Would touch many declarations and their existing options for the same outcome; the small registry validation keeps the current measured table and catches the identified drift."
    }
  ],
  "reopenWhen": "A new declaration pattern is not observed by the wrapper, execution filtering skips the registry check, or the final gate identifies a behavioral or evidence failure."
}
```

## WO-197-D013 — Record the final subject's gains and remaining limits

```json
{
  "id": "WO-197-D013",
  "date": "2026-10-07",
  "dispatch": "resume: next; final executable evidence and handoff",
  "decision": "Retain the measured fixture and exact-arithmetic improvements, complete adjacent-0001 with all three declared passing checks, and hand off with criteria 1 and 2 explicitly unmet. The implementation establishes substantial speedups, preserves the asserted boundaries and adds case-local growth detection; it does not establish every aggregate target or reconstruct unavailable historical observations.",
  "evidence": [
    "Final code identity 1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8. The original three suite files pass alone under the bounded wrapper: target-alone-reviewed 110.683 s, 56 tests; integration-alone-reviewed 134.598 s, 21 tests; harness-alone-reviewed 285.816 s, 157 tests. All three records name this same code identity and exit 0. The earlier labels ending in alone-final remain superseded observations (D012).",
    "On the 16-CPU host, standalone 1/5/15-minute load averages before/after are: publication 5.358/5.916/6.318 to 5.825/5.983/6.296; integration 5.825/5.983/6.296 to 7.416/6.684/6.534; harness 7.416/6.684/6.534 to 6.611/6.309/6.362. Full precision and command boundaries are retained in measurements.json and gate-summary.json.",
    "The entry's passing standalone publication observation was 319.076 s; the final 110.683 s is 208.393 s (65.311 percent) less. Integration's passing entry was 239.160 s; final 134.598 s is 104.562 s (43.721 percent) less. These are observed before/after samples with their host loads, not a controlled estimate of all future runs. The entry harness observation was interrupted: its raw log says Suite bounded-probe stopped by gate request after 342285 ms. It is excluded from passing-baseline percentage comparisons. The earlier chat description of that row as failed is corrected to interrupted; no assertion failure is inferred from its exit 1.",
    "npm run test:docs passes 29 fresh tasks in 110.399 s, recorded 2026-10-07T21:16:11.868Z. npm test -- --review passes 35 reported suites / 85 fresh tasks in 1477.586 s, recorded 2026-10-07T21:42:47.615Z. Both rows name this work order and code identity, exit 0, reusedSuites 0, identityUnchanged true and buildOutputUnchanged true. gate-summary.json preserves canonical metadata, exact target task rows and the outer gate command's separately measured wall time.",
    "The own fresh review-gate tasks are target-publish 129.847 s, worktree-integration 181.029 s and harness-fixtures 289.515 s. Against criterion 2's ceilings 22.254/156.976/326.779 s, publication misses both required observations, integration meets alone but misses under gate load, and harness meets both. Criterion 2 remains unmet; a green correctness gate is not an aggregate timing pass.",
    "Publication starts beside skeleton, release:case:material and release:case:close_receipt_recovery; integration starts beside release:case:close_receipt_recovery, target-publish and checkpoint. Both use shared load class, one reserved lane, peer cap 3 and load factor 8. Harness starts with no concurrent task and reserves all four lanes. Gate host loads are sampled every nominal five seconds; nearest before/after brackets are retained with their timestamps. Publication's bracket is 10.280/10.188/8.123 to 11.791/10.875/8.706; integration's is 12.826/10.720/8.370 to 10.933/10.907/8.904; harness's is 5.378/5.827/6.123 to 11.016/6.977/6.440. Sample brackets are not exact task-boundary observations. The association with heavier load does not establish that load alone caused either miss.",
    "The full review gate's five slowest integration cases are the retained real-generator/history/recovery cases, led by untracked stash collision at 26.403 s. Its final standalone observation was 12.032 s. The ten repaired continuation cases and all other duration-bound cases pass under the gate as well as their three cold repetitions. No bound, scheduler setting, deadline or assertion is relaxed after observing the gate.",
    "Criterion 1 remains unmet for the specific historical gap in D001: all three first threshold crossings predate retained per-case timing. The complete available row listing and actual commit-window queries are preserved; no case or causal commit range is invented. D002's planning follow-up FUP-edf3b0375b7c0eda remains open, and the original carry-ins remain for final-review disposition.",
    "All 42 repaired parent cases have three passing selected cold runs; the two name registries also have matching and renamed-declaration controls. The fresh reviewers' final repair reviews report zero new findings. self-review: found 1; fixed 1; recorded 0, counting the optional bound-registration safeguard described in D012, adversary.md and improver.md.",
    "The required standalone vertical diagnostic passes 196 tests in 731.117 s and names the three slowest cases and their actual work in vertical-timing.md. The final review gate also passes vertical in 837.799 s. The diagnostic and final-gate observations retain their distinct subjects and loads; no vertical timer repair is claimed.",
    "Adjacent queue revision 5 records adjacent-0001 completed with compiler FNV differential and artifact identity tests, npm run test:docs and npm test -- --review, all exit 0 and linked to their evidence. Compiler patch 0.25.5, its existing workspace pins, the regenerated harness/console fixtures and all four current WO-197 edition-001 references are checked by the gates. Application release preparation remains v0.69.1. No dependency is added. git diff --check passes after the full gate."
  ],
  "rationale": "The broader search requested by the operator found useful alternatives and tested their boundaries. Its value is the implemented reduction in repeated setup, the preserved real behavior and the reusable experiment record. Missing an aggregate target must stay visible even when the reduction is substantial; missing historical data must stay unknown even when current cases are well measured.",
  "goalAlignment": {
    "outcome": "Matched the operator's direction to investigate conventional improvements, different test structures and public precedents. Delivered measured changes instead of the withdrawn no-op conclusion. The historical-attribution and complete aggregate-timing obligations remain unmet and are carried explicitly to independent verification.",
    "traps": "Do not turn passing correctness checks into a timing pass, attribute all variation to host load, compare an interrupted baseline as a pass, or replace a required own-gate observation with a faster standalone sample.",
    "noOp": "Rejected for the measured avoidable setup and hashing costs. Retained only for experiments whose additional complexity lacked a material gain or whose counterexample changed what the test or runtime proves."
  },
  "rejected": [
    {
      "option": "Report all criteria met because both gates are green",
      "reason": "The explicit timing comparison and historical record do not support criteria 1 and 2."
    },
    {
      "option": "Rerun unchanged code until a more favorable load produces a lower gate figure",
      "reason": "That does not repair a measured cause. Preserve the required own-gate sample and its concurrency/load evidence."
    },
    {
      "option": "Raise aggregate thresholds, pack lanes differently or cut deadlines",
      "reason": "Those remain outside this order, and none would remove case work."
    }
  ],
  "reopenWhen": "Historical per-case evidence becomes available; a measured remaining case cost admits a simpler repair preserving its asserted boundary; or planning explicitly revisits the aggregate baseline or coverage contract using this order's retained evidence."
}
```

## WO-197-D014 — Verification: fail on criteria 1 and 2; criteria 3 to 6 hold

```json
{
  "id": "WO-197-D014",
  "date": "2026-10-07",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on criteria 1 and 2, which the executor recorded unmet and which no waiver or amendment covers. F1 (criterion 1): task-durations.json is complete and exact, but most of its rows carry no per-case durations, and D001 names no case for any task's first growth, because every first crossing predates per-case recording. F2 (criterion 2): target-publish exceeds 22.254 s both in the order's own gate row and alone; worktree-integration exceeds 156.976 s in the gate row and meets it alone; harness-fixtures meets 326.779 s in both. Criteria 3 to 6 are met at code identity 1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8. No further defect was found.",
  "evidence": [
    "F1, against main's own gate store: readGateChecks('/Users/dylanwood/Projects/DotLn') up to the listing's recordedAt gives 369 target-publish, 435 worktree-integration and 320 harness-fixtures task rows since 2026-09-07. These equal the listing's counts, first crossings and last fast rows. Only 53, 53 and 42 of them carry case timings, and the first such row is 2026-10-05T06:12:03.262Z. The first crossings (2026-09-29T22:57:53.942Z, 2026-09-25T05:49:27.867Z and 2026-09-15T19:01:26.135Z) have no case data. worktree-integration's last fast row and first slow row share code identity e070e7f26074..., so that crossing involved no code change.",
    "F2, from the gate row: the npm test row recorded 2026-10-07T21:42:47.615Z (gateSelection review, executionMode fresh, reusedSuites 0, exit 0) at the current code identity records target-publish 129.847 s, worktree-integration 181.029 s and harness-fixtures 289.515 s. Publication and integration each started beside three peers; harness held all four lanes. The 1/5/15-minute load brackets in gate-summary.json are 10.280/10.188/8.123 to 11.791/10.875/8.706 for publication and 12.826/10.720/8.370 to 10.933/10.907/8.904 for integration.",
    "F2, from my own alone runs under harness bounded, one at a time on the 16-CPU host: scripts/test-target-publish.mjs took 105.311 s and passed 56 of 56 tests at 1-minute load 5.127 before and 4.926 after; scripts/test-worktree-integration.mjs took 135.661 s and passed 21 of 21 at 4.926 before and 8.803 after. The executor's alone runs at this identity were 110.683, 134.598 and 285.816 s. Publication misses its ceiling about 4.7 times over at a light load, so host load does not explain that miss. The integration miss appears only in the gate, under heavier load with three peers, and these observations cannot separate it from load, as the order's known issue warns.",
    "Criterion 3: in the three test files, the diff removes two assertion lines and both are restated: the publish-status check moves into seed creation with added PullRequestOpened checks, and the post-release permissions check runs through the real entry point plus one generated-process check. Assertion counts rise from 378, 219 and 1123 to 442, 231 and 1131. Sub-scenarios moved to guardReviewScenario keep their assertions, and the observer's comment classification stays covered by the WO-065 CLI cases. All 42 constants equal the cited cold or whole-suite-alone duration rounded up to 0.1 s. Negative control: a preload that scales performance.now by 5 makes one bounded case per file fail with only its bound message, and the same cases pass at scale 1. My alone runs reached at most 0.524 of a bound; the gate's slowest bounded cases reached about 0.40 to 0.54.",
    "Criterion 5: fnv1a64 in the built compiler matches a separate BigInt oracle on 14,493 inputs, including crypto-random UTF-16 strings, code points 0 to 0x10FFFF in steps of 97, maximum-byte runs and real repository files. All 40 pins in the generated permissions hook equal the oracle's hash of the snapshot files. The case that showed the cost is the WO-132 live-gate matrix, named in D002 and in the hook-cpu row of measurements.json.",
    "Criterion 6 and the rest: npm run format:check passes. git diff --check is clean. package-lock.json changes only the compiler version and its two workspace pins. npm run test:docs passed 29 of 29 fresh tasks twice at this identity, in 102.33 s and then 109.84 s with VER-001 and this decision in place. The npm test -- --review row above is the passing product gate at this identity and was not rerun. Criterion 4: vertical-timing.md matches the vertical-alone row's three slowest of 196 cases, and the cited fixture clock (waitUntil and setTime assign values, and residentIntake calls f.setTime before each host.tick) confirms that none of them waits on a timer.",
    "This verification changed no subject source. In the repository it wrote this decision, the regenerated decisions index, VER-001 and the work-order index the result refreshes. It also added two npm run test:docs rows to the ignored gate index. Its probes ran from DotLn session scratch."
  ],
  "rejected": [
    {
      "option": "Judge criterion 1 met because the complete listing and the prescribed git log queries are recorded",
      "reason": "The criterion requires per-case durations for every row and a named case for each growth. The retained record cannot supply either for the first crossings, and nothing may be inferred in their place."
    },
    {
      "option": "Judge criterion 2 met because of host load",
      "reason": "Publication misses its ceiling about 4.7 times over even alone at a 1-minute load near 5 on 16 CPUs. The known issue covers a load-sized miss, not this one."
    },
    {
      "option": "Pass with the unmet criteria waived in prose",
      "reason": "Only the operator can waive a criterion, through the waive off-ramp with their captured words, or planning through amend-order. Neither exists for this order."
    }
  ],
  "followup": "WO-197 resume: fix, or an operator off-ramp. (F1) A repair names a case or commit range only from executed per-case evidence or a retained row, never by inference. The retained rows cannot name a first-crossing case, so criterion 1 closes only by an operator waiver (npm run resume -- waive 1 with the operator's captured words) or a planning amendment that limits it to the rows that carry per-case timing. An amendment could also accept per-case measurements taken by rerunning the commits on either side of a growth step. (F2) A repair cuts a case's own work or waiting without weakening any asserted behavior. It does not raise a threshold, pack lanes, cut a deadline or loosen a bound after seeing a gate, and it records the gate row and one alone run at the new identity. If the remaining publication time is product work (the order's operator-review assumption 1), criterion 2 stays unmet with these figures for the operator's waiver or planning's re-measure (FUP-edf3b0375b7c0eda). Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair changes any of the three test files or a library they exercise; the operator waives criterion 1 or 2; planning amends either criterion; or a bound added by WO-197 fails in a gate row where that case's functional assertions pass."
}
```

## WO-197-D015 — Resolve the verification findings through the recorded operator waivers

```json
{
  "id": "WO-197-D015",
  "date": "2026-10-07",
  "dispatch": "resume: fix; VER-001 F1 and F2",
  "decision": "Apply the two operator waivers already recorded in the canonical control log, reconcile the executor handoff, and retain criteria 1 and 2 as factually unmet. Preserve the verified implementation and original measurements. Validate the remaining criteria through the required handoff sequence at the unchanged subject.",
  "evidence": [
    "npm run resume --silent -- status --json selects WO-197 in needs-fix, names VER-001, and records criterion 1 waived at 2026-10-07T23:33:14.916Z and criterion 2 waived at 2026-10-07T23:34:18.795Z. npm run resume -- fix records this repair at 2026-10-07T23:35:34.733Z.",
    "docs/control/orders/WO-197.jsonl lines 5 and 6 are the CriterionWaived events. The bounded wo197-repair-validation.mjs entry probe recomputed both ignored captures' SHA-256 hashes and matched them to those events. repair-validation.json records the checks without copying the raw captures.",
    "VER-001 reports no further defect and judges criteria 3 through 6 met. The entry probe observes code identity 1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8, equal to VER-001 and the existing passing fresh review gate. This repair changes records and projections, with no source, test, assertion, duration bound or dependency edit.",
    "The waived gaps remain those in D001, D013 and VER-001: no retained first-crossing case timing; target-publish above its ceiling both alone and in the gate; worktree-integration above its ceiling in the gate. The operator's criterion-2 disposition is recorded judgment, not proof that every possible further optimization is impossible.",
    "npm run release -- prepare --local reports WO-197 target v0.69.1 remains current and refreshes the existing meter snapshot and PR draft. This repair creates no scratch repository and starts no worker or background monitor. The adjacent queue remains revision 5, with adjacent-0001 completed and no next item.",
    "The handoff sequence is npm run format, npm run test:docs, npm test -- --review, then records of the passing observations and npm run resume -- repair-complete. The current review runner composes passing tasks at the same code identity; such reuse supplies correctness evidence and is not a new timing measurement. Handoff-stage observations belong in repair-validation.json."
  ],
  "rationale": "D014 explicitly provides the operator off-ramp for both findings. The canonical waivers and matching captures discharge those obligations without inventing historical evidence, changing thresholds or undoing verified improvements. The stale handoff must reflect the operator's disposition while preserving the factual misses.",
  "goalAlignment": {
    "traps": "Rule beating would relabel the missing timing evidence or measured ceiling misses as met. Scope drift would restart optimization or amend the order after both failure criteria were waived. Keep the unmet judgments, cite the recorded waivers and validate the remaining obligations.",
    "noOp": "Leaving the handoff unchanged would preserve the obsolete claim that no criterion is waived and conceal the current operator disposition.",
    "outcome": "The bounded repair follows the operator's resume: fix dispatch by reconciling the recorded off-ramps and preserving the verified subject. Re-verification remains the next separate dispatch."
  },
  "reopens": {
    "decisionId": "WO-197-D014",
    "observation": "Both operator-waiver reopening conditions occurred after VER-001 was filed. The canonical CriterionWaived events cover F1 and F2, and the bounded repair probe confirms their capture hashes. The associated repair-route follow-up is settled by this disposition; D002's aggregate-baseline planning work remains open."
  },
  "rejected": [
    {
      "option": "Rewrite the failed verification or mark criteria 1 and 2 met",
      "reason": "VER-001 correctly judged its recorded subject and disposition at filing. A waiver changes the obligation, not the underlying evidence."
    },
    {
      "option": "Request the waivers again or amend the acceptance thresholds",
      "reason": "The operator has already recorded both waivers with matching captures. Repeating that approval or editing the order is unnecessary."
    },
    {
      "option": "Restart test-architecture changes to chase the waived ceilings",
      "reason": "VER-001 names no remaining code defect. Further optimization requires a concrete measured cause or the existing planning baseline work, rather than an unsupported change inside this record repair."
    }
  ],
  "reopenWhen": "A waiver capture no longer matches its recorded hash, the operator changes the accepted disposition, independent re-verification finds a defect in a remaining criterion, or a concrete measured cost supports further optimization within newly selected work."
}
```

## WO-197-D016 — Integrate main at fdb205c1 during final review; nothing upstream moved

<!-- integration refs/dotln/checkpoint/WO-197/12 -->

```json
{
  "id": "WO-197-D016",
  "date": "2026-10-08",
  "dispatch": "resume: final review; worktree integrate WO-197",
  "decision": "Integration mechanics are complete in the final-review worktree. Fetched main equals the base, fdb205c1, so the merge moved nothing, no authored conflict arose and no component version collides. The named stash re-applied this order's uncommitted work, and the ignored intake (the two waiver captures) was preserved, with its backup archive verified before integration. The regeneration changed only documents: this record, docs/evidence/WO-197/meta.json, the PR meter and the decisions index. Every source byte equals dispatch checkpoint 11, and the code identity stays 1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8, which VER-002 judged. So VER-002's evidence carries forward unchanged. This review made no source edit.",
  "evidence": [
    "refs/dotln/checkpoint/WO-197/12",
    "base fdb205c1eaedbde7b4ad810746a8411e7410e016",
    "upstream fdb205c1eaedbde7b4ad810746a8411e7410e016",
    "release preparation: WO-197 target v0.69.1 remains current. Files changed: docs/evidence/WO-197/meta.json, docs/final-reviews/WO-197/PR.md. Meter snapshot: docs/evidence/WO-197/meta.json, 4094 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-10-08. Original base: `fdb205c1eaedbde7b4ad810746a8411e7410e016`.
Fetched main: `fdb205c1eaedbde7b4ad810746a8411e7410e016`. Checkpoint: `refs/dotln/checkpoint/WO-197/12`.
Named stash retained: `695b3726910869a2c7104306d92f0f44a1bb9289` (WO-197 integrate 2026-10-08).
Resolved projections: none.
Release preparation: WO-197 target v0.69.1 remains current. Files changed: docs/evidence/WO-197/meta.json, docs/final-reviews/WO-197/PR.md. Meter snapshot: docs/evidence/WO-197/meta.json, 4094 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer. Main did not move, so integration introduced no upstream path. A full-tree comparison through a temporary index against refs/dotln/checkpoint/WO-197/11 (the dispatch checkpoint) and /12 differs only in documents: docs/evidence/WO-197/decisions.md, docs/evidence/WO-197/meta.json, docs/final-reviews/WO-197/PR.md and docs/lineage/decisions-index.md, plus the control log, docs/control/current.md and the work-order index against checkpoint 11. gateCodeIdentity, run bounded, returns 1641987c5cc467978750209176252c09c126cd9f1a17b7eeecc5e5be40ba5aa8. Criteria 3 to 6 carry forward on VER-002's evidence. Criteria 1 and 2 remain unmet and are waived at ordinals 5 and 6; both capture hashes still match their events. This review's own gates judge the integrated subject.
Authored conflicts observed: none.
Affected checks were printed by the command (npm test -- --review, npm run publication:check, node scripts/harness.mjs check, npm run release -- check-surfaces --local) and executed by this review, as FINAL-001 records.
