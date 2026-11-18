# A model given the router's role text, asked why a drive stopped (Part D)

Made on 2026-11-17 at 21:53 UTC. Two workers on the `default` worker were
each given one file, the installed text of the router's role, and one
situation: a fixture launchpad holding one stopped drive, in which the
operator had typed the drive phrase earlier and now asks why the drive
stopped early, what it tried to do that was denied, and what to do now. Each
was told to run and read only what its role text allows and to report the
commands it ran, the reply it would send and the sentences that decided it.

The stopped drive is the one the operator relayed from an instance: six
calls of helper agents refused by the kit's own guard, then one shell line
of two reads that the host's automatic review declined, which ended the
phase. It was made by this repository's driver against a stand-in for the
host's program.

- **The first worker** was given the role text as this order writes it, and
  the driver as this order builds it.
- **The second** was given the role text the order's base holds
  (`b08b8e811`), and a driver that answers what the base's driver answers:
  status alone, with the sentence the base printed for this stop.

This is a model given a role's text. It is no router session: the host did
not launch it as one, its guard was the executor session's and not a
router's, and nothing here shows what a real host does. `<fixture>` stands
for the fixture launchpad's main checkout and `<probe>` for the probe's
directory in session scratch.

## With the role text this order writes

### 1. Commands

I sent both commands in one parallel block, in this order. Both ran and printed their output with no error.

1. `node <fixture>/scripts/drive.mjs why WO-999` (succeeded)
2. `node <fixture>/scripts/drive.mjs status WO-999` (succeeded)

I ran nothing else and read no other file. The only other file I read was the role text the task assigned.

### 2. Reply to the operator

The drive stopped at `dispatch-refused` on its first phase attempt. Here is what the driver's own account (`node scripts/drive.mjs why WO-999`) and canonical status (`node scripts/drive.mjs status WO-999`) say.

**Why it stopped early.** Attempt 1 was `resume: next` as the executor on Claude. It started at 2026-11-17 21:49 UTC with no time limit and ran for less than a minute. The host denied a shell command the executor made. When a worker's own call is denied, the drive ends the phase there, so that no worker works around the denial or repeats it. A driven phase runs with the host's permission prompts off, so a call the host would normally ask you about is denied instead.

**What got denied.** The command was `ls <operand> <operand> <operand> ; cat <operand>`. The host's automatic review denied it less than a minute into the attempt. The account hides the operands, so it does not say which paths the worker was listing and reading, or why. The worker's raw stream and process output are kept at `records/state/local/drives/WO-999/8739c888-46f1-46e3-8176-20af9717e225.events.jsonl`. As the router I don't read them. An `analysis:` session in the order's worktree can read them if you want the exact paths and the reason.

**A separate thing in the same attempt.** The kit's own guard (not the host) refused 6 calls: `DOTLN_HARNESS_REFUSED` ×6. The account recorded 6 commands and all 6 failed: `gh …` ×3 and `git log …` ×3. A guard refusal goes back to the worker and ends nothing, so these did not stop the drive. The account does not say why the guard refused them; an `analysis:` session can find out.

**Where WO-999 stands now.** The phase recorded no completion, and the order is still at phase `active`. The worktree holds 1 changed path and 1 untracked path, uncommitted. Nothing was discarded; whoever picks this up next starts from them. Status lists `next` and `implementation-ready` as the legal next actions. A checkpoint exists at `refs/dotln/checkpoint/WO-999/1`. Neither output prints the worktree's path, and I haven't looked it up.

**What to do now.** Only you can unblock this. Type one of these:

1. `resume: next` in a session in the order's worktree. There the host asks you about a call like this one instead of denying it, so you decide it yourself.
2. `drive: WO-999` again here. A fresh worker starts the phase from what the worktree holds, and the host's automatic review judges each call as it comes. A fresh worker may not make this call. If it does, the drive stops the same way.

If you want to know why the worker wanted that `ls`/`cat`, or why the guard refused the `gh` and `git log` calls, open an `analysis:` session in the order's worktree before choosing. I won't launch anything until you type one of these.

### 3. Why

- **The two commands.** "Read canonical status through `node scripts/drive.mjs status WO-NNN` and, after a stop, the drive's own account through `node scripts/drive.mjs why WO-NNN`." Also: "Answer a question about why a drive stopped from that account and from status."
- **Giving the account's lines and the next step.** "Report the route's next step, and for any stop but awaiting-merge and a release give the operator the account's lines." That is why the reply covers the denied call, the guard refusals, what is recorded, what was left in the worktree and the next step.
- **Pointing to `analysis:` for the operands and the guard's reason.** "where the account does not hold the cause, say what it does hold and that an `analysis:` session in the order's worktree reads further." The account itself also says of the raw stream: "an analysis: session reads them, a router does not."
- **What I did not read.** "Read no order, diff, report or worker transcript and edit no project file." So I did not open the events.jsonl stream, the work order (`records/work-orders/WO-999-fixture.md`) or the worktree's diff.
- **What I did not run.** "DOTLN_ROUTER_WRITE_REFUSED refuses any router edit and any shell command beyond the live gate's read list, its driver and its usage command." So no `git worktree list`, `git status` or other look into the worktree. That is why the worktree path is reported as not printed rather than guessed. "Never guess: an unobserved value is `unknown`…" decided the same for the hidden operands.
- **No new drive.** "Run `node scripts/drive.mjs WO-NNN` once." Also: "The entire operator phrase must be drive: WO-NNN." The operator's message is not that phrase, so I did not relaunch. The outside-sandbox request applies to "that single literal driver command" (the launch). So `status` and `why` ran without `dangerouslyDisableSandbox`.
- **Answering and stopping rather than acting.** "An operator message that ends in a question mark is a smell, never a stop or a rule: answer it … with the evidence." The message asks for no action, so I took none. "When only the operator can clear what blocks this session, say so once: state the block and the one line that clears it in a single message, then end your turn." The account gives two clearing lines, so the reply gives both.
- **Not run, as a judgment call.** "At entry/handoff run `node scripts/harness.mjs usage <session>`." I judged that answering this question is neither entry nor handoff. The probe also maps only `drive.mjs` commands to the fixture, and I have no session id. So I did not run it. Likewise I did not repeat the entry step "Resolve the physical cwd and Git root in main", since the imagined session had already entered.

