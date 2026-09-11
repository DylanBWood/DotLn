# WO-054 — Verification over a real worktree: the blinded verifier receives a contract, a diff and a snapshot of the target worktree, runs the target's focused tests itself, and never sees the implementer's narrative (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the profile and fixtures; the live rows in
WO-056 use the actual harness. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a snapshot profile to the
verification host and a host-run test witness to `verification-v1`'s
evidence kinds; the contract version is unchanged if the addition is
compatible, which the order records. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
E, the host slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-052 merged (the target worktree and the diff the verifier
snapshots); WO-010 merged (the `verification-v1` loop this order lifts;
satisfied at `v0.12.0`).
**Recommended placement:** after WO-052, in any free lane; it edits
`packages/skeleton/src/verification-host.ts`, `verification-protocol.ts`
and the compiler's `verification-v1` evidence kinds if a compatible extension
is needed. A recommendation, not a dependency token.

**Cites (read these sections):** 01-principles.md Principle 6 (the
implementer never verifies); 02-domain-model.md §Independent verification v1 (the capsule, blinding, the acceptance matrix fold); 03-architecture.md §Ports (the verification adapter boundary); `packages/skeleton/src/verification-host.ts`,
`verification-protocol.ts`; `packages/compiler/src/verification.ts`;
`docs/evidence/WO-010/README.md` (the synthetic-repository loop and the
matrix fold).

**Objective:** Give the verification host a `worktree-snapshot` profile: the
verifier's input is the StoryContract or WorkOrder contract, the diff against
the declared base, the list of tests the WorkOrder names, and a read-only
snapshot of the worktree; the host runs the named tests itself before the
verifier episode and attaches their results as `live` host-run witnesses;
the implementer's transcript, envelope and narrative are never in the
capsule; the acceptance-matrix fold keeps its rule that no implementer-emitted
event can relabel a negative result.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- WO-010's loop verifies a synthetic repository with process doubles; the
  capsule carries fixture files, not a worktree snapshot, and the host runs
  no target tests.
- A real change's behavior claims need a host-run test result to be `live`
  evidence; today a claim's evidence is what the verifier episode reports.

**Design (scope discipline):**

- The snapshot: a read-only copy or `git archive` of the worktree at the
  observed commit plus the diff; the capsule's input hash covers both.
- Host-run tests: the WorkOrder's named test commands run in a fresh
  checkout of the snapshot with the sandbox confined to it, before the
  verifier episode; results attach as witnesses with `origin: host`.
- The verifier episode reads the contract, diff, snapshot and witnesses
  through the existing capsule shape; a capsule that contains a field from
  the worker result envelope refuses.
- **Declined alternatives, recorded:** letting the verifier run arbitrary
  commands (untrusted target tests are the isolation risk; the host runs
  only named commands in the confined checkout); trusting the worker's
  `testAfter` (the implementer's witness is never verification evidence).

**Deliverables:** the profile; the host-run witness kind; fixtures over the
WO-052 scratch target with doubles; the write-backs below.

**Acceptance criteria (all required)**

1. A capsule built from a WO-052 fixture episode contains the contract, diff,
   snapshot hash and host-run witnesses and no field of the worker envelope;
   injecting an envelope field refuses with the path.
2. The host runs the named tests in a confined checkout and a fixture that
   tampers with the snapshot after the capsule is sealed is refused by the
   input hash.
3. A planted implementation that passes a superficial test and violates the
   contract is recorded by a double verifier as a failing finding with
   expected, observed, reproduction and evidence references, and the matrix
   fold keeps it negative when a fixture implementer emits a success-shaped
   event.
4. Every WO-010 fixture passes unchanged under the existing profile.
5. Write-backs land: 02 §Independent verification v1 (the profile and the host-run witness), 03 §Ports, skeleton README, ledger entry; a 10 note if the
   contract extension is compatible.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the repair continuation (WO-055); the live verifier episode
(WO-056); visual or network claims (WO-058); code-review episodes.

**Operator-review assumptions**

1. Running a target's named tests in a confined checkout is acceptable
   isolation for the first proof; it is not a security boundary.
