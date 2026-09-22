# The Entropy Reducer's dispatch — the reviewer read, its launcher filed, the register judged, the sequence at its limit (2026-09-22)

Planning pass opened on `main` at `4d52b540` on branch
`planning/2026-09-22-entropy-reducer`. Document-only. The operator's dispatch
was the bare phrase `planning: entropy reducer`, captured verbatim in ignored
intake (`docs/intake/notes/2026-09-22-entropy-reducer-planning.md`, SHA-256
`ec4a8735b1d8c3343d391f84317cbefd2dcfc7dda92d37e9110f404a4403f2bc`), received
at 2026-09-22T00:05Z (the evening of 2026-09-21 local). No other operator text
arrived. The pass files [WO-151](../work-orders/WO-151-entropy-reducer-dispatch.md)
for its subject, paired with
[WO-152](../work-orders/WO-152-mission-check-schema-ids.md) from the
register's untriaged rows; a second nomination was drafted as WO-153 and
withdrawn before commit because the sequence reached the subject's limit of
100 orders (section 4). The pass disposes every pending follow-up row,
records three candidates, and writes three product paragraphs. It does not run a review, reopen the roadmap, implement anything
or change a setting.

Labels: **observed** (a command or file on this machine showed it),
**inferred** (stated with its evidence), **unknown**.

## 1. What was asked, and how the pass read it

The dispatch names the Entropy Reducer and nothing else. Product 07's
planning section separates three things an operator can reach for: a planning
pass, the Entropy Reducer (a compiled review loadout dispatched separately
against a frozen subject, which stops at operator disposition) and the Repo
Gardener. A planning pass "may consume an Entropy Reducer's surviving
findings as input" but cannot be one. The pass therefore read the dispatch as
"plan the Entropy Reducer's next step", the reading under which the work is
useful whether the operator meant "make it usable" or "run it": in both cases
the observed state (section 2) has to change first. The other reading, that
the pass should run a review now, is recorded as a declined alternative in
section 7 with what it would cost by the only observed run; the operator can
dispatch that review at any time from the existing guide.

Observed state at entry:

- Every order through WO-149 is final-reviewed; the index lists 51 closed
  entries in the proposed order and the next queued pair is WO-120 and
  WO-063. `v0.40.2` is the latest published Release (2026-09-22T00:04Z); the
  worktree list holds only `main`; `npm run plan -- check` passes, reporting
  WO-149's release assignment and WO-147's capability reassessment as
  admitted execution updates against receipt 023, which this pass's receipt
  rebinds.
- The follow-up register: 504 entries, 129 pending, 12 untriaged, four
  invalidated dispositions (`needs-review`), three open. Section 4.
- Process cost at entry: 80,701 tokens at dispatch scope, source
  `claude-transcript-message-usage`, observed 2026-09-22T00:05Z; dollars
  unavailable. Subagents: none used at entry, cap twenty; the plan for the
  cap is one fresh background refuter and nothing else.

## 2. The reviewer as it stands (observed)

- **Shipped and run once.** WO-023 compiled the Entropy Reducer at `v0.5.0`:
  identity, role, Shine active linked to Standardize plus seven supports, a
  read-only envelope with bounded scratch and intake-capture writes, a manual
  program, typed validators and a generated residue. `runs/` holds
  `REVIEW-001` and `REFUTATION-001`, both of 2026-09-04 against the
  pre-repair WO-023 subject at base `e3e639fe`: seven findings, all seven
  survived the blinded refutation, one proposal packet. Nothing since.
  WO-142 advanced the Shape-First support to v2 on 2026-09-19 and
  regenerated the residue; the historical receipts keep their bytes.
- **No launcher.** The operator guide says there is no `npm run
  entropy-reducer` or `resume: entropy` command and lists five host steps a
  separate Fable 5.1 `max` session performs by hand: compile the reviewer
  WorkOrder, follow the manual program, validate the output, dispatch and
  bind a fresh blinded refutation, stop at disposition. The five APIs those
  steps name (`compileReviewerWorkOrder`, `validateReviewerOutput`,
  `prepareReportEmit`, `selectFindingsForRefutation`,
  `buildRefutationReport`) have no caller outside
  `packages/skeleton/src/loadouts/entropy-reducer.ts` and its two tests
  (`grep -rn` over `packages/*/src`, `scripts` and `corpus`). The guide names
  "a dedicated launcher" among its future capabilities.