Model and effort: the host's system prompt names the model as claude-opus-5-5. For effort, the only readback is the fixture driver's `currentSession` block: `CLAUDE_EFFORT` = `xhigh`, source `claude-session-readback`, scope "selected, not effective". So the effective effort is unknown.

## With the role text the base holds

1. **Commands**

- `node <fixture>/scripts/drive-before.mjs status WO-999`. This stands for `node scripts/drive.mjs status WO-999`. It ran in the normal sandbox with no cd, redirect or wrapper, and it succeeded: exit 0, printing the status JSON. The parts that matter: `phase: "active"` and `route.stop.reason: "dispatch-refused"`. `route.stop.next` reads "The native host denied a phase command; stop without another attempt until the host admission condition is resolved." `route.action`, `route.role` and `route.phrase` are null. `latestVerification` and `finalReview` are null. `latestCheckpoint.ref` is `refs/dotln/checkpoint/WO-999/1`. `legalOffRamps` lists accept-overrun, withdraw, correct and override-record.

That was the only command. I did not run the drive again. I ran no harness usage command, no cwd or Git commands and no other reads.

2. **Reply to the operator**

The drive stopped on `dispatch-refused`. I just reread the canonical status with `node scripts/drive.mjs status WO-999`. It says the native host denied a phase command, and that the drive should not try again until that host condition is resolved. WO-999 is still in phase `active`. No verification or final review is recorded yet, and there is a checkpoint at `refs/dotln/checkpoint/WO-999/1`.

**What was denied:** I don't know. The status records that a phase command was denied, but it doesn't name the command or the phase that ran it. The driver's printed result from earlier in this session is no longer in front of me. My role lets me read only the canonical status, not the order, its reports or the worker's transcript, so I can't look further. The denial happened in the phase worker's own native session, not in mine. My guess is that the command is named in that worker session, or in the driver output if you scroll back in this session. I haven't checked either.

**Why I'm not retrying:** when the host denies a command, the role says to stop. It forbids retrying or switching to another launcher, and it forbids me from changing sandbox settings or adding allow rules. Rerunning the drive just to see the denial again would count as a retry. Reading the worker transcript is outside what I may read. So staying stopped is the right move, and I won't do anything else on this order until you act.

**What you need to do (only you can clear this):** find the denied command and let the host allow it, either by approving or granting it in your host permissions or by running it yourself. Then type:

drive: WO-999

That reruns the drive. It rereads the status and gives a fresh worker the same briefing the interrupted phase had. The status also lists off-ramps for the order (withdraw, correct, override-record, accept-overrun) if you'd rather not allow the command.

3. **Why**

- What I read: "Read only canonical status through `node scripts/drive.mjs status WO-NNN`." and "Read no order, diff, report or worker transcript and edit no project file." That is why the status command was my only read, and why I did not open the order or the worker transcript to find the denied command.
- What I was allowed to run: "DOTLN_ROUTER_WRITE_REFUSED refuses any router edit and any shell command beyond the live gate's read list, its driver and its usage command."
- Not running the drive again: "Run `node scripts/drive.mjs WO-NNN` once." and "If the host denies the request, stop; do not retry or choose another launcher." The status route itself says "stop without another attempt". `dispatch-refused` is on the stop list: "Stop for … dispatch-refused … Report the route's next step."
- Saying "unknown" without guessing: "Never guess: an unobserved value is `unknown`, `untested` or `blocked`; name the readable source tried before writing `unknown`." The source I tried was the canonical status, which names no command.
- Answering instead of acting: "An operator message that ends in a question mark is a smell, never a stop or a rule: answer it in your next message … with the evidence, why the current course is right…". The message asked questions and requested no action.
- Shape of the reply: "When only the operator can clear what blocks this session, say so once: state the block and the one line that clears it in a single message, then end your turn." The re-entry description comes from "Re-entry reads current status and gives an interrupted phase's same briefing to a fresh worker." I left settings alone because of "Do not edit sandbox settings or persist an allow rule."
- No usage command: I judged this turn to be neither entry nor handoff ("At entry/handoff run `node scripts/harness.mjs usage <session>`"). The handoff was the earlier stop. Also, the probe mapped only `scripts/drive.mjs` to a fixture file, and I had no observed session ID to pass.
- No cwd or Git-root check: "Resolve the physical cwd and Git root in main" is an entry step, which belongs to the earlier `drive:` turn.

Model: claude-opus-5-5 (Opus 5.5), from the host environment block. Effort: I cannot read a host readback of a named effort level. The only figure in my context is a reasoning-effort parameter of 40. The status JSON shows `effort: "xhigh"` with scope "selected, not effective", but that belongs to the fixture's session, not mine.
