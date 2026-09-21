# A standard pass after the WO-069 close — the queue read, the register judged, three orders filed (2026-09-21)

Planning pass opened on `main` at `502d85f9` on branch
`planning/2026-09-21-standard-pass`. Document-only. The operator's dispatch
was the bare phrase `planning: standard planning pass`, captured verbatim in
ignored intake (`docs/intake/notes/2026-09-21-standard-planning-pass.md`,
SHA-256 `acdab88941228bca9089f0d8a9cd544eda4185ab0fffadb7b58fdfdbe3e1701d`).
No other operator text arrived. The pass files three orders,
[WO-147](../work-orders/WO-147-resident-lock-contention.md),
[WO-148](../work-orders/WO-148-resident-binding.md) and
[WO-149](../work-orders/WO-149-codex-sessions-begin.md), places them, disposes
every pending follow-up row, and records five gathered candidates. It does
not reopen the roadmap, implement anything or change a setting.

Labels: **observed** (a command or file on this machine showed it),
**inferred** (stated with its evidence), **unknown**.

## 1. What was asked, and what the pass found

A standard pass between orders has three duties: retime the queue against
what closed, read what the closed orders boarded for planning, and file what
the evidence supports. Observed state at entry:

- Every order through WO-069 is final-reviewed; the index lists 45 closed
  entries and the next queued pair is WO-138 and WO-071. `v0.37.2` is the
  latest published Release (`gh release list`, 2026-09-21T06:23Z); the
  worktree list holds only `main`.
- Since the 2026-09-20 Copilot pass (PR #97), nine orders closed: WO-140,
  WO-056, WO-145, WO-146, WO-090, WO-110, WO-099, WO-079 and WO-069, PRs #98
  to #106. Since receipt 021 (2026-09-20T13:08 local), five of them.
- `npm run plan -- check` passes: 21 receipts, 11 passes; the continuation
  reports release assignments on WO-110 (`v0.36.0`), WO-099 (`v0.37.0`) and
  WO-079 as admitted execution updates against receipt 021's subject. The
  receipt this pass files rebinds them.
- The follow-up register: 486 entries, 149 pending, 67 untriaged, six
  invalidated dispositions, two open items. The settlement candidate's
  reopening condition ("untriaged rows pass fifty after WO-142 closes") has
  fired. Section 3.
- One operator-raised candidate since the last pass: binding a resident to
  the active work, recorded during WO-099 as a planning document. Section 4.
- Process cost at entry: 80,607 tokens at dispatch scope, source
  `claude-transcript-message-usage`, cutoff 2026-09-21T06:25Z; dollars
  unavailable. Subagents: none used at entry, cap twenty.

## 2. The next pair, and the queue retimed

**WO-138 and WO-071 stand.** WO-071's inputs are closed (WO-069 at
`v0.37.2`, WO-042); it has no open input. WO-138's amended preflight
(2026-09-19: activate on WO-137's successful live row, since every input is
public) is met: WO-137 recorded successful inference on the pinned artifact
(the schema and tool round trip, the byte-identical determinism triple, the
cancel within five seconds; product 06's candidate paragraph), and WO-110
D007 recorded a further live row on 2026-09-20 — one inspection episode
against the same runner, HTTP 200 in 21 ms, dispatch 14,559 ms, status
completed, a schema-valid envelope. Two WO-110 decisions are carried into
WO-138's activation preflight in the map: the runner does not echo the
requested model, so the pilot must take the answering model's identity from
the runner, never from the request (D007); and the transport's bare-null
body is guarded by the next order that edits it, WO-138 if it comes first
(D012). The pair's surfaces are disjoint (`scripts/probes/` and an evidence
directory against `scripts/lib/config.mjs`, `work-orders.mjs` and
`resume.mjs`) and neither depends on the other.

**What changes.** WO-147 and WO-148 form a new pair directly after WO-138
and WO-071; WO-149 takes a one-entry slot after them, as WO-146 did, and may
run in the second lane beside whichever of the pair is still open. No
existing pair is recut; the pairs from WO-120 and WO-063 onward move one
slot later. Section 6 has the table. The typed check over the whole list
(every hard edge respected, no hard edge inside a pair) is run by
`npm run plan -- check` and `work-orders index --check` in the document gate.

**The meter's one reopen candidate.** `npm run meta` reports the
drift-to-low-performance signal worsened over three consecutive order deltas:
the gate's step count rose 65, 72, 73, 74, 80 across WO-090, WO-110, WO-099,
WO-079 and WO-069, each order adding suites or cases. It is planning input,
not a hold. Nothing is allocated: the count grows because orders add tests,
which is the intended direction; whether the gate's wall-clock follows it is
the cold-gate candidate's question below, and it still lacks a per-suite
breakdown.

