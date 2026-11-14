# :sparkles: The queue of fifteen orders lands as one release, so an instance takes all of it in one update

This is [WO-276](../../work-orders/WO-276-the-queue-lands-as-one-order.md): the fifteen orders the 2026-11-09 pass queued, the repairs that the stalled execution of WO-275 called for, and the asks an instance sent on 2026-11-10, carried as eighteen parts under one activation and released together as v1.0.0. What a person running an instance gets is in the [release notes](RELEASE-NOTES.md); what the final review judged, found and left open is in [FINAL-002](FINAL-002.md).

## What an instance can do after it

- Start on Claude Code alone, read the commands of the whole cycle from one generated page (`docs/OPERATOR.md`), and run `node scripts/doctor.mjs` on a machine the kit has never seen, before installing anything.
- Take an update without losing a file it had changed: the preview lists the files both sides changed, and the publish refuses a merge that rewrote one, naming `--take <path>`.
- Name its own workers and models, read what an order cost in tokens by class and by day, declare what a day may use, and stop an order overnight without the wait counting against its bound.
- Keep its tools under `extensions/`, its own hooks and permission rules in a committed fragment, and a target order's records in the instance where the registration says so.
- Close a target order whose team merged it by squash or by rebase, and study a large target area by area in notes a later session is shown.

## What changes underneath

- An entry of the private list with no marker stops nothing and is read in context by each stage; an entry under `refuse:` still stops a gate, a publish and an export.
- Every format the sources read has one reader. Markdown goes through one parser, carried in the scripts so the lifecycle runs before any install, and the document check refuses a new reader written by hand.
- A review finding changes code only after the executor has said which writer produces its input, a fix dispatch is read once, and a repair after a failed run restarts the run without a review round.
- The complete review run takes its exclusive suites as one convoy and its hook suite in three shards, a tool call starts only the hooks that judge it, and a role's root holds the rules that bind that role.

## Validation

The complete review run passes at the reviewed code (48 suites, 125 tasks, none reused), and the document gate passes on the reviewed tree. The order was verified seven times and reviewed twice: five verifications and the first final review failed on twenty-seven blocking findings, each repaired and reproduced as repaired by the next phase, and this review ran every one of the last ten again. Of 133 acceptance criteria 130 are met; three are recorded as contradictory in their own wording, and both final reviews confirm each record with their own evidence. `main` had not moved, so integration took in nothing.

## What a reviewer should know before merging

The second final review found no criterion unmet and lists eighteen findings, none of them blocking.

- **One class is boarded with a decision for the operator.** Where a hand-wrapped line opens with what CommonMark reads as the start of a block (a placeholder such as `<title>`, a greater-than sign, a list marker), the readers this order moved onto the shared parser return less than the old line readers did, mostly with no refusal: an order's header fields after the line, the suites a Preflight paragraph names, a criterion's text, the Objective a release publishes, a judgment line of a report. It reaches about thirty readers and no committed document: every revision of every order in `main`'s history, every decision and every stored body reads as before. The [census](../../evidence/WO-276/final-review-002/block-openers-census.json) names each reader and what the lifecycle then does, and [the decision](../../evidence/WO-276/decisions.md#wo-276-d199--the-block-opener-class-where-a-wrapped-line-opens-a-block-the-moved-readers-return-less-than-the-bases-line-readers-read-in-about-thirty-readers-and-in-no-committed-document-and-the-choice-of-repair-is-the-operators) puts the choice where it belongs: hold every reader to the old reading in one place, or move the fields the lifecycle acts on out of prose. Until then the kit guide and the release notes tell an author to keep such a token off the start of a line.
- **Why that does not block.** It is the parser's own reading, which the order's design states as the one wanted; no writer is shown to produce the input; and its repair is a choice of design, not a failing case. [The verdict's decision](../../evidence/WO-276/decisions.md#wo-276-d198--final-002-passes-the-criteria-hold-every-earlier-blocker-is-repaired-and-what-the-review-found-is-boarded-the-markdown-class-with-the-operators-decision-on-it) gives the reasons and what would reopen it.
- **The other follow-ups** are on the repair itself: the update plan's guard for a runtime file the incoming kit adds, and the order in which the close tries its two readings ([decision](../../evidence/WO-276/decisions.md#wo-276-d200--follow-ups-on-the-update-plan-and-the-close-a-runtime-file-the-incoming-kit-adds-is-loaded-before-it-is-compared-a-retry-refused-for-a-file-the-kit-dropped-and-a-squash-reading-that-answers-before-the-rebase-rule)); the resident's first card read ([decision](../../evidence/WO-276/decisions.md#wo-276-d201--follow-ups-on-the-resident-a-first-card-read-that-tells-the-operator-to-use-the-launcher-it-was-started-with-and-a-failed-card-read-run-again-at-every-tick)); and the edges of the criteria list's refusal with three pieces of the repair that no case holds ([decision](../../evidence/WO-276/decisions.md#wo-276-d202--follow-ups-on-the-criteria-lists-refusal-and-on-cases-that-cannot-fail)). The first final review's sixty-two follow-ups, less those its repair took, stay with planning.
- **Before an instance takes the release** its owner moves each private-list entry that must never appear under `refuse:`, elects the hosts it uses, and runs the sync on the update branch. The release notes' Read before upgrading holds the whole list.
- **Not exercised:** any host but this one. Linux and WSL2 are designed for, native Windows is unsupported, and the instance on the operator's work machine was not read.

This review changed no source. It corrected one sentence of the kit guide that the repair had written, on how the close reads a rebase, and added two on how the rest of an order is read and what an author does about the class above.

## Release

Major by the operator's naming, v1.0.0, and minor by content ([decision](../../evidence/WO-276/decisions.md#wo-276-d073--this-orders-release-is-v100-and-the-roadmaps-teammate-ready-rung-is-v200-on-the-operators-word)). `@dotln/skeleton` goes from 0.90.0 to 0.91.0, `@dotln/console` from 0.5.0 to 0.6.0 and `@dotln/compiler` from 0.43.0 to 0.44.0, with their pins and the lockfile's entries; the other packages are unchanged. The release is tagged and its manifest written when the order's release close runs after the merge.

<!-- dotln-criterion-records:start -->

- Criterion 51: defective (contradiction) by ordinal 10; npm run resume -- retract 10 --work-order WO-276 in the order's worktree undoes a wrong record before the merge.
- Criterion 121: defective (contradiction) by ordinal 11; npm run resume -- retract 11 --work-order WO-276 in the order's worktree undoes a wrong record before the merge.
- Criterion 123: defective (contradiction) by ordinal 12; npm run resume -- retract 12 --work-order WO-276 in the order's worktree undoes a wrong record before the merge.

<!-- dotln-criterion-records:end -->

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-14T19:02:44.076Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-276/executor | 78 h 9 min | 4,738,019,569 | unknown | 11,692 | 13,994 | 0 | 7 |
| WO-276/verifier | 2 h 56 min | 128,994,760 | unknown | unknown | unknown | 0 | 0 |
| WO-276/reviewer | 2 h 7 min | 249,030,763 | unknown | 3,411 | 4,343 | 0 | 0 |

No dispatch is recorded for release-close, planner, refuter, router: no completed phase attempt, usage observation, journal row or bound event names those roles for WO-276.

Against WO-260, the previous closed order: wall clock 71 h 33 min more; tokens 4,641,795,222 more; USD unknown; commands 13,870 more; steps 16,857 more; bound stops unchanged; bound acceptances 7 more.

<!-- dotln-process-meter:end -->
