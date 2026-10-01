## Release overview

A pull request that DotLn opens in a target repository now says whether the change is deliverable-ready, item by item. Product 03 lists fourteen conditions for "done", from a reproduced baseline and an independent review to a named owner for the post-publication loop. Until this release the generated body carried four of them, and the rest lived only in prose, so a pull request could open over an unreproduced baseline or an unreviewed diff without the body saying so. `worktree publish WO-NNN --target request.json` now evaluates all fourteen from the episode store's artifacts. It renders each one as evidenced with a reference, absent with a reason, or not applicable with a reason. With `--require-deliverable-ready` it refuses before any remote call while an item is absent. An operator's own publish without the flag still opens the proposal, with its gaps stated. This release is for operators who publish to target repositories and for the planned unattended runs (WO-112, WO-118, WO-123) that will require readiness.

## Read before upgrading

- **Every target pull-request body gains a section.** `## Deliverable-ready` follows the change summary on every target publish, with or without the flag. It holds a one-line result and a three-column table. The text before it is unchanged. Anything that compares or parses whole generated bodies will see the new section.
- **The fixed section text meets your local terms.** The new rows use ordinary words such as "baseline", "review" and "lint", and the outward lint checks them like the rest of the body. If your private local-terms list contains one of those words, every target publish now refuses at the lint.
- **Two new refusals apply even without the flag.** A `delivery-preparation.json` in the source episode store that is not a regular file, is not valid JSON or does not match its closed shape refuses the publish. A verification, baseline or review store holding a live `host.lock` refuses with "finish or recover the evidence host first". The second refusal also covers the verification store that the review loop's repaired-head push reads.
- **New optional request keys.** A target publish request may name `baselineStore` and `reviewStore`, resolved beside the request file like `verificationStore`. When they are omitted, the verification store is searched for baseline and review episodes.
- **Unchanged.** The launchpad's own `worktree publish` for DotLn orders is untouched. No schema, gate step, component version or dependency changes.

## Substantive changes

**The readiness evaluation.** `deliverableReady(artifacts)` in `scripts/lib/github-body.mjs` is a pure function over host-read artifacts that returns fourteen typed rows, in product 03's order. It accepts no caller-supplied verdicts. Every input is bound to the original contract, the base and the candidate revision. The baseline must be a replayed `BaselineWitnessed` that reproduced the defect or walked the new story before the first worker attempt. The review must be a `ReviewCompleted` over the exact sealed diff with no blocking finding and no request for a human. Reviewer, verifier and implementer episodes must all differ. A story with no visual criteria makes the visual item not applicable. A missing producer leaves its item absent: an item is never presumed. The [artifact contract](../../evidence/WO-182/artifact-contract.md) names the source of each item.

**The body section.** The table publishes fixed reference aliases instead of private paths: `commit:SHA`, `source-event:ID`, `baseline-event:ID`, `review-event:ID`, `verification:WORKSTREAM`, `delivery-preparation#/SECTION` and the body's own anchors. The result line reads `Deliverable-ready: ready; every applicable item is evidenced.` or, for example, `Deliverable-ready: not ready; 2 items absent.` When the independent review passed, its `should` and `nit` findings are listed as known items without widening scope.

**The flag.** `--require-deliverable-ready` refuses with `deliverable-ready evidence absent:` and the names of the absent items. It fires after the local Git reads and the authority check, and before the publication lock, GitHub authentication, the push and pull-request creation.

**Delivery preparation.** Three items read an optional owner-written `delivery-preparation.json` in the source episode store. It must be bound to the work order, the candidate revision, the contract hash and the diff hash. It holds the unresolved material-ambiguity inventory, where only an empty list evidences the item. It holds the evidence IDs the owner selects as tests, build and lint, each of which must be a current, passing, host-run live witness. It holds the post-publication monitoring owner and policies, which must be `worktree resolve-pr`, `classify-before-repair`, `triage-by-type`, `stop` and `human-controlled`. A stale file leaves those items absent.

**Catalog.** The generated work-order index rows for WO-112 and WO-118 name the flag their runs must use.

## Progressive polish

Product 03 §DeliveryAdapter states the computed conjunction in one sentence, and the README's target-publication paragraph names the table and the flag. Both CLI usage strings show the flag. A pure fixture models all fourteen items evidenced. A publisher fixture replays real baseline, verification and review producers, with deterministic worker and GitHub doubles. The WO-064 pinned-body comparison now covers the text before the new section.

## Evidence and compatibility

Application `v0.62.0` is a minor release over `v0.61.3`, built from WO-182 on `main` at `855450ea`. The order was executed on `v0.61.2` (`1d00bc58`) and integrated over WO-177 with no authored conflict ([D005](../../evidence/WO-182/decisions.md#wo-182-d005)). All component versions are unchanged, no dependency was added, and no evidence edition was re-minted.

The verification sequence:
- [VER-001](../../verifications/WO-182/VER-001.md) passed. It resolved every reference in two published bodies against the real fixture stores, and turned 24 further mutations into absent rows with no false `evidenced`.
- [FINAL-001](FINAL-001.md) passed on the integrated tree and boarded two seams for the runs that will require readiness ([D006](../../evidence/WO-182/decisions.md#wo-182-d006--final-review-pass-and-two-seams-the-required-runs-inherit)).

`npm test -- --review` passed on the integrated tree: 34 suites, 0 failed, 903.77 s, 79 fresh tasks, at code identity `31d606746f81248b1ab29e4b7216091e1fe7f1362cf41b605d3f2038a3b14257`. `npm run test:docs` passes.

Known limitations:
- All fourteen items evidenced, including the visual one, is shown on the pure fixture only. No producer in this repository emits a screenshot witness, so the replayed stores reach thirteen evidenced items plus visual not applicable.
- Nothing writes `delivery-preparation.json` yet. A run with the flag refuses on ambiguity, tests/build/lint and the monitored loop until a producer exists, and tests/build/lint has no not-applicable route (D006).
- A repeat publish with the flag, for a head already opened without it, returns the recorded pull request with exit 0 and evaluates nothing (D006).
- The monitored-loop item records a prepared owner and policy, not an observation of a pull request that does not exist yet.
- Three of the four publisher tests run only on macOS, where host-run test confinement exists.

Details are in the [decisions](../../evidence/WO-182/decisions.md), the [artifact contract](../../evidence/WO-182/artifact-contract.md) and the [handoff](../../evidence/WO-182/handoff.md).
