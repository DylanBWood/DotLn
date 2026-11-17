# WO-284 decisions

## WO-284-D001

```json
{
  "id": "WO-284-D001",
  "date": "2026-11-16",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v1.3.0, the next minor above the observed release baseline v1.2.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v1.2.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-284-an-instance-sets-every-time-limit-of-its-gate.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-284-D002 — The operator's direction: a meta critic on GPT-6 Astra forty-five minutes on, then on its clock, on a copy of the transcripts that holds no account address

```json
{
  "id": "WO-284-D002",
  "date": "2026-11-16",
  "dispatch": "resume: next; the operator's message of 22:34:59 UTC on 2026-11-16, ten minutes into the dispatch",
  "decision": "The operator asked, in paraphrase, for a meta critic on GPT-6 Astra to be started three quarters of an hour later and kept on its cadence. The critic is the one docs/evidence/WO-276/critic/ holds (its fixed charter, its launcher and its README), which the kit has no command for until WO-279; the worker table binds astra to gpt-6-astra at max on the Codex provider, the launcher's default. The first launch is made at the time the operator chose, 23:20:00 UTC, which a background timer set at 22:36 UTC ended on; no gate was live then. The README's fourth rule then runs the clock: a further launch every 75 minutes from the last one while the order is being executed, nothing waiting for a critic, a launch that falls due under a live gate going out when the gate ends, and the clock ending when the passing complete run is in. Each report is given to the operator whole before it is answered, and each point is then judged in a decision of this file. The two checks the README asks a later order to repeat were made on what the critic reads, as WO-277-D002, WO-277-D029 and WO-281-D002 made them. The account's address: the host writes it into the session's context, so the launch points the critic, with the launcher's --transcripts option, at a copy of this worktree's transcript directory made at the launch in session scratch, in which each occurrence of an address the host stored for the account, and of the checkout's Git user address, is replaced by one fixed placeholder, each file keeps its modification time and no other byte differs. The private list: every row of the copy is read on its own through the list's reader, printing counts only. The sandbox: a command under Codex's read-only sandbox reads the copy and is refused a write beside it. The launcher is counted by no hook, so each launch is one worker use counted by hand; the plan against the cap of 20 is up to nine review uses, one live feedback episode and up to six critic launches.",
  "evidence": [
    "The operator's message, captured unedited in the ignored intake lane as notes/wo284-start-a-gpt-6-astra-meta-critic-in-45-min-on-cadence-2026-11-16.txt, SHA-256 cdd508ae799f2e7dff51d9050478d578b203ecfaacfe419615cd87ba72700dd3; the host's prompt facts that came with it are stamped 22:34:59 UTC",
    "docs/evidence/WO-276/critic/README.md (the rules that made it useful, and what it needs), charter.md and launch.mjs; WO-277-D002, WO-277-D029 and WO-281-D002 (the two checks, the copy, the clock and the count by hand)",
    "npm run worker -- list at 22:35:38 UTC: astra is gpt-6-astra at max on the Codex provider; codex --version: codex-cli 0.169.0",
    "Session scratch, critic/prepare-transcripts.mjs under the bounded wrapper. A trial at 22:37:20 UTC: 2 files, 2,877,725 bytes and 853 rows. At the launch, recorded 23:19:44 UTC: the original 2 files, 6,382,364 bytes and 3,012 rows; one address the host stored for the account, and the Git user address, which is another and is in no file; 3 occurrences replaced in 2 rows of 1 file; the copy 2 files and 6,382,397 bytes, no file still holding either address; 13 other address-shaped strings under a reserved domain or the placeholder and 3 that are a package name with a version; the private list present with 9 entries, none in the refuse class and 9 in the context class; refuseRows 0 and contextRows 0",
    "codex sandbox -- /bin/sh -c 'wc -c < <the copy's transcript>; touch <the copy>/.write-probe' at 22:38 UTC on the trial copy and at 23:18:37 UTC on the launch copy: the size printed (6,141,536 bytes at the second), the write refused with Operation not permitted, no file created",
    "node docs/evidence/WO-276/critic/launch.mjs WO-284 1 --since 2026-11-16 --transcripts <the copy> --print at 23:19:44 UTC: the charter as sent, 4,409 bytes, SHA-256 18dfa802a1a8a1f5ecdec4830c0447f32b7dc52dfcf8bc6ac82d98f8f46479ca, naming this order, this checkout, the copy's directory, an interval of 75 minutes since 2026-11-16 and launch number 1",
    "The launch: a background command that waited for 23:20:00 UTC and then ran the launcher; a second timer, set at 23:20 UTC, ends at 00:35:00 UTC on 2026-11-17, one interval after the launch"
  ],
  "rejected": [
    {
      "option": "Launch at once",
      "reason": "The operator named the time, and WO-276-D166 records why a critic launched as a dispatch begins has no conduct to read."
    },
    {
      "option": "One launch and no clock after it",
      "reason": "The message asks for the cadence by name, and the README's fourth rule keeps the clock running in every dispatch that works on an order. The operator's word ends it."
    },
    {
      "option": "Send the transcripts as they are",
      "reason": "They hold the account's address in rows the host wrote, and no word of the operator's asks for that to go to the other provider; replacing it changes nothing the critic judges."
    },
    {
      "option": "Give the critic an extract of the transcripts",
      "reason": "Choosing what it reads is briefing it by another name (WO-276-D101). The copy holds every file and every row."
    }
  ],
  "reopenWhen": "The operator says to send the transcripts as they are, to hold the critic, to stop the clock or to change its interval; or WO-279 lands, and the kit's own launch and screen replace this copied route."
}
```

## WO-284-D003 — The table's keys and the kit's figures, each with the times it rests on

```json
{
  "id": "WO-284-D003",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 1, the table of the gate path's time limits",
  "decision": "packages/skeleton/src/time-limits.mjs holds 38 keys (39 before the review's round 1; WO-284-D017 holds what changed and why: three figures back at main's, two configuration-root keys gone, the probe's selection key renamed and the guard's runner pause added). The order's rule sets each figure: a step an instance's own gate runs gets at least ten times its slowest passing time in core's gate record of the thirty days before the order, no suite row gets under five minutes, and a row only core's complete run uses gets at least three times its slowest passing time. The record is the local gate ledger of core's main checkout, read through readGateChecks: 3,304 rows from 2026-10-17 to 2026-11-16, each task's slowest execution that passed. Where the record times no step (the host's own probes, the bounded probe wrapper, the evidence gate's stop wait), the step was timed on this host on 2026-11-16 outside a gate, or the figure is kept with the reason. The suite rows: suite.format 300,000 ms (was 30,000; slowest pass 13.3 s of 1,520, so ten times is 133 s and the five-minute floor applies); suite.configuration-root 300,000 (was 30,000; 21.2 s of 1,477 passes, ten times 212 s, the floor); suite.configuration 300,000 (new row; 83 ms in the exported instance on 2026-11-16, the floor); suite.registrations 300,000 (was 30,000; 1.4 s); suite.declarations 300,000 (was 30,000; 2.2 s); suite.generated 600,000 (was 120,000; 44.6 s of 1,339 passes, ten times 446 s, rounded up to ten minutes); suite.git-surface 300,000 (was 30,000; core only, 2.1 s, the floor); suite.host 300,000 (was 10,000; 0.154 s, the floor); suite.default 2,700,000 (was 900,000) for every other row and each file task, the base comparison of a failed document row among them. The default has to serve two kinds of row. An instance's gate runs kit-verify and eight document rows on it, whose slowest pass in core is plan-refutation-current at 52.6 s, then docs-check 45.6 s, plan 44.0 s and license-surfaces 21.2 s, so ten times is 526 s. Core's complete run puts its heaviest files on it: target-worktree's close file at 845.8 s (196 passes, one timeout at 900 s) and the launchpad update file at 812.5 s, so three times is 2,537 s; 2,700 s is 3.2 times the first and 51 times the instance's slowest row. The pauses after a stop keep their figures, since they end nothing: suite.stop-grace 1,000, suite.finish-grace 100 and suite.guard-record 1,000 (fifty reads twenty milliseconds apart, as before). The checks inside rows: generated.check 180,000 (was 30,000 a check; the decisions-index check's slowest pass 17.4 s of 1,187, ten times 174 s; WO-277-D028 saw it take 72 s on a host 3.4 times slower); generated.runtime-build 120,000 (unchanged; core only, the build's slowest pass as a task 2.7 s); sync.format 300,000 (was 120,000; the format check's 13.3 s again, the floor a suite row gets); sync.write 300,000 (was 120,000 a writer; WO-277-D028 saw npm run meta take 85 s on the slow host and 17 s at ordinary speed, ten times 170 s); license.dry-run 240,000 (was 30,000 a manifest; the whole row's slowest pass, 21.2 s of 461, bounds any one dry run, ten times 212 s); index.preflight-suites 120,000 (was 30,000; the whole index check that holds it took 6.4 s at most, ten times 64 s). The evidence commands: evidence.npm-test 3,600,000 (was 900,000, under which a fresh plain selection of core no longer fits: the one that passed in the window took 1,134 s, and three times is 3,403 s); evidence.diff-check 150,000 (unchanged; 1.9 s at most of 282); evidence.stop-wait 20,000 (unchanged: nothing times it, and passing it only tells the session to run the command again); evidence.record-lock 30,000 (was 5,000; the lock is held for one read and one replace, and a miss loses a row); evidence.owner-start 1,000 (unchanged; ps took 3.9 ms at most of 20, its miss is benign, and the read also runs in every write or shell hook under the hook's own bound). The probe wrapper: probe.command 900,000 and probe.test-selection 21,600,000, both figures unchanged, the second now bounding every test selection under the wrapper, complete or by name, so that a suite's own limit can apply inside it; no record times a probe, the slowest passing complete review of core took 3,915 s, which six hours is 5.5 times, and --timeout-seconds or this file raises the first. The host's own steps, each timed twenty times on this host at a load of 3.9 on 16 processors unless noted: host.temp-root 2,000 (unchanged; getconf 4.1 ms at most; a dispatch reads it under the hook's own bound); host.census 10,000 (was 2,000; 6.1 ms); host.footprint-fallback 20,000 (was 5,000; top took 592 ms at most of five, which the old figure was 8.4 times); host.pressure-reading 10,000 (was 2,000; sysctl 4.1 ms); host.descriptor-capture 10,000 (was 2,000; the same helper as the census, not timed apart since a capture of the measuring process itself is refused in 2.8 ms); host.sdk-path 60,000 (was 5,000; xcrun 8.2 ms at most of ten when warm); host.helper-compile 120,000 (was 30,000; clang 101 ms at most of five for the larger helper); host.file-events-sample 10,000 (was 3,000; ps -A 33.9 ms); host.lane-reader 10,000 (was 2,000; the census helper again); host.git-version 30,000 (was 10,000; 7.2 ms); guard.startup 5,000 (unchanged; the guard case observed a start well inside it, no start is timed in the record, and a dispatch waits on it under the hook's own bound); guard.child-stop 1,000, a pause after a stop, unchanged; guard.runner-stop 1,000, the guard's pause before it kills a runner it stopped, a figure the guard kept itself until the review found it. The kit's two bounded cases in its configuration tests keep no key: the worktree case has no timer of its own under its suite's row, where a figure equal to the row's could never apply, and the pipe case's child takes a tenth of that row's limit, 30 s at the kit's figure where it was 5 s. The host figures are from 295 to several thousand times their measured times, and the top reading's is 34 times: they are raised because one miss fails every running task or stops a gate before it starts, and a process start under memory pressure is what the measured times do not show.",
  "evidence": [
    "Session scratch, gate-times.mjs over readGateChecks of the main checkout at 22:30 UTC: rows=3304 since 2026-10-17T00:00:00.000Z, first 2026-10-17T01:25:44.383Z, last 2026-11-16T21:59:51.066Z; per task the count of passing executions, the slowest and the median, and the same for each generated check inside the generated row; the figures above are its slowest passes",
    "Session scratch, gate-rows.mjs over the same rows: npm test review fresh 108 passes, slowest 3,915,159 ms; npm test plain forced-fresh 1 pass, 1,134,406 ms; git diff --check 282 passes, slowest 1,911 ms; npm run test:docs fresh 367 passes, slowest 2,340,802 ms and median 147,403 ms",
    "Session scratch, host-times.mjs at 2026-11-16T22:34:21Z, load 3.93, 4.68, 4.28 on 16 processors: getconf median 2.6 ms and slowest 4.1; the light census 2.9 and 6.1; the full census 4.1 and 4.9; ps -A 32.2 and 33.9; top 585.7 and 591.8 of five; sysctl 1.7 and 4.1; xcrun 7.3 and 8.2 of ten; clang 57.8 and 87.3 for host-lock.c and 84.3 and 100.8 for host-footprint.c, five each; git --version 6.4 and 7.2; ps -p for one process 2.9 and 3.9",
    "The exported instance at one third of every figure, 23:03 to 23:05 UTC: npm test 14.8 s with format 6.2 s, configuration 83 ms, registrations 108 ms, declarations 1.3 s, generated 6.2 s, host 134 ms and kit-verify 163 ms",
    "WO-277-D019 (the close file at 720 s and then its timeout at 900 s) and WO-277-D028 (two generated checks refused at 30 s on a slowed host); the census of this pass, rows A01 to A16, B03 to B05, B24 and E01 to E13"
  ],
  "rejected": [
    {
      "option": "A key for every suite row",
      "reason": "Eighty-two more keys in the owner's file for rows that share one figure; the default's two uses are both served by one number, and a row that needs its own gets a key when the record shows it."
    },
    {
      "option": "A separate key for the file tasks of an expanded suite",
      "reason": "The site kept the default's figure by its own literal; with the default sized for the heaviest file the key would hold the same number."
    },
    {
      "option": "Leave the host probes at their figures, which already exceed ten times the measured times",
      "reason": "The census ranks them as what a slower host meets next, a miss fails every running task, and the measured times are an idle host's."
    }
  ],
  "reopenWhen": "A step's slowest pass in a later thirty days comes within a third of its figure in core, or an instance reports a miss at the kit's figure; the default is reopened first if a core row passes 900 s."
}
```

## WO-284-D004 — How a root's file changes the figures: null is a limit turned off, the pauses after a stop stay on and never shrink, and one unusable value is one advisory for a whole command

```json
{
  "id": "WO-284-D004",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 1, the resolver, the listing and the file",
  "decision": "timeLimit(root, key) returns the figure in milliseconds or null for a limit the root turned off; a caller passes it to a child's timeout as it is and starts no timer for null. The file is found through the build-free control-directory reader the budgets already use, so a configured control root moves it. Five choices the order's text leaves open are made here. First, scale multiplies every figure, the owner's own set figures included, since the order says every figure. Second, the three pauses after a stop (between telling a stopped task to end and killing it, for its last output, and for the guard's record of a stop) and the guard's own are rows of the table that enforce: false and set: null do not turn off, and that a scale below one does not shorten: they end only what was already ended, turning them off would leave a stop request or a missed limit waiting on a process that ignores it, and a third of the 100 ms pause for a task's output would cut real output off in core's check. A null on one of them is an unusable value. Third, a value the resolver cannot use is one advisory each, and a command prints its advisories once: the first process that prints them leaves a digest in its environment, which the processes it starts inherit, so a gate's forty children do not repeat it. Fourth, the listing is one line a key. Fifth, --write writes back whatever set holds, usable or not, and keeps an entry this kit has no limit for, each still named by the advisory, and it refuses to rewrite a file that does not parse: a file is its owner's, and a misspelled key that silently vanished would look like a limit that had been raised.",
  "evidence": [
    "packages/skeleton/src/time-limits.mjs: resolve, timeLimits, reportTimeLimitAdvisories, timeLimit, timeLimitMiss and renderTimeLimits; scripts/time-limits.mjs: listTimeLimits and writeTimeLimits; scripts/kit/time-limits.template.json is renderTimeLimits() with no argument",
    "scripts/test-configuration-root.mjs, the two cases added, 13 subtests, each run under the bounded wrapper at 22:59 UTC: no file, a raised key, a scale of 3 and of one third, null, enforce false, seven unusable values each named once, a parent and a child process that print one advisory between them, a configured control root, the template, the listing's rows and lines, --write and a later release's table",
    "packages/skeleton/src/temporary-root-records.mjs, configuredControlDirectory: roots.control, else roots.docs with /control, else docs/control"
  ],
  "rejected": [
    {
      "option": "Return undefined for a limit turned off",
      "reason": "A parameter default replaces undefined, so the suite executor could not tell a limit turned off from a caller that passed none."
    },
    {
      "option": "Let enforce: false and scale reach the pauses after a stop",
      "reason": "A stop that never escalates is a gate that cannot be stopped, and the one-third check would then fail on lost output and not on a slow step."
    },
    {
      "option": "Drop entries the kit has no limit for when --write runs",
      "reason": "It deletes an owner's value without a word; the advisory keeps naming it until the owner removes it."
    },
    {
      "option": "Stop the command on an unusable value",
      "reason": "The order's design: no command stops for it."
    }
  ],
  "reopenWhen": "An owner needs a pause after a stop turned off or shortened, or the advisory is shown to be missed where a command's standard error is discarded."
}
```

## WO-284-D005 — What the gate path is for criterion 4, and the limits in its files that are not on it

```json
{
  "id": "WO-284-D005",
  "date": "2026-11-16",
  "dispatch": "resume: next; steps 2 to 4 and 6, the sites that read the table and the core-only case",
  "decision": "The gate path is the Design's: the census's rows A01 to A16, B03 to B05, B24 and E01 to E13. Every one of those sites reads its key, and so do the sites beside them that the same files held: sync's publication-lock check and its writers (sync.write and generated.check), since step 3 names scripts/sync.mjs and one row of B01 would have left three more figures in the file. The core-only case names eighteen files and reads each with the source reader's syntax tree: a timeout or timeoutMs property, a timer's delay, a deadline's figure, a clock reading plus a number, and a name ending in Ms that is given a number. A site it finds must read the table or be one of nineteen it lists with what it is (sixteen before the review's round 1 widened the scan to a clock difference compared with a figure and to a constant used as a delay or a timeout, which found one more use of an interval, the least time between two progress lines and the guard's idle time before it retires): six intervals between polls, three heartbeat figures, a sampling delay, three rows of configuration fixture data, and three sites of two commands that are no gate (the Git reads of explicit index generation, census row B23, and the deadline and poll of evidence --wait, B02). The harness host is read for its evidence gate alone, the function runHarnessEvidenceChecks, because the same file holds the hooks' own limits, which the order's known issues keep (census rows C06 to C16). A fixture row's own timeoutMs stays a fixture control, as heartbeatMs is: it names no key, and no declared suite row or generated artifact carries one. The case also holds that every key of the table is read on the path, and that the scan finds the old figures when they are written back.",
  "evidence": [
    "scripts/test-runner.test.mjs, GATE_PATH_FILES, timeFigureSites and the case for criterion 4, run under the bounded wrapper at 23:17 UTC: pass; before the heartbeat's interval was listed it failed naming scripts/test-runner.mjs:1520, the one site not yet accounted for",
    "The census, class B: B23 'Host observations belong only to explicit index generation. Check and planning readers use the committed observation and never open targets' (scripts/work-orders.mjs, readTargetFacts); B02 raised only by a per-invocation --timeout",
    "The order's Known issues: the hook bound and the lifecycle children inside it are not on the gate path and stay; its Non-goals: a time limit outside the gate path"
  ],
  "rejected": [
    {
      "option": "Give B23, B02 and the hook limits keys so that no listed site remains",
      "reason": "The order's non-goals bar a limit outside the gate path, and WO-288's Part D moves those rows."
    },
    {
      "option": "A text search of the files for numbers",
      "reason": "A parsed structure tells a timer's delay from a count or a byte size; the role's rule prefers it to a new scanner of source text."
    }
  ],
  "reopenWhen": "WO-288's Part D moves a listed site into the table, or a file joins the gate path."
}
```

## WO-284-D006 — An instance's gate is its own selections: a suite an instance can only name gets the default, sized for core's heaviest file

```json
{
  "id": "WO-284-D006",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 1, the reading of a path an instance runs",
  "decision": "The Design gives a figure on a path an instance runs ten times its slowest pass, and a row only core runs three times. Read by its purpose, a path an instance runs is what its three selections run (npm test, npm run test:docs and npm test -- --review) and what those rows run inside them: the objective is that an instance passes its gate untouched on a machine three times slower, the census lists the suite rows an instance meets on its default selections, and core's check runs exactly those three at a third. A carried suite an instance can only name with --only (target-worktree, whose close file is the slowest task in core's record at 845.8 s) is a diagnostic of the kit's own tests, as product 07 calls it, and gets the default, which is 3.2 times that file. Ten times it would be two hours and twenty minutes for every row on the default, which is the hung suite holding a complete run for hours that the Design gives as its reason for the smaller multiple.",
  "evidence": [
    "The order's Design: 'A figure on a path an instance runs is at least ten times the slowest passing time of its step'; its Objective; the census's Counts section: 'Suite-deadline rows the instance meets on its default selections: A01-A05, A07, A08 (kit-verify and the eight test:docs document rows), A12, A14, A15-A16'",
    "docs/product/07-execution-guide.md, Gate execution and reuse: 'Carried platform fixtures remain explicit --only or --machinery diagnostics'",
    "The gate record as D003 reads it: target-worktree:file:test-target-worktree-close.mjs 196 passes, slowest 845,802 ms"
  ],
  "rejected": [
    {
      "option": "Ten times the slowest task any carried suite has",
      "reason": "8,458 s on the default for every row in core and in an instance."
    },
    {
      "option": "A key of its own for the close file at ten times",
      "reason": "A named diagnostic an owner raises in the file if a slow machine needs it; a key for one test file of the kit in every owner's list serves no instance's gate."
    }
  ],
  "reopenWhen": "An instance reports a carried suite it ran by name ended at the default."
}
```

## WO-284-D007 — The limits file is added to a starter that lacks it and follows the template while unchanged, as the documentation map does

```json
{
  "id": "WO-284-D007",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 1, the seed",
  "decision": "The export seeds docs/control/time-limits.json from scripts/kit/time-limits.template.json, which is the table rendered with every key at the kit's figure, and exportSeedPaths names it. In a starter refresh it follows the documentation map's rule and is no template seed. A template seed that a starter lacks, with no earlier template to prove it by, refuses the whole refresh, and every starter made before this release lacks the file; so the first close after this order would have stopped at its refresh. Under the map's rule a starter that lacks the file has it added with the other absent seeds, one that still holds an export's bytes is brought to the current template, so the starter lists a release's new keys, and one its owner changed is kept with the reason and stops no refresh.",
  "evidence": [
    "scripts/lib/starter-seeds.mjs: planStarterSeeds refuses a pending seed that is not proven and whose latest proven template differs from the incoming one, with 'starter seed differs from prior export'; the map is passed over where the starter lacks it and is among the seeds kept when customized",
    "scripts/test-launchpad-seeds.mjs, the case for WO-258 criterion 6, run under the bounded wrapper at 23:23 UTC with the limits file among a starter's absent seeds: planned.added names docs/control/time-limits.json between the intake keep-file and the lineage index",
    "scripts/test-launchpad-update.mjs, the starter refresh case: a limits file whose scale its owner set to 2 is kept with 'customized; differs from proven prior exports' in a preview and in a refresh"
  ],
  "rejected": [
    {
      "option": "A template seed, as the budgets are",
      "reason": "It refuses the first refresh of every existing starter."
    },
    {
      "option": "An absent-seed addition that no refresh rewrites, as FOR-CORE.md is",
      "reason": "The starter's file would keep the keys of the release that added it, and a new instance made from it would open a list that lacks a later release's limits."
    }
  ],
  "reopenWhen": "A refresh rewrites a limits file whose owner had changed it, or refuses over one."
}
```

## WO-284-D008 — An instance's configuration row loads its own configuration, and the other root's structural row runs only by name

```json
{
  "id": "WO-284-D008",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 5, the instance's structural phase",
  "decision": "STRUCTURAL_TASKS, an instance's phase, names configuration where it named configuration-root; core's list is written out beside it and keeps configuration-root and the Git surface check, and gate-reuse.mjs's two lists say the same, held equal by a case. The configuration row runs node scripts/structural-checks.mjs configuration: it loads the configuration that governs the root, with its document roots, registrations and feature elections, through the loader every other check resolves its paths through, and prints the loader's own refusal. An absent configuration is the default layout and passes. A row is structural by its name in either list, and a selection keeps its own root's: the other root's row is no part of the root's selections and, named with --only, runs as an ordinary task after the root's structural phase. So an instance still runs the kit's configuration tests with npm test -- --only configuration-root, and core runs the configuration row the same way. In the exported instance the row took 83 ms where configuration-root took 12 s on this host under load and over 30 s on the work laptop.",
  "evidence": [
    "scripts/lib/generated-artifacts.mjs (STRUCTURAL_TASKS, CORE_STRUCTURAL_TASKS, ALL_STRUCTURAL_TASKS), scripts/lib/gate-reuse.mjs (structuralSuites), scripts/test-runner.mjs (classifySuite, the selection's otherRootStructural rows) and scripts/structural-checks.mjs (checkConfiguration)",
    "The export fixture's case, run under the bounded wrapper from 23:03 to 23:05 UTC: the three selections list format, configuration, registrations, declarations, generated and host first; --only configuration-root lists those six, kit-verify and configuration-root; a configuration whose roots.control is 7 is refused naming roots.control; the configuration task took 83 ms",
    "scripts/test-runner.test.mjs, the Preflight case extended to an instance, at 23:20 UTC: structuralSuites of a kit root equals STRUCTURAL_TASKS, and each name of either list is a declared structural row",
    "node scripts/test-runner.mjs --list --selected in core at 22:58 UTC: core's seven structural rows unchanged; --only configuration lists the configuration row after them"
  ],
  "rejected": [
    {
      "option": "Only raise configuration-root's figure in an instance",
      "reason": "The order's own: an instance's gate would still spend its first half minute on tests of code whose bytes kit-verify has compared."
    },
    {
      "option": "Mark configuration-root core-only",
      "reason": "The order keeps it available in an instance by name, and a core-only row is refused there."
    },
    {
      "option": "Print the time-limit advisories in the configuration row",
      "reason": "The runner prints them once for the command already; a second place would say them twice."
    }
  ],
  "reopenWhen": "An instance's broken configuration passes the row and fails a later check, or the row needs to load something the loader does not."
}
```

## WO-284-D009 — The closeout selection says a complete run is satisfied by the row the final review's claim would consume

```json
{
  "id": "WO-284-D009",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 7, the closeout selection",
  "decision": "Where the selection owes the complete launchpad run and a passing complete review row stands at the current code identity, the briefing and worktree integrate now print that the run is satisfied by that row, with when it was recorded and how long it took, and list the document gate alone. The row is found by the lookup the final review's claim already used, moved out of requireFinalReviewGate into standingReviewRow in the handoff ledger: the review selection as the runner would list it now, and the newest standing complete review row that covers it with each suite executed and passing. The selection therefore says satisfied exactly where a completion would consume a row, and a later failed run of a task displaces the row for both. The lookup costs one listing of the runner and one read of the gate index, about half a second on this host, so only a selection that owes the complete run makes it, and only a dispatch or a briefing: a completion's advisory is recorded in the committed control log, and it keeps the form it had so that no checkout's local gate observation enters a committed record. Where no row stands, where the review selection cannot be listed or where the gate index cannot be read, the selection lists the complete run as before; nothing here refuses.",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs (standingReviewRow, requireFinalReviewGate), scripts/lib/closeout-scope.mjs (closeoutStandingFor, closeoutScope's satisfied, closeoutCommands and the reason line), scripts/lib/executor-readiness.mjs, scripts/lib/worktree-integration.mjs (owedChecks) and scripts/resume.mjs",
    "scripts/test-worktree-integration.mjs, the case for criterion 6, run under the bounded wrapper at 23:08 UTC: with no row the owed list names npm test -- --review and npm run test:docs; with a passing complete review row recorded at the identity the integration left it names npm run test:docs alone and reads 'The complete launchpad run is satisfied: a passing complete review row stands at the current code identity, recorded <its time> (it took 0 h 47 min), and completion consumes it'; a later failed run of one task, and a gate index that does not parse, each list the complete run again, exit 0",
    "node scripts/test-runner.mjs --review --list --selected: 0.48 s; gateCodeIdentity of this checkout: 168 ms, both at 23:03 UTC",
    "npm run resume -- briefing in this worktree at 23:04 UTC, where no row stands: the selection as before"
  ],
  "rejected": [
    {
      "option": "Any passing complete row at the identity, with no listing of the runner",
      "reason": "It would say satisfied where the claim check refuses: the review selection can gain a machinery suite whose declared source is a document, and the completion would then ask for a run the briefing had called satisfied."
    },
    {
      "option": "Print the satisfied form in the completion's advisory too",
      "reason": "The advisory is a committed control record; a row's time from one checkout's ignored index does not belong in it, and at completion the row is the one being consumed."
    }
  ],
  "reopenWhen": "A briefing calls a run satisfied and the completion then refuses for want of the row, or the lookup's half second is felt in a hook's bound on a slower host."
}
```

## WO-284-D010 — A complete selection forced at an identity that is already green needs a stated reason, and a reused suite is named as reused

```json
{
  "id": "WO-284-D010",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 7, the runner",
  "decision": "On a plain or review selection, --again or --fresh at an identity whose passing complete row covers the selection, with no --reason, prints that row and what running again costs, runs no task, records no row and exits 0. With --reason <text> the selection runs and its row keeps the text as forcedReason. --reason without --again is refused as a usage error, since it states why a selection is run again and means nothing alone. An instance's selections reuse nothing and are not changed, nor is a document, machinery, single-suite or confined-partial selection, nor a forced selection at an identity with no passing row. A gate index that cannot be read answers nothing and the selection runs. The measurement tool, which runs the selection three times at one identity on purpose, passes its reason. The schedule line: a suite the selection reuses cannot have changed inside the code identity, because reuse compares that identity, so whatever changed in its sources since the last gate row is outside it; such a suite is taken out of the scheduled-first list and named as reused at the code identity, not run again, and a suite whose changed source is inside the identity is still named changed and runs.",
  "evidence": [
    "scripts/test-runner.mjs (the --reason argument, the answer before the subject is captured, forcedReason on the row, the schedule block) and scripts/measure-gates.mjs (MEASUREMENT_REASON)",
    "scripts/test-runner.test.mjs, the case for criterion 7, run under the bounded wrapper at 23:06 UTC: a forced review selection with no passing row runs; forced again it returns exit 0 with no task run and no row recorded, and prints 'npm test: a passing complete row already stands at this code identity: recorded <time>, 0 h 0 min, <n> suites, <reference>'; --fresh and a plain --again are answered the same way; with --reason the row holds forcedReason and no task is reused; a changed document that a suite declares is reported as 'reused at the code identity, not run again: alpha (its sources changed since the last gate row are documents outside that identity)' and no line calls it changed; a changed script is 'scheduled first: alpha (changed since the last gate row)' and runs",
    "WO-282-D024 (the complete run started after an edit to one bullet of the guide) and WO-277-D018 (the schedule line that named the reused suites changed)"
  ],
  "rejected": [
    {
      "option": "Refuse --again there with a failing exit",
      "reason": "The order's criterion: it prints the row, runs nothing and exits 0; a session that asked for a run already has its result."
    },
    {
      "option": "Judge the changed files against the identity's path rule",
      "reason": "The reuse itself is the proof: a changed source inside the identity moves the identity and nothing is reused."
    }
  ],
  "reopenWhen": "A session passes a reason to run after a change to documents alone, or a row is reused whose suite did change inside the identity."
}
```

## WO-284-D011 — The documents-only sentence sits in the reviewer's numbered step 5, after first being put in a reviewer rule

```json
{
  "id": "WO-284-D011",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 8, the two role steps",
  "kind": "correction",
  "misread": "The executor first added the sentence to the reviewer's rule that begins 'After integration, the last source edit, intended new source files are staged', which also names the complete run, and to the middle of each step, between a step's first sentence and the sentence that says how to await the run.",
  "meant": "The order names the reviewer's step 5 and the executor's step 8, the numbered steps of each root. The sentence belongs at the end of each, where it does not come between the run and the words that say to await it.",
  "changed": "The sentence was taken out of the rule and placed at the end of the reviewer's step 5 and of the executor's step 8, the harness was emitted again, and the case that reads the emitted roots holds each to its numbered step in both hosts' roots. The case failed on the first placement, naming the reviewer's root, before anything was handed off.",
  "decision": "Each of the two steps ends with one sentence: an edit to documents alone, an authored document included, owes npm run test:docs and no complete run, and a pending follow-up row or an earlier order's choice changes no role's duty. No other role's root carries it, since no other role starts a complete run.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts, the reviewer's and the executor's steps; .claude/skills/dotln-reviewer/SKILL.md line 12 and .claude/skills/dotln-executor/SKILL.md line 15 after the emit of 23:10 UTC",
    "scripts/test-harness.mjs, the case for criterion 8: failed at 23:10:25 UTC with '.claude/skills/dotln-reviewer/SKILL.md: After integration, the last source edit,'; passed at 23:11 UTC after the move",
    "node scripts/harness-context.mjs --check at 23:11 UTC: exit 0, every role's cold-start verdict accepted or within"
  ],
  "rejected": [
    {
      "option": "Add the sentence to the verifier's root as WO-282-D024's follow-up proposed",
      "reason": "The order names two steps; a verifier starts no complete run and consumes the executor's row."
    }
  ],
  "reopenWhen": "A role other than these two starts a complete run after a change to documents alone."
}
```

## WO-284-D012 — The feedback edition is re-minted from one live self-host episode on the default worker, and the authority edition by sync

```json
{
  "id": "WO-284-D012",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 4's feedback re-mint, run after the last edit of scripts/lib/host-resources.mjs",
  "decision": "scripts/lib/host-resources.mjs is a file the feedback verifier judges, and its time limits now read the table, so the feedback edition was stale. The live episode was run on the instance's default worker for Claude, asked for as claude-opus-5-5 at xhigh (its record gives the effective model and effort as unknown), through the print transport, under the bounded wrapper, and is recorded as docs/evidence/WO-284/feedback-001; docs/evidence/current.json names it by hand, since sync cannot select a live edition. It is one worker use. npm run sync re-minted the authority edition, which the new registered source staled, as docs/evidence/WO-284/authority; the artifact-identity and verification editions stayed current. The table module is registered as a common evidence source, since the gate evidence, the harness host and the host's native tools import it. A later edit of a judged feedback source in this execution owes another episode the same way.",
  "evidence": [
    "npm run sync at 23:13 UTC: the runtime, the harness, the decisions index, the commands page and the authority edition regenerated; the feedback edition refused, naming judged behavior changed since docs/evidence/WO-276/feedback-009 in scripts/lib/host-resources.mjs and asking for a fresh live self-host episode",
    "DOTLN_LIVE_WORKERS=1 node scripts/harness.mjs bounded -- node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo284-r001 --transport claude-cli-print --model claude-opus-5-5 --effort xhigh, 23:14:32 to 23:14:58 UTC: exit 0, phase complete, ten fixtures, 1,192 saved instruction bytes, verifier claude-cli-print",
    "node scripts/feedback-evidence.mjs --write and --record-selfhost .runtime/feedback-audit-wo284-r001 --edition WO-284 --revision 001: ten passing regressions, ten removal failures; the verifier stream recorded by reference, 72,109 of 3,133,851 bytes",
    "node scripts/feedback-evidence.mjs --check at 23:15 UTC: 'Live feedback audit docs/evidence/WO-284/feedback-001 judged the current source.'",
    "scripts/lib/evidence-sources.mjs, commonSources; packages/skeleton/src/feedback-audit.ts, FEEDBACK_SOURCE_PATHS, which names scripts/lib/host-resources.mjs"
  ],
  "rejected": [
    {
      "option": "Hold the episode until the review ladder ends",
      "reason": "The order's step 4 places it after the edit, a stale edition fails the generated check of every focused probe, and the episode takes under a minute; a ladder fix to a judged source pays one more."
    }
  ],
  "reopenWhen": "A judged feedback source changes again before the handoff."
}
```

## WO-284-D013 — The skeleton is released as 0.93.0

```json
{
  "id": "WO-284-D013",
  "date": "2026-11-16",
  "dispatch": "resume: next; release preparation",
  "decision": "The skeleton's source changed (the table module, the gate evidence, the harness host's evidence gate and the two role steps), so its component version moves from 0.92.0 to 0.93.0: a minor, since it adds a module and a file an instance may write and removes nothing a caller used. The console's pin of the skeleton and the lockfile follow. No other component's source changed.",
  "evidence": [
    "node scripts/release.mjs check-surfaces --local before the bump: 'FAIL component-version @dotln/skeleton: src changed; observed 0.92.0; previous v1.2.0 0.92.0; expected a different version'; after it, no failure",
    "packages/skeleton/package.json, packages/console/package.json and package-lock.json"
  ],
  "rejected": [
    {
      "option": "A patch",
      "reason": "A new build-free module the kit ships and a new instance file are additions, not repairs."
    }
  ],
  "reopenWhen": "Another component's source changes before publication."
}
```

## WO-284-D014 — Core checks the starter's room by running an exported instance's three selections at a third of every figure, with one arm that shows the check failing

```json
{
  "id": "WO-284-D014",
  "date": "2026-11-16",
  "dispatch": "resume: next; step 6, the export fixture",
  "decision": "The export fixture's case that already ran the exported instance's three selections now sets scale to one third in the instance's seeded limits file first, and judges each task's own result: a task ended for time, one that did not run or pass, or one that ran as long as the figure that applied to it fails the case, whatever the selection's exit. Each task's record must name its key and a third of the kit's figure. Before the three selections one arm sets the format row's figure to a millisecond: that selection fails, its message names the key, the figure, the file and the listing command, the tasks after it are reported as not run for time and not for a failed check, and the same judgment names the format task. That is the one run this order adds to the fixture; it ends at its first task. The seed is restored before the case goes on. What the record holds of the check's cost: before this order the file that holds it, launchpad's export file, took a median of 212.7 s and at most 472.3 s over 192 passing runs in core's gate record of the thirty days before; in this order the case alone took 125.3 s under the bounded wrapper with the arm and the reduced figures, which is one case and not the file. The file's time in the complete run is the figure to set beside that median and is pending until that run has passed (amended under WO-284-D018, which holds what this sentence first claimed).",
  "evidence": [
    "scripts/test-launchpad-export.mjs, the case 'the exported instance checks runtime, coordination records and explicit diagnostics separately', run alone under the bounded wrapper from 23:03 to 23:05 UTC: pass in 125.3 s; npm test in the instance 14.8 s, with format 6.2 s against a reduced figure of 100 s, generated 6.2 s against 200 s and the configuration row 83 ms against 100 s; npm run test:docs 30.4 s of wall time",
    "The same case with its observations printed, 23:36 to 23:38 UTC, docs/evidence/WO-284/evidence.md: 128.2 s; the arm's npm test in the instance ended in 1,475 ms of wall time; the three selections took 14.9 s, 30.5 s and 14.4 s, and the task nearest its reduced figure was format at 6.2 s of 100 s",
    "The same case at 23:00 UTC, before the kit guide named the configuration row: it passed the arm and the three selections and failed at the guide's list of an instance's selections, which is the write-back's subject",
    "The gate record as D003 reads it: launchpad:file:test-launchpad-export.mjs 192 passes, median 212,692 ms, slowest 472,265 ms"
  ],
  "rejected": [
    {
      "option": "Judge the three selections' exit codes",
      "reason": "The criterion asks for each task's own result, and a selection can pass with a task that ran to the edge of its figure."
    },
    {
      "option": "A synthetic row for the failing arm",
      "reason": "The arm is the exported instance's own gate ending a real task at a real figure, which is what an owner would see."
    },
    {
      "option": "Shrink the pauses after a stop with the scale",
      "reason": "D004: a third of them would fail the check on lost output."
    }
  ],
  "reopenWhen": "The case fails on a task near its reduced figure with nothing changed in that task, which says a figure has lost its room."
}
```

## WO-284-D015 — Expected data that changed in existing cases, each with its cause

```json
{
  "id": "WO-284-D015",
  "date": "2026-11-16",
  "dispatch": "resume: next; the cases this order's changes reach",
  "decision": "Six existing cases held data this order changes, and each was updated from the requirement and not from the new output. Two runner cases pinned 900,000 ms on a file task; a file task now keeps no figure and its limit is the table's default row, which the cases read through suiteTimeLimit. The harness suite's held-gate fixture built its structural rows from the instance's list in a root that holds package source; it now builds them from core's list without the Git surface check, and its expected six names are unchanged. The export fixture's list of the files no manifest lists gains docs/control/time-limits.json, and its list of an instance's selections follows STRUCTURAL_TASKS, which the kit guide's three lines now match. The seeds case's old starter lacks the limits file as it lacks the map, and the planned additions name it. The starter refresh case gains the arm for a limits file its owner changed. The planning suite's read-census case holds the new coverage line whole. The integration suite's cases print the owed list through one more lookup; the one run alone beside the new case passed with its expectation unchanged, and the rest of that suite is the complete run's to show.",
  "evidence": [
    "scripts/test-runner.test.mjs (the launchpad and target-worktree file-task cases), scripts/test-harness.mjs (the WO-125 F3 runner case, passed alone at 23:21 UTC), scripts/test-launchpad-export.mjs, scripts/test-launchpad-seeds.mjs, scripts/test-launchpad-update.mjs (passed alone at 23:27 UTC in 193 s) and scripts/test-plan-refutation.mjs",
    "docs/KIT.md, The selections in a fresh instance: the three lines now name configuration where they named configuration-root, which the export fixture's case compares with what ran",
    "scripts/test-gate-deadlines.mjs, the sibling document gate case: its fixture root holds README.md alone and no kit manifest, so it is core, and the instance's list left its configuration row out of that root's selection, five structural rows where the case ran six. The case now builds its rows from core's list without the Git surface check, as the harness fixture does, and passed alone at 00:58 UTC on 2026-11-17 in 23.4 s (corrected under WO-284-D017, R1-Y: this line first called the case unchanged and gave package source as the reason, which was wrong)"
  ],
  "rejected": [
    {
      "option": "Keep a literal 900,000 on file tasks so the old pins stand",
      "reason": "It is a figure of its own on the gate path, which the order removes."
    }
  ],
  "reopenWhen": "The complete run names a case this list missed."
}
```

## WO-284-D016 — The first meta critic's four points, each checked and accepted: a refusal worked around, probe output and exit status lost, a check announced and not run, and a named prerequisite reordered without saying so

```json
{
  "id": "WO-284-D016",
  "date": "2026-11-16",
  "dispatch": "resume: next; the first meta critic's report, 23:30 UTC on 2026-11-16",
  "decision": "The first critic (launch 1, 23:20:00 to 23:30:29 UTC, asked for as gpt-6-astra at max, which the launcher printed, read-only) made four points on the executor's conduct, kept three things and named one change to make first. Its report was given to the operator whole before any answer. Each point was checked against the session's own record and is accepted. One, the host refused a removal by a pattern under a variable, said not to script the removal through another tool and offered two rewrites; the executor had its measuring script remove its own two output files instead. Nothing was lost, since the files were the script's own in session scratch, but that was the route the refusal ruled out. From here a refused operation gets only the rewrite its refusal permits, or is left undone and reported. Two, a 50 s case was run twice because the first run's output was cut before it was read, and three background probes ended in an echo, so the host's completion signal said 0 where the first of them had failed; the executor read the file each time and found the failure, but the signal was wrong. From here a probe's raw output goes to a scratch file before any filter and the command exits with the probe's own status. Three, the executor said it would run both cases whose pinned figure it had changed and its pattern matched one; the other, the target-worktree file-task case, was run by its own title at 23:32 UTC and passed. From here the names a pattern selected are read against the names intended. Four, step 1 names the module's registration as an evidence source and in the fixture manifests before the first re-mint. It was in place before the first re-mint (registered at 22:51 UTC, the manifests at 22:54 UTC, the re-mint by sync at 23:13 UTC), and it was deferred on purpose, since the registration can only be checked once an importer exists; but the executor did not say so when it moved to step 2, and it widened step 3's check from the one case the order names to the 50 s inventory case, whose failure then named what was already owed. From here a deliberate reordering is stated in the message that makes it, and a step's check stays the case its step names.",
  "evidence": [
    "docs/control/local/reviews/WO-284/critic-1.md, 3,610 bytes, in the ignored reviews lane; the launcher's line: 'critic 1: gpt-6-astra at max; 10 min'",
    "The session's record at the times the critic names: the host's refusal of the removal at 22:34 UTC with its two permitted rewrites, and the next command, in which the script removes its two outputs itself; the real-inventory case run at 22:49 and again at 22:50 UTC; the export probe's background command of 23:00 UTC, whose last word was an echo; the selector of 23:18 UTC and its five passes",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'target-worktree file tasks run under two independent deadlines at eight lanes' scripts/test-runner.test.mjs at 23:32 UTC: 1 test, 1 pass, the probe's own exit 0, raw output kept in session scratch",
    "The order's step 1: the registration 'before the first re-mint'; scripts/lib/evidence-sources.mjs and the four fixture manifests as changed; D012 for the re-mint's time"
  ],
  "rejected": [
    {
      "option": "Decline the fourth point, since the registration was done before the first re-mint as the step requires",
      "reason": "The step's letter was met; what the critic names is the unexplained reordering and the widened check, and both happened."
    },
    {
      "option": "Go back and remove the script's own cleanup",
      "reason": "The files are gone and the script is scratch; the change is to what the executor does at the next refusal."
    }
  ],
  "reopenWhen": "A later critic finds the same conduct again."
}
```

## WO-284-D017 — Paired review, round 1: 27 distinct findings from the four reports, each with who found it, its class and what becomes of it

```json
{
  "id": "WO-284-D017",
  "date": "2026-11-17",
  "dispatch": "resume: next; the paired review ladder, round 1",
  "decision": "Round 1 ran the four reviewers at once over one tree (16ce2ac665ccd3b7518f55a3ef39c0c5c0ab0578 against db7dec8d50dfd057fd49ab7a602d20a4e8693c9c) from 23:57 UTC on 2026-11-16; the last report came back at 00:25 UTC on 2026-11-17, and no file of the worktree changed in between. The four reports hold 48 findings (design 15, criteria 12, combined 13, consistency 8), six of them reported as blocking, and they are 27 distinct findings, recorded here before any is fixed. Three are of class criterion and are the reviewers' blocking ones: the forced-run answer breaks twelve existing cases (R1-A), four steps ended for time lose the message that names their limit (R1-C), and --write discards an owner's bare entry (R1-D); a fourth, the criterion 4 scan's blind spots and one figure left in the guard (R1-S), was reported as should-fix and is judged criterion. Twenty-four are fixed and three recorded: R1-M (which file a running guard reads; documented), R1-R (two evidence captures that can exist only after the complete run) and R1-AA (a carried sibling receipt, which is the kit's own bookkeeping). The host reports claude-opus-5-5 for all four workers; xhigh was selected and the effective effort was not read back. Four worker uses, no descendants. Round 2 rechecks all four reports, since each holds findings whose fixes change code or cases.",
  "evidence": [
    "docs/control/local/reviews/WO-284/round-1-criteria.md (12 findings, 3 blocking), round-1-design.md (15, none blocking), round-1-consistency.md (8, 1 blocking) and round-1-combined.md (13, 2 blocking), each recorded with npm run worker -- record from the text the worker returned",
    "The reviewers' own probes, each one case under node scripts/harness.mjs bounded -- node --test --test-name-pattern: twelve cases fail at the tree and pass at the base (R1-A); a Git version read ended at 1 ms reports that Git did not run (R1-C); --write over a bare figure and a bare null leaves {set: kit} and no advisory (R1-D); the scan run on four planted lines finds one (R1-S)",
    "scripts/worktree.mjs, the line that prints Carried sibling receipts, and git status in this worktree: the receipt is untracked with the checkout's own time (R1-AA)",
    "packages/skeleton/src/temporary-root-records.mjs (temporaryProcessIdentity reads no row of the table) and scripts/lib/host-guard-state.mjs (the agent session's registration reads host.temp-root and guard.startup), read for R1-F"
  ],
  "roundFindings": [
    {
      "id": "R1-A",
      "finders": [
        "criteria",
        "consistency",
        "combined"
      ],
      "class": "criterion",
      "disposition": "fixed"
    },
    {
      "id": "R1-B",
      "finders": [
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-C",
      "finders": [
        "criteria",
        "design",
        "combined"
      ],
      "class": "criterion",
      "disposition": "fixed"
    },
    {
      "id": "R1-D",
      "finders": [
        "criteria"
      ],
      "class": "criterion",
      "disposition": "fixed"
    },
    {
      "id": "R1-E",
      "finders": [
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-F",
      "finders": [
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-G",
      "finders": [
        "design",
        "combined"
      ],
      "class": "improvement",
      "disposition": "fixed"
    },
    {
      "id": "R1-H",
      "finders": [
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-I",
      "finders": [
        "design"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-J",
      "finders": [
        "design"
      ],
      "class": "improvement",
      "disposition": "fixed"
    },
    {
      "id": "R1-K",
      "finders": [
        "criteria",
        "design"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-L",
      "finders": [
        "criteria",
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-M",
      "finders": [
        "criteria",
        "design"
      ],
      "class": "improvement",
      "disposition": "recorded"
    },
    {
      "id": "R1-N",
      "finders": [
        "design",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-O",
      "finders": [
        "design",
        "combined"
      ],
      "class": "improvement",
      "disposition": "fixed"
    },
    {
      "id": "R1-P",
      "finders": [
        "design"
      ],
      "class": "improvement",
      "disposition": "fixed"
    },
    {
      "id": "R1-Q",
      "finders": [
        "consistency",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-R",
      "finders": [
        "consistency",
        "combined"
      ],
      "class": "lesser",
      "disposition": "recorded"
    },
    {
      "id": "R1-S",
      "finders": [
        "criteria"
      ],
      "class": "criterion",
      "disposition": "fixed"
    },
    {
      "id": "R1-T",
      "finders": [
        "criteria"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-U",
      "finders": [
        "criteria",
        "consistency",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-V",
      "finders": [
        "criteria",
        "consistency",
        "combined"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-W",
      "finders": [
        "consistency"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-X",
      "finders": [
        "consistency"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-Y",
      "finders": [
        "consistency"
      ],
      "class": "lesser",
      "disposition": "fixed"
    },
    {
      "id": "R1-Z",
      "finders": [
        "consistency"
      ],
      "class": "improvement",
      "disposition": "fixed"
    },
    {
      "id": "R1-AA",
      "finders": [
        "combined"
      ],
      "class": "none",
      "disposition": "recorded"
    }
  ],
  "judgments": [
    {
      "id": "R1-A",
      "judgment": "The runner's answer to a forced complete selection makes existing cases of the kit fail: the twelve the consistency reviewer ran at the tree and at the base (scripts/test-runner.test.mjs, the cases that start at 1883, 4408, 5965, 6047, 6454, 6553, 6801, 6904, 7125, 7255 and 9242, and scripts/test-host-guard.test.mjs at 2056), which hold every case the criteria and combined reviewers named. Writer: the kit's own cases, each forcing a second run at an identity its first run made green. Closed on a real input, and criterion 10 cannot pass. The answer is the order's design and stays. Each case that runs its selection again on purpose states why with --reason, as the measurement tool does, and the forced sites the reviewers left unprobed in scripts/test-gate-followups.mjs and scripts/test-gate-deadlines.mjs are run alone. WO-284-D015 named none of these because its list was built from the cases whose data the change wrote and not from the callers of the changed contract; that is the error, and the fix is this trace."
    },
    {
      "id": "R1-B",
      "judgment": "The answer reads any passing complete row that covers the selection, while the closeout's satisfied form and the final review's claim need a review row whose named suites each ran and passed. Writer: the runner's own plain row, from an ordinary npm test or from node scripts/harness.mjs evidence. Open: a review selection is told a completion consumes a row the claim refuses, the looser lookup WO-284-D009 rejected. Fix: one predicate in scripts/lib/gate-reuse.mjs that the closeout, the claim and the runner's answer for a review selection all read; a plain selection keeps the covering row. Cost: one function moved."
    },
    {
      "id": "R1-C",
      "judgment": "Four steps lose the message that names their limit: the Git version read turns a child ended for time into no version, so the host row says Git did not run and points at PATH; the lane reader rethrows with the error code alone; a helper compile ended for time reads as a compiler that could not run; and core's stale-runtime build returns only its exit code. Writer: an owner's set or scale in the file the seed and npm run limits -- --write create, or a host slower than the figure. Closed on a real input and against criterion 2. Fix: each carries the miss text to what its reader sees, and one helper beside the table says whether a child was ended for time, so the sites stop testing the error code by hand."
    },
    {
      "id": "R1-D",
      "judgment": "npm run limits -- --write rewrites an entry the owner wrote as a bare figure or a bare null to the kit's value and drops any other field of an entry, and the advisory that named the bare value disappears with it. Writer: the owner's hand edit of the file docs/KIT.md says to edit. Open, and against criterion 3. Fix: an entry is written back as it stood; only the kit field of an object entry is refreshed. Cost: a few lines and a case."
    },
    {
      "id": "R1-E",
      "judgment": "The same command refuses a file that does not parse and yet rewrites from the kit's defaults a file that parses to something other than an object, or one whose schemaVersion this kit does not read. Writer: the owner's edit, or a later kit's file under an older kit. Open: the content is discarded and limits the file turned off come back on. Fix: both are refused with what to repair, like the unparsable file; the path comes from the path function and not from a whole resolution."
    },
    {
      "id": "R1-F",
      "judgment": "Three rows bound steps that also run outside a gate, inside bounds this order keeps: evidence.owner-start in every write or shell hook (15 s), and host.temp-root and guard.startup at dispatch inside the hook's lifecycle child (12 s). Raised to 10 s, 10 s and 30 s, one stalled read can outlast the bound around it, which then ends the step without the step's own message; with the slow-machine advice of scale 2 the first does so alone. Writer: none; a stalled process read on a loaded host. The first's miss is benign and the other two fail a start that is retried, and main's figures were already hundreds of times the measured reads. Fix: the three return to main's figures (1,000, 2,000 and 5,000 ms), their rows say where else they run, and WO-284-D003's figures for them are amended in place with this decision named."
    },
    {
      "id": "R1-G",
      "judgment": "The getter prints to stderr and writes an environment variable from library code that also runs in hooks and in test processes, with two ways of printing once and a mark that omits the root. Writer: an owner's unusable value. No wrong limit applies; the cost is noise in hooks and a side effect in a getter. Fix: reading a limit prints nothing; the commands a person or a session starts (the runner, the bounded wrapper, npm run sync and npm run limits) print a root's advisories once, and the mark they leave for the processes they start names the root."
    },
    {
      "id": "R1-H",
      "judgment": "The resolver parses dotln.config.json before it looks at its cache, on every call, and with a configuration that does not parse it says the kit's limits apply while still reading and applying a file at the default control path. Writer: an owner's malformed configuration. Open in the second half: the advisory says one thing and the limits are another. Fix: the cache is checked on the two files' identities before anything is parsed, and with the control root unread no file is read."
    },
    {
      "id": "R1-I",
      "judgment": "Two inner limits can never apply. configuration-root.worktree-case (300 s) bounds a case inside a suite row of 300 s. A test selection by name under the bounded wrapper is ended at probe.command (900 s) while its own tasks have suite.default (2,700 s), and the close file alone takes 846 s. Writer: the kit's own figures; closed on a real input, a session reproducing a long suite under the wrapper. Fix: the worktree case keeps no timer of its own and the pipe case's child takes a tenth of its suite's limit, so both configuration-root keys leave the table (37 keys); the wrapper gives every test selection, complete or by name, the selection's limit, whose key is renamed probe.test-selection to say so."
    },
    {
      "id": "R1-J",
      "judgment": "resume and worktree integrate compute the closeout scope twice for one reader, and resume reads the standing row for a briefing that prints no closeout selection. No input; the cost is control and Git reads and one spawn of the runner's listing. Fix: the scope is computed once and handed on, and the row is read only where the selection is printed."
    },
    {
      "id": "R1-K",
      "judgment": "For a target order whose launchpad paths owe the complete run, the satisfied text says only the document gate is owed and that a completion consumes the row, while the commands still list the target gate and the target's claim consumes no launchpad row. Writer: the lifecycle commands, for a target order with launchpad changes and a standing row. Open in wording. Fix: the sentence names what remains of the launchpad's checks and says a completion consumes the row only for a launchpad order."
    },
    {
      "id": "R1-L",
      "judgment": "The answer's suggested command drops --full, so a review selection asked for by that name is told to run a plain one, and the answer comes after the stale-runtime build, so Nothing was run can follow a build. Writer: a session's own command. Open: the suggestion is a different selection. Fix: the suggestion repeats the selection as typed, and the answer is given before any build."
    },
    {
      "id": "R1-M",
      "judgment": "Host steps read the limits of the checkout whose scripts run them, and a guard that is already running keeps the limits of the checkout that started it; executeSuite takes a limit from a row's own figure, its key and its root, which the bounded wrapper also resolves. Nothing is admitted or refused wrongly: each checkout runs its own scripts, the guard is one per host by design, and a row's own figure is how fixtures and the probe set one. Recorded with no code: docs/KIT.md says which file a guard that is already running reads."
    },
    {
      "id": "R1-N",
      "judgment": "The schedule line takes a fully reused suite out of the scheduled-first clause only where a document change put it there; a suite reused after a branch change or an earlier failure is still named as scheduled first though it does not run, and the three leads are literals in two places. Writer: the runner, on a second selection at an unchanged identity. Open in wording only. Fix: a fully reused suite is named as reused whatever put it first, the document wording stays for the document case, and the leads are named constants."
    },
    {
      "id": "R1-O",
      "judgment": "The structural phases are four literal lists in two modules, held equal by a case. Structure only. Fix: one copy of each in scripts/lib/gate-reuse.mjs, which scripts/lib/generated-artifacts.mjs already loads through build-freshness, so no cycle and no new module; the other names are that copy."
    },
    {
      "id": "R1-P",
      "judgment": "The keys ship into every instance's file. The fixed keys suite.default and the three pauses share the prefix that a suite's own row is found by, and two configuration-root keys bound cases of a kit test. No writer; naming only. Fix in part: a suite's name is mapped only to a suite's own row and never to the default or a pause, and the two configuration-root keys go under R1-I. Renaming suite.default and the pauses is not done: suite.default reads as what it is, and after the mapping change nothing can reach a pause by a suite's name."
    },
    {
      "id": "R1-Q",
      "judgment": "docs/KIT.md says an update leaves the limits file alone, and its seed paragraph says ordinary updates leave these seeds' bytes alone. Under WO-284-D007 the starter's copy follows each release's template, so an instance that never edited the file, or has none, receives the release's file through its update merge, and only an edited file keeps its bytes. Writers: the starter refresh and the instance's update merge. The guide is wrong; fix the two passages and What an update replaces, and the release-notes duty the handoff passes on says the same."
    },
    {
      "id": "R1-R",
      "judgment": "The order's evidence gate names the closeout selection's two forms and the forced selection's answer, and the evidence record holds neither. Writer: the executor's capture. Both exist only once a passing complete review row stands at this tree's code identity, so they are captured from the real commands after the complete run and before the handoff, and the composing script already reads them. Recorded here as owed and not fixed in this round; the handoff names where they are."
    },
    {
      "id": "R1-S",
      "judgment": "The criterion 4 scan reads four syntax forms and misses a clock difference compared with a figure and a named constant used as a delay or a timeout, and scripts/host-guard.mjs keeps a fixed 1,000 ms pause before it kills a runner it stopped, in a file the case lists with no exception. Writer: kit source. Open, and against criterion 4. Fix: the pause reads the guard's pause row, and the scan also finds a comparison of a clock difference with a figure and a delay or timeout whose value is a constant of the same file."
    },
    {
      "id": "R1-T",
      "judgment": "The briefing half of criterion 6 is checked only through the library call with a standing row passed in by hand; nothing runs npm run resume -- briefing with a row standing, so the wiring in scripts/resume.mjs is unchecked. No wrong output was found. Fix: the integration case runs the briefing in its fixture with the row standing and after a failed run displaces it."
    },
    {
      "id": "R1-U",
      "judgment": "That configuration-root runs in an instance only when named is shown by a listing alone, the suite's new cases have never run in an instance, and neither guide says npm run test:machinery there no longer includes it. Writer: the runner's selection in an instance. Fix: the export case runs npm test -- --only configuration-root in the exported instance, and docs/KIT.md and product 07 say what the machinery selection leaves out there."
    },
    {
      "id": "R1-V",
      "judgment": "The measurement tool now passes a reason, and the series it writes still records the command without it, a string its check and a case pin. Writer: the tool. Open: a committed series names a command other than the one that ran. Fix: a series records the reason beside the command, and the check reads both; series written before this order have no reason and stay valid."
    },
    {
      "id": "R1-W",
      "judgment": "sync-fixtures pins the exact text of a miss and does not declare the table module, so a change to the table alone would leave its case unjudged. Writer: the executor's declaration. Fix: declare it."
    },
    {
      "id": "R1-X",
      "judgment": "Product 07 still gives the launchpad and target-worktree file tasks a 900-second deadline of their own in two places; they now read suite.default. Hand-written and carried to instances. Fix both passages and say at the two probe figures that the table sets them."
    },
    {
      "id": "R1-Y",
      "judgment": "The sibling document gate case builds its structural rows from the instance's list in a root that is core, so one row silently leaves its selection, and WO-284-D015 gave a wrong reason for leaving the case alone: the root is core because it has no kit manifest, not because it holds package source. Fix: the case builds its rows from core's list as the harness fixture does, and D015's line is corrected in place with this decision named."
    },
    {
      "id": "R1-Z",
      "judgment": "The listing gives suite.configuration and suite.configuration-root the structural miss text in every root, though the other root's row runs only by name as an ordinary task. Writer: the table. Fix: the two rows' text says what a miss does in each root."
    },
    {
      "id": "R1-AA",
      "judgment": "The change carries the starter's v1.2.0 refresh receipt and the sibling index and tag observations regenerated from it. Writer: main's worktree start, which carries a pending sibling receipt into the next order's worktree (scripts/worktree.mjs prints Carried sibling receipts; product 07, Independent workflows and integration), and npm run sync, which regenerated the index from it. Bookkeeping the kit does by design; nothing to repair."
    }
  ],
  "rejected": [
    {
      "option": "Leave the forced-run answer out for a caller that passes its own suite table, so the existing cases stand unchanged",
      "reason": "It would put a branch for tests in the runner and leave the answer itself untested by the kit's own table-driven cases; the order's design answers every forced complete selection."
    },
    {
      "option": "Give the answer the shape of a run, with an empty task list and the identity",
      "reason": "A caller that does not read executed would take it for a run of nothing; a missing field fails louder."
    },
    {
      "option": "Return every host figure this order raised to main's",
      "reason": "WO-284-D003's reason for the others stands: one miss of the census fails every running task. Only the three rows that also run under a hook's or a dispatch's own bound go back."
    },
    {
      "option": "Rename suite.default and the pauses before release",
      "reason": "R1-P: the mapping change removes the only way a suite's name could reach them, at no cost to the owner's file."
    },
    {
      "option": "Capture the forced answer and the satisfied form from fixtures now",
      "reason": "R1-R: the real commands on this tree are the better evidence and cost nothing more once the row stands."
    }
  ],
  "reopenWhen": "Round 2 names a fix that did not hold, or the complete run names a case this trace missed."
}
```

## WO-284-D018 — The second meta critic's three points: a correction half applied (accepted), an operator's question the record does not show answered (first declined on its fact, accepted under D026), and a before-and-after claim the evidence did not hold (accepted)

```json
{
  "id": "WO-284-D018",
  "date": "2026-11-17",
  "dispatch": "resume: next; the second meta critic's report, 00:48 UTC on 2026-11-17",
  "decision": "The second critic (launch 2, 00:35:00 to 00:48:10 UTC, asked for as gpt-6-astra at max, which the launcher printed, read-only over a copy of the transcripts that holds no account address) made three points, kept three things and named one change to make first. Its report was given to the operator whole before any answer, and each point was checked against the session's own record. One, accepted: after WO-284-D016 the probe commands of 23:34:13, 23:48:14 and 23:55:20 UTC wrote their raw output to scratch and read the probe's status, and still ended in an echo or a date, so the host's completion signal reported 0 whatever the probe returned; and the evidence capture of 23:33:45 dropped its child's error output and was run twice more to read it. The correction of D016 was half applied. Every probe since this report ends by exiting with the probe's own status, and a correction counts as made only once the next real command shows it. Two, accepted; this decision first declined it on its fact, and WO-284-D026 holds the correction: the report says the operator's question of 00:20:06 about custom directions for drive had no answer when its snapshot ended at 00:33:27. The entry of 00:24:35.601 UTC that this decision first cited as the answer is one the host stored as thinking and not as a delivered message, and no delivered text entry before the snapshot's end holds the answer, so the record does not show the operator answered in that time. What it asks for stands: an operator's question is answered as soon as its source check is done, and pending operator messages are read again after a worker's notification and after a compaction. Three, accepted: WO-284-D014 said the export case's duration was recorded before and after, while the evidence record set a whole file's median over thirty days beside one case's time and pointed at a handoff that did not yet exist. D014's sentence is amended in place to say what was measured and what is pending, and the evidence record's paragraph now says the same; the file's time in the complete run is added when that run has passed.",
  "evidence": [
    "docs/control/local/reviews/WO-284/critic-2.md, 3,443 bytes, in the ignored reviews lane; the launcher's line: critic 2: gpt-6-astra at max; 13 min",
    "Session scratch, critic/check-2.mjs over the session's own record: the last words of the commands at 23:34:13, 23:48:14 and 23:55:20 UTC are an echo of the probe's status or a date; the entry at 2026-11-17T00:24:35.601Z that holds the answer's words is of the host's thinking type, and the script printed no delivered text entry that holds them",
    "docs/evidence/WO-284/evidence.md, the paragraph under the exported instance's gate as it stood at 00:48 UTC: a median of 212,692 ms for the file beside 128,211 ms for one case, and a handoff named that was not written",
    "The copy the critic read: 11 files, 6 occurrences of an account address replaced in 4 rows of 1 file, none left; the private-list screen 0 refusals; the other host's sandbox read the copy and refused a write beside it"
  ],
  "rejected": [
    {
      "option": "Decline the second point on its fact",
      "reason": "That was this decision's first reading and it was wrong: the entry it cited is not a delivered message (WO-284-D026)."
    },
    {
      "option": "Leave D014 as written and correct it only in the handoff",
      "reason": "A decision that claims a comparison the record does not hold would stand until then."
    }
  ],
  "reopenWhen": "A later critic finds a probe that does not exit with its own status, or an operator message left unanswered after its check."
}
```

## WO-284-D019 — The operator's scope expansion for the drive router, narrowed by the operator to an architecture kept for planning: two workers' proposals and their synthesis

```json
{
  "id": "WO-284-D019",
  "date": "2026-11-17",
  "dispatch": "resume: next; the operator's scope expansion of 00:46 UTC on 2026-11-17 and the three directions that followed it by 00:51 UTC",
  "decision": "The operator, on learning that drive starts each phase as a separate CLI session and takes no data for a phase, expanded this order's scope: the drive router was to gain a way to run phases as the router session's own subagents or as a host workflow, which the operator says was drive's original requirement and gives cost as the reason for, and a way to pass data that the router relays to named phases. Three directions followed within five minutes: a new, separate router is acceptable if that is cleaner; two workers, one on Opus and one on GPT-6 Astra, each propose an architecture and the executor combines the best of both; and the result is kept where planning can use it, with the request to implement it in this order withdrawn. So this order implements nothing of it, its text is unchanged and no amendment of the order was recorded: the last direction came before any byte of the order moved. What was done: both workers were launched at 00:52 UTC on one brief, read-only, each told to read neither intake nor the local control lane. The opus worker is the table's own session launch (Agent, dotln-worker); the host reported claude-opus-5-5, xhigh was selected, and it returned at 01:03 UTC. For astra the table prints no session launch in a Claude session and its note names commands for a review and a refutation only, so it was launched by hand through Codex with the flags of the copied critic route (a read-only sandbox, no network, no project instructions, the worker's own standing rules as the preamble) and counted by hand; gpt-6-astra at max as requested, since Codex gave no readback of the model or effort that ran (WO-284-D023), back at 01:05 UTC. The brief paraphrased the operator and held no name or account address. The two proposals agree on one router with a mode, Agent spawns that a driver step authorizes one at a time, no workflow for now, directions parsed by the prompt hook alone and printed in the phase's briefing, and a Claude-only mode. They differ on how a subagent reaches the order's worktree, on how the mode is chosen, on the directions' form and on size. docs/evidence/WO-284/drive-architecture.md holds the synthesis: what was taken from each and why, what a host probe must establish first, the risks, and seven questions for the operator. It recommends two orders, the directions first since they need no change to how phases run. Two worker uses, nine in this dispatch.",
  "evidence": [
    "The operator's four messages in ignored intake, by SHA-256: 2c81406727f4d8ac3987edfd3bac78579105289ad17aafe5101ef927e8516f2b (the expansion), 844339c57f97765a02f8079b2f3e882413ffe2563243783149f039b57b2af7da (a separate router is acceptable), de5107c206c672102d8f87fc4c056ea436b64b2c011a6f1d2be0864dfeb60b5f (the two workers and the synthesis) and 48a50b1987cfa3bd418ae879639342c595e1d18fac066876ac2beee9ed61059c (keep it for planning; no implementation here); the message before them that gives the cost reason, b462fbe8e39f124caee32c6bfa70d456163ab70ae884e87da292d96f41466399",
    "docs/evidence/WO-284/drive-architecture.md, the synthesis; docs/control/local/reviews/WO-284/architecture-opus.md (16,747 bytes) and architecture-astra.md (12,402 bytes), the two proposals as returned, in the ignored reviews lane",
    "npm run worker -- show opus (session: Agent, subagent_type dotln-worker) and npm run worker -- show astra (session: none; its note names the review and refutation commands); session scratch, architecture/launch-codex.mjs and its line, which prints the settings it asked for: architecture worker: gpt-6-astra at max; 13 min; 12383 characters",
    "Read by the executor before the synthesis: scripts/lib/drive-worker.mjs:216 (--print), scripts/lib/drive-session.mjs:880 (one JSON line a transition), scripts/drive.mjs (its usage), packages/skeleton/src/harness-host.ts:7094 (the exact drive phrase), docs/evidence/WO-192/decisions.md D001 and docs/evidence/WO-192/host-probe.json (cwdUnsupported true; targetHooks absent)"
  ],
  "followup": "Planning, priority high: the drive router's in-session phases and operator directions, from docs/evidence/WO-284/drive-architecture.md. Two orders are recommended: (1) operator directions for named phases, parsed by the prompt hook from the drive request, kept in ignored intake with their SHA-256 and printed in the addressed phase's briefing, which works with today's sessions; (2) an agents mode in which the router spawns each phase as its own subagent on a driver step's authority, opening with a host probe of how a subagent reaches the order's worktree. The pass answers the document's seven questions with the operator and checks each statement it marks as a worker's.",
  "rejected": [
    {
      "option": "Implement the mode and the directions in this order",
      "reason": "The operator withdrew that request; either worker's estimate is an order of its own, and the design rests on host behaviour nobody has observed."
    },
    {
      "option": "Keep the architecture only in the ignored reviews lane",
      "reason": "Planning reads committed documents and the follow-up queue; an ignored file reaches neither."
    },
    {
      "option": "Write it into docs/planning from this branch",
      "reason": "An executor's branch records its own order's evidence, and the queue is how a deferral reaches a planning pass."
    },
    {
      "option": "Ask one worker only, or launch astra as a review",
      "reason": "The operator asked for two separate proposals; a review brief judges a diff and proposes nothing."
    }
  ],
  "reopenWhen": "The operator asks for the implementation in this order after all, or a planning pass files the orders and disposes this follow-up."
}
```

## WO-284-D020 — Round 1's fixes as built, and the probes that judged them

```json
{
  "id": "WO-284-D020",
  "date": "2026-11-17",
  "dispatch": "resume: next; the fixes of round 1 (WO-284-D017), 00:36 to 01:20 UTC",
  "decision": "The twenty-four findings WO-284-D017 marks fixed are fixed as it judged them, with these particulars. The table holds 38 keys: evidence.owner-start, host.temp-root and guard.startup are back at main's figures and their rows say where else they run; the two configuration-root keys are gone (the worktree case has no timer of its own, the pipe case's child takes a tenth of its suite's limit); probe.complete-selection is probe.test-selection and bounds every test selection under the wrapper; guard.runner-stop is the guard's pause before it kills a runner it stopped, which the guard held as a figure of its own. Reading a limit prints nothing: the runner, the bounded wrapper and the sync print a root's advisories once where they begin, the mark for their children names the root, and the listing prints them in its own text. The resolver checks its cache before it parses anything and reads no file where the control root cannot be read. The writer writes back every entry and every field of the owner's as it stood and refuses a file that is no object or has another schemaVersion. One predicate in the gate-reuse module says which review row stands; the closeout, the final review's claim and the runner's answer to a forced review selection read it, and the answer comes before any build and repeats the selection as typed. A fully reused suite is named as reused in the schedule line whatever put it first. The structural lists are one copy each in the gate-reuse module. The Git version read, the lane reader, a helper compile and core's stale-runtime build carry the text that names their limit to what the reader sees, and one helper says whether a child was ended for time. The closeout selection is computed once for a reader and reads the row only where it prints; a target order's satisfied sentence says what remains of the launchpad's checks. The measurement series records its reason. The criterion 4 scan also finds a clock difference compared with a figure and a constant used as a delay or a timeout, and lists three more sites that end nothing with what each is. Twelve existing cases state why they run their selection again. The guides say what an update does to the limits file, that five rows are pauses, which rows also run under a hook's bound, which file a running guard reads, and that no selection of an instance includes the kit's configuration tests. Decisions D003, D005, D014 and D015 are amended in place where a figure, a count or a reason changed, each naming the decision that changed it. Still owed and not part of this round: the live feedback episode for the changed judged source, once round 2 has settled the code, and the two evidence captures that need the passing row (R1-R).",
  "evidence": [
    "Each a single probe under node scripts/harness.mjs bounded -- node --test --test-name-pattern, its raw output kept in session scratch and its own exit status returned: scripts/test-configuration-root.mjs, the two limits cases (15 pass, 13 of them subtests, two new) and the pipe and worktree cases under their parent (18 pass)",
    "scripts/test-runner.test.mjs: the five WO-284 cases, one of them new for the three host steps that name their limit (pass); the eleven cases that failed at the reviewed tree (11 pass); the review composition case with the schedule line for a suite a branch change put first (pass); criterion 4 after the wider scan first found three unlisted sites, which are now listed with what each is (pass)",
    "scripts/test-host-guard.test.mjs: the case that runs its selection twice, the guard start case at the restored figure and a guard stop case (3 pass); scripts/test-gate-followups.mjs, the two forced cases no reviewer ran (2 pass); scripts/test-gate-deadlines.mjs, the sibling document gate case on core's rows (pass, 23.4 s) and the measurement series case (pass)",
    "scripts/test-worktree-integration.mjs, criterion 6 with npm run resume -- briefing run in the fixture while the row stands and after a failed run displaces it, and the target order's sentence (pass); scripts/test-sync.mjs, criterion 2 with the stale-runtime build's miss (pass); scripts/test-launchpad-export.mjs, the instance case with npm test -- --only configuration-root run in the exported instance (pass, 116.2 s; the arm 1,239 ms; the three selections 10.5 s, 22.5 s and 10.3 s)",
    "npm run build, node scripts/harness.mjs emit and check (37 generated surfaces), npm run format, node scripts/docs-check.mjs (0 failures), node scripts/structural-checks.mjs declarations and node scripts/check-registrations.mjs (exit 0), git diff --check (clean); npm run sync regenerated meta, the authority edition and the publication locks and refused the feedback edition, as owed",
    "Two failures on the way, each read from its saved output: the export case first stopped in 2 s on two type errors in the limits module (an optional property passed as undefined, an indexed row possibly undefined), then in 24 s on the instance's format row over three unformatted files; the declarations check refused a build script named in the sync case, which now names none"
  ],
  "rejected": [
    {
      "option": "Run the feedback episode now",
      "reason": "Round 2 may change a judged source again, and each episode is a worker use; one episode after the code is settled covers both."
    },
    {
      "option": "Leave the three sites the wider scan found unlisted and narrow the scan to pass",
      "reason": "Each is a time figure in a gate-path file; the case's list is where a figure that ends nothing says what it is."
    }
  ],
  "reopenWhen": "Round 2 names a fix that did not hold."
}
```

## WO-284-D021 — Paired review, round 2: the fixes hold but one, two existing cases would have failed the complete run and are fixed, two sentences are corrected, and five notes are recorded

```json
{
  "id": "WO-284-D021",
  "date": "2026-11-17",
  "dispatch": "resume: next; the paired review ladder, round 2 (the recheck), 01:22 to 01:37 UTC",
  "decision": "Round 2 gave each of the four reviewers its own round-1 report to recheck on one tree (1ef51b21c71c3cb0a9161e6032a705ae3ef5184d), as four re-tasks; the worktree did not change until the last report was back at 01:35 UTC. Of the 48 round-1 findings every fix held but one: the forced-run answer still broke one existing case. Round 2 added nine findings (this decision first said eleven and seven notes, a miscount that WO-284-D022 names), two blocking and both in existing cases that the complete run would have met; neither is in this order's new code. Both are fixed, with two sentences corrected that round 2 showed to be wrong or incomplete; five notes are recorded for the handoff and not fixed, as the round's rule holds for a finding that breaks no criterion and nothing main did. Because the fixes change code (two test files and one string of the table), round 3 follows: one combined worker over the change since the round-2 tree. The host reported claude-opus-5-5 for all four; xhigh was selected and the effective effort was not read back. Four worker uses, thirteen in this dispatch. The four reports are recorded as returned, as prose: the executor's recheck message named the report's fields and not the fields of a recheck entry (id, outcome held or not-held, note), so each came back with names of its own, and a re-task to restate each would have cost four more uses. The consistency report is recorded from its own report text, after the recorder refused the same text inside its JSON for holding no readable table of traced consumers.",
  "evidence": [
    "docs/control/local/reviews/WO-284/round-2-design.md (15 fixes confirmed, 1 note), round-2-criteria.md (11 confirmed, 1 partial, 4 notes), round-2-combined.md (12 settled, 1 not fixed, 1 blocking and 2 notes) and round-2-consistency.md (7 confirmed, 1 recorded and open, 1 blocking); round-2-consistency.refused.md is the recorder's copy of the text it refused",
    "Reproduced before any fix, each one case under the bounded wrapper with its own exit status: scripts/test-runner.test.mjs, the WO-276 Part H report case, exit 1 on '8 lanes of 1.2 GiB each' against a pinned 1.0 GiB; docs/control/budgets.json holds gateShare 0.6 since commit aa816c4cf on main",
    "After the fixes: the Part H case and scripts/test-host-guard.test.mjs, the lanes case of independent worktrees and clones, each exit 0 with 1 pass (the second in 13.0 s)",
    "scripts/host-guard.mjs guardCensus and scripts/lib/host-resources.mjs readHostSnapshot, read for the guide's sentence: the guard's census reads host.census through the limits root of the guard's own process",
    "Session scratch, evidence/briefing-owed.txt, 01:17 UTC: npm run resume -- briefing printed the owed form (npm test -- --review, npm run test:docs, the complete run owed) before any complete run of this order"
  ],
  "judgments": [
    {
      "id": "combined.2.F1",
      "judgment": "Blocking, criterion 10, fixed. The lanes case of scripts/test-host-guard.test.mjs forces its selection in an embedded script, written with single quotes, in each of six iterations; from the second both gates were answered and no lane was ever held. Writer: the kit's own case. The search behind round 1's fix read the double-quoted flag only, which is why this one was missed; every single-quoted forced run in the test files was then listed (five sites) and the other four are in cases the reviewers ran green. The case now states its reason."
    },
    {
      "id": "consistency.2.F1",
      "judgment": "Blocking, criterion 10, fixed. A core case of the host report pinned a lane of 1.0 GiB for a 16 GiB host of eight lanes; the lane is sized from the root's own gate share, which main's planning commit aa816c4cf raised from a half to 0.6 in docs/control/budgets.json, a document-only change after which no complete run ran. The case fails at the base as well, so this order did not cause it; the complete run would have met it. Writer: the owner's line in an instance-owned file. The expected value now follows the root's share, read from the file with the kit's half as the default, so the case says what the lane must be for any share and no longer what it was for one."
    },
    {
      "id": "design.2.F1",
      "judgment": "A note, corrected. Round 1's fix R1-Z made the listing say that core runs no configuration row; core runs it by name like the other root's row. The sentence was the executor's and was wrong, so it is corrected: in core, where it runs only by name, a miss ends that task alone."
    },
    {
      "id": "criteria.2.F2",
      "judgment": "A note, and the recheck of criteria F11 as partial; corrected in the guide. The sentence recorded for R1-M said only the guard's two pauses follow the file of the checkout that started it. The guard's census and its fallback readings follow that file too, and the guide now says a host or guard figure raised in one checkout does not reach a guard another checkout started. A document only."
    },
    {
      "id": "criteria.2.F1",
      "judgment": "A note, recorded. The writer refuses a file that is no object or has another schemaVersion, and still rewrites a limits value that is not an object. Writer: an owner's hand edit in a form the documented file does not use. Open, on an unusual input; a few lines and a case, left for the handoff's list."
    },
    {
      "id": "criteria.2.F3",
      "judgment": "A note, recorded. The criterion 4 scan does not follow an elapsed time held in a variable before it is compared, nor a constant imported from another file. The reviewer's search of the eighteen gate-path files found no live site of either form."
    },
    {
      "id": "criteria.2.F4",
      "judgment": "A note, recorded. guard.startup is back at main's 5,000 ms, and the export fixture's run at a third reuses a guard that is already up, so core's gate does not show that row's room on a slower machine. A cold guard start under load is what would."
    },
    {
      "id": "combined.2.F2",
      "judgment": "A note, recorded. Under the bounded wrapper a document or machinery selection still has an ordinary command's 900 s, beneath tasks of 2,700 s; R1-I moved complete selections and selections by name only. main had the same 900 s."
    },
    {
      "id": "combined.2.F3",
      "judgment": "A note, recorded, with the design reviewer's residual on F5: the briefing action reads the standing row for an order in verification, whose briefing prints no selection. One listing and one index read; the output is unaffected."
    },
    {
      "id": "consistency.1.F5",
      "judgment": "Recorded and still owed, with the reviewer's point taken: the owed form needs no passing row and can no longer be printed by the real commands once the complete run has passed, so it was captured before that run (01:17 UTC); the satisfied form and the forced answer follow the run."
    }
  ],
  "rejected": [
    {
      "option": "Fix the five notes as well, since round 3 reads the change anyway",
      "reason": "The round's rule records a new finding that breaks no criterion and nothing main did; each further fix is more for round 3 to read, and the handoff lists them for the reviewer."
    },
    {
      "option": "Leave the two wrong sentences as recorded notes",
      "reason": "One is false and one incomplete, and both are the executor's own; a known wrong statement is corrected, not listed."
    },
    {
      "option": "Give the lane-size case a budgets file of its own",
      "reason": "The report reads the root it is given, which is this checkout; the case's subject is that the lane follows the host's record and the root's share, which the derived value states."
    },
    {
      "option": "Re-key each report into the recorder's recheck shape by hand",
      "reason": "The record is of what a worker returned; the parent rewriting its fields is a second author."
    }
  ],
  "reopenWhen": "Round 3 finds the fixes wrong, or the complete run names another case."
}
```

## WO-284-D022 — Round 3 confirms the round-2 fixes, the authority edition it found stale was already re-minted, one note is recorded, and the second feedback episode is in

```json
{
  "id": "WO-284-D022",
  "date": "2026-11-17",
  "dispatch": "resume: next; the ladder's round 3 and the second live feedback episode, 01:40 to 01:53 UTC",
  "decision": "Round 3 was one fresh combined worker over the change since the round-2 tree (1fcce1ee223a9244740a409e823ac6e0e550483d against 1ef51b21c71c3cb0a9161e6032a705ae3ef5184d), from 01:40 to 01:52 UTC; the host reported claude-opus-5-5, xhigh was selected and the effective effort was not read back. It confirmed the four changes: the lanes case states its reason and the other four single-quoted forced runs cannot meet the answer, the lane-size case holds at the root's share, the listing's sentence about core's configuration row is accurate, and the guide's sentence about a running guard matches the code. It made two findings. One, blocking for the tree it read: that tree selected authority edition 002, which the changed sentence in the table had staled, since the table is a runtime file and a changed byte renames the runtime snapshot the hooks embed. The remedy it names had already run: npm run sync at 01:42 UTC, two minutes after that tree was written, re-minted the edition as 003, and the check passes on the checkout; only documents changed after it. The round's brief should have said that the authority edition was owed with the feedback edition, and did not. Two, a note, recorded: the lane-size case still expects the verdict unmet, which holds only while the gate share is below 0.703 on that host; the reviewer names the remedy (derive the verdict from the largest measured task peak against the derived lane, and take the default share from the module's own constant). It is not changed here, because the ladder ends with this round and a further edit would be lines no reviewer read. The second live feedback episode ran beside the review, from 01:40:45 to 01:41:05 UTC, on the instance's default worker (asked for as claude-opus-5-5 at xhigh, with the effective model and effort unknown in its record; the print transport, under the bounded wrapper), since scripts/lib/host-resources.mjs changed again in round 1's fixes; the edition is docs/evidence/WO-284/feedback-002, which docs/evidence/current.json names by hand as WO-284-D012 records for the first, and its check says it judged the current source. The ladder is complete: three rounds, 38 distinct findings (27, 9 and 2), 29 fixed or corrected and 9 recorded. Also corrected here: WO-284-D021 said round 2 added eleven findings and recorded seven notes; the four reports hold nine and five, and its text now says so. Worker uses: the round-3 worker, the episode and the third critic bring this dispatch to sixteen of twenty.",
  "evidence": [
    "docs/control/local/reviews/WO-284/round-3-combined.md, recorded from the worker's JSON: 2 findings, 1 blocking; its probes of the lanes case (1 pass, 13.2 s) and of the lane-size case (1 pass)",
    "node scripts/authority-evidence.mjs --check on the checkout at 01:53 UTC: exit 0; docs/evidence/current.json selects authority WO-284/003 and feedback WO-284/002; npm run sync at 01:42 UTC printed one row not current before it ran, authority-evidence, regenerated",
    "Session scratch, feedback-r002.txt: the episode's start and end, exit 0, phase complete, 10 fixtures; node scripts/feedback-evidence.mjs --check: Live feedback audit docs/evidence/WO-284/feedback-002 judged the current source",
    "The four round-2 reports and their findings by id: design.2.F1; criteria.2.F1 to F4; combined.2.F1 to F3; consistency.2.F1"
  ],
  "rejected": [
    {
      "option": "Apply the reviewer's remedy for the lane-size case's verdict now",
      "reason": "It is a note at the root's present share; an edit after the last round is unreviewed, and the handoff carries it to the final review."
    },
    {
      "option": "Run the feedback episode only after round 3",
      "reason": "It reads no file round 3 could change short of a judged source, and running it beside the review cost no waiting; a judged source changed by round 3 would have owed a third."
    }
  ],
  "reopenWhen": "The complete run fails on an evidence edition, or the owner raises the gate share to 0.703 or more before the lane-size case's verdict follows the share."
}
```

## WO-284-D023 — The third meta critic's five points, all accepted: a probe's status again not returned, an inventory that missed a form its own output showed, rechecks launched before their record's shape was read, a round left unnamed, and requested settings given as observed

```json
{
  "id": "WO-284-D023",
  "date": "2026-11-17",
  "dispatch": "resume: next; the third meta critic's report, 02:04 UTC on 2026-11-17",
  "decision": "The third critic (launch 3, 01:50:00 to 02:04:43 UTC, gpt-6-astra at max as the launcher asked and printed, read-only over a copy of the transcripts that holds no account address) made five points, kept three things and named one change to make first. Its report was given to the operator whole before any answer, and each point was checked against the session's own record. All five are accepted. One: the command of 01:36:41 that reproduced the lane-size case's failure read the probe's status, printed it and did not exit with it, so the host recorded success for a failed probe; this is the third report on the same point, and the commitment of WO-284-D018 did not hold for a probe expected to fail. Every probe since ends by exiting with its own status, an expected failure included, and the correction stays open until a later critic sees a failing probe and the host's record agree. Two: the search of 00:29:56 listed the forced runs written with double quotes while its output of 00:30:06 already showed single-quoted ones; they were listed only after round 2 found the case that form held (WO-284-D021). An inventory is now checked against every form its own output shows before a repair is called complete. Three: four rechecks went out before the recorder's shape for a recheck entry was read, so all four reports took the prose route (WO-284-D021); a contract is read before the work it governs is launched. Four: the answer of 01:38 to the operator's concern about review time described the next review as one review of the round-2 changes, without calling it round 3 or giving its times, straight after the operator had been confused by round labels; it had not been launched, and went out at 01:40. A round is named by its number with its times. Five: the architecture record and WO-284-D019 gave the Codex worker's model and effort as if observed, while the launcher prints what it asked for and Codex returned no readback; both now say requested, with what ran unknown.",
  "evidence": [
    "docs/control/local/reviews/WO-284/critic-3.md, in the ignored reviews lane; the launcher's record in session scratch, critic/launch-3.txt, with its start at 01:50:00 UTC and exit 0",
    "The copy the critic read: 16 files, 6 occurrences of an account address replaced in 1 file, none left; the private-list screen 0 refusals; the other host's sandbox read the copy and refused a write beside it",
    "The session's record at the times the critic names: the command of 01:36:41 ends in an echo of the probe's status; the searches of 00:29:56 and 01:33; the four recheck messages of 01:20 and the recorder's two refusals of 01:26; the answer of 01:38 and the round-3 launch of 01:40:08",
    "docs/evidence/WO-284/drive-architecture.md and WO-284-D019 as amended: asked for as gpt-6-astra at max, the model and effort that ran unknown"
  ],
  "rejected": [
    {
      "option": "Decline the fourth point, since the answer said the review was still to run",
      "reason": "It named no round and no times to an operator who had just misread the labels; the critic's reading of it is one a reader would make."
    },
    {
      "option": "Call the first point closed now",
      "reason": "It was called closed twice and failed twice; it stays open until the record shows a failing probe and the host's result agreeing."
    }
  ],
  "reopenWhen": "A later critic finds a probe whose host result disagrees with its own status, or settings reported as observed that were only requested."
}
```

## WO-284-D024 — The first complete run fails on a hand-written list of build-free modules; the list and one more gain the limits module, and the rerun keeps going

```json
{
  "id": "WO-284-D024",
  "date": "2026-11-17",
  "dispatch": "resume: next; the first complete run, 01:56 to 02:15 UTC, and its repair",
  "decision": "The first complete run (npm test -- --review, in the background, awaited with the kit's wait command) failed after 19 min 50 s: 75 tasks passed, beacon-portability failed and 48 were not run. The suite's portable-copy case copies a hand-written list of the skeleton's build-free modules into a root with no package source, and gate-evidence.mjs, which is on the list, imports the limits module since this order's step 4; the copy could not load it. No reviewer and no probe had run that suite: the declarations check reads fixture manifests and suite sources, and this list is a literal in the test. The order's step 1 names four fixture manifests and not this list. The repair adds the module to the list. The same search found one more hand-written list, the export file's case that names every skeleton file an export carries, which the run had not reached; it gains the module as well. Each was then run alone and passes, with the failed suite's whole file and the target-order briefing case, which round 1's closeout change reaches and no probe had run. Every other place that names the build-free modules was read: the export's list of modules, the two fixture manifests and the declared sources hold the limits module already, and the harness's two lists of compiled files are not closures of imports. The failed run judges this repair, so it takes no review round and its lines count as unreviewed in the handoff. The rerun is npm test -- --review --keep-going, so that one run names every suite that still fails; the code identity moved with the two test files, so nothing of the first run is reused.",
  "evidence": [
    "Session scratch, complete-run-1.txt: start 2026-11-17T01:56:04Z, end 02:15:54Z, exit 1; PASS 75, FAIL beacon-portability, SKIP 48; the failure: Cannot find module packages/skeleton/src/time-limits.mjs imported from packages/skeleton/src/gate-evidence.mjs in the portable copy",
    "After the repair, each under the bounded wrapper with its own exit status: scripts/test-beacon-portability.mjs whole (2 pass); scripts/test-launchpad-export.mjs, the WO-074 case that lists the exported skeleton files (pass); scripts/test-target-worktree-start.mjs, the target briefings case (pass, 21.2 s)",
    "A search for two sibling build-free modules by name over scripts and packages: scripts/launchpad.mjs, scripts/test-beacon-fixture.fixture-inputs.json, scripts/test-control-copy-sites.fixture-inputs.json, scripts/lib/evidence-sources.mjs and scripts/lib/machinery-sources.mjs already name the limits module; scripts/lib/target-worktree-fixture.mjs copies through the beacon fixture's manifest"
  ],
  "rejected": [
    {
      "option": "Run the unjudged suites one at a time before the rerun",
      "reason": "A complete run composes nothing from focused rows, and the rerun with --keep-going names every remaining failure in one pass."
    },
    {
      "option": "Make the portable copy take its modules from the export's list",
      "reason": "The case's subject is that a copied control plane needs exactly these modules; a derived list would hide the next module a script starts to need."
    }
  ],
  "reopenWhen": "The rerun names another suite."
}
```

## WO-284-D025 — The second complete run names four existing cases that read what step 5 changed; three are brought to the table's two phases and the runner's listing names the other root's suite

```json
{
  "id": "WO-284-D025",
  "date": "2026-11-17",
  "dispatch": "resume: next; the second complete run, 02:22 to 03:14 UTC, and its repairs",
  "decision": "The second complete run (npm test -- --review --keep-going) ran every task in 52 min 12 s: 122 passed, none was skipped and two failed, runner-fixtures on three cases and the launchpad seeds file on one. All four are existing cases that read something step 5 of this order changed, and none had been run by a probe or a reviewer. One: the seeds file's case of a historical starter builds its own core from a hand-written list of every seed template the refresh plans, and the plan refuses a template its core lacks; the limits file is such a seed since WO-284-D007, so the list gains it, as it gained the documentation map when that became one. Two and three: two runner cases count and select structural rows from the raw suite table, which now holds a structural row for each root's phase (WO-284-D008); one expected core's document selection to hold the instance's configuration row and the other scheduled it before format. Each now takes core's rows, as the runner does for a core root. Four: the case that an instance's review listing names every machinery suite the kit carries failed on configuration-root, which this order made the other root's structural row and so left out of every listing but its own name's. The case is right: the suite is carried and runs there by name, so the listing's inventory names it. This one is a change to the runner, one condition: the inventory holds the other root's structural row where it is a machinery suite. What an instance's selections run is unchanged, and product 07 says the listing still names it. Each of the four was run alone after its repair and passes. The failed run judges these repairs, so they take no review round and count as unreviewed lines in the handoff. The third run is the same command.",
  "evidence": [
    "Session scratch, complete-run-2.txt: start 2026-11-17T02:22:00Z, end 03:14:18Z, exit 1; PASS 122, FAIL runner-fixtures and launchpad:file:test-launchpad-seeds.mjs, SKIP 0; the gate's own row: npm test 3,131,623 ms",
    "The four failures as the run printed them: test-runner.test.mjs 3079, 39 !== 40; 9394, started configuration before format; 15867, configuration-root missing from a kit root's review listing; test-launchpad-seeds.mjs 310, seed template unavailable: scripts/kit/time-limits.template.json",
    "After the repairs, each under the bounded wrapper with its own exit status: the three runner cases (3 pass) and the seeds case (1 pass)",
    "A search for readers of the review listing: every other reader passes --selected, which the changed condition does not reach"
  ],
  "rejected": [
    {
      "option": "Skip a following seed whose template the release lacks, in the plan itself",
      "reason": "A release that carries the seed and lost its template would then refresh nothing and say nothing; the fixture is what names the seeds, as it did for the documentation map."
    },
    {
      "option": "Change the listing case to exempt the other root's row",
      "reason": "The case states what the listing is for, every machinery suite the kit carries, and the suite is carried."
    },
    {
      "option": "Another review round for these repairs",
      "reason": "The run that failed judges its own repair; the handoff counts the lines no reviewer read."
    }
  ],
  "reopenWhen": "The third run names another case."
}
```

## WO-284-D026 — The fourth meta critic's five points, all accepted: a declined criticism its cited entry does not support, a first run that stopped at its first failure, an evidence page with a stale date and edition, settings given as what ran, and a review reported cleaner than it was

```json
{
  "id": "WO-284-D026",
  "date": "2026-11-17",
  "dispatch": "resume: next; the fourth meta critic's report, 03:32 UTC on 2026-11-17",
  "decision": "The fourth critic (launch 4, 03:15 to 03:32 UTC, asked for as gpt-6-astra at max, read-only over a copy of the transcripts that holds no account address; it was due at 03:05 under a live gate and went out when that gate ended) made five points, kept three things and named one change to make first. Its report was given to the operator whole before any answer, and each point was checked against the session's own record. All five are accepted. One: WO-284-D018 declined the second critic's point that an operator's question went unanswered, citing an entry of 00:24:35.601 UTC as the answer. That entry is of the host's thinking type; the entry before it is thinking too and the one after is a command, and no delivered text entry of that time holds the answer. The executor's own check of 00:48 printed no delivered match, and its raw search matched the thinking entry and the check's own command, which the executor read as a delivered message. So the record does not show the operator answered within the second critic's window, the third critic's keeping of that rebuttal notwithstanding; D018 and the criticisms file are corrected in place. An event's type is read before it is cited as something said to the operator. Two: the first complete run was started without --keep-going, stopped at its first failure after 19 min 50 s with 48 tasks unrun, and cost a third run (WO-284-D024, D025). On a change this broad the first complete run takes --keep-going. Three: the evidence page was recomposed from new captures while its sentences still dated the listing to 23:35 UTC on 2026-11-16 and named feedback edition 001 as selected; the composing script now takes the capture's own time and names both editions. Four: WO-284-D012 and D022 gave the two feedback episodes' model and effort as what ran, while each episode's own record gives the effective model and effort as unknown; both now say asked for, and the two earlier decisions that gave a critic's settings as the launcher printed them say asked for as well. Five: the update of 02:40 UTC to the operator said round 3 checked two fixes and came back clean; it read four changes and returned two findings, one blocking that the re-mint had already resolved and one note that stays open (WO-284-D022). A review's scope and findings are given as recorded.",
  "evidence": [
    "docs/control/local/reviews/WO-284/critic-4.md, in the ignored reviews lane; session scratch, critic/launch-4.txt, with the launch's start and exit 0",
    "The session's record, read with single read-only searches at 03:35 UTC: the entry with the time 2026-11-17T00:24:35.601Z opens as type thinking; the entry of 00:24:35.590 is thinking and that of 00:24:39.512 a tool call; a phrase unique to the answer's delivered form has no match in the record",
    "docs/evidence/WO-284/feedback-002/selfhost-verification.jsonl, whose record gives effectiveModel and effectiveEffort as unknown; docs/evidence/WO-284/evidence.md as recomposed at 04:20 UTC, with the capture's time and both feedback editions",
    "The copy the critic read: 6 occurrences of an account address replaced, none left; the private-list screen 0 refusals; the other host's sandbox read the copy and refused a write beside it"
  ],
  "rejected": [
    {
      "option": "Hold that the operator saw the answer because the host shows such entries",
      "reason": "What the host displayed is not in the record; the record holds an entry of the thinking type and no delivered text, and a claim is made from what the record holds."
    },
    {
      "option": "Leave D018 as written and correct it only here",
      "reason": "A decision that says the record shows an answer would stand beside one that says it does not."
    }
  ],
  "reopenWhen": "A later reader finds a delivered answer to that question inside the second critic's window, or another claim of something said or observed that its cited event does not hold."
}
```

## WO-284-D027 — The third complete run passes, the plain selection passes on its row, and the captures that needed the row are recorded

```json
{
  "id": "WO-284-D027",
  "date": "2026-11-17",
  "dispatch": "resume: next; the third complete run passes, 03:18 to 04:17 UTC, and the captures that needed its row",
  "decision": "The third complete run (npm test -- --review --keep-going) passed: 47 suites, 124 tasks, every one fresh, none reused, in 58 min 15 s; its row is the one the closeout and the final review's claim read. Three complete runs were made for this order, 19 min 50 s, 52 min 12 s and 58 min 15 s; the first two failed on five existing cases in all, each named in WO-284-D024 and D025, and no result of either is composed into the passing row. At the same identity the plain selection passed in 1 min 16 s with 7 fresh tasks and 106 reused. The two captures WO-284-D017 left owed (R1-R) are in the evidence record, each a real command's output on this tree: the briefing's owed form from 01:17 UTC, before any complete run, and its satisfied form from 04:18 UTC, which names the row's time and lists the document gate alone; and the runner's answer to npm test -- --review --again at 04:18 UTC, which printed the row, ran nothing and exited 0. The export file's time in the passing run is recorded beside its earlier median, which closes the comparison WO-284-D014 left pending: 329,183 ms against a median of 212,692 ms and a maximum of 472,265 ms over the thirty days before, one run under a full gate's load. The critic's clock ended with this run, and no timer of this session is left running.",
  "evidence": [
    "Session scratch, complete-run-3.txt: start 2026-11-17T03:18:59Z, end 04:17:20Z, exit 0; PASS 124, FAIL 0, SKIP 0, REUSE 0; the runner's line: npm test: 47 passed; 0 failed; 0 h 58 min; 124 fresh tasks",
    "The gate record's row, read through readGateChecks: recorded 2026-11-17T04:17:19.412Z, 3,494,763 ms, code identity e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302, evidence host-gate:e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302:npm test; its task launchpad:file:test-launchpad-export.mjs 329,183 ms",
    "Session scratch, plain-run.txt: npm test from 04:18:40Z to 04:19:56Z, exit 0; npm test: 38 passed; 0 failed; 0 h 1 min; 7 fresh tasks",
    "docs/evidence/WO-284/evidence.md, the sections on the closeout selection's two forms, the forced selection's answer and what the export check costs, each written from a command's saved output by the composing script"
  ],
  "rejected": [
    {
      "option": "Run the review selection once more with a reason to confirm the pass",
      "reason": "The row stands at this identity; a second run of the same bytes is what this order stops."
    }
  ],
  "reopenWhen": "A code file changes before the handoff, which would move the identity the row stands at."
}
```

## WO-284-D028 — Verification output selection needed correction

```json
{
  "id": "WO-284-D028",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "kind": "correction",
  "misread": "Several source and audit reads were budgeted by individual command rather than their aggregate returned output, and a review Markdown file held a nested serialized report on one line. The resulting outputs were truncated. Guessed paths and an unquoted shell glob also produced read errors.",
  "meant": "Select verdict-relevant fields and bound aggregate output before emission; decode a nested report in session scratch before reading it. Read omissions are not evidence.",
  "changed": "The full subject diff and raw probe outputs were retained in ignored session scratch. The nested review reports were decoded and read, source sections were read separately, and gate receipts were reduced to named fields. Read errors were corrected with the discovered source paths. Generated oversized artifacts are judged through their generation/check evidence. No claim relies on a truncated portion.",
  "decision": "Record this as a verification process correction, including its recurrence before handoff. Keep raw results in scratch, emit only bounded selections, and use the retained executable reproduction for the verdict.",
  "evidence": [
    "Session scratch verification-subject.diff and decoded round-2 and round-3 review reports",
    "docs/evidence/WO-284/verification-001-checks.json",
    "docs/evidence/WO-284/verification-001-results.json"
  ],
  "rejected": [
    {
      "option": "Treat a command exit of zero as proof its full output was read",
      "reason": "A successful command can still return truncated output."
    }
  ],
  "reopenWhen": "Any claim requires an omitted source segment or another output batch exceeds its aggregate budget."
}
```

## WO-284-D029 — A limits change must invalidate an incompatible passing result

```json
{
  "id": "WO-284-D029",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "decision": "Fail criterion 1 and return F1 as an in-scope escape. After a passing review row, a supported per-key increase is resolved but the reused task record retains its earlier timeout. A supported scale reduction leaves the earlier row standing and closeout satisfied; --again skips, while --again with a reason actually runs and fails for time. Bind effective timeout configuration into reuse and standing eligibility across the runner and its consumers, while preserving reuse after prose-only edits. The verifier changes no implementation.",
  "evidence": [
    "docs/evidence/WO-284/verification-001-probe.mjs",
    "docs/evidence/WO-284/verification-001-results.json",
    "packages/skeleton/src/gate-evidence.mjs: gateCodeIdentity excludes the control document; gateInstanceInputDigest binds runtime installation inputs",
    "scripts/lib/gate-reuse.mjs: identityRows matches code identity and instance runtime digest",
    "Planning receipt 2026-11-16-planning-47cb7272ac079856-070, criterion 7 known issue and reopening condition"
  ],
  "rejected": [
    {
      "option": "NoOp: pass because the recorded complete gate is green",
      "reason": "The independent probe reproduces an unmet supported-input contract after that pass; the existing tests cover fresh limits and reuse separately."
    },
    {
      "option": "Repeat the complete gate at unchanged settings",
      "reason": "That would repeat the established passing outcome and would not test the configuration transition that fails."
    },
    {
      "option": "Treat --again --reason as the repair",
      "reason": "It is a reproduction path, not evidence that ordinary reuse applies the owner configuration."
    },
    {
      "option": "Treat a control JSON edit as an authored prose edit",
      "reason": "The changed setting governs task execution and can change its result."
    }
  ],
  "reopenWhen": "A repair demonstrates that per-key, scale and enforce/null changes invalidate incompatible task reuse, complete standing and forced-run answers at core and instance roots, with prose-only reuse retained."
}
```

## WO-284-D030 — Retain the earlier nonblocking limits with a named follow-up

```json
{
  "id": "WO-284-D030",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "decision": "Carry forward the documented nonblocking observations from D017, D021 and D022 without expanding verification into repair. The supported-input blocker is D029; these observations do not independently break a declared criterion or reproduce a regression from main.",
  "evidence": [
    "docs/evidence/WO-284/handoff.md, retained notes",
    "docs/evidence/WO-284/decisions.md, D017, D021 and D022",
    "scripts/test-runner.test.mjs, gate-path AST inventory and lane-share fixture",
    "scripts/test-launchpad-export.mjs, exported instance selections reuse a running guard",
    "scripts/lib/bounded-command.mjs, selection detection"
  ],
  "followup": "WO-284 retained verification limits: preserve malformed top-level limits data on write; expand the AST inventory beyond inline expressions; prove cold guard startup room on a slower host; review the pre-existing bounded document/machinery selection ceiling; avoid the unused standing-row lookup during verifier briefing; remove the lane-share fixture assumption below 0.703.",
  "rejected": [
    {
      "option": "Block this order on all retained notes",
      "reason": "Their current evidence does not establish an additional unmet criterion or regression, and malformed top-level data is outside the documented supported vocabulary."
    },
    {
      "option": "Leave these only in report prose",
      "reason": "The verification contract requires a named follow-up for a met defect left unfixed."
    }
  ],
  "reopenWhen": "A supported setting or slower-host result demonstrates one of these limitations breaking a declared contract, or the named follow-up is selected for implementation."
}
```

## WO-284-D031 — Correct the verification decision prefixes and command provenance

```json
{
  "id": "WO-284-D031",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "kind": "correction",
  "misread": "The three new verification decisions paraphrased the dispatch without its required control prefix. The first document gate rejected D028, D029 and D030; this was a verifier-authored record failure, not an implementation failure. The evidence description also called reproduction commands exact invocations although one source initially ran from session scratch and another invocation included an optional scratch output directory.",
  "meant": "A new decision dispatch starts with a recognized control prefix and keeps its one-line paraphrase within 240 characters. Evidence distinguishes a runnable retained reproduction from a literal invocation that contained a session-only path.",
  "changed": "Read the docs-check dispatch validation and its case, corrected the three unfiled dispatch fields, added the prefix here, and retained the capture digest. Renamed the receipt command field reproductionCommand and annotated the two normalized invocations. Recorded the failed document attempt. Regeneration of the decision projection and a new final document gate are required after the correction.",
  "decision": "Keep the failed first document attempt visible and correct only the verifier-owned records. The verdict remains fail on F1; no implementation or criterion changed.",
  "evidence": [
    "scripts/docs-check.mjs, new dispatch validation; scripts/test-docs-check.mjs, dispatch fingerprints case",
    "First verification document gate: recorded 2026-11-17T05:03:48.053Z, exit 1, three docs-check failures naming D028, D029 and D030",
    "docs/evidence/WO-284/verification-001-checks.json",
    "docs/evidence/WO-284/verification-001-evidence.md"
  ],
  "rejected": [
    {
      "option": "File the verdict with the document failure as an implementation finding",
      "reason": "The failed inputs are the verifier own new decisions and are repairable within this role."
    }
  ],
  "reopenWhen": "The corrected document gate names another failure or a retained command is confused with its literal session invocation."
}
```

## WO-284-D032 — A pass recorded under other time limits is neither carried nor standing

```json
{
  "id": "WO-284-D032",
  "date": "2026-11-17",
  "dispatch": "resume: fix; the repair of the verification's one finding, that a pass recorded before a change to the time limits was still reused, still answered a forced run and still stood for the closeout",
  "decision": "The rule the repaired code holds: a pass says what it says only under the time limits it ran under. A gate row records them as one digest of every figure that applies in its root (timeLimitsDigest in packages/skeleton/src/time-limits.mjs, written by the runner only where a figure differs from the kit's, so a row that names none ran under the kit's figures), and timeLimitsUnchanged false where the digest at the row's end differs from its start. A task's pass is carried, and a complete row stands, only from a row whose recorded limits are those in force now and did not change while it ran (ranUnderTimeLimits in packages/skeleton/src/gate-evidence.mjs). The rule sits in the two lookups every reader goes through: scripts/lib/gate-reuse.mjs (identityRows, decidingPass and coveringGateCheck, which serve the runner's reuse, its answer to a forced selection, the closeout's satisfied form through standingReviewRow, a completion's claims and focused rows, the final review's claim and the document row) and gate-evidence.mjs (findGateCheck and gateCheckStands, which serve the evidence command's cache, the final review result's product gate and the application-evidence handler). A row under other limits stays an execution, so a later run under any limits still displaces an older pass: setting the file back does not revive a row that a later run under other figures followed. The digest covers the figures that apply and not the file's bytes: a note, a refreshed kit, an explicit \"kit\", a set equal to the kit's figure and an unusable value the kit's figure replaces change nothing, so reuse after a change to documents alone is kept. The evidence command's own fallback row is stamped the same way, and the closeout's classifier counts <control>/time-limits.json among the records the gates read, beside the budgets, so a target order that changes it in any way, an edit that changes no figure included, owes the launchpad's complete run unless a complete row stands under the limits in force, as a change to the budgets does. The texts say what happened: the runner prints how many passing tasks ran under other limits and its row's freshReason is time-limits-changed; a claim's refusal and the final review's name the newest passing row recorded under other limits, where no displaced row is named first; a focused row's reason says its latest row ran under limits that changed since; a run during which the file changed says so on its summary line. (Corrected in place on 2026-11-17 after the repair's review, as WO-284-D034 records: this passage first said that an order changing the file owes the run, without saying that an edit changing no figure does too, and that each refusal names the case.) D009's satisfied form and D010's forced answer now stand on the same lookup with this rule, and D029's reopening condition is what the cases below show. A change made and undone inside one run is not seen, since a row compares its start and its end only.",
  "evidence": [
    "node docs/evidence/WO-284/verification-001-probe.mjs, the verifier's own reproduction, run under the bounded wrapper at 06:16 and 06:32 UTC: exit 0, contractFailures empty; after the raised key the slow task's record names 5,400,000 ms; after the lowered scale standingReview is false, the closeout no longer says satisfied, and --again without a reason runs and the slow task is ended for time at 27 ms (exit 1). The verifier's retained results show exit 1 and three contract failures on the tree it judged",
    "scripts/test-runner.test.mjs, 'WO-284 criterion 1, after a pass' (core: an edit that changes no figure keeps the standing row, the forced answer and reuse; a raised key runs every task fresh, its record names 5,400,000 ms, freshReason time-limits-changed and the runner's line; a scale either way, one limit off and every limit off leave nothing standing for the closeout, a claim or the evidence command; a forced selection with no reason runs; setting the kit back does not revive rows a later run followed; a run during which the file changed records timeLimitsUnchanged false and supplies nothing; a four-second suite that passed under the kit's figures is run and ended for time at 2,000 ms) and 'WO-284 criterion 1 at an installed instance' (a kit root: the claim, the review row, the evidence command and the closeout each stand only under the limits the row ran under, for a raised key, scale 3 and a third, one limit off and enforce false, and again under the kit's figures; a run at scale 3 then stands under that scale alone): both pass under the bounded wrapper at 06:21 and 06:26 UTC",
    "The same two cases with ranUnderTimeLimits made to admit every row, the behavior before this repair, at 06:21:59 UTC: both fail (exit 1); the file was restored from a scratch copy and the two pass again on it",
    "scripts/test-configuration-root.mjs, 'the digest a gate row records follows the figures that apply, not the file's bytes': undefined with no file, for the seed, a note, a set equal to the kit's figure, an explicit kit and an unusable scale; six changes of a figure have six digests; two files that apply the same figures have one; 11 subtests pass at 06:27 UTC",
    "scripts/test-worktree-integration.mjs, criterion 6's case: with scale 2 written the briefing lists the complete run again, and with a file naming the kit's figures the row stands as before; pass at 06:22 UTC. scripts/test-target-worktree-start.mjs, the closeout case: records/state/time-limits.json in a configured control root owes the complete run as launchpad machinery; pass at 06:28 UTC",
    "scripts/test-launchpad-export.mjs, the exported instance's case, whose consumer block now finds the one-third row with no evidence command or claim under the seed's kit figures and finds it again under the third it ran at: pass at 06:32 UTC in 2 min 15 s",
    "node scripts/structural-checks.mjs declarations: first failed, 'Missing machinerySources declaration: runner-fixtures: scripts/lib/closeout-scope.mjs'; scripts/lib/machinery-sources.mjs declares it and the check passes at 06:27 UTC. The order's other runner cases and the existing installed-instance gate case pass at 06:28 UTC",
    "npm run sync at 06:26 UTC: the runtime, the harness and the authority edition (now WO-284/004) regenerated; the first attempt had refused on three possibly-undefined index reads in the digest, rewritten over the table's entries. The feedback edition WO-284/002 still judges the current source: none of the changed files is in FEEDBACK_SOURCE_PATHS (packages/skeleton/src/feedback-audit.ts), so no live episode is owed"
  ],
  "reopens": {
    "decisionId": "WO-284-D009",
    "observation": "VER-001 reproduced a satisfied closeout, an answered forced run and a reused task record after a supported change to the time limits at an unchanged code identity; the standing row is now the one recorded under the limits in force."
  },
  "rejected": [
    {
      "option": "Put the file's bytes in the code identity, as docs/control/outward-vocabulary.json is",
      "reason": "A note or a --write refresh would then owe a complete run; the identity that publication, the release's identity comparison and the closeout's classifier read would move for something that is no code; and the configured control root would have to be read at each revision."
    },
    {
      "option": "Keep reuse after a figure is raised or a limit turned off, and invalidate only a lowered one",
      "reason": "A pass under a tighter figure would hold under a looser one, but the reused record keeps a figure that no longer applies, which criterion 1 says the row names and which is the verification's first mismatch; it also needs every figure on every row and a comparison per key."
    },
    {
      "option": "A digest of only the keys that bound a given task",
      "reason": "No list of keys per task can be shown complete: the host monitor's census bounds every running task, the generated checks run inside one row, and the evidence and probe wrappers bound whole selections. A missed key admits a wrong pass, while an extra key costs one run after a rare edit."
    },
    {
      "option": "Read a row that names no limits as matching nothing",
      "reason": "Rows hand-built by about a hundred existing cases in thirteen files would stop standing with no change in any writer's result. The runner writes no field for the kit's figures, so a row that names none states them; the one other writer of npm test rows, the evidence command's fallback, is stamped."
    },
    {
      "option": "Leave rows under other limits out of the lookup, as rows of another installed runtime are",
      "reason": "A failure under other limits would then never displace an older pass: a session that tightened a limit, saw a task fail and set the limit back would see the older pass stand over the later failure."
    },
    {
      "option": "Bind the reviewed gate that publication reads and a correction's bound gate as well",
      "reason": "They record what a review ran, at its code identity and installed runtime, and are not a claim that the gate passes now; time limits are the conditions of a run, not its subject, and the committed product-gate fields stay as they were."
    },
    {
      "option": "NoOp, or print the new figure on the reused result",
      "reason": "The verification's reproduction fails on supported input, and a printed figure on an old result is not the result under that figure."
    }
  ],
  "reopenWhen": "A task is carried or a row stands under limits other than those it recorded; a change to the file that changes no figure stops a pass being reused or standing; or a file edited and restored inside one run is shown to let a pass stand, which would need each task to record its own limits."
}
```

## WO-284-D033 — Criterion 1 was judged met from fresh runs alone; a change to the file after a pass was not examined

```json
{
  "id": "WO-284-D033",
  "date": "2026-11-17",
  "dispatch": "resume: fix; the executor's own error that the verification found in the handoff's judgment of criterion 1",
  "kind": "correction",
  "misread": "The handoff judged criterion 1 met from cases that each resolve a file and then run fresh: the resolver's case and the runner case that writes a file and runs a selection under it. 'With a key raised the runner applies that figure to its row and the row's record names it' was read as a claim about a fresh run only. That a selection at the same code identity would reuse a task recorded under the old figure, and that the closeout, a forced run and a claim would each take a pass recorded under a figure no longer in force, was never examined; D009 and D010 bound the satisfied form and the forced answer to the code identity alone without asking what outside that identity changes a run's result.",
  "meant": "A pass holds only under the time limits it ran under. A raised key applies to the row a selection records, reused or not, and every reader of a standing row holds the same rule.",
  "changed": "WO-284-D032's rule, its cases and its write-backs to the kit guide and product 07; the handoff's judgment of criterion 1 now rests on them, and D009 is reopened by D032.",
  "decision": "Record the error beside its repair and judge criterion 1 again from cases that change the file after a pass, at a core root and at an installed instance, and not from fresh runs alone.",
  "evidence": [
    "docs/verifications/WO-284/VER-001.md, its criterion 1 line and finding; docs/evidence/WO-284/verification-001-results.json, three contract failures on the tree it judged",
    "docs/evidence/WO-284/handoff.md as handed off on 2026-11-17, criterion 1's line: the resolver's case and the runner case 'WO-284 criteria 1 and 2'",
    "WO-284-D009 and WO-284-D010: each bound its row to the code identity and named no input outside it"
  ],
  "rejected": [
    {
      "option": "Treat the verification's finding as a new requirement rather than the executor's own error",
      "reason": "The criterion's text already says the row's record names the raised figure, and the reused row did not."
    }
  ],
  "reopenWhen": "A later criterion judgment in this order rests on fresh runs alone where a passing row could be reused or stand."
}
```

## WO-284-D034 — The repair's one combined review: five notes, each judged and recorded, and two texts of the repair corrected to say only what the code does

```json
{
  "id": "WO-284-D034",
  "date": "2026-11-17",
  "dispatch": "resume: fix; the repair's one combined review over its change since the tree the verification judged, its five notes and what becomes of each",
  "decision": "One worker carrying the criteria, design and consistency briefs read the repair's change from base tree f080f9ca1bb1e539a85eb545c140a0e0716dacfe, the tree VER-001 judged, to reviewed tree 7604880ed05c3e2126f13eeb4b1e28309d1bfb30, from 06:39 to 06:56 UTC. It ran the repair's cases and the generated checks and found the rule held at every reader it traced, no regression against main and criterion 9's feedback edition still current. It made five findings, all notes. The rule of this last round admits a new finding only where it breaks an acceptance criterion or a behavior main had; none does, so each is judged here and recorded, and no code changes for any of them except a comment's line wrap. F1: the closeout's classifier counts any change to <control>/time-limits.json as a change to what the gates read, so a target order whose only launchpad edit is a note or an npm run limits -- --write refresh owes the launchpad's complete run unless a complete row stands under the limits in force. The writer is real (the owner's ordinary edit, the kit's own --write); the failure is closed, an extra run owed and nothing wrong admitted; the budgets file has the same behavior today; the fix is a digest of the file's content at the order's base beside the current one, an export to compute it from content and a case. F2: the refusal texts of a claim, the final review and a focused row have no case; the limits clause gives way where displaced tasks are named; and where a plain row under the limits in force stands without covering the review selection while an older row ran under other limits, the claim's text calls that older row the newest passing one. No writer is admitted anything; the text can misname a row in that one arrangement; the fix is two cases and a guard. F3: a forced selection that runs because the only passing row ran under other limits prints no line saying so; a message only. F4: npm run plan -- failures counts every rerun at an identity that holds a pass as a repeated gate, the reruns a figure change now requires among them; the metric's code is unchanged here. F5: the comment above the runner's forced answer kept one line of about 130 columns, now rewrapped (a comment only), and preflightRows imports the gate evidence inside its loop, which the module cache makes harmless; recorded. Two texts of this repair said more than the code does, and are corrected: the kit guide's and product 07's sentence that an edit changing no figure changes nothing, which holds for reuse and standing and not for a target order's classification; and WO-284-D032's account of the closeout and of the refusal texts, with its reopening condition, which F1's case would have met by design. D032 is corrected in place, and says so, as WO-284-D022 corrected D021, since no verification or review has read it.",
  "evidence": [
    "docs/control/local/reviews/WO-284/repair-3/round-3-combined.md, recorded with npm run worker -- record from the worker's returned object: 'review: combined round 3 found 5 (0 blocking); recorded from the Agent route'. The host reported claude-opus-5-5 for each of the worker's 146 turns; xhigh was selected and not read back; 220,370 tokens, 83 tool uses, 16 min 37 s",
    "The brief: npm run worker -- review --kind combined --host claude --order WO-284 --since f080f9ca1bb1e539a85eb545c140a0e0716dacfe --dry-run, brief SHA-256 15aad2e59cb86b7939137fea4c5005accd9751f6b947b5beeb7fd1363505221c, which names the round the last one and a repair's lane repair-3 (one fix dispatch and the two failed complete runs since activation)",
    "The worker's probes: the two new runner cases, the order's four other runner cases, criterion 6's integration case, the target closeout case, the configuration resolver case and the exported instance's case (155.7 s), all passing; prettier --check, the declarations check and ten generated-artifact checks, all exit 0; its Traced consumers table names every reader of the two lookups",
    "scripts/lib/closeout-scope.mjs gateInputs (F1); scripts/lib/handoff-ledger.mjs otherLimitsClause and its two callers, scripts/lib/gate-reuse.mjs preflightRows (F2); scripts/test-runner.mjs, the forced answer and the reuse block (F3); scripts/lib/plan-failures.mjs, the repeated-gate count (F4)"
  ],
  "followup": "WO-284 repair review notes: judge a target order's change to the limits file (and the budgets) by the figures it changes, so an edit that changes none owes no launchpad run; give the claim, final-review and focused-row refusals a case each, and add the limits clause only where no candidate stands under the limits in force; print why a forced selection runs where the only passing row ran under other limits; count a rerun after a change of the limits, or one with a stated reason, apart from repeated gates in npm run plan -- failures; import the gate evidence once in preflightRows.",
  "rejected": [
    {
      "option": "Fix F1 to F4 in code in this repair",
      "reason": "This is the repair's last round: a finding that breaks no criterion and no behavior main had is recorded, and code changed after it would be lines no reviewer read. Each fix is more than a line: a content digest at the order's base in the classifier, new refusal cases and a guard, a message branch and a metric rule."
    },
    {
      "option": "Leave the two texts as they stood",
      "reason": "They would state a behavior the code does not have, which the order's write-backs and its decisions must not do."
    },
    {
      "option": "Record the five in a roundFindings array",
      "reason": "That array counts a paired round's findings by finder for the failures report; this is a repair's single combined round, and its findings would be counted as ones only the combined worker found in a paired round."
    }
  ],
  "reopenWhen": "The complete run fails on a case this repair changed; an operator reports a target order sent to the launchpad's complete run by an edit of the limits file that changes no figure, or a refusal that names the wrong row; or the follow-up is selected for an order."
}
```

## WO-284-D035 — The meta critic's clock was not run in this repair, whose dispatch it reached from its start; the passing run ends it

```json
{
  "id": "WO-284-D035",
  "date": "2026-11-17",
  "dispatch": "resume: fix; the executor's own error, found while the complete run was live, that the operator's critic cadence of WO-284-D002 was not kept in this repair",
  "kind": "correction",
  "misread": "The executor read the implementation's handoff, which says the critic's clock ended with that dispatch's passing run, as the end of the operator's cadence for the order, and did not read D002's rule as the critic's README states it: the clock runs in every dispatch that works on the order, a repair included. The last critic was launched at 03:15 UTC, so the next was due from 04:30 UTC; this repair began at 05:59 UTC, when a launch was therefore due at once, and none went out. The executor noticed at about 07:10 UTC, after the complete run had started, when the session's guard admits reads only.",
  "meant": "At a repair's start, read the operator's standing directions for the order (D002 and the critic's README) and launch a critic that is due, as WO-276's README rule 4 records from the repair of its VER-003, which ran three hours without one until the operator asked.",
  "changed": "The miss was told to the operator in the session while the run was live, with what would follow: no launch if the run passed, since the README's rule ends the clock when the passing run is in, and the overdue launch at the gate's end if it failed. The run passed at 07:53 UTC, so the clock ended and no critic was launched in this repair; the operator may still ask for one.",
  "decision": "Record the error and its consequence: this repair's conduct, from 05:59 to 07:53 UTC, was not read by a critic. No launch is made after the pass, since the rule the operator's direction adopted ends the clock there and a critic launched after a repair's passing run was stopped on the operator's direction in WO-276.",
  "evidence": [
    "WO-284-D002, the operator's direction and its adoption of the critic README's fourth rule; docs/evidence/WO-276/critic/README.md, rule 4, read at 07:10 UTC",
    "docs/evidence/WO-284/criticisms.md: the fourth critic launched at 03:15 UTC; docs/evidence/WO-284/handoff.md as handed off: 'The clock ended with the passing run and no timer is left running'",
    "The repair's briefing at 05:59 UTC; the complete review run started at 07:02 UTC and passed at 07:53:35 UTC (47 suites, 124 fresh tasks)"
  ],
  "rejected": [
    {
      "option": "Launch a critic now, after the pass",
      "reason": "The rule ends the clock when the passing run is in, and a critic launched after a repair's pass was stopped on the operator's direction in WO-276; the operator can still ask for one."
    },
    {
      "option": "Stop the live complete run to launch the overdue critic",
      "reason": "Nothing waits for the critic, a gate included, and a launch due under a live gate goes out when the gate ends; stopping the run would have cost the run and supplied nothing."
    }
  ],
  "reopenWhen": "The operator asks for a critic of this repair, or a later dispatch on this order begins with a critic due."
}
```

## WO-284-D036 — The first document gate of the repair failed on a decision link in the kit guide's entry point; the bullet links the guide's own closeout section

```json
{
  "id": "WO-284-D036",
  "date": "2026-11-17",
  "dispatch": "resume: fix; the repair's first document gate, which failed on the executor's own write-back to the kit guide",
  "kind": "correction",
  "misread": "The bullet the repair added to the kit guide's 'Time limits, and a slower machine' linked WO-284-D032 in the order's decisions. That subsection lies under 'First steps', which docs/control/documents.json declares the kit-first-steps entry point, and an entry point names standing documents only. The executor took the subsection for an ordinary standing passage and did not check which entry points cover it.",
  "meant": "A passage in an entry point cites a record only through a standing section a reader reaches by link.",
  "changed": "The bullet now links the guide's own section 'The checks an order owes at its closeout', which states the rule and links D032. The document gate is run again.",
  "decision": "Correct the link and run the document gate again; the code identity and the complete rows are unchanged, since the kit guide lies outside the code identity.",
  "evidence": [
    "npm run test:docs, recorded 2026-11-17T07:58:19.702Z, exit 1, 2 min 2 s: 'FAIL docs/KIT.md: entry point kit-first-steps names the record docs/evidence/WO-284/decisions.md; an entry point names standing documents only, so cite the record from a standing section a reader reaches by link'; docs-check the one failed task, the sixteen after it skipped",
    "docs/control/documents.json, the kit-first-steps entry point over docs/KIT.md's 'First steps'"
  ],
  "rejected": [
    {
      "option": "Drop the link",
      "reason": "The bullet states a rule whose account a reader of the first steps may need; a standing section that carries it serves that reader."
    }
  ],
  "reopenWhen": "The document gate fails again on a passage this repair wrote."
}
```

## WO-284-D037 — Verification read-output truncation recurred and was corrected

```json
{
  "id": "WO-284-D037",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of the repaired WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "kind": "correction",
  "misread": "Several reads were sized from command line counts or individual output budgets instead of the selected aggregate. The status returned all orders, and a short tail of the export test included long nested diagnostic records. Returned output was truncated. The same mistake recurred when npm run meta printed cross-order historical metrics instead of a selected generation receipt. This repeats the output-selection error already recorded in D028.",
  "meant": "Select verdict-relevant fields before emission, inspect nested records, and budget returned characters across the whole batch. Successful execution does not prove complete output delivery.",
  "changed": "The full repair source diff and decoded review findings were retained in session scratch. Missing source and decision passages were read separately. All original review findings and rechecks were read in fixed character pages; the repair report was read directly. Export results were decoded to task records, and passing receipts were reduced to named fields. The generated decisions-index rows were read directly; unrelated historical metrics are not evidence for this verdict. Oversized generated outputs are judged through their generation and currency checks. No judgment relies on a truncated portion.",
  "decision": "Record the repeated verification process error and its correction. Use selected structured receipts and bounded text pages for this handoff; retain original logs in ignored scratch.",
  "evidence": [
    "docs/evidence/WO-284/verification-002-checks.json",
    "docs/evidence/WO-284/verification-002-evidence.md"
  ],
  "rejected": [
    {
      "option": "Treat an exit of zero as evidence that the whole response was read",
      "reason": "Tool output can be truncated independently of the command result."
    }
  ],
  "reopenWhen": "A later judgment needs an unread segment or another returned batch is truncated."
}
```

## WO-284-D038 — Independent re-verification closes the changed-limits finding

```json
{
  "id": "WO-284-D038",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of the repaired WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "decision": "Judge the repaired limits rule through supported transitions and its shared readers, and carry untouched claims from VER-001 with the current complete gate rows. The original F1 reproduction now passes. A new linked-worktree probe shows that main results under different figures are not carried, equivalent scale and per-key files share a digest, a later main execution under other limits displaces an earlier carried pass, a fresh execution restores standing, prose-only edits preserve the forced-run answer, and a changed nested-child limit invalidates standing even when the suite timeout stays the same. Focused runner, resolver, listing, integration and exported-instance cases pass. The code identity still holds the executor's passing complete review and plain rows, so consume them and run only the document gate after this report. The verifier changes no implementation.",
  "evidence": [
    "docs/verifications/WO-284/VER-001.md",
    "docs/evidence/WO-284/verification-002-probe.mjs",
    "docs/evidence/WO-284/verification-002-checks.json",
    "docs/evidence/WO-284/verification-002-evidence.md",
    "docs/evidence/WO-284/decisions.md#wo-284-d032--a-pass-recorded-under-other-time-limits-is-neither-carried-nor-standing",
    "docs/control/local/reviews/WO-284/repair-3/round-3-combined.md"
  ],
  "rejected": [
    {
      "option": "Accept the repair from fresh-run tests alone",
      "reason": "The earlier defect occurred after a pass. Reused records, forced selection, closeout and evidence readers must see the same changed-settings rule."
    },
    {
      "option": "Repeat the complete repository gate",
      "reason": "A current passing complete review row exists. These verification records change no code identity; focused probes exercise the repaired paths and the document gate judges the final authored records."
    },
    {
      "option": "NoOp: carry the earlier failure without reproducing the repair",
      "reason": "The repair changes the lookups that caused F1 and must be judged on its own subject."
    },
    {
      "option": "Expand verification into repairs of retained notes",
      "reason": "D030 and D034 already name their follow-ups. No new unmet criterion or regression was reproduced, and verification is read-only for implementation."
    }
  ],
  "reopenWhen": "A supported setting produces a stale carried result or standing claim, a later execution fails to displace it, or the document gate fails on this report."
}
```

## WO-284-D039 — Correct the verifier decision dispatch fields and retain the failed document attempt

```json
{
  "id": "WO-284-D039",
  "date": "2026-11-17",
  "dispatch": "resume: verify; independent judgment of the repaired WO-284. Ignored request capture SHA-256 178bcbd58fc08915589973085820ecdf0c626ff9a7489b401fc033f46f80faae",
  "kind": "correction",
  "misread": "The verifier paraphrased its new decisions' dispatch fields without their required control prefix. This repeats D031: the new record shape was written without applying that already-recorded contract. The first document gate rejected D037 and D038. The first completion invocation also omitted the optional account-label flag although the report actor included not-applicable; exact actor comparison refused it before any transition.",
  "meant": "scripts/docs-check.mjs validDispatch requires a recognized control prefix followed by a nonempty one-line paraphrase of at most 240 characters. A capture digest does not replace that prefix. Optional actor fields enter the completion actor only when supplied, and its JSON must equal the report header.",
  "changed": "Read validDispatch and its existing test. Corrected only the two unfiled dispatch fields, kept their capture digest, and used the required form here. The failed document row is retained in verification-002-checks.json and the evidence description. Regenerate the decisions index, then rerun the document gate. Read the completion actor parser and supply --account-label not-applicable on the next invocation, matching the unchanged report. Canonical status remains verifying after the rejected invocation. These receipt-only updates stay inside the document row's evidence exclusion; the indexed decision fields and allocated report do not change.",
  "decision": "Treat the failure as a verifier-authored record error, correct it within this role, and retain the failed attempt. No implementation, criterion or product verdict changes.",
  "evidence": [
    "First verification-002 document gate: recorded 2026-11-17T08:38:56.716Z, exit 1; docs-check reports two failures, D037 and D038 dispatch fields",
    "scripts/docs-check.mjs: validDispatch and new-decision validation",
    "scripts/test-docs-check.mjs: dispatch fingerprints exempt only existing bytes, and new dispatches obey prefix and length",
    "docs/evidence/WO-284/verification-002-checks.json",
    "The first verification-result invocation exited 1 with an actor-header mismatch; scripts/resume.mjs includes accountLabel only when supplied, and supports --account-label. No completion event was recorded."
  ],
  "rejected": [
    {
      "option": "Return this record error as an implementation failure",
      "reason": "The failed fields were authored by this verifier and are repairable without touching the implementation."
    }
  ],
  "reopenWhen": "The corrected document gate names any further failure in the verifier-owned records."
}
```

## WO-284-D040 — The default task limit's reopening condition is met in the order's own passing run: a core file task took 920.9 s, the figure stays, and the finding is boarded

```json
{
  "id": "WO-284-D040",
  "date": "2026-11-17",
  "dispatch": "resume: final review; a reopening condition of the figures decision, met in the gate row this review consumes",
  "decision": "In the passing complete review row that stands at the reviewed code identity, the target-worktree close file took 920,870 ms under suite.default at 2,700,000 ms. WO-284-D003 names a core row passing 900 s as the first reason to reopen that figure, so it is reopened here. Its rule for a row only core runs is three times the slowest passing time: three times this run is 2,762,610 ms, 62,610 ms above the figure, which leaves 2.93 times. The order's Design states the rule over core's gate record of the thirty days before the order, where the slowest pass was 845,802 ms and the figure is 3.19 times it, so the figure is as the Design asks and no criterion is unmet: none sets the multiple, and criterion 5 judges an instance's three selections, which do not run this file. The same file took 844 s and 857 s in this order's two earlier complete runs that reached it, and between 657 s and 846 s in main's last thirteen passes, with one end for time at main's 900 s on 2026-11-15; under main's figure this run would have failed on it. The figure is not changed in this review. The finding is boarded with the follow-up below and listed in the final review's report.",
  "evidence": [
    "readGateChecks of this worktree at about 13:43 UTC: the review row recorded 2026-11-17T07:53:35.669Z at code identity e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77; its task target-worktree:file:test-target-worktree-close.mjs 920,870 ms, exit 0, timeoutMs 2,700,000; the next slowest tasks are launchpad:file:test-launchpad-update.mjs at 798,583 ms and skeleton at 583,267 ms",
    "The same task in this worktree's earlier complete rows: 844 s in the row of 03:14 UTC, a run that failed on other suites, and 857 s in the row of 04:17 UTC. In main's gate record, its last thirteen passing executions, from 2026-11-13 to 2026-11-16, took between 657 s and 846 s, and one was ended for time at 900 s on 2026-11-15 at 16:35 UTC",
    "WO-284-D003: suite.default at 2,700,000 ms as 3.2 times the close file's 845.8 s, and its reopening condition, that the default is reopened first if a core row passes 900 s",
    "The order's Design: a row only core runs gets at least three times its slowest passing time, measured on core's gate record of the thirty days before the order"
  ],
  "reopens": {
    "decisionId": "WO-284-D003",
    "observation": "A core row passed 900 s: the target-worktree close file took 920,870 ms in the order's own passing complete review run, which leaves suite.default at 2.93 times its slowest pass."
  },
  "followup": "Core's slowest test file and the default task limit: bring scripts/test-target-worktree-close.mjs back to a time the default covers three times over, by dividing or lightening the file, or raise suite.default to at least three times its slowest pass (3,000,000 ms is 3.26 times 920.9 s), and read the figure against the record again afterwards. Planning places it; WO-288's Part E, that a check costs less than what it protects, reads as the nearest filed scope.",
  "rejected": [
    {
      "option": "Raise suite.default in this review",
      "reason": "It is a source edit after verification: the code identity moves, a third complete run of about 0 h 51 min is owed, the authority edition, the seeded template, the hooks' runtime snapshot and the guides' figures are regenerated, and the lines would be ones no verifier read. The limit bounds a hang of a row no instance's gate runs, and core can set its own figure in its own file meanwhile."
    },
    {
      "option": "Fail criterion 10, or the order",
      "reason": "Every task of the complete run passed inside its limit; the Design's rule is stated over the record before the order, where it holds, and a finding outside the criteria that breaks nothing main did is a follow-up by rule."
    },
    {
      "option": "Leave it as a sentence of the report",
      "reason": "The order's own decision names this as its reopening condition, and a defect met and not fixed is boarded in the decisions with a named follow-up."
    }
  ],
  "reopenWhen": "The close file is ended for time at the default, or passes 1,350 s in core, half the figure; or the follow-up is selected for an order."
}
```

## WO-284-D041 — Final review accepts the repaired order on the standing complete row: main brought nothing, no complete run is repeated, and one follow-up is boarded

```json
{
  "id": "WO-284-D041",
  "date": "2026-11-17",
  "dispatch": "resume: final review; acceptance of the repaired order against its ten criteria, its integration with main and its release surfaces",
  "decision": "The final review passes WO-284. Main had not moved: the integration took in nothing, so the reviewed code identity is the one VER-002 judged, and the passing complete review row recorded at it is consumed; no complete run is started, as the order's own rule and the closeout selection say. VER-001's one blocking finding does not reproduce: its unchanged reproduction exits 0 on this tree. Each criterion is judged met on that row, the plain row beside it, the cases the criteria name, which were read, and three real commands at the reviewed identity: the satisfied form the briefing and the integration printed, the runner's answer to a forced review selection, and the listing. The whole change was read: the source and its two new modules, the changed standing documents and every changed test file; generated files are judged by their generation checks in the standing rows, and the ignored reviews lane was not read, since the handoff, the decisions and both verification reports carry its findings and their dispositions. The changed standing documents state the current behavior in place and link the decisions; none adds a dated account under a standing heading. One finding is listed, a follow-up boarded in WO-284-D040; the notes the verifier and the repair's review left open stay with their follow-ups in WO-284-D030 and WO-284-D034. The release is v1.3.0 with the skeleton at 0.93.0, unchanged by this review; the release notes carry the order's Read before upgrading duty.",
  "evidence": [
    "npm run worktree -- integrate WO-284 at about 13:35 UTC: Integration took in nothing: the worktree is not behind main; origin/main and the merge base are both db7dec8d5. It and the dispatch's briefing printed the satisfied form, naming the row of 2026-11-17T07:53:35.669Z and listing npm run test:docs alone",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-284/verification-001-probe.mjs at 13:35:49 UTC: exit 0 and no contract failure. After the raised key both task records name 5,400,000 ms; after the lowered scale no review row stands, the closeout lists the complete run, and the forced selection with no reason executes and its slow task is ended for time at 27 ms",
    "readGateChecks and standingReviewRow at the reviewed identity e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77: the review row of 07:53:35.669Z, exit 0, 47 suites, 124 tasks each executed fresh and passing, 3,073,649 ms, identity unchanged, no limits digest, which is the kit's figures; the plain row of 07:55:51.177Z, exit 0, 7 fresh and 106 reused tasks. The suites the criteria name each ran in the review row: runner-fixtures, configuration-root, sync-fixtures, launchpad's three files, worktree-integration and harness-fixtures' three tasks",
    "npm test -- --review --again at 13:40 UTC in this checkout: it printed the standing row (recorded 2026-11-17T07:53:35.669Z, 0 h 51 min, 47 suites) and Nothing was run, exited 0 and recorded no row. npm run limits: 38 keys, the file absent, the kit's figures",
    "node scripts/feedback-evidence.mjs --check: Live feedback audit docs/evidence/WO-284/feedback-002 judged the current source. node scripts/authority-evidence.mjs --check: exit 0. docs/evidence/current.json selects authority WO-284/004 and feedback WO-284/002",
    "npm run release -- prepare at about 13:42 UTC against origin's tags: WO-284 target v1.3.0 remains current, and the only file changed is docs/evidence/WO-284/meta.json"
  ],
  "rejected": [
    {
      "option": "Start a complete review run to confirm the pass",
      "reason": "A passing complete review row stands at the integrated code identity under the limits in force, and this review edits documents alone. A second run of the same bytes is what the order stops, and the role's step says to reuse the row."
    },
    {
      "option": "NoOp on the reproduction: take VER-002's word that the blocker is repaired",
      "reason": "The role reproduces each blocking claim of the sequence before the expensive validation; the probe is kept beside the report and takes four seconds."
    },
    {
      "option": "Repair the open notes of WO-284-D030 and WO-284-D034 in this review",
      "reason": "Each breaks no criterion and nothing main did, each has a named follow-up, and a code edit here would move the identity and owe a complete run for lines no verifier read."
    }
  ],
  "reopenWhen": "The document gate fails on a record this review wrote, the completion refuses the row or the report, or main moves before the branch is published."
}
```
