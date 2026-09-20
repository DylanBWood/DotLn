# WO-099 second repair — the host's evidence survives the model, and the capsule stays inside the worktree

**Source.** [VER-002](../../verifications/WO-099/VER-002.md) failed this order on
two blocking findings after accepting the first repair: the resident discarded a
structural drift the host had already proved whenever the model episode failed
(F1), and an untracked symlink let the capsule copy bytes from outside the
worktree in front of the judge while a claimed pass was still admitted as
`on-mission` (F2). Canonical control recorded `RepairRequested` against VER-002
at 2026-09-20T19:34:07.153Z from this `resume: fix` dispatch, capturing
`refs/dotln/checkpoint/WO-099/9`. D018 and D019 own the two follow-ups; D020 and
D021 record what this repair decided.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

No effective in-session readback of model or effort exists in this harness, so
both are the operator-selected values the dispatch supplied. The version is what
the installed `claude` binary reports, an observation of the binary rather than
of this session; the build's recorded profile remains `claude-code-2.1.263`.

**Process cost:** 24,855,821 total tokens (246 input, 24,453,075 cached input,
319,784 cache-write, 82,716 output) over 143 recorded steps and 128 commands,
from `harness usage` at 2026-09-20T20:17:12Z, scope `dispatch`, source
`claude-transcript-message-usage`. Reasoning-output tokens and dollar cost are
unknown: those counters are unavailable in this harness. This session recorded
two `npm test` gate rows, 257,854 ms and 256,979 ms; the second one, at
2026-09-20T20:17:04.571Z, covers the final tree. No subagent was planned or
launched against the repository cap of 20 (`count` 0, `countKind`
`exact-observed`); the repair stayed in one writer session. One paid live
episode ran under the operator's explicit authorization in this dispatch: the
Codex self-host feedback audit the fresh edition requires.

## The two findings