**Gate durations, re-measured for the open cold-gate candidate.** The
thirteen final-review product gates recorded from 2026-09-19 to 2026-09-21
(WO-142 to WO-069) ran 256 to 536 s, median 483 s; eleven exceeded six
minutes. The `FinalReviewCompleted` gate row still carries a duration, a code
identity and an exit code and no per-suite durations, so the candidate stays
open for the same reason as before: an order written without the breakdown
would guess.

## 3. The register: 67 untriaged rows, read and disposed

The rows were read whole by script rather than through the feed's pages
(section 4 of product 07's planner-startup candidate records why). Their
composition, observed:

| Class                                                                                                     | Rows | Disposition                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-order repair directives (a verifier's `followup` beginning "In resume: fix" or "Repair ... VER-001 F") | 16   | settled: discharged by the order's own repair cycle before it closed (WO-099 repairs one to five, VER-003 pass; WO-069 repair one, VER-002 pass)                                    |
| Decisions reopened by those repairs (WO-069 D004, D006)                                                   | 2    | settled: the reopening was repaired in the same cycle                                                                                                                              |
| Final-review routings the review discharged (WO-143 D003, D005; WO-056 D006, D007)                        | 4    | settled: FINAL-001 of WO-143 corrected the wording and added the discriminating assertion; WO-056 D008's scope expansion repaired both runtime defects                              |
| Decisions in force with no outstanding action (WO-084 D001; WO-099 D003, D007; WO-110 D004, D010; WO-146 D010, D011) | 7 | settled with the closing evidence named (the live row, the envelope, VER-002's resolved row, the outcome fields)                                                                     |
| Nominations that name an order this pass files                                                            | 3    | allocated: WO-143 D004 and WO-069 D015 to WO-147; WO-099 D035 to WO-149                                                                                                            |
| Nominations that name a queued order                                                                      | 6    | allocated as catalog carry-ins: WO-110 D007 and D012 to WO-138; WO-069 D005, D016 and D017 to WO-070; WO-090 D007 to WO-085                                                       |
| The operator's resident-binding candidate                                                                 | 1    | allocated to WO-148                                                                                                                                                                |
| The pasted-dispatch candidate                                                                             | 1    | open: the operator's judgment (section 4)                                                                                                                                          |
| Everything else                                                                                           | 27   | deferred, each with its source's own reopening observation; five seams gathered as candidates in the map's 2026-09-21 section so the next order that opens one takes its rows together |

The threshold fired for a different reason than the one it was written
against. The 2026-09-19 candidate feared the migration refill; these rows
are WO-142 row B17 working as intended (a defect met is fixed or boarded up
as a record naming its follow-up). What the feed cannot tell apart is a
verifier's routing inside an order, which the order discharges before it
closes, and a nomination that outlives the order. Twenty-two of the 67 were
the first kind. No collector change is allocated: the smallest fix is
verifier role text (in-order routing goes in the decision and the report;
`followup` is reserved for what outlives the order), a bundle regeneration
for the next order that edits the verifier role. The reopening observation
is recorded in product 07's settlement candidate.

After the dispositions and the sync of this pass's own candidate section:
491 entries, 114 pending (110 deferred with reopening observations, four
open), none untriaged and none awaiting review.

The six invalidated dispositions were re-read at their new source revisions:
local lane retention settles (WO-142 shipped the prune command); the Tinkerer
candidate's three trials are read against the pre-registered rule (section
4) and the row is left open on the resulting proposal; DotLn-owned authority
defers to R2 after WO-144's close, as the 2026-09-17 pass decided; the total
subagent cap and isolated execution environments keep their reasons at the
new revisions; the settlement candidate itself is deferred on this section's
observation. Three more dispositions were invalidated by this pass's own
product-document edits (the planner-startup, cold-gate and local-model
candidates) and re-recorded at the new revisions with the same status.

## 4. Candidates met since the last pass, and their dispositions

**Binding a resident to the active work (operator, 2026-09-20).** Allocated
to WO-148. The candidate asked for six decisions; each is answered in the
order's design and summarized here with its evidence. Who owns the binding:
an explicit operator command reading canonical state, because activation
runs inside `worktree start` before the worktree is bootstrapped and the
transport is the operator's choice at launch (WO-122). Store lifetime: a
store follows one binding of one order; a rebind writes a new store and
retains the old one, which is the immutability rule kept rather than worked
around. Surfaces: declared on the command line and recorded; deriving them
is WO-124's contract and changes what the out-of-surface rule can claim.
Concurrency: one store per order under the mission-only policy, which has no
discretionary work phase, so nothing competes; whether absence work
serializes across orders is WO-100 and WO-111's question. Session presence:
the command prints the export line and the stage session exports it,
because product 03 keeps missing bindings inert and only explicit `away` and
`back` are human (WO-121). Staleness: `--check` names the mismatch and a
launch line is refused for a stale binding; a running resident keeps judging
its declared subject, which is recorded as the limit rather than changed in
`resident-host.ts`. Reopen: WO-148's live row, or WO-111 meeting a store the
command could not have written.

**A pasted dispatch does not resolve a role (2026-09-20).** Left open. This
pass's typed dispatch resolved normally, so there is no second observation;
whether pasted text may dispatch a role is the operator's judgment because a
paste can carry instructions the operator did not write. Recommendation for
the operator, recorded without deciding it: the advisory option, one printed
line when a known phrase follows a paste wrapper, so the operator retypes the
phrase and the session gets its role, start time and usage key.

**The root-cwd precondition for the four root-bound refusals (WO-144 D007
and D008).** Deferred on a measurement. Every generated hook now journals its
stand-down, so the retained journals under the local control lane can be
counted: six rows name the unverified-root precondition, against 80
working-directory classifications and thousands of judged calls (counts
observed 2026-09-21; no journal text is copied). The fifth refusal already
judges from any directory. An order for the other four would be written
against six rows. Reopen: the count passes fifty, or a journal shows a call
admitted off-root that a refusal would have refused from the root.

**The resident's lock under live contention (WO-143 D004; WO-069 D015).**
WO-147, section 5.

**Codex process cost (WO-099 D035).** WO-149, section 5.

**An anchor check for the document suite (WO-090 D007).** Allocated to
WO-085, whose purpose already includes a docs check with a link checker; the
carry-in names the cases and the disposition of the 41 unresolved anchors in
closed reports (declared historical exceptions).

**An executor route for an authorized edit to the goal standard (WO-090
D006).** Deferred. WO-090 D006's operator-authorized local commits and
receipt 021 handled the one occurrence; a route is designed on the second.
Reopen: another execution order needs to edit the bound goal standard.

**WO-069's kit and launchpad follow-ups (D005, D016, D017).** Allocated to
WO-070 as carry-ins, where their own text sends them: the packages' ignored
local lane follows the launchpad once the plane/kit module identity is
settled; the measuring scripts take an explicit tool root; the qualification
fixture builder's cross-root shape.

**The Tinkerer's three-trial reading (WO-145 D001's reopening condition).**
The rule pre-registered on 2026-09-20 named this pass: total the trial costs
and each adopted saving, and propose default equipment only if at least one
adopted saving over the next ten orders exceeds the whole trial cost with no
recorded regression. Observed: all three trials adopted a method with
`regression: false`; recorded trial cost 253 s of wall-clock, tokens known
for one trial (497,138, broad scope); adopted savings per iteration 58.7 s
(WO-145), 238.4 s (WO-110) and 0.21 s plus one command (WO-099); no trial
counted its iterations, so no per-order total exists and none is invented.
Applied as written, the WO-110 saving exceeds the trial's recorded wall-clock
cost after two iterations in the next ten orders, so the record proposes
default equipment. Two qualifications: the third trial ran unequipped
(WO-099 D008's follow-up), so the support's elicitation is evidenced in two
of three; and the adopted methods are development loops an executor keeps
without the support. The proposal is recorded in product 05 and the register
row is left open for the operator; equipping by default is a loadout change
that needs an order.

**MissionSource selection policy (WO-099 D016).** Deferred on its own
reopening observation, an `unknown` hold on an ordinary session because
generated evidence crowds the capsule. WO-148's bound real worktree is the
first place that signal can appear, and WO-111's row notes it.

**The five gathered seams.** The shell destination adapter's width, the
root-cwd precondition, machinery-suite selection before final review, the
verification and repair hosts' residue, and the meter and closeout residue:
each is a formal candidate in the map dated 2026-09-21 with its rows and
reopening observations, and each row is deferred to it.

## 5. Three orders

**WO-147 — Resident lock contention.** A holder releasing `host.lock`
between a contender's `present(lock)` and its read ends the contender's
transaction with a raw `ENOENT`, reproduced two runs each on the working
tree and the released version by WO-143's verifier and boarded for the
planner "before WO-111's first unattended hour"; final review wrote it into
the capability row as a stated limit. WO-069's canonical gate met the same
suite's load sensitivity once (a synthetic dead pid observed as live; the
compiled test then passed alone across all 344 boundaries), with the
pid-reuse hypothesis unvalidated. One seam: the worker store's acquisition
under contention. The order re-inspects under the guard it already holds
(the guard excludes new writers, so a vanished lock means the holder is
gone), probes the retirement `ENOTEMPTY` inference deterministically, and
has each boundary fixture take its dead pid at use. Cost: no step, gate or
hook; two fixtures and a helper; removes the one recorded ownerless way a
contended store ends a resident transaction and, if the hypothesis holds,
the recorded gate failure. Patch. Critical path: it precedes WO-111 by three
pairs and is small.

**WO-148 — Resident binding.** Section 4. The order is a control-plane
command over the store shape and the `mission-check` actor that already
exist; the runtime is untouched. Cost: one command and an ignored store per
bound order; removes the hand-written store and the synthetic worktree that
WO-099's own live row needed. Minor. Not on the critical path's typed graph;
it is the step that makes WO-099's mechanism something the operator runs on
real work, and the platform lens asks that a capability arrive as an
interface something else consumes, which a store nobody can write without a
day's reading is not.

**WO-149 — Codex sessions begin.** WO-099's final review measured the split
exactly: `claude-code` 13 real readings and 0 unknown, `codex-cli` 0 real and
8 unknown, because `measureHarnessUsage` requires a begun session record, the
Claude hooks write one at prompt submission, Copilot has a graceful branch,
and no Codex path calls `beginHarnessSession`. The order begins the session
inside the dispatch command Codex already runs, once per thread, and keeps
the graceful unknown for Copilot only. Cost: one idempotent call and a
fixture; removes the empty Codex column from the meter and the by-hand
`harness begin` the role text offers instead. Patch. Not critical path; a
one-entry slot that must not make WO-120 or WO-063 wait; R2 may recut it.

Each order carries `Model:`, three-role `Effort:`, a `Cost:` naming
additions and removals, provenance, a dated observed gap, criteria,
evidence, non-goals and operator-review assumptions, and a typed
dependency block whose inputs are all closed.

## 6. The sequence

| Pair | First lane                     | Second lane                       | Why they do not collide                                                                                                     |
| ---- | ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 8    | WO-138 local-model pilot       | WO-071 registered repositories    | Unchanged: `scripts/probes/` and an evidence directory; `config.mjs`, `work-orders.mjs`, `resume.mjs`.                    |
| 8a   | WO-147 resident lock contention | WO-148 resident binding          | The worker store and the resident fixtures; a new control-plane script, the skeleton README and product 03. No hard edge. |
| —    | WO-149 Codex sessions begin    | (one entry; runs beside the open one) | `resume.mjs`, `harness-host.ts`, the loadout sentence; shares no file with WO-147 or WO-148.                          |
| 9    | WO-120 derived work identity   | WO-063 outward-artifact lint      | Unchanged.                                                                                                                  |

Everything from pair 9 onward is unchanged in content and order. WO-147
precedes WO-111 (pair 11) as D004 asked. R2 still follows WO-111.

## 7. Declined alternatives — the NoOp register of this pass

- **Do nothing about the contention race until WO-111 meets it.** What
  happens: the unattended hour's first lock race ends the resident's
  transaction with an error the row cannot explain, and D004 rejected this
  NoOp for that reason. Declined. Reverse if WO-111's design changes to a
  store the resident never contends.
- **Fold the race into WO-100 or WO-111.** Both are proof or feature
  orders with their own seams; a lock fix inside them re-keys their
  evidence. Declined.
- **Generate the resident store at activation.** Activation runs inside
  `worktree start` before bootstrap; a bind failure there fails activation,
  and the transport is chosen at launch. Declined (WO-148 design). Reverse if
  the worktree helper gains a post-bootstrap step the operator wants the bind
  in.
- **Derive declared surfaces from the order's prose or the catalog column.**
  A contract change the mission check leans on; WO-124's. Declined.
- **Give Codex the Copilot-style graceful unknown.** Hides a fixable gap and
  keeps the Codex column empty; D035's own rejection. Declined.
- **Change the collector so in-order directives never enter the feed.** A
  machinery change for a distinction the collector cannot make from the
  field alone; role text is smaller and puts the distinction where it is
  known. Declined; reopen per product 07's settlement candidate.
- **An order for the root-cwd precondition now.** Six rows. Declined;
  candidate 2.
- **An order for the shell destination adapter now.** Five rows, none a
  live incident since WO-144's repair; refusals during live gates are the
  friction, at low to moderate priority by their own row. Declined;
  candidate 1. Reverse on a second refused read in a live gate.
- **One cleanup order for the meter, host and adapter residue.** The
  one-seam rule stands for every order but WO-142, which the operator
  budgeted; nothing here is that. Declined.
- **Edit WO-140's closed text to correct the attribution sentence.** D001
  already records the difference; changing judged text of a closed order
  re-keys a receipt for a sentence. Declined; candidate 5.
- **Recut pair 9 to absorb WO-147.** It would break WO-120 and WO-063's
  pairing for no surface reason. Declined.
- **Spend surveys on the register.** Sixty-seven rows with their decision
  text fit one session's reading; no subagent was spent on it. Declined.

## 8. Goal alignment

Mission and critical path: WO-147 removes a recorded defect on the road to
M3's unattended hour and is placed ahead of it; WO-148 turns M3's first
mechanism (the mission check, live-evidenced) into a daily path for the
operator, which is what the vision's first sentence promises a runtime for;
WO-149 is operator flow and measurement, not critical path, and is placed so
it delays nothing. NoOp for each: the resident stays one lock race from an
unexplained exit; watching a real order stays a hand-written store; Codex
receipts stay unmeasured.

The eight traps, where material. _Policy resistance_: WO-147 widens what
waits and never what is written, so the guard, reclaim and refusal rules
WO-143 set do not fight it; WO-148 keeps the immutability rule instead of
adding a mutable store. _Commons_: this pass spent no survey agents and one
refuter; the orders add one command, two fixtures and one idempotent call,
and no recurring check. _Drift to low performance_: settling twenty-two rows
as discharged is judged against the closing evidence of each order, not
against the row count; the settlement candidate's threshold is kept in
force. _Escalation_: no new gate, receipt type, hook or mandatory run; the
follow-up distinction is proposed as role text, not a check. _Success to the
successful_: the existing store shape and actor are reused rather than a new
runtime path; the Copilot branch is not copied to Codex because it would
lower the bar. _Shifting the burden_: WO-148 removes the operator's
hand-written store and WO-149 the by-hand `harness begin`; WO-147 removes a
rescue WO-111 would otherwise need. _Rule beating_: WO-147's fixture must
fail with the re-inspection removed, as WO-143 F2 required; WO-148's live
row proves aim, not the work, and says so; WO-149's live row is a real Codex
receipt. _Wrong goal_: the register is disposed to make its next page
useful, not to reach zero; the two candidates it measures stay open with the
friction named.

Naive Interventionism: each order names the existing function it keeps
(the guard, the store shape, the Claude and Copilot branches), its affected
consumers, and a smallest probe (the two-process fixture, `--check`, the
thread-id guard). NoOp is recorded per order above and per declined
alternative in section 7. Platform lens: WO-148's binding arrives as a
command and a record other tools can read, its inputs are canonical state
and declared surfaces, this repository consumes it first, and its store is
usable by a resident started by a stranger to the session.

## 9. Evidence and cost of this pass

Read-only inspection of `main` at `502d85f9`: canonical status, the sequence
and index, the two 2026-09-20 planning documents and receipt 021, product
07's planning, ideation, recovery and candidate sections, the decision files
of the eleven orders whose rows were untriaged, the WO-143, WO-144 and
WO-099 final reviews where cited, the map's candidate sections, the cost
table, the budgets file, the register by script, the retained hook journals
by count, and the source files each order cites. Commands: `npm run resume`,
`npm run plan -- check`, `npm run plan -- followups`, `git log`, `git tag`,
`gh release list`, `npm run work-orders -- index`. No model call was made
outside this session; no subagent was spent before the refutation; the plan
for the twenty-agent cap is one fresh background refuter and nothing else.
Usage counters at entry are in section 1; the handoff counters are in the
response and the ignored receipt. No file outside the repository was written
except the ignored intake capture and the granted scratch directory.

## 10. Reversal conditions for this plan

- WO-111's first unattended hour records a resident exit from a lock error
  after WO-147 closed: reopen WO-147's seam with the row.
- WO-148 cannot bind a real order without a runtime change: stop, record the
  reason, and return to planning rather than widen the order.
- A Codex CLI version begins sessions itself, or the counter source stops
  needing a begun record: WO-149 shrinks to its fixture or is withdrawn with
  a dated note.
- The next pass's untriaged rows again exceed fifty, or more than ten are
  discharged directives: the settlement candidate's role-text fix becomes an
  order.
- A second session loses its role to a paste wrapper: the pasted-dispatch
  candidate is decided.

## 11. Independent review

Filled after the receipt is filed.
