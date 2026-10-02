## Release overview

DotLn now has its first measured performance baseline. A deterministic harness measured 36 scenarios at one pinned commit in two complete executions, each with its own seeded run order. The scenarios cover kernel replay, log decoding and encoding, cadence evaluation, hashing and command identities, the skeleton demo, the build and both test suites. Every warm-up and every measured repetition is kept, outliers included. The machine load around each one is recorded, so a reader can tell a quiet run from a busy one. Until now the declared-versus-observed cost loop had nothing observed to compare with, and every efficiency cell read `E0 — unknown`. This release gives that loop its first observed column. It makes no performance verdict and claims no efficiency level.

## Read before upgrading

- **No runtime change.** No package, contract, dependency or edition changes. Every component keeps its version, and nothing joins `npm test`.
- **One test registry entry.** With the operator's approval, `packages/kernel/test/fixtures/jsonl-protocols.json` declares the observations file a non-event protocol. Without it, the kernel's strict event-stream test misreads the file. Nothing else in that test changes ([D007](../../evidence/WO-107/decisions.md#wo-107-d007)).
- **Some of the lane's checks are keyed to this release's bytes.** `profile.mjs --compare --check` reads only the committed observations and keeps working after runtime changes. Three of the lane's checks do not survive ordinary later changes:
  - The classification self-test fails once another order declares its own JSONL in the same fixture.
  - Any edit to the four collector modules makes `--compare --check` fail with `known collector revision`, because only the first collector revision is archived.
  - The registry self-test runs the current kernel and skeleton.

  Archive the second collector revision before editing the collector. Read a failing self-test as base drift until `FUP-8f0561e50754114f` settles the lane's after-base rule ([D010](../../evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes)).

## Substantive changes

**Profiling harness.** `corpus/harness/profile.mjs` keeps a scenario registry and runs declared warm-ups and repetitions. Each round shuffles the eligible scenarios from a recorded seed, using FNV-1a, a linear congruential generator and Fisher–Yates, and runs one at a time. Every invocation records wall and monotonic time, the harness process's CPU, its resident and heap memory, and throughput per declared unit. Before and after every run and invocation, it samples load average, memory occupancy, macOS memory pressure and swap. A watchdog supervises each run: the owned process tree is sampled every 250 ms and stopped at 8 GiB aggregate RSS, under host memory pressure, after 512 MiB of new swap, above 100 processes or after two hours. Neither execution tripped it. Their sampled peaks were about 1.13 GB against the 8 GiB stop, with no swap growth.

**Baseline observations.** `corpus/baselines/observations-2bae7d40….jsonl` holds 72 records: one per scenario per execution. Together they hold 612 measured samples and 138 warm-ups. Each record carries the base commit, a source inventory, the collector's protocol hash, the environment and its run order. It also carries eight resource distributions (count, min, p25, p50, p90, max, mean and population standard deviation) beside their raw samples. The provisional, non-normative schema is `corpus/baselines/SCHEMA-WO-107.md`.

**Generated comparison.** `--compare` writes `corpus/baselines/WO-107-comparison.md`. It sets the two executions' distributions side by side and describes where their ranges overlap. It also gives the distribution of every pairwise difference between the executions, and the per-invocation boundary load. It reaches no verdict and sets no threshold. `--compare --check` reproduces the report byte for byte and leaves the observations untouched.

## Progressive polish

The lane also commits a 13-test schema and self-test suite, a byte-exact archive of the first collector revision, and the run transcript. The transcript records both executions, one failed second-execution attempt that preceded the registry entry, the comparison's generation and six validation receipts.

## Evidence and compatibility

Application `v0.64.1` is a patch release over `v0.64.0`, built from WO-107 on `main` at `2bae7d40`. No package manifest or component version changes. `main` had not moved since the order's base, so integration changed nothing.

The verification sequence:
- [VER-001](../../verifications/WO-107/VER-001.md) passed all seven criteria. It independently rebuilt each execution's run order from its seed and recomputed every recorded statistic from the raw samples. It also showed that `--compare --check` fails on a one-byte report change or an altered sample.
- [FINAL-001](FINAL-001.md) passed on the integrated tree.

`npm test -- --review` passed at code identity `d04f565cc0cc0dd634cdca6024eff5a18980c45e187d2fbd98369602d3de1897`: 30 suites, 0 failed, 420.10 s. `npm run test:docs` passes.

Known limitations:
- All measurements come from one host, with three measured repetitions per command.
- CPU and memory figures describe the harness process; child-process CPU and memory are unmeasured.
- Filesystem caches and other applications were uncontrolled. The first execution started with a one-minute load average of 7.0.
- The second execution ran with the registry entry and the first execution's records present, and the first ran without either. Their timed code is byte-identical.
- The lane's self-checks are keyed to this release's bytes (D010).
- The lifecycle's inline `git diff --check` does not read new files. Staged, this diff reports one blank line at the end of the generated report ([D011](../../evidence/WO-107/decisions.md#wo-107-d011--final-review-the-lifecycle-whitespace-check-never-reads-new-files)).

Details are in the [schema](../../../corpus/baselines/SCHEMA-WO-107.md), the [comparison](../../../corpus/baselines/WO-107-comparison.md), the [run transcript](../../../corpus/manifests/runs/WO-107-2bae7d407af2d5d07d16c5b15dc63134e277eabd.log) and the [decisions](../../evidence/WO-107/decisions.md).
