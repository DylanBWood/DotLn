# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the index
and refutation subject. It grants no activation authority. For rationale see
[the planning map](work-order-map.md). Closed entries leave the sequence at the next
planning pass (operator direction, 2026-09-22); the generated work-order
index's Closed section is their record, and the map and archive keep their
rationale. A withdrawn entry (WO-158) is settled the same way and listed in
that section under its disposition.

Planning entry returns the pending [follow-up register](followups.json) in
bounded pages. Use `npm run plan -- followups` for its current counts, source
pointers and continuation command; untouched items persist across passes.

Live feedback episodes (operator direction, 2026-09-28): an order that owes
one runs it in the executor's session on Codex `gpt-6-sol` at `xhigh` or
Claude Code `claude-opus-5-5` at `xhigh`. On either, it needs no operator
authorization and its cost is accepted; a repair that edits a judged source
again runs another the same way. A step the executor can perform is the
executor's: no order marks it operator-run or routes it to the operator.
WO-172 moves this rule into product 07.

Lane pairs (operator direction, 2026-09-16; recut 2026-09-17): from WO-141
onward the queued entries are grouped two per blank-separated pair for two
parallel lanes. Inside a pair the two orders name disjoint primary surfaces
and neither hard-depends on the other; one entry is the delivery order and
the other is by preference an evidence-only or machinery order. The run after
the last pair (WO-066 and WO-057) keeps its serial reading order until R2.
One order at a time passes final review and release close, and the second
lane's final review integrates main by the checklist in product 07
§Independent workflows and integration. The pairs and their evidence are in
[the vision-into-use document](vision-into-use-2026-09-17.md) §4; the
earlier cut is in [the R1 replan document](r1-replan-2026-09-16.md) §7.

Cleanup pass (2026-09-19): WO-142 and WO-084 form the first queued pair, the
pass the operator budgeted. The same day's second pass, from the operator's
answers, adds the pair WO-143 and WO-144 directly after it (the resident's
lock recovery, on the critical path, and outside-project writes as a role or
support grant) and the pair WO-145 and WO-090 after WO-140 and WO-056. WO-138
keeps its slot beside WO-071: its pilot reads public inputs only, so WO-137's
successful live row admits it. WO-085 to WO-089 stay last. The evidence is in
[the cleanup planning document](outstanding-cleanup-2026-09-19.md) §4, §5 and
§10.

Copilot CLI pass (2026-09-20): WO-146 takes its own one-entry slot directly
after WO-140 and WO-056 and before WO-145 and WO-090. It shares a host file
with WO-140 and the loadouts and regenerated bundle with WO-145, and it writes
product 07 and the security document before WO-090 restructures them, so it
pairs with none of them; it may run in the second lane beside WO-056 once
WO-140 has closed. It is operator tooling, not critical path, and no pair is
recut. The evidence is in
[the Copilot CLI planning document](copilot-cli-integration-2026-09-20.md) §7.

Standard pass (2026-09-21): after the WO-069 close, WO-147 and WO-148 form
a new pair directly after WO-138 and WO-071 (the resident's lock under live
contention, which WO-143 boarded for the planner ahead of WO-111, and the
operator-raised binding of a resident to the active order; disjoint surfaces,
no hard edge). WO-149 takes a one-entry slot after them, as WO-146 did: it
may run beside whichever of the pair is still open and must not make WO-120
or WO-063 wait. No existing pair is recut. The evidence is in
[the standard-pass planning document](standard-pass-2026-09-21.md) §5 and §6.

Operator answer (2026-09-21, second pass): WO-150 takes a one-entry slot
directly after WO-138 and WO-071 and before WO-147 and WO-148, from the
operator's acceptance of the Tinkerer three-trial reading (the economy
support on by default). It edits the loadouts and regenerates the bundle,
as WO-149 does, so the two stay sequential; it may run beside whichever of
WO-138 and WO-071 is still open and must not make WO-147 or WO-148 wait.
The evidence is in
[the standard-pass planning document](standard-pass-2026-09-21.md) §12.

Entropy Reducer pass (2026-09-22): WO-151 and WO-152 pair directly after
WO-120 and WO-063 (the reviewer's dispatch as a command; the duplicate
mission-check schema ids, fixed before WO-100 needs the print transport).
Disjoint surfaces, no hard edge; the sequence is at its 100-order limit.
Evidence: [the planning document](entropy-reducer-dispatch-2026-09-22.md) §6.

