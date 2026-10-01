# WO-177 — FINAL-001

**Verdict:** pass. All five criteria are met against the original order. The evidence is VER-001's reproductions, my own reading of the full diff and my own run of the WO-177 fixtures. `main` has not moved from the executor's base, so no integration was needed. I repaired the provenance defect VER-001 boarded as [D007](../../evidence/WO-177/decisions.md#wo-177-d007): it sits in this order's own paragraph, and the fix is one sentence inside the order's byte allowance. I concur with [D006](../../evidence/WO-177/decisions.md#wo-177-d006) and leave it with planning. [D008](../../evidence/WO-177/decisions.md#wo-177-d008--final-review-pass-d007-repaired-in-place-d006-stays-with-planning) records both choices.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 83827 tokens; handoff 7750959 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness. The canonical phase selected WO-177 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage f8faa071-6f3e-4cb7-acf4-b1b37834da29`. The entry sample was observed at 2026-10-01T20:09:38.593Z. The handoff sample was observed at 2026-10-01T20:16:49.208Z (71 steps, 67 commands), before this report was filed. Both are cumulative transcript counters, and 7,564,315 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root session was the only writer.

## Subject and evidence

The subject is the uncommitted WO-177 work over base `1d00bc58af32ecfcc6080e21a62179709bf5efe7`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-177/VER-001.md) passed, and no repair followed. The report's SHA-256 equals the control log's `reportHash` (`42c08e46…`). The staged tree's `scripts`, `packages`, `package.json`, `package-lock.json`, `.claude` and `.agents` equal the verified checkpoint `refs/dotln/checkpoint/WO-177/3`, so VER-001 judged the source bytes I review here.

Ideation receipt. The order came from the 2026-09-30 standard planning pass ([ledger entry](../../lineage/idea-ledger.md), [planning document](../../planning/standard-pass-2026-09-30.md) §5). The operator's direction is captured in ignored intake, and its SHA-256 is in the ledger. I did not read the intake. The planning refutation judged WO-177 aligned with one known issue: literal pins in eight other orders' criteria. That issue is outside this order. The planning document says "the compiled defaults, the probes and the `spawn_agent` record are WO-177", but the order's Cost, Design and criteria list six defaults. That gap is where D006 comes from.

Integration. After `git fetch`, `HEAD..origin/main` and `HEAD..main` are both empty. Local and origin tags end at `v0.61.2`. `npm run release -- prepare` against origin's tags reported that the `v0.61.3` target remains current, and it refreshed the meter snapshot and the PR's meter block. The sibling worktree `wo-182` shares the base. If it publishes first, the integration that follows records the collision, and that is bookkeeping, not a finding (product 07 §Independent workflows and integration).

I reviewed:
- the order, and its cited sections: `TRANSPORT_DEFAULTS` and `buildAttestation`, the probes' selector code, `canonicalWorkerArgs`, AI-HARNESS-SECURITY §Harness version, model and effort readback and the Entropy Reducer launch line, the reducer README, product 07 §Model-specific notes and §Goal-aligned decisions, and product 08 §PRs and commits and §Release-note edition;
- the handoff, `spawn-agent.md`, `meta.json` and D001–D007;
- the full diff:
  - the six defaults in `entropy-review.mjs`, `writing-worker-probe.mjs`, `authority-probe.mjs` and `subagent-probe.mjs`;
  - the new CLI fixture in `test-entropy-review.mjs`;
  - the new assertions in `test-authority-probe.mjs` and `test-harness-probe.mjs`, including the stub-binary subagent test;
  - the rebind-hint change in `test-resident-bind.mjs`;
  - both document edits, the README version line, and the generated index, register and projection changes.

The diff matches the order's design. Defaults change in place, and the transport and attestation mechanisms are untouched. Explicit `--model` and `--effort` still override. Both CLI argument builders carry `max`: the writing-worker probe's selector parser accepts `model_reasoning_effort="max"`, and the authority probe passes it through `-c`. The writing-worker probe's `low` cells are explicit experiment selectors, not defaults. The subagent fixture deletes only directories it created under the system temp directory: the probe's working directory is its own `mkdtemp` root. It restores `PATH` and `DOTLN_LIVE_HARNESS` in a `finally` block.

