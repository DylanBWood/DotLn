# WO-254 handoff

The executor's ledger for WO-254 (v0.116.0, minor): each acceptance criterion
judged on its own line with its evidence, then the review ladder, the complete
run, the measurements the order asks for, what was recorded and not fixed,
what stays untested, the follow-ups, the actor attestation and the process
cost. Decisions are in [decisions.md](decisions.md): D001 to D003 from
activation and release preparation, D004 to D025 from the execution and its
write-backs, D026 to D037 from review round 1 and the suites run after it,
D038 to D042 from round 2, and D043 and D044 from round 3, D045 the operator's follow-up, and D046 to D048 from the first complete run's failure, its repair and the passing run.

**Criterion 1:** met. `scripts/test-harness.mjs` "WO-254 a zombie holder is dead: the refused session shows and releases it without force, and a live holder's release stays the operator's" (harness-fixtures) plants a real holder process and seeds the writer with it. While it lives, `node scripts/harness.mjs writer --release` without `--force` exits 1 with "owner is alive" and the reservation is kept. The holder then exits unreaped: signal zero still finds its pid, `ps` reads its state `Z`, `harnessProcessAlive` returns false, `writer --show` reports `reserved: true, alive: false` (the stale reservation), and `writer --release` without `--force` releases it (`released: true`, a `writer-events.jsonl` row `operator-released` with `forced: false`). `scripts/lib/off-ramps.mjs` `processAlive` takes the same judgment; `scripts/lib/host-resources.mjs` needs none, since both its censuses already leave zombies out (D005).

**Criterion 2:** met. The same case, under the planted foreign writer: while the holder lives, `node scripts/harness.mjs writer --show` is admitted from the refused session, `writer --release` and `writer --release --force` are refused, `writer --show 2>&1 | head -40` is refused (exact argv only), and `git status` is refused with a message naming the host process as alive and stating "This session may run node scripts/harness.mjs writer --show, as that exact command with no pipe, redirect or other command beside it" and that "a live holder is released only by the operator, from an operator terminal: node scripts/harness.mjs writer --release --force". Once the holder is a zombie, both `writer --show` and `writer --release` are admitted and the release retires the reservation (D006).

**Criterion 3:** met. The stop: `scripts/test-harness.mjs` "WO-139 Codex executor and fix completion automatically release after the final index" (harness-fixtures) drives a Codex session through the resume lifecycle to its `resume: release close` dispatch, whose role command is the close itself; `release close --publish` exits non-zero without its completion event, `node scripts/harness.mjs writer --show` then reads `reserved: false`, and the session journal's `dispatchStopped` row names role `release-close`, the command, `writerHeld: true` and `writerReleased: true`, while a `--dry-run` preview leaves the live dispatch's writer reserved. `scripts/test-release.sh` (release) asserts the same release for its surface-refused, dirty-derived and starter-refused closes, and that a retry is refused with main untouched under a foreign holder, with or without a built runtime (D007, D027, D039). A Codex turn that stops releases and the next prompt re-reserves: `scripts/test-codex-continuation.mjs` "WO-254 a stopped Codex turn lets its writer go ..." over the real runtime. The resume suite's own fixture copies only `scripts/resume.mjs` and its library, with no harness runtime and no close, so the stop is proven where the role command and the runtime are; D004 records that reading of the order's fixture word. The denied activation: `scripts/test-worktree.sh` (worktree) plants a write denial after the worktree's creation (WO-091) and a bootstrap that reports EACCES (WO-092); each leaves no worktree and no branch, puts the carried receipt back and appends the denial to `docs/control/local/worktree-start-denials.jsonl`. `scripts/test-target-worktree-start.mjs` (target-worktree) does the same for a registered target's pair under three denials, a bootstrap's standard error, its standard output and a refused spawn of the activation (D008, D031, D040).

**Criterion 4:** met. `scripts/test-harness.mjs` "WO-254 an unprefixed message ending in a question mark is a question with its two pathways injected, a request in question form keeps the action exception, and other messages keep their classes" (harness-fixtures): `why is the close slow?`, `is this done?`, `Can you pause before the final gate?` and `Can you add the missing regression test?` record `class: question` on `OperatorMessageObserved` with the injected context naming both pathways and the action-request exception; `resume: next` records `direction`; `How many roots are there`, `Do not run the final gate until I approve.` and `fix the test` record no `question` class. "WO-254 every emitted role root carries the question's two pathways and the blocked-turn sentence" checks every root (D009).

