# WO-056 — Live blinded verification and repair

Status, 2026-09-20: the fixture, receipt contract and regression fixture are
in place and exercised end to end with process doubles. **Six live attempts
are filed. The first four failed at the first verifier episode and found two
runtime defects, which the operator expanded this order to repair; on the
repaired runtime Claude completed the whole proof and Codex everything but
the public replay.** The order assigns the live runs to the operator, from a
terminal outside the sandbox. The regression fixture's live requirement is
met by `claude-live-3`. The results section states only what the filed
receipts observed.

[Decisions](decisions.md) record the design choices, their evidence, the
adversarial pass of 2026-09-19 and the follow-ups boarded up for planning.

## What one episode does

[fixture.mjs](fixture.mjs) is the planted-defect variant of the
[WO-053 generator](../WO-053/fixture.mjs). It creates a synthetic repository
outside DotLn with a two-clause contract:

| Criterion | Clause | Named host test |
| --- | --- | --- |
| `AC-positive` | `add` returns the sum when both arguments are zero or positive | `node focused-test.mjs` (the superficial test) |
| `AC-signed` | `add` returns the sum when either argument is negative | `node contract-test.mjs` |

1. **Plant (process double).** Through the real WO-052 `SourceChangeHost`, a
   double implementer commits `left + Math.abs(right)`. The host observes the
   superficial test go red to green and receives a success-shaped envelope.
   The planted implementer is deliberately not a live model: the defect is the
   fixture's input.
2. **Verify (live).** The WO-054 host snapshots the planted commit, runs both
   named tests in confined copies and dispatches the harness as a blinded
   verifier with no tools. The capsule holds the contract, diff, snapshot and
   host witnesses, and nothing from the implementer.
3. **Repair (live).** The unmodified WO-055 `RepairHost` derives the repair
   order from the finding and dispatches a fresh worker of the same harness.
   Its surfaces can only be `sum.mjs`: that is every criterion's declared code
   surface, so neither test nor the README is writable.
4. **Re-verify (live).** A fresh verifier episode judges the repair commit
   against all original criteria and the unchanged contract.
5. **Collect.** The parent process reads the stores, replays the first
   verification log with injected implementer success events, validates the
   receipt and writes `<episode>.json` here. An existing receipt is never
   overwritten; a failed attempt is filed as a failure.

## Running the live episodes (operator)

Run from this worktree's root, in a terminal outside the sandbox, with the
CLIs installed and authenticated. The synthetic target already exists in
ignored local state (`docs/control/local/wo056/`); `prepare` is only for a
machine without one and refuses to replace an existing location record.
Leave the worktree otherwise untouched while an episode runs: the receipt's
containment check compares this checkout before and after.

```sh
npm run build
node docs/evidence/WO-056/fixture.mjs add claude-live claude
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-056/fixture.mjs run claude-live
node docs/evidence/WO-056/fixture.mjs add codex-live codex
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-056/fixture.mjs run codex-live
```

`add` prints the launch claim it recorded. Defaults are the selectors the
WO-053 receipts observed launching (`claude-fable-5`, `gpt-6-astra`, effort
`xhigh`); override with `--model <id>` and `--effort <level>`. `run` prints
the five result flags and whether the log was withheld. It exits zero when
the finding, repair and re-verification passed and the fold either passed or
was withheld only for an absolute test command; anything else exits nonzero
and is still filed. Choose a fresh `<harness>-<label>` name for every attempt.

A run can fail honestly in ways the receipt will show: the verifier's
finding must restate its adverse host witness, and its reproduction steps
must be the witness's step or the exact named command, or the repair host
stops at `NeedsHuman` before any worker runs; a worker or verifier can exceed
the transport's 180-second limit; the loop can exhaust its two rounds. Only a
first-round repair can carry `repairPass`; a second-round success is filed
through the loop fact and needs a fresh attempt to evidence criterion 2.

