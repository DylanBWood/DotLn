DotLn v0.69.2

## Release overview

### WO-199

**The vertical survives an interrupt and a host crash: a writer launched through the vertical records its process group, an interrupted `dotln vertical` stops its writer and resumes on rerun, and a host refusal after a writer's result records its own reason (v0.69.2)**

This release makes `dotln vertical` safe to stop. An operator's Ctrl-C, a supervisor's SIGTERM or a closed terminal now stops the model writer the run started. The run records the stop and exits non-zero, and the next run of the same issue resumes where it stopped. A host that crashes while its writer runs no longer seals the issue `refused`: the next run stops any writer still alive, after proving that the run owns it, and reads the writer's outcome. The visible changes:
- A writer launched through the vertical records its process group and, for native writers, the group leader's birth identity, so recovery after a crash works through the vertical as it already did through the direct transport.
- SIGINT, SIGTERM and SIGHUP stop the writer group within 10 s, record `WorkerInterrupted` with the signal and exit 130, 143 or 129. Every other episode or wait in flight ends at once.
- A focused test, Git read or snapshot witness killed by the operator's signal is never recorded as a result. The step stays pending, and the rerun re-tests the writer's commit without launching another writer.
- In the run that receives a writer's result, a host check that refuses it records a typed refusal naming the check, not a transport failure.

The release is for operators who run the vertical by hand or under a supervisor, and for the resident restart work that depends on this recovery (WO-118).

## Read before upgrading

### WO-199

- **A C compiler is now a runtime prerequisite for native writers.** Codex and Claude CLI writers launch through small C helpers: an exec gate that also supervises the writer group, and on macOS a process identity reader. The host compiles each helper on its first use of a helper version: `clang` with `xcrun` (Command Line Tools or Xcode) on macOS, `cc` elsewhere. Without one, a native writer cannot launch. The skeleton README names the prerequisite beside `DOTLN_LIVE_WORKERS=1`.
- **Signals are handled, not fatal.** `dotln vertical` now keeps listeners for SIGINT, SIGTERM and SIGHUP for the whole run. A synchronous child already in flight returns before the signal takes effect: a Git command within 15 s, a focused test within 180 s, a snapshot witness test within 30 s per test, and a forge read or push without a timeout. A repeated signal does not extend the wait. The command exits regardless 15 s after it handles the first signal.
- **Recovery signals only a proven group.** After a crash, recovery stops a surviving writer group only when the recorded birth identity proves ownership of every member. A group recorded before this release has no identity, so recovery refuses to signal it, as it refused before.
- **Two interrupted writer dispatches exhaust the step.** The source-change step's existing two-dispatch budget still counts interrupted writer launches, so the run after a second interrupted writer refuses `recovery-dispatch-exhausted`. Re-observing a committed result spends no dispatch.
- **New record fields.** `SourceChangeProcessStarted` may carry `transport` and `processIdentity`. `WorkerAttemptStarted` may carry `launchGated`. `WorkerInterrupted` may carry `signal`, with reason `interrupted`. Readers of earlier stores accept records without these fields.
- **Component versions.** Application v0.69.2 is a patch release over v0.69.1. The skeleton moves 0.55.0 → 0.55.1, and the console pins it exactly. No dependency is added.

### Derived from the diff

These notices are machine-classified from the release diff and follow the reviewer-authored items above.

- Source-only release: no package, binary, container, or hosted artifact is published.
- Component version metadata changed; inspect the manifest's separate version axes.
- The locked dependency graph changed; the release manifest records the reviewer’s npm test evidence for this code identity.

## Substantive changes

### WO-199

**Writer launch and recovery.** The vertical's transport wrapper resolves the inner launch's process group before the source host records `SourceChangeProcessStarted`. Native writers start as `host-lock --supervise`, which ignores terminal signals, waits for a release byte on a private pipe, then forks and execs the writer. The host releases it only after the start record, with the group and birth identity, is durable. A host that dies before the release closes the pipe, and no writer runs. The supervisor reports the writer's exit status or signal on that pipe, then kills any members left in its group, so no member of the writer's group outlives it. Recovery reads the recorded group. A group that is gone is recorded stopped. A surviving group is stopped only when the host snapshot proves every member belongs to the recorded leader or its descendants, and never when the group would include the host. A settlement bound of 10 s replaces the earlier 1 s group check.

**Interrupt handling.** The CLI passes an abort signal through the runtime, the step loop, the primitives, the transport wrapper, the source host and the repair host. The writer step forwards the operator's signal to the writer group and settles it. Judgment, triage, repair-verifier and intake episodes are stopped, and their stores record `WorkerInterrupted` where they have one. The observation step's check poll and the lease wait end. Each synchronous host call in the source host, the repair host and snapshot preparation lets a pending signal be delivered before its result or error is admitted. The step loop and the CLI also deliver a pending signal before they record a returned step or remove their listeners. A rerun after an interrupted judgment or repair verifier waits out the stopped episode's lease, at most 5 s, before its one fresh attempt.

**Typed post-result refusals.** In the run that receives a writer's result, the source store records `SourceChangeRefused` with a `host-admission-*` reason when one of these checks fails: the integrity check, worktree verification, effect read, result-commit match, focused-test observation, authority check or receipt save. An integrity finding keeps its own refusal reason. A run interruption takes precedence and records the signal instead. The vertical's step receipt still reports a thrown host failure as `source-change host failed or was unavailable`, as before.

