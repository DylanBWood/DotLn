# WO-100 FINAL-002 — final review

**Verdict:** pass. The portfolio does what the order asks, and the FINAL-001 repair closes each finding routed to it. Candidates derive bounded orders inside the portfolio and the phase and materialize as durable records. Activation carries a `host-policy` grant, WO-052 changes the code and WO-054 verifies it before the curve advances, a failed verification resets the curve, and a spent budget refuses dispatch. The reviewer gate `npm test -- --review` passed 38 of 38 on the subject this report judges. `main` has not moved since FINAL-001 integrated it, so this review integrated nothing. [D016](../../evidence/WO-100/decisions.md#wo-100-d016) and [D017](../../evidence/WO-100/decisions.md#wo-100-d017) stay boarded up with their named follow-ups. I met no new defect.

**Subject:** [`docs/work-orders/WO-100-preauthorized-portfolio.md`](../../work-orders/WO-100-preauthorized-portfolio.md) on branch `wo-100`, uncommitted at review, over `main` at `28f9f870a2891fb65796324bbdb5f5853ddccee9` (WO-064, `v0.43.0`). The original base is `15fa8a7953707d6caa768a0edc01b6b6678238a9`, and FINAL-001 integrated `28f9f870` under checkpoint `refs/dotln/checkpoint/WO-100/15` ([D013](../../evidence/WO-100/decisions.md#wo-100-d013)). `git ls-remote origin` shows `refs/heads/main` still at `28f9f870` and no tag above `v0.43.0`. The integration receipt reads `complete: true`, with nothing pending and no authored path. The judged tree is the working tree at this dispatch's checkpoint `refs/dotln/checkpoint/WO-100/21`. It differs from that checkpoint only in the regenerated `docs/control/current.md`, `docs/work-orders/README.md`, the order's control log and the PR meter. Between VER-004's dispatch checkpoint (19) and 21, only control projections and VER-004 itself changed. So VER-004 and this review judged the same code, and both review gates record code identity `c6b6fc6f`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended Claude Code session. The harness version is `claude --version` (2.1.280), and the model is this session's configured identifier. Effort `xhigh` is this session's `CLAUDE_EFFORT` and `~/.claude/settings.json` `modelSettings["claude-opus-5-5"].effortLevel`. Claude Code exposes no effective readback, so the source is `operator-attested`. The order asks for `reviewer any`. No subagent ran: 0 of the cap of 20, as planned before the review began, with any unobserved remainder unknown.

**Process cost:** entry 84183 tokens; handoff 15549632 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 56488df3-de35-4ce7-a02a-7ebd229144cd`, observed at 2026-09-22T21:11:18.392Z and 2026-09-22T21:26:55.063Z. The handoff reading has input 186, cached input 15,271,969, cache write 218,473 and output 59,004 tokens over 99 steps and 73 commands, and later handoff steps are not in it. Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. The product gate took 468,412 ms and dominated wall time. A first launch of it failed before any suite ran, because its output redirect named a scratch directory that did not exist yet. While the gate ran, the harness refused Git and most shell reads, so drafting moved to session scratch. The independent reruns below took about two minutes. I chose not to fan out: FINAL-001's two review subagents cost about 371,000 tokens between them, over code this repair left unchanged. That saves tokens and wall time, and the price is one reader instead of three on the unchanged code. I offset it by rereading the derivation, host and budget code myself and by rerunning the repair's decisive evidence rather than accepting its receipts. Final counters remain in ignored receipts and the handoff response.

## Goal-aligned judgment

WO-100 is the step between the executable discovery producer (WO-119) and the unattended hour (WO-111): it turns a candidate into bounded, verified work. After FINAL-001, the open question was whether the evidence for criteria 2, 3 and 5 would fail if the behaviour regressed. That is the *rule-beating* and *drift to low performance* lens. So I judged the repair by running its evidence against regressions, not by reading its passing counts. The in-profile suite run and two negative controls reproduce here, and both curve fixtures now fail when a failure is turned into a success or the episode check is removed.
- **NoOp**, failing or holding the review, would leave a verified loop unpublished with no finding to repair.
- **Naive Interventionism** argued against touching the subject in review. I edited no source; the only files I wrote are this report, the PR body and the release notes.
- **Seeking the wrong goal:** the gate's green count is not the goal. The goal is that the curve advances only on a pass, and the controls show that.
- **Policy resistance** and **success to the successful:** the repair extends WO-140's declared set through WO-140-D001's own reopening condition, not around it.
- **Tragedy of the commons:** one broad gate ran, the one that binds publication.
- **Escalation** and **shifting the burden to the intervenor:** D017's helper defect remains a named planning follow-up rather than a rescue left for the next reviewer.

## Authority: the order text against its activated text

The order file is unchanged since FINAL-001, where `git diff refs/dotln/checkpoint/WO-100/1` showed only the H1's release assignment (now `v0.44.0`) and the operator's scope-expansion paragraph. [D007](../../evidence/WO-100/decisions.md#wo-100-d007) records that paragraph, and `docs/control/plan-refutations.jsonl` binds it with `PlanExecutionAmended`. Every acceptance criterion, the design, the evidence gate, the write-back duty, the non-goals and the dependency block are the activated text. `npm run plan -- check` exits 0.

## The verification sequence

| Report | Harness and model | Verdict | Routed to |
| --- | --- | --- | --- |
| [VER-001](../../verifications/WO-100/VER-001.md) | Codex CLI 0.155.1 / `gpt-6-sol` `xhigh` | fail: a Sort move checked by a pathless command never reached WO-054 | [repair](../../evidence/WO-100/repair.md), [D010](../../evidence/WO-100/decisions.md#wo-100-d010) |
| [VER-002](../../verifications/WO-100/VER-002.md) | same | fail: the refutation guide stated pre-migration defaults | [repair-002](../../evidence/WO-100/repair-002.md), [D012](../../evidence/WO-100/decisions.md#wo-100-d012) |
| [VER-003](../../verifications/WO-100/VER-003.md) | same | pass | final review |
| [FINAL-001](FINAL-001.md) | Claude Code 2.1.280 / `claude-opus-5-5[1m]` `xhigh` | fail: the `portfolio` suite's outside-only declaration broke WO-140's inventory invariant; three minor findings | [repair-003](../../evidence/WO-100/repair-003.md), [D018](../../evidence/WO-100/decisions.md#wo-100-d018)–[D020](../../evidence/WO-100/decisions.md#wo-100-d020) |
| [VER-004](../../verifications/WO-100/VER-004.md) | Codex CLI 0.155.1 / `gpt-6-sol` `xhigh` | pass, including `npm test -- --review` (38 of 38) | final review |

Implementation and all three repairs ran on Claude Code with `claude-opus-5-5[1m]`, and every verification ran on Codex CLI with `gpt-6-sol` and session readback. So verification was independent of implementation in both harness and model. This review ran on the implementation's harness and model.

## Criterion 1 — bounded derivation and durable records

`deriveWorkOrders` (`packages/skeleton/src/portfolio.ts:442-594`) imports only compiler helpers and constants and reads no clock, file or process. Each candidate maps to one outcome. A mechanic outside the portfolio or a path outside its surfaces becomes a suggestion. An effect no writer carries, or a kind with no verification command, becomes `NeedsHuman`. A candidate only another phase admits is deferred. An order's envelope is `portfolioEnvelope`: the ceiling's effects inside the phase's allowed effects, outside its denied effects and inside `SOURCE_CHANGE_ALLOWED`, with the source-change denials added and the file limit at the minimum of ceiling, phase scope and phase envelope. The grant's effects are checked against that envelope before an order is returned (`:511-519`). `admitPortfolio` (`:292-325`) bounds each ceiling by the phase and the floor and requires a writer unit. The only source change since VER-003 narrows `decodePortfolioBinding` to a 40-hex base (`:274-287`). The `portfolio` suite passed in the gate (19.60 s), with in-portfolio orders materialized through the real WO-120 path and out-of-portfolio candidates allocating nothing. **Holds.**

## Criterion 2 — activation, WO-052, WO-054, advance and reset

`PortfolioOrderActivated` is recorded before the episode runs, and the fold refuses an observation without it and recomputes `verified` (`resident-state.ts:742-799`). The host's pass rule (`portfolio-host.ts:339-347`) needs no escalation, every criterion evaluated and passing, and no finding. A Sort move must first satisfy `relocationHolds` (`:115-149`), or the order fails with no verifier dispatched. Both curve fixtures now fail their first order in `widen`, the non-last phase, then pass the second `widen` order to `peak`. The end-to-end fixture's wrong lint fix appends a comment, so the fixture repository's `checks/lint.cjs` still finds `BAD_STYLE`. Its test fix removes `BROKEN_RESULT`, which `checks/test.cjs` rejects. I reran the control FINAL-001 showed missing, turning every failure into `verified-success` in the built resident. Both curve tests fail at `expected: 'probe', actual: 'peak'`. **Holds.**

## Criterion 3 — budget exhaustion

`portfolioSelection` (`resident-state.ts:334-383`) checks episodes, wall time and reported tokens before any derivation. Both curve fixtures now refuse `peak` with `budget exhausted: 2 of 2 episodes` while `peak` still admits the Sort move of `loose/guide.md`, and no third portfolio episode dispatches. With the episode check removed from the built resident, both curve tests fail at `expected: 'peak', actual: 'probe'`, because the Sort move ran and then reset. A separate unit case refuses on spent wall time and, separately, on spent reported tokens, while episodes remain. **Holds.** The budget is charged when an episode ends, so the last admitted episode can overrun ([D001](../../evidence/WO-100/decisions.md#wo-100-d001), [D006](../../evidence/WO-100/decisions.md#wo-100-d006)). No current host reports tokens.

## Criterion 4 — write-backs

Product 06 allocates the portfolio candidate and records the always-on model default as a candidate. Product 03 states the progressive-authority status. Product 07 has §Declaring a portfolio, which now names the 40-hex base, and §Gate sandbox preflight names `portfolio` beside `skeleton`. The order was filed before 2026-09-09, so its ledger duty is discharged by its decisions file and the generated index rows. The two release labels from FINAL-001 F2 now say `v0.43.0`, which `28f9f870` and the tag support. `npm run publication:check` passes (both editions CURRENT, 30 and 45 linked sections). **Holds.**

## Criterion 5 — gate, whitespace, dependencies, pins and edition

**Holds.** The reviewer gate `npm test -- --review` ran after every intended file was staged:

- **Gate:** **38 passed, 0 failed, 468.41 s, 82 fresh tasks, exit 0**, recorded 2026-09-22T21:21:23.530Z. Tree `91671b82ffe21b0d863553724698566c0fa9fe0e`, code identity `c6b6fc6f107bd7e0bdb871e014c98c3bc13ca3fde71333a2e6807f8cb0531b2c`, sandbox not in force (a nested `sandbox-exec` probe exited 0). `runner-fixtures`, the suite that failed in FINAL-001, passed (11.68 s), as did `portfolio`, `skeleton` (289.81 s), the four evidence suites, `harness-evidence` and `worktree-integration`.
- **Whitespace:** `git diff --check` and `git diff --cached --check` are clean.
- **Dependencies:** none added. The lockfile and package files move skeleton from `0.36.0` to `0.37.0` and the console from `0.1.8` to `0.1.9` with its skeleton pin.
- **Suppressions:** no added line under `packages/*/src`, `packages/*/test`, `scripts` or `.claude/hooks` introduces an `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `prettier-ignore` or `biome-ignore` directive.
- **Bundle and editions:** `node scripts/harness.mjs check` passes over 31 generated surfaces. `docs/evidence/current.json` selects WO-100's feedback-001, authority-002 and artifact-identity editions, and their suites passed in the gate.
- **Release surfaces:** `npm run release -- check-surfaces --local` reports 44 PASS, and `release prepare --local` reports `WO-100 target v0.44.0 remains current`.

## FINAL-001 findings at this subject

- **F1** ([D014](../../evidence/WO-100/decisions.md#wo-100-d014) → [D018](../../evidence/WO-100/decisions.md#wo-100-d018)): **resolved.** The declaration stays, with its cause recorded. I reran the end-to-end suite inside `sandbox-exec -p '(version 1)(allow default)'`. It recorded 1 pass and 2 failures, both `discovery: check sandbox or launch refused`, matching the [repair receipt](../../evidence/WO-100/repair-003-portfolio-in-seatbelt.tap). The inventory test, the runner comment and product 07 name `portfolio`. D018's step from an explicit Seatbelt profile to a harness sandbox remains the inference it states.
- **F2** ([D020](../../evidence/WO-100/decisions.md#wo-100-d020)): **resolved.** Both labels say `v0.43.0`.
- **F3** ([D019](../../evidence/WO-100/decisions.md#wo-100-d019)): **resolved** by a dated correction. The earlier decisions and the immutable VER-002 keep their bytes. The corrected paragraph states the same values, and the binding comparison was always the guide against `refute-plan.mjs`.
- **F4** ([D020](../../evidence/WO-100/decisions.md#wo-100-d020)): **resolved.** Reset, budget, wall-time, token and binding cases are covered, and the two controls above reproduce here. After each mutation the built `resident-state.js` was restored from its saved copy and matched it under `cmp`, and the unmutated tests passed.

## Boarded up, not repaired

[D016](../../evidence/WO-100/decisions.md#wo-100-d016) (`FUP-a05fb27e0e8f9bcf`): WO-052 checks committed paths only by surface prefix, so nothing counts a Shine or Standardize change's files or refuses a file turned into a directory. It is due before WO-111 runs a portfolio unattended on an operator repository, and it includes rewording `portfolio.ts:43`, which still reads "Host-counted files the order may touch". [D017](../../evidence/WO-100/decisions.md#wo-100-d017) (`FUP-bed0e3123bc66fa8`): `worktree integrate` strands itself on intent-to-add entries. Neither bears on a criterion. The first-portfolio assumption, 5S maintenance in a scratch repository, holds: no operator repository is bound.

## Clean-room screen and the ideation-receipt clause

FINAL-001 screened the subject. I screened the repair's added lines between checkpoints 17 and 21 for absolute local paths, URLs, addresses other than `example.invalid`, credential words and private keys, and found no hit. The repair's transcripts replace the checkout and temporary paths with `<checkout>` and `<tmp>`. This order has no ideation breakout receipt. Its scope expansion is the operator's direction during `resume: next`, recorded in the order paragraph and D007 and bound by `plan amend-order`. So the dispatch's "ideation receipt" clause resolves to that record and to the [implementation receipt](../../evidence/WO-100/implementation.md). No intake material was read.

## Publication

On this pass I commit the reviewed state as four coherent commits, each with a plain subject and no attribution:
1. The portfolio feature with its tests, fixture, configuration section, runner suite and evidence-source registrations.
2. The model migration with its tests, compiler fixtures, probes and the documents that state only those defaults.
3. The shared product and runbook documents, the regenerated bundle and evidence editions, and the `v0.44.0` staging.
4. WO-100's lifecycle records.

Then `npm run worktree -- publish WO-100` pushes the branch and opens the PR with the body in [PR.md](PR.md) and this reviewed title: ":passport_control: The resident can now turn discovered maintenance into bounded, verified work orders, only inside a portfolio the operator preauthorized". The five-section [release notes](RELEASE-NOTES.md) sit beside it. This review merges, tags and releases nothing.

## Reproduction

From `/Users/dylanwood/Projects/DotLn-wo100` on branch `wo-100`:

```text
git ls-remote origin refs/heads/main
npm test -- --review
sandbox-exec -p '(version 1)(allow default)' node --test --test-reporter=tap --test-concurrency=1 scripts/test-portfolio.mjs
node --test --test-name-pattern="criteria 1-3" scripts/test-portfolio.mjs
node --test --test-name-pattern="resets from a non-last phase" packages/skeleton/dist/test/portfolio.test.js
git diff --check && git diff --cached --check
npm run plan -- check
npm run publication:check
node scripts/harness.mjs check
npm run release -- check-surfaces --local
npm run release -- prepare --local
```

The two negative controls replace `? "verified-success" : "failure"` with `? "verified-success" : "verified-success"`, and `if (used.episodes >= budget.episodes)` with `if (false)`, in `packages/skeleton/dist/src/resident-state.js`. Run the two curve tests above after each replacement, then restore the file from a saved copy.
