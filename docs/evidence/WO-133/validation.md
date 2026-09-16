# WO-133 executor validation

Executed 2026-09-16 in the selected `wo-133` worktree. Executor attestation:
Codex CLI 0.154.0, GPT-6 Astra, max, source `operator-attested`. The CLI version
was observed; effective model/effort readback was unavailable. One writer;
read-only assistants audited runtime ordering, advisory purity and fixture scope.

| Executed check | Result |
| --- | --- |
| `npm test` | PASS: 19 suites, 0 failed, 63 fresh tasks, 318.56 s |
| `node --test scripts/test-harness.mjs` | PASS: 28 tests, 0 failed, 364.31 s |
| `node --test scripts/test-process-debt.mjs` | PASS: 67 tests, 0 failed, 200.63 s |
| `node --test scripts/test-runner.test.mjs` | PASS: 28 tests, 0 failed, 15.09 s |
| `node scripts/reactor-identity.mjs --check` | PASS: all 19 frozen complete Decision/projection comparisons under their recorded compiler identity 0.11.1 |
| `node --test packages/skeleton/dist/test/reactor-slices.test.js packages/skeleton/dist/test/scenario.test.js` | PASS: 31 tests, 0 failed; also included in the final product gate |
| `node --test packages/compiler/dist/test/purity.test.js` | PASS: 2 tests; also included in the final product gate |
| `node scripts/harness.mjs check` | PASS: 24 generated surfaces |
| Authority, artifact-identity, verification and feedback evidence `--check` commands | PASS against `docs/evidence/current.json` |
| `npm run publication:check` | PASS: 267/267 headings; both publication source locks current |
| `npm run format:check` | PASS |
| `npm run release -- prepare --local` and `npm run release -- check-surfaces --local` | PASS; patch v0.22.1 prepared locally |
| `git diff --check` | PASS |

The product, harness and process suites overlapped in wall time. Their durations
are observations of this implementation run, not estimates of isolated reviewer
cost. Full command logs remain in local `/tmp/wo133-*-final.log` files for this
session; the table and assertions below retain the relevant results.

Acceptance evidence:

1. The generated-hook fixture invokes a stale hook set twenty times: exactly
   one visible advisory names `pins-differ` and `node scripts/bootstrap.mjs`;
   all twenty delegated journal rows remain. Observers emit none and do not
   consume the next session's advisory. Missing snapshots share suppression;
   unavailable marker storage keeps messages visible. Existing second-writer,
   concurrent-reclaim and live-gate refusal tests all pass in the full suite.
2. The settings fixture proves SessionStart and UserPromptSubmit use the same
   handler. Matching startup pins yield no runtime message; stale pins yield
   exactly one line naming the cause and command. SessionStart performs no
   lifecycle dispatch. This is executable fixture evidence, not a live Claude
   SessionStart observation.
3. The real-helper fast-forward fixtures observe one build for changed pins,
   none for matching pins, and a release manifest from rebuilt metadata. The
   isolated close cases took 1.960 s (changed) and 1.892 s (matching), excluding
   network through the existing command doubles. Finish took 0.524 s (changed),
   0.413 s (matching) and 0.527 s (missing snapshot). Failed build preserves the
   subject worktree and branch. All cases also pass in the final release suite.
4. All six generated roles on both profiles contain the supplied-value fallback
   and authorized publication-check line. Parser cases preserve arbitrary
   supplied model/effort labels for both harnesses. The resume fixture records
   the legacy source token as `operator-attested` in the canonical event without
   changing the supplied model or effort.
5. The review-selection fixture changes only `version.ts`, invokes the actual
   review list path and selects zero machinery suites. A compiler literal-only
   change also selects zero; a host behavior change selects `harness-fixtures`
   and `process-debt`. Source assertions prove the host/profile literals moved
   to the shared module, whose built bytes are pinned.
6. Product 02, product 07, the playbook, component READMEs and decisions are
   updated; the generated bundle and publication locks pass their checks.
7. Final product gate and whitespace check pass. The lockfile changes only
   internal component versions and the existing compiler dependency version;
   no dependency is added. Production artifact validation is unchanged.

The initial product gate failed in compiler purity and version-bound fixtures;
the correction, operator-authorized adjacent repair, and retained historical
evidence are recorded in decision D004. Authority revision 001 supersedes the
preserved initial WO-133 bundle observation. Current artifact, verification and
feedback editions remain valid. The feedback edition includes an executed live
Codex CLI verifier: ten regressions passed, ten removal controls failed as
expected, and the matched instruction projection saved 1,192 bytes.

The first real close after merge, next skeleton reviewer's gate duration and
first post-merge completions on Codex and Claude remain unobserved reopening
conditions. This executor does not claim those future outcomes or an independent
verification verdict. Current source diffs and authored text were reviewed;
generated and oversized outputs were checked through their executable evidence.

## Repair after FINAL-001 — 2026-09-16

Dispatch: `resume: fix`. Actor: Codex CLI 0.154.0 (observed),
`gpt-6-astra`, effort `max`, source `operator-attested`; no effective
model/effort readback was exposed. This session was the only writer; a
read-only assistant checked the source dependency and reviewed the repair.

FINAL-001 F1 reproduced with the focused inventory test: `runtime_refresh`
was the only case missing from the expected list. Registering it restores
the existing guard. The operator-authorized adjacent repair declares
`scripts/test-release.sh` as a source of `runner-fixtures`. Its regression
uses an isolated Git repository: no changes select no machinery; adding a
shell case selects exactly `runner-fixtures` through both the selector and
review CLI; suite expansion includes the inventory guard. The regression
failed before the declaration change and passes with it. Decision D005
records the alternatives, cost and reopening condition.

| Executed check | Repair result |
| --- | --- |
| Focused release inventory test | PASS after reproducing FINAL-001 F1 |
| `node --test scripts/test-runner.test.mjs scripts/test-release-fixtures.mjs` | PASS: 32 tests, 0 failed |
| `npm test -- --review` | PASS: 30 suites, 0 failed, 74 fresh tasks; includes `runner-fixtures` and `release:case:runtime_refresh` |
| Prettier check of the three edited scripts and decisions | PASS |
| `npm run release -- prepare --local` | PASS: existing patch v0.22.1 remains current; local tag observation |
| `npm run meta` | PASS: D005 projected into the decisions index |
| `git diff --check` | PASS |

The runner under repair executed the full gate. Independent evidence is the
direct inventory failure/pass and the isolated Git regression; the existing
version-only selection regression also passes. Logs are retained locally at
`/tmp/wo133-repair-targeted.log` and `/tmp/wo133-repair-review.log`; canonical
gate rows remain in the ignored harness check store. Source changes ended
before the gate; subsequent report and lifecycle writes do not change its code
identity. Current changed source regions and authored evidence were read;
generated projections use their successful generation evidence.

The observed outcome matches D005: the missing case is registered and a future
shell-only change selects its inventory guard without selecting other machinery.
No component version, dependency, runtime behavior or product document changed
during repair. FINAL-001 and VER-001 remain immutable; their retained planner
nomination and post-merge observations are unchanged. Fresh independent
verification remains the next dispatch.
