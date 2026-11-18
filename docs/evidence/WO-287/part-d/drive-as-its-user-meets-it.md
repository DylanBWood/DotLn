# The drive as its user meets it (Part D)

Made on 2026-11-17 at 23:43 UTC by a script in session scratch, after the
repairs for the review rounds (WO-287-D037, WO-287-D038). It
builds a fixture launchpad with one active order (the shared target-worktree
fixture, with a harness installed into its order worktree as the emit
installs one), puts a stand-in for the host's program first on `PATH`, and
runs this repository's own driver against that launchpad. The stand-in plays
a recorded stream and records what it was started with.

Each command below is the command a user types in the launchpad's main
checkout, and what follows it is what the command printed. `<fixture>` stands
for the fixture's directory and `<id>` for a worker's identifier. Each
scenario starts from an order no drive has run: the fixture removes the last
drive's record between scenarios, which no user does.

No model ran here. What a router's model says of these lines, and what a
real host does once its wait for background work is lifted, are not shown by
this file. The files `live-router.md` and `live-host-wait.md` beside it hold
what was observed of each on the real host.

## An order no drive has run

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: no drive of this order has run from this launchpad, so there is no stop to explain. node scripts/drive.mjs status WO-999 prints where the order stands.
```

## The host denies a shell command the phase worker ran

The worker reads, edits, then runs one command the host would have asked about. With permission prompts off the host denies it.

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{"order":"WO-999","phase":"active","action":"next","worker":1,"transport":"claude-cli-print"}
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "dispatch-refused",
    "next": "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step."
  },
  "attempts": 1,
  "budget": {
    "count": 1,
    "cap": 80,
    "remaining": 79,
    "countKind": "exact-observed",
    "unresolvedAdmissions": 0,
    "unlinkedChildren": 0,
    "uncountedRemainder": "unknown",
    "launched": 1,
    "launchedByHost": {
      "claude": 1,
      "codex": 0,
      "unattributed": 0
    },
    "retasked": 0,
    "source": "shared-hook-counter"
  },
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": null,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": null,
      "costUsd": null
    }
  ],
  "why": [
    "WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.",
    "Stop: The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.",
    "Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; the drive ended its process there.",
    "Ended by: the host denied the shell command `git <operand> <operand> <operand>`, which the phase worker made, decided by the session's permission mode, less than a minute into the attempt.",
    "A driven phase runs with the host's permission prompts off, so a call the host would have asked about is denied instead; the drive ends a phase at its worker's own denied call, so that no worker goes around a denial or repeats it.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Commands: 1 observed, 0 failed.",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or admit the call in the host's own permission settings and type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds."
  ]
}
```

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.
Stop: The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.
Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; the drive ended its process there.
Ended by: the host denied the shell command `git <operand> <operand> <operand>`, which the phase worker made, decided by the session's permission mode, less than a minute into the attempt.
A driven phase runs with the host's permission prompts off, so a call the host would have asked about is denied instead; the drive ends a phase at its worker's own denied call, so that no worker goes around a denial or repeats it.
Background work: the host waits for it after the worker's last turn without a cap (set by the drive).
Commands: 1 observed, 0 failed.
Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.
The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.
Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.
Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or admit the call in the host's own permission settings and type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds.
```

What `node scripts/drive.mjs status WO-999` then reports as the stop:

```json
{
  "reason": "dispatch-refused",
  "next": "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step."
}
```

## The host denies a call of a tool that is not the shell

The same, for the Write tool, decided by a rule of the host's settings. Before this order the record kept nothing of such a call.

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{"order":"WO-999","phase":"active","action":"next","worker":1,"transport":"claude-cli-print"}
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "dispatch-refused",
    "next": "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step."
  },
  "attempts": 1,
  "budget": {
    "count": 1,
    "cap": 80,
    "remaining": 79,
    "countKind": "exact-observed",
    "unresolvedAdmissions": 0,
    "unlinkedChildren": 0,
    "uncountedRemainder": "unknown",
    "launched": 1,
    "launchedByHost": {
      "claude": 1,
      "codex": 0,
      "unattributed": 0
    },
    "retasked": 0,
    "source": "shared-hook-counter"
  },
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": null,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": null,
      "costUsd": null
    }
  ],
  "why": [
    "WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.",
    "Stop: The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.",
    "Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; the drive ended its process there.",
    "Ended by: the host denied a call of the Write tool, which the phase worker made, decided by a permission rule in the host's settings, less than a minute into the attempt.",
    "A driven phase runs with the host's permission prompts off, so a call the host would have asked about is denied instead; the drive ends a phase at its worker's own denied call, so that no worker goes around a denial or repeats it.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or admit the call in the host's own permission settings and type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds."
  ]
}
```

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.
Stop: The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step.
Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; the drive ended its process there.
Ended by: the host denied a call of the Write tool, which the phase worker made, decided by a permission rule in the host's settings, less than a minute into the attempt.
A driven phase runs with the host's permission prompts off, so a call the host would have asked about is denied instead; the drive ends a phase at its worker's own denied call, so that no worker goes around a denial or repeats it.
Background work: the host waits for it after the worker's last turn without a cap (set by the drive).
Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.
The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.
Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.
Next: either type resume: next in a session in the order's worktree, where the host asks about such a call instead of denying it; or admit the call in the host's own permission settings and type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds.
```

What `node scripts/drive.mjs status WO-999` then reports as the stop:

```json
{
  "reason": "dispatch-refused",
  "next": "The host denied a call the phase worker made, and the drive ended the phase there: no worker goes around a denial or repeats it. The drive's account names the call and the next step."
}
```

## The host denies a helper agent's calls; the worker ends without recording its phase, twice

Two helper agents are refused by the kit's own guard and then denied by the host. The phase goes on. The worker ends its turn with nothing recorded, the drive starts the phase once more, and the same happens.

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{"order":"WO-999","phase":"active","action":"next","worker":1,"transport":"claude-cli-print"}
{"order":"WO-999","phase":"active","action":"next","worker":2,"transport":"claude-cli-print"}
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "incomplete-bound",
    "next": "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop."
  },
  "attempts": 2,
  "budget": {
    "count": 2,
    "cap": 80,
    "remaining": 78,
    "countKind": "exact-observed",
    "unresolvedAdmissions": 0,
    "unlinkedChildren": 0,
    "uncountedRemainder": "unknown",
    "launched": 2,
    "launchedByHost": {
      "claude": 2,
      "codex": 0,
      "unattributed": 0
    },
    "retasked": 0,
    "source": "shared-hook-counter"
  },
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": null,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": {
        "input_tokens": 10,
        "output_tokens": 20
      },
      "costUsd": 0
    },
    {
      "usage": {
        "input_tokens": 10,
        "output_tokens": 20
      },
      "costUsd": 0
    }
  ],
  "why": [
    "WO-999: the last drive stopped at incomplete-bound, with 2 phase attempts recorded on claude.",
    "Stop: Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.",
    "Attempt 2: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; its process exited 0.",
    "Ended by: nothing the drive saw go wrong. The worker's process ended without recording the phase's completion; a worker that ends its turn while work it started is still running ends this way.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Helpers: the host denied 2 calls that helper agents made, which did not end the phase (Write ×1, Bash ×1). A helper reports its own denial to the worker.",
    "The host's own result counted 2 denied calls in the attempt.",
    "The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×2; by stop: driven-helper ×2. npm run features -- list prints what each stop protects and the one line that sets its level. A refused call returns its refusal to whoever made it and ends nothing.",
    "Commands: 3 observed, 2 failed; most often `gh <operand> <operand>` ×1, `git log <operand> <operand>` ×1.",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: type resume: next in a session in the order's worktree. A transition it records clears this stop, and drive: WO-999 goes on from there; typing it before then meets the same stop."
  ]
}
```

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: the last drive stopped at incomplete-bound, with 2 phase attempts recorded on claude.
Stop: Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.
Attempt 2: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; its process exited 0.
Ended by: nothing the drive saw go wrong. The worker's process ended without recording the phase's completion; a worker that ends its turn while work it started is still running ends this way.
Background work: the host waits for it after the worker's last turn without a cap (set by the drive).
Helpers: the host denied 2 calls that helper agents made, which did not end the phase (Write ×1, Bash ×1). A helper reports its own denial to the worker.
The host's own result counted 2 denied calls in the attempt.
The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×2; by stop: driven-helper ×2. npm run features -- list prints what each stop protects and the one line that sets its level. A refused call returns its refusal to whoever made it and ends nothing.
Commands: 3 observed, 2 failed; most often `gh <operand> <operand>` ×1, `git log <operand> <operand>` ×1.
Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.
The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.
Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.
Next: type resume: next in a session in the order's worktree. A transition it records clears this stop, and drive: WO-999 goes on from there; typing it before then meets the same stop.
```

What `node scripts/drive.mjs status WO-999` then reports as the stop:

```json
{
  "reason": "incomplete-bound",
  "next": "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop."
}
```

Typing the drive phrase again at this stop started 0 workers, and printed:

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "incomplete-bound",
    "next": "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop."
  },
  "attempts": 2,
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": null,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": {
        "input_tokens": 10,
        "output_tokens": 20
      },
      "costUsd": 0
    },
    {
      "usage": {
        "input_tokens": 10,
        "output_tokens": 20
      },
      "costUsd": 0
    }
  ],
  "why": [
    "WO-999: the last drive stopped at incomplete-bound, with 2 phase attempts recorded on claude.",
    "Stop: Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.",
    "Attempt 2: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; its process exited 0.",
    "Ended by: nothing the drive saw go wrong. The worker's process ended without recording the phase's completion; a worker that ends its turn while work it started is still running ends this way.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Helpers: the host denied 2 calls that helper agents made, which did not end the phase (Write ×1, Bash ×1). A helper reports its own denial to the worker.",
    "The host's own result counted 2 denied calls in the attempt.",
    "The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×2; by stop: driven-helper ×2. npm run features -- list prints what each stop protects and the one line that sets its level. A refused call returns its refusal to whoever made it and ends nothing.",
    "Commands: 3 observed, 2 failed; most often `gh <operand> <operand>` ×1, `git log <operand> <operand>` ×1.",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: type resume: next in a session in the order's worktree. A transition it records clears this stop, and drive: WO-999 goes on from there; typing it before then meets the same stop."
  ]
}
```

