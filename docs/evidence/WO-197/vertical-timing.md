# WO-197 — Vertical timing

On 2026-10-07, the following single bounded run passed all 196 tests:

```sh
node scripts/harness.mjs bounded -- node --test --test-reporter=spec scripts/test-vertical.mjs scripts/test-vertical-judgment.mjs
```

The wrapper reports **731.117 s**, from 19:25:31.403Z to
19:37:42.520Z. The Node reporter reports 731.046582 s; including wrapper
startup, the measured command wall time is 731.217804 s. The observed code
identity at launch was
`789090e168ca8a1893aed0eb9592aa9451a63b2b0de458d090c2b6b2a1522b52`.
The 16-CPU host's 1/5/15-minute load averages were 6.615/6.809/6.354
before and 7.842/7.622/7.016 after. This is the required diagnostic run,
not a final-subject gate claim. The full per-case records are in
[measurements.json](measurements.json), row `vertical-alone`.

| Case in `scripts/test-vertical-judgment.mjs` | Duration | Actual work and waiting |
| --- | ---: | --- |
| WO-112 VER-004 F1 continuation backoff caps repeated failures and never defers authority expiry | 31.662424 s | Two complete vertical fixtures exercise capped retries and authority expiry. The real resident and vertical hosts prepare and execute the workflow, replay receipts and dispatch synthetic worker processes. Every backoff boundary is crossed by `f.setTime(...)` before `host.tick()`; no wall-clock backoff is slept. |
| WO-112 D047 resident intake leaves only the episode's own launch or return undecided; every host fault ends held with its reason | 26.517958 s | Six independent fixtures cover interrupted/refused episodes, missing opt-in and unwritable/unbound/corrupt intake records. Each calls `residentIntake`, which performs 40 actual resident ticks, counts preparations and episodes, and checks the persisted hold reasons. Its clock advances by assignment, one simulated second per tick. Permission and record faults use actual files. |
| WO-112 D047 retention and cleanup never replace the episode's outcome, through the resident and the command | 26.432517 s | Three fixtures exercise refused/interrupted retention and cleanup failure through the resident, followed by another fixture executing the command twice to prove restart reuse. Read-only directories and retained wire files make the filesystem failures real. The resident helper uses the same simulated clock; command deadlines use the fixture's immediate clock advance. |

Source read: the three test bodies, `residentIntake` in
`scripts/test-vertical-judgment.mjs`, and the writer, `waitUntil` and
`setTime` implementations in `scripts/fixtures/vertical/fixture.mjs`.
The writer uses the real process transport with the synthetic writer
program; `waitUntil(deadline)` assigns `at = Math.max(at, deadline)` and
`setTime(value)` assigns `at = value`. Thus the measured elapsed time is
spent on composed fixture, host, Git, process and filesystem work. These
cases already avoid sleeping through their modeled backoff intervals.

No vertical case is repaired: none of the three slowest cases waits on a
wall-clock timer, so the order's exception for a timer repair does not
apply. The vertical suite's design remains outside this order.

The original measurement collector combined stdout and stderr chunks;
the wrapper result consequently appeared inside one reporter line. The
raw log is retained in session scratch. The collector was corrected to
parse that existing result and preserve all 196 per-case end records;
later probes capture the streams separately. No duration was inferred
from a missing result or substituted from another run.
