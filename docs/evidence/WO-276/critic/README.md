# The meta critic, as WO-276 built and ran it

Recorded on 2026-11-12, during WO-276's execution, at the operator's request
that the way this critic is built and run be kept for later work orders
(capture `wo276-keep-the-critic-for-later-orders-2026-11-12.txt`, SHA-256
`ba498fe7d5031b2d96e5add6f4232bf65195aee3f9eddd121e37b8fd12d82572`). It
states what was run from the thirtieth launch on. The decisions that shaped
it are [D100](../decisions.md#wo-276-d100--correction-the-critic-is-a-critic-of-the-executors-conduct-not-of-the-implementation-its-brief-is-rewritten-and-the-twenty-ninth-critics-three-points-and-rolling-review-44s-two-notes-are-judged), [D101](../decisions.md#wo-276-d101--correction-the-executor-writes-nothing-about-its-own-work-into-the-critics-prompt-the-critic-reads-the-session-transcripts-and-the-repository-itself-under-a-fixed-charter)
and [D107](../decisions.md#wo-276-d107--correction-the-whole-change-reviewers-stay-on-their-clock-and-hold-no-gate-the-attacker-of-a-part-is-launched-when-the-part-has-something-to-attack-not-on-a-clock); the planning follow-up that would
make it a kit capability is D077's, extended by [D110](../decisions.md#wo-276-d110--the-meta-critic-is-kept-in-the-repository-as-it-is-built-and-run-and-d077s-follow-up-gains-it-as-the-first-row-of-the-kinds-table).

## What it is

A second model, on the other provider, that judges the executor's conduct
while an order is being executed: its behavior, its judgment, its
decision-making and its attention to detail. It is not a reviewer or a
tester of the code. It reads the session transcripts and the repository
itself and returns three sections: criticisms (at most seven, each with its
evidence), what to keep (at most three) and the one change to make first.

## The two files

- [charter.md](charter.md) is the whole of what the critic is told, apart
  from the worker's standing rules the kit puts at the head of every
  worker's prompt. It says who the critic is, where the sources are, what to
  judge, the rules it works under and the form of its report. The names
  between `@` signs are filled by the launcher: the order, the checkout,
  the transcripts' directory, the order's file, the cadence and the launch
  number. Nothing else changes between launches.
- [launch.mjs](launch.mjs) fills the charter and launches one Codex worker
  with it, read-only, on the model and effort the instance's worker table
  gives the name it is passed (`astra` by default), and saves the worker's
  last message as `docs/control/local/reviews/<order>/critic-<n>.md` in the
  ignored reviews lane.

## How it is run

```
node docs/evidence/WO-276/critic/launch.mjs <order> <n> --since <YYYY-MM-DD>
```

in the background, from the checkout the order is executed in. `--print`
writes the charter as it would be sent and launches nothing. A launch takes
about fifteen to twenty minutes (the thirtieth to thirty-second took 15, 18
and 15) and counts as one worker use. When the Codex run ends the launcher
closes the background server Codex leaves running, if no other Codex process
is alive, and prints what it closed ([D143](../decisions.md#wo-276-d143--the-kit-closes-the-background-server-codex-leaves-running-the-sixteenth-complete-run-is-stopped-for-that-change-the-critics-record-and-clock-are-brought-up-to-date-in-the-repair)).

For WO-276 the thirty-third launch on is made with this file; the thirtieth
to thirty-second were made with the same charter and launcher from session
scratch, and `launch.mjs --print` for this order gives that charter byte for
byte.

## The rules that made it useful

These are the executor's, not the critic's, and the first two are the
operator's corrections.

1. The critic judges conduct, not the implementation. Before the thirtieth
   launch, a point of the twenty-ninth critic about a pairing rule was
   reported to the operator as an implementation defect (D100).
2. The executor writes nothing about its own work into the critic's prompt:
   no status, no summary, no chosen decisions or line ranges. Until the
   thirtieth launch every critic was given a status section the executor
   wrote, and a critic whose premises are written by the one it judges is
   not independent (D101).
3. The report is given to the operator whole before the executor answers
   it, and each point is then answered on its own: accepted, with what
   changes, or declined, with the reason.
4. It runs on a clock, every 75 minutes from its own last launch, and
   nothing waits for it, a gate included. A launch that falls due while a
   gate is live goes out when the gate ends, because the session's hook
   admits only reads until then (D107). The clock runs in every dispatch
   that works on the order, a repair included: the repair of VER-003 ran
   three hours without a critic until the operator told its executor to
   start one, and the clock ends when the passing run is in: a critic
   launched after that repair's passing run was stopped on the operator's
   direction ([D145](../decisions.md#wo-276-d145--the-seventeenth-complete-run-passes-on-the-candidate-the-repair-of-ver-003-leaves-the-restarted-daemon-stayed-flat-under-it-a-critic-launched-after-the-pass-is-stopped-on-the-operators-direction); [D141](../decisions.md#wo-276-d141--the-fifteenth-complete-run-is-stopped-on-the-operators-direction-what-is-and-is-not-established-about-the-file-events-daemons-memory-the-thirty-sixth-critics-five-points-and-the-two-things-this-session-could-not-do-itself)).
5. What a critic changes in how the executor works is recorded in the
   order's decisions and carried in its standing file, so that a session
   that resumes works the same way.
6. Each critic's points are added to [criticisms.md](criticisms.md) when
   the decision that judges them is written. The thirty-sixth critic's were
   added an hour after their decision, when the operator asked ([D143](../decisions.md#wo-276-d143--the-kit-closes-the-background-server-codex-leaves-running-the-sixteenth-complete-run-is-stopped-for-that-change-the-critics-record-and-clock-are-brought-up-to-date-in-the-repair)).

## What it needs, and what was checked before the first launch

- The Codex CLI, signed in, and a name in the instance's worker table for
  it (`npm run worker -- show <name> --provider codex` prints the model, the
  effort and the standing rules the launcher uses).
- Claude Code's session transcripts for the checkout. The launcher looks
  under the user's home, in `.claude/projects/`, for a directory named by
  the checkout's path with each separator a hyphen. That naming was
  observed for this order's worktree alone; `--transcripts` names the
  directory elsewhere.
- Before a worker on another provider was pointed at the transcripts, two
  things were checked (D101): that the read-only sandbox can read them and
  cannot write beside them, and that no row of them holds a term of the
  instance's private list in its refuse class. A later order repeats both
  for its own transcripts.

## What it found

Every point of every critic, with the decision that judged it and the
accepted ones grouped by class for a planning pass to mine, is in
[criticisms.md](criticisms.md).

The thirtieth critic made five points, the thirty-first four and the
thirty-second three, each with the transcript row or record line it rests
on, and all twelve were accepted: results reported before they were
established, gates started with known work unfinished, a build's failure
hidden by a pipe, a resume record left stale across a compaction, an
inference given to another worker as fact, an as-built record filed before
its gates, and a figure joined to the wrong sample among them. D103, D106
and D108 record the answers.

## Two kinds of critic, and a use for both

The operator noted on 2026-11-12, on seeing the two sides of
[criticisms.md](criticisms.md) apart, that there may be a use for both kinds
(capture `wo276-use-for-both-kinds-of-critic-2026-11-12.txt`, SHA-256
`33e552f7b3cf1ce200c0823364f3d8268cc7b11b11f5a7ef121d94045ada5438`).

- **The independent critic** is the one these files hold: launches 30 on,
  told nothing by the executor, reading the transcripts. It finds what a
  record says against what was done.
- **The briefed critic** is launches 1 to 29: told the state of the work,
  the hours and the plan by the executor, and allowed to judge the approach.
  It found what the independent kind has not: forecasts that did not add up,
  suites chosen or timed poorly, timed comparisons not held to one
  difference, repairs checked against too few consumers. Its brief is not
  kept as a file: D040 and D100 describe it, and the session's transcripts
  hold each prompt as it was sent.

The two kinds' accepted findings overlap in one class, a recovery record
that does not match what was done. What stands against the briefed kind as
it was run is the operator's own objection (D101): a critic whose premises
are written by the one it judges is not independent. Whether a briefed
critic can be told the plan and the hours from the records, by a command,
and not by the executor, is open.

## Limits of this copy

- The charter's paths are the default document roots (`docs/`), and the
  executor is named as Claude Code. An instance with other roots, or an
  executor on another host, edits the charter.
- The launcher's Codex flags were copied from the review helper's own
  launch (`scripts/lib/review-worker.mjs`) as it stood in this order and do
  not follow it. It imports the kit's `scripts/lib/codex-background.mjs` to
  close what Codex leaves, so it runs only from a checkout that holds that
  module.
- The cadence is kept by the executor, by hand and by a background timer
  before it ends a turn; nothing in the kit schedules it.
