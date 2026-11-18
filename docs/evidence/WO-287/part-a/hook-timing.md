# Part A: what a permission-hook call costs before and after

Three runs on 2026-11-17 by scripts in session scratch. Each builds the
harness suite's fixture from a checkout's built runtime and scripts, emits
the harness into it with that checkout's own emit, and runs the emitted
`.claude/hooks/permissions.mjs` with three calls: a read, a shell command
`ls` and a write. Two figures are read for each call: the hook's own reading,
`hookTiming.durationMs` in its journal row, which is the hook process's
uptime when it appends that row; and the wall time of the spawn.

The three arms:

- **base**: the main checkout at the order's base commit (`b08b8e811`), with
  its own built runtime. Its emitted hook is 40,710 bytes and carries no
  levels.
- **after**: this worktree, as a core root. Its emitted hook is the same
  40,710 bytes and carries no levels: a root that refuses on every stop
  writes none.
- **after, instance**: this worktree's build with the fixture as an exported
  instance. Its emitted hook is 42,361 bytes and carries the fifty stops an
  instance lowers.

A hook reads no file for its levels in any arm.

## Run 3: call by call, the statistic a difference can be read from

16:29:30 UTC (`hook-timing-interleaved.mjs`). The three fixtures are
built first. Every iteration then runs the same call once in each arm, in an
order that rotates, so that drift on the host falls on the three alike; 60
iterations a call after 3 that are left out. Load averages 5.61, 5.87, 5.81 before and
5.46, 5.76, 5.76 after. The statistic is the median of the 60 per-iteration
differences between two arms, with the quartiles of those differences.

The hook's own reading, median (first to third quartile), in milliseconds:

| Call | base | after | after, instance |
| --- | --- | --- | --- |
| read | 80 (79.1 to 81.1) | 80.8 (79.7 to 82) | 80.4 (79.8 to 82) |
| shell | 90.2 (89 to 91.6) | 90.3 (89.1 to 91.8) | 90.7 (89.2 to 92.1) |
| write | 88.1 (86.8 to 89.6) | 88.9 (87.6 to 90.2) | 89.1 (87.5 to 90) |

The per-iteration differences of that reading, median (first to third
quartile), in milliseconds:

| Call | after less base | instance less base | instance less after |
| --- | --- | --- | --- |
| read | +0.9 (-0.8 to +2.3) | +0.5 (-0.7 to +2.1) | +0.2 (-1.1 to +1.2) |
| shell | +0.2 (-0.5 to +1.3) | +0.5 (-1 to +1.5) | +0.1 (-0.9 to +1.1) |
| write | +0.8 (-0.3 to +2.4) | +0.9 (-1.2 to +2.1) | +0.2 (-1.7 to +1.6) |

The same differences of the spawn's wall time:

| Call | after less base | instance less base | instance less after |
| --- | --- | --- | --- |
| read | +0.5 (-0.6 to +2.5) | +0.5 (-0.9 to +1.8) | +0.1 (-1.3 to +1.2) |
| shell | +0 (-1 to +1.3) | +0.3 (-1.1 to +1.6) | +0.1 (-1.1 to +1.2) |
| write | +0.8 (-0.3 to +2.1) | +0.7 (-0.9 to +2.6) | +0.2 (-1.7 to +2.1) |

## Runs 1 and 2: one arm after another

Between 15:32 and 15:33 UTC (`hook-timing.mjs`): 33 calls for each call in
each arm, the first three left out, the arms run one after another (base,
after, instance) and then all three again. Load averages after the second
run: 4.86, 3.82, 3.75. The statistic is each arm's own median of 30.

The hook's own reading, median of 30 (min to max), in milliseconds:

| Call | Run | base | after | after, instance |
| --- | --- | --- | --- | --- |
| read | 1 | 62.6 (60.6 to 67.1) | 64.6 (61.6 to 67.4) | 65.5 (62.7 to 69.0) |
| read | 2 | 63.8 (62.6 to 67.5) | 69.9 (64.2 to 80.3) | 65.5 (63.8 to 77.1) |
| shell | 1 | 68.7 (67.1 to 70.4) | 69.6 (68.4 to 73.9) | 71.1 (69.4 to 73.1) |
| shell | 2 | 71.2 (70.2 to 73.8) | 76.2 (71.8 to 84.6) | 73.6 (71.2 to 83.6) |
| write | 1 | 67.2 (66.0 to 69.1) | 68.3 (66.9 to 70.7) | 69.1 (67.6 to 73.1) |
| write | 2 | 69.1 (67.5 to 73.0) | 73.3 (70.2 to 83.8) | 72.0 (69.5 to 84.4) |

The spawn's wall time, median of 30, in milliseconds:

| Call | Run | base | after | after, instance |
| --- | --- | --- | --- | --- |
| read | 1 | 77.2 | 79.6 | 80.8 |
| read | 2 | 78.8 | 85.8 | 80.7 |
| shell | 1 | 82.9 | 84.0 | 85.5 |
| shell | 2 | 86.0 | 91.9 | 88.5 |
| write | 1 | 81.4 | 82.7 | 83.5 |
| write | 2 | 83.7 | 88.5 | 86.9 |

The differences of those medians from the base arm's, in milliseconds:

| Call | Run | after | after, instance |
| --- | --- | --- | --- |
| read | 1 | +2.0 | +2.9 |
| read | 2 | +6.1 | +1.7 |
| shell | 1 | +0.9 | +2.4 |
| shell | 2 | +5.0 | +2.4 |
| write | 1 | +1.1 | +1.9 |
| write | 2 | +4.2 | +2.9 |

## What was observed, and what is read from it

Observed in runs 1 and 2: every after cell is slower than its base cell, by
0.9 to 6.1 ms. The two after arms run the same hook code and differ only in
the levels the instance's hook file carries; in run 1 the instance arm was
the slower of the two by 0.8 to 1.5 ms, and in run 2 the faster by 1.3 to
4.4 ms. The code cannot make the arm that does more the faster one, so the
order in which the arms ran, one after another on a host whose load was
changing, is in those figures.

Observed in run 3, where each iteration puts the three arms side by side:
the median difference from the base is between 0.2 and 0.9 ms in every
cell, for the core arm and for the instance arm, and every interquartile
range runs from below zero to above it. The instance arm less the core arm
is 0.1 to 0.2 ms.

What is not claimed. Run 3's figures are medians of sixty per-iteration
differences with their quartiles. They are not a bound on the cost and not
a finding that there is none: a quartile range that crosses zero says how
the sixty differences spread, and nothing about how sure the median is. No
interval for the median was computed, and no run measured a hook under a
tool call of a live session, where the host starts the process. What the
three runs show together is that the 4 to 6 ms of run 2's core arm was not
seen when the arms were interleaved, and that the median of the
per-iteration differences between the instance arm and the core arm was 0.1
to 0.2 ms in every cell of run 3.
