# WO-179 decisions

## WO-179-D013 — Repair the emitted role assignment, not only the source table

```json
{
  "id": "WO-179-D013",
  "date": "2026-10-01",
  "dispatch": "resume: fix",
  "kind": "correction",
  "misread": "D003 and the original handoff treated contributorRoles assignments and byte-identical generated twins as evidence that every assigned rule reached every role. targetRoles replaces the release-close procedure, dropping its remedy and eight shared corrections.",
  "meant": "Criterion 1 judges the emitted roles in both harnesses; every design-assigned sentence must survive the target projection.",
  "changed": "Added sharedCorrections to the compact release-close target and reused its blocker/denial remedy in both source and target. Added the emitted-role regression, regenerated both roots, updated only the current release-close snapshot hashes, measured all roots and recorded the release-close ceiling acceptance. Preserved the earlier authority edition and filed revision 001 for the changed bundle; D003 and D005 now describe the emitted bytes.",
  "decision": "Keep the compact release-close target and include sharedCorrections there. Reuse one blocker/denial remedy string in its source and target procedures. Add a regression that checks every shared rule exactly once in every emitted role, across the default and economy opt-out builds, plus the role-specific release-close, executor and verifier assignments. Reproduce the omission before repairing it, regenerate the roots and current WO-179 snapshot, remeasure both cold starts, use the standing ceiling route if breached, and deterministically remint only stale editions before the required current review.",
  "evidence": [
    "docs/verifications/WO-179/VER-001.md F1: release-close in both roots lacks its blocker/denial sentence and eight shared corrections; harness check accepts the consistently incomplete projection.",
    "packages/skeleton/src/loadouts/contributor.ts targetRoles constructs a replacement release-close procedure with sessionBoundaries and noGuessing but no sharedCorrections and the old Report refusals wording.",
    "packages/skeleton/test/executor-supports.test.ts already lowers every Contributor profile to generated skills; scripts/test-process-debt.mjs checks the current default/opt-out snapshot against the byte-exact historical chain.",
    "docs/control/budgets.json and product 07 Discipline authorize the reviewed-rule ceiling route: measured bytes plus 4,096 with the rules named.",
    "WO-179-D001 is the existing declined economy experiment. Repair keeps that choice; no second experiment, subagent or optimization claim is added.",
    "The new WO-179 emitted-role test exited 1 before source repair: release-close routine-question occurrence count was 0, expected 1. After repair the whole executor-supports test file passed six cases; harness emit regenerated 32 surfaces.",
    "measureColdStarts at 2026-10-01T22:58:26.950Z returned release-close 17,170 bytes in both roots (skill 10,560 plus CLAUDE.md 6,610), 786 over its prior 16,384 ceiling. The eight shared rules and remedy add 1,454 bytes; the other five role bytes and default/opt-out hashes remain unchanged. Set only release-close to 17,170 + 4,096 = 21,266 and name all rules in the dated acceptance.",
    "The current WO-179 snapshot updates only its two release-close default and two opt-out hashes; its historicalBaseline and historicalSha256 remain unchanged. No older snapshot is rewritten.",
    "npm test -- --review: 40 passed, zero failed, 85 fresh tasks in 835.562 seconds; recorded 2026-10-01T23:14:59.707Z, codeIdentity 8ec2c9b1bc86cb4612c65c5a8a823f03fbc976135d87176759df5955a84b6fb8, evidenceRef host-gate:8ec2c9b1bc86cb4612c65c5a8a823f03fbc976135d87176759df5955a84b6fb8:npm test. coveringGateCheck at 2026-10-01T23:16:00.320Z confirms all 40 current review suites, no missing suite and no active gate run.",
    "npm run meta refreshed the decisions index and passed; publication:check passed; the current snapshot regression passed with its historical chain unchanged; authority revision 001 --check passed after selection.",
    "The first release prepare --local refused the new correction receipt because its required changed field was missing. Added that field and reran successfully; the command recorded the routine application retiming as D014. No lifecycle completion was recorded by that failed preparation.",
    "npm run adjacent -- list at handoff remains revision 0 with no item. The full review and its bounded evidence waiter exited successfully; this executor started no subagent, retained scratch repository or background monitor. Its actual Codex readback is CLI 0.160.0, gpt-6.1-sol, effort max, source codex-session-readback."
  ],
  "rationale": "Mission and critical path: make the operator's confirmed corrections reach the cold-start consumer and restore the independently verified source-to-deliverable loop. Rule beating and seeking the wrong goal: assert assigned behavior on emitted roots, not merely matching twins or an updated snapshot. Drift: keep criterion 1 required and correct the unsupported handoff. Shifting the burden: complete the bounded projection repair without asking the operator to restate its design. Policy resistance: retain compact role authority and use the already authorized ceiling policy. Commons and escalation: one writer, zero subagents, one existing regression suite and no new gate or instrumentation. Success to the successful: compare preserving the compact projection with removing it; the compact procedure keeps its existing handoff instructions while receiving all missing rules. Naive Interventionism: reuse the remedy string, retain publication/recovery boundaries and historical snapshots, and prove the omission with the smallest focused test. NoOp ships the exact release-close omission the independent verifier found and loses against criterion 1; live savings remain unmeasured. Handoff judgment: the emitted-role regression and complete current review establish the promised assignment repair. The observed tradeoff is 1,454 extra cold-start bytes for release-close and a required 835.562-second current review; the other five role bytes are unchanged. Live operator-flow savings, per-order savings and dollar cost remain unmeasured. The inline document gate must pass before repair-complete records the completed claim; independent re-verification remains its separate dispatch.",
  "rejected": [
    {
      "option": "Remove the compact release-close target entirely",
      "reason": "It would replace unrelated role instructions and widen the diff beyond the missing assignments."
    },
    {
      "option": "Change only the generated skills or snapshot hashes",
      "reason": "Generation would restore the omission, and twin equality does not establish design coverage."
    },
    {
      "option": "Trim reviewed rules to fit the old ceiling",
      "reason": "The standing policy preserves reviewed rules and records a measured acceptance."
    },
    {
      "option": "Board F1 or weaken criterion 1",
      "reason": "The defect is repairable inside the declared source and generated surfaces."
    }
  ],
  "reopenWhen": "Any design-assigned rule is absent or duplicated in an emitted role, the compact projection needs different authority, or a later measured reviewed rule crosses a cold-start ceiling.",
  "measurements": {
    "observedAt": "2026-10-01T22:58:26.950Z",
    "coldStart": [
      {
        "role": "executor",
        "skillsRoot": ".claude/skills",
        "bytes": 28290,
        "ceiling": 29246,
        "verdict": "within"
      },
      {
        "role": "verifier",
        "skillsRoot": ".claude/skills",
        "bytes": 24788,
        "ceiling": 25151,
        "verdict": "within"
      },
      {
        "role": "reviewer",
        "skillsRoot": ".claude/skills",
        "bytes": 26070,
        "ceiling": 28884,
        "verdict": "within"
      },
      {
        "role": "release-close",
        "skillsRoot": ".claude/skills",
        "bytes": 17170,
        "ceiling": 21266,
        "verdict": "within"
      },
      {
        "role": "planner",
        "skillsRoot": ".claude/skills",
        "bytes": 19015,
        "ceiling": 24576,
        "verdict": "within"
      },
      {
        "role": "refuter",
        "skillsRoot": ".claude/skills",
        "bytes": 18590,
        "ceiling": null,
        "verdict": "unset"
      },
      {
        "role": "executor",
        "skillsRoot": ".agents/skills",
        "bytes": 28290,
        "ceiling": 29246,
        "verdict": "within"
      },
      {
        "role": "verifier",
        "skillsRoot": ".agents/skills",
        "bytes": 24788,
        "ceiling": 25151,
        "verdict": "within"
      },
      {
        "role": "reviewer",
        "skillsRoot": ".agents/skills",
        "bytes": 26070,
        "ceiling": 28884,
        "verdict": "within"
      },
      {
        "role": "release-close",
        "skillsRoot": ".agents/skills",
        "bytes": 17170,
        "ceiling": 21266,
        "verdict": "within"
      },
      {
        "role": "planner",
        "skillsRoot": ".agents/skills",
        "bytes": 19015,
        "ceiling": 24576,
        "verdict": "within"
      },
      {
        "role": "refuter",
        "skillsRoot": ".agents/skills",
        "bytes": 18590,
        "ceiling": null,
        "verdict": "unset"
      }
    ],
    "previousReleaseCloseBytes": 15716,
    "previousReleaseCloseCeiling": 16384,
    "releaseCloseAddedBytes": 1454,
    "releaseCloseNewCeiling": 21266
  }
}
```

