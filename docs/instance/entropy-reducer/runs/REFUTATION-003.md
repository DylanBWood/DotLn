# Entropy Reducer refutation — REFUTATION-003

Challenges `REVIEW-002` (receipt hash `sha256:fe823e4b4bd762a93b9b848de32b96f3991de7f716bbd379a30c467cccb1d40d`) over subject hash `cf4db2192813b44582feeef466489d5125d70c5aa655d4ad3c8d3737c6960dc6` at commit `5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e`.

Refuter: **entropy-reducer@1** — `claude-fable-5-1` at effort `max` on `claude-code` 2.1.278; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 4 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 4. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it and checked by the tracked-status hash on either side of the episode. Denied tool calls: 0.

Subject binding: the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused. Tracked status byte-identical across the episode: **true**. Frozen copy inventoried at 2971 path(s) before and 3811 after; scratch delta 840 path(s).

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 458 s, 21 turns, USD 2.8988545000000006; source claude-result-envelope

## Worker statement

{"schemaVersion":1,"attempts":[{"findingId":"ER2-003","result":"survived","reason":"Reproduction ran cleanly and its figures reconcile with independent measurement. Build exited 0 and `git status --porcelain` stayed empty afterwards, so the skills measured are the tracked files. Each profile's `bytes` equals `wc -c CLAUDE.md` (6113) plus the role SKILL.md (executor 18299 -> 24412, verifier 15252 -> 21365, reviewer 16430 -> 22543, release-close 7854 -> 13967, planner 8920 -> 15033, refuter 9577 -> 15690). Ceilings come from tracked docs/control/budgets.json (executor 24576, verifier 25151, reviewer 24576, release-close 16384, refuter null), whose acceptances raised executor/reviewer/verifier/release-close ceilings on 2026-09-17..20. previousBytes compares against tag v0.16.0, which resolves in the frozen copy. The grep target is a single 1667-byte line at CLAUDE.md:62 inside the dotln-harness block (lines 60-73) and it occurs exactly once in each of the six tracked .claude/skills/*/SKILL.md files, so the cold-start sum (CLAUDE.md + skill) loads it twice; no other CLAUDE.md line over 60 chars recurs in any skill. Caveat only: `--check` is not parsed by scripts/harness-context.mjs (only `--write` is), so the flag is inert, but the same measurement is printed regardless.","evidenceRefs":["cd <frozenSubjectPath> && node scripts/build.mjs >/dev/null && git status --porcelain | wc -l # 0","cd <frozenSubjectPath> && wc -c CLAUDE.md .claude/skills/*/SKILL.md # 6113 + 18299 = 24412 executor, matches profile row","cd <frozenSubjectPath> && grep -n -e 'dotln-harness:start' -e 'dotln-harness:end' -e '^DotLn has five refusals' CLAUDE.md # 60, 62, 73","cd <frozenSubjectPath> && grep -m1 '^DotLn has five refusals' CLAUDE.md | wc -c # 1667","cd <frozenSubjectPath> && git ls-files --error-unmatch docs/control/budgets.json .claude/skills/dotln-executor/SKILL.md","docs/control/budgets.json limits.coldStartBytes = {executor:24576,verifier:25151,reviewer:24576,release-close:16384,planner:24576,refuter:null}; acceptances dated 2026-09-17..20 raise these ceilings","scripts/lib/process-budget.mjs:87-147 (measureColdStarts: bytes = CLAUDE.md + SKILL.md, previous = v0.16.0)","scripts/harness-context.mjs:176-186 (only --write is parsed; --check is inert)","cd <frozenSubjectPath> && git rev-parse -q --verify 'v0.16.0^{commit}' # 0d09ee33"]},{"findingId":"ER2-001","result":"survived","reason":"The byte-share measurement is faithful. The pipeline selects exactly the 80 tracked selfhost-verification.jsonl files under docs/evidence; all 8297 concatenated lines parse as JSON (no cross-file line joining) and the first `\"type\":\"...\"` regex match equals the parsed top-level `type` on every record (0 mismatches). The command's total of 100,882,144 differs from the true UTF-8 total of 100,882,272 (`wc -c`) by only 128 bytes because it sums JS string length; percentages are unchanged (VerificationOpened 63.4%, CommandPersisted 33.4%, WorkerHeartbeat 2.8%). The dominance is real: the 80 VerificationOpened records are 451,923-1,165,725 bytes each, 63,978,590 of 63,993,150 bytes in `payload`, of which payload.subject.files (32.8 MB) and payload.baseline.files (30.1 MB) are embedded file contents; the 80 CommandPersisted records carry 33.6 MB in payload.command.intent.payload.","evidenceRefs":["cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | tr '\\0' '\\n' | wc -l # 80","cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 wc -c | tail -1 # 100882272 total","node probe over the same concatenation: records 8297, unparsable 0, regex/JSON type mismatches 0, true UTF-8 total 100882272, VerificationOpened 63.4%, CommandPersisted 33.4%","node probe: VerificationOpened per-record bytes min 451923 max 1165725; key payload 63978590 of 63993150","node probe: CommandPersisted payload.command.intent.payload 33586523; VerificationOpened payload.subject.files 32799250; payloa

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
      "reason": "Reproduction ran cleanly and its figures reconcile with independent measurement. Build exited 0 and `git status --porcelain` stayed empty afterwards, so the skills measured are the tracked files. Each profile's `bytes` equals `wc -c CLAUDE.md` (6113) plus the role SKILL.md (executor 18299 -> 24412, verifier 15252 -> 21365, reviewer 16430 -> 22543, release-close 7854 -> 13967, planner 8920 -> 15033, refuter 9577 -> 15690). Ceilings come from tracked docs/control/budgets.json (executor 24576, verifier 25151, reviewer 24576, release-close 16384, refuter null), whose acceptances raised executor/reviewer/verifier/release-close ceilings on 2026-09-17..20. previousBytes compares against tag v0.16.0, which resolves in the frozen copy. The grep target is a single 1667-byte line at CLAUDE.md:62 inside the dotln-harness block (lines 60-73) and it occurs exactly once in each of the six tracked .claude/skills/*/SKILL.md files, so the cold-start sum (CLAUDE.md + skill) loads it twice; no other CLAUDE.md line over 60 chars recurs in any skill. Caveat only: `--check` is not parsed by scripts/harness-context.mjs (only `--write` is), so the flag is inert, but the same measurement is printed regardless.",
      "evidenceRefs": [
        "cd <frozenSubjectPath> && node scripts/build.mjs >/dev/null && git status --porcelain | wc -l  # 0",
        "cd <frozenSubjectPath> && wc -c CLAUDE.md .claude/skills/*/SKILL.md  # 6113 + 18299 = 24412 executor, matches profile row",
        "cd <frozenSubjectPath> && grep -n -e 'dotln-harness:start' -e 'dotln-harness:end' -e '^DotLn has five refusals' CLAUDE.md  # 60, 62, 73",
        "cd <frozenSubjectPath> && grep -m1 '^DotLn has five refusals' CLAUDE.md | wc -c  # 1667",
        "cd <frozenSubjectPath> && git ls-files --error-unmatch docs/control/budgets.json .claude/skills/dotln-executor/SKILL.md",
        "docs/control/budgets.json limits.coldStartBytes = {executor:24576,verifier:25151,reviewer:24576,release-close:16384,planner:24576,refuter:null}; acceptances dated 2026-09-17..20 raise these ceilings",
        "scripts/lib/process-budget.mjs:87-147 (measureColdStarts: bytes = CLAUDE.md + SKILL.md, previous = v0.16.0)",
        "scripts/harness-context.mjs:176-186 (only --write is parsed; --check is inert)",
        "cd <frozenSubjectPath> && git rev-parse -q --verify 'v0.16.0^{commit}'  # 0d09ee33"
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
      "reason": "The byte-share measurement is faithful. The pipeline selects exactly the 80 tracked selfhost-verification.jsonl files under docs/evidence; all 8297 concatenated lines parse as JSON (no cross-file line joining) and the first `\"type\":\"...\"` regex match equals the parsed top-level `type` on every record (0 mismatches). The command's total of 100,882,144 differs from the true UTF-8 total of 100,882,272 (`wc -c`) by only 128 bytes because it sums JS string length; percentages are unchanged (VerificationOpened 63.4%, CommandPersisted 33.4%, WorkerHeartbeat 2.8%). The dominance is real: the 80 VerificationOpened records are 451,923-1,165,725 bytes each, 63,978,590 of 63,993,150 bytes in `payload`, of which payload.subject.files (32.8 MB) and payload.baseline.files (30.1 MB) are embedded file contents; the 80 CommandPersisted records carry 33.6 MB in payload.command.intent.payload.",
      "evidenceRefs": [
        "cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | tr '\\0' '\\n' | wc -l  # 80",
        "cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 wc -c | tail -1  # 100882272 total",
        "node probe over the same concatenation: records 8297, unparsable 0, regex/JSON type mismatches 0, true UTF-8 total 100882272, VerificationOpened 63.4%, CommandPersisted 33.4%",
        "node probe: VerificationOpened per-record bytes min 451923 max 1165725; key payload 63978590 of 63993150",
        "node probe: CommandPersisted payload.command.intent.payload 33586523; VerificationOpened payload.subject.files 32799250; payload.baseline.files 30144680"
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
      "reason": "The count of 59 is a clean count of distinct paths and reflects genuine additions, not an artifact. The sorted listing contains no blank line (`grep -c .` also gives 59) and every path has the expected docs/evidence/WO-NNN/feedback*/ shape. The additions come from 34 distinct non-merge commits dated 2026-09-15 through 2026-09-21 with author date equal to committer date, so the --since window is not distorted by rebasing. `--no-renames` and `-M` both still give 59, and there are 0 renames and 0 deletions of matching paths in the window, so nothing is a relocated or removed file. All 59 remain in the index, which holds 79 matching files; only 18 were added before the window. Repo history begins 2026-08-30.",
      "evidenceRefs": [
        "cd <frozenSubjectPath> && git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | grep -c .  # 59 (no blank-line artifact)",
        "cd <frozenSubjectPath> && git log --since=2026-09-15 --diff-filter=A --name-only --format='@@%h %ad %cd' --date=short -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl'  # 34 commits, 2026-09-15..21, author date == committer date",
        "same query with --no-renames: 59; with -M: 59; --diff-filter=R: 0; --diff-filter=D: 0",
        "cd <frozenSubjectPath> && git ls-files 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | wc -l  # 79; all 59 window paths pass git ls-files --error-unmatch",
        "cd <frozenSubjectPath> && git log --until=2026-09-14T23:59:59 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | grep -c .  # 18"
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
      "reason": "The instrument is sound and the number is real and attributable. `isMainModule` (scripts/lib/paths.mjs:255-264) resolves the relative argv[1], so the patched argv drives `main()` with the `check` command (syncFollowups + checkPlanGate), which finishes and prints its JSON. The count 3,879,656 was identical across three runs. Stack sampling of the patched statSync shows ~99.9% of samples at cacheKey (scripts/lib/config.mjs:432) <- loadConfig (:444) <- docRelative (:503) <- rootPattern (:512) <- the Array.filter callback at scripts/lib/plan-subject.mjs:309-314, which rebuilds a RegExp via rootPattern for every committed path of every sequence order and stats the config file each time; Node internals contribute nothing measurable. An unpatched `node scripts/refute-plan.mjs check` exits 0 in 19.66 s real (16.55 user, 3.13 sys), consistent with millions of synchronous stats.",
      "evidenceRefs": [
        "cd <frozenSubjectPath> && <supplied ER2-004 command>  # statSync calls: 3879656 on three separate runs",
        "stack-sampled variant of the same probe (every 997th/1009th call): 3886/3890 samples at cacheKey (scripts/lib/config.mjs:432:18) <- loadConfig (:444:15) <- docRelative (:503:9) <- rootPattern (:512:3) <- scripts/lib/plan-subject.mjs:311:13 <- Array.filter <- plan-subject.mjs:309:35",
        "scripts/lib/config.mjs:429-455 (cacheKey calls statSync on every loadConfig; docRelative/rootPattern call loadConfig per invocation)",
        "scripts/lib/plan-subject.mjs:308-314 (rootPattern invoked inside committed.paths.filter per sequence id)",
        "scripts/lib/paths.mjs:255-264 (isMainModule resolves relative process.argv[1])",
        "scripts/refute-plan.mjs:121-124 (check => syncFollowups(root,{check:true}); checkPlanGate(root))",
        "cd <frozenSubjectPath> && /usr/bin/time -p node scripts/refute-plan.mjs check  # exit 0; real 19.66 user 16.55 sys 3.13; 2110-byte JSON on stdout"
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

Local-terms list: **unavailable**. Receipt hash: `sha256:9db330d6836efb4fc9dc592158abac86de9ae187bfd3de0e68c03d0bb8704c2c`.
