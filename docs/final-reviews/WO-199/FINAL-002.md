# WO-199 FINAL-002 — final review

**Verdict:** pass. WO-199 repairs the vertical's recovery path. A writer launched through the vertical records its process group and birth identity. An interrupted `dotln vertical` stops its writer, exits non-zero and resumes on rerun. A host refusal after a writer's result names its check. All five original criteria are met at the integrated subject, and FINAL-001 F1 stays repaired in its unchanged probe at this identity. One finding, F1, is a README sentence that D015's recovery path contradicts. This review corrected it in place through Adjacent Repair, and it is not blocking ([D017](../../evidence/WO-199/decisions.md#wo-199-d017--final-review-pass-final-002-correct-the-skeleton-readmes-typed-refusal-sentence-which-d015s-recovery-path-contradicts)).

**Subject:** [`docs/work-orders/WO-199-the-vertical-survives-an-interrupt.md`](../../work-orders/WO-199-the-vertical-survives-an-interrupt.md) on branch `wo-199`, uncommitted over `main` at `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, so integration merged nothing.

- The gate code identity is `2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c`. VER-003 passed this identity, and the executor's review row covers it. `gateCodeIdentity` returned it after integration and again after `npm run format`. This review edited no code byte.
- The order differs from `main` only in its heading's version label, `(v0.69.2)`. The five criteria are the original text.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session, and the probes that FINAL-001 and VER-003 committed reproduce them directly.

**Process cost:** entry 88246 tokens; handoff 18390380 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 6f31d91e-8b6f-4e74-a030-cebdb268ebcc`.

- Entry was observed at 2026-10-08T20:21:01.397Z.
- Handoff was observed at 20:39:26.672Z, after 113 steps and 100 commands. It counts 18,080,981 cached input, 231,846 cache-write, 208 uncached input and 77,345 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Reasoning tokens and dollar cost are unavailable.
- Wall clock to handoff was about 18 minutes. The probes took about 2 minutes under bounded. The first FINAL-001 probe pass (about 40 s) was repeated, because a display filter had cut its rows. Three document-gate runs took 2.5 minutes, two of them failing on this report's own placeholders and one on the release-notes markup.
- Tradeoff: the review gate reused the executor's passing tasks at the unchanged identity (5.72 s against 1,307.615 s fresh). The probes that bear on criteria 1 to 3 ran here directly, and the recovery regression file was not rerun: VER-003 ran it at this identity in 4 min 3 s.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-199/FINAL-002.md`.

Read in full: the order; FINAL-001; VER-003; D012 to D016; `handoff.md`; the existing `PR.md` draft; product 07 §Verification review and attack; product 08 §PRs and commits and §Release-note edition.

