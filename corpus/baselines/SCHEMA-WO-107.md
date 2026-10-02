# WO-107 observation schema

**Provisional and non-normative.** This corpus-local schema describes one
measurement campaign. It is not a product contract, efficiency-level claim,
optimization recommendation, significance test, or performance target.

The measured source is commit
`2bae7d407af2d5d07d16c5b15dc63134e277eabd`. Measurement refuses a different
HEAD, modified tracked source (apart from the exact exception below), or new untracked source under `packages/`,
`scripts/`, `package.json`, `package-lock.json`, or `tsconfig.json`. A SHA-256
inventory binds their base bytes before and after each execution. The required
lifecycle documentation overlays that commit. WO-107-D007 authorizes exactly
one `nonEventPaths` entry in `packages/kernel/test/fixtures/jsonl-protocols.json`
for this observations file. The first execution preceded the file; the second
includes this classification-only overlay. Both actual fixture hashes are
disclosed in the second execution's `classificationOverlay`; its inventory
uses the fixture's base bytes after verifying the exact approved diff. All
other package implementation, test assertion and script bytes stay pinned.
Builds use the existing forced, staged build.
The machine's filesystem caches and other applications are uncontrolled.
The append preflight loads existing observations in the second execution.
Harness memory therefore includes retained fixtures, prior records and collector
state; it is not an isolated allocation measurement of the function under test.

## Commands and retention

Run from the repository root with its installed, pinned dependencies. No new
dependency, installation, model invocation, or root test-script entry is needed.

```sh
npm run build
node corpus/harness/profile.mjs --seed wo107-base-a-20261002 --out corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl
node corpus/harness/profile.mjs --seed wo107-base-b-20261002 --out corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl
node corpus/harness/profile.mjs --compare corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl --out corpus/baselines/WO-107-comparison.md
```

Those three recording commands are the executor's one-time campaign, captured
in `corpus/manifests/runs/WO-107-2bae7d407af2d5d07d16c5b15dc63134e277eabd.log`.
An existing seed is refused. Observations are appended as complete execution
groups, one scenario record per JSONL line, never overwritten or pruned.
Comparison generation creates a new report and refuses an existing destination.
Failed or interrupted invocations stay in the transcript and stop the campaign;
they are not silently retried, replaced, or represented as complete executions.

The repeatable checks read the observations without rerunning the campaign:

```sh
node corpus/harness/profile.mjs --compare corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl --check
node corpus/harness/wo107-bounded.mjs -- node --test --test-concurrency=1 corpus/harness/wo107-schema.test.mjs
node corpus/harness/wo107-bounded.mjs -- npm test -- --serial
node corpus/harness/wo107-bounded.mjs -- npm run test:docs -- --serial
git diff --check
```

`--compare --check` creates nothing, never appends observations, and requires
byte equality with the recorded report. Comparison does not load or execute the
current kernel or skeleton; it can inspect the pinned evidence after runtime
source changes. It binds each recorded protocol hash to the four harness modules,
using the initial byte-exact archive for the first execution and the current
modules for the second. The archive hash is pinned. Exact equality checks cover
both complete scenario/watchdog modules, the measurement/boundary functions,
command runner, metrics, distribution functions, scheduler and execution engine.
Only provenance, preflight, schema validation and report construction changed.
The classification and corpus-inventory difference is a disclosed comparability
limitation; these observations do not establish an identical-workspace experiment.
The schema tests also exercise current registry construction and the small
function/demo batches, so those tests require a build. A new measurement at
another base requires a separately reviewed protocol and fresh evidence path.

## Declared scenario set

The registry is pinned by the harness protocol hash. There are 36 scenarios:

