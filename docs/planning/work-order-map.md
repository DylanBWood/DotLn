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

**WO-053 checkpoint disposition (2026-09-17):** [both live writer smokes and commit-identity recovery passed](../evidence/WO-053/README.md); R2's combined prioritization decision awaits WO-111's receipt, with no export decision or family waiver inferred.

**Outstanding cleanup (2026-09-19):** the operator budgeted one pass for logged non-blocking issues, unread suggestions and continuing debt. Eight read-only surveys read the 371 pending register rows, 190 verification and final-review reports, 47 refutation receipts, the dated planning documents and the tree against `main` at `3b3533f8`; the pass disposed the register, filed [WO-142](../work-orders/WO-142-outstanding-cleanup.md) (50 rows, each re-observed before it is edited and ended as fixed, not reproduced or returned), paired it with WO-084, lent WO-090 the pair slot WO-138 cannot use while WO-137's outcome is `inconclusive`, held WO-085 to WO-089 with a re-measured reason each, and recorded what did not fit as the candidates section dated 2026-09-19 below. The record is [the cleanup planning document](outstanding-cleanup-2026-09-19.md).

**Operator answers (2026-09-19, second pass):** the operator answered the cleanup pass's open decisions and directed that a pass plan what it finds. Filed: [WO-143](../work-orders/WO-143-resident-lock-recovery.md) (a resident killed inside lock acquisition restarts without a human; the capability table's blocker for `runtime.resident` level 2), [WO-144](../work-orders/WO-144-outside-project-write-grant.md) (outside-project writes need a role or support grant; a fifth refusal for known destinations) and [WO-145](../work-orders/WO-145-tinkerer-economy-experiment.md) (the first Tinkerer experiment: economy, three trial orders, a pre-registered reading). WO-138 is amended to activate on WO-137's successful live row because its inputs are public; the stale 120 s `fastGateMs` ceiling is unset; WO-142 gains row B17 from the operator's broken-windows source (a defect met is fixed or boarded up as a record, never left as a sentence in a report). The record is [the cleanup planning document](outstanding-cleanup-2026-09-19.md) §10 and §11.

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
dispositions are in
[proof-carrying-gates-2026-09-12-dispositions.json](proof-carrying-gates-2026-09-12-dispositions.json);
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

