# WO-100 FINAL-001 — final review

**Verdict:** fail. The portfolio does what the order asks: candidates derive bounded orders inside the portfolio and the phase, activation carries a `host-policy` grant, WO-052 changes the code, WO-054 verifies it and a spent budget refuses dispatch. The failure is in the reviewer's product gate on the integrated tree. `npm test -- --review` failed 37 of 38 suites, and the one failing suite is caused by WO-100 itself: its new `portfolio` suite declares `needs: outside-sandbox`. That declaration breaks WO-140's gate-inventory invariant, and no decision records the environmental cause WO-140-D001 requires ([D014](../../evidence/WO-100/decisions.md#wo-100-d014), `FUP-80e77acc45e4ec75`). The implementation and all three verifications ran plain `npm test`, which does not select that suite. The operator chose to fail to repair over fixing it in review. Three minor findings go to the same repair ([D015](../../evidence/WO-100/decisions.md#wo-100-d015), `FUP-27da6527b3696f80`). One inherited limit of the source-change host ([D016](../../evidence/WO-100/decisions.md#wo-100-d016), `FUP-a05fb27e0e8f9bcf`) and one integration-helper defect ([D017](../../evidence/WO-100/decisions.md#wo-100-d017), `FUP-bed0e3123bc66fa8`) are boarded up with named follow-ups.

**Subject:** [`docs/work-orders/WO-100-preauthorized-portfolio.md`](../../work-orders/WO-100-preauthorized-portfolio.md) on branch `wo-100`, uncommitted. The original base is `15fa8a7953707d6caa768a0edc01b6b6678238a9`. This review integrated `main` at `28f9f870a2891fb65796324bbdb5f5853ddccee9` (WO-064, published as `v0.43.0`) by fast-forward, with checkpoint `refs/dotln/checkpoint/WO-100/15` and stash `544330e6b8b197621c41afcd120cfb02e645f3b5` retained ([D013](../../evidence/WO-100/decisions.md#wo-100-d013)). The judged tree is the integrated working tree with WO-100's seven new files fully staged. The reviewer gate ran at tree `a25aee7c36248b88a8d498b4426844fde8fb31c4`, code identity `ef024991f563e3febf02b192b4e531dfb0dda55575fd910194c71538c1fc520c`. Nothing was committed, pushed or published.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended Claude Code session. During the review they chose "Recover and re-run" for the stranded integration and "Fail to repair" for the gate failure. The harness version comes from `claude --version`, and the model is this session's configured identifier. Effort `xhigh` is from this session's `CLAUDE_EFFORT` and from `~/.claude/settings.json` `modelSettings["claude-opus-5-5"].effortLevel`. Claude Code exposes no effective readback, so the source stays `operator-attested`. The order asks for `reviewer any`. Two read-only review subagents ran, one on portfolio correctness and one on the model-migration scope. `harness usage` counts 2 of the cap of 20 as `exact-observed`, and the subagents' own notifications report 183,671 and 187,393 tokens. I rechecked every finding below against the source myself before recording it.

**Process cost:** entry 82084 tokens; handoff 15862936 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage a18997e6-ffe6-43f1-a43d-fa369f33efed`, observed at 2026-09-22T20:05:09.753Z and 2026-09-22T20:25:35.399Z. Of the handoff total, 15,573,689 tokens are cached input re-read over 108 observed steps and 85 commands. Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. The subagents' tokens are outside this counter. Most of the wall time went to one product gate, which took 469,046 ms, and to the two parallel subagent reviews, which ran for 490,575 ms and 641,018 ms. During the gate the harness refused most repository commands, `git diff` included. Final counters remain in ignored receipts and the handoff response.

## Goal-aligned judgment

WO-100 connects the executable discovery producer (WO-119) to the later unattended hour (WO-111). It is the step that turns a candidate into bounded, verified work, and the code review supports that it does so. The failure is not in that loop. It is in the gate machinery's own record: four green plain gates ran, and none of them ran the WO-140 invariant this order broke. That is the *rule-beating* lens exactly, evidence that passes without the intended behaviour. *NoOp*, passing anyway, would publish bytes whose own reviewer gate is red. *Naive Interventionism* argued against fixing the declaration in review: that would change the gate machinery and reopen a WO-140 decision, with the reviewer as its only judge. The operator weighed the cost of one repair, verification and review cycle and chose it. *Tragedy of the commons*: the fix is one declaration, one test expectation, one product sentence and one decision, and the minor findings ride along because a repair is open anyway. *Shifting the burden to the intervenor* is why D017 is recorded. The integration helper stranded itself on an ordinary executor action and needed the operator's permission to recover. *Seeking the wrong goal* and *drift to low performance*: F4 below records fixtures that assert the right outcomes but could stay green if the reset or budget code regressed. *Policy resistance*, *escalation* and *success to the successful* raised no additional concern: the portfolio reuses the compiled presence transitions, the WO-120 materializer and the WO-052 and WO-054 hosts, and adds no approval step.

## Authority: the order text against its activated text

`git diff refs/dotln/checkpoint/WO-100/1 -- docs/work-orders/WO-100-preauthorized-portfolio.md` shows two changes. The H1's `(version assigned at activation)` became `(v0.44.0)`, and a new **Operator scope expansion (2026-09-22)** paragraph was added. Every acceptance criterion, the design, the evidence gate, the write-back duty, the non-goals and the dependency block are unchanged. [D007](../../evidence/WO-100/decisions.md#wo-100-d007) records the expansion's authorization, and `docs/control/plan-refutations.jsonl` holds its `PlanExecutionAmended` binding to D007. `npm run plan -- check` exits 0 on the integrated tree. The first assignment was `v0.43.0`, retimed to `v0.44.0` after WO-064 published `v0.43.0`. That retime is recorded in product 06 and [repair-002](../../evidence/WO-100/repair-002.md), and a retime is not a finding.

## The verification sequence

There are three reports. [VER-001](../../verifications/WO-100/VER-001.md) failed on F1: a valid Sort move checked by a pathless command such as `npm test` could not reach WO-054, because `verificationSurfaces` returned no surface common to both snapshots. The repair [D010](../../evidence/WO-100/decisions.md#wo-100-d010) anchors the one criterion on the shared tree only when the narrow selection is empty. I read `packages/skeleton/src/portfolio-host.ts:155-179`, where the narrow selection keeps precedence and the fallback is `shared(base)`, which contains only files present in both trees. WO-054's snapshot rule is untouched. [VER-002](../../verifications/WO-100/VER-002.md) confirmed that repair and failed on F1: the planning-refutation guide still stated the pre-migration defaults. The repair [D012](../../evidence/WO-100/decisions.md#wo-100-d012) corrected the guide, and the migration audit in this review found the guide agreeing with `scripts/refute-plan.mjs`. [VER-003](../../verifications/WO-100/VER-003.md) passed at the pre-integration subject, and its judgment of criteria 1 to 4 carries forward (below). Implementation and repairs ran on Claude Code 2.1.280 / `claude-opus-5-5[1m]`, and all three verifications ran on Codex CLI 0.155.1 / `gpt-6-sol` with session readback. So verification was independent of implementation in both harness and model. This review ran on the same harness and model as the implementation.

## Criterion 1 — bounded derivation and durable records

`deriveWorkOrders` in `packages/skeleton/src/portfolio.ts` is pure: it imports only compiler helpers and constants, and uses no clock, file system or randomness. Each candidate maps to exactly one outcome. An order's envelope is the ceiling's effects intersected with the phase's allowed effects, minus the phase's denied effects, and limited to what a source change may carry. Its denied effects add the source-change denials. Its file limit is the minimum of the ceiling, the phase scope and the phase envelope. The grant is `host-policy`, with effects checked to lie inside that envelope (`portfolio.ts:511-518`), so it is never wider. `admitPortfolio` checks every ceiling against the phase and the floor and requires a writer unit, and the resident's decoder always runs it. The fixtures assert every derived order's surfaces, size and envelope against the portfolio and phase. `scripts/test-portfolio.mjs` materializes the in-portfolio orders through the real WO-120 path into the index, and out-of-portfolio candidates allocate nothing. The `portfolio` suite passed on the integrated tree (20.87 s). **Holds, carried forward from VER-003.** A limit outside this criterion, that nothing counts the committed change's files, is D016.

## Criterion 2 — activation, WO-052, WO-054, advance and reset

`PortfolioOrderActivated` is appended after `ScriptEpisodeDispatched` and before the adapter runs. The unit test's `materialize` double observes it already durable, and the activation carries `grantedBy: "host-policy"`. The end-to-end suite drives the real `SourceChangeHost` and `VerificationHost` with doubles for the writer and verifier, and the pass rule (`portfolio-host.ts:341-347`) needs no human escalation, every criterion evaluated and passing, and no finding. The fold recomputes `verified` and refuses a log that contradicts it (`resident-state.ts:769-771`). The shared observation handler then maps unverified to `failure` (`:796`), and the compiled failure transition goes to the first phase. **Holds on code and the asserted `verified: false`.** The curve fixtures fail their order in `peak`, the last phase, and there a verified success also wraps to `probe` with the same actions (`packages/compiler/src/presence.ts:130-150`). So the `probe` assertion alone cannot tell a reset from an advance; that is F4.

## Criterion 3 — budget exhaustion

`resident-state.ts:343-355` checks episodes, wall time and reported tokens before derivation (`:358`). Both suites record two episodes, then exactly one `ScriptEpisodeRefused` reading `portfolio gardener-5s v1 budget exhausted: 2 of 2 episodes`, and no third portfolio dispatch. **Holds.** The budget is charged at episode end, so the last admitted episode can overrun (D001 and D006). The current hosts report no tokens, so the token budget never refuses today. The fixture refuses only when no candidate is left to dispatch, and wall-time and token refusals have no case; that is F4.

## Criterion 4 — write-backs

Product 06 marks the portfolio candidate as allocated and adds the always-on model default as a candidate, not implemented behaviour. Product 03 gives the progressive-authority status, 07 has §Declaring a portfolio under §Operator resume phrases, and 05 and the skeleton README describe the portfolio. The order was filed before 2026-09-09, so its ledger duty is discharged by its decisions file and the generated index rows. After integration, `npm run publication:check` passes with 275 of 275 headings and both editions CURRENT. **Holds, carried forward, with F2's two stale version labels.**

## Criterion 5 — gate, whitespace, dependencies, pins and edition

**Fails.** The reviewer gate `npm test -- --review` at the integrated tree recorded **37 passed, 1 failed, 469.05 s, 82 fresh tasks, exit 1** at 2026-09-22T20:20:01.385Z, with the sandbox not in force. The failing test is `scripts/test-runner.test.mjs:1369`, "WO-140 the real inventory declares only the suite with an environmental outside-only cause". It expected `[["skeleton","outside-sandbox"]]` and got `["portfolio","outside-sandbox"]` as well. `--review` selects `runner-fixtures` because WO-100 edits `scripts/test-runner.mjs`, one of that suite's declared sources. `main` has no `portfolio` suite, so the failure is WO-100's. The declaration is probably right in substance. The portfolio suite launches `/usr/bin/sandbox-exec` through WO-119 discovery (`discovery.ts:300-308`) and WO-054's witness (`verification-worktree.ts:166-191`). My probe in this session shows an outer Seatbelt sandbox refuses a nested one: `sandbox-exec: sandbox_apply: Operation not permitted`, exit 71. But WO-140-D001 and product 07 §Gate sandbox preflight make a declaration a recorded, evidenced choice ("skeleton carries the declaration"). None of the test, the product sentence or a decision was updated. The rest of the criterion holds on the integrated tree:

- **Whitespace:** `git diff --check` and `git diff --cached --check` are clean on the integrated tree.
- **Dependencies:** no new dependency. `package-lock.json` retimes only skeleton `0.37.0` and the console's pin.
- **Bundle pins:** the harness bundle was regenerated by the integration helper, and `node scripts/harness.mjs check` passes.
- **Evidence editions:** `docs/evidence/current.json` still selects WO-100's feedback-001, authority-002 and artifact-identity editions, and the four evidence suites passed in the gate.
- **Suppressions:** no added line against `28f9f870` introduces an `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `prettier-ignore` or `biome-ignore` directive.

Run alone, `node --test --test-name-pattern="WO-140 the real inventory" scripts/test-runner.test.mjs` reproduces the failure with the same diff.

## Minor findings routed to the repair (D015)

**F2. Stale version label.** `docs/instance/entropy-reducer/README.md:4-5` and `docs/product/03-architecture.md:1228-1229` say the reviewer ran Fable 5.1 `max` "through `v0.42.0`". But `v0.43.0` (WO-064) also shipped the Fable 5.1 pin, and WO-100 now targets `v0.44.0`. Product 05 and the refutation plan already say "before WO-100".

**F3. Citation.** D011, D012 and VER-002 cite "docs/AI-HARNESS-SECURITY.md §Planning refutation". No such section exists. The compared defaults are in the "Entropy Reducer launch line (WO-151, 2026-09-22)" paragraph (lines 355-366), which states the same values, so the substance holds. VER-002 is immutable, so the repair should record a correction.

**F4. Evidence that could stay green on a regression.**
- The reset is asserted only after a failure in the last phase.
- The budget refusal is asserted only when nothing is left to dispatch.
- The wall-time and token refusals have no case.
- `decodePortfolioBinding` admits a 64-hex base commit (`portfolio.ts:279`), which WO-054's worktree preparation refuses as not 40 hex. An order bound that way would spend its only attempt and never verify.

## Boarded up, not repaired

**D016.** WO-052 checks each changed path only by surface prefix (`source-change-worktree.ts:261-276`): no count, no deletion check. A Shine or Standardize writer could replace a file surface with a directory of files, and WO-054 would judge only the named commands. Sort is not affected, because the host requires exactly one move. This is inherited WO-052 behaviour. The follow-up is due before WO-111 runs a portfolio unattended on an operator repository, and it includes rewording `portfolio.ts:43`, "Host-counted files the order may touch".

**D017.** `worktree integrate` saved a pending receipt, then failed at `git stash push`, because the executor had marked the seven new files intent-to-add (`git add -N`). With nothing stashed or merged, a fresh run refused as pending, and `--continue` could not advance from stage `preserved`. The auto-mode classifier refused my first recovery command. With the operator's authorization I did the following, and the helper then completed under checkpoint 15 with no authored conflict:
1. Copied the receipt into session scratch.
2. Fully staged the seven files.
3. Removed the stale receipt.
4. Re-ran the helper.

Checkpoint 14 remains as a ref.

## Model-migration scope (D007, D008, D012)

The audit found the migration complete and bounded:
- **No old model left in active code.** No Fable 5.1 or Astra selection remains in `packages/*/src` or either skill tree. The remaining mentions name the previous selection beside the new one, or are historical receipts, the v0.5.0 roadmap entry, migration comparisons in `scripts/authority-evidence.mjs`, or test fixtures.
- **History untouched.** Under `docs/evidence/`, only WO-100's own files and the `current.json` edition pointer changed. The Fable 5 selections are intact.
- **Commands and documents agree.** The entropy and `refute-plan` defaults and the probe scripts match the documents, apart from F2's label.
- **Pin migration is coherent.** Seisō version 2 has a new semantic hash (`79151d7b…`), which appears in the authority-002 and artifact-identity editions. The authority tool asserts that exactly one fact changes, and the tests assert the new pin while keeping the historical reviewed hash.
- **Generated hooks only.** The hook diffs are regenerated snapshot-path and runtime-file hashes. The contributor hash `fnv1a64:950a384c819aa265` is unchanged.
- **Edges of scope.** `docs/PLAYBOOK.md`'s interactive Codex default and two example commands in `packages/skeleton/README.md` moved beyond D007's enumerated list. The operator's message supports both, and they are recorded here as observations.
- **No test pins the default selection.** Nothing asserts `refute-plan`'s default selection, and the reviewer pin is written in both `scripts/lib/entropy-review.mjs` and `entropy-reducer.ts` with nothing tying them. D012 already records the missing check as a limit.

## Integration

Main added WO-064's target publication:
- `scripts/lib/target-publish.mjs`, `scripts/github-body.mjs` and a `worktree.mjs` branch;
- a `target-publish` suite;
- a one-line comment in `entropy-review.mjs`;
- product 02 and 07 sections.

It touched nothing under `packages/`, no configuration or evidence-source input and no WO-100 write-back section. The shared files `scripts/test-runner.mjs` and `scripts/lib/entropy-review.mjs` merged beside WO-100's hunks without overlap, and the helper regenerated six projections with no authored conflict. The release carries forward:
- **Version:** `v0.44.0` remains current over the published `v0.43.0` tag (`git ls-remote` peels it to `28f9f870`).
- **Components:** no component version collides, because WO-064 bumped none.
- **Checks after integration:** `node scripts/harness.mjs check`, `npm run publication:check` and `npm run release -- check-surfaces --local` (44 PASS) all exit 0.

In the gate, `portfolio`, `skeleton`, `target-publish`, `configuration-root` and `worktree-integration` passed. The runner-fixtures failure is not an integration effect.

## Clean-room screen and the ideation-receipt clause

A scan of the added lines and the untracked WO-100 evidence found no local absolute path, internal URL, credential or employer identifier. The only address and URL hits are:
- `example.invalid` fixtures;
- public npm registry URLs in the lockfile;
- a quoted attribution-refusal test string inside the self-host verification transcript.

This order has no ideation breakout receipt. Its scope expansion is the operator's direction during `resume: next`, recorded in the order paragraph and [D007](../../evidence/WO-100/decisions.md#wo-100-d007) and bound by `plan amend-order`. So the dispatch's "ideation receipt" clause resolves to that record and to the [implementation receipt](../../evidence/WO-100/implementation.md). No intake material was read for this review.

## Handoff

The next legal action is `resume: fix` against this report. The repair owns D014's evidenced decision on the declaration and D015's three minor items, then a fresh independent verification runs `npm test -- --review`. D016 and D017 remain planning follow-ups. The integration is complete in the working tree, and its checkpoint and stash are retained. No PR body or release notes were prepared, because the review failed.

## Reproduction

From `/Users/dylanwood/Projects/DotLn-wo100` on branch `wo-100`:

```text
npm test -- --review
node --test --test-name-pattern="WO-140 the real inventory" scripts/test-runner.test.mjs
sandbox-exec -p '(version 1)(allow default)' sh -c 'sandbox-exec -p "(version 1)(allow default)" /usr/bin/true; echo $?'
git diff refs/dotln/checkpoint/WO-100/1 -- docs/work-orders/WO-100-preauthorized-portfolio.md
npm run plan -- check
npm run publication:check
node scripts/harness.mjs check
npm run release -- check-surfaces --local
```