## The phase cannot start: the worker's dispatch is refused

The kit's own prompt hook refuses the lifecycle phrase. Before this order the stop said only that the dispatch was refused.

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{"order":"WO-999","phase":"active","action":"next","worker":1,"transport":"claude-cli-print"}
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "dispatch-refused",
    "next": "The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: next is not a legal dispatch in phase verified; legal actions: final-review."
  },
  "attempts": 1,
  "budget": {
    "count": 1,
    "cap": 80,
    "remaining": 79,
    "countKind": "exact-observed",
    "unresolvedAdmissions": 0,
    "unlinkedChildren": 0,
    "uncountedRemainder": "unknown",
    "launched": 1,
    "launchedByHost": {
      "claude": 1,
      "codex": 0,
      "unattributed": 0
    },
    "retasked": 0,
    "source": "shared-hook-counter"
  },
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": null,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": {
        "input_tokens": 10,
        "output_tokens": 20
      },
      "costUsd": 0
    }
  ],
  "why": [
    "WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.",
    "Stop: The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: next is not a legal dispatch in phase verified; legal actions: final-review.",
    "Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; its process exited 0.",
    "Ended by: the refusal the stop above states.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "The host's own result counted 0 denied calls in the attempt.",
    "The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×1. A refused call returns its refusal to whoever made it and ends nothing.",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: the reason above is the kit's own. node scripts/drive.mjs status WO-999 prints where the order stands; once the reason is cleared, type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds."
  ]
}
```

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: the last drive stopped at dispatch-refused, with 1 phase attempt recorded on claude.
Stop: The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: next is not a legal dispatch in phase verified; legal actions: final-review.
Attempt 1: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute, under no time limit; its process exited 0.
Ended by: the refusal the stop above states.
Background work: the host waits for it after the worker's last turn without a cap (set by the drive).
The host's own result counted 0 denied calls in the attempt.
The kit's own guard, not the host, refused calls in the attempt: DOTLN_HARNESS_REFUSED ×1. A refused call returns its refusal to whoever made it and ends nothing.
Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.
The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.
Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.
Next: the reason above is the kit's own. node scripts/drive.mjs status WO-999 prints where the order stands; once the reason is cleared, type drive: WO-999 again, which starts the phase with a fresh worker from what the worktree holds.
```

