# Execution guide — for any model session working in this repo

You may be Claude (any tier), Codex, or something newer. The repo, not your
transcript, is the shared memory. This guide is the operating contract.

## Read order for a cold start

1. `CLAUDE.md` / `AGENTS.md` (same file) — boundary rules.
2. Your assigned work order in `docs/work-orders/` — your entire task scope.
3. The blueprint docs it cites (`docs/product/…`) — cited sections only; do not
   bulk-load the corpus into context. The ledger and intake exist for lookup,
   not for reading end-to-end.

## Operator resume phrases — how you get dispatched

The operator's entire instruction to you may be a single phrase of the form
`resume: <intent>`. That phrase **is** your dispatch. Do not ask for context and
do not ask which work order: the durable control state answers both, and the
operator is deliberately not repeating themselves.

1. Run `npm run resume --silent -- status --json`. The JSON names the active work order
   and its authoritative path, the current phase, latest verification artifact
   and verdict, final review, latest actor attestation, effort drift, latest
   checkpoint, and legal next actions. Both `status` forms fold the canonical
   append-only legacy `docs/control/resume.jsonl` and per-order
   `docs/control/orders/WO-NNN.jsonl` segments; both are read-only and neither
   appends an event nor rewrites `docs/control/current.md`. The Markdown file is
   a disposable human projection, never an API: lifecycle peers consume the
   JSON status, while an operator may read the Markdown. If either status form
   warns that the projection disagrees with the fold, trust the returned fold,
   report the mismatch, and let the next legal state-changing command refresh
   the projection; never repair it by hand.
   Timing is projection data: `recordedAt` is the latest event's append time or
   `null`; `elapsed` maps each phase's latest completed attempt to signed
   milliseconds or `"unknown"` when an endpoint predates the migration.
   Durations never affect legality and do not use recovered checkpoint times.
   In a `wo-NNN` worktree, the branch selects its order. Append
   `--work-order WO-NNN` to override it or to select on main. Without a branch
   selection, one open order selects itself; when several are open, bare human
   `status` lists them, while `status --json` and transitions require the flag.
   Unknown IDs refuse and list the open orders. The JSON keeps the existing
   selected-order fields and adds `orders[]` with each known order's phase,
   latest verdict, append time, and elapsed phases. Status observes segments in
   this checkout, not unmerged changes in sibling worktrees. The Markdown
   projection lists all non-closed orders followed by the latest closed one.
2. Run the matching transition and follow the paths it prints — they are
   authoritative, and they are the whole briefing:

   | Operator says           | You run                                                                                                                                                                                                                    | You then                                                                                                                                                                                                                                                                 |
   | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `resume: status`        | `npm run resume -- status` (or `npm run resume --silent -- status --json` for a machine consumer)                                                                                                                          | report; both forms are read-only, append nothing, and do not rewrite a stale Markdown projection                                                                                                                                                                         |
   | `resume: times`         | `npm run resume --silent -- times`                                                                                                                                                                                         | report the read-only JSON observation in append order, its three source labels and count of local refs read; refuse missing/mismatched required refs; append nothing and leave the projection unchanged                                                                  |
   | `resume: next`          | `npm run resume -- next`                                                                                                                                                                                                   | in `active`, execute the emitted work-order path; in `closed`, name other in-flight orders; only when none remain, report between work orders and give the exact `worktree start` command                                                                                |
   | `resume: fix`           | `npm run resume -- fix`                                                                                                                                                                                                    | repair, reading BOTH the original work order and named failure source; if a repair was prematurely marked complete, the phrase may reopen it only while that unresolved source remains                                                                                   |
   | `resume: verify`        | `npm run resume -- verify`                                                                                                                                                                                                 | verify, writing the exact `VER-NNN` path it allocates                                                                                                                                                                                                                    |
   | `resume: final review`  | `npm run resume -- final-review`                                                                                                                                                                                           | review into the allocated `FINAL-NNN`; on pass, record it, commit the reviewed state, push only the WO branch, and open its PR                                                                                                                                           |
   | `resume: release close` | run the exact `cd <main> && node <subject>/scripts/release.mjs close WO-NNN --publish` command projected by `resume release-close` or printed by `worktree publish`; after the subject is already removed, use main's copy | finish the merged worktree with the reviewed subject helpers, update main, and either publish the validated annotated tag plus its matching GitHub Release or record the honest no-release result; if Release creation fails after the tag push, rerun from updated main |

   At the dated Codex baseline, run each **state-changing** `resume` command
   with explicit outside-sandbox approval on its first invocation. Codex
   workspace-write protects the resolved Git directory, while each transition's
   recovery checkpoint writes a Git object and ref there. `status` and `times` are read-only;
   `next` appends no event and creates no checkpoint but refreshes the workspace
   projection. Neither needs Git escalation. Never run a transition sandboxed
   and then repeat it: the transition records even when its optional checkpoint
   fails. Outside-sandbox approval covers the entire project-controlled `npm`
   process, not only Git. Inspect the exact command, the `resume` mapping in
   `package.json`, and the current `scripts/resume.mjs` diff before requesting a
   one-invocation approval; never persist an allow rule for it. See
   `docs/AI-HARNESS-SECURITY.md` for the tested versions, Claude's current
   behavior, verification, and rollback.

3. Record your outcome when your evidence exists, not before:
   `npm run resume -- implementation-ready <actor-flags>` (executor: the
   deliverable is built and its work-order evidence is green, so it is ready to
   verify), `npm run resume -- verification-result pass|fail <actor-flags>`,
   `npm run resume -- repair-complete <actor-flags>`, or
   `npm run resume -- final-review-result pass|fail <actor-flags>`. The required
   suffix is
   `--harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>`;
   use the exact usage printed by a refusal and never infer a value the harness
   did not expose. Before `verification-result` or `final-review-result`, put
   exactly one `**Actor attestation:** {<normalized actor JSON>}` line in the
   allocated report beside the human-readable actor prose. The completion
   command refuses if that header is absent, malformed, or differs from its
   flags; an unrecognized supplied effort appears in the JSON as `unknown` plus
   `raw`. This pre-append check resolves the report/event ordering without
   editing immutable evidence afterward. **A repair episode is not
   finished until `repair-complete` is recorded** — otherwise the next session
   resumes into the wrong phase. The remaining action,
   `npm run resume -- activate WO-NNN docs/work-orders/<file>.md`, opens a work
   order from phase `none` or `closed`; `npm run worktree -- start` runs it
   automatically when creating a work-order worktree, then prints the shell-safe
   absolute `cd`, `codex`, and `resume: next` handoff. It does not launch or
   inspect Codex in this projection; the operator performs those three handoff
   steps manually. If the operator finds that a repair was incomplete after
   `repair-complete` but before re-verification, `resume: fix` may append
   another `RepairRequested` against the preserved failure source. It is refused
   for an initial implementation-ready state with no failure source. The
   corrected executor records a new `repair-complete`, producing a fresh
   checkpoint before the independent verifier is dispatched; it never edits or
   allocates a verification report itself.
