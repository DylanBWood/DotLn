# WO-108 — Mutation probe of the existing kernel and skeleton evidence suites (version assigned at activation)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, the planner MUST rewrite this H1 to carry exactly one
strict `vX.Y.Z` — `scripts/release.mjs` refuses any work-order heading without
exactly one at close — and MUST pin the close disposition: either a version
strictly below the latest published tag (the release contract's honest
no-release path; close prints "no release tag is due") or an
operator-authorized, dated retiming note. Never an unauthorized patch between
the reserved v0.2.2 (WO-005) and v0.2.3 (WO-006) rungs. Expected class:
internal tooling/evidence only.
**Series note:** the WO-10x ids are a reserved adjacent series for autonomous
grind work, parallel to the WO-005..WO-011 mainline. Numbering is provisional;
the operator may renumber at activation.
**Depends on:** WO-004 merged — branch from `origin/main` at or after the
v0.2.1 close; the kill matrix is keyed to that base commit. Independent of the
mainline and of the other adjacent orders.

**Cites (read these sections):** docs/lineage/idea-ledger.md adopted entries
"A green runner over an absent suite is not evidence" and "Tests clean only
artifacts they created inside owned fixtures" (§WO-004 lifecycle hardening
additions — the test-hygiene provenance rule: a test owns a uniquely created
fixture root and validates it before recursive cleanup; cleanup authority
follows provenance), plus the WO-003 closeout note (77 candidate findings; the
one blocking defect was a crash-recovery test that stays green with the entire
recovery path deleted, caught "only because the verifier mutation-tested
rather than read"); 07-execution-guide.md §Discipline (precedence rule,
evidence gates) and §Model-specific notes; 03-architecture.md §Corpus policy
(the layout this order extends — see Corpus-layout note); ADR-0002
§Amendments discipline (no Stryker-class dependency — the mutator is in-repo,
node builtins only).

**Objective:** Quantify evidence thinness across the shipped codebase. Build a
crude, deterministic, dependency-free mutator and run the existing kernel +
skeleton suites against every mutant: (a) mutation operators — comparison
swaps (`<` ↔ `<=`, `===` ↔ `!==`), boolean-condition inversion,
arithmetic swaps, numeric-literal off-by-one, statement/early-return deletion,
string-literal perturbation in trace/reason strings — applied ONE mutant at a
time at a single syntactic site, enumerated deterministically (the site list
IS the manifest; no randomness), with the enumeration biased toward
TYPE-PRESERVING mutations so the matrix is not dominated by compile-kills;
(b) per mutant: copy the offline build context into a fresh mktemp scratch
root the mutator itself creates and validates (per the cited provenance rule),
apply the single patch, run `tsc -b --force` and the kernel+skeleton
`node --test` suites with a per-mutant timeout, and record the verdict
{killed-by-compile, killed-by-test (naming the test), survived, timeout};
(c) an append-only machine-readable kill matrix (mutant id, file, line,
operator, verdict, killing test, duration) keyed to the base commit; (d) every
SURVIVED mutant becomes a numbered finding with its exact patch and
reproduction command — the map of where a behavior change goes undetected by
current evidence. Summary statistics and any thinness ranking MUST be computed
over compiled mutants only (killed-by-test vs survived); the killed-by-compile
rate is reported separately as enumeration noise, never presented as suite
strength. Survivors are findings for future evidence-hardening orders, never
fixed or "covered" here.

**Authority (bounded):**
- MAY create new files only under `corpus/mutation/` and
  `corpus/manifests/runs/`, plus `corpus/README.md` if absent (Corpus-layout
  note). All mutation happens in self-created, provenance-validated mktemp
  scratch roots; those are the only material ever deleted.
- MUST NOT modify any existing repo file — `packages/*` src and test,
  `scripts/`, `package.json`, root `tsconfig.json`, all of `docs/`. Exempt
  from this clause is the standing lifecycle machinery when the order runs in
  the control-plane slot: appends to `docs/control/resume.jsonl` made by
  `scripts/resume.mjs` transitions, the regenerated `docs/control/current.md`
  projection, checkpoint refs under `refs/dotln/checkpoint/...`, and the
  numbered `docs/verifications/WO-108/VER-NNN.md` (and final-review)
  artifacts. Ledger duty is waived by this clause (precedence rule); note the
  skipped duty in the result as an open question.
- MUST NOT add tests to the shipped suites to kill survivors (a future order's
  scope, informed by this matrix); MUST NOT install any mutation-testing tool
  (zero new dependencies; node builtins only).
- Bounded runtime: the mutant-site enumeration and per-mutant timeout are
  declared in the manifest up front; if the full matrix exceeds the session,
  the append-only matrix records exactly which mutants ran and the stopping
  point — partial-but-honest beats complete-but-claimed. The run is resumable.
