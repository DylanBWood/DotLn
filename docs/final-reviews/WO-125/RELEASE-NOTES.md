## Release overview

Codex CLI `0.154.0` workers and plan refuters now accept the five declared effort levels, `low` through `max`, and forward each one to `codex exec` exactly as the operator's five discovery rows record, so a Codex refuter or worker can be launched at `max`. The same patch makes live gate runs refuse agent writes that would invalidate them, so a full gate no longer pays for a write made while it runs.

## Read before upgrading

`--effort` on `--transport codex-cli-exec` still defaults to `unknown`, which adds no override. On the observed CLI `0.154.0`, an explicit level forwards a `model_reasoning_effort` configuration override carrying that level; on the historical `0.153.4`, an explicit level refuses before launch and names the discovery record; a CLI version outside the observed profiles refuses at transport construction. The requested level is a launch claim only: no probe returned an effort field, so effective effort and model remain `unknown`. Re-probe with `node scripts/probe-codex-effort.mjs --out` and a new destination under `docs/discovery/` on an authenticated runner before admitting a new version or level.

While `npm test`, `npm run test:full`, `npm run harness -- evidence` or a direct runner or evidence call runs in a worktree, the generated pre-tool hooks refuse Write, Edit, NotebookEdit and write-classified shell commands whose destination is the candidate Git tree or an installed suite input, naming the active command and run. Ignored scratch under `docs/control/local/` stays writable through literal paths; shell commands the bounded adapter cannot classify, and subagent spawns, are refused for the gate's lifetime; ordinary metadata reads stay available. A marker left by an exited owner never blocks a write. `npm run harness` now runs through `scripts/harness-entry.mjs`, which reserves the worktree before its build.

Application target `v0.17.2` (patch) above `v0.17.1`; skeleton `0.15.2` with regenerated runtime pins and snapshot; compiler `0.9.1`, console `0.1.4` and the kernel unchanged; no new dependency.

## Substantive changes

**Observed Codex effort selection.** `docs/discovery/codex-effort-2026-09-11.json` records one operator-run, schema-bound launch per declared level on CLI `0.154.0`, each with its complete argument vector, exit 0, event types, bounded result and numeric usage, and none with an effort field. The Codex transport admits `0.153.4` and `0.154.0`, checks runtime membership in the five observed levels before launch, appends the override only for an observed pair, and keeps the pre-change `unknown` argument bytes, captured in `packages/skeleton/fixtures/codex-unknown-args.json`. An omitted builder version is `unknown` and cannot authorize an explicit level. The worker host records the request as a `host-launch` claim.

**Gate input protection.** Each gate invocation publishes a process-owned marker under `docs/control/local/harness/active-gates/` for its lifetime, including the package entry's build and preparation; nested runs own independent markers, normal completion releases them, and liveness checks with PID birth observations ignore an exited owner. All generated pre-tool boundaries share one guard that refuses writes to protected inputs before dispatch and names every active run.

**Physical destination classification.** The shared classifier treats the candidate Git tree, tracked ignored files, `node_modules`, `packages/*/dist` and prospective package roots as inputs, sharing that inventory with the suite fingerprint. It walks path components physically before applying `..`, follows dangling and chained symlink targets, honors Git's case-insensitive setting with native on-disk spelling, resolves literal shell destinations from the tool's working directory, treats wildcard-bearing words as opaque, and protects any existing non-directory destination with more than one hard link.

**Executable fixtures.** The worker tests drive each observed level through a process double and the durable launch claim; the plan-refutation suite runs the real CLI entry against a synthetic `codex`; the generated-hook fixtures hold real runner, evidence and package-entry gates with test-owned release, execute every admitted attempt, and prove refusal, unchanged inputs, scratch admission and killed-owner recovery.

## Progressive polish

Product 07 §Model-specific notes and its gate paragraph, the runtime map, the `environment.md` addendum, the refutations README, the README release claim, the roadmap note, both publication source locks and the decisions index rows D001–D005 carry the new semantics.

## Evidence and compatibility

Independent [VER-004](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-125/VER-004.md) passed all five acceptance criteria and the operator-authorized repair scope after three repairs; VER-001 through VER-003 each recorded the findings the next repair resolved. [FINAL-001](https://github.com/DylanBWood/DotLn/blob/main/docs/final-reviews/WO-125/FINAL-001.md) records the review, the current evidence editions and the non-blocking observations. Known limits: admission is by CLI version, not by model; the rows were observed once by the operator and show acceptance, not reasoning quality; there is no negative acceptance control; read-only shell is limited to the bounded adapter while a gate runs; the `console` suite's `release:list` source can time out under full-gate load in code this order does not touch, nominated for a separate order.
