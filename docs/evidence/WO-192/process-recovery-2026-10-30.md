# WO-192 process recovery, 2026-10-30

During the executor phase the operator stopped the session and asked what it
was trying to accomplish. The session could not have answered from what it was
doing. The operator asked for the exchange and the way out of it to be recorded
so that DotLn can later build it into its machinery. WO-192-D091 owns the
follow-up that carries this note to planning.

The role text was right throughout. The session did not follow it, and nothing
in the machinery noticed. That is why this is a machinery note and not only a
correction.

## What happened

Times are UTC, from the session transcript, gate rows and attempt receipts.

| Time  | Event |
| ----- | ----- |
| 18:53 | Three reviews of the integrated tree start, before the repairs they would prompt. They report 28 findings by 19:12. |
| 19:45 | Live attempt 46 starts on Claude while the code is still changing. Criterion 17 asks for live runs on the final code. |
| 20:37 | Attempt 46 ends at the fixture's budget, $20.40. |
| 20:39 | Live attempt 47 starts. |
| 22:12 | Attempt 47's verifier report names 19 unowned temporary-root sites, and the seconds-long `declarations` check reproduces them. Neither attempt could have passed with them. |
| 22:13 | Attempt 47 is stopped at $25.05 with a repair unfinished. Its final total is unknown. The session moves the complete gate ahead of the live runs on its own judgment and mentions it in passing. |
| 22:22 | Complete gate 1 starts. All three reviewers should have been restarted first, and were not. |
| 22:37 | Gate 1 fails after 15 min on a stale file count and on one real guard defect. |
| 22:46 | Complete gate 2 starts, again with no reviewer restart. |
| 22:58 | Gate 2 fails after 12 min on a stale role list. |
| 22:59 | The operator asks what changed, recalling live runs before the gate. |
| 23:02 | The operator tells the session to stop, with a third gate one command away and still no reviewer restart. |
| 23:04 | The operator asks for the goal and for steps to reach it, and asks what they are missing. |
| 23:12 | The operator accepts the plan, says continue, and asks for this note. |

## Why it happened

1. **Working from the newest failure instead of the finish line.** The session
   never wrote out the remaining work from the order's criteria. Each step
   answered the last failure.
2. **Replacing the written procedure with an invented rule.** "Cheapest checks
   first" appears nowhere in the role. The role says that after any new code
   change, including a repair after a failed gate, all three reviewers restart and
   finish before the next complete run. The consistency reviewer traces count and list pins into tests,
   the exact shape of the stale pins in both failed gates. The operator had
   pointed at this reviewer earlier that day.
3. **Paying for evidence the criterion could not accept.** Live runs on code
   still changing cannot satisfy "on the final code". Attempts 46 and 47 cost at
   least $45.45.
4. **Fixing a real problem with the wrong remedy.** Paid runs did need a free
   filter first. The filter was the quick checks and the reviewers, not a
   complete gate. A live run does not contain the complete gate: its target gate
   is a one-line check and only `test:docs` runs beside it.
5. **Stating causes before checking them.** Four claims were retracted in under
   an hour: that a fixture lacked a helper it had, that a red complete gate makes
   a live run unwinnable, that a refused snapshot is silent, and that 16 suites
   were unjudged when 29 rows were.
6. **Losing track of whose requirement was whose.** The live reruns were the
   session's own addition to criterion 17, and both hosts had passed on
   2026-10-26. The session said so once, at 21:12, in a long status report, and
   did not raise it again when it changed the order of work.

This is not the first time on this order. WO-192-D072 records repeated
validation-order rework and WO-192-D084 records the operator's assessment of the
session of 2026-10-26.

## The way out

The operator forced this sequence by asking for a goal and steps. It worked, and
it can be run without being forced.

1. **Stop.** End background commands too, and start nothing.
2. **State the goal in one sentence from the order's criteria, not from memory.**
   List which criteria are open.
3. **Lay the actual sequence beside the written procedure,** using the transcript
   and gate rows. The first divergence is the diagnosis.
