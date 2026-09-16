# WO-133 — Stand-down residue: the built runtime follows main, an unavailable adapter says so once, attestation keeps the operator's supplied model and effort, and a version bump alone never selects the machinery suites (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** patch. The skeleton harness host and the
generated prelude text, the contributor role text, the release, worktree
and resume helpers, the runner's declared sources and a new version module
change; the hooks regenerate; no contract, schema, predicate or envelope
changes. Assigned at activation under the standing opt-out default.
**Cost:** adds no recurring step, check, receipt, hook, key or ritual; adds
one `npm run build` (3.9 s measured) to a release close or worktree finish
whose fast-forward changed the pinned runtime. Removes, per session on main
after a close, the advisory that today repeats on every hook event (344
journal rows between 2026-09-16T00:08Z and 03:03Z in one session, two per
Bash call) and the rebuild the operator has to remember (seven closes on
2026-09-15); removes the `unknown` model and effort that every completion
since 2026-09-15T18:22Z has recorded although the operator selected both;
removes about 400 s from every reviewer gate whose only change under
`harness-host.ts` or `loadouts/` is a version literal (observed 625, 663,
716, 807 and 840 s with `harness-fixtures` and `process-debt` selected
against 191 to 413 s without; five of the seven reviewer gates since WO-132
paid it). Context bytes and tokens per session fall by the flood's lines.
**Nomination provenance:** the operator's 2026-09-16 planning dispatch and
its mid-turn message with the screenshot of the repeated advisory, captured
verbatim in ignored intake (SHA-256
`07ffad87a856637579b6a40ba7f7bf77a533ccbd5e0622784086bc33a2bab279`);
WO-050 VER-001 finding 2 and its planner nomination; WO-132 FINAL-001's
future observations; the ignored gate rows in
`docs/control/local/harness/checks.json`; WO-047 D005 and WO-048 D003 (the
literal bumps). Planner-synthesized; the diagnosis is
[the R1 replan document](../planning/r1-replan-2026-09-16.md) §3.1 to §3.3.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-132 merged (`v0.18.0`): the mechanisms this order
completes. Closed.
**Recommended placement:** first in reading order; lane pair with WO-068,
whose surfaces are disjoint. It edits `packages/skeleton/src/harness-host.ts`,
`packages/compiler/src/harness.ts` (the generated prelude),
`packages/skeleton/src/loadouts/contributor.ts`, `scripts/resume.mjs`,
`scripts/release.mjs`, `scripts/worktree.mjs`, `scripts/test-runner.mjs`
and adds `packages/skeleton/src/version.ts`. WO-049 edits the same prelude
and integrates on this order's merge. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-132",
    "relation": "satisfied-by-close",
    "reason": "the advisory delegation, the publish-only close and the log-only attestation this order completes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** [the R1 replan document](../planning/r1-replan-2026-09-16.md)
