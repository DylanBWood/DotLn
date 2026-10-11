# Entropy Reducer review — REVIEW-006

Subject: commit `9c18aa5417c1ea6834a284d38e70362732d5f16d`; subject hash `47ed74333b9cbb64f398e4a94addb5c01c8fa964bc04cad873f735e06f075032`; frozen copy inventoried at 6194 path(s).

Reviewer: **entropy-reducer@1** — `claude-opus-5-5` at effort `xhigh` on `claude-code` 2.1.296; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This reviewer satisfies the compiled actor requirement by invocation readback. Substitution policy: different-reviewer-and-must-be-attested.

Episode `ep_entropy_47ed74333b9cbb64` ran 2026-10-10T23:45:55.552Z to 2026-10-10T23:57:39.375Z. Compiled semantic hash `fnv1a64:aa43d15672e0b4b6`; work order `wo_entropy_review_1`; authority `auth_entropy_reducer`. Execution boundary: operator-mediated-manual, no deferred Program kind.

Findings: 2 — 2 measured, 0 by inspection; 0 blocking, 0 major, 2 minor. Proposal packets: 1.

Subject binding: HEAD of a clean tree; any tracked change refuses the receipt. Source repository: tracked-path status unchanged across the episode: **true**; untracked, non-ignored path listing unchanged: **true** (0 before, 0 after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: 1036 path(s) added, 0 removed, 0 resized. Episode temporary directory: 2046 path(s), 74222990 bytes. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell writes instructed to stay inside the copy or episode temporary directory, witnessed by copy and temporary inventories. Denied tool calls: 0.

Compiled review confinement (execution rule): lenses worked serially by the reviewer; no delegate grant or delegate resource limit. Checklist completion is not independently observed; worker result: completed.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 704 s, 75 turns, USD 4.380066799999999; source claude-result-envelope

## Result envelope summary

Census: 6,194 tracked paths from git ls-files; the 3 docs/intake/** paths were counted, never opened. Four lenses worked serially; two measured findings survived self-refutation. ER6-001: the WO-107 profiling lane is red at HEAD (2 of 13 tests fail 'known collector revision'). Commit 1aea2dea rewrote one comment in the hash-pinned collector corpus/harness/profile.mjs, a cleanup for the new comment-label check, which scans corpus/ and baselines none of it. Restoring that file alone clears both failures. No runner row runs the lane, WO-188's verifier classed the edit comment-only, no record notes the drift, and .prettierignore leaves the collector formattable. ER6-002: product 03 says the corpus entry point links each lane's commands, but it names only WO-101's lanes; WO-102 to WO-107 settled recording theirs in their own manifests. The WO-101, WO-102 and WO-103 lanes pass. Dropped after probes: front-page guard (negative control present), skill-tree drift (identical), package-publish gaps (all refuse), the What-runs-today budget (folding covers it), rising verification rounds (no attributable cause). One packet. Writes: ignored build output and .runtime/ in the copy; scratch under TMPDIR. Awaiting operator disposition.

## Worker statement

{"schemaVersion":1,"findings":[{"findingId":"ER6-001","criterion":"A hash-pinned evidence lane stays green, or its drift is recorded before the protocol changes. WO-107's decision record says: 'A failed observation, source drift or inability to reproduce the declared registry requires recording the failure before changing the protocol' (docs/evidence/WO-107/decisions.md:33). A guard-driven cleanup should not silently invalidate another lane's committed provenance (product 07 lens 'Policy resistance / fixes that fail').","severity":"minor","evidenceLabel":"measured","observed":"At 9c18aa54, `node --test corpus/harness/wo107-schema.test.mjs` runs 13 tests: 11 pass and 2 fail ('corpus every committed record has a complete schema…' and 'corpus generated comparison is byte identical…'). Both fail at validateProvenance with 'known collector revision' (profile.mjs:315). protocolLineage() hashes the whole bytes of profile.mjs and the three wo107-*.mjs collector files, comments included. Since WO-107 (3e29dd9d, 2026-10-01), the only change to those four files is 1aea2dea (2026-10-09). That commit rewrote one comment in profile.mjs, from 'after D007.' to 'after the one-entry classification fix (WO-107 D007).'. I ran the lane twice in a scratch git-archive of HEAD. With HEAD bytes, 4 tests fail. With only profile.mjs replaced by its 1aea2dea^ bytes, 2 fail, and neither is a 'corpus …' provenance test. The other two tests fail in both archive runs and pass in the frozen copy, so they are archive artifacts. No suite in scripts/test-runner.mjs names the lane (0 lines match wo107), and WO-107 declared that 'nothing joins the root npm test', so the integrated gates stayed green. The comment-label check that 1aea2dea installed scans corpus/: commentFiles excludes only document roots, dist, node_modules and harness directories. Its DECISION_NUMBER pattern matches a bare 'D007', and docs/control/comment-baseline.json holds 0 corpus entries. The inference that the check forced this edit rests on these three facts; I did not run the check against the old bytes. WO-188's verifier probe listed profile.mjs among the 'onlyComments' files. .prettierignore keeps 'recorded fixture bytes' exact for corpus/fixtures/ and corpus/manifests/ but not for the pinned collector (prettier --file-info: ignored false), so a formatter upgrade would cause the same drift. No register row or decision names the drift.","expected":"Files whose raw bytes feed a provenance hash either stay out of the repository-wide rewriting guards (comment labels, formatter) or are watched by a check that runs when they change. The current collector-revision change is recorded as WO-107's reopen condition requires.","reproduction":{"kind":"command","command":"cd \"$(git rev-parse --show-toplevel)\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖ corpus|known collector' | sort | uniq -c; git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs; git show 1aea2dea -- corpus/harness/profile.mjs | grep -E '^[-+]//'; echo \"runner lines naming wo107: $(grep -c wo107 scripts/test-runner.mjs)\"; echo \"corpus files in comment baseline: $(grep -c '\"corpus/' docs/control/comment-baseline.json)\"; npx --no-install prettier --file-info corpus/harness/profile.mjs; T=$(mktemp -d) && git archive HEAD -- . ':!docs/intake' ':!docs/evidence' ':!docs/final-reviews' ':!docs/verifications' | tar -x -C \"$T\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail' | sed 's/$/ (archive, HEAD bytes)/') && git show 1aea2dea^:corpus/harness/profile.mjs > \"$T/corpus/harness/profile.mjs\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail|^✖ corpus' | sed 's/$/ (archive, 1aea2dea^ profile.mjs)/'); rm -rf \"$T\""},"evidenceRefs":["command output: wo107-schema.test.mjs at 9c18aa54: tests 13

## Validated reviewer output

```json
{
  "schemaVersion": 1,
  "findings": [
    {
      "findingId": "ER6-001",
      "criterion": "A hash-pinned evidence lane stays green, or its drift is recorded before the protocol changes. WO-107's decision record says: 'A failed observation, source drift or inability to reproduce the declared registry requires recording the failure before changing the protocol' (docs/evidence/WO-107/decisions.md:33). A guard-driven cleanup should not silently invalidate another lane's committed provenance (product 07 lens 'Policy resistance / fixes that fail').",
      "severity": "minor",
      "observed": "At 9c18aa54, `node --test corpus/harness/wo107-schema.test.mjs` runs 13 tests: 11 pass and 2 fail ('corpus every committed record has a complete schema…' and 'corpus generated comparison is byte identical…'). Both fail at validateProvenance with 'known collector revision' (profile.mjs:315). protocolLineage() hashes the whole bytes of profile.mjs and the three wo107-*.mjs collector files, comments included. Since WO-107 (3e29dd9d, 2026-10-01), the only change to those four files is 1aea2dea (2026-10-09). That commit rewrote one comment in profile.mjs, from 'after D007.' to 'after the one-entry classification fix (WO-107 D007).'. I ran the lane twice in a scratch git-archive of HEAD. With HEAD bytes, 4 tests fail. With only profile.mjs replaced by its 1aea2dea^ bytes, 2 fail, and neither is a 'corpus …' provenance test. The other two tests fail in both archive runs and pass in the frozen copy, so they are archive artifacts. No suite in scripts/test-runner.mjs names the lane (0 lines match wo107), and WO-107 declared that 'nothing joins the root npm test', so the integrated gates stayed green. The comment-label check that 1aea2dea installed scans corpus/: commentFiles excludes only document roots, dist, node_modules and harness directories. Its DECISION_NUMBER pattern matches a bare 'D007', and docs/control/comment-baseline.json holds 0 corpus entries. The inference that the check forced this edit rests on these three facts; I did not run the check against the old bytes. WO-188's verifier probe listed profile.mjs among the 'onlyComments' files. .prettierignore keeps 'recorded fixture bytes' exact for corpus/fixtures/ and corpus/manifests/ but not for the pinned collector (prettier --file-info: ignored false), so a formatter upgrade would cause the same drift. No register row or decision names the drift.",
      "expected": "Files whose raw bytes feed a provenance hash either stay out of the repository-wide rewriting guards (comment labels, formatter) or are watched by a check that runs when they change. The current collector-revision change is recorded as WO-107's reopen condition requires.",
      "evidenceRefs": [
        "command output: wo107-schema.test.mjs at 9c18aa54: tests 13, pass 11, fail 2; both failures 'AssertionError: known collector revision'",
        "command output: scratch archive of HEAD 'fail 4'; same archive with 1aea2dea^ profile.mjs 'fail 2' and no failing 'corpus …' test",
        "corpus/harness/profile.mjs:258-310 (protocolLineage hashes whole file bytes of four collector files) and :311-320 (validateProvenance 'known collector revision')",
        "git show 1aea2dea -- corpus/harness/profile.mjs (one comment rewritten; the only change to the four collector files since 3e29dd9d)",
        "scripts/test-runner.mjs suites (0 lines name wo107); docs/work-orders/WO-107-profiling-baseline.md:17 ('nothing joins the root npm test')",
        "scripts/lib/comment-labels.mjs commentFiles and DECISION_NUMBER (scans corpus/; matches a bare D007); docs/control/comment-baseline.json (0 corpus entries)",
        "docs/evidence/WO-188/verifier-004/checks.txt:211 (whole-diff-comment-isolation lists corpus/harness/profile.mjs under onlyComments); docs/verifications/WO-188/VER-004.md:25",
        "command output: .prettierignore exact-bytes group covers corpus/fixtures/ and corpus/manifests/ only; prettier --file-info corpus/harness/profile.mjs ignored false",
        "docs/evidence/WO-107/decisions.md:33 (reopenWhen: source drift requires recording the failure before changing the protocol)"
      ],
      "surface": "corpus/harness/profile.mjs (protocolLineage, validateProvenance); corpus/harness/wo107-schema.test.mjs; scripts/test-runner.mjs (suites); scripts/lib/comment-labels.mjs (commentFiles); .prettierignore",
      "altitude": 6,
      "standardization": {
        "kind": "recurring",
        "rung": "test",
        "rationale": "Byte pins on live source that are checked only outside the gate have drifted twice: WO-105's base-keyed pins (accepted as D012) and WO-107's collector now. Two repository-wide rewriters, the comment rule and the formatter, can still reach the pinned files. A runner row selected only when the four protocolLineage sources change would run the 1 s schema test and cost nothing in steady state."
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖ corpus|known collector' | sort | uniq -c; git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs; git show 1aea2dea -- corpus/harness/profile.mjs | grep -E '^[-+]//'; echo \"runner lines naming wo107: $(grep -c wo107 scripts/test-runner.mjs)\"; echo \"corpus files in comment baseline: $(grep -c '\"corpus/' docs/control/comment-baseline.json)\"; npx --no-install prettier --file-info corpus/harness/profile.mjs; T=$(mktemp -d) && git archive HEAD -- . ':!docs/intake' ':!docs/evidence' ':!docs/final-reviews' ':!docs/verifications' | tar -x -C \"$T\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail' | sed 's/$/ (archive, HEAD bytes)/') && git show 1aea2dea^:corpus/harness/profile.mjs > \"$T/corpus/harness/profile.mjs\" && (cd \"$T\" && node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ fail|^✖ corpus' | sed 's/$/ (archive, 1aea2dea^ profile.mjs)/'); rm -rf \"$T\""
      }
    },
    {
      "findingId": "ER6-002",
      "criterion": "Durable product doctrine describes where corpus lane commands live, consistent with what the lane orders settled (product 07: the repo docs are the shared memory a cold reader relies on).",
      "severity": "minor",
      "observed": "docs/product/03-architecture.md:2348 says the corpus entry point 'links each lane's commands and limits'. corpus/README.md (49 lines) names only WO-101's lanes and links WO-108's mutation runbook. Of the 13 corpus/harness/*.test.mjs files, 9 are named in neither corpus/README.md nor a runner row: WO-102 x3, WO-103 x3, WO-105 x2 and WO-107 x1. The three WO-102 files are exercised in one scripts/test-host-guard.test.mjs case. This placement is settled: WO-102, WO-103, WO-105 and WO-107 each record, under operator-review assumption 2, that 'corpus/README.md exists, so the lane's commands are recorded in its manifest', or for WO-107 in its schema file. Product 03's sentence was not updated to match. The manual WO-101, WO-102 and WO-103 lanes pass when run (exit 0).",
      "expected": "Product 03 §Corpus policy states the settled arrangement: later lanes record their commands in their own manifests or schema files. A reader looking for, say, the WO-107 lane is then pointed at corpus/baselines/SCHEMA-WO-107.md. No README edit is implied.",
      "evidenceRefs": [
        "command output: 13 corpus/harness test files; 9 with readme=0 runner=0 (wo102 x3, wo103 x3, wo105 x2, wo107 x1)",
        "docs/product/03-architecture.md:2348-2349 ('links each lane's commands and limits')",
        "corpus/README.md (names WO-101 lanes and WO-108 mutation only)",
        "docs/work-orders/WO-102-cadence-corpus.md:141, WO-103-authority-outbox-corpus.md:176, WO-105-crash-shape-corpus.md:226, WO-107-profiling-baseline.md:174 (operator-review assumption 2: commands recorded in the lane's manifest or schema file)",
        "command output: manual lanes WO-101 (program, generators, deferral pins), WO-102 and WO-103 exit 0"
      ],
      "surface": "docs/product/03-architecture.md §Corpus policy",
      "altitude": 6,
      "standardization": {
        "kind": "one-off"
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && for f in $(git ls-files 'corpus/harness/*.test.mjs'); do b=$(basename \"$f\"); echo \"$b readme=$(grep -c -F \"$b\" corpus/README.md) runner=$(grep -c -F \"$f\" scripts/test-runner.mjs)\"; done; grep -n 'links each lane' docs/product/03-architecture.md; for id in 102 103 105 107; do grep -n -H 'so the lane.s commands are' docs/work-orders/WO-$id-*.md; done"
      }
    }
  ],
  "proposalPackets": [
    {
      "schemaVersion": 1,
      "kind": "ProductSuggestionPacket",
      "proposedPath": "docs/proposals/pinned-collector-bytes-observed/",
      "sourceEpisodeId": "ep_entropy_47ed74333b9cbb64",
      "provenance": [
        "entropy-reducer@1 review episode ep_entropy_47ed74333b9cbb64 (claude-opus-5-5 per dispatch; effective model and effort not read back)",
        "frozen subject 9c18aa5417c1ea6834a284d38e70362732d5f16d",
        "lenses: verification-and-evidence, runtime-and-authority; finding ER6-001"
      ],
      "corroboratingEvidenceRefs": [
        "wo107-schema.test.mjs at 9c18aa54: 2 of 13 fail 'known collector revision'",
        "scratch archive: restoring only profile.mjs from 1aea2dea^ clears both provenance failures",
        "docs/evidence/WO-188/verifier-004/checks.txt:211 (profile.mjs classed onlyComments)",
        "docs/control/comment-baseline.json (0 corpus entries) and .prettierignore (pinned collector not in the exact-bytes group)"
      ],
      "dissentingEvidenceRefs": [
        "docs/work-orders/WO-107-profiling-baseline.md:17 ('nothing joins the root npm test')",
        "docs/evidence/WO-105/decisions.md D012 (base-keyed byte-pin drift accepted for a sibling lane)",
        "docs/verifications/WO-188/VER-004.md:25 (the comment-only classification is stated as a supplement, not a semantic-equivalence claim)"
      ],
      "suggestion": {
        "suggestionId": "pinned-collector-bytes-observed",
        "submittedBy": "entropy-reducer@1 (review episode ep_entropy_47ed74333b9cbb64)",
        "problemOrOpportunity": "WO-107's provenance check hashes the raw bytes of four collector files. Those files sit outside every gate, yet repository-wide guards (the comment-label rule, the formatter) may rewrite them. A comment-only cleanup in 1aea2dea invalidated the provenance of every committed WO-107 baseline record. No gate, verifier or register row noticed.",
        "scope": "Choose one: (a) add a runner row, selected only by changes to the four protocolLineage sources, that runs corpus/harness/wo107-schema.test.mjs (about 1 s); or (b) add those four files to .prettierignore's exact-bytes group and leave them out of comment-label scanning. Separately, record the current collector-revision change under WO-107's reopen condition. Whether to re-collect or to admit the comment-only revision stays an operator choice.",
        "evidenceRefs": [
          "corpus/harness/profile.mjs:258-320",
          "corpus/harness/wo107-schema.test.mjs",
          "scripts/test-runner.mjs",
          "scripts/lib/comment-labels.mjs",
          "docs/control/comment-baseline.json",
          ".prettierignore",
          "docs/evidence/WO-107/decisions.md:33"
        ],
        "affectedUsers": [
          "executors and verifiers of orders whose cleanup touches corpus/harness",
          "planner consuming the WO-107 baseline for the declared-versus-observed cost loop"
        ],
        "affectedSystems": [
          "corpus/harness/profile.mjs",
          "scripts/test-runner.mjs",
          "scripts/lib/comment-labels.mjs",
          ".prettierignore"
        ],
        "expectedValue": "A rewrite of hash-pinned collector bytes is seen in the order that makes it, not at the next baseline consumer, and the first observed cost baseline stays verifiable.",
        "altitude": 6,
        "uncertainty": "Only one lane is affected today, and this episode did not establish a near-term consumer of the WO-107 records (a register candidate names profile.mjs for reuse). Two archive-only test failures were not diagnosed; both pass in the frozen copy. I inferred, without executing it, that the comment rule forced the edit.",
        "risks": [
          "A new runner row departs from WO-107's 'nothing joins the root npm test' scope",
          "Exempting files from the comment rule leaves report-local labels in them",
          "Admitting comment-only revisions into protocolLineage weakens the byte pin"
        ],
        "alternatives": [
          "Hash a comment-stripped or AST form of the collector instead of raw bytes",
          "Accept the drift as WO-105 D012 did and record it whenever an order touches corpus/harness",
          "Run the provenance check from the planning-entry conditions listing instead of the gate"
        ],
        "duplicationHints": [
          "docs/proposals/machinery-selection-follows-imports/ (WO-174's source-selected runner rows, which option (a) would use)",
          "docs/proposals/gate-identity-covers-suite-inputs/",
          "WO-105 D012 (base-keyed byte pins accepted as drift)"
        ],
        "urgencyRationale": "Low. No runtime path consumes the records today. The cost is that the first observed cost-loop baseline cannot be verified until re-derived, and the next collector or formatter edit repeats the drift silently."
      }
    }
  ],
  "resultEnvelope": {
    "workOrderId": "wo_entropy_review_1",
    "episodeId": "ep_entropy_47ed74333b9cbb64",
    "status": "completed",
    "resultId": "res_ep_entropy_47ed74333b9cbb64_review",
    "summary": "Census: 6,194 tracked paths from git ls-files; the 3 docs/intake/** paths were counted, never opened. Four lenses worked serially; two measured findings survived self-refutation. ER6-001: the WO-107 profiling lane is red at HEAD (2 of 13 tests fail 'known collector revision'). Commit 1aea2dea rewrote one comment in the hash-pinned collector corpus/harness/profile.mjs, a cleanup for the new comment-label check, which scans corpus/ and baselines none of it. Restoring that file alone clears both failures. No runner row runs the lane, WO-188's verifier classed the edit comment-only, no record notes the drift, and .prettierignore leaves the collector formattable. ER6-002: product 03 says the corpus entry point links each lane's commands, but it names only WO-101's lanes; WO-102 to WO-107 settled recording theirs in their own manifests. The WO-101, WO-102 and WO-103 lanes pass. Dropped after probes: front-page guard (negative control present), skill-tree drift (identical), package-publish gaps (all refuse), the What-runs-today budget (folding covers it), rising verification rounds (no attributable cause). One packet. Writes: ignored build output and .runtime/ in the copy; scratch under TMPDIR. Awaiting operator disposition.",
    "requiresHuman": true
  },
  "cleanRoom": {
    "status": "passed",
    "stopConditionsFound": false,
    "evidenceRefs": [
      "Census and lens reads used paths named by git ls-files. The 3 tracked docs/intake/** paths were counted, with their names masked, and never opened.",
      "One repository-wide git grep for DOTLN_PACKAGE_PUBLISH_REFUSED was not path-restricted. Its saved output contains 0 lines naming docs/intake; every other search excluded docs/intake or named explicit roots.",
      "No employer code, configuration, identifiers, internal services, credentials or secrets were found or used. Findings cite repository-relative paths, commit hashes, test names and public tool versions; author metadata seen in git show output is not carried.",
      "git status --porcelain was empty at the end of the episode. Writes were ignored build output and the ignored .runtime/ directory in the copy, plus scratch archives and logs under the episode TMPDIR."
    ]
  }
}
```

## Disposition

```json
{
  "findingCount": 2,
  "proposalPacketCount": 1,
  "proposalFiling": "awaiting operator disposition; not filed",
  "nextStep": "Fresh blinded refutation before any disposition."
}
```

Findings never authorize a fix. Proposal filing and promotion to a work order remain separate operator acts, and this receipt stops at disposition. The JSON and this rendering are immutable; a later attempt files the next number.

Local-terms list: **present**. Receipt hash: `sha256:cea20524cfcecf8d2a1eec8cb56cb08f14cbc53fe304e76d470796aeb4e9877a`.
