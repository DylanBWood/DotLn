# WO-284 final review 001

**Verdict:** pass

**Subject:** [WO-284](../../work-orders/WO-284-an-instance-sets-every-time-limit-of-its-gate.md) after the repair of VER-001, code identity `e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77`, reviewed on 2026-11-17 against its ten criteria, its integration with main and its release surfaces. The review changed no source, test or standing document.

The reviewer is this Claude Code session. The effort is the host's selection as the session reports it, not a measured effective effort; the order recommends high for this role and xhigh is what was selected.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.326","model":"claude-fable-5-2","effort":"xhigh","source":"claude-session-readback"}

**Process cost:** entry 176321 tokens; handoff 18987363 tokens; source claude-transcript-message-usage

The counters cover this dispatch: entry cutoff `2026-11-17T13:34:26.813Z`, handoff cutoff `2026-11-17T13:46:27.263Z`, taken before this report, the document gate and the publication, so the final total is higher and stays in the response. They count repeated and cached input (18,510,636 of the handoff total), not unique text; cost is unknown, since the counter gives none. No worker was launched and no complete run was started. Consuming the standing complete row avoided repeating 0 h 51 min of passing work; the review's own waits were the 4 s reproduction and the document gate.

## Integration and the standing row

Main had not moved: `npm run worktree -- integrate WO-284` took in nothing, and `origin/main` is the branch's base, `db7dec8d5`. The reviewed code identity is therefore the one VER-002 judged. The passing complete review row recorded at it on 2026-11-17 at 07:53:35.669Z (47 suites, 124 tasks, all fresh, 0 h 51 min) stands under the limits in force, and the completion consumes it. This review edits documents alone, so it owes `npm run test:docs` and no complete run, which is what the briefing and the integration printed and what the order itself establishes.

## The verification sequence

[VER-001](../../verifications/WO-284/VER-001.md) failed criterion 1 on one finding: after a pass, a change to the limits file left the earlier results reused and standing. Its retained reproduction was run again, unchanged, under the bounded wrapper: it exits 0 with no contract failure. A raised key is on both task records, a lowered scale leaves no row standing and the closeout lists the complete run, and a forced selection with no reason executes. [VER-002](../../verifications/WO-284/VER-002.md) judged the repair with its own linked-worktree probe and passed all ten criteria. Nothing in this review contradicts it. [The review's evidence](../../evidence/WO-284/final-review-001-evidence.md) holds the commands and what each returned.

## What was read

The whole change against the base: the source diff with its two new modules and the seeded template, the changed standing documents and every changed test file, with the order, both verification reports, the handoff, the decisions and the evidence captures. Generated files are judged by their generation checks in the standing rows and the document gate. The ignored reviews lane was not read; the handoff, the decisions and both verification reports carry its findings and their dispositions.

Beyond the criteria, the implementation holds up to a reading for the next maintainer: one resolver returns a figure or `null`, every site passes it to its child or starts no timer, and the rule the repair added sits in the two lookups every reader of a standing row goes through. The table's comments say how the figures were chosen, and the decisions give each figure with the times it rests on.

## Findings

One finding, not blocking.

F1. In the complete review row this review consumes, core's slowest test file, `scripts/test-target-worktree-close.mjs`, took 920.9 s. [D003](../../evidence/WO-284/decisions.md#wo-284-d003--the-tables-keys-and-the-kits-figures-each-with-the-times-it-rests-on) sets the default task limit at 2,700 s as 3.2 times that file's slowest pass before the order (845.8 s), and names a core row passing 900 s as the first reason to reopen the figure. That happened in the order's own passing run and was recorded nowhere: the default is now 2.93 times the file's slowest pass. No criterion is unmet. The order's Design states the three-times rule over the thirty days before the order, where it holds; criterion 5 judges an instance's selections, which do not run this file; and under main's 900 s this run would have failed on it, so the new figure is what let it pass. The figure is not changed here: that is a source edit after verification, which would owe a third complete run for a row no instance's gate runs. [D040](../../evidence/WO-284/decisions.md#wo-284-d040--the-default-task-limits-reopening-condition-is-met-in-the-orders-own-passing-run-a-core-file-task-took-9209-s-the-figure-stays-and-the-finding-is-boarded) reopens D003 and names the follow-up, `FUP-c64f814adf5ff191`.

Its class is escape: the row was recorded before VER-002 and the reopening condition stands in a decision the verification read, so the observation was present in the verified subject and inside its review scope. Its route is follow-up: it lies outside the criteria and breaks nothing main did.

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "In the order's own passing complete run a core test file took 920.9 s, which meets the reopening condition of the figures decision and leaves the default task limit at 2.93 times its slowest pass; boarded in D040."
  }
]
<!-- dotln-findings:end -->

No criterion is waived or recorded defective, so no such record is judged here. The notes the verifier and the repair's review left open keep their follow-ups: `FUP-43dcc85cd5df9fcb` ([D030](../../evidence/WO-284/decisions.md#wo-284-d030--retain-the-earlier-nonblocking-limits-with-a-named-follow-up)) and `FUP-d008506721f57cc4` ([D034](../../evidence/WO-284/decisions.md#wo-284-d034--the-repairs-one-combined-review-five-notes-each-judged-and-recorded-and-two-texts-of-the-repair-corrected-to-say-only-what-the-code-does)). Each was read against the code; none breaks a criterion or a behavior main had.

## Criterion judgments

