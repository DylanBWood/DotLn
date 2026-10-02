# WO-124 — Impact surfaces derivation

Executor: `codex-cli` 0.160.0, `gpt-6.1-sol`, effort `max`; source
`codex-session-readback`. Operator dispatch: `resume: next`.

`deriveSurfaces(contract, profile, snapshotIndex, options?)` now produces an
immutable proposal of actual indexed file paths and complete profile commands.
It reads active requirement statements. Named paths and demonstrated
architecture nouns contribute rule provenance; supplied inference contributes
its statement ID and rationale. The union keeps every distinct origin. The
function neither reads the filesystem nor executes its selected commands.

Confidence is the share of active requirements yielding at least one surface,
with a default threshold of 1. An uncovered requirement yields `NeedsHuman` at
that threshold. A missing path remains a candidate even if another path covers
the same requirement; it never becomes a surface. An unavailable index always
hands off, naming the sealed snapshot's bound: 1–100 regular UTF-8 files of at
most 100,000 bytes each, excluding symlinks, submodules and binary files.
Malformed profiles, indexes and inference entries refuse with a field path,
including absent JavaScript array slots.

`readSnapshotIndex(capsule, snapshotPath)` reads a host-produced WO-054 mount,
checks its seal before and after indexing, compares each file's actual bytes
to the sealed contents, and returns its path, UTF-8 byte length and SHA-256.
The existing verification host source is unchanged.

The API adds the typed repository profile and exports the declared path/noun
rules from the compiler's existing story-contract module. WO-073's Markdown
projection, runtime review-context wiring, the cartographer episode and larger
repositories remain outside this primitive.

Evidence and bounded write-backs:

- [Handoff](handoff.md) judges all six criteria. [Eleven fixture derivations](fixture-derivations.json)
  and the unavailable-index result reproduce with
  `node docs/evidence/WO-124/fixtures.mjs --check` after building. Classification
  and inference choices are supplied fixture doubles; no model episode ran.
- [Compiler transcript](compiler-tests.txt): 143 pass, including five derivation
  tests covering paths/origins, exact commands, determinism, input immutability,
  confidence and malformed fields. [Snapshot transcript](snapshot-index-tests.txt)
  reports all four fixture files, byte sizes, hashes and drift refusal.
- [Document measurements](document-sizes.json): product 03 adds 232 bytes
  (limit 300; 1,581 bytes remain); product 06 adds 56 (limit 150; 70 remain).
  Both existing sentences were amended in place and publication locks refreshed.
- Current authority, artifact identity and verification editions are revision
  002. Feedback revision 002 carries the retained live audit, the generated
  harness snapshot follows the source hashes, and the console is re-pinned.
  Revision 001 remains preserved. The final gates check all selected editions.
- Application `v0.64.0`, compiler `0.24.0` and skeleton `0.50.0` are prepared
  locally; the package comparison adds no dependency.

Required checks passed at code identity
`8d517f6535939d36f5f60a93a2cdf9bfce66143440914f05ad06df25a69e2eb4`:
[npm test -- --review](test-review.txt) passed 35 checks in 446.025 seconds
(80 fresh tasks), and [npm run test:docs](test-docs.txt) passed 24 in 39.619
seconds. Completion checks final report/index bytes with the document gate
inline. [Decisions](decisions.md) retain the encountered corrections, stopped
runs, declined economy experiment and existing planning-register seams.

FUP-2534f4dc631f5ebc, FUP-aa6dbe9c5ad79995, FUP-57ecd19a26362b1c and
FUP-a8ff3066b5663629 retain their existing compile, follows, review-context and
baseline/waiver duties (D011). This evidence does not fulfill them. In particular,
StoryContract revision invalidation IDs may reappear with a changed status or
claim type; consumers must compare the values too. The derivation does not rely
on replacement IDs being fresh.

This is fixture-proven executor evidence awaiting independent verification.
The adjacent queue is empty. Final usage observations stay in ignored receipts
and the response; verification and final review require separate dispatches.
