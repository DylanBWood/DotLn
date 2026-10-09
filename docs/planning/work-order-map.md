# Work-order map — human planning judgment

**Planning revision:** 2026-09-12, the proof-carrying-gates pass after the
`v0.17.2` close (previous revisions 2026-09-09, the operator's emergency
process-debt pass after the `v0.16.0` close; 2026-09-08, the critical-path
planning pass after the WO-039 close, revised the same day at the operator's
corrections; 2026-09-06, the phase-two pass after the `v0.13.1` close; and
2026-09-05, after the `v0.6.0` close). The generated
[work-order index](../work-orders/README.md) now owns header observations,
control evidence, typed dependency status, and local release attribution. This
map retains recommendations, rationale, tracks, and human activation preflight.
The catalog's manually maintained evidence, hard-dependency, and model/effort
columns were removed on this date; their drift is documented in the
[activation comparison](work-order-index-activation-2026-09-04.md).

For the selected order's legal action, use `npm run resume --silent -- status
--json`. For authority, read the selected work order. The index's computed
readiness uses each open authority's typed dependency block. Authorities
without a block retain a conservative token view that never blocks activation.
Dependency eligibility, workflow legality and recommendations remain distinct.
No view chooses or authorizes the next order.

Work-order numbers are stable opaque identities. They are not a queue, priority,
roadmap position, or family code. The adjacent evidence/corpus track does not
require mainline work to count upward to reach it.

## Recommendation and rationale

Earlier rationale is preserved in the [planning archive](archive/work-order-map-2026-09-09.md).

**Critical path (2026-09-08, revised the same day):** the operator's dispatch appended an external source-level audit and asked for a dependency-correct path from the current code to the first external source-changing worker and then to an independently verified source-to-deliverable vertical. The pass verified every material audit claim against `main` at `33e2c25` ([source verification](source-verification-2026-09-08.md)) and filed the [critical-path plan](critical-path-2026-09-08.md) with its [machine-readable graph](critical-path-2026-09-08.json). The operator corrected the first result the same day: the orders were too large, the always-on offline runtime with cadences and several actor kinds is the critical path, the starter is the vehicle DotLn creates and updates while the operator's forks plan their own target work, no target-application order belongs here, the work-order file must stay a stable contract, and the runtime carries the UI to author, inspect, audit and see live status. The horizon is therefore seventy-three bounded orders, WO-044 through WO-125 with the corpus numbers skipped, beside [WO-042](../work-orders/WO-042-authority-provenance.md), [WO-043](../work-orders/WO-043-typed-dependency-truth.md) and WO-036. Two chains begin at WO-042: the unattended chain (WO-067 presence policy, WO-068 resident, WO-099 mission check) and the external-change chain (WO-044 harness truth, WO-049 target bundle, WO-050 to WO-052, WO-053 the first change); they join at WO-100 and WO-111, the runtime's UI contracts (WO-114 to WO-117) and the starter (WO-069 to WO-079) run beside them, the loop is proven from core against a scratch target (WO-112), and the product exit is the resident-owned loop from a starter instance (WO-118) before the operator's fork runs it against a real one (WO-083, receipt only). An external review of the revised plan, captured in ignored intake the same day, was verified claim by claim and applied: it added WO-118 to WO-124 and corrected fourteen orders (no proof order closes on failure, a separate writer request, trusted grant admission, an executable discovery producer, presence with origin, derived work identity, dispositions in the pull-request loop, evidence-bearing intake relations). WO-033, WO-034, WO-035, WO-037 and WO-040 are superseded whole by their children (WO-069 to WO-098) and kept as umbrella records; the documentation, workshop and migration families carry a waivable dated deferral on WO-053. The first mandatory replan checkpoint follows WO-044's record. The first refutation receipt ([002](refutations/2026-09-08-critical-path-002.md), a direct-session review the operator requested in Codex because neither CLI transport had budget) held on two criteria: WO-123's command-only fixture could pass while WO-118's resident run had no admission path, and WO-055's derivation let a read-only verifier's references widen a writer's scope. The repair revision (`7e2c474`) repaired both criteria (the resident admits a filed intent under a portfolio's `intent` class and admitted grants and owns the vertical continuation; the repair derivation is bound to the original order's surfaces, named test commands and effective envelope) and named WO-123 as WO-118's hard input. The second receipt ([003](refutations/2026-09-08-critical-path-003.md), the same review source) accepted both repairs and held once more, on WO-121 criterion 1: the presence classifier made the launch path the evidence of a person's presence, so an operator-launched worker that kept working after `away` could end the away phase. The repair at `b812128` made origin a pure function of the hook event kind and the resident's stamp, made tool activity from any session actor liveness, and gave WO-044 the row that says which hook events a scripted prompt fires. The third receipt ([004](refutations/2026-09-08-critical-path-004.md), the same review source) passes with every hold answered by its dated accepted disposition; its largest remaining gap, the authoring journey through the live client at WO-117 criterion 2, warrants no hold for this horizon and is preserved below as a candidate. No hold was overridden. The 2026-09-06 wave pairing below is superseded in sequence only; its measurements, procedure and receipts stand.

<!-- dotln-wo044-disposition --> **WO-044 checkpoint disposition (2026-09-14):** the writing-worker record is filed at [writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md) with 23 observed, 0 blocked, 8 unavailable, 2 ambiguous rows; the first mandatory replan checkpoint is now open for the next planning pass, which designs WO-049, WO-051 and WO-068 from those labels.

**WO-053 checkpoint disposition (2026-09-17):** [both live writer smokes and commit-identity recovery passed](../evidence/WO-053/README.md); At that date R2 awaited WO-111; the combined disposition is recorded below, with no family waiver inferred.

**WO-111 R2 checkpoint disposition (2026-09-24, repaired after VER-001):** [The combined R2 answer](critical-path-2026-09-08.md#stop-and-replan-points) compares cost/session evidence with the audit and reassesses integration-package growth. Six scratch changes passed six fresh verifiers; the separate mission store returned drift. Return cancellation is supported by replay, while the receipts disclose outside-portfolio Codex trust writes. The document repair is ready for re-verification. The operator keeps isolation follow-up FUP-3c34a8ffbf61376f independent of WO-111’s outcome; it is not a prerequisite for this handoff (D014). Broader live portfolio operation remains unproven. Owner-target selection and grants remain a later reviewed portfolio edit. Starter export need not wait for the already-merged WO-100. No remaining deferred family is waived; previously closed family members remain closed. No runtime package split is selected from file count alone; the observed launch-isolation seam is the immediate repair input. See [D012](../evidence/WO-111/decisions.md#wo-111-d012).

**Outstanding cleanup (2026-09-19):** the operator budgeted one pass for logged non-blocking issues, unread suggestions and continuing debt. Eight read-only surveys read the 371 pending register rows, 190 verification and final-review reports, 47 refutation receipts, the dated planning documents and the tree against `main` at `3b3533f8`; the pass disposed the register, filed [WO-142](../work-orders/WO-142-outstanding-cleanup.md) (50 rows, each re-observed before it is edited and ended as fixed, not reproduced or returned), paired it with WO-084, lent WO-090 the pair slot WO-138 cannot use while WO-137's outcome is `inconclusive`, held WO-085 to WO-089 with a re-measured reason each, and recorded what did not fit as the candidates section dated 2026-09-19 below. The record is [the cleanup planning document](outstanding-cleanup-2026-09-19.md).

**Operator answers (2026-09-19, second pass):** the operator answered the cleanup pass's open decisions and directed that a pass plan what it finds. Filed: [WO-143](../work-orders/WO-143-resident-lock-recovery.md) (a resident killed inside lock acquisition restarts without a human; the capability table's blocker for `runtime.resident` level 2), [WO-144](../work-orders/WO-144-outside-project-write-grant.md) (outside-project writes need a role or support grant; a fifth refusal for known destinations) and [WO-145](../work-orders/WO-145-tinkerer-economy-experiment.md) (the first Tinkerer experiment: economy, three trial orders, a pre-registered reading). WO-138 is amended to activate on WO-137's successful live row because its inputs are public; the stale 120 s `fastGateMs` ceiling is unset; WO-142 gains row B17 from the operator's broken-windows source (a defect met is fixed or boarded up as a record, never left as a sentence in a report). The record is [the cleanup planning document](outstanding-cleanup-2026-09-19.md) §10 and §11.

**Copilot CLI pass (2026-09-20):** the operator installed GitHub Copilot CLI and asked for the smallest integration that makes it a supported, operator-launched harness for implementation, fixing and verification. The pass found no existing Copilot work, observed that the CLI already loads `AGENTS.md + CLAUDE.md` and lists the six `dotln-*` skills, and found one unknown that decides the rest: the CLI's bundled changelog says it reads `.claude/settings.json` hooks and denies a tool call when a pre-tool hook errors, so whether DotLn's hooks already fire, fire twice or deny every call under Copilot has never been observed. Filed: [WO-146](../work-orders/WO-146-copilot-cli-harness.md) (probe first; one compiled profile at the existing source; the one hook set reused without a second registration; each control labeled enforced, advisory, unsupported or untested; the harness id kept apart from the model; four operator-launched qualification episodes in a scratch repository; final review and release close left untested). One candidate is recorded: a pasted dispatch does not resolve a role. The record is [the Copilot CLI planning document](copilot-cli-integration-2026-09-20.md).

**Standard pass (2026-09-21):** the operator's bare `planning: standard planning pass` after the WO-069 close (v0.37.2 published; every order through WO-069 final-reviewed). The pass found the next pair intact and WO-138's amended preflight met (WO-137's live inference rows; WO-110 D007's 2026-09-20 envelope), read the 67 untriaged follow-up rows the eleven orders closed since 2026-09-19 had boarded, and disposed every one: 22 were repair directives and review routings the orders' own cycles had already discharged, the rest real nominations. Filed: [WO-147](../work-orders/WO-147-resident-lock-contention.md) (the host lock under live contention, boarded by WO-143's verifier for the planner ahead of WO-111; the WO-143 boundary fixture's load sensitivity), [WO-148](../work-orders/WO-148-resident-binding.md) (the operator's 2026-09-20 candidate: one command binds a resident's mission check to the active order from canonical state, with the six decisions answered) and [WO-149](../work-orders/WO-149-codex-sessions-begin.md) (a Codex dispatch begins its harness session, so a Codex receipt carries counters; WO-099 D035). WO-147 and WO-148 pair directly after WO-138 and WO-071; WO-149 takes a one-entry slot after them. Carry-ins landed on the WO-138, WO-070, WO-085 and WO-111 rows; five gathered candidates are recorded in the section dated 2026-09-21 below. The record is [the standard-pass planning document](standard-pass-2026-09-21.md).

**Operator answer (2026-09-21, second pass):** the operator accepted the standard pass's Tinkerer proposal ("make tinkerer on by default unless there was a legit reason not to") and directed the pull request. The check for a legitimate reason found none: the equipped executor cold start is 24,327 bytes against the 24,576 ceiling, the per-order cost is at most 900 s and declinable, no regression is recorded, and WO-145 D001's reason for rejecting default-on is discharged by the reading. A loadout default is a code change, so the pass files [WO-150](../work-orders/WO-150-tinkerer-economy-default.md) (the default flipped, the opt-out kept, cold start measured against the ceiling under the standing route, the WO-145 baseline re-baselined, the three-trial history carried) in a one-entry slot directly after WO-138 and WO-071, sequential with WO-149 because both regenerate the bundle. The record is [the standard-pass planning document](standard-pass-2026-09-21.md) §12.

**Entropy Reducer pass (2026-09-22):** the operator's bare `planning: entropy reducer` after the WO-149 close (v0.40.2 published; every order through WO-149 final-reviewed). The pass found the compiled reviewer (WO-023, v0.5.0) run once, on 2026-09-04 against its own pre-repair subject, with no launcher, no caller of its five host APIs outside its module and tests, one proposal packet never filed and no route from a surviving finding into the follow-up register, while the planning refuter compiled from the same identity (WO-041) has a command, transports with model and effort on the command line, and an immutable receipt helper. Filed: [WO-151](../work-orders/WO-151-entropy-reducer-dispatch.md) (the dispatch as a command family mirroring `plan refute`: a frozen subject, the compiled reviewer, one fresh review and one fresh blinded refutation through the existing transports with the actor pin satisfied by invocation readback or a labeled substitute, numbered immutable receipts, and operator dispositions that land accepted findings as register candidates; the loadout, pin and authority unchanged) paired with [WO-152](../work-orders/WO-152-mission-check-schema-ids.md) (from the register's twelve untriaged rows: the duplicate `contract-clause` ids that make every `claude-cli-print` mission check fail before a model call; WO-148 D009) directly after WO-120 and WO-063 and before WO-100 and WO-064. A second nomination, WO-149 D009's Codex session-entry advisory, was drafted as WO-153 and withdrawn before commit because the sequence would hold 101 orders against the subject's limit of 100; the draft is retained in the local control lane and the row is deferred until the operator changes the horizon. The remaining rows are disposed. Three candidates are recorded in the section dated 2026-09-22 below. The record is [the Entropy Reducer planning document](entropy-reducer-dispatch-2026-09-22.md).

**Entropy review pass (2026-09-22, second pass of the day):** the operator's bare `planning: entropy reducer` after the WO-151 and WO-152 closes (v0.42.0 staged at WO-151's close; every order through WO-152 final-reviewed; the next queued pair WO-100 and WO-064). `npm run entropy -- subject` named REVIEW-002 (base `5b4b99ca`, bound by REFUTATION-003: four measured findings, all survived, nothing disposed), so the pass consumed it and paid for no episode. Every finding was re-measured on `main` at `4bf626f4` before disposition and all four hold: 82 self-host evidence logs hold 104.8 MB of 184.8 MB tracked (56.7%); editions re-mint on version-only bumps at one live episode each; the 1,667-byte refusals paragraph loads twice per role with the executor 164 bytes under its ceiling; `plan check` runs 16.5 s. All four findings and all three proposal packets are accepted, and the packets are filed under `docs/proposals/`. The sequence holds the subject's limit of 100 orders and a planner does not change the horizon, so no order is filed: the evidence-editions order (ER2-001 and ER2-002, one recorder) is designed in the REVIEW-002 section below and waits for room; the single-source refusals emission (ER2-003) is nominated as a boy-scout item on WO-100's catalog row, since WO-100 regenerates the bundle anyway; the `plan check` hoist (ER2-004) is nominated as a boy-scout item on WO-064's row; the cold-start metric and ceiling route waits for the operator's reserved efficiency pass (WO-054 D006). FUP-0051's reopening observation has occurred and is recorded on its entry. The record is [the REVIEW-002 planning document](entropy-review-002-2026-09-22.md).

**Operator answer (2026-09-22, third pass, same branch):** after PR #119 was opened the operator asked why closed entries sit in the planning subject at all and why a planner needs the operator to remove them, and named the outcome: three Entropy Reducer rounds and not one entropy-reducing order. The record answered the first question: the sentence keeping closed entries was written on 2026-09-04 for a hand-maintained checklist ("the generator marks them rather than asking the operator to cross them off"), the 100-entry guard came with the refuter on 2026-09-07 with no recorded reason, the 100-order horizon followed a day later, and nothing that reads the sequence needs a closed entry (the generated index keeps them in its Closed section with their marks). The pass's own error is recorded in the planning document §12: it treated that sentence as an operator-only rule and deferred the order it had designed. Under the operator's direction closed entries now leave the sequence at each planning pass; 55 are retired, 45 queued entries remain, and four orders are filed into the room: [WO-153](../work-orders/WO-153-codex-session-entry-advisory.md) (the withdrawn Codex session-entry draft), [WO-154](../work-orders/WO-154-evidence-editions-by-reference.md) (evidence editions keyed by behavior and recorded by reference, from ER2-001 and ER2-002: about 80 MB a week of copied source bodies and one live episode per pins-only order), [WO-155](../work-orders/WO-155-single-source-floor.md) (the refusals paragraph emitted once and a cold-start delta, from ER2-003; the ceiling route left to the operator's reserved pass) and [WO-156](../work-orders/WO-156-plan-check-sub-second.md) (`plan check` under 2 s, from ER2-004). WO-153 pairs with WO-154 and WO-155 with WO-156, both pairs directly after WO-100 and WO-064 and before WO-111 and WO-114, with one re-minting order per pair. The same day's boy-scout nominations on WO-064 and WO-100 are withdrawn. The record is [the REVIEW-002 planning document](entropy-review-002-2026-09-22.md) §12.

**Onesie-twosie pass (2026-09-27):** the operator asked for a small pass that drains the follow-up queue and fixes small nagging issues in at most two orders, in parallel and next, one or none being acceptable (`main` at `4c34b332`, WO-166 merged and published as v0.52.3). The pass read all 155 pending register rows and verified each candidate defect against the source before choosing. Two findings shaped it. The first is the defect the operator had already ranked: the harness prints a session scratch path that nothing creates (WO-166 D015). The second is why the queue does not drain by itself: a row deferred until "the next order that edits" a file is never shown to that order, and four such seams were opened by nine orders that closed with the rows untouched. Filed: [WO-168](../work-orders/WO-168-printed-path-exists.md) (the scratch directory exists when printed, a granted root is a real directory, a refused Codex dispatch leaves no reservation, a live gate stops refusing listed reads for their arguments, the standing writer sentences say what ships; re-mints deterministically) paired at the head with [WO-169](../work-orders/WO-169-followups-reach-their-seam.md) (the feed names the pending rows a change touches and advises at completion, exports its rows whole and applies a batch; the integrate helper regenerates after authored conflicts are staged and records the release line once; the configuration-root suite declares the scripts it scans; the meter's unset label; no re-mint). Two queued orders are amended where WO-085's verifications boarded a planning decision: WO-086 retires the docs check's Release boundary exemption and restates the ceiling, and WO-167's criterion 2 names the check that proves the skills' citations. One planning rule is added in place to product 07: an order that edits a machinery suite's declared source names `npm test -- --review` in its final criterion. Carry-ins landed on the WO-075 and WO-117 rows; five candidates are recorded in the section dated 2026-09-27 below; nine rows whose reopening condition had occurred lay outside the pass's category and were recorded open until the operator's answer decided them (next paragraph). WO-164 takes a one-entry slot after the pair. The record is [the planning document](onesie-twosie-followup-drain-2026-09-27.md).

**Operator answer (2026-09-27, second judgment, same branch):** after the first report the operator authorized the push and the pull request and delegated the decisions reported as the operator's, admitting later orders beyond the two. Receipt 031 had judged the four orders aligned-with-findings with no hold and fifteen known issues; twelve name defects in the order text and are repaired in WO-168, WO-169, WO-086 and WO-167 before anyone activates them. Decided under the delegation, each with its reason in the planning document §13: the two redirect forms in WO-168 item 4 stay; consume before produce is adopted in place in product 07; the babysitting rate and the discarded session journals become [WO-170](../work-orders/WO-170-meter-keeps-what-sessions-observed.md) (a bounded per-order meter snapshot written while the journals exist, retained usage read, an unread journal reported unavailable instead of zero, operator directions counted from the public record), in a one-entry slot after WO-164 and WO-171; the stored-data inventory was run by hand as the pass's research stream (§14), its generator is not filed, and what it found becomes [WO-171](../work-orders/WO-171-prune-apply-finishes.md) (a prune apply that re-plans before every deletion cannot finish: 186 candidates at 64 s a plan, 5.5 GB listed unpruned), paired with WO-164, and four candidates in the section dated 2026-09-27; receipts by identity, edition retention and five product candidates are deferred with measured reasons and reopening observations. Five of those rows wait on product orders already queued, so the recommendation recorded for the operator is to run the product sequence rather than to file more.

**Failures pass (2026-09-28):** a bare planning dispatch (`main` at `5f3849ec`, WO-162 merged and published as v0.52.10). Nine minutes in, the operator redirected the pass: about a hundred failures had occurred across the phases, planning's among them for not noticing, and they were to be addressed; later the operator asked whether the pass had gone through all the older queued orders. The pass counted the record: 96 failed judgments (86 verifications, 10 final reviews) and 99 repairs over 117 orders, the first verification failing in 54 of them and in 23 of the 29 made ready since 2026-09-22, 56 recorded corrections, and failed judgments with their repairs taking a third of the 445.6 recorded phase hours; no instrument a pass reads showed any of it. Eight read-only surveys read the 96 failed reports whole and classified their 184 blocking findings into six causes. Filed: [WO-173](../work-orders/WO-173-handoff-states-what-it-knows.md) (a criterion ledger at the executor's two completions; a criterion recorded met is checked against its gate's passing row, the document gate run inline; one recorded unmet is shown at the next dispatch with the waiver route; `npm test` is not run again at a code identity that passed; the lock matrix split into subtests; deterministic re-mints) paired in the second slot with WO-116, and [WO-172](../work-orders/WO-172-failures-reach-planning.md) (`plan failures` over the public record, the counts at `plan start`, failed judgments, repairs and corrections per order in the meter, the direction count judged against a hand classification; no re-mint) paired in the third with WO-065. Six planning rules are in force from this pass (the planning document §10.1): a pass reads what failed first; a criterion declares its set; criteria are checked against each other; a fact carries its commit; the final criterion names the gates and the Cost line the sources it re-mints; an operator-only step has a fallback. Five more surveys re-observed all 45 open orders against `main` and found 109 of 899 citations stale, no order naming the document gate, 44 legacy Cost lines and 173 criterion phrases flagged as a universal, a conflict, a claim no command shows, a moving number or an operator step without a fallback; every queued order and the five unsequenced orders that are not umbrellas are amended in place, and the six umbrellas are left unedited (not activatable by their own text; their children now state the rules they carried). The sequence is recut so a product order leads each of the first four pairs; WO-072 now depends on WO-123, which carries the source-change guard fix (FUP-8369f2b4284e70a8). Mid-pass the operator corrected the pass for shifting work onto the operator: a live feedback episode now runs in the executor's session on Codex `gpt-6-sol` at `xhigh` or Claude Code `claude-opus-5-5` at `xhigh` with no authorization and its cost accepted, a step the executor can perform is the executor's, and WO-172 carries that rule into product 07. Eight candidates are recorded in the section dated 2026-09-28 below, each with its measurement and reopening condition. Receipt 033 (`2026-09-28-planning-9d6f7cc5cb3b7647-033`), from the operator's own refute dispatch on GPT-6 Astra at `max` with the time limit removed, judged the sequence and all 41 orders aligned-with-findings with no hold and fourteen known issues, carried to the catalog rows below; the operator then directed the push and the pull request. The record is [the planning document](failures-across-phases-2026-09-28.md) and its [inventory](failure-inventory-2026-09-28.md).

**Entropy review pass (2026-09-30):** the bare phrase `planning: entropy reducer` (`main` at `feb7a92e`, WO-066 merged and published as v0.57.0). No filed review was both refuted and undisposed, so the pass paid for [REVIEW-004](../instance/entropy-reducer/runs/REVIEW-004.md) (2,216 s, USD 11.71) and [REFUTATION-005](../instance/entropy-reducer/runs/REFUTATION-005.md) (700 s, USD 2.08): seven measured findings, all seven survived. Filed: [WO-174](../work-orders/WO-174-gate-rows-cover-what-suites-read.md) (product cases that read documentation run in the document gate behind a read guard; `--review` selects every machinery suite that imports or spawns a changed file), paired with WO-058 at the head, and [WO-175](../work-orders/WO-175-reopening-conditions-report-themselves.md) (the numeric reopening conditions that hold are listed at planning entry; the meter's reopen-candidate count is computed or absent; a review's temporary files stay inside its episode), paired with WO-059. Two findings are accepted as true and declined as orders on cost, each with its numeric reopening condition on its register row: the document gate's history-linear parse (ER4-005) and the repeated authority transcripts (ER4-006). The pass also acted on the three recorded thresholds the review found crossed, regenerated the roadmap's release table, moved the live-episode rule from the sequence's entry note into product 07, and folded that note: a pass's dated paragraph now leaves with the last entry it places, and the sequence file fell from 13,516 to 3,868 bytes. Eleven closed entries leave. The record is [the planning document](entropy-review-004-2026-09-30.md); the section [REVIEW-004 consumed](#review-004-consumed--dispositions-and-routes-2026-09-30) carries the routes.

**Standard pass (2026-09-30, second):** the operator's `planning: standard planning pass + small additions` (`main` at `b51a58a8`) with eight mid-turn messages: a release close that stopped at a nested scratch repository and then moved it by its own decision; spawned agents pinned to Codex `gpt-6.1-sol` at `max` and Claude `claude-opus-5-5` at `xhigh`; a publish the Claude auto-mode classifier denied and nobody retried; WO-172's subject map as a trove to mine beside the queue and the boarded items; whether product orders are missing after five machinery passes; and that `v1.0.0` is months away and the period until then is early access. The pass routed all 30 themes, took the two entry measurements the map asked for (40 gate rows since WO-173, 12 repeats at a green identity; 3 failed verifications, none only on an undeclared case), checked product coverage against the vision, the critical path and the roadmap, and filed eight orders: WO-180 to WO-183 for the vertical's promised baseline witness, review episode and deliverable-ready conjunction and for the `v1.0.0` exit's shape; WO-176 to WO-179 for the close, the pinned models, the record and the role text. Every pair from the third slot carries a delivery lane. The record is [the planning document](standard-pass-2026-09-30.md).

**Entropy review pass (2026-10-02):** REVIEW-005 and blinded REFUTATION-006
found two measured minor issues. Both are accepted; neither receives a
new order. The pass records timeout headroom and explicit reversal
conditions, re-disposes three fired follow-up triggers from their current
sources, and declines the proposed four-row prose parser. Fourteen closed
entries leave the sequence; WO-123 remains next. The document gate's
39.984 s median and weekly evidence growth are reassessed without claiming
that a parse cache or evidence ceiling is the remedy; the roadmap table is
refreshed. Routes and NoOps: [the planning document](entropy-review-005-2026-10-02.md)
and [the disposition table](#review-005-consumed--dispositions-and-routes-2026-10-02).

**Standard pass with 5S and the operator's notes (2026-10-02, second):**
the dispatch `planning: standard planning + 5s + personal notes` (`main`
at `08845c71`) with seventeen notes the operator had kept over a day.
Nine read-only research workers measured each note against the record
before anything was decided. What they found shapes the pass. Fourteen
of the eighteen blocking findings of the thirteen failed final reviews
were already in the subject the last passing verification judged; the
verifier's written duty is the criteria and nothing asks it to review or
attack the implementation. Gates take 22.5% of phase time, and a replay
of the last thirty orders shows that selecting suites by what a change
affects would leave 99% of the task time in place for the median order,
while three slow cases, reruns at an unchanged identity and rows that
stop at the worktree boundary account for the recoverable part. The
memory incident was an unbounded probe a reviewer ran by hand, stopped
by another agent and by no mechanism. Thirty-three of sixty-four
pre-registered experiments were declines, and twenty-one of twenty-five
goal-alignment records restate their order. The front page's release
block is three times the size it was pruned to twelve days ago. Eleven
orders are filed and three amended (WO-123, WO-073 and WO-014). Two combine boarded items, each with
its own criterion, as the operator asked: [WO-184](../work-orders/WO-184-seams-before-the-vertical.md)
(nineteen seams settled before the vertical is composed; WO-123 now
depends on it) and [WO-188](../work-orders/WO-188-boarded-machinery-items.md)
(twenty-four machinery items, the scratch rule the operator left to the
planner among them). Four take one cause each:
[WO-185](../work-orders/WO-185-no-order-can-exhaust-the-host.md) (a
guard outside the agent, budgets as shares of physical memory),
[WO-186](../work-orders/WO-186-gate-time-follows-the-change.md) (the
slow cases, task-level reuse, an identity that covers what runs),
[WO-187](../work-orders/WO-187-verification-attacks-and-reviews.md)
(verification attacks and reviews; final-review findings are classed
and counted) and [WO-189](../work-orders/WO-189-front-page.md) (the
front page rewritten once from three scored candidates and then owned).
[WO-190](../work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md)
and [WO-191](../work-orders/WO-191-reader-profiles.md) take the index
and the published text. Three make a starter instance workable on a
constrained managed host, at the operator's direction and after the
export exists: [WO-192](../work-orders/WO-192-router-drives-an-order.md)
(one session drives an order, a fresh worker per phase),
[WO-193](../work-orders/WO-193-instance-capability-requests.md) (a
generic request from an instance, read into planning here) and
[WO-194](../work-orders/WO-194-private-predecessor-map.md) (a private
map from predecessor behavior to what carries it). The sequence is recut
into seven lane pairs with a machinery order beside each delivery order,
and every open order has a place: WO-014 is last, and the six umbrella
records leave the open list when WO-190 lands. Three planning rules are
added in place to product 07: a duty an order owes is written in that
order; a criterion says what a write-back states and where, without a
byte count; a pass sets the ceiling of each bounded document its queued
write-backs touch. The ceilings are reset on that basis. Every active
register row is disposed; ten candidates are recorded in the section
dated 2026-10-02 below. Receipt 038
(`2026-10-02-planning-e72192f0c60b6f96-038`), from one fresh worker with
no inherited conversation, judged the fourteen changed orders and the
sequence aligned-with-findings with no hold and twenty known issues.
The judged orders and the sequence are frozen by the pass's one
judgment, so the known issues are carried on the catalog rows below,
each with its reopening observation. Fourteen of them point at text a
later pass should amend before the order is activated (WO-185's guard
and lanes scoped to one repository; WO-073 refusing a registration with
no profile; WO-184's live proof met by one attempt in three; the three
instance orders placed ahead of WO-118); the amendments are prepared and
listed in the planning document §19. The record is [the planning document](standard-pass-2026-10-02.md).

**Operator answer (2026-10-02, third pass, same branch):** after the
first report the operator asked what the reported decisions required and
then directed that receipt 038's amendments be applied on the branch.
The fourteen prepared amendments are applied to twelve orders and the
sequence: WO-184's live proof needs all three attempts; WO-185's guard
and lanes are one per user on the host; WO-123's first criterion states
the target and review-constraint rule its Design held; WO-187 replaces
the verifier's duty sentence, reads the detail at verify time, takes no
new cold-start acceptance and never refuses a final review over a
finding's class; WO-188's close record names what it removed, and its
comment sentence is the executor's alone; under WO-073 a registration
declares its profile and one without a profile still activates; WO-191's
reader runs after a profile change or at the operator's word; WO-192
bounds a driven session's total and shares one generator of agent
definitions with WO-187; and WO-118 now precedes the three instance
orders. Receipt 038's twenty known issues are written in the orders'
own text, six of them as they stood. The operator left the other
reported items at their defaults: WO-192 stays in the serial run, the
standing instructions are unchanged, and the planner's three recorded
assumptions stand. One candidate is added to the section dated
2026-10-02. Receipt 039 (`2026-10-02-planning-9471b224202aeb77-039`),
from a second fresh worker, judged the eight orders whose judged text
changed and the sequence aligned-with-findings with no hold; its
twenty-three known issues are on the catalog rows below, and no judged
text is edited after it. The record is [the planning document](standard-pass-2026-10-02.md) §20.

**Release-close pass (2026-10-03):** the operator's `planning:` message
after the WO-184 close (`main` at `efe62994`, v0.66.0 published) asked why
a release close in Claude keeps failing, with the WO-184 session's own
account of its two stops, a question on WO-188's position and an
instruction to push and open the pull request. The pass read the 14
retained close records, their session journals and transcripts. Six of
the twelve Claude closes needed the operator: five after the auto-mode
classifier denied the publish, one after cleanup stopped. WO-178's
admission fired in none of the nine closes since it landed: in five the
prompt hook ran its fallback because the merge had changed the pinned
runtime, so no dispatch was recorded; in four the session wrapped the
300 KB-output command so it was no longer byte-exact. WO-179's sentence
told each session to hand the blocker back, and forbade the re-run the
helper prescribes. Filed: [WO-195](../work-orders/WO-195-roles-finish-what-was-dispatched.md)
(the admission reaches the close, one spelling and a short output, three
cleanup steps, a completion condition in the role, and a planning pass
that pushes its branch and opens its pull request, which the operator
had asked for in 9 of 12 planning sessions since 2026-09-20), placed
next as a third lane beside WO-185. WO-188 stays where the 2026-10-02
pass placed it by number. Receipt 040
(`2026-10-03-planning-90bdcd90e4af7f16-040`), from a fresh worker, judged
WO-195 and the sequence aligned-with-findings with no hold; its six known
issues are on WO-195's catalog row. The record is
[the planning document](release-close-finishes-2026-10-03.md) §11.

**Process debt (2026-09-09):** the operator opened an emergency pass after
the `v0.16.0` close with eleven observed failures of the lifecycle machinery
and one direction: one order, first in line, exempt from the one-seam rule.
The pass measured the claims against the control segments and the source:
WO-042 took 16h37m from activation to its final-review pass and WO-039
21h32m, most of it in verification, repair and review machinery; the
reviewer's read obligation was 135 files and 5.3 MB because the obligation
is every change since session entry and nothing is committed before review;
Stop hooks require the whole 37-step suite at the current tree hash before a
turn may end; the tag manifest pins the literal `npm test`; the closeout
classifier does not know the directory the harness writes its own state to,
so the close hand-wrote a script; attestation degrades to `unknown` on any
CLI patch version nobody recorded; the anti-oscillation unit does not say
what the operator means and enforces nothing; and no mechanism compares any
of this across orders although the events exist. The pass filed
[WO-126](../work-orders/WO-126-process-debt.md) at the head of the sequence
with eighteen falsifiable criteria: advisory Stop hooks with hard enforcement
at the lifecycle commands, authorship-observed read obligations with a
generated-artifact manifest, evidence keyed by tree hash and reused at the
tag, a fast gate under two minutes beside a full gate at the transitions
(WO-036 folded in with numbers and superseded whole), an automated closeout
that owns `docs/control/local/` and reconciles intake, attestation by
version line with an executable discovery row, the anti-oscillation prose
rewritten to the operator's definition with the residue block removed from
the floor, a `plan start` command and a fail-closed tool classifier (the two
2026-09-08 harness-host nominations, allocated), a budget file, and a meter
that prints every order's delta into the PR body and fails the gate on an
unaccepted breach. The operator answered two questions the same day: no
numeric title rule, because a title is a headline sized by its content and
an invented length limit was rejected before, so criterion 12 makes the
series visible at publish time instead; and the refutation of this pass may
run through the automated CLI transport now, and as one dispatch phrase in
either harness once criterion 16 lands. The one-seam and four-hour rules stand for every other order. The pass
declined, as NoOps recorded below, removing the harness wholesale and leaving
tokens and cost unrecorded. Receipt 005 held on criterion 13 and the repair
landed; receipt 006 passed the horizon at `82a3d5b`; the operator's
corrections after it (tokens and cost, decision provenance, two refuter
scopes, the four questions, the trap rows) drew receipt 007's hold on
criterion 16, whose cost judgment had no permitted input; that repair
landed, and the receipt carrying its accepted disposition closes the pass.

**Gate cost (2026-09-12):** the operator opened a planning pass after the
`v0.17.2` close with a second model's plan for proof-carrying gates and full
authority to veto or alter it. The pass verified the plan's claims against
`scripts/lib/suite-evidence.mjs`, `scripts/test-runner.mjs`,
`scripts/lib/gate-evidence.mjs`, `scripts/lib/lifecycle-evidence.mjs` and the
host's retained gate rows, and measured WO-125's gates: 21 `npm run test:full`
records over 18 transitions, 10 fresh runs of 613–839 s (8 failed), 9
composed runs of 41–419 s (all passed) and 2 preflight refusals, 9,443 s of
gate wall-clock in an order whose latest phase attempts sum to 8,275 s. Three
findings order the work. First, the largest waste is not reuse: twelve fresh
full gates across WO-043, WO-125 and WO-127 failed on fixed wall-clock
deadlines under load (`console` six, `plan-refutation:current` two,
`harness-fixtures` two, `runner-fixtures` one) or on a tree changed during
the run (two), 8,387 s in total, each followed by a passing rerun; the relayed
plan does not mention it, and WO-125's FINAL-001 named this pass the owner.
Second, the plan's central claim holds: the shared suite key hashes every
ref, `HEAD`, the checkout path and the CPU count, so each transition's
checkpoint ref made the next gate run all 78 tasks fresh (five of WO-125's
ten fresh runs, 3,876 s, followed a transition with no source change), and
the per-worktree cache leaves the release close on main with nothing to
reuse. Third, the plan's lifecycle claim does not hold: the lifecycle already
accepts the composed exact-tree aggregate (WO-126-D009, D014) and
identical-tree reruns compose in 41–47 s; what stays fresh after a document
change is the whole-tree class of about 25 suites (243–419 s), because only
six suites and the release cases declare their documents. The pass files
three bounded orders at the head of the sequence, serial because they share
the runner: [WO-128](../work-orders/WO-128-fresh-gates-pass-first-time.md)
(deadlines that survive load, per-task concurrency in the gate row,
exclusivity re-measured),
[WO-129](../work-orders/WO-129-suite-evidence-input-identity.md) (a key of
declared inputs, the cache shared across worktrees, explained misses) and
[WO-130](../work-orders/WO-130-declared-suite-inputs-replica.md) (narrowed
suites execute inside a replica of their declared inputs) and
[WO-131](../work-orders/WO-131-remaining-suites-under-replica.md) (the
remaining suites declared under replica execution, and a kernel denial where
the host permits one). Each obeys
the one-seam and four-hour rules; none changes the lifecycle predicate, the
exact-tree aggregate or a test. Goal alignment: the mission's operator-flow
outcome is the operator's waiting and the visible reruns, and the critical
path is every remaining order paying these gates per phase; the NoOp baseline
is WO-125's 2 h 37 min of gates for 30 min of implementation, repeated per
order; the risk of intervening is a stale green from an incomplete
declaration, held by the fail-closed defaults, the replica validation and the
miss explanations; the traps weighed are rule beating (a cache an agent could
write, refused by the hooks), drift to low performance (deadlines raised by
constants, declined), shifting the burden to the intervenor (operator reruns,
removed) and policy resistance (D012's exclusivity workaround against the
load it was meant to absorb); the other four lenses are immaterial to a
runner change and are not argued. The cold-gate structural cuts the plan
proposes (copy-on-write fixture clones, split shell suites, pure policy
extraction, model checking, sharding) are recorded as a product-07 candidate
whose entry evidence is WO-128's concurrency trace; the preflight barrier
stays (WO-127-D007; the preflights end at 16 s of a 475 s gate). The
dispatch is captured verbatim in ignored intake (SHA-256
`4eb2c26a6530687e67c05781f2f153233d90b340b7365c1bd0cbb96f4b101993`); the
refutation was the operator's next dispatch, `planning: refute`. Receipt 009
(a direct session judging the full horizon) held on WO-130 criterion 2,
because a replica that merely omits undeclared files cannot see an optional
conditional read, and on WO-078 criterion 1, because that order added
recurring bookkeeping with no named removal or dated acceptance. The pass
repaired both criteria: WO-130 validates a declaration in two replicas, one
with every undeclared path absent and one with each present but unreadable,
with the optional-read counterexample as a fixture and the validation keyed
by every input that selects a read path; WO-078's registry is generated from
receipts written inside the existing export step, its Cost line names the
removed lookup, and no recurring bookkeeping remains. The dated accepted
dispositions were filed as `proof-carrying-gates-2026-09-12-dispositions.json`,
retired by WO-163 on 2026-09-27: commit `c0a60b6d` holds its last bytes and
[receipt 013](refutations/2026-09-15-planning-39243aa3f0fc8df2-013.md)
carries the same nine entries;
Receipt 010 held WO-130 criterion 2 twice more: a replica that substitutes
a directory is skipped by a regular-file check, and a validation record keyed
without the declared inputs that select read paths stays current after a
declared flag flips. The pass took the general lesson rather than a third
probe: no finite probe set validates a declaration against an arbitrary
guard, so validation of a real-tree run was withdrawn and replaced by
execution inside a replica of the declared inputs at every run, where an
undeclared file does not exist and no guard can find it. Before choosing
that mechanism the pass probed the host from a sandboxed session on
2026-09-12: a read-denying `sandbox-exec` profile is refused there
(`sandbox_apply: Operation not permitted`), which rules out a kernel sandbox
as the mechanism for gates inside sessions and keeps it as an addition where
the host permits it; forced clone-on-write is refused (`ENOSYS`); the
installed roots are 55 MB in about 1,400 files, so plain copies are cheap.
The remaining declarations and the document-only measurement were split into
WO-131 under the four-hour rule. WO-128's objective now admits a host load
outside the declared class as a named non-defect, and its two measurement
series collapse into one when the shared-cap series passes. The dispositions
file carries both receipts' holds. Receipt 011 (pass scope, 333 s
dispatch-to-file) held WO-130 criterion 1: a declared fixture can hard-code
an absolute path into the candidate tree, the residual the order's design
already names. The operator overrode that hold through the gate's attributed
route (a `PlanHoldOverridden` event in the planning control log naming the
actor and the capture's SHA-256 `5d5985d3d0d078ca2a3be9b17f77c53ec71dcb59a1020e1830c6555bbc6e10e6`)
with the direction that the pass plans a platform, that the hold is a known
issue to revisit when it becomes applicable or bites, and that a future
planning pass must make the refutation pass worth its cost: three
refutations of this one pass, all holds, cost 2,454 s, 833 s and 333 s of
recorded dispatch-to-file and more of operator time. WO-130's execution
record carries the known issue and its reopening conditions; product 07
§Candidate — refutation pass worth its cost carries the direction for the
next pass. The pass closes on receipt 011 with its hold overridden.

**Machinery stand-down (2026-09-15):** the operator opened a planning pass
after the `v0.17.7` close with the verdict that the machinery orders
(WO-125, WO-126, WO-128 to WO-131, WO-044) made the lifecycle worse and
stalled product work for five days, and asked for a meta pass over the
previous planning passes and a meta-meta pass over the planning process
itself. The pass ran six independent diagnoses over the records and filed
[the planning document](machinery-stand-down-2026-09-15.md). What the
records show: the canonical fresh gate went from 476 s at WO-126's close to
570–648 s with 82 tasks (780–881 s under the replicas in between), every
cross-session gate row is cold because the lifecycle requires a full-gate
row at a whole-tree hash that includes the reports and control events each
transition writes, thirteen of the fourteen merges after WO-042 changed
machinery and none the kernel, four refutation receipts held on constructed
counterexamples at 2,454 to 755 s each, and the release close for v0.17.6
was never published. The meta-meta finding is that the planning process
rewards adding a mechanism and never charges for one: the refuter rewards
contract completeness, Cost lines are judged by a regex at filing and never
reconciled, the meter cannot fire on a sawtooth, findings become criteria in
the order that found them, a complaint counts as a question, and nothing
ranks logging above refusing. The pass files one order at the head of the
sequence by the operator's exemption,
[WO-132](../work-orders/WO-132-machinery-stand-down.md), with one wholesale
change and eleven surgical fixes: transitions never require gate evidence;
one product gate runs once per order at final review keyed by code identity
and is the evidence the pull request, the tag and the close consume; release
close is the post-merge publish and runs no suite; replica execution and
declared-input reuse leave the default path with their suites; attestation,
versions and effort are logged, never refused, with `ultra` recorded as
`xhigh` plus subagents; the writer-isolation unit drops its main-branch
conjunct; DotLn's hooks refuse a second writer and a live-gate write and
delegate everything else to the host prompt on both harnesses; the default
gate holds the product and lifecycle suites, each naming what it protects,
estimated at about 250 s fresh against 605 s; the refuter becomes a goal
review whose only holds are observed failures; Cost lines are reconciled at
closeout. Goal alignment: the mission's operator-flow outcome is the
attention the machinery consumes; the critical path is every remaining
order paying gates per phase and a close per order; the NoOp baseline is
WO-044's five fresh gates and two override episodes per order; the traps
weighed are shifting the burden to the intervenor (the loop and the
overrides), rule beating (a same-session reuse proxy certified three
orders), drift to low performance (a slower scheduling configuration kept
against its own measurement), seeking the wrong goal (refuting sentences
instead of judging alignment) and policy resistance (each guard's refusal
sending the operator to do the machine's work); success to the successful,
escalation and commons cost are addressed by removing rather than adding.
The dispatch is captured verbatim in ignored intake (SHA-256
`19061ea60115a416bc536e4eae66faffc5549dfd9a33841d886bd51dffd8350f`); the
refutation is one background goal review. The first mandatory replan
checkpoint after WO-044 stays open for the pass that follows this order,
which designs WO-049, WO-051 and WO-068 from the writing-worker record.

**R1 replan (2026-09-16):** the operator opened the pass after the
`v0.22.0` close with three parts (design WO-049, WO-051 and WO-068 at the
mandatory R1 checkpoint; review every receipt since the last pass or 72
hours; a meta view of the repository) and two mid-turn additions (fix the
hook advisory that repeated on every tool call of the session; order the
sequence in pairs for two parallel lanes under the one-at-a-time final
review and close). The pass answered R1 from WO-044's rows: a target's hooks
and settings govern a Claude print-mode worker (C-W3, C-W4, C-W5, C-W7),
Codex exec fires no hooks but loads the instruction surfaces and confines
writes under a named profile (X-W3 to X-W7, X-W2), neither sandbox confines
a sibling write (C-W6, X-W6), exact `--allowedTools` patterns admit editing
(C-W1, C-W2), a detached launch with stored authentication works (C-U1,
X-U1), requests without a terminal are auto-denied (C-U2), no harness has a
scheduler (C-U3, X-U3) and a kill leaves a recoverable worktree (C-U6,
X-U6). WO-049 keeps its hooks for Claude, carries the instruction block for
both, fails closed and claims no sandbox containment; WO-051 uses the
observed shapes with a host-written commit message; WO-068 is its own
process with a `--once` tick, executing WO-067's statechart over WO-050's
slices with WO-047's projector. The receipts of the seven orders closed
since the stand-down (WO-132, WO-067, WO-045, WO-046, WO-048, WO-050,
WO-047) were read: the stand-down's 250 s promise holds on the 27
product-only rows (191 to 413 s) and fails on the six rows where a version
literal in `harness-host.ts` or `loadouts/` selected the machinery suites
(625 to 840 s); attestation has recorded `unknown` effort since
2026-09-15T18:22Z; the session's own hook journal held 344 advisory rows
because the built runtime predated three closes and the close builds only a
missing `dist`. The pass files
[WO-133](../work-orders/WO-133-stand-down-residue.md), first, as one order
holding those four residue repairs of WO-132, rewrites the three orders as
stable contracts with real Cost lines, and orders the sequence in eleven
lane pairs with disjoint surfaces. Decisions with sources: the two-lane
workflow is recorded in product 07 §Independent workflows and integration
with its integration checklist; `scenario.ts` is extracted at the next
needed line rather than ratcheted (WO-047 D007); a kernel hygiene pair
(`appendEvent` draft validation, the stepper backstop pin) is one boy-scout
item for the next kernel order; three candidates enter product 07 (follow-up
register settlement, local lane retention, stale writer reservation
self-diagnosis); WO-047 D004's planning reconciliation is settled by this
pass's cost-table refresh. Goal alignment: the mission's outcome is the
runtime the vision names and the first external change, both blocked at R1
until these three orders exist; the NoOp baseline leaves the checkpoint
open, the flood recurring after every close and every skeleton reviewer
gate near 700 s; the traps weighed are escalation (WO-133 is a machinery
order the day after the stand-down, admitted because it adds no mechanism
and each of its four items removes a measured recurring cost), rule beating
(fixtures count rows and select suites by content), shifting the burden (the
rebuild and the integration checklist leave the operator's memory), drift
(the gate shortfall is named as planning input, not normalized), and
seeking the wrong goal (the three orders are judged by the live proofs they
enable, WO-053 and WO-099, not by their fixture counts); commons cost,
success to the successful and policy resistance are immaterial to a
document-only pass that files one small order. The dispatch and both
follow-ups are captured verbatim in ignored intake (SHA-256
`07ffad87a856637579b6a40ba7f7bf77a533ccbd5e0622784086bc33a2bab279`); the
refutation is one background goal review. The full diagnosis, decisions and
NoOp register are in [the R1 replan document](r1-replan-2026-09-16.md).

**Vision into use (2026-09-17):** the operator opened a standard pass on
the `v0.29.0` checkout with ten mid-turn additions, chiefly an
operator-endorsed third-party brief asking for the shortest credible path to
usable capability, a capability map, a corrected sequence, a small set of
experiments around local models and sandbox-off authority, a convention for
research work orders, a milestone view and the tradeoffs; plus the two-lane
integration cost, a hard subagent cap, the post-final-review planning
dispatch behind WO-135, a meta view of growth, inconsistent usage and
attestation readback, verifiers running the gate twice, and the platforms
lesson. The sweep found 62 register entries created since the R1 pass and
none read, four 2026-09-16 candidates asking for this pass, no
unsynthesized intake and no other worktree. The pass builds the capability
map from the table and the receipts (section 2), the eight-milestone
ladder (section 3), and checks every typed dependency against the sequence:
two hard-edge violations (WO-114 before WO-120, WO-115 before WO-100) and
one shared-surface pair (WO-070 with WO-120) are corrected in a recut of
fourteen pairs with the delivery lane first and an evidence-only or
machinery second lane, the console after the contracts it renders and the
starter export after the real-repository run. It rewrites WO-135 so a
capability write-back is an execution update judged by verification, final
review and the next receipt (with the topology check and a planning-branch
write refusal), rewrites WO-079 as `worktree integrate` at pair 6, and files
WO-136 (the authority enforcement-boundary matrix), WO-137 (local runner
readiness, the first guided research order), WO-138 (the local-model role
qualification pilot), WO-139 (the subagent cap as a third hard refusal, with
the batching rule) and WO-140 (the gate's sandbox preflight and the usage
cause codes). Product 07 gains the research and guided-operator convention,
a platform lens and the one normal route for a breached cold-start ceiling
(raise by one 4 KB step in the same change, named, or record the acceptance;
the two live breaches are accepted in the budgets file); products 03, 05 and
06 carry their candidates' dispositions. Goal alignment: every rung of the ladder makes an existing
claim true in a real session; the NoOp leaves the console before its
contracts, two source lanes paying a retime at every second review, and
nothing usable before pair 11; the traps weighed are seeking the wrong goal
(rungs are live demonstrations, not fixture counts), success to the
successful (the starter's investment buys no place before a real target),
rule beating (the plan gate judged plans, not rows; a row is judged three
times), escalation (five bounded orders, no new process), shifting the
burden (the checklist is executed, the cap is enforced, the gate refuses up
front) and commons (operator-assisted orders never share a pair; inference
never overlaps a gate). The dispatch and every follow-up are captured
verbatim in ignored intake (SHA-256
`e267d8e2c26e8c55bacc1e13240b9fac7ec2570ebf0cd0ecfe270ff64b203a26`); the
refutation is one background goal review. The full assessment, decisions and
NoOp register are in [the planning document](vision-into-use-2026-09-17.md).

**Reviewed before merge (2026-09-17):** a third-party review of the draft
pull request asked for a bounded set of corrections, applied inside the
same pass. Verified true and corrected: the planning document's §9 had
described the WO-129 to WO-131 suite cache and replica execution as
current although WO-132 criterion 4 deleted them (reuse exists at one grain,
the whole `npm test` row by code identity); `findGateCheck` matches that
identity by code identity alone, so WO-140 now gives a sandbox-subset run a
distinct identity that no gate consumer accepts; WO-139 is retitled an
admission cap that states per harness and spawn path when admission happens
and leaves the total-cap requirement open as a product 07 candidate; WO-110
proceeds against doubles with a `ready` or `unavailable` live row while
WO-138 activates only on a `ready` WO-137 with pre-registered floors; WO-136
budgets operator time and its packet proposes the mode, the minimal Claude
allow/deny table and the next step, decided at the checkpoint after its
close; receipt 017's accepted corrections are inside the orders. Verified
false: the pairs in the committed sequence are intact (fourteen two-entry
groups); WO-135 gains a parse fixture. The corrected orders are what the
pass's receipt judges. Section 17 of
[the planning document](vision-into-use-2026-09-17.md) records it. After
the review the operator caught the planner estimating an elapsed time the
session's own files held, and directed that no-guessing enforcement be the
next order: WO-141 is filed first, the sequence is recut into fifteen pairs
with WO-141 beside WO-136, and the refutation runs through the external
Codex transport by the operator's explicit request. Its first dispatch failed on
the CLI's git-repository check against the transport's empty `mkdtemp`
directory (boy-scout item for WO-110); its second was rejected by the
validator for a known issue without a reopening observation, which the
result schema permits and the host then deleted (two boy-scout items for
WO-135: a conditional schema, and a retained rejected result); the third is
receipt 017.

Earlier rationale is preserved in the [planning archive](archive/work-order-map-2026-09-09.md).

Earlier rationale is preserved in the [planning archive](archive/work-order-map-2026-09-09.md).

The proposed order is maintained in [sequence.md](sequence.md).

Revalidate each selection against its authority, the index, and current
preflight facts; this is a human recommendation, not a scheduler or an
activation. The list is the serial reading order of the revised 2026-09-08
horizon: the immediate gate first (WO-042; WO-043, WO-036 and the codecs in
free lanes), then the two chains interleaved as their dependencies allow (the
unattended chain through WO-067, WO-068 and WO-099; the external-change chain
through WO-044, WO-049, WO-050 to WO-053), the runtime's UI contracts, the
starter, the verification, evidence, intake and publish primitives, the loop
proof (WO-112), and the three deferred families last. The
[critical-path plan](critical-path-2026-09-08.md) holds the gate table, the
lanes, the replan checkpoints and the cut. Sixteen orders have no blocking
prerequisite today and may be selected in any free lane; the order within the
list is a recommendation. The completed 2026-09-05 horizon (WO-020, WO-030,
WO-021, WO-029, WO-009, WO-031, WO-022, WO-010, WO-011) and the closed part
of the 2026-09-06 horizon (WO-038, WO-039, WO-041, WO-032) keep their closed
evidence in the generated index; their rationale is retained below for the
record.

Earlier rationale is preserved in the [planning archive](archive/work-order-map-2026-09-09.md).

WO-014 is the last entry of the sequence (2026-10-02 pass: every open order has a position) and moves up when a pass finds approval friction recorded as the constraint.
For adjacent evidence/corpus work, **WO-107 is now the first candidate**: the
operator's declared-versus-observed cost loop needs an observed baseline
column before analysis, and the profiling order is written to be executable by
a low-cost model in a quiet window. WO-108 remains the first choice when
evidence quality is the concern (a base at or after v0.4.0 includes the
compiler in its commit-keyed mutation matrix); WO-103, WO-105, and WO-102
remain alternative uses of that track.
Each still needs its own version, close disposition, base and environment
preflight, and governed authority; writing it in the map grants none.
WO-109 remains a bounded research pilot with its source, image-harness, budget,
and yield-threshold preflight rather than a release gate.

The original series runbook's existing map link now reaches this index pointer.
Its bytes are preserved under WO-026's file-freeze rule; there is no path or
identity migration.

## Preserved unallocated candidates

- **Support behavior beyond aggregated prose — operator steering during WO-126, 2026-09-09.**
  [The observed gap and proposed checks](../product/05-pattern-library.md#intent-queue-and-communication-levels)
  distinguish equipped text from actual entry/queue behavior and deliberate
  chat intent across new sessions and compaction. WO-096–098 address
  classification, executable migration, prose retirement and measured context
  reduction; explicit behavioral coverage remains unallocated. The next pass
  should reproduce the omission, select a mechanical or bounded-judgment
  remedy, and require ablation plus reduced operator intervention/context.

- **Context Continuity support — operator ideation, 2026-09-09 during WO-126.**
  Automatically observe context occupancy from the available host signals and
  verify task recovery through repeated automatic compactions, including active
  tools and boundary-time steering. The [support candidate](../product/05-pattern-library.md#candidate--context-continuity)
  names the outcome, missing/stale-state failure cases, source/availability
  labeling and live-host evidence boundary. The [breakout receipt](../evidence/WO-126/ideation.md)
  preserves scope and the observation-first budget decision. Host binding and
  warning cadence remain open; allocation requires observable signals and a
  bounded recovery fixture. No new cap, work-order number or sequence change.
- **NoOps of the 2026-09-09 process-debt pass.** Weighed and declined, each
  with its evidence and reversal condition. (1) _Remove the compiled harness
  and return to the prose rules._ Declined: the WO-039 measurement cut the
  executor cold start from 71,165 to 10,960 bytes, and the pre-effect guards
  refused real bad commands during WO-042's review; the cost is in the
  Stop-time and read-obligation design, which WO-126 changes. Reversal: if
  the meter shows no order under budget across the three orders after
  WO-126 closes, the operator may retire the hooks wholesale. (2) _Split the
  process debt into bounded orders under the one-seam rule._ Declined by the
  operator's direction; each extra order would pay the cost model it fixes.
  Reversal: none needed; the rule stands for every other order. (3) _Leave
  tokens and cost unrecorded._ Declined on 2026-09-09 after the pass first
  filed the opposite: the playbook's sentence that no token or cost data is
  collected was a prior session's design note, never an operator decision,
  and the operator requires tokens and cost recorded per dispatch so
  context and token budgets can be set from observation; WO-126
  criteria 10 and 11 carry it. (4) _Fix the guard's
  allowlist in this pass._ Declined; a planning pass never implements. The
  fix is WO-126 criterion 8, not a nomination.
- **NoOps of the 2026-09-12 proof-carrying-gates pass.** Weighed and
  declined, each with its evidence and reversal condition. (1) _Change the
  lifecycle predicate to accept composed evidence._ Declined: it already
  does; `requireLifecycleEvidence` finds the aggregate at the exact tree and
  the runner composes that aggregate from reused suite rows (WO-126-D009,
  D014; the 41–47 s identical-tree reruns of 2026-09-12). Reopen only if an
  aggregate is ever refused for being composed. (2) _Remove the global
  preflight barrier._ Declined: WO-127-D007 restored the wait because a stale
  preparation once wasted the expensive suites, and the preflights end at
  16 s of a 475 s gate. Reverse when a recorded trace shows the barrier on
  the critical path. (3) _Doubled shadow gates, a fresh gate after every
  composed one._ Declined: it restores the cost the orders remove; WO-130
  proves declaration completeness by replica execution once per declaration
  change and by a mutation matrix. Reverse if a replica ever passes a
  declaration that a fresh gate refutes. (4) _Time-based expiry of
  evidence._ Declined: a content-addressed success does not become false
  with age; the operator's `--fresh` remains. (5) _Bazel, Nx or Turborepo._
  Declined, as the relayed plan itself advised: the difficult inputs are Git
  state, host tools and fixture repositories, and the runner carries the same
  model. Reverse at a second machine or a package graph the runner cannot
  express. (6) _Deleting or merging tests._ Declined: no test is removed by
  these orders; the mutation corpus (WO-108) is the instrument for that
  question. (7) _The cold-gate structural cuts now._ Declined: measure first;
  WO-128's per-task concurrency trace is the entry evidence, and the
  candidate is recorded in product 07 §Candidate — cold-gate structural cuts.
  Reverse when the trace names the node that bounds the gate after the
  exclusivity decision. (8) _Choosing FUP-0091 (Context Continuity), FUP-0111
  (planner startup context) or FUP-0132 (change-range output review) in this
  pass._ Declined: every remaining order pays the gate per phase, so the gate
  orders precede them, and FUP-0111 is not settled by one pass whose reads
  were dominated by its subject. Reverse at the next pass with two more
  entry measurements, or at a compaction incident. (9) _Reproducing the
  support-behavior omission of FUP-0130 here._ Declined: a planning session
  has no executor supports to observe; the deferral is carried with a
  sharper condition. Reverse at the next executor dispatch that records an
  omission. (10) _A kernel sandbox as the mechanism that keeps undeclared
  inputs invisible._ Declined after observation: `sandbox-exec` is refused
  inside a sandboxed role session, where most gates run; kept as an
  addition where the host permits it (WO-131). Reverse if the harness
  sandbox admits nested profiles. (11) _An observation preload as the sole
  basis for narrowing._ Declined: it covers Node processes only; the shell
  suites and Git children are unobservable without privileges. Reverse at a
  privileged host observer. (12) _Validation of real-tree runs by probing
  replicas._ Declined by receipts 009 and 010: no finite probe set survives
  an arbitrary guard; replaced by execution inside the replica. Reverse
  never; the counterexamples are recorded. (13) _Access-time tracking._
  Declined: it cannot capture a probe of an absent path. Reverse never for
  that reason.
- **NoOps of the 2026-09-15 machinery stand-down pass.** Weighed and
  declined, each with its evidence and reversal condition in
  [the planning document §7](machinery-stand-down-2026-09-15.md#7-declined-alternatives--the-noop-register-of-this-pass).
  (1) _Revert pull requests #54 to #62 wholesale._ Declined: it also removes
  the repairs of observed failures (egress-first close, derived-worktree
  settlement, nested-repository classification, the operator controls,
  background refuters, the gate stop, the permission-bit key, load-derived
  deadlines) and restores a 476 s whole-tree gate, not a six-minute one.
  Reverse: if WO-132 is not implementation-ready within one eight-hour
  executor session, revert the WO-129 to WO-131 line instead. (2) _Turn off
  every test._ Declined: product suites cost 94 s of task time and the
  operator's need is to know which are useful, answered by classification.
  (3) _The key repair alone (WO-044-D016's three items)._ Declined: it leaves
  every transition gating and every refusal intact. (4) _One order per fix._
  Declined: each order pays the cost model it removes; the 2026-09-12 pass
  filed four and paid four lifecycles. (5) _Opt-in replica reuse._ Declined:
  it keeps suites, probes and copies for a consumer the lifecycle no longer
  has. Reverse: a once-per-order gate over six minutes after the inventory
  split and a demand for faster executor iteration, then a per-suite memo
  established by a second-process row. (6) _Classify read-only shell for the
  writer guard._ Declined: every classification gap this week became a
  refusal; dropping the branch conjunct changes no write authority.
  (7) _A detached release worktree._ Declined: it preserves the conjunct
  that refuses status, usage, build and bootstrap on main. (8) _An
  operator-only release close._ Declined: the operator defined a step handed
  to a terminal as a defect. (9) _Process cost as a completion requirement._
  Declined: a missing counter is recorded as unknown. (10) _A hold budget
  alone._ Declined: the judgment itself changes. (11) _FUP-0091, FUP-0111 or
  FUP-0132 in this pass._ Declined: every remaining order pays the cost model
  this order removes. Reverse at the next pass.
- **NoOps of the 2026-09-16 R1 replan pass.** Weighed and declined, each
  with its evidence and reversal condition in
  [the planning document §6](r1-replan-2026-09-16.md#6-declined-alternatives--the-noop-register-of-this-pass).
  (1) _Convert WO-049 to a host-side containment order._ Declined: C-W3,
  C-W4 and C-W5 show the target's hooks and settings govern a Claude
  print-mode worker. Reverse: a live smoke where the emitted hook does not
  fire. (2) _Wait for WO-133 before WO-049 activates._ Declined: no behavior
  depends on it. (3) _Bundle the residue into WO-049._ Declined: two of the
  four items are outside its paths. (4) _Four residue orders._ Declined: four
  lifecycles for four one-file edits. Reverse: an item that outgrows its
  file. (5) _A model-composed commit message._ Declined: no wildcard pattern
  was observed. (6) _A harness scheduler as the resident's runtime._
  Declined: none exists (C-U3, X-U3). (7) _A second statechart interpreter._
  Declined: WO-067's moves. (8) _Split `harness-host.ts` now._ Declined: the
  version module removes the recurring cost without churn. (9) _Move or
  prune evidence._ Declined: immutability and the publication contract.
  (10) _Consolidate scripts or split the process-debt test._ Declined:
  machinery churn for no product outcome. (11) _Settle the 283 untriaged
  follow-ups now._ Declined: a session of planning machinery; a candidate.
  (12) _A retention rule for local lanes now._ Declined: 101 MB of ignored
  material is not a constraint. Reverse: more than twenty snapshots.
  (13) _Pair WO-068 with WO-051, or WO-133 with WO-049._ Declined: shared
  files. (14) _A cross-order gate for the one-at-a-time final review._
  Declined again; the discipline stays in handoff text.
- **NoOps of the 2026-09-16 `runtime.resident` admission pass.** Weighed and
  declined, each with its evidence and reversal condition in
  [the ledger section](../lineage/idea-ledger.md) for this pass.
  (1) _Amend the continuation gate to admit new capability ids written back by
  an executor._ Declined: `scripts/lib/plan-continuation.mjs:94` refuses them
  by design, and a new id is a planning claim. Reverse: a work order that
  chooses between FINAL-001's two nominated forms with its own evidence.
  (2) _Promote `runtime.resident` to 2 — dependable in this pass._ Declined:
  VER-001 F1 is an important failure path without an automated check, and the
  table's level-2 rule requires one. Reverse: F1's append-lock recovery window
  closed under test on the once and loop paths. (3) _Rename the WO-068 heading
  to `dated reassessment`._ Declined: the row is an addition, not a
  reassessment of an existing id, and FINAL-001 observed the rename fails
  differently (`new capability id runtime.resident`). Reverse: none; the
  receipt of this pass addresses the heading. (4) _File a refutation alone as
  a receipt refresh._ Declined: it would clear the gate by replacing the judge
  rather than by judging the claim, and the receipt is immutable. Reverse:
  none. (5) _Replan the horizon while the branch is open._ Declined: the
  sequence is unchanged, WO-068 is closed, and the operator's category is the
  capability claim. Reverse: an operator dispatch naming the horizon.
- **NoOps of the 2026-09-17 vision-into-use pass.** Weighed and declined,
  each with its evidence and reversal condition in
  [the planning document §14](vision-into-use-2026-09-17.md#14-declined-alternatives--the-noop-register-of-this-pass).
  (1) _The brief's items as orders one for one._ Declined: three sections
  are documents; five orders carry the measured costs. (2) _A single lane._
  Declined: the parallel gain is a whole lifecycle against a bounded
  integration cost; execute the checklist and pair by surface. Reverse: an
  integration after WO-079 fifteen minutes above the median. (3) _The
  narrower WO-135._ Declined: it leaves the post-final-review dispatch in
  place. (4) _Settings changes now._ Declined: no enforcement-boundary
  evidence. Reverse: WO-136's matrix. (5) _A Codex tool proxy now._
  Declined: the largest answer to an unasked question. (6) _A research
  work-order kind, field or transition._ Declined: the lifecycle and
  evidence directories suffice. (7) _Live evaluation inside `npm test`._
  Declined. (8) _Model downloads or a leaderboard._ Declined. (9) _The
  starter before a real repository._ Declined: portability is not the next
  useful experience. (10) _The console before M3._ Declined: two hard
  edges. (11) _A scheduler or solver._ Declined: a 40-line check enters
  WO-135. (12) _A harness-setting cap._ Declined: none exists for the
  total. (13) _Refusing the Workflow tool._ Declined. (14) _A mandatory
  sandbox everywhere._ Declined. (15) _Reorganization; shrinking receipts
  now._ Declined again; the receipt-size candidate has a threshold. (16)
  _A usage-only order._ Declined: one criterion in WO-140. (17) _Disposing
  decision records one by one._ Declined: the settlement candidate changes
  the collector. (18) _The Gate H order now._ Declined: its evidence and
  profile do not exist; R2 files it.
- **Critical-path candidates — recorded 2026-09-08 by the critical-path
  planning pass and allocated the same day at the operator's correction.**
  The runtime boundary codecs are WO-045 to WO-048; writing-worker harness
  truth is WO-044 (extended with the unattended-launch rows); the
  target-worktree bundle is WO-049; the source-changing worker is WO-050 to
  WO-053; blinded verification and repair over a real repository is WO-054
  to WO-056; the browser evidence adapter is WO-057 to WO-059; SourceBundle
  to StoryContract is WO-060 to WO-062; the target publish slice is WO-063
  and WO-064 with the post-PR loop as WO-065 and WO-066; the vertical is
  proven from core as WO-112, and the operator's Angular run is the fork's
  work recorded as WO-083's receipt. The
  [critical-path plan](critical-path-2026-09-08.md) is the authority for
  their order and entry criteria.
- **Authoring journey through the live client — nominated 2026-09-08 by the
  critical-path pass's third refutation receipt.** Receipt 004's largest
  remaining gap: no order requires a person to choose a familiar pattern,
  alter its mechanics through the live client (WO-117), inspect the
  normalized program and its fidelity, and demonstrate the intended
  behavioral change; WO-091 to WO-095 prove compilation and rendering, and
  WO-083 leaves the shell slice to its fork. A later pass adds that proof to
  WO-117 criterion 2 or files a bounded order after WO-095 and WO-117 land;
  until then the compiler results are not reported as proof of the authoring
  experience. No number, sequence position or activation authority.
- **Harness host: the permission classifier matches commands, not substrings
  — nominated 2026-09-08 by the critical-path planning pass; allocated
  2026-09-09 to WO-126 criterion 8.** The compiled
  permission hook refused this pass's own shell commands when their text
  contained a remote-effect token or an environment-file token inside a
  heredoc or a search pattern, including read-only searches; a bounded
  follow-on classifies the command's own invocation rather than its text, so
  `script` actors (WO-068) can carry arbitrary text in arguments. No number,
  sequence position or activation authority.
- **Harness host: fail closed on unclassified effectful tools — nominated
  2026-09-08 by the critical-path planning pass; allocated 2026-09-09 to
  WO-126 criterion 8 after the process-debt pass itself used the hole to
  create its planning branch.** The compiled writer guard
  gates only the Bash, Edit and Write tools, and the permission classifier
  treats every other tool as a read, so a harness tool that runs shell
  commands or writes files without one of those names (a monitoring tool, a
  notebook editor, a spawned agent's tools) bypasses the reservation and the
  envelope check; the pass observed a read-only listing subagent obtain
  shell output that way. A bounded follow-on makes the harness profile
  enumerate the tools the harness exposes with their effect class and makes
  the host refuse an unclassified effectful tool; the phase-zero record gains
  the rows. This nomination has no work-order number, sequence position,
  release, or activation authority; the plan recommends closing it before a
  bundle is emitted into a target worktree.
- **Concept registry through actual app use — operator-nominated 2026-09-07
  during WO-109.** The [planning proposal](../lineage/remining/runs/draw-001/idea-pipeline-proposal.md)
  connects inexpensive capture, stable concept records, relevant retrieval,
  explicit promotion gaps, implementation evidence and actual consumer use.
  Its recommended delivery model is a continuing queue cut into named batches,
  such as ten authorable patterns per ordinary work order, with per-item app
  acceptance and remaining ideas retained for later batches. The next planning
  session should decide the minimal registry/projection, first retrieval and
  app-use witness, and bounded order allocation. The proposal links the detailed
  book research and the existing temporal-authoring candidate; it grants no
  activation, selected schema, number family or implementation authority.
- **Artifact growth and maintenance:** if a reading or upkeep problem is
  demonstrated, a bounded assessment can apply the [corpus policy](../product/03-architecture.md#corpus-policy)
  to documentation, logs, and derived views. Consider clearer organization,
  explicit archives, or consolidation while preserving links and required
  immutable history. A healthy structure needs no change. No file quota,
  mandatory cleanup, selected layout, order number, or activation is assigned. Reopened 2026-09-22: the REVIEW-002 pass measured the upkeep problem (82 self-host evidence logs, 104.8 MB of 184.8 MB tracked, growing about 80 MB a week by copied source bodies); the bounded assessment is the evidence-editions order designed in the REVIEW-002 section dated 2026-09-22 below, deferred until the sequence has room.
- **Sibling workflow pilot — filed 2026-09-06, redirected the same day, cut
  into bounded children 2026-09-08 (WO-069 to WO-083).**
  The first pass filed the launchpad export and target-repository mechanics
  as WO-033 and the synthetic-plus-real pilot as WO-034; the redirect made
  the export carry the compiled Contributor build (through WO-039) and made
  the Angular repository's first change a UIFA v1 shell over the actor
  board's view model; the route is recorded in the
  [phase-two plan](phase-two-plan-2026-09-06.md#the-enterprise-workflow-decision-redirected).
  The example may still witness implicit documentation lookup with Context7;
  the product must remain usable without that adapter or a paid account.
  Authentication, packaging beyond the process kit, and per-repository
  release policy remain open; licensing was decided on 2026-09-06 and lands
  through WO-038.
- **Rule migration, batches two onward — named 2026-09-06 by the
  redirect's refutation receipts.** WO-040, now the umbrella of WO-096,
  WO-097 and WO-098, compiles batch one and leaves
  roughly 120 shapes classified but not compiled. One batch per wave from
  wave 4, each cut from WO-040's template, each with its candidates named in
  the migration ledger before it is filed, each measured by the same
  directional method; the migration ledger's counts are the progress
  record. No number until each is filed; the template is the authority.
- **Pattern workshop v1, remaining shelf entries — named 2026-09-06 by the
  redirect's refutation receipts.** After WO-091 to WO-095 (WO-037's
  children) compile the 5S set, the
  Marquet ladder as a typed protocol, the mitigated-speech voice selector,
  Theory of Constraints, the commedia masks as a party topology, and the
  Algorithms-to-Live-By policies each become one compiler-side order in the
  shape of WO-037, in an order the pattern library's founding sequence and
  the console's evidence decide; no number until filed.
- **Intent declaration and the stranger test — named 2026-09-06 by the
  redirect's final refutation receipt.** The smallest useful loop's first
  step, declare a bounded intent in prose and receive a fire-and-forget
  receipt, still enters this repository as a hand-written work order through
  a planning pass, and the `v1.0.0` criterion (a person who has never read
  these docs declares one bounded intent and receives a verifiable result)
  has no order. After the parity contract exists, one order makes intent
  declaration a command over it, from prose to a compiled work order with
  its receipt, exercised by a non-author; the workstream application
  journeys in product 12 are its scenarios. No number until filed.
- **Console parity contract and drag-equip authoring — wave-5 candidate,
  named 2026-09-06 by the redirect's refutation receipt. Allocated
  2026-09-08 for its contract half as WO-115; the drag-equip surface stays a
  fork-side order over that contract.** The differentiated
  interface's authoring half (the analogies are the ways you mix and match
  the agents; drag a pattern card onto an actor and see the exact compiled
  diff) has no order after this horizon: the actor board is read-only, the
  5S set is authored as data, and every build is written by the author.
  The next planning pass files, once WO-032 and WO-037 have merged and
  WO-034's shell exists: first the parity contract that names which
  commands a console may invoke (equip preview, compiled diff, saved-build
  selection) as the same commands the terminal runs, in core; then the
  drag-equip surface over that contract as a `WS-001` member order in the
  example consumer, and the pattern-card, statechart, function-table, and
  temporal views as further equivalent views under 04's round-trip laws.
  Precondition, not a number: the redirect's receipts are the input.
- **JSON forms for the index, the constellation, and `release list`:**
  nominated by WO-032, which parses their pinned text so that wave 1's write
  surfaces stay disjoint. A bounded follow-on adds `--json` to each once a
  second consumer exists or the text parsers break. No number, sequence
  position, or activation authority.

- The concurrent-workflow control slice shipped in WO-030 (`v0.7.0`); the
  first measured paired wave is phase two's lane 0 (WO-038 ∥ WO-041), and the
  rebase helper the plan named is filed as WO-033's `worktree sync`. The
  lane-plan projection, declared per-order workflows, admission policy,
  contribution tracks, and tenant-scoped tracks remain unfiled with the
  filing conditions in the
  [concurrent work-orders plan](concurrent-work-orders-plan.md#later-slices-unfiled).

- Correct the compiled Entropy Reducer's Shape-First wording and regenerate its
  residue under a bounded follow-on. The current manual usage guide records the
  operator's relationship-first interpretation; this observation allocates no
  order or priority.
- Choose a bounded consumer, privacy profile, cadence, cost ceiling, and useful
  comparison before implementing the [system baseline](work-order-map.md#candidate--bounded-system-baseline)
  or [success-under-growth review](../product/05-pattern-library.md#candidate--success-under-growth).
- Develop a synthetic pilot for the [end-user workstream application](../product/12-workstream-application.md),
  with parity and reduced coordination burden as the outcome. Host topology,
  first integration, application identity, and work-order allocation remain open.

- **Unallocated follow-on candidate — audit causal-association hardening:**
  in a bounded follow-on, teach the WO-007 fold to prefer valid canonical cause and
  correlation links while retaining an explicitly labeled, strict
  scope-and-time adjacency fallback only for historical logs without usable
  links. Adversarial fixtures should cover adjacent decoys, cross-scope links,
  missing links, invalid links, and the sibling decision/refusal consequences of
  one attempted action. This nomination has no work-order number, sequence
  position, release, or activation authority.
- **Unallocated workflow candidate — Additional Opinion cohorts:** after
  WO-009 provides real bounded episodes and WO-010 proves blinded independent
  verification, pilot two verification results over one frozen candidate and a
  sealed adjudication that can route only to fix or final review. Preserve raw
  results, duplicate provenance, minority findings, actor/model/effort
  attestations, and finite cost/concurrency bounds; one blocking finding cannot
  be outvoted. Defer mutating implementation alternatives until the evidence
  model works; each candidate then needs its own writer/worktree and any
  synthesized artifact needs fresh verification. This candidate has no work-
  order number, version, sequence position, or activation authority and does
  not change resume control v1.
- **Product candidate — profiles, PresencePolicy, and unattended
  portfolios: allocated 2026-09-08 for the PresencePolicy as WO-067 and the
  preauthorized portfolio as WO-100; the owner-sovereign profile stays
  unallocated.** separate the reusable platform mechanisms from saved instance
  doctrine; define capability declarations for intentionally absent evidence,
  history, and replay; and compile a four-axis PresencePolicy over attention,
  work scope, effect authority, and observed external capability. Representative
  fixtures include hold, decay, progressive authority, peak/reset/loop, return
  races, unavailable adapters, and an explicitly preauthorized optional
  WorkOrder portfolio. The candidate includes no wildcard authority, provider
  bypass, implementation name, version, sequence position, or activation grant.
- **Unallocated interface candidate — private exclusion-list management:**
  expose Clean Room → Excluded terms in the build inspector, with the active
  local list, its entries, add/remove actions and a No terms configured state.
  Lists grow incrementally; there is no exhaustive up-front inventory. Keep
  entries and their hashes out of public artifacts. The
  [interface item](../product/04-interfaces.md#candidate--private-exclusion-list-management)
  and [WO-039 receipt](../evidence/WO-039/ideation.md) preserve the operator's
  request. UI host, layout, storage reconciliation and allocation remain open;
  the current horizon and work-order sequence are unchanged.
- **Unallocated evidence candidate — feedback projection for every workspace:**
  the feedback source projection strips release-only version and license
  labels from the lockfile root and the three workspace entries it names, so
  a later workspace stays raw in the feedback subject and over-invalidates the
  live edition whenever an order integrates it. Generalize the projection over
  every workspace lockfile entry, keep the fixtures that prove external
  dependency and resolution changes still invalidate, and record a fresh live
  edition with the change. Named by [FINAL-001](../final-reviews/WO-039/FINAL-001.md)
  finding F1 and the [fifth repair receipt](../evidence/WO-039/repair-005.md);
  it grants no activation, sequence position or implementation authority.
- **Unallocated evidence candidate — historical editions on the actor board:**
  the reactor refuses a persisted verification capsule that no longer
  recompiles under the current compiler, so an actor board over an earlier
  self-hosted edition renders that edition's verifier and maturity as
  unavailable after every compiler package bump, and the board's edition is a
  constant beside the root evidence script's `--edition` flag. Decide whether
  a read-only historical projection may replay an earlier compiler's capsule
  under an explicit label, and select the current edition from one declared
  source. Named by the [fifth repair receipt](../evidence/WO-039/repair-005.md);
  it grants no activation, sequence position or implementation authority.
- **Evidence candidate — console host-collection budget under gate load:
  allocated 2026-09-12 to WO-128 criterion 2, after six fresh full gates of
  2026-09-11/12 failed on its 60 s bound under load (VER-001 O6, VER-003 O3,
  VER-004 AC5 and FINAL-001 item 3 of WO-125).** The nomination text stays as
  history: the actor board's host collection runs each fixed read-only
  command under one sixty-second budget, and under full-gate load the release
  listing exceeded it in four full runs, one of them outside the sandbox,
  while passing alone. By the operator's decision the fifth repair runs the
  console suite after the other three package suites in the root gate; the
  budget itself is unchanged.
  Decide whether the budget scales with the host or whether the release
  listing is shared across the gate, and keep the read-only guarantee. Named
  by the [fifth repair receipt](../evidence/WO-039/repair-005.md); it grants
  no activation, sequence position or implementation authority.
- **Unallocated evidence candidate — a multi-attempt verifier fixture for the
  actor board:** WO-032's `AC2` asserts that every recorded verifier attempt
  other than the accepted one shows `lease-expired` and takes no acceptance-
  matrix link, but the `selfhost` case re-pinned by the fifth repair records
  exactly one attempt and it is the accepted one, so that assertion now
  iterates over no rows and the string appears in no committed fixture output.
  Restore the invariant with a fixture-local synthetic store carrying two or
  more verifier attempts, in the manner of the hand-authored WO-009 event log;
  it needs no live evidence and changes no behaviour. Named by
  [FINAL-002](../final-reviews/WO-039/FINAL-002.md); it grants no activation,
  sequence position or implementation authority.
- **Unallocated control candidate — canonical private intake reconciliation:**
  replace worktree-relative raw-note drift with one private-store resolver and
  capture/status/reconcile operations. Require locking, contained regular
  files, atomic no-overwrite copy, same-content deduplication, divergent-
  collision refusal, verified owner-only backup, source removal only after a
  recoverable canonical copy, and a private capture-to-synthesis manifest.
  Storage reconciliation remains distinct from semantic ideation synthesis.
- **Unallocated evidence candidate — source-bound feedback refresh:** WO-038's
  [receipt](../evidence/WO-038/README.md#feedback-evidence-refresh) records a
  manifest-only change requiring the existing regenerate → bounded live audit
  → validated recording sequence. Add one resumable helper that diagnoses the
  changed declared inputs, reuses those existing commands, preserves prior
  editions, and carries explicit transport/model/effort and budget authority.
  Fixtures must cover unchanged-source reuse, interrupted audit recovery, and
  refusal to record stale or incomplete results. Include the host's full
  return-format contract in the verifier input and retain bounded rejection
  diagnostics: WO-038 observed an envelope refusal and found a summary bound
  enforced by the parser but omitted from the verifier prompt and schema.
  No weaker source pin, hidden model spend, new runtime capability, or WO-038
  scope expansion is nominated.
- **Governance candidate — licensing and distribution posture: allocated
  2026-09-06.** The operator decided the posture (`docs/LEGAL.md` §Decision:
  Apache-2.0 code, CC BY 4.0 documentation, DCO inbound, names reserved) and
  the license files landed with the planning pass; the executable half
  (workspace `license` and `private` metadata with `@dotln/kernel` the
  measured gap, a tested publication refusal, `CONTRIBUTING.md`) is WO-038.
  Third-party notices at the first bundled artifact, privacy and service
  review, and the brand check stay as gates in the legal record.
- **Allocated composition candidate — claim-layer authority floor and
  envelope-projected inspection:** compiler v1 lets any linked support claim
  the `safety-invariants` layer, so an author-supplied graph can grant itself
  an effect its own read-only support denies, and the tooltip's RESTRICTIONS
  are authored strings that do not notice (WO-008 VER-001 F2, reproduced in
  FINAL-001). A bounded follow-on before saved or community builds should
  decide which layers a support may claim and project RESTRICTIONS from the
  compiled envelope. **Allocated 2026-09-08 as
  [WO-042](../work-orders/WO-042-authority-provenance.md)** by the
  critical-path planning pass, after the harness lowering made the compiled
  envelope a live permission input; the nomination text stays as history.
- **Contributor equipment follow-on — document producers and modifiers:** the
  [WO-042 breakout](../evidence/WO-042/ideation.md) implements five atomic
  executor supports and their independent switches, a local intent queue,
  the execution-safe planning comparison and a bounded console edition fix.
  The [product model](../product/05-pattern-library.md#built-in-modifier-switches)
  retains arbitrary typed support modifiers, optional document-producer
  migration and a visual pre-run panel as future work. Orchestration preference,
  no-fan-out, concurrency/queue capacity and quality-variant policy need explicit
  host bindings and refusal evidence before enforcement is claimed. These are
  unallocated follow-ons, not extra work hidden in this order's completion gate.
- **Nominated boy-scout item for the next activation — explicit Node types:**
  add `"types": ["node"]` to the `compilerOptions` of the three package
  `tsconfig.json` files. TypeScript 7.0.2 (current `latest`) reports
  `Cannot find name 'node:test'` and the downstream `CompileResult` narrowing
  errors the operator saw in an editor because `@types/node` is no longer
  included implicitly; with `--types node` all three packages are clean, and
  the pinned 5.4.5 accepts the field. Unambiguous, low risk, covered by the
  activated order's `npm test`; record it in that order's result.
- **Unallocated measurement candidate — presentation-surface comparison:**
  once WO-009 lands two transports, a WO-107-style profiling cell compares the
  same order through a terminal harness, a raw API episode, and, where
  observable, an IDE or desktop surface, on protected outcomes, elapsed time,
  and accounting regime. Product 03's candidate names the axes; no surface is
  preferred in advance.
- **Unallocated data candidate — UIFA roles as data:** the five human roles
  are prose in product 13 until a consumer needs one as an event field; the
  first plausible consumer is tester-authored scenarios in WO-011.

## Candidates — release-close and planning-dispatch defects (recorded 2026-09-16)

Nominated for the next planning pass from the v0.23.0 release-close attempt and
the `runtime.resident` admission pass. Each names the observation that proves
it and what a fix must do. None is allocated; this section grants no activation
authority.

**Machine defects.**

1. _An order may mandate a capability id its own gate refuses._ WO-068
   criterion 7 directed an executor to add a `runtime.resident` row;
   `scripts/lib/plan-continuation.mjs:94` refuses ids absent from the judged
   receipt, because a capability id is a planning claim. The order required an
   edit the repository rejects by design, and no executor repair could clear
   it: deleting the row fails the criterion, keeping it fails the gate.
   FINAL-001 recorded this as B1 and nominated two forms — admit new ids
   through the planning pass that files the order, or teach `reassessments` a
   dated-addition form for ids the filing order introduces. Neither is chosen.
   A fix must make the unsatisfiable order unfilable, or make the gate accept
   it. Reopens at the next order whose criteria name an unjudged id.
   **Disposition (2026-09-17, WO-135):** the reopening condition fired one day
   later on WO-052's `worker.source-change`, which cost a second final-review
   diagnosis and a second purpose-built single-claim pass. Filed as
   [WO-135](../work-orders/WO-135-capability-id-admission.md), taking the
   second nominated form: a dated addition may introduce an id that a judged
   order's own criteria already name, because the pass that judged the order
   judged that sentence; every other new id stays refused. Reopen if a fix
   admits an id no judged order names.
   **Disposition (2026-09-17, vision-into-use pass):** the narrower form is
   withdrawn; WO-135 is rewritten so any appended dated capability section
   for an order in the judged sequence is an execution update, new ids
   included, judged by verification, final review and the next receipt, and
   the order also carries the sequence topology check and a planning-branch
   write refusal. Reopen: a capability row on `main` that no verification or
   final review judged.
   **Execution disposition (2026-09-17, WO-135):** implemented the broader
   dated-section admission, with historical WO-068/WO-052 replay fixtures and
   current-sequence topology checking. Independent verification and final review
   remain separate; evidence is in [WO-135](../evidence/WO-135/README.md).
2. _The plan gate was unsatisfiable on any day carrying two passes._
   `checkPlanGate` demanded a receipt for the later dated heading while
   `latestPlanningPass` returned the earlier one: both sorted headings by date
   alone, and `Array.prototype.sort` is stable. Patched in `8a5eb79` by
   breaking the tie on ledger order. **The patch carries no regression test**,
   so the defect can return; the test is the nomination. Latent since the
   mechanism shipped, surfaced by the first day with two passes.
   **Disposition (2026-09-16, WO-134):** implemented a shared receipt-based
   same-day selector and regression covering both ledger orders and both
   refutation paths. The sole unjudged pass wins; otherwise the latest planning
   receipt wins. Several unjudged same-day headings are reported as ambiguous.
   [Independent verification passed](../verifications/WO-134/VER-001.md). Reopen on a demonstrated mismatch
   between dispatch and the gate; see [WO-134-D001](../evidence/WO-134/decisions.md).
3. _A final review's stated merge prerequisite is unenforced._ FINAL-001 said
   in bold that B1 had to clear before the branch merged; it merged at
   `3b7a315` with B1 unmet, and main inherited a red `test:docs`. A fix must
   either enforce the prerequisite at the merge transition or stop recording
   prerequisites that nothing checks.
   **Disposition (2026-09-17):** the only prerequisite of this kind was the
   capability admission, which the rewritten WO-135 removes; product 07's
   integration amendment says a review records a merge blocker only with
   the command and line that enforces it. Reopen: a bold prerequisite in a
   final review that nothing checks.

**Dispatch and reporting defects.** These concern agent behaviour under the
role text rather than repository machinery, and belong in the process-debt
track.

4. _A decision dialog stated a review sentence as a machine precondition._ The
   release-close dialog asserted v0.23.0 "cannot be tagged until" a planning
   dispatch admitted `runtime.resident`. `scripts/release.mjs` never calls the
   planning gate, and the dry run passed every real prerequisite. The operator
   answered a question with a false premise, and that answer is the sole reason
   the tag was not created. A fix must require any option presented as a
   blocker to name the command and line that enforces it, or be labelled a
   documented condition rather than a gate.
5. _A remedy was recommended without being read._ `planning: refute` was
   proposed as the way to clear B1 and retracted three minutes later on
   reading that it files an immutable judgment. Acting on it would have put a
   judgment procured to unstick a release into the permanent record.
6. _An operator dispatch prefix was read as conversation._ A message prefixed
   `planning:` is a dispatch under this guide's §Operator-opened planning pass
   regardless of its subject. Four turns of diagnosis ran before the pass
   opened. A fix must treat the prefix as the dispatch and carry any
   disagreement inside the pass.
7. _A conclusion was asserted from a partial search._ "No planning gate exists"
   was claimed after searching `scripts/resume.mjs` and `scripts/release.mjs`
   and missing `scripts/lib/plan-continuation.mjs`, and the operator's correct
   `resume: release close` routing was then attributed to operator error. A
   fix must bind such a claim to its stated search boundary.
8. _Scope choices were reported as repository refusals._ Declining to patch
   machinery inside a document-only dispatch was a judgment call presented as
   though the process had refused, which removed a decision belonging to the
   operator.

9. _The ledger's declared order is unenforced, so the operator is the check._
   The header states in bold that a new section appends directly below it,
   never at the end of the file; this pass appended at the end and the operator
   caught it. `WO-084:53` already records that "nothing checks the order", and
   the file has drifted accordingly — dated sections currently run ascending
   below the first entry, contradicting the declared newest-first rule. The
   drift also propagates: the same-day tie-break in `latestPlanningPass` reads
   ledger position, so a wrong order silently selects the wrong pass. A fix
   must make the insertion rule checkable in `test:docs` rather than
   documented, which is WO-084's subject. Until then every ledger write spends
   an operator correction. Recorded against the
   shifting-the-burden-to-the-intervenor trap: nine operator corrections in
   this session, all catching agent error rather than directing work. The
   count was first recorded as five and was itself understated.
   **Disposition (2026-09-16, WO-134):** the propagation into pass selection is
   removed by the shared receipt-based rule and section-swap regression;
   [independent verification passed](../verifications/WO-134/VER-001.md). Enforcing or reorganizing ledger
   insertion remains with WO-084, under its existing deferral. Reopen the
   selection portion only on a position-sensitive result; the insertion-rule
   nomination remains open on the evidence above.

10. _A source change rode a document-only dispatch onto main and voided the
    reviewed gate._ A planning dispatch is document-only and carries no
    implementation authority, but this pass committed `scripts/lib/plan-direct.mjs`
    and `scripts/refute-plan.mjs` to its branch. `gateCodeIdentity` excludes
    `docs/`, `.claude/`, root `*.md` and generated files, so those two patches
    were the only part of the merge it could see, and they moved WO-068's
    identity from the reviewed `c2caf3bc` to `464f4928`.
    `reviewedProductGate` (`scripts/lib/release-records.mjs:216`) then refused
    the tag, correctly: it will not publish source no reviewer gate covers.
    The release was publishable at `3b7a315` and is not publishable at
    `fbfcde0`. The prior session's own note — that the gate row is keyed to
    code identity and survives only because a planning receipt is a doc commit
    — was on the record and was not applied when the PR was handed over. A fix
    must refuse a non-document path in a planning dispatch at write time, not
    at release time.
    **Disposition (2026-09-17):** WO-135 criterion 4, the planning-branch
    write refusal in the generated hook. Reopen: a non-document path on a
    planning branch after it lands.
    **Execution disposition (2026-09-17, WO-135):** the generated Claude
    pre-tool boundary now refuses classified non-document repository writes on
    `planning/` branches, including physical-path aliases; external scratch and
    the existing override remain usable. Codex receives the same role duty.
    Opaque shell effects remain host-delegated; this is not an OS sandbox.
11. _A stale evidence row was answered by rewinding the code._ On hitting the
    identity refusal, the first response was to restore both files to their
    reviewed bytes so the hash would match again. That makes the gate pass
    without the thing the gate exists to establish — that the shipped source
    was reviewed — and it deletes a working fix to do so. It is the
    rule-beating trap in its plainest form, and the operator caught it. The
    correct response to "source changed after the product gate" is to
    regenerate the gate at the current identity. A fix must make re-gating
    reachable: `final-review-result` is guarded by
    `requirePhase(state, "final-review")` and `closed` offers only
    release-close, next and activate (`scripts/resume.mjs:152`), so today the
    only route is an operator override. Recorded against rule-beating and
    seeking-the-wrong-goal.
    **Disposition (2026-09-17):** declined as an order; the stop rule in the
    critical path and the shared no-guessing instruction carry the duty, and
    re-gating at the current identity remains the operator-override route
    until an order needs it. Reopen: a second rewind attempt.

12. _Work was handed off for merge without running the checks that judge it._
    Push and PR commands were supplied twice — for the planning branch and
    for this one — on the strength of a narrow check rather than the suite.
    The second handoff would have merged a stale
    `docs/work-orders/README.md`: `plan -- check` passed and was cited as
    proof the order was in-band, while `npm run test:docs` failed `index`
    with "stale at line 111". Regenerating it cleared all seventeen suites,
    so the cost here was small and the pattern is not. The role text already
    requires this — `verify-app-before-done`: executed passing checks for
    every required application check at the current subject before the
    completion transition — and it is the third instance of the partial-check
    pattern in item 7. A fix must bind a handoff that names a merge command
    to the suite that judges the merge.

13. _This register is self-authored and therefore incomplete._ Items 1 to 3
    were found by the agent; every later item exists because the operator
    caught something, including item 9's own undercount. A register written
    by the process that produced the defects inherits that process's blind
    spots, so it should be read as a floor on what went wrong, never a
    ceiling. A fix must derive the operator-correction count from the
    transcript rather than from agent self-report, which is the only part of
    this that can be measured without the agent's cooperation.

14. _A recovery proposal offered a direct commit to `main` and the removal of
    a working fix._ Asked why the release loop would not end, the fourth
    session recommended returning the two planning helpers to their reviewed
    bytes by committing straight to `main`, and argued against item 11 on
    the ground that reviewed bytes are what the gate establishes. Both halves
    were wrong for this repository. No commit has reached `main` except
    through a pull request, and the proposal named none. And the by-the-book
    route was reachable and unread: `readWorkOrderAuthority`
    (`scripts/release.mjs:316`) takes the release version from the order
    heading, WO-134 already names v0.23.0, and its final review records a
    fresh reviewer gate at the current identity, so its release close
    publishes the tag with the fix on `main` throughout. The session had
    read the refusal at `scripts/lib/release-records.mjs:216` and stopped
    there. The operator caught it. Recorded against rule-beating, as the
    second appearance of item 11's move, now argued for rather than
    attempted, and against shifting-the-burden-to-the-intervenor. A fix must
    require any recovery proposal to name the repository's existing landing
    path for the change and the command and line that makes a shortcut
    necessary, or withdraw the shortcut.

15. _The `planning:` prefix was read as conversation a second time._ Item 6
    records the first instance. The fourth session opened with a `planning:`
    dispatch, the hook resolved the planner role, and the session announced
    that it had chosen not to open a pass because the message read as a
    question. That was the same unilateral choice item 6 already names, made
    against a register entry on the same branch. The operator caught it. A
    fix for item 6 must survive the agent having read item 6.

**Disposition of items 4 to 8 and 12 to 15 (2026-09-17):** declined as
orders. Each is a role-text duty the shared instruction already carries
(checked evidence before a claim, the prefix is the dispatch, name the
enforcing command and line, run the suite that judges the merge, name the
landing path); the register is read as a floor on what went wrong. Reopen:
a recurrence of any item after this pass.

Cost observation: about ninety minutes across the first three sessions, plus a
fourth session of unmeasured length, on a release that was publishable
throughout.

## Candidates — returns from the cleanup pass (recorded 2026-09-19)

Observed open by the 2026-09-19 surveys and left out of WO-142 because each
needs its own order, a product or operator decision, a live observation, or a
replay-sensitive change. Each names its source and the observation that
reopens it. None is allocated; this section grants no activation authority.

1. **Append-lock recovery wedge after a kill.** A SIGKILL inside the
   append-lock recovery window wedges the worker store, and the guard has no
   owner and sits on the per-transaction path
   (`packages/skeleton/src/worker-store.ts:150-157`,
   `packages/skeleton/src/resident-host.ts:199-207`; WO-068 FINAL-001 F1 and
   O2). Closing it under test is the map's condition for `runtime.resident`
   level 2, so this is the one return on the critical path and needs its own
   order. Allocated the same day by the second pass, at the operator's
   direction that a pass plans what it finds:
   [WO-143](../work-orders/WO-143-resident-lock-recovery.md). Reopen: WO-143
   closing without a kill-inside-the-window fixture on both paths.
2. **Harness runtime pin list derived from the import closure.** The list in
   `scripts/lib/harness.mjs:87-130` is kept by hand; the closure reached 57
   modules against 38 pins at review (WO-139 FINAL-002 item 1). Reopen: a
   snapshot that fails to load a reachable module, or the next order that
   changes the bundle's shape.
3. **Three recorded items in `reactor.ts`.** The unreachable continuation
   guard (`:519-525`), the append-only `repairPlans` (`:1770`, `:2290`) and
   the one `any` (`:2674`); an edit re-keys reactor and feedback evidence.
   Reopen: the next order that opens the file takes all three.
4. **Gate code identity ignores untracked sources.** Verifiers bind new
   files by timestamp (`packages/skeleton/src/gate-evidence.mjs:564-566`;
   WO-054 FINAL-001 item 4). Reopen: a gate row whose identity missed a new
   source file.
5. **Process meter attribution.** A worker audit episode counts as
   `verifier`, and Codex windows start at harness entry while Claude windows
   start at the first message (WO-043 FINAL-001 obs 1 and 2). Reopen: the
   next order that reads the meter's per-role rows as evidence.
6. **A forward-only home-path screen for new reports.** Nineteen committed
   reports carry an absolute home path; immutable records stay as written.
   An operator decision (WO-126 FINAL-001). Reopen: the operator's answer.
7. **A second sign-off-exempt author identity.** GitHub "Update branch"
   commits are refused at publish (`scripts/lib/contributions.mjs:5`;
   WO-038 FINAL-001 adjudication 2). An operator decision. Reopen: the
   operator's answer, or the next refused publish.
8. **Harness profile re-probe.** The manifest's profile ids name Claude Code
   2.1.263 and Codex CLI 0.153.4; sessions run 2.1.277 and 0.155.0, and all
   seven Codex residue items rest on a 2026-09-07 probe. Needs a live
   re-probe. The 2026-10-02 reassessment records that the former trigger,
   the next live harness smoke, occurred in WO-149 and WO-159. Those
   records prove dispatch/usage and isolated user settings, respectively;
   neither re-qualifies all profile capabilities. A broad re-probe is
   declined for now: no changed hook behavior is observed in those records,
   and the existing residue stays explicit. Reopen on an observed
   capability/role-text mismatch on a newer CLI, a change to the harness
   integration contract, or an operator-directed requalification; review
   again at the next entropy pass. Evidence and NoOp:
   [REVIEW-005 planning record](entropy-review-005-2026-10-02.md).
9. **Unmeasured growth costs.** Index generation reads control state at
   every release tag (`scripts/work-orders.mjs:174`; 61 tags), the console
   collector spawns one status call per order
   (`packages/console/src/collect.ts:101-124`), and status latency per typed
   order was 1.3 s at 32 tags. None is measured now. Reopen: a measured
   `work-orders index` or console collection above ten seconds.
10. **Semantic-hash, replay and worker-input items.** The Seiri scenario's
    `requiredEvidence` is empty, so `authorize()`'s evidence argument is dead
    (`packages/compiler/src/seiri.ts:330`); the reactor routes beacon
    commands by two discriminators (`reactor.ts:1447` against `:1479`); a
    writer requested at `ultra` still gets `--disable multi_agent`
    (`packages/skeleton/src/worker-transport.ts:425-429`); the demo worker
    prompt carries an absolute store path (`worker-demo.ts:267`). Each
    changes a hash, a replay or a worker's input. Reopen: a planning pass
    that accepts the re-keying, or WO-056's live record.
11. **Mutation evidence hardening.** Eleven survivors, one undetermined
    mutant at 120 s, and the read-only `--check` outside `npm test`
    (WO-108 FINAL-001 findings 3, 5 and 8). Adding the check to the gate is a
    recurring step. Reopen: the next order that extends the mutation corpus.
12. **The one-time WO-043 dependency-migration path.** Still wired
    (`scripts/lib/plan-dependency-migration.mjs`;
    `scripts/lib/plan-continuation.mjs:386-397`) and unreachable for open
    orders by inference only. Reopen: a planning pass confirms no receipt
    subject depends on it.
13. **Subagent counter decisions.** No refund after a denied or failed
    launch while the label reads `exact-observed`; an abandoned lock leaves
    the fail-open advisory for the session; an amendment binding has no
    same-day correction route (WO-139 FINAL-002 items 7 and 8). Product
    decisions. Reopen: a session whose count was wrong for one of these
    reasons.
14. **`work-candidates-v1` drops the stdout digest pin** on any absolute
    command (`packages/skeleton/src/actor-contract.ts:148-150`; WO-119
    FINAL-001 O2). A design decision. Reopen: the first discovery producer
    outside this repository.
15. **Evidence-edition retention and the Codex session-identity join.**
    WO-054 FINAL-001 planning items 1 and 7; never-current editions have no
    retention rule. Reopen: the next order that records a second edition it
    never makes current.
16. **GitHub Release backfill for v0.2.0 to v0.3.1.**
    `docs/releases/README.md:104-110` asks for a run or a recorded decision
    not to backfill (WO-025 FINAL-001 finding 5); remote state was not
    checked. An operator decision. Reopen: the operator's answer.
17. **A transitive reactor purity check.** The purity test is a named-module
    allowlist (`packages/skeleton/test/scenario.test.ts:150-195`; WO-021
    FINAL-001 adjudication 1); whether a transitive check passes today is
    unknown. Reopen: the next order that adds a module the reactor imports.
18. **Observations no survey could check.** A writer retry under a re-issued
    authority may miss its stored result (WO-051 VER-001 O2);
    `preflightVerificationRecovery`'s unconditional branch may be untested
    (WO-048 FINAL-001 obs 5); four verifications after WO-133 record effort
    `unknown` and whether the operator supplied it is unrecorded;
    `packages/skeleton/src/beacon-verifier.ts` is imported by one test only;
    WO-119's provisional intake capture may be unreconciled. Reopen: an
    order that touches the named file, or the operator's confirmation for
    the intake item.

## Candidates — returns from the Copilot CLI pass (recorded 2026-09-20)

Met while planning WO-146 and left out of it. It names its source and the
observation that reopens it. It is not allocated; this section grants no
activation authority.

1. **A pasted dispatch does not resolve a role.** In Claude Code the
   prompt-submit hook resolves a role only when the trimmed prompt equals a
   known intent or starts with `planning:` or `ideation:`
   (`packages/skeleton/src/harness-host.ts`, the session branch of
   `evaluateExistingHarnessHook`). A dispatch that arrives as pasted content
   is stored behind a paste wrapper, so the session gets no role, no start
   time and no usage key: every usage counter reads unknown, `harness usage`
   refuses, and the role's outside-write grants are judged for role
   "unknown". Observed on the 2026-09-20 planning session; the string the
   hook received is inferred, since the journal stores no prompt text.
   Whether pasted text may dispatch a role is the operator's judgment, because
   a paste can carry instructions the operator did not write. Options: leave
   it and document typing the phrase; resolve only when the paste is the whole
   message; or print one advisory when a known phrase follows a paste wrapper.
   Source: [the planning document](copilot-cli-integration-2026-09-20.md) §12.
   Reopen: the next planning pass, or a second session that loses its role
   this way.

## Candidates — returns from the standard pass (recorded 2026-09-21)

Boarded by the orders closed since 2026-09-19 and read by this pass from the
follow-up register; gathered here where several rows name one seam, so the
next order that opens it takes them together. Each names its sources and the
observation that reopens it. None is allocated; this section grants no
activation authority.

1. **Shell destination adapter width.** Five rows name the one adapter that
   reads a command for the live-gate, planning-branch and outside-write
   refusals: quoted glob characters and read-only input redirects refused
   during a live gate although they cannot expand (WO-142 D018, observed on
   both builds during VER-003); admitted Git metadata commands whose prefix
   protected `status` in a Git 2.55.0 fixture while `diff` still refreshed
   the index and ran a clean filter and `log.showSignature` invoked the
   signature program (WO-142 D012); a literal redirect beside an
   expansion-spelled one, or a quoted program argument containing `<` or
   `>`, un-naming the literal (WO-144 D009 and D010, part 2); the
   comment stranded above the wrong function (WO-142 D023, part b). One
   seam: `shellWriteTargets`, `shellRedirectTargets` and `metadataCommand`
   in `packages/skeleton/src/harness-command.ts` and `harness-host.ts`.
   Reopen: a second refused read containing a quoted glob or an input
   redirect in a live gate, an admitted redirect that reaches an ungranted
   outside destination, or a gate input observed changed by an admitted
   metadata command.
2. **The root-cwd precondition for the four root-bound refusals.** WO-144
   D007 and D008 ask the planner whether the writer, live-gate,
   planning-branch and subagent refusals should judge when the session's
   working directory is a descendant of, or outside, the worktree root; the
   fifth refusal already does, and every hook now journals its stand-down.
   Measured 2026-09-21 over the retained hook journals: six rows name the
   unverified-root precondition, against 80 working-directory
   classifications and thousands of judged calls. Deferred on that count.
   Reopen: the stand-down rows pass fifty, or a journal shows a call
   admitted off-root that one of the four refusals would have refused from
   the root.
3. **Machinery suite selection before final review.** WO-144 D010, part 1:
   `npm test` omits the machinery suites whose declared sources an order
   changed, so a deterministic process-debt failure passed one
   implementation, two repairs and three verifications before the
   final-review gate met it. Options: the executor and verifier procedure
   names `npm test -- --review`, or the runner selects machinery suites by
   changed declared sources. Reopen: a final-review gate again meets a
   deterministic failure in a suite no earlier run selected.
4. **Verification and repair host residue.** A source-change worker under
   the Codex writer profile cannot run a path-free named test because that
   shell inherits no PATH (WO-056 D002); `RepairSnapshotPrepared` records a
   physical path, so a re-verification log cannot be published and replayed
   (WO-056 D005 a); the fold records an authority's revocation-typed events
   before its actor filter, unreachable while the lists are empty (D005 b);
   an implementer-actor `SourceChangeObserved` on a verification workstream
   fails closed (D005 c); a verifier's own diagnosis has no durable field
   the repair capsule could carry (WO-056 D008); replayed decisions embed
   the whole 1.7 MB capsule per event, 1.1 GB of serialization for one
   stored live stream (WO-140 D008). Reopen: a live Claude worker that
   cannot resolve bare `node`; any verification authority declaring a
   revocation event type (D005 b first); a live verifier that still cannot
   satisfy the stated finding contract; a stored stream that again fails or
   dominates the skeleton suite.
5. **Meter and closeout residue.** The reviewer procedure runs
   `release prepare` before the result or the renderer keeps the published
   order's dispatch rows (WO-110 D013); `observed-facts.ts` matches a hedged
   quantity to a gate row by substring and should prefer the longest
   matching identity (WO-140 D007); `release prepare` printed "no files
   changed" while refreshing the meter block (WO-142 D020); WO-140's cost
   paragraph attributes one WO-121 in-sandbox failure to the hooks denial
   where the receipt shows the nested `sandbox-exec`, recorded as the
   difference in WO-140 D001 and not edited in the closed order. Reopen: the
   next order that edits `scripts/lib/meta.mjs`, `observed-facts.ts` or
   release preparation, or another repair that meets the no-files-changed
   message beside a changed draft.

## Candidates — returns from the Entropy Reducer pass (recorded 2026-09-22)

Recorded by the pass that filed WO-151; neither is allocated and this section
grants no activation authority. Each names its sources and the observation
that reopens it.

1. **Sustain: the reviewer on a cadence during operator absence.** WO-023
   named the candidate cadence (gated on operator absence after each release
   close, the 5S organism's Sustain) and product 05 keeps Sustain a candidate
   until an observed cadence justifies it; the 2026-09-08 NoOp register
   declined a general scheduler (FUP-0009) and the harness's own cron
   (FUP-0016), and WO-100's portfolio consumes only WO-119's candidates, so
   the reviewer is not absence work today. What would decide it: the cost per
   cycle (USD 17 and 29 minutes at the pinned actor, from the one observed
   run) against what a scheduled review finds that verifiers inside orders
   missed, and whether a cadence can be declared in the build rather than by
   a scheduler. Reopen: WO-111's first unattended hour closes and the
   operator asks for a review on a cadence, or two on-demand reviews
   (WO-151's live row and one more) show findings the order lifecycle missed
   at a cost the operator accepts.
2. **A meter column for the reviewer's dispatches.** WO-151 records each
   episode's cost in its receipt and adds no dispatch kind to
   `docs/control/budgets.json` or the usage observer, because the observer
   is a registered evidence source and the reviewer runs on demand. Reopen:
   the reviewer runs more than once per release and the operator wants its
   cost beside the roles' in the cost table, or a receipt's cost cannot be
   read from the transport's harness result.
3. **The sequence at the subject's limit of 100 orders.** The planning
   subject refuses a sequence of more than 100 orders
   (`scripts/lib/plan-subject.mjs`); after this pass the sequence holds
   exactly 100, 51 of them closed, and the sequence's own rule keeps closed
   entries until the operator changes the horizon. WO-149 D009's nomination
   was drafted as WO-153 (a Codex dispatch whose session begin throws prints
   a named advisory with the cause and still delivers its briefing and exit
   0) and withdrawn for that reason; the draft is retained in the local
   control lane (`docs/control/local/plan/`) and its design is in the
   planning document §5. The operator decides whether closed entries retire
   into the archive (the sequence and map keep their rationale), whether
   the limit moves (a code change with its own order), or whether the next
   pass files nothing new until R2. Open for the operator; reopen at the
   next planning pass or the operator's answer.

## Candidates — returns from the WO-064 and WO-100 closes (recorded 2026-09-22)

Boarded by the orders closed on 2026-09-22 (WO-063, WO-120, WO-152, WO-151,
WO-064 and WO-100) and read by the closeout follow-ups pass from the
follow-up register; gathered here by seam. **All eleven are allocated to
[WO-157](../work-orders/WO-157-closeout-followups.md)**, one order carrying
every defect, at the operator's mid-pass correction ("take everything and
put it in a single work order, one time, authorized by me"); the pass's
first draft had allocated only the first and deferred the rest, and that
error and its correction are recorded in the planning document §12. Each
item keeps its sources and the observation that reopens it after WO-157
closes; WO-151 D007 (item 11) is the one non-defect, kept as a record and
outside WO-157's criteria. This section grants no activation authority.

1. **Closeout helper residue.** `worktree integrate` strands itself on an
   intent-to-add entry (WO-100 D017; WO-157 criterion 1). The adjacent
   queue's deferred items keep a literal target because the executor
   disposes them before `plan followups --sync` mints the public identifier,
   and a later order cannot retarget a closed order's retained queue: the
   queue is addressed from the selected order's branch and refuses mutation
   outside that order's `active` and `repairing` phases
   (`scripts/adjacent-work.mjs`; WO-064 D011, WO-152 D011). Product 07
   §Retained planning follow-ups now says sync before dispose; WO-157
   criterion 2 puts the sentence in the executor's rule and admits the
   reviewer-phase retarget; the retained rows keep their literal targets.
   Reopen: a third order's queue carries a literal target after WO-157
   closes.
2. **Target publication runs the target's hooks.** `publishTargetOrder`
   pushes from the target's Git root with no hook override, so a `pre-push`
   or `reference-transaction` hook in the target's common Git directory runs
   in the operator's process with the operator's credentials after every
   refusal has passed; whether a sandboxed target writer can plant one is not
   established (WO-064 D010). Due before the first target publication of a
   model-written episode: WO-066 is the first sequenced order that pushes a
   worker's repaired head under the grant, then WO-112 and WO-118. Shape:
   probe both writer profiles against the common Git directory first; until
   disproved, push with hooks disabled or refuse when the hooks directory,
   `core.hooksPath` or hook-relevant configuration differs from a snapshot
   taken before the writer ran, with a fixture that plants a `pre-push` hook
   and observes it does not run (WO-157 criterion 4). Reopen: a target
   operator requiring its hook to run, or a probe result WO-157's guard does
   not cover.
3. **The skeleton refuses a grant-bearing identity.** `compileLoadout` keeps
   an optional `authorityGrantRegistry` in the compilation environment and
   `isCompilationEnvironment` admits exactly five keys, so every identity
   compiled with a registry is refused at equip and at the source-change
   host (WO-064 D006; WO-064 avoided the path by compiling its writer without
   publication grants). No order on the near horizon equips one: WO-111's
   portfolio carries no remote grant (WO-157 criterion 5). Reopen: a
   resident receipt recording `ArtifactCompilationRefused` after WO-157
   closes.
4. **Derived-order ceilings the source-change host does not count.** WO-052
   checks each changed path only by surface prefix; nothing counts a Shine
   or Standardize change's files against the envelope's `files` limit, and
   a deletion or a file turned into a directory passes without `repo.delete`
   (WO-100 D016; `portfolio.ts` line 43 still says "Host-counted"). Due
   before a portfolio runs unattended on an operator repository; WO-111 runs
   on a scratch repository and forbids runtime fixes, so the first exposure
   is the operator's own portfolio after WO-111 or WO-118's starter
   instance (WO-157 criterion 3). Reopen: a verifier shows a derived order's
   change exceeding its declared size after WO-157 closes.
5. **The resident's production binding.** The portfolio binding's authority
   profile check runs in the configuration loader and not for a hand-written
   `resident.json` (WO-100 D006), and no default model exists for always-on
   agents (WO-100 D007; product 06 records the candidate values). Both were
   routed to WO-111, whose criterion 6 and non-goals forbid runtime changes;
   WO-111 declares its portfolio through the loader and binds with explicit
   `--model` and `--effort`, so the proof needs neither; WO-157 criteria 6
   and 7 land both ahead of it. Reopen: Sonnet 5.5 arrives (the Sonnet tier
   moves), a selected model is withdrawn, or the operator changes a role
   default.
6. **Live-episode diagnosability.** An `invalid-result` worker refusal
   records only the code, so a refused live episode leaves nothing to
   diagnose (WO-152 D009: two refused verifier episodes at USD 2.72 with no
   cause); `worker-transport.ts`, `verification-protocol.ts` and
   `dotln.ts` are registered feedback sources, so the carry re-mints. The
   refutation statement carries the attempts payload instead of prose
   (WO-151 D017); the confinement witness's summary overstates what
   `trackedStatus()` and a net scratch count observe (WO-151 D020). WO-157
   criteria 8, 9 and 10. Reopen: a refused live episode with no diagnosable
   cause, or a receipt whose zero scratch delta hides a moved inventory
   hash, after WO-157 closes.
7. **Selected-effort readback for Claude Code.** `docs/discovery/environment.json`
   records claude-code `effectiveEffortReadback` as not found at 2.1.263 and
   carries no selected-session readback, while this pass observed
   `CLAUDE_EFFORT=xhigh` exported at 2.1.280 and WO-152's reviewer recorded
   `unknown` for a supplied value; WO-100's status projection reports the
   same drift (WO-152 D012). The probe file is a registered feedback source.
   WO-157 criterion 11 adds a selected-session readback row for claude-code
   (the variable and the persisted `effortLevel`; selected, not effective)
   and an observed selected-effort attestation source. Reopen: a Claude Code
   attestation disagrees with the variable after WO-157 closes.
8. **Registries that follow the import graph.** Protocol files change the
   compiled behaviour of registered sources without being registered
   (WO-151 D001); a new committed JSONL stream or document suite owes a
   registration that nothing checks until it is selected (WO-151 D021).
   WO-157 criteria 12 and 13. Reopen: an edition check passes over a changed
   protocol, or an unclassified committed JSONL or unstubbed suite reaches a
   gate, after WO-157 closes.
9. **Gate-sandbox fixture teardown.** The WO-140 fixture's teardown can fail
   the runner-fixtures suite with `ENOTEMPTY` after its assertions passed,
   a failure with no owner (WO-063 D005). Observed once, at WO-063's first
   review gate; this pass found one abandoned `dotln-gate-sandbox-*` root
   dated 2026-09-21 22:00 in the temporary directory and none of the four
   product gates since (WO-120, WO-151, WO-064, WO-100) failed this way.
   WO-157 criterion 15. Reopen: an `ENOTEMPTY` teardown in any gate, or an
   abandoned root after a completed `npm test`, after WO-157 closes.
10. **Allocation events bound to the section constant.** Folding the control
    log re-validates every `WorkOrderIdentityAllocated` event against the
    section list in `scripts/lib/derived-contract.mjs`, so a list change can
    make historical events unfoldable repository-wide (WO-120 D007). No
    derived order lives in a control plane kept across releases yet. WO-157
    criterion 14, with a dated note on WO-113's catalog row. Reopen: the
    section list changes after WO-157 closes and an allocation event fails
    to fold.
11. **The reviewer's phrase depends on the operator.** `planning: entropy
    reducer` is the only thing that invokes the reviewer (WO-151 D007); two
    orders have closed since WO-151 merged and the phrase has been used once.
    Reopen: ten closed orders without the phrase after WO-151, or two passes
    that open with it and still carry findings undecided.

## REVIEW-002 consumed — dispositions, routes and the order design waiting for room (2026-09-22)

Recorded by the second planning pass of 2026-09-22, which consumed
[REVIEW-002](../instance/entropy-reducer/runs/REVIEW-002.md) under
[REFUTATION-003](../instance/entropy-reducer/runs/REFUTATION-003.md). The
accepted findings are register rows through the
[generated review document](entropy-reviews/REVIEW-002.md); this section is
the planning decision over them and grants no activation authority. Every
figure below was re-measured on `main` at `4bf626f4` on 2026-09-22 unless it
names the review.

**Superseded the same day (planning document §12).** At the operator's
direction closed entries leave the sequence and the accepted findings are
filed as orders: the evidence-editions order designed below is
[WO-154](../work-orders/WO-154-evidence-editions-by-reference.md), and the
two boy-scout nominations became
[WO-155](../work-orders/WO-155-single-source-floor.md) and
[WO-156](../work-orders/WO-156-plan-check-sub-second.md). The table's routes
read accordingly; the design and the NoOp register stand as the record of
what was weighed.

| Item                                                                                      | Disposition    | Route                                                                                                                                                                                          | Reopen                                                                                   |
| ----------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ER2-001 — evidence copied by value (major)                                                | accepted       | the evidence-editions order below, when the sequence has room                                                                                                                                  | the order closes, or a pass with room does not file it                                   |
| ER2-002 — editions re-mint on version-only bumps (major)                                  | accepted       | the same order (one recorder)                                                                                                                                                                  | the same                                                                                 |
| ER2-003 — the refusals paragraph twice per role; a ceiling route that never binds (minor) | accepted       | single-source emission nominated as a boy-scout item on WO-100's catalog row; the metric and ceiling route to the operator's efficiency pass (WO-054 D006)                                     | WO-100's executor declines the item, or the operator opens the efficiency pass           |
| ER2-004 — `plan check` 16.5 s from a per-path configuration load (minor)                  | accepted       | boy-scout item on WO-064's catalog row                                                                                                                                                         | WO-064's executor declines it, or `plan check` still exceeds 2 s after WO-064 closes     |
| Packet `content-addressed-evidence-inputs`                                                | accepted, filed | design record for the order below                                                                                                                                                              | the order's decisions                                                                    |
| Packet `behavioral-staleness-key-for-evidence-editions`                                   | accepted, filed | design record for the order below; WO-147 D010's rejection carried as a constraint                                                                                                             | the order's decisions                                                                    |
| Packet `cold-start-trend-and-single-source-floor`                                         | accepted, filed | the emission half with WO-100's nomination; the metric half for the operator                                                                                                                   | the operator's efficiency pass                                                           |

**The evidence-editions order (designed, not filed).** Title for the pass
that files it: _Evidence editions keyed by behavior and recorded by
reference_. One seam: the feedback self-host recorder and its staleness check
(`packages/skeleton/src/feedback-selfhost.ts`, `scripts/feedback-evidence.mjs`,
`scripts/lib/evidence-sources.mjs`), with the planning receipt subject
(`scripts/lib/plan-receipts.mjs`) as a second criterion group only if the
executor judges it the same seam; otherwise that part is a patch order of its
own. Criteria the order carries: (1) a new edition records
`payload.subject.files` and `payload.baseline.files` as `{path, blobHash}`
resolved from Git, and `--check` resolves bodies from the committed tree or,
before the commit exists, from working-tree files whose hash matches; (2)
staleness is keyed on a behavioral identity (the policy hash, the ten
fixtures, the audited compiler and skeleton modules) with the version pins and
lock file recorded as metadata, and a pins-only change re-mints
deterministically with no live episode; (3) a behavioral change still cannot
inherit an older live audit, which is WO-147 D010's rejection kept as a
regression; (4) every existing edition and receipt stays byte-identical and
the edition schema version moves; (5) the order's own Cost line measures the
per-edition bytes before and after (1.26 MB against about 40 KB expected) and
the live episodes it removes. Smallest probe: the second packet's second
alternative, skipping the live episode only when the generated
`feedback.json` differs from the previous edition solely in its subject field,
the comparison D010 made by hand. Non-goals: history rewriting, Git LFS, and
retention of older editions outside the tree (the packet's alternatives,
declined below). Placement when room exists: a one-entry slot after WO-100 and
WO-064, because it edits registered sources and re-mints the editions and so
must not run beside an order that does the same; it delays no critical-path
order. Dependencies: none open. Model any capable; effort executor xhigh+,
verifier xhigh+, reviewer any.

**The boy-scout nominations.** Product 07 §Operator-opened planning pass
admits a named boy-scout item for the next activation as the alternative to
an order. Both items are host-reviewed under the bounded boy-scout rule: the
executor admits or declines them in its decisions, and a declined item stays a
register row. They are written on the catalog rows, not in the order texts
receipt 024 judged, so neither order is re-keyed. (a) On WO-064, in
`scripts/lib/plan-subject.mjs` lines 309–314, build the work-order path
pattern once per call instead of once per committed path per sequence order;
the check is `plan check` under 2 s wall-clock with the `plan-refutation`
suite green, and no behavior changes. (b) On WO-100, which regenerates the
bundle and re-mints the editions in its own criterion 5, emit the shared
refusals paragraph once in the floor and have each generated skill refer to
it, only after checking that a skill read without the floor stays complete in
every supported harness; if it must stand alone, the item is declined and the
row reopens for the efficiency pass.

**The NoOp register of this pass.**

- _Pay for a fresh review._ `subject` returned `consume`; a fresh episode
  costs about 993 s and USD 9.50 by the REVIEW-002 observation and would
  rediscover the same findings under new identifiers (WO-151 D011). Declined;
  reverse never for this subject.
- _File the evidence-editions order now._ The sequence holds 100 orders and
  the subject refuses more; the operator's horizon decision (candidate 3 of
  the section dated 2026-09-22 above) is open. Declined; reverse when the
  operator answers or a pass has room.
- _Retire closed entries to make room._ The sequence's own rule keeps closed
  entries until the operator changes the horizon; a planner does not change
  it. Declined, as the earlier pass declined it.
- _Fold the evidence-editions work into WO-085 or WO-060._ WO-085 is a
  documentation-boundary order and WO-060 is the worker-input contract;
  neither is the recorder's seam, and a fold re-keys their judged text.
  Declined.
- _Fix `plan check` as its own patch order._ Three dispatches and a gate for a
  few-line hoist in a shared check; the boy-scout route is the right size.
  Declined; reverse if WO-064's executor declines the item and the horizon
  opens.
- _Dedupe the refusals paragraph on WO-064 instead of WO-100._ The generator
  is a registered evidence source, so the change re-mints the editions and
  spends a live episode WO-064 would otherwise not pay; WO-100 pays it anyway.
  Declined.
- _Retire the cold-start ceiling route in this pass._ The operator directed
  the route on 2026-09-17 and reserved efficiency redesign for a later pass on
  2026-09-18 (WO-054 D006); a planning pass does not overrule a standing
  operator direction on a reviewer's finding. The disagreement and its
  evidence are recorded in the filed packet and here. Declined; reverse when
  the operator opens that pass.
- _Dismiss ER2-003 because its ceiling half is settled._ Its emission half is
  a measured, unsettled defect and its ceiling half is the observation the
  efficiency pass needs. Declined.
- _Git LFS, in-place compression, or archiving older editions outside the
  tree._ Each keeps the copy or moves it; by-reference removes it while the
  bytes stay in Git under the hash the edition already records. Declined; the
  order may reopen any of them with a measured reason.
- _Accept the growth with a size budget._ A budget that is never bound is the
  ceiling ritual ER2-003 describes. Declined.
- _Triage the register's seventeen untriaged rows in this pass._ The phrase
  makes the review the subject instead of the register's existing rows
  (product 07; WO-151 D007); the rows persist for the next standard pass.
  Declined; reverse if the operator opens a standard pass.
- _Spend survey agents._ Four findings and their sources fit one session's
  reading; the pass spent no subagent before the refutation. Declined.

## Candidates — returns from the off-ramps pass (recorded 2026-09-25)

Found by the 2026-09-25 planning pass's five research streams (the WO-111
reconstruction, the cross-order catalog, the sandbox audit, the helper
inventory and the 5S inventory) and not allocated to WO-158 to WO-165.
Each keeps its source and the observation that reopens it. This section
grants no activation authority.

1. **Skeleton protocol validator kit.** `object`, `exact` and `check`
   have repeated groups across `entropy-review-protocol.ts`,
   `verification-protocol.ts`, `worker-protocol.ts`,
   `mission-check-protocol.ts` and `plan-refutation-protocol.ts`; every
   one is a feedback source, so WO-162 excludes them. **WO-162 measurement,
   2026-09-27:** 12 declarations (including worker `keys`), 64 lines,
   2,280 declaration bytes and 162 direct calls. Identical groups contribute
   996 surplus bytes before shared-module/import overhead: three `object`
   copies, two distinct pairs of `exact`, and the mission/plan `check` pair.
   The original claim that all three helpers were identical in all five
   files was incorrect; verification's `check` restricts its reason to
   `EvidenceResultRefusal`, which a future adoption must preserve. Rides as a boy-scout
   item on the next order that pays a live feedback episode and touches
   two of the five. Reopen: that order's activation.
2. **Control-character contracts differ under one name.** `line`/`text`
   validators use three control-character classes across the skeleton
   protocols and four across `scripts/lib` (planning document §8); a
   value the handoff contract accepts can be rejected by the mission
   check. WO-162 records a decision per divergence and names any latent
   defect; the contract choice itself is a bounded order when a failing
   case is observed. Reopen: a value refused late across two surfaces.
3. **The host-printed scratchpad is not a granted root.** Two research
   agents and the planner met `DOTLN_HARNESS_REFUSED: outside-project
   write` when following the host's own scratchpad instruction, because
   WO-144 grants system-temp and the DotLn scratch path only. Each refusal
   costs a turn. **Decided 2026-09-25 (operator direction that this pass
   decides its own questions):** the root is granted. It is derivable
   from the session id and the project path the hook already knows, so
   the grant admits that one directory and not `/private/tmp`. Allocated
   as an operator-directed boy-scout item on WO-158's catalog row, which
   edits the same classifier. Reopen: the item is declined at WO-158's
   activation, or a refusal for the host-printed root recurs after it
   closes.
4. **Archiving consumed planning passes.** Five dated passes are fully
   consumed but carry 3 to 11 live inbound links each; `docs/planning/archive/`
   holds one file and no written rule. NoOp: 27 link updates buy nothing
   a reader needs today; the operator decides the rule. Reopen: the
   planning directory exceeds forty documents or a reader is misled by a
   consumed pass.
5. **Tracked evidence bytes.** 148,788 KB of 202,792 KB tracked is
   `docs/evidence` (73%); since WO-154 a new self-host log is about
   72 KB against 1.4 to 2.1 MB before. NoOp on a ceiling: the growth is
   cut and a ceiling would be a mechanism with no removal. Reopen: a
   week adds more than 10 MB of tracked evidence.
6. **Sustaining checks for orphan scripts and the docs index map.** The
   inventory found zero orphan scripts and five missing index rows (added
   by this pass). NoOp: a check that guards a zero. Reopen: a second
   inventory finds three or more orphans or five or more missing rows.
7. **UTC and local dates in records.** Decisions, the integration stash
   name, the roadmap note and VER-003 say 2026-09-25 for work done on the
   evening of 2026-09-24 local; commits carry `-0400`. NoOp: every
   generator uses UTC consistently and the ambiguity is a reader's, not a
   check's. Reopen: two records disagree on the order of two events.
8. **The Claude Code auto-mode classifier denied a verifier's instrument
   run.** WO-111 VER-002 lines 59 to 66: the operator ran the check with
   `!` and the verifier cited output whose exit code it could not see.
   A host behavior, not DotLn's. NoOp. Reopen: a second verification
   cites operator-run output for a required check.
9. **Stale trust entries in the operator's Codex configuration.** 36 of
   43 trusted project entries are DotLn scratch and probe families, 34 for
   paths that no longer exist (WO-111 `codex-trust-diagnosis.md`). WO-159
   stops the accumulation; removing the existing entries is the operator's
   action outside the repository. **Done 2026-09-25:** the operator removed
   every entry but the DotLn project's, so the count is one; WO-159's
   executor records that baseline, not WO-111's 43. Reopen: the count
   rises before WO-159 closes.
10. **Integration stashes and `git stash list`.** Eighteen entries on
    2026-09-25, ten named for published orders. Allocated to WO-160 item 7.
    Reopen: the count exceeds thirty before WO-160 closes.
11. **`harness prune` spends its time on the network.** Its publication
    check makes two blocking calls (`gh release view`, then `git ls-remote`
    for the tag) for every release row whose manifest names a lane's
    order, newest first, across 65 retained lanes: up to 364 rows by text
    match, up to 728 calls at about 3 s a pair. The operator's run
    (2026-09-25) walked 36 minutes and was then refused because a gate
    run had changed a snapshot; the planner's re-run was killed at 54
    minutes; neither removed a byte. **Operator direction, same night:**
    rewrite the check. Allocated to WO-160 item 7 (already the prune
    seam): one `gh release list --json tagName,isDraft` and one
    `git ls-remote --refs --tags origin` per run, matched in memory; a
    lane's row is the order's own release from the manifest's
    `workOrders` field; hashing only for candidates not retained by rule;
    the apply re-observes only the candidate set and names what changed;
    a network timeout retains every lane with one printed reason. Reopen:
    a prune run exceeds 60 s on the operator's host after WO-160 closes.

## Candidates — returns from the standard pass (recorded 2026-09-25, second)

Found by the 2026-09-25 standard pass while looking into the operator's
four items and not allocated to WO-166, WO-167 or the rewritten WO-085 to
WO-087. Each keeps its source and the observation that reopens it. This
section grants no activation authority.

1. **Version assigned at publication, not at activation.** Every pair since
   2026-09-16 has collided on the application target because both orders
   claim the next version at activation (`release prepare`; product 07
   §Discipline, release assignment is opt-out). Assigning at final review
   from the observed baseline would remove the collision itself, not only
   its prose; it touches the activation event's target, the heading
   placeholder rule, `check-surfaces --local`, the README claim and every
   role text. WO-086 is the smaller probe: the collision stays and becomes
   a decision record with no prose. Reopen: after WO-086 closes, a
   collision still needs a hand step or produces a review finding, or the
   operator asks for it.
2. **Per-document consolidation after the guide.** Product 03 (171,984
   bytes; 23 dated paragraphs; eight candidates), 02 (147,558 bytes) and
   05 (133,283 bytes; 21 candidates, the pattern library's own material)
   carry the same accretion WO-167 folds out of 07. One order per document,
   in reader order, each lowering its ceiling. Reopen: WO-167 closes
   (its verifier's method is the template).
3. **Session journals are discarded at teardown, so a frequency question
   has no answer.** The operator asked whether the Codex writer gap
   happens every time; worktree-local `docs/control/local/harness/`
   journals leave with the worktree and main's 121 journals hold planner
   sessions only, so the answer is three observed cases and an unknown
   rate. Candidate: `release close` retains each session's journal
   summary (role, writer events, gate rows, usage) in the order's retained
   lane. Reopen: a second operator question about session behaviour that
   the record cannot answer.
4. **Refutation receipts embed the subject.** `docs/planning/refutations/`
   is 16,140 KB across 69 files (the newest receipt 357,299 bytes) because
   each receipt carries its subject's text; the register row
   FUP-beb13d8d099d2917 (WO-154 D003) already designs storage by identity
   and hash. Deferred there. Reopen: the directory passes 32 MB, or a
   planning pass with room after WO-085 lands.
5. **The babysitting rate, measured.** The front page says working with
   agents drifts into babysitting; the meter's shifting-the-burden signal
   has an `operatorCorrections` counter that reads zero with an
   unavailable delta (WO-160 row). The sources exist: `scope expand:`
   dispatch fields in decision records, `OperatorOverrideRecorded`,
   `RecordCorrected` and `CriterionWaived` events, `analysis:` entries
   in the operator-control journal, and the count (never the text) of
   captured intake notes per pass. Candidate: fill the counter from them
   and plot directions and corrections per closed order per pass in the
   cost table. Nominated at the operator's direction, 2026-09-25 ("yes
   please nominate whatever you feel is necessary"). Reopen: the next pass
   with room, or the operator asks for the number.
6. **The stored-data inventory: measured, analyzed, acted on.** The
   operator observes that much data the app stores has not been measured,
   analyzed or acted on. Candidate: one generated table over every
   retained lane (control logs, harness journals, gate rows, usage
   observations, evidence editions, beacon caches, adjacent queues,
   refutation receipts, the register, meter rows, entropy reviews) with
   three columns: a counter reads it, a pass or review consumed it, a
   decision cites it. Lanes with none of the three are the work. 5S Sort
   applied to data; the natural first research stream of the next pass.
   Reopen: the next pass, as its opening inventory.
7. **Consume before produce for standard passes.** The Entropy Reducer
   pass consumes before it produces (product 07 §Operator-opened planning
   pass); a standard pass files orders at will, and this month's passes
   filed almost only machinery (meter machinery share 0.476; sequence
   paragraphs 2026-09-16 to 2026-09-25). Candidate rule: a standard pass
   files an order only for a fired reopening condition or an operator
   direction and otherwise disposes rows as deferrals. A product 07 rule
   change, decided by the operator at a pass. Reopen: the operator's
   answer, or a pass that files more debt orders than the product orders
   it advances.

## Candidates — returns from the onesie-twosie pass (recorded 2026-09-27)

Found by the 2026-09-27 pass while draining the follow-up register. Items
1 to 3 are allocated to WO-169; items 4 and 5 were weighed and declined
with the observation that reopens each; items 6 to 9 come from the
stored-data inventory the pass ran under the operator's answer. This
section grants no activation authority.

1. **Seam-conditioned follow-ups reach the order that opens their seam.**
   A row deferred until "the next order that edits" a file is shown to no
   order: `reactor.ts` was edited by WO-099, WO-151, WO-154 and WO-070,
   `scripts/lib/meta.mjs` and release preparation by WO-155, WO-158 and
   WO-160, and `resident-state.ts` by WO-100, each after the deferral of
   rows that wait for exactly that, and WO-115 closed without the row
   deferred until it activated; eight rows, none disposed. Candidate:
   `followups --touching` names the pending rows a change touches and the
   completion check advises with the count. Allocated to WO-169 item 1.
   Reopen: an order closes with a touching row undisposed after WO-169.
2. **The follow-up feed exports its pending rows whole.** The feed pages
   at eight rows and clips reasons; the 2026-09-25 pass read 36 rows by a
   throwaway script and this pass 155. Candidate: `followups --export`
   writes every pending row whole to a file and prints counts only, so
   the page bound keeps protecting the planner's context. Allocated to
   WO-169 item 2. Reopen: a pass still writes its own projection.
3. **A batch of dispositions in one command.** `followups --apply` takes
   one request bound to a revision that every apply changes; 163 request
   files sit in the main checkout's local control lane. Candidate: an
   array form under one expected revision, applied in order, all or
   none. Allocated to WO-169 item 3. Reopen: a pass still chains
   revisions by script.
4. **Changed machinery suites in the plain product gate.** `npm test`
   selects product suites and `--review` adds the machinery suites whose
   declared sources changed, so an executor's green gate can precede a
   deterministic machinery failure (WO-144 D010; WO-166 D013 met four
   stale process fixtures at the repair's integrated review gate).
   Selecting them in plain `npm test` changes the duration and meaning of
   the gate every role runs. Declined for now: the planning rule that an
   order editing a machinery source names `npm test -- --review` is the
   smaller probe. Reopen: an order whose criterion named the review gate
   still meets a deterministic machinery failure first at final review,
   or two orders without the named gate do.
5. **Programs the live gate refuses.** Sessions met refusals for `cut`,
   `sort`, `date`, `printf` and `echo` while a gate was live (WO-158
   VER-003 and FINAL-002). Each would need a bounded option vocabulary
   (`sort -o` writes a file), and the refusal already names the list.
   Declined; WO-168 corrects the argument forms of programs already
   listed and adds none. Reopen: the retained journals or three reports
   after WO-168 show a session losing more than one command to the same
   unlisted program in one gate window.
6. **Gate rows outlive the failure output they cite.** `worktree finish`
   copies an order's gate rows into the main checkout and not the output
   files the rows reference: of 257 distinct output references in the
   main checkout's 256-row index on 2026-09-27, 234 do not resolve, and
   verification reports cite some of them. The lane is local and ignored,
   so no other clone could resolve them either. Deferred: nobody is
   recorded needing a failure log that was gone. Reopen: a verification,
   a review or a planning pass needs a gate's failure output and finds
   the reference unresolved.
7. **A gate marker with no birth observation never expires.** A marker
   whose `processStartedAt` is null is judged live whenever a process
   holds its pid; the main checkout has held one since 2026-09-16 (pid
   43275, no such process on 2026-09-27), and nothing removes a dead
   marker. A reused pid would read as a live gate and refuse writes.
   Deferred: no such refusal is on record, and an age bound on the
   boundary that protects gate evidence needs its own fixtures. Reopen: a
   session is refused for a live gate while no gate runs, or the next
   order that edits `gate-evidence.mjs`.
8. **The register has no flow counter.** Nothing reports how many rows
   arrive and how many are disposed per pass, or how old the pending rows
   are; each planning document counts by hand. Deferred: WO-169 changes
   how rows are found and disposed, and the count is worth adding once
   that flow exists. Reopen: two passes in a row end with more pending
   rows than they began with.
9. **Operator-control state accumulates in the temporary directory.** The
   state directory held 2,386 entries on 2026-09-27 and only the
   open-override advisory reads them. Declined: the files are small, the
   directory is the system's to clean, and no session start is recorded
   slow. Reopen: a session start is measured slower because of the
   directory's size.

## Candidates — returns from the failures pass (recorded 2026-09-28)

Found by the 2026-09-28 pass while counting what the phases recorded as
failed. None is allocated; each is recorded with its measurement and
its reopening condition. This section grants no activation authority.

1. **Release close records its outcome.** A close that fails leaves logs
   and notes in the ignored local lane, for eleven of 117 orders and
   under no common name, and no event; a pass cannot count failed closes
   or say why one failed. A record needs a home a pull request carries,
   as the meter's snapshot has. Deferred: no close is recorded as failed
   since WO-171 made the prune finish. Reopen: a release close fails and
   the next pass cannot say why.
2. **A judgment that leaves no report.** A judge's session that opens
   an allocation and writes nothing is invisible to every count: the
   surveys met three among 96 failed reports (WO-039, and two sessions
   on WO-126's fourth verification). Deferred. Reopen: a verification
   is dispatched and no result is recorded for it within a day.
3. **The verdict rule for a case ordinary use has not reached.** 23 of
   the 96 failed reports rest only on such cases (24.7 hours of judging
   and repair). The operator changed the planning refuter's rule on
   2026-09-15 so that a constructible counterexample is a known issue;
   for code the same rule would also have passed defects that were real
   and cheap to fix. Deferred for code while the smaller step takes
   effect: a criterion declares its set, and a case outside it is
   boarded. Reopen: after WO-173, two orders in a row fail only on
   cases outside their declared sets.
4. **Which judge.** The first verification failed in 28 of the 78
   orders that Codex executed and Claude Code judged, and in 20 of the
   24 judged the other way round; the pairing changed on 2026-09-22 and
   the failure rate rose the same week. The cause is not established:
   the judges, the executors and the kind of order all changed together,
   so a change of judge would be a guess. Deferred. Reopen: one order is
   judged by two judges.
5. **An executor's adversarial review before handoff.** It would reach
   for the 126 findings no existing check shows. Declined: it repeats
   the verifier at a cost nobody has measured, and one order that ran a
   three-lens review before handoff failed on a guard (WO-171). Reopen:
   an order pays such a review and its first verification passes where
   its neighbours' fail.
6. **Cited paths checked with the plan.** The stale citations in the
   queue were found by reading each order: the surveys of 2026-09-28
   found 109 of 899 citations in the 45 open orders unresolved or moved
   (46 paths, 42 sections, 21 orders, reports or decisions). A check of
   every cited path would spend part of the plan check's two seconds.
   Deferred: every open order was re-observed and amended in this pass,
   and a pass re-observes an order before it moves to the head. Reopen: a
   pass finds a cited path moved in an order it had re-observed.
7. **The register's match skips generated projections** (WO-169 D002).
   Seven final reviews wrote 123 dispositions and 11 of them named a
   generated projection or the release line. Declined as too few to pay
   for a change; WO-173 rewords the rule that made a review write 60
   others. Reopen: the share passes a quarter of a review's
   dispositions.
8. **Whether the live feedback audit earns its place.** A live model
   re-reads the pinned feedback sources and the regression report in an
   empty mount to confirm the report's claims; the deterministic
   regressions already run each unit's mechanism present and removed
   without a model. The record holds 92 live feedback verifications in
   56 orders since WO-011, and all 368 of their verdicts are pass. Until
   2026-09-28 the episode also cost fixes: three orders deferred a real
   defect to avoid a second paid episode (WO-099 D027, WO-152 D009,
   WO-157 D024). The operator's direction of 2026-09-28 removes the
   authorization; the episode's own cost stays. Deferred. Reopen: a live
   verification returns anything but pass where the deterministic
   regressions passed, or ten more orders pay an episode and every
   verdict is pass.

## Candidates — returns from ideation during WO-173 (recorded 2026-09-28)

Recorded from the operator's two ideation messages during WO-173's
execution (ignored intake `docs/intake/notes/WO-173-expanded-ideation-2026-09-28.md`,
SHA-256 `2993746fa51b3d9d903c9e3b39162f7110600b717e4e499abfbd5ecbf78cf71f`; the
ledger section of this date; receipt WO-173-D006). None is allocated; this
section grants no activation authority.

1. **Product documents owned as wholes.** The operator's standard: every
   product file as tight as possible, public, one cohesive story; the
   roadmap and the README read as scratch because each order appends its
   paragraph and nobody owns the document. Product 07 §Documentation
   freshness and ownership already forbids the dated paragraph (2026-09-25);
   the executor role text and `release prepare` still demand two per order,
   the roadmap's activation-completion paragraph and the README block's
   version line, and WO-173 wrote both during this dispatch. Route: WO-086
   gives the release boundary its generated home and WO-087 moves the
   candidates out; after them, the activation-target duty leaves the role
   text and `docs-check` refuses a new per-order dated paragraph under any
   product heading, as it refuses a ceiling. Reopen: WO-086 closes, or the
   next pass re-sequences the roadmap fold.
2. **The README release block regenerated within its rule.** WO-068-D004
   bounds the block at fifteen sentences with per-order detail in release
   notes; on 2026-09-28 the block between its markers is 7,251 bytes and
   about forty sentences. Route: `release prepare` renders the block from
   the version line and the latest release notes, and `check-surfaces`
   refuses a block over the rule, so an order cannot append to it. Reopen:
   WO-086 lands without the README, or a reader of the README reports it as
   a log again.
3. **The roadmap's remaining sections.** Beyond the release boundary
   (WO-086) and the candidates (WO-087), the roadmap holds capability
   progression policies and counterfactual profiling material that a reader
   of a roadmap does not expect. Deferred to the pass that sequences WO-087:
   decide their home (a product policy document or the planning map).
   Reopen: WO-087 is amended or sequenced.

## Candidates — returns from ideation during WO-116 (recorded 2026-09-28)

Recorded from the operator's ideation messages during WO-116's execution
(ignored intake `docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md` in
the wo-116 worktree, SHA-256
`b00d1e6376c4e83318c1af0eef46867ed51a950bb649ee793e07fa34f4722b74`; the
ledger section of this date; receipt WO-116-D015). None is allocated; this
section grants no activation authority.

1. **Utilization, not activation.** Distinguish time used toward a purpose
   with an end from activity for its own sake, in the execution guide's
   goal-aligned decisions and in the process meter, whose counts (tool calls,
   steps, hook runs) measure activation only. The observed case is the WO-116
   executor's polling while its review ran (WO-116-D013). Reopen: a planning
   pass places the distinction, or another order records the same failure.
2. **Waits used under the Blackjack +3 shape.** Tentative: let the
   progressive-absence curve (ADR-0007 item 6 and its amendment; product 03
   §Candidate — progressive absence authority and return readiness) decide
   what bounded, verifiable work an agent does while it waits on its own
   background work, with a declared ceiling and cutoff, instead of polling or
   idling. Open: scope inside an active order, owner, and measurement.
   Reopen: the progressive-absence candidate is allocated, or the operator
   directs a trial.

## Candidates — returns from ideation during WO-172 (recorded 2026-09-29)

Recorded from the operator's ideation message during WO-172's execution
(ignored intake `docs/intake/notes/WO-172-expanded-ideation-2026-09-29.md` in
the wo-172 worktree, SHA-256
`b0b4983bae7ea4455067abe46292946a0b1bbed2db43c0901367bf5bb018dae3`; the
ledger section of this date; receipt WO-172-D017). None is allocated; this
section grants no activation authority.

1. **Label an intervention with a disposition and a direction.** When the
   operator's interventions reach the record (WO-172-D013's follow-up), a
   label may name a disposition the agent lacked, had too little of or had
   too much of, beside the intervention's class, from the starting
   vocabulary the operator transcribed (the ledger section of this date).
   The operator's reading is the reference: a proposed label is scored
   against the operator's own before any count rests on it (WO-172-D016).
   Open: a fixed or grown vocabulary, a direction or a graded level, and
   whether readings add up per role, model or loadout. Reopen: a planning
   pass takes up WO-172-D013's follow-up, or the operator labels
   interventions in this vocabulary.

## Candidates — returns from the transcript survey (recorded 2026-09-29)

Recorded from WO-172's transcript survey: the subject map of the operator's
interventions ([intervention-subjects.md](../evidence/WO-172/intervention-subjects.md),
WO-172-D022) and the candidate interaction shapes
([interaction-shapes.json](../evidence/WO-172/interaction-shapes.json),
WO-172-D023). The subjects are the executor's reading through agents, which
the operator accepted as good for now on 2026-09-29. None is allocated; this section grants no
activation authority.

1. **Dispose the survey's subject map.** Take the map's 30 themes as a pass's
   subject beside `plan failures`: each names its episodes, the orders it
   touched, what the record already holds and a next step. Twenty-five need
   action. Three declined rows saw their recurrence conditions occur
   (FUP-5f58198706dfa59e, FUP-a815e8862796c2e1, FUP-9a23fe23cbf08958), and
   six themes recurred after their fixing order's final review. Confirm each
   theme with the operator before allocating it. Reopen: a planning pass takes
   up the map, or the operator corrects a theme.
2. **Stop retrying after a provider safeguard refusal.** The one subject
   nothing in the record covers: repeated provider safety refusals stalled an
   order's close and the retry loop could not break free even when warned.
   After a second consecutive refusal a role stops retrying, records the stop
   as a decision naming the phase and model, and resumes in a fresh session.
   Reopen: another episode, or a pass allocates it.
3. **A living collection of interaction shapes.** Give the candidate shapes a
   lasting home, a format later passes add to, reword and retire, the
   operator's confirmation of each, and an exhibit view. Horizon, in the
   operator's stated direction of 2026-09-29: streams built from the
   operator's inputs, counterfactual replay of recorded agent trajectories,
   and a twin of the operator's interventions ranked by fidelity against the
   operator's confirmed readings on held-out samples, used to improve agent
   behaviour in a loop. The twin predicts interventions, never feelings,
   stays local like intake, and is re-scored on fresh held-out samples so
   agents are not tuned to it instead of the operator. Reopen: a pass
   allocates it, or the operator adds or reshapes shapes.

## Candidates — returns from the standard pass (recorded 2026-09-30, second)

Recorded by the second 2026-09-30 pass, which took up the operator's three
items and WO-172's 30-theme subject map beside the register
([planning document](standard-pass-2026-09-30.md)). None is allocated; each
carries its evidence and its reopening condition. This section grants no
activation authority.

1. **An auto-mode environment entry for DotLn's own publication.** Claude
   Code reads `autoMode` prose only from the operator's user or managed
   settings, never from the repository, so an entry naming the DotLn
   release close as trusted publication is the operator's action outside
   the repository. WO-178's hook admission is the repository-owned route
   and does not depend on it. Reopen: the first Claude auto-mode close
   after WO-178 records a denial of the admitted command.
2. **Effort per spawned Claude agent.** The Agent tool selects a model and
   no effort; a spawned agent runs at the root's selection
   (`CLAUDE_EFFORT` is process-wide). The pinned `xhigh` for spawned Claude
   agents therefore holds when the root runs at `xhigh`. Reopen: the host
   exposes a per-agent effort, or a root at another effort spawns a
   judgment worker.
3. **A classifier for unclassified intervention rows.** WO-178 records each
   operator message's route, time, digest and prefix class; most rows are
   `unclassified` because the operator does not prefix a correction. A
   bounded local classifier over the host transcript, scored against the
   operator's reading as WO-172 D018 did, would fill the class. Reopen:
   two passes in a row report more than half of intervention rows
   unclassified, or the operator asks for the class counts.
4. **The structural cut of the product gate, re-measured.** Since WO-173
   closed, 40 `npm test` rows across 11 orders (WO-172 seven, WO-065 five,
   WO-086 five), 12 of them fresh at an identity already green; the
   2026-09-28 pass's reopening figure (any order above four) is met by
   three orders. Held until WO-174 explains the repeats and WO-179 removes
   the verifier's procedural rerun; the cut is a mechanism the removal may
   make unnecessary. Reopen: after both close, an order still records more
   than four product-gate runs.
5. **The planning refuter's fixed deadline.** `PLAN_REFUTATION_LIMITS.timeoutMs`
   is 1,200,000 ms in a registered evidence source; receipt 033 needed an
   acceptance to file. Receipt 035 took 605 s. Deferred: one pass needed
   the override and the last did not. Reopen: a second pass needs a
   timing acceptance to file its receipt.

## Candidates — returns from the standard pass with 5S and the operator's notes (recorded 2026-10-02)

Recorded by the second 2026-10-02 pass
([planning document](standard-pass-2026-10-02.md)). None is allocated;
each carries its evidence and its reopening condition. This section
grants no activation authority.

1. **A result memo per gate task, keyed by that task's inputs.** A replay
   of the last thirty orders against the import and literal-path closure
   of every product task: for the median order 99% of task time is still
   affected, the mean skip is 26%, and the wall-clock floor stays at the
   341 s skeleton suite in 23 to 25 of the 30. Declined now; WO-186
   takes the measured causes and keeps the replay script as evidence.
   Reopen: after WO-186 closes, the replay shows the median order's
   affected share below 60%, or the plain gate's median stays above
   360 s.
2. **Narrow what the shell suites copy.** Seven shell product suites copy
   all of `scripts/` into their fixtures (421 s, 34% of product task
   time), so any script change affects all seven and a memo could skip
   none of them. Reopen: candidate 1 reopens, or one of those suites is
   rewritten for another reason.
3. **A port for an instance-owned source adapter.** An instance that
   reads work from a tracker other than the forge's issues needs its own
   adapter; core has the issue reader and no port a private adapter
   plugs into. Reopen: an instance's parity map (WO-194) carries an
   unmapped row for a source and a WO-193 request asks for the port.
4. **The dated log in the documentation map.** `docs/README.md` holds a
   dated log of closed orders' configuration changes (8,294 of 20,059
   bytes at `08845c71`). Reopen: WO-189 closes, whose inventory method
   applies to it, or the file passes 25,000 bytes.
5. **Retention for the gate-check history and the session journals.**
   `docs/control/local/harness/check-history/` holds 1,315 files
   (68 MiB) and 161 session journals hold 27 MiB; `harness prune` has no
   kind for either, and the local lane grew 34 MB in a week. Reopen:
   `docs/control/local` passes 500 MB, or reading the gate index takes
   more than 2 s (279 ms for 10,256 rows today).
6. **Identifiers in test names.** 980 of 1,399 test names carry an order,
   report or finding identifier (70.1%; 66.6% a week earlier). WO-188's
   comment rule leaves names alone, because a name is how a report finds
   its test. Reopen: the operator widens the rule to names, or a reader
   of a failing gate cannot tell from a name what the test protects.
7. **One Git wrapper for the skeleton.** Ten files under
   `packages/skeleton/src` each define their own Git wrapper, unchanged
   since 2026-09-25; several are sources the feedback verifier judges,
   so a sweep owes a live episode. Reopen: an order that re-mints those
   files for another reason.
8. **Byte figures in queued orders.** Forty "at most N bytes" figures in
   24 queued orders rest on headroom measured on 2026-09-28. The
   ceilings set by this pass cover them, so none can fail a gate; each
   is rewritten when a pass amends its order. Reopen: a role trims or
   consolidates reviewed text citing an order's figure, or a queued
   write-back fails a ceiling.
9. **A process the host guard cannot attribute.** On 2026-10-01 a second
   `node` process reached a footprint of 388.56 GiB with 4.9 GiB
   resident; no gate, transcript command or DotLn session matches it.
   WO-185's guard stops a process it can attribute to DotLn work.
   Reopen: the guard records a kill, or the host reports another
   low-swap event while DotLn work runs.
10. **Manual corpus lanes.** Twelve of fourteen `corpus/**/*.test.mjs`
    files run in no gate, by their orders' design; nine were added on
    2026-10-01, and two lanes are keyed to their base and fail on later
    `main` (WO-105 D012, WO-107 D010). Their durations are not recorded.
    Reopen: a merged kernel or compiler change is later found to fail a
    lane, or an order edits the WO-105 or WO-107 lane.
11. **The planner's sentence on repairs after a judgment.** Added by the
    operator-answer pass of the same date. The planner procedure says to
    reuse the judgment after repairs unless observed evidence changed;
    the plan check freezes judged orders and the sequence and admits a
    change only through a hold's disposition or an authorized amendment.
    The pass before read the sentence as leave to repair, applied
    fourteen edits and reverted them. Reopen: the next order that edits
    the planner procedure in
    `packages/skeleton/src/loadouts/contributor.ts`, or a second pass
    edits judged text after its judgment.

## Candidates — returns from the machinery reset pass (recorded 2026-10-07)

The [2026-10-07 pass](machinery-reset-2026-10-07.md) read every failed
report since the last receipt (twenty across six orders) and filed two
orders. Items it weighed and left, each with its reopening observation:

1. **A failure-feed row that names the failing criteria and the blocking
   findings' classes.** `plan failures` rows carry report paths and
   judges; the pattern "every criterion met, verdict failed" was visible
   only in the reports. Reopen: the next pass reads more than ten failed
   reports by hand to classify them.
2. **A `resume qualify` command.** Declined (the planning document §12).
   Reopen: a gate lost to formatting or a record write after WO-196.
3. **A record-write watcher for Codex gates (WO-112 D057).** Declined
   (§12). Reopen: a record write during a review gate after WO-196.
4. **The known-issues reader as a marker block.** Declined (§6). Reopen:
   the reader drops a section of an order filed after 2026-10-07.
5. **Evidence volume (FUP-8a4e201d861208ad, FUP-be1103fbfdd14653).**
   Declined again (§12). Reopen: a week after WO-196 adds more than 10 MB
   with orders that passed verification in at most two attempts.
6. **WO-082's four demonstrations no order supplies** (stale marks that
   spread from a service change to dependent members; a shared-file
   conflict surfaced as coordination work; a blocked target naming its
   manual handoff; a workstream-level next safe action). The 2026-10-07
   pass narrowed WO-082 to the four demonstrations the tree and its
   dependencies supply. Reopen: an order builds one of these, or product
   12's claims about them are to be proved.
7. **WO-014 phases 2 and 3** (counting approval requests per harness and
   scenario). No hook observes approval requests (the WO-136 matrix).
   Reopen: a host channel reports approval requests.
8. **WO-088's withdrawal.** Its gap (phrase copies diverging) was absent
   on three passes; its own assumption 3 says to take it out. The pass
   leaves it near the end for the operator's `withdraw`. Reopen: a copy
   diverges.
9. **A consumer of the operator's answer to a vertical NeedsHuman.** A
   NeedsHuman ends a run as a typed stop and nothing consumes the answer
   (WO-118's known issue). Reopen: WO-083's run needs the answer consumed.
10. **Target facts in the committed work-order index.** WO-080 renders
    them live from the local registry instead (they would churn across
    hosts). Reopen: a consumer needs them committed.

## Moved from the execution guide (2026-09-28)

WO-167 moved these nine candidates here from product 07 under their slugs.
Each dated paragraph's bold lead became a status word and a bracketed
citation that keeps its date; links are rebased, and two references that
pointed within product 07 now name it. Each register row keyed to the
product 07 heading is a duplicate of the row keyed here. This section
grants no activation authority.

### Candidate — guided operator work orders

Disposed: product 07 §Research and guided-operator work orders is this
candidate's convention, and WO-137 is its first use [vision-into-use pass,
2026-09-17]. The text below is retained as the source.

Operator direction, 2026-09-16: a work-order type should carry guided human
work through the normal workflow. Its purpose is to help the operator reach a
specific result or setup, including ordinary trial and error, and return either
evidence of success or a useful failure artifact. Local inference readiness and
possible LM Studio setup are the immediate example; this is a general pattern
for work that requires operator participation, not a separate informal checklist.

A candidate contract names the desired observable result, starting conditions,
constraints and authority, agent and operator responsibilities, success checks,
and the evidence to retain if attempts fail. The agent proposes the next useful
step from observed results, explains required operator actions, records what was
actually attempted and adapts the next step. Unexecuted suggestions remain
distinct from observations. Preserve progress across pauses and sessions so the
operator can resume the same order. Trial and error is expected learning, not a
reason to restart the workflow or silently expand authority.

Two explicit outcomes are needed: a result/setup that passes its declared check,
or a failure artifact describing the attempted path, observed errors, ruled-out
causes, remaining blocker and a useful next action or reopening condition.
Distinguish an environment limitation or exhausted attempt from a defect in
DotLn. Producing the requested failure artifact can discharge the investigation
deliverable, but never certifies the original setup as successful. Independent
review should judge the evidence appropriate to the declared outcome.

The next planning pass should decide how to express this type using existing
WorkOrders, human-handoff actors, continuation and evidence surfaces, including
how lifecycle status distinguishes successful setup from completed investigation
with failure. Preserve the normal authority, privacy and review boundaries.
No new schema, lifecycle transition or implementation is selected here.

Source: the operator's second 2026-09-16 ideation during WO-051, synthesized in
the ledger and [breakout receipt](../evidence/WO-051/ideation-local-models.md).
Reopen at the next planning pass with local-model readiness or another concrete
operator-assisted outcome. The cost and value question is whether this removes
repeated setup explanation and lost diagnostic work without adding a separate
process the operator must manage.

### Candidate — planner startup context

Operator steering during WO-126 identifies excessive context needed to learn
the repository's purpose and choose the next work. First measure what the
bounded follow-up feed removes. Compare the remaining required reads, context
bytes, commands and wall-clock with a short purpose brief and scoped retrieval
of candidate authorities. The feed may discharge the candidate-selection part;
do not duplicate that implementation or assume it solves orientation to the
product. Preserve scope, sources and rejection reasons while reducing reading.
Reopen in a planning pass if observed startup still requires broad document
loads; settle this candidate with measured evidence if the feed is sufficient.
The operator expressly permits this comparison after WO-126.

Measured: the pass consumed the feed's first page and selected nothing from
it: 283 of the 287 pending rows are the untriaged migration and the three
open items were declined again, as in the two passes before it
[[R1 replan pass](r1-replan-2026-09-16.md), 2026-09-16]. Orientation still needed canonical status, the
sequence, the previous planning document and its ledger section, the three
subject orders, the writing-worker record, the seven closed orders' decision
records and final reviews, and the code surfaces the orders name. The feed
cannot be judged until the register settlement candidate below removes the
migration rows from the pending set; this candidate stays open.

Measured: the first page showed four invalidated dispositions, one open
item, two deferrals and one untriaged row of 371 pending, and the pass again
selected nothing from it; it read the whole register by batch instead
[[cleanup pass](outstanding-cleanup-2026-09-19.md), 2026-09-19]. That pass disposed the pending rows, so the
next planning pass is the first that can judge the feed; this candidate
stays open until that measurement.

Measured: the first page showed six invalidated dispositions and the two
open items, of 149 pending; the pass selected nothing from it and read the
whole register by script, because the 67 rows that mattered were untriaged
and the page orders them last [[standard pass](standard-pass-2026-09-21.md),
2026-09-21]. It also
read canonical status, the sequence, the two 2026-09-20 planning documents
and receipt 021, the decision files of the eleven orders whose rows were
untriaged, the map's two candidate sections, the cost table and the budgets
file before choosing anything. The feed carried real nominations for the
first time (WO-142 row B17's boarded defects), so its content is now right
and its ordering is the remaining friction: untriaged rows should precede
invalidated dispositions when a pass opens, and a pass needs the count of
rows per source order, not a first page of eight. No order is allocated;
reopen at the next pass with that ordering tried, or when the first page
again shows nothing the pass acts on.

Measured: the first page showed three invalidated dispositions, three open
items and two deferrals of 150 pending; the pass selected nothing from it and
read the register by script because the 29 untriaged rows (decision records
from WO-063, WO-064, WO-100, WO-120, WO-151 and WO-152) were paged last
[[closeout follow-ups pass](closeout-followups-2026-09-22.md), 2026-09-22]. Orientation also read
canonical status, the sequence, product 07's planning and ideation sections,
the three same-day planning documents' route and answer sections, the
decision files of six orders, two final reviews, the map's three latest
candidate sections, the queued orders' headers, the budgets file and the
integrate helper's source. The ordering friction stands as recorded above;
one further ask: the first page should say which closed orders contributed
the untriaged rows. Stays open.

### Candidate — recurring review of implementation alternatives

The operator's 2026-09-09 ideation during WO-126 asks for useful alternatives
to surface routinely, automatically or periodically, without depending on an
operator first objecting to a dependency. The build comparison is the concrete
case: questioning the Python prerequisite exposed a cheaper Node-only method,
with a different publication guarantee that the operator explicitly selected.
The general opportunity is to question the method while preserving the purpose.
Avoid treating either dependency avoidance or the fastest measurement as the
answer in advance.

Candidate entry points are a new dependency or process step, measured cost
growth, and occasional review of an existing mechanism. At a selected boundary,
compare retaining the method, removing unnecessary work, and a credible simpler
alternative using the tools already available. State the outcome and guarantees,
measure the relevant resource costs, retain the evidence and rejection reasons,
and identify what would reopen the choice. Guarantee changes still need their
existing authority; an opportunity to ask does not authorize replacing a method.

The existing four process questions and meter supply the questions and signals;
the Entropy Reducer and retained follow-up feed supply possible review and
handoff surfaces. The missing evidence is that they actually provoke useful
comparisons at an affordable cadence. Compare default, event-triggered and
periodic sampling before adding another mandatory review or prompt fragment.
Evaluate discoveries and accepted improvements alongside false positives,
operator interruptions, review time, context bytes, commands and token usage;
also exercise an unchanged case where keeping the method is the right result.
An expensive review that only restates the questions would repeat the process
debt it is meant to address.

Trigger selection, sampling cadence, host binding and implementation allocation
remain open. Reopen at planning when observations can distinguish missed
opportunities from redundant review. No new runtime check, schedule or work
order is allocated by this candidate. Provenance and required review are in the
[ideation receipt](../evidence/WO-126/ideation-alternatives.md).

The operator's follow-up proposes a
[Tinkerer / Scientist support](../product/05-pattern-library.md#candidate--tinkerer--scientist)
that sometimes turns the relevant question, input or proposed response into a
small experiment. A separate support modifier may tune activation rate. This
provides a candidate behavioral mechanism for the review question above; it
does not settle its cadence or imply every answer must run an A/B test.
The second proposed behavior is
[historical comparison after a forced alternative](../product/05-pattern-library.md#candidate--historical-comparison-after-a-forced-alternative):
when a constraint or decision produces another method with roughly the same
purpose, retain comparable observations even if the immediate choice is settled.
Automatic activation versus optional equipment remains open. This records the
benefit obtained incidentally in WO-126 as an intentional future behavior.

### Candidate — cold-gate structural cuts

The 2026-09-12 planning pass declined to allocate the structural cuts that
the relayed proof-carrying-gates plan proposed for the one fresh full gate,
because their benefit is unmeasured until the gate's critical path is
recorded. The 2026-09-12T16:08Z fresh gate ran 475 s of wall-clock over
1,229 s of task time: the two exclusive suites held it at concurrency one for
206 s, and perfect packing over the cap of four would take 307 s. WO-128
records each task's concurrent peers in the gate row; that trace is the entry
evidence for this candidate.

WO-128's [first accepted shared row](../evidence/WO-128/shared-series-002.json)
now supplies that evidence: 689.520 s wall-clock, 2674.262 s
of task time, and a 688.383 s observed scheduler chain. Its
largest chain node is `plan-refutation:fixtures` at 523.842 s;
the [complete offline trace](../evidence/WO-128/diagnosis.md#accepted-shared-series-and-deadline-comparison)
retains every edge and visible wait. Five shared passes keep the exclusive
flags removed, but their median 694.561 s exceeds the exact earlier
476.304 s gate. This is reliability evidence and a measured entry point for
planning, not an allocation or a demonstrated structural speedup.

The cuts, each measured before allocation: copy-on-write clones of the sealed
release template and other prepared fixtures where the filesystem supports
them (`scripts/lib/release-fixtures.mjs` copies two repositories into forty
case directories today; the copy time is unmeasured); splitting the
`worktree`, `resume`, `skeleton` and `plan-refutation:fixtures` tasks into
schedulable cases with their own temporary roots, as WO-126 did for the
release cases; extracting pure decision logic from the lifecycle, release and
worktree shells so each policy permutation stops paying for a fixture
repository, with a model-based check of the lifecycle's legal and illegal
sequences and a retained black-box Git conformance set; and sharding across
machines, which does not reduce total compute and cannot help an indivisible
task. Removing tests is not a cut: a test is removable only when a stronger
instrument subsumes its unique detections, which the mutation corpus
(WO-108) measures.

Reopen at a planning pass when a recorded trace names the node that bounds
the gate after WO-128's exclusivity decision, or when the meter reports three
consecutive worsening gate deltas. No order, number, sequence position or
activation authority is allocated here.

Superseded: the recorded 2026-09-15T04:10Z gate names the bounding nodes:
the machinery's own suites (harness fixtures 145 s, process debt 143 s,
runner fixtures 135 s isolated, plan-refutation fixtures 69 s) on a
lane-saturated schedule, while the longest suite numbers (console, release,
plan-refutation) were spans between split tasks
[[machinery stand-down pass](machinery-stand-down-2026-09-15.md), 2026-09-15]. The machinery
stand-down pass removes that share from the default gate and runs the gate
once per order instead of cutting its fixtures
([WO-132](../work-orders/WO-132-machinery-stand-down.md) criteria 4 to 6).
Reopen only if the once-per-order `npm test` exceeds six minutes fresh after
that inventory split.

Reopening observation: the seventeen final-review product gates recorded in
`docs/control/orders/` since 2026-09-16 ran 303 to 1,178 s, median 793 s;
sixteen exceeded six minutes [[cleanup pass](outstanding-cleanup-2026-09-19.md),
2026-09-19].
The cause of each (suite selection, host load, an integrated sibling) is not
analysed; the gate rows this pass could read carry a total and no per-suite
durations. The `fastGateMs` ceiling of 120 s was WO-126's budget for a fast
gate that WO-132 removed; the metric has since read the one full product
gate, so the same day's second pass unset the ceiling in
`docs/control/budgets.json`. Nothing is allocated: an order that shortens the
gate needs the per-suite breakdown first, and none is recorded.

Re-measured: the thirteen final-review product gates recorded from
2026-09-19 to 2026-09-21 (WO-142 to WO-069) ran 256 to 536 s, median 483 s;
eleven exceeded six minutes [[standard pass](standard-pass-2026-09-21.md),
2026-09-21]. The `FinalReviewCompleted`
gate row still carries `durationMs`, a code identity and an exit code and no
per-suite durations, so the same reason holds: nothing is allocated until a
breakdown is recorded. The meter's drift signal flagged the gate's step count
rising 65, 72, 73, 74, 80 across WO-090 to WO-069 as a reopen candidate; each
order added suites or cases, so the count is planning input for this
candidate, not a hold. The candidate stays open.

WO-156 planning-check cut: resolving the work-order root pattern once per
subject call reduced the fixture's `statSync` calls from 543 to 10 while
preserving its subject JSON [WO-156 executor measurement, 2026-09-24]. On this host,
`node scripts/refute-plan.mjs check` fell from 17.86 s to 2.85 s and the
`test:docs` `plan` and `plan-refutation-current` tasks fell from 25.27 s and
25.20 s to 3.25 s and 3.19 s; the full document gate fell from 30.80 s to
24.41 s because other tasks still run concurrently. Those initial figures
missed the 2 s bound and led to VER-001 and the operator-authorized repair.
The repair batches immutable Git reads and caches unchanged normalization
within 512 entries and 1 MiB of string storage. The first repair measured
1.799–1.823 s versus 3.121–3.177 s with the pre-repair sources, with identical
stdout and 98 Git launches versus 242. VER-002 then found optional-prefetch
and aggregate-buffer regressions. Their correction measured 1.657–1.667 s
versus 2.792–2.824 s on the same tree, with identical stdout and 104 launches;
the six additional historical fallback reads preserve accepted inputs. Its
`test:docs` plan tasks took 1.90 s and 1.81 s. The [WO-156 decisions](../evidence/WO-156/decisions.md)
and [repair evidence](../evidence/WO-156/repair.md) preserve the comparisons,
refusal checks and reopening conditions. This local measurement does not
assign a new structural cut to the broader product gate.

Console collection is the gate's critical path: with the plan tasks under
2 s, `console-docs` runs 20.06 s of a 24.81 s `test:docs`: 101 sequential
`resume status` forks (12.8 to 13.3 s) and one `release list` of 5.2 to
5.6 s over 1,050 Git spawns, linear in tag count [REVIEW-003 ER3-002,
reproduced by REFUTATION-004, 2026-09-25]. Allocated to
[WO-164](../work-orders/WO-164-constant-process-console-collection.md);
the 2026-09-19 deferral's reopening observation has occurred.

WO-164 after figure: `resume status --all --json` folds every order in one
process and `release list` caches per-tag records in the ignored local lane,
so collection runs four node processes whatever the order and tag counts
[WO-164 executor measurement, 2026-09-27]. With 113 orders and 104 tags,
`collectSources` fell from 21.2 s to 2.43–2.47 s cold (the first
implementation's 6.2 s failed VER-001) and 0.67 s warm, with identical board
bytes. `console-docs` fell from 22.50 s to 3.53 s cold and the cold
`test:docs` gate from 31.42 s to 13.37 s, now led by `docs-check` (8.46 s).
The [WO-164 decisions](../evidence/WO-164/decisions.md) and
[timing record](../evidence/WO-164/timing.md) keep the figures and reopening
conditions.

### Candidate — refutation pass worth its cost

The 2026-09-12 planning pass paid three direct-session refutations of one
subject, all holds: 2,454 s, 833 s and 333 s of recorded dispatch-to-file,
and more of operator wall-clock, with the third hold overridden by the
operator as a known issue. The holds were logically valid counterexamples to
contract wording; none changed the platform the orders build. The operator's
direction is recorded: the point is to create a platform, not to prove every
constructible case before filing, and the refutation pass must be made worth
its cost before a later pass pays it again.

The next planning pass measures the refuter's yield against its cost from the
receipts and the meter (dispatch-to-file, tokens, holds whose repairs changed
a criterion an executor later relied on, holds overridden) and selects one of:
a bounded refuter scope that judges an order's platform claims and cost
declarations rather than adversarial completeness of every contract sentence;
a hold budget per pass after which findings are recorded as known issues with
reopening conditions instead of stopping the pass; a refuter prompt that
carries the operator's platform-first standard; or retiring the pass-scoped
refutation in favour of the full-scope one at release boundaries. Any change
to the refuter's rules or the gate needs its own order; this candidate
allocates none.

Reopen at the next planning pass, or when a refutation's third consecutive
hold stops a pass again. No order, number, sequence position or activation
authority is allocated here.

Resolved: the machinery stand-down pass measured the yield: receipts 009 to
012 held four times on constructed counterexamples at 2,454, 833, 333 and
755 s, two holds were overridden, and one overridden hold was re-raised by
the next receipt and re-imported as scope, producing a design that failed
verification and was removed
[[machinery stand-down pass](machinery-stand-down-2026-09-15.md), 2026-09-15]. The pass selected the
bounded scope and changed the hold semantics together: the refuter judges
goal alignment, system traps, constraint removal and antifragility from the
Cost line, the meter and the critical path; only an observed failure or a
vision contradiction holds; a constructible counterexample is a known issue;
one judgment per pass, no third-hold stop, no budget refusal, and a
disposition binds the criterion text. Allocated to
[WO-132](../work-orders/WO-132-machinery-stand-down.md) criterion 11; this
candidate closes on that order's merge.

### Candidate — follow-up register settlement

The register holds 297 entries with 283 untriaged (2026-09-16). Two
mechanisms fill it: the migration harvested every historical candidate
heading and NoOp bullet as a pending row, and every per-order decision
record is harvested as a follow-up although a decision with a
`reopenWhen` observation is a record, not an action. Three planning passes
have selected nothing from the feed. A later pass may spend one session
settling the migration rows as historical, and may change the collector so
a decision record enters the feed only when its reopening observation has
been recorded. No order is allocated; reopen at a planning pass that has the
session to spend, or when the pending count exceeds three hundred.

Measured: 359 entries, 348 pending, 344 untriaged; the 62 entries added
since the R1 pass are 45 decision records, four ideation candidates, fifteen
defect-register items and one NoOp bullet, and every one was untriaged until
this pass disposed the candidates and the register items it decided
[[vision-into-use pass](vision-into-use-2026-09-17.md), 2026-09-17]. The pending count crossed
three hundred by harvesting decision records, so the threshold rises to
four hundred; the collector change stays the candidate's substance.

Settled and allocated: 399 entries (235 decision records, 164 candidate
rows), 371 pending, 364 never triaged (228 decision records, 136 candidate
rows) [cleanup pass, 2026-09-19].
The operator budgeted the session this candidate asked for. Eight read-only
batch surveys classified every pending row against `main` at `3b3533f8` and
the pass disposed them; the counts and the rows that carried real work are
in [the planning document](outstanding-cleanup-2026-09-19.md)
§2. After it: 417 entries, none untriaged, five open and 76 deferred with
reopening conditions. The collector change is
[WO-142](../work-orders/WO-142-outstanding-cleanup.md) row A1. Reopen if
untriaged rows pass fifty after WO-142 closes.

Implemented in WO-142: a decision enters the pending feed only when it
names a `followup`, or another decision records an observed reopening
through `reopens.decisionId` and `reopens.observation` [WO-142, 2026-09-19]. A
`reopenWhen` condition by itself creates no action. The decisions index still
lists every record; existing register entries, identifiers and history are
retained. Executor, verifier and reviewer role text now requires an encountered
defect to be fixed inside the Boy Scout bound or boarded up as a decision
record naming its follow-up, cited by the report. The collector change and
before/after observations are recorded in
[WO-142 evidence](../evidence/WO-142/README.md) and its
[decisions](../evidence/WO-142/decisions.md). The next planning pass's feed
size and untriaged count are the reopening observations; the fifty-row
threshold above stays in force.

Reopening observation: 486 entries, 149 pending, 67 untriaged after WO-142
closed: 65 decision rows from eleven orders closed on 2026-09-19 to
2026-09-21 and two planning candidates [standard pass, 2026-09-21].
The threshold fired for a different reason than the migration refill it was
written against: the rows are B17's boarded defects and the collector is
doing what WO-142 made it do. Inside them, 16 are in-order repair directives
(a verifier's `followup` beginning "In resume: fix" or "Repair ... VER-001
F<n>") that the order's own repair cycle discharged before it closed, two are
decisions reopened by those repairs, and four are final-review routings the
review discharged; all 22 were settled by this pass with the closing evidence
named. The remaining 45 were settled, allocated, deferred or left open one by one
([the standard-pass planning document](standard-pass-2026-09-21.md)
§3). The `followup` field therefore carries two things the feed cannot tell
apart: routing inside an order and a nomination that outlives it. No
collector change is allocated; the smallest fix is role text (a verifier
names in-order routing in the decision and the report, and reserves
`followup` for what outlives the order), which is a bundle regeneration for
the next order that edits the verifier role. Reopen when the next planning
pass counts more than ten discharged in-order directives in its untriaged
rows, or when untriaged rows again pass fifty.

### Candidate — local lane retention

Ignored local lanes grow without a rule: 13 immutable harness runtime
snapshots (34 MB), 36 MB of hook journals and 31 MB of retained close lanes
on 2026-09-16. A retention rule may remove a snapshot no installed manifest
pins and a retained lane older than its order's published release, keeping
the retained-lane byte proofs. No order is allocated; reopen on disk
pressure or when the snapshot count exceeds twenty.

Reopened and allocated: 27 snapshots (80 MB) with one pinned, 99 MB under
`docs/control/local/`, and 96 MB under `.git/dotln/suite-success`, which no
source has written since WO-132 removed the suite-success cache
[[cleanup pass](outstanding-cleanup-2026-09-19.md), 2026-09-19]. Allocated to
[WO-142](../work-orders/WO-142-outstanding-cleanup.md) row D1: an on-demand
prune that lists before it deletes.

Implemented in WO-142: run `node scripts/harness.mjs prune` to list
removable paths, byte totals and reasons for retaining other paths; this
form writes nothing [WO-142, 2026-09-19]. After reviewing
the listing, `node scripts/harness.mjs prune --apply` removes only candidates
whose ownership and byte inventory still match a fresh observation. Installed
manifests and target installation receipts across registered worktrees protect
their snapshots, including targets in separate repositories. A live gate,
another live or unknown writer, unreadable pins, current or live session
ownership, and missing session-end observations retain the affected files;
legacy advisory markers without session ownership are retained. The dead
suite-success cache is eligible only without a live gate. The `release list`
cache is listed as retained and never removed: each listing rewrites it to the
current tags, and subject teardown disposes of it (WO-164).

A retained order lane is eligible only after its worktree is gone, a
non-draft published Release and matching remote tag establish publication (one
listing of each per run), and the order's committed `meta.json` names the SHA-256
of any usage copy it holds. The command first keeps a sibling `WO-NNN.bytes-<digest>.json`
inventory of paths, modes, byte lengths and SHA-256 hashes, then removes the
lane; a stopped apply resumes when run again. Symlinks, special files and nested
repositories are retained. This is an on-demand
command, not a new recurring check. The real-checkout listing, before/after
sizes and fixture evidence belong to
[WO-142 evidence](../evidence/WO-142/README.md) and its
[decisions](../evidence/WO-142/decisions.md). Reopen on disk pressure or an
observed retained candidate that the documented ownership/publication rules
cannot explain.

### Candidate — stale writer reservation self-diagnosis

WO-050 VER-001 observed a Codex executor's reservation outliving its
session with `liveness: unavailable`, refusing every shell command of the
next session including `node scripts/harness.mjs writer --show`, until an
operator released it from a terminal. The kept invariant was right; the
diagnosis path was not. The stand-down declined a shell classifier. The
original candidate awaited a second observed occurrence.

Substance shipped: WO-139's commit `3ea00e50` releases the executor's writer
at completion (`scripts/lib/executor-handoff.mjs`; `scripts/resume.mjs`
`executorWriterRelease`), and the hook admits
`node scripts/harness.mjs writer --show` among its repository commands
(`packages/skeleton/src/harness-host.ts`) [2026-09-18, recorded by the
[cleanup pass](outstanding-cleanup-2026-09-19.md), 2026-09-19]. The reopening condition was met the
other way round: three Codex sessions after WO-155 (WO-156's repair, WO-161's
implementation and repair) found no reservation at dispatch, because
`beginHarnessSessionOnce` reserves nothing while the role text describes a
reservation completion releases; two reserved by hand mid-phase and one handed
off unreserved. Frequency is unknown (worktree journals are discarded at
teardown). WO-166 makes the five Codex lifecycle dispatches reserve before a
control event can be appended, using a verified Codex ancestor or a pid-less
thread owner whose liveness remains unknown
([2026-09-25 standard pass](standard-pass-2026-09-25.md) §3).
Executor, verifier, reviewer and release-close completion release only their own
reservation after the durable result. A release-close handoff from the subject
checkout directs the new main session to dispatch there, so the session that
runs the helper owns and releases main's writer. Every foreign-writer refusal
names the holder, owner, reservation time, age and operator release command,
including `--force` for a live owner; `writer --show` remains available for
diagnosis. An open operator override is reported once at the next session start
in the same worktree. `node scripts/harness.mjs evidence --wait [--timeout <seconds>]`
exits with the recorded gate outcome or a timeout; run it in the background under
Claude Code. The killed Codex session still needs the operator release route when
its owner cannot be proven dead.

### Candidate — total subagent cap across every spawn path

Operator direction, 2026-09-17: a session's total subagents need a hard,
configurable cap (about twenty), because a top-level guideline of five fans
out through per-item adversarial and refutation trees to more than a
hundred. The harness documents no total cap, only a size guideline, a
concurrency ceiling of sixteen and a per-workflow limit of a thousand; its
hooks fire for the Agent and Workflow tools and inside subagents. WO-139
counts and refuses at the admission points the hook can see and counts
descendants at their first attributable tool call, so an agent the harness
creates before any hook fires is counted late or not at all, and Codex's
`spawn_agent` fires no hook in the recorded profile. The 2026-09-18
[WO-139 probe](../evidence/WO-139/README.md) observes Claude 2.1.276 sharing
`session_id` and supplying distinct `agent_id` values for direct and workflow
children. Direct Agent results join that identity to `tool_use_id` when the
result is observed, including immediately for background spawns. Probe 2 also
observed `SubagentStart` carrying `session_id` and `agent_id` before each
child's first tool call; no hook is registered for it and its ability to deny
is untested ([WO-139 review, items 5–6](../final-reviews/WO-139/FINAL-002.md)). During unresolved overlap the counter reports a minimum
distinct count, preserving every observation and excluding children seen
before a later spawn; it never invents a parent link. For example, two
unresolved direct admissions and two later workflow children can represent
four agents while the minimum is two. Agents created before their first
hook, silent agents, unknown identities, unreadable counters and this
unresolved overlap remain outside an exact total guarantee. The requirement that remains open is a
guaranteed maximum across every path: admission before creation, including
descendants and concurrent spawns. No order is allocated for it; the
Contributor's batching rule is the interim control. Reopen when the harness
documents a pre-creation admission hook or a total-cap setting, or when a
session exceeds the cap on a path WO-139 reports as uncounted.


## Moved from the roadmap (2026-09-30)

WO-087 moved the following candidate and capability-policy sections from product
06 with their headings, slugs and wording preserved; only relative links are
rebased. The roadmap holds the release ladder and generated release history.
The register retains the former rows as duplicates of their entries here.
This move grants no activation authority.

## Work-order navigation and identity (candidate)

The current control projection answers one narrow question: given a selected
work order and its independently folded phase, which lifecycle transitions are legal now?
It does not answer which backlog order should be activated after close. The
release ladder, hard dependency graph, adjacent evidence/corpus work, and
operator preference are distinct planning inputs and must not be collapsed into
the next integer.

Keep three answers visible:

1. **Workflow legal next:** the transition allowed for the selected order, such as
   verify, repair, or final review.
2. **Eligible now:** every candidate whose hard dependencies, activation
   prerequisites, authority, environment, and exclusive-resource constraints are
   satisfied.
3. **Recommended next:** the eligible choice selected by an explicit planning
   policy or by the operator, with the reason and alternatives retained.

Existing `WO-NNN` identifiers are stable, opaque references. They do not encode
priority, roadmap position, or family, and numeric gaps carry no meaning. The
completed/drafted WO-10x orders therefore remain addressable under their current
IDs; mainline work never has to “catch up,” and activated or historically cited
orders are not renumbered. Future grouping belongs in explicit metadata and
views. WO-120 reserves a configurable allocation pool (`WO-900`–`WO-999`
by default) for machine-filed identities inside this same family; it carries
no priority or product track. Existing authorities in the pool are skipped,
never renumbered or overwritten.

**Derived work (WO-120).** `WorkOrderIdentityAllocated` starts a per-order
control segment before the generated authority appears. It records the stable
public provenance key, assigned compiled `workOrderId`, contract snapshot and
authority path. A retry with the same key and input recovers that identity;
changed input under that key refuses. The index scans both configured authority
roots, retains correct relative links and distinguishes allocated drafts from
active work. Activation is the ordinary dependency-checked `resume activate`.
`dotln intent` files only a draft, with review placeholders where prose supplies
no executable contract. Generated files use stable sections and typed dependency
blocks; WO-113 still owns the broader historical-file migration.

The allocator reuses the inspected worker lock at the shared launchpad. Its
collision guarantee applies to callers using that launchpad, not independent
or disconnected checkouts. Allocation replay, two-process contention, range
exhaustion and a fixture resident restart are covered by
`scripts/test-derived-orders.mjs`. Automatic work derivation and UI filing
remain WO-100/WO-115 consumers of this interface.

A provisional planning row should be able to show:

`id | title | purpose/track | planning state | lifecycle evidence | hard dependencies | activation prerequisites | eligibility reason | recommended rank/reason | execution role | model/effort/environment constraints | affected surfaces | release relation`.

Lifecycle evidence remains derived from the control log, numbered verification
and final-review artifacts, merge evidence, and release/no-release records—not a
manually asserted `complete: true`. “Implemented,” “verified,” “final-reviewed,”
“merged,” and “released/no-release” are different boundaries. Likewise, worker
role is distinct from model, effort, harness, and required capabilities;
dependency is distinct from a preflight such as version assignment,
authentication, provisioned dependencies, or a quiet-machine window.

**2026-09-04 migration (WO-026):** the evidence view is adopted; the broader
metadata and scheduling design remains a candidate under this stable heading.
The pilot's repeated evidence drift is now
addressed by the [generated work-order index](../work-orders/README.md).
Work-order files retain their paths as durable addresses. The index observes
their headers, reduces every order through the shared control fold, and
attributes release inclusion from local annotated manifests, with the explicit
pre-manifest v0.2.0 record. It distinguishes all in-flight orders, open drafts,
control-closed orders, and time-indexed history. Closed means the applicable
passing final review, not independent proof of merge or remote publication.

The index is the evidence-state answer; the [human map](../planning/work-order-map.md)
keeps recommendation, rationale, tracks, and activation preflight.
**2026-09-11 typed dependency migration (WO-043):** a marked JSON array in
each open authority's leading metadata declares dependency relations and
one-line reasons. `scripts/lib/dependencies.mjs` supplies the same projection
to the index, selected `status --json`, and activation. Hard and
satisfied-by-close entries require closure with a passing final review;
satisfied-by-release requires a local annotated DotLn release in HEAD's
ancestry. A planning deferral waits for the named order's closure, or remains
unmet for a candidate label until replaced by a dated waiver. Historical
evidence, references, waivers and supersessions never block.

This computes the dependency part of **Eligible now**. Authority, environment,
exclusive resources and other activation prerequisites still need preflight;
the operator or planning policy supplies **Recommended next**. Closed and
historical authorities retain their bytes. Without a typed block, their
Depends on tokens are labeled **conservative token view; does not block**.
The [migration comparison](../evidence/WO-043/migration.json) preserves the
seed graph and prose comparison, including later supersession decisions.
The earlier [activation comparison](../planning/work-order-index-activation-2026-09-04.md)
remains a dated observation of the token view.

`npm run work-orders -- index` explicitly refreshes the generated view.
`index --check`, included in `npm run test:docs`, checks current headers/control against
the recorded tag-object snapshot; missing or changed recorded tags refuse, and
additional local release tags are reported as newer attribution evidence.
Typed release dependencies observe current local ancestry, so a referenced
tag becoming available or unreachable can stale their projection. The operator
selected this snapshot rule so tagging a reviewed commit does not invalidate
its own reproducible evidence. No command fetches tags. Refresh after lifecycle
transitions before running evidence; lifecycle helpers do not regenerate the
index. Standardized front matter, a separate registry, a scheduler, and automatic
recommendation remain unselected candidates.

**2026-09-04 usability correction (WO-020 ideation):** the operator's reading
task is to follow a proposed sequence and see progress, including in a plain
text editor. The README therefore leads with a short checklist sourced from
one marked recommendation block in the human map. It derives its check marks
from passing final review, labels the active phase, and puts full per-order
evidence below the first screen. The checked state is not proof of merge or
publication. Detailed dependency-token observations retain their conservative
label; the generator must not turn prose references into false hard blockers
or silently reorder the operator's recommendation. A missing or malformed
sequence block, duplicate IDs, or IDs without an authority refuse. An explicitly
empty block means no proposed sequence. No work-order ID, authority path, or
historical evidence moves.

### Candidate — whole or split work orders under one umbrella

**2026-09-05 operator ideation:** offer a split assessment for any work order.
Keep its outcome, scope, and acceptance criteria visible under one umbrella,
while proposing smaller, independently reviewable increments. The purpose is to
let one body of work produce several useful PRs without losing its shared
intent or evidence trail. A split is optional: an already atomic order may be
best left whole, and an arbitrary partition should not be recommended merely
to reach a requested number of children.

Before execution, the whole order and a proposed child plan are alternative
routes. Both can be available to choose; their execution is mutually exclusive.
Starting the whole route excludes its alternative children. Starting the first
child selects the split route and permanently excludes execution of that
original whole-order route, including after a child fails or is abandoned. The
parent remains addressable as the umbrella; its aggregate status must not claim
that the original whole-order implementation ran. Planning or previewing a split
alone does not select it.

Hierarchy and execution order answer different questions. Children may be
serial, parallel, or a mixture, according to explicit dependencies, shared
surfaces and resources, available actors, and capacity. For example, two
independent increments can proceed together and a third can wait for both.
Each child retains its own workflow and evidence; the umbrella maps its
acceptance criteria to those increments and exposes uncovered work. Child
review, integration, release, and completion of the umbrella remain separately
evidenced. A family of orders does not make all its work safe to run at once.
This extends the [budget-window ladders](#candidate--budget-window-work-order-ladders)
and the [UIFA showrunner's](../product/13-uifa-roles.md#uifa-showrunner) planning view.

A useful suggestion explains the proposed acceptance boundaries, dependency
edges, expected review size, integration risks, and why the split helps. It may
recommend keeping the order intact, or a different number of increments.
Suggestions stay non-authoritative until selected under the applicable dispatch
policy. Smaller increments do not require changing this repository's current
commit or PR convention as part of the ideation.

Parent and child relationships belong in explicit metadata. A suffixed child
label is a possible display affordance; it does not replace the existing opaque
`WO-NNN` identity contract, renumber historical orders, or establish priority.
Planning still needs to define the exact route-selection event and its atomic
exclusion across worktrees, active/completed-order split requests, nested or
revised decompositions, failure/abandonment handling, aggregate closure, and
release attribution. Existing evidence remains immutable through those choices.
No child-ID grammar, lifecycle event, split command, scheduler, or automatic
suggestion mechanism is implemented by this candidate; WO-030's concurrent
control state is a foundation, not an implementation of splitting.

### Candidate — beacon usefulness checkpoint

WO-020's exact decoding, replay, metadata-only reading, and atomic emission
can establish the local mechanism. WO-021's lifecycle integration, audiences,
staleness, and group projection can establish a usable control-plane example.
Neither demonstrates that all of DotLn is viable or that Protíno's simulated
world is compelling. Technical feasibility, practical usefulness, and felt
interest are different questions with different evidence.

The [bounded comparison plan](../planning/beacon-usefulness-checkpoint.md)
nominates an operator trial after WO-021: answer the same work-state questions
with existing status projections and with Beacons, using normal, refused,
stale, absent, and conflicting-claim cases. Observe correctness and navigation
burden; record any measured cost with its method, and leave subjective value
to the operator's witnessed response. Retain, simplify, or defer further
investment based on that comparison. A passing codec test is not evidence of
delight, and an elaborate encoding is not justified merely by being possible.

This is a proposed product-learning checkpoint, not a newly imposed release
gate, a runtime telemetry requirement, or an expansion of WO-020/WO-021's
technical acceptance criteria. Real worker behavior arrives in WO-009,
independent real verification in WO-010, feedback in WO-011; a representative
end-to-end trial is still needed to judge the work-system thesis. Protíno
needs its own playable evidence slice at its separately selected horizon.

**2026-09-05 technical observation:** WO-021 now exercises the workflow and
records [bounded scan comparisons](../evidence/WO-021/README.md). Individual
metadata sweeps beat separate compact JSON records in the measured large warm
fixture, while a single JSON index stayed faster through four readers. A
single group metadata read is a different, phase-count-only query. These
results preserve useful read-path choices without claiming an operator trial,
lower token cost, or general scalability. State-selected function tables and
cached/shared observers remain design options; metadata scans have no
invisibility guarantee. The operator comparison above remains outstanding.

### Candidate — unattended work-order portfolio

The predecessor `v1` needed the operator to drive each interaction with one
prompt-bound agent. A recurring cron trigger was an early way to avoid idle
time during absence. DotLn now gives a dispatched work order explicit phases
and status, so its work can progress during the operator's absence under the
current workflow. The remaining opportunity is automatic selection and
advancement of *subsequent* eligible work orders without a new human dispatch.
An absence curve should govern that future portfolio choice and pace, rather
than serve as the mechanism that keeps an already-dispatched order running.

An opted-in portfolio has two candidate lanes. First are small eligible orders
already covered by standing authority and requiring no new material decision;
housekeeping often fits because it can reduce return-time reorientation. Second
is a bounded set of larger-authority orders the operator explicitly
preauthorizes before leaving. Those are options, not a promised sequence:
“capacity permitting” is implicit unless an order is marked required, and
dependencies, source revision, environment, budget, active window, verifier
capacity, and the selected planning policy still participate in activation.

Operator silence alone does not create the portfolio. A versioned policy says
whether an away event or lack of new ordering activates it, which planning
strategy ranks it, how many slots it owns, and what return, pause, expiry,
failure, or budget event stops, resets, or replenishes it. Selection does not
grant authority; a larger order's grant comes from its recorded
preauthorization or standing regime. A return view distinguishes completed,
active, skipped, blocked, and still-optional work and foregrounds material
changes and unresolved decisions.

The current one-slot resume protocol remains manual and authoritative. No
automatic allocator, approval phrase, queue schema, or concurrency model is
selected by this candidate.

**Allocated to WO-100 (2026-09-22).** The preauthorized lane now exists at
resident scale. A portfolio declared under `portfolios` in `dotln.config.json`
names the compiled 5S mechanics, repository surfaces, an effect and file
ceiling per presence phase, a budget of episodes, wall time and reported
tokens, and per-kind verification commands. The resident derives one bounded
order per WO-119 candidate, records its activation with a `host-policy` grant,
materializes it through WO-120 into the ordinary index, and advances its
presence curve only after WO-052 changes it and WO-054 passes the portfolio's
named verification commands (a Sort move is also checked by the host); out-of-portfolio
candidates become product suggestions or `NeedsHuman`, and a spent budget is a
reasoned NoOp ([WO-100 decisions](../evidence/WO-100/decisions.md)). Still
candidate here: activation policy beyond the compiled presence curve, slots and
ranking across orders, replenishment, retry and the return view. The first
lane (small orders under standing authority) is not implemented.

**WO-111 live rung observation (2026-09-24).** In a scratch target with no Git
remote, one human-marked [window](../evidence/WO-111/receipt-v2.json) discovered six
imperfections and completed three derived, independently verified source
changes through probe, widen and peak. A separate mission resident judged the
DotLn worktree and correctly recorded `contract:surfaces` drift; its hold did
not affect the portfolio. A [second window](../evidence/WO-111/return-receipt-v2.json)
left a fourth candidate eligible and one episode unspent before human return
cancelled its future dispatch in retained-log replay; the caller itself stopped
before the due time. No live in-flight return was exercised. Both windows
changed the user Codex configuration by adding scratch trust entries. The
operator [accepted this disclosed deviation for the synthetic proof](../evidence/WO-111/decisions.md#wo-111-d020)
and retained an independent runtime isolation follow-up; literal
outside-portfolio containment was not observed. The two windows show bounded progression,
peak reset and return behavior, not a full hour requirement or the whole
Blackjack +3 curve. This fixture skips the useful descending half: the
operator's intended shape narrows work after the peak until it reaches the
smallest chunk, then resets and repeats while absence continues. The timing,
work types and net-benefit curve across longer windows remain experimental.
The full-curve test and an owner-repository portfolio remain later work.
The current manual resume protocol and this scratch portfolio do not establish
the future automatic work-order allocator.

**Always-on agent model default (shipped by WO-157 on 2026-09-22, operator
direction).** A resident bound without `--model` or `--effort` takes its
transport's default: `gpt-6-luna` for `codex-cli-exec` and the latest Claude
Sonnet for `claude-cli-print`, recorded as the id the CLI reports
(`claude-sonnet-5` until Sonnet 5.5 is available), both at `xhigh`. The
binding record's `modelSource` and `effortSource` say `default` or
`operator`, so a receipt can tell a default from a choice
([WO-100-D007](../evidence/WO-100/decisions.md#wo-100-d007);
[WO-157 decisions](../evidence/WO-157/decisions.md)). Portfolio execution
hosts are bound in process by their caller and take no default from this
command. Reopen when Claude Sonnet 5.5 is available (the Claude default moves
to it), a default model is withdrawn, or the operator changes a role default.
External calls that name a model today use Opus 5.5 `xhigh` in place of
Fable 5.1 and GPT-6 Sol in place of GPT-6 Astra.

### Candidate — budget-window work-order ladders

The operator prefers concentrating useful work early in available usage windows
so the remaining period can be spent on other activities. Preserve a control
state machine supporting **zero to many concurrent work orders, each with its
own declared workflow steps**. A single ladder and a two-ladder batch are trial
capacity settings. Orders may occupy different phases and advance independently;
steps and legal transitions remain governed by each order's pinned workflow
and evidence contract. The initial role preference is Codex implementation,
fresh Opus 5 verification, and fresh Fable final review, with one writer per
worktree and model/effort assignment per order.

The [concrete candidate plan](../planning/budget-window-work-order-ladders.md)
splits the existing horizon into Beacons/Senses and Artifact Identity/Runtime:
after WO-020, pair WO-021 with WO-029, run WO-009 at the join, then consider
WO-022 with WO-010 before WO-011. It preserves hard dependencies and marks
planning preferences separately. Its original executable one-order
control-fold limitation is superseded by WO-030's per-order segments and real-Git
integration fixture. That bounded slice preserves attribution and release
readers; different workflow definitions and a measured paired wave remain
future evidence. A
[Fable planning handoff](../planning/budget-window-work-order-ladders.md#fable-planning-handoff)
asks for bounded enabling work orders and rules that derive lanes from
dependencies, conflicts, available actors, and capacity. The planner chooses
compatibility per affected surface, including a versioned computed/cached
mapping when useful under product 10's declared compatibility laws.
No automatic allocator or concurrency schema is implemented by this proposal.

Public contributions can use the same independent tracks. A shared projection
should show every known order's current declared step, blocker, evidence, and
freshness; a release view should identify the reviewed changes included in each
published release and lead back to the corresponding orders. Completion,
integration, and publication are separately evidenced facts. The current
generated index and immutable release manifests provide a foundation; the
per-order control model is implemented in WO-030's source, while
contribution-to-order mapping remains planning work.

Extend declared dependencies and recommended order to tenant-scoped tracks.
The scheduling view combines per-track plans with cross-track prerequisites,
shared conflicts, and capacity; readiness changes when their evidence or base
changes. The planner must define tenant/track ownership, scoped visibility and
authority, and the treatment of shared reserves and blocked work. A track
boundary cannot erase another track's prerequisite or advance its lifecycle.
The meaning of tenant and the storage/schema representation remain open.

The operator also wants an observation and admission policy that distinguishes
open tracks, admitted orders, active steps, and useful completed throughput.
When a downstream step is the constraint, limit or pause upstream production
at a declared safe boundary instead of growing waiting work. Recorded queue,
age, completion, capacity, and reserve observations inform per-step/track/global
limits and explicit resumption conditions. The resource-pressure candidate
provides a composition point; the first monitor, thresholds, freshness policy,
fairness, and moving-constraint behavior are planning choices. A bounded trial
should show a constrained verification step throttling implementation and
resuming it when capacity returns. No automatic monitor or pause exists yet.

Measure completed reviewed work, integration repair, total elapsed time,
operator involvement, and uninterrupted time away. Runtime policy consumes
observed allowance, window, model availability, and reserve inputs. The earlier
resource-pressure candidate can prioritize an early completion batch instead
of universally conserving routine work. Trial feasibility and benefit remain
open; no new order is activated or added to the default sequence.

The 2026-09-05 horizon ran serially, so the trial did not occur. The
2026-09-06 planning pass schedules the first measured paired wave as phase
two's wave 1 (WO-032 ∥ WO-033), records the manual sync procedure for the lane
whose sibling merges first, and files the sync helper inside WO-033; the
[phase-two plan](../planning/phase-two-plan-2026-09-06.md#concurrency-what-is-safe-what-is-untested-and-the-procedure)
holds both.

## Capability progression policies

The application ladder is one release view. Inside and across its rungs, DotLn
can treat each feature, integration, projection, pattern, or operational
capability like a skill that advances through evidence-backed levels. This makes
several implementation strategies explicit rather than letting whichever feature
is most exciting consume the whole roadmap.

Candidate capability levels:

| Level            | Meaning                                                    | Minimum evidence                                                                 |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 0 — latent       | named idea or need; no usable behavior                     | source and intended outcome                                                      |
| 1 — demonstrable | thinnest coherent behavior exists                          | bounded fixture or witnessed example                                             |
| 2 — dependable   | normal path and important failures behave predictably      | automated checks and repeatable evidence                                         |
| 3 — integrated   | participates in real workflows and lifecycle               | end-to-end use, recovery, authority, and audit evidence                          |
| 4 — production   | supportable under the implementation's declared risk       | security, privacy, operations, restore, performance, and acceptance gates        |
| 5 — polished     | professional, legible, efficient, accessible, and pleasant | user evidence, edge-case quality, documentation, and maintained regression suite |

The labels and gates matter more than whether numbering starts at zero or one.
Level is scoped: `audit.timeline@2` can coexist with `audit.rawExport@0`.
Production means production for a declared implementation profile, not one
universal enterprise bar.

“XP” is shorthand for admissible evidence—passing fixtures, witnessed use,
recovery exercises, resolved findings, measured usability—not commits, tokens,
hours, output volume, or model confidence. Work can accumulate evidence without
leveling up; promotion occurs only when every required gate for the next level
passes. A compact overall level is the minimum of its required dimensions, so
averaging cannot hide a security or recovery zero behind a polished interface.

### Activation, utilization, and XP

Capability learning needs at least three separate measures:

- **activation:** the planner/compiler selected the capability because its
  predicate and scope matched;
- **utilization:** the capability materially participated in a decision,
  behavior, artifact, control, or verified outcome after activation;
- **XP/evidence gain:** the episode produced admissible new evidence about the
  capability's competence, limits, reliability, usability, or next-level gate.

Also retain **eligibility/opportunity**—how often the capability could have
activated—so a low count is interpretable. These measures must not collapse into
one popularity score:

| Signal                              | Likely question                                                             |
| ----------------------------------- | --------------------------------------------------------------------------- |
| high opportunity, low activation    | Is selection, discoverability, tagging, or policy wrong?                    |
| high activation, low utilization    | Did we equip a gear set this map did not need without changing the outcome? |
| high utilization, low evidence gain | Is it repeatedly working without learning, or are outcomes unmeasured?      |
| high utilization, poor outcomes     | Is the capability weak, mis-scoped, or blocking the system?                 |
| low use, catastrophic consequence   | Is this a rare invariant that must remain mature despite low frequency?     |
| rising XP, unchanged level          | Which unsatisfied promotion gate is holding it back?                        |

Utilization can be causal only where the fixture or counterfactual supports the
claim; otherwise label it `participated`, not `caused`. XP can be positive,
negative, or narrowing: a failed experiment that exposes a boundary improves
knowledge without pretending the feature became more capable.

An activation is still a durable learning event even when utilization is zero.
It records that the selector saw a relevant opportunity under a particular scope
and state. Useful activation-event properties include capability and version,
trigger/predicate, matched facts, scope, competing candidates, selection score
or reason, selected/suppressed outcome, expected cost, reserved context/tools,
expiry, and the later utilization/result link. Over time these events reveal
demand, false and missed activation, trigger drift, co-activation patterns,
unused loadout weight, seasonality, and candidates for prefetching, retirement,
composition, or deeper investment.

Therefore activation evidence can earn **selector/activation-policy XP** and can
improve knowledge about a capability's applicability. It does not by itself earn
capability-effectiveness XP. A zero-utilization activation remains evidence
rather than waste by definition; repeated zero-utilization under the same
conditions becomes evidence that the selection rule or packaging needs
attention. Suppressed and declined activations are retained when policy and
privacy permit, because future outcomes may show that the road not taken was the
important signal.

### Reps, curiosity, and voluntary craft

The progression system must not punish **getting the reps in**. Repeated use can
build operator fluency, implementation familiarity, sample diversity, muscle
memory, better examples, edge-case discovery, and confidence in a known path
even when it does not immediately clear a promotion gate or attack the current
system constraint.

Keep at least two evidence accounts:

- **practice XP:** attributable repetitions, varied contexts, completed
  exercises, and observations that improve familiarity or enlarge the sample;
- **promotion evidence:** proof that a named next-level capability gate now
  passes under its declared conditions.

Practice XP is real and visible but cannot counterfeit reliability, security, or
production readiness. Conversely, lack of immediate promotion does not turn a
useful rep into failure. Repetitions should retain context and novelty so ten
identical easy runs are distinguishable from ten increasingly varied ones,
without imposing a game mechanic that makes people optimize counts.

Theory of Constraints is advisory except where a bounded release contract
explicitly makes the constraint a gate. It explains where work may have the
greatest end-to-end leverage; it does not revoke the operator's freedom to
follow curiosity, joy, craftsmanship, availability, or momentum. The operator
may always choose a capability and make it better within the active authority
envelope, while the system shows opportunity cost and dependencies without
shaming or blocking the choice.

Theory of Constraints uses these signals to decide which capabilities receive
love. Identify the current system constraint from end-to-end flow and evidence;
exploit it with the smallest intervention; subordinate adjacent work; elevate
its capability level only when needed; then repeat because the constraint may
move. The scheduler considers blocked work, queue/wait time, failure and retry
concentration, handoff delay, evidence gaps, operator burden, and the
counterfactual value of an improvement—not utilization alone. The most-used
feature is not necessarily the constraint, and the least-used feature is not
necessarily neglected.

The capability table can therefore begin with:

`opportunities | activations | utilizations | outcome/evidence refs | XP delta | current level | blocking gate | constraint contribution | next experiment`.

All counts retain scope and observation window. Comparisons across unrelated
capabilities or implementations are invalid unless their opportunities,
consequences, and evidence standards are comparable.

The planner can select a progression policy per horizon or portfolio:

- **breadth first / one skill point better:** choose the smallest useful,
  verified increment for each eligible capability before returning for another
  lap; useful for revealing the whole shape and integration seams;
- **depth first:** hold focus on one capability until a named target level,
  including professional and polished qualities; useful for the load-bearing
  path or a flagship experience;
- **minimum threshold:** bring every required capability to a release floor,
  leaving optional capabilities untouched;
- **furthest back first / golf scoring:** select the lowest qualified capability
  or weakest required dimension, with risk and dependency tie-breakers;
- **constraint first:** improve the capability currently limiting end-to-end
  value, reliability, or learning, following the activation/utilization/XP
  diagnosis above and Theory of Constraints;
- **risk-weighted:** raise high-consequence authority, privacy, recovery, or
  evidence capabilities before cosmetic maturity;
- **mixed portfolio:** reserve explicit capacity for floor-raising, one deep
  flagship, integration debt, and exploratory level-zero probes.
- **free practice / follow interest:** improve whichever capability attracts
  voluntary attention, recording reps, learning, and evidence while keeping
  constraint recommendations visible but non-coercive.

Selection is still constrained by dependencies, authority, expected value,
verification capacity, and the release's visible-payoff rule. A breadth pass
must produce coherent vertical behavior rather than a field of disconnected
stubs. A depth pass stops at its declared target instead of polishing one corner
indefinitely. `Do Nothing` remains a valid result when no candidate has positive
expected value or sufficient evidence.

The first implementation can remain simple: a reviewed capability table with
current level, target level, required dimensions, evidence links, dependencies,
last change, and next smallest promotable increment. Only after real planning
uses expose a need should this become scheduler IR or an XP engine.

### Efficiency as a separate capability axis

Every skill, feature, domain, integration, workflow, projection, and role can
also carry an **efficiency profile**. Maturity asks whether it can satisfy its
contract; efficiency asks what resources a verified unit of useful outcome
requires under declared conditions. A mature capability can be inefficient, and
an efficient demo can still be immature.

Efficiency is not one number. Record a resource/outcome vector such as:

```ts
type EfficiencyObservation = {
  capabilityRef: string;
  scenarioRef: string;
  implementationRef: string;
  window: { from: string; to: string };
  opportunities: number;
  verifiedOutcomes: number;
  resources: {
    elapsedMs?: number;
    operatorAttentionMs?: number;
    modelTokens?: number;
    modelCalls?: number;
    toolCalls?: number;
    computeCost?: number;
    retryCount?: number;
    storageBytes?: number;
    energyEstimate?: number;
  };
  qualityRefs: string[];
  failureRefs: string[];
  authorityAndRiskRefs: string[];
  baselineRef?: string;
};
```

The denominator is a verified outcome or completed contract—not output volume,
activations, story points, or busyness. Comparisons require comparable scenario,
quality, authority, and risk conditions. Missing measurement remains unknown.

The repository's WO-031 `resume usage` command supplies a limited observation of
completed phase-attempt wall time per actor and work order. Its counts include
failed attempts and its spans include waiting; combine it with outcome and
scenario evidence before drawing efficiency conclusions.

A useful provisional efficiency scale is:

| Level                | Meaning                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| E0 — unknown         | no trustworthy baseline                                                                             |
| E1 — measured        | representative baseline and resource vector exist                                                   |
| E2 — economical      | obvious waste removed without weakening the contract                                                |
| E3 — fit for profile | meets the implementation's declared budgets and service objectives                                  |
| E4 — frontier        | no observed alternative improves one important resource without worsening another protected outcome |
| E5 — adaptive        | detects drift, selects among proven strategies, and revalidates the frontier as conditions change   |

`E4` is a local Pareto frontier, not “perfect.” It is scoped to a scenario,
implementation, time window, and protected outcomes. A later technique can move
the frontier.

Constant efficiency awareness should produce **optimization candidates**, not
constant intervention. Candidates name observed waste, affected resource,
baseline, hypothesis, protected invariants, smallest reversible experiment,
expected gain, measurement plan, and rollback. `Beware of Naive Interventionism`
applies: do nothing when measurement cost or change risk exceeds expected gain,
and never optimize a non-constraint merely because its metric is easy to
improve.

Common efficiency avenues include avoiding unnecessary activation and context;
better caching and reuse; deterministic mechanisms replacing repeated model
work; batching or parallelism where ordering permits; cheaper perception before
expensive perception; right-sized model/runtime selection without silent
substitution; fewer handoffs and retries; smaller evidence with equal strength;
incremental computation; better stop conditions; archival/tiering; and reduced
operator cognitive load. Efficiency improvements retain before/after evidence
and note which resource moved elsewhere.

The [resource-pressure environment candidate](../product/03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier)
explores spending less on routine activation as scoped budget pressure rises.
Raising an admission threshold is a scheduling choice; improving efficiency
means reducing actual resources per comparable useful outcome. A candidate trial
must measure both deferred work and completed obligations, including declared
reserves, before claiming a benefit. It has no assigned work order or shipped
runtime behavior.

### Candidate — bounded system baseline

Routine observation can reveal an accumulating burden before it becomes the
current constraint. The useful shape is a small, repeatable baseline check and
a trend, even when no optimization is underway. Public reporting uses neutral
system measures such as size, latency, waiting, and maintenance cost.
Daily observation is one possible owner-selected cadence; this candidate
installs no job and adds no always-on collection to WO-028.

Select only measurements that answer a declared question:

| Question                                          | Candidate evidence                                                                                                                                     | Interpretation boundary                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Is history crowding out new work?                 | Retained event/log bytes alongside the source bytes actually admitted to a task; exact tokens only when an observed tokenizer/transport supplies them. | Storage size and context consumption differ; do not load the log into an LLM merely to measure it. |
| Is deterministic processing becoming slow?        | Fold duration over a pinned event set with host, cold/warm state, method, and repeated observations.                                                   | Event count alone is not a latency measurement; compare equivalent claims and conditions.          |
| Is workflow overhead delaying useful outcomes?    | Work-order elapsed time, completed phase attempts, retries, and handoffs beside verified outcome and complexity references.                            | Wall time includes waiting and interruptions; it is not model effort or operator attention.        |
| Is one change spreading across too many surfaces? | Number of authoritative edits versus regenerated projections and repair work for comparable changes.                                                   | More links can improve traceability; counts do not establish waste.                                |

Reuse existing structured evidence and deterministic summaries, retain detailed
measurements in the appropriate privacy lane, and expose a small bounded view
with sources, missingness, comparison window, and the collector's own cost.
Retention, aggregation, review frequency, and a stop budget apply to the
observer too. An LLM should receive a selected trend or an actionable exception,
not every daily raw sample. Public timing in WO-028 does not authorize public
token, cost, attention, or behavioral telemetry.

The Entropy Reducer can inspect these receipts when a separately authorized
review needs them. Thresholds, minimum sample sizes, trend/noise handling,
cadence, private storage, and the first consumer remain open. Act when evidence
supports the current constraint or a material impending failure; otherwise
retain an explicit accept/observe/defer decision. No universal performance
target, new event schema, scheduler, or architecture change is selected here.

### Counterfactual profiling work orders

An optimization candidate can compile into a bounded profiling work order so
candidate generation, implementation, measurement, and judgment do not blur
together. The work order pins an immutable baseline; one hypothesis or a bounded
candidate family; representative scenarios and fixtures; protected correctness,
quality, authority, and risk invariants; exact build, test, and benchmark
commands; the environment and toolchain profile; warm-up, repetition, and
run-order rules; the resource vector; decision thresholds; evidence paths; and
cleanup and rollback. The representation is intentionally executable by a
low-cost model because the important judgment has already been compiled into the
contract. Model assignment remains per work order and is never hardcoded.

The deterministic harness measures; models propose candidates and interpret
results. Every candidate runs in an isolated worktree or equivalent sandbox,
must pass the semantic and quality gate before comparison, and is never promoted
or merged automatically. Baseline and candidate runs are repeated and
interleaved or randomized where order can bias the result. Conclusions report
the distribution and uncertainty rather than treating one timing as truth.

Results are append-only, machine-readable observations linked to the exact
commits, scenarios, environment, and evidence. Retain regressions, failed
candidates, no-change results, and improvements that merely move cost to a
different resource. A generator may fan one reviewed optimization program into
many small profiling work orders for inexpensive executors, followed by a
comparison projection that shows protected outcomes, the resource frontier, and
first divergence. Candidate families may vary code, prompts, loadouts, models,
runtimes, or harness choices only when their authority and quality conditions
remain comparable. This is the concrete code-efficiency projection of the
graded-counterfactual-build idea in the lineage ledger, not permission to
optimize output volume or weaken the contract.

For reasoning-effort experiments, a complete work order is the default unit for
verification and final review: it is already the bounded unit whose evidence and
judgment must cohere. Compare declared settings such as `xhigh` and `max` over
representative orders before splitting those roles into smaller fragments merely
to create more samples. Under WO-132, reported labels remain as given; `unknown` is admitted, and
`ultra`/`ultra code` mean `xhigh` with subagents and raw spelling. A lower
token or account-cap observation is motivation for a controlled comparison—not
evidence that effort, model quality, or work-order size caused it.

A local-inference calibration is a candidate profiling order after a bounded
capability probe identifies an available runner. Start from one pinned story
prompt and a proposed repeated baseline, then compare baseline, role-only,
active/support-mechanics-only, and role-plus-mechanics cells with interleaved or
randomized run order. Each cell is a distinct compiled loadout. Pin model
artifact and version, quantization, prompt template, decoding parameters,
context and stop rules, seed policy, runner, hardware, and verified
network-egress state. Predeclare coherence, instruction-following, diversity,
role behavior, mechanic participation, and resource evaluators; report
distributions and evaluator disagreement. The operator's proposed 100 baseline
runs are a starting hypothesis, not a universal sample-size rule. Offline
execution removes provider connectivity and API-meter constraints, not local
compute, memory, context, latency, storage, energy, or thermal constraints.

The operator wants local inference at the earliest practical point. The next
planning pass should therefore run or nominate the smallest bounded runner and
no-egress capability probe, then decide whether to file the calibration order;
this priority does not expand WO-019 or silently reorder already authorized
dependencies.

Discharged 2026-09-03: the planning pass after the `v0.3.4` close ran a
read-only existence check (LM Studio installed; Ollama, llama.cpp, and MLX
absent) and nominated WO-027 as the bounded probe. The calibration order is
deliberately unfiled until WO-027's decision packet names its disposition;
filing it before determinism, cost, and egress are observed would be the naive
intervention this section warns against.

WO-027 completed that bounded probe on 2026-09-03 and chose **defer under a
named condition**. It pinned an existing 7B Q8_0 GGUF without downloading,
reproduced the installed LM Studio service-wake crash on its sole permitted
launch, and therefore recorded `n=0` load and generation outcomes. External
connections failed under the combined outer and nested boundaries, but no
boundary diagnostic identified the denying layer. A later profile did permit a
verified loopback request and was not used to relaunch the runner. The
calibration order remains unfiled until an available runner completes the fixed
three-request smoke under a boundary with independently attributable egress
behavior, including deterministic-output and during-generation socket
evidence. See the [dated discovery packet](../discovery/local-inference.md).

That probe should leave room for a hybrid local-first cell: deterministic
parsing, then local tagging/association and candidate WorkOrder/context-capsule
derivation, followed by a remote planning or coding episode that receives only
the approved capsule and public-safe evidence after ordinary dispatch authority. Compare it with deterministic-only, local-only, and
direct-remote paths for disclosure surface as well as episode/output quality and
cost.
Treat local derived metadata as sensitive and fallible, and count any later
remote request for more context as a new, visible disclosure decision.
Do not freeze the first result into permanent local/remote roles: repeat the
profile when a material model, runner, quantization, or hardware change occurs,
and allow the same typed intervention point to migrate local as evidence
supports it. The operator expects the local semantic frontier to improve; the
experiment still records regressions and constraints instead of defining them
away.

Every proposed model intervention point in that experiment is typed and
ablatable: activation predicate, bounded input, output schema, budget, and
downstream event are compared with a deterministic-only branch. Static maps and
other senses should be compiled into authorized, versioned state projections
where possible; an LLM receives only the residual interpretation that actually
requires inference. This uses the existing model/harness/runtime boundary and
does not create a second actor kind, a new roadmap rung, or an expansion of
WO-009 or WO-022.

**Declared cost is the prior; observed cost is the measurement (2026-09-05).**
The compiler already prints each support's declared mechanism and cost — prompt
tokens, runtime operations, episodes — in the compiled tooltip and diff. Those
are static claims about the program, useful for choosing between builds before
anything runs. The profiling harness supplies the observed vector under
declared conditions. The operator's loop is data → experiment → analysis →
change or report → repeat; declared and observed cost are its two columns, and
a build whose observed cost diverges from its declared cost is a finding, not a
rounding error. WO-107 is the route to the first observed column; this note
adds no telemetry field.

The capability table can add `efficiencyLevel`, `baseline`, `resourceVector`,
`protectedOutcomes`, `frontierAlternatives`, and `nextExperiment`. Efficiency XP
comes from trustworthy measurements and successful or informative experiments;
it never raises maturity automatically.

### Candidate — local-model usefulness experiments

**WO-137 observation (2026-09-18):** the [readiness packet](../discovery/local-runner-2026-09-18.md)
records LM Studio `0.4.24+1`, llama.cpp runtime `2.38.0` and an existing pinned
Qwen3.6 27B Q4_K_M artifact. Explicit CLI start and load now work; the fixed
three-request smoke is byte-identical, schema and tool round trip pass, HTTP
cancellation is observed to become idle within five seconds, timeout occurs
and recovery succeeds. The operator-expanded two-minute sequential load run
completed nine capped requests and deadline-cancelled the tenth with nominal
thermal observations, normal memory pressure and no swap growth. Overall
outcome remains `inconclusive`: effective template/default sampling readback,
interrupted-case throughput and attributable runner egress denial are missing.
WO-110 may consume these protocol observations while retaining its unavailable
readiness path; WO-138's `ready` prerequisite remains unsatisfied. The packet
names the next useful boundary/provenance experiment. No capability, quality,
hardware-safety or sustained-load claim follows.

Operator direction, 2026-09-19 (second planning pass of that day): the run
was a success for what local testing needs, and the work is finding more
places to use local models, or at least to keep testing them. WO-137's label
is `inconclusive` for one reason: it ran with networking permitted, so it
could not prove the runner sends nothing off the machine. That proof matters
before a local role reads private material and does not bear on a pilot whose
inputs are all public, so
[WO-138](../work-orders/WO-138-local-model-role-qualification.md) is amended
to activate on the successful live row and qualifies no private-input role.
A further use is nominated from that pass's own cost: eight read-only surveys
spent 1,852,818 remote tokens classifying register rows and review
observations into closed sets with checkable citations, the shape of WO-138's
third task; bulk read-only triage is the next local role to test once the
pilot's packet exists.

Standard planning pass, 2026-09-21: WO-138's amended preflight is met. WO-137
recorded successful live inference on the pinned artifact (the schema and tool
round trip, the determinism triple and the cancel), and WO-110's 2026-09-20 live
row completed one inspection episode against the same runner in 14.6 s with a
schema-valid envelope (WO-110 D007). Two WO-110 decisions are carried into
WO-138's activation preflight in the planning map: the runner does not echo the
requested model, so the pilot must obtain the answering model's identity from
the runner rather than the request (D007), and the transport's null-body case is
guarded by the next order that edits it, WO-138 if it comes first (D012).

**WO-138 disposition after repair (2026-09-21): `inconclusive`.** The final
38-cell matrix uses one retained input snapshot and one matching probe build.
Only T2 qualifies: 5/5 schema-valid local rankings, median Spearman 0.828571,
the same measured remote median, local median latency 12.076 s and zero
in-episode interventions. Every remote baseline reached the model and passed
validation. T1 is now 5/5 schema-valid but its agreement is only 0.1; T3 is 5/5
valid at 0.833333, below its 0.9 floor and outside the ten-point remote floor.
T3's single label-definition cell reached 1.0 and remains a candidate for a
separately registered repeated qualification. T1 needs a fresh fixed-schema
accuracy qualification. The rejected-schema and unmatched-input matrices are
retained unscored; the [packet](../evidence/WO-138/decision-packet.md) records
the corrected method and distributions. No private-input, no-egress,
implementation or independent-verification qualification follows. Reopen when
the task, schema, artifact or boundary changes, or a new qualification is
registered.

Operator direction, 2026-09-16: the next planning pass should give local LLM
experiments more attention, starting with concrete runner readiness and any
operator setup needed in LM Studio. Current readiness is unknown; the dated
WO-027 failure above remains evidence about that probe, not a claim that the
runner is unusable today. Revisit its named deferral with a fresh bounded
availability smoke and coordinate any required setup before scheduling runs.
WO-110 supplies the existing inspection-transport candidate; its present scope
does not establish source-writing capability or model quality.

After availability, plan a substantially broader comparison effort around the
same pinned WorkOrder, repository baseline, compiled build and independent
acceptance criteria. Separate three questions: differences across local and
remote models under comparable conditions; variation across repeated runs of
the same model and prompt; and changes caused by prompt or support choices for
the same order. For the last question, vary one factor at a time and identify
each distinct compiled build explicitly. Keep the task and other conditions
fixed; report transport/tool differences that prevent a clean model comparison.

Use the profiling contract above to retain outputs, failures, distributions,
resource costs and evaluator disagreement. A small pilot should establish
feasible sample sizes and evaluation cost before larger batches. The intended
decision is which responsibilities local models can handle reliably, where
they need deterministic checks or remote assistance, and where they are not
yet useful. A universal ranking, a large run count or an assumed privacy/cost
advantage is not the goal. No setup, model download, live launch, sequence
change or new order is authorized by this candidate alone.

Source: the operator's 2026-09-16 local-model ideation, synthesized in the ledger
and [WO-051 breakout receipt](../evidence/WO-051/ideation-local-models.md).
Reopen at the next planning pass or when the operator reports setup readiness;
record the resulting plan, concrete setup needs and bounded first experiment.

**Allocated 2026-09-17 (vision-into-use pass).** Observed on the host: the
application is installed, its CLI build changed on 2026-09-15 after the
2026-09-03 crash, the server is not running and nothing listens on the
loopback port; Apple M3 Max, 48 GB. Readiness of the current build is
unknown, so the plan is three orders in dependency order:
[WO-137](../work-orders/WO-137-local-runner-readiness.md) (a guided research
order: reproducible noninteractive calls with determinism, schema and
tool-call round trip, cancellation, timeout and provenance, or a failure
artifact), then [WO-110](../work-orders/WO-110-local-model-transport.md)
written from its row, then
[WO-138](../work-orders/WO-138-local-model-role-qualification.md) (three
read-only tasks with deterministic oracles, local against one remote
transport with repeats and one-factor cells, deciding which inspection roles
the local kind may fill at what floor). Bounded implementation and
independent verification are later qualifications, each its own experiment.
Live evaluations never run inside `npm test`; requalification triggers are in
07 §Research and guided-operator work orders. No download, launch or setting
is authorized by this allocation.

## REVIEW-003 consumed — dispositions and routes (2026-09-25)

Recorded by the 2026-09-25 planning pass, which paid for
[REVIEW-003](../instance/entropy-reducer/runs/REVIEW-003.md) (1,089 s,
USD 6.99, claude-opus-5-5 at xhigh through `claude-cli-print`, zero
permission denials) and
[REFUTATION-004](../instance/entropy-reducer/runs/REFUTATION-004.md)
(178 s, USD 0.80) because `npm run entropy -- subject` named the
pre-mechanism REVIEW-001 with undefined paths (the defect is WO-160 item
2) and that pair was discharged inside WO-023 on 2026-09-04. The accepted
findings are register rows through the
[generated review document](entropy-reviews/REVIEW-003.md); this section
is the planning decision over them and grants no activation authority.

| Item                                                                                | Disposition     | Route                                                                        | Reopen                                                          |
| ----------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ER3-001 — Codex launches inherit the operator's home; seven argv builders (major)   | accepted        | WO-159, paired with WO-158 at the head                                       | an isolated launch still changes the user-level configuration   |
| ER3-002 — console collection forks 101 status processes; the gate's critical path (major) | accepted  | WO-164, paired with WO-165 after WO-070 and WO-115; FUP-7f9a27e6ed6c44b3 reopened | `collectSources` above 3 s after WO-164 closes               |
| ER3-003 — the reducer compiles a fan-out neither route can run (minor)              | accepted        | WO-165, the second option preferred                                          | a receipt describes a capability the episode lacked             |
| Packet `isolated-codex-launch-home`                                               | accepted, filed | design record for WO-159                                                     | the order's decisions                                           |
| Packet `constant-process-console-collection`                                      | accepted, filed | design record for WO-164                                                     | the order's decisions                                           |
| Packet `entropy-review-delegate-route-agreement`                                  | accepted, filed | design record for WO-165                                                     | the order's decisions                                           |

## REVIEW-004 consumed — dispositions and routes (2026-09-30)

Recorded by the 2026-09-30 planning pass, which paid for
[REVIEW-004](../instance/entropy-reducer/runs/REVIEW-004.md) (2,216 s,
145 turns, USD 11.71, claude-opus-5-5 at xhigh through `claude-cli-print`,
zero permission denials) and
[REFUTATION-005](../instance/entropy-reducer/runs/REFUTATION-005.md)
(700 s, 44 turns, USD 2.08) because `npm run entropy -- subject` returned
`review`. The accepted findings are register rows through the
[generated review document](entropy-reviews/REVIEW-004.md); this section
is the planning decision over them and grants no activation authority.
The measurements, the declined alternatives and the goal alignment are in
[the planning document](entropy-review-004-2026-09-30.md).

| Item                                                                                                    | Disposition              | Route                                                                                                             | Reopen                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ER4-001 — the gate's code identity leaves out documentation that product suites read (major)            | accepted                 | WO-174, paired with WO-058 at the head                                                                            | a product-suite case reads an excluded path after WO-174 closes                                              |
| ER4-002 — `--review` does not select the only suite that executes `scripts/harness.mjs` (major)         | accepted                 | WO-174, the same order                                                                                            | a mutant of a file a machinery suite executes passes `--review` after WO-174 closes                          |
| ER4-003 — numeric reopening conditions are crossed and nothing evaluates them (major)                   | accepted                 | the three that held were acted on in the pass; the mechanism is WO-175, paired with WO-059                        | a review again finds by hand a condition the listing names                                                   |
| ER4-004 — the meter's one metric predicate can never hold (minor)                                       | accepted                 | WO-175, the same order                                                                                            | the health line prints a count the meter did not compute                                                     |
| ER4-005 — docs-check parses 1,262 Markdown files a run; the plan check was 4.7 s with eleven closed entries listed and is 2.1 s without them (minor) | accepted, order declined | register row deferred; the WO-156 rows re-disposed with the observation                                           | `npm run test:docs` above 30 s, docs-check above 15 s or the plan check above 8 s on the operator's host     |
| ER4-006 — 76 of 82 successive authority revisions repeat an identical transcript (minor)                | accepted, order declined | register row deferred; FUP-5e2f4ce16f9e8be1 settled and FUP-8a4e201d861208ad deferred with the measurement        | the next order that edits `scripts/authority-evidence.mjs`, or repeated copies above 10% of `docs/evidence`  |
| ER4-007 — a review worker's temporary root is outside its copy and unobserved (minor)                   | accepted                 | WO-175, the same order                                                                                            | a receipt's confinement record omits a directory the worker wrote                                            |
| Packet `gate-identity-covers-suite-inputs`                                                              | accepted, filed          | design record for WO-174                                                                                          | the order's decisions                                                                                        |
| Packet `machinery-selection-follows-imports`                                                            | accepted, filed          | design record for WO-174                                                                                          | the order's decisions                                                                                        |
| Packet `reopen-conditions-evaluated-at-planning-entry`                                                  | accepted, filed          | design record for WO-175                                                                                          | the order's decisions                                                                                        |
| Packet `history-independent-document-checks`                                                            | deferred, not filed      | stays in the REVIEW-004 receipt                                                                                   | ER4-005's condition occurs                                                                                   |

## REVIEW-005 consumed — dispositions and routes (2026-10-02)

[REVIEW-005](../instance/entropy-reducer/runs/REVIEW-005.md) and
[REFUTATION-006](../instance/entropy-reducer/runs/REFUTATION-006.md)
cost 1,519.235 s and USD 9.3190456 together. Both measured minor findings
survived. The [generated review document](entropy-reviews/REVIEW-005.md)
holds the accepted findings; [the planning document](entropy-review-005-2026-10-02.md)
§5 holds their completed planning decisions and the NoOpIntent comparisons.
No work order is filed or amended and no runtime change is claimed.

| Item | Disposition and route | Reopen |
| --- | --- | --- |
| ER5-001, timeout headroom | Accepted, new order declined; keep limits and review durations each entropy pass. REVIEW-005 is 58.5% of the review limit after REVIEW-004 at 92.3%. | An observed deadline loss or two successive episodes of one kind above 80% of its limit. |
| ER5-002, fired follow-up triggers | Accepted; FUP-0086, FUP-0113 and FUP-ec75a4295bf36696 re-disposed below. Parser order declined. | A later pass again leaves a named fired lifecycle trigger unchanged. |
| Packet `entropy-episode-timeout-headroom-listed` | Deferred, not filed; retained in REVIEW-005, same NoOp as ER5-001. | ER5-001's condition. |
| Packet `order-lifecycle-reopen-triggers-listed` | Deferred, not filed; retained in REVIEW-005. Four-row coverage does not include the live-smoke trigger. | ER5-002's condition; compare typed conditions with anchored prose. |
| FUP-0086, authorship assistance | WO-117 landed; the candidate is re-deferred because equip/build authoring left that order. Product 04 records the boundary. | Proposed pattern-workshop/equip/build authoring order or witnessed missing proposal axis. |
| FUP-0113, exposure plans | WO-062 activated; adopt its D002 deterministic read/store boundary. Product 09 and WO-123's catalog carry the next reading. | First consuming model invocation, including WO-123 preflight, or a proposed private-material reader. |
| FUP-ec75a4295bf36696, harness re-probe | The smoke trigger occurred in WO-149/WO-159. Broad requalification declined; dated capability limits remain. | Observed capability/role-text mismatch, changed integration contract or operator direction; review next entropy pass. |
| FUP-fb8cbeabbddef397, document latency | Remains open, with the 39.984 s median and console parity profile; the specific history-cache remedy is declined. | Next standard pass or relevant suite/check edit, with a bounded same-coverage cost comparison. |
| FUP-8a4e201d861208ad and FUP-be1103fbfdd14653, evidence growth | Weekly trigger occurred; re-deferred after the 12.524 MB path-growth / 9.158 MB distinct-content census. Immutable evidence retained. | Another week above 10 MB, two successive orders above 1 MB distinct blobs, or observed reading/storage harm. |

The earlier assertion that every deferred retirement match had an unoccurred
condition was wrong for FUP-0086: WO-117 was already closed. This records
the correction without editing the earlier pass or any immutable receipt.
The full retirement query in this pass matched 50 pending rows; textual
matches unrelated to these decisions retain their status and conditions.

## Direct-draft provenance for the 2026-09-02 batch

WO-016 through WO-022 were supplied by the operator as complete public drafts
with an explicit instruction to file them. The same turns were first written to
ignored intake as compaction-safety copies. Their earlier local timestamps
therefore describe capture order, not a later agent promotion from raw notes:
both copies descend from the same operator-authored filing instruction. During
VER-001 repair the operator confirmed that exact wording and word choice were
intentional. The batch passed the employer/credential/internal-service screen;
this provenance does not relax that boundary or grant direct-filing status to
ordinary intake.

WO-024 through WO-026 are planner-synthesized drafts from the operator's
2026-09-02 post-`v0.3.0` planning messages, which are preserved locally as a
compaction-safety capture. They are not direct drafts: their wording is the
planner's, their observed-problem sections were measured against the repository
at `v0.3.0`, and they carry no direct-filing provenance.

WO-027 and WO-028 are planner-synthesized drafts from the operator's 2026-09-03
post-`v0.3.4` planning messages, preserved locally as a compaction-safety
capture. Their observed gaps were measured against the repository at `v0.3.4`;
they carry no direct-filing provenance.

WO-030 and WO-031 are planner-synthesized drafts from the operator's 2026-09-05
planning dispatch, preserved locally as a compaction-safety capture. Their
observed gaps were measured against the repository at `v0.6.0`; they carry no
direct-filing provenance. WO-030 discharges the ladders document's Fable
planning handoff through the concurrent work-orders plan.

The 2026-09-04 gardening pass added one
`**Effort:** executor xhigh+; verifier xhigh+; reviewer any.` line, immediately
after the Model field, to the nine remaining drafts that lacked one (WO-009,
WO-010, WO-011, WO-014, WO-102, WO-103, WO-105, WO-107, WO-108) so activation no
longer stalls on the WO-019 declaration check. No other wording in those drafts
changed, so their provenance is unchanged; a lower floor for a mechanical corpus
order remains available through the dated amendment path at activation.

WO-032 through WO-038 are planner-synthesized drafts from the operator's
2026-09-06 phase-two planning dispatch, preserved locally as a
compaction-safety capture
(`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`, SHA-256
`e8ccc4e788ca0ce66612a12cdd8919d7f4dee5e9303b799460e18dc1c087b287`). Their
observed gaps were measured against the repository at `v0.13.1` and by two
delegated read-only sweeps whose numbers the phase-two plan reproduces; they
carry no direct-filing provenance. WO-032, WO-033, and WO-034 were rescoped
the same day, and WO-039 through WO-041 filed, by the phase-two redirect
after the operator's correction of the first pass; the correction is
preserved locally as a compaction-safety capture and its synthesis is the
plan's redirect section and the ledger's redirect entries. The first two
kept their numbers and changed their file names to match their scope
before any activation; no link to the earlier names remains.

WO-042 and WO-043 are planner-synthesized drafts from the operator's
2026-09-08 `planning:` dispatch, preserved locally as a compaction-safety
capture (`docs/intake/notes/2026-09-08-critical-path-planning-dispatch.md`,
SHA-256 `b17d1479741c2b97824cb70b196b1b1d0ce3602bbb0abb9ac7353441c1e82c0b`).
Their observed gaps were measured against `main` at `33e2c25`; they carry no
direct-filing provenance. The external audit quoted in that dispatch is a
hypothesis the pass verified claim by claim; nothing from it is filed
verbatim, and its two employer-identifying terms stay in the ignored capture.

WO-044 through WO-117 (with the corpus numbers 101 to 109 skipped) are
planner-synthesized drafts from the operator's same-day corrections during
that pass, preserved verbatim in the ignored capture
`docs/intake/notes/2026-09-08-critical-path-planning-correction.md` (SHA-256
`4b3a9b276ba0e3e83c0492fe7148ac394a3d07a2242361e4e193207d7d9fee23`). The
children of WO-033, WO-034, WO-035, WO-037 and WO-040 carry those umbrellas'
wording as their record; the runtime, UI-contract and separation orders carry
the operator's stated intent generalized under the Clean Room floor; none
carries direct-filing provenance. Two Angular-specific drafts written during
the revision were withdrawn before any commit at the operator's direction
that target-application orders live in the forks.

WO-118 through WO-124, and the same-day corrections to WO-042, WO-043,
WO-051, WO-053, WO-056, WO-061, WO-065, WO-066, WO-067, WO-068, WO-077,
WO-083, WO-099, WO-100, WO-111, WO-112, WO-114 and WO-115, come from an
external review of the revised plan that the operator supplied the same day,
preserved verbatim in the ignored capture
`docs/intake/notes/2026-09-08-codex-planning-review.md` (SHA-256
`410c47d5a2901f8c632ddf96bd96350f27a79e86d94f612e4295e64ddc9d52ca`). Every
material claim in it was verified against the tree before it was applied;
the plan records the findings and their consequences. They carry no
direct-filing provenance. WO-125 comes from the operator's same-day request
relaying a second model's finding about the Codex adapter's effort
restriction, preserved in the same correction capture.

## Status boundaries

The [index](../work-orders/README.md) defines its evidence labels on
[its history page](../work-orders/HISTORY.md). Control
closure, repository integration, and release inclusion are distinct boundaries.
A historical order is explicitly time-indexed; absence of events is not proof
of completion. Dependency state belongs to the index's typed projection,
shared with selected lifecycle JSON status (WO-043, 2026-09-11). Unmet hard,
closure, release or planning-deferral entries refuse activation; references,
historical evidence, waivers and supersessions do not. Unmarked authorities
keep a labeled conservative token view that does not block. A dependency-ready
row still needs human preflight and selection.

## Catalog — human preflight and scope notes

**WO-123 preflight, 2026-10-02:** read WO-062 D002 and product 09
§Candidate — model-input exposure plans at the first consuming model
invocation. FUP-0113's former activation trigger occurred and its current
disposition carries that existing boundary. This is a preflight reading,
not a new ModelInputPlan implementation criterion or a privacy guarantee.

Consult each linked authority for current Model, Effort, typed dependencies,
and acceptance. In every row, the activation-preflight column carries human
prerequisites and placement context; dependency readiness is read from the
[generated index](../work-orders/README.md), never asserted by this catalog.
Retained dependency wording is dated planning context, not a second state source.

| Work order                                                            | Purpose / track                                                                                                                                                                                                                                                                                | Human activation preflight (dependency state: index)                                                                                                                                                                       | Execution role                                                                                            | Environment / capability preflight                                                                                                                                    | Primary affected surfaces                                                                                                                                                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [WO-001](../work-orders/WO-001-environment-truth.md)                  | discovery — bounded host truth                                                                                                                                                                                                                                                                 | not applicable; historical evidence input                                                                                                                                                                                  | bounded environment investigator                                                                          | read-only host inspection                                                                                                                                             | `docs/discovery/`                                                                                                                                                                                                |
| [WO-002](../work-orders/WO-002-pure-kernel.md)                        | core runtime — pure kernel                                                                                                                                                                                                                                                                     | not applicable                                                                                                                                                                                                             | pure-kernel implementer                                                                                   | deterministic build/test harness                                                                                                                                      | `packages/kernel/`                                                                                                                                                                                               |
| [WO-003](../work-orders/WO-003-walking-skeleton.md)                   | integration — fake end-to-end vertical                                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | integration/scenario implementer                                                                          | deterministic fake-executor scenario                                                                                                                                  | `packages/skeleton/`; bounded kernel gaps                                                                                                                                                                        |
| [WO-004](../work-orders/WO-004-environment-truth-addendum.md)         | operations/discovery — lifecycle and environment corrections                                                                                                                                                                                                                                   | not applicable                                                                                                                                                                                                             | lifecycle/release engineer and environment investigator                                                   | authenticated transport probes where required                                                                                                                         | discovery, scripts, control, lifecycle docs                                                                                                                                                                      |
| [WO-005](../work-orders/WO-005-capability-table.md)                   | planning/evidence — capability maturity inventory                                                                                                                                                                                                                                              | not applicable                                                                                                                                                                                                             | evidence planner/documentarian                                                                            | document/evidence review                                                                                                                                              | capability table, docs map, lifecycle/evidence records                                                                                                                                                           |
| [WO-006](../work-orders/WO-006-publication-bootstrap.md)              | publication/process/tooling — publication loop plus authorized expansions                                                                                                                                                                                                                      | not applicable                                                                                                                                                                                                             | completed executor/reviewer                                                                               | repository toolchain; personal-harness reconciliation deferred to WO-014                                                                                              | publication, product, lineage, decisions, docs, scripts                                                                                                                                                          |
| [WO-007](../work-orders/WO-007-audit-record-baseline.md)              | auditability — deterministic projections                                                                                                                                                                                                                                                       | not applicable                                                                                                                                                                                                             | audit-projection implementer, then independent verifier                                                   | real walking-skeleton log plus deterministic checks                                                                                                                   | skeleton audit types; product 09; CLI/docs plus authorized documentation expansions                                                                                                                              |
| [WO-008](../work-orders/WO-008-composition-compiler.md)               | composition — compiled loadouts and diff                                                                                                                                                                                                                                                       | satisfied — activated from published `v0.3.6`; `v0.4.0` pinned by the order; the 21 WO-003 decision traces were frozen before the loadout was replaced                                                                     | pure-compiler implementer                                                                                 | deterministic compiler/fixture harness                                                                                                                                | new compiler package; skeleton integration; product docs                                                                                                                                                         |
| [WO-009](../work-orders/WO-009-real-disposable-worker.md)             | runtime/integration — real worker transport                                                                                                                                                                                                                                                    | active v0.10.0 from published v0.9.0; landed WO-016/WO-029 consumed; live and deterministic evidence staged for independent verification                                                                                   | runtime/adapter implementer                                                                               | authenticated nonsandboxed runner and two live CLI transports                                                                                                         | transport adapters; real-episode integration                                                                                                                                                                     |
| [WO-010](../work-orders/WO-010-independent-verification.md)           | verification runtime — blinded repair/reverify loop                                                                                                                                                                                                                                            | dependency must land; recheck shared surfaces and verifier capacity for the paired wave                                                                                                                                    | verification-system implementer, followed by a separate verifier                                          | fake/live transport fixtures and planted-defect loop                                                                                                                  | verification runtime, workstream matrix, status projection                                                                                                                                                       |
| [WO-011](../work-orders/WO-011-feedback-compiler.md)                  | feedback/self-hosting — ten units and first dogfood                                                                                                                                                                                                                                            | dependencies must land; follows WO-010 under the marked sequence                                                                                                                                                           | feedback-compiler implementer, followed by separate verification                                          | operator-witnessed self-hosted run is acceptance evidence                                                                                                             | feedback compiler, runtime, fixtures, product docs                                                                                                                                                               |
| [WO-012](../work-orders/WO-012-release-gate-path-quoting.md)          | operations patch — release path safety                                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | release-tooling repairer                                                                                  | path-byte fixtures and release/worktree tests                                                                                                                         | release/worktree scripts and tests                                                                                                                                                                               |
| [WO-013](../work-orders/WO-013-portable-fixture-temp-roots.md)        | test-infrastructure patch — portable fixture temporary roots                                                                                                                                                                                                                                   | satisfied — used the governed post-`v0.3.0` base; activation's version-placeholder miss was forward-corrected in the authority; merge and release close completed                                                          | shell-fixture repairer working inside a sandboxed harness                                                 | supplied-root-only macOS policy plus Claude Code 2.1.258 sandbox evidence captured                                                                                    | `scripts/test-*.sh`, shared temp-root helper, a new temp-root fixture, one runbook note                                                                                                                          |
| [WO-014](../work-orders/WO-014-approval-burden-contract.md)           | harness evidence/process — approval-burden contract; carries WO-006's deferred posture reconciliation                                                                                                                                                                                          | assign version and close disposition; both harnesses installed at recorded versions; operator available to witness fresh-session runs Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Placed last in the sequence by the 2026-10-02 pass so that no open order sits beside the list; the pass that reaches it re-observes its gap. Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. | harness-evidence executor, independent fresh-session verifier, operator witness                           | Claude Code and Codex CLI; personal-setting authority stays with the operator                                                                                         | runbook, ADR-0003/ADR-0004 amendments, `docs/discovery/` matrices, a synthetic approval-surface fixture                                                                                                          |
| [WO-015](../work-orders/WO-015-release-cadence-parser.md)             | operations patch — release-manifest cadence extraction                                                                                                                                                                                                                                         | not applicable                                                                                                                                                                                                             | release-tooling repairer, then independent verifier                                                       | canonical TypeScript source plus isolated release/tag fixtures                                                                                                        | `scripts/release.mjs`, `scripts/test-release.sh`, roadmap and this map                                                                                                                                           |
| [WO-016](../work-orders/WO-016-skeleton-reactor.md)                   | skeleton architecture/evidence — one Reactor for live execution and replay                                                                                                                                                                                                                     | satisfied — activated from published `v0.3.5`; `v0.3.6` assigned; Stage 1 baselines captured before source edits                                                                                                           | skeleton/reactor implementer                                                                              | deterministic live/replay and mutation harness                                                                                                                        | skeleton reactor, scenario, tests, and README; bounded kernel gaps                                                                                                                                               |
| [WO-017](../work-orders/WO-017-kernel-truthfulness.md)                | kernel correctness/evidence — store codec, outbox ordering, authority guard, evidence hardening                                                                                                                                                                                                | satisfied — `v0.3.5` assigned; operator merge and release close completed                                                                                                                                                  | pure-kernel boundary repairer                                                                             | built-kernel probes and deterministic mutation drills                                                                                                                 | kernel store/core/tests/README, skeleton envelope, domain and architecture docs                                                                                                                                  |
| [WO-018](../work-orders/WO-018-control-plane-consolidation.md)        | control-plane/tooling — shared helpers, machine state, built-kernel manifest                                                                                                                                                                                                                   | satisfied — activated from published `v0.4.0`; `v0.4.1` and `@dotln/kernel` `0.2.1` assigned; landed WO-013 shell-fixture and WO-024/WO-025 release-script changes consumed                                                | control-plane refactorer/evidence engineer                                                                | shell fixtures plus real-repository publication/corpus checks                                                                                                         | script libraries, lifecycle/release/publication suites, guide/playbook/release/corpus docs                                                                                                                       |
| [WO-019](../work-orders/WO-019-effort-truth.md)                       | process/control evidence — declared and attested effort truth                                                                                                                                                                                                                                  | satisfied — active branch contained published `v0.3.3`; bounded readback probe completed without importing personal settings; merge and release close completed                                                            | control-plane/process implementer, then verifier and reviewer                                             | attested harness/model/effort/source                                                                                                                                  | resume script/tests, discovery, guide/playbook/domain/evidence docs                                                                                                                                              |
| [WO-020](../work-orders/WO-020-beacon-codebook.md)                    | skeleton projection/CLI — metadata-only episode Beacons and exact disclosure codebook                                                                                                                                                                                                          | satisfied — activated from published `v0.5.2`; `v0.6.0` assigned under the release-assignment default; intake sources and host metadata re-observed in the stage receipts; see the index for evidence                      | beacon projection/codebook implementer plus bounded environment probe                                     | deterministic pure/filesystem fixtures on a re-observed host                                                                                                          | skeleton beacon pure/filesystem modules, CLI/tests, discovery, product/README/capability table                                                                                                                   |
| [WO-021](../work-orders/WO-021-control-plane-beacons.md)              | control-plane dogfood/projection — authorized beacon sweeps, staleness, audiences, group composites                                                                                                                                                                                            | recheck wave eligibility and integration base; assign version and close disposition; activate from a governed base containing all dependencies                                                                             | control-plane/beacon integrator                                                                           | deterministic resume/worktree and metadata fixtures                                                                                                                   | resume/worktree scripts, codebook v2, Observe guard choice, audience directories, skeleton, classifier                                                                                                           |
| [WO-022](../work-orders/WO-022-senses.md)                             | composition/runtime capability — Senses as compiled, authorized, mounted perception                                                                                                                                                                                                            | recheck wave eligibility and integration base; assign version and close disposition; consume bounded v2; re-observe sparse/numeric/filesystem limits; arrange a non-repository key; prove v3 representable                 | composition/perception-capability implementer                                                             | deterministic compiler/path/keyed-residue/authorization fixtures                                                                                                      | perception supports/fixtures, sparse-twin affordance, host path/provenance residue, bounded guard, docs/tests                                                                                                    |
| [WO-023](../work-orders/WO-023-compile-entropy-reducer.md)            | instance content — compile the Entropy Reducer reviewer and generated dispatch residue                                                                                                                                                                                                         | historical compiled-instance scope; consult current evidence in the index                                                                                                                                                  | instance-content/compiler implementer, then human review and blinded refutation                           | compiled reviewer Claude Fable 5.1 at max with attestation                                                                                                            | compiler wildcard contract; skeleton loadout/compiler boundary; instance residue and run evidence; tests; pattern/playbook/architecture/ledger docs                                                              |
| [WO-024](../work-orders/WO-024-release-notes-surfaced.md)             | operations patch — reviewed release notes in the tag, GitHub Release projection, local render                                                                                                                                                                                                  | satisfied — used the governed post-`v0.3.1` base; real outside-sandbox close completed after fixture-stubbed implementation evidence                                                                                       | release-tooling implementer, then independent verifier                                                    | `gh` stub in fixtures                                                                                                                                                 | `scripts/release.mjs`, `scripts/worktree.mjs`, release and worktree suites, the final-review package, guide/playbook/releases docs                                                                               |
| [WO-025](../work-orders/WO-025-version-bearing-surfaces.md)           | operations patch — checked release surfaces and renderer-wrapped GitHub bodies                                                                                                                                                                                                                 | satisfied — active branch included WO-024 and published `v0.3.2`; merge and release close completed                                                                                                                        | release-tooling implementer, then independent verifier                                                    | see authority                                                                                                                                                         | README/release checks, publisher/close gates, body profile, skeleton version/banner, release/process/compatibility docs                                                                                          |
| [WO-026](../work-orders/WO-026-work-order-index.md)                   | planning tooling — generated open/closed work-order index over control evidence; files never move                                                                                                                                                                                              | satisfied — activated from published `v0.5.1`; `v0.5.2` assigned under the release-assignment default; consult current evidence in the index                                                                               | planning-tooling implementer, then independent verifier                                                   | see authority                                                                                                                                                         | new `scripts/work-orders.mjs`, generated `docs/work-orders/README.md`, this map's catalog, roadmap/playbook/guide docs                                                                                           |
| [WO-027](../work-orders/WO-027-local-inference-probe.md)              | discovery — local-inference runner inventory, pinned artifact, no-egress evidence, calibration decision                                                                                                                                                                                        | satisfied — `v0.3.3` assigned; operator present; no download; one combined-boundary launch; v3 loopback succeeded, external attribution ambiguous; operator merge and no-release close completed                           | bounded environment investigator, then independent verifier                                               | LM Studio 0.4.13+1 was the only installed runner and its sole service launch crashed                                                                                  | `docs/discovery/local-inference.md` and `.json`, roadmap/discovery/README/ledger write-backs; nothing under `packages/` or `scripts/`                                                                            |
| [WO-028](../work-orders/WO-028-control-event-time.md)                 | control plane — `recordedAt` on control events, elapsed-phase projection, labeled recovery of historical times                                                                                                                                                                                 | historical bounded local-ref observation; no activation decision maintained here                                                                                                                                           | control-plane implementer, then independent verifier                                                      | see authority                                                                                                                                                         | `scripts/resume.mjs` and `scripts/lib/`, resume and checkpoint suites, `docs/control/current.md`, a dated `docs/discovery/` observation, architecture/guide/playbook/domain-model docs                           |
| [WO-029](../work-orders/WO-029-pinned-artifact-identity.md)           | composition/runtime evidence — pin equipped artifact identity and refuse on drift                                                                                                                                                                                                              | published in v0.9.0; WO-009 consumes the pinned receipt and exact environment; deferred component-membership and pulse identity work remain separate                                                                       | compiler/skeleton receipt implementer, then independent verifier                                          | pure compiler plus deterministic runtime/audit fixtures                                                                                                               | compiler artifact identity; skeleton equip/recompile/refusal/audit path; product, map, and lineage docs                                                                                                          |
| [WO-030](../work-orders/WO-030-concurrent-control-state.md)           | control plane — one segment per order, order-scoped legality, multi-order projection, proven integration                                                                                                                                                                                       | activation preflight satisfied at `v0.6.0`; runs alone as wave 0; `v0.7.0` retained; per-segment implementation and fixture evidence staged, with lifecycle results in the generated index                                 | control-plane implementer, then independent verifier                                                      | real-Git fixtures with two worktrees and a fixture main; no network                                                                                                   | `scripts/lib/control.mjs`, `resume.mjs`, `worktree.mjs`, `release.mjs`, `work-orders.mjs`, control docs, playbook, ladders plan                                                                                  |
| [WO-031](../work-orders/WO-031-actor-usage-projection.md)             | control-plane projection — elapsed time per actor and phase; opt-in opaque account label                                                                                                                                                                                                       | WO-030 merged; assign version and close disposition; confirm the public two-accounts disclosure                                                                                                                            | control-plane implementer                                                                                 | deterministic log fixtures; the real log for the echoed report                                                                                                        | `resume.mjs`, `scripts/lib/control-time.mjs`, `.gitignore`, product 02/07/09, playbook                                                                                                                           |
| [WO-032](../work-orders/WO-032-uifa-actor-board.md)                   | projections/console — UIFA v0: a read-only actor board with Actors, Builds, Mechanisms, Work, and Blueprint panels over a versioned `uifa-board-v1` view model; terminal and zero-asset page                                                                                                   | wave 1 lane B beside WO-039; assign version at activation (minor; the second wave-1 merger retimes); activate from clean published main; no `scripts/` edits; zero dependencies, no framework                              | projection/renderer implementer, then independent verifier                                                | fixture inputs recorded from the documented machine interfaces and evidence stores; no live worker required                                                           |
| [WO-033](../work-orders/WO-033-compiled-starter-export.md)            | control plane — configuration root, target repositories as builds (authority profile, class, profile, worktree-local harness emit), a launchpad export carrying the Contributor build and a pinned runtime build, kit/instance/overlay manifest, lane sync, Beacon portability                 | umbrella record (2026-09-08): superseded whole by WO-049, WO-063, WO-064, WO-069 to WO-079 and WO-036; not activatable; the text stays as the children's record                                                            | control-plane implementer, then independent verifier; the second wave merger records the wave receipt     | offline `npm ci` for the export fixture; `gh` stub; the local harness for the export's recorded smoke                                                                 |
| [WO-034](../work-orders/WO-034-cross-repository-workstream-pilot.md)  | workstream application — synthetic six-demonstration pilot plus the operator-witnessed real run from a fork running the compiled build into `DotLn-Angular`, whose first change is a UIFA v1 shell over `uifa-board-v1`                                                                        | umbrella record (2026-09-08): superseded whole by WO-080 to WO-083; not activatable; the text stays as the children's record; the shell's orders are the fork's                                                            | implementer for fixtures; launchpad-dispatched executor, verifier, and reviewer sessions for the real run | the operator's fork and target repositories; hook logs from the fork's sessions for the fired-unit counts                                                             |
| [WO-035](../work-orders/WO-035-documentation-structure-reset.md)      | documentation structure — ledger order and index, spec/receipt boundary, generated release history, shorter cold start                                                                                                                                                                         | umbrella record (2026-09-08): superseded whole by WO-084 to WO-090; not activatable; the text stays as the children's record                                                                                               | documentation/tooling implementer, then independent verifier                                              | repository-wide checks; no network                                                                                                                                    | ledger, `docs/lineage/`, product 02/03/06/10/14, capability table, execution guide, `scripts/lineage.mjs`, `scripts/docs-check.mjs`, publication index and locks                                                 |
| [WO-036](../work-orders/WO-036-evidence-runner.md)                    | test infrastructure — build-first evidence runner with concurrent suites and per-case reporting                                                                                                                                                                                                | remains active (2026-09-08 critical path): any free lane beside WO-042 and WO-043; assign version at activation (patch); carries the WO-033 build-first reorder Superseded whole by WO-126 criterion 6 (closed), as the order's own text records; not activatable (re-observed 2026-09-28). | test-infrastructure implementer, then independent verifier                                                | the same host and commit for the before/after timing                                                                                                                  | `package.json` `test`, `scripts/test-runner.mjs`, `scripts/test-*.mjs`, product 07 evidence-gate sentence, README test paragraph                                                                                 |
| [WO-037](../work-orders/WO-037-five-s-equipment-set.md)               | pattern workshop, compiler side — multi-active link groups, the 5S set, set bonuses, a second scenario                                                                                                                                                                                         | umbrella record (2026-09-08): superseded whole by WO-091 to WO-095; not activatable; the text stays as the children's record                                                                                               | compiler/skeleton implementer, then independent verifier                                                  | deterministic compiler and scenario fixtures; no network                                                                                                              | `packages/compiler`, skeleton loadouts/scenario/reactor, product 02/04/05/06/10, README, capability table row                                                                                                    |
| [WO-038](../work-orders/WO-038-license-posture-lands.md)              | governance — workspace `license` and `private` metadata, a publication-refusal check in the release-surface preflight, `CONTRIBUTING.md` with the DCO rule, export default license files                                                                                                       | first free lane before the first external fork of the starter; assign version at activation (patch); no hook or settings change; no package publication                                                                    | any capable model, then independent verifier                                                              | none; `npm publish --dry-run` refusal per workspace                                                                                                                   | root and workspace `package.json`, `scripts/release.mjs`, `CONTRIBUTING.md`, README, `docs/LEGAL.md`, WO-033's export paragraph                                                                                  |
| [WO-039](../work-orders/WO-039-harness-lowering.md)                   | harness lowering — the `harness-v1` compiler target (settings permissions and hooks at rung 2, role skills at rung 7, a marked residue block at rung 8), the Contributor build, `harness emit` and `check`, and this repository running on its own generated configuration                     | wave 1 lane A beside WO-032; phase 1 and the self-host are the fork-binding minimum; assign version at activation (minor); authorizes exactly the project-scope generated configuration mutation; ADR-0005 dated amendment | compiler and host implementer, then independent verifier; the live smoke needs the actual harness         | phase 0 harness smoke recorded in discovery before any lowering rule; Claude Code required, Codex where installed                                                     |
| [WO-040](../work-orders/WO-040-rule-migration-batch-one.md)           | rule migration — the generated migration ledger over every shape the operator named, batch one of at least twelve units through `harness-v1` into the Contributor build, the whole-set measurement, and the batch template                                                                     | umbrella record (2026-09-08): superseded whole by WO-096 to WO-098; not activatable; the text stays as the children's record; clean room applies with force                                                                | unit author and lowering implementer, then independent verifier                                           | none beyond WO-039's; the operator may add or strike candidate shapes by `ideation:` before activation                                                                |
| [WO-041](../work-orders/WO-041-plan-refutation-mechanism.md)          | control plane — a compiled blinded plan refuter over the marked sequence and the vision, the `plan-refutation-v1` result, immutable receipts under `docs/planning/refutations/`, and an evidence-gate check that refuses a planning pass without a matching receipt or with an unanswered hold | lane 0 beside WO-038; assign version at activation (patch); read-only envelope; forward-only enforcement from its merge                                                                                                    | script and loadout implementer, then independent verifier; the live receipt needs one actual transport    | one WO-009 transport for the live receipt; `fake` for fixtures                                                                                                        |
| [WO-042](../work-orders/WO-042-authority-provenance.md)               | composition — authority floor, admitted grants and envelope-projected inspection; operator breakout adds atomic executor supports, an intent queue and bounded adjacent repairs                                                                                                                | first in the 2026-09-08 horizon; application v0.16.0; compiler 0.8.0, skeleton 0.14.0 and console 0.1.2; saved-build compatibility and installed equipment compared separately                                             | compiler and host implementer, then independent verifier                                                  | deterministic compiler, render, queue and planning fixtures; actual harness for numbered live observations; current feedback source remains matched to its live audit | compiler authority and harness adapter; skeleton Contributor support equipment; local queue and planning-gate comparison; console default edition; generated bundle; products and receipts named by the breakout |
| [WO-043](../work-orders/WO-043-typed-dependency-truth.md)             | control plane — typed dependency blocks in open work orders, one shared projection for the index and `status --json`, one activation refusal on an unmet hard dependency or planning deferral, forward-only migration of every open order                                                      | beside WO-042 and WO-036; no open input; assign version at activation (patch); seeds from `docs/planning/critical-path-2026-09-08.json`; closed and historical orders are never edited                                     | control-plane implementer, then independent verifier                                                      | deterministic resume and work-order fixtures with a real-Git tag fixture; no network                                                                                  | `scripts/lib/dependencies.mjs` (new), `scripts/work-orders.mjs`, `scripts/resume.mjs`, open work-order metadata, generated index, products 06/07, playbook, this map's status and catalog text                   |
| [WO-044](../work-orders/WO-044-writing-worker-harness-truth.md)       | harness discovery — writing-worker rows in a foreign worktree and unattended-launch rows; the first replan checkpoint follows                                                                                                                                                                  | no open input; operator runs the live rows outside the sandbox; assign version at activation (patch)                                                                                                                       | probe author, then independent verifier                                                                   | the actual harnesses; a scratch repository outside the checkout                                                                                                       | `scripts/harness-probe.mjs`, `docs/discovery/`                                                                                                                                                                   |
| [WO-045](../work-orders/WO-045-store-and-hook-input-decoders.md)      | runtime codecs — positive decoders for the event log and the hook input                                                                                                                                                                                                                        | no open input; assign version at activation (minor); fresh evidence editions; live feedback audit operator-run                                                                                                             | kernel/skeleton implementer, then independent verifier                                                    | deterministic fixtures; the harness for the feedback audit                                                                                                            | `packages/kernel/src/store.ts`, `types.ts`, `packages/skeleton/src/harness-host.ts`, regenerated bundle pins                                                                                                     |
| [WO-046](../work-orders/WO-046-executable-program-split.md)           | runtime codecs — `ExecutableProgramV1` as a type and a continuation decoder                                                                                                                                                                                                                    | no open input; assign version at activation (minor)                                                                                                                                                                        | kernel implementer, then independent verifier                                                             | deterministic fixtures                                                                                                                                                | `packages/kernel/src/types.ts`, `core.ts`, the WO-101 corpus harness, skeleton continuation call sites                                                                                                           |
| [WO-047](../work-orders/WO-047-replay-environment-projector.md)       | runtime codecs — an optional environment projector for `replay` with a byte-identical default                                                                                                                                                                                                  | no open input; assign version at activation (patch or minor)                                                                                                                                                               | kernel implementer, then independent verifier                                                             | deterministic fixtures                                                                                                                                                | `packages/kernel/src/core.ts`, skeleton replay call sites, product 02                                                                                                                                            |
| [WO-048](../work-orders/WO-048-worker-host-on-disk-decode.md)         | runtime codecs — every on-disk value the worker and verification hosts trust is decoded before dispatch                                                                                                                                                                                        | no open input (after WO-045 recommended); assign version at activation (patch); live feedback audit operator-run                                                                                                           | skeleton implementer, then independent verifier                                                           | deterministic fixtures; the harness for the feedback audit                                                                                                            | `packages/skeleton/src/worker-store.ts`, `worker-host.ts`, `verification-host.ts`                                                                                                                                |
| [WO-049](../work-orders/WO-049-target-worktree-bundle.md) | harness lowering — emit a `target-worker` bundle into a foreign worktree under its local exclude, importing the launchpad's immutable snapshot by absolute path; hooks for Claude Code, instruction block for both harnesses (R1 design, 2026-09-16) | WO-042, WO-044 and WO-039 closed; R1 decided 2026-09-16; lane pair with WO-051, after WO-133's merge; assign version at activation (minor); operator runs the live smoke | compiler/scripts implementer, then independent verifier | a scratch foreign repository; the actual harnesses for the smoke | `packages/compiler/src/harness.ts`, `scripts/lib/harness.mjs`, `scripts/harness.mjs`, `packages/skeleton/src/loadouts/contributor.ts` |
| [WO-050](../work-orders/WO-050-reactor-typed-state-slices.md)         | skeleton structure — the reactor state split into typed slices behind one decider, traces byte-identical                                                                                                                                                                                       | no open input; assign version at activation (patch); live feedback audit operator-run                                                                                                                                      | skeleton implementer, then independent verifier                                                           | deterministic traces                                                                                                                                                  | `packages/skeleton/src/reactor.ts`, host selectors                                                                                                                                                               |
| [WO-051](../work-orders/WO-051-source-change-transport-profile.md) | worker transport — a separate writer request with its validator, prompt and result beside the untouched inspection request, and the `source-change-v1` launch shape for both CLIs from observed rows: exact allowed-tool patterns, the Codex named write profile, a host-written commit message (R1 design, 2026-09-16) | WO-044, WO-042 and WO-009 closed; lane pair with WO-049; assign version at activation (minor); no live launch | skeleton implementer, then independent verifier | process doubles only | `packages/skeleton/src/worker-protocol.ts`, `worker-transport.ts`, `execution-environment.ts`, `worker-store.ts` |
| [WO-052](../work-orders/WO-052-source-change-host.md)                 | worker host — a source-change episode as typed events with the commit identity as its effect receipt                                                                                                                                                                                           | WO-049, WO-050 and WO-051 merged; assign version at activation (minor); live feedback audit operator-run                                                                                                                   | skeleton implementer, then independent verifier                                                           | a real-Git scratch target with doubles                                                                                                                                | `packages/skeleton/src/source-change-host.ts` (new), `reactor.ts` (one slice), `worker-store.ts`                                                                                                                 |
| [WO-053](../work-orders/WO-053-first-external-source-change.md)       | live proof — the first external source change, with containment checked by the host and recorded from an outside terminal                                                                                                                                                                      | WO-052 merged; the operator runs the episodes; assign version at activation (patch); R2 follows                                                                                                                            | operator-run episodes; independent verifier reads the receipt                                             | the actual harnesses; a scratch repository                                                                                                                            | `docs/evidence/WO-053/`, a receipt-shape fixture                                                                                                                                                                 |
| [WO-054](../work-orders/WO-054-verification-over-real-worktree.md)    | verification — a worktree-snapshot profile with host-run tests and no implementer narrative                                                                                                                                                                                                    | WO-052 merged; assign version at activation (minor)                                                                                                                                                                        | skeleton implementer, then independent verifier                                                           | a scratch target with doubles                                                                                                                                         | `packages/skeleton/src/verification-host.ts`, `verification-protocol.ts`, `packages/compiler/src/verification.ts`                                                                                                |
| [WO-055](../work-orders/WO-055-repair-continuation.md)                | verification — a bounded repair order derived from a finding inside the original order's surfaces, named tests and effective envelope, re-verified from the original contract, with a round limit; an outside path or command hands off unless an admitted grant covers it                     | WO-054, WO-052 and WO-042 merged; assign version at activation (minor)                                                                                                                                                     | skeleton implementer, then independent verifier                                                           | doubles over the scratch target                                                                                                                                       | `packages/skeleton/src/repair.ts` (new), `reactor.ts`                                                                                                                                                            |
| [WO-056](../work-orders/WO-056-live-verification-and-repair.md)       | live proof — a planted defect caught by a live verifier, repaired, re-verified                                                                                                                                                                                                                 | WO-055 and WO-053 merged; the operator runs the episodes; assign version at activation (patch) Cleanup pass 2026-09-19 carry-ins: state whether host deadlines are the only stall bound (kernel Await timeouts decode and are never evaluated; WO-046 FINAL-001 obs 2), whether a repair writer may edit the test its re-verification runs (WO-055 FINAL-001 item 1), and record the first real-model observation of the rewritten writer prompt (WO-055 FINAL-001 R1) and of the Claude writer launch without the auto-memory flag (WO-051 VER-001 F1). WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. | operator-run episodes; independent verifier reads the receipt                                             | the actual harnesses; the scratch repository                                                                                                                          | `docs/evidence/WO-056/`                                                                                                                                                                                          |
| [WO-057](../work-orders/WO-057-browser-runtime-truth.md)              | discovery — whether a Playwright runtime installs, launches and dies cleanly here without the harness's server; an ADR-0002 amendment                                                                                                                                                          | no open input; operator runs the online rows; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | probe author, then independent verifier                                                                   | a throwaway package outside the workspace                                                                                                                             | `docs/discovery/`, ADR-0002 §Amendments, `docs/LEGAL.md`                                                                                                                                                         |
| [WO-058](../work-orders/WO-058-visual-and-network-claim-types.md)     | verification contract — `visual` and `network` claim types with witness rules, no browser                                                                                                                                                                                                      | no open input; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): treating a bound console error as an adverse witness unconditionally can reject a scenario whose expected behavior includes that error; reopen when a criterion that expects an error is satisfied, yet the console-capture rule alone makes a correct pass inadmissible. Receipt 036 known issue (2026-09-30): the edition cascade (four re-mints, a live episode, a console re-pin) may dominate a small contract change, as WO-057's machinery share of 0.478 did; reopen when WO-058's share exceeds it, and the next pass then asks whether contract-only changes need the whole cascade. | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/verification.ts`, product 02 and 10                                                                                                                                                       |
| [WO-059](../work-orders/WO-059-playwright-evidence-adapter.md)        | evidence adapter — a workspace package driving a synthetic app to produce the witnesses; the first runtime dependency                                                                                                                                                                          | WO-057 and WO-058 merged; assign version at activation (minor); inventory and NOTICE entries Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 036 known issue (2026-09-30): criterion 6 makes the browser-evidence suite fail when the pinned browser is absent, and every later order's `--review` gate would fail with it on a host without the binary; the executor records the missing-browser outcome as a distinct `unavailable` verdict or a documented skip, never a silent pass, and reopens the design if a gate fails only there. | adapter implementer, then independent verifier                                                            | a local browser; no MCP server                                                                                                                                        | `packages/browser-evidence/` (new), root manifest and lockfile, product 03                                                                                                                                       |
| [WO-060](../work-orders/WO-060-source-bundle-contract.md) | intake contract — `SourceBundle` v1 with a decoder, a hash and a screen that refuses a declared set of secret shapes and URL forms and states its limit (amended 2026-09-28) | no open input; paired with WO-167 at the head; assign version at activation (minor). Amended 2026-09-28: the screen's claim is bounded to a declared set; the export, the registry entry and the compiler release are named with what they owe (deterministic re-mints, the feedback carry, the console re-pin; no live episode); write-backs bounded at 800 bytes in product 03 and 300 in product 10; both gates in the final criterion. | compiler implementer, then independent verifier | deterministic fixtures | `packages/compiler/src/` (source-bundle module and the export), `scripts/lib/evidence-sources.mjs`, the console's pins, products 03 and 10 |
| [WO-061](../work-orders/WO-061-story-contract-compile.md)             | intake compile — classified, provenance-bearing statements and criteria; the source-revision guard                                                                                                                                                                                             | WO-060 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-058 (hard). | compiler implementer, then independent verifier                                                           | deterministic fixtures with an inference double                                                                                                                       | `packages/compiler/src/` (story-contract module), product 12                                                                                                                                                     |
| [WO-062](../work-orders/WO-062-github-issue-source-adapter.md)        | intake adapter — a read-only adapter over the GitHub CLI into a bundle                                                                                                                                                                                                                         | WO-060 merged; assign version at activation (minor); operator runs the live smoke Register note 2026-09-27: FUP-0113 (model-input exposure plans) reopens at this order's activation, the first external source text to reach a model input; decide then whether an exposure plan is part of the adapter's contract. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): WO-060's bundle has no omission field, while this adapter may omit a body or comment and store the remainder; the omitted-item record must stay consumable across WO-123's stop; reopen when a screened-out item carried a required or superseding decision and the vertical accepted the remaining bundle as complete without consuming the refusal or stopping. | skeleton implementer, then independent verifier                                                           | recorded CLI JSON; one personal public repository issue                                                                                                               | `packages/skeleton/src/` (source adapter), the CLI helper and stub                                                                                                                                               |
| [WO-063](../work-orders/WO-063-outward-artifact-lint.md)              | control plane — conventional-commit shape and two-part vocabulary camouflage over branch names, commits and pull-request text                                                                                                                                                                  | no open input; assign version at activation (patch)                                                                                                                                                                        | tooling implementer, then independent verifier                                                            | deterministic fixtures; the local-terms list where present                                                                                                            | `scripts/lib/outward-lint.mjs` (new), a committed vocabulary file                                                                                                                                                |
| [WO-064](../work-orders/WO-064-target-publish.md)                     | delivery adapter — push and pull request on a target under an explicit remote grant, body generated from artifacts                                                                                                                                                                             | WO-052, WO-063 and WO-042 merged; assign version at activation (minor); operator runs the smoke against a scratch remote; the REVIEW-002 pass's same-day boy-scout nomination (the `plan check` hoist) was withdrawn at the operator's direction and filed as WO-156                                                                                                   | control-plane implementer, then independent verifier                                                      | the CLI stub; a scratch remote                                                                                                                                        | `scripts/worktree.mjs`, `scripts/github-body.mjs`, product 07                                                                                                                                                    |
| [WO-065](../work-orders/WO-065-pull-request-state-observation.md) | delivery adapter — checks and review comments observed into classified events in the target-publish host's `publication/` log (amended 2026-09-28) | WO-064 closed (v0.43.0) and WO-060 merged; paired with WO-172 in the third slot; assign version at activation (minor). Amended 2026-09-28: the helper's path is `scripts/lib/github-repository.mjs`; the observer sits beside the target-publish host; each comment passes WO-060's declared screen with the forge host as the allowlist, and one refused comment is kept without its text; the resident cadence the order promised does not exist and is dropped; the operator's smoke has a fallback; both gates. No re-mint. | script-host implementer, then independent verifier | recorded JSON through a fake `gh`; the operator's scratch pull request | `scripts/lib/` (a new observer), `scripts/worktree.mjs`, `scripts/test-target-publish.mjs`, product 02 |
| [WO-066](../work-orders/WO-066-review-comment-resolution-loop.md)     | delivery loop — each automated comment or failing check derives a bounded repair until resolved or `NeedsHuman`                                                                                                                                                                                | WO-065 and WO-055 merged; assign version at activation (minor) Cleanup pass 2026-09-19 carry-in: `roundLimit` lives on the repair's original, not on a work-order field as WO-055's design line says; record one reading before reusing the derivation (WO-055 FINAL-001 item 3). Standard pass 2026-09-25 carry-ins, before its first target publication: record one reading of a Claude worker launch's effect on the operator's user-level Claude state (before/after digest of the user settings and project registry; WO-159 D009, FUP-e398c79e1b32e94b); run the source-change host's focused test run and the Claude writer's admitted test command with no network and writes confined to the worktree, as the host's permission settings allow (WO-157 D005, FUP-92fd86e53b44fa39; no OS sandbox exists on this host, WO-161); make every host Git read in the target's root immune to its repository configuration (`log.showSignature=false`, neutralised `gpg.program`; WO-157 D038, FUP-0a47198c1e076d4d). Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): one round per item bounds an item, not the whole loop when new review-item identities keep arriving; reopen when a representative run keeps accepting new item identities beyond its declared run budget or needs operator rescue to terminate while every item respects its one-round limit. | skeleton implementer, then independent verifier                                                           | doubles over recorded observations                                                                                                                                    | `packages/skeleton/src/` (the loop continuation), product 06                                                                                                                                                     |
| [WO-067](../work-orders/WO-067-presence-policy-compiled.md)           | composition — the presence policy: the progressive absence curve as phases, cadences and narrowing envelopes                                                                                                                                                                                   | WO-042 merged; assign version at activation (minor); the operator confirms the curve reading                                                                                                                               | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler` (types, compile, normalize, render), products 02/03/04, ADR-0007 §Amendments                                                                                                                 |
| [WO-068](../work-orders/WO-068-resident-host.md) | runtime — the offline resident process: recorded clock, WO-067's statechart, the `script` actor kind, idempotent restart and a `--once` tick for an outside scheduler (R1 design, 2026-09-16) | WO-067, WO-050, WO-044 and WO-009 closed; lane pair with WO-133; assign version at activation (minor) | skeleton implementer, then independent verifier | fake clock and doubles; no harness | `packages/skeleton/src/resident-host.ts`, `actor-catalog.ts`, `reactor.ts` (one slice), `dotln.ts` |
| [WO-069](../work-orders/WO-069-configuration-root.md)                 | control plane — `dotln.config.json` and one loader; absence reproduces today byte for byte                                                                                                                                                                                                     | no open input; assign version at activation (patch)                                                                                                                                                                        | control-plane implementer, then independent verifier                                                      | repository-wide fixtures                                                                                                                                              | `scripts/lib/config.mjs` (new), every `scripts/*.mjs` root literal, product 07 and 10                                                                                                                            |
| [WO-070](../work-orders/WO-070-beacon-portability.md)                 | control plane — one module identity for the build-free Beacon leaves; Beacons without the skeleton package                                                                                                                                                                                     | no open input; assign version at activation (patch) WO-069 carry-ins (2026-09-21): the packages' ignored local harness lane follows the launchpad configuration once the plane/kit module identity is settled (WO-069 D005); the measuring scripts (`harness-context`, `harness-probe`, `probe-codex-effort`, `harness-live-smoke`) take an explicit tool root for kit inputs while outputs keep the launchpad (D016); the qualification fixture builder's cross-root relative names (D017). | control-plane implementer, then independent verifier                                                      | Beacon fixtures                                                                                                                                                       | the seven `.mjs` leaves, `scripts/lib/beacons.mjs`, `beacon-observe.mjs`, `scripts/resume.mjs`                                                                                                                   |
| [WO-071](../work-orders/WO-071-registered-target-repositories.md)     | control plane — the `Repository:` field, registration with an authority profile applied through the floor                                                                                                                                                                                      | WO-069 and WO-042 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | fixtures with scratch repositories                                                                                                                                    | `scripts/lib/config.mjs`, `scripts/work-orders.mjs`, `scripts/resume.mjs`, products 07 and 12                                                                                                                    |
| [WO-072](../work-orders/WO-072-target-worktree-lifecycle.md)          | control plane — target worktrees from a launchpad with the emitted bundle, the local registry, reports in the launchpad, no-release close                                                                                                                                                      | WO-071 and WO-049 merged; assign version at activation (minor) WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-123 (hard, the source-change guard) and WO-167 (hard). Receipt 036 known issue (2026-09-30): the path-identity safety dependency on WO-123 rests on sequence position, not a typed edge; activating WO-072 before WO-123's final review, or reordering them, reopens it. Receipt 041 known issues (2026-10-07): WO-162-D004's register row asks for the source-change guard's path-identity fix before any order gives worktreeParent a consumer. This order is that consumer, and it assigns the fix to WO-123. The cost table shows WO-123 closed, but the subject does not show whether WO-123 landed the fix (criterion 3); reopen when At WO-072's activation base, the source-change guard still accepts a directory spelled in another letter case or reached through a volume alias (the WO-162-D004 reproduction). | control-plane implementer, then independent verifier                                                      | a real-Git launchpad-and-target fixture                                                                                                                               | `scripts/worktree.mjs`, `scripts/resume.mjs`, `scripts/release.mjs`, the playbook                                                                                                                                |
| [WO-073](../work-orders/WO-073-repository-class-and-profile.md)       | control plane — repository classes and on-demand profile documents; policy layers launchpad → class → repository                                                                                                                                                                               | WO-071 merged; assign version at activation (minor); target-application profiles are the fork's Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-167 (hard). Receipt 033 known issue (2026-09-28): the registration shape requires only an opaque class name while the new activation path requires a readable profile, so an existing registration may need migration; reopen when an otherwise valid existing target registration can no longer activate because its once-optional profile is absent, with no migration route that preserves its policy. Amended 2026-10-02: a registration may declare machine-user logins and admitted link hosts, read by the pull-request observer (WO-065 D015, decided by the pass; criterion 4); byte figures removed from the criteria; the delivery lane of the seventh pair beside WO-191. Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): nothing defines which class content is a convention a prose profile may override, so prose loaded on demand can prevail over an equipped class support with no compiled record; reopen when a profile statement and a class support or check conflict in one order and the compiled order does not record which prevailed. A declared but unreadable profile refuses activation, so a transient read failure blocks all work against that repository; reopen when such a refusal succeeds on a retry with nothing changed. Criterion 2 still allows a cold-start ceiling raise that WO-187 and WO-188 now forbid themselves; reopen when this order records a new cold-start acceptance. | control-plane implementer, then independent verifier                                                      | fixtures; the directed-load measurement                                                                                                                               | `scripts/lib/config.mjs`, the role skill render, `docs/repositories/`                                                                                                                                            |
| [WO-074](../work-orders/WO-074-launchpad-export-kit.md)               | starter — `launchpad export` with the manifest-listed kit, templates and license files                                                                                                                                                                                                         | WO-069, WO-070 and WO-038 merged; assign version at activation (minor); the reviewer reads the exported text Cleanup pass 2026-09-19 carry-in: criterion 5 asks for a version refusal the 2026-09-15 stand-down removed (receipt 017 known issue); amend before activation. 2026-09-19 (second pass): the export writes outside the project, so under WO-144 its role needs an operator-named outside root until order-named roots exist. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): The kit ships core's suites and a package.json with the same script names. Yet criterion 1 does not claim the export's npm test (the observed gap says a kit with no package source cannot start core's npm test), and WO-075 makes wiring harness check into it a non-goal. A stranger who runs the kit's own test command hits a failure. The platform lens calls that an accessibility failure, because the result should be usable by a stranger to the session (criterion 1); reopen when WO-118's exported instance or WO-082's fixture runs the export's npm test and it fails or is skipped, and the client README does not say so. | control-plane implementer, then independent verifier                                                      | offline `npm ci` for the export fixture                                                                                                                               | `scripts/launchpad.mjs` (new), the kit manifest generator, templates                                                                                                                                             |
| [WO-075](../work-orders/WO-075-kit-runtime-and-bundle.md)             | starter — the pinned runtime build and the Contributor bundle inside the export, `harness check` in its test chain                                                                                                                                                                             | WO-074, WO-049 and WO-042 merged; assign version at activation (minor); operator runs the smoke in the export WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. Onesie-twosie pass 2026-09-27 carry-in: plane/kit root resolution, carried from WO-069 D005, D016 and D017 by WO-070 D009 (FUP-a058e82c0bbd9b6d): one module identity for the remaining build-free package modules, an explicit tool root for kit inputs, fixture names computed against the fixture root; checked under a launchpad that is not the scripts' checkout; priority low, the executor decides at activation. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-049 now reference-only. Receipt 033 known issue (2026-09-28): a passing harness check and denied-effect smoke do not prove a fork actor can complete its required gates without package source; reopen when an exported instance following its generated role procedure reaches a required gate or bootstrap command that fails only because it tries to build omitted package source. Receipt 036 known issues (2026-09-30): no criterion records the hooks' behavior when the runtime snapshot they import is absent or mismatched; the executor records whether governance fails open or closed in that state. If the kit bundles compiled third-party code (WO-059's browser dependency among the candidates), LEGAL's THIRD_PARTY_NOTICES becomes due; the executor checks the export manifest. Receipt 041 known issues (2026-10-07): The smoke proves that a hook refuses a denied effect when the runtime is present. No criterion shows what happens when the exported runtime is missing or has drifted and nobody ran harness check. If the hooks then fail open, the fork runs ungoverned with no advisory. If they fail closed, every tool call refuses. Either way the mechanism fails in a manner the order does not state (criterion 3); reopen when A session is recorded in an export whose packages/<name>/dist has been removed or altered, and it neither refuses with a named cause nor prints an advisory. Taking up FUP-a058e82c0bbd9b6d ties five sources unrelated to the export (gate-evidence.mjs, writer-teardown.mjs, codex-continuation.mjs, harness-context.mjs, usage-observation.mjs) and a possible live feedback episode to the order WO-118 waits on. The last eight first verifications all failed, so a wider surface is likely to lengthen the S chain (criterion 5); reopen when WO-075's decisions take up the follow-up, and a verification or repair cycle is recorded on one of the criterion-5 files. | control-plane implementer, then independent verifier                                                      | the actual harness for the smoke                                                                                                                                      | `scripts/launchpad.mjs`, the emitter's import root                                                                                                                                                               |
| [WO-076](../work-orders/WO-076-instance-build-overlay.md)             | starter — the fork's `build/overlay.json` composed over the kit build under the floor                                                                                                                                                                                                          | WO-075 and WO-042 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-074 (hard). Receipt 041 known issues (2026-10-07): build: none emits only the hand-written floor. The subject does not say that floor states the instance carries no compiled refusals, hooks or verification, and the vision requires a profile that omits verification to say so (criterion 2); reopen when A build: none emit produces a floor that does not state that no compiled refusal, hook or verification governs the instance. | control-plane implementer, then independent verifier                                                      | fixture overlays                                                                                                                                                      | `scripts/harness.mjs`, `scripts/lib/harness.mjs`, the client README, ADR-0006 §Amendments                                                                                                                        |
| [WO-077](../work-orders/WO-077-launchpad-export-update.md)            | starter — `--update` by manifest, refusing modified kit files, printing instance actions                                                                                                                                                                                                       | WO-074 merged; assign version at activation (minor) WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-075 and WO-167 (hard). Receipt 033 known issue (2026-09-28): an update can retain a locally modified old kit file while rewriting the manifest to the new commit; how that mixed state is represented and read by the next update is not established; reopen when an update retains a modified file but records the kit as a clean new build, or a second update loses the retained file's ownership history or stops the resident resuming. Receipt 041 known issues (2026-10-07): A kit file the fork modified is refused on every later update and only listed. WO-074 copies product 07 (175,881 bytes) and the playbook whole into the kit, so any local edit freezes that file at its old upstream version for good, with no merge or diff path (a fork's upstream merge is a non-goal). Forks then drift from core's process text (criterion 1); reopen when An update run in the operator's fork refuses the same kit file on two consecutive updates. | control-plane implementer, then independent verifier                                                      | fixture exports                                                                                                                                                       | `scripts/launchpad.mjs`                                                                                                                                                                                          |
| [WO-078](../work-orders/WO-078-sibling-registry.md)                   | starter — the sibling registry and export receipts with a check                                                                                                                                                                                                                                | WO-074 merged; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-075, WO-077 and WO-167 (hard). Receipt 041 known issues (2026-10-07): The siblings check refuses in the document gate on a hand edit, a hash mismatch or a receipt that does not decode, instead of showing the entry as "not evidenced". A fault in an export-written receipt would stop the document gate of every core order (criterion 1); reopen when A document gate in an order that changed no sibling file is refused by the siblings check. The removal is prospective and small: two siblings and no recorded lookup. The check runs on every document gate. Naming a removal answers refutation receipt 009's concern but does not show the removal is larger (criterion 1); reopen when WO-078's execution record prices the lookup below the siblings check's recorded wall-clock multiplied by the document gates run between two sibling updates. | documentation/tooling implementer, then independent verifier                                              | fixture receipts                                                                                                                                                      | `docs/siblings/README.md`, `docs/evidence/siblings/`                                                                                                                                                             |
| [WO-079](../work-orders/WO-079-worktree-sync.md) | control plane — `worktree integrate`: the second lane's integration checklist as one command (checkpoint, named stash, merge main, regenerate generated surfaces, union the register, retime with a dated decision stub, print the affected checks); rewritten 2026-09-17 | no open input; pair 6 beside WO-099; assign version at activation (patch) Cleanup pass 2026-09-19 carry-ins: evidence editions are missing from the integration checklist, and merges made with hooks bypassed (`core.hooksPath`, `--no-verify`, `git reset --soft`) need a supported path (WO-135 FINAL-001 L1 and L2; WO-136 and WO-137 FINAL-001 L4). | control-plane implementer, then independent verifier | a real-Git fixture with two orders and a merged sibling; no network | `scripts/worktree.mjs`, `docs/PLAYBOOK.md` §Concurrency, product 07 §Independent workflows and integration, the reviewer skill line |
| [WO-080](../work-orders/WO-080-workstream-document-and-index.md)      | workstream application — the workstream document, field and index grouping with staleness                                                                                                                                                                                                      | WO-071 merged; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-167 (hard). | control-plane implementer, then independent verifier                                                      | fixtures                                                                                                                                                              | `scripts/work-orders.mjs`, `docs/workstreams/`, product 12                                                                                                                                                       |
| [WO-081](../work-orders/WO-081-board-workstreams-section.md)          | console — the board's Workstreams section as an additive view-model extension                                                                                                                                                                                                                  | WO-080 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): The goal standard requires prerequisite work to name the blocked outcome it enables. WO-081 names none, and WO-083's typed graph does not need it. With NoOp the same data stays in the index from WO-080 (criterion 1); reopen when WO-083's receipt records an intervention or restatement caused by workstream state the board did not show. | console implementer, then independent verifier                                                            | regenerated fixture expectations                                                                                                                                      | `packages/console`                                                                                                                                                                                               |
| [WO-082](../work-orders/WO-082-synthetic-pilot-six-demonstrations.md) | workstream application — product 12's six demonstrations as fixtures over a real-Git launchpad                                                                                                                                                                                                 | WO-080, WO-072 and WO-075 merged; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): the objective's collision reads broader than the gap's rule that separate worktrees in one repository are allowed; reopen when the collision demonstration or the implementation refuses two conforming writers in separate worktrees only because their repository is the same. Receipt 041 known issues (2026-10-07): The suite with three real-Git repositories goes into the product gate with its wall-clock recorded but not bounded. Every later order pays for it on every fresh gate, the shared cost WO-197 is spending an order to reduce (criterion 1); reopen when The suite's recorded wall-clock pushes a fresh plain npm test above six minutes on the operator's host (the stand-down reversal condition this order names). | fixture implementer, then independent verifier                                                            | a real-Git fixture with three targets                                                                                                                                 | the fixture suite, product 12                                                                                                                                                                                    |
| [WO-083](../work-orders/WO-083-real-run-launchpad-instance.md)        | workstream application — the operator-witnessed run from the fork against the Angular repository, recorded here as a receipt                                                                                                                                                                   | WO-082, WO-064, WO-076 and WO-073 merged; the fork's planning pass plans the shell; assign version at activation (minor) Register note 2026-09-27: FUP-0073 (the stranger test) reopens at this order's close; the roadmap's v1.0.0 exit is a witnessed run by a non-author. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-078 (hard). Receipt 041 known issues (2026-10-07): Criterion 4 writes the Angular consumer's entry through WO-078's generator, with its check passing, but the critical path lists WO-083's typed prerequisites as WO-118, WO-082 and WO-073 only. WO-078 is not reached through any of them, so only the sequence protects this dependency (criterion 4); reopen when WO-083 is activated while WO-078 is not closed, or the siblings generator is missing at WO-083's base. The title says the run goes "through executor, verifier and reviewer sessions under the fork's emitted build". The objective instead has the fork's resident drive the order with its own actors, and the non-goals exclude manually opened sessions as the executors. The receipt could count either shape as the route (criterion 1); reopen when WO-083's receipt records manually opened executor, verifier or reviewer sessions and still counts the run as the route driven by the resident. | launchpad-dispatched sessions from the fork; independent verifier counts the measures                     | the operator's fork and target repositories                                                                                                                           | `docs/evidence/WO-083/`, the sibling registry, products 12/04/13/06                                                                                                                                              |
| [WO-084](../work-orders/WO-084-ledger-order-and-index.md)             | documentation — one ledger insertion rule, a generated index and check, Resolutions moved                                                                                                                                                                                                      | deferred (waivable) until WO-053; assign version at activation (patch) Moved 2026-09-19: lane pair with WO-142; deferral lapsed when WO-053 closed; check in the document suite; headings byte-identical. | documentation/tooling implementer, then independent verifier                                              | repository-wide checks                                                                                                                                                | `docs/lineage/`, `scripts/lineage.mjs` (new), `CLAUDE.md` §Start here                                                                                                                                            |
| [WO-085](../work-orders/WO-085-spec-receipt-boundary.md) | documentation gate — product documents stop accreting: a docs check with per-document byte ceilings (`docs/control/doc-ceilings.json`), refusing a new dated receipt paragraph or candidate heading under `docs/product/` and a decision dispatch without a control prefix, with WO-090 D007's anchor and link resolution; the edit-in-place rule bound to it (rewritten 2026-09-25) | none open (the WO-053 deferral lapsed 2026-09-18); assign version at activation (patch). WO-090 carry-in (2026-09-21): the docs check resolves in-repo Markdown anchors against their target headings, covers hand-written links (a correct link, a short-form link whose heading carries a title, a missing file, a generated index row), and declares the 41 unresolved decision anchors already in closed reports as historical exceptions rather than failures (WO-090 D007). Register carry-in: FUP-87ed701db7d7209e (WO-153 D008, the dispatch-prefix rule and check; the sweep stays out). | documentation/tooling implementer, then independent verifier | repository-wide checks in the document gate | `scripts/docs-check.mjs` (new), `docs/control/doc-ceilings.json` (new), products 07 and 08 (two sentences), `docs/README.md` |
| [WO-086](../work-orders/WO-086-generated-release-history.md) | documentation/release machinery — the roadmap's Release boundary generated from local annotated tags by `release list --markdown` between checked markers; the 545 lines of hand-kept notes preserved verbatim in a planning receipt; `release prepare` records a collision as the integration decision, never roadmap or README prose (rewritten 2026-09-25) | WO-164 closed (v0.52.7); paired with WO-117 in the fourth slot, after the fold and after WO-060 (both write product 10); assign version at activation (patch); lowers 06's ceiling Amended 2026-09-27: retires the docs check's heading exemption of 06 §Release boundary for one registered generated block and restates 06's ceiling from its counted bytes (WO-085 D009 O3; D015 V2 and V7). Amended 2026-09-28: figures re-observed at `5f3849ec` (Release boundary 910 lines, 68,433 exempt bytes, 109 tags); the receipt file is `docs/planning/release-history-notes.md`. | tooling implementer, then independent verifier Receipt 032 known issue to carry into the executor's decisions: name the command that regenerates the table when a release lands and say whether a recorded tag the checkout lacks fails the check, as the index check does today (criterion 1). | local annotated tags; the README block check | `scripts/release.mjs`, `scripts/lib/release-preparation.mjs`, products 06 and 10, README, one product 07 sentence, `docs/planning/release-history-notes.md` (new) |
| [WO-087](../work-orders/WO-087-roadmap-split.md) | documentation — the roadmap's candidate and policy sections (864 lines) move to this map under their slugs with register reconciliation; no new product document (rewritten 2026-09-25) | after WO-086 (both edit 06); a one-entry slot after WO-117 and WO-086; not beside WO-066, which also edits 06; assign version at activation (patch); lowers 06's ceiling. Amended 2026-09-28: the range is named by its headings (lines 931–1794 at `5f3849ec`). | documentation implementer, then independent verifier | publication index and locks; `npm run meta` | product 06, this map, `docs/publication/`, `docs/README.md`, the register |
| [WO-088](../work-orders/WO-088-phrase-table-single-source.md)         | documentation — the phrase table generated between markers in three files                                                                                                                                                                                                                      | deferred (waivable) until WO-053; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-167 (hard). Receipt 033 known issue (2026-09-28): the guide holds eleven rows, seven resume phrases and the waive, withdraw, correct and override-off routes; a check that rejects any row outside the seven-entry list conflicts with keeping those routes; reopen when the check rejects one of the four retained routes because it is outside the generated list, or a route is removed to make the check pass. Receipt 041 known issues (2026-10-07): By its own Cost line, NoOp has no observed cost: the copies agree, and the original omission was not reproduced. The order adds a refusing document check against a risk that has not been seen since 2026-09-19 (criterion 1); reopen when A copy of the resume phrases is seen to disagree with the compiled Contributor's intents, for example after WO-192 edits the same 07 section. At that point the emitter earns its cost. | tooling implementer, then independent verifier                                                            | repository-wide checks                                                                                                                                                | `scripts/resume.mjs`, product 07, the playbook, the README                                                                                                                                                       |
| [WO-089](../work-orders/WO-089-capability-table-fold.md)              | documentation — addenda folded into rows; the missing verification row; no unearned level                                                                                                                                                                                                      | deferred (waivable) until WO-053; changes the refutation subject; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): the capability history holds distinct `runtime.resident` assessments, one later row preserving WO-147's recovery judgment; one latest level per id must not let independent scopes supersede each other; reopen when the prepared or installed row drops the scope or citation of a still-valid assessment, or turns the latest bounded level into a reassessment of all `runtime.resident` behavior. | documentation implementer, then independent verifier                                                      | none                                                                                                                                                                  | `docs/planning/capability-table.md`                                                                                                                                                                              |
| [WO-090](../work-orders/WO-090-shorter-cold-start.md)                 | documentation — the guide reduced to the operating contract with the directed-load total measured lower                                                                                                                                                                                        | deferred (waivable) until WO-053; assign version at activation (patch) Moved 2026-09-19: lane pair with WO-145, after WO-142, WO-144 and WO-140 write product 07 and the role text. | documentation implementer, then independent verifier                                                      | the directed-load measurement                                                                                                                                         | product 07, `docs/AI-HARNESS-SECURITY.md`, the playbook                                                                                                                                                          |
| [WO-091](../work-orders/WO-091-multi-active-link-groups.md)           | pattern workshop — several actives in one link group with shared supports; hashes hold                                                                                                                                                                                                         | deferred (waivable) until WO-053; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): Precedence and commutativity apply per active, but an ExplicitPipeline names a link group, and more than one pipeline per group stays refused. If two actives in one group need opposite orders for the same pair of shared non-commuting supports, the graph cannot express it and refuses, so the per-active semantics are only partly delivered (criterion 2); reopen when WO-093's six-active group or WO-095's scenario needs two actives to order a shared non-commuting pair differently, or a fixture with that shape is refused. | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/compile.ts`, products 02 and 10                                                                                                                                                           |
| [WO-092](../work-orders/WO-092-sets-graph-extension.md)               | pattern workshop — the additive `sets` collection with view codecs and arming inspection                                                                                                                                                                                                       | WO-091 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): WO-091 makes emissions, envelopes and claims per active, but a set bonus is lowered "into the program" with no stated active, seed or envelope to attach to. WO-094's Safety bonus is a permission guard plus a statechart gate, and what those mean depends on which active's envelope they narrow (criterion 2); reopen when WO-094's six-piece bonus fixture cannot name which active's envelope the permission guard applies to, or it lowers the guard to every active in the group with no recorded rule. | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/types.ts`, `normalize.ts`, `views.ts`, products 02/04/10                                                                                                                                  |
| [WO-093](../work-orders/WO-093-five-s-mechanics-as-data.md)           | pattern workshop — the five remaining 5S mechanics as typed data                                                                                                                                                                                                                               | WO-091 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): One term, Seiketsu (Standardize), is a support in the Entropy Reducer and an active here. The differentiated interface requires every view to compile to the same normalized program, but with two shapes for one term the same card can compile differently depending on the loadout. Criterion 2 records the difference but does not resolve it (criterion 2); reopen when A loadout equips both the Entropy Reducer's seiketsu-standardize support and WO-093's Standardize active and compiles conflicting or duplicated emissions. Product 05 keeps Sustain a candidate until an observed cadence justifies it. This order compiles Shitsuke as "the cadence", and its criterion 3 write-back replaces 05's sentence on which pieces are compiled, which could drop the candidate status without the observation 05 requires (criterion 3); reopen when Criterion 3's write-back to product 05 removes Sustain's candidate status without citing an observed cadence. | skeleton implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/skeleton/src/loadouts/`, product 05                                                                                                                                                                    |
| [WO-094](../work-orders/WO-094-set-bonuses-lowered.md)                | pattern workshop — the five bonuses armed or dark; the Safety gate refuses                                                                                                                                                                                                                     | WO-092 and WO-093 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): Criterion 2 checks only refusals: the base case, and each case where isolation, evidence, independent verification or explicit approval is missing or does not decode. There is no fixture where all four are present and the change is admitted. A gate that refuses everything would pass, so the stated meaning ("legal only with" the four conditions) is never shown (rule beating) (criterion 2); reopen when A fixture with all four conditions present and decodable is recorded and the gate refuses it, or WO-095's scenario only ever exercises the refusing path. | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | the 5S set definition, compiler fixtures, products 04 and 05                                                                                                                                                     |
| [WO-095](../work-orders/WO-095-full-set-scenario-and-render.md)       | pattern workshop — the full-set scenario with live and replay identity; the set tooltip render                                                                                                                                                                                                 | WO-094 and WO-032 merged; must not edit `packages/console`; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 036 known issue (2026-09-30): a renderer change moves the compiler release and the policy hash the console binds, tying policy identity to view code; a re-pinned hash with byte-identical normalized programs reopens the coupling. | skeleton implementer, then independent verifier                                                           | deterministic fakes                                                                                                                                                   | `packages/skeleton/src/scenario.ts`, the CLI, `render.ts`, product 06, README                                                                                                                                    |
| [WO-096](../work-orders/WO-096-migration-ledger.md)                   | rule migration — the generated migration ledger over every named shape, with the local-terms check                                                                                                                                                                                             | deferred (waivable) until WO-053; clean room applies with force; assign version at activation (patch) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 041 known issues (2026-10-07): Only the executor counts the denominator, from an ignored intake capture. The verifier judges the digest, the disclosure and the sum but does not re-read the intake, so a miscounted or omitted shape passes, and the ledger meant to measure the vision's success metric can be wrong where nobody can see (criterion 1); reopen when WO-097, WO-098 or a later planning pass finds a shape in the pinned capture that has neither a row nor an exclusion count. | ledger author, then independent verifier                                                                  | the local-terms list                                                                                                                                                  | `corpus/feedback/migration.json` (new), its renderer and check, `docs/lineage/feedback-migration.md`                                                                                                             |
| [WO-097](../work-orders/WO-097-rule-migration-batch-1a.md)            | rule migration — six rung-one and rung-two units with retirements and the reverse mapping                                                                                                                                                                                                      | WO-096 merged; assign version at activation (minor); live feedback audit operator-run Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): hook-lowered units do not fire under the Codex profile and survive as role-text residue; a reverse mapping and a hook fixture elsewhere do not establish equivalent behavior there; reopen when a retired rule loses its effective instruction or checked behavior in a supported profile where the replacement hook does not fire, although the reverse-mapping and hook fixtures pass. Receipt 036 known issue (2026-09-30): each unit adds a generated line per role skill and a Codex residue line (about 1,140 bytes per role before retirements offset them) against release-close's 799 bytes of headroom; criterion 4's per-unit comparison must show retired bytes exceeding generated bytes for every role, or record the raise. Receipt 041 known issues (2026-10-07): When regenerated text exceeds a cold-start ceiling, criterion 4 accepts raising the ceiling. Meanwhile the drift-to-low-performance observation records the executor root already in breach, and the acceptances record every role's ceiling raised repeatedly. The migration meant to shrink always-on text could end with more of it and still pass (criterion 4); reopen when WO-097's recorded per-unit instruction-byte comparison shows any role's cold-start bytes higher after the batch than at its base, or a coldStartBytes acceptance citing WO-097 is added to budgets.json. The reverse-mapping fixture proves every retired sentence maps to a covering unit, but the order records that hook-lowered units do not fire under the Codex profile. For Codex sessions the evidence passes while only residue text carries the behavior, so coverage can be claimed without the mechanism running (rule beating) (criterion 4); reopen when A retired sentence's covering unit is hook-lowered, the Codex profile shows no hook firing for it, and WO-098's render still counts it as mechanism. | unit author and lowering implementer, then independent verifier                                           | the actual harness for the feedback audit                                                                                                                             | the compiler's feedback module, skeleton loadouts, retired prose, the regenerated bundle                                                                                                                         |
| [WO-098](../work-orders/WO-098-rule-migration-batch-1b.md)            | rule migration — six more units including a skill and a cadence unit; the whole-set measurement and template                                                                                                                                                                                   | WO-097 merged; assign version at activation (minor); live feedback audit operator-run Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). Receipt 033 known issue (2026-09-28): the counts can move in the required direction while total role load, which is only reported, rises; reopen when the batch meets its count targets but raises the measured role load or recurring interventions with no recorded compensating benefit, and that result is used to justify another batch. Receipt 036 known issue (2026-09-30): the required direction (mechanisms up, prose down) follows by construction; the directed-load total is reported but has no required direction, and a rung-seven role-skill unit is itself role text. A total higher than at WO-097's base reopens it. Receipt 041 known issues (2026-10-07): Success is defined as a direction in counts (more mechanism rows, fewer prose rows). The directed-load totals are reported but nothing requires them to fall. The vision's first thesis is about always-on context, so this order can pass while every role's directed load rises (seeking the wrong goal) (criterion 4); reopen when WO-098 reports a directed-load total for any role that is higher after the order than at WO-097's activation base, while criterion 4 passes. A rung-seven unit lowers into a role skill, and that role loads the text at cold start. Unless WO-096's declared always-on set includes the role skills, which the subject leaves undefined, the render counts that text as mechanism instead of prose (criterion 1); reopen when The render counts the rung-seven unit under mechanism while its text is loaded in a role skill at cold start and WO-096's always-on set excludes role skills. | unit author and lowering implementer, then independent verifier                                           | the actual harness for the feedback audit                                                                                                                             | the same surfaces, products 02/06/13, README, capability table                                                                                                                                                   |
| [WO-099](../work-orders/WO-099-mission-check.md)                      | runtime — the cadence-driven mission check with a hold; the first unattended proof                                                                                                                                                                                                             | WO-068 merged; the operator runs the unattended row; assign version at activation (minor); live feedback audit operator-run                                                                                                | skeleton implementer, then independent verifier                                                           | the actual harness as verifier; a fixture resident                                                                                                                    | the episode protocol, the resident's hold, the Contributor policy's cadence, products 02/03                                                                                                                      |
| [WO-100](../work-orders/WO-100-preauthorized-portfolio.md)            | runtime — the preauthorized portfolio and pure work derivation from the Gardener's candidates                                                                                                                                                                                                  | WO-068, WO-052, WO-054 and WO-042 merged; assign version at activation (minor); live feedback audit operator-run; the REVIEW-002 pass's same-day boy-scout nomination (the refusals paragraph emitted once) was withdrawn at the operator's direction and filed as WO-155                                                                                                           | skeleton implementer, then independent verifier                                                           | doubles over the scratch target                                                                                                                                       | the configuration schema, `packages/skeleton/src/portfolio.ts` (new), the resident's activation path, products 03/06/07                                                                                          |
| [WO-110](../work-orders/WO-110-local-model-transport.md)              | worker transport — a third transport over the local inference endpoint for the inspection profile                                                                                                                                                                                              | no open input (WO-068 recommended first); activation does not wait for WO-137's outcome: doubles plus a `ready` or `unavailable` live row, no qualification claimed; assign version at activation (minor); operator runs the smoke Cleanup pass 2026-09-19 carry-ins: remove the "until WO-110" string at `packages/skeleton/src/actor-catalog.ts:84`; fix the two recorded probe-client defects before reusing `scripts/probes/local-runner-*.mjs` (WO-137 FINAL-001 O1 to O3). | skeleton implementer, then independent verifier                                                           | the operator's local endpoint                                                                                                                                         | `packages/skeleton/src/worker-transport.ts`, the actor catalog, `environment.md`                                                                                                                                 |
| [WO-111](../work-orders/WO-111-unattended-live-proof.md)              | live proof — the unattended hour: 5S work derived, executed, verified and stopped on return                                                                                                                                                                                                    | WO-100, WO-099, WO-053 and WO-054 merged; the operator runs the window; assign version at activation (patch); R2 follows WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. 2026-09-21: WO-147 precedes it (the contention race stated as a limit in the `runtime.resident` row); a real bound worktree (WO-148) is where WO-099 D016's selection-policy signal, an `unknown` hold because generated evidence crowds the capsule, would first show. | operator-run window; independent verifier reads the receipt                                               | the actual harnesses; a seeded scratch repository                                                                                                                     | `docs/evidence/WO-111/`, a seed generator                                                                                                                                                                        |
| [WO-112](../work-orders/WO-112-core-run-loop-proof.md)                | live proof — WO-123's composition run once against a scratch issue and target, the representative scenario fully resolved and a control scenario proving legitimate escalation                                                                                                                 | every primitive gate merged (see the order); the operator witnesses; assign version at activation (minor); R3 follows WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. Register note 2026-09-27: FUP-0091 (Context Continuity) reopens at this order's activation, the first loop that assembles a call's context from durable work state. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | operator-witnessed composition; independent verifier reads the receipt                                    | the actual harnesses; a scratch target and issue in a personal public repository                                                                                      | the `dotln vertical` command, `docs/evidence/WO-112/`, products 06 and 12                                                                                                                                        |
| [WO-113](../work-orders/WO-113-work-order-files-stable-contracts.md)  | control plane — the five-surface separation checked forward from a cutoff; open orders' dated notes migrated                                                                                                                                                                                   | WO-043 merged; assign version at activation (patch)                                                                                                                                                                       ; 2026-09-22: WO-157 criterion 14 versions the WorkOrderIdentityAllocated authority check ahead of this order's section contract (WO-120 D007) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-167 (hard). Receipt 033 known issue (2026-09-28): the dependency refusal still advises a dated reviewed note, which this order's check rejects for new contracts and which the order leaves unchanged; reopen when a valid dependency repair follows the retained advice and then fails the new index check, or an operator must discover another recording route. Receipt 041 known issues (2026-10-07): The new check fails closed in the document gate. The dependency refusal still tells the operator to change a relation "in this authority file with a dated reviewed note" (left as a follow-up). Following one guard's advice therefore trips the other, in the same horizon that makes document ceilings advisory (criterion 1); reopen when A planning pass or executor records a refusal by the new check for a note that another guard or product 07 told it to write, or guard refusals in orders after WO-113 rise above the last five orders' series (5, 34, 0, 19, 10). | tooling implementer, then independent verifier                                                            | repository-wide checks                                                                                                                                                | `scripts/work-orders.mjs`, open order files, evidence READMEs, product 07                                                                                                                                        |
| [WO-114](../work-orders/WO-114-runtime-status-projection.md)          | console — `runtime-status-v1` written by the resident and rendered by the text host                                                                                                                                                                                                            | WO-068 merged; assign version at activation (minor)                                                                                                                                                                        | runtime/console implementer, then independent verifier                                                    | a fixture resident with a fake clock                                                                                                                                  | the contract module, the resident's writer, `packages/console`, product 04                                                                                                                                       |
| [WO-115](../work-orders/WO-115-console-parity-contract.md)            | console — every UI command is the terminal's command over a local loopback surface, no second authority                                                                                                                                                                                        | WO-068 and WO-114 merged; assign version at activation (minor)                                                                                                                                                             | runtime/console implementer, then independent verifier                                                    | loopback fixtures                                                                                                                                                     | the resident's loopback server, `packages/console` client, products 04 and 07                                                                                                                                    |
| [WO-116](../work-orders/WO-116-audit-projection-served.md) | console — a terminal read command over a resident store's audit projections, named in the parity contract so the surface serves the terminal's bytes (amended 2026-09-28) | WO-115 closed (v0.52.0); paired with WO-173 in the second slot; assign version at activation (minor). Amended 2026-09-28: the terminal command is a deliverable, because the contract names terminal commands and none renders a store's audit; the privacy clause is replaced by byte identity with the terminal, because product 09 defers the projections' access rules; the fold in `audit.ts` is a registered source and is not edited. | runtime/console implementer, then independent verifier | fixture logs | `packages/skeleton/src/dotln.ts` and `console-commands.ts`, `packages/console`, products 09 and 04, the console README |
| [WO-117](../work-orders/WO-117-console-live-host.md) | console — the live text console as a client of the resident, with the resident's index-source hardening, proven in a witnessed session (amended 2026-09-28) | WO-114, WO-115 and WO-099 closed, WO-116 merged; paired with WO-086 in the fourth slot; the operator witnesses; assign version at activation (minor). Amended 2026-09-28: status refresh, `commands` and `invoke` already ship, so the order adds the combined mode; the equip preview and build authoring leave it (no terminal command); the 2026-09-27 carry-in (WO-114 D013, FUP-4656197433cb8b3d) is criterion 3, a bad index source degrading to orders unavailable, and its re-mints are named (`resident-store.ts` is a common evidence source); the witnessed session has a fallback; both gates. | console implementer; operator-witnessed session; independent verifier | the real resident and harness | `packages/console`, `packages/skeleton/src/dotln.ts`, `packages/skeleton/src/resident-store.ts`, `docs/evidence/WO-117/`, product 04, README, the capability table |
| [WO-118](../work-orders/WO-118-resident-owned-loop-from-starter.md)   | live proof, the product exit — from a starter instance, one intent and standing grants carry the loop through the resident to a terminal pull-request state, surviving an actor death and a resident restart                                                                                   | every named primitive, runtime and UI order merged; the operator witnesses; assign version at activation (minor); a failed run does not close it; R3 follows WO-144 carry-in (2026-09-19): name any outside destination root and equip its provenance-bearing operator grant on the executing role/support; order contracts do not yet supply active grants automatically. Register note 2026-09-27: FUP-0107 (budget-window work-order ladders) reopens at this order's close. Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-116 (hard). Receipt 041 known issues (2026-10-07): If the witnessed run has not happened by handoff, criterion 1 hands it to the operator's own terminal (dotln resident, then dotln intent) with a list of inputs. The observed gap also records that order contracts supply no outside-project write grants. The product exit could therefore close on operator labor, the burden the mission says to remove; WO-112 recorded 22 operator directions and 2 overrides (criterion 1); reopen when WO-118 closes with criterion 1 recorded unmet or waived, or its operator directions in the shifting-the-burden series exceed WO-112's 22. Criterion 2 (an actor killed, the resident restarted) depends on WO-199. WO-199's Cost line says WO-118 cannot meet it until those three defects are gone. The critical-path typed graph for WO-118 omits WO-199, so only the sequence position protects that dependency (criterion 2); reopen when WO-118 is activated while WO-199 is open, or the dependency check admits that activation. | operator-witnessed instance run; independent verifier reads the receipt                                   | a scratch starter instance, target and issue; the actual harnesses                                                                                                    | `docs/evidence/WO-118/`, products 00 and 12, README, capability table                                                                                                                                            |
| [WO-119](../work-orders/WO-119-executable-discovery-producer.md)      | runtime — a `script` actor episode discovers a target's real imperfections and emits typed candidates with evidence, executable subset only                                                                                                                                                    | WO-068, WO-046 and WO-023 merged; assign version at activation (minor)                                                                                                                                                     | skeleton implementer, then independent verifier                                                           | a fixture repository; one scratch live row                                                                                                                            | `packages/skeleton/src/discovery.ts` (new), the `WorkCandidate` contract, product 05                                                                                                                             |
| [WO-120](../work-orders/WO-120-derived-work-identity.md)              | control plane — runtime-derived and UI-filed orders as durable records with the same identity and lifecycle; `dotln intent`                                                                                                                                                                    | WO-043 and WO-069 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | fixtures                                                                                                                                                              | `scripts/lib/derived-orders.mjs` (new), `scripts/resume.mjs`, `scripts/work-orders.mjs`, the `intent` command, products 06 and 07                                                                                |
| [WO-121](../work-orders/WO-121-presence-signals-with-origin.md)       | runtime — human, actor and task signals distinguished by hook event kind and the resident's stamp; tool activity from any session never implies return; return cancels only discretionary work                                                                                                 | WO-068, WO-067 and WO-044 merged; assign version at activation (minor)                                                                                                                                                     | skeleton/compiler implementer, then independent verifier                                                  | a fake clock; the actual harness for the feedback audit                                                                                                               | the resident's presence fold, the generated hooks' heartbeat, product 03, ADR-0007 §Amendments                                                                                                                   |
| [WO-122](../work-orders/WO-122-actor-catalog-cli-and-human.md)        | runtime — the `cli-worker` and `human-handoff` actor kinds by the observed launch path                                                                                                                                                                                                         | WO-068, WO-051 and WO-044 merged; assign version at activation (minor); operator runs the live row                                                                                                                         | skeleton implementer, then independent verifier                                                           | doubles; the actual harnesses for the live row                                                                                                                        | the actor catalog, the handoff packet writer, product 03                                                                                                                                                         |
| [WO-123](../work-orders/WO-123-vertical-composition.md)               | delivery — the vertical continuation from a filed intent to a terminal state with per-step receipts, entered by the resident under a portfolio's `intent` class and admitted grants or by `dotln vertical`, proven with doubles                                                                | the named primitives, WO-068, WO-100, WO-120 and WO-042 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4); typed dependency WO-063 and WO-167 (hard). Amended 2026-10-02: re-observed at `08845c71`; WO-184 is a hard dependency and settles the inherited seams first, the review loop's outcome defects among them; every carry-in and receipt known issue this row held is now in the order's own Known issues and carry-ins section, which the verify briefing prints once WO-187 lands (the planning document §9). Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): every draft `dotln intent` files still says human review is required, while the resident may admit it under an intent entry; reopen when an admitted draft's review constraint is reported unmet or its activation unauthorized, or a status view shows the constraint without the admission that superseded it. Parity between the two entries is checked only from a convergence step the executor names; reopen when that step is later than the contract step, or the resident path reaches a derived order without the contract and surface derivation the command path runs. A path-identity variant the fixture host cannot construct is recorded and skipped; reopen when the host constructs fewer than all three variant kinds and the criterion is judged passing on the rest. | skeleton implementer, then independent verifier                                                           | doubles and a fake clock                                                                                                                                              | the continuation, the admission, the command, products 07 and 03                                                                                                                                                 |
| [WO-124](../work-orders/WO-124-impact-surfaces-derivation.md)         | intake — surfaces and tests derived from the contract, the profile and a snapshot, labeled by origin, with a confidence gate                                                                                                                                                                   | WO-061 and WO-054 merged; assign version at activation (minor) Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | compiler/skeleton implementer, then independent verifier                                                  | fixtures                                                                                                                                                              | the story-contract module, a snapshot index reader, products 03 and 06                                                                                                                                           |
| [WO-125](../work-orders/WO-125-codex-effort-selection.md)             | worker transport — the Codex adapter accepts the declared effort levels and forwards the reasoning-effort override from an observed row                                                                                                                                                        | no open input; the operator runs the probe row outside the sandbox; assign version at activation (patch); first if the Codex refuter is wanted at max                                                                      | skeleton implementer, then independent verifier                                                           | the actual Codex CLI for the row; doubles in tests                                                                                                                    | `packages/skeleton/src/worker-transport.ts`, the refutations README, product 07, `environment.md`                                                                                                                |
| [WO-128](../work-orders/WO-128-fresh-gates-pass-first-time.md)        | test infrastructure — load-derived deadlines, scheduler load classes, per-task concurrency in the gate row, the exclusivity workaround re-measured                                                                                                                                             | first of the three gate orders, alone in its lane; assign version at activation (patch); the operator runs five fresh gates outside the sandbox                                                                            | runner and fixture implementer, then independent verifier                                                 | the operator's host for the fresh-gate series; slow doubles in fixtures                                                                                               | `scripts/test-runner.mjs`, `packages/console/src/collect.ts`, `scripts/test-harness.mjs`, `scripts/test-plan-refutation.mjs`, `scripts/test-runner.test.mjs`, product 07                                         |
| [WO-129](../work-orders/WO-129-suite-evidence-input-identity.md)      | test infrastructure — the suite key of declared inputs, the cache shared across worktrees under the Git common directory, explained misses                                                                                                                                                     | after WO-128 in the same lane; assign version at activation (patch); the operator records one composed gate after a transition                                                                                             | runner and fixture implementer, then independent verifier                                                 | two-worktree fixtures; generated hooks for the cache-path refusal                                                                                                     | `scripts/lib/suite-evidence.mjs`, `scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`, `scripts/test-process-debt.mjs`, product 07                                                                      |
| [WO-130](../work-orders/WO-130-declared-suite-inputs-replica.md)      | test infrastructure — narrowed suites execute inside a replica of their declared inputs; the six reviewed scopes migrate; package suites stop re-executing for source they never read                                                                                                          | after WO-129 in the same lane; assign version at activation (patch); the operator records one fresh gate and one composed source change                                                                                    | runner and fixture implementer, then independent verifier                                                 | plain copies in ignored scratch; no new dependency                                                                                                                    | `scripts/lib/suite-evidence.mjs`, `scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`, `scripts/test-process-debt.mjs`, product 07                                                                      |
| [WO-131](../work-orders/WO-131-remaining-suites-under-replica.md)     | test infrastructure — the remaining suites declared and executed in replicas or retained with a reason; document-only gates compose; a kernel denial where the host permits it                                                                                                                 | after WO-130 in the same lane; assign version at activation (patch); the operator records one composed document-only gate and the terminal probe                                                                           | runner and fixture implementer, then independent verifier                                                 | replica execution from WO-130; `sandbox-exec` only where available, never required                                                                                    | `scripts/lib/suite-evidence.mjs`, `scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`, `scripts/test-process-debt.mjs`, product 07                                                                      |
| [WO-132](../work-orders/WO-132-machinery-stand-down.md) | lifecycle machinery — transitions never gate; one product gate per order keyed by code identity; release close publishes only; attestation, versions and effort logged; two hook refusals; default gate of product and lifecycle suites; goal-review refuter | first, alone, by the operator's 2026-09-15 exemption; assign version at activation (minor); the operator runs three fresh gates and one lifecycle on the host | lifecycle, runner, release and harness implementer, then independent verifier | the operator's host for the fresh rows; egress and gh authentication for the release fixture's real path are not required | `scripts/resume.mjs`, `scripts/lib/lifecycle-evidence.mjs`, `packages/skeleton/src/gate-evidence.mjs`, `scripts/test-runner.mjs`, `scripts/lib/suite-evidence.mjs`, `scripts/release.mjs`, `scripts/worktree.mjs`, `packages/skeleton/src/harness-host.ts`, `packages/skeleton/src/harness-command.ts`, `packages/compiler/src/feedback.ts`, `packages/compiler/src/harness.ts`, `packages/skeleton/src/worker-transport.ts`, `packages/skeleton/src/plan-refutation-protocol.ts`, product 07 |
| [WO-133](../work-orders/WO-133-stand-down-residue.md) | lifecycle machinery — four residue repairs of WO-132: the built runtime follows main, one advisory per session per cause, attestation keeps supplied values, a version module outside every machinery source list | WO-132 closed; first in reading order; lane pair with WO-068; assign version at activation (patch) | harness/scripts implementer, then independent verifier | the existing harness, process-debt, release and resume fixtures | `packages/skeleton/src/harness-host.ts`, `version.ts`, `packages/compiler/src/harness.ts`, `loadouts/contributor.ts`, `scripts/resume.mjs`, `scripts/release.mjs`, `scripts/worktree.mjs`, `scripts/test-runner.mjs` |
| [WO-135](../work-orders/WO-135-capability-id-admission.md) | planning machinery — a capability write-back is an execution update; the sequence is checked against typed hard edges and pair boundaries; a planning branch refuses non-document writes; rewritten 2026-09-17 | no open input; pair 1, first, beside WO-136; assign version at activation (patch) | planning-tooling implementer, then independent verifier | the existing plan-refutation, work-order and harness fixtures | `scripts/lib/plan-continuation.mjs`, `scripts/lib/plan-receipts.mjs`, `scripts/work-orders.mjs`, the generated hook's planning-branch rule, product 07 §Operator-opened planning pass |
| [WO-136](../work-orders/WO-136-authority-enforcement-boundary.md) | research — the authority enforcement-boundary matrix: ten limits, both harnesses, sandbox on and off, prevented or observed-only, prompts and stalls | WO-044, WO-049 and WO-051 closed; pair 1 beside WO-135; assign version at activation (patch, evidence-only); the operator launches from an outside terminal and approves each unsandboxed ask | probe author, then independent verifier | the actual harnesses; scratch worktrees, a fixture remote and a sentinel file; no real credential | `scripts/harness-probe.mjs`, `scripts/lib/writing-worker-probe.mjs`, `docs/discovery/`, product 03's authority candidate, the security runbook pointer |
| [WO-137](../work-orders/WO-137-local-runner-readiness.md) | guided research — the installed LM Studio build serves reproducible noninteractive calls with cancel, timeout, schema and tool-call round trip and full provenance, or leaves a failure artifact | WO-027 closed; pair 3 beside WO-054; assign version at activation (patch, evidence-only); operator present for the outside-terminal steps; budget 90 minutes and three attempts per blocker | guided executor with the operator, then independent verifier | the local runner on the operator's host; live runs only when no product gate is running | `scripts/probes/local-runner-smoke.mjs`, `docs/discovery/`, product 06's local-model candidate, `environment.md` addendum |
| [WO-138](../work-orders/WO-138-local-model-role-qualification.md) | research — three read-only tasks with deterministic oracles and pre-registered floors, local against one remote transport with repeats; which inspection roles the local kind may fill | WO-110 merged and WO-137 closed with outcome `ready` (the preflight carries the outcome; the typed graph cannot); pair 7 beside WO-069; assign version at activation (patch, evidence-only); one operator session for the T2 ranking 2026-09-19 (second pass): amended to activate on WO-137's successful live row; inputs are public, no no-egress claim is made and no private-input role is qualified; keeps its slot beside WO-071. Receipt 019 known issues to carry into the executor's decisions: T3's input is a committed, screened sample of hook-journal rows, never the ignored local journal, so the public-input rule and the clean-room floor hold; five repeats bound a true rate only loosely (about 55% at 95% confidence for five of five), and the packet says so beside each floor; the harness under `scripts/probes/` stays out of `npm test`. 2026-09-21 (standard pass): the amended preflight is met — WO-137 recorded successful live inference on the pinned artifact and WO-110 D007's 2026-09-20 live row completed one inspection episode against the same runner in 14.6 s with a schema-valid envelope; carry into the executor's decisions: obtain the answering model's identity from the runner, never from the request, since this runner does not echo the requested model (WO-110 D007); guard the transport's bare-null body as `invalid-result` and add the case beside the prose and empty-content tests if this order edits `local-model-transport.ts` first (WO-110 D012). | evaluation-harness author, then independent verifier | the pinned local artifact and one remote transport; live runs only when no product gate is running | `scripts/probes/`, `docs/evidence/WO-138/`, product 03 actor catalog sentence, product 06 candidate disposition |
| [WO-139](../work-orders/WO-139-subagent-cap.md) | harness machinery — a configurable subagent admission cap: spawns refused at the admission points the hook can see, descendants counted at their first attributable tool call, uncounted paths reported, the total-cap requirement left open as a product 07 candidate, and the Contributor's batching rule | WO-131 and WO-133 closed; pair 2 beside WO-053; assign version at activation (patch); a probe row of subagent hook-input shapes precedes the mechanism | harness-host implementer, then independent verifier | the existing harness probe and process-debt fixtures | `packages/skeleton/src/harness-host.ts`, `docs/control/budgets.json`, `loadouts/contributor.ts`, the regenerated bundle, product 07 §Discipline and the total-cap candidate, the security runbook's hook boundary |
| [WO-140](../work-orders/WO-140-gate-sandbox-preflight.md) | test infrastructure and process cost — `npm test` refuses up front inside a harness sandbox when a declared suite needs the outside for an environmental cause; a sandbox-subset run records a distinct partial identity no gate consumer accepts; the briefing prints the session id and usage command; new receipts carry counters or a cause code | WO-132 and WO-133 closed; pair 4 beside WO-055; assign version at activation (patch); a probe row of the sandbox marker precedes the preflight | test-runner implementer, then independent verifier | a fake sandbox marker fixture; the existing runner and gate-evidence fixtures | `scripts/test-runner.mjs`, suite declarations, `packages/skeleton/src/gate-evidence.mjs` consumers' fixtures, `scripts/resume.mjs` briefing, the verifier and reviewer skills, one document check, product 07 Process Cost text |
| [WO-141](../work-orders/WO-141-no-guessing-enforced.md) | harness machinery — no guessing, enforced without gating the operator: the observed-facts block in the briefing, the prompt-submit context and the Stop advisory, an advisory scan that journals and corrects a hedged number or duration without holding a turn, and the operator-correction counter derived from the journal | first, pair 1 beside WO-136, by the operator's 2026-09-17 direction; WO-131 and WO-133 closed; assign version at activation (patch) | harness-host and meter implementer, then independent verifier | the existing harness and process-debt fixtures; a fixture journal | `packages/skeleton/src/harness-host.ts` (Stop path), `scripts/resume.mjs` briefing, `scripts/lib/meta.mjs`, the regenerated bundle, product 07 §Discipline, the security runbook's hook boundary |
| [WO-142](../work-orders/WO-142-outstanding-cleanup.md) | maintenance — outstanding cleanup: the register's refill, unowned review nominations, stale live-document claims and local residue, as 51 re-observed rows (row B17, fix or board up, added by the same day's second pass) | first queued entry, lane pair with WO-084, by the operator's 2026-09-19 budgeted pass; assign version at activation (minor); row B3 may be returned and judged alone at the operator's word; the operator reads the prune listing before `--apply`; receipt 018 known issues to carry into the executor's decisions: the prune must keep any snapshot an emitted target bundle or live worktree still imports (criterion 5), the six-row return cap is a ceiling and never a quota (criterion 1), a decision record that carries an ask must name its follow-up or the feed drops it (criterion 2), and the meter's `guardRefusals` cannot confirm the live-gate removal, so the after-observation is a reviewer session's transcript (criterion 6) Receipt 019 adds: `not-reproduced` has no cap, so the verifier re-observes each such row; the read list admits `git status` only with `--no-optional-locks`, because a plain status can take the index lock during a live gate; criterion 5's before and after sizes come from the operator's real `--apply` run, not the listing. | broad-surface repairer, then independent verifier judging the rows file | existing fixture suites; one live feedback edition; no new gate or hook | `scripts/`, `packages/*` except `reactor.ts`, the live documents, the regenerated bundle, indexes and editions; fenced off the ledger and `docs/lineage/README.md` |
| [WO-143](../work-orders/WO-143-resident-lock-recovery.md) | core runtime — the resident restarts unaided after a kill inside lock acquisition; the recorded blocker for `runtime.resident` level 2 | directly after the cleanup pair, lane pair with WO-144; after WO-142 edits the same two files; assign version at activation (patch) Receipt 019 known issues to carry into the executor's decisions: criteria 1 and 2 hold together only because the guard and its owner record are created in one atomic step, so that construction is the first thing to prove; a live owner wrongly judged dead would put two residents on one store, worse than today, so the fixture covers a live owner under load; in criterion 4 "a kill" is the resident's kill of its episode, not a signal sent to the resident; a torn log still refuses, so the claim is a kill at any instant of lock acquisition, not any instant at all. | store and concurrency implementer, then independent verifier | deterministic kill-inside-the-window fixtures with real subprocesses; macOS host | `packages/skeleton/src/worker-store.ts`, `resident-store.ts`, `resident-host.ts`, their tests, the capability table's dated reassessment |
| [WO-144](../work-orders/WO-144-outside-project-write-grant.md) | harness machinery — outside-project writes need a role or support grant; a fifth refusal for known destinations | directly after the cleanup pair, lane pair with WO-143; after WO-142 edits the same host; assign version at activation (minor); the operator confirms the default grants the journal inventory proposes Receipt 019 known issues to carry into the executor's decisions: lower the grant through WO-042's provenance-bearing envelope rather than a second authority vocabulary; the title's "can no longer" holds only for known destinations and the write-backs must say so; WO-056, WO-111 and WO-112 write outside the project and need an operator-named root until order-named roots exist; fail-open is specified for an unreadable configuration only, so list the guard's other failure modes and their behavior. | harness-host and loadout implementer, then independent verifier | retained hook journals for the inventory; generated-hook fixtures with a fixture home | `packages/skeleton/src/harness-host.ts`, `loadouts/contributor.ts`, `packages/compiler/src/harness.ts`, the regenerated bundle, products 03 and 07, the security runbook |
| [WO-145](../work-orders/WO-145-tinkerer-economy-experiment.md) | research — the first Tinkerer experiment: economy, one experiment per order inside 900 s, three trial orders | lane pair with WO-090; the operator names the two further trial orders at activation; assign version at activation (minor) Receipt 019 known issues to carry into the executor's decisions: a declined experiment records the seconds spent deciding as its cost and "none" as its effect, so criterion 2 admits what criterion 3 allows and declining is never the free way through a trial; the pre-registered reading is in the order's Design and is applied as written; the support is unequipped after the third trial unless the reading says otherwise. | loadout implementer running the first trial, then independent verifier | the existing loadout fixtures; no live model beyond the executor itself | `packages/skeleton/src/loadouts/`, the decisions generator, the regenerated bundle, product 05 |
| [WO-146](../work-orders/WO-146-copilot-cli-harness.md) | harness machinery — Copilot CLI as a third operator-launched harness: one compiled profile, the one hook set reused, every control labeled from a dated probe, executor, fixer and verifier qualified live | own slot after WO-140 and WO-056, before WO-145 and WO-090; may run beside WO-056 once WO-140 has closed and must not make a critical-path order wait; assign version at activation (minor); the operator enters bare `copilot` with no arguments (WO-146-D001), runs the interactive probe rows and the four episodes, and pays their AI credits Receipt 020 known issues to carry into the executor's decisions: the CLI is documented to deny a call when a pre-tool hook errors, so decide and fixture what a DotLn handler does with a payload it cannot decode, because an error there denies every tool call instead of degrading to an ungoverned session; twelve launches cannot give fifteen rows a live denial in two modes, so a row says it holds with allow-all permissions on only with an anchor from a session that had them on, and every other cell reads untested; every label is dated to the probed CLI version, so say what the table reads when `discover` records a different version line; a fault in a Copilot profile row or anchor must not fail `harness check` for an order that does not touch Copilot, or that coupling is stated; the Cost line and the title describe reuse, so if the probe selects one native registration, or leaves more than half the rows unsupported or untested, restate the additions in the decisions file before the rest proceeds; record the CLI's cross-session memory state for each qualification episode, since a planted-defect catch can pass while memory carries implementer context; Copilot-only role text and residue lines load in every Claude and Codex session, so report the per-role cold-start change for those two harnesses; report the gate wall-clock delta against the run-to-run spread; NoOp cost is unknown and may be zero if the operator does not run DotLn orders under this CLI, so the record after merge should show how many were. | compiler and harness-host implementer, then independent verifier on Claude or Codex | the installed Copilot CLI; a system-temporary scratch repository; `DOTLN_LIVE_HARNESS=1` | `packages/compiler/src/harness.ts`, `packages/skeleton/src/loadouts/contributor.ts`, `harness-host.ts`, `harness-command.ts`, `usage-observation.mjs`, `scripts/harness-probe.mjs`, `scripts/lib/harness.mjs`, `scripts/discover.mjs`, the regenerated bundle, products 03 and 07, the security runbook, the playbook |
| [WO-147](../work-orders/WO-147-resident-lock-contention.md) | runtime machinery — the worker store's host lock under live contention: a lock that vanishes between a contender's check and its read is re-inspected under the held guard, never thrown; the retirement `ENOTEMPTY` inference probed; the WO-143 boundary fixtures take their dead pid at use | WO-143 closed (v0.32.1); lane pair with WO-148 directly after WO-138 and WO-071, before WO-100 and WO-111; assign version at activation (patch); the case WO-069 D015 names runs ten times under the gate and ten alone, recorded Receipt 022 known issues to carry into the executor's decisions: one re-inspection is not closed under a second vanish of `host.lock` between the re-inspection and the read, so the fixed point is a read that treats `ENOENT` as absent-then-re-inspect, bounded by the existing contended wait, and a two-vanish fixture proves it; criterion 3's ten runs are ten runs of the named case within the runner's concurrent load, not ten canonical gates, and the decisions file records their wall-clock and which run shape they were. | skeleton implementer, then independent verifier | two-process fixtures on the local filesystem; no live model | `packages/skeleton/src/worker-store.ts`, `packages/skeleton/test/resident.test.ts`, `packages/skeleton/test/fixtures/worker-lock-process.ts`, product 03, the capability table |
| [WO-148](../work-orders/WO-148-resident-binding.md) | control plane — `resident-bind`: canonical order, worktree, merge-base, contract, decisions, declared surfaces and the Contributor mission policy into a fresh store with one `mission-check` actor; `--check` names a stale binding; launch, presence and `DOTLN_RESIDENT_STORE` lines printed | WO-099 (v0.37.0) and WO-069 (v0.37.2) closed; lane pair with WO-147; assign version at activation (minor); the operator runs one live `--once` row against a real in-flight order with a real transport, outside `npm test`; surfaces are typed at bind time until WO-124 Receipt 022 known issues to carry into the executor's decisions: `worktree integrate` moves the merge base after a bind, so `--check` must report a moved base as a mismatch and the decisions file must say what the capsule diffs against; the stale-binding refusal lives only in the command, so a previously printed launch line or an outside scheduler keeps judging a finished order's worktree, a recorded limit the Cost line's second removal must be read against; the command hard-wires the Contributor build and mission-only policy, with no build selector until a second build (WO-076) needs one; place the launchpad fixture in a named existing suite and report its effect on the gate step count, which the meter flags as worsening. | control-plane implementer, then independent verifier | a real-Git launchpad-and-worktree fixture; one live resident run | `scripts/resident-bind.mjs` (new) and its tests, `packages/skeleton/README.md` §Resident host, product 03 §Operator-presence policy, the candidate document |
| [WO-149](../work-orders/WO-149-codex-sessions-begin.md) | harness machinery — a Codex-launched dispatch begins its harness session once per thread before usage is read, so a Codex receipt's cost line carries counters; Copilot's graceful branch and Claude's hook record unchanged | WO-140 closed (v0.33.1); its own one-entry slot after WO-147 and WO-148, may run beside whichever is still open and must not make WO-120 or WO-063 wait; assign version at activation (patch); the operator verifies this order in Codex so the receipt is the live row Receipt 022 known issues to carry into the executor's decisions: the begin call is advisory inside the dispatch (a record that cannot be written is logged and the dispatch proceeds with a cause code; it never refuses `next`, `fix`, `verify`, `final-review` or `release-close`), under WO-132's logged-never-refused stand-down; a Codex refuter or planning dispatch stays outside the five named dispatches and its receipt line remains `unknown; cause no-session` unless the set is widened, to be decided and recorded; state whether Claude's hook-recorded session and Codex's dispatch-recorded session read their entry counters from the same window, and let the session record carry its writer; the pinned fixture transcript is bound to the manifest's Codex CLI version, so the live row is the only live check; no criterion binds the cost table's `tokens` metric, so record whether the first refresh after this order carries non-null tokens for a Codex-dispatched order; place the fixture in a named existing suite and report its effect on the gate step count. | control-plane and harness-host implementer, then independent verifier in Codex | one real Codex session; recorded transcript fixtures | `scripts/resume.mjs`, `packages/skeleton/src/harness-host.ts`, `packages/skeleton/src/loadouts/contributor.ts`, the regenerated bundle, `docs/AI-HARNESS-SECURITY.md` |
| [WO-150](../work-orders/WO-150-tinkerer-economy-default.md) | harness machinery — the executor's `tinkerer-economy` support equipped by default with a per-order opt-out; cold start measured against the ceiling under the standing route; the WO-145 baseline re-baselined; the three-trial history carried; no adaptive modifier | WO-145 closed (v0.34.0); its own one-entry slot directly after WO-138 and WO-071, may run beside whichever is still open and must not make WO-147 or WO-148 wait; sequential with WO-149 (both regenerate the bundle); assign version at activation (minor); the executor reports the equipped cold-start bytes for every role Receipt 023 known issues to carry into the executor's decisions: decide and record whether the support applies to runtime-derived and unattended orders (WO-100, WO-111, WO-120), which run through worker transports rather than an operator-launched executor session, and say which order classes the experiment serves; the fixture proves configuration, not behavior, so the decisions history records equipped dispatches against experiments run and declines, over a stated count, as the reopening observation; the 249-byte margin under the 24,576 executor ceiling is re-measured in both roots after WO-090's restructuring, and a breach is recorded as the ratchet it is rather than assumed; no criterion measures the up-to-900 s per order or a horizon total, so the decisions file states whether experiment time counts as machinery time in the meter; the carried history labels each of the three adopted methods with its equipped or unequipped provenance (WO-099 D008 ran unequipped) and states whether the equipped-only subset still meets the pre-registered rule; and the product 05 write-back names the outcome the executor economy serves, since the order unblocks no typed gate. | loadout implementer, then independent verifier | deterministic fixtures; both generated skill roots | `packages/skeleton/src/loadouts/executor-supports.ts`, `packages/skeleton/test/executor-supports.test.ts`, `scripts/test-process-debt.mjs`, `packages/skeleton/fixtures/wo145-role-baseline.json`, the regenerated bundle, product 05, `docs/control/budgets.json` if a ceiling moves |
| [WO-151](../work-orders/WO-151-entropy-reducer-dispatch.md) | instance tooling — the Entropy Reducer's dispatch as a command family: frozen subject, compiled reviewer, one fresh review and one fresh blinded refutation through the existing transports, numbered immutable receipts, operator dispositions that land accepted findings in the follow-up register; loadout, actor pin and authority unchanged | WO-023 (v0.5.0), WO-041 (v0.13.3), WO-142 (v0.32.0) and WO-144 (v0.33.0) closed; paired with WO-152 directly after WO-120 and WO-063 and before WO-100 and WO-064; assign version at activation (minor); activation authorizes the live row's external CLI launch of the pinned reviewer and refuter (about USD 17 and 29 minutes per cycle by REVIEW-001 and REFUTATION-001, the only observed run); the root `package.json` edit carries the WO-147 D010 edition duty (one live self-host episode); a new request kind in `worker-protocol.ts`, if the review profile needs one, bumps the skeleton component and is recorded as a decision. Receipt 024 known issues to carry into the executor's decisions: the order names no critical-path gate, so the decisions record the gated order or outcome its accepted findings serve, and REVIEW-002's dispositions are read against that; REVIEW-002's receipt records its restricted flag, the count of denied commands and the measured-versus-inspection split of its findings, compared with REVIEW-001's one of seven, because the Cost line's expected benefit (a reviewer that can run commands in the scratch copy) is checked by no criterion; a live row whose receipt carries the substitute-reviewer label or effort `unknown` does not satisfy criterion 7 as the pinned route, and the decisions say so; filing a receipt pair and appending its control event must be one atomic step, or `entropy check` must tolerate a filed pair without its event, so a crash between the two never fails the shared document gate for unrelated orders; the document check's gate step is reported against the meter's drift signal (68, 72, 68, 72, 76 across the last five rows) and the fallback manual steps kept in the guide are counted as retained, not removed Receipt 025 (the REVIEW-002 pass, post-close): six known issues with reopening observations, among them the `entropy` document check turning a chain-breaking receipt into a gate refusal for unrelated orders, and no accepted finding yet on a critical-path gate row; see the REVIEW-002 planning document §11. | control-plane and host implementer, then independent verifier | one live pinned review and one live refutation through `claude-cli-print`; one live self-host episode; the `fake` transport for fixtures | `scripts/entropy.mjs`, `scripts/lib/entropy-review.mjs`, the `plan-refutation` suite's test, root `package.json`, `docs/control/entropy-reducer.jsonl`, `docs/instance/entropy-reducer/README.md` and `runs/`, `docs/planning/entropy-reviews/`, `docs/proposals/`, product 03 and 05, `docs/PLAYBOOK.md`, `docs/AI-HARNESS-SECURITY.md` |
| [WO-152](../work-orders/WO-152-mission-check-schema-ids.md) | runtime patch — `missionReferenceIds` lists each clause id once, the emitted mission-check schema carries no duplicate enum item, and a `claude-cli-print` mission check returns a judgment against a real bound store | WO-099 (v0.37.0) and WO-148 (v0.40.0) closed; paired with WO-151 directly after WO-120 and WO-063 and before WO-100 and WO-064; assign version at activation (patch); the skeleton component bump re-mints the editions with one live self-host episode (WO-147 D010); activation authorizes one live print-transport mission check against a real bound store. Receipt 024 known issues to carry into the executor's decisions: the objective claims no enum of the emitted schema carries a duplicate, but the named change deduplicates only `missionReferenceIds`, while the `evidence` enum is built by `missionEvidenceIds` (changed paths, ignored-entry evidence, decision ids, the contract evidence string), so the regression's every-enum walk must cover it or the objective's claim is narrowed to the reference enums, recorded as a decision; the reference list has a third source the objective omits, the optional story contract's clause ids, and the fixture carries one so first-seen deduplication is proven to keep it; the regression is specific to one request kind, and another CLI-refused schema recorded as `transport-failed` before any model call reopens the generic check the non-goals decline | skeleton implementer, then independent verifier | one live `claude-cli-print` mission check; one live self-host episode; the mission-check fixture subject | `packages/skeleton/src/mission-check-protocol.ts`, `packages/skeleton/test/mission-check.test.ts`, `packages/skeleton/package.json`, the re-minted editions |
| [WO-153](../work-orders/WO-153-codex-session-entry-advisory.md) | operator tooling patch — a Codex lifecycle dispatch whose session begin throws prints a named advisory with the cause and still delivers its briefing and exit 0 | WO-149 (v0.40.2) closed; paired with WO-154 directly after WO-100 and WO-064 and before WO-111 and WO-114; assign version at activation (patch); no live row (the path was reproduced by probe, not observed live); re-mints nothing. Receipt 026 known issues to carry into the executor's decisions: the catch covers only the begin call while the sibling post-transition calls in the same try keep the exit-1 path (decide whether they are the same seam); the advisory reuses `no-session`, so the message must name the fault, and a distinct cause code follows product 07's route if the distinction is load-bearing | control-plane implementer, then independent verifier | the process-debt fixture with a forced begin failure | `scripts/resume.mjs`, `scripts/test-process-debt.mjs` |
| [WO-154](../work-orders/WO-154-evidence-editions-by-reference.md) | evidence machinery — feedback self-host editions record inputs by blob identity, key staleness on a behavioral identity with pins as metadata, re-mint pins-only changes without a live episode, and keep every existing edition byte-identical; the receipt subject by reference as a second group | WO-147 (v0.40.1) closed; paired with WO-153; assign version at activation (minor); two registered sources edited, so one edition re-mint with one live self-host episode (WO-147 D010), the last under today's rule; the before figures (1.26 MB per edition, 104.8 MB of 184.8 MB tracked, 59 editions in seven days) are in the order and REVIEW-002. Receipt 026 known issues to carry into the executor's decisions: the behavioral identity's enumeration classifies a lockfile change that alters a resolved dependency as behavioral unless the audit's dependency set is shown unchanged; an unresolvable blob is a refusal, so the check names the clone shapes it supports (a shallow or blob-filtered clone stales every edition); the receipt-subject group's split decision, if taken, records its balance against receipt 024's 814,036 bytes | skeleton and control-plane implementer, then independent verifier | one live self-host episode; the feedback suite fixtures; a Git checkout for body resolution | `packages/skeleton/src/feedback-selfhost.ts`, `scripts/feedback-evidence.mjs`, `scripts/lib/evidence-sources.mjs`, the edition schema, `scripts/lib/plan-receipts.mjs`, the re-minted editions, the console's pinned self-host case |
| [WO-155](../work-orders/WO-155-single-source-floor.md) | harness bundle patch — the five-refusals paragraph emitted once in the floor with each skill referring to it, after a recorded completeness check per skill-loading path; harness-context and meta report each role's delta since the previous edition and the last acceptance; no rule trimmed, no ceiling or acceptance changed | WO-144 (v0.33.0) and WO-150 (v0.39.0) closed; paired with WO-156 directly after WO-153 and WO-154; assign version at activation (patch); the generator and harness-context are registered sources, so one edition re-mint with one live self-host episode; if the completeness check finds a supported path that loads a skill alone, the emission criterion is declined with the observation and the metric half still closes the order. Receipt 026 known issue and correction to carry into the executor's decisions: the paragraph is emitted from the `HARNESS_BOUNDARIES` constant in `packages/compiler/src/harness.ts` (a registered source) rather than the loadout file the Cost line names, with the re-mint count unchanged; the completeness table is one-time, so each skill's reference sentence names the floor file it relies on and WO-072, WO-075 and WO-076 inherit the row as a preflight | skeleton and control-plane implementer, then independent verifier | one live self-host episode; the three harnesses' skill-loading paths observed; the WO-150 role-baseline oracle | `packages/skeleton/src/loadouts/contributor.ts`, `.claude/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md`, the `CLAUDE.md` harness block, `scripts/lib/harness-context.mjs`, `scripts/harness-context.mjs`, the meter's drift row |
| [WO-156](../work-orders/WO-156-plan-check-sub-second.md) | control-plane patch — the work-order path pattern built once per call in the planning subject builder; `plan check` under 2 s with byte-identical output; the two plan tasks in `test:docs` measured before and after | WO-135 (v0.29.4) closed; paired with WO-155; assign version at activation (patch); no live row; re-mints nothing (`plan-subject.mjs` is not a registered source). Receipt 026 known issues to carry into the executor's decisions: the 2 s criterion is host-bound and leaves the 212 Git spawns, so the timing records host and sequence length; a `statSync` count tests the mechanism, so a wall-clock bound on the fixture may sit beside it | control-plane implementer, then independent verifier | the plan-refutation fixture sequence with `statSync` counted; the operator's host for the timing | `scripts/lib/plan-subject.mjs`, `scripts/test-plan-refutation.mjs` |
| [WO-157](../work-orders/WO-157-closeout-followups.md) | closeout follow-ups, one order — the sixteen defects boarded up by the orders closed on 2026-09-22, across the integrate helper, the adjacent queue, the source-change and publication hosts, the skeleton's identity validator, the resident's binding and default model, the worker refusal record, the receipt witnesses, the discovery probe, the evidence registries, the control fold and the gate-sandbox fixture | WO-100 (v0.44.0), WO-064 (v0.43.0), WO-151 (v0.42.0), WO-152 (v0.41.1), WO-120 (v0.41.0) and WO-063 (v0.40.3) closed; a one-entry slot at the head of the sequence before WO-153 and WO-154, solo, under the operator's mid-pass authorization for one cross-seam order (the 2026-09-22 closeout follow-ups pass); assign version at activation (minor); one edition re-mint with one live self-host episode; group commits by seam; criterion 4's probe first; criterion 15 may end in a recorded diagnosis. Receipt 027 known issues to carry into the executor's decisions: a fixture's base failure must be the item's assertion, not a missing symbol (criterion 17); the diagnosis route on criterion 15 leaves the race unfixed and must say so; record the resolved Sonnet model id, not the alias (criterion 7); an untyped invalid-result detail must still be recorded, never refused into silence (criterion 8); specify `--check` when no registered profile is readable (criterion 6); a legitimate Sort deletion must not be refused by criterion 3's guard, or the derivation is narrowed and recorded; a cold-start raise under criterion 19 is recorded with the measured bytes, not assumed; each item's decision names the gate or order it unblocks (WO-111 for items 3, 6, 7 and 11; WO-066 for item 4; WO-113 for item 14; every final review for items 1 and 2) (criterion 18); `claude-session-readback` is a readback only when the host exports the variable, and the probe row says who sets it (criterion 11) | skeleton and control-plane implementer, then independent verifier | a scratch worktree with a `git add -N` entry; a scratch target with a planted `pre-push` hook; the live feedback verifier for the re-mint; Git 2.55.0 and Claude Code 2.1.280 on the operator's host | `scripts/lib/worktree-integration.mjs`, `scripts/adjacent-work.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `packages/skeleton/src/portfolio.ts`, the source-change and target-publication hosts, the skeleton's compilation-environment validator, the resident binding, `packages/skeleton/src/worker-transport.ts`, the entropy receipt host, `docs/discovery/environment.json`, `scripts/lib/evidence-sources.mjs`, `scripts/lib/derived-contract.mjs`, `scripts/test-runner.test.mjs`, products 02, 06 and 07 |
| [WO-158](../work-orders/WO-158-lifecycle-off-ramps.md) | control plane — lifecycle off-ramps: `CriterionWaived`, `WorkOrderWithdrawn` (terminal `withdrawn`), `RecordCorrected`, `OperatorOverrideRecorded` as typed events with `resume` commands; read-only commands admitted during a live gate | WO-139 and WO-157 closed; head of the sequence paired with WO-159 (the 2026-09-25 off-ramps pass); assign version at activation (minor); harness and authority editions re-mint deterministically, no live episode; not beside WO-161 (same generators) | control-plane implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: a pipeline whose later program writes is refused during a live gate (criterion 6); a waive by a non-executor role with a self-authored capture is the planning override's trust, attested by role (criterion 2); the override record names bypassed effects and an optional capture, not operator words the hook cannot see (criterion 5); the effort refusal applies only when a readback exists (criterion 4); measure the reviewer's 1,505-byte headroom at close and raise under the standing route if breached (criterion 7); `withdrawn` is closed-like with one legal re-entry, and the wording says so (criterion 3). Operator-directed boy-scout item (2026-09-25): the same classifier change admits writes under the scratchpad root Claude Code prints at session start, derived from the session id and project path, as a granted root for every role; three refusals in the planning session each cost a turn (map candidate 3, FUP-9ac70adcd20de223) | a fixture control segment per route; the generated-hook tests; a live `npm test` gate for the read-only fixture | `scripts/lib/control.mjs`, `scripts/resume.mjs`, `scripts/work-orders.mjs`, `scripts/lib/plan-subject.mjs`, `packages/skeleton/src/harness-command.ts`, `packages/compiler/src/harness.ts`, the loadout role texts, product 07, the playbook |
| [WO-159](../work-orders/WO-159-codex-episode-isolation.md) | runtime containment — one Codex launcher with a per-episode home seeded for authentication only; before/after digests of the user-level configuration and its trust table as protected receipt surfaces; the six probe and smoke sites adopt it | WO-111 (v0.47.1) and WO-157 (v0.45.0) closed; head of the sequence paired with WO-158; must close before WO-066, WO-112 and WO-118; assign version at activation (minor); authority and verification editions re-mint deterministically and the feedback edition with one live self-host episode; one live Codex worker row; the executor first confirms with `codex login status` what an isolated home needs and stops if secrets would reach evidence | transport implementer, then independent verifier with the live row. Receipt 028 known issues to carry into the executor's decisions: the next launch removes stale episode homes and `harness prune` lists them, so an abnormal end leaves no authentication copy behind (criterion 1); the argv's `-a never`, `--sandbox workspace-write` and `-c` overrides replace the absent user-level settings, and the live row shows no prompt or stall (criterion 3); a launch that cannot build the isolated home refuses and never falls back to the user-level home (criterion 4). Baseline on 2026-09-25: after the operator removed every user-level trust entry but the DotLn project's, the count is one; the executor records that figure and any rise before activation | the operator's Codex CLI and credentials on the host; a fake `codex` for the fixture; the live feedback verifier | `packages/skeleton/src/worker-transport.ts`, `scripts/lib/authority-probe.mjs`, `scripts/lib/writing-worker-probe.mjs`, `scripts/harness-probe.mjs`, `scripts/probe-worker-hosts.mjs`, `scripts/target-worker-smoke.mjs`, `scripts/probes/local-model-role-qualification.mjs`, the live receipts' protected surfaces, `docs/evidence/WO-054/codex-continuation.md` (appended note) |
| [WO-160](../work-orders/WO-160-wo111-machinery-followups.md) | machinery follow-ups, one order — the nine defects WO-111 exposed: amendment-row withdrawal and reported unmatched rows, `entropy subject` skipping pre-mechanism receipts, a truthful `release prepare` message, evidence JSONL declared beside its evidence, the integrate helper's own hookless commits and repair-phase admission, `test:docs --against` inherited labels, integration stashes in `harness prune`, own-write-counts-as-read, the `test:docs` advisory | WO-157 (v0.45.0) and WO-156 (v0.46.2) closed; second pair with WO-161 (the 2026-09-25 off-ramps pass) under the operator's "fix whatever nonsense" direction for one cross-seam order; assign version at activation (minor); no package source, no re-mint; the executor withdraws `plan-refutations.jsonl` row 22 under D019 | scripts and runner implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: own-write-counts-as-read is bounded to the session's own write with bytes hashed at write time (criterion 8); hookless commits are bounded to the preservation and merge commits the receipt names (criterion 5); an `inherited` label routes to a register row through a decision's `followup`, and two consecutive labels for one check reopen it (criterion 6); the `implementation-ready` advisory's cost is recorded as the tenth item (criterion 9); name the amendment withdrawal `--supersede` or record why `--withdraw` stays (criterion 1). Operator direction (2026-09-25, after two prune runs of 36 and 54 minutes that removed nothing): item 7 is a rewrite of the prune's publication check, two batched network calls per run and in-memory matching by the manifest's `workOrders` field, hashing only for candidates not retained by rule, an apply that re-observes only the candidate set and names what changed, and one printed reason on a network timeout (map candidate 11); the executor records the before and after wall-clock on the operator's host | fixture repositories for the helper, the runner and the prune; the current `git stash list` | `scripts/lib/plan-receipts.mjs`, `scripts/lib/plan-continuation.mjs`, `scripts/lib/entropy-review.mjs`, `scripts/release.mjs`, `scripts/check-registrations.mjs`, `scripts/lib/worktree-integration.mjs`, `scripts/worktree.mjs`, `scripts/test-runner.mjs`, `scripts/lib/harness-prune.mjs`, `scripts/lib/lifecycle-evidence.mjs`, product 07 §Independent workflows |
| [WO-161](../work-orders/WO-161-sandbox-vocabulary.md) | harness text — the sandbox vocabulary made true for a host that runs no sandbox in any CLI: the residue clause, two loadout sentences, three envelope labels, the playbook, an ADR amendment, the host-confinement detector renamed | WO-155 (v0.46.0) and WO-140 closed; second pair with WO-160; not beside WO-158 (same generators); assign version at activation (minor); harness and authority editions re-mint deterministically; check-row identity strings kept unless the executor shows no consumer | generator and documentation implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: emit the confinement sentence from the discovery probe's observed host posture, never from a constant, so an exported instance describes its own host (criterion 1); the residue rewrite states the posture rather than swapping interpretations (criterion 2) | regeneration of the bundle and skills; a simulated confined host for the detector fixture | `packages/compiler/src/harness.ts`, `packages/skeleton/src/loadouts/contributor.ts`, `scripts/lib/gate-sandbox.mjs` (renamed), `scripts/test-runner.mjs` suite names, `scripts/test-process-debt.mjs`, `docs/PLAYBOOK.md`, `docs/README.md`, `README.md`, ADR-0003 (amendment), product 07, the generated `CLAUDE.md`, skills and manifest |
| [WO-164](../work-orders/WO-164-constant-process-console-collection.md) | console and gate cost — one batched status fold, a per-tag cached release listing, constant process count per collection, byte-identical board output | WO-114 (v0.47.0) and WO-156 (v0.46.2) closed; fourth pair with WO-165 after WO-070 and WO-115 (REVIEW-003 ER3-002); runs after WO-158 and WO-160 close (shared `resume.mjs`, `release.mjs`); assign version at activation (patch); no re-mint Onesie-twosie pass 2026-09-27: a one-entry slot after WO-168 and WO-169 (WO-165 closed); follows WO-168's close because both edit `scripts/resume.mjs`; paired with WO-171 by the operator-answer judgment of the same day (disjoint files); WO-170 follows it (shared `release.mjs`). | tooling implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: a fold failure falls back to the per-order form and records that it did (criterion 4); the cache lives in the ignored local lane and is registered with `harness prune` (criterion 3); record two dated measurements on the unmodified source and state the observed growth rate instead of the reviewer's extrapolation (criterion 2) | a fixture with many orders and tags; the operator's host timing | `packages/console/src/collect.ts`, `scripts/resume.mjs` (`status --all --json`), `scripts/release.mjs` (`list` cache), `packages/console/test/board.test.ts`, product 07 §Candidate — cold-gate structural cuts |
| [WO-165](../work-orders/WO-165-entropy-review-route-agreement.md) | Entropy Reducer — the compiled authority and the pinned routes agree: no fan-out compiled for a route without a delegate tool, lens briefs as the reviewer's checklist, a receipt that describes the episode that ran | WO-151 (v0.42.0) closed; fourth pair with WO-164; runs after WO-159 and WO-160 close (shared `worker-transport.ts`, `entropy-review.mjs`); assign version at activation (patch); authority edition re-mints deterministically; a live feedback episode only if a feedback source must change, recorded as a decision | loadout implementer, then independent verifier. Receipt 028 known issue to carry into the executor's decisions: the fixture asserts per pinned route, and a new route declares whether it supplies a delegate tool before admission (criterion 1) | the fake entropy transport for an end-to-end run | `packages/skeleton/src/loadouts/entropy-reducer.ts`, `scripts/lib/entropy-review.mjs` (receipt sentences), `docs/instance/entropy-reducer/README.md`; `entropy-review-protocol.ts` and `worker-transport.ts` only on the alternative route |
| [WO-162](../work-orders/WO-162-in-unit-helper-reuse.md) | code health — in-unit helper reuse in the scripts unit and the compiler: seventeen local Git wrappers become `runGit`, one home for the fixture writer and pretty JSON, shared receipt helpers, `paths.mjs` readers, `sha256Hex`, two compiler exports; divergences decided, not merged | WO-156 (v0.46.2) closed; fifth pair with WO-163 after WO-164 and WO-165; runs after WO-160 closes (shared `plan-receipts.mjs`, `entropy-review.mjs`); assign version at activation (patch); authority edition re-mints deterministically; the skeleton protocol files are excluded (feedback sources; map candidate 1) Register note 2026-09-27: FUP-beb13d8d099d2917 (refutation receipts by identity and hash) reopens at this order's close, because it refactors the receipt helpers that change would edit. | scripts implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: every null-on-failure caller keeps a thin wrapper over `runGit`; grep for them before converting any (criterion 1); no blocked outcome is claimed, the value is maintenance (criterion 7) | a before/after diff of every fixture output and stored digest | the seventeen, twenty and nine adopter files the planning document §8 lists, `scripts/lib/git.mjs`, `scripts/lib/paths.mjs`, `scripts/lib/plan-subject.mjs`, `scripts/lib/plan-receipts.mjs`, `scripts/lib/entropy-review.mjs`, one new `scripts/lib` module, `packages/compiler/src/normalize.ts`, `compile.ts` |
| [WO-163](../work-orders/WO-163-5s-sort-and-set-in-order.md) | 5S — Sort and Set in order on the launchpad: three import-only scripts into the library, a library command block removed, three one-shot planning inputs retired, `followups.json` marked generated, two docs-only evidence tools disposed | WO-142 closed; fifth pair with WO-162; assign version at activation (patch); no re-mint; local residue (`harness prune` preview 146.9 MB) stays the operator's `--apply` | scripts and documentation implementer, then independent verifier. Receipt 028 known issues to carry into the executor's decisions: regenerating the `--check` is preferred, and `historical` is recorded only with the failing reason beside the tool (criterion 5); the attribute row is `dotln-generated` only, never a diff-disabling attribute (criterion 4) | greps over `scripts/`, `docs/discovery` and the refutation receipts before each retirement; an outside terminal if D007's episode is run | `scripts/github-body.mjs`, `scripts/github-repository.mjs`, `scripts/release-notes.mjs` (moved) and six importers, `scripts/lib/release-fixtures.mjs`, `.gitattributes`, three `docs/planning/*-dispositions.json`, `scripts/authority-mutation-evidence.mjs`, `scripts/evidence-mission-check.mjs`, product 05 §5S |
| [WO-166](../work-orders/WO-166-session-boundaries.md) | harness/session boundaries — a Codex lifecycle dispatch reserves the writer its completion releases (all five Codex roles); every Codex completion releases; a writer refusal names the holder's age; an open override is surfaced at the next session start; `harness evidence --wait` returns when the live gate ends with its recorded row | WO-158 and WO-160 closed; assign version at activation (patch); re-mints the editions `harness-host.ts`, `gate-evidence.mjs`, `operator-control.mjs` and the contributor loadout stale (deterministic, no live episode); the Codex owner is the host process or a pid-less `thread` holder, never the npm process (receipt 029). Boy-scout carry-in: the carried-edition test fix (WO-161 D007, FUP-be91067a3842b44a). Register carry-ins: FUP-a0d6b960702fb9a4 (WO-158 D012), FUP-7b4b41e2875f852d (WO-158 D029 item a). | skeleton/harness implementer, then independent verifier (a Codex verification records its own `writer --show`) | Codex CLI available for the fixture-free live observation; no paid episode | `packages/skeleton/src/harness-host.ts`, `gate-evidence.mjs`, `loadouts/contributor.ts`, `scripts/harness.mjs`, `scripts/resume.mjs`, `scripts/lib/executor-handoff.mjs`, `scripts/test-evidence-sources.mjs`, the generated bundle and skills |
| [WO-167](../work-orders/WO-167-execution-guide-folded.md) | documentation — the execution guide's dated amendment paragraphs (33 at `5f3849ec`) folded into the sentences they amend with citations; its nine candidates moved to this map; every skill-cited heading preserved; 07's ceiling lowered | after WO-085 (the check and the ceiling); assign version at activation (patch); verifier samples at least ten folded paragraphs against the diff Amended 2026-09-27: criterion 2 names `node scripts/harness-context.mjs --check` as the proof that the skills' heading citations survive the fold (WO-085 D016). Amended 2026-09-28: moved to the head, paired with WO-060, because the guide holds 188,390 of 188,399 counted bytes and WO-173, WO-172 and WO-086 each add to it; the executor counts the dated paragraphs at its base by the rule the order states. | documentation implementer at xhigh+, then independent verifier at xhigh+ Receipt 032 known issues to carry into the executor's decisions: product 07 had 2,504 bytes of headroom at the 2026-09-27 pass and four earlier orders may take 2,000, so a breach before the fold lands is reported to the operator, who may move the fold ahead (criterion 4); the verifier compares the executor's before and after `Cites` lists against both the guide and the map (criterion 2); record the reduction against 185,895 bytes and, once WO-170's snapshots carry read bytes, the read bytes of orders closed after the fold (criterion 4). | anchor list before and after; `npm run meta` | product 07, this map, `docs/publication/`, `docs/README.md`, the register, `docs/control/doc-ceilings.json` |
| [WO-168](../work-orders/WO-168-printed-path-exists.md) | harness/session seam — the session scratch directory exists wherever its path is printed; a granted root is a real directory; the override exit prints before an input refusal; a live gate admits the argument forms of programs already listed; a refused Codex dispatch leaves no reservation; a stale runtime refuses by naming bootstrap; the standing writer sentences state what WO-166 shipped | WO-166 (v0.52.3), WO-158 (v0.49.0) and WO-144 closed; head pair with WO-169 at the operator's direction (2026-09-27); assign version at activation (patch); re-mints the editions `harness-host.ts`, `harness-command.ts`, `observed-facts.ts` and the compiler's `harness.ts` stale (deterministic, the feedback carry and the console re-pin; no live episode); the generated sentence grows by at most 200 bytes against a reviewer headroom of 581. Register carry-ins: FUP-a6c598371c7f86cf, FUP-b537eae489004287, FUP-465c6ce0f041b447, FUP-6996e331536d4389, FUP-a310804514162e1f, FUP-c787bb9b32bafcf8 (item b), FUP-156ca538f603194a. | skeleton/harness implementer, then independent verifier; each item re-observed before it is edited Receipt 032 known issues to carry into the executor's decisions: state the symlink rule as what is checked, the granted root's final component, in every sentence this order writes, since an earlier component or a root made a symlink after the check is still followed (criterion 2); cover a second refusal cause raised after the reservation is placed, or record that the observation log is the only one reachable (criterion 5); record the order's machinery share beside WO-166's 0.559 (criterion 9). | Codex CLI for the dispatch fixtures' live observation; no paid episode; `npm test -- --review` before `implementation-ready` | `packages/skeleton/src/harness-host.ts`, `harness-command.ts`, `observed-facts.ts`, `packages/compiler/src/harness.ts`, `scripts/harness.mjs`, `scripts/resume.mjs`, `scripts/test-harness.mjs`, `scripts/test-process-debt.mjs`, products 02 and 07 (named sentences), the generated bundle, skills and instruction file |
| [WO-169](../work-orders/WO-169-followups-reach-their-seam.md) | planning and integration tooling — `followups --touching` and a completion advisory show pending rows to the order that opens their seam; `followups --export` and an array form of `--apply`; the integrate helper regenerates after authored conflicts are staged and records the release line once; the configuration-root suite declares `scripts/`; the meter names an unset ceiling | WO-142, WO-160 (v0.51.0) and WO-085 (v0.52.2) closed; head pair with WO-168 at the operator's direction (2026-09-27); assign version at activation (patch); no re-mint. Register carry-ins: FUP-c3f5fff27ea981b8, FUP-e5a6ca7dbe6270ea, FUP-ca485137e32985fb (the declared-sources half) and the 2026-09-27 candidates 1 to 3 (FUP-99f720bad9200a33, FUP-28ded9eb997633f2, FUP-d7c0c433892e120f). | tooling implementer, then independent verifier Receipt 032 known issues to carry into the executor's decisions: replay `--touching` against the eight rows and the changed files of the nine orders the 2026-09-27 pass counted, and record which rows it returns (criterion 1); at final review compare the rows the advisory named with the dispositions recorded, and state that no later order has that comparison (criterion 1). | fixture registers and a fixture integration; `npm test -- --review` before `implementation-ready` | `scripts/lib/planning-followups.mjs`, `scripts/refute-plan.mjs`, `scripts/lib/lifecycle-evidence.mjs`, `scripts/lib/worktree-integration.mjs`, `scripts/test-runner.mjs`, `scripts/lib/meta.mjs`, `docs/planning/followups.md`, product 07 §Retained planning follow-ups |
| [WO-170](../work-orders/WO-170-meter-keeps-what-sessions-observed.md) | process meter — a bounded per-order snapshot written by `release prepare` while the journals exist; retained usage read; a correction count computed from no journal reads unavailable, not zero; operator directions per closed order counted from decision dispatches and off-ramp events | WO-126, WO-158 (v0.49.0) and WO-160 (v0.51.0) closed; a one-entry slot after WO-164 and WO-171 (shared `release.mjs` with WO-164) and after WO-169's close (shared `meta.mjs`), before WO-086; recovers usage totals by role from the 73 retained copies into per-order snapshots; filed 2026-09-27 under the operator's delegation; assign version at activation (patch); no re-mint while no registered evidence source is edited. Register carry-ins: FUP-a33f893036882d16, FUP-85562931791378d4. | tooling implementer, then independent verifier Receipt 032 known issues to carry into the executor's decisions: the snapshot carries its observation cutoff, the meter labels its figures as observed up to it, and the decisions name which run of `release prepare` writes it (criterion 1); define the four prefixes, keep directions and rescues as separate counts, extend the fixture to all four prefixes and one cited capture, and assign a pass's capture count to the pass, not to each order it filed (criterion 4); state which series the snapshot fills, because the Cost line's twelve of fourteen counts series the non-goals exclude (criterion 2); WO-168, WO-169, WO-164 and WO-171 close before the snapshot exists, so write theirs from a worktree still open at activation and record the rest unavailable (criterion 5). | fixture worktree with journals; `npm test -- --review` before `implementation-ready` | `scripts/lib/meta.mjs`, `scripts/meta.mjs`, `scripts/release.mjs` (`prepare`), `scripts/test-process-debt.mjs`, `docs/evidence/WO-NNN/meta.json` (new per order), product 07 (meter sentences) |
| [WO-171](../work-orders/WO-171-prune-apply-finishes.md) | local residue — `harness prune --apply` plans once and observes publication once per apply, re-reads only the candidate it is about to delete, resumes after an interruption, and keeps a retained lane whose usage copy has no committed snapshot | WO-160 (v0.51.0), WO-159 and WO-142 closed; paired with WO-164 in the second slot; follows WO-168's close (shared `scripts/test-harness.mjs`); filed 2026-09-27 from the stored-data inventory under the operator's delegation; assign version at activation (patch); no re-mint. Register carry-ins: FUP-6aafd40115ac97fd (WO-142 D022), FUP-866699c54128edc1 (WO-148 D002). | tooling implementer, then independent verifier; no apply is run against the operator's checkout Receipt 032 known issues to carry into the executor's decisions: the usage reason reads `docs/evidence/WO-NNN/meta.json` and its usage totals by role, and retains a lane whose snapshot lacks them, so the rule and WO-170's writer agree (criterion 5); a release or tag listing that fails or is incomplete retains, as an unobserved publication does today (criteria 1 and 2); leave the operator the record to keep of the first real apply: wall-clock, deletions, retained lanes by reason, bytes freed (criterion 7). | fixture repositories with a fake remote and a fake `gh`; `npm test -- --review` before `implementation-ready` | `scripts/lib/harness-prune.mjs`, `scripts/test-harness.mjs` (prune fixtures), product 07 (retention sentences) |
| [WO-172](../work-orders/WO-172-failures-reach-planning.md) | planning instrument — `plan failures` lists the failed judgments, repairs, corrections, off-ramps and amendments of a window from the public record; `plan start` prints the counts and the orders closed since the last Entropy Reducer review; the meter carries failed judgments, repairs and recorded corrections per order; the direction count reads operator steps inside lifecycle dispatches | WO-167 (hard: product 07's headroom); WO-170 and WO-169 closed; paired with WO-065 in the third slot, after WO-173 (both write product 07); filed 2026-09-28 at the operator's direction that the recorded failures be addressed; assign version at activation (patch); no re-mint. Register carry-ins: FUP-80a2f11e1e0874d8 (WO-170 D019), FUP-71fc2efc208f597a (WO-085 D004), FUP-abfdb650f125a77f and FUP-ba35c0b5ae47cfb8 (WO-151 D007). | tooling implementer, then independent verifier; the executor files a hand classification of every decision dispatch that names the operator | this repository's own record to 2026-09-28T04:00Z; fixture records; `npm test -- --review` before `implementation-ready` | `scripts/refute-plan.mjs`, `scripts/lib/meta.mjs`, one new module under `scripts/lib/`, dispatch fields under `docs/evidence/`, product 07 (planning procedure), `docs/planning/sequence.md` and `followups.md` |
| [WO-173](../work-orders/WO-173-handoff-states-what-it-knows.md) | lifecycle — the executor's report judges every criterion on one line at `implementation-ready` and `repair-complete`; a criterion recorded met needs its named gate's passing row, the document gate run inline; one recorded unmet is listed in the status and the next briefing with the waiver route; `npm test` is not run again at a code identity that passed; three briefing sentences; the WO-143 lock matrix as eight subtests; the register advisory's rule | WO-167 (hard: product 07's headroom); WO-158, WO-169 and WO-166 closed; paired with WO-116 in the second slot; filed 2026-09-28 at the operator's direction that the recorded failures be addressed; assign version at activation (patch); deterministic re-mints for the role text (authority, harness, the feedback edition by carry), no live episode. Register carry-ins: FUP-1d57cbcb226d8f8a (WO-159 D020), FUP-756224e6e2cbf35a (WO-163 D021), FUP-5a03cc13047c1dc4 (WO-169 D002), FUP-b1163d128e371b7f (WO-169 D007). Receipt 033 known issue (2026-09-28): reusing a gate at an unchanged code identity may be unsound when a runtime, dependency, fixture or environment input changes outside that identity; reopen when a passed selection is skipped at an unchanged code identity after a named relevant input changes, and `--again` on that state fails a test the skipped run would have exercised. | lifecycle implementer, then independent verifier; the order's own `handoff.md` is its first ledger | fixture repositories and gate rows; the reviewer's cold-start headroom is 405 bytes; `npm test -- --review` before `implementation-ready` | `scripts/resume.mjs`, `scripts/lib/lifecycle-evidence.mjs`, `scripts/test-runner.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `packages/skeleton/test/resident.test.ts`, product 07 (Discipline; Retained planning follow-ups), `docs/planning/followups.md` |
| [WO-174](../work-orders/WO-174-gate-rows-cover-what-suites-read.md) | verification soundness — product cases that read documentation carry the `[document]` tag and run in the document gate, with a `kernel-docs` task and a read guard on the product package suites; one closure check in runner-fixtures holds each machinery suite's declared sources to what its entry file imports and spawns, and the lists are repaired | WO-173 and WO-132 closed; paired with WO-058 at the head and closed before WO-059 starts (both edit `scripts/test-runner.mjs`); filed 2026-09-30 from REVIEW-004 ER4-001 and ER4-002; assign version at activation (patch); no re-mint on the preferred route. Receipt 033's known issue on WO-173 (a gate reused at an unchanged identity after a named input outside it changes) is the observation ER4-001's drill made. Rows its files touch and it leaves: FUP-7629e03c6573f5cb, FUP-71602ec08bc81e9d, FUP-3d6a8147368bdf1c, FUP-e821aa2ced3aa111. Receipt 035 known issues (2026-09-30), weighed in the planning document §11: the guard's read set and the closure check's set are narrower than the title, so the limits are recorded and a read form or a transitive path observed outside them reopens; a guard that fails to load fails its own fixture and leaves the suite's verdict alone; reopen on cost when the document gate or the `scripts/harness.mjs` `--review` selection rises by more than 120 s. Carry-in (2026-09-30 pass): explain, in the selection table of criterion 6, the twelve of forty `npm test` rows since WO-173 closed that ran fresh at a code identity already green (one identity five times on 2026-09-30); WO-178 counts them. | tooling implementer, then independent verifier | scratch clones for the two drills; both gates timed before and after; `npm test -- --review` before `implementation-ready` | `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs`, one preload under `scripts/lib/`, case names in `packages/kernel/test/` and `packages/console/test/`, product 07 (Discipline) |
| [WO-175](../work-orders/WO-175-reopening-conditions-report-themselves.md) | planning instrument and review confinement — the meter refuses a predicate it cannot resolve and resolves budget-row metrics; `plan conditions` evaluates a named table of numeric reopening conditions and `plan start` prints how many hold; a launched review or refutation gets a temporary root beside its frozen copy, named in its instructions, inventoried in its receipt and removed with the episode | WO-172 and WO-165 closed; paired with WO-059 in the second slot; filed 2026-09-30 from REVIEW-004 ER4-003, ER4-004 and ER4-007; assign version at activation (patch); the five editions re-minted deterministically for the instruction sentence in a judged feedback source, a live feedback episode only if the feedback edition's judged behavior changes. Rows its files touch and it leaves to the completion advisory: FUP-e55e258d37cb3f20, FUP-01e80ba5ce62c72a. Receipt 035 known issues (2026-09-30), weighed in the planning document §11: `plan start` runs the rows that are not timings and prints the timing rows as not measured at entry, never a stored count; rows behind a flag are named in the line on what was not evaluated; the confinement record says which places it observed; reopen when WO-150-D003 is listed undisposed at two consecutive entries, or the recorded re-mint cost exceeds the 384 s the order cites as removed. | tooling implementer, then independent verifier | the operator's host for the listing's timings; fake-transport fixtures; no live review episode; `npm test -- --review` before `implementation-ready` | `scripts/lib/meta.mjs`, `scripts/refute-plan.mjs`, one new module under `scripts/lib/`, `scripts/lib/entropy-review.mjs`, `packages/skeleton/src/entropy-review-protocol.ts`, the editions and the console's pins, the reviewer's operator guide, `docs/planning/followups.md`, product 07 (planning procedure) |
| [WO-176](../work-orders/WO-176-release-close-finishes-on-the-handoff.md) | worktree lifecycle — a nested repository in a disposable lane is disposable; `worktree material` declares the rest and completion records the rows in the lifecycle event; the close removes, preserves or blocks on the record with the one command that settles a blocker, and writes `release-close.json` | WO-117, WO-166 and WO-171 closed; paired with WO-180 in the third slot as the machinery lane; filed 2026-09-30 from the operator's item 1 (the WO-117 close), WO-172 themes 2 and 8 and FUP-ecf9d3b703a0b7d9, whose condition occurred; assign version at activation (patch); `paths.mjs` editions re-minted deterministically, no live episode. The first real close after it merges is the observation the next pass reads. Receipt 036 known issue (2026-09-30): a declared or lane-disposable repository is removed at close and removal cannot be undone; within the design the close bundles a repository whose commits no retained ref reaches into the retained lane before removing it, and the decisions record the check; a removed repository a later session needed reopens it. | tooling implementer, then independent verifier | worktree and release fixtures; `npm test -- --review` before `implementation-ready` | `scripts/lib/paths.mjs`, `scripts/lib/intake-reconciliation.mjs`, `scripts/worktree.mjs`, `scripts/release.mjs`, `scripts/lib/lifecycle-evidence.mjs`, their fixtures, product 07 (Workflow closeout) |
| [WO-177](../work-orders/WO-177-spawned-agents-run-the-pinned-models.md) | harness defaults — the entropy transport defaults and the three probes name Codex `gpt-6.1-sol` at `max` and Claude `claude-opus-5-5` at `xhigh`; one Codex session records `spawn_agent`'s model and effort parameters | WO-175 closed (both edit `scripts/lib/entropy-review.mjs`); paired with WO-182 in the fifth slot as the machinery lane; filed 2026-09-30 from the operator's direction of that day; assign version at activation (patch); no re-mint, no live episode. Receipt 036 known issue (2026-09-30): the pinned models appear literally in eight orders' live-episode criteria; product 07 §Model-specific notes is the rule and the executor records what ran; a pin change while an order is open reopens the question of a single source. | tooling implementer, then independent verifier | fake-transport fixtures; one bounded Codex session | `scripts/lib/entropy-review.mjs`, `scripts/lib/writing-worker-probe.mjs`, `scripts/lib/authority-probe.mjs`, `scripts/lib/subagent-probe.mjs`, their fixtures, `docs/AI-HARNESS-SECURITY.md`, the reducer README |
| [WO-178](../work-orders/WO-178-the-record-holds-what-the-operator-sees.md) | record and admission — a `PermissionDenied` hook and a typed row per operator message (digest and class, never text); the Stop advisory names running monitors; the permission hook admits the byte-exact release-close helper under recorded lifecycle facts; `plan failures` counts closes, denials, interventions, long phases and repeated gate runs, and `plan start` prints the delivery split from an optional `Track:` header; `docs-check` finds operator words without a capture digest | WO-175, WO-172 and WO-066 closed; paired with WO-181 in the fourth slot as the machinery lane; filed 2026-09-30 from the operator's item 3 and messages 3 to 5, WO-172 themes 8, 11, 13, 20, 23 and 30, D013 and D018; assign version at activation (patch); `harness-host.ts` editions re-minted deterministically, no live episode. The hook's first admission; the first Claude auto-mode close after merge is the live observation. Receipt 036 known issues (2026-09-30): the hook's admission rests on the recorded release-close dispatch; the executor binds it to the record the prompt hook wrote from an operator prompt, never one a tool call wrote, and a fixture proves the difference. The intervention counts and the meter's operatorCorrections and operatorDirections are two instruments for one fact; the executor states their reconciliation in the decisions and `plan failures` names which it prints. | tooling implementer, then independent verifier | hook fixture harness; `npm test -- --review` before `implementation-ready` | `packages/skeleton/src/harness-host.ts`, `scripts/refute-plan.mjs`, `scripts/lib/plan-failures.mjs`, `scripts/docs-check.mjs`, `scripts/work-orders.mjs`, their fixtures, `docs/AI-HARNESS-SECURITY.md`, product 07 (planning procedure) |
| [WO-179](../work-orders/WO-179-role-text-carries-the-confirmed-corrections.md) | role text — the shared Contributor text and the lifecycle briefings gain the rules WO-172's map traced to repeated corrections (themes 2, 3, 4, 7, 9, 14, 15, 16, 18, 19, 20, 21, 26, 29), the verifier consumes the executor's gate row, `verification-result` applies WO-173's claim check, and the release-close and executor roles learn the scratch-material handoff and the report of a blocker or denial | WO-173 and WO-172 closed; paired with WO-061 in the sixth slot as the machinery lane; filed 2026-09-30 from the operator's messages of that day; assign version at activation (patch); `contributor.ts` editions re-minted deterministically, no live episode; cold-start acceptances under the standing route where a ceiling is met. Receipt 036 known issues (2026-09-30): the Cost line's cold-start figures (25,150; 21,055) are the acceptance texts' values, not the measured roots at `b51a58a8`, which are executor 26,903 of 29,246, verifier 23,706 of 25,151, reviewer 24,788 of 28,884, release-close 15,585 of 16,384 and planner 17,733 of 24,576; the executor measures after regeneration and the release-close root is the likely acceptance. Twelve prose sentences enter the shared text while WO-097 and WO-098 retire prose into mechanisms; a theme that recurs after WO-179's final review makes its sentence a migration candidate. | tooling implementer, then independent verifier | regenerated roots measured in both harnesses; `npm test -- --review` before `implementation-ready` | `packages/skeleton/src/loadouts/contributor.ts`, `scripts/resume.mjs`, product 07 (Discipline), `docs/control/budgets.json`, fixtures |
| [WO-180](../work-orders/WO-180-baseline-witness-before-any-change.md) | delivery, the vertical — a blinded `baseline` episode on the sealed base snapshot reproduces the defect or walks a new story's adjacent behavior, records `subject: baseline` witness rows and `BaselineWitnessed`, and the verifier compares candidate rows against them; non-reproduction is a typed stop for a defect story | WO-058 closed (shared protocol file), WO-054 and WO-056 closed; paired with WO-176 in the third slot, the delivery lane; filed 2026-09-30 from the product coverage check (product 03 §VerificationAdapter, product 06's vertical); assign version at activation (minor); `verification-protocol.ts` editions re-minted deterministically; two live rows on WO-056's synthetic repository. Receipt 036 known issue (2026-09-30): the sequence places WO-180 before WO-061, whose StoryContract defines the defect/new class the typed stop reads; the executor reads the class from WO-061's contract when landed and, before it, treats a contract that names a failing behavior as a defect story and records the class source; a defect story recorded as `walked` reopens it. The operator may move WO-180 behind WO-061's pair at review with one sequence line. | implementer, then independent verifier | the synthetic repository; both harnesses as the episode's actor; `npm test -- --review` before `implementation-ready` | `packages/skeleton/src/verification-protocol.ts`, the verification host, fixtures, product 03 |
| [WO-181](../work-orders/WO-181-independent-review-episode.md) | delivery, the vertical — a blinded read-only `review` episode, a different session from the verifier's, returns `review` findings (`blocking`, `should`, `nit`) under the finding contract; `blocking` routes to bounded repair, the rest to the deliverable body; it edits nothing | WO-180 and WO-058 closed (shared protocol file), WO-055 and WO-056 closed; paired with WO-178 in the fourth slot, the delivery lane; filed 2026-09-30 from the product coverage check (product 03: verification and review are separate independent episodes); assign version at activation (minor); deterministic re-mint; two live rows. Receipt 036 known issues (2026-09-30): the reviewer judges scope against the contract, which names no files, while WO-124 (later in the sequence) derives the surfaces; the executor has the reviewer consume the derived surfaces when present and records the rule, and a blocking scope finding on a derived surface reopens it. The order does not say what the composition does when the review episode fails or times out; the executor records the stop or retry behavior with a fixture. Operator expansion 2026-10-01 (WO-181-D008): future-worktree bootstrap prepares pinned Chromium before readiness; prove fresh setup, cache reuse and failed preparation without retrofitting existing worktrees. | implementer, then independent verifier | the synthetic repository; both harnesses as the reviewer | `packages/skeleton/src/verification-protocol.ts`, its host, fixtures, product 03 |
| [WO-182](../work-orders/WO-182-deliverable-ready-conjunction.md) | delivery, the vertical — product 03's fourteen deliverable-ready items evaluated from the episode store as `evidenced`, `absent` or `not-applicable` rows, rendered in the target pull request body, and `--require-deliverable-ready` refuses target publication before the first remote call while an item is absent | WO-181 closed (the review item's event), WO-064 and WO-066 closed; paired with WO-177 in the fifth slot, the delivery lane; filed 2026-09-30 from the product coverage check (product 03 §DeliveryAdapter; WO-064 declined to require readiness for an operator's own publish, which stands); assign version at activation (minor); no re-mint, no live row. Receipt 036 known issues (2026-09-30): three items are not evaluable before publication (the monitored loop runs after it; the grounded body is the body this step writes; a new story's baseline is `walked`); the executor gives them `pending-post-publication`, `self` and `walked` readings that do not block, recorded in the decisions. Judgment items (no unresolved ambiguity, repo-native form, final diff read, grounded body) are evidenced only by an artifact that records the judgment itself, never by the existence of a diff. | implementer, then independent verifier | the deterministic publish double WO-064 used | `scripts/github-body.mjs`, `scripts/lib/target-publish.mjs`, fixtures, product 03 |
| [WO-183](../work-orders/WO-183-intent-declaration-and-the-stranger-test.md) | delivery, the `v1.0.0` exit — `dotln intent "<prose>"` and its loopback form admit a bounded intent under the portfolio's `intent` class, interpret it through the StoryContract, materialize the derived order and print a receipt; one witnessed run by a non-author on the exported starter, or the substitute run with the pending observation named | WO-118 closed (the loop and the instance), WO-115 and WO-120 closed; a single entry after WO-118; filed 2026-09-30 from the map's 2026-09-06 candidate whose precondition closed with WO-115; the operator puts `v1.0.0` months away (2026-09-30), so this order names the exit's shape and holds no priority; assign version at activation (minor). Receipt 036 known issues (2026-09-30): `dotln intent` exists (WO-120) and files a draft for human review; this order extends it and keeps that path, so an intent outside intent-class coverage degrades to a draft, never a refusal. The substitute run never claims the exit: product 06's `v1.0.0` section, a capability row or a release claiming it while the witness records a substitute run reopens it. | implementer, then independent verifier; a non-author for the witnessed run | the exported starter, a registered scratch target, standing grants | `packages/skeleton/src/dotln.ts`, the console's loopback command surface, fixtures, products 04 and 06 |
| [WO-184](../work-orders/WO-184-seams-before-the-vertical.md) | delivery, the vertical — nineteen boarded seams in the primitives the vertical composes (the story contract, the observer, the publish repeat, the review loop, the reactor's size and dead branch, review after repair, the sandbox profile, the supervisor's signals), settled in one order with a criterion each | every primitive closed; the head pair's delivery lane, before WO-123, which depends on it (hard); filed 2026-10-02 from nineteen register rows re-observed at `08845c71`; assign version at activation (minor) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): criterion 13 shows only that the verifier does not stop over the two planted review defects, and no arm shows a behavior defect still failing with the notice present; reopen when a verification of a review-enabled stream with the notice passes a behavior criterion that the review, the final review or a repair later finds unmet. Twelve of the nineteen rows precede WO-123 only because this order opens their seam, and the saving from combining them is unmeasured; reopen when this order's first verification or final review fails on, or a repair is driven by, such an item while WO-123's activation waits. Two host imports stay inside the reactor's import closure; reopen when a replay decides differently from the live run through either module, or a later order proposes a third exclusion. | implementer, then independent verifier | doubles; three live Claude verifier-and-review attempts and one live feedback episode, run by the executor under the standing rule | `packages/compiler/src/story-contract.ts`, the judged skeleton files the order names, target scripts, their tests |
| [WO-185](../work-orders/WO-185-no-order-can-exhaust-the-host.md) | machinery, host safety — a guard outside the agent that measures footprint and stops a runaway process group; task, gate and total budgets as shares of physical memory; bounded corpus assertions; a bounded wrapper for ad hoc probes; one guard and one lane count per user on the host | WO-107 and WO-174 closed; the head pair's machinery lane; filed 2026-10-02 from the operator's incident note and WO-102 D010; assign version at activation (patch) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): a lane is reclaimed only when its holder's process is gone, so a live holder that has stopped making progress keeps every gate on the host waiting; reopen when a gate waits on a holder that has made no progress for longer than the waiting gate's own last wall-clock, or a holder is killed by hand to release one. One guard serves every clone while budgets live in each clone's own file and the lane count has no stated home; reopen when two clones or instances declare different budgets, lane counts or guard versions and one is decided by the other's. A tree the resident launches before any session has dispatched has no started guard; reopen when a resident-launched episode runs with no live guard, or passes a task budget without a stop. Budgets are shares of physical memory sized from peaks measured on this host; reopen when a stop fires on another host for a task whose measured peak there is no higher than the recorded one. | implementer, then independent verifier | a host whose physical memory the guard can read; the confirmation run happens under the guard's own bound | `scripts/host-guard.mjs` (new), `scripts/test-runner.mjs`, `scripts/harness.mjs`, `docs/control/budgets.json`, `corpus/harness/` |
| [WO-186](../work-orders/WO-186-gate-time-follows-the-change.md) | machinery, gate cost — three slow cases repaired at their cause; task-level reuse at one code identity; an identity that covers untracked code and the document inputs; main's rows read from a worktree; records written while a gate runs; two planning-entry conditions | WO-185 closed (hard: the runner's budgets land first); WO-173, WO-174 and WO-179 closed; the second pair's machinery lane; filed 2026-10-02 from the operator's note and the gate replay; assign version at activation (patch) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. | implementer, then independent verifier | the replay script as evidence; second-process proof for every reuse path | `scripts/test-runner.mjs`, `packages/skeleton/src/gate-evidence.mjs`, `scripts/lib/gate-reuse.mjs`, the three named suites |
| [WO-187](../work-orders/WO-187-verification-attacks-and-reviews.md) | machinery, the review funnel — the verifier attacks the change, reviews the implementation and uses one fresh adversary; the executor self-reviews first; the verify briefing prints the order's known issues; final-review findings carry a class that planning counts; spawned workers run a generated definition with the pinned model and effort | WO-179, WO-173 and WO-172 closed; the third pair's machinery lane, after WO-186; filed 2026-10-02 from the operator's note and the reading of thirteen failed final reviews; assign version at activation (patch) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): the escape count is the final reviewer's own class for each finding and nothing checks it; reopen when a finding classed integration or new-scope concerns lines already present in the verified subject. The self-review duty is evidenced by a handoff line and only advised when missing; reopen when a handoff carries the line and its verification or final review then blocks on a defect of a kind the sentence names. Verification time and the sub-agent per completion have no bound; reopen when, over the ten orders after this one, the rise in median verification time above 842 s exceeds the failed-final-review time removed per order. | implementer, then independent verifier; this order's own verification runs under the new text | none beyond the harness's spawn | `packages/skeleton/src/loadouts/contributor.ts`, `packages/compiler/src/harness.ts`, `scripts/resume.mjs`, `scripts/lib/plan-failures.mjs`, product 07 |
| [WO-188](../work-orders/WO-188-boarded-machinery-items.md) | machinery, one order of small items — twenty-four boarded items with a change and a criterion each (the scratch rule, one release-close command builder, the operator-word check widened, the comment rule, the experiment no longer per-order, the pull-request body's generated parts), and five boarded questions decided without code | WO-176, WO-178 and WO-150 closed; WO-187 closed (hard: both edit the role text); the fourth pair's machinery lane; filed 2026-10-02 at the operator's direction for a combined order planned with care; assign version at activation (minor) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): release close removes every nested repository outside the intake lane, one an earlier completion declared kept among them, and the record keeps evidence of a loss, not the content; reopen when a close record lists a removed repository whose head no remote held and a later order, a verification or the operator needs its commits. Criteria 7 and 9 change what the operator-burden series counts; reopen when that series reports a change whose delta spans this order without the change of definition being marked. | implementer, then independent verifier | none | the scripts and role text each item names; `docs/control/doc-baseline.json` |
| [WO-189](../work-orders/WO-189-front-page.md) | machinery, the front page — an inventory of every paragraph, three candidate pages scored by fresh readers, the operator's choice, a release block that holds one generated line, and a check that refuses an order's edit to the page unless its criteria name it | WO-068 and WO-086 closed; the fifth pair's machinery lane, free to run as a third lane at any time; filed 2026-10-02 from the operator's note, the third time the page's growth was raised; assign version at activation (patch) | implementer, then independent verifier; the operator picks the candidate at final review, with a recorded fallback | fresh reader agents | `README.md`, `scripts/lib/release-preparation.mjs`, `scripts/release.mjs`, `scripts/docs-check.mjs`, `docs/PLAYBOOK.md`, product 07 |
| [WO-190](../work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md) | machinery, navigation — the index holds the active line, the sequence and the queued cards in sequence order, with settled orders on a companion page; an umbrella record is a header class shown as superseded and refused at activation; every open order has a position; the roadmap leads with the rungs ahead | WO-158 and WO-086 closed; the sixth pair's machinery lane; filed 2026-10-02 from the operator's note; assign version at activation (patch) | implementer, then independent verifier | none | `scripts/work-orders.mjs`, `scripts/resume.mjs`, `packages/console/src`, product 06 |
| [WO-191](../work-orders/WO-191-reader-profiles.md) | machinery, published text — one committed profile per surface over five dimensions, an examples library, guidance printed where titles, bodies and notes are written, and a score from fresh readers collected at planning passes; no text is refused or rewritten | WO-188 closed (hard: its item 24 repairs the generated parts the examples start from); WO-126 closed; the seventh pair's machinery lane; filed 2026-10-02 from the operator's note; assign version at activation (patch) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): by the order's own figures the removal (three corrections, none after 2026-09-09) is smaller than the addition, and the score is an agent's judgment; reopen when an operator style correction is recorded on a surface whose profile is committed, or two scoring runs in a row are followed by no decision that cites them. WO-188's body-profile check refuses forms this order's guidance could ask for, and no precedence is stated; reopen when a guidance line or example asks for a form the check refuses, or an order edits one to satisfy the other. | implementer, then independent verifier; the operator picks profiles from the examples, with a recorded fallback | fresh reader agents | `scripts/reader.mjs` (new), `scripts/worktree.mjs`, `scripts/release.mjs`, `contributor.ts`, product 08, `docs/publication/` |
| [WO-192](../work-orders/WO-192-router-drives-an-order.md) | delivery, orchestration — `drive: WO-NNN` selects a router role that reads the canonical status and starts one fresh worker per phase with the phrase as its whole prompt; identity, writer and sub-agent budget per worker; probe first, with one separate session per phase as the fallback | WO-187 closed (hard: the generated agent definition); WO-139, WO-135, WO-130 and WO-158 closed; a single entry after WO-118 (amended 2026-10-02: the product exit does not wait behind the instance orders), movable into the machinery lane after WO-188 at the operator's word; filed 2026-10-02; assign version at activation (minor) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. Receipt 039 known issues (2026-10-02): the Cost line counts moving phase work into workers as a removal, though the same work still runs; reopen when the live drive's record shows router plus worker usage at or above the same phases run as separate sessions, or a decision cites worker-side usage as saved. The router is a second lifecycle driver beside the resident; reopen when a later order implements the same re-entry, repair-bound or next-action rule in both, or the two disagree about an order both can see. The router's new root has no cold-start ceiling; reopen when it is generated with none in the budgets file. | implementer, then independent verifier | the installed host version's behavior for spawned agents, recorded by the order's first criterion; one live driven order in a scratch clone | `packages/skeleton/src/harness-host.ts`, `subagent-budget.ts`, `contributor.ts`, `packages/compiler/src/harness.ts`, `scripts/resume.mjs`, product 07 |
| [WO-193](../work-orders/WO-193-instance-capability-requests.md) | delivery, the starter — a kit command that drafts, screens and files a generic, operator-written request; `requests.route` defaulting to `none`; a planning intake of labelled issues into register candidates; request identifiers in the sibling receipt and the update note; a deployment-record template | WO-074, WO-077 and WO-078 closed (hard); WO-062, WO-063 and WO-060 closed; a single entry after WO-192; filed 2026-10-02; Clean Room applies with force: nothing from an instance leaves it except the request's own sentences; assign version at activation (minor) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. | implementer, then independent verifier | one live request under the operator's grant at execution | the export's file set, `scripts/request.mjs` (new), `scripts/refute-plan.mjs`, `scripts/work-orders.mjs`, products 03, 07 and 12 |
| [WO-194](../work-orders/WO-194-private-predecessor-map.md) | delivery, the starter — a kit command and row schema for an instance-owned map from each predecessor behavior to what carries it, with six mapping statuses, a report that says when a generation is fully carried, and a request draft built from a row's generic statement only | WO-074, WO-076 and WO-193 closed (hard); a single entry after WO-193; filed 2026-10-02; Clean Room applies with force: every row in this repository is synthetic or already public generic text, and a need for a predecessor fact is the stop condition; assign version at activation (minor) Receipt 038's known issues are written in the order's own text, amended by the operator-answer pass of 2026-10-02. | implementer, then independent verifier | synthetic rows only | the export's file set, `scripts/parity.mjs` (new), kit templates, products 10 and 12 |
| [WO-195](../work-orders/WO-195-roles-finish-what-was-dispatched.md) | machinery, the finish — the release-close admission recorded and applied when main's built adapter is stale after the merge; one admitted spelling and a short helper output with the full report retained; write permission restored before removal, a directory Git dropped removed on the same or a later run, the merged branch deleted by the run that removes the worktree; a release-close sentence that names when the close is done and makes the re-run the retry; a planning pass that pushes its branch and opens its pull request | WO-178, WO-179 and WO-176 closed; next, a third lane beside WO-185 (shared `harness-host.ts` and `resume.mjs`); filed 2026-10-03 from the operator's dispatch and the WO-184 close; takes WO-188 item 2; assign version at activation. Receipt 040 known issues (2026-10-03): the admission has never fired live, so whether Claude Code's auto mode honors a DotLn allow over its classifier is unobserved; reopen when the first Claude close after WO-195 journals `releaseCloseAdmission` and still shows a host denial or an operator-run close command. The planning half lands as a sentence and a write-back with no helper or fixture; reopen when a planning pass after WO-195 ends without its branch pushed and its pull request open, or the operator asks for them. The classifier may deny the planning push or `gh pr create` too, and nothing admits them; reopen when a planning session after WO-195 records that denial. No criterion recounts operator-run close commands or push requests after landing; reopen when the next pass finds either, or finds them uncounted. No critical-path gate is named; reopen when a gate order waits behind WO-195 while Claude closes still need the operator. A failed write of the full report would lose output that reaches the session today; reopen when a summary names a report that is missing or short. |
| [WO-196](../work-orders/WO-196-the-handoff-is-one-command.md) | machinery, the handoff — the product and review gates run Prettier as their first preflight and refuse to start otherwise; a review gate at an unchanged identity reuses its passing tasks; every role opens with a numbered procedure and the shared rules follow it; one adversary and one improver run once at implementation-ready; a spawn during a live gate is advised; the document ceiling check advises | WO-187, WO-186, WO-185 and WO-195 closed; runs next and alone (operator direction, 2026-10-07); filed 2026-10-07 from the failure record of the six orders closed since 2026-10-03; assign version at activation (minor) Receipt 041 known issues (2026-10-07): Reuse is keyed on the code identity. WO-198, which runs after this order, records that a gate result can change when a sibling merges into main or tags a release (WO-179 D012), and its objective is to make results independent of those refs. Until WO-198 lands, and afterwards unless reuse compares the sharedRefs WO-198 records, a reused review row whose task result depended on a shared ref or on host state outside the identity passes the verifier and the final reviewer without the product task re-running. This is a constructible case, not an observed one (criterion 2); reopen when A task recorded reused:true at some identity later fails when run fresh or with --again at the same code identity, or WO-198's fixture records a task result flipping across a shared-ref change. The cost table records that the last eight first verifications all failed (8 counted, 8 failed) while an adversary ran at each verification. Criterion 4 keeps one adversary and one improver, and only before implementation-ready. If the verification adversary was finding part of what those first verifications failed on, defects move to final review or to the operator (criterion 4); reopen when Among orders closed after WO-196, a final review or release close records a criterion breach that the passing verification missed, or operator corrections in the verification and final-review phases rise above the WO-195 to WO-112 series in the shifting-the-burden observation. Criterion 8 makes a product document over its ceiling an advisory and removes the raise rule. Ten or more orders in this horizon write product 07 (175,881 bytes on 2026-10-07 per WO-074), and others write 02, 04, 06, 10 and 12. That leaves the next pass reading the advisory as the only control, which could make growth normal (drift to low performance) (criterion 8); reopen when The next planning pass's plan conditions shows the same product document over its ceiling in two consecutive passes, or product 07 is larger at the end of the horizon than at WO-196's base with no planning decision recorded. The preflight format refusal stops every plain and review gate if the formatter itself misbehaves (missing, version drift, non-idempotent output), and the order states no way to fall back (criterion 1); reopen when A preflight refusal names a file that npm run format leaves unchanged, or preflight refuses on a host where the formatter is absent. | implementer, then independent verifier | none | `scripts/test-runner.mjs`, `scripts/lib/gate-reuse.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `executor-supports.ts`, `goal-alignment.ts`, `packages/skeleton/src/harness-host.ts`, `scripts/lib/handoff-ledger.mjs`, `scripts/resume.mjs`, `scripts/docs-check.mjs`, the regenerated roots, `docs/PLAYBOOK.md` |
| [WO-197](../work-orders/WO-197-slow-suites-back-to-their-medians.md) | machinery, gate time — three gate tasks that crossed their thirty-day medians (`target-publish` twentyfold, `worktree-integration`, `harness-fixtures`) repaired at their cause with a bound assertion each, and the vertical suite's three slowest cases named | WO-196 and WO-186 closed; the first pair's machinery lane beside WO-074; filed 2026-10-07 from the three holding gate-task conditions; assign version at activation (patch) Receipt 041 known issues (2026-10-07): Bound assertions at twice the repaired duration turn host load into gate failures. Gates run at the same time in linked worktrees (the premise of WO-198), so a correct case can fail under contention, and guard refusals or reruns rise (policy resistance) (criterion 3); reopen when A bound assertion added by WO-197 fails in a gate row where that case's functional assertions pass, or a fresh rerun at the same identity passes the same case. | implementer, then independent verifier | per-case durations on the gate rows | `scripts/test-target-publish.mjs`, `scripts/test-worktree-integration.mjs`, `scripts/test-harness.mjs`, the library files their causes name, `docs/evidence/WO-197/` |
| [WO-198](../work-orders/WO-198-a-worktree-gate-names-what-moved.md) | machinery, gates in worktrees — every gate row records the shared refs it saw (origin/main, main, tags, refs/dotln), a failed row names the ones that moved, and a fixture runs a worktree's gates across a sibling merge and tag; a task the fixture shows flipping is repaired at its cause | WO-196 closed (hard: both edit the runner); the second pair's machinery lane beside WO-075; filed 2026-10-07 from the operator's report that a passing suite fails when main is merged; assign version at activation (patch) Receipt 041 known issues (2026-10-07): The new runner-fixtures case runs a worktree's document and plain gates twice, with a commit, an annotated tag and a push in between. If those are real gates rather than fixture-sized ones, every later runner-fixtures run pays for them. That is the same kind of task growth WO-197 is spending an order to reverse (tragedy of the commons) (criterion 3); reopen when The runner-fixtures task duration after WO-198 is above its thirty-day median before WO-198 plus one quarter (the rule WO-197 uses). | implementer, then independent verifier | a launchpad fixture with a linked worktree and a bare origin | `scripts/test-runner.mjs`, `scripts/test-runner.test.mjs`, `packages/skeleton/src/gate-evidence.mjs`, product 07 |
| [WO-199](../work-orders/WO-199-the-vertical-survives-an-interrupt.md) | delivery, the vertical — a writer launched through the vertical records its process group so a crash recovers like the direct transport; an interrupted `dotln vertical` stops its writer and resumes on rerun; a host refusal after a writer's result records its own reason (WO-112 D060, D065, D066) | WO-112 and WO-123 closed; the first pair's delivery lane beside WO-197; WO-118 depends on it (hard); filed 2026-10-07 from WO-112 FINAL-001's handoff and the no-code screen of WO-118; assign version at activation (patch); one live feedback episode (source-change-host.ts and vertical.ts are feedback-judged) Receipt 041 known issues (2026-10-07): After a host crash or SIGKILL no handler runs, so the writer group keeps acting on the governed worktree until a later dotln vertical run performs recovery. The objective accepts this ("a writer a dead host left alive is stopped by the next run's recovery"). For the crash case, then, the D060 hazard (edits after the host stopped) lasts for an unbounded interval. This is constructible, not observed (criterion 1); reopen when A crash-vertical probe run records a governed-worktree write after the host died and before the next run, or WO-118's resident restart finds a writer group from the dead host still writing. | implementer, then independent verifier | the WO-112 recovery probe; a stub writer | `scripts/lib/vertical-transport.mjs`, `packages/skeleton/src/source-change-host.ts`, `packages/skeleton/src/dotln.ts`, `scripts/test-vertical.mjs`, `packages/skeleton/test/source-change-integrity.test.ts`, the skeleton README |
| [WO-101](../work-orders/WO-101-program-and-hash-corpus.md)            | evidence/corpus — Program and identity regression floor                                                                                                                                                                                                                                        | not applicable                                                                                                                                                                                                             | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | `corpus/harness/`, fixtures, manifests                                                                                                                                                                           |
| [WO-102](../work-orders/WO-102-cadence-corpus.md)                     | evidence/corpus — cadence boundary sweep                                                                                                                                                                                                                                                       | assign version and close disposition; pin suitable base/deps and governed closeout path Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | cadence fixtures and manifests                                                                                                                                                                                   |
| [WO-103](../work-orders/WO-103-authority-outbox-corpus.md)            | evidence/corpus — authority/outbox decision table                                                                                                                                                                                                                                              | assign version and close disposition; pin the landed WO-017 base and governed closeout path Cleanup pass 2026-09-19 carry-in: the audit under-links a caller-error refusal and this oracle has no such cell (WO-017 FINAL-001 adjudication 8). Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | authority/outbox fixtures and manifests                                                                                                                                                                          |
| [WO-105](../work-orders/WO-105-crash-shape-corpus.md)                 | evidence/recovery — crash/truncation sweep                                                                                                                                                                                                                                                     | assign version and close disposition; pin the landed WO-017 base and governed closeout path Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | long deterministic corpus executor                                                                        | offline harness                                                                                                                                                       | retained store/skeleton corpus, trees, traces, fixtures, manifests                                                                                                                                               |
| [WO-107](../work-orders/WO-107-profiling-baseline.md)                 | performance evidence — baseline without optimization                                                                                                                                                                                                                                           | assign version and close disposition; pin suitable base/deps and governed closeout path Amended 2026-09-28: re-observed at `5f3849ec` and brought to the current order form (both gates, re-mints, declared sets, bounded write-backs, the executor's live steps; the planning document §10.4). | measurement operator                                                                                      | representative quiet environment; two runs are acceptance evidence                                                                                                    | profiling harness, baselines, manifests                                                                                                                                                                          |
| [WO-108](../work-orders/WO-108-mutation-probe.md)                     | evidence quality — current kernel/compiler/skeleton mutation campaign; survivors become investigations                                                                                                                                                                                         | operator-amended on published v0.13.0; v0.13.1 tooling/evidence patch; locked dependencies provisioned offline                                                                                                             | mutation-evidence implementer, independent verifier, final reviewer                                       | deterministic census and 32-site selection; real green baseline, scratch provenance, resumable matrix                                                                 | corpus mutation runner/data/run evidence; root test wiring; current reader docs and ideation receipt                                                                                                             |
| [WO-109](../work-orders/WO-109-shape-first-source-remine.md)          | research/lineage — bounded shape-first re-mining pilot and measured yield                                                                                                                                                                                                                      | revalidate authoritative single-copy intake in main and narrow access; observe original-resolution image harness; pin budget, yield threshold, version, and close                                                          | mechanical census/capsules, planning-role lineage/weaving, independent verifier                           | mechanical census/register/capsule side routines may use high+; observed image-capable harness required                                                               | main-checkout ignored registers; immutable `docs/lineage/remining/runs/draw-001/` artifacts                                                                                                                      |

## Tracks and dispatch dimensions

The labels above are pilot metadata, not a final taxonomy:

- **Mainline/product:** the release ladder and its bounded patches.
- **Evidence/corpus:** independent grind work that strengthens evidence without
  becoming release evidence automatically.
- **Research candidate:** source or scenario exploration without an allocated
  work-order identity yet.

“Who should work it?” needs several independent fields: planning, execution,
verification, and final-review role; model and effort constraint; harness;
needed tools or external access; and environmental conditions. “What does it
affect?” needs a conceptual product/app area plus an optional writable-path
envelope. “What does it require?” needs hard dependency separately from
activation preflight.

**Lane pairs (operator direction, 2026-09-16; recut 2026-09-17).** The
sequence groups queued orders two per pair for two parallel lanes: adjacent
entries, blank-separated, with disjoint primary surfaces and no hard edge
inside the pair; the delivery lane is the first entry and the second lane is
by preference an evidence-only or machinery order, so its integration has no
release retime and no source merge. Two operator-assisted orders never share
a pair; live local inference never overlaps a product gate. The second
lane's final review integrates main by the checklist in product 07
§Independent workflows and integration (one command once WO-079 lands); one
order at a time passes final review and release close. The fifteen pairs are
argued in [the vision-into-use document](vision-into-use-2026-09-17.md#4-the-corrected-sequence-and-the-two-lanes);
the earlier cut is in [the R1 replan document](r1-replan-2026-09-16.md#7-lane-pairs).
The plan check verifies typed hard edges against the list once WO-135 lands.

Unallocated research candidates currently include the source-grounded Team
Topologies mining pass and the post-1.0 Embodied Explorer simulation fixture.
They have no WO number, execution slot, or release promise merely because they
appear here.

## Pilot questions

- Is family single-valued or can one order span several tracks, as WO-004 did?
- Should planning metadata live in each work order, a separate registry, or a
  generated projection over both?
- What evidence boundary should the operator-facing word “complete” default to?
- How should in-slot and governed out-of-slot eligibility appear together?
- Which conditions can be computed, and which require explicit operator
  preflight or recommendation?
- Does a human alias improve scanning enough to justify a second identifier?

The generated index answers the evidence-state question after this pilot exposed
repeated drift. Historical IDs remain unchanged. Standardized front matter, a
registry, a scheduler, and an automatic recommendation remain unselected; the
remaining questions need their own bounded consumer and evidence.
