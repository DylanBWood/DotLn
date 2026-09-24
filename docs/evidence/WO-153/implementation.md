# WO-153 implementation — Codex session entry advisory

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.281","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"claude-session-readback"}

Dispatch: `resume: next`, 2026-09-24. The executor changed one branch of the
existing lifecycle dispatch and added one fixture case. It added no hook, gate,
schema, role text, counter format or dependency. No commit, push, pull request,
tag or release publication was performed.

## Delivered behavior

In `scripts/resume.mjs`, the Codex dispatch branch now wraps its begin step
(the dynamic import of the built harness host and the `beginHarnessSessionOnce`
call) in one `try`/`catch`. When anything escapes the adapter, which still
absorbs only the exact already-began refusal, the dispatch writes one stderr
line:

```text
DotLn advisory: Codex session entry failed (<error message>); process cost remains unknown; cause no-session.
```

It then continues exactly as after a successful begin: current-session and
observed-facts readback, then the briefing on stdout and exit 0. For `verify`,
`fix` and `final-review` the transition that the case block appended stays
recorded, and the briefing now carries its allocated report path instead of
being suppressed. The already-began case, a successful begin, the unbuilt-runtime
advisory and a dispatch without `CODEX_THREAD_ID` take the same code path as
before. Design and rejected alternatives: WO-153-D001.

## Fixture

`scripts/test-process-debt.mjs` gains one case beside the two WO-149 cases,
`WO-153 a Codex dispatch whose session entry fails names the cause and still
delivers its briefing` (WO-153-D002). It rewrites the five values of the copied
`codexDispatchRoles` table to an invalid role, so the host throws `Invalid
harness session`, and runs all five actions in one runtime fixture, reseeding the
control segment to each action's phase (WO-153-D003).

| Action | Seeded phase | Appended transition | Briefing asserted |
| --- | --- | --- | --- |
| `next` | active | none | `Execute docs/work-orders/WO-999-fixture.md.` |
| `verify` | ready-to-verify | `VerificationRequested` | report path equals the event's `reportPath` |
| `fix` | needs-fix | `RepairRequested` | `Repair … using docs/verifications/WO-999/VER-001.md` |
| `final-review` | verified | `FinalReviewRequested` | report path equals the event's `reportPath` |
| `release-close` | closed | none | `After the operator merges the PR, … close WO-999 --publish.` |

For each action the case also asserts exit 0, the exact advisory line on
stderr, a control segment equal to its seed plus exactly that transition, no
session record, and a `harness usage` readback with `cause: "no-session"`, null
tokens, the `unknown; cause no-session` advisory, and `judgeCostLine` admitting
`**Process cost:** unknown; cause no-session`. With the real table restored, a
successful begin and its repeat write no advisory and keep the session JSON
byte-identical, and a threadless dispatch adds no session record and no
advisory.

## Acceptance criteria

1. **Forced begin failure, five dispatches.** Met by the fixture above:
   `node --test --test-reporter=spec --test-name-pattern='WO-149|WO-153'
   scripts/test-process-debt.mjs` → 3 pass, 0 fail; the WO-153 case took
   1,229.99 ms. Red check: with the checkpoint's `scripts/resume.mjs` restored
   temporarily, the case fails at `next` with exit 1 and `error: Invalid harness
   session`. The change was then restored and `cmp` confirmed identical bytes.
2. **Silent and unchanged paths.** Already-began repeat: no advisory, session
   bytes identical. No-thread: no advisory, no new session record. Successful
   begin: no advisory, executor record written. The two WO-149 cases have no
   edits: the diff adds one hunk after them, and they pass (475.51 ms, 163.69 ms).
3. **Cause code.** `judgeCostLine` returns `null` (admitted) for
   `unknown; cause no-session` built from the observed readback's `cause`;
   `no-session` is in `usageCauseCodes` (`scripts/lib/receipt-cost.mjs`).
4. **Write-backs.** `docs/evidence/WO-153/decisions.md` records D001–D004 with
   sources and reopening conditions; `npm run meta` refreshed
   `docs/lineage/decisions-index.md`. `docs/evidence/WO-149/decisions.md` is
   untouched.
