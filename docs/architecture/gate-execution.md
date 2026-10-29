# Gate execution architecture

Maintained architecture decision record. Established by the operator's
2026-10-19 scope expansion in [WO-222 D011](../evidence/WO-222/decisions.md).
The implementation description includes WO-217's follow-up repairs to the
WO-222 working version; proposals below are not implemented contracts.
Measurements remain in each order's evidence.

Future work orders changing selection, scheduling, resource admission, reuse or
gate completion should cite this record and update the affected sections with
their measured result. Keep their ordinary decisions, immutable judgments and
raw evidence in their existing locations. This document connects those records;
it does not replace them or authorize a new implementation. Retain rejected
alternatives and reopening conditions when a later order changes the decision.

## Decision and problem

Keep dependency scheduling inside each gate and shared resource admission at
the host boundary. Keep the evidence contract independent of scheduling: a
faster admission policy cannot make incomplete, failed or differently identified
work count as a pass. Preserve inherited reservations for nested work and the
existing process ownership and memory guard.

The next candidate is a versioned host admission queue with fairness between
gates, accurate requests for short structural work and protected progress for
nested children. Evaluate that candidate before replacing the runner with a new
build system or installing a resident scheduling service. This is a research
recommendation, not a shipped queue: WO-222 implements capacity, overlap and file
lanes. WO-217 declines a partial fairness implementation: fixed-four clients
publish no waiting intent, so a new-client queue alone cannot bound their
waiting. Reopen only with an explicit migration or adapter covering those
clients and the comparisons below.

Four outcomes need separate measurements:

1. **Truth:** the accepted row describes the required work at the judged inputs.
2. **Completion time:** an individual complete gate finishes sooner.
3. **Responsiveness:** another worktree's short gate can obtain resources while
   the complete gate makes progress.
4. **Whole-order cost:** preparation, document checks, failures, repeated runs and
   review cycles do not consume the saving.

WO-222 exposed the difference between the second and third outcomes. An exported
instance's document gate took 1,559.852 seconds, including 1,554.557 seconds
waiting for a four-slot kit-verification lease; the rest of that gate took about
5.3 seconds. The old client assumed four host slots while the new client recorded
eight. It needed all of its assumed capacity free. The registry tracked holders
but no ordered waiting requests. Two operational stops then let document gates
finish in 7.998 and 6.176 seconds, at the cost of abandoning complete-run
progress. The operator explicitly chose uninterrupted completion afterward.
These are observed timings, not a controlled speed comparison. The mechanism and
priority changes are recorded in [D009](../evidence/WO-222/decisions.md).

## Implemented boundaries

| Layer | Current responsibility | Boundary to preserve |
| --- | --- | --- |
| Selection and evidence | Choose required suites; bind observations to source and produced inputs; consume valid rows at completion. | Admission never changes the required set or manufactures a pass. |
| Prerequisites and local scheduler | Finish structural work and build dependencies; prioritize failures and newly changed suites, with a smaller lead for older branch changes; schedule weighted tasks and bounded file groups. | Unchanged exclusive work can precede shared branch work. Ready work and dependency correctness remain local to the gate. |
| Host admission | Coordinate slot leases across clones under one per-user host registry and lock. | All cooperating clients use one capacity; nested leases consume their parent's reservation. |
| Execution and ownership | Start attributable process trees and retain ownership of surviving descendants. | Releasing a parent cannot make a live child disappear from accounting. |
| Memory and deadlines | Observe host pressure and owned footprint; apply finite task and command deadlines with declared peer load. | A capacity heuristic is not a proof of safe memory use or a diagnosis of a timeout. |
| Dispatch bounds | Read the owning phase's wall-clock and complete-run standing before a complete gate, bounded probe or same-phase redispatch. | An operator-recorded extension changes only its order and phase; unavailable history never becomes fresh consumption. |
| Reporting | Preserve executed, reused, failed, stopped and unrun states, timeline peers and resource observations. | Scheduling measurements and completion claims use the same executed evidence. |