4. Illegal transitions refuse and append nothing. A refusal means your
   understanding of the phase is wrong. Run the corrective command named in the
   refusal rather than forcing or working around it.

`resume: next` answers the selected order's lifecycle question; it does not select
a backlog order when the repository is between work orders. For evidence state,
read the [generated work-order index](../work-orders/README.md); for recommendation,
rationale, tracks, and human preflight, read
[`docs/planning/work-order-map.md`](../planning/work-order-map.md). Keep the
three answers separate: legal lifecycle transition, dependency/preflight
eligibility, and recommended choice. Never infer any of them from the next
integer. The map is a dated human projection, so revalidate its candidate
against the authoritative work order and current control evidence before
activation.

WO-026's generated index observes current headers and control evidence with a
recorded snapshot of local annotated release tag objects and the control
segments contained in each tagged revision. Prefix checks are per segment; a
sibling merge cannot shift another order's close ordinal. Run
`npm run work-orders -- index` after executor dispatch, before its evidence gate, and again
after `implementation-ready`; verification and final-review actors refresh
after dispatch and after recording their result. `npm test` includes
`index --check`: it refuses a stale projection or a missing/changed recorded tag,
while reporting additional local release tags as newer evidence. Explicit
regeneration includes those tags. No lifecycle transition regenerates the
index; its final refresh is later than the transition's immutable checkpoint.

For completed actor usage, run
`npm run resume --silent -- usage [--json]`: it reports every known order using
only the canonical control segments. `byActor` groups by harness/version/model/
effort/account label and phase; `byWorkOrder` gives order totals and the same
groups within each order. `attempts` includes retries and failures, `elapsedMs`
sums known signed spans, and `unknown` counts attempts missing either endpoint.
Wall-clock spans include waiting and interruptions; overlapping orders can
overlap in the sums. Missing actors remain `unknown` and missing labels
`not-applicable`. Usage is independent of the current branch, accepts no
`--work-order`, recovers no checkpoint times, and rewrites nothing.

For a read-only view of live worktree projections, run
`npm run worktree -- constellation`. It enumerates `git worktree list`, reads
only Beacon directory/status metadata, and prints phase-ordered individuals
plus counts for at most twelve host-projected members. It appends nothing and
does not repair missing projections. Each state-changing resume append emits
the selected order's v2 Beacon; `status`, `times`, and `next` do not. A warning
about optional Beacon emission leaves the transition recorded: inspect status
and fix the projection problem before continuing; never repeat the transition
to obtain a Beacon. `.control-beacons/` is a rebuildable checkout-local cache.

An agent sweep that becomes replayable perception uses the current skeleton
build and an explicit host-provided request:

```sh
npm run build
npm run worktree -- constellation --agent <host-request.json> --log docs/observations/<name>.jsonl
```

The request contains `intent: { kind: "Observe", subject: "control-beacons" }`,
`audience` (`public` or `verifier`), `staleAfterMs`, `authority`, `evidence`, and
`revokedBy`. The host envelope must grant the matching
`observe.beacons.<audience>` effect and one `beaconSweeps` resource unit, with
valid expiry/evidence/revocations. Treat the request file as host input; a
worker cannot create its own authority by supplying JSON. Refusal records
`CommandRefused` and no observation. An allowed call persists the command
before scanning, then exactly one `BeaconObserved` and a result. The append-only
log is contained under `docs/observations/` and created mode 0600; it is
deliberate evidence, not a disposable cache. Default age policy is 20 minutes;
the recorded request may explicitly choose another threshold.

WO-022 additionally requires host-selected `senses` (`beacon-sight`, optionally
`fine-spectrum` and `composition`) and an `environment` with
`profileId: "beacon-perception-v1"`, matching `audience`, `mounts`, and empty
`writableSurfaces`, `modelTools` and `narrativeSurfaces`. Each mount supplies a
stable non-private `mountId`, absolute `path`, `access: "beacon-metadata"`,
`family: "individual" | "phase-group"`, and the complete known `addresses`
array. `controlBeaconAddress(WO-NNN)` derives the fixed basename. There are at
most twelve individual addresses and one group address. These are host inputs;
the worker neither chooses its mount nor creates an envelope. The compiled
capabilities and path-free mount record enter the request event. Physical paths
do not enter the observation log or the sparse projection. A new live request
without Beacon Sight or its mount is refused even if its envelope allows
Observe. `projectBeaconSparseTwin` previews that same decision without reading.

For restricted mounting, trusted host code calls `issueBeaconSession` and
`beaconSessionMount(root, order, capability)` from the control Beacon module.
The latter returns a physical mount record to the host; the matching `resume
next` briefing remains the only textual disclosure of its random directory.
Restricted directories are 0111 at rest, allowing known-name metadata access
and refusing enumeration. The host restores write access only around emission
and restores search-only access in `finally`. Ordinary worktree teardown
restores owner access only after all existing close/merge/material gates pass.

V3 emission uses an external host key supplied through the command-scoped
`DOTLN_BEACON_KEY_FILE`. `createBeaconKey`, `openBeaconKey`, and
`rotateBeaconKey` in `beacon-provenance.mjs` create/open/rotate that mode-0600
file outside every Git checkout; never put its bytes in a request, prompt,
fixture or log. A configured key selects sparse-required v3 for lifecycle
emission and keyed checks for agent sweeps. A missing key selection retains
legacy v2 emission, and a reader without a key labels reachable v3
`unverifiable-provenance`. An invalid configured key or failed v3 storage probe
does not fall back to v2. Rotation increments the epoch and requires reopening
long-lived key handles; epoch 255 refuses. The full codebook and its weak-signal
limit are in product 02. The bounded tests arrange fresh non-repository keys
and remove them afterward; no operator key is needed for `npm test`.

Optional restricted projection provisioning is a trusted host API,
`issueBeaconSession(root, workOrderId)`, returning a separate random capability.
Only `npm run resume -- next --beacon-session <capability>` for that selected
order reveals the restricted directory. Provision before the next transition
if the session needs its projection emitted. Keep capabilities out of shared
logs and public status; same-user process arguments/filesystem access are not
isolated by this mechanism. See 09 §Privacy and minimization for that boundary.

