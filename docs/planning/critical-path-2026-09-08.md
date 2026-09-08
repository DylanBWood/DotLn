# The critical path to the first external source change — the 2026-09-08 planning pass

**Planning result:** 2026-09-08, the planning pass after the WO-039 close,
opened by the operator with an external source-level audit appended to the
dispatch and a fixed brief: verify every material claim of that audit against
the current tree, then produce a dependency-correct, evidence-driven path from
the current code to DotLn's first real external source-changing worker and on
to an independently verified source-to-deliverable vertical. The pass ran on
the clean `main` checkout at `33e2c25` (the merged WO-039 source, `v0.15.0`
unpublished) on the planning branch the operator checked out for it, with
Beware of Naive Interventionism and Do Nothing equipped. It files two
planner-synthesized drafts,
[WO-042](../work-orders/WO-042-authority-provenance.md) and
[WO-043](../work-orders/WO-043-typed-dependency-truth.md), replaces the marked
sequence, records the later gates as unfiled candidates with entry criteria,
and grants no activation authority. The dispatch and the operator's mid-pass
messages are preserved verbatim in local-only
`docs/intake/notes/2026-09-08-critical-path-planning-dispatch.md`; its SHA-256
is in the ledger section of the same date. The claim-by-claim verification is
the sibling [source-verification report](source-verification-2026-09-08.md);
the dependency graph is the sibling
[`critical-path-2026-09-08.json`](critical-path-2026-09-08.json).

**Refutation status.** The pass did not run `npm run plan -- refute`. The
refuter dispatches a model transport, which the dispatch says not to run
automatically, and the sandboxed session cannot launch either CLI transport
(the WO-039 receipt records three refused in-session attempts). The six
manual receipts and the mechanized live receipt were read, and their
validated acceptance rules were applied by hand to the two filed orders
(§Quality gates applied). The dated planning heading this pass adds to the
ledger makes the plan gate in `npm test` refuse until a receipt exists; the
operator runs, from a terminal outside the sandbox after the planning subject
is committed:

```sh
npm run plan -- refute --slug critical-path-2026-09-08
```

The receipt may hold on the deliberately unfiled loop order (§Quality gates
applied). If it does, the intended answer is an attributed operator override
citing this pass's capture, not a numbered order filed to satisfy the gate.

## Verdict

The audit's central sentence is right and the repository already knew it: the
2026-09-06 pass counted roughly twenty machinery orders against six runtime
rungs and said the smallest useful loop exists for no user. What the audit did
not know is that WO-039 has merged since its snapshot. That changes its
roadmap materially, and the [source verification](source-verification-2026-09-08.md)
records every consequence. In one paragraph:

DotLn today can compile a build, lower it into the hooks and skills this
repository's own sessions run under, refuse a session that steps outside its
worktree, dispatch a read-only inspection worker to two real CLI harnesses,
recover it after a kill, and run a blinded verifier over a synthetic
repository with process doubles. It cannot edit a file in another repository:
the real workers launch with every tool disabled and an empty writable
surface, no source-writing profile exists, no browser evidence exists, no
tracked-work intake exists, and no pull request has ever been produced. The
operator's predecessor, v1, does that whole loop today because its rules ride
along as prose. The gap between the two is the product, and the path below is
the shortest route across it that keeps the compiled-rule bet intact.

## The destination in the operator's terms

The operator's mid-pass description of v1 is the parity baseline the vertical
is measured against, generalized under the Clean Room floor: link one or two
stories from an enterprise tracker; the system performs the full intake and
understanding of the requirements, creates the branch, makes the changes,
writes proper conventional commits, writes a good pull-request title and body,
and resolves every automated review comment on the pull request without the
operator babysitting a harness or repeating manual steps inside it. Product
12's replacement table already names these as behaviors to retain with
evidence before retiring the old step; this pass makes them the exit
checklist of Gate H, in the order the operator listed them, and adds the one
the audit omitted: the post-PR loop.

## The critical path

| Gate | Order or candidate                                                                                    | Depth in this pass       | Blocking prerequisites          | Why it sits here                                                                                                                                             |
| ---- | ----------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | [WO-042](../work-orders/WO-042-authority-provenance.md) — authority provenance and monotone envelopes | fully specified, filed   | none open                       | The compiled envelope is what the lowered hooks enforce; a support can widen it today. Nothing may be emitted into a foreign worktree before that is closed. |
| B    | [WO-043](../work-orders/WO-043-typed-dependency-truth.md) — typed dependency truth                    | fully specified, filed   | none open                       | Planning truth for everything after it; blocks nothing on the path.                                                                                          |
| B    | [WO-036](../work-orders/WO-036-evidence-runner.md) — evidence runner                                  | existing, remains active | none open                       | Every later order pays the serial chain repeatedly; the build-first defect persists at segment 18 of 34.                                                     |
| C1   | Runtime boundary codecs (brief)                                                                       | activation brief         | none open; floats               | Hardens the persisted and external boundaries the writing worker crosses; mandatory before H, not before D2.                                                 |
| C2   | Writing-worker harness truth (brief)                                                                  | activation brief         | none open                       | No record observes a tool-enabled worker in a foreign worktree under that worktree's hooks. Principle 15: environment truth before architecture.             |
| D1   | Target-worktree harness bundle (brief)                                                                | activation brief         | WO-042; C2                      | The bundle that governs the worker in the target; carved from WO-033 phase 2.                                                                                |
| D2   | Single-repository source-changing worker (brief)                                                      | activation brief         | WO-042; C2; D1                  | The first external source change and the first user-value proof.                                                                                             |
| E    | Blinded verification and repair over a real repository (brief)                                        | activation brief         | D2                              | WO-010's loop lifted onto a real repository with a live verifier and a planted defect.                                                                       |
| F    | Browser evidence adapter (brief)                                                                      | activation brief         | none open; recommended after E  | Visual and network claims; the operator's "walk the app" practice.                                                                                           |
| G    | SourceBundle to StoryContract (brief)                                                                 | activation brief         | none open; recommended after E  | The intake half of the loop; the tracker adapter stays outside core.                                                                                         |
| H    | Angular source-to-verified-PR vertical with the target publish slice and the post-PR loop (brief)     | activation brief         | D1; E; F; G; C1; target publish | The v1 parity proof on the operator's public Angular repository.                                                                                             |

