# WO-051 — Source-change transport profile: the two CLI transports gain a `source-change-v1` launch shape with tools enabled inside an assigned worktree, written from the observed rows only (version assigned at activation)

**Model:** any capable model for the profile and fixtures; the live smoke
needs the actual harnesses, run by the operator from a terminal outside the
sandbox, stating harness version, model and effort (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a second transport profile and a
non-empty writable surface to the execution environment; the inspection
profile and its canonical arguments are unchanged. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D2, the adapter slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-044 merged (the observed rows this profile is written
from: tool-allowlist form, sandbox containment, result envelope, kill
behavior); WO-042 merged (the profile's envelope must come from the compiled
build's base and explicit grants); WO-009 merged (the transports this order
extends; satisfied at `v0.10.0`).
**Recommended placement:** after WO-044's record and the replan checkpoint;
it edits `packages/skeleton/src/worker-transport.ts` and
`execution-environment.ts` and their tests. A recommendation, not a
dependency token.

**Cites (read these sections):** 03-architecture.md §Ports
(`WorkOrderTransport`; the canonical launch shapes) and §Runtime primitive
catalogs; 02-domain-model.md §Identity and composition (AuthorityEnvelope;
effects `repo.write`, `git.local`, `repo.push`); 09-audit-resilience-privacy.md
§Privacy and minimization; `docs/discovery/writing-worker-smoke-<date>.md`
(WO-044's rows); `packages/skeleton/src/worker-transport.ts`
(`canonicalWorkerArgs`, `ClaudeCliPrintWorkOrderTransport`,
`CodexCliExecWorkOrderTransport`), `execution-environment.ts`
(`writableSurfaces`), `worker-protocol.ts` (the six-field envelope);
`docs/AI-HARNESS-SECURITY.md` §Current posture.

**Objective:** Add a `source-change-v1` profile to both transports: the
worker launches with the tool allowlist WO-044 observed to admit Edit, Write
and a bounded shell, with `cwd` the assigned worktree, with the harness
sandbox confined to that worktree, and with the base envelope allowing
`repo.write` and `git.local` inside the worktree and denying remote,
credential, settings and sandbox effects; the execution environment's
`writableSurfaces` names exactly that worktree; the result is the same
six-field envelope with the added observed commit identity; a profile whose
rows are `unavailable` in the record refuses to construct.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Both transports launch with every tool disabled (`--tools ""`,
  `--safe-mode`; the Codex read-only profile) and `writableSurfaces` is a
  readonly empty array (`worker-transport.ts:179-253`,
  `execution-environment.ts:30,66`). No profile can edit a file.
- The only worker envelope allows inspection effects; `repo.write` exists as
  an effect id with no transport that can exercise it.

**Design (scope discipline):**

- `WorkerProfile` gains a second member, `source-change-v1`, with its own
  canonical argument builder per harness taken row by row from WO-044's
  record; every argument cites the row id in a comment; the inspection
  profile's arguments are byte-identical to today's.
- `ExecutionEnvironment.writableSurfaces` becomes `readonly string[]`
  carrying the one worktree path for the profile; the environment refuses a
  surface that is not a Git worktree directory or that contains the
  launchpad checkout.
- The result envelope gains an optional `observedCommit` (`{ sha, branch }`)
  that the transport fills from `git rev-parse` in the worktree after the
  process exits; the six existing fields are unchanged.
- Construction refuses when the record's row for the requested capability is
  `unavailable` or `ambiguous`, naming the row.
- **Declined alternatives, recorded:** a general tool policy language (the
  profile is two shapes); running the worker in the launchpad checkout with
  a path allowlist (containment must be the worktree); the interactive
  harness modes.

**Deliverables:** the profile, the environment change, the envelope field,
fixtures with process doubles, a recorded live smoke, the write-backs below.

**Acceptance criteria (all required)**

1. The inspection profile's canonical arguments for both harnesses are
   byte-identical to the activation base, pinned as a fixture.
2. The source-change profile's arguments for both harnesses equal the shapes
   in WO-044's record row by row, pinned as a fixture that cites the row ids;
   constructing the profile against a record whose row is `unavailable`
   refuses with the row named.
3. The execution environment refuses a writable surface that is the launchpad
   checkout, a non-worktree directory, or a path outside the configured
   worktree parent; accepts a scratch worktree; and every existing
   environment fixture passes.
4. With process doubles, a source-change episode returns the six-field
   envelope plus `observedCommit`, and a double that exits without a commit
   returns `observedCommit` absent rather than a fabricated value.
5. A recorded live smoke, operator-run in a scratch worktree, shows each
   harness editing one file under the profile and returning the envelope,
   with paths reduced to shapes and the harness version, model and effort
   recorded as launch claims.
6. Write-backs land: 03 §Ports (the second profile), `docs/AI-HARNESS-SECURITY.md`
   §Current posture (one sentence), skeleton README runbook, ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; the live smoke record;
`npm test`; the evidence edition.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the host that creates worktrees and records episodes
(WO-052); any remote effect; the repair loop; a third harness.

**Operator-review assumptions**

1. The live smoke is operator-run outside the sandbox.
2. A worktree-confined sandbox is the containment boundary for the first
   proof; it is not a security boundary against a hostile model.