WO-014 remains a floating option when approval friction is the constraint.
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
  mandatory cleanup, selected layout, order number, or activation is assigned.
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
  comparison before implementing the [system baseline](../product/06-roadmap.md#candidate--bounded-system-baseline)
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
   re-probe. Reopen: the next order with a live harness smoke.
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

The [index](../work-orders/README.md) defines its evidence labels. Control
closure, repository integration, and release inclusion are distinct boundaries.
A historical order is explicitly time-indexed; absence of events is not proof
of completion. Dependency state belongs to the index's typed projection,
shared with selected lifecycle JSON status (WO-043, 2026-09-11). Unmet hard,
closure, release or planning-deferral entries refuse activation; references,
historical evidence, waivers and supersessions do not. Unmarked authorities
keep a labeled conservative token view that does not block. A dependency-ready
row still needs human preflight and selection.

## Catalog — human preflight and scope notes

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
| [WO-014](../work-orders/WO-014-approval-burden-contract.md)           | harness evidence/process — approval-burden contract; carries WO-006's deferred posture reconciliation                                                                                                                                                                                          | assign version and close disposition; both harnesses installed at recorded versions; operator available to witness fresh-session runs                                                                                      | harness-evidence executor, independent fresh-session verifier, operator witness                           | Claude Code and Codex CLI; personal-setting authority stays with the operator                                                                                         | runbook, ADR-0003/ADR-0004 amendments, `docs/discovery/` matrices, a synthetic approval-surface fixture                                                                                                          |
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
| [WO-036](../work-orders/WO-036-evidence-runner.md)                    | test infrastructure — build-first evidence runner with concurrent suites and per-case reporting                                                                                                                                                                                                | remains active (2026-09-08 critical path): any free lane beside WO-042 and WO-043; assign version at activation (patch); carries the WO-033 build-first reorder                                                            | test-infrastructure implementer, then independent verifier                                                | the same host and commit for the before/after timing                                                                                                                  | `package.json` `test`, `scripts/test-runner.mjs`, `scripts/test-*.mjs`, product 07 evidence-gate sentence, README test paragraph                                                                                 |
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
| [WO-056](../work-orders/WO-056-live-verification-and-repair.md)       | live proof — a planted defect caught by a live verifier, repaired, re-verified                                                                                                                                                                                                                 | WO-055 and WO-053 merged; the operator runs the episodes; assign version at activation (patch) Cleanup pass 2026-09-19 carry-ins: state whether host deadlines are the only stall bound (kernel Await timeouts decode and are never evaluated; WO-046 FINAL-001 obs 2), whether a repair writer may edit the test its re-verification runs (WO-055 FINAL-001 item 1), and record the first real-model observation of the rewritten writer prompt (WO-055 FINAL-001 R1) and of the Claude writer launch without the auto-memory flag (WO-051 VER-001 F1). | operator-run episodes; independent verifier reads the receipt                                             | the actual harnesses; the scratch repository                                                                                                                          | `docs/evidence/WO-056/`                                                                                                                                                                                          |
| [WO-057](../work-orders/WO-057-browser-runtime-truth.md)              | discovery — whether a Playwright runtime installs, launches and dies cleanly here without the harness's server; an ADR-0002 amendment                                                                                                                                                          | no open input; operator runs the online rows; assign version at activation (patch)                                                                                                                                         | probe author, then independent verifier                                                                   | a throwaway package outside the workspace                                                                                                                             | `docs/discovery/`, ADR-0002 §Amendments, `docs/LEGAL.md`                                                                                                                                                         |
| [WO-058](../work-orders/WO-058-visual-and-network-claim-types.md)     | verification contract — `visual` and `network` claim types with witness rules, no browser                                                                                                                                                                                                      | no open input; assign version at activation (minor)                                                                                                                                                                        | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/verification.ts`, product 02 and 10                                                                                                                                                       |
| [WO-059](../work-orders/WO-059-playwright-evidence-adapter.md)        | evidence adapter — a workspace package driving a synthetic app to produce the witnesses; the first runtime dependency                                                                                                                                                                          | WO-057 and WO-058 merged; assign version at activation (minor); inventory and NOTICE entries                                                                                                                               | adapter implementer, then independent verifier                                                            | a local browser; no MCP server                                                                                                                                        | `packages/browser-evidence/` (new), root manifest and lockfile, product 03                                                                                                                                       |
| [WO-060](../work-orders/WO-060-source-bundle-contract.md)             | intake contract — `SourceBundle` v1 with a decoder, a hash and a secret screen                                                                                                                                                                                                                 | no open input; assign version at activation (minor)                                                                                                                                                                        | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/` (source-bundle module), product 03                                                                                                                                                      |
| [WO-061](../work-orders/WO-061-story-contract-compile.md)             | intake compile — classified, provenance-bearing statements and criteria; the source-revision guard                                                                                                                                                                                             | WO-060 merged; assign version at activation (minor)                                                                                                                                                                        | compiler implementer, then independent verifier                                                           | deterministic fixtures with an inference double                                                                                                                       | `packages/compiler/src/` (story-contract module), product 12                                                                                                                                                     |
| [WO-062](../work-orders/WO-062-github-issue-source-adapter.md)        | intake adapter — a read-only adapter over the GitHub CLI into a bundle                                                                                                                                                                                                                         | WO-060 merged; assign version at activation (minor); operator runs the live smoke                                                                                                                                          | skeleton implementer, then independent verifier                                                           | recorded CLI JSON; one personal public repository issue                                                                                                               | `packages/skeleton/src/` (source adapter), the CLI helper and stub                                                                                                                                               |
| [WO-063](../work-orders/WO-063-outward-artifact-lint.md)              | control plane — conventional-commit shape and two-part vocabulary camouflage over branch names, commits and pull-request text                                                                                                                                                                  | no open input; assign version at activation (patch)                                                                                                                                                                        | tooling implementer, then independent verifier                                                            | deterministic fixtures; the local-terms list where present                                                                                                            | `scripts/lib/outward-lint.mjs` (new), a committed vocabulary file                                                                                                                                                |
| [WO-064](../work-orders/WO-064-target-publish.md)                     | delivery adapter — push and pull request on a target under an explicit remote grant, body generated from artifacts                                                                                                                                                                             | WO-052, WO-063 and WO-042 merged; assign version at activation (minor); operator runs the smoke against a scratch remote                                                                                                   | control-plane implementer, then independent verifier                                                      | the CLI stub; a scratch remote                                                                                                                                        | `scripts/worktree.mjs`, `scripts/github-body.mjs`, product 07                                                                                                                                                    |
| [WO-065](../work-orders/WO-065-pull-request-state-observation.md)     | delivery adapter — checks and review comments observed into classified events on demand                                                                                                                                                                                                        | WO-064 merged; assign version at activation (minor)                                                                                                                                                                        | skeleton implementer, then independent verifier                                                           | recorded CLI JSON; the scratch pull request                                                                                                                           | `packages/skeleton/src/` (pull-request observer)                                                                                                                                                                 |
| [WO-066](../work-orders/WO-066-review-comment-resolution-loop.md)     | delivery loop — each automated comment or failing check derives a bounded repair until resolved or `NeedsHuman`                                                                                                                                                                                | WO-065 and WO-055 merged; assign version at activation (minor) Cleanup pass 2026-09-19 carry-in: `roundLimit` lives on the repair's original, not on a work-order field as WO-055's design line says; record one reading before reusing the derivation (WO-055 FINAL-001 item 3). | skeleton implementer, then independent verifier                                                           | doubles over recorded observations                                                                                                                                    | `packages/skeleton/src/` (the loop continuation), product 06                                                                                                                                                     |
| [WO-067](../work-orders/WO-067-presence-policy-compiled.md)           | composition — the presence policy: the progressive absence curve as phases, cadences and narrowing envelopes                                                                                                                                                                                   | WO-042 merged; assign version at activation (minor); the operator confirms the curve reading                                                                                                                               | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler` (types, compile, normalize, render), products 02/03/04, ADR-0007 §Amendments                                                                                                                 |
| [WO-068](../work-orders/WO-068-resident-host.md) | runtime — the offline resident process: recorded clock, WO-067's statechart, the `script` actor kind, idempotent restart and a `--once` tick for an outside scheduler (R1 design, 2026-09-16) | WO-067, WO-050, WO-044 and WO-009 closed; lane pair with WO-133; assign version at activation (minor) | skeleton implementer, then independent verifier | fake clock and doubles; no harness | `packages/skeleton/src/resident-host.ts`, `actor-catalog.ts`, `reactor.ts` (one slice), `dotln.ts` |
| [WO-069](../work-orders/WO-069-configuration-root.md)                 | control plane — `dotln.config.json` and one loader; absence reproduces today byte for byte                                                                                                                                                                                                     | no open input; assign version at activation (patch)                                                                                                                                                                        | control-plane implementer, then independent verifier                                                      | repository-wide fixtures                                                                                                                                              | `scripts/lib/config.mjs` (new), every `scripts/*.mjs` root literal, product 07 and 10                                                                                                                            |
| [WO-070](../work-orders/WO-070-beacon-portability.md)                 | control plane — one module identity for the build-free Beacon leaves; Beacons without the skeleton package                                                                                                                                                                                     | no open input; assign version at activation (patch)                                                                                                                                                                        | control-plane implementer, then independent verifier                                                      | Beacon fixtures                                                                                                                                                       | the seven `.mjs` leaves, `scripts/lib/beacons.mjs`, `beacon-observe.mjs`, `scripts/resume.mjs`                                                                                                                   |
| [WO-071](../work-orders/WO-071-registered-target-repositories.md)     | control plane — the `Repository:` field, registration with an authority profile applied through the floor                                                                                                                                                                                      | WO-069 and WO-042 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | fixtures with scratch repositories                                                                                                                                    | `scripts/lib/config.mjs`, `scripts/work-orders.mjs`, `scripts/resume.mjs`, products 07 and 12                                                                                                                    |
| [WO-072](../work-orders/WO-072-target-worktree-lifecycle.md)          | control plane — target worktrees from a launchpad with the emitted bundle, the local registry, reports in the launchpad, no-release close                                                                                                                                                      | WO-071 and WO-049 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | a real-Git launchpad-and-target fixture                                                                                                                               | `scripts/worktree.mjs`, `scripts/resume.mjs`, `scripts/release.mjs`, the playbook                                                                                                                                |
| [WO-073](../work-orders/WO-073-repository-class-and-profile.md)       | control plane — repository classes and on-demand profile documents; policy layers launchpad → class → repository                                                                                                                                                                               | WO-071 merged; assign version at activation (minor); target-application profiles are the fork's                                                                                                                            | control-plane implementer, then independent verifier                                                      | fixtures; the directed-load measurement                                                                                                                               | `scripts/lib/config.mjs`, the role skill render, `docs/repositories/`                                                                                                                                            |
| [WO-074](../work-orders/WO-074-launchpad-export-kit.md)               | starter — `launchpad export` with the manifest-listed kit, templates and license files                                                                                                                                                                                                         | WO-069, WO-070 and WO-038 merged; assign version at activation (minor); the reviewer reads the exported text Cleanup pass 2026-09-19 carry-in: criterion 5 asks for a version refusal the 2026-09-15 stand-down removed (receipt 017 known issue); amend before activation. 2026-09-19 (second pass): the export writes outside the project, so under WO-144 its role needs an operator-named outside root until order-named roots exist. | control-plane implementer, then independent verifier                                                      | offline `npm ci` for the export fixture                                                                                                                               | `scripts/launchpad.mjs` (new), the kit manifest generator, templates                                                                                                                                             |
| [WO-075](../work-orders/WO-075-kit-runtime-and-bundle.md)             | starter — the pinned runtime build and the Contributor bundle inside the export, `harness check` in its test chain                                                                                                                                                                             | WO-074, WO-049 and WO-042 merged; assign version at activation (minor); operator runs the smoke in the export                                                                                                              | control-plane implementer, then independent verifier                                                      | the actual harness for the smoke                                                                                                                                      | `scripts/launchpad.mjs`, the emitter's import root                                                                                                                                                               |
| [WO-076](../work-orders/WO-076-instance-build-overlay.md)             | starter — the fork's `build/overlay.json` composed over the kit build under the floor                                                                                                                                                                                                          | WO-075 and WO-042 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | fixture overlays                                                                                                                                                      | `scripts/harness.mjs`, `scripts/lib/harness.mjs`, the client README, ADR-0006 §Amendments                                                                                                                        |
| [WO-077](../work-orders/WO-077-launchpad-export-update.md)            | starter — `--update` by manifest, refusing modified kit files, printing instance actions                                                                                                                                                                                                       | WO-074 merged; assign version at activation (minor)                                                                                                                                                                        | control-plane implementer, then independent verifier                                                      | fixture exports                                                                                                                                                       | `scripts/launchpad.mjs`                                                                                                                                                                                          |
| [WO-078](../work-orders/WO-078-sibling-registry.md)                   | starter — the sibling registry and export receipts with a check                                                                                                                                                                                                                                | WO-074 merged; assign version at activation (patch)                                                                                                                                                                        | documentation/tooling implementer, then independent verifier                                              | fixture receipts                                                                                                                                                      | `docs/siblings/README.md`, `docs/evidence/siblings/`                                                                                                                                                             |
| [WO-079](../work-orders/WO-079-worktree-sync.md) | control plane — `worktree integrate`: the second lane's integration checklist as one command (checkpoint, named stash, merge main, regenerate generated surfaces, union the register, retime with a dated decision stub, print the affected checks); rewritten 2026-09-17 | no open input; pair 6 beside WO-099; assign version at activation (patch) Cleanup pass 2026-09-19 carry-ins: evidence editions are missing from the integration checklist, and merges made with hooks bypassed (`core.hooksPath`, `--no-verify`, `git reset --soft`) need a supported path (WO-135 FINAL-001 L1 and L2; WO-136 and WO-137 FINAL-001 L4). | control-plane implementer, then independent verifier | a real-Git fixture with two orders and a merged sibling; no network | `scripts/worktree.mjs`, `docs/PLAYBOOK.md` §Concurrency, product 07 §Independent workflows and integration, the reviewer skill line |
| [WO-080](../work-orders/WO-080-workstream-document-and-index.md)      | workstream application — the workstream document, field and index grouping with staleness                                                                                                                                                                                                      | WO-071 merged; assign version at activation (patch)                                                                                                                                                                        | control-plane implementer, then independent verifier                                                      | fixtures                                                                                                                                                              | `scripts/work-orders.mjs`, `docs/workstreams/`, product 12                                                                                                                                                       |
| [WO-081](../work-orders/WO-081-board-workstreams-section.md)          | console — the board's Workstreams section as an additive view-model extension                                                                                                                                                                                                                  | WO-080 merged; assign version at activation (minor)                                                                                                                                                                        | console implementer, then independent verifier                                                            | regenerated fixture expectations                                                                                                                                      | `packages/console`                                                                                                                                                                                               |
| [WO-082](../work-orders/WO-082-synthetic-pilot-six-demonstrations.md) | workstream application — product 12's six demonstrations as fixtures over a real-Git launchpad                                                                                                                                                                                                 | WO-080, WO-072 and WO-075 merged; assign version at activation (patch)                                                                                                                                                     | fixture implementer, then independent verifier                                                            | a real-Git fixture with three targets                                                                                                                                 | the fixture suite, product 12                                                                                                                                                                                    |
| [WO-083](../work-orders/WO-083-real-run-launchpad-instance.md)        | workstream application — the operator-witnessed run from the fork against the Angular repository, recorded here as a receipt                                                                                                                                                                   | WO-082, WO-064, WO-076 and WO-073 merged; the fork's planning pass plans the shell; assign version at activation (minor)                                                                                                   | launchpad-dispatched sessions from the fork; independent verifier counts the measures                     | the operator's fork and target repositories                                                                                                                           | `docs/evidence/WO-083/`, the sibling registry, products 12/04/13/06                                                                                                                                              |
| [WO-084](../work-orders/WO-084-ledger-order-and-index.md)             | documentation — one ledger insertion rule, a generated index and check, Resolutions moved                                                                                                                                                                                                      | deferred (waivable) until WO-053; assign version at activation (patch) Moved 2026-09-19: lane pair with WO-142; deferral lapsed when WO-053 closed; check in the document suite; headings byte-identical. | documentation/tooling implementer, then independent verifier                                              | repository-wide checks                                                                                                                                                | `docs/lineage/`, `scripts/lineage.mjs` (new), `CLAUDE.md` §Start here                                                                                                                                            |
| [WO-085](../work-orders/WO-085-spec-receipt-boundary.md)              | documentation — receipts leave product documents and the map; a docs check with a link checker                                                                                                                                                                                                 | deferred (waivable) until WO-053; assign version at activation (patch)                                                                                                                                                     | documentation/tooling implementer, then independent verifier                                              | repository-wide checks                                                                                                                                                | products 02/03/04/06, the map, evidence READMEs, `scripts/docs-check.mjs` (new)                                                                                                                                  |
| [WO-086](../work-orders/WO-086-generated-release-history.md)          | documentation — one generated release table in 06 and 10; retiming records preserved                                                                                                                                                                                                           | deferred (waivable) until WO-053; must not edit `work-orders.mjs`; assign version at activation (patch)                                                                                                                    | tooling implementer, then independent verifier                                                            | local annotated tags                                                                                                                                                  | `scripts/release.mjs`, products 06 and 10, a planning receipt file                                                                                                                                               |
| [WO-087](../work-orders/WO-087-roadmap-split.md)                      | documentation — candidate policy sections move to product 14 with their slugs                                                                                                                                                                                                                  | deferred (waivable) until WO-053; assign version at activation (patch)                                                                                                                                                     | documentation implementer, then independent verifier                                                      | publication checks                                                                                                                                                    | product 06, product 14 (new), publication index and locks                                                                                                                                                        |
| [WO-088](../work-orders/WO-088-phrase-table-single-source.md)         | documentation — the phrase table generated between markers in three files                                                                                                                                                                                                                      | deferred (waivable) until WO-053; assign version at activation (patch)                                                                                                                                                     | tooling implementer, then independent verifier                                                            | repository-wide checks                                                                                                                                                | `scripts/resume.mjs`, product 07, the playbook, the README                                                                                                                                                       |
| [WO-089](../work-orders/WO-089-capability-table-fold.md)              | documentation — addenda folded into rows; the missing verification row; no unearned level                                                                                                                                                                                                      | deferred (waivable) until WO-053; changes the refutation subject; assign version at activation (patch)                                                                                                                     | documentation implementer, then independent verifier                                                      | none                                                                                                                                                                  | `docs/planning/capability-table.md`                                                                                                                                                                              |
| [WO-090](../work-orders/WO-090-shorter-cold-start.md)                 | documentation — the guide reduced to the operating contract with the directed-load total measured lower                                                                                                                                                                                        | deferred (waivable) until WO-053; assign version at activation (patch) Moved 2026-09-19: lane pair with WO-145, after WO-142, WO-144 and WO-140 write product 07 and the role text. | documentation implementer, then independent verifier                                                      | the directed-load measurement                                                                                                                                         | product 07, `docs/AI-HARNESS-SECURITY.md`, the playbook                                                                                                                                                          |
| [WO-091](../work-orders/WO-091-multi-active-link-groups.md)           | pattern workshop — several actives in one link group with shared supports; hashes hold                                                                                                                                                                                                         | deferred (waivable) until WO-053; assign version at activation (minor)                                                                                                                                                     | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/compile.ts`, products 02 and 10                                                                                                                                                           |
| [WO-092](../work-orders/WO-092-sets-graph-extension.md)               | pattern workshop — the additive `sets` collection with view codecs and arming inspection                                                                                                                                                                                                       | WO-091 merged; assign version at activation (minor)                                                                                                                                                                        | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/compiler/src/types.ts`, `normalize.ts`, `views.ts`, products 02/04/10                                                                                                                                  |
| [WO-093](../work-orders/WO-093-five-s-mechanics-as-data.md)           | pattern workshop — the five remaining 5S mechanics as typed data                                                                                                                                                                                                                               | WO-091 merged; assign version at activation (minor)                                                                                                                                                                        | skeleton implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | `packages/skeleton/src/loadouts/`, product 05                                                                                                                                                                    |
| [WO-094](../work-orders/WO-094-set-bonuses-lowered.md)                | pattern workshop — the five bonuses armed or dark; the Safety gate refuses                                                                                                                                                                                                                     | WO-092 and WO-093 merged; assign version at activation (minor)                                                                                                                                                             | compiler implementer, then independent verifier                                                           | deterministic fixtures                                                                                                                                                | the 5S set definition, compiler fixtures, products 04 and 05                                                                                                                                                     |
| [WO-095](../work-orders/WO-095-full-set-scenario-and-render.md)       | pattern workshop — the full-set scenario with live and replay identity; the set tooltip render                                                                                                                                                                                                 | WO-094 and WO-032 merged; must not edit `packages/console`; assign version at activation (minor)                                                                                                                           | skeleton implementer, then independent verifier                                                           | deterministic fakes                                                                                                                                                   | `packages/skeleton/src/scenario.ts`, the CLI, `render.ts`, product 06, README                                                                                                                                    |
| [WO-096](../work-orders/WO-096-migration-ledger.md)                   | rule migration — the generated migration ledger over every named shape, with the local-terms check                                                                                                                                                                                             | deferred (waivable) until WO-053; clean room applies with force; assign version at activation (patch)                                                                                                                      | ledger author, then independent verifier                                                                  | the local-terms list                                                                                                                                                  | `corpus/feedback/migration.json` (new), its renderer and check, `docs/lineage/feedback-migration.md`                                                                                                             |
| [WO-097](../work-orders/WO-097-rule-migration-batch-1a.md)            | rule migration — six rung-one and rung-two units with retirements and the reverse mapping                                                                                                                                                                                                      | WO-096 merged; assign version at activation (minor); live feedback audit operator-run                                                                                                                                      | unit author and lowering implementer, then independent verifier                                           | the actual harness for the feedback audit                                                                                                                             | the compiler's feedback module, skeleton loadouts, retired prose, the regenerated bundle                                                                                                                         |
| [WO-098](../work-orders/WO-098-rule-migration-batch-1b.md)            | rule migration — six more units including a skill and a cadence unit; the whole-set measurement and template                                                                                                                                                                                   | WO-097 merged; assign version at activation (minor); live feedback audit operator-run                                                                                                                                      | unit author and lowering implementer, then independent verifier                                           | the actual harness for the feedback audit                                                                                                                             | the same surfaces, products 02/06/13, README, capability table                                                                                                                                                   |
| [WO-099](../work-orders/WO-099-mission-check.md)                      | runtime — the cadence-driven mission check with a hold; the first unattended proof                                                                                                                                                                                                             | WO-068 merged; the operator runs the unattended row; assign version at activation (minor); live feedback audit operator-run                                                                                                | skeleton implementer, then independent verifier                                                           | the actual harness as verifier; a fixture resident                                                                                                                    | the episode protocol, the resident's hold, the Contributor policy's cadence, products 02/03                                                                                                                      |
| [WO-100](../work-orders/WO-100-preauthorized-portfolio.md)            | runtime — the preauthorized portfolio and pure work derivation from the Gardener's candidates                                                                                                                                                                                                  | WO-068, WO-052, WO-054 and WO-042 merged; assign version at activation (minor); live feedback audit operator-run                                                                                                           | skeleton implementer, then independent verifier                                                           | doubles over the scratch target                                                                                                                                       | the configuration schema, `packages/skeleton/src/portfolio.ts` (new), the resident's activation path, products 03/06/07                                                                                          |
| [WO-110](../work-orders/WO-110-local-model-transport.md)              | worker transport — a third transport over the local inference endpoint for the inspection profile                                                                                                                                                                                              | no open input (WO-068 recommended first); activation does not wait for WO-137's outcome: doubles plus a `ready` or `unavailable` live row, no qualification claimed; assign version at activation (minor); operator runs the smoke Cleanup pass 2026-09-19 carry-ins: remove the "until WO-110" string at `packages/skeleton/src/actor-catalog.ts:84`; fix the two recorded probe-client defects before reusing `scripts/probes/local-runner-*.mjs` (WO-137 FINAL-001 O1 to O3). | skeleton implementer, then independent verifier                                                           | the operator's local endpoint                                                                                                                                         | `packages/skeleton/src/worker-transport.ts`, the actor catalog, `environment.md`                                                                                                                                 |
| [WO-111](../work-orders/WO-111-unattended-live-proof.md)              | live proof — the unattended hour: 5S work derived, executed, verified and stopped on return                                                                                                                                                                                                    | WO-100, WO-099, WO-053 and WO-054 merged; the operator runs the window; assign version at activation (patch); R2 follows                                                                                                   | operator-run window; independent verifier reads the receipt                                               | the actual harnesses; a seeded scratch repository                                                                                                                     | `docs/evidence/WO-111/`, a seed generator                                                                                                                                                                        |
| [WO-112](../work-orders/WO-112-core-run-loop-proof.md)                | live proof — WO-123's composition run once against a scratch issue and target, the representative scenario fully resolved and a control scenario proving legitimate escalation                                                                                                                 | every primitive gate merged (see the order); the operator witnesses; assign version at activation (minor); R3 follows                                                                                                      | operator-witnessed composition; independent verifier reads the receipt                                    | the actual harnesses; a scratch target and issue in a personal public repository                                                                                      | the `dotln vertical` command, `docs/evidence/WO-112/`, products 06 and 12                                                                                                                                        |
| [WO-113](../work-orders/WO-113-work-order-files-stable-contracts.md)  | control plane — the five-surface separation checked forward from a cutoff; open orders' dated notes migrated                                                                                                                                                                                   | WO-043 merged; assign version at activation (patch)                                                                                                                                                                        | tooling implementer, then independent verifier                                                            | repository-wide checks                                                                                                                                                | `scripts/work-orders.mjs`, open order files, evidence READMEs, product 07                                                                                                                                        |
| [WO-114](../work-orders/WO-114-runtime-status-projection.md)          | console — `runtime-status-v1` written by the resident and rendered by the text host                                                                                                                                                                                                            | WO-068 merged; assign version at activation (minor)                                                                                                                                                                        | runtime/console implementer, then independent verifier                                                    | a fixture resident with a fake clock                                                                                                                                  | the contract module, the resident's writer, `packages/console`, product 04                                                                                                                                       |
| [WO-115](../work-orders/WO-115-console-parity-contract.md)            | console — every UI command is the terminal's command over a local loopback surface, no second authority                                                                                                                                                                                        | WO-068 and WO-114 merged; assign version at activation (minor)                                                                                                                                                             | runtime/console implementer, then independent verifier                                                    | loopback fixtures                                                                                                                                                     | the resident's loopback server, `packages/console` client, products 04 and 07                                                                                                                                    |
| [WO-116](../work-orders/WO-116-audit-projection-served.md)            | console — the canonical audit projections served through the parity surface                                                                                                                                                                                                                    | WO-115 merged; assign version at activation (minor)                                                                                                                                                                        | runtime/console implementer, then independent verifier                                                    | fixture logs                                                                                                                                                          | the resident's read commands, `packages/console`, product 09                                                                                                                                                     |
| [WO-117](../work-orders/WO-117-console-live-host.md)                  | console — the live text console as a client of the resident, proven in a witnessed session                                                                                                                                                                                                     | WO-114, WO-115, WO-116 and WO-099 merged; the operator witnesses; assign version at activation (minor)                                                                                                                     | console implementer; operator-witnessed session; independent verifier                                     | the real resident and harness                                                                                                                                         | `packages/console`, `docs/evidence/WO-117/`, product 04, README                                                                                                                                                  |
| [WO-118](../work-orders/WO-118-resident-owned-loop-from-starter.md)   | live proof, the product exit — from a starter instance, one intent and standing grants carry the loop through the resident to a terminal pull-request state, surviving an actor death and a resident restart                                                                                   | every named primitive, runtime and UI order merged; the operator witnesses; assign version at activation (minor); a failed run does not close it; R3 follows                                                               | operator-witnessed instance run; independent verifier reads the receipt                                   | a scratch starter instance, target and issue; the actual harnesses                                                                                                    | `docs/evidence/WO-118/`, products 00 and 12, README, capability table                                                                                                                                            |
| [WO-119](../work-orders/WO-119-executable-discovery-producer.md)      | runtime — a `script` actor episode discovers a target's real imperfections and emits typed candidates with evidence, executable subset only                                                                                                                                                    | WO-068, WO-046 and WO-023 merged; assign version at activation (minor)                                                                                                                                                     | skeleton implementer, then independent verifier                                                           | a fixture repository; one scratch live row                                                                                                                            | `packages/skeleton/src/discovery.ts` (new), the `WorkCandidate` contract, product 05                                                                                                                             |
| [WO-120](../work-orders/WO-120-derived-work-identity.md)              | control plane — runtime-derived and UI-filed orders as durable records with the same identity and lifecycle; `dotln intent`                                                                                                                                                                    | WO-043 and WO-069 merged; assign version at activation (minor)                                                                                                                                                             | control-plane implementer, then independent verifier                                                      | fixtures                                                                                                                                                              | `scripts/lib/derived-orders.mjs` (new), `scripts/resume.mjs`, `scripts/work-orders.mjs`, the `intent` command, products 06 and 07                                                                                |
| [WO-121](../work-orders/WO-121-presence-signals-with-origin.md)       | runtime — human, actor and task signals distinguished by hook event kind and the resident's stamp; tool activity from any session never implies return; return cancels only discretionary work                                                                                                 | WO-068, WO-067 and WO-044 merged; assign version at activation (minor)                                                                                                                                                     | skeleton/compiler implementer, then independent verifier                                                  | a fake clock; the actual harness for the feedback audit                                                                                                               | the resident's presence fold, the generated hooks' heartbeat, product 03, ADR-0007 §Amendments                                                                                                                   |
| [WO-122](../work-orders/WO-122-actor-catalog-cli-and-human.md)        | runtime — the `cli-worker` and `human-handoff` actor kinds by the observed launch path                                                                                                                                                                                                         | WO-068, WO-051 and WO-044 merged; assign version at activation (minor); operator runs the live row                                                                                                                         | skeleton implementer, then independent verifier                                                           | doubles; the actual harnesses for the live row                                                                                                                        | the actor catalog, the handoff packet writer, product 03                                                                                                                                                         |
| [WO-123](../work-orders/WO-123-vertical-composition.md)               | delivery — the vertical continuation from a filed intent to a terminal state with per-step receipts, entered by the resident under a portfolio's `intent` class and admitted grants or by `dotln vertical`, proven with doubles                                                                | the named primitives, WO-068, WO-100, WO-120 and WO-042 merged; assign version at activation (minor)                                                                                                                       | skeleton implementer, then independent verifier                                                           | doubles and a fake clock                                                                                                                                              | the continuation, the admission, the command, products 07 and 03                                                                                                                                                 |
| [WO-124](../work-orders/WO-124-impact-surfaces-derivation.md)         | intake — surfaces and tests derived from the contract, the profile and a snapshot, labeled by origin, with a confidence gate                                                                                                                                                                   | WO-061 and WO-054 merged; assign version at activation (minor)                                                                                                                                                             | compiler/skeleton implementer, then independent verifier                                                  | fixtures                                                                                                                                                              | the story-contract module, a snapshot index reader, products 03 and 06                                                                                                                                           |
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
| [WO-138](../work-orders/WO-138-local-model-role-qualification.md) | research — three read-only tasks with deterministic oracles and pre-registered floors, local against one remote transport with repeats; which inspection roles the local kind may fill | WO-110 merged and WO-137 closed with outcome `ready` (the preflight carries the outcome; the typed graph cannot); pair 7 beside WO-069; assign version at activation (patch, evidence-only); one operator session for the T2 ranking 2026-09-19 (second pass): amended to activate on WO-137's successful live row; inputs are public, no no-egress claim is made and no private-input role is qualified; keeps its slot beside WO-071. Receipt 019 known issues to carry into the executor's decisions: T3's input is a committed, screened sample of hook-journal rows, never the ignored local journal, so the public-input rule and the clean-room floor hold; five repeats bound a true rate only loosely (about 55% at 95% confidence for five of five), and the packet says so beside each floor; the harness under `scripts/probes/` stays out of `npm test`. | evaluation-harness author, then independent verifier | the pinned local artifact and one remote transport; live runs only when no product gate is running | `scripts/probes/`, `docs/evidence/WO-138/`, product 03 actor catalog sentence, product 06 candidate disposition |
| [WO-139](../work-orders/WO-139-subagent-cap.md) | harness machinery — a configurable subagent admission cap: spawns refused at the admission points the hook can see, descendants counted at their first attributable tool call, uncounted paths reported, the total-cap requirement left open as a product 07 candidate, and the Contributor's batching rule | WO-131 and WO-133 closed; pair 2 beside WO-053; assign version at activation (patch); a probe row of subagent hook-input shapes precedes the mechanism | harness-host implementer, then independent verifier | the existing harness probe and process-debt fixtures | `packages/skeleton/src/harness-host.ts`, `docs/control/budgets.json`, `loadouts/contributor.ts`, the regenerated bundle, product 07 §Discipline and the total-cap candidate, the security runbook's hook boundary |
| [WO-140](../work-orders/WO-140-gate-sandbox-preflight.md) | test infrastructure and process cost — `npm test` refuses up front inside a harness sandbox when a declared suite needs the outside for an environmental cause; a sandbox-subset run records a distinct partial identity no gate consumer accepts; the briefing prints the session id and usage command; new receipts carry counters or a cause code | WO-132 and WO-133 closed; pair 4 beside WO-055; assign version at activation (patch); a probe row of the sandbox marker precedes the preflight | test-runner implementer, then independent verifier | a fake sandbox marker fixture; the existing runner and gate-evidence fixtures | `scripts/test-runner.mjs`, suite declarations, `packages/skeleton/src/gate-evidence.mjs` consumers' fixtures, `scripts/resume.mjs` briefing, the verifier and reviewer skills, one document check, product 07 Process Cost text |
| [WO-141](../work-orders/WO-141-no-guessing-enforced.md) | harness machinery — no guessing, enforced without gating the operator: the observed-facts block in the briefing, the prompt-submit context and the Stop advisory, an advisory scan that journals and corrects a hedged number or duration without holding a turn, and the operator-correction counter derived from the journal | first, pair 1 beside WO-136, by the operator's 2026-09-17 direction; WO-131 and WO-133 closed; assign version at activation (patch) | harness-host and meter implementer, then independent verifier | the existing harness and process-debt fixtures; a fixture journal | `packages/skeleton/src/harness-host.ts` (Stop path), `scripts/resume.mjs` briefing, `scripts/lib/meta.mjs`, the regenerated bundle, product 07 §Discipline, the security runbook's hook boundary |
| [WO-142](../work-orders/WO-142-outstanding-cleanup.md) | maintenance — outstanding cleanup: the register's refill, unowned review nominations, stale live-document claims and local residue, as 51 re-observed rows (row B17, fix or board up, added by the same day's second pass) | first queued entry, lane pair with WO-084, by the operator's 2026-09-19 budgeted pass; assign version at activation (minor); row B3 may be returned and judged alone at the operator's word; the operator reads the prune listing before `--apply`; receipt 018 known issues to carry into the executor's decisions: the prune must keep any snapshot an emitted target bundle or live worktree still imports (criterion 5), the six-row return cap is a ceiling and never a quota (criterion 1), a decision record that carries an ask must name its follow-up or the feed drops it (criterion 2), and the meter's `guardRefusals` cannot confirm the live-gate removal, so the after-observation is a reviewer session's transcript (criterion 6) Receipt 019 adds: `not-reproduced` has no cap, so the verifier re-observes each such row; the read list admits `git status` only with `--no-optional-locks`, because a plain status can take the index lock during a live gate; criterion 5's before and after sizes come from the operator's real `--apply` run, not the listing. | broad-surface repairer, then independent verifier judging the rows file | existing fixture suites; one live feedback edition; no new gate or hook | `scripts/`, `packages/*` except `reactor.ts`, the live documents, the regenerated bundle, indexes and editions; fenced off the ledger and `docs/lineage/README.md` |
| [WO-143](../work-orders/WO-143-resident-lock-recovery.md) | core runtime — the resident restarts unaided after a kill inside lock acquisition; the recorded blocker for `runtime.resident` level 2 | directly after the cleanup pair, lane pair with WO-144; after WO-142 edits the same two files; assign version at activation (patch) Receipt 019 known issues to carry into the executor's decisions: criteria 1 and 2 hold together only because the guard and its owner record are created in one atomic step, so that construction is the first thing to prove; a live owner wrongly judged dead would put two residents on one store, worse than today, so the fixture covers a live owner under load; in criterion 4 "a kill" is the resident's kill of its episode, not a signal sent to the resident; a torn log still refuses, so the claim is a kill at any instant of lock acquisition, not any instant at all. | store and concurrency implementer, then independent verifier | deterministic kill-inside-the-window fixtures with real subprocesses; macOS host | `packages/skeleton/src/worker-store.ts`, `resident-store.ts`, `resident-host.ts`, their tests, the capability table's dated reassessment |
| [WO-144](../work-orders/WO-144-outside-project-write-grant.md) | harness machinery — outside-project writes need a role or support grant; a fifth refusal for known destinations | directly after the cleanup pair, lane pair with WO-143; after WO-142 edits the same host; assign version at activation (minor); the operator confirms the default grants the journal inventory proposes Receipt 019 known issues to carry into the executor's decisions: lower the grant through WO-042's provenance-bearing envelope rather than a second authority vocabulary; the title's "can no longer" holds only for known destinations and the write-backs must say so; WO-056, WO-111 and WO-112 write outside the project and need an operator-named root until order-named roots exist; fail-open is specified for an unreadable configuration only, so list the guard's other failure modes and their behavior. | harness-host and loadout implementer, then independent verifier | retained hook journals for the inventory; generated-hook fixtures with a fixture home | `packages/skeleton/src/harness-host.ts`, `loadouts/contributor.ts`, `packages/compiler/src/harness.ts`, the regenerated bundle, products 03 and 07, the security runbook |
| [WO-145](../work-orders/WO-145-tinkerer-economy-experiment.md) | research — the first Tinkerer experiment: economy, one experiment per order inside 900 s, three trial orders | lane pair with WO-090; the operator names the two further trial orders at activation; assign version at activation (minor) Receipt 019 known issues to carry into the executor's decisions: a declined experiment records the seconds spent deciding as its cost and "none" as its effect, so criterion 2 admits what criterion 3 allows and declining is never the free way through a trial; the pre-registered reading is in the order's Design and is applied as written; the support is unequipped after the third trial unless the reading says otherwise. | loadout implementer running the first trial, then independent verifier | the existing loadout fixtures; no live model beyond the executor itself | `packages/skeleton/src/loadouts/`, the decisions generator, the regenerated bundle, product 05 |
| [WO-101](../work-orders/WO-101-program-and-hash-corpus.md)            | evidence/corpus — Program and identity regression floor                                                                                                                                                                                                                                        | not applicable                                                                                                                                                                                                             | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | `corpus/harness/`, fixtures, manifests                                                                                                                                                                           |
| [WO-102](../work-orders/WO-102-cadence-corpus.md)                     | evidence/corpus — cadence boundary sweep                                                                                                                                                                                                                                                       | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                                    | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | cadence fixtures and manifests                                                                                                                                                                                   |
| [WO-103](../work-orders/WO-103-authority-outbox-corpus.md)            | evidence/corpus — authority/outbox decision table                                                                                                                                                                                                                                              | assign version and close disposition; pin the landed WO-017 base and governed closeout path Cleanup pass 2026-09-19 carry-in: the audit under-links a caller-error refusal and this oracle has no such cell (WO-017 FINAL-001 adjudication 8). | deterministic corpus executor                                                                             | offline harness                                                                                                                                                       | authority/outbox fixtures and manifests                                                                                                                                                                          |
| [WO-105](../work-orders/WO-105-crash-shape-corpus.md)                 | evidence/recovery — crash/truncation sweep                                                                                                                                                                                                                                                     | assign version and close disposition; pin the landed WO-017 base and governed closeout path                                                                                                                                | long deterministic corpus executor                                                                        | offline harness                                                                                                                                                       | retained store/skeleton corpus, trees, traces, fixtures, manifests                                                                                                                                               |
| [WO-107](../work-orders/WO-107-profiling-baseline.md)                 | performance evidence — baseline without optimization                                                                                                                                                                                                                                           | assign version and close disposition; pin suitable base/deps and governed closeout path                                                                                                                                    | measurement operator                                                                                      | representative quiet environment; two runs are acceptance evidence                                                                                                    | profiling harness, baselines, manifests                                                                                                                                                                          |
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