- **The one run could not run commands.** `REVIEW-001.json` records
  `restricted: true`, `safeMode: true` and seven `permissionDenials` of the
  shell: the census, the whitespace check, the build with the test suites,
  the build alone, the formatter and two probes. One of the seven findings is
  `measured`; six are `by inspection`. The compiled envelope permits
  `probe.run:scratch*` and the mutation-drill support asks for perturbations
  in a scratch copy.
- **Its output has nowhere to go.** The proposal packet was not filed:
  `docs/proposals/` does not exist and product 03 records that neither
  episode had filing authority. The follow-up collector harvests formal
  candidate headings in product and planning documents and decision records
  (`markdownFiles` walks `docs/planning/` subdirectories other than `archive`
  and `refutations`); a review receipt is neither, so a surviving finding has
  no route into the register a planning pass reads.
- **The cost of a cycle is known.** The review: 98 turns, 1,019,575 ms,
  USD 10.52 list, 81,786 output tokens over 2.26 M cache-read tokens. The
  refutation: 54 turns, 745,923 ms, USD 6.22, 65,091 output tokens. About
  29 minutes and USD 17 for one full cycle at the pinned actor.
- **Its sibling has everything it lacks.** WO-041 compiled the planning
  refuter from the same identity (the Contra-Auguste mask, the
  architecture-and-semantics lens). `npm run plan -- refute` prints a
  canonical prompt and closed schema for one fresh background worker and
  retains the pending dispatch (`beginDirectRefutation`); `runPlanRefutation`
  runs the print or Codex transport in an empty scratch cwd with `--model`
  and `--effort` on the command line and records both as host-launch
  selections with effective readback unknown; `writePlanReceipt` files an
  immutable numbered pair and appends to `docs/control/plan-refutations.jsonl`.
  External CLI launches need an explicit operator request; the `fake`
  transport serves fixtures and cannot satisfy a gate.
- **What the critical path already decided about it.** The 2026-09-08 pass
  found that "the only candidate producer is the Entropy Reducer's manual
  review with `Program.All`", filed WO-119 as the executable producer and
  made WO-100 consume only it; FUP-0006 declined implementing `Program.All`
  until a consumer needs concurrency inside one program. WO-023 recorded the
  Sustain cadence as a candidate, not a default; FUP-0009 and FUP-0016
  declined a general scheduler and the harness cron. None of that changes
  here: the reviewer is not a producer and stays on demand.

## 3. The decision: a dispatch as a command, and its design

The platform lens in product 07 asks four things of any capability an order
lands: it arrives as an interface something else consumes, it is
externalizable by construction, this repository consumes it first, and a
stranger to the session can use it. The compiled reviewer passes the second
(content-addressed inputs, a declared output contract, no private setting) and
fails the other three: its dispatch is a ritual in a guide, its receipts were
written by hand, and its findings reach no consumer. The refuter shows the
fix is a host, not a loadout change.

WO-151 therefore files one seam, the reviewer's dispatch host, mirroring the
refuter's: `npm run entropy -- review` freezes `HEAD` of a clean tree into a
fresh scratch root under the system-temp grant WO-144 gives every role,
records the tracked-status hash and a scratch inventory, compiles the
reviewer for that repository and base with a fresh episode id, and prints the
canonical prompt and the typed output schema for one fresh worker; `receipt`
validates the return with the loadout's own validators against that exact
WorkOrder and episode, refuses a changed tracked status, and files the next
numbered immutable `REVIEW-NNN` pair; `refute` prints only the blinded
subjects the compiled selection rule chooses; `refutation-receipt` binds the
attempts; `dispose` records accept, defer or dismiss per surviving finding and
per packet; `check` proves the chain. Six design points carry the judgment:

