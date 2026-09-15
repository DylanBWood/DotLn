# Machinery stand-down — meta and meta-meta diagnosis, 2026-09-15

The operator opened this pass on 2026-09-15 with a direct verdict: the
lifecycle machinery built by WO-125, WO-126, WO-128, WO-129, WO-130, WO-131
and WO-044 made the platform worse, stalled product work for five days, and
must stop. The dispatch and its three follow-up messages are captured
verbatim in ignored intake
(`docs/intake/notes/2026-09-15-machinery-stand-down-planning.md`, SHA-256
`19061ea60115a416bc536e4eae66faffc5549dfd9a33841d886bd51dffd8350f`). The
operator's second direction asked for a meta pass (how the previous planning
passes tried to fix this and why they failed) and a meta-meta pass (what in
the planning process itself produces that outcome), with the intuition that
the repair is surgical in most places and a wholesale design change in one.
This document is that diagnosis. The order it produces is
[WO-132](../work-orders/WO-132-machinery-stand-down.md).

Method: six independent read-only diagnoses ran as background workers in this
session (the gate line, every refusal surface, the planning process, release
close, the test inventory, harness parity). Each was refused its handback
tool by the repository's own permissions hook ("Unclassified effectful tool:
SubagentHandback"), the same defect class WO-044-D015 repaired for
`Workflow`; their reports were recovered from the session transcripts. That
refusal is itself evidence for this pass. Observation and inference are
labeled below; an unobserved value is unknown.

## 1. What the operator observed, checked against the records

| Operator statement | What the records show |
| --- | --- |
| Tests went from 6 minutes to 10–12 | The canonical fresh full gate was 476 s at WO-126's close (2026-09-10) and at the 2026-09-12 terminal run; 780–881 s after WO-130 and WO-131 replicas (2026-09-13/14); 570–648 s on 2026-09-15 with 82 tasks. On 2026-09-15 the host ran eight full gates: 633, 634, 648, 644, 570, 67, 71 and 605 s; six were cold. WO-044's close alone paid five fresh gates, about 52 minutes. Source: the ignored gate rows in `docs/control/local/harness/checks.json` and `docs/evidence/WO-131/historical-gate-costs.json`. |
| Nothing is reused across stages | Observed splits: identical tree, same session 10 fresh of 78; docs-only, same session 17 of 79; a different session 78 fresh of 82 (2026-09-15T03:28Z), 79 of 79 (2026-09-14T14:47Z), 78 of 78 (WO-130 D009). Every cross-session row is cold. |
| Updating a README invalidates the tree | `gateTreeHash` hashes every tracked and untracked non-ignored file with "no evidence or control paths excluded" (`packages/skeleton/src/gate-evidence.mjs` 441–463); every transition requires an `npm run test:full` row at that exact hash (`scripts/lib/lifecycle-evidence.mjs` 37–44); the transition itself appends to `docs/control/orders/*.jsonl` and rewrites `docs/control/current.md`, so every stage boundary misses by construction. |
| Nobody knows what is tested | In the latest fresh gate, package tests are 9 % of task time (skeleton 56 s, console 37 s of its own tests, kernel and compiler about 1 s each); harness and process machinery 46 %; lifecycle shell and release fixtures 35 %; planning, index, format and build 9 %. 38 suite rows become 82 tasks (42 release cases, two plan-refutation tasks, two console tasks). The three longest suite numbers (console 442 s, release 263 s, plan-refutation 240 s) are spans between split tasks, not work; the heavy tasks are harness fixtures 145 s, process debt 143 s, runner fixtures 135 s (isolated, alone for 22 % of the wall-clock) and plan-refutation fixtures 69 s. The gate is lane-saturated at about 2,300 lane-seconds over four lanes. Of the 38 suites, the only ones with a recorded catch of a real defect are release, worktree, resume and the three package suites; every machinery suite is cited only as evidence that it ran. A default gate of product and lifecycle suites alone is estimated at about 250 s fresh (230–270). |
| Five days without product progress | Since 2026-09-08: 117 commits, 18 merges, 16 pull requests. `packages/kernel` untouched; one product-runtime merge (WO-042, 2026-09-09); every merge from 2026-09-10 to 2026-09-15 (13) is lifecycle, gate or hook machinery or its evidence. |
| Refused for harness versions and effort | `scripts/resume.mjs` refuses an attested effort below the order's `Effort:` line (561), an effort value without a recorded selector or readback (492, 510) and the worker transport refuses CLI versions below 2.1.270 / 0.154.0 and unrecorded effort pairs (`packages/skeleton/src/worker-transport.ts` 182–256). `ultra` and `ultra code` match no label and become `unknown`. |
| Release close is a multi-hour stage | v0.17.0 needed a patch order and manual archival; v0.17.5 failed inside its own gate and needed a fix pull request; v0.17.6 was never published (two failed gates, blockers cleared by hand, egress discovered last, two override episodes); v0.17.7 ran a fresh 605 s gate with 0 of 82 reused. On main, the writer-isolation unit refuses every shell command that is not on an exact metadata list, so a session cannot build, bootstrap or inspect there. |
| Refutation is theoretical | Receipts 009–012: four holds, dispatch-to-file 2,454, 833, 333 and 755 s against a 120 s budget; receipts 010 and 011 say in their own words that the holds are "logical counterexamples to the contract, not executed failures". Two holds were overridden by the operator; receipt 012 re-raised the hold 011 had overridden, and WO-131 amendment 13 then re-imported it as scope, producing a design (kernel-denial-conditioned reuse) that failed VER-001 and was removed by D019. |
| Claude cannot ask, Codex can | Every DotLn hook path answers `deny` or nothing; no path emits `ask`. A hook `deny` pre-empts the host's own permission prompt, so the operator's global `allowUnsandboxedCommands` change (WO-044-D009) never reaches a DotLn-refused command. Codex fires no project hooks, so it only ever sees the host's approval prompt. Five of the six recorded refusals this week were the DotLn classifier, each repaired by adding one tool name; `SubagentHandback` and `SendMessage` were the next two, live in this pass. The ignored hook journals for 2026-09-12 to 2026-09-15 hold 21 writer-isolation refusals, all inside three release-close sessions on main and one subagent session, and 48 command-classification refusals, 38 of them on 2026-09-15. The 2026-09-15 effort refusal on Codex had a specific cause: the discovery registry lists only `max` for Codex although the 0.154.0 probe recorded every level as accepted, so any other value was refused. |

