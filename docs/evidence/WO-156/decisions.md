# WO-156 decisions — plan check path-pattern hoist

Dispatch: `resume: next`, 2026-09-24. Actor: Codex CLI 0.156.1,
`gpt-6-sol`, effort `xhigh` (session readback). Authority:
`docs/work-orders/WO-156-plan-check-sub-second.md`. This is a local-host
measurement; times are wall seconds, not a cross-host guarantee.

## WO-156-D001

```json
{
  "id": "WO-156-D001",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-156 design and criteria 1, 3 and 4",
  "decision": "Resolve the configured work-order root once per buildPlanSubject call and compile one regular expression per sequence id outside the committed-path filter. Keep loadConfig's per-call stat and all Git reads unchanged. Add a fixture with 256 unrelated committed files, a statSync bound below 100, and the original subject JSON hash.",
  "evidence": [
    "ER2-004 in REVIEW-002 and REFUTATION-003: 3,879,656 statSync calls; stack samples attributed the repeated calls to rootPattern inside the committed-path filter.",
    "scripts/lib/config.mjs cacheKey stats the configuration path on each loadConfig call to detect mid-process changes; scripts/lib/plan-subject.mjs used rootPattern within the filter.",
    "Red fixture on original builder: 543 statSync calls and subject JSON sha256:85f125dae6144d26d6f714021665654645a8a5c985292f04083a135be42f87ef; green after hoist: 10 calls and the same hash.",
    "On the same assigned worktree before and after the code edit, plan subject stdout SHA-256 was 2eccf9e2858f85b24c658ed3d826eca29716b8b893e3ce1baf9978868051a9ed and plan check stdout SHA-256 was b11acd1eff3152523eaed0ef113c8223ddb8c98e31d53a627305fe60ce4476e8 on both runs."
  ],
  "rejected": [
    {"option": "NoOp", "reason": "The measured per-path configuration stat remained on every planning pass and final review."},
    {"option": "Memoize loadConfig without its stat", "reason": "That would remove the recorded mid-process configuration change detection."},
    {"option": "Batch Git reads in this edit", "reason": "The order fences Git work out, and its residual cost needed a measurement after the hoist."}
  ],
  "reopenWhen": "A configured-root fixture changes subject bytes, the stat count rises to the bound, or the planning gate reports a new semantic difference."
}
```

Goal alignment: reducing recurring planning-gate cost frees operator time for
the independently verified source-to-deliverable loop; the cut neither reorders
that critical path nor claims a new product capability. Policy resistance and
Naive Interventionism favor preserving configuration freshness and subject
identity. The shared-compute cost (commons), lower-performance drift and wrong
goal are checked by measured gate durations plus the unchanged subject; a
passing speed number alone cannot beat the output rule. One hoist and one
fixture avoid escalating process. The design compares NoOp and the cache and
Git alternatives on their evidence, without favoring prior investment; the
recurring host cost falls without shifting rescue to the operator. The change
is reversible and leaves existing consumers and publication controls intact.

## WO-156-D002

```json
{
  "id": "WO-156-D002",
  "kind": "experiment",
  "date": "2026-09-24",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "decision": "Keep the current method; decline a second economy experiment because this order already prescribes a paired baseline and after measurement of the only credible local cost cut.",
  "question": "Would a separate method experiment improve this order's implementation economy beyond its required before/after timing and red/green regression?",
  "alternatives": ["Run the required paired measurements and fixture only", "Add a separate method trial for this single-line hoist"],
  "observation": "The order already specifies the deciding observation: identical output, statSync reduction, and host wall time before and after. A second trial would duplicate those commands without changing the implementation choice.",
  "budget": {"wallSeconds": 900},
  "execution": "declined",
  "reason": "The order's mandatory timing and red/green regression already compare the relevant method; another trial would spend time without distinguishing the choices.",
  "cost": {"wallSeconds": 0, "tokens": null, "commands": ["No experimental command: declined"], "source": "Zero experiment execution seconds because no separate experiment ran; preparation and recording were part of the required order work and were not separately timed."},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["No experimental command: declined"], "summary": "No additional method adopted; the required order measurements, reported separately, evaluate the hoist."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "evidence": ["WO-156 requires paired timings and a red/green fixture for this one hoist; those commands were already executed as acceptance evidence."],
  "rejected": [{"option": "Run a separate method trial", "reason": "It would duplicate the order's prescribed comparison without a second bounded implementation candidate."}],
  "reopenWhen": "A later order has two credible implementation methods whose costs are not already compared by its acceptance checks."
}
```