The source map is [test-runner.mjs](../../scripts/test-runner.mjs),
[host-lanes.mjs](../../scripts/lib/host-lanes.mjs),
[host-resources.mjs](../../scripts/lib/host-resources.mjs),
[host-guard-state.mjs](../../scripts/lib/host-guard-state.mjs),
[gate-deadlines.mjs](../../packages/skeleton/src/gate-deadlines.mjs) and
[gate-reuse.mjs](../../scripts/lib/gate-reuse.mjs). Product 07's
[execution guide](../product/07-execution-guide.md) remains the workflow contract.
The dispatch bound is shared by [dispatch-bound.mjs](../../scripts/lib/dispatch-bound.mjs),
the gate's host task, [bounded-command.mjs](../../scripts/lib/bounded-command.mjs)
and [resume.mjs](../../scripts/resume.mjs).

WO-234 adds this dispatch boundary without changing task deadlines or memory
admission. Only host-admitted complete/review selections consume a run, including
admitted failures and interruptions. Recorded host refusals and unrun host tasks
consume none; historical rows without admission evidence retain their earlier
interpretation. A damaged journal leaves standing unavailable while usage stays
readable. Restored history recovers the recorded phase request and earliest
anchor, including after completion, without rewriting journals or replenishing
budget. The operator's captured authorization extends either ceiling through
`resume accept-overrun`; it changes no criterion or verdict.

The [paired controls](../evidence/WO-234/controls.json) establish admission at
the prior baseline and refusal at an exhausted bound. The
[repair reproductions](../evidence/WO-234/repair-002-probes.json) retain damaged
history and synthetic host-pressure results; [D024–D027](../evidence/WO-234/decisions.md)
record the usage, recovery, count and write-back decisions. These checks establish
behavior, not a scheduling speedup or a host-memory benchmark. Reopen when a
refusal consumes a run, recovery resets a known anchor or diagnostic usage is lost.

In the WO-222 implementation, capacity is the lesser of eight and half the
available logical processors, with a minimum of one. The first acquirer records
it under the existing host lock and later clients that implement this contract
inherit it. The task memory budget is the gate's memory share divided by that
capacity. The structural check screens this against the largest recorded task
RSS in the selected baseline. RSS and the guard's owned footprint are different
observations; this screen does not establish a worst-case footprint bound.

Harness fixtures, process-debt and worktree-integration hold the full host
capacity and lend nested leases to the exclusive task and up to two local
light peers. The parent reservation remains until every child releases it.
A qualifying light task is shared and every held baseline observation is
below 60 seconds and 512 MiB RSS. The critical-path summary splits `waitMs`
into host admission `laneWaitMs` and scheduling `gapMs`; their sum preserves
the prior wait total. The gate's separate `hostLaneWait.wallMs` is the union
across all task wait intervals, so parallel waiting is counted once.
Relation-specific unions can overlap when different holders block together.
Compact relation changes retain attribution independently of the 32-entry
detailed holder history, including interrupted admissions.
The exclusive task's declared peer concurrency is at most three; the deadline
factor is twice that declaration. Target-worktree is four file tasks, at most two
concurrent, each with a 900-second task bound. The base actually registered 60
case names from 39 declarations; [D002](../evidence/WO-222/decisions.md) records the
order's stale count and the preserved inventory.

These are finite, measured scheduling declarations. They are not CPU quotas,
preemption, adaptive host-load control or fairness guarantees. Admission still
checks available slots and retries; a local task's priority does not order
requests from another gate. The nested lease retains its parent's capacity even
when the parent exits while attributable children survive. A later queue must
retain that property.

## What earlier work established

This is a selected history of relevant decisions and reversals, not an audit of
every gate order. Historical timings retain their original selection and host
conditions; rows from different orders are not a benchmark series.

