# WO-222 VER-001 probes and observations

These are the verifier's own reproductions for
[VER-001](../../../verifications/WO-222/VER-001.md). Each probe ran from the
repository root under `node scripts/harness.mjs bounded --`, one at a time,
at code identity
`0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543`:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-222/verification-001/probes.mjs <probe>
```

The probes use private temporary host registries; the real registry was only
read. Probes that vary the processor count run in a child process that stubs
`os.availableParallelism` before any subject module loads. No argument
passes the capacity or parallelism explicitly, which is what the executor's
fixtures held constant.

| Probe | Ran (UTC) | Exit | Observation |
| --- | --- | ---: | --- |
| `capacity-table` | 20:30:45 | 0 | Stubbed 1, 2, 3, 4, 8, 15, 16, 17, 32 and 64 processors give default capacities 1, 1, 1, 2, 4, 7, 8, 8, 8 and 8. `DEFAULT_MEMORY.hostLanes` and the scheduler's `slotCapacity` agree. One lane above the derived capacity refuses with `Declared gate concurrency <n+1> exceeds host capacity <n>`. |
| `registry` | 20:30:51 | 0 | The first acquirer, deriving 2, records `{"capacity":2}`. Later acquirers deriving 8 and 1 inherit 2. A request for 3 slots refuses with `Host lane request 3 exceeds recorded capacity 2`. Two first acquirers started together, deriving 2 and 8, leave one record, and both hold under it. Forged records (`0`, `9`, `"8"`, `{}`) refuse with `Invalid recorded host lane capacity`. Malformed and empty records refuse with the bare JSON parser message (D018). |
| `scheduler-table` | 20:31:04 | 0 | The real suite table (102 tasks), the real light classification and the after series' durations (scaled 1:4000 and randomized, two seeds) ran at 16, 8, 4 and 2 processors. Every task ran exactly once, with no violation. Reserved slots never exceeded capacity (peak 8, 4, 2, 1). An exclusive row never had a heavy peer or two exclusive peers. Its peers stayed within `min(2, capacity - 1)`. Target-worktree and launchpad files ran at most two at once, and the hook-heavy group one. At capacity three or more, the exclusive rows declared `shared`, concurrency 3, factor 6. |
| `timelines` | 20:31:08 | 0 | In each after run, harness-fixtures overlapped 74 tasks, all in `lightSuiteNames()`, with at most two at once. Process-debt and worktree-integration had no overlapping task. Each exclusive row reserved 6 slots and declared `shared/3`. Total reserved slots peaked at 8. Target-worktree files peaked at two, each with a 900,000 ms deadline. |
| `cases` | 20:31:08 | 0 | `git show HEAD:scripts/test-target-worktree.mjs` registers 60 names from 39 declarations. The four split files register 18, 8, 31 and 3 names: 60 unique, equal as a set, none skipped. A whole-source line comparison leaves 6 base lines absent from the split files and the shared fixture, all import lines. |
| `series` | 20:31:08 | 0 | Before medians 2,538,373 ms, after 1,668,518 ms: 34.27% lower, and 25.46% below the fastest before row (2,238,277 ms). The after rows are forced-fresh `npm test` review rows: 102 fresh tasks, none reused, exit 0, one code identity, identical host fields. No task timed out, and the largest duration-to-deadline ratio is 0.618. The six deadline hits per run are the deliberate inner timeouts the README lists. The inventories differ in one machinery suite each way: `harness-probe` only before, `evidence-sources` only after. |
| `baseline` | 20:31:08 | 0 | `scripts/lib/gate-scheduling-baseline.json` equals its projection of `before.json`: each row's largest task peak (1,509,638,144 bytes the largest) and each task's latest sample. Its 79 light tasks equal a recomputation from `before.json`. No exclusive row is light. |
| `host-budget` | 20:31:08 | 0 | On this host, `checkHost()` admits: a per-lane budget of 3,221,225,472 bytes covers 1,509,638,144 bytes (8 host lanes). With synthetic memory, it refuses at 16 processors and 16 GiB (1,073,741,824 below 1,509,638,144) and at 8 processors and 8 GiB. It admits at 16 and 24 GiB, 8 and 16 GiB, 4 and 8 GiB, and 32 and 64 GiB, naming both numbers each time. |

Other checks, each under the bounded wrapper:

- `npm test -- --only target-worktree` passed at 20:30:21.862Z in 356,756 ms. It ran 11 fresh tasks: the 6 structural tasks, the build and the 4 target-worktree file tasks. The file tasks ran at most two at once, each with a 900,000 ms deadline: start 76,014 ms, publish 235,943, close 266,418 and release 63,009.
- These also passed: `node scripts/measure-gates.mjs --check docs/evidence/WO-222/after.json` (3 runs, all passed first time), `node scripts/feedback-evidence.mjs --check`, `node scripts/authority-evidence.mjs --check`, `node scripts/harness-evidence.mjs --check`, `node scripts/harness.mjs check` (34 surfaces), `npm run meta -- --check` (the standing WO-150-D003 candidate only), `npm run publication:check`, `npm run format:check` and `git diff --check`.

The `after.json` timelines also give the observation D019 boards. The seeds
launchpad file is classified light by its latest baseline sample, and it
peaked above 512 MiB beside harness-fixtures in each after run. A timeline
read finds the 79 light tasks; of these, console and the seeds file have an
earlier before sample over a bound. Generated and the seeds file exceed one
in an after run, and only the seeds file does so beside an exclusive row.
