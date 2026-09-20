# WO-056 implementation evidence

Dispatch: `resume: next`, 2026-09-19, continued through four further
`resume: next` dispatches on 2026-09-20 as the operator filed live attempts.
Subject: the uncommitted `wo-056` worktree, fast-forwarded during execution
from `295766dd` to `main` at `37a729ca`, staged as `v0.33.2` (patch) with
skeleton `0.29.2`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"xhigh","source":"operator-attested"}

Model `claude-fable-5-1` as the session reports it; effort `xhigh` from the
session's `CLAUDE_EFFORT`; neither is effective readback. The executor session
was sandboxed. Every live worker and verifier episode, and the live repository
feedback audit, was run by the operator from a terminal outside it, as the
order requires; their launch claims are recorded per episode in the receipts.

## What was delivered

- **The planted-defect variant.** [fixture.mjs](fixture.mjs) extends the
  WO-053 generator (which now exports its two snapshot helpers, unchanged in
  behavior). A process-double implementer plants `left + Math.abs(right)`
  through the real `SourceChangeHost`; the unmodified WO-055 `RepairHost` then
  dispatches the live harness as blinded verifier, repair worker and
  re-verifier. The contract has two clauses, and every criterion's code
  surface is `sum.mjs` alone.
- **Receipts and their contract.** [receipt.mjs](receipt.mjs) closes every
  shape, labels every fact `observed`, `launch-claim` or `unknown`, screens
  private strings first, binds restated facts to the published log, and lets a
  pass flag stand only where the recorded facts satisfy its invariants. The
  collector claims flags by trial validation and always files a run, withholding
  what cannot be published.
- **The replay.** [replay.mjs](replay.mjs) folds the first verification log
  with two appended and six pending-position implementer forgeries, under two
  live controls, in a child that pins the receipt's recorded compiler identity.
- **The regression fixture.**
  [live-verification-receipt.test.ts](../../../packages/skeleton/test/live-verification-receipt.test.ts):
  shape and forgery refusals, the re-executed replay, and one live receipt
  carrying every pass.