| Record | Change and checked observation | Consequence for the next design |
| --- | --- | --- |
| [WO-126 D009–D012](../evidence/WO-126/decisions.md) | Introduced input reuse, parallel release cases and prepared fixture copies. Combined cold/warm observations were 278.991/114.977 seconds against a 522.052-second baseline. Later scheduling retained exclusive hook-heavy work. | Fixture preparation and unnecessary repeated work can matter more than queue policy; the combined result did not isolate each lever. |
| [WO-128 D004, D008](../evidence/WO-128/decisions.md) | Shared heavy scheduling passed five fresh runs, but its 694.561-second median exceeded the earlier 476.304 seconds. | Passing reliability criteria did not establish a speedup. Preserve both outcomes. |
| [WO-131 D014, D017](../evidence/WO-131/decisions.md) | Restored heavy isolation after a same-source 462.3-second exclusive / 666.5-second shared comparison. Batched immutable Git reads reduced work; an 820.885-second fresh observation still missed the 805-second ceiling. | Less process work and better placement are distinct levers. Report a missed target even when a component improved. |
| [WO-132 D001–D003](../evidence/WO-132/decisions.md) | Removed replica/input-cache machinery and repeated transition requirements. Three final-source product runs passed in 254.908, 250.500 and 246.160 seconds with 62 fresh tasks; machinery remained separately measurable. | Complexity was deliberately removed. Reintroducing caching or replicas needs a new net-benefit case, not a forgotten history. |
| [WO-115 D019–D023](../evidence/WO-115/decisions.md) | A later skeleton-only isolation experiment made skeleton itself faster (309.511 to 286.508 seconds), but the same-source complete gate rose from 312.441 to 430.952 seconds. Shared scheduling was restored. | Optimize the complete dependency path; faster individual tasks can make the whole gate slower. One ordered pair is not a universal load result. |
| [WO-173 D004, D018](../evidence/WO-173/decisions.md) | Reused a covering whole-gate pass at the same code identity. Review then reproduced reuse after an untracked source edit that the identity omitted. | Reuse is an evidence problem as well as a performance feature. Audit what the key actually binds. |
| [WO-185 D001, D026](../evidence/WO-185/decisions.md) | Added per-user host coordination, process ownership and footprint control. A measured 2.5778% sampler cost caused the regular census interval to move from two to four seconds. | Safety sampling has cost and delayed observation; neither a slot count nor a sampled footprint is instantaneous resource control. |
| [WO-186 D020, D035, D036](../evidence/WO-186/decisions.md) | The operator established ordinary parallel work as the target environment. Reuse repairs bound produced build outputs and latest executions. Document median grew 38.993 to 66.690 seconds while a fresh plain gate saved 73.577 seconds. | Test the intended contended host. Include displaced document and control costs, and preserve failure precedence and produced-input binding. |
| [WO-216 D004, D006–D007, D019, D034](../evidence/WO-216/decisions.md) | Added structural phases and file lanes; focused handoffs omitted changed suites that later failed. Its close-window baseline was 11 complete runs and 545 gate task minutes per order. | A cheaper handoff can export work and failure to another role. Judge the closed order, not only the executor. |
| [WO-221 D016–D020](../evidence/WO-221/decisions.md) | Restored complete-first handoff, failure/change lead ordering and reuse across roles at unchanged identity. The first observed close window had 15 complete runs and 691 task minutes amid operator scope changes. D019 identified lane underuse and long reservations. | Avoid duplicate complete runs, but retain the full selection when source changes. Capacity work begins with the recorded timeline, not with a larger arbitrary job count. |
| [WO-222 evidence and decisions](../evidence/WO-222/README.md) | Three fresh complete runs retained host-derived capacity, two light overlap lanes and four target-worktree files. Median wall time fell from 2,538.373 to 1,668.518 seconds (34.2682%); summed task duration increased. Target-worktree group span fell 9.24%, and real exclusive overlap occurred only for harness-fixtures. D014–D016 record retention and reversal. | The combined after series decides retention. It does not isolate the causal contribution of each lever or demonstrate cross-gate fairness. |

WO-132's under-six-minute target applies to its historical product selection. It
is not a current complete-review service level: selection and task inventories
changed afterward. WO-186's per-order arithmetic likewise compares unequal
samples and is not an observed whole-order speedup. Those limits travel with the
figures when later orders cite them.

## Research and public implementations

Primary sources were inspected on 2026-10-19. The book references are the named
chapters, not a claim to have reviewed the entire books. Repository links show
the inspected branch locations; recheck their current revision before borrowing
an implementation. No external implementation was copied into DotLn.

