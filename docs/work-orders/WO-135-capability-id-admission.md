# WO-135 — Planning-gate corrections: a capability write-back is an execution update, the sequence is checked against every typed hard edge, and a planning dispatch refuses a non-document path at write time (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** patch. Planning helpers, the harness classifier's
planning-branch rule and their fixtures change; no contract, schema,
predicate, envelope or product document changes beyond the guide sentences
the write-back names. Assigned at activation under the standing opt-out
default.
**Cost:** removes one purpose-built planning pass, one refutation dispatch
(546 s observed on 2026-09-17) and one final-review diagnosis per
capability-introducing order, paid twice in two days (WO-068, WO-052), and
the class of merge that waits on a planning chore after final review; removes
the hand-run dependency check (this pass ran a 40-line script and found two
violations the R1 pass and its receipt missed). Adds one branch in an
existing helper, one check in `plan check` and the index check, one
write-time path rule in the generated hook, and fixtures; no recurring step,
receipt, key or ritual. Wall-clock, context bytes and tokens of the order are
unmeasured until it runs.

**Nomination provenance:** candidate 1 of
[the planning map](../planning/work-order-map.md#candidates--release-close-and-planning-dispatch-defects-recorded-2026-09-16)
(2026-09-16); the [2026-09-17 admission pass](../lineage/idea-ledger.md),
which filed this order in a narrower form (admit an id a judged order's
criteria name); [receipt 016](../planning/refutations/2026-09-17-planning-023b7806ac203499-016.md),
which recorded that form's gap as a known issue; register items 3 and 10 of
the same map section; the operator's 2026-09-17 direction that a planning
dispatch after a final review is not acceptable. Rewritten by the
[2026-09-17 vision-into-use pass](../planning/vision-into-use-2026-09-17.md)
§4, §7 and §13; the order was never activated. Planner-synthesized.

**Depends on:** nothing. It changes plan machinery already on `main`.

**Recommended placement:** pair 1, first in the queued run, beside WO-136;
before WO-053's reassessment and WO-054's addition. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/plan-continuation.mjs`
`reassessments` and `checkPlanContinuation`; `scripts/lib/plan-subject.mjs`
`buildPlanSubject` (the `standard.capabilities` and `orders` inputs);
`scripts/lib/plan-receipts.mjs` `checkPlanGate`; `scripts/refute-plan.mjs`
`start`; `scripts/work-orders.mjs` (`index --check`);
`packages/skeleton/src/harness-host.ts` (path classification);
`docs/final-reviews/WO-068/FINAL-001.md` §B1;
`docs/final-reviews/WO-052/FINAL-001.md` §B1;
`docs/evidence/WO-052/decisions.md` §WO-052-D005;
`docs/planning/capability-table.md` §Reading the table;
`docs/planning/vision-into-use-2026-09-17.md` §4 and §13 decision 3;
07-execution-guide.md §Operator-opened planning pass (the continuing-work
gate paragraph).

**Objective:** three corrections. (a) An appended
`## WO-NNN dated addition (YYYY-MM-DD)` or `## WO-NNN dated reassessment
(YYYY-MM-DD)` section is an execution update whenever `WO-NNN` is an order
in the judged planning subject, whether or not the capability ids it names
are already known; a new id is recorded as a `dated-capability-addition`
update so the next receipt's subject shows it, and the level claim it
carries is judged by the order's verification, its final review and the
next planning receipt, never by a planning dispatch after a final review.
Every other rule on the appended region — no stray heading, a nonempty
observation cell per row, appended-only, a valid date — is unchanged. (b)
`npm run plan -- check` and `npm run work-orders -- index --check` refuse a
sequence in which an order precedes an order it depends on through a
blocking relation (`hard`, `satisfied-by-release` or `satisfied-by-close`
while unmet, `planning-deferral`), or in which a two-entry pair contains a
blocking edge, naming the orders and the edge; groups of three or more
entries are checked for order only. (c) On a branch created by
`plan start` (prefix `planning/`), the generated Claude hook refuses a
tool write to a repository path outside `docs/` and root Markdown, naming
the path and the `operator override:` route; a path outside the repository
root (the session scratchpad, the temporary root) is not a repository write
and stays admitted; the Codex role text carries the same rule.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- `plan-continuation.mjs:94` refuses any capability id absent from the
  judged subject's `standard.capabilities`. WO-068 criterion 7 and WO-052
  criterion 5 each directed an executor to add a row; each final review
  found `test:docs` red on the branch (B1), each was cleared by a
  purpose-built planning pass and a refutation dispatch, and one branch
  merged with the prerequisite unmet, leaving `main` red. The narrower form
  first filed here keys on criteria naming the id; receipt 016 recorded that
  a dated addition asserts a level and a remaining gate no criterion need
  state, so the class would recur.
- The committed sequence violates two typed hard edges: WO-114 hard-depends
  on WO-120 and precedes it; WO-115 hard-depends on WO-100 and precedes it.
  Receipt 014 judged that sequence aligned; nothing reads the typed blocks
  against the list.
- Register item 10: a planning dispatch committed `scripts/lib/plan-direct.mjs`
  and `scripts/refute-plan.mjs` to its branch, moving WO-068's code
  identity off its reviewed gate; the release refused, correctly, at close
  time rather than at write time.

**Design (scope discipline):**

- (a) is one admitted form beside the existing one in `reassessments`,
  reusing the subject the checker already holds; no new file is read and no
  input is added to the subject hash. Receipts 001 to 016 keep their judged
  subjects.
- (b) reads the typed dependency blocks of the sequenced orders and the
  closed set the index already derives; it is about forty lines and installs
  no scheduler. The sequence document's byte budget is unchanged.
- (c) keys on the branch prefix and the `plan start` record; the rule is
  emitted into the generated hook by the compiler like the two existing
  refusals' advisories, and is advisory in Codex. It classifies only
  repository paths: the refuter's own scratch files and any other write
  outside the repository root are never repository writes.
- **Declined alternatives, recorded:** the criteria-text rule (the first
  form of this order), which leaves the post-final-review dispatch in place
  whenever a criterion does not name the id; a planning pass per filing
  order (the status quo, paid twice); refusing the unsatisfiable order at
  filing time (moves the chore, keeps it); a lane generator or solver;
  typed edit surfaces (a collision by file remains the planner's reading).

**Deliverables:** the three changes; fixtures (the WO-068 and WO-052
sections replayed against receipts 014 and 015; the 2026-09-16 sequence as a
failing fixture and the 2026-09-17 sequence as a passing one; a
planning-branch write refusal); the write-backs below.

**Acceptance criteria (all required)**

1. WO-068's `runtime.resident` section and WO-052's `worker.source-change`
   section are each admitted against the receipt that preceded their
   purpose-built pass (014 and 015), recorded as `dated-capability-addition`
   updates; receipts 001 to 016 remain admissible with their judged subjects
   unchanged, and `plan check` prints the update kind.
2. A dated section whose heading names an order absent from the judged
   subject, an invalid date, a stray heading or an empty observation cell is
   refused with the current messages.
3. `npm run plan -- check` and `npm run work-orders -- index --check` fail
   on a fixture sequence carrying the two 2026-09-16 violations and on a
   two-entry pair with a blocking edge, naming the orders and the edge; both
   pass on the sequence committed by the 2026-09-17 pass; a group of three
   or more entries is checked for order only. A fixture pins that the
   committed 2026-09-17 sequence parses as fourteen two-entry pairs and one
   serial run, and fails if a blank separator is lost or added.
4. On a `planning/*` branch, a Claude tool write to a repository path
   outside `docs/` and root Markdown is refused by the generated hook with
   the path and the override route named; a write under `docs/` and a write
   to a path outside the repository root are admitted unchanged; the Codex
   role text carries the rule; the regenerated bundle passes `harness check`.
5. Write-backs land: 07 §Operator-opened planning pass (the continuing-work
   gate paragraph says appended dated capability sections for orders in the
   judged sequence are execution updates, new ids included, judged by
   verification, final review and the next receipt; one sentence on the
   topology check; one on the planning-branch write rule); the hook-boundary
   count in `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary, 07
   §Discipline and the compiled instruction sentence, each naming three
   refusals with this order as the source; the map's candidate 1 and item 10
   dispositions; the decisions record.
6. `npm run test:docs` green, including `plan` and
   `plan-refutation-current`; `npm test` green; `git diff --check` clean;
   no new dependency; this order introduces no capability id.

**Evidence gate:** the fixture transcripts; `npm test` once at final
review, recorded as the reviewer product-gate row.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** changing receipt format, subject composition, judgment
semantics or the receipt chain; retroactively editing filed receipts or the
two purpose-built passes, which stay as the record of what they cost; a
scheduler or lane generator; typed edit surfaces; any capability-level
promotion; any document reorganization.

**Operator-review assumptions**

1. A capability row written by an executor under a judged order is judged
   by that order's verification and final review and by the next planning
   receipt's subject; the plan gate judged plans, never rows. A reviewer may
   require the update kind to appear in `plan check` output.
2. The planning-branch write rule is keyed on the branch prefix; an operator
   who needs a code change during a planning pass uses `operator override:`
   and files the order.