Read in part: VER-001 and VER-002 (verdicts, method and known issues); D010 (its F2 and F3 dispositions); `reviews.md` (the VER-001 repair's refuted budget item).

Reviewed: the complete subject diff against `main`:

- `source-change-host.ts`, `host-interruption.ts` (new), `worker-transport.ts`, `host-lock.c`, `dotln.ts`, `vertical-host.ts`, `repair-host.ts` and `verification-worktree.ts`;
- `vertical-transport.mjs`, `vertical-primitives.mjs` and `vertical-runtime.mjs`;
- `feedback-audit.ts`, `evidence-sources.mjs` and `test-runner.mjs`;
- the manifests, lockfile, root and skeleton READMEs, and the evidence edition selection.

The test diffs and new fixtures were read at their headers and the cases the reports cite.

Lenses, and why:

- **Correctness and state recovery:** interruptions cross durable records, and FINAL-001's escape lived at that boundary.
- **Operator flow:** Ctrl-C is the commonest stop, and a sealed issue has no rerun.
- **Authority:** recovery now signals a recorded group, and native writers run under a supervisor.
- **Release surfaces:** final review is acceptance.

Goal alignment:

- **Traps:**
  - Deferring to three passing judgments. FINAL-001 found an escape after two, so I re-ran the probes the verdict rests on at the integrated subject.
  - Widening D015 into a criterion-3 failure. Its design scopes criterion 3 to the dispatch admission.
  - Patching the judged source host. That needs a live episode and independent verification.
- **What I did:**
  - Re-derived each criterion from a probe or check at this identity.
  - Searched every vertical step for the FINAL-001 class beyond the source host.
  - Kept D015's code repair boarded and corrected only the README sentence that contradicts it.
- **NoOp:** leaving the order unreviewed keeps WO-118's kill-and-restart blocked on recovery that now holds.

Integration: `npm run worktree -- integrate WO-199` fetched `main` equal to the base. It stashed and re-applied the work (named stash `6768e8493cbd76cd617c23c75fa0b7f9bdee1af8`) and regenerated documents and ignored build output. Checkpoints 16 and 17 differ only in `docs/control/current.md`, the control log and the work-order index. [D016](../../evidence/WO-199/decisions.md#wo-199-d016) records the carried-forward claims and the affected checks, all of which pass. No authored conflict arose. No component version collides: v0.69.2 and skeleton 0.55.1 remain current, and origin's tags end at v0.69.1. The stash re-application refreshed source modification times without changing content. Criterion 4 therefore rests on the content-based feedback check, not on file times.

## Earlier findings

- **FINAL-001 F1 (blocking, escape): stays repaired.** The committed probe, unchanged, signals the CLI's whole process group 500 ms into the post-result focused test, as a terminal Ctrl-C does. At this identity it exits 130, 143 and 129 after 11 to 12 ms. Source-change is pending. The source store holds `WorkerInterrupted(interrupted, <signal>)` and no observation, refusal or receipt. Each rerun exits 0, resolves and records `testAfter {exitCode: 0, signal: null}`. At FINAL-001's identity the same probe exited 0 with `testAfter.signal: SIGINT`.
- **VER-001 F1 to F3:** VER-002 and VER-003 recorded them repaired or discharged. This review found no change since that touches them. F2's C compiler prerequisite is named in the skeleton README and in the release notes.
- **VER-003 F1 (D015, follow-up):** reproduced unchanged at this identity, and still boarded as FUP-49c4a5f7176252e7. F1 below corrects the README sentence it contradicts.
- **D011 (browser scenario) and WO-112 D061 (identical judgment retries):** both stay boarded with their reopening conditions.

## Criterion judgments

**Criterion 1:** met

The agreed probe at this identity (`node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`, 2026-10-08T20:25:23.642Z–20:25:29.020Z, exit 0):

| Case | Recorded group | Outcome |
| --- | --- | --- |
| crash-vertical | 42470 | recovered `observed` |
| crash-direct | 43721 | recovered `observed` |
| revoke-vertical | recorded | `SourceChangeProcessStopped` and `WorkerInterrupted` recorded |

The surviving-group rerun is a regression, like the probe's three cases. It sits in `source-change-integrity.test.ts` and the `vertical` row's `scripts/test-vertical.recovery.mjs`, with the wrapped, direct, surviving, leaderless and grandchild recovery rows, death before the start marker and refusal of a mismatched birth identity. Both files run in the review rows under Executed checks. VER-003 executed them independently at this identity: 19 of 19 and 9 of 9.

Read by source, recovery signals a surviving group only when the recorded birth identity proves ownership of every member, and never a group that would include the host. An unrecorded identity refuses, as `main` refused.

**Criterion 2:** met

- **Live writer.** The CLI case `WO-199 dotln vertical forwards SIGINT, SIGTERM and SIGHUP and resumes the same issue` passes in the review rows. VER-002 reproduced it: exits 130, 143 and 129, the writer group absent within 10 s, the recorded signal, and an immediate rerun reaching `resolved`.
- **The writer's own step after its result** (FINAL-001's exit clause): the earlier-findings rows above, at this identity.
- **Every other step.** VER-003's variations (host pid only, the rerun's re-observation, the pre-dispatch test) and the judgment, settle-wait and repair-writer regressions cover it.
- **FINAL-001's class elsewhere.** No other vertical step turns a signal-killed synchronous child into returned data. I read every synchronous child in the publish, observation and resolution paths (`target-publish.mjs`, `pull-request-observer.mjs`, `github-repository.mjs`, `vertical-primitives.mjs`). Each one throws on a non-zero or signalled status, and the primitives catch nothing but the worktree removal and the abortable wait. A thrown failure with a pending signal therefore reaches VerticalHost's catch, which delivers the signal and leaves the step pending.
- **Judged boundary.** Two interrupted live-writer dispatches exhaust the step's existing two-dispatch budget, so the run after the second refuses `recovery-dispatch-exhausted`. The direct transport shares this cap, and the README documents it. VER-002 recorded it, the VER-001 repair's refuter judged it the documented recovery contract, and D014 kept it. The criterion's design targets the seal that missing termination evidence or a live prior group caused. Each rerun here resumes from the recorded termination, so this is not a finding (D017).

