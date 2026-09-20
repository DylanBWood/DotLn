# WO-099 third repair — the result contract is closed under its own normalization, and a history the capsule cannot carry is named

**Source.** [VER-003](../../verifications/WO-099/VER-003.md) failed this order on
two blocking findings after accepting the second repair: an admitted capsule
with more than a hundred host-derived findings broke resident observation
before any hold was recorded (F1), and a decision history that exists but
cannot be read was silently replaced with an empty one over which a pass was
admitted, while a zero-decision window returned the whole history (F2).
Canonical control recorded `RepairRequested` against VER-003 at
2026-09-20T20:42:56.794Z from this `resume: fix` dispatch, capturing
`refs/dotln/checkpoint/WO-099/13`. D022 and D023 own the two follow-ups;
D024–D027 record what this repair decided, and D028 records the integration
of `main` the operator expanded this dispatch to include.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"unknown","source":"operator-attested"}

The model is the operator's `/model` selection at the start of this session,
`Fable 5.1`; no effective in-session readback of model or effort exists in
this harness, and no effort value was supplied, so effort is recorded as
unknown rather than invented. The version is what the installed `claude`
binary reports, an observation of the binary rather than of this session; the
build's recorded profile remains `claude-code-2.1.263`.

**Process cost:** 19,624,397 total tokens (2,134 input, 19,099,499 cached input, 357,120 cache-write, 165,644 output) over 80 recorded steps and 73 commands, from `harness usage` at 2026-09-20T21:28:52.052Z, scope `dispatch`, source `claude-transcript-message-usage`. Reasoning-output tokens and dollar cost are unknown: those counters are unavailable in this harness. The final response carries the handoff reading. This session recorded two `npm test` gate rows, 268,006 ms at 2026-09-20T21:18:54.692Z on the integrated tree before the retimed bump and 268,056 ms at 2026-09-20T21:28:09.403Z on the final tree; a third run was stopped at its boundary before recording so a source refinement could land first. No subagent was planned or launched against the repository cap of 20 (`count` 0, `countKind` `exact-observed`); the repair stayed in one writer session. Two paid live episodes ran under the operator's explicit authorization in this dispatch: the Codex self-host feedback audits for editions 004 and 005, 40,286 ms and 60,169 ms.

## The two findings

| Finding | What changed | Why this is the repair rather than a patch |
| --- | --- | --- |
| F1 — the host's own normalized result was refused at admission | `validateMissionCheckResult` now computes the host's structural findings first and applies the hundred-finding bound only to what the judge adds beyond them; every host-derived reason is cut to one admitted line; the normalized result therefore passes the same validation again unchanged, which `assertCliObservation`, the fold and the verified-repair clearance all require. `MISSION_CAPSULE_BOUNDS.modelFindings` names the judge's bound and the model-facing schema uses it. [D024](decisions.md#wo-099-d024). Separately, the resident host now records a CLI judgment the actor contract refuses as the failed episode it is — `invalid-result`, with its launch and the capsule the episode observed — instead of letting the refusal throw out of the observation transaction, so the fold reaches the capsule and holds whatever it proves. [D025](decisions.md#wo-099-d025). | One bound served two producers. The judge's is a model-input limit; the host's findings are bounded by the capsule's path and clause bounds and by the one-line rule every finding already meets. Closing the contract under its own normalization removes the reproduced failure; recording a refused result as a failed episode removes the class, because whatever refuses a result at admission, the episode is recorded, the capsule is kept, and the hold's reason names the missing judgment beside any drift the host proved. |
| F2 — a present, unreadable decision history read as absent | `readDecisions` `lstat`s the declared path first: only `ENOENT`/`ENOTDIR` mean the history does not exist yet. Every other refusal of the bounded reader — size, containment, a special file, a stat the host cannot make — becomes `observation.omittedDecisions`, a named reason carried in the capsule and shown to the judge with an instruction that no pass can be certified while it is set; `validateMissionCheckResult` turns a claimed pass over it into `unknown`, which holds. `missionDecisions` returns the empty window for a zero limit instead of `slice(-0)`'s whole list, and a zero window reads nothing at all. [D026](decisions.md#wo-099-d026). | Absence is never inferred from a failed read. Naming the omission rather than refusing the observation keeps the diff judged — the structural findings are still derived and the judge still sees the work — while the hold stays explicit, exactly as `omittedPaths` already does for text that did not fit. The capsule keeps `mission-check-v1`: the shape has not shipped and no recorded capsule exists outside fixtures. |