Blocking chain: WO-042 → C2 → D1 → D2 → E → H, with F, G and the target
publish slice joining before H. WO-043, WO-036 and C1 float. The earliest
point at which DotLn changes external source code is D2's first live episode,
the fourth order in the blocking chain after this pass, where C2 is a
discovery order and D1 is an emit slice.

### Deviations from the audit's decomposition, and why

- **WO-044, WO-045 and WO-046 are not filed.** Harness capability truth
  exists (the WO-039 phase-zero record plus the WO-004, WO-009, WO-011 and
  WO-019 discovery addenda); minimum lowering exists and is live (this pass
  was refused by it); the self-host comparison exists as WO-039 criterion 6
  and the live role records. The one residual is C2: a writing worker in a
  foreign worktree. WO-039 is closed evidence, not a superseded order.
- **Codecs float.** No misdecode has been demonstrated; the worker store
  refuses torn logs and dead locks; transport results are positively
  validated. C1 is scoped to the boundaries that lack validation and becomes
  mandatory before the operator's repository is touched (H), not before a
  scratch repository is (D2).
- **The deferral gate is D2 plus a replan, not the end of the vertical.**
  The starter, pilot, migration and workshop decisions should be made on the
  first real episode, not on the last one; the audit's "until WO-052 closes"
  would hold five orders hostage to work that may itself be re-cut after D2.
- **Two slices of WO-033 are on the path** (the target-worktree emit and the
  target publish); the rest of WO-033 is deferred whole, with its
  obligations mapped in §Migration map.
- **The post-PR loop is in Gate H.** The roadmap's vertical rung already
  names CI classification, comment triage and the source revision guard; the
  operator's v1 description makes automatic review-comment resolution part
  of parity.
- **The pivotal order carries a recorded condition.** The phase-two plan's
  code table declined the reactor split with the reversal condition "the next
  order that adds a host branch carries the split into typed state slices as
  its first phase". D2 adds a host branch. The brief honors the condition
  rather than silently dropping it (§Activation briefs, D2).

## Permitted parallelism

Lane rules are the concurrent plan's, unchanged: no shared primary write
surface in one wave; independent progress; the operator voluntarily serializes
final review through release close.

```text
now      WO-042 (compiler, loadout fixtures, regenerated .claude, products 02/03/04/10)
      ∥  WO-043 (scripts/, work-order metadata, products 06/07, playbook)
      ∥  WO-036 (scripts/test-runner.mjs, root test entry)
next     C2 (discovery: docs/discovery, scripts/harness-probe.mjs)      ∥  C1 (kernel store/core types, worker-store, harness-host input)
then     D1 (harness emit into a target; scripts/lib/harness.mjs)
then     D2 (transport profile, execution environment, reactor branch, worker store)   [operator-run live episodes]
then     E  (verification host over a real worktree)                     ∥  F  (browser adapter package)   ∥  G  (SourceBundle/StoryContract)
then     target publish slice, then H                                     [operator-witnessed]
```

WO-042 and WO-043 both touch `docs/work-orders/README.md` (regenerated) and
the map's recommendation section; those merge as text, as the lane rules
already allow. WO-042 and WO-036 both edit the root `package.json` `test`
entry by one line. Version assignment stays serial: the first merger takes the
next version above the latest published tag; the second retimes with
`release prepare`.

Where each order sits on the operator's chain (core → starter → fork →
target → back): WO-042, WO-043, WO-036, C1 and C2 are core; D1 is the core →
target seam; D2, E and H act in a target; F and G are core ports consumed in
a target. The starter and fork steps are deliberately skipped for the first
proof: exporting read-only workers to a fork ships nothing, so the first
source change is made from core into a target, and the starter is designed
after it.

## Dependency graph

```text
WO-008 ─┐                              WO-026 ─┐        WO-018 ─┐
        ├─(satisfied)─> WO-042 <─────── WO-030 ─┴─> WO-043     WO-013 ─┴─> WO-036
WO-039 ─┘                 ▲
                           │ hard
WO-009 ─(satisfied)─> C2 ──┼──> D1 ──> D2 ──> E ──> H <── F (WO-010 satisfied)
                           │       ▲        │        ▲ <── G
                           └───────┘        │        ▲ <── target publish <── D2
WO-105 ─(reference)─> C1 ─(reference)───────┘        ▲ <── C1 (hard)
                                                     ▲ <── D1 (hard)

WO-033 ──(planning-deferral)──> D2       WO-034 ─(hard)─> WO-033 ─┐
WO-035 ─(hard)─> WO-033                  WO-037, WO-040 ──(planning-deferral)──> D2
```

The full edge list, with relation kinds, satisfied releases and reasons, is
the JSON graph. Relation vocabulary: `hard` and `planning-deferral` block;
`satisfied-by-release` and `satisfied-by-close` block only while unmet;
`reference-only`, `historical-evidence`, `waived` and `superseded` never
block. `planning-deferral` is added to the audit's vocabulary because a
sequencing decision of a pass is not a missing input and must be visibly
reversible by the operator. Supersession of a slice is a node annotation,
never an edge. A script over the JSON found 36 nodes, 53 edges, no dangling
edge and no cycle (the command and result are in the session result and
summarized in the ledger section); every open order's blocking
set is either empty (WO-042, WO-043, WO-036, WO-014, the corpus drafts) or
names exactly the unmet nodes above (the five deferred orders).

## Stop and replan points

1. **R1, mandatory, after C2's record.** If print-mode or exec-mode workers
   do not honor the target worktree's own hooks and settings, D1's design
   changes (the bundle cannot govern the worker from inside the target) and
   D2's containment must come from the DotLn-side host and the harness
   sandbox instead. Nothing after C2 is filed before this checkpoint.
