# WO-144 — FINAL-002

**Verdict: pass.** FINAL-001's two findings are repaired and both repairs were
reproduced live in this Claude Code session, including the write-tool call from
a moved working directory that FINAL-001 and the repair left unprobed. The
final-review gate met one failure on its first run, which this review repaired
as a test-only edit and reran green (R1 below). Nothing blocks publication of
the reviewed branch.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"xhigh","source":"operator-attested"}

- **R1, met and repaired here.** The first `npm test -- --review` failed one
  suite, 29 passed and 1 failed. `process-debt` is a machinery suite that
  declares `harness-host.ts`, so only `--review` selects it, and no executor or
  verifier run had included it. Its WO-131 test compares a resumed session's
  briefing with the recording session's; WO-144 prints each session's own
  scratch path in that context. The product is as decided; the expectation was
  stale. The test now sets each session's own key aside and asserts it. No
  product code changed. The second gate run passed: 30 suites, 0 failed.
- **F1 (FINAL-001), repaired.** After one persisted `cd docs`, FINAL-001's
  admitted form, a relative escaping redirect and a Write-tool call were each
  refused before execution and journaled with `workingDirectory: moved`.
- **F2 (FINAL-001), repaired.** A literal redirect on `node` is refused from
  the root and from the moved directory. The incident's original `$PWD`
  spelling is still admitted, and the documents now say so in those words.
