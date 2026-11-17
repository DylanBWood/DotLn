# WO-284 final review 001 evidence

Recorded 2026-11-17 for [FINAL-001](../../final-reviews/WO-284/FINAL-001.md), at code identity `e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77`. The review changed no source, test or standing document. Raw outputs stay in ignored session scratch; the figures below are the fields the verdict rests on. Times are UTC.

## Integration

`npm run worktree -- integrate WO-284` at about 13:35 printed `Integration took in nothing: the worktree is not behind main`. `origin/main` and the merge base are both `db7dec8d5`. It then printed the closeout selection in its satisfied form: `npm run test:docs` alone, with the complete launchpad run satisfied by the row recorded `2026-11-17T07:53:35.669Z` (0 h 51 min). The dispatch's briefing printed the same form.

## The blocking claim of the verification sequence

VER-001's finding F1 was run again from its retained file, unchanged:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-284/verification-001-probe.mjs
```

At 13:35:49 it exited 0 in 3.9 s with no contract failure.

| What the probe changes after a passing review run | Observed on this tree |
| --- | --- |
| `suite.default` raised to 5,400,000 ms | Both task records of the next review selection name 5,400,000 ms; the code identity is unchanged |
| `scale` lowered to 0.00001 | No review row stands; the closeout lists `npm test -- --review` and `npm run test:docs` |
| `--review --again` with no reason under that scale | The selection executes (exit 1) |
| `--review --again --reason` under that scale | Exit 1; the slow task is ended for time at 27 ms with key `suite.default`; the row keeps the reason |
| `enforce: false` with a 1 ms figure | The slow row finishes and passes with no limit |
| An unusable value, a scale of 2 and an owner's note | One advisory for two reports; the kit's figure doubled applies; `--write` keeps the owner's figure and note; 38 rows listed |

## The rows the review consumes

Read with `readGateChecks` and `standingReviewRow` at about 13:43.

| Row | Recorded | Result |
| --- | --- | --- |
| `npm test`, review selection | `2026-11-17T07:53:35.669Z` | Exit 0; 47 suites; 124 tasks, each executed fresh and passing; 0 h 51 min (3,073,649 ms); identity unchanged during the run; no limits digest, which is the kit's figures |
| `npm test`, plain selection | `2026-11-17T07:55:51.177Z` | Exit 0; 7 fresh tasks and 106 reused; 0 h 1 min (61,608 ms) |

`standingReviewRow` returns the review row, with evidence reference `host-gate:e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77:npm test`. The suites the criteria name each ran and passed in it:

| Suite | Tasks | Time in the row |
| --- | ---: | ---: |
| `runner-fixtures` | 1 | 252 s |
| `configuration-root` | 1 | 11 s |
| `sync-fixtures` | 1 | 442 s |
| `launchpad` | 3 | 1,237 s |
| `worktree-integration` | 1 | 478 s |
| `harness-fixtures` | 3 | 761 s |
| `process-debt` | 1 | 150 s |

`feedback-evidence` and `harness-evidence`, which the order's Preflight line names, are generated-artifact checks: they run inside the `generated` structural task, which passed in each structural row, and no selection lists them as suites of their own.

The launchpad's export file, which holds the exported instance's run at a third of every figure, took 419,768 ms in that row. The slowest task was `target-worktree:file:test-target-worktree-close.mjs` at 920,870 ms under a limit of 2,700,000 ms; [D040](decisions.md#wo-284-d040--the-default-task-limits-reopening-condition-is-met-in-the-orders-own-passing-run-a-core-file-task-took-9209-s-the-figure-stays-and-the-finding-is-boarded) records what follows from it.

## Real commands at the reviewed identity

- `npm test -- --review --again` at 13:40: exit 0. It printed `npm test: a passing complete row already stands at this code identity: recorded 2026-11-17T07:53:35.669Z, 0 h 51 min, 47 suites` with the row's evidence reference, then `Nothing was run.` and the command that states a reason. No row was recorded.
- `npm run limits` at 13:40: exit 0; `Time limits of this root: 38 keys. docs/control/time-limits.json is absent, so the kit's figures apply; enforce true; scale 1.` and one line for each of the 38 keys.
- `node scripts/feedback-evidence.mjs --check`: `Live feedback audit docs/evidence/WO-284/feedback-002 judged the current source.` `node scripts/authority-evidence.mjs --check`: exit 0. `docs/evidence/current.json` selects authority `WO-284/004` and feedback `WO-284/002`.
- `npm run release -- prepare` at about 13:42, against origin's tags: `WO-284 target v1.3.0 remains current.` The only file it changed was `docs/evidence/WO-284/meta.json`.
- The seeded template `scripts/kit/time-limits.template.json` equals the table's own rendering, byte for byte.

## What was read

The whole change against `db7dec8d5`: the source diff (2,953 lines) with the two new modules and the seeded template; the changed standing documents; and every changed test file. Generated files (the installed harness and its hooks, the decisions index, the work-order index, the control projection, the follow-up register, the publication locks and the lockfile) are judged by their generation checks in the standing rows and the document gate. The order, both verification reports, the handoff, the decisions, the evidence captures, the criticisms and the drive architecture record were read. The ignored reviews lane was not read: the handoff, the decisions and both verification reports carry its findings and their dispositions.

## Final document check

Appended after the gate ran; these additions lie inside the order's evidence directory, which the document row's projection leaves out.

`node scripts/terms.mjs branch` passed before the gate, twice with the same counts: 131 changed files screened, zero refuse lines and zero context lines. No line needed reading in context, and the list was not printed.

`npm run test:docs` ran once, after the last edit of the report, the pull-request body and the release notes, and passed: recorded `2026-11-17T13:55:24.211Z`, exit 0, 29 tasks, all fresh and passing, 0 h 2 min (172,316 ms). The code identity was unchanged during the run and is the reviewed one. Candidate tree: `8d0222870efb81ccce664a187b2a17f84a74143d`, which is the tree as it stood when the row was read; document projection: `a0b461fda49d332527fab12e547f01b89e233663`, excluding only `docs/evidence/WO-284`. Its 118 advisories name earlier orders' records; none names a document of this order. The report, the pull-request body and the release notes are unchanged after the passing gate.
