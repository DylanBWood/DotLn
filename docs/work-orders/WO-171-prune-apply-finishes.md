# WO-171 — Prune apply finishes: one plan and one publication observation per apply instead of one per candidate, an interrupted apply resumes, and a retained lane keeps its usage copy until the order's meter snapshot is committed (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. The ordering and caching inside one
operator command and one added retention reason; no change to what a prune
may delete beyond that reason, no control-event schema, gate step or
contract change. Assigned at activation under the standing opt-out default.
**Cost:** adds one tag listing and one release listing per apply in place
of one `gh release view` and one `git ls-remote` per order per plan; a
pre-delete check that reads only the candidate about to be removed; a
retention reason for a lane whose usage copy has no committed snapshot;
fixtures that count plans and publication observations. Removes: a full
re-plan before every deletion (`scripts/lib/harness-prune.mjs`
`pruneHarness`), which at the listing measured on 2026-09-27 (186
candidates, 64.2 s for one plan on the operator's host) puts one apply at
about three hours, each plan making a release view and a remote tag read
for every lane and stash it judges (an inference from the measured
listing and the source, not an observed run); the unpruned
residue that follows from it, 5,508,635,182 bytes in the same listing, of
which fourteen integration stashes are 5,433.8 MB and seventy-two retained
lanes 56.7 MB. Re-mints: none (`scripts/lib/harness-prune.mjs` is a
declared source of the harness-fixtures machinery suite and not a
registered evidence source). Wall-clock, tokens and context bytes of the
order itself are unknown until run.
**Nomination provenance:** the stored-data inventory the 2026-09-27 pass
ran under the operator's answer, captured in ignored intake (SHA-256 in
the ledger section); register rows FUP-6aafd40115ac97fd (WO-142 D022, the
per-candidate re-plan, deferred on 2026-09-21 for want of an observed
failure) and FUP-866699c54128edc1 (WO-148 D002, retained bound stores);
the local record of an apply that ended with exit 143 on 2026-09-24.
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-160 merged (integration stashes in the prune; closed,
v0.51.0); WO-159 merged (stale Codex episode homes in the listing; closed);
WO-142 merged (the prune's publication observation; closed).
**Recommended placement:** paired with WO-164 in the second slot. This
order edits `scripts/lib/harness-prune.mjs` and the prune fixtures in
`scripts/test-harness.mjs`; WO-164 edits the console collector, the status
command and the release listing. Disjoint files; neither depends on the
other; neither re-mints. It follows WO-168's close, which edits another
fixture of `scripts/test-harness.mjs`. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-160",
    "relation": "satisfied-by-close",
    "reason": "integration stashes in the prune listing and apply"
  },
  {
    "workOrderId": "WO-159",
    "relation": "satisfied-by-close",
    "reason": "stale Codex episode homes in the prune listing"
  },
  {
    "workOrderId": "WO-142",
    "relation": "satisfied-by-close",
    "reason": "the prune's publication observation and its boarded limit"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/harness-prune.mjs`
(`pruneHarness`, where an apply calls `planHarnessPrune` once per
candidate; `publishedRelease`, one `gh release view` and one
`git ls-remote` per order; `planHarnessPrune`; `integrationStashes`;
`inventoryCache`); `scripts/harness.mjs` (`prune`);
`scripts/test-harness.mjs` (the prune fixtures and the injectable
`publishedRelease`); `docs/evidence/WO-142/decisions.md` D022;
`docs/evidence/WO-148/decisions.md` D002;
`scripts/lib/intake-reconciliation.mjs` (what `worktree finish` retains);
product 07 §Candidate — local lane retention; the
[2026-09-27 planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§14 and §15.

**Objective:** the operator's `harness prune --apply` finishes in about
the time of one listing plus the deletions, can be interrupted and run
again, and never removes the only copy of an order's usage record.

**Observed gap (dated 2026-09-27, `main` at `4c34b332`):**

1. `pruneHarness` with `--apply` calls `planHarnessPrune` for every
   candidate before deleting it. One plan observes publication for every
   retained lane and integration stash, each with a `gh release view` (15
   s timeout) and a `git ls-remote`.
2. The listing on the operator's host: 186 candidates (95 advisory
   markers, 72 retained lanes, 14 integration stashes, 5 runtime
   snapshots), 46 retained with a reason, 64.2 s wall-clock.
3. `docs/control/local/prune-apply.log`, written on 2026-09-24 local
   time, holds "exit=143". Whether that run was stopped by hand or by a limit is
   unknown; the fourteen integration stashes and seventy-two retained
   lanes it would have removed are still listed.
4. The retained lanes hold the only copy of 2,141 usage rows (executor
   791, verifier 876, reviewer 458, release-close 11, planner 5) in 73
   files; nothing reads them and a working apply would delete them
   (WO-170 reads and recovers them).

**Design (scope discipline):**

- One plan per apply. Publication is observed once per apply: the remote
  tags with one listing, the releases with one listing, joined to the
  orders; an order whose publication cannot be observed is retained, as
  today.
- Before each deletion the apply re-reads only that candidate (its
  inventory, its release, and for a stash its identity) and refuses with
  "Prune subject changed" when it differs from the plan, as today.
- The byte proof is written before the deletion, as today, so an apply
  that stops after some deletions leaves them proven; a second apply
  lists what remains and continues.
- A retained lane that holds a usage copy is listed under `retained` with
  the reason "usage has no committed snapshot" until
  `docs/evidence/WO-NNN/meta.json` exists for the order.
- A bound resident store inside a retained lane follows its lane: it is
  inventoried in the lane's byte proof and removed with it.
- **Declined alternatives, recorded:** running the apply from a lifecycle
  step (it stays an operator action outside a governed session); deleting
  without the publication observation (an unpublished order's lane is its
  only record); pruning checkpoint refs (1,056 refs cost little and are
  the canonical recovery); a progress file (the byte proofs are the
  progress).

**Deliverables:** the single plan; the two listings; the pre-delete check;
the usage reason; fixtures; the timing record; the write-back.

**Acceptance criteria (all required)**

1. On a fixture with four retained lanes and two integration stashes, one
   apply calls the injectable publication observation at most once per
   order and plans once; the fixture fails against the source at
   `4c34b332`.
2. With a fake `gh` and a fake remote, one apply issues one release
   listing and one tag listing, whatever the number of orders.
3. A fixture apply stopped after two deletions and run again removes the
   rest; the first two byte proofs are unchanged.
4. A candidate changed between the plan and its deletion is refused with
   "Prune subject changed" and nothing of it is removed.
5. A retained lane with a usage copy and no committed snapshot is listed
   as retained with the reason; with the snapshot it is a candidate.
6. A retained lane that holds a bound resident store is removed with its
   lane and the byte proof names the store's files.
7. The listing's wall-clock on the operator's host is recorded before and
   after in the decisions; no apply is run by the executor, the verifier
   or the reviewer against the operator's checkout.
8. Write-backs land: product 07's retention sentences, edited in place
   within 200 bytes; decisions; the register rows named in the provenance
   are retargeted at close.
9. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts with the counted observations;
the two timings; `npm test -- --review` before `implementation-ready`,
because `scripts/lib/harness-prune.mjs` is a declared source of a
machinery suite, and again at final review. No live row.

**Write-back duty:** product 07, in place; decisions; the register rows.

**Non-goals:** running the apply (the operator's action); widening what
is eligible; checkpoint refs; the failure output that gate rows cite and
the gate marker with no birth observation (map candidates of 2026-09-27);
the product-gate suite that writes target lanes in the real checkout
(WO-142 D022, item b).

**Operator-review assumptions**

1. The apply stays an operator action; this order only makes it finish.
2. Keeping a lane for its usage copy is a retention reason, not a new
   eligibility rule: WO-170's snapshot releases it.
