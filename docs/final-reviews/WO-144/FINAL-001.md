# WO-144 — FINAL-001

**Verdict: fail.** Two blocking findings go to repair. The first is the
order's own reopening observation, "an outside write … admitted without a
grant", reproduced live in this Claude Code session under the regenerated
hooks. The second shows that the incident the order was written to remove is
still admitted, and that no document says so. Nothing was committed, pushed or
published.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"xhigh","source":"operator-attested"}

- **F1.** The guard judges only while the session's working directory is
  exactly the worktree root. After one persisted `cd` — even into a project
  subdirectory — a known, ungranted outside destination is admitted and the
  call leaves no journal row of any kind.
- **F2.** A literal redirect is named only when it hangs on one of the
  extractor's few programs. `npm run meta 2>../.x` is unobserved, so the
  recorded incident's own command is admitted in both its original and its
  literal spelling. The order's cost line, criterion 2's label and the
  documents' "including redirects" overstate what ships.

Everything else holds: criteria 1, 3, 4 and 6 are met, criterion 2 is met by
its fixtures, VER-001's four findings stay repaired, and `main` has not moved.

Subject: [WO-144](../../work-orders/WO-144-outside-project-write-grant.md),
branch `wo-144`, reviewed against the original order with the complete
verification sequence ([VER-001](../../verifications/WO-144/VER-001.md) fail,
[VER-002](../../verifications/WO-144/VER-002.md) pass), the executor's
[implementation](../../evidence/WO-144/implementation.md),
[repair](../../evidence/WO-144/repair.md),
[fixture transcripts](../../evidence/WO-144/fixture-transcripts.md) and
[decisions D001–D006](../../evidence/WO-144/decisions.md), and the cited
[ideation receipt](../../evidence/WO-054/ideation-2026-09-18.md) with the
incident record it points to (WO-054 VER-003).

- `HEAD` is `99714b94`. Local `main` and `origin/main` (`git ls-remote`) are
  the same commit, so no integration was needed and nothing was retimed. No
  remote `wo-144` branch exists.
- All work is uncommitted and preserved by `refs/dotln/checkpoint/WO-144/9`
  (`795ec901652c454daa681b329ffa09b144c59c79`).
