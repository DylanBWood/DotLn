# WO-112 — repair of VER-003

This executor receipt addresses VER-003 F1–F3 under `resume: fix`, with
[D035](decisions.md#wo-112-d035--repair-the-three-ver-003-classes-without-changing-historical-run-evidence)
and the bounded adjacent repairs in D036–D037, evidence preparation in D038,
and validation repair in D039. It is not an independent
verification verdict. Filed VER reports and the two successful historical
live proof runs retain their bytes. The required repair checks below pass.

## Repaired rules

| Finding | Rule | Cases beyond the quoted counterexample |
| --- | --- | --- |
| F1 | Host Git reads ignore replace refs and commit-graph, so the accepted commit's actual tree and parents determine admission. | A checksummed forged graph tree that hides an outside-surface file, and forged ancestry on an unrelated root commit, both with local configuration enabling the cache. |
| F2 | An immutable receipt replays its already verified effect without judging unrelated later shared-state changes. Recovery still confirms termination and the same candidate commit/diff. An unreceipted attempt retains fresh integrity checks and durable failed verdicts. | A host SIGKILL after receipt publication followed by created, deleted and symbolic refs; changed candidate branch still refuses; unchanged tests and one launch/observation on replay. |
| F3 | Retryable triage makes no durable decision. Body judgment stays absent and inline triage remains pending. A typed retry error crosses production resolution without a terminal step receipt; a fresh invocation can finish without repeating earlier steps. | Interrupted, unavailable and untyped episodes; invalid-result and profile-refused retain human decisions; production restart and unchanged replay. |

The review-body adjacent repair re-observes after judgment, before selecting
another item or stopping. Changed body text, a changed PR head, a newly added
inline item and unsettled declared checks must appear in the terminal subject.
An unchanged acknowledgement still reuses its subject-bound verdict.

The source-writer adjacent repair revokes its command route/profile at durable
settlement, before host admission and after-testing. Local cleanup is idempotent
and finally still handles earlier failures.

## Executable evidence

- The original VER-003 counterexamples reproduced before edits in the bounded
  `verification-003-probes.mjs` run: 15.364 s, cutoff
  2026-10-06T17:57:32.446Z. They are synthetic counterexamples, not live PR runs.
- Initial host/integrity validation: 29 passes and one fixture failure in
  58.325 s. The forged-parent fixture wrongly assumed `rev-list --count` would
  use its planted parent. It now creates an unrelated root commit, forges its
  graph parent with consistent generation levels, and checks cached versus
  uncached ancestry. The corrected tree/parent regression passed in 2.349 s;
  the bounded graph/route probe took 5.530 s, cutoff
  2026-10-06T18:16:02.145Z. The failed fixture run receives no passing claim.
- Direct triage retry/non-retry and body-disposition validation: 14 passed,
  zero failed, bounded duration 136.413 s, cutoff
  2026-10-06T18:11:10.092Z. This preceded the production-consumer and
  terminal-observation additions; their current focused validation passed as recorded below.
- Before those additions, the root bounded probe reproduced a stale terminal
  body observation and a production refusal on both runs of interrupted
  triage: 11.664 s, cutoff 2026-10-06T18:13:36.440Z (D036).
- The original verifier probe script rerun on the repaired source: 12 rows,
  15.115 s, cutoff 2026-10-06T18:24:41.295Z. F1 is not accepted (actual committed
  tree/index mismatch); all three receipt-crash variants replay observed with
  one launch; all four transient triage variants reach the second episode.
  VER-002 shared-ref, unsafe-alternates, failed-attempt and changed-body cases
  retain their refusals or fresh judgments. [Projected rows](repair-003-observations.json)
  label the old probe flag subset explicitly; the filed script remains unchanged.
- The writer-lifetime probe returned `observed` with the command grant still
  present at `afterResult`, after durable settlement (D037). Its repaired lifetime is covered by both native selections
  in the passing source-host checks below.
- Expanded loop checks: 17 passed, zero failed, 147.779 s; production resolution
  checks: six passed, zero failed, 81.783 s. The two sequential suites ran under
  one bounded guard in 229.705 s, cutoff 2026-10-06T18:22:11.547Z. Production
  interrupted, unavailable and untyped failures leave resolution pending, release
  locks and resume to resolved without repeating prior step receipts; invalid
  returns/profile refusals remain terminal human decisions.
- `npm run publication:check` passed with 29 and 45 source sections current.
  Local release preparation retains application v0.68.0; no extra bump is needed.
- Final source-host/integrity checks: 30 passed, zero failed, 55.361 s. The
  normal build and suites ran under one bounded guard in 56.683 s, cutoff
  2026-10-06T18:27:07.847Z. Both native selections assert route and profile absence
  after settlement, before admission; host after-tests still pass. Crash recovery,
  failed integrity verdicts, hostile refs/alternates and descendant cancellation
  also remain passing. Both queued adjacent items are completed.
- Evidence revision 007 generated for all four selected families in 5.199 s,
  cutoff 2026-10-06T18:28:50.740Z. Feedback records ten present passes, ten
  removal assertion failures and 1,192 fewer matched instruction bytes. Revisions
  001–006 are retained. The live audit is recorded below; the current console
  capture follows that sealed edition.
- Final read-only order/diff adversary: no supported new correctness defect;
  both original boundary observations addressed. Its two nonblocking coverage
  suggestions passed focused validation: failed-dispatch command-route/profile
  absence at integrity adjudication, and resident scheduling through triage
  interruption and restart. Both checks passed in 18.553 s including build,
  cutoff 2026-10-06T18:34:09.338Z. No new production-source edit was needed.
- Fresh live feedback audit: complete, ten passing fixtures and 1,192 saved
  matched instruction bytes, 23.226 s, cutoff 2026-10-06T18:36:08.506Z. Native
  `claude-cli-print`, selected `claude-opus-5-5`/`xhigh`, 600-second timeout and
  USD 5 CLI cap. Selection is a launch claim; effective child settings are unknown.
  This audit follows the final judged-source edit.
- The material inventory shows eight retained repository units, all explicitly
  declared preserve, none undeclared. Products 06/12 remain byte-identical to
  verifier-entry checkpoint 12.
- Audit recording, harness emission, current console recording/checks and all
  four evidence checks passed in 7.396 s, cutoff 2026-10-06T18:37:17.248Z. The
  live feedback check confirms that revision 007 judges the current source.
  The console JSON, terminal and HTML fixtures match; prior capture history remains.
- Historical preservation readback: all 114 selected historical files from
  `refs/dotln/checkpoint/WO-112/14` match the current working bytes, cutoff
  2026-10-06T18:45:38Z, including evidence revisions 001–006, VER-001–003 and the
  historical live-run/outward receipts. The comparison used checkpoint blob
  identities and working-file blob identities, including originally untracked
  retained files.
- The first current-source `npm test -- --review` failed: 37 suites passed and
  vertical exceeded its 900-second bound; 88 fresh tasks, 1666.338 s, cutoff
  2026-10-06T19:06:32.320Z. It is not a passing claim. D039 moves the complete
  WO-112 intake/triage section to an explicit second test file while keeping
  every assertion and the same deadline; the runner reserves two scheduler
  slots for two isolated file processes.
- The moved file passed all 17 tests in 166.454 s, cutoff
  2026-10-06T19:24:58.436Z; the runner fixtures passed all 100 tests in 67.484 s,
  cutoff 2026-10-06T19:26:05.920Z. The first relocation check exposed a missing
  `ResidentStore` import, corrected before this run. The check helper later
  named a nonexistent artifact checker; that command failure is not a product
  failure or a passing aggregate run, and the corrected checks ran separately.
- An isolated probe confirms that editing only the new test file or only its
  shared fixture changes the real gate code identity, both command files remain
  required, and the moved section is byte-identical. It and all four current
  evidence checks passed in 5.757 s, cutoff 2026-10-06T19:27:51.302Z. Revision
  007's live audit still judges current source. The final diff adversary found
  no remaining supported correctness defect; seven unused old-file imports
  are removed within D039's declared paths.
- Planning check passed with the authorized order amendments and current
  follow-up allocation.
- The fresh full review rerun passed all 38 suites, zero failed, and all 88
  tasks ran fresh: 1832.577 s, cutoff 2026-10-06T19:59:51.438Z, code identity
  `ed9c6d7b095bb1b90cbaabb76f2f8ca1e52f6029e29c0f5a3d2b565a047ba4ef`.
  Source identity and build output stayed unchanged. Vertical passed in
  832.55 s within the unchanged 900-second bound. The overall rerun took
  longer than the failed selection; no total-time saving is claimed.
- `npm run test:docs` passed all 29 checks, zero failed, 29 fresh tasks,
  104.753 s, cutoff 2026-10-06T20:02:47.056Z, at the same current code identity.
  `git diff --check` is clean. Adjacent-0009 is completed with all three
  declared passing checks; no queued or running item remains. The deferred
  object-preservation item retains its named follow-up.

## Boundaries

Commit-graph supplies cached commit tree/parent data, so disabling it is part
of judging actual object content. This follows Git's public
[commit-graph format](https://git-scm.com/docs/gitformat-commit-graph) and
[configuration reference](https://git-scm.com/docs/git-config). Pack indexes
and [multi-pack indexes](https://git-scm.com/docs/gitformat-pack) locate objects;
they do not supply a separate cached tree/parent interpretation. The host does
not request bitmap-index traversal. This is an assessment of the host's named
Git calls, not a claim that every writer-writable Git auxiliary file is safe.

The D033 shared-object preservation gap and
FUP-fadd2376e82a909e remain explicit. These repairs do not preserve pre-existing
loose or packed object bytes against a native writer. The process-group
termination and Git files-ref-backend limits also remain. Historical live
proof is carried forward; this repair does not manufacture a new live PR run.