| Source | Relevant result | Application and limit |
| --- | --- | --- |
| Arpaci-Dusseau and Arpaci-Dusseau, *Operating Systems: Three Easy Pieces*, [scheduling](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf), [MLFQ](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf), [proportional share](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-lottery.pdf) | Response time, turnaround and fair share are different objectives. FIFO can convoy; priority boosts address starvation; proportional scheduling assigns shares to owners. | Fairness should be between gates, not between their arbitrary numbers of submitted tasks. CPU time slicing depends on preemption; reordering nonpreemptive test processes does not supply it. |
| Google, *Site Reliability Engineering*, [chapter 21: Handling Overload](https://sre.google/sre-book/handling-overload/) | Request counts are weak proxies when resource costs vary; capacity and client limits need resource measurements. | A 100-ms verification and a long process-heavy fixture need not request the same reservation. Required checks must wait or fail truthfully; serving a degraded response is not an acceptable passing gate. |
| [GNU make job slots](https://www.gnu.org/software/make/manual/html_node/Job-Slots.html) | Cooperating descendants share a jobserver and return exactly the tokens acquired; a command has an implicit slot. | This is a useful nested-parallelism protocol. Independent worktrees need a common authority, and CPU tokens alone do not implement DotLn's memory, ownership or evidence contracts. |
| Go [weighted semaphore](https://github.com/golang/sync/blob/master/semaphore/semaphore.go), `Acquire`, `TryAcquire`, `notifyWaiters` | New acquisitions cannot bypass queued waiters; release stops at an unsatisfied head request to prevent large-request starvation. | A small implementation demonstrates the choice clearly: strict weighted FIFO trades utilization and short-request latency for progress of large requests. An in-process semaphore is not a host protocol. |
| Bazel [ResourceManager](https://github.com/bazelbuild/bazel/blob/master/src/main/java/com/google/devtools/build/lib/actions/ResourceManager.java) | Accounts for CPU and RAM, separates request classes and considers pending requests for resources. Its local queue and dynamic-action queues use different orderings; scanning can admit a later fitting request. | Resource vectors and policy are separate concerns. Bypassing a nonfitting request needs an explicit starvation rule; the inspected scheduling code is not a ready-made fairness guarantee for DotLn. |
| [Ninja manual](https://ninja-build.org/manual.html) and [build scheduler](https://github.com/ninja-build/ninja/blob/master/src/build.cc) | Dependency readiness, critical-path priority and bounded pools are separate; newer Ninja supports a GNU jobserver client under documented conditions. | Keep the task graph distinct from shared resource admission. Pools suit named conflicts, while an external runner migration must still preserve the gate's cancellation and evidence semantics. |
| Ghodsi et al., [Dominant Resource Fairness, NSDI 2011](https://www.usenix.org/conference/nsdi11/dominant-resource-fairness-fair-allocation-multiple-resource-types) | Allocates multiple resources using each owner's largest normalized resource share. | CPU and memory can produce different bottlenecks. DRF is a candidate allocation model after costs are measured; its fairness properties do not imply a short-gate latency bound for indivisible tasks. |
| Slurm [backfill scheduling](https://slurm.schedmd.com/sched_config.html) | Lower-priority jobs may use otherwise idle capacity when they do not delay the reserved start of higher-priority work; useful bounds on job duration matter. | Backfill can improve a reservation queue, but a historical median or percentile is an estimate, not a guaranteed finish time. Begin with a simpler queue before claiming this reservation property. |

## Owned temporary material and churn

WO-233 couples fixture teardown to the gate's terminal suite outcomes. A
separate durable terminal row supports crash recovery before deletion; it
cannot be consumed as passing gate evidence. The accepted gate row follows
cleanup and records files created/deleted and bytes written from owned-root
inventories, beside capacity, lanes and time. Counts include entries seen at
helper removal plus remaining entries; sparse holes are excluded by the allocated-byte cap; overwrites, physical I/O
and removals outside the helper are unobserved. Failed-suite roots retain their diagnosis window.
Whole-root fixture teardown defers to that outcome, including exit cleanup.
Nested suite commands inherit the outer gate's repository, policy and suite
for temporary ownership, independently of their working directory. A fresh
gate establishes a fresh boundary. Explicit creator cleanup defers only when
its context identifies the repository whose gate will read the ledger;
an inherited gate id by itself cannot transfer that responsibility.
Completion inventories every registered root bearing the gate identity,
including standalone captures and scratch. Disposable roots share their suite's
retention; the actual worker's live or unknown identity still protects a capture.
Reusable caches and independent coordination receive explicit retention reasons.
The declarations scan follows runtime imports and executable path literals into
corpus and evidence modules, covering fixture factories outside the script and
package directories. Archived text captures and ignored intake remain outside
that executable closure.
Runtime directories created inside a fixture carry that containing fixture's
gate ownership and finish with it, including coordination for an instance gate
running inside the disposable repository. The inner gate keeps its own metrics.
Generic prune resolves the containing fixture's physical token and judges its
active gate and terminal outcome. An inner pass cannot end that outer lifetime;
an orphan end observation starts the window on the containing fixture.
Repository removal is an observed absence of active gates, including at ordinary
prune after release close removes a worktree. Errors other than proven absence
still retain the root. Nested caches with a checked containing lifetime follow
that lifetime instead of an independent cache-key protocol; live and unknown
owners and null retention remain protected.
Completion and later prune share one suite-outcome rule: a child assigned to
the completing gate keeps its own suite result; an inner instance inherits the
containing suite at outer completion.
Scratch and coordination use their containing fixture's process lifetime;
worker captures keep the actual worker's liveness check. Missing process
observations stay protected. A readable table proves an absent
PID dead even if creation could not observe its birth; a present PID without
a birth remains unknown. Independent children and
explicit null retention remain protected. Application scratch is removed when its
operation completes; fixture ownership supplies fallback cleanup if it is left
behind. Product children receive retention
policy from the runner, without reading excluded control documents themselves.
Nested retained roots protect their ancestors; overlapping retained or promoted
inventories are counted through their containing root. Each owner token has
an independent ledger segment, retired after terminal gate metrics are durable.
Generic cleanup cannot retire a gate's unfinished metrics, and segment readers
tolerate another completed cleanup removing an entry concurrently.
Fixture copies exclude physical ownership markers, and seed commits ignore
them so Git clones and archives cannot reproduce a foreign directory identity.
Synthetic repository initialization explicitly adds the marker to its local
Git exclusion file, preserving the fixture's tracked ignore rules. Successfully
saved diagnostics and pending entropy subjects use promotion to transfer their
cleanup to the existing durable protocol, rather than inheriting session end.
An invalid nested record preserves its tree and records a cleanup blocker.

The prune apply transaction holds the existing host lane lock through its
fresh inventory and deletions. Global apply refuses any live lane and names
its task; new admission waits for the applying prune and names it. Per-worktree
warm exports and per-session owner records keep parallel orders separate.
Warm freshness uses the owning worktree's current key, including when another
checkout invokes prune.
Inspection never mutates a candidate. Live/unknown owners, gates and writer
reservations retain material; symlink ancestors and replaced owner records
refuse. macOS `fseventsd` resident-byte samples put the command last in the
process table so its name is not truncated; RSS is converted from KiB to bytes.
These are observations, not a memory
admission change or proof that DotLn caused growth. Retain the current temp
layout until comparable complete runs demonstrate growth that a bounded layout
comparison reduces without weakening ownership or evidence.

Gate cleanup holds the same lock through inventory and durable metrics and
checks sibling writer/lane ownership before touching a root. Its own checkout's
still-held writer is part of the completing gate's authority. Cleanup rechecks
retained roots after successful removals: a fixture repository may disappear
after its longer scratch path was protected by that fixture's writer. The retry
repeats the same writer and liveness checks and keeps one end time. Crash recovery
cannot move a recorded completion later; an earlier authoritative end can correct
a late recovery, while a real completion supersedes a provisional orphan observation.
Crash recovery
uses the normal completion retention judgment, including null overrides. If an
orphan has no observed end, preview retains it; apply records the first proven
dead-owner observation and starts the full retention window at that time.

## Alternatives and tradeoffs

| Paradigm | Benefit | Cost or failure mode | Disposition |
| --- | --- | --- | --- |
| Availability-only weighted slots | Small, decentralized and work-conserving when requests fit. | Repeated new arrivals can starve a waiting gate; scalar slots conflate resource and exclusion needs. | Current host mechanism. Insufficient for the observed fairness problem. |
| One whole gate at a time | Simple ownership and predictable interference between gates. | A five-second document gate can wait for an entire complete run. | Useful diagnostic control, poor default for ordinary parallel work. |
| Strict weighted FIFO | An old large request cannot be bypassed indefinitely by small requests. | Head-of-line blocking wastes capacity and delays short work behind a large request. | Baseline comparator, not an assumed final policy. |
| Short-job priority with aging and per-gate rotation | Improves response while ensuring a busy gate cannot win merely by submitting more tasks. | Requires trustworthy classification, protected progress for large requests and explicit latency/throughput tradeoffs. | Preferred bounded candidate, initially without speculative backfill. |
| Reservation plus backfill | Fills otherwise idle holes while preserving an older request's reserved admission. | Reliable duration bounds and reservation accounting add complexity; mistaken estimates break the promise. | Consider only after queue measurements expose head-of-line cost. |
| Multiple resource shares or DRF | Represents CPU-heavy and memory-heavy gates more honestly. | Requires attributable measurements and a policy for indivisible jobs, oversize tasks and changing demand. | Measurement-led extension, not the first repair. |
| External jobserver or resident broker | One admission authority, potentially event-driven wakeups and reusable scheduling. | Packaging, recovery, authorization, mixed-client behavior and another availability dependency; token protocols do not supply all existing semantics. | Compare against the existing-lock queue before adoption. |
| OS priority, suspension or restart | Priority may reduce CPU interference; suspension can free CPU time. | Priority does not release held leases or memory. Suspension can retain locks; killing and restarting loses work and can amplify total cost. | Ancillary host control only; not a replacement for admission. |

The preferred candidate must not promise a small wall-clock wait merely because
it is fair. If every usable slot is occupied by nonpreemptive work, a newly
arriving task waits for a completion. A stronger latency objective requires
reserved headroom, sufficiently small task boundaries or safely checkpointable
preemption. Splitting a file helps only if its work can safely be independent.
The target-worktree missing-helper repair in [D010](../evidence/WO-222/decisions.md)
also shows why preserving names alone is not executable equivalence.

## Proposed migration and validation

Implement this only in an order that adopts explicit acceptance criteria and
compares the alternatives above. The first increment should fit the existing
registry and lock instead of introducing a second owner of host capacity.

1. **Publish an admission intent before waiting.** Record protocol version, an
   owned gate identity, enqueue order, request weight, task class, cancellation
   and ancestry. Mutate intent and lease state atomically under the existing
   lock. Reclaim by verified process lifetime and owned descendants, not age
   alone. Observed holder diagnostics are not an intent queue.
2. **Correct request sizes at their source.** WO-229 measured CPU time, peak RSS
   and wall time three times per structural task and kit verification in core
   and a fixture export. At capacity eight the effective host requests are
   `format` 3, `configuration-root` 2, `registrations` 2, `declarations` 4,
   `generated` 2, `host` 2, `kit-verify` 2. The
   [sizing decision](../evidence/WO-229/decisions.md#wo-229-d002)
   and [authorized exception](../evidence/WO-229/decisions.md#wo-229-d022--authorize-declarations-at-its-measured-four-slot-need)
   use declarations' measured four-slot need; other tasks retain the strict
   half-capacity rule. Local exclusion still holds all local lanes. The
   staggered sibling fixture bounds the document gate's total lane wait below
   the complete gate's longest task and asserts further peer admissions after
   the last document admission. Its full-capacity control fails that bound.
   This finite workload supplies no fairness guarantee for all arrivals or older clients. A low memory
   observation alone does not establish CPU cost.
3. **Schedule between gates before tasks.** Bound each gate's pending admission
   presence, account for resource service, and rotate eligible owners. Permit
   an explicit short-work class with a bounded burst. Age waiting large requests
   and reserve their needed capacity after a documented bypass limit. Measure
   strict FIFO as the simpler comparator. Do not let newly split tasks buy a
   larger owner share.
4. **Preserve nested progress.** Children use only their parent's reservation
   and do not queue behind unrelated work for the same already-reserved slots.
   Reject an oversize child request without consuming more host capacity.
   Preserve reservations through surviving subleases. Test parent death,
   cancellation, PID reuse and nested release races before enabling fairness.
5. **Make compatibility explicit.** Fixed-four clients do not read the new
   capacity or publish queue intent. A new reader cannot promise fairness on
   their behalf. Qualify an adapter that actually intercepts their admission,
   or require an explicit upgrade boundary for all participating clients.
   Mixed mode must report its weaker guarantee. Do not silently rewrite another
   worktree, install a runtime or replace a live registry to make a benchmark
   pass. Current tests for archived runtime procedures remain separate from
   supported concurrent-client compatibility.
6. **Compare with the same required work.** First use bounded synthetic cases
   with deterministic arrivals, then unchanged-source complete gates and short
   gates on the ordinary host. Run both quiet and controlled competing-load
   conditions, retain every failure and record ambient observations. A failing
   run is evidence, not a reason to silently select a quieter sample.
7. **Adopt only with a measured operating benefit.** Keep completion correctness
   and process cleanup as hard requirements. Set the short-gate latency target,
   tolerated complete-run regression and whole-order cost window before judging
   the candidate. Roll back the admission policy when those criteria fail;
   preserve the measurements and the compatibility diagnosis.

The validation matrix must cover at least these cases:

| Scenario | Required observation |
| --- | --- |
| A complete gate and arriving short document gates | Queue wait, first admission, finish time and resource use per owner; the complete gate continues making progress without restart. |
| A large reservation behind a stream of small tasks | A finite tested bypass bound and eventual admission once held work finishes; no starvation hidden by a short sample. |
| One owner with many split tasks and one with a single task | Splitting does not multiply the first owner's scheduling share. |
| Parent holding slots while children request subleases | Children can progress within the inherited capacity; no global-queue deadlock or double allocation. |
| Crash, cancellation and surviving descendant | Intents disappear safely, live descendants remain accounted for and no lost token permanently reduces capacity. |
| Different client versions and capacities | Either the documented compatible result or an explicit unsupported boundary, never a claimed universal guarantee. |
| High ambient memory/CPU demand and changing resource profile | Controlled admission and finite deadlines, with no unexplained timeout inflation or weakened host protection. |
| Same source, changed produced build output, later failure or partial run | No scheduler path weakens reuse identity, failure precedence or completion claims. |

Retain wall time, queue wait, execution time, task and gate footprint, actual CPU
where available, reserved slot-seconds, deadline hits, cancellations and
attempts. Critical-path wait is not scheduler-wide idle; reserved slot occupancy
is not CPU utilization. Record these distinctions in the measurement schema and
human comparison. Aggregate a representative closed-order window as well as
isolated gates. Count preparation and repeat work, including the unsuccessful
attempts needed to reach a passing implementation.

## Later option: host resource profiles

The operator proposed considering this after the architecture work: different
modes for parallel development or gaming, accepting longer gate completion.
This is unimplemented and does not change WO-222's measurement contract.

A future profile could lower new admission, preserve host headroom and adjust a
measured deadline declaration to the smaller effective resource allocation.
Choose one host-wide policy with an observable active profile; independent
repositories cannot each choose a conflicting capacity. Apply a reduction as
running tasks finish instead of killing them. Borrowable headroom improves
throughput, but cannot guarantee immediate reclamation from a nonpreemptive
borrower. Keep every required check and the same evidence rules.

Compare a throughput profile and a coexistence profile under the intended
competing workload. Judge short-gate latency, complete-gate duration, host
responsiveness, memory pressure and deadline failures together. Establish an
actual host-responsiveness measure before claiming a gaming benefit. The profile
names, values, command surface and latency targets remain open until that
comparison; they are not configuration delivered by this order.
