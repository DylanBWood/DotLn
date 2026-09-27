# WO-168 implementation evidence

Recorded 2026-09-27 for `resume: next`. This is the executor's result, ready for independent verification; it is not a verification verdict or final review.

## Delivered

All eight items reproduce on the activation tree (`3d58955d`; the five cited sources are unchanged since `4c34b332`) and end fixed. [Decisions D001 to D013](decisions.md) hold the choices, the evidence, the rejected alternatives and the reopening conditions.

| Item | What ships | Fixture |
| --- | --- | --- |
| 1 | `ensureHarnessSessionScratch` creates the session's directories (mode 0700, the shared `dotln` parent at the default mode) at the Claude role dispatch, in `beginHarnessSession` and in `harness scratch`. An existing real directory is used as it is. A file, a link or an error is one advisory, and the dispatch proceeds. | `WO-168 a printed session scratch path exists ...`; the WO-144 repair case no longer creates the directory |
| 2 | A session-scratch or host-scratchpad root whose final component is a link, a file or another user's grants nothing; the refusal names the root and the cause. Absent roots and the other grant kinds are judged as before. | `WO-168 a granted session root is a real directory ...` |
| 3 | An override exit prints its message and record command ahead of an input refusal. Whether the record was appended is read from the order's log, so a journal failure or a lifecycle that fails after appending is never reported as not appended. | `WO-168 an override exit prints ahead of an input refusal ...` |
| 4 | Four argument forms and the second npm spelling are on the live-gate list; helper forms are compared argument by argument; a Git read is refused for a `%G` pretty format or a `post-index-change` hook, whether a file or configured. The list names the same programs. | `WO-168 a live gate admits four argument forms ...` (79 classifier rows, hook-level rows on three hooks) |
| 5 | A Codex dispatch refused after placing its reservation, by anything before its event is recorded, releases it. | `WO-168 a Codex dispatch refused after placing its reservation releases it ...` |
| 6 | A built runtime without the reservation entry point refuses before any event and names `node scripts/bootstrap.mjs`. | `WO-168 a Codex dispatch against a built runtime without the reservation entry point ...` |
| 7 | The generated five-refusals sentence, product 02's refusal sentence and product 07's index paragraph and release-close row state what WO-166 shipped. | compiler case `WO-132 both harness roles ...`; role oracle `wo168-role-baseline.json` |
| 8 | The adapter comment sits above `shellWriteTargets`; a hedge resolves to the gate identity that contains the one it spells. | `WO-168 a hedge names the longest gate identity ...` |

## What did not reproduce, and what the review changed

One line of the order's Cost declaration does not reproduce at the hook. The base classifier returns `null` for `ls docs 2>/dev/null`, as the order says, but the base hook admitted the command through the destination adapter, so a session was not refused it. The other six gap commands were refused by the base hook. Criterion 4's `ls docs 2>/tmp/x` is refused by the classifier; at the hook it is the outside-write guard that refuses it, and the fixture pins that.

