# WO-199 FINAL-001 — final review

**Verdict:** fail. WO-199 repairs the vertical's recovery path: a writer launched through the vertical records its process group, an interrupted `dotln vertical` stops its writer and resumes on rerun, and a host refusal after a writer's result names its check. Criteria 1, 3, 4 and 5 hold at this subject. Criterion 2 does not, because of one blocking defect that escaped the executor's review and both verifications:

- **A terminal Ctrl-C can become the writer's test result.** After the writer finishes, the source host runs the focused test synchronously, for up to 180 s. A terminal Ctrl-C kills that test, and the host survives the signal because of the new listeners. The killed test is then recorded as the writer's after-test result, `testAfter {exitCode: null, signal: "SIGINT"}`, and the step completes with that receipt. In the order's own CLI fixture, the command then **exited 0 and the issue resolved**, because the CLI removed its listeners before Node delivered the signal. With HEAD's signal disposition, the same subject dies by SIGINT in 3 ms, leaves `source-change` pending, and its rerun records the genuine passing test ([D013](../../evidence/WO-199/decisions.md#wo-199-d013--final-review-fail-on-a-terminal-signal-recorded-as-the-writers-test-result-criterion-2s-exit-clause-unmet)).

The order returns to `resume: fix` with D013's repair rule. FUP-9e32c0d0868c29c7 carries that rule in the register.

**Subject:** [`docs/work-orders/WO-199-the-vertical-survives-an-interrupt.md`](../../work-orders/WO-199-the-vertical-survives-an-interrupt.md) on branch `wo-199`, uncommitted over `main` at `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, so integration merged nothing.

- The gate code identity is `e86d7a74c5ea939a4c937b4614f16334d841fc6caf862bc4187ee3087abedfc6`, the identity VER-002 passed and the executor's review row covers. No source byte changed after VER-002.
- The recorded `reportHash` of VER-001 and VER-002 each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.69.2)`; the five criteria are the original text.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.294","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. This session reproduced every claim the verdict rests on, so no worker was needed.

**Process cost:** entry 88504 tokens; handoff 21505790 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 79f3d1a1-00fe-481d-bce5-257ba9f351c0`.

- Entry was observed at 2026-10-08T16:20:11.531Z.
- Handoff was observed at 16:45:55.923Z, after 121 steps and 113 commands. It counts 21,131,390 cached input, 271,607 cache-write, 230 uncached input and 102,563 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Reasoning tokens and dollar cost are unavailable.
- Wall clock to handoff was about 26 minutes. The three exploratory probe runs took about 2 min 10 s each, mostly waiting on a timeout the first probe draft left uncleared. Each committed rerun took 11 to 14 s.
- Tradeoff: `npm test -- --review` (about 22 min at the executor's last run) was not rerun. A fail verdict needs no reviewer gate row, and the passing review row at this unchanged identity stands for criterion 5. The repair will need a fresh gate in any case.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-199/FINAL-001.md`.

Read in full: the order; VER-001 and VER-002; this order's D001 to D012 (D009 to D011 in detail); `handoff.md`; the existing `PR.md` draft; product 07 §Verification review and attack and its final-review routing; and product 08 §PRs and commits.

Read in part: `reviews.md`, searched for the synchronous-child case.

Reviewed: the complete implementation diff (`source-change-host.ts`, `worker-transport.ts`, `host-lock.c`, `dotln.ts`, `vertical-host.ts`, `repair-host.ts`, `feedback-audit.ts`, `vertical-transport.mjs`, `vertical-primitives.mjs`, `vertical-runtime.mjs`, `evidence-sources.mjs`, `test-runner.mjs`), the test diffs, the new regression file's CLI case, both new fixtures, and the manifest, README and edition changes.

Lenses, and why:

- State recovery: interruptions now cross durable records.
- Operator flow: Ctrl-C is the commonest stop.
- Authority: recovery signals a recorded group.
- Release surfaces: final review is acceptance.

Integration: `npm run worktree -- integrate WO-199` fetched `main` equal to the base. It stashed and re-applied the work and regenerated only documents. [D012](../../evidence/WO-199/decisions.md#wo-199-d012) records the carried-forward claims and the affected checks, all of which pass. No authored conflict arose, and no component version collides: v0.69.2 and skeleton 0.55.1 remain current.

## Criterion judgments

**Criterion 1:** met

The agreed probe at this identity (`node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`, 2026-10-08T16:43:41Z–16:43:47Z, exit 0):

| Case | Recorded group | Outcome |
| --- | --- | --- |
| crash-vertical | 45468 | recovered `observed` |
| crash-direct | 46701 | recovered `observed` |
| revoke-vertical | recorded | `SourceChangeProcessStopped` and `WorkerInterrupted` recorded |

The four cases, including a rerun that stops a surviving writer group through recovery, are regressions in `source-change-integrity.test.ts` and the `vertical` row's `scripts/test-vertical.recovery.mjs`. Both run in the passing `npm test -- --review` row at this identity (2026-10-08T05:53:55.360Z, exit 0). VER-002 executed them independently.

**Criterion 2:** unmet

The live-writer case holds. `WO-199 dotln vertical forwards SIGINT, SIGTERM and SIGHUP and resumes the same issue` passes in the review row. VER-002 reproduced it: exits 130, 143 and 129, the group absent within 10 s, the recorded signal, and an immediate rerun reaching `resolved`.

The criterion's exit clause fails in the writer's own `source-change` step once the writer has returned. The probe signals the running command's process group, as a terminal Ctrl-C does, while the host runs its synchronous post-result focused test. The command exits 0, and the step completes with the killed test as its result instead of staying for a rerun. F1 has the rows.

D009 bounded criterion 2 to a live writer because the `WorkerInterrupted` record needs one. The exit clause has no such condition, and this step is the one that started the writer.

**Criterion 3:** met

The integrity suite asserts `host-admission-effect` for a dirty post-result tree and for the one-commit host-message check. It asserts `host-admission-receipt` for a failed receipt save, with no `WorkerInterrupted` and no `SourceChangeObserved`. Both run in the review row, and VER-002 added a post-result authority-expiry variant (`host-admission-authority`).

F1 adds a different case, by source: when a terminal signal kills a git command inside that admission, the interruption is recorded as a host refusal. That belongs to F1's repair rule. Criterion 3 governs genuine host refusals, and those hold.

**Criterion 4:** met

The feedback 002 live episode ran on `codex-cli-exec`, `gpt-6.1-sol`, effort `max`, from 05:26:59.675Z to 05:27:42.964Z. That is after the last judged-source edit VER-002 observed (05:23:16.332Z), and no source changed since. At this identity:

- `npm run evidence:feedback -- --check` reports that feedback 002 judged the current source, with ten passing regressions and ten removal failures (16:43:50Z, exit 0).
- `authority-evidence.mjs --check`, `artifact-identity-evidence.mjs --check` and `verification-evidence.mjs --check` each pass (16:46:23Z–16:46:24Z, exit 0).
- `docs/evidence/current.json` selects WO-199 feedback 002, and revision 001 for the other three families.

A repair that edits `source-change-host.ts` must rerun the live episode after its last judged-source edit.

**Criterion 5:** met

- The write-backs land in place: the skeleton README's vertical paragraph and compiler prerequisite, the root README's `v0.69.2` claim, D001 to D013 and the regenerated decisions index. One README sentence is false for F1's case, and D013's repair item 4 corrects it.
- FUP-627ec3088bb86e62 (D065) and FUP-5f8a48126bb022be (D060) are `settled` onto this order's decisions. VER-001's FUP-cc617fd589d944e4 is `settled` onto D010.
- The `npm test -- --review` row at this identity passed (2026-10-08T05:53:55.360Z, exit 0, 38 rows). `npm run test:docs` ran inline at this report (under Executed checks).
- `git diff --check` is clean.
- No dependency was added: the manifests and lockfile change only the skeleton's `0.55.1` version and the console's pin to it.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "blocking", "class": "escape", "summary": "A terminal Ctrl-C during the source host's synchronous post-result focused test is recorded as the writer's testAfter and the step completes; in the order's CLI fixture the command exits 0 and the issue resolves (criterion 2 unmet; main stopped at once)"}
]
<!-- dotln-findings:end -->

**F1 — a terminal signal during the post-result admission becomes the writer's result (blocking, escape).**

How it happens:

- `dotln vertical` now listens for SIGINT, SIGTERM and SIGHUP, so a terminal Ctrl-C no longer ends the host.
- The source host's post-result admission is fully synchronous: `checkIntegrity`, `tree.verify` and `tree.effect`, then `observe` with `runFocusedTest` (`spawnSync`, up to 180 s), the receipt save and `SourceChangeObserved`. While it runs, no JavaScript listener can run.
- Ctrl-C reaches every process of the foreground job, including the focused test, which shares the host's process group.
- `runFocusedTest` returns the kill as a result instead of throwing (`source-change-worktree.ts:611-624`).
- `observe` records it as `testAfter`, saves the receipt and closes the command. VerticalHost then keeps the completed step's receipt, as D010 designed for a step that returned despite the signal.

The committed probe ([`final-001-post-result-signal-probe.mjs`](../../evidence/WO-199/final-001-post-result-signal-probe.mjs) with [`final-001-slow-test-preload.mjs`](../../evidence/WO-199/final-001-slow-test-preload.mjs); rows in [`final-001-observations.json`](../../evidence/WO-199/final-001-observations.json)) works as follows:

- It uses the order's CLI actor doubles and runs the built CLI in its own process group.
- It delays only the post-result focused test, then sends SIGINT to the whole group 500 ms into that test.
- The detached writer group is not signalled.
- Each variant ran alone under `harness bounded`, exit 0:

| Variant | Window (UTC) | After the signal | Run state | source-change `testAfter` | Rerun |
| --- | --- | --- | --- | --- | --- |
| subject | 16:41:29–16:41:40 | exit 0 after 3193 ms | `resolved` | `signal: SIGINT`, receipt completed | exit 0, same receipt |
| HEAD disposition (new listeners dropped) | 16:41:40–16:41:54 | killed by SIGINT after 3 ms | `source-change` pending | none recorded | exit 0, `exitCode: 0`, `resolved` |
| subject with diagnostics | 16:41:54–16:42:05 | exit 0 after 3249 ms | `resolved` | `signal: SIGINT` | exit 0, same receipt |

The diagnostic listener logged `handled SIGINT; dotln listeners present 0` and `exit code=0 exitCode=undefined`. The fixture's later steps never let the event loop poll, so Node delivered the signal only after `runVerticalIssue` returned and `dotln.ts`'s `finally` had removed its listeners. `stop()` never ran. Three exploratory scratch runs gave the same outcomes.

Reach, by source and not probed:

- **Outward:** `target-publish.mjs:1117-1118` passes `testAfter` into the target PR body. `github-body.mjs:757` prints "Focused test observed by the host: … after it", which renders this case as `signal SIGINT`. Readiness checks only that the field is present (`github-body.mjs:618-619`).
- **False failure:** a test runner that traps the signal and exits non-zero records a failure indistinguishable from a real one.
- **Sealed refusal:** a git command killed in `checkIntegrity` records a permanent `unreadable` integrity finding, and `refuse("shared-repository-unreadable")` seals the issue on rerun. A git command killed in `tree.verify` or `tree.effect` records `SourceChangeRefused host-admission-<check>`, which the rerun replays as refused.
- **Witness tests:** a killed snapshot witness test (`verification-worktree.ts` `witnessTest`, up to 30 s) records `unavailable`, or `fail` under a trapping runner, in a completed witnesses receipt.
- **Production, inference:** with real model judgments, the next asynchronous episode would let the signal through, so the command would stop there non-zero. The killed test would remain the writer's recorded result. A signal during a run's final synchronous stretch is lost, as in the fixture.

Route and class:

- **Blocking twice over.** Criterion 2's exit clause is unmet. The change also breaks behavior `main` had, shown by the HEAD-disposition probe: Ctrl-C ended the command at once and never recorded a result the signal caused. This matches VER-001 F1's route.
- **Escape.** The defect is present at the identity VER-002 judged, inside the instructed scope of criterion 2 and D009's rule that a signal ends the run "in every step." The executor's repair review found the thrown-failure form of this race and fixed it (`reviews.md:28`, VerticalHost's loop turns before it classifies a failure). The returned-result form, where `runFocusedTest` turns the kill into data, escaped it and both verifications.

Repair rule: [D013](../../evidence/WO-199/decisions.md#wo-199-d013--final-review-fail-on-a-terminal-signal-recorded-as-the-writers-test-result-criterion-2s-exit-clause-unmet) `followup`, summarized:

- No durable record, receipt or step result carries a child outcome the signal produced. The step stays pending, and the rerun re-observes the committed result.
- The same holds for snapshot witness tests.
- A pending signal is delivered before the CLI removes its listeners and before a step result is recorded.
- The README sentence is corrected.
- Regressions: the committed probe's case for all three signals, and a witness-test case.
- The live episode reruns after the last judged-source edit.

## Follow-up register

`npm run plan -- followups --touching` lists 16 pending rows by textual match. This review disposes none:

- The change opens none of their seams.
- No reopening condition occurred.
- ER4-006's 10% threshold was measured: repeated `authority.json` bytes are 4.13% of `docs/evidence` (7,870,330 of 190,454,247 bytes, tracked and untracked).
- WO-123 D044 item 3 (a return-kill sealed as refused) concerns the resident's return policy, which this order does not change.
- FUP-88c339c51cfc1933 is this order's own D011 board.
- D013 mints FUP-9e32c0d0868c29c7, which the repair settles.

## Release surfaces

The release-note edition is not prepared, because a failing review publishes nothing. `PR.md` remains the executor's draft, and the integration regenerated its meter. The next passing review rewrites both under product 08 §PRs and commits.

## Executed checks

Each probe and check ran alone. Probes ran under `node scripts/harness.mjs bounded`, at code identity `e86d7a74…`.

| Check | Window (2026-10-08, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `npm run worktree -- integrate WO-199` | 16:20 | 0 | no-op merge; D012 |
| Exploratory post-result probe, three variants | 16:28:24–16:39:37 | 0 | F1, mechanism isolated |
| Exploratory run aborted before signalling (`ps` keyword unknown on macOS) | 16:31:57–16:32:04 | 1 | no result; the bounded wrapper stopped its leftover CLI, confirmed absent |
| Minimal deferred-signal check (`spawnSync` under a listener) | 16:31 | 0 | listener runs after `spawnSync` returns |
| Committed probe: subject, HEAD disposition, diagnostics | 16:41:29–16:42:05 | 0 | F1 table |
| Agreed WO-112 recovery probe | 16:43:41–16:43:47 | 0 | criterion 1 table |
| `npm run evidence:feedback -- --check` | 16:43:50–16:43:53 | 0 | current |
| `npm run publication:check` | 16:43:53 | 0 | pass |
| `node scripts/harness.mjs check` | 16:43:54 | 0 | 33 surfaces |
| `npm run release -- check-surfaces --local` | 16:43:55 | 0 | pass |
| `authority-evidence.mjs`, `artifact-identity-evidence.mjs`, `verification-evidence.mjs --check` | 16:46:23–16:46:24 | 0 | current |
| `git diff --check` | 16:46 | 0 | clean |
| `npm run format`, then `npm run test:docs` | 16:47:55–16:49:22 | 0 | 29 passed, 0 failed, 86.01 s, 29 fresh tasks |

Repository writes: this report; D012's completion and D013; the committed probe, preload and observations; and the regenerated decisions index, follow-up register, meta and work-order projections. No implementation source was edited. Scratch probes ran from the DotLn session scratch directory, against disposable system-temp fixtures that the fixture's own cleanup removed.

Goal alignment:

- **Traps:** deferring to two passing verifications; widening F1 into D061 or D044; patching the judged source host in review.
- **NoOp:** passing would ship v0.69.2 with a vertical that can record and publish an operator's Ctrl-C as the writer's test outcome.
- **Outcome:** matched. The criteria were judged from probes at the subject, F1 is reproduced and committed with its repair rule, and the work is preserved uncommitted for the repair.
