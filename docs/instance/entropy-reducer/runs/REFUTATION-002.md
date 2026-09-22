# Entropy Reducer refutation — REFUTATION-002

Challenges `REVIEW-002` (receipt hash `sha256:fe823e4b4bd762a93b9b848de32b96f3991de7f716bbd379a30c467cccb1d40d`) over subject hash `cf4db2192813b44582feeef466489d5125d70c5aa655d4ad3c8d3737c6960dc6` at commit `5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e`.

Refuter: **entropy-reducer@1** — `claude-fable-5-1` at effort `max` on `claude-code` 2.1.278; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 4 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 4. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it. Denied tool calls: 0.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 627 s, 30 turns, USD 3.9674845000000003; source claude-result-envelope

## Worker statement

{"schemaVersion":1,"attempts":[{"findingId":"ER2-003","result":"survived","reason":"Reproduction ran (exit 0) and shows what it appears to show. Cold-start profiles for .claude/skills: executor 24412 of 24576 (164 bytes headroom), verifier 21365/25151, reviewer 22543/24576, release-close 13967/16384, planner 15033/24576, refuter 15690 with no ceiling; all verdicts 'within', no stderr advisory. bytes = CLAUDE.md (6113) + role SKILL.md, verified with wc -c; 'prev' is the fixed comparison edition tag v0.16.0 (2026-09-09; CLAUDE.md 3593 + executor skill 7254 = 10847), not the prior commit or prior release, so any growth claim is against that edition. The 1667-byte 'DotLn has five refusals' paragraph is byte-identical in CLAUDE.md line 62 (inside the generated dotln-harness block, lines 60-73) and once in each of the six SKILL.md files in both .claude/skills and .agents/skills; it did not exist in the v0.16.0 skill. All copies are compiled from one source string at packages/compiler/src/harness.ts:1042, so the duplication is compile fan-out in tracked outputs and every role cold start loads the paragraph twice. The grep uses -F on the full line and matched the complete identical line. The build step is unnecessary for the measurement but harmless (outputs go to ignored dist/ and .runtime/).","evidenceRefs":["cmd: node scripts/harness-context.mjs --check | node -e '...profiles...' -> executor 24412 of 24576 prev 10847; verifier 21365 of 25151 prev 8232; reviewer 22543 of 24576 prev 8665; release-close 13967 of 16384 prev 6107; planner 15033 of 24576 prev 5455; refuter 15690 of null prev null","cmd: grep -c -F \"$(grep -m1 '^DotLn has five refusals' CLAUDE.md)\" .claude/skills/*/SKILL.md -> 1 in each of 6 files; same for .agents/skills/*/SKILL.md","scripts/lib/process-budget.mjs:87-138 (measureColdStarts: bytes = CLAUDE.md + SKILL.md; previousBytes via git show v0.16.0:path; ceiling from docs/control/budgets.json limits.coldStartBytes)","cmd: wc -c CLAUDE.md .claude/skills/*/SKILL.md -> 6113, executor 18299, planner 8920, refuter 9577, release-close 7854, reviewer 16430, verifier 15252","cmd: git show v0.16.0:CLAUDE.md | wc -c -> 3593; git show v0.16.0:.claude/skills/dotln-executor/SKILL.md | wc -c -> 7254; paragraph absent in v0.16.0 skill","CLAUDE.md:60-73 dotln-harness block; CLAUDE.md:62 paragraph, 1667 bytes","packages/compiler/src/harness.ts:1042 single source string of the paragraph","docs/control/budgets.json limits.coldStartBytes and acceptances dated 2026-09-17 to 2026-09-20 raising executor, verifier, reviewer, release-close ceilings"]},{"findingId":"ER2-001","result":"survived","reason":"Reproduction ran (exit 0) and its per-type byte shares are correct. An independent recount that reads each of the 80 tracked selfhost-verification.jsonl files separately, classifies by JSON.parse top-level type and sums UTF-8 bytes gives identical shares: VerificationOpened 80 records 63,993,150 bytes (63.4%, avg 800 KB), CommandPersisted 80 records 33,669,723 bytes (33.4%, avg 421 KB), WorkerHeartbeat 7,473 records 2.8%, all other types 0.1% or less; total 100,882,272 bytes equals the on-disk sum. Artifact checks: 0 regex-vs-parse type mismatches, 0 unparsable lines, every file ends with a newline so cat concatenation merges no records, and the UTF-16 length used by the reproduction differs from UTF-8 bytes by 128 bytes in 100.9 MB. The size is explained by embedded file contents: the largest record (1,165,726 bytes, WO-149/feedback-002 VerificationOpened) carries the same 96,717-byte file contents under payload.baseline.files[10].contents and payload.subject.files[12].contents, and the CommandPersisted record in the same file carries a third copy under payload.command.intent.payload.capsule.subject.files[12].contents.","evidenceRefs":["cmd: git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e '...' -> VerificationOpened 80 records 63993074 bytes (63.4%); CommandPersisted 80 records 33669683 (33

## Bound report

```json
{
  "schemaVersion": 1,
  "selection": {
    "measuredDenominator": 4,
    "measuredStatus": "selected",
    "inspectionDenominator": 0,
    "inspectionStatus": "not-applicable",
    "inspectionSampleSize": 0,
    "selectionRule": "every measured finding and every by-inspection finding",
    "measuredSubjects": [
      {
        "findingId": "ER2-003",
        "command": "cd <frozenSubjectPath> && node scripts/build.mjs >/dev/null && node scripts/harness-context.mjs --check | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{for(const r of JSON.parse(s).profiles)if(r.skillsRoot===\".claude/skills\")console.log(r.role,r.bytes,\"of\",r.ceiling,\"prev\",r.previousBytes)})' && grep -c -F \"$(grep -m1 '^DotLn has five refusals' CLAUDE.md)\" .claude/skills/*/SKILL.md"
      },
      {
        "findingId": "ER2-001",
        "command": "cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const b={},n={};for(const l of s.split(\"\\n\")){if(!l)continue;const m=/\"type\":\"([A-Za-z]+)\"/.exec(l);const t=m?m[1]:\"?\";b[t]=(b[t]||0)+l.length+1;n[t]=(n[t]||0)+1}const tot=Object.values(b).reduce((a,c)=>a+c,0);for(const [t,v] of Object.entries(b).sort((x,y)=>y[1]-x[1]))console.log(t,\"records\",n[t],\"bytes\",v,\"(\"+(100*v/tot).toFixed(1)+\"%)\")})'"
      },
      {
        "findingId": "ER2-002",
        "command": "cd <frozenSubjectPath> && git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | wc -l"
      },
      {
        "findingId": "ER2-004",
        "command": "cd <frozenSubjectPath> && node --input-type=module -e 'import fs from \"node:fs\";import {syncBuiltinESMExports} from \"node:module\";let n=0;const o=fs.statSync;fs.statSync=function(...a){n++;return o.apply(this,a)};syncBuiltinESMExports();process.argv=[process.argv[0],\"scripts/refute-plan.mjs\",\"check\"];process.on(\"exit\",()=>console.error(\"statSync calls:\",n));await import(\"./scripts/refute-plan.mjs\")' 2>&1 >/dev/null | tail -1"
      }
    ],
    "inspectionSubjects": [],
    "selectedFindingIds": [
      "ER2-003",
      "ER2-001",
      "ER2-002",
      "ER2-004"
    ]
  },
  "attempts": [
    {
      "findingId": "ER2-003",
      "result": "survived",
      "reason": "Reproduction ran (exit 0) and shows what it appears to show. Cold-start profiles for .claude/skills: executor 24412 of 24576 (164 bytes headroom), verifier 21365/25151, reviewer 22543/24576, release-close 13967/16384, planner 15033/24576, refuter 15690 with no ceiling; all verdicts 'within', no stderr advisory. bytes = CLAUDE.md (6113) + role SKILL.md, verified with wc -c; 'prev' is the fixed comparison edition tag v0.16.0 (2026-09-09; CLAUDE.md 3593 + executor skill 7254 = 10847), not the prior commit or prior release, so any growth claim is against that edition. The 1667-byte 'DotLn has five refusals' paragraph is byte-identical in CLAUDE.md line 62 (inside the generated dotln-harness block, lines 60-73) and once in each of the six SKILL.md files in both .claude/skills and .agents/skills; it did not exist in the v0.16.0 skill. All copies are compiled from one source string at packages/compiler/src/harness.ts:1042, so the duplication is compile fan-out in tracked outputs and every role cold start loads the paragraph twice. The grep uses -F on the full line and matched the complete identical line. The build step is unnecessary for the measurement but harmless (outputs go to ignored dist/ and .runtime/).",
      "evidenceRefs": [
        "cmd: node scripts/harness-context.mjs --check | node -e '...profiles...' -> executor 24412 of 24576 prev 10847; verifier 21365 of 25151 prev 8232; reviewer 22543 of 24576 prev 8665; release-close 13967 of 16384 prev 6107; planner 15033 of 24576 prev 5455; refuter 15690 of null prev null",
        "cmd: grep -c -F \"$(grep -m1 '^DotLn has five refusals' CLAUDE.md)\" .claude/skills/*/SKILL.md -> 1 in each of 6 files; same for .agents/skills/*/SKILL.md",
        "scripts/lib/process-budget.mjs:87-138 (measureColdStarts: bytes = CLAUDE.md + SKILL.md; previousBytes via git show v0.16.0:path; ceiling from docs/control/budgets.json limits.coldStartBytes)",
        "cmd: wc -c CLAUDE.md .claude/skills/*/SKILL.md -> 6113, executor 18299, planner 8920, refuter 9577, release-close 7854, reviewer 16430, verifier 15252",
        "cmd: git show v0.16.0:CLAUDE.md | wc -c -> 3593; git show v0.16.0:.claude/skills/dotln-executor/SKILL.md | wc -c -> 7254; paragraph absent in v0.16.0 skill",
        "CLAUDE.md:60-73 dotln-harness block; CLAUDE.md:62 paragraph, 1667 bytes",
        "packages/compiler/src/harness.ts:1042 single source string of the paragraph",
        "docs/control/budgets.json limits.coldStartBytes and acceptances dated 2026-09-17 to 2026-09-20 raising executor, verifier, reviewer, release-close ceilings"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "docs/control/budgets.json; packages/skeleton/src/loadouts/contributor.ts (generator of CLAUDE.md harness block and skills); .claude/skills/*/SKILL.md; .agents/skills/*/SKILL.md; scripts/lib/harness-context.mjs",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && node scripts/build.mjs >/dev/null && node scripts/harness-context.mjs --check | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{for(const r of JSON.parse(s).profiles)if(r.skillsRoot===\".claude/skills\")console.log(r.role,r.bytes,\"of\",r.ceiling,\"prev\",r.previousBytes)})' && grep -c -F \"$(grep -m1 '^DotLn has five refusals' CLAUDE.md)\" .claude/skills/*/SKILL.md"
      }
    },
    {
      "findingId": "ER2-001",
      "result": "survived",
      "reason": "Reproduction ran (exit 0) and its per-type byte shares are correct. An independent recount that reads each of the 80 tracked selfhost-verification.jsonl files separately, classifies by JSON.parse top-level type and sums UTF-8 bytes gives identical shares: VerificationOpened 80 records 63,993,150 bytes (63.4%, avg 800 KB), CommandPersisted 80 records 33,669,723 bytes (33.4%, avg 421 KB), WorkerHeartbeat 7,473 records 2.8%, all other types 0.1% or less; total 100,882,272 bytes equals the on-disk sum. Artifact checks: 0 regex-vs-parse type mismatches, 0 unparsable lines, every file ends with a newline so cat concatenation merges no records, and the UTF-16 length used by the reproduction differs from UTF-8 bytes by 128 bytes in 100.9 MB. The size is explained by embedded file contents: the largest record (1,165,726 bytes, WO-149/feedback-002 VerificationOpened) carries the same 96,717-byte file contents under payload.baseline.files[10].contents and payload.subject.files[12].contents, and the CommandPersisted record in the same file carries a third copy under payload.command.intent.payload.capsule.subject.files[12].contents.",
      "evidenceRefs": [
        "cmd: git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e '...' -> VerificationOpened 80 records 63993074 bytes (63.4%); CommandPersisted 80 records 33669683 (33.4%); WorkerHeartbeat 7473 records 2776937 (2.8%)",
        "probe: per-file JSON.parse recount -> files 80, noTrailingNewline 0, badJson 0, regexMismatches 0, totalBytes(utf8) 100882272 = diskBytesSum, VerificationOpened 63.4% avg 799914, CommandPersisted 33.4% avg 420872",
        "probe: docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl VerificationOpened total 1165721 chars, large leaves $.payload.baseline.files.10.contents 96717 and $.payload.subject.files.12.contents 96717; CommandPersisted total 604079, $.payload.command.intent.payload.capsule.subject.files.12.contents 96717",
        "cmd: git ls-files docs/evidence | grep -c 'selfhost-verification.jsonl$' -> 80"
      ],
      "evidenceLabel": "measured",
      "severity": "major",
      "surface": "docs/evidence/**/feedback*/selfhost-verification.jsonl; packages/skeleton/src/feedback-selfhost.ts; scripts/feedback-evidence.mjs; docs/planning/refutations/*.json; scripts/lib/plan-receipts.mjs",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const b={},n={};for(const l of s.split(\"\\n\")){if(!l)continue;const m=/\"type\":\"([A-Za-z]+)\"/.exec(l);const t=m?m[1]:\"?\";b[t]=(b[t]||0)+l.length+1;n[t]=(n[t]||0)+1}const tot=Object.values(b).reduce((a,c)=>a+c,0);for(const [t,v] of Object.entries(b).sort((x,y)=>y[1]-x[1]))console.log(t,\"records\",n[t],\"bytes\",v,\"(\"+(100*v/tot).toFixed(1)+\"%)\")})'"
      }
    },
    {
      "findingId": "ER2-002",
      "result": "survived",
      "reason": "Reproduction ran (exit 0) and printed 59. The 59 unique paths all exist at HEAD, all sit at docs/evidence/WO-*/feedback*/selfhost-verification.jsonl depth (the git pathspec '*' matched nothing deeper), and the pathspec has zero delete or rename events in the whole history, so each is a first-time add rather than a re-add. Per committer-day adds are 9, 12, 10, 7, 6, 12, 3 for 2026-09-15 through 2026-09-21 (sum 59) against at most 4 per day before 09-15; 79 such files are tracked at HEAD. The figure is a lower bound, not an overstatement: --name-only prints no diff for merge commits, so two files that entered via merges 38cd6dd9 and 58eb4ca1 on 2026-09-15 (WO-047/feedback-001, WO-048/feedback-002) are omitted, giving 61 with -m --first-parent; and the bare --since date resolves at local midnight (host TZ -0400, matching the commit offsets), giving 62 under an explicit UTC boundary because commit 6cdbfd6c at 2026-09-14T23:51-04:00 added three WO-044 files. The claim of roughly 60 of 79 feedback JSONL files added in the last week holds under every variant.",
      "evidenceRefs": [
        "cmd: git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | wc -l -> 59",
        "cmd: same log with --format='C %h ad=%ad cd=%cd %s' --date=iso-strict -> 36 commits from e2aea10b 2026-09-15T13:06:50-04:00 to d9286717 2026-09-21T20:01:11-04:00, 59 file lines; author and committer dates equal except ef3b04b8 (both on 09-15)",
        "probe: all 59 paths exist at HEAD (no MISSING), all have 5 path segments",
        "cmd: git log --diff-filter=DR --name-status -- pathspec -> no output (no deletes or renames in history)",
        "cmd: git ls-files 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | wc -l -> 79; all-time --diff-filter=A adds -> 77; comm shows WO-047/feedback-001 and WO-048/feedback-002 never listed as A; their first commits are merges 38cd6dd9 and 58eb4ca1 dated 2026-09-15",
        "cmd: --since=2026-09-15T00:00:00Z -> 62; --since=2026-09-15T00:00:00-04:00 -> 59; --since=2026-09-15 -m --first-parent -> 61; date +%z -> -0400",
        "cmd: adds per committer day -> 09-15 9, 09-16 12, 09-17 10, 09-18 7, 09-19 6, 09-20 12, 09-21 3; 09-07..09-14 between 1 and 4 per day"
      ],
      "evidenceLabel": "measured",
      "severity": "major",
      "surface": "scripts/lib/evidence-sources.mjs; packages/skeleton/src/feedback-selfhost.ts (validateSelfhost subject comparison, lines 172-189, 212); scripts/feedback-evidence.mjs; docs/evidence/current.json",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | wc -l"
      }
    },
    {
      "findingId": "ER2-004",
      "result": "survived",
      "reason": "Reproduction ran and printed 'statSync calls: 3879656'; the count was identical across three separate runs, and a plain 'node scripts/refute-plan.mjs check' exits 0 in about 19 s wall (16 s user), so the count covers a completed check rather than a partial failure. The argv override does dispatch the check: isMainModule compares realpath(process.argv[1]) with the module path (scripts/lib/paths.mjs:255-264), so main(['check']) runs syncFollowups plus checkPlanGate (scripts/refute-plan.mjs:121-123). Sampled stacks attribute about 99.7% of calls (3.87M) to cacheKey -> loadConfig -> docRelative -> rootPattern in scripts/lib/config.mjs:429-512, where loadConfig deliberately stats the config file once per lookup; the caller is scripts/lib/plan-subject.mjs:309-315, which for each of the 100 sequence orders filters all 2,971 committed paths and builds a RegExp via rootPattern per path, so one statSync per order-path pair: 100 x 2971 = 297,100 per subject build, and about 13 builds during check gives 3.87M. The wrapper only intercepts public fs.statSync (Node's loaders use internal bindings), so the count is attributable to repository code, not to module loading.",
      "evidenceRefs": [
        "cmd: node --input-type=module -e '...patch fs.statSync...await import(\"./scripts/refute-plan.mjs\")' 2>&1 >/dev/null | tail -1 -> statSync calls: 3879656 (three runs, identical)",
        "cmd: node scripts/refute-plan.mjs check -> exit 0; time -> 16.05s user 2.95s system 18.997 total",
        "scripts/lib/paths.mjs:255-264 isMainModule realpath comparison; scripts/refute-plan.mjs:121-123 check dispatch; scripts/refute-plan.mjs:299-313 main invocation",
        "probe: sampled stack histogram (1 in 200) -> 3874600 ~calls cacheKey (scripts/lib/config.mjs:432:18) <- loadConfig (config.mjs:444:15) <- docRelative (config.mjs:503:9) <- rootPattern (config.mjs:512:3); next bucket 3200 via receiptsRoot (scripts/lib/plan-receipts.mjs:41:32)",
        "probe: deeper sample (1 in 500) -> 3868500 ~calls rootPattern <- scripts/lib/plan-subject.mjs:311:13 <- Array.filter <- plan-subject.mjs:309:35 <- Array.map",
        "scripts/lib/config.mjs:427-435 comment 'One stat per lookup keeps a launchpad ... honest' and cacheKey statSync; scripts/lib/plan-subject.mjs:309-315 per-order filter over committed.paths calling rootPattern",
        "cmd: git ls-files | wc -l -> 2971; sequence block in docs/planning/sequence.md -> 100 orders"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "scripts/refute-plan.mjs; scripts/lib/plan-subject.mjs; scripts/lib/config.mjs (loadConfig); scripts/test-runner.mjs document selection",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && node --input-type=module -e 'import fs from \"node:fs\";import {syncBuiltinESMExports} from \"node:module\";let n=0;const o=fs.statSync;fs.statSync=function(...a){n++;return o.apply(this,a)};syncBuiltinESMExports();process.argv=[process.argv[0],\"scripts/refute-plan.mjs\",\"check\"];process.on(\"exit\",()=>console.error(\"statSync calls:\",n));await import(\"./scripts/refute-plan.mjs\")' 2>&1 >/dev/null | tail -1"
      }
    }
  ],
  "promotedFindingIds": [
    "ER2-003",
    "ER2-001",
    "ER2-002",
    "ER2-004"
  ],
  "refutedFindingIds": [],
  "blockedFindingIds": [],
  "unselectedFindingIds": []
}
```

A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.

Local-terms list: **unavailable**. Receipt hash: `sha256:90dbd2e73467ab67c13f3d32946b199798d7395672ca4a933a5d7a6f59d5e000`.
