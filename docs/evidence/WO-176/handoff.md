# WO-176 repaired executor handoff

Release close now recomputes lane classifications and accepts a recorded
explicit declaration only for its originating worktree and unchanged repository
state. A repository that gains a commit or uncommitted files after completion
stays undeclared when its current lane does not authorize disposal. A changed
keep declaration also stays undeclared in a scratch lane. Subject declarations
and unscoped close flags cannot decide a derived worktree's repository.

Before removing disposable repositories, cleanup retains self-contained
bundles of every stored commit, including unreachable commits. It imports and
checks each bundle in an empty repository and records its path and digest;
failure retains the source. Preserved repositories remain directory units with
collision and byte checks. Combined, quoted, worktree-scoped retry commands
settle all undeclared units without repeating publication.

Publication and cleanup remain separate. Partial publication distinguishes a
newly pushed tag from a tag already published. Record read/write failures advise
without replacing the real publication result or error. Derived inventory
failures retain that worktree and allow settlement to continue. Writer, gate,
tracked-dirt, symlink and preservation protections remain in place.

**Criterion 1:** met — `fixtures.md`: fresh lane-disposable preview/removal with a recoverable bundle, other-lane retention with declaration/retry commands, and intact intake preservation; changed and foreign repositories stay retained.
**Criterion 2:** met — `fixtures.md`: both actual executor completion commands record declared, lane and undeclared rows without refusing unknown material; explicit rows bind worktree and repository state; unfiled local words cannot change the committed handoff.
**Criterion 3:** met — `fixtures.md`: disposable, preserve, unknown and multiple-unknown release cases prove cleanup, preserved contents, bundle recovery and executable scoped retries with one publication; commit, dirt and stale-keep mutations retain the source.
**Criterion 4:** met — `fixtures.md`: clean, blocked, preview, refusal, no-release and partial-publication cases check actual dispatch values, publication state, per-worktree cleanup, current material, overrides, recovery and remedies; I/O failures preserve the true result and earlier attempts remain recorded.
**Criterion 5:** met — product 07 cleanup paragraph adds 40 bytes within the 500-byte allowance; guide is 157,209 bytes within its 157,212-byte ceiling; release-close row names the record; decisions/index refreshed; the two original register rows retain their recorded retargeting dispositions.
**Criterion 6:** met — `checks.json`: current complete `npm test -- --review` passed all 39 suites in 785.925 seconds with 84 fresh tasks; `npm run test:docs` passed all 24 suites in 35.538 seconds. Both canonical rows name the repaired code identity. No dependency, component manifest or lockfile changed; both diff checks are clean.

Application release v0.60.1 is prepared locally. Component source and versions
are unchanged. The current authority, artifact, verification, feedback and
harness evidence checks passed on this repair; no live feedback episode was
introduced. The initial deterministic-remint cost remains in `remint-cost.json`.

The bounded adjacent repair covers inaccurate remedies and cleanup records,
partial publication, nonfatal record I/O, derived inventory containment,
repository-directory lane rules, dispatch/outcome assertions and comments that
explain behavior. Decisions D026–D032 record the choices and corrections.
Receipt 036's recovery duty is discharged by the bundles and post-removal clone
checks. Moved-main retry validation and concurrent/unbounded attempt history
remain deferred to FUP-da471832071118c7, with the contract and reopening
conditions in D029. The initial browser/build fixture repair remains complete.

The first real close after merge is still unobserved. The linked-pair real
harness fixture remains FUP-8cfd3ff52146a016, an explicit non-goal. The protected
intake repository gate-tree limitation remains FUP-bf51ac5cd8143d98; cleanup
created after a reviewed gate is covered. No withdrawn order exists on a branch
at the earlier recorded check, so that route keeps its retargeted condition.

Actual executor attestation: codex-cli 0.159.3, gpt-6.1-sol, effort max, source
codex-session-readback. Final usage is observed before repair completion and
kept in the ignored session receipt and response; unavailable cost stays
unknown. Verification and final review remain separate dispatches.
