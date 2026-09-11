# WO-083 — The real run: the operator's launchpad instance drives the first bounded slice of the Angular shell, planned in that fork, through executor, verifier and reviewer sessions under the fork's emitted build, with a pre-run baseline block and the four product-12 measures counted by the verifier (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** the launchpad-dispatched sessions run under the fork's own
declarations and emitted bundle; the operator witnesses; launch claims
recorded per session (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The witnessed run's evidence and the
write-backs it earns; the external effects happen in the operator's
repositories. Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-034's real run, baseline comparison and "the
build is the priming" items, cut into a bounded child at the operator's
2026-09-08 correction. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: the operator's own public repositories; the
baseline practice is described only as counts.
**Depends on:** WO-118 merged (the resident-owned loop is proven from a
starter instance before the fork runs it against a real target); WO-082
merged (the synthetic pilot precedes the witnessed run); WO-073 merged (the
profile convention the fork's profile follows).
**Recommended placement:** after WO-082; the shell's orders are planned by
the fork's own planning pass and never filed here; this order records only
the receipt under `docs/evidence/WO-083/`. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-118",
    "relation": "hard",
    "reason": "the resident-owned loop is proven from a starter instance before the fork runs it against a real target"
  },
  {
    "workOrderId": "WO-082",
    "relation": "hard",
    "reason": "the synthetic pilot precedes the witnessed run"
  },
  {
    "workOrderId": "WO-073",
    "relation": "hard",
    "reason": "the profile convention the fork's profile follows"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §Replacing a
successful but costly workflow (the four measures) and §One workstream
across repositories; `docs/work-orders/WO-034-cross-repository-workstream-pilot.md`
(the umbrella's wording: the real run, the baseline block, the counting
rule, the priming measurement); 13-uifa-roles.md §UIFA showrunner;
`docs/siblings/README.md`.

**Objective:** The operator exports the launchpad into their starter
repository, forks or clones it as their instance, registers the Angular
repository as a target with an Angular UI class, authors `WS-001` whose
first member order is the first bounded slice of the UIFA v1 shell as that
fork's planning pass cuts it, records the pre-run baseline block (records named by SHA-256
before activation), and lets the fork's resident drive the order through the lifecycle with
its own actors under the fork's emitted build, ordinary phase handoffs
performed by the runtime and only material decisions returned to the
operator; the
receipt records the pull request, the reports, elapsed phases, every
intervention and manual handoff, the units that fired and the refusals
observed, each vision restatement the executor needed by hand, and the four
measures counted under the pinned rule with direction against the attested
baseline.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The route is recorded as a candidate with no evidence; after WO-112 the
  loop is proven from core against a scratch target, not from a fork
  against a real one.

**Design (scope discipline):**

- The counting rule and the attestation labeling are the umbrella's,
  unchanged; unmeasured values are `unknown`, never a baseline.
- **Declined alternatives, recorded:** building the shell in this
  repository; a first Angular order that is a phase table.

**Deliverables:** the receipt with sanitized transcripts and fired-unit
counts; the write-backs below.

**Acceptance criteria (all required)**

1. The receipt names the launchpad instance, the target pull request opened
   by `worktree publish`, the reports in the launchpad, the elapsed phases,
   every intervention and handoff, the fired units and refusals, the pre-run
   baseline block and the activation event that follows it, and the
   operator's witness line; the pull request contains no launchpad
   vocabulary and no harness file; sanitized transcripts pass the local-terms
   check with the list present.
2. The four measures are counted by the independent verifier under the
   pinned rule from the run's own transcripts and control log (restatements
   and handoffs at least), the baseline half is labeled an operator
   attestation, and each observed measure is lower than its observed
   baseline or recorded as failed; an `unknown` baseline yields
   `unverified`, never a pass.
3. `WS-001` and the profile exist in the fork in the declared shapes; each
   restatement the executor needed is listed; zero is the pass condition for
   "the build is the priming", and one or more records that claim as failed
   with the file or build element that should have carried it.
4. Write-backs land: `docs/siblings/README.md` (the Angular consumer's
   entry), the capability table (`consumer.angular` only above level 0 on a
   complete run), 12, 04 §Plural UI hosts, 13, 06, ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the receipt; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** manually opened sessions as the executors (that is the
predecessor's shape); console v1 beyond the slice; any external
organization's fork.

**Operator-review assumptions**

1. A run that fails records its receipt under this order's evidence and does not close the order; dependents wait for an observed success, and the operator may withdraw the order with a dated note. No capability promotion follows a partial or failed run.
