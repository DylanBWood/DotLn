# WO-118 — The resident-owned loop from a starter instance: one initial intent and standing grants carry work through derivation, dispatch, verification, repair, delivery and the pull-request loop under the durable runtime, surviving an actor's death and a resident restart, with only material decisions returned to the operator (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** the actual local harnesses as actors, launched by the instance's
resident; the operator witnesses from outside the sandbox; launch claims
recorded per episode (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The product exit's composition inside a
starter instance plus its evidence record; a defect found in a primitive is
a separate bounded order. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 1: the product proof did not require the resident or
the starter to run the loop), preserved verbatim in the ignored capture
`docs/intake/notes/2026-09-08-codex-planning-review.md`, whose hash is in
the ledger section of that date; the operator's direction that the always-on
runtime is the critical path. Planner-synthesized draft. Opaque identifier,
not a priority. Clean-room screen: the instance and target are scratch
artifacts.
**Depends on:** WO-075 and WO-076 merged (a starter instance with the build
and its overlay); WO-121 and WO-122 merged (presence with origin; the
`cli-worker` and `human-handoff` actors); WO-100 merged (derivation inside a
portfolio); WO-120 merged (derived work as durable records); WO-124 merged
(surfaces derived from the contract); WO-112 merged (the loop proven from
core first); WO-111 merged (the unattended hour); WO-066 merged (the
pull-request loop with dispositions); WO-114 and WO-117 merged (the run is
visible through the interfaces); WO-123 merged (the resident admits a filed
intent under standing authorization and owns the vertical continuation).
**Recommended placement:** the product exit; the third replan checkpoint
follows its receipt together with WO-112's. It adds `docs/evidence/WO-118/`
and any composition the instance needs that core lacks, which is then a
core order. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "a starter instance with the build"
  },
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance's overlay"
  },
  {
    "workOrderId": "WO-121",
    "relation": "hard",
    "reason": "presence with origin"
  },
  {
    "workOrderId": "WO-122",
    "relation": "hard",
    "reason": "the cli-worker and human-handoff actors"
  },
  {
    "workOrderId": "WO-100",
    "relation": "hard",
    "reason": "derivation inside a portfolio"
  },
  {
    "workOrderId": "WO-120",
    "relation": "hard",
    "reason": "derived work as durable records"
  },
  {
    "workOrderId": "WO-124",
    "relation": "hard",
    "reason": "surfaces derived from the contract"
  },
  {
    "workOrderId": "WO-112",
    "relation": "hard",
    "reason": "the loop proven from core first"
  },
  {
    "workOrderId": "WO-111",
    "relation": "hard",
    "reason": "the unattended hour"
  },
  {
    "workOrderId": "WO-066",
    "relation": "hard",
    "reason": "the pull-request loop with dispositions"
  },
  {
    "workOrderId": "WO-114",
    "relation": "hard",
    "reason": "the run is visible in the status projection"
  },
  {
    "workOrderId": "WO-117",
    "relation": "hard",
    "reason": "the run is visible in the live console"
  },
  {
    "workOrderId": "WO-123",
    "relation": "hard",
    "reason": "the resident admits a filed intent under standing authorization and owns the vertical continuation"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story and
§What DotLn is not (the reference implementation is not finished when it
works for its author); 12-workstream-application.md §One outcome from
request to return and §Replacing a successful but costly workflow;
03-architecture.md §Platform and instance boundary and §Operator-presence
policy; the orders named in Depends on.

**Objective:** Export a starter instance into a scratch directory, register
a scratch target repository with a scratch issue, declare a portfolio and
the standing grants, start the instance's resident, file one intent, and
witness the runtime carry the work without further prompting: the intent
admitted by the resident under the portfolio's `intent` class and the
standing grants (WO-123); the intent interpreted into a contract (WO-061)
and surfaces (WO-124); a durable derived order (WO-120); an actor
dispatched (WO-122) into a governed
worktree (WO-052); result persisted; independent verification and one
repair (WO-054, WO-055); delivery under the grant (WO-064); the
pull-request loop through a delayed automated comment to a terminal state
(WO-065, WO-066); an actor session killed mid-episode and replaced by the
resident; the resident itself restarted mid-loop and resuming under the
same identities; every phase handoff performed by the runtime; the whole
run visible in the live console (WO-117) and audited (WO-116); one
deliberately ambiguous control intent returning `NeedsHuman` with its
reason, and nothing else returning to the operator.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The first revision's loop proof (WO-112) ran from core's own control
  plane with operator-reviewed surfaces and no dependency on the resident;
  the fork's run (WO-083) used sessions opened from handoffs. Neither could
  establish unattended operation through the product runtime from a starter.

**Design (scope discipline):**

- Nothing new is built here; the order composes and witnesses. If the
  instance needs a command core lacks, that command is a core order filed
  before this one runs again.
- The two control scenarios (the ambiguous intent; a review comment that
  is wrong and must be rejected with evidence) are part of the same run so
  that escalation is proven legitimate rather than assumed.
- **Declined alternatives, recorded:** a staged manual demonstration as the
  exit (evidence, never the replacement claim); the operator's real target
  (that is the fork's run, WO-083).

**Deliverables:** the instance export receipt; `docs/evidence/WO-118/README.md`
with the sanitized event log, the console transcript, the measures and the
parity checklist; the write-backs below.

**Acceptance criteria (all required)**

1. From the filed intent to the terminal state, the control log shows every
   phase transition performed by the resident's actors, with the only
   human events being the initial intent, the two control-scenario answers,
   and the witness line; the representative scenario reaches its terminal
   state with every automated item resolved and no `NeedsHuman`.
2. The killed actor session is replaced by the resident without a second
   commit, and the resident restart resumes the loop under the same order
   and episode identities; both are events in the log.
3. The delivered pull request exists with a generated body, the delayed
   comment is dispositioned and re-observed as resolved, the incorrect
   suggestion is rejected with recorded evidence, and no DotLn file, path
   or vocabulary reached the target.
4. The live console shows the run's actors, phases, holds and order status
   during the run and the audit view reproduces it afterward, recorded as a
   transcript.
5. Every claim is labeled `observed`, `launch-claim` or `unknown`; the
   measures are recorded with methods; the parity checklist is scored, and
   the replacement claim is made only if every representative item is
   observed-met.
6. Write-backs land: 00 (the one-paragraph story's status sentence), 12
   (the replacement table), README "What runs today", the capability table
   (`runtime.resident` and `vertical.source-to-pr` at the instance-evidenced
   level), ledger entry; the third replan checkpoint is answered.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the receipt; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the operator's repositories (WO-083 is the fork's run);
cross-repository workstreams; any runtime fix (a separate order).

**Operator-review assumptions**

1. A run that fails records its receipt under this order's evidence and
   does not close the order; dependents wait for an observed success.
2. The operator witnesses from outside the sandbox.
