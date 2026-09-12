# Execution guide — for any model session working in this repo

You may be Claude (any tier), Codex, or something newer. The repo, not your
transcript, is the shared memory. This guide is the operating contract.

## Read order for a cold start

The whole `CLAUDE.md` / `AGENTS.md` instruction file is the locked floor and
marked compiler residue. Its role dispatch loads one generated skill by name.
`@skills` is `.claude/skills` for the observed Claude profile and `.agents/skills`
for Codex. Run canonical `resume status --json` to resolve each selector below;
no skill carries phase state or grants authority.

| Role                                                 | Required skill                         | All directed inputs, including later procedure                                                                                                                                                                                                 |
| ---------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Executor / repair (`next`, `fix`, `status`, `times`) | `@skills/dotln-executor/SKILL.md`      | For `next`/`fix`: §Goal-aligned decisions; selected work order and cited sections; relevant source, tests and current authored outputs; `package.json`; named failure report for repair. `status`/`times` only report their read-only command. |
| Verifier (`verify`)                                  | `@skills/dotln-verifier/SKILL.md`      | §Goal-aligned decisions; selected order and cited sections; subject source, tests and current outputs; `package.json`; prior verification reports needed for the findings                                                                      |
| Reviewer (`final review`)                            | `@skills/dotln-reviewer/SKILL.md`      | §Goal-aligned decisions; selected order and cited sections; complete subject and numbered verification sequence; `package.json`; 08 §PRs and commits; current review/PR/release-note outputs                                                   |
| Release close                                        | `@skills/dotln-release-close/SKILL.md` | §Goal-aligned decisions; selected order and cited sections; canonical final review, PR body and release notes                                                                                                                                  |
| Planner                                              | `@skills/dotln-planner/SKILL.md`       | §Goal-aligned decisions; sequence file; this guide's planning and ideation sections; addressed candidates and source lookups                                                                                                                   |
| Refuter                                              | `@skills/dotln-refuter/SKILL.md`       | §Goal-aligned decisions supplies purpose; the canonical prompt from `npm run plan -- refute --direct` is the sole subject evidence. No map, ledger or prior receipt is a subject preread.                                                      |

The generated `Read:` and `Read[role]:` directives are binding throughout the
procedure, not just before its first effect. Resolve `@work-order`, `@citations`,
`@subject-files`, `@failure-report`, `@verification-reports` and `@final-review`
from the task and canonical artifact paths. An inapplicable conditional input
is empty; an unresolved required input is reported, never silently omitted.
Read source and existing tests before architecture changes and review current
output bytes before completing. Any newly discovered required source expands
the declared scope and its accounting. The ledger/intake remain scoped lookups.

`node scripts/harness-context.mjs --check` measures the installed floor plus each
role skill against the previous edition and its budget. Required task-document
reads remain scoped by the directives above; editing a product document does
not alter the cold-start comparison or require a new evidence edition. The
historical [WO-039 measurement](../evidence/WO-039/harness-context.json) retains
its original broader method.

## Goal-aligned decisions

The Contributor's purpose comes from [the vision](00-vision.md): DotLn is a
local-first, model-agnostic compiler/runtime for human judgment. This personal
implementation aims to improve operator flow by moving recurring supervision,
coordination, recovery and verification into dependable machinery, while
preserving correctness, authority, evidence, privacy and recoverability.

The current [critical-path plan](../planning/critical-path-2026-09-08.md) targets
the always-on runtime, its first real external source change and an independently
verified source-to-deliverable loop. The [sequence](../planning/sequence.md) and
selected work order determine current placement and authority. The mission is
the outcome; the critical path is the dependency route to the next outcome.
Useful prerequisite or risk-reduction work must name the blocked outcome it
enables. Process activity, receipt volume and agent utilization are not progress
by themselves. Goal alignment grants no authority to reorder or expand work.

**All phases, operator direction 2026-09-11.** The default Contributor equips
Goal Alignment and Process Cost for executor/fixer, verifier, reviewer, planner,
refuter and release-close. Before selecting a material solution, record the
goal and critical-path contribution, evidence of benefit, the NoOp baseline,
and the risks of intervening in existing behavior. Compare all eight system
traps below. Revisit that rationale when evidence or scope changes; verification
and handoff compare observed outcomes with the promised benefit. Required legal
or release actions retain their existing authority; NoOp is a considered
alternative, not an ambient veto or permission to abandon authorized work.

Accuracy takes priority over agreement in every phase. The already-equipped
Correctness over Sycophancy rule applies to operator suggestions and the agent's
own premises equally: challenge unsupported claims, distinguish observation
from inference, state material uncertainty, and correct mistakes when evidence
changes. A confident request or an earlier decision is not proof of correctness.
Record material disagreement and its evidence in the same decision or phase
receipt; do not manufacture dissent or seek approval for ordinary judgment.

| Lens                                  | Decision question                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Policy resistance / fixes that fail   | Will local goals or guards undo one another?                                                              |
| Tragedy of the commons                | Does the solution consume shared compute, context or operator attention without accounting for the total? |
| Drift to low performance              | Does it improve an explicit outcome standard rather than normalize a worse baseline?                      |
| Escalation                            | Will additional process provoke more process or workarounds?                                              |
| Success to the successful             | Are credible alternatives excluded merely because the current mechanism already has investment?           |
| Shifting the burden to the intervenor | Does the solution remove recurring operator rescue or depend on it?                                       |
| Rule beating                          | Can the evidence pass without the intended behavior occurring?                                            |
| Seeking the wrong goal                | Does it advance operator flow and the selected product outcome rather than a proxy?                       |