5. **Gate, diff and dependencies.** `npm test` (the product gate): **27
   passed, 0 failed, 294.55 s, 71 fresh tasks** (gate row 294,546 ms,
   recorded 2026-09-24T15:54:25Z). The four machinery suites that `--review` adds for these changes, each run
   through the runner with `npm test -- --only <suite>`, all pass:
   `process-debt` 64.14 s, `harness-fixtures` 170.64 s, `configuration-root`
   2.49 s and `registrations` 0.45 s. `npm run test:docs`: 21 passed,
   0 failed, 30.61 s. `node scripts/meta.mjs --check` and
   `npm run publication:check` pass. `git diff --check` is clean. No new
   dependency: no `package.json` or lockfile changed.

   **Effect on the gate step count: none.** The case is one `test()` in the
   existing `process-debt` machinery suite. It adds no suite and no fresh gate
   task: the product gate stays at 27 suites and 71 fresh tasks, and
   `process-debt` still runs under `npm run test:machinery` and under
   `--review` when its sources change. The case measured 1,229.99 ms when first
   delivered and 1,135.46 ms on the final bytes, about 1.8% of the 64.14 s
   `process-debt` suite. The suite's duration before this order was not
   measured.

## Release

Application `v0.45.1` is assigned as the declared patch, the next patch above
the observed local `v0.45.0` tag (WO-153-D004). The heading, the README release
claim and a 06-roadmap §Release boundary activation-completion note name it.
`npm run release -- prepare --local` reported `WO-153 target v0.45.1 remains
current` and wrote the PR meter block in `docs/final-reviews/WO-153/PR.md`. No
package changes, so no compiler, kernel, skeleton or console version moves. The
roadmap note changed the bytes under the everyday edition's linked ladder
section, so its source lock moved to the value `npm run publication:check`
printed. The edition's text makes no per-release claim, so no prose changed,
and the check now reports both editions current.

## Economy experiment

WO-153-D003 (kept-current): five runtime-fixture constructions averaged
103.1 ms, and one Codex `next` dispatch averaged 138.6 ms. Reseeding one fixture
avoids about 0.41 s per suite run compared with a fixture per action, without
losing per-action independence. Cost was about 145 s against a 300 s budget.

## Repair (VER-001 F1)

Dispatch: `resume: fix`, 2026-09-24. VER-001 found that a partial begin
reported the wrong cause. The host writes the session record, then fails to
append its entry observation. The dispatch advisory said `cause no-session`, but
a later usage readback found the record and a repeat dispatch treated the
session as begun (WO-153-D005).

**Fix at the source (WO-153-D006).** `beginHarnessSession` in
`packages/skeleton/src/harness-host.ts` now removes its own session record when
`record()` fails, then rethrows the original error. After any failed begin the
thread therefore has no session: the advisory's `no-session` agrees with the
readback, and the next dispatch or `node scripts/harness.mjs begin` can retry.
`scripts/resume.mjs` is back to the bytes VER-001 verified (SHA-256
`7fda4bd8…`). A first repair that withdrew the record from `resume.mjs` passed
its checks, but it was replaced when the operator expanded the scope to fix the
host, because it covered only the dispatch caller and duplicated the host's
path key.