One adjacent defect was met and boarded up rather than fixed: the fold words an
`unknown` verdict the host derived from an answered judge as `returned no
judgment (verifier unavailable)`, which is wrong about the cause. The wording
lives in `resident-state.ts`, a registered feedback behavior source, so the
correction would demand yet another live self-host audit for a parenthetical.
[D027](decisions.md#wo-099-d027) records the deferral with its follow-up, and
the worktree queue carries it as `adjacent-0001`, disposed `deferred` to that
decision.

## Integration of `main` on the operator's scope expansion

Mid-dispatch the operator merged WO-110 into `main` and, on `scope expand:
merge it now`, directed this session to integrate rather than leave it to the
final review. [D028](decisions.md#wo-099-d028) is the receipt. The uncommitted
work was preserved in the retained stash
`9e50af828bfe82b57d8c01c0f61e98a70104ad36` (`wo-099-integrate-main-2026-09-20`),
`wo-099` fast-forwarded from `920c5fd2` to `47910753` with no commit authored,
and the stash was re-applied: 22 conflicts, of which 18 were generated
surfaces (the `.claude` hooks and manifest, the work-order index, the
decisions index, the publication tables of contents) regenerated from the
integrated tree, two were registers unioned by id (the follow-up register,
470 entries, and the control projection), one was the evidence selection, and
one was source — `actor-contract.ts`, where WO-110's `local` slot and this
order's `missionSource` slot now sit side by side. `npm run release -- prepare
--local` retimed the unpublished target from `v0.36.0` to `v0.37.0` under the
recorded minor classification, because `v0.36.0` is the observed baseline.
The skeleton component bump this order carried, `0.31.0 → 0.32.0`, was
consumed by WO-110's release, so it is retimed to `0.33.0` with its
already-declared additive impact — package manifest, the console workspace
pin, the lockfile and `HARNESS_HOST_VERSION` — as product 07 permits.
Both evidence editions were stale on the integrated tree, since WO-110 changed
seven of the same registered sources. Authority is re-recorded as **WO-099
revision 004** (34 bundle comparisons) and feedback as **WO-099 revision 005**
with a fresh live Codex self-host audit the operator authorized in this
dispatch. Two editions minted in this session are residue rather than
selections, and the ordering cost is recorded here rather than hidden:
authority revision 003 and feedback revision 004 were recorded on the
integrated tree before the documentation gate surfaced the version collision,
and the retimed bump moved the runtime snapshot and the lockfile's console
pin, which the feedback projection keeps. Nothing selects them. The reviewer
still records both bases and the carried-forward claims; nothing here
pretends VER-003 judged the integrated bytes.

## Regressions added

- **`WO-099 VER-003 F1` (direct)** declares surfaces up to the clause bound
  and a 240-character out-of-surface path, so one host reason would run past
  the line; edits the contract; observes 203 changed paths. The host's 203
  findings readmit unchanged, the long reason ends in the truncation marker,
  a hundred judge findings readmit beside them, the hundred-and-first refuses
  with `beyond the host's own`, and repeating the host's findings costs the
  judge nothing.
- **`WO-099 VER-003 F1` (resident)** drives the real `ResidentHost` at the
  400-path bound with an answering and an unavailable judge: both hold
  `drift` with 400 findings, record the verdict, append exactly one
  correction carrying the same findings, and replay.
- **`WO-099 VER-003 F1` (refused judgment)** uses an adapter double that
  observes the real capsule and returns a judgment naming an unsupplied
  thesis: the observation is recorded as `invalid-result` with its capsule,
  the host-proved drift holds, and the reason says `no model judgment:
  invalid-result`.
- **`WO-099 VER-003 F2` (source)** covers the window at 0, 1 and N; an absent
  and an undeclared history as a whole empty window; an oversized committed
  history named as omitted, `unknown` on a claimed pass, `drift` on a named
  finding, and visible in the prompt; a zero window over the same file; and a
  history linked outside the worktree, named without carrying its bytes.
- **`WO-099 VER-003 F2` (resident)** holds an in-surface diff over an
  uncarried history as `unknown` with no correction event.

## Executed evidence

| Check | Result |
| --- | --- |
| `npm test` | **21 passed, 0 failed, 65 fresh tasks, 268.06 s** on the final tree, gate row 268,056 ms recorded 2026-09-20T21:28:09.403Z, exit 0; the integrated tree before the retimed bump passed identically in 268.01 s (row 268,006 ms at 2026-09-20T21:18:54.692Z) |
| `npm run test:docs` | **19 passed, 0 failed, 18.82 s** on the final tree, including `authority-evidence`, `feedback-evidence`, `release-surfaces` and the planning checks; the run before the retimed bump failed only `release-surfaces` (`@dotln/skeleton: src changed; observed 0.32.0; previous v0.36.0 0.32.0`) and its five preflight dependents |
| `node --test packages/skeleton/dist/test/mission-check.test.js` | 13/13 pass, the eight prior cases plus the five VER-003 regressions; filed as `mission-fixtures.tap` |
| `node scripts/harness.mjs emit` / `check` | 31 generated surfaces on the integrated tree; the runtime snapshot moved to `.runtime/harness/fb718f4c7cdc960b` because WO-110 changed compiled runtime files |
| `node scripts/authority-evidence.mjs --write --edition WO-099 --revision 004` / `--check` | Recorded and verified on the retimed tree: 34 bundle comparisons, both Contributor identities reproduced; revision 003 is residue |
| `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store docs/control/local/wo099-selfhost-005 --transport codex-cli-exec --model gpt-6-astra --effort max` | `{"workOrderId":"WO-011-feedback-audit","phase":"complete","fixtures":10,"savedInstructionBytes":1192,"verifier":"codex-cli-exec"}` in 60,169 ms, operator-authorized in this dispatch; an identical run into `wo099-selfhost-004` preceded the retimed bump and its edition is residue |
| `node scripts/feedback-evidence.mjs --write` / `--record-selfhost` / `--check` (edition WO-099 revision 005) | Ten passing regressions, ten removal failures, 1,192 fewer instruction bytes; `--check` verified over revision 005 with `docs/evidence/current.json` selecting it |
| `npm run release -- prepare --local` after the bump | `WO-099 target v0.37.0 remains current; no files changed` |
| `npm run publication:check` | 272/272 headings; both editions current after refreshing the two source locks the product edit invalidated |
| `npm run release -- prepare --local` | `Retimed WO-099: v0.36.0 → v0.37.0`, updating the order heading, the README claim and a dated roadmap note |
| `git diff --check` | Clean at the final authored tree |

## What this repair does not establish

- The live evidence for the order itself is unchanged: one synthetic
  worktree, one planted drift, one 18.8 s unattended row in `live.json`.
  Neither VER-003 finding is exercised by a live run; both are proved by
  fixtures with process doubles.
- The oversized-history case holds every pulse as `unknown` until a human
  answers, in the same way D016's oversized-evidence limitation does; raising
  the 200,000-byte bound or reading a tail with explicit incompleteness is a
  later decision, named in D026's reopening condition.
- The hold reason for an `unknown` derived from an answered judge still says
  `verifier unavailable` (D027).
- The integration is bookkeeping this session performed on the operator's
  instruction; it is not a review of WO-110, and the final review still names
  both bases and re-runs the affected checks on the integrated tree.
- `npm test`, the documentation gate and the live audit all ran in the
  session that authored the repair. Independent verification is a separate
  dispatch.
