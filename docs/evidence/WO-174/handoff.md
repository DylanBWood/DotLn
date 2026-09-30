# WO-174 executor repair handoff

Dispatch: `resume: fix`, repairing VER-001 F1 on executor base
`dd141ad16dbd60e39ffb5afab21df57689cf4b79`. Local application patch target:
`v0.58.1` (D017). Actor: `codex-cli` 0.159.2, `gpt-6.1-sol`, effort `max`,
source `codex-session-readback`. [Repair evidence](repair.md) records the
consumer correction, two new regressions, negative controls and committed-copy
integration. The work-order branch remains uncommitted.

The repaired rule: every tracked consumer of the renamed console fixture
helper uses its lazy API, and regeneration validates the manifest snapshot it
writes or renders. `loadFixture` accepts the generator's draft explicitly and
retains lazy default loading; the guarded package imports read no manifest.

**Criterion 1:** met — the current npm test row passes all four guarded product package tasks; their latest logs each contain zero excluded-read observations. The guard's required fs forms, async/nested attribution and inherited/reduced-env children are unchanged and their runner fixtures pass. D005, D008, D010 and non-node-commands.md retain the native-command inventory and observation boundary.

**Criterion 2:** met — guard-drill.md and VER-001 retain the named docs-input rejection and the old-source negative fixture. The guard and runner fixture are unchanged by repair; current runner-fixtures passes.

**Criterion 3:** met — document-drill.md and VER-001 independently reproduce the unchanged identity, red re-tagged kernel case in npm run test:docs and passing product package suites. Repair does not change product 02, the kernel tags or gateCodeIdentity; current kernel product and document tasks pass.

**Criterion 4:** met — guard-drill.md, D006 and VER-001 retain old-list failure, named uncovered entry/import/literal-script pairs, reasoned exclusions and the stated transitive/computed boundary. The closure and declarations are unchanged by repair; current runner-fixtures passes.

**Criterion 5:** met — harness-drill.md and VER-001 retain the failed-row wait mutant, harness-fixtures selection and the failing evidence-wait case. The harness, its fixture and declarations are unchanged by repair.

**Criterion 6:** met — costs.md and D011 retain the three isolated before/after selections, measured suite durations and the 502.535-second harness increase, with the two exclusions and the reasons neither is applied. Repair changes neither those declarations nor the three selected source paths.

**Criterion 7:** met — costs.md retains product review 402.242/396.299 seconds and document gate 16.144/36.323 seconds before/after, the 43 existing retags (kernel 2, compiler 0, skeleton 22, console 19) and the 0.249-second paired console guard overhead. Repair adds two document regressions, not retags. Its current review/document observations are 396.516/35.268 seconds, with no controlled performance claim.

**Criterion 8:** met — the original product 07 Discipline edits remain +333 bytes, within 400; decisions.md and the decisions index include the repair choices and local retiming. close-register.md corrects ER4-001's at-close settled scope to guarded package suites (D016), preserving D013's script-suite remainder and D014's fixture-overlay input. ER4-001 and ER4-002 remain allocated until the order's specified close; no early close is claimed.

**Criterion 9:** met — npm test -- --review --again passes 37 suites / 81 fresh tasks in 396516 ms, recorded 2026-09-30T20:00:31.034Z at code identity 617f10c1852188fe21ac2085485e9442dc43be9a78fc72becab38b09d9db2cf1; npm run test:docs passes 24 suites / 24 fresh tasks in 35268 ms at 2026-09-30T20:06:11.760Z. F1's committed-copy worktree-integration passes in 296.47 seconds, and every generator mode passes there. Both new cases pass and both scratch negative controls fail as intended. git diff --check is clean; dependency manifests and product runtime source are unchanged. Completion checks the document gate against this finalized handoff.

Evidence: [repair](repair.md), [guard drill](guard-drill.md),
[document drill](document-drill.md), [harness drill](harness-drill.md),
[costs](costs.md), [child commands](non-node-commands.md),
[decisions](decisions.md), [close register duty](close-register.md).

D012's document-gate performance investigation remains pending under
FUP-fb8cbeabbddef397. D013's script-suite input-coverage remainder remains
FUP-b28b870422a74166; D014's committed-input fixture remainder remains
FUP-dc1335f4d10f6a75. These recorded planning inputs are outside F1's repaired
consumer regression; this handoff does not claim either class closed.

The specified Node fs/inherited-child observation set, native-read limits and
direct machinery-closure limits remain explicit. New source files remain
untracked until final review; this repair used --again and changed no code
thereafter. The single economy experiment D002 is retained. Verification and
final review remain separate dispatches.
