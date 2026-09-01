## What this merges

WO-101, the `v0.2.0` internal tooling/evidence-only rung: the kernel's
headline determinism claim turned from example-based tests into an exhaustive
regression floor, entirely under `corpus/` — no kernel, package, script, or
product-doc change.

- **Program lane:** the complete bounded enumeration — all 7,784 Program ASTs
  up to 4 nodes over the six implemented constructors, evaluated in 5
  execution contexts (38,920 inputs) — pinning repeat-call determinism on
  both `stepProgram` and `decideProgram`, purity under poisoned
  `Date.now`/`Math.random`, input immutability, and continuation round-trips
  at every input and residual. Complete Invoke (168 + 1 no-event) and Await
  (672 + 4) matching truth tables whose expectations are derived in the test
  from the dimension tuples, not copied from kernel output, with
  Cartesian-completeness asserted by set equality. Twelve Sequence
  normalization laws. Guard driven by a frozen, versioned predicate registry
  committed in the manifest. The five deferred kinds (`Choose, All, Race,
  Repeat, Compensate`) pinned to their exact deferral error in one clearly
  marked file for cheap later retirement.
- **Hash-identity lane:** 2,054 stableHash + 2,048 commandId golden vectors
  (Unicode scalar boundaries, all six surrogate shapes, combining forms,
  multibyte text, all C0 controls plus DEL, embedded colons, empty and very
  long ids, numeric-string edges), each verified against an independent
  in-harness no-BigInt FNV-1a-64 pair-arithmetic reimplementation anchored on
  RFC 9923 §8.3 published values. NFC-vs-NFD inputs pinned as hashing
  differently so byte-honest behavior cannot be "fixed" silently. The shipped
  `ep:`/`ws:` namespace-tag incident re-derived as 256 permanent regression
  pairs (preimages identical except the tag), plus 128 empty-episodeId
  fallback pairs.
- **Reproducibility:** seeded deterministic generators with `--write` and
  `--check`; `--check` proves byte-identical regeneration of every fixture
  and the manifest from the recorded seed. `corpus/manifests/WO-101.json`
  pins bounds, alphabets, the predicate registry, per-kind and per-cell
  counts, fixture hashes, committed budgets, base commit, and toolchain.
- **Evidence chain untouched:** zero new dependencies, root `test` script
  unchanged — the sweep stays outside the declared release-evidence chain
  until deliberately promoted. `corpus/manifests/findings-WO-101.md` records
  no kernel/spec divergence.

## Evidence

- Exact work-order gate re-established at final review with per-step exit
  codes: both `--check` runs exit 0 with summaries byte-identical to the
  committed run transcript, 22/22 corpus tests, 68/68 root tests.
- Independent re-establishment at review: enumeration combinatorics
  re-derived by recurrence (2/30/462/7290); all 1,662 committed program
  vectors replayed through a review-written evaluator with zero mismatches;
  every ID row recomputed by reviewer-written third FNV-1a-64
  implementations; RFC anchors checked against the live RFC text; truth-table
  cell math recomputed from the fixture rows.

## Verification trail

- `docs/verifications/WO-101/VER-001.md` — pass; all five acceptance
  criteria, no findings.
- `docs/final-reviews/WO-101/FINAL-001.md` — pass; no corrections applied;
  both VER-001 subject digests re-derived bitwise at review; seven note-grade
  observations carried.

## Known open items

- `docs/product/03-architecture.md` §Corpus policy needs a later authorized
  documentation pass to absorb the generated-corpus layout (recorded in
  `corpus/README.md` and the manifest).
- `v0.2.0` is strictly below the published `v0.2.1` tag: after this merges,
  the separately authorized `resume: release close` records the honest
  no-release result — no tag is created or pushed.
- Note-grade observations are enumerated in FINAL-001 and carried, not
  restated here — the largest are the single-seed generators, the vacuous
  depth bound, the fixture-expectation tautology boundary, and the
  implementer-attribution gap.