## 2. Meta pass — the four planning passes and why each compounded the problem

| Pass | Diagnosed | Prescribed | Promised removal | What closeout recorded | The next pass's diagnosis of it |
| --- | --- | --- | --- | --- | --- |
| 2026-09-08 critical path | The smallest useful loop exists for no user; the resident runtime and source change are the product gap | 73 bounded orders, one seam and four hours each, R1 replan after WO-044 | Orders of four to twelve hours | WO-042 merged 2026-09-09, the only runtime merge since; three refutation rounds | WO-042 took 16 h 37 m, "most of it in verification, repair and review machinery" |
| 2026-09-09 process debt (WO-126) | Eleven machinery failures: Stop hooks run the suite at turn end, 5.3 MB read obligations, the tag reruns the suite, hand-written closeout | One order exempt from the one-seam rule, eighteen criteria, `executor max+` | "The full suite at every turn end and at the tag … hours per order removed for seconds added" | Cold gate 522 → 476 s (8.8 %); 37 suites → 78 tasks; seven verifications; four refutation rounds; the added authorship observer's recurring cost omitted from the Cost line (VER-001 F6) | WO-125 paid 2 h 37 m of gates for 30 min of implementation; the key hashed every ref and path, so every transition ran cold |
| 2026-09-12 proof-carrying gates (WO-128–131) | Twelve failed fresh gates, transition-triggered cold runs, docs-only changes rerunning the whole-tree class | Four serial runner orders under the one-seam and four-hour rules | Failed gates and reruns; the post-transition fresh gate ("41–47 s after WO-130"); package re-execution; the docs-only whole-tree class | WO-128's shared scheduling measured 204 s slower than the exclusive configuration it replaced; WO-129 shipped keyed on the checkout path; WO-130 keyed on session PIDs and paths and failed its own close; WO-131 keyed reuse on a kernel denial no role session can obtain (807 s, 0 reused); fresh gate 801–820 s | WO-044: "every full gate ran cold (82 fresh, 0 reused)"; the aggregate check is the docs-sensitive outlier (D016) |
| 2026-09-13 WO-131 refresh | Receipt 012 held the counterexample receipt 011 had overridden | Cost-table refresh, background refuters | None | The overridden hold became amendment 13 and D009, then VER-001 F1, then D019: one theoretical hold cost a refresh, an amendment, a design, a failed verification, a repair and an engineering review, and delivered nothing | This pass |

