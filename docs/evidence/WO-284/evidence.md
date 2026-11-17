# WO-284 evidence

Captures for the order's evidence gate, each a command's own output. The fixtures were made and removed by a script in session scratch, run under the bounded wrapper; a fixture's directory is written `<fixture>`, and no capture holds an absolute path; a line's trailing spaces are dropped. The decisions that read these are in [decisions.md](decisions.md).

## The listing in core

`npm run limits` in this checkout on 2026-11-17 at 04:20 UTC; the two fixtures below were captured in the same run of the script. Core has no `docs/control/time-limits.json`, so every key is at the kit's figure.

```text
Time limits of this root: 38 keys. docs/control/time-limits.json is absent, so the kit's figures apply; enforce true; scale 1.
suite.format | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the format row: the format check over the checkout | passing it: the row fails as time, and no later task of the selection runs
suite.configuration | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the configuration row of an instance: loading its own configuration, roots and registrations | passing it: in an instance the row fails as time, and no later task of the selection runs; in core, where it runs only by name, the task is ended and its row fails as time
suite.configuration-root | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the kit's tests of its configuration loader: a structural row in core, run in an instance only by name | passing it: in core the row fails as time, and no later task of the selection runs; in an instance, where it runs only by name, the task is ended and its row fails as time
suite.registrations | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the registrations row: record streams and document-gate scripts are classified | passing it: the row fails as time, and no later task of the selection runs
suite.declarations | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the declarations row: declared suite and fixture inputs cover their imports | passing it: the row fails as time, and no later task of the selection runs
suite.generated | kit 0 h 10 min (600000 ms) | here 0 h 10 min (600000 ms), from the kit | bounds the generated row: every generated-artifact check, one after another | passing it: the row fails as time, and no later task of the selection runs
suite.git-surface | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds core's Git surface row | passing it: the row fails as time, and no later task of the selection runs
suite.host | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the host row: the runtime, Git and memory checks before any suite | passing it: the row fails as time, and no later task of the selection runs
suite.default | kit 0 h 45 min (2700000 ms) | here 0 h 45 min (2700000 ms), from the kit | bounds every other suite row and each file task of a suite, the kit verification and the document rows of an instance among them | passing it: the task is ended and its row fails as time
suite.stop-grace | kit 1000 ms | here 1000 ms, from the kit | bounds the pause between telling an ended task to stop and killing it | passing it: the task's processes are killed
suite.finish-grace | kit 100 ms | here 100 ms, from the kit | bounds the pause for a task's output after it exits or is killed | passing it: the row is finished without the rest of its output
suite.guard-record | kit 1000 ms | here 1000 ms, from the kit | bounds the wait for the host guard's record of a task it stopped | passing it: the row is read without the guard's record
generated.check | kit 0 h 3 min (180000 ms) | here 0 h 3 min (180000 ms), from the kit | bounds each generated-artifact check, in the generated row and in npm run sync | passing it: the check is ended and reported as time; the generated row fails, and sync leaves that artifact unwritten
generated.runtime-build | kit 0 h 2 min (120000 ms) | here 0 h 2 min (120000 ms), from the kit | bounds core's build of a stale compiled runtime before a selection | passing it: the build is ended; the generated check then judges the runtime
sync.format | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds the format check and the format write of npm run sync | passing it: the step is ended; sync reports the format unread and writes nothing for it
sync.write | kit 0 h 5 min (300000 ms) | here 0 h 5 min (300000 ms), from the kit | bounds each other writer npm run sync runs: an artifact's regeneration or an evidence edition's mint | passing it: the writer is ended; sync reports that artifact unwritten
license.dry-run | kit 0 h 4 min (240000 ms) | here 0 h 4 min (240000 ms), from the kit | bounds each package's publish dry run in the license check | passing it: the dry run is ended and its rule fails, so the license row fails
index.preflight-suites | kit 0 h 2 min (120000 ms) | here 0 h 2 min (120000 ms), from the kit | bounds the work-order index check's read of the runner's suite names | passing it: the index check fails, so the generated row fails
evidence.npm-test | kit 1 h 0 min (3600000 ms) | here 1 h 0 min (3600000 ms), from the kit | bounds the npm test run of node scripts/harness.mjs evidence | passing it: the run is ended and the evidence check fails
evidence.diff-check | kit 0 h 3 min (150000 ms) | here 0 h 3 min (150000 ms), from the kit | bounds the git diff --check run of node scripts/harness.mjs evidence | passing it: the run is ended and the evidence check fails
evidence.stop-wait | kit 20000 ms | here 20000 ms, from the kit | bounds the wait of node scripts/harness.mjs evidence --stop for running gates to end | passing it: the command reports the gates still running; run it again to keep waiting
evidence.record-lock | kit 30000 ms | here 30000 ms, from the kit | bounds the wait for the lock on the gate record while a row is written | passing it: the row is not recorded and the command that wrote it fails
evidence.owner-start | kit 1000 ms | here 1000 ms, from the kit | bounds the read of a gate owner's start time from the process table, in a gate and in every write or shell hook, whose own bound is fixed | passing it: the owner is judged alive by signal alone
probe.command | kit 0 h 15 min (900000 ms) | here 0 h 15 min (900000 ms), from the kit | bounds a command under node scripts/harness.mjs bounded with no --timeout-seconds | passing it: the command is ended and the probe fails as time
probe.test-selection | kit 6 h 0 min (21600000 ms) | here 6 h 0 min (21600000 ms), from the kit | bounds a test selection under node scripts/harness.mjs bounded, complete or by name; each task inside it keeps its own limit | passing it: the selection is ended and the probe fails as time
host.temp-root | kit 2000 ms | here 2000 ms, from the kit | bounds the read of the user's temporary directory, where gates, probes and the guard keep host state; a dispatch reads it too, under the hook's own fixed bound | passing it: the gate, probe or guard that asked fails before it starts
host.census | kit 10000 ms | here 10000 ms, from the kit | bounds each native process census of the memory monitor | passing it: every running task fails as monitor-unavailable
host.footprint-fallback | kit 20000 ms | here 20000 ms, from the kit | bounds the top reading used when a full census fails | passing it: the census fails as monitor-unavailable
host.pressure-reading | kit 10000 ms | here 10000 ms, from the kit | bounds each sysctl reading of that fallback | passing it: the reading is recorded as unavailable
host.descriptor-capture | kit 10000 ms | here 10000 ms, from the kit | bounds the descriptor capture at each task's launch | passing it: the task fails as monitor-unavailable before it runs
host.sdk-path | kit 0 h 1 min (60000 ms) | here 0 h 1 min (60000 ms), from the kit | bounds the read of the compiler's SDK path before a native helper is compiled | passing it: no native helper is compiled and no gate task can start
host.helper-compile | kit 0 h 2 min (120000 ms) | here 0 h 2 min (120000 ms), from the kit | bounds the compile of a native helper, once per host and per helper source | passing it: no native helper is compiled and no gate task can start
host.file-events-sample | kit 10000 ms | here 10000 ms, from the kit | bounds the sample of the file-events daemon in the host row | passing it: the sample is reported as not taken; nothing is refused
host.lane-reader | kit 10000 ms | here 10000 ms, from the kit | bounds the process read of node scripts/harness.mjs lanes | passing it: the command reports the reader unavailable
host.git-version | kit 30000 ms | here 30000 ms, from the kit | bounds the read of the running Git's version | passing it: the host row, harness check and every test selection refuse with Git unread
guard.startup | kit 5000 ms | here 5000 ms, from the kit | bounds the wait for the host guard to start before a gate or a probe, and at a dispatch under the hook's own fixed bound | passing it: the gate or probe fails before any task
guard.child-stop | kit 1000 ms | here 1000 ms, from the kit | bounds the pause between telling an unneeded guard process to stop and killing it | passing it: that process is killed
guard.runner-stop | kit 1000 ms | here 1000 ms, from the kit | bounds the guard's pause between telling a gate's runner to stop and killing it | passing it: the runner's processes are killed
Raise one with its set, multiply all with scale or turn all off with enforce: false in docs/control/time-limits.json; npm run limits -- --write writes that file with every key.
```

