# WO-051 — Source-change writer request and transport profile: a separate writer request with its own validator, prompt and result beside the untouched inspection request, and a `source-change-v1` launch shape for both CLIs written from the observed rows (version assigned at activation)

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
it edits `packages/skeleton/src/worker-protocol.ts`, `worker-transport.ts`
and `execution-environment.ts` and their tests. A recommendation, not a
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

**Objective:** Add a writer request beside the inspection request and a
`source-change-v1` profile to both transports: the
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
  `--safe-mode`; the Codex read-only profile) (`worker-transport.ts:179-253`).
  The `writableSurfaces: readonly []` tuple belongs to the Beacon perception
  profile (`execution-environment.ts:26-31`), not to a general execution
  environment; the inspection worker uses `fixture-inspection-v1` with one
  read mount, its request validator requires `repo.inspect` and prohibited
  `repo.write` and `repo.delete` (`worker-protocol.ts`, `validateRequest`),
  and its prompt instructs inspection only. Enabling tools or widening the
  Beacon tuple would leave that request rejection and prompt in place.
- The only worker envelope allows inspection effects; `repo.write` exists as
  an effect id with no transport that can exercise it.

**Design (scope discipline):**

- A `WriterRequest` in `worker-protocol.ts` beside `WorkerRequest`: its own
  `validateWriterRequest` (intent `Act` with effect `repo.write`, a
  `source-change-v1` profile whose one mount is the worktree with
  `read-write` access, `repo.write` and `git.local` in the WorkOrder's
  allowed operations and every remote, credential and settings effect in
  its prohibited operations), its own prompt (edit within the declared
  surfaces, run the named focused test, read the diff, commit with the
  conventional shape, return the envelope), and its own result parser; the
  inspection request, validator and prompt are byte-identical to today's
  and their refusals are re-proven.
- A `SourceChangeProfile` type in `execution-environment.ts`
  (`profileId: "source-change-v1"`, one `read-write` mount) joins the
  profile union; the Beacon perception profile's empty tuple is untouched;
  the environment refuses a mount that is not a Git worktree directory or
  that contains the launchpad checkout.
- The transports dispatch on the request's kind: a writer request selects
  the `source-change-v1` canonical arguments per harness, taken row by row
  from WO-044's record with the row id cited beside each argument; an
  inspection request selects today's arguments, byte-identical.
- The result envelope gains an optional `observedCommit` (`{ sha, branch }`)
  that the transport fills from `git rev-parse` in the worktree after the
  process exits; the six existing fields are unchanged.
- Construction refuses when the record's row for the requested capability is
  `unavailable` or `ambiguous`, naming the row.
- **Declined alternatives, recorded:** a general tool policy language (the
  profile is two shapes); running the worker in the launchpad checkout with
  a path allowlist (containment must be the worktree); the interactive
  harness modes.

**Deliverables:** the writer request, validator, prompt and parser; the
profile type; the transport dispatch; the envelope field; fixtures with
process doubles; the write-backs below. The live smoke is WO-053's.

**Acceptance criteria (all required)**

1. The inspection profile's canonical arguments for both harnesses are
   byte-identical to the activation base, pinned as a fixture.
2. The writer request's validator accepts a conforming request and refuses
   one with `repo.inspect` intent, a read-only mount, a missing `repo.write`
   allowance, or a remote effect in the allowed list; the inspection
   validator still refuses a request carrying `repo.write` or a writable
   mount (both pinned); the source-change arguments for both harnesses equal
   WO-044's rows, pinned with the row ids; a record whose row is
   `unavailable` refuses construction with the row named.
3. The execution environment refuses a writable surface that is the launchpad
   checkout, a non-worktree directory, or a path outside the configured
   worktree parent; accepts a scratch worktree; and every existing
   environment fixture passes.
4. With process doubles, a source-change episode returns the six-field
   envelope plus `observedCommit`, and a double that exits without a commit
   returns `observedCommit` absent rather than a fabricated value.
5. Write-backs land: 03 §Ports (the second profile), `docs/AI-HARNESS-SECURITY.md`
   §Current posture (one sentence), skeleton README runbook, ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the host that creates worktrees and records episodes
(WO-052); the live smoke (WO-053); any remote effect; the repair loop; a
third harness; the Beacon perception profile.

**Operator-review assumptions**

1. A worktree-confined sandbox is the containment boundary for the first
   proof; it is not a security boundary against a hostile model.
