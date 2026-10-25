# WO-204 repair handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The repaired source integrates fetched main `28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9` under the operator's `scope expand: integrate latest main` instruction. The canonical procedure retained checkpoint 6 and its named stash, found no authored conflict, and retimed the unpublished minor release to **v0.99.0** (D030). The filed [VER-001](../../verifications/WO-204/VER-001.md) is byte-for-byte preserved.

The final `npm test -- --review` passed **43 suites, 0 failures, 109 fresh tasks and no unrun tasks** at code identity `b2d8653a7f8444a0a3ea4fcdb7e6b1fc93eda249f784d6e343e4e4bd9857c5a6`. The 1952.522-second run finished at 2026-10-25T18:05:59.222Z, with unchanged code identity and build output. The final document gate must judge this completed handoff before `repair-complete`; fresh verification and final review remain separate dispatches.

**Criterion 1:** met — The source host cleanup matrix removes the route after a previously removed profile, records revocation and returns without throwing. Both transports pass the focused cases in `source-change-host.test.ts`.

**Criterion 2:** met — The two independent unlink orders and interrupted variants record each surviving path as `CommandCleanupFailed`, attempt the other removal, and refuse admission before after-tests. The matrix checks settlement, integrity and interruption event order for Claude and Codex.

**Criterion 3:** met — Persistent unlink failure ends in a typed refusal naming the surviving grant, with no `SourceChangeObserved`. The same matrix covers both grant types and both transports.

**Criterion 4:** met — Restart reattempts the surviving unlink before a candidate can be observed. The host matrix and the vertical retry case in `scripts/test-vertical.mjs` pass; D015 records the vertical command's pending-state correction.

**Criterion 5:** met — Every cleanup matrix cell asserts that no after-test or admission occurs while either grant survives; the complete skeleton and vertical suites pass.

**Criterion 6:** met — The committed-byte cases refuse modified, deleted and mode-changed tracked paths bearing `skip-worktree` or `assume-unchanged` before after-testing, without restoring a file or clearing the flag.

**Criterion 7:** met — Unflagged byte and mode drift refuses. Unchanged tracked symlinks, dangling symlinks and gitlinks admit; changed targets and file/symlink type changes refuse before after-testing. Both transports pass these cases in the current complete skeleton suite. The original clean-entry reproduction also passed during repair (D031).

**Criterion 8:** met — Verification worktree tests plant replace refs, commit graphs and hooks paths and compare the judged commit, tree and blobs to clean Git reads. Divergent real trees refuse publication. The added private-store layout guard rejects planted alternates, commit graphs and symlinked storage before private Git reads; the older forged-tree and forged-parent attack now pins that typed refusal and candidate preservation (D033, D037). All pass in the current complete gate.

**Criterion 9:** met — Interrupted and unreceipted source recovery still passes with committed-tree checking. The retained-candidate matrix now tracks a symlink through cleanup and interruption recovery for both transports, preserves its target, and observes the candidate with one writer dispatch (D037).

**Criterion 10:** met — D001 records the original shared-object deletion counterexample and the expected base failure of the new process-level Codex case. The repaired Claude and Codex confinement cases run the deletion inside the writer double after commit, refuse it, preserve the independent sibling blob and produce no SourceChangeObserved. The current complete gate passes both.

**Criterion 11:** met — The writer's commit is private before host import. Both transport confinement cases deny the writer's shared-object deletion; source host tests check private-only candidate objects.

**Criterion 12:** met — The host verifies and imports an admitted candidate before publishing its episode ref and records CandidateImported before SourceChangeObserved. Mismatched import verification leaves the ref unchanged. Strict private-object integrity and layout checks reject shadow objects and auxiliary metadata. Settled unimported candidates retain their HEAD, index, objects and files while their saved backlink keeps shared reachability working (D014, D032, D033).

**Criterion 13:** met — Crashes before import and after import but before ref update recover with one import and one ref update. The added saved-receipt cases recover and finish an already imported candidate without hiding its registration or redispatching the writer (D036); the complete gate passes both transports.