Entropy review pass (2026-09-22, second): REVIEW-002 consumed, four findings
accepted, no entry changed. The sequence stays at the subject's limit, so the
evidence-editions order it designs waits for room (a one-entry slot after
WO-100 and WO-064 when the horizon opens) and two findings ride as boy-scout
items on WO-064 and WO-100. Evidence:
[the REVIEW-002 planning document](entropy-review-002-2026-09-22.md) §5.

Operator answer (2026-09-22, third pass): closed entries leave the sequence;
55 are retired here and the index keeps them. Four orders are filed into the
room, as two pairs directly after WO-100 and WO-064 and before WO-111 and
WO-114: WO-153 with WO-154 (the withdrawn Codex session-entry draft; evidence
editions keyed by behavior and recorded by reference), and WO-155 with WO-156
(the refusals paragraph emitted once with a cold-start delta; `plan check`
under 2 s). Disjoint surfaces, no hard edge, one re-minting order per pair.
Evidence: [the REVIEW-002 planning document](entropy-review-002-2026-09-22.md) §12.

Closeout follow-ups pass (2026-09-22, fourth): WO-100 and WO-064 are closed
(v0.44.0, v0.43.0) and leave the sequence. WO-157 takes a one-entry slot at
the head, before WO-153 and WO-154, solo, at the operator's direction: one
operator-authorized order carrying every defect the orders closed on
2026-09-22 boarded up (sixteen decision records, eleven seams). It edits
registered sources and re-mints the editions once, so it does not run
beside WO-154 or WO-155. No pair is recut. Evidence:
[the closeout follow-ups planning document](closeout-followups-2026-09-22.md) §4 and §5.