What `node scripts/drive.mjs status WO-999` then reports as the stop:

```json
{
  "reason": "dispatch-refused",
  "next": "The worker's automatic lifecycle dispatch was refused. The kit's reason: resume: next is not a legal dispatch in phase verified; legal actions: final-review."
}
```

## The attempt reaches its time limit

The instance's budgets set a limit of five seconds on a driven phase for this run; the worker is still working when it elapses.

`node scripts/drive.mjs WO-999 --host claude` (exit 0)

```text
{"order":"WO-999","phase":"active","action":"next","worker":1,"transport":"claude-cli-print"}
{"order":"WO-999","phase":"active","action":"next","worker":2,"transport":"claude-cli-print"}
{
  "workOrder": "WO-999",
  "stop": {
    "reason": "incomplete-bound",
    "next": "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop."
  },
  "attempts": 2,
  "budget": {
    "count": 2,
    "cap": 80,
    "remaining": 78,
    "countKind": "exact-observed",
    "unresolvedAdmissions": 0,
    "unlinkedChildren": 0,
    "uncountedRemainder": "unknown",
    "launched": 2,
    "launchedByHost": {
      "claude": 2,
      "codex": 0,
      "unattributed": 0
    },
    "retasked": 0,
    "source": "shared-hook-counter"
  },
  "limits": {
    "subagentCap": 20,
    "drivenSessionCeiling": 80,
    "drivenPhaseTimeoutMs": 5000,
    "tokens": null,
    "costUsd": null,
    "costScope": "phase-workers"
  },
  "routerUsage": {
    "totalTokens": null,
    "costUsd": null,
    "source": "host-router-counter-unavailable"
  },
  "workerUsage": [
    {
      "usage": null,
      "costUsd": null
    },
    {
      "usage": null,
      "costUsd": null
    }
  ],
  "why": [
    "WO-999: the last drive stopped at incomplete-bound, with 2 phase attempts recorded on claude.",
    "Stop: Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.",
    "Attempt 2: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute of a limit of less than a minute; the drive ended its process at that limit.",
    "Ended by: the attempt's time limit.",
    "Background work: the host waits for it after the worker's last turn without a cap (set by the drive).",
    "Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.",
    "The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.",
    "Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.",
    "Next: type resume: next in a session in the order's worktree, which the drive's limit does not end. A transition it records clears this stop, and drive: WO-999 goes on from there; typing it before then meets the same stop. The limit that ended the attempt is the shorter of its role's dispatch wall clock and budgets.drivenPhaseTimeoutMs (docs/control/budgets.json)."
  ]
}
```

