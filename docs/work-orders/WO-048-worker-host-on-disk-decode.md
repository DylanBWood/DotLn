# WO-048 — Every on-disk value the worker and verification hosts trust is decoded positively before dispatch, and malformed state refuses without partial execution (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Host-side hardening in the skeleton with
no contract, schema or hash change. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
C1, fourth bounded order), cut at the operator's same-day correction. The
audit asked that worker-store recovery reject malformed state without partial
execution; the source verification found the store already refuses torn logs
and dead locks and validates transport results, and found no audit of the
remaining read paths. Planner-synthesized draft; captures and hashes in the
ledger section of that date. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-009 merged (the worker store, host and worktree
lifecycle; satisfied at `v0.10.0`); WO-010 merged (the verification host and
its saved capsules; satisfied at `v0.12.0`).
**Recommended placement:** any free lane after WO-045 lands, so the log
codec is not duplicated; it edits `packages/skeleton/src/worker-store.ts`,
`worker-host.ts`, `verification-host.ts` and their tests. A recommendation,
not a dependency token.

**Cites (read these sections):** 03-architecture.md §Session lifecycle &
resilience (the disposable inspection host paragraph: fsynced appends, one
exclusive host lock, immutable result receipts, torn-log refusal) and the
failure-injection matrix rows 2 and 6; 02-domain-model.md §Actors and
episodes (`WorkerResultObserved`, quarantine); `packages/skeleton/src/worker-store.ts`
(`read`, `acquire`, `saveResult`, `loadResult`), `worker-host.ts`,
`verification-host.ts`, `worker-protocol.ts` (`parseWorkerResult`),
`verification-protocol.ts` (`parseTransportResult`);
`docs/evidence/WO-009/README.md` (the abandoned-guard and torn-log rows);
`docs/work-orders/WO-105-crash-shape-corpus.md` (shape families, as
reference).

**Objective:** Enumerate every path where the worker store, worker host or
verification host reads bytes from disk and trusts their shape (the host
lock, saved result receipts, pending staging files, saved capsules,
recovery-time request keys), decode each positively with the failure named
by path, and prove with a malformed-state corpus that recovery refuses before
any dispatch, lock reclaim or result acceptance, leaving the store
byte-identical.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The host lock is parsed as `{ pid }` with only a pid check
  (`worker-store.ts:85-87`); saved results are validated on write
  (`saveResult`, `worker-store.ts:127-133`) and the read side's validation
  is not covered by a malformed corpus; the log is protected by `decodeLog`
  and the torn-append refusal (`worker-store.ts:62-67`).
- WO-009 proved the abandoned-guard and torn-log refusals; no fixture feeds a
  malformed saved receipt, a truncated capsule or a stale staging file with
  success-shaped contents into recovery.

**Design (scope discipline):**

- A read-path inventory in the order's evidence: each `readFileSync` or
  `JSON.parse` over store or capsule bytes, its consumer, and the decoder
  that now guards it.
- Positive decoders per shape: host lock (`{ pid }` exactly, positive safe
  integer); saved result and receipt (re-run `parseTransportResult` against
  the stored request on load, refuse a mismatch); staging files (never
  accepted as results, already); saved verification capsule (recompute the
  input hash and refuse drift, already partly covered; the corpus proves
  it); request keys (canonical form).
- A malformed-state corpus (at least ten shapes drawn from WO-105's families:
  truncated JSON, success-shaped receipt for another command, wrong result
  version, missing envelope field, foreign key, non-object) under the skeleton
  fixtures; each case asserts refusal, no dispatch, no lock change, and a
  byte-identical store afterward.
- **Declined alternatives, recorded:** a general schema layer (WO-045's
  kernel shape suffices); SQLite (a later persistence decision with a
  transactional consumer); silently deleting malformed files (inspection is
  the operator's; refusal names the path).

**Deliverables:** the inventory, the decoders, the corpus and tests, the
write-backs below.

**Acceptance criteria (all required)**

1. The inventory names every on-disk read in the three hosts with its
   decoder; a test enumerates the modules' read calls and fails when a new
   unguarded read appears.
2. Each corpus case refuses with the path and shape named, appends no event,
   changes no lock, accepts no result, and leaves the store bytes identical.
3. The WO-009 rows 2, 4 and 6 fixtures, the WO-010 loop and the live-record
   checks pass unchanged.
4. Write-backs land: 03 §Session lifecycle & resilience (the read-path
   guarantee in one sentence), skeleton README runbook note, ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; no hash
   or contract change; the regenerated bundle pins and a fresh feedback
   evidence edition because runtime source changed.

**Evidence gate:** the inventory; the corpus transcripts; `npm test`; the
evidence edition.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the kernel log codec (WO-045); continuation decoding
(WO-046); SQLite; changing result or capsule contracts; the source-change
host (WO-052).

**Operator-review assumptions**

1. The feedback audit is operator-run outside the sandbox.