**Criterion 3:** met

- The integrity suite asserts `host-admission-effect` for a dirty post-result tree and for the one-commit host-message check. It asserts `host-admission-receipt` for a failed receipt save, with no `WorkerInterrupted` and no `SourceChangeObserved`. Both run in the review rows.
- The control row of the coincident-refusal probe, re-run here (20:29:13.791Z–20:29:15.770Z, exit 0), records `SourceChangeRefused host-admission-effect`, and its rerun replays `refused host-admission-effect`.
- By source, once admission begins, a failed check records the typed refusal while no signal is pending and the typed interruption while one is, never `WorkerInterrupted transport-failed`.
- The same probe's signal row reaches D015's untyped rerun refusal. That row is a rerun's recovery observation, which the criterion's observed gap and design do not govern, and which `main` shares.

**Criterion 4:** met

- Feedback 004's live episode ran on `codex-cli-exec`, `gpt-6.1-sol`, effort `max`, `harnessVersion` 0.161.0. Its verification log runs from 2026-10-08T18:52:33.712Z to 18:53:48.116Z, after the last judged-source edit VER-003 observed at 18:47:48.283Z. No judged-source content changed since.
- At this identity, `npm run evidence:feedback -- --check` reports that feedback 004 judged the current source, with ten passing regressions and ten removal failures. The `authority-evidence.mjs`, `artifact-identity-evidence.mjs` and `verification-evidence.mjs --check` runs each pass (20:27:43Z–20:27:47Z, exit 0).
- `docs/evidence/current.json` selects WO-199 feedback 004, and revision 003 for the other three families.

**Criterion 5:** met

- **Write-backs.** They land in place: the skeleton README's vertical paragraph and compiler prerequisite, the root README's `v0.69.2` claim, D001 to D017 and the regenerated decisions index. This review corrected one README sentence (F1).
- **Follow-up dispositions.** FUP-627ec3088bb86e62 (D065) and FUP-5f8a48126bb022be (D060) are `settled` onto this order's decisions. FINAL-001's FUP-9e32c0d0868c29c7 is `settled` onto D014.
- **Gates.** This review's `npm test -- --review` passed 38 of 38 at this code identity (20:38:26Z–20:38:33Z, exit 0, 5.72 s). It ran `format` fresh and reused 87 passing tasks from the executor's row at the same identity (2026-10-08T19:21:04.653Z, 1,307.615 s, 88 fresh tasks). The `vertical` row, which runs the recovery and judgment regressions, is among them. `npm run test:docs` passed inline at this report (under Executed checks).
- **Hygiene.** `git diff --check` is clean.
- **No new dependency.** The manifests and lockfile change only the skeleton's `0.55.1` version and the console's pin to it.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "The skeleton README said every post-result host refusal records a typed SourceChangeRefused host-admission-* reason, but a rerun's recovery observation (D015) records none; corrected in place through Adjacent Repair"}
]
<!-- dotln-findings:end -->