Naive Interventionism adds the existing system's useful functions, affected
consumers, second-order harm, reversibility and smallest useful probe. NoOp
records what happens if nothing changes, why action or inaction wins, and the
evidence that would reopen the choice. Scale detail to consequence: explain
applicable risks and briefly group immaterial lenses with a reason; do not
manufacture eight repetitive paragraphs for routine edits.

Material choices and rationales go in existing phase evidence: per-order
`docs/evidence/WO-NNN/decisions.md` and cited product sections for work-order
decisions; planning dispositions/candidate records for planning choices; the
independent report or refutation receipt for its judgment; retained closeout
evidence for release decisions. The decisions index exposes per-order records.
Reuse and link a current rationale until its assumptions change; do not create
a parallel decision log or an extra approval ritual.

The shared supports carry these duties and their compiled identity in both
harnesses. They are instruction-level judgment, not proof that an agent applied
every lens or a causal detector. The meter's five quantitative trap signals are
separate. General Naive Interventionism, NoOp and adaptive Tinkerer mechanics
retain their candidate scope; this bounded Contributor policy does not claim
their generalized implementations. The [WO-043 receipt](../evidence/WO-043/ideation-commands-and-usage.md)
records this promotion and its limits.

## Operator resume phrases — how you get dispatched

The operator's entire instruction to you may be a single phrase of the form
`resume: <intent>`. That phrase **is** your dispatch. Do not ask for context and
do not ask which work order: the durable control state answers both, and the
operator is deliberately not repeating themselves.

Load the generated role skill named by the cold-start table. Its procedure is
the session adapter to the detailed contract below. Claude's generated prompt
hook resolves the exact phrase and reiterates the selected order path; Codex
uses the same floor dispatch with its project skill. Keep `npm run harness --
check` green after changing the Contributor source and regenerating the bundle.

**First-party session commands (operator direction, 2026-09-11).** These
prefixes are part of the supported command vocabulary alongside `resume:`,
`planning:` and `ideation:`. They do not create lifecycle events:

