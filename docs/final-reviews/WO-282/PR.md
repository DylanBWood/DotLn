# A starter update keeps an instance's Codex files and its follow-up dispositions, so nothing is repaired by hand

An instance that takes a starter release no longer repairs two things by hand. One instance reported both on 2026-11-14: it restored its harness manifest from `main` before the emit at every update, and it carried four follow-up rows by hand after one. This is [WO-282](../../work-orders/WO-282-an-update-leaves-nothing-to-repair-by-hand.md), planned as the minor `v1.2.0`.

**The emit.** The starter is Claude-only, so a merge that takes its harness manifest leaves an instance's `.codex/` files on disk with no manifest listing them, and the emit refused to replace them. It now also admits a `.codex/` file that `main`'s manifest lists with a hash equal to the file's bytes: such a file is one the instance's own emit wrote. A file edited since is still refused with `unowned Codex output refuses replacement`, and nothing is written. A path alone admits nothing, so an operator's own file is never overwritten ([D002](../../evidence/WO-282/decisions.md#wo-282-d002--codex-ownership-follows-recorded-bytes-through-a-starter-merge)).

**The preview and the guide.** When the update preview plans the harness manifest as re-emitted, it prints one line above the kit rows: if the merge conflicts in that file, keep this instance's side, because the emit rewrites it. The kit guide's section on [taking upstream updates](../../KIT.md#taking-upstream-updates) says the same, and no longer says that an instance with Codex on sees `remove` rows in the merge, which was true for one update only.

**The follow-up register.** A change to the Markdown reader can move a candidate's key while its section and text stay the same. The sync then retired the old row and created a new one with no disposition. It now carries the pair: the old row ends as a duplicate of the new one, and the new row holds the old row's dispositions with their own times, so two worktrees project the same bytes. Only a unique pair retired and created in one sync, with a current disposition, is carried; anything else is left for a person ([D006](../../evidence/WO-282/decisions.md#wo-282-d006--a-re-keyed-candidate-carries-dispositions-only-with-an-unchanged-source)).

**Three repairs left by an earlier final review.** The update's runtime guard now compares every present compiled runtime file that the prior, the incoming or a pending kit lists before it runs any of the instance's code, and admits a prior file that an interrupted update already removed. The update publish names a grafts file as the cause when one hides the merge base. The register's stale-request refusal names the revision to read.

**Read before merging.** The runtime guard is stricter than before: an update whose incoming-only or pending-only runtime file was altered is now refused where it passed. The order's header says no refusal is tightened and its third step requires this one; the release notes state it under Read before upgrading ([D013](../../evidence/WO-282/decisions.md#wo-282-d013--paired-review-round-1)).

**What the final review changed.** One bullet of the guide and one sentence of product 07, and no source or test. The bullet said the kit uses commit subjects for an instance's release entries, which the verification boarded as inaccurate. The review ran the release's reader in a kit root: an order that commits its reviewed notes has them read, and only an order that commits none is listed by its commit subjects ([probe result](../../evidence/WO-282/final-review-001/release-note-entries.json)). The bullet and the release notes now say so.

**Three critical errors in the final review, as the operator classified them.** After that edit the reviewer ran the complete gate again, although a passing complete row stood at the unchanged code identity and the rule is to reuse it and run the document gate. The run took 0 h 51 min, passed, and was not owed. The reviewer then left the operator's objection without a direct answer for about five minutes, and proposed to leave pending the two follow-up rows that had misled it. The operator's direction is recorded as the rule: a complete gate never runs after a change to documents alone. The review declined both rows on it and wrote the rule into [product 07](../../product/07-execution-guide.md#discipline). The role texts are compiled source, so the same sentence there is the critical follow-up of [D024](../../evidence/WO-282/decisions.md#wo-282-d024--critical-errors-a-complete-run-after-a-document-only-edit-and-the-rule-that-none-ever-follows-one), listed first for the next planning pass.

**Validation.** [VER-001](../../verifications/WO-282/VER-001.md) and [FINAL-001](FINAL-001.md) judge all five criteria met. The complete review run passed at the reviewed code identity, in the executor's run and again in the review's: 45 suites, 122 tasks, none failed. `npm run test:docs` passed on the candidate tree. Integration took in nothing: `origin/main` is the branch's base.

**Limits and what is left.** The emit reads the branch named `main` and covers `.codex/` alone. A carry on one branch beside a disposition of the old row on another needs a resolution by hand. The roadmap's release table has no `v1.1.0` row; that state is permitted and the review did not rewrite the table. Three findings are listed in the final review, none blocking: two were fixed in it, and one is boarded (the placement of three decision links in the guide, and a suite case for the release-note reading). Seven follow-up rows that this change met are disposed, each with its reason, in [D023](../../evidence/WO-282/decisions.md#wo-282-d023--final-review-the-subject-passes-the-guides-release-note-bullet-is-corrected-from-an-executed-reading-and-seven-follow-up-rows-are-disposed).

The branch holds three commits: the starter's `v1.1.0` refresh receipt, carried from the close of the order before this one; this order's change; and its records.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-16T15:42:46.045Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-282/executor | 3 h 19 min | 69,457,343 | unknown | unknown | 432 | 0 | 0 |
| WO-282/verifier | 0 h 29 min | 36,869,072 | unknown | 164 | 175 | 0 | 0 |
| WO-282/reviewer | 1 h 21 min | 42,158,239 | unknown | 102 | 173 | 0 | 0 |

No dispatch is recorded for release-close, planner, refuter, router: no completed phase attempt, usage observation, journal row or bound event names those roles for WO-282.

Against WO-281, the previous closed order: wall clock 2 h 20 min less; tokens 216,954,793 fewer; USD unknown; commands 941 fewer; steps 1,206 fewer; bound stops unchanged; bound acceptances 1 fewer.

<!-- dotln-process-meter:end -->
