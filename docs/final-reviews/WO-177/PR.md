# WO-177

The operator directed on 2026-09-30 that spawned work runs Codex `gpt-6.1-sol` at `max` and Claude Code `claude-opus-5-5` at `xhigh`. A Codex Entropy Reducer review launched without flags still ran `gpt-6-sol` at `xhigh`, and three worker probes still named `claude-fable-5` or `gpt-6-sol`. This pull request lands WO-177. Those launches now select the pinned models by default, and their receipts and probe records keep stating the model and effort the launch requested. Effective values stay `unknown`, because no harness reports them.

- **Entropy Reducer transport.** `npm run entropy -- review` and `refute` with `--transport codex-cli-exec` and no `--model` or `--effort` now launch `gpt-6.1-sol` with `model_reasoning_effort="max"` and record both in the receipt's attestation. The Claude route (`claude-opus-5-5` at `xhigh`) and the compiled `entropy-reducer@1` requirement are unchanged, and a Codex review is still a substitute reviewer. Explicit `--model` and `--effort` still override.
- **Probes.** The writing-worker and authority probes select `claude-opus-5-5` at `xhigh` for Claude and `gpt-6.1-sol` at `max` for Codex. The subagent probe launches and records `claude-opus-5-5` at `xhigh`. The writing-worker probe's deliberate `low` experiment cells keep their selector.
- **Codex `spawn_agent`.** One bounded Codex CLI 0.159.3 session observed `spawn_agent` accept `model` and `reasoning_effort` with `fork_turns: none`, and accept a call that omitted both. Each worker's own status read `gpt-6.1-sol` at `max`. Both calls matched the parent's values, so they show that the parameters are accepted, not that a different value overrides the parent ([record](../../evidence/WO-177/spawn-agent.md)).
- **Documents.** The AI-HARNESS-SECURITY launch paragraph and the Entropy Reducer README name the new defaults in place, and the harness readback section carries the `spawn_agent` result.

**Fixtures.** A new CLI fixture drives `review` and `refute` through both CLI transports with only the model dispatch replaced by the synthetic transport. It asserts the launch arguments and each filed receipt's attestation, and it fails when the old Codex row is restored (`gpt-6-sol` against `gpt-6.1-sol`). The authority and writing-worker fixtures assert the selectors for each harness, a stub `claude` binary witnesses the subagent probe's launch and record, and the resident-binding rebind hint names `gpt-6.1-sol`.

**Not covered here.** Some launch defaults outside this order's six still name the retired models. `npm run plan -- refute --transport codex-cli-exec` without flags launches `gpt-6-sol` at `xhigh`, and so do the hook probe in `scripts/harness-probe.mjs` and `scripts/target-worker-smoke.mjs`. A few evidence regenerators name the old models because they reproduce what was measured then. [D006](../../evidence/WO-177/decisions.md#wo-177-d006) gives these files to planning, along with product 07's sentence that still assigns them to WO-177. A spawned Claude agent's effort still follows the root session, because Claude Code's Agent tool takes no effort.

**Review correction.** The final review restored the launch paragraph's provenance: WO-100 set the Claude default and the replaced Codex `gpt-6-sol` at `xhigh`, and WO-177 set the new Codex default ([D007](../../evidence/WO-177/decisions.md#wo-177-d007), [D008](../../evidence/WO-177/decisions.md#wo-177-d008--final-review-pass-d007-repaired-in-place-d006-stays-with-planning)).

**Version.** Application `v0.61.3` is a patch release over `v0.61.2`. No component version, dependency, evidence edition or schema changed. `main` had not moved from the executor's base, so no integration was needed.

**Validation.** `npm test -- --review` passed at code identity `99b0a04c…`: 33 suites, 0 failed, 421.17 s. The final review's run reused that row, because only documentation changed after it. `npm run test:docs` passes. [VER-001](../../verifications/WO-177/VER-001.md) passed and reproduced the failure against the old Codex row. [FINAL-001](FINAL-001.md) passed.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T20:14:49.827Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-103 | 5,080,866 (Δ unavailable) / 3 | 1,414,182 (Δ unavailable) | 6 (Δ unavailable) / 89,134 (Δ unavailable) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 1 (Δ unavailable) |
| WO-102 | 6,903,085 (Δ 1,822,219) / 3 | 1,414,302 (Δ 120) | 3 (Δ -3) / 16,084 (Δ -73,050) | 37,366,239 (Δ -890,758) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 0) | 2 (Δ 1) |
| WO-181 | 6,364,541 (Δ -538,544) / 3 | 1,788,507 (Δ 374,205) | 4 (Δ 1) / 45,954 (Δ 29,870) | 40,317,429 (Δ 2,951,190) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -1) | 1 (Δ -1) |
| WO-105 | 9,351,472 (Δ 2,986,931) / 3 | 4,580,821 (Δ 2,792,314) | 3 (Δ -1) / 19,100 (Δ -26,854) | 44,067,562 (Δ 3,750,133) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 3 (Δ 2) |
| WO-178 | 12,691,894 (Δ 3,340,422) / 6 | 2,740,715 (Δ -1,840,106) | 4 (Δ 1) / 87,371 (Δ 68,271) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -3) |
| WO-177 | 2,337,734 (Δ -10,354,160) / 2 | 421,171 (Δ -2,319,544) | 4 (Δ 0) / 36,300 (Δ -51,071) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-177/executor | 1,783,821 (-5,678,081) | unavailable (unavailable) | unavailable (unavailable) | 6,565,580 (unavailable) | 47 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-177/verifier | 553,913 (-1,795,144) | 9,736 (-10,215) | 69 (-74) | 7,693,824 (-15,373,240) | 74 (-83) | unavailable (unavailable) / unavailable |
| WO-177/reviewer | 9,291 (-2,871,644) | 1,071 (-117,699) | 52 (-52) | 83,827 (-11,676,542) | 55 (-61) | unavailable (unavailable) / unavailable |
| WO-177/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-177/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-177/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
