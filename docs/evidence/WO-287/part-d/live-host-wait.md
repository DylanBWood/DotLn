# The real host's wait for background work, at its default and lifted (Part D)

Made on 2026-11-17 by two runs of the host's own program (version
2.1.326, permission mode `auto`), started together in two empty directories of
session scratch, and written at 22:32 UTC. Each is a print-mode run
(`claude --print`, on the `sonnet` alias, with the stream kept) given the same
prompt and the same rules: the Agent tool and `node -e` commands allowed, and
`touch` denied by a rule.

The prompt, whole:

> Do exactly this and nothing else. Step 1: call the Agent tool once, as a background agent (run_in_background true), with subagent_type general-purpose and this prompt: "Do these five things in order, each as its own Bash call, and go on whatever any of them returns. First, run `touch denied-probe.txt`. Then run `node -e \"setTimeout(() => {}, 230000)\"` with a timeout of 240000 milliseconds. Then run that same node command a second time, and then a third time, each with the same timeout. Then reply with exactly the text AGENT-FINISHED." Step 2: immediately end your turn by replying with exactly the text LAUNCHED. Do not wait, poll, sleep, read the agent's output or call any other tool. Step 3: if you are later given that agent's result, reply with exactly FINAL-RESULT: followed by the agent's reply.

So in each run the main conversation starts one background agent and ends its
turn at once. The agent makes one call a rule denies, then three commands of
230 seconds each, which is 11 min 30 s of work after the main turn has ended.
The only difference between the runs is one value of the environment,
`CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS`: unset in the first, `0` in the second,
which is what the drive now sets for a Claude phase.

## With the host's default wait

The ceiling is unset, as it was in every phase a drive started before this order.

- Ran from 22:19:44 to 22:29:50 UTC, 10 min 6 s; the host's process exited 0.
- The background agent made 4 shell calls. Its notifications, in order: completed, completed, stopped, stopped.
- The run's result rows, in order: `LAUNCHED`.
- What the host printed on standard error: "Background tasks still running 10m after the last turn (subagent "Run sandbox probe commands"); stopping them. Set CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0 to wait indefinitely."
- The host's denial rows: the Bash tool, with a subagent's id, decided by `rule`.
- What the drive's reader makes of the same rows: it would not end the phase; 1 denial of a helper's call (Bash, helper, rule); no denial of the worker's own call; the host's own count of denied calls, 1.

## With the wait lifted

The ceiling is `0`.

- Ran from 22:19:43 to 22:31:32 UTC, 11 min 49 s; the host's process exited 0.
- The background agent made 4 shell calls. Its notifications, in order: completed, completed, completed, completed.
- The run's result rows, in order: `LAUNCHED`; `FINAL-RESULT: AGENT-FINISHED`; an empty one.
- What the host printed on standard error: nothing.
- The host's denial rows: the Bash tool, with a subagent's id, decided by `rule`.
- What the drive's reader makes of the same rows: it would not end the phase; 1 denial of a helper's call (Bash, helper, rule); no denial of the worker's own call; the host's own count of denied calls, 1.

## What the two runs show

- The host stops a print-mode run's background agent ten minutes after the
  main conversation's last turn, drops what it had done, and exits 0. A drive
  reads that as a worker that ended without recording its phase.
- With the ceiling at `0` the host waits for the agent, and gives its result
  to the main conversation as a new turn.
- A call the host denies inside a subagent carries that subagent's id on its
  denial row. The drive's reader counts it as a helper's denial and reads on;
  before this order it ended the phase at such a row.

They do not show a whole phase of the kit, a real executor with its real
reviewers, under the lifted wait.
