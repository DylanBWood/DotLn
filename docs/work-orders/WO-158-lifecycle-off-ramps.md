# WO-158 — Lifecycle off-ramps: a criterion waiver, a withdrawal, a record correction and an override record are typed events with their own `resume` commands, `withdrawn` is a terminal phase every projection knows, and a live gate admits read-only commands

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The control protocol gains four event
types and one terminal phase, `resume` gains four dispatches, the live-gate
command classifier admits a fixed read-only list, the generated session hook
records `operator override: off`, and the role texts name the routes; the
bundle regenerates. Assigned at activation under the standing opt-out
default.
**Cost:** adds four typed events folded by `scripts/lib/control.mjs`
(`CriterionWaived`, `WorkOrderWithdrawn`, `RecordCorrected`,
`OperatorOverrideRecorded`), four `resume` dispatches (`waive`, `withdraw`,
`correct`, `override-record`) carrying the actor flags and, for the two
operator acts, an ignored-intake capture path and SHA-256 in the
`plan override --capture` shape; the `withdrawn` phase in status, index and
the closed-entries-leave rule; a read-only program list admitted during a
live gate in `packages/skeleton/src/harness-command.ts`; the session hook's
`off` handling; one fixture per route; one paragraph in product 07
§Operator recovery controls and one sentence per role skill. Removes the
improvised handling the 2026-09-25 planning document §3 catalogues: seven
records corrected after their event across six orders, seven
`operator override:` uses across five orders with no record, four
operator-owned steps waived in prose, WO-111's D017 → D019 → D020 chain
with an orphaned amendment row and receipts still reading "no operator
exception recorded", and read-only refusals during live gates in eight
orders' verifications and in this planning session. Registered sources
edited (`scripts/lib/evidence-sources.mjs`, checked 2026-09-25):
`packages/skeleton/src/harness-command.ts`,
`packages/skeleton/src/loadouts/contributor.ts`,
`packages/skeleton/src/loadouts/executor-supports.ts`,
`packages/compiler/src/harness.ts`; the harness and authority editions
re-mint deterministically. None is a feedback source
(`FEEDBACK_SOURCE_PATHS`), so no live episode (WO-154 D001). Wall-clock,
tokens and context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 dispatch ("off ramps
or designated nonstandard work order state pathways ... these ad hoc
decisions are becoming routine. do research for more than just wo-111"),
captured verbatim in ignored intake (SHA-256 in the ledger section), and
the cross-order catalog in the planning document §3 (101 orders read, 41
with a failed verification, the categories with no pathway). WO-111 D019
asks for "an explicit terminal disposition that does not claim success";
none exists. Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-139 merged (the execution-amendment route and the hook
refusals this order extends; closed); WO-157 merged (the Claude
selected-effort readback the `correct` route reads; closed, v0.45.0).
**Recommended placement:** paired with WO-159 at the head of the sequence,
before WO-160 and WO-161. This order edits the control fold, `resume`, the
index and status projections, the command classifier, the session-hook
generator and the role texts; WO-159 edits the worker transport, the Codex
argv builders and the two probes. Disjoint files; neither depends on the
other. Both re-mint editions (harness and authority here; authority and
verification there), so the second integration re-mints once more,
deterministically. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the execution-amendment route and the hook refusals this order extends"
  },
  {
    "workOrderId": "WO-157",
    "relation": "satisfied-by-close",
    "reason": "the Claude selected-effort readback the correct route reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/planning/off-ramps-5s-entropy-2026-09-25.md` §3 (the catalog) and
§4 (the routes); 07-execution-guide.md §Operator recovery controls (the
candidate whose "recovery event shape" is open), §Operator resume phrases
(the legal-action table), §Independent workflows and integration;
`scripts/lib/control.mjs` lines 57–160 (the fold: nine event types, eight
phases, no guards); `scripts/resume.mjs` lines 176–193 (`legalActions`)
and the dispatch cases; `docs/evidence/WO-111/decisions.md` D016, D017,
D019, D020; `docs/control/plan-refutations.jsonl` line 22 (the orphaned
`PlanExecutionAmended` row); `docs/verifications/WO-111/VER-002.md` lines
9 and 174–176; `docs/verifications/WO-131/VER-001.md` lines 62 and 110
(read-only refusals during a gate); `packages/skeleton/src/harness-command.ts`
(the live-gate classifier); `packages/compiler/src/harness.ts` (the
session hook that resolves `operator override:`); WO-157 D027 (the effort
readback refusal).

**Objective:** every situation the catalog shows being improvised has one
designated route that is a command, records an event and projects in
status, so a session meeting it runs the route instead of inventing one;
no route lowers a standard silently, and every operator act names the
operator's captured words.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):**

- `scripts/lib/control.mjs` folds nine event types into eight phases
  (`none`, `active`, `ready-to-verify`, `verifying`, `needs-fix`,
  `repairing`, `verified`, `final-review`, `closed`). No event expresses a
  waiver, a withdrawal, a correction or an override, and no phase is
  terminal without a passing final review.
- WO-111: the operator accepted a deviation from criterion 2 (D020). With
  no route, the executor first amended the criterion through `amend-order`
  (D017); the operator rejected that as rule beating; the order text was
  restored by hand (D019), and `plan-refutations.jsonl` line 22 now binds
  an order hash that exists in no checkpoint or commit. VER-002 line 9 and
  FINAL-001 line 17 still read `criterion2: "unmet; no operator exception
  recorded"`. VER-002 was edited after its `VerificationCompleted` event
  (D016). Register row FUP-0108 waits on "WO-111 is withdrawn", a state the
  fold cannot reach.
- Across orders (planning document §3): seven records corrected after
  their event across six orders (WO-110 D007, WO-114 D009, WO-130 D003,
  WO-147 D008, WO-152 D012, WO-111 D016 and D019); `operator override:`
  used inside a phase seven times across five orders with only decision
  records (WO-044, WO-053, WO-110, WO-146, WO-147); four operator-owned
  steps left "or explicitly waived" in prose (WO-142 VER-004 O3; WO-045,
  WO-046, WO-049); read-only shell commands refused during a live gate in
  eight orders' verifications (WO-125, WO-130 to WO-133, WO-100, WO-144,
  WO-111).