| Family | Cases | Timed unit and boundary |
| --- | --- | --- |
| a | `replay/64`, `/1024`, `/8192` | Valid generated event logs and a synthetic counting reactor; decoding and fixture generation excluded. |
| b | `evaluateCadence/` for all 14 constructors | Grids of time, constructor parameters, RNG state and open/closed predicates. Six evaluable kinds measure evaluation; eight deferred kinds measure the expected rejection path. |
| c | Four `stableHash/` input classes and four `commandId/` identity classes | Empty, short ASCII, Unicode and long hash strings; workstream, episode, Unicode and long command identities. Inputs and batch counts are in the registry. |
| d | `decodeLog/64`, `/1024`, `/8192`; `encodeLog/64`, `/1024`, `/8192` | Complete JSONL decoding including validation, or encoding generated event objects. |
| e | `skeleton/live`, `skeleton/replay` | Full current canonical 13-step demo: 28 persisted events, shipped deterministic fake transports, five demos per batch. Live constructs the log; replay consumes the preconstructed log. |
| f | `command/build`, `command/kernel`, `command/skeleton` | Full `npm run build`; all 13 kernel or 50 skeleton test files passed explicitly to `node --test --test-reporter=tap --test-concurrency=2`, including document tests. |

Registry parameters carry input classes, fixtures/digests, log size in events
and UTF-8 bytes, constructor grids, exact command arguments and work per batch.
Preparation constructs fixtures and validates their equivalence outside the
timed intervals. Each timed batch includes its loop and correctness check;
reported throughput is for that declared batch, not a claimed overhead-free
single call. Command time includes process startup, test reporting and output
capture. Command output is streamed to private system-temp files; the public
transcript retains command arguments, exit status, output digests and aggregate
test counts. The summary buffer is bounded to 64 KiB.

## Scheduling and distributions

Seeds are `wo107-base-a-20261002` and `wo107-base-b-20261002`. They seed only
run order; fixture inputs stay identical. Each execution is a fresh process.
Function/demo scenarios have two warm-up and nine measured invocations each;
command scenarios have one warm-up and three measured invocations each.

FNV-1a folds UTF-8 seed bytes to uint32; an LCG with multiplier 1664525 and
increment 1013904223 supplies Fisher-Yates choices. Warm-up rounds come first.
Within every warm-up or measured round, eligible scenarios are shuffled and
visited once, serially. Smaller repetition counts leave the later rounds.
Each sample's global index, phase and round reconstruct the complete schedule.
Warm-ups retain raw samples and outcomes but do not enter measured statistics.

Every metric below has `{count, min, p25, p50, p90, max, mean, stddev}`.
Quantiles linearly interpolate sorted positions `(N - 1) * p`. Standard
deviation uses the population divisor N. All declared measured repetitions
enter the calculation, including outliers; no trimming, filtering or weighting.

The report places both executions' distributions side by side and describes
overlap of their min–max and p25–p90 ranges. It also presents the distribution
of **all pairwise execution-2 minus execution-1 differences**. These derived
values are correlated and are not independent samples, a confidence interval
or a significance test. Small N, one host, process/JIT state and ambient load
limit interpretation. No uncertainty bound or population inference is claimed.

## JSONL record

| Field | Required meaning |
| --- | --- |
| `schemaVersion` | Literal `WO-107-provisional-1`. |
| `baseCommit` | Full pinned commit above. |
| `sourceIdentity`, `protocolHash` | SHA-256 source inventory and concatenated named bytes of `profile.mjs`, `wo107-records.mjs`, `wo107-scenarios.mjs`, `wo107-bounded.mjs`. |
| `environment` | OS platform/release/architecture; CPU model names, count and available parallelism; actual Node, npm and TypeScript version output; lockfile digest; safety policy. No hostname, account name, environment dump or machine serial. |
| `execution` | ID = SHA-256 of `baseCommit:seed:startedAt`; nonempty seed; ISO start/finish times; run before/after boundary samples. The second execution also declares `classificationOverlay` with decision, fixture path, added path, declaration and base/current fixture SHA-256. The original execution has no overlay. |
| `registry` | Complete ordered metadata for all scenarios. Every record in an execution carries the same registry. |
| `scenarioId` | Exactly one member of that registry, once per execution. |
| `warmupCount`, `repetitionCount` | Positive declared warm-up count and at least two measured repetitions, equal to registry values. |
| `metricDefinitions` | Exact eight-entry resource vector below, including scope and units. |
| `unmeasured` | Explicit missing resource set: child CPU and memory, energy, operator attention, model tokens and monetary cost. |
| `samples` | Every warm-up and measured invocation in schedule order; index/phase/round/scenario, before/after boundaries, complete raw resource vector, outcome. |
| `distributions` | One recalculable distribution for each metric over every measured sample; each count equals `repetitionCount`. |

