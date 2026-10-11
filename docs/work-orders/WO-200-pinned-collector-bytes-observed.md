# WO-200 — Pinned collector bytes are watched where they change: the WO-107 lane's hashed sources are declared, left alone by the formatter and the comment scan, checked in the review gate when they change, and the comment-only drift is recorded and reversed (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. One Git attribute on four files, four
formatter-ignore lines, one filter in the comment scan, one machinery
runner row, one restored comment line and one decision record; no runtime
capability. Assigned at activation under the standing opt-out default.
**Cost:** adds a `dotln-pinned-bytes` attribute on the four files
`protocolLineage` hashes (`.gitattributes`), the same four paths in
`.prettierignore`'s exact-bytes group, one more attribute name in
`commentFiles` (`scripts/lib/comment-labels.mjs`, the `check-attr` call at
line 60), one machinery row `wo107-schema` with its `machinerySources`
entry and `protection` sentence (`scripts/test-runner.mjs`, lines 108 and
855), two fixture cases in `scripts/test-comment-labels.mjs`, one case in
`corpus/harness/wo107-schema.test.mjs`, the restored comment line in
`corpus/harness/profile.mjs`, `docs/evidence/WO-200/decisions.md`, one
sentence in product 03 §Corpus policy and one dated line in
`corpus/baselines/SCHEMA-WO-107.md`. Steady-state cost: the row runs only
when one of its five declared sources changed against the merge base
(about one second of test time; its thirteen cases ran in under one
second each at `9c18aa54`); the comment scan reads four fewer files.
Removes: a red lane since 2026-10-09 (36 of the 72 committed WO-107
records carry a protocol hash no current source produces), the class of
silent invalidation in which a repository-wide rewriter reaches
hash-pinned bytes outside every gate (WO-105 D012 and WO-107 are the two
instances), and the manual lane run before any consumer of the baseline.
Re-mints: `scripts/test-runner.mjs` is a declared machinery source, so
`npm test -- --review` runs before handoff; `comment-labels.mjs`,
`profile.mjs`, `.gitattributes` and `.prettierignore` are in no evidence
inventory and no file the feedback verifier judges changes, so no edition
is re-minted and no live episode runs. Wall-clock, tokens and context
bytes are unknown until run.
**Nomination provenance:** Entropy Reducer finding ER6-001 and the packet
`pinned-collector-bytes-observed` of
[REVIEW-006](../instance/entropy-reducer/runs/REVIEW-006.md), both
survived [REFUTATION-007](../instance/entropy-reducer/runs/REFUTATION-007.md)
and were re-measured by the planner on 2026-10-10; the operator's standing
`planning: entropy reducer` dispatch (captured in ignored intake, SHA-256
`af15db6c04e4529cad3c3532a21f5a46060c650159a637899d4ece48e8438726`).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
repository records only; no stop condition. The
[planning document](../planning/entropy-review-006-2026-10-10.md) §5.
**Depends on:** no queued order. WO-188 (closed, v0.71.0) made the comment
edit this order reverses; WO-107 (closed, v0.59.0) filed the lane and the
rule this order applies.
**Recommended placement:** the machinery lane of the pair after WO-072,
beside WO-076. WO-076 edits `scripts/harness.mjs`, `scripts/lib/harness.mjs`,
`packages/skeleton/src/loadouts/contributor.ts`, `scripts/test-harness.mjs`
and the client README template; this order edits none of them. It does
edit `scripts/test-runner.mjs`, which WO-078 and WO-072 also edit, so it is
not placed beside either. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `corpus/harness/profile.mjs` lines 240 to
253 (`protocolHash`: the four files hashed whole, comments included),
258 to 310 (`protocolLineage`) and 311 to 320 (`validateProvenance`,
"known collector revision"); `docs/evidence/WO-107/decisions.md` D001
(`reopenWhen`: a failed observation, source drift or inability to reproduce
the declared registry requires recording the failure before changing the
protocol) and D010 (three checks keyed to WO-107's bytes);
`docs/evidence/WO-105/decisions.md` D012 (the sibling lane's base-keyed
pins); `scripts/lib/comment-labels.mjs` `commentFiles` (lines 34 to 80:
the `dotln-generated` attribute excludes a file) and `DECISION_NUMBER`
(line 26: a bare `D007` matches); `.gitattributes` (`dotln-generated` and
`dotln-documentation` rows); `.prettierignore` (the "Recorded fixture
bytes" group); `scripts/test-runner.mjs` `machinerySources` (line 108),
`classifySuite` (line 503: a row named there is machinery and leaves the
plain selection), `nodeTests` (line 80) and the `artifact-corpus` row
(line 855); `scripts/lib/machinery-coverage.mjs` (a machinery row's
sources cover its entry's direct imports); `scripts/test-comment-labels.mjs`
cases at lines 39, 149 and 227; `corpus/harness/wo107-schema.test.mjs`
cases at lines 276, 310 and 393; `corpus/baselines/SCHEMA-WO-107.md`
§Commands and retention; 03-architecture.md §Corpus policy.

**Objective:** The four files whose bytes feed the WO-107 provenance hash
are declared once, the formatter and the comment scan leave them alone, the
lane's schema test runs in the review gate whenever one of them changes,
and the lane is green again at this order's identity with its drift
recorded under WO-107's own rule.

**Observed gap (dated 2026-10-10, `main` at `9c18aa54`):**

- `node --test corpus/harness/wo107-schema.test.mjs` runs 13 tests; 11
  pass and 2 fail with `AssertionError: known collector revision`
  (`profile.mjs` line 315). `protocolHash()` hashes `profile.mjs`,
  `wo107-records.mjs`, `wo107-scenarios.mjs` and `wo107-bounded.mjs`
  whole. Since WO-107 landed (`3e29dd9d`, 2026-10-01) the only change to
  those files is `1aea2dea` (2026-10-09, WO-188), which rewrote one comment
  in `profile.mjs` from `after D007.` to `after the one-entry classification
  fix (WO-107 D007).`. The hash moved from
  `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`, which
  36 of the 72 committed records carry, to
  `8e770e7f454e6878919abfae2f843b52e13ddf8265ebe9594959e72452e64e6c`, which
  no record carries. Restoring the one comment restores the first hash
  (both computed by the planner and by REFUTATION-007).
- No runner row names the lane (`grep -c wo107 scripts/test-runner.mjs` is
  0; WO-107 declared "nothing joins the root `npm test`"), so every gate
  stayed green. `commentFiles` excludes only document roots, `dist`,
  `node_modules` and the harness directories; `DECISION_NUMBER` matches a
  bare `D007`; `docs/control/comment-baseline.json` has no corpus entry;
  WO-188's verifier listed `profile.mjs` among its comment-only files
  (`docs/evidence/WO-188/verifier-004/checks.txt` line 211). `prettier
  --file-info corpus/harness/profile.mjs` reports `ignored: false`, so a
  formatter upgrade would drift the hash the same way.
- No decision or register row recorded the drift. WO-107 D001's reopening
  condition requires recording a source drift before the protocol changes.

**Design (scope discipline):**

- One declaration, read by both rewriters. The four files carry a Git
  attribute, `dotln-pinned-bytes`, the way generated files carry
  `dotln-generated`; `commentFiles` asks `check-attr` for both names in the
  same call and drops a file with either set. Prettier reads no Git
  attribute, so `.prettierignore` lists the same four paths and a test
  asserts the two lists agree. A typed declaration, not a comment
  convention or a path pattern over prose.
- The lane joins the review gate as a machinery row, selected only when one
  of its declared sources changed against the merge base
  (`changedMachinery`); the plain and document gates never run it. WO-107's
  "nothing joins the root `npm test`" is kept for the plain gate; the
  review gate is where a change to those bytes is judged.
- The drift is recorded first and reversed second. D001 records the commit,
  date, both hashes and the red interval before any byte changes; then the
  comment is restored to its `1aea2dea^` bytes, which is a zero-semantic
  change, and the restored bare `D007` is admitted because the scan no
  longer reads the file. Re-collecting the baseline is declined: the byte
  change is one comment and no record's measurement or classification
  changed. Admitting the new hash as a third revision is declined: it would
  teach the lane that comment edits move provenance, which is the drift
  this order ends.
- **Declined alternatives, recorded:** excluding all of `corpus/harness/`
  from the comment scan (the generators and tests there are ordinary code);
  a path list inside `comment-labels.mjs` (a second declaration beside the
  attribute); deciding WO-105's after-base rule here (its lane was not
  edited; its row FUP-d093f77bd927f9dc keeps its own condition).

**Execution plan (the executor follows these steps in order; observed at `9c18aa54`, 2026-10-10):**

0. Re-observe the gap: `node --test corpus/harness/wo107-schema.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)|known collector' | sort | uniq -c` (13 tests, 11 pass, 2 fail);
   `git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs` (`1aea2dea`, `3e29dd9d`). If the lane passes at the base, stop and record the order unmet under assumption 1.
1. `docs/evidence/WO-200/decisions.md` D001, written before any other byte changes: the drift under WO-107 D001's rule (commit `1aea2dea`, 2026-10-09, one comment; hash `1d618f2f…` to `8e770e7f…`; 36 records; red from 2026-10-09 to this order's date; cause class: a repository-wide rewriter reached hash-pinned bytes outside every gate). Check: `npm run meta -- --check` reads the record.
2. `corpus/harness/profile.mjs`: restore the comment at lines 252 to 254 to its `1aea2dea^` bytes (`git show 1aea2dea^:corpus/harness/profile.mjs > corpus/harness/profile.mjs`; `git diff --stat` shows that one hunk and nothing else). Check: `node -e` over the four files with `createHash("sha256")` in `protocolHash`'s shape prints `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`; `node --test corpus/harness/wo107-schema.test.mjs` passes 13 in the built tree.
3. `.gitattributes`: after the `dotln-documentation` rows, one comment line and four rows `/corpus/harness/profile.mjs dotln-pinned-bytes` (and `wo107-records.mjs`, `wo107-scenarios.mjs`, `wo107-bounded.mjs`). Check: `git check-attr dotln-pinned-bytes corpus/harness/profile.mjs` prints `set`.
4. `.prettierignore`: the same four paths under the "Recorded fixture bytes" group. Check: `npx --no-install prettier --file-info corpus/harness/profile.mjs` prints `"ignored": true`.
5. `scripts/lib/comment-labels.mjs` `commentFiles`: the `check-attr` call (line 60) names `dotln-generated` and `dotln-pinned-bytes`; the result loop reads both values per file and excludes a file with either set (the loop at lines 66 to 70 steps by three fields per attribute; with two attributes it steps by three per attribute name per file, as `product-read-guard.mjs` line 44 already does with two names). Check: `node scripts/comment-labels.mjs` passes with the restored `D007` and no new baseline entry.
6. `scripts/test-comment-labels.mjs`: add `test("WO-200 a file whose dotln-pinned-bytes attribute is set is left out of the scan")` in the fixture repository of the case at line 149 (set the attribute in the fixture's `.gitattributes`, write a bare `D007` comment, assert the file is absent from `commentFiles` and the check passes), and `test("WO-200 every path with dotln-pinned-bytes set is listed in .prettierignore")` over the real repository (`git ls-files -z` through `check-attr`, compared with the ignore file's non-comment lines). Check: `node --test scripts/test-comment-labels.mjs`.
7. `corpus/harness/wo107-schema.test.mjs`: add `test("corpus the hashed collector files are exactly the pinned-bytes files")`: `protocolLineage`'s own input list, as `corpus/harness/` paths, is the single anchor, and three sets each equal it: the paths `git check-attr dotln-pinned-bytes` reports `set` over `git ls-files corpus/harness`, the `corpus/harness/` entries of `.prettierignore`'s exact-bytes group, and the `machinerySources["wo107-schema"]` entry of `scripts/test-runner.mjs` without the test file itself (read from the runner module, never a hand-copied list in the test). Check: `node --test corpus/harness/wo107-schema.test.mjs` (14 pass).
8. `scripts/test-runner.mjs`: add `nodeTests("wo107-schema", "corpus/harness/wo107-schema.test.mjs", { needsBuild: true })` beside the `artifact-corpus` row (line 855); add `"wo107-schema": ["corpus/harness/wo107-schema.test.mjs", "corpus/harness/profile.mjs", "corpus/harness/wo107-records.mjs", "corpus/harness/wo107-scenarios.mjs", "corpus/harness/wo107-bounded.mjs"]` to `machinerySources` (line 108) and `"wo107-schema": "the WO-107 baseline's provenance hash matches its pinned collector bytes"` to `protection`. Check: `node --test scripts/test-runner.test.mjs` (the WO-174 coverage case at line 220 accepts the row); `npm test -- --review` at an identity where none of the five sources changed does not select `wo107-schema`, and does after `touch`-free edit of one of them in a scratch commit (record both selections in the handoff).
9. Write-backs: `docs/product/03-architecture.md` §"Corpus policy", one sentence in place after the entry-point sentence: hash-pinned collector bytes carry `dotln-pinned-bytes`, which keeps the formatter and the comment scan off them, and the lane's schema test runs in the review gate when they change; `corpus/baselines/SCHEMA-WO-107.md` §"## Commands and retention", one dated line: the review-gate row and the 2026-10-09 drift reversed by this order; `docs/evidence/WO-200/decisions.md`; `npm run publication:check` for the locks.
10. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`; complete `docs/evidence/WO-200/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the attribute and ignore rows, the scan filter with its
cases, the machinery row with its sources, the restored comment, the
schema-test case, D001 and the write-backs.

**Acceptance criteria (all required)**

1. At this order's identity `node --test corpus/harness/wo107-schema.test.mjs` passes every case in the built tree, and the four hashed files produce `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`, with no byte change in `corpus/harness/` outside the restored comment.
2. `git check-attr dotln-pinned-bytes` reports `set` for exactly the files `protocolLineage` hashes, `.prettierignore` lists the same paths, and the row's declared sources name them; `protocolLineage`'s own input list is the anchor the tests of steps 6 and 7 compare each of the three against (never one list against another), so a file added to or removed from the hashed set fails them until every list follows; each test is shown failing once in a scratch copy and recorded in the handoff.
3. `node scripts/comment-labels.mjs` passes with no corpus entry in `docs/control/comment-baseline.json`, and the fixture case shows an attributed file left out of the scan.
4. `wo107-schema` is a machinery row: `npm test -- --review` selects it when one of its five declared sources changed against the merge base and not otherwise, and the plain gate never runs it; both selections are recorded.
5. `docs/evidence/WO-200/decisions.md` D001 records the drift before any byte changed; the write-backs land in place; `npm test -- --review` and `npm run test:docs` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the lane transcript before and after step 2; the two
selection transcripts of criterion 4; `npm run test:docs`;
`npm test -- --review` before `implementation-ready` and again at final
review. No live row.

**Write-back duty:** as listed in step 9.

**Known issues and carry-ins:**

- FUP-8f0561e50754114f (WO-107 D010: the lane's after-base rule, three
  checks keyed to WO-107's bytes) and FUP-069dff5d52d98e0d (manual corpus
  lanes) are allocated here for the WO-107 lane: the after-base rule is
  that a change to the pinned bytes is judged in the review gate of the
  order that makes it. D010's three WO-107-keyed checks are left as they
  are; this order edits none of them and records whether they still pass.
- 2026-10-11 standard pass (receipt 042's known issue): `protocolLineage`'s
  input list anchors the attribute set, the ignore group and the row's
  declared sources (step 7, criterion 2), so a fifth hashed file cannot
  escape all three.
- WO-105's lane and its row FUP-d093f77bd927f9dc are outside this order.

**Non-goals:** re-collecting the WO-107 baseline; a third known collector
revision; WO-105's lane; excluding `corpus/harness/` as a whole from the
comment scan; any change to the lane's measurements, schema or comparison
report; the plain gate.

**Operator-review assumptions**

1. If the lane passes at the activation base (someone restored or re-pinned
   the bytes first), the executor records the order unmet under step 0 and
   the operator may `withdraw` it; the attribute, ignore rows and machinery
   row are then filed as a boy-scout nomination on the next order that edits
   `scripts/test-runner.mjs`.