`resume: final review` and `resume: release close` carry narrowly scoped
external-effect authority. A passing final reviewer may commit the reviewed
state, push only its work-order branch, and open the mergeable PR; it may never
merge it. Release close may create and push only the validated annotated tag and
create the matching GitHub Release as a projection of that tag's reviewed human
layer; it may never edit a published Release, push `main`, publish
packages/binaries, or change repository settings. The operator retains PR merge
authority and explicitly supplies the release-close phrase before tag and
Release publication.

After recording a passing final review and committing the reviewed state, the
reviewer uses the durable publication mechanism below with a committed,
contained PR body file:

```bash
npm run worktree -- publish WO-NNN --title '<reviewed title>' --body-file <contained-reviewed-body-path>
```

The helper first runs the release-surface preflight and validates the committed
five-section `RELEASE-NOTES.md` beside the final-review report. The current
`PR.md` and notes must use one physical source line per prose paragraph or
list-item paragraph, retaining separate lines only for semantic Markdown
structure; the helper transports those reviewed bytes without reflowing them.
Only then does it preflight GitHub CLI, push the work-order branch, open the PR,
and print the exact post-merge release-close handoff.

`main` is protected by a GitHub ruleset requiring a PR. The classic branch
protection endpoint can return 404 while that ruleset is active, so its result
alone must never justify a direct push. The workflow has no direct-main-push
path; ruleset-aware API preflight remains a separate hardening candidate.

The operator's own copy of this loop lives in `docs/PLAYBOOK.md`; this section
is the executor's half of the same contract.

## Independent workflows and integration

**Operator correction (2026-09-07, WO-041 breakout):** each work order's implementation and verification progress independently of every other order's phase. Do not require another lane to finish, verify, merge, or release before these transitions. A published dependency needed to implement a feature is still a real input dependency; paired-wave barriers and a verifier-reserve rule tied to the number of waiting orders are not. Actual available actors and one writer per worktree bound resource use.

The operator voluntarily takes one order from final review through PR, merge, and release close before bringing another into final review. Preserve that discipline in handoffs; it is not an enforced cross-order transition gate. It leaves other orders free to implement and verify during that window. A gate for this final-review window is an open option, not authorized implementation. The integrating final-review session owns routine integration within its window, without requiring the operator to arrange earlier sibling phases.

Verification judges its recorded subject. When upstream moves, the integrating actor owns the merge and an explicit assessment of which acceptance claims, if any, changed. Incorporating independently reviewed upstream work, regenerating projections, reconciling additive documentation or independent manifest fields, and retiming an unpublished release under its existing classification are permitted final-review integration work when they preserve behavior, contracts, authority, and acceptance. A new base, a text conflict, a changed whole-tree hash, or a version collision alone is not a failed review. Preserve every original report and source revision; the final report names both bases, resolved paths, carried-forward claims, and checks on the integrated result. It must not pretend an old verdict judged new bytes.

Run the affected executable checks and release/publication preflights on the integrated tree. Feedback evidence uses its declared dependency projection, so workspace release versions and license labels do not demand another live audit. Source, executable configuration, dependency, contract, or acceptance changes still need evidence for the claims they affect. If an integration resolution requires new behavioral code, or a check reveals an actual acceptance defect, return that bounded finding through repair and fresh independent verification; unchanged claims are carried forward with their original evidence. A reviewer never writes a behavioral fix and certifies it. Integration bookkeeping alone must not create a new `VER-NNN`, a failed `FINAL-NNN`, or a repair event.

The existing resume phrases remain the operator interface. The actor performing a handoff completes authorized integration chores within that session. `npm run release -- prepare` handles a colliding target, the README claim, and a dated roadmap note under the recorded release classification. It uses origin's tag observation; `--local` deliberately uses only the fetched local tag snapshot. It never publishes, alters component versions, or appends control events. A missing component bump against the verified branch baseline remains an executor defect. A component bump that was valid at verification may be retimed during integration if upstream consumed the same version, preserving its already-declared compatibility impact and recording that evidence; this is distinct from omitting the original bump. `npm test` runs `check-surfaces --local` before expensive suites against annotated local releases in the subject's own `HEAD` ancestry. Worktrees share tag refs, so an unintegrated sibling's newer tag is excluded from this verification baseline. `worktree publish` / `release close` retain the authoritative remote check on the integrated result. No command acquires authority from a sibling's phase.

The fuller `worktree sync` automation remains WO-033's deliverable. Until it ships, the integrating actor runs the existing preserve → fetch/merge → apply → regenerate procedure and records the evidence-impact assessment. That manual seam is explicit; it is not a rule that workflows restart when their bases differ. The [breakout receipt](../evidence/WO-041/ideation.md) records the measured failure that prompted this correction.

## Operator-opened ideation mode

The operator may explicitly reopen ideation during work-order execution,
including by expanding the subject of the current work order. A message prefixed
`ideation:` is that dispatch unless the same message says `capture only` or its
equivalent. By default it invokes the complete durable pipeline—capture,
clean-room review, synthesis, ledger append, product-doc write-back, and any
required scope-expansion receipt—not intake persistence alone. Do not make the
operator restate those stages.

The work order becomes context rather than a scope fence during the breakout.
Preserve its existing changes. Complete the breakout and its receipt, then
continue the authorized work through its evidence gate to ready to verify.
The operator does not need to repeat `continue` after each intake. An explicit
pause or capture-only instruction takes precedence; otherwise ideation is part
of the ongoing work, not a new permission boundary. Preserve the legal lifecycle
transitions and independent verification roles.

Interpret the operator's situations and analogies **shape first**, including in
earlier intake. The intended payload is ordinarily a relationship, interaction,
transition, contrast, feedback loop, or felt user experience; factual or
technical identity with the reference is not required. Extract that shape, then
lower it progressively through observable interaction, domain mechanics,
contracts/evidence, and environment-selected technology. Do not discard a useful
shape because the analogy is imperfect, and do not import incidental source
details as architecture. Verify a literal detail only when it becomes
load-bearing, otherwise retain it as operator recollection or leave it open.
This rule does not authorize a bulk reread of intake, a rewrite of older ledger
entries, or reopening an ADR or settled resolution. Apply it to material already
inside the authorized ideation subject; surface a genuine new tension through
the existing decision process.

