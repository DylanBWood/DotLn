# WO-099 first repair — the judgment path the cadence actually travels

**Source.** [VER-001](../../verifications/WO-099/VER-001.md) failed this order
on four blocking findings: the resident could not launch the judge once the
dispatch-time subject differed from the declared one and a fresh passing
observation did not clear an existing hold (F1); the capsule silently omitted
untracked work, changed paths past 100 and diff text past 100,000 characters,
any of which can carry the only drift (F2); the current Contributor build broke
the historical authority-identity check (F3); and the selected feedback edition
was recorded before the final source set (F4). Canonical control recorded
`RepairRequested` against VER-001 at 2026-09-20T18:55:06.873Z from this
`resume: fix` dispatch. D011–D014 own the four follow-ups; this receipt maps
each to what changed and the executed evidence for it.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

No effective in-session readback of model or effort exists in this harness, so
both are the operator-selected values the dispatch supplied. The version is
what the installed `claude` binary reports, an observation of the binary rather
than of this session; the build's recorded profile remains `claude-code-2.1.263`.

**Process cost:** 31,982,514 total tokens (270 input, 31,556,178 cached input,
305,573 cache-write, 120,493 output) over 158 recorded steps and 155 commands,
from `harness usage` at 2026-09-20T19:16:27Z, scope `dispatch`, source
`claude-transcript-message-usage`. Reasoning-output tokens and dollar cost are
unknown: those counters are unavailable in this harness. The one gate row this
session recorded is `npm test` at 264,381 ms. No subagent was planned or
launched against the repository cap of 20; the repair stayed in one writer
session. One paid live episode was run under the operator's explicit
authorization in this dispatch: the Codex self-host feedback audit F4 requires.

## The four findings

