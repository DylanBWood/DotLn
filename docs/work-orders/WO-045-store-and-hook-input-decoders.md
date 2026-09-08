# WO-045 — Positive decoders for the kernel event log and the harness hook input: malformed persisted or supplied state refuses with a typed path before anything runs (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a kernel store codec that refuses
malformed envelopes and a host input decoder; kernel package `0.2.1` moves
(a stricter public `decodeLog`), skeleton moves for the hook input. No
contract version, event schema or hash preimage changes. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
C1, first of four bounded orders), cut at the operator's same-day correction
that the horizon's orders be small. The audit rated this P0; the pass's
source verification rates it P1 (no misdecode demonstrated; transport results
already validated). Planner-synthesized draft; captures and hashes in the
ledger section of that date. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-017 merged (the store codec this order extends; satisfied
at `v0.3.5`); WO-039 merged (the hook host whose input this order decodes;
satisfied at the `33e2c25` merge).
**Recommended placement:** any free lane after WO-042 activates; it edits
`packages/kernel/src/store.ts`, `packages/kernel/src/types.ts`,
`packages/skeleton/src/harness-host.ts` and their tests. A recommendation,
not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the pinned EventEnvelope schema 1 and the JSONL codec sentence under
§Memory and observation); 10-ir-compatibility.md §Separate version axes and
§Invariants ("Unknown compatibility fails visibly"); ADR-0002 §Amendments
(dependency posture: self-written decoders); `packages/kernel/src/store.ts`
(`parseLog`, `decodeLog`, `appendEvent`), `packages/kernel/src/types.ts`
(`EventEnvelope`), `packages/skeleton/src/harness-host.ts` (`runHarnessHook`,
`HarnessInput`); `packages/kernel/test/ac2-replay-store.test.ts`;
`docs/work-orders/WO-105-crash-shape-corpus.md` (the malformed-shape families
it enumerates, as reference).

**Objective:** Make the two boundaries every governed session and every
worker crosses first refuse malformed input positively: `decodeLog` validates
each line against EventEnvelope schema 1 (schema version, `evt_<n>` identity
in append order, string type and actor and workstream ids, finite numeric
`occurredAt`, optional string episode, correlation and causation ids, JSON
payload) and returns a typed failure naming the line and the JSON path; the
harness hook host decodes its stdin input the same way and refuses with the
protocol's refusal shape instead of a bare cast.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `parseLog` checks framing and that each line is a non-null object, then
  casts (`store.ts:25-31`); a line missing `type` or carrying a string
  `occurredAt` becomes an `Event` and fails later inside a reactor or a fold.
- `runHarnessHook` casts `JSON.parse(readFileSync(0))` to `HarnessInput`
  (`harness-host.ts:1764`); a hook that receives an unexpected payload shape
  relies on downstream `throw` paths and the catch-all refusal.
- The skeleton's worker store and every control-plane fold read the log
  through `decodeLog`, so this one codec is the trust boundary for persisted
  state.

**Design (scope discipline):**

- A `DecodeResult<T>` shape in the kernel: `{ ok: true, value }` or
  `{ ok: false, code, path, message }`. `decodeLog` keeps its throwing
  signature for existing callers but throws from the typed result, with the
  line number and path in the message; a new `tryDecodeLog` returns the
  result. Validation is positive and closed: unknown top-level keys refuse.
- `decodeHarnessInput(value: unknown)` in the harness host validates the
  event name against the config, `cwd` and `session_id` as strings, optional
  `tool_name`, `tool_input` and `tool_response` as objects, `prompt` as a
  string, `effort.level` as one of the five levels or absent, and
  `stop_hook_active` as a boolean; a failure refuses through the existing
  protocol refusal.
- No dependency: hand-written checks, as the codec and FNV implementations
  were.
- **Declined alternatives, recorded:** a schema library (dependency posture);
  changing `appendEvent`'s identity assignment; validating payload contents
  (payload meaning belongs to reactors); rewriting historical logs (they
  already conform, which the fixtures prove).

**Deliverables:** the kernel decode result and validation; the host input
decoder; a malformed-line corpus under `packages/kernel/test/fixtures/`; the
bundle regenerated with new runtime pins; the write-backs below.

**Acceptance criteria (all required)**

1. A corpus of at least twelve malformed lines (missing each required field,
   wrong types, out-of-order `evt_` identity, unknown key, non-object
   payload holder, schema version 2) each refuses with a distinct
   `{ code, path }`, and the message names the physical line number.
2. Every committed JSONL log in `docs/`, `packages/*/fixtures` and
   `corpus/` decodes unchanged; the WO-003 oracle, the WO-009, WO-010 and
   WO-011 evidence streams, and the WO-101 corpus pass byte-identically.
3. `decodeHarnessInput` refuses each of eight malformed hook payloads with
   the protocol refusal shape, and every WO-039 hook fixture and live-record
   check passes unchanged over the regenerated bundle.
4. The committed Contributor bundle differs from the activation base only in
   runtime file hashes and the manifest; `harness check` passes.
5. Write-backs land: 02 §Memory and observation (the codec sentence),
   kernel and skeleton READMEs, the capability table's `kernel.jsonl-replay`
   row reassessed, ledger entry; publication index rows and locks if a
   product heading changed.
6. `npm test` green; `git diff --check` clean; no new dependency; fresh
   artifact-identity and verification evidence editions if their checks
   require them, and a fresh feedback evidence edition (operator-run live
   audit) because runtime source changed.

**Evidence gate:** the corpus transcripts; the bundle diff; `npm test`; the
evidence editions.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** continuation decoding and the program type split (WO-046);
the replay projector (WO-047); the worker store's on-disk results (WO-048);
SQLite; new event types; changing any hash preimage.

**Operator-review assumptions**

1. Kernel package `0.3.0` is the right axis for a stricter public codec; the
   reviewer may prefer a patch if no caller observably changes.
2. The live feedback audit is operator-run outside the sandbox.
