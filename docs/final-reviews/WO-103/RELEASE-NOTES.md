## Release overview

The authorization guard and the command outbox now have full-factorial, regenerable evidence behind them. A seeded corpus replays every one of 2,694,384 declared `authorize()` cells and 509,440 outbox delivery runs through the shipped kernel, and compares each with an independent oracle. All of them agree. The sweep also pins three shipped defects as numbered findings, each with a reproducing cell, and leaves their repairs to named follow-ups. This release is for the orders that will repair the audit projection and the outbox's command admission, and for anyone changing the guard, who now has a sweep that fails on every probed regression but one.

## Read before upgrading

- **No runtime change.** No package, contract, dependency or edition changes. Every component keeps its version, and nothing joins `npm test`.
- **Three known defects are recorded, not fixed.** A `cannot evaluate revocation` refusal caused by a missing `state` or a missing `predicateEnv` emits a partial trace, and the audit projection leaves the denied record without its trace link (WO-103-F001, WO-103-F002; follow-up `FUP-2341c85c58331f3e`). `replayOutbox` admits a command object with a non-empty string `commandId` but missing fields, and it reaches `pendingCommands` (WO-103-F003; follow-up `FUP-c1d4be019802be0d`). A consumer that reads `pendingCommands` still has to validate each command itself.
- **One precedence pair is not contested by the corpus.** No declared cell has both `effect denied` and `effect not allowed` failing, so swapping those two ranks would pass the sweep. The shipped order is unchanged and documented in product 02. The gap is boarded to a later corpus order ([D012](../../evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests), `FUP-d22dc57e754ba35c`).

## Substantive changes

**Authority factorial.** Eleven factors cover the guard's inputs: effect type, the clock before, at and after expiry, revocation event types and events, semantic conditions, match position, seven predicate environments, nine allow/deny pattern shapes, four evidence sets and eleven resource cases, including own and inherited `__proto__`, `constructor` and `toString`. Their product is 2,694,384 cells. Each cell is compared exactly with the oracle: the reason string, the full refusal or grant trace, the minted `commandId`, the decremented `resourceLimits` and every predicate call's inputs (state, canonical clock, RNG state, params and optional policy). The oracle ranks its own failure flags. It computes command IDs with independent 32-bit FNV arithmetic, and calls none of `authorize`, `effectMatches`, `predicate` or `commandId`. Auxiliary tests cover forged effects (`null`, `true`, `{}`, `[]`, omitted), terminal-star patterns, the three identity modes and envelope threading until each resource limit is spent.

**Outbox permutations.** Eight command shapes, four command keys and five malformed payloads cross four event alphabets. The alphabets of 4 and 6 events are enumerated in full (24 and 720 orders), and the 8-event alphabet uses 128 seeded unique orders. Each order runs once and with every event delivered twice, through both `replayOutbox` overloads, against a whole-log oracle. That proves persist-once, duplicate-delivery idempotence, result-before-persist completion and the exact `accepted`, `dedup`, `unknown` and `preceded-persist` traces.

**Regeneration.** `node corpus/harness/generate-authority-corpus.mjs --seed wo103-seed-20261001 --check` rebuilds every committed shard, the manifest, the findings file and the generated precedence table byte for byte, and refuses any other seed. The committed golden cells use the existing `EventEnvelope` v1 JSONL framing, so the strict historical-stream codec validates them unchanged.

## Progressive polish

The corpus commits 1,152 golden rows in nine shards (2,304,495 bytes, inside the declared 16-file, 2,048-row and 12 MiB budget), plus a manifest, a findings file, a generated precedence table and two run transcripts. The earlier failed transcript is kept beside the passing one.

## Evidence and compatibility

Application `v0.60.2` is a patch release over `v0.60.1`, built from WO-103 on `main` at `2f525014`. `@dotln/kernel` 0.6.0, `@dotln/skeleton` 0.48.0, `@dotln/compiler` 0.21.0, `@dotln/console` 0.4.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged, and the selected evidence editions are still WO-180's. The order was executed on `v0.60.0` and integrated over WO-176's `v0.60.1`, which changed no kernel, audit, corpus or package file.

The verification sequence:
- [VER-001](../../verifications/WO-103/VER-001.md) passed all eight criteria and reproduced the `--check` and the 14 corpus tests.
- [FINAL-001](FINAL-001.md) passed on the integrated tree. It added 13 kernel mutation probes: the sweep detects 12, and the thirteenth is the uncontested precedence pair above.

`npm test -- --review` passed on the integrated tree at code identity `4f5124c90989392afcb162d31af03b889f75f556cc25ea28443e6688bdc88071`: 30 suites, 0 failed, 419.80 s. On the same tree, the seeded `--check` is byte-identical and the 14 corpus tests pass. `npm run test:docs` passes.

Known limitations:
- Malformed envelopes outside the declared factors, such as a `null` envelope, are untested.
- Outbox alphabets above six events are sampled, not enumerated.
- `effect denied` and `effect not allowed` are never contested in one cell (WO-103-D012).
- The corpus runs on its own commands and is not part of `npm test`.

Details are in the [manifest](../../../corpus/manifests/WO-103.json), the [findings](../../../corpus/manifests/findings-WO-103.md) and the [decisions](../../evidence/WO-103/decisions.md).