**Criterion 5:** met. `scripts/test-plan-refutation.mjs` "WO-254 plan check refuses a standing rule recorded from a question or from no journal row whatever its label, and admits one from a direction row whose capture digest matches; plan start writes the empty block" (plan-refutation): `plan start` writes the empty `Rules recorded` block; `npm run plan -- check` refuses a rule whose referenced row is a `question` though the block labels it `direction`, a rule naming no row and a digest that is not the message's; with the direction row and its digest, the committed and refuted pass passes `plan check` with `rulesRecorded` `{rules: 1}` (D010, D033). `scripts/test-launchpad-export.mjs` "WO-254 criterion 5: the exported instance's operator record says a standing rule is recorded only from the operator's direction, with its capture digest" (launchpad) checks the emitted template's sentence.

**Criterion 6:** met. `scripts/test-codex-continuation.mjs` "WO-254 Codex operator instructions are captured with their form class and restored verbatim after a compaction, and the first reply is probed" (codex-continuation): `pause before the final gate` and `could you pause before the final gate?` are captured by the prompt hook as `unclassified` and `question` with their text, kept in the session's `codex-messages.jsonl` lane file and never in the metadata journal; after `PostCompact` both are restored verbatim in the compact `SessionStart` context after the task sentence, oldest first; and the first `Stop` journals one `compactionProbe` row naming the first assistant message after the compaction, read from the turn's transcript (source `transcript`, phase `commentary`), not the turn's later final reply. "WO-254 every operator message since the dispatch is restored verbatim, however many and however long ..." restores two pause messages, two 40 KiB messages and 200 short ones whole (D011, D028, D029, D041).

**Criterion 7:** met. `scripts/test-harness.mjs` "WO-254 the three host-decided shell advisories are journaled without a systemMessage while a refused command's advisory is still shown" (harness-fixtures): `cd /tmp && ls` (working-directory override), `echo $(date)` (dynamic substitution) and `for x in 1; do echo $x; done` (control syntax) return no `systemMessage` and journal their classification with `delegated: true` and `shown: false`; `a; b`, a plain command list that raises no classification, returns no `systemMessage` and its call is journaled; and the refused `git push origin main` keeps its `systemMessage` unchanged (D012). The suite's older advisory cases were brought to the same behavior (D035).