`node scripts/drive.mjs why WO-999` (exit 0)

```text
WO-999: the last drive stopped at incomplete-bound, with 2 phase attempts recorded on claude.
Stop: Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop.
Attempt 2: resume: next as executor, started 2026-11-17 23:43 UTC, ran less than a minute of a limit of less than a minute; the drive ended its process at that limit.
Ended by: the attempt's time limit.
Background work: the host waits for it after the worker's last turn without a cap (set by the drive).
Recorded, as the drive saw it when the attempt ended: no completion of the phase; the order stood at phase active.
The order's worktree (../Targets/target-wo999 from the main checkout) holds no uncommitted change.
Kept beside the record: the worker's raw stream and what its process printed (records/state/local/drives/WO-999/<id>.events.jsonl). They hold the worker's commands and their output: an analysis: session reads them, a router does not.
Next: type resume: next in a session in the order's worktree, which the drive's limit does not end. A transition it records clears this stop, and drive: WO-999 goes on from there; typing it before then meets the same stop. The limit that ended the attempt is the shorter of its role's dispatch wall clock and budgets.drivenPhaseTimeoutMs (docs/control/budgets.json).
```

What `node scripts/drive.mjs status WO-999` then reports as the stop:

```json
{
  "reason": "incomplete-bound",
  "next": "Two workers ended without recording this phase's completion. Repair the cause and run its phrase yourself; a recorded transition clears this stop."
}
```

## What each phase worker was started with

The stand-in host records three things of its own start: whether it was started in print mode, the value of its permission prompts, and the ceiling on its wait for background work.

```json
{
  "launches": 7,
  "each": [
    {
      "backgroundWaitCeiling": "0",
      "printMode": true,
      "permissionPrompts": "none"
    }
  ]
}
```

With `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=1800000` set in the environment the drive runs in, the worker is started with that value:

```json
[
  {
    "backgroundWaitCeiling": "1800000",
    "printMode": true,
    "permissionPrompts": "none"
  }
]
```