## Progressive polish

### WO-199

The vertical test row now runs a dedicated recovery file, `scripts/test-vertical.recovery.mjs`, beside the judgment file. New fixtures drive the real CLI with explicit actor doubles, real synchronous children and disposable writers, so the regressions signal the whole foreground group as a terminal does. The feedback verifier and the evidence registries now judge `host-interruption.ts` and the native helpers that the source host loads. The feedback edition is re-minted from a new live episode, and the authority, artifact-identity and verification editions are re-minted deterministically.

## Evidence and compatibility

### WO-199

Application `v0.69.2` is a patch release over `v0.69.1`, built from WO-199 on `main` at `0eb0afa2`. The skeleton moves 0.55.0 → 0.55.1, and the console pins it. Kernel, compiler, beacons, browser-evidence and harness host versions are unchanged. No dependency is added.

The verification sequence:
- [VER-001](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/verifications/WO-199/VER-001.md) failed. A signal outside the writer step left the host running until that step ended.
- [VER-002](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/verifications/WO-199/VER-002.md) passed the repair.
- [FINAL-001](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/final-reviews/WO-199/FINAL-001.md) failed. A terminal Ctrl-C during the post-result focused test was recorded as the writer's test result, and the command exited 0.
- [VER-003](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/verifications/WO-199/VER-003.md) passed that repair and boarded one follow-up.
- [FINAL-002](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/final-reviews/WO-199/FINAL-002.md) passed and corrected one README sentence.

The executor's fresh `npm test -- --review` at the reviewed code identity passed 38 suite groups, with 88 fresh tasks, in 1,307.615 s. The final review's gate at the same identity reused those tasks, ran `format` fresh and passed 38 of 38 in 5.72 s. `npm run test:docs` passes 29 of 29.

The live feedback episode (feedback 004) ran on `codex-cli-exec`, `gpt-6.1-sol` at `max`, after the last judged-source edit, and checks current.

Known limitations:
- A rerun that re-observes an unreceipted committed result records no `SourceChangeRefused` when a host check refuses it ([D015](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/evidence/WO-199/decisions.md#wo-199-d015--verification-pass-ver-003-board-the-recovery-paths-untyped-host-refusal-which-a-refusal-coinciding-with-a-signal-now-reaches), FUP-49c4a5f7176252e7).
- The witnesses step's configured browser scenario does not stop on the signal. The 15 s backstop bounds it ([D011](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/evidence/WO-199/decisions.md#wo-199-d011--board-the-witnesses-steps-browser-scenario-which-the-abort-does-not-reach-and-whose-rerun-refuses-its-own-directory), FUP-88c339c51cfc1933).
- Identical judgment retries remain unbounded (WO-112 D061).
- The 10 s writer settlement bound is a choice, not a measurement.
- The fixtures ran on macOS. Linux and a host without a C compiler were not exercised.

Details are in [FINAL-002](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/final-reviews/WO-199/FINAL-002.md), the [decisions](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/evidence/WO-199/decisions.md) and the [handoff](https://github.com/DylanBWood/DotLn/blob/28d32e26fade7b7d2fe6ed00c43707ad58b87f70/docs/evidence/WO-199/handoff.md).

### Machine-derived release evidence

- Source: `v0.69.2` at `28d32e26fade7b7d2fe6ed00c43707ad58b87f70`
- Previous release: `v0.69.1`
- Application version: `v0.69.2`
- Root workspace version: unversioned
- Component versions:
  - `@dotln/beacons`: `0.1.1`
  - `@dotln/browser-evidence`: `0.1.0`
  - `@dotln/compiler`: `0.25.5`
  - `@dotln/console`: `0.4.0`
  - `@dotln/kernel`: `0.6.0`
  - `@dotln/skeleton`: `0.55.1`
- Schema ranges:
  - `eventEnvelope`: 1
  - `controlLog`: 1
  - `ir`: none
  - `artifactConfiguration`: none
  - `transformationSet`: none
- Cadence kinds:
  - Evaluable: `Once`, `After`, `Every`, `Gate`, `Until`, `Backoff`
  - Deferred: `Burst`, `Calendar`, `Window`, `While`, `Sequence`, `Merge`, `Race`, `Repeat`
- Release evidence:
  - `npm test`: exit 0; output SHA-256 `d31204f88319c51841cef0643c1a684da7f50a50d227f453406f89bc74e17160`; code identity `2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c`; reviewed tree `e441dbb31260fad341c46bcc12d5804a1b37de6b`; merge tree `f28fa9b85e6642439c36e3383bc6755d34083202`
- Review lineage:
  - `docs/verifications/WO-199/VER-001.md`
  - `docs/verifications/WO-199/VER-002.md`
  - `docs/verifications/WO-199/VER-003.md`
  - `docs/final-reviews/WO-199/FINAL-001.md`
  - `docs/final-reviews/WO-199/FINAL-002.md`
  - `docs/final-reviews/WO-199/PR.md`
  - `docs/final-reviews/WO-199/RELEASE-NOTES.md`
- Changed files: 135 (complete list in the canonical manifest embedded in the annotated tag)
- Distribution: source-only