2. **R2, mandatory, after D2's first live receipt.** Decide from the
   episode: whether the reactor split landed or needs its own order; whether
   the worker store needs C1 before E; whether WO-033's remaining phases
   still describe the right starter; whether WO-034's premise (the Angular
   repository's first change is the UIFA shell) survives H's bounded issue;
   the cost and session counts of the first real episode against the audit's
   measures.
3. **R3, after H.** The console framework ADR, migration batches, the starter
   export and the cross-repository pilot are re-cut on the vertical's
   measurements, as the audit proposes and the phase-two plan's open
   decisions already anticipate.
4. **Stop rules.** A WO-042 fixture that requires changing a committed
   loadout's semantic hash stops that order for a decision (the hashes are
   load-bearing). A D2 episode that writes outside its worktree stops the
   gate until the containment is structural, not prompted. A hold from the
   refuter is answered by a changed criterion and a fresh receipt or by an
   operator override event, never by the planner.

## The first external user-value proof

Gate D2 is the proof: one bounded WorkOrder, compiled from a worker loadout
whose authority comes only from its base and explicit grants, dispatched
through the existing transports into a scratch repository outside DotLn that
carries one wrong function, one failing test and one bounded contract; the
worker edits, runs the focused test, reads its diff, commits, returns the
six-field envelope and terminates; the host proves the main checkout and
every path outside the worktree unchanged, the test red then green by its own
runs, the commit present with no DotLn file, and a killed worker replaced
from the continuation without a second commit. That is the primitive every
later gate reuses, and it is the first time a session, an actor or a pattern
does something in another repository that the operator did not do by hand.
It is also the first point at which "disposable workers, near-empty main
thread" becomes true rather than planned, which the 2026-09-06 priming note
named as the phase-three destination.

## Deferred work

Preserved with number, scope and obligations; blocked by a `planning-deferral`
edge on D2 that the operator can waive with a dated note.

- **WO-033 — compiled starter export.** Deferred; partially superseded. The
  target-worktree emit half of phase 2 becomes D1 and the target publish half
  becomes H's slice; phases 1, 3 and 4, the sibling registry and the license
  files at export stay in WO-033. The boy-scout build-first reorder is
  carried by WO-036, which makes build-first structural. Reversal: if the
  operator prioritizes the first external fork over the source-changing
  proof, activate WO-033 first; that is the recorded 2026-09-06 route and an
  operator decision, not a planner one.
- **WO-034 — cross-repository pilot.** Deferred behind D2 and WO-033. Its
  synthetic six demonstrations and workstream projections are retained. Its
  premise that the Angular repository's first change is the UIFA shell may
  conflict with H's bounded issue; that contradiction is deferred to R2, not
  decided here.
- **WO-035 — documentation reset.** Deferred behind WO-033. Nothing in it is
  the product bottleneck; its obligations are retained whole.
- **WO-037 — 5S equipment set.** Deferred behind D2. WO-042 preserves the
  Safety piece's need to deny at `safety-invariants`.
- **WO-040 — rule migration, batch one.** Deferred behind D2. Its observed-gap
  sentence "no unit has a host-observed live activation" is stale since
  WO-039's live records; its classification improves with a real external
  episode. Its local-terms and denominator rules are unchanged.

Floating and adjacent orders are untouched: WO-014 floats; WO-102, WO-103,
WO-105 and WO-107 keep their track, and WO-105 becomes reference evidence for
C1.

## Activation briefs

Each brief carries only what the dispatch asked for. None allocates a
number, grants activation, or fixes a version; the activating pass writes the
full order from the brief and the evidence that exists then.

### C1 — Runtime boundary codecs and the executable program split

- **Objective.** Replace unchecked casts at the boundaries the source-changing
  worker crosses with versioned positive decoders that return a typed result
  naming the JSON path on failure: the kernel JSONL store envelope
  (`EventEnvelope` schema 1), the worker store's stored requests, results
  and receipts, the harness hook input, and `Program` continuations carried
  in persisted payloads. Split `ExecutableProgramV1` (Done, Emit, Invoke,
  Await, Guard, Sequence) from the full `Program` grammar at the type level
  with the existing `EVALUABLE_PROGRAM_KINDS` as the single source, so an
  unsupported kind fails at decode, not inside `stepProgram`. Give `replay`
  an optional environment projector whose default preserves today's
  documented `rngState` and `policy` contract byte for byte.
- **Why it follows.** D2 persists a real external effect behind a
  continuation; a malformed store must refuse before dispatch, and the
  operator's repository (H) is the first place a misdecode has an external
  cost.
- **Entry criteria.** Any free lane; WO-042 merged is recommended so the
  compiler version churn settles first; WO-105's crash-shape sweep, if run,
  is reference evidence.
- **Falsifiable exit.** Every listed boundary rejects a corpus of malformed
  inputs (missing field, wrong schema version, non-string command id,
  unsupported program kind, truncated line, foreign key) with a typed
  failure naming the path; every existing kernel, skeleton and corpus test
  and the demo replay identity pass byte-identically; the WO-101 corpus
  enumerates the executable kinds from the new type.
- **Primary seam.** `packages/kernel/src/store.ts` and `core.ts` (decoders
  and the type split); `packages/skeleton/src/worker-store.ts` and
  `harness-host.ts` (input decode).
- **Major risk.** Scope creep into a schema library or SQLite; the kernel's
  zero-dependency rule (self-written decoders, as FNV and canonical JSON
  were).
- **Non-goals.** SQLite; new event types; any change to hash preimages or
  the compiled-program contract; a general JSON-schema dependency.

### C2 — Writing-worker harness truth

- **Objective.** In a scratch Git repository that is not DotLn, observe what
  the installed harnesses do when launched non-interactively as a worker that
  must edit files: whether the worktree's own `.claude/settings.json` deny
  rules and generated hooks apply in print mode; which tool-allowlist form
  admits Edit, Write and a bounded Bash; whether the sandbox confines writes
  to the worktree; whether hooks under the target's `.claude/hooks` can import
  a runtime by absolute path; the structured result envelope with tools
  enabled; session persistence and kill or recovery behavior; and the Codex
  `workspace-write` equivalent with named filesystem permissions. Record with
  the WO-039 phase-zero shape and privacy rules: field shapes, no paths, no
  identifiers.