## WO-156-D003

```json
{
  "id": "WO-156-D003",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-156 criterion 2 and explicit over-2-second follow-up rule",
  "decision": "Preserve the measured hoist and file the remaining plan-check latency for a separate bounded order; the 2 s objective is not met on this host.",
  "evidence": [
    "Assigned-tree before: plan check 17.86 s; after: 2.85 s, both exit 0. The order's 2026-09-22 comparator was 16.46 s.",
    "test:docs before: plan 25.27 s, plan-refutation-current 25.20 s, gate 30.80 s, 21 passed; after: plan 3.25 s, plan-refutation-current 3.19 s, gate 24.41 s, 21 passed. Other concurrent tasks limit the gate-wall reduction.",
    "A single post-hoist CPU profile sampled spawnSync in node:internal/child_process 1,079 of 2,479 samples (43.5%); the previous ER2-004 review counted 212 spawns before the hoist. Current spawn count and the safe batching shape remain unmeasured."
  ],
  "rejected": [
    {"option": "Claim the sub-2-second target passed", "reason": "The measured 2.85 s exceeds it."},
    {"option": "Change Git reads in WO-156", "reason": "The order explicitly reserves this distinct hotspot for a follow-up after profiling."},
    {"option": "Discard the hoist because the residual target missed", "reason": "It removes the diagnosed per-path load and preserves byte-identical output, with a large measured recurring reduction."}
  ],
  "followup": "Planner: cut a bounded order to profile and reduce synchronous Git spawning on the plan check path after WO-156. Start with scripts/lib/plan-receipts.mjs, scripts/lib/plan-subject.mjs and their runGit call sites; test a batch or cache that preserves committed/workspace subject bytes and configuration freshness. Re-run plan subject/check byte comparisons, the fixture suite, and host wall timing, targeting under 2 s. Priority: medium; 2.85 s remains on each plan check, but the original 17.86 s hotspot is removed.",
  "reopenWhen": "A repeat on this host reaches under 2 s without Git changes, or a profile shows a different dominant remaining cost."
}
```

## WO-156-D004

```json
{
  "id": "WO-156-D004",
  "date": "2026-09-24",
  "dispatch": "resume: verify; VER-001 F1, WO-156 criterion 2",
  "decision": "Return criterion 2 to repair: node scripts/refute-plan.mjs check still takes over 2 s wall-clock on the operator's host. The hoist, byte identity, regression and timing record hold, but the order lists all five criteria as required, and its design clause that routes the residual cost to a follow-up does not waive the 2 s bound. On the current text a repair has no in-scope route to the bound, because the remaining dominant cost, synchronous Git spawning, is a stated non-goal.",
  "evidence": [
    "VER-001: three runs of /usr/bin/time -p node scripts/refute-plan.mjs check on the current subject at HEAD a403671d took 2.75 s, 2.69 s and 2.68 s real, all exit 0; the executor recorded 2.85 s in D003.",
    "VER-001: the original builder on the same tree, loaded through a scratch resolve hook, took 17.18 s and 17.44 s; statSync calls for the whole check fell from 4,192,595 to 11,343, and the check made 240 spawns after the hoist.",
    "VER-001 CPU profile of the current check: spawnSync 1,323 ms of 3,046 ms profiled self time (43.4%) over 2,471 samples; the next largest entries are meaningful at scripts/lib/plan-receipts.mjs:375 (10.2%) and the whitespace and newline expressions (5.8% and 4.7%).",
    "WO-156 non-goals exclude batching or caching Git reads, and the design says to touch nothing else in the builder; D003 already files that remaining cost as FUP-3dc0266d6b87b939."
  ],
  "rejected": [
    {"option": "Read the design's over-2-second clause as a conditional pass of criterion 2", "reason": "The clause tells the executor not to widen the order and to file the next hotspot; the criterion's under-2-second bound is unchanged, and the order lists every criterion as required."},
    {"option": "Treat the 84% reduction as meeting the objective", "reason": "The objective and criterion state an absolute bound; the reduction is recorded as measured, not as the bound."}
  ],
  "followup": "resume: fix WO-156 VER-001 F1 after an operator decision the verifier cannot make: either an operator scope expansion that admits the plan-check Git-spawn reduction (now FUP-3dc0266d6b87b939, a WO-156 non-goal), recorded with npm run plan -- amend-order, followed by node scripts/refute-plan.mjs check under 2 s with byte-identical plan subject and plan check output and fresh verification; or an operator-authorized amendment of criterion 2, recorded in this decisions file and bound with npm run plan -- amend-order.",
  "reopenWhen": "A repeat on the operator's host completes node scripts/refute-plan.mjs check in under 2 s at the current subject, or the operator amends criterion 2 or the order's scope."
}
```