Observation across the table: every pass shipped a self-measured key (the
engineering review's R7), every Cost line's removal was judged by a regex at
filing and never reconciled at closeout, and every verification of machinery
found machinery defects that became machinery repairs in the same order.

## 3. Meta-meta pass — the mechanisms in the process that produce this

1. **The refuter is asked for counterexamples to contract sentences, and any counterexample is a hold** (`packages/skeleton/src/plan-refutation-protocol.ts` 437). Eight of eleven receipts since 2026-09-08 held; every 2026-09-12/13 receipt exceeded its 120 s budget three to twenty times. The guide's candidate that names this allocates nothing, and the 2026-09-13 pass changed the transport instead of the judgment.
2. **Override semantics guarantee re-litigation.** An override answers one receipt hash and hold, so the next receipt re-raises the same counterexample (012 after 011), and a scope expansion re-imports it as a criterion.
3. **Cost lines are unreconciled promises.** The structural hold passes any Cost line matching "removes …"; the cost table has no field that compares a promised removal with an actual. WO-126 promised hours per order and delivered 8.8 %; WO-129 promised 41–47 s and WO-044 observed 595–647 s. The process-budget rule ("every gate must be cheaper than the failure it prevents, and the repository's own records decide") does not bind because no record compares the two.
4. **The meter measures and never fires.** Its reopening rule is three consecutive worsening deltas; the machinery share is a sawtooth (0.17, 0.44, 0.31, 0.54, 0.14), and null cells are treated as safe.
5. **A finding becomes a criterion in the order that found it.** WO-044, a critical-path discovery order, absorbed eight release-close, gate-control and role repairs; WO-131 absorbed six amendments. "Automate recurring procedure" says a new ritual is not an automation outcome; it did not bind because each item was framed as a repair.
6. **"A question is not a waiver" turns operator complaints into non-decisions**, and the process supplies no cheap form for an explicit decision. D016 declined the reuse fix the operator asked for; the 2026-09-12 override direction became a candidate rather than a rule.
7. **Exact-tree evidence at every transition plus "write once, run once" produce the loop and blame the session.** The 2026-09-14 correction names VER-002's three reruns a session defect while the key that makes them unavoidable stays.
8. **The one-seam and four-hour rules serialize machinery into four full lifecycles**, each paying activation, executor gate, verifier gates, repair, review gate and close: 27 verification reports on the eight machinery orders against 5 on WO-042 and WO-043. The map's own NoOp for WO-126 stated the trap; the next pass filed four orders anyway.
9. **Verifying machinery reopens the design each time.** Every `reopenWhen` is a trigger; WO-131 flipped its reuse rule twice inside one order because no contract required a second-session measurement.
10. **Hard enforcement by construction.** Version and effort minimums, the main-branch conjunct, unclassified tools and command shapes all refuse rather than log, and no rule ranks "log" above "refuse".

Inference from 1–10: the process rewards adding a mechanism (a criterion, a
key, a guard, a receipt) and never charges for one, so every pass that set
out to remove machinery added a layer beneath the layer it could not remove.

## 4. The wholesale change — one location

**The lifecycle evidence identity**: `gateTreeHash` plus
`requireLifecycleEvidence` plus the release helper's exact-tree reuse
predicate. This is the location the evidence favors, for three reasons.

- Every recorded cold run at a stage boundary follows a record write (a
  report, a control event, an index regeneration), and the key includes
  those bytes by design. No per-suite refinement beneath the aggregate can
  prevent that miss; it can only shrink it. This is why three orders that
  refined the key beneath it delivered same-session composition and nothing
  across stages.
- The only independent sub-minute row (WO-131 VER-002, 62 s, 17 fresh of
  79) was a docs-only delta in a matching environment: the composition
  works when the aggregate is reachable, and the remaining cold runs are all
  attributable to identity choices, not to the mechanism.
- Every fixed per-run cost added to protect the reuse path (installed
  copies, 62–66 replicas, probes, 82 tasks, an isolated 135 s runner suite,
  204 s of lost parallelism) is paid on nearly every run while the reuse it
  protects rarely executes.

The change: lifecycle transitions stop requiring gate evidence at all. A
completion command runs `git diff --check` inline and appends; missing
evidence, authorship, read obligations, usage and handoff checks become
advisory lines. One product gate, `npm test`, runs once per order at final
review, keyed by code identity (tracked, non-generated, non-document,
non-control content), and that row is the evidence the pull request, the tag
manifest and the release close consume. Reports, control events, index
regeneration, release preparation and pull-request text never invalidate it.
Release close runs no suite.

With that change the per-suite reuse machinery has no lifecycle consumer.
The replica execution, declared-input keys, shared success cache, kernel
denial probe and per-task expansion leave the default path; suites run
against the tree, once, in a fresh gate that has to fit six minutes because
it runs once. The machinery's own test suites leave the default gate with
it.

The other candidates are secondary, not wrong: the refutation hold semantics
cost planning hours, not the twelve-minute loop at every transition, and are
fixed by a rule and a prompt; the hard-enforcement model produces refusals
and the release-close bootstrap problem, each a classification or default
edit; the runner's key already moved to declared inputs, and what remains is
over-declaration, which cannot help while the lifecycle looks up by whole
tree.

## 5. The surgical fixes

Each is one edit in one place, not an order. WO-132 carries them as criteria.

1. **Attestation is a log line.** Harness, version, model, effort and source
   are recorded as given; `ultra` and `ultra code` are recorded as `xhigh`
   with a `subagents` mode and their raw spelling; no effort-below-declared,
   readback, discovery-row or version-minimum refusal remains in the
   lifecycle, the worker transport or the plan-refuter transport, which log
   a warning instead. `Effort:` lines become recommendations, default `any`.
2. **Writer isolation is one registered writer per worktree on any branch.**
   The `branch !== "main"` conjunct leaves the compiled unit. Planning, release
   close, status, usage, build and bootstrap run on main from a session under
   its reservation; a second live writer is still refused.
3. **DotLn hooks refuse two things**: a second writer in the same worktree, and a
   write to gate inputs during the reviewer's live `npm test`. Every other
   judgment (unclassified tool, command shape, adapter unavailable, outside-root
   read, attribution pre-check) delegates to the host with an advisory line, so
   Claude's own permission prompt and Codex's approval decide. The host deny
   list for publish, ssh and credentials stays in settings.
4. **Release close is publish only.** `npm run release -- close WO-NNN --publish`
   proves egress, fast-forwards main, runs the existing sub-minute surface checks,
   builds its own dist if missing, writes the manifest citing the reviewer's
   `npm test` row (reviewed tree and merge tree both recorded), creates and pushes
   the tag and creates the Release. Worktree teardown and derived-worktree
   settlement run afterwards as best effort and report blockers without failing
   the close. No `npm ci`, no suite, no CLI smoke row at close.
5. **Suite declarations name the files a suite loads**, not `scripts/`; fixture
   count pins are dropped; evidence editions are keyed by content, not component
   version, so a version bump alone demands no live audit.
6. **The scheduler keeps the configuration that measured faster.** WO-128 D010
   recorded exclusive scheduling at 462 s against 666 s shared and kept the slower
   one; the default gate restores the faster measured configuration and any later
   change carries a same-source before/after row.
7. **The default gate is the product gate.** Product and lifecycle suites run in
   `npm test`, each with a one-line statement of the operator-visible behavior it
   protects; machinery suites (harness fixtures, process debt, runner fixtures,
   plan-refutation fixtures, harness probe, mutation self-test, evidence editions)
   run on demand in `npm run test:machinery` and in the reviewer's gate only when
   their own sources changed; document-sensitive live checks stay in `test:docs`.
8. **The refuter is a goal review.** It answers four questions per order from the
   Cost line, the meter and the critical path: which critical-path gate it
   unblocks and the NoOp cost in the records; the eight system traps applied to
   the order's own process cost; whether the Cost line names a removal larger
   than the addition; whether a failure of the mechanism degrades to the old
   behavior rather than refusing. A hold needs an observed failure or a
   contradiction with vision text; a constructible counterexample is a known
   issue with a reopening observation, never a hold. One judgment per pass, no
   re-judging after repairs, no third-hold stop, no budget refusal; a
   disposition binds the criterion text, not the receipt hash.
9. **Cost lines are reconciled at closeout**: the promised removal against the
   observed rows, as a planning input, never a gate. An operator direction in a
   capture is a decision and is recorded as one.
10. **Cross-session claims need a second process.** Any future reuse or
    composition claim is established only by a gate run from a different shell
    and session, never by a same-session proxy.
11. **Refinements from the refusal inventory, carried into WO-132's
    execution as part of its cited diagnosis.** The lifecycle commands honour
    an open `operator override:` session with a recorded bypassed
    requirement instead of needing an ad hoc recovery script (WO-044's
    verifier needed one). A post-tool observer failure, such as a read
    outside the worktree surface, never blocks a completed read. Release
    close lists ignored material under the local lanes and untracked files
    outside the tracked tree and continues; only tracked dirt refuses. The
    plan-override command needs no actor flags once the refuter's holds are
    dispositions. The discovery registry records every effort level each
    harness's probe accepted, so a registry gap can never refuse a label.

## 6. What stays

One writer per worktree by reservation. No write to gate inputs during a
live gate. Implementer is not verifier; reports are immutable and numbered.
The clean-room floor. `main` requires a pull request. Egress-first release
close and the derived-worktree settlement of WO-044. The operator controls
`analysis:` and `operator override:`. Load-derived deadlines and per-task
peers in the gate row (WO-128). The follow-up register. The mutation corpus
as the instrument for removing a product test.

## 7. Declined alternatives — the NoOp register of this pass

1. _Revert pull requests #54 through #62 (v0.17.2 to v0.17.7) wholesale._
   Declined: the revert also removes egress-first close, derived-worktree
   settlement, nested-repository classification, the operator controls,
   background refuters, the session's own gate stop, the permission-bit key
   and the load-derived deadlines, all of which repaired observed failures;
   and it restores WO-126's 476 s gate and whole-tree key, not a 6-minute one.
   Reversal: if WO-132 is not implementation-ready within one executor session
   of eight hours, the operator reverts the runner and evidence line (WO-129,
   WO-130, WO-131) instead, and WO-132's decisions file names the commands.
2. _Turn off every test._ Declined: the product suites cost 94 s of task
   time and the operator's stated need is to know which tests are useful,
   which criterion 7 answers by classification; deleting a product test still
   goes through the mutation corpus. Reversal: none needed.
3. _Keep the machinery and fix the key only (WO-044-D016's three items as
   one order)._ Declined: the key repair leaves every transition gating,
   every fixed replica cost in place and every refusal intact; the operator's
   complaint is the loop, not the key alone. Reversal: none.
4. _One order per fix (ten orders under the one-seam rule)._ Declined: each
   order would pay the current cost model in full (WO-126's NoOp 2 stated
   this; the 2026-09-12 pass filed four anyway and paid four lifecycles).
   Reversal: none; the exemption is this order's own.
5. _Keep replica execution and declared-input reuse as an opt-in flag._
   Declined: an opt-in path keeps its suites, probes and copies in the
   repository for a consumer the lifecycle no longer has. Reversal: if the
   once-per-order fresh gate exceeds six minutes after the inventory split and
   the operator wants faster executor iteration, reconsider a per-suite memo
   keyed by the suite's own sources, established by a second-process row.
6. _Narrow the writer guard by classifying read-only shell commands._
   Declined: the unit's own rationale says command classification is
   unreliable, and every classification gap this week became a refusal;
   removing the branch conjunct changes no write authority and needs no
   classifier. Reversal: an observed second writer admitted on main.
7. _Run release close from a detached release worktree so the branch rule
   holds._ Declined: it preserves the conjunct that refuses status, usage,
   build and bootstrap for every main-dispatched role. Reversal: none.
8. _Keep release close operator-only and rewrite the role text._ Declined:
   the operator defined a step handed to a terminal as a defect
   (WO-044-D009); the egress requirement is a host fact the command proves
   first, not a reason to remove the role. Reversal: a host that cannot
   grant egress to any session.
9. _Keep the process-cost measurement as a completion requirement._
   Declined: a missing counter must not block a handoff; it is recorded as
   unknown. Reversal: none.
10. _Fix the refuter with a hold budget only._ Declined: a budget still
    spends the pass on counterexamples; the judgment itself changes.
    Reversal: none.
11. _Choose FUP-0091 (Context Continuity), FUP-0111 (planner startup
    context) or FUP-0132 in this pass._ Declined: every remaining order pays
    the cost model this order removes. Reversal: the next pass.

## 8. Reversal conditions for this plan

Reopen at a planning pass when: a product defect reaches a tag that a
removed machinery suite would have caught (name the suite and the row); the
once-per-order `npm test` exceeds six minutes fresh on the operator's host
after the inventory split; a second writer is admitted on main; a release is
published from a merge tree whose code identity differs from the reviewed
gate's; or the refuter's goal review passes an order the operator later
names misaligned.

## 9. Evidence of this pass

Entry measurement (`node scripts/harness.mjs usage`, scope dispatch, source
claude-transcript-message-usage, 2026-09-15T04:16Z): 538,326 total tokens
over 15 steps and 3 commands. Six background diagnoses of roughly 240,000 to
285,000 tokens each, 70 to 109 tool calls each, 13 to 14 minutes each; every
handback refused by the permissions hook. Handoff measurement is recorded
in the ledger section for this pass. The pass ran no code suite; the
refutation is the background worker's goal review recorded in
`docs/planning/refutations/`.
