# WO-199 — The vertical survives an interrupt and a host crash: a writer launched through the vertical records its process group, an interrupted `dotln vertical` stops its writer and resumes on rerun, and a host refusal after a writer's result records its own reason (version assigned at activation)

**Model:** any capable model; the live feedback episode runs on Codex
`gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`. State
the model and effort actually run (07-execution-guide.md §Model-specific
notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** delivery
**Release classification:** patch. Three recorded defects in the vertical's
recovery path are repaired in place with their regressions; no new
capability, configuration or command. Assigned at activation under the
standing opt-out default.
**Cost:** adds a `processGroup` exposed by the vertical's transport wrapper
(`scripts/lib/vertical-transport.mjs`), an interrupt handler on the
`dotln vertical` branch (`packages/skeleton/src/dotln.ts` lines 85 to
108), a typed reason for a host refusal after a writer's result
(`packages/skeleton/src/source-change-host.ts` lines 789 to 818), and the
three regressions beside the probe `docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`.
Removes, by the record: an issue sealed `refused` after a crash or
interrupt even when the writer finished cleanly (WO-112 FINAL-001 F1,
D065; reproduced by the probe: `crash-vertical` throws, `crash-direct`
recovers); a model writer that keeps editing the governed worktree after
Ctrl-C stops the host (D060; reproduced 1.5 s after SIGINT in FINAL-001);
a refusal recorded as `WorkerInterrupted transport-failed` (D066). WO-118
inherits all three and cannot kill an actor and restart the resident
(its criterion 2) until they are gone. Re-mints: `source-change-host.ts`
and `vertical.ts` are judged by the feedback verifier
(`packages/skeleton/src/feedback-audit.ts` lines 64 and 34), so one live
feedback episode runs after the last judged-source edit; the editions
those files stale are re-minted deterministically
(`scripts/lib/evidence-sources.mjs`); `scripts/test-vertical.mjs` is the
`vertical` product row, so `npm test` covers it and the final criterion
names `npm test -- --review` because `dotln.ts` and `worker-transport.ts`
sit in machinery closures (the executor confirms with
`npm test -- --review --list` at the base). Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** WO-112 FINAL-001's handoff ("WO-118 should take
D060 and D065 before it relies on stopping and rerunning a vertical");
register rows FUP-627ec3088bb86e62 (D065) and FUP-5f8a48126bb022be (D060),
both without disposition; D066; the 2026-10-07 pass's no-code screen of
WO-118, which found "nothing new is built here" while its criterion 2
needs this recovery. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: repository records and a scratch target
only; no stop condition. The [planning document](../planning/machinery-reset-2026-10-07.md)
§8.
**Depends on:** WO-112 merged (the vertical's intake and triage episodes,
the integrity checks and the probe this order repairs against; closed,
v0.68.0); WO-123 merged (the composition; closed, v0.67.0).
**Recommended placement:** the delivery lane of the first pair after
WO-196, beside WO-197. This order edits `scripts/lib/vertical-transport.mjs`,
`packages/skeleton/src/source-change-host.ts`, `packages/skeleton/src/dotln.ts`,
their tests and the skeleton README; WO-197 edits three gate test files
and the library files their slow cases name, none of these. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-112",
    "relation": "hard",
    "reason": "the vertical's episodes, integrity checks and recovery probe this order repairs against"
  },
  {
    "workOrderId": "WO-123",
    "relation": "hard",
    "reason": "the composition whose recovery path is repaired"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-112/decisions.md` D060,
D065 and D066 (each holds the repair rule); `docs/final-reviews/WO-112/FINAL-001.md`
§Findings (F1, F2 and the reproduction table);
`docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs` (the three
cases); `packages/skeleton/src/source-change-host.ts` (`recoverTermination`
lines 509 to 521; the `SourceChangeProcessStarted` record at line 733; the
dispatch `try` at 789 to 818); `packages/skeleton/src/vertical-host.ts`
lines 202 to 216; `packages/skeleton/src/vertical.ts` lines 855 to 865;
`packages/skeleton/src/worker-transport.ts` line 1342 and lines 115 to
130 (the detached spawn in its own process group);
`scripts/lib/vertical-transport.mjs` and `scripts/lib/vertical-primitives.mjs`
lines 220 and 319 (the wrapper); 07-execution-guide.md §Discipline (host
resources: process groups and the bounded wrapper); the
[planning document](../planning/machinery-reset-2026-10-07.md) §8.

**Objective:** After the host dies or is interrupted while a writer runs,
the next `dotln vertical` run recovers the writer's outcome the way the
direct transport already does, no writer outlives the host, and a host
refusal after a result carries its own reason.

**Observed gap (dated 2026-10-07, `main` at `bd437eb2`):**

- `verticalTransport` returns its dispatch before it launches the inner
  one and exposes no `processGroup`; `SourceChangeHost` records
  `SourceChangeProcessStarted` right after `dispatch()` with
  `processGroup: null` (line 733). `recoverTermination` requires the group
  (509 to 521), so after a crash the next invocation throws
  "source-change recovery lacks worker termination evidence",
  `VerticalHost` records the step refused (202 to 216) and the fold seals
  the terminal `refused` (855 to 865). The probe reproduces it:
  `crash-vertical` recorded group `none`, recovery throws; `crash-direct`
  recorded group `75082`, recovery `observed`; `revoke-vertical` throws
  "source-change worker has not terminated" and records neither
  `SourceChangeProcessStopped` nor `WorkerInterrupted`.
- `dotln vertical` installs no interrupt handler (`dotln.ts` 85 to 108),
  while every native writer runs detached in its own process group
  (`worker-transport.ts` 1342, 115 to 130), so SIGINT, SIGTERM or SIGHUP
  stops only the host and the writer keeps editing; a rerun while that
  writer lives throws `prior worker group is still present`
  (`source-change-host.ts` 522) and the issue is sealed `refused`.
- A plain error from `tree.effect()`, the one-commit host-message check,
  `observe()` or the receipt save, all inside the dispatch `try` since
  WO-112 (789 to 818), is recorded as `WorkerInterrupted` with reason
  `transport-failed`.

**Design (scope discipline):**

- The wrapper exposes the inner dispatch's `processGroup` as soon as the
  inner launch returns it, and the host records `SourceChangeProcessStarted`
  when that group is known (or records `processGroup: null` only when the
  transport is one that has none, naming the transport kind), so recovery
  through the vertical and through the direct transport read the same
  record.
- The interrupt handler forwards the signal to every live writer group the
  run started, waits a bounded time for exit, records `WorkerInterrupted`
  with the signal, and exits non-zero; a rerun then recovers through the
  recorded termination instead of sealing `refused`.
- The post-result admission's errors are typed: a refusal after a result
  records `SourceChangeRefused` (or the existing typed refusal the host
  already emits for the same condition before a result) with the check
  that refused, never `transport-failed`.
- **Declined alternatives, recorded:** retrying a sealed `refused` run by
  clearing state by hand (the operator's burden D065 names); making the
  vertical recover without a group by timing (unsound, D065's rejected
  option); folding D061 (unbounded judgment retries) in here (a separate
  behavior with its own fixture; reopen when WO-118's run pays a repeated
  identical judgment).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. Baseline first: `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`
   at the base; record its table in `docs/evidence/WO-199/baseline.json`
   (`crash-vertical` throws, `crash-direct` observed, `revoke-vertical`
   throws). Check: the three outcomes match FINAL-001's table.
2. `scripts/lib/vertical-transport.mjs`: make the wrapper's dispatch carry
   `processGroup` from the inner dispatch (read how `verticalTransport`
   wraps `liveTransport` at `vertical-primitives.mjs` 220 and 319 and
   where the inner dispatch resolves); where the wrapper must return before
   the inner launch, return an object whose `processGroup` resolves when the
   launch does, and make the host await it before recording. Check: step 5.
3. `packages/skeleton/src/source-change-host.ts`: record
   `SourceChangeProcessStarted` with the resolved group (line 733); in
   `settle()`, drop the single `alive()` check that fires on the wrapper's
   early rejection, so an authority interruption records
   `SourceChangeProcessStopped` and `WorkerInterrupted` as it does for the
   direct transport. Keep `recoverTermination` requiring a group.
4. `packages/skeleton/src/dotln.ts` (the `vertical` branch, 85 to 108): on
   SIGINT, SIGTERM and SIGHUP, forward the signal to each live writer group
   the host recorded (the host exposes them), wait up to 10 s, record
   `WorkerInterrupted` with the signal through the host, and exit 130, 143
   or 129. Check: step 5's interrupt case.
5. `scripts/test-vertical.mjs` (the `vertical` row) and
   `packages/skeleton/test/source-change-integrity.test.ts`: port the
   probe's three cases as regressions (`crash-vertical` now recovers
   `observed` with a recorded group; `crash-direct` unchanged;
   `revoke-vertical` records the stop and the interruption); add an
   interrupt case that starts a vertical with a stub writer that sleeps,
   sends SIGINT to the host, asserts the writer group is gone within 10 s,
   `WorkerInterrupted` is recorded with `SIGINT`, and a rerun resumes
   instead of sealing `refused`. Check: `npm test -- --only vertical` and
   `node --test packages/skeleton/dist/test/source-change-integrity.test.js`
   after `npm run build`.
6. `packages/skeleton/src/source-change-host.ts` lines 789 to 818: wrap the
   post-result admission so a refusal from `tree.effect()`, the one-commit
   check, `observe()` or the receipt save records the typed refusal naming
   the check; add one case to the integrity test asserting the reason.
7. Write-backs: `packages/skeleton/README.md` (the paragraph that describes
   `dotln vertical`'s recovery and interrupt behavior, in place; find it
   with `grep -n "vertical" packages/skeleton/README.md`);
   `docs/evidence/WO-199/decisions.md` (D060, D065 and D066 dispositions
   with the before and after probe tables); `npm run meta`;
   `npm run plan -- followups --sync` and dispose FUP-627ec3088bb86e62 and
   FUP-5f8a48126bb022be onto this order's decisions.
8. Re-mints and the live episode, after the last judged-source edit:
   `npm run build`; `npm run evidence:feedback -- --write --edition WO-199 --revision 001`;
   the live feedback self-host as `scripts/feedback-evidence.mjs` usage
   prints (`--record-selfhost <store>`), on the pinned transport;
   `node scripts/authority-evidence.mjs --write`,
   `node scripts/artifact-identity-evidence.mjs --write`,
   `node scripts/verification-evidence.mjs --write`; check each with
   `--check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-199/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the three repairs with their regressions, the baseline
and after probe tables, the re-mints and the live episode, the write-backs.

**Acceptance criteria (all required)**

1. The recovery probe, run at this order's identity, records a process
   group for `crash-vertical` and recovers `observed`, as `crash-direct`
   does; `revoke-vertical` records `SourceChangeProcessStopped` and
   `WorkerInterrupted`; the three cases are regressions in the suites
   named in step 5.
2. SIGINT, SIGTERM and SIGHUP to a running `dotln vertical` stop every
   writer group it started within 10 s, record `WorkerInterrupted` with the
   signal, and exit non-zero; the next run of the same issue resumes from
   the recorded termination and is not sealed `refused`.
3. A host refusal after a writer's result records a typed refusal naming
   the check, never `WorkerInterrupted transport-failed`.
4. The live feedback episode ran after the last judged-source edit and
   its edition checks current; the other editions are re-minted and
   check current.
5. The write-backs land in place; FUP-627ec3088bb86e62 and
   FUP-5f8a48126bb022be are disposed onto this order's decisions;
   `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the baseline and after probe tables; the suite
transcripts; the feedback edition's check; `npm run test:docs`;
`npm test -- --review` before `implementation-ready` and again at final
review. The live row: the feedback self-host episode.

**Write-back duty:** as listed in step 7.

**Known issues and carry-ins:**

- FUP-627ec3088bb86e62 (D065) and FUP-5f8a48126bb022be (D060) are
  allocated here; D066 is criterion 3; D061 (unbounded identical judgment
  retries) stays boarded, reopen as the Design says.
- Receipt known issue (2026-10-07 pass): the interrupt handler's 10 s
  wait is a choice, not a measurement; reopen when a writer needs longer
  to exit cleanly and the handler kills it mid-commit.

**Non-goals:** D061; any change to the vertical's judgment episodes,
intake or triage; the resident's scheduling; WO-118's run.

**Operator-review assumptions**

1. The probe in `docs/evidence/WO-112/` is the agreed reproduction; a
   repair that passes it and the regressions closes the three defects.