## The listing in an instance fixture

A root with a kit manifest and no package source. `npm run limits -- --write` first created its file (`Wrote docs/control/time-limits.json with every key at the kit's figure.`). Its owner then set `scale` to 2, raised `suite.generated` to 900000, turned `license.dry-run` off with `null` and wrote `"5 min"` for `suite.host`, which the resolver cannot use. `npm run limits` there:

```text
Time limits of this root: 38 keys. docs/control/time-limits.json is read; enforce true; scale 2.
ADVISORY time limits: docs/control/time-limits.json: limits.suite.host.set "5 min" is not a number of milliseconds above zero, null or "kit"; the kit's value applies
suite.format | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the format row: the format check over the checkout | passing it: the row fails as time, and no later task of the selection runs
suite.configuration | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the configuration row of an instance: loading its own configuration, roots and registrations | passing it: in an instance the row fails as time, and no later task of the selection runs; in core, where it runs only by name, the task is ended and its row fails as time
suite.configuration-root | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the kit's tests of its configuration loader: a structural row in core, run in an instance only by name | passing it: in core the row fails as time, and no later task of the selection runs; in an instance, where it runs only by name, the task is ended and its row fails as time
suite.registrations | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the registrations row: record streams and document-gate scripts are classified | passing it: the row fails as time, and no later task of the selection runs
suite.declarations | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the declarations row: declared suite and fixture inputs cover their imports | passing it: the row fails as time, and no later task of the selection runs
suite.generated | kit 0 h 10 min (600000 ms) | here 0 h 30 min (1800000 ms), from docs/control/time-limits.json (set) x scale 2 | bounds the generated row: every generated-artifact check, one after another | passing it: the row fails as time, and no later task of the selection runs
suite.git-surface | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds core's Git surface row | passing it: the row fails as time, and no later task of the selection runs
suite.host | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the host row: the runtime, Git and memory checks before any suite | passing it: the row fails as time, and no later task of the selection runs
suite.default | kit 0 h 45 min (2700000 ms) | here 1 h 30 min (5400000 ms), from the kit x scale 2 | bounds every other suite row and each file task of a suite, the kit verification and the document rows of an instance among them | passing it: the task is ended and its row fails as time
suite.stop-grace | kit 1000 ms | here 2000 ms, from the kit x scale 2 | bounds the pause between telling an ended task to stop and killing it | passing it: the task's processes are killed
suite.finish-grace | kit 100 ms | here 200 ms, from the kit x scale 2 | bounds the pause for a task's output after it exits or is killed | passing it: the row is finished without the rest of its output
suite.guard-record | kit 1000 ms | here 2000 ms, from the kit x scale 2 | bounds the wait for the host guard's record of a task it stopped | passing it: the row is read without the guard's record
generated.check | kit 0 h 3 min (180000 ms) | here 0 h 6 min (360000 ms), from the kit x scale 2 | bounds each generated-artifact check, in the generated row and in npm run sync | passing it: the check is ended and reported as time; the generated row fails, and sync leaves that artifact unwritten
generated.runtime-build | kit 0 h 2 min (120000 ms) | here 0 h 4 min (240000 ms), from the kit x scale 2 | bounds core's build of a stale compiled runtime before a selection | passing it: the build is ended; the generated check then judges the runtime
sync.format | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds the format check and the format write of npm run sync | passing it: the step is ended; sync reports the format unread and writes nothing for it
sync.write | kit 0 h 5 min (300000 ms) | here 0 h 10 min (600000 ms), from the kit x scale 2 | bounds each other writer npm run sync runs: an artifact's regeneration or an evidence edition's mint | passing it: the writer is ended; sync reports that artifact unwritten
license.dry-run | kit 0 h 4 min (240000 ms) | here off, from docs/control/time-limits.json (set: null) | bounds each package's publish dry run in the license check | passing it: the dry run is ended and its rule fails, so the license row fails
index.preflight-suites | kit 0 h 2 min (120000 ms) | here 0 h 4 min (240000 ms), from the kit x scale 2 | bounds the work-order index check's read of the runner's suite names | passing it: the index check fails, so the generated row fails
evidence.npm-test | kit 1 h 0 min (3600000 ms) | here 2 h 0 min (7200000 ms), from the kit x scale 2 | bounds the npm test run of node scripts/harness.mjs evidence | passing it: the run is ended and the evidence check fails
evidence.diff-check | kit 0 h 3 min (150000 ms) | here 0 h 5 min (300000 ms), from the kit x scale 2 | bounds the git diff --check run of node scripts/harness.mjs evidence | passing it: the run is ended and the evidence check fails
evidence.stop-wait | kit 20000 ms | here 40000 ms, from the kit x scale 2 | bounds the wait of node scripts/harness.mjs evidence --stop for running gates to end | passing it: the command reports the gates still running; run it again to keep waiting
evidence.record-lock | kit 30000 ms | here 0 h 1 min (60000 ms), from the kit x scale 2 | bounds the wait for the lock on the gate record while a row is written | passing it: the row is not recorded and the command that wrote it fails
evidence.owner-start | kit 1000 ms | here 2000 ms, from the kit x scale 2 | bounds the read of a gate owner's start time from the process table, in a gate and in every write or shell hook, whose own bound is fixed | passing it: the owner is judged alive by signal alone
probe.command | kit 0 h 15 min (900000 ms) | here 0 h 30 min (1800000 ms), from the kit x scale 2 | bounds a command under node scripts/harness.mjs bounded with no --timeout-seconds | passing it: the command is ended and the probe fails as time
probe.test-selection | kit 6 h 0 min (21600000 ms) | here 12 h 0 min (43200000 ms), from the kit x scale 2 | bounds a test selection under node scripts/harness.mjs bounded, complete or by name; each task inside it keeps its own limit | passing it: the selection is ended and the probe fails as time
host.temp-root | kit 2000 ms | here 4000 ms, from the kit x scale 2 | bounds the read of the user's temporary directory, where gates, probes and the guard keep host state; a dispatch reads it too, under the hook's own fixed bound | passing it: the gate, probe or guard that asked fails before it starts
host.census | kit 10000 ms | here 20000 ms, from the kit x scale 2 | bounds each native process census of the memory monitor | passing it: every running task fails as monitor-unavailable
host.footprint-fallback | kit 20000 ms | here 40000 ms, from the kit x scale 2 | bounds the top reading used when a full census fails | passing it: the census fails as monitor-unavailable
host.pressure-reading | kit 10000 ms | here 20000 ms, from the kit x scale 2 | bounds each sysctl reading of that fallback | passing it: the reading is recorded as unavailable
host.descriptor-capture | kit 10000 ms | here 20000 ms, from the kit x scale 2 | bounds the descriptor capture at each task's launch | passing it: the task fails as monitor-unavailable before it runs
host.sdk-path | kit 0 h 1 min (60000 ms) | here 0 h 2 min (120000 ms), from the kit x scale 2 | bounds the read of the compiler's SDK path before a native helper is compiled | passing it: no native helper is compiled and no gate task can start
host.helper-compile | kit 0 h 2 min (120000 ms) | here 0 h 4 min (240000 ms), from the kit x scale 2 | bounds the compile of a native helper, once per host and per helper source | passing it: no native helper is compiled and no gate task can start
host.file-events-sample | kit 10000 ms | here 20000 ms, from the kit x scale 2 | bounds the sample of the file-events daemon in the host row | passing it: the sample is reported as not taken; nothing is refused
host.lane-reader | kit 10000 ms | here 20000 ms, from the kit x scale 2 | bounds the process read of node scripts/harness.mjs lanes | passing it: the command reports the reader unavailable
host.git-version | kit 30000 ms | here 0 h 1 min (60000 ms), from the kit x scale 2 | bounds the read of the running Git's version | passing it: the host row, harness check and every test selection refuse with Git unread
guard.startup | kit 5000 ms | here 10000 ms, from the kit x scale 2 | bounds the wait for the host guard to start before a gate or a probe, and at a dispatch under the hook's own fixed bound | passing it: the gate or probe fails before any task
guard.child-stop | kit 1000 ms | here 2000 ms, from the kit x scale 2 | bounds the pause between telling an unneeded guard process to stop and killing it | passing it: that process is killed
guard.runner-stop | kit 1000 ms | here 2000 ms, from the kit x scale 2 | bounds the guard's pause between telling a gate's runner to stop and killing it | passing it: the runner's processes are killed
Raise one with its set, multiply all with scale or turn all off with enforce: false in docs/control/time-limits.json; npm run limits -- --write writes that file with every key.
```