`--style bare|absolute` selects the named test command. `bare`
(`node contract-test.mjs`, the Claude default) keeps the verification capsule
free of machine paths, so the raw log is publishable and replayable.
`absolute` (the Codex default) uses the host's Node path because the Codex
writer shell inherits no `PATH` (WO-053 `codex-fixed`: exit 127). When that
path is private the collector withholds the log and the fold claim instead of
publishing edited bytes; such a receipt can evidence criteria 1 and 2, not 3
([WO-056-D002](decisions.md#wo-056-d002)).

## Receipt contract

[receipt.mjs](receipt.mjs) pins schema version 1: closed top-level and nested
shapes, an epistemic label on every fact, exact placeholders for every
location, and a private-path and credential screen that runs first and also
reads each embedded event line after JSON normalization. The collector
additionally refuses this machine's home, temporary, worktree and scratch
paths and its hostname by exact match. Launch identity is a `launch-claim`
whose effective readback is always `unknown`; nothing else may be a claim. A
fact that was not observed is `unknown` with a reason and a null value.

Pass flags are derived, never asserted. The collector files every pass as
unclaimed, then claims each one only if the receipt still validates with it
set, so a flag means exactly that the recorded facts satisfy these invariants:

- `findingPass`: a blocking finding on the signed clause, quoting that clause,
  whose references are all witnesses of that criterion at the planted commit,
  whose expected and observed values restate a failing one, blaming `sum.mjs`,
  while the superficial witness and the planted episode's focused test passed
  and a verifier episode ran.
- `repairPass`: a first-round order for that finding with no grants, the
  original contract hash and the planted commit as execution base; a diff of
  exactly `sum.mjs`; the contract test red before and green after; every
  derived reproduction passing on the host; one worker attempt.
- `reverificationPass`: a second verifier episode, a different episode
  identity, every original criterion verified at the repair commit with a
  passing witness for every named test, the contract unchanged, no open
  finding, a completed loop, a clean host exit and no recorded failure.
- `foldPass`: the published log and a replay whose controls are live and in
  which no forgery changes the matrix.

Where the log is published, the facts that restate it must equal it: the
criteria, contract, tests, base and subject in `VerificationOpened`; the
transport, model, effort and harness version in `WorkerAttemptStarted`; the
verifier's episode, summary and findings, verbatim, in the admitted result;
and the host witnesses. The regression fixture goes further and compares the
stated rows, witnesses and findings with what the fold projects from those
bytes. A process double relabelled as a live harness fails these checks. Each
episode's reported usage source also names the launched harness's wire, so a
receipt that withholds its log still cannot be relabelled to the other live
harness.

This is a consistency contract, not authentication. The launch fields in the
log are not hash-bound, so a deliberate forger with write access can still
fabricate a receipt; filing remains the operator's act. The repair and
re-verification facts are host observations with no published log behind
them: the re-verification store's first event records a physical snapshot
path, and event identifiers are positional, so it cannot be published
unedited ([WO-056-D005](decisions.md#wo-056-d005)).

Per live episode the receipt records duration, exit code, closed wire-shape
facts and, where the transport reported them, token and cost counters keyed
to that dispatch. No vendor transcript, prompt or raw output has a field to
live in.

A run whose text the screen refuses is filed with the model-authored facts
withheld and no pass claimed; if that still cannot validate, everything but
the fixture, boundary and host facts is withheld. Facts that do not fit the
contract are filed the same way as `receipt-invalid`.

## Criterion 3: the replay

[replay.mjs](replay.mjs) folds the receipt's first verification log, complete
and unedited, through `projectAcceptanceEvidenceMatrices`, then injects
forged events and folds again.

After the admitted result, appended to the whole log: an implementer-actor
success event, and an all-pass result under the implementer's episode
identity. The matrix must be byte-identical to the uninjected one.

At the still-pending, still-leased command, after the recorded prefix: six
forgeries, each followed in memory by the recorded tail. The matrix after the
forgery must be byte-identical to the prefix's, and after the tail the result
must equal the recorded one. Four carry an *erasure* payload (the failed
criterion becomes unverified and its finding disappears) authored by an
implementer actor, under the implementer's episode, with the implementer's
envelope under the verifier's attempt, and with the verifier's envelope under
the implementer's attempt. Two carry an all-pass, from an implementer actor
and from the genuine verifier episode against the adverse host witness.

Two controls keep this from passing vacuously: the genuine result appended
at that position is admitted, and the erasure payload authored by the
verifier is honored. With either control dead the replay reports failure. On
2026-09-19 the replay was run against in-memory mutants of the built fold,
each with one guard removed (the actor filter, the implementer-episode check,
the active-episode check): each mutant made `negativeRetained` false, and the
unmodified fold kept it true. The earlier draft of this replay passed all
three mutants, which is what the adversarial pass found.

The capsule binds the compiler package version and replay recompiles it, so
[the regression fixture](../../../packages/skeleton/test/live-verification-receipt.test.ts)
replays in a child process that pins the receipt's recorded version through
[recorded-compiler-loader.mjs](recorded-compiler-loader.mjs), following the
WO-050 historical loader. It requires the re-executed replay to equal the
recorded one, a tampered log to refuse, fifty-one forged or inconsistent
variants of a passing receipt that publishes a bare-command log to refuse
(eleven of shape, eight carrying a private string, thirty-two of claim, of
which five need the log or the rehashable contract and are skipped for a
receipt that withholds them), every unclaimed pass of a failed receipt to
resist promotion, and one **live** receipt carrying the
finding, repair, re-verification, fold and containment passes together. To
replay a receipt by hand:

```sh
npm run build
node docs/evidence/WO-056/replay.mjs docs/evidence/WO-056/<episode>.json
```

## Process-double receipts

Three receipts were produced on 2026-09-19 with `add … double`. Their
verifier and worker are in-process doubles; their Git commits, confined host
tests, stores, fold and replay are real. They are not live evidence, and the
regression fixture never counts a `double` toward a criterion.

| Receipt | What it shows |
| --- | --- |
| [double-pipeline-check-2](double-pipeline-check-2.json) | The whole pipeline: all five flags claimed, and a bare-style raw log that passes the privacy screen. |
| [double-repair-exhausted](double-repair-exhausted.json) | `--fault wrong-repair`: both repair rounds stay wrong. The loop exhausts, the host exits nonzero, and the run is filed with the finding and fold passes and no repair pass. |
| [double-privacy-withheld](double-privacy-withheld.json) | `--fault privacy`: the verifier's summary names a temporary path. The run is filed with its model-authored facts withheld and no pass claimed. |

The two failures give the regression fixture unclaimed passes to try to
promote, and show that a failed run records its receipt as the order's second
operator-review assumption requires.

## Live results

**One live harness completed the whole proof and a second completed all of it
but the public replay.** Both passing runs followed the operator's scope
expansion and used the repaired runtime; the four earlier attempts stay filed
as the failures that found the two defects. Containment held in all six.

### Passing runs, 2026-09-20

| Receipt | Launch claim (effective readback unknown) | Finding | Repair | Re-verification | Fold | Host time; reported usage |
| --- | --- | --- | --- | --- | --- | --- |
| [claude-live-3](claude-live-3.json) | Claude Code 2.1.278; claude-fable-5; xhigh; bare command | pass | pass | pass | pass | 81,132 ms; 87,076 tokens, USD 0.907967 over three episodes |
| [codex-live-3](codex-live-3.json) | Codex CLI 0.155.1; gpt-6-astra; xhigh; absolute command | pass | pass | pass | withheld | 102,122 ms; 152,725 tokens, cost not reported |

What both receipts observed, in the order it happened:

1. The planted double's focused test went from exit 1 to exit 0 and its
   envelope said completed. The host's confined witnesses at the planted
   commit were `superficial` exit 0 and `contract` exit 1.
2. The live verifier verified `AC-positive`, failed `AC-signed` and returned
   one blocking finding on `AC-signed`, the clause "add(left, right) returns
   the numeric sum when either argument is negative." The finding restates the
   contract witness (`exit 1` against `exit 0`), references only that witness,
   gives its reproduction step, and blames only `sum.mjs`. Each verifier's
   summary names the cause: `Math.abs(right)` discards the sign of a negative
   right operand, so `add(4, -7)` returns 11 and `add(-2, -3)` returns 1. The
   Claude verifier also listed the bare named command as a second
   reproduction step; both forms derive.
3. The repair host derived a round-one order with surfaces `sum.mjs`, the
   contract test as its only test, no grants and the original contract hash.
   One fresh worker attempt took that test from exit 1 to exit 0, the host's
   own reproduction passed, and the repair commit's diff against the planted
   commit is exactly `sum.mjs`.
4. A different verifier episode judged the repair commit from the unchanged
   contract: both criteria verified, both witnesses exit 0, no open finding,
   and the loop completed in round one.
5. For `claude-live-3` the first verification log is published, complete and
   unedited (32 events). Replayed with both controls live, the two appended
   and six pending-position forgeries leave the matrix unchanged and
   `AC-signed` failed with its finding open. The regression fixture
   re-executes that replay under the recorded compiler identity and requires
   the same result. `codex-live-3` used the host's absolute Node path, which
   is private on this machine, so its log and fold claim are withheld; the
   collector's local replay reported the negative retained, which is not a
   public claim.

Criterion 1 is met by both harnesses, criterion 2 by both, and criterion 3 by
`claude-live-3`. Every fact is labeled `observed`, `launch-claim` or
`unknown` (criterion 4). These are executor observations awaiting the order's
separate verification and final review.

### Failed attempts that found the defects

These four ran before the runtime repairs below; the two explanations
describe the runtime as it was then.

| Receipt | Launch claim (effective readback unknown) | Observed |
| --- | --- | --- |
| [claude-live](claude-live.json) | Claude Code 2.1.278; claude-fable-5; xhigh; bare command | Planted episode and host witnesses as designed (superficial exit 0, contract exit 1). Verifier process 19,866 ms, exit 0, structured result, 10,128 tokens, USD 0.26053 reported. Host refused the result as `invalid-result`; the refusing rule was not retained. |
| [codex-live](codex-live.json) | Codex CLI 0.155.1; gpt-6-astra; xhigh; absolute command | Verifier process exit 1 after 142 ms, no JSON output; host `transport-failed`; the CLI's error text was discarded. |
| [claude-live-2](claude-live-2.json) | as claude-live | Same signature (20,843 ms, exit 0, 10,118 tokens, USD 0.2588), now with the refusal recorded: `invalid-result`, **`finding observed versus expected`**. |
| [codex-live-2](codex-live-2.json) | as codex-live | Exit 1 after 45 ms; refusal `transport-failed`, `exit-1`. The local stderr diagnostic reads: "Not inside a trusted directory and --skip-git-repo-check was not specified." |

**Claude.** The local diagnostic of `claude-live-2` (ignored, never
published) holds the verifier's refused result. In substance it is the
finding this order set out to observe: `AC-positive` pass on the superficial
witness; `AC-signed` fail on the contract witness; one blocking finding on
`AC-signed` that cites that witness, blames only `sum.mjs`, and names the
cause (the implementation adds `Math.abs(right)`, dropping the sign). The host
refused it because a finding's `observed` and `expected` must equal an adverse
witness's strings exactly (`exit 1`, `exit 0`), and the verifier wrote
descriptions. The verifier was never told this: the output instructions in
`transportPrompt` did not state it and `evidenceResultSchema` left both
fields, and `reproductionSteps`, as free text. Its second reproduction step
was also in its own words, which `deriveRepairOrder` would have refused as
`NeedsHuman` ("reproduction is not an exact named command") had the result
been admitted. A result this host refuses is not an observed finding, so
criterion 1 is not met by it.

**Codex.** The WO-054 `worktree-snapshot` read mount is a files-only copy
with no Git metadata, and no transport shape passed
`--skip-git-repo-check`, so Codex CLI 0.155.1 refused the verifier launch
before any model call. Whether 0.154.0 behaved the same is unknown.

The fixture's diagnostic capture ([WO-056-D006](decisions.md#wo-056-d006))
was added between the first and second pair of attempts. A fake CLI on
`PATH`, with its receipts redirected to scratch, exercised the whole live
code path on 2026-09-20: a descriptive `observed` was refused with the same
rule, and a finding that restated the witness completed the loop with all
five passes. The fixture and collector were therefore not what stood between
those attempts and a pass.

## Runtime repairs under the operator's scope expansion

On 2026-09-20 the operator expanded this order to repair both defects here
([WO-056-D008](decisions.md#wo-056-d008),
[WO-056-D009](decisions.md#wo-056-d009)). Neither repair changes what the
host admits.

- **The verifier is told the finding contract.** `evidenceResultSchema` limits
  a finding's `observed` and `expected` to the adverse host witnesses' strings
  and, in the `worktree-snapshot` profile, its `reproductionSteps` to those
  witnesses' steps and the exact named commands; the output instructions say
  the same and send the verifier's own diagnosis to the envelope summary. With
  no adverse witness the fields stay free text. The regression
  "WO-056 verifier schema, instructions and admission agree on the finding
  contract" holds the three together and keeps the 2026-09-20 live shape
  refused.
- **Codex launches in the files-only snapshot.** The Codex exec shape gains
  `--skip-git-repo-check` for `worktree-snapshot` evidence requests only. The
  inspection vector and the legacy verification profile are asserted unchanged.

Because runtime source changed, the generated harness bundle was re-emitted
(the hook diff is the runtime snapshot id, its hash and the skeleton version)
and this directory carries fresh evidence editions, written on the tree after
`main` was integrated ([WO-056-D010](decisions.md#wo-056-d010)) and selected in
[`docs/evidence/current.json`](../current.json): [authority.json](authority.json)
with [bundle-diff.json](bundle-diff.json), and the feedback edition under
[feedback/](feedback/). The verification and artifact-identity editions still
verify against the changed source and stay at WO-144.

The feedback edition's live repository audit was run by the operator on
2026-09-20 and recorded with `--record-selfhost`: Codex CLI 0.155.1,
`gpt-6-astra`, xhigh (launch claims); all ten fixtures; the blinded verifier
passed both criteria with no finding in 27,832 ms. It exercised the restated
verifier instructions and schema on the legacy profile. An earlier audit
attempt with `claude-fable-5` at xhigh ran 49.8 s against a 581 KB capsule and
ended `transport-failed`; the host kept no detail. Exceeding the verifier's
USD 3.00 cap is the likely cause, inferred from that capsule size and the
per-token cost the WO-056 episodes reported, and the selector was the
executor's suggestion rather than one the repository had recorded working.

## Limits

This inherits WO-052/054/055's limits: a trusted host, first-proof macOS
confinement that is not a hostile-process boundary, named-test bytes that come
from the observed commit, and an append-only log the implementer has no tool
to write. The injected events show the fold's response to forged input; they
do not show that a hostile process cannot reach the log. Browser evidence, the
operator's repositories, pull requests and any runtime fix beyond the two the
operator's scope expansion added are outside this order.
