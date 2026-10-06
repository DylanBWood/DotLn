# WO-187 decisions

## WO-187-D001 — Move defect discovery into verification

```json
{
  "id": "WO-187-D001",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Implement the three verification duties, executor self-review, known-issue briefing and recorded final-review finding counts through the existing lifecycle and generated harness.",
  "evidence": [
    "resume status selects active WO-187 and next reserved this worktree's writer; the session readback is codex-cli 0.160.1, gpt-6.1-sol, max.",
    "The cited planning document section 3 and FINAL-001 reports for WO-059, WO-139, WO-144, WO-158 and WO-178 describe narrow probes, omitted gates and defects introduced by repair.",
    "readHandoffLedger already returns completion advisories; failureRecord already traverses FinalReviewCompleted events; lowerToHarness and harness check own deterministic generated files."
  ],
  "rationale": "Mission and critical path: reduce recurring operator routing and late defect discovery across the source-to-deliverable loop. Policy resistance: retain separate independent verification and final acceptance. Commons: one fresh read-only adversary, no descendants, within the cap of 20; counters unavailable rather than zero. Drift: attack actual behavior and expose escapes, without treating a count as a target. Escalation: missing self-review and finding class remain advisory, with no new dispatch or refusal. Success to the successful: compare extending current events with a separate review phase and duplicate parsers. Shifting the burden: known issues reach verification before release review. Rule beating: an advisory line witnesses a claim, not an executed review; the fresh adversary and executed probes supply evidence. Seeking the wrong goal: judge correctness and usefulness before byte totals. Naive Interventionism: preserve current gates, final-review duties, publication controls and immutable reports; use additive fields and scoped documentation. NoOp retains the documented discovery gap.",
  "rejected": [
    {"option": "A separate review lifecycle phase", "reason": "Adds operator routing and is outside the order."},
    {"option": "Refuse completion over missing review metadata", "reason": "The order requires advisory behavior."},
    {"option": "Every lens on every order", "reason": "Choose lenses whose questions apply to the change."},
    {"option": "NoOp", "reason": "Leaves the selected order and its evidenced verification gap unresolved."}
  ],
  "reopenWhen": "Ten subsequent orders show no fall in escapes, verification's median more than doubles, or the metadata prevents recording an otherwise legal result."
}
```

## WO-187-D002 — Keep planning on recorded events

```json
{
  "id": "WO-187-D002",
  "kind": "experiment",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Keep the existing planning event traversal and persist parsed finding counts at final-review completion; do not introduce another report parser into planning.",
  "question": "Should lifecycle and planning share recorded counts or parse the same report separately?",
  "alternatives": ["Persist counts on FinalReviewCompleted", "Parse each report in lifecycle and planning"],
  "observation": "The inspected failureRecord already traverses FinalReviewCompleted. economy-observation.json records the bounded read of that source; recurring savings are unmeasured.",
  "budget": {"wallSeconds": 120},
  "execution": "run",
  "cost": {"wallSeconds": 1, "tokens": null, "commands": ["node --input-type=module: read scripts/lib/plan-failures.mjs and record economy-observation.json"], "source": "Rounded-up one-second tool wall for the bounded source inspection and recording; the inner read measured 0.000083209 seconds. Preparation was the same current-source read."},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["failureRecord event traversal"], "summary": "Keeps the existing method; no recurring improvement claimed from a source inspection."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "evidence": ["scripts/lib/plan-failures.mjs", "docs/evidence/WO-187/economy-observation.json"],
  "rejected": [{"option": "Parse reports again at planning time", "reason": "Duplicates interpretation and moves the count away from its immutable lifecycle event."}],
  "reopenWhen": "Recorded counts cannot answer a concrete planning question; no second experiment in this order."
}
```

## WO-187-D003 — Preserve useful guidance and report byte overruns

```json
{
  "id": "WO-187-D003",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Amend criterion 6 to make byte headroom a measured goal rather than a hard pass condition; preserve useful guidance and board any ceiling overrun as a follow-up without changing the ceilings.",
  "evidence": [
    "The operator said byte headroom is a great goal and nice to have but would be lax about a hard criterion; then clarified that byte reduction that reduces usefulness is useless; then directed: if you go over, add it as a follow up.",
    "cold-start-before.json measures executor 29,237 against 29,246, verifier 25,735 against 29,831, reviewer 27,077 against 28,884, release-close 18,186 against 21,266, planner 20,004 against 24,576 and refuter 19,283 with no ceiling, identically in both roots."
  ],
  "rationale": "D001's goal comparison applies. The useful review instruction is the outcome; bytes are an operating cost to expose and optimize with equivalent usefulness. No global ceiling acceptance is introduced.",
  "rejected": [{"option": "Delete useful instructions to pass a byte ceiling", "reason": "Contradicts the operator's explicit direction."}, {"option": "Raise ceilings", "reason": "The operator directed a follow-up for an overrun."}],
  "reopenWhen": "The measured after-root exceeds its ceiling: record the amount and a concrete follow-up; a future byte optimization must retain the same duties."
}
```

## WO-187-D004

