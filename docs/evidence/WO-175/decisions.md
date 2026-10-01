# WO-175 decisions

## WO-175-D001

```json
{
  "id": "WO-175-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Implement the bounded numeric listing and honest predicate evaluator, then give review and refutation workers an inventoried sibling temporary root; preserve historical receipt rendering and the existing review authority. This removes hand observation and the nested-checkout failure without acting on any threshold.",
  "evidence": [
    "WO-175 objective, design, criteria 1–11 and cited REVIEW-004 ER4-003/004/007",
    "scripts/lib/meta.mjs reads row.metrics[condition.metric] but budgetRows hold coldStartBytes.<role> and sequenceBytes",
    "scripts/lib/entropy-review.mjs freezes repo under an episode parent but creates no worker temporary root",
    "docs/product/07-execution-guide.md §Goal-aligned decisions"
  ],
  "rejected": [
    {
      "option": "NoOp / continue hand measurement",
      "reason": "Leaves the demonstrated false zero and temporary-root conflict in place; operator flow still requires recurring rescue."
    },
    {
      "option": "Gate planning on threshold crossings or parse every prose condition",
      "reason": "WO-175 forbids both; they would add authority and process beyond the selected outcome."
    },
    {
      "option": "A new review route or delegate",
      "reason": "The existing serial compiled authority and transports are sufficient."
    }
  ],
  "lenses": {
    "policyResistance": "The listing remains advisory; unavailable observations are named, never a verdict.",
    "commons": "Ten shared fixed probes plus decision predicates; time and host load are recorded; expensive measurements can move behind a flag.",
    "drift": "Retain explicit thresholds and distinguish unknown from false.",
    "escalation": "Reuse the meter, register, receipt and transport; add no gate or event schema.",
    "successToSuccessful": "Compare direct measurement with existing observations on cost and correctness, without privileging a cache.",
    "shiftingBurden": "Automate named conditions and scratch cleanup so operators need less rescue.",
    "ruleBeating": "Fixtures observe actual values, environment, files and cleanup; historical receipts stay immutable.",
    "wrongGoal": "This is risk reduction for reliable source-to-deliverable review, not direct delivery of the always-on runtime.",
    "naiveInterventionism": "Existing qualitative conditions, review tools and Codex sandbox stay useful; bound changes to listing, predicate reads and sibling scratch. Local source changes are reversible; regression fixtures are the smallest useful probe."
  },
  "reopenWhen": "A named condition is missed, an unknown measurement is shown as false, receipt history changes, or scratch cleanup loses a filed result."
}
```

## WO-175-D002

```json
{
  "id": "WO-175-D002",
  "date": "2026-09-30",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "kind": "experiment",
  "decision": "Keep the current implementation and verification method; decline a separate optimization experiment while adding the order’s required correctness fixtures and timing observations.",
  "question": "Would a separate timing optimization probe reduce this order’s work beyond its required measurements?",
  "alternatives": [
    "Run a separate comparison and add an optimization",
    "Keep the existing method and use the required listing measurements"
  ],
  "observation": "The order already requires median timing probes, the full review gate and frozen-copy portfolio reproduction. No separate bottleneck has been established.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "No deciding observation identifies an additional optimization; duplicating the mandatory measurements would add cost before a demonstrated saving.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": [
      "Source inspection only; no experiment command executed"
    ],
    "source": "Actor-attested declined experiment; zero experiment runtime, preparation not separately timed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "Required listing and review checks retained"
    ],
    "summary": "No adopted improvement or measured saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "WO-175 Cost and criteria 5/9/11",
    "scripts/refute-plan.mjs and scripts/lib/entropy-review.mjs inspected before implementation"
  ],
  "rejected": [
    {
      "option": "Add a cache or parallelize timing probes",
      "reason": "Would complicate fresh measurements and confound the host load observation without evidence of need."
    }
  ],
  "reopenWhen": "The required measurements identify a repeatable bottleneck with a bounded, equivalent-output improvement."
}
```

## WO-175-D003

```json
{
  "id": "WO-175-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "WO-175’s design attributes the 8-second latency condition to the two settled WO-156 follow-up rows.",
  "meant": "The current register preserves those rows’ correctness conditions; their latency condition is carried by ER4-005, FUP-fb8cbeabbddef397, as the planning pass corrected before handoff.",
  "changed": "Use the existing ER4-005 source id for the 8-second probe, retaining the two historical ids as provenance; do not rewrite existing decisions or register conditions.",
  "decision": "Resolve table source ids against the current decision/register and use the checked current threshold owner.",
  "evidence": [
    "docs/planning/followups.json: FUP-3dc0266d6b87b939 and FUP-ab1746dc9c595d95 latest settled dispositions dated 2026-09-30T14:20:20",
    "FUP-fb8cbeabbddef397: three thresholds, plan >8 s, docs gate >30 s, docs-check >15 s; already reopened by WO-174-D012"
  ],
  "rejected": [
    {
      "option": "Evaluate the old 2-second trigger or amend historical conditions",
      "reason": "The order names 8 seconds and expressly forbids rewriting existing conditions."
    }
  ],
  "reopenWhen": "A later disposition changes the threshold owner or bound."
}
```

