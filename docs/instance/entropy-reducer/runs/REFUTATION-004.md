# Entropy Reducer refutation — REFUTATION-004

Challenges `REVIEW-003` (receipt hash `sha256:e41246c7f35b567775b6b3023df24c73987b283f32530d1b741dd9cbfbd947a7`) over subject hash `fd64d7151c3a17948d4706642d9273eef1fbe9b40023646bdc5b370ffe718a23` at commit `fa9957f18939492a6eae08b63f6ba256fd76d33d`.

Refuter: **entropy-reducer@1** — `claude-opus-5-5` at effort `xhigh` on `claude-code` 2.1.282; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 3 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 3. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it and checked by the tracked-path status and untracked-listing hashes on either side of the episode. Denied tool calls: 0.

Subject binding: the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused. Source repository: tracked-path status unchanged across the episode: **true**; untracked, non-ignored path listing unchanged: **false** (2 before, 8 after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: 892 path(s) added, 0 removed, 0 resized. Frozen copy inventoried at 3292 path(s) before and 4184 after.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 178 s, 20 turns, USD 0.8009128000000001; source claude-result-envelope

## Attempt reasons

- `ER3-002` survived: I ran the reproduction as given, inside the frozen copy. The build succeeded and `git status --porcelain` stayed empty afterwards. The instrumented collectSources call made 101 `node resume.mjs status` spawns that took 12624 ms in total, plus one `release.mjs list` at 5082 ms, one `resume.mjs usage` at 105 ms and one `worktree.mjs constellation` at 40 ms. Overall it took 18028 ms. The source matches this measurement. packages/console/src/collect.ts:117-139 collects the distinct workOrderIds from resume.jsonl and every docs/control/orders/WO-NNN.jsonl, then spawns one `resume.mjs status --json --work-order <id>` process for each id. That gives 101 ids from 79 order files plus the resume log. The spawns go through observedExecFileSync, and the probe's execFileSync patch captured them, so the count and timing are measured, not inferred. The CLI has no batch path: resume.mjs:809 rejects ambiguous `status --json` without --work-order. That explains the design but does not undercut the measurement. Evidence: reproduction output: 101 12624ms node resume.mjs status; 1 5082ms node release.mjs list; total 18028ms; packages/console/src/collect.ts:117-139; packages/console/src/collect.ts:89-99; packages/console/src/collect.ts:242; scripts/resume.mjs:809; docs/control/orders/ (79 WO-NNN.jsonl files); git status --porcelain after build: 0 lines.
- `ER3-003` survived: Every grep returned the line it targets. The Entropy Reducer loadout grants `delegate.readonly` (entropy-reducer.ts:35, 1133) with `delegates: 4` (969, 1020). It also refuses to compile without that resource (1257). The review request validator requires at least one lens brief (entropy-review-protocol.ts:238). However, neither transport gives a delegation tool. On Claude, entropyArgs passes `--tools` from profile.modelTools, and the validator at entropy-review-protocol.ts:227-229 limits that list to ENTROPY_REVIEW_TOOLS = Bash, Read, Glob, Grep (line 31). There is no Task or Agent tool. On Codex, entropyArgs at worker-transport.ts:465-472 disables all of codexDisabled except shell_tool, unified_exec and code_mode_host, so `multi_agent` and `multi_agent_v2` (lines 209-210) are always disabled. The subagents exemption at line 369 exists only in the evidence-args path, and line 272 returns entropyArgs before that path is reached. REVIEW-002.json contains the recorded outcome twice: 'Zero of four lens delegates used (no delegate tool in this session)'. One caveat: the work order's knownFacts already say the kernel does not evaluate Program.All. That covers why this review is dispatched manually, but not the missing tool surface, so the reproduction still shows its claim. Evidence: packages/skeleton/src/entropy-review-protocol.ts:31; packages/skeleton/src/entropy-review-protocol.ts:227-229; packages/skeleton/src/entropy-review-protocol.ts:238-239; packages/skeleton/src/loadouts/entropy-reducer.ts:35; packages/skeleton/src/loadouts/entropy-reducer.ts:969; packages/skeleton/src/loadouts/entropy-reducer.ts:1020; packages/skeleton/src/loadouts/entropy-reducer.ts:1128-1137; packages/skeleton/src/loadouts/entropy-reducer.ts:1257; packages/skeleton/src/worker-transport.ts:209-210; packages/skeleton/src/worker-transport.ts:272; packages/skeleton/src/worker-transport.ts:369; packages/skeleton/src/worker-transport.ts:465-472; docs/instance/entropy-reducer/runs/REVIEW-002.json (grep -c = 2).
- `ER3-001` survived: The command reported 7 files containing '"--ephemeral"', 0 of them mentioning CODEX_HOME, and 6 non-test script files containing '"--ignore-user-config"'. It also printed worker-transport.ts:96-103, which passes process.env, or process.env plus the resident variables, to the spawned CLI. Those parts hold. The launch environment inherits whatever CODEX_HOME the operator has, and no launch file sets or scopes it. The counts are inflated by one, though. scripts/probe-worker-hosts.mjs only runs `codex exec --help` and `--version`, and its '--ephemeral' and '--ignore-user-config' strings are a checklist of help-text flags (lines 45-67), not launch arguments. So there are 6 real launch files, not 7, and 5 argument copies outside the transport, not 6: harness-probe, authority-probe, writing-worker-probe codexBase, local-model-role-qualification and target-worker-smoke. Those 5 do differ from the transport's hardened shapes. For example, target-worker-smoke and harness-probe lack --strict-config and shell_environment_policy.inherit="none". Separately, the transport comment at lines 95-96 says CLI-resolved auth is deliberate. The reproduction shows only that CODEX_HOME is never mentioned, not that the inheritance causes any leak. The qualitative claim stands, but the counts need correcting to 6 and 5. Evidence: reproduction output: 7 launch files, mention CODEX_HOME 0, argv copies outside the transport 6; scripts/probe-worker-hosts.mjs:45-67 (help-text flag checklist, not a launch); packages/skeleton/src/worker-transport.ts:95-103; packages/skeleton/src/worker-transport.ts:327-365; packages/skeleton/src/worker-transport.ts:428-465; packages/skeleton/src/worker-transport.ts:516-550; scripts/harness-probe.mjs:163-176; scripts/lib/authority-probe.mjs:271-298; scripts/lib/writing-worker-probe.mjs:613-632; scripts/probes/local-model-role-qualification.mjs:760-790; scripts/target-worker-smoke.mjs:101-117.

## Bound report

```json
{
  "schemaVersion": 1,
  "selection": {
    "measuredDenominator": 3,
    "measuredStatus": "selected",
    "inspectionDenominator": 0,
    "inspectionStatus": "not-applicable",
    "inspectionSampleSize": 0,
    "selectionRule": "every measured finding and every by-inspection finding",
    "measuredSubjects": [
      {
        "findingId": "ER3-002",
        "command": "cd <frozenSubjectPath> && mkdir -p .runtime/tmp && export TMPDIR=$PWD/.runtime/tmp && node scripts/build.mjs >/dev/null && node --input-type=module -e 'import cp from \"node:child_process\";import {syncBuiltinESMExports} from \"node:module\";const o=cp.execFileSync;const t=new Map();cp.execFileSync=function(f,a){const k=[f.split(\"/\").pop(),...(a||[]).slice(0,2).map(x=>x.split(\"/\").pop())].join(\" \");const s=performance.now();try{return o.apply(this,arguments)}finally{const e=t.get(k)||{n:0,ms:0};e.n++;e.ms+=performance.now()-s;t.set(k,e)}};syncBuiltinESMExports();const {collectSources}=await import(process.cwd()+\"/packages/console/dist/src/collect.js\");const s=performance.now();await collectSources(process.cwd(),[]);for(const [k,v] of t)console.log(v.n,Math.round(v.ms)+\"ms\",k);console.log(\"total\",Math.round(performance.now()-s)+\"ms\")'"
      },
      {
        "findingId": "ER3-003",
        "command": "cd <frozenSubjectPath> && grep -n 'ENTROPY_REVIEW_TOOLS =' packages/skeleton/src/entropy-review-protocol.ts; grep -n '\"delegate.readonly\"\\|delegates: 4\\|compiled authority lacks the delegates' packages/skeleton/src/loadouts/entropy-reducer.ts; grep -n 'lensBriefs.length > 0' packages/skeleton/src/entropy-review-protocol.ts; grep -n '\"multi_agent\",' packages/skeleton/src/worker-transport.ts; grep -c 'Zero of four lens delegates used' docs/instance/entropy-reducer/runs/REVIEW-002.json"
      },
      {
        "findingId": "ER3-001",
        "command": "cd <frozenSubjectPath> && echo 'Codex launch files:' && git grep -l -e '\"--ephemeral\"' -- 'packages/*/src/*.ts' 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' && echo \"mention CODEX_HOME: $(git grep -l -e '\"--ephemeral\"' -- 'packages/*/src/*.ts' 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' | xargs grep -l CODEX_HOME | wc -l)\" && echo \"argv copies outside the transport: $(git grep -l -e '\"--ignore-user-config\"' -- 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' ':!scripts/test-*.mjs' | wc -l)\" && sed -n 96,103p packages/skeleton/src/worker-transport.ts"
      }
    ],
    "inspectionSubjects": [],
    "selectedFindingIds": [
      "ER3-002",
      "ER3-003",
      "ER3-001"
    ]
  },
  "attempts": [
    {
      "findingId": "ER3-002",
      "result": "survived",
      "reason": "I ran the reproduction as given, inside the frozen copy. The build succeeded and `git status --porcelain` stayed empty afterwards. The instrumented collectSources call made 101 `node resume.mjs status` spawns that took 12624 ms in total, plus one `release.mjs list` at 5082 ms, one `resume.mjs usage` at 105 ms and one `worktree.mjs constellation` at 40 ms. Overall it took 18028 ms. The source matches this measurement. packages/console/src/collect.ts:117-139 collects the distinct workOrderIds from resume.jsonl and every docs/control/orders/WO-NNN.jsonl, then spawns one `resume.mjs status --json --work-order <id>` process for each id. That gives 101 ids from 79 order files plus the resume log. The spawns go through observedExecFileSync, and the probe's execFileSync patch captured them, so the count and timing are measured, not inferred. The CLI has no batch path: resume.mjs:809 rejects ambiguous `status --json` without --work-order. That explains the design but does not undercut the measurement.",
      "evidenceRefs": [
        "reproduction output: 101 12624ms node resume.mjs status; 1 5082ms node release.mjs list; total 18028ms",
        "packages/console/src/collect.ts:117-139",
        "packages/console/src/collect.ts:89-99",
        "packages/console/src/collect.ts:242",
        "scripts/resume.mjs:809",
        "docs/control/orders/ (79 WO-NNN.jsonl files)",
        "git status --porcelain after build: 0 lines"
      ],
      "evidenceLabel": "measured",
      "severity": "major",
      "surface": "packages/console/src/collect.ts (collectSources controlStatus and command runner); scripts/resume.mjs (status); scripts/release.mjs (list); packages/console/test/board.test.ts:992; scripts/test-runner.mjs console-docs task",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && mkdir -p .runtime/tmp && export TMPDIR=$PWD/.runtime/tmp && node scripts/build.mjs >/dev/null && node --input-type=module -e 'import cp from \"node:child_process\";import {syncBuiltinESMExports} from \"node:module\";const o=cp.execFileSync;const t=new Map();cp.execFileSync=function(f,a){const k=[f.split(\"/\").pop(),...(a||[]).slice(0,2).map(x=>x.split(\"/\").pop())].join(\" \");const s=performance.now();try{return o.apply(this,arguments)}finally{const e=t.get(k)||{n:0,ms:0};e.n++;e.ms+=performance.now()-s;t.set(k,e)}};syncBuiltinESMExports();const {collectSources}=await import(process.cwd()+\"/packages/console/dist/src/collect.js\");const s=performance.now();await collectSources(process.cwd(),[]);for(const [k,v] of t)console.log(v.n,Math.round(v.ms)+\"ms\",k);console.log(\"total\",Math.round(performance.now()-s)+\"ms\")'"
      }
    },
    {
      "findingId": "ER3-003",
      "result": "survived",
      "reason": "Every grep returned the line it targets. The Entropy Reducer loadout grants `delegate.readonly` (entropy-reducer.ts:35, 1133) with `delegates: 4` (969, 1020). It also refuses to compile without that resource (1257). The review request validator requires at least one lens brief (entropy-review-protocol.ts:238). However, neither transport gives a delegation tool. On Claude, entropyArgs passes `--tools` from profile.modelTools, and the validator at entropy-review-protocol.ts:227-229 limits that list to ENTROPY_REVIEW_TOOLS = Bash, Read, Glob, Grep (line 31). There is no Task or Agent tool. On Codex, entropyArgs at worker-transport.ts:465-472 disables all of codexDisabled except shell_tool, unified_exec and code_mode_host, so `multi_agent` and `multi_agent_v2` (lines 209-210) are always disabled. The subagents exemption at line 369 exists only in the evidence-args path, and line 272 returns entropyArgs before that path is reached. REVIEW-002.json contains the recorded outcome twice: 'Zero of four lens delegates used (no delegate tool in this session)'. One caveat: the work order's knownFacts already say the kernel does not evaluate Program.All. That covers why this review is dispatched manually, but not the missing tool surface, so the reproduction still shows its claim.",
      "evidenceRefs": [
        "packages/skeleton/src/entropy-review-protocol.ts:31",
        "packages/skeleton/src/entropy-review-protocol.ts:227-229",
        "packages/skeleton/src/entropy-review-protocol.ts:238-239",
        "packages/skeleton/src/loadouts/entropy-reducer.ts:35",
        "packages/skeleton/src/loadouts/entropy-reducer.ts:969",
        "packages/skeleton/src/loadouts/entropy-reducer.ts:1020",
        "packages/skeleton/src/loadouts/entropy-reducer.ts:1128-1137",
        "packages/skeleton/src/loadouts/entropy-reducer.ts:1257",
        "packages/skeleton/src/worker-transport.ts:209-210",
        "packages/skeleton/src/worker-transport.ts:272",
        "packages/skeleton/src/worker-transport.ts:369",
        "packages/skeleton/src/worker-transport.ts:465-472",
        "docs/instance/entropy-reducer/runs/REVIEW-002.json (grep -c = 2)"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "packages/skeleton/src/entropy-review-protocol.ts (ENTROPY_REVIEW_TOOLS); packages/skeleton/src/worker-transport.ts (entropyArgs); packages/skeleton/src/loadouts/entropy-reducer.ts (fan-out-lens support, delegates resource)",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && grep -n 'ENTROPY_REVIEW_TOOLS =' packages/skeleton/src/entropy-review-protocol.ts; grep -n '\"delegate.readonly\"\\|delegates: 4\\|compiled authority lacks the delegates' packages/skeleton/src/loadouts/entropy-reducer.ts; grep -n 'lensBriefs.length > 0' packages/skeleton/src/entropy-review-protocol.ts; grep -n '\"multi_agent\",' packages/skeleton/src/worker-transport.ts; grep -c 'Zero of four lens delegates used' docs/instance/entropy-reducer/runs/REVIEW-002.json"
      }
    },
    {
      "findingId": "ER3-001",
      "result": "survived",
      "reason": "The command reported 7 files containing '\"--ephemeral\"', 0 of them mentioning CODEX_HOME, and 6 non-test script files containing '\"--ignore-user-config\"'. It also printed worker-transport.ts:96-103, which passes process.env, or process.env plus the resident variables, to the spawned CLI. Those parts hold. The launch environment inherits whatever CODEX_HOME the operator has, and no launch file sets or scopes it. The counts are inflated by one, though. scripts/probe-worker-hosts.mjs only runs `codex exec --help` and `--version`, and its '--ephemeral' and '--ignore-user-config' strings are a checklist of help-text flags (lines 45-67), not launch arguments. So there are 6 real launch files, not 7, and 5 argument copies outside the transport, not 6: harness-probe, authority-probe, writing-worker-probe codexBase, local-model-role-qualification and target-worker-smoke. Those 5 do differ from the transport's hardened shapes. For example, target-worker-smoke and harness-probe lack --strict-config and shell_environment_policy.inherit=\"none\". Separately, the transport comment at lines 95-96 says CLI-resolved auth is deliberate. The reproduction shows only that CODEX_HOME is never mentioned, not that the inheritance causes any leak. The qualitative claim stands, but the counts need correcting to 6 and 5.",
      "evidenceRefs": [
        "reproduction output: 7 launch files, mention CODEX_HOME 0, argv copies outside the transport 6",
        "scripts/probe-worker-hosts.mjs:45-67 (help-text flag checklist, not a launch)",
        "packages/skeleton/src/worker-transport.ts:95-103",
        "packages/skeleton/src/worker-transport.ts:327-365",
        "packages/skeleton/src/worker-transport.ts:428-465",
        "packages/skeleton/src/worker-transport.ts:516-550",
        "scripts/harness-probe.mjs:163-176",
        "scripts/lib/authority-probe.mjs:271-298",
        "scripts/lib/writing-worker-probe.mjs:613-632",
        "scripts/probes/local-model-role-qualification.mjs:760-790",
        "scripts/target-worker-smoke.mjs:101-117"
      ],
      "evidenceLabel": "measured",
      "severity": "major",
      "surface": "packages/skeleton/src/worker-transport.ts (runWorkerProcess, Codex argv builders); scripts/lib/authority-probe.mjs; scripts/lib/writing-worker-probe.mjs; scripts/harness-probe.mjs; scripts/probe-worker-hosts.mjs; scripts/target-worker-smoke.mjs; scripts/probes/local-model-role-qualification.mjs",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && echo 'Codex launch files:' && git grep -l -e '\"--ephemeral\"' -- 'packages/*/src/*.ts' 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' && echo \"mention CODEX_HOME: $(git grep -l -e '\"--ephemeral\"' -- 'packages/*/src/*.ts' 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' | xargs grep -l CODEX_HOME | wc -l)\" && echo \"argv copies outside the transport: $(git grep -l -e '\"--ignore-user-config\"' -- 'scripts/*.mjs' 'scripts/lib/*.mjs' 'scripts/probes/*.mjs' ':!scripts/test-*.mjs' | wc -l)\" && sed -n 96,103p packages/skeleton/src/worker-transport.ts"
      }
    }
  ],
  "promotedFindingIds": [
    "ER3-002",
    "ER3-003",
    "ER3-001"
  ],
  "refutedFindingIds": [],
  "blockedFindingIds": [],
  "unselectedFindingIds": []
}
```

A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.

Local-terms list: **present**. Receipt hash: `sha256:3643dad063a3681369bcc349021104c71244280b96c7214af9a10ba80a28de45`.