- The prompt hook recorded the `final-review` dispatch and it was not
  repeated. This reviewer changed no source, spawned no subagents (0 of 20,
  `exact-observed`) and wrote only this report, decision
  [D007](../../evidence/WO-144/decisions.md#wo-144-d007--fail-final-review-on-a-live-admitted-outside-write-board-the-shared-root-cwd-precondition)
  and the projections the result refreshes.
- **Harness:** Claude Code 2.1.278 (`claude --version`). **Model:**
  `claude-fable-5-1`, selected by the operator through `/model`. **Effort:**
  `CLAUDE_EFFORT` reads `xhigh`. No effective-model readback is claimed.

**Probe residue, disclosed.** F1's probe created one 6-byte file,
`/private/tmp/wo144-final-cwd-probe.txt`. It is outside the project and outside
every operator folder. I left it in place: removing it from the worktree root
is refused by the guard under review, and removing it from a moved working
directory would use the defect this report is about. The refused control and
the synthetic hook run created nothing.

## Instrument disclosure

The regenerated hooks under review were live in this session and judged,
refused and journaled the probes below. F1 does not rest on them alone: the
admitted write is shown by the file on disk, and its cause by the generated
hook's own output for a synthetic input, and by reading `harnessRoot` and
`runHarnessHook`. `<root>` is this worktree; journal row numbers cite this
session's `docs/control/local/harness/<session-key>.jsonl`.

## Executed checks

| Check | Result |
| --- | --- |
| `npm run resume --silent -- status --json` | WO-144, phase `final-review`, VER-002 pass, legal action `final-review-result` |
| `git ls-remote origin refs/heads/main` vs local `main` and `HEAD` | all `99714b94`; no integration |
| `node scripts/harness.mjs check` | pass: 31 generated surfaces; local-terms list unavailable |
| `git diff --check` | clean (exit 0) |
| `npm run format:check` | "All matched files use Prettier code style!" |
| `node --test --test-name-pattern='WO-144' scripts/test-harness.mjs` | 6/6 pass, 14,095.0 ms |
| Recorded `npm test` row vs current code | row of `2026-09-19T21:48:33.618Z`, exit 0, code identity `d4476480…`; no source changed since, so it still describes this subject |
| `npm test -- --review` | **not run.** The verdict is fail and repair changes code identity; a rerun would add no information. The next final review runs it |
| Built `shellWriteTargets` over the incident's spellings | below, F2 |
| Live probes and one synthetic hook run | below, F1 |

## F1 — A persisted `cd` stands the guard down, and the admitted write is not journaled

- **Criterion:** the objective ("a shell command whose write destination is
  known and resolves outside the project is admitted only when an equipped
  role or support grants a root that contains it, and is otherwise refused
  before it runs"); the design ("an unknown or opaque destination … is
  journaled as unobserved"); criterion 5 (the documents state the width); and
  the evidence gate's reopening observation.
- **Observed, role `reviewer`, darwin:**

  | Time (UTC) | Working directory | Call | Result |
  | --- | --- | --- | --- |
  | 22:00:08.244 | `<root>` | `cd docs && pwd` | admitted, `unobserved` (row 478); the Bash tool's working directory persisted as `<root>/docs` |
  | ≈22:00:11 | `<root>/docs` | `printf 'probe\n' > /private/tmp/wo144-final-cwd-probe.txt` | **admitted; file created**; no PreToolUse or PostToolUse row from any hook |
  | 22:00:19.720 | `<root>` | `printf 'control\n' > /private/tmp/wo144-final-cwd-control.txt` | **refused** before execution (row 490), full WO-144 message naming role `reviewer` |

  Rows 478–485 belong to the first call and row 490 begins the third; rows
  486–489 are the post-tool rows of the call that returned to `<root>`. The
  admitted probe has none. The destination is literal, extractable and
  ungranted: the control proves all three.
- **Cause, confirmed twice.**
  - The generated `permissions` hook, fed a synthetic PreToolUse input with
    `cwd` `<root>/docs` and the same command, prints only `DotLn advisory:
    runtime-unavailable: host facts or pinned runtime unavailable (Error:
    Harness requires the verified worktree root); … host permissions decide.`
  - `runHarnessHook` calls `harnessRoot(input.cwd)`, which throws unless the
    working directory equals the Git top level. `observed` is assigned on the
    next line, so the `finally` block that writes the journal row is skipped.
    Hooks are addressed through `$CLAUDE_PROJECT_DIR`, so they do start; the
    stand-down is inside them.
- **Why it is this order's finding.** `harnessRoot` predates WO-144 and the
  diff does not touch it. The order's objective is nonetheless a statement
  about session behavior, and this session falsifies it. The design line
  "refusal at the existing boundary" inherited the boundary's precondition
  without examining it. A destination here is neither opaque nor a grant
  failure, the only two admitted cases the documents name, and the design's
  promise that the unjudged case is "journaled as unobserved" does not hold.
  VER-001 failed the order on the symmetric half of the same clause.
- **Reach.** Any Claude session after any persisted `cd`, until the working
  directory returns to the root. The `cd` itself is opaque and admitted. It is
  reachable by accident, which is the case the order exists for.
- **Fixture gap.** Every WO-144 fixture input sets `cwd` to the fixture root
  (or a linked worktree's root). Both verifiers probed from the root.
- **Wider, not routed here.** The same precondition stands down the writer,
  live-gate, planning-branch and subagent refusals. WO-144 neither introduced
  nor is scoped to fix that; D007 boards it with a named planner follow-up.
- **Severity:** high. The operator relaxed the native sandbox in reliance on
  this refusal.
- **Repair direction (executor's choice, may need one operator answer):**
  judge outside destinations whenever the hook input's working directory lies
  inside the project, resolving relative destinations against that directory;
  or keep the precondition and say so everywhere the width is stated. Either
  way, journal one row naming the cause when the guard cannot judge, and add a
  generated-hook fixture whose input `cwd` is a project subdirectory. Criterion
  4 still binds: the four existing refusals stay unchanged.
- **Limits:** probed for the Bash tool only. Whether a write-tool call is
  affected the same way was not probed; the code path is the same
  (`harnessRoot` runs before any tool is inspected), which is an inference.

## F2 — The recorded incident's command is still admitted, and the documents do not say so

- **Criterion:** 5, and the order's cost line ("removes the recorded incident
  class") and criterion 2's label ("the parent directory (the recorded
  incident's shape)").
- **Observed**, built `packages/skeleton/dist/src/harness-command.js`:

  | Command | `shellWriteTargets` |
  | --- | --- |
  | `npm run meta 2>$PWD/../.x` | `null` |
  | `npm run meta 2>../.x` | `null` |
  | `printf x 2>$PWD/../.x` | `null` |
  | `printf x 2>../.x` | `[{"path":"../.x","redirect":true,…}]` |

  WO-054 VER-003 records the incident as a check command with a stray stderr
  redirect to `$PWD/../.x` that captured `meta`'s output. It is opaque on two
  independent grounds: the expansion, and the program. The second is the one
  nobody has stated: the extractor returns `null` for any command whose
  program is not one of its read commands (`echo`, `printf`, `cat`, `pwd`,
  `true`, `false`, `ls`, `head`, `grep`, bounded `tail`/`wc`/`ps`/`sed -n`/
  `git --no-pager`) or `touch`, `mkdir`, `tee`, `rm`. A redirect on `npm`,
  `node`, plain `git` or any other program is discarded with it, although the
  shell, not the program, opens that file.
- **Real-session width.** At this report's cutoff this session's journal
  holds 35 judgment rows: 34 `unobserved`, 1 `refused`. VER-002's inventory
  of a probe-heavy verifier session still shows 199 of 238 rows `unobserved`.
  The refusal judges a minority of shell calls.
- **What the documents say.** Product 03 hedges correctly that the incident is
  prevented "only when its destination is extractable". The security document
  and product 07 say the refusal covers "the shell destinations the existing
  extractor can name, including redirects". No document tells a reader that a
  literal redirect on an ordinary program is not judged, or that the incident
  as it happened would be admitted today. The PR and release text would
  inherit the overstatement.
- **Why it blocks.** By the order's letter ("a shell command whose write
  targets the existing extractor names") the behavior is inside the declared
  width, so this is not a failed fixture. It fails criterion 5: the width is
  stated in a way that hides its most relevant consequence.
- **Fixture gap.** WO-144 fixtures carry destinations only on `printf`,
  `true`, `touch` and `rm`.
- **Severity:** medium.
- **Repair direction (executor's choice):** state the width plainly in product
  03, product 07 §Discipline, the security document and the generated boundary
  text — which programs carry a judged redirect, and that the recorded
  incident's command remains under host permissions — within the cold-start
  ceilings (reviewer headroom is 200 bytes); or report literal redirect
  destinations for unrecognized programs through a separate accessor, leaving
  `shellWriteTargets`' "null means opaque" contract intact for the live-gate
  refusal that depends on it. Add one fixture with a redirect on a program
  outside the vocabulary, asserting whichever behavior is chosen.
- **Same repair:** VER-002 O5's doubled conjunction sits in the lines this
  touches (security document, product 07 §Discipline, and the README release
  block, which VER-002 did not list).

## Acceptance criteria

| # | Criterion (abridged) | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Decisions record the inventory, defaults and ungranted destinations | **met** | D001 and D005; VER-002's rerun. Historical destinations are unknown and labeled so |
| 2 | Default grants admit scratch and temporary writes; parent, sibling, documents-like, symlink-escape and removal refused | **met by fixture; objective fails at session width** | 6/6 fixtures reproduced here. From the root the refusal works live (row 490, VER-002's twelve probes). From a moved working directory it does not (F1) |
| 3 | Support-granted operator root admits under it only; unequip refuses; manifest lists roots and sources | **met** | Fixture reproduced; lowering read (`outsideWriteGrantsFor` requires an applied registry grant in the effective envelope) |
| 4 | Guard failure admits with one advisory and journals the cause; four refusals unchanged; in-project writes not judged | **met as written** | Fixture reproduced; the grant table is read only after an outside destination is found. F1's stand-down is a different path: it is not journaled |
| 5 | The documents state the width | **not met** | F1's precondition is stated nowhere; F2's consequence is stated nowhere and "including redirects" overstates it |
| 6 | `harness check`, `npm test`, `git diff --check`, no new dependency, cold-start totals | **met** | See Executed checks; the recorded gate row matches the current code identity; lockfile changes are internal pins |

## Diff review

I read the full source diff and found no further defect.

- **Guard.** `knownWriteDestinations` yields lazily, so a refusal already
  established survives a later resolution error. The `/dev/null` exemption
  needs the redirect marker, the literal spelling and a character device under
  `lstat`; it does not reach `rm`, `touch`, a symlink alias or
  `/dev/null/child`. `evaluateHarnessHook` keeps an existing deny or block
  ahead of the outside verdict and keeps an outside deny when the existing
  evaluation throws. `operator override:` is handled in the generated wrapper
  before the host runs, so it admits as the order requires.
- **Moved contract check.** "Hook input contract mismatch" now runs before the
  SessionStart branch. It changes behavior only for a SessionStart input with
  no `session_id`, which the host always supplies; the 106-case harness suite
  passed at this code identity.
- **Lowering.** Declarations are validated against a closed kind set; an
  operator root must be absolute and free of control characters; each root
  must match an applied registry grant, the allowed effects and no denied
  effect, or lowering throws.
- **Tests.** No existing assertion was weakened. The active-program hash in
  `executor-supports.test.ts` is now compared to a computed value, while the
  historical literal `fnv1a64:06245f5c581212f1` stays pinned on the saved graph
  compiled without grants. `test-authority-grants.mjs` asserts the two new
  provenance labels and rejects default roots on its unrelated synthetic
  grant.
- **D006 fixture repair.** Test-only atomic publication of the pause record;
  production lock code is untouched.
- **Generated surfaces** (hooks, manifest, role text, `CLAUDE.md`, console
  selfhost fixture) rest on `harness check` and their recorders, not on a
  line read.

## Verification sequence

VER-001's failure was sound and its four findings stay repaired: I reproduced
the refusal from the root and the single journal row per judged call (row
490 is one row, not four). VER-002's pass was reasonable on what it probed.
Both verifiers, like every fixture, ran from the worktree root with programs
inside the extractor's vocabulary, which is why neither met F1 or F2. VER-002's
O1–O4 stay covered by D001 and D005's reopening conditions as it says; O5 joins
F2's repair.

## Goal alignment

- **Mission:** let the operator keep the native sandbox relaxed without a
  mistaken path reaching their folders.
- **Observed against that promise:** from the root, with a recognized program,
  the refusal is real, precise and well recorded. One ordinary `cd` removes it
  without a trace, and the incident that prompted the order would still
  succeed.
- **Traps.** *Seeking the wrong goal* and *drift to low performance*: green
  fixtures that all send `cwd: root` measured the fixture. *Shifting the
  burden*: passing would leave the operator to discover the stand-down.
  *Rule beating*: the stand-down is reached by accident, so it is a defect, not
  an evasion to be policed. *Policy resistance* and *fixes that fail*: the
  repair must not disturb the four refusals that share the precondition; the
  wider question has its own follow-up. *Escalation*: no new hook or classifier
  is requested. *Commons*: one reviewer, no subagents, no redundant gate run.
  *Success to the successful*: the verdict chooses no mechanism. *Naive
  Interventionism*: I changed no source and did not use the defect to clean up
  after my own probe.
- **NoOp,** passing, publishes `v0.33.0` under a title this review knows to be
  false after any `cd`, which is outward-facing and harder to take back than
  one repair cycle. The operator may still direct that the findings be boarded
  and the order passed; that is their decision to make with this evidence, not
  the reviewer's to presume.

## Limits

- Live probes ran on darwin, for the reviewer role, through the Bash tool.
- I did not probe a moved working directory outside the project, a write-tool
  call from a moved directory, or whether subagent calls inherit the role.
- No PR body or release notes were prepared: nothing is publishable, and both
  would be rewritten after repair. The existing `PR.md` is the executor-side
  generated process meter, untouched.
- Process cost at handoff (`node scripts/harness.mjs usage <host session id>`):
  source `claude-transcript-message-usage`, scope dispatch, observed
  `2026-09-19T22:04:33.543Z`; totalTokens 6,162,143 (input 92, cached input
  5,949,535, cache write 181,284, output 31,232); reasoning tokens and dollar
  cost unavailable, therefore unknown; 58 steps, 45 commands, subagents 0 of
  cap 20. Final counters are in the response.

This review does not pass the branch for publication. Bounded repair,
independent reverification and a new numbered final review remain required.
