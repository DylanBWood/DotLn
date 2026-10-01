## Release overview

The event store and crash recovery now have a persistent, regenerable record of what happens when a log is cut short. A seeded corpus cuts seven logs at every byte offset, 72,345 cuts in all. It also drives the shipped crash recovery at every byte of the demo's persisted crash opening, 16,554 runs in all. Every cut either decodes to exactly its surviving prefix or fails loudly. No cut yields a silent third outcome, and the corpus raises no runtime finding. This release is for whoever later swaps the JSONL store or studies crash-after-effect ambiguity: they get a compatibility baseline they can run without this session.

## Read before upgrading

- **No runtime change.** No package, contract, dependency or edition changes. Every component keeps its version, and nothing joins `npm test`.
- **One test registry entry.** With the operator's approval, `packages/kernel/test/fixtures/jsonl-protocols.json` declares `corpus/manifests/WO-105-observations.jsonl` as classified observations rather than an event stream. The document gate's strict event-stream check is otherwise unchanged ([D010](../../evidence/WO-105/decisions.md#wo-105-d010)).
- **The corpus lane runs at its base, `v0.60.2` (`2b1af1ab`), for now.** Its golden demo and manifest pin bytes that carry the `@dotln/compiler` version and the hash of `packages/skeleton/src/reactor.ts`. Both changed upstream: the compiler moved to 0.22.0, and WO-181 changed the reactor. On this release the sweeps still cover every offset with identical classifications, but the golden `--check`, both sweep commands and 3 of the 11 corpus tests exit nonzero on those hashes. Run the lane with the base's package sources until `FUP-d093f77bd927f9dc` settles how it behaves after its base ([D012](../../evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main)).

## Substantive changes

**Store truncation sweep.** Generated LF logs of 0, 1, 8 and 64 events carry escaped newlines, multibyte text, correlation and causation chains and repeated command results. They are swept together with the retained CRLF and 12,000-level nesting anomalies and the canonical demo log. Each cut is compared with a prefix the harness frames and parses itself, never with `decodeLog`'s own view. The 117 line-boundary cuts decode to exactly the true prefix, and the 72,228 mid-line cuts fail loudly. Round-trip and append-numbering laws hold over every fixture and a 512-append chain. CRLF decodes to the same events as LF, the deep payload decodes, and both keep run-twice `replay` and `replayOutbox` determinism.

**Skeleton crash-recovery sweep.** Each offset runs the shipped `runScenario` with `crashAfterPersist` and a `recoveryLogTransform` that cuts the persisted 16,553-byte opening. At the 12 line-boundary cuts, recovery has these properties:
- it recomputes the pending commands from the surviving log, checked against an independent reference;
- it makes at most one effect for the command ID;
- it keeps the surviving prefix;
- it matches its replay trace for trace.

The other 16,542 cuts fail loudly with the decoder's own error and no effect. Complete CRLF and depth-12000 mutations of the opening recover with one effect.

**Golden demo and tree families.** The canonical demo's 28 decision traces, its event log and its glyph scene are committed at base `2b1af1ab`, with the exact regeneration command. Four seeded repo-tree families range from 3 to 12 files. They cover chains, reachable and unreachable cycles, orphans, every classification and 0 to 3 planted candidates. Each carries non-normative structural ground truth and passes its validator, regenerates byte for byte and shows a distinct live signature. None trips an assertion. A planted throwing runner proves that a family which did would be excluded with its reason rather than dropped.

## Progressive polish

The corpus commits seven store fixtures (the CRLF log stored as an escaped JSON string so Git whitespace checks stay on), the golden demo, four tree families with their ground truth, ten harness files, a manifest, 32,485 bytes of compact classified observations inside a 65,536-byte budget, and the run transcript. The transcript also keeps one interrupted attempt from the operator's memory-pressure stop.

## Evidence and compatibility

Application `v0.61.1` is a patch release over `v0.61.0`, built from WO-105 on `main` at `85d13906`. `@dotln/kernel` 0.6.0, `@dotln/skeleton` 0.49.0, `@dotln/compiler` 0.22.0, `@dotln/console` 0.4.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged. The selected evidence editions are still WO-181's revision 002. The order was executed on `v0.60.2` and integrated over WO-102's `v0.60.3` and WO-181's `v0.61.0`. WO-102 had already taken the `v0.60.3` this order prepared.

The verification sequence:
- [VER-001](../../verifications/WO-105/VER-001.md) passed all seven criteria at the base. It reproduced both sweeps, every `--check` and the 11 corpus tests, and ran three independent probes: an every-cut store oracle, a structural recomputation of each tree family and a 412-offset recovery spot check.
- [FINAL-001](FINAL-001.md) passed on the integrated tree. There the store and tree `--check` are byte-identical, and both sweeps keep every count, classification and invariant.

`npm test -- --review` passed on the integrated tree at code identity `a20520b5964bd0e8e0dbfbd9ff23fc5b304017b74ee94dd594e501cfb5900142`: 30 suites, 0 failed, 1,108.32 s. `npm run test:docs` passes.

Known limitations:
- The lane's byte pins are keyed to `2b1af1ab` and fail on later trees whose compiler version or reactor differs (D012).
- Per-command effect attribution is proven only for the declared shapes, which hold at most one command ID.
- Crash shapes outside the declared set are untested.
- The corpus runs on its own commands and is not part of `npm test`.

Details are in the [manifest](../../../corpus/manifests/WO-105.json), the [tree fixture notes](../../../corpus/fixtures/skeleton-trees/README.md) and the [decisions](../../evidence/WO-105/decisions.md).