## WO-179-D001

```json
{
  "id": "WO-179-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "experiment",
  "question": "Would a separate optimization benchmark improve the bounded role-text and gate-claim implementation?",
  "alternatives": [
    "Run an additional before-and-after benchmark",
    "Keep the existing fixture-first procedure and the required full review gate"
  ],
  "observation": "The order already requires refusal/acceptance fixtures and npm test -- --review; scripts/test-off-ramps.mjs already exercises requireGateClaims with complete, partial, stale and document-gate rows. No matched operator-intervention or gate-cost baseline for this implementation has been observed.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "An extra benchmark would duplicate required validation without establishing the promised behavioral savings.",
  "cost": {
    "wallSeconds": 0.00262,
    "tokens": null,
    "commands": [
      "python3 decision-record builder"
    ],
    "source": "perf_counter elapsed through preparing this declined decision; prior source reading was not clocked"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "env -u CODEX_THREAD_ID bash scripts/test-resume.sh",
      "npm test -- --review"
    ],
    "summary": "Keep the existing fixture-first checks followed by the required full review gate; no measured improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reopenWhen": "A matched baseline identifies avoidable duplicate work after this change.",
  "decision": "Keep the existing fixture-first procedure and decline a separate optimization experiment.",
  "evidence": [
    "scripts/test-off-ramps.mjs already supplies WO-173 gate-claim fixtures.",
    "WO-179 criteria 2, 3 and 6 require new consequential fixtures and the full review gate."
  ],
  "rejected": [
    {
      "option": "A separate before-and-after optimization benchmark",
      "reason": "No matched operator-intervention or gate-cost baseline for this implementation has been observed; required checks already settle correctness."
    }
  ]
}
```

## WO-179-D002

```json
{
  "id": "WO-179-D002",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Reuse WO-173's criterion parser and requireGateClaims for verification-result. Factor the existing declared-criterion-to-gate mapping into one helper in scripts/lib/handoff-ledger.mjs, read met judgments from the allocated report, and pass the existing gate-index failure into the same advisory path. Extend the current off-ramps fixture group; do not introduce a new report schema, gate or lifecycle refusal.",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs readHandoffLedger and requireGateClaims already map declared criterion text to gate evidence and distinguish unavailable storage from absent passing rows.",
    "scripts/lib/off-ramps.mjs criterionJudgments and requireCriterionLines already parse and check report judgments.",
    "scripts/resume.mjs verification-result currently checks report headers and criterion forms but does not check a met criterion's named gate.",
    "docs/evidence/WO-172/intervention-subjects.md themes 18 and 21; WO-179 criteria 2 and 3."
  ],
  "rationale": "Mission and critical path: reduce recurring operator rescue and duplicate tests in the machinery lane beside WO-061, while preserving correctness for the independently verified source-to-deliverable loop. Policy resistance: use the same claim rule in both completions, retain unavailable-index advisories and unmet handoffs. Commons: one writer, no subagents, no extra gate or benchmark. Drift: require evidence for a met test claim rather than accepting unsupported prose. Escalation: no new event or report schema. Success to the successful: compare reuse with a new validator; reuse wins because both read the same criterion forms and gate index. Shifting the burden: routine choices and bounded repairs stay with the authorized role. Rule beating: a stale or partial row cannot prove the current subject, and source is never rewound to fit evidence. Seeking the wrong goal: judge correct handoffs and operator flow, not receipt counts. Naive Interventionism: preserve independent judgment, scope limits, publication controls, recovery and unavailable-store behavior; extend the existing fixture group as the smallest probe. NoOp leaves verifier met claims unchecked and the repeated-gate instruction in place; action wins on the checked source and survey evidence. Behavioral savings remain unmeasured.",
  "rejected": [
    {
      "option": "Implement a separate report parser and gate validator",
      "reason": "It duplicates the accepted criterion forms and gate semantics and risks inconsistent refusals."
    },
    {
      "option": "Make every verifier rerun the full product gate",
      "reason": "The recorded passing row proves unchanged code; the order retains reruns for a changed identity or reproduction."
    },
    {
      "option": "Treat an unavailable gate index as a new failure",
      "reason": "WO-173 leaves unavailable evidence advisory; this order adds no refusal beyond a contradicted claim."
    }
  ],
  "reopenWhen": "A fixture or independent verification shows report claims diverge from executor gate semantics, or observed role behavior does not improve."
}
```

## WO-179-D003

```json
{
  "id": "WO-179-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; resume: fix",
  "decision": "Write the selected corrections once in Contributor source and regenerate both skill roots. VER-001 F1 showed that the compact target had dropped release-close's eight shared corrections and blocker/denial remedy; D013 repairs that projection, and the emitted-role regression now establishes every assignment in the table rather than source-table or twin equality alone. Preserve role authority, report immutability after filing, explicit operator controls, the one-writer rule and the release publication boundary. The table below records every changed rule and its public episode references; related cross-theme references are labelled, not reassigned to a different theme.",
  "evidence": [
    "WO-179 Design; packages/skeleton/src/loadouts/contributor.ts; scripts/resume.mjs.",
    "docs/evidence/WO-172/intervention-subjects.md themes 2, 3, 4, 7, 9, 14, 15, 16, 18, 19, 20, 21, 26 and 29. The summaries omit direct E identifiers for themes 3 and 18; episode-provenance.json recovers their 24 direct classifier mappings from the retained StructuredOutput records, with source digests and result lines. Its 16 and 8 memberships match the selected catalog counts.",
    "WO-116-D013 and D016; WO-172-D010 and D023; standard-pass-2026-09-25 section 9.",
    "The existing Intent to Act support is executor equipment; the shared role sentence supplies pre-action interpretation for the planner, verifier and reviewer without changing equipment or authority.",
    "WO-179-D013; node --test packages/skeleton/dist/test/executor-supports.test.js: the emitted-role regression failed before repair on the missing release-close routine-question rule, then all six cases passed after repair, covering every Contributor profile and both support settings."
  ],
  "rejected": [
    {
      "option": "An enforcement instrument for every behavioral sentence",
      "reason": "WO-178 owns instrumentation; this order is role text and the existing claim check."
    },
    {
      "option": "Put the corrections only in product 07",
      "reason": "Every role receives its generated root at cold start; the guide is read by section."
    },
    {
      "option": "Expand the survey mapping with guessed episode identifiers",
      "reason": "Only source-backed episode memberships are used; missing identifiers are never invented."
    }
  ],
  "reopenWhen": "The operator rewords or strikes a rule, an independent check finds a mismatch between a generated root and its design assignment, or a cited correction recurs after this order closes."
}
```

