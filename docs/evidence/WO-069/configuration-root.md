# WO-069 — configuration root evidence

Recorded 2026-09-21 in worktree `wo-069` at activation base
`010b3ba52fd3a3532ffe222904b0720d16d3ed87`, macOS 24.6.0, Node v26.9.0. Every
transcript below was produced by running the named command; nothing here is
inferred.

## Criterion 1 — an absent `dotln.config.json` reproduces the activation base

This repository ships no `dotln.config.json`, so the loader's defaults govern.
Each artifact was captured before any source change and again with the whole
refactor in place, and compared with `cmp`:

```
cmp status.json                identical (23619 bytes)   node scripts/resume.mjs status --json
cmp status.txt                 identical (1604 bytes)    node scripts/resume.mjs status
cmp times.json                 identical (122435 bytes)  node scripts/resume.mjs times
cmp usage.txt                  identical (85915 bytes)   node scripts/resume.mjs usage
cmp briefing.txt               identical (1408 bytes)    node scripts/resume.mjs briefing
cmp check-surfaces.txt         identical (308 bytes)     node scripts/release.mjs check-surfaces --local
cmp manifest-v0.37.1.json      identical (7435 bytes)    node scripts/release.mjs manifest-from-tag v0.37.1
```

Both `check-surfaces` runs predate this order's release preparation, so they
compare the same unprepared surfaces; the prepared surfaces are checked
separately below.

The release manifest was compared in a local clone of the activation base so
that only the script bytes differed between the two runs: the clone's committed
`scripts/` produced the baseline, the refactored `scripts/` produced the
comparison, and both read the same tagged control log.

`docs/control/current.md` (1488 bytes, written by this session's recorded
dispatch before any source change) is untouched by the refactor; no read-only
command rewrites it. `node scripts/resume.mjs status` re-renders the projection
from the canonical fold and compares it with the file on disk; it prints no
`disagrees with the canonical fold` warning, so the refactored renderer
reproduces the recorded projection byte for byte. The generated index is
verified the same way: `node scripts/work-orders.mjs index --check` reports
`PASS docs/work-orders/README.md is current` against the committed projection.

## Criteria 2 and 3 — `scripts/test-configuration-root.mjs`

```
node --test scripts/test-configuration-root.mjs

✔ an absent configuration means today's layout
✔ a declared root moves its documents and its children
✔ a malformed configuration refuses with its path
✔ the launchpad is discovered, and the override wins
✔ no control-plane script keeps a literal document root or a second root derivation
✔ configured lineage and planning consumers use the launchpad ledger
✔ configured follow-up references validate against their roots
✔ writing-worker defaults separate tool inputs from configured outputs
✔ a fixture launchpad with non-default roots drives the lifecycle
✔ worktree start and finish use the configured roots
✔ every declared root key is reachable
ℹ pass 12
ℹ fail 0
```

**Criterion 2** is covered by the last two cases. The lifecycle case builds a
temporary launchpad whose roots are `records`, `records/state`,
`records/state/segments`, `records/orders`, `records/checks`, `records/reviews`
and `records/proof`, then drives `activate`, `implementation-ready`, `verify`,
`verification-result`, `final-review` and `final-review-result` through the
unchanged commands. It asserts that the allocated report paths, the folded
status, the control segment and the projection all land under those roots, that
no lifecycle document falls back to a default root, and that the projection
cites its own configured storage. The worktree case builds a bare origin, a
clone, a `dotln.config.json` with non-default roots and a work order under the
configured root, then runs `worktree start`, the whole lifecycle to closed, a
merge and push, and `worktree finish` — asserting the worktree and merged branch
are removed and the merged review is present under its configured root.

