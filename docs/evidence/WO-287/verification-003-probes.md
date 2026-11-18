# WO-287 third verification probes

On 2026-11-18 the verifier checked the second repair at its dispatch checkpoint `9abea1e68`. The repair-complete checkpoint is `a2b0964f8`, and VER-002 judged `9ef2bc4a8`. Every committed blob of the dispatch checkpoint matched the working tree, apart from the three lifecycle projections the verify dispatch rewrote. The code identity was `978bb80b4f75a187a3f89725d532d5923b4d0daa3c47fd19a79619f61675ce45`, the identity of the repair's gate rows. Probe scripts and fixtures stayed in session scratch. Every command input and host event below is synthetic. The only drive command executed was the read-only account in a disposable Git repository.

## Criteria 22 and 25: data words in command shapes

**Method.** Each input is a command a phase worker could run. The verifier labelled each word an operation or data by the real program's argument rules, independently of the shape grammar. Many data words were spelled like the grammar's vocabulary: a program, a kit script, a subcommand, a known option, `--` or an order id. Each input went through four paths, and every non-placeholder word kept in a shape was compared with its label at the same position:

1. The Claude reader, as a Bash tool use followed by a `system/permission_denied` row; read `observed().declined.command`.
2. The Claude reader, as a Bash tool use followed by an error result; read the failed row's `shape`.
3. The Codex reader, as a declined and as a failed `command_execution`, bare and wrapped in `/bin/zsh -lc '…'`.
4. `driveAccount` over an attempt built from those observations; read every backticked shape it printed.

**Results on the repaired modules.**

| Input set | Inputs | Judgments | Data words kept |
| --- | --- | --- | --- |
| Positionally labelled commands (node and the kit's scripts, npm, git, gh, env, assignments, other programs, lists and pipelines) | 136 | 2,925 word positions on both hosts | 0 |
| Words the shell reader marks (quotes, expansions, substitutions, redirects, globs, escapes, comments, several lines, shell wrappers) | 45 | stored shape and the `Ended by:` line on both hosts | 0 |

One input with braces, `awk {print} next`, produced no shape on any of its five paths. The account then says "a shell command" and still counts the failure.

**Positive control.** The same 136-command probe ran against VER-002's subject: its three drive modules on the hook runtime its hooks pinned (`.runtime/harness/89eec8437f21144b`). It reported 103 kept-word results across the paths and hosts, on 12 distinct inputs. Five of the twelve are unambiguous data retentions:

- `node scripts/harness.mjs bounded -- node --test --test-name-pattern harness.mjs …` (VER-002 F1's class)
- `node --import resume.mjs scripts/drive.mjs why WO-287`
- `git --git-dir worktree status`
- `git log --grep --oneline`
- `PATH+=./scratch/drive.mjs printf test`

The other seven are the verifier's own labelling errors or ambiguous positions: `npm -- run resume` and `npm --prefix=x run resume -- status` hold operations the earlier grammar kept correctly. The repaired modules masked all twelve.

**The findings' own inputs, before and after.** Seven inputs went through both module sets on both hosts:

- VER-002's selector, `node --test --test-name-pattern 'drive.mjs' scripts/test-drive.mjs`
- the repair review's three shell expressions: `[[ "" == x || git == git ]]`, `(( 1 || git ))` and `git() { :; }; true`
- an array assignment: `labels=(git node); printf done`
- its two assignment values: `env -- 'sample-key=./scratch/drive.mjs' cat` and `SAMPLE+=./scratch/drive.mjs printf test`

Before the repair, all 14 results kept `git` or `drive.mjs`. After it, none did. The selector reads `node <flag> <operand> <operand> <operand>`, each expression has no shape, and the assignments read `env -- <assignment> cat` and `<assignment> printf <operand>`.

**The public command.** A disposable Git repository on `main` held a drive record whose attempt the real Claude reader observed. It recorded:

- five failed commands, among them the VER-002 selector, `git log --oneline log` and `npm run resume -- status status`
- one helper's denied `git show next`
- the worker's denied `node --require release.mjs scripts/drive.mjs why status`

`node scripts/drive.mjs why WO-999`, with `DOTLN_LAUNCHPAD` set to that repository, printed:

- the denial as `node <flag> <operand> <operand> <operand> <operand>`
- the helper's denial by tool and count only
- each failed shape with its data words masked

The record's SHA-256 was the same before and after the read.

**Older and forged records through the command.** The same record was rewritten with a shape version absent, `2`, `4` and the string `"3"`. Each time its denial and failed commands held eight shapes with data words in operation positions, such as `["cat","next"]`, `["git","log","status"]` and `["node","drive.mjs","why","status"]`. The four non-current versions printed only placeholders (`<word>`, `<flag>` and the stored `<operand>`), with all eight failures counted. A record claiming version `3` was judged again and printed each data word as `<operand>`, for example `git -C <operand> status`. The record's bytes were unchanged after every read.

**A host's reason and a command's output.** A Codex denial with a printed reason and a failed command with output were observed. The record kept the redacted reason. The account printed neither the reason nor the output.

## The shell reader's default reading

The repair adds an option to the shell reader that only the drive's diagnostics pass. The verifier read 66 shell forms with the reader of `9ef2bc4a8` and the current reader, neither given the option. The forms included control words, groups, conditionals, arithmetic, functions, arrays, here-documents, substitutions, wrappers, assignments and lists. All 66 readings were identical, including the errors thrown. Under the option, 18 of them are refused. The hook classifier's reading, which criteria 1 to 5, 9 to 11 and 27 rest on, is therefore unchanged by this repair. The regenerated hooks differ from VER-002's subject only in the runtime snapshot and the one module hash they pin.

## Criterion 4's recorded contradiction

The unmodified `WO-276 criterion Q3` case from `b08b8e811` was copied to session scratch with its module imports pointed at the candidate's files. Its sibling-file imports were dropped, and it was run alone under the bounded wrapper. It failed on one exact equality. The candidate's planning-branch hook refused the write, as in core before. Its text named stop `planning-branch`, its `dotln.config.json` line and where that line is written. The base case demanded the sentence ending "Use operator override: for authorized recovery." Criterion 10 forbids that route.

Only seven assertions in the base test files' existing cases for the nine refusals changed in this order. Each pinned the override's name: two in the planning-branch refusal, three in the outside-write refusal and two in the fork `gh` refusal. These are the seven WO-287-D006 lists. The verifier read every line removed since the base from the 24 pre-existing test files the order changed. `scripts/test-runner.mjs` matches the same file pattern but is the runner's source. The other removals were these:

- the model table's names (WO-287-D059, D060)
- a target bundle's file count after its added prompt hook (D006)
- an instance's advised document gate (Part A's A6)
- the drive's own shape pins (D062)
- the core floor's generated line (Part B's B6)
- a target hook that now holds the recovery controls (D006)
- the gate's reuse cases (D061)
- the features page's rows (Part A's A8)

