# Entropy Reducer refutation — REFUTATION-008

Challenges `REVIEW-007` (receipt hash `sha256:77e844d7934a5ac959f6e952cc7b5cf78135eb2fff22706fd4bb59f6298564c5`) over subject hash `857f9b21a78c43f94a4fd76cbbdb90d7a58c1e7c1b74c66c59403d4b09826253` at commit `e4c46109d19c98b37c6cd4c4f0923b8282f09c18`.

Refuter: **entropy-reducer@1** — `claude-opus-5-5` at effort `xhigh` on `claude-code` 2.1.304; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 2 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 2. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell writes instructed to stay inside the copy or episode temporary directory, witnessed by copy and temporary inventories. Denied tool calls: 0.

Subject binding: the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused. Source repository: tracked-path status unchanged across the episode: **true**; untracked, non-ignored path listing unchanged: **true** (2 before, 2 after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: 0 path(s) added, 0 removed, 0 resized. Episode temporary directory: 0 path(s), 0 bytes. Frozen copy inventoried at 6871 path(s) before and 6871 after.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 193 s, 25 turns, USD 0.7527450000000001; source claude-result-envelope

## Attempt reasons

- `ER7-002` survived: The reproduction gave the stated output. docs-check prints 7 advisories that are not in the baseline, in WO-200, WO-210, WO-221 and WO-203 records, and reports 'Operator-word advisories: 28; historical baseline: 332' with PASS and 0 failures. Line 357 is WO-188-D015's reopenWhen: 'A new record quotes operator words without a capture digest and the check admits it.' Zero planning *.md files cite WO-188-D015. standard-pass-2026-10-19.md:490-491 says the operator-word advisories are historical. Inspection supports the implied contradiction. The flagged records quote the operator verbatim with no digest: WO-200-D002 'Extend the test repair scope', WO-210-D024 'ok if it doesn't, i authorize failing…', WO-221-D028 'Approve both acceptance corrections'. All three were committed before the pass closed (899eeec1). The baseline and those records are unchanged since then, so the check already counted these as current, not historical, when the pass called them historical. One point dissents. The settled follow-up FUP-71fc2efc208f597a in followups.json does route D015, but its reopen condition is narrower ('a typed quotation without a digest'), and D015's rejected option admits that the regex cannot tell paraphrase from quotation. That narrows how to read the trigger. It does not falsify what the reproduction shows. Evidence: node scripts/docs-check.mjs: 7 matching ADVISORY lines; 'Operator-word advisories: 28; historical baseline: 332.'; PASS with 0 failures; docs/evidence/WO-188/decisions.md:357 reopenWhen for WO-188-D015; git grep -l 'WO-188-D015' -- 'docs/planning/*.md' | wc -l = 0; docs/planning/standard-pass-2026-10-19.md:490-491 '(0 failures; the operator-word advisories are historical and none is in this pass's files)'; scripts/docs-check.mjs:570-580 current = findings whose fingerprint is not in the baseline; docs/evidence/WO-200/decisions.md WO-200-D002, docs/evidence/WO-210/decisions.md WO-210-D024, docs/evidence/WO-221/decisions.md WO-221-D028 verbatim operator quotes without SHA-256; git merge-base --is-ancestor 81b417b9 899eeec1 and a37a1bb3 899eeec1 both true; no change to docs/control/doc-baseline.json or the flagged records in 899eeec1..HEAD; dissent: docs/planning/followups.json FUP-71fc2efc208f597a settled onto WO-188-D015 with reopenWhen 'Reopen if a typed quotation without a digest is admitted.'.
- `ER7-001` survived: The reproduction ran in the episode TMPDIR and shows what it claims. A copy made with the same clone flags as freezeSubject (clone --no-hardlinks --no-checkout, then checkout --detach) keeps origin pointing at its source. A push from the copy created branch 'escaped' in the source. Both fingerprints stayed at the empty-input hash e3b0c44298fc before and after the push: the source's tracked status (porcelain, --untracked-files=no) and its untracked list. The frozen copy's own origin resolves to the live operator checkout <home>/Projects/DotLn. Reading the code confirms the probe matches the real mechanism. freezeSubject never removes or rewrites origin. The filing guard checks only trackedStatus, which is `git status --porcelain --untracked-files=no`. The witnesses for claude-cli-print are the copy and temporary inventories, and both skip .git. So nothing that binds the receipt would see a ref or object written into the source repository through the copy's origin. I did not push to the real origin; that path is shown only by remote get-url and the code. Evidence: probe output: copy origin == source: yes; tracked before/after e3b0c44298fc; untracked before/after e3b0c44298fc; source branches: escaped main; frozen copy origin: <home>/Projects/DotLn; scripts/lib/entropy-review.mjs:334-361 freezeSubject clones root with --no-hardlinks --no-checkout and never removes or rewrites origin; scripts/lib/entropy-review.mjs:126-127 trackedStatus = git status --porcelain --untracked-files=no; scripts/lib/entropy-review.mjs:1272-1286 the filing guard compares only trackedStatusSha256 on the HEAD route; scripts/lib/entropy-review.mjs:1393-1398 claude-cli-print commandExecution: shell writes are only instructed to stay inside the copy, witnessed by copy and temporary inventories; scripts/lib/entropy-review.mjs:129-147 scratchInventory skips .git.

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
        "findingId": "ER7-002",
        "command": "node scripts/docs-check.mjs | grep -E '^(ADVISORY docs/(evidence/WO-2(00|10|21)|verifications/WO-203)|Operator-word advisories)'; sed -n 357p docs/evidence/WO-188/decisions.md | cut -c1-110; git grep -l 'WO-188-D015' -- 'docs/planning/*.md' | wc -l; sed -n 490,491p docs/planning/standard-pass-2026-10-19.md"
      },
      {
        "findingId": "ER7-001",
        "command": "S=$(mktemp -d) && git -C \"$S\" init -q && git -C \"$S\" -c user.name=probe -c user.email=probe@example.invalid commit -q --allow-empty -m s && git clone -q --no-hardlinks --no-checkout \"$S\" \"$S.copy\" && git -C \"$S.copy\" checkout -q --detach HEAD && echo \"copy origin == source: $([ \"$(git -C \"$S.copy\" remote get-url origin)\" = \"$S\" ] && echo yes)\" && echo \"tracked before $(git -C \"$S\" status --porcelain --untracked-files=no | shasum -a 256 | cut -c1-12) untracked before $(git -C \"$S\" ls-files --others --exclude-standard -z | shasum -a 256 | cut -c1-12)\" && git -C \"$S.copy\" push -q origin HEAD:refs/heads/escaped && echo \"tracked after  $(git -C \"$S\" status --porcelain --untracked-files=no | shasum -a 256 | cut -c1-12) untracked after  $(git -C \"$S\" ls-files --others --exclude-standard -z | shasum -a 256 | cut -c1-12)\" && echo \"source branches: $(git -C \"$S\" branch --list | tr -d ' *' | tr '\\n' ' ')\"; echo \"frozen copy origin: $(git remote get-url origin | sed 's|^/Users/[^/]*|<home>|')\"; rm -rf \"$S\" \"$S.copy\""
      }
    ],
    "inspectionSubjects": [],
    "selectedFindingIds": [
      "ER7-002",
      "ER7-001"
    ]
  },
  "attempts": [
    {
      "findingId": "ER7-002",
      "result": "survived",
      "reason": "The reproduction gave the stated output. docs-check prints 7 advisories that are not in the baseline, in WO-200, WO-210, WO-221 and WO-203 records, and reports 'Operator-word advisories: 28; historical baseline: 332' with PASS and 0 failures. Line 357 is WO-188-D015's reopenWhen: 'A new record quotes operator words without a capture digest and the check admits it.' Zero planning *.md files cite WO-188-D015. standard-pass-2026-10-19.md:490-491 says the operator-word advisories are historical. Inspection supports the implied contradiction. The flagged records quote the operator verbatim with no digest: WO-200-D002 'Extend the test repair scope', WO-210-D024 'ok if it doesn't, i authorize failing…', WO-221-D028 'Approve both acceptance corrections'. All three were committed before the pass closed (899eeec1). The baseline and those records are unchanged since then, so the check already counted these as current, not historical, when the pass called them historical. One point dissents. The settled follow-up FUP-71fc2efc208f597a in followups.json does route D015, but its reopen condition is narrower ('a typed quotation without a digest'), and D015's rejected option admits that the regex cannot tell paraphrase from quotation. That narrows how to read the trigger. It does not falsify what the reproduction shows.",
      "evidenceRefs": [
        "node scripts/docs-check.mjs: 7 matching ADVISORY lines; 'Operator-word advisories: 28; historical baseline: 332.'; PASS with 0 failures",
        "docs/evidence/WO-188/decisions.md:357 reopenWhen for WO-188-D015",
        "git grep -l 'WO-188-D015' -- 'docs/planning/*.md' | wc -l = 0",
        "docs/planning/standard-pass-2026-10-19.md:490-491 '(0 failures; the operator-word advisories are historical and none is in this pass's files)'",
        "scripts/docs-check.mjs:570-580 current = findings whose fingerprint is not in the baseline",
        "docs/evidence/WO-200/decisions.md WO-200-D002, docs/evidence/WO-210/decisions.md WO-210-D024, docs/evidence/WO-221/decisions.md WO-221-D028 verbatim operator quotes without SHA-256",
        "git merge-base --is-ancestor 81b417b9 899eeec1 and a37a1bb3 899eeec1 both true; no change to docs/control/doc-baseline.json or the flagged records in 899eeec1..HEAD",
        "dissent: docs/planning/followups.json FUP-71fc2efc208f597a settled onto WO-188-D015 with reopenWhen 'Reopen if a typed quotation without a digest is admitted.'"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "scripts/docs-check.mjs operator-word advisory; the planning entry's reopening observations; WO-188-D015",
      "reproduction": {
        "kind": "command",
        "command": "node scripts/docs-check.mjs | grep -E '^(ADVISORY docs/(evidence/WO-2(00|10|21)|verifications/WO-203)|Operator-word advisories)'; sed -n 357p docs/evidence/WO-188/decisions.md | cut -c1-110; git grep -l 'WO-188-D015' -- 'docs/planning/*.md' | wc -l; sed -n 490,491p docs/planning/standard-pass-2026-10-19.md"
      }
    },
    {
      "findingId": "ER7-001",
      "result": "survived",
      "reason": "The reproduction ran in the episode TMPDIR and shows what it claims. A copy made with the same clone flags as freezeSubject (clone --no-hardlinks --no-checkout, then checkout --detach) keeps origin pointing at its source. A push from the copy created branch 'escaped' in the source. Both fingerprints stayed at the empty-input hash e3b0c44298fc before and after the push: the source's tracked status (porcelain, --untracked-files=no) and its untracked list. The frozen copy's own origin resolves to the live operator checkout <home>/Projects/DotLn. Reading the code confirms the probe matches the real mechanism. freezeSubject never removes or rewrites origin. The filing guard checks only trackedStatus, which is `git status --porcelain --untracked-files=no`. The witnesses for claude-cli-print are the copy and temporary inventories, and both skip .git. So nothing that binds the receipt would see a ref or object written into the source repository through the copy's origin. I did not push to the real origin; that path is shown only by remote get-url and the code.",
      "evidenceRefs": [
        "probe output: copy origin == source: yes; tracked before/after e3b0c44298fc; untracked before/after e3b0c44298fc; source branches: escaped main; frozen copy origin: <home>/Projects/DotLn",
        "scripts/lib/entropy-review.mjs:334-361 freezeSubject clones root with --no-hardlinks --no-checkout and never removes or rewrites origin",
        "scripts/lib/entropy-review.mjs:126-127 trackedStatus = git status --porcelain --untracked-files=no",
        "scripts/lib/entropy-review.mjs:1272-1286 the filing guard compares only trackedStatusSha256 on the HEAD route",
        "scripts/lib/entropy-review.mjs:1393-1398 claude-cli-print commandExecution: shell writes are only instructed to stay inside the copy, witnessed by copy and temporary inventories",
        "scripts/lib/entropy-review.mjs:129-147 scratchInventory skips .git"
      ],
      "evidenceLabel": "measured",
      "severity": "major",
      "surface": "scripts/lib/entropy-review.mjs (freezeSubject, confinement record); packages/skeleton/src/worker-transport.ts (entropyArgs, claude-cli-print route)",
      "reproduction": {
        "kind": "command",
        "command": "S=$(mktemp -d) && git -C \"$S\" init -q && git -C \"$S\" -c user.name=probe -c user.email=probe@example.invalid commit -q --allow-empty -m s && git clone -q --no-hardlinks --no-checkout \"$S\" \"$S.copy\" && git -C \"$S.copy\" checkout -q --detach HEAD && echo \"copy origin == source: $([ \"$(git -C \"$S.copy\" remote get-url origin)\" = \"$S\" ] && echo yes)\" && echo \"tracked before $(git -C \"$S\" status --porcelain --untracked-files=no | shasum -a 256 | cut -c1-12) untracked before $(git -C \"$S\" ls-files --others --exclude-standard -z | shasum -a 256 | cut -c1-12)\" && git -C \"$S.copy\" push -q origin HEAD:refs/heads/escaped && echo \"tracked after  $(git -C \"$S\" status --porcelain --untracked-files=no | shasum -a 256 | cut -c1-12) untracked after  $(git -C \"$S\" ls-files --others --exclude-standard -z | shasum -a 256 | cut -c1-12)\" && echo \"source branches: $(git -C \"$S\" branch --list | tr -d ' *' | tr '\\n' ' ')\"; echo \"frozen copy origin: $(git remote get-url origin | sed 's|^/Users/[^/]*|<home>|')\"; rm -rf \"$S\" \"$S.copy\""
      }
    }
  ],
  "promotedFindingIds": [
    "ER7-002",
    "ER7-001"
  ],
  "refutedFindingIds": [],
  "blockedFindingIds": [],
  "unselectedFindingIds": []
}
```

A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.

Local-terms list: **present**. Receipt hash: `sha256:cfaa218c594d593c2a9a7a02498c3858ec57d80f7836b22236cf0099f3607b8c`.