1. **The actor pin is a fact of the invocation, not a claim.** The loadout
   pins Claude Fable 5.1 at `max` and its substitution policy is
   "different reviewer and must be attested". The print transport passes
   `--model` and `--effort` on the command line, so the pinned route records
   both from the invocation, as REVIEW-001 did. A background worker spawned
   from a session has no effort readback; it is recorded `session-attested`
   with effort `unknown` unless the operator attests it, and the receipt
   names any reviewer that does not match the pin by readback a substitute.
   No default silently selects another model (inferred design; the
   evidence is `worker-transport.ts`'s argument lists and
   `runPlanRefutation`'s attestation fields).
2. **The worker may run commands inside the frozen copy and nowhere else.**
   REVIEW-001's seven denials are the measured-versus-inspection loss; the
   envelope already permits scratch probes. The review profile admits reading
   and running in the scratch copy; if that needs a request kind in
   `worker-protocol.ts`, a registered source, the executor records the
   decision, bumps the component and carries the edition duty.
3. **Receipts are immutable and numbered; the first pair is never
   re-bound.** A control log binds each filed pair by SHA-256; `check` fails
   on a hand edit; `REVIEW-001*` and `REFUTATION-001*` are pre-mechanism
   evidence.
4. **Disposition is the operator's act and produces a consumer.** `accept`
   on a surviving finding writes a list item under a formal candidate heading
   in a generated `docs/planning/entropy-reviews/REVIEW-NNN.md`, which
   `npm run meta` already harvests, so the next planning pass sees the
   finding as a register row with its criterion, surface, altitude and
   standardization rung; `accept` on a packet files it under
   `docs/proposals/<suggestionId>/` as product 03 specifies; a refuted,
   blocked or unselected finding cannot be accepted; promotion stays a
   planning act.
5. **Nothing in the loadout moves.** The identity, role, supports, envelope,
   program, residue and the artifact-identity hash are unchanged
   (criterion 9); `Program.All` stays deferred, and the host drives the
   compiled manual plan as the refutation host drives its one-shot order.
6. **Cost stays visible and un-capped.** The receipt carries the transport's
   counters or a WO-140 cause code; no meter dispatch column is added (a
   candidate, section 4); the dollar ceiling stays unset.

The live row is one review of the activation commit and one refutation
through the pinned route, filed as REVIEW-002 and REFUTATION-002, with the
operator's authorization of the external CLI launch recorded in the
decisions; the operator's dispositions afterwards are the reopening
observation, and the next planning pass reading their rows is the first
consumption. A failed run files its receipt and does not close the order.

## 4. The register: fourteen untriaged and four invalidated rows, disposed

The rows were read whole from `docs/planning/followups.json` and each source
decision was read in its decisions file. After `npm run meta` synced this
pass's own candidate section, the untriaged count was fourteen (twelve from
the five orders closed since 2026-09-21, two from this pass).

| Class                                                                                                              | Rows | Disposition                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-order repair directives and review routings the order's own cycle discharged (WO-138 D007; WO-148 D012 to D014; WO-147 D008) | 5    | settled, each with the closing evidence (VER-002 and FINAL-001 passes; the D010 re-mint inside WO-147's review)                                                                                                                                                                                                                  |
| Decisions and rules in force with no outstanding action (WO-150 D008; WO-147 D010)                                 | 2    | settled: the Cost-line rule applies to no order filed here; the planner rule from WO-147 D010 is written into product 07's planning section and applied to WO-151 and WO-152                                                                                                                                                     |
| The nomination that names an order this pass files (WO-148 D009)                                                   | 1    | allocated to WO-152                                                                                                                                                                                                                                                                                                             |
| The nomination drafted as WO-153 and withdrawn (WO-149 D009)                                                       | 1    | deferred: the sequence would hold 101 orders against the subject's limit of 100; the draft is retained in the local control lane and its design is in section 5; filed when the operator changes the horizon                                                                                                                    |
| Boarded limits with their own reopening observation (WO-138 D011's note on `worktree integrate`'s provisional first pass; WO-138 D012; WO-148 D002) | 3 | deferred on the decision's own observation                                                                                                                                                                                                                                                                                      |
| This pass's three candidates (Sustain for the reviewer; a meter column for its dispatches; the sequence at its limit) | 3  | the first two deferred with the reopening observations in the map's section dated 2026-09-22; the third open for the operator                                                                                                                                                                                                   |
| Invalidated dispositions re-read at their new source revisions                                                     | 4    | the workstream application stays allocated to WO-080 to WO-083; the local-model candidate is deferred after WO-138's `inconclusive` disposition (only T2 qualifies); the resident-binding and Tinkerer candidates are settled by WO-148 (v0.40.0) and WO-150 (v0.39.0) with their own reopening observations                     |
| The Shape-First wording row (FUP-0063, allocated to WO-142)                                                        | 1    | settled: WO-142 shipped support v2 and regenerated the residue                                                                                                                                                                                                                                                                  |