- No external effects: no push, PR, tag, publish, install, config mutation, or
  destructive git.

**Corpus-layout note:** `corpus/` does not exist yet. 03-architecture.md
§Corpus policy names `corpus/sanitized|fixtures|manifests` for the sanitized
source/incident corpus (provenance, retention, transcript-handling — the
ledger's "Corpus hygiene" entry); it does not reserve that tree for generated
test corpora. This order EXTENDS the layout with machine-generated evidence
material (`corpus/mutation/`, `corpus/manifests/runs/`). Whichever adjacent
order lands first creates `corpus/README.md` distinguishing generated evidence
corpora from policy-governed sanitized incident material so a future genuine
corpus-policy consumer does not collide. Record as an open question in the
result that a later doc pass must sync 03-architecture.md §Corpus policy with
the extended layout — this order has no `docs/` authority.

**Isolation & control plane:** one writable agent in its own worktree started
from the clean main checkout. The control plane tracks one active work order.
Default mode is in-slot: the operator activates via
`npm run worktree -- start WO-108 docs/work-orders/WO-108-<slug>.md` between
mainline activations and the standard phases apply (implementation-ready →
verify → final review → release close under the pinned disposition). If the
operator instead runs this outside the slot as explicitly sequenced adjacent
work, they must name the closeout path at activation — at minimum a numbered
independent verification artifact, a final review, the ordinary PR path, and
an explicit no-release disposition. That choice happens at activation, never
mid-flight.

**Preflight (operator, before handoff):** node_modules provisioned in the
worktree (the recorded Codex sandbox is network-disabled; `npm ci` cannot run
mid-flight); `npm run build && npm test` green at the base commit — a red
baseline invalidates every verdict, so the mutator refuses to start unless the
unmutated suite passes first (this refusal is itself a required, tested
behavior). The mktemp scratch builds need the workspace context reachable
offline: the mutator copies `package.json`, the tsconfigs, and `packages/`
into scratch and links or copies `node_modules` (TypeScript included) — a
packages-only copy does not compile. Fully offline and model-invocation-free
after handoff.

**Deliverables:**
1. `corpus/mutation/mutate.mjs` — the deterministic mutator/runner:
   type-preserving-biased site enumeration, single-patch application in
   provenance-validated mktemp scratch with the full offline build context,
   suite execution with timeout, verdict recording, resumable append-only
   output, and the green-baseline refusal precheck.
2. `corpus/mutation/sites-<commit>.jsonl` — the full enumerated mutant-site
   manifest (generated, deterministic, byte-identical on regeneration).
3. `corpus/mutation/kill-matrix-<commit>.jsonl` — append-only per-mutant
   verdicts with durations and killing tests.
4. `corpus/mutation/findings-WO-108.md` — one numbered finding per COMPILED
   surviving mutant: exact patch, site, reproduction command, and which
   shipped acceptance claim it undermines.
5. `corpus/mutation/wo108-selftest.test.mjs` — mutator self-tests on a tiny
   synthetic module with planted known-killable and known-survivable mutants,
   plus the green-baseline-refusal test (a small script is not an
   evidence-free note).
6. `corpus/manifests/runs/WO-108-<commit>.log` — captured run transcript with
   totals, the killed-by-compile rate reported separately from the
   compiled-mutant statistics.

**Acceptance criteria (all required):**
1. The site manifest is deterministic (regeneration byte-identical) and its
   total equals the kill matrix's row count, or the matrix honestly records
   the executed subset with its stopping point.
2. Every matrix row carries a verdict with a killing test or a survivor
   finding; the transcript corroborates the totals; all summary statistics are
   computed over compiled mutants only, with the compile-kill rate reported
   separately.
3. Every compiled surviving mutant has a numbered finding with a working
   reproduction command.
4. The mutator self-tests pass, including planted-survivor detection and the
   green-baseline refusal.
5. No file outside `corpus/mutation/`, `corpus/manifests/runs/`,
   `corpus/README.md` (if newly created), self-created mktemp scratch roots,
   and the exempt lifecycle artifacts was created or modified — a captured
   `git status --porcelain` is part of the evidence.

**Evidence gate (executable):** `npm run build && npm test && node --test
corpus/mutation/wo108-selftest.test.mjs && node corpus/mutation/mutate.mjs
--commit <base> --run-all`, transcript captured under
`corpus/manifests/runs/`, followed by `git status --porcelain` captured to
prove path discipline.

**Non-goals:** fixing survivors or adding killing tests (a future
evidence-hardening order consumes this matrix); mutating `scripts/` bash or
the control plane (out of scope to bound runtime; the execution guide already
names separate hardening candidates there); adopting Stryker or any mutation
framework (dependency rule); interpreting the matrix into capability-level
claims (WO-005's lane, via admissible evidence links); root test-script
wiring; docs/product or ledger write-backs.
