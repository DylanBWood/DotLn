# A real router session at a drive that stops (Part D)

Made on 2026-11-17 from 22:19:59 to 22:20:51 UTC by a script in session
scratch, and written at 22:24 UTC.

**What is real.** The router is the host's own program (version
2.1.326, model `claude-opus-5-5`), started by the kit's own launcher as a
drive's router is started, with the one phrase `drive: WO-999`, in a fixture
launchpad whose main checkout holds an installed harness: its hooks, the
router's guard among them, and the role's installed text. The driver it runs
is this repository's. The session's permission mode was `auto`, the
host's own for this account.

**What is a stand-in.** The phase worker the driver launches. A stand-in for
the host's program plays one attempt of an executor: six calls of helper
agents refused by the kit's guard, then one shell line of two reads that the
host's automatic review declines. No model ran as the phase worker. The
fixture's own local settings admit the three driver forms the router's role
names, because a print-mode session can be asked nothing.

**What it shows.** What a router tells the operator when a drive stops, with
no question asked. It does not show a second turn in which the operator asks
why, which a print-mode run of one phrase cannot hold; a model given the role
text was asked that question in `router-role-probe.md`.

## How the session ended

The router's process exited 0 with no error, no refusal and no call
refused by its guard. The drive it ran stopped at `dispatch-refused` after
1 attempt, and the stand-in was started 1 time. The host reported a cost of
0.39 dollars for the router's session.

## What the router ran, in order

1. `pwd -P`
2. `git rev-parse --show-toplevel`
3. `node scripts/harness.mjs usage '<id>'`
4. `node scripts/drive.mjs status WO-999`
5. `node scripts/drive.mjs WO-999` (run_in_background, dangerouslyDisableSandbox)
6. Read: <its own task output>
7. `node scripts/drive.mjs status WO-999`
8. `node scripts/harness.mjs usage '<id>'`

## What the router told the operator

Its last message, whole. `<fixture>` stands for the fixture launchpad's main
checkout and `<id>` for an identifier.

> The WO-999 drive stopped after one executor attempt (`resume: next`) because the host denied a shell command the worker made. Nothing was committed and the order is still in phase `active`. Only you can clear this.
>
> **Transitions**
> - `active` → executor launched (claude, worker 1) → stopped at `dispatch-refused` after under a minute, with no completion recorded.
>
> **Why it stopped (the drive's own account)**
> - **Denied call:** `ls <operand> <operand> <operand> ; cat <operand>`, made by the phase worker. The host's automatic review denied it, because a driven phase runs with permission prompts off and a call that would have prompted is denied instead. The drive ends the phase at that point so no worker goes around or repeats a denial.
> - **Kit guard refusals:** 6 calls were refused with `DOTLN_HARNESS_REFUSED` (stop `driven-helper`), mostly `gh <operand> <operand>` ×3 and `git log <operand> <operand>` ×3. All 6 observed commands failed. These refusals didn't end the attempt; the host denial did. `npm run features -- list` prints what that stop protects.
> - **Worktree state:** `Targets/target-wo999` has 0 changed paths and 1 untracked file, uncommitted, and nothing was discarded. The account doesn't say why the worker's commands were refused.
> - **Raw worker stream:** saved at `records/state/local/drives/WO-999/<id>.events.jsonl`. A router doesn't read it; an `analysis:` session in the order's worktree can.
>
> **Next step.** In a session opened in `Targets/target-wo999`, type:
>
> `resume: next`
>
> There the host asks you about a call like this one instead of denying it. The other option is to type `drive: WO-999` again here, which gives a fresh worker the same briefing. That worker may avoid the denied call, but the same automatic review still judges each call.
>
> **Cost:** all router and worker token and cost counters are unknown (the host doesn't expose them). The run took about 36 seconds and used 1 of the 80 allowed driven sessions; the router launched 0 of its 20 subagents.
>
> **Outcome:** the goal was to drive WO-999 to the merge point, and that wasn't reached.