- **Why it follows.** The canonical launch shape disables every tool; no
  record shows a governed writing worker, and D1 and D2 are designed from
  observed rows only (Principle 15).
- **Entry criteria.** The WO-039 record and the WO-009 addendum exist; the
  operator runs the smokes from a terminal outside the sandbox.
- **Falsifiable exit.** A dated `docs/discovery/writing-worker-smoke-<date>.md`
  and JSON with observed, blocked and unavailable rows; at least one refusal
  produced by a generated hook inside the foreign worktree, or an explicit
  row stating it could not be produced; every capability D1 and D2 consume
  cites a row.
- **Primary seam.** `scripts/harness-probe.mjs` (extended) and
  `docs/discovery/`.
- **Major risk.** Print mode ignores project hooks in the target, which moves
  containment to the host and sandbox and redesigns D1 (replan R1).
- **Non-goals.** Any production emit; user settings; a Codex hook claim; a
  writing transport in `worker-transport.ts`.

### D1 — Target-worktree harness bundle

- **Objective.** `harness emit --out <target-worktree> --runtime-root <launchpad>`
  writes a bundle whose hooks import the launchpad's pinned built runtime by
  absolute path into the target's `.claude/` and instruction block, all under
  the target worktree's local exclude, so no DotLn file is Git-visible there;
  `harness check --out` verifies it; removing the worktree leaves the target
  clean. The manifest records the runtime root's hashes and, after WO-042,
  any grant's provenance.
- **Why it follows.** D2's writer isolation, permission denials and Stop
  checks come from these hooks; WO-033 planned this inside a four-phase epic.
- **Entry criteria.** WO-042 merged; C2's record shows the target's hooks
  apply to the worker's launch mode.
- **Falsifiable exit.** A fixture emits into a scratch non-DotLn repository;
  `git status --porcelain` there is empty; a generated hook refuses a denied
  effect there in an operator-run smoke; `harness check` passes and refuses a
  one-byte drift; the receipt reduces paths to shapes.
- **Primary seam.** `packages/compiler/src/harness.ts` (the hook text's
  import root as a profile field) and `scripts/lib/harness.mjs`.
- **Major risk.** Absolute paths leaking into a committed file; hook pins
  drifting after a rebuild of the launchpad.
- **Non-goals.** The starter export, kit manifest, overlay, registered
  repositories, sync.
- **Supersedes.** WO-033 phase 2, the target-worktree emit half only.

### D2 — Single-repository source-changing worker

- **Objective.** A new transport profile (`source-change-v1`: tools enabled,
  cwd the assigned target worktree, base envelope allowing `repo.write` and
  `git.local` inside the worktree and denying remote, credential, settings
  and sandbox effects), a worker loadout compiled under WO-042's floor, and
  the flow: WorkOrder compiled → fresh worker in the D1-governed worktree →
  edit → focused test → read the diff → commit → six-field envelope →
  terminate; the host records the commit identity as the effect receipt so
  recovery is idempotent.
- **Why it follows.** It is the primitive; nothing in the vertical exists
  without it.
- **Entry criteria.** WO-042 and D1 merged; C2's record; the recorded reactor
  condition honored: this order's phase 1 splits the reactor's state into
  typed slices with every existing trace byte-identical, or the activating
  pass files that split as a separate bounded order and records why; the
  operator available to run live episodes outside the sandbox.
- **Falsifiable exit.** Main checkout hash unchanged; a sentinel tree beside
  the worktree unchanged; the parent session's transcript grows by the
  envelope only; harness, model and effort recorded as launch claims with
  readback `unknown`; the test observed red by a host run before dispatch
  and green after; the commit present in the target with no DotLn file; a
  kill after the commit and before the result persists recovers by commit
  identity without a second commit; a kill before the commit re-dispatches
  exactly once; the live receipt filed from an outside terminal.
- **Primary seam.** `worker-transport.ts` and `execution-environment.ts`
  (the profile), `reactor.ts` (the host branch, behind the split),
  `worker-store.ts` (the commit-identity receipt).
- **Major risk.** The reactor's growth; a non-idempotent external effect;
  the sandbox's inability to dispatch transports; a widened envelope (closed
  by WO-042).
- **Non-goals.** Pull requests, browser evidence, tracker intake, several
  repositories, any UI, the operator's Angular repository.

### E — Blinded verification and repair over a real repository

- **Objective.** WO-010's loop with a live verifier over D2's repository: a
  planted implementation that passes a superficial test and violates the
  contract; a finding with expected, observed, reproduction and evidence
  references; a focused repair WorkOrder executed by a fresh D2 worker
  bounded to the declared surfaces; re-verification from the original
  contract. The verifier receives contract, diff, tests and a repository
  snapshot, never the implementer's narrative.
- **Why it follows.** D2 proves change; E proves the change can be wrong and
  caught without the implementer certifying itself.
- **Entry criteria.** D2 merged; WO-010's contract (satisfied); the operator
  runs the live episodes.
- **Falsifiable exit.** The planted defect is caught by a live verifier; the
  negative result cannot be relabeled by any implementer-emitted event
  (matrix fold); the repair diff is bounded to the declared surfaces;
  re-verification passes from the original contract; behavior claims carry
  `live` evidence from host-run tests.
- **Primary seam.** `verification-host.ts` and `verification-protocol.ts` (a
  snapshot profile over a real worktree with test execution), the reactor's
  verification branch.
- **Major risk.** Live-model cost and variance; a snapshot profile that runs
  untrusted target tests (isolation is the worktree plus sandbox, not a
  security boundary).
- **Non-goals.** Code-review episodes, post-PR loops, visual or network
  claims.

### F — Browser evidence adapter

- **Objective.** `visual` and `network` claim types in `verification-v1`,
  witnessed by a Playwright-driven scenario over a small synthetic local web
  application: navigate, interact, DOM and accessibility snapshot, screenshot
  attached to the exact criterion, network trace, console capture, trace
  retained, browser and context closed or recovered. A DOM-only witness cannot
  satisfy a visual criterion.
- **Why it follows.** The operator's "walk the app" rule; WO-010 deferred these
  claim types to their consumer; H needs them.