## A row ended for time

A fixture gate whose root gives `suite.registrations` 200 ms and whose registrations row takes two seconds. The runner's lines for the row and for the tasks after it; the gate's row exits 1.

```text
TIME registrations 0 h 0 min
  [registrations]
  [registrations] Suite registrations timed out after 0 h 0 min. Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.
SKIP build 0 h 0 min
  [build] Required registrations structural preflight was ended for time before it finished: nothing was judged, and this is its time limit, not a failed check. Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.
  [build]
  [build] Suite registrations timed out after 0 h 0 min. Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.
SKIP alpha 0 h 0 min
  [alpha] Required registrations structural preflight was ended for time before it finished: nothing was judged, and this is its time limit, not a failed check. Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.
  [alpha]
  [alpha] Suite registrations timed out after 0 h 0 min. Time limit suite.registrations reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.
EXIT 1
```

## The exported instance's gate at one third of every figure

The export fixture's case, run alone under the bounded wrapper on 2026-11-17 from 01:05 to 01:07 UTC: the exported instance's three selections with `scale` at one third in its seeded limits file. Each task's time beside the reduced figure it ran under and the key that figure was read from.

```text
npm test: 10450 ms
  format: 5549 ms of 100000 ms (suite.format)
  configuration: 75 ms of 100000 ms (suite.configuration)
  registrations: 92 ms of 100000 ms (suite.registrations)
  declarations: 1232 ms of 100000 ms (suite.declarations)
  generated: 2711 ms of 200000 ms (suite.generated)
  host: 128 ms of 100000 ms (suite.host)
  kit-verify: 157 ms of 900000 ms (suite.default)
npm run test:docs: 22480 ms
  format: 5598 ms of 100000 ms (suite.format)
  configuration: 77 ms of 100000 ms (suite.configuration)
  registrations: 86 ms of 100000 ms (suite.registrations)
  declarations: 1246 ms of 100000 ms (suite.declarations)
  generated: 2581 ms of 200000 ms (suite.generated)
  host: 122 ms of 100000 ms (suite.host)
  kit-verify: 153 ms of 900000 ms (suite.default)
  terms: 94 ms of 900000 ms (suite.default)
  harness-context: 394 ms of 900000 ms (suite.default)
  license-surfaces: 1367 ms of 900000 ms (suite.default)
  docs-check: 1421 ms of 900000 ms (suite.default)
  reader-profiles: 59 ms of 900000 ms (suite.default)
  entropy: 121 ms of 900000 ms (suite.default)
  plan: 451 ms of 900000 ms (suite.default)
  plan-refutation-current: 10554 ms of 900000 ms (suite.default)
npm test -- --review: 10304 ms
  format: 5471 ms of 100000 ms (suite.format)
  configuration: 80 ms of 100000 ms (suite.configuration)
  registrations: 101 ms of 100000 ms (suite.registrations)
  declarations: 1226 ms of 100000 ms (suite.declarations)
  generated: 2641 ms of 200000 ms (suite.generated)
  host: 130 ms of 100000 ms (suite.host)
  kit-verify: 156 ms of 900000 ms (suite.default)
```

