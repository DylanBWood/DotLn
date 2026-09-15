# WO-132 — Machinery stand-down: transitions stop gating, one product gate runs once per order by code identity, release close only publishes, and versions, effort and tools are logged, never refused (v0.18.0)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes); nothing in this order or the
lifecycle it changes requires a particular one.
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** minor. The lifecycle evidence contract, the tag
manifest's evidence rows, the writer-isolation feedback unit, the permissions
guard, the attestation grammar, the runner inventory and the refutation gate
change; the compiled Contributor bundle and both harnesses' skills
regenerate. No kernel change. Assigned at activation under the standing
opt-out default.
**Cost:** adds nothing recurring: no new check, receipt, hook, key or
ritual. Removes, per order, every gate run that a lifecycle transition
demanded (on 2026-09-15 the operator's host ran eight full gates of 633,
634, 648, 644, 570, 67, 71 and 605 s, six of them cold with 78–82 fresh
tasks; WO-044's close alone paid five, about 52 minutes) and the fresh gate,
`npm ci` and CLI smoke row at release close (605 s, 82 fresh, 0 reused at
v0.17.7); removes the replica copies, kernel-denial probes, per-task
expansion and the isolated 135 s runner suite from the default gate, whose
estimated fresh wall-clock with only product and lifecycle suites is about
250 s against 605 s today; removes the effort, version and readback
refusals and their dated-amendment round trips, the main-branch shell
refusals that cost the v0.17.6 close two override episodes and this pass's
opening, and the refutation loop that cost the 2026-09-12 pass three holds
at 2,454, 833 and 333 s and the 2026-09-13 refresh a fourth at 755 s.
Context bytes and tokens per session fall by the refusal reads and the
report-edit/gate loop; commands per order fall by the override round trips.
No reduction is claimed for the product suites themselves.
**Nomination provenance:** the operator's 2026-09-15 planning dispatch and
its three follow-up messages, captured verbatim in ignored intake (SHA-256
`19061ea60115a416bc536e4eae66faffc5549dfd9a33841d886bd51dffd8350f`),
directing that the machinery stop, that versions and effort be logged at
most, that release close be the post-merge publish it was meant to be, and
that the refuter judge goal alignment and system traps instead of
constructed counterexamples; the pasted release-close analysis in that
capture; WO-044-D016's three coupled reuse items and the WO-044 cost
finding; WO-131's engineering review (R6, R7, R8); FINAL-001 of WO-044 item
1; the guide's candidates for the refutation pass's cost and the cold-gate
cuts; and the six background diagnoses of this pass, each refused its
handback by the permissions hook. Planner-synthesized draft; the diagnosis
is [the planning document](../planning/machinery-stand-down-2026-09-15.md).
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** nothing blocking. WO-044 closed at `v0.17.7` is the base;
WO-126, WO-128 to WO-131 and WO-044 are the orders whose machinery this one
removes or demotes, referenced for their evidence.
**Recommended placement:** first, alone, before any other activation; the
operator's explicit direction. It edits the lifecycle scripts, the gate and
suite evidence libraries, the runner, the release and worktree helpers, the
skeleton harness host and command classifier, the compiler's feedback unit
and harness template, the worker transport, the plan-refutation protocol
and gate, the generated bundle, and the product documents named below. A
recommendation, not a dependency token.

**Operator exemption (2026-09-15):** this order holds more than one
capability boundary and may exceed the four-hour implementation span. The
operator directed one order because the machinery is one system, the cost
model of the lifecycle, and each additional order would pay that cost model
in full before the fix landed (the 2026-09-12 pass filed four and paid four
lifecycles). The exemption is this order's own; it sets no precedent.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-044",
    "relation": "satisfied-by-close",
    "reason": "the base: release-close repairs, derived-worktree settlement, egress-first close and the fail-only evidence path this order keeps"
  },
  {
    "workOrderId": "WO-126",
    "relation": "reference-only",
    "reason": "the lifecycle evidence contract and exact-tree key this order replaces"
  },
  {
    "workOrderId": "WO-131",
    "relation": "reference-only",
    "reason": "the replica execution, declared-input reuse and engineering review this order retires or cites"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** [the planning diagnosis](../planning/machinery-stand-down-2026-09-15.md)
(all sections); 07-execution-guide.md §Goal-aligned decisions, §Operator
resume phrases, §Workflow closeout and releases, §Operator-opened planning
pass, §Discipline (process budget; write once, run once; gate execution and
reuse; isolation; machinery stand-down), §Model-specific notes;
`scripts/lib/lifecycle-evidence.mjs`; `packages/skeleton/src/gate-evidence.mjs`
(`gateTreeHash`, `findGateCheck`, `lifecycleRequiredChecks`);
`scripts/test-runner.mjs` (`suites`, `expandSuiteTasks`, `aggregateSuiteRows`,
the load classes); `scripts/lib/suite-evidence.mjs`, `suite-replica.mjs`,
`suite-sandbox.mjs`; `scripts/resume.mjs` (the `Effort:` grammar and the
attestation checks at 442–564); `packages/skeleton/src/worker-transport.ts`
(`MINIMUM_CLI_VERSIONS`, effort selection);
`packages/skeleton/src/harness-host.ts` (`writerIsolationFacts`,
`metadataCommand`, `managedReleaseCommand`, `permissionEffect`,
`runHarnessEvidence`, the adapter-unavailable fallback);
`packages/skeleton/src/harness-command.ts` (`harnessToolEffects`, the
`HarnessCommandRefused` sites); `packages/compiler/src/feedback.ts` (the
writer-isolation predicate); `packages/compiler/src/harness.ts` (the hook
template and fallback); `packages/skeleton/src/loadouts/contributor.ts`,
`loadouts/feedback.ts`; `scripts/release.mjs` (`close`, `runEvidence`,
`updateMainAndFinish`, `checkSurfaces`); `scripts/worktree.mjs` (`finish`,
`settle`); `scripts/refute-plan.mjs`, `scripts/lib/plan-direct.mjs`,
`packages/skeleton/src/plan-refutation-protocol.ts`,
`docs/planning/refutations/README.md`; `docs/evidence/WO-044/decisions.md`
(D014, D016); `docs/evidence/WO-131/engineering-review.md`;
`docs/evidence/WO-128/decisions.md` (D010); `docs/AI-HARNESS-SECURITY.md`;
`docs/PLAYBOOK.md` §The loop, per work order.

**Objective:** A work order's lifecycle records its transitions the moment
their reports exist, runs one product gate once, at final review, keyed by
the code it tests, and publishes its release from merged main with one
command that runs no suite. Attested harness, version, model and effort are
recorded as given and never refuse. A session on main can plan, publish,
build and bootstrap under its writer reservation. DotLn's hooks refuse a
second writer and a write during the live gate, and delegate everything else
to the host's own permission prompt on both harnesses. The default gate
contains the suites that protect product and lifecycle behavior, each naming
what it protects, and finishes in under six minutes fresh; the machinery's
own suites run on demand. The planning refuter judges goal alignment, system
traps, constraint removal and antifragility, and a constructible
counterexample is a known issue, not a hold.

**Observed gap (dated 2026-09-15, `main` at `a65d527`, from the planning
diagnosis §1–§3):**

- Every lifecycle transition requires an `npm run test:full` row at the exact
  whole-tree hash, which includes `docs/`, the control log and untracked
  files; the transition itself rewrites the control log, so every stage
  boundary misses by construction. Per-suite keys beneath that aggregate
  cannot prevent the miss. Observed: identical tree 10 fresh of 78; docs-only
  same session 17 of 79; a different session 78 of 82, 79 of 79, 78 of 78.
- The canonical fresh gate was 476 s at WO-126's close and 570–648 s on
  2026-09-15 with 82 tasks after 780–881 s under WO-130/131 replicas. Three of
  the four longest suite numbers (console 442 s, release 263 s,
  plan-refutation 240 s) are spans between split tasks, not work; the heavy
  tasks are harness fixtures 145 s, process debt 143 s, runner fixtures 135 s
  (isolated, no peer for 22 % of the wall-clock) and plan-refutation fixtures
  69 s, all gate machinery. Product packages are 94 s of task time. The gate
  is lane-saturated (about 2,300 lane-seconds over four lanes), so wall-clock
  falls only by removing work or reservations. Estimated fresh wall-clock
  with product and lifecycle suites only: about 250 s (230–270).
- WO-128 D010 recorded exclusive scheduling at 462 s against 666 s shared
  and kept the slower configuration.
- `scripts/resume.mjs` refuses an attested effort below the order's line,
  an effort without a recorded selector or readback, and the worker transport
  refuses CLI versions below 2.1.270 / 0.154.0 and unrecorded effort pairs.
  `ultra` and `ultra code` match no label. No DotLn hook path emits `ask`; a
  hook `deny` pre-empts the host prompt, so the operator's global
  `allowUnsandboxedCommands` change never reaches a DotLn-refused command.
  Five of six recorded refusals this week were the classifier's unlisted
  tool names; `SubagentHandback` and `SendMessage` were refused live in this
  pass.
- The writer-isolation predicate refuses every writable request whose branch
  is `main`; only an exact metadata list, the managed usage command and the
  release helper with a recorded session intent pass. A session on main
  cannot build, bootstrap, list history or run the close helper when its
  intent was not recorded (WO-130's retry), and the v0.17.6 close cost two
  override episodes and a hand-cleared blocker.
- Release close runs `updateMainAndFinish` (teardown), then `runEvidence`
  demands `npm run test:full`, the CLI smoke row and `git status` at the exact
  merge tree, installing and building when missing; the merge tree equals the
  reviewed tree only when the reviewer's own record commit did not follow the
  gate, which it always does. v0.17.7 ran 605 s fresh, 0 of 82 reused.
- Receipts 009–012 held on constructed counterexamples at 2,454, 833, 333 and
  755 s against a 120 s budget; two were overridden; receipt 012 re-raised the
  overridden hold and amendment 13 re-imported it, producing a design that
  failed VER-001 and was removed by D019. Since 2026-09-08, 13 of 14 merges
  after WO-042 changed machinery, none the kernel.

**Design (scope discipline):**

- One wholesale change, at the lifecycle evidence identity: transitions
  never look up gate evidence; the product gate is keyed by code identity and
  consumed by the pull request, the manifest and the close. Everything else
  is a removal, a demotion from refusal to log, or a data edit, each named
  in a criterion with its file.
- Removal precedes replacement: the replica and reuse machinery leaves the
  default path entirely rather than becoming an opt-in flag, and its suites
  leave with it; a suite that protects product or lifecycle behavior is never
  deleted by this order, only classified.
- Every hook refusal that is not one of the two kept invariants becomes a
  delegation to the host with an advisory line and a journal row, on both
  harnesses; Codex, which fires no hooks, receives the same two invariants as
  role text and the same commands.
- Cross-session claims are established by a second process from a different
  shell; a same-session proxy establishes nothing (WO-131 R7).
- **Declined alternatives, recorded in the planning diagnosis §7:** a
  wholesale revert of v0.17.2–v0.17.7; turning off every test; the key
  repair alone; one order per fix; opt-in replica reuse; classifying
  read-only shell for the writer guard; a detached release worktree; an
  operator-only release close; process cost as a completion requirement; a
  hold budget alone.

**Deliverables:** the lifecycle, gate-evidence, runner and suite-evidence
changes; the release and worktree helper split; the attestation and
transport changes; the feedback unit, permissions guard, command classifier
and hook template changes with the regenerated bundle and manifest; the
refutation protocol and gate changes; the suite classification with its
`protects:` lines; the before/after gate rows; the write-backs and the
decisions file below.

**Acceptance criteria (all required)**

1. `implementation-ready`, `repair-complete`, `verification-result` and
   `final-review-result` append their event after running `git diff --check`
   inline and validating the attestation's presence; a missing gate row,
   missing session authorship, unread outputs, missing usage counters, a
   stale projection and a pending planning handoff are advisory lines in the
   command output, never refusals. An illegal phase transition still refuses.
   Fixture: each completion succeeds at a tree with no recorded check and no
   harness session state; the illegal case still refuses.
2. `npm test` is the product gate and its success row is keyed by code
   identity: a hash over tracked, non-generated content outside `docs/`,
   `docs/control/`, `.claude/`, `.agents/` and the evidence and control
   projections, recorded with the exact tree hash beside it. A report, a
   control event, an index regeneration, release preparation, a pull-request
   body or a release note never changes the key. `worktree publish` records
   that row in the pull-request body; the tag manifest cites it with both the
   reviewed tree and the merge tree; the release close consumes it and runs
   no suite. Fixture: a docs-only edit after the gate leaves the key equal;
   a source edit changes it.
3. The reviewer runs `npm test` once, at final review, after its last source
   byte; the executor and verifier run it when they judge it useful, never
   as a precondition of a transition. The release fixture exercises one
   full lifecycle (activate, implementation-ready, verify, verification-result
   pass, final review, final-review-result pass, publish, merge, close) with
   exactly one gate run and zero refusals, with reports edited after the
   gate; the next real order's control segment records one gate run.
4. Replica execution, declared-input keys, the shared success cache under the
   Git common directory, the kernel-denial probe and per-task expansion leave
   the runner: `scripts/lib/suite-replica.mjs`, `suite-sandbox.mjs` and the
   declared-input, replica and cache parts of `suite-evidence.mjs` are deleted
   with their tests; `gate-evidence.mjs` keeps the code-identity `npm test`
   row and the exact-tree `git diff --check` row only. Suites run against the
   working tree, one task per suite except the release cases. The scheduler
   keeps load-derived deadlines and per-task peers (WO-128) and restores the
   scheduling configuration that measured faster (D010: exclusive 462 s
   against shared 666 s); any later scheduling change carries a same-source
   before/after row.
5. Every suite in `npm test` carries a one-line `protects:` statement in its
   runner declaration naming the operator-visible product or lifecycle
   behavior it guards, printed by `npm test -- --list`. The machinery suites
   (harness fixtures, process debt, runner fixtures, plan-refutation
   fixtures, harness probe, the mutation self-test, the five evidence
   editions, harness, harness-context, harness-evidence, meta, fixture temp
   root) move to `npm run test:machinery`, which runs on demand and inside
   the reviewer's gate only when a file under their own declared sources
   changed since the base; document-sensitive live checks stay in
   `test:docs`. A suite that protected only removed machinery is deleted
   with it. No product suite is deleted; removal of a product test still
   goes through the mutation corpus.
6. `npm test` fresh on the operator's host completes under 360 s in three
   consecutive runs recorded in the evidence directory beside the 2026-09-15
   baseline (605 s, 82 tasks); the release cases run in at least two lanes
   or their serialization is justified by a recorded conflict.
7. Attestation is recorded as given: `--harness`, `--harness-version`,
   `--model`, `--effort` and `--source` are validated for presence only;
   `ultra` and `ultra code` are recorded as `xhigh` with `mode: subagents`
   and their raw spelling; `unknown` stays admitted; no effort-below-declared,
   readback, discovery-row or version-minimum refusal remains in
   `scripts/resume.mjs`, `packages/skeleton/src/worker-transport.ts` or the
   plan-refuter transport, which log a warning instead; Codex worker launches
   no longer disable multi-agent when the effort mode names subagents.
   `Effort:` lines are parsed leniently (`any` or a level, with or without
   `+`) and are recommendations; this order's own line is `any`. Fixture: a
   completion with an unrecorded version and effort `ultra` succeeds and the
   event carries the values verbatim.
8. Writer isolation is one registered writer per worktree on any branch: the
   `branch !== "main"` conjunct leaves `packages/compiler/src/feedback.ts`
   and the unit's regression fixture; `writerIsolationFacts` reserves on main
   exactly as on a work-order branch; the metadata allowlist remains the
   read-only path but is not required on main. Fixture: a session on main
   runs `npm run build`, `node scripts/bootstrap.mjs`, `git log` and the
   release helper under its reservation; a second live writer is refused; a
   dead holder is reclaimed.
9. DotLn's generated hooks refuse exactly two things: a second writer in the
   same worktree, and a write to gate inputs or the success record during the
   reviewer's live `npm test`. Unclassified tools, command shapes that need
   an adapter, outside-root reads, the adapter-unavailable fallback, the
   read-scope observer and the attribution pre-check return no decision to
   the host with a one-line advisory and a journal row, so Claude's
   permission mode and Codex's approval decide; the host deny list for
   publish, ssh, scp and sftp stays in settings. Both harnesses receive the
   same role text carrying the two invariants and the same commands; the
   manifest residue that only Codex needs is emitted into the shared
   instruction block. Fixture: `SubagentHandback`, `SendMessage`, a `for`
   loop and a `$(...)` substitution are delegated with an advisory; a second
   writer and a live-gate write are still refused.
10. `npm run release -- close WO-NNN --publish` from merged main proves
    egress first, fast-forwards main, runs the existing surface checks
    (README block, component bumps, notes profile, license pins), builds its
    own dist when `packages/skeleton/dist` is missing, validates the manifest
    citing the reviewer's `npm test` row with the reviewed tree and the merge
    tree, creates and pushes the annotated tag and creates the Release. It
    runs no suite, no `npm ci` and no CLI smoke row. Worktree finish and
    derived-worktree settlement run after publication as best effort and
    report blockers without failing the close; `--dry-run` previews the same
    steps and the manifest it would write. Fixture: the close completes with
    no gate row recorded on main; the recorded fixture time excluding network
    is under 120 s.
11. `planning: refute` is a goal review: the prompt carries the operator's
    platform-first standard verbatim from product 07 and asks four questions
    per new or changed order (the critical-path gate it unblocks and the
    NoOp cost in the records; the eight system traps applied to the order's
    own process cost; whether the Cost line names a removal larger than the
    addition; whether a failure of the mechanism degrades to the old behavior
    rather than refusing); the result carries per-order findings and a
    verdict of `aligned`, `aligned-with-findings` or `misaligned`. Only
    `misaligned` holds, and only on an observed failure (a recorded row,
    event or receipt) or a contradiction with vision text; a constructible
    counterexample is recorded as a known issue with a reopening observation.
    One judgment per pass; no re-judging after repairs unless observed
    evidence changed; the third-hold stop, the 120 s budget refusal and the
    structural cost hold are removed; a disposition or override binds the
    criterion text, so a later receipt cannot re-raise it. The plan check
    accepts any receipt whose holds carry a disposition. Fixture: a receipt
    holding on a hypothetical is refused as a hold and recorded as a known
    issue; the historical receipts keep their identities.
12. Cost lines are reconciled at closeout: `npm run meta` prints, per closed
    order, the promised removal beside the observed rows and marks a
    shortfall as a planning input; no gate, hook or command refuses on it.
    Process-cost measurement is recorded when available and `unknown`
    otherwise, never a completion requirement.
13. Write-backs land: product 07 (the resume-phrase table and steps 2–4, the
    closeout and releases section, the isolation and process-budget bullets,
    §Model-specific notes, the refutation section of the planning pass), the
    playbook's loop and release task, `docs/AI-HARNESS-SECURITY.md`, the
    refutation README, product 02 (the feedback unit version), product 08
    (the tag manifest evidence rows), the roadmap's release boundary; the
    decisions file `docs/evidence/WO-132/decisions.md` lists every removed
    mechanism with its source decision and reopening condition, names the
    revert commands for the rollback fallback, and records the before/after
    gate rows; the WO-126 to WO-131 evidence stays immutable with a dated
    migration note in `docs/verifications/README.md`. `npm test` green;
    `git diff --check` clean; no new dependency.
14. Rollback fallback: if this order is not implementation-ready within one
    executor session of eight hours, the executor stops, records the state,
    and the operator reverts the runner and evidence line (the WO-129, WO-130
    and WO-131 pull requests) instead; the decisions file names the exact
    commands before implementation begins.

**Evidence gate:** `npm test` once at final review; the three fresh rows of
criterion 6; the release fixture's one-gate lifecycle of criterion 3; the
fixture transcripts of criteria 1, 7, 8, 9, 10 and 11; the harness check
after regeneration.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** the egress and sandbox boundary of the host (the close still
needs a session with egress and `gh` authentication); the critical-path
orders (WO-049, WO-051, WO-068 are designed at the next pass from the
writing-worker record); deleting any product test; the mutation corpus; the
console runtime; a general recovery helper for corrupt lifecycle state
(the candidate in product 07 stays a candidate); a per-suite memo for
executor iteration (reopen per the planning diagnosis §7 item 5).

**Operator-review assumptions**

1. The reviewer's single `npm test` row is the release evidence; the tag
   manifest cites it with both trees, and the operator accepts a merge tree
   whose code identity equals the reviewed one as published from that
   evidence.
2. Losing same-session composition (67–71 s at an identical tree) is
   accepted in exchange for a fresh gate under six minutes that runs once.
3. `ultra` is recorded as a label with `mode: subagents` and no readback; the
   2026-09-02 rule that never converts a session label is superseded by this
   dated direction.
4. The two kept refusals are hard on Claude and role text on Codex, which
   fires no hooks; the operator accepts that asymmetry as a host fact.

## Execution record

2026-09-15: The operator explicitly removed criterion 14's eight-hour cutoff
and automatic fallback during `resume: next`: take the time and resources
necessary to finish. Its original planning text above remains the historical
subject; this execution amendment supersedes that stop condition. Optional
revert commands are recorded in WO-132-D001 and were not executed.

The actual next work order's one-gate control segment can only be observed
after that order runs. This order supplies the complete executable lifecycle
fixture and its current gate measurements; the future observation remains a
named reopening condition rather than invented evidence.