| Operator says                   | Meaning                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope expand: <addition>`      | Authorize the stated addition to the current task. Preserve existing work and obligations, record the bounded scope expansion and its evidence/review duties, and continue under the existing effect boundaries. The prefix alone does not authorize publication, destructive effects or unrelated work.                  |
| `conversation only: <question>` | Answer a side question briefly while continuing the active work order. The question changes no scope, phase or obligation, opens no ideation capture, and requires no repeat `resume:` instruction. Tools and changes already authorized by the work order continue. Only an explicit pause or stop interrupts that work. |

Quoted examples of these prefixes are discussion, not a dispatch. A message
actually prefixed `ideation:` still follows the ideation pipeline even when
its subject is one of these commands. The contract is carried in the
Contributor's generated instructions for both harnesses; this does not claim
the separately deferred phrase-table generator in WO-088 is implemented.
VER-002 F2–F4 corrected this placement on 2026-09-11: every generated role
target carries the prefixes, including when optional supports are removed;
the locked hand-written floor retains its original wording. The cold-start
table includes the shared goal card and the refuter's separate subject boundary.

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
   The additive `dependencies` field projects the selected authority through
   `scripts/lib/dependencies.mjs`: `{ source, entries, blocking }`, with source
   `typed` or `conservative-tokens` and a state on every entry. It is `null`
   when no order is selected. `resume activate` refuses before any event or
   checkpoint when a typed entry is unmet, naming its reason and corrective
   action: obtain the required passing closure or ancestor release, resolve
   the planning deferral, or edit the authority with a dated reviewed note.
   This computes dependency eligibility; legal transitions and recommended
   next work remain separate answers. Unmarked prose tokens never refuse
   activation. Closed and historical files are not backfilled.
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

**Applying a correction (operator definition, 2026-09-09).** A correction
points at a category. Two failure modes: sweeping generalization, which
extrapolates beyond what the operator said into adjacent rules or file
changes they never asked for; and over-literal interpretation, which strips
the rule to its exact words and misses obvious members of the same category.
The middle ground is judgment: identify the category the operator is
pointing at, stay inside it, neither widen nor shrink it, ask one focused
question when the boundary is genuinely unclear instead of guessing in
either direction, and pause to ask before any file action that goes beyond
the literal correction. Before
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
the caller's checkout and does not synchronize it with main. The reviewed
closeout helper reconciles worktree-local intake before removal; the broader
candidate intake control in `03-architecture.md` remains future work.

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
   Run `npm run plan -- start <slug>` before the first planning write. It
   requires clean main and creates `planning/YYYY-MM-DD-<slug>` through the
   classified command path; an unknown effectful tool is refused. It also
   returns the first bounded page of the public follow-up register. A stale
   register refuses entry before creating the branch; refresh it with
   `npm run meta` and include that document update in the preceding checkpoint.
2. Read canonical status, [the sequence](../planning/sequence.md), and this
   guide's planning and ideation sections. Use scoped candidate, ledger and
   order lookups as the current pass requires. The generated index and map
   remain navigation aids rather than whole-file startup prerequisites.
   Use the follow-up feed to select scoped source reads. Its counts and `next`
   command expose the remaining pages; a page is at most 8 KB and eight rows.
   Unresolved items remain queued across passes even when this pass does not
   choose them. The feed is navigation, not authority to activate an order.
3. Equip Beware of Naive Interventionism and Do Nothing: every candidate the
   pass declines is recorded as a NoOp with its evidence and reversal
   condition, in the `NoOpIntent` shape, so a later pass sees what was weighed.
4. `ideation:` entries in the same dispatch run the complete ideation pipeline
   first; their synthesis is planning input.

**`planning: refute` and `planning: refute full`.** These exact phrases load
the dedicated refuter skill in either harness. The receiving session runs
`npm run plan -- refute --direct` (add `--scope full` for the whole horizon).
The command verifies the committed subject equals the workspace and prints
the canonical prompt. It performs no external CLI launch and directs no
other read. Save the closed judgment and a truthful public session statement,
then run `npm run plan -- receipt <result.json> --statement <statement.txt>`
with any required `--dispositions <file>`. The helper validates, screens,
files and commits the immutable pair with a plain subject and runs the plan
check. No ad hoc receipt code is needed.

The default pass scope judges orders created or changed by the latest dated
planning pass, plus the sequence; unchanged orders carry their latest verdict
by hash. The receipt records scope, carried identities and dispatch-to-file
wall-clock. The pass budget is 120 seconds unless a dated acceptance applies.
Full scope judges every order. Independence remains session-attested; no
unknown model setting becomes readback.

After drafting, commit the planning subject locally. An external refuter is
still available through `npm run plan -- refute --transport <name>`; its
transport failure includes the CLI exit code and stderr. Direct and external
judgments retain the same hold and disposition rules. Finish with
`npm run test:docs`: index, publication, formatting and plan checks, with no
build or code suites. The [receipt convention](../planning/refutations/README.md)
details the result and provenance contracts.

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
receipt. The latest receipt remains bound to its original committed subject.
The continuing-work gate compares both HEAD and workspace inputs with it,
admitting only an assigned release placeholder, appended execution-record
sections, and appended dated reassessments of existing capability ids for
orders in that reviewed sequence. It reports these execution updates separately;
they are not a fresh planning verdict. Existing text and rows, objectives,
criteria, dependencies, non-goals, sequence, vision and roles still require a
matching refutation when changed. Producing a new receipt still requires its
complete committed subject and an identical workspace. Earlier receipts keep
their judged revisions, with unresolved holds carried through the receipt chain.
WO-126 has one explicit contract-adoption exception: the exact
legacy-unavailable Cost declaration may be inserted after an existing order
heading without rewriting its prior verdict. It claims no measured reduction;
new refutations judge that missing evidence. Arbitrary headers and substantive
authority edits remain outside this exception.
The six manual redirect receipts are
pre-mechanism evidence and are never rewritten or re-run by this gate.

Standard artifacts, all doc-only:

- a compaction-safety capture of the dispatch in ignored intake;
- one dated ledger section for the pass (and one for any ideation batch);
- the sequence revision and scoped map rationale, tracks, preflight, candidates,
  catalog rows and provenance;
- a blinded refutation receipt pair under `docs/planning/refutations/`,
  produced by `npm run plan -- refute` or the direct-session form, with all
  holds answered through the checked disposition chain or attributed
  override events;
- zero or more planner-synthesized work-order drafts, each with `Model:` and
  three-role `Effort:` lines, a `Cost:` header naming additions and removals in
  wall-clock, context bytes, commands, tokens and steps, provenance, a dated
  observed gap, acceptance
  criteria, evidence, non-goals, and operator-review assumptions;
- product-doc write-back for durable understanding, with the publication
  index and edition locks repaired in the same pass;
- `npm run meta -- --plan-cost` refreshes the bounded, subject-hashed cost
  table after the subject revision. It carries dated acceptances, latest meter
  rows and trap signals; stale evidence refuses. Missing cost or added process
  without a removal or dated acceptance produces a structural hold;
- `npm run work-orders -- index` regenerated and `npm run test:docs` green.
  A document-only pass runs no code suite.

A planning pass never activates, implements, tags, publishes, merges, edits
immutable evidence, or reopens a decision without its stated evidence or
operator direction. A planning pass also
never certifies its own direction: the refutation receipt is the pass's
independent verification, on the same implementer-is-not-verifier rule that
governs code, and the 2026-09-06 redirect records what a pass without one
produced. A code or configuration
change it identifies becomes a work order or a named boy-scout item for the
next activation. Its output lands through the ordinary pull request from a
planning branch, since `main` requires one; the `:memo:` title rule applies.

### Retained planning follow-ups

The pending feed is returned by `plan start`; `npm run plan -- followups`
reopens it. Follow `next` for more rows and use `--show <FUP-id>` to inspect one
record. Changed items, explicit open items and deferrals precede the untriaged
migration. Unchosen items persist; allocation, deferral, rejection and duplicates
retain reasons and source history. New nominations use formal candidate headings
or sourced decision records and sync in the same pass with `npm run meta`.

Read the [follow-up procedure](../planning/followups.md) when recording a
choice or reconciling a source change. The metadata and document gates check
freshness; executor deferrals need a checked public FUP destination. Neither the
feed nor a disposition grants work-order activation authority.

## Candidate — planner startup context

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

## Candidate — recurring review of implementation alternatives

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
[Tinkerer / Scientist support](05-pattern-library.md#candidate--tinkerer--scientist)
that sometimes turns the relevant question, input or proposed response into a
small experiment. A separate support modifier may tune activation rate. This
provides a candidate behavioral mechanism for the review question above; it
does not settle its cadence or imply every answer must run an A/B test.
The second proposed behavior is
[historical comparison after a forced alternative](05-pattern-library.md#candidate--historical-comparison-after-a-forced-alternative):
when a constraint or decision produces another method with roughly the same
purpose, retain comparable observations even if the immediate choice is settled.
Automatic activation versus optional equipment remains open. This records the
benefit obtained incidentally in WO-126 as an intentional future behavior.

## Candidate — cold-gate structural cuts

The 2026-09-12 planning pass declined to allocate the structural cuts that
the relayed proof-carrying-gates plan proposed for the one fresh full gate,
because their benefit is unmeasured until the gate's critical path is
recorded. The 2026-09-12T16:08Z fresh gate ran 475 s of wall-clock over
1,229 s of task time: the two exclusive suites held it at concurrency one for
206 s, and perfect packing over the cap of four would take 307 s. WO-128
records each task's concurrent peers in the gate row; that trace is the entry
evidence for this candidate.

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

## Candidate — refutation pass worth its cost

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

## Workflow closeout and releases

Final review prepares and publishes a clean PR; the operator retains merge
authority. After the PR is merged, `resume: release close` runs the guarded
close command. It updates `main`, proves the reviewed branch is contained in
`origin/main`, and removes only its known worktree and merged branch. Ordinary
tracked or untracked dirt is refused by the clean-worktree gate. Ignored raw
material under `docs/intake/` is reconciled by the reviewed helper before
teardown. Non-disposable ignored files and directories under
`docs/control/local/` are archived with their relative structure in main's
ignored `docs/control/local/retained/WO-NNN/`, including adjacent-work records,
feedback evidence, process measurements, prototypes and the subject's terms
file. These records stay distinct from main's active state. Directory contents
and empty directories survive; differing file or directory collisions use a
`.from-WO-NNN` suffix, numbered when needed, without overwriting existing state.
Identical copies are reused on retry. The helper validates the whole plan and
refuses symlinks or destinations that would expose files through Git before
copying. Exclusive copies and final byte verification leave sources intact
until guarded teardown; an interrupted or corrupt partial copy is retained,
and a retry preserves the complete source at a collision path. Receipts show
paths, dispositions and byte counts, never private contents or content hashes.
`--dry-run` prints the plan without fetching, copying, deleting, running a gate
or publishing. Other non-disposable ignored material still refuses removal.
Known dependency/build outputs, `.runtime/` snapshots, `.control-beacons/`,
`.DS_Store`, `.tsbuildinfo` and `docs/control/local/harness/**` are disposable;
intake protection takes precedence over build-shaped names.

Main's release-influence guard permits `docs/intake/**`, all of
`docs/control/local/`, the exact `.claude/settings.local.json` and disposable
outputs. The subject's local files outside `harness/**`, and its settings file,
remain non-disposable. The helper archives the control records and continues
to refuse unknown ignored material, including that settings file. Main's
terms file and active local records stay intact. Gate evidence is handed off
through its existing merge helper, separately from archival; the retained
sources are rechecked immediately before teardown. If it refuses, report the
refusal; never write a closeout script.

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
source. It reuses successful `npm run test:full` evidence only for the exact
current Git tree; otherwise it runs the full gate. The manifest records tree
hash, duration and the evidence reference. Dependency installation is needed
only when execution lacks its installed dependencies. It proves evidence
leaves tracked files unchanged, populates and re-validates the
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
reuse or execute the full gate by tree hash; lower or already-published targets return
after their own validation. Under `--publish`, GitHub CLI availability and
authentication are checked before tag-object creation. If GitHub Release
creation fails after the validated tag was pushed, the command exits non-zero,
leaves that immutable tag intact, and names the recoverable state. Rerunning the
same close command validates the equal tag byte for byte, creates the missing
Release, or refuses at the first differing body line; it never edits the
Release. Equal-tag retries apply the same exact-tree evidence predicate before
re-deriving compatibility; ignored built output is not evidence. Legacy tags
retain their historical four-command manifest contract.
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

- **Compose adjacent repair with decision evidence (operator default,
  2026-09-08).** The executor/fixer equips [Adjacent Repair and Decision
  Receipts](05-pattern-library.md#executor-supports-adjacent-repair-and-decision-receipts)
  independently. Adjacent Repair prefers a bounded fix to an encountered bug;
  neither pre-existing origin nor omission from the original assignment is by
  itself a reason to defer. Decision Receipts records the chosen option,
  evidence, rationale, rejected options and reasons, plus the reversal condition
  for a deferral. Decide and continue within the authorized effects; ordinary
  scope judgment is not a new operator approval step. The existing bounded Boy
  Scout, permission and verification supports retain their limits. Evidence of
  ambiguity, excessive risk, an unrelated change or missing authority can still
  justify a named deferral; merely noticing imperfection does not require work.
  Follow-up Queue records a diagnosed fix as next work, Intent to Act announces
  the concrete intended action in chat, and Operator Check-In supplies a safe
  steering opportunity before the next queued item. Apply veto, priority, scope,
  known-issue and deferral messages before dispatch; a queue change invalidates
  the prior check-in. Do not cancel an in-flight tool call to poll or wait
  indefinitely for approval. The current queue is observed with
  `npm run adjacent -- list`; its chat and channel observations are actor-attested.
  Equipped duties run at entry, including the initial Intent to Act announcement.
  Ordinary `next`/`fix` projects installed equipment and queue state without
  requiring a named-support prompt. Completion refuses queued/running items;
  complete them or record an explicit disposition, with a public FUP for deferrals.
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
- **Decided means sourced, not frozen (operator correction, 2026-09-09).**
  A decision record names the operator dispatch that made it and the
  condition that reopens it. Do not relitigate a decision for lack of new
  material; reopen it when evidence the meter or a session records bears on
  that condition, or when the operator says so, and reopen it as a new
  decision record proposal, never an in-place edit. A rule that a decision
  can never be revisited is inertia written into the repository and is
  itself the defect; the idea-ledger Resolutions and `docs/decisions/` close
  questions on their recorded terms, not forever. Exception:
  each ADR carries an appendable **Amendments** section for notes within the
  decided constraints (a dev-dependency, a tooling choice) — appending there is
  not an edit of the decision.
- **Precedence.** When a work order's authority clause conflicts with a standing
  duty in this guide, the work order wins; note the skipped duty in your result
  as an open question. Doc-only work lands directly on the working branch the
  operator gave you — code goes to worktrees/branches per the isolation rule.
- **Decision write-back.** Lifecycle decisions and corrections go in
  `docs/evidence/WO-NNN/decisions.md` with dispatch source, evidence, rejected
  alternatives and reopening condition; `npm run meta` builds the decisions
  index and reopen candidates. Update affected product docs in the same pass.
  The ledger is for operator ideation and planning synthesis. An inherited
  pre-2026-09-09 ledger-entry duty is discharged by the decisions file and its
  index row; the work-order index marks this substitution. WO-084 retains its
  separately authorized byte-preserving historical migration.
- **Isolation.** The main checkout is the control plane. Model-authored code
  changes happen on branches/worktrees; verify `pwd` and repo root before any
  git operation. One writer per worktree is enforced by the generated hook's
  reservation, keyed by the session and its harness process. A session refused
  for a foreign reservation runs `node scripts/harness.mjs writer --show` to
  name the holder: a dead holder is reclaimed automatically at the next write
  and two sessions racing for the same dead holder admit exactly one writer,
  a live one must finish, and an operator releases a stuck one from a terminal
  outside any governed session with `node scripts/harness.mjs writer --release`
  (`--force` only for a live owner; a release acts only on the holder it
  judged). Never widen the metadata allowlist to lifecycle commands to get
  past it.
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
- **A question is not a waiver (operator correction, 2026-09-07).** An
  operator's question, confusion, or complaint about cost or time changes no
  obligation. Answer it in plain terms, then continue the work under the
  standard already in force; only an explicit operator decision lowers a
  standard, drops a check, or narrows scope. Treating a question as permission
  to stop pursuing a green gate, skip a check, or accept a weaker result is the
  behavior this correction names, and it is the same failure whether the
  question sounds annoyed or curious. If the standard seems wrong, say so in
  one sentence and keep working under it until the operator decides.
  The 2026-09-10 correction also applies to a question labeled "conversation
  only": answer conversationally and continue the active implementation;
  pausing requires an explicit request to pause or stop
  ([WO-126-D019](../evidence/WO-126/decisions.md#wo-126-d019)).
- **Process budget (operator correction, 2026-09-09).** Every gate must be
  cheaper than the failure it prevents, and the repository's own records
  decide. Hard enforcement lives in the lifecycle commands, which check
  evidence; a hook that fires at turn end advises in one line and never
  blocks. A read obligation covers what the session wrote or regenerated,
  minus generated artifacts and oversized files, which owe a check instead;
  inherited bytes owe nothing. A full gate runs once per tree hash and its
  evidence is reused by hash at every later step including the tag; the fast
  gate is for iteration. No session writes a closeout script; if a helper
  refuses, report the refusal. Any size, duration or count that grows from
  one order to the next past its budget needs a dated operator acceptance,
  or the fast gate fails. A finding that would otherwise become a
  nomination gets a criterion in the order that found it. The standing
  questions for every process, asked by the repository through the meter,
  the order template, the refuter and the role skills, never by the
  operator: how do we make this quicker; how do we make this take less
  context; how do we make this consume fewer resources; how do we make a
  six-step process four steps and perform as well or better. A new user
  must never find the simplest action the most expensive in time, resources
  or context. Data the repository generates or collects is kept when it
  materially informs a later decision, whatever it costs to produce, and
  cut only when nothing decides on it; cost alone never removes a record,
  and annoyance is not the test (operator clarification, 2026-09-09). The
  lens for the process itself is Meadows' system traps, five of which the
  operator named as live here on 2026-09-09: rule beating, seeking the
  wrong goal, shifting the burden to the intervenor, drift to low
  performance, and policy resistance. Each has a signal in the repository's
  own data and the meter reports them per order; a session that satisfies
  a gate against its purpose, optimizes a proxy, leans on the operator,
  sizes against the previous instance, or works around a rule is in one of
  them. Save observed runtime and token usage with their source in evidence;
  never repeat unmeasured-cost boilerplate in operator updates (operator correction, 2026-09-11;
  [WO-127-D003](../evidence/WO-127/decisions.md#wo-127-d003)).
  `npm run meta` reports available observations and previous-order deltas
  for all six dispatch kinds; three consecutive worsening order deltas nominate
  a trap for reopening. Historical gaps stay historical. The fast gate
  checks `docs/control/budgets.json`; token, dollar and PR-body ceilings remain
  unset under the operator's same-day direction to collect usage first.
  `release prepare` inserts the meter table into PR.md, and status prints one
  health line. The first WO-126 observation remains its immutable baseline.
  The operator's later 2026-09-11 correction makes token collection mandatory:
  both Codex and Claude record usable counters, so a new session must measure
  them rather than report null or claim they are untracked. The explicit
  adapter runs `node scripts/harness.mjs usage <session>` after session entry
  and before handoff; Claude's Stop hook also reads its actual transcript.
  The collector matches session identity and physical worktree, records numeric
  totals with source, time and scope, and refuses absent or mismatched counters.
  The four lifecycle completion actions recollect them before appending; a
  missing measurement cannot produce a completed handoff. Planning, refutation
  and release-close follow the same entry/handoff measurement duty through
  their generated role instructions. Resolve a collection failure before
  reporting completion. Do not substitute another session or invent zero.
  Codex cached input is already included in its input count; Claude cache reads
  and cache writes are added to uncached input and output. Duplicate Claude
  message IDs count once. These totals are usage, not context-window occupancy
  or a billing estimate. Transcript text, raw session IDs and paths stay local.
  An unreported price may remain absent; that never excuses absent token counts.
  VER-002 F5's 2026-09-11 correction replaces the partial implementation window
  with its source-reproduced completion window through append-only reconciliation.
  The two earlier executor handoffs total 40,706,766 tokens; retained post-handoff
  readings bring those dispatches to 41,353,517. A meter snapshot must identify
  its observation cutoff; refreshing it from partial rows does not establish
  completed-dispatch usage. See the [reconciliation](../evidence/WO-043/usage-reconciliation-002.json).
  See [WO-043's breakout receipt](../evidence/WO-043/ideation-commands-and-usage.md).
  The operator's later same-day ideation preserves
  [all eight system traps](05-pattern-library.md#candidate--all-eight-system-traps-as-a-design-lens)
  as a broader design lens, adding commons depletion, escalation and success to
  the successful to the candidate analysis. The five existing meter rows remain
  the implemented scope. Correlated observations invite diagnosis and a bounded
  comparison; they do not alone establish a trap's causal loop or authorize a
  new gate. Whole-file output review remains a candidate for that comparison.
  The operator later authorized suite-input evidence reuse in WO-126; its
  exact-tree aggregate retains the completion guard described below.
  The meter also reports authorship-snapshot count, total and mean duration,
  bytes hashed and subprocess count per order and dispatch. Claude's writing
  tools take a before and after snapshot; explicit Codex observations are
  batched and labeled. Snapshot means are not per-tool or whole-hook latency.
  The original WO-126 Cost estimate omitted this recurring work; its execution
  cost correction and VER-001 F6 preserve that omission and the measured cost.
- **Write once, run once (operator correction, 2026-09-10).** A report,
  receipt or record is written after every measurement it cites is in hand
  and every claim in it has been checked, and the evidence gate runs once, at
  the final tree, after its last byte. No cosmetic edit follows the gate; an
  edit the gate has already paid for is a defect of the session, not a reason
  for another run. The VER-003 session paid two extra gate runs and a repeated
  whole-file receipt read for one report because it wrote, measured, edited
  and re-ran; the operator's correction sets that level. The mechanism half
  belongs in the shared instructions and runner. The operator's later
  correction rejects treating a recurring loop as one session's mistake:
  use `npm run harness -- evidence` as the single completion command,
  supplying full and diff evidence and retaining their actual identities.
  Finish measurements, authored reports and explicit release or evidence
  editions first; a turn end alone does not require a fast gate. The canonical
  evidence command builds, refreshes the work-order index, decisions index,
  follow-up register and generated harness, then fingerprints the prepared tree.
  Those generators leave unchanged bytes and modification times alone. The
  preparation owns no historical evidence, planning-cost observation, publication
  source lock or release target. Their source review remains explicit. All
  package tests and fixtures wait for successful preflights, so a preparation
  refusal cannot start expensive tests in parallel. Direct test commands and
  `harness check` remain validation-only ([WO-127-D007](../evidence/WO-127/decisions.md#wo-127-d007)).
  **Gate input protection (operator clarification, 2026-09-11):** live gate
  markers fence agent writes only where they could invalidate the run: the
  candidate Git tree, including tracked and non-ignored reports, and the
  installed dependencies and package build outputs included in suite snapshots.
  Ignored scratch and local observation writes outside those inputs remain
  eligible under existing authority. Generated pre-tool hooks refuse Write,
  Edit and shell writes targeting protected inputs before dispatch, naming the
  active command and run. Shell destinations that cannot be classified remain
  conservatively refused; bounded ignored destinations and metadata reads stay
  available. The package evidence command marks its build, preparation and
  checks; direct runner and evidence calls mark their own lifetimes. Nested
  runs own independent markers, normal completion releases them, and an exited
  owner cannot block writes through a stale marker. PID birth observations
  distinguish reuse where the process table is available. The existing final
  input comparison remains necessary for unhooked edits and tool-boundary races
  ([WO-125-D003](../evidence/WO-125/decisions.md#wo-125-d003)).
  The VER-002 repair resolves physical path components, including dangling
  symlink targets and parent traversal after directory symlinks. Installed-root
  comparisons follow Git's case-insensitive setting, with native on-disk spelling
  for existing components. Shell destinations and working directories retain
  their traversal order. Link entries and physical targets are both checked, so
  ignored links into ignored scratch remain eligible. Held-stage fixtures use
  test-owned release and timeout cleanup instead of an expiring stage deadline
  ([WO-125-D004](../evidence/WO-125/decisions.md#wo-125-d004)).
  The VER-003 repair also protects existing non-directory destinations with
  multiple hard links: their other names may alias gate inputs. This deliberately
  includes multiply-linked scratch files; ordinary scratch remains eligible
  ([WO-125-D005](../evidence/WO-125/decisions.md#wo-125-d005)).
  After diagnosis, retry that command and reuse passing source checks whose
  inputs are unchanged. A failed verification or review records its
  reproduction and diff evidence without seeking a green application gate
  ([WO-126-D014](../evidence/WO-126/decisions.md#wo-126-d014),
  [WO-126-D018](../evidence/WO-126/decisions.md#wo-126-d018),
  [WO-126-D022](../evidence/WO-126/decisions.md#wo-126-d022)).
- **Build publication (operator decision, 2026-09-09).** Compile into staging
  with the existing Node toolchain, replace each complete output file atomically,
  and finish the build barrier before dependent application commands run.
  Ordinary `dist` can contain both generations during publication. Installed
  hooks use an immutable pinned runtime snapshot, published as a complete new
  directory, and remain callable while `dist` changes. Python is not a build
  prerequisite. The operator chose this boundary during `resume: fix` and
  requested retained comparison data for reconsideration if whole-directory
  exchange becomes necessary or Python is already a dependency. See
  [WO-126-D007](../evidence/WO-126/decisions.md#wo-126-d007) and the paired
  [publication measurements](../evidence/WO-126/build-comparison.json).
  Generated hooks consume piped JSON asynchronously, including UTF-8 characters
  split across chunks. WO-127's metadata trace located a stalled synchronous
  stdin read before hook evaluation. The repair retains fail-closed parsing,
  pinned-runtime validation and generated-process integration coverage
  ([WO-127-D006](../evidence/WO-127/decisions.md#wo-127-d006)).
- **Gate execution and reuse (operator decision, 2026-09-09).** The runner
  retains every suite owner and schedules 40 named release cases under the
  shared cap of four jobs, after a prepared fixture dependency. A sealed
  synthetic template supplies independent copies, with no shared writable
  refs; the license scenario and dedicated license fixtures retain real npm
  dry runs, while unrelated release cases use their explicit publication
  refusal double. Planning fixtures and the current planning check remain
  separate required tasks. Live progress names the running suite/case and
  elapsed time, with bounded line count and length. Reviewed input scopes may
  reuse executed successes across unrelated document edits. Other declared
  source checks can reuse the complete candidate tree, environment and runtime
  when all are unchanged. Build, fixture preparation and checks of live local
  terms, installed hooks or the meter still execute; unknown callers have no
  reuse grant. The original execution tree, time and duration remain visible.
  `npm run test:full -- --fresh` and `npm test -- --fresh` measure cold execution
  through the canonical entry points; ordinary invocations may compose
  evidence and label their fresh/reused task counts. The final aggregate still
  covers the exact current tree. Input hashing is measured filesystem work,
  not context bytes. Gate child environments retain the first occurrence of
  each exact `PATH` entry, removing repeated searches from nested npm without
  changing precedence or dropping unique, relative, empty or not-yet-existing
  entries. Compare the same invocation environment and check the harness
  wrapper separately; a direct runner observation is not automatically an npm
  timing observation. See [WO-126-D009](../evidence/WO-126/decisions.md#wo-126-d009)
  and the [invocation correction](../evidence/WO-126/decisions.md#wo-126-d010).
  VER-002's repair gives `harness-fixtures` and `process-debt` exclusive runs
  within the gate, while the independent console suite may overlap skeleton.
  It retains the same suite inventory, file-concurrency limit and global cap.
  Gate children and input fingerprints now share a declared environment;
  unknown variables and rotating proxy credentials are absent from both.
  Selected names, never values, accompany the input observations. This removes
  misses caused only by invocation metadata without hiding an input from the
  fingerprint. Hook process timings are separate from authorship snapshots;
  their journal rows add no subprocess or session-file read per hook. See
  [WO-126-D012](../evidence/WO-126/decisions.md#wo-126-d012) and the
  [repair measurements](../evidence/WO-126/repair-002.md).
  Package suites start after the build without waiting for generated-file
  preflights. Fixture suites retain those dependencies, and a failed preflight
  still fails the aggregate. This preserves the fast gate's critical path
  ([WO-126-D026](../evidence/WO-126/decisions.md#wo-126-d026)). Failed split cases
  retain their own addressed diagnostic logs through aggregation, so their
  names, execution metadata and output remain available without rerunning the
  gate ([WO-126-D025](../evidence/WO-126/decisions.md#wo-126-d025)). The existing
  hook timing row records each deny/block and, when supplied, a digest of the
  tool-use identity scoped to session, event and tool. The meter counts distinct
  invocations across hooks and repeated deliveries without retaining raw
  identities or command text. Historical or identity-free rows remain separate
  outcomes and may overcount commands; their missing correlation is not inferred
  from timestamps. Advisory Stop messages do not increment the signal
  ([WO-126-D024](../evidence/WO-126/decisions.md#wo-126-d024),
  [WO-126-D028](../evidence/WO-126/decisions.md#wo-126-d028)).
  **Measured 2026-09-12 (planning pass).** From the host's retained gate rows:
  after every lifecycle transition the next full gate executed all 78 tasks
  fresh, because the shared input key hashes every ref, `HEAD`, the checkout
  path and the CPU count, so a checkpoint ref invalidates suites that never
  read it; a document-only change still re-executes the whole-tree class of
  suites (243–419 s) while an identical tree composes in 41–47 s; and twelve
  fresh full gates failed on fixed wall-clock deadlines under load (`console`
  six, `plan-refutation:current` two, `harness-fixtures` two,
  `runner-fixtures` one) or on a tree changed during the run (two), each
  followed by a passing rerun. WO-128 to WO-130 carry the repairs: deadlines
  that survive load with D012's exclusivity re-measured, a suite key of
  declared inputs shared across sibling worktrees with explained misses, and
  execution of every narrowed suite inside a replica of its declared inputs,
  so that an undeclared file cannot influence any run (WO-130 and WO-131;
  validation by probing replicas was withdrawn at receipts 009 and 010 of
  the same pass). Until they land, the identity rule above is unchanged. WO-127-D007 later
  made every package test wait for the preflights again; the runner's
  dependency table, not the D026 sentence above, is the authority.
- **Return shape.** End with a compact result: what changed, evidence pointers,
  deviations from the work order, open questions. Terse; no narration theater,
  no apology theater.

## Model-specific notes

**Codex transport selection (WO-125, 2026-09-11):** the five
[observed CLI 0.154.0 rows](../discovery/codex-effort-2026-09-11.json)
accept `low`, `medium`, `high`, `xhigh` and `max` through
`-c model_reasoning_effort="<level>"`. The worker and plan-refuter transport
forwards the explicit request while ignoring user configuration. `unknown`
adds no effort override and preserves the existing launch. CLI `0.153.4`
remains eligible only for that historical `unknown` selection. The adapter
checks runtime membership in the five observed levels and requires an explicit
observed version; an omitted builder version is `unknown`. Unsupported effort
values and explicit levels on `0.153.4` refuse before launch with the discovery
record named. A CLI version outside the admitted profiles refuses at transport
construction ([WO-125-D003](../evidence/WO-125/decisions.md#wo-125-d003)).
No probe returned an effort field: the requested level is a `host-launch`
claim, with effective effort and model still `unknown`. This transport rule
does not change the separately sourced completion-actor attestations below.

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
  WO-126 records tokens and cost per dispatch through a separate observation
  channel: CLI usage/cost envelopes and interactive transcript counters. The
  collector preserves source, scope and unavailable values, never raw transcript
  text or a fabricated price. The time field itself remains unchanged.
- **Version-line attestation (WO-126):** `npm run discover -- harness` appends
  a bounded observation of the running CLI's major.minor line and newest patch,
  plus whether Claude's effort readback channel exists. Any patch on an
  observed line may retain its declared effort; an unobserved line records
  unknown and names the line. Session entry warns once when the observed CLI
  leaves the recorded line. WO-042's unknown attestation remains unchanged.
  Session detection prefers the explicit harness input, then the exposed
  running executable, then a matching ancestor executable from the host process
  table. A versioned Claude installation path supplies its observed version;
  on macOS, a bare version basename is accepted only for the `CLAUDE_PID`
  process verified in that ancestor chain. An unrelated numeric process name
  supplies no version evidence
  ([WO-126-D017](../evidence/WO-126/decisions.md#wo-126-d017));
  when a verified Claude ancestor has an opaque process name, a bounded `lsof`
  text-mapping probe can resolve its versioned executable. A supplied PID without
  ancestry is never probed, and ambiguous or unavailable mappings supply no
  version. A successful session observation is reused on later prompts; a changed
  explicit harness-version input can replace it
  ([WO-126-D021](../evidence/WO-126/decisions.md#wo-126-d021)).
  An unversioned absolute Claude executable is probed directly. PATH is the
  fallback when those channels are unavailable. Only the version and channel
  are recorded, not the process paths or arguments
  ([WO-126-D013](../evidence/WO-126/decisions.md#wo-126-d013)).
- Behavioral guidance rots across model generations; that is why it lives here
  as typed mechanisms and docs instead of prompts. If an instruction here fights
  your model's defaults (e.g., built-in verification), flag it in your result
  rather than ignoring it.
