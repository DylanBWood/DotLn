# WO-112 — repair of VER-005

This executor receipt addresses VER-005 F1–F3 under `resume: fix`, with
[D047](decisions.md#wo-112-d047--close-the-ver-005-classes-at-their-origin-one-judgment-failure-rule-admission-gated-preparation-and-own-registration-recovery).
It records execution, not an independent verification verdict. Filed reports
and the historical live proof runs keep their bytes.

## Why the order kept failing verification

Of the eight blocking findings in VER-003 to VER-005, four came from the
repair just before them: VER-003 F2 (D027), VER-004 F1 and F2 (D036) and
VER-005 F2 (D041). A fifth, VER-005 F1, is VER-004 F1's class left in place on
the intake path. The decision to retry a failed judgment, hold it or stop was
made in six places: `judgmentRetryable`, `modelIntake`, two review-loop sites,
`VerticalHost` and the resident. Each repair changed the one site its report
quoted, and the failure moved to the next consumer. This repair moves the
decision to where the failure happens. A fresh adversary attacked it before
handoff, and a delta review followed.

## Repaired rules

| Finding | Rule the repaired code holds | Cases beyond the quoted counterexample |
| --- | --- | --- |
| F1 | `runVerticalJudgment` marks only an episode's own launch or return failure, for both tasks. Model intake is transient only on that marker. A refused return, or a verdict the host could not record, holds the draft with its reason, so no fault buys another episode. Any other intake failure is a named host fault. The resident retries it at most three times, counted apart from transient failures, then holds it with its reason; the command reports it without recording. A record another entry linked first is replayed. Retention and scratch cleanup never replace an episode's outcome. Replay resolves no transport. A held reason names no local path. | Refused return through the resident, held after one episode. Interrupted episodes stay unbounded (six in 40 s). A corrupt-JSON record. A concurrent link after two interrupted episodes, admitted. Replay faults after two interrupted episodes, held only after three more faults. Unnamed failures after transient refusals. Retention failing for a refused and an interrupted return. Cleanup failing after a good verdict, admitted. Command replay of an unrecordable verdict, refused-return retention and missing opt-in, none relaunched. Replay without the opt-in, for intake and triage. An unreadable record and a failing scratch init, each held with no path. |
| F2 | A resident tick prepares no draft that `intentAdmissionReady` already refuses for its state, which includes a deferred continuation holding the slot. | The second draft is prepared again once the first run resolves and admission reopens. |
| F3 | Checkout recovery removes only its own `input-tree` registration (`git worktree remove --force --force`), never `git worktree prune`. | A stale registration whose directory is gone, an operator-locked stale registration and a valid detached worktree are all left untouched. The checkout's own registration is cleared even when a kill during `add` left it locked. |

Triage dispositions are unchanged, with two deliberate exceptions. A recorded
triage verdict now replays without the live-worker opt-in: the opt-in gates
launching a model CLI, and replay launches none. A cleanup failure no longer
discards a returned verdict. Product 03 stays accurate and unedited. No
schema, dependency, scheduler or remote effect is added.

## Executable evidence

- **Diagnosis, from the filed reports.** VER-005's I1, I2, D1 and P1 rows
  record the defective outcomes that these regressions refuse. Opt-in missing
  and an unwritable record each produced six preparations and no hold (the
  unwritable record also spent six episodes). The second draft was prepared
  four times during deferral. The moved worktree lost its registration.
- **Git behavior.** A scratch probe on Git 2.55.0 showed that
  `worktree remove --force` on the run's own missing registered path removes
  only that registration.
- **First edits.** The two unchanged vertical suites passed 182 tests with
  zero failures in 645.4 s, cutoff 2026-10-06T23:38:38.495Z.
- **Pre-handoff adversary.** One fresh `dotln-worker`
  (`claude-opus-5-5`, `xhigh`, no override; 129,484 tokens, 29 tool uses)
  read only the order and the repair diff. It executed probes showing four
  defects in that first diff:
  - a link race after two interrupted episodes held the draft;
  - a failed retention replaced the classified error;
  - replay needed the opt-in and was then held;
  - held reasons recorded local paths.

  All four are fixed with the regressions above.
- **Delta review.** The same worker (165,249 tokens, 14 tool uses) re-ran its
  probes. All four findings were fixed, and it found no Medium or High
  defect. It reported three Low items:
  - a scratch-init failure could hold a path: fixed;
  - triage replay without the opt-in: recorded as deliberate, with a
    regression;
  - a pre-existing wording item: deferred, see below.
- **Non-vacuous cleanup case.** A probe confirmed that `rmSync` throws
  `ENOTEMPTY` for a read-only subdirectory under uid 501.
- **Final targeted run.** On the rebuilt subject, 13 tests passed under one
  bounded guard, cutoff 2026-10-07T00:11:48.976Z: every D047 regression, plus
  the opt-in, refused-return and replay tests.
- **VER-005's own probes, rerun unchanged.**
  `verification-005-adversary-probes.mjs` ran on the final code under one
  bounded guard.
  - I1, missing opt-in: 3 preparations, 0 episodes, then held with its reason.
    Filed result: 6 preparations, no hold.
  - I1, unwritable record: 1 preparation and 1 episode, then held with
    `intake record could not be written: EACCES`. Filed result: 6 and 6, no
    hold.
  - I1, unnamed contrast: unchanged.
  - I2: the probe calls `prepare` directly and prints only `transient: true`.
    That refusal is a bounded host fault. Through the resident, the
    `record-unbinding` matrix case holds it after three preparations with no
    episode.
  - D1: the second draft is prepared 0 times. Filed result: 4. Forge calls
    during the deferrals fall from 40 to 24. The remaining 24 are the first
    run's own triage retries re-observing its pull request.
  - P1: the moved worktree stays registered, and its `git status` reads
    `M  a.txt`.
- **First full gate: failed.** `npm test -- --review` failed 33 of 38 suites
  in 4.82 s at a shared preflight. The feedback evidence was stale because
  `vertical.ts`, a judged path, had changed. D041/D042 touched no judged
  path, so their gates never needed this audit.
  [D048](decisions.md#wo-112-d048--re-mint-evidence-revision-008-after-d047s-judged-source-edit)
  re-minted revision 008 for all four families with one live self-host audit:
  `claude-cli-print`, `claude-opus-5-5`, `xhigh`, 76.1 s, `phase: complete`.
  All 18 regeneration and check steps exited 0, from
  2026-10-07T00:15:37.193Z to 00:17:10.784Z.
- **Second full gate: passed, then unusable.** `npm test -- --review` passed
  38 suites with zero failures in 1,863.232 s at code identity
  `cb9e6a12f62d16cf8e14a0c5c073b33710236b8c3a3ea89e8da744aa3f23dd54`. The
  document gate run after it failed on Prettier, so this row judges bytes
  that no longer exist. See the executor error below.
- **Document gate.** After whitespace-only formatting, `npm run test:docs`
  passed 29 of 29 in 107.13 s, recorded 2026-10-07T00:54:36.239Z. Every
  touched file passes `prettier --check`, and all four evidence families
  check current.
- **Third full gate: passed, and current.** `npm test -- --review` passed
  38 suites and 88 fresh tasks with zero failures in 1,841.600 s,
  `forced-fresh`, recorded 2026-10-07T01:25:24.048Z, at code identity
  `58450a151c11d06f2d92e0c9a894a71e287fb258357c3eedcc169c8b40173740`. The
  vertical file took 842.89 s of its unchanged 900-second deadline; it took
  823 s at repair 004. The new regressions cost about 20 s, and the remaining
  headroom is a reopen condition in D048.

## Executor error — INEXCUSABLE FAILURE

The executor ran the 31-minute review gate before the 2-minute document gate,
and without running the repository's formatter on the files it had edited.
The document gate's Prettier task then failed on
`packages/skeleton/src/vertical-judgment-host.ts` and
`scripts/test-vertical-judgment.mjs`. The formatting fix changed the code
identity, so the review gate had to run a third time. **1,863.232 s of the
operator's time was lost.**

This is the same mistake recorded in WO-164, WO-148, WO-146 and WO-158. Earlier
in this session, the first review gate also started before the 6-second
evidence checks it depends on, and failed in 4.82 s. A lesson written into an
order's own receipt has not stopped the repeat.
[D049](decisions.md#wo-112-d049--inexcusable-failure-the-31-minute-review-gate-ran-before-the-2-minute-document-gate-again)
therefore files a high-priority follow-up for a mechanical guard,
FUP-3799fb396f911d8a, left open for planning. Under it, the review gate runs
the formatter and evidence checks first, and refuses to start its suites when
either fails.

The correct order, used for the third gate: format every edited file, check
the evidence families, run `npm run test:docs`, then run
`npm test -- --review`.

After the third gate, a document-gate run failed once in its `resume` check,
at `scripts/test-off-ramps.mjs:787`. The same bytes passed three isolated
reruns, and the fixture copies no file this repair changed.
[D050](decisions.md#wo-112-d050--record-an-intermittent-off-ramp-checkpoint-assertion-met-in-the-document-gate)
records it with follow-up FUP-032190d84be0c2f0; the cause is not diagnosed.

Failed intermediate checks get no passing claim. A suite run on the
pre-delta code was stopped once its subject was superseded. Its file-level
mark is `cancelled 1`, not an assertion failure. Two draft assertions were
corrected before their first run:
- a newline-suffixed worktree match, because `fixtureGit` trims its output;
- a temp-directory absence check, because the fixture's own paths
  legitimately live under tmpdir.

## Preserved scope and follow-ups

- **Follow-ups.** VER-005's blocking follow-up, FUP-51b7739810ca1a2c, is
  allocated to WO-112. The pre-existing wording item is deferred under
  FUP-b8440605da5a4eb2 with D046's triage counterpart: a replayed record that
  fails result validation is labeled an episode failure.
- **Other open items.** D046's five boarded items (FUP-7c269a184f75e742),
  D043, D044, D033 and D018 remain open as recorded.
- **Unchanged.** No live PR run was made and no retained scratch repository
  was created. The release target stays v0.68.0, re-prepared locally.
- **Evidence revision.** Revision 008 is selected for all four evidence
  families. Revisions 001–007 are preserved.
- **Economy.** D002 remains the order's only economy experiment
  (declined, kept-current); no saving is claimed.
- **Subagents.** One subagent of the cap of 20 was used, reused once for the
  delta review, with no descendants.
