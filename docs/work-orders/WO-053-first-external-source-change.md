# WO-053 — The first external source change: one live episode edits one file, turns one test green and commits in a repository outside DotLn, with every containment claim checked by the host and recorded from an outside terminal (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** the actual local harnesses, run by the operator from a terminal
outside the sandbox; the receipt states the harness version, model and
effort launched for each episode as launch claims (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. An evidence record and its fixtures; no
runtime capability change. If a defect found by the episode needs a runtime
fix, that fix is a separate bounded order. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D2, the live proof), cut as a bounded order at the operator's same-day
correction; the pass's prioritization rule, "the most valuable order makes an
existing claim true in a real session", names this as the first user-value
proof. Planner-synthesized draft; captures and hashes in the ledger section
of that date. Opaque identifier, not a priority. Clean-room screen: the
target is a scratch repository created for the episode; nothing from any
employer enters it.
**Depends on:** WO-052 merged (the host, events and receipt this episode
runs through).
**Recommended placement:** immediately after WO-052; the second mandatory
replan checkpoint follows its receipt. It edits only `docs/evidence/WO-053/`
and a fixture that pins the receipt's shape. A recommendation, not a
dependency token.

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
01-principles.md Principles 6 and 15; 06-roadmap.md §Application version
pending — Source-to-deliverable vertical (the rung this proof opens);
`docs/evidence/WO-009/README.md` (the live-episode receipt shape and privacy
reduction); `docs/work-orders/WO-052-source-change-host.md`;
`docs/planning/critical-path-2026-09-08.md` §The first external user-value
proof.

**Objective:** Run the primitive for real: a scratch Git repository outside
this checkout carrying one wrong function, one failing test and one bounded
contract; one WorkOrder compiled from a worker loadout whose authority comes
only from its base and explicit grants; one fresh worker under the emitted
bundle edits, runs the focused test, reads its diff, commits and terminates;
the host proves every containment claim; a second episode is killed after
the commit and recovers without a second commit; the receipt is filed from an
outside terminal.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No session, actor or pattern has changed a file in a repository the
  operator did not edit by hand; every real worker is read-only and every
  loop proof runs on doubles.

**Design (scope discipline):**

- A fixture generator creates the scratch target (one module, one failing
  test, a `README` stating the contract) and the WorkOrder from a committed
  worker loadout under WO-042's floor; the operator runs
  `npm run dotln -- source-change <order>` twice (one clean episode, one
  kill-after-commit episode) for each installed harness.
- The receipt records, per episode: the launch claims; the main checkout
  hash before and after; the sentinel tree hash; the parent session's
  transcript growth (the envelope only); `testBefore` red and `testAfter`
  green from host runs; the commit sha and its absence of any DotLn file;
  the recovery path taken; elapsed time and, where the harness reports it,
  token counts; paths reduced to shapes.
- **Declined alternatives, recorded:** running the episode on the operator's
  Angular repository first (that is Gate H, after verification and evidence
  exist); a prompted containment ("do not write outside the worktree") in
  place of the host's checks.

**Deliverables:** the fixture generator; `docs/evidence/WO-053/README.md`
with the sanitized receipts and JSON; the write-backs below.

**Acceptance criteria (all required)**

1. For each installed harness, one writer-profile smoke edits one file in
   a scratch worktree and returns the envelope (WO-051's profile, recorded
   with shapes and launch claims); then, for at least one harness, the
   clean episode's receipt shows the main
   checkout hash and the sentinel tree unchanged, the test red before and
   green after by host runs, the commit present in the target with no DotLn
   file, the six-field envelope plus `observedCommit`, and the parent
   transcript grown by the envelope only.
2. The kill episode's receipt shows recovery by commit identity with exactly
   one commit above the base.
3. Every claim in the receipt is labeled `observed`, `launch-claim` or
   `unknown`; the harness version, model and effort are launch claims with
   readback `unknown` unless the record says otherwise.
4. A fixture pins the receipt's JSON shape so a later episode is comparable.
5. Write-backs land: 06 (the vertical rung's first sentence moves from plan
   to evidence), README "What runs today" (one sentence), the capability
   table's `worker.source-change` row reassessed to the live-evidenced level,
   ledger entry; the planning map's second replan checkpoint is answered with
   a one-line disposition.
6. `npm test` green; `git diff --check` clean; no runtime source, generated
   configuration or dependency change in this order.

**Evidence gate:** the receipts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** verification of the change (WO-054 onward); the operator's
repositories; pull requests; a second repository; any runtime fix (a
separate order).

**Operator-review assumptions**

1. The operator runs the episodes and files the receipt from an outside
   terminal; the sandbox cannot dispatch either transport.
2. A run that fails records its receipt under this order's evidence and does not close the order; dependents wait for an observed success, and the operator may withdraw the order with a dated note. An episode that fails a containment check stops the gate until the
   containment is structural.