## WO-156-D005

```json
{
  "id": "WO-156-D005",
  "date": "2026-09-24",
  "dispatch": "scope expand: add the Git-launch reduction to WO-156 and npm run plan -- amend-order, then resume: fix and re-verify",
  "decision": "Accept the operator-authorized bounded Git-launch reduction in scripts/lib/plan-subject.mjs and scripts/lib/plan-receipts.mjs, with regressions in scripts/test-plan-refutation.mjs and existing evidence/product write-backs. Preserve all five criteria, including under 2 s, byte-identical outputs, validation and configuration freshness. Reopen D003 and D004 under this authority; their historical findings remain valid.",
  "evidence": [
    "Operator explicitly authorized this scope expansion on 2026-09-24 in the active conversation.",
    "VER-001 F1 measured 2.68–2.75 s and 240 Git launches after the correct path-pattern hoist.",
    "Repair entry instrumentation reproduces 240 Git launches: 127 cat-file, 70 rev-parse, 29 ls-tree, and 14 other launches. readReceipts reads committed evidence one file per launch, and committedReader resolves already-observed immutable revisions repeatedly."
  ],
  "rejected": [
    {
      "option": "Amend away the timing criterion",
      "reason": "The operator selected a Git-launch reduction and retained the intended under-2-second outcome."
    },
    {
      "option": "NoOp",
      "reason": "Leaves required criterion 2 failing and recurring check latency above its bound."
    },
    {
      "option": "Cache mutable revisions or remove validation",
      "reason": "Could conceal a moved branch or altered evidence; use existing immutable content caches and batching instead."
    }
  ],
  "reopenWhen": "The bounded reduction cannot meet 2 s, changes subject/check bytes, misses moved refs or altered receipts, or materially increases memory beyond the existing bounded reader caches."
}
```

The critical-path benefit remains reduced recurring gate latency for the independently
verified loop. Drift and rule beating require retaining the 2 s bound and byte
comparison. Commons and wrong-goal risks require measured launch and task reductions.
Policy resistance and Naive Interventionism require unchanged validation and mutable
reference freshness. Existing batch readers avoid escalation and extra recurring
process; comparing batching, safe immutable reuse and NoOp avoids favoring prior
investment (success to the successful). Removing repeated launches reduces dependence
on operator rescue (shifting the burden). D002 remains the sole economy experiment;
its declined additional trial is reused, with required repair measurements supplying
the deciding evidence. The edits are reversible through the preserved repair input.

## WO-156-D006