Twelve of the fourteen fresh rows came through the `followup` field; five of
them were in-order directives, which is under the ten that product 07's
settlement candidate names as the trigger for making the verifier role-text
fix an order. The three open items (the planner-startup measurement, the
pasted-dispatch judgment and the cold-gate cuts) are untouched: none gained
an observation this pass could record.

The two nominations deserve their own line. WO-148 D009 reproduced, against
a real bound store, that every `claude-cli-print` mission check fails before
any model call because the `contract-clause` reference enum carries each id
twice for an unchanged contract and the Claude CLI refuses the schema; the
order did not fix it in flight because the schema is shared by every CLI
request kind and needs a component bump. WO-149 D009 recorded that a Codex
lifecycle dispatch whose session begin throws exits 1 after its transition
has been appended, suppressing the briefing with the allocated report path;
WO-149 D001 had rejected a catch because it would hide causes, and both
planning receipts named the failure behavior the mechanism should have. Each
is a broken window under WO-142 row B17 (fixed, or boarded up as a record
naming its follow-up) and each record names its follow-up as an order. Under
the operator's 2026-09-19 direction that a pass plans what it finds, both
were drafted as patch orders. Only one could be sequenced: with WO-151 and
both patches the sequence held 101 orders, and the planning subject refuses
more than 100 (`scripts/lib/plan-subject.mjs`, observed by `npm run plan --
check` and `npm run meta -- --plan-cost`). Closed entries remain until the
operator changes the horizon, by the sequence's own rule, and 51 of the 100
are closed; a planner does not retire them. WO-152 is kept because WO-100's
and WO-111's mission checks depend on it; the WO-153 draft is retained in
the local control lane (`docs/control/local/plan/`), its design is recorded
in section 5, and its row is deferred until the operator changes the
horizon. The limit itself is candidate 3 in the map, open for the operator.

## 5. Two orders, and one withdrawn draft

**WO-151 — Entropy Reducer dispatch.** Section 3. Cost: one command family,
one control log, one document check, per-run receipts, and the edition duty
for the root `package.json`; removes the five hand-performed host steps, the
operator-authored prompt and hand-written receipts; expected, not measured,
the measured-evidence loss of a reviewer that cannot run commands. Minor.
Not on the critical path's typed graph; it is the step that makes a shipped
capability consumable, and the review it produces is planning input before
R2.