Apply corrections to the behavior the operator rejected. Preserve the surrounding
requirements and distinguish an example from an explicit constraint. Before
replacing an approach, check the recorded reasons for earlier rejections; neither
repeat a rejected approach nor jump to its opposite without supporting evidence.
For example, a complaint about paragraph-length PR titles calls for useful,
concise titles; an earlier title's word count does not establish a length rule,
and the one-way drift of consecutive titles is itself the defect to prevent
(§Discipline, no ratchet creep).
This is the manual application outside the equipped
[WO-011 feedback host](02-domain-model.md#feedback-compiler-v1).

In ideation mode:

1. Resolve the main control-plane checkout with `git worktree list --porcelain`
   before looking for original intake or choosing a capture destination. A work
   order's relative `docs/intake/` does not contain main's ignored source corpus.
   Capture unedited material in a dated file under `docs/intake/chats/`,
   `docs/intake/notes/`, or `docs/intake/images/`. The intended survivor is the
   main control-plane checkout's ignored intake, resolved explicitly rather than
   assumed from a relative path. If the active harness cannot write there, a
   worktree-local capture is provisional staging: preserve it, name the pending
   reconciliation in the receipt, back it up, and reconcile it before worktree
   removal. Intake is local-only and gitignored; preserve fragments, repetition,
   uncertainty, and contradictions.
2. Apply the clean-room boundary before synthesis. If material resembles
   employer code, configuration, identifiers, proprietary API shapes, internal
   services, or managed-work-host details, stop and flag it. Never promote
   suspect material.
3. Synthesis authority is part of a bare `ideation:` dispatch. Rewrite ordinary
   raw material rather than copying it. If the operator instead supplies exact
   public-draft wording, explicitly directs it to be filed as written, and uses
   intake only as a compaction-safe mirror, preserve that authorship and record
   the direct-filing provenance on the committed surface. Never infer this
   exception from polished wording or a filename, and apply the same clean-room
   screen before filing. Append each significant idea to
   `docs/lineage/idea-ledger.md` with lifecycle status and provenance; never
   rewrite an older ledger entry. Only an explicit capture-only instruction
   stops after raw intake.
4. Promote only durable product understanding into the relevant `docs/product/`
   document, and update an ADR only through its permitted amendment mechanism.
   Preserve speculative ideas as `raw` or `preserved` instead of forcing
   premature architecture.
5. Treat tensions with settled resolutions as tensions to surface, not license
   to silently overwrite them. A real challenge based on new evidence becomes a
   decision-record proposal.
6. Keep pre-existing implementation changes intact and distinguish them from
   ideation artifacts. Finish any required breakout receipt before resuming
   coding, verification, or work-order closeout, then continue the active work
   to its ready-to-verify handoff unless the operator explicitly paused it.

These steps are the current manual projection of the Clean Room active described
in `05-pattern-library.md`. Bare `ideation:` uses the repository's saved public
destination loadout: the locked employer/secret floor, Shape-First Synthesis,
public vocabulary, provenance, and breakout review. Explicit operator-authored
ready-to-file text replaces the transformation strategy with Direct Draft
Fidelity; it does not remove any guard. Additional context or assurance supports
may deepen review and evidence, but a lighter support set never weakens the
floor. Until the mechanic is compiled, the receipt records the effective
strategy and any extra review support used.

### Ideation breakout receipt and verification

An ideation breakout that changes committed documentation is not complete at
synthesis. Record the operator's explicit scope-expansion authority in the
affected work order (or a new bounded work order), together with a receipt that
names the raw intake batch, ledger entries, product/decision/schema surfaces
changed, unresolved choices, and required review.

Local intake backup ZIPs are disposable operational snapshots. Do not put their
filenames in work orders or durable receipts, or make them review/evidence
dependencies. Provenance points to canonical intake and promoted source;
routine deletion of an obsolete local ZIP does not invalidate that provenance.

The eventual verifier and final reviewer must digest that receipt and the
promoted documents as part of their subject—not treat them as incidental notes.
They verify the selected clean-room source treatment and any direct-filing
provenance, traceability to operator intent, consistency with settled decisions
and canonical vocabulary, version/schema effects, internal cross-references, and
whether speculative choices were accidentally presented as settled. They may
propose and apply authorized, non-substantive handoff/documentation corrections.
Any correction that changes behavior, contracts, acceptance, schema, compatibility,
authority, or the validity of prior evidence returns through repair plus
a fresh independent numbered verification for the affected claims. Apply
§Independent workflows and integration to upstream incorporation and mechanical
release/projection changes; those are not behavioral repairs by themselves.
They do not promote raw intake verbatim or expand implementation merely because
the ideation describes a future feature.

Any executable helper, migration, generator, backup utility, or other ad hoc
tool created during an ideation breakout is implementation subject to the same
separation and evidence rules as work-order code. It must have associated
automated tests proportionate to its risks, be named in the breakout receipt,
and be independently inspected and executed by the verifier. The final reviewer
checks both its product fit and whether the tests cover its consequential
failure modes; “small script” is not an evidence exemption.

The default capture path for ideation opened around a work order is
`docs/intake/notes/<work-order>-expanded-ideation-<date>.md`; the naming scheme
is a convenience, not a requirement. Today `npm run backup:intake` archives only
the caller's checkout and does not synchronize it with main. Normal closeout
refuses a worktree-local note, but canonical reconciliation remains manual until
the candidate intake control in `03-architecture.md` exists.

## Operator-opened planning pass

A message prefixed `planning:`, or an explicit instruction to run a planning
session, dispatches a planning pass. It is the step the playbook calls “Plan
(Fable, main checkout)” made explicit, and it is distinct from the other two
things an operator might reach for: the Entropy Reducer is a compiled review
loadout dispatched separately against a frozen subject, which returns findings
and non-authoritative suggestions, goes through blinded refutation, and stops at
operator disposition without planning or fixing; the Repo Gardener is the
walking skeleton's founding identity, not a session. A planning pass may
consume an Entropy Reducer's surviving findings as input.

Preconditions and inputs:

1. Run on the clean main checkout. Between work orders is the normal case; an
   active order is context, never a scope fence, exactly as in ideation mode.
2. Read `npm run resume --silent -- status --json`, the
   [generated index](../work-orders/README.md), the
   [human map](../planning/work-order-map.md), the candidate documents under
   `docs/planning/`, the newest ledger sections, and every roadmap sentence
   addressed to “the next planning pass”; open the headers of every open work
   order the map names.
3. Equip Beware of Naive Interventionism and Do Nothing: every candidate the
   pass declines is recorded as a NoOp with its evidence and reversal
   condition, in the `NoOpIntent` shape, so a later pass sees what was weighed.
4. `ideation:` entries in the same dispatch run the complete ideation pipeline
   first; their synthesis is planning input.

After drafting the orders, commit the planning subject locally and run
`npm run plan -- refute` before preparing the pull request. The subject is
compiled from committed files only; the command refuses dirty judged inputs.
It uses a fresh Entropy Reducer / Contra-Auguste episode through an existing
transport, with planner narrative and model tools excluded. Commit the immutable
receipt pair and run `npm test` before the pass ends. The
[receipt convention](../planning/refutations/README.md) gives the closed result,
criterion-bound follow-up and override commands.

A hold requires either a changed named criterion and a fresh receipt carrying
its dated accepted disposition, or an operator-authorized
`npm run plan -- override <receipt-id> <hold-id> <reason>` event with actor flags,
an ignored intake capture and its SHA-256. Accepted text never discharges a hold
by itself, and receipt text never grants an override. The third consecutive
hold over one sequence stops that pass. A subsequent pass may repair it, but
must carry every earlier hold forward or explicitly identify the changed
criterion. Override attribution records the acting session; it does not prove
the human's identity or let a planner supply its own authorization.

The gate is forward-only from the mechanism's first-parent introduction/merge
date. Earlier headings, including same-day headings already present at that
boundary, are exempt. Every later dated planning-pass heading needs an addressed
receipt; the latest horizon receipt must match current committed and workspace
inputs. Earlier receipts keep their judged revisions, with unresolved holds
carried through the receipt chain. The six manual redirect receipts are
pre-mechanism evidence and are never rewritten or re-run by this gate.

Standard artifacts, all doc-only:

- a compaction-safety capture of the dispatch in ignored intake;
- one dated ledger section for the pass (and one for any ideation batch);
- the map's planning revision: the marked sequence block, rationale, adjacent
  track, preflight, candidates, catalog rows, and provenance;
- a blinded refutation receipt pair under `docs/planning/refutations/`,
  produced by `npm run plan -- refute`, with all holds answered through the
  checked disposition chain or attributed override events;
- zero or more planner-synthesized work-order drafts, each with `Model:` and
  three-role `Effort:` lines, provenance, a dated observed gap, acceptance
  criteria, evidence, non-goals, and operator-review assumptions;
- product-doc write-back for durable understanding, with the publication
  index and edition locks repaired in the same pass;
- `npm run work-orders -- index` regenerated and `npm test` green.

A planning pass never activates, implements, tags, publishes, merges, edits
immutable evidence, or relitigates a settled decision. A planning pass also
never certifies its own direction: the refutation receipt is the pass's
independent verification, on the same implementer-is-not-verifier rule that
governs code, and the 2026-09-06 redirect records what a pass without one
produced. A code or configuration
change it identifies becomes a work order or a named boy-scout item for the
next activation. Its output lands through the ordinary pull request from a
planning branch, since `main` requires one; the `:memo:` title rule applies.

## Workflow closeout and releases

Final review prepares and publishes a clean PR; the operator retains merge
authority. After the PR is merged, `resume: release close` runs the guarded
close command. It updates `main`, proves the reviewed branch is contained in
`origin/main`, and removes only its known worktree and merged branch. Ordinary
tracked or untracked dirt is refused by the clean-worktree gate. Ignored raw
material under `docs/intake/` must be backed up and reconciled into the
surviving main intake as appropriate; the helper separately refuses removal
while any non-disposable ignored file exists — protected intake material, a
stray `.env`, any other ignored path — naming the offending file, and never
deletes or auto-promotes it. Known disposable ignored dependency/build outputs
may leave with the worktree only at the anchored root `node_modules/` or
`dist/` paths, at `packages/<name>/node_modules/` or
`packages/<name>/dist/`, the anchored root `.control-beacons/`, by a `.DS_Store` basename, or by a
`.tsbuildinfo` suffix. A matching segment elsewhere is not disposable, and the
`docs/intake/**` protection takes precedence over every build-shaped name. The
same command then evaluates whether the completed roadmap rung is a release
boundary.

The main checkout's exact `.claude/settings.local.json` is persistent
operator-owned harness state, not a release or test input. The main-checkout
release-influence guard permits only that exact root path, protected
`docs/intake/**`, and the anchored disposable outputs above. This is not a
cleanup allowance: a subject-worktree copy of the settings file is
non-disposable, so worktree removal refuses and preserves the file, branch, and
worktree. Never broaden this to `.claude/**`, copy or inspect the settings as
evidence, or treat them as disposable cleanup.

When a planner pins a tagging target above the latest published tag, updating
the root README release block to that target is an executor deliverable, not a
post-tag repair. After synchronization and before dependency installation,
`release close` runs the same `check-surfaces` preflight as `worktree publish`:
the README block must match release truth, every component whose `src/` changed
since the preceding tag must have a different component version, and the
current committed PR/release-note bodies must satisfy the renderer-wrapped
profile. The `license-surfaces` rules require Apache-2.0 and `private: true`
in the root and every workspace, the exact publication-refusal lifecycle
command, and the three license-file SHA-256 values pinned in `docs/LEGAL.md`.
The checker runs offline npm dry runs against isolated copies of the selected
manifests and requires the specific refusal exit and marker; unrelated npm
failures do not satisfy the rule. `--committed` reads Git blobs for the pins,
metadata, and probe inputs. `npm run license-surfaces` also runs this bounded
check on its own, and `npm test` includes it. Failure reports observed and
expected values and stops before `npm ci`, tag creation, or GitHub mutation.

Before pushing, `worktree publish` also checks every commit in the local
`origin/main..HEAD` range, including merged side branches, against
[CONTRIBUTING.md](../../CONTRIBUTING.md). An outside author's commit requires
a parsed DCO 1.1 `Signed-off-by` trailer matching its raw author name and email.
The operator's exact public author identity is exempt; the committer and local
Git settings cannot supply that exemption. This is forward-only from the base
and verifies an attestation, not personal identity. It installs no Git hook.

For a release boundary, the command works from the fetched `origin/main` HEAD to
which local `main` was fast-forwarded, not a separately resolved work-order
merge commit. The reviewed work-order branch must be contained in that history;
any later commits already present at synchronization are included in the tagged
source. The command runs `npm ci` before release evidence, proves the
install/evidence leave tracked files unchanged, populates and re-validates the
immutable manifest, assembles the five-section edition from reviewed notes in
first-parent order, and creates and pushes only their annotated tag. After that
push succeeds, it creates the matching GitHub Release from the human layer; the
JSON manifest remains in the tag rather than being pasted into the projection.
The current release-note prose remains byte-exact from final review through the
tag and GitHub projection; no close-time formatter inserts a source width.
The publish form is authorized by the operator's phrase; a raw run without
`--publish` performs guarded closeout and validation, then prints the exact
authorized tag command. Never tag the feature branch, tag failing evidence, move
an existing tag, edit a published Release, push `main`, or imply that
npm/binary/hosted distribution occurred when the release is source-only. A
failed release check opens a patch work order. A version strictly below the
latest tag is an explicit no-release outcome. The named order stays closed;
other in-flight orders remain visible, and the checkout is between work orders
only when none remain. An equal version is idempotent only when the
existing validated annotated tag names the exact current commit; a mismatch
refuses.

Both release-close forms perform guarded synchronization and cleanup before
evaluating the release boundary: they may fast-forward local `main` and remove
the known merged worktree and local branch. At a new eligible boundary they also
run `npm ci` and the evidence gate; lower or already-published targets return
after their own validation. Under `--publish`, GitHub CLI availability and
authentication are checked before tag-object creation. If GitHub Release
creation fails after the validated tag was pushed, the command exits non-zero,
leaves that immutable tag intact, and names the recoverable state. Rerunning the
same close command validates the equal tag byte for byte, creates the missing
Release, or refuses at the first differing body line; it never edits the
Release. Every equal-tag retry reproduces release evidence before re-deriving
compatibility, so ignored built output is never trusted merely because it
already exists.
Omitting `--publish` withholds tag and Release creation; it is preparation, not
a read-only command.

The first post-merge close always runs the reviewed helper from the still-
present subject worktree while the shell's working directory is the main
checkout. `worktree publish` and `resume release-close` print that exact
absolute command. The loaded subject `release.mjs` delegates cleanup to its
sibling subject `worktree.mjs`, so a policy change in the just-merged work order
cannot be bypassed by stale pre-fast-forward main helpers. The helper validates
and fast-forwards main before safely removing its own source worktree. If a
recoverable failure happens after that removal—such as GitHub Release creation
after a successful tag push—the updated main copy owns reruns through ordinary
`npm run release -- close WO-NNN --publish`. WO-004 first needed the shape
because pre-merge main had no release helper; the reviewed-helper rule applies
to every later close as well.

A deliberately deferred eligible release must retain a durable reason in the
follow-on patch work order or another reviewed repository artifact; silence is
not a release disposition.

`npm run release -- notes vX.Y.Z` and `npm run release -- list` inspect local
annotated release records without network access. Historical tags that predate
the reviewed edition may receive a GitHub projection only through the separate
operator-run `release publish-notes vX.Y.Z` command; agents test that path with
a stub but never perform a backfill against origin.

## Documentation freshness and ownership

The executor owns current factual documentation for its change. Before declaring
implementation ready, update affected blueprint facts and their reader entry
points in the same pass: examples, names and paths, component/source claims,
capability limitations, runbook instructions, planning recommendations, and
publication links where the change reaches them. Use the diff and inbound
references to bound the check. Record the affected surfaces and evidence in the
existing work-order outcome or breakout receipt; do not create a new ceremony
or rewrite unrelated historical artifacts.

Apply the [corpus maintenance constraint](03-architecture.md#corpus-policy)
when choosing that surface: reuse an existing outcome or receipt, link canonical
evidence, and regenerate derived views. Retaining required evidence does not
require repeating its explanation in another report. A proposed consolidation
must preserve the current source, verification, and recovery contracts.

The verifier checks those claims and runnable examples against the subject and
acceptance evidence. Final review checks their consistency across the resulting
documentation and publication package. It may make only the already permitted
non-substantive corrections; material mismatches return through repair and new
verification. A dedicated publication order may improve an edition or repair
broader editorial debt, but ordinary fact updates do not wait for that order.
See [publication ownership](08-publication-compiler.md#freshness-and-ownership).

Refresh generated evidence at the dispatch/result points already named above.
The work-order README's proposed sequence comes from the marked block in the
human planning map; completion marks come from the control fold. Change the
recommendation at its source and regenerate rather than editing checkboxes.
The local source worktree can describe staged work while main still describes
the last merged source. Label that distinction instead of making either view
claim evidence or releases it does not have.

## Discipline

- **Work only from the current work order.** No opportunistic scope expansion;
  adjacent cleanup only under the bounded boy-scout policy (unambiguous, low
  risk, covered by the same verification, doesn't obscure the diff) — otherwise
  file a candidate task.
- **Release assignment is opt-out (operator default, 2026-09-04).** Prepare
  the classified next release and update its source claim unless the operator
  specifies no release. Complete a missing activation target under
  `06-roadmap.md` §Release boundary and record the base/classification; do not
  repeatedly ask for routine release assignment. Retiming an existing target
  and publishing still follow their separate authority rules.
- **Automate recurring procedure (operator direction, 2026-09-04).** Prefer
  an existing executable helper for a mechanical step. When authorized work
  exposes a recurring manual sequence, projection, or handoff, move the smallest
  useful increment into a command, generator, fold, or guard and check its
  normal and consequential failure paths. Keep judgment at the point that
  needs it. Work beyond the current authorized scope becomes a bounded
  candidate through the existing nomination process. Judge the result by the
  repeated work and coordination it removes; a new checklist or approval ritual
  is not an automation outcome. Apply the existing scope and authority rules.
- **Evidence gates over prose.** Completion claims require the work order's
  evidence: passing tests you ran, output you captured, behavior you witnessed.
  Read your own diff before reporting. Never infer completion.
- **Recovery point before destruction.** Never run `git checkout .`,
  `git restore .`, `git reset --hard`, `git clean` (any flags), or
  `git stash drop` in a work-order worktree. Until final review, the
  deliverable, every `VER-NNN`, and the order's control segment are typically
  uncommitted, and `docs/intake` is gitignored single-copy raw material that is
  in no commit at all. Valid control transitions create the only
  pre-final-review checkpoint commits as local `refs/dotln/checkpoint/...` refs;
  do not add hand-written checkpoint commits to the work-order branch. Before
  any rollback, preserve the current dirty tree with a named
  `git stash push --include-untracked -m 'WO-NNN recovery before rollback'` and
  never drop that stash. Git's stash stack is shared across every worktree of
  this repository, so a concurrent session can reorder or consume entries;
  re-find yours by its `-m` tag, never by `stash@{n}` position, and restore with
  `git stash apply`, not `pop`. Restore only from the exact latest checkpoint
  ref advertised by the current control projection, and say in your result which
  recovery point you used. Ignored intake is outside both mechanisms and must be
  backed up separately.
- **Verification artifacts are immutable and numbered.** Verifiers write to
  `docs/verifications/WO-NNN/VER-NNN.md`; the first pass is `VER-001.md` and
  every re-verification creates the next number instead of replacing a prior
  report. The original `docs/work-orders/WO-NNN-*.md` remains scope authority. A
  repair episode reads both that original work order and the specific
  verification artifact it was dispatched to fix. A verifier reads the original
  work order, the subject diff, and prior reports needed to establish whether
  findings were repaired, then writes a new report. Final review reads the work
  order and the full numbered verification sequence; no actor treats a verifier
  report as permission to expand scope.
- **We are driving the car while we are still building it.** This project uses
  its own process to build that process; the machinery under construction is
  also the machinery in force. Four consequences bind every session: _Time-index
  the standard._ Judge a past artifact against the process that existed when it
  was made, not today's — and say which you are applying. A missing artifact
  whose convention had not been invented yet is not a defect. _The excuse has a
  hard boundary._ "We were still building it" explains absent **process**
  scaffolding. It never excuses a **behavioral or evidence** defect: a test that
  does not test, a guard that does not guard, work that was lost. Process
  immaturity is not an evidence exemption, exactly as "small script" is not one.
  _Expect retroactive non-compliance._ Every hardening makes prior work look
  non-conforming. Record the discontinuity as a dated migration note where a
  reader will hit it; never back-fill artifacts to make history look tidy.
  `docs/verifications/README.md` already does this ("Do not fabricate it to make
  the sequence appear complete") — that is this rule in practice. _Prefer
  forward-only enforcement._ A new guard binds new work. Do not retroactively
  invalidate merged work unless a real defect is demonstrated. _Disclose a
  self-referential instrument._ When the machinery you use to do your job — the
  control log, a lifecycle script, a generator — is itself part of the
  deliverable you are judging, say so explicitly in your report, and verify that
  machinery independently rather than trusting it because it appeared to work. A
  broken instrument records the finding that it is broken. This is not
  hypothetical: `VER-001` was allocated and its verdict recorded through
  `scripts/resume.mjs`, a WO-003 deliverable under verification in that same
  report. **This is a disclosure duty on the verifier, not a reason to avoid
  using new machinery.** Dogfooding a tool in the work order that built it is
  how it hardens, and refusing to would ship control planes nobody has driven.
  Abstain only in the narrow case where the instrument's correctness is itself
  the question _and_ its failure would be silent — you do not verify a checksum
  tool with itself. Prefer instruments that fail loudly; an append-only log with
  a regenerated projection is safe to dogfood precisely because corruption shows
  rather than producing a plausible record.
- **Settled is settled.** The idea-ledger Resolutions and `docs/decisions/`
  close their questions. Do not relitigate; a genuine new-evidence challenge
  becomes a new decision record proposal, never an in-place edit. Exception:
  each ADR carries an appendable **Amendments** section for notes within the
  decided constraints (a dev-dependency, a tooling choice) — appending there is
  not an edit of the decision.
- **Precedence.** When a work order's authority clause conflicts with a standing
  duty in this guide, the work order wins; note the skipped duty in your result
  as an open question. Doc-only work lands directly on the working branch the
  operator gave you — code goes to worktrees/branches per the isolation rule.
- **Ledger duty.** If your work supersedes, transforms, or adds a design idea,
  append to `docs/lineage/idea-ledger.md` (never rewrite existing entries) and
  update the blueprint doc in the same change.
- **Isolation.** The main checkout is the control plane. Model-authored code
  changes happen on branches/worktrees; verify `pwd` and repo root before any
  git operation.
- **No new dependencies** without a one-paragraph note in the relevant decision
  record. The kernel stays framework-free, period.
- **No config mutation of safety boundaries** (git config, hooks, permissions,
  secrets) unless the work order explicitly authorizes it. Non-safety `.claude/`
  and CLAUDE.md refinement may grow iteratively — one line in the config log
  (docs/README.md) per change; a decision record only when a safety boundary
  moves.
- **Configuration layers** (scope × volatility): shared-stable facts in
  committed project docs/settings; machine-local facts in uncommitted local
  files; path-scoped instructions only once the area exists; the bottom layer is
  executable code and tests, which progressively absorbs the prose layers above
  it (ADR-0001's strangler loop).
- **Boundary rules** (from CLAUDE.md): nothing employer-derived enters this
  repo. Ordinary raw ideation is synthesized; exact operator-authored public
  draft text is filed only with explicit direction and recorded provenance. Both
  use the locked Clean Room floor, and anything that smells proprietary is
  flagged rather than incorporated.
- **Projection boundary.** Internal vocabulary (gems, masks, DotLn taxonomy)
  stays out of artifacts consumed outside the system (PRs to other repos,
  generated reports for third parties).
- **PR titles carry a relevant gitmoji shortcode.** Choose deliberately from
  the [full gitmoji catalog](https://gitmoji.dev/) for the current change's main
  purpose. Use its more specific choices where they fit; explore beyond the
  familiar feature, documentation, and fix defaults. Relevance takes priority
  over novelty, with no forced rotation or ban on repeating a good choice.
  Titles only: commit messages stay plain, and a merged
  commit is never rewritten to add one. On a squash merge the platform copies
  the PR title into the commit subject — that inherited emoji is fine; the plain
  rule governs hand-authored messages. Retitle with `gh pr edit <n> --title`.
- **Write PRs and commits for the reviewer.** Apply the
  [publication guidance](08-publication-compiler.md#prs-and-commits): name the
  change in the title, summarize its effect and relevant validation in the body,
  and explain consequential complexity and tradeoffs with enough detail for
  review. Link the full evidence. Derive wording from the current diff; previous
  titles are not templates. At final review, commit distinct coherent changes
  separately, keeping each change's necessary tests and documentation with it.
  One work order does not imply one commit. Check the staged diff for each commit
  and confirm that the completed series contains exactly the reviewed state.
- **No ratchet creep (operator correction, 2026-09-07).** Ratchet creep is
  one-way drift in a soft-bounded property across consecutive artifacts (the
  length of a title, report, PR body, or release notes; the number of sections,
  checks, disclosures, or options; the amount of ceremony) caused by sizing each
  new instance against its immediate predecessor plus a margin instead of
  against its own content and the governing standard. No single step looks
  wrong; the series does, and an operator correction only resets the level
  before the drift restarts. Merged PR titles show the shape: 5–10 words for
  the first sixteen, 98 by the twentieth after, 12 at the operator's first
  correction, 28 nine PRs later. The defect is the drift, not any particular
  size. Size every artifact from its content and the standard, never from the
  previous instance; before writing one in a series, compare with the whole
  series and the operator's corrections, not only the newest entry; when the
  last three entries rose monotonically, cut below the series median instead
  of matching the newest; an operator correction sets a permanent level,
  measured from the corrected instance. This binds every authored series:
  titles, commit subjects, PR bodies, release notes, verification and
  final-review reports, checklists, receipts, and replies to the operator.
- **Return shape.** End with a compact result: what changed, evidence pointers,
  deviations from the work order, open questions. Terse; no narration theater,
  no apology theater.

## Model-specific notes

WO-011's equipped feedback host absorbs the executable checks for decision
lineage, evidence-backed judgments, semantic correction, application checks,
attribution, writer isolation, suppression diffs, output reads, complete scope,
and bounded cleanup at its declared boundaries. The
[contract and evidence](02-domain-model.md#feedback-compiler-v1) identify those
consumers and their limits. Ordinary `resume` sessions still follow this guide;
the matched context measurement does not authorize removing rules from unrelated
harness startup files or claim that all manual duties have been replaced.

- **Operator default (2026-09-04):** Codex steps use GPT-6 Astra at `max`
  unless the operator specifies otherwise. This is an operator-attested
  selection; record the actual exposed harness/version and do not call it
  effective-session readback. Preserve the active work order's minimums and
  explicitly handle a conflicting required actor instead of silently
  substituting. Other harnesses and the Entropy Reducer's compiled Fable
  assignment retain their own declarations.
- A required model is a hard constraint under Principle 8, and declared effort
  is a hard constraint under the active work order and WO-019 mechanism. If you
  do not meet either, stop and say so; never silently proceed as a substitute. Every
  newly activated work order carries both a `Model:` line and an `Effort:` line
  declaring `executor`, `verifier`, and `reviewer` as `any` or a minimum on
  `low < medium < high < xhigh < max`. `Model: any` means any capable model;
  effort remains independently constrained. The leading metadata region
  contains exactly one of each field, with the complete Effort field following
  Model apart from blank lines; duplicate, body-buried, reordered, missing, or
  malformed declarations refuse. `resume -- next` repeats both complete source
  fields in the dispatch briefing.
- The four completion events carry an `actor` attestation: harness and version,
  model, effort, and epistemic source. Recognized ladder values remain exact; an
  unrecognized label is stored as `effort: unknown` plus its verbatim `raw`
  value. A recognized claim is accepted only when bounded discovery records
  that value for a harness version listed as observed through a versioned
  selector or readback; otherwise the actor must attest `unknown`. Each
  harness's `versions` array is observation history in oldest-to-newest order,
  with the newest entry last. Any listed observed version remains valid; append
  a newly observed version rather than replacing an earlier one. Refusals name
  the observed versions on record so an upgrade gap is visible before a report
  is filed. `unknown` satisfies only a role declared `any`. A below-minimum
  transition appends nothing and can proceed only after a dated operator
  amendment to the work order—not an override flag. `harness-readback` is valid only where
  `docs/discovery/environment.json` records an observed effective session
  readback for that exact harness/version; a persisted setting or accepted
  launch selector alone is not readback. `self-reported` deliberately records a claim rather than
  surveilling the session to prove it: the declared-effort gate compares that
  claim, and the source label states the evidence limit. This does not authorize
  silent degradation; it prevents an unobserved value from masquerading as
  observed fact. Echo the attested values in the session result, but the log is
  the durable record and `current.md` projects the latest value and within-order
  drift.
- **Optional account label (WO-031):** all four completion commands accept
  `--account-label <label>`. `DOTLN_ACCOUNT_LABEL` supplies the default for that
  shell; an explicit flag wins even when the environment default is invalid.
  A label must match `^[a-z][a-z0-9-]{0,15}$` exactly, with no control or line
  separator characters. Empty or invalid values refuse before append. When
  absent, the stored actor omits the field and projections show `not-applicable`;
  no account is inferred. The label goes last in the normalized actor JSON,
  including verification/final-review report headers when supplied. The private
  meaning may be recorded one line per label in ignored
  `docs/control/local/account-labels.md`; no script reads it. Use opaque labels
  without identity or plan information. This public profile accepts that distinct
  labels disclose distinct accounts; a stricter profile leaves the field unset.
- A session label can describe more than reasoning effort. The documented
  Claude Code `ultracode` note means dynamic workflows plus `xhigh` reasoning;
  only the latter occupies the effort ladder. When that dated operator
  attestation applies, the actor still supplies both `--effort xhigh` and
  `--source operator-attested`. `resume` points an unrecognized `ultracode` claim to the
  note but never converts it automatically, and no other unknown label inherits
  the mapping.
- Actor flag values are one-line data. Control characters and Unicode line
  separators refuse rather than entering the Markdown projection. Use
  `not-applicable` when a field is structurally absent, and `unknown` when a
  value exists but cannot be known. The conventional unassisted-human tuple is
  harness `human`, harness version `not-applicable`, model `human`, effort
  `unknown`, and source `operator-attested`.
- **Migration note (2026-09-02):** effort enforcement is forward-only from
  WO-019. Historical work-order headers, completion events, and report prose are
  not backfilled or invalidated. New activations carry
  `effortDeclarationValidated: true`; a still-active pre-WO-019 event without it
  can finish against a visibly synthesized `any` declaration if Effort is
  absent, while WO-019 and every marked activation remain strict. In particular, WO-001 through WO-003 retain the
  disclosed low-versus-documented-xhigh drift, and historical free-form labels
  remain what their reports said rather than being rewritten into the new
  ladder. See `docs/PLAYBOOK.md` §Who does what.
- **Control-time migration (2026-09-04, WO-028):** every new transition
  records host UTC `recordedAt` at append; it is optional under schema version
  `1`, and old events are never rewritten. Timing cannot order events or grant
  a legal action. Status reports the latest completed attempt per phase with
  signed milliseconds, `unknown` for missing endpoints, and no recovered-time
  substitution. `resume times` labels each event `recordedAt`,
  `recovered-from-local-checkpoint-ref`, or `unknown`; a required missing or
  mismatched local ref refuses. The dated
  `docs/discovery/control-event-times-2026-09-04.json` observation preserves
  120 second-precision committer times and 15 unknowns from the activation log;
  its refs remain unpushed. This public profile deliberately publishes timing,
  while stricter profiles can omit it or declare coarser public observations.
  No token, cost, or attention telemetry is authorized by this field.
- Behavioral guidance rots across model generations; that is why it lives here
  as typed mechanisms and docs instead of prompts. If an instruction here fights
  your model's defaults (e.g., built-in verification), flag it in your result
  rather than ignoring it.
