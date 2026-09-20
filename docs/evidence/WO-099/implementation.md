# WO-099 implementation evidence

Dispatch: `resume: next`, 2026-09-20. Subject: the uncommitted `wo-099` worktree.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}
No effective in-session readback of model or effort exists in this harness; the
model and effort are the operator-selected values the dispatch supplied. The
version is what the installed `claude` binary reports, an observation of the
binary rather than of this session; the build's recorded profile is
`claude-code-2.1.263`.

The resident now judges the work it is running. On the Contributor build's
absence cadence it dispatches a read-only `mission-check` episode over a hashed
capsule — the active contract, an optional story contract, the diff against the
base, the last N structured decisions, and the vision theses and exclusions —
and receives `MissionCheckObserved { verdict, findings[] }`. A verdict other
than `on-mission` holds every unattended dispatch until a human answers or a
fresh judgment passes over changed work; a `drift` also appends the
`MissionDriftObserved` correction event beside the hold. The judge sees no
implementer narrative, runs with no model tools in an empty scratch directory,
and decides nothing else.

Decisions: [D001–D010](decisions.md), including the WO-145 economy trial
selected for this order, the new saved Contributor build identity, and the
same-day correction to the capability level once the live row existed.
Independent verification and final review remain separate dispatches.

## Acceptance evidence

| Criterion | Executed evidence at this cutoff |
| --- | --- |
| 1 — the four verdicts with doubles | `mission-check.test.ts` case 1 over real scratch worktrees: an out-of-surface diff returns `drift` naming `contract:surfaces` **although the double claims `on-mission`**; a contract clause edited after the capsule was pinned returns `drift` naming `contract:criterion:1` with the observed contract hash as its evidence; an on-contract diff returns `on-mission` with no findings; an unavailable verifier returns `unknown` carrying the transport failure. Two further paths: a finding naming nothing in the capsule refuses the result into `unknown`, and a model drift naming a supplied thesis stands on its own evidence. |
| 2 — correction, hold, refusal and clearance | `mission-check.test.ts` cases 2 and 3 drive the real `ResidentHost` with a process double. A drift sets `dispatchHeld`, appends exactly one `MissionDriftObserved` whose episode matches the hold, and the fold records its event id. The next tick records one `ScriptEpisodeRefused` naming the drift and dispatches nothing. A human answer clears it and the following tick dispatches again. The check itself is not refused while it holds the work. Clearance by re-judging the same bytes is refused, as is a fresh capsule that still drifts; changed work that now passes clears it. |
| 3 — the unattended row | **Observed**, [live.json](live.json), recorded 2026-09-20T18:20:36Z by `scripts/evidence-mission-check.mjs` under the operator's explicit authorization in this dispatch (they chose that I run it from this session on Codex / `gpt-6-astra` / xhigh rather than run it themselves). Detached Node parent → resident → supervised `codex-cli-exec` 0.155.1, `mission-check-v1` profile, `origin: actor`, operator away before and after. The planted drift — a diff editing `docs/product/00-vision.md`, outside the declared `packages/fixture` surface — returned `drift` over two findings: the host-derived `contract:surfaces`, and `contract:non-goals`, which the live judge found on its own (`hostDerivedFindings` lists only the first). The hold was raised, one correction event recorded, the next dispatch refused naming that hold, and the human answer released it, in 18.8 s. Identifiers are reduced to shapes; no transcript, path or session identity is filed. An earlier run at 18:20:01Z made the same observations under a misleading `verifiedPromotion` field name; the collector was corrected to `phaseAfterClearance` and the row re-recorded. |
| 4 — write-backs | 02 §Feedback records the second producer of a correction and why it is a distinct type; 03 §Operator-presence policy records the cadence, the capsule split, the host-derived verdict and the hold with both clearances; the dated capability reassessment files `runtime.resident` at the **live-evidenced** level on the strength of the row above, naming the unattended hour, the repair loop and the single synthetic worktree as its remaining gate; the inherited ledger duty is discharged by this decisions file and its rows in the decisions index (work-order index, WO-099). Product source locks refreshed; `npm run publication:check` passes. |
| 5 — checks and dependencies | `npm test` passed 21 suites / 65 fresh tasks, 0 failed, in 293.87 s at 2026-09-20T18:26:07.363Z, code identity `f0a986026cc8b40d3cb083b61386e86687742fab065e323b6e60ba77be41d254` over tree `da6e2ff4ce2124f9aa4ce8b8f68153cdf98423a2`, executed outside the harness sandbox (`inForce: false`). `git diff --check` is clean. No new dependency; no new schema version — two event types join the existing resident slice under schema 1. The bundle pins were regenerated (`node scripts/harness.mjs emit`, 31 surfaces; only hashes and the snapshot path changed, no rule text). A fresh feedback evidence edition was required because `reactor.ts`, `resident-state.ts`, `cli-actor.ts` and `loadouts/contributor.ts` are registered feedback sources: the live Codex selfhost audit completed (`phase: complete`, ten fixtures, 1,192 saved instruction bytes), its immutable audit and verifier streams are filed in `feedback/`, `docs/evidence/current.json` selects the WO-099 edition, and `feedback-evidence --check` passes. Adding the build's own presence policy changes the saved Contributor identity to `fnv1a64:87aa6e1263d6d74d` ([D009](decisions.md#wo-099-d009)); the live test pin moves and WO-042's recorded hash stays with its own date. Release target v0.36.0 (minor), skeleton 0.32.0 with the console pin and lockfile following. |

## What the mechanism does not establish

- One synthetic worktree, one planted drift and one live launch. No unattended
  hour (WO-111) and no repair loop (WO-055, WO-100) is claimed. The live
  judge's second finding shows the mechanism is not only its structural rules,
  but one observation is not a reliability claim.
- A judgment is an observation about a diff, not verification of the work.
  `scriptResultVerified` still returns `false` for every CLI worker, so a
  mission check never advances the presence curve.
- A restart that loses an unobserved episode does not hold; only an observed
  episode does.
- The saved Contributor build declares no runtime capability, so its compiled
  phase is a NoOp naming `actor.cli-worker` until a host supplies it.

## Recorded after the handoff transition

Two records were completed after `implementation-ready`, neither of them code:

- On operator direction, the resident-binding gap this order surfaced is filed
  as a planning candidate,
  [Binding a resident to the active work](../../planning/resident-binding-to-active-work-2026-09-20.md),
  registered in the follow-up feed as `FUP-6c22a74a648a3b56` (untriaged). It
  observes that nothing aims a resident at the worktree of the active order,
  that a store's configuration is immutable so each order needs a fresh one,
  and that a stale store keeps judging a finished worktree. Deriving what work
  to do remains WO-100; this candidate only concerns aiming an existing policy.
- [D008](decisions.md#wo-099-d008)'s `effect.wallSecondsPerOrder` was corrected
  from 3.15 to `null`. The per-iteration figures are measured; the per-order
  total multiplied them by an iteration count this dispatch never counted, so
  it was an invented quantity and is now recorded as unknown.