**Fixture.** The WO-153 case now runs every one of the five actions under two
forced failures: the D002 invalid role, and a partial begin forced through the
real dispatch table by precreating the thread's `.jsonl` observation path as a
directory (VER-001's reproduction). Each run asserts:

- exit 0
- the briefing, with the report path equal to the appended event's
- the advisory naming the host's message and `cause no-session`
- the control segment equal to its seed plus the expected transition
- no session record
- a usage readback of `no-session` with null tokens
- `judgeCostLine` admission

A repeat `next` names the failure again and leaves no record. Once the
obstruction is removed, the next dispatch begins silently and writes an
executor record. The two WO-149 cases are unedited. `node --test
--test-reporter=spec --test-name-pattern='WO-149|WO-153'
scripts/test-process-debt.mjs` passes 3/3; the WO-153 case took 2,675.03 ms,
against 1,135.46 ms before the repair.

**Red checks.** VER-001's subject `resume.mjs` was swapped in temporarily and
then restored, confirmed with `cmp`. Against it, the dispatch printed the
advisory while leaving the record: the stderr VER-001 had inferred, now
observed. With HEAD's `harness-host.ts` restored and rebuilt, the fixture fails
at the partial begin's no-session-record assertion.

**Release and evidence (WO-153-D006, WO-153-D007).** Skeleton moves from
`0.38.0` to `0.38.1`: the change is a bug fix, and skeleton's source is
unchanged since `v0.45.0`. The console's exact pin and the lockfile follow.
`release check-surfaces --local` passes 44 of 44 checks. The application target
stays `v0.45.1`. Because `harness-host.js` is a pinned runtime file, the 31
harness surfaces were regenerated. The authority and feedback editions were
re-minted as WO-153 revision 001 and selected in `docs/evidence/current.json`;
artifact identity and verification stay at WO-157 revision 001. Feedback used
one live `claude-cli-print` self-host episode:

| Measure | Value |
| --- | --- |
| Attempts | 1 (no interruption) |
| Fixtures | 10 |
| Heartbeats | 94 |
| Wall time | 97,756 ms |
| Tokens | 967,008 |
| Cost | USD 1.53 |

`npm run publication:check` passes after the everyday edition's source lock
moved to the printed value (its prose makes no per-release claim).

**Verbatim record correction (WO-153-D008).** D006's dispatch field briefly
quoted the operator's message word for word. It now paraphrases it, and the
quote was never committed. Earlier committed occurrences, and the role-text gap
behind them, are follow-up FUP-87ed701db7d7209e for planning.
FUP-c02d54c7d663b508 (D005) is settled by D006.

**Gate.** `npm test -- --review` (the product gate plus the machinery suites this change selects) passed 35 suites with 0 failures in 629.09 s, 79 fresh tasks (gate row 629,089 ms, recorded 2026-09-24T16:40:24.929Z). Selected suites: `process-debt` 101.31 s, `harness-fixtures` 190.40 s, `skeleton` 332.85 s, `resume` 34.81 s. The product gate step count is unchanged: the fixture is still one `test()` in the machinery `process-debt` suite. Two earlier runs of the same command are not evidence. This session stopped the first before the host change, so it recorded no check. The second failed in preflight on the stale editions that this repair then re-minted.

## Process cost

Entry: 82,298 total tokens (`claude-transcript-message-usage`, scope dispatch,
cutoff 2026-09-24T15:37:18.727Z). Handoff: 10,273,487 total tokens, mostly
cached input (`claude-transcript-message-usage`, scope dispatch, cutoff
2026-09-24T15:59:30.752Z, read before this receipt was written). Subagents: 0
spawned (cap 20).

Repair (`resume: fix`): entry 82,198 total tokens (`claude-transcript-message-usage`,
scope dispatch, cutoff 2026-09-24T16:10:42.669Z); handoff 23,563,098 total
tokens, mostly cached input (same source and scope, observed
2026-09-24T16:41:00.493Z, before this section was written). The live self-host
episode ran in its own transport and is counted separately: 967,008 tokens and
USD 1.5319758 (WO-153-D007). Subagents: 0 spawned (cap 20). The repair's gate
wall time was 629.09 s.

## Limits

- No live Codex dispatch ran. The order's evidence gate names none: the failure
  has not been observed live, and a live Codex dispatch exiting non-zero at
  entry is the reopening observation.
- The partial begin that WO-153-D001 inferred was observed by VER-001 and is
  fixed at the host (WO-153-D006). Not exercised: an unlink that fails right
  after the host renamed the record into the same directory; its error would
  replace the original one.
- The self-host episode records the model and effort selected at launch;
  effective model and effort are unknown.
- Effort is the host-selected `CLAUDE_EFFORT` value, not effective effort.