Off-ramps pass (2026-09-25): seven closed entries leave (WO-157, WO-153 to
WO-156, WO-111, WO-114). Eight orders are filed. Two pairs go to the head:
WO-158 with WO-159 (the lifecycle off-ramps the catalog of 101 orders found
missing; the Codex launcher whose absence failed WO-111's criterion 2) and
WO-160 with WO-161 (the machinery WO-111 exposed, bundled at the operator's
direction; the sandbox vocabulary made true for a host that runs no
sandbox). After WO-070 and WO-115 come WO-164 with WO-165 (REVIEW-003's two
other findings: the console collection that is the document gate's critical
path; the Entropy Reducer's route agreeing with its compiled authority) and
then WO-162 with WO-163 (in-unit helper reuse; 5S Sort and Set in order).
Disjoint surfaces inside each pair, no hard edge; where both orders of a
pair re-mint, the second integration re-mints once more deterministically.
Evidence: [the off-ramps planning document](off-ramps-5s-entropy-2026-09-25.md)
§10.

Standard pass (2026-09-25, second): four closed entries leave (WO-158 to
WO-161). The operator's four items are filed as two new orders and three
rewritten held ones. WO-166 (session boundaries: the Codex dispatch reserves
the writer its completion releases; a live gate is awaited with a command
that exits) pairs with the rewritten WO-085 (a docs check with per-document
byte ceilings that refuses new dated receipts and candidate headings under
`docs/product/`) directly after WO-070 and WO-115; the delivery pair keeps
the head. After WO-162 and WO-163 come the rewritten WO-086 (the roadmap's
release history generated from tags; `release prepare` writes a decision,
not prose) with WO-167 (the execution guide's 32 dated amendments folded in
place and its nine candidates moved to the map), then the rewritten WO-087
(the roadmap's candidates move to the map, not to a new product document)
in a one-entry slot after WO-086 closes. WO-086 runs after WO-164 (both
edit `release.mjs`); WO-167 after WO-085 (the check that keeps the fold);
WO-087 after WO-086 (both edit 06). Disjoint surfaces inside each pair, no
hard edge inside a pair; only WO-166 re-mints. WO-088 and WO-089 stay last
under their 2026-09-19 holds. Evidence:
[the standard-pass planning document](standard-pass-2026-09-25.md) §7 and §8.

Onesie-twosie pass (2026-09-27): five closed entries leave (WO-070, WO-115,
WO-166, WO-085, WO-165). The operator asked for at most two small orders,
in parallel and next: WO-168 (the session scratch directory exists when
printed; the boarded hook, grant, live-gate and Codex dispatch defects;
the standing writer sentences) pairs with WO-169 (the follow-up feed shows
pending rows to the order that opens their seam, exports and batch-applies;
the integrate helper's record; the configuration-root suite's sources) at
the head. Disjoint surfaces, no hard edge; only WO-168 re-mints. WO-164
takes a one-entry slot after them: WO-165 closed, and it edits
`scripts/resume.mjs` as WO-168 does, so it follows WO-168's close and may
run beside WO-162 or WO-163. No other pair is recut. Evidence:
[the planning document](onesie-twosie-followup-drain-2026-09-27.md) §5 and §7.

Operator answer (2026-09-27, second judgment): the operator delegated the
pass's open decisions and admitted later orders. Two are filed. WO-171 (a
prune apply plans once and finishes) pairs with WO-164 in the second slot:
disjoint files, no hard edge, neither re-mints. WO-170 (the meter keeps a
bounded per-order snapshot, recovers retained usage and counts the
operator's directions) takes a one-entry slot after them, because it
shares `release.mjs` with WO-164, and before WO-086. The four orders of
the first judgment are repaired against receipt 031. Evidence:
[the planning document](onesie-twosie-followup-drain-2026-09-27.md) §12 to §15.

Failures pass (2026-09-28): seven closed entries leave (WO-168, WO-169,
WO-164, WO-171, WO-170, WO-162, WO-163). At the operator's direction the
pass counted what the phases recorded as failed: 96 failed judgments and 99
repairs in the control logs and 56 corrections in the decisions, none of
them shown to a pass by any instrument. Two orders are filed: WO-173 (the
executor judges every criterion before it hands off, a criterion recorded
met needs its gate's passing row and one recorded unmet is shown at the
next dispatch) and WO-172 (`plan failures`, the counts when a pass opens,
failed judgments in the meter). Four pairs are recut so that each holds one
product entry and one debt entry, as the 2026-09-16 direction describes a
pair: WO-060 with WO-167 at the head (the first critical-path gate; the
fold, because the guide has 9 bytes of headroom), WO-116 with WO-173,
WO-065 with WO-172, WO-117 with WO-086. WO-087 keeps a one-entry slot after
WO-086 and does not run beside WO-066, which also edits product 06. WO-173
and WO-172 depend on WO-167; WO-065 on WO-060; WO-117 on WO-116. Disjoint
files inside each pair, no hard edge inside a pair; one order of each of
the first two pairs re-mints, and WO-117 in the fourth. The pass also
re-observed every open order against `main` and amended what had gone
stale; WO-072 now depends on WO-123, which carries the source-change guard
fix. WO-066 with WO-057 and the serial run keep their order. Evidence:
[the planning document](failures-across-phases-2026-09-28.md) §10 and §11.

<!-- dotln-work-order-sequence:start -->
- WO-060 — SourceBundle contract
- WO-167 — The execution guide folded

- WO-116 — Audit projection served
- WO-173 — A handoff states what it knows

- WO-065 — Pull-request state observation
- WO-172 — Failures reach planning

- WO-117 — Console live host
- WO-086 — Generated release history

- WO-087 — Candidates leave the roadmap

- WO-066 — Review-comment resolution loop
- WO-057 — Browser runtime truth

- WO-058 — Visual and network claim types
- WO-059 — Playwright evidence adapter
- WO-061 — StoryContract compile
- WO-124 — Impact surfaces derivation
- WO-062 — GitHub Issue source adapter
- WO-123 — dotln vertical composition
- WO-112 — The loop from core
- WO-074 — Launchpad export kit
- WO-075 — Kit runtime and harness bundle in the export
- WO-072 — Target worktree lifecycle
- WO-073 — Repository class and profile documents
- WO-076 — Instance build overlay
- WO-077 — Launchpad export update
- WO-078 — Sibling registry and export receipts
- WO-118 — The resident-owned loop from a starter instance
- WO-113 — Work-order files are stable contracts
- WO-080 — Workstream document and index grouping
- WO-081 — Board Workstreams section
- WO-082 — Synthetic pilot
- WO-083 — The real run from the operator's launchpad instance
- WO-096 — Migration ledger
- WO-097 — Rule migration batch 1a
- WO-098 — Rule migration batch 1b
- WO-091 — Multi-active link groups
- WO-092 — The sets graph extension
- WO-093 — The 5S mechanics as data
- WO-094 — Set bonuses lowered
- WO-095 — Full-set scenario and set tooltip render
- WO-088 — One source for the phrase table
- WO-089 — Capability table fold

<!-- dotln-work-order-sequence:end -->