- **Entry criteria.** E merged; an ADR-0002 amendment recording the Playwright
  runtime dependency, its consumer package outside the kernel and compiler,
  and the third-party inventory duty; browser binaries observed in the
  environment record (they are, through the connected server, but the adapter
  must not require the MCP server).
- **Falsifiable exit.** Fixtures: a visual criterion with DOM-only evidence is
  `unverified`; a screenshot witness attaches to its criterion; a network claim
  needs request evidence; a console error is an explicit failing witness; a
  kill fixture proves the browser closes or recovers; a replacement verifier
  replays the saved scenario.
- **Primary seam.** A new workspace package for the adapter and the compiler's
  `verification-v1` extension (compiler version bump).
- **Major risk.** The first heavy runtime dependency; flaky screenshots;
  confusing the harness's MCP server with the product's adapter.
- **Non-goals.** OCR, the console UI, the Angular application.

### G — SourceBundle to StoryContract

- **Objective.** The `SourceAdapter` port's first generic implementation from a
  GitHub Issue: an immutable SourceBundle (rich sections, discussion, images
  as evidence references, revisions) and a pure compiler to a StoryContract
  whose statements carry provenance to bundle spans and are classified as
  requirement, non-requirement, struck, example, question, answer, visual
  annotation, current-behavior observation, inference, assumption,
  contradiction or open decision; a source-revision guard that invalidates
  only derived items.
- **Why it follows.** H's contract must come from a real tracked-work
  artifact; the enterprise tracker adapter stays outside core (ADR-0002
  Decision 2).
- **Entry criteria.** E merged (the criteria consumer); a personal-repository
  issue as the fixture; nothing from any private tracker.
- **Falsifiable exit.** Fixtures over synthetic issues: every derived
  statement resolves to a bundle span; a material revision invalidates exactly
  the derived items; the contract compiles into `AcceptanceCriterion`s the E
  host accepts; secrets and resolved URLs never enter the bundle (the external
  target binding rule); statements a model episode inferred are labeled as
  such.
- **Primary seam.** `packages/compiler` (pure StoryContract compile) and a
  skeleton adapter over the GitHub CLI, read-only.
- **Major risk.** Model-in-the-loop classification passing as deterministic.
- **Non-goals.** The enterprise tracker; an impact map beyond a read-only
  cartographer stub; RepoProfile authoring.

### Target publish slice (with H)

- **Objective.** Push the target branch and open its pull request through the
  existing GitHub helpers with the camouflage lint, under an explicit
  `remote` grant carrying `operator` provenance (WO-042), from the launchpad;
  the pull-request body is generated from the contract, diff and evidence
  matrix, never from narrative.
- **Why it follows.** Nothing to publish exists before D2; H needs it.
- **Entry criteria.** D2 merged; WO-042's grants.
- **Falsifiable exit.** A fixture publishes to a scratch remote through the
  `gh` stub with a body generated from artifacts; a deny-listed term refuses;
  no DotLn file or vocabulary reaches the target.
- **Primary seam.** `scripts/worktree.mjs` publish path for a target
  repository.
- **Major risk.** The first remote effect under compiled authority.
- **Non-goals.** Merge, release, per-repository release policy.
- **Supersedes.** WO-033 phase 2, the target publish half only.

### H — Angular source-to-verified-PR vertical with the post-PR loop

- **Objective.** One bounded issue in the operator's public Angular repository
  travels SourceBundle → StoryContract → impact map → implementation
  WorkOrder → D2 worker → focused tests and build → F evidence → E
  verification and repair → conventional commits → pull request with a
  generated title and body → the post-PR loop: CI classification, automated
  review comments triaged and resolved by fresh bounded workers, the source
  revision guard, until a human-controlled terminal state. Measured:
  main-thread context, model input and output, sessions, human touch time,
  cycle time, retries, cost, evidence coverage, review findings, operator
  interventions, and the parity checklist above item by item.
- **Why it follows.** Every earlier gate is a primitive; this is the loop the
  operator has today in v1.
- **Entry criteria.** D1, D2, E, F, G, C1 and the target publish slice merged;
  an Angular repository profile authored by a read-only archaeology episode;
  the operator witnesses.
- **Falsifiable exit.** The pull request exists with a generated body; every
  acceptance criterion is evidenced; findings are resolved through repair;
  every automated review comment is resolved by the loop or recorded as
  needing a human with its reason; the measures are recorded with methods;
  no DotLn file or vocabulary is in the target.
- **Primary seam.** The `DeliveryAdapter` and the composition of the earlier
  gates.
- **Major risk.** The target toolchain's build time; scope creep into console
  v1; the tracker adapter drifting into core.
- **Non-goals.** The UIFA shell, cross-repository workstreams, the starter
  export, the console framework decision.

## Migration map

| Existing order | Relationship                   | Obligations and where they go                                                                                                                                                                                                                                     |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WO-036         | remains active                 | Unchanged; the WO-033 boy-scout build-first item is carried by its structural build-first rule.                                                                                                                                                                   |
| WO-033         | partially superseded; deferred | Phase 2 target-worktree emit → D1; phase 2 target publish → H's slice; phase 1 configuration root, Beacon portability, phase 3 export, kit and overlay, phase 4 sync, sibling registry, license files at export → retained in WO-033; boy-scout reorder → WO-036. |
| WO-034         | deferred                       | All obligations retained; the "first Angular change is the UIFA shell" premise is a recorded contradiction with H's bounded issue, decided at R2.                                                                                                                 |
| WO-035         | deferred                       | All obligations retained.                                                                                                                                                                                                                                         |
| WO-037         | deferred                       | All obligations retained; WO-042 preserves the `safety-invariants` deny path its Safety piece needs.                                                                                                                                                              |
| WO-040         | deferred                       | All obligations retained; one observed-gap sentence is stale (live activations now exist) and is corrected at activation, not now.                                                                                                                                |
| WO-039         | satisfied by existing evidence | The audit's WO-044, WO-045 and WO-046 map onto its phase-zero record, live hooks and context accounting; the residual is C2.                                                                                                                                      |
| WO-009, WO-010 | satisfied by existing evidence | Transports, worker store, leases, recovery (D2 extends); the verification loop (E lifts).                                                                                                                                                                         |
| WO-011         | satisfied by existing evidence | The ten units govern this repository's sessions through WO-039's lowering.                                                                                                                                                                                        |
| WO-008         | reference only                 | The VER-001 F2 finding is WO-042's origin.                                                                                                                                                                                                                        |
| WO-032, WO-041 | reference only                 | The board's Builds panel regenerates its render expectations under WO-042; the refuter judges this pass.                                                                                                                                                          |
| WO-014         | reference only, floating       | Unchanged.                                                                                                                                                                                                                                                        |
| WO-102–WO-107  | reference only, adjacent track | Unchanged; WO-105 is reference evidence for C1.                                                                                                                                                                                                                   |