## WO-175-D004

```json
{
  "id": "WO-175-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.58.2, the next patch above the observed release baseline v0.58.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.58.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-175-reopening-conditions-report-themselves.md"
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

## WO-175-D005

```json
{
  "id": "WO-175-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Use a closed table of ten fixed probes plus the meter’s predicate evaluation. Validate every current source id before measuring; the two WO-156 ids remain historical provenance rather than claiming their current correctness conditions were evaluated. Run timing probes serially in three fresh processes, including the exact release-list implementation with its cache disabled in memory and no cache deletion. Use readIndex/renderIndex instead of writing the index. Keep the slow document-gate rows behind --slow and record their shared three-run measurement separately.",
  "evidence": [
    "docs/evidence/WO-175/initial-conditions.json and initial-conditions.txt: first complete fast observation, 23.105 s, one holding numeric predicate; planning-entry block 22.019 s and below 1 KB",
    "scripts/lib/planning-conditions.mjs: no prose commands, named sources, measured load average/logical CPU count, and unknown on missing/failed observations",
    "scripts/release.mjs extracted listPublishedReleases with an isMainModule guard; cold reads use the same tag/range logic and inert cache interface",
    "WO-175 design and FUP-fb8cbeabbddef397 latest dispositions: >8 s plan, >30 s document gate and >15 s docs-check"
  ],
  "rejected": [
    {
      "option": "Clear the operator’s release cache to measure cold listing",
      "reason": "The same implementation can bypass cache in memory; deletion would add an unnecessary effect."
    },
    {
      "option": "Run work-orders index as a measurement",
      "reason": "The read/render path establishes the generation cost without repository writes."
    },
    {
      "option": "Treat missing samples or unevaluated historical conditions as false",
      "reason": "Would recreate the false-zero behavior; output explicitly preserves unknowns."
    }
  ],
  "reopenWhen": "A probe source changes its meaning, median timing crosses a bound, the default listing reaches 60 seconds, or a byte-count definition misses committed evidence."
}
```

## WO-175-D006

```json
{
  "id": "WO-175-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Fix the release-close fixture in scripts/test-process-debt.mjs by explicitly excluding the host’s Codex/Copilot session identities from its preview and generated-hook children. Keep its named Claude fixture session, local writer assertion and all publication-admission checks. No product guard or transport setting changes.",
  "evidence": [
    "Direct process-debt run: 119/120 pass; only WO-132 generated release-close handoff refuses a foreign writer",
    "Same named test with inherited CODEX_THREAD_ID removed: 1/1 pass",
    "docs/control/local/adjacent-work.jsonl: queued at revision 1, intent at 2, actor-attested message-boundary check-in at 3, start at 4 after the document-gate boundary",
    "The preview child’s canonical release-close dispatch reserves a Codex writer, while the generated hook uses a different explicit fixture session"
  ],
  "rejected": [
    {
      "option": "Relax the writer refusal",
      "reason": "The refusal is correct for the mismatched sessions."
    },
    {
      "option": "Always strip the executor’s identity from every test",
      "reason": "Other cases intentionally test Codex lifecycle dispatch; isolate only this Claude fixture."
    },
    {
      "option": "Leave the known fixture defect because it predates this order",
      "reason": "It is bounded to the existing test file and the shared review gate."
    }
  ],
  "reopenWhen": "The same fixture fails under an explicit isolated environment or another harness identity contaminates its children."
}
```

## WO-175-D007

```json
{
  "id": "WO-175-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Deliver the optional temporaryDirectory request field, scoped TMPDIR launch and complete temporary-file inventory without changing the review authority or Codex sandbox. Restore the parent environment after the synchronous launch; inventory before cleanup. Repair owned directory permissions without following links; a cleanup failure after filing warns once and does not fail the durable receipt. Preserve old witness rendering by adding the sentence only when the new observation exists.",
  "evidence": [
    "22/22 entropy fixtures pass, including launched fake review/refutation environment files and read-only scratch removal",
    "docs/evidence/WO-175/portfolio.txt: canonical frozen dispatch of base 60eeecd, sibling TMPDIR, portfolio 3/3 pass",
    "Existing entropy check remains green for seven mechanism receipts and two pre-mechanism receipts, with no historical bytes changed",
    "WO-175 criterion 9 reserves the next live entropy review/refutation row for planning: entropy reducer"
  ],
  "rejected": [
    {
      "option": "Put TMPDIR inside the frozen copy",
      "reason": "REVIEW-004 reproduced protected-checkout overlap failures; the sibling root passes the portfolio suite."
    },
    {
      "option": "Add a Codex sandbox grant or edit worker-transport.ts",
      "reason": "Both are outside the order; the existing synchronous launch inherits the scoped environment."
    },
    {
      "option": "Fail the command after filing a receipt when cleanup fails",
      "reason": "The receipt and control event have already been filed; the leftover path must be reported without falsifying that outcome."
    }
  ],
  "reopenWhen": "A live episode writes outside the two named roots, omits temporary files from its inventory, or cleanup cannot remove its scratch."
}
```

## WO-175-D008

```json
{
  "id": "WO-175-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Stage application v0.58.2 locally and bump only skeleton 0.47.0 to 0.47.1 for the compatible optional request field and changed instructions; console remains 0.4.0 with its skeleton dependency re-pinned. Re-mint authority, artifact identity, verification and feedback as WO-175 revision 001; regenerate the unchanged harness surfaces as the fifth edition check. The protocol is a judged feedback input, so record one fresh live feedback audit and re-pin the console’s self-host case. Retain every earlier edition and all publication controls.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.58.2 above observed local v0.58.1; WO-175-D004 records it",
    "DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit --store .runtime/feedback-audit-wo175-r001 --transport claude-cli-print --model claude-sonnet-5 --effort xhigh: exit 0, complete, ten fixtures, 1192 saved instruction bytes",
    "feedback-evidence --record-selfhost: verifier stream 77706 committed reference bytes versus 2277938 live bytes; console-fixtures --record-current-selfhost succeeded",
    "Harness evidence: 31 current generated surfaces and retained historical role/writer episodes; no new live harness or entropy episode claimed"
  ],
  "rejected": [
    {
      "option": "Carry the earlier feedback audit over changed judged protocol bytes",
      "reason": "WO-154’s behavior identity requires a fresh audit for this change."
    },
    {
      "option": "Bump compiler, kernel or console behavior versions",
      "reason": "Those components’ behavior is unchanged; only skeleton source and console’s dependency pin changed."
    },
    {
      "option": "Commit, publish or open a PR during execution",
      "reason": "The executor’s authority stops at implementation-ready; final review is separately dispatched."
    }
  ],
  "reopenWhen": "A later judged-source edit invalidates the live audit, an edition is stale, or final-review integration records a release collision."
}
```

## WO-175-D009

```json
{
  "id": "WO-175-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The existing WO-172 planning-entry fixture still expected only branch, phase, authority, failures and followups after this order added the conditions block.",
  "meant": "The additive conditions field belongs beside failures, while an unavailable count stays advisory and within 1 KB.",
  "changed": "Add conditions to the exact field expectation and assert its command, unavailable-count wording and bounded size in scripts/test-plan-refutation.mjs.",
  "decision": "Correct the affected expectation and rerun the planning-refutation suite and full review gate; preserve every existing failures-block assertion.",
  "evidence": [
    "First npm test -- --review: 40 suites passed, 1 failed, 85 fresh tasks, 883.66 seconds; sole failure was WO-172 plan start exact output field list",
    "scripts/test-plan-refutation.mjs:5320 planning-entry fixture and scripts/refute-plan.mjs start return shape"
  ],
  "rejected": [
    {
      "option": "Remove the new block or weaken the existing failures assertions",
      "reason": "The new block is required by WO-175 criterion 4; the existing failure behavior remains part of its contract."
    }
  ],
  "reopenWhen": "The planning-entry block loses its command, exceeds 1 KB, or an unavailable condition count prevents branch entry."
}
```

## WO-175-D010

```json
{
  "id": "WO-175-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Retain the bounded advisory design and complete the measurements and handoff at the fixture evidence level. The default listing lists ten named rows plus the existing predicate, marks two gate rows unknown unless --slow is requested, and acts on no crossing. The full review gate must be green on the final source before implementation-ready; verification, final review and publication remain separate.",
  "evidence": [
    "Initial default listing: 23.105 seconds, one holding predicate, two unmeasured slow rows; initial planning-entry block 22.019 seconds and below 1 KB",
    "First review gate: 883.66 seconds, 85 fresh tasks, 40 suites passed; D009 corrects its single stale field expectation and the complete planning-refutation suite then passes 80/80 in 64.914 seconds",
    "conditions.json, conditions-slow.json and planning-entry.json record the final host observations; fixtures.md and checks.json retain commands and actual outcomes",
    "Live feedback audit: 61.847 seconds; claude-result-envelope dispatch observation totals 681326 tokens including cache reads/writes, cost USD 1.4870038, recorded 2026-09-30T22:51:23.567Z; root executor counters remain in ignored receipts",
    "Final npm test -- --review: 41 suites pass, 85 fresh tasks, 921045 ms; code identity e15fa662d9b794220ce25249c48f4c35e7794ccbbaef3245e68f68c6fd62245a; recorded 2026-09-30T23:41:21.672Z. No source changed afterward."
  ],
  "rejected": [
    {
      "option": "Claim a net speed or token saving",
      "reason": "No equivalent before/after outcome was timed. The required measurements and gate rerun have measured costs; future avoided rescue is an intended benefit, not a measured saving."
    },
    {
      "option": "Act on WO-150-D003 or the already-open latency row now",
      "reason": "The order only reports thresholds; their disposition belongs to the pass that reads them."
    }
  ],
  "lenses": {
    "policyResistance": "Counts never block planning; unavailable data remains visible.",
    "commons": "Serial timing observations record host load and the slow flag isolates the expensive three-gate measurement.",
    "drift": "The fixed thresholds and current source ids remain explicit.",
    "escalation": "One bounded evaluator, existing transports and five current editions; no new model probe for entropy.",
    "successToSuccessful": "Fresh measured outcomes judge the implementation rather than treating old gate rows as current proof.",
    "shiftingBurden": "Predicate evaluation, scratch inventory and cleanup remove the demonstrated manual-rescue points.",
    "ruleBeating": "The negative control fails against the exact cited baseline; the updated planning fixture checks the additive block.",
    "wrongGoal": "The contribution is reliable planning and review, not a new always-on runtime feature.",
    "naiveInterventionism": "Preserve the existing review authority and qualitative conditions; retain the economy decline D002. NoOp leaves the demonstrated correctness failures; wider optimization has no measured equivalent-outcome case."
  },
  "reopenWhen": "The default listing exceeds 60 seconds, a probe omits its unknown state, or the next live entropy receipt contradicts the fixture-level capability.",
  "measurements": {
    "default": {
      "observedAt": "2026-09-30T23:21:41.964Z",
      "durationMs": 23842.630708,
      "host": {
        "loadAverage": [
          11.47021484375,
          11.31103515625,
          10.70166015625
        ],
        "logicalCpus": 16,
        "observedAt": "2026-09-30T23:21:41.964Z",
        "classification": "load measured; other host activity unknown"
      },
      "rows": [
        {
          "id": "plan-check",
          "sources": [
            "FUP-fb8cbeabbddef397"
          ],
          "value": 2.574892917,
          "threshold": 8,
          "unit": "s",
          "holds": false
        },
        {
          "id": "release-tags",
          "sources": [
            "WO-086-D006"
          ],
          "value": 2,
          "threshold": 3,
          "unit": "tags",
          "holds": false
        },
        {
          "id": "order-evidence",
          "sources": [
            "FUP-8a4e201d861208ad"
          ],
          "value": [
            493640,
            105087
          ],
          "threshold": 1000000,
          "unit": "bytes/order",
          "holds": false
        },
        {
          "id": "week-evidence",
          "sources": [
            "FUP-8a4e201d861208ad",
            "FUP-be1103fbfdd14653"
          ],
          "value": 5478474,
          "threshold": 10000000,
          "unit": "bytes/week",
          "holds": false
        },
        {
          "id": "collect-sources",
          "sources": [
            "FUP-7f9a27e6ed6c44b3"
          ],
          "value": 0.80457825,
          "threshold": 3,
          "unit": "s",
          "holds": false
        },
        {
          "id": "release-list",
          "sources": [
            "FUP-7f9a27e6ed6c44b3"
          ],
          "value": 2.831008208,
          "threshold": 10,
          "unit": "s",
          "holds": false
        },
        {
          "id": "status-bytes",
          "sources": [
            "FUP-7f9a27e6ed6c44b3"
          ],
          "value": 3461691,
          "threshold": 32000000,
          "unit": "bytes",
          "holds": false
        },
        {
          "id": "order-index",
          "sources": [
            "FUP-7f9a27e6ed6c44b3"
          ],
          "value": 1.327406708,
          "threshold": 10,
          "unit": "s",
          "holds": false
        },
        {
          "id": "document-gate",
          "sources": [
            "FUP-fb8cbeabbddef397"
          ],
          "value": null,
          "threshold": 30,
          "unit": "s",
          "holds": null
        },
        {
          "id": "docs-check",
          "sources": [
            "FUP-fb8cbeabbddef397"
          ],
          "value": null,
          "threshold": 15,
          "unit": "s",
          "holds": null
        },
        {
          "id": "coldStartBytes.executor",
          "sources": [
            "WO-150-D003"
          ],
          "value": [
            26903
          ],
          "threshold": 24576,
          "unit": "metric",
          "holds": true
        }
      ]
    },
    "slow": {
      "observedAt": "2026-09-30T23:19:21.270Z",
      "durationMs": 133358.76795900002,
      "host": {
        "loadAverage": [
          8.59912109375,
          11.4384765625,
          10.65283203125
        ],
        "logicalCpus": 16,
        "observedAt": "2026-09-30T23:19:21.270Z",
        "classification": "load measured; other host activity unknown"
      },
      "rows": [
        {
          "id": "document-gate",
          "value": 35.993991292,
          "threshold": 30,
          "unit": "s",
          "holds": true,
          "samples": [
            36.756444708,
            35.993991292,
            35.344596374999995
          ]
        },
        {
          "id": "docs-check",
          "value": 9.85,
          "threshold": 15,
          "unit": "s",
          "holds": false,
          "samples": [
            9.85,
            9.88,
            9.74
          ]
        }
      ]
    },
    "planningEntry": {
      "command": "npm run plan -- conditions",
      "holding": 1,
      "unknown": 2,
      "unevaluated": {
        "decisionConditions": 1177,
        "registerRows": 799
      },
      "durationMs": 22204,
      "slow": "npm run plan -- conditions --slow",
      "bytes": 228
    }
  }
}
```

## WO-175-D011

```json
{
  "id": "WO-175-D011",
  "date": "2026-09-30",
  "dispatch": "resume: next; followups --touching",
  "decision": "Preserve the three WO-175 allocations until their specified close and provide close-register.md for the closing actor. Retain the existing routes of advisory matches that this bounded change does not implement, including the two explicit non-goal rows. The adjacent release-close fixture defect is fixed under adjacent-0001; completion waits for its two named passing checks.",
  "evidence": [
    "followups --touching at register revision 63e542809a3d6b5211a54b3bc50dca3d166743a64630d7a4b033fa20794d9360: 22 matches over three bounded pages, all read",
    "ER4-003 FUP-a7461ebe9627663d, ER4-004 FUP-72adcb05563bb99b and ER4-007 FUP-ae897de944b750d6 are revision 1 and allocated to WO-175",
    "Non-goals FUP-e55e258d37cb3f20 and FUP-01e80ba5ce62c72a keep their existing deferred/WO-178 routes",
    "FUP-7629e03c6573f5cb: the untracked-source reuse gap is already boarded; this order runs a fresh full gate, which imports the new module, and changes no source after its passing row",
    "Other matched rows name publication admission, snapshots, release collision/manifest hardening, input coverage or document maintenance; this order does not change those mechanisms"
  ],
  "rejected": [
    {
      "option": "Settle allocations during executor handoff or broaden into all textual matches",
      "reason": "The order schedules settlement at close and expressly limits the deliverable; a textual path match is a pointer for judgment, not a new authorization."
    }
  ],
  "reopenWhen": "Verification fails a named criterion, a matching existing defect is actually reproduced by this change, or the closing actor cannot settle the three rows against their current revisions."
}
```

## WO-175-D012

```json
{
  "id": "WO-175-D012",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Board, not fail: the entropy prompts join the temporary-directory sentence without a separator, and no fixture asserts the refutation prompt's instruction. temporaryInstruction returns the sentence with a leading space and no trailing one. Each prompt prepends it to the existing text, so outputInstructions begins ' The episode temporary directory is …' and runs on as '…writes stay inside these two roots.Run one Entropy Reducer review …' (review) or '…these two roots.Attempt to falsify …' (refutation). The meaning survives and no criterion depends on the join, so criterion 6 is met. The review assertion in scripts/test-entropy-review.mjs matches a substring and cannot see the join. The refutation instruction is shown only by this verification's reproduction, not by a committed fixture, so the handoff's 'both prompt instructions' overstates the fixture coverage.",
  "evidence": [
    "VER-001 reproduction in a session-scratch clone carrying the subject: DOTLN_ENTROPY_FIXTURE=1 node scripts/entropy.mjs refute REVIEW-005 (background route) prints prompt.temporaryDirectory equal to the episode's sibling tmp, and prompt.outputInstructions beginning ' The episode temporary directory is …/tmp, supplied as TMPDIR; it is the only other writable root. Keep all temporary files there; writes stay inside these two roots.Attempt to falsify'",
    "packages/skeleton/src/entropy-review-protocol.ts: temporaryInstruction(request) + 'Run one Entropy Reducer review …' and temporaryInstruction(request) + 'Attempt to falsify …'",
    "grep for temporaryDirectory or 'only other writable root' finds tests only in scripts/test-entropy-review.mjs, whose single instruction assertion is /supplied as TMPDIR; it is the only other writable root/ on the review prompt"
  ],
  "rationale": "Mission: a review worker reads one clear instruction about where it may write; the run-on sentence is a formatting defect, not a change of authority. Rule beating: a substring assertion passes whatever the join, and the refutation prompt has no assertion at all. Naive Interventionism and commons: the protocol source is a judged feedback input and a registered source of all five editions, so a repair costs a re-mint and a live feedback audit (WO-154 D001); riding the next order that edits this file costs nothing extra. NoOp keeps a readable but malformed instruction in every new episode until then. The other traps are immaterial: no gate, process or burden changes.",
  "rejected": [
    {
      "option": "Fail criterion 6",
      "reason": "Both launches receive the directory and both prompts name it (reproduced). The fixture shows the received value for both and the instruction for the review; the missing refutation assertion is a coverage gap, not a missing behavior."
    },
    {
      "option": "Fix the join in this verification",
      "reason": "A verifier never edits implementation to settle its own verdict."
    }
  ],
  "followup": "Executor of the next order that edits packages/skeleton/src/entropy-review-protocol.ts: compose the temporary-directory sentence so that outputInstructions starts with a non-space character and exactly one space separates it from the following sentence, in both entropyReviewPrompt and entropyRefutationPrompt. Assert the exact composed prefix for both prompts, including the refutation prompt's temporaryDirectory field, in scripts/test-entropy-review.mjs. Carry this in that order's re-mint rather than a separate one. Priority: low.",
  "reopenWhen": "A worker is observed to misread the joined instruction, or an order is planned that edits the entropy protocol source."
}
```

## WO-175-D013

```json
{
  "id": "WO-175-D013",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Board, not fail: the host's own transport temporaries are created inside the worker's episode temporary directory. launchInTemporaryDirectory sets process.env.TMPDIR in the host process for the whole synchronous transport.dispatch call. Every host-side tmpdir() call inside that call therefore resolves to the directory the worker is told is its own writable root: the schema directory dotln-worker-schema-* (CliWorkOrderTransport.dispatch), the raw stdout capture dotln-worker-output-*/stdout (runWorkerProcess), and, for Codex, the isolated dotln-codex-home-* with its auth.json symlink (startCodexEpisode). On the normal path each is removed when the process or episode ends, before filing inventories the directory, so receipts and criteria 6 and 7 are unaffected. Two consequences are inferences, not observations. A worker that cleans or rewrites its temporary directory during the episode can remove or alter the host's raw-output capture, which runWorkerProcess reads by path when the process closes. On an abnormal exit, host leftovers would be counted as worker files. The code comment 'Child processes receive a snapshot; parent tools regain their own root' holds only after the launch returns.",
  "evidence": [
    "VER-001 probe (session scratch): launchInTemporaryDirectory(<episode>/tmp, () => runWorkerProcess({binary: '/bin/sh', args: ['-c', 'ls -A \"$TMPDIR\"']})) prints the worker's TMPDIR as <episode>/tmp and lists dotln-worker-output-eix3D9, the host's raw-output capture, inside it while the worker runs; after close the directory is empty",
    "node probe: launchInTemporaryDirectory('/episode/tmp', () => os.tmpdir()) returns '/episode/tmp'; os.tmpdir() before and after returns the system temporary directory",
    "packages/skeleton/src/worker-transport.ts: mkdtempSync(join(tmpdir(), 'dotln-worker-output-')) in runWorkerProcess, mkdtempSync(join(tmpdir(), 'dotln-worker-schema-')) in CliWorkOrderTransport.dispatch, mkdtempSync(join(tmpdir(), 'dotln-codex-home-<pid>-')) in startCodexEpisode; the capture is read with readFileSync(file) in the close handler",
    "WO-175-D007 rejected editing worker-transport.ts as outside the order, which cites that file read-only; passing TMPDIR only in the worker's launch environment would need that edit"
  ],
  "rationale": "Mission: the receipt should account for the worker's files, and the host's raw return should be the worker's actual output. Rule beating: the fake transport never calls runWorkerProcess, so no fixture can see host files in the directory. Policy resistance: telling the worker 'keep all temporary files there' while the host keeps its capture there sets the two uses against each other. Naive Interventionism: the scoped TMPDIR is the order's deliberate way to avoid editing worker-transport.ts, it works for the worker, and its leak is latent; the repair belongs to an order that may edit the transport. NoOp: in the normal path receipts stay correct and the raw capture survives unless the worker clears its temporary root. The other traps are immaterial here.",
  "rejected": [
    {
      "option": "Fail criterion 6 or 7",
      "reason": "Both launches receive the sibling directory, receipts record its count and bytes after the host's temporaries are removed, and both were reproduced; the leak is outside the declared criteria."
    },
    {
      "option": "Restore TMPDIR before spawn in this verification",
      "reason": "A verifier never edits implementation; the clean repair crosses into worker-transport.ts, which the order cites read-only."
    }
  ],
  "followup": "Executor of the next order that may edit packages/skeleton/src/worker-transport.ts or the entropy launch: give the episode temporary directory to the worker's launch environment only, as TMPDIR in the spawned process's env, without mutating process.env around transport.dispatch. The host's schema, raw-output and Codex-home temporaries must stay outside the worker's writable root. Add a fixture that launches a real runWorkerProcess child under an episode and asserts that the worker's TMPDIR holds no host-owned entry while the worker runs. Priority: low.",
  "reopenWhen": "A live entropy episode loses or alters its raw return, a receipt counts a host temporary, or an order is planned that edits the worker launch."
}
```

## WO-175-D014

```json
{
  "id": "WO-175-D014",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Record that WO-157-D016's reopening condition occurred in this verification's fresh product gate, and keep it out of WO-175's verdict. npm test -- --again --review failed one suite: runner-fixtures, case 'code identity follows tracked source and dependency bytes across processes and revisions' (scripts/test-runner.test.mjs). Every assertion passed; the case threw ENOTEMPTY from its finally-block rmSync of its own temporary repository. The fixture commits twice without maintenance.auto=false, and the surviving root held only .git/objects/pack, the signature D016 diagnosed (a detached git maintenance repack writing while rmSync walks the tree). The case and gate-evidence.mjs are unchanged by WO-175, and runner-fixtures passed alone on an immediate rerun.",
  "evidence": [
    "Fresh npm test -- --again --review under Claude Code 2.1.286, recorded 2026-10-01T00:21:38.305Z: 40 passed, 1 failed, 849.10 s, 85 fresh tasks; the failure is runner-fixtures not ok 46 with error \"ENOTEMPTY, Directory not empty: '…/T/dotln-code-identity-dHmjLu'\" at scripts/test-runner.test.mjs:1899 (rmSync in finally)",
    "The surviving root /var/folders/…/T/dotln-code-identity-dHmjLu contained only .git/objects/pack (empty after the repack finished); it was then removed by this verifier",
    "node scripts/test-runner.mjs --only runner-fixtures --again: exit 0, PASS runner-fixtures 23.19 s, 2 fresh tasks",
    "git diff against the executor base shows no change to scripts/test-runner.test.mjs or packages/skeleton/src/gate-evidence.mjs; the executor's npm test row at the same code identity e15fa662… passed 41 suites"
  ],
  "rationale": "Shifting the burden: WO-157 fixed the one fixture it observed so gates would stop needing a re-run argued away; this second fixture shows the class is open, and the record lets the next planning pass act without rediscovery. Rule beating: WO-175's verdict does not rest on a red row it did not cause, and does not hide the red row either. Naive Interventionism: the remedy D016 chose (maintenance.auto=false before the first commit) applies per fixture and belongs to an order that owns the runner fixtures, not to this verification. NoOp leaves any gate that creates a committing fixture exposed to the same race.",
  "rejected": [
    {
      "option": "Fail criterion 11 on this run",
      "reason": "The failing case is outside the subject's change, its assertions passed, it passes alone, and the subject's code identity carries a passing 41-suite row."
    },
    {
      "option": "Set maintenance.auto=false in the fixture during verification",
      "reason": "A verifier never edits implementation; the class-wide fix (every committing fixture) is a planning decision."
    }
  ],
  "reopens": {
    "decisionId": "WO-157-D016",
    "observation": "A different fixture teardown reported ENOTEMPTY in a later gate after WO-157 closed: scripts/test-runner.test.mjs 'code identity follows tracked source and dependency bytes across processes and revisions' (runner-fixtures) in WO-175 VER-001's fresh npm test -- --again --review on 2026-10-01T00:21Z. That fixture commits twice without maintenance.auto=false, and its surviving root held only .git/objects/pack. The class-wide remedy (disable auto-maintenance in every fixture repository that commits, or one shared fixture helper) is open."
  },
  "reopenWhen": "A planning pass or later order applies the remedy across committing fixtures, or another teardown ENOTEMPTY is observed with a different cause."
}
```

## WO-175-D015

```json
{
  "id": "WO-175-D015",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Pass criterion 4 and board a catalog-row direction implemented the other way: plan start measures the timing rows at entry. The planning pass's weighing of receipt 035 (docs/planning/entropy-review-004-2026-09-30.md §11, carried on the order's catalog row in docs/planning/work-order-map.md) directed that plan start run the rows that are not timings and print the timing rows as not measured at entry, with the command. conditionsAtStart (scripts/lib/planning-conditions.mjs) calls planningConditions with the default table, so plan start runs the plan check, collectSources, the cold release list and the index three times each before it creates the branch. The recorded entry block took 22,204 ms (planning-entry.json) and 24,434 ms in VER-001's clone. No executor decision records the choice, and neither verification judged it, because criterion 4 asks only for the count and the command within 1 KB. I keep the behavior: it is not a stored count, the defect the direction guarded against; the entry count equals the listing's default count; and a reviewer never writes a behavioral change and certifies it.",
  "evidence": [
    "docs/planning/entropy-review-004-2026-09-30.md §11, WO-175 known issue 'Whether plan start runs the probes or prints a stored count'; the WO-175 row of docs/planning/work-order-map.md carries it",
    "scripts/lib/planning-conditions.mjs conditionsAtStart: planningConditions(root) with no table or row filter; CONDITION_TABLE rows plan-check, collect-sources, release-list and order-index are timed three times each in fresh processes",
    "docs/evidence/WO-175/planning-entry.json durationMs 22204; VER-001 criterion 4 durationMs 24434",
    "grep of docs/evidence/WO-175/decisions.md D001–D014 finds no record of the timing-at-entry choice"
  ],
  "rationale": "Mission: a pass that opens should see crossed thresholds without measuring by hand, and the delivered entry block does that with a fresh count. Wrong goal and rule beating: the criterion's 1 KB and command bound are met while the direction about what entry measures is not; recording it keeps the gap visible. Commons and escalation: about 22 to 24 s and twelve timed probe processes on the shared host at every planning entry, before the branch exists. Policy resistance: an entry that feels slow invites skipping it. Drift: a listing whose cost grows with the repository will grow entry time with it. Shifting the burden: routing it to the planner keeps the decision with the actor who directed it. Success to the successful is immaterial. Naive Interventionism: changing conditionsAtStart now would be an unverified behavioral edit after verification. NoOp: keeps a correct but slower entry until a pass decides.",
  "rejected": [
    {
      "option": "Fail criterion 4",
      "reason": "The criterion's text is met: the block prints the holding count and the command beside the failures block, within 1 KB, and stays open when the count is unavailable."
    },
    {
      "option": "Filter the timing rows out of conditionsAtStart in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; it would need repair and fresh verification."
    }
  ],
  "followup": "Planner: confirm or reverse WO-175-D015. To follow the receipt-035 direction, conditionsAtStart measures only the rows whose unit is not seconds and prints the timing rows as not measured at entry, naming them and the command, then records plan start's duration before and after. To keep the current behavior, record the choice and its entry cost (22 to 24 s, recorded 2026-09-30) on the order's catalog row. Priority: low.",
  "reopenWhen": "A planning entry is skipped or reported slow because of the conditions block, plan start's conditions block exceeds 30 s, or a planning pass decides the timing-row question."
}
```

## WO-175-D016

```json
{
  "id": "WO-175-D016",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Record that receipt 035's re-mint reopening observation cannot be judged from WO-175's record. The planning pass's weighing (docs/planning/entropy-review-004-2026-09-30.md §11) names 'the recorded re-mint cost exceeds the 384 s the order cites' as the reopening observation for the instruction sentence that forced five re-mints. The executor recorded the live feedback audit (61.847 s, 681,326 tokens, USD 1.487; D008 and D010). It recorded no wall time for the deterministic authority, artifact-identity, verification and feedback re-mints, the harness regeneration or the console self-host re-pin. Whether the whole re-mint exceeded 384 s is therefore unknown, neither held nor not held.",
  "evidence": [
    "docs/planning/entropy-review-004-2026-09-30.md §11, WO-175 known issue 'The instruction sentence costs five re-mints'",
    "docs/evidence/WO-175/decisions.md D008 and D010: live audit 61.847 s and its usage; no edition or re-pin duration",
    "docs/evidence/WO-175/checks.json, handoff.md and fixtures.md: no re-mint duration",
    "docs/evidence/WO-175/feedback-001/edition.json: liveAudit carried false, the fresh audit this order paid for"
  ],
  "rationale": "Mission: the instruction sentence's cost is weighed against what it removed, so the cost must be on record. Drift: an unrecorded cost cannot show growth across orders. Rule beating: the live audit's figure alone would understate the re-mint. Shifting the burden: the next order that re-mints can measure it at no extra run. The other traps are immaterial: no gate, refusal or process changes. Naive Interventionism: re-running five re-mints only to time them would cost more than the observation is worth. NoOp: the observation stays unknown until the next re-mint records it.",
  "rejected": [
    {
      "option": "Treat 61.847 s as the re-mint cost and judge the observation not held",
      "reason": "It is one component; the deterministic re-mints and the re-pin were not timed."
    },
    {
      "option": "Re-run the re-mints in this review to time them",
      "reason": "The editions are current and verified; a timing-only re-mint would rewrite verified evidence for a planning observation."
    }
  ],
  "followup": "Executor of the next order that re-mints the five editions (the carrier of FUP-84e5edb1566a4db1, WO-175-D012, is the first candidate): record the wall time of the whole re-mint, the deterministic editions, the harness regeneration, the live feedback audit and the console self-host re-pin, in that order's decisions beside the 384 s figure from WO-175's catalog row. Priority: low.",
  "reopenWhen": "An order records a whole re-mint's wall time, or a planning pass drops the 384 s figure."
}
```

## WO-175-D017

```json
{
  "id": "WO-175-D017",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Record that WO-173-D018's reopening observation occurred again, and stage the new module before this review's product gate. The executor's passing npm test row and VER-001's fresh rerun were both recorded at code identity e15fa662d9b794220ce25249c48f4c35e7794ccbbaef3245e68f68c6fd62245a while scripts/lib/planning-conditions.mjs was untracked. gateCodeIdentity reads git ls-files, so neither identity keyed the module. Staging it gives a560289d26fd23b33436d47900de56907ff5b3081c8dfd09cffa36acb68061bc. Both earlier rows ran every selected suite fresh, so no wrong reuse followed. This review's final gate runs at the staged identity, and that row is the one publication cites.",
  "evidence": [
    "node --input-type=module -e gateCodeIdentity(process.cwd()) before git add: e15fa662…; after git add -- scripts/lib/planning-conditions.mjs: a560289d…",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity: entries from git ls-files -z when no revision is given",
    "docs/evidence/WO-175/checks.json final row: 85 fresh tasks at e15fa662…; VER-001: npm test -- --again --review, 85 fresh tasks at the same identity",
    "FUP-7629e03c6573f5cb is needs-review after WO-174-D023 reported the same observation for two runner modules"
  ],
  "rationale": "Mission: a publication-bound row should stand for the bytes it ships. Rule beating: a row keyed without a new module passes for a tree it never named. Drift: the gap recurred in the next order after WO-174, which shows the interim rule of staging before the gate is not followed. Shifting the burden: each reviewer stages and reruns by hand. Policy resistance, escalation, success to the successful and commons are immaterial: no gate or authority changes. Naive Interventionism: the lookup change belongs to the planner's open row, not to this review. NoOp: leaves the class open with one more observation recorded.",
  "rejected": [
    {
      "option": "Cite the executor's row in publication",
      "reason": "Its identity did not key the module the order adds."
    }
  ],
  "reopens": {
    "decisionId": "WO-173-D018",
    "observation": "WO-175's executor gate row and VER-001's fresh rerun, recorded at code identity e15fa662… on 2026-09-30T23:41Z and 2026-10-01T00:21Z, were computed while the new scripts/lib/planning-conditions.mjs was untracked; staging it changes the identity to a560289d…. WO-174-D023 recorded the same observation for WO-174's two runner modules, and WO-175 is the next order to reach final review. Neither row reused an earlier result; both ran fresh."
  },
  "reopenWhen": "A planning pass routes FUP-7629e03c6573f5cb, or a gate row is reused at an identity that missed a new source file."
}
```
