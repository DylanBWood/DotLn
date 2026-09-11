# WO-111 — The unattended hour: with the operator marked away, the resident derives and completes 5S work in a scratch repository under the progressive curve, verifies each change, and stops on return, recorded from an outside terminal (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** the actual local harnesses for the worker and verifier episodes;
the operator marks away and returns; launch claims recorded per episode
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. An evidence record; a defect found needs
its own bounded order. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
that the always-on runtime is the critical path, and the rule that the most
valuable order makes an existing claim true in a real session: the vision's
first sentence names a runtime. Planner-synthesized draft; captures and
hashes in the ledger section of that date. Opaque identifier, not a
priority. Clean-room screen: the target is a scratch repository.
**Depends on:** WO-100 merged (the portfolio and derivation); WO-119
merged (discovery of the seeded imperfections); WO-099 merged (the mission
check runs during the hour); WO-053 merged (the live
source-change primitive); WO-054 merged (verification of each change).
**Recommended placement:** immediately after WO-100; the second mandatory
replan checkpoint follows its receipt together with WO-053's. It adds
`docs/evidence/WO-111/`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-100",
    "relation": "hard",
    "reason": "the portfolio and derivation"
  },
  {
    "workOrderId": "WO-119",
    "relation": "hard",
    "reason": "discovery of the seeded imperfections"
  },
  {
    "workOrderId": "WO-099",
    "relation": "hard",
    "reason": "the mission check runs during the hour"
  },
  {
    "workOrderId": "WO-053",
    "relation": "hard",
    "reason": "the live source-change primitive"
  },
  {
    "workOrderId": "WO-054",
    "relation": "hard",
    "reason": "verification of each change"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
03-architecture.md §Operator-presence policy; `docs/evidence/WO-053/README.md`
(the receipt shape); the orders named in Depends on.

**Objective:** Seed a scratch repository with 5S candidates (misplaced
files with obvious homes, a lint mess, a recurring repair), declare a
portfolio over it with no remote grant, mark the operator away, and let the
resident run for one bounded window: the producer (WO-119) discovers the
imperfections and the resident derives orders from its candidates, executes them through the source-change primitive under the
curve (the first change one file, later changes a surface), verifies each,
fires the mission check on its cadence, and stops dispatching on return;
the receipt shows the progression, every event, each verification result,
the budget consumed, and that nothing outside the portfolio or worktree
changed.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No unattended work has ever been done by DotLn; the predecessor does it
  daily from a harness left open.

**Design (scope discipline):**

- The window and budget are the portfolio's; the operator's return is a
  real `resume: back`.
- **Declined alternatives, recorded:** a run on the operator's repository
  (the portfolio edit is theirs, after this proof); a run without
  verification.

**Deliverables:** the seed generator, the receipt with sanitized events and
JSON, the write-backs below.

**Acceptance criteria (all required)**

1. The receipt shows the seeded imperfections discovered by the producer
   and at least three derived orders completed in ascending phase with
   verified results, the first touching one file, and a reset if
   any verification failed.
2. The main checkout hash, a sentinel tree, and every path outside the
   portfolio are unchanged; no remote effect occurred.
3. The mission check fired at least once with its verdict recorded; the
   operator's return stopped dispatch within one tick with the in-flight
   episode handled per the phase.
4. Every claim is labeled `observed`, `launch-claim` or `unknown`; the
   budget consumed is reported with its method.
5. Write-backs land: README "What runs today" (the runtime sentence), 06 (a
   dated rung sentence), the capability table (`runtime.resident` and
   `worker.source-change` reassessed), ledger entry; the replan checkpoint is
   answered in the planning map.
6. `npm test` green; `git diff --check` clean; no runtime source, generated
   configuration or dependency change.

**Evidence gate:** the receipt; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the operator's repositories; publishing; any runtime fix.

**Operator-review assumptions**

1. The operator runs the window outside the sandbox and files the receipt.
2. A run that fails records its receipt under this order's evidence and does not close the order; dependents wait for an observed success, and the operator may withdraw the order with a dated note.