```json
{
  "id": "WO-187-D004",
  "date": "2026-10-05",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.66.4, the next patch above the observed release baseline v0.66.3, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.66.3 (local tags)",
    "patch classification declared in docs/work-orders/WO-187-verification-attacks-and-reviews.md"
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

## WO-187-D005 — Retain useful executor duties and board the 531-byte overrun

```json
{
  "id": "WO-187-D005",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Keep the worker pin and fresh self-review instructions. Record the executor's final measured 531-byte ceiling overrun as a follow-up, without a ceiling acceptance or usefulness-reducing edits.",
  "evidence": [
    "cold-start-before.json and cold-start-after.json measure all twelve installed role roots, including CLAUDE.md, before and after regeneration.",
    "Both executor roots move from 29,237 to 29,777 bytes, +540, against 29,246: 531 bytes over. Both verifier roots move from 25,735 to 26,077 (+342) against 29,831; reviewer 27,077 to 27,641 (+564) against 28,884; release-close 18,186 to 18,485 (+299) against 21,266; planner 20,004 to 20,303 (+299) against 24,576; refuter 19,283 to 19,582 (+299), ceiling unset. Explicitly naming the Claude launch model and effort adds 25 bytes per role after the first 506-byte observation.",
    "The operator explicitly directed that an overrun becomes a follow-up; D003 and the recorded planning amendment bind that instruction."
  ],
  "rationale": "D001 and D003 apply: review usefulness is the outcome and bytes are a measured operating cost. The extra executor duties directly answer the absent self-review and inherited worker-effort gaps; deleting them would defeat the deliverable.",
  "rejected": [
    {"option": "Delete or obscure the new review duties", "reason": "Loses usefulness, contrary to the operator direction."},
    {"option": "Raise the executor ceiling", "reason": "The operator directed a follow-up instead."},
    {"option": "Optimize unrelated root text now", "reason": "Requires an equivalent-usefulness comparison outside this bounded deliverable."}
  ],
  "followup": "Reduce the executor's 531-byte cold-start overrun with equivalent usefulness: compare source instructions in packages/skeleton/src/loadouts/contributor.ts and generated .agents/skills/dotln-executor/SKILL.md plus its .claude twin; relocate or consolidate redundant procedure only with preserved duties and discoverable read directives. Reproduce with node scripts/harness-context.mjs --check, before/after role bytes, npm run harness -- check and npm run test:docs. Priority: operating-cost optimization after correct review behavior lands; do not remove useful review or authority guidance and do not raise ceilings merely to hide the overrun.",
  "reopenWhen": "An optimization preserves every duty and makes the installed executor roots fit the existing ceiling, or another useful rule changes the measured overrun."
}
```

## WO-187-D007 — Fix independently reproduced review defects and make the Claude pin explicit

```json
{
  "id": "WO-187-D007",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Fix all four defects reproduced by the fresh read-only adversary and one defect found in the executor's separate reading. Require every subsequent Claude launch to select claude-opus-5-5/xhigh explicitly through the generated worker type.",
  "evidence": [
    "Fresh agent wo187_adversary read only the order and full diff, with fork_turns none, supplied model gpt-6.1-sol and reasoning_effort max. It used private bounded fixtures without repository/Git writes, transitions or descendants, and returned four blocking findings; it had no separate host model/effort readback.",
    "The receipt projection compared a receipt ordinal with latest.ordinal on an object storing latest.receipt. Compare latest.receipt.ordinal; regressions select receipt 2 over receipt 1 and let receipt 3 clear older issues.",
    "The class regex accepted valid prefixes of unknown tokens such as escape2 and integration42. The adversary's recheck also reproduced wrapped escape integration being accepted by the first repair. Parse the complete semicolon-delimited field, strip only a matching Markdown wrapper, and validate the entire value; regressions count both suffixes and wrapped ambiguous values as unclassed while preserving valid wrappers.",
    "Parsed JSON null was dereferenced as a receipt. Guard its schema with optional access; null, scalar, array and empty-object briefing fixtures now remain skippable. Planning's separate receipt-integrity validation remains unchanged.",
    "A fenced carry-in example was selected before the actual heading. Share fence-aware line iteration, ignore fenced headings for selection and termination, and preserve the real section's fenced content.",
    "The executor's separate reading found that a repeated F-number explanation heading without a label erased the earlier explicit class. Preserve the explicit label across unlabeled duplicate headings, while conflicting explicit labels remain unclassed; a regression proves the distinction.",
    "The focused lifecycle fixture passed after these repairs. review-fixture.json records the executed command, duration and exit code; the first malformed-shape fixture exposed planning's independent integrity check, so only those four private malformed files are removed before its planning portion. The adversary's final bounded recheck confirms all four repairs, supported class wrappers and repeated detail headings, with no remaining concrete finding.",
    "The operator said the Claude option should definitely be opus 5.5 xhigh when launched, full stop. The generated definition already pins those fields; shared role text now names both, and product 07's planning-refute sentence no longer says to inherit root effort. The earlier low-effort root was solely the required pin-isolation probe before this direction; no further Claude launch uses low."
  ],
  "rationale": "D001's mission, trap comparison and NoOp assessment apply. These are bounded repairs within the declared briefing, finding-count and model-pin surfaces. Keeping known inputs current and counting unknown labels honestly improves review usefulness; adding an explicit launch instruction removes ambiguity without claiming effective host readback.",
  "rejected": [
    {"option": "Board the reproduced defects instead of fixing them", "reason": "They directly break criteria 2 or 4 and have bounded repairs in the selected surfaces."},
    {"option": "Discard fenced content from the real carry-in body", "reason": "Would lose useful input while fixing only heading selection."},
    {"option": "Infer effective worker effort from the pin", "reason": "The probe's host metadata reports none."}
  ],
  "reopenWhen": "A later receipt fails to replace or clear an earlier issue, a supported physical finding line loses its full class, or a Claude launch is selected without claude-opus-5-5/xhigh."
}
```

## WO-187-D008 — Correct yielded-probe sequencing

```json
{
  "id": "WO-187-D008",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Wait for each yielded bounded command to finish before starting the next probe; do not treat the tool's session identifier as completion.",
  "evidence": [
    "The verification evidence probe yielded after 1000 ms. Its recorded interval ended at 21:41:59.477Z, while the feedback regression probe began at 21:41:59.417Z: 60 ms of overlap, contrary to the one-process probe rule.",
    "Both commands recorded executed exit code 0. Their immutable outputs remain; no isolated-resource timing claim is made from the overlap. The feedback carry began after its regression finished.",
    "The executor acknowledged the sequencing error and consumed both completion results before further bounded work. Subsequent serial probes use a wait long enough for completion or explicitly resume their yielded session."
  ],
  "rationale": "D001 applies. Preserve passing deterministic evidence and correct the process error without inventing an isolated timing measurement or discarding existing work.",
  "rejected": [{"option": "Start the next probe on an early-yield session result", "reason": "An ongoing session is not process completion."}],
  "reopenWhen": "A bounded command yields a running session: finish it before starting another probe."
}
```

## WO-187-D006 — Bind each instruction to the discovery gap and existing interfaces

```json
{
  "id": "WO-187-D006",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Use one generated worker type, scoped review detail, one finding interpreter at recording and additive event-count projections; preserve current result admission and prepare the two closing retargets.",
  "evidence": [
    "Verifier attack sentence and variation axes answer the narrow-probe failures in the cited FINAL-001 reports: WO-059's forged process record, WO-144's changed cwd and WO-158's repeated Git prefix; planning section 3 also names the real-corpus gap in WO-178.",
    "Whole-implementation review and chosen lens catalog answer planning section 3's finding that only three of forty verifier reports discuss design or maintainability. The platform lens and three finding routes retain product 07's existing authority boundary.",
    "Fresh adversary and executor self-review answer the absence of an executor review duty and the reviewer findings their own first readings missed. The handoff's line is advisory, not execution evidence.",
    "Re-verification re-derives repair-touched criteria: WO-158 FINAL-001 describes a defect introduced by repair. The completed product-gate sentence explicitly keeps probes available.",
    "Known-issue briefing answers the order's documented verifier/reviewer input gap. review-fixture.json proves both order and receipt inputs; baseline-fixture.json fails at the omitted order briefing on 08845c71.",
    "The optional HarnessProgram.worker contract is consumed by lowerToHarness; scripts/lib/harness.mjs admits and checks the owned agent file. The generated definition pins claude-opus-5-5/xhigh, and the shared role line pins Codex spawn calls to gpt-6.1-sol/max with no inherited conversation.",
    "Claude Code's public subagent documentation checked 2026-10-05 documents full model IDs, definition effort overriding root effort, and per-call model precedence. worker-pin-probe.json records one dotln-worker launch without override from a low-effort root on 2.1.289; the host result reports no worker model or effort fields. No effective effort is inferred.",
    "Finding classes count once per F identifier, ignore fenced examples and mark missing, unknown or conflicting labels unclassed. One advisory names blocking unclassed IDs; the legal result records. Planning reads events, includes findings on passing reviews and all attempts of the ten most recently reviewed orders, and names missing historical counts as unmeasured.",
    "close-register.md prepares the FUP-19cd701c25446383 allocation remaining in WO-188 and the open remainder of FUP-e62d0d2771185a38. FUP-8ce4b4b0104ba41b is already open for the measured byte overrun."
  ],
  "rationale": "D001's mission and trap comparison still applies. New inputs are scripts/lib/review-findings.mjs, scripts/lib/verification-briefing.mjs, the harness-owned agent path allowance, their existing compiler/harness/resume fixtures, and publication section coverage. These support the order's declared deliverable rather than a new role or refusal. Keep the plan-start figure readable inside its existing 1 KB bound as a fraction with order count and unclassed count; the full feed/export retains structured numeric totals.",
  "rejected": [
    {"option": "A second parser in planning", "reason": "Duplicates report interpretation instead of consuming the recorded result."},
    {"option": "Convert the self-review line or finding labels into a refusal", "reason": "Contradicts the order and the advisory boundary."},
    {"option": "Infer a worker's effort from its parent, pin or self-description", "reason": "Those are not host result readback."},
    {"option": "Settle the entire personal delegation profile now", "reason": "Its enabled-mode floor and setting/both-mode evidence are outside this order."}
  ],
  "reopenWhen": "A fixture omits a real input shape, a legal result is refused over review metadata, a generated worker's pin drifts without detection, or the last-ten denominator omits a review attempt."
}
```

## WO-187-D009 — Reopen the bundle-shape follow-up and preserve unrelated queued work

```json
{
  "id": "WO-187-D009",
  "date": "2026-10-05",
  "dispatch": "resume: next; follow-up observation",
  "decision": "Reopen existing FUP-ea936acad1506e18 for planning because the new generated worker file changes the bundle's shape. Preserve the byte-overrun row open and prepare the two required close retargets; leave the other textual matches unchanged.",
  "evidence": [
    "The canonical touching feed at revision 0ef65b80244964d313b8f8b9391961362282942b377f4880f3dd0f0da23b14cc returned 18 rows over three pages. All pages were read, and the pin-list row's full revisions/dispositions were read with --show.",
    "FUP-ea936acad1506e18 names a snapshot failing to load a reachable module or the next order changing bundle shape. WO-187 adds an optional worker contract and .claude/agents/dotln-worker.md, increasing the generated surface count from 32 to 33. The condition has occurred even though harness check passes; the runtimeFiles list itself is unchanged.",
    "The intended future work remains the existing candidate: derive the pinned runtime list from its reachable import closure in scripts/lib/harness.mjs, with snapshot load/integrity and harness fixtures. This order does not replace the import-closure mechanism or claim an observed missing runtime module.",
    "FUP-8ce4b4b0104ba41b is already open at source revision 2 for the 531-byte overrun. close-register.md prepares FUP-19cd701c25446383's remaining WO-188 allocation and FUP-e62d0d2771185a38's open delegation-profile remainder at close.",
    "Leave FUP-331423b3559f5cfa, FUP-77efd30be6cab5c1, FUP-b28b870422a74166, FUP-e96221b106cd136a, FUP-f1c7a256bec46737 and FUP-fb8cbeabbddef397 open: their prior cost, caching and coverage work remains independent; matches on the shared close-register.md basename do not settle it.",
    "Leave FUP-4b70089b028849f0, FUP-51c310284c2fea17, FUP-8cfd3ff52146a016, FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-ec72b2ea596bdc75 and FUP-fd05316b6030ef73 deferred, and FUP-16a4af39c710459b and FUP-5e52eb500e395237 untriaged: this diff does not change their named hedge, temporary-root, dispatch-release, real close writer, mode-attestation, usage-attribution, authority-copy, judged-repair sentence, standing writer-text or gate-correction seams. The FUP-51c310284c2fea17 full disposition was read to distinguish its fixture temporary-root/dispatch-release trigger from a textual resume.mjs match."
  ],
  "rationale": "D001 applies. Reopen a documented observed condition on its existing identifier without silently starting another implementation project. NoOp on the unrelated matches preserves their queued authority and avoids treating a file-name match as a verdict.",
  "rejected": [
    {"option": "Leave the fired bundle-shape condition deferred without a new observation", "reason": "The register's recorded trigger now holds."},
    {"option": "Implement runtime import-closure generation in WO-187", "reason": "The current bundle checks pass and the existing candidate warrants its own planning assessment."}
  ],
  "reopenWhen": "Closing review observes a different source revision, a snapshot fails to load a reachable module, or one of the named unrelated seams actually changes."
}
```

## WO-187-D010 — Correct the generated-surface count fixture

```json
{
  "id": "WO-187-D010",
  "date": "2026-10-05",
  "dispatch": "resume: next; full review gate repair",
  "decision": "Update the existing cap-module refresh fixture's expected generated surface count from 32 to 33, retaining all snapshot integrity, cap readback and damage checks. Preserve the new worker definition.",
  "evidence": [
    "npm test -- --review reported not ok for WO-139 cap-module-only changes refresh the runtime and snapshot damage is detected. The canonical evidence --stop stopped run 28fef85e-7fbd-4815-9bf7-e44ea0c0ffa0 after 621.4 seconds, leaving no passing check; interrupted product cases are not evidence of a product defect or a completed gate.",
    "A bounded isolated node --test --test-name-pattern='WO-139 cap-module-only changes refresh' scripts/test-harness.mjs reproduced 33 !== 32 at line 1933 before the edit. The emitter and harness check report 33 including the new generated agent file.",
    "After changing only the expected count, the bounded two-case run of that fixture and WO-187 harness check covers passed 2/2; model and effort tampering still refuse as drift. The snapshot cap and missing/changed module assertions remain.",
    "The executor's self-review now accounts for six concrete defects: four adversary findings, the repeated-heading classification fix and this count expectation. All six are fixed; none is deferred as a defect."
  ],
  "rationale": "D001 applies. The failure was an old expected count in a surface this order changes, not evidence to remove the new worker or weaken the runtime assertions. A new complete current review gate is still required.",
  "rejected": [{"option": "Remove the worker file or skip the runtime fixture", "reason": "Would erase the deliverable or its existing integrity evidence."}],
  "reopenWhen": "The complete current review gate fails or a generated-surface count changes again."
}
```

## WO-187-D011 — Preserve historical role oracles and pin the authorized current instructions

```json
{
  "id": "WO-187-D011",
  "date": "2026-10-05",
  "dispatch": "resume: next; full review gate repair",
  "decision": "Add a separate WO-187 role oracle linked by exact bytes to WO-186, update the existing current-oracle pointer, and declare the new fixture in the process-debt machinery inputs. Preserve every historical snapshot and every existing opt-out assertion.",
  "evidence": [
    "The second full review passed harness-fixtures in 343.20 seconds, then process-debt reported the optional economy support's current role hash differed from WO-186. Canonical evidence --stop ended run ae8bf156-1c39-4398-813d-137b379d0497 after 545.6 seconds with no check; stopped/unstarted cases are not product findings.",
    "The bounded isolated optional-economy fixture reproduced the current executor hash fc58207155ac880ff37a1c44c1c49a17cd34eec33fc09104fbeeea2f6c6ff54a against the prior 2e4c91a328ed713cb20b3ed0e76f13c0f3376a48dd3860416fd25a75c878d393. The test's own instructions require a separate oracle after authorized role edits, never a historical rewrite.",
    "Named inputs: scripts/test-process-debt.mjs, scripts/test-runner.mjs and packages/skeleton/fixtures/wo187-role-baseline.json. The new fixture records twelve current default and twelve current opt-out hashes, historicalBaseline wo186-role-baseline.json and exact historicalSha256 76d76464517128ca521fad7365b7100c5359cd1ce756fe365e47748fd78606a9; it preserves the prior upstream chain metadata.",
    "The bounded two-case run passes historical preservation and current opt-out behavior through WO-187, plus the existing direct machinery-input coverage check. No assertion or suite is skipped. Historical WO-145 through WO-186 files are unchanged.",
    "This is the seventh concrete self-review defect: the current-oracle pointer was not advanced for the authorized new role instructions. All seven are fixed; byte optimization and the pre-existing import-closure candidate remain separate open work."
  ],
  "rationale": "D001 applies. Authorized role changes need a new current observation while historical evidence remains exact. Declaring the new fixture adds its own input to the existing suite; the product gate's selection policy is unchanged.",
  "rejected": [
    {"option": "Rewrite WO-186's frozen hashes", "reason": "Would erase historical evidence and violates the existing oracle contract."},
    {"option": "Remove the opt-out or current-hash assertions", "reason": "Would weaken the optional-support and current-output checks."}
  ],
  "reopenWhen": "A historical snapshot changes, opting out removes any current duty besides the economy paragraph, or a later authorized role edit needs its own linked oracle."
}
```

## WO-187-D012

```json
{
  "id": "WO-187-D012",
  "date": "2026-10-05",
  "dispatch": "resume: next; document gate repair",
  "decision": "Update the console's exact workspace dependency pins and lockfile entries to compiler 0.25.3 and skeleton 0.52.4, retaining console 0.4.0 because its source and contract are unchanged.",
  "evidence": [
    "npm run test:docs failed release-surfaces on console -> compiler 0.25.2 versus 0.25.3 and console -> skeleton 0.52.3 versus 0.52.4. The other component and license checks passed.",
    "packages/console/package.json and its package-lock.json workspace entry still carried both old exact pins after the component bumps. No dependency is added."
  ],
  "rationale": "D001 applies. Keep the internal dependency graph consistent with the prepared release rather than weakening the exact-pin check or reverting the authorized component changes. This is the eighth concrete self-review defect, repaired in the release surfaces.",
  "rejected": [{"option": "Skip exact workspace pin validation", "reason": "Would leave the published release graph internally inconsistent."}],
  "reopenWhen": "A changed workspace version leaves another consumer's exact pin stale, or the current release-surface check fails."
}
```

## WO-187-D013

```json
{
  "id": "WO-187-D013",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator direction during execution",
  "decision": "Apply the operator's byte-headroom direction to the execution-guide write-back: retain its existing 166,907-byte ceiling and useful review detail, mark only its overrun advisory through a resolving public decision with an unresolved registered follow-up, and keep all other document checks and ceiling-raise rules.",
  "evidence": [
    "The operator directed that byte headroom is a goal rather than a hard criterion, that reducing usefulness to reduce bytes is useless, and that an overrun becomes a follow-up. D003 binds this direction for the role roots; the same direction applies to the declared product-document write-back.",
    "npm run test:docs measured product 07 at 172,622 against 166,907, 5,715 bytes over. HEAD was 166,877, leaving only 30 bytes for this order's declared review section. scripts/docs-check.mjs treated that operating cost as a hard failure.",
    "New bounded inputs are scripts/docs-check.mjs, scripts/test-docs-check.mjs and the one advisoryDecision field in docs/control/doc-ceilings.json. No ceiling is raised and no other document becomes advisory. The public decision and current unresolved follow-up must resolve; an absent, stale or settled follow-up retains the original hard overrun result."
  ],
  "rationale": "D001's wrong-goal, rule-beating and NoOp comparisons apply. Useful verification instructions are the outcome; a measured byte overrun is a planning input. A scoped advisory tied to a public unresolved item implements the operator's direction without hiding cost, trimming useful detail, exempting bytes or changing the ceiling. The first failed document gate also blocked downstream fixtures because of the separate stale pins; neither failure was a passed gate.",
  "rejected": [
    {"option": "Delete 5,715 bytes of useful review guidance to pass", "reason": "Contradicts the operator's explicit direction and weakens the deliverable."},
    {"option": "Raise the guide's ceiling or exempt the new section", "reason": "Would hide the overrun instead of preserving its measured follow-up."},
    {"option": "Make all document ceilings advisory", "reason": "Unnecessary broader policy change; only this declared write-back needs the operator-directed route."}
  ],
  "followup": "Optimize docs/product/07-execution-guide.md with equivalent usefulness. The document gate first measured 172,622 bytes against 166,907, 5,715 over; rerun node scripts/docs-check.mjs for the current amount. Consolidate redundant procedure while retaining verification attacks, whole-diff review, the chosen lens catalog, known inputs, finding routes, re-verification and the pinned worker/readback rules. Keep the ceiling and remove advisoryDecision when useful guidance fits it. Paths: product 07, docs/control/doc-ceilings.json and its publication mapping. Checks: before/after UTF-8 bytes, node scripts/docs-check.mjs, npm run publication:check and npm run test:docs. Priority: operating-cost optimization after correct review behavior lands; never delete useful duties merely for byte reduction.",
  "reopenWhen": "The follow-up is stale or resolved, a usefulness-preserving consolidation fits the original ceiling, or a later write-back changes the measured overrun."
}
```

## WO-187-D014

```json
{
  "id": "WO-187-D014",
  "date": "2026-10-05",
  "dispatch": "resume: next; independent self-review repair",
  "decision": "Repair all three concrete findings from the reused adversary's static review of the operator-byte-direction diff: resolve complete titled anchors, keep the register's stable decision-ID key, permit only open/deferred follow-ups, and reject repeated reference fragments.",
  "evidence": [
    "The existing wo187_adversary reviewed only the order and whole diff, without evidence/report-directory reads, probes, writes, transitions, new contexts or descendants. It identified the short-ID/full-anchor mismatch, allocated being a closed status, and split('#') ignoring later fragments; supplied selection remains gpt-6.1-sol/max with no separate host readback.",
    "The added allocation regression first failed because the helper still emitted an advisory instead of the required overage result. After excluding allocated, the titled-decision regression failed because the valid full reference still fell back to hard overage. Match readDecisions row.anchor, then use row.id for the stable register key; only open/deferred can qualify.",
    "The reference parser now requires exactly two split components. Tests append #does-not-resolve to the valid advisory and raised-ceiling planning references and expect their original hard results; a suffix is never silently dropped.",
    "The targeted byte-policy and ceiling-raise tests pass after the repairs, over bare/titled decisions and default/configured roots. Their absent decision/register, unknown anchor, stale source/register/disposition, allocated and settled cases retain hard overage; the ceiling and exact negative headroom remain unchanged.",
    "Publication check exposed the guide's changed source lock. The document gate was started before that failure was acted on; canonical evidence --stop stopped run 78bd2f9e-b157-4c98-abe4-a398000a1235 after about 17 seconds and recorded no check. Its ignored output is preserved. Refresh software-engineer-toc.md's lock to the checked current section hash, 177890397f045c56ef145ca34029e322932d6064b1e717defeac10b9c8e1971b, and require a new current gate."
  ],
  "rationale": "D001 applies. These are bounded correctness repairs in the announced byte-policy helper and its fixtures, not a broader delegation or budget project. This brings the concrete self-review defect count to eleven, all fixed; the two measured byte overruns are separate operating-cost follow-ups. Preserve stopped gate evidence and check each failed preflight before launching its dependent gate.",
  "rejected": [
    {"option": "Leave allocations advisory without checking target completion", "reason": "The register treats them as closed and no target lifecycle state is consulted."},
    {"option": "Accept a short or partially parsed reference", "reason": "It does not establish that the declared complete public reference resolves."},
    {"option": "Treat the stopped document gate as passed", "reason": "No completion row exists and the publication source lock was stale."}
  ],
  "reopenWhen": "A valid titled decision cannot qualify, a malformed full reference or closed/stale item qualifies, or a current publication/gate check fails."
}
```

## WO-187-D015

```json
{
  "id": "WO-187-D015",
  "date": "2026-10-05",
  "dispatch": "resume: next; document gate repair",
  "decision": "Refresh only the current console self-host fixture through scripts/console-fixtures.mjs --record-current-selfhost. Retain historical source editions, all other recorded cases, and every board assertion.",
  "evidence": [
    "The fresh document gate ended 2026-10-05T22:30:51.801Z: 28 passed, console-docs failed, 758.808 seconds including a build queue behind WO-123's shared host lanes. Release surfaces, docs-check, all current editions and resume passed; the whole gate did not.",
    "The console failures name selfhost.json output drift, fixture observation status unavailable instead of observed, and tester fixture.incidentsPrevented unavailable instead of known. packages/console/fixtures/manifest.json still pins WO-186/feedback-001/feedback.json. packages/console/src/builds.ts recompiles the policy and refuses maturity whose policyHash/fold no longer matches the current compiler.",
    "packages/console/README.md's recorded-fixture procedure and the checked recorder support updating the three current self-host inputs and outputs when the selected edition moves. The recorder reads currentEvidence, follows the carried edition's liveAudit paths, validates every new input hash before replacing the manifest, and writes only selfhost JSON, terminal and HTML.",
    "New named inputs are scripts/console-fixtures.mjs, packages/console/test/fixtures.ts, packages/console/src/builds.ts, packages/console/fixtures/manifest.json and its three selfhost expected outputs. The selected feedback edition is WO-187/feedback-002, whose audit remains carried from WO-184/feedback-003. No new live episode or console behavior change is implied.",
    "The bounded recorder passed in 525 ms, ending 2026-10-05T22:32:07.975Z. Its manifest diff changes the maturity path/ref/hash, two labels and one appended capture sentence; the carried stream paths/hashes and all other cases are unchanged. The five-case JSON/terminal/HTML check passed in 511 ms, and all 27 console document tests passed in 24.608 seconds ending 22:32:59.506Z. The current fixture's known-count and role-answer assertions remain intact. All twelve concrete self-review defects are fixed."
  ],
  "rationale": "D001 applies. The twelfth concrete self-review defect is an unrefreshed current fixture after the required evidence/compiler edition change. A canonical re-recording preserves immutable evidence and verifies the current projection; loosening unavailable-count or byte-equality assertions would hide the mismatch. Required whole gates must still pass at the final code identity.",
  "rejected": [
    {"option": "Rewrite the historical feedback report to match the compiler", "reason": "Historical source editions are immutable."},
    {"option": "Weaken known-count, role-answer or output-equality assertions", "reason": "They expose the fixture's actual unsupported policy fold."},
    {"option": "Regenerate every recorded case", "reason": "Only the current self-host inputs and derived outputs have changed."}
  ],
  "reopenWhen": "The recorder or current console document tests fail, another selected edition moves, or a registered evidence check becomes stale after the fixture update."
}
```

## WO-187-D016 — Keep the planning start bounded without losing counts

```json
{
  "id": "WO-187-D016",
  "date": "2026-10-05",
  "dispatch": "resume: next; full review gate repair",
  "decision": "Keep every planning-start numeric count and the existing 1 KB bound. Retain its actual cutoff and full-feed command, leave the duplicated receipt identity in the full feed's window.opensAt, and shorten only the escape-rate and coverage wording. Update the explicit export-header and start expectations for the new finding counts.",
  "evidence": [
    "The third npm test -- --review run reached plan-refutation: 80 of 83 cases passed. Two existing plan-start cases reported Planning failures: the plan start block exceeds 1 KB; the export-header case reported the added finalReviewFindings field. Canonical evidence --stop ended run 39908edc-4058-4890-916d-576c39416d4f after 796.6 seconds with no check. Runner-fixtures and worktree-integration report stopped by gate request, not independently completed failures.",
    "Named inputs: scripts/lib/plan-failures.mjs, scripts/test-plan-refutation.mjs and scripts/test-verification-review.mjs. The old complete start expectation already occupied almost all of the bound. The new figure is concise but still labels the review denominator, order count, unclassed count and unknown rate with the measured subset. Full structured per-order and last-ten counts and full-feed receipt provenance are unchanged.",
    "The bounded three-case run of WO-178 local counts and both WO-172 plan cases passed 3/3 in 4,143 ms, ending 2026-10-05T22:49:19.404Z. It retains every prior count and the byte bound, verifies the actual unknown historical summary, preserves the complete feed's window.opensAt, and exercises the new export header. No assertion or case is skipped.",
    "The bounded actual-lifecycle fixture passed in 2,601 ms, ending 2026-10-05T22:49:50.145Z, and refreshed review-fixture.json. Its synthetic last-ten figure remains 76 escapes across 11 review attempts on ten distinct orders, with one unclassed finding and every numeric count preserved. This is the thirteenth concrete self-review defect, the oversized startup summary; all thirteen are fixed. A complete current review gate is still required."
  ],
  "rationale": "D001 applies. The useful outcome is a startup summary that the existing CLI can emit, with all required counts and explicit unknown measurement coverage. Retaining source detail in the full feed avoids repeating a long receipt name in the bounded starter. This is a functional output repair, not byte reduction for its own sake or a raised ceiling.",
  "rejected": [
    {"option": "Raise the planning-start bound or drop numeric counts", "reason": "Would weaken the existing output contract or remove the new deliverable."},
    {"option": "Restore the old export shape without finding counts", "reason": "Would erase the required planning input."},
    {"option": "Count the stopped full review as passing", "reason": "It has no passing completion row."}
  ],
  "reopenWhen": "The complete current review fails, any required count or unknown-coverage label disappears, or a startup block again exceeds its existing bound."
}
```

## WO-187-D017 — Record the passing outcome and its limits

```json
{
  "id": "WO-187-D017",
  "date": "2026-10-05",
  "dispatch": "resume: next; executor outcome",
  "decision": "Hand off the completed bounded deliverable for independent verification after the whole product review and document gates pass. Preserve both measured byte overruns as open operating-cost follow-ups and the two required at-close register dispositions.",
  "evidence": [
    "npm test -- --review passed all 38 required suites, 88 fresh tasks, zero failures, in 878,031 ms. Its executed host-gate row records code identity 2454d6d5fc6e129c946f08e4df997e6d821c4685febc907868320353aa7cd210, tree 07518916e6c8c0fde83f5e9f7af260bf6d806b4e and cutoff 2026-10-05T23:05:23.345Z. The complete plan-refutation and runner suites pass, as do worktree integration and all five current evidence preflights.",
    "npm run test:docs passed all 29 fresh required suites, zero failures, in 894,624 ms, at the same code identity and tree, cutoff 2026-10-05T23:21:17.230Z. Its ignored diagnostic log shows build queued behind WO-123's shared host lanes; wall time includes that queue. Earlier stopped/failed runs remain preserved and supply no passing completion row.",
    "The bounded read of failuresAtStart against this actual worktree emitted 963 UTF-8 bytes and retained every count, the real cutoff, unknown historical rate and full-feed command, ending 2026-10-05T23:05:46.350Z. The reused read-only adversary's final static whole-diff recheck found no concrete unresolved defect; no probes, writes, excluded record reads or descendants were added.",
    "All thirteen concrete self-review defects are fixed. cold-start-after.json retains the 531-byte executor overrun in each root; close-register.md retains the guide's 6,016-byte overrun and both existing ceilings. FUP-8ce4b4b0104ba41b and FUP-0a7c93eed06727ce remain open. The import-closure candidate is reopened for planning on its existing FUP-ea936acad1506e18; no missing runtime module was observed.",
    "The staged application release is local v0.66.4, with compiler 0.25.3, skeleton 0.52.4, harness host 0.34.5 and console 0.4.0 with matching internal pins. No new dependency, branch commit or publication. Current source editions and generated outputs are checked; feedback carries the unchanged WO-184/feedback-003 audit."
  ],
  "rationale": "D001's goal and trap comparisons still apply. The executable outcome is the complete review/briefing/counting/worker-pin deliverable, not a claimed reduction in future escaped defects. Future escape rates, worker effective settings and verification cost remain unobserved where their host or lifecycle supplies no readback. Useful instructions remain; byte optimization has explicit follow-ups. NoOp is appropriate for further feature and performance work after the bounded checks pass.",
  "rejected": [
    {
      "option": "Claim a lower future escape rate or isolated speed improvement from these fixtures",
      "reason": "The new live lifecycle has not run, historical counts are unmeasured, and gate wall times include shared-host waiting."
    },
    {
      "option": "Apply the closing register dispositions during executor handoff",
      "reason": "The order requires that write-back at close; current allocations remain live until then."
    }
  ],
  "reopenWhen": "Independent verification or final review finds a consequential issue, an evidence source changes, an allocated target changes at close, or useful byte optimization is ready."
}
```

## WO-187-D018 — Complete the final touching audit

```json
{
  "id": "WO-187-D018",
  "date": "2026-10-05",
  "dispatch": "resume: next; executor completion correction",
  "kind": "correction",
  "misread": "The earlier eighteen-row touching audit was treated as covering the completed diff; a later bounded page was initially requested at guessed offset 16 instead of its returned offset 15.",
  "meant": "The final diff matches twenty-four pending rows, and each page's actual next cursor determines the following offset.",
  "changed": "Stop the unfinished inline document gate, traverse the complete current feed, read the five newly matched deferred dispositions in full, and record their unchanged seams plus the guide's existing open follow-up before retrying completion.",
  "decision": "Keep the five additional historical items deferred on their existing identifiers; preserve the guide's open byte follow-up and all D009 dispositions. Add no feature or register retarget for a textual match.",
  "evidence": [
    "Completion reported 24 matching pending rows. Canonical evidence --stop stopped inline document run 71fe3940-d0a7-4308-ae2b-c7a3ef914524 after about 67 seconds; no check or ImplementationReady event was recorded. Its parent returned exit 1, and the writer remains this session's.",
    "The current touching feed at revision 91d771f316aa53ee5929491c9a924e056c1bc4fd9f887595b74c386964300979 lists 24 matches over 106 changed paths. All rows were read at the returned page offsets 0, 8, 15 and 23. The initial extra request at 16 omitted position 15; rereading the actual 15 cursor recovered FUP-b3454d6ce3594ef3 and the returned 23 cursor completed the feed.",
    "FUP-0a7c93eed06727ce is the guide's already-open D013 byte follow-up. The other five added matches were read with followups --show, including their source revisions and complete latest dispositions.",
    "Leave FUP-b3454d6ce3594ef3 deferred: test-process-debt changes only the linked role-oracle pointer/fixture expectations, not the direction reader or agreement rule. A bounded canonical status lookup of WO-188 reports unknown work order; selectWorkOrder in scripts/lib/control-store.mjs admits explicit closed entries too, so the checked control snapshot has no WO-188 entry or closing event.",
    "Leave FUP-d0a9719cc2e4ec55 deferred: scripts/test-runner.mjs changes only one machinery input declaration, not ancestry or descriptor ownership. The completed gates supply no new retained-descendant escape or unattributed memory incident.",
    "Leave FUP-dc58e92c5cafc732 deferred: the planning-test diff updates the finding-count export and bounded start expectations, not canonical worker context, hashed exclusions or WO-088/WO-089 re-observation.",
    "Leave FUP-e821aa2ced3aa111 deferred: the runner diff adds only the WO-187 oracle input. Reporter selection, deprecated consumer aliases, batch capacity and parser behavior are unchanged; its latest dispositions already distinguish an input-table edit from opening those consumers.",
    "Leave FUP-e8f5399db33d0b5a deferred: resource-stop classification, inherited leases, denial detail, withdrawal failure labels and guard candidate marking are unchanged. The observed host-lane queue names foreign WO-123 tasks, not a nested gate waiting on its own parent.",
    "D009 still judges the original eighteen matches, and D013/D014 judge the new byte row. The fourteen self-review findings now include this stale final touching-audit coverage; all fourteen are addressed. No product source, dependency or code identity changes in this correction."
  ],
  "rationale": "D001 applies. Reconcile a newly observed input before handoff, preserve the valid full product review, and use NoOp for the unchanged historical seams. An advisory is a prompt for source-based judgment, not authority to implement five unrelated projects. The stopped inline gate is preserved and will be rerun at the final document subject.",
  "rejected": [
    {
      "option": "Treat the original eighteen rows as a current complete audit",
      "reason": "The completion's checked feed now contains twenty-four."
    },
    {
      "option": "Use a fixed-size cursor instead of the returned next cursor",
      "reason": "Byte-bounded pages can contain fewer rows than the nominal count."
    },
    {
      "option": "Implement or reopen every textual match",
      "reason": "The newly read historical items' actual seams and lifecycle triggers are unchanged in this diff."
    }
  ],
  "reopenWhen": "A listed seam changes, its recorded trigger is observed, or the final touching feed adds another unjudged row."
}
```

## WO-187-D019 — Verification fails on criteria 2 and 4; five findings go to the repair

```json
{
  "id": "WO-187-D019",
  "date": "2026-10-05",
  "dispatch": "resume: verify (VER-001)",
  "decision": "Fail VER-001 on criteria 2 and 4. F1, F2 and R1-R3 lie in the order's declared surfaces and go to bounded repair through Adjacent Repair, each with the rule its repair must hold. Byte matters are settled within existing authority and are never routed to the operator.",
  "evidence": [
    "F1 (criterion 2): scripts/lib/verification-briefing.mjs starts a Known issues and carry-ins section only at a label that stands alone on its line and ends it at any bold-led line. docs/work-orders/WO-123-vertical-composition.md:466 carries text on the label line, so none of its eight carry-ins is printed and no advisory says so. The executor's lifecycle fixture with only that label changed fails 'verify must print the order's known issues'. The layouts '**Known issues and carry-ins**:', '## Known issues and carry-ins:' and a section opening with a bold-led paragraph also print nothing; a second copy of the section is dropped.",
    "F2 (criterion 4): scripts/lib/review-findings.mjs recognises an F-number only when ':' or a dash follows it. Failed reviews written like WO-100 FINAL-001 ('**F2. Stale version label.**') or WO-164 FINAL-001 ('- **F1, major, criterion 6: ...**'), an ordered-list line ('1. **Finding F1:** ...') and '**Finding F1 (blocking):**' parse zero findings, emit no advisory and would record a measured review with zero escapes. A line that begins with inline triple-backtick code opens a false fence in markdownLines and hides every later finding; the same reader feeds the self-review advisory and the verify briefing. Recap lines ('- F6–F8 and F10 stay repaired', '- F2: VER-001's finding was repaired.') count as findings.",
    "R1: scripts/lib/plan-failures.mjs adds a review-findings failure item for every measured FinalReviewCompleted, including a clean pass whose counts are all zero. A synthetic log of three clean passing reviews yields plan-start items 3 and three review-findings rows while every failure counter reads 0.",
    "R2: product 07 now carries the operator's current headroom direction in §Verification review and attack, while the superseded 2026-09-17 cold-start ceiling route stays unedited in the gate-budget paragraph. The guide therefore gives two incompatible routes for the same case.",
    "R3: the self-review advisory fires although the line is present as '- self-review: ...', '**self-review**: ...' or '> self-review: ...'.",
    "Operator direction during resume: verify on 2026-10-05, paraphrased: byte counts are never brought to the operator; text is either necessary or it is not, and the operator is not asked for input about it. This confirms D013's reading of D003 for product documents. VER-001 judges the advisoryDecision route to be within that direction and raises no operator packet.",
    "Criteria 1, 3, 5, 6, 7 and 8 are met on the evidence VER-001 records. The executor's passing npm test -- --review row matches the current code identity 2454d6d5fc6e129c946f08e4df997e6d821c4685febc907868320353aa7cd210 and was consumed, not rerun."
  ],
  "repairRules": [
    "F1: the verify briefing prints every Known issues and carry-ins section an order holds in each layout above, including text on the label line. A bold-led paragraph inside the section is kept, and the section ends only at the next order field or heading. If a label is recognised but nothing is printed, the briefing advises. Fixtures for the WO-123 layout and each listed layout fail before the repair.",
    "F2: a failed final review whose report yields no recognised finding line gets one advisory, and the review is never recorded as a measured zero-escape review. An ordered-list marker is read like a bullet. A backtick fence opener whose info string contains a backtick is not a fence, in one reader shared by all three consumers. A recap line that only cites an earlier report's finding is not counted. Fixtures for the WO-100 and WO-164 lines and the inline-backtick line fail before the repair.",
    "R1: a final review adds a failure item only when it carries at least one finding, or adds none; per-order counts stay in finalReviewFindings. A fixture of clean passing reviews gives zero items.",
    "R2: product 07 states one route for a ceiling overrun, edited in place where the 2026-09-17 route stands, matching the operator's current direction that necessary text stays and an overrun is a follow-up, never an operator question.",
    "R3: the self-review line is recognised in bullet, blockquote and bold-label forms; a fixture of each form emits no advisory."
  ],
  "rationale": "Correctness over Sycophancy and the order's own objective apply: verification exists to catch, before final review, a fixture that held the corpus's layout constant. That is WO-178's escaped class, and the attack axes name it. All five items lie in declared surfaces and are cheap to repair together. NoOp would let the escape measure undercount silently from its first use. Widening into the boarded D020 items would cost repair time for advisory-only or maintainability gains.",
  "rejected": [
    {
      "option": "Pass and board F1 and F2",
      "reason": "Both are defects in declared surfaces that break their criterion's claim on real-corpus input."
    },
    {
      "option": "Route the document-ceiling advisory to the operator",
      "reason": "During this dispatch the operator directed that byte matters are never put to them."
    },
    {
      "option": "Require every finding wording to classify correctly",
      "reason": "Product 07 counts an ambiguous class as unclassed and advises; this decision only requires that a finding is never silently lost."
    }
  ],
  "reopenWhen": "A repair changes the briefing, finding reader, plan-failures or product 07 surfaces (re-derive criteria 2 and 4 and attack the repair), or a final review classes a finding in these surfaces as an escape."
}
```

## WO-187-D020 — Board the class-label and maintainability follow-ups

```json
{
  "id": "WO-187-D020",
  "date": "2026-10-05",
  "dispatch": "resume: verify (VER-001)",
  "decision": "Board VER-001's low-severity class-label and maintainability items rather than add them to the repair.",
  "evidence": [
    "Class labels: a class followed by its basis without a semicolon ('class: escape.', 'class: escape (inside criterion 2's surface)', 'class: escape — ...', '**class:** escape') counts as unclassed. It is advised only for a blocking finding, so a follow-up finding on a passing review drops out of the escape count silently. Reproduction: VER-001's variant probe over scripts/lib/review-findings.mjs.",
    "Worker pin: the Claude and Codex pins appear as literal role text in packages/skeleton/src/loadouts/contributor.ts and separately as contributorProgram's worker constant. Changing one leaves the other stale while npm run harness -- check stays green.",
    "Naming: dotln-worker is also the Codex read-only permission profile in packages/skeleton/src/worker-transport.ts, and the generated Claude agent sets no tool restriction. The compiler accepts any worker name matching ^[a-z][a-z0-9-]*$, but scripts/lib/harness.mjs admits only dotln-[a-z-]+.",
    "plan failures prints escapes 0 for an order whose reviews are all unmeasured (measured 0). Its rate is null, but the count reads as a measured zero."
  ],
  "rationale": "Product 07 routes maintainability alone to follow-up. The class-label strictness is documented behaviour that advises on blocking findings. None of these items breaks a criterion or loses a record, so a later order can take them with a usefulness comparison.",
  "rejected": [
    {
      "option": "Add these items to the WO-187 repair",
      "reason": "They widen the repair without restoring a criterion; D019's items already cover the defects that lose records."
    }
  ],
  "followup": "Tolerate natural class-label endings in scripts/lib/review-findings.mjs (take the first class token before punctuation, a parenthesis or a dash; read a bold label), with fixtures for each form above. Derive the role text's worker pin from contributorProgram's worker constant so one edit changes both, or have npm run harness -- check compare them. Give the Claude worker type a name distinct from the Codex permission profile, or record why they share it, and align the compiler's worker-name pattern with the installer's. Report escapes as unknown, not 0, for an order with no measured review. Checks: npm run harness -- check, npm test -- --review and npm run test:docs.",
  "reopenWhen": "A final review's escape is lost to a class-label ending, the role text and generated worker pin disagree, or the worker name changes."
}
```

## WO-187-D021 — Board an intermittent off-ramps fixture failure

```json
{
  "id": "WO-187-D021",
  "date": "2026-10-05",
  "dispatch": "resume: verify (VER-001 completion)",
  "decision": "Board an intermittent failure of the resume document suite in scripts/test-off-ramps.mjs, observed once by the verification-result completion's inline npm run test:docs, with its cause unknown.",
  "evidence": [
    "The first verification-result fail attempt ran the inline document gate and refused: 28 passed, 1 failed (resume, 6.78 s), 93.12 s. Its check output failed at scripts/test-off-ramps.mjs:787 on the refusal of 'correct 2 --set checkpointRef=refs/dotln/checkpoint/WO-099/1 --set checkpointSha=000…'. It expected /checkpoint refs\\/dotln\\/checkpoint\\/WO-099\\/1 resolves to [0-9a-f]+, not 0{40}/ and received 'correct refused: ordinal 2 already records checkpointRef refs/dotln/checkpoint/WO-099/1'. In that run, the fixture's event 2 carried the checkpoint number the test expects of event 1.",
    "The same suite passed in a standalone npm run test:docs at 2026-10-05T23:51:17.312Z (29/29) and in the retried completion's inline run (29/29, 70.18 s), with no source change between the runs. WO-187 does not change scripts/test-off-ramps.mjs, the correct off-ramp or checkpoint creation.",
    "The cause is unknown. Not tried: repeated isolated runs of the off-ramps fixture or inspecting checkpoint numbering in its temporary repository."
  ],
  "rationale": "The failure sits outside WO-187's criteria and surfaces, so it is boarded with its reproduction. It cost one refused completion and another gate run, and a recurrence would refuse other completions the same way.",
  "rejected": [
    {
      "option": "Treat the refused run as evidence against WO-187",
      "reason": "The subject was unchanged between the failing run and two passing ones, and the failing file is outside the order."
    },
    {
      "option": "Ignore the observation",
      "reason": "An unexplained gate failure that refuses lifecycle completions should be investigated."
    }
  ],
  "followup": "Find why scripts/test-off-ramps.mjs's checkpoint correction case (around line 787) can see event 2 carrying refs/dotln/checkpoint/WO-099/1. Run the off-ramps fixture repeatedly in isolation and in parallel with the other document suites, record the checkpoint refs and events, and fix the cause or make the assertion name the checkpoint actually recorded. Checks: node scripts/test-off-ramps.mjs <root> repeated, and npm run test:docs.",
  "reopenWhen": "The resume document suite fails again on this assertion, or a repeated isolated run reproduces it."
}
```

## WO-187-D022 — Repair VER-001's five findings by the rule each must hold

```json
{
  "id": "WO-187-D022",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-001)",
  "decision": "Repair F1, F2 and R1-R3 under D019's rules in the declared surfaces. Each repair states the rule the code now holds, and adds cases VER-001 did not quote.",
  "evidence": [
    "F1 rule: scripts/lib/verification-briefing.mjs prints every Known issues and carry-ins section of the order. The label may be bold with the colon inside or outside, or a heading of any level with or without a colon. It may carry a parenthetical and text on its own line. A section runs to the next heading (for a heading label, one at its own level or above) or the next order field, a bold label from the order format's field list. A bold label outside that list is a paragraph of the section and is kept. An empty section prints an advisory naming its line. Over the real corpus the briefing prints 15 of 15 sections, WO-123's included (50 lines, ending before its Non-goals).",
    "F2 rule: scripts/lib/review-findings.mjs reads a label F<n> or Finding F<n> after any blockquote, bulleted or ordered list, or heading marker and any emphasis, with an optional parenthetical, ended by ':', ',', '.' (not F1.2), a spaced dash or the line's end. The label counts when it gives its own route (the first word after it or in its parenthetical) or a class; on a failed review an older form without either counts too. A recap never counts: a label naming a second finding, or one citing another report (VER-/FINAL-) in its parenthetical or as its first word, without a class. A fence opens behind a blockquote or list marker too, and a backtick opener whose info string holds a backtick opens none; the briefing, the handoff ledger and the finding reader share that reader. Counts that cannot be complete are unmeasured: scripts/resume.mjs records no findingCounts, with an advisory, for a failed review with no counted finding or for any uncounted line naming a route and a class outside inline code. An identifier counts once (F01 is F1); identical class labels are that class. Over the 166 real FINAL reports, the one failed review with no F-numbered finding (WO-178 FINAL-001, prose only) would record unmeasured with an advisory, never a measured zero; the passing re-reviews WO-139 FINAL-002, WO-144 FINAL-002 and WO-172 FINAL-001 count 0 findings.",
    "R1 rule: scripts/lib/plan-failures.mjs adds a review-findings item only for a measured review with at least one finding; per-order counts stay in finalReviewFindings. R2 rule: product 07 states one cold-start ceiling route, edited in place where the 2026-09-17 route stood: a needed rule stays whole, the overrun is boarded, no ceiling is raised or accepted, and no byte count goes to the operator. The REVIEW-002 sentence that reserved the ceiling route for the operator's own pass was a second place with the old route; it is edited too. R3 rule: scripts/lib/handoff-ledger.mjs recognises self-review after the same list, ordered-list and blockquote markers, in plain, bold-label and bold-then-colon forms, in any case.",
    "Cases VER-001 did not quote: F1 parenthetical label, a deeper heading kept inside a heading section, an unlisted bold label kept, and the empty-section advisory. F2 blockquote and spaced-dash-after-emphasis labels, a two-finding label carrying a class, and a classed R1 line advised. R3 ordered-list and nested quote-and-bullet forms. R1 a review holding only an unclassed finding still adds an item. R2 the REVIEW-002 reservation sentence.",
    "repair-001-cases.json: all 22 new unit cases fail against refs/dotln/checkpoint/WO-187/5's scripts and pass at the repair. scripts/test-verification-review.mjs passes at the repair (3.6 s under harness bounded) and, run with checkpoint 5's scripts, fails at its first new assertion ('the second section prints'). The lifecycle now records a failed review with no finding line as unmeasured, and asserts that the recent rate becomes unknown rather than a lower measured rate.",
    "npm run publication:check first reported software-engineer-toc.md stale after the product 07 edits; its entry 15 prose does not describe the changed text, so only its lock was refreshed, after each product 07 edit, to the checked current hash (last 799e1c463cb67848df830884455252044d34bd7dc372fefb7b4cf4ea1d27010f). node scripts/docs-check.mjs passes with product 07 6,958 bytes over its ceiling, up from 6,016 at implementation-ready, after both repair rounds, under D013's follow-up FUP-0a7c93eed06727ce.",
    "Release: the repair changes only application scripts and documents that the prepared v0.66.4 already covers. npm run release -- check-surfaces --local passes. Local tags now include v0.67.0 from main; the resulting version collision is final review's integration bookkeeping (product 07 §Independent workflows and integration), so release prepare is not rerun here.",
    "Economy: the order's one experiment decision (D002, kind experiment, kept-current) stands; per role text no second experiment is started in this repair."
  ],
  "rationale": "Mission and critical path: the escape count and the briefing are this order's measure and its verifier input; silent loss in either defeats the order. Fixes that fail: each rule closes its class over the real corpus, not only the quoted lines. Shifting the burden: counts stay recorded at lifecycle time, with no planning-time reparse. Drift to low performance: an unmeasured review makes the rate unknown instead of lowering it. Escalation: every new signal is an advisory, never a refusal. Policy resistance, tragedy of the commons and success to the successful: the change adds no gate, agent, phase or authority. Rule beating: the reader accepts the corpus's layouts instead of requiring authors to match a fixture. Naive Interventionism: D020's class-label strictness and maintainability items stay boarded, not folded in. NoOp leaves criteria 2 and 4 unmet.",
  "rejected": [
    {"option": "Recognise any bold label inside a Known issues section as the next field", "reason": "That is the defect: a bold-led carry-in paragraph ended the section and printed nothing."},
    {"option": "Count table rows and every line mentioning an F-number", "reason": "The corpus uses table rows and prose for probes and recaps; counting them inflates the measure. A classed line that is not counted is advised instead."},
    {"option": "Record zero counts with a flag for a failed review with no finding", "reason": "Readers already treat absent counts as unmeasured; a zero with a flag invites the measured-zero misreading D019 forbids."},
    {"option": "Rerun release prepare --local against v0.67.0", "reason": "Would replan versions for a collision that final review's integration records."}
  ],
  "reopenWhen": "A real order's Known issues section uses a field label outside the list or a layout the briefing does not print; a final review's finding is counted wrongly or lost without an advisory; a clean review appears as a failure item; or product 07 states a second ceiling route."
}
```

## WO-187-D023 — Guard the Beacon portability fixture against Git's detached repack and board the sweep

```json
{
  "id": "WO-187-D023",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-001); Adjacent Repair",
  "decision": "Set maintenance.auto=false in scripts/test-beacon-portability.mjs's fixture repository, the guard other fixtures already carry, and board the sweep of the other fixtures that commit and then remove a temporary repository without it.",
  "evidence": [
    "The repair's first npm test -- --review run (2026-10-06T00:26:09Z, 880.12 s, 88 fresh tasks) passed 37 suites and failed beacon-portability in its after hook: rmSync ENOTEMPTY on the fixture's temporary directory. The test body passed.",
    "In isolation the suite failed 3 of 6 runs at the repaired worktree, and 2 of 6 with refs/dotln/checkpoint/WO-187/5's scripts/ (which carried this repair's new test file). Every leftover directory held only .git/objects/info/packs, and one also held .git/info/refs naming refs/heads/main: update-server-info output, which a repack writes.",
    "scripts/test-runner.test.mjs and scripts/probes/gate-sandbox-race record the cause: Git 2.55 estimates loose objects from objects/17 alone, and two there start a detached automatic repack. The fixture commits a copy of scripts/ and packages/beacons; that copy's object hashes follow its content, so this repair's script changes moved two objects into objects/17. A manual commit of the same 235 files showed 2 objects there. The executor's and verifier's earlier passes ran on other content.",
    "With the guard the suite passed 12 of 12 consecutive runs (run directly with node --test, not under harness bounded).",
    "A coarse scan finds 22 other test files that create a temporary repository, commit and remove it without maintenance.auto: test-configuration-root, test-derived-orders, test-docs-check, test-entropy-review, test-host-guard.test, test-harness, test-license-surfaces, test-portfolio, test-plan-refutation, test-release-preparation, test-release-fixtures, test-process-debt, test-target-harness, test-resident-bind and test-target-publish under scripts/, and console collect.test.ts and six skeleton test files. Which of them remove the repository while a repack can still write is unmeasured."
  ],
  "rationale": "The failing suite blocked criterion 8's gate, and its cause and fix were known and one line, inside the boy-scout bound. Fixes that fail: retrying until the race passes would leave a green row over a live race. Sweeping 22 files would widen the repair's diff beyond D019's surfaces for an unmeasured risk, so it is boarded with its cause and check.",
  "rejected": [
    {"option": "Rerun the gate until beacon-portability passes", "reason": "Hides a reproduced race behind a passing row."},
    {"option": "Guard all 22 candidate fixtures in this repair", "reason": "Unmeasured per file; it widens the repair diff well beyond the findings it answers."}
  ],
  "followup": "Set maintenance.auto=false (git config in the fixture repository, or -c maintenance.auto=false on clone) in every test fixture that commits to a temporary Git repository and later removes it, beginning with the 22 files named in WO-187-D023. Measure first with scripts/probes/gate-sandbox-race's planted objects/17 method where a fixture's teardown can overlap a repack. Checks: each changed suite run repeatedly in isolation, then npm test -- --review and npm run test:docs.",
  "reopenWhen": "beacon-portability fails again on ENOTEMPTY, or another suite's teardown fails with a leftover objects/info/packs or info/refs."
}
```

## WO-187-D024 — Fix the repair's self-review findings and board the two left

```json
{
  "id": "WO-187-D024",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-001); executor self-review",
  "decision": "Fix ten of the fresh adversary's twelve items in the repair diff; board the class-value forms with D020's follow-up and the bold-label-then-subheading briefing case.",
  "evidence": [
    "One fresh dotln-worker (Claude Code, launched by type with no model override; the host reported no worker model or effort) read only the order and the repair diff against refs/dotln/checkpoint/WO-187/5, ran bounded probes in session scratch and wrote no repository file. It reported 1 blocking defect, 7 should-fix items and nits: 12 numbered items.",
    "Fixed and reproduced in scripts/test-verification-review.mjs: (1) a fence behind a blockquote or list marker counted its example, because lineLabel removed the quote marker before a fence was seen (introduced by the first repair round); (2, 3) passing re-review recaps and recaps naming a route counted; (5) a pass, or a fail with one counted finding, recorded measured counts beside an uncounted classed line; (6) not blocking read as blocking; (7) cubic backtracking and an uncounted line on a U+2028 or lone CR (3,948 ms at 1,600 spaces in the adversary's probe; under 1 s at 25,600 now, asserted); (8) product 07 now states the label endings, route rule, recap rule, unmeasured cases and the heading-section depth exactly; (10) a label line closed by ** printed the **; (11) an empty **self-review:** and a self-review line only inside a quoted fence counted as present; (12) F01 and F1, F1.2 prose, and identical class labels. A bulleted or otherwise unread 'Known issues' layout now advises; it prints nothing in the corpus.",
    "Not fixed: (4) class values ended by punctuation or written as **class:** escape, `class: escape` or (blocking, class: escape) parse as unclassed on a counted line. That is D020's boarded item (FUP-82e9f0bda503c40c); this round makes the uncounted-line check consistent and leaves the counted-line parse as D020 routed it. (9) a bold Known issues label followed directly by a sub-heading advises 'holds no text' while a carry-in sits under that heading; D019's rule ends a bold-label section at any heading, so the advisory names the case.",
    "Residual, recorded: WO-065 FINAL-001's nested recap '- F1, blocking criterion 1: ...' still counts on that passing review, because its first word is a route. Historical events are never re-read.",
    "The 22 VER-001 cases still fail at checkpoint 5 and pass after this round (repair-001-cases.json)."
  ],
  "rationale": "The blocking item corrupted the escape measure and was introduced by the repair, so it was fixed with the shared fence rule. Each should-fix item either lost or invented a finding in the declared reader. Naive Interventionism: the class-value parse stays where the verifier boarded it rather than widening this repair.",
  "rejected": [
    {"option": "Unify the class parse now with one regex taking distinct class words", "reason": "It reclassifies forms D020 boarded and would read 'escape integration' as escape; D020's follow-up owns that design."},
    {"option": "Count every label line on a passing review", "reason": "Re-review recaps in the corpus would add failure items to clean reviews, the defect R1 removed."}
  ],
  "followup": "In scripts/lib/review-findings.mjs, read a counted line's class value as D020's follow-up (FUP-82e9f0bda503c40c) describes, adding the forms `class: escape` in inline code and (blocking, class: escape) inside a parenthetical. In scripts/lib/verification-briefing.mjs, decide whether a bold Known issues label followed directly by a sub-heading should keep that sub-heading's text; today it advises that the section holds no text. Checks: scripts/test-verification-review.mjs with a fixture per form, npm test -- --review and npm run test:docs.",
  "reopenWhen": "A final review's escape is counted unclassed through one of these class forms, or an order writes carry-ins under a sub-heading of a bold Known issues label."
}
```

## WO-187-D025 — Re-verification reproduces incomplete measurements and a briefing formatting defect

```json
{
  "id": "WO-187-D025",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-002)",
  "decision": "Fail VER-002 on criteria 2 and 4. F1 and F2 are medium-severity defects in the repaired shared line reader and completeness detector; R1 is a low-severity briefing presentation defect within the same declared surface. Return all three to the order's bounded repair, preserving report recording and the existing class-value follow-ups.",
  "evidence": [
    "verification-002/container-fence.json: a FinalReviewCompleted fixture run from its docs subdirectory records escape 0 and integration 1, with no count advisory, although the report has one of each. A quoted fenced example ends at its containing blockquote's boundary, but markdownLines keeps its fence globally. The same probe loses a subsequent Known issues section without an advisory and advises that a present self-review line is missing. CommonMark 0.31.2 section 4.5, example 128 (https://spec.commonmark.org/0.31.2/#example-128), checked 2026-10-06, explicitly renders the subsequent unquoted paragraph outside that fence.",
    "verification-002/unrecognised-findings.json: an R1-labelled follow-up with plain class: escape records unmeasured with an advisory; the same line with a backticked escape value records measured zero with no count advisory. A failed review with a counted F1 and an R1-labelled blocking finding whose class is typo or escape2 records only F1 as a complete measurement. The detector removes inline values and only admits valid class words, so the unknown word evades its completeness fallback. A canonical F1 with class: typo still records unclassed with its advisory.",
    "verification-002/additional-cases.json: a normally closed Known issues label followed by Investigate **critical failure** or its underscore equivalent loses the issue body's final emphasis delimiter. The whole-line-label form Known issues and carry-ins: none still needs its own closing delimiter removed; the repair must distinguish those two positions.",
    "One fresh Codex adversary, fork_turns none, launch selection gpt-6.1-sol/max, read only the work order and authored diff. It independently identified F1, F2 and R1. Root reproduced every correctness finding and owns the verdict; the host supplied no independent worker model or effort readback. One worker, zero descendants, cap 20.",
    "The current code identity ba8910f12fa25c7ebb8320f5dfd8080e2214ebac74325f50258a8a0b0e290983 matches the executor's forced-fresh review gate (38 suites, 88 tasks, exit 0, 874944 ms, recorded 2026-10-06T00:59:17.329Z). The row was consumed. The current lifecycle fixture passes and fails at the required known-issue assertion against 08845c71; harness check passes 33 generated surfaces; all twelve role-byte measurements match their current bytes; both diff checks are clean.",
    "Probe correction: ver002-additional.mjs initially assumed evidence.gateClaims.documentGate and failed before recording its output. scripts/resume.mjs completionHandoff at lines 1084-1090 puts documentGate directly on evidence. The scratch probe was corrected and rerun successfully; this was an evidence-lookup error, not a product finding. The repaired subject's document gate is recorded at 2026-10-06T01:01:35.742Z, exit 0, 72562 ms."
  ],
  "repairRules": [
    "F1: preserve fence container boundaries, or report uncertain parsing as incomplete; never hide a subsequent real top-level finding or carry-in as fenced text with a complete measurement or silent empty briefing. Keep quoted/list examples excluded and present self-review lines readable. Add before/after cases for the quoted-container end and exercise all three consumers, including final-review-result and a nested working directory.",
    "F2: an uncounted line naming a route and class field makes counts unmeasured with an advisory even when its value is unknown, a vocabulary suffix, or a supported backticked value. Preserve exclusion of actual inline-code examples, canonical unclassed behavior, no-result-refusal behavior and the current recorded-count interface. Add lifecycle cases with a pass and with a failed review that already contains one counted finding.",
    "R1: strip a delimiter belonging to a whole-line label without stripping emphasis that belongs to an already separated issue body. Add bold and underscore same-line-body cases, retaining the existing whole-line-label case."
  ],
  "rationale": "Mission and critical path: verification and the source-to-deliverable loop need truthful inputs and a trustworthy escape measure before final acceptance. Policy resistance and fixes that fail: the shared reader's repair must hold for all three consumers. Commons: consume the existing 875-second product result; use bounded serial probes and one adversary. Drift and rule beating: an incomplete count must never become a reassuring measured zero. Escalation and shifting the burden: repair within this order, keep advisories and legal recording, add no phase or operator routing. Success to the successful: compare a bounded container-aware reader and shared class-field detection with the current two interpretations; do not require a new dependency. Seeking the wrong goal: passing fixtures are evidence for their inputs, not proof of a complete measure. Naive Interventionism: preserve the existing canonical finding classes, generated pin, historical events and deferred class-value work; change only the reproduced gaps. NoOp leaves declared inputs and the order's measure silently incomplete.",
  "rejected": [
    {"option": "Pass because the repaired fixtures and product gate are green", "reason": "Fresh lifecycle probes reproduce silent loss in the declared surfaces at the matching code identity."},
    {"option": "Require a new report or refuse completion for unsupported class spelling", "reason": "The order explicitly keeps result recording independent of finding classes; incomplete counts can be advised and unmeasured."},
    {"option": "Implement the repairs in the verifier session", "reason": "The verifier records findings and evidence; a fresh executor repairs the subject and another verification judges it."},
    {"option": "Expand the repair into a complete Markdown implementation or worker-interface redesign", "reason": "These probes establish bounded container and completeness defects; the fixed worker pin works and its naming/maintainability concerns remain D020's recorded follow-up."}
  ],
  "followup": "Repair WO-187 VER-002 F1, F2 and R1 under the three rules above in scripts/lib/review-findings.mjs, scripts/lib/verification-briefing.mjs and their existing lifecycle fixture; cover the shared handoff reader without adding a refusal. Use verification-002/container-fence.json, unrecognised-findings.json and additional-cases.json as reproductions. Run the affected fixtures, npm test -- --review and npm run test:docs, record repair-complete, and obtain fresh independent verification. The verdict remains failed until those bounded defects are judged repaired.",
  "reopenWhen": "A repair touches these readers or their consumers, a classed line or post-container finding still disappears without an incomplete-measurement advisory, or an ordinary carry-in body's markup is changed by label cleanup."
}
```

## WO-187-D026 — Repair container boundaries and incomplete finding measurements

```json
{
  "id": "WO-187-D026",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002)",
  "decision": "Repair VER-002 F1 and F2 in the shared line reader and finding completeness detector, then its queued R1 formatting defect in the same declared briefing surface. Preserve canonical classification and advisory-only result recording.",
  "evidence": [
    "Canonical status selected WO-187 needs-fix and VER-002; npm run resume -- fix recorded RepairRequested and reserved the sole writer for this Codex session, gpt-6.1-sol/max, CLI 0.160.1.",
    "The current markdownLines strips CONTAINER before keeping a global fence. CommonMark 0.31.2 section 4.5 and example 128, checked directly, end an unclosed fence at its enclosing quote or list item's boundary. All three consumers share this reader.",
    "The current unrecognised-line fallback removes inline code and requires one of three valid class values; this contradicts D022's rule for any uncounted route/class field. VER-002 supplies pass and partially-counted fail lifecycle reproductions.",
    "verificationKnownIssues removes any final emphasis delimiter from a same-line body, even when the label already closed its own delimiter. R1's queue item records that cause and bounded fix.",
    "D002 is the order's one economy experiment; it remains kept-current and no second experiment is started. One read-only order-and-diff adversary, no descendants, is planned against the current session's cap of 20; the root remains the sole writer."
  ],
  "rationale": "D025's mission and eight-trap comparison apply with the same scope: truthful verifier input and escape measurements enable independent acceptance of the source-to-deliverable loop. Fixes that fail requires exercising all three shared consumers and nested cwd. Commons favors bounded serial probes and one worker; drift and rule beating forbid complete-looking partial counts. Escalation and shifting the burden favor advisories and existing transitions. Success to the successful compares a small container stack with a full Markdown dependency; seeking the wrong goal judges behavior before green fixtures. Naive Interventionism preserves deferred counted-class syntax, generated pins, history and publication controls. NoOp retains two unmet criteria.",
  "rejected": [
    {"option": "Only reset fences when a blank line follows a quote", "reason": "Quote/list and nested boundaries can end without that exact layout; the container itself must govern continuation."},
    {"option": "Add a full Markdown dependency", "reason": "A bounded container reader satisfies the declared examples without widening dependencies or claiming full Markdown conformance."},
    {"option": "Accept only valid class words in the completeness detector", "reason": "Unknown and empty values still declare a finding that the measurement did not count."},
    {"option": "Retarget the staged release during this repair", "reason": "The application scripts remain covered by the prepared patch; the sibling version collision belongs to final-review integration."}
  ],
  "reopenWhen": "A supported container boundary still hides post-container content; any uncounted route/class field disappears as a complete measurement; label cleanup changes separate body emphasis; or focused/regression evidence disproves the bounded reader contract."
}
```

## WO-187-D027 — Correct probe preparation and the new scanner's performance regression

```json
{
  "id": "WO-187-D027",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002); evidence correction",
  "decision": "Use the checked physical session-scratch path for the fixture and expand tabs by scanning their positions instead of a repeatedly failing regex. Retain the existing timing assertion unchanged.",
  "evidence": [
    "The first bounded fixture invocation exited 1 before product behavior at test-verification-review.mjs:27, realpathSync(parent) === parent. A direct realpathSync read showed /var resolves to /private/var on this host; the physical path was used thereafter.",
    "The physical-path run against the unchanged readers exited 1 at the lifecycle assertion for the F4/F5 advisory: actual 0, expected 1, 1.437 s, cutoff 2026-10-06T01:22:22.309Z. Their post-quote lines were swallowed by the global fence.",
    "The first container-stack implementation passed the new boundary and completeness cases but failed the existing 25,600-space timing assertion, exit 1 after 5.195 s, cutoff 2026-10-06T01:23:03.261Z. Its blockLine regex [^\\t]*\\t repeatedly searched a line with no tab; that was a regression introduced in this repair.",
    "After replacing that regex with a scan over tab positions, the unchanged timing assertion and all expanded lifecycle cases passed under harness bounded: exit 0, 7.817 s, cutoff 2026-10-06T01:23:23.205Z.",
    "repair-002-r1-before.json records the next red fixture: case 910 prints Investigate **critical failure without its closing delimiter, exit 1, 3.833 s, cutoff 2026-10-06T01:24:06.537Z."
  ],
  "rationale": "D026's comparison applies. Executed failures distinguish a fixture-preparation error from a product defect and an implementation regression. Raising the timing bound would hide the regression instead of repairing it.",
  "rejected": [{"option": "Increase or remove the timing bound", "reason": "The old reader met it; the new preprocessing caused the regression."}],
  "reopenWhen": "The unchanged long-line assertion fails, physical-path validation fails again, or a claimed red/green result lacks an executed source."
}
```

## WO-187-D028 — Close the five independently reproduced self-review findings

```json
{
  "id": "WO-187-D028",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002); fresh executor adversary",
  "decision": "Fix all five fresh adversary findings in the same declared readers. Keep a single shared block/example interpretation, distinguish semantic code-formatted metadata from complete examples, and preserve the original carry-in text.",
  "evidence": [
    "One Codex worker, fork_turns none, gpt-6.1-sol/max, read only the original order and repair diff against checkpoint 8. It performed a static review, made no writes or probes and launched no descendants. The host exposed no separate effective-model/effort readback. The root reproduced each finding before choosing a repair.",
    "The bounded empty-item probe (cutoff 2026-10-06T01:27:44.140Z) recorded integration 1, escape 0, measured true for both '-' and '1.' followed by an indented fence and a real dedented F2. Their containing list items were never established.",
    "repair-002-adversary-before.json: the code-formatted blocking route loses the incomplete signal; a multiline inline-code example adds a false escape; '* * *' creates phantom list containers and adds another false escape; a list-then-quote Known issues label prints neither text nor the unsupported-layout advisory. All four reproduced at cutoff 2026-10-06T01:31:27.689Z.",
    "CommonMark 0.31.2 sections 4.1, 5.2 and 6.1, checked directly: thematic breaks take priority over list markers; blank-started items use marker width plus one and cannot begin with a second blank line or interrupt a paragraph; code spans can cross physical lines within their block. Public source: https://spec.commonmark.org/0.31.2/.",
    "The additional cases cover all three consumers, empty and ordered items, trailing spaces, thematic breaks, single/double backtick route/field tokens, multiline code examples and genuine block boundaries. They preserve the original timing assertion and canonical class-value behavior."
  ],
  "rationale": "D026's mission and trap comparison still holds. These findings corrupt the same measure or hide the same verifier input; leaving them as prose would shift rescue to the next verifier. A shared example projection prevents three readers from disagreeing, while retaining source text for briefing display. The bounded implementation introduces no dependency, phase, refusal or additional worker. The counted-class syntax deferred in D020 remains unchanged; a full Markdown conformance claim is still out of scope.",
  "rejected": [
    {"option": "Treat a formatted route token as a complete code example", "reason": "The canonical route reader already permits that formatting; erasing it falsely declares partial counts complete."},
    {"option": "Fix only the finding reader's multiline example", "reason": "The shared handoff and carry-in readers can recognize the same fake labels; use one example projection while preserving displayed source text."},
    {"option": "Board these five reproduced cases", "reason": "Their concrete bounded fixes are inside the declared readers and the current repair rules."}
  ],
  "reopenWhen": "An empty-item or thematic-break path changes fence lifetime, a genuine inline example is counted or hides another block, metadata formatting defeats completeness, or a nested unsupported carry-in label disappears without an advisory."
}
```

## WO-187-D029 — Validate the completed reader repairs and correct an invalid fixture

```json
{
  "id": "WO-187-D029",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002); validation",
  "decision": "Retain all five self-review fixes, correct the handoff fixture's block boundary, and carry the existing generated-role, release and byte evidence without changing those surfaces.",
  "evidence": [
    "The first self-review fixture run failed the new empty-item handoff case at cutoff 2026-10-06T01:33:03.916Z. I had placed '-' directly after the criterion paragraph, so it could not establish an empty list item under the checked rule. I added the missing blank separator to the fixture instead of weakening that rule; a separate no-separator control keeps the subsequent root fence open.",
    "repair-002-self-review-fixture.json: all expanded reader and lifecycle cases pass after that correction, exit 0, 8.109 s, cutoff 2026-10-06T01:33:37.950Z. This includes all five adversary findings, genuine block boundaries, inline examples in the handoff and briefing, and the unchanged long-line timing check.",
    "repair-002-baseline.json: the same executable fixture against 08845c71:scripts/resume.mjs exits 1 at verify must print the order's known issues, 0.935 s, cutoff 2026-10-06T01:33:50.194Z. The source selection, rather than an unrelated new assertion, establishes the original baseline failure.",
    "The bounded harness check passed all 33 generated surfaces at cutoff 2026-10-06T01:25:37.335Z. No compiler, role or generated root changed from checkpoint 8, so D005's twelve before/after byte measurements and worker-pin-probe.json stand. harness-context --check confirms the same executor 29,777 bytes and 531-byte overrun; the existing follow-up remains its disposition.",
    "The bounded release check passed at cutoff 2026-10-06T01:26:39.546Z: prepared application v0.66.4, compiler 0.25.3 and skeleton 0.52.4 satisfy the branch's ancestry baseline; all publication controls remain in place. The manifests and lockfile have no diff from checkpoint 8. A sibling's later version is still final-review integration bookkeeping, as D026 records. No new in-worktree scratch repository was created; all direct fixture repositories are owned session-scratch material outside the worktree."
  ],
  "rationale": "D026 and D028 apply. Executable evidence supports the repaired behavior; it does not prove full Markdown conformance or a future reduction in late escapes. A source fixture that violates its own block rule must be corrected rather than used to overrule the implementation. The order's one economy experiment remains D002.",
  "rejected": [{"option": "Allow an empty item to interrupt the preceding criterion paragraph to satisfy the fixture", "reason": "Contradicts the checked syntax and turns a valid root fence into another phantom container."}],
  "reopenWhen": "A fresh verification or gate disproves a repaired rule, generated bytes change, the release classification changes, or a new fixture depends on an unsupported Markdown construct."
}
```

## WO-187-D030 — Preserve Unicode text and paragraph continuations; retain the boarded class syntax

```json
{
  "id": "WO-187-D030",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002); final executor self-review",
  "decision": "Fix the reused adversary's Unicode masking and lazy-paragraph cases, and record its counted code-formatted class-field case with D020's existing class-label follow-up. Narrow the product wording to the incomplete-measurement detector instead of promising a new counted-class grammar.",
  "evidence": [
    "The same read-only order-and-diff worker statically reassessed the final diff, judged the first five cases addressed, and reported three more. That worker ran no probes, made no writes, read only the order and diff, and launched no descendants. No second worker was admitted. The root independently reproduced each remaining behavior.",
    "repair-002-unicode-before.json: a same-line carry-in beginning Investigate with three emoji inside an inline example printed vestigate and lost its closing body emphasis, exit 1, 4.166 s, cutoff 2026-10-06T01:37:38.198Z. The new Unicode-aware replacement shortened UTF-16 captures before the briefing sliced its source. Masking one code unit per space restores both the original body and label-delimiter decision.",
    "repair-002-lazy-before.json: a quoted multiline inline example whose finding line omitted the quote marker counted a false escape, exit 1, 1.523 s, cutoff 2026-10-06T01:39:17.945Z. CommonMark 0.31.2 sections 5.1 and 5.2, checked directly, permit lazy paragraph continuation through missing quote markers or list indentation, while fenced blocks cannot continue that way. Public source: https://spec.commonmark.org/0.31.2/#block-quotes.",
    "The shared block reader now retains containers for paragraph continuation, while blank lines, headings, thematic breaks, new items and valid fences end that continuation. Added finding, handoff and carry-in cases cover lazy quotes, nested quotes and lists; Setext headings also separate the projected paragraph. Existing post-container fence cases and the unchanged timing assertion still pass.",
    "repair-002-counted-field.json: a valid F1 with code-formatted blocking and class field counts as unclassed with F1 in unclassedBlocking, measured true, cutoff 2026-10-06T01:40:24.658Z. This is the already-boarded counted-class formatting family (D020, FUP-82e9f0bda503c40c); it is not a silently uncounted finding. The added control retains that behavior. Product 07 now states that metadata normalization is for detecting incomplete measurements and counted class syntax remains unchanged.",
    "repair-002-final-fixture.json: the final expanded executable fixture passes, exit 0, 8.430 s, cutoff 2026-10-06T01:40:47.321Z. Across the worker's two static passes, eight findings were judged: seven fixed and one recorded with the existing follow-up. D002 remains the order's sole economy experiment.",
    "The checked current software-engineer source lock is cc27778a2eb2ad2c56397445461191852541ef4b23e30c4c8b95c0cf8554e344. Only that lock changes; the edition's existing prose still describes the source section."
  ],
  "rationale": "D026's mission and trap comparison apply to the newly reproduced evidence. Fixes that fail requires retaining the Unicode offsets and distinguishing paragraph continuation from a fence's boundary. Shared interpretation avoids shifting rescue to the next verifier. Scope discipline and Naive Interventionism preserve D020's counted-class grammar decision; correcting the broad new wording keeps the claim bounded. NoOp leaves two introduced defects. No full Markdown conformance or future escape-rate improvement is claimed.",
  "rejected": [
    {"option": "Normalize all counted class values while repairing incomplete measurements", "reason": "Changes the explicitly boarded syntax and the established unclassed/advisory behavior without restoring a failed criterion."},
    {"option": "Keep the missing-quote rule identical for paragraphs and fenced blocks", "reason": "The executable example and checked syntax distinguish their continuation rules."}
  ],
  "reopenWhen": "A projected offset truncates original issue text, a lazy paragraph example counts a finding or self-review line, a real post-container fence line disappears, or the class-syntax follow-up is selected."
}
```

## WO-187-D031 — Hand off the bounded repairs on current executable evidence

```json
{
  "id": "WO-187-D031",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-002); executor handoff",
  "decision": "Hand off VER-002 F1, F2 and R1 as repaired, consume the current forced-fresh review row, and run the document gate once through repair-complete. Preserve the existing follow-ups, release classification and separate independent-verification dispatch.",
  "evidence": [
    "repair-002-review-gate.json binds the successful npm test -- --review run to code identity 9408c8dcb05cbb5c39324fbe74f725522f39a7adf357d3b2e4c0435d74aac6a6. It passed all 38 required suites with no failed case, 88 fresh tasks and no reused tasks, 885.916 s, recorded 2026-10-06T01:56:17.134Z. Code identity and build output stayed unchanged. The canonical evidence wait exited 0, and no gate remained active before report writes.",
    "The final focused fixture passes at 2026-10-06T01:40:47.321Z (8.430 s). The required historical baseline failure is retained in repair-002-baseline.json. Container fences, empty items, multiline examples, lazy paragraph continuation, incomplete pass and partially-counted fail recording, nested cwd, separate body emphasis and Unicode offsets all have executed evidence. No full Markdown conformance is claimed.",
    "The sole read-only worker's eight findings are accounted for: seven fixed and one recorded with D020/FUP-82e9f0bda503c40c, with the product wording narrowed to the implemented completeness detector. Root reproduction, rather than the worker's static predictions, determined each route. Effective worker settings remain unknown beyond the gpt-6.1-sol/max launch assignment.",
    "Adjacent queue revision 7 records R1 (adjacent-0002) complete; the broader temporary-repository maintenance sweep remains deferred as adjacent-0001 to FUP-d5605723a86254eb. Nothing is running or newly queued. Final output review caught an unsupported draft claim that FUP-82e9f0bda503c40c was open: the register has no disposition and followupStatus names it untriaged, as it also does the maintenance follow-up. The handoff is corrected to the checked class-syntax status; the queue's deferred disposition is a separate recorded state.",
    "At 2026-10-06T01:57:52.977Z, productContent measures product 07 at 174,603 non-exempt bytes, unchanged ceiling 166,907, overrun 7,696. D013's existing FUP-0a7c93eed06727ce owns that cost; close-register.md is updated to this measurement. D005's twelve role-root measurements and the 531-byte executor overrun remain unchanged from checkpoint 8, with FUP-8ce4b4b0104ba41b as their disposition. No ceiling or acceptance is added.",
    "The current publication check passed at 2026-10-06T01:41:09.645Z with the refreshed lock. The prepared application v0.66.4, compiler 0.25.3 and skeleton 0.52.4 passed the branch-local release check; subsequent gate release cases also passed. A sibling's version collision still belongs to final-review integration. No dependency, root role, worker definition or release manifest changes in this repair.",
    "One full review cost 885.916 s including work and waiting. The preceding repair's passing review cost 874.944 s with the same 38 suites and 88 fresh tasks; the sources differ, so that comparison does not establish a performance regression or gain. The handoff usage sample is 12,043,786 cumulative tokens (11,618,560 cached input), codex-transcript-counter, dispatch scope, cutoff 2026-10-06T01:56:50.616Z; USD is unavailable. The explicit session count is one worker, zero descendants, cap 20; the unhooked Codex counter observes zero admissions and reports an unknown uncounted remainder.",
    "D002 remains the order's only economy experiment, kept-current. Authored reports and indexes are finished and read before the completion transition; the completion owns its inline document gate and final index refresh. Its resulting records are read without another write."
  ],
  "rationale": "D026's mission, eight-trap comparison, Naive Interventionism and NoOp are judged against these outcomes. The bounded readers now preserve the verifier input and avoid complete-looking partial counts in the reproduced cases. Root self-review repaired two additional introduced defects before the expensive gate; the unchanged timing assertion passed. Advisories and existing lifecycle routes preserve the authority boundary; one reused worker and serial bounded probes limit shared cost. D020's formatting family stays recorded rather than widening the counted-class grammar. Passing fixtures and gates support this repair, while a future reduction in late escapes and verification cost remains unobserved. Independent verification still judges the repaired subject.",
  "rejected": [
    {"option": "Rerun the successful full review solely to include final reports or counters", "reason": "The current code identity already has complete passing review coverage; report edits and the inline document gate have their own evidence."},
    {"option": "Claim the order passed independent verification at executor handoff", "reason": "VER-002 is immutable and failed; the repaired subject needs the next separate verifier dispatch."}
  ],
  "reopenWhen": "Fresh verification disproves a repaired rule, a met criterion's gate is missing at its recorded subject, output review finds a false claim, or the future escape/cost observations reopen the order's stated assumptions."
}
```

## WO-187-D032 — Re-verification finds a repair-introduced silent loss across inline code spans

```json
{
  "id": "WO-187-D032",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-003)",
  "decision": "Fail VER-003 on criteria 2 and 4. F1 is a medium-severity defect the VER-002 repair introduced in the shared example projection: a backtick left unmatched on one physical line pairs with a backtick on the next line of the same paragraph and silently hides a real finding, carry-in label or self-review line. R1, R2 and R3 are low-severity defects in the same declared surfaces and go to the same bounded repair through Adjacent Repair. Preserve result recording, the fixed repairs of VER-002 and the existing class-value follow-up.",
  "evidence": [
    "verification-003/reader-regressions.json: '**Finding F1:** blocking; class: escape; the `--review flag is ignored.' followed directly by '**Finding F2:** blocking; class: integration; `resume.mjs` breaks.' reads escape 1, integration 0, measured true, no unrecognised line, under both verdicts; checkpoint 8 (VER-002's repair baseline) reads escape 1, integration 1. 'Summary of `npm test -- --review results:' followed by a canonical F1 reads found 0, measured true on a passing review; checkpoint 8 reads escape 1. The blank-separated control counts both findings at both subjects.",
    "The same file: an order whose '**Write-back duty:**' line holds an unmatched backtick, followed directly by '**Known issues and carry-ins:** the `x` reader drops input.', returns an empty briefing with no advisory; checkpoint 8 prints the carry-in. A handoff whose criterion line holds an unmatched backtick, followed directly by a present 'self-review: found 2; fixed 2; recorded 0 (`worker`)' line, is read as lacking it; checkpoint 8 reads it as present.",
    "verification-003/adversary-reproductions.json: the fresh adversary's three adjacent finding lines lose F2 (escape 1, new-scope 1, measured true) and two adjacent lines that each mention ``` lose F2 (integration). Root reran both. resume.mjs states the invariant this breaks: counts that cannot be complete are unmeasured, never a lower measured figure.",
    "R1: the generated reviewer root says missing or unknown classes advise and count as unclassed. '**Finding F1:** follow-up; class: escape.' counts unclassed with an empty unclassedBlocking list, and final-review-result advises only for unclassedBlocking (scripts/resume.mjs at the FinalReviewCompleted advisories), so no advisory follows. Product 07 and criterion 4 promise the advisory for blocking findings only.",
    "R2: the completeness detector flags any uncounted line containing a route word anywhere and 'class:' anywhere. Over the 166 real docs/final-reviews/*/FINAL-*.md reports it flags one, WO-186/FINAL-002.md line 3 (its verdict paragraph: 'FINAL-001's F1 is closed as a class:' ... 'follow-up'), which would now record unmeasured; checkpoint 8 flags none. A '- Basis for class: present in the subject VER-002 judged; blocking because criterion 4.' sub-bullet, written as product 07's 'Record the basis for that judgment' invites, makes a review unmeasured. One unmeasured review leaves plan start's last-ten rate unknown for up to ten orders. Across 732 real report files no count changes; only these measured readings become unmeasured.",
    "R3: within a carry-in section, a paragraph beginning '**Design** for the repair:' matches FIELD's bare closing-delimiter form, closes the section, prints 'holds no text' for a section that holds text and drops the later '- later carry-in sentinel.' (adversary-reproductions.json). Only the standalone '**Acceptance criteria (all required)**' and '**Operator-review assumptions**' labels use that form.",
    "Checked and dismissed: the adversary's concern that evidence.advisories.push can throw on a null evidence. scripts/lib/lifecycle-evidence.mjs requireLifecycleEvidence has one return, an object whose advisories array is always present; its throws are refusals unrelated to finding classes. The '(evidence ? { evidence } : {})' guard is legacy. The adversary's natural class endings (class: escape., class: escape (basis)) are D020's FUP-82e9f0bda503c40c.",
    "The current code identity 9408c8dcb05cbb5c39324fbe74f725522f39a7adf357d3b2e4c0435d74aac6a6 matches the executor's forced-fresh npm test -- --review row (38 suites, 88 fresh tasks, exit 0, 885916 ms, recorded 2026-10-06T01:56:17.134Z), consumed; the npm run test:docs row at that identity passed 29 suites including resume, 81886 ms, 2026-10-06T02:05:17.261Z. The lifecycle fixture passes (9.112 s) and fails against 08845c71:scripts/resume.mjs at 'verify must print the order's known issues'. Harness check passes 33 generated surfaces. All twelve role roots equal cold-start-after.json. The briefing reader prints all 15 real carry-in sections. verification-003/validation.json.",
    "One fresh Claude dotln-worker adversary (definition pin claude-opus-5-5/xhigh, no per-call model override) read only the order and authored diff (SHA-256 4272fbbea4f87c44d4d173d24b4749384018baf1a04115586bbc63257aed57da) and probed only the two wholly new modules. It found F1 independently of the root. The host reported its model as claude-opus-5-5 and no effort readback. One worker, zero descendants, cap 20."
  ],
  "repairRules": [
    "F1: the cross-line example projection may exclude a genuine multi-line inline example, but it must never silently remove a line that a per-line reading would recognize as a counted finding label or a route-and-class finding line, a Known issues label, or a self-review line. Such a line counts, or makes the measurement unmeasured with the unrecognised advisory (findings), prints or draws the unsupported-layout advisory (briefing), and is recognized or left advisory-only (handoff). Keep D028's genuine multi-line examples out of the counts. Add the adjacent-line cases above, including the checkpoint-8 controls, to the lifecycle fixture across all three consumers.",
    "R1: the reviewer root and final-review-result must agree. Either advise once for every unclassed finding, which keeps criterion 4, or limit the root sentence to blocking findings. Never promise an advisory the result does not print.",
    "R2: an uncounted line makes counts unmeasured only when it is finding-shaped: a label-like prefix followed by a route, or a route followed by a class field. VER-002 F2's forms stay unmeasured: '**R1:** blocking; class: typo; ...', backticked route, field or value, and the partially counted failed review. WO-186/FINAL-002.md line 3 and the 'Basis for class:' sub-bullet stay measured. Add both sides to the fixture, plus a real-corpus check that no FINAL report becomes unmeasured from prose.",
    "R3: a listed field ends a carry-in section only as a field label: a bold name with its colon, or a bare bold label standing alone on its line. A paragraph that begins with a bold field word stays in the section. Keep the existing empty-section advisory and bold-paragraph cases."
  ],
  "rationale": "Mission and critical path: verification needs complete inputs and the order's escape measure must not read lower than the record, or the next planning pass judges this order on a false figure. Policy resistance and fixes that fail: VER-002's repair cured a false count by introducing a silent undercount; the rule must hold both directions. Commons: consume the 886-second product row; bounded serial probes and one adversary. Drift to low performance and rule beating: a complete-looking lower count is the outcome the order exists to prevent. Escalation and shifting the burden: keep advisories and legal recording; add no phase, refusal or operator routing. Success to the successful: compare a small conservative flag on projection-hidden lines with a full Markdown dependency. Seeking the wrong goal: green fixtures cover their inputs; the real corpus and adjacent-line shapes are the test. Naive Interventionism: change only the reproduced reader paths, the one reviewer sentence or advisory, the detector's shape test and the field terminator; keep D020's class grammar, the generated pin and history. NoOp leaves a regression in the measure and the verifier's input.",
  "rejected": [
    {"option": "Pass because the CommonMark reading of an unmatched backtick is a code span", "reason": "The reader claims no CommonMark conformance, VER-002 F1's rule forbids silently hiding real content, and the resume.mjs invariant says uncertain counts are unmeasured, never lower. Checkpoint 8 read these inputs correctly."},
    {"option": "Route R2 back to VER-002's broad detector unchanged", "reason": "Real corpus and product 07's own basis instruction make reviews unmeasured; a shape test keeps every VER-002 F2 case."},
    {"option": "Implement the repairs in the verifier session", "reason": "The verifier writes evidence and its report; a fresh executor repairs and another verification judges."},
    {"option": "Fold every adversary observation into the repair", "reason": "D033 and D034 board the docs-check advisory bound and the remaining low reader and planning items with reproductions; they do not break a criterion."}
  ],
  "followup": "Repair WO-187 VER-003 F1, R1, R2 and R3 under the four rules above in scripts/lib/review-findings.mjs, scripts/lib/verification-briefing.mjs, scripts/resume.mjs or packages/skeleton/src/loadouts/contributor.ts (R1 only), and the lifecycle fixture scripts/test-verification-review.mjs. Use verification-003/reader-regressions.json and adversary-reproductions.json as reproductions. Run the affected fixtures, npm test -- --review and npm run test:docs, record repair-complete, and obtain fresh independent verification.",
  "reopenWhen": "A repair touches the shared readers or their consumers, a real finding, carry-in or self-review line still disappears without an advisory, a VER-002 F2 form reads as measured, or a real FINAL report becomes unmeasured from prose."
}
```

## WO-187-D033 — Board a bound on the document-ceiling advisory route

```json
{
  "id": "WO-187-D033",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-003); fresh adversary finding",
  "decision": "Board the uncapped advisoryDecision route in scripts/docs-check.mjs as a follow-up. It serves D013's operator-directed byte goal, criterion 6 does not depend on it, and it does not change a criterion's judgment.",
  "evidence": [
    "scripts/docs-check.mjs advisoryByteFollowup admits an over-ceiling document as an ADVISORY for any overrun size while the decision's follow-up is open or deferred. Nothing compares the current overrun with the one boarded. Product 07's overrun has grown under it from 5,715 bytes (D013) to 7,696 (D031) during this order's repairs.",
    "The route depends on syncFollowups(root, { check: true }) succeeding. A stale or invalid register anywhere returns the hard 'edit in place or cite a planning decision' failure instead of naming the register cause.",
    "D003 and D013 record the operator's direction: byte headroom is a goal, and an overrun becomes a follow-up rather than a raise. The fresh adversary could not read them and asked whether this is scope; the direction covers boarding the overrun, not leaving it unbounded for later orders."
  ],
  "rationale": "Mission: keep the operating-cost signal truthful without deleting useful review guidance. Drift to low performance and rule beating: an advisory with no bound lets any later order grow product 07 under this order's follow-up. Shifting the burden: the bound belongs to the mechanism, not to each future reviewer's attention. Escalation, commons and success to the successful: no new ceiling, phase or operator ritual. Seeking the wrong goal: bytes stay a cost, not the outcome. Policy resistance and fixes that fail: a stale-register failure should name its cause. Naive Interventionism: leave the operator-directed route in place and bound it. NoOp keeps an open-ended exception.",
  "rejected": [
    {"option": "Fail criterion 6 over the route", "reason": "Criterion 6 judges role-root bytes. The route follows D013's recorded operator direction, and no ceiling or acceptance was added."},
    {"option": "Send an operator decision packet", "reason": "The operator already directed follow-ups for overruns; bounding the advisory is within that authority."}
  ],
  "followup": "Bound the document-ceiling advisoryDecision route in scripts/docs-check.mjs: record the overrun (or the measured bytes) at boarding in docs/control/doc-ceilings.json and fail growth beyond it, so a later order cannot grow an advisory document without its own decision. Report a stale or invalid follow-up register as that cause rather than as a plain ceiling failure. Paths: scripts/docs-check.mjs, scripts/test-docs-check.mjs, docs/control/doc-ceilings.json. Checks: node scripts/docs-check.mjs, the docs-check fixtures and npm run test:docs. Reproduction: D013 at 5,715 and D031 at 7,696 bytes over for product 07 under one open follow-up. Priority: after WO-187's reader repair; operating-cost control.",
  "reopenWhen": "Product 07's overrun grows again under the same follow-up, another document gains an advisoryDecision, or FUP-0a7c93eed06727ce resolves and the advisory is removed."
}
```

## WO-187-D034 — Board the remaining low reader, advisory and planning-count observations

```json
{
  "id": "WO-187-D034",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-003); fresh adversary findings",
  "decision": "Board the adversary's low-severity observations that break no criterion and fall outside D032's repair rules, each with its reproduction.",
  "evidence": [
    "Self-review forms (adversary-reproductions.json): 'self-review: **found 2**; ...', 'self-review: _found_ 2', '- `self-review:` found 2' and 'Self-review (dotln-worker): found 2; ...' each draw the 'lacks a self-review: line' advisory; the canonical form does not. Advisory only. The receipt's criterion-3 known issue already covers a present line not proving a review.",
    "Finding reader: a quoted earlier finding '> **Finding F1:** blocking; class: escape' merges with this report's F1 and makes it unclassed blocking. A passing recap '**F1:** blocking finding from the earlier review, repaired.' counts as an unclassed blocking finding. Lines inside an HTML comment or an indented code block are read as prose (VER-002 recorded indented code as an unclaimed limit).",
    "Briefing: a singular '**Known issue and carry-in:**' label prints nothing and gives no advisory, because NEAR_LABEL requires 'Known issues'. A receipt lacking receiptId would print 'Planning receipt undefined'; the planning check validates real receipts.",
    "Planning counts (static): failureRecord adds a review-findings item for a passing review whose only counts are integration or new-scope, which plan failures then lists as a failure item.",
    "Harness: scripts/lib/harness.mjs admits '.claude/agents/dotln-[a-z-]+.md' while the compiler's worker name check admits digits; latent while the name is fixed. The worker definition sets no tools restriction, so its no-edit rule is role text. A 2,000-level nested list takes 1.16 s (adversary measurement); no realistic input approaches it.",
    "Product 07 §Verification review and attack carries reader-implementation detail (fence lifetime, empty items, lazy continuation) that every verify dispatch reads. This feeds D013's open FUP-0a7c93eed06727ce and adds no new item."
  ],
  "rationale": "Mission: keep the review measure and inputs honest without widening the repair beyond reproduced criterion and in-surface defects. Each item is advisory-only, conservative, latent or presentation-level. Drift and rule beating: a recap or quoted finding can raise unclassed counts, and the plan failures item list can over-report; both are visible rather than hidden. Commons and escalation: one bounded board, no new phase or worker. Shifting the burden and seeking the wrong goal: the canonical forms work; these broaden tolerance. Success to the successful and policy resistance: no dependency. Naive Interventionism: leave working canonical paths untouched. NoOp leaves only reproduced, recorded low items.",
  "rejected": [
    {"option": "Repair all of them in WO-187 now", "reason": "None breaks a criterion. D032 already returns four in-surface defects; folding in more widens a measurement repair into a general Markdown and planning-output sweep."}
  ],
  "followup": "Tolerate common self-review forms (emphasised counts, a code-formatted label, a parenthetical worker before the colon) in scripts/lib/handoff-ledger.mjs. In scripts/lib/review-findings.mjs, exclude blockquoted labels from this report's counts or treat them as recaps, and read HTML comments and indented code as examples. Advise on a singular 'Known issue' label and fall back from a missing receiptId in scripts/lib/verification-briefing.mjs. List a passing review's integration or new-scope counts as a count rather than a failure item in scripts/lib/plan-failures.mjs. Align scripts/lib/harness.mjs's agent-path pattern with the compiler's worker-name check. Reproductions: docs/evidence/WO-187/verification-003/adversary-reproductions.json and D034's evidence. Checks: scripts/test-verification-review.mjs, scripts/test-harness.mjs, npm test -- --review. Priority: low; after the class-syntax follow-up FUP-82e9f0bda503c40c.",
  "reopenWhen": "A real handoff draws a false self-review advisory, a real report's recap or quote changes a recorded count, a real order uses a singular label, or plan failures misreports a passing review."
}
```

## WO-187-D035 — Repair VER-003 without complete-looking partial counts

```json
{
  "id": "WO-187-D035",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-003)",
  "decision": "Repair F1 and R1–R3 in the shared readers, result advisory and lifecycle fixture. Compare paragraph-wide inline masking with physical-line labels; ambiguous spans must advise rather than silently hide a finding or carry-in. Advise once for every unclassed finding, restrict incomplete-measurement detection to finding-shaped lines, and require a field delimiter or a standalone bold label to close a carry-in section.",
  "evidence": [
    "Canonical status selected WO-187 needs-fix and VER-003; resume fix recorded RepairRequested and reserved the sole writer. Entry readback: codex-cli 0.160.1, gpt-6-astra, max, codex-session-readback.",
    "VER-003 and verification-003/reader-regressions.json reproduce adjacent-line silent loss in findings and carry-ins; handoff loss is already advisory-only. adversary-reproductions.json supplies the three-line/triple-backtick cases and the basis paragraph and bold field-word cases.",
    "The current code masks spans across a paragraph, detects route/class co-occurrence anywhere, advises only for unclassedBlocking and accepts any closing bold delimiter as a field boundary.",
    "D002 remains the one economy experiment, kept-current. D032 supplies the four repair rules; D020, D033 and D034 retain their separately boarded scope. The original order, cited product-07 sections and current source/tests were read before implementation."
  ],
  "rationale": "Mission and critical path: complete verification input and honest escape measurements reduce repeated operator routing in the source-to-deliverable loop. Policy resistance/fixes that fail: preserve both example exclusion and visible uncertainty rather than trading overcount for silent undercount. Commons: serial bounded probes, one fresh read-only adversary with zero descendants, cap 20; one current-identity review gate. Drift and rule beating: partial counts cannot be measured totals. Escalation and shifting the burden: existing advisories and legal recording continue without another phase or permission question. Success to the successful: compare a conservative projection check with a full Markdown dependency and line-only parsing. Seeking the wrong goal: faithful inputs and counts take priority over green fixtures or a smaller count. Naive Interventionism: retain fenced examples, original issue text, existing class grammar, release classification and immutable reports. NoOp leaves the reproduced verification failure unresolved.",
  "rejected": [
    {"option": "Count every label hidden inside multiline code", "reason": "Would count genuine examples and repeat the prior overcount regression."},
    {"option": "Keep silently dropping a label because Markdown can span lines", "reason": "The reader is a bounded record projection; uncertainty must be visible."},
    {"option": "Add a Markdown dependency or broaden the class-value grammar", "reason": "Neither is necessary for these repair rules; no new dependency is authorized by the deliverable and D020 already boards grammar variants."},
    {"option": "Narrow and regenerate the reviewer instruction for R1", "reason": "Advising for every unclassed finding directly fulfills the existing instruction with a smaller executable change."}
  ],
  "reopenWhen": "A supported physical record disappears without an advisory, a genuine example adds a count, a prose basis makes a review unmeasured, or a field-word paragraph loses carry-ins."
}
```

## WO-187-D036

```json
{
  "id": "WO-187-D036",
  "date": "2026-10-06",
  "dispatch": "resume: fix; release prepare",
  "decision": "Retime unpublished application target v0.66.4 to v0.67.1, the next patch above the observed release baseline v0.67.0, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.",
  "evidence": [
    "release baseline v0.67.0 (local tags)",
    "superseded target v0.66.4",
    "new target v0.67.1"
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

## WO-187-D037 — Resolve ambiguity conservatively and repair self-review findings

```json
{
  "id": "WO-187-D037",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-003); executor self-review",
  "decision": "Use each physical line as an uncertainty witness for the paragraph projection, including fully enclosed record-like lines. Keep multiline examples out of counts but make the result unmeasured when their contents are indistinguishable from records swallowed by stray delimiters. Repair the four reproduced adversary findings in the same declared reader: parenthetical-route completeness, lossless finding identifiers, class metadata versus narrative and explicit-route precedence.",
  "evidence": [
    "repair-003-red.json fails the added adjacent-line assertion before implementation. repair-003-first.json passed the initial fix, but repair-003-corpus-first.json disproved its narrower endpoint rule: a wholly enclosed F1 still read measured zero. The correction compares every physical-line projection with the paragraph projection, without inferring the author's intent from endpoint labels.",
    "repair-003-corpus.json checks all 166 final-review reports named by the current control record against checkpoint 8: no class count changes and no newly unmeasured review. Its wholly enclosed probe now reports line 2 unrecognised and measured false. Existing multiline-example fixtures continue to add zero example counts; they now require visible uncertainty for hidden record-like lines.",
    "One fresh read-only Codex worker read only the order and authored diff, with fork_turns none and launch selections gpt-6.1-sol/max; no descendants, probes or writes. It reported no effective model/effort readback. Root executed its predictions in repair-003-adversary-all-before.json.",
    "Unsupported R1 (blocking) labels on both passing and partly counted failed reports produced complete-looking partial counts. Distinct F9007199254740992 and F9007199254740993 labels merged through Number conversion. A body example of class: integration overrode an explicit escape field. A narrative mention of blocking overrode an explicit follow-up route.",
    "The queue's one repair item was revised and announced with the same paths and checks; current revision 3 covers all four self-review findings. No unrelated formatting family, document-budget mechanism or publication action enters scope.",
    "One newly added handoff test accidentally declared Criterion note; readHandoffLedger correctly refused that undeclared criterion. The fixture was corrected to Gate note; the implementation's criterion validation is unchanged."
  ],
  "rationale": "D035's mission, eight-trap comparison, Naive Interventionism and NoOp continue to apply. A conservative unknown is preferable to a fabricated complete count; explicit fenced examples avoid this ambiguity. Removing the endpoint heuristic simplifies the reader. String-normalized identifiers remove precision loss without a dependency; metadata fields and explicit routes prevent narrative examples from altering the measurement. D002 remains the sole economy experiment, kept-current; these are correctness repairs, not a claimed performance improvement.",
  "rejected": [
    {"option": "Treat every fully enclosed record line as an intentional example", "reason": "The root probe proves an identical shape can hide an actual record; the input cannot establish intent."},
    {"option": "Count hidden example labels", "reason": "Would reintroduce the earlier false counts; retain exclusion and expose uncertainty."},
    {"option": "Board the four concrete self-review defects", "reason": "All reproduce inside the active parser surfaces and admit bounded repairs with existing checks."}
  ],
  "reopenWhen": "A supported record is silently hidden, a body example changes a declared class or route, an unsupported finding-shaped parenthetical is treated as measured, or distinct decimal finding identifiers merge."
}
```

## WO-187-D038 — Hand off the tested VER-003 repair

```json
{
  "id": "WO-187-D038",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-003); executor handoff",
  "decision": "Record the completed reader repair and return it to independent verification through repair-complete after the final inline document gate. Retain the conservative unmeasured result for ambiguous multiline code, the existing follow-ups and the prepared local release.",
  "evidence": [
    "repair-003-fixture.json: the expanded lifecycle fixture passed in 14,530 ms. repair-003-baseline.json: the original 08845c71 resume source still fails the required known-issues assertion. repair-003-corpus.json: all 166 historical final reports retain their class counts and measurement status.",
    "repair-003-review-gate.json: npm test -- --review passed 38 suites, zero failures, 88 fresh tasks, 901,640 ms at 2026-10-06T03:11:00.671Z. Code identity df6a56e11398cac98d2e0536f0c1ccbc86dfa2eef5ba89bff5c2a89eee83f00f remained unchanged.",
    "repair-003-document-gate.json: npm run test:docs passed 29 suites, zero failures, 29 fresh tasks, 84,394 ms at 2026-10-06T03:12:52.314Z. Completion judges the final documentation again inline.",
    "repair-003-self-review.md: five findings, five fixed, zero newly recorded; the fresh worker's final static recheck found no remaining finding. Explicit session count is one worker and zero descendants. Codex's unhooked usage observation counts zero admissions and leaves the unobserved remainder unknown; it does not replace the explicit count.",
    "Adjacent queue revision 18 completes adjacent-0003 revision 3 with the focused fixture and both gate artifacts. No running item remains. The earlier maintenance sweep stays deferred to FUP-d5605723a86254eb.",
    "repair-003-preflight.json: publication, planning and local release-surface checks passed; all twelve cold-start roots equal their prior measurements. The passing review gate includes the harness checks. Product 07 is 175,497 bytes, 8,590 above its existing ceiling, still on D013's FUP-0a7c93eed06727ce; no new acceptance or dependency. close-register.md retains the two retargets owed at close."
  ],
  "rationale": "D035's mission, eight system traps, Naive Interventionism and NoOp comparison hold after execution: ambiguous records no longer look like measured totals, ordinary prose preserves measurement, and carry-ins retain their text. The repair closes the reproduced class with additional cases and the real corpus. One fresh worker and the existing gates supplied independent pressure without another role or refusal. D002 remains the sole economy experiment, kept-current. The review took 901.640 s versus 885.916 s for the prior repair, but these are different subjects and runs; no performance improvement or causal slowdown is inferred. Final token counters remain in ignored usage receipts and the response; dollar cost and effective worker effort are unknown.",
  "rejected": [
    {"option": "Treat ambiguous hidden record lines as measured zero", "reason": "The red and enclosed-line probes reproduce silent incomplete counts; the conservative rule makes the uncertainty visible without counting examples."},
    {"option": "Claim independent verification from the passing executor gates", "reason": "The gates establish executable behavior; the verifier must independently judge the repaired subject on its own dispatch."}
  ],
  "reopenWhen": "Independent verification finds an in-surface defect, a supported input loses a record without an advisory, the real corpus changes measurement unexpectedly, or a final completion check fails."
}
```

## WO-187-D039 — Criteria 2 and 4 infer records from free-form Markdown; replace the inference with exact structured formats

```json
{
  "id": "WO-187-D039",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-004)",
  "decision": "Fail VER-004 on criteria 2 and 4 with one blocking design finding, F1. The final-review finding counter, the verify briefing and the handoff self-review check infer records from free-form Markdown prose. Every verification of this order has failed on that inference, and each repair has opened a new silent loss. Repair by replacing the inference with exact formats, following the marker-and-JSON pattern of scripts/lib/dependencies.mjs. This is a verifier route for a defect in the order's declared surfaces (the order's Design: blocking, the verdict fails) and needs no operator authorization; the criteria's text is unchanged.",
  "evidence": [
    "VER-001, VER-002 and VER-003 each failed only on criteria 2 and 4; criteria 1, 3, 5, 6, 7 and 8 (the spawn duties, the worker definition, the self-review line) were met each time. VER-004 fails on the same two.",
    "Each repair opened a new silent loss in inputs no fixture held. VER-002's cross-line projection hid adjacent finding lines that checkpoint 8 counted (VER-003 F1). VER-003's narrowed detector drops '**Issue 1:** blocking; class: escape; ...', '**Finding #2:** ...', '**Defect A:** blocking; class: integration; ...', '**Finding F2.1:** ...', '**F 2:** ...', '**R1:** route: blocking; class: escape; ...', '**R1:** class: escape; blocking; ...' and '**Finding F3:** F1's repair regressed the briefing; blocking; class: escape.' with measured true, where checkpoint 11 read each as unmeasured (verification-004/adversary-reproductions.json). scripts/test-verification-review.mjs contains none of these seven label shapes and pins only VER-002 F2's example '**R1:** blocking; class: typo' (four times): the fixture pins reported examples, not the rules.",
    "Criterion 2: '- Receipt 038: the order's estimate in the' followed by an unindented '**Cost:** field was wrong; carry in its correction.' ends the carry-in section mid-sentence and drops the later '- Receipt 040: second-sentinel.' with no advisory, at the subject and at checkpoint 11 (adversary-reproductions.json, F6). Criterion 4: the inputs above record a lower measured count; scripts/resume.mjs final-review-result records findingCounts whenever reviewFindings reports measured true.",
    "The structured inputs of the same order have never failed: the briefing's planning-receipt known issues (JSON) and the generated worker definition (checked by the harness) passed all four verifications. Work orders already carry dependencies as a JSON block between <!-- dotln-dependencies:start --> and <!-- dotln-dependencies:end -->, read strictly by scripts/lib/dependencies.mjs.",
    "What holds at this subject: VER-003's four findings are repaired for their recorded inputs (reproductions.json); across 166 real FINAL reports the only change from checkpoint 11 is WO-186/FINAL-002, now measured, and all 193 orders brief identically (corpus.json); the lifecycle fixture passes in 14.08 s and fails against 08845c71:scripts/resume.mjs at 'verify must print the order's known issues'; harness check passes 33 surfaces; the twelve roots equal cold-start-after.json; code identity df6a56e11398cac98d2e0536f0c1ccbc86dfa2eef5ba89bff5c2a89eee83f00f matches the consumed npm test -- --review row (validation.json)."
  ],
  "repairRules": [
    "F1(a) Final-review findings. The reviewer writes one block in the report: a line '<!-- dotln-findings:start -->', a JSON array, a line '<!-- dotln-findings:end -->'. Each entry is {\"id\": \"F<n>\", \"route\": \"blocking\"|\"follow-up\"|\"operator\", \"class\": \"escape\"|\"integration\"|\"new-scope\", \"summary\": one line}. final-review-result reads only this block; prose lines never count. Deterministic outcomes, each with the result still recorded: no block, two blocks, invalid JSON, a non-array, a duplicate id, or an entry with a bad id, route or summary makes findingCounts unmeasured with one advisory naming the cause and entry; a missing or out-of-vocabulary class counts unclassed and is named in one advisory (blocking entries named as blocking); a failed review with an empty array is unmeasured with its advisory; a passing review with [] records all-zero counts.",
    "F1(b) Briefing. Read the order line by line with no inline-code, lazy-continuation or container inference. A section starts at a line that begins with one of the three documented label forms ('**Known issues and carry-ins:**' or '**Known issues and carry-ins**:' with optional text after, or a '#'-heading of that name). It ends before the first later line that follows a blank line and is an exact order-field label (a listed field name in bold with its colon inside or outside, or the bold name alone on its line) or a heading of the same or higher level. A line that starts with ``` or ~~~ toggles a fence; labels and field ends inside a fence are ignored; a fence still open at the end of the order draws one advisory naming its line. Lines are printed verbatim. Any other line whose text after list or quote markers starts 'Known issues' draws one advisory naming the line. Planning-receipt known issues stay as they are.",
    "F1(c) Handoff. The self-review line is a line that, after an optional list marker, starts 'self-review: found <n>; fixed <n>; recorded <n>'. Any other form draws the existing missing-line advisory; completion still records.",
    "F1(d) Remove markdownLines, blockLines, inlineExampleText and the ambiguity checks once nothing uses them. Edit in place the reviewer sentence in packages/skeleton/src/loadouts/contributor.ts and product 07 §Verification review and attack to state these formats instead of the reader rules; regenerate the roots, run npm run harness -- check and remeasure cold-start bytes for criterion 6.",
    "F1(e) Tests in scripts/test-verification-review.mjs, one case table per rule, each row with its exact expected output: every block outcome in (a), from the fixture's docs directory as well as the root; the briefing inputs of VER-001 F1 (inline label text, colon outside, heading, bold-led paragraph, second section, WO-123's layout), VER-002 F1's quoted unclosed fence before a top-level label, VER-002 R1's body emphasis, VER-003 F1's stray backtick before a label, VER-003 R3's '**Design** for the repair:' paragraph, this report's '**Cost:**' continuation line, a fenced example label and an unclosed fence; the handoff's canonical, listed and missing forms. The fixture still fails against 08845c71:scripts/resume.mjs at the known-issues assertion. Run the real-order comparison (verification-004/probes/corpus.mjs) and expect all 15 real carry-in sections printed whole."
  ],
  "rationale": "Mission and critical path: the escape count and the verifier's input must be exact, or the order's measure and its 'fed what the reviewer is fed' duty fail. Fixes that fail: four rounds of parser repair each opened a new loss; the inference is the cause. Shifting the burden: an exact format moves correctness to the writer at writing time, where a validator can name the error, instead of to a guesser at reading time. Escalation and commons: no new phase, refusal or worker; the result still records. Drift and rule beating: a prose guesser can always read a lower count as complete; a schema cannot. Success to the successful: reuse the dependency block's pattern. Seeking the wrong goal: green fixtures that pin examples are not the goal; the rules are. Naive Interventionism: change only the three readers, their two texts and the fixture; keep plan failures, plan start and the event shape. NoOp keeps the loop.",
  "rejected": [
    {"option": "A fifth round of parser rules with a larger case table", "reason": "Free-form prose has no fixed grammar; each earlier rule set passed its table and lost other inputs."},
    {"option": "Send only the adversary's regression to repair and board the rest", "reason": "That narrowed an in-surface repair; D042 records it as the verifier's error."},
    {"option": "Ask the operator to authorize the redesign", "reason": "The order routes a defect in its declared surfaces as blocking and directs the verifier to name the simpler alternative; the criteria do not prescribe prose parsing. D042 records the request as the verifier's error."}
  ],
  "followup": "Repair WO-187 VER-004 F1 under rules F1(a) to F1(e) in scripts/resume.mjs, scripts/lib/review-findings.mjs, scripts/lib/verification-briefing.mjs, scripts/lib/handoff-ledger.mjs, packages/skeleton/src/loadouts/contributor.ts, docs/product/07-execution-guide.md and scripts/test-verification-review.mjs. Reproductions: docs/evidence/WO-187/verification-004/adversary-reproductions.json and VER-001 to VER-004. Run the fixture, the real-order comparison, npm run harness -- check, npm test -- --review and npm run test:docs, record repair-complete and obtain fresh independent verification.",
  "reopenWhen": "A count or carry-in is again inferred from prose, a block outcome is not deterministic, or a real carry-in section is not printed whole."
}
```

## WO-187-D040 — The remaining reader observations of VER-004 are evidence for D039, not separate work

```json
{
  "id": "WO-187-D040",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-004); root probes and fresh adversary findings",
  "decision": "Record the remaining observations as further evidence for D039. Each concerns the inference D039 removes, so none is boarded separately, and an earlier draft of this decision that boarded them is withdrawn.",
  "evidence": [
    "A stray backtick before a one-line example of the finding format counts the example (variations.txt, strayBeforeExample); a failed review's counted line with a hidden route counts unclassed blocking; underscore-emphasised routes are not recognised; a field-zero narrative 'class: integration' supplies a class; a narrative route word overrides a parenthetical route; a bare CR joins two finding lines and loses the second; basis prose such as 'Basis: blocking because criterion 4 fails; class: escape since ...' reads unmeasured; an unclosed fence hides the rest of a report or order (adversary-reproductions.json).",
    "Advisory wording ('1 other finding have', 'line 3 contain', the briefing's 'lines 6 contain', 'counted as unclassed' on an unmeasured result) is rewritten with the readers under D039 F1(a) and F1(b).",
    "Indented-code and HTML-comment examples remain D034's FUP-3f9d788f4d8c89ac for the handoff and briefing until D039's repair removes the inference."
  ],
  "rationale": "D039's rationale applies: these are symptoms of reading records out of prose. Boarding each would keep the inference alive and grow the follow-up register. NoOp would lose the reproductions.",
  "rejected": [
    {"option": "Board each item as its own follow-up", "reason": "D039's repair removes the code each item concerns."}
  ],
  "followup": "No separate work: this row's earlier text (a board of reader items) is withdrawn. Dispose it with FUP-dd7caa31b91f2e70 (WO-187-D039), whose repair removes the inference these items concern.",
  "reopenWhen": "D039's repair keeps any part of the prose inference."
}
```

## WO-187-D041 — Receipt 040's criterion-3 reopening condition has occurred

```json
{
  "id": "WO-187-D041",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-004)",
  "decision": "Record for planning that the reopening condition of planning receipt 2026-10-03-planning-90bdcd90e4af7f16-040's criterion:3 known issue has occurred twice in this order. The verifier does not reopen a planning judgment itself.",
  "evidence": [
    "The receipt's condition: a handoff carries a self-review line and its verification then blocks on a defect of a kind the self-review sentence names (a defect in the diff the fresh adversary reads).",
    "VER-003 blocked on F1 after the VER-002 repair handoff carried 'self-review: found 8; fixed 7; recorded 1' (VER-003 criterion 3).",
    "VER-004 blocks on D039's F1, introduced in the repair diff, after the handoff carried 'self-review: found 5; fixed 5; recorded 0' and repair-003-self-review.md reports the worker's final static recheck found no remaining defect."
  ],
  "rationale": "Mission: the self-review duty should remove verification returns; the record shows it has not yet done so for this order's reader repairs. Seeking the wrong goal and rule beating: a count line is evidence of a pass, not of its effect. Shifting the burden: planning owns the known issue. Naive Interventionism and NoOp: record the occurrence without changing role text in a verification.",
  "rejected": [
    {"option": "Fail criterion 3", "reason": "Criterion 3 judges the advisory for a missing line, which holds; the receipt already names this risk as a known issue."}
  ],
  "followup": "At the next planning pass, reopen receipt 2026-10-03-planning-90bdcd90e4af7f16-040's criterion:3 known issue for WO-187 and judge whether the executor's self-review needs an executable obligation after a failed verification (for example, rerun every earlier VER reproduction and the real-corpus comparison before repair-complete) rather than a count line. Evidence: VER-003, VER-004, docs/evidence/WO-187/repair-003-self-review.md. Priority: with WO-187's close.",
  "reopenWhen": "Planning disposes the known issue, or a later self-reviewed repair passes verification without a new regression."
}
```

## WO-187-D042 — VER-004 verifier process failures

```json
{
  "id": "WO-187-D042",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-004); operator correction",
  "decision": "Record as a serious verifier failure, at the operator's direction, that the VER-004 verifier asked the operator to authorize the repair of a blocking finding, and record its other errors in this dispatch. The corrected judgment is D039.",
  "evidence": [
    "Authorization request (serious): the verifier told the operator that replacing the prose readers 'changes what criteria 2 and 4 specify, so it needs your authorization'. The order's Design routes a defect in the declared surfaces as blocking (the verdict fails) and keeps operator for a choice only the operator can make; duty (b) tells the verifier to name the simpler alternative. Criteria 2 and 4 do not prescribe prose parsing, and the readers are declared surfaces. No authorization was needed.",
    "Narrowed repair: an earlier draft of D039 and D040 sent one regression to repair and boarded the other in-surface defects, citing regression risk, after the operator complained about cycle length. The role text says a complaint is not an instruction to narrow.",
    "Off-ramp drift: the verifier looked up the waive command's syntax to offer a waiver nobody requested.",
    "Wrong cause: the verifier said each repair broke a case an earlier report had fixed. The fixture never held the regressed inputs; it pins reported examples, not rules (D039 evidence).",
    "Missed design finding: the verifier wrote more parser rules before naming the inference as the defect, as VER-003 had judged 'the design holds'."
  ],
  "rationale": "Correctness over sycophancy and the order's routes bind the verifier: it judges and routes findings in the declared surfaces itself. Asking the operator to authorize a repair rule shifts the verifier's burden to the operator and adds a manual step the order exists to remove.",
  "rejected": [
    {"option": "Record only the corrected judgment", "reason": "The operator directed that the failure be recorded."}
  ],
  "followup": "Make explicit in the verifier root (packages/skeleton/src/loadouts/contributor.ts) and product 07 §Verification review and attack that a design-level defect in the order's declared surfaces is a blocking finding the verifier routes with a repair rule, without operator authorization, and that operator is only for a choice outside the order's criteria and surfaces. Evidence: this decision and VER-004. Priority: next planning pass.",
  "reopenWhen": "A verifier again asks the operator to authorize a repair rule for a finding inside the order's criteria and declared surfaces."
}
```

## WO-187-D043 — Recording a verification result waits on another worktree's test lanes

```json
{
  "id": "WO-187-D043",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-004); operator observation",
  "decision": "Board, outside this order's criteria and surfaces, that the verification-result transition runs npm run test:docs inline and that run queues for host lanes shared by every worktree, so one order's test run blocks another order's lifecycle step, including a fail verdict the gate cannot change.",
  "evidence": [
    "The first VER-004 fail transition's inline document gate (started 2026-10-06T05:01:23.102Z) printed 'WAIT host lanes for /Users/dylanwood/Projects/DotLn-wo187 / build; held by /Users/dylanwood/Projects/DotLn-wo112 / vertical (1)' when rerun standalone, and failed after 699.8 s at 'FAIL build 0.00 s' when stopped. The second attempt's gate took 353.8 s. Earlier inline document gates of this order took 70,179 to 84,093 ms.",
    "scripts/test-runner.mjs acquires host lanes from scripts/lib/host-lanes.mjs (acquireHostLanes, capacity 4) for every task with a command; scripts/lib/handoff-ledger.mjs requireGateClaims runs scripts/test-runner.mjs --document synchronously for any met criterion naming npm run test:docs, for pass and fail verdicts alike, with its output buffered until exit."
  ],
  "rationale": "Mission: parallel work orders exist to keep lifecycle steps independent; a shared lane turns them into one queue. Shifting the burden: the operator waits on an unrelated order. Escalation: stopping the wait discards queue position and records nothing. Naive Interventionism and NoOp: the boarded change is bounded to when the inline gate runs and how it waits.",
  "rejected": [
    {"option": "Repair it in WO-187", "reason": "Neither the test runner's lanes nor the completion's gate claims are this order's declared surfaces or criteria."}
  ],
  "followup": "Make lifecycle recording independent of other worktrees' test lanes: a fail verdict records without waiting on an inline document gate (the met claim is recorded as stated with an advisory, or the gate runs after recording), and an inline document gate either gets a reserved lane or reports the lane holder and wait time immediately instead of blocking silently behind buffered output. Paths: scripts/lib/handoff-ledger.mjs (requireGateClaims), scripts/lib/host-lanes.mjs, scripts/test-runner.mjs. Reproduction: D043's evidence. Checks: the gate-claims and host-lane fixtures and npm test -- --review.",
  "reopenWhen": "A lifecycle transition again waits on a lane held by another worktree, or a fail verdict is blocked by an inline gate."
}
```

## WO-187-D044 — Replace the prose readers with exact formats under D039

```json
{
  "id": "WO-187-D044",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-004)",
  "decision": "Repair VER-004 F1 under D039's rules F1(a) to F1(e) by removing the prose readers. final-review-result reads one marker-delimited JSON findings block in the report and nothing else. The verify briefing reads the order line by line and recognises structure only at the start of a line. The handoff's self-review line has one form. The shared Markdown projection (blockLines, inlineExampleText, markdownLines, unfencedLines, lineLabel and the ambiguity checks) is deleted. The reviewer sentence and product 07 §Verification review and attack state the formats in place of reader rules. The order's criteria are unchanged: criterion 4's finding line is now an entry of that block.",
  "evidence": [
    "Canonical status selected WO-187 in phase repairing on VER-004 with repair-complete the one legal action; the harness recorded the fix dispatch and reserved the writer. Entry readback: claude-code, claude-fable-5-1, effort xhigh from CLAUDE_EFFORT (selected, not effective). Read before any change: the order, VER-004, D039 to D043, the recorded inputs of VER-001 to VER-003, the three reader modules, scripts/resume.mjs final-review-result, scripts/lib/dependencies.mjs and the fixture.",
    "Real corpus, surveyed before the change: 15 of 193 orders hold the label, every one as '**Known issues and carry-ins:**' at the start of a line (WO-123 with text after it), and every section ends at '**Non-goals:**' after a blank line. Order field labels use an optional parenthetical ('**Acceptance criteria (...)**' in 184 orders, '**Design (...):**' in 165), so the label grammar keeps it.",
    "Rule held, findings (F1(a)): only the block counts. No marker line, more than one start or end marker line, an end before its start, invalid JSON, a value that is not an array, or an entry that is not an object with an id F<n> no other entry has, a listed route and a one-line summary records no count and prints one advisory naming the first such cause and entry. A missing class or one outside escape, integration and new-scope counts as unclassed and one advisory names each such finding, blocking ones as blocking. A passing review with [] records four zeros. The result records in every case. repair-004/reproductions.json: each of VER-004's eight finding-shaped lines after a counted control read measured with escape 1 before this repair and now reads unmeasured with 'the report has no findings block'; the same findings declared in the block count 2.",
    "Rule held, briefing (F1(b)): a section starts at the field's label at the start of a line and ends before the next heading at its level or above, or the next order-field label that follows a blank line. A field label on a line that continues a paragraph is that paragraph's text, so VER-004's wrapped '**Cost:** field was wrong; ...' line and the '- Receipt 040' carry-in after it print. Lines print as written under a header naming the label's line, the last line printed and the line that ended the section. An empty section, a fence the order never closes and any other line outside a section whose first letters are 'Known issue' each advise with the line. repair-004/corpus.json: all 15 real sections print whole and byte-identical to the pre-repair reader's bodies.",
    "Rule held, handoff (F1(c)): the line is, at the start of a line and after an optional list marker, 'self-review: found <n>; fixed <n>; recorded <n>'; text may follow. Every other spelling, emphasis, quote or indentation draws the one missing-line advisory, and completion records.",
    "Choices beyond D039's letter, each unable to lower a count or hide a line. (1) A fence closes only at a line of its own character, at least as long, with nothing after it, and a backtick opener holds no later backtick; plain toggling ends a section early when a longer fence holds a shorter one before a blank line and a field label (fixture row 914; repair-004/fence-rules.json), and a line that opens with inline code would open a fence (row 916). (2) The bold name alone on its line is a label, as it is a field end. (3) A fence line a writer puts around the array inside the block is dropped; no line of a JSON array is a fence line, and an entry written on such a line stays invalid JSON. (4) Every section header names the line that ended the section, so a cut is stated where the verifier reads it. (5) The near-label advisory reads singular 'Known issue': WO-130 line 241 is a real known issue written as prose that no briefing printed, the reopening condition D034 named for that boarded item. (6) A failed review whose block lists no blocking finding is unmeasured, which contains F1(a)'s empty-array case: each of the thirteen failed final reviews the order cites failed on a blocking finding. (7) A marker line is any line whose only letters are a marker's name, so a second block in a quote, a list item or another spelling is a second block.",
    "Stated boundaries, each pinned by a fixture row with its exact output. Structure counts only at the start of a line, so an indented fence is text and a field label at the start of a line inside it, after a blank line, ends the section; the header names that line (row 918). repair-004/fence-rules.json compares three fence rules through the shipped reader with only that rule patched: plain toggling also loses the nested fence, and recognising indented fences hides a real label between two examples fenced on a list marker line with nothing said, where the shipped rule prints it (row 917). A bold-labelled section ends at any heading (row 936). A second copy of a marker line anywhere in a report, a fenced example included, makes its counts unmeasured rather than half read. A self-review line inside a fence is the line.",
    "repair-004/mutations.json: the fixture run from a copy of scripts/ passes unmutated and fails at the intended row for each of seven weakened rules (exact-spelling markers only, a failed review needing any finding, an unchecked route, a closing fence only at the line's start, a field ending a section without a blank line, plain fence toggling, the bold self-review form).",
    "D002 remains this order's one economy experiment, kept-current, and says no second experiment in this order; none was started."
  ],
  "rationale": "Mission and critical path: the escape count is this order's measure and the briefing is the verifier's input; each must be exact or the next planning pass and the next verifier work from a false record. Fixes that fail and policy resistance: four rule sets over prose each passed their table and lost other inputs, so the repair removes the inference rather than adding rules. Shifting the burden: an exact format moves correctness to the writer, where one advisory names the error. Drift to low performance and rule beating: a block that cannot be read records no count, never a lower one, and a cut section says where it was cut. Escalation and commons: no new phase, refusal, dependency or worker; one adversary and the existing gates. Success to the successful: the pattern is the dependency block every order already carries. Seeking the wrong goal: the tables pin rules and their boundaries, including outcomes that are losses by the stated format, and a mutation run shows each row fails without its rule. Naive Interventionism: plan failures, plan start, the event shape, the receipt projection and every other role duty are unchanged. NoOp leaves VER-004's reproduced losses in place.",
  "rejected": [
    {"option": "Plain fence toggling as D039 F1(b) words it", "reason": "A shorter fence inside a longer one closes it early and a field label in the example then ends the section; the stricter closing rule reads the same documented fences and cannot end a section earlier."},
    {"option": "Recognise indented fence openers", "reason": "A list-marker fence's indented closer then opens a fence its opener never did, and two such examples hide a real label between them with nothing said (fence-rules.json)."},
    {"option": "Ignore marker lines inside fences when reading a report", "reason": "It puts Markdown state back into the count's reader. A duplicated marker making the count unmeasured is the safe direction, and the reviewer sentence says to write the marker lines nowhere else."},
    {"option": "Keep the tolerant self-review forms", "reason": "D039 F1(c) sets one form; the advisory names it."},
    {"option": "Treat a fenced array inside the block as invalid JSON", "reason": "It would lose a review's measure to the commonest writing habit while reading nothing differently for a valid array."},
    {"option": "Leave the reviewer sentence and mint no role change", "reason": "It would instruct the old line format, which the result no longer reads."}
  ],
  "reopenWhen": "A count or carry-in is again read from prose, a block outcome is not deterministic, a real carry-in section is not printed whole, a real order holds field-label text at the start of a line inside an indented fence, or a real final review loses its measure to a duplicated marker line."
}
```

## WO-187-D045 — Fix nine self-review findings, record three and board the strict-validation choice

```json
{
  "id": "WO-187-D045",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-004); executor self-review",
  "decision": "Fix nine of the fresh adversary's twelve findings in the repaired readers, their texts and the fixture, and record three: the strict block validation D039 F1(a) sets is kept and boarded for a judgment over real reviews, one unverified concern is dismissed on the source, and two reader edges are judged limits.",
  "evidence": [
    "One fresh Claude dotln-worker (definition pin claude-opus-5-5, xhigh; no per-call model override) read only the order, the repair diff from checkpoint 17 and the authored diff for the same files, imported the three reader modules read-only for bounded probes, wrote nothing in the repository and spawned no descendant. It reported its model as claude-opus-5-5 and no effort readback; the host reported 216,973 worker tokens, 20 tool uses and 712,355 ms. One worker, zero descendants, cap 20. repair-004/self-review.md lists each finding with the root's judgment.",
    "Fixed, each reproduced by the root first and pinned by a row that fails without the fix (repair-004/mutations.json). (1) A fence closed by an indented closer stayed open and hid a later label: a closing fence may be indented up to three spaces. (2) A second findings block in a quote, a list item or another marker spelling was skipped: a marker line is any line whose only letters are a marker's name. (3) A failed review whose block listed only a follow-up recorded a complete-looking count: a failed review's block must list a blocking finding. (6) The executor sentence now says to add the handoff.md line; the executor root's bytes are unchanged. (7) Every section header and empty-section advisory names the line that ended the section. (8) Any line outside a section whose first letters are 'Known issue' advises, and the three readers split lines on CRLF, LF or a bare CR. (9) The header's description, the singular advisory, the id cause and product 07 agree. (11) The result fixture compares the recorded advisory list instead of a vacuous membership test, holds the quoted-copy rows, and dates its synthetic reviews 2998 and 2999 so the last-ten figure does not depend on the clock. (12) classes, invalid and BOLD_LABEL_LEVEL are named and four exports with no importer are module-private.",
    "Recorded, finding 4: checking an entry's id shape, route and summary voids a count those fields do not enter, so one capitalised route in a filed report leaves plan start's last-ten rate unknown until that order leaves the window, and a classless blocking finding beside such an entry is neither counted nor named. D039 F1(a) sets exactly these outcomes, the count is never lower either way, and the reviewer sentence shows the closed vocabulary. The alternative (void the count only when the entries cannot be enumerated, name the other problems and count) and a read-only reading of the block before the result are boarded together.",
    "Recorded, finding 5: dismissed on the source. scripts/lib/lifecycle-evidence.mjs requireLifecycleEvidence has one return, an object that always holds an advisories array; the '(evidence ? { evidence } : {})' spread is older. The fixture records twelve real final-review results, and the ten that print an advisory hold it in the event's evidence.",
    "Recorded, finding 10: two of its edges are fixed (a summary holding a control or line-separator character is no one-line summary; an entry shown in an advisory is cut between characters). Two are judged limits. A fence line whose info string holds punctuation is not dropped from the block, so that block reads 'not valid JSON' with its advisory; widening the pattern would drop an entry written on a fence line. A carry-in is the order's own text and prints as written, so it can imitate a briefing line; each section's header names the lines it holds.",
    "The root's own probe before the review found the indented-fence boundary D044 states; finding 7's fix names that cut too.",
    "Two fixes reach beyond VER-004's quoted inputs, inside files this repair rewrites: the singular near-label advisory, which is one item of D034's boarded FUP-3f9d788f4d8c89ac, and the fixture's dated synthetic reviews, which come from the first implementation. Both were made in the self-review batch announced to the operator before it started and were not entered in the adjacent queue, which holds no queued or running item."
  ],
  "rationale": "D044's mission, trap comparison, Naive Interventionism and NoOp apply. Each fixed finding is a reproduced loss or disagreement inside the repair's own readers and admits a bounded fix with a row. Finding 4 is a design choice the verifier's rule already made; overriding it in the repair that implements that rule would trade one stated contract for another without a real review to judge by, and boarding it keeps the evidence. No finding was left as a report sentence only.",
  "rejected": [
    {"option": "Count entries whose route, id shape or summary is wrong and name them", "reason": "D039 F1(a) records those blocks as unmeasured; the follow-up carries the alternative with its reproduction."},
    {"option": "Add a read-only findings check to the final-review briefing now", "reason": "It is a new reviewer step outside D039's rules; boarded with finding 4."},
    {"option": "Accept any info string on a fence line inside the block", "reason": "An entry written on that line would be dropped and the count would read lower with no advisory."}
  ],
  "followup": "Judge, over the first measured final reviews, whether a findings-block problem in a field that does not enter the count (id shape, route, summary) should be named and counted rather than void the count, and whether the reviewer gets a read-only reading of its block before final-review-result records it. Paths: scripts/lib/review-findings.mjs, scripts/resume.mjs, scripts/test-verification-review.mjs, packages/skeleton/src/loadouts/contributor.ts, docs/product/07-execution-guide.md. Reproduction: a block whose one entry has route 'Blocking' reads unmeasured; a block holding a classless blocking finding and an entry with an empty summary names only the second (repair-004/self-review.md, finding 4). Checks: scripts/test-verification-review.mjs and npm test -- --review. Priority: when a real final review's count is unmeasured for such a field, or with the ten-order reading of the escape count.",
  "reopenWhen": "A real final review records unmeasured for a field that does not enter the count, a fixed finding's row passes without its rule, or a later reader change removes the line that names a section's end."
}
```

## WO-187-D046 — Hand off the format repair on current executable evidence

```json
{
  "id": "WO-187-D046",
  "date": "2026-10-06",
  "dispatch": "resume: fix (VER-004); executor handoff",
  "decision": "Record the completed format repair and return it to independent verification through repair-complete after the inline document gate. Keep D039's strict block validation, the stated start-of-line boundary and the prepared local release; record the two role sentences this repair changed with the finding each answers, and the byte measurements criterion 6 asks for.",
  "evidence": [
    "repair-004/fixture.json: the lifecycle fixture passes at the worktree in 18.61 s and fails against the 08845c71 resume source at 'verify must print the order's known issues'. repair-004/mutations.json: it passes from an unmutated copy and fails at the intended row for each of seven weakened rules.",
    "repair-004/review-gate.json: npm test -- --review passed 38 suites, 0 failed, 88 fresh tasks, forced-fresh under the review selection, 1,607,532 ms, recorded 2026-10-06T06:40:31.695Z at code identity b8245313e92bd0493329f4e38506337ffd28e292b13dfc0cc42ea3e6c3ca34fe. The build task waited 756,200 ms for host lanes held by another worktree's gate before it ran for 680 ms.",
    "repair-004/document-gate.json: npm run test:docs passed 29 suites, 0 failed, 29 fresh tasks, 77,649 ms, recorded 2026-10-06T06:46:41.152Z at the same code identity. The first run of the document gate failed docs-check on one cause, a README link to that record before it existed; the link was removed and the gate rerun. Completion runs the gate again inline over the final documents.",
    "Role sentences changed, and the finding each answers. Reviewer: 'List every finding once, in one block: a <!-- dotln-findings:start --> line, a JSON array of {id, route, class, summary} entries ([] for none) and a <!-- dotln-findings:end --> line ... Only that block is counted, so write its marker lines nowhere else. A block that cannot be read, or a class outside the three, advises and never blocks recording.' It answers VER-004 F1 and D039 F1(a) and F1(d): the result reads a declared block, not prose lines. Executor: '... fix or record each finding and add handoff.md line `self-review: found N; fixed N; recorded N` ...' It answers D039 F1(c) and self-review finding 6: the text is a line of one form. No other role sentence changed; D006 keeps the original mapping.",
    "Criterion 6, measured before and after regeneration (repair-004/cold-start.json): CLAUDE.md 6,873 bytes. Reviewer root 27,641 to 27,882 against 28,884, 1,002 under. Executor root 29,777 unchanged, 531 over its unchanged ceiling 29,246 on FUP-8ce4b4b0104ba41b. Verifier 26,077, release-close 18,485, planner 20,303 and refuter 19,582 unchanged. Both skill trees are equal. docs/control/budgets.json has no diff and no acceptance was added. Product 07 measures 174,675 bytes against 166,907, down 822 from 175,497 and 7,768 over on FUP-0a7c93eed06727ce.",
    "Generated and derived surfaces: npm run harness -- check passed 33 generated surfaces after the last emit. The contributor role text is a registered evidence source, so authority evidence was re-minted as WO-187 revision 002 and docs/evidence/current.json selects it; revision 001 is intact, and the artifact-identity, verification and feedback editions verify unchanged. packages/skeleton/fixtures/wo187-role-baseline.json, this order's own current role oracle, holds the eight new reviewer and executor hashes; no historical oracle changed. The publication source lock for the software-engineer edition was refreshed to the edited section's checked hash, and npm run publication:check passes.",
    "Follow-ups: npm run plan -- followups --sync minted FUP-67a07b670440cf5a for D045. close-register.md keeps the two retargets owed at close and adds prepared dispositions for the rows this repair settles or narrows; the executor applied none. The adjacent queue stays at revision 18 with no queued or running item.",
    "Release: the classified local release stays v0.67.1 with compiler 0.25.3 and skeleton 0.52.4 as already prepared; npm run release -- check-surfaces --local passed before the gates and the review gate's release suites pass. No branch commit or publication was performed.",
    "Actor: claude-code 2.1.291, claude-fable-5-1, effort xhigh read from CLAUDE_EFFORT (selected, not effective). One dotln-worker, zero descendants, cap 20. Entry usage 108,451 cumulative tokens at 2026-10-06T05:25:10.628Z; handoff usage 40,807,566 cumulative tokens (40,073,055 cached input, 250,603 output) after 143 steps and 115 commands at 2026-10-06T06:46:51.287Z, source claude-transcript-message-usage, dispatch scope. Dollar cost and the worker's effective effort are unknown."
  ],
  "rationale": "D044's mission, trap comparison, Naive Interventionism and NoOp hold after execution: VER-004's inputs no longer produce a lower measured count or a dropped carry-in, a block that cannot be read records no count, and every section states where it ended. One adversary and the existing gates supplied independent pressure without another role or refusal. D002 remains the sole economy experiment, kept-current. The review gate took 1,607.5 s against 901.6 s for the previous repair's; 756.2 s of the difference is lane waiting behind another worktree, the subjects differ, and no slowdown of the suites is inferred. Equivalent outcome compared, by inference from the four earlier rounds and not by measurement: a fifth round of parser rules would have needed the same gates and review while keeping the inference those rounds failed on.",
  "rejected": [
    {"option": "Treat the passing executor gates as verification", "reason": "The gates establish executable behaviour; a fresh verifier judges the repaired subject on its own dispatch."},
    {"option": "Overwrite authority revision 001", "reason": "Editions are preserved; a changed registered source selects a new revision."},
    {"option": "Apply the prepared register dispositions now", "reason": "This order's close register leaves them to the closing final reviewer, after verification has judged the repair."}
  ],
  "reopenWhen": "Independent verification finds an in-surface defect, a real report or order meets one of D044's reopening conditions, an edition check goes stale, or a completion check fails."
}
```

## WO-187-D047 — Judge the fresh adversary against the filed-receipt contract and board two design follow-ups

```json
{
  "id": "WO-187-D047",
  "date": "2026-10-06",
  "dispatch": "resume: verify (VER-005)",
  "decision": "Pass the repaired subject after independently judging the fresh adversary's three candidates. The missing-findings receipt reproduction is real for a manually supplied malformed record, but the current receipt validates and canonical filing refuses that input; retain criterion 2 as met and board corruption diagnostics. Board the byte-advisory allocation question as an operator-flow design follow-up, not a new criterion failure. The latent worker-name mismatch is already D034's FUP-3f9d788f4d8c89ac and is not duplicated.",
  "evidence": [
    "One fresh Codex worker, selected gpt-6.1-sol/max with fork_turns none, read only the order and authored diff; no prior narrative, execution, writes or descendants. It returned three source-only candidates. verification-005/adversary.md records their judgments; validation.json binds its inputs. Host readback of effective worker model/effort was unavailable.",
    "verification-005/adversary-receipts.json: an ordinal-2 result.orders row naming WO-187 with absent, null or object findings replaces the earlier readable row in verificationKnownIssues, suppressing its issue without an unavailable advisory. An explicitly empty findings array also suppresses it, correctly clearing earlier issues. This probe deliberately writes synthetic malformed records in granted scratch; it is not a filed planning judgment.",
    "verification-005/receipt-contract.json: validateReceipt accepts the actual selected receipt 040. validatePlanResult rejects its cloned WO-187 row with missing findings (goal-review order shape), null findings or object findings (goal findings must be a bounded array), and accepts an explicit empty array. scripts/lib/plan-receipts.mjs validates the result and receipt before its exclusive write at filing. Manual corruption could affect a briefing before a later planning check; no supported filing path to the malformed row was established.",
    "scripts/docs-check.mjs advisoryByteFollowup accepts only open or deferred follow-up status; the current overrun's FUP-0a7c93eed06727ce is open. scripts/test-docs-check.mjs explicitly tests allocation restoring the hard ceiling failure because allocation is closed in the register, not proof that the optimization happened. The consumed review gate and document gate cover that fixture. The candidate asks whether the advisory should persist through an unfinished allocated optimization; it changes a deliberate policy choice, not an untested accidental branch.",
    "The compiler accepts worker.name dotln-worker2 while scripts/lib/harness.mjs's owned-agent pattern excludes digits. D020 and D034 already record exactly this latent mismatch; close-register.md preserves the remaining agent-path work on FUP-3f9d788f4d8c89ac. The shipped name is dotln-worker, whose generated file passes the 33-surface harness check.",
    "The lifecycle fixture, 273 independent finding-block variations, 45 briefing variations, all 15 real carry-in sections, 166 historical FINAL reports and the last-ten denominator check passed. The source matches checkpoint 18 and code identity b8245313e92bd0493329f4e38506337ffd28e292b13dfc0cc42ea3e6c3ca34fe; coveringGateCheck finds the executor's complete passing review row with no missing suites. VER-005 records all eight criterion judgments and the inline document gate remains required before recording the result."
  ],
  "rationale": "The mission is a truthful verifier input and usable escaped-defect measure, supporting the independently verified delivery loop. Policy resistance/fixes that fail and rule beating: malformed evidence must not masquerade as a cleared issue set, so preserve its reproduction and the exact validator boundary. Drift and seeking the wrong goal: distinguish the supported contract from a hardening proposal rather than normalize lost valid input or fail only to add process. Commons and escalation: one adversary, serial probes, consume the matching product gate, no new phase or refusal. Shifting the burden: the follow-up names both the corrupt-record diagnostic and the pending-allocation decision so neither depends on remembering this conversation. Success to the successful: compare existing strict validation with a small projection advisory and compare allocated-is-closed semantics with unfinished-work semantics. Naive Interventionism: leave the verified implementation unchanged; these alternatives need their own fixtures and current policy comparison. NoOp retains valid current behavior, but without the board would lose the two future triggers. The worker-name inconsistency retains its existing board.",
  "rejected": [
    {"option": "Fail criterion 2 on the malformed synthetic receipt alone", "reason": "The criterion consumes filed planning judgments. The actual receipt validates and the filing validator rejects each malformed findings shape. No valid receipt or supported filing was shown to lose an issue."},
    {"option": "Repair these readers in the verifier session", "reason": "The verifier judges the subject and writes evidence; implementation changes require their own executor and independent verification."},
    {"option": "Create another worker-name follow-up", "reason": "D034 and FUP-3f9d788f4d8c89ac already contain the exact accepted-name versus installed-path reproduction."}
  ],
  "followup": "Assess two bounded design improvements: (1) in scripts/lib/verification-briefing.mjs, advise when a newer receipt's matching order row has missing or non-array findings, without treating malformed evidence as an explicitly empty list or silently presenting stale issues as current. Reproduction: verification-005/adversary-receipts.json; retain the current validatePlanResult rejection and explicit-empty clearing behavior from receipt-contract.json. (2) in scripts/docs-check.mjs and scripts/test-docs-check.mjs, decide whether an advisoryDecision remains advisory when its current follow-up is allocated to an unfinished optimization order, or make the allocation-to-hard-failure consequence explicit in product 07. Reproduction: the existing WO-187 byte-goal fixture changes open/deferred to allocated while the same two-byte overrun remains. Checks: the verification-review and docs-check fixtures, npm run test:docs and the affected machinery review gate. Coordinate the second item with D033's existing document-ceiling route work; no ceiling increase is authorized. Priority: low, when actual receipt corruption reaches a briefing or when an overrun's optimization is allocated before the text fits.",
  "reopenWhen": "A valid filed receipt loses known issues, a corrupt receipt reaches verify without its invalidity being exposed, or allocating an unfinished optimization unexpectedly blocks a document handoff. The first condition is an in-surface correctness failure, not this deferred hardening case."
}
```

## WO-187-D048 — Integrate main at 602f7e83 during final review

<!-- integration refs/dotln/checkpoint/WO-187/22 -->

```json
{
  "id": "WO-187-D048",
  "date": "2026-10-06",
  "dispatch": "resume: final review; worktree integrate WO-187",
  "decision": "Integration mechanics are complete in the final-review worktree. HEAD fast-forwarded from c44ba6c6 to main at 602f7e83 (WO-123, v0.67.0), and the named stash re-applied this order's uncommitted work. D049 records the six authored resolutions, the skeleton retime, the two re-minted evidence editions, the affected checks and the integrated product gate.",
  "evidence": [
    "refs/dotln/checkpoint/WO-187/22",
    "base c44ba6c60d7a3049f15edc4ce106b2dcc518b551",
    "upstream 602f7e83190cb4b8e8b9521feee8262e00fff485",
    "release preparation: WO-187 target v0.67.1 remains current. Files changed: docs/evidence/WO-187/meta.json, docs/final-reviews/WO-187/PR.md. Meter snapshot: docs/evidence/WO-187/meta.json, 4471 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-06. Original base: `c44ba6c60d7a3049f15edc4ce106b2dcc518b551`.
Fetched main: `602f7e83190cb4b8e8b9521feee8262e00fff485`. Checkpoint: `refs/dotln/checkpoint/WO-187/22`.
Named stash retained: `154b7ff3b72b3cf31eebc78d67f67201d0ebd042` (WO-187 integrate 2026-10-06).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md, packages/console/fixtures/expected/selfhost.html, packages/console/fixtures/expected/selfhost.json, packages/console/fixtures/expected/selfhost.txt.
Release preparation: WO-187 target v0.67.1 remains current. Files changed: docs/evidence/WO-187/meta.json, docs/final-reviews/WO-187/PR.md. Meter snapshot: docs/evidence/WO-187/meta.json, 4471 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer in D049. Every non-document path that differs from checkpoint 18 (VER-005's subject) is a path upstream also changed, and this order's five new source files hash equal to that checkpoint, so the authored WO-187 source carried into the integration unchanged. Criteria 1 to 7 carry forward on VER-005's evidence, re-checked on the integrated tree where D049 says so; criterion 8 is judged on this review's own gates.
Authored conflicts observed: docs/control/doc-ceilings.json, docs/evidence/current.json, package-lock.json, packages/console/fixtures/manifest.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks were printed by the command and executed on the integrated tree, as D049 records.

## WO-187-D050 — The reviewer cleared the index during a comparison and restored it

```json
{
  "id": "WO-187-D050",
  "date": "2026-10-06",
  "dispatch": "resume: final review; reviewer correction",
  "kind": "correction",
  "misread": "The reviewer treated `git add -N -- .` followed by `git reset -q` as a harmless way to make untracked files visible to a diff against the verified checkpoint.",
  "meant": "The index is preserved state: the executor had staged five new source files, and the reviewer role forbids a reset. Untracked files are compared with a checkpoint by hashing them, with no index change.",
  "changed": "Re-staged the five new source files and compared them with checkpoints 18 and 21 by blob hash. No working-tree byte changed, and no later comparison in this review touches the index.",
  "decision": "Record the reviewer's own process error and its repair. After the integration completed, one comparison command ran `git add -N -- .` and then `git reset -q`, which emptied the index. The working tree was untouched. The five new source files the executor had staged were staged again, and the carried-bytes comparison was rerun without index changes.",
  "evidence": [
    "After the reset, `git status --short` listed 65 modified and 9 untracked paths and no staged entry; before it, .claude/agents/dotln-worker.md, packages/skeleton/fixtures/wo187-role-baseline.json, scripts/lib/review-findings.mjs, scripts/lib/verification-briefing.mjs and scripts/test-verification-review.mjs were staged additions.",
    "`git hash-object` of each of those five files equals `git rev-parse refs/dotln/checkpoint/WO-187/21:<path>` and `refs/dotln/checkpoint/WO-187/18:<path>`: 4df43786, 1cc665cf, 34ecfaa3, 8da8b5c8 and 589b7146.",
    "`git add -- <the five paths>` restored the five `A` entries. `git diff --name-only --diff-filter=U` is empty, and the six conflict resolutions are working-tree content a mixed reset does not change.",
    "The integration's named stash 154b7ff3b72b3cf31eebc78d67f67201d0ebd042 and checkpoint refs/dotln/checkpoint/WO-187/22 are retained and hold the pre-integration state.",
    "Rerun after the repair: 58 non-document paths differ from checkpoint 18, and every one is a path upstream changed between c44ba6c6 and 602f7e83.",
    "This record's reopening condition then occurred once. After the result was recorded and the gates had run, the command that wrote the first commit message ended with a stray `git reset -q`, which emptied the index again. git status afterwards lists 65 modified and 9 untracked paths; no working-tree byte changed, the code identity does not depend on staging, and each commit that follows stages its own paths explicitly, the five new source files among them."
  ],
  "rationale": "Correctness over sycophancy applies to the reviewer's own record: the report must not present a clean procedure that did not happen. Naive Interventionism: the repair restores the staged state and changes nothing else. NoOp would leave the new source files unstaged before the product gate, contrary to the reviewer procedure, and leave the error unrecorded.",
  "rejected": [
    {"option": "Leave the index empty until the commit", "reason": "The reviewer procedure stages intended new source files before the product gate, and the executor's staged state was part of what was handed over."},
    {"option": "Restore the index from the integration stash", "reason": "The stash predates the merge; applying it again would reintroduce the resolved conflicts. Re-staging the five files reaches the same index entries for them."}
  ],
  "reopenWhen": "A staged or working-tree path of this order is found to differ from what this record states, or a later reviewer command changes the index outside a commit."
}
```

## WO-187-D051 — Ship the sub-agent duties as filed and board a separate improver sub-agent for planning

```json
{
  "id": "WO-187-D051",
  "date": "2026-10-06",
  "dispatch": "resume: final review; operator question and choice during the review",
  "decision": "Ship WO-187's sub-agent duties as the order filed them. The operator confirmed that a fresh adversary at executor completion, including each repair, matches what they asked for, and chose to board the one remaining difference for planning: a separate principal-engineer improver sub-agent beside the adversary. It is a follow-up, not a defect against the order.",
  "evidence": [
    "During this final review the operator said, paraphrased, that they had asked planning for an adversarial sub-agent plus one principal-software-engineer improver sub-agent at the end of implementation, to confirm or critique the work, and asked whether the adversary now present in the executor, repair, verification and final-review dispatches is correct.",
    "What the subject holds: packages/skeleton/src/loadouts/contributor.ts line 121 (executor) has one fresh adversary read only the order and diff as an improver too, before either completion; line 135 (verifier) has the verifier attack the change, review the whole implementation itself and use one fresh adversary. The reviewer procedure gains no sub-agent duty. The adversary in this final review was the reviewer's own choice under the existing fan-out rule.",
    "The order's Design (Verifier (a) to (c); Executor) and operator-review assumption 2 say the same, so the subject matches the order.",
    "docs/planning/standard-pass-2026-10-02.md section 1, item 6, is the planning pass's paraphrase of the operator's note: an executor might spawn at least one adversarial or improving reviewer even without the multi-agent mode. The note itself is in ignored intake, which this worktree does not hold, so the paraphrase was not compared with it.",
    "The operator then said, paraphrased, that they do remember asking for adversarial review in the executor and the repair as well, so that placement is correct, and agreed to ship as filed and board the difference for planning.",
    "Later in the review the operator added, paraphrased: this is no direction to fail the review, but if the review did fail, the boarded item is to be unboarded and made part of that repair. The review passed (D052), so the item stays boarded.",
    "Cost observed in this order's reports: VER-001's adversary used 227,686 tokens in 675 s, VER-003's 183,071 tokens, VER-004's 175,796 tokens, and the VER-004 repair's worker 216,973 tokens in 712,355 ms."
  ],
  "rationale": "Mission and critical path: the order's measure is the escape count, and it needs the order merged to start counting. Policy resistance and fixes that fail: a role-text change at final review would return the order to repair and a sixth verification after four repair cycles. Shifting the burden: the operator decided once, here, and the follow-up carries the remaining question to planning without depending on this conversation. Rule beating and seeking the wrong goal: the subject is judged against the filed order, and the difference from the operator's stated intent is recorded rather than passed over. Commons and escalation: a second worker per completion roughly doubles that cost, so planning weighs it against the first measured escape counts. Naive Interventionism: nothing in the verified subject changes. NoOp would lose the operator's stated intent.",
  "rejected": [
    {"option": "Change the role text in this order", "reason": "The operator chose to ship as filed; a reviewer does not write a behavioral change and certify it, so it would need a repair and fresh verification."},
    {"option": "Record the difference as a blocking or operator-route finding", "reason": "The subject matches the order's Design, and the operator has made the choice."}
  ],
  "followup": "Planning: decide whether executor completion, and verification, should spawn a separate principal-engineer improver sub-agent beside the fresh adversary, in place of one dual-role agent at executor completion and the verifier's own implementation review. Paths: packages/skeleton/src/loadouts/contributor.ts (executor and verifier procedures) and docs/product/07-execution-guide.md section Verification review and attack. Evidence: this decision, D041's record of two self-reviewed repairs that still failed verification, and the escape counts of the orders that follow. Weigh the cost: each fresh worker in this order used 175,796 to 227,686 tokens. Priority: the next planning pass, with D041's and D042's items.",
  "reopenWhen": "The order returns to repair before it merges, in which case the operator directs that this item be unboarded and made part of that repair; the operator directs the two-agent form before planning judges it; or planning files or declines it."
}
```

## WO-187-D049 — Integration resolutions, the skeleton retime and the integrated gate

```json
{
  "id": "WO-187-D049",
  "date": "2026-10-06",
  "dispatch": "resume: final review; worktree integrate WO-187",
  "decision": "Resolve the six authored conflicts as bookkeeping, keep the release at v0.67.1 under its patch classification, retime the skeleton's patch bump above upstream's release, and re-mint the two evidence editions the new base staled. The skeleton moves to 0.53.1 above upstream's 0.53.0 and pins beacons 0.1.1; the compiler keeps 0.25.3 and the harness host 0.34.5; the console pins skeleton 0.53.1; the lockfile carries the same versions. Product 07's ceiling entry takes upstream's 168,083 bytes and planning decision and keeps this order's advisoryDecision. The evidence selector keeps this order's editions: authority is re-minted as revision 003, feedback 003 carries upstream's live audit, and artifact identity 001 and verification 001 verify unchanged. The console fixture capture keeps upstream's thirteen WO-123 sentences ahead of this order's, and its self-hosted inputs follow feedback 003.",
  "evidence": [
    "npm run worktree -- integrate WO-187: checkpoint refs/dotln/checkpoint/WO-187/22, named stash 154b7ff3b72b3cf31eebc78d67f67201d0ebd042, bases c44ba6c6 -> 602f7e83; authored conflicts docs/control/doc-ceilings.json, docs/evidence/current.json, package-lock.json, packages/console/fixtures/manifest.json, packages/console/package.json, packages/skeleton/package.json. git ls-files --others --ignored over docs/intake lists no file in this worktree, so no intake backup was named. --continue regenerated the runtime, harness bundle and manifest, control projection, release preparation, decisions index, register and meta, work-order index, publication locks and console fixtures, with no authored conflict left.",
    "Carried bytes: git diff --name-only refs/dotln/checkpoint/WO-187/18 (VER-005's subject) against the working tree, outside docs/: 58 paths differ and every one is a path upstream changed between c44ba6c6 and 602f7e83. The five new source files hash equal to checkpoints 18 and 21. Of this order's authored paths only docs/control/doc-ceilings.json (this resolution), docs/product/07-execution-guide.md and scripts/test-runner.mjs (both merged without conflict with upstream's write-back and its vertical suite registration) differ from checkpoint 18.",
    "Versions: npm run release -- check-surfaces --local exits 0 with release-block v0.67.1 above the latest local tag v0.67.0; @dotln/compiler src changed, 0.25.3 against 0.25.2; @dotln/skeleton src changed, 0.53.1 against 0.53.0; beacons, kernel, console and browser-evidence unchanged; every workspace pin exact. The skeleton's bump was 0.52.3 to 0.52.4 at verification; upstream released 0.53.0, so the same patch bump is retimed to 0.53.1. D036 had already retimed the application target to v0.67.1.",
    "Edition checks before the re-mint, each bounded: authority revision 002 stale on bundle-diff.json; feedback 002 stale because upstream changed judged sources since the audit it carried (WO-184/feedback-003); artifact identity 001 and verification 001 pass. The check of upstream's live edition WO-123/feedback-013 on the integrated tree reports only that a compiler release moved the policy hash, and prescribes a carry with no live episode. authority-evidence --write --edition WO-187 --revision 003 and feedback-evidence --carry docs/evidence/WO-123/feedback-013 --edition WO-187 --revision 003 each exit 0. All four --check runs then pass at the selected revisions, and console-fixtures --record-current-selfhost followed by --check passes all five cases.",
    "Affected checks on the integrated tree, each bounded and exit 0: node scripts/harness.mjs check (33 generated surfaces), npm run publication:check (both editions current), npm run release -- check-surfaces --local, and node scripts/docs-check.mjs (0 failures; product 07 reports 7,798 bytes over 168,083 as an advisory on FUP-0a7c93eed06727ce). The lifecycle fixture passes at the integrated subject in 15,528 ms and fails against 08845c71:scripts/resume.mjs at 'verify must print the order's known issues' (scripts/test-verification-review.mjs:129).",
    "npm test -- --review on the integrated tree at code identity 23cf9cb2d54aca6bacfc46a0036c91f22fb7e26e0e81cc132f960c5907b3ceff: 39 passed, 0 failed, 1,348.92 s, 89 fresh tasks, forced-fresh under the review selection, recorded 2026-10-06T14:33:27.454Z. The suite count is one above the executor's 38 because upstream added the vertical suite, which took 712.59 s."
  ],
  "rationale": "Mission and critical path: the order's count starts when it merges, and it merges on the current base. Rule beating: VER-005's gate row is not a proxy for the integrated tree, so the gate ran fresh. Drift to low performance: stale editions are re-minted rather than relabelled, and the feedback edition carries the audit that judged the integrated tree's sources. Shifting the burden: conflicts and the version collision are resolved here, not left to the release close. Commons, escalation and success to the successful: one writer, bounded checks, no new producer. Naive Interventionism: no behavioral source changed during integration; the resolutions touch version labels, the ceiling entry, the selector and the fixture capture. NoOp would publish against an outdated base with stale editions.",
  "rejected": [
    {"option": "Select upstream's WO-123 editions", "reason": "They predate this order's registered sources, the contributor role text and the compiler's harness lowering, and would not judge the integrated tree."},
    {"option": "Run a live feedback episode for feedback 003", "reason": "This order changes no file the feedback verifier judges; upstream's live audit judged those sources, and its own check prescribes the carry."},
    {"option": "Keep skeleton 0.52.4", "reason": "It is below upstream's released 0.53.0, and the release-surface check requires a version different from the previous release for changed source."},
    {"option": "Take upstream's product 07 ceiling entry without the advisoryDecision", "reason": "This order's write-back is 7,798 bytes over that ceiling; D003, D013 and D019 record the operator's direction that the overrun is boarded, not raised or trimmed."}
  ],
  "reopenWhen": "An authored resolution is found to change behavior, a component label collides with a later upstream release before publication, or an edition check fails on the published subject."
}
```

## WO-187-D052 — Pass the integrated subject and board seven low findings

```json
{
  "id": "WO-187-D052",
  "date": "2026-10-06",
  "dispatch": "resume: final review; reviewer and fresh adversary findings",
  "decision": "Pass WO-187 at the integrated subject. Board seven findings, none blocking: three present in the verified subject (class escape) and four that ask for something the order did not set out to do (class new-scope; one of them is D051's). Keep D020's register row open rather than apply its prepared decline. Judge the fresh adversary's other items as already boarded, recorded known issues, or readings this review accepts.",
  "evidence": [
    "One fresh dotln-worker (definition pin claude-opus-5-5, xhigh; launched by type with no model override) read only the order and the integrated authored diff, SHA-256 a99b61f1bda9376ef2222676e00abb7a5d33f865c8b2773ae4b8c8c90a3452ef, and no evidence, report, decision or register file. It reported twelve items and said none stops a result from recording or breaks criteria 1 to 5 as written. The host reported 308,683 worker tokens, 132 tool uses and 1,607,429 ms; the worker reported its model as claude-opus-5-5 and no effort. One worker, zero descendants, cap 20.",
    "F1, escape: scripts/docs-check.mjs advisoryByteFollowup accepts any evidence decision that has a followup string and an open or deferred register row. Nothing checks that the decision concerns the document it excuses, and naming one needs no planning decision. D033 boards the missing bound and D047 the allocation consequence; this specific is new. Read in source.",
    "F2, escape: scripts/resume.mjs lines 1371 to 1378 append VerificationRequested before building the briefing, and scripts/lib/verification-briefing.mjs reads the order and the receipts directory unguarded. Reproduced by the reviewer in a private copy of the fixture repository: with the order file moved after implementation-ready, verify exits 1 with 'invalid work-order authority path', prints no report path, and the last event is VerificationRequested; with docs/planning/refutations replaced by a regular file, verify exits 1 with ENOTDIR and the same last event; resume briefing fails while either state lasts. After the path is restored, resume briefing exits 0, names VER-001.md and prints the carry-in in both cases. A control order verifies normally.",
    "F2's route: the surface is declared, so the in-surface rule applies unless this is not a defect a supported workflow meets. Every lifecycle command before verify has just read the order at its recorded path, the receipts path is a directory or absent in every repository state the planning commands produce, restoring the path loses nothing, and D047 judged the sibling case in the same module, a hand-corrupted receipt, as hardening. It is boarded, with a real verify that errors after recording as a blocking reopening condition.",
    "F3, escape: the reviewer procedure in packages/skeleton/src/loadouts/contributor.ts names the three classes and says product 07 defines them, with neither the definitions nor a Read directive for that section; the verifier root has the directive.",
    "F4, new-scope: no route describes a defect a reviewer fixes within the boy-scout bound on a passing review. Product 07 defines blocking as failing the verdict and follow-up as a boarded item, while the order's observed gap counts 21 such self-fixes among what final reviews found. The three routes are the order's operator-review assumption 3.",
    "F5, new-scope: the verify briefing prints the order's sections and the latest receipt's known issues, as the Design says. It prints no carry-in held on a planning map row (docs/work-orders/WO-112-core-run-loop-proof.md lines 149 and 170 point at one), and prints nothing when the latest receipt names no known issue, so none and cleared read alike.",
    "F6, new-scope: D051, the separate improver sub-agent the operator described.",
    "F7, new-scope: a recursive copy of a repository that holds a Beacon group file writes the file's sparse logical size out in full. The fixture repository's .control-beacons/groups file has a logical size of 96,383,980,230 bytes and occupies almost nothing. The adversary's probe copy reached 90 GB and the reviewer's 65 GB before the volume was full (D053). packages/skeleton/README.md says never to copy a sparse group as content; nothing a prober reads in the role text or product 07 says so.",
    "Judged, no finding. A prose finding beside a block is not counted: the declared format, stated in the reviewer root and product 07 and pinned by a fixture row; D042 records the operator's view that the change of reader needed no authorization. The installer replaces an existing .claude/agents file without the ownership refusal .codex outputs get: it treats the path as it already treats .claude/hooks and the dotln- skills. The plan start block is 968 of 1,024 bytes on the real record: D016's reopening condition covers a block that exceeds the bound. The executor root's 531 bytes and a stale self-review line are FUP-8ce4b4b0104ba41b and receipt 040's criterion-3 known issue with D041.",
    "Register: close-register.md prepares 'declined' for FUP-82e9f0bda503c40c (D020) for its class-label half. D020's follow-up also holds the worker pin written in two places, the name shared with the Codex permission profile, the two name patterns and plan failures showing escapes 0 for unmeasured orders, each of which still holds and the first of which the adversary found again. The row stays open, narrowed."
  ],
  "rationale": "Mission and critical path: the order's measure starts with an honest first count, so each finding is classed by where it arose. Policy resistance and fixes that fail: four repairs of this order each opened a new defect; none of these seven loses a record, a count or a carry-in in a supported workflow, so none returns the order to a fifth. Rule beating and drift: the in-surface rule is applied to F2 with its reason stated rather than passed over, and a prepared disposition that would have dropped valid items is not applied. Shifting the burden: one follow-up row carries the items with their paths and reproductions; byte matters go to no one. Commons and escalation: one worker and no new check. Seeking the wrong goal: three escapes on the first measured review are low items, and the count does not weigh severity. Naive Interventionism: the verified source is unchanged. NoOp would leave the items only in a report.",
  "rejected": [
    {"option": "Fail the review on F2", "reason": "No supported workflow reaches either state and restoring the path recovers the briefing; D047 routed the sibling case the same way."},
    {"option": "Send F1 to the operator as a decision", "reason": "D019 records the operator's direction that byte matters are settled within existing authority and never put to them."},
    {"option": "Fix F2 or F3 in the review", "reason": "A reviewer does not write a behavioral or role-text change and certify it."},
    {"option": "Apply the prepared decline of D020's row", "reason": "It would drop four items that still hold."}
  ],
  "followup": "Planning, low priority unless a condition occurs. (1) scripts/resume.mjs and scripts/lib/verification-briefing.mjs: build the verify briefing before appending VerificationRequested, or turn a failed read of the order or the receipts directory into one advisory line; reproduction in this decision's F2 evidence. (2) packages/skeleton/src/loadouts/contributor.ts, reviewer procedure: give the reviewer the three class definitions or a Read directive for product 07 section Verification review and attack. (3) Routes: decide how a final review lists a defect it fixed within the boy-scout bound on a passing review. (4) Briefing sources: decide whether the verify briefing prints carry-ins held on a planning map row and says when the latest receipt names no known issue. (5) scripts/docs-check.mjs: with D033's bound, require an advisoryDecision to concern the document it excuses. (6) Probes: say where a prober reads it that a repository copy must leave out .control-beacons, or have fixtures not leave a sparse group file behind; reproduction in D053. Checks: scripts/test-verification-review.mjs, scripts/test-docs-check.mjs, npm run harness -- check, npm test -- --review and npm run test:docs.",
  "reopenWhen": "A real verify dispatch errors after recording, which is then a blocking defect; a final review misclasses a finding for want of the definitions; a reviewer self-fix goes unlisted; or a probe again fills a disk by copying a repository."
}
```

## WO-187-D053 — The reviewer's reproduction probe filled the disk and was removed

```json
{
  "id": "WO-187-D053",
  "date": "2026-10-06",
  "dispatch": "resume: final review; reviewer correction",
  "kind": "correction",
  "misread": "The reviewer took the fixture repository's size on disk, 7.0 MB, as what a recursive copy of it would write, and briefed the adversary to build a throwaway repository copy for any end-to-end probe without naming an exclusion.",
  "meant": "A Beacon group file is sparse and encodes its signal in its logical size, 96,383,980,230 bytes in that fixture. A recursive copy writes that size out in full, and packages/skeleton/README.md says never to copy a sparse group as content.",
  "changed": "Removed both probe copies from session scratch, which returned the volume from 1.0 GiB to 159 GiB available. Reran the reproduction with .control-beacons excluded and a 64 MiB per-file guard; that copy is 6.4 MB.",
  "decision": "Record that two probe copies made during this review filled the host's data volume, and how it was repaired. The adversary's copy held 90 GB from about 14:08Z. The reviewer's own copy, made after the product gate had recorded its row at 14:33:27Z, wrote 65 GB until the volume reported no space left. The volume stood at 100 percent, 1.0 GiB available, until both copies were removed a few minutes later.",
  "evidence": [
    "df -h after the reviewer's probe failed with ENOSPC: 926 GiB size, 899 GiB used, 1.0 GiB available. du -sh of session scratch: 154 GB, of which f2-root 65 GB and adversary/probes/p7-root 90 GB.",
    "ls -la of the source fixture's .control-beacons/groups shows one .beacon file of 96,383,980,230 bytes; du -sh of that fixture repository is 7.0 MB.",
    "rm -rf of the two copies, both created by this session's probes in host scratch; afterwards df -h shows 741 GiB used and 159 GiB available, and session scratch is 20 MB.",
    "The worktree afterwards: git status lists the same 5 staged additions, 65 modified and 4 untracked paths; git diff --check exits 0; the decisions file, the control log, the register and the evidence selector parse. The product gate's row was recorded before the reviewer's copy began.",
    "packages/beacons/src/beacon-io.mjs sizes sparse group files with ftruncate, and packages/skeleton/README.md line 647 states the rule against copying one."
  ],
  "rationale": "Correctness over sycophancy applies to the reviewer's own record. Commons: the volume is shared with the operator's other worktree and sessions, and a full disk can fail their writes. Whether any other process met an error in those minutes is unknown; none was observed from this session. Naive Interventionism: only the two scratch copies were removed. D052 boards the missing guidance so the next prober does not repeat it.",
  "rejected": [
    {"option": "Leave the adversary's copy as its evidence", "reason": "It held 90 GB of zeros; its probe script and results are kept."},
    {"option": "Treat it as a product defect of this order", "reason": "The sparse file is Beacon behavior this order does not change, and the rule against copying it is documented."}
  ],
  "reopenWhen": "A process is found to have failed for lack of space during those minutes, or a later probe of this review writes a file near that size."
}
```

## WO-187-D054 — FINAL-001 says the result transition reruns the document gate; it does not

```json
{
  "id": "WO-187-D054",
  "date": "2026-10-06",
  "dispatch": "resume: final review; reviewer correction after the result",
  "kind": "correction",
  "misread": "The reviewer assumed final-review-result reruns the document gate inline, as the executor's and verifier's completions do, and wrote in FINAL-001's criterion 8 that the result transition runs it again inline.",
  "meant": "final-review-result runs git diff --check, reads the report's actor, cost, criterion lines and findings block, and binds the product gate. It runs no document gate.",
  "changed": "FINAL-001 is filed and its bytes stay as recorded. The reviewer ran npm run test:docs on the filed report and final documents after the result: 29 passed, 0 failed, 86.27 s.",
  "decision": "Record that one sentence of the filed FINAL-001 is wrong and what stands in its place. The document gate the report cites (29 of 29, 85.48 s, recorded 2026-10-06T14:45:31.028Z) ran before the report's last edit, which filled in that gate's own result line. No document gate ran at the transition. A further run after the result covers the filed bytes.",
  "evidence": [
    "The gate index after the result holds npm run test:docs at 2026-10-06T14:45:31.028Z (85,484 ms, exit 0) and git diff --check at 14:46:18.643Z, and no document gate row at the transition; the FinalReviewCompleted event recorded at 14:46:19.557Z carries the product gate and no document gate.",
    "The edit between that gate and the result replaced one placeholder in FINAL-001's criterion 8 with the gate's result sentence and added no link.",
    "npm run test:docs after the result, on the filed FINAL-001, PR.md, RELEASE-NOTES.md and D048 to D053: 29 passed, 0 failed, 86.27 s, 29 fresh tasks.",
    "The recorded reportHash equals FINAL-001's current SHA-256."
  ],
  "rationale": "A filed report is never edited, and a wrong sentence in it is corrected in the open rather than left. Criterion 8 stands: the document gate passes on the filed bytes. Naive Interventionism: no report byte or event changes. NoOp would leave a false statement about what the transition checks.",
  "rejected": [
    {"option": "Edit FINAL-001", "reason": "Its bytes are bound by the recorded reportHash; a filed report is superseded only by a later report."},
    {"option": "File FINAL-002 for one sentence", "reason": "The verdict and every criterion judgment are unchanged; a correction record states the error without a second judgment."}
  ],
  "reopenWhen": "A document check fails on the committed report, or another statement in FINAL-001 is found to be wrong."
}
```
