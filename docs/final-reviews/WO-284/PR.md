# An instance sets its gate's time limits in one file, so a slower machine no longer fails on the kit's fixed figures

An instance's gate no longer stops on a time limit its owner cannot change. A work instance reported on 2026-11-16 that every gate selection failed: one structural check, the kit's own configuration tests, ran just past its fixed 30 seconds on a slower laptop, and every later task was skipped. This is [WO-284](../../work-orders/WO-284-an-instance-sets-every-time-limit-of-its-gate.md), planned as the minor `v1.3.0`.

**One table, one file.** Every time limit that can end or fail a gate run or a bounded probe is now a row of one build-free table, `packages/skeleton/src/time-limits.mjs`: 38 keys, each with the kit's figure, what it bounds and what passing it does. The runner, the generated checks, the license check, the evidence and probe wrappers and the host's monitor and guard read their figures there and keep none of their own; a core-only case reads 18 gate-path files and fails on a figure written back. An instance changes the figures in `docs/control/time-limits.json`: a key's `set` is its own figure, `null` turns that limit off, `scale` multiplies every figure and `enforce: false` turns them all off. `npm run limits` lists every key with the figure that applies and where it came from, and `npm run limits -- --write` writes the file with every key and keeps what its owner wrote. A value that cannot be used is one advisory and the kit's figure applies; no command stops for it.

**Room in the kit's own figures.** A step an instance's gate runs now has at least ten times its slowest passing time in core's gate record of the thirty days before the order, and no suite row has under five minutes. The structural rows go from between 10 and 120 seconds to 5 minutes, or 10 for the generated checks, and the default task limit from 15 minutes to 45. Core checks that room at each release: its export fixture runs an exported instance's three selections at a third of every figure and judges each task's own result, with one arm that shows the judgment failing.

**A miss names itself.** A step ended for time says its key, the figure that applied, the file and `npm run limits`. A structural row ended that way is reported as `TIME`, not `FAIL`, and the tasks after it say that nothing was judged.

**An instance's gate checks the instance.** Its configuration row now loads the instance's own configuration and names what the loader refuses; it took 83 ms in the fixture. The kit's tests of that loader, which took 12 s on core's host and over 30 s on the work laptop, stay core's structural row and run in an instance only by name, with `npm test -- --only configuration-root`.

**A tree that is already green is not run again.** Where a passing complete review row stands at the current code identity, the closeout selection that the briefing and `worktree integrate` print says the complete run is satisfied, names the row's time and lists `npm run test:docs` alone. At such an identity `npm test -- --review --again` prints the row, runs nothing and exits 0; `--reason "<why>"` runs it and the row keeps the reason. The reviewer's and the executor's role steps each gain one sentence: an edit to documents alone owes the document gate and no complete run. This review met all three and started no complete run.

**What the repair added.** The first verification failed criterion 1: after a pass, a change to the limits file left the earlier results reused and standing, so a raised figure was not the one on the record and a lowered one could hide a task that would be ended for time. A gate row now records the limits it ran under, as one digest of the figures that apply, and a pass is reused, and a complete row stands, only under the limits in force ([decision](../../evidence/WO-284/decisions.md#wo-284-d032--a-pass-recorded-under-other-time-limits-is-neither-carried-nor-standing)). An edit that changes no figure, such as a note or a refreshed `kit`, changes nothing.

**Also in this change.** The seeded first order keeps a private terms list that is present and creates one only where none is. The read census says that a file read through the shell is not counted. A fresh export seeds the limits file, and a starter refresh adds it where it is absent and keeps one its owner changed. The branch also carries the starter's `v1.2.0` refresh receipt and the sibling index regenerated from it, bookkeeping from the close of the order before this one.

**Validation.** [VER-001](../../verifications/WO-284/VER-001.md) failed on the finding above; [VER-002](../../verifications/WO-284/VER-002.md) and [FINAL-001](FINAL-001.md) judge all ten criteria met. The complete review run passed at the reviewed code identity: 47 suites, 124 tasks, all fresh, 0 h 51 min. The plain selection passed on that row, and `npm run test:docs` passed on the candidate tree. VER-001's reproduction, run again in the final review, exits 0. Integration took in nothing: `origin/main` is the branch's base.

**Limits and what is left.** The other 139 time limits the kit ships, outside the gate path, keep their figures until WO-288 moves them into the table. A running host guard follows the limits file of the checkout that started it. A target order that edits the limits file owes the launchpad's complete run even where no figure changes. A change made and undone inside one run is not seen. One finding is listed in the final review, not blocking: in the order's own passing run core's slowest test file took 920.9 s, past the old 900-second limit, which leaves the new default at 2.93 times it where the figures decision asks for three; the figure is not changed here ([decision](../../evidence/WO-284/decisions.md#wo-284-d040--the-default-task-limits-reopening-condition-is-met-in-the-orders-own-passing-run-a-core-file-task-took-9209-s-the-figure-stays-and-the-finding-is-boarded)). The open notes of the verification and of the repair's review keep their follow-ups ([D030](../../evidence/WO-284/decisions.md#wo-284-d030--retain-the-earlier-nonblocking-limits-with-a-named-follow-up), [D034](../../evidence/WO-284/decisions.md#wo-284-d034--the-repairs-one-combined-review-five-notes-each-judged-and-recorded-and-two-texts-of-the-repair-corrected-to-say-only-what-the-code-does)).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-17T13:51:28.056Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-284/executor | 8 h 20 min | 447,329,929 | unknown | 1,708 | 1,920 | 0 | 0 |
| WO-284/verifier | 0 h 47 min | 28,546,332 | unknown | unknown | unknown | 0 | 0 |
| WO-284/reviewer | 0 h 12 min | 18,987,363 | unknown | 54 | 93 | 0 | 0 |

No dispatch is recorded for release-close, planner, refuter, router: no completed phase attempt, usage observation, journal row or bound event names those roles for WO-284.

Against WO-282, the previous closed order: wall clock 3 h 52 min more; tokens 346,378,970 more; USD unknown; commands 1,496 more; steps 1,665 more; bound stops unchanged; bound acceptances unchanged.

<!-- dotln-process-meter:end -->