No existing order is declared superseded whole. The prose "Depends on"
paragraphs of closed orders are not edited (never back-fill history); WO-043
labels their token view.

## Planning-risk register

| Risk                                                 | Evidence today                                                                                                                                                                                    | Mitigation on the path                                                                                                                                                                      | Trigger to revisit                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Authority widening                                   | Support claims and permission emissions widen the compiled envelope; the lowered hooks enforce that envelope; VER-001 F2 reproduced it; latent today.                                             | WO-042 first; grants carry provenance; the tooltip projects the envelope. Residual: provenance is reviewed text, not authenticated (the same limit WO-029 and the override record).         | Any loadout authored outside this repository (fork, community build, registered repository). |
| Malformed persisted state                            | Store envelope and hook input are casts; the worker store refuses torn logs and dead locks; transport results are validated; no misdecode demonstrated.                                           | C1, parallel, mandatory before H; WO-105 as reference evidence.                                                                                                                             | A D2 episode whose recovery reads a state the decoder cannot classify.                       |
| Unsupported executable grammar                       | `stepProgram` throws on deferred kinds; the subset is an exported constant and a corpus, not a type.                                                                                              | C1's type split; the corpus enumerates from the type.                                                                                                                                       | A persisted continuation of a deferred kind.                                                 |
| Application-specific replay assumptions              | `replay` reads `rngState` and `policy` by key; documented in product 02; only one application state shape exists.                                                                                 | C1's optional projector with a byte-identical default.                                                                                                                                      | A second reactor state shape (D2's typed slices are the first candidate).                    |
| Dependency drift                                     | The index misreports closed orders as blocked; activation reads no dependency; the map disclaims.                                                                                                 | WO-043; the JSON graph seeds it; only typed hard and deferral entries block.                                                                                                                | Any new order that cites a historical id.                                                    |
| Integration-package growth                           | 46 skeleton files; one decider the ownership guard enforces; the recorded split condition on the next host branch.                                                                                | D2 honors the condition as phase 1 or a separate order; the audit's package split is not adopted before a seam needs it.                                                                    | R2.                                                                                          |
| Self-hosting masking lack of external value          | The repository governs, tests, documents, visualizes and plans itself; the loop exists for no user.                                                                                               | The rule "makes an existing claim true in a real session"; machinery in this horizon limited to WO-043, WO-036, C1; D2 as the proof; H measured against v1 parity.                          | Any pass that files a machinery order without a demonstrated blocker to a real session.      |
| Model and harness assumptions not yet verified       | No record of a tool-enabled worker in a foreign worktree; the sandbox refuses CLI transports in-session; effective effort readback unavailable; every runtime change needs a live feedback audit. | C2 before D1; operator-run live episodes; launch claims labeled; the feedback refresh candidate stays recorded.                                                                             | R1.                                                                                          |
| Unclassified effectful tools bypass the writer guard | The guard gates Bash, Edit and Write; the permission classifier treats every other tool as a read; this pass's listing subagent ran shell commands through `Monitor` read-only.                   | Recorded as a candidate: the harness profile enumerates the tools the harness exposes and the host fails closed on an unclassified effectful tool. Not a WO-042 concern (a different seam). | Before D1 emits a bundle into a target, so the worker's governance has no known bypass.      |
| Planning procedure under the compiled build          | "Run on the clean main checkout" needed a planning branch before the first write; the pass stalled until the operator created it.                                                                 | One-sentence correction in product 07 and the playbook (this pass).                                                                                                                         | A future compiled unit that refuses another documented procedure.                            |
| Clean-room exposure from external material           | The audit named a tracker and the employer; generalized on every committed surface; the local-terms screen runs over new prose.                                                                   | The capture stays ignored; committed text says "enterprise tracker".                                                                                                                        | Any future dispatch that quotes private material.                                            |
| Refutation gate cost                                 | Every pass needs an operator-run refuter episode; a deliberately unfiled loop order may draw a hold.                                                                                              | The command and the intended override route are recorded above.                                                                                                                             | A third consecutive hold, which stops the pass by rule.                                      |

## Lineage-preservation appendix

Ideas from the 2026-09-06 priming note and the repository's own long-range
records, with where each stays recorded and what this pass does to it. The
note's classifications: **invariant retained**, **immediate planning gate**,
**critical-path destination**, **deferred candidate**, **contradicted by
current repository evidence**, or **superseded sequence with obligations
preserved elsewhere**. The table is a register, not a backlog.

