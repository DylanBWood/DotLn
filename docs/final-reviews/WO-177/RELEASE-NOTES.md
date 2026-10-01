## Release overview

An Entropy Reducer review or one of the three worker probes, launched without model flags, now runs the models the operator pinned on 2026-09-30: Codex `gpt-6.1-sol` at `max` and Claude Code `claude-opus-5-5` at `xhigh`. Until this release, the Codex review route and the probes defaulted to models the operator had retired for spawned work, so a launch could run something other than the operator's choice unless the operator remembered a flag. Receipts and probe records still state the model and effort the launch requested, and effective values stay `unknown`. This release is for operators who launch reviews or probes, and for anyone who reads their receipts.

## Read before upgrading

- **Higher default effort on the Codex route.** A Codex review or refutation launched with `--transport codex-cli-exec` and no `--effort` now runs at `max` instead of `xhigh`, on `gpt-6.1-sol` instead of `gpt-6-sol`. Expect higher model spend per launch. Pass `--model` and `--effort` to choose otherwise.
- **The Claude reviewer is unchanged.** The compiled `entropy-reducer@1` requirement and the Claude route's default stay `claude-opus-5-5` at `xhigh`. A Codex review is still recorded as a substitute reviewer.
- **Not every launch default is pinned yet.** `npm run plan -- refute --transport codex-cli-exec` without flags still launches `gpt-6-sol` at `xhigh`, and so do the hook probe in `scripts/harness-probe.mjs` and `scripts/target-worker-smoke.mjs`. Pass `--model gpt-6.1-sol --effort max` to plan refutation until planning routes these ([D006](../../evidence/WO-177/decisions.md#wo-177-d006)).
- **Spawned Claude agents.** Claude Code's Agent tool selects a model and no effort, so a spawned Claude agent runs at the root session's selected effort. A root session at `xhigh` satisfies the direction.
- **No migration.** No schema, gate, refusal, component version or dependency changes. Historical receipts and probe records keep the models they recorded.

## Substantive changes

**Entropy Reducer launches.** `npm run entropy -- review` and `refute` on the `codex-cli-exec` transport select `gpt-6.1-sol` and pass `model_reasoning_effort="max"` when the operator gives no `--model` or `--effort`. The filed receipt's attestation records those values from the invocation, with effective model and effort `unknown`. The `claude-cli-print` route keeps `claude-opus-5-5` at `xhigh`.

**Worker probes.** The writing-worker and authority probes launch Claude at `claude-opus-5-5`/`xhigh` and Codex at `gpt-6.1-sol`/`max`, and record those selectors in each run record. The subagent probe launches and records `claude-opus-5-5` at `xhigh`. The writing-worker probe's explicit `low` experiment cells are deliberate and unchanged.

**Codex `spawn_agent` parameters.** One bounded Codex CLI 0.159.3 session recorded that `spawn_agent` accepts `model` and `reasoning_effort` with `fork_turns: none`, and that a call omitting both is also accepted. Each spawned worker's own status read `gpt-6.1-sol` at `max`. The [record](../../evidence/WO-177/spawn-agent.md) lists the parameters tried and both readbacks.

## Progressive polish

The AI-HARNESS-SECURITY launch paragraph and the Entropy Reducer README name the new defaults in place, and the paragraph now records which order set each default and which value each replaced. The harness readback section carries the `spawn_agent` observation. Fixtures now witness each changed default in launch arguments and in the filed attestation or probe record, including a stub `claude` binary for the subagent probe.

## Evidence and compatibility

Application `v0.61.3` is a patch release over `v0.61.2`, built from WO-177 on `main` at `1d00bc58`. All component versions are unchanged, no dependency was added, and no evidence edition was re-minted.

The verification sequence:
- [VER-001](../../verifications/WO-177/VER-001.md) passed. It reproduced the new fixture failing against the old Codex default row, and read the two spawned workers' own session metadata.
- [FINAL-001](FINAL-001.md) passed, and repaired the launch paragraph's provenance ([D008](../../evidence/WO-177/decisions.md#wo-177-d008--final-review-pass-d007-repaired-in-place-d006-stays-with-planning)).

`npm test -- --review` passed at code identity `99b0a04c498b8a0ee949746c8d88f23c139159632263e235844db7cb8b2b4e7c`: 33 suites, 0 failed, 421.17 s. `npm run test:docs` passes.

Known limitations:
- Model and effort are launch selections. Effective values are unknown, and no model-quality or cost comparison was made.
- The `spawn_agent` calls used the parent's own values, so they show that the parameters are accepted, not that a different value overrides the parent.
- The plan-refutation route, the hook probe and the target-worker smoke still default to the retired models (D006).

Details are in the [decisions](../../evidence/WO-177/decisions.md) and the [handoff](../../evidence/WO-177/handoff.md).