| Rule | Theme | Episode references | Placement and provenance |
| --- | --- | --- | --- |
| Routine questions within authority | 2 | E0975, E0980, E0987 | All roles; product 07 Discipline |
| State the reading of operator aim | 3 | E0059, E0127, E0162, E0220, E0245, E0284, E0370, E0616, E0649, E0667, E0752, E0794, E0859, E0890, E0943, E0988 | All roles; direct mappings in episode-provenance.json |
| Claim names command/output and search boundary | 4 | E0753, E0810, E0882 | All roles |
| Request authority through the host | 7 | E0679, E0895 | All roles; named fallbacks retained |
| Runnable commands and purposeful questions | 9 | E0586, E0807, E0986 | All roles |
| Wait through a completion signal; bounded work or quiet | 16 | E0976, E1006 | All roles; WO-116-D013 and D016 distinguish activity from a bounded question |
| Consume the passing row at the same identity | 18 | E0575, E0608, E0697, E0747, E0928, E0966, E0979, E0981 | Verifier; direct mappings in episode-provenance.json |
| An operator question does not change the work | 19 | E0974 | Verify and final-review briefings |
| Stop owned background monitors before the result | 20 | E0909, E0912 | All roles |
| A met gate claim stands on evidence | 21 | E0836 | Verify and final-review briefings; verification-result reuses WO-173 claim check |
| Try the readable source; correct an unfiled report in place | 26 | E0896 | All roles; WO-172-D012 also cited by the public map |
| Stop after two consecutive provider safeguard refusals | 29 | E0589 | All roles; phase/model decision and fresh-session continuation |
| Run at the changed identity; keep reviewed fixes | 14 | E0876 | All roles |
| Repair inside declared surfaces; board outside both criteria and surfaces | 15 | E0911 | Verify/final-review briefings; product 07 Adjacent Repair |
| Report blocker or denial remedy once; finish remaining work | 2, 7, 9, 20 | E0975, E0679, E0586, E0909 (related cases) | Release-close; direct authority is WO-179 design and WO-176 material handoff, not a claim that its 2026-09-30 nomination belongs to the earlier survey |
| Declare each created scratch repository | 20 | E0909, E0912 (related cleanup cases) | Executor; direct authority is WO-179 design and WO-176 material declaration, not a claim that those monitor episodes are scratch-repository episodes |

The shared additions are instruction-level duties, not proof that a role follows them. Verifier independence remains judgment against the order and reproducing consequential claims; the passing row proves the code identity it records.

## WO-179-D004