| Enduring idea                                                                                                           | Source                                                | Immediate relevance                                                                   | Activation prerequisite                      | Where it stays recorded                            | This pass                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| A build, not a biography                                                                                                | note §1; vision §The one-paragraph story              | WO-042 makes the build's safety layer real; D1 carries it into a target               | none                                         | vision; WO-039; this plan                          | invariant retained                            |
| Actors are the unit, people are actors                                                                                  | note §1; product 13; WO-032                           | D2 is an actor in a target; the board shows it                                        | none                                         | product 13, 04                                     | invariant retained                            |
| The shelf compiles                                                                                                      | note §1; vision §The differentiated interface         | WO-037 preserved; WO-042 keeps the Safety piece's deny path                           | D2 and R2                                    | WO-037; map candidates (remaining shelf)           | deferred candidate                            |
| Evidence precedes done; implementer never verifies                                                                      | note §1; Principle 6; ADR-0006                        | E lifts WO-010 onto a real repository                                                 | D2                                           | Principles; WO-010; brief E                        | invariant retained; critical-path destination |
| Three horizons; Horizon 3 never distorts Horizon 1                                                                      | note §1; vision                                       | The path is Horizon 1 only until H                                                    | none                                         | vision; roadmap §Post-1.0                          | invariant retained                            |
| Six-month livability and point of view before efficiency                                                                | note §1; vision                                       | Applied to WO-036 (efficiency after the loop exists)                                  | none                                         | vision                                             | invariant retained                            |
| The operator's chain (core → starter → fork → target → back)                                                            | note §2; ledger 2026-09-06                            | Each order's chain position is named in §Permitted parallelism                        | none                                         | ledger; product 03                                 | invariant retained                            |
| The refuter's eleven rules                                                                                              | note §3; receipts 001–006                             | Applied to WO-042 and WO-043 in §Quality gates applied                                | none                                         | refutations/README; receipts                       | invariant retained                            |
| The 2026-09-06 wave plan and fork-binding path                                                                          | note §4; phase-two plan                               | Replaced by the critical path                                                         | operator decision to reverse                 | phase-two plan (history); this plan §Deferred work | superseded sequence, obligations preserved    |
| Console parity contract v1                                                                                              | note §5; map candidates                               | None until the loop exists                                                            | WO-032 and WO-037 merged; a console consumer | map candidates                                     | deferred candidate                            |
| Intent declaration and the stranger test                                                                                | note §5; receipt 006; map candidates                  | H is the first bounded intent from a tracked artifact; the stranger test stays v1.0's | H                                            | map candidates; roadmap v1.0.0                     | deferred candidate                            |
| Migration batches two onward                                                                                            | note §5; WO-040; map candidates                       | Deferred behind D2 with WO-040                                                        | WO-040                                       | map candidates                                     | deferred candidate                            |
| Source-writing worker v1                                                                                                | note §5; roadmap; product 03 §Ports                   | D2                                                                                    | WO-042, C2, D1                               | brief D2                                           | critical-path destination                     |
| Drag-equip authoring                                                                                                    | note §5; map candidates (wave 5)                      | None on the path                                                                      | WO-032, WO-037, a console shell              | map candidates                                     | deferred candidate                            |
| Remaining shelf entries                                                                                                 | note §5; map candidates                               | None on the path                                                                      | WO-037                                       | map candidates                                     | deferred candidate                            |
| Isomorphic views beyond three codecs; semantic zoom                                                                     | note §5; product 04                                   | None on the path                                                                      | a console consumer                           | product 04                                         | deferred candidate                            |
| Replay scrubber and first divergence                                                                                    | note §5; roadmap §Projections & console               | None on the path                                                                      | the projections rung                         | roadmap                                            | deferred candidate                            |
| Presence policy compiled (the resident Gardener)                                                                        | note §5; ADR-0007; roadmap candidates                 | None on the path                                                                      | D2 (a worker that can act unattended)        | ADR-0007; roadmap                                  | deferred candidate                            |
| Browser verification adapter                                                                                            | note §5; product 03 §Ports; WO-010 non-goals          | F                                                                                     | E; ADR-0002 note                             | brief F                                            | critical-path destination                     |
| Source-to-deliverable vertical with the post-PR loop                                                                    | note §5; roadmap rung; ADR-0002 Decision 2            | G and H                                                                               | E                                            | briefs G, H; roadmap                               | critical-path destination                     |
| Skill pack export; bring your own agent                                                                                 | note §5; product 03 §Agent enablement skills; WO-033  | None on the path                                                                      | WO-033                                       | product 03; WO-033                                 | deferred candidate                            |
| Phase four: v1.0.0 stranger test, real forks, owner-sovereign profile, hats, cohorts, editions                          | note §5 phase four; roadmap; ADR-0006; map candidates | None on the path                                                                      | H and a second instance                      | roadmap; ADR-0006; map candidates                  | deferred candidate                            |
| Phase five: counterfactual runs, προτείνω, the founding catalog, Embodied Explorer, toolbox                             | note §5 phase five; product 11; roadmap §Post-1.0     | None on the path                                                                      | v1.0.0                                       | product 11; roadmap; ledger chat 005               | deferred candidate                            |
| "The most valuable order makes an existing claim true in a real session"                                                | note §6                                               | The pass's prioritization rule                                                        | none                                         | this plan; ledger 2026-09-08                       | invariant retained                            |
| The do-not-relitigate list (license, topology, kit and overlay, zero deps, no framework, roles, floor, correction unit) | note §6; ADRs; ledger Resolutions                     | Honored: nothing here reopens any                                                     | none                                         | decisions; ledger                                  | invariant retained                            |
| Ask the operator only what only the operator can answer                                                                 | note §6                                               | Two items for the operator: the refuter run and the WO-034 premise at R2              | none                                         | this plan                                          | invariant retained                            |
| A correction is a typed event                                                                                           | note §6; product 02 §Semantic correction events       | The operator's mid-pass messages were treated as a question, answered, and captured   | none                                         | product 02; the capture                            | invariant retained                            |
| "After WO-039, core runs on its own compiled build"                                                                     | note §2                                               | Now true; this pass ran under it                                                      | none                                         | WO-039 evidence                                    | contradicted only in tense (it is done)       |
| The unnamed secondary gap (declare intent, the stranger)                                                                | receipt 006 disposition 3                             | H names the first bounded intent; the stranger stays v1.0                             | H                                            | receipt 006; map candidates                        | deferred candidate                            |
| Override attributable, not refusable                                                                                    | receipt 006 disposition 2; WO-041 assumption 1        | Unchanged limit; the same limit bounds WO-042's grant provenance                      | an external principal                        | WO-041; WO-042                                     | invariant retained                            |

## Declined candidates — the NoOp register

Each entry follows the `NoOpIntent` shape: reason, evidence, reversal
condition.

- **Reactivating WO-040 now.** NoOp. Live activations exist since WO-039, but
  the classification of the remaining shapes is a better decision after one
  real external episode. Reverse after D2's receipt at R2.
