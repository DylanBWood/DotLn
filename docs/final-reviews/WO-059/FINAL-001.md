# WO-059 — FINAL-001

**Verdict:** fail. Criterion 3 is unmet. The adapter does what the other criteria ask: on the tree integrated with `main`, the final product gate passed with the browser suite included, and VER-002's evidence carries forward unchanged. But recovery can SIGKILL a process the adapter never started. `recover()` checks root ownership only when the record lists processes. Given a record with `browserPid` set and `processes: []`, it adopts whatever process now holds that pid and kills it. `runScenario` writes exactly that record when its first observation after launch misses the browser. I reproduced the kill against the worktree's own build: a `/bin/sleep` whose parent was not the recorded owner was signalled and died with SIGKILL. A reviewer does not write and certify a behavioral fix, so the finding returns to repair ([D017](../../evidence/WO-059/decisions.md#wo-059-d017--final-review-finding-recovery-can-sigkill-a-process-the-adapter-did-not-start)). Five minor defects are recorded for the same repair or a follow-up ([D018](../../evidence/WO-059/decisions.md#wo-059-d018--final-review-minor-adapter-defects-recorded-for-the-repair-or-a-follow-up)). So is Receipt 036's known issue, which no decision disposes of ([D019](../../evidence/WO-059/decisions.md#wo-059-d019--final-review-finding-receipt-036s-known-issue-has-no-recorded-disposition)). The integration with `main` is complete and stays in the worktree for the repair: D015 and D016.

**Subject:** [`docs/work-orders/WO-059-playwright-evidence-adapter.md`](../../work-orders/WO-059-playwright-evidence-adapter.md) on branch `wo-059`, uncommitted. The original base is `60eeecdccc3f3717da492a7416435d2227639bc5`. The integrated base is fetched `main` at `2210dd87c5b017edcf144980e5657b1349e6a53b` (WO-175, v0.58.2). The dispatch checkpoint is `refs/dotln/checkpoint/WO-059/9`, and the integration checkpoint is `/10`.
- The verification sequence is complete. [VER-001](../../verifications/WO-059/VER-001.md) failed on F1: the missing-browser remedy installed into the wrong cache. A `resume: fix` repair followed, and [VER-002](../../verifications/WO-059/VER-002.md) passed at code identity `a40d6c24…` (checkpoint 7).
- Both reports hash to the `reportHash` in the control log (`ebb73bed…` and `5eaacf60…`).
- Between checkpoint 7 and checkpoint 9, only VER-002, the control log, `current.md` and the work-order index changed.
- The order's text differs from `main` only in its heading's `(v0.59.0)` label (D003). I judged the original nine criteria.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Dispatch: `resume: final review`. The operator made no choice about the verdict. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Fan-out plan, stated before the first spawn: one read-only subagent out of the 20 available. Its job was an adversarial review of the adapter source, read from the checkpoint ref so the integration could not move its subject. The harness observed 1 admission and 19 remaining. The subagent found D017's defect and most of D018. I confirmed D017 with my own reproduction and checked each D018 item against the source before recording it. The live feedback verifier in D016 is a CLI subprocess under its own 600 s and USD 5 caps, not a subagent.

**Process cost:** entry 86073 tokens; handoff 17725119 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 1aaf90d1-5726-4f1d-bede-82518ba92e06`. The entry reading was observed at 2026-10-01T01:02:33.018Z. The handoff reading was observed at 01:21:55.226Z, after the decisions were written and before this report, `test:docs` and the result transition. It counts 17,412,289 cached input, 248,425 cache-write, 204 uncached input and 64,201 output tokens over 106 steps and 97 commands. Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. The subagent's completion notice reports 146,706 tokens of its own over 847 s. The counter does not say whether it includes them, so they are named here and not added. The live feedback episode's tokens and dollars are not exposed by its store, so they are unknown.

The largest waits were the product gate (401.22 s) and the subagent (847 s), which ran in parallel with the integration, the re-mint and the gate. Tradeoff: the subagent's cost bought the verdict. My own read of `processes.ts` had passed over the empty-list branch.

## Goal-aligned judgment

WO-059 is gate F's producer: WO-123 sequences browser witnesses before verification. The question for this review was whether the adapter can run on an operator's host safely, and produce admitted evidence, through a green binding gate on the integrated tree.

- **Rule beating** decided the verdict. The SIGKILL fixture passed in five runs because Chromium exited by itself when its host died. `recoverySignalledPids` is `[]` in every committed transcript, so the kill path was never judged. VER-001's reaper probe exercised it only with a correctly recorded root.
- **Tragedy of the commons:** the host's process table is shared, and recovery must not take from it what it did not start. That is criterion 3's second clause.
- **Drift to low performance:** two passing verifications and a green gate do not lower the bar for a reproduced safety violation.
- **Seeking the wrong goal:** the goal is a recovery that cannot harm a bystander, not a passing kill fixture.
- **Shifting the burden:** the fix belongs in the adapter, not in a caller's discipline about when to recover. D019 names the per-worktree browser install, which every later gate session inherits.
- **Escalation and Naive Interventionism** bound the response to one guard and two regressions in the package. Witness, replay and admission code stays as verified, and no gate or role text is added.
- **Policy resistance:** the integration used the stale-edition checks as they are. D016 re-minted feedback through a live episode rather than relax a check.
- **Success to the successful:** neither branch's newer feedback audit was preferred by recency; both were checked and both refused.
- **NoOp** publishes nothing. Publishing as is would ship a recovery that can SIGKILL an arbitrary process after pid reuse.

## Criteria

**Criterion 1:** met. The browser-evidence suite passed in this review's gate on the integrated tree (15.68 s), including `installed pinned browser produces all five kinds admitted from a VerificationOpened subject`. Its source, fixtures and test are byte-identical to VER-002's subject. Main changed no compiler, verification-protocol or adapter file. VER-001 and VER-002 judged the dispatched capsule, the admitted citing result and the retained trace on these bytes.

**Criterion 2:** met. The console-error case passed in this review's gate. The `fail`-first ordering in `evidence()` and the compiler's `copySubject` refusal are unchanged since VER-002. Limit, recorded in D018: a failed `console.assert` is mapped to `log`, so it does not refuse a pass. The criterion is judged by its console-error page, which uses `console.error`.

**Criterion 3:** unmet. The fixture's outcome holds: the host-kill case passed in this review's gate, with an empty after-set and a live sentinel. But the criterion also says that "a process the adapter did not start … is outside the set", and the code admits one into the set and kills it. See [Finding F1](#finding-f1--recovery-can-sigkill-a-process-the-adapter-did-not-start).

**Criterion 4:** met, carried forward from VER-002. Its cross-session replay hashes equal the executor's original and repair transcripts for all five files. `fixtures/replay-fields.json` is unchanged, and the `saved-replay` case passed in this review's gate.

**Criterion 5:** met. The kernel, compiler and skeleton manifests gain no dependency. On the integrated tree, the skeleton manifest changes only its version (0.47.1 → 0.47.2, D015). `license-surfaces` passed in this gate and in `release check-surfaces --local`, including the adapter's publish refusal. `docs/LEGAL.md` is byte-identical to VER-002's subject, and `NOTICE`, `LICENSE` and `scripts/license-surfaces.mjs` are unchanged against `main`. The no-connected-server case passed in this gate.

**Criterion 6:** met. The `missing-browser`, `fresh-worktree-install-remedy` and `default-caller-install-remedy` cases passed in this review's gate. VER-002 followed the printed command with a real download into a fresh copy, and the code is unchanged since. Limit, recorded in D018: every launch failure is reported as a missing browser. The result is still `unavailable` with no pass.

**Criterion 7:** met. The write-backs are byte-identical to VER-002's subject, with one exception: I replaced the capability-table row's "independent verification pending" with a link to VER-002's pass, and dropped "verifier/final-review dispatches remain separate". Once merged, those clauses would have been false. Product 03 still adds 279 bytes over `main`'s copy. `npm run publication:check` passes with both locks current. The decisions file holds D001–D019, and the index lists them.

**Criterion 8:** met on the integrated tree. The authority, artifact-identity and verification editions at WO-059/001 pass their checks after the merge, so they are carried. Feedback WO-059/001 went stale on main's `entropy-review-protocol.ts`, and main's WO-175/001 on this order's Playwright lockfile entries. D016 established that the new report differs from revision 001 only in its audited subject hash. It then recorded revision 002 from one live self-host episode on Claude Code `claude-opus-5-5` at `xhigh`, one of the two configurations the criterion admits:
- harness 2.1.286 and selection source `host-launch`; effective model and effort unknown;
- both verifier criteria pass;
- `feedback-evidence --check` reports that it judged the current source.

`current.json` selects WO-059/002 for feedback, and the console self-host case is re-pinned to it. All six edition suites and `console` passed in this gate.

**Criterion 9:** met at the integrated subject:
- `npm test -- --review` passed: 38 suites, 0 failed, 401.22 s, 82 fresh tasks, code identity `5224924043eb843bb9213f25b50fb242a9e8413ff7549d52d9f205d77733a61e`, tree `119da99c`, recorded 2026-10-01T01:16:59.989Z.
- `git diff --check` and `git diff --cached --check` are clean.
- Against `main`, the lockfile adds only the workspace link, `packages/browser-evidence` 0.1.0, `playwright` 1.63.0 and `playwright-core` 1.63.0, plus the two skeleton 0.47.2 entries.
- `npm run test:docs` passed with this report and D015–D019 in place: 24 suites, 0 failed, 35.77 s.

## Finding F1 — recovery can SIGKILL a process the adapter did not start

**Class:** safety, criterion 3. **Severity:** major. **Route:** repair, then fresh verification ([D017](../../evidence/WO-059/decisions.md#wo-059-d017--final-review-finding-recovery-can-sigkill-a-process-the-adapter-did-not-start)).

- **Mechanism.** Three parts of `packages/browser-evidence/src/processes.ts` combine:
  - **Ownership check (lines 105–117).** The check requires a recorded root whose parent is the owner, and a closed tree. It is guarded by `record.processes.length &&`, so an empty list skips it.
  - **`observeOwned` (lines 35–50).** With no recorded root identity, it seeds from `browserPid` and adopts the current holder of that pid and its descendants.
  - **Kill loop.** It then SIGKILLs every adopted process whose just-observed identity matches, which it always does.
- **How the adapter writes the record.** `index.ts` sets `browserPid` from `browserServer.process().pid`, then its first `recordNow()` saves whatever `observeOwned` found. If the browser has already exited, the file holds `{browserPid: N, processes: [], closed: false}`. A host kill before the `finally` block leaves it on disk, and pid reuse before the next `recoverFrom` completes the trigger. The 250 ms ticks seed the same way during the run.
- **Reproduction.** I used the worktree's built `dist/src/processes.js`. The host spawned `/bin/sleep 300`, whose parent was the host, not the recorded owner. It wrote that record shape with an owner identity that matches no process, and called `recover()`. Result: `signalled: [<sleep pid>]`, the sleep exited with `SIGKILL`, and the record was rewritten as `closed: true` with the sleep as its only process. The script is in this session's scratch.
- **Why the gates missed it.** No committed fixture reaches the kill path. The trigger is narrow, but the effect is an arbitrary process killed on the operator's host. The README promises that recovery "signals only matching identities in its browser set".
- **Rule a repair must hold.** Recovery never signals a process outside a recorded tree rooted at a recorded root identity whose parent is the recorded owner. A record with `browserPid` set and no recorded root is refused, or signals nothing. During the run, `observeOwned` does not adopt the current holder of `browserPid` before the root's identity is recorded. Two regressions are required:
  - an unrelated live child under that record shape stays alive and unsignalled;
  - one case reaches the kill path with a recorded surviving process, so `recoveredPids` is non-empty at least once.
- **Re-mint.** `processes.ts` and `index.ts` are not registered edition or feedback sources (VER-002 checked the edition source lists). D016's feedback revision stays current unless the repair changes the lockfile.

## Other findings and follow-up dispositions

**Minor, for the repair or a follow-up ([D018](../../evidence/WO-059/decisions.md#wo-059-d018--final-review-minor-adapter-defects-recorded-for-the-repair-or-a-follow-up)).**
- **Owner identity depends on the environment.** `ps` inherits `TZ`. I checked that `lstart` prints `Thu Oct  1 01:20:14 2026` under UTC and `Wed Sep 30 21:20:14 2026` under New York for the same pid. Recovery under another `TZ` therefore signals nothing and still marks the record closed.
- **A failed `console.assert` passes.** It is mapped to `log`.
- **The console witness shares its live array.** Its entries are the listener's own array, so a late message would change them after hashing.
- **The SIGKILL fixture never reaches the kill path.** Its sentinel also sits where no faulty recovery could reach it.
- **Every launch failure is reported as a missing browser.**

**Receipt 036 ([D019](../../evidence/WO-059/decisions.md#wo-059-d019--final-review-finding-receipt-036s-known-issue-has-no-recorded-disposition)).** The catalog row asks the executor to record how a missing browser is handled. The behavior meets that: `unavailable` witnesses and a failing suite, never a silent pass. But no decision records the disposition or weighs its cost. The suite's cache is the ignored per-worktree `.runtime/playwright`, so every new worktree's first gate fails in `browser-evidence` until the printed install runs. Operator-review assumption 2 accepts a gate session installing the browser, and the receipt's reopening condition did not occur in this order's gates. The repair records the disposition.

**Register.** `npm run plan -- followups --touching` listed 12 pending rows by textual match. None names a seam this change opened or a condition that occurred, so all are left. `npm run meta` adds D017–D019's follow-ups to the register as this order's rows.

| Row | Matched | Disposition | Why |
| --- | --- | --- | --- |
| FUP-7629e03c6573f5cb | runner | left | The executor staged the new package before each gate. VER-001 and VER-002 matched their gate identities, so no row missed a new source file. |
| FUP-fb8cbeabbddef397 (ER4-005) | runner | left | The gate's recurring cost against closed history. This order adds a per-feature suite (about 16 s), not history-dependent cost. |
| FUP-adf6621e7f958dd8 (ER4-006) | authority edition, product 03, `evidence-editions.mjs` | left | `scripts/authority-evidence.mjs` is untouched. The 141 tracked `authority.json` copies total 6,797,043 of 159,046,292 tracked `docs/evidence` bytes (4.3%), below the 10% condition. |
| FUP-e821aa2ced3aa111 | runner | left | TAP selection for suites started through `node()`. This order adds a `nodeTests` row and opens no named consumer. |
| FUP-439252e49f6381fc, FUP-e34029d1192ce82e | runner | left | Document-maintenance and guard-fault decisions for the planner. Untouched here. |
| FUP-b28b870422a74166 | `docs/LEGAL.md` | left | A planner decision about reused rows and excluded inputs. Every gate in this order ran fresh after the LEGAL edit, and `release-surfaces` rechecks it in `test:docs`. |
| FUP-b7a66e7a4fa7ad20, FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb | decisions, meta, `current.md` | left | Release preparation, the integrate helper, the byte-proof writer and usage attribution are untouched. |
| FUP-e55e258d37cb3f20, FUP-fd05316b6030ef73 | product 03, README, index | left | The 03 edit is one paragraph in §Ports. The follow-up feed and the standing writer text are untouched. |

## Integration with `main`

`npm run worktree -- integrate WO-059` ran as follows:
- It checkpointed `/10` and retained the include-untracked stash `27b28dd0…` (`WO-059 integrate 2026-10-01`).
- It fast-forwarded the uncommitted branch from `60eeecdc` to `2210dd87`, then re-applied the stash.
- No ignored intake file existed, so no backup was needed.

Two authored conflicts were resolved:
- `docs/evidence/current.json` keeps WO-059's selection.
- `packages/console/fixtures/manifest.json` keeps WO-059's pin and both capture sentences. Main's change to it was confined to the conflicted hunks.

The skeleton version collided. Both sides had bumped the skeleton to 0.47.1, which v0.58.2 published with WO-175's change, so the merge was clean but one version would have named two sources. I retimed WO-059's compatible patch to 0.47.2, with the console's exact pin and the two lockfile entries. `release check-surfaces --local` confirms it, and v0.59.0 remains the target above v0.58.2.

`--continue` regenerated these:
- the runtime and the harness bundle (31 surfaces);
- the control projection, index, meta and publication locks;
- the selected console fixtures.

It also wrote the draft D015, which I completed with the bases, the resolution, the retime and the carried-forward claims.

Carried forward: VER-002's criteria 1, 2, 4, 5, 6, 7 and 9 rest on bytes identical to its subject, re-run in this gate. Criterion 8 was re-established by D016. Criterion 3's fixture result carries forward; the finding above is new.

## Executed checks

| Check | Result |
| --- | --- |
| `npm test -- --review` (integrated tree) | 38 passed, 0 failed, 401.22 s, 82 fresh; identity `52249240…`; `browser-evidence` 15.68 s |
| `authority-evidence`, `artifact-identity-evidence`, `verification-evidence` `--check` (WO-059/001, integrated) | exit 0 |
| `feedback-evidence --check`: WO-059/001, then WO-175/001 | both stale (protocol source; lockfile) |
| `feedback-evidence --write --edition WO-059 --revision 002` | only `subject` differs from 001 |
| Live `feedback-audit`, `claude-cli-print`, `claude-opus-5-5`, `xhigh` | exit 0, 39.41 s; both verifier criteria pass |
| `feedback-evidence --record-selfhost` / `--check` (002) | recorded; judged the current source |
| `console-fixtures --record-current-selfhost` / `--check` | recorded; refutations and missing match |
| `npm run release -- check-surfaces --local` | pass; skeleton 0.47.2 over v0.58.2's 0.47.1; v0.59.0 |
| `npm run publication:check`; `node scripts/harness.mjs check` | pass; 31 surfaces |
| `npm run test:docs` (report in place) | 24 passed, 0 failed, 35.77 s |
| `git diff --check`; `git diff --cached --check` | clean |
| F1 reproduction against the built `recover()` | unrelated `/bin/sleep` signalled and killed |
| `TZ=UTC` vs `TZ=America/New_York` `ps -o lstart=` | different strings for one pid |
| Report hashes vs control log | VER-001 and VER-002 match |

Result route: `final-review-result fail`. The next dispatch is `resume: fix`. The repair must hold F1's rule. It may fix D018's items within its bound, and it records D019's disposition. The integrated tree, D015 and D016 stay in the worktree, so the repair starts from `main` at `2210dd87`. Nothing is committed or published by this review.