**WO-152 — Mission-check schema without duplicate ids.** `missionReferenceIds`
returns each clause id once in first-seen order; a regression walks every
enum of the emitted schema for an unchanged and a changed contract; the
skeleton component moves with the edition duty; one live `claude-cli-print`
mission check against a real bound store returns a verdict. Patch. Paired
with WO-151 (disjoint files; both re-mint the editions, which the second
final review re-mints again on integration as WO-147's did) and placed
before WO-100 because its resident runs the mission check on the transport
the operator chooses at launch, and today only the Codex transport works.

**WO-153 — Codex session entry advisory (drafted, withdrawn).** One catch
around the begin call in `scripts/resume.mjs`, an advisory in the form the
unbuilt-runtime branch already prints, carrying the error's message and the
`no-session` cause code, and a fixture over the five dispatches, asserting
exit 0, the briefing on stdout, the advisory on stderr, the transition intact
and a usage readback of `unknown; cause no-session`; the already-began and
no-thread cases unchanged. Patch; no live row (the path was reproduced by
probe, not observed live). Depends on WO-149 only; pairs with anything that
does not edit `scripts/resume.mjs` or the process-debt fixture. Withdrawn at
the sequence limit (section 4); the full draft is retained locally so the
next pass files it in minutes.

Each filed order carries `Model:`, three-role `Effort:`, a `Cost:` naming additions
and removals, provenance, a dated observed gap, criteria, evidence, non-goals
and operator-review assumptions, and a typed dependency block whose inputs
are all closed.

## 6. The sequence

| Slot | First lane                              | Second lane                          | Why they do not collide                                                                                                                                                                                                              |
| ---- | --------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 9    | WO-120 derived work identity            | WO-063 outward-artifact lint         | Unchanged.                                                                                                                                                                                                                           |
| 9a   | WO-151 Entropy Reducer dispatch         | WO-152 mission-check schema ids      | `scripts/entropy.mjs`, a new library and test, root `package.json`, the instance guide and receipts, against the mission-check protocol, its test and the skeleton package. Both re-mint the editions; the second final review re-mints again. No hard edge. |
| 10   | WO-100 preauthorized portfolio          | WO-064 target publish                | Unchanged.                                                                                                                                                                                                                           |

Everything from slot 10 onward is unchanged in content and order. WO-152
precedes WO-100 and WO-111 for the reason in section 5. The typed check over
the whole list runs in `npm run plan -- check` and `work-orders index
--check`. The sequence now holds 100 orders, the subject's limit; the
sequence file measures above the `sequenceBytes` ceiling and the pass
records a dated acceptance under the standing route (section 9).

## 7. Declined alternatives — the NoOp register of this pass

- **Do nothing: leave the reviewer as a guide.** What happens: the
  capability shipped at v0.5.0 stays unused while the repository grows, the
  guide's five steps stay a ritual only the WO-023 session has performed,
  and the planning passes keep consuming verifiers' in-order findings only.
  Declined. Reverse if the operator withdraws WO-151.
- **Run a manual review now, as part of this pass.** The reviewer is
  dispatched separately against a frozen subject in a separate session, and
  a document-only pass runs no model episode; the cost is known (about USD
  17 and 29 minutes) and the operator can dispatch it from the guide today.
  Declined for the pass; not for the operator. Reverse never: this is a
  boundary of the pass, not a judgment of the review.
- **A new dispatch phrase, role and role skill for the reviewer.** A bundle
  change with cold-start cost for a command any session can run; WO-023's
  own non-goal ("a new dispatch prefix; optional later"). Declined; reopen
  if the command's writes need a role grant the planner and executor roles
  do not carry.
- **Implement `Program.All`.** FUP-0006's NoOp stands; the host drives the
  manual plan as the refuter host does. Declined.
- **Sustain: run the reviewer after each release close during absence.**
  Candidate 1 of the map's 2026-09-22 section; the portfolio consumes only
  WO-119 and a scheduler was declined. Declined for now.
- **Classify `npm run entropy` as `lifecycle.run`.** Edits
  `harness-command.ts`, a registered source, for a refusal nobody has
  observed; the command runs as `shell.run`. Declined; reopen on an observed
  refusal.
- **Snapshot a dirty tree with an inventory, as the guide admits.** Refusal
  by path is smaller and the operator can commit. Declined.
- **Record the reviewer's cost under the refuter's meter role.** Untrue.
  Declined; candidate 2.
- **Fold WO-152 into WO-100 or WO-111.** Proof and feature orders with their
  own seams; a schema fix inside them re-keys their evidence. Declined.
- **Leave WO-148 D009 for the next standard pass.** A boarded broken window
  whose record names an order, patch-size, on the path WO-100's mission
  checks use, and the operator directed on 2026-09-19 that a pass plans
  what it finds. Declined.
- **Retire closed entries from the sequence to make room for WO-153.**
  Closed entries remain until the operator changes the horizon, by the
  sequence's own rule; a planner does not change the horizon. Declined;
  candidate 3, open for the operator.
- **Sequence WO-153 in place of WO-152.** WO-153's path was reproduced by
  probe and not observed live; WO-152's failure is observed on every
  print-transport mission check and precedes the critical path's proof
  orders. Declined; reverse if a Codex dispatch is observed exiting non-zero
  from the entry call first.
- **Fix WO-149 D009 as the graceful unknown Copilot has.** Hides the cause;
  WO-099 D035's rejection and WO-149 D001's. Declined.
- **Place the WO-151 and WO-152 pair after WO-100 and WO-064.** WO-100's
  live evidence runs the mission check on the launch transport; with only
  the Codex transport working, the print transport would be excluded from
  the proof by a known defect. Declined.
- **Gather WO-138 D011, WO-138 D012 and WO-148 D002 as candidates.** Each is
  one row with its own reopening observation; a candidate heading would
  duplicate the row. Declined; the rows are deferred.
- **Spend surveys on the register or the source.** Fourteen rows and the
  reviewer's own files fit one session's reading; no subagent was spent
  before the refutation. Declined.

## 8. Goal alignment

Mission and critical path: WO-151 is operator flow and quality machinery,
not a typed gate on the route to M3; it makes a shipped capability
consumable and produces planning input before R2, and it is placed so it
delays nothing. WO-152 removes a defect that would exclude the print
transport from WO-100's and WO-111's mission checks and is placed ahead of
them. The withdrawn WO-153 draft is operator flow and waits for room. NoOp
for each: the reviewer stays a guide; every print-transport mission check
keeps failing before a model call; a Codex dispatch can keep exiting 1 after
recording its transition until WO-153 is filed.

The eight traps, where material. _Policy resistance_: WO-151 changes no
authority, residue or pin, so the reviewer's own invariants (read-only
control plane, every finding reproducible, refuted findings leave the
promoted set) are enforced by the same validators, not fought by the host;
the withdrawn WO-153 draft keeps D001's visibility rather than reversing it.
_Commons_: this pass spent no survey agents and one refuter; a review cycle
is USD 17 and 29 minutes by observation, on demand, with the dollar ceiling
left unset and visible in every receipt; no recurring check is added beyond
one document check. _Drift to low performance_: the receipt's attestation
is from the invocation, and a substitute is named as one; the register rows
are settled against each order's closing evidence, not the row count.
_Escalation_: no new gate, hook, role or mandatory run; the review is an
operator choice. _Success to the successful_: the refuter's host pattern is
reused rather than a second host invented, and the reviewer gets the path
the refuter already has. _Shifting the burden_: WO-151 removes the
hand-performed host steps and the hand-written receipts; WO-152 removes
the workaround of choosing the Codex transport; the withdrawn WO-153 draft
would remove the rescue of re-deriving a report path from the control log. _Rule beating_: the receipt
binds the frozen commit and the tracked-status hash before and after, the
refutation sees only blinded subjects, and a run with denied commands is
visible in its `permissionDenials`; WO-152's regression must fail with the
deduplication removed. _Wrong goal_:
the outcome is findings a planning pass can consume, not receipts; a
review's dispositions are the reopening observation, not a criterion.