- **Activating WO-033 first (the 2026-09-06 fork-binding path).** NoOp. An
  export of read-only workers ships no actor. Reverse if the operator
  prioritizes the first external fork over the source-changing proof; that is
  the operator's decision and the recorded 2026-09-06 route.
- **Filing numbered orders for every later gate (the audit's WO-044 to
  WO-052).** NoOp. Briefs with entry criteria only; the numbers are free and
  stay free. Reverse per brief when its entry criteria hold.
- **A separate dependency registry or scheduler.** NoOp. The authority file
  stays the source; the index projects. Reverse when a second launchpad needs
  cross-repository dependency state.
- **Running the refuter inside this pass.** NoOp. The sandbox refuses the
  transports and the dispatch reserves the budget decision to the operator.
  Reverse never; the operator runs it.
- **Splitting `reactor.ts` as its own order now.** NoOp. The recorded
  condition binds D2. Reverse if D2's activating pass finds the phase too
  large and files the split separately.
- **Signing or authenticating grants.** NoOp. Provenance is reviewed text
  under the same limit WO-029 recorded. Reverse at a non-author build or an
  external principal.
- **Closing the unclassified-tool bypass in this pass.** NoOp. Hook behavior
  is implementation; a candidate is recorded in the map. Reverse before D1
  emits into a target.
- **Product-doc write-backs beyond the one procedure sentence.** NoOp. WO-042
  and WO-043 own their write-backs; the roadmap's rungs already describe the
  vertical. Reverse never inside a planning pass.
- **Editing closed orders' "Depends on" paragraphs to fix "blocked" rows.**
  NoOp. History is not back-filled; WO-043 labels the token view.
- **Reordering the `npm test` chain now.** NoOp. WO-036 makes build-first
  structural.
- **Deciding WO-034's Angular-first-change premise against H now.** NoOp. A
  recorded contradiction for R2.
- **Adopting the audit's package split (`runtime-contracts`,
  `worker-runtime`, ...).** NoOp. No seam needs it yet; D2's phase 1 is the
  first typed slice. Reverse when a second host branch lands.

## Quality gates applied

- **Acyclic.** A script over the JSON graph found no cycle across all edges
  (command and output in the ledger section). Slice supersession is a node
  annotation, so it cannot create one.
- **Only unmet hard dependencies and dated planning deferrals block.** The
  graph's relation semantics say so; WO-043 makes the machine say so; until
  it lands, the index's token view remains a labeled observation.
- **Independently testable criteria.** Every WO-042 and WO-043 criterion
  names a fixture, a hash, a rendered output, a refusal or a recorded diff
  that a fresh session can reproduce without the executor's narrative.
- **One capability per immediate order.** WO-042 changes one contract
  (compiled authority semantics) at one seam (the compiler's authority path);
  its render and manifest changes are projections of that contract; its
  bundle regeneration changes pins only. WO-043 changes one projection
  (dependency truth) at one seam (`scripts/lib`) with one lifecycle check.
  Neither adds an external adapter, a persistence shape, a compiler target, a
  UI projection, self-hosting migration, cross-repository behavior or a live
  proof.
- **Visible and effective authority cannot diverge.** After WO-042 the
  tooltip's GRANTS and RESTRICTIONS, the WorkOrder operation lists, the
  envelope the hooks enforce and the bundle manifest are all projections of
  one effective envelope; authored strings are labeled notes and reject when
  they name an effect id against it.
- **External source modification precedes starter export, cross-repository
  coordination, broad rule migration and UI expansion.** D2 precedes WO-033,
  WO-034, WO-040 and every UI candidate by the deferral edges.
- **Contradiction scan.** WO-034's "first Angular change is the UIFA shell"
  against H's bounded issue: recorded for R2. WO-033's assumption that the
  export is the fork-binding order against this path: recorded as a reversal
  condition. WO-040's stale live-activation sentence: corrected at its
  activation. The phase-two plan's wave plan: marked superseded in part with a
  dated note. The 2026-09-06 receipts' standing pass verdict: untouched; a
  fresh receipt judges the new sequence. No settled decision (licenses,
  topology, kit and overlay, zero runtime dependencies in the kernel and
  compiler, no framework before evidence, the five roles, the floor, the
  correction unit) is reopened; F's Playwright dependency is a note under
  ADR-0002's own amendment path, not a relitigation.
- **Facts and recommendations kept apart.** The source-verification report
  holds the facts with locations; the briefs are recommendations and say so.
- **The refuter's eleven rules against the two filed orders.** Direction:
  WO-042's hash and bundle criteria are equalities, its rejection criteria
  name the diagnostic; WO-043's projection criteria name the blocking set.
  Denominators: none are classified by the executor; the mutation kills are
  reproduced by the runner. Pre-registered baselines: the four semantic hashes
  and the activation base's bundle. Mechanism labels: no prose is retired, so
  no removal claim. Cold-start: unaffected. Starter loadout prescription:
  not applicable. Terms: no term list is committed; the screen runs over the
  new prose. A person on the board: not applicable. Drift can cite §What
  DotLn is not: both orders name their thesis surfaces (WO-042 the
  one-paragraph story's safety layer and Principle 5; WO-043 machinery). A
  hold is answered by the operator: recorded above. Deferrals name recorded
  candidates: every deferral points at a brief or a map candidate. Role
  service: WO-042 serves engineer, tester and devops through named fixtures;
  WO-043 serves showrunner and devops through the index and the refusal.

## Reversal conditions for the plan

- If the operator prefers the external fork first, WO-033 runs before D2 and
  the deferral edges on WO-033 are waived with a dated note; nothing else
  moves.
- If C2 shows that target-worktree hooks cannot govern a print-mode worker,
  D1 becomes a host-side containment order and D2's acceptance keeps its
  external checks (sentinel tree, main checkout hash, commit identity).
- If WO-042's floor breaks a committed loadout's hash, the order stops for a
  decision rather than moving a hash.
- If a third consecutive refutation hold stops this pass, the next pass
  carries every hold forward or names the changed criterion, as the gate
  requires.
