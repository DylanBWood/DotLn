## Release overview

A repair can no longer be verified on a test that never failed. Before this release, no episode ran on the base, so a fix whose named test passed on the candidate was accepted without evidence that the test had failed before the change. Now a `baseline` episode runs the story's named tests on the sealed base snapshot before any implementation and records the host's results as `BaselineWitnessed`. A defect story whose named test does not fail on the base stops with a typed `BaselineNotReproduced` before the change. When the candidate is verified later, a criterion whose named test did not fail on the base cannot pass. This release is for the delivery composition (WO-123), which will sequence the episode, and for operators who read verification matrices.

## Read before upgrading

- **No migration.** `verification-v1` and result version 1 are unchanged. The baseline context is optional: a stream opened without it keeps its capsule bytes, episode names and result shape, and historical streams replay as before. The compiler's claim types are unchanged.
- **macOS only for a real reproduction.** Named tests run in a fresh `sandbox-exec` copy of the snapshot. On other platforms, test execution is unavailable, so a defect story records `not-reproduced` with that limitation. That is honest, but it is not a reproduction.
- **The caller declares the story's class.** WO-061's StoryContract has not landed, so the caller passes `new` or `defect`. A defect story passed as `new` records `walked` and continues past the stop; [D013](../../evidence/WO-180/decisions.md#wo-180-d013) routes recording the class source to the composition.
- **No waiver yet.** The episode returns the stop and supplies no waiver. The per-run operator waiver belongs to the composition's receipt ([D013](../../evidence/WO-180/decisions.md#wo-180-d013)).

## Substantive changes

**The baseline episode.** It reuses WO-054's sealed snapshot and the existing `VerificationHost`, under the same confinement and blinding as verification. The driver opens with the base as both baseline and subject and `baselineContext: { kind: "baseline", story }`. The actor gets no tools or writes and returns only an envelope acknowledging that it inspected the base. The host derives the outcome from its own test rows; the actor never supplies rows, an outcome or a verdict.

**Outcomes.** A defect story names each regression by criterion, check, exact command and expected nonzero exit. `reproduced` requires every named test to fail with that exit. A passing, unavailable or differently failing test records `not-reproduced` with what the host observed as the limitation, and `baselineDisposition` returns `BaselineNotReproduced` naming the story. A story classed `new` records `walked` with its existing tests' outcomes and continues; unavailable tests keep their limitation. An actor that asks for human attention holds the stream in `attention` with no witness.

**Baseline rows.** The acceptance matrix exposes the base's host-run rows with `subject: baseline`, `origin: host` and `source: live`. Every row on a snapshot subject is already a host-run live test, so the labels describe what the host ran. Baseline completion leaves the criteria incomplete; it never certifies acceptance.

**The comparison rule.** Candidate verification opens with the original base and `baselineContext: { kind: "comparison", witness }`, and both snapshots must name the same contract and tests. For each named defect test whose base row did not fail as named, the host computes a `baseline-test-did-not-fail` finding. The verifier must return those findings exactly and cannot pass that criterion; a candidate whose tests pass is `unverified`, never a fabricated failure.

**Admission.** A baseline actor result that carries rows, a baseline or an outcome is refused by the closed result shape. So is a verifier result that drops, adds or rewrites a comparison finding, and a repair result that carries baseline rows. A forged or edited `BaselineWitnessed` fails replay, and a story naming a command outside the sealed tests is refused. A cached result recovers without redispatch, and a crash between the accepted result and the witness emits the witness once.

## Progressive polish

Product 03 §VerificationAdapter names the landed episode in place (+106 bytes). Two test fixtures gained missing setup, with production code and assertions unchanged. The evidence-source fixture keeps uncommitted audit source bytes in its own temporary object database before a case mutates them. The integration fixture links Playwright and the `@dotln/browser-evidence` package that v0.59.0 added.

## Evidence and compatibility

Application `v0.60.0` is a minor release over `v0.59.0`, built from WO-180 on `main` at `276db3e1`. `@dotln/skeleton` moves to 0.48.0, and `@dotln/console` stays at 0.4.0 with its exact skeleton pin updated. `@dotln/kernel` 0.6.0, `@dotln/compiler` 0.21.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged. The authority edition is WO-180 revision 002, artifact identity and verification are revision 003, and feedback is revision 003 from one live self-host audit on Codex `gpt-6.1-sol` at `max`. The console's self-host case and the Claude Code harness pins were regenerated.

Live rows on WO-056's synthetic repository, with its planted signed-addition defect committed as the base: [Codex](../../evidence/WO-180/codex-live-004.json) (CLI 0.159.2, `gpt-6.1-sol` at `max`) and [Claude Code](../../evidence/WO-180/claude-live-004.json) (2.1.286, `claude-opus-5-5` at `xhigh`) each record `reproduced`. The signed test fails with exit 1 and the other test passes, and both rows are labelled baseline, host and live. In each, the repaired candidate completes with no comparison finding. The model and effort are launch selections; effective values are unknown. The candidate actor is a process double.

The verification sequence:
- [VER-001](../../verifications/WO-180/VER-001.md) passed. It ran 22 admission probes, re-derived both live receipts and ran a fresh product gate.
- [FINAL-001](FINAL-001.md) passed after staging the new test file and running the product gate at the identity that keys it.

`npm test -- --review` passed at code identity `a78509b50bffcc24eef4d41b09bd98e92ad0410b973db95e46251e3fe4111a6e`: 37 suites, 0 failed, 391.94 s. `npm run test:docs` passes.

Known limitations:
- Reproduction is proven on macOS only.
- The receipts' `profile`, `readMount` and `testCopies` fields describe the fixture's configuration rather than observing it; WO-054's suites carry the confinement proof.
- The comparison witness is trusted from the host-recorded opening, as host-run rows are today.
- The composition is a fixture double of WO-123's sequence.
- Browser witnesses on the base are later work.

Details are in the [evidence README](../../evidence/WO-180/README.md) and the [decisions](../../evidence/WO-180/decisions.md).