Four read-only reviewers judged the working tree before anything was regenerated or minted and returned eighteen findings ([D012](decisions.md#wo-168-d012--review-dispositions-and-two-adjacent-repairs)). My first version admitted `&>/dev/null`, which a shell without that operator splits into a backgrounded reader and a new command, and admitted zsh's `$~name` as a Git operand; both are refused now. My first release of a refused reservation covered only the reservation call. My first mkdir made the shared temporary parent private. Three fixture admissions could not fail for the rule they named. Each is corrected, with a row that fails without the correction.

Two defects that predate this order were repaired through the adjacent queue, because they defeat the guard the order widens: the tokenizer ended a word on any whitespace, so `cat a<NBSP>#;touch x` was classified as one read while every shell runs the `touch`; and the configured Git program check read a valueless boolean as false. Both queue items are completed; the queue holds nothing else.

## Boarded, not fixed

| Follow-up | Decision | Subject |
| --- | --- | --- |
| FUP-0804477ea9d640a7 | D004 | Only the final component of a session root is inspected |
| FUP-847826d3542ff249 | D006 | The older destination adapter still treats `&>` as one redirect; the second npm spelling outside a gate; zsh `=` words; `/dev/tcp`; the metadata exception |
| FUP-fd05316b6030ef73 | D009 | Seven standing sentences outside the four the order names |
| FUP-94bff00e748a26af | D010 | A hedge about a partial run when only the full gate's row is in scope |

The seven register rows of the order's provenance stay allocated to WO-168; retargeting them is a closing duty (criterion 9).

## Evidence and release

Application `v0.52.4`; compiler 0.19.3 and skeleton 0.44.3, with the console's pins and the lockfile following. The selected editions in [current.json](../current.json) are authority, artifact identity, verification and feedback WO-168/001, each minted once after the last source edit; feedback carries the WO-070 live audit and no live episode ran. The console self-host fixtures are re-pinned and both publication locks are current.

[Cold start before](cold-start-before.json) and [after](cold-start-after.json): the reworded clause is 88 bytes longer and is carried by the instruction file and by each skill, so every profile grows 176 bytes. Reviewer, the tightest, moves from 23,995 to 24,171 of 24,576. Every verdict is unchanged.

Product 07 grew 990 bytes of the 1,000 allowed and product 02 grew 178 of 600; no ceiling was raised.

## Checks

| Check | Observed result |
| --- | --- |
| New fixtures against the base-built runtime | The five harness cases failed at the expected assertions before the first rebuild; a scratch probe recorded the base hook verdicts. [Transcripts](fixture-transcripts.md). The process-debt cases (items 5 and 6) were first run after the rebuild, so their base behaviour rests on code reading and WO-166-D014's recorded probe. |
| Focused fixtures, final sources | Harness: 5 passed, 0 failed, 15.57 s. Process debt, with the role oracle: 5 passed, 0 failed, 5.98 s. Compiler pinned sentence: passed. |
| `npm test -- --only harness-fixtures` | Passed twice, 240.07 s and 242.89 s, once after each adjacent repair. |
| First `npm test -- --review` | **Failed.** 37 suites passed; the skeleton suite had one case cancelled at its own 240 s budget (`WO-143 once and loop restart at every acquisition filesystem boundary`), 453 of 454 passed, no failed assertion. Exit 1 after 708,691 ms, recorded 2026-09-27T04:24:41.939Z. |
| That case alone | Passed in 208,053 ms with all eight cells, between the two gate runs. |
| Second `npm test -- --review` | **Passed.** 38 suites, 0 failed, 82 fresh tasks, 693,224 ms, recorded 2026-09-27T04:41:22.842Z; same tree `dd25f80e7ad34de024ba005d0a0947fc5fbc3092` and code identity `ee886f5a42f3645f1362329409bafb07c3b710da50618e697115490ddc9a97d5` as the failed row. Row: `host-gate:ee886f5a42f3645f1362329409bafb07c3b710da50618e697115490ddc9a97d5:npm test`. |
| Other checks | `harness check` (31 surfaces), four edition checks, console fixtures, `release prepare --local`, `release check-surfaces --local` (51 PASS), `plan check`, `docs-check`, `publication:check` and `git diff --check` passed. |

[D013](decisions.md#wo-168-d013--the-review-gate-both-rows) records both gate rows and what is and is not known about the first. The case belongs to the resident's lock tests, which this order does not touch; its budget was met before at WO-115 and WO-159, and D013 reopens WO-159-D020 (`FUP-1d57cbcb226d8f8a`) because that row's reopening observation has occurred. Host load was present in both runs, so it is an observed condition and not an established cause. An independent verifier should expect the same case to be sensitive to a shared host.

The suites left nothing behind: `<system-temp>/dotln` held 59 entries before and after every run, and no fixture temporary root remained.

## What this session observed of its own hooks

The dispatch ran on the hooks installed before this order: the printed scratch path was absent at entry, as the order describes. After the bundle was regenerated the session's hooks were this branch's. Beside its own live review gate the session was admitted a Git read with `HEAD~1`, an input redirect, a `/dev/null` sink, a quoted `<…>` pattern and `npm run --silent resume -- status`, and was refused `cut` and a command that used a variable. The session had no role dispatch after regeneration, so it never saw its own scratch directory created; the fixtures and the verifier's and reviewer's own dispatches (criterion 10) are the evidence for that.

## Limits

- Nothing was observed on Linux or under a shell other than bash 3.2, zsh 5.9 and dash; the reviewers' shell probes ran on darwin.
- Which shell each supported host runs tool commands through is not established; it decides how much the boarded `&>` adapter matters.
- The ownership clause of the root rule has no fixture: a directory owned by another user cannot be made without a second user.
- Suites other than harness-fixtures and process-debt do not import the private fixture temporary root; none left a scratch directory in these runs.

## Actor and process cost

Claude Code 2.1.283, model `claude-fable-5-1`, effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective); the session ran with workflow orchestration on. Eight read-only subagents were used in two workflows, four mappers and four reviewers, of the cap of 20; the harness counted 8, exact-observed, with no unresolved admission. The root session was the only writer.

At 2026-09-27T04:42:28.795Z the transcript counter reported 106,012,674 total tokens for this dispatch, of which 105,003,932 were cached input and 304,409 output; the two workflows reported 985,627 and 1,003,685 subagent tokens. Dollar cost is unknown (counter unavailable). Wall-clock from activation (02:49:27Z) to this report is about 1 h 55 min. No branch commit, push, pull request, deployment, package publication or account-setting change was made. Independent verification and final review remain separate dispatches.

## Repair 1 — VER-001

Recorded 2026-09-27 for `resume: fix` against [VER-001](../../verifications/WO-168/VER-001.md), which failed criteria 4 and 11. Every other criterion VER-001 judged met is untouched by this repair except through the shared tokenizer and adapter named below.

| Finding | Repair | Decision |
| --- | --- | --- |
| F1 — the hook admitted `ls docs &>/dev/null touch <gate input>` through the destination adapter; dash runs the touch | A command word after an `&>` or `&>>` operand makes the invocation opaque to the destination adapter, so a live gate refuses it. An `&>` followed only by redirects still names its destination. | [D015](decisions.md#wo-168-d015--repair-of-ver-001-f1-and-f2--followed-by-words-and-zshs--word) |
| F2 — the list admitted `ls =cat`, which zsh expands | An unquoted `=` that begins a word or follows `=` or `:`, with something after it, is an expansion; the list, the Git revision rule and the adapter refuse it. A lone `=` stays literal. | D015 |
| F3 — the full gate failed the WO-131 case | The case compares two refusals built from two processes' clocks. A one-second skew reproduced the failure at the verifier's line; the comparison now ignores only the `age` field, which a pattern still requires. | [D016](decisions.md#wo-168-d016--repair-of-ver-001-f3-the-wo-131-fixture-compares-refusals-across-two-clocks) |

D015 reopens D006: items (a) and (c) of its follow-up (`FUP-847826d3542ff249`) are fixed; (b), (d) and (e) remain. D016 discharges D014's follow-up (`FUP-114ae3a50b6964b8`). D015 names one follow-up for the standing text. The adjacent queue holds nothing; no adjacent defect was met. D001's experiment stands; no second experiment was started.

**Red, then green.** The new classifier and adapter rows were run against the hooks' pinned pre-repair snapshot (`.runtime/harness/8870fd9e05d086ec`): each refused row was admitted there and is refused by the rebuilt runtime, and the unchanged rows agree. The F3 reproduction preloaded a one-second clock skew into the prompt hook only; it failed at `scripts/test-process-debt.mjs:7118` before the repair and passed after.

**Regeneration and editions.** `harness emit` changed only the hooks' snapshot pin and the manifest; skills and the instruction file are byte-identical, so the cold-start observation is unchanged. Authority is re-minted as WO-168/003 and selected. WO-168/002 was minted before a last tokenizer refinement (a lone `=` stays literal), is stale and is kept unselected. The other three editions and the harness evidence check pass unchanged. The repair itself needed no release change: compiler 0.19.3 and skeleton 0.44.3 are still unreleased. The integration below retimed the application target from `v0.52.4` to `v0.52.5`.

| Check | Observed result |
| --- | --- |
| Focused fixtures, final sources | `WO-168\|WO-144` harness: 13 passed, 0 failed, 45.07 s. `WO-168\|WO-132\|WO-131\|WO-153` process debt: 23 passed, 0 failed, 31.70 s. |
| Skewed WO-131 case | Before: failed at line 7118. After: 1 passed, 5.78 s. |
| Generated and release surfaces, before integration | `harness check` 31 surfaces; five edition checks; console fixtures; `publication:check`; `release prepare --local` (v0.52.4 current then); `check-surfaces --local` 51 PASS; `plan check`. All exit 0. |

**Integration of main.** At the operator's `scope expand: merge main in`, `npm run worktree -- integrate WO-168` fast-forwarded the uncommitted branch from `3d58955d` to `e578e1f2` (WO-169), retaining checkpoint `refs/dotln/checkpoint/WO-168/6` and the named stash `c15f6169`. The roadmap and the follow-up register were the two authored conflicts; the release is retimed to `v0.52.5`. [D017](decisions.md#wo-168-d017) records the resolutions and the carried-forward claims. The generated and release checks in the table above were re-run on the integrated tree and pass (release target `v0.52.5`), with the docs check and `git diff --check`; the focused cases ran again inside the full gate below. The cold-start observation is byte-identical to the order's recorded after-state, and the hooks still pin snapshot `5f9ac7fe578a59a1`, because WO-169 changed no package source. The helper left the integrated changes staged in the index; nothing is committed.

**Review gate on the integrated tree.** `npm test -- --review` passed: 38 suites, 0 failed, 82 fresh tasks, 631,465 ms, recorded 2026-09-27T15:15:41.190Z on tree `96c20fe1714298c254ee462c2d4c6505e48bb427`, code identity `853cdd73caec43e8ae68b02ca04f1304e81a4cb2e3a6621d7c6f7d2644bef897` (row `host-gate:853cdd73caec43e8ae68b02ca04f1304e81a4cb2e3a6621d7c6f7d2644bef897:npm test`). Harness-fixtures took 236.27 s, process-debt 71.94 s (including the WO-131 case) and skeleton 318.49 s. VER-001's failed row (`ee886f5a…`, exit 1) and the implementation's two rows are unchanged and are not superseded by this one; they judged other subjects.

**What this session observed of its own hooks.** The dispatch ran on this branch's hooks (snapshot `8870fd9e05d086ec`, regenerated by the implementation). The printed scratch path existed as a directory of mode 0700 owned by the session user when this session first listed it; `stat` gives its birth as 2026-09-27T14:42:36Z, the second of the dispatch briefing that printed it (14:42:36.937Z). Beside its own live gate the session was admitted `tail -5` and `grep -v … | tail -15` of a scratch log and `node scripts/harness.mjs evidence --wait --timeout 1500`, and was refused two commands of forms off the list: `pgrep -fl … | head -3` (an unlisted program) and a Monitor `while` loop over shell variables (expansion). No admitted form was refused. The hooks were regenerated twice in this repair, after the gate-free source edits; the verifier's session will run on snapshot `5f9ac7fe578a59a1`.

**Actor and process cost.** Claude Code 2.1.283, model `claude-opus-5-5`, effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). No subagent was used (cap 20, 20 remaining at entry). The root session was the only writer. Token counters are reported with the handoff.