**F1 — the README's typed-refusal sentence overclaims (follow-up, escape; repaired in review).**

- **Observed.** The skeleton README's recovery paragraph ended: "Host checks that refuse a returned result record `SourceChangeRefused` with `host-admission-<check>`; they are never transport interruptions." Consider a rerun that re-observes an unreceipted committed result, after an interrupted or crashed source-change step. That rerun throws a plain Error, `source-change committed tree is dirty; preserve for inspection`, and records no `SourceChangeRefused`. I reproduced this with VER-003's committed coincident-refusal probe at this identity. Rows are in [`final-002-observations.json`](../../evidence/WO-199/final-002-observations.json).
- **Repair.** The sentence now limits the typed refusal to the run that receives the result. It adds: "A rerun that re-observes an unreceipted committed result does not yet record that refusal (WO-199 D015)." VerticalHost records a thrown source-host failure in both runs as the step reason `source-change host failed or was unavailable`, unchanged from `main`. The README says nothing about the step reason, so no other sentence needed a change. `packages/skeleton/README.md` is marked `dotln-documentation`, which `gateCodeIdentity` excludes, so the code identity is unchanged.
- **Route and class.** It is a follow-up because no criterion breaks: criterion 5 requires the write-backs to land in place, and they do. It is an escape because the sentence was present at the identity VER-003 judged, and VER-003 read the paragraph against its probes, inside its instructed scope. D015's code repair stays boarded as FUP-49c4a5f7176252e7. [D017](../../evidence/WO-199/decisions.md#wo-199-d017--final-review-pass-final-002-correct-the-skeleton-readmes-typed-refusal-sentence-which-d015s-recovery-path-contradicts) records the correction and its reopening condition.

Not findings:

