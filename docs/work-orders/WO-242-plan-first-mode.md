# WO-242 — Plan-first mode: when an instance elects it, the executor writes a plan, a conversation and a proposal into the order's documentation root, records the proposal and stops; the operator answers in the terminal or in the conversation document; the executor paraphrases, screens and surfaces every transformation before it carries a word elsewhere, and implements only after the operator's approval is recorded as a typed event the hook enforces (version assigned at activation)

**Model:** the executor runs on the operator's pinned Claude Code
`claude-fable-5-1` or Codex `gpt-6.1-sol` at `max` (the design of a role's
procedure is the subject); verifier and reviewer any capable model. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. One election, two lifecycle events with
their commands, three documents under a convention, one hook judgment while
a proposal awaits approval, the executor procedure's plan-first steps and the
kit's README section; the election absent, every surface is byte-identical.
Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/resume.mjs`, the actions `plan-proposed` and
`plan-approved` legal in phase `active` (the second only after the first,
with `--capture`, `--capture-hash` and the actor flags) and their events
`PlanProposed` and `PlanApproved` in `scripts/lib/control.mjs`, projected
into `current.md`, `status --json` (`planFirst: { proposedAt, approvedAt,
documents }`) and the legal next actions; in
`packages/skeleton/src/harness-host.ts` beside `registeredTargetWriteRoot`
(5071 to 5098) and `outsideWriteResponse` (5128), one judgment: while the
order is `active`, plan-first is elected and no `PlanApproved` stands for
the current proposal (from activation, before any `PlanProposed`, until the
approval), an executor write is admitted only under the order's plan-first
directory, the order's own evidence directory and the owned scratch where
the candidate is drafted, and a refusal names the route; in
`packages/skeleton/src/source-change-host.ts` and
`scripts/lib/executor-readiness.mjs`, the same condition refuses applying a
candidate to the target and refuses `implementation-ready`, so every route
the helpers control is held in process where a host has no hook; in `packages/skeleton/src/loadouts/contributor.ts`
(the executor procedure, 625 to 636), the plan-first steps; in
`scripts/lib/config.mjs`, the directory convention
`<evidence root>/WO-NNN/plan-first/` resolved for a self order in the
launchpad and for a target order in the target's documentation root; in
`scripts/terms.mjs` and `scripts/outward-lint.mjs`, a `--plan-first WO-NNN`
selection that screens `plan.md`, `proposal.md` and every passage the
executor carries out of `conversation.md`; fixtures in
`scripts/test-off-ramps.mjs` or its lifecycle sibling, `scripts/test-harness.mjs`
and `scripts/test-outward-lint.mjs`; the kit README's §Plan-first mode;
the `plan-first` registry row's `readBy` (WO-241). Removes: the state where
the only ways to put a person between the order and the implementation are
`analysis:` (a pause with no document) and a guided-operator order (the
operator does steps), so that a teammate new to agents meets `resume: next`
as a run that implements before anyone has read a plan. Wall-clock: the
executor's plan turn (one read of the order and the code, three documents,
one event) and each conversation turn; the hook's judgment adds one control
read per judged executor write while a proposal awaits (WO-236-D029 measured
a lifecycle status spawn at about 180 ms per judged outside write; this
order measures its own judgment before and after and records it). Context
bytes: this file, about 24,000. Commands: two new `resume` actions; the
`terms` and `outward-lint` selections. Tokens: unknown until run. Steps: 12.
Re-mints: `scripts/resume.mjs`, `harness-host.ts` and `contributor.ts` are
runtime sources the executor checks against `scripts/lib/evidence-sources.mjs`
at activation and re-mints deterministically where an edition is staled;
none is a file the feedback verifier judges, so no live feedback episode;
`scripts/resume.mjs`, `harness-host.ts` and `loadouts/contributor.ts` are
declared machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's dispatch of 2026-10-30, item 6
("a config mode that will help bridge the gap from people doing work with
no/little AI assistance and the current setup of resume and the
model/harness just running off and implementing ... come up with a plan,
share that plan with the operator, have a little back and forth ... without
overloading the operator") and 6.a (the three documents in the target
repository: a read-only plan the agent regenerates, a persistent
conversation the operator and the agent both write, a document of the
proposed code updates; the operator answers in the terminal or by editing
the conversation; terminal words are paraphrased into the conversation by
the agent; a manually written passage that must be transformed is announced
before it is carried), in ignored intake
`docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30.md`
(SHA-256 `94d4f4bd85efaf035a89353d6ad88abedf8e1d29c2c298fe1b3d69b62806bd8a`).
Filed by the [2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
applies with force to what leaves the conversation document: the plan, the
proposal, decisions, handoffs, pull-request bodies and anything that reaches
core are screened surfaces; the conversation document itself lives in the
order's documentation root, private when that root is private, and the
executor never rewrites the operator's own lines in it.
**Depends on:** WO-241 (hard: the `features` section and the `plan-first`
registry row this mode reads); WO-236 (closed: the executor's
target-worktree grant, under which the three documents are written into a
target); WO-158 (closed: the typed off-ramp events, captures and actor
flags whose shape `plan-approved` follows); WO-192 (planning-deferral: the
router drives an order through its lifecycle, and in plan-first mode it must
stop at `PlanProposed` and resume at `PlanApproved`; this order's router step
is written against WO-192 as filed and finished when WO-192 has merged).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-241",
    "relation": "hard",
    "reason": "the features section and the plan-first registry row the mode reads"
  },
  {
    "workOrderId": "WO-236",
    "relation": "satisfied-by-close",
    "reason": "the executor's target-worktree grant under which the three documents are written into a target"
  },
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the typed event, capture and actor-flag shape plan-approved follows"
  },
  {
    "workOrderId": "WO-192",
    "relation": "planning-deferral",
    "date": "2026-10-30",
    "reason": "the router must stop at PlanProposed and resume at PlanApproved; the step is written against WO-192 as filed and finished once it merges",
    "until": "WO-192"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator resume phrases (the
executor's dispatch and `analysis:`), §Research and guided-operator work
orders (the existing operator-participation form and its method criteria),
§Where the control plane finds its documents (target orders pair a code
worktree with a launchpad order worktree; `documentationRoot`; `resume
target-records` moves the order, its decisions and reports into the target),
§Operator recovery controls (WO-158's off-ramps: `withdraw`, `waive`,
`correct` with `--capture` and `--capture-hash`); product 12 §Arriving at the
desk and §One outcome from request to return (Scope, Begin, Steer: "Ask only
for a material decision that existing authority cannot resolve");
`scripts/resume.mjs` (`legalActions` 247 to 273, `OFF_RAMP_PHASES` 303 to
318, `captureUsage` 329, the actor flags at 163); `scripts/lib/control.mjs`
(the fold's event cases at 87 to 107 and 483 to 511);
`packages/skeleton/src/harness-host.ts` (`registeredTargetWriteRoot` 5071 to
5098: the phase check `active` or `repairing` and the target registry read;
`outsideWriteResponse` 5128; the admission at 5223);
`packages/skeleton/src/loadouts/contributor.ts` (the executor procedure 625
to 636; the closeout step 631); `packages/beacons/src/beacon-v3-codebook.mjs`
(`phaseRadix: 8`; no new phase is added); `scripts/terms.mjs` and
`scripts/outward-lint.mjs` (the `refuse:` and `review:` terms, the launchpad
identifier rules); `scripts/kit/README.client.md` §First steps item 4 (the
local-terms list) and item 7 (`resume: next`); `../DotLn-Angular/docs/dotln/`
(a target's documentation root as it exists: `evidence/`, `final-reviews/`,
`verifications/`, `work-orders/`); WO-192 (the router and its phase workers);
WO-241 (`features.plan-first`).

**Objective:** An operator who turns on `features.plan-first` and says
`resume: next` gets, before any code changes, three documents in the
order's documentation root: `plan.md` (where the change goes, why, the
contracts it expects, the decisions taken so far), `conversation.md` (the
exchange, persisting across sessions) and `proposal.md` (the proposed code
changes, file by file, then the actual diff once drafted). The executor
records `PlanProposed`, prints the three paths and stops. The operator reads,
then either types in the terminal or writes in `conversation.md`; the next
`resume: next` reads what changed, answers in `conversation.md`, regenerates
the plan and the proposal, and asks only the questions existing authority
cannot settle. A terminal reply is paraphrased into `conversation.md` by the
executor; a passage the operator wrote that a screened surface cannot carry
as written is announced in `conversation.md` before the transformed form
goes anywhere, and the operator's own lines are never rewritten. When the
operator says, in ordinary words, to go ahead, the executor records
`PlanApproved` with the words captured, and only then does implementation
proceed; until then the hook refuses an executor write outside the three
documents, the order's evidence directory and scratch, naming the route.
With the election off nothing changes.

**Observed gap (dated 2026-10-30 at `main` `4090d70d`):**

- `resume: next` dispatches the executor procedure (`contributor.ts` 625 to
  636): read the order, implement, prepare the release, reviews, the
  complete run, the handoff. No step reads an operator's reply or waits
  for one; the only pause is `analysis:`, which stops work without a
  document, and the only participation form is the guided-operator order,
  where the operator performs steps.
- The lifecycle's legal actions in `active` are `next` and
  `implementation-ready` (`resume.mjs` 251); every typed operator word the
  lifecycle records is an off-ramp (`waive`, `withdraw`, `correct`,
  `override-record`, `accept-overrun`) with `--capture` and
  `--capture-hash`; there is no event for a plan or an approval.
- The hook admits every executor write in the worktree and, since WO-236,
  in the registered target worktree while the order is `active` or
  `repairing` (`harness-host.ts` 5087); nothing distinguishes a write made
  before a plan was read from one made after.
- A target's documentation root holds `evidence/`, `verifications/`,
  `final-reviews/` and `work-orders/` for each order (`DotLn-Angular`'s
  `docs/dotln/`); nothing in it is written for the operator to answer.
- The clean-room machinery exists for publication: `npm run terms -- check
  <paths>` refuses `refuse:` terms and lists `review:` terms; the outward
  lint refuses launchpad identifiers and private terms in a target's
  commits and pull requests. Nothing screens a document an operator writes
  inside the repository for what the executor may carry out of it.
- WO-219-D042's reopening condition occurred (FUP-0f2a756698374d7e,
  returned to planning by WO-235-D063): under main's router a Claude Code
  task notification without a command mode is journaled unattributed and
  counted as an operator intervention; a mode that reads operator turns
  must not read a host notification as one.
- The fork's WO-015 is an attended comparison session: the operator sits
  with the executor; the first bound stop or acceptance under WO-234 is
  reported in the fork's next block. Attended is the operator being
  present; plan-first is the plan being read before implementation. The
  two compose.

**Design (scope discipline):**

- **Two events inside `active`, no new phase.** `PlanProposed` (the base
  commit, the paths and SHA-256 of the three documents, the candidate's
  diff digest, the executor's actor) and `PlanApproved` (the operator's
  words captured with `--capture` and `--capture-hash`, the recording
  actor, and the exact `PlanProposed` it accepts). An approval is bound to
  that revision: a later `PlanProposed`, a moved base or a changed
  conversation digest invalidates it and the next turn shows what changed
  since the operator last read. A quoted instruction, a linked document's
  text, an agent's own suggestion, a stale approval or elapsed silence is
  not approval. The capture is supplied by the recording actor, the same
  trust model as WO-158's `waive` and `withdraw`; binding the approval to a
  harness-recorded operator prompt is the stronger form and this order's
  reopening observation. Rejected: a new lifecycle phase
  `planned` (axis: every phase consumer changes, the beacon codebook's
  `phaseRadix: 8` among them, against two events the fold projects; WO-158
  added events this way).
- **The hook and the helpers enforce the wait, from activation.** While
  plan-first is elected, the order is `active` and no `PlanApproved` stands
  for the current proposal, which includes the time before the first
  `PlanProposed`, the executor's writes are admitted only under the
  plan-first directory, the order's own evidence directory (decisions,
  handoff) and the owned scratch holding the candidate; a refusal names
  `conversation.md` and `npm run resume -- plan-approved`. The helpers hold
  the same condition in process at the apply boundary
  (`source-change-host.ts`) and at readiness (`executor-readiness.mjs`), and
  the order records a host-boundary matrix: Claude hooks refuse observed
  writes, the helpers refuse every route they control on every host, and a
  Codex direct tool write is a role duty under host permissions, so the
  record never claims a boundary the host does not expose.
  Rejected: role text alone (axis: the operator's words were that the
  harness "just runs off and implementing"; a duty the hook does not hold
  is a request). Rejected: refusing every write (axis: the executor must
  write the three documents and its decisions).
- **The proposal is real code, drafted apart from the target.** The executor
  drafts the change in an owned scratch copy or candidate worktree the
  owned-root helper creates (class `session-scratch`, the order's own), never
  in the target's implementation tree, and `proposal.md` carries the
  candidate's complete diff against the base (additions, deletions, renames
  and tests, grouped by file but never omitted; a binary change named with
  its hash) beside the per-file intent; on approval the executor applies the
  accepted revision to the target and refuses when the base moved. Rejected:
  a prose summary as the third document (axis: it cannot show every code
  change). Rejected: drafting in the target tree behind the hook (axis: the
  hook refuses source writes while a proposal awaits; the candidate is where
  the code is written). This bullet adopts the other pass of 2026-10-30's
  isolated-candidate design on the operator's direction.
- **Three documents, three lifetimes.** `plan.md` and `proposal.md` are
  regenerated whole by the executor and carry a `dotln-plan-first` marker
  block (status, `proposedAt`, the conversation digest last read, the
  transformations announced); `conversation.md` persists and is appended
  by both writers under dated headings naming the writer (`Operator`,
  `Agent`, `Agent, paraphrasing the terminal`). Rejected: one document with
  three sections (axis: two writers with different lifetimes; a regenerated
  section beside the operator's prose invites rewriting it). Rejected: a
  chat surface in the console (axis: the operator asked for documents in
  the repository the team reads; the console reads them later).
- **An ordinary reply does not reopen the gate.** A conversation turn after
  a passing document gate is the order's own record and does not force
  another complete gate: the document row binds it the way WO-238's carry-in
  (WO-235-D022) settles for every record completion itself requires, and
  until WO-238 lands the executor's inline docs check over the changed
  record is the route; a change to the plan or the proposal, the accepted
  contract, invalidates the approval and the rows that bind them.
- **Where they live.** `<evidence root>/WO-NNN/plan-first/` in the
  launchpad for a self order; for a target order the same path under the
  target's `documentationRoot` in the target worktree, where `resume
  target-records` already moves the order's records, so the documents stay
  with the repository the change is for. Rejected: a new configured root
  (axis: the evidence root already follows a target order into its
  repository; one more root is one more thing to declare).
- **The reader's task bounds the plan.** `plan.md` answers, for the operator
  who decides in minutes: where the change goes (files and modules), why
  (the order's objective in the repository's terms), the contracts expected
  (interfaces, API shapes, data the change relies on), the decisions taken
  so far with their alternatives, and the open questions existing authority
  cannot settle. `proposal.md` lists the proposed changes file by file with
  the intended behavior and, once the executor has drafted code, the diff
  against the base. No sentence count or size target; the executor asks
  only the material questions (product 12's Work row). Rejected: a fixed
  template of required sections beyond those five (axis: product 07's
  artifact rule derives shape from the reader's task, never a predecessor).
- **The clean room at the boundary, announced first.** The conversation
  document is the operator's: work links, story numbers, their train of
  thought stay as written when the documentation root is private. The
  screened surfaces are the plan, the proposal, the decisions, the handoff
  and anything that reaches the launchpad or a publication. Before the
  executor carries an operator passage onto a screened surface it runs the
  terms and outward screen on it, writes the transformed form and an
  `Announced transformation` entry in `conversation.md` first, and never
  edits the operator's lines. A self order in core, whose documentation
  root is public, screens `conversation.md` itself and asks the operator
  to rephrase a refused term rather than editing it. Terminal words are
  paraphrased into `conversation.md` by the executor as the operator asked,
  with the words captured in ignored intake and their digest in the entry.
  Rejected: screening the conversation document in a private target (axis:
  the operator's words: "this is a private repo so work links are
  obviously fine").
- **Approval in ordinary words.** The operator says "go ahead", "approved",
  "looks good, build it" in the terminal or writes it in
  `conversation.md`; the executor infers authorization from ordinary
  language as product 07's dispatch-bound rule already does for
  `accept-overrun`, captures the words and records `plan-approved`. A host
  notification or an agent report is never an operator turn (WO-219-D042).
  Rejected: an exact phrase (axis: the standing rule against requiring an
  exact phrase).
- **The router honors the wait.** WO-192's router, driving an order through
  its phases, stops after the executor's `PlanProposed` and resumes a fresh
  executor worker at `PlanApproved`; written against WO-192 as filed and
  finished once it merges. Rejected: leaving the router unaware (axis: the
  router would spawn an implementing worker the hook then refuses, a loop
  the operator reads as a stuck order).
- **Live-run surfaces at the base.** The lifecycle fold, the off-ramp
  capture shape, the hook's executor write judgment and the target-worktree
  grant: exist. The terms and outward screens: exist as publication checks.
  The three documents, the two events, the plan-first judgment, the role
  steps, the router stop: absent. WO-241's `features.plan-first`: lands
  before this order.

**Execution plan (the executor follows these steps in order; observed at `4090d70d`, 2026-10-30):**

1. `scripts/lib/control.mjs` (the fold, 87 to 107 and 483 to 511):
   `PlanProposed` and `PlanApproved` fold into `planFirst: { proposedAt,
   documents: [{ path, sha256 }], approvedAt, approvalCaptureHash }`, with a
   later `PlanProposed` clearing `approvedAt`. Check: `npm test -- --only
   work-orders-fixtures` (the fold's fixtures) and the suite that declares
   `scripts/lib/control.mjs`.
2. `scripts/resume.mjs` (`legalActions` 247 to 273; the actor flags 163;
   `captureUsage` 329): `plan-proposed WO-NNN` records the three documents'
   paths and digests; `plan-approved WO-NNN --capture <path>
   --capture-hash sha256:<digest> <actor-flags>` is legal only after an
   unsuperseded `PlanProposed`; `current.md` and `status --json` project
   `planFirst` and list `plan-approved` among the legal next actions while a
   proposal awaits. Check: `npm test -- --only derived-orders` or the
   lifecycle suite that declares `scripts/resume.mjs`, spelled at
   activation; `npm test -- --only console` (the status projection).
3. `scripts/lib/config.mjs`: `planFirstDirectory(root, workOrderId,
   target?)` resolves `<evidence root>/WO-NNN/plan-first/` in the launchpad
   or under a registered target's `documentationRoot`. Check: `npm test --
   --only configuration-root`.
4. `packages/skeleton/src/harness-host.ts` (`registeredTargetWriteRoot`
   5071 to 5098 and the executor's in-project judgment): when
   `readFeatures(root)["plan-first"]` is on, the order is `active` and
   `planFirst.proposedAt` is set with no `approvedAt`, an executor write is
   admitted only under the plan-first directory, `<evidence root>/WO-NNN/`
   and the granted scratch roots; the refusal names `conversation.md` and
   the `plan-approved` command; the judgment's added cost is measured in
   the fixture before and after. Check: `npm test -- --only
   harness-fixtures`; `npm test -- --only harness`.
5. `packages/skeleton/src/loadouts/contributor.ts` (the executor procedure,
   625 to 636): the plan-first steps, in order: with the election on and no
   proposal recorded, read the order and the code, write the three
   documents, screen `plan.md` and `proposal.md`, record `plan-proposed`,
   print the paths and stop the turn; with a proposal awaiting, read
   `conversation.md` since the digest in the marker block and the operator's
   terminal words, paraphrase terminal words into `conversation.md` with
   their capture digest, announce every transformation before carrying a
   passage, regenerate the plan and the proposal, record `plan-proposed`
   again when either changed, and stop; answer every operator entry since
   the last read before regenerating; on the operator's ordinary words of
   approval, capture them and record `plan-approved` for the current
   proposal, then apply the accepted candidate to the target and continue
   the procedure from the implementation step; a host notification is never
   an operator turn. The plan-first steps are emitted only when the election
   is on, so the executor root with the election off is byte-identical to
   the base's. Check: `npm test -- --only
   harness` (the emitted root) and `npm test -- --only harness-context`
   (the executor cold-start ceiling; a breach follows the standing route).
6. `scripts/terms.mjs` and `scripts/outward-lint.mjs`: a `--plan-first
   WO-NNN` selection screens `plan.md`, `proposal.md` and a passage given on
   standard input (the carried text), refusing `refuse:` terms and launchpad
   identifiers where the destination is a target surface, and listing
   `review:` terms; a self order's `conversation.md` is screened too. Check:
   `npm test -- --only outward-lint`.
7. The documents' marker block: a `dotln-plan-first` JSON block at the top
   of `plan.md` and `proposal.md` (`status`, `proposedAt`,
   `conversationDigest`, `transformations: [{ at, from, to, surface }]`)
   validated by the plan-proposed command; `conversation.md` carries dated
   `###` headings naming the writer. Check: the command's fixture in step 2.