**Criterion 8:** met. "WO-254 every emitted role root carries the question's two pathways and the blocked-turn sentence" (harness-fixtures) checks every emitted root, and `node scripts/harness.mjs check` passes (42 generated surfaces). Product 07 states the admitted commands, the zombie judgment and the releases at a stop (§Operator recovery controls), the question class and the blocked turn (§Discipline), the `Rules recorded` block (§Operator-opened planning pass, item 7) and the restored instructions and probe (§Model-specific notes, with §Discipline's continuity bullet). The kit guide states them in its new §Hooks subsection of "What runs here, and what does not" and its §Planning in this instance (D023). `npm run publication:check` is green.

**Criterion 9:** met. `npm test -- --review` passed at code identity `5842e21bfd71c80a4efc4c78aef3d6a6873793d8b4dd906a3d9c271b7145fe3e`, tree `e0469b4c`, recorded 2026-11-04T21:57:59Z: 45 passed, 0 failed, 119 fresh tasks, 0 h 42 min (evidence `host-gate:5842e21bfd71c80a4efc4c78aef3d6a6873793d8b4dd906a3d9c271b7145fe3e:npm test`). `npm run test:docs` runs after this ledger's last edit, and the completion consumes its row. `git diff --check` is clean. No dependency is added: `git diff` over `package-lock.json` is 5 lines, the two component versions and three pins (D021). The live feedback self-host episode is recorded in D022 and `docs/evidence/WO-254/feedback-002` (`carried: false`).

## Review ladder

self-review: found 21; fixed 21; recorded 0; rounds 3 (the execution's rounds 1 to 3, then the repair's round 3 over the delta since round 3's tree); unreviewed 0 lines

Every worker was a Codex worker launched by `npm run worker -- review --host codex` at `gpt-6.1-sol` and `max`, pinned on the command line, with no host readback. The reports are in the ignored lane `docs/control/local/reviews/WO-254/`, which release close moves into the order's retained lane. Each worker's one focused test could not start inside the Codex read-only sandbox (`getconf DARWIN_USER_TEMP_DIR` returned an I/O error), so their judgments are by source, and I ran the suites myself (D042, D044, D047).

- **Round 1**, tree `bd9a929a` against the merge base `1823a9cd`: `round-1-criteria.md` (5), `round-1-design.md` (4) and `round-1-consistency.md` (4). Of the 13 findings, 10 were distinct, and all were fixed (D026 to D032).
- **Round 2**, rechecks over tree `ee9724dc` since `bd9a929a`: `round-2-criteria.md` (4), `round-2-design.md` (2) and `round-2-consistency.md` (1). Of the 7 findings, 5 were distinct, and all were fixed, with design's note on the denied start's message (D038 to D042).
- **Round 3**, one combined worker, tree `b4c6a68e` since `ee9724dc` (`round-3-combined.md`): 1 finding, fixed (D043).
- **The repair**, after the first complete run failed (D046): one combined worker, tree `e0469b4c` since `b4c6a68e` (`repair-1/round-3-combined.md`): no findings. Its delta covers round 3's own fix, so no line stays unreviewed (D048).

Running the suites between rounds also found defects of mine that no reviewer named, each fixed and recorded as a correction: D034 to D037, D046 and D047.

## Complete run

1. 2026-11-04T19:48:29Z, code identity `564b2702…`, tree `147506a4`: 16 passed, 29 failed, 0 h 12 min. One suite failed on its own, `beacon-portability`; the runner then cancelled the release suite's remaining cases and never started 27 suites (D046). The background task's exit status read 0 because of an `echo` I appended, so the result was read from the gate's summary line and its row.
2. 2026-11-04T21:57:59Z, code identity `5842e21b…`, tree `e0469b4c`, the tree the repair's reviewer judged: 45 passed, 0 failed, 119 fresh tasks, 0 h 42 min, with 0 h 9 min waiting for host lanes. The gate's end removed 2,280 roots, retained 0 and met 0 blockers. This is the run criterion 9 stands on.

Main stayed at the merge base `1823a9cd` throughout, so no integration was due. Before the second run I probed each suite the first never reached, one at a time (D047).

## Measurements

- **The shell advisories before and after, over one gate.** Before the rebuilt hooks took effect, this session's 1,008 hooked calls showed 64 of the three classifications (14 control syntax, 50 dynamic substitution, 0 working-directory). From then through the passing complete run's end, its 1,096 hooked calls showed none and journaled 51 (9, 41 and 1). For scale, WO-253's first executor session through its three complete runs showed 81 across 3,598 calls (D048).
- **Startup bytes.** Every role's cold start grows by 1,206 bytes (the router's by 948): the two pathways, the blocked-turn sentence and the corrected writer sentences in each root, and 166 bytes of the root instruction's corrected boundaries sentence (D013, D032). No ceiling is raised; FUP-f86af3151b401757 boards the optimization.

## Recorded, not fixed

- The literal host rules a registered target start writes last are left to their existing remedies when a denial lands after them (D031).
- The two WO-171 lane cases of `scripts/test-harness.mjs` retain the fixture root when run bare from a session that holds this worktree's writer; they are judged in the runner's context (D035).
- A compact context grows with what the operator said in the dispatch (D041).

## Untested

- Native Codex delivery of the prompt event: no native run in this repository has registered a prompt hook, and the host denied this execution's probe launcher (D024, D025). The capture, the restore, the probe and the turn release are fixture-proven; a session whose prompt hook never fires keeps its reservation until completion.
- A real Codex release close retry under a foreign holder; the release suite's stand-in runtime and the real-runtime harness fixture stand in.
- Linux hosts.

## Follow-ups

- FUP-f86af3151b401757 (D013, D032): optimize the role roots' cold-start bytes with equivalent usefulness (deferred).
- FUP-78158140c6ac12aa (D045): point the front page's Try it section at the public starter, with its two routes; the operator's direction for the next planning pass.
- Carried in and taken: FUP-4763c82de6324631 (D017), FUP-4798f1b5f5a74ed1 (D018), FUP-a0efaae1b9887fde (D019, D036) and FUP-1b5cb21e12253f3e (D020).

## Attestation

- **Harness:** claude-code 2.1.318.
- **Model:** claude-opus-5-5.
- **Effort:** max, read back from the host's `CLAUDE_EFFORT=max`; the source is `claude-session-readback`, which reports the selected effort, not the effective one.
- **Workers:** 9 Codex launches by the hook's count, one of them the launch refused before any worker started (D048), and no re-tasks: 9 of the subagent cap's 20. The live feedback episode ran through the kit's `feedback-audit` over `claude-cli-print` at `claude-opus-5-5` and `xhigh` (D022).

## Process cost

`node scripts/harness.mjs usage 5eb4b3af-7c82-4abd-95e4-e52baf50fb2c` at 2026-11-04T21:59:17Z, from Claude transcript message usage, scope dispatch:

| Counter | Value |
| --- | --- |
| Input tokens | 1,876 |
| Cached input tokens | 454,423,722 |
| Cache-write input tokens | 2,238,330 |
| Output tokens | 819,345 |
| Total tokens | 457,483,273 |
| Reasoning tokens | unknown |
| Cost | unknown |

Dispatch standing at that reading: 6 h 19 min of 8 h 0 min, complete runs 2 of 20, within.
