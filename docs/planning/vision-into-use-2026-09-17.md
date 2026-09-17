# Vision into use — the capability ladder, the corrected sequence, a research lane, and the machinery that was costing the operator (2026-09-17)

The operator opened this pass on the main checkout at `ec502c9` (v0.29.0)
with a standard dispatch and twelve further messages during the turn: a
third-party planning brief titled "bring the vision into use", which the
operator largely endorses and asked to weigh heavily; persisting
inconsistency and cost in the two-lane workflow; a configurable hard cap on
the total subagents a multi-agent session may spawn, with the observation
that a top-level guideline of five fans out to more than a hundred; the
post-final-review planning dispatch that WO-135 was filed to remove; a meta
view of how the repository is growing; inconsistent readback of usage, model
and effort; and verifiers running the product gate twice because it fails
inside the sandbox first; and, late in the turn, the platforms lesson of
Steve Yegge's 2011 essay; and the cold-start ceiling that orders touching the
role text keep hitting; and, before merge, a third-party review of the
draft pull request (section 17). All thirteen messages are captured
verbatim in ignored intake
(`docs/intake/notes/2026-09-17-vision-into-use-planning.md`, SHA-256
`aab1ebea10004c8e82f6ec2538ddd7ddc6b774e270f6b0f9301eb3e76d1b0b51`). The
operator's comparison with an employer-provided setup carries no detail and
is used only as the operator's expectation.

Method: one session on the main checkout, read-only until the branch;
one background documentation lookup for Claude Code's subagent and sandbox
settings (its answers are cited by page); no code suite. Sources: canonical
status, the sequence, the R1 replan document and its ledger section, the
2026-09-17 admission pass, the four 2026-09-16 ideation entries and their
receipts, the follow-up register and its Git history, every verification and
final review closed since 2026-09-13, the control segments, the capability
table, product 03, 05, 06 and 07, ADR-0003 to ADR-0005, the writing-worker
record, the local-inference discovery packet, the plan-continuation helper,
the harness host's tool classification, and the work-order files the
sequence names. Entry process cost: 124,346 total tokens
(source `claude-transcript-message-usage`, scope dispatch, cost in USD
unknown). Observation and inference are labeled; an unobserved value is
unknown.

## 1. What was created and never read — the 72 to 96 hour sweep

The window is 2026-09-13T00:00 to the dispatch. Three places hold
suggestions: the follow-up register, ignored intake, and the receipts of
closed orders.

**The register grew by 62 entries and none was read.** The R1 replan pass
recorded 297 entries with 283 untriaged on 2026-09-16; today the register
holds 359 with 344 untriaged, 2 needing review, 1 open and 1 deferred.
Every entry added since the R1 pass is untriaged: 45 per-order decision
records (WO-049, WO-051, WO-052, WO-068, WO-119, WO-121, WO-122, WO-133,
WO-134), the four candidates promoted by the 2026-09-16 ideations
(local-model usefulness experiments, guided operator work orders,
DotLn-owned authority with minimal native harness restrictions, and the
Context Continuity revision), the fifteen defect-register items recorded by
the runtime.resident admission pass and its aftermath, and one NoOp bullet.
The 2026-09-17 admission pass was deliberately narrow and took none of them
up. Section 7 disposes the ones this pass decides; the migration rows keep
their candidate.

**Ignored intake has no unsynthesized capture.** Ten notes were written in
the window. Each has its committed synthesis: the three WO-131 planning
notes (the merge-readiness refresh, the proceed-regardless override on
receipt 012, the background-refuter direction), the WO-131 expanded ideation
(its breakout receipt), the WO-044 cache-ownership note (WO-044 D016 and
D017 cite it), the machinery stand-down and R1 replan captures (their
passes), the runtime.resident capability note (receipt 015), and the WO-051
and WO-119 expanded ideations (their breakout receipts and the four ledger
entries). What was never acted on is different: all four 2026-09-16
candidates say "reopen at the next planning pass", and this is the first
pass to reopen them.

**Receipts since the R1 pass.** Six orders closed after it: WO-049, WO-051,
WO-121, WO-119, WO-052 and WO-122. Their nominations and the defects the
register carries are disposed in section 7. Two were filed as orders before
this pass (WO-134, closed; WO-135, filed on 2026-09-17 and judged by
receipt 016) and are revisited in sections 7 and 13.

**No work is in progress elsewhere.** `git worktree list --porcelain`
reports only the main checkout. The five stashes are named preserve
records from past integrations (WO-122, WO-049, WO-045, WO-039, WO-041),
kept as recovery refs. The brief's premise that related ideas exist in other
worktrees does not hold at this checkout; the ideas exist as candidates on
`main`, which is where this pass reads them.

## 2. What is actually present

The capability table remains the inventory of record; this section reads it
against the brief's five states. A process double, a passing transcript and
a scratch proof are counted as what they are.

| Capability | State | Evidence and its limit |
| --- | --- | --- |
| Kernel: event loop, cadence subset, authorize guard, JSONL store/replay, continuation subset | implemented, fixture-verified (level 2) | Automated checks for normal and important failure paths; no real workflow has carried lifecycle, recovery, authority and audit evidence together (table level-3 gate). |
| Composition compiler (`compiler.seiri-v1`), harness lowering (`compiler.harness-v1`) | implemented, independently verified (level 1) | Bounded Seiri lowering, authority floor, three grant views, generated project settings and hooks; this repository runs on its own generated configuration. |
| Disposable inspection transports (Claude print, Codex exec), inspection recovery, worker status | implemented and demonstrated live (level 1) | Both real hosts returned schema-bound envelopes (WO-009); recovery from a kill is fixture-proven. |
| Resident (`runtime.resident`): presence policy, `--once` tick, script actor, restart | implemented, fixture-verified (level 1) | Fake-clock phases, byte-identical replay, native no-network script, SIGKILL recovery (WO-068). No live model actor in its own proof. |
| Presence with origin, executable discovery producer | implemented, independently verified | Origin is a pure function of event kind and resident stamp (WO-121); the producer observes a real worktree's declared checks and conventions without a model (WO-119). |
| Target-worktree harness bundle | implemented; live smoke rows for both harnesses | Emit, check and remove paths with hooks for Claude and the instruction block for both (WO-049); live rows recorded, no sandbox containment claimed. |
| Source-change writer profile and host (`worker.source-change`) | implemented, fixture-verified with process doubles (level 1) | Real foreign Git worktrees, failing-before and passing-after tests, immutable commit receipts, three SIGKILL windows, bounded recovery (WO-052). The central actor has never run live; WO-053 is that proof. |
| CLI worker and human handoff actors | implemented, independently verified; one live row | The resident dispatches writer and inspection requests and holds an order for a human answer across restart (WO-122). The live row is blocked: Node was unavailable to the worker, while host observations recorded an edit, a passing test and a commit. |
| Independent verification (`runtime.independent-verification`) over a real worktree; repair continuation; live blinded verification | specified, not started (WO-054, WO-055, WO-056) | The fixture loop (WO-010, v0.12.0) exists; nothing has verified a change in a worktree the implementer did not write the narrative for. |
| Mission check, portfolio and derivation, the unattended hour | specified, not started (WO-099, WO-100, WO-111) | The resident's first useful unattended work waits on these three. |
| Runtime status projection and console (WO-114 to WO-117) | specified, not started | `dotln status`, the actor board and control beacons are the inspection surfaces that run today. |
| Local-model transport (WO-110) | specified, not started; runner readiness unknown | WO-027 recorded a crash on the only permitted LM Studio launch (2026-09-03). Today: the application is installed, the `lms` CLI was updated on 2026-09-15 (commit `ff50809`, newer than the probed build), the server is not running and nothing listens on the loopback port. Hardware: Apple M3 Max, 48 GB. The current build has never been probed. |
| DotLn-owned authority with the native sandboxes off | discussed, candidate in product 03, no allocated path | Product 03's candidate names the requirement (faithful enforcement plus adversarial tests, no stalls inside the envelope). No enforcement-boundary evidence exists beyond WO-044's rows. |
| Research and guided-operator work orders | practiced without a name (WO-027, WO-044, WO-053), candidate in product 07 | No convention says how a negative outcome closes an order or what it may not promote. |
| Starter export and registered targets (WO-069 to WO-079) | specified, not started | Nothing runs DotLn from outside this checkout; nothing registers a repository. |
| Browser witnesses, contracts from issues, target publish and the PR loop (WO-057 to WO-066) | specified, not started | The loop against a scratch web target (WO-112) needs all of them. |