4. **Name each remaining step's source:** a criterion, a procedure line, the
   operator's words, or the agent's own choice. Own choices are the operator's
   to keep or drop.
5. **Build the remaining steps from those sources,** each with an exit condition
   and what happens on failure.
6. **Cost it** with measured figures, label estimates and compare the total with
   the remaining dispatch bound.
7. **Show the operator, name the decision that is theirs, and wait.**
8. **Then hold to it.** Reports name the step. Nothing is reordered without
   asking. No paid run starts unless the quick checks are green on that exact
   code. No cause is stated before a command shows it.

The plan this produced for WO-192 keeps the live runs before the complete gate,
as the operator had expected. The gate goes last because it has to judge the
final code.

## What followed

The plan then ran as written, and its first steps paid for themselves.
WO-192-D094, D097, D098 and D099 record the rounds.

- **Reviewers before the next gate.** The restarted consistency reviewer showed
  the next complete gate would have failed on a stale pin, and that every router
  session hit a bug in the usage writer. Both were found without a gate.
- **Rounds converged.** New findings fell from 34 in the second round to 15 in
  the third, and most repairs held under deliberate attack. WO-192-D097 records
  the one that held with a hole and the two D094 statements a recheck refuted.
- **A repair is a change like any other.** D098's fix for a false merged reading
  would have blocked every real target order. All three reviewers caught it in the
  recheck that followed, before any paid run on that code, and neither the live
  fixture nor its own regression could have. A recheck after a repair is not
  ceremony.
- **A live run still found what review could not.** Claude passed all five roles
  on its first run on reviewed code. The usage repair had been tested only at the writer, as a reviewer
  had warned, so a router's usage command still failed on the real path, and Codex
  declined release close for a reason nobody has seen (WO-192-D101 and D102). Quick checks and reviewers
  made the paid runs worth having; they did not replace them.
- **Probes need the same limits as work.** Two reviewers' read-only probes each
  attempted a real `git push`, through a fixture clone whose origin was a real
  GitHub URL. Both were refused and nothing was published. Telling a reviewer to
  write nothing under the repository did not cover this.
- **A gate can fail with the code right.** The complete gate of 05:57Z reported a
  suite timeout because the Mac idle-slept 13 minutes in (WO-192-D103). The session
  keeps the Mac awake only during a turn, and the role ends the turn to wait for a
  gate. `pmset -g log` showed it, after the session had chased a number that fit by
  coincidence. The host's exit 0 was the session's own trailing `date`: the gate's
  line was the result.

## What to build

These are candidates for planning, not decisions. A search of `scripts/` and
`packages/skeleton/src/` found the reviewer rule only as role text, with
`scripts/test-process-debt.mjs` pinning its wording.

1. **Complete-run admission reads the reviewers.** `npm test -- --review` refuses
   or warns when code has changed since all three reviewers last finished.
2. **Paid-run admission.** A live qualification refuses to start unless
   `declarations` and `test:docs` rows pass at the current code identity.
3. **Live receipts carry code identity.** Completion compares it with the final
   identity, which makes "on the final code" a check instead of a sentence.
4. **The finish line in every briefing.** `resume:` and status name the open
   criteria and the next procedure step, and that survives compaction.
5. **A recovery phrase.** An operator phrase beside `analysis:` that stops
   background work, runs steps 1 to 7 above and waits.
6. **Requirement provenance.** A clause added during execution records whether
   the operator or the agent proposed it.
7. **Derived pins.** Tests read hook counts and role lists from their source, so
   adding a role does not fail unrelated suites. WO-192 converted the pins it met;
   the rule is still unwritten.
8. **Probes that cannot publish.** A reviewer's brief forbids network writes in so
   many words, and publication fixtures cannot reach a real host (WO-192-D099).
9. **Gates that survive sleep.** A gate holds a sleep assertion for its length, and
   a clock gap is reported as sleep rather than as a suite timeout (WO-192-D103).
