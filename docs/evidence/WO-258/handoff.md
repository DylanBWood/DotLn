# WO-258 implementation handoff

**Date:** 2026-11-08. **Dispatch:** `resume: next` (executor). **Release:** v0.121.0 (minor); `@dotln/skeleton` 0.87.1 to 0.88.0 ([D001](decisions.md#wo-258-d001), [D022](decisions.md#wo-258-d022)).

An instance's first cycle meets the kit:

- Host support is an election, inferred from the instance's own committed record.
- The update election lets a pass take a starter update unasked.
- The hook reads the plan-first election through the lifecycle's reader.
- A `resume: release close` typed before the merge reaches main waits as a pending dispatch, which the close records.
- A Git floor is judged beside Node, and the classification failure names its cause.
- The first-order template, the front page seed and the map seed are corrected.
- The starter refresh adds the seeds the export writes and removes the retired ceilings file.
- The router ceiling is raised, with the standing acceptances recorded.
- A sequence may hold no order.
- The continuation compares under the judged receipt's rule.
- The siblings index exits 0 without a declaration.

The decisions record each step with its evidence and reopening condition
([decisions](decisions.md)). Three complete runs failed before the fourth
passed: one timeout this order did not cause and two sets of failures it
did, each repaired and reviewed
([D029](decisions.md#wo-258-d029), [D030](decisions.md#wo-258-d030),
[D031](decisions.md#wo-258-d031)).

## Criteria

**Criterion 1:** met. In a fixture export with no election and no host in its record, `node scripts/harness.mjs emit` writes nothing under `.codex/` or `.agents/`, and the manifest's `profiles` names Claude's profile only. Each of the following emits the Codex surfaces: electing `features.host-codex`, a `codex-cli` attestation in the export's `docs/control/resume.jsonl`, or an observed `codex-cli` version in its discovery record. With each, `harness check` passes and `npm run features -- render` prints the row's effective value with its source (`elected`, `inferred: docs/control/resume.jsonl attestations`, `inferred: docs/discovery/environment.json observed versions`). Electing `false` again removes the surfaces and their emptied directories (`scripts/test-launchpad-export.mjs` WO-258 criterion 1 case, launchpad; `scripts/test-features.mjs` host case, configuration-root). A kit update into an instance whose record shows no other host removes those surfaces and the directories that leaves empty, and the updated instance's document gate passes (`scripts/test-instance-history.mjs`). In this repository the manifest names the same three profiles as at the base, and both host rows read inferred on with their record rows named ([criterion-1-repository.json](criterion-1-repository.json)). [D003](decisions.md#wo-258-d003), [D004](decisions.md#wo-258-d004), [D031](decisions.md#wo-258-d031).

**Criterion 2:** met. With `features.auto-update-upstream` elected, `node scripts/launchpad.mjs update --finish` in the WO-257 fixture under a journaled planning dispatch is admitted without `--operator-request`; it prints the election and journals `election: features.auto-update-upstream`. Without the election the refusal is byte-identical (`scripts/test-launchpad-update.mjs`, the finish fixture; launchpad). [D005](decisions.md#wo-258-d005).

**Criterion 3:** met. The `harness-fixtures` case plants `"on"`, `"true"` and `1`. For each, the hook's reader throws the message the lifecycle's configuration reader gives (the one `npm run resume -- status` prints), and the write hook refuses with it; `true` and `{ "on": true }` elect (`scripts/test-harness.mjs` WO-258 plan-first reader case). A root that carries no lifecycle feature reader keeps the direct read the hook made before, so a registered target's synthetic launchpad is admitted (`packages/skeleton/test/source-change-host.test.ts`). [D006](decisions.md#wo-258-d006), [D031](decisions.md#wo-258-d031).

**Criterion 4:** met. The `release` fixture's bare origin holds the merged order, and its main checkout is behind it (`scripts/test-release.sh` `release_case_pending_dispatch`). There, a pending row as the prompt hook journals it is recorded by `node scripts/release.mjs close WO-099 --dry-run` after its fast-forward, and the session state then holds the recorded dispatch that keys the admission. A phrase kept pending beside the recorded order's own dispatch survives that order's dry run and is consumed when its publishing close completes. The prompt hook journals the phrase as pending with the release-close role resolved, the exact helper is admitted, and a refused recording keeps the row (`scripts/test-harness.mjs` WO-258 pending case). When main still selects an earlier closed order, the phrase records that order's dispatch and stays pending (the WO-258 earlier-closed-order case). The merged order's helper then goes to host permissions with an advisory saying its close records that dispatch, and the recording rebinds the dispatch to the merged order. Once the recorded order's close consumes the phrase, another order's helper needs a new phrase (the WO-258 consumption case), and WO-178's case still withholds another order's helper. The operator reference row, `resume release-close`'s handoff and `worktree publish`'s printed next step say to update main first. [D007](decisions.md#wo-258-d007), [D008](decisions.md#wo-258-d008), [D027](decisions.md#wo-258-d027), [D028](decisions.md#wo-258-d028).

**Criterion 5:** met. With a shim `git` printing `git version 2.31.0` first on PATH, `node scripts/harness.mjs check` and `npm test -- --only host` refuse naming `>=2.40.0` and `2.31.0`: the host task leads and every other task is skipped. `node scripts/bootstrap.mjs` still runs ([criterion-5-git-floor.txt](criterion-5-git-floor.txt)). The version is read through the repository's Git library. The classification failure names `git check-attr exited 129` and git's words, and the dry run it stops records a `host-runtime` blocker naming the floor (`scripts/test-release.sh` `release_case_git_floor`). [D009](decisions.md#wo-258-d009), [D010](decisions.md#wo-258-d010), [D025](decisions.md#wo-258-d025), [D030](decisions.md#wo-258-d030).

**Criterion 6:** met. A fixture export's document check reports `0 standing without a reader binding` and no `UNBOUND` line; the front page links the map, and the map links every seeded root README. Its `WO-001-environment-truth.md` holds step 10's three corrections. `UPSTREAM.md`'s `## Instance seeds` names exactly `exportSeedPaths()`, and each path exists (`scripts/test-launchpad-export.mjs`, `scripts/test-launchpad-seeds.mjs`). A refresh of a starter that lacks the lineage index and carries the ceilings file at the kit's rendering adds the one, removes the other and names both. It keeps a customized ceilings file with its reason in `keptSeeds`, and it adds an absent `dotln.config.json` with the export's bytes (`scripts/test-launchpad-update.mjs` refresh case; `scripts/test-launchpad-seeds.mjs` plan case). `closeout-scope.mjs` names no ceilings file. [D011](decisions.md#wo-258-d011), [D012](decisions.md#wo-258-d012), [D014](decisions.md#wo-258-d014), [D026](decisions.md#wo-258-d026).

**Criterion 7:** met. `npm run meta` here prints `Process health: no observed budget breach`. Inside a fresh export the router's ceiling is 21,220 and no role is in breach (`scripts/test-launchpad-export.mjs` `[document] WO-075 criterion 4`). `docs/control/budgets.json` records the router acceptance naming the standing route, and the template's router value equals the raised ceiling. [D013](decisions.md#wo-258-d013).

**Criterion 8:** met. In a fixture whose only order has closed, a pass that lets it leave the sequence files (`scripts/test-plan-refutation.mjs` WO-258 criterion 8 case):

- The subject holds no order.
- The plan cost subject and table cover none.
- `plan refute`'s prompt carries `emptySequence`, naming the empty sequence as its subject.
- The empty receipt files, and `plan check` passes with both passes.

[D015](decisions.md#wo-258-d015).

**Criterion 9:** met. In the `instance-history` fixture, an enforced pass's receipt filed over the sequence alone is followed by a `track: separate` workstream with one open member, and `npm run plan -- check` passes with the continuation compared (`scripts/test-instance-history.mjs` `separateTrackCase`). The same case fails at the base (`plan-receipts.mjs` at `d9798e38`) with `sequence, vision, roles or order inventory changed`: control exit 1, fixed exit 0 ([criterion-9-controls.json](criterion-9-controls.json), replayed by [criterion-9-controls.mjs](criterion-9-controls.mjs)). [D016](decisions.md#wo-258-d016).

**Criterion 10:** met. Without a declaration, `node scripts/siblings.mjs index` and `index --check` exit 0 printing `no sibling declaration at docs/siblings/siblings.json; nothing to index`, and a page left without its declaration still refuses (`scripts/test-siblings.mjs`). Here, with the declaration present, `node scripts/siblings.mjs index --check` passes. [D017](decisions.md#wo-258-d017).

**Criterion 11:** met. The write-backs of step 17 replace the sentences now wrong, each linking its decision:

- the kit guide's §First steps, §Features, §Planning in this instance, §Kit files and instance files and §Taking upstream updates;
- product 07's §Operator-opened planning pass, §Workflow closeout and releases and §Model-specific notes;
- `operator-reference.md`.

§First steps is the `kit-first-steps` entry point, where the document check refuses a record, so its three write-backs link by anchor to the standing sections that cite D009, D011 and D012 ([D028](decisions.md#wo-258-d028); `node scripts/docs-check.mjs` passes). `npm run meta` refreshed `docs/control/FEATURES.md` and the decision index. A feature election's row or reader now derives the Read before upgrading notice naming `npm run features -- render`, the re-emit and a new session, beside the `npm run meta` regeneration notice. [D023](decisions.md#wo-258-d023).

**Criterion 12:** met. `npm test -- --review` passed at the handoff identity, and that complete run covers the `npm test` selection: 2026-11-08T03:27:06Z, 45 passed, 0 failed, 0 h 50 min, run with `--keep-going` so every suite executed. `npm run test:docs` passed after the last document edit, and `git diff --check` is clean. The three earlier complete runs failed, and their repairs are [D029](decisions.md#wo-258-d029), [D030](decisions.md#wo-258-d030) and [D031](decisions.md#wo-258-d031).

The light fixture cases above were replayed one process at a time after the passing run ([criteria-fixtures.txt](criteria-fixtures.txt)).

## Review

self-review (Codex gpt-6-astra at max through npm run worker -- review, D002): found 16; fixed 16; recorded 0; rounds 6 (rounds 4 to 6 combined over the three gate repairs); unreviewed 0 lines (the handoff and the replayed fixture transcript are written after the passing run)

The ladder ran on Codex workers with the astra option the operator named
([D002](decisions.md#wo-258-d002)). Each report states the model pinned on
the command line and that no host readback of the effective effort was
printed. The reports live under `docs/control/local/reviews/WO-258/`.

- Round 1 (design, criteria, consistency) found 13, and all 13 were fixed:
  `round-1-design.md` (2), `round-1-criteria.md` (4) and
  `round-1-consistency.md` (7).
- Round 2 (the three rechecks) found 1, the earlier-closed-order case of
  criterion 4, fixed by [D027](decisions.md#wo-258-d027):
  `round-2-design.md`, `round-2-criteria.md` and `round-2-consistency.md`.
- Round 3 (combined) found 2, both fixed by [D028](decisions.md#wo-258-d028)
  (`round-3-combined.md`):
  - a pending phrase that survived a same-order close, and the WO-178
    admission it broke;
  - §First steps losing its decision links.
- The first complete run failed on one timeout, repaired by
  [D029](decisions.md#wo-258-d029). Round 4 (combined) read the change since
  round 3's tree, D028 included. It found 0 and held both round-3 findings:
  `repair-1/round-4-combined.md`.
- The second complete run failed on three process-debt cases this order
  caused, repaired by [D030](decisions.md#wo-258-d030). Round 5 (combined)
  read the change since round 4's tree and found 0:
  `repair-2/round-5-combined.md`.
- The third complete run failed instance-history, launchpad-planning and
  skeleton, each traced to this order and repaired by
  [D031](decisions.md#wo-258-d031). Every suite no run had reached then ran
  on its own and passed. Round 6 (combined) read the change since round 5's
  tree and found 0: `repair-3/round-6-combined.md`.

Outcome against the goal: the twelve criteria are met. The process missed
twice. I started complete runs before running every suite my changes
touched, so each run found the next failure. Before the passing run, every
suite no run had reached ran on its own.

## Attestation and usage

The executor is Opus 5.5 (`claude-opus-5-5`) in Claude Code 2.1.319, read
through the hook's observer from `CLAUDE_CODE_EXECPATH`. The effort is `max`,
read from `CLAUDE_EFFORT`; that is the selected effort, not an effective
readback. The order recommends executor effort xhigh. Recorded with:

```
npm run resume -- implementation-ready --harness claude-code --harness-version 2.1.319 --model claude-opus-5-5 --effort max --source claude-session-readback --work-order WO-258
```

`node scripts/harness.mjs usage fb74ee9b-0caf-49f2-8ba5-0464930525ca`,
observed 2026-11-08T03:29:03Z, from claude-transcript-message-usage at
dispatch scope:

| Counter | Value |
| --- | --- |
| Total tokens | 379,469,715 |
| Input | 1,598 |
| Cached input | 377,431,818 |
| Cache write | 1,405,202 |
| Output | 631,097 |
| Reasoning output | unknown |
| Cost | unknown |

Dispatch standing was 6 h 52 min of 8 h 0 min, with 4 of 20 complete runs.

The readback counts 7 worker launches, all Codex. The reports number 10
review workers: three in each of rounds 1 and 2, and one in each of rounds 3
to 6. The likely reason (inference) is that I launched rounds 4 to 6 with
`npm run worker --silent -- review`, a spelling the hook's count did not
attribute. That makes 10 of the 20 allowed.