- The two-dispatch budget under repeated interrupts (criterion 2's judged boundary).
- The vertical step's generic reason for a thrown host failure, unchanged from `main`.
- `vertical-runtime.mjs`'s admission still waits up to five 10 ms timer turns for a pending signal, while D014 chose two immediate turns for new boundaries. Both deliver the signal. The older wait predates D014, and D014 rejected timer turns only for the new boundaries.

## Implementation review

- **Correctness.**
  - Every synchronous child the source host, repair host and snapshot preparation run while a writer's outcome is pending goes through `interruptibleHostCall`. The catch records a refusal only when no signal is pending.
  - The receipt save, `SourceChangeObserved` and `closeCommand` have no await between them, so an accepted receipt cannot be split from its observation.
  - The supervisor's exit report reaches the host before `close`, because Node waits for the extra pipe to close.
- **Authority.**
  - The launch gate admits no writer until the start record is durable.
  - The supervisor ignores terminal signals and reports the writer's status on a pipe the writer never holds.
  - Recovery's ownership proof refuses a mismatched or missing identity and any group that would include the host.
  - The native helper is compiled to a `.prepare` file and renamed, so a compile the operator interrupts leaves no partial binary.
- **Platform fit.** The skeleton package stays private, and its dynamic import of `scripts/lib/host-resources.mjs` follows the CLI's existing imports of `scripts/lib`. The new C compiler prerequisite is the platform cost. It is documented, and the release notes put it first under Read before upgrading.
- **Maintainer in six months.** `host-interruption.ts` states its rule in two comments, and the README paragraph now matches the code on every path it names. The admission check names live in one variable, set before each check. That is legible, but a new check added without setting it would fall back to `WorkerInterrupted transport-failed`. The integrity suite's typed-refusal cases would catch a regression at the checks they exercise.

## Follow-up register

`npm run plan -- followups --touching` lists 17 pending rows by textual match. This review disposes none:

- The change opens none of their seams beyond what D011, D015 and the order's own D061 boundary already board.
- No reopening condition has occurred.
- FUP-49c4a5f7176252e7 (D015) and FUP-88c339c51cfc1933 (D011) are this order's own boards, untriaged for planning.

`npm run meta` reports one standing reopen candidate, WO-150-D003 (`coldStartBytes.executor` above 24576). Earlier verifications (WO-179, WO-184, WO-196) recorded it too. This order does not change the executor briefing.

## Release surfaces

- [`PR.md`](PR.md) is rewritten under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section patch edition for v0.69.2.

The proposed PR title is `:bug: An interrupted or crashed vertical stops its writer and resumes on rerun instead of refusing the issue`. Its gitmoji is `:bug:`, because the order repairs three recorded defects and adds no capability. The title leads with the operator-visible behavior. The last eight merged titles run from 13 to 19 words. This title's 17 words come from its content, the before-and-after in one clause, not from the previous title.

## Executed checks

Each probe and check ran alone. Probes ran under `node scripts/harness.mjs bounded`, at code identity `2b3fffa9…`.

| Check | Window (2026-10-08, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `npm run worktree -- integrate WO-199` | checkpoint 17 at 20:21:30 | 0 | no-op merge; checkpoint 17; D016 |
| Agreed WO-112 recovery probe | 20:25:23–20:25:29 | 0 | criterion 1 table |
| FINAL-001 probe, `subject`, three signals (rows cut by a display filter) | 20:25:34–20:26:15 | 0 each | rerun below |
| FINAL-001 probe, `subject`, SIGINT, SIGTERM and SIGHUP | 20:26:22–20:27:02 | 0 each | 130, 143 and 129 after 11–12 ms; pending; rerun `testAfter` 0 |
| `npm run publication:check`; `node scripts/harness.mjs check`; `npm run release -- check-surfaces --local` | 20:27:34–20:27:36 | 0 | pass |
| `npm run evidence:feedback -- --check`; authority, artifact-identity and verification `--check` | 20:27:43–20:27:47 | 0 | current |
| VER-003 coincident-refusal probe | 20:29:13–20:29:15 | 0 | F1 and criterion 3 rows |
| `npm run meta`; `npm run plan -- followups --sync`; `npm run meta` again after D017's correction | between 20:29:15 and 20:32:54 | 0 | D016 and D017 indexed |
| `npm run format` | 20:32:54–20:32:59 | 0 | identity unchanged |
| `npm run test:docs` | 20:33:07–20:33:46 | 1 | release-notes placeholder read as raw HTML, this report not yet written, stale decisions index; each fixed |
| `npm run format`, then `npm run test:docs` | format before 20:36:10; test:docs 20:36:10–20:36:34 | 0, then 1 | the report's cost line held a placeholder; filled |
| `npm run test:docs` | 20:36:50–20:38:18 | 0 | 29 passed, 0 failed, 87.51 s, 29 fresh tasks |
| `npm test -- --review` | 20:38:26–20:38:33 | 0 | 38 passed, 0 failed, 5.72 s, 1 fresh task (`format`), 87 reused at this identity |
| `npm run format`, `npm run test:docs` and `git diff --check` after the gate results were filled | 20:39:40–20:41:14 | 0 | 29 passed, 0 failed, 87.61 s; diff clean; identity unchanged |

Later wording corrections to this report and the release text changed no code; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Probe rows are in [`final-002-observations.json`](../../evidence/WO-199/final-002-observations.json), with local paths redacted.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D016's completion and D017;
- the skeleton README correction;
- `final-002-observations.json`;
- the regenerated decisions index, follow-up register, meta and work-order projections.

No implementation source was edited. Probe fixtures were created in system temp, and each fixture's own cleanup removed them. Scratch output went to the DotLn session scratch directory.

Goal alignment outcome: matched. Each criterion was re-derived from a probe or check at the integrated subject. FINAL-001's class was searched across every vertical step and found closed. The one inaccurate write-back was corrected without touching judged source, and the reviewed state is ready to commit.