```json
{
  "id": "WO-156-D006",
  "date": "2026-09-24",
  "dispatch": "Operator response: Add the bounded normalization cache; resume: fix and re-verify",
  "decision": "Add exact-input memoization of the existing pure NFKC and whitespace normalization in scripts/lib/plan-receipts.mjs. Bound it to 512 entries and 1 MiB of combined input/output UTF-16 string storage; bypass oversized inputs. Add regression coverage in scripts/test-plan-refutation.mjs and retain the unchanged under-2-second and byte-identity criteria.",
  "evidence": [
    "The operator explicitly selected Add the bounded normalization cache in response to the scoped repair question on 2026-09-24.",
    "The Git reduction reaches 71 launches, but repeated direct checks still take approximately 2.05–2.07 s on this host.",
    "Post-Git CPU profile: spawnSync 446 ms, meaningful 302 ms and whitespace regex 148 ms. The pure normalization recomputes strings across historical receipt/hold comparisons.",
    "The complete fixture suite passed 64 of 64 after the Git reduction."
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "The required absolute timing criterion still fails despite fewer Git launches."
    },
    {
      "option": "Further Git tree batching",
      "reason": "Raw recursive Git-tree decoding would add a larger new implementation for a remaining 446 ms hotspot; memoizing unchanged pure normalization targets roughly 450 ms with fewer moving parts."
    },
    {
      "option": "Unbounded normalization cache or changed normalization rules",
      "reason": "Unbounded retention adds memory risk, while changed rules could alter historical receipt/hold identity."
    }
  ],
  "reopenWhen": "Normalization results or subject/check output differ, memory retention exceeds the fixed limits, or the unchanged host timing criterion still fails."
}
```

The mission and critical-path benefit is reduced recurring check time with the same
judgments. Exact input keys, bounded retention and byte comparisons address policy
resistance, commons, rule beating and Naive Interventionism. Retaining the timing
criterion avoids drift; keeping the existing normalization avoids seeking a proxy
goal. The smaller cache is compared against further Git batching without favoring
prior investment, limiting escalation and removing recurring operator intervention.
D002 remains the single economy decision; these measurements are acceptance work.

## WO-156-D007

```json
{
  "id": "WO-156-D007",
  "date": "2026-09-24",
  "dispatch": "scope expand: do whatever adjacent fixes you need to, either found from this run, from the verifier run as a follow up, or from the initial executor run",
  "decision": "Apply the operator's continuing adjacent-repair authorization to defects encountered in this repair and its verification, including D003/D004 from the original execution and VER-001. Preserve evidence and record any additional concrete repair. No additional work-order-text change is needed for the current fixes, which remain within the Git and normalization amendments D005/D006.",
  "evidence": [
    "The operator explicitly expanded adjacent-fix authority in the active conversation on 2026-09-24.",
    "Review caught an intermediate Git optimization that treated every full object id as a commit, although a raw annotated-tag id must peel to the commit. A red regression reproduced the wrong revision; the final code only bypasses resolution for a previously resolved commit in the same root's tree cache, and the regression passes.",
    "The current adjacent queue is revision 0 with no items; the earlier executor and verifier follow-ups are FUP-3dc0266d6b87b939 and FUP-5827640154a48b7b."
  ],
  "rejected": [
    {
      "option": "Retain the faster raw-id shortcut",
      "reason": "It changes committedReader's revision output for annotated tag objects."
    },
    {
      "option": "Defer the observed tag regression",
      "reason": "It is a bounded defect in this repair's own Git path and is covered by the same fixture suite."
    }
  ],
  "reopenWhen": "Independent verification exposes another concrete defect in the delivered scope or an earlier executor follow-up remains unresolved."
}
```

## WO-156-D008

