# Mutation evidence — WO-108

This runner measures the existing kernel, compiler, and skeleton suites at a declared set of single-source mutations. It uses Node builtins and the already provisioned toolchain, operates offline, and never invokes a model. The [work order](../../docs/work-orders/WO-108-mutation-probe.md) records the operator's 2026-09-06 scope modernization and ideation breakout.

The base is published `v0.13.0`, commit `3dc19b7342ad03662172cf86663f406b96a43db4`. The deterministic census contains 2,901 candidate sites. The measured campaign selects 32 before seeing any verdict: eight historical compiler probes, six kernel sites, six current compiler sites, and twelve current skeleton sites. This is a selected sample, not exhaustive coverage or a random estimate of whole-repository suite strength.

## Run and inspect

Run from the Git worktree root with its existing locked dependencies provisioned. No installation occurs in these commands.

```sh
npm run test:mutation
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --enumerate
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --run-all
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --check
```

`npm run evidence:mutation -- <arguments>` is the same runner. `npm test` includes the synthetic runner self-tests. The read-only `--check` re-enumerates the census and selection, checks the exact policy/toolchain, validates every matrix row and complete cardinality, regenerates survivor text in memory, and corroborates final transcript totals. It does not rerun the expensive campaign.

To reproduce one site or every recorded survivor without changing the matrix:

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00001
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce-survivors
```

Each command checks a fresh unmutated baseline. The batch survivor command shares that baseline, gives every survivor a new scratch build, and refuses a changed verdict. It does not erase the original observation. `--report` regenerates findings from a valid matrix prefix without running tests.

## Evidence and boundaries

- [Candidate census](candidates-3dc19b7342ad03662172cf86663f406b96a43db4.jsonl), [selected sites](sites-3dc19b7342ad03662172cf86663f406b96a43db4.jsonl), and [policy](policy-3dc19b7342ad03662172cf86663f406b96a43db4.json) record patches, source hashes, the selection rule, instrument/compiler hashes, toolchain, and bounds. These regenerate byte-for-byte. Drafts can change before the first measured run; later drift refuses.
- The [kill matrix](kill-matrix-3dc19b7342ad03662172cf86663f406b96a43db4.jsonl) and [campaign transcript](../manifests/runs/WO-108-3dc19b7342ad03662172cf86663f406b96a43db4.log) append observations. The [findings](findings-WO-108.md) are their reproducible projection: one stable numbered investigation for each compiled survivor, with an exact patch and reproduction command.
- A fresh scratch root comes from `mkdtemp`, with in-process ownership, marker and directory identity checked before cleanup. The runner reads external dependency links and does not write through them; links are not an operating-system sandbox. All three workspace links point into scratch. Only tracked base files enter the snapshot, including the scripts, docs, and fixture evidence consumed by current tests. No ignored intake enters. Fixture Git refs live in scratch and read committed base objects through an alternate object directory.
- Fresh compilation precedes explicit nonempty test-file inventories for every package. The unmutated baseline must be green before each session; a second baseline checks the environment after measuring rows. A changed successful test count becomes a named runner assertion. Inherited Git, DotLn, Node test-runner, and Node injection variables are removed from subprocesses.
- Each mutant has a 120-second timeout covering preparation/build/test time. The detached compiler/test process group is killed on timeout, including ordinary descendants. A session stops between mutants after 45 minutes; SIGINT/SIGTERM requests a stop after the current bounded attempt. Rerun `--run-all` to continue the validated prefix. Hard process termination can leave an owned temporary tree; the runner does not sweep or delete paths it cannot prove it created in the current process.
- Run one writer at a time. The runner detects an observed matrix-size change before append; it is not a general concurrent-writer lock. Malformed tails, duplicates, changed sites/policy and inconsistent verdicts refuse without repair. A hard interruption before append can require repeating that unrecorded attempt.
- The lexical enumerator is deliberately crude. Comments, quoted non-diagnostic strings, regexes and whole templates (including interpolations) are opaque; uncertain syntax is omitted or refused. Only bounded syntactic patterns are eligible. Comparison inversions can lose TypeScript narrowing; compile kills are enumeration noise. The eight historical probes are remeasured, not assumed to survive.
- Strength statistics use only `killed-by-test / (killed-by-test + survived)`. Compile noise and timeouts are separate. Package/operator counts describe selected sites; a survivor may be equivalent or outside current fixtures. This order adds no assertion to the shipped suites and fixes no survivor.

## Executor outcome

The initial handoff lacked dependencies and failed the build. The operator authorized offline provisioning, the generated index refresh, a `v0.13.1` tooling/evidence release assignment, and modernization of this work order. The [complete build/test gate](../manifests/runs/WO-108-gate.log) passed, including 281 shipped package tests and 21 runner self-tests. Both campaign baselines passed all 281 package tests. The [preflight log](../manifests/runs/WO-108-baseline.log) distinguishes the earlier provisioning/formatting failures from the green measurement baseline and records Node 22.2.0, TypeScript 5.4.5, Git 2.55.0, Darwin/arm64. This is the observed host, not a portability claim.

All 32 selected mutants have recorded outcomes: 18 test kills, 11 survivors, two compile kills, and one test-phase timeout. The conclusive compiled denominator is 29, giving 18/29 (62.1%) detected and 11/29 (37.9%) surviving in this selected campaign. Compile noise is 2/32 (6.25%); the compiled timeout is excluded from the 29. The timeout is `M00030`, the v3 storage-profile guard: it reached 120 seconds without a complete test report or named killing test. Its outcome is unresolved within the declared bound and is not relabeled a kill or survivor.

The current suite catches three historical probes that survived WO-008's earlier drill: missing active capabilities, duplicate ids, and zeroed prompt-token costs. Five historical probes still survive. Current-code survivors additionally cover equipped-senses validation, Beacon age reevaluation, verification-stream selection, evidence supporting a failing verifier verdict, decoded Beacon consistency, and JSDoc traversal. The last case explicitly needs equivalence triage. The [numbered findings](findings-WO-108.md) retain every exact patch and local acceptance claim; a future hardening order should establish a distinguishing input before adding an assertion merely to increase the score.

The read-only corpus check passed, including manifest regeneration, matrix consistency, every survivor finding, and transcript totals. All 11 [fresh survivor reproductions](../manifests/runs/WO-108-survivor-reproductions.log) passed all 281 shipped tests again. A separate [Python audit](../manifests/runs/WO-108-artifact-audit.log) checked the Git-base patch ranges, instrument/compiler/site/policy hashes, verdict fields, findings and totals; the [scope capture](../manifests/runs/WO-108-scope.log) records the amended path boundary. Reproduction left the measured matrix unchanged. This order builds its own measurement instrument: the real planted compile/test/survivor/timeout cases are evidence for that instrument, and independent repository verification remains a separate lifecycle step.

Executor attestation: `codex-cli` 0.153.4; `gpt-6-astra`; effort `max`; source `operator-attested` under the repository's Codex default, not effective-session readback.

The implementation-consequences ideation is a separate documentation subject within the same work order. Its raw source is preserved in main's ignored intake, and its receipt names the synthesized ledger/product surfaces and open candidate choices. The corpus layout follow-up left by WO-101 is synchronized in product 03 and the corpus entry point. No runtime or schema migration is claimed.