**Criterion 14:** met — The original maintenance cases preserve objects during the live private-HEAD window and verify them around import and publication. The repair additionally makes log --all, rev-list --all, fsck, repack -ad, gc --prune=now and explicit worktree prune succeed after a settled admission refusal, attention hold, cleanup refusal or interruption. Both transports preserve private-only candidates and recover the retryable cases. The pre-settlement availability limit remains explicit in D004 and D032.

**Criterion 15:** met — `writer.test.ts` exercises the Codex and Claude Git configuration controls on rerere-enabled linked worktrees. The configured commits exit 0 without an `rr-cache` or maintenance child; the Codex control without its `GIT_CONFIG_*` pairs exits 128.

**Criterion 16:** met — Writer launch tests pin private object environment entries, the two Git configuration pairs and the narrowed grants. The Codex arguments carry object-directory entries beside `PATH`; the Claude environment carries the same entries. The common objects, refs, logs, `packed-refs.lock` and `rr-cache` are not granted to the writer.

**Criterion 17:** met — Both transports cover blocked, failed and requiresHuman envelopes before effects, after-tests, import or branch publication, including replay after WorkerResultObserved without redispatch. Held candidates remain private; the recorded SourceChangeCandidateRetained inspection command works and shared Git remains usable. Completed and no-commit controls keep their distinct outcomes.

**Criterion 18:** met — Vertical tests map source and repair writer attention to `NeedsHuman` with the episode, status and `requiresHuman` in the receipt, while other source refusals remain `refused`.

**Criterion 19:** met — The `dotln vertical` operator-path recovery case kills a writer before commit, observes a pending source-change continuation and interruption without a signal, then reruns to one branch commit under the same command and one `SourceChangeRequested`.

**Criterion 20:** met — The complete vertical recovery suite and both transport confinement cases pass at the final code identity. The retained WO-112 final-001-vertical-recovery-probe also passed during repair at 2026-10-25T17:07:30.486Z (7.125 seconds).

**Criterion 21:** met — [The Codex qualification](codex-writer-qualification.json) records a passing installed-CLI sandbox phase: configured add and commit exit 0, forbidden common/hooks/outside writes are denied, the network error differs from the unsandboxed control, and the config-free commit exits 128. D016 records the corrected unified-log calibration against every printed control denial, including Git denials.

**Criterion 22:** met — The second and final allowed Codex live episode used selected `gpt-6.1-sol`/`max` on CLI 0.164.0, completed with no attention request, and recorded `git commit -F` exit 0, a private-only candidate, `CandidateImported` before `SourceChangeObserved`, and only one expected `<common>/packed-refs.lock` denial. It took 47.554 seconds and reported 136,535 tokens. The first episode's unavailable denial reader and the later setup failure remain in the record with D008–D011; the setup failure launched no writer. Effective provider model settings were not independently read back.

**Criterion 23:** met — [The Claude qualification](claude-writer-qualification.json) records one passing live episode on selected `claude-opus-5-5`/`xhigh`, CLI 2.1.310: a completed writer, private-only commit at the host's after-result point, no changed shared Git path or `rr-cache`, then import and observation. It took 32.625 seconds and reported 79,597 tokens. Effective provider settings were not independently read back.

**Criterion 24:** met — Product [architecture](../../product/03-architecture.md), [execution guide](../../product/07-execution-guide.md), the [skeleton README](../../../packages/skeleton/README.md), and [decisions](decisions.md) carry the in-place write-backs. Architecture now describes private-store admission and retained-candidate inspection/recovery. D030–D038 record the authorized main integration and repair. The original allocated follow-ups remain settled onto D010/D011; the verification findings are addressed by D031–D034 and the measured handoff below. Publication locks and checks pass. Earlier evidence editions and the filed VER-001 are preserved.

**Criterion 25:** met — The complete review passes 43 suites and 109 fresh tasks with zero failures at the identity above; it covers the declared Preflight gate claims under the handoff contract. git diff --check and npm run publication:check pass. Selected evidence is authority WO-204/006, artifact-identity WO-204/001, verification WO-204/001 and feedback WO-204/003; regeneration checks all current. The selected feedback audit judged the final production source, with ten passing regressions, ten removal failures and 1,192 fewer instruction bytes. Test-only corrections followed without changing that judged behavior. The final npm run test:docs row must judge this completed handoff before repair-complete consumes it. Skeleton remains 0.69.0 with console's matching internal pin; no external dependency was added.