**Design (scope discipline):**

- Four events, appended to the order's control segment with the actor
  attestation. The two operator acts carry an ignored-intake capture path
  and its SHA-256, the shape `plan override --capture` already uses.
  - `CriterionWaived { criterionId, reason, capture }`: legal in
    `verifying`, `needs-fix`, `repairing`, `verified` and `final-review`;
    changes no phase. Status lists waived criteria. A verification or final
    review that judges a waived criterion records it as `unmet, waived by
    <ordinal>`; the waiver neither fails nor passes it on its own. The
    executor role cannot record one for its own order.
  - `WorkOrderWithdrawn { disposition: failed | superseded | abandoned,
    reason, capture }`: legal from every phase except `closed`; terminal
    phase `withdrawn`. The index shows the disposition; the sequence's
    closed-entries-leave rule covers withdrawn entries; a typed dependency
    on a withdrawn order reports `unmet: withdrawn`; `activate` from
    `withdrawn` requires a changed order revision with a dated note.
  - `RecordCorrected { subject: eventOrdinal | reportPath, fields, reason }`:
    corrects attestation fields (`model`, `effort`, `source`,
    `harnessVersion`), a report path or a checkpoint reference; never a
    verdict; report bytes never change. The projection shows corrected
    values with the correction's ordinal. A wrong verdict keeps its
    existing routes: a later `VER-NNN` or a failing final review.
  - `OperatorOverrideRecorded { bypassed, effects, reason }`: appended when
    `operator override: off` is received in a session whose runtime can run
    `resume`; otherwise the hook prints the exact `npm run resume --
    override-record ...` command as advisory and the role's completion
    carries the duty. Never a precondition for entering or leaving
    override (the WO-131 direction that recovery never blocks).
- Dispatches: `npm run resume -- waive <criterion> --reason '<text>'
  --capture <path> <actor-flags>`; `withdraw --disposition <d> --reason
  --capture`; `correct <ordinal|report> --set <field>=<value> ... --reason`;
  `override-record --bypassed <list> --effects <list> --reason`. Each
  prints the event it appended and refreshes the projections; each refuses
  outside its legal phases with the legal list, as existing dispatches do.
  A completion whose `--effort` disagrees with the session's `CLAUDE_EFFORT`
  readback is refused with the readback value (WO-157 D027), so `correct`
  is the route for a wrong record, not a habit.
