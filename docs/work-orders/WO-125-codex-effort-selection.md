# WO-125 — Codex effort selection: the Codex transport accepts the declared effort levels and forwards the reasoning-effort override to `codex exec`, from an observed row, so a Codex refuter or worker can be launched at `max` (v0.17.2)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the adapter and fixtures; the observed row
needs the actual Codex CLI, run by the operator outside the sandbox. State
the model and effort actually run (07-execution-guide.md §Model-specific
notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One transport adapter accepts more of
its declared input; no contract change; the launch-claim record gains a
value it already had a field for. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** the operator's 2026-09-08 request during the
critical-path planning pass, relaying a second model's finding that the
Codex adapter refuses every effort but `unknown` and ignores user
configuration, so a Codex refuter cannot be launched at `max`; WO-019's
effort-truth contract (launch claims recorded; effective readback unknown).
Planner-synthesized draft; the request is preserved in the pass's ignored
correction capture. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-009 merged (the Codex transport; satisfied at `v0.10.0`);
WO-019 merged (the effort declaration and launch-claim contract; closed).
**Recommended placement:** any free lane, first if the operator wants the
refuter on Codex at `max` before the horizon starts; it edits
`packages/skeleton/src/worker-transport.ts`, its fixtures, the refutations
README and product 07 §Model-specific notes. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-009",
    "relation": "satisfied-by-release",
    "release": "v0.10.0",
    "reason": "the Codex transport"
  },
  {
    "workOrderId": "WO-019",
    "relation": "satisfied-by-close",
    "reason": "the effort declaration and launch-claim contract"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Model-specific notes
(effort declared per order; readback unknown); 01-principles.md Principle 15;
`docs/planning/refutations/README.md` (the Codex selection sentence);
`docs/discovery/codex-runtime-map.md` and `environment.md` (the recorded
Codex rows); `packages/skeleton/src/worker-transport.ts`
(`CodexCliExecWorkOrderTransport`; the refusal of any effort but `unknown`);
`scripts/refute-plan.mjs` (`--effort <level>`); `docs/evidence/WO-019/`.

**Objective:** Observe, then implement: one row records whether
`codex exec` accepts a reasoning-effort override as a configuration flag
(`-c model_reasoning_effort="<level>"`) for the five declared levels and
what, if anything, it reads back; the transport then accepts `--effort`
values from the declared set, forwards the override exactly as observed,
records the requested level as a launch claim with readback per the row,
keeps `unknown` as the value that requests nothing, and still ignores user
configuration so a launch claim never depends on a setting outside the
repository.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `CodexCliExecWorkOrderTransport` refuses any request whose effort is not
  `unknown` (`worker-transport.ts:218`), the recorded selection contract at
  WO-009's time; the refuter's `--effort` flag therefore has one legal value
  on Codex while the Claude transport accepts `max`.
- The refutations README states the Codex selection as `gpt-6-astra` with
  effort `unknown`.

**Design (scope discipline):**

- The row first: a probe launch per level with the flag, the exit and
  result shape, and any effort field in the output; an `unavailable` row for
  a level means the adapter refuses that level with the row named.
- The adapter forwards the flag only for levels the row observed accepted;
  the argument builder cites the row; every existing Codex fixture is
  byte-identical when effort is `unknown`.
- **Declined alternatives, recorded:** reading the user's Codex settings
  (launch claims must not depend on configuration outside the repository);
  claiming effective effort from the request (readback stays what the row
  says).

**Deliverables:** the row in the discovery record; the adapter change;
fixtures; the README and product-07 sentences; the write-backs below.

**Acceptance criteria (all required)**

1. The discovery record carries one row per declared level with the command
   shape, exit and any readback, labeled observed, blocked or unavailable.
2. With process doubles, a request at each observed-accepted level forwards
   the override exactly as recorded and records the level as a launch claim;
   `unknown` forwards nothing and every existing Codex fixture is
   byte-identical; an unavailable level refuses with the row named.
3. `npm run plan -- refute --transport codex-cli-exec --model gpt-6-astra --effort max`
   constructs the transport (fixture-proven with a double; the live run is
   the operator's).
4. Write-backs land: the refutations README sentence, 07 §Model-specific
   notes, `environment.md` addendum, ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the row; the fixture transcripts; `npm test`; the
evidence edition.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the Claude transport; effective-effort readback beyond what
the row shows; a third transport (WO-110).

**Operator-review assumptions**

1. The operator runs the probe row outside the sandbox before the adapter
   changes.

## Execution record

Authorized repair expansion, recorded 2026-09-11.

Operator `resume: fix` selects [VER-001](../verifications/WO-125/VER-001.md).
F1 requires runtime effort membership before process launch; the adjacent F2
repair makes an omitted builder version non-admitting. The operator explicitly
added F3, then clarified that the active gate protects only files whose changes
invalidate the run. Frequent CLI upgrades are a reopening condition for the
version compatibility policy, distinct from runtime effort membership.

F3 adds the runner, evidence entry, generated pre-tool host, shared gate-input
inventory and bounded shell-destination classifier to this order:
`scripts/test-runner.mjs`, `scripts/harness-entry.mjs`, `scripts/harness.mjs`,
`package.json`, `packages/skeleton/src/harness-host.ts`, `gate-evidence.mjs`
and `harness-command.ts` in the same source directory,
`scripts/lib/suite-evidence.mjs`, and their runner/generated-hook fixtures.
Live runs refuse agent Write/Edit and write-classified shell commands that
could change protected gate inputs, with the active run named. Ignored scratch
writes outside the input set remain eligible under existing authority. A dead
run's marker cannot strand writes. Fixtures must execute attempted writes
through generated hooks, prove refusal and unchanged gate inputs, and prove
excluded writes and dead-owner recovery. Product 07 and
[WO-125-D003](../evidence/WO-125/decisions.md#wo-125-d003) retain the decision
and its limits. The existing final input comparison remains in place.