The arm that shows the check failing: with `suite.format` set to 1 ms, `npm test` in the instance failed in 1239 ms of wall time, and the case's judgment named the format task as ended for time.

What this check costs. Before this order, the file that holds this case, launchpad:file:test-launchpad-export.mjs, took a median of 212,692 ms and at most 472,265 ms over 192 passing runs in the thirty days of core's gate record, all with the instance's rows at their full figures. Measured so far in this order: this one case, run alone with the failing arm and the reduced figures, took 116176 ms. That is one case and not the file, so it is not the file's time after the change and is not set beside the median. After: in the order's passing complete run, recorded 2026-11-17T04:17:19.412Z, the whole file took 329,183 ms. That is one run under a full gate's load, above the earlier median and inside the earlier maximum; the order adds to the file the failing arm, the kit's configuration tests run by name in the instance and one case for the first order.

## The closeout selection's two forms

`npm run resume -- briefing` in this checkout, twice on 2026-11-17. At 01:17 UTC, before any complete run of this order, it printed the owed form:

```text
Closeout checks owed as the order stands (its closeout selection, not run; npm run resume -- briefing prints it again after an edit or integration):
  npm test -- --review
  npm run test:docs
The complete launchpad run is owed because this is a launchpad order, and the complete run is its own repository's gate.
```

