# WO-243 — Closeout checks follow the repositories an order changed: one scope selection, read by the executor's closeout, the integrate helper's affected-check list and completion's advisory, so a target-only order runs its registered target gate and the document gate, a change that touches launchpad machinery still pays the complete run, and an adopted kit merge alone demands no second one (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** patch. One selection shared by three readers
that already exist, aligned with the contract product 07 and product 12
already state; no new operator command, no new refusal. Assigned at
activation under the standing opt-out default.
**Cost:** adds one selection, `closeoutScope(root, order)` in
`scripts/lib/executor-readiness.mjs` (or a sibling `scripts/lib/closeout-scope.mjs`
it imports), derived from the order's `Repository:` field, the paths the
order's branch changed since its activation base, authored conflict
resolutions recorded by the integrate helper, and the checks the criteria
name; the integrate helper prints the owed checks beside its affected list
(`scripts/lib/worktree-integration.mjs`, `integrationTestCommand` and the
print near 1091 to 1095); the executor, fix and reviewer closeout sentences
in `packages/skeleton/src/loadouts/contributor.ts` (631, 651) read the
selection instead of naming `npm test -- --review` unconditionally;
completion's advisory names the selection; a matrix in
`scripts/test-worktree-integration.mjs` and `scripts/test-target-worktree-start.mjs`
with a paired control at the base. Removes: the complete launchpad run a
target-only order is told to start although nothing in it consumes the row
(the fork's WO-019 started one on 2026-10-28 at 22:28:21Z and stopped it at
22:30:54Z on the operator's question; the complete run's recent median is
24.9 minutes), and the two-way reading of the integrate helper's affected
list as a duty. Wall-clock: the selection is one read of the order, the
changed paths and the criteria at closeout, measured before and after and
recorded; a target-only closeout loses one complete run. Context bytes:
this file, about 14,000. Commands: none new. Tokens: unknown until run.
Steps: 7. Re-mints: `contributor.ts` is a runtime source the executor
checks against `scripts/lib/evidence-sources.mjs` at activation and
re-mints deterministically where an edition is staled; the role oracle is
refreshed by the existing command; no feedback-judged source changes, so no
live feedback episode; `worktree-integration.mjs`, `executor-readiness.mjs`
and `loadouts/contributor.ts` are declared machinery sources, so `npm test
-- --review` runs before handoff.
**Nomination provenance:** the DotLn-Enterprise-Starter fork's block of
2026-10-30, item 3 (WO-019-D031 in the target's decisions: the executor's
closeout step started a complete launchpad run for an order that changed no
launchpad code and whose criteria named the target gates and `npm run
test:docs`; the integrate helper listed the run as an affected check), read
by the [2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md);
first answered there as a product 07 sentence and a role-text carry-in, then
filed as its own order on the operator's direction of 2026-10-30 to take the
best of the two passes of that day (the other pass's WO-243 is the design
this order follows, with this pass's anchors). Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-210 (closed: a target order pays its declared target gate
through the target gate runner and the instance's document gate, never
core's product gate); WO-239 (closed: `worktree integrate` refusing during a
live gate and returning before any stash when nothing is behind, the
integration baseline this order's helper print extends); WO-236 (closed: the
executor's target-worktree grant, under which target-only changes are made).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-210",
    "relation": "satisfied-by-close",
    "reason": "the target gate contract a target-only order's closeout selects"
  },
  {
    "workOrderId": "WO-239",
    "relation": "satisfied-by-close",
    "reason": "the integrate helper's current refusal and no-op behavior the owed-checks print extends"
  },
  {
    "workOrderId": "WO-236",
    "relation": "satisfied-by-close",
    "reason": "the registered target worktree whose authored changes the selection reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(the executor procedure 625 to 636, the closeout sentence at 631 "Start one
complete run, `npm test -- --review`"; the reviewer's reuse sentence at
651); `scripts/lib/worktree-integration.mjs` (`integrationTestCommand` and
its callers; the affected-checks print and draft decision near 1091 to
1095); `scripts/lib/handoff-ledger.mjs` (`criterionGateClaims` 93 to 141:
completion consumes rows only for the gates a criterion's text names);
`scripts/lib/executor-readiness.mjs`; `scripts/lib/target-worktrees.mjs`
(the registration and its `gate`); product 07 §Preflight before the full
gate (the sentence the 2026-10-30 pass wrote: a target order whose criteria
name only its target gate and the document gate owes no launchpad complete
run at its closeout, and the integrate helper's affected-check list reports
what main's merge touched, never a duty) and §Independent workflows and
integration; product 12 §One workstream across repositories ("An Angular
order pays DotLn-Angular's declared repository `gate` through the target
gate runner, plus the instance's document gate, never core's product gate
(WO-210)"); the target's `docs/dotln/evidence/WO-019/decisions.md` D031
(read by the filing pass in the local DotLn-Angular checkout); the fork's
row FUP-2403ce12b1fca8b2.

**Objective:** The checks an order owes at closeout follow what the order
changed, and every reader says the same thing. A target-only order (its
authored changes in the registered target, its launchpad changes documents
and records) runs its registered target gate and the launchpad document
gate; an order that changed launchpad machinery, or resolved a machinery
conflict at integration, runs the complete launchpad run; an integration
that only adopted main's already-gated kit changes adds no run of its own.
The executor's closeout sentence, the integrate helper's print and
completion's advisory all read one selection, and a selection that cannot
classify the order says so and keeps the old behavior rather than skipping
a run or inventing a passing row.

**Observed gap (dated 2026-10-30 at `main` `4090d70d`):**

- The emitted executor closeout step reads "Start one complete run, `npm
  test -- --review`, in the background" for every execution
  (`contributor.ts` 631); the fix and reviewer steps carry the same shape
  (651). Nothing in the sentence distinguishes a target order.
- `integrationTestCommand(root, before)` in `worktree-integration.mjs`
  selects `--review` or plain from the machinery changed since a supplied
  revision and falls back to the review selection; its print names the
  complete run among the "affected checks" after main's merge, and the
  fork's executor read that list as a duty (WO-019-D031).
- Completion consumes rows only for the checks the criteria name
  (`handoff-ledger.mjs` 93 to 141), so a target-only order's completion
  never demanded the row; the waste was the run itself, started on the role
  text and the helper's print.
- Product 07 and product 12 already state the contract (a target order pays
  its declared target gate and the document gate, never core's product
  gate); the 2026-10-30 pass added the explicit sentence to §Preflight
  before the full gate. The contract is written; the code and the role text
  do not read it.
- The fork's observed case: WO-019 changed no launchpad code; its criteria
  named the target gates and `npm run test:docs`; the run started at
  22:28:21Z and was stopped at 22:30:54Z on the operator's question, with
  no pass supplied; the fork's row FUP-2403ce12b1fca8b2 waits on core's
  answer.

**Design (scope discipline):**

- **One selection, three readers.** `closeoutScope(root, order)` returns
  `{ target: <the registration's gate commands or none>, launchpad:
  "document" | "complete", reasons: [...] }`, derived from the order's
  `Repository:` field, the paths the order's branch changed since its
  activation base (documents and records against `scripts/`, `packages/`
  and the kit), authored conflict resolutions the integrate helper recorded,
  and the checks the criteria name. The executor's closeout sentence tells
  the role to run what the selection names; the integrate helper prints
  "affected by main's merge" and "owed by this order" as two lists; the
  completion advisory names the selection. Rejected: removing the complete
  run for every target order (axis: an order that edits launchpad machinery
  beside its target change, or resolves a machinery conflict at
  integration, loses the evidence the complete run gives). Rejected: reading
  the criteria's prose alone (axis: it misses machinery actually changed;
  the changed paths are the fact, the criteria the claim).
- **Unknown scope keeps the old behavior.** A registration that cannot be
  read, a missing activation base or an unclassifiable path makes the
  selection `complete` with the uncertainty named in its reasons; the
  selection never skips a run, never reports a passing row and never adds a
  refusal (the other pass's refuter named the gap where a selector failure
  could strand a closeout the old checks would have validated; this order
  closes it by construction).
- **Adopted kit changes are not the order's.** Paths that main's merge
  brought in unchanged by the order are excluded from the order's owed
  checks; main already gated them. A conflict the executor resolved by hand
  in a machinery path is the order's change and selects `complete`.
- **Every reader of the comparison base is named.** The selection reads the
  activation base and the merge base the integrate helper uses; the
  executor enumerates every reader of those revisions across `scripts/` and
  `packages/` in its decisions, each kept or moved with its reason (the
  WO-230 rule in product 07 §Operator-opened planning pass).
- **Live-run surfaces at the base.** The target gate runner and the
  registration's `gate`: exist (WO-210). The integrate helper's print:
  exists. Completion's gate-claim consumption: exists. The selection and its
  readers: absent.

**Execution plan (the executor follows these steps in order; observed at `4090d70d`, 2026-10-30):**

1. `scripts/lib/worktree-integration.mjs` (`integrationTestCommand` and its
   callers): census every reader of the comparison base and record each in
   `docs/evidence/WO-243/decisions.md`, kept or moved with its reason;
   distinguish paths main's merge adopted from paths the order authored or
   resolved. Check: `npm test -- --only worktree-integration`.
2. `scripts/lib/executor-readiness.mjs` (or `scripts/lib/closeout-scope.mjs`
   it imports): `closeoutScope(root, order)` as the Design states, with its
   reasons; unknown scope selects `complete` and names why. Check: `npm
   test -- --only target-worktree`; `npm test -- --only configuration-root`.
3. `scripts/lib/worktree-integration.mjs` (the print near 1091 to 1095): two
   lists, affected by main's merge and owed by this order, the second from
   the selection. Check: `npm test -- --only worktree-integration`.
4. `packages/skeleton/src/loadouts/contributor.ts` (631 and 651): the
   executor, fix and reviewer closeout sentences name the selection ("run
   the checks `closeoutScope` names for this order: its registered target
   gate and the document gate for a target-only order, the complete run
   where launchpad machinery changed") and keep the complete-run rules
   within the selected repository and the current-identity reuse; the
   installed roots and the role oracle regenerate through the existing
   commands; the cold-start measurement is recorded against its ceiling.
   Check: `npm test -- --only harness`; `npm test -- --only
   harness-context`.
5. `scripts/test-worktree-integration.mjs` and
   `scripts/test-target-worktree-start.mjs`: the matrix of a target-only
   order, a target order with launchpad document changes, an adopted kit
   merge, a local machinery edit, a resolved machinery conflict, an
   unreadable registration and a direct core order; the paired control
   with the selection reverted shows the target-only case requesting the
   redundant run at the base while the mixed case still selects the
   complete run; both arms' exit codes and the selected commands in
   `docs/evidence/WO-243/controls.json`. Check: the two suites.
6. Write-backs: product 07 §Preflight before the full gate (the sentence
   becomes the built mechanism: the selection, its readers, the unknown
   case) and §Independent workflows and integration (the helper's two
   lists); the kit guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`) §What runs here, and what does not (the selection and the working route for existing target-only
   orders); `docs/evidence/WO-243/decisions.md` (the comparison-base
   readers; the measured closeout cost before and after for a target-only
   order and a mixed order); re-mint any edition `contributor.ts` stales;
   `npm run meta`; `node scripts/lineage.mjs index --check`; `npm run
   publication:check`.
7. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-243/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the selection and its reasons; the integrate helper's two
lists; the three closeout sentences; the matrix and its control; the
write-backs and the measured cost.

**Acceptance criteria (all required)**

1. For the matrix of step 5 the executor's emitted closeout sentence, the
   integrate helper's owed list and completion's advisory name the same
   checks: the registered target gate and the document gate for a
   target-only order and for a target order whose launchpad changes are
   documents and records; the complete run for a local machinery edit and
   for a resolved machinery conflict; no complete run for an integration
   that only adopted main's kit changes.
2. An unreadable registration, a missing activation base or an
   unclassifiable path selects the complete run with the uncertainty named
   in the selection's reasons; no case reports a skipped run as passing, and
   no new refusal is added at closeout.
3. The paired control with the selection reverted requests the redundant
   complete run in the target-only case at the base and the current tree
   does not, while the mixed case selects it in both arms; both arms' exit
   codes and selected commands are in `docs/evidence/WO-243/controls.json`;
   the decisions enumerate every reader of the comparison base with its
   kept or moved semantics, and record the measured closeout cost before
   and after for one target-only and one mixed fixture order.
4. Product 07 and the kit guide state the selection and its limits; the
   executor root's cold-start measurement is recorded against its ceiling;
   any staled edition is re-minted; `npm run publication:check` is green.
5. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only worktree-integration` for steps 1, 3 and
5; `npm test -- --only target-worktree` and `npm test -- --only
configuration-root` for step 2; `npm test -- --only harness` and `npm test
-- --only harness-context` for step 4; `npm run test:docs` when a document
changes; each under `node scripts/harness.mjs bounded --`; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the matrix and control of criterion 3; the deterministic
re-mint of any edition `contributor.ts` stales; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete
row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 6 and criterion 4.

**Known issues and carry-ins:**

- The fork's row FUP-2403ce12b1fca8b2 settles on the pass's answer (the
  contract already holds; this order aligns the code and role text); the
  fork continues target-only orders under its declared checks today, a
  convenience and not a blocker (reopen: a target order's completion
  consumes a launchpad complete row, or the fork reports a mixed change
  whose selection it disputes).
- The selection reads the criteria's named checks as one input; a criterion
  that names `npm test` on a target-only order keeps the complete run,
  because the claim then needs the row (reopen: an order's criteria name a
  check its changed paths do not justify and the executor asks which wins).

**Non-goals:** relaxing a target's declared gate; reusing a gate row across
a changed identity; gate memoization or parallelism changes; changing the
fork's closed records; a new operator phrase or command.

**Operator-review assumptions:** that this corrects the written contract's
readers rather than waiving an obligation, so no operator word is needed at
activation; that the fork keeps running target-only orders under its
declared checks until the carrying release; reopen on a mixed change the
selection classifies wrongly, or on a closeout stranded by the selection
where the old checks would have passed.
