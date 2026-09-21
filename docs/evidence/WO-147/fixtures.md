# WO-147 fixture and stability evidence

Cutoff: 2026-09-21. Host: the executor's local macOS worktree, Node 26.9.0.
The commands below ran against the rebuilt final source unless a row explicitly
says it was a discarded diagnostic observation.

## Contention and retirement

`node --test --test-name-pattern="WO-147 a lock released|WO-147 retirement probe" packages/skeleton/dist/test/resident.test.js`

- direct `WorkerStore.acquire` and `ResidentStore.transaction`: pass; a real
  contender paused after `lstatSync(host.lock)`, the real holder released, the
  contender acquired, and the prior event bytes were unchanged;
- retirement probe: pass; 20 attempts paused the retiring peer before
  `rmSync`, placed a delayed hard-link successor claim inside the retired
  target after `host.lock` publication, and observed 20 completed original
  acquisitions plus 20 delayed refusals; no `ENOTEMPTY` or retirement failure;
- combined final targeted duration before the final stability series: 4.161 s.

The discriminating mutation replaced the guarded `try`/`catch` and second
`inspectLock()` call with one call. The contention fixture then failed in
193.86 ms on raw `ENOENT` from `lstat(host.lock)`. Restoring the re-inspection
made the direct and resident paths pass again.

## Fresh-dead-PID stability

The named case is `WO-143 once and loop restart at every acquisition filesystem
boundary, including killed reclaimers`. One pass reports 344 deterministic
SIGKILL boundaries: 38 fresh and 48 reclaim boundaries for each once/loop and
lifetime/append cell. Each constructed case now spawns a short-lived process
immediately before writing its PID and asserts `ESRCH` before and after the
boundary.

Runner-concurrent command:

`npm test -- --only skeleton`

The runner launches the skeleton suite with Node file concurrency 2. Ten
sequential final-code runs passed. Wall seconds by run: 260, 266, 264, 264,
263, 264, 262, 261, 313, 297; total 2,714 s.

Isolated command:

`node --test --test-name-pattern="WO-143 once and loop restart at every acquisition filesystem boundary" packages/skeleton/dist/test/resident.test.js`

Ten sequential final-code runs passed. Wall seconds by run: 157, 158, 157,
194, 210, 158, 157, 154, 160, 156; total 1,661 s.

Together the retained series executed 20 x 344 = 6,880 deterministic crash
boundaries without a live-PID observation, trace change, lost prefix, duplicate
lost event or uncleared recovery guard.

## Discarded diagnostic observations

Ten earlier isolated runs passed in 1,501 s, but a later source correction
restored the WO-048 path-decoder invariant; they are not counted as final-code
evidence. The first attempted runner-loaded run likewise is not counted: the
named case passed, but the skeleton suite finished 409/410 because the initial
implementation placed `readFileSync(host.lock)` outside `atPath`. D007 records
the repair and its targeted passing check.

## Lock-cycle cost

Two runs of 400 timed `WorkerStore.acquire()`/`release()` cycles after 20
warm-ups, each on a fresh system-temp store:

| Run | Median ms | p90 ms | p99 ms |
| --- | ---: | ---: | ---: |
| 1 | 17.942 | 21.659 | 23.174 |
| 2 | 17.296 | 21.868 | 23.167 |

WO-143 measured about 19 ms median on this host. WO-147 adds no steady-state
filesystem call when the lock does not vanish, and the remeasurement shows no
regression relative to that recorded baseline.