**What the operator can use today, from this checkout.** The Contributor
harness itself (every order since 2026-09-07 has run on it, with one gate
per order); `dotln resident --store <dir> --policy <id> --once` and
`dotln presence away|back` (the resident runs a compiled presence policy
and dispatches a script, a CLI worker or a human handoff per phase);
`dotln status`; `dotln demo` and the inspection workers over both real
harnesses; `dotln handoff answer`; the actor board; the discovery producer
inside a resident episode; the plan refutation and follow-up feed. None of
these changes a file in a repository the operator did not edit by hand; that
is exactly WO-053's unfilled claim, and it is the next order.

## 3. The ladder — when the vision becomes usable

Milestones are dependency waves, not dates. "Inherent" means the prerequisite
is a product rule or a data dependency; "sequence" means it exists only
because of where an order was placed.

**M1 — a real actor performs a governed external source change.**
Foundations: WO-049, WO-051, WO-052 (fixture-verified) and WO-122's blocked
live row. Remaining: WO-053 only, and it is unblocked (its sole hard input,
WO-052, is closed). First demonstration: the operator runs
`npm run dotln -- source-change <order>` twice per installed harness from an
outside terminal — one clean episode, one kill-after-commit — against a
generated scratch repository, and files the receipt. Proves: a fresh worker
under the emitted bundle edits one file, turns one test green and commits,
with the main checkout and the sentinel tree unchanged and recovery by
commit identity. Does not prove: verification, a pull request, or any
repository the operator keeps. Every dependency is inherent.

**M2 — an independent actor verifies it and drives bounded repair.**
Foundations: the fixture verification loop (WO-010), the acceptance-matrix
fold, WO-052's diff and worktree. Remaining: WO-054 (the verifier receives
the contract, the diff and a read-only snapshot, and the host runs the named
tests itself), WO-055 (a finding becomes a bounded repair continuation
inside the original surfaces), WO-056 (the loop live). First demonstration:
WO-056's episode over the WO-053 fixture with a planted defect. The chain
is inherent (each lifts the previous one); WO-054 needs only WO-052 and can
start beside WO-053.

**M3 — the resident performs useful bounded work while the operator is
away.** Foundations: WO-068, WO-121, WO-119, WO-122. Remaining: WO-099 (a
cadence-driven read-only mission check; unblocked today, needs WO-068
only), WO-120 (derived work as a durable identity; needs WO-069), WO-100
(the preauthorized portfolio; needs WO-054 because every derived change is
verified before the curve advances, a product rule), WO-111 (the unattended
hour: 5S work derived, executed, verified and stopped on return). First
demonstration: WO-099 fires a mission check with a planted drift while the
operator is marked away — the first thing DotLn does unattended, with no
source change. Inherent: WO-100 after WO-054; WO-111 after WO-053 and
WO-099. Sequence-induced: WO-120's dependency on WO-069 is typed as hard and
is kept, but WO-069 is a small order and moves up for it.

**M4 — inspect and control through a coherent interface.** Today:
`dotln status --json`, the actor board (`uifa-board-v1`, terminal and HTML),
control beacons. Remaining: WO-114 (status projection over the resident's
slice), WO-115 (the parity contract that makes every terminal command a
console command), WO-116 (audit served), WO-117 (the live host). WO-114
needs WO-120 and WO-115 needs WO-100 (typed hard edges) because they render
derived identity and the portfolio; that is inherent to what they show, so
the console follows M3 rather than preceding it. First demonstration: WO-114
showing a resident episode, its phase and its pending handoff.

**M5 — a local model participates in a useful role.** Foundations: the
transport port, the inspection profile, WO-027's packet, the profiling
contract in product 06. Remaining: WO-137 (runner readiness as a guided
research order: noninteractive calls DotLn can invoke, capture, cancel, time
out and evaluate, with provenance), WO-110 (the inspection transport, written
from the fresh row), WO-138 (a role qualification pilot on representative
DotLn tasks with independently checked outputs). First demonstration: a
`local-model` actor completing a read-only inspection episode with a
schema-valid envelope, then the pilot's table saying which of evidence
summarization, discovery-candidate ranking and structured classification
the model handles at what reliability and cost. Does not prove: bounded
implementation or verification competence; each is a later, separate
qualification. Every dependency is inherent; nothing on this branch blocks
the delivery lane.

**M6 — a sandbox-disabled harness configuration with stated guarantees.**
Foundations: WO-042's monotone envelope, WO-049's target hooks, WO-051's
exact allow-lists and named Codex profile, WO-052's host checks, WO-044's
rows, ADR-0003 to ADR-0005. Remaining: WO-136 (the enforcement-boundary
matrix, section 6), then a decision at R2 on which mode each harness may
run in, then a mediation order per gap the matrix names, then the adversarial
suite the product 03 candidate requires. First demonstration: the matrix
itself — for each declared limit, prevented or observed-only, per harness,
sandbox on and off. What the operator can choose today: Claude's
`sandbox.enabled: false` is a documented per-project setting and
`allowUnsandboxedCommands` is already the reviewed ask path; choosing it now
is an explicitly trusted mode with detection-only guarantees for shell
effects, not a confined one. Inherent: the matrix before any mode is
described as safe.

**M7 — the loop operates on a real repository.** Foundations: M1 and M2.
Remaining: WO-069 and WO-071 (a registered target with an authority profile),
WO-063 and WO-064 (the outward-artifact lint and a pull request under an
explicit grant with operator provenance), then a guided order for the first
governed change in one of the operator's own repositories (Gate H in the
critical path; filed at R2 with WO-064's evidence), then WO-065 and WO-066
(the post-PR loop) and WO-112 (parity against a scratch web target, which
also needs the browser witnesses and the contract-from-issue orders). The
starter export (WO-074 to WO-078) is not on this path: it makes DotLn
runnable from a fork, which the operator's next useful experience does not
need. It stays after the real-repository milestone.

**M8 — the visual composition, socket and link aspects.** Foundations: the
actor board's blueprint panel, the compiled diff tooltip, the console
contracts. Remaining: the console live host (WO-117), then the pattern
workshop family (WO-091 to WO-095: multi-active link groups, the sets
graph, set bonuses, the full-set render) and the console framework decision
at R3. Farthest; nothing here blocks the loop.

## 4. The corrected sequence and the two lanes