```json
{
  "id": "WO-156-D008",
  "date": "2026-09-24",
  "dispatch": "resume: fix; measured result of D005/D006",
  "decision": "Keep bounded committed-read prefetch, reuse only previously resolved immutable commit identities, and memoize exact normalization inputs within 512 entries and 1 MiB of retained UTF-16 string storage. The host's under-2-second criterion is now met with byte-identical outputs. Settle the two earlier latency/scope follow-ups through their structured register after repair checks.",
  "evidence": [
    "Same-tree paired subprocess measurements: pre-repair plan check 3.177, 3.121, 3.158 s; repaired 1.799, 1.823, 1.795 s, all exit 0. The pre-repair sources were loaded from preserved scratch bytes using a Node load hook without modifying the worktree.",
    "plan subject stdout SHA-256 before/after: 2eccf9e2858f85b24c658ed3d826eca29716b8b893e3ce1baf9978868051a9ed (227825 bytes); check stdout before/after: ca8fe28afd1bf3ad434b595351ea493c49cf8daed9d010af033d84ad0d5995a2 (3407 bytes). Every repeated output matches; the check hash differs from D001 because the authorized order amendments change the workspace subject.",
    "Same-tree Git launches: 242 before (127 cat-file, 72 rev-parse, 29 ls-tree, 14 other), 98 after (19 cat-file, 36 rev-parse, 29 ls-tree, 14 other). The two appended amendments explain the two extra launches compared with the 240-launch entry baseline. The final 98 replaces the intermediate 71 after correcting annotated-tag resolution.",
    "Regression evidence: prior reader 12 repeat launches versus 0; four committed receipts 15 launches versus 4; repeated normalization 12 calls versus 1. Entry and byte eviction, oversized bypass, missing values, Unicode, mutable refs, raw annotated tags, cross-root cache isolation, non-commit objects and receipt tampering pass. The original statSync regression stays at 10 calls with the same pinned subject hash.",
    "Local release preparation retains v0.46.1, with no component changes or new dependency. The repair adds three cases to the existing suite (four total WO-156 cases including the original); no new runner task."
  ],
  "rejected": [
    {
      "option": "An unbounded cache or caching HEAD/ref names",
      "reason": "Would trade the measured speed for stale observations or uncontrolled memory retention."
    },
    {
      "option": "Retain one Git launch per committed receipt/source",
      "reason": "The paired measurements establish identical output while reducing recurring launch cost."
    },
    {
      "option": "Claim a cross-host or sub-second guarantee",
      "reason": "The observed result is under two seconds on this host, and other concurrent gate tasks can still dominate total wall time."
    }
  ],
  "reopenWhen": "A fresh check on the operator's host exceeds 2 s, paired outputs differ, configured roots or Git refs produce stale data, or the cache bounds/eviction regressions fail."
}
```

At handoff, the measured result advances operator flow without changing the judgment
standard. Byte equality and refusal regressions constrain policy resistance, rule
beating and wrong-goal risks; retained bounds constrain commons cost. The absolute
timing bound remains intact (drift), and the implementation reuses existing batch
facilities (escalation). The tag correction rejects a faster but incorrect option
without privileging sunk work (success to the successful). Repeated rescue is
removed rather than shifted to the operator; Naive Interventionism and NoOp are
resolved by the preserved old-source comparison and reversible local changes.

Final executable evidence for D008: all 65 fixture tests passed (37.27 s),
`test:docs` passed 21 tasks (23.66 s; plan 1.88 s, plan-refutation-current
1.78 s), and `npm test` passed 27 suites / 71 fresh tasks (292.10 s). The two
FUP records are settled with reopening conditions. No runner task was added.

## WO-156-D009

```json
{
  "id": "WO-156-D009",
  "date": "2026-09-24",
  "dispatch": "resume: verify; VER-002 F1/F2; continuing operator adjacent-repair authority in D007",
  "decision": "Return the Git batching repair for two accepted-input regressions. Preserve the successful speed measurements and correct optional prefetch validation and aggregate buffer overflow before re-verification.",
  "evidence": [
    "Independent verifier: canonical sequence plus an unused legacy work-order-map.md symlink passes original readReceipts but current prefetch rejects it; buildPlanSubject and validateReceipt still succeed.",
    "Independent verifier: six valid committed receipts of approximately 3,152,367 bytes each pass the original reader but current aggregate batch fails ENOBUFS at 16,822,641 stdout bytes.",
    "All 65 current fixtures pass and independent checks take 1.584\u20131.601 s, so the existing passing checks missed two correctness boundaries."
  ],
  "rejected": [
    {
      "option": "Accept the timing result as completion",
      "reason": "Speed cannot compensate for rejecting valid evidence."
    },
    {
      "option": "Remove all batching",
      "reason": "Bounded optional prefetch and split retries can preserve individually successful reads while retaining normal-path launch savings."
    }
  ],
  "followup": "Repair WO-156 VER-002 F1/F2 in scripts/lib/plan-subject.mjs and scripts/lib/plan-receipts.mjs: ignore unusable optional prefetch hints and split failed multi-blob batches so valid individual reads retain capacity. Add symlink and aggregate-overflow regressions in scripts/test-plan-refutation.mjs; rerun paired outputs, timings, fixture and product gates, and independent verification. Priority high: introduced correctness regressions.",
  "reopenWhen": "Either accepted-input probe fails, required-path refusals change, or the under-2-second criterion or byte equality fails."
}
```