- **Two runtime repairs** under the operator's scope expansion
  ([D008](decisions.md#wo-056-d008), [D009](decisions.md#wo-056-d009)): the
  verifier is told the finding contract (output instructions and result
  schema; admission unchanged), and the Codex verifier launches in the
  files-only snapshot. Three regressions hold them.
- **Write-backs.** Roadmap 06 (the vertical rung's verification sentence and
  the activation note), product 02 §Independent verification v1, the skeleton
  README, the root README's release block, and a dated
  `runtime.independent-verification` reassessment in the
  [capability table](../../planning/capability-table.md). The order predates
  2026-09-09, so its ledger duty is discharged by [decisions.md](decisions.md)
  and the decisions index.

## Acceptance evidence

| Criterion | Evidence |
| --- | --- |
| 1: a live finding names the violated clause with expected, observed, reproduction and evidence references while the superficial test passed | [claude-live-3](claude-live-3.json) and [codex-live-3](codex-live-3.json): blocking finding on `AC-signed`, quoting the clause, `exit 1` against `exit 0`, the contract witness referenced, its reproduction step given, `sum.mjs` blamed; superficial witness exit 0 and the planted episode's focused test exit 1 → 0. |
| 2: the repair commit touches only the finding's surfaces and re-verification passes from the original contract hash | Both receipts: round-one order with surfaces `sum.mjs`, no grants, the fixture's contract hash; diff against the planted commit exactly `sum.mjs`; contract test exit 1 → 0 and the host's reproduction exit 0; a different verifier episode verified both criteria at the repair commit with the contract unchanged. |
| 3: a fixture replays the receipt's event log with an injected implementer success event and the negative stays negative | `claude-live-3` publishes its first verification log (32 events). The regression fixture re-executes the replay and requires equality with the recorded one: controls live, eight forgeries leave the matrix unchanged, `AC-signed` failed with its finding open. Against in-memory mutants of the built fold with one guard removed each, the replay reports failure; the unmodified fold passes. |
| 4: every claim labeled | `validateReceipt` refuses an unlabeled fact, a claim label on anything but launch identity, and a value on an `unknown`. |
| 5: write-backs | Listed above. |
| 6: `npm test`, `git diff --check`, and, since the scope expansion, regenerated pins and fresh evidence editions | See below. |

Six live attempts are filed. The first four failed at the first verifier
episode and are kept as the failures that found the two defects; the
[README](README.md) gives each one's observations.

## Checks on the integrated tree

- `npm test`, 2026-09-20T05:46Z, on the completed tree (after integrating
  `main`, recording the feedback audit and selecting the editions): **21
  passed, 0 failed, 251.64 s, 65 fresh tasks.** The gate at 05:24Z, before the
  audit was recorded, also passed 21 of 21. Two earlier gates on the old base
  had one failure each, the live-receipt requirement, by design.
- Focused suites after integration: `verification-worktree` 10,
  `worker` 23, `verification` 17, `live-verification-receipt` 3, `repair` 6;
  all pass.
- `git diff --check` clean. `npm run publication:check`, `npm run plan -- check`
  (WO-056 listed as an authorized execution amendment bound to D008) and
  `npm run release -- check-surfaces --local` (44 checks) pass.
- `npm run harness -- emit` and `check`: 31 generated surfaces; the hook diff
  is the runtime snapshot id, its hash and the skeleton version.

## Evidence editions and release staging

Runtime source changed, so this directory carries fresh editions written on
the integrated tree: [authority.json](authority.json) with
[bundle-diff.json](bundle-diff.json), selected in `docs/evidence/current.json`,
and the feedback edition under [feedback/](feedback/). Verification and
artifact-identity still verify against the changed source and stay at WO-144.

The live repository feedback audit was run by the operator on the integrated
tree and recorded with `--record-selfhost`: Codex CLI 0.155.1, `gpt-6-astra`,
xhigh (launch claims), ten fixtures, both criteria passed with no finding in
27,832 ms. All four selected editions verify: `verification-evidence`,
`artifact-identity-evidence`, `authority-evidence` and `feedback-evidence`
`--check` each exit 0. The console's pinned self-host case still matches
(`console-fixtures.mjs --check`); the compiler version is unchanged, so its
WO-144 pin replays and was left alone. A first audit attempt failed
`transport-failed` after 49.8 s; see the [README](README.md).

Application `v0.33.2` above local `v0.33.1`; skeleton `0.29.1` → `0.29.2`
(patch: a defect repair, no new capability), with the console's skeleton pin
and the lockfile following. Kernel `0.6.0`, compiler `0.16.0` and console
`0.1.7` are unchanged. No dependency was added. This executor neither commits
nor publishes.

## Integration during execution

At the operator's direction the worktree was fast-forwarded to `main` at
`37a729ca` (WO-140) before the feedback audit
([D010](decisions.md#wo-056-d010)). The whole tree was first preserved at
`refs/dotln/checkpoint/WO-056/2`, verified byte-for-byte. Only 21 generated
projections overlapped; those were put back to their committed bytes and
regenerated afterwards. No merge commit exists. The live receipts are
unaffected: upstream changed none of the verification, repair, source-change
or transport sources they exercised, and the published log still replays.
`docs/control/current.md` carries `main`'s projection until the next legal
transition rewrites it.

## Adversarial pass

By operator direction one read-only subagent attacked the validator, replay,
fixture and collector ([D005](decisions.md#wo-056-d005)). Seven findings were
accepted and fixed, the most important being that the first replay reported
the negative retained even with the fold's guards removed. Its runtime
observations that this order does not repair are boarded up in D005's
follow-up. The operator's passing receipts later exposed one more gap: a
receipt with a withheld log could be relabelled to another live harness; each
episode's reported usage source now names the launched harness.

## Limits

- One synthetic two-clause repository, one passing episode per harness. The
  capability stays at level 1.
- The receipt contract detects inconsistency and careless relabelling. It is
  not authentication: the log's launch fields are not hash-bound.
- Criterion 2's repair and re-verification facts are host observations without
  a published log; the re-verification store's first event records a physical
  path.
- A Codex receipt on a machine with a private Node path withholds its log, so
  it evidences criteria 1 and 2 only ([D002](decisions.md#wo-056-d002)).
- Whether a verifier's diagnosis should have a durable field, and whether
  hosts should retain refusal details, are planner follow-ups (D007, D008).
- Product 03 still says WO-056 "owns" the live verifier proof in two places;
  03 was outside this order's write-backs.
- Trusted host, first-proof confinement and an append-only log the implementer
  has no tool to write: the WO-052/054/055 limits apply unchanged.

## Goal alignment and process cost

The promised benefit was live evidence that an implementer cannot certify
itself. The observed outcome is that and more: the live attempts showed the
host's admission contract had only ever been satisfied by doubles that copy
the host's own strings, which no fixture could have found. Rule beating was
the recurring risk and shaped three refusals: no coaching of the verifier
through the fixture's contract text, no counting a refused result toward
criterion 1, and no flag that the recorded facts do not support. The cost to
the operator was three rounds of live commands, a scope decision and a
failed feedback audit attempt. That attempt used the executor's own selector
suggestion (`claude-fable-5` at xhigh); exceeding the verifier's USD 3.00 cap
is the likely cause, an inference because the host kept no detail. The
recorded WO-140 and WO-144 selectors were the evidence to use, and the
integration of `main` would have required a fresh audit in any case.

Usage, `node scripts/harness.mjs usage 53a10a33-1029-40aa-86e2-a5441e6dbf5e`, source `claude-transcript-message-usage`, scope dispatch: at 2026-09-20T05:46:38.840Z, 126,428,174 total tokens (125,449,878 cached input, 651,099 cache write, 596 input, 326,601 output); reasoning tokens and cost are unknown (counters unavailable). Activity: 322 steps, 232 commands. Subagents: 1 of 20 (exact-observed); the uncounted remainder is unknown. The count excludes the operator's live episodes, whose reported usage is in the receipts: USD 0.26 and 0.26 for the two refused Claude verifier episodes, USD 0.91 for `claude-live-3`, and 152,725 tokens with no reported cost for `codex-live-3`.