**The external review's concerns, verified.** A check of every typed
dependency against the committed sequence (a 40-line script over the
`dotln-dependencies` blocks; the same rule WO-135 now adds to the plan
check) found exactly two violations: WO-114 hard-depends on WO-120 and was
placed a pair before it; WO-115 hard-depends on WO-100 and was placed two
pairs before it. Both are fixed by ordering the console after the resident
chain (section 3, M4). WO-070 and WO-120 both name `scripts/resume.mjs` as
an edit surface (their own text) and were paired; they are separated.
WO-122 and WO-099 have no missing edge on WO-121: WO-122 is closed and
WO-099 reads presence through the resident, whose origin classification is
WO-121's and is merged. Nothing checked pair boundaries or dependency order
before this pass: `plan check` validates receipts and continuation, the
index validates activation. The protocol identifiers that carry `v1`
(`harness-v1`, `source-change-v1`, `uifa-board-v1`) are contract strings;
WO-133 moved the version literals into one module, and no check was
observed reading a protocol id as a version. No action.

**The sequence.** Closed entries stay. From WO-135 onward the queued entries
are fourteen pairs, then the serial run:

| Pair | Delivery lane | Second lane | Why they do not collide |
| --- | --- | --- | --- |
| 1 | WO-135 planning-gate corrections | WO-136 authority enforcement boundary | A planning helper and its fixtures; a probe extension under `scripts/lib/` and `docs/discovery/`. |
| 2 | WO-053 the first external source change | WO-139 subagent cap | Evidence and one receipt fixture; the harness host and the budgets file. WO-053 is operator-run; WO-139 is not. |
| 3 | WO-054 verification over a real worktree | WO-137 local runner readiness | The verification host; a discovery record and a probe. WO-137 is operator-assisted; WO-054 is not. |
| 4 | WO-055 repair continuation | WO-140 gate sandbox preflight and usage readback | Verification and continuation; the test runner and the briefing. |
| 5 | WO-056 live blinded verification and repair | WO-110 local-model transport | Evidence of a live episode; `worker-transport.ts` and the catalog. WO-110 reads WO-137's row. |
| 6 | WO-099 mission check | WO-079 worktree integrate | A resident episode; `scripts/worktree.mjs`. |
| 7 | WO-069 configuration root | WO-138 local-model role qualification pilot | `scripts/lib/config.mjs`; evidence only. |
| 8 | WO-071 registered target repositories | WO-120 derived work identity | Configuration and the compiled envelope; `resume.mjs` and `work-orders.mjs`. |
| 9 | WO-063 outward-artifact lint | WO-100 preauthorized portfolio | A lint over outward artifacts; the resident's derivation. |
| 10 | WO-064 target publish | WO-111 the unattended hour | `worktree publish` for a target; a live resident proof. R2 follows pair 10. |
| 11 | WO-114 runtime status projection | WO-070 beacon portability | A projection; the seven build-free beacon leaves and `resume.mjs`, after WO-120 merged. |
| 12 | WO-115 console parity contract | WO-060 SourceBundle contract | Console contracts; a source contract. |
| 13 | WO-116 audit projection served | WO-065 pull-request state observation | Console; the GitHub observation. |
| 14 | WO-117 console live host | WO-066 review-comment resolution loop | Console; the post-PR loop. |

Then, serially: WO-057, WO-058, WO-059, WO-061, WO-124, WO-062, WO-123,
WO-112, the starter tranche (WO-074, WO-075, WO-072, WO-073, WO-076,
WO-077, WO-078), WO-118, WO-113, the workstream family, the migration
family, the workshop family and the documentation reset, unchanged in their
internal order. The check over the whole list reports no violation. Orders
outside the sequence (the umbrella records, WO-014, WO-036, the corpus
drafts) are unchanged.

**What changed and why.** In user value: the four orders that make the
source-change primitive verified and real (WO-053 to WO-056) are contiguous
in the delivery lane, and the road to the operator's own repository (WO-069,
WO-071, WO-063, WO-064) follows them directly instead of the console. In
safety: the console no longer precedes the contracts it renders; the
research lane's first order is the enforcement matrix, so no later order
describes an unconfined mode without evidence. In uncertainty reduction:
the three cheapest questions — is the runner usable, where is the actual
enforcement boundary, and can a hard cap be enforced — are answered in the
first three pairs while the delivery lane is busy.

**Two lanes, one rule each.** The operator's report is the reopening
observation for the R1 decision that recorded the checklist: integration
is still handled differently each time and its cost is felt. The record
since 2026-09-13 shows final reviews of 14 to 56 minutes; the five that
integrated a sibling's merge ran a median of about 32 minutes against
about 25 for the rest, with one 56-minute outlier (WO-047) and one 43-minute
review that also paid the planning chore of section 7 (WO-052). The
integration cost is therefore real but bounded; what makes it feel larger is
that every step is remembered rather than executed, and that a second lane
that changes source always retimes a release and re-runs the gate on new
bytes. Two rules follow. First, the second lane is by preference an
evidence-only or machinery order that touches surfaces the delivery order
does not, so its integration has no release retime and no source merge;
pairs 1 to 7 are cut that way. Second, WO-079 is rewritten from a sync
helper into `worktree integrate`, one command that runs the 2026-09-16
checklist — checkpoint, named stash, merge main, regenerate every generated
surface, union the register by entry id, retime a colliding unpublished
target with a dated decision stub, and report the affected checks — so the
integrating reviewer runs and reads instead of remembering; it is placed at
pair 6. Until it lands, the checklist stands as written.

