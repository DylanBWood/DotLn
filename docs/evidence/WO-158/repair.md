# WO-158 repair evidence

Dispatch: `resume: fix`, 2026-09-25, recorded by the harness before this
procedure loaded (`npm run resume -- fix`). Repair source:
[VER-001](../../verifications/WO-158/VER-001.md), findings F1 to F4, retained
as [D021](decisions.md#wo-158-d021). The repairs are
[D022](decisions.md#wo-158-d022), [D023](decisions.md#wo-158-d023),
[D024](decisions.md#wo-158-d024) and [D025](decisions.md#wo-158-d025); each
reopens the decision whose condition held (D007, D008, D012, D011).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.282","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

The model is the session's model as the harness names it (Fable 5.1). The
effort is the root session's `CLAUDE_EFFORT=xhigh`, read from the shell
environment (selected, not effective). The harness version is
`claude --version`.

The repair keeps the original scope. The verification report and the order's
criteria are unchanged; no dependency was added, no live model episode ran and
no subagent was spawned (0 of cap 20, exact-observed). Two registered edition
sources changed (`packages/skeleton/src/harness-command.ts`,
`packages/skeleton/src/harness-host.ts`), so the authority edition was minted
again as revision 002 and [current.json](../current.json) selects it; the
artifact-identity, verification and feedback editions verify unchanged at
revision 001, with no live episode. `npm run harness -- emit` regenerated the
31 surfaces onto a new pinned runtime snapshot.

| Finding | Repair and executed evidence |
| --- | --- |
| F1 — an impossible date reactivates a withdrawn order (criterion 3) | `reactivationNotes` in `scripts/resume.mjs` marks a note valid only when its `YYYY-MM-DD` round-trips through a UTC date; `requireReactivation` refuses a new note with a non-calendar date, naming it. Off-ramps fixture: `9999-99-99` and `2026-02-30` refused with `dates a new note <date>, which is not a calendar date`; the current-dated note still activates; the second withdrawal cycle unchanged. |
| F2 — a report-path correction rebinds a verdict (criterion 4) | `verification-result` and `final-review-result` record `reportHash` (SHA-256 of the judged report) on their completion events; `correct --set reportPath=` requires the candidate's digest to equal that recorded digest, or the current path's bytes for a result recorded before digests, and refuses when neither exists; the correction records the digest it checked. Off-ramps fixture: a different `sub/VER-002.md` refused with both digests while status keeps the pass on the allocated path; a byte-identical copy admitted and corrected back; `correctedBy` lists all three corrections. |
| F3 — same-second override exits replace captured words (criterion 5) | `writeCapture` in `packages/skeleton/src/harness-host.ts` creates the capture with the exclusive `wx` flag and takes `-2.md` upward on EEXIST. Harness fixture with a pinned clock: two exits at one instant record ordinals 2 and 3 with distinct captures, each `captureHash` matching its own file and words. |
| F4 — an admitted Git read runs a pager (criterion 6) | `liveGateGit` in `packages/skeleton/src/harness-command.ts` admits a Git read only with `--no-pager` or `-P`; the list text, harness-host refusal, product 07 and the security document spell `git --no-pager diff\|log\|show\|status\|stash list`. Harness fixture: ten flagged reads admitted by all three pre-tool hooks, seven bare forms refused naming the list, seven configured-program rows still refuse. One residual met and recorded, not changed: `git --no-pager status` under a configured fsmonitor is admitted by the WO-142 activation vocabulary judged before the list (FUP-9e2be6bfac0708fe); queue item adjacent-0001 is disposed as a known issue onto that row. |

Operator check-in (actor-attested; no inbox readback exists): one operator
message arrived during this dispatch, that a parallel work order was merged to
`main`. A read-only inspection showed WO-159 merged there, touching none of the
four files this repair edits and fourteen lines of `scripts/test-harness.mjs`;
integration with `main` is final review's duty (product 07 §Independent
workflows and integration), so no merge was performed here. The worktree queue
holds adjacent-0001 (known-issue); nothing is running or next.

Executed checks on the repaired tree, 2026-09-25:

| Check | Result |
| --- | --- |
| `npm run harness -- evidence` (`npm test`) | 27 passed, 0 failed; 298.91 s; 71 fresh tasks; tree `3c685491544a6feaec922f20f333c129a4f34d27`; code identity `1172bcf9c23c07e60ca2dd9e1e8ccd1de8260af74a287868633490f3c575e8f7`; `git diff --check` recorded clean in the same gate |
| `node scripts/test-runner.mjs --only resume` | 2 passed, 0 failed (26.18 s) with the F1 and F2 regressions |
| `node --test --test-name-pattern 'WO-158' scripts/test-harness.mjs` | 4 passed, 0 failed, with the F3 case and the re-pointed live-gate case |
| `npm run harness -- check` | 31 generated surfaces after emit |
| `node scripts/authority-evidence.mjs --write --edition WO-158 --revision 002`, then `--check` | recorded and verified 34 bundle comparisons |
| `npm run evidence:artifact -- --check`; `npm run evidence:verification -- --check`; `node scripts/feedback-evidence.mjs --check` | verified; carried live audit, no live episode |
| `npm run plan -- check`; `npm run publication:check` (locks refreshed after the product 07 edit) | exit 0; both editions current |
| `npx prettier --check` on every edited file | clean |
| `npm run release -- prepare --local` | retimed `v0.48.0` to `v0.49.0` because `main` now holds `v0.48.0` (WO-159); heading, README claim and roadmap note updated; final review retimes at integration under the existing minor classification |
| `npm run test:docs` | 21 passed, 0 failed; 23.60 s; run after this record and D022 to D025 were written |

Economy: [D001](decisions.md#wo-158-d001) is this order's one experiment
(focused runs, then the full suite before handoff). It was read before the
repair and followed; no second experiment was started.

Process cost at entry: 246,920 total tokens, source
`claude-transcript-message-usage`, scope `dispatch`, cutoff
2026-09-25T13:40:16.924Z. At 2026-09-25T14:07:43.262Z the same counter read
8,703,332 total tokens (8,357,801 cached input, 248,543 cache-write input,
95,444 output). Dollar cost is unavailable. Final handoff counters are in the
ignored harness receipt and the operator response.

Limits: F4's pager reproduction was not re-run in a PTY; the repair is proved
at the classifier by command text, and the fixture asserts the flagged and
bare forms. A probe on git 2.55.0 showed `--no-pager` exporting
`GIT_PAGER=cat` to a child process (D025 evidence), which covers the log a
stash list delegates. F1's guard admits a valid calendar date later than today (D022
records that as its reopening condition). Independent re-verification and
final review remain separate dispatches.
