# WO-287 final review 001: probes

On 2026-11-18 the final reviewer checked the candidate at its dispatch checkpoint `51fbce432` (code identity `978bb80b4f75a187a3f89725d532d5923b4d0daa3c47fd19a79619f61675ce45`, the identity of the third verification's gate rows) and then the same candidate with the repairs this review made. Probe scripts and fixtures stayed in session scratch. Every command input and host event below is synthetic. The only drive command executed was the read-only account, in a disposable Git repository.

## The verification sequence's blocking claims, on the candidate as dispatched

None reproduces.

| Claim | How it was reproduced | Result |
| --- | --- | --- |
| VER-001 F1: the handoff refuses an instance's passing document selection whose tasks advised or were off | The case `WO-287 criterion A6: a selection that passed with advised or off tasks stands for the completion that consumes it …` in `scripts/test-runner.test.mjs`, alone under the bounded wrapper. Its body calls the handoff's own lookup after selections whose format and index tasks advised, were off and passed. | 1 test, 1 pass |
| VER-001 F2: the drive keeps a file name spelled like a word of the kit's commands | The Claude and Codex stream readers, as a denied call and as a failed command, bare and inside Codex's shell wrapper, then the account over each observation: `cat next`, `cat worktree`, `cat orchard-sample` | `cat <operand>` on every path |
| VER-001 F3: a Codex helper reported past the drive's budget is passed silently where the budget advises | The case `WO-287 criterion A4: a phase admitted within the drive's budget whose Codex worker then reports helpers past a limit …` in `scripts/test-drive.mjs`, alone | 1 test, 1 pass |
| VER-002 F1: a Node test-name pattern spelled like a kit script is kept | The same four paths with `node --test --test-name-pattern 'drive.mjs' scripts/test-drive.mjs`, and the public command over a record the real Claude reader wrote | `node <flag> <operand> <operand> <operand>` in the record and in what `node scripts/drive.mjs why` printed |

The masking probe labelled each word of 70 commands an operation or data by the real program's argument rules and compared every word a shape kept with its label, on both hosts, as a denial and as a failed command, wrapped and bare, and in the account's printed shapes: no data word was kept, on the candidate as dispatched and again after the repairs. A further 48 shell forms were read by eye, with the same result. The public command, run in a disposable repository over a record holding six failed commands and one denial, printed `node`, `cat`, `git`, `log` and `--oneline` and no other word of a command; over the same record rewritten as an earlier format it printed placeholders only; the record's SHA-256 was the same before and after each read; and an order never driven printed its one line.

## Criterion 4's recorded contradiction

The unmodified `scripts/test-harness.mjs` of `b08b8e811` (blob `726fd0861c60`) was served at that module's own address by a load hook, so that its imports and the generated hooks stayed the candidate's, and its case `WO-276 criterion Q3` was run alone under the bounded wrapper: 1 test, 1 failure, on one strict equality. The base case expects the planning-branch denial to end by directing the session to the recovery override. The candidate's denial of the same write names stop `planning-branch`, its line of `dotln.config.json` and where that line is written. Criterion 10 forbids the first text; criterion 4 asks that the case pass unchanged.

Across the 26 test files the order changed, the removed lines that name the override are seven, all in `scripts/test-harness.mjs`, at base lines 12249, 12722, 12962, 13752, 13988, 14370 and 23578: two for the planning-branch refusal, three for the outside write and two for the fork `gh` check. Each was replaced by an assertion of the stop's own sentence.

## Every case whose title names the order

A script resolved the 46 top-level cases whose title begins `WO-287`, and the two configuration cases the handoff cites, and ran each alone under the bounded wrapper, one process at a time, requiring exit 0, no failure, at least one pass and the case's own passing line.

- On the candidate as dispatched, 18:02:48 to 18:04:57 UTC: 47 of 47, before this review added its one case.
- On the tree of 19:49 UTC, 19:49:34 to 19:51:24 UTC: 48 of 48. The tree this review passes differs from it in two files changed at 20:56 UTC, `scripts/features.mjs` and `scripts/test-launchpad-export.mjs`; the case of the second that failed the first complete run, and the kit verification case, ran alone at 20:56 to 20:57 UTC, 1 of 1 each.
- The review helper's case, declared inside an awaited call, passed alone (1 of 1).
- The two cases that are subtests ran inside their parents: 6 of 6 in the configuration suite, and 19 of 19 in the update suite at 19:24:57 UTC, on the tree of that time.
- Beside them, on the tree of 19:49 UTC: WO-284's criterion-2 case, the Git floor case and the kit verification case, each alone, 1 of 1.

## Defects the readers reported, reproduced here and repaired in this review

Each row was reproduced on the candidate as dispatched and again after its repair.

| Defect | Input | Before | After |
| --- | --- | --- | --- |
| A redirection the shell reads as one operator was split, so its target stood where a program stands (criteria 22 and 25) | `printf ok >\| git`; also `>>\|`, `2>\|`, `&>\|`, `>&\|`, the operator set against the word before it, and after a joined line | `printf <operand> <operand> ; git` in the record and in the account; `printf ok >\| git status` kept `git status` | no shape; the failure is still counted |
| A redirection with no target, or with a comment where its target stands, let the next command's words stand where a program stands | `printf ok > ; git status`, `printf ok > \| git status`, `printf ok >` and a line end, `printf ok >#x; git status` | `git status` kept; zsh and bash each refuse the line | no shape |
| ANSI-C quoting was read as plain quoting | `printf $'a\' ; git status #'`, which zsh runs as one command with one argument | two commands, `git status` kept | no shape |
| A check ended for time inside the generated task was advised with the task (criterion 6) | An instance's document selection whose generated row reports one case with `timedOut`, or one that could not start | selection exit 0, `ADVISED generated` | selection exit 1, `FAIL generated`, no advised task |
| A check ended at a time limit of its own was advised in an instance, where main failed it (WO-284 criterion 2) | An instance's document selection whose license task prints its dry run's time-limit miss, or whose index task prints its preflight read's; the host row with `host.git-version` set to one millisecond | `ADVISED license-surfaces`, `ADVISED index`, selection exit 0; the host row's toolchain stop advised | `FAIL` for each and exit 1 at any level of the task's stop; the host row refused on `time-limits` |
| An instance's kit verification that advised, or was off, left a passing row the handoff refused (the class of VER-001 F1) | An instance's document selection whose build row fails at the default level, and one with `gate-kit-verify` off | selection exit 0, row stamped `buildOutputAttested: false`, handoff: "document row missing or failed" | selection exit 0, no stamp, the handoff takes the row; at `refuse` the selection fails |
| A raised `target-cwd` was not applied to a line the classifier cannot read (criterion 1) | `"stops": {"target-cwd": "refuse"}` and, from a directory under the worktree's root, `echo $(date)`, `ls \| xargs -I{} sh -c '{}'`, `cd nested && ls` | each allowed | each denied naming `target-cwd`; from the root each goes on |
| After a declined release close the account's next step contradicted its stop (criterion 25) | A record stopped at `awaiting-close` with the worker's denied call | the stop says the launchpad's main checkout; the next step says the order's worktree, or to drive again | the next step sends the reader to the stop |
| Kit verification refused on a listed kit file that is no regular file, which main counted as a difference | An exported kit with `docs/KIT.md` replaced by a link | `destination is not a regular file`, exit 1 | exit 0, `kit: 1 kit files differ from the manifest` |
| The features command, and every command that imports it, failed to load in a checkout with no build | A copy of the source with no compiled output | main: `list --json`, `list`, `check` and `meta --check` exit 0; the candidate: each ends on `ERR_MODULE_NOT_FOUND` | `list --json` exits 0; the others exit 1 with one line saying to build first |

The shell reader is shared with the hook classifier, which reads without the diagnostic option. 112 shell forms were read by the reader at the checkpoint and after the repairs: without the option all 112 readings are identical, errors included; with it 34 differ, each now refused.

## Reproduced and boarded

- **A commit whose message a target worktree's guard cannot read.** The Part A reader's probe was run again here. In core's target worktree all five forms are denied. In an instance's, a message on the line and a message file inside the worktree are denied naming `attribution`; a message file outside the worktree and a commit with no message go on with the classification advisory; a message built by a here-document substitution goes on with nothing shown.

## Limits

No live provider session, whole drive or publication was exercised. The masking probes sample the grammar's places and do not establish that no other spelling keeps a word. The findings of the seven readers on GPT-6.2 Astra and of the Astra recheck rest on source traces, since their sandbox could not start a probe; each one this review acted on or boarded as reproduced was run here.