**Resource contention.** One machine and one operator. Two operator-assisted
orders are never in the same pair (WO-053 and WO-137 are in pairs 2 and 3;
WO-136's outside-sandbox launches are approved one by one). Live local
inference (WO-137, WO-138) runs when no product gate is running on the host,
because the gate bands (191 to 515 s fresh) are timing evidence; the orders
say so. The resident's store is per order and disposable in every proof.
Model limits: three concurrent harness launches completed without a limit
(C-U5, X-U5); nothing here exceeds two sessions and one background worker.

## 5. Research and guided-operator work orders — the minimum changes

The repository already runs research orders without calling them that:
WO-027 closed on a negative result with a named deferral condition; WO-044
produced a record of 33 labeled rows and no implementation; WO-053 is a
live proof that may not close on failure. The lifecycle, the evidence
directories, the `observed`/`blocked`/`unavailable`/`ambiguous` labels, the
discovery packets and the evidence-only release path all exist. What is
missing is a stated convention, so that a negative result is legible and
cannot be mistaken for a capability. This pass adds one product 07 section,
"Research and guided-operator work orders", and no schema, transition or
command. Its rules:

1. The Objective states the question or hypothesis and the decision it
   informs. The Design states the setup, the permitted effects, a bounded
   budget (attempts, wall-clock, tokens where the harness reports them) and
   the stopping conditions. The acceptance criteria are method criteria: the
   artifacts, their labels, provenance and budget adherence, and an outcome
   reported as exactly one of `ready`, `negative` or `inconclusive`. A
   criterion never requires that the experiment find a winning approach.
2. A guided operator order is the same shape with the operator's steps
   named, the agent proposing the next step from observed results, progress
   preserved across sessions, and one of two closes: the declared check
   passes, or a failure artifact records the attempted path, observed errors,
   ruled-out causes, remaining blocker and the next useful action or
   reopening condition. A failure artifact discharges the investigation and
   never marks the setup as achieved.
3. The execution record's first sentence names the outcome class, so the
   generated index shows it. A `negative` or `inconclusive` outcome closes a
   research order and satisfies no implementation or live-proof criterion;
   the capability table's rule stands that only real workflow evidence
   promotes a level, and this section adds that a research outcome is
   planning evidence, not a level.
4. Experimental code lives under `scripts/probes/` or the order's evidence
   directory, carries tests proportionate to its risk (the existing rule for
   ideation helpers), is reviewed as code, and is promoted only by a
   separate implementation order that cites the receipt.
5. Live model evaluations and live harness launches run under explicit
   `probe:` or `evidence:` commands, never inside `npm test`; deterministic
   adapter and protocol tests stay in the gate. Requalification is triggered
   by a change to the transport, the tool or output protocol, the model
   artifact or quantization, the runtime's version, or authority behavior,
   and is recorded as a dated discovery row.

The verifier judges method and honesty; the reviewer judges the decision
packet. Nothing else changes.

## 6. Authority without the sandbox — the honest assessment

**Six mechanisms, kept apart.** (1) Approval prompts: Claude auto-denies a
request with no terminal (C-U2); Codex under `-a never` never asks. (2)
Harness permission rules: exact `--allowedTools` patterns admit exactly the
listed tools and commands (C-W2 observed); project `permissions.deny` refuses
an otherwise-allowed command (C-W3). (3) Operating-system confinement: the
Seatbelt and workspace-write sandboxes govern Bash writes and network; neither
confines a sibling write under the temporary directory (C-W6, X-W6), and a
nested `sandbox-exec` inside a Claude session returns "Operation not
permitted" (WO-068 FINAL-001). (4) DotLn's authorization: the kernel guard
(`kernel.authorize`, level 2) allows, denies, expires and revokes effects
routed through the reactor; WO-042's envelope is monotone, so a support can
only narrow and a grant enters only through host admission with provenance.
(5) Credentials and privileges: every worker runs as the operator's user with
the operator's stored authentication (C-U1, X-U1); Claude's deny rules block
the SSH directory, Codex's named profile grants minimal read and workspace
write. (6) Detection and recovery: WO-052 records the main checkout hash
before and after, the sentinel tree, host-run tests and the commit identity,
and recovers by that identity after a kill.

**Where each important restriction is actually enforced.**

| Restriction | Rule source | Enforced at | Bypass | Prevented or observed | Trust assumption |
| --- | --- | --- | --- | --- | --- |
| Write outside the worktree | `source-change-v1` profile; target bundle | Claude: PreToolUse hook on Edit/Write/Bash (C-W4) and allow-list; Codex: named profile (X-W2) | A Bash-admitted script writing anywhere (Claude); none observed for the profile (Codex) | Prevented for tool calls; observed after the fact for script effects (WO-052's sentinel and checkout hashes) | The declared test command's contents |
| Sibling worktree write | same | same | Temporary-directory siblings are writable under both sandboxes (C-W6, X-W6) | Observed, not prevented, by the sandbox; prevented by the profile on Codex (X-W2) | None on Claude beyond the hook's path check |
| Network egress | profile (`network.enabled=false` on Codex); Claude sandbox network rules | OS sandbox | A command run through the unsandboxed ask path | Prevented while the sandbox is on; not prevented with it off | The ask is reviewed |
| Credential read | ADR-0003 deny rules; Codex minimal read | Harness permission layer (Claude Read/Edit and sandbox file rules); profile (Codex) | An admitted script reading `~/.ssh` (Claude Bash) | Prevented for tools; unknown for admitted script contents | The deny list stays in every mode |
| Undeclared command | exact allow-list | Harness permission layer (C-W2) | none observed | Prevented | None |
| Contents of an admitted command | none | none | the command itself | Not prevented; WO-052 says an exact grant is not OS isolation of an arbitrary test script | The declared command is trusted |
| Nested process, other executable | none pre-effect | OS sandbox only | any admitted command | Observed only, once the sandbox is off | Trusted |
| Publish, push, destructive Git | WO-042 grants with operator provenance; `Bash(npm publish *)`, `scp`, `ssh` denies | Kernel guard for routed effects; harness deny for the listed commands | `git push` is not on the deny list; a script may run it | Prevented for routed effects; observed for script effects | No remote grant exists in any worker profile today |
| Workflow transitions | lifecycle legality in `resume.mjs`; one writer per worktree; live-gate input refusal | DotLn hooks (the two hard refusals) and the lifecycle commands | none observed | Prevented | None |

Where "unknown" appears, WO-136 measures it. A role or support in prose is
enforcement nowhere in this table; the compiled hook and the exact allow-list
are, for Claude. For Codex exec mode no hook fires (X-W3, X-W4, X-W5,
X-W10), so pre-effect enforcement is the launch profile or nothing.

**Feasible modes and their guarantees.**

- **M0, current.** Sandbox on, exact allow-lists, DotLn hooks advisory except
  the two refusals, host checks after the fact. Guarantees: tool-level
  prevention plus OS confinement of shell writes and network; not sibling
  writes.
- **M1, trusted-unconfined.** Sandbox off. Claude keeps the hook and the
  allow-list (tool-level prevention); Codex keeps the profile only when
  launched with one. Guarantees: workflow authority, tool-level prevention,
  detection and recovery; no confinement of what an admitted command does,
  no network confinement. This is an explicitly trusted mode; it must be
  labeled so wherever it is offered.
- **M2, hook-mediated.** Sandbox off, and every Bash command must be an
  exactly declared command (WO-052's shape) that the hook classifies before
  it runs. Claude only. Guarantees: no undeclared command runs; what a
  declared command does remains trusted. The smallest mediation increment
  over M1, and the one WO-136 can measure the value of.
- **M3, isolated execution environment.** The product 03 candidate: a
  container or VM per episode. Real confinement independent of the harness;
  not on this horizon.

**The composition questions, answered from the record.** A support cannot
widen: envelopes are monotone (WO-042) and a conflict resolves to the
narrower envelope. Grants enter only by host admission with provenance;
equipping a support that carries a grant is a host act recorded in the
authority receipt. Nested actors and subprocesses: the resident refuses a
nested request that exceeds its own authority (WO-122); a subprocess of a
worker inherits the process's privileges, which no DotLn mechanism narrows
today. Revocation mid-episode: the kernel revokes routed effects; a running
shell command is not routed, so revocation reaches it only at its next tool
call — untested, and a WO-136 row. The operator sees effective authority
before dispatch through the three grant views and the envelope-projected
inspection. Uniform across harnesses: the kernel envelope, the exact
allow-list shapes and the host's after-the-fact checks; not uniform:
pre-effect hooks, which Codex lacks.

**The experiment.** WO-136 extends the WO-044 probe with an authority matrix:
for each row above, a Claude print-mode worker and a Codex exec worker,
sandbox on and off, with the declared limit and an attempt to exceed it
through the shell, a nested process, another executable, direct file access
and direct network access, recording prevented, observed-only or not
observed, plus a sustained authorized workflow with no unexpected prompt or
stall. Its decision: which mode each harness may run in, which rows need a
mediation order before M1 or M2 is offered, and whether the Codex path
needs the "hands" topology (the model outside, tool execution through DotLn)
that product 03 leaves open. It claims no security result; it produces the
table that any later claim must cite.

**The small allow/deny list.** The project settings that the compiled bundle
owns hold four deny rules and five hooks; the user settings hold the sandbox
block, `acceptEdits` and fourteen deny entries, with the eleven
command-specific grants removed on 2026-09-01 (ADR-0005). The list is
already small; what kept it small is that worker launches carry exact
allow-lists instead of user-level exceptions. This pass recommends keeping
the credential and transport denies in every mode as defense in depth, and
declines to shrink the list before the matrix exists.

## 7. Receipts and defects since the last pass, disposed

| Source | Nomination | Disposition |
| --- | --- | --- |
| WO-068 FINAL-001 B1, WO-052 FINAL-001 B1, WO-052 D005, register item 1 | An order may mandate a capability id its own gate refuses; the merge waited on a planning dispatch twice | WO-135 is rewritten (section 13, decision 3): every appended dated section for an order in the judged sequence is an execution update, new ids included; the level claim is judged by verification and final review and by the next planning receipt. The class of post-final-review planning dispatch is removed, not narrowed. |
| Register item 2 | The plan gate was unsatisfiable on a day with two passes | Settled by WO-134 (closed, independently verified). |
| Register item 3 | A final review's bold merge prerequisite is unenforced | The only prerequisite of that kind was the capability admission; WO-135 removes it. The general rule enters product 07 role text: a review records a merge blocker only with the command and line that enforces it. |
| Register items 4 to 8, 12 to 15 | Dispatch and reporting defects of the release-close sessions | Declined as orders; each is a role-text duty the shared instruction already carries (no-guessing before claims, the prefix is the dispatch, name the enforcing line, run the suite that judges the merge, name the landing path). Recorded as the process-debt register's floor; reopen on a recurrence after this pass. |
| Register item 9 | The ledger's insertion rule is unenforced | Remains with WO-084 under its deferral; this pass inserts its section directly below the header. |
| Register items 10, 11 | A source change rode a document-only dispatch; a stale gate row was answered by rewinding code | Item 10 is a WO-135 criterion: a planning dispatch refuses a non-document path at write time. Item 11 is role text and a stop rule already in the critical path. |
| WO-121 FINAL-001 F1 | The gate failed 3 of 3 inside the sandbox (`.claude/hooks/**` denied) and was rerun outside | WO-140: `npm test` refuses inside a harness sandbox when a declared suite needs the outside, naming the suites and the command; verifier and reviewer role text runs the gate outside from the start. |
| WO-122 VER-001 limits | Availability follows dated rows; the handoff directory is relative to the store; script declarations carry no work-order identity | Observations; the first is WO-137's and WO-110's row rule, the third is WO-120's territory. No order. |
| WO-049 D005, D006 | Codex session metadata reported automatically; the GPT-6 Astra preference scoped to this harness | Settled decisions in force. |
| Ideation 2026-09-16: local-model experiments | Readiness first, then matched comparisons | Allocated: WO-137, WO-110, WO-138; the product 06 candidate carries the disposition. |
| Ideation 2026-09-16: guided operator work orders | A work-order type for assisted setup with a failure artifact | Allocated: the product 07 section (section 5); WO-137 is its first use. |
| Ideation 2026-09-16: DotLn-owned authority | Earn the ability to disable native sandboxes | Allocated: WO-136 and the section 6 assessment; the product 03 candidate carries the disposition. |
| Ideation 2026-09-16: continuation after compaction (FUP-0091 revision) | Context Continuity with progress recovery | Deferred with a reopening condition: a bounded live reproduction with host events. It composes with WO-120 and WO-100, which own the durable work identity the candidate wants; no separate order. |
| FUP-0111 planner startup context | Measure the feed | Measured again: this pass consumed the feed's first page and selected nothing from it, because the 62 new rows are decision records and register items; orientation needed the reads listed in the method paragraph. Stays open; the register-settlement candidate is its precondition. |
| FUP-0132 (WO-126 D005) | File-level authored-output contract | Deferred: no order touches the delivery contract this horizon; reopen with WO-113. |

## 8. The repository writ large

**Numbers (observed 2026-09-17, v0.29.0).** 1,923 tracked files; 133 filed
orders; 817 evidence files (42 percent of tracked files). Source: 79,148
lines, of which the kernel is 1,762, the compiler 6,532, the skeleton
24,685, the console 2,934 and the scripts 36,660 (10,808 in `scripts/lib`).
Tests: 51,407 lines. The largest files are `scripts/test-process-debt.mjs`
(5,520), `scripts/test-harness.mjs` (3,413), `harness-host.ts` (3,295),
`scripts/test-plan-refutation.mjs` (2,914) and `reactor.ts` (2,622). The
refutation directory holds 6.8 MB, about 0.5 MB of JSON per receipt because
each embeds its whole judged subject; the ledger is 690 KB, the generated
index 248 KB, the planning map 219 KB.

**The curve.** From v0.10.0 (2026-09-05) to v0.29.0 (2026-09-17): files 390
to 1,923; source lines 21,230 to 79,148; test lines 17,549 to 51,407;
orders 38 to 133; evidence files 23 to 817. Twelve days, five times the
files, 3.7 times the source. Evidence and control-plane machinery grew
fastest; the kernel barely moved and is the smallest package, which is the
intended shape (product 03: a pure kernel, a skeleton that hosts it, a
control plane that proves it).

**Product against machinery.** Of the 24 orders closed since the machinery
stand-down, 13 are machinery, hardening or process (WO-132, WO-126, WO-043,
WO-125, WO-128 to WO-131, WO-133, WO-134, and the WO-045 to WO-048/WO-050
codec and slice hardening) and 10 are product or discovery (WO-044, WO-067,
WO-047, WO-068, WO-049, WO-051, WO-121, WO-119, WO-052, WO-122). The queue is
the reverse: of 58 queued orders before this pass, the debt orders are the
deferred documentation family (WO-084 to WO-090), WO-113 and WO-079. The
operator's observation is right about the queue and answered by the record:
debt has been paid in dedicated passes (2026-09-09, 2026-09-12, 2026-09-15)
and in named boy-scout items, not queued as orders. This pass keeps that
pattern and adds five bounded machinery items only where a measured cost or
an operator-reported one exists (WO-135, WO-139, WO-140, WO-079, and the
topology check inside WO-135).

**What grows without a rule.** Receipt JSON (0.5 MB per pass; the subject is
embedded by design so the receipt stays self-contained) — a candidate,
"receipt subject by reference", reopens when the refutation directory
exceeds 30 MB or thirty receipts, whichever first; not now, since
immutability is the design and 6.8 MB is not a constraint. Evidence files
(one directory per order, immutable) — the same NoOp as R1. Local lanes —
the R1 candidate stands. The documentation reset family stays deferred behind
WO-053 and is a waiver question at R2.

**Tech debt now against later.** Now: WO-135 (the gate that blocked two
merges), WO-140 (a gate run twice on every verification), WO-139 (an
uncapped fan-out), WO-079 at pair 6 (the integration todo). Later, with a
trigger: the register settlement (a session to spend, or 400 pending),
local lane retention (disk pressure or twenty snapshots), the receipt size
candidate (30 MB), the documentation reset (R2 waiver), `harness-host.ts`
(the next product order that must change its structure).

## 9. The test gate — what to protect and what still wastes

**Corrected on 2026-09-17 after the review of PR #83.** The first version of
this section described suite-level success caching keyed by declared
inputs, sharing under the Git common directory and replica execution as
the current basis of reuse. That was the WO-129 to WO-131 design, and
WO-132 criterion 4 deleted it on 2026-09-15: `suite-replica.mjs`,
`suite-sandbox.mjs` and the declared-input, replica and cache parts of
`suite-evidence.mjs` are gone with their tests. The error was the planner's
(the criterion that retired the machinery was not read); this is the
architecture that exists.

The current design is simpler than the proof-cache discussion and it holds:
one product gate per order (19 suites, 191 to 515 s fresh on this host, with
a `protects:` line each), run against the working tree with every invocation
fresh (`executionMode: "fresh"`, `reusedSuites: 0`); one `npm test` row
recorded by `gate-evidence.mjs` under the code identity of the tree
(documents, `.claude/`, root Markdown and generated files excluded) beside
the exact-tree `git diff --check` row; the reviewer's `--review` gate adding
the machinery suites only when machinery source changed (817 s for WO-122,
which merged WO-052's runtime and touched `scripts/lib`); and lifecycle,
pull-request publication and release close consuming that committed row by
code identity, never rerunning it. Reuse therefore exists at exactly one
grain, the whole gate at one code identity; a suite is never reused
individually, and the reuse rule is legitimate because the key is the bytes
the suites read, not a phase or a role. `findGateCheck` matches the
`npm test` identity by code identity alone, which is why WO-140 must give a
sandbox-subset run a different identity (section 17).

Two wastes remain, one real and one not. Real: a verifier runs `npm test`
inside the session sandbox, it fails on a suite that needs the outside
(WO-121 VER-001 and VER-002: 17 of 19, then 18 of 19; `.claude/hooks/**`
denied; a nested `sandbox-exec` refused), and the gate is run again outside
by the same or a later session — WO-049, WO-051, WO-052, WO-134, WO-122 and
WO-121 VER-002 record their passing gate outside. WO-140 makes the runner
refuse up front inside a harness sandbox when a declared suite needs the
outside for an environmental cause, naming the suites and the command, and
the verifier and reviewer role text runs the gate outside from the start in
an attended session. Not waste: a review gate after an integration runs on
new bytes; independent judgment does not require it to be repeated, and it
is not.

Research orders add no gate: live evaluations run under `probe:` and
`evidence:` commands and never inside `npm test` (section 5, rule 5).

## 10. Usage, model and effort readback

Measured from the control segments: of 196 events recorded since
2026-09-13, 98 carry an attestation; 14 of those 98 report an unknown model
or effort, concentrated on 2026-09-15 before WO-133 restored the
operator-attested fallback (Claude `effort: unknown` under
`operator-selected`, and Codex `unavailable`/`unknown` rows). Every attested
event since WO-133 merged records both values. Usage counters are the weaker
half: only WO-122's final review reports an entry measurement; the R1 replan
pass could not measure at all because its hooks ran in their fallback; most
receipts say "unknown" or nothing. The causes on record are three: a built
runtime behind `main` (fixed by WO-133's rebuild), the `usage` command
needing a session id the session had to find, and receipts having no
required field for the counters. The comparison setup the operator cites is
outside this repository and is not evidence here. WO-140 adds the small
mechanical part: the briefing prints the session id and the filled-in usage
command, and every receipt's cost line carries the counters or a cause code
from a closed list (`hooks-fallback`, `no-session`, `harness-no-readback`),
never a bare unknown. Reopen the wider question on a receipt after WO-140
that still lacks both.

**The cold-start ceiling, handled ad hoc.** The operator's twelfth message
names a second cap: orders that change the Contributor's role text keep
hitting the per-role cold-start byte ceilings in `docs/control/budgets.json`
(installed `CLAUDE.md` plus the role skill), and each time the ceiling was
either raised by hand or the breach left advisory. Measured now: the reviewer
at 16,587 of 16,384 and release-close at 9,941 of 8,192 are breached in both
skill roots (the R1 pass recorded 8,865 for release-close and left it); the
verifier sits at 15,369 of 16,384 and the executor at 18,021 of 20,480, and
`CLAUDE.md` is shared, so every shared rule raises every role. The contract
already has the normal route — a dated acceptance with a metric, a ceiling
and a reason turns a breach into `accepted` — and WO-044 D-record set the
policy on 2026-09-14: caps yield to needed rules, accuracy before
efficiency. This pass records both raises as acceptances (one 4 KB step each)
and writes the rule into product 07: a reviewed rule that breaches a ceiling
raises it in the same change, named, or records the acceptance; it is never
trimmed around and never left advisory across orders. WO-139 and WO-140,
which add role text, follow that route. Reopen on a breach left unrecorded
after this pass.

## 11. A hard cap on subagents, and why the fan-out is not batched

Facts from Claude Code's documentation (workflows: behavior and limits;
hooks: lifecycle and "hooks in skills and agents"; settings reference):
there is no setting that caps the total subagents of a session;
`workflowSizeGuideline` takes small, medium, large or unrestricted and is a
guideline the model aims for; a workflow run is limited to 1,000 agents and
16 concurrent agents, fewer on CPU-limited hosts; PreToolUse fires for the
Agent and Workflow tools in the parent and for every tool call a subagent
makes, and a hook may deny. Whether a deny on the Workflow call stops the
whole workflow is not documented. The operator's arithmetic is the defect:
a guideline of five at the top, then three adversarial reviewers per item
and three refuters per reviewer, is 5 + 15 + 45 before any repair loop —
the guideline bounds one level of a tree.

WO-139 makes the cap a DotLn rule rather than a harness setting. The harness
host already classifies Agent, Task, Workflow and Codex's `spawn_agent` as
`spawn` and admits them as reads; it will count admitted spawns per root
session against `subagentCap` in `docs/control/budgets.json` (default 20,
operator-configurable), refuse the spawn that would exceed it with a message
naming the count and the cap, and count the tool calls of subagents it can
attribute to the same root session, so that agents a workflow script spawns
are bounded at their first tool call when the hook input identifies them.
What the hook input carries for a subagent is unobserved and is the order's
first row; the cap is exact for what the hook sees and reported as partial
where it cannot see. The batching rule the operator asks for is role text
in the Contributor build: a fan-out is planned against the cap, so review
and refutation batches are sized to the remaining budget — one reviewer
judges several items, and adversarial and refutation passes run as batches
over item groups rather than one agent per item per pass — and the plan is
stated before the first spawn. For Codex, `spawn_agent` fires no hook, so
the cap there is the same role text without a refusal; the order says so.

## 12. The platform lesson, applied

The operator's late message points at Steve Yegge's 2011 account of the
Amazon service mandate: every team exposes its data and function only
through interfaces, the interfaces are designed to be usable from outside
from the first day, and the company eats its own product before anyone else
does; a product without a platform is replaced by the same product with one.
Product 07 already carries the operator's one-sentence platform-first
standard, which the refuter prompt reads verbatim, and this pass does not
edit that sentence. It applies the lesson as four checks on the plan above.

- **Every capability arrives as an interface something else consumes.** The
  source-change primitive is a `WorkOrderTransport` profile and a host with
  typed events, not a script; the local model joins through the same port
  (WO-110) and the same catalog; the resident's human decision is a durable
  handoff packet with `dotln handoff answer`, not a chat; `dotln status
  --json` is the projection the console (WO-114, WO-115's parity contract)
  renders rather than a second source. WO-115 is the mandate's own
  sentence — every terminal command is a console command — and it stays,
  behind the contracts it renders.
- **Dogfood before export.** This repository runs on its own harness; the
  next real consumer is the operator's own repository (M7), and only after
  that the starter export (section 3, M7 and M8). The order of the tranche
  in section 4 follows from the lesson, not only from the dependency graph.
- **Externalizable by construction.** The target bundle imports the
  launchpad's content-addressed snapshot by absolute path and refuses to
  modify a tracked file (WO-049); the actor catalog admits kinds by a
  declared contract (WO-122); a research order's probe lives beside the
  product's probes and is promoted through an order. The one place the
  lesson finds a private interface is the sandbox-off question: a mode that
  is safe only because of a personal setting is not a platform mode, which
  is why section 6 insists the guarantees be stated by the matrix and
  carried by the compiled build.
- **Accessibility as a first requirement.** The failure artifact of a guided
  order and the outcome class of a research order exist so that a stranger
  to the session, including the operator a week later, can use the result;
  the receipts that need reverse-engineering are the accessibility failure
  the brief names.

Decision 10 in section 13 records the durable statement; the reopening
observation is a capability that lands without an interface another actor
or projection consumes.

## 13. Decisions of this pass

Each names its sources and the observation that reopens it; goal and
critical-path contribution, the NoOp baseline and the trap lenses are stated
where material and grouped where not.

1. **The ladder in section 3 is the plan's spine, and the delivery lane is
   WO-053 → WO-054 → WO-055 → WO-056 → WO-069 → WO-071 → WO-063 → WO-064,
   then the operator's own repository at R2.** Mission contribution: every
   step makes an existing claim true in a real session, the critical path's
   own prioritization rule. NoOp: the sequence keeps the console before the
   contracts it renders and the starter before a real target, and nothing
   the operator can use arrives before pair 11. Traps: seeking the wrong
   goal (a fixture count is not a milestone; each rung is a live
   demonstration), success to the successful (the starter's investment does
   not buy it a place before the real-repository run), drift (level claims
   stay where the evidence puts them). Reopen: a live proof that fails on a
   claim a fixture supported, or R2.
2. **The second lane is a research and machinery lane, and its orders are
   evidence-only where possible.** Sources: the operator's message 3, the
   final-review durations, the brief's lane proposal. NoOp: two source
   lanes keep paying a retime and a merged gate at every second final
   review. Traps: commons (two operator-assisted orders never share a pair;
   inference never overlaps a gate), escalation (no new process; the pairs
   are cut by surface), shifting the burden (WO-079 executes the checklist
   the operator has been remembering). Reopen: a research order that turns
   out to need a source change, or a third lane.
3. **WO-135 is rewritten: capability write-backs are execution updates.** An
   appended dated section for an order in the judged sequence — addition or
   reassessment, new id or known — is admitted by the continuation check;
   the level claim is judged by verification, final review and the next
   receipt, never by a planning dispatch after a final review. The order
   also adds the topology check (every typed hard edge respected by the
   sequence; no hard edge inside a pair) to `plan check`, and a write-time
   refusal of non-document paths in a planning dispatch (register item 10).
   Sources: WO-068 and WO-052 FINAL-001 §B1, WO-052 D005, receipt 016's
   known issue, `plan-continuation.mjs`, the operator's message 4. NoOp: a
   third capability-introducing order (WO-053 reassesses a known id; WO-054
   introduces `runtime.independent-verification`'s real-worktree scope)
   pays the same dispatch. Traps: rule beating (an executor could write any
   row — but the row is judged twice before merge and once after, and the
   plan gate never judged rows, it judged plans), policy resistance (the
   narrower WO-135 form left the class in place and would have recurred
   whenever a criterion did not name the id, receipt 016's known issue).
   Reopen: a capability row on `main` that no verification or final review
   judged.
4. **WO-136, WO-137 and WO-138 are filed as research orders; WO-139 and
   WO-140 as machinery orders; WO-079 is rewritten as `worktree integrate`
   and moved to pair 6.** Each order records its own goal contribution, NoOp
   and traps in its text. Reopen: any of their reopening conditions.
5. **Product 07 gains "Research and guided-operator work orders" (section
   5) and its two-lane decision is amended with the evidence-only preference
   and the integrate command; product 03's authority candidate and product
   06's local-model candidate carry their dispositions; product 05's Context
   Continuity candidate is deferred with its reopening condition.**
6. **The sandbox-off question is not decided here.** Section 6 is the
   assessment; the decision follows WO-136's matrix at R2. Until then the
   current mode stands and any order or document that describes an
   unconfined mode labels it trusted, not confined. Reopen: the matrix.
7. **Local models: readiness before transport before qualification.** WO-137
   answers whether the current LM Studio build serves noninteractive calls
   with cancel, timeout and structured output; WO-110 is written from that
   row; WO-138 qualifies roles one at a time on representative DotLn tasks
   with independently checked outputs. No model download, launch or setting
   is authorized by this pass. Reopen: a readiness failure artifact, or a
   pilot result that contradicts the catalog's role assignment.
8. **The follow-up register: this pass disposes the entries in section 7
   and leaves the migration and decision-record rows under the settlement
   candidate**, whose threshold is raised to 400 pending because the
   collector still harvests every decision record. Reopen: 400 pending or a
   pass with the session to spend.
9. **R2 stays mandatory after WO-053 and WO-111** and now also decides: the
   mode each harness may run in (WO-136), the first order for the operator's
   own repository (WO-064's evidence), and the documentation-reset waiver.
10. **A capability lands as an interface something else consumes.** Product
    07 §Goal-aligned decisions gains a platform lens paragraph with the four
    checks of section 12; the refuter's platform-first sentence is unchanged.
    Source: the operator's message 11 and the cited essay. Reopen: a capability
    that lands without a consuming interface, projection or actor.
11. **The cold-start ceilings have one normal route.** A reviewed rule that
    breaches a role's cold-start ceiling raises it in the same change by one
    4 KB step above the measured bytes with the rule named, or records a dated
    acceptance in the budgets file; never trimmed around, never left advisory
    across orders. The two live breaches are accepted today (section 10).
    Source: the operator's message 12, WO-044's decision record, the meter.
    Reopen: a breach left unrecorded after this pass.

## 14. Declined alternatives — the NoOp register of this pass

1. _Adopt the brief's items as orders one for one._ Declined: sections 3,
   5 and 6 are documents; five orders carry the parts with a measured or
   operator-reported cost. Reverse: none.
2. _Serialize to one lane._ Declined: the parallel gain is a whole
   implementation and verification (0.8 to 2.3 hours) against a median
   integration cost of about seven minutes plus the checklist; the fix is to
   execute the checklist and to pair by surface. Reverse: an integration
   after WO-079 that still exceeds the non-integrating median by more than
   fifteen minutes.
3. _Keep WO-135's narrower criteria-text rule._ Declined: it leaves the
   class of post-final-review planning dispatch in place (receipt 016's
   known issue). Reverse: a capability row merged without a judged level.
4. _Change Claude or Codex settings now (sandbox off, smaller deny list)._
   Declined: no enforcement-boundary evidence beyond WO-044; the candidate's
   own requirement is adversarial tests first. Reverse: WO-136's matrix.
5. _A DotLn tool-execution proxy ("hands" topology) for Codex now._
   Declined: it is the largest possible answer to a question WO-136 has not
   asked yet. Reverse: a matrix row showing Codex has no pre-effect
   enforcement for a limit the resident's unattended work needs.
6. _A new work-order kind, field or lifecycle transition for research._
   Declined: the lifecycle, evidence directories and labels suffice; the
   outcome class lives in the execution record. Reverse: an index consumer
   that needs the outcome typed.
7. _Live local-model evaluation inside `npm test`._ Declined: nondeterministic
   and costly; the gate bands are evidence. Reverse: none.
8. _Download or choose models in this pass; a universal leaderboard._
   Declined: readiness is unknown; the pilot chooses cells. Reverse: none.
9. _The starter/export tranche before the real-repository run._ Declined:
   portability is not the next useful operator experience. Reverse: an
   operator direction to run DotLn from a fork first.
10. _The console (WO-114 to WO-117) before M3._ Declined: two typed hard
    edges point the other way. Reverse: none.
11. _A scheduler, lane generator or topology solver._ Declined: a 40-line
    check over typed edges suffices and enters WO-135. Reverse: a third lane.
12. _Cap subagents by a harness setting alone._ Declined: none exists for
    the total; the guideline is advisory. Reverse: a documented hard total
    cap in the harness.
13. _Refuse the Workflow tool entirely._ Declined: the operator uses it; the
    cap and the batching rule keep it. Reverse: a session that exceeds the
    cap through a path the hook cannot see, twice.
14. _Make the sandbox mandatory for every worker (the opposite over-reach)._
    Declined: the brief and the product 03 candidate both reject it, and
    the matrix may show tool-level prevention suffices for some limits.
15. _Reorganize the host, scripts, tests or evidence; shrink receipts now._
    Declined again on R1's reasons; the receipt-size candidate has a
    threshold. Reverse: a product order that must change the host's
    structure; 30 MB of receipts.
16. _An order for the usage readback alone._ Declined: the attestation half
    is fixed and measured; the counter half is one criterion in WO-140.
    Reverse: a receipt after WO-140 with neither counters nor a cause code.
17. _Dispose the 45 decision-record rows individually._ Declined: they are
    records, not actions; the settlement candidate changes the collector.
18. _File the Gate H order (the operator's own repository) now._ Declined:
    its evidence (WO-064) and authority profile (WO-071) do not exist;
    R2 files it. Reverse: an operator direction to run the source-change
    primitive on a kept repository before verification exists.

## 15. Reversal conditions for this plan

Reopen at a planning pass when: WO-053's live episode fails a claim WO-052's
fixtures supported; WO-136's matrix shows a limit the resident's unattended
work needs with no pre-effect enforcement on either harness; WO-137 returns a
failure artifact (then WO-110 and WO-138 wait, and the operator decides
whether local inference stays on the horizon); an integration after WO-079
still costs more than the non-integrating median by fifteen minutes; a
session exceeds the subagent cap through a path the hook cannot see; a
capability row reaches `main` without a judged level; a research order
closes `negative` and a later order cites it as a capability; or R2.

## 16. Evidence of this pass

Entry process cost: 124,346 total tokens (source
`claude-transcript-message-usage`, scope dispatch; USD unknown). The pass
ran no code suite; one background documentation lookup (Claude Code's
workflow, hooks, settings and sandboxing pages); the sequence check script
in the session's scratch directory, whose rule enters WO-135; `npm run
test:docs` at the end; two background goal reviews of the draft, the second
on the reviewed text and recorded under `docs/planning/refutations/` as the
pass's receipt. The follow-up feed's first page was read;
the dispositions of section 7 are applied to the register in this pass.
Handoff process cost is reported in the response.

## 17. The review of the draft, and what changed

The operator pasted a third-party review of the pull request at `c347362`
(message 13 of the capture, SHA-256
`aab1ebea10004c8e82f6ec2538ddd7ddc6b774e270f6b0f9301eb3e76d1b0b51`). It
scored the pass 7.5 of 10, endorsed the research convention, the local-model
path, the recut sequence and the authority experiment, and asked for a
bounded amendment before merge. Each of its factual claims was checked
against the repository before any change.

**Verified true.** Section 9 described the retired WO-129 to WO-131 suite
cache and replica execution as current; WO-132 criterion 4 deleted them and
the runner is fresh on every invocation (section 9 is rewritten above, and
the ledger records the error). `findGateCheck` matches an `npm test` row by
code identity alone, so a sandbox-subset run recorded under that identity
would be consumed as a complete gate. WO-139's guarantee was overstated by
its title and Cost line. WO-110's typed block did not reference WO-137, and a
hard edge is satisfied by any close. WO-138 let the packet propose its own
floor. The corrections an earlier background review of the draft had
recorded were outside the orders. The operating-mode decision waited for
R2 without a reason to.

**Verified false.** The sequence file's pairs are intact: `git show
c347362:docs/planning/sequence.md` parses as fourteen two-entry groups and
one serial run; the rendered list on the pull request hides group
boundaries. No separator is changed; WO-135 gains a fixture that pins the
parse so the ambiguity cannot recur.

**What changed in the draft**, inside the orders themselves so the executor
reads one contract (an earlier background review of the draft had recorded
several of these as known issues; the branch was unmerged, so the orders
were corrected and the final text is what the pass's receipt judges):

1. WO-140: an `--inside-sandbox` run records the distinct identity
   `npm test -- --inside-sandbox` with its exclusions and is rejected by
   every consumer of product-gate evidence, with a regression fixture; the
   Cost line and observed gap no longer misstate WO-121 VER-001; the
   declaration keys on an environmental cause; a recognized marker is
   validated by a denied-write probe; the outside-first rule applies to
   attended sessions; the citation names the runner and `gate-evidence.mjs`
   instead of the deleted helper.
2. WO-139 is retitled an admission cap. It states per harness and spawn
   path whether admission happens before creation, at the first attributable
   tool call, or not at all; an unreadable or missing counter admits with an
   advisory; the total-cap requirement stays open as a candidate in product
   07 with its reopening observation; the refusal count is taken at landing.
3. WO-110 proceeds against doubles and records the live smoke as a `ready`
   row or an `unavailable` row without claiming qualification (its criterion
   2 already allows this); WO-137 is a reference-only typed input. WO-138
   activates only on a `ready` WO-137 outcome, stated in its preflight and
   its first criterion; its role floors are pre-registered in the order
   before any trial, and the operator time for the T2 ranking is budgeted.
4. WO-136 budgets the operator session (duration and approvals) and its
   packet proposes, per harness, the smallest supported mode the cells
   support with its guarantees, the minimal Claude allow/deny list for that
   mode as a table (not applied), and the mediation implementation or next
   experiment required; the planning checkpoint after WO-136's close decides
   and allocates, and R2 confirms. Product 03's candidate says the same.
5. WO-135 (c) refuses writes inside the repository outside `docs/` and root
   Markdown, admits paths outside the repository root, and its write-backs
   update every place that counts the hook's hard refusals; criterion 3 gains
   the pair-parse fixture.

**Decisions 12 to 16.** (12) Reuse exists at one grain, the whole gate at
one code identity; no document claims reuse below it (reopen: a claim of
suite-level reuse). (13) A partial run never satisfies a gate consumer
(reopen: a partial row consumed as a gate). (14) The cap is enforced where
admission precedes creation and reported where it does not; the total cap
is an open requirement (reopen: a documented pre-creation admission hook).
(15) Outcome-dependent activation is stated in the dependent order's
preflight and first criterion because the typed graph expresses closes, not
outcomes; the "outcome typed" reopening condition of section 5 is now
observed and stays a candidate for the index (reopen: an activation that
ignores such a preflight). (16) The operating mode is decided at the
checkpoint after WO-136's close, with the minimal configuration owned by
WO-136's packet (reopen: WO-136 closing without that decision in the next
pass).

**Declined.** A broad replan (the review asked for a bounded amendment); a
research kind or outcome field in the index now (the preflight sentence and
the first criterion carry it; the candidate stays); a pre-creation spawn hook
the harness does not document; deciding the operating mode from this pass's
table (the matrix does not exist).

**Availability, restated with the corrections.** On merge, the convention
and the allocated experiments. Pair 2, WO-053: the first live external
source change. Pair 3, WO-137: a readiness result or a bounded failure
artifact. Pair 5, WO-056 and WO-110: live verification and repair, the local
inspection transport against doubles with a live or unavailable row. After
WO-136's close: the operating-mode decision. Pair 7, WO-138 only on a
`ready` WO-137: measured local roles. Pair 10, WO-111 and WO-064: the
unattended hour and target publication. R2: the first guided run on the
operator's own repository. Pair 14, WO-117: the live console. None of these
qualifies a local model for source writing or independent verification.