Naive Interventionism: each order names the existing function it keeps (the
loadout and its validators; the mission-check validator), its consumers (the
next planning pass; WO-100's resident) and a smallest probe (the `fake`
transport end to end; the schema regression).
NoOp is recorded per order above and per alternative in section 7. Platform
lens: WO-151's dispatch arrives as a command and a receipt other tools can
read, its inputs are the frozen commit and the compiled contract, this
repository consumes it first (REVIEW-002 against its own `main`), and a
stranger to the session can run it and read its receipt.

## 9. Evidence and cost of this pass

Read-only inspection of `main` at `4d52b540`: canonical status, the sequence
and index, the 2026-09-21 planning document and receipts 022 and 023,
product 07's planning, ideation and goal-alignment sections, the operator
guide, refutation plan, residue and both run receipts of the reviewer, the
loadout module's exports and lens briefs, the refuter's host, protocol,
direct helper and receipt helper, the transport's argument lists, the
harness command classifier, the follow-up collector, the registered
evidence sources, the decision files of the five orders whose rows were
untriaged, the mission-check protocol and the dispatch command at the lines
the decisions cite, the map's candidate sections, the budgets file and the
cost table. Commands: `npm run resume`, `npm run plan -- check`, `npm run
plan -- followups`, `npm run meta -- --check`, `npm run meta -- --plan-cost`,
`npm run publication:check`, `git log`, `git tag`, `git worktree list`,
`gh release list`. Two limits were met and are reported rather than worked
around: the subject's 100-order limit (section 4) and the sequence file's
`sequenceBytes` ceiling of 8,192 bytes, which the file exceeds by
81 bytes after this pass's one paragraph, the shortest that still names
the pair, its reason and its evidence; the preamble carries one paragraph
per pass and this pass does not edit earlier passes' paragraphs. Under the
standing 2026-09-17 route (raised to the measured bytes plus one 4 KB step
with the rule named, never trimmed around or left advisory across orders)
the pass records a dated acceptance in `docs/control/budgets.json` at
12,369 bytes; the operator's horizon decision (candidate 3) is the
structural answer to both limits. No model call
was made outside this session; no subagent was spent before the refutation.
Usage counters at entry are in section 1; the handoff counters are in the
response and the ignored receipt. No file outside the repository was written
except the ignored intake capture and the granted scratch directory.