## Repair evidence and limits

- **F1:** committed entries are judged by type. The clean-entry and drift cases pass for both transports; recovery also retains an unchanged tracked symlink. See D031 and D037.
- **F2:** after writer settlement, an unimported candidate keeps its HEAD, index, objects and files while the host saves its registration backlink under a pruning lock. The durable inspection command works. All five ordinary shared Git commands pass, candidates remain private, and cleanup/interruption recovery admits once and finishes. See D032.
- **F3:** unsupported private-store metadata refuses before host reads with `private-object-layout`, leaving the planted material intact. Both transports and the forged-graph controls pass. See D033 and D037.
- **F4:** all four omitted cost measures are recorded below and in D034/D038.

D036 fixes the additional imported-receipt recovery defect found during repair. D004's live window remains: an abrupt host death after a private commit and before settlement can interrupt shared reachability until recovery. This repair covers settled outcomes; it does not claim uninterrupted shared maintenance during a live writer. D017's probe-setup recording and D018's batched import-query improvements remain recorded follow-ups. No criterion is waived.

The Codex and Claude writer qualifications in criteria 21–23 are carried from the original implementation. Repair changed host admission and retention, not those writer launch arguments, environment entries or write grants. No extra writer qualification episode was spent. The feedback audits were refreshed in immutable revisions 002 and 003; revision 003 is selected and current. Its native verifier used selected Codex `gpt-6.1-sol`/`max`; effective provider settings were not independently read back.

## Review history

The original implementation's two fresh read-only Codex workers used separate criteria-adversary and design-improver briefs:

self-review: found 5; fixed 3; recorded 2 — D014–D016 record private-object shadowing, vertical cleanup retry and denial-calibration fixes. D017–D018 retain probe-setup recording and repeated per-object import queries as nonblocking follow-ups. The prior executor attested two requested `gpt-6.1-sol`/`max` workers and no reported descendants; the host counter did not independently observe their admission.

This repair used separate root review passes over entry types, retention/recovery, private-store admission and the integrated tests. No new collaboration review agents were spawned; the repair role does not require the implementation-ready fan-out. The named verification findings were repaired, the additional saved-receipt defect was fixed, and the stale graph assertion was replaced with a specific earlier-refusal check. D036–D037 retain the stopped gate, failed complete gate and bounded setup failure; none supplies a passing claim. D021–D025 remain the original implementation's history.

## Cost and alignment

The final complete row supplies these task times:

| Task | Seconds | Reference |
| --- | ---: | --- |
| Skeleton | 418.632 | 1.444 × the order's 289.9-second thirty-day median; below 2 × |
| Vertical workflow | 263.217 | Current split task |
| Vertical statements | 355.611 | Current split task |
| Vertical judgment | 503.398 | Longest current task; prior single-task reference 725.851 seconds |
| Vertical recovery | 302.870 | Current split task |

The vertical reference is one prior gate task, not a measured thirty-day median. The [measurement record](repair-costs.json), produced by [repair-costs.mjs](repair-costs.mjs) on the synthetic vertical fixture, covers five complete clean checks over three tracked blobs each. Whole clean checks took 61.260–78.677 ms. All fifteen separately timed `cat-file` reads took 9.049–12.244 ms, without path sampling. One admitted three-object candidate import took 94.412 ms. The implemented import uses pack-objects/index-pack plus verification, not fetch. No measured clean check or import exceeded one second.

The complete gate took 1,952.522 seconds including 0.991 seconds waiting for host lanes. This excludes the stopped 58.411-second run, failed 453.820-second run, focused probes, evidence generation and live audits. No equivalent-outcome cost baseline was measured. Usage accounting uses `harness usage` at dispatch scope; final counters stay in ignored receipts and the completion response. Dollar cost, wrapped command count and any unobserved agent remainder are unknown.

**Goal alignment:** matched. Clean tracked entry types now admit, drift still refuses, settled unimported candidates preserve shared Git and inspection, and recovery remains single-dispatch. Main was integrated with recovery material intact. The release remains local and unpublished at v0.99.0, with skeleton 0.69.0 and the matching console pin.
