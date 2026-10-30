# WO-240 — Run core and the starter on Node 24.15.0 and Node 26 (version assigned at activation)

**Model:** any capable model; record the actual model and effort.
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor; adds a supported runtime line without retiring Node 26.
**Cost:** adds two-runtime compatibility evidence and a reproducible runtime matrix, including a fresh starter bootstrap on each runtime. Removes the Node-26-only admission while preserving the already-working starter setup without a core checkout. Commands: retain bootstrap, emit, check and the existing gates; one matrix entry point if the repository has no suitable runner. Steps: six. Context bytes and tokens: unknown until implementation; measure changed guidance before and after. Wall-clock: full checks on both runtimes cost two observations instead of one; runtime acquisition and gate cost are unknown until measured. No new recurring hook work. Inspect registered evidence sources at activation and deterministically re-mint affected editions; a runtime change requires the bounded live host requalification named below. No feedback behavior change is proposed; if an implementation touches a feedback-judged source, record the extra re-mint and live feedback self-host episode before doing so.
**Nomination provenance:** operator item 1 and the private starter setup question, [2026-10-30 planning pass](../planning/portable-config-assisted-2026-10-30.md). Planner synthesis, not a claim that Node 24 already works.
**Depends on:** none open.

<!-- dotln-dependencies:start -->
[]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 03's launchpad export description; product 07 §Preflight before the full gate and §Research and guided-operator work orders; `scripts/bootstrap.mjs`; `scripts/build.mjs`; `scripts/lib/product-read-guard.mjs`; `scripts/launchpad.mjs` package/lock export; the root and workspace package manifests and locks; [Node 24.15.0 release](https://nodejs.org/en/blog/release/v24.15.0).

**Objective:** A user with exactly Node 24.15.0 can develop DotLn and operate a fresh starter clone, including its harness and target workflow, while Node 26 remains supported and the existing default. A private starter instance needs no core clone.

**Observed gap (2026-10-30, core `4090d70d`):** the root and all six workspace manifests declare `>=26.0.0 <27`; the starter exports that range. README specifies Node 26. The product-read guard explicitly relies on Node's test async-resource behavior; beacon tests pin timestamp precision. The build, native helper launch, runtime snapshots, workspace package links and child Node processes need actual execution on the older runtime. A fresh public starter at `185afc78` bootstrapped and checked 35 surfaces on Node 26.9.0 without tracked drift during the planning pass; that is not Node 24 evidence or qualification of an organization's host or credentials.

**Design:** support `>=24.15.0 <25 || >=26.0.0 <27`, subject to testing the exact lower bound and a recorded Node 26 version. Keep runtime choice external to feature configuration. Reject changing engines alone: it changes an admission claim without evidence. Reject replacing Node 26 with Node 24: the request is additive. Prefer APIs shared by the two lines to global shims; isolate any necessary compatibility branch and test both arms. Audit type declarations against the older runtime so Node-26-only types cannot silently justify unsupported calls. Do not widen to odd or future majors.

**Execution plan:**

1. Root `package.json` and `package-lock.json`: inventory engine declarations, toolchain requirements and actual Node API calls before choosing the compatible type/toolchain pins. Record the exact runtime executables, npm versions and acquisition source in decisions. Update all six workspace manifests and lock entries consistently. Check: install and build on each runtime; `npm test -- --only configuration-root`.
2. `scripts/build.mjs` (`atomicBuild`), `scripts/bootstrap.mjs` (`bootstrapWorktree`) and `packages/skeleton/src/runtime-inputs.mjs`: repair only reproduced older-runtime failures. Confirm child processes use the selected runtime, including native helper preparation and snapshot emit. Check: `npm test -- --only process-debt` and `npm test -- --only harness-fixtures` on both runtimes.
3. `scripts/lib/product-read-guard.mjs` and its tests in `scripts/test-runner.test.mjs`, plus `packages/skeleton/test/control-beacon.test.ts`: exercise read attribution, subprocess propagation, timestamps and rejection cases on both runtimes; preserve the assertions' purposes. Check: `npm test -- --only runner-fixtures` and `npm test -- --only skeleton`.
4. `scripts/test-launchpad-export.mjs` and `scripts/test-launchpad-update.mjs`: add a fresh clone setup case using a public-style upstream and a local bare private-origin stand-in, no starter tags and no core checkout in the clone's environment. Run bootstrap then harness check, establish origin/main, and check an update preview without pushing to upstream. Preserve instance config, overlays and scripts. Check: `npm test -- --only launchpad` and `npm test -- --only instance-history` on both runtimes. This fixture does not claim organization access was tested.
5. Add a runtime-matrix driver under `scripts/` if no existing entry point serves this purpose. It accepts explicit executables, verifies their versions, propagates them to child processes and records failures rather than skipping missing runtimes as passes. Record one bounded live supported-host harness/target episode per runtime, using synthetic data and existing authority, because runtime behavior changed; unavailable host evidence leaves that compatibility claim unmet. Check: the driver, the recorded live command and target checks.
6. Write back README's startup paragraph, `scripts/kit/README.client.md` §First steps and product 03's export paragraph with the supported range, exact bootstrap sequence and observed limits. Keep new-export instructions distinct from cloning the committed starter. Refresh export and evidence projections through their commands. Handoff follows product 07 §Discipline.

**Acceptance criteria (all required):**

1. Root, six workspace manifests and exported package/lock declare the tested two-line range; Node 24.14, 25 and 27 are not advertised as supported. The compatibility audit names each changed API/toolchain assumption and its evidence.
2. Exactly Node 24.15.0 and the recorded Node 26 runtime each install, build, emit and check successfully. Children and native helper preparation use the intended runtime; no fallback to the other installed Node supplies the result.
3. Product-read attribution and beacon precision retain their meaningful positive and negative tests on both runtimes; any compatibility branch has a failing control without its repair.
4. Fresh starter clones on both runtimes pass bootstrap and harness check without core, have no starter tags, push only to the local private-origin stand-in, and preserve instance-owned data across update preview/application. The live qualification in step 5 passes on both runtimes, with its exact host coverage stated.
5. Startup guidance matches these observations and distinguishes an empty export from a committed starter clone. `npm run publication:check`, `npm test`, `npm test -- --review` and `npm run test:docs` pass at the final subject on both runtimes; `git diff --check` is clean. Equivalent final-review rows may be reused under the existing identity rule.

**Preflight:** `npm test -- --only configuration-root`, `npm test -- --only process-debt`, `npm test -- --only harness-fixtures`, `npm test -- --only runner-fixtures`, `npm test -- --only skeleton`, `npm test -- --only launchpad`, `npm test -- --only instance-history`; focused reproductions under `node scripts/harness.mjs bounded --`; complete runs outside that wrapper.
**Evidence gate:** two-runtime matrix, bootstrap clone records and live qualification, with negative controls for fixes.
**Deliverables:** compatibility changes, matrix, startup guidance and evidence.
**Write-back duty:** step 6 and criterion 5.
**Non-goals:** choosing a runtime for an organization, editing host settings, new tracker integrations, publishing packages, or claiming every Node release was tested.
**Operator-review assumptions:** no new operator steps are required for the fixture or synthetic live qualification. Organization authentication and host restrictions remain locally qualified by that instance. Reopen the selected range on an observed unsupported API or new operator requirement.
