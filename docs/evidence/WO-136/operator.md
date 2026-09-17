# WO-136 operator session

**Completed 2026-09-17:** the original session used all forty launches and
forty approvals in 59 minutes 7.940 seconds. Its result is
[inconclusive](../../discovery/authority-boundary-2026-09-17.md). Do not run
or continue this session again: the launch budget is exhausted. The commands
below document the completed procedure. Any next experiment needs the
post-close planning decision and a new bounded authorization.

No changes to normal Claude or Codex settings are needed. This command
creates disposable Git worktrees, a random credential sentinel, a local bare
remote and a scratch copy of the existing target harness. Claude sandbox
selection is written only to the scratch project's local settings. Codex
sandbox selection is a child launch flag. The normal checkout's settings and
the operator's user settings are never rewritten.

After the executor reports the deterministic checks passed, run from an
ordinary terminal opened outside either agent:

```sh
cd /path/to/DotLn-wo136
DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs --authority all --date 2026-09-17
```

**To run the full matrix, type `launch` and press Enter at every test prompt.**
Wait for its result and the next prompt, then choose `launch` again. There are
forty tests; each child can take up to two minutes. The probe exits automatically
after the last test or when its budget is spent.

The three choices are alternatives, not a sequence of instructions:

- `launch`: run the test shown in this prompt. This is the choice to keep testing.
- `skip`: leave this test unmeasured and move to the next prompt.
- `stop`: end the entire session early. Do not choose this merely because one
  test finished or returned `ambiguous`.

Blank input and other words reprompt without skipping a test. Each `launch` is
individually authorized, including every sandbox-off child. The session has a hard budget
of forty launches, forty approvals and 120 minutes including waiting. A failed
launch can be attempted twice; retries consume the same forty-launch total,
so they can leave later cells unavailable. A completed cell is not repeated.
Native escalation requests are not approved by this probe. In print/exec
mode a denied request is recorded separately from a human prompt; unsupported
prompt telemetry stays unavailable.

The child harnesses use their existing authentication through the ordinary
CLI. The probe never inspects or copies those credentials. It tests only the
random sentinel, loopback and the local fixture remote. A sandbox-off worker
is a trusted experiment, not a claim of OS confinement.

Run files and the matrix are saved after each attempt under
`docs/discovery/authority-boundary-2026-09-17/` and its sibling `.json`/`.md`.
The files retain shapes and host observations, not raw transcripts, sentinel
contents, absolute scratch paths, session identifiers or hostnames. Repeating the
same command/date reports when the session is closed; it cannot reset the
budget. `stop`, Ctrl-C and handled termination signals close the session and
stop the owned child process group. A hard kill or power loss can bypass
cleanup: recovery records the missing observation, closes the session and
refuses further launches because cleanup is unconfirmed. It does not assume
an orphan has stopped or automatically relaunch a worker.

If you deliberately typed `stop` at a prompt and want to continue, use:

```sh
DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs --authority all --date 2026-09-17 --continue-after-stop
```

This flag attests that you stopped at a prompt. It resumes the same session only
when every reserved attempt returned normally and the original budget remains.
It preserves completed tests, prior choices, launch/approval counts and the
original start time. It revisits skipped tests; it never retries a completed
ambiguous result. It refuses uncertain cleanup, signal/input interruptions,
exhausted budgets and missing observations. Do not delete run files, change the
date or reset the session to get a fresh budget.

The session began at 20:36:52 UTC and ended after 3,547,940 ms. Its clean
operator stop was explicitly continued within the original budget. The first
ambiguous result remains unchanged. Two later launch failures were retried,
leaving the final two Codex sandbox-off cells unavailable when the launch cap
was reached. No native escalation was approved. The final packet and executor
record supersede the earlier preparation handoff.

The outside terminal matters because a child CLI launched through a
sandboxed shell may inherit the outer sandbox. The experiment needs to
attribute a refusal to the child harness under test. A model API alone
doesn't execute local tools; an agent SDK that runs a local harness still
uses that harness's controls.