- Two extractor width edges met while probing, and the process gap behind R1,
  are boarded in [D010](../../evidence/WO-144/decisions.md#wo-144-d010--pass-final-review-after-an-in-review-test-repair-board-the-unrun-suite-and-two-width-edges).

Subject: [WO-144](../../work-orders/WO-144-outside-project-write-grant.md),
branch `wo-144`, reviewed against the original order with the complete
verification sequence ([VER-001](../../verifications/WO-144/VER-001.md) fail,
[VER-002](../../verifications/WO-144/VER-002.md) pass,
[VER-003](../../verifications/WO-144/VER-003.md) pass),
[FINAL-001](FINAL-001.md) fail, the executor's
[implementation](../../evidence/WO-144/implementation.md), both repair reports
([repair](../../evidence/WO-144/repair.md),
[repair of FINAL-001](../../evidence/WO-144/repair-final-001.md)), the
[fixture transcripts](../../evidence/WO-144/fixture-transcripts.md),
[decisions D001–D009](../../evidence/WO-144/decisions.md) and the cited
[ideation receipt](../../evidence/WO-054/ideation-2026-09-18.md).

- `HEAD` is `99714b94`. After `git fetch origin main`, local `main`,
  `origin/main` and `git ls-remote` all name the same commit, so no integration
  was needed and nothing was retimed. No remote `wo-144` branch existed.
- All work was uncommitted at entry and preserved by
  `refs/dotln/checkpoint/WO-144/15` (`9b84bb76`).
- The prompt hook recorded the `final-review` dispatch and it was not repeated.
  Fan-out plan, stated at entry: none. Zero subagents were spawned (0 of 20,
  `exact-observed`).
- This reviewer changed one test file (R1), wrote this report, decision D010,
  the PR body and the release notes, and refreshed the projections the result
  refreshes. No product source changed.
- **Harness:** Claude Code 2.1.278 (`claude --version`). **Model:**
  `claude-fable-5-1`, selected by the operator through `/model`. **Effort:**
  `CLAUDE_EFFORT` reads `xhigh`. No effective-model readback is claimed.

**Probe residue, disclosed.** Every refused probe created nothing; `ls` shows
no `wo144-final2-*` file. The granted probe from the moved directory was
admitted by the hook and then failed in the shell because the scratch directory
did not exist yet; `mkdir -p` of that granted directory followed. This session's
scratch directory holds the second gate's log and this review's drafts.
FINAL-001's 6-byte `/private/tmp/wo144-final-cwd-probe.txt` is still there:
removing it is an ungranted outside removal, which the guard refuses for this
role as it should. It is left for the operator.

## Instrument disclosure

The regenerated hooks under review were live in this session and judged,
refused and journaled the probes below. The refusals are shown by the absent
files as well as by the hooks' own rows. The live-gate refusal (WO-135), which
shares the boundary, refused five of this session's read-only commands while
the two gate runs were live (`git --no-pager diff` with paths, plain `git log`,
and searches whose pattern held an alternation); that is its earlier behavior
and not a finding. `<root>` is this worktree;
row numbers cite this session's `docs/control/local/harness/<session-key>.jsonl`.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run resume --silent -- status --json` | WO-144, phase `final-review`, VER-003 pass, FINAL-002 allocated, legal action `final-review-result` |
| `git fetch origin main`; `git ls-remote origin` | `main`, `origin/main` and `HEAD` all `99714b94`; no remote `wo-144` |
| `node scripts/harness.mjs check` | pass: 31 generated surfaces; local-terms list unavailable |
| `git diff --check` | clean before and after the R1 edit |
| `npm run format:check` | pass on the entry tree; `prettier --check` passes on the edited test |
| `node scripts/harness-context.mjs` | executor 22,174/24,576; verifier 19,216/20,480; reviewer 20,434/20,480; release-close 13,440/16,384; planner 14,506/24,576; refuter 15,163 (unset); every configured ceiling `within`; no ceiling raised |
| `npm test -- --review`, first run | **29 passed, 1 failed**, 484.20 s, 74 fresh tasks, Node 26.9.0; row recorded `2026-09-20T00:52:43.131Z`, exit 1, code identity `edf80fb6…`, the identity the repair's plain `npm test` passed at. `process-debt`: 76 tests, 75 pass, 1 fail (test 73). R1 |
| The failing test alone, before the edit | fails identically: deterministic, not a flake |
| The failing test alone, after the edit | 1 passed, 0 failed, 4,425 ms |
| `npm test -- --review`, second run | **30 passed, 0 failed**, 485.80 s, 74 fresh tasks; row recorded `2026-09-20T01:03:53.732Z`, exit 0, 485,796 ms, code identity `6dda30a3bc99afbcbd4271753aca9e53e4faf005a7a32799348bef163018de91`. `process-debt` and `harness-fixtures` both pass |
| Current code identity vs the second row (`gateCodeIdentity`, `findGateCheck`) | equal after this report, D010, the PR body and the release notes were written |
| `npm run meta`; `npm run release -- prepare --local` | decisions index, follow-up register and process meter refreshed; "WO-144 target v0.33.0 remains current; no files changed" |
| `npm run test:docs` | 19 passed, 0 failed, 15.43 s. Its first run here failed `release-surfaces` on this reviewer's own release notes, whose angle-bracket placeholders the body profile reads as raw HTML; reworded, then green |
| Built `shellRedirectTargets` over six further spellings | below, Observations |
| Live probes | below |

## R1 — The final-review gate was the first run of a suite this order breaks

- **Criterion:** 6 (`npm test` green) and the evidence gate (`npm test` once at
  final review).
- **Observed.** `scripts/test-process-debt.mjs`, "WO-131 prompt submission
  stays open while dispatches retain the ordinary command's gate and writer
  checks", failed at its `assert.equal` of two briefings. The two texts differ
  in exactly two places. The recording session's context carries the
  recording-only line `warning: host beacon projection unavailable; …`, which
  the test strips only when it is last; and each context ends with
  `DotLn session scratch: <system-temp>/dotln/<key>/scratch. …`, where `<key>`
  is `42d86fbd…` for `repair-session` and `f6767855…` for `resumed-repair`. Both
  are the SHA-256 of the session id (computed here).
- **Cause.** `harness-host.ts` appends the scratch line to every role
  dispatch's context (`additionalContext += "\nDotLn session scratch: …"`),
  added by the VER-001 repair (D004) so an agent can find the granted root. A
  per-session path is the decided behavior (D001; the fixture "scratch-only
  role grant is session-scoped"). The test's premise, byte-equal briefings
  across two sessions, is what went stale.
- **Why nobody met it.** `scripts/test-runner.mjs` declares
  `harness-host.ts` among the `process-debt` suite's sources, and the runner
  adds that machinery suite only under `--review`. The implementation, both
  repairs and VER-001 to VER-003 ran `npm test` without it (21 suites) or
  named suites that do not include it. The failure reproduces alone and
  deterministically, so it would have failed at any of those points.
- **Repair, in this review.** `briefingOf` takes the session's name, asserts
  that the context names `/dotln/<sha256(session)>/scratch`, strips the warning
  wherever it sits, and compares the briefings with that key set aside. The
  comparison the test was written for still runs, and the new assertion pins
  what WO-144 added: each session is told its own path. One test file, 13
  insertions and 7 deletions; no product or generated file changed, so
  `harness check` and the authority evidence are untouched.
- **Why not routed to repair.** The cause is unambiguous, the edit cannot
  change product behavior, and a repair, a fourth verification and a third
  final review would re-judge unchanged product code. The reviewer role's
  bound admits a low-risk edit in a shared check, and WO-143-D006 is the
  precedent. The second gate run is the check on the edit. The choice, its
  alternatives and the process follow-up are D010.

## FINAL-001 findings, re-checked live

Role `reviewer`, darwin. No destination was an operator folder.

| Row | Time (UTC) | Working directory | Call | Result |
| ---: | --- | --- | --- | --- |
| 266 | 00:43:49.397 | `<root>` | `node -e 0 2>/private/tmp/wo144-final2-root-redirect-probe.txt` | **refused** before execution |
| — | — | `<root>` | `cd docs && pwd` | admitted; the Bash tool's directory persisted as `<root>/docs` |
| 285 | 00:43:53.690 | `<root>/docs` | `printf 'probe\n' > /private/tmp/wo144-final2-cwd-probe.txt` (FINAL-001's admitted form) | **refused**, `workingDirectory: moved` |
| 292 | 00:44:03.550 | `<root>/docs` | `node -e 0 2>../../../../../private/tmp/wo144-final2-rel-probe.txt` | **refused**, moved; the message names the relative spelling and the physical `/private/tmp/…` |
| 296 | 00:44:04.117 | `<root>/docs` | Write tool → `/private/tmp/wo144-final2-write-probe.txt` | **refused**, moved |
| 300 | 00:44:09.568 | `<root>/docs` | `printf 'ok\n' > <scratch>/final2-granted-probe.txt` | **granted**, `system-temp`, moved |
| 314 | 00:44:17.435 | `<root>` | `mkdir -p <scratch>` | **granted**, `system-temp` |

Each refusal carried the full message, for example
`DOTLN_HARNESS_REFUSED: outside-project write to ../../../../../private/tmp/wo144-final2-rel-probe.txt (physical destination /private/tmp/wo144-final2-rel-probe.txt) lacks an equipped outside-write grant for role reviewer (WO-144). Use operator override: for authorized recovery.`
At the probe cutoff the journal held 20 judgment rows: 14 unobserved, 4 refused
and 2 granted, five of them marked moved, and 10 stand-down advisory rows
naming "Harness requires the verified worktree root".

- **F1.** Repaired by enforcement (D008). I read `runHarnessHook`,
  `installedHarnessRoot`, the `moved` path of `evaluateHarnessHook` and
  `knownWriteDestinations`. Away from the root only the outside-write judgment
  is made; a denial is returned and every other outcome rethrows the original
  cause, so the four older refusals and SessionStart keep their stand-down. The
  root comes from the installed runtime's location and is checked as a Git top
  level that contains the pinned snapshot, so rows and markers stay in the
  hook's own project; the generated fallback derives its root from the hook
  file's own location (read in `.claude/hooks/permissions.mjs`). The Write-tool
  probe closes the limit FINAL-001 and D008 both named.
- **F2.** Repaired in code and in words (D009). `shellRedirectTargets` is
  consulted only by the outside-write path and only when `shellWriteTargets`
  returns `null`; the refactor into `invocationRedirects` keeps the strict
  reading for `shellWriteTargets`, and the fixture pins the planning-branch
  reading. Product 03, product 07 §Discipline, the security document, the
  README block and the generated boundary text state what is judged, what is
  not, and that `2>$PWD/../.x` is admitted today.

## Observations (non-blocking, boarded in D010)

Built `packages/skeleton/dist/src/harness-command.js`:

| Command | `shellWriteTargets` | `shellRedirectTargets` |
| --- | --- | --- |
| `printf x > /outside/a && npm run y 2>$PWD/z` | `null` | `null` |
| `npm run y 2>/outside/a; npm run z > $HOME/b` | `null` | `null` |
| `node -e "x => 1" > /outside/a` | `null` | `null` |
| `npm run y 2>/outside/a` | `null` | `["/outside/a"]` |
| `FOO=1 npm run y > ../out` | `null` | `["../out"]` |
| `cat > /outside/a <<EOF …` | `null` | `["/outside/a"]` |

- **O1 — one expansion-spelled redirect un-names the literal ones beside it.**
  The accessor answers for the whole command, so a literal outside redirect is
  unjudged when any other redirect in the command is an expansion. The
  documents say the expansion-spelled destination is not judged; none says it
  takes its neighbours with it.
- **O2 — a quoted program argument containing `<` or `>` makes the command's
  redirects unjudged.** `node -e "x => 1" > /outside/a` names nothing. An arrow
  function in `node -e` is an ordinary spelling.
- Both admit under host permissions and sit inside the order's stated width of
  known destinations, so neither fails a criterion. Both narrow what "a literal
  redirect is judged on any program" means in practice, so D010 boards them
  with D009's follow-up for the opaque-effects order.

## Acceptance criteria

| # | Criterion (abridged) | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Decisions record the inventory, defaults and ungranted destinations | **met** | D001 and D005; VER-003's rerun. Historical destinations are unknown and labeled so |
| 2 | Default grants admit scratch and temporary writes; parent, sibling, documents-like, symlink-escape and removal refused | **met, at fixture and real-session width** | The `harness-fixtures` suite passes in the gate, including both FINAL-001 fixtures; live rows 266 to 314 |
| 3 | Support-granted operator root admits under it only; unequip refuses; manifest lists roots and sources | **met** | Fixture in the gate; VER-003's compiler and authority tests; lowering read at FINAL-001 and unchanged since |
| 4 | Guard failure admits with one advisory and journals the cause; four refusals unchanged; in-project writes not judged | **met** | Fixture in the gate. The moved path returns only an outside denial and otherwise rethrows; the live-gate refusal fired in this session as before |
| 5 | The documents state the width | **met** | Product 03's dated repair note, product 07 §Discipline, the security document, README and generated text, read here. O1 and O2 are finer than the stated width and are boarded |
| 6 | `harness check`, `npm test`, `git diff --check`, no new dependency, cold-start totals | **met after R1** | Second gate run green at the final code identity; 31 surfaces; diff clean; lockfile changes are internal pins; totals recorded, no ceiling raised |

## Diff review

FINAL-001 read the full source diff at checkpoint 9 and found no further
defect. I read everything that changed since: `harness-command.ts`,
`harness-host.ts`, the compiler's fallback and boundary text, both new
fixtures, and the four documents.

- **Extractor.** `invocationRedirects` is the old loop lifted out unchanged,
  with `strict` keeping `shellWriteTargets`' rule that any expanded or wildcard
  word makes the invocation opaque. `shellRedirectTargets` relaxes that only
  for non-redirect words, names an invocation's redirects before it marks the
  shell as possibly moved, and returns `null` for a relative redirect after a
  program outside the vocabulary. `writeCommandFlags` is now read through
  `Object.hasOwn`.
- **Host.** `knownWriteDestinations` returns the lazy iterator plus a
  `partial` flag; the planning refusal reads `.destinations` with no `outside`
  argument, so its root-relative, whole-command reading is unchanged. A
  partial judgment journals its granted or refused row and then one
  `unobserved` row for the program.
- **Generated surfaces** rest on `harness check` and the authority evidence
  revision 004, not on a line read.
- **Tests.** No assertion was weakened by the repair. R1's edit is described
  above.

## Verification sequence

VER-001's failure and VER-002's pass stand as FINAL-001 judged them. VER-003's
pass is sound on what it ran: fresh fixtures, compiler and authority tests,
the document checks and 32 synthetic inputs to the installed hooks, with the
product gate taken from the repair's matching row. That row was a plain
`npm test`. Neither it nor any verifier run selected `process-debt`, which is
why a deterministic failure reached this gate. That is a gap in what the
procedure asks executors and verifiers to run, not a fault in VER-003's
judgment of what it saw; D010 boards it for the planner.

## Goal alignment

- **Mission:** let the operator keep the native sandbox relaxed without a
  mistaken path reaching their folders, while authorized temporary work stays
  usable.
- **Observed against that promise:** from the root and from a moved directory,
  through the shell and the write tool, a named outside destination is refused
  before it runs and recorded once; a granted one is admitted. The incident's
  literal command is refused. The incident as it happened is not, and every
  surface that states the width says so.
- **Traps.** *Rule beating* was the live one: a reviewer who edits a failing
  test to reach a green gate must show the edit keeps the test's purpose, so
  the comparison still runs and a new assertion pins the per-session path.
  *Drift to low performance* and *seeking the wrong goal*: a green plain
  `npm test` had stood in for the gate the order names; the follow-up asks the
  planner to close that, not this review to normalize it. *Shifting the
  burden*: passing on the earlier row would have left the operator to meet the
  red suite at the next order that touches `harness-host.ts`. *Fixes that fail*
  and *policy resistance*: the edit touches no product path and the four older
  refusals were exercised again by the gate. *Escalation*: no new hook, gate or
  receipt. *Commons*: one reviewer, no subagents; the second gate run is the
  one cost this route adds, against a full repair cycle. *Success to the
  successful*: the verdict rests on this session's probes and gate, not on the
  earlier passes. *Naive Interventionism*: the smallest change that restores
  the test's intent, checked alone before the full run.
- **NoOp,** failing on R1, was the alternative with real merit and is rejected
  in D010 with its reason.

## Limits

- Live probes ran on darwin, for the reviewer role, through the Bash and Write
  tools. `operator override:` was exercised by fixture only. Whether subagent
  calls inherit the role was not exercised; this session spawned none.
- The new test assertion was not mutation-tested against a product that prints
  the wrong key; it is a literal substring check on the context.
- R1's edit has no independent verification beyond the gate; the PR says so.
- The order's cost line and criterion 2's label remain broader than what ships
  (D009). The order text was not edited.
- Process cost at handoff (`node scripts/harness.mjs usage <host session id>`):
  source `claude-transcript-message-usage`, scope dispatch, observed
  `2026-09-20T01:07:09.746Z`; totalTokens 21,187,509 (input 222, cached input
  20,866,447, cache write 250,820, output 70,020); reasoning tokens and dollar
  cost unavailable, therefore unknown; 131 steps, 74 commands, subagents 0 of
  cap 20 (`exact-observed`). Entry reading at `2026-09-20T00:41:57.031Z` was
  198,491 total tokens. The two gate runs account for about 16 minutes of the
  wall clock. Final counters are in the response.