Clean-room screen: the tracked diff and the new evidence files contain no user path, account identity, host, URL or secret shape. `spawn-agent.md` withholds thread identifiers and session paths. No lint or type suppression directive was added under `scripts`. No dependency changed.

## Criteria

**Criterion 1:** met. The WO-177 fixture runs `entropy review` and `refute` through the real CLI command family on both transports, replacing only `dispatch` with `FakeEntropyTransport`. It asserts `gpt-6.1-sol`/`max` for `codex-cli-exec` and `claude-opus-5-5`/`xhigh` for `claude-cli-print` in the begun dispatch, the launch arguments (`--model`, then `--effort` or `model_reasoning_effort="…"`) and each filed receipt's `actorAttestation`. The attestation also carries identity, source `command-line-readback-and-invocation` and effective values `unknown`. I ran it alone (`node --test-name-pattern=WO-177 scripts/test-entropy-review.mjs --fixtures-only`): 1 passed. VER-001 reproduced the failure against `b51a58a8` by restoring that commit's Codex row: actual `gpt-6-sol`, expected `gpt-6.1-sol`. The fixture did not exist at `b51a58a8`, so a historical-row replay is the only meaningful form of "fails against".

**Criterion 2:** met. The writing-worker `SELECTORS`, `authorityLaunch`'s actor and the subagent probe's launch and record select `claude-opus-5-5`/`xhigh` and `gpt-6.1-sol`/`max` (Claude only for the subagent probe). Their fixtures assert both the arguments and the recorded actor. `test-resident-bind.mjs` asserts that the rebind hint ends `--model gpt-6\.1-sol`. My run of the sandbox launch-selector test, the WO-044 stub-harness test, the WO-177 subagent test and the two WO-157 bind tests passed 5 of 5 in 22.6 s.

**Criterion 3:** met. [spawn-agent.md](../../evidence/WO-177/spawn-agent.md) records two accepted calls on Codex CLI 0.159.3: one with `model: gpt-6.1-sol`, `reasoning_effort: max` and `fork_turns: none`, and one omitting both selectors. Each worker read its own status as `gpt-6.1-sol`/`max` from `codex-session-readback`. VER-001 tied each readback to a separate spawned rollout's own `turn_context`. The AI-HARNESS-SECURITY paragraph carries the result, and the section's whole growth is 431 bytes, within 600. The limit VER-001 states holds: both calls used the parent's own values, so they establish acceptance, not override.

**Criterion 4:** met. The launch paragraph names Claude `claude-opus-5-5`/`xhigh` and Codex `gpt-6.1-sol`/`max`. The reducer README names both, with 85 bytes of growth (limit 200). `decisions.md` holds D001–D008, and `docs/lineage/decisions-index.md` lists them. The paragraph's provenance parenthetical credited WO-177 with the Claude default and dropped the Codex value it replaced (D007). I restored it in place: WO-100 set the Claude default and `gpt-6-sol`/`xhigh`, WO-177 set `gpt-6.1-sol`/`max`, and the pre-WO-100 values are kept. WO-100's own correction record confirms that it set both.

**Criterion 5:** met. `npm test -- --review`, run after my last edit with the order's files staged, found the passing complete row at code identity `99b0a04c498b8a0ee949746c8d88f23c139159632263e235844db7cb8b2b4e7c` (recorded 2026-10-01T19:47:32.350Z, 33 suites, 0 failed, 421.17 s) and started no suite. My edit changed documentation only, so the code identity is the one VER-001 and the executor recorded. `npm run test:docs` passed with this report, PR.md, RELEASE-NOTES.md and D008 in place (see Executed checks). `git diff --check` and `git diff --cached --check` are clean. `package.json`, `package-lock.json` and `packages` equal HEAD.

## Boarded seams

D006 stays with planning. VER-001 found launch defaults outside the six that still select the retired models. The live ones are `npm run plan -- refute --transport codex-cli-exec` without flags (`gpt-6-sol` at `xhigh`, `scripts/refute-plan.mjs:510-519`), the hook probe in `scripts/harness-probe.mjs:169-170` and `scripts/target-worker-smoke.mjs`. Several evidence regenerators name them on purpose. I add one fact: WO-100 changed the Codex default in `entropy-review.mjs` and `refute-plan.mjs` in the same correction, so the plan-refutation default is the twin this order left behind. Taking these files now would widen the order past its Cost, Design and criteria without an operator scope expansion, and some of them need a keep-or-change judgment one file at a time. Product 07's sentence assigning the remainder to WO-177 names a closed order once this merges, and D006's follow-up gives its rewrite to planning. The PR title and release notes claim the six defaults, not every one. They also tell the operator to pass `--model gpt-6.1-sol --effort max` to plan refutation in the meantime.

