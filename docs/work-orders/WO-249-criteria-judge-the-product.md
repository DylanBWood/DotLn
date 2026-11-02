# WO-249 — Criteria judge the product: a verifier records a criterion that no candidate can meet as defective by class and the order goes on without a waiver, a waiver is the operator's words asking for it and can be retracted, a handoff the operator widened can be reopened, a failing verification names the criterion or the regression it failed on, and planning lints criteria for the five defect classes (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. Three new lifecycle events and their
`resume` commands, one tightened completion check, one advisory lint, the
briefing and role text that carry the rules; every existing record keeps
its meaning. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/resume.mjs`, three off-ramps beside `waive`
(2025 to 2071), `withdraw` (2073) and `correct` (2114): `defect <criterion>
--class <class> --evidence <text> <actor-flags>`, recorded by a verifier or
reviewer and refused to the order's own executor as `waive` is (2048 to
2054), appending `CriterionDefectRecorded` with the criterion's id, its
text's SHA-256, one of five classes and the evidence; `retract <ordinal>
--reason <text> --capture <path> --capture-hash sha256:<digest>
<actor-flags>`, appending `OffRampRetracted` for a `CriterionWaived` or
`CriterionDefectRecorded` ordinal of the current activation, legal in
`verifying`, `verified`, `needs-fix`, `final-review` and `closed` while the
order's pull request is unmerged (the state the close already reads), and
in `closed` returning the order to `needs-fix` with the retraction as its
failure source, so a retracted record is repaired, re-verified and
re-reviewed before the pull request is merged or the close runs
(`scripts/release.mjs`'s prerequisites refuse an order whose retraction is
newer than its latest passing final review); after the merge a retraction
records the event and the operator's words, returns nothing to `needs-fix`,
since a merged branch cannot be repaired in place, and names the planner's
follow-up route in its message; and
`reopen-handoff --reason <text> --capture <path> --capture-hash
sha256:<digest> <actor-flags>`, appending `HandoffReopened` from
`ready-to-verify` and returning the order to the phase its handoff left
(`active` after `ImplementationReady`, `repairing` after `RepairCompleted`;
`scripts/lib/control.mjs` 335 to 337 and 362 to 364); in `control.mjs`
the three events' validation beside `CriterionWaived` (103 to 106) and the
state they project (`defectiveCriteria`, `retractedOffRamps`, the cleared
`unmetCriteria`); in `scripts/lib/off-ramps.mjs` the judgment line
`**Criterion <id>:** unmet, defective (<class>) by <ordinal>` beside the
waived form (195 to 200), admitted by `judgeCriterionLines` (262 to 301)
when the event exists at that ordinal with that class, the criterion's
current text hashes to the record and no retraction names the ordinal; a
`met` line over a standing record admitted, as a `met` line over a waiver
is today, so a repaired criterion never deadlocks on an old record; a line
citing a record whose criterion text no longer hashes to it refused, with a
fresh `defect` admitted for the amended text; a `fail` verdict's `unmet`
line with a blocking finding naming the criterion admitted while a record
stands, so a reviewer or verifier who finds the criterion judgeable
disagrees in the record and the repair follows; and two new refusals in
the same function: a `fail` verdict whose report judges
every criterion met, waived or defective and whose findings block has no
`blocking` entry is refused ("a fail names an unmet criterion or a blocking
finding"), and a `fail` whose findings block is absent or unreadable is
refused naming the block, so a verifier cannot skip the basis by leaving
the block out, while a `pass` keeps the block advisory as WO-187 left it; a
`blocking` entry of the findings block carries a `basis`
(`{"criterion": "<id>"}` or `{"regression": "<the behavior main had>"}`)
and a `reproduction` path under the order's evidence directory, checked
when the block is readable and advised otherwise, as the block is today
(`packages/skeleton/src/loadouts/contributor.ts` 224); the fenced-heading
repair of `criterionJudgments` (240 to 241: a heading inside a fenced
example ends the paragraph; WO-247-D015); in `scripts/lib/plan-failures.mjs`
the three events in `OFF_RAMPS` (33 to 39) and `CriterionDefectRecorded`
counted by class in `offRampEvents`; in `scripts/release.mjs` and
`scripts/lib/github-body.mjs` (the stored pull-request body `release
prepare` renders) one line per defective or waived criterion of the order
above the process table, naming the criterion, the class or the waiver and
the ordinal, so the operator reads it before merging (the operator merges
every pull request by hand; this line is the operator's checkpoint on a
record two roles made without them); in `scripts/lib/drive-route.mjs` (75)
and `scripts/lib/meta.mjs` (804) the events where `CriterionWaived` is
listed; in `scripts/resume.mjs` the unmet briefing (1237 to 1246) rewritten:
a waiver is recorded only from the operator's words asking for that
criterion's waiver, an amendment needs the operator's words changing the
criterion, and a criterion in one of the five classes is recorded defective
with its evidence, so an order never waits for a waiver nobody asked for;
in `scripts/work-orders.mjs` (`index --check`, which `plan check` and
`test:docs` run) one advisory lint over every open order's acceptance
criteria: a number followed by a unit (`s`, `ms`, `min`, `h`, `bytes`,
`KB`, `MB`, `GB`, `tokens`, `USD`, `%`), the words `median`, `ceiling`,
`budget` or `cap` beside a figure, `HEAD`, `git log`, a `..` or `...`
revision range, or the phrases `after the review gate`, `at release close`
and `after the final review`, each printed as `criteria advisory: WO-NNN
criterion N: <what matched>` and never a refusal; in
`packages/skeleton/src/loadouts/contributor.ts` the role text: the
off-ramps sentence (615) gains the three commands and the words rule; the
verifier's blocking sentences (188 and 190) gain the funnel (a blocking
finding names the criterion it fails and the supported input that
reproduces it, or the behavior `main` had and the probe that shows the
change broke it; an input the verifier constructed outside the supported
vocabulary is a follow-up, never a block); the executor's routine-questions
sentence (85) gains that an unmet criterion of one of the five classes is
recorded unmet with the class named for the verifier, and nothing is asked
of the operator; the planner's text gains the five classes as the screen
every criterion passes before filing and the lint's name; the kit guide
and product 07 §Discipline, §Verification review and attack and
§Operator-opened planning pass stated as built; cases in
`scripts/test-off-ramps.mjs` and `scripts/test-resume.sh` (the three
events, the admitted and refused lines, the fail refusal, the fenced
heading), `scripts/test-work-orders.mjs` (the lint on a fixture order) and
`scripts/test-process-debt.mjs` (the counts). Removes: the state where a
criterion nobody can meet stops an order until the operator types a waiver
(five waivers on four core orders, two on the fork's orders, none of them
a product failure: §Observed gap), where a waiver once recorded cannot be
undone except by editing the control segment by hand (the fork's
WO-021-D028 and D030), where a handoff the operator widened keeps its stale
ledger and unmet line until a verification fails (the fork's WO-026-D018),
where a verifier can announce a block on an input it made up (WO-247's
VER-001 F1 before its correction, D014), and where the briefing offers a
waiver route to a session that then takes it from words that asked for
none (the fork's WO-021). Wall-clock: the lint is one regular-expression
pass over the open orders' criteria inside a check that already parses
them, measured before and after in the decisions; the completion check
reads one more field of a block it already reads. Context bytes: this file,
about 21,000; each role root grows by the sentences named, measured
against its ceiling under the standing route. Commands: `resume defect`,
`resume retract` and `resume reopen-handoff`, new. Tokens: unknown until
run. Steps: 10. Re-mints: `contributor.ts` is a runtime source the executor
checks against `scripts/lib/evidence-sources.mjs` at activation and
re-mints deterministically where an edition is staled; no feedback-judged
source changes, so no live feedback episode; `scripts/resume.mjs`,
`scripts/lib/off-ramps.mjs`, `scripts/lib/control.mjs`,
`scripts/lib/plan-failures.mjs` and `scripts/work-orders.mjs` are declared
machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's items 2 and 7 of the 2026-11-01
planning dispatch (ignored capture
`docs/intake/notes/planning-fork-blocks-close-residue-reviews-criteria-and-desktop-opt-in-2026-11-01.md`,
SHA-256 `65b3db5f78aa7bdba95e94ce62e12015afbc144e058b5699767040e37b22d0a2`):
WO-247's verifier was about to fail the order on a scenario it made up and
was talked into a follow-up, and more scenarios should take that funnel
instead of blocking; and mutually exclusive, unattainable or bookkeeping
criteria are routinely written into orders in core and the fork, so the
operator waives criteria constantly and an order cannot progress without
the operator at the laptop. The DotLn-Enterprise-Starter fork's second block
of 2026-11-01, items 1 to 3 (the same capture): a waiver recorded without
the operator's word has no retraction route; a planning screen against
criteria that need a later phase; the briefing's waiver route taken by a
session on its own. The fork's first block of 2026-11-01, item 5: a route
from ready-to-verify back to the executor when the operator widens an
order after its handoff. Filed by the
[2026-11-01 pass](../planning/fork-blocks-close-residue-reviews-criteria-desktop-opt-in-2026-11-01.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-158 (closed: the off-ramps `waive`, `withdraw` and
`correct` this order extends and the actor rule it reuses); WO-173 (closed:
the handoff ledger and the unmet briefing this order rewrites); WO-187
(closed: the findings block and the blocking, follow-up and operator routes
this order binds to the fail); WO-172 (closed: `plan failures` and the
start block that count the new events); WO-247 (closed, v0.106.0: the
fenced-heading defect D015 boarded and the follow-up correction D014).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the off-ramp commands, their actor rule and the control events this order extends"
  },
  {
    "workOrderId": "WO-173",
    "relation": "satisfied-by-close",
    "reason": "the handoff ledger, the recorded unmet criteria and the briefing that names the waiver route"
  },
  {
    "workOrderId": "WO-187",
    "relation": "satisfied-by-close",
    "reason": "the findings block and its three routes, which the fail refusal and the basis field read"
  },
  {
    "workOrderId": "WO-172",
    "relation": "satisfied-by-close",
    "reason": "plan failures and the plan start block that count off-ramp events by kind"
  },
  {
    "workOrderId": "WO-247",
    "relation": "satisfied-by-close",
    "reason": "the fenced-heading parser defect and the synthetic-input correction this order repairs and binds"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/resume.mjs` (`unmetBriefing`
1237 to 1246; `waive` 2025 to 2071 with the executor refusal at 2048 to
2054 and the message at 2070; `withdraw` 2073; `correct` 2114 onward with
`CORRECTABLE_FIELDS` and the verdict refusal); `scripts/lib/off-ramps.mjs`
(`criterionLineForms` 195 to 200; `criterionJudgments` 202 to 254, the
heading test at 240 before the fence test at 241; `judgeCriterionLines` 262
to 301; `requireCriterionLines` 303); `scripts/lib/control.mjs`
(`CriterionWaived` validation 103 to 106; `ImplementationReady` 335 to 337;
`RepairCompleted` 362 to 364; the waived and unmet projections near 498);
`scripts/lib/plan-failures.mjs` (`OFF_RAMPS` 33 to 39; `offRampEvents`);
`scripts/lib/drive-route.mjs` 75; `scripts/lib/meta.mjs` 804;
`packages/skeleton/src/loadouts/contributor.ts` (85, 188, 190, 200, 218,
224, 229, 615); `scripts/work-orders.mjs` (`index --check` and the criteria
each order declares); product 07 §Operator resume phrases (the off-ramps table, 423 to 426),
§Operator recovery controls (the off-ramps, 1105 onward), §Verification
review and attack (the three routes; the operator delegates decisions to
each phase; WO-112's seven verifications), §Operator-opened planning pass
(the screens before filing, including this pass's five classes);
`docs/control/orders/WO-163.jsonl`, `WO-173.jsonl`, `WO-197.jsonl` and
`WO-192.jsonl` (the five `CriterionWaived` rows and their reasons);
`docs/evidence/WO-247/decisions.md#wo-247-d014` and `#wo-247-d015`.

**Objective:** An order progresses on its product. A criterion that no
candidate can meet because of how it was written is recorded as such by an
independent role with evidence, confirmed by the next independent role, and
the order goes on; the operator reads the record and the planner reads the
count and stops writing that class. A waiver exists only where the operator
asked for one and can be undone where it was recorded wrongly. A handoff
the operator widened is reopened in the record instead of carrying a stale
ledger. A verification fails only on a criterion it names or a regression
it reproduces, and the briefing never hands a session a route the operator
did not open.

**Observed gap (dated 2026-11-01 at `main` `64286ff8`, v0.107.0):**

- Core's record holds five `CriterionWaived` rows on four orders, none of
  them a failure of the product: WO-163 criterion 4 (a Git attribute the
  design could not make annotate native diff statistics, 2026-09-28);
  WO-173 criterion 5 (a briefing byte overage, 2026-09-28); WO-197
  criteria 1 and 2 (per-case timing that did not exist before 2026-10-05,
  and a 22.254 s ceiling the operator judged unreachable, 2026-10-07);
  WO-192 criterion 17 (a Codex host behavior the order could not produce,
  2026-10-31). `plan failures` on 2026-11-01 counts `CriterionWaived: 5` and
  169 failed verifications across the record. The fork's WO-021 criterion 9
  asked for a clean target "after the review gate" while the verifier judges
  the uncommitted candidate (129 implementation paths failed it), and its
  WO-022 criterion 4 carried a token-spend stop copied from an earlier order,
  which the executor asked the operator to lift.
- The only routes past an unmet criterion are the operator's waiver and the
  operator's amendment (`unmetBriefing`, 1237 to 1246; `judgeCriterionLines`
  298 to 300: "record fail, or the operator records one with npm run resume
  -- waive"). An order whose criterion is defective therefore waits for the
  operator, and the fork's verifier of WO-021 took the briefing's route from
  a capture in which the operator had authorized a commit and a pull
  request and asked for no waiver.
- `correct` takes attestation, report path, checkpoint and `productGate`
  only (`CORRECTABLE_FIELDS`); no event reverses a `CriterionWaived`, so the
  fork's recovery removed the line from the control segment by hand
  (WO-021-D028 and D030).
- `ImplementationReady` and `RepairCompleted` move the order to
  `ready-to-verify` and record the unmet criteria (control.mjs 335 to 337,
  362 to 364); nothing moves it back before a verification, so an order the
  operator widens after its handoff keeps the earlier ledger, gate rows and
  unmet line (the fork's WO-026-D018: two document orders on 2026-10-31).
- `judgeCriterionLines` refuses a pass over an unwaived unmet line and
  nothing about a fail: a `fail` whose report judges every criterion met
  and lists no blocking finding is admitted. WO-247's verifier announced
  that a constructed status string would block criterion 1 before any
  supported input reproduced it (D014's correction); the role text's
  sentence (190) says blocking requires an unmet criterion or a reproduced
  regression and binds no record to it.
- `criterionJudgments` tests a heading before excluding a fenced row (240
  to 241), so a heading inside a fenced example ends the paragraph and the
  receipt citation after the fence is lost (D015).
- Product 07's screens before filing name no-code orders, natural-language
  readings, live-run surfaces, host forms, controls, commit readers and
  recurring cost (§Operator-opened planning pass); none names a count, a
  ceiling, a cost or a duration as a criterion subject, a later-phase
  judgment, an absent input or a contradiction, and no check reads a
  criterion's text for them.

**Design (scope discipline):**

- **Five classes, closed and evidence-bound.** A criterion is defective
  when it is `bookkeeping` (its subject is a count, ceiling, cost, duration
  or token figure and not a behavior of the product; WO-173 criterion 5,
  WO-197 criterion 2, the fork's WO-022 criterion 4), `later-phase` (it asks
  for a judgment the kit makes at final review or release close, or reads
  `HEAD` or a commit range before the final review's commit; the fork's
  WO-021 criterion 9), `absent-input` (the data it reads does not exist at
  the order's base and no step creates it; WO-197 criterion 1),
  `host-behavior` (it requires a behavior of a host, service or operator
  account the order cannot produce and names no fallback; WO-192 criterion
  17, WO-163 criterion 4) or `contradiction` (it cannot hold together with
  another criterion or a non-goal as written). The record carries the
  class, the evidence sentence and the SHA-256 of the criterion's text, so
  an amended criterion invalidates the record. Rejected: a free-text class
  (axis: a count by class is what the planner reads; free text counts
  nothing). Rejected: letting the executor record it (axis: the executor
  judges its own work; the same rule keeps `waive` from the executor).
- **Two independent roles, no operator, and the operator's checkpoint.**
  The verifier records the defect during `verifying`; the final reviewer's
  report carries the same line or the review fails (a reviewer who finds
  the criterion judgeable and unmet fails the review with a blocking
  finding, and the repair follows; the record admits that `unmet` line
  while the defect stands, and admits a `met` line over it, so neither the
  disagreement nor a later repair deadlocks). The pull-request body names
  every defective or waived criterion above its process table, so the
  operator, who merges by hand, reads the record before the merge and
  retracts it with `retract` when two roles were wrong; `plan failures`
  counts it for the planner. The risk this design accepts and bounds is two independent
  roles agreeing on a wrong class: the body line and the retraction are the
  operator's answer, the count by class the planner's. Rejected: a second event for
  the reviewer's confirmation (axis: the FINAL report's line is already the
  reviewer's judgment, checked against the record as the VER line is).
  Rejected: the operator's confirmation before the order goes on (axis: the
  operator's item 7; unattended progress is the point).
- **A retraction has a route back.** `retract` is legal from `verifying`
  through `closed` before release close; in `closed`, where the final
  review's pass has left the order (`control.mjs` 425) and the pull
  request is open, it returns the order to `needs-fix` with the retraction
  as the failure source, and release close refuses an order whose
  retraction is newer than its latest passing final review, so the
  operator's merge-time reading has a consequence the lifecycle carries:
  the repair, a fresh verification and a fresh final review precede the
  merge. Rejected: a retraction that only annotates (axis: a record the
  lifecycle ignores is a sentence in a report). Rejected: a retraction
  after release close (axis: the release is published; the planner files
  the follow-up from the count).
- **A waiver is words that ask for it.** The briefing and the role text
  say so; the record form is unchanged; `retract` undoes one recorded
  without them. Rejected: the hook or the command judging the capture's
  words (axis: natural-language reading; the rule lives in the text the
  session reads and the record it leaves).
- **A reopened handoff returns to its phase.** `HandoffReopened` is legal
  only in `ready-to-verify` with no verification requested after the
  handoff; it clears the unmet criteria, and the next `implementation-ready`
  or `repair-complete` writes a fresh ledger. Rejected: letting the executor
  edit the ledger in place (axis: the ledger is the record of a completion
  event; a second completion is a second event).
- **A fail names what it failed on.** The fail's refusal mirrors the
  pass's; the findings block's `blocking` entries carry a basis and a
  reproduction path. Rejected: making the whole findings block a refusal
  (axis: WO-187 made it advisory so a malformed block never blocks
  recording; only the fail's consistency with its own lines is refused).
- **The lint advises; the planner decides.** `index --check` prints an
  advisory per matched criterion; `plan check` and `test:docs` carry it to
  the pass and the refuter; nothing is refused, because a figure can be the
  right subject of a criterion that names a record rather than a behavior.
  Rejected: refusing the pattern (axis: a regular expression over prose is
  a screen, not a judgment).
- **Live-run surfaces at the base.** The off-ramp commands, the control
  projection, the criterion-line judgment, the findings block, `plan
  failures` and `index --check`: exist. The three events, the defective
  line, the fail refusal, the lint and the text: absent.

**Execution plan (the executor follows these steps in order; observed at `64286ff8`, 2026-11-01):**

1. `scripts/lib/control.mjs`: `CriterionDefectRecorded` (criterionId,
   criterionHash, class, evidence, actor; validated beside `CriterionWaived`
   at 103 to 106), `OffRampRetracted` (ordinal of a `CriterionWaived` or
   `CriterionDefectRecorded` row of the current activation, reason,
   captureHash, actor; legal from `verifying` through `closed` before
   release close, and in `closed` projecting `needs-fix` with the
   retraction as `failureSourceId`) and `HandoffReopened` (reason,
   captureHash, actor; legal from `ready-to-verify` only); the state
   projects `defectiveCriteria`, `retractedOffRamps` and, after a reopen,
   the phase the handoff left with `unmetCriteria` cleared. Check: `npm test -- --only
   resume`.
2. `scripts/resume.mjs`: the three commands with the `waive` actor rule
   (2048 to 2054) for `defect` and `retract`, the capture flags for
   `retract` and `reopen-handoff`, the status projection and
   `legalOffRamps`; `unmetBriefing` (1237 to 1246) rewritten as the Cost
   states. Check: `npm test -- --only resume`.
3. `scripts/lib/off-ramps.mjs`: the defective line form beside the waived
   one (195 to 200); `judgeCriterionLines` admits it against the record and
   the criterion hash, admits a `met` line over a standing record and a
   `fail` verdict's `unmet` line with a blocking finding naming the
   criterion, refuses a line citing a retracted ordinal or a record whose
   criterion text no longer hashes to it, refuses a `fail` with every
   criterion met, waived or defective and no `blocking` finding, and refuses
   a `fail` whose findings block is absent or unreadable; the `blocking` entry's `basis` and `reproduction`
   read when the block parses; the fenced-heading repair (240 to 241, only
   an unfenced heading ends a paragraph). Check: `npm test -- --only resume`.
4. `scripts/lib/plan-failures.mjs` (`OFF_RAMPS`, `offRampEvents` by class
   for defects), `scripts/lib/drive-route.mjs` (75) and `scripts/lib/meta.mjs`
   (804): the three events known where `CriterionWaived` is;
   `scripts/release.mjs` and `scripts/lib/github-body.mjs`: the stored body
   carries one line per defective or waived criterion above the process
   table, the github-body-profile check admits it, and the close's
   prerequisites refuse an order whose retraction is newer than its latest
   passing final review; `resume retract` reads the pull request's merge
   state as the close does and takes the record-only form after the merge. Check: `npm test --
   --only process-debt`; `npm test -- --only harness-fixtures`; `npm test
   -- --only release`; `npm test -- --only github-body`.
5. `scripts/work-orders.mjs` (`index --check`): the criteria lint as the
   Cost states, advisory only, with a fixture order that matches each
   pattern once and a clean order that matches none. Check: `npm test --
   --only work-orders-fixtures`.
6. `packages/skeleton/src/loadouts/contributor.ts`: the off-ramps sentence
   (615), the verifier's funnel (188 and 190), the executor's sentence (85),
   the reviewer's line forms (229) and the planner's screen and lint
   sentence; `npm run sync` regenerates the roots; measure each root against
   its ceiling under the standing route. Check: `npm test -- --only harness`;
   `npm test -- --only harness-context`.
7. `scripts/test-off-ramps.mjs` and `scripts/test-resume.sh`: a defect
   recorded by a verifier admits a pass with the defective line, a FINAL
   report without the line is refused, a retracted ordinal refuses the line,
   a reopened handoff returns to `active` or `repairing` and the next
   completion writes a fresh ledger, a fail with no unmet line and no
   blocking finding is refused, the executor's `defect` is refused, and a
   fenced heading no longer ends a paragraph. Check: `npm test -- --only
   resume`.
8. Write-backs: product 07 §Operator resume phrases (the off-ramps
   table: the three commands, the words rule) and §Operator recovery
   controls (the off-ramps paragraph: the five classes, the retraction's
   route back), §Verification review and
   attack (the defective route; the fail names what it failed on; the
   constructed-input rule) and §Operator-opened planning pass (the lint
   named beside the screens); the kit guide (`docs/KIT.md` once WO-245
   merges, otherwise `scripts/kit/README.client.md`) where it names
   `resume` commands; `docs/evidence/WO-249/decisions.md` (the lint's
   measured cost before and after; each root's bytes); re-mint any edition
   `contributor.ts` stales; `npm run meta`; `node scripts/lineage.mjs index
   --check`; `npm run publication:check`.
9. Run `npm run work-orders -- index --check` on the tree and record the
   advisories it prints for the open orders in the decisions; amend none
   (a planning pass reads them).
10. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; the
    independent reviews the executor root requires; one `npm test --
    --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-249/handoff.md`; `npm run test:docs`
    once after the last document edit; `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the three events and commands; the defective line and the
fail refusal; the fenced-heading repair; the counts; the lint; the briefing
and role text; the write-backs.

**Acceptance criteria (all required)**

1. In the `resume` fixture, a verifier's `npm run resume -- defect 3
   --class bookkeeping --evidence <text> <flags>` (the classes being
   `bookkeeping`, `later-phase`, `absent-input`, `host-behavior` and
   `contradiction`) appends
   `CriterionDefectRecorded` with the criterion's text hash, `status
   --json` lists it under `defectiveCriteria`, a VER report judging
   `**Criterion 3:** unmet, defective (bookkeeping) by <ordinal>` records
   `verification-result pass`; the same command from the order's executor
   or with a class outside the five is refused naming the reason; a report
   line citing a record whose criterion text no longer hashes to it is
   refused, and a fresh `defect` for the amended text is admitted.
2. A FINAL `pass` whose report omits the defective line for a recorded
   defect, or carries it with an empty paragraph under it, is refused; one
   that carries it with a paragraph naming the reviewer's own evidence for
   the class passes; a FINAL `fail` judging the
   criterion `unmet` with a blocking finding naming it is admitted while
   the record stands; a `met` line for the criterion is admitted over the
   standing record.
3. `npm run resume -- retract <ordinal> --reason <text> --capture <path>
   --capture-hash sha256:<digest> <flags>` appends `OffRampRetracted` for a
   `CriterionWaived` or `CriterionDefectRecorded` ordinal, `status --json`
   no longer lists the criterion as waived or defective, and a report line
   citing the retracted ordinal is refused; an ordinal of another event
   kind or another activation is refused; from `closed` with the pull
   request unmerged the retraction returns the order to `needs-fix` with the
   retraction as the failure source, and `release.mjs close` refuses while
   it stands unrepaired; from `closed` with the pull request merged the
   retraction records, names the planner's follow-up route and changes no
   phase.
4. From `ready-to-verify` with no verification requested since the
   handoff, `npm run resume -- reopen-handoff --reason <text> --capture
   <path> --capture-hash sha256:<digest> <flags>` appends `HandoffReopened`,
   `status --json` reads the phase the handoff left with no unmet criteria,
   and the next `implementation-ready` or `repair-complete` records a fresh
   ledger; from any other phase the command is refused.
5. `verification-result fail` over a report whose criterion lines are all
   met, waived or defective and whose findings block lists no `blocking`
   entry is refused; the same report with one `blocking` entry carrying a
   `basis` and a `reproduction` path is admitted; a `blocking` entry without
   them prints the advisory and records; a `fail` whose findings block is
   absent or unreadable is refused naming the block, and a `pass` with the
   same block prints the advisory as today.
6. `criterionJudgments` returns the receipt citation after a fenced example
   containing a heading, and the existing wrapped-line, blank-line and
   fenced-example cases pass.
7. `npm run plan -- failures` counts the three events as off-ramps and
   `CriterionDefectRecorded` by class; the `plan start` block stays within
   its compact bound with them; the `release` fixture's stored pull-request
   body for an order with one waived and one defective criterion carries
   one line for each above the process table, naming the criterion, the
   class or waiver and the ordinal, and the github-body-profile check
   passes.
8. `npm run work-orders -- index --check` prints one `criteria advisory`
   line per matched criterion of the fixture order that matches each
   pattern and none for the clean order, and exits 0 on both.
9. The emitted executor, verifier, reviewer and planner roots carry the
   sentences the Cost names; `harness check` passes; the unmet briefing
   prints the three routes and the words rule.
10. Product 07 and the kit guide state the commands, the classes, the
    words rule, the fail rule and the lint as built; `npm run
    publication:check` is green.
11. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency.

**Preflight:** `npm test -- --only resume` for steps 1, 2, 3 and 7; `npm
test -- --only process-debt`, `npm test -- --only harness-fixtures`, `npm
test -- --only release` and `npm test -- --only github-body` for step 4; `npm test -- --only work-orders-fixtures` for step 5; `npm test --
--only harness` and `npm test -- --only harness-context` for step 6; `npm
run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1 to 8; the deterministic
re-mints of any edition `contributor.ts` stales; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criterion 10.

**Known issues and carry-ins:**

- WO-247-D015 (FUP-f8073a2c2a4e0600): the fenced-heading repair of
  `criterionJudgments`, taken in step 3 (reopen: a real handoff loses its
  receipt citation after the repair).
- A defect record is a judgment with a class and evidence, not a proof; a
  verifier who records `bookkeeping` for a criterion that names a behavior
  is wrong in the record, where the reviewer, the operator and the planner
  read it (reopen: a defect record is retracted by the operator, or a
  planning pass finds a recorded class that does not fit its definition).
- The lint reads criteria text with regular expressions and will match a
  criterion that rightly names a record's figure; it advises and the
  planner reads it (reopen: a pass finds the advisory noise exceeds its
  signal and names the pattern).
- The five waivers in core's record and the fork's two stay as recorded;
  nothing rewrites them (reopen: the operator asks for a retraction of one).
- The role roots are near their ceilings (executor 38,400 of 40,194 on
  2026-11-01); the sentences this order adds may breach one, and the
  standing route records the acceptance in the decisions (reopen: a root
  exceeds its accepted ceiling after this order).

**Non-goals:** changing how a criterion is judged met; a hook that reads a
capture's words; an operator confirmation before an order goes on;
rewriting recorded waivers; a new verdict kind; the reviewer ladder (WO-250)
or the release-close residue (WO-252).

**Operator-review assumptions:** that two independent roles recording a
criterion defective by class is the funnel the operator asked for, with
`retract` as the operator's correction; that the operator wants the lint
advisory and never refusing; that `reopen-handoff` is the operator's act
through capture, as `waive` is. Reopen on the operator's word.