The one documented exception is recorded in
[WO-069-D005](decisions.md#wo-069-d005): the compiled packages still write the
Git-ignored `docs/control/local/...` harness lane on the default path. The test
states that exception explicitly rather than widening its filter silently.

**Criterion 3** is the guard case. It reads every non-test `.mjs` file under
`scripts/` except `scripts/lib/config.mjs` and refuses a path-shaped `docs/...`
literal (string, template literal, or a `docs\/` fragment inside a regular
expression) and any `import.meta.url`/`import.meta.dirname` combined with a
parent-directory traversal. The malformed-configuration case refuses sixteen
shapes — unparsable JSON, a non-object document, a wrong version, a missing
version, an unknown section key, a non-object `roots`, an unknown root key, an
absolute root, a `..` root, an empty root, a non-object `repositories`, a
non-object repository entry, a non-string `build` value, an unknown `build` key,
a non-boolean `release` value and an unknown `release` key — and asserts the
configuration file's path appears in each refusal.

## Observed surface (WO-069-D007)

The order's dated gap counted 81 literal roots and eleven root derivations from a
2026-09-06 sweep. Measured at this revision before the change, the non-test
surface under `scripts/` was:

| Shape                                         | Count |
| --------------------------------------------- | ----: |
| `"docs/…"` string literals                    |   211 |
| `` `docs/…` `` template literals              |    52 |
| `docs\/` fragments inside regular expressions |    12 |
| root derivations from `import.meta.url`       |    32 |
| root derivations from `import.meta.dirname`   |     3 |

They occupied 61 of the 99 non-test `.mjs` files under `scripts/`, counted over
`HEAD` (`010b3ba5`) rather than the working tree.

The derivation shapes were `new URL("../", import.meta.url)`,
`new URL("../../", import.meta.url)`,
`resolve(dirname(fileURLToPath(import.meta.url)), "..")` and
`resolve(import.meta.dirname, "../..")`. All of them now resolve through
`scripts/lib/config.mjs`, which owns the single remaining derivation
(`TOOL_ROOT`) for kit paths and `findLaunchpad` for documents.

## Criterion 5 — the product gate

```
npm test: 22 passed; 0 failed; 261.87 s; 66 fresh tasks
npm run format:check: All matched files use Prettier code style!
npm run publication:check: PASS publication bootstrap checks
node scripts/release.mjs check-surfaces --local: exit 0
node scripts/work-orders.mjs index --check: PASS docs/work-orders/README.md is current
git diff --check: clean
```

`npm run release -- prepare --local` retimed WO-069 from `v0.37.1` to `v0.37.2`
under its declared patch classification, updating the work-order heading, the
README claim and a dated roadmap note. No component version changed, because no
package source changed.

## VER-001 repair — configured consumers and existing suites

The `resume: fix` dispatch repaired all five findings without changing the
schema, discovery order, lifecycle commands or package-local limitation:

- **F1:** lineage and planning-pass consumers now derive the configured ledger
  and refutation roots after receiving a launchpad. A committed fixture with
  `roots.docs = "records"` generates `records/lineage/README.md`, obtains the
  enforced pass from `records/lineage/idea-ledger.md`, and leaves the default
  lineage path absent.
- **F2:** follow-up validation and worktree-integration union receive the
  launchpad root. A configured product candidate now syncs to
  `records/planning/followups.json` with its `records/product/...` source
  reference intact.
- **F3:** `writing-worker-probe.mjs` gets kit inputs from the loader's
  `TOOL_ROOT` and defaults document outputs through `findLaunchpad()`. The guard
  recognizes the verifier's two-step module-directory derivation shape, and an
  isolated copied-tool fixture writes its report only to the separately
  configured launchpad.
- **F4:** the configured legal-document path remains in scope for the error
  handler. Missing `LEGAL.md` fixtures return the activation-base structured
  failure for both `docs/LEGAL.md` and `records/LEGAL.md`; neither throws a
  `ReferenceError`.
- **F5:** the harness fixture copies `config.mjs`, completing the dependency
  graph of its copied harness, terms and paths modules. The independently
  failing compiler-only case passes, and the full machinery run passes all 108
  harness fixture cases, including the operator-release barrier. This confirms
  the prior timeout was part of the missing-module fixture failure rather than
  an independent barrier defect.

Executed repair evidence before the final product gate:

```
node --test scripts/test-configuration-root.mjs: 12 passed; 0 failed; 2.60 s
node --test scripts/test-license-surfaces.mjs: 9 passed; 0 failed; 6.36 s
node --test --test-name-pattern='compiler-only release installs' scripts/test-harness.mjs: 1 passed; 0 failed; 0.74 s
npm run test:machinery: 17 passed; 0 failed; 292.46 s; 17 fresh tasks
git diff --check: clean
```

### Adjacent final-gate observation

The first canonical repair gate ran the current 66-task product selection and
reported 21 suites passed and one failed. The failure was the unchanged
`WO-143 once and loop restart at every acquisition filesystem boundary`
skeleton case: one restart saw its synthetic abandoned `host.lock` PID as a
live process. The other 407 skeleton tests passed. Running that exact compiled
case alone against the same source passed all 344 deterministic SIGKILL
boundaries in 143.77 seconds.

No package source or package test is part of WO-069's diff. The cause is not
established. A supported inference is PID reuse under concurrent process churn:
the fixture obtains one observed-dead child PID before the matrix and writes it
into every synthetic lock for several minutes. The bounded follow-up in
[WO-069-D015](decisions.md#wo-069-d015) asks WO-143 to test that hypothesis by
allocating a freshly observed dead PID per fixture. The canonical gate is rerun
after this write-back; its local harness record, rather than a post-gate edit to
this tracked report, retains the final result.
