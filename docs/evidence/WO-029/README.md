# WO-029 implementation evidence

The compiler now returns a separate `ArtifactIdentityV1`, and the skeleton pins
it at v2 equip. Every compiled consumer compares against that pin before it can
originate a schedule, command, authority decision, or verification request.
Compilation failures and identity drift produce durable, inert refusals. A
logged enforcement boundary preserves historical replay while requiring an
explicit v2 re-equip before a legacy runtime can consume new input.

This is executor evidence for independent verification, dated 2026-09-05.
The implementation target is application `v0.9.0`, compiler `0.3.0`, skeleton
`0.8.0`, and unchanged kernel `0.2.1`. Activation omitted its release target;
the work-order header records its completion under the standing release
default. The read-only [release preflight](release-surfaces.txt) confirmed the
target against published `v0.8.0` and checked all component versions.

## Acceptance evidence

| Criteria                                                                              | Executable evidence and recorded artifacts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2: exact identities, definition membership, stable preimages and independent oracle | [Compiler tests](../../../packages/compiler/test/artifact-identity.test.ts), [exact identities](../../../packages/compiler/fixtures/wo029-identities.json), and [semantic-hash inventory](semantic-hash-inventory.json). Both Seiri and Entropy Reducer cover repeated compilation, reordered source, meaningful edits under the same id/version, non-emitted name edits, and repository relocation. The fixed Unicode definition vector and all fixture hashes are cross-checked with WO-101's independent implementation using 32-bit pairs rather than BigInt.    |
| 3–4: v2 equip, centralized comparison and durable refusals                            | [Runtime tests](../../../packages/skeleton/test/artifact-identity.test.ts) and [synthetic negative transcripts](negative-transcripts.json). Tests exercise each drift axis through every compiled consumer, diagnostics, malformed and future identity shapes, duplicate component tuples, missing equip references, and pre-equip use. The new scenario has 28 events and 11 persisted comparison receipts.                                                                                                                                                         |
| 5: forward-only enforcement and frozen history                                        | The [preserved legacy log](../../../packages/skeleton/fixtures/wo029-legacy-scenario.jsonl) replays with unavailable identity and the unchanged [WO-003 oracle](../../../packages/skeleton/fixtures/wo003-decision-traces.json). Tests cover one canonical host boundary, duplicate-boundary idempotence, refusal of forward legacy consumption, explicit re-equip, and rejection of legacy host payloads. [Scenario tests](../../../packages/skeleton/test/scenario.test.ts) explain the new boundary, receipt, and trace-input delta without rewriting the oracle. |
| 6: unknown schedules                                                                  | Runtime tests and the negative transcripts show an explicit `UnknownScheduleRefused` event, no intent or schedule, and retained valid authority. The reused-schedule-id test records the deferred pulse-stamping limitation.                                                                                                                                                                                                                                                                                                                                         |
| 7: audit receipt                                                                      | [Canonical log](scenario.jsonl), [audit projection](audit.json), and runtime audit tests link comparison and refusal data to canonical events at L0 and governed raw. A supplied equip claim alone remains unverified; historical identity remains unavailable. Cryptographic integrity, authenticity, and outer-confinement evidence remain unavailable.                                                                                                                                                                                                            |
| 8: repository gate and release surfaces                                               | [Full `npm test` output](test.log): all repository helper checks, 221 package tests, 8 independent corpus tests, and the artifact evidence check. `git diff --check` and the release preflight also pass. No dependency was added; compiler and kernel retain pure compilation/evaluation and no runtime dependency or I/O.                                                                                                                                                                                                                                          |

Recovery is part of the same gate. A restored outbox records and checks
`CommandRedispatchRequested` before invoking an adapter. Tests show zero adapter
effects for legacy or drifted recovery, no redispatch from an already completed
outbox, and the existing one-effect idempotency behavior for a valid crash
recovery.

## Reproduction and provenance

Run from the repository root:

```sh
npm ci
npm run build
npm run evidence:artifact -- --check
npm test
git diff --check
npm run release -- check-surfaces
```

The release preflight reads remote tag advertisements. The rest of the evidence
gate uses local sources and fixtures after dependency installation.
`evidence:artifact -- --check` compares all four generated evidence files
without writing. `--write` intentionally regenerates those files after a
reviewed source change. An invalid mode was checked to exit 2 without changing
evidence. A planted stale inventory was checked to exit 1 without repairing it;
the original bytes were then restored exactly.

[baseline.json](baseline.json) was captured before the compiler change from the
local published `v0.8.0` source at
`961601a17174c14ac69afa24dbd62ca5432ad7e7`. Seiri remains
`fnv1a64:9ca8d0229c6bd8db`; Entropy Reducer remains
`fnv1a64:c5ddbca75f1c4cee` for the exact recorded environment and episode end.
The frozen WO-003 trace oracle retains SHA-256
`ec53d1c841de5486cf656694228c83f67e8549993d0ac63c187d10728707a173`.
SHA-256 here is an evidence-file comparison, not a new runtime trust claim.

The generated transcripts use original public fixtures and synthetic changes.
No intake content was incorporated. The four generated files were byte-checked
by the evidence helper at this edition and are excluded individually from
Prettier; the test log retains timing-dependent full gate output.

Migration note (2026-09-06, WO-022): since compiler `0.4.0` the evidence helper
writes and checks the current edition under
[`docs/evidence/WO-022/artifact-identity/`](../WO-022/artifact-identity/audit.json)
instead of this directory. These four files are retained historical bytes that
the helper no longer regenerates or byte-checks; `baseline.json` remains the
pinned source of the frozen oracle and every semantic hash.

## Scope and handoff

The receipt establishes deterministic content agreement. It does not
authenticate a writer who replaces both graph and pin, exclude hidden adapter
effects, or identify an old pulse whose schedule id is reused. These limits are
tested or recorded in the audit projection. Beacon v1's existing authority
denial counter does not acquire a new artifact-refusal code; artifact identity
has its own audit datum.

Product docs 02, 03, 04, 06, 09, and 10, both affected package READMEs, the
planning map, publication projections, and the lineage ledger have been
updated. The ledger extends the two existing adopted decisions without
rewriting them. WO-009 receives the receipt as an available future input;
worker transport and verifier-artifact pinning remain later work.