| Finding | What changed | Why this is the repair rather than a patch |
| --- | --- | --- |
| F1 — a model failure erased a drift the host had already proved | `foldMissionJudgment` now normalizes an episode that failed *after* observing its capsule through the same `validateMissionCheckResult` call an `unknown` model result takes, so the structural findings stand: the fold records `drift`, the resident appends `MissionDriftObserved`, and the hold names both the finding and the missing model judgment. A capsule that was never observed is still `unknown` and still holds. [D020](decisions.md#wo-099-d020). | The host and the model are two different sources of a finding, and only one of them failed. `runMissionCheck` already kept them apart; the cadence's own path folded the absence of a worker result into an empty `unknown`, so the one mechanism meant to notice an out-of-surface edit while the operator is away discarded the evidence it already held. Putting the normalization in the fold puts it on the path every recorded observation travels, and keeps the verdict derived rather than claimed. |
| F2 — an untracked symlink crossed the capsule's worktree boundary | `untrackedSection` now `lstat`s before it reads: a symlink is carried as the link Git records — `new file mode 120000` with its target as the content — and never followed; a directory, device, socket or fifo is named as omitted; a regular file's size is checked before its bytes are allocated, and its resolved path must still sit inside the canonical worktree. Every declared `MissionSource` read goes through the same containment and pre-allocation bound. [D021](decisions.md#wo-099-d021). | A repository-relative name is not proof that the bytes behind it belong to the repository, and the capsule is the only thing this episode is allowed to see. Representing the link instead of refusing it keeps D016's complete-diff rule — the judge still sees that a link was added and where it points — while the target's bytes stay where they are. Containment is checked on the resolved path rather than the spelling, because a contained link is ordinary here: `AGENTS.md` is a tracked `120000` link to `CLAUDE.md`. |

## Regressions added

- **`WO-099 VER-002 F1`** drives the real `ResidentHost` over the single-phase
  Contributor shape twice — once with the unavailable runner, once with a runner
  whose finding names nothing the capsule supplied, so the transport refuses it
  as `invalid-result`. Both hold as `drift` naming `contract:surfaces` against
  `docs/product/00-vision.md`, record that verdict in `missionChecks`, append
  exactly one `MissionDriftObserved` carrying the same findings, and name the
  capsule the episode observed. The reason must contain both `found drift` and
  the failure code, so a proved drift is still distinguishable from a silent
  verifier.
- **`WO-099 VER-002 F2`** plants a marker file beside the worktree and links to
  it from inside the declared surface: the capsule names the changed path,
  carries `new file mode 120000` with the target, and contains none of the
  target's bytes, with `omittedPaths` empty. A second link outside the declared
  surfaces is still judged as the path it is. A declared contract path that
  resolves outside the worktree refuses with `profile-refused`. An untracked file
  past the diff bound is named as omitted without being read.
- The existing in-surface unavailable-verifier fixture is the control that keeps
  the F1 change narrow: an episode with nothing structural to prove still holds
  as `unknown` with no correction event.

## Executed evidence

| Check | Result |
| --- | --- |
| `npm test` | **21 passed, 0 failed, 65 fresh tasks, 256.98 s**, gate row 256,979 ms recorded 2026-09-20T20:17:04.571Z, exit 0, code identity `7b7eff50…`. An earlier run over the same code identity passed in 257.85 s before a test comment was corrected. |
| `npm run test:docs` | **19 passed, 0 failed, 18.69 s**, including `authority-evidence` and `feedback-evidence` |
| `node --test packages/skeleton/dist/test/mission-check.test.js` | 8/8 pass, the six prior cases plus the two VER-002 regressions; filed as `mission-fixtures.tap` |
| `node --test` over `resident`, `resident-actors`, `presence`, `executor-supports` | 38 tests, 0 failed, 249.96 s |
| `node scripts/harness.mjs emit` / `check` | 31 generated surfaces; the runtime snapshot moved to `.runtime/harness/33c90ea6d965c340` because the compiled `resident-state.js` changed |
| `node scripts/authority-evidence.mjs --check` | Verified against the new WO-099 revision 002 edition; 34 bundle comparisons, both Contributor identities reproduced |
| `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store docs/control/local/wo099-selfhost-003 --transport codex-cli-exec --model gpt-6-astra --effort max` | `{"workOrderId":"WO-011-feedback-audit","phase":"complete","fixtures":10,"savedInstructionBytes":1192,"verifier":"codex-cli-exec"}`, operator-authorized in this dispatch |
| `node scripts/feedback-evidence.mjs --check` | Ten passing regressions, ten removal failures, 1,192 fewer instruction bytes, over the new revision 003 |
| `npm run publication:check` | 272/272 headings; both editions current after refreshing the two source locks the product edit invalidated |
| `npm run release -- prepare --local` | `WO-099 target v0.36.0 remains current; no files changed` |
| `git diff --check` | Clean at the final authored tree |

Two evidence editions had to be re-recorded because the repair changed runtime
source. The harness emit moved the pinned runtime snapshot, which changed the
generated hook bytes the authority transcript records, so the current build is
filed as **authority WO-099 revision 002**; the filed revision 001 is untouched.
`resident-state.ts` is a registered feedback behavior source, so the audited
edition had to be recorded after the last source change: the live Codex
self-host audit and its independent live verifier episode are filed as
**feedback WO-099 revision 003**, and `docs/evidence/current.json` selects both.
The regressions and the 1,192-byte reduction were identical before and after;
only the source subject hash moved.

## What this repair does not establish

- The live evidence for the order itself is unchanged: one synthetic worktree,
  one planted drift, one 18.8 s unattended row, filed in `live.json`. Neither
  new finding is exercised by a live run; both are proved by fixtures with
  process doubles. No unattended hour (WO-111), no repair loop (WO-055, WO-100).
- The symlink boundary is enforced at `lstat` and `realpath` time. A path that
  is replaced between that check and the read is not defended against; the
  capsule is a read-only observation of a worktree the operator owns, not a
  sandbox against a hostile filesystem.
- An `unknown` hold over unchanged work still needs a human answer, because D003
  requires a different capsule hash to clear. F1 changes which cases are
  `unknown`, not that rule.
- D016's known limitation stands: on a worktree whose untracked generated
  evidence exceeds the diff bound, the cadence holds as `unknown` every pulse
  until a human answers. That is planning work, not this repair.
- `npm test`, the documentation gate and the live audit all ran in the session
  that authored the repair. Independent verification is a separate dispatch.
