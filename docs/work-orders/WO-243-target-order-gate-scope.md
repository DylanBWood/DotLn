# WO-243 — Select closeout checks for the repositories an order changes (version assigned at activation)

**Model:** any capable model; record actual model and effort.
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** patch; aligns role and integration advice with the existing target gate contract.
**Cost:** removes unrelated complete launchpad runs from target-only orders. Adds a shared gate-scope selection and mixed-change regression cases, no new operator command. Steps: five. The fork stopped one unnecessary run after 0 h 3 min; its total potential cost is unknown. Measure comparable target-only and mixed closeouts before/after, including waiting. Context bytes and tokens: unknown until run; measure changed role roots. Contributor changes require deterministic evidence re-mints and an oracle refresh; trace the closure and run a live feedback self-host episode only if a feedback-judged source changes. No cleanup or gate memoization is bundled.
**Nomination provenance:** fork block item 3, WO-019-D031 and the host-qualification record, read in [the 2026-10-30 pass](../planning/portable-config-assisted-2026-10-30.md). This convenience does not block the fork's next order.
**Depends on:** WO-210 and WO-239 closed.

<!-- dotln-dependencies:start -->
[
  { "workOrderId": "WO-210", "relation": "satisfied-by-close", "reason": "the target gate contract already exists" },
  { "workOrderId": "WO-239", "relation": "satisfied-by-close", "reason": "current integration and release-close behavior is the baseline" }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 12 §One workstream across repositories (target gates plus document gate); product 07 §Preflight before the full gate; `packages/skeleton/src/loadouts/contributor.ts` executor closeout; `scripts/lib/worktree-integration.mjs` (`integrationTestCommand` and its callers); `scripts/lib/executor-readiness.mjs`; `scripts/lib/target-worktrees.mjs`; `scripts/test-worktree-integration.mjs` and `scripts/test-target-worktree-start.mjs`.

**Objective:** A target-only order receives its registered target checks and launchpad document checks. An order also changing launchpad machinery receives the relevant launchpad complete gate. Incorporating already-validated upstream kit changes does not by itself demand a second unrelated full launchpad run.

**Observed gap (2026-10-30 at `4090d70d`):** the emitted executor closeout unconditionally says to start `npm test -- --review`. `integrationTestCommand(root, before)` selects review/plain solely from changed machinery since a supplied revision and falls back to review. WO-019-D031 records that these led to a complete launchpad run for a target-only change whose criteria named target gates and `test:docs`; it was stopped without a pass. The existing product contract already excludes core's product gate for that case. Integration conflict resolutions or local kit edits are a different subject and still need relevant validation.

**Design:** derive advice from the registered repository, authored local changes, integration resolutions and order check contract; use the same result for roles, integration and completion. Retain target host checks and launchpad structural/document checks. Reject globally removing complete launchpad gates (loses mixed-change evidence), and reject using only an order's prose criterion list (can miss machinery actually changed). A missing or ambiguous scope reports the uncertainty and asks the executor to resolve it from source; it does not silently fabricate a passing row or treat an unrun gate as waived. Enumerate all readers of the integration base before changing which revision they compare, keeping each reader's purpose distinct.

**Execution plan:**

1. `scripts/lib/worktree-integration.mjs`: census `integrationTestCommand` and every reader/caller of the comparison base; distinguish adopted upstream changes from locally authored/resolved machinery, including pending integration. Record each kept or moved reader. Check: `npm test -- --only worktree-integration` and `npm test -- --only configuration-root`.
2. `scripts/lib/executor-readiness.mjs`: expose or consume one scope-selection result with explicit required target and launchpad rows. Wire `scripts/lib/worktree-integration.mjs` advice to it without changing existing target gate authority. Check: `npm test -- --only target-worktree` and `npm test -- --only resume`.
3. `packages/skeleton/src/loadouts/contributor.ts`: make executor/fix/reviewer closeout instructions match the selector. Preserve complete-run rules within the selected repository and current-identity evidence reuse; regenerate all installed roots and oracle through existing commands. Check: `npm test -- --only harness-fixtures` and `npm test -- --only process-debt`.
4. `scripts/test-worktree-integration.mjs` and `scripts/test-target-worktree-start.mjs`: target-only order, target plus launchpad docs, adopted kit update, local machinery edit, resolved machinery conflict, unknown registration, stale target row and direct core order. A control reverting the scope repair must request the redundant run in the target-only case; a mixed case must still demand the launchpad gate. Record both arms' exits and selected commands. Check: target-worktree, worktree-integration and resume suites.
5. Write back product 07's closeout and preflight paragraphs and `scripts/kit/README.client.md` §What runs here, explaining selection and the working route for existing target-only orders. Refresh registered evidence and installed guidance, then follow product 07 §Discipline for handoff.

**Acceptance criteria (all required):**

1. Role guidance, integration advice and completion agree on target-only, document-only and mixed-change selections; no unconditional core complete run is requested solely because a target order exists or adopts an already-validated kit merge.
2. Local/resolved launchpad machinery changes still select their complete launchpad gate; target checks and the document gate remain required. Unknown scope, stale rows and missing target checks cannot be reported as passing.
3. The step 4 matrix and failing control prove the repair; decisions enumerate every comparison-base reader and its retained or changed semantics, with comparable cost measurements and honest unknowns.
4. Product and starter guidance state the selection and its limits; required re-mints and oracle checks pass. `npm run publication:check`, `npm test`, `npm test -- --review` and `npm run test:docs` pass; `git diff --check` is clean.

**Preflight:** `npm test -- --only configuration-root`, `npm test -- --only worktree-integration`, `npm test -- --only target-worktree`, `npm test -- --only resume`, `npm test -- --only harness-fixtures`, `npm test -- --only process-debt`; focused reproductions bounded, full gates outside the wrapper.
**Evidence gate:** scope matrix, failing control and measured comparison.
**Deliverables:** shared selection, aligned guidance and tests.
**Write-back duty:** step 5.
**Non-goals:** relaxing target criteria, reusing a gate across changed behavior, broad gate optimization or changing the fork's closed records.
**Operator-review assumptions:** this is a correction to the already-written target contract, not an operator waiver of a new obligation. The fork continues target-only orders under its declared checks today; reopen on mixed changes or a contradictory consumed gate requirement.