§3.1 to §3.3; WO-132 criteria 7, 9 and 10; the planning diagnosis
[machinery-stand-down-2026-09-15.md](../planning/machinery-stand-down-2026-09-15.md)
§5 items 1 and 3; 07-execution-guide.md §Discipline (machinery stand-down;
write once, run once) and §Independent workflows and integration;
`packages/skeleton/src/harness-host.ts` (`assertHarnessRuntime`,
`protocolAdvisory`, `BOOTSTRAP_HATCH_TEXT`, the journal append in the hook
entry's `finally`); `packages/compiler/src/harness.ts` (the fallback
`advisory` and the generated prelude's `catch`); `scripts/lib/harness.mjs`
(`harnessInstallation` runtime files, `checkHarness`); `scripts/release.mjs`
(`updateMainAndFinish`; the build-when-missing branch); `scripts/worktree.mjs`
(`finish`); `scripts/test-runner.mjs` (`machinerySources`; the review
selection); `scripts/resume.mjs` (the attestation fields);
`packages/skeleton/src/loadouts/contributor.ts` (the completion-flags line
and the operator-attested default); WO-050 VER-001 §Disclosed environment
finding 2; `docs/control/current.md`.

**Objective:** A session on main after a release close or worktree finish
finds a built runtime that matches the regenerated pins. When the runtime is
still unavailable, each session sees one advisory naming the cause and the
command, never one per tool call and never from a `PostToolUse` observer,
and its session start says so. A completion records the model and effort
the operator selected with source `operator-attested` whenever the session
cannot read back effective values, and `unknown` only when nobody supplied
a value. A bump of the skeleton or compiler version literal alone selects no
machinery suite in the reviewer's gate.

**Observed gap (dated 2026-09-16, `main` at `b7914ed`, v0.22.0):**

- This session's ignored hook journal holds 344 rows of "DotLn advisory:
  built adapter unavailable" from every hook kind, including the
  `PostToolUse` observers, between 00:08Z and 03:03Z. The checkout's
  `packages/*/dist` was built at 2026-09-15T23:29Z and main was
  fast-forwarded by three closes after it (00:06Z, 01:41Z, 02:50Z); each
  regenerated the pins, `assertHarnessRuntime` found the bytes differed, and
  the prelude's catch printed the advisory on every invocation. `harness
  check` reported drift at `commit-msg.mjs` until a 3.9 s build. Because the
  session hook also fell back, the session took no writer reservation and
  had no usage counters.
- `release close` builds `packages/skeleton/dist` only when it is missing
  (WO-132 criterion 10); a stale build is not detected by the close or by
  `worktree finish`, which also moves main.
- No hook remembers that it already emitted an advisory in this session;
  the observers, which return no decision, emit it too.
- Attestation: the canonical projection for WO-047 records `effort unknown;
  source operator-selected-model-effective-effort-unavailable` at Claude
  Code 2.1.273; WO-050's `ImplementationReady` attests `unknown`, `unknown`,
  `unavailable` for a GPT-6 Astra session at max; the last operator-attested
  Codex completion is WO-132 at 16:37Z and the first degraded one WO-067 at
  18:22Z. The role text says values are logged as given and the Codex
  default is operator-attested; sessions supply `unknown` instead.
- `machinerySources["harness-fixtures"]` and `["process-debt"]` include
  `packages/skeleton/src/harness-host.ts` and `loadouts/`, which carry
  `HARNESS_HOST_VERSION` and both profiles' `skeletonVersion` literals;
  every skeleton release bumps them (WO-048 D003, WO-047 D005), so the
  reviewer's gate selected `harness-fixtures` (254 to 493 s) and
  `process-debt` (139 to 164 s) for WO-067, WO-048, WO-050 and WO-047, while
  WO-046, which left the literals alone, ran 24 suites in 227 s.

**Design (scope discipline):**

- Advisory once per session per cause: the generated prelude's catch and
  `protocolAdvisory` consult a per-session marker under the harness state
  directory keyed by session id and cause class (`pins-differ`,
  `snapshot-missing`, `runtime-unavailable`, `classification`); the first
  occurrence returns the advisory with the cause and the command, later
  occurrences write only the journal row; `PostToolUse` observers return no
  advisory. When the state directory is unwritable the advisory is returned
  (fail-open on the message, never on authority). The two kept refusals are
  untouched.
- Session start names the cause: the `SessionStart` hook compares the pins
  with the built bytes and prints one line when they differ.
- The runtime follows main: `release close` and `worktree finish` run the
  pin comparison after their fast-forward and `npm run build` when it fails;
  `resume` and `plan start` print the one line and never build.
- Attestation keeps supplied values: the role text for every role directs a
  session without effective readback to supply the operator-selected model
  and effort with `--source operator-attested`; `resume` never rewrites a
  supplied model or effort to `unknown` and maps the legacy
  `operator-selected-model-effective-effort-unavailable` source to
  `operator-attested` with the supplied effort. If the executor finds the
  script rather than the role text discards the value, the fix moves to the
  script and the criterion's outcome is unchanged.
- One version module: `HARNESS_HOST_VERSION` and the profiles'
  `skeletonVersion` come from `packages/skeleton/src/version.ts`, which no
  machinery suite declares; the reviewer's selection ignores a change
  confined to it.
- Admitted boy-scout item inside the same role-text edit: one line in the
  executor and verifier procedures, run `npm run publication:check` after
  touching a product document (WO-045 and WO-046 FINAL-001 nominated it
  twice).
- **Declined alternatives, recorded:** a hook that builds (slow, concurrent
  with a live gate, and the operator's terminal would wait on a tool call);
  suppressing the advisory entirely (a broken runtime must be visible once);
  a shell classifier or any change to the two kept refusals; splitting
  `harness-host.ts`; four orders.

**Deliverables:** the marker and cause classes; the session-start line; the
rebuild in the two helpers; the role-text and `resume` changes; the version
module and the runner's declared sources; regenerated bundle and manifest;
fixtures in the existing harness, process-debt, release and resume suites;
the write-backs below.

**Acceptance criteria (all required)**

1. Fixture: a generated hook set invoked twenty times in one session against
   a stale runtime returns exactly one advisory `systemMessage`, naming
   `pins-differ` and the bootstrap command, and writes twenty journal rows;
   the `PostToolUse` observers return none; a second session receives its own
   single advisory; a second writer and a live-gate write are still refused.
2. Fixture: `SessionStart` with stale pins prints one line naming the cause
   and the command; with matching pins it prints nothing about the runtime.
3. Release fixture: a close whose fast-forward changes the pinned runtime
   runs the build double once and its manifest cites the rebuilt runtime; a
   close whose fast-forward changes no pin runs no build; `worktree finish`
   likewise; the close fixture's recorded time excluding network stays under
   120 s.
4. Fixture: the generated role text for all six roles carries the
   operator-attested fallback line and the publication-check line; `resume`
   records a supplied model and effort verbatim with source
   `operator-attested`, refuses to rewrite a supplied value to `unknown`, and
   maps the legacy source token. The decisions file records the first real
   completion on each harness after merge as the observation.
5. Fixture: with only `version.ts` changed since the base, `npm test --
   --review` selects no machinery suite; with `harness-host.ts` changed it
   selects `harness-fixtures` and `process-debt`; a grep pin proves the three
   literals exist only in `version.ts`.
6. The regenerated bundle and manifest pass `harness check`; write-backs
   land: 07 §Discipline (the advisory rule and the version module under
   write once, run once), 02 §Harness compiler v1 (one sentence on the
   prelude's fallback), the playbook's release task (the rebuild), skeleton
   README, the decisions file with the before and after observations (the
   advisory count, the reviewer gate durations).
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test` once at final
review; the first real close after merge and the next skeleton order's
reviewer gate are the reopening observations.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** any new hook, key, cache, gate or check; a shell classifier;
the stale writer reservation self-diagnosis (WO-050 VER-001 finding 1; a
candidate in product 07); the weakened `test-worktree.sh` assertion (WO-132
FINAL-001 item 2; a boy-scout item for the next order touching that script);
the machinery suites' own duration; splitting `harness-host.ts`.

**Operator-review assumptions**

1. One 4 s build inside a release close or worktree finish is acceptable.
2. The advisory marker lives under the harness state directory and is per
   session; a new session says it again once.
3. Role text is the expected fix for attestation; if the script is the
   cause, the executor moves the fix there under the same criterion.
