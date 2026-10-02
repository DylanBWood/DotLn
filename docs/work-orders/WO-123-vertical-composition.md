# WO-123 — `dotln vertical` composition: the vertical continuation sequences the loop's primitives from a filed intent to a terminal pull-request state with each step's receipt, entered by the resident under standing authorization or by one command, proven with doubles (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. One continuation with two entries, one
admission decision, one portfolio class and one command, and a
path-identity refusal in the source-change and beacon guards; no new
primitive. Assigned at activation under the standing opt-out default.
**Cost:** adds the vertical continuation in the executable subset, in a
module of its own (`reactor.ts` gains at most its dispatch);
`admitIntent` and its two events, `IntentAdmitted` and `IntentHeld`, among
the resident's event types in `packages/skeleton/src/resident-state.ts`;
the `intent` portfolio class in `packages/skeleton/src/portfolio.ts` and
`scripts/lib/config.mjs`; the `dotln vertical <issue>` command in
`packages/skeleton/src/dotln.ts`; a refusal of variant-spelled paths
before any containment comparison in
`packages/skeleton/src/source-change-worktree.ts`,
`packages/skeleton/src/source-change-environment.ts` and
`packages/beacons/src/beacon-io.mjs`; the step that writes the delivery
preparation the readiness table reads; fixtures with doubles and a fake
clock; write-backs in products 07 and 03. Removes the
gap that no command and no resident path runs the loop end to end, and
the worktree, branch and registration a variant-spelled parent leaves
behind (register row FUP-8369f2b4284e70a8). It unblocks WO-112 and then
WO-118 (gate V of the critical path). Re-mints: `resident-state.ts`,
`portfolio.ts`, `source-change-worktree.ts` and
`source-change-environment.ts` are registered sources of every evidence
edition (`scripts/lib/evidence-sources.mjs`), so each edition they stale
is re-minted deterministically, and a new module a registered source
imports is registered there or excluded with a reason;
`resident-state.ts` and the two source-change files are also judged by
the feedback verifier (`FEEDBACK_SOURCE_PATHS` in
`packages/skeleton/src/feedback-audit.ts`), so the executor runs one live
feedback self-host episode on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, which needs no authorization and whose cost
is accepted; `beacon-io.mjs`, `dotln.ts` and `scripts/lib/config.mjs`
are in no edition. Wall-clock, tokens and context bytes are unknown until
run.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 10): the loop proof combined composition code with the
final live proof; and the first refutation receipt of this pass
([2026-09-08-critical-path-002](../planning/refutations/2026-09-08-critical-path-002.md),
hold on criterion 1): a command-only fixture could pass while WO-118's
one-intent resident run had no admission or scheduling path, so the
resident-entered run is the acceptance path. Planner-synthesized draft; the
captures' hashes are in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: no stop condition. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: it takes the path-identity refusal of register row
FUP-8369f2b4284e70a8 (WO-162 D004), whose condition names an order that
adds a production source-change host caller, as this one does; it
records what the filed draft and the portfolio contract hold today,
names its re-mints and the live episode, and bounds its write-backs
behind WO-167
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Amended by the 2026-10-02 planning pass, which re-observed the
order on `main` at `08845c71`: every dependency filed before that date
has closed; the primitive seams their reviews boarded for the
composition are WO-184's, now a hard dependency; the composition's own
decisions on those seams are in the Design and criterion 5; every duty
that sat on the catalog row or in a planning receipt is under Known
issues and carry-ins; the two review-loop defects it carried move to
WO-184; and the write-backs state what they say, with the document
ceilings that pass set as their only bound
([planning document](../planning/standard-pass-2026-10-02.md) §9).
**Depends on:** WO-052 merged (the source-change host; closed, v0.28.0);
WO-054 and WO-055 merged (verification and repair; closed, v0.30.0 and
v0.31.0); WO-059 merged (browser witnesses); WO-061 and WO-062 merged (the
contract from an issue); WO-124 merged (surfaces from the contract);
WO-063 merged (the outward lint the publish step runs; closed, v0.40.3);
WO-064, WO-065 and WO-066 merged (delivery and the pull-request loop;
WO-064 closed, v0.43.0); WO-068 merged (the resident that admits the
intent and dispatches the first step; closed, v0.23.0); WO-120 merged
(the filed intent and the derived order's durable identity; closed,
v0.41.0); WO-100 merged (the portfolio contract the `intent` class
extends; closed, v0.44.0); WO-042 merged (admitted grants and the
effective envelope the run is bound to; closed, v0.16.0); WO-167 merged
(the product 07 fold; closed); WO-184 merged (the reactor's room under
the capsule bound, the review notice, and the derivation, compile,
observer, publish and review-loop seams).
**Recommended placement:** the delivery lane of the second pair, after
WO-184 and before WO-112. This order edits `packages/skeleton/src/` (the continuation,
`resident-state.ts`, `portfolio.ts`, `dotln.ts`,
`source-change-worktree.ts` and `source-change-environment.ts`),
`packages/beacons/src/beacon-io.mjs`, `scripts/lib/config.mjs`, the
evidence-source registry if a new module needs it, their fixtures, the
editions it re-mints and products 07 and 03. WO-184, before it, edits
`resident-state.ts` and `scripts/lib/config.mjs`; WO-186, beside it,
edits the runner and three test files; WO-112, after it, writes
documents only; WO-073, later, edits `scripts/lib/config.mjs`. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-052",
    "relation": "hard",
    "reason": "the source-change host"
  },
  {
    "workOrderId": "WO-054",
    "relation": "hard",
    "reason": "verification over the worktree"
  },
  {
    "workOrderId": "WO-055",
    "relation": "hard",
    "reason": "the repair continuation"
  },
  {
    "workOrderId": "WO-059",
    "relation": "hard",
    "reason": "browser witnesses"
  },
  {
    "workOrderId": "WO-061",
    "relation": "hard",
    "reason": "the contract from an issue"
  },
  {
    "workOrderId": "WO-062",
    "relation": "hard",
    "reason": "the issue adapter"
  },
  {
    "workOrderId": "WO-124",
    "relation": "hard",
    "reason": "surfaces from the contract"
  },
  {
    "workOrderId": "WO-063",
    "relation": "hard",
    "reason": "the outward lint the publish step runs"
  },
  {
    "workOrderId": "WO-064",
    "relation": "hard",
    "reason": "publish"
  },
  {
    "workOrderId": "WO-065",
    "relation": "hard",
    "reason": "observation"
  },
  {
    "workOrderId": "WO-066",
    "relation": "hard",
    "reason": "resolution"
  },
  {
    "workOrderId": "WO-180",
    "relation": "hard",
    "reason": "the baseline witness episode the composition sequences before the change"
  },
  {
    "workOrderId": "WO-181",
    "relation": "hard",
    "reason": "the independent review episode sequenced after verification"
  },
  {
    "workOrderId": "WO-182",
    "relation": "hard",
    "reason": "the deliverable-ready conjunction the run requires before publication"
  },
  {
    "workOrderId": "WO-068",
    "relation": "hard",
    "reason": "the resident that admits the intent and dispatches the first step"
  },
  {
    "workOrderId": "WO-120",
    "relation": "hard",
    "reason": "the filed intent and the derived order's durable identity"
  },
  {
    "workOrderId": "WO-100",
    "relation": "hard",
    "reason": "the portfolio contract the intent class extends"
  },
  {
    "workOrderId": "WO-042",
    "relation": "hard",
    "reason": "admitted grants and the effective envelope the run is bound to"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  },
  {
    "workOrderId": "WO-184",
    "relation": "hard",
    "reason": "room in the reactor under the capsule bound, the review notice and the primitive seams the composition would otherwise meet"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §One outcome
from request to return; 03-architecture.md §Operator-presence policy (the
resident's dispatch rules); 07-execution-guide.md §Derived work and intent
and §Declaring a portfolio (the draft an intent files; the portfolio keys
and the bind refusal of a `self` portfolio);
`docs/work-orders/WO-100-preauthorized-portfolio.md` (the portfolio
contract); `docs/work-orders/WO-120-derived-work-identity.md` (the draft
an intent files); `docs/work-orders/WO-068-resident-host.md` (the actor
catalog and dispatch); `docs/work-orders/WO-060-source-bundle-contract.md`
(the screen's declared set and role labels); `scripts/lib/derived-orders.mjs`
(`fileIntent`); `scripts/lib/config.mjs` and
`packages/skeleton/src/portfolio.ts` (the portfolio keys and
`decodePortfolio`); `packages/skeleton/src/resident-state.ts`
(`residentEventTypes`); `docs/evidence/WO-162/decisions.md` D004 and
register row FUP-8369f2b4284e70a8 (the path-identity defect, its
reproduction and its checks); `scripts/lib/evidence-sources.mjs` and
`packages/skeleton/src/feedback-audit.ts` (`FEEDBACK_SOURCE_PATHS`); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-184-seams-before-the-vertical.md` (the
primitives as this order composes them);
`docs/evidence/WO-180/decisions.md` D013,
`docs/evidence/WO-181/decisions.md` D012 and D014 and
`docs/evidence/WO-182/decisions.md` D006 (the composition decisions made
below); `docs/evidence/WO-182/artifact-contract.md` (the delivery
preparation's fields); the other orders named in Depends on.

**Objective:** The vertical continuation sequences: bundle (WO-062) →
contract (WO-061) → surfaces (WO-124) → derived order (WO-120) →
source-change episode (WO-052) → browser witnesses (WO-059) → verification
and repair (WO-054, WO-055) → lint and publish (WO-063, WO-064) →
observation and resolution (WO-065, WO-066) to a terminal state, with the
baseline witness before the change (WO-180), the independent review after
verification (WO-181), the delivery preparation the composition writes
and the deliverable-ready conjunction it then requires before
publication (WO-182), recording
each step's receipt under the order. It has two entries that persist the
same continuation. The resident (WO-068) admits a filed intent (the draft
WO-120's `dotln intent` writes) when a portfolio entry of the `intent`
class (WO-100's contract, extended here by that one class) covers the
intent's target repository and surfaces ceiling and every remote effect the
continuation needs is covered by an admitted grant (WO-042, WO-064); it
persists the accepted contract and the continuation as events and
dispatches the first step itself, with no command and no manual activation.
`dotln vertical <issue>` enters the same continuation for an
operator-invoked run. An intent no standing authorization covers, one whose
surfaces exceed the ceiling, or one whose contract is ambiguous stays a
draft or returns `NeedsHuman` with the reason and dispatches nothing. The
order adds no primitive, and every step's failure is a typed stop with the
step named.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`; re-observed 2026-10-02 at `08845c71`):**

- No command runs the loop end to end. The `dotln` entrypoint's actions
  are `intent`, `presence`, `handoff`, `resident`, `status`, `demo`,
  `verify-demo` and `feedback-audit`, and nothing in `packages/` or
  `scripts/` defines a vertical continuation, `admitIntent`,
  `IntentAdmitted` or `IntentHeld`. Every primitive has its own entry and
  has closed; WO-184 is the one open dependency.
- Nothing writes `delivery-preparation.json`, which three rows of the
  readiness table read; a run that requires readiness refuses on all
  three until a step writes it (WO-182 D006).
- The baseline primitive takes a story's class from its caller and
  records no source for it; a defect story classed new is walked and
  skips the non-reproduction stop (WO-180 D013).
- Nothing lets the resident admit a filed intent under standing
  authority. `dotln intent` files a draft and activates nothing; the draft
  names `repo: self`, `baseCommit: unassigned`, no surfaces, one
  placeholder criterion, the constraint that human review is required
  before activation and an unassigned release classification
  (`fileIntent`). The resident's fifteen event types include none for an
  intent, and the only unattended derivation, WO-100's portfolio, derives
  orders from WO-119's five discovery candidate kinds. WO-118's Design
  still builds nothing, so the admission is this order's.
- The portfolio contract has no class. Its keys are `version`, `repo`,
  `mechanics`, `surfaces`, `phases`, `budget` and `verification`; unknown
  keys refuse; `mechanics` admits only `sort`, `shine` and `standardize`;
  `verification` is keyed by candidate kind; `decodePortfolio`
  re-validates the same shape; a portfolio whose `repo` is `self` has no
  authority profile and is refused at bind.
- The source-change and beacon guards compare path strings after a
  canonical-path check built on `realpathSync`, which on one
  case-insensitive volume returned the letter case and the volume alias it
  was given, and at one check a decomposed Unicode spelling. There a
  lowercase spelling of the launchpad given as the worktree parent passed
  the constructor, `git worktree add` ran, identity verification then
  threw, and the worktree, its registration and its branch remained; the
  beacon guard, called directly, accepted case-variant spellings that skip
  its ignore and intake refusals, and the skeleton CLI's `--beacons`
  argument reaches it, though no variant was driven through the CLI
  (WO-162 D004, reproduced by its VER-001 and again in its repair;
  register row FUP-8369f2b4284e70a8, open).
- `packages/skeleton/src/reactor.ts` holds 99,655 of the 100,000
  characters a judged file may have at `08845c71`; WO-184 brings it to
  at most 92,000.

**Design (scope discipline):**

- The continuation is in the executable subset so a killed host or a
  restarted resident resumes it at the step it reached; both entries
  persist the same program under the derived order's identity. It lives
  in a module of its own; the reactor gains at most its dispatch, and
  the module is registered as an evidence source and a feedback source
  as WO-184's leaf module is.
- Surfaces: the composition calls `deriveSurfaces` with its default
  threshold. A `NeedsHuman` result holds the intent with the reason and
  dispatches nothing.
- Baseline: the composition takes the story's class from the
  StoryContract (a contract that names a failing behavior is a defect
  story) and records the class and its source with the baseline
  receipt. A contract that names a failing behavior and is classed new
  is a finding. A baseline that does not reproduce is a typed stop that
  returns `NeedsHuman`; this order supplies no waiver.
- Review: a review-enabled stream is opened with WO-184's review notice,
  and after a repair the review runs only when every criterion is
  verified at the repaired revision (WO-184 item 12). A review episode
  that fails, times out or is unavailable is attempted once more as a
  fresh attempt; a second failure is a typed stop naming the review
  step, and nothing is published.
- Delivery preparation: after verification and review and before
  publication, the composition writes `delivery-preparation.json` with
  the unresolved material ambiguities from the contract's open
  decisions, the `tests` selection from the passing host-run evidence
  of the order's named tests, `build` and `lint` from the same where
  the order names them and otherwise `not-applicable` with that reason
  (WO-184 item 8), and the resident as the monitoring owner. The
  publish step runs with `--require-deliverable-ready`.
- The admission record states that standing authorization supersedes
  the draft's human-review constraint, and whether surface derivation
  ran before the admission decision and under which authority.
- `admitIntent(draft, portfolio, grants)` is pure: it returns the accepted
  contract binding or `NeedsHuman` with the reason, and the resident records
  the decision as an event (`IntentAdmitted` or `IntentHeld`) before the
  first `Invoke`. The `intent` portfolio class declares the target
  repository, the surfaces ceiling, the phase envelope and the budget;
  remote effects need the admitted grants; the derived order's envelope is
  the intersection of the portfolio, the phase and the grants, never wider
  (WO-042).
- The `intent` class adds a shape to both portfolio validators, which
  refuse unknown keys today; existing portfolios decode unchanged. The
  entry declares the target repository and the surfaces ceiling the
  admission binds a filed draft to (operator-review assumption 3).
- A draft, portfolio entry or grant the admission cannot decode is held
  with the reason as `IntentHeld`, and nothing is dispatched.
- Issue text, discussion and review comments pass WO-060's screen at
  decode time with the forge host the artifact lives on as the allowlist.
  A refused item is recorded with its shape and span and without its
  text, the rest of the bundle or observation is kept, and the
  continuation stops at the step that consumed the item, naming it. WO-060
  holds the declared set and the role labels (`reporter`, `reviewer`,
  `automation`).
- Path identity: before any containment comparison, the source-change
  guards and the beacon directory guard compare each input path's spelling
  with the filesystem's identity for that directory and refuse a
  difference in letter case, volume alias or Unicode form, and the host
  verifies identity before `git worktree add`, so a refusal leaves no
  worktree, branch or registration. `realpathSync.native` alone is not the
  check: it returned a volume alias unchanged (WO-162 D004). A path whose
  identity the guard cannot read is refused. The string-only prefix check
  in `packages/skeleton/src/worker-protocol.ts` (lines 330-349 at
  `5f3849ec`) stays as it is; D004 lists it for awareness only.
- **Declined alternatives, recorded:** a human activation step between the
  intent and the first dispatch on the resident path (that is WO-120's
  draft review, kept for every intent no authorization covers); the
  resident inferring authorization from the intent's text; a second
  continuation for the command path; merging the three containment helpers
  (their callers depend on distinct edge behavior, WO-162 D004; reopen
  when a caller needs one containment rule).

**Deliverables:** the continuation, the admission decision and its events,
the `intent` portfolio class, the command, the path-identity refusal,
the delivery-preparation step, the baseline class and review-failure
handling, fixtures with doubles and a fake clock, the re-mints, the
write-backs below.

**Acceptance criteria (all required)**

1. A resident integration fixture, with doubles for every external actor
   and a fake clock, starts from a draft filed as WO-120's `dotln intent`
   files it, under an explicit standing authorization (a fixture portfolio
   entry of the `intent` class declaring the target and the surfaces
   ceiling, and admitted fixture grants for the remote effects): the
   resident admits the intent with no `dotln vertical` invocation and no
   manual activation, records `IntentAdmitted`, persists the accepted
   contract and the vertical continuation as events, dispatches the first
   step itself, and runs to the terminal state writing one receipt per
   step; a resident restart after any step resumes the continuation at the
   next step under the same order and episode identities, and a fixture
   asserts the identities and that no step runs twice. In the same fixture
   an intent with no covering portfolio entry, one whose surfaces exceed
   the ceiling, one whose contract compiles to `NeedsHuman` and one whose
   draft or entry cannot be decoded each stay a draft or return
   `NeedsHuman` with the reason, record `IntentHeld`, derive no order and
   dispatch nothing; negative fixtures assert that no dispatch event
   follows. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
2. `dotln vertical <issue>` enters the same persisted continuation for an
   operator-invoked run and reaches the same terminal state; from the step
   at which the two entries converge, named in the decisions, it writes
   the same kinds of receipt in the same order as the resident path; a
   kill after any step resumes at the next.
3. A failing step (a refused capsule, a lint refusal, a `NeedsHuman`, an
   item WO-060's screen refuses) stops with the step named and no later
   step runs. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
4. Before any containment comparison, the source-change guards
   (`source-change-worktree.ts`, `source-change-environment.ts`) and the
   beacon directory guard (`beacon-io.mjs`) refuse a path whose spelling
   differs from the filesystem's identity for that directory by letter
   case, volume alias or Unicode form, and the source-change host creates
   no worktree before identity is verified. On a case-insensitive volume,
   fixtures give a parent, a launchpad and a beacon directory in each of
   the three variant spellings: each refuses and leaves no worktree,
   branch or worktree registration, and a canonical disjoint parent still
   succeeds. A path whose identity the guard cannot read is refused. A
   variant kind the fixture host cannot construct is recorded with the
   host's filesystem, and the criterion is judged on the kinds
   constructed. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
5. The composition's own decisions hold in fixtures with doubles: a
   review episode that fails once is attempted again and the run
   continues, and one that fails twice stops with the review step named
   and no publication; the baseline receipt records the story's class
   and its source, a contract that names a failing behavior and is
   classed new is reported as a finding, and a baseline that does not
   reproduce stops `NeedsHuman`; before publication the run writes the
   delivery preparation from the contract's open decisions and the
   order's named commands and publishes with the readiness requirement,
   and a fixture with one unresolved material ambiguity refuses before
   any remote call; a derivation that returns `NeedsHuman` holds the
   intent with the reason and dispatches nothing; the admission record
   carries the two statements the Design names. The criterion is judged
   against the declared set; a case outside it is a follow-up, not a
   failure.
6. Write-backs land, each in place with no dated paragraph: 07 §Derived
   work and intent (the command and the admission) and §Declaring a
   portfolio (the `intent` class); 03 §Operator-presence policy (the
   resident's admission); the decisions file; the publication locks
   refreshed. The document ceilings as the 2026-10-02 pass set them cover
   these write-backs; no byte figure bounds them.
7. The re-mints the Cost line names are recorded: each edition the edited
   registered sources stale is re-minted deterministically, a new module a
   registered source imports is registered or excluded with a reason, and
   after the last edit to a judged source the executor re-mints the
   feedback edition from one live feedback self-host episode over the
   edited judged sources, on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh` (`npm run dotln -- feedback-audit`, then
   `npm run evidence:feedback -- --record-selfhost <directory>`); the
   decisions record the configuration. A repair that edits a judged source
   again runs another the same way.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts, including the path-identity
fixtures with the host and filesystem they ran on; the re-mint records
and the live feedback audit; `npm run test:docs`; `npm test -- --review`
before `implementation-ready`, because
`packages/skeleton/src/resident-state.ts` is a declared source of the
authority, artifact, verification, feedback and harness evidence suites,
and again at final review. The live row: the executor's live feedback
self-host episode over the edited judged sources (criterion 7).

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:** every duty this order owes that is not a
criterion, gathered from its catalog row, the planning receipts and the
primitives' reviews, so no reader needs another document to find one.

- A restart after a completed step proves persisted progression, not
  the window in which an external effect succeeds before its receipt is
  durably recorded (receipt 033). Reopen when a kill after a named
  external effect and before that step's durable completion makes the
  resumed vertical repeat the effect, lose its outcome or need manual
  identity reconstruction.
- The review's `should` and `nit` findings are carried as known items of
  the deliverable; a `blocking` finding goes to bounded repair and
  re-verification (WO-181's consumer contract).
- The review context carries no derived surfaces, so a reviewer may
  report a scope finding on a file the derivation named (WO-181 D012).
  The composition records such a finding with the derivation beside it;
  carrying surfaces into the review is a later protocol change.
- A requirement or question that encloses a struck span compiles as
  fragment drafts (WO-061 D011, seam 3). The composition does not repair
  them; a run that meets one records it, and enclosing a strike in one
  statement stays a contract change for a later order.
- The observer stores a bot comment that links to another host as
  refused, and classes a machine account registered as a user as a
  human reviewer (WO-065 D015). A refused item stops the loop with a
  typed stop. The repository profile's declaration of machine logins
  and link hosts is WO-073's; a run against a repository with such
  bots before then stops there, as built.
- The screen admits C1 control characters and bidirectional overrides
  (WO-065 D014). No decision is made here; an issue the operator did
  not write should not reach WO-118's unattended run before one is.
- The verification state keeps an append-only `repairPlans` list no
  production code reads; replacing it re-keys three identity streams
  and is left.
- The composition's model invocations (source change, verification,
  review) are the first to consume a screened bundle. The executor
  records, per step, what the step's model input can carry; no exposure
  guarantee or plan primitive is added (register row FUP-0113).

**Non-goals:** the live proof (WO-112); the resident-owned run from a
starter (WO-118); deriving work from discovery candidates (WO-100); the
human review of a draft no authorization covers (WO-120); a change to
what `dotln intent` files; merging the three containment helpers or
changing the string check in `worker-protocol.ts`; path-identity cases
outside the declared set (a case-sensitive volume, another operating
system), each a follow-up; the primitive corrections of WO-184; a
waiver of a baseline that does not reproduce; machine-user logins and
link hosts (WO-073); derived surfaces in the review context.

**Operator-review assumptions**

1. Doubles are sufficient for the composition; the live proofs follow.
2. Standing authorization for an intent is a portfolio entry plus admitted
   grants, both reviewed text; the reviewer may prefer a dedicated grant
   kind.
3. The `intent` entry, not the filed draft, supplies the target repository
   and the surfaces ceiling: the draft keeps the `repo: self` and the empty
   surfaces `dotln intent` files, and the accepted binding carries the
   entry's, so `dotln intent` is unchanged.
4. The executor names in the decisions the steps that run before the
   admission decision (a ceiling needs the surfaces it bounds) and the
   step at which the command's entry and the resident's converge; the
   receipts criterion 2 compares are those from that step on.
5. The path-identity refusal lands here because the register row's
   condition is an order that adds a production source-change host
   caller; a path the guard cannot read is refused, never passed.
6. A baseline that does not reproduce stops for a human; the per-run
   waiver WO-180 assumed is not built, because a waived run could still
   not pass its defect criterion under the comparison rule. The operator
   may ask for one after a run stops on a baseline they judge
   irreproducible by nature.
7. A failed review is attempted once more and then stops; with
   readiness required, a run never publishes without a completed
   review.
8. A target order that names no build or lint command records those
   two as not applicable with that reason; its tests are always
   evidence.
