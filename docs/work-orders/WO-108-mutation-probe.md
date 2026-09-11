# WO-108 — Mutation evidence campaign for the current kernel, compiler, and skeleton — v0.13.1

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** Codex (any capable tier); any capable model may substitute. State the model and effort actually run in the result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** internal tooling/evidence patch, application `v0.13.1`. No exported runtime, package version, or schema change. Base: published `v0.13.0`, commit `3dc19b7342ad03662172cf86663f406b96a43db4`. Publication requires the ordinary later final-review/release-close dispatches.
**Depends on:** WO-011 merged; the pinned base also contains WO-004, WO-008, the worker/verification/feedback implementations, and Beacon senses.

## Operator scope amendment — 2026-09-06

During `resume: next`, the operator authorized the recommended preflight repairs and instructed the executor to adjust this order for the repository as it exists today. This amendment supersedes the original adjacent-order scope, its unassigned release header, its single-control-slot assumption, its existing-document freeze, and its exhaustive-run expectation. The original objective and survivor/non-fix boundary remain.

The worktree lacked `node_modules` at handoff, and the initial build failed on missing Node type definitions. Offline provisioning from main's existing dependencies is authorized after matching the four installed package versions to the lockfile; workspace links must resolve inside this worktree. The generated work-order index is now part of the normal lifecycle evidence gate. The release assignment above completes the missing activation preflight under the operator's release default; no published target is moved.

The current source census has 2,901 conservatively enumerable candidate sites, and an unmutated scratch build ran all 281 shipped tests in about 43 seconds. An exhaustive campaign would consume many hours. Declare and completely measure a deterministic 32-site campaign: all eight historical compiler probes, six kernel sites, six current compiler sites, and twelve current skeleton sites. Preserve the full candidate census and exact selection algorithm so later orders can choose further campaigns without mistaking this sample for whole-codebase coverage. Selection precedes verdicts and cannot discard compile kills, timeouts, or inconvenient survivors.

## Briefing and objective

Read the execution guide's Discipline, Model-specific notes, and ideation receipt rules; product 03 §Corpus policy; ADR-0002 §Amendments; and these ledger anchors:

- “A green runner over an absent suite is not evidence.”
- “Tests clean only artifacts they created inside owned fixtures.”
- The WO-003 closeout observation: the blocking crash-recovery evidence defect was found by deleting the recovery behavior and seeing its supposed test stay green.

Build a deterministic, dependency-free mutator using Node builtins and the already provisioned Git/TypeScript/Node toolchain. Quantify what the existing kernel, compiler, and skeleton tests detect at the selected sites. Every survivor is a future investigation with an exact patch and runnable reproduction; do not add a shipped assertion or behavior fix to kill it here. Surviving candidates may be equivalent or outside exercised inputs and must not be labeled proven production defects.

## Authority and isolation

- One writable coding agent in the existing `wo-108` worktree. Preserve the operator's initial lifecycle changes. No branch commits before passing final review; no push, PR, merge, tag, deployment, package installation, account setting change, or destructive Git operation during execution.
- Implement under `corpus/mutation/`; retain run evidence under `corpus/manifests/runs/`. Regenerate draft artifacts until the first measured campaign; after that the site manifest and policy are pinned and the kill matrix is append-only. Findings and summaries are reproducible projections. Delete only material inside self-created, provenance-validated temporary roots.
- All source mutation occurs in those temporary roots. Copy the committed base's offline context, including shared scripts and evidence consumed by today's tests. Exclude ignored intake and ambient untracked files. Rebuild from fresh output, provide local workspace links, and keep fixture Git refs/writes separate from the operator checkout. Tests may read base Git objects but cannot acquire a writable Git directory in the source checkout.
- Existing shipped `packages/*` source, tests, manifests, and fixtures remain unchanged. No mutation framework or new dependency is authorized. Root `package.json` may expose corpus commands and run the runner's self-tests in `npm test`; it may not change shipped behavior or dependency declarations.
- Update current factual reader surfaces: `corpus/README.md`, root README, this work order, the planning map, product 03's corpus policy, and applicable lineage. Normal per-order control appends, generated control/index projections, checkpoint refs, and independent numbered verification/final-review artifacts follow the current lifecycle guide. The ideation breakout below adds its named documentation surfaces to the independent review subject.

## Campaign contract

1. Enumerate single-site comparison swaps, condition inversion/neutering, arithmetic swaps, numeric off-by-one, statement/early-return deletion, trace/reason string perturbation, and ordered-array deduplication. Favor type-preserving sites. A crude lexical enumerator may omit uncertain syntax; document its limits, including opaque regexes and templates. Enumeration and selection must regenerate byte-identically.
2. Pin the base, complete candidate census, selected sites, exact patches, toolchain, selection rule, per-mutant timeout (120 seconds), and per-session budget (45 minutes) before execution. A normal campaign targets all 32 selected sites. An interrupted/budget-limited session records its exact executed prefix and next site and resumes without rewriting evidence; an incomplete campaign is not implementation-ready.
3. Before every session or reproduction, force-build an unmutated scratch snapshot and run every nonempty kernel, compiler, and skeleton suite. A red, empty, missing, malformed, or timed-out baseline refuses before any mutant verdict. Do not reuse ignored dist output or another checkout's compiled workspace.
4. For each selected site, create fresh owned scratch, apply exactly one patch, run `tsc -b --force`, then the three shipped Node test suites within the declared timeout. Stop the process group on timeout. Record `killed-by-compile`, `killed-by-test` with named killing tests, `survived`, or `timeout` with its phase, plus duration and immutable site/policy linkage. Infrastructure failures without a valid verdict refuse; they do not become kills.
5. Report killed-by-test versus survived only over conclusively compiled mutants. Report compile-kill rate separately as enumeration noise; disclose timeouts and exclude them from that denominator. Package/operator breakdowns are observations of this selected campaign, with counts and limitations, not capability rankings.
6. Every compiled survivor gets a stable numbered finding, exact patch, working reproduction command, and the acceptance claim/local behavior requiring investigation. Reproduction rechecks the baseline and does not append to the matrix. Remeasure historical survivors against the current suite.
7. Synthetic self-tests must expose known compile/test kills, known survivors, all eight historical compiler mutation shapes, red-baseline refusal, absent suites, timeout descendant cleanup, scratch provenance, deterministic enumeration, manifest/source drift, and append-only resume/corruption refusal. Do not test the runner solely with mocked subprocesses.