## Register

`npm run plan -- followups --touching` matched nine pending rows at register revision `34fdc816…`.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-62e418efd2d0b2b8 | AI-HARNESS-SECURITY, WO-177 | settled | D007's provenance repair is applied in this review (D008). |
| FUP-a583091bec0d08b7 | WO-177 | left untriaged | D006's follow-up is for the next planning pass. Its condition, an operator-requested refutation or probe launching without `--model`, has not occurred. |
| FUP-84e5edb1566a4db1 | `test-entropy-review.mjs` | left | Its seam is `packages/skeleton/src/entropy-review-protocol.ts`, which is unchanged. |
| FUP-33173b7f87004a9c, FUP-fd05316b6030ef73 | AI-HARNESS-SECURITY, READMEs | left | The edited text names model defaults. Neither the destination-adapter rule nor the standing writer and refusal sentences changed. |
| FUP-b7a66e7a4fa7ad20, FUP-50cda1c03ecd8ea8, FUP-71fc2efc208f597a, FUP-acfe4bfda716d8fb | evidence, generated projections | left | Textual matches on generated or evidence files. Their named seams are untouched, as D005 judged. |

`npm run meta` indexed D008, which carries no follow-up. One `npm run plan -- followups --apply` request against `34fdc816…` produced `4c1443bb…`.

## Executed checks

- `node --test-name-pattern=WO-177 scripts/test-entropy-review.mjs --fixtures-only`: 1 passed, 0 failed.
- `node --test --test-name-pattern='WO-177|sandbox launch selectors|WO-044 the probe drives|WO-157 a bind with' scripts/test-harness-probe.mjs scripts/test-authority-probe.mjs scripts/test-resident-bind.mjs`: 5 passed, 0 failed, 22.6 s.
- `npm test -- --review` after the last edit, with the order's files staged: it reused the passing complete row at code identity `99b0a04c…` and started no suite.
- `npm run test:docs`: 24 passed, 0 failed, 38.77 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md and D008 in place. The result transition runs it again inline.
- `npm run release -- prepare`: tag observation from origin; the `v0.61.3` target remains current.
- `npm run meta`, then `npm run plan -- followups --apply`: one row settled.
- Source identity: `git diff --cached --quiet refs/dotln/checkpoint/WO-177/3 -- scripts packages package.json package-lock.json .claude .agents` exits 0.
- `shasum -a 256` of VER-001 equals the control log's `reportHash`.
- Byte measurements against HEAD: AI-HARNESS-SECURITY 431 (limit 600), reducer README 85 (limit 200).
- `git diff --check` and `git diff --cached --check`: clean.

Not re-run: the full product suites, because the passing row covers the unchanged code identity (WO-173's reuse rule), and the two live `spawn_agent` calls, because VER-001 tied each readback to its own rollout and a rerun would only repeat the parent's values.

## Judgment and publication

D008 compares its choices with the mission, the eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- A Codex Entropy Reducer review and the three named probes now run the operator's pinned selection without a flag. Their launch arguments and records agree with the pins.
- The attestation still separates selected values from effective ones, which stay `unknown`.
- The order's title promises every default. The plan-refutation route, the hook probe and the target-worker smoke still miss the pins, and that remainder is routed rather than claimed.
- The cost includes higher per-launch spend at `max`, which the planning refutation named as an unaccounted commons cost. No spend comparison exists.

The tradeoff in this review: I spent no product gate, relying on the reuse rule for an unchanged code identity. I spent one short focused run to observe the criteria myself and one documentation edit to keep the provenance claim true before publication.

Reviewed PR title: `:wrench: Entropy reviews and three worker probes launch the operator's pinned models by default`. The [gitmoji catalog](https://gitmoji.dev/) describes `:wrench:` as adding or updating configuration files, and the change's main purpose is changing default selections. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-177` and opening its PR. The helper supplies the post-merge release-close handoff.