At 04:18 UTC, a minute after the order's passing complete run was recorded, it printed the satisfied form, which names the row's time and lists the document gate alone:

```text
Closeout checks owed as the order stands (its closeout selection, not run; npm run resume -- briefing prints it again after an edit or integration):
  npm run test:docs
The complete launchpad run is satisfied: a passing complete review row stands at the current code identity, recorded 2026-11-17T04:17:19.412Z (it took 0 h 58 min), and completion consumes it. Only the document gate is owed; an edit to documents alone owes no complete run. The run was owed because this is a launchpad order, and the complete run is its own repository's gate.
```

## The forced selection's answer

`npm test -- --review --again` in this checkout on 2026-11-17 at 04:18 UTC, at the identity whose passing row had just been recorded. It exited 0, ran no task and recorded no row:

```text
npm test: a passing complete row already stands at this code identity: recorded 2026-11-17T04:17:19.412Z, 0 h 58 min, 47 suites, host-gate:e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302:npm test.
Nothing was run. Running the selection again would take about as long as that row did (0 h 58 min) and count as a complete run of this dispatch, for a result the row already holds: a completion consumes it, and an edit to documents alone owes npm run test:docs and no complete run. To run it again all the same, state why and the row will keep it: npm test -- --review --again --reason "<why>".
```

## The live feedback episode

Two episodes are recorded. [feedback-002](feedback-002/) is the edition `docs/evidence/current.json` selects: it judged the source as it stands after the review's fixes ([D022](decisions.md#wo-284-d022--round-3-confirms-the-round-2-fixes-the-authority-edition-it-found-stale-was-already-re-minted-one-note-is-recorded-and-the-second-feedback-episode-is-in)). [feedback-001](feedback-001/) is the first episode's edition, which those fixes staled ([D012](decisions.md#wo-284-d012--the-feedback-edition-is-re-minted-from-one-live-self-host-episode-on-the-default-worker-and-the-authority-edition-by-sync)).