**Criterion 1:** met — The resolver cases hold each clause: no file, a raised key, a scale, `null`, `enforce: false` and seven unusable values, each named once with the kit's figure applied. The runner cases show a run applying each and naming the figure on the task's record, and the two after-a-pass cases show a changed figure leaving no earlier pass reused or standing for the closeout, a forced run, a claim or the evidence command, at a core root and at an installed instance. `runner-fixtures` and `configuration-root` passed in the standing review row. VER-001's reproduction exits 0 on this tree.

**Criterion 2:** met — The runner cases show a structural row ended for time reported as `TIME` with its key, the figure, the file and `npm run limits`, the tasks after it saying that nothing was judged, an ordinary row naming its key, and the Git version read, a helper compile and the lane reader naming their limit. The sync case shows a generated check ended for time naming its key, with its artifact left unwritten. `runner-fixtures` and `sync-fixtures` passed in the standing review row.

**Criterion 3:** met — The listing and writer cases show one row for every key with what it bounds, the kit's figure, this root's figure and its source; `--write` creating the file with every key and writing back each entry as its owner left it; and, after the kit's figure for a key changes, an entry at `"kit"` following it while a set number stays and `--write` refreshes `kit`. `configuration-root` passed in the standing review row. `npm run limits` in this checkout printed all 38 keys.

**Criterion 4:** met — The case names 18 gate-path files, parses each and fails on a time figure not read from the table, apart from the sites it lists with what each is; it finds the old figures when they are written back and holds that every key is read on the path. `runner-fixtures` is a core-only suite and passed in the standing review row. The scan's known blind spots are recorded in D030 and found no live site.

**Criterion 5:** met — The export case lists `configuration` and not `configuration-root` in each of the instance's three selections, runs the kit's configuration tests there by name, and with `scale` at a third judges each task's own result against its reduced figure; its arm with the format row at 1 ms fails that judgment and names the task. `launchpad` passed in the standing review row, where the export file took 0 h 7 min.

**Criterion 6:** met — The integration case runs `worktree integrate` and `npm run resume -- briefing` with a passing complete review row at the identity: both say the complete run is satisfied, name the row's time and list `npm run test:docs` alone; with no row, after a failed run displaces it, and with an unreadable index they list the complete run and exit as before. `worktree-integration` passed in the standing review row. This dispatch's own briefing and integration printed the satisfied form.

**Criterion 7:** met — The runner case shows `--again` without `--reason` printing the row, running no task and exiting 0; `--reason` running the selection with the text on its row; a selection with no passing row unchanged; and a reused suite whose only changed sources are documents named as reused at the code identity. `runner-fixtures` passed in the standing review row. `npm test -- --review --again` in this checkout printed the standing row, ran nothing and exited 0.

**Criterion 8:** met — The harness case reads the emitted reviewer and executor roots of both hosts for the sentence, at steps 5 and 8, and the installed roots equal the emitted ones; the export suite's case reads a fresh export's first order, whose item 4 keeps a present terms list. `harness-fixtures` and `launchpad` passed in the standing review row.

**Criterion 9:** met — Two live feedback episodes are recorded under `docs/evidence/WO-284/` as `feedback-001` and `feedback-002`. `docs/evidence/current.json` selects the second, and `node scripts/feedback-evidence.mjs --check` says it judged the current source. Each record gives the effective model and effort as unknown.

**Criterion 10:** met — `npm test -- --review` and `npm test` passed at the reviewed identity: the review row of 07:53:35.669Z and the plain row of 07:55:51.177Z. `npm run test:docs` is run after this report's last edit on the candidate tree that holds it; its row is recorded in the review's evidence before the result is filed.

## The changed standing documents

Each changed standing document was read as it now stands. `docs/KIT.md` gains one subsection on the limits file and a slower machine and integrates the configuration row, a miss's message, the satisfied closeout and the seed's rules into the passages that already covered them. Product 07 states the reuse rule, the forced answer, the time-limit table and each root's structural phase in place. `docs/PLAYBOOK.md`, product 02 and `docs/README.md` each take one sentence. Every change replaces or extends the current account and links its decision; none adds a dated account under a standing heading, and each passage reads as a whole. The README's release line and the commands page's version are generated.

## Release

The release is the minor `v1.3.0`; `npm run release -- prepare` against origin's tags left it current. The skeleton is at 0.93.0 with the console's pin and the lockfile following. [The release notes](RELEASE-NOTES.md) carry the order's Read before upgrading duty first: what an update does to the limits file and that `npm run limits -- --write` creates it, that a slow machine sets `scale`, and that an instance which edited the runner by hand takes the release's copy. [The pull-request body](PR.md) is beside this report.

**Terms review:** `node scripts/terms.mjs branch` passed: 131 changed files screened, zero refuse lines and zero context lines, so no line needed reading in context and zero lines were read. The private list was not printed.

## Goal alignment

The aim was to accept or reject the repaired order on evidence, without repeating work a standing row already holds. Four traps were named before the choices they bear on: starting a complete run after edits to documents alone; taking the green row, or the second verification's word, for the repair; reading the repair and not the whole change; and sizing these records from the previous order's. The standing row was read and consumed, the blocking claim was reproduced, the whole change was read, and each record follows its contract. The NoOp, a pass with no finding and no probe, was not open: the reproduction is owed, and the gate record held a reopening condition nobody had recorded. The outcome matches the aim.

[D041](../../evidence/WO-284/decisions.md#wo-284-d041--final-review-accepts-the-repaired-order-on-the-standing-complete-row-main-brought-nothing-no-complete-run-is-repeated-and-one-follow-up-is-boarded) records the judgment, its alternatives and its reopening condition. The operator's dispatch was the lifecycle phrase alone.
