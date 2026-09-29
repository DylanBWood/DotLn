## Release overview

DotLn v0.56.2 shows a planning pass what failed since the pass before it. One command lists the failed verifications and final reviews, repairs, corrections, off-ramps and execution amendments from the public record; `plan start` prints their counts; and the meter carries each order's failed judgments. The count the 2026-09-28 pass paid about 2.9 million tokens to make by hand is now one read. By the operator's scope expansion, agents are also told under Claude Code what zsh said about a command they wrote, and every role reads a short rule that commands run under zsh.

## Read before upgrading

No event schema, register schema, dependency, refusal or permission changes. Skeleton moves from 0.45.1 to 0.45.2 and the console pins it. The generated hooks change, so authority edition WO-172/010 is selected; the artifact-identity, verification and feedback editions stay WO-117's.

`CLAUDE.md` gains a hand-written Shell section of 390 bytes, read at every cold start. The reviewer's cold-start ceiling rises from 24,576 to 28,884 bytes by the standing route, recorded as a dated acceptance in `docs/control/budgets.json`.

Under Claude Code the read observer now hands the agent context after a shell command in whose output zsh printed a diagnostic, and after a command the host marked failed, at the next observed call. It refuses, blocks and prints nothing. It appends one row per diagnostic to an ignored local file under `docs/control/local/`, holding the class, the scope and a hashed use, never a pattern or a command. Under Codex only the written rule applies.

Sixteen dispatch fields in eleven closed orders' decision records were paraphrased in place because they held the operator's words; the before and after digests are in `docs/evidence/WO-172/dispatch-paraphrases.json`, and no other byte of those decisions changed. Register rows synced before the change keep the earlier text in their append-only history.

## Substantive changes

Planning: `npm run plan -- failures` prints one page of at most 8 KB, newest first, with the window, the counts and a continuation cursor. The default window opens at the latest planning receipt's completion; `--since` and `--until` bound it, `--all` removes the lower bound, and `--export` writes every item to a named file under the destination rule `followups --export` uses. A decision carries a date only, so it belongs to a window whose first and last days include it; an event without a time appears only under `--all`, as `recordedAt: unknown`. A bound that names no real moment is refused. `plan start` prints the window's counts in at most 1 KB, and the number of orders that passed final review since the latest filed Entropy Reducer review ended, or `unknown`; it opens the branch with one line saying why when the counts cannot be computed.

Meter: every closed order carries `failedVerifications`, `failedFinalReviews`, `repairs` and `recordedCorrections`, read from the control fold and the decisions. The process-health line and the planning cost table say in how many of the last eight closed orders the first verification failed. `operatorDirections` also counts a lifecycle dispatch that names an operator step after its `resume:` prefix, at most once per dispatch; it agrees with a hand classification on all 241 operator-naming dispatches at the current text.

Shell diagnostics: the observer recognises a diagnostic zsh printed only when the command's own parsed words bear it out, including inside process substitutions, and answers each failed command once, including when several calls finish together. `plan failures` prints the local counts by class and by order, labelled local, and omits them where the file is absent.

Survey evidence: the order files a reading of the operator's messages in the transcripts this machine retains, committed as counts and identifiers only, a map of what the interventions were about, and fourteen candidate RxJS shapes of operator and agent interactions that later passes refine.

## Progressive polish

Product 07's planning procedure says a standard pass reads `plan failures` first and disposes what it lists, and its observer sentence says what the read observer may hand the agent; product 02 follows. `docs/planning/followups.md` names the command, the sequence loses its interim hand-count paragraph, and the publication locks, decisions index, work-order index and follow-up register follow. The live smoke reads only session journals from the local harness directory.

## Evidence and compatibility

Prepared source tag: `v0.56.2`; reviewed base: `fee6ee4c4e98f8b9a9ff80c916e8543688af0ff4`, fast-forwarded from original base `8c28f47900ec796b827cc8856be1310aebd7408d`. The [release manifest contract](../../releases/README.md) binds the merged source commit and reviewed gate when the operator later authorizes release close. Components: beacons 0.1.0, compiler 0.20.0, console 0.4.0, kernel 0.6.0 and skeleton 0.45.2. The supported Node engine remains >=26.0.0 and <27, and no dependency is added.

[FINAL-001](FINAL-001.md) records the final product and document gates: `npm test -- --review` passed 38 suites at code identity `a893dcbf913ee731807aa0120c66bfd8371ca30217e5b638114ea80c1a5a6142`. [VER-001](../../verifications/WO-172/VER-001.md) to [VER-004](../../verifications/WO-172/VER-004.md) failed on ten findings, each repaired, and [VER-005](../../verifications/WO-172/VER-005.md) passed all eleven criteria. Known limits are in the [decisions](../../evidence/WO-172/decisions.md): the answer to a failed command arrives one observed call late; a word-splitting mistake leaves a diagnostic only where the whole value names a program or a file; one call can hand up to 900 characters of guidance per earlier failed command, at most four; three diagnostic classes are corroborated more loosely than the rest; the direction reader agrees on 70 of 80 held-out cases; and registering the host's failed-command event waits on an observation of Copilot.
