# WO-145 — Tinkerer, first experiment: an optional support has the executor state and run at most one small economy experiment per order, three trial orders record what it cost and what it changed, and the record decides whether it stays equipped (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One new optional support in the compiled
contributor loadout, off by default, with its generated role text; no
kernel, schema, gate or hook change. Assigned at activation under the
standing opt-out default.
**Cost:** adds, only while the support is equipped, one paragraph of
executor role text (bytes reported by the executor against the 24,576-byte
ceiling) and at most one experiment per trial order, capped at 900 s of
wall-clock and recorded with its tokens where a counter is available. Adds
one decision-record kind (`experiment`) and no gate, hook, key or recurring
check. Names no removal in advance: whether an experiment pays is the
question. The dated acceptance for adding cost without a removal is the
operator's direction of 2026-09-11 (prioritize a bounded experiment) and
2026-09-19 (start with efficiency and speed). Wall-clock, tokens and
context bytes of the order itself are unknown until run.
**Nomination provenance:** operator ideation of 2026-09-09 and 2026-09-11
(05-pattern-library.md §Candidate — Tinkerer / Scientist, carried as
`FUP-fc4158d3207e495d` through four planning passes unselected); the
operator's 2026-09-19 answer in this pass, captured verbatim in ignored
intake: consider the aspects of quality from _Zen and the Art of Motorcycle
Maintenance_, starting with efficiency and speed; the founding ledger entry
"Books-as-quality-agents" (each aspect of quality becomes an atomic
single-minded checker). Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** none open. WO-126 (the ideation's origin and the decision
record contract) is closed.
**Recommended placement:** lane pair with WO-090, whose surfaces (product
07's structure, the security document, the playbook) this order does not
touch. It edits `packages/skeleton/src/loadouts/` (one support and its
equip point), the regenerated bundle and product 05. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the decision-record contract the experiment records use"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 05-pattern-library.md §Candidate —
Tinkerer / Scientist (the support, the separate modifier, the adaptive
pressure proposal and its required comparisons); 07-execution-guide.md
§Candidate — recurring review of implementation alternatives and
§Goal-aligned decisions; `docs/evidence/WO-126/ideation-alternatives.md`;
`docs/lineage/inspirations.md` (the _Zen and the Art of Motorcycle
Maintenance_ row); `packages/skeleton/src/loadouts/contributor.ts` (how a
support is declared, equipped and lowered to role text);
[the planning document](../planning/outstanding-cleanup-2026-09-19.md) §10.

**Objective:** The question: when an executor is asked, once per order, to
name one place where a small experiment could make the order's own work or
a recurring repository step cheaper in seconds, tokens or commands, and to
run it inside a fixed budget or decline it with a reason, does that produce
accepted improvements worth more than the experiments cost? The decision it
informs: whether the support stays optional, becomes equipped by default for
executors, or is withdrawn; and which aspect of quality the next experiment
takes.

**Observed gap (dated 2026-09-19, `main` at `3b3533f8`):**

- The candidate has been requested twice by the operator and selected by no
  planning pass; no support, modifier or experiment record exists
  (`git grep -i tinkerer -- packages scripts` finds nothing).
- The one recorded instance of the behavior was accidental: questioning the
  Python prerequisite during WO-126 exposed a cheaper Node-only build.
- The book's aspects of quality are thirteen: unity, vividness, authority,
  economy, sensitivity, clarity, emphasis, flow, suspense, brilliance,
  precision, proportion and depth. Economy is the one the operator starts
  with; the repository records none of the others as a mechanism yet.

**Design (scope discipline):**

- **One support, off by default.** Equipped, it adds one instruction to the
  executor's role text: before implementation, name at most one eligible
  economy opportunity; state the question, the credible alternatives, the
  observation that would decide and the budget; run it inside the budget or
  decline it with a reason; record an `experiment` decision with its outcome
  (`adopted`, `kept-current` or `inconclusive`), its measured cost and its
  measured effect with the commands that show both. Declining and keeping
  the current method are valid outcomes. The support grants no authority:
  an experiment uses only what the order already allows.
- **Three trial orders, named by the operator at activation** from the
  queue, at least one of them a packages order and one a scripts or
  documents order. No adaptive pressure is applied in this slice; the
  record keeps the fields a later comparison needs (date of the last
  adopted improvement, experiments since, each outcome), so an adaptive
  modifier can be judged against this fixed cadence later.
- **Pre-registered reading.** After the third trial order the decisions
  file totals experiment cost and the recurring saving of each adopted
  change, in seconds and tokens per order affected. Equipped by default is
  proposed only if at least one adopted change's saving over the next ten
  orders exceeds the whole trial's experiment cost and no trial order
  records a regression from an experiment. Otherwise the support stays
  optional, or is withdrawn if all three are declined or inconclusive.
- **The other twelve aspects are recorded, not built.** Product 05 lists
  them as the dimensions later experiments may take, each needing its own
  measure before it is selected.
- **Declined alternatives, recorded:** the adaptive modifier first (nothing
  to adapt from without a baseline); a periodic or probabilistic trigger
  (one per order is the simplest schedule that yields a record); a checker
  agent per aspect (the founding idea; larger than a first experiment and
  subject to the subagent cap); equipping every role (the executor is where
  method choices are made).

**Deliverables:** the support and its equip point; regenerated bundle; the
`experiment` decision kind in the decisions generator; product 05's note;
the trial record.

**Acceptance criteria (all required)**

1. Fixture: with the support off, every role's generated text is
   byte-identical to the release before this order; with it on, only the
   executor's text changes, and the manifest names the support.
2. The decisions generator accepts an `experiment` record with question,
   alternatives, budget, cost, effect, outcome and reopening condition, and
   refuses one without a measured cost or with an effect that names no
   command.
3. The order's own execution is the first trial: its decisions file holds
   one `experiment` record, run or declined, inside the 900 s budget.
4. Write-backs land: product 05 (the candidate gains a dated note: first
   experiment allocated, economy first, the thirteen aspects with the book
   as their source, the adaptive modifier still open); the decisions file
   names the two further trial orders the operator chose and where their
   records will appear; the register row is updated by the next planning
   pass from that record.
5. `harness check` passes; `npm test` green; `git diff --check` clean; no
   new dependency; the executor's cold-start total with the support on is
   recorded.

**Evidence gate:** the fixtures; the first experiment record; `npm test`
once at final review. The third trial order's record is the reopening
observation: the next planning pass reads the totals and applies the
pre-registered reading.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** the adaptive pressure modifier and its bad-luck protection;
any aspect other than economy; exploration outside the order being
executed; a new agent, gate, schedule or hook; any authority an order does
not already carry.

**Operator-review assumptions**

1. 900 s per experiment is the right first budget.
2. The executor is the right first role.
3. Three orders are enough for a first reading; the operator names them.
4. "Economy" is the book's name for what the operator called efficiency and
   speed.