The independent loop advances operator flow only when its evidence remains valid.
Policy resistance, rule beating and wrong-goal risk require accepting the same
inputs; drift cannot normalize the new failures. Commons and escalation favor
two bounded regressions and reuse of the existing verifier. Prior investment
does not excuse the defects (success to the successful); fixing them removes
operator rescue (shifting the burden). Naive Interventionism preserves canonical
validation; NoOp leaves both independently reproduced failures.

## WO-156-D010

```json
{
  "id": "WO-156-D010",
  "date": "2026-09-24",
  "dispatch": "resume: fix; VER-002 F1/F2; D007 continuing operator authorization",
  "decision": "Correct both batching regressions: prefetch ignores missing/nonregular/unreadable hints and leaves canonical validation in charge; failed multi-object reads split recursively while singleton failures propagate to consumers. Omit unused legacy-map hints and condition cost hints on the recorded cost table.",
  "evidence": [
    "New unused-legacy-symlink fixture failed with the exact VER-002 error before the repair and now passes; direct required symlink reads remain refused.",
    "Six committed receipts with a 3 MiB thesis failed before splitting and now round-trip exactly. Two revisions with distinct 9 MiB blobs also preserve bytes. Optional 17 MiB hints do not reject a subject; actual oversized singleton reads still fail.",
    "All 68 fixture tests pass in 26.717 s; seven WO-156 cases, three added in this follow-up, zero new runner tasks. Initial test-helper misuse was corrected before the symlink red measurement; its TypeError is not regression evidence.",
    "Same-tree pre-repair check 2.824/2.815/2.792 s; final 1.667/1.659/1.657 s, all exit 0. Subject before 0.112/0.111/0.114 s; after 0.106/0.108/0.108 s. Every paired stdout matches.",
    "Final subject SHA-256 2eccf9e2858f85b24c658ed3d826eca29716b8b893e3ce1baf9978868051a9ed, 227825 bytes; check SHA-256 03c0b8527e84a303420df276ecfab6f62f08c0337ee95524638eee652a71af35, 3407 bytes. Check hash changed after canonical local patch preparation retimed the heading from v0.46.1 to v0.46.2; all before/after runs use the same retimed tree.",
    "Final Git launches 104: 36 rev-parse, 29 ls-tree, 25 cat-file and 14 other; versus 242 before repair. Six extra launches versus D008 preserve on-demand historical legacy reads.",
    "test:docs passes 21/21 in 23.06 s; plan 1.90 s and plan-refutation-current 1.81 s. Publication locks are current after the release-preparation roadmap update."
  ],
  "rejected": [
    {
      "option": "Treat hints as required committed regular files",
      "reason": "VER-002 reproduces a valid input rejected by that choice."
    },
    {
      "option": "Raise the shared Git buffer limit",
      "reason": "Would move the capacity boundary and affect callers outside this order; splitting uses the same bounded per-read transport."
    },
    {
      "option": "Remove batching or ignore singleton read failures",
      "reason": "The former loses the measured launch savings; the latter weakens actual source validation."
    }
  ],
  "reopenWhen": "Independent verification reproduces either acceptance regression, canonical refusals weaken, paired output differs, or host checks exceed 2 seconds."
}
```

Correction to D008: the measured ordinary-tree result was valid, but its passing
fixtures did not establish accepted-input preservation at the optional-path and
aggregate-size boundaries. VER-002 supplied those counterexamples; the three
new fixtures reproduce them and now pass. D009 supplies the goal/trap comparison;
the repair keeps correctness and the absolute speed bound together. D002 remains
the sole economy decision; no additional experiment was introduced.