```json
{
  "id": "WO-179-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.61.4, the next patch above the observed release baseline v0.61.3, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.61.3 (local tags)",
    "patch classification declared in docs/work-orders/WO-179-role-text-carries-the-confirmed-corrections.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-179-D005

```json
{
  "id": "WO-179-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next; resume: fix",
  "decision": "The two product Discipline sentences add 355 UTF-8 bytes against HEAD, within the 400-byte bound. Correct the original cold-start claim to the repaired emitted bytes: release-close is 17,170 in each root, crossing its prior 16,384 ceiling; record a dated acceptance and set only that ceiling to 21,266 under the standing reviewed-rule policy. Every other bounded role remains within its existing ceiling. Assign compatible patch labels: skeleton 0.49.2 (role instructions changed), harness runtime 0.34.2 (bundle semantic identity changed), and keep console 0.4.0 with its skeleton pin updated; no public API or dependency is added. Preserve the original authority edition; the repair selects a new immutable revision for its changed release-close bundle. Artifact-identity, verification and feedback checks pass unchanged, so their selected historical editions remain. No judged feedback source or report changed, hence no live episode.",
  "evidence": [
    "measureColdStarts at 2026-10-01T22:58:26.950Z; installed CLAUDE.md 6610 bytes plus each regenerated role root, shown below. The original 2026-10-01T20:47:02.389Z release-close figure of 15,716 measured the incomplete projection; D013 and VER-001 F1 name the correction.",
    "npm run harness -- check passed on 32 generated surfaces; npm run publication:check passed with both source locks current.",
    "env -u CODEX_THREAD_ID bash scripts/test-resume.sh passed end to end.",
    "scripts/test-verifier-gate-claims.mjs against b51a58a8:scripts/resume.mjs failed its first gate-claim assertion: the old dispatcher recorded VER-001 pass without a passing npm test row. The current source passes missing, failed, partial and stale rows, current row consumption and inline document success/failure.",
    "node scripts/authority-evidence.mjs --check reported stale bundle-diff.json; node scripts/artifact-identity-evidence.mjs --check, node scripts/verification-evidence.mjs --check and node scripts/feedback-evidence.mjs --check passed.",
    "After the F1 repair, node scripts/authority-evidence.mjs --check reported stale bundle-diff.json; artifact-identity, verification and feedback --check all passed. Preserve the earlier authority files and remint WO-179 authority revision 001."
  ],
  "rejected": [
    {
      "option": "Raise every cold-start ceiling",
      "reason": "Only release-close crosses its existing ceiling after the missing reviewed rules reach the emitted root."
    },
    {
      "option": "Remint all four editions or run a live feedback episode",
      "reason": "Only authority is stale; the unchanged editions reproduce their claims, and the selected feedback audit still judges the current behavior."
    },
    {
      "option": "Bump the compiler or console behavior version",
      "reason": "Compiler and console source behavior did not change; the console dependency pin follows the compatible skeleton patch."
    }
  ],
  "reopenWhen": "Final review integration changes the installed bytes, a reviewed rule crosses a ceiling, or a registered evidence check becomes stale.",
  "measurements": {
    "productWritebackBytes": 355,
    "coldStart": [
      {
        "role": "executor",
        "skillsRoot": ".claude/skills",
        "bytes": 28290,
        "ceiling": 29246,
        "verdict": "within"
      },
      {
        "role": "verifier",
        "skillsRoot": ".claude/skills",
        "bytes": 24788,
        "ceiling": 25151,
        "verdict": "within"
      },
      {
        "role": "reviewer",
        "skillsRoot": ".claude/skills",
        "bytes": 26070,
        "ceiling": 28884,
        "verdict": "within"
      },
      {
        "role": "release-close",
        "skillsRoot": ".claude/skills",
        "bytes": 17170,
        "ceiling": 21266,
        "verdict": "within"
      },
      {
        "role": "planner",
        "skillsRoot": ".claude/skills",
        "bytes": 19015,
        "ceiling": 24576,
        "verdict": "within"
      },
      {
        "role": "refuter",
        "skillsRoot": ".claude/skills",
        "bytes": 18590,
        "ceiling": null,
        "verdict": "unset"
      },
      {
        "role": "executor",
        "skillsRoot": ".agents/skills",
        "bytes": 28290,
        "ceiling": 29246,
        "verdict": "within"
      },
      {
        "role": "verifier",
        "skillsRoot": ".agents/skills",
        "bytes": 24788,
        "ceiling": 25151,
        "verdict": "within"
      },
      {
        "role": "reviewer",
        "skillsRoot": ".agents/skills",
        "bytes": 26070,
        "ceiling": 28884,
        "verdict": "within"
      },
      {
        "role": "release-close",
        "skillsRoot": ".agents/skills",
        "bytes": 17170,
        "ceiling": 21266,
        "verdict": "within"
      },
      {
        "role": "planner",
        "skillsRoot": ".agents/skills",
        "bytes": 19015,
        "ceiling": 24576,
        "verdict": "within"
      },
      {
        "role": "refuter",
        "skillsRoot": ".agents/skills",
        "bytes": 18590,
        "ceiling": null,
        "verdict": "unset"
      }
    ]
  }
}
```

## WO-179-D006

```json
{
  "id": "WO-179-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Update the two process-debt expectations the first full review gate found stale. Add a WO-179 default/opt-out role snapshot linked by SHA-256 to the unchanged WO-173 snapshot; the complete historical chain remains checked. The verifier assertion now requires consumption at the matching identity and reruns for reproduction or a changed identity, and rejects an unconditional product-gate step; the reviewer retains its full gate and host-confinement fallback assertions. Stop the failed run through evidence --stop before changing its inputs, then check the affected cases and run the required full gate again.",
  "evidence": [
    "npm test -- --review, started 2026-10-01T20:49:38.307Z: process-debt passed 125 of 127 cases; the two failures were the prior role-byte hashes and the verifier productGate assertion.",
    "scripts/test-process-debt.mjs WO-145 historical snapshot case and WO-140 briefing/usage case.",
    "node scripts/harness.mjs evidence --stop at 2026-10-01T20:58:39.109Z stopped the owned run; no product-gate check was recorded.",
    "packages/skeleton/fixtures/wo179-role-baseline.json is generated from harnessInstallation default and tinkerer-economy opt-out, with the prior snapshot bytes hashed before writing."
  ],
  "rejected": [
    {
      "option": "Rewrite WO-173 or an older role snapshot",
      "reason": "Those snapshots are historical evidence and remain byte-exact."
    },
    {
      "option": "Keep the verifier product gate to satisfy the old assertion",
      "reason": "That restores the duplication this order explicitly removes."
    },
    {
      "option": "Disable the failing assertions",
      "reason": "The current instruction contract and the historical opt-out invariant both still need executable evidence."
    }
  ],
  "reopenWhen": "The historical chain changes, opt-out removes any instruction beyond the executor economy paragraph, or verifier/reviewer gate behavior diverges from the role contract."
}
```

## WO-179-D007

```json
{
  "id": "WO-179-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Hand the complete bounded implementation and passing review evidence to independent verification after recovering the direct episode mappings and repairing the document ceiling. Criterion 5 stays required and its table now includes the 24 direct references for themes 3 and 18. The six provenance allocations remain attached to WO-179 for the declared close-time disposition; D009 records the failed earlier attempt to defer the requirement.",
  "evidence": [
    "npm test -- --review: 40 passed, zero failed, 85 fresh tasks, 846.474 seconds; passing row recorded at 2026-10-01T22:15:20.794Z, codeIdentity c6c63c068d2b1e11c84fa00ec612cd631a552ea18e26c07d8d44002eb2ef8c31, evidenceRef host-gate:c6c63c068d2b1e11c84fa00ec612cd631a552ea18e26c07d8d44002eb2ef8c31:npm test. coveringGateCheck confirms all 40 current required suites are covered, missing is empty and activeGateRuns is empty. D012 records why the prior 39-suite passing row did not cover the current selection; D006 preserves the first stopped attempt, which supplied no passing row.",
    "Additional named inputs: the retained WO-172 classifier StructuredOutput results of 2026-09-29T04:18:45.269Z and 04:19:58.558Z supply the direct episode/theme records omitted by intervention-subjects.json and its readable summary. episode-provenance.json extracts only identifiers and source digests; all 24 records are unique and its theme counts match the selected catalog. No message text was copied.",
    "npm run adjacent -- list at handoff preparation: revision 0, no items and no next item; no subagents or owned background monitors were started. The review process has exited and activeGateRuns returns an empty list.",
    "Current-session briefing: codex-cli 0.159.3, gpt-6.1-sol, effort max, source codex-session-readback. This records the actual session rather than the recommended xhigh.",
    "D005 records the generated-root and product-byte measurements, deterministic authority remint, unchanged evidence editions and negative control against b51a58a8. The final document gate runs last inside implementation-ready and its result belongs to that lifecycle event."
  ],
  "rationale": "The consequential fixtures establish the narrow completion behavior and the complete review establishes the implemented product contract. D002's goal comparison still holds: shared instructions and reuse of matching gate evidence address operator rescue and duplicate work without extending role authority or publication effects. Actual reductions in interventions, tokens or per-order wall time have not been measured. The recovered direct memberships complete the provenance instead of converting related examples into evidence or deferring a required deliverable.",
  "rejected": [
    {
      "option": "Mark the missing direct episode mapping met using the related examples",
      "reason": "The public theme summaries and catalog do not establish that those examples belong to themes 3 or 18."
    },
    {
      "option": "Run another full product gate after completing only evidence prose and indexes",
      "reason": "Those surfaces do not change code identity; the completion checks its matching passing row and runs the document gate inline."
    },
    {
      "option": "Expand textual follow-up matches into unrelated repairs",
      "reason": "The feed records distinct seams; no recurrence or newly encountered implementation defect was observed for those items."
    }
  ],
  "reopenWhen": "Direct source mappings are contradicted, independent verification finds a contract regression, the reviewed code identity changes, or a listed follow-up's actual seam or recurrence condition is encountered."
}
```

The touching feed was read through all three pages at revision
`4c1443bb33a407609753f9d6bfe68e46ed20ebe097f7383852899a1500dfe95e`
(19 rows, cursors 8 and 16). These are recorded dispositions of the
matches, not new allocations or findings:

| Existing follow-up | Handoff treatment |
| --- | --- |
| FUP-7629e03c6573f5cb | Preserve WO-173-D018's known untracked-source reuse gap. This change reuses that gate contract; it does not repair the lookup. Both new code fixtures were staged before the passing row, and no post-row untracked-code edit occurred. |
| FUP-5474f89208c6bb9f, FUP-fd05316b6030ef73 | Preserve writer/transport work; admission and transport implementations are unchanged. |
| FUP-b7a66e7a4fa7ad20, FUP-dc1335f4d10f6a75 | Preserve release-preparation and integration-overlay work; their implementations were exercised, not changed. |
| FUP-f1c7a256bec46737 | Preserve cold-start efficiency work; D005 measures the current roots within their existing ceilings. |
| FUP-fb8cbeabbddef397, FUP-a9a0591a63757bf2 | Preserve gate-cost and structural-cut work; this order supplies no new matched cost comparison or recurrence judgment. |
| FUP-50cda1c03ecd8ea8, FUP-51c310284c2fea17, FUP-56b599e15f97e666 | Preserve checksum, attribution and resident-capsule work; those seams were not opened. |
| FUP-71fc2efc208f597a | Preserve the broader operator-word sweep; this order writes repository rules and identifiers without importing message text. |
| FUP-a6cf30a8b7bc4a83, FUP-a583091bec0d08b7 | Preserve mode/default work; no model selection or normalization implementation changed. |
| FUP-acfe4bfda716d8fb | Preserve usage/meta attribution work; stale dispatch-scope counters are reported with their scope and cutoff. |
| FUP-adf6621e7f958dd8 | Preserve duplicate authority-copy work; the authority generator is unchanged and only its stale edition was reminted. |
| FUP-cd1a227413938345, FUP-e55e258d37cb3f20 | Preserve product ownership and path/export work; neither seam was opened. |
| FUP-439252e49f6381fc | Preserve document/release-check documentation work; this order retains the inline document gate. |
| FUP-b3454d6ce3594ef3 | Preserve the survey direction-reader comparison work; the process-debt edits update role snapshots and gate-procedure assertions, not its reader or operator-step classification. This additional textual match was read with the final record's 21-row feed. |

The other additional match was the prematurely boarded own provenance gap,
FUP-ab8499c6d47996b0. D011 completes it in this order and its register
disposition records the recovery; it is not deferred executor work.

Close-time routing: FUP-3bb4dea9dde2a392, FUP-1f47fd50acc97814,
FUP-6332681e9500a84b, FUP-9a23fe23cbf08958,
FUP-5f58198706dfa59e and FUP-a815e8862796c2e1 are allocated to
WO-179 and must be disposed or retargeted at its close on the reviewed
result. Preserve the existing declined disposition of
FUP-b053a956adb84b6a and settled disposition of FUP-bf614feaea90cac3.
No publication, commit or final-review judgment is performed by this
executor handoff.

Scratch material: this executor retained ordinary scratch log and baseline
source files, not a scratch repository. The suites' marked disposable
fixture repositories used their normal teardown; the successful full
gate recorded no abandoned fixture root. No repository material was
chosen for movement, copying or preservation at close.

## WO-179-D008 — Failure: incomplete test preparation

**Outcome: failed.**

```json
{
  "id": "WO-179-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "outcome": "failed",
  "misread": "The changed role contract was treated as ready for the full review without updating the current process-debt snapshot and verifier procedure assertions.",
  "meant": "Read and reconcile tests that assert the changed contract before starting the long review gate; preserve historical snapshots and unrelated reviewer requirements.",
  "changed": "Added the current WO-179 role baseline, linked to the unchanged historical chain, and updated the verifier assertions while preserving the reviewer assertions. The replacement full review passed.",
  "decision": "Record this preparation failure and its avoidable rerun cost. D006's repair preserves the historical chain and updates the current assertions; the replacement complete review passed.",
  "evidence": [
    "The first review found two failures among 127 process-debt cases and was stopped after 541.6 seconds without a product passing row.",
    "The replacement required review took 890.368 seconds. The two attempts together consumed about 23.9 minutes; not all of the replacement run is attributable to the mistake because one complete review was required."
  ],
  "rejected": [{"option": "Describe the rerun only as required verification", "reason": "One full run was required; the first attempt's stale expectations were an execution failure."}],
  "reopenWhen": "A role-contract change starts its full gate while its current contract assertions remain stale."
}
```

## WO-179-D009 — Failure: attempted handoff of an unmet requirement

**Outcome: failed.**

```json
{
  "id": "WO-179-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "outcome": "failed",
  "misread": "A missing direct episode mapping in the selected summaries was treated as grounds to board the required provenance and mark criterion 5 unmet for verification.",
  "meant": "Criterion 5 is required. Exhaust the retained source evidence and complete its direct provenance before handoff; an admitted unmet transition does not discharge the executor's work.",
  "changed": "Recovered all 24 direct theme-3 and theme-18 memberships from retained classifier results, filed episode-provenance.json, and corrected the unfiled table and handoff in place. Criterion 5 remains required and no waiver is recorded.",
  "decision": "Record the attempted premature handoff as a failure, correct the unfiled handoff in place after recovering evidence, and keep criterion 5 required. No waiver is requested or recorded.",
  "evidence": [
    "D007 and the unfiled handoff marked criterion 5 unmet and minted FUP-ab8499c6d47996b0 instead of completing its provenance.",
    "The attempted implementation-ready command exited 1 on its document gate. After that failed attempt, canonical status remained active, ImplementationReady was absent and this executor still owned the writer."
  ],
  "rejected": [{"option": "Send the unmet criterion to the verifier as completed executor work", "reason": "All six acceptance criteria are required; the provenance obligation is the executor's."}],
  "reopenWhen": "A required executor deliverable is boarded or handed off before its available source has been exhausted."
}
```

## WO-179-D010 — Failure: missed product-document ceiling

**Outcome: failed.**

```json
{
  "id": "WO-179-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "outcome": "failed",
  "misread": "The 355-byte product write-back was checked against the order's 400-byte target but not the document's existing byte ceiling.",
  "meant": "Establish both the planned write-back and the affected document ceiling before reporting its document checks ready; retain reviewed rules and use the authorized ceiling-resolution route.",
  "changed": "Updated only product 07's ceiling to the base plus the selected order's planned 400-byte write-back, with the resolving planning reference, preserved landing measurement and actual 355-byte edit recorded. The final document gate still must pass before completion.",
  "decision": "Record the missed ceiling as a failure. Preserve the two planned sentences and raise only product 07's ceiling to 157,603 bytes: its 157,203-byte base plus WO-179's planned maximum 400-byte write-back. Cite the resolving 2026-09-30 planning decision, section 9's WO-179 row, in doc-ceilings.json; keep the original landing measurement. The actual 355-byte edit fits with 45 bytes of headroom. D005's target measurement did not establish the document gate, and no cold-start ceiling is raised.",
  "evidence": [
    "The inline document gate took 25.398 seconds and failed. docs-check measured product 07 at 157,558 bytes against 157,212, 346 bytes over; the base had only nine bytes of headroom.",
    "The remaining nine failed document suites did not execute after docs-check failed; they are consequences of this one blocking document check, not nine independent diagnosed defects."
  ],
  "rejected": [{"option": "Call the document gate green from the within-400-byte target", "reason": "The executable document check contradicted that claim."}],
  "reopenWhen": "A product write-back is declared ready using its order target without checking its document ceiling."
}
```

## WO-179-D011 — Direct provenance recovered in this order

```json
{
  "id": "WO-179-D011",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Complete criterion 5 here. Recover the two omitted theme membership lists from the retained survey classifier results, file identifier-only episode-provenance.json, correct D003 and the unfiled handoff in place, and settle the premature FUP-ab8499c6d47996b0 on that evidence. D008-D010 remain recorded execution failures; fixing their consequences does not erase them.",
  "evidence": [
    "The retained classifier StructuredOutput result at 2026-09-29T04:19:58.558Z, result line 90, source SHA-256 ad1c75f22c7a5e1c911e6e7a96ce89df5b25f11b971032facf25802d28ca6245 supplies seven theme-3 memberships.",
    "The result at 2026-09-29T04:18:45.269Z, result line 92, source SHA-256 4aab06e48fe111354f1cf0dd53984006424642ac4b9325c2a6bd05a8638a1c81 supplies nine theme-3 memberships and eight theme-18 memberships.",
    "Executable extraction checked direct record membership, uniqueness and counts against the selected public catalog: theme 3 has 16 and theme 18 has eight. The public artifact contains only episode identifiers, theme keys and source provenance, with no operator message text, classifier subject prose, private source paths or provider session identifiers.",
    "Named ceiling input: docs/control/doc-ceilings.json; named planning authority: docs/planning/standard-pass-2026-09-30.md section 9's WO-179 row and section 6's routing, together with the selected order's 400-byte write-back and product 07's rule against trimming reviewed content to a byte target. D010 records the scoped ceiling repair."
  ],
  "rejected": [
    {"option": "Waive criterion 5", "reason": "The direct evidence was retained and recoverable; the earlier search stopped too soon."},
    {"option": "Copy the retained classifier's message or subject text", "reason": "The deliverable needs identifiers and provenance, not transcript material."},
    {"option": "Erase the failure receipts once repaired", "reason": "The execution mistakes and avoidable rework occurred and remain planning evidence."}
  ],
  "reopenWhen": "The source digest or direct membership cannot be reproduced, the operator corrects the survey's theme reading, or a required criterion is again deferred without finishing its available evidence."
}
```

## WO-179-D012 — Failure: unchecked review selection and unsupported cause

**Outcome: failed.**

```json
{
  "id": "WO-179-D012",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "outcome": "failed",
  "misread": "A passing row at the code identity was treated as sufficient without checking the current review selection. The resulting missing plan-refutation coverage was then attributed to the document-ceiling change before checking the source.",
  "meant": "The review claim must cover the runner's current selection as well as its code identity. Check the selection and its comparison base before naming a cause; a sibling's publication is not a product finding or a repair directive.",
  "changed": "Corrected the causal statement from checked Git and runner evidence, kept the old passing row and all reviewed source bytes, marked criterion 6 pending in the unfiled handoff, and selected a full current review. Criterion 5 remains complete and required; no waiver or completion event is recorded.",
  "decision": "Run npm test -- --review for the current 40-suite selection, then complete the evidence and inline document gate. The existing runner reuses only a whole covering row; running plan-refutation alone cannot establish that complete row. Do not change the selection, weaken the claim, alter the old row, rewind the comparison base or integrate another order here.",
  "evidence": [
    "implementation-ready refused criterion 6: the passing 39-suite row at code identity c6c63c068d2b1e11c84fa00ec612cd631a552ea18e26c07d8d44002eb2ef8c31 lacks plan-refutation for the current review selection. No completion event was appended.",
    "git reflog show refs/remotes/origin/main records a fast-forward to 3a4aa82a at 2026-10-01T17:28:13-04:00, after the passing review row recorded at 21:16:40.184Z. git diff origin/main -- scripts/work-orders.mjs shows five changed lines; that path selects plan-refutation in scripts/test-runner.mjs changedMachinery.",
    "npm test -- --review --list names 40 suites, including plan-refutation. The previous passing row's requiredSuites names 39 without it. The product code identity remains unchanged.",
    "scripts/test-runner.mjs performs whole-selection reuse through coveringGateCheck and otherwise executes its current selection; it does not merge an individual suite result into an earlier complete row. The missing coverage follows the changed comparison base, not doc-ceilings.json."
  ],
  "rejected": [
    {"option": "Alter the old passing row or force the old selection", "reason": "That would invent coverage the recorded review did not execute."},
    {"option": "Call the sibling publication a product defect", "reason": "Its advance changed a comparison used by the current completion; it does not invalidate the old row's recorded subject or justify source repair."},
    {"option": "Waive the criterion or hand off its missing coverage", "reason": "The required current review can be run within executor authority."}
  ],
  "reopenWhen": "A handoff checks only code identity, omits required suite coverage, or names a gate-selection cause without reading its source and comparison base."
}
```

## WO-179-D014

```json
{
  "id": "WO-179-D014",
  "date": "2026-10-01",
  "dispatch": "resume: fix; release prepare",
  "decision": "Retime unpublished application target v0.61.4 to v0.62.1, the next patch above the observed release baseline v0.62.0, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.",
  "evidence": [
    "release baseline v0.62.0 (local tags)",
    "superseded target v0.61.4",
    "new target v0.62.1"
  ],
  "rejected": [
    {
      "option": "A dated roadmap or README paragraph",
      "reason": "A version collision is recorded once, as this decision (WO-086); product documents and the README carry only the version claim."
    }
  ],
  "reopenWhen": "A collision changes scope, acceptance, component versions or a published tag, or needs a hand step beyond this record."
}
```

## WO-179-D015 — verification: a sibling's merge widens the review selection at an unchanged identity

```json
{
  "id": "WO-179-D015",
  "date": "2026-10-01",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 and board one defect outside WO-179's declared criteria and surfaces. A worktree's review selection is computed against the moving origin/main tip (scripts/test-runner.mjs changedMachinery, base \"origin/main\"), so paths a sibling order changed on main count as this worktree's change. When main advances after a passing review row, the selection gains machinery suites at an unchanged code identity, and the verification-result claim check this order added refuses a met npm test -- --review criterion until the whole review gate runs again. The verifier leaves the implementation unchanged.",
  "evidence": [
    "git reflog show refs/remotes/origin/main: fast-forward 3a4aa82a to aa770898 (the WO-061 merge) at 2026-10-01 19:19:50 -0400. That is after the executor's 40-suite row (2026-10-01T23:14:59.707Z) and after VER-002 was requested (23:19:20.377Z).",
    "changedMachinery(root, suites, base) in a scratch script: against the subject's base 855450ea it selects configuration-root, harness-probe, authority-evidence, harness-fixtures, harness, harness-evidence, feedback-evidence, runner-fixtures, process-debt and registrations; against origin/main it adds evidence-sources, plan-refutation, artifact-evidence and verification-evidence. npm test -- --review --list named 43 suites.",
    "A dry run of requireGateClaims with criterion 6's review claim refused before any event: 'criterion 6 recorded met names npm test -- --review, and no passing complete npm test row at the current code identity 8ec2c9b1bc86cb4612c65c5a8a823f03fbc976135d87176759df5955a84b6fb8 covers the current review selection: the latest row (recorded 2026-10-01T23:14:59.707Z, 835.56 s, 40 suites, ...) lacks evidence-sources, artifact-evidence, verification-evidence.'",
    "The verifier ran npm test -- --review at the unchanged identity: 43 passed, 0 failed, 88 fresh tasks, 828.14 s, recorded 2026-10-01T23:37:16.632Z. The same dry run then returned that row.",
    "WO-179-D012 records the first instance in this order: origin/main moved 855450ea to 3a4aa82a at 17:28:13 -0400, plan-refutation joined the selection and the executor ran the review gate again (846.474 s) at code identity c6c63c068d2b1e11c84fa00ec612cd631a552ea18e26c07d8d44002eb2ef8c31."
  ],
  "rationale": "Mission: the order's objective that a verifier spends its time judging rather than rerunning a gate the executor recorded green at the same identity. In this order two full review runs, 846 s and 828 s, came only from sibling merges. The added suites test the worktree's own unchanged copies of the paths main changed, so they say nothing about this order's change or main's; integration changes the identity and runs the gate again anyway. Not failed: criterion 3 names a plain npm test claim, whose lookup requires no selection, and its fixture records with the row; the selection base sits in scripts/test-runner.mjs, outside the order's declared surfaces (contributor.ts, resume.mjs, product 07, budgets.json). Under the boundary sentence this order writes, a defect outside both criteria and surfaces is boarded with its reproduction. It fails safe: the check over-demands evidence and never admits a row that does not cover. Shifting the burden: each verifier and executor pays a full gate for a sibling's merge. Rule beating: the rerun satisfies the check without informing the judgment. Escalation and commons: gate time grows with merge frequency while lanes run in parallel. Naive Interventionism: the verifier does not edit the runner. NoOp leaves a recurring cost without an owner; it occurred twice in this order.",
  "rejected": [
    {"option": "Fail VER-002 on criterion 3 or 6", "reason": "Criterion 3's plain claim records with the row, and criterion 6 holds on the fresh 43-suite row; the seam lies outside the declared criteria and surfaces."},
    {"option": "Repair changedMachinery in the verifier session", "reason": "An independent verifier preserves the judged subject, and the runner is outside this order's surfaces."},
    {"option": "Record criterion 6 unmet to avoid the rerun", "reason": "The criterion is met at the subject; recording it unmet would misreport it."}
  ],
  "followup": "Next order editing changedMachinery in scripts/test-runner.mjs or the review-selection read in scripts/lib/handoff-ledger.mjs (priority medium; gate cost, fails safe). Compute a worktree's review selection from the order's own change, against the merge base of HEAD and origin/main or the order's recorded base, not the moving origin/main tip, so a sibling's merge after a passing row adds no suite at an unchanged code identity; integration, which changes the identity, still runs the gate. Keep untracked files in the change (WO-169-D007). Reproduce with a fixture worktree holding a covering passing row, advance origin/main with a commit touching another suite's machinery source, and assert that the selection and the claim check are unchanged; assert that a change to the order's own machinery source still widens the selection.",
  "reopenWhen": "A completion at an unchanged code identity is refused for suites only a sibling's merge selected, a planning pass counts a review rerun caused by main movement, or the next order edits changedMachinery."
}
```

## WO-179-D016

<!-- integration refs/dotln/checkpoint/WO-179/10 -->

```json
{
  "id": "WO-179-D016",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-179",
  "decision": "Integrate main at aa770898 (WO-182 as v0.62.0, then WO-061 as v0.63.0) into the uncommitted WO-179 worktree by fast-forward and stash application. One authored conflict: docs/evidence/current.json selected WO-061's authority revision 001 on main and WO-179's authority revision 001 here. Neither edition reproduces on the integrated source, which carries both WO-061's compiler 0.23.0 label and WO-179's role bundle. So authority is re-minted as WO-179 revision 002 and selected, and both revision-001 editions stay byte-identical. Artifact identity, verification and feedback stay on WO-061 revision 001. The application target is retimed from v0.62.1 to v0.63.1, the next patch above v0.63.0, under the unchanged patch classification. Component versions do not collide: skeleton 0.49.2 and harness runtime 0.34.2 sit over main's 0.49.1 and 0.34.1. The console keeps 0.4.0, with main's compiler 0.23.0 pin and this order's skeleton 0.49.2 pin. Every WO-179 source, test, fixture, role root and product file is byte-identical to the subject VER-002 judged, so its criterion judgments carry forward. The product gate ran again on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-179/10",
    "base 855450ea7054e86b231a890f6e2e40648bdb4b7e",
    "upstream aa770898e00d7367255405fcc248fa119adc8037",
    "release preparation: Retimed WO-179: v0.62.1 → v0.63.1 above the observed release baseline v0.63.0. Files changed: docs/work-orders/WO-179-role-text-carries-the-confirmed-corrections.md, README.md, docs/evidence/WO-179/meta.json, docs/final-reviews/WO-179/PR.md. Meter snapshot: docs/evidence/WO-179/meta.json, 4046 bytes. Tag observation: local snapshot only.",
    "git diff --name-only 855450ea aa770898: 82 files. Under packages/ and scripts/, main changed the compiler's story contract and artifact identity, the console's self-host fixtures and pins, the target-publish readiness path, evidence-sources.mjs, work-orders.mjs and worktree.mjs. None is a WO-179 source or test. The overlapping paths were the generated hooks and manifest, README's release line, package pins, the lockfile and generated documents, which the helper regenerated, plus docs/evidence/current.json. docs/intake/ holds only tracked .gitkeep files, so no intake backup was required.",
    "git diff --cached refs/dotln/checkpoint/WO-179/9 over contributor.ts, executor-supports.test.ts, wo179-role-baseline.json, resume.mjs, handoff-ledger.mjs, lifecycle-evidence.mjs, test-off-ramps.mjs, test-process-debt.mjs, test-resume.sh, test-verifier-gate-claims.mjs, product 07, budgets.json, doc-ceilings.json and both skill roots is empty. git diff refs/dotln/checkpoint/WO-179/9 HEAD over test-runner.mjs, gate-reuse.mjs, off-ramps.mjs, gate-evidence.mjs and CLAUDE.md shows no change from main.",
    "node scripts/authority-evidence.mjs --check on the integrated tree failed on WO-179 revision 001: it records compilerPackageVersion 0.22.1, and the integrated source has 0.23.0. --write --edition WO-179 --revision 002 recorded the new edition; --check with it selected exits 0. The artifact-identity, verification and feedback --check scripts exit 0 on WO-061 revision 001.",
    "measureColdStarts on the integrated tree: executor 28,290, verifier 24,788, reviewer 26,070, release-close 17,170, planner 19,015 and refuter 18,590 bytes in both roots, identical to D005 and D013.",
    "Affected checks on the integrated tree: node scripts/harness.mjs check (32 generated surfaces), npm run publication:check, npm run release -- check-surfaces --local and npm run meta -- --check exit 0. The product gate result is recorded in FINAL-001."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Resolve current.json to either revision-001 edition alone",
      "reason": "Neither reproduces on the integrated source; authority-evidence --check would fail with either selected."
    },
    {
      "option": "Rewrite WO-179 authority revision 001 in place",
      "reason": "Evidence editions are immutable; the generator refuses a stale edition and asks for a new revision."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-01. Original base: `855450ea7054e86b231a890f6e2e40648bdb4b7e`.
Fetched main: `aa770898e00d7367255405fcc248fa119adc8037`. Checkpoint: `refs/dotln/checkpoint/WO-179/10`.
Named stash retained: `52a27e7f7a54620fab2b533c066a5ce33b4df0b5` (WO-179 integrate 2026-10-01).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-179: v0.62.1 → v0.63.1 above the observed release baseline v0.63.0. Files changed: docs/work-orders/WO-179-role-text-carries-the-confirmed-corrections.md, README.md, docs/evidence/WO-179/meta.json, docs/final-reviews/WO-179/PR.md. Meter snapshot: docs/evidence/WO-179/meta.json, 4046 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of the files this order's claims rest on. `contributor.ts`, `executor-supports.test.ts`, `wo179-role-baseline.json`, `resume.mjs`, `handoff-ledger.mjs`, `lifecycle-evidence.mjs`, the off-ramps, process-debt, resume and verifier-gate-claims suites, product 07, both ceiling files and both skill roots are byte-identical to checkpoint `/9`, and main left the runner, gate reuse, off-ramp parser, gate evidence and `CLAUDE.md` unchanged. VER-002's judgments therefore carry forward on unchanged inputs. Criteria 1, 3, 4 and 6 were checked again on the integrated tree: the harness check, the claim-check fixture and its `b51a58a8` negative control, the cold-start measurement and `meta --check`, and a fresh `npm test -- --review`. FINAL-001 judged the integrated subject.
Authored conflicts observed: docs/evidence/current.json.
Affected checks are printed by the command; results remain untested until executed.

## WO-179-D017 — final review

```json
{
  "id": "WO-179-D017",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass WO-179 on all six criteria against the original order. The basis is VER-002's re-derivation from the emitted roots, this review's reading of the full diff, the criterion 3 fixture and its b51a58a8 negative control rerun on the integrated tree, and a fresh product gate on the integrated tree. Settle the six register rows the provenance allocated to WO-179 on the landed sentences and claim check, each with a reopening condition after close. Record, without a finding, the cold-start growth the meter shows: the executor root grew 1,387 bytes over v0.63.0. Before the integrated gate, meta listed drift-to-low-performance as a reopen candidate on that growth and on gateStepCount 88 (Δ 3), the fresh tasks of VER-002's 43-suite gate. After the integrated gate's 84 tasks, the same lens reads 'insufficient worsening evidence' and only WO-150-D003 remains. The growth is the order's declared cost (operator-review assumption 3), and the promised benefit, fewer repeated interventions, is not yet measured.",
  "evidence": [
    "docs/final-reviews/WO-179/FINAL-001.md",
    "npm test -- --review on the integrated tree: 39 passed, 0 failed, 84 fresh tasks, 897.62 s, recorded 2026-10-02T00:01:40.890Z at code identity 005044189e4dd3c32a56b5547f021f6c022cc77777d41089b25198bafa8df6b4 (host-gate:005044189e4dd3c32a56b5547f021f6c022cc77777d41089b25198bafa8df6b4:npm test); coveringGateCheck returns it for the current 39-suite review selection",
    "docs/verifications/WO-179/VER-001.md (fail, F1) and VER-002.md (pass; F1 repaired; D015 boarded)",
    "node scripts/test-verifier-gate-claims.mjs on the integrated tree exits 0; with b51a58a8:scripts/resume.mjs as subject it exits 1: 'verification claim must refuse: Recorded VER-001: pass.'",
    "npm run meta -- --check on the integrated tree before its gate: 'no observed budget breach'; reopen candidates WO-150-D003 (present before this order) and drift-to-low-performance ('coldStartBytes 28,290 (Δ 1,387); gateStepCount 88 (Δ 3); worsened over three consecutive order deltas'). After the integrated gate and npm run meta: 'drift-to-low-performance: coldStartBytes 28,290 (Δ 1,387); ... gateStepCount 84 (Δ -1); insufficient worsening evidence' and '1 reopen candidates' (WO-150-D003)",
    "docs/planning/followups.json: FUP-3bb4dea9dde2a392, FUP-1f47fd50acc97814, FUP-6332681e9500a84b, FUP-9a23fe23cbf08958, FUP-5f58198706dfa59e and FUP-a815e8862796c2e1 were allocated to WO-179 by the 2026-09-30 standard planning pass, each with a reopening condition naming WO-179's close"
  ],
  "rationale": "Mission and critical path: the order moves recurring operator rescue into the text every role reads at cold start, and removes a verifier gate rerun at an unchanged identity. Both serve the independently verified source-to-deliverable loop by spending less operator attention and shared compute per order. Rule beating and seeking the wrong goal: judge emitted roots and executed completions, not the source table or twin equality. VER-002 did that and showed its test catches the F1 class, and this review reran the claim-check fixture and its negative control on the integrated tree. Drift to low performance: the cold-start growth is the cost the order accepted, whether or not the meter's lens lists it as a candidate at a given cutoff. The standing route records the acceptance rather than trimming a reviewed rule, and the reopening condition below ties the cost to the unmeasured benefit. Shifting the burden: the release-close and executor roles now carry their own blocker, denial and scratch-repository remedies, so the operator is told once rather than asked to decide. Policy resistance: the new claim check and the verifier's consume rule agree at an unchanged identity. D015 records where they diverge when main moves, and integration removed that divergence for this review because the selection is now computed against the integrated base. Escalation and commons: no new refusal beyond the declared claim check; one writer and no subagents in this review; one product gate on the integrated tree. Success to the successful: D002's reuse of WO-173's claim check was compared with a new validator. Naive Interventionism: the review changes no source; the integration re-mints one evidence edition and preserves the earlier ones. NoOp: leaving the six rows allocated would hide that their sentences landed and lose the post-close reopening conditions.",
  "rejected": [
    {
      "option": "Fail or repair the order for the cold-start growth",
      "reason": "The growth is the order's declared cost under operator-review assumption 3. No ceiling is breached, and product 07 keeps reviewed rules from being trimmed to a byte figure."
    },
    {
      "option": "Leave the six allocated rows as allocated",
      "reason": "Each allocation names WO-179's close as its condition. The sentences and claim check landed, and settling keeps a reopening condition for each recurrence after close."
    },
    {
      "option": "Strike or trim a rule to undo the cold-start growth",
      "reason": "Striking a rule is the operator's call at review (assumption 2). D003 names each rule's episodes, so a strike can be precise."
    }
  ],
  "reopenWhen": "An intervention count after close shows any of the order's themes recurring at the pre-WO-179 rate; the meter lists drift-to-low-performance again for the next order that edits Contributor role text; or the operator strikes or rewords a rule."
}
```