## 10. Reversal conditions for this plan

- REVIEW-002 is filed and its dispositions produce no register row a
  planning pass uses: reopen WO-151's disposition design with the receipt.
- A second cycle's cost exceeds what the operator accepts: the reviewer's
  cadence question closes as "on demand only" with the figure.
- The review profile cannot admit commands inside the scratch copy without
  a change the executor judges out of scope: WO-151 files its receipt with
  the limitation and returns to planning rather than widening.
- Another request kind's schema is refused by a CLI after WO-152: a generic
  schema check becomes an order.
- A Codex dispatch is observed exiting non-zero from the entry call before
  WO-153 is filed: the deferral ends and the draft is filed first when room
  exists.
- The operator changes the horizon: WO-153 is filed from its retained draft.
- WO-111's hour closes and the operator asks for a cadence: candidate 1.

## 11. Independent review

Receipt
[2026-09-22-planning-9244f56be13bcb2f-024](refutations/2026-09-22-planning-9244f56be13bcb2f-024.md):
one fresh background reviewer, given only the canonical prompt (136,126
bytes, read in six contiguous byte slices by its own statement), judged the
committed subject at `7dc14bd3`. Its first run stopped on a server-side
overload (HTTP 529) before writing anything and was resumed from its own
transcript with the same prompt; it remained the pass's single spent
subagent of the twenty-agent cap. Pass scope: WO-151, WO-152 and the
sequence; 98 verdicts carried by hash. Verdict `aligned-with-findings` for
both orders and the plan; no hold; seven known issues, zero observed
failures, zero vision contradictions. Dispatch to file took 1,611 s,
observed, with no pass-budget refusal. The reviewer made no repository or
Git writes and spawned no agents; one of its scratchpad writes was refused
by the outside-write hook and it built its result through stdin instead,
which is the fifth refusal working as designed.

The reviewer's answers to the four questions, in short. WO-151 unblocks no
critical-path gate and names no blocked outcome; its NoOp cost is the hand
route's unmeasured operator time plus per-cycle model spend the command does
not change. Its removal balance is no: the five hand steps, the prompt and
the hand-written receipts are removed, but the guide keeps them as the
recorded fallback and the recovered measured evidence is expected, not
measured. Its failure behavior is mixed: rejected results and failed live
runs degrade to receipts, while a crash between filing a receipt pair and
appending its control event would fail the shared document gate for later
orders. WO-152 names gate R's outcome (WO-100 and WO-111's mission checks on
the print transport); its removal balance is yes in effect, a whole
transport restored for one function's deduplication; and its failure
behavior degrades to today's refusal.

The known issues are carried into each order's catalog row for the
executor's decisions. The ones that change how the orders should be run:
WO-151's decisions must name the gated order or outcome its accepted
findings serve; REVIEW-002's receipt must record its restricted flag, the
count of denied commands and the measured-versus-inspection split of its
findings against REVIEW-001's one of seven, because the Cost line's
principal benefit is checked by no criterion; a live row labeled substitute
reviewer or effort `unknown` does not satisfy criterion 7 as the pinned
route; filing a receipt pair and its control event must be atomic, or the
check must tolerate the gap, so the entropy lane never exports a refusal
into the shared gate; and the document check's gate step is reported against
the drift signal the meter already flags. WO-152's regression must walk the
`evidence` enum too, since `missionEvidenceIds` is untouched by the named
change, and its fixture must carry a story contract so the third reference
source is proven kept; another CLI-refused schema reopens the generic check
the non-goals decline. The order texts stand as judged; none of the seven
issues is a hold, and a criterion edit after the receipt would re-key the
subject for wording the catalog rows now carry.

After the receipt the operator directed, in one line captured verbatim in
ignored intake (`docs/intake/notes/2026-09-22-entropy-reducer-planning-operator-answer.md`,
SHA-256 `8eb879ee92bf9ff753c02f65c0ad6db352b57084d86c79e9ae94df9c7e51727b`),
that the pass push the branch and open the pull request at the end.
`npm run test:docs` after the receipt: recorded in the handoff.
