# WO-220 — Boarded follow-ups, batch 4: the resident, the vertical, the console, intake and triage, audit, the corpus lanes and the kernel's admission: every one of the 20 register rows listed below is fixed with a fixture case or declined with its recorded reason, the register shows it, and a row only the operator can decide leaves as an operator packet (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** assigned at activation from the fixes made (patch
unless a fix changes a command, flag, schema or refusal, which the decisions
name; then minor). A declined row changes no behavior.
**Cost:** adds the fixes and fixture cases the listed rows need, across
`packages/skeleton/src/vertical.ts`, `packages/skeleton/src/resident-state.ts`, `packages/skeleton/src/resident-host.ts`, `packages/skeleton/src/mission-check-source.ts`, `packages/skeleton/src/audit.ts`, `packages/skeleton/src/vertical-judgment-host.ts`, `packages/skeleton/src/source-change-host.ts` (`run`'s recovery observation, row FUP-49c4a5f7176252e7; a registered evidence source and a `FEEDBACK_SOURCE_PATHS` file, so its edit owes the re-mint and one live feedback episode), `packages/console/src/`, `packages/kernel/src/core.ts`, `scripts/docs-check.mjs`, the WO-103, WO-105 and WO-107 lanes under `corpus/harness/` and the fixtures the rows name; unknown until each row is triaged, and the README records
the per-row command and case. Removes no pending rows: the 20 rows were allocated at filing and already
count as closed (WO-218 D056), and the README records the register's pending
count before and after; at `7b8206f4` the register held 281 pending rows, 130
of them decision rows boarded by closed orders across 53 orders (the oldest
from WO-054, 2026-09-18), 88 of them follow-ups boarded in the week of
2026-10-13 to 2026-10-17 alone, and the rule that "the next order that edits
the surface" takes a row had delivered none of these 20 (corrected by the
2026-10-21 pass). Wall-clock: one triage per row plus the fixes; unknown until
run. Context bytes: this order's row list is read once. Commands: none
added. Tokens: unknown until run. Steps: 7. Re-mints: the
executor checks each edited file against `scripts/lib/evidence-sources.mjs`
(a registered source owes its edition's deterministic re-mint) and
`FEEDBACK_SOURCE_PATHS` in `packages/skeleton/src/feedback-audit.ts` (an
edited judged source owes one live feedback self-host episode on Codex
`gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, no
authorization needed, cost accepted); any edited declared machinery source
(`machinerySources` in `scripts/test-runner.mjs`) puts `npm test --
--review` in the final criterion, which names it already.
**Nomination provenance:** the 2026-10-17 standard planning pass
([planning document](../planning/standard-pass-2026-10-17.md) §4.6 and
§5), on the operator's direction of that day as the pass synthesizes it:
work orders that resolve every boarded, follow-up and reopened row rather
than leaving them to the next order that edits the surface. This order is
one of four cut by subsystem from the register's 130 pending decision rows
(`npm run plan -- followups --export`, revision `d6462e4d…`); the rows are
the register's own excerpts. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: repository records only.
**Depends on:** WO-219 placed before it (reference only; no hard edge).
**Recommended placement:** after WO-219 in the serial queue (position 6, after the four orders the 2026-10-21 pass filed for the fork's return to a working state); WO-217 closed as v0.89.0 on 2026-10-21; the operator may interleave the two remaining batches with the focus orders by one sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-219",
    "relation": "reference-only",
    "reason": "placed before this batch in the serial queue; no hard edge"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (the
Adjacent Repair boundary and the boarded-defect rule), §Verification review
and attack (routes), §Operator-opened planning pass (Retained planning
follow-ups); `docs/planning/followups.md` (dispositions and `--apply`);
each listed row's source decision, in full; the fixtures the rows name.

**Objective:** Every row listed below ends in a terminal register
disposition recorded by this order: `settled` with a fixture case that
fails without the fix, or `declined` with the recorded reason, or, only for
a choice the operator alone can make, `deferred` with an operator packet
in the handoff and a reopening condition naming this order's pull request.
No row is left `untriaged`, `open` or `allocated`. The listed rows were
`allocated` to this order when it was filed, and the register counts an
allocated row as closed, so the pending count does not fall by them; the
README records the count before and after and claims no fall (WO-218
D056: 158 before and after its application).

**Observed gap (dated 2026-10-17, main at `7b8206f4`):** the register
holds 281 pending rows, 130 of them decision rows boarded by closed orders
(`npm run plan -- followups --export`): each was met by a verifier or
reviewer, recorded under product 07's boarded-defect rule, and deferred to
"the next order that edits these surfaces", a planning pass or a repair
that never came; the oldest listed below dates from 2026-09-18. In the week
of 2026-10-13 to 2026-10-17, seven final reviews boarded 88 follow-ups and
the pending count rose from 247 to 281. The 20 rows of this
batch name the resident, the vertical, the console, intake and triage, audit, the corpus lanes and the kernel's admission:

- FUP-06abc143a1c52367 (deferred): WO-099-D016: Known limitation for planning, not repaired here: on a worktree whose untracked generated evidence exceeds the diff bound the cadence holds as unknown every pulse until a human answers. T ([source](../evidence/WO-099/decisions.md#wo-099-d016))
- FUP-165f9860f8f32a67 (deferred): WO-117-D007: Planning, before WO-118 relies on the live host for unattended supervision (document items may instead be taken by the WO-117 final review within its Boy Scout bound). B2: bound the passi ([source](../evidence/WO-117/decisions.md#wo-117-d007))
- FUP-2341c85c58331f3e (deferred): WO-103-D004: Allocate an audit-owned order to recognize truthful partial semantic-input refusal traces without fabricating missing inputs; cover missing state and missing predicateEnv and preserve rej ([source](../evidence/WO-103/decisions.md#wo-103-d004))
- FUP-2b9a8e696b38fb97 (deferred): WO-118-D018: Planner, before WO-083's run: make live status show how every resident-owned continuation ends. (F1) When a continuation's authority or wall budget expires between steps, either have the  ([source](../evidence/WO-118/decisions.md#wo-118-d018--final-review-follow-up-live-status-misses-how-a-resident-owned-continuation-ends))
- FUP-349058ac0342247d (deferred): WO-138-D012: In the next order that recollects a T1 matrix, declare minLength 1 on the ten T1 receipt fields in the emitted schema, keeping summary at 320, so the published contract equals the host va ([source](../evidence/WO-138/decisions.md#wo-138-d012--board-up-the-undeclared-t1-minimum-bound-named-by-ver-002-a1))
- FUP-3d4b39cd4b2c4a08 (deferred): WO-116-D008: Planning: nominate audit action classes for the resident's own events (episode dispatch and outcome, handoffs, mission holds, portfolio activation and console invocations), so the L0 rece ([source](../evidence/WO-116/decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold))
- FUP-49c4a5f7176252e7 (deferred): WO-199-D015: Type the source host's recovery observation the way the dispatch admission is typed. When run() re-observes an unreceipted committed result (the effect() and observe(before) calls after r ([source](../evidence/WO-199/decisions.md#wo-199-d015--verification-pass-ver-003-board-the-recovery-paths-untyped-host-refusal-which-a-refusal-coinciding-with-a-signal-now-reaches))
- FUP-4f8cd7989607ad3f (deferred): WO-142-D002: Authorize a resident replay order to key NoOp deduplication by reason, phase and arm generation in resident-host.ts and resident-state.ts, with old-log replay and restart-equivalence fixt ([source](../evidence/WO-142/decisions.md#wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity))
- FUP-5d48c4f3c2a3730d (deferred): WO-112-D061: Count subject-tied judgment failures (budget exhausted, deadline exceeded) toward a per-subject-hash limit like host faults, so only launch or reachability failures retry without a count. ([source](../evidence/WO-112/decisions.md#wo-112-d061--board-unbounded-retries-of-judgment-episodes-that-fail-identically))
- FUP-7c269a184f75e742 (deferred): WO-112-D046: WO-112 VER-005 boarded items: (a) bound fresh triage episodes and outward dispositions per review-loop invocation across inline items and bodies, ending in a typed stop that names the nex ([source](../evidence/WO-112/decisions.md#wo-112-d046--board-five-lower-review-loop-and-resident-items-from-the-ver-005-adversary))
- FUP-88c339c51cfc1933 (deferred): WO-199-D011: Make the witnesses step's browser scenario abortable by the run's signal and resumable on rerun: pass the round's directory as recoverFrom, or clear it, so a rerun after a signal or crash ([source](../evidence/WO-199/decisions.md#wo-199-d011--board-the-witnesses-steps-browser-scenario-which-the-abort-does-not-reach-and-whose-rerun-refuses-its-own-directory))
- FUP-89e29438bd71c524 (deferred): WO-189-D021: Front-page guard limits the corpus records: a generated block outside What runs today is judged only by its writer's check (WO-088 must list its block in the record and pin its content);  ([source](../evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice))
- FUP-8f0561e50754114f (deferred): WO-107-D010: Next order that edits the WO-107 lane, or the corpus-policy pass FUP-d093f77bd927f9dc names: decide this lane's after-base rule together with WO-105's. Archive the second collector revisi ([source](../evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes))
- FUP-b8440605da5a4eb2 (deferred): WO-112-D047: Label a stored intake or triage judgment record that parses and binds but fails current result validation at replay as a record refusal, not an episode failure, for intake as a bounded ho ([source](../evidence/WO-112/decisions.md#wo-112-d047--close-the-ver-005-classes-at-their-origin-one-judgment-failure-rule-admission-gated-preparation-and-own-registration-recovery))
- FUP-bcd4724fca7bff7a (deferred): WO-112-D053: Clarify the clock origin of preparation retry backoff when a forge read or model episode takes longer than its delay. Choose and document attempt-start spacing or a full post-failure cool ([source](../evidence/WO-112/decisions.md#wo-112-d053--board-the-preparation-retry-clock-choice-with-its-observed-contrast))
- FUP-c1d4be019802be0d (deferred): WO-103-D005: Allocate a kernel-owned order for structural CommandPersisted admission in packages/kernel/src/core.ts: validate required Command fields before pending outbox insertion, define malformed- ([source](../evidence/WO-103/decisions.md#wo-103-d005))
- FUP-d093f77bd927f9dc (deferred): WO-105-D012: Next order that edits the WO-105 corpus lane, or the first corpus-policy pass after it merges: decide how the lane behaves after its base. Either run its live comparisons against base sou ([source](../evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main))
- FUP-d22dc57e754ba35c (deferred): WO-103-D012: Next order that edits the WO-103 corpus or the guard's effect-pattern rules: add an authority pattern level whose denied list matches the effect and whose allowed list does not (for examp ([source](../evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests))
- FUP-e62d0d2771185a38 (deferred): WO-065-D008: Planning: implement the personal workflow delegation profile specified in product 05: bind Claude/Codex enabled-mode evidence, minimum three distinct meaningful subagent contributions per ([source](../evidence/WO-065/decisions.md#wo-065-d008))
- FUP-eeb25ea9315438ad (deferred): WO-118-D013: Planner, before WO-083's run: a starter resident whose portfolio actor has no bound execution hosts records ActorUnavailable whenever its cadence finds no draft or runnable continuation.  ([source](../evidence/WO-118/decisions.md#wo-118-d013--the-witnessed-run-carries-criteria-1-to-5))

**Design (scope discipline):** one batch per subsystem, so verification
judges one set of surfaces and one Preflight line, and each batch's
executor holds one context. Each row is read at its source, reproduced or
restated against the current source, then fixed with a case or declined
with its reason; the register disposition is the record, applied through
the checked `--apply` route, never prose. A row the executor cannot decide
within this order's surfaces (an authority the operator holds, a product
choice the operator reserved) leaves as an operator packet, deferred with a
reopening condition naming this order's pull request. Rejected: one order
for all 130 rows (axis: one subsystem per order; a verifier reading fifty
surfaces); leaving the rows to the next order that edits each surface (axis:
delivery; the record shows 20 rows that no later order took);
resolving by declining (axis: honesty of the triage; at most one third of
the listed rows may be declined, and each decline carries its NoOp reason
and reversal condition).

**Deliverables:** the fixes and cases of the steps; the register
dispositions; the decisions and README; write-backs where a fix changes a
product statement.

**Acceptance criteria (all required)**

1. For every row id listed above, `npm run plan -- followups --show <id>`
   reports a latest disposition recorded at or after this order's
   activation with status `settled`, `declined` or `deferred`; a
   `deferred` one names this order's pull request in `reopenWhen` and an
   operator packet of the same id in `docs/evidence/WO-220/handoff.md`;
   no listed row is `untriaged`, `open` or `allocated`.
2. Every `settled` row's disposition reason names a decision in
   `docs/evidence/WO-220/decisions.md` whose `evidence` names the
   fixture file, the case name and the control that shows the case
   failing with only that row's fix reverted and passing with it, recorded
   in `docs/evidence/WO-220/repair-controls.json` in the shape WO-218's
   repair filed (per control: the rows, the suite and command, the
   reversion by path, both arms' exit codes and the verdict), that case
   running under a suite the Preflight line names; or, for a row the
   current source already meets, names the command run at the base and
   its output. A case under a `node --test` lane command the Preflight line names counts
   as running under a named suite (the WO-103 and WO-105 lanes); a row whose
   recorded ask is only a document sentence is settled by a decision naming
   the changed file, its section heading at the base and the change, checked
   by `npm run test:docs` (receipt 050; the 2026-10-21 pass). A case that also passes at the base, or with the row's fix
   reverted, settles nothing (WO-218 VER-001 F1: three of five named cases
   passed at the base; D055's 91 paired controls were the repair, which
   VER-002 replayed whole).
3. Every `declined` row's disposition reason records what harm exists now,
   the evidence read and the reversal condition; the declined rows are at
   most one third of the rows listed.
4. `npm run plan -- followups --touching` over this order's changed files
   (its default, from the worktree) lists no row of this order's list that is
   still pending other than a row deferred under criterion 1, which the README
   names with its operator packet; a row of another batch or a candidate row
   it lists is left as it is and named in the README (rewritten by the
   2026-10-21 pass from receipts 046 and 050: the original form could not be
   met, because deferred and candidate rows naming these surfaces are pending
   and listed).
5. The README holds the before and after tables of step 1 and the
   after-table step, with the register's pending count before and after.
6. Write-backs land in place where a fix changed a product statement
   (step 6); `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; each re-mint and, where a judged
   source changed, the live feedback episode recorded.

**Preflight:** `npm test -- --only vertical` for the vertical and intake steps;
`npm test -- --only skeleton` for the resident and audit steps;
`npm test -- --only console` for the console steps;
`npm test -- --only wo107-schema` for the schema steps;
`npm test -- --only harness-probe` for the probe steps;
`npm test -- --only kernel` for the kernel admission step (3); `npm test -- --only wo107-schema` for the WO-107 lane; the WO-103 and WO-105 lane files under `corpus/harness/` (`wo103-*.test.mjs`, `wo105-*.test.mjs`), each as `node --test <file>` after `npm run build`, because no runner suite declares them; `npm test -- --only docs-check-fixtures` for the front-page guard row (rewritten by the 2026-10-21 pass from receipt 046);
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base (explicit tokens added by the 2026-10-18 pass, FUP-17266e5072d4a25a).

**Execution plan (the executor follows these steps in order; observed at `7b8206f4`, 2026-10-17):**

1. `docs/evidence/WO-220/README.md` (new): at the base, each listed row's id, its latest disposition and date, the surfaces it names and the commands the executor ran to reproduce it, written before any fix. Check: the README lists every row of this order.
2. The file each row's source decision names, among `packages/skeleton/src/vertical.ts`, `resident-state.ts`, `resident-host.ts`, `mission-check-source.ts`, `audit.ts`, `vertical-judgment-host.ts`, `source-change-host.ts`, `packages/console/src/`, `scripts/docs-check.mjs` and the WO-103, WO-105 and WO-107 lanes under `corpus/harness/`, taken one file at a time, each naming its function or export and its Preflight suite in the decisions; a row whose source names no file (a planning or operator question) goes to step 4's decisions as a decline to planning with its reason or as an operator packet (rows FUP-06abc143a1c52367, FUP-165f9860f8f32a67, FUP-2341c85c58331f3e, FUP-2b9a8e696b38fb97, FUP-349058ac0342247d, FUP-3d4b39cd4b2c4a08, FUP-49c4a5f7176252e7, FUP-4f8cd7989607ad3f, FUP-5d48c4f3c2a3730d, FUP-7c269a184f75e742, FUP-88c339c51cfc1933, FUP-89e29438bd71c524, FUP-8f0561e50754114f, FUP-b8440605da5a4eb2, FUP-bcd4724fca7bff7a, FUP-d093f77bd927f9dc, FUP-d22dc57e754ba35c, FUP-e62d0d2771185a38, FUP-eeb25ea9315438ad): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`vertical`, `skeleton`, `console`, `docs-check-fixtures`, `wo107-schema`, `kernel` for step 3, or the `node --test` lane command), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
3. `packages/kernel/src/core.ts` (rows FUP-c1d4be019802be0d): read each row's source decision in full, reproduce the recorded defect or restate the recorded question against the current source, then fix it with a fixture case that fails without the fix, or decline it with the recorded reason, and dispose the row with `npm run plan -- followups --apply` naming the case or the reason. Check: the suite that runs the step's cases, named for that step in the Preflight line (`vertical`, `skeleton`, `console`, `docs-check-fixtures`, `wo107-schema`, `kernel` for step 3, or the `node --test` lane command), under `node scripts/harness.mjs bounded --`; `npm test -- --review --list` prints suite names and protects only and is not a file-to-suite map.
4. `docs/evidence/WO-220/decisions.md`: one decision per disposed row or per cluster of rows fixed together, each naming the row ids, the chosen option, the rejected option, the fixture case or the decline reason, and the reversal condition; an operator packet for each row only the operator can decide, with its reopening condition naming this order's pull request. Then `npm run meta`. Check: `npm run meta -- --check`.
5. `docs/evidence/WO-220/README.md`: the after table (each row's final status, the case or reason, the command, the control) and the register's pending count before and after (`npm run plan -- followups`), with `docs/evidence/WO-220/repair-controls.json` written as each row is settled (criterion 2). Check: the README holds both tables and every settled row has a control.
6. Write-backs, in place, only where a row's fix changes what a product document states (the row's source decision names the document and section; re-read the heading at the base). Check: `npm run test:docs`.
7. Handoff: finish source edits; `npm run format` and `npm run sync` for stale generated artifacts; start one `npm test -- --review` in the background, never under the bounded wrapper, and await it with `node scripts/harness.mjs evidence --wait`; after it passes, complete `docs/evidence/WO-220/handoff.md`; run `npm run test:docs` once after the last document edit; then `npm run resume -- implementation-ready <flags>` (the sequence product 07 §Discipline revised on 2026-10-19; corrected by the 2026-10-21 pass).

**Evidence gate:** the Preflight suites; the register dispositions
(`followups --show` per row); `npm run test:docs`; the handoff gate.
No model run.

**Write-back duty:** criterion 6 and the write-backs step.

**Known issues and carry-ins:**

- Every listed row is a carry-in by id; the source decisions are the
  authority on what each asks.
- A row that another batch's fix resolves first is settled here by
  reference to that batch's decision, with the command that shows it.
- Line numbers and paths in the rows are observed at their own dates; the
  executor re-reads at its base.
- Receipt 046 (2026-10-17), written in by the 2026-10-21 pass: a `core.ts`
  admission fix keeps every replay-identity and scenario-oracle output
  unchanged or records the change beside the dependable-capability rows
  (criterion 2); the README names at activation which listed rows WO-083's run
  and WO-183 would hit (criterion 1); the compiled subject carries no row ids
  and the register's inflow continues, so the README's before and after counts
  are dated (criterion 1); criterion 4's original form could not be met, and
  the 2026-10-21 pass rewrote it (FUP-7f9a27e6ed6c44b3 names
  `packages/console/src/collect.ts` and FUP-069dff5d52d98e0d the WO-107 lane,
  both deferred candidates `--touching` lists).
- Receipt 050 (2026-10-20), written in by the 2026-10-21 pass: this batch
  enables WO-083's resident intent route and WO-183 through
  FUP-2b9a8e696b38fb97 and FUP-eeb25ea9315438ad, with no typed edge keeping
  them ahead if the queue is interleaved; each is settled by fixture or
  deferred with WO-083 and WO-183 named, and the decision reconciles WO-083's
  deferral of D013 and D018 (criterion 1). FUP-c1d4be019802be0d's
  CommandPersisted admission judges only new appends, never replayed events,
  with an old-log replay case (criterion 2). FUP-e62d0d2771185a38 is
  feature-sized and is declined to planning with its reason if it exceeds a
  fixture-backed fix (criterion 1).
- WO-219 runs first and edits `packages/kernel/src/core.ts` (its step 4) and
  `scripts/docs-check.mjs` (its step 23); this batch rebases on it and
  re-reads both at its base. FUP-89e29438bd71c524's generated-block listing is
  WO-088's carry-in (WO-088 Known issues, 2026-10-10 entropy pass), and WO-088
  is queued after this order: the executor settles or declines the row's other
  guard limits here and records in the decision that the generated-block part
  is WO-088's, naming that order as the reversal condition (the 2026-10-21
  pass).
- FUP-49c4a5f7176252e7 edits `SourceChangeHost.run` after `recoverTermination`
  in `packages/skeleton/src/source-change-host.ts`, which WO-204 (queued after
  this order) rewrites in its steps 5, 6, 14 and 22; WO-204 rebases on this
  order's change, and its recovery cases keep the typed
  `host-admission-<check>` refusal (the 2026-10-21 pass). The file is a
  registered evidence source and a `FEEDBACK_SOURCE_PATHS` file, so its edit
  owes the re-mint and the live feedback episode the Cost line names.

**Non-goals:** candidate rows of the register not listed above (ideas with
reopening conditions, 151 at the base), which planning disposes; rows of the
other batch (WO-219); new features beyond what a row asks; rewriting any filed
report.

**Operator-review assumptions**

1. At most one third of a batch's rows may be declined.
2. A row only the operator can decide leaves as an operator packet rather
   than blocking the batch.
3. The two remaining batches (WO-219, then WO-220) sit before WO-080; the
   operator may interleave them with the focus orders.
