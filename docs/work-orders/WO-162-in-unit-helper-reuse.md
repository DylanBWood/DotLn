# WO-162 — Reduce, reuse, recycle inside the scripts unit: seventeen local Git wrappers become calls to the library's `runGit`, the fixture writer and pretty-JSON helpers get one home, the receipt helpers `entropy-review.mjs` cloned from `plan-receipts.mjs` are shared, the named JSON readers use `paths.mjs`, the bare-hex digest gets its own exported name, and the compiler exports the two normalizers `compile.ts` re-declares

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Helper adoption with byte-identical
behavior, digests and fixture outputs; one new small module in
`scripts/lib`; two compiler exports; no contract, schema, gate step or
role-text change. Assigned at activation under the standing opt-out
default.
**Cost:** adds one `scripts/lib` module holding the fixture writer, the
pretty-JSON serializer and the receipt-common helpers (`timestamp`,
`validDigest`, `exact`, `ensureDirectory`, `locked`, parse-with-label);
a bare-hex `sha256Hex` export beside the prefixed `sha256` in
`plan-subject.mjs`; two exports from `packages/compiler/src/normalize.ts`;
a regression that diffs fixture outputs and stored digests before and
after. Removes, measured on 2026-09-25 (planning document §8): seventeen
files that each define a local `git` wrapper while none imports
`scripts/lib/git.mjs` `runGit` (about 286 call sites; seven are the exact
"utf8, trim, throw" shape, the rest express their hookless, identity,
timeout or null-on-failure variants as arguments); twenty files that each
define the same mkdir-then-write fixture helper (about 635 call sites,
fourteen byte-identical); nine identical pretty-JSON definers plus 44
inline sites; six helpers in `entropy-review.mjs` cloned from
`plan-receipts.mjs`; five named JSON readers that duplicate
`paths.mjs`; eight bare-hex digest copies under three names beside an
exported `sha256` that returns a prefixed string (an import hazard);
`compile.ts` lines 38 and 41 re-declaring `compareText` and
`orderedUnique` from a module it already imports. No `scripts/` registered
source changes; `packages/compiler/src/normalize.ts` and `compile.ts` are
registered, so the authority edition re-mints deterministically; neither
is a feedback source, so no live episode. Wall-clock, tokens and context
bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 dispatch ("files
within a lib ... should not each be redefining their own standard pure
functions. reduce reuse recycle. if it makes sense. DRY for the sake of
improving the codebase, not for the sake of DRY"), captured verbatim in
ignored intake (SHA-256 in the ledger section), and the per-unit inventory
in the planning document §8 with its ranked verdicts. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-156 merged (the last change to `plan-subject.mjs` and
`plan-receipts.mjs`; closed, v0.46.2).
**Recommended placement:** paired with WO-163 after WO-070 and WO-115 and
before WO-060 and WO-116. This order edits the adopters it lists and the
helper homes; WO-163 moves three other files and edits their importers.
Disjoint files; neither depends on the other. Because WO-160 also edits
`plan-receipts.mjs`, `entropy-review.mjs` and `release.mjs`, this order
runs after WO-160 closes. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-156",
    "relation": "satisfied-by-close",
    "reason": "the last change to the plan subject and receipt helpers this order shares"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/planning/off-ramps-5s-entropy-2026-09-25.md` §8 (the per-unit
tables: definers with `path:line`, call counts, identity, divergences,
existing homes, ranked verdicts); `scripts/lib/git.mjs` line 11
(`runGit`); `scripts/lib/paths.mjs` (`parseJson`, `readJsonFile`);
`scripts/lib/plan-subject.mjs` line 27 (the prefixed `sha256`);
`scripts/lib/plan-receipts.mjs` lines 46–80 and 752–764;
`scripts/lib/entropy-review.mjs` lines 67–104; `packages/compiler/src/normalize.ts`
and `compile.ts` lines 38 and 41; product 07 §Discipline (bounded boy-scout
cleanup) and the operator's DRY direction as captured.

**Objective:** inside the scripts unit and the compiler, a standard pure
helper is defined once and imported, with every fixture output, stored
digest and error message byte-identical to today's; the divergences the
inventory found are decided, not merged.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):** the Cost
line's counts, each with its file list in the planning document §8. The
inventory also found divergences that are findings, not DRY targets, and
this order records a decision for each rather than merging them: three
`inside` containment helpers with different semantics
(`beacon-io.mjs` line 30 counts the root as inside, `source-change-environment.ts`
line 7 does not, `source-change-worktree.ts` line 47 is a raw prefix);
`plan-continuation.mjs` line 16's key-order-sensitive `same` beside two
canonical ones; four control-character classes across the `text`
validators in scripts and three across the skeleton protocols (a value the
handoff contract accepts can be rejected by the mission check);
`closesFence` in `check-publication.mjs` line 177 and `github-body.mjs`
line 44 using different fence rules. Kernel and console are clean; the
generated hooks' inlined `operatorControl` and the compiler's inlined
hook-source helpers are justified by build-free recovery and stay.

**Design (scope discipline):**

- Git: the seven exact-shape wrappers become `runGit` imports; the
  hookless and fixture-identity variants pass their `-c` flags as leading
  arguments; `meta.mjs` (null on failure, `trimEnd`) and
  `authority-probe.mjs` (`optional`) keep a two-line wrapper over
  `runGit`; the four fixture `commit` helpers converge on the two that
  already use `runGit`.
- Fixture writer and pretty JSON: one new `scripts/lib` module exports
  `write(root, path, contents, { mode })` and `json(value)`; the twenty
  and nine definers import it; the two Copilot files keep mode 0o600
  through the option; `worktree-integration.mjs`'s symlink-guarded `put`
  stays separate.
- Receipt helpers: the six cloned helpers move to a shared module
  parametrized by the directory and message label; `validReceiptId` stays
  separate in each file (different grammars); the tests that assert the
  "must not be a symlink" strings are checked before the label is
  parametrized.
- JSON readers: the five named wrappers call `paths.mjs`; error-message
  assertions in tests are checked first and preserved; inline
  `JSON.parse(readFileSync(...))` sites with their own fallbacks are left.
- Digest: `plan-subject.mjs` exports `sha256Hex` beside the prefixed
  `sha256`; the eight bare-hex copies import it; no stored digest changes
  (the regression compares the fixture trees' recorded digests before and
  after).
- Compiler: `normalize.ts` exports `compareText` and `orderedUnique`;
  `compile.ts` imports them.
- Divergences: one decision each, recorded with the callers that depend
  on the edge behavior; a decision that finds a latent defect names it as
  a follow-up, never fixes it here.
- Excluded on purpose: the skeleton protocol validator kit (`object`,
  `exact`, `check` byte-identical across `entropy-review-protocol.ts`,
  `verification-protocol.ts`, `worker-protocol.ts`, `mission-check-protocol.ts`,
  `plan-refutation-protocol.ts`), because every one of those files is a
  feedback source and the consolidation would spend a live self-host
  episode for a refactor; it is a map candidate that rides as a boy-scout
  item on the next order that pays that episode and touches two of the
  five. Also excluded: the skeleton's twelve node-crypto digest one-liners
  (DRY for its own sake alone), the twenty `new Date().toISOString()`
  sites, and the four hand-rolled flag loops (four files, four different
  option sets).
- **Declined alternatives, recorded:** a shared utility package across
  units (the operator's direction and the platform lens both refuse a new
  cross-unit dependency); a sweep of the 98 inline JSON reads (mixed
  semantics); renaming the prefixed `sha256` (six importers, stored
  strings).

**Deliverables:** the adoptions; the new module; the exports; the
regression; the divergence decisions.

**Acceptance criteria (all required)**

1. `git grep -n 'spawnSync("git"\|execFileSync("git"' scripts` returns
   only `scripts/lib/git.mjs` and the two documented thin wrappers; every
   former definer imports `runGit`.
2. No file under `scripts/` defines a local mkdir-then-write fixture
   helper or a local pretty-JSON serializer; all import the module.
3. `entropy-review.mjs` and `plan-receipts.mjs` share the six helpers;
   `validReceiptId` stays per file; `scripts/test-plan-refutation.mjs` and
   `scripts/test-entropy-review.mjs` pass unchanged.
4. The five named JSON readers call `paths.mjs`; every asserted error
   message still matches.
5. Every fixture tree's recorded digests and every fixture output are
   byte-identical before and after (the regression diffs them);
   `sha256Hex` is exported and the eight copies are gone.
6. `compile.ts` no longer declares `compareText` or `orderedUnique`; the
   compiler's fixture hashes are unchanged.
7. One decision per divergence, naming the dependent callers; any latent
   defect found is a named follow-up.
8. The authority edition re-mints deterministically; `npm test` and
   `npm run test:docs` green; `git diff --check` clean; no new dependency;
   the diff touches no file WO-163 names.

**Evidence gate:** the regression transcript; the before/after digest
comparison; `npm test` at final review. No live row.

**Write-back duty:** decisions; the map candidate for the skeleton
validator kit gains this order's measurement.

**Non-goals:** the skeleton protocol files; a cross-unit utility package;
any behavior change; the generated hooks' inlined helpers; the
`inside`/`same`/`text` semantics (decided, not merged).

**Operator-review assumptions**

1. "Makes sense" means an existing home bypassed or a byte-identical copy
   in three or more files; two-line wrappers duplicated twice are left.
2. A latent defect found while deciding a divergence becomes a follow-up
   row, not a repair inside this order.