## Historical compiler probes retained for remeasurement

Provenance: operator scope extension on 2026-09-03, backed by WO-008 `VER-001` findings F3–F7 and `FINAL-001` §Mutation re-drill. These eight shapes survived the then-current compiler/skeleton suite; that is historical evidence, not this campaign's verdict.

| Seed | Site | Single-site mutation | Claim to investigate |
| --- | --- | --- | --- |
| 1 | compiler `compile.ts`, tag compatibility | force compatibility true | tag rejection in link checking |
| 2 | `compile.ts`, ambiguous support branch | neuter tie guard, preserving narrowing | equal-precedence rejection |
| 3 | `compile.ts`, active capabilities | empty missing-capability filter | active-mechanic capability check |
| 4 | `compile.ts`, duplicate diagnostics | delete insertion with an empty block | duplicate-id rejection |
| 5 | `compile.ts`, socket budget | threshold above possible array length | socket-budget overflow rejection |
| 6 | `normalize.ts`, explicit pipeline | wrap ordered array in a Set | pipeline multiplicity retention |
| 7 | `normalize.ts`, identity | empty update laws | round-trip content retention |
| 8 | `compile.ts`, support costs | override prompt tokens with zero | faithful cost emission |

The historical drill also found a changed compiled WorkOrder objective was detected by one skeleton assertion. This remains contextual evidence; the campaign does not assume that detection count still holds.

## Deliverables and executable gate

- `corpus/mutation/mutate.mjs` and bounded supporting modules, with runner self-tests.
- `candidates-<base>.jsonl`, the full conservative census; `sites-<base>.jsonl`, the selected campaign; and `policy-<base>.json`, the pinned environment, strategy, and bounds.
- `kill-matrix-<base>.jsonl`, append-only measured results; `findings-WO-108.md`, generated survivor investigations; and a concise corpus README/outcome recording evidence, limitations, selection, and preflight deviations.
- `corpus/manifests/runs/WO-108-<base>.log`, the append-only campaign transcript, plus captured executable gate and path-discipline evidence.
- Current documentation and the ideation receipt below, reviewed in the same subject.

Run `npm run build && npm test`, then the runner's real synthetic self-tests (included in `npm test` once wired), then `node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --run-all`. Check manifest regeneration byte-for-byte, matrix cardinality/consistency, every survivor's reproduction, and generated findings/totals. Capture `git status --porcelain` and inspect the complete diff to prove the amended path boundary. A read-only corpus check should automate the recurring artifact checks.

Only after all 32 selected sites have honest verdicts and the gate passes, record `implementation-ready` with actual harness version and operator-attested model/effort. Independent verification remains a later actor's dispatch; do not create its report during execution.

## Ideation breakout receipt — implementation consequences (2026-09-06)

**Authority and raw source:** the operator's `ideation:` message explicitly opens the full capture/synthesis pipeline. Its unedited source is in the main control-plane checkout's ignored `docs/intake/notes/WO-108-intervention-consequences-2026-09-06.md`. No worktree-local raw copy requires reconciliation.

**Clean Room treatment:** ordinary raw ideation, synthesized through Shape-First Synthesis with public vocabulary and provenance. The source is an operator-recalled fictional situation, with no employer material or credentials. Plot mechanics are not a factual dependency; no literal scene reconstruction or copied dialogue enters product docs.

**Promoted understanding:** a beneficial suggestion can produce a harmful implementation even when the executor complies literally. Preserve the intended outcome through method selection and proportionate observation of delayed side effects; revise the method or monitoring without treating that failure as proof that the original intervention was unjustified.

**Surfaces:** append-only lineage entry “A justified intervention still needs consequence-aware execution”; product 05 §Candidate extension — implementation and delayed consequences, with an entry from the existing 5S section; product 03 §Agent-originated product suggestions links the proposal-to-execution distinction. The publication audience/status index labels the extension `vision`, both edition outlines mention its candidate status, and their source locks are refreshed after reading the changed source. This receipt records the scope extension; no runtime mechanism, schema, universal approval gate, monitoring schedule, or new work order is selected by the analogy.

**Open choices and review:** a future bounded scenario should determine whether this extends the existing intervention support or composes separately, which observation is sufficient, who owns it, and when it expires. The independent verifier and final reviewer must check source treatment, traceability, candidate status, consistency with existing intervention/authority rules, links, and absence of accidental implementation claims. No executable helper was created for this breakout.
