# WO-100 repair — FINAL-001 F1 to F4

Dispatch: `resume: fix`, 2026-09-22, recorded by the harness before this
procedure loaded. Subject: the findings [FINAL-001](../../final-reviews/WO-100/FINAL-001.md)
routed to repair, through their structured follow-ups
[WO-100-D014](decisions.md#wo-100-d014) (F1) and
[WO-100-D015](decisions.md#wo-100-d015) (F2 to F4). FINAL-001, the three
verification reports and the earlier receipts and transcripts keep their bytes.
This record adds [WO-100-D018](decisions.md#wo-100-d018),
[WO-100-D019](decisions.md#wo-100-d019) and
[WO-100-D020](decisions.md#wo-100-d020). D016 and D017 stay boarded up with
their named planning follow-ups, as FINAL-001 routed them.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"operator-attested"}

Human actor: the operator dispatched `resume: fix` in an attended Claude Code
session. The harness version is `claude --version`, and the model is this
session's configured identifier. Effort `xhigh` comes from this session's
`CLAUDE_EFFORT` and from `~/.claude/settings.json`
`modelSettings["claude-opus-5-5"].effortLevel`. Claude Code exposes no
effective readback, so the source is `operator-attested`.

**Process cost:** entry 83190 tokens; handoff 16788126 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage
c2e37d7e-6c9c-46a8-915c-79204390874d`, observed at 2026-09-22T20:29:53Z and
20:51:42Z. The handoff reading has input 170, cached input 16,461,323, cache
write 252,409 and output 74,224, over 96 steps and 75 commands. Later handoff
steps are not in it. Reasoning tokens and dollar cost are unavailable, which
means unknown, not zero. Observed subagents: 0 of the configured cap of 20,
with an unknown unobserved remainder. No agent or paid external worker was
launched. The reviewer gate took 470.73 s and dominated wall time. The focused
suite runs and negative controls took about a minute in total.

## F1 — the portfolio suite's outside-only declaration (D014 → D018)

The declaration stays, and now has its recorded environmental cause. The
suite's end-to-end tests run WO-119 discovery, which wraps each check in
`/usr/bin/sandbox-exec` (`discovery.ts:305-335`), and WO-054's witness, which
does the same (`verification-worktree.ts:166-191`). An outer Seatbelt sandbox
refuses a nested one. The receipt is
[repair-003-portfolio-in-seatbelt.tap](repair-003-portfolio-in-seatbelt.tap).
Run inside an outer `(allow default)` Seatbelt profile, which differs from the
outside run only by the nesting, the suite records 1 pass and 2 failures. Both
failures are `discovery: check sandbox or launch refused`. Outside, the same
command passes 3 of 3
([repair-003-portfolio-e2e.tap](repair-003-portfolio-e2e.tap)). This meets
WO-140-D001's own reopening condition. The inventory test
`scripts/test-runner.test.mjs` now expects `skeleton` and `portfolio`, the
runner row's comment names the cause and D018, and product 07 §Gate sandbox
preflight names `portfolio` beside `skeleton`.

This session's shell was not inside a harness sandbox: a nested
`sandbox-exec` probe exited 0. So the receipt supplies the outer profile
explicitly. That a macOS harness sandbox is Seatbelt is an inference, from
WO-140-D001's receipts, in which skeleton's nested launches failed the same way
inside harness sandboxes.

## F2 — stale version labels (D015 → D020)

`docs/instance/entropy-reducer/README.md` and product 03 §First live Entropy
Reducer use now say the Fable 5.1 `max` pin lasted through `v0.43.0`.
`git show 28f9f870:packages/skeleton/src/loadouts/entropy-reducer.ts` still
pins `claude-fable-5-1`, and `refs/tags/v0.43.0` peels to `28f9f870`.

## F3 — the citation (D015 → D019)

D019 is a dated correction. D011 and D012, and VER-002 and
[repair-002](repair-002.md), which quote them, cite a
`docs/AI-HARNESS-SECURITY.md` §Planning refutation that does not exist. The
paragraph meant is "Entropy Reducer launch line (WO-151, 2026-09-22)". It
states the `npm run entropy` defaults, which are the same values in the same
form as `scripts/refute-plan.mjs`'s. The binding comparison in D011 and D012
was always the guide against `refute-plan.mjs` itself, which both decisions
also cite, so their conclusions stand. No document changed.

## F4 — evidence that could stay green on a regression (D015 → D020)

- **Reset from a non-last phase.** Both curve fixtures now fail their first
  order in `widen`. A pass there would advance to `peak`, so the asserted
  return to `probe` can only be the reset. The unit fixture
  (`packages/skeleton/test/portfolio.test.ts`) uses the port doubles. The
  end-to-end fixture (`scripts/test-portfolio.mjs`) uses the real WO-052 and
  WO-054 hosts, with a writer that makes a wrong lint fix and the real test
  fix. The second `widen` order passes and advances to `peak`.
- **Budget with an in-phase candidate left.** `peak` still admits the Sort move
  of `loose/guide.md`, yet it is refused with `budget exhausted: 2 of 2
  episodes`, and no third portfolio episode dispatches. The unit test also
  shows that the same recorded state with one more episode would activate that
  move.
- **Wall-time and token refusals.** A new unit case spends 20 ms of a 15 ms
  wall budget and, separately, 7 of 5 reported tokens. Each refuses `peak` with
  its own reason while episodes remain and `peak` admits the failing-test order.
- **The binding's commit form.** `decodePortfolioBinding` accepts only a
  40-hex base, because WO-054's worktree preparation
  (`verification-worktree.ts:255`) and the compiler's snapshot contract
  (`verification.ts:507`) refuse any other form. A 64-hex base now refuses, and
  product 07 §Declaring a portfolio says so.

**Negative controls.** Each is a mutation of the built
`packages/skeleton/dist/src/resident-state.js`, restored byte for byte
(`cmp`) after each run:

| Mutation | New unit tests | New end-to-end curve | Previous end-to-end curve |
| --- | --- | --- | --- |
| every failure becomes `verified-success` | curve test fails (`'peak' !== 'probe'`) | fails (`'peak' !== 'probe'`) | **passes** (exit 0, 1 of 1) |
| episode check removed | curve test fails (`'probe' !== 'peak'`: the Sort move ran) | fails (same) | not run |
| wall-time check removed | wall/token case fails (no refusal) | — | — |
| token check removed | wall/token case fails (no refusal) | — | — |

The previous end-to-end curve staying green under the first mutation is
FINAL-001's F4, now observed.

## Defects met inside the repair

None beyond the findings. Before writing, I checked whether the security
document states `refute-plan.mjs`'s defaults anywhere. It does not, so D019
records the paragraph meant and what it states, rather than claiming it states
the planning command's defaults.

## Checks executed (2026-09-22)

| Command | Result |
| --- | --- |
| `npm test -- --review` | **38 passed, 0 failed, 470.73 s, 82 fresh tasks, exit 0**, recorded 2026-09-22T20:49:10.219Z at tree `51a48836f0628673d67d3ceeb8faf05618af9085`, code identity `c6b6fc6f107bd7e0bdb871e014c98c3bc13ca3fde71333a2e6807f8cb0531b2c`, sandbox not in force, not partial; `runner-fixtures` (11.74 s) and `portfolio` (20.58 s) passed |
| `npm run test:docs` | 20 suites passed, 0 failed |
| `node --test --test-reporter=tap --test-concurrency=1 scripts/test-portfolio.mjs` | 3 tests, 3 pass ([repair-003-portfolio-e2e.tap](repair-003-portfolio-e2e.tap)) |
| `node --test --test-reporter=tap packages/skeleton/dist/test/portfolio.test.js` | 6 tests, 6 pass ([repair-003-portfolio-unit.tap](repair-003-portfolio-unit.tap)) |
| the end-to-end command under `sandbox-exec -p '(version 1)(allow default)'` | exit 1: 1 pass, 2 fail, both `discovery: check sandbox or launch refused` ([repair-003-portfolio-in-seatbelt.tap](repair-003-portfolio-in-seatbelt.tap)) |
| `node --test --test-name-pattern="WO-140 the real inventory" scripts/test-runner.test.mjs` | 1 of 1 pass |
| negative controls (table above) | every new assertion fails under its mutation; built file restored and compared with `cmp` after each |
| `node scripts/{authority,artifact-identity,feedback,verification}-evidence.mjs --check` | all four exit 0; the selected editions stay current |
| `node scripts/harness.mjs check` | 31 generated surfaces, exit 0 |
| `npm run plan -- check` | exit 0 |
| `npm run publication:check` | 275/275 headings; both editions CURRENT (30 and 45 linked sections) after their source locks were refreshed |
| `npm run meta` | exit 0 |
| `npm run release -- prepare --local` | `WO-100 target v0.44.0 remains current; no files changed` |
| `npx prettier --check` on the changed code and documents | clean |
| `git diff --check` and `git diff --cached --check` | clean |

## Limits

- The effective model and effort are `unknown`. The attestation is the
  session's configured model and its operator-configured effort.
- The in-sandbox receipt supplies an explicit outer Seatbelt profile, because
  no harness sandbox was in force in this session. That a macOS harness
  sandbox refuses the suite the same way is an inference from WO-140-D001's
  receipts.
- The negative controls mutated the built JavaScript, not the source. The
  built file was restored and matched its saved copy under `cmp` before the
  gate ran.
- In the three new transcripts, the checkout path is replaced by
  `<checkout>` and temporary paths by `<tmp>`. No other bytes differ from
  the runs.
- The publication source locks were refreshed with `check-publication.mjs
  --print-locks`, the procedure the integration helper uses. The editions'
  text was not otherwise changed, and no heading changed.
- D016, the uncounted committed files in WO-052, and D017, the integration
  helper stranded by intent-to-add entries, remain boarded up with their
  named planning follow-ups.
- No second economy experiment ran: D002 is this order's one decision.

## Follow-up queue

Revision 5 at entry and at handoff: the implementation's `adjacent-0001` is
completed, nothing is running and `next` is null. This repair added no item.
