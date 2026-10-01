# WO-103

The authorization guard and the command outbox were tested by hand-written cases, so a precedence or replay regression outside them could pass unnoticed. This pull request lands WO-103, an evidence-only corpus. It replays every one of 2,694,384 declared `authorize()` cells and 509,440 outbox delivery runs through the shipped kernel, and compares each with an independent oracle. All of them agree. Three shipped defects are pinned as numbered findings with reproducing cells, and their repairs go to follow-ups.

- **Authority factorial.** Eleven factors cover effect type, the clock around expiry, revocation types and events, semantic conditions and match position, seven predicate environments, nine allow/deny pattern shapes, four evidence sets and eleven resource cases, including own and inherited `__proto__`, `constructor` and `toString`. Each cell is compared exactly: reason string, full trace, minted `commandId`, decremented `resourceLimits` and every predicate call's inputs. The oracle ranks its own failure flags and computes command IDs with independent 32-bit FNV arithmetic; it calls none of `authorize`, `effectMatches`, `predicate` or `commandId`.
- **Outbox permutations.** Command shapes, keys and malformed payloads cross four alphabets: 4 and 6 events in full, 8 events as 128 seeded orders. Each order runs once and with every event doubled, through both `replayOutbox` overloads, against a whole-log oracle for persist-once, idempotence, result-before-persist and the exact `accepted`, `dedup`, `unknown` and `preceded-persist` traces.
- **Regeneration.** `node corpus/harness/generate-authority-corpus.mjs --seed wo103-seed-20261001 --check` rebuilds the nine golden shards, the manifest, the findings file and the precedence table byte for byte. The shards use the existing `EventEnvelope` v1 framing, so the strict codec validates them unchanged ([D008](../../evidence/WO-103/decisions.md#wo-103-d008)).

**Findings, recorded and not fixed.** In [WO-103-F001 and F002](../../../corpus/manifests/findings-WO-103.md), a `cannot evaluate revocation` refusal caused by a missing `state` or `predicateEnv` emits a partial trace, and the audit projection leaves the denied record unlinked. That is WO-017's carry-in, routed to `FUP-2341c85c58331f3e`. In WO-103-F003, `replayOutbox` admits an incomplete command with a non-empty string ID into `pendingCommands` (960 cells), routed to `FUP-c1d4be019802be0d`.

**What the corpus cannot see.** The final review ran 13 kernel mutations through the sweep. Twelve fail it, among them the expiry boundary, prefix matching, the own-property resource rule, semantic short-circuiting and six of the seven adjacent rank swaps. Swapping `effect denied` and `effect not allowed` passes, because no declared cell fails both rules. [D012](../../evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests) boards a contesting pattern level to the next corpus order (`FUP-d22dc57e754ba35c`).

**Integration and version.** The order was executed on `v0.60.0` and integrated over WO-176's `v0.60.1`, which changed no kernel, audit, corpus or package file. Application `v0.60.2` is a patch. No component, edition or dependency changes, and nothing joins `npm test`.

**Validation.** `npm test -- --review` passed on the integrated tree at code identity `4f5124c9…`: 30 suites, 0 failed, 419.80 s. There the seeded `--check` is byte-identical and `node --test 'corpus/harness/wo103-*.test.mjs'` passes 14 of 14. `npm run test:docs` passes. [VER-001](../../verifications/WO-103/VER-001.md) passed all eight criteria, and [FINAL-001](FINAL-001.md) passed.

**Known limits.** Malformed envelopes outside the declared factors are untested, outbox alphabets above six events are sampled, and ranks 5 and 6 are not contested (D012).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T15:40:17.244Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-174 | 13,456,142 (Δ unavailable) / 5 | 2,384,620 (Δ unavailable) | 4 (Δ unavailable) / 59,879 (Δ unavailable) | 50,171,251 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-175 | 8,027,049 (Δ -5,429,093) / 3 | 3,483,168 (Δ 1,098,548) | 4 (Δ 0) / 61,796 (Δ 1,917) | 52,710,657 (Δ 2,539,406) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-059 | 13,869,681 (Δ 5,842,632) / 8 | 3,716,930 (Δ 233,762) | 3 (Δ -1) / 23,786 (Δ -38,010) | 77,033,040 (Δ 24,322,383) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-180 | 5,518,304 (Δ -8,351,377) / 3 | 1,695,186 (Δ -2,021,744) | 3 (Δ 0) / 18,410 (Δ -5,376) | 48,716,481 (Δ -28,316,559) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-176 | 41,822,452 (Δ 36,304,148) / 6 | 4,013,405 (Δ 2,318,219) | 4 (Δ 1) / 64,961 (Δ 46,551) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 2) | 3 (Δ 3) |
| WO-103 | 3,067,785 (Δ -38,754,667) / 2 | 1,414,182 (Δ -2,599,223) | 6 (Δ 2) / 89,134 (Δ 24,173) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 1 (Δ -2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-103/executor | 2,637,347 (-32,521,841) | unavailable (unavailable) | unavailable (unavailable) | 12,263,302 (unavailable) | 99 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-103/verifier | 430,438 (-2,712,175) | 92,891 (56,852) | 32 (-87) | 4,209,807 (-6,736,559) | 43 (-83) | unavailable (unavailable) / unavailable |
| WO-103/reviewer | 1,275,960 (-2,244,691) | 5,969 (-24,348) | 131 (-49) | 21,783,888 (-400,251) | 159 (-58) | unavailable (unavailable) / unavailable |
| WO-103/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-103/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-103/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
