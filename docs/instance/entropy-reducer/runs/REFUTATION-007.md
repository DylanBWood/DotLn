# Entropy Reducer refutation — REFUTATION-007

Challenges `REVIEW-006` (receipt hash `sha256:cea20524cfcecf8d2a1eec8cb56cb08f14cbc53fe304e76d470796aeb4e9877a`) over subject hash `47ed74333b9cbb64f398e4a94addb5c01c8fa964bc04cad873f735e06f075032` at commit `9c18aa5417c1ea6834a284d38e70362732d5f16d`.

Refuter: **entropy-reducer@1** — `claude-opus-5-5` at effort `xhigh` on `claude-code` 2.1.296; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 2 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 2. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell writes instructed to stay inside the copy or episode temporary directory, witnessed by copy and temporary inventories. Denied tool calls: 0.

Subject binding: the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused. Source repository: tracked-path status unchanged across the episode: **true**; untracked, non-ignored path listing unchanged: **true** (2 before, 2 after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: 0 path(s) added, 0 removed, 0 resized. Episode temporary directory: 540 path(s), 2059016 bytes. Frozen copy inventoried at 6194 path(s) before and 6194 after.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 135 s, 20 turns, USD 0.6490106; source claude-result-envelope

## Attempt reasons

- `ER6-001` survived: I ran the reproduction at 9c18aa54. corpus/harness/wo107-schema.test.mjs had 3 of 13 tests failing. Two of the failures are the corpus record tests, and both fail on 'known collector revision' at profile.mjs:315. The third is ERR_MODULE_NOT_FOUND because packages/kernel/dist is missing, which is an environment problem and has nothing to do with the claim. Commit 1aea2dea, dated 2026-10-09, changed only comment lines in profile.mjs: it rewrote one comment line about the WO-107 D007 classification fix as two. profileHash (profile.mjs:240-253) hashes the full text of profile.mjs, wo107-records.mjs, wo107-scenarios.mjs and wo107-bounded.mjs, comments included. I checked this independently. The committed baseline has 36 rows with initialHash feada88b… and 36 rows with 1d618f2f…. Rebuilding the hash from the 1aea2dea^ files gives exactly 1d618f2f…, while HEAD gives 8e770e7f…, so the comment-only edit invalidated the pinned revision for 36 records. As a counterfactual, I extracted the archive and put back only the 1aea2dea^ profile.mjs. The fail count dropped from 4 to 2, and no 'corpus' test failed. The 2 remaining failures come from the archive itself: no dist output and no git repository. The test runner never names wo107 (count 0), and its glob expansion only matches dist *.test.js, so it does not pick up this test any other way. Prettier does not ignore profile.mjs, and docs/control/comment-baseline.json has no corpus entries. The reproduction shows what it claims. Evidence: corpus/harness/profile.mjs:240-253; corpus/harness/profile.mjs:312-318; git show 1aea2dea -- corpus/harness/profile.mjs (comment-only hunk @@ -252,7 +252,8 @@); corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl protocolHash census: feada88b…=36, 1d618f2f…=36; Hash I rebuilt: HEAD=8e770e7f454e…, 1aea2dea^=1d618f2f6e81… (matches the records); node --test corpus/harness/wo107-schema.test.mjs: tests 13 pass 10 fail 3; 2x AssertionError 'known collector revision'; Archive counterfactual: fail 4 at HEAD bytes → fail 2 with 1aea2dea^ profile.mjs; leftover failures are ERR_MODULE_NOT_FOUND for kernel dist and a git show failure; scripts/test-runner.mjs:931-945 (expand matches only */*.test.js globs); grep -c wo107 scripts/test-runner.mjs = 0.
- `ER6-002` survived: I ran the reproduction at 9c18aa54. Of the 13 tracked corpus/harness/*.test.mjs files, corpus/README.md names only the 4 wo101 tests. It names none of the 9 tests for wo102, wo103, wo105 or wo107. scripts/test-runner.mjs names only wo101-id-corpus.test.mjs by path. docs/product/03-architecture.md:2348 says, in the present tense, that the corpus entry point 'links each lane's commands and limits'. The work orders for WO-102, 103, 105 and 107 each say that corpus/README.md exists, so the lane's commands go in the lane's manifest or schema file. I checked dates and history: README.md was last touched 2026-09-19, the architecture sentence was added 2026-09-06 (121d558a), and all four lanes were added 2026-10-01. Nothing in the README or the architecture doc mentions WO-102, 103, 105 or 107, so the entry-point claim has gone stale for those four lanes. I tried two ways to refute it. First, the architecture paragraph is dated and lists only the WO-101 and WO-108 lanes, but it is still written as a current-state claim in a durable product doc. Second, scripts/test-host-guard.test.mjs:2169-2190 copies the three wo102 tests into a mutated fixture and runs them under the host guard. That partly weakens the runner=0 count for wo102, but it does not run them against the committed corpus and does not touch the README/architecture drift. The counts in the command are accurate, and the drift is real. Evidence: docs/product/03-architecture.md:2348; corpus/README.md (only the WO-101 lane and the mutation lane appear; no WO-102/103/105/107); docs/work-orders/WO-102-cadence-corpus.md:141; docs/work-orders/WO-103-authority-outbox-corpus.md:177; docs/work-orders/WO-105-crash-shape-corpus.md:227; docs/work-orders/WO-107-profiling-baseline.md:174; git log: sentence added 121d558a 2026-09-06; wo102/103/105/107 harness files added 2026-10-01; corpus/README.md last changed 86e44bd1 2026-09-19; scripts/test-runner.mjs:855 (the only corpus/harness test registered: wo101-id-corpus); scripts/test-host-guard.test.mjs:2169-2190 (partial dissent: wo102 tests run indirectly in a mutated fixture).

## Bound report

```json
{
  "schemaVersion": 1,
  "selection": {
    "measuredDenominator": 2,
    "measuredStatus": "selected",
    "inspectionDenominator": 0,
    "inspectionStatus": "not-applicable",
    "inspectionSampleSize": 0,
    "selectionRule": "every measured finding and every by-inspection finding",
    "measuredSubjects": [
      {
        "findingId": "ER6-001",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖ corpus|known collector' | sort | uniq -c; git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs; git show 1aea2dea -- corpus/harness/profile.mjs | grep -E '^[-+]//'; echo \"runner lines naming wo107: $(grep -c wo107 scripts/test-runner.mjs)\"; echo \"corpus files in comment baseline: $(grep -c '\"corpus/' docs/control/comment-baseline.json)\"; npx --no-install prettier --file-info corpus/harness/profile.mjs; T=$(mktemp -d) && git archive HEAD -- . ':!docs/intake' ':!docs/evidence' ':!docs/final-reviews' ':!docs/verifications' | tar -x -C \"$T\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail' | sed 's/$/ (archive, HEAD bytes)/') && git show 1aea2dea^:corpus/harness/profile.mjs > \"$T/corpus/harness/profile.mjs\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail|^✖ corpus' | sed 's/$/ (archive, 1aea2dea^ profile.mjs)/'); rm -rf \"$T\""
      },
      {
        "findingId": "ER6-002",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && for f in $(git ls-files 'corpus/harness/*.test.mjs'); do b=$(basename \"$f\"); echo \"$b readme=$(grep -c -F \"$b\" corpus/README.md) runner=$(grep -c -F \"$f\" scripts/test-runner.mjs)\"; done; grep -n 'links each lane' docs/product/03-architecture.md; for id in 102 103 105 107; do grep -n -H 'so the lane.s commands are' docs/work-orders/WO-$id-*.md; done"
      }
    ],
    "inspectionSubjects": [],
    "selectedFindingIds": [
      "ER6-001",
      "ER6-002"
    ]
  },
  "attempts": [
    {
      "findingId": "ER6-001",
      "result": "survived",
      "reason": "I ran the reproduction at 9c18aa54. corpus/harness/wo107-schema.test.mjs had 3 of 13 tests failing. Two of the failures are the corpus record tests, and both fail on 'known collector revision' at profile.mjs:315. The third is ERR_MODULE_NOT_FOUND because packages/kernel/dist is missing, which is an environment problem and has nothing to do with the claim. Commit 1aea2dea, dated 2026-10-09, changed only comment lines in profile.mjs: it rewrote one comment line about the WO-107 D007 classification fix as two. profileHash (profile.mjs:240-253) hashes the full text of profile.mjs, wo107-records.mjs, wo107-scenarios.mjs and wo107-bounded.mjs, comments included. I checked this independently. The committed baseline has 36 rows with initialHash feada88b… and 36 rows with 1d618f2f…. Rebuilding the hash from the 1aea2dea^ files gives exactly 1d618f2f…, while HEAD gives 8e770e7f…, so the comment-only edit invalidated the pinned revision for 36 records. As a counterfactual, I extracted the archive and put back only the 1aea2dea^ profile.mjs. The fail count dropped from 4 to 2, and no 'corpus' test failed. The 2 remaining failures come from the archive itself: no dist output and no git repository. The test runner never names wo107 (count 0), and its glob expansion only matches dist *.test.js, so it does not pick up this test any other way. Prettier does not ignore profile.mjs, and docs/control/comment-baseline.json has no corpus entries. The reproduction shows what it claims.",
      "evidenceRefs": [
        "corpus/harness/profile.mjs:240-253",
        "corpus/harness/profile.mjs:312-318",
        "git show 1aea2dea -- corpus/harness/profile.mjs (comment-only hunk @@ -252,7 +252,8 @@)",
        "corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl protocolHash census: feada88b…=36, 1d618f2f…=36",
        "Hash I rebuilt: HEAD=8e770e7f454e…, 1aea2dea^=1d618f2f6e81… (matches the records)",
        "node --test corpus/harness/wo107-schema.test.mjs: tests 13 pass 10 fail 3; 2x AssertionError 'known collector revision'",
        "Archive counterfactual: fail 4 at HEAD bytes → fail 2 with 1aea2dea^ profile.mjs; leftover failures are ERR_MODULE_NOT_FOUND for kernel dist and a git show failure",
        "scripts/test-runner.mjs:931-945 (expand matches only */*.test.js globs); grep -c wo107 scripts/test-runner.mjs = 0"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "corpus/harness/profile.mjs (protocolLineage, validateProvenance); corpus/harness/wo107-schema.test.mjs; scripts/test-runner.mjs (suites); scripts/lib/comment-labels.mjs (commentFiles); .prettierignore",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖ corpus|known collector' | sort | uniq -c; git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs; git show 1aea2dea -- corpus/harness/profile.mjs | grep -E '^[-+]//'; echo \"runner lines naming wo107: $(grep -c wo107 scripts/test-runner.mjs)\"; echo \"corpus files in comment baseline: $(grep -c '\"corpus/' docs/control/comment-baseline.json)\"; npx --no-install prettier --file-info corpus/harness/profile.mjs; T=$(mktemp -d) && git archive HEAD -- . ':!docs/intake' ':!docs/evidence' ':!docs/final-reviews' ':!docs/verifications' | tar -x -C \"$T\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail' | sed 's/$/ (archive, HEAD bytes)/') && git show 1aea2dea^:corpus/harness/profile.mjs > \"$T/corpus/harness/profile.mjs\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail|^✖ corpus' | sed 's/$/ (archive, 1aea2dea^ profile.mjs)/'); rm -rf \"$T\""
      }
    },
    {
      "findingId": "ER6-002",
      "result": "survived",
      "reason": "I ran the reproduction at 9c18aa54. Of the 13 tracked corpus/harness/*.test.mjs files, corpus/README.md names only the 4 wo101 tests. It names none of the 9 tests for wo102, wo103, wo105 or wo107. scripts/test-runner.mjs names only wo101-id-corpus.test.mjs by path. docs/product/03-architecture.md:2348 says, in the present tense, that the corpus entry point 'links each lane's commands and limits'. The work orders for WO-102, 103, 105 and 107 each say that corpus/README.md exists, so the lane's commands go in the lane's manifest or schema file. I checked dates and history: README.md was last touched 2026-09-19, the architecture sentence was added 2026-09-06 (121d558a), and all four lanes were added 2026-10-01. Nothing in the README or the architecture doc mentions WO-102, 103, 105 or 107, so the entry-point claim has gone stale for those four lanes. I tried two ways to refute it. First, the architecture paragraph is dated and lists only the WO-101 and WO-108 lanes, but it is still written as a current-state claim in a durable product doc. Second, scripts/test-host-guard.test.mjs:2169-2190 copies the three wo102 tests into a mutated fixture and runs them under the host guard. That partly weakens the runner=0 count for wo102, but it does not run them against the committed corpus and does not touch the README/architecture drift. The counts in the command are accurate, and the drift is real.",
      "evidenceRefs": [
        "docs/product/03-architecture.md:2348",
        "corpus/README.md (only the WO-101 lane and the mutation lane appear; no WO-102/103/105/107)",
        "docs/work-orders/WO-102-cadence-corpus.md:141",
        "docs/work-orders/WO-103-authority-outbox-corpus.md:177",
        "docs/work-orders/WO-105-crash-shape-corpus.md:227",
        "docs/work-orders/WO-107-profiling-baseline.md:174",
        "git log: sentence added 121d558a 2026-09-06; wo102/103/105/107 harness files added 2026-10-01; corpus/README.md last changed 86e44bd1 2026-09-19",
        "scripts/test-runner.mjs:855 (the only corpus/harness test registered: wo101-id-corpus)",
        "scripts/test-host-guard.test.mjs:2169-2190 (partial dissent: wo102 tests run indirectly in a mutated fixture)"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "docs/product/03-architecture.md §Corpus policy",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && for f in $(git ls-files 'corpus/harness/*.test.mjs'); do b=$(basename \"$f\"); echo \"$b readme=$(grep -c -F \"$b\" corpus/README.md) runner=$(grep -c -F \"$f\" scripts/test-runner.mjs)\"; done; grep -n 'links each lane' docs/product/03-architecture.md; for id in 102 103 105 107; do grep -n -H 'so the lane.s commands are' docs/work-orders/WO-$id-*.md; done"
      }
    }
  ],
  "promotedFindingIds": [
    "ER6-001",
    "ER6-002"
  ],
  "refutedFindingIds": [],
  "blockedFindingIds": [],
  "unselectedFindingIds": []
}
```

A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.

Local-terms list: **present**. Receipt hash: `sha256:c1839c6efe958598ba9d294206140075bcbdcf9d93c61a65e3a33837555ff557`.
