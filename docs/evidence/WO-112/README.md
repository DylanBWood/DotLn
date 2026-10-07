# WO-112 — Live scratch source-to-PR proof

## Repair runs: the composition's own intake and triage, unaided

[VER-001](../../verifications/WO-112/VER-001.md) F1 found that the earlier runs'
intake classes and review verdicts were executor-scripted inputs labelled as
model judgments, and that the representative needed a mid-run pause and an
injected verdict. The composition now runs its own intake and triage episodes
([D012](decisions.md#wo-112-d012--repair-f1-in-the-composition-under-the-operators-scope-expansion)).
Each repair run below is one uninterrupted `npm run dotln -- vertical <issue>`
invocation, with no pause and no supplied classification, assessment or
verdict. The executor's only inputs were set before the run: the scratch
reviewer's mode and the run configuration.

**Representative, issue 3, Claude workers**
([receipt](repair-representative-run.json),
[outward checks](repair-representative-outward.json)):

- Intake: a model episode classified the five screened spans. The title and
  both headings are `inference`, the Required behavior paragraph is
  `requirement` and the Current behavior paragraph is
  `current-behavior observation`. The contract has one behavior criterion, no
  open decisions and no non-goals; its baseline assessment's producer is
  `model`.
- The baseline reproduced the defect; the writer changed only `index.html` and
  its commit turned the host test from exit 1 to exit 0; verification passed
  the criterion; the independent review found nothing; the pull request
  opened with a generated title and body.
- The scratch reviewer ran on its own when the pull request opened. The
  composition's first observation saw no check yet, so it waited until the
  `review-bot` check finished, then observed an inline suggestion and a
  review summary.
- A triage episode accepted the inline suggestion, citing the contract, the
  page and the host test. A repair writer removed the whitespace, a fresh
  verifier passed the original criterion, the repair was pushed and the
  thread resolved. A second triage episode acknowledged the summary body as
  requesting nothing; a body has no thread to resolve.
- Terminal: `resolved`; nothing merged. Cycle 389,816 ms; nine native model
  episodes (intake, two triage, baseline, writer, verifier, reviewer, repair
  writer, repair verifier), all on Claude CLI 2.1.290.

**Control, issue 4, Codex workers**
([receipt](repair-control-run.json),
[outward checks](repair-control-outward.json)):

- Every episode ran on codex-cli-exec (Codex CLI 0.160.0; `gpt-6.1-sol`, `max`
  as launch claims): intake, baseline, writer, verifier, reviewer and two
  triage episodes.
- Intake classified the title and headings `inference`, the Required behavior
  paragraph `requirement` and the Current behavior paragraph
  `current-behavior observation`; no non-goals.
- The Codex writer edited `index.html`, ran the declared test (exit 1 to 0)
  and made its own commit inside Codex's sandbox, through the adapter's
  documented writable roots ([D017](decisions.md#wo-112-d017--the-codex-writer-commits-inside-codexs-sandbox-through-its-documented-writable-roots)).
  Four earlier Codex attempts in fresh stores stopped at the writer and are
  preserved: the first could not write git metadata, the next three could not
  run Codex's own edit helper; each named the next missing grant.
- The scratch reviewer posted an incorrect suggestion (set the status back to
  `Pending`) and a summary. The triage episode rejected the suggestion: it
  would violate the requirement to display Ready. The rejection posted its
  contract, page and host-test references on the thread and resolved it; the
  candidate is unchanged. A second triage episode acknowledged the summary.
- Terminal: `resolved`; nothing merged. Cycle 185,555 ms; seven native model
  episodes.

### Parity checklist, repair runs

Each item is observed-met only if the composition and its own run-time
episodes produced it, with no actor pausing the run or injecting an input
(VER-001 F1). Both repair runs meet all eight, so **the parity claim passes**
for these two scratch scenarios. It is not a claim about other repositories,
reviewers or efficiency.

| Item | Score | Label | Evidence |
| --- | --- | --- | --- |
| Linked source: one scratch issue | observed-met | observed | Issues 3 and 4, fetched and screened by the composition. |
| Intake and understanding | observed-met | observed | A model intake episode classified every span; contracts with one criterion, no open decisions and no non-goals. |
| Branch | observed-met | observed | Governed source-change branch per run; outward lint passes. |
| Change | observed-met | observed | Only `index.html` changed; the host test went from exit 1 to exit 0 for the Claude and the Codex writer. |
| Conventional commits | observed-met | observed | `fix: implement requested behavior`, plus `fix: address automated review finding` for the repair; outward lint passes. |
| Generated PR title and body | observed-met | observed | Generated by the composition; the body lists no non-goals. |
| Every automated review comment resolved | observed-met | observed | Representative: inline suggestion accepted, repaired, re-verified, pushed, thread resolved. Control: incorrect suggestion rejected with evidence, thread resolved. Summaries acknowledged by a triage episode; a review body has no thread to resolve. |
| No operator tending of a harness | observed-met | observed | One public-CLI invocation per run; no pause and no supplied classification, assessment or verdict. The reviewer mode and run configuration were set before each run. |

### Measures, repair runs

| Measure | Representative | Control | Label | Method |
| --- | --- | --- | --- | --- |
| Cycle time | 389,816 ms | 185,555 ms | observed | First VerticalOpened to the last vertical event. |
| Native model episodes | 9 | 7 | observed | Episode records in each store. |
| Retries and repairs | 0 retries; 1 post-PR repair | 0 retries; 0 repairs | observed | Attempt and resolution events. |
| Findings | 0 pre-PR; 1 post-PR accepted and repaired | 0 pre-PR; 1 post-PR rejected | observed | Review and triage records. |
| Original-criterion evidence coverage | 1/1 verified | 1/1 verified | observed | Verification rows at the final head. |
| Operator interventions during the run | 0 | 0 | observed | Public-CLI receipt; no supplied inputs in the stores. |
| Model tokens, cost, human touch time, main-thread context | unknown | unknown | unknown | No counters in the episode records; no timer. |
| Selected model and effort | `sonnet`, `max` | `gpt-6.1-sol`, `max` | launch-claim | Launch records; effective selection unknown. |


## Earlier runs (corrected by D013)

The earlier representative run reached an open generated pull request and
repaired its inline review, and the earlier control rejected an incorrect
suggestion and then stopped on the bot's summary. Their intake classes and
verdicts were executor-scripted, so they now carry those labels and their
parity claim fails
([D013](decisions.md#wo-112-d013--correct-the-recorded-runs-provenance-and-parity-f1s-rule)).

The operator delegated scratch setup, execution and receipt filing to the
executor ([D007](decisions.md#wo-112-d007--delegate-the-terminal-run-and-receipt-to-the-executor)). The selected personal repository is
private; its selector, remote IDs, physical paths and complete immutable event
streams remain in ignored preserved local material. No remote repository was
created and no PR was merged. The earlier runs used the runtime at HEAD; the
repair runs use this order's composition and adapter changes (D012, D017), with
no new dependency.

## Earlier runs: subjects

| Subject | Label | Result and evidence |
| --- | --- | --- |
| First attempt on the canonical main issue | observed | [Codex refusal](codex-refusal-run.json): baseline reproduced; source worker returned blocked after an unstaged page change, with test/commit permission errors and no accepted commit. The worktree remains preserved. |
| Separate incorrect-review control | observed | [Control receipt](control-run.json): real Claude source, verifier and reviewer; actual GitHub bot suggestion; executor-scripted `reject` verdict with evidence references, resolved thread, unchanged candidate; typed stop on a separate summary. |
| Fresh main attempt on the original issue | observed | [Representative receipt](representative-run.json): same issue, fresh portfolio v2/store; executor-scripted intake classes, derived order, source change, baseline/test, verifier/reviewer, generated PR, review repair, verified push, granted disposition and fresh resolved observation. |
| Final target-page observation | observed | [Screenshot](representative-page.png) and `representative-run.json#/browser`: actual final target Git blob served locally in Chromium 153.0.8010.12; `Ready`, `role=status`, label `Build status`, heading `Scratch welcome`. No deployed-site claim. |
| Outward artifacts and branch tree | observed | [Representative checks](representative-outward.json) and [control checks](control-outward.json): all configured lints pass; tracked-path scan and actual tree grep return no declared match. |
| Preparation and narrower guard | observed | [Preflight](preflight.json), [its source](preflight.mjs), and [functional preparation](functional-preparation.json) retain their earlier cutoffs. They use declared synthetic inputs and establish no live-run outcome. |

The main issue was not duplicated again. The unnecessary duplicate was renamed
as the control after its terminal result; [D008](decisions.md#wo-112-d008--preserve-the-codex-writer-failure-and-use-an-existing-live-transport) and
[D009](decisions.md#wo-112-d009--preserve-the-control-stop-bound-the-representative-review-fixture) record the correction and both actual defects.
Neither the failed Codex attempt nor the control's stop supplies a passing main
result. The main PR remains open at
`d8bf5204756303649cffe52c12887f9a334b980f`.

## Earlier runs: method and scope

The unchanged production composition ran with actual Git/forge ports and native
CLI workers. The existing `DOTLN_LAUNCHPAD` option selected an ignored isolated
instance, with a registered target/intent portfolio and matching restricted
operator-provenance grants for `repo.push`, `pr.open` and `pr.thread.resolve`.
One writer operated in each governed worktree; its parent is the canonical
system-temp/session-scratch root. The target clone and isolated launchpad are
canonically declared preserved material. Exact directories and grant provenance
are retained in the ignored run binding; order text was not used as a grant.

An executor-written prefix rule (`.runtime/wo112/setup-live.mjs` line 83)
classified each line of the screened issue, whose text the executor also wrote,
and fixed the baseline assessment. The records labelled both a model judgment;
they were not. The
compiler produced one behavior criterion, no open decisions, and only
`index.html` as a derived surface. The host test failed on `Pending` and passed
on the initial `Ready` change. Baseline inspection, source writing, verification
and code review used distinct native episodes. The main pre-PR review recorded no
findings; the bot then raised the whitespace item, the real repair removed it
and a fresh verifier passed
the original criterion on the repaired head. There was no second code-review
episode on that repair.

The executor paused the run after publication through a custom driver
(`.runtime/wo112/run-to-pr.mjs`), dispatched the deterministic GitHub bot
fixture, and wrote an `accept` verdict into the run configuration. A script
(`.runtime/wo112/observe-review.mjs` lines 17-18) fixed that verdict by scenario
identity after asserting the planted marker, and labelled it a model judgment.
The run then resumed through the unchanged public `npm run dotln -- vertical` CLI.
Without that injected verdict the composition stops `NeedsHuman`, as the
control's summary stop records. The bot fixture is automation, not an AI
reviewer. The operator issued no command during the run; the executor, as the
operator's delegate, paused it and injected one input.

The correct suggestion addressed actually retained whitespace; the workflow
would refuse to post it if absent. The repair test passes before and after
because it trims status text; its relevant witnesses are the actual whitespace
removal, fresh original-contract verification and fresh resolved thread. The
control suggests a real regression to the failing baseline. Its rejected
GitHub reply contains the actual contract, page and passing test references.

The main criterion is behavior, not appearance. Both real page screenshots are
supplemental host witnesses, not outputs of WO-059's synthetic visual adapter.
Visual-criterion integration remains unqualified; [D003](decisions.md#wo-112-d003--correct-the-unsupported-visual-blocker)
corrects the earlier unsupported claim that it blocks every scenario.

## Earlier runs: measures and methods

All values below concern the declared live attempts. Preparation, repository
gates and final filing are separate. There is no equivalent v1 run baseline,
so no efficiency improvement is claimed.

| Measure | Value | Label | Method/source and limit |
| --- | --- | --- | --- |
| Main-thread context | Last reported request 119,188 tokens of capacity 258,400 at 00:19:08.786Z | observed | Ignored `harness usage` observation during the main continuation; request size, not live occupancy or growth. Exact admission-to-terminal growth is unknown. |
| Child model input/output tokens | unknown | unknown | All retained worker/result event files were inspected; they contain launches/results but no counters, and no transport wire was retained. Root cumulative counters cannot supply child usage. |
| Native child sessions | 12 total: 2 failed first attempt, 4 control, 6 representative | observed | Distinct `WorkerAttemptStarted.workerEpisodeId` values across actual event stores, including failed work. Main: baseline, source, verifier, reviewer, repair writer, repair verifier. Root uses one continuing executor session; no collaboration-tool agents. |
| Human touch time | unknown | unknown | No operator-active interval timer exists. Earlier user steering/preparation is not zero human time. |
| Main cycle time | 360,922 ms | observed | First `VerticalOpened` to terminal durable receipt, including model/forge waits and executor coordination; later page/grep checks excluded. |
| Control cycle time | 508,468 ms | observed | Same event-timestamp method through its actual typed stop. |
| Failed first-attempt cycle time | 85,561 ms | observed | Same method; bounded wrapper separately observed 87,113 ms. Its zero wrapper exit was not proof success. |
| Retries and repairs | One fresh configured retry of the main issue; one main post-PR repair; no internal worker retry observed | observed | Separate preserved store/portfolio identities and attempt events; every native episode has attempt 1. No duplicate issue is needed for the retry. |
| Cost USD | unknown | unknown | No charge in retained child results; root usage cost is also unavailable. |
| Original-criterion evidence coverage | 1/1 verified at the final head | observed | Fresh repair verifier passes `criterion:5e2a871e43e839c0`, with the final-head live host-test witness; final page observation agrees. |
| Findings | Main: zero pre-PR findings, one post-PR item accepted by an injected executor-scripted verdict and repaired; control: one retained pre-PR nit, one incorrect item rejected, separate summary unresolved | observed | Independent review, actual diff and disposition/observation events. No blocking initial model finding; the whitespace test itself does not fail. |
| Operator interventions during main run | 2 by the executor as the operator's delegate: one pause after publication and one injected executor-scripted triage verdict; 0 operator commands | observed | `.runtime/wo112/run-to-pr.mjs`, `observe-review.mjs` and the store's `triage-judgment.json` (D013). Earlier operator corrections and their duration remain separate/unknown. |
| Harness versions | Codex child CLI 0.160.0 on failed attempt; Claude CLI 2.1.290 on control/main | observed | Native transport launch metadata, distinct from root Codex CLI 0.160.1 readback. |
| Selected child model/effort | `gpt-6.1-sol` / `max`, then `sonnet` / `max` | launch-claim | Actual launch records. Effective child model and effort are unknown, not inferred from aliases or selection. |

The root's process-cost counters remain in ignored usage receipts and the
handoff response, with source, dispatch scope and cutoff. They include
preparation and filing and are not a live-worker cost comparison.

## Earlier runs: v1 parity checklist

The eight items come from the [critical path's parity sentence](../../planning/critical-path-2026-09-08.md#the-destination-in-the-operators-terms).
An item is observed-met only when the composition and its run-time model
episodes produced the outcome, with no actor pausing the run or injecting a
mid-run input (VER-001 F1). Five items are observed-met and three
observed-unmet, so **the parity claim fails** for this representative subject.

| Item | Score | Label | Evidence |
| --- | --- | --- | --- |
| Linked source: one scratch issue | observed-met | observed | Actual issue source/revision bound in `representative-run.json#/source`; the original issue was reused. |
| Intake and understanding | observed-unmet | observed | The classes and baseline assessment came from an executor prefix rule over text the executor wrote, labelled a model judgment (D013). The composition had no intake step. |
| Branch | observed-met | observed | Governed source-change/publication binding; actual remote PR branch passes the outward lint. Produced before the pause, from a contract compiled from the scripted classes. |
| Change | observed-met | observed | Only `index.html` changes; the composition's initial change turns the host test 1→0 before the pause. The later whitespace repair followed the injected verdict and is not counted here. |
| Conventional commits | observed-met | observed | Initial `fix: implement requested behavior` and repair `fix: address automated review finding`; both actual outward lints pass. |
| Generated PR title and body | observed-met | observed | Actual publication from sealed contract, matrix, host tests and diff; final artifact hashes in `representative-outward.json`. |
| Every automated review comment resolved | observed-unmet | observed | The thread resolved only after the executor injected an `accept` verdict; unaided, the composition stops `NeedsHuman` ('no supplied triage judgment', as in `control-run.json`). |
| No operator tending of a harness | observed-unmet | observed | The executor, as the operator's delegate, paused the run after publication and injected the verdict (`run-to-pr.mjs`, `observe-review.mjs`). |

## Outward checks and remaining limits

The configured vocabulary is `DotLn`, `launchpad`, `gem`, `gems`, `mask`,
`masks`, plus the one declared local synthetic term `scratch-local-only`.
Recorded lints cover actual branch, both commits, title and generated body at
the final head. The actual case-insensitive whole-term tree grep covers all
tracked text; the tracked-path scan also covers `.agents/`, `.claude/`,
`.beacons/`, `.control-beacons/`, `.runtime/`, `docs/control/`,
`packages/skeleton/`. All five final artifact lints pass, six tracked paths
have no declared match, and `git grep` exits 1 with zero content matches.
This is the declared set, not universal private-data detection.

The repair runs' own lints and tree greps are in
[repair-representative-outward.json](repair-representative-outward.json) and
[repair-control-outward.json](repair-control-outward.json): branch, title,
body and every commit pass, and six tracked paths have no declared match.

Three limits the earlier runs met are fixed in this order and observed live in
the repair runs. The Codex writer's commit failure
([FUP-c842faafbe34c7da](decisions.md#wo-112-d008--preserve-the-codex-writer-failure-and-use-an-existing-live-transport))
is fixed by D017. The stop on a non-inline review summary
([FUP-988ecf16081223f6](decisions.md#wo-112-d009--preserve-the-control-stop-bound-the-representative-review-fixture))
is fixed by a triage acknowledgement, and both repair runs acknowledged a
summary. Title and heading metadata in the generated non-goals
([FUP-6896e8324a8fca59](decisions.md#wo-112-d011--retain-the-generated-bodys-metadata-limitation))
no longer appear: model intake classed them `inference` and both bodies list no
non-goals. Broader reviewer shapes, visual-criterion integration, other
applications, recovery parity and efficiency remain unqualified.
The host's checks for every writer
([D022](decisions.md#wo-112-d022--host-integrity-checks-for-every-writer-from-the-final-reviews))
were added after both repair runs. Host tests with both writer transports
cover them, but no live run.
The third replan checkpoint still follows WO-083.

## Reproduction and repository checks

The repair runs' stores are preserved as ignored local material. Each was one
invocation of this entry, which records the public-CLI receipt in its store:

```zsh
node .runtime/wo112-repair/run.mjs .runtime/wo112-repair/store-rep
```

The earlier runs' retained binding selects their completed main store:

```zsh
node .runtime/wo112/operator-run.mjs
```

This is a reviewable reproduction entry for the executor; the operator need
not run it. It checks registration/grants and uses the actual isolated
launchpad. The local stores retain the original refused attempt, control and
successful main attempt; repeating the terminal binding preserves its result.
No public receipt embeds the private selector or absolute host paths. The JSON
files are sanitized projections, not EventEnvelope JSONL streams; no committed
JSONL receipt or new protocol is introduced.

The required `npm test -- --review`, `npm run test:docs` and `git diff --check`
results and per-criterion judgments are recorded in [handoff.md](handoff.md).
The subsequent [VER-002 repair receipt](repair-002.md) records the shared-state
and review-body repairs, their regression evidence and the requested reviews.

The [VER-003 repair receipt](repair-003.md) records the commit-graph, saved-receipt
and triage repairs and their bounded adjacent changes.

The [VER-004 repair receipt](repair-004.md) records resident retry, finite
review-body judgment, cached-preparation identity and their current checks.
