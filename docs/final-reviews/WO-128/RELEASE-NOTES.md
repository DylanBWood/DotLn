## Release overview

Fresh full gates on the operator's host now pass first time: five consecutive `npm run test:full -- --fresh` runs passed with all 78 tasks executed and none reused, after twelve fresh gates on the two preceding days had failed on load-sensitive deadlines and each had needed a rerun. Every wall-clock deadline a gate child can reach is inventoried, and a hit records the bound, the measured duration, the tasks running beside it and the host load, so a failed gate says whether it found a defect or a host load outside the declared class. This release is for anyone who runs or reads the repository's gate.

## Read before upgrading

The console collector's per-command bound is no longer a 60 s constant. Under a declared gate load it is the larger of 60 s and the measured 17.2 s `release:list` baseline times the load factor, 137.6 s at four scheduler slots; standalone it stays 60 s. The read-only command set and `GIT_OPTIONAL_LOCKS=0` are unchanged.

Gate children receive `DOTLN_GATE_LOAD_CLASS`, `DOTLN_GATE_CONCURRENCY`, `DOTLN_GATE_LOAD_FACTOR`, `DOTLN_GATE_TASK`, `DOTLN_GATE_PEER_FILE` and `DOTLN_GATE_DEADLINE_LOG` from the runner, and a child that reads an inconsistent declaration refuses to derive a bound. The declared load policy is part of each suite's reuse key, so suite successes recorded before this release execute once more; the aggregate still requires the exact tree.

`harness-fixtures` and `process-debt` no longer run exclusively. A fresh full gate on the operator's host takes about 690 s under the shared cap against 476 s under the previous exclusive scheduling, and the verifier's same-source comparison isolates that difference at about 204 s per fresh gate; restoring the two exclusive rows is an operator decision recorded as open in WO-128-D010.

Gate rows gain additive fields: `loadClass`, `taskTimeline`, `deadlineDiagnostics` and `criticalPath`; existing readers are unaffected. Each gate run keeps one diagnostic directory under the ignored `docs/control/local/harness/deadlines/` with no retention policy. Every row carries four intentional negative-test hits, labeled cause-unestablished.

Application target `v0.17.3` (patch) above `v0.17.2`; skeleton `0.15.3` with regenerated runtime pins and snapshot; console `0.1.5`; compiler `0.9.1` and the kernel unchanged; no new dependency.

## Substantive changes

**Declared scheduler load and derived deadlines.** The runner schedules each task under a shared cap of at most four slots or an isolated cap of one and passes twice the slot count as the load factor. `packages/skeleton/src/gate-deadlines.mjs` supplies `deadlineLimit`, which derives a bound from a measured baseline through that factor while preserving the standalone floor, and `startDeadline`, which records a hit with its site, bound, monotonic duration, current peers, host load and a classification of `outside-declared-load` or `deadline-hit-cause-unestablished`. Explicit `observedSpawnSync`, `observedExecFileSync` and `observedSpawn` wrappers cover every gate-reachable timed subprocess; manual barriers and watchdogs in the harness, beacon and mutation fixtures are instrumented directly. A suite that times out fails even when its child exits zero on `SIGTERM`.

**Per-task timeline and offline critical path.** Every gate row records each task's start, end, the tasks running at its start, its scheduler predecessors, class, factor and peer cap; `scripts/lib/gate-timeline.mjs` computes the longest observed scheduling chain from one stored row, and `scripts/measure-gates.mjs --check` recomputes it for every run of a measurement series. A task skipped for a failed dependency is never a timeline edge.

**Measurement series.** `node scripts/measure-gates.mjs --run docs/evidence/WO-NNN/series.json` runs exactly five consecutive fresh full gates, preserves each attempt, stops at the first failure and never retries; `--check` verifies five first-time passes, zero reuse, complete timelines, one source tree, the retained configuration and the stored critical paths.

**Fixture repairs.** The two planning cost fixtures declare their own empty budget acceptances instead of copying the live budget file. The release-suite signal test starts the real suite in its own process group, waits for an explicit readiness file written after the suite's cleanup traps are installed, and signals that group; the 15 s bound, the exit-status and residue assertions and a negative control remain.

## Progressive polish

Version bumps for skeleton and console; regenerated hooks, manifest and pinned runtime snapshot; the README release claim, the roadmap note, both publication source locks, the decisions index rows D001–D011, FUP-0054's disposition lineage and the work-order index; the beacon fixture and CLI test copy lists include the new helper.

## Evidence and compatibility

Independent [VER-001](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-128/VER-001.md) passed all six acceptance criteria with two non-blocking findings, one of which the review repaired and one of which it recorded for the operator. [FINAL-001](https://github.com/DylanBWood/DotLn/blob/main/docs/final-reviews/WO-128/FINAL-001.md) records the review, the [accepted series](https://github.com/DylanBWood/DotLn/blob/main/docs/evidence/WO-128/shared-series-002.json), the [diagnosis and inventory](https://github.com/DylanBWood/DotLn/blob/main/docs/evidence/WO-128/diagnosis.md) and the decisions. Known limits: outside-sandbox execution is attested by the series file's constant, not observed; the `outside-declared-load` threshold of 2.0 per CPU is declared, not measured, and the highest observed load was 0.755; five samples on one host show first-pass reliability there, not on arbitrary hosts; historical deadline sites whose logs were disposed remain unknown; shared scheduling costs about 204 s per fresh gate against exclusive scheduling. Supported Node line and package privacy are unchanged.
