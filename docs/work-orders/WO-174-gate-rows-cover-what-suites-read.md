# WO-174 — A passing gate row stands for what its suites read and execute: product cases that read documentation run in the document gate, and `npm test -- --review` selects every machinery suite that imports or spawns a changed file (v0.58.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Test tags, one document-gate task, one
read guard on the product package suites and one closure check over the
runner's source lists; no product runtime behavior, control-event schema,
reuse key or selection rule changes. Assigned at activation under the
standing opt-out default.
**Cost:** adds one read observation to the product package suites (a
preload that records which tracked paths a case reads; the executor
measures its overhead on the console suite and records it), a
`kernel-docs` task in the document gate, the re-tagged cases' run time
moved from the product gate to the document gate (unmeasured; the executor
records both gates before and after), one closure check in the
runner-fixtures suite, and whatever `npm test -- --review` gains from the
repaired source lists (criterion 6 records it). Removes, measured on the
subject `feb7a92e` by REVIEW-004 and reproduced by its blinded refutation:
a reused or publication-bound `npm test` row whose suites fail on the
current bytes (replacing one bold term in product 02 left the gate code
identity unchanged and turned a kernel case from ok to not ok, and the
document gate runs no kernel suite); a `--review` that passes a mutant of
`scripts/harness.mjs` because the only suite that executes it is not
selected; and the hand upkeep of `machinerySources`, which six orders
patched after the fact (WO-157, WO-159, WO-163, WO-169, WO-171, WO-173).
Re-mints: none on the preferred route (`scripts/test-runner.mjs`,
`scripts/lib/gate-reuse.mjs`, the runner fixtures and the package test
files are not registered evidence sources).
`packages/skeleton/src/gate-evidence.mjs` is a registered source of the
authority, feedback and harness editions; an edit there owes each stale
edition's deterministic re-mint or carry and is taken only with a recorded
reason. No judged feedback source is named, so no live episode.
Wall-clock, tokens and context bytes of the order itself are unknown
until run.
**Nomination provenance:** the operator's dispatch `planning: entropy
reducer` of 2026-09-30, captured in ignored intake (SHA-256 in the ledger
section); [REVIEW-004](../instance/entropy-reducer/runs/REVIEW-004.md)
findings ER4-001 and ER4-002, which survived their blinded refutation,
and the filed packets `gate-identity-covers-suite-inputs` and
`machinery-selection-follows-imports` as design records
([planning document](../planning/entropy-review-004-2026-09-30.md) §4 and
§5). Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: repository records only; no stop condition.
**Depends on:** WO-173 merged (the reuse lookup whose rows this order
makes true; closed, v0.53.2); WO-132 merged (selection by declared
sources, which stays the rule; closed, v0.18.0).
**Recommended placement:** paired with WO-058 at the head. This order
edits `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs`, a new
preload under `scripts/lib/` and case names in `packages/kernel/test/` and
`packages/console/test/`; WO-058 edits
`packages/compiler/src/verification.ts`,
`packages/skeleton/src/verification-protocol.ts`, their tests, products 02
and 10, the evidence editions and the console's pins. Disjoint primary
surfaces and no hard edge. Both may touch
`packages/console/test/console-commands.test.ts` (WO-058 its pinned
values, this order its case names), which the second integration merges.
It closes before WO-059 starts, since WO-059 registers a package suite in
`scripts/test-runner.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-173",
    "relation": "satisfied-by-close",
    "reason": "the npm test reuse lookup and the handoff's gate claims"
  },
  {
    "workOrderId": "WO-132",
    "relation": "satisfied-by-close",
    "reason": "one product gate keyed by code identity; machinery selected by declared sources"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity` and its comment, WO-115 D026);
`scripts/lib/gate-reuse.mjs` (`coveringGateCheck`);
`scripts/test-runner.mjs` (`machinerySources`, `changedMachinery`, the
package suite rows with their `[document]` skip and name patterns, the
reuse lookup); `scripts/test-runner.test.mjs`;
`scripts/test-evidence-sources.mjs` and `scripts/lib/evidence-sources.mjs`
(`relativeImports`, `unregisteredEvidenceImports`: the import-closure
precedent of WO-157 item 12);
`packages/kernel/test/ac7-readme-map.test.ts`;
`packages/console/test/console-commands.test.ts`; `scripts/test-harness.mjs`
and `scripts/harness.mjs` (`evidence --wait`); product 07 §Discipline (the
paragraphs on the product gate's identity and on `--review`);
`docs/evidence/WO-173/decisions.md` D003 and D018; REVIEW-004 ER4-001 and
ER4-002 with their reproduction commands; the two packets under
`docs/proposals/`.

**Objective:** a passing `npm test` row, reused or bound to a publication,
means the suites would pass on the bytes they read, and a green
`npm test -- --review` means every machinery suite that executes a changed
file ran.

**Observed gap (dated 2026-09-30, `main` at `feb7a92e`):**

1. `gateCodeIdentity` leaves out every path under `docs/`, `.claude/` and
   `.agents/` and every root Markdown file (`gate-evidence.mjs` line 679,
   read by this pass). The exclusion is deliberate: a key over the whole
   tree was wrong after every report write (WO-173 D003).
2. Product suites read those paths. The kernel suite's AC7 case reads
   `docs/product/02-domain-model.md`; the console product suite, with its
   `[document]` skip applied, read 456 distinct excluded paths, 446 of
   them in `console-commands.test` (REVIEW-004, measured under a read
   logger). Kernel and compiler have no `-docs` task; skeleton and console
   do (`scripts/test-runner.mjs`, read by this pass).
3. REVIEW-004's drill in a scratch clone: one bold term replaced in
   product 02, the identity unchanged, the kernel case red. The reuse
   lookup was read and not executed by the reviewer.
4. `harness-fixtures` does not declare `scripts/harness.mjs`, which
   `scripts/test-harness.mjs` names on 36 lines and spawns; the only suite
   that declares it is `harness` (observed by this pass with the runner's
   own table). REVIEW-004's mutant of the `evidence --wait` exit code
   selected `configuration-root` and `harness`, passed both, and failed
   the unselected `harness-fixtures` case.
5. `scripts/docs-check.mjs`, `scripts/lib/handoff-ledger.mjs` and
   `scripts/lib/plan-subject.mjs` are declared by no machinery suite
   (this pass, same table). Whether a suite executes each is for the
   check of criterion 4 to say.

**Design (scope discipline):**

- **Documentation inputs.** Preferred: a product-suite case that reads an
  excluded path carries the `[document]` tag and runs in the document
  gate, which every pass that edits documentation already runs and which
  every order's final criterion names beside `npm test`. Kernel gains a
  `-docs` task; compiler gains one only if a compiler case reads such a
  path. Admitted instead, per path and with the reason recorded: a path a
  product case must read in the product gate joins the identity as a
  declared input, only when reports, control logs and generated
  projections never write it. Adding the excluded trees to the identity
  wholesale is declined: it restores the rerun after every report write
  that WO-173 removed.
- **The guard.** The product package suites run under a read observation
  and the task fails when a case outside the tag reads a tracked path the
  identity excludes. It observes the run the gate already makes and adds
  no second run of the suites.
- **Machinery selection.** One check in runner-fixtures, after the
  evidence inventories' import-closure check: each machinery suite's
  entry file, its static first-party relative imports and the first-party
  script paths it spawns by literal path are covered by its declared
  sources or by an exclusion that carries a reason. The lists are then
  repaired until the check passes. Selection by declared sources stays
  the rule.
- **Declined alternatives, recorded:** always running the final review
  with `--again` (it pays the whole gate to avoid a tag); hashing the
  documents into the identity (above); a transitive import closure (it
  can select the two longest suites on most script edits; the executor
  may widen one suite's list on a measured reason); running
  `npm run test:machinery` at every final review (the cost WO-132
  removed); the untracked-source gap in the same key (register row
  FUP-7629e03c6573f5cb keeps its interim rule and its own condition).

**Deliverables:** the tags and the `kernel-docs` task; the read guard and
its fixture; the closure check, its exclusions and the repaired lists; the
three drill transcripts; the cost record; the write-back.

**Acceptance criteria (all required)**

1. With the guard in place, no product-suite case outside the `[document]`
   tag reads a tracked path that `gateCodeIdentity` excludes, except a
   path admitted as a declared identity input. The guard's set: reads
   through `node:fs` `readFileSync`, `openSync`, `readdirSync` and their
   promise forms, by the test process and by Node children that inherit
   its options. A read by a non-Node child (Git, a shell) is outside the
   set; the decisions list the non-Node commands the product suites spawn
   and what each reads of the excluded trees, from one observed run.
2. A runner fixture in which a product-suite case reads a path under
   `docs/` fails the task and names the case and the path; the fixture
   fails against the source at `feb7a92e`.
3. REVIEW-004's drill, repeated at the executor's base: with one bold
   term replaced in `docs/product/02-domain-model.md`, the gate code
   identity is unchanged, `npm run test:docs` is red on the re-tagged
   kernel case and the product package suites pass.
4. The closure check fails on a machinery suite whose entry file, a
   static first-party relative import of it or a first-party script it
   spawns by literal path is covered by neither its declared sources nor
   a reasoned exclusion, and names the suite and the path. Its set:
   literal import specifiers and literal script paths in the entry file.
   Transitive imports and paths built at run time are outside the set,
   and the check's output says so. It fails against the lists at
   `feb7a92e`.
5. After the lists are repaired, REVIEW-004's second drill, repeated at
   the executor's base: changing the exit code `harness evidence --wait`
   gives a failed row selects `harness-fixtures` under `--review`, and
   its evidence-wait case fails on the mutant.
6. For three single-file changes (`scripts/harness.mjs`,
   `scripts/lib/meta.mjs`,
   `packages/skeleton/src/worker-transport.ts`) the decisions record the
   machinery suites `--review` selects before and after, with their
   recorded durations. An increase above 120 s for the
   `scripts/harness.mjs` change is recorded as a decision naming the
   exclusion that would remove it and why it is applied or not; it fails
   no criterion.
7. Both gates' wall-clock before and after is recorded, with the number
   of cases re-tagged per package.
8. Write-backs land: product 07 §Discipline, the sentences on the gate's
   identity and on `--review`, edited in place within 400 bytes (the
   guide holds 1,341 bytes of headroom at this pass's subject);
   `docs/evidence/WO-174/decisions.md`; the decisions index; the register
   rows of ER4-001 and ER4-002 retargeted at close.
9. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the three transcripts (the fixture of criterion 2 and
the drills of criteria 3 and 5); the selection table of criterion 6;
`npm test -- --review` before `implementation-ready`, because
`scripts/test-runner.mjs` is a declared source of the runner-fixtures and
registrations suites, and again at final review. No live row.

**Write-back duty:** product 07, in place; the order's decisions with
sources and reopening conditions; the register rows. Record corrections
the same day as what was misread, meant and changed.

**Non-goals:** the reuse key itself and the rule that reports do not move
it; selection by declared sources; the untracked-source gap
(FUP-7629e03c6573f5cb, FUP-71602ec08bc81e9d); the gate marker with no
birth observation (FUP-3d6a8147368bdf1c); the output format of the
remaining Node suites (FUP-e821aa2ced3aa111); what any re-tagged case
asserts.

**Operator-review assumptions**

1. A case that reads documentation belongs to the document gate. Both
   gates are every order's final criterion since 2026-09-25, so a code
   change that breaks such a case is still caught before handoff.
2. The console's 446 reads are mostly live control state compared between
   two readers, and a given documentation edit may not change their
   verdict (the packet's dissent). The guard removes the question instead
   of measuring each case.
3. One order carries both findings because both repairs are in the
   runner and its fixture suite and neither can run beside the other.
