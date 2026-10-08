## Release overview

This release makes three of the slowest machinery test suites cheaper to run, and it keeps every assertion they made. The suites had grown well past their thirty-day medians. They now spend less time rebuilding the same fixtures and starting the same processes. Each repaired case also checks its own duration, so the next growth fails at the case that grew. The visible changes:
- In a fresh review gate the publication suite fell from 357.1 s to 129.8 s, the integration suite from 301.5 s to 181.0 s and the harness suite from 392.9 s to 289.5 s. These figures compare WO-196's last fresh review gate with this order's.
- The compiler's FNV-1a64 hash now uses exact 32-bit word arithmetic instead of BigInt. It returns the same value for every input, and in the executor's measurement it ran about four times faster. Generated hooks that validate their pinned runtime run it in every process, where it had taken 18 to 20 ms.
- `docs/evidence/WO-197/vertical-timing.md` names the vertical suite's three slowest cases and what each waits on. None of them waits on a timer.

The release is for operators and agents who run DotLn's test gates in a DotLn repository.

## Read before upgrading

- **Duration bounds can fail a suite.** 42 repaired cases now assert that they finish within twice their measured duration: 27 in `scripts/test-target-publish.mjs`, 10 in `scripts/test-worktree-integration.mjs` and 5 in `scripts/test-harness.mjs`. A case that slows past its bound fails with a message that names it and its measured duration, even when its functional assertions pass. In the order's own fresh review gate the slowest bounded cases used at most about 0.54 of their bounds. In the publication and integration files, a module-level check fails the file if a bound names no declared case, for example after a test is renamed.
- **Two criteria are waived, not met.** The order asked for each of the three suites to run at or below its thirty-day median plus one quarter. In the fresh review gate the publication suite took 129.847 s against a 22.254 s ceiling, and the integration suite took 181.029 s against 156.976 s; alone it took 134.598 s. The harness suite met its 326.779 s ceiling. The order also asked for the case behind each suite's first growth, but no retained gate row before 2026-10-05 records per-case timing. The operator waived both criteria. Planning holds the baseline re-measure.
- **Generated hooks pin a new runtime snapshot.** The compiler moved to 0.25.5, so the generated hooks and the harness manifest now point at a new `.runtime/harness/` snapshot and embed the new FNV source. The hash scheme, its output and every recorded identity are unchanged.
- **Component versions.** Application v0.69.1 is a patch release over v0.69.0. The compiler moves 0.25.4 → 0.25.5, and the console and skeleton pin it exactly. The skeleton stays at 0.55.0, the harness host at 0.35.0 and the kernel at 0.6.0. No dependency is added.

## Substantive changes

**FNV-1a64 arithmetic.** `fnv1a64` in `packages/compiler/src/normalize.ts` keeps the 64-bit state as two 32-bit words. The FNV prime is 256 · 2^32 + 435, so each byte's step needs two small products and one carry, and every intermediate stays below 2^42, where `Number` arithmetic is exact. The function stays self-contained, because generated recovery hooks embed its source. A new compiler test compares it with a BigInt reference over every UTF-16 code unit, lone surrogates, long inputs and 1,000 seeded random strings. Independent checks during verification found no mismatch over 116,788 inputs and three published test vectors.

**Publication suite.** Cases that share a fixture configuration restore one authentic, completed source-change episode instead of rebuilding it. Each restore checks a digest of every file, link and mode, and callbacks from an earlier case refuse to act on the restored fixture. Review cases replay the GitHub GraphQL traffic in process through the same handler the executable replay uses. Two cases keep the real process boundary: the pinned-body publication and the accepted-thread recovery. Cases that only test review guards start from an observed pull request in a real event store. If such a case reaches a repair, a push or a thread disposition, it fails. The verification-matrix case stops the demo once the opening event is durable instead of running the whole demo.

**Integration suite.** Ten continuation cases clone a small seed repository instead of the whole project history. They run stub generators that assert their exact arguments and the order of the generation stages on every pass. Release metering and the work-order index stay real, because those cases inject real filesystem failures into them. Two comprehensive cases still run every real generator.

**Harness suite.** The live-gate refusal matrices evaluate each request through the pinned runtime's real `runHarnessHook` entry point, in process. For every hook, at least one refused and one admitted request still run through the generated process. In two of the matrices those results must also equal the in-process results. Process ownership, loading, chunked input and hang detection keep their own generated-process cases.

## Progressive polish

The order keeps its measurement record in `docs/evidence/WO-197/`: every gate row for the three suites since 2026-09-07, three cold runs of each repaired case, CPU profiles and the vertical timing record. Its decisions also record the alternatives tried and declined, among them a compile-cache preload, a shallower clone and batched Git reads. The authority, artifact-identity and verification evidence editions are re-minted for the compiler change, and the feedback edition is carried. The console's self-hosted fixture follows them, and the harness bundle is regenerated.

## Evidence and compatibility

Application `v0.69.1` is a patch release over `v0.69.0`, built from WO-197 on `main` at `fdb205c1`. The compiler moves 0.25.4 → 0.25.5. The kernel, beacons, browser-evidence, skeleton and harness host versions are unchanged. No dependency is added.

The verification sequence:
- [VER-001](../../verifications/WO-197/VER-001.md) failed criteria 1 and 2 and judged criteria 3 to 6 met.
- The operator waived criteria 1 and 2.
- [VER-002](../../verifications/WO-197/VER-002.md) passed, with both criteria recorded as unmet and waived.
- [FINAL-001](FINAL-001.md) passed and found nothing further.

The executor's fresh `npm test -- --review` at the reviewed code identity passed 35 suites, with 85 fresh tasks, in 1,477.586 s. The final review's review gate at the same identity reused those tasks, ran `format` fresh and passed 35 of 35 in 7.41 s. `npm run test:docs` passes 29 of 29.

Known limitations:
- The publication suite still takes more than seven times its old median in the gate, and the integration suite exceeds its ceiling in the gate. Both are waived, not met.
- The cause of each suite's first growth is unknown, because no retained gate row before 2026-10-05 records per-case timing.
- Each before and after figure is one sample, taken at a recorded host load. They are not a controlled estimate.
- The `worktree` gate task, which this order did not touch, runs about 2.6 times its thirty-day median. It already did in WO-196's gates. Planning holds that condition.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-197/decisions.md), the [handoff](../../evidence/WO-197/handoff.md) and the [vertical timing record](../../evidence/WO-197/vertical-timing.md).