None asserts what one of the nine refusals answers. Each of the six current cases holding the seven changed assertions passed alone at the current subject, Q3 among them. In those cases, everything other than the override assertion is unchanged from the base.

## Cases and gate rows

Fifty cases passed at the current subject: the 48 whose titles name WO-287 and the two configuration cases the handoff cites. They ran one at a time under `node scripts/harness.mjs bounded -- node --test --test-reporter=tap --test-name-pattern …`. Forty-eight passed alone. Two WO-287 cases are subtests, which a whole-name pattern does not select. They passed inside their parent tests: 19 of 19 in the update suite and 6 of 6 in the configuration suite.

At code identity `978bb80b4f75…`, the gate index holds these passing rows:

| Selection | Recorded (UTC) | Result |
| --- | --- | --- |
| `npm test -- --review` | 15:53:45 | 47 suites, 124 fresh tasks |
| `npm test` | 15:55:19 | 38 suites |
| `npm run test:docs` | 16:00:09 | 29 fresh tasks |

The review selection holds seven of the twelve Preflight suites, and the document selection holds `docs-check-fixtures`. The verifier ran the other four with `npm test -- --only`:

- `artifact-evidence`
- `authority-evidence`
- `harness-evidence`
- `verification-evidence`

Each passed 9 of 9 fresh tasks, between 16:56 and 17:02 UTC. `npm run format:check` passed.

## Limits

No live provider session, whole drive or publication was exercised; the drive's paths were judged through its stream readers, its account and its command over synthetic events. The masking probe samples the grammar's places; it does not establish that no other supported spelling retains data. The positive control used the earlier modules on the runtime their hooks pinned, beside current copies of five helper modules whose bytes are the same at both checkpoints.
