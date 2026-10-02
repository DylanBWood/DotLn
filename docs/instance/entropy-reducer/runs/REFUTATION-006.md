# Entropy Reducer refutation — REFUTATION-006

Challenges `REVIEW-005` (receipt hash `sha256:8517573804d5a070cbcd7da532d50c2dc5775c4570b731e2e6a46a63cf6bcf8b`) over subject hash `880df716e553ecb8eecf715c5b9bd4b17a5f8cb562576326215256b7754cbeb4` at commit `b0e11b0da2a743dde63cb8d5da5d73ef6d02628e`.

Refuter: **entropy-reducer@1** — `claude-opus-5-5` at effort `xhigh` on `claude-code` 2.1.287; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This refuter satisfies the compiled actor requirement by invocation readback.

Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.

Measured denominator: 2 (**selected**). By-inspection denominator: 0 (**not-applicable**); sample size 0. Rule: every measured finding and every by-inspection finding.

Survived: 2. Refuted: 0. Blocked: 0. Unselected: 0. Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell writes instructed to stay inside the copy or episode temporary directory, witnessed by copy and temporary inventories. Denied tool calls: 0.

Subject binding: the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused. Source repository: tracked-path status unchanged across the episode: **false**; untracked, non-ignored path listing unchanged: **false** (2 before, 3 after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: 0 path(s) added, 0 removed, 0 resized. Episode temporary directory: 0 path(s), 0 bytes. Frozen copy inventoried at 4652 path(s) before and 4652 after.

**Process cost:** tokens unknown; cause harness-no-readback; observed episode wall clock 116 s, 14 turns, USD 0.622657; source claude-result-envelope

## Attempt reasons

- `ER5-002` survived: The reproduction shows what it claims. Four deferred register rows have reopen conditions that open with a bare order activation or landing. Two of those have already fired. FUP-0086 is still deferred 'until WO-117 lands', but WO-117 is closed: verdict pass, closeRecordedAt 2026-09-29. WO-117's own decisions kept FUP-0086 deferred only 'because this branch is not yet landed', and nothing re-disposed it after the order landed. FUP-0113 is still deferred 'until WO-062 activates', but WO-062 is closed (2026-10-02). WO-062 D002 even records 'WO-062 activation occurred' and a new reopen boundary, yet commit 681b9b2f did not write that into followups.json. FUP-ec75a4295bf36696 is still deferred 'until the next order with a live harness smoke', but WO-149 (closed 2026-09-22) and WO-159 (closed 2026-09-25) both added live Codex dispatch evidence after the deferral; WO-159 records a real codex-cli-exec episode at harness 0.155.x/0.156.1. 'refute-plan conditions' prints 'Not evaluated: ... 848 register rows', and planning-conditions.mjs:390 confirms that register rows are excluded. 'followups --touching WO-117' does list FUP-0086. Entropy review 004 named WO-117 among its eleven closed orders (line 245), yet line 309 says the deferred rows were left 'because their conditions have not occurred'. The repo's own precedent, FUP-0113's 2026-09-27 disposition 'Its reopening condition occurred: WO-110 activated and closed', shows that fired conditions are expected to be re-disposed. I found no state that contradicts the reproduction. Evidence: docs/planning/followups.json#FUP-0086; docs/planning/followups.json#FUP-0113; docs/planning/followups.json#FUP-ec75a4295bf36696; control:WO-117 phase closed closeRecordedAt 2026-09-29T17:57:32.707Z; control:WO-062 phase closed closeRecordedAt 2026-10-02T03:24:21.503Z; docs/evidence/WO-117/decisions.md:436; docs/evidence/WO-062/decisions.md:178; docs/evidence/WO-062/decisions.md:211; docs/evidence/WO-159/live-codex.json; docs/evidence/WO-149/live-codex-dispatch.md; scripts/lib/planning-conditions.mjs:390; docs/planning/entropy-review-004-2026-09-30.md:245; docs/planning/entropy-review-004-2026-09-30.md:306-310.
- `ER5-001` survived: The reproduction shows what it claims. ENTROPY_REVIEW_LIMITS.timeoutMs is 2_400_000. Commit 789d687f introduced that value on 2026-09-22 and it has not changed since, so it applied to REVIEW-004 on 2026-09-30. worker-transport.ts:1196 applies that limit to the whole review process launch, not to each lens. At line 140 the deadline timer marks the run 'deadline-exceeded' and kills the process. The durationMs the regex picks up is the episode-level value. For REVIEW-004 it is cost.durationMs = 2,215,824, which equals endedAt − startedAt (13:07:32.503 to 13:44:28.327). scripts/lib/entropy-review.mjs:1050 computes it around the dispatch, and the preflight inside it is sub-second (0.4 s in REVIEW-001). So REVIEW-004 really used about 92% of the deadline, about 184 s short of the cut-off. The three earlier reviews used 41–45%. scripts/lib/planning-conditions.mjs has no row naming 'entropy', and entropy-review.mjs has no timeout or headroom check. Nothing currently watches how close review episodes run to the deadline. Evidence: packages/skeleton/src/entropy-review-protocol.ts:17-20; packages/skeleton/src/worker-transport.ts:138-142; packages/skeleton/src/worker-transport.ts:1196; scripts/lib/entropy-review.mjs:1000-1051; docs/instance/entropy-reducer/runs/REVIEW-004.json (startedAt 2026-09-30T13:07:32.503Z, endedAt 13:44:28.327Z, cost.durationMs 2215824); docs/instance/entropy-reducer/runs/REVIEW-001.json; docs/instance/entropy-reducer/runs/REVIEW-002.json; docs/instance/entropy-reducer/runs/REVIEW-003.json; git log -S'2_400_000' -> 789d687f 2026-09-22; scripts/lib/planning-conditions.mjs (0 lines matching 'entropy').

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
        "findingId": "ER5-002",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node --input-type=module -e 'import { readControl } from \"./scripts/lib/control-store.mjs\"; import { readFileSync } from \"node:fs\"; const phase = new Map([...readControl(process.cwd()).orders].map(([id, row]) => [id, row.state.phase])); const { entries } = JSON.parse(readFileSync(\"docs/planning/followups.json\", \"utf8\")); const trigger = /^(WO-\\d{3}) (?:activates|lands)\\b/; let deferred = 0, orderTriggered = 0; for (const e of entries) { const d = e.dispositions.at(-1); if (d?.status !== \"deferred\") continue; deferred++; const m = trigger.exec(String(d.reopenWhen ?? \"\")); if (!m) continue; orderTriggered++; console.log(`${e.id}: deferred ${d.at.slice(0, 10)} until \"${d.reopenWhen}\"; ${m[1]} control phase now: ${phase.get(m[1]) ?? \"absent\"}`); } const r = entries.find((e) => e.id === \"FUP-ec75a4295bf36696\").dispositions.at(-1); console.log(`FUP-ec75a4295bf36696: ${r.status} ${r.at.slice(0, 10)} until \"${r.reopenWhen}\"`); console.log(`deferred rows: ${deferred}; whose condition opens with a bare order activation/landing: ${orderTriggered}`);' && echo \"live harness dispatch evidence added after 2026-09-19: $(git log --since=2026-09-19T02:00:00Z --diff-filter=A --name-only --format= -- 'docs/evidence/WO-149/live-codex-dispatch*' 'docs/evidence/WO-159/live-codex.json' | sort -u | tr '\\n' ' ')\" && node scripts/refute-plan.mjs conditions 2>/dev/null | grep -E \"^[0-9]+ hold|Not evaluated\" ; node scripts/refute-plan.mjs followups --touching WO-117 2>/dev/null | grep -c '\"FUP-0086\"'; grep -n \"the deferred ones\" docs/planning/entropy-review-004-2026-09-30.md"
      },
      {
        "findingId": "ER5-001",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node -e 'const fs=require(\"fs\");const src=fs.readFileSync(\"packages/skeleton/src/entropy-review-protocol.ts\",\"utf8\");const lim=Number(/ENTROPY_REVIEW_LIMITS = \\{\\s*timeoutMs: ([\\d_]+)/.exec(src)[1].replace(/_/g,\"\"));for(const n of [\"001\",\"002\",\"003\",\"004\"]){const s=JSON.stringify(require(`./docs/instance/entropy-reducer/runs/REVIEW-${n}.json`));const d=Number(/\"durationMs\":(\\d+)/.exec(s)[1]);console.log(`REVIEW-${n} durationMs ${d} = ${(100*d/lim).toFixed(1)}% of timeoutMs ${lim}`)}' && echo \"planning-conditions rows naming an entropy episode: $(grep -c -i 'entropy' scripts/lib/planning-conditions.mjs)\" && grep -n \"deadline-exceeded\" packages/skeleton/src/worker-transport.ts"
      }
    ],
    "inspectionSubjects": [],
    "selectedFindingIds": [
      "ER5-002",
      "ER5-001"
    ]
  },
  "attempts": [
    {
      "findingId": "ER5-002",
      "result": "survived",
      "reason": "The reproduction shows what it claims. Four deferred register rows have reopen conditions that open with a bare order activation or landing. Two of those have already fired. FUP-0086 is still deferred 'until WO-117 lands', but WO-117 is closed: verdict pass, closeRecordedAt 2026-09-29. WO-117's own decisions kept FUP-0086 deferred only 'because this branch is not yet landed', and nothing re-disposed it after the order landed. FUP-0113 is still deferred 'until WO-062 activates', but WO-062 is closed (2026-10-02). WO-062 D002 even records 'WO-062 activation occurred' and a new reopen boundary, yet commit 681b9b2f did not write that into followups.json. FUP-ec75a4295bf36696 is still deferred 'until the next order with a live harness smoke', but WO-149 (closed 2026-09-22) and WO-159 (closed 2026-09-25) both added live Codex dispatch evidence after the deferral; WO-159 records a real codex-cli-exec episode at harness 0.155.x/0.156.1. 'refute-plan conditions' prints 'Not evaluated: ... 848 register rows', and planning-conditions.mjs:390 confirms that register rows are excluded. 'followups --touching WO-117' does list FUP-0086. Entropy review 004 named WO-117 among its eleven closed orders (line 245), yet line 309 says the deferred rows were left 'because their conditions have not occurred'. The repo's own precedent, FUP-0113's 2026-09-27 disposition 'Its reopening condition occurred: WO-110 activated and closed', shows that fired conditions are expected to be re-disposed. I found no state that contradicts the reproduction.",
      "evidenceRefs": [
        "docs/planning/followups.json#FUP-0086",
        "docs/planning/followups.json#FUP-0113",
        "docs/planning/followups.json#FUP-ec75a4295bf36696",
        "control:WO-117 phase closed closeRecordedAt 2026-09-29T17:57:32.707Z",
        "control:WO-062 phase closed closeRecordedAt 2026-10-02T03:24:21.503Z",
        "docs/evidence/WO-117/decisions.md:436",
        "docs/evidence/WO-062/decisions.md:178",
        "docs/evidence/WO-062/decisions.md:211",
        "docs/evidence/WO-159/live-codex.json",
        "docs/evidence/WO-149/live-codex-dispatch.md",
        "scripts/lib/planning-conditions.mjs:390",
        "docs/planning/entropy-review-004-2026-09-30.md:245",
        "docs/planning/entropy-review-004-2026-09-30.md:306-310"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "docs/planning/followups.json (deferred rows); scripts/lib/planning-conditions.mjs (conditions listing); scripts/lib/planning-followups.mjs (touching listing); the close-time completion advisory",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node --input-type=module -e 'import { readControl } from \"./scripts/lib/control-store.mjs\"; import { readFileSync } from \"node:fs\"; const phase = new Map([...readControl(process.cwd()).orders].map(([id, row]) => [id, row.state.phase])); const { entries } = JSON.parse(readFileSync(\"docs/planning/followups.json\", \"utf8\")); const trigger = /^(WO-\\d{3}) (?:activates|lands)\\b/; let deferred = 0, orderTriggered = 0; for (const e of entries) { const d = e.dispositions.at(-1); if (d?.status !== \"deferred\") continue; deferred++; const m = trigger.exec(String(d.reopenWhen ?? \"\")); if (!m) continue; orderTriggered++; console.log(`${e.id}: deferred ${d.at.slice(0, 10)} until \"${d.reopenWhen}\"; ${m[1]} control phase now: ${phase.get(m[1]) ?? \"absent\"}`); } const r = entries.find((e) => e.id === \"FUP-ec75a4295bf36696\").dispositions.at(-1); console.log(`FUP-ec75a4295bf36696: ${r.status} ${r.at.slice(0, 10)} until \"${r.reopenWhen}\"`); console.log(`deferred rows: ${deferred}; whose condition opens with a bare order activation/landing: ${orderTriggered}`);' && echo \"live harness dispatch evidence added after 2026-09-19: $(git log --since=2026-09-19T02:00:00Z --diff-filter=A --name-only --format= -- 'docs/evidence/WO-149/live-codex-dispatch*' 'docs/evidence/WO-159/live-codex.json' | sort -u | tr '\\n' ' ')\" && node scripts/refute-plan.mjs conditions 2>/dev/null | grep -E \"^[0-9]+ hold|Not evaluated\" ; node scripts/refute-plan.mjs followups --touching WO-117 2>/dev/null | grep -c '\"FUP-0086\"'; grep -n \"the deferred ones\" docs/planning/entropy-review-004-2026-09-30.md"
      }
    },
    {
      "findingId": "ER5-001",
      "result": "survived",
      "reason": "The reproduction shows what it claims. ENTROPY_REVIEW_LIMITS.timeoutMs is 2_400_000. Commit 789d687f introduced that value on 2026-09-22 and it has not changed since, so it applied to REVIEW-004 on 2026-09-30. worker-transport.ts:1196 applies that limit to the whole review process launch, not to each lens. At line 140 the deadline timer marks the run 'deadline-exceeded' and kills the process. The durationMs the regex picks up is the episode-level value. For REVIEW-004 it is cost.durationMs = 2,215,824, which equals endedAt − startedAt (13:07:32.503 to 13:44:28.327). scripts/lib/entropy-review.mjs:1050 computes it around the dispatch, and the preflight inside it is sub-second (0.4 s in REVIEW-001). So REVIEW-004 really used about 92% of the deadline, about 184 s short of the cut-off. The three earlier reviews used 41–45%. scripts/lib/planning-conditions.mjs has no row naming 'entropy', and entropy-review.mjs has no timeout or headroom check. Nothing currently watches how close review episodes run to the deadline.",
      "evidenceRefs": [
        "packages/skeleton/src/entropy-review-protocol.ts:17-20",
        "packages/skeleton/src/worker-transport.ts:138-142",
        "packages/skeleton/src/worker-transport.ts:1196",
        "scripts/lib/entropy-review.mjs:1000-1051",
        "docs/instance/entropy-reducer/runs/REVIEW-004.json (startedAt 2026-09-30T13:07:32.503Z, endedAt 13:44:28.327Z, cost.durationMs 2215824)",
        "docs/instance/entropy-reducer/runs/REVIEW-001.json",
        "docs/instance/entropy-reducer/runs/REVIEW-002.json",
        "docs/instance/entropy-reducer/runs/REVIEW-003.json",
        "git log -S'2_400_000' -> 789d687f 2026-09-22",
        "scripts/lib/planning-conditions.mjs (0 lines matching 'entropy')"
      ],
      "evidenceLabel": "measured",
      "severity": "minor",
      "surface": "packages/skeleton/src/entropy-review-protocol.ts (ENTROPY_REVIEW_LIMITS); packages/skeleton/src/worker-transport.ts (runner deadline); scripts/lib/planning-conditions.mjs (CONDITION_TABLE)",
      "reproduction": {
        "kind": "command",
        "command": "cd \"$(git rev-parse --show-toplevel)\" && node -e 'const fs=require(\"fs\");const src=fs.readFileSync(\"packages/skeleton/src/entropy-review-protocol.ts\",\"utf8\");const lim=Number(/ENTROPY_REVIEW_LIMITS = \\{\\s*timeoutMs: ([\\d_]+)/.exec(src)[1].replace(/_/g,\"\"));for(const n of [\"001\",\"002\",\"003\",\"004\"]){const s=JSON.stringify(require(`./docs/instance/entropy-reducer/runs/REVIEW-${n}.json`));const d=Number(/\"durationMs\":(\\d+)/.exec(s)[1]);console.log(`REVIEW-${n} durationMs ${d} = ${(100*d/lim).toFixed(1)}% of timeoutMs ${lim}`)}' && echo \"planning-conditions rows naming an entropy episode: $(grep -c -i 'entropy' scripts/lib/planning-conditions.mjs)\" && grep -n \"deadline-exceeded\" packages/skeleton/src/worker-transport.ts"
      }
    }
  ],
  "promotedFindingIds": [
    "ER5-002",
    "ER5-001"
  ],
  "refutedFindingIds": [],
  "blockedFindingIds": [],
  "unselectedFindingIds": []
}
```

A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.

Local-terms list: **present**. Receipt hash: `sha256:2c0f796ca05fa5dbdbbd448e45aca08da250aed16bbde2ae50c1e513e467ca4e`.