8. WO-192's router (`scripts/lib/` as WO-192 lands it): a phase worker that
   ends its turn after `PlanProposed` leaves the order awaiting; the router
   spawns the next executor worker only after `PlanApproved`. Written
   against WO-192 as filed; the file is known once WO-192 merges. Check:
   WO-192's router suite as it lands.
9. `scripts/kit/README.client.md` §Plan-first mode (new, after §First
   steps): the election, the three documents and where they live, the two
   ways to answer, what is paraphrased and what is announced, the approval
   words and the event, the refusal while a proposal awaits. Check: `npm
   test -- --only launchpad`; `npm run publication:check`.
10. `scripts/kit/dotln.config.example.json`: `plan-first` shown off with a
    note. Check: `npm test -- --only launchpad`.
11. Write-backs: product 07 §Operator resume phrases (the plan-first turn
    under `resume: next`), §Operator recovery controls (the two events
    beside the off-ramps), §Where the control plane finds its documents (the
    plan-first directory); product 12 §Arriving at the desk (the operator
    new to agents meets a plan first); `docs/evidence/WO-242/decisions.md`
    (the measured hook cost before and after; the router step's state);
    WO-241's registry row `plan-first` gains `readBy: packages/skeleton/src/harness-host.ts`;
    re-mint any edition the runtime sources stale; `npm run meta`; `node
    scripts/lineage.mjs index --check`.
12. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; the three
    fresh independent reviewers the executor root requires; one `npm test
    -- --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-242/handoff.md`; `npm run test:docs`
    once after the last document edit; `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the two events and commands with their projections; the
directory convention; the hook judgment with its measured cost; the executor
procedure's plan-first steps and the target closeout sentence; the screens'
selection; the router step; the README section and example; the write-backs.

**Acceptance criteria (all required)**

1. With `features.plan-first` absent or `false`, `resume.mjs`'s legal
   actions, `current.md`, `status --json`, the emitted executor root and the
   hook's judgments are byte-identical to the base's for the fixtures (the control at the base and the current tree
   recorded in `docs/evidence/WO-242/controls.json`).
2. `plan-proposed WO-NNN` records `PlanProposed` with the base commit, the
   three documents' paths and digests and the candidate's diff digest, and
   refuses a missing document, an invalid marker block or a candidate whose
   diff does not match `proposal.md`; `plan-approved` refuses without a
   preceding unsuperseded `PlanProposed`, without `--capture` and
   `--capture-hash`, or with a hash that does not match the capture;
   `status --json` shows `planFirst` and lists `plan-approved` among legal
   next actions while a proposal awaits; a later `PlanProposed`, a moved
   base or a changed conversation digest clears the approval and the next
   turn names what changed.
3. In the harness fixture, with the election on and either no proposal yet
   or a proposal awaiting, an executor write to a source file in the
   worktree and one in the registered target worktree are refused naming
   `conversation.md` and the `plan-approved` command, and writes to the
   plan-first directory, the order's evidence directory and the owned
   candidate scratch are admitted; the helpers refuse applying the candidate
   and `implementation-ready` in the same states; after `PlanApproved` for
   the current proposal the same source writes and the apply are admitted; a
   verifier's writes are unaffected; the judgment's duration before and
   after is recorded in the decisions, and the host-boundary matrix names
   which boundary held in the live run of criterion 8.
4. The emitted executor root carries the plan-first steps and the target
   closeout sentence; `harness check` passes; the executor cold-start
   measurement is recorded against its ceiling, and a breach is handled
   under the standing route, never by trimming a reviewed duty.
5. The `--plan-first` screen refuses a `refuse:` term in `plan.md` or
   `proposal.md` and in a carried passage, lists a `review:` term, and
   refuses a launchpad identifier bound for a target surface; a fixture
   `conversation.md` holding a `refuse:` term in an operator entry yields an
   `Announced transformation` entry and no copy of the term in `plan.md`,
   `proposal.md` or the decisions; the operator's entry is byte-identical
   after the turn; for a self order that document is not committed while the
   term stands, the executor asks in the document, and the publication
   check names the entry without printing the term.
6. For a target order fixture the three documents resolve under the
   target's `documentationRoot` and move nothing at `target-records`; for a
   self order they resolve under the launchpad's evidence root.
7. The router step is either landed against WO-192's merged router with its
   fixture (a worker ending after `PlanProposed` is not followed by another
   until `PlanApproved`) or recorded in the decisions as written against
   WO-192 as filed with the file it will land in, when WO-192 has not
   merged at this order's activation.
8. One live plan-first conversation runs in the executor's session against
   a fixture target with a synthetic order and scripted operator turns
   (a question, a correction, an approval), through proposal, revision,
   complete-diff inspection, approval and application; the record carries
   the operator turns, the bytes the operator had to read per turn, the
   elapsed work and waiting and the counters available, and the verifier
   reads it as a novice's workflow and records usability limits; no claim
   of reduced burden rests on shorter documents.
9. The kit README's §Plan-first mode and the example configuration state
   the mode as built; product 07 and product 12 carry the write-backs of
   step 11; WO-241's registry row names its consumer; `npm run
   publication:check` is green.
10. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency.

**Preflight:** `npm test -- --only work-orders-fixtures` for step 1; the
lifecycle suite `npm test -- --list --review` names for `scripts/resume.mjs`
for steps 2 and 7 (written in at activation) and `npm test -- --only
console` for the projection; `npm test -- --only configuration-root` for
step 3; `npm test -- --only harness-fixtures` and `npm test -- --only
harness` for steps 4 and 5; `npm test -- --only harness-context` for step 5;
`npm test -- --only outward-lint` for step 6; `npm test -- --only launchpad`
for steps 9 and 10; `npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the controls of criteria 1 and 3; the fixtures of
criteria 2, 5 and 6; the deterministic re-mints of any edition the runtime
sources stale; `npm test -- --review` before `implementation-ready`, final
review reusing the passing complete row at the integrated code identity when
one exists.

**Write-back duty:** as listed in step 11 and criterion 9.

**Known issues and carry-ins:**

- Carry-in (FUP-0f2a756698374d7e, WO-219-D042's occurred condition via
  WO-235-D063): a Claude Code task notification without a command mode is
  journaled unattributed and counts as an operator intervention under main's
  router; the plan-first turn reads only operator prompts as conversation,
  never a host notification or an agent report, and the decisions record how
  the executor tells them apart on the supported hosts (reopen: a host
  notification is paraphrased into `conversation.md` as an operator turn).
- Carry-in (FUP-0695bdd05c71bf08, the operator's direction of 2026-10-24):
  a teammate who knows the product and the codebase but not agents becomes
  productive by cloning the team's fork, starting a worktree and letting the
  role text carry the practice; plan-first is the first bridge, and the kit
  README's §Plan-first mode is written for that reader (reopen: the operator
  reports the first teammate's session, or asks for more than the mode).
- Carry-in (FUP-d1b15b1b3e4dc761, WO-236-D020): an operator question or
  correction in plan-first mode is answered in `conversation.md` before the
  next proposal, every entry since the last read, so no question waits
  across turns (reopen: an operator entry is left unanswered across two
  turns). The closeout sentence for target orders is WO-243's, filed on the
  operator's direction of 2026-10-30; this order no longer carries it.
- The approval is inferred from ordinary language by the executor and
  recorded with the words captured; a wrong inference is corrected by
  `correct` or by a new `PlanProposed` (reopen: an approval is recorded from
  words the operator says were not one).
- A conversation turn that arrives while no session is open is read at the
  next `resume: next`; nothing watches the file (reopen: the operator asks
  for the executor to be woken by an edit, which is the router's or the
  resident's).
- The plan-first documents are the executor's; verification and final
  review read them as part of the order's records and judge the delivered
  change against the approved proposal (reopen: a reviewer needs a typed
  link from the proposal to the diff).

**Non-goals:** a new lifecycle phase; a chat or web surface; screening a
private target's `conversation.md`; rewriting the operator's lines; an exact
approval phrase; waking the executor on a file change; applying plan-first
to repairs after a failed verification (the repair is bounded by the
finding); changing how `analysis:` or the guided-operator order work.

**Operator-review assumptions:** that the three documents live under the
order's evidence path in the target's documentation root, since that is
where a target order's records already go; that "the AI updates the 2nd doc
itself with a clean room paraphrasing" means the executor writes its own
entries as paraphrases and never edits the operator's; that approval is
given in ordinary words and recorded as a typed event rather than by a
phrase; that the hook, not role text alone, holds the wait; and that this
mode is elected per instance in `dotln.config.json` (a per-order header is
the reopening candidate if the operator wants both).