- The live-gate classifier admits a fixed read-only list without redirect
  operands or in-place flags while a gate is live: `cat`, `head`, `tail`,
  `wc`, `ls`, `grep`, `sed -n`, `git diff|log|show|status|stash list`,
  `node scripts/harness.mjs writer --show`, `npm run resume --silent --
  status`. The refusal text names the list. Writes and unlisted programs
  keep today's refusal.
- Role text: one sentence per role naming the four routes and when to use
  them, replacing the prose allowances the catalog names. Product 07
  §Operator recovery controls gains a dated paragraph naming the routes and
  closing the candidate's open "recovery event shape"; the resume-phrase
  table gains the rows.
- **Declined alternatives, recorded:** a verdict-changing correction (a
  re-verdict must be a new report); one generic `Exception` event (the four
  differ in legality and projection); making the override record a
  precondition (blocks recovery); retroactive events for historical orders
  (WO-111's receipts keep their bytes; whether the operator appends a
  waiver to WO-111 afterwards is the operator's call).

**Deliverables:** the fold, dispatches and projections; the classifier
list; the hook `off` handling; fixtures; role text; the product 07
paragraphs; decisions.

**Acceptance criteria (all required)**

1. `npm run resume -- waive|withdraw|correct|override-record` each append
   their event with the actor attestation, refuse outside their legal
   phases with the legal list, and `resume status --json` projects waived
   criteria, the `withdrawn` phase with its disposition, corrected fields
   with their ordinal, and override records; `current.md` follows.
   Fixtures cover each event's legal and illegal phases and a `withdrawn`
   order that a typed dependency reports as unmet.
2. `CriterionWaived` and `WorkOrderWithdrawn` require a capture path whose
   file exists and whose SHA-256 matches the event; an executor-role
   attestation is refused for `waive`. The verifier's report convention
   records `unmet, waived by <ordinal>`; a fixture shows a verification
   passing with a waived unmet criterion and failing on the same criterion
   without a waiver.
3. `withdrawn` is terminal: no dispatch except `activate` with a changed
   order revision is legal from it; the work-order index shows the
   disposition; the sequence and plan checks treat withdrawn entries as
   closed.
4. `RecordCorrected` never changes a verdict or a report's bytes (a fixture
   attempts both and is refused); the fold projects the corrected
   attestation; a completion whose `--effort` disagrees with the
   `CLAUDE_EFFORT` readback is refused with the readback value.
5. In a Claude Code session, `operator override: off` appends
   `OperatorOverrideRecorded` when the runtime can run `resume` and prints
   the advisory command when it cannot, shown by the generated-hook tests;
   Codex carries the duty as role text.
6. During a live `npm test` gate, the listed read-only commands without
   redirects are admitted and a redirecting or unlisted command is refused,
   shown by the harness-command fixtures; the refusal text names the list.
7. Role skills and product 07 name the routes; `npm run harness -- check`
   green; cold-start bytes measured, any ceiling breach recorded under the
   standing 2026-09-17 route.
8. The harness and authority editions re-mint deterministically and
   `docs/evidence/current.json` selects them; no live episode.
9. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** fixture transcripts; the generated-hook test; `npm test`
once at final review. No live row.

**Write-back duty:** decisions with sources and reopening conditions; the
product 07 paragraphs; at close, the register rows this order discharges
(FUP-e468ee64ac00c70a, FUP-eba6a79fc106bd28) retargeted through the
adjacent queue.

**Non-goals:** retroactive events for closed orders; a verdict-changing
correction; the integrate helper and the amendment-row withdrawal (WO-160);
the sandbox vocabulary (WO-161); any change to what a verification or final
review judges.

**Operator-review assumptions**

1. A waiver is the operator's act, recorded with the operator's captured
   words; the executor cannot waive its own order's criterion.
2. `withdrawn` counts as a closed entry for the sequence and the index.
3. The read-only list is fixed and small; adding a program is a later
   order, not a session decision.
