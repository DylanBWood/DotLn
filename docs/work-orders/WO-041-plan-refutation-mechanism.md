# WO-041 — Plan refutation as a mechanism: a blinded episode that gates every planning pass on the vision (version assigned at activation)

**Model:** any capable model for the script and fixtures. The refuter episode
runs on the actual local transports and must state harness version, model,
and effort (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A control-plane command, a compiled
read-only loadout, a closed result schema, a receipt convention, and one
evidence-gate check; no exported runtime capability. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the 2026-09-06 phase-two redirect, from the
operator's correction ("there should have been some agent running in the
background, looking at what the plan was and said HOLD UP! We're not
actually going in the direction ... intended") and the founding corpus's
standing auditors, referees, and adjudicators, the Contra-Auguste mask, and
the Ex Machina rule that implementer and verifier are structurally separate
(ledger §Chat 002, §Chat 005; 00-vision.md §Inspirational sources;
synthesized, nothing copied). Planner-synthesized draft; the operator's
correction is preserved locally as a compaction-safety capture. Opaque
identifier, not a priority. The clean-room screen found no stop condition.
**Depends on:** WO-009 merged (the CLI transports and the worker host;
satisfied at `v0.10.0`); WO-023 merged (the Entropy Reducer identity, its
Contra-Auguste mask, and the architecture-and-semantics lens; satisfied at
`v0.5.0`); WO-010 merged (the blinded-episode host pattern; satisfied at
`v0.12.0`).
**Recommended placement:** lane 0, beside WO-038, with which it shares no
primary write surface; the two small orders form the first measured paired
wave. It gates the next planning pass, not execution, so it may float if
capacity is short. A recommendation, not a dependency token.

**Cites (read these sections):** 00-vision.md §The one-paragraph story, §The
core bet, §The differentiated interface, §Three horizons, one kernel, and
§Inspirational sources (Ex Machina; the Contra-Auguste mask); 13-uifa-roles.md
§UIFA tester (findings about the shape, not the software) and §The five
roles; 07-execution-guide.md §Operator-opened planning pass (the procedure
this order extends) and §Discipline (implementer ≠ verifier; disclose a
self-referential instrument); 05-pattern-library.md §Party topology (the
masks) and §Candidate — Beware of Naive Interventionism;
03-architecture.md §The agentic communication core;
`docs/instance/entropy-reducer/REFUTATION-PLAN.md` (blinding and selection
precedent); `docs/planning/phase-two-plan-2026-09-06.md` §Why the first
version drifted; `docs/planning/refutations/2026-09-06-phase-two-redirect.md`
(the manual first receipt whose shape this order mechanizes);
`packages/skeleton/src/loadouts/entropy-reducer.ts`, `worker-transport.ts`,
`verification-host.ts`; `scripts/work-orders.mjs` (`parseHeader`,
`parseSequence`); `docs/planning/capability-table.md`.

**Objective:** Make "does this plan serve the vision?" a question the
machinery asks before the operator has to. Add a command that compiles a
blinded refutation episode over the current planning horizon, dispatches it
through an existing transport under a read-only loadout, validates a closed
result that names for every planned order which vision thesis and capability
row it moves or whether it is machinery or drift, writes an immutable receipt,
and adds an evidence-gate check that refuses a planning pass without a
matching receipt or with an unanswered hold.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- The first phase-two pass wrote its own vision-alignment review and filed a
  horizon of process machinery; the operator caught the drift by hand. Code
  gets a blinded verifier by structural rule; plans, where drift happens,
  have none. The planning-pass procedure says a pass "may" consume an
  Entropy Reducer's findings and never requires one.
- The Entropy Reducer holds the exact lens ("where do implementation and
  product doctrine disagree; which settled decision is being bypassed") and
  has run once, by manual dispatch, against a frozen repository, not against
  a plan.
- The redirect's own refutation was a manual blinded dispatch recorded
  under `docs/planning/refutations/`; nothing checks that the next pass does
  the same.

**Design (scope discipline):**

- **The brief is compiled, not narrated.** `scripts/refute-plan.mjs` builds a
  refutation subject from committed files only: the vision's thesis sections
  by anchor (the one-paragraph story, the core bet, the differentiated
  interface, the three horizons, the mission); the five roles; the capability
  table's row identifiers and levels; and, for every order in the map's
  marked sequence, its title, objective, acceptance criteria, and non-goals
  as parsed from the order file. The planner's plan document, ledger section,
  and narrative are excluded from the subject: the refuter sees the vision
  and the orders, nothing about why the planner thinks they fit.
- **The refuter is a compiled actor.** A `plan-refuter` loadout in the
  skeleton: the Entropy Reducer identity wearing the Contra-Auguste mask with
  the architecture-and-semantics lens, role "plan refuter", a read-only
  envelope (`repo.read*`, `report.emit`; every write, remote, settings, and
  decision effect denied), a one-shot cadence, and a compiled WorkOrder whose
  questions are fixed: for each order, is it thesis-advancing, machinery, or
  drift; which thesis; which capability row it would move or create; which of
  the five roles gets a surface; and, for the horizon, the single largest
  remaining gap to the one-paragraph story and a verdict of `pass` or `hold`
  with reasons. The episode dispatches through a WO-009 transport
  (`claude-cli-print`, `codex-cli-exec`, or `fake` for fixtures) in the
  blinded host shape WO-010 established, with model file tools limited to the
  subject.
- **The result is closed.** `plan-refutation-v1`: `{ orders: [{ workOrderId,
  verdict: "thesis-advancing" | "machinery" | "drift", thesis,
  capabilityRow, rolesServed, reason }], largestGap, planVerdict: "pass" |
  "hold", holdReasons }`. The host validates it positively, rejects extra
  fields, and refuses a result that names an order not in the subject. The
  verdict rules are fixed in the schema: `thesis-advancing` must name a
  vision thesis section and the capability row it moves or creates;
  `drift` must name the vision passage the order works against, which may
  be a thesis section or an item of §What DotLn is not, and needs no
  capability row, because the vision's exclusions have none; `machinery`
  is the verdict for an order that names neither. A `machinery` verdict is
  not a failure by itself. The horizon is a hold by construction when any
  order is `drift`, when no order is `thesis-advancing`, or when the
  refuter's `largestGap` names a thesis that no order in the sequence
  touches and no order's non-goals defer it to a named later order.
- **The receipt is immutable and addressed.** `docs/planning/refutations/
  <date>-<slug>.md` and `.json`: the subject hash (SHA-256 over the map's
  sequence block bytes, each listed order file's bytes, **and the standard
  judged against**: the vision's thesis sections, the roles table, and the
  capability table's row identifiers and levels, so that a receipt goes
  stale when the standard moves as well as when the plan does), transport,
  model, effort, harness version, the validated result, and a disposition
  block where each `hold` reason gets a dated line. A disposition is either
  **accepted**, naming the order and criterion changed, after which the
  subject hash changes and a fresh receipt is required; or an **operator
  override**, which is not a line in the receipt at all: it is a control
  event appended through `npm run plan -- override <receipt> <hold>
  <reason>` under the acting session's recorded actor label (the WO-031
  actor attribution), citing a captured operator instruction by its
  SHA-256 in ignored intake in the same shape as a planning dispatch
  capture. The gate reads overrides only from the control log, never from
  receipt text, so an override is attributed, timestamped, and append-only
  like every other control event, and a planner session that writes one
  is visible as the actor that did. A hold with neither disposition stays
  open and blocks. A receipt is never edited after its disposition; a re-run
  creates the next receipt. The receipt's free-text fields are model
  output landing in a committed file, so the receipt writer runs the
  local-terms check over the validated result before writing and refuses
  to write a receipt that matches, reporting the list's presence; the
  fixture uses a synthetic term.
- **The gate.** `scripts/test-plan-refutation.mjs` in `npm test`: for every
  ledger section whose heading names a planning pass dated on or after this
  order's merge (forward-only enforcement), a receipt must exist whose
  subject hash equals the current hash, and its verdict must be `pass` or
  every hold reason must have an override event in the control log naming
  the receipt, the hold, the actor, and a capture hash; an accepted
  disposition does not discharge a hold, it changes the subject and demands
  the next receipt. A fresh receipt after a hold is admitted only when it
  carries, for each prior hold, either the accepted-disposition line naming
  the order and criterion changed or the same hold repeated, and only when
  its subject differs from the held receipt's subject inside at least one
  held order's named criterion; a receipt over a subject that changed only
  elsewhere is refused, and the verdict cannot be re-rolled by trivial
  edits. Within one planning pass, the third consecutive hold over the same
  sequence stops the loop: its holds stay open for an operator override
  event or the next pass, and no further receipt is admitted for that pass.
  The `fake` transport fixture returns a canned drift verdict; the check
  fails on it with no disposition, ignores any override text written into
  the receipt itself, passes with an override event in a fixture control
  log that names the hold and a fixture capture hash, passes on a fresh
  `pass` receipt that dispositions the prior hold over a subject changed
  inside the held criterion, refuses a fresh receipt over a subject changed
  only outside it, and stops after the third consecutive hold. A changed
  sequence block, order file, thesis section, roles table, or capability
  row without a fresh receipt fails.
- **The procedure.** The execution guide's planning pass gains one mandatory
  step after the drafts and before the pull request: run
  `npm run plan -- refute`, commit the receipt, and answer every hold in the
  receipt before the pass ends; the receipt joins the pass's standard
  artifacts. The first receipt, written by hand in the redirect, is
  time-indexed as pre-mechanism and is not re-run.
- **Declined alternatives, recorded:** a resume phrase the operator must
  remember (the defect was that the operator had to ask); a scoring model or
  a numeric alignment metric (a verdict with a named thesis and row is
  inspectable; a number is not); refuting execution orders here (that is
  verification); letting the planner session run the refuter in its own
  context (not blinded).

**Deliverables:** `scripts/refute-plan.mjs` and the `plan` command; the
`plan-refuter` loadout; the `plan-refutation-v1` schema and host
validation; `docs/planning/refutations/README.md` with the receipt
convention; `scripts/test-plan-refutation.mjs` and its fixtures; the
write-backs below.

**Acceptance criteria (all required)**

1. The subject builder produces a deterministic hash from committed files
   only, excludes every planning narrative surface, and a fixture proves
   that a one-byte change to the sequence block, to a listed order, to a
   vision thesis section, to the roles table, or to a capability row
   changes the hash.
2. The `plan-refuter` loadout compiles with a read-only envelope; a fixture
   proves a write, remote, settings, or decision effect is refused by the
   authority guard; the compiled WorkOrder's questions are pinned.
3. The host validates `plan-refutation-v1` positively, rejects extra fields
   and unknown order ids, holds by construction under the rules above, and
   the receipt writer refuses a result whose free text matches the
   local-terms list, proven by the synthetic-term fixture, with the list's
   presence reported.
4. A recorded live run over the current marked sequence through one actual
   transport produces a receipt with transport, model, effort, and harness
   version; the receipt is committed. Because that sequence contains this
   order, the receipt discloses the self-referential instrument, and its
   verdict on WO-041 itself is recorded as advisory rather than as evidence
   for this criterion (07 §Discipline, "disclose a self-referential
   instrument").
5. The evidence-gate check passes on the committed receipt, fails on the
   canned drift fixture with no disposition, ignores override text inside a
   receipt, passes with an override event in a fixture control log that
   names the hold, the actor, and a fixture capture hash, passes on a fresh
   `pass` receipt that dispositions the prior hold over a subject changed
   inside the held criterion, refuses a fresh receipt over a subject changed
   only outside it, stops the loop after the third consecutive hold in one
   pass, and fails when the sequence block, an order, a thesis section, the
   roles table, or a capability row changes without a fresh receipt; the
   override command refuses without a capture hash and records the acting
   session's actor label.
6. Write-backs land: 07 §Operator-opened planning pass (the mandatory step
   and the receipt as a standard artifact); 13 tester row; `docs/README.md`
   map line; README "What runs today"; a dated capability-table row for
   `control.plan-refutation`; publication index rows and both edition locks;
   ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the fixture transcripts for criteria 1, 2, 3, and 5; the
live receipt for criterion 4; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** automatic planning or re-planning; refuting execution work
orders; a numeric alignment score; changing lifecycle legality or the event
schema; running the refuter on historical passes (forward-only); a general
`Program.All` fan-out (the episode is one blinded run).

**Operator-review assumptions**

1. A `hold` blocks the planning pull request until answered; the two
   answers are a change with a fresh receipt, or an override event in the
   control log, attributed to its actor, citing a captured operator
   instruction by hash. The planner session may not override its own
   refutation; if one does, the log shows it. No reason is ever deleted.
2. The refuter's identity is the Entropy Reducer's Contra-Auguste mask, so
   its guard against destructive contrarianism applies: a `drift` verdict
   must name the vision passage it rests on, including the exclusions in
   §What DotLn is not, and a finding that names no passage at all is
   `machinery`, not `drift`.
3. The first receipt is the redirect's manual run and stays as written.
