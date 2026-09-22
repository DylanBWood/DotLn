# WO-152 repair — VER-001 F1

Dispatch: `resume: fix`, 2026-09-22, Claude Code executor. This record covers
the single finding VER-001 routed to repair. VER-001 and the implementation
report stay as written; `docs/evidence/WO-148/decisions.md` is still untouched.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The model is the session's own model id. Effort is operator-attested: Claude
Code exposes no effective-effort readback, so it is not claimed as one.

## F1 — required evidence re-mint and live self-host episode were absent

VER-001 failed the subject because acceptance criterion 4 marks the edition
re-mint and its live self-host episode required, and WO-152-D004 had recorded a
deliberate deviation from them. The repair satisfies the criterion as written.
No operator scope expansion arrived, so the amendment alternative D007 names was
not available; the full reasoning, including the correction to D004, is
[WO-152-D008](decisions.md#wo-152-d008).

D004's measurement is not withdrawn and was not the error. Both edition checks
did pass on the retained editions before this repair, re-measured at entry:
`node scripts/authority-evidence.mjs --check` exit 0 and
`node scripts/feedback-evidence.mjs --check` exit 0, the latter still printing
"Retained immutable live feedback audit: behavior source is unchanged apart from
component release labels." What was wrong was treating a required criterion's
premise as the executor's to waive.

## The editions, and the measured reason each changed

| Edition | Reason it changed |
| --- | --- |
| `authority/001` | **Identity only.** `authority.json` is **byte-identical** to `WO-149/authority/002/authority.json` (`cmp` exit 0). The two `bundle-diff.json` files differ in exactly one line, `comparison`: `v0.16.0 to WO-149 revision 002 unequipped build` → `v0.16.0 to WO-152 revision 001 unequipped build`. No bundle hash moved. |
| `feedback-001` | **Audited source identity only.** The freshly generated `feedback.json` differs from `WO-149/feedback-002/feedback.json` in exactly one field, `subject` (`sha256:8668a869…` → `sha256:d04b7506…`). `policyHash`, all ten fixtures, the context projection and the maturity table are byte-identical. `readFeedbackSource` hashes raw source bytes, which include the component release labels of `package.json` and `package-lock.json`, while `evidenceSourceContent` normalizes those same labels for the staleness comparison — which is why D004 measured no staleness and the subject hash still moved. |

`validateSelfhost` asserts the recorded audit's subject equals the current
source subject, so the WO-149 streams could not be carried onto the moved
subject hash and the live episode is not optional.

`docs/evidence/current.json` now selects WO-152 revision 001 for `authority` and
`feedback`; `artifact-identity` and `verification` stay at WO-146. The console
self-host case was re-pinned with
`npm run evidence:console -- --record-current-selfhost`; all five console cases
match. Earlier editions keep their bytes.

## The live self-host episode, and the two refusals before it

One store, `.runtime/feedback-audit-wo152-r001`, one command
`cmd_3b843b5108e71409`, one pinned `inputHash fnv1a64:48362554177dea0e` across
three attempts. Transport `claude-cli-print`, model `claude-sonnet-5`, effort
`xhigh`, CLI 2.1.278, limits 600,000 ms and USD 5.00; `effectiveModel` and
`effectiveEffort` are recorded `unknown` because the transport exposes neither.

| Attempt | Episode wall-clock | Outcome | Tokens | USD |
| --- | --- | --- | --- | --- |
| 1 | 185,946 ms | `WorkerInterrupted` `invalid-result` | 575,138 | 1.4058206 |
| 2 | 215,761 ms | `WorkerInterrupted` `invalid-result` | 291,652 | 1.311126 |
| 3 | 225,182 ms | **`WorkerCompleted`**, matrix `complete` | 873,798 | 1.5194518 |

Episode wall-clock is from the store's `WorkerAttemptStarted` and terminal event
timestamps. Tokens and USD are the `claude-result-envelope` rows in
`docs/control/local/process/usage.jsonl`; their launch durations are 188,651 ms,
216,527 ms and 226,005 ms. Total **1,740,588 tokens and USD 4.2363984** across
631,183 ms of launch wall-clock. The accepted attempt returned a complete
two-criterion matrix — `AC-causal-fixtures` pass, `AC-context` pass, 0 findings —
over 10 fixtures and 1,192 saved instruction bytes.

The store is append-only and retains both refusals, as WO-149 D006 required of
the same class of recovery. **The two refusals are not a schema rejection.**
`decodeResult` reaches `invalid-result` only after the CLI has exited 0 with
subtype `success` and `structured_output` present; a refused schema raises
`transport-failed`, which is what WO-148 D009 observed after 1.28 s. These ran
186–226 s and cost a full model turn each, so the Claude CLI accepted the
evidence-worker schema every time and D004's "reopen if another request kind's
schema is refused" condition is **not** met. The specific contract reason for
each refusal is **unknown**: `WorkerInterrupted` carries only the code, the CLI
prints only the code, and raw output is discarded. That gap is
[WO-152-D009](decisions.md#wo-152-d009) and deferred queue item
`adjacent-0002`; its fix touches declared feedback sources, which would stale the
editions just minted and demand a second paid episode.

The third launch ran through a throwaway runner under ignored `.runtime/` that
teed the transport result and passed the same usage hook the CLI passes. The
captured wire was read once and deleted; no raw model output is retained.

## Executed checks

| Check | Result |
| --- | --- |
| `node scripts/authority-evidence.mjs --check` | **Pass** on `WO-152/authority/001`: 34 bundle comparisons. |
| `node scripts/feedback-evidence.mjs --check` | **Pass** on `WO-152/feedback-001`: ten passing regressions, ten removal failures, 1,192 saved instruction bytes. It took the **strict** branch and ran `validateSelfhost` against the fresh live logs — the retained-edition line is gone, which is the observable difference criterion 4 asked for. |
| `npm run evidence:console -- --check` | **Pass**: all five cases (`wo009`, `selfhost`, `control`, `refutations`, `missing`) match in JSON, terminal and HTML. |
| Focused WO-152 mission-check regression | **Pass**, 1/1 in 125.082 ms (file duration 182.31 ms); the step reports no duplicate item across 7 emitted enums for the unchanged and the renumbered contract. |
| `npm test` | **Pass: 25 suites, 0 failed, 283.21 s, 69 fresh tasks** (recorded gate row 283,212 ms). |
| `node scripts/release.mjs check-surfaces --local` | **Pass**, 44 PASS rows, no FAIL, at v0.41.1 / skeleton 0.35.1. No `packages/*/src` file changed in this repair, so no component bump is required; the console change is fixtures. |
| `git diff --check` | **Clean.** |
| `npm run format:check` | **Clean.** |
| `node scripts/check-publication.mjs` | **Pass.** |
| `node scripts/meta.mjs --check` | **Pass.** |

## Scope and limits

- This repair adds no source change. `packages/skeleton/src/mission-check-protocol.ts`
  and the two test files are exactly as VER-001 judged them, so criteria 1, 2, 3
  and 5's code subject are untouched and VER-001's findings on them stand.
- `effectiveModel` and `effectiveEffort` for the live episodes are **unknown**;
  the transport records the launch selection, not a readback.
- The reason each of the two refused attempts was rejected is **unknown**, for
  the recorded reason above.
- Queue: `adjacent-0001` and `adjacent-0002` are both deferred with their
  dispositions and nothing is left running, but **their `target` is still the
  literal string `planning`, not a public follow-up identifier.**
  `repair-complete` advised: "adjacent-0001: deferred work needs a current
  public FUP identifier as its target." The public entries now exist —
  `FUP-81651a93f657301a` from WO-152-D004's `followup` and
  `FUP-ed431cc1c8ca9a52` from WO-152-D009's, both synthesized by
  `npm run plan -- followups --sync` — but the retarget could not be applied:
  queue mutation requires the executor/fixer phase, which the recorded
  transition closed ("adjacent queue: mutation requires the selected
  executor/fixer phase"), and repeating a recorded transition to clear a
  warning is not available. `adjacent-0001` carried the same literal target
  through `implementation-ready` and VER-001, so this is a pre-existing,
  non-blocking condition that a later executor dispatch should close by
  re-disposing both items onto those two FUP ids.
- `docs/evidence/WO-152/decisions.md` gained WO-152-D009's `followup` string and
  `docs/planning/followups.json` was synced **after** the `repair-complete`
  transition, together with this receipt and the refreshed decisions index. No
  file under `packages/` changed, so the code identity the gate measured is
  unchanged.