Each outcome is `completed` with a result checksum, or `failed` with an error
kind and bounded public detail. Completed command outcomes also carry exact
arguments, exit code/signal, stdout/stderr hashes and aggregate test counts.
The runner stops on a failed sample after writing its transcript event. Schema
validation can describe retained failures; the committed successful-baseline
test separately requires completed samples and zero command exit codes.

| Resource metric | Units and scope |
| --- | --- |
| `wallMs` | `performance.now()` elapsed milliseconds around the complete invocation. |
| `monotonicMs` | `process.hrtime.bigint()` elapsed milliseconds over the same invocation. |
| `supervisorUserCpuMs`, `supervisorSystemCpuMs` | `process.cpuUsage()` deltas for the harness process; child CPU is excluded. |
| `supervisorRssAfterBytes`, `supervisorHeapUsedAfterBytes` | Harness memory at the after boundary; not a peak or child-tree total. |
| `supervisorHeapDeltaBytes` | Signed after-minus-before harness heap usage; collection can make it negative. |
| `unitsPerSecond` | Per-repetition `scenario.units * 1000 / wallMs`; statistics are computed on those rates. |

Raw sample values are observations, accompanied in the same record by their
metric's complete distribution. Registry counts, input sizes, configuration
limits, timestamps and environment descriptors are metadata, not measured
resource distributions. Machine-load fields are the explicitly declared
boundary-sample exception.

## Boundary load and host protection

Every run and invocation has before/after `boundary-sample` records with ISO
time, `os.loadavg()` at 1/5/15 minutes, system free/total memory bytes and
`1 - free / total` occupancy, all `process.memoryUsage()` fields, and native
macOS memory-pressure level and swap use. Occupancy is a proxy, not an OS
pressure measurement; native pressure is recorded separately. Boundaries are
not continuous peaks or distributions and cannot establish absence of load
between them. They are sampled outside the timed invocation.

The operator's memory-safety direction adds an external watchdog using the
host's `ps` and `sysctl`, invoked through Node builtins. Profiling automatically
enters it. Root gates and schema tests use the wrapper explicitly. Normal Node
heap/GC settings remain unchanged; the observed default heap limit on this
host was approximately 4.09 GiB. Every 250 ms the watchdog samples its owned
process group plus observed descendants. It stops its own workload at 8 GiB
aggregate sampled RSS, 512 MiB additional host swap, non-normal host memory
pressure, more than 100 processes, unavailable monitoring, or two hours.

These are emergency interruption conditions, not performance verdicts. A stop
never establishes a pass and is not automatically retried with a higher limit.
The transcript records sampled peak RSS, sample count, process count, swap
growth and whether a cutoff fired. Sampling can miss transient peaks or detached
children that appear and reparent between samples; this is not a hard OS memory
quota. Other sessions can affect the host pressure/swap readings. Birth-tagged
owned PIDs prevent name-based killing of unrelated processes. The watchdog
adds observation overhead, held constant across both executions and disclosed
as part of their conditions.

## Validation boundary

`wo107-schema.test.mjs` checks all committed records, required shapes, complete
scenario sets, two distinct seeds, temporal order, exact scheduled counts,
finite resources, recalculated distributions and byte-identical comparison.
It rejects missing records, samples or boundaries, duplicate records,
nonfinite metrics and changed statistics. Deterministic dummy scenarios prove
the engine records what it ran, and tiny synthetic processes exercise resource
interruption and preservation of an unrelated bystander.

This schema covers the declared scenarios and resource vector only. Additional
process-tree CPU/memory distributions, energy, statistically justified sample
sizes, other platforms, performance thresholds and capability promotion need
later reviewed work. This campaign does not implement or suggest an optimization.