| Finding | What changed | Why this is the repair rather than a patch |
| --- | --- | --- |
| F1 — the resident cannot reach the judge or apply the clearance | `startCliEpisode` now rebuilds the whole request through `buildMissionCheckRequest` from the capsule it observed at dispatch and this episode's identity, so the command payload names the capsule being judged; `cliActorRequest` no longer swaps a subject into a stale command. `ResidentHost` appends `MissionHoldCleared { origin: "verified-repair" }` from the verdict the fold derived when an admitted `on-mission` covers a capsule the held judgment did not. [D015](decisions.md#wo-099-d015). | The authorization is bound to the subject hash on purpose: that binding is what stops a capsule being swapped under a grant. The defect was that the episode observed one capsule and asked permission for another, so the fix joins both to the observed one instead of loosening the check. The clearance is an event, not a fold effect, so it stays replayable and auditable. |
| F2 — incomplete source projection can certify drift as on-mission | `observeMission` lists tracked **and** untracked paths, refuses past the declared path bound instead of slicing, and assembles diff text one whole path at a time — untracked work rendered as the new file it is — naming anything that does not fit in `MissionDiff.omittedPaths`. `validateMissionCheckResult` cannot record `on-mission` while that list is non-empty. `missionClauses` carries an oversized clause in parts rather than cutting it, and decision/thesis/exclusion context declares its own cut in the text the judge reads. All bounds are named in one exported `MISSION_CAPSULE_BOUNDS`. [D016](decisions.md#wo-099-d016). | Branch commits are forbidden here before final review, so new work is ordinarily untracked during the exact interval this episode supervises: a diff that cannot see it certifies a new out-of-surface file as on-mission. Sections are chosen smallest first so one generated log cannot crowd every source change out of the capsule. The recorded cost: on a worktree whose generated evidence exceeds the bound the cadence holds as `unknown` rather than passing, which D016's follow-up hands to planning. |
| F3 — the saved Contributor identity no longer passes its historical proof | `contributorLoadoutBeforeMissionCheck` reconstructs the graph as it stood at WO-042's baseline — the current graph without the one presence policy WO-099 added — and `authority-evidence` asserts that this is the *only* difference before compiling it, then compiles both identities in the same run. The current build's new identity is recorded in a new authority edition, WO-099 revision 001, selected in `docs/evidence/current.json`. [D017](decisions.md#wo-099-d017). | D009 accepts a new identity for the live build while the historical one keeps its own; the gate exists to prove the old build still compiles to the hash its filed receipts carry. Asserting the graph delta first is what stops the reconstruction from silently becoming a hand-edited graph that happens to hash correctly. The WO-146 edition is immutable, so the current build is recorded in a new one. |
| F4 — the selected feedback evidence is stale against the delivered source | A fresh live Codex self-host audit and independent live verifier episode were run over the completed source and recorded as WO-099 feedback revision 002, which `docs/evidence/current.json` now selects. The stale edition is untouched. | The repair changed four more registered feedback sources (`cli-actor.ts`, `cli-actor-contract.ts`, `resident-state.ts`, `loadouts/contributor.ts`), so the edition had to be recorded after the last source change, not before. Filed editions are immutable; a new revision is the only honest record. |

## Regressions added

- **`WO-099 VER-001 F1`** drives the real `ResidentHost` over the single-phase
  shape the Contributor build actually declares. It holds on an out-of-surface
  diff, commits a repair, and asserts that the next pulse reached the model
  runner with the repaired capsule's hash, that the hold was retired by a
  `MissionHoldCleared` event the resident appended with `origin:
  "verified-repair"`, and — as a negative control that keeps the rebuild
  load-bearing — that the old request shape is still refused with
  `profile-refused`.
- **`WO-099 VER-001 F2`** reproduces the verifier's three probes and one more:
  an untracked out-of-surface file is judged as drift over a claimed pass; the
  400th changed path is still named while the 401st refuses; an oversized file
  is named in `omittedPaths` while the source change beside it is still carried
  in full, and a claimed pass over it is `unknown`; and two contracts differing
  only after byte 4,000 no longer project to identical clauses.
- **`executor-supports.test.ts`** now pins both Contributor identities in one
  run, beside the same pair in `authority-evidence`.

## Executed evidence

| Check | Result |
| --- | --- |
| `npm test` | **21 passed, 0 failed, 65 fresh tasks, 264.38 s**, gate row 264,381 ms recorded 2026-09-20T19:16:02.916Z |
| `npm run test:docs` | **19 passed, 0 failed, 18.92 s**, including `authority-evidence` (F3) and `feedback-evidence` (F4), both of which failed for the verifier |
| `node --test packages/skeleton/dist/test/mission-check.test.js` | 6/6 pass, the four original cases plus the two repair regressions |
| `node --test` over `resident`, `resident-actors`, `presence`, `executor-supports` | 38 tests, 0 failed |
| `node scripts/authority-evidence.mjs --check` | Historical Contributor compiles to `fnv1a64:06245f5c581212f1`; the live build carries `fnv1a64:87aa6e1263d6d74d`; 34 bundle comparisons |
| `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --transport codex-cli-exec --model gpt-6-astra --effort max` | `{"phase":"complete","fixtures":10,"savedInstructionBytes":1192,"verifier":"codex-cli-exec"}`, 45.6 s, operator-authorized in this dispatch |
| `node scripts/feedback-evidence.mjs --check` | Ten passing regressions, ten removal failures, 1,192 fewer instruction bytes, over revision 002 |
| `npm run publication:check` | 272/272 headings; both editions current after refreshing the two stale source locks the product edit invalidated |
| `node scripts/harness.mjs emit` / `check` | 31 generated surfaces |
| `git diff --check` | Clean |

## What this repair does not establish

- The live evidence is unchanged from the original dispatch: one synthetic
  worktree, one planted drift, one 18.8 s unattended row. The repaired resident
  path — a cadence that judges changed work and retires its own hold — is
  proved by fixtures with process doubles, **not** by a live run. No unattended
  hour (WO-111), no repair loop (WO-055, WO-100).
- The capsule bounds are chosen, not derived: 400 paths and 600,000 characters
  are sized from this worktree's own 379,845-character tracked diff over 56
  paths. A session whose generated evidence exceeds them holds as `unknown`
  every pulse until a human answers, which is honest but unhelpful; D016's
  follow-up names the selection policy that would fix it as planning work.
- An `unknown` hold raised by an unavailable verifier still needs a human
  answer when the work has not changed, because D003 requires a different
  capsule hash to clear. That is preserved deliberately, not repaired.
- `npm test` and the documentation gate ran in this session, which also
  authored the repair. Independent verification is a separate dispatch.
