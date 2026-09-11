# WO-119 — Executable discovery producer: a bounded actor episode observes a target worktree's real imperfections through the target's own commands and declared conventions and emits typed work candidates with evidence, using only the executable program subset (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the producer and fixtures; the live row
runs the producer as a `script` actor. State the model and effort actually
run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One producer module and one candidate
contract in the skeleton; no dependency. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 3): the Entropy Reducer's candidate producer is
`operator-mediated-manual` and its program uses `Program.All`, which the
stepper cannot evaluate, so the portfolio had no executable producer.
Planner-synthesized draft; the capture's hash is in the ledger section of
that date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-068 merged (the producer runs as an actor episode the
resident dispatches); WO-023 merged (the Entropy Reducer's Sort rule and
candidate shape it reuses; satisfied at `v0.5.0`); WO-046 merged (the
executable grammar as a type; the producer's program is checked against
it).
**Recommended placement:** after WO-068, before WO-100; it adds
`packages/skeleton/src/discovery.ts` and a `WorkCandidate` contract. A
recommendation, not a dependency token.

**Cites (read these sections):** 05-pattern-library.md §5S / 6S (Sort,
Shine); `packages/skeleton/src/loadouts/entropy-reducer.ts` (the
`operator-mediated-manual` boundary and the candidate shape);
`packages/kernel/src/core.ts` (`EVALUABLE_PROGRAM_KINDS`);
`docs/work-orders/WO-068-resident-host.md` (the `script` actor kind);
`docs/work-orders/WO-100-preauthorized-portfolio.md`.

**Objective:** `discover(worktree, conventions)` runs as a `script` actor
episode in a confined target worktree and emits `WorkCandidate` values
(`{ candidateId, kind, paths[], evidence[], proposedHome?, size }`) from
observable facts only: the target's own declared lint and test commands
failing, files violating the declared placement conventions of the
repository profile, generated files with no references (the Sort rule),
and repeated repairs recorded in the target's history; its program is in the
executable subset (Sequence, Guard, Invoke, Await) and never awaits an
operator; a deterministic fixture repository yields a pinned candidate set,
and a live row over a scratch repository yields candidates the portfolio
(WO-100) consumes.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The only candidate producer is the Entropy Reducer's manual review, whose
  program contains `Program.All` and awaits operator disposition; the
  stepper refuses `All` as deferred.

**Design (scope discipline):**

- Candidates are facts with evidence references, never model opinions; a
  model episode may later rank them, labeled as inference.
- The producer reads conventions from the repository profile (WO-073's
  sections) when present and from a default set otherwise.
- **Declined alternatives, recorded:** implementing `Program.All` (a later
  rung with its own consumer); a model scanning the repository freely.

**Deliverables:** the contract, the producer, a fixture repository, the
live row, the write-backs below.

**Acceptance criteria (all required)**

1. Over the fixture repository (a failing lint, a failing test, two
   misplaced files, one stale generated file, one repeated repair), the
   producer emits the pinned candidate set with evidence references, and a
   test proves its program contains only executable kinds.
2. The producer runs as a `script` actor through the resident with a fake
   clock and appends its candidates as an event; it never awaits an
   operator.
3. A live row over a scratch repository seeded the same way reproduces the
   candidate kinds, recorded with shapes only.
4. Write-backs land: 05 §5S / 6S (Sort and Shine have an executable
   producer), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** deriving orders (WO-100); executing anything; ranking by a
model.

**Operator-review assumptions**

1. Facts with evidence are enough for the first portfolio; ranking follows.