D010 final executor evidence: fresh `npm test` passed 27 suites / 71 fresh tasks,
0 failures, 288.77 s. FUP-ab1746dc9c595d95 is settled and adjacent-0001 is complete;
independent verification remains the next separately recorded judgment.

During VER-003 preparation, the root corrected the product measurement chronology
under the continuing operator write-back authority: the D008 98-launch figures
are now explicitly the first repair, followed by D010’s final 104-launch figures.
This explanatory correction changes no implementation or acceptance requirement;
the publication lock is refreshed and verification judges these final documents.

## WO-156-D011

<!-- integration refs/dotln/checkpoint/WO-156/14 -->

```json
{
  "id": "WO-156-D011",
  "date": "2026-09-24",
  "dispatch": "resume: final review; worktree integrate WO-156 and --continue",
  "decision": "Integrate main (WO-155, v0.46.1) into the WO-156 branch at final review: fast-forward the uncommitted branch from a403671d to a8d58149, keep both dated release-boundary paragraphs in product 06 with WO-156's activation and retiming paragraphs above WO-155's, accept the helper's re-merged projections, and carry every VER-003 acceptance claim forward unchanged because no source file of this order changed. The target stays v0.46.2 under the declared patch classification; no component version, evidence edition or dependency moves.",
  "evidence": [
    "refs/dotln/checkpoint/WO-156/14",
    "base a403671dd2c92b7423be4410f4ea6fb0862818b2",
    "upstream a8d58149c8524a78c8eb814bea194305a4bbd49e",
    "After integration, git diff main --stat -- scripts/ is the same three files, 515 insertions and 93 deletions the order had against its original base; the judged blobs 2dcea897 (plan-subject), 574bb292 (plan-receipts) and 2175d101 (fixtures) are the ones VER-003 judged.",
    "The only authored conflict was docs/product/06-roadmap.md, WO-155's activation paragraph against WO-156's activation and collision-retiming paragraphs; both are kept and no source line was touched.",
    "release prepare --local: WO-156 target v0.46.2 remains current; no files changed. docs/evidence/current.json equals main's, and authority, feedback, artifact-identity and verification --check all pass on the integrated tree, so nothing is re-minted.",
    "Affected checks on the integrated tree: npm test -- --review 29 suites, 0 failed, 292.22 s, 73 fresh tasks, exit 0, tree 846d316b85b56cb417937b6b93f574b65f339392, code identity d9cb2a97e7c70932f9bcd64c955778b2b14b2e72d875aa8fe2cacce90f68caa2, recorded 2026-09-24T20:47:51.954Z with no sandbox in force; publication:check PASS; harness check 31 surfaces; release check-surfaces --local 0 FAIL; plan check exit 0 in 1.54 to 1.55 s with three byte-identical outputs."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Return the integration through repair or a new verification",
      "reason": "A new base, a text conflict in a dated roadmap paragraph and a changed tree hash are integration bookkeeping under product 07 §Independent workflows and integration; no behavior, contract, authority or acceptance changed."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-24. Original base: `a403671dd2c92b7423be4410f4ea6fb0862818b2`.
Fetched main: `a8d58149c8524a78c8eb814bea194305a4bbd49e`. Checkpoint: `refs/dotln/checkpoint/WO-156/14`.
Named stash retained: `1da7327653a28bea45c087c637bcca2d0ec96de6` (WO-156 integrate 2026-09-24).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-156 target v0.46.2 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims: every acceptance claim VER-003 judged (criteria 1 to 5) is carried with its original evidence, because the integration changed no source file of this order and the three judged blobs are unchanged; the reviewer re-ran `plan check`, the seven WO-156 fixture cases and the product gate on the integrated tree, recorded in [FINAL-001](../../final-reviews/WO-156/FINAL-001.md).
Authored conflicts observed: docs/product/06-roadmap.md.
Affected checks are printed by the command; results remain untested until executed.
